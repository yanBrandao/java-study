---
sidebar_position: 1
title: "Fundamentos da Linguagem Java"
---

# Fundamentos da Linguagem Java

### 1. Qual a diferença entre JDK, JRE e JVM?

**JVM** (Java Virtual Machine): é a máquina virtual que executa o bytecode Java. É ela que garante o "write once, run anywhere", pois cada sistema operacional tem sua própria implementação de JVM.
- **JRE** (Java Runtime Environment): contém a JVM + as bibliotecas padrão do Java (java.lang, java.util, etc.). É o suficiente para **executar** programas Java.
- **JDK** (Java Development Kit): contém o JRE + ferramentas de desenvolvimento como o compilador (`javac`), debugger (`jdb`), e o empacotador (`jar`). É necessário para **desenvolver** programas Java.

Resumo: JDK > JRE > JVM (cada um contém o anterior).

### 2. O que é o bytecode Java e por que ele é importante?

Bytecode é o **código intermediário** gerado pelo compilador `javac` quando compila um arquivo `.java` em um arquivo `.class`. Ele é importante porque:
- A JVM interpreta o bytecode, não o código-fonte. Isso permite que o mesmo `.class` rode em qualquer sistema operacional que tenha uma JVM instalada (portabilidade).
- O bytecode é otimizado em tempo de execução pelo **JIT (Just-In-Time Compiler)**, que converte partes frequentemente usadas em código de máquina nativo para melhor performance.

Fluxo: `Código.java` -> (javac) -> `Código.class` (bytecode) -> (JVM) -> Execução

### 3. Qual a diferença entre variáveis de tipo primitivo e tipo referência?

**Primitivos** (`int`, `float`, `boolean`, etc.): armazenam o **valor diretamente** na memória stack. São mais leves e rápidos.
- **Referência** (`String`, `Integer`, arrays, qualquer classe): armazenam um **ponteiro/referência** para um objeto que fica na memória heap. Todos herdam de `Object`.

Exemplo prático:
```java
int a = 10;          // primitivo: o valor 10 está direto na stack
String s = "hello";  // referência: s aponta para um objeto String na heap
```

### 4. Quais são os tipos primitivos do Java e seus tamanhos?

Java tem exatamente **8 tipos primitivos**:

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

### 5. Qual a diferença entre `==` e `.equals()`?

- `==` compara **referências** (endereço de memória) para objetos, e **valores** para primitivos.
- `.equals()` por padrão (na classe `Object`) faz a mesma coisa que `==`. Porém, classes como `String`, `Integer`, etc. **sobrescrevem** o método para comparar o **conteúdo/valor**.

```java
String a = new String("Java");
String b = new String("Java");
a == b;      // false (referências diferentes na heap)
a.equals(b); // true (conteúdo igual)
```
Ponto importante: se você criar sua própria classe e quiser comparar por valor, **precisa sobrescrever** `equals()` e `hashCode()`.

### 6. O que é autoboxing e unboxing?

Autoboxing e unboxing é a conversão automática que o Java faz entre tipos primitivos e suas classes wrapper correspondentes:
- **Autoboxing**: primitivo -> wrapper (automático): `Integer x = 10;` (o `int` 10 vira um objeto `Integer`)
- **Unboxing**: wrapper -> primitivo (automático): `int y = x;` (o objeto `Integer` vira `int`)

As correspondências são: `int`/`Integer`, `double`/`Double`, `boolean`/`Boolean`, `char`/`Character`, etc.

Cuidado: unboxing de um `null` causa `NullPointerException`!
```java
Integer x = null;
int y = x; // NullPointerException em tempo de execução!
```

### 7. Por que a classe `String` é imutável em Java?

`String` é imutável porque, uma vez criada, seu valor **não pode ser alterado**. Qualquer operação que "modifica" uma String na verdade cria uma **nova String** na memória. Isso foi feito por três razões:
- **Segurança**: Strings são usadas para senhas, URLs, nomes de classe. Se fossem mutáveis, alguém poderia alterar uma referência compartilhada e comprometer o sistema.
- **Performance (String Pool)**: como são imutáveis, o Java pode reutilizar a mesma instância para Strings iguais, economizando memória.
- **Thread-safety**: objetos imutáveis são naturalmente seguros para uso entre múltiplas threads sem sincronização.

```java
String s = "Java";
s.concat(" é legal"); // NÃO altera s, cria um novo objeto
System.out.println(s); // imprime "Java" (inalterado)
```

### 8. Qual a diferença entre `String`, `StringBuilder` e `StringBuffer`?

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

### 9. O que é o pool de Strings (String Pool)?

O String Pool é uma área especial da memória heap onde o Java armazena **literais de String** para reutilização. Quando você cria uma String com literal (aspas duplas), o Java primeiro verifica se já existe uma igual no pool:

```java
String a = "Java";   // cria no pool
String b = "Java";   // reutiliza do pool (mesma referência!)
a == b;              // true! (apontam para o mesmo objeto no pool)

String c = new String("Java"); // cria um NOVO objeto na heap (fora do pool)
a == c;              // false (referências diferentes)
a.equals(c);         // true (conteúdo igual)
```

O método `intern()` pode forçar uma String para o pool: `c.intern() == a` seria `true`.

### 10. Qual a diferença entre `final`, `finally` e `finalize()`?

 - **`final`**: palavra-chave com três usos:
  - Em **variável**: o valor não pode ser reatribuído (constante).
  - Em **método**: o método não pode ser sobrescrito por subclasses.
  - Em **classe**: a classe não pode ser herdada (ex: `String` é `final`).
- **`finally`**: bloco que **sempre** executa após `try/catch`, independente de exceção ou não. Usado para liberar recursos (fechar conexões, arquivos, etc.).
- **`finalize()`**: método da classe `Object` chamado pelo Garbage Collector **antes** de desalocar o objeto da memória. **Deprecated desde o Java 9** - não use em código novo. Foi substituído por `try-with-resources` e `Cleaner`.

### 11. O que são modificadores de acesso e quais existem em Java?

Java possui exatamente **4 modificadores de acesso**:

| Modificador   | Classe | Pacote | Subclasse | Mundo |
|---------------|--------|--------|-----------|-------|
| `public`      | Sim    | Sim    | Sim       | Sim   |
| `protected`   | Sim    | Sim    | Sim       | Não   |
| (default)*    | Sim    | Sim    | Não       | Não   |
| `private`     | Sim    | Não    | Não       | Não   |

*default = sem palavra-chave (package-private).

### 12. Qual a diferença entre `static` e `non-static`?

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

### 13. O que é o `ClassLoader` em Java?

O ClassLoader é o componente da JVM responsável por **carregar as classes em memória** em tempo de execução. Quando você usa uma classe no código, o ClassLoader:
1. Localiza o arquivo `.class` (no classpath, JARs, etc.)
2. Lê o bytecode
3. Cria o objeto `Class<?>` na memória

Existem 3 ClassLoaders principais, em hierarquia:
- **Bootstrap ClassLoader**: carrega as classes core do Java (`java.lang`, `java.util`, etc.)
- **Extension ClassLoader**: carrega extensões do JDK
- **Application ClassLoader**: carrega as classes da sua aplicação (classpath)

### 14. Como funciona o Garbage Collector no Java?

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

### 15. O que é o operador `instanceof`?

`instanceof` é uma palavra reservada que ser para identificar se aquela variavel pertence ao tipo de uma Classe

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
