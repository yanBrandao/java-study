---
sidebar_position: 5
title: "Java 8+ (Recursos Modernos)"
---

# Java 8+ (Recursos Modernos)

1. O que são expressões lambda e qual sua sintaxe?
    R: lambda expression é uma maneira de utilizar aquela funcão com objeto definido funcao() { (r -> String) r.toInt() } algo assim

    **[Parcial]** A ideia de "função como objeto" está no caminho certo, mas a sintaxe ficou incorreta. Lambda é uma forma concisa de representar uma **função anônima** que pode ser passada como argumento:

    Sintaxe: `(parâmetros) -> expressão` ou `(parâmetros) -> { corpo }`

    ```java
    // Sem lambda (classe anônima):
    Comparator<String> comp = new Comparator<String>() {
        public int compare(String a, String b) { return a.compareTo(b); }
    };

    // Com lambda:
    Comparator<String> comp = (a, b) -> a.compareTo(b);

    // Mais exemplos:
    () -> System.out.println("Sem parâmetros")
    x -> x * 2                              // um parâmetro (parênteses opcionais)
    (x, y) -> x + y                         // dois parâmetros
    (String s) -> { return s.toUpperCase(); } // com tipo e bloco
    ```

2. O que são interfaces funcionais? Cite exemplos do pacote `java.util.function`.
    R: Não sei

    **[Não respondida]** Interface funcional é uma interface que possui **exatamente um método abstrato**. É o que permite usar lambdas, pois o compilador sabe qual método está sendo implementado. Marcada com `@FunctionalInterface`.

    Principais do pacote `java.util.function`:
    - **`Function<T,R>`**: recebe T, retorna R. `Function<String, Integer> f = s -> s.length();`
    - **`Predicate<T>`**: recebe T, retorna boolean. `Predicate<Integer> p = n -> n > 0;`
    - **`Consumer<T>`**: recebe T, não retorna nada. `Consumer<String> c = s -> System.out.println(s);`
    - **`Supplier<T>`**: não recebe nada, retorna T. `Supplier<Double> s = () -> Math.random();`
    - **`BiFunction<T,U,R>`**: recebe T e U, retorna R.

3. O que é a Stream API e quais são suas operações intermediárias e terminais?
    R: Não sei

    **[Não respondida]** Stream API é uma forma de processar coleções de forma **declarativa** (diz O QUE quer, não COMO fazer), semelhante a SQL. Não altera a coleção original.

    - **Operações intermediárias** (retornam outra Stream, são lazy):
      `filter()`, `map()`, `flatMap()`, `sorted()`, `distinct()`, `limit()`, `skip()`, `peek()`

    - **Operações terminais** (disparam o processamento, retornam um resultado):
      `collect()`, `forEach()`, `count()`, `reduce()`, `findFirst()`, `anyMatch()`, `toList()`

    ```java
    List<String> nomes = List.of("Ana", "Bruno", "Amanda", "Carlos");

    List<String> resultado = nomes.stream()
        .filter(n -> n.startsWith("A"))   // intermediária: filtra nomes com A
        .map(String::toUpperCase)          // intermediária: transforma para maiúsculo
        .sorted()                          // intermediária: ordena
        .collect(Collectors.toList());     // terminal: coleta o resultado
    // resultado: [AMANDA, ANA]
    ```

4. Qual a diferença entre `map()` e `flatMap()`?
    R: Não sei

    **[Não respondida]**
    - **`map()`**: transforma cada elemento em **outro elemento**. 1 para 1.
    - **`flatMap()`**: transforma cada elemento em **uma stream** e depois "achata" tudo em uma única stream. 1 para N.

    ```java
    // map: cada elemento -> outro elemento
    List<String> nomes = List.of("Ana", "Bruno");
    nomes.stream().map(String::toUpperCase); // ["ANA", "BRUNO"]

    // flatMap: cada elemento -> vários elementos (achatados)
    List<List<Integer>> listas = List.of(List.of(1,2), List.of(3,4));
    listas.stream().flatMap(List::stream); // [1, 2, 3, 4] (achatou as sublistas)

    // Sem flatMap seria: [[1,2], [3,4]] (Stream de Lists)
    // Com flatMap:       [1, 2, 3, 4]   (Stream de Integers)
    ```

5. O que é `Optional` e por que foi introduzido?
    R: Optional é uma maneira de utilizar objetos sem valores, com ele podemos verificar se o objeto tem valor sem ter que usar o primitivo null

    **[Parcial]** A ideia central está correta! Complementando: `Optional<T>` é um container que **pode ou não conter um valor**. Foi introduzido no Java 8 para **evitar `NullPointerException`** e tornar explícito que um retorno pode ser vazio:

    ```java
    // Sem Optional (perigoso):
    Usuario u = buscarPorId(1); // pode retornar null
    u.getNome(); // NullPointerException se u for null!

    // Com Optional (seguro e explícito):
    Optional<Usuario> u = buscarPorId(1);
    String nome = u.map(Usuario::getNome).orElse("Desconhecido");

    // Métodos principais:
    u.isPresent();          // true se tem valor
    u.isEmpty();            // true se vazio (Java 11+)
    u.get();                // retorna valor (lança exceção se vazio - evite!)
    u.orElse("padrão");     // valor padrão se vazio
    u.orElseThrow();        // lança exceção se vazio
    u.ifPresent(v -> ...);  // executa ação se presente
    ```

6. Qual a diferença entre `Stream` sequencial e paralela?
    R: Não sei

    **[Não respondida]**
    - **Stream sequencial** (`stream()`): processa os elementos **um por um**, em ordem, na thread atual.
    - **Stream paralela** (`parallelStream()` ou `stream().parallel()`): divide o trabalho entre **múltiplas threads** usando o ForkJoinPool, processando elementos simultaneamente.

    ```java
    lista.stream().filter(...);           // sequencial (uma thread)
    lista.parallelStream().filter(...);   // paralela (múltiplas threads)
    ```

    Cuidado: parallelStream nem sempre é mais rápido! Só compensa com **coleções grandes** e **operações pesadas**. Para coleções pequenas, o overhead de gerenciar threads é maior que o ganho.

7. O que é method reference e quais são seus tipos?
    R: Não sei

    **[Não respondida]** Method reference é um atalho para lambdas quando você apenas chama um método existente. Usa a sintaxe `::`:

    | Tipo                          | Sintaxe                    | Lambda equivalente           |
    |-------------------------------|----------------------------|-------------------------------|
    | Método estático               | `Integer::parseInt`        | `s -> Integer.parseInt(s)`    |
    | Método de instância (objeto)  | `System.out::println`      | `s -> System.out.println(s)`  |
    | Método de instância (tipo)    | `String::toUpperCase`      | `s -> s.toUpperCase()`        |
    | Construtor                    | `ArrayList::new`           | `() -> new ArrayList<>()`     |

8. Qual a diferença entre `forEach()` e `for-each` loop?
    R: forEach é uma stream e for-each é a estrutura.

    **[Parcial]** A distinção está correta na essência, mas `forEach` não é exclusivo de Stream:
    - **for-each** (enhanced for loop): é uma **estrutura da linguagem** (`for (T item : collection)`). Permite `break`, `continue` e acesso a variáveis externas mutáveis.
    - **`forEach()`**: é um **método** disponível em `Iterable` (desde Java 8) e em `Stream`. Recebe um `Consumer`. **Não** permite `break/continue` e variáveis externas devem ser efetivamente `final`.

    ```java
    // for-each (estrutura de linguagem)
    for (String s : lista) {
        if (s.equals("X")) break; // pode usar break
    }

    // forEach (método)
    lista.forEach(s -> System.out.println(s)); // não pode usar break
    ```

9. O que são default methods em interfaces?
    R: Não sei

    **[Não respondida]** Introduzidos no Java 8, são métodos **com implementação** dentro de interfaces, usando a palavra `default`. Permitem adicionar novos métodos a interfaces existentes sem quebrar as classes que já as implementam:

    ```java
    interface Pagavel {
        void pagar(double valor); // método abstrato (obrigatório implementar)

        default void pagarComDesconto(double valor, double desconto) { // tem corpo!
            pagar(valor - (valor * desconto)); // implementação padrão
        }
    }

    // Classe que implementa NÃO precisa implementar pagarComDesconto()
    // mas pode sobrescrever se quiser
    ```

    Foram criados principalmente para que a Oracle pudesse adicionar métodos na Stream API sem quebrar todas as coleções existentes.

10. O que mudou na API de data e hora do Java 8 (`java.time`)?
    R: Não sei

    **[Não respondida]** O Java 8 introduziu o pacote `java.time` para substituir as classes problemáticas `Date` e `Calendar`. As novas classes são **imutáveis** e **thread-safe**:

    - **`LocalDate`**: apenas data (sem hora). Ex: `2026-03-24`
    - **`LocalTime`**: apenas hora. Ex: `14:30:00`
    - **`LocalDateTime`**: data + hora (sem fuso horário)
    - **`ZonedDateTime`**: data + hora + fuso horário
    - **`Instant`**: timestamp (momento exato no tempo)
    - **`Duration`**: duração entre dois tempos (horas, minutos, segundos)
    - **`Period`**: período entre duas datas (anos, meses, dias)
    - **`DateTimeFormatter`**: formatação de datas

    ```java
    LocalDate hoje = LocalDate.now();
    LocalDate natal = LocalDate.of(2026, 12, 25);
    Period ate = Period.between(hoje, natal); // "9 meses e 1 dia"
    ```

11. Quais foram as principais novidades do Java 11, 17 e 21 (LTS)?
    R: Não sei

    **[Não respondida]** Principais novidades das versões LTS:

    **Java 11 (2018):**
    - `var` em parâmetros de lambda: `(var x) -> x.toUpperCase()`
    - Novos métodos em String: `isBlank()`, `strip()`, `lines()`, `repeat()`
    - `HttpClient` como API padrão (substituiu `HttpURLConnection`)
    - Executar arquivo .java direto: `java MinhaClasse.java`

    **Java 17 (2021):**
    - **Sealed Classes**: restringe quais classes podem herdar
    - **Records**: classes imutáveis de dados concisas
    - **Pattern Matching para instanceof**: `if (obj instanceof String s)`
    - **Switch expressions** (preview virou padrão)
    - **Text blocks**: strings multilinha com `"""`

    **Java 21 (2023):**
    - **Virtual Threads**: threads leves gerenciadas pela JVM (Project Loom)
    - **Pattern Matching para switch**: `case Integer i -> ...`
    - **Record Patterns**: desestruturação de records
    - **Sequenced Collections**: `sequencedCollection.getFirst()`, `getLast()`

12. O que são Records em Java?
    R: records são uma maneira de escrever classes sem ter que definir get e set, como é o padrão no java,

    **[Parcial]** Records vão além de apenas evitar getters/setters. São classes **imutáveis** para transportar dados, onde o compilador gera automaticamente:
    - Construtor com todos os campos
    - Métodos de acesso (não são getters com `get`, são `nome()`, `idade()`)
    - `equals()`, `hashCode()` e `toString()`

    ```java
    // Sem record (muito código):
    class Pessoa {
        private final String nome;
        private final int idade;
        Pessoa(String nome, int idade) { this.nome = nome; this.idade = idade; }
        String getNome() { return nome; }
        int getIdade() { return idade; }
        // + equals, hashCode, toString...
    }

    // Com record (1 linha!):
    record Pessoa(String nome, int idade) { }

    // Uso:
    Pessoa p = new Pessoa("João", 25);
    p.nome();  // "João" (não é getNome!)
    p.idade(); // 25
    ```

    Importante: records são **imutáveis** - os campos são `final` e não têm setters.

13. O que são Sealed Classes?
    R: Não sei

    **[Não respondida]** Sealed Classes (Java 17) permitem **controlar quais classes** podem herdar da sua classe. Você declara explicitamente as subclasses permitidas:

    ```java
    sealed class Forma permits Circulo, Quadrado, Triangulo { }

    final class Circulo extends Forma { }     // final: ninguém mais herda
    final class Quadrado extends Forma { }
    non-sealed class Triangulo extends Forma { } // abre para herança livre

    // class Hexagono extends Forma { } // ERRO! Não está no permits
    ```

    Útil para: representar domínios fechados (tipos de pagamento, estados de pedido) e funciona muito bem com **pattern matching** no switch.

14. O que é Pattern Matching no Java?
    R: Não sei

    **[Não respondida]** Pattern Matching permite testar o tipo de um objeto e extrair dados dele em uma única operação, eliminando casts manuais:

    ```java
    // ANTES (Java < 16):
    if (obj instanceof String) {
        String s = (String) obj; // cast manual
        System.out.println(s.length());
    }

    // DEPOIS - Pattern Matching para instanceof (Java 16):
    if (obj instanceof String s) { // testa E faz cast ao mesmo tempo
        System.out.println(s.length());
    }

    // Pattern Matching para switch (Java 21):
    String resultado = switch (obj) {
        case Integer i -> "Inteiro: " + i;
        case String s  -> "String: " + s;
        case null      -> "Nulo";
        default        -> "Outro tipo";
    };
    ```
