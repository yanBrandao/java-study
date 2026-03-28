---
sidebar_position: 8
title: "Testes"
---

# Testes

### 1. Qual a diferença entre testes unitários e testes de integração?

R: Testes unitários servem para testar a menor unidade de código, fazendo com que eles sejam coesos e não vão fugir daquele que é suposto realizar, já testes de integração são testes mais complexos que podem validar uma cadeia inteira da aplicação ou um serviço especifico.

**[Correto]** Excelente resposta! Para complementar com terminologia técnica:
- **Unitários**: testam uma **classe/método isoladamente**, mockando dependências. Rápidos (milissegundos). Rodam sem infraestrutura.
- **Integração**: testam a **interação entre componentes** reais (banco, API, filas). Mais lentos. Precisam de infraestrutura.

### 2. O que é TDD (Test Driven Development)?

R: É você escrever o test antes do código, dessa maneira você vai está detalhando a funcionalidade do negócio e depois vai escrevendo o código afim de fazer os testes passarem e concluir a feature.

**[Correto]** Muito boa! Complementando com o ciclo oficial do TDD (**Red-Green-Refactor**):
1. **Red**: escreve o teste (que falha, pois o código ainda não existe)
2. **Green**: escreve o código **mínimo** necessário para o teste passar
3. **Refactor**: melhora o código mantendo os testes passando

### 3. O que são mocks e quando usá-los?

R: Mock é uma maneira de você forjar a resposta de integrações aquela classe para fazer testes unitários isolados e com valores conhecidos referntes a integração.

**[Correto]** Boa definição! Complementando:
```java
// Sem mock: precisa de banco de dados real para testar UsuarioService
// Com mock: simula o comportamento do repositório

@Mock
UsuarioRepository repository; // objeto "falso" que simula o banco

when(repository.findById(1L)).thenReturn(Optional.of(new Usuario("João")));
// Agora o teste não depende do banco e sempre retorna "João"
```

### 4. Qual a diferença entre `@Mock` e `@InjectMocks` no Mockito?

R: @Mock está associado ao Objeto não @Bean, já o @InjectMocks está associado ao injeções de dependencias.

**[Incorreto]** Não tem relação com `@Bean`. A diferença é:
- **`@Mock`**: cria um **objeto simulado** (falso) de uma classe/interface. Todos os métodos retornam valores padrão (null, 0, false) até você definir comportamentos com `when()`.
- **`@InjectMocks`**: cria uma **instância real** da classe que está sendo testada e **injeta automaticamente** os mocks declarados com `@Mock` nela.

```java
@Mock
UsuarioRepository repository;      // FAKE do repositório

@Mock
EmailService emailService;          // FAKE do serviço de email

@InjectMocks
UsuarioService service;             // REAL - recebe os mocks acima injetados

@Test
void deveSalvar() {
    when(repository.save(any())).thenReturn(new Usuario("João")); // define comportamento
    service.salvar(new Usuario("João")); // testa o service REAL com dependências FAKE
    verify(emailService).enviarBoasVindas(any()); // verifica se chamou o email
}
```

### 5. O que é o JUnit 5 e quais suas principais anotações?

R: JUnit 5 é a versão atualizada do JUnit4 e vem com muitas diferentes refentes a anotações e como escrever os testes.

**[Parcial]** Correto que é a evolução, mas uma resposta de entrevista precisa citar as anotações:

| Anotação               | Finalidade                                          |
|------------------------|------------------------------------------------------|
| `@Test`                | Marca um método como teste                           |
| `@BeforeEach`          | Executa antes de **cada** teste (setup)              |
| `@AfterEach`           | Executa depois de **cada** teste (cleanup)           |
| `@BeforeAll`           | Executa **uma vez** antes de todos os testes (static)|
| `@AfterAll`            | Executa **uma vez** depois de todos os testes        |
| `@DisplayName`         | Nome legível para o teste                            |
| `@Disabled`            | Desabilita o teste                                   |
| `@ParameterizedTest`   | Teste com múltiplos parâmetros                       |
| `@Nested`              | Agrupa testes em classes internas                    |

Mudanças do JUnit 4 -> 5: `@Before` virou `@BeforeEach`, `@BeforeClass` virou `@BeforeAll`, `@Ignore` virou `@Disabled`, assertions agora estão em `org.junit.jupiter.api.Assertions`.
