---
sidebar_position: 3
title: "Tratamento de Exceções"
---

# Tratamento de Exceções

1. Qual a diferença entre `checked` e `unchecked` exceptions?
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

2. Qual a diferença entre `throw` e `throws`?
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

3. O que é e como funciona o bloco `try-with-resources`?
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

4. É possível ter um bloco `try` sem `catch`? E sem `finally`?
    R: 
    - `try / catch`
    - `try / finally`
    - `try / catch / finally`
    - `try-with-resources` (pode existir sem catch e sem finally, pois o close é implícito)

5. Qual a diferença entre `Error` e `Exception`?
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

6. O que acontece se uma exceção for lançada dentro de um bloco `finally`?
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

7. Quando criar uma exceção customizada?
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

8. Qual a hierarquia de exceções em Java?
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
