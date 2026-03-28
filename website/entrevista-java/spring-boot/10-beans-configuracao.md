---
sidebar_position: 10
title: "Beans e Configuração"
---

# Beans e Configuração

### 1. O que é um Bean no contexto do Spring?

R: Bean é a instancia de uma classe que é invocada no boot de uma aplicações spring, dessa maneira se for necessario acessar esse bean por diferentes classes ele vai estar disponivel em diferentes escopos

**[Parcial]** A ideia está correta, mas vale refinar: um Bean é um **objeto gerenciado pelo container IoC do Spring** (ApplicationContext). Não é apenas "invocado no boot" — o Spring é responsável por todo o ciclo de vida desse objeto: criação, injeção de dependências, inicialização e destruição. Um bean pode ser definido de várias formas:
- Via anotações de estereótipo: `@Component`, `@Service`, `@Repository`, `@Controller`
- Via método `@Bean` dentro de uma classe `@Configuration`
- Via XML (modo legado)

O ponto principal é que o **Spring controla** esses objetos, diferente de objetos que você cria com `new`.

### 2. Quais são os escopos de um Bean (`singleton`, `prototype`, `request`, `session`)?

R: Aqui está a explicação para cada Bean
- Singleton: uma instancia compartilhada para toda aplicação
- Prototype: nao sei
- Request: a cada novo request recebido pelo controller, uma instancia isolada daquel Bean é construido, de maneira que enquanto aquele request estiver sendo executado ele compartilha a mesma instancia, porém não é possivel ser compartilhado em request diferentes.
- Session: nao sei

**[Parcial]** Singleton e Request estão corretos! Faltou completar:
- **Singleton** (padrão): uma única instância compartilhada por toda a aplicação. É o escopo default.
- **Prototype**: uma **nova instância é criada toda vez** que o bean é solicitado (injetado ou chamado via `getBean()`). O Spring cria o objeto mas **não gerencia sua destruição**.
- **Request**: uma instância por requisição HTTP (como você explicou). Só disponível em contexto web.
- **Session**: uma instância por **sessão HTTP do usuário**. Enquanto a sessão do usuário estiver ativa (ex.: enquanto estiver logado), o mesmo bean é reutilizado. Sessões diferentes têm instâncias diferentes.

Exemplos de uso: `@Scope("prototype")` para beans que mantêm estado mutável; `@SessionScope` para beans que guardam dados do usuário logado (como carrinho de compras).

### 3. Qual a diferença entre `@Component`, `@Service`, `@Repository` e `@Controller`?

R: @Component é uma maneira de definir a classe como @Bean porém sendo representada como @Component, de maneira geral é apenas uma maneira semântica de representar os Beans. Com isso temos especificações, @Service é um filho de Component representando um component mais especifico.
@Repository representa um component especifico para armazenamento de dados.
@Controller presenta uma camada de apresentação do modelo MVC.

**[Parcial]** A ideia de que são especializações semânticas de `@Component` está correta! Mas há diferenças técnicas importantes além da semântica:
- **`@Component`**: anotação genérica que marca a classe como um bean gerenciado pelo Spring.
- **`@Service`**: especialização de `@Component` para a camada de **lógica de negócio**. Funcionalmente é igual ao `@Component` (apenas semântica).
- **`@Repository`**: especialização para a camada de **acesso a dados**. Tem um diferencial técnico: ativa a **tradução automática de exceções** — exceções específicas do banco (ex.: `SQLException`) são convertidas em `DataAccessException` do Spring, unificando o tratamento de erros.
- **`@Controller`**: especialização para a camada **web/apresentação**. Habilita o tratamento de requisições HTTP (mapeamento de rotas com `@RequestMapping`).

Todas são detectadas pelo component scan (`@ComponentScan`) e registradas como beans no container.

### 4. Qual a diferença entre `@Autowired` por campo, construtor e setter? Qual é a recomendada?

R: Quando fazemos injeção de dependencia, e utilizamos @Autowired, para carregar o Bean na aplicação que estamos injetando, porém dessa maneira iniciamos o atributo com null e se o bean não estiver disponivel, isso pode causar um erro no startup da aplicação. Se fizemos injeção de dependecia via constructor podemos capturar essa falha na compilação e o atributo nunca será inicializado com null.

**[Parcial]** O raciocínio sobre a vantagem do construtor está correto! Mas faltou detalhar as três formas e a recomendação:
- **Por campo** (`@Autowired` direto no atributo): mais simples de escrever, mas o atributo é `null` até o Spring injetá-lo. Impossibilita o uso de `final` e dificulta testes unitários (precisa de reflexão para injetar mocks).
```java
@Autowired
private UserRepository repo; // não pode ser final
```
- **Por setter**: permite injeção opcional e re-injeção, mas também não garante imutabilidade.
```java
@Autowired
public void setRepo(UserRepository repo) { this.repo = repo; }
```
- **Por construtor** (recomendada): garante que as dependências são obrigatórias, permite `final` (imutabilidade), e facilita testes (basta passar os mocks no construtor). Desde o Spring 4.3, se a classe tem **um único construtor**, o `@Autowired` é opcional.
```java
@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { // @Autowired implícito
        this.repo = repo;
    }
}
```

### 5. O que é `@Qualifier` e quando usar?

R: Não sei

**[Não respondida]** `@Qualifier` é usado para **desambiguar** qual bean deve ser injetado quando existem **múltiplas implementações** de uma mesma interface. Exemplo:
```java
public interface NotificationService { void send(String msg); }

@Service("email")
public class EmailNotification implements NotificationService { ... }

@Service("sms")
public class SmsNotification implements NotificationService { ... }

@Service
public class OrderService {
    private final NotificationService notification;

    public OrderService(@Qualifier("email") NotificationService notification) {
        this.notification = notification; // injeta EmailNotification
    }
}
```
Sem o `@Qualifier`, o Spring lançaria `NoUniqueBeanDefinitionException` por não saber qual implementação escolher.

### 6. O que é `@Configuration` e `@Bean`?

R: O configuration apesar de ter um comportamento parecido com Bean, não tem o mesmo proposito. As configuration são inicializadas com ordem prioritaria em relacao ao Bean, nas configurações utilizamos inicialização de base de dados, informações de segurança que serão futuramente utilizadas pelos controllers, services e repository.

**[Parcial]** A ideia de que `@Configuration` é usada para configurações está correta, mas a explicação precisa de ajustes:
- **`@Configuration`**: marca uma classe como **fonte de definições de beans** via código Java (substitui o antigo XML de configuração). O Spring trata essa classe de forma especial usando CGLIB proxy para garantir que métodos `@Bean` retornem instâncias singleton.
- **`@Bean`**: marca um **método** dentro de uma `@Configuration` que retorna um objeto a ser gerenciado pelo Spring como bean. É útil quando você não tem controle sobre a classe (ex.: classes de bibliotecas externas).

```java
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(); // este objeto agora é um bean gerenciado pelo Spring
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
}
```
A diferença chave: `@Component` e derivados registram a **própria classe** como bean; `@Bean` registra o **retorno do método** como bean.

### 7. Qual a diferença entre `@Primary` e `@Qualifier`?

R: Não sei

**[Não respondida]** Ambas resolvem a ambiguidade quando há múltiplos beans do mesmo tipo, mas de formas diferentes:
- **`@Primary`**: marca um bean como o **padrão** quando há múltiplas opções. É definido no bean e se aplica globalmente — sempre que houver ambiguidade, o bean `@Primary` será escolhido automaticamente.
- **`@Qualifier`**: escolhe um bean **específico por nome** no ponto de injeção. Tem **prioridade sobre** `@Primary`.

```java
@Service
@Primary
public class EmailNotification implements NotificationService { ... }

@Service("sms")
public class SmsNotification implements NotificationService { ... }

// Aqui recebe EmailNotification (por ser @Primary)
public OrderService(NotificationService notification) { ... }

// Aqui recebe SmsNotification (o @Qualifier sobrepõe o @Primary)
public AlertService(@Qualifier("sms") NotificationService notification) { ... }
```
Use `@Primary` para definir um padrão sensato e `@Qualifier` para exceções pontuais.

### 8. O que é o ciclo de vida de um Bean no Spring?

R: Não sei, mas acredito que pode ter os seguintes estados: inicialização, estado de execução e encerramento.

**[Parcial]** A intuição está no caminho certo! O ciclo de vida de um bean tem mais etapas do que parece:
1. **Instanciação**: o container cria o objeto (via construtor).
2. **Injeção de dependências**: as propriedades e dependências são injetadas (`@Autowired`).
3. **Callbacks de inicialização** (nesta ordem):
   - `@PostConstruct` — método executado após a injeção de dependências.
   - `InitializingBean.afterPropertiesSet()` — interface do Spring.
   - Método `initMethod` definido em `@Bean(initMethod = "init")`.
4. **Bean pronto para uso**: disponível no container para injeção e uso.
5. **Callbacks de destruição** (quando o container é fechado):
   - `@PreDestroy` — método executado antes da destruição.
   - `DisposableBean.destroy()` — interface do Spring.
   - Método `destroyMethod` definido em `@Bean(destroyMethod = "cleanup")`.

Os mais usados no dia a dia são `@PostConstruct` (para lógica de inicialização como carregar cache) e `@PreDestroy` (para liberar recursos como fechar conexões).
