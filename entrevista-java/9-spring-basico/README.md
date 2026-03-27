# Conceitos Básicos do Spring

1. O que é o Spring Framework e qual problema ele resolve?
    R: Spring Framework como qualquer outro framework, é uma estrutura que orienta desenvolvedores de como escrever códigos aplicações Java. Além disso ele possui recursos poderosos para facilitar a construções de serviços web padronizados, testaveis e com agilidade. O Spring possui diversos componentes modulos que implementam segurança, qualidade, auto gerenciamento e muitos outros.

    **[Parcial]** A ideia geral está correta, mas faltou mencionar o problema central que o Spring resolve: o **gerenciamento de dependências e o acoplamento entre objetos**. Antes do Spring, os desenvolvedores precisavam instanciar e gerenciar manualmente todas as dependências das suas classes, o que gerava código fortemente acoplado e difícil de testar. O Spring resolve isso com:
    - **Inversão de Controle (IoC)**: o framework assume o controle da criação e do ciclo de vida dos objetos.
    - **Injeção de Dependência (DI)**: o Spring injeta automaticamente as dependências necessárias, promovendo baixo acoplamento.
    - **Programação declarativa**: com anotações e configurações, reduz o código boilerplate (ex.: transações com `@Transactional`, segurança com `@Secured`).
    - Além disso, oferece um ecossistema modular (Spring MVC, Spring Security, Spring Data, etc.) para resolver problemas comuns de aplicações enterprise.

2. O que é Inversão de Controle (IoC) e Injeção de Dependência (DI)?
    R: Não sei o que é inversão de controle, mas injeção de dependencia é o uso instâncias de classes (Bean) como dependencia de outras.
    Por exemplo, se precisamos criar um serviço, e ele utiliza de base de dados, criamos um repository, e injetamos esse repository no service.
    Dessa maneira todas as configurações definidas no repository, não precisam ser redefinidas, por ser um @Bean ela já está disponivel para uso.

    **[Parcial]** A explicação de DI está no caminho certo, mas os dois conceitos são distintos e complementares:
    - **Inversão de Controle (IoC)**: é o princípio em que o controle da criação e gerenciamento dos objetos é **invertido** — em vez de você criar os objetos com `new`, o **container do Spring** (ApplicationContext) faz isso por você. O "controle" que era seu agora é do framework.
    - **Injeção de Dependência (DI)**: é a **implementação prática** do IoC. O container identifica quais dependências uma classe precisa e as injeta automaticamente (via construtor, setter ou campo).

    Exemplo prático:
    ```java
    // SEM IoC/DI — acoplamento forte
    public class UserService {
        private UserRepository repo = new UserRepository(); // você cria
    }

    // COM IoC/DI — o Spring injeta
    @Service
    public class UserService {
        private final UserRepository repo;
        public UserService(UserRepository repo) { // Spring injeta automaticamente
            this.repo = repo;
        }
    }
    ```
    O benefício principal é a **testabilidade**: com DI, você pode facilmente trocar a implementação real por um mock nos testes.

3. Qual a diferença entre Spring e Spring Boot?
    R: Spring é o conjunto de modulos que implenta recursos especificos, por exemplo o Spring Security tem implementações de modelos de segurança para serem usados na aplicações, porém precisa ser configurado corretamente. O spring boot são modulos que já possuem configurações que facilitam ainda mais o desenvolvimento, com o springboot algumas configurações padrão já são definidas para que os desenvolvedores não precisem tem que definir tudo do zero.

    **[Parcial]** A ideia central está correta, mas vale detalhar melhor as diferenças:
    - **Spring Framework**: é o framework base que oferece IoC, DI, AOP, Spring MVC, etc. Requer configuração manual (XML ou classes `@Configuration`). Você precisa configurar servidor, datasource, view resolvers, etc.
    - **Spring Boot**: é uma camada **sobre** o Spring Framework que oferece:
      - **Auto-configuração**: detecta as dependências no classpath e configura automaticamente (ex.: se tem H2 no classpath, configura um DataSource automaticamente).
      - **Servidor embutido**: vem com Tomcat/Jetty/Undertow embutido, sem necessidade de deploy em servidor externo.
      - **Starters**: dependências pré-configuradas que agrupam bibliotecas comuns.
      - **Opinionated defaults**: convenção sobre configuração — funciona "out of the box" mas permite customização.
    - Resumo: Spring Boot **não substitui** o Spring, ele **facilita o uso** do Spring eliminando a configuração manual.

4. O que são Spring Boot Starters?
    R: Starters são conjuntos de módulos que unidos entregam praticamente uma funcionalidade completa, com starter-web por exemplo, já se tem uma aplicação backend web completa para ser executada.

    **[Parcial]** A ideia está correta, mas tecnicamente Starters são **dependências Maven/Gradle pré-configuradas** que agrupam um conjunto de bibliotecas e configurações automáticas para uma funcionalidade específica. Eles seguem a convenção de nome `spring-boot-starter-*`. Exemplos:
    - `spring-boot-starter-web`: Spring MVC + Tomcat embutido + Jackson (JSON)
    - `spring-boot-starter-data-jpa`: Spring Data JPA + Hibernate + HikariCP (connection pool)
    - `spring-boot-starter-security`: Spring Security + configuração padrão de autenticação
    - `spring-boot-starter-test`: JUnit + Mockito + AssertJ + Spring Test

    O benefício é não precisar declarar cada biblioteca individualmente e se preocupar com compatibilidade de versões — o starter garante que tudo funciona junto.

5. O que é o arquivo `application.properties` / `application.yml`?
    R: é o arquivo principal para definirmos as configurações do projeto, no application.properties podemos definir valores para debug level, porta da aplicações, além disso podemos ter application properties para diferentes profiles, adicionar apenas um termo como application-dev.properties, dessa maneira utilizamos a flag --spring.profiles-active=dev e isso já altera o perfil utilizado pelo spring. Além disso podemos escrever o mesmo arquivo em YAML, utilizando o application.yml, mas isso só muda a linguagem o proposito é o mesmo.

    **[Correto]** Excelente resposta! Cobriu os pontos principais: configuração centralizada, profiles com `application-{profile}.properties`, ativação via `--spring.profiles-active`, e equivalência entre `.properties` e `.yml`. Um complemento: além da flag na linha de comando, o profile pode ser ativado via variável de ambiente `SPRING_PROFILES_ACTIVE=dev` ou dentro do próprio `application.properties` com `spring.profiles.active=dev`.

6. Como funciona a auto-configuração (auto-configuration) do Spring Boot?
    R: não sei

    **[Não respondida]** A auto-configuração é um dos pilares do Spring Boot. Funciona assim:
    1. Quando a aplicação inicia, o Spring Boot escaneia as classes anotadas com `@EnableAutoConfiguration` (já inclusa em `@SpringBootApplication`).
    2. Ele analisa quais dependências estão presentes no **classpath** (ex.: se `spring-boot-starter-data-jpa` está no projeto, ele detecta classes do Hibernate).
    3. Com base nisso, registra automaticamente beans com configurações padrão (ex.: cria um `DataSource`, `EntityManagerFactory`, etc.).
    4. As auto-configurações ficam em classes `@Configuration` dentro de JARs, registradas no arquivo `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
    5. Usa anotações condicionais como `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` para decidir se aplica ou não a configuração.

    Se você definir um bean manualmente (ex.: seu próprio `DataSource`), a auto-configuração **recua** graças ao `@ConditionalOnMissingBean`, respeitando sua configuração customizada.

7. O que é o Spring Initializr?
    R: o spring initializr é uma aplicação web que está disponivel para criar aplicações spring de acordo com os parametros escolhidos pelo usuários, podemos definir a linguagem que será usada (java ou kotlin), podemos definir a versao do java, os pacotes spring que serão importados, o gerenciador de pacote (maven, gradle-kotlin, gradle-groovy) e alguns outros recursos.

    **[Correto]** Boa resposta! Um complemento: o Spring Initializr está disponível em [start.spring.io](https://start.spring.io) e também é acessível diretamente de IDEs como IntelliJ IDEA e VS Code (via extensão Spring Boot). Além dos parâmetros que você citou, podemos definir o Group, Artifact, tipo de empacotamento (JAR/WAR) e a versão do Spring Boot.
