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

function all_invitations($params){
    $path = __DIR__ . '/../data/inviter_with_codes.json';
    $content = file_get_contents($path);
    if ($content === false) {
        throw new Exception("Fichier des invités introuvable");
    }
    $entries = json_decode($content, true);
    if (!is_array($entries)) {
        throw new Exception("Le format du fichier des invités est invalide");
    }
    return $entries;
}

function update_invitation_status($params , $data) {
    $code = $data['code'] ?? '';
    $status = $data['status'] ?? '';
    
    if (empty($code)) {
        throw new Exception("Le code de l'invitation est requis");
    }
    
    $path = __DIR__ . '/../data/inviter_with_codes.json';
    $content = file_get_contents($path);
    if ($content === false) {
        throw new Exception("Fichier des invités introuvable");
    }
    
    $entries = json_decode($content, true);
    if (!is_array($entries)) {
        throw new Exception("Le format du fichier des invités est invalide");
    }
    
    $found = false;
    foreach ($entries as &$entry) {
        if (isset($entry['invite_code']) && $entry['invite_code'] === $code) {
            $entry['status'] = $status;
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        throw new Exception("Aucune invitation trouvée pour ce code");
    }
    
    $result = file_put_contents($path, json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        throw new Exception("Erreur lors de la mise à jour du statut");
    }
    
    return ['success' => true, 'message' => 'Statut mis à jour avec succès'];
}

function read_voueux($params) {
    $path = __DIR__ . '/../data/voueux.json';
    if (!file_exists($path)) {
        return [];
    }
    $content = file_get_contents($path);
    if ($content === false) {
        return [];
    }
    $voueux = json_decode($content, true);
    if (!is_array($voueux)) {
        throw new Exception("Le format du fichier des vœux est invalide");
    }
    return $voueux;
}

function save_voueux($params , $data) {
    $nom = $data['name'] ?? '';
    $message = $data['message'] ?? '';
    
    if (empty($nom) || empty($message)) {
        throw new Exception("Le nom et le message sont requis");
    }
    
    $path = __DIR__ . '/../data/voueux.json';
    
    // Lire le fichier existant
    $voueux = [];
    if (file_exists($path)) {
        $content = file_get_contents($path);
        if ($content !== false) {
            $voueux = json_decode($content, true);
            if (!is_array($voueux)) {
                $voueux = [];
            }
        }
    }
    
    // Ajouter le nouveau vœu
    $voueux[] = [
        'nom' => $nom,
        'message' => $message,
        'date' => date('Y-m-d H:i:s')
    ];
    
    // Sauvegarder dans le fichier
    $result = file_put_contents($path, json_encode($voueux, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        throw new Exception("Erreur lors de l'enregistrement du vœu");
    }
    
    return ['success' => true, 'message' => 'Vœu enregistré avec succès'];
}

