# Orientação a Objetos (OOP)

1. Quais são os quatro pilares da Orientação a Objetos?
    R: Os quatro pilares são:
    - **Encapsulamento**: esconder os detalhes internos de uma classe, expondo apenas o necessário através de métodos públicos (getters/setters). Protege o estado interno do objeto.
    - **Herança**: uma classe (filha) pode herdar atributos e métodos de outra classe (pai), promovendo reuso de código. Em Java, usa-se `extends`.
    - **Polimorfismo**: capacidade de um mesmo método se comportar de maneiras diferentes dependendo do objeto que o chama. "Muitas formas".
    - **Abstração**: representar apenas as características essenciais de um objeto, escondendo a complexidade. Implementado via classes abstratas e interfaces.

    Dica para memorizar: **E.H.P.A.** (Encapsulamento, Herança, Polimorfismo, Abstração).

2. Qual a diferença entre abstração e encapsulamento?
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

3. Qual a diferença entre classe abstrata e interface?
    R:

    | Característica        | Classe Abstrata              | Interface                          |
    |-----------------------|------------------------------|------------------------------------|
    | Herança               | `extends` (apenas 1)         | `implements` (várias)              |
    | Métodos               | Abstratos e concretos         | Abstratos e `default` (Java 8+)   |
    | Atributos             | Qualquer tipo                 | Apenas `public static final`       |
    | Construtores          | Sim                           | Não                                |
    | Modificadores acesso  | Qualquer                      | Métodos são `public` por padrão    |

    Regra prática: use **interface** para definir um contrato ("o que fazer") e **classe abstrata** quando quiser compartilhar código comum entre classes relacionadas ("como fazer parcialmente").

4. Quando usar classe abstrata e quando usar interface?
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

5. O que é polimorfismo? Dê exemplos de polimorfismo em tempo de compilação e em tempo de execução.
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

6. Qual a diferença entre sobrecarga (overloading) e sobrescrita (overriding)?
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

7. O que é herança e quais são seus tipos em Java?
    R: Herança é o mecanismo onde uma classe (filha/subclasse) **herda** atributos e métodos de outra classe (pai/superclasse), promovendo reuso de código. Usa-se a palavra `extends`.

    Tipos de herança em Java:
    - **Simples**: `class B extends A` (B herda de A)
    - **Multinível**: `class C extends B`, `class B extends A` (cadeia A -> B -> C)
    - **Hierárquica**: `class B extends A`, `class C extends A` (B e C herdam de A)

    Java **não** suporta herança múltipla de classes (class C extends A, B), mas permite implementar múltiplas interfaces.

8. Por que Java não suporta herança múltipla de classes?
    R: Por causa do **Problema do Diamante**: se duas classes pai (`A` e `B`) têm um método com o mesmo nome e uma classe filha (`C`) herda de ambas, o compilador não saberia qual versão do método usar.

    ```
         Animal
        /      \
    Cachorro  Robô
        \      /
       CachorroRobô   <-- qual método falar() usar? Ambiguidade!
    ```

    Java resolve isso permitindo **múltiplas interfaces** (que não têm implementação por padrão) e, a partir do Java 8, se duas interfaces tiverem `default methods` iguais, a classe que implementa ambas **é obrigada** a resolver a ambiguidade explicitamente.

9. O que é composição e por que é preferível à herança em muitos casos?
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

10. O que é o princípio SOLID? Explique cada um dos cinco princípios.
    R: SOLID são 5 princípios:

    - **S - Single Responsibility (Responsabilidade Única)**: uma classe deve ter apenas **um motivo** para mudar. Ex: `UsuarioService` não deve enviar emails - isso é responsabilidade de `EmailService`.
    - **O - Open/Closed (Aberto/Fechado)**: aberto para **extensão**, fechado para **modificação**. Use herança/interfaces para adicionar comportamento sem alterar código existente.
    - **L - Liskov Substitution (Substituição de Liskov)**: uma classe filha deve poder substituir a classe pai sem quebrar o programa. Se `Pato extends Ave` e Ave tem `voar()`, mas Pato não voa, violou Liskov.
    - **I - Interface Segregation (Segregação de Interface)**: prefira interfaces pequenas e específicas a uma interface grande. Ex: em vez de `Trabalhador` com `comer()` e `trabalhar()`, crie `Alimentavel` e `Trabalhavel`.
    - **D - Dependency Inversion (Inversão de Dependência)**: dependa de **abstrações** (interfaces), não de implementações concretas. O `PedidoService` deve depender de `RepositorioPedido` (interface), não de `PedidoRepositoryMySQL` (implementação).

11. Qual a diferença entre coesão e acoplamento?
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

12. O que são Design Patterns? Cite os que você já utilizou.
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
