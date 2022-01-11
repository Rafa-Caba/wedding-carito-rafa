<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

$id = $_POST['id'];
$confirm_status = $_POST['confirm_status'];

$conn = new mysqli('sql303.epizy.com', 'epiz_30791266', 'IW4ZLhnRZy', 'epiz_30791266_invitados_boda');
$conn->set_charset('utf8');

if ($conn->connect_errno) {
    $respuesta = ['error' => true];
} else {
    $nombre = $_POST['nombre'];
    $confirm_status = $_POST['confirm_status'];

    $stmt = $conn->prepare("UPDATE invitados SET confirm_status = ? WHERE id = ?");
    $stmt->bind_param("ss", $confirm_status, $id);
    $stmt->execute();

    if ($conn->affected_rows <= 0) {
        $respuesta = ['error' => true]; 
    }

    $respuesta = ['error' => 'No hubo errores!'];
}

echo json_encode($respuesta);