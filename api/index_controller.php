<?php

function get_invitations($params) {
    $code = $params['code'] ?? null;

    $path = __DIR__ . '/../data/inviter_with_codes.json';
    $content = file_get_contents($path);
    if ($content === false) {
        throw new Exception("Fichier des invités introuvable");
    }
    $entries = json_decode($content, true);
    if (!is_array($entries)) {
        throw new Exception("Le format du fichier des invités est invalide");
    }
    if (empty($code)) {
        return $entries;
    }
    foreach ($entries as $entry) {
        if (isset($entry['invite_code']) && $entry['invite_code'] === $code) {
            return $entry;
        }
    }
    throw new Exception("Aucune invitation trouvée pour ce code");
}

function post_invitation_status($params , $data) {
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

function get_voueux($params) {
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

function post_voueux($params , $data) {
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

function post_upload($params, $data) {
    $inviteName = $data['invite_name'] ?? '';
    
    if (empty($inviteName)) {
        throw new Exception("Le nom de l'invité est requis");
    }
    
    if (!isset($data['files']) || empty($data['files'])) {
        throw new Exception("Aucun fichier envoyé");
    }
    
    $file = $data['files']['files'];
    // Vérifier les erreurs d'upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Erreur lors de l'upload du fichier");
    }
    
    // Vérifier le type MIME (images et vidéos uniquement)
    $allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime', 'video/avi'
    ];
    
    $mimeType = mime_content_type($file['tmp_name']);
    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception("Type de fichier non autorisé. Seules les images et vidéos sont acceptées.");
    }
    
    // Créer le dossier uploads s'il n'existe pas
    $uploadDir = __DIR__ . '/uploads/media/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Générer un nom unique
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $uniqueId = uniqid() . '_' . bin2hex(random_bytes(4));
    $sanitizedInviteName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $inviteName);
    $newFileName = $sanitizedInviteName . '--' . $uniqueId . '.' . $extension;
    
    // Déplacer le fichier
    $destination = $uploadDir . $newFileName;
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception("Erreur lors de l'enregistrement du fichier");
    }
    
    return [
        'success' => true,
        'filename' => $newFileName,
        'message' => 'Fichier uploadé avec succès'
    ];
}

function get_media($params) {
    $uploadDir = __DIR__ . '/uploads/media/';
    
    if (!is_dir($uploadDir)) {
        return [];
    }
    
    $files = scandir($uploadDir);
    $mediaList = [];
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        $filePath = $uploadDir . $file;
        
        if (!is_file($filePath)) {
            continue;
        }
        
        // Extraire le nom de l'invité du nom de fichier (format: nom_invite--unique_id.ext)
        $parts = explode('--', pathinfo($file, PATHINFO_FILENAME));
        $inviteName = str_replace('_', ' ', $parts[0] ?? 'Inconnu');
        
        // Obtenir le type MIME
        $mimeType = mime_content_type($filePath);
        
        // Déterminer le type de fichier (image ou video)
        $fileType = 'unknown';
        if (strpos($mimeType, 'image/') === 0) {
            $fileType = 'image';
        } elseif (strpos($mimeType, 'video/') === 0) {
            $fileType = 'video';
        }
        
        // Date de création
        $createdAt = date('Y-m-d H:i:s', filemtime($filePath));
        
        $mediaList[] = [
            'invite_name' => $inviteName,
            'path' => 'api/uploads/media/' . $file,
            'filename' => $file,
            'created_at' => $createdAt,
            'mime_type' => $mimeType,
            'file_type' => $fileType
        ];
    }
    
    // Trier par date de création (plus récent en premier)
    usort($mediaList, function($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });
    
    return $mediaList;
}