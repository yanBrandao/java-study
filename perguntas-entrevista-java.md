# Perguntas para Entrevistas Técnicas em Java

## 1. Fundamentos da Linguagem Java

1. Qual a diferença entre JDK, JRE e JVM?
    R: JDK é o Java Development Kit e ali tem todas as ferramentas necessárias para desenvolver aplicações java, Java Runtime é o executavel do Java para rodar aplicações java. JVM é o Java Virtual Machine, com ele nós podemos executar as aplicações java em qualquer sistema operacional.
2. O que é o bytecode Java e por que ele é importante?
    R: Pelo código do Java ser naturalmente verboso, o bytecode faz com que o código java seja compilado e compactado.
3. Qual a diferença entre variáveis de tipo primitivo e tipo referência?
    R: variaveis do tipo primitivo tem tamanho de byte especifico, como int, string, float etc... no Java usa-se muito tipo por referencia,
    que são herdados da classe pai Object.
4. Quais são os tipos primitivos do Java e seus tamanhos?
    R: existem muitos mais os mais comuns são int, string, float, long.
5. Qual a diferença entre `==` e `.equals()`?
    R: o método equals() além de poder ser sobrescrito, compara os valores dos atributos de um objeto e o `==` compara a referencia.
7. Por que a classe `String` é imutável em Java?
    R: não sei
8. Qual a diferença entre `String`, `StringBuilder` e `StringBuffer`?
    R: String é o objecto que contem um texto, StringBuilder é um padrão de projeto que serve para criar uma String com algumas funções já definidas, o StringBuffer eu não sei.
9. O que é o pool de Strings (String Pool)?
    R: não sei
10. Qual a diferença entre `final`, `finally` e `finalize()`?
    R: final é uma palavra reservada para definir um atributo como final (imutavel). Finally é utilizado no try catch e finalize eu nao sei.
11. O que são modificadores de acesso e quais existem em Java?
    R: São identificadores que definem quem pode acessar o atributo daquele objecto, como por exemplo, private, não pode ser acessado de fora do objeto, para isso é preciso re-implementar o metodo `set` e `get`. existem outros como public, final, static e etc..
12. Qual a diferença entre `static` e `non-static`?
    R: statis é imutavel non-static não é
13. O que é o `ClassLoader` em Java?
    R: não sei
14. Como funciona o Garbage Collector no Java?
    R: O garbage collector funciona limpar variaveis que são utilizadas em funcões e após o termino da funcão precisam ser desalocadas da memoria. Diferente te linguagem com C, esse processo no Java é automatico e feito pelo Garbage collector.
15. O que é o operador `instanceof`?
    R: é uma palavra reservada que ser para identificar se aquela variavel pertence ao tipo de uma Classe

## 2. Orientação a Objetos (OOP)

1. Quais são os quatro pilares da Orientação a Objetos?
    R: Não lembro
2. Qual a diferença entre abstração e encapsulamento?
    R: abstração é uma maneira de você abstrair o mundo real para o código, por exemplo uma floresta pode ser representada como um Objeto Floresta e um atributo int arvore. Já o encapsulamento é uma maneira de você encapsular uma classe, para que ela não ser modificada externamente, por exemplo em C você cria um arquivo .h para encapsular seu arquivo .ccp dessa maneira você encapsula o arquivo para que ele não seja exposto externamente.
3. Qual a diferença entre classe abstrata e interface?
    R: classe abstrata possui atributos e metodos que podem ser extentidos por outras classes assumindo que serão utilizados ou ser necessidade de serem reescritos. já interfaces tem o papel apenas de representar como aquela classe deve ser implementada.
4. Quando usar classe abstrata e quando usar interface?
    R: Usamos classe abstratas quando queremos reutilizar o mesmo código em classes distintas, como para representar o automovel, podemos ter carro, moto etc.. e todos vão ter métodos já implementados como combustivel, metodo abastecer(), já no caso de interface, podemos seguir o mesmo exemplo, mas por exemplo para trocar_marcha(), na moto é feito de uma maneira diferente do carro. 
5. O que é polimorfismo? Dê exemplos de polimorfismo em tempo de compilação e em tempo de execução.
    R:
6. Qual a diferença entre sobrecarga (overloading) e sobrescrita (overriding)?
    R: sobrecarga é escrevermos o mesmo método com adição de mais parametros, no caso de sobrescrita, não estamos reescrevendo o mesmo método e mesmo parametros, para com um comportamento distinto.
7. O que é herança e quais são seus tipos em Java?
    R: Não lembro
8. Por que Java não suporta herança múltipla de classes?
    R: Não sei
9. O que é composição e por que é preferível à herança em muitos casos?
    R: não sei
10. O que é o princípio SOLID? Explique cada um dos cinco princípios.
    R: só lembro do D que é dependency injection que se refere ao pode intejar outros objetos dentro do seu para realizar integrações com banco de dados e serviçoes.
11. Qual a diferença entre coesão e acoplamento?
    R: acoplamento é você realizar uma implementação que depende de outro, dessa maneira qualquer alteração em um objeto pode impactar em outro. Coesão referece ao endentidimento do código e está bem descrito com variaveis que representam bem aquele codigo.
12. O que são Design Patterns? Cite os que você já utilizou.
    R: Design Patterns é uma maneira de você padronizar seu código com conceitos que são conhecidos na literatura, como Builder, com ele você definir o valores do objeto um a um e após os campos obrigatorios estarem definidos você realiza o build e o compilador é responasvel por construir aquele objeto da maneira que você definiu. Poderia me ajudar com ooutros?

## 3. Tratamento de Exceções

1. Qual a diferença entre `checked` e `unchecked` exceptions?
    R: unchecked expection está relacionado a exceções que não param o código com RuntimeExpcetion, porém checked expecetions podem quebrar o fluxo do código
2. Qual a diferença entre `throw` e `throws`?
    R: Não sei
3. O que é e como funciona o bloco `try-with-resources`? *
    R: podemos criar um try com um objeto que será instanciado apenas para aquele bloco try, após o bloco ser finalizado o garbage collector é responsavel por fazer dispose, close ou o que for necessário para encerrar aquele objeto.
4. É possível ter um bloco `try` sem `catch`? E sem `finally`? *
    R: É possivel sim, mas nunca sem ambos, ou seja, podemos ter try/catch, e try/finally, mas nunca apenas try.
5. Qual a diferença entre `Error` e `Exception`? *
    R: Error são exções relacionadas a estrutura do Java, como stackoverflow, e coisas afins, já as exceptions são erros que não encerram a aplicação, podem ser erorr tratados ou não pelo desenvolvedor.
6. O que acontece se uma exceção for lançada dentro de um bloco `finally`?
    R: o throw é disparado para classe acima, como erro não tratado.
7. Quando criar uma exceção customizada?
    R: Pode-se criar uma exceção customizada quando a integração com outros programas tem cenários expecificos e assim faz-se necessario a sua criação
8. Qual a hierarquia de exceções em Java?
    R: não sei

## 4. Collections Framework

1. Qual a diferença entre `List`, `Set` e `Map`? *
    R: List é indexado e Set, Map não, Set contem valores únicos e Map possiu chave e valor, e suas chaves são unicas, mas valores podem ser repetidos.
2. Qual a diferença entre `ArrayList` e `LinkedList`?
    R: O arraylist é indexado e o linkedlist não, para interar numa lista encadead precisamos usar stream ou while.
3. Qual a diferença entre `ArrayList` e `Vector`?
    R: não sei
4. Qual a diferença entre `HashSet`, `LinkedHashSet` e `TreeSet`?
    R: Não sei
5. Qual a diferença entre `HashMap`, `LinkedHashMap` e `TreeMap`?
    R: não sei
6. Qual a diferença entre `HashMap` e `Hashtable`?
    R: não sei
7. Como funciona internamente o `HashMap`?
    R: não sei
8. O que acontece quando dois objetos têm o mesmo hashCode no `HashMap`?
    R: crash kk não sei
9. Qual a diferença entre `Comparable` e `Comparator`?
    R: Não sei
10. O que é `ConcurrentHashMap` e quando usar?
    R: Não sei
11. Qual a diferença entre `Iterator` e `ListIterator`?
    R: não sei
12. O que é o `fail-fast` e `fail-safe` em collections?
    R: Não sei
13. Quando usar `Queue` e `Deque`?
    R: Não sei
14. O que é o `Collections.unmodifiableList()`?
    R: Não sei

## 5. Java 8+ (Recursos Modernos)

1. O que são expressões lambda e qual sua sintaxe?
    R: lambda expression é uma maneira de utilizar aquela funcão com objeto definido funcao() { (r -> String) r.toInt() } algo assim
2. O que são interfaces funcionais? Cite exemplos do pacote `java.util.function`.
    R: Não sei
3. O que é a Stream API e quais são suas operações intermediárias e terminais?
    R: Não sei
4. Qual a diferença entre `map()` e `flatMap()`?
    R: Não sei
5. O que é `Optional` e por que foi introduzido?
    R: Optional é uma maneira de utilizar objetos sem valores, com ele podemos verificar se o objeto tem valor sem ter que usar o primitivo null
6. Qual a diferença entre `Stream` sequencial e paralela?
    R: Não sei
7. O que é method reference e quais são seus tipos?
    R: Não sei
8. Qual a diferença entre `forEach()` e `for-each` loop?
    R: forEach é uma stream e for-each é a estrutura.
9. O que são default methods em interfaces?
    R: Não sei
10. O que mudou na API de data e hora do Java 8 (`java.time`)?
    R: Não sei
11. Quais foram as principais novidades do Java 11, 17 e 21 (LTS)?
    R: Não sei
12. O que são Records em Java?
    R: records são uma maneira de escrever classes sem ter que definir get e set, como é o padrão no java, 
13. O que são Sealed Classes?
    R: Não sei
14. O que é Pattern Matching no Java?
    R: Não sei

## 6. Multithreading e Concorrência

1. Qual a diferença entre processo e thread?
    R: Não sei
2. Quais são as formas de criar uma thread em Java?
    R: Podemos criar thread com Thread object e usar o run para inicia-la, porem não conheco outras.
3. Qual a diferença entre `Runnable` e `Callable`?
    R: Não sei
4. O que é sincronização e por que é necessária?
    R: Não sei
5. Qual a diferença entre `synchronized` method e `synchronized` block?
    R: Não sei
6. O que é deadlock e como evitá-lo?
    R: deadlock é quando uma thread está aguardando uma resposta de uma outra thread que depende daquela que está em standby, dessa maneira elas nunca vão concluir. Se não houver um fator externo para encerra-las realizar as thread dependentes de maneira sincronizada.
7. O que é a palavra-chave `volatile`?
    R: Não sei
8. Qual a diferença entre `wait()`, `notify()` e `notifyAll()`?
    R: Não sei
9. O que é o `ExecutorService` e quais são seus tipos de thread pool?
    R: Não sei
10. O que é `CompletableFuture` e como funciona?
    R: Não sei
11. Qual a diferença entre `sleep()` e `wait()`?
    R: Não sei
12. O que é a classe `ThreadLocal`?
    R: Não sei
13. O que são locks reentrantes (`ReentrantLock`)?
    R: Não sei
14. O que é o problema de visibilidade de memória em threads?
    R: Não sei

## 7. Generics

1. O que são Generics e por que foram introduzidos?
    R: Generics são Classes que permitem receber objetos dinamicamente, dessa maneira você consegue escrever funcões genericas para serem reutilizadas diferentes classes.
2. Qual a diferença entre `<? extends T>` e `<? super T>`?
    R: Não sei
3. O que é Type Erasure?
    R: Não sei
4. É possível criar um array de tipos genéricos? Por quê?
    R: Não sei
5. O que é o diamond operator (`<>`)?
    R: Não sei

## 8. Testes

1. Qual a diferença entre testes unitários e testes de integração? *
    R: Testes unitários servem para testar a menor unidade de código, fazendo com que eles sejam coesos e não vão fugir daquele que é suposto realizar, já testes de integração são testes mais complexos que podem validar uma cadeia inteira da aplicação ou um serviço especifico.
2. O que é TDD (Test Driven Development)?
    R: É você escrever o test antes do código, dessa maneira você vai está detalhando a funcionalidade do negócio e depois vai escrevendo o código afim de fazer os testes passarem e concluir a feature.
3. O que são mocks e quando usá-los?
    R: Mock é uma maneira de você forjar a resposta de integrações aquela classe para fazer testes unitários isolados e com valores conhecidos referntes a integração.
4. Qual a diferença entre `@Mock` e `@InjectMocks` no Mockito?
    R: @Mock está associado ao Objeto não @Bean, já o @InjectMocks está associado ao injeções de dependencias.
5. O que é o JUnit 5 e quais suas principais anotações?
    R: JUnit 5 é a versão atualizada do JUnit4 e vem com muitas diferentes refentes a anotações e como escrever os testes.

---

# Perguntas sobre Spring Boot

## 9. Conceitos Básicos do Spring

1. O que é o Spring Framework e qual problema ele resolve?
2. O que é Inversão de Controle (IoC) e Injeção de Dependência (DI)?
3. Qual a diferença entre Spring e Spring Boot?
4. O que são Spring Boot Starters?
5. O que é o arquivo `application.properties` / `application.yml`?
6. Como funciona a auto-configuração (auto-configuration) do Spring Boot?
7. O que é o Spring Initializr?

## 10. Beans e Configuração

1. O que é um Bean no contexto do Spring?
2. Quais são os escopos de um Bean (`singleton`, `prototype`, `request`, `session`)?
3. Qual a diferença entre `@Component`, `@Service`, `@Repository` e `@Controller`?
4. Qual a diferença entre `@Autowired` por campo, construtor e setter? Qual é a recomendada?
5. O que é `@Qualifier` e quando usar?
6. O que é `@Configuration` e `@Bean`?
7. Qual a diferença entre `@Primary` e `@Qualifier`?
8. O que é o ciclo de vida de um Bean no Spring?

## 11. API REST com Spring Boot

1. Qual a diferença entre `@Controller` e `@RestController`?
2. O que são `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`?
3. Qual a diferença entre `@RequestParam`, `@PathVariable` e `@RequestBody`?
4. Como fazer tratamento global de exceções com `@ControllerAdvice` e `@ExceptionHandler`?
5. O que é `ResponseEntity` e quando usar?
6. Como fazer validação de dados com Bean Validation (`@Valid`, `@NotNull`, `@Size`)?
7. O que é HATEOAS?
8. Como versionar uma API REST?
9. O que é o Swagger/OpenAPI e como integrar com Spring Boot?

## 12. Spring Security

1. O que é o Spring Security e como funciona o filtro de segurança?
2. Qual a diferença entre autenticação e autorização?
3. O que é JWT (JSON Web Token) e como implementar com Spring Security?
4. O que são `@PreAuthorize` e `@Secured`?
5. Como configurar CORS no Spring Boot?
6. O que é OAuth2 e como integrar com Spring Security?

## 13. Spring Boot Avançado

1. O que é Spring AOP (Aspect-Oriented Programming) e quando usar?
2. O que são Profiles no Spring Boot e como usá-los?
3. O que é o Spring Actuator e quais endpoints ele expõe?
4. Como criar um starter customizado no Spring Boot?
5. O que é o padrão Circuit Breaker e como implementar com Resilience4j?
6. Qual a diferença entre comunicação síncrona e assíncrona entre microservices?
7. O que é Spring Cloud e quais são seus principais módulos?
8. Como funciona o `@Async` no Spring?
9. O que é o `@Transactional` e como funciona a propagação de transações?
10. O que é o Spring Scheduler (`@Scheduled`)?

---

# Perguntas sobre JPA e Hibernate

## 14. Conceitos Fundamentais de JPA/Hibernate

1. O que é JPA e qual a diferença entre JPA e Hibernate?
2. O que é ORM (Object-Relational Mapping)?
3. O que é uma entidade JPA e como definir uma?
4. Qual a diferença entre `EntityManager` e `SessionFactory`?
5. O que é o `persistence.xml` e o que ele configura?
6. O que é o contexto de persistência (Persistence Context)?

## 15. Mapeamento de Entidades

1. Quais são as anotações básicas de mapeamento (`@Entity`, `@Table`, `@Column`, `@Id`)?
2. Quais são as estratégias de geração de ID (`@GeneratedValue`)?
3. Qual a diferença entre `@OneToOne`, `@OneToMany`, `@ManyToOne` e `@ManyToMany`?
4. O que é o `mappedBy` e quando usar?
5. O que é `cascade` e quais são seus tipos?
6. Qual a diferença entre `FetchType.LAZY` e `FetchType.EAGER`?
7. O que é `@Embeddable` e `@Embedded`?
8. Como mapear herança em JPA? Quais são as estratégias (`SINGLE_TABLE`, `TABLE_PER_CLASS`, `JOINED`)?
9. O que é `@MappedSuperclass`?

## 16. Consultas e Performance

1. Qual a diferença entre JPQL, Criteria API e SQL nativo?
2. O que é o problema N+1 e como resolvê-lo?
3. Qual a diferença entre `fetch join` e `join` em JPQL?
4. O que é o cache de primeiro nível e de segundo nível no Hibernate?
5. O que é o `@NamedQuery` e `@NamedNativeQuery`?
6. Como funciona a paginação com JPA?
7. O que é o `@EntityGraph` e quando usar?
8. O que é Batch Processing no Hibernate e como configurar?

## 17. Transações e Estados de Entidade

1. Quais são os estados de uma entidade no JPA (`transient`, `managed`, `detached`, `removed`)?
2. O que são os métodos `persist()`, `merge()`, `remove()` e `detach()`?
3. Qual a diferença entre `save()` e `saveAndFlush()` no Spring Data JPA?
4. O que é Dirty Checking no Hibernate?
5. O que é Optimistic Locking e Pessimistic Locking?
6. Qual a diferença entre `@Version` para controle de concorrência?

## 18. Spring Data JPA

1. O que é o Spring Data JPA e qual vantagem ele traz?
2. O que são Query Methods (derived queries) e como funcionam?
3. Qual a diferença entre `JpaRepository`, `CrudRepository` e `PagingAndSortingRepository`?
4. O que é `@Query` e quando usar?
5. Como fazer projeções (Projections) no Spring Data JPA?
6. O que é o `Specification` e quando usar?
7. Como fazer auditoria de entidades com `@CreatedDate`, `@LastModifiedDate`?
