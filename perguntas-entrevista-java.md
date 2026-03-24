# Perguntas para Entrevistas Técnicas em Java

## 1. Fundamentos da Linguagem Java

1. Qual a diferença entre JDK, JRE e JVM?
2. O que é o bytecode Java e por que ele é importante?
3. Qual a diferença entre variáveis de tipo primitivo e tipo referência?
4. Quais são os tipos primitivos do Java e seus tamanhos?
5. Qual a diferença entre `==` e `.equals()`?
6. O que é autoboxing e unboxing?
7. Por que a classe `String` é imutável em Java?
8. Qual a diferença entre `String`, `StringBuilder` e `StringBuffer`?
9. O que é o pool de Strings (String Pool)?
10. Qual a diferença entre `final`, `finally` e `finalize()`?
11. O que são modificadores de acesso e quais existem em Java?
12. Qual a diferença entre `static` e `non-static`?
13. O que é o `ClassLoader` em Java?
14. Como funciona o Garbage Collector no Java?
15. O que é o operador `instanceof`?

## 2. Orientação a Objetos (OOP)

1. Quais são os quatro pilares da Orientação a Objetos?
2. Qual a diferença entre abstração e encapsulamento?
3. Qual a diferença entre classe abstrata e interface?
4. Quando usar classe abstrata e quando usar interface?
5. O que é polimorfismo? Dê exemplos de polimorfismo em tempo de compilação e em tempo de execução.
6. Qual a diferença entre sobrecarga (overloading) e sobrescrita (overriding)?
7. O que é herança e quais são seus tipos em Java?
8. Por que Java não suporta herança múltipla de classes?
9. O que é composição e por que é preferível à herança em muitos casos?
10. O que é o princípio SOLID? Explique cada um dos cinco princípios.
11. Qual a diferença entre coesão e acoplamento?
12. O que são Design Patterns? Cite os que você já utilizou.

## 3. Tratamento de Exceções

1. Qual a diferença entre `checked` e `unchecked` exceptions?
2. Qual a diferença entre `throw` e `throws`?
3. O que é e como funciona o bloco `try-with-resources`?
4. É possível ter um bloco `try` sem `catch`? E sem `finally`?
5. Qual a diferença entre `Error` e `Exception`?
6. O que acontece se uma exceção for lançada dentro de um bloco `finally`?
7. Quando criar uma exceção customizada?
8. Qual a hierarquia de exceções em Java?

## 4. Collections Framework

1. Qual a diferença entre `List`, `Set` e `Map`?
2. Qual a diferença entre `ArrayList` e `LinkedList`?
3. Qual a diferença entre `ArrayList` e `Vector`?
4. Qual a diferença entre `HashSet`, `LinkedHashSet` e `TreeSet`?
5. Qual a diferença entre `HashMap`, `LinkedHashMap` e `TreeMap`?
6. Qual a diferença entre `HashMap` e `Hashtable`?
7. Como funciona internamente o `HashMap`?
8. O que acontece quando dois objetos têm o mesmo hashCode no `HashMap`?
9. Qual a diferença entre `Comparable` e `Comparator`?
10. O que é `ConcurrentHashMap` e quando usar?
11. Qual a diferença entre `Iterator` e `ListIterator`?
12. O que é o `fail-fast` e `fail-safe` em collections?
13. Quando usar `Queue` e `Deque`?
14. O que é o `Collections.unmodifiableList()`?

## 5. Java 8+ (Recursos Modernos)

1. O que são expressões lambda e qual sua sintaxe?
2. O que são interfaces funcionais? Cite exemplos do pacote `java.util.function`.
3. O que é a Stream API e quais são suas operações intermediárias e terminais?
4. Qual a diferença entre `map()` e `flatMap()`?
5. O que é `Optional` e por que foi introduzido?
6. Qual a diferença entre `Stream` sequencial e paralela?
7. O que é method reference e quais são seus tipos?
8. Qual a diferença entre `forEach()` e `for-each` loop?
9. O que são default methods em interfaces?
10. O que mudou na API de data e hora do Java 8 (`java.time`)?
11. Quais foram as principais novidades do Java 11, 17 e 21 (LTS)?
12. O que são Records em Java?
13. O que são Sealed Classes?
14. O que é Pattern Matching no Java?

## 6. Multithreading e Concorrência

1. Qual a diferença entre processo e thread?
2. Quais são as formas de criar uma thread em Java?
3. Qual a diferença entre `Runnable` e `Callable`?
4. O que é sincronização e por que é necessária?
5. Qual a diferença entre `synchronized` method e `synchronized` block?
6. O que é deadlock e como evitá-lo?
7. O que é a palavra-chave `volatile`?
8. Qual a diferença entre `wait()`, `notify()` e `notifyAll()`?
9. O que é o `ExecutorService` e quais são seus tipos de thread pool?
10. O que é `CompletableFuture` e como funciona?
11. Qual a diferença entre `sleep()` e `wait()`?
12. O que é a classe `ThreadLocal`?
13. O que são locks reentrantes (`ReentrantLock`)?
14. O que é o problema de visibilidade de memória em threads?

## 7. Generics

1. O que são Generics e por que foram introduzidos?
2. Qual a diferença entre `<? extends T>` e `<? super T>`?
3. O que é Type Erasure?
4. É possível criar um array de tipos genéricos? Por quê?
5. O que é o diamond operator (`<>`)?

## 8. Testes

1. Qual a diferença entre testes unitários e testes de integração?
2. O que é TDD (Test Driven Development)?
3. O que são mocks e quando usá-los?
4. Qual a diferença entre `@Mock` e `@InjectMocks` no Mockito?
5. O que é o JUnit 5 e quais suas principais anotações?

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
