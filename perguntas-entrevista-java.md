# Perguntas para Entrevistas Técnicas em Java

## 1. Fundamentos da Linguagem Java

1. Qual a diferença entre JDK, JRE e JVM?
    R: **JVM** (Java Virtual Machine): é a máquina virtual que executa o bytecode Java. É ela que garante o "write once, run anywhere", pois cada sistema operacional tem sua própria implementação de JVM.
    - **JRE** (Java Runtime Environment): contém a JVM + as bibliotecas padrão do Java (java.lang, java.util, etc.). É o suficiente para **executar** programas Java.
    - **JDK** (Java Development Kit): contém o JRE + ferramentas de desenvolvimento como o compilador (`javac`), debugger (`jdb`), e o empacotador (`jar`). É necessário para **desenvolver** programas Java.

    Resumo: JDK > JRE > JVM (cada um contém o anterior).

2. O que é o bytecode Java e por que ele é importante?
    R: Bytecode é o **código intermediário** gerado pelo compilador `javac` quando compila um arquivo `.java` em um arquivo `.class`. Ele é importante porque:
    - A JVM interpreta o bytecode, não o código-fonte. Isso permite que o mesmo `.class` rode em qualquer sistema operacional que tenha uma JVM instalada (portabilidade).
    - O bytecode é otimizado em tempo de execução pelo **JIT (Just-In-Time Compiler)**, que converte partes frequentemente usadas em código de máquina nativo para melhor performance.

    Fluxo: `Código.java` -> (javac) -> `Código.class` (bytecode) -> (JVM) -> Execução

3. Qual a diferença entre variáveis de tipo primitivo e tipo referência?
    R: **Primitivos** (`int`, `float`, `boolean`, etc.): armazenam o **valor diretamente** na memória stack. São mais leves e rápidos.
    - **Referência** (`String`, `Integer`, arrays, qualquer classe): armazenam um **ponteiro/referência** para um objeto que fica na memória heap. Todos herdam de `Object`.

    Exemplo prático:
    ```java
    int a = 10;          // primitivo: o valor 10 está direto na stack
    String s = "hello";  // referência: s aponta para um objeto String na heap
    ```

4. Quais são os tipos primitivos do Java e seus tamanhos?
    R:  Java tem exatamente **8 tipos primitivos**:

    | Tipo      | Tamanho | Faixa de valores                        |
    |-----------|---------|------------------------------------------|
    | `byte`    | 1 byte  | -128 a 127                               |
    | `short`   | 2 bytes | -32.768 a 32.767                         |
    | `int`     | 4 bytes | -2.147.483.648 a 2.147.483.647           |
    | `long`    | 8 bytes | -9.2 quintilhões a 9.2 quintilhões      |
    | `float`   | 4 bytes | ponto flutuante de precisão simples      |
    | `double`  | 8 bytes | ponto flutuante de precisão dupla        |
    | `char`    | 2 bytes | caractere Unicode (0 a 65.535)           |
    | `boolean` | 1 bit*  | `true` ou `false`                        |

5. Qual a diferença entre `==` e `.equals()`?
    R: 
    - `==` compara **referências** (endereço de memória) para objetos, e **valores** para primitivos.
    - `.equals()` por padrão (na classe `Object`) faz a mesma coisa que `==`. Porém, classes como `String`, `Integer`, etc. **sobrescrevem** o método para comparar o **conteúdo/valor**.

    ```java
    String a = new String("Java");
    String b = new String("Java");
    a == b;      // false (referências diferentes na heap)
    a.equals(b); // true (conteúdo igual)
    ```
    Ponto importante: se você criar sua própria classe e quiser comparar por valor, **precisa sobrescrever** `equals()` e `hashCode()`.

6. O que é autoboxing e unboxing?
    R: Autoboxing e unboxing é a conversão automática que o Java faz entre tipos primitivos e suas classes wrapper correspondentes:
    - **Autoboxing**: primitivo -> wrapper (automático): `Integer x = 10;` (o `int` 10 vira um objeto `Integer`)
    - **Unboxing**: wrapper -> primitivo (automático): `int y = x;` (o objeto `Integer` vira `int`)

    As correspondências são: `int`/`Integer`, `double`/`Double`, `boolean`/`Boolean`, `char`/`Character`, etc.

    Cuidado: unboxing de um `null` causa `NullPointerException`!
    ```java
    Integer x = null;
    int y = x; // NullPointerException em tempo de execução!
    ```

7. Por que a classe `String` é imutável em Java?
    R:  `String` é imutável porque, uma vez criada, seu valor **não pode ser alterado**. Qualquer operação que "modifica" uma String na verdade cria uma **nova String** na memória. Isso foi feito por três razões:
    - **Segurança**: Strings são usadas para senhas, URLs, nomes de classe. Se fossem mutáveis, alguém poderia alterar uma referência compartilhada e comprometer o sistema.
    - **Performance (String Pool)**: como são imutáveis, o Java pode reutilizar a mesma instância para Strings iguais, economizando memória.
    - **Thread-safety**: objetos imutáveis são naturalmente seguros para uso entre múltiplas threads sem sincronização.

    ```java
    String s = "Java";
    s.concat(" é legal"); // NÃO altera s, cria um novo objeto
    System.out.println(s); // imprime "Java" (inalterado)
    ```

8. Qual a diferença entre `String`, `StringBuilder` e `StringBuffer`?
    R: 
    - **String**: imutável. Cada modificação cria um novo objeto. Ideal para textos que não mudam.
    - **StringBuilder**: mutável. Modifica o texto no mesmo objeto sem criar novos. **Não** é thread-safe. Ideal para concatenações em loops (melhor performance).
    - **StringBuffer**: idêntico ao StringBuilder, porém **thread-safe** (métodos sincronizados). Mais lento que StringBuilder por causa da sincronização.

    ```java
    // Ruim (cria muitos objetos String temporários):
    String s = "";
    for (int i = 0; i < 1000; i++) s += i;

    // Bom (modifica o mesmo objeto):
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < 1000; i++) sb.append(i);
    ```

    Regra prática: use `String` para textos fixos, `StringBuilder` para concatenações, `StringBuffer` somente se precisar de thread-safety.
    //Poderia exemplificar quando deve ser usado `StringBuffer`?

9. O que é o pool de Strings (String Pool)?
    R: O String Pool é uma área especial da memória heap onde o Java armazena **literais de String** para reutilização. Quando você cria uma String com literal (aspas duplas), o Java primeiro verifica se já existe uma igual no pool:

    ```java
    String a = "Java";   // cria no pool
    String b = "Java";   // reutiliza do pool (mesma referência!)
    a == b;              // true! (apontam para o mesmo objeto no pool)

    String c = new String("Java"); // cria um NOVO objeto na heap (fora do pool)
    a == c;              // false (referências diferentes)
    a.equals(c);         // true (conteúdo igual)
    ```

    O método `intern()` pode forçar uma String para o pool: `c.intern() == a` seria `true`.

10. Qual a diferença entre `final`, `finally` e `finalize()`?
    R:
     - **`final`**: palavra-chave com três usos:
      - Em **variável**: o valor não pode ser reatribuído (constante).
      - Em **método**: o método não pode ser sobrescrito por subclasses.
      - Em **classe**: a classe não pode ser herdada (ex: `String` é `final`).
    - **`finally`**: bloco que **sempre** executa após `try/catch`, independente de exceção ou não. Usado para liberar recursos (fechar conexões, arquivos, etc.).
    - **`finalize()`**: método da classe `Object` chamado pelo Garbage Collector **antes** de desalocar o objeto da memória. **Deprecated desde o Java 9** - não use em código novo. Foi substituído por `try-with-resources` e `Cleaner`.

11. O que são modificadores de acesso e quais existem em Java?
    R:  Java possui exatamente **4 modificadores de acesso**:

    | Modificador   | Classe | Pacote | Subclasse | Mundo |
    |---------------|--------|--------|-----------|-------|
    | `public`      | Sim    | Sim    | Sim       | Sim   |
    | `protected`   | Sim    | Sim    | Sim       | Não   |
    | (default)*    | Sim    | Sim    | Não       | Não   |
    | `private`     | Sim    | Não    | Não       | Não   |

    *default = sem palavra-chave (package-private).

12. Qual a diferença entre `static` e `non-static`?
    R:
    - **`static`**: pertence à **classe**, não à instância. Existe uma única cópia compartilhada por todos os objetos. É acessado sem criar um objeto: `MinhaClasse.metodo()`.
    - **`non-static`** (instância): pertence a **cada objeto** criado. Cada instância tem sua própria cópia.

    ```java
    class Contador {
        static int total = 0;    // compartilhado por TODOS os objetos
        int individual = 0;       // cada objeto tem o seu

        Contador() {
            total++;       // incrementa o contador da classe
            individual++;  // incrementa o contador desta instância
        }
    }
    // Após criar 3 objetos: total = 3, mas cada individual = 1
    ```

13. O que é o `ClassLoader` em Java?
    R:  O ClassLoader é o componente da JVM responsável por **carregar as classes em memória** em tempo de execução. Quando você usa uma classe no código, o ClassLoader:
    1. Localiza o arquivo `.class` (no classpath, JARs, etc.)
    2. Lê o bytecode
    3. Cria o objeto `Class<?>` na memória

    Existem 3 ClassLoaders principais, em hierarquia:
    - **Bootstrap ClassLoader**: carrega as classes core do Java (`java.lang`, `java.util`, etc.)
    - **Extension ClassLoader**: carrega extensões do JDK
    - **Application ClassLoader**: carrega as classes da sua aplicação (classpath)

14. Como funciona o Garbage Collector no Java?
    R: 
    - O GC remove da memória **heap** qualquer objeto que **não possui mais referências** apontando para ele, independente de onde foi criado.
    - Funciona por gerações: **Young Generation** (objetos novos), **Old Generation** (objetos que sobreviveram várias coletas), e **Metaspace** (metadados de classes).
    - O GC roda automaticamente, mas você pode sugerir (não forçar) uma coleta com `System.gc()`.

    ```java
    void exemplo() {
        Object obj = new Object(); // obj aponta para um objeto na heap
        obj = null;                // agora ninguém aponta para aquele objeto -> elegível para GC
    }
    // Ao sair do método, a variável local obj é destruída
    // e o objeto na heap (se não tiver mais referências) será coletado pelo GC
    ```

15. O que é o operador `instanceof`?
    R: é uma palavra reservada que ser para identificar se aquela variavel pertence ao tipo de uma Classe

    ```java
    Animal animal = new Cachorro();
    if (animal instanceof Cachorro) {
        System.out.println("É um cachorro!"); // imprime isso
    }
    if (animal instanceof Animal) {
        System.out.println("É um animal!"); // também imprime (Cachorro É um Animal)
    }
    ```
    A partir do Java 16, existe o **Pattern Matching** com instanceof:
    ```java
    if (animal instanceof Cachorro c) {
        c.latir(); // já faz o cast automaticamente!
    }
    ```

## 2. Orientação a Objetos (OOP)

16. Quais são os quatro pilares da Orientação a Objetos?
    R: Os quatro pilares são:
    - **Encapsulamento**: esconder os detalhes internos de uma classe, expondo apenas o necessário através de métodos públicos (getters/setters). Protege o estado interno do objeto.
    - **Herança**: uma classe (filha) pode herdar atributos e métodos de outra classe (pai), promovendo reuso de código. Em Java, usa-se `extends`.
    - **Polimorfismo**: capacidade de um mesmo método se comportar de maneiras diferentes dependendo do objeto que o chama. "Muitas formas".
    - **Abstração**: representar apenas as características essenciais de um objeto, escondendo a complexidade. Implementado via classes abstratas e interfaces.

    Dica para memorizar: **E.H.P.A.** (Encapsulamento, Herança, Polimorfismo, Abstração).

17. Qual a diferença entre abstração e encapsulamento?
    R: 
    - **Abstração**: foca em **o que** o objeto faz, escondendo **como** ele faz. Você define um contrato (interface/classe abstrata) sem expor a implementação.
    - **Encapsulamento**: foca em **proteger os dados** internos de acesso direto, usando modificadores de acesso (`private`) e expondo via métodos controlados (`getters/setters`).

    ```java
    // ABSTRAÇÃO: o usuário sabe que pode enviar email, mas não sabe como
    interface EnviadorEmail {
        void enviar(String destinatario, String mensagem);
    }

    // ENCAPSULAMENTO: os dados internos são protegidos
    class ContaBancaria {
        private double saldo; // ninguém acessa diretamente

        public void depositar(double valor) {
            if (valor > 0) this.saldo += valor; // validação controlada
        }

        public double getSaldo() { return saldo; } // acesso somente leitura
    }
    ```

18. Qual a diferença entre classe abstrata e interface?
    R:

    | Característica        | Classe Abstrata              | Interface                          |
    |-----------------------|------------------------------|------------------------------------|
    | Herança               | `extends` (apenas 1)         | `implements` (várias)              |
    | Métodos               | Abstratos e concretos         | Abstratos e `default` (Java 8+)   |
    | Atributos             | Qualquer tipo                 | Apenas `public static final`       |
    | Construtores          | Sim                           | Não                                |
    | Modificadores acesso  | Qualquer                      | Métodos são `public` por padrão    |

    Regra prática: use **interface** para definir um contrato ("o que fazer") e **classe abstrata** quando quiser compartilhar código comum entre classes relacionadas ("como fazer parcialmente").

19. Quando usar classe abstrata e quando usar interface?
    R: 
    - **Classe abstrata**: quando as classes filhas **compartilham código e estado** (atributos). Ex: `Veiculo` com atributo `combustivel` e método `abastecer()` que é igual para todos.
    - **Interface**: quando classes **não relacionadas** precisam do mesmo comportamento. Ex: tanto `Carro` quanto `Liquidificador` podem ser `Ligavel` (ter `ligar()` e `desligar()`), mas não faz sentido herdar de uma mesma classe.

    ```java
    abstract class Veiculo {                     // relação "É UM"
        protected int combustivel;
        void abastecer(int litros) { combustivel += litros; }
        abstract void trocarMarcha();            // cada filho implementa
    }

    interface Rastreavel {                        // capacidade (contrato)
        void obterLocalizacao();
    }

    class Carro extends Veiculo implements Rastreavel { ... }
    ```

20. O que é polimorfismo? Dê exemplos de polimorfismo em tempo de compilação e em tempo de execução.
    R: Polimorfismo significa "muitas formas" - a capacidade de um mesmo método ou referência assumir diferentes comportamentos:

    - **Tempo de compilação (estático) = Sobrecarga (Overloading)**: mesmo nome de método, parâmetros diferentes. O compilador decide qual chamar.
    ```java
    class Calculadora {
        int somar(int a, int b) { return a + b; }
        double somar(double a, double b) { return a + b; } // sobrecarga
    }
    ```

    - **Tempo de execução (dinâmico) = Sobrescrita (Overriding)**: a classe filha redefine um método da classe pai. A JVM decide qual chamar baseado no tipo real do objeto.
    ```java
    class Animal { void falar() { System.out.println("..."); } }
    class Cachorro extends Animal { void falar() { System.out.println("Au au!"); } }
    class Gato extends Animal { void falar() { System.out.println("Miau!"); } }

    Animal a = new Cachorro();
    a.falar(); // "Au au!" - decidido em tempo de execução
    ```

21. Qual a diferença entre sobrecarga (overloading) e sobrescrita (overriding)?
    R:
    - **Sobrecarga (Overloading)**: mesmo nome, **parâmetros diferentes** (quantidade ou tipo). Ocorre na **mesma classe** ou entre pai e filho. Resolvido em compilação.
    - **Sobrescrita (Overriding)**: mesmo nome, **mesmos parâmetros**, em uma **classe filha** que redefine o comportamento do pai. Resolvido em execução. Usa-se `@Override`.

    ```java
    // SOBRECARGA (mesma classe, parâmetros diferentes)
    void imprimir(String texto) { ... }
    void imprimir(String texto, int vezes) { ... }

    // SOBRESCRITA (classe filha, mesmos parâmetros)
    class Pai { void cumprimentar() { System.out.println("Olá"); } }
    class Filho extends Pai {
        @Override
        void cumprimentar() { System.out.println("E aí!"); } // mesmo método, novo comportamento
    }
    ```

22. O que é herança e quais são seus tipos em Java?
    R: Herança é o mecanismo onde uma classe (filha/subclasse) **herda** atributos e métodos de outra classe (pai/superclasse), promovendo reuso de código. Usa-se a palavra `extends`.

    Tipos de herança em Java:
    - **Simples**: `class B extends A` (B herda de A)
    - **Multinível**: `class C extends B`, `class B extends A` (cadeia A -> B -> C)
    - **Hierárquica**: `class B extends A`, `class C extends A` (B e C herdam de A)

    Java **não** suporta herança múltipla de classes (class C extends A, B), mas permite implementar múltiplas interfaces.

23. Por que Java não suporta herança múltipla de classes?
    R: Por causa do **Problema do Diamante**: se duas classes pai (`A` e `B`) têm um método com o mesmo nome e uma classe filha (`C`) herda de ambas, o compilador não saberia qual versão do método usar.

    ```
         Animal
        /      \
    Cachorro  Robô
        \      /
       CachorroRobô   <-- qual método falar() usar? Ambiguidade!
    ```

    Java resolve isso permitindo **múltiplas interfaces** (que não têm implementação por padrão) e, a partir do Java 8, se duas interfaces tiverem `default methods` iguais, a classe que implementa ambas **é obrigada** a resolver a ambiguidade explicitamente.

24. O que é composição e por que é preferível à herança em muitos casos?
    R: Composição é quando uma classe **contém** uma instância de outra classe como atributo, em vez de herdar dela. É a relação "TEM UM" em vez de "É UM".

    ```java
    // HERANÇA: Carro É UM Motor? Não faz sentido.
    class Carro extends Motor { } // ruim

    // COMPOSIÇÃO: Carro TEM UM Motor. Faz sentido!
    class Carro {
        private Motor motor;      // composição
        private List<Roda> rodas; // composição

        void ligar() { motor.ligar(); } // delega para o motor
    }
    ```

    Por que preferir composição:
    - **Flexibilidade**: pode trocar o Motor em tempo de execução (ex: motor elétrico por gasolina).
    - **Baixo acoplamento**: mudar o Motor não quebra o Carro.
    - **Evita hierarquias profundas**: herança cria cadeias rígidas que ficam difíceis de manter.

    Princípio famoso: **"Favoreça composição sobre herança"** (Gang of Four).

25. O que é o princípio SOLID? Explique cada um dos cinco princípios.
    R: SOLID são 5 princípios:

    - **S - Single Responsibility (Responsabilidade Única)**: uma classe deve ter apenas **um motivo** para mudar. Ex: `UsuarioService` não deve enviar emails - isso é responsabilidade de `EmailService`.
    - **O - Open/Closed (Aberto/Fechado)**: aberto para **extensão**, fechado para **modificação**. Use herança/interfaces para adicionar comportamento sem alterar código existente.
    - **L - Liskov Substitution (Substituição de Liskov)**: uma classe filha deve poder substituir a classe pai sem quebrar o programa. Se `Pato extends Ave` e Ave tem `voar()`, mas Pato não voa, violou Liskov.
    - **I - Interface Segregation (Segregação de Interface)**: prefira interfaces pequenas e específicas a uma interface grande. Ex: em vez de `Trabalhador` com `comer()` e `trabalhar()`, crie `Alimentavel` e `Trabalhavel`.
    - **D - Dependency Inversion (Inversão de Dependência)**: dependa de **abstrações** (interfaces), não de implementações concretas. O `PedidoService` deve depender de `RepositorioPedido` (interface), não de `PedidoRepositoryMySQL` (implementação).

26. Qual a diferença entre coesão e acoplamento?
    R: 
    - **Coesão (ALTA = bom)**: uma classe faz **uma coisa bem feita**. Todos os seus métodos e atributos estão relacionados a uma única responsabilidade. Ex: `CalculadoraDeImpostos` só calcula impostos.
    - **Acoplamento (BAIXO = bom)**: grau de **dependência** entre classes. Quanto menos uma classe sabe sobre os detalhes internos de outra, melhor. Use interfaces para reduzir acoplamento.

    Objetivo: **alta coesão + baixo acoplamento** = código fácil de manter, testar e evoluir.

    ```java
    // BAIXA coesão (faz coisas demais):
    class UsuarioService { salvar(); enviarEmail(); gerarRelatorio(); }

    // ALTA coesão (cada um faz sua parte):
    class UsuarioService { salvar(); buscar(); }
    class EmailService { enviarEmail(); }
    class RelatorioService { gerarRelatorio(); }
    ```

27. O que são Design Patterns? Cite os que você já utilizou.
    R: 
    **Criacionais** (como criar objetos):
    - **Singleton**: garante uma única instância da classe em toda a aplicação. Ex: conexão com banco, configuração.
    - **Factory Method**: delega a criação de objetos para subclasses. Ex: `NotificacaoFactory.criar("email")` retorna `EmailNotificacao`.
    - **Builder**: constrói objetos complexos passo a passo. Ex: `Pedido.builder().cliente("João").item("Pizza").build()`.

    **Estruturais** (como organizar classes):
    - **Adapter**: faz classes com interfaces incompatíveis trabalharem juntas. Ex: adaptar uma API antiga para um contrato novo.
    - **Decorator**: adiciona comportamento a um objeto dinamicamente. Ex: `BufferedReader` decora `FileReader`.

    **Comportamentais** (como classes se comunicam):
    - **Observer**: quando um objeto muda, notifica todos os interessados. Ex: eventos do Spring (`@EventListener`).
    - **Strategy**: define uma família de algoritmos intercambiáveis. Ex: diferentes formas de calcular frete.

## 3. Tratamento de Exceções

28. Qual a diferença entre `checked` e `unchecked` exceptions?
    R: 
    - **Checked exceptions**: o compilador **obriga** você a tratar (com try/catch ou declarar com throws). São exceções previsíveis que podem ser recuperadas. Ex: `IOException`, `SQLException`, `FileNotFoundException`.
    - **Unchecked exceptions**: o compilador **não obriga** tratamento. São erros de programação/lógica. Herdam de `RuntimeException`. Ex: `NullPointerException`, `ArrayIndexOutOfBoundsException`, `IllegalArgumentException`.

    ```java
    // Checked - compilador OBRIGA tratar:
    FileReader reader = new FileReader("arquivo.txt"); // não compila sem try/catch

    // Unchecked - compilador NÃO obriga:
    String s = null;
    s.length(); // compila, mas lança NullPointerException em execução
    ```

29. Qual a diferença entre `throw` e `throws`?
    R: São complementares:
    - **`throw`**: usado para **lançar** uma exceção explicitamente no corpo do método.
    - **`throws`**: usado na **assinatura** do método para declarar quais checked exceptions ele pode lançar (delegando o tratamento para quem chamar).

    ```java
    // throws: declara que o método PODE lançar essa exceção
    public void lerArquivo(String path) throws IOException {
        if (path == null) {
            throw new IllegalArgumentException("Path não pode ser nulo"); // throw: lança a exceção
        }
        // ... lê o arquivo
    }
    ```

30. O que é e como funciona o bloco `try-with-resources`?
    R: O próprio `try-with-resources` chama automaticamente o método `close()` da interface `AutoCloseable` ao final do bloco, mesmo que ocorra exceção:

    ```java
    // Sem try-with-resources (verboso e propenso a erros):
    BufferedReader br = null;
    try {
        br = new BufferedReader(new FileReader("file.txt"));
        br.readLine();
    } finally {
        if (br != null) br.close(); // precisa fechar manualmente
    }

    // Com try-with-resources (limpo e seguro):
    try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
        br.readLine();
    } // br.close() é chamado AUTOMATICAMENTE aqui, sem precisar do finally
    ```

    O objeto precisa implementar `AutoCloseable` (ou `Closeable`).

31. É possível ter um bloco `try` sem `catch`? E sem `finally`?
    R: 
    - `try / catch`
    - `try / finally`
    - `try / catch / finally`
    - `try-with-resources` (pode existir sem catch e sem finally, pois o close é implícito)

32. Qual a diferença entre `Error` e `Exception`?
    R: 
    - **Error**: problemas graves da **JVM/ambiente** que a aplicação geralmente **não deve tentar tratar**. Ex: `OutOfMemoryError`, `StackOverflowError`, `NoClassDefFoundError`. Indicam que algo está fundamentalmente errado.
    - **Exception**: problemas da **aplicação** que **podem e devem** ser tratados pelo desenvolvedor. Ex: `IOException`, `NullPointerException`, `SQLException`.

    Ambos herdam de `Throwable`:
    ```
    Throwable
    ├── Error (não trate - problemas da JVM)
    └── Exception (trate!)
        ├── Checked (IOException, SQLException...)
        └── RuntimeException - Unchecked (NullPointer, IndexOutOfBounds...)
    ```

33. O que acontece se uma exceção for lançada dentro de um bloco `finally`?
    R: 
    **a exceção original do try/catch é perdida (suprimida)**:

    ```java
    try {
        throw new RuntimeException("Exceção original"); // esta é PERDIDA
    } finally {
        throw new RuntimeException("Exceção do finally"); // esta é propagada
    }
    // Apenas "Exceção do finally" será vista pelo chamador!
    // A "Exceção original" desaparece silenciosamente - isso é perigoso.
    ```

    Por isso, evite lançar exceções no `finally`. Se precisar, use `try-with-resources` que gerencia isso corretamente com **suppressed exceptions**.

34. Quando criar uma exceção customizada?
    R: 
    - As exceções padrão do Java **não representam** adequadamente o erro do seu domínio. Ex: `SaldoInsuficienteException`, `PedidoNaoEncontradoException`.
    - Você quer que o **chamador trate erros específicos** de formas diferentes.
    - Para **padronizar mensagens** de erro na sua aplicação (muito usado em APIs REST).

    ```java
    // Exceção de negócio customizada:
    public class SaldoInsuficienteException extends RuntimeException {
        public SaldoInsuficienteException(double saldo, double valorSaque) {
            super("Saldo R$" + saldo + " insuficiente para saque de R$" + valorSaque);
        }
    }
    ```

35. Qual a hierarquia de exceções em Java?
    R: 
    ```
    Object
    └── Throwable                          (raiz de tudo que pode ser lançado)
        ├── Error                          (problemas da JVM - não trate)
        │   ├── OutOfMemoryError
        │   ├── StackOverflowError
        │   └── NoClassDefFoundError
        └── Exception                      (problemas da aplicação)
            ├── IOException                (checked)
            ├── SQLException               (checked)
            ├── FileNotFoundException      (checked)
            └── RuntimeException           (unchecked - não obriga tratamento)
                ├── NullPointerException
                ├── ArrayIndexOutOfBoundsException
                ├── IllegalArgumentException
                └── ClassCastException
    ```

## 4. Collections Framework

36. Qual a diferença entre `List`, `Set` e `Map`?
    R: 
    - **List**: coleção **ordenada** (mantém a ordem de inserção) que **permite duplicatas**. Acesso por índice. Ex: `[A, B, A, C]`
    - **Set**: coleção que **não permite duplicatas**. Não garante ordem (depende da implementação). Ex: `{A, B, C}`
    - **Map**: **não** é uma Collection (não implementa a interface `Collection`). Armazena pares **chave-valor**. Chaves únicas, valores podem repetir. Ex: `{nome=João, idade=30}`

    Detalhe importante: `Map` **não** faz parte da hierarquia de `Collection`, apesar de estar no Collections Framework.

37. Qual a diferença entre `ArrayList` e `LinkedList`?
    R:
    | Operação            | ArrayList         | LinkedList          |
    |---------------------|-------------------|---------------------|
    | Estrutura interna   | Array dinâmico    | Nós duplamente encadeados |
    | `get(index)`        | O(1) - rápido     | O(n) - lento (percorre nós) |
    | `add(element)` final| O(1) amortizado   | O(1)                |
    | `add(index)` meio   | O(n) - lento (move elementos) | O(1)* se já tiver o nó |
    | `remove(index)`     | O(n)              | O(1)* se já tiver o nó |
    | Memória             | Menos (só dados)  | Mais (dados + ponteiros) |

    Na prática, **ArrayList** é a escolha padrão em 95% dos casos por causa do cache de CPU e acesso direto.

38. Qual a diferença entre `ArrayList` e `Vector`?
    R: não sei

    **[Não respondida]** Ambos são listas baseadas em array, mas:
    - **ArrayList**: **não sincronizado** (não thread-safe). Melhor performance em ambientes single-thread. Cresce 50% quando cheio.
    - **Vector**: **sincronizado** (thread-safe). Mais lento devido à sincronização. Cresce 100% quando cheio. É uma classe **legada** (desde Java 1.0).

    Na prática: **nunca use Vector**. Use `ArrayList` e, se precisar de thread-safety, use `Collections.synchronizedList()` ou `CopyOnWriteArrayList`.

39. Qual a diferença entre `HashSet`, `LinkedHashSet` e `TreeSet`?
    R: Não sei

    **[Não respondida]** Todos implementam `Set` (sem duplicatas), mas diferem na **ordem** e **performance**:
    - **HashSet**: **sem ordem** garantida. Usa tabela hash. O(1) para add/remove/contains. Mais rápido.
    - **LinkedHashSet**: mantém a **ordem de inserção**. Usa hash + lista encadeada. Levemente mais lento que HashSet.
    - **TreeSet**: mantém os elementos **ordenados naturalmente** (ou por Comparator). Usa árvore red-black. O(log n) para operações.

    ```java
    Set<Integer> hash   = new HashSet<>(List.of(3,1,2));   // [1,2,3] ou qualquer ordem
    Set<Integer> linked = new LinkedHashSet<>(List.of(3,1,2)); // [3,1,2] (ordem inserção)
    Set<Integer> tree   = new TreeSet<>(List.of(3,1,2));   // [1,2,3] (sempre ordenado)
    ```

40. Qual a diferença entre `HashMap`, `LinkedHashMap` e `TreeMap`?
    R: não sei

    **[Não respondida]** Mesma lógica dos Sets, aplicada a Maps:
    - **HashMap**: **sem ordem** garantida. O(1) para get/put. Mais usado.
    - **LinkedHashMap**: mantém **ordem de inserção** (ou ordem de acesso, se configurado). Útil para caches LRU.
    - **TreeMap**: mantém as **chaves ordenadas**. O(log n). Útil quando precisa de navegação ordenada (`firstKey()`, `lastKey()`).

41. Qual a diferença entre `HashMap` e `Hashtable`?
    R: não sei

    **[Não respondida]**
    - **HashMap**: não sincronizado, aceita **uma chave null** e múltiplos valores null. Mais rápido.
    - **Hashtable**: sincronizado (thread-safe), **não aceita** null em chave nem valor. Classe legada.

    Na prática: **nunca use Hashtable**. Use `HashMap` e, se precisar de thread-safety, use `ConcurrentHashMap`.

42. Como funciona internamente o `HashMap`?
    R: não sei

    **[Não respondida]** O HashMap usa um **array de buckets** (posições) e uma função hash:
    1. Ao fazer `put(chave, valor)`, calcula `hashCode()` da chave.
    2. O hash determina em qual **bucket** (posição do array) o par será armazenado.
    3. Se dois objetos caírem no mesmo bucket (**colisão**), são armazenados como uma **lista encadeada** nesse bucket (ou **árvore red-black** se a lista ficar grande, a partir do Java 8).
    4. Ao fazer `get(chave)`, calcula o hash, vai ao bucket, e usa `equals()` para encontrar a chave exata.

    Por isso é essencial sobrescrever **tanto** `hashCode()` **quanto** `equals()` ao usar objetos customizados como chave!

43. O que acontece quando dois objetos têm o mesmo hashCode no `HashMap`?
    R: crash kk não sei

    **[Não respondida]** Não dá crash! Isso é chamado de **colisão de hash** e é tratado normalmente:
    - Os dois pares chave-valor são armazenados no **mesmo bucket**.
    - Até Java 7: como uma **lista encadeada** dentro do bucket.
    - A partir do Java 8: se a lista no bucket ultrapassar **8 elementos**, ela é convertida em uma **árvore red-black** (de O(n) para O(log n)).
    - Na busca, o HashMap usa `equals()` para distinguir entre as chaves no mesmo bucket.

44. Qual a diferença entre `Comparable` e `Comparator`?
    R: Não sei

    **[Não respondida]** Ambos servem para **ordenar objetos**, mas de formas diferentes:
    - **Comparable**: a própria classe implementa `compareTo()`. Define a ordenação **natural** (padrão). Só pode ter **uma** ordenação.
    - **Comparator**: classe externa que implementa `compare()`. Permite **múltiplas** ordenações diferentes, sem alterar a classe original.

    ```java
    // Comparable: ordenação natural definida NA classe
    class Pessoa implements Comparable<Pessoa> {
        String nome;
        int compareTo(Pessoa outra) { return this.nome.compareTo(outra.nome); }
    }
    Collections.sort(pessoas); // ordena por nome (padrão)

    // Comparator: ordenação externa, sem alterar Pessoa
    Collections.sort(pessoas, Comparator.comparingInt(p -> p.idade)); // ordena por idade
    ```

45. O que é `ConcurrentHashMap` e quando usar?
    R: Não sei

    **[Não respondida]** É uma implementação **thread-safe** de `Map` otimizada para alta concorrência:
    - Diferente do `Hashtable` (que trava o mapa inteiro), o `ConcurrentHashMap` usa **lock por segmento/bucket**, permitindo múltiplas threads lerem e escreverem simultaneamente em partes diferentes.
    - Não permite chaves ou valores `null`.
    - Use quando múltiplas threads precisam acessar o mesmo Map. Cenários comuns: caches, contadores compartilhados, registros de sessão.

46. Qual a diferença entre `Iterator` e `ListIterator`?
    R: não sei

    **[Não respondida]**
    - **Iterator**: percorre qualquer `Collection` em **uma direção** (para frente). Métodos: `hasNext()`, `next()`, `remove()`.
    - **ListIterator**: exclusivo para `List`. Percorre em **ambas direções**. Métodos adicionais: `hasPrevious()`, `previous()`, `add()`, `set()`, `nextIndex()`.

47. O que é o `fail-fast` e `fail-safe` em collections?
    R: Não sei

    **[Não respondida]**
    - **Fail-fast**: lança `ConcurrentModificationException` se a coleção é modificada durante iteração. Ex: `ArrayList`, `HashMap`. Detecta modificações rapidamente.
    - **Fail-safe**: trabalha sobre uma **cópia** da coleção, então não lança exceção. Ex: `CopyOnWriteArrayList`, `ConcurrentHashMap`. Pode não refletir mudanças mais recentes.

    ```java
    // Fail-fast: lança exceção!
    List<String> lista = new ArrayList<>(List.of("A", "B"));
    for (String s : lista) {
        lista.remove(s); // ConcurrentModificationException!
    }

    // Solução: use Iterator.remove() ou CopyOnWriteArrayList
    ```

48. Quando usar `Queue` e `Deque`?
    R: Não sei

    **[Não respondida]**
    - **Queue** (Fila): estrutura **FIFO** (primeiro a entrar, primeiro a sair). Use quando precisar processar elementos na ordem de chegada. Ex: fila de mensagens, tarefas pendentes. Implementações: `LinkedList`, `PriorityQueue`.
    - **Deque** (Double-Ended Queue): permite inserir/remover em **ambas as pontas**. Pode funcionar como fila ou pilha (LIFO). Implementações: `ArrayDeque`, `LinkedList`.

    ```java
    Queue<String> fila = new LinkedList<>();
    fila.offer("primeiro");  // adiciona no final
    fila.poll();             // remove do início (FIFO)

    Deque<String> pilha = new ArrayDeque<>();
    pilha.push("topo");      // adiciona no início
    pilha.pop();             // remove do início (LIFO)
    ```

49. O que é o `Collections.unmodifiableList()`?
    R: Não sei

    **[Não respondida]** Retorna uma **visão somente leitura** de uma lista. Qualquer tentativa de modificar (add, remove, set) lança `UnsupportedOperationException`:

    ```java
    List<String> original = new ArrayList<>(List.of("A", "B"));
    List<String> imutavel = Collections.unmodifiableList(original);
    imutavel.add("C"); // UnsupportedOperationException!

    // Cuidado: alterações na lista ORIGINAL ainda afetam a visão!
    original.add("C"); // imutavel agora mostra [A, B, C]

    // Para lista verdadeiramente imutável (Java 9+):
    List<String> segura = List.of("A", "B"); // ou List.copyOf(original)
    ```

## 5. Java 8+ (Recursos Modernos)

50. O que são expressões lambda e qual sua sintaxe?
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

51. O que são interfaces funcionais? Cite exemplos do pacote `java.util.function`.
    R: Não sei

    **[Não respondida]** Interface funcional é uma interface que possui **exatamente um método abstrato**. É o que permite usar lambdas, pois o compilador sabe qual método está sendo implementado. Marcada com `@FunctionalInterface`.

    Principais do pacote `java.util.function`:
    - **`Function<T,R>`**: recebe T, retorna R. `Function<String, Integer> f = s -> s.length();`
    - **`Predicate<T>`**: recebe T, retorna boolean. `Predicate<Integer> p = n -> n > 0;`
    - **`Consumer<T>`**: recebe T, não retorna nada. `Consumer<String> c = s -> System.out.println(s);`
    - **`Supplier<T>`**: não recebe nada, retorna T. `Supplier<Double> s = () -> Math.random();`
    - **`BiFunction<T,U,R>`**: recebe T e U, retorna R.

52. O que é a Stream API e quais são suas operações intermediárias e terminais?
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

53. Qual a diferença entre `map()` e `flatMap()`?
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

54. O que é `Optional` e por que foi introduzido?
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

55. Qual a diferença entre `Stream` sequencial e paralela?
    R: Não sei

    **[Não respondida]**
    - **Stream sequencial** (`stream()`): processa os elementos **um por um**, em ordem, na thread atual.
    - **Stream paralela** (`parallelStream()` ou `stream().parallel()`): divide o trabalho entre **múltiplas threads** usando o ForkJoinPool, processando elementos simultaneamente.

    ```java
    lista.stream().filter(...);           // sequencial (uma thread)
    lista.parallelStream().filter(...);   // paralela (múltiplas threads)
    ```

    Cuidado: parallelStream nem sempre é mais rápido! Só compensa com **coleções grandes** e **operações pesadas**. Para coleções pequenas, o overhead de gerenciar threads é maior que o ganho.

56. O que é method reference e quais são seus tipos?
    R: Não sei

    **[Não respondida]** Method reference é um atalho para lambdas quando você apenas chama um método existente. Usa a sintaxe `::`:

    | Tipo                          | Sintaxe                    | Lambda equivalente           |
    |-------------------------------|----------------------------|-------------------------------|
    | Método estático               | `Integer::parseInt`        | `s -> Integer.parseInt(s)`    |
    | Método de instância (objeto)  | `System.out::println`      | `s -> System.out.println(s)`  |
    | Método de instância (tipo)    | `String::toUpperCase`      | `s -> s.toUpperCase()`        |
    | Construtor                    | `ArrayList::new`           | `() -> new ArrayList<>()`     |

57. Qual a diferença entre `forEach()` e `for-each` loop?
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

58. O que são default methods em interfaces?
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

59. O que mudou na API de data e hora do Java 8 (`java.time`)?
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

60. Quais foram as principais novidades do Java 11, 17 e 21 (LTS)?
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

61. O que são Records em Java?
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

62. O que são Sealed Classes?
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

63. O que é Pattern Matching no Java?
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

## 6. Multithreading e Concorrência

64. Qual a diferença entre processo e thread?
    R: Não sei

    **[Não respondida]**
    - **Processo**: um programa em execução com seu **próprio espaço de memória** isolado. Processos não compartilham memória entre si. Ex: dois programas Java rodando são dois processos.
    - **Thread**: uma unidade de execução **dentro de um processo**. Threads do mesmo processo **compartilham** a memória heap, mas cada uma tem sua própria stack. São mais leves que processos.

    ```
    Processo Java (JVM)
    ├── Thread main          (thread principal)
    ├── Thread GC            (garbage collector)
    ├── Thread worker-1      (sua thread)
    └── Thread worker-2      (sua thread)
    Todas compartilham: heap, metaspace
    Cada uma tem: sua própria stack
    ```

65. Quais são as formas de criar uma thread em Java?
    R: Podemos criar thread com Thread object e usar o run para inicia-la, porem não conheco outras.

    **[Parcial]** Cuidado: usa-se `start()` para iniciar, não `run()` (chamar `run()` direto executa na mesma thread!). Existem 4 formas principais:

    ```java
    // 1. Estender Thread
    class MinhaThread extends Thread {
        public void run() { System.out.println("Thread rodando"); }
    }
    new MinhaThread().start();

    // 2. Implementar Runnable (preferível - permite herdar outra classe)
    Runnable tarefa = () -> System.out.println("Runnable rodando");
    new Thread(tarefa).start();

    // 3. Implementar Callable (retorna valor e pode lançar exceção)
    Callable<Integer> callable = () -> 42;
    Future<Integer> future = executorService.submit(callable);

    // 4. Usar ExecutorService (mais profissional - gerencia pool de threads)
    ExecutorService executor = Executors.newFixedThreadPool(4);
    executor.submit(() -> System.out.println("Pool rodando"));
    ```

66. Qual a diferença entre `Runnable` e `Callable`?
    R: Não sei

    **[Não respondida]**
    | Característica  | Runnable           | Callable              |
    |-----------------|--------------------|-----------------------|
    | Método          | `run()`            | `call()`              |
    | Retorno         | `void` (nenhum)    | Retorna um valor `V`  |
    | Exceções        | Não lança checked  | Pode lançar exceções  |
    | Uso com         | `Thread`, `Executor` | `ExecutorService`   |
    | Resultado       | Sem resultado      | Via `Future<V>`       |

    ```java
    Runnable r = () -> System.out.println("Sem retorno");
    Callable<String> c = () -> { return "Com retorno!"; };

    Future<String> future = executor.submit(c);
    String resultado = future.get(); // bloqueia até ter resultado: "Com retorno!"
    ```

67. O que é sincronização e por que é necessária?
    R: Não sei

    **[Não respondida]** Sincronização é o mecanismo que garante que **apenas uma thread** acesse um recurso compartilhado por vez, evitando **condições de corrida** (race conditions):

    ```java
    // SEM sincronização (BUG!):
    class Contador {
        int valor = 0;
        void incrementar() { valor++; } // duas threads podem ler o mesmo valor
    }
    // Se 2 threads chamam incrementar() ao mesmo tempo,
    // ambas podem ler valor=0, incrementar para 1, e o resultado é 1 (deveria ser 2)

    // COM sincronização (correto):
    class Contador {
        int valor = 0;
        synchronized void incrementar() { valor++; } // apenas uma thread por vez
    }
    ```

68. Qual a diferença entre `synchronized` method e `synchronized` block?
    R: Não sei

    **[Não respondida]**
    - **Synchronized method**: trava o **objeto inteiro** (`this`) durante toda a execução do método. Mais simples mas menos flexível.
    - **Synchronized block**: trava apenas um **trecho específico** de código e permite escolher qual objeto usar como lock. Mais granular e performático.

    ```java
    // Synchronized method (trava this para o método inteiro)
    synchronized void metodo() {
        // todo o método é sincronizado
    }

    // Synchronized block (trava só o necessário)
    void metodo() {
        // código não sincronizado (outras threads podem executar)
        synchronized (this) {
            // só esta parte é sincronizada
        }
        // mais código não sincronizado
    }
    ```

    Prefira `synchronized block` quando só uma parte do método precisa de sincronização.

69. O que é deadlock e como evitá-lo?
    R: deadlock é quando uma thread está aguardando uma resposta de uma outra thread que depende daquela que está em standby, dessa maneira elas nunca vão concluir. Se não houver um fator externo para encerra-las realizar as thread dependentes de maneira sincronizada.

    **[Parcial]** A definição está boa! Porém, a solução "sincronizar" na verdade é a **causa** do deadlock, não a solução. Vamos clarificar:

    ```java
    // DEADLOCK:
    // Thread 1: trava A, espera B
    // Thread 2: trava B, espera A
    // -> ambas ficam esperando para sempre!
    ```

    Como **evitar**:
    - **Ordem consistente**: sempre adquira locks na mesma ordem em todas as threads.
    - **Timeout**: use `tryLock(timeout)` em vez de `synchronized` (com `ReentrantLock`).
    - **Evite locks aninhados**: minimize a necessidade de travar múltiplos recursos.
    - **Use pacote `java.util.concurrent`**: classes como `ConcurrentHashMap` já lidam com concorrência internamente.

70. O que é a palavra-chave `volatile`?
    R: Não sei

    **[Não respondida]** `volatile` garante que o valor de uma variável é sempre lido da **memória principal**, não do cache local da thread. Resolve o problema de **visibilidade**:

    ```java
    // Sem volatile: thread B pode nunca ver a mudança feita por thread A
    // (fica lendo do cache local)
    volatile boolean executando = true;

    // Thread A:
    executando = false; // escreve na memória principal

    // Thread B:
    while (executando) { } // lê da memória principal (vê a mudança!)
    ```

    Importante: `volatile` garante **visibilidade**, mas **não garante atomicidade**. Para operações como `i++`, use `AtomicInteger`.

71. Qual a diferença entre `wait()`, `notify()` e `notifyAll()`?
    R: Não sei

    **[Não respondida]** São métodos de `Object` usados para **comunicação entre threads** dentro de blocos synchronized:
    - **`wait()`**: a thread **libera o lock** e fica dormindo até ser notificada.
    - **`notify()`**: acorda **uma** thread que esteja esperando (qual? indeterminado).
    - **`notifyAll()`**: acorda **todas** as threads que estejam esperando.

    ```java
    // Padrão Produtor-Consumidor:
    synchronized (fila) {
        while (fila.isEmpty()) {
            fila.wait();    // consumidor espera até ter item
        }
        fila.remove();      // consome o item
    }

    synchronized (fila) {
        fila.add(item);
        fila.notifyAll();   // produtor avisa que tem item novo
    }
    ```

72. O que é o `ExecutorService` e quais são seus tipos de thread pool?
    R: Não sei

    **[Não respondida]** `ExecutorService` é uma interface que gerencia um **pool de threads** reutilizáveis, evitando o custo de criar/destruir threads manualmente:

    ```java
    // Tipos de pool (via Executors):
    Executors.newFixedThreadPool(4);      // 4 threads fixas
    Executors.newCachedThreadPool();       // cria threads sob demanda, reutiliza
    Executors.newSingleThreadExecutor();   // 1 thread (execução sequencial)
    Executors.newScheduledThreadPool(2);   // para tarefas agendadas/periódicas
    Executors.newVirtualThreadPerTaskExecutor(); // Virtual Threads (Java 21+)

    // Uso:
    ExecutorService executor = Executors.newFixedThreadPool(4);
    executor.submit(() -> System.out.println("Tarefa executada"));
    executor.shutdown(); // IMPORTANTE: sempre encerrar quando terminar
    ```

73. O que é `CompletableFuture` e como funciona?
    R: Não sei

    **[Não respondida]** `CompletableFuture` é uma classe do Java 8 para **programação assíncrona**. Permite encadear operações que executam em threads separadas, sem bloquear:

    ```java
    CompletableFuture.supplyAsync(() -> buscarUsuario(id))     // executa em outra thread
        .thenApply(usuario -> usuario.getEmail())               // transforma resultado
        .thenAccept(email -> enviarNotificacao(email))          // consome resultado
        .exceptionally(erro -> { log.error(erro); return null; }); // trata erros

    // Combinar múltiplos futuros:
    CompletableFuture<String> futuro1 = CompletableFuture.supplyAsync(() -> "Hello");
    CompletableFuture<String> futuro2 = CompletableFuture.supplyAsync(() -> "World");
    futuro1.thenCombine(futuro2, (a, b) -> a + " " + b); // "Hello World"
    ```

74. Qual a diferença entre `sleep()` e `wait()`?
    R: Não sei

    **[Não respondida]**
    | Característica  | `Thread.sleep()`       | `Object.wait()`           |
    |-----------------|------------------------|---------------------------|
    | Classe          | `Thread`               | `Object`                  |
    | Lock            | **NÃO** libera o lock  | **Libera** o lock         |
    | Despertar       | Após o tempo expirar   | Por `notify()`/`notifyAll()` |
    | Contexto        | Qualquer lugar         | Dentro de `synchronized`  |
    | Propósito       | Pausar a thread        | Comunicação entre threads |

75. O que é a classe `ThreadLocal`?
    R: Não sei

    **[Não respondida]** `ThreadLocal` permite que cada thread tenha sua **própria cópia** de uma variável, evitando compartilhamento e problemas de concorrência:

    ```java
    ThreadLocal<String> usuario = new ThreadLocal<>();

    // Thread A:
    usuario.set("João");
    usuario.get(); // "João"

    // Thread B:
    usuario.set("Maria");
    usuario.get(); // "Maria" (não afeta Thread A)
    ```

    Uso comum: armazenar informações do usuário logado em aplicações web (cada requisição é uma thread).
    Cuidado: sempre use `remove()` ao final para evitar **memory leaks**, especialmente com thread pools.

76. O que são locks reentrantes (`ReentrantLock`)?
    R: Não sei

    **[Não respondida]** `ReentrantLock` é uma alternativa mais flexível ao `synchronized`. "Reentrante" significa que a mesma thread pode adquirir o lock **múltiplas vezes** sem causar deadlock consigo mesma:

    ```java
    ReentrantLock lock = new ReentrantLock();

    lock.lock();
    try {
        // código protegido
        lock.lock(); // mesma thread pode adquirir de novo (reentrante)
        try { /* ... */ } finally { lock.unlock(); }
    } finally {
        lock.unlock(); // SEMPRE no finally!
    }

    // Vantagem sobre synchronized: tryLock com timeout
    if (lock.tryLock(5, TimeUnit.SECONDS)) {
        try { /* ... */ } finally { lock.unlock(); }
    } else {
        // não conseguiu o lock em 5 segundos - evita deadlock!
    }
    ```

77. O que é o problema de visibilidade de memória em threads?
    R: Não sei

    **[Não respondida]** Cada thread pode manter uma **cópia local (cache)** de variáveis para performance. O problema é que alterações feitas por uma thread podem **não ser visíveis** para outras:

    ```java
    boolean parar = false;

    // Thread A (modifica):
    parar = true; // escreveu no cache local, não na memória principal

    // Thread B (lê):
    while (!parar) { } // lê do seu cache local -> nunca vê true -> loop infinito!
    ```

    Soluções:
    - **`volatile`**: garante leitura/escrita na memória principal.
    - **`synchronized`**: ao entrar/sair do bloco, sincroniza caches com memória principal.
    - **`Atomic*`**: classes como `AtomicBoolean` que garantem visibilidade e atomicidade.

## 7. Generics

78. O que são Generics e por que foram introduzidos?
    R: Generics são Classes que permitem receber objetos dinamicamente, dessa maneira você consegue escrever funcões genericas para serem reutilizadas diferentes classes.

    **[Parcial]** A ideia de reuso está correta! Complementando, Generics foram introduzidos no Java 5 por dois motivos principais:
    - **Segurança de tipo em compilação**: detecta erros de tipo antes de executar, em vez de `ClassCastException` em runtime.
    - **Eliminação de casts**: não precisa mais fazer cast manual ao retirar elementos de coleções.

    ```java
    // Sem generics (Java < 5) - perigoso:
    List lista = new ArrayList();
    lista.add("texto");
    lista.add(123); // compila! Mas...
    String s = (String) lista.get(1); // ClassCastException em runtime!

    // Com generics - seguro:
    List<String> lista = new ArrayList<>();
    lista.add("texto");
    lista.add(123); // ERRO DE COMPILAÇÃO! Detecta o problema antes
    String s = lista.get(0); // sem cast necessário
    ```

79. Qual a diferença entre `<? extends T>` e `<? super T>`?
    R: Não sei

    **[Não respondida]** São wildcards bounded (coringas limitados):
    - **`<? extends T>`** (upper bound): aceita **T ou qualquer subtipo** de T. Use para **ler** da coleção (produtor).
    - **`<? super T>`** (lower bound): aceita **T ou qualquer supertipo** de T. Use para **escrever** na coleção (consumidor).

    Mnemônico: **PECS** (Producer Extends, Consumer Super)

    ```java
    // extends: pode LER como Animal (ou mais genérico)
    List<? extends Animal> animais = listaDeCachorros; // ok
    Animal a = animais.get(0); // ok (leitura)
    animais.add(new Cachorro()); // ERRO! Não pode adicionar

    // super: pode ESCREVER Animal (ou mais específico)
    List<? super Cachorro> lista = listaDeAnimais; // ok
    lista.add(new Cachorro()); // ok (escrita)
    Cachorro c = lista.get(0); // ERRO! Não sabe o tipo exato
    ```

80. O que é Type Erasure?
    R: Não sei

    **[Não respondida]** Type Erasure é o processo pelo qual o compilador Java **remove** todas as informações de tipos genéricos em tempo de compilação, substituindo por `Object` (ou pelo bound, se houver). Em runtime, generics não existem:

    ```java
    // Seu código:
    List<String> lista = new ArrayList<>();
    lista.add("texto");
    String s = lista.get(0);

    // Após type erasure (o que a JVM vê):
    List lista = new ArrayList();
    lista.add("texto");
    String s = (String) lista.get(0); // cast inserido pelo compilador
    ```

    Consequência: você não pode fazer `new T()`, `instanceof List<String>` ou `new T[]` em runtime, pois o tipo genérico não existe mais.

81. É possível criar um array de tipos genéricos? Por quê?
    R: Não sei

    **[Não respondida]** **Não**, Java não permite criar arrays de tipos genéricos diretamente:
    ```java
    List<String>[] array = new List<String>[10]; // ERRO DE COMPILAÇÃO!
    ```

    Por causa do **type erasure + covariância de arrays**: arrays em Java sabem seu tipo em runtime (e verificam), mas generics não existem em runtime. Se fosse permitido, seria possível inserir tipos errados sem erro:

    ```java
    // Se fosse permitido (hipoteticamente):
    Object[] arr = new List<String>[10]; // covariância de array permite isso
    arr[0] = new ArrayList<Integer>();   // sem erro em runtime (type erasure!)
    // Quebra total de type safety!
    ```

    Alternativa: use `List<List<String>>` em vez de arrays de generics.

82. O que é o diamond operator (`<>`)?
    R: Não sei

    **[Não respondida]** O diamond operator `<>` (Java 7) permite omitir o tipo genérico do lado direito quando o compilador consegue **inferir** o tipo:

    ```java
    // Antes do Java 7 (redundante):
    Map<String, List<Integer>> mapa = new HashMap<String, List<Integer>>();

    // Com diamond operator (Java 7+):
    Map<String, List<Integer>> mapa = new HashMap<>(); // compilador infere os tipos

    // Java 10+ com var:
    var mapa = new HashMap<String, List<Integer>>(); // infere tudo
    ```

## 8. Testes

83. Qual a diferença entre testes unitários e testes de integração?
    R: Testes unitários servem para testar a menor unidade de código, fazendo com que eles sejam coesos e não vão fugir daquele que é suposto realizar, já testes de integração são testes mais complexos que podem validar uma cadeia inteira da aplicação ou um serviço especifico.

    **[Correto]** Excelente resposta! Para complementar com terminologia técnica:
    - **Unitários**: testam uma **classe/método isoladamente**, mockando dependências. Rápidos (milissegundos). Rodam sem infraestrutura.
    - **Integração**: testam a **interação entre componentes** reais (banco, API, filas). Mais lentos. Precisam de infraestrutura.

84. O que é TDD (Test Driven Development)?
    R: É você escrever o test antes do código, dessa maneira você vai está detalhando a funcionalidade do negócio e depois vai escrevendo o código afim de fazer os testes passarem e concluir a feature.

    **[Correto]** Muito boa! Complementando com o ciclo oficial do TDD (**Red-Green-Refactor**):
    1. **Red**: escreve o teste (que falha, pois o código ainda não existe)
    2. **Green**: escreve o código **mínimo** necessário para o teste passar
    3. **Refactor**: melhora o código mantendo os testes passando

85. O que são mocks e quando usá-los?
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

86. Qual a diferença entre `@Mock` e `@InjectMocks` no Mockito?
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

87. O que é o JUnit 5 e quais suas principais anotações?
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

---

# Perguntas sobre Spring Boot

## 9. Conceitos Básicos do Spring

88. O que é o Spring Framework e qual problema ele resolve?
    R: Spring Framework como qualquer outro framework, é uma estrutura que orienta desenvolvedores de como escrever códigos aplicações Java. Além disso ele possui recursos poderosos para facilitar a construções de serviços web padronizados, testaveis e com agilidade. O Spring possui diversos componentes modulos que implementam segurança, qualidade, auto gerenciamento e muitos outros.

    **[Parcial]** A ideia geral está correta, mas faltou mencionar o problema central que o Spring resolve: o **gerenciamento de dependências e o acoplamento entre objetos**. Antes do Spring, os desenvolvedores precisavam instanciar e gerenciar manualmente todas as dependências das suas classes, o que gerava código fortemente acoplado e difícil de testar. O Spring resolve isso com:
    - **Inversão de Controle (IoC)**: o framework assume o controle da criação e do ciclo de vida dos objetos.
    - **Injeção de Dependência (DI)**: o Spring injeta automaticamente as dependências necessárias, promovendo baixo acoplamento.
    - **Programação declarativa**: com anotações e configurações, reduz o código boilerplate (ex.: transações com `@Transactional`, segurança com `@Secured`).
    - Além disso, oferece um ecossistema modular (Spring MVC, Spring Security, Spring Data, etc.) para resolver problemas comuns de aplicações enterprise.

89. O que é Inversão de Controle (IoC) e Injeção de Dependência (DI)?
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

90. Qual a diferença entre Spring e Spring Boot?
    R: Spring é o conjunto de modulos que implenta recursos especificos, por exemplo o Spring Security tem implementações de modelos de segurança para serem usados na aplicações, porém precisa ser configurado corretamente. O spring boot são modulos que já possuem configurações que facilitam ainda mais o desenvolvimento, com o springboot algumas configurações padrão já são definidas para que os desenvolvedores não precisem tem que definir tudo do zero.

    **[Parcial]** A ideia central está correta, mas vale detalhar melhor as diferenças:
    - **Spring Framework**: é o framework base que oferece IoC, DI, AOP, Spring MVC, etc. Requer configuração manual (XML ou classes `@Configuration`). Você precisa configurar servidor, datasource, view resolvers, etc.
    - **Spring Boot**: é uma camada **sobre** o Spring Framework que oferece:
      - **Auto-configuração**: detecta as dependências no classpath e configura automaticamente (ex.: se tem H2 no classpath, configura um DataSource automaticamente).
      - **Servidor embutido**: vem com Tomcat/Jetty/Undertow embutido, sem necessidade de deploy em servidor externo.
      - **Starters**: dependências pré-configuradas que agrupam bibliotecas comuns.
      - **Opinionated defaults**: convenção sobre configuração — funciona "out of the box" mas permite customização.
    - Resumo: Spring Boot **não substitui** o Spring, ele **facilita o uso** do Spring eliminando a configuração manual.

91. O que são Spring Boot Starters?
    R: Starters são conjuntos de módulos que unidos entregam praticamente uma funcionalidade completa, com starter-web por exemplo, já se tem uma aplicação backend web completa para ser executada.

    **[Parcial]** A ideia está correta, mas tecnicamente Starters são **dependências Maven/Gradle pré-configuradas** que agrupam um conjunto de bibliotecas e configurações automáticas para uma funcionalidade específica. Eles seguem a convenção de nome `spring-boot-starter-*`. Exemplos:
    - `spring-boot-starter-web`: Spring MVC + Tomcat embutido + Jackson (JSON)
    - `spring-boot-starter-data-jpa`: Spring Data JPA + Hibernate + HikariCP (connection pool)
    - `spring-boot-starter-security`: Spring Security + configuração padrão de autenticação
    - `spring-boot-starter-test`: JUnit + Mockito + AssertJ + Spring Test

    O benefício é não precisar declarar cada biblioteca individualmente e se preocupar com compatibilidade de versões — o starter garante que tudo funciona junto.

92. O que é o arquivo `application.properties` / `application.yml`?
    R: é o arquivo principal para definirmos as configurações do projeto, no application.properties podemos definir valores para debug level, porta da aplicações, além disso podemos ter application properties para diferentes profiles, adicionar apenas um termo como application-dev.properties, dessa maneira utilizamos a flag --spring.profiles-active=dev e isso já altera o perfil utilizado pelo spring. Além disso podemos escrever o mesmo arquivo em YAML, utilizando o application.yml, mas isso só muda a linguagem o proposito é o mesmo.

    **[Correto]** Excelente resposta! Cobriu os pontos principais: configuração centralizada, profiles com `application-{profile}.properties`, ativação via `--spring.profiles-active`, e equivalência entre `.properties` e `.yml`. Um complemento: além da flag na linha de comando, o profile pode ser ativado via variável de ambiente `SPRING_PROFILES_ACTIVE=dev` ou dentro do próprio `application.properties` com `spring.profiles.active=dev`.

93. Como funciona a auto-configuração (auto-configuration) do Spring Boot?
    R: não sei

    **[Não respondida]** A auto-configuração é um dos pilares do Spring Boot. Funciona assim:
    1. Quando a aplicação inicia, o Spring Boot escaneia as classes anotadas com `@EnableAutoConfiguration` (já inclusa em `@SpringBootApplication`).
    2. Ele analisa quais dependências estão presentes no **classpath** (ex.: se `spring-boot-starter-data-jpa` está no projeto, ele detecta classes do Hibernate).
    3. Com base nisso, registra automaticamente beans com configurações padrão (ex.: cria um `DataSource`, `EntityManagerFactory`, etc.).
    4. As auto-configurações ficam em classes `@Configuration` dentro de JARs, registradas no arquivo `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
    5. Usa anotações condicionais como `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` para decidir se aplica ou não a configuração.

    Se você definir um bean manualmente (ex.: seu próprio `DataSource`), a auto-configuração **recua** graças ao `@ConditionalOnMissingBean`, respeitando sua configuração customizada.

94. O que é o Spring Initializr?
    R: o spring initializr é uma aplicação web que está disponivel para criar aplicações spring de acordo com os parametros escolhidos pelo usuários, podemos definir a linguagem que será usada (java ou kotlin), podemos definir a versao do java, os pacotes spring que serão importados, o gerenciador de pacote (maven, gradle-kotlin, gradle-groovy) e alguns outros recursos.

    **[Correto]** Boa resposta! Um complemento: o Spring Initializr está disponível em [start.spring.io](https://start.spring.io) e também é acessível diretamente de IDEs como IntelliJ IDEA e VS Code (via extensão Spring Boot). Além dos parâmetros que você citou, podemos definir o Group, Artifact, tipo de empacotamento (JAR/WAR) e a versão do Spring Boot.

## 10. Beans e Configuração

95. O que é um Bean no contexto do Spring?
    R: Bean é a instancia de uma classe que é invocada no boot de uma aplicações spring, dessa maneira se for necessario acessar esse bean por diferentes classes ele vai estar disponivel em diferentes escopos

    **[Parcial]** A ideia está correta, mas vale refinar: um Bean é um **objeto gerenciado pelo container IoC do Spring** (ApplicationContext). Não é apenas "invocado no boot" — o Spring é responsável por todo o ciclo de vida desse objeto: criação, injeção de dependências, inicialização e destruição. Um bean pode ser definido de várias formas:
    - Via anotações de estereótipo: `@Component`, `@Service`, `@Repository`, `@Controller`
    - Via método `@Bean` dentro de uma classe `@Configuration`
    - Via XML (modo legado)

    O ponto principal é que o **Spring controla** esses objetos, diferente de objetos que você cria com `new`.

96. Quais são os escopos de um Bean (`singleton`, `prototype`, `request`, `session`)?
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

97. Qual a diferença entre `@Component`, `@Service`, `@Repository` e `@Controller`?
    R: @Component é uma maneira de definir a classe como @Bean porém sendo representada como @Component, de maneira geral é apenas uma maneira semântica de representar os Beans. Com isso temos especificações, @Service é um filho de Component representando um component mais especifico.
    @Repository representa um component especifico para armazenamento de dados.
    @Controller presenta uma camada de apresentação do modelo MVC.

    **[Parcial]** A ideia de que são especializações semânticas de `@Component` está correta! Mas há diferenças técnicas importantes além da semântica:
    - **`@Component`**: anotação genérica que marca a classe como um bean gerenciado pelo Spring.
    - **`@Service`**: especialização de `@Component` para a camada de **lógica de negócio**. Funcionalmente é igual ao `@Component` (apenas semântica).
    - **`@Repository`**: especialização para a camada de **acesso a dados**. Tem um diferencial técnico: ativa a **tradução automática de exceções** — exceções específicas do banco (ex.: `SQLException`) são convertidas em `DataAccessException` do Spring, unificando o tratamento de erros.
    - **`@Controller`**: especialização para a camada **web/apresentação**. Habilita o tratamento de requisições HTTP (mapeamento de rotas com `@RequestMapping`).

    Todas são detectadas pelo component scan (`@ComponentScan`) e registradas como beans no container.

98. Qual a diferença entre `@Autowired` por campo, construtor e setter? Qual é a recomendada?
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

99. O que é `@Qualifier` e quando usar?
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

100. O que é `@Configuration` e `@Bean`?
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

101. Qual a diferença entre `@Primary` e `@Qualifier`?
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

102. O que é o ciclo de vida de um Bean no Spring?
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

## 11. API REST com Spring Boot

103. Qual a diferença entre `@Controller` e `@RestController`?
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

104. O que são `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`?
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

105. Qual a diferença entre `@RequestParam`, `@PathVariable` e `@RequestBody`?
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

106. Como fazer tratamento global de exceções com `@ControllerAdvice` e `@ExceptionHandler`?
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

107. O que é `ResponseEntity` e quando usar?
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

108. Como fazer validação de dados com Bean Validation (`@Valid`, `@NotNull`, `@Size`)?
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

109. O que é HATEOAS?
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

110. Como versionar uma API REST?
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

111. O que é o Swagger/OpenAPI e como integrar com Spring Boot?
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

## 12. Spring Security

112. O que é o Spring Security e como funciona o filtro de segurança?
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

113. Qual a diferença entre autenticação e autorização?
    R: Autenticação é garantir que aquela requisição possui as credencias validas para acessar aquele recurso. Já autorização corresponde a validação a nivel de acesso, por exemplo, você pode categoria suas requisiçÕes a fim de que só administradores possam acessar aquele endpoint, ou remover qualquer autorização para acessar um endpoint publico.

    **[Parcial]** A ideia está correta, mas a definição de autenticação precisa de um ajuste — autenticação não é sobre "acessar aquele recurso" (isso é autorização). São conceitos distintos:
    - **Autenticação** (Authentication — "quem é você?"): é o processo de **verificar a identidade** do usuário. Valida se as credenciais (usuário/senha, token, certificado) são válidas. Responde: **"Você é quem diz ser?"**
    - **Autorização** (Authorization — "o que você pode fazer?"): é o processo de **verificar permissões** após o usuário já estar autenticado. Responde: **"Você tem permissão para acessar este recurso?"**

    Fluxo: Autenticação → Autorização (primeiro identifica, depois verifica permissões).

    No Spring Security: autenticação é feita por `AuthenticationManager`/`AuthenticationProvider`; autorização é feita por `@PreAuthorize`, `@Secured`, ou regras no `SecurityFilterChain`.

114. O que é JWT (JSON Web Token) e como implementar com Spring Security?
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

115. O que são `@PreAuthorize` e `@Secured`?
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

116. Como configurar CORS no Spring Boot?
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

117. O que é OAuth2 e como integrar com Spring Security?
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

## 13. Spring Boot Avançado

118. O que é Spring AOP (Aspect-Oriented Programming) e quando usar?
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

119. O que são Profiles no Spring Boot e como usá-los?
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

120. O que é o Spring Actuator e quais endpoints ele expõe?
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

121. Como criar um starter customizado no Spring Boot?
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

122. O que é o padrão Circuit Breaker e como implementar com Resilience4j?
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

123. Qual a diferença entre comunicação síncrona e assíncrona entre microservices?
    R: Comunicação sincrona é uma comunicação que aguarda a resposta até ter o resultado final, utilzando REST quando fazemos uma requisição HTTP, só é concluido com sucesso quando recebemos uma resposta do microserviço.
    No caso de Comunicação assincrona, é quando enviamos eventos e não aguardamos por uma resposta, como mensagem em filas ou kafka.
    Podemos ter a confirmação que a mensagem foi enviada, mas para termos uma resposta, mesmo que imediata, precisamos ter um consumidor, ou realizar a chamada em outro endpoint para fazer se o processo foi concluido (pooling)

    **[Correto]** Ótima resposta! Cobriu bem os conceitos, inclusive o detalhe do polling para verificar o resultado. Só um complemento para consolidar:
    - **Síncrona**: REST (HTTP), gRPC. O chamador **bloqueia** esperando a resposta. Mais simples, mas gera **acoplamento temporal** (se o serviço destino estiver fora, a requisição falha).
    - **Assíncrona**: filas (RabbitMQ, SQS), streaming (Kafka). O chamador **não bloqueia**. Gera **desacoplamento temporal** (o serviço destino pode processar depois). Mais resiliente, mas mais complexo de implementar e debugar.
    - Nota: a palavra correta é **polling** (com uma letra "o") — verificação periódica.

124. O que é Spring Cloud e quais são seus principais módulos?
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

125. Como funciona o `@Async` no Spring?
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

126. O que é o `@Transactional` e como funciona a propagação de transações?
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

127. O que é o Spring Scheduler (`@Scheduled`)?
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

---

# Perguntas sobre JPA e Hibernate

## 14. Conceitos Fundamentais de JPA/Hibernate

128. O que é JPA e qual a diferença entre JPA e Hibernate?
129. O que é ORM (Object-Relational Mapping)?
130. O que é uma entidade JPA e como definir uma?
131. Qual a diferença entre `EntityManager` e `SessionFactory`?
132. O que é o `persistence.xml` e o que ele configura?
133. O que é o contexto de persistência (Persistence Context)?

## 15. Mapeamento de Entidades

134. Quais são as anotações básicas de mapeamento (`@Entity`, `@Table`, `@Column`, `@Id`)?
135. Quais são as estratégias de geração de ID (`@GeneratedValue`)?
136. Qual a diferença entre `@OneToOne`, `@OneToMany`, `@ManyToOne` e `@ManyToMany`?
137. O que é o `mappedBy` e quando usar?
138. O que é `cascade` e quais são seus tipos?
139. Qual a diferença entre `FetchType.LAZY` e `FetchType.EAGER`?
140. O que é `@Embeddable` e `@Embedded`?
141. Como mapear herança em JPA? Quais são as estratégias (`SINGLE_TABLE`, `TABLE_PER_CLASS`, `JOINED`)?
142. O que é `@MappedSuperclass`?

## 16. Consultas e Performance

143. Qual a diferença entre JPQL, Criteria API e SQL nativo?
144. O que é o problema N+1 e como resolvê-lo?
145. Qual a diferença entre `fetch join` e `join` em JPQL?
146. O que é o cache de primeiro nível e de segundo nível no Hibernate?
147. O que é o `@NamedQuery` e `@NamedNativeQuery`?
148. Como funciona a paginação com JPA?
149. O que é o `@EntityGraph` e quando usar?
150. O que é Batch Processing no Hibernate e como configurar?

## 17. Transações e Estados de Entidade

151. Quais são os estados de uma entidade no JPA (`transient`, `managed`, `detached`, `removed`)?
152. O que são os métodos `persist()`, `merge()`, `remove()` e `detach()`?
153. Qual a diferença entre `save()` e `saveAndFlush()` no Spring Data JPA?
154. O que é Dirty Checking no Hibernate?
155. O que é Optimistic Locking e Pessimistic Locking?
156. Qual a diferença entre `@Version` para controle de concorrência?

## 18. Spring Data JPA

157. O que é o Spring Data JPA e qual vantagem ele traz?
158. O que são Query Methods (derived queries) e como funcionam?
159. Qual a diferença entre `JpaRepository`, `CrudRepository` e `PagingAndSortingRepository`?
160. O que é `@Query` e quando usar?
161. Como fazer projeções (Projections) no Spring Data JPA?
162. O que é o `Specification` e quando usar?
163. Como fazer auditoria de entidades com `@CreatedDate`, `@LastModifiedDate`?

---

# Perguntas sobre SQL e Bancos de Dados Relacionais

## 19. Fundamentos de SQL

164. Qual a diferença entre `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN` e `FULL OUTER JOIN`?
165. Qual a diferença entre `WHERE` e `HAVING`?
166. O que são funções de agregação (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) e como usá-las com `GROUP BY`?
167. Qual a diferença entre `UNION` e `UNION ALL`?
168. O que são subqueries (subconsultas) e quando usá-las?
169. Qual a diferença entre `DELETE`, `TRUNCATE` e `DROP`?
170. O que é uma transação SQL e o que significam as propriedades ACID?
171. Qual a diferença entre `IN`, `EXISTS` e `JOIN` para filtrar dados? Quando usar cada um?
172. O que são índices (indexes) e como eles melhoram a performance de consultas?
173. Qual a diferença entre índice clusterizado (clustered) e não clusterizado (non-clustered)?

## 20. Modelagem e RDBMS

174. O que são chaves primárias (Primary Key) e chaves estrangeiras (Foreign Key)?
175. O que é normalização de dados? Explique as três primeiras formas normais (1NF, 2NF, 3NF).
176. Quando faz sentido desnormalizar um banco de dados?
177. Qual a diferença entre `CHAR`, `VARCHAR` e `TEXT`?
178. O que são constraints (`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `FOREIGN KEY`)?
179. O que são stored procedures e functions? Quais as diferenças?
180. O que são triggers e quando usá-los?
181. O que são views e materialized views? Qual a diferença?
182. Quais as principais diferenças entre PostgreSQL, Oracle e SQL Server?
183. O que é um plano de execução (execution plan) e como usá-lo para otimizar queries?

---

# Perguntas sobre Maven

## 21. Maven

184. O que é o Maven e qual problema ele resolve no desenvolvimento Java?
185. O que é o arquivo `pom.xml` e quais são seus elementos principais?
186. O que é o ciclo de vida do Maven (`clean`, `default`, `site`) e quais são as fases principais?
187. Qual a diferença entre `mvn compile`, `mvn package`, `mvn install` e `mvn deploy`?
188. O que são dependências no Maven e como funciona o gerenciamento de dependências transitivas?
189. Qual a diferença entre `<dependencies>` e `<dependencyManagement>`?
190. O que é o escopo (scope) de uma dependência (`compile`, `test`, `provided`, `runtime`)?
191. O que são plugins no Maven e como configurá-los?
192. O que é um repositório local, remoto e central no Maven?
193. O que são profiles no Maven e quando usá-los?
194. Qual a diferença entre `mvn clean install` e `mvn clean install -DskipTests`?
195. O que é um archetype no Maven?
196. Como resolver conflitos de dependências no Maven?
197. Qual a diferença entre Maven e Gradle?

---

# Perguntas sobre GIT

## 22. GIT

198. Qual a diferença entre `git merge` e `git rebase`? Quando usar cada um?
199. O que é o staging area (index) no Git e como funciona o fluxo `add` -> `commit` -> `push`?
200. Como resolver um conflito de merge no Git?
201. Qual a diferença entre `git pull` e `git fetch`?
202. O que é o `git stash` e quando usá-lo?
203. O que são branches e qual a importância de uma estratégia de branching (Git Flow, GitHub Flow, Trunk-Based)?
204. Qual a diferença entre `git reset`, `git revert` e `git checkout`?
205. O que é um `cherry-pick` e quando usá-lo?
206. Qual a diferença entre `git reset --soft`, `--mixed` e `--hard`?
207. O que é o `.gitignore` e como configurá-lo corretamente?
208. O que são tags no Git e para que servem?
209. O que é `git bisect` e como usá-lo para encontrar bugs?
210. Como funciona o `git squash` e quando é útil?
211. O que são Git hooks e como usá-los?

---

# Perguntas sobre Troubleshooting e Bug Fixing

## 23. Troubleshooting e Debug

212. Quais são os passos que você segue para investigar e resolver um bug em produção?
213. Como usar o debugger da IDE (breakpoints, step over, step into, watch) para investigar um problema?
214. O que é stack trace em Java e como interpretá-lo para encontrar a causa raiz de uma exceção?
215. Quais são as exceções mais comuns em Java (`NullPointerException`, `ClassCastException`, `StackOverflowError`, `OutOfMemoryError`) e como diagnosticá-las?
216. Como analisar logs de uma aplicação para identificar problemas? Qual a importância de níveis de log (`DEBUG`, `INFO`, `WARN`, `ERROR`)?
217. O que é um memory leak em Java e como identificá-lo?
218. O que é um deadlock e como diagnosticá-lo em uma aplicação Java?
219. Quais ferramentas de profiling e monitoramento você conhece (VisualVM, JConsole, JProfiler, Actuator)?
220. Como investigar problemas de performance em uma API REST (latência alta, timeout)?
221. O que são thread dumps e heap dumps e quando usá-los?
222. Como debugar um problema que só acontece em um ambiente específico (staging/produção) mas não localmente?

---

# Perguntas sobre Code Review e Otimização

## 24. Code Review e Boas Práticas

223. O que você considera mais importante ao fazer um code review?
224. O que são code smells? Cite exemplos comuns.
225. O que são os princípios SOLID e como eles se aplicam na prática?
226. O que é o princípio DRY (Don't Repeat Yourself) e quando ele pode ser aplicado em excesso?
227. Qual a diferença entre complexidade ciclomática alta e código limpo? Como reduzir a complexidade?
228. Quais padrões de projeto (Design Patterns) você mais utiliza no dia a dia? Dê exemplos práticos.
229. O que é refatoração e quais técnicas de refatoração você conhece (extract method, rename, move, etc.)?
230. Como identificar e otimizar queries N+1 em uma aplicação Spring/JPA?
231. Quais práticas você segue para escrever código testável?
232. O que é análise estática de código e quais ferramentas você conhece (SonarQube, Checkstyle, PMD)?
233. Como avaliar se uma dependência externa deve ser adicionada ao projeto?

---

# Perguntas sobre Documentação Técnica

## 25. Documentação Técnica

234. Qual a importância de documentação técnica em um projeto de software?
235. O que é Javadoc e como usá-lo para documentar classes e métodos?
236. Quando usar comentários no código e quando o código deve ser autoexplicativo?
237. O que deve conter um bom README de projeto?
238. Como documentar uma API REST? Qual a diferença entre Swagger/OpenAPI e documentação manual?
239. O que é um ADR (Architecture Decision Record) e quando usá-lo?
240. Como documentar processos de deploy e configuração de ambiente?
241. O que deve conter uma boa mensagem de commit?
242. Como escrever documentação de troubleshooting/runbook para a equipe de operações?
243. Qual a diferença entre documentação técnica (para desenvolvedores) e documentação funcional (para stakeholders)?
