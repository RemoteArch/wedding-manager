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

// Convertit warnings/notices en exceptions
set_error_handler(function ($severity, $message, $file, $line) {
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

// Log les fatal errors
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
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Max-Age: 86400");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") dieJson([], true);

$methodHTTP = $_SERVER["REQUEST_METHOD"];
$methodPrefix = strtolower($methodHTTP) . "_";

// ---------------------------
// ROUTE HELPERS
// ---------------------------
function normalizeRouteName(string $route) {
    $route = str_replace(["-", "."], "_", $route);
    return strtolower($route);
}

function isValidName(?string $s): bool {
    if ($s === null || $s === '') return true;
    return (bool)preg_match('/^[a-zA-Z0-9_]+$/', $s);
}

function controllerExists(string $name): bool {
    return file_exists(__DIR__ . "/" . $name . "_controller.php");
}

/**
 * Charge un controller et vérifie si une fonction METHOD_<route> existe dans ce fichier.
 * Exemple: GET + route "index" => get_index()
 */
function loadAndHasMethodFunction(string $controllerFile, string $methodPrefix, string $route): bool {
    require_once $controllerFile;

    $all = get_defined_functions()['user'];
    foreach ($all as $fn) {
        if (!str_starts_with($fn, $methodPrefix)) continue;

        $ref = new ReflectionFunction($fn);
        if ($ref->getFileName() !== realpath($controllerFile)) continue;

        $clean = substr($fn, strlen($methodPrefix));
        if (normalizeRouteName($clean) === normalizeRouteName($route)) {
            return true;
        }
    }
    return false;
}

// ---------------------------
// PARSE URL -> segments (retire le dossier du script + index.php)
// ---------------------------
$requestPath = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH) ?? '';

// 1) Retirer le "base path" où se trouve index.php (ex: /api)
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/'); // ex: "/api"
if ($scriptDir !== '' && $scriptDir !== '.' && str_starts_with($requestPath, $scriptDir)) {
    $requestPath = substr($requestPath, strlen($scriptDir));
}

// 2) Retirer index.php si présent (au début du path restant)
$requestPath = preg_replace('#^/index\.php(?:/|$)#', '/', $requestPath);

// 3) Normaliser (éviter //)
$requestPath = preg_replace('#/+#', '/', $requestPath);

// 4) Découper en segments
$segments = array_values(array_filter(explode("/", trim($requestPath, "/")), fn($s) => $s !== ''));

$count = count($segments);
$A = $count >= 2 ? $segments[$count - 2] : null; // avant-dernier
$B = $count >= 1 ? $segments[$count - 1] : null; // dernier

// Sécurisation segments
if (!isValidName($A) || !isValidName($B)) {
    dieJson("Invalid route", false, 400);
}

// ---------------------------
// SELECTION controller + function
// ---------------------------
$finalControllerFile = null;
$finalFunction = null;

// CAS >= 2 segments : A = fichier, B = fonction
if ($count >= 2) {
    if (controllerExists($A)) {
        $finalControllerFile = __DIR__ . "/" . $A . "_controller.php";
        $finalFunction = $B;
    } elseif (controllerExists($B)) {
        // fallback : dernier segment = controller, fonction = index
        $finalControllerFile = __DIR__ . "/" . $B . "_controller.php";
        $finalFunction = "index";
    }
}

// CAS 1 segment : B = controller, fonction = index
if ($finalControllerFile === null && $count === 1) {
    if (controllerExists($B)) {
        $finalControllerFile = __DIR__ . "/" . $B . "_controller.php";
        $finalFunction = "index";
    }
}

// FALLBACK index_controller.php
if ($finalControllerFile === null) {
    $indexFile = __DIR__ . "/index_controller.php";
    if (!file_exists($indexFile)) {
        dieJson("Route not found", false, 404);
    }

    // CAS 0 segment : uniquement index->index
    if ($count === 0) {
        if (loadAndHasMethodFunction($indexFile, $methodPrefix, "index")) {
            $finalControllerFile = $indexFile;
            $finalFunction = "index";
        } else {
            dieJson("Route not found", false, 404);
        }
    }
    // CAS >=1 : index->B sinon index->index
    else {
        if ($B !== null && loadAndHasMethodFunction($indexFile, $methodPrefix, $B)) {
            $finalControllerFile = $indexFile;
            $finalFunction = $B;
        } elseif (loadAndHasMethodFunction($indexFile, $methodPrefix, "index")) {
            $finalControllerFile = $indexFile;
            $finalFunction = "index";
        } else {
            dieJson("Route not found", false, 404);
        }
    }
}

// ---------------------------
// REQUIRE controller final
// ---------------------------
require_once $finalControllerFile;

// ---------------------------
// TROUVER LA VRAIE FONCTION DANS CE FICHIER (selon méthode HTTP)
// ---------------------------
$allFunctions = get_defined_functions()['user'];
$routeRequested = normalizeRouteName($finalFunction);
$fileFunctions = [];

foreach ($allFunctions as $fn) {
    $ref = new ReflectionFunction($fn);

    if ($ref->getFileName() !== realpath($finalControllerFile)) continue;

    if (str_starts_with($fn, $methodPrefix)) {
        $cleanFn = substr($fn, strlen($methodPrefix));
        $normalized = normalizeRouteName($cleanFn);

        if ($normalized === $routeRequested) {
            $fileFunctions[] = $fn;
        }
    }
}

if (empty($fileFunctions)) {
    dieJson("Function {$methodPrefix}{$finalFunction} not found", false, 404);
}

$realFunction = $fileFunctions[0];
$refFunc = new ReflectionFunction($realFunction);
$paramCount = $refFunc->getNumberOfParameters();

// --------------------------------------------------------
//  Vérification méthode HTTP vs paramCount
// --------------------------------------------------------
$methodAllowed = false;

if ($methodHTTP === "GET" || $methodHTTP === "DELETE") {
    if ($paramCount === 0 || $paramCount === 1) $methodAllowed = true;
} elseif ($methodHTTP === "POST" || $methodHTTP === "PUT") {
    if ($paramCount === 2) $methodAllowed = true;
}

if (!$methodAllowed) {
    dieJson("Method Not Allowed for $finalFunction using $methodHTTP", false, 405);
}

// --------------------------------------------------------
//  Préparation des paramètres
// --------------------------------------------------------
$params = $_GET;
$data = [];

if ($paramCount === 2) {
    $raw = file_get_contents("php://input");
    $jsonData = json_decode($raw, true);
    if (!is_array($jsonData)) $jsonData = [];
    $data = array_merge($jsonData, $_POST);

    if (!empty($_FILES)) {
        $data["files"] = $_FILES;
    }
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
        "controller" => $finalControllerFile,
        "function"   => $realFunction
    ], 'api.log');

    if ($paramCount === 0) {
        $result = $refFunc->invoke();
    } elseif ($paramCount === 1) {
        $result = $refFunc->invoke($params);
    } else {
        $result = $refFunc->invoke($params, $data);
    }

    dieJson($result, true, 200);

} catch (Throwable $e) {
    secureLog([
        "type"    => get_class($e),
        "message" => $e->getMessage(),
        "file"    => $e->getFile(),
        "line"    => $e->getLine(),
        "trace"   => $e->getTraceAsString()
    ], "errors.log");

    $code = (int)$e->getCode();
    if ($code < 100 || $code > 599) $code = 500;
    dieJson($e->getMessage(), false, $code);
}
