<?php
// ====================================================================
// ARQUIVO DE CONEXÃO DO BANCO DE DADOS (PDO)
// Este arquivo é responsável pela conexão da aplicação com o MySQL.
// Foco no Indicador 4
// ====================================================================

$host = 'localhost';
$dbname = 'db_escola';
$username = 'root';
$password = ''; // Por padrão, a senha no XAMPP é vazia.

try {
    // Criação do objeto PDO definindo o host, nome do banco de dados e codificação UTF-8
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // Configura o PDO para lançar exceções em caso de erros no banco de dados.
    // Isso facilita a identificação de falhas durante o desenvolvimento.
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    // Caso a conexão falhe, captura o erro e exibe uma mensagem amigável.
    // Evita expor detalhes críticos do servidor ao usuário em produção.
    die("Erro crítico ao conectar com o banco de dados: " . $e->getMessage());
}
?>
