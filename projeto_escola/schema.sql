-- ==========================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - UC8
-- PROJETO ESCOLA SIMPLIFICADO
-- ALUNA: RAQUELE
-- ==========================================

-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS db_escola 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE db_escola;

-- 2. Criação da Tabela de Turmas (DDL)
-- Representa a entidade Turma. Uma turma possui vários alunos (1:N)
CREATE TABLE IF NOT EXISTS turma (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 3. Criação da Tabela de Alunos (DDL)
-- Representa a entidade Aluno. Contém chave estrangeira apontando para a Turma.
CREATE TABLE IF NOT EXISTS aluno (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    id_turma INT NOT NULL,
    FOREIGN KEY (id_turma) REFERENCES turma(id_turma) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Carga Inicial de Dados (DML)
-- Insere registros básicos para testes de visualização
INSERT INTO turma (nome_turma) VALUES 
('Informática para Internet'),
('Desenvolvimento de Sistemas'),
('Redes de Computadores');

INSERT INTO aluno (nome, email, id_turma) VALUES
('Ana Silva', 'ana.silva@email.com', 1),
('Bruno Souza', 'bruno.souza@email.com', 2),
('Raquele Lima', 'raquele.lima@email.com', 1),
('Carlos Oliveira', 'carlos.oliveira@email.com', 3);
