# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Todo o conteúdo deste projeto (código, comentários, documentação, commits) deve ser escrito em português do Brasil (pt-BR).

## Visão Geral

Repositório com perguntas e material de estudo para entrevistas técnicas de Java. Ainda em fase inicial, sem código-fonte ou sistema de build configurado.

## Estrutura do Projeto

As perguntas ficam em `entrevista-java/` (fonte única de verdade), organizadas por categoria. O Docusaurus lê diretamente desta pasta — **não existe duplicação**.

```
entrevista-java/
├── intro.md                                # Página inicial do site
├── java-core/                              # Java Core (seções 1-8)
│   ├── _category_.json
│   ├── 1-fundamentos.md
│   ├── 2-orientacao-objetos.md
│   ├── 3-tratamento-excecoes.md
│   ├── 4-collections.md
│   ├── 5-java-moderno.md
│   ├── 6-multithreading.md
│   ├── 7-generics.md
│   └── 8-testes.md
├── spring-boot/                            # Spring Boot (seções 9-13)
├── jpa-hibernate/                          # JPA e Hibernate (seções 14-18)
├── sql-bancos-dados/                       # SQL e Bancos de Dados (seções 19-20)
├── ferramentas/                            # Maven e GIT (seções 21-22)
└── praticas-profissionais/                 # Troubleshooting, Code Review, Docs (seções 23-25)
```

Cada pergunta usa `###` como header e é numerada de forma incremental **dentro do seu domínio** (ex.: a primeira pergunta de cada arquivo é sempre 1). Os arquivos possuem frontmatter YAML para o Docusaurus.

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

### Fonte única

O Docusaurus lê diretamente de `entrevista-java/` (configurado via `docs.path: '../entrevista-java'`). Não existe pasta `website/docs/` — edite apenas os arquivos em `entrevista-java/`.

O `npm run start` faz **live reload**: qualquer alteração nos arquivos `.md` recarrega a página automaticamente.

O formato Markdown é configurado como `md` (não MDX) para compatibilidade com generics Java (`<T>`, `ResponseEntity<T>`, etc.).

## Sistema de Build

Nenhum sistema de build Java (Maven/Gradle) configurado ainda. Quando adicionado, atualizar esta seção com os comandos de build, teste e execução.
