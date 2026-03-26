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
89. O que é Inversão de Controle (IoC) e Injeção de Dependência (DI)?
90. Qual a diferença entre Spring e Spring Boot?
91. O que são Spring Boot Starters?
92. O que é o arquivo `application.properties` / `application.yml`?
93. Como funciona a auto-configuração (auto-configuration) do Spring Boot?
94. O que é o Spring Initializr?

## 10. Beans e Configuração

95. O que é um Bean no contexto do Spring?
96. Quais são os escopos de um Bean (`singleton`, `prototype`, `request`, `session`)?
97. Qual a diferença entre `@Component`, `@Service`, `@Repository` e `@Controller`?
98. Qual a diferença entre `@Autowired` por campo, construtor e setter? Qual é a recomendada?
99. O que é `@Qualifier` e quando usar?
100. O que é `@Configuration` e `@Bean`?
101. Qual a diferença entre `@Primary` e `@Qualifier`?
102. O que é o ciclo de vida de um Bean no Spring?

## 11. API REST com Spring Boot

103. Qual a diferença entre `@Controller` e `@RestController`?
104. O que são `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`?
105. Qual a diferença entre `@RequestParam`, `@PathVariable` e `@RequestBody`?
106. Como fazer tratamento global de exceções com `@ControllerAdvice` e `@ExceptionHandler`?
107. O que é `ResponseEntity` e quando usar?
108. Como fazer validação de dados com Bean Validation (`@Valid`, `@NotNull`, `@Size`)?
109. O que é HATEOAS?
110. Como versionar uma API REST?
111. O que é o Swagger/OpenAPI e como integrar com Spring Boot?

## 12. Spring Security

112. O que é o Spring Security e como funciona o filtro de segurança?
113. Qual a diferença entre autenticação e autorização?
114. O que é JWT (JSON Web Token) e como implementar com Spring Security?
115. O que são `@PreAuthorize` e `@Secured`?
116. Como configurar CORS no Spring Boot?
117. O que é OAuth2 e como integrar com Spring Security?

## 13. Spring Boot Avançado

118. O que é Spring AOP (Aspect-Oriented Programming) e quando usar?
119. O que são Profiles no Spring Boot e como usá-los?
120. O que é o Spring Actuator e quais endpoints ele expõe?
121. Como criar um starter customizado no Spring Boot?
122. O que é o padrão Circuit Breaker e como implementar com Resilience4j?
123. Qual a diferença entre comunicação síncrona e assíncrona entre microservices?
124. O que é Spring Cloud e quais são seus principais módulos?
125. Como funciona o `@Async` no Spring?
126. O que é o `@Transactional` e como funciona a propagação de transações?
127. O que é o Spring Scheduler (`@Scheduled`)?

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
