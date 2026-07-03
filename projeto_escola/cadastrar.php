<?php
// ====================================================================
// FORMULÁRIO DE CADASTRO: INSERÇÃO DE ALUNOS (DML - INSERT INTO)
// Este arquivo carrega as turmas existentes e realiza a inserção.
// Foco no Indicador 5 e Boas Práticas de Segurança
// ====================================================================

require 'conexao.php';

$mensagem = '';
$sucesso = false;

try {
    // 1. Busca as turmas para preencher o select do formulário de forma dinâmica
    $sql_turmas = "SELECT * FROM turma ORDER BY nome_turma ASC";
    $turmas = $pdo->query($sql_turmas)->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Falha ao carregar as turmas: " . $e->getMessage());
}

// 2. Processa o envio do formulário via método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $id_turma = $_POST['id_turma'] ?? '';

    // Validação básica dos dados do formulário
    if (!empty($nome) && !empty($email) && !empty($id_turma)) {
        try {
            // Prepared Statement (Instrução Preparada) para evitar SQL Injection
            // Protege o banco de dados contra inserção de comandos maliciosos
            $sql_insert = "INSERT INTO aluno (nome, email, id_turma) VALUES (:nome, :email, :id_turma)";
            $stmt = $pdo->prepare($sql_insert);
            
            // Executa passando os parâmetros limpos de forma sanitizada
            $stmt->execute([
                ':nome' => $nome,
                ':email' => $email,
                ':id_turma' => $id_turma
            ]);

            // Define mensagem de sucesso e redireciona
            $sucesso = true;
            header("Location: index.php");
            exit;

        } catch (PDOException $e) {
            $mensagem = "Erro ao salvar o aluno no banco: " . $e->getMessage();
        }
    } else {
        $mensagem = "Por favor, preencha todos os campos obrigatórios.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Escola | Cadastrar Aluno</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <header class="main-header">
            <h1>Novo Cadastro</h1>
            <p class="subtitle">Insira os dados do aluno no sistema integrado</p>
        </header>

        <?php if (!empty($mensagem)): ?>
            <div class="alert <?= $sucesso ? 'alert-success' : 'alert-error' ?>">
                <?= htmlspecialchars($mensagem) ?>
            </div>
        <?php endif; ?>

        <section class="form-container">
            <form action="cadastrar.php" method="POST">
                <div class="form-group">
                    <label for="nome">Nome Completo:</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite o nome completo do aluno" required>
                </div>

                <div class="form-group">
                    <label for="email">E-mail do Aluno:</label>
                    <input type="email" id="email" name="email" placeholder="nome.sobrenome@email.com" required>
                </div>

                <div class="form-group">
                    <label for="id_turma">Turma:</label>
                    <select id="id_turma" name="id_turma" required>
                        <option value="">Selecione uma turma...</option>
                        <?php foreach ($turmas as $turma): ?>
                            <option value="<?= $turma['id_turma'] ?>">
                                <?= htmlspecialchars($turma['nome_turma']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar Aluno</button>
                    <a href="index.php" class="btn btn-secondary">Cancelar</a>
                </div>
            </form>
        </section>

        <footer>
            <p>Senac SP - Unidade Escolar de Recuperação</p>
        </footer>
    </div>
</body>
</html>
