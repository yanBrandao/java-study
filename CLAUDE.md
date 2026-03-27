# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Todo o conteúdo deste projeto (código, comentários, documentação, commits) deve ser escrito em português do Brasil (pt-BR).

## Visão Geral

Repositório com perguntas e material de estudo para entrevistas técnicas de Java. Ainda em fase inicial, sem código-fonte ou sistema de build configurado.

## Estrutura do Projeto

As perguntas estão organizadas na pasta `entrevista-java/`, onde cada subpasta representa um domínio com numeração própria (começando em 1):

```
entrevista-java/
├── 1-fundamentos/README.md            # Fundamentos da Linguagem Java (15 perguntas)
├── 2-orientacao-objetos/README.md      # Orientação a Objetos - OOP (12 perguntas)
├── 3-tratamento-excecoes/README.md     # Tratamento de Exceções (8 perguntas)
├── 4-collections/README.md             # Collections Framework (14 perguntas)
├── 5-java-moderno/README.md            # Java 8+ Recursos Modernos (14 perguntas)
├── 6-multithreading/README.md          # Multithreading e Concorrência (14 perguntas)
├── 7-generics/README.md                # Generics (5 perguntas)
├── 8-testes/README.md                  # Testes (5 perguntas)
├── 9-spring-basico/README.md           # Conceitos Básicos do Spring (7 perguntas)
├── 10-beans-configuracao/README.md     # Beans e Configuração (8 perguntas)
├── 11-api-rest/README.md               # API REST com Spring Boot (9 perguntas)
├── 12-spring-security/README.md        # Spring Security (6 perguntas)
├── 13-spring-boot-avancado/README.md   # Spring Boot Avançado (10 perguntas)
├── 14-jpa-hibernate-fundamentos/README.md # Conceitos Fundamentais de JPA/Hibernate (6 perguntas)
├── 15-mapeamento-entidades/README.md   # Mapeamento de Entidades (9 perguntas)
├── 16-consultas-performance/README.md  # Consultas e Performance (8 perguntas)
├── 17-transacoes-estados/README.md     # Transações e Estados de Entidade (6 perguntas)
├── 18-spring-data-jpa/README.md        # Spring Data JPA (7 perguntas)
├── 19-sql-fundamentos/README.md        # Fundamentos de SQL (10 perguntas)
├── 20-modelagem-rdbms/README.md        # Modelagem e RDBMS (10 perguntas)
├── 21-maven/README.md                  # Maven (14 perguntas)
├── 22-git/README.md                    # GIT (14 perguntas)
├── 23-troubleshooting/README.md        # Troubleshooting e Debug (11 perguntas)
├── 24-code-review/README.md            # Code Review e Boas Práticas (11 perguntas)
└── 25-documentacao/README.md           # Documentação Técnica (10 perguntas)
```

Cada pergunta é numerada de forma incremental **dentro do seu domínio** (ex.: a primeira pergunta de cada README é sempre 1).

## Revisão de Respostas

Ao revisar as respostas do usuário, as correções devem ser didáticas e bem explicadas, com exemplos práticos quando possível. Usar o formato:
- **[Correto]** - resposta está correta
- **[Parcial]** - resposta tem a ideia certa mas precisa de complemento
- **[Incorreto]** - resposta está errada e precisa ser corrigida
- **[Não respondida]** - usuário não soube responder

Manter a resposta original do usuário e adicionar a correção/complemento logo abaixo.

## Docusaurus (Website)

O projeto usa [Docusaurus](https://docusaurus.io/) para visualização e navegação das perguntas. Os arquivos do site ficam em `website/`.

### Comandos

```bash
cd website
npm install        # instalar dependências
npm run start      # servidor de desenvolvimento (localhost:3000)
npm run build      # build de produção
npm run serve      # servir build localmente
```

### Estrutura do site

Os docs em `website/docs/` são gerados a partir de `entrevista-java/` e agrupados por categoria:
- `java-core/` — Seções 1-8
- `spring-boot/` — Seções 9-13
- `jpa-hibernate/` — Seções 14-18
- `sql-bancos-dados/` — Seções 19-20
- `ferramentas/` — Seções 21-22
- `praticas-profissionais/` — Seções 23-25

O formato Markdown é configurado como `md` (não MDX) para compatibilidade com generics Java (`<T>`, `ResponseEntity<T>`, etc.).

## Sistema de Build

Nenhum sistema de build Java (Maven/Gradle) configurado ainda. Quando adicionado, atualizar esta seção com os comandos de build, teste e execução.
