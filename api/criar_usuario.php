<?php

require_once __DIR__ . '/conexao.php';

$usuario = 'admin';
$senha = '123456';

$hash = password_hash(
    $senha,
    PASSWORD_DEFAULT
);

$pdo = conectar();

$stmt = $pdo->prepare(
    'INSERT INTO usuarios (usuario, senha)
     VALUES (:usuario, :senha)'
);

$stmt->execute([
    ':usuario' => $usuario,
    ':senha' => $hash
]);

echo 'Usuário criado com sucesso.';