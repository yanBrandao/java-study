---
sidebar_position: 7
title: "Generics"
---

# Generics

1. O que são Generics e por que foram introduzidos?
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

2. Qual a diferença entre `<? extends T>` e `<? super T>`?
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

3. O que é Type Erasure?
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

4. É possível criar um array de tipos genéricos? Por quê?
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

5. O que é o diamond operator (`<>`)?
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
