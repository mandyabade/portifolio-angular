<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../conexao.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['erro' => 'Informe o ID da tecnologia.']);
    exit;
}

$sql = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias WHERE id = ? AND status = 'ativo'";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

$tecnologia = $stmt->fetch();

if (!$tecnologia) {
    echo json_encode(['erro' => 'Tecnologia não encontrada.']);
    exit;
}

echo json_encode($tecnologia);