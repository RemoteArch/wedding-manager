<?php

function find_invite_by_code($params) {
    $code = $params['code'] ?? 'MXTW3';
    $path = __DIR__ . '/../data/inviter_with_codes.json';
    $content = file_get_contents($path);
    if ($content === false) {
        throw new Exception("Fichier des invités introuvable");
    }
    $entries = json_decode($content, true);
    if (!is_array($entries)) {
        throw new Exception("Le format du fichier des invités est invalide");
    }
    foreach ($entries as $entry) {
        if (isset($entry['invite_code']) && $entry['invite_code'] === $code) {
            return $entry;
        }
    }
    throw new Exception("Aucune invitation trouvée pour ce code");
}

function test() {
    return "test";
}