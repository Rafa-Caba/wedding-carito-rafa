<?php

error_reporting(0);

header('Content-type: application/json; charset=utf-8');

$conn = new mysqli('us-cdbr-east-05.cleardb.net', 'beab1dc296be45', '8b23ea7f', 'heroku_0ed2c9f686450fa');

if ($conn->connect_errno) {
    $respuesta = ['error' => true];
} else {
    $conn->set_charset("utf8");
    $stmt = $conn->prepare("SELECT * FROM invitados");
    $stmt->execute();
    $resultados = $stmt->get_result();

    $respuesta = [];

    while ($fila = $resultados->fetch_assoc()) {
        $invitado = [
            'id'                => $fila['id'],
            'nombre'            => $fila['nombre'],
            'apellido'          => $fila['apellido'],
            'confirm_status'    => $fila['confirm_status'],
            'codigo_familia'    => $fila['codigo_familia'],
        ];
        
        array_push($respuesta, $invitado);
    }
}

echo json_encode($respuesta);