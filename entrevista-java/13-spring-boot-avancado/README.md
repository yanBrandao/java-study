# Spring Boot Avançado

1. O que é Spring AOP (Aspect-Oriented Programming) e quando usar?
    R: O Aspect tem uma similaridade com os filtes,com Spring AOP, você pode criar anotações e com elas definir meios de pre processar ou pós processar a execução de um método, por exemplo. Podemos criar anotações para definir métricas de procesamento.
    Se criarmos anotação @Measurable e definirmos regras de processamento podemos armazenar o timestamp inicial de quando aquele método foi chamado e ao fim do metodo retornar ao stack anterior e calcular o tempo total de processamento. Com isso é necessário implementar como o AOP vai se comportar, ele pode ser antes ou depois da execução do metodo.

    **[Parcial]** O exemplo de métricas com `@Measurable` é excelente e demonstra bem o conceito! Complementando com a terminologia e os tipos de advice:
    - **AOP** é um paradigma que permite separar **preocupações transversais** (cross-cutting concerns) do código de negócio — como logging, métricas, segurança e transações.
    - Conceitos-chave:
      - **Aspect**: a classe que contém a lógica transversal (anotada com `@Aspect`).
      - **Advice**: o código que será executado. Tipos:
        - `@Before`: executa **antes** do método.
        - `@After`: executa **após** o método (sempre, com sucesso ou erro).
        - `@AfterReturning`: executa só quando o método **retorna com sucesso**.
        - `@AfterThrowing`: executa só quando o método **lança exceção**.
        - `@Around`: envolve o método inteiro (antes + depois), o mais poderoso.
      - **Pointcut**: define **quais métodos** serão interceptados (via expressão).

    ```java
    @Aspect
    @Component
    public class PerformanceAspect {
        @Around("@annotation(Measurable)")
        public Object measureTime(ProceedingJoinPoint joinPoint) throws Throwable {
            long start = System.currentTimeMillis();
            Object result = joinPoint.proceed(); // executa o método original
            long duration = System.currentTimeMillis() - start;
            log.info("{} executou em {}ms", joinPoint.getSignature(), duration);
            return result;
        }
    }
    ```
    Casos de uso comuns: logging, auditoria, métricas, cache, controle de transações (`@Transactional` usa AOP internamente).

2. O que são Profiles no Spring Boot e como usá-los?
    R: você pode criar diferentes arquivos application.properties e definir configuraçÕes com valores diferentes para term profiles diferentes.

    **[Parcial]** A ideia está correta, mas faltou detalhar as formas de uso. Profiles permitem ter **configurações diferentes por ambiente** (dev, staging, prod):
    - **Arquivos de configuração**: `application-dev.properties`, `application-prod.properties` (como você mencionou).
    - **Ativação**:
      - `application.properties`: `spring.profiles.active=dev`
      - Linha de comando: `--spring.profiles.active=dev`
      - Variável de ambiente: `SPRING_PROFILES_ACTIVE=dev`
    - **Beans condicionais**: ativar beans específicos por profile:
    ```java
    @Configuration
    @Profile("dev")
    public class DevConfig {
        @Bean
        public DataSource dataSource() { ... } // H2 em memória
    }

    @Configuration
    @Profile("prod")
    public class ProdConfig {
        @Bean
        public DataSource dataSource() { ... } // PostgreSQL
    }
    ```
    - Múltiplos profiles podem ser ativados simultaneamente: `spring.profiles.active=dev,metrics`.

3. O que é o Spring Actuator e quais endpoints ele expõe?
    R: Spring Actuator serve para coletar e apresentar dados relacionados a aplicações Spring, com ele você pode consultar se sua aplicação está saudavel através do endpoint "/health", é possivel também capturar o arquivo OpenAPI, se utilizarmos métricas com prometheus, podermos acessar o endpoint de "/metrics"

    **[Parcial]** A ideia está correta! Uma correção: o endpoint OpenAPI não é do Actuator (é do springdoc). Os principais endpoints do Actuator são:
    - `/actuator/health` — status de saúde da aplicação (UP/DOWN) e dos componentes (banco, disco, etc.).
    - `/actuator/info` — informações sobre a aplicação (versão, descrição).
    - `/actuator/metrics` — métricas da JVM, HTTP, conexões, etc. Integra com Prometheus via `/actuator/prometheus`.
    - `/actuator/env` — variáveis de ambiente e propriedades de configuração.
    - `/actuator/beans` — lista todos os beans registrados no container.
    - `/actuator/loggers` — permite consultar e **alterar o nível de log em tempo de execução**.
    - `/actuator/mappings` — lista todos os endpoints mapeados.
    - `/actuator/threaddump` — dump das threads da JVM.

    Por segurança, apenas `/health` vem exposto por padrão. Para expor outros: `management.endpoints.web.exposure.include=health,info,metrics`.

4. Como criar um starter customizado no Spring Boot?
    R: Eu só sei criar um starter com maven e para isso você pode definir o tipo dele como pom e importar no seu projeto.

    **[Parcial]** A parte do Maven está certa, mas um starter customizado vai além de um POM de dependências. Os passos são:
    1. **Módulo autoconfigure**: crie um projeto com a lógica de auto-configuração:
    ```java
    @Configuration
    @ConditionalOnClass(MyService.class)
    @EnableConfigurationProperties(MyStarterProperties.class)
    public class MyStarterAutoConfiguration {
        @Bean
        @ConditionalOnMissingBean
        public MyService myService(MyStarterProperties props) {
            return new MyService(props.getUrl(), props.getTimeout());
        }
    }
    ```
    2. **Registrar a auto-configuração**: crie o arquivo `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` e adicione a classe.
    3. **Módulo starter** (POM): crie um projeto que apenas agrupa as dependências (o autoconfigure + bibliotecas necessárias).
    4. **Properties customizáveis**: use `@ConfigurationProperties` para permitir configuração via `application.properties`:
    ```properties
    my-starter.url=https://api.example.com
    my-starter.timeout=5000
    ```
    Convenção de nomes: `minha-empresa-spring-boot-starter` (starters de terceiros não usam o prefixo `spring-boot-starter-`).

5. O que é o padrão Circuit Breaker e como implementar com Resilience4j?
    R: o Circuit Breaker, é uma maneira segura de lidar em situaçÕes de caos, por exemplo quando uma integração falha, se você tentar reprocessar de acordo com a sua demanda, você pode sobrecarregar sua aplicação e não só isso, mas quando a integração retornar, você pode exceder a quantidade de requisições e acabar sendo bloqueado.
    Dessa maneira, o Cirtuit Breaker, identifica essa falha na integração e segura as requisições recebidas pela origem e de tempos em tempos verifica se a integração retornou, quando isso acontecer o circuito é religado e podemos começar a enviar as requisições de maneira gradual.

    **[Parcial]** Excelente raciocínio sobre o problema e a solução! Complementando com os estados formais do Circuit Breaker:
    - **CLOSED** (fechado — funcionamento normal): as requisições passam normalmente. Se a taxa de falhas ultrapassa um limiar configurado, o circuito **abre**.
    - **OPEN** (aberto — bloqueando): as requisições são **rejeitadas imediatamente** (fail-fast), sem tentar chamar o serviço. Retorna um fallback ou erro. Após um tempo configurado, vai para half-open.
    - **HALF-OPEN** (semi-aberto — testando): permite um número limitado de requisições de teste. Se elas tiverem sucesso, o circuito **fecha**. Se falharem, **abre** novamente.

    Com Resilience4j no Spring Boot:
    ```java
    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResponse processPayment(PaymentRequest request) {
        return paymentClient.process(request);
    }

    public PaymentResponse paymentFallback(PaymentRequest request, Exception ex) {
        return new PaymentResponse("PENDING", "Serviço indisponível, tente novamente.");
    }
    ```
    Configuração em `application.yml`:
    ```yaml
    resilience4j.circuitbreaker.instances.paymentService:
      failure-rate-threshold: 50        # abre se 50% das chamadas falharem
      wait-duration-in-open-state: 30s  # tempo no estado OPEN antes de testar
      sliding-window-size: 10           # avalia as últimas 10 chamadas
    ```

6. Qual a diferença entre comunicação síncrona e assíncrona entre microservices?
    R: Comunicação sincrona é uma comunicação que aguarda a resposta até ter o resultado final, utilzando REST quando fazemos uma requisição HTTP, só é concluido com sucesso quando recebemos uma resposta do microserviço.
    No caso de Comunicação assincrona, é quando enviamos eventos e não aguardamos por uma resposta, como mensagem em filas ou kafka.
    Podemos ter a confirmação que a mensagem foi enviada, mas para termos uma resposta, mesmo que imediata, precisamos ter um consumidor, ou realizar a chamada em outro endpoint para fazer se o processo foi concluido (pooling)

    **[Correto]** Ótima resposta! Cobriu bem os conceitos, inclusive o detalhe do polling para verificar o resultado. Só um complemento para consolidar:
    - **Síncrona**: REST (HTTP), gRPC. O chamador **bloqueia** esperando a resposta. Mais simples, mas gera **acoplamento temporal** (se o serviço destino estiver fora, a requisição falha).
    - **Assíncrona**: filas (RabbitMQ, SQS), streaming (Kafka). O chamador **não bloqueia**. Gera **desacoplamento temporal** (o serviço destino pode processar depois). Mais resiliente, mas mais complexo de implementar e debugar.
    - Nota: a palavra correta é **polling** (com uma letra "o") — verificação periódica.

7. O que é Spring Cloud e quais são seus principais módulos?
    R: Spring Cloud, tem diversos módulos e os que eu conheço é Spring Feign Client, que é um módulo que é utilizado para integração com outras API, ele facilita na construção de classe que integram com outras API de maneira facil e sucinta.

    **[Parcial]** O Feign Client está correto! Mas o Spring Cloud tem um ecossistema muito maior voltado para **arquitetura de microservices**:
    - **Spring Cloud OpenFeign**: cliente HTTP declarativo (como você mencionou).
    - **Spring Cloud Gateway**: API Gateway para roteamento, rate limiting e filtros.
    - **Spring Cloud Config**: servidor centralizado de configurações (externaliza `application.properties`).
    - **Spring Cloud Netflix Eureka**: service discovery — serviços se registram e se descobrem automaticamente.
    - **Spring Cloud CircuitBreaker**: abstração para Circuit Breaker (Resilience4j).
    - **Spring Cloud Sleuth / Micrometer Tracing**: distributed tracing para rastrear requisições entre serviços.
    - **Spring Cloud Stream**: abstração para mensageria (Kafka, RabbitMQ).
    - **Spring Cloud LoadBalancer**: balanceamento de carga client-side.

    Exemplo do Feign Client para referência:
    ```java
    @FeignClient(name = "payment-service", url = "${payment.service.url}")
    public interface PaymentClient {
        @PostMapping("/api/payments")
        PaymentResponse process(@RequestBody PaymentRequest request);
    }
    ```

8. Como funciona o `@Async` no Spring?
    R: Podemos escrever um método @Async que executa sem travar a thread principal.

    **[Parcial]** A ideia está correta, mas faltaram detalhes importantes:
    - `@Async` faz o método ser executado em uma **thread separada** do pool de threads do Spring.
    - Para funcionar, é obrigatório ativar com `@EnableAsync` em uma classe `@Configuration`.
    - O método pode retornar `void` (fire-and-forget) ou `CompletableFuture<T>` (quando o resultado é necessário depois).
    - **Limitação importante**: `@Async` **não funciona** se chamado de dentro da mesma classe (pois o Spring usa proxy AOP — a chamada interna não passa pelo proxy).

    ```java
    @Configuration
    @EnableAsync
    public class AsyncConfig { }

    @Service
    public class EmailService {
        @Async
        public void sendEmail(String to, String body) {
            // executa em outra thread — não bloqueia o chamador
        }

        @Async
        public CompletableFuture<ReportDTO> generateReport(Long userId) {
            ReportDTO report = // processamento demorado...
            return CompletableFuture.completedFuture(report);
        }
    }
    ```
    Pode customizar o pool de threads definindo um bean `Executor` com `@Bean("taskExecutor")`.

9. O que é o `@Transactional` e como funciona a propagação de transações?
    R: O @Transaction serve para garantir que aquele método será executa até o fim, caso haja alguma falha, aquele processo é retrocedido defazendo o que foi durante a execução.

    **[Parcial]** A ideia de rollback em caso de falha está correta! Mas faltou explicar a **propagação**, que é uma parte importante da pergunta:
    - `@Transactional` garante que todas as operações de banco dentro do método fazem parte de uma **transação atômica** — ou tudo é commitado, ou tudo sofre rollback.
    - **Atenção**: por padrão, o rollback acontece apenas para **exceções unchecked** (`RuntimeException`). Para checked exceptions, é preciso configurar: `@Transactional(rollbackFor = Exception.class)`.
    - **Propagação** define o comportamento quando um método transacional chama outro:
      - `REQUIRED` (padrão): usa a transação existente ou cria uma nova se não houver.
      - `REQUIRES_NEW`: **sempre** cria uma nova transação, suspendendo a atual.
      - `MANDATORY`: exige que já exista uma transação, senão lança exceção.
      - `SUPPORTS`: usa a transação existente se houver, senão executa sem transação.
      - `NOT_SUPPORTED`: suspende a transação atual e executa sem transação.
      - `NEVER`: lança exceção se houver uma transação ativa.

    ```java
    @Transactional
    public void transferMoney(Long from, Long to, BigDecimal amount) {
        accountRepo.debit(from, amount);   // se falhar aqui...
        accountRepo.credit(to, amount);    // ...o debit é desfeito (rollback)
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveAuditLog(String action) {
        // salva em transação independente — persiste mesmo se a transação pai falhar
    }
    ```

10. O que é o Spring Scheduler (`@Scheduled`)?
    R: serve para definirmos tarefas programveis, com isso podemos escrever tarefas rotineiras, que executam a cada hora, ou a cada minuto...

    **[Parcial]** A ideia está correta! Complementando com detalhes de uso:
    - Para funcionar, é obrigatório ativar com `@EnableScheduling`.
    - Três formas de agendar:
      - **fixedRate**: executa a cada X milissegundos (independente do tempo de execução do método anterior).
      - **fixedDelay**: espera X milissegundos **após o término** da execução anterior.
      - **cron**: expressão cron para agendamentos complexos.

    ```java
    @Configuration
    @EnableScheduling
    public class SchedulerConfig { }

    @Component
    public class ScheduledTasks {
        @Scheduled(fixedRate = 60000)  // a cada 1 minuto
        public void checkHealth() { ... }

        @Scheduled(fixedDelay = 30000) // 30s após o término da execução anterior
        public void processQueue() { ... }

        @Scheduled(cron = "0 0 2 * * *") // todo dia às 2h da manhã
        public void dailyCleanup() { ... }
    }
    ```
    **Atenção**: por padrão, o scheduler usa uma **thread única**. Para tarefas paralelas, configure um `TaskScheduler` com pool de threads.
