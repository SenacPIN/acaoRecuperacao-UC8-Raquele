<?php
// ====================================================================
// ARQUIVO PRINCIPAL: LISTAGEM DE ALUNOS (DQL - SELECT COM INNER JOIN)
// Este arquivo realiza a consulta no banco de dados e exibe em tabela.
// Foco no Indicador 5 e 3
// ====================================================================

require 'conexao.php';

try {
    // Consulta SQL utilizando INNER JOIN para cruzar informações das duas tabelas.
    // Retorna os dados do aluno e o respectivo nome da turma de forma relacionada.
    $sql = "SELECT aluno.id_aluno, aluno.nome, aluno.email, turma.nome_turma 
            FROM aluno 
            INNER JOIN turma ON aluno.id_turma = turma.id_turma
            ORDER BY aluno.nome ASC";
            
    $stmt = $pdo->query($sql);
    
    // Recupera todos os registros correspondentes como um array associativo
    $alunos = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Falha na consulta de dados: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Escola | Lista de Alunos</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <header class="main-header">
            <h1>Controle de Alunos</h1>
            <p class="subtitle">Projeto Integrado Escola Simplificado - UC8</p>
        </header>

        <section class="actions">
            <a href="cadastrar.php" class="btn btn-primary">
                <span class="icon">+</span> Cadastrar Novo Aluno
            </a>
        </section>

        <section class="content-table">
            <?php if (count($alunos) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th width="80px">ID</th>
                            <th>Nome do Aluno</th>
                            <th>E-mail</th>
                            <th>Turma Matriculada</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($alunos as $aluno): ?>
                            <tr>
                                <td><strong><?= $aluno['id_aluno'] ?></strong></td>
                                <td><?= htmlspecialchars($aluno['nome']) ?></td>
                                <td><?= htmlspecialchars($aluno['email']) ?></td>
                                <td><span class="badge"><?= htmlspecialchars($aluno['nome_turma']) ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">
                    <p>Nenhum aluno cadastrado no momento.</p>
                </div>
            <?php endif; ?>
        </section>
        
        <footer>
            <p>Senac SP - Unidade Escolar de Recuperação</p>
        </footer>
    </div>
</body>
</html>
