<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Use POST.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');

$erros = [];
if ($nome === '') $erros[] = 'O nome é obrigatório.';
if ($email === '') $erros[] = 'O e-mail é obrigatório.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erros[] = 'O e-mail é inválido.';
if (mb_strlen($mensagem) < 10) $erros[] = 'A mensagem deve conter 10+ caracteres.';

if (!empty($erros)) {
    http_response_code(400);
    echo json_encode(['erros' => $erros]);
    exit;
}

require __DIR__ . '/../conexao.php'; 
$sql = "INSERT INTO contatos (nome, email, mensagem)
        VALUES (:nome, :email, :mensagem)";
$stmt = $pdo->prepare($sql);
$stmt->execute([':nome' => $nome, ':email' => $email, ':mensagem' => $mensagem]);

http_response_code(201);
echo json_encode([
    'sucesso' => true,
    'id' => (int) $pdo->lastInsertId(),
    'mensagem' => 'Contato recebido com sucesso!'
]);