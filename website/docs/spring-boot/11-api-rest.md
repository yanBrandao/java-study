---
sidebar_position: 11
title: "API REST com Spring Boot"
---

# API REST com Spring Boot

1. Qual a diferença entre `@Controller` e `@RestController`?
    R: Controller é a maneira de identificarmos que aquele Bean está numa camada de apresentação, já o @RestController é uma especializacão de um Controller com componentes que definem ele como REST, ou seja ele já possui integrações com padrões REST, isso é utilizado até para representar a documentação.

    **[Parcial]** A ideia de especialização está correta, mas a diferença técnica é mais simples e precisa:
    - **`@Controller`**: retorna o **nome de uma view** (página HTML) por padrão. Para retornar dados (JSON/XML), precisa anotar cada método com `@ResponseBody`.
    - **`@RestController`**: é a combinação de `@Controller` + `@ResponseBody`. Todos os métodos retornam dados **serializados diretamente no corpo da resposta** (JSON por padrão), sem passar por um view resolver.

    ```java
    @Controller
    public class PageController {
        @GetMapping("/home")
        public String home() { return "index"; } // retorna a view "index.html"
    }

    @RestController
    public class ApiController {
        @GetMapping("/api/users")
        public List<User> getUsers() { return userService.findAll(); } // retorna JSON
    }
    ```

2. O que são `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`?
    R: GetMapping é a representação do Verbo GET, com ele a função que está descrita a seguir, é representada como GET. PostMapping representa o verbo POST, PutMapping representa o verbo PUT e o DELETE representa o verbo delete, dessa maneira o desenvolvedor não precisa especificar qual verbo será utilizado, como era usando antigamente com @RequestMapping.

    **[Parcial]** A explicação está correta! Um esclarecimento: `@RequestMapping` **não foi substituído** — essas anotações são atalhos (composed annotations) para `@RequestMapping(method = RequestMethod.GET)`, etc. O `@RequestMapping` ainda é usado, principalmente **no nível da classe** para definir o path base:
    ```java
    @RestController
    @RequestMapping("/api/users")  // path base — ainda usa @RequestMapping
    public class UserController {
        @GetMapping           // GET /api/users
        @PostMapping          // POST /api/users
        @GetMapping("/{id}")  // GET /api/users/{id}
        @PutMapping("/{id}")  // PUT /api/users/{id}
        @DeleteMapping("/{id}") // DELETE /api/users/{id}
    }
    ```
    Cada anotação mapeia para o verbo HTTP correspondente, alinhado com as operações CRUD de uma API REST.

3. Qual a diferença entre `@RequestParam`, `@PathVariable` e `@RequestBody`?
    R: RequestParam é a anotação que representa o parametro no padrão REST, se definirmos um parametro com @RequestParam, ao receber uma requisição REST ele será apresentado a seguir uma interogação como mostra a seguir: api-url.com/v1/helloword?name=Yan desse modo, o parametro name terá o valor Yan. PathVariable, é representado como uma variavel no enderço da url como mostra abaixo: api-url.com/v1/helloword/names/1 neste caso estou utilizando a rota names, e o pathvariable é id representado pelo valor 1. e o request body, geralmente é utilizado para requisições que precisam enviar dados mais complexos, como estruturas de dados em json.

    **[Correto]** Boa explicação com exemplos práticos! Para consolidar:
    ```java
    // @RequestParam — query string: /api/users?name=Yan&age=25
    @GetMapping("/api/users")
    public List<User> search(@RequestParam String name, @RequestParam(required = false) Integer age)

    // @PathVariable — parte da URL: /api/users/1
    @GetMapping("/api/users/{id}")
    public User getById(@PathVariable Long id)

    // @RequestBody — corpo da requisição (JSON → objeto Java)
    @PostMapping("/api/users")
    public User create(@RequestBody UserDTO dto)
    ```
    Complemento: `@RequestParam` é mais usado para **filtros e buscas**, `@PathVariable` para **identificar recursos**, e `@RequestBody` para **enviar dados complexos** (POST/PUT).

4. Como fazer tratamento global de exceções com `@ControllerAdvice` e `@ExceptionHandler`?
    R: Ao criar uma classe com a anotação @ControllerAdvice o spring entende que os métodos que serão criados ali serão para tratamento de execeção, porém para cada método que irá tratar uma exceção você deve utilizar a anotação exceptionHandler e definir qual exception você irá querer tratar, com isso você incluirá os parametros que será a propria exception e decidir o que será feito.
    Pode criar: logs, modificar a resposta definindo um body especifico, escolher o status code, tudo isso através do Response Entity.

    **[Correto]** Boa explicação! Para ilustrar com código:
    ```java
    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
            log.warn("Usuário não encontrado: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
            String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("VALIDATION_ERROR", errors));
        }
    }
    ```
    Nota: `@RestControllerAdvice` = `@ControllerAdvice` + `@ResponseBody` (retorna JSON direto).

5. O que é `ResponseEntity` e quando usar?
    R: O responseEntity é uma classe genérica ResponseEntity<T> que através dela consegue produzir resposta em JSON e status code de acordo com o padrão REST.

    **[Parcial]** A ideia está correta, mas `ResponseEntity` não produz apenas JSON — ele representa a **resposta HTTP completa**: status code, headers e body. É usado quando você precisa de **controle total** sobre a resposta:
    ```java
    @PostMapping("/users")
    public ResponseEntity<User> create(@RequestBody UserDTO dto) {
        User user = userService.save(dto);
        URI location = URI.create("/api/users/" + user.getId());
        return ResponseEntity
            .created(location)        // status 201
            .header("X-Custom", "valor") // headers customizados
            .body(user);              // corpo da resposta
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build(); // status 204, sem corpo
    }
    ```
    Quando **não** precisa customizar status/headers, pode retornar o objeto diretamente (o Spring assume 200 OK).

6. Como fazer validação de dados com Bean Validation (`@Valid`, `@NotNull`, `@Size`)?
    R: Para utilizar Bean Validation você precisa criar uma classe com a anotação @entity, e ela deve ser usada no controler, desse modo o Spring consegue verificar cada campo da classe de acordo com as anotações que você utilizou, Você pode definir o campo como @notnull e com isso rejeitar a requisição do cliente se não enviar o campo.

    **[Incorreto]** Bean Validation **não requer** `@Entity`! A anotação `@Entity` é do JPA e serve para mapear tabelas do banco. Para validação, você usa um **DTO** (ou qualquer classe) com anotações de validação e `@Valid` no controller:
    ```java
    // DTO com anotações de validação (NÃO precisa de @Entity)
    public class UserDTO {
        @NotNull(message = "Nome é obrigatório")
        @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
        private String name;

        @Email(message = "Email inválido")
        @NotBlank
        private String email;

        @Min(value = 18, message = "Idade mínima é 18")
        private Integer age;
    }

    // Controller — o @Valid ativa a validação
    @PostMapping("/users")
    public ResponseEntity<User> create(@Valid @RequestBody UserDTO dto) { ... }
    ```
    Se a validação falhar, o Spring lança `MethodArgumentNotValidException` (status 400) automaticamente. Para customizar a resposta de erro, use `@ControllerAdvice`.

7. O que é HATEOAS?
    R: não sei

    **[Não respondida]** HATEOAS (Hypermedia As The Engine Of Application State) é um princípio REST onde a API retorna **links de navegação** junto com os dados, permitindo que o cliente descubra dinamicamente as ações disponíveis:
    ```json
    {
        "id": 1,
        "name": "Yan",
        "email": "yan@email.com",
        "_links": {
            "self": { "href": "/api/users/1" },
            "update": { "href": "/api/users/1" },
            "delete": { "href": "/api/users/1" },
            "all-users": { "href": "/api/users" }
        }
    }
    ```
    Com Spring, usa-se o módulo `spring-boot-starter-hateoas` e classes como `EntityModel` e `WebMvcLinkBuilder`. Na prática, nem todas as APIs REST implementam HATEOAS — ele é mais utilizado em APIs públicas que precisam ser auto-descritivas.

8. Como versionar uma API REST?
    R: essa é uma pergunta muito subjetiva, por que existem muitas maneira de versionar uma API REST, seja via relase, ou via controller.
    Pensando no contexto de spring, podemos versionar uma API utilizando o @ResquestMapping("v1/users") e definir o numero da versão, mas há quem diga que podemos também deixa tudo num controller e criar metodos com versões diferentes. Vai da interpretação de cada um.

    **[Parcial]** Você tem razão que existem várias abordagens, e a via URL é a mais comum. Mas existem 4 estratégias principais com prós e contras:
    1. **Via URL (path)**: `GET /api/v1/users` — mais comum e visível. Fácil de entender e cachear.
    2. **Via query parameter**: `GET /api/users?version=1` — flexível mas menos padronizado.
    3. **Via header customizado**: `X-API-Version: 1` — não polui a URL mas é menos visível.
    4. **Via content negotiation (Accept header)**: `Accept: application/vnd.api.v1+json` — mais RESTful mas mais complexo.

    No Spring, a forma mais usada:
    ```java
    @RestController
    @RequestMapping("/api/v1/users")
    public class UserControllerV1 { ... }

    @RestController
    @RequestMapping("/api/v2/users")
    public class UserControllerV2 { ... }
    ```

9. O que é o Swagger/OpenAPI e como integrar com Spring Boot?
    R: Swagger é uma interface que utiliza da OpenAPI (padrão de documentação de código de REST API) para documentar o projeto e ele tem alto integração com Springboot através do springdoc.

    **[Parcial]** A relação Swagger/OpenAPI está correta! Complementando:
    - **OpenAPI**: é a **especificação** (padrão) que define como documentar APIs REST em formato JSON/YAML.
    - **Swagger**: é o conjunto de **ferramentas** que implementam a especificação (Swagger UI para visualização, Swagger Editor, Swagger Codegen).

    Para integrar com Spring Boot, adicione a dependência do `springdoc-openapi`:
    ```xml
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.x.x</version>
    </dependency>
    ```
    Com isso, automaticamente:
    - A documentação fica disponível em `/v3/api-docs` (JSON)
    - A interface Swagger UI fica em `/swagger-ui.html`

    Pode customizar com anotações como `@Operation`, `@ApiResponse`, `@Tag` nos controllers.
