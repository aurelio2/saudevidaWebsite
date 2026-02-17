<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

require_once __DIR__ . '/connection.php';

if (!isset($mysqli) || !($mysqli instanceof mysqli)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection not available'
    ]);
    exit;
}

$mysqli->set_charset('utf8mb4');

$name = isset($_POST['name']) ? trim((string)$_POST['name']) : '';
$dateBirth = isset($_POST['dateBirth']) ? trim((string)$_POST['dateBirth']) : '';
$bi = isset($_POST['bi']) ? trim((string)$_POST['bi']) : '';
$province = isset($_POST['province']) ? trim((string)$_POST['province']) : '';
$city = isset($_POST['city']) ? trim((string)$_POST['city']) : '';
$neighborhood = isset($_POST['neighborhood']) ? trim((string)$_POST['neighborhood']) : '';
$phoneNumberRaw = isset($_POST['phoneNumber']) ? (string)$_POST['phoneNumber'] : '';
$phoneNumber = preg_replace('/\D+/', '', $phoneNumberRaw);
$iswhatsapp = isset($_POST['iswhatsapp']) ? (string)$_POST['iswhatsapp'] : '0';
$iswhatsappInt = ($iswhatsapp === '1' || strtolower($iswhatsapp) === 'true') ? 1 : 0;

$errors = [];

if ($name === '' || mb_strlen($name) > 50) $errors[] = 'Nome inválido';
if ($dateBirth === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateBirth)) $errors[] = 'Data de nascimento inválida';
if ($bi === '' || mb_strlen($bi) > 50) $errors[] = 'BI inválido';
if ($province === '' || mb_strlen($province) > 50) $errors[] = 'Província inválida';
if ($city === '' || mb_strlen($city) > 50) $errors[] = 'Cidade inválida';
if ($neighborhood === '' || mb_strlen($neighborhood) > 50) $errors[] = 'Bairro inválido';
if ($phoneNumber === '' || !preg_match('/^\d{9}$/', $phoneNumber)) $errors[] = 'Contacto inválido';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'error' => implode('; ', $errors)
    ]);
    exit;
}

$stmt = $mysqli->prepare('INSERT INTO patient (name, dateBirth, bi, province, city, neighborhood, phoneNumber, iswhatsapp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Prepare failed'
    ]);
    exit;
}

$stmt->bind_param('sssssssi', $name, $dateBirth, $bi, $province, $city, $neighborhood, $phoneNumber, $iswhatsappInt);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Insert failed'
    ]);
    $stmt->close();
    exit;
}

$newId = $stmt->insert_id;
$stmt->close();

echo json_encode([
    'success' => true,
    'id' => $newId
]);
