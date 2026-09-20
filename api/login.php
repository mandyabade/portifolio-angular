<?php

session_start();

header('Access-Control-Allow-Origin: https://jubilant-adventure-5g69x95p4gpwcvvgr-4200.app.github.dev');header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Método não permitido.'
    ]);

    exit;
}

require_once __DIR__ . '/../conexao.php';

$dados = json_decode(
    file_get_contents('php://input'),
    true
);

$usuario = trim($dados['usuario'] ?? '');
$senha = $dados['senha'] ?? '';

if ($usuario === '' || $senha === '') {

    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Informe usuário e senha.'
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare(
        'SELECT id, usuario, senha
         FROM usuarios
         WHERE usuario = :usuario
         LIMIT 1'
    );

    $stmt->execute([
        ':usuario' => $usuario
    ]);

    $usuarioBanco = $stmt->fetch(PDO::FETCH_ASSOC);

    if (
        !$usuarioBanco ||
        !password_verify($senha, $usuarioBanco['senha'])
    ) {

        http_response_code(401);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Usuário ou senha incorretos.'
        ]);

        exit;
    }

    session_regenerate_id(true);

    $_SESSION['usuario_id'] = $usuarioBanco['id'];
    $_SESSION['usuario'] = $usuarioBanco['usuario'];
    $_SESSION['logado'] = true;

    echo json_encode([
        'sucesso' => true
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro interno ao realizar login.'
    ]);
}