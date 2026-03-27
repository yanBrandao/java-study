# Spring Security

1. O que é o Spring Security e como funciona o filtro de segurança?
    R: o Spring Security é o modulo de seguranção do Spring, nele você pode criar servidores de autenticacao, clientes de authorização. Além disso, ele possui um comportamento baseado em filters, da maneira que cada filtro é responsavel por uma etapa de segurança, como validação de acesso ao método, validação de crendenciais, e por ai vai. Além disso você ainda pode criar filtros personalizados para complentar o seu modelo.

    **[Parcial]** A explicação está no caminho certo! Complementando com mais precisão:
    - O Spring Security funciona através de uma **FilterChain** (cadeia de filtros Servlet) chamada `SecurityFilterChain`. Cada requisição HTTP passa por uma série de filtros em ordem, sendo os principais:
      - `SecurityContextPersistenceFilter`: carrega/salva o contexto de segurança.
      - `UsernamePasswordAuthenticationFilter`: processa login com usuário/senha.
      - `BasicAuthenticationFilter`: processa autenticação Basic.
      - `ExceptionTranslationFilter`: converte exceções de segurança em respostas HTTP (401, 403).
      - `FilterSecurityInterceptor`/`AuthorizationFilter`: verifica se o usuário tem permissão para acessar o recurso.
    - Você pode adicionar filtros customizados com `addFilterBefore()` / `addFilterAfter()` na configuração da `SecurityFilterChain`.
    - A configuração moderna usa `SecurityFilterChain` como bean:
    ```java
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated()
        ).build();
    }
    ```

2. Qual a diferença entre autenticação e autorização?
    R: Autenticação é garantir que aquela requisição possui as credencias validas para acessar aquele recurso. Já autorização corresponde a validação a nivel de acesso, por exemplo, você pode categoria suas requisiçÕes a fim de que só administradores possam acessar aquele endpoint, ou remover qualquer autorização para acessar um endpoint publico.

    **[Parcial]** A ideia está correta, mas a definição de autenticação precisa de um ajuste — autenticação não é sobre "acessar aquele recurso" (isso é autorização). São conceitos distintos:
    - **Autenticação** (Authentication — "quem é você?"): é o processo de **verificar a identidade** do usuário. Valida se as credenciais (usuário/senha, token, certificado) são válidas. Responde: **"Você é quem diz ser?"**
    - **Autorização** (Authorization — "o que você pode fazer?"): é o processo de **verificar permissões** após o usuário já estar autenticado. Responde: **"Você tem permissão para acessar este recurso?"**

    Fluxo: Autenticação → Autorização (primeiro identifica, depois verifica permissões).

    No Spring Security: autenticação é feita por `AuthenticationManager`/`AuthenticationProvider`; autorização é feita por `@PreAuthorize`, `@Secured`, ou regras no `SecurityFilterChain`.

3. O que é JWT (JSON Web Token) e como implementar com Spring Security?
    R: JWT é uma maneira de criptrografar dados de uma maneira segura e possibilitando a validação de que aquele token você gerado por uma origem válida. para implementar JWT é necessário utilizar alguns pacotes do spring secutiry. não me lembro de cabeça quais são.

    **[Parcial]** JWT **não criptografa** dados por padrão — ele **assina** os dados. Qualquer pessoa pode decodificar o payload de um JWT (é Base64), mas não pode alterá-lo sem invalidar a assinatura. Estrutura do JWT:
    - **Header**: algoritmo de assinatura (ex.: HS256, RS256) e tipo (JWT).
    - **Payload**: claims (dados) como `sub` (subject/usuário), `exp` (expiração), `roles`, etc.
    - **Signature**: assinatura gerada com uma chave secreta para garantir integridade.

    Formato: `xxxxx.yyyyy.zzzzz` (header.payload.signature)

    Para implementar com Spring Security:
    1. Adicione as dependências: `spring-boot-starter-security` + uma biblioteca JWT como `jjwt` (io.jsonwebtoken) ou `spring-boot-starter-oauth2-resource-server`.
    2. Crie um filtro customizado que extrai o token do header `Authorization: Bearer <token>`, valida a assinatura e carrega o usuário no `SecurityContext`.
    3. Registre o filtro na `SecurityFilterChain` com `addFilterBefore()`.

    Com `spring-boot-starter-oauth2-resource-server`, boa parte dessa configuração já vem pronta.

4. O que são `@PreAuthorize` e `@Secured`?
    R: Não lembro

    **[Não respondida]** São anotações para controle de **autorização a nível de método**:
    - **`@Secured`**: forma mais simples, aceita apenas nomes de roles (papéis):
    ```java
    @Secured("ROLE_ADMIN")
    public void deleteUser(Long id) { ... }

    @Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
    public void updateUser(UserDTO dto) { ... }
    ```
    - **`@PreAuthorize`**: mais poderosa, aceita **expressões SpEL** (Spring Expression Language), permitindo lógica complexa:
    ```java
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) { ... }

    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public User getUser(@Param("userId") Long userId) { ... }

    @PreAuthorize("@securityService.canAccess(#id)")
    public Order getOrder(Long id) { ... }
    ```
    Para habilitá-las, é necessário usar `@EnableMethodSecurity` na classe de configuração. `@PreAuthorize` é a mais recomendada por ser mais flexível.

5. Como configurar CORS no Spring Boot?
    R: Você pode utilizar uma classe com anotação @Configuration e implementar uma classe especifica do Spring Security, com isso você irá precisar implementar o método que configura o CORS.

    **[Parcial]** A ideia está correta, mas existem diferentes formas de configurar CORS:
    1. **Globalmente via `WebMvcConfigurer`** (sem Spring Security):
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins("https://meusite.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
        }
    }
    ```
    2. **Via Spring Security** (quando o Security está no projeto, é necessário configurar nele também):
    ```java
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("https://meusite.com"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
            return config;
        })).build();
    }
    ```
    3. **Por controller** com `@CrossOrigin`:
    ```java
    @CrossOrigin(origins = "https://meusite.com")
    @RestController
    public class UserController { ... }
    ```

6. O que é OAuth2 e como integrar com Spring Security?
    R: OAuth2 é uma RFC de segurança que você traduz a autenticação do seu usuário através de um Bearer Token,

    **[Parcial]** A resposta ficou incompleta. OAuth2 é um **protocolo de autorização** (não de autenticação) que permite que um aplicativo acesse recursos de um usuário **sem precisar das credenciais dele**. Funciona com diferentes papéis:
    - **Resource Owner**: o usuário dono dos dados.
    - **Client**: a aplicação que quer acessar os dados.
    - **Authorization Server**: emite tokens (ex.: Keycloak, Auth0, Google).
    - **Resource Server**: a API que protege os recursos.

    Fluxos (grant types) principais:
    - **Authorization Code**: mais seguro, usado em aplicações web (redireciona o usuário para login no Authorization Server).
    - **Client Credentials**: comunicação entre serviços (machine-to-machine), sem usuário envolvido.

    No Spring Boot, a integração é feita com:
    - `spring-boot-starter-oauth2-client` — para aplicações que consomem recursos protegidos.
    - `spring-boot-starter-oauth2-resource-server` — para APIs que validam tokens JWT.
    - `spring-authorization-server` — para criar seu próprio servidor de autorização.

    O Bearer Token que você mencionou é o **formato do token** usado no header `Authorization: Bearer <token>`, mas OAuth2 é o protocolo completo que define como esse token é obtido e validado.
