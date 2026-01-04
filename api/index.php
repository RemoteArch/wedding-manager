<?php

require_once "config.php";

// ---------------------------
// CONFIG LOGS / ERREURS
// ---------------------------
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

$errLogDir = __DIR__ . "/logs";
if (!is_dir($errLogDir)) {
    mkdir($errLogDir, 0777, true);
}

$errLogFile = $errLogDir . "/" . date("Y-m-d") . "-error.log";
ini_set('error_log', $errLogFile);

// ---------------------------
// SETTINGS
// ---------------------------
set_time_limit(0);
date_default_timezone_set('Africa/Douala');

// ---------------------------
// LOG HELPER
// ---------------------------
function secureLog($message, $file = "system.log") {
    $dir = __DIR__ . "/logs";
    if (!is_dir($dir)) mkdir($dir, 0777, true);

    $path = $dir . "/" . date("Y-m-d") . "-$file";

    if (is_array($message) || is_object($message)) {
        $clean = json_encode($message, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        $clean = (string)$message;
    }

    file_put_contents($path, $clean . "\n", FILE_APPEND);
}

// ---------------------------
// HANDLERS: errors -> exceptions, uncaught, fatal
// ---------------------------

// Convertit warnings/notices en exceptions pour passer dans ton try/catch
set_error_handler(function ($severity, $message, $file, $line) {
    // Si l'erreur est masquée par @, ignorer
    if (!(error_reporting() & $severity)) return false;

    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Log toute exception non catchée
set_exception_handler(function ($e) {
    $msg = "[" . date("c") . "] UNCAUGHT " . get_class($e) . ": " . $e->getMessage() .
        " | " . $e->getFile() . ":" . $e->getLine() . "\n" .
        $e->getTraceAsString() . "\n\n";

    error_log($msg);

    if (!headers_sent()) {
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
    }
    echo json_encode(["success" => false, "message" => "Internal Server Error"], JSON_UNESCAPED_UNICODE);
    exit;
});

// Log les fatal errors (E_ERROR, E_PARSE, etc.)
register_shutdown_function(function () {
    $err = error_get_last();
    if (!$err) return;

    $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];
    if (!in_array($err['type'], $fatalTypes, true)) return;

    $msg = "[" . date("c") . "] FATAL ERROR: {$err['message']} | {$err['file']}:{$err['line']}\n\n";
    error_log($msg);

    if (!headers_sent()) {
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
    }
    echo json_encode(["success" => false, "message" => "Internal Server Error"], JSON_UNESCAPED_UNICODE);
    exit;
});

// ---------------------------
// JWT HELPERS
// ---------------------------
function b64($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64d($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload): string {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];

    $segments = [
        b64(json_encode($header)),
        b64(json_encode($payload))
    ];

    $signature = hash_hmac("sha256", implode('.', $segments), JWT_SECRET, true);
    $segments[] = b64($signature);

    return implode('.', $segments);
}

function jwt_decode(string $jwt) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;

    [$header64, $payload64, $signature64] = $parts;

    $expected = b64(hash_hmac("sha256", "$header64.$payload64", JWT_SECRET, true));
    if (!hash_equals($expected, $signature64)) return false;

    return json_decode(b64d($payload64), true);
}

// ---------------------------
// DB
// ---------------------------
class DB {
    private PDO $pdo;

    public function __construct(
        $host = DB_HOST,
        $port = DB_PORT,
        $username = DB_USER,
        $password = DB_PASS,
        $database = DB_NAME
    ) {
        $dsn = "mysql:host=".$host.";dbname=".$database.";port=".$port.";charset=utf8mb4";
        $this->pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
    }

    public function run(string $sql, array $params = []): array|bool {
        secureLog(["sql" => $sql, "params" => $params], "sql.log");

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        if (str_starts_with(trim(strtolower($sql)), "select")) {
            return $stmt->fetchAll();
        }

        return true;
    }
}

// ---------------------------
// AUTH USER
// ---------------------------
function get_user($token = null) {
    if (!isset($token) || $token === null) {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $token = $headers["Authorization"] ?? $headers["TOKEN"] ?? "";
    }

    if (str_starts_with($token, "Bearer ")) {
        $token = substr($token, 7);
    }

    $decoded = jwt_decode($token);
    if (!$decoded) throw new Exception("Token invalide", 401);

    return $decoded;
}

// ---------------------------
// JSON RESPONSE
// ---------------------------
function dieJson($data, $success = true, $statusCode = 200) {
    http_response_code($statusCode);
    header("Content-Type: application/json; charset=UTF-8");

    $response = ["success" => $success];

    if ($success) {
        $response["data"] = $data;
    } else {
        $response["message"] = $data;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
//  ROUTING FONCTIONNEL UNIQUEMENT (Pas de classes)
// --------------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Max-Age: 86400");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") dieJson([], true);

// Décomposer URL (sans query string)
$requestPath = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH) ?? '';
$requestPath = str_replace("/index.php", "", $requestPath);
$uri = explode("/", trim($requestPath, "/"));
$count = count($uri);

// Récupérer les 2 derniers segments
if ($count >= 2) {
    $file = $uri[$count - 2];
    $function = $uri[$count - 1];
} else {
    $file = $uri[0] ?? "";
    $function = "index";
}

// Sécurisation
if (!preg_match('/^[a-zA-Z0-9_]+$/', $file) || !preg_match('/^[a-zA-Z0-9_]+$/', $function)) {
    dieJson("Invalid route", false, 400);
}

// Préparation
$fileController = $file . "_controller.php";
$functionController = $function . "_controller.php";

$finalControllerFile = null;
$finalFunction = null;

// 1) file_controller.php
if (file_exists($fileController)) {
    $finalControllerFile = $fileController;
    $finalFunction = $function;
}
// 2) function_controller.php (fallback)
elseif (file_exists($functionController)) {
    $finalControllerFile = $functionController;
    $finalFunction = "index";
}
// 3) Aucun fichier trouvé
else {
    dieJson("Route not found", false, 404);
}

// Maintenant require
require_once $finalControllerFile;

// IMPORTANT → récupérer les fonctions après require
$allFunctions = get_defined_functions()['user'];

function normalizeRouteName(string $route) {
    $route = str_replace(["-", "."], "_", $route);
    return strtolower($route);
}

// Récupérer toutes les fonctions dans ce fichier
$routeRequested = normalizeRouteName($finalFunction);
$fileFunctions = [];

foreach ($allFunctions as $fn) {
    $ref = new ReflectionFunction($fn);

    // Vérifier le fichier
    if ($ref->getFileName() !== realpath($finalControllerFile)) continue;

    // Fonction PRIVÉE (commence par __) -> ignorée
    if (str_starts_with($fn, "__")) continue;

    // Nettoyer le nom interne
    $cleanFn = $fn;
    if (str_starts_with($fn, "_")) {
        $cleanFn = substr($fn, 1);
    }

    $normalized = normalizeRouteName($cleanFn);

    if ($normalized === $routeRequested) {
        $fileFunctions[] = $fn;
    }
}

if (empty($fileFunctions)) {
    dieJson("Function $finalFunction not found", false, 404);
}

$realFunction = $fileFunctions[0];
$refFunc = new ReflectionFunction($realFunction);
$paramCount = $refFunc->getNumberOfParameters();

// --------------------------------------------------------
//  Vérification méthode HTTP vs paramCount
// --------------------------------------------------------
$methodHTTP = $_SERVER["REQUEST_METHOD"];
$methodAllowed = false;

// GET + DELETE acceptent 0 ou 1 param
if ($methodHTTP === "GET" || $methodHTTP === "DELETE") {
    if ($paramCount === 0 || $paramCount === 1) $methodAllowed = true;
}
// POST + PUT doivent avoir 2 params
elseif ($methodHTTP === "POST" || $methodHTTP === "PUT") {
    if ($paramCount === 2) $methodAllowed = true;
}

if (!$methodAllowed) {
    dieJson("Method Not Allowed for $finalFunction using $methodHTTP", false, 405);
}

// --------------------------------------------------------
//  Préparation des paramètres
// --------------------------------------------------------
$queryParams = $_GET;

$raw = file_get_contents("php://input");
$jsonData = json_decode($raw, true);
if (!is_array($jsonData)) $jsonData = [];

$data = array_merge($jsonData, $_POST);

if (!empty($_FILES)) {
    $data["files"] = $_FILES;
}

// --------------------------------------------------------
//  APPEL DE LA FONCTION
// --------------------------------------------------------
try {
    secureLog([
        "url"     => $_SERVER["REQUEST_URI"],
        "method"  => $_SERVER["REQUEST_METHOD"],
        "params"  => $_GET,
        "data"    => $data,
        "headers" => function_exists('getallheaders') ? getallheaders() : [],
    ], 'api.log');

    if ($paramCount === 0) {
        $result = $refFunc->invoke();
    } elseif ($paramCount === 1) {
        $result = $refFunc->invoke($queryParams);
    } else {
        $result = $refFunc->invoke($queryParams, $data);
    }

    dieJson($result, true, 200);

} catch (Throwable $e) {
    // Log détaillé + trace
    secureLog([
        "type"    => get_class($e),
        "message" => $e->getMessage(),
        "file"    => $e->getFile(),
        "line"    => $e->getLine(),
        "trace"   => $e->getTraceAsString()
    ], "errors.log");

    $code = (int)$e->getCode();
    if ($code < 100 || $code > 599) $code = 500;

    // En prod tu peux laisser le message générique si tu préfères :
    // dieJson("Internal Server Error", false, $code);

    dieJson($e->getMessage(), false, $code);
}
