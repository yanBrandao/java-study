---
sidebar_position: 4
title: "Collections Framework"
---

# Collections Framework

### 1. Qual a diferença entre `List`, `Set` e `Map`?

- **List**: coleção **ordenada** (mantém a ordem de inserção) que **permite duplicatas**. Acesso por índice. Ex: `[A, B, A, C]`
- **Set**: coleção que **não permite duplicatas**. Não garante ordem (depende da implementação). Ex: `{A, B, C}`
- **Map**: **não** é uma Collection (não implementa a interface `Collection`). Armazena pares **chave-valor**. Chaves únicas, valores podem repetir. Ex: `{nome=João, idade=30}`

Detalhe importante: `Map` **não** faz parte da hierarquia de `Collection`, apesar de estar no Collections Framework.

### 2. Qual a diferença entre `ArrayList` e `LinkedList`?

| Operação            | ArrayList         | LinkedList          |
|---------------------|-------------------|---------------------|
| Estrutura interna   | Array dinâmico    | Nós duplamente encadeados |
| `get(index)`        | O(1) - rápido     | O(n) - lento (percorre nós) |
| `add(element)` final| O(1) amortizado   | O(1)                |
| `add(index)` meio   | O(n) - lento (move elementos) | O(1)* se já tiver o nó |
| `remove(index)`     | O(n)              | O(1)* se já tiver o nó |
| Memória             | Menos (só dados)  | Mais (dados + ponteiros) |

Na prática, **ArrayList** é a escolha padrão em 95% dos casos por causa do cache de CPU e acesso direto.

### 3. Qual a diferença entre `ArrayList` e `Vector`?

Ambos são listas baseadas em array, mas:
- **ArrayList**: **não sincronizado** (não thread-safe). Melhor performance em ambientes single-thread. Cresce 50% quando cheio.
- **Vector**: **sincronizado** (thread-safe). Mais lento devido à sincronização. Cresce 100% quando cheio. É uma classe **legada** (desde Java 1.0).

Na prática: **nunca use Vector**. Use `ArrayList` e, se precisar de thread-safety, use `Collections.synchronizedList()` ou `CopyOnWriteArrayList`.

### 4. Qual a diferença entre `HashSet`, `LinkedHashSet` e `TreeSet`?

Todos implementam `Set` (sem duplicatas), mas diferem na **ordem** e **performance**:
- **HashSet**: **sem ordem** garantida. Usa tabela hash. O(1) para add/remove/contains. Mais rápido.
- **LinkedHashSet**: mantém a **ordem de inserção**. Usa hash + lista encadeada. Levemente mais lento que HashSet.
- **TreeSet**: mantém os elementos **ordenados naturalmente** (ou por Comparator). Usa árvore red-black. O(log n) para operações.

```java
Set<Integer> hash   = new HashSet<>(List.of(3,1,2));   // [1,2,3] ou qualquer ordem
Set<Integer> linked = new LinkedHashSet<>(List.of(3,1,2)); // [3,1,2] (ordem inserção)
Set<Integer> tree   = new TreeSet<>(List.of(3,1,2));   // [1,2,3] (sempre ordenado)
```

### 5. Qual a diferença entre `HashMap`, `LinkedHashMap` e `TreeMap`?

Mesma lógica dos Sets, aplicada a Maps:
- **HashMap**: **sem ordem** garantida. O(1) para get/put. Mais usado.
- **LinkedHashMap**: mantém **ordem de inserção** (ou ordem de acesso, se configurado). Útil para caches LRU.
- **TreeMap**: mantém as **chaves ordenadas**. O(log n). Útil quando precisa de navegação ordenada (`firstKey()`, `lastKey()`).

### 6. Qual a diferença entre `HashMap` e `Hashtable`?

- **HashMap**: não sincronizado, aceita **uma chave null** e múltiplos valores null. Mais rápido.
- **Hashtable**: sincronizado (thread-safe), **não aceita** null em chave nem valor. Classe legada.

Na prática: **nunca use Hashtable**. Use `HashMap` e, se precisar de thread-safety, use `ConcurrentHashMap`.

### 7. Como funciona internamente o `HashMap`?

O HashMap usa um **array de buckets** (posições) e uma função hash:
1. Ao fazer `put(chave, valor)`, calcula `hashCode()` da chave.
2. O hash determina em qual **bucket** (posição do array) o par será armazenado.
3. Se dois objetos caírem no mesmo bucket (**colisão**), são armazenados como uma **lista encadeada** nesse bucket (ou **árvore red-black** se a lista ficar grande, a partir do Java 8).
4. Ao fazer `get(chave)`, calcula o hash, vai ao bucket, e usa `equals()` para encontrar a chave exata.

Por isso é essencial sobrescrever **tanto** `hashCode()` **quanto** `equals()` ao usar objetos customizados como chave!

### 8. O que acontece quando dois objetos têm o mesmo hashCode no `HashMap`?

Isso é chamado de **colisão de hash** e é tratado normalmente:
- Os dois pares chave-valor são armazenados no **mesmo bucket**.
- Até Java 7: como uma **lista encadeada** dentro do bucket.
- A partir do Java 8: se a lista no bucket ultrapassar **8 elementos**, ela é convertida em uma **árvore red-black** (de O(n) para O(log n)).
- Na busca, o HashMap usa `equals()` para distinguir entre as chaves no mesmo bucket.

### 9. Qual a diferença entre `Comparable` e `Comparator`?

Ambos servem para **ordenar objetos**, mas de formas diferentes:
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

### 10. O que é `ConcurrentHashMap` e quando usar?

É uma implementação **thread-safe** de `Map` otimizada para alta concorrência:
- Diferente do `Hashtable` (que trava o mapa inteiro), o `ConcurrentHashMap` usa **lock por segmento/bucket**, permitindo múltiplas threads lerem e escreverem simultaneamente em partes diferentes.
- Não permite chaves ou valores `null`.
- Use quando múltiplas threads precisam acessar o mesmo Map. Cenários comuns: caches, contadores compartilhados, registros de sessão.

### 11. Qual a diferença entre `Iterator` e `ListIterator`?

- **Iterator**: percorre qualquer `Collection` em **uma direção** (para frente). Métodos: `hasNext()`, `next()`, `remove()`.
- **ListIterator**: exclusivo para `List`. Percorre em **ambas direções**. Métodos adicionais: `hasPrevious()`, `previous()`, `add()`, `set()`, `nextIndex()`.

### 12. O que é o `fail-fast` e `fail-safe` em collections?

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

### 13. Quando usar `Queue` e `Deque`?

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

### 14. O que é o `Collections.unmodifiableList()`?

Retorna uma **visão somente leitura** de uma lista. Qualquer tentativa de modificar (add, remove, set) lança `UnsupportedOperationException`:

```java
List<String> original = new ArrayList<>(List.of("A", "B"));
List<String> imutavel = Collections.unmodifiableList(original);
imutavel.add("C"); // UnsupportedOperationException!

// Cuidado: alterações na lista ORIGINAL ainda afetam a visão!
original.add("C"); // imutavel agora mostra [A, B, C]

// Para lista verdadeiramente imutável (Java 9+):
List<String> segura = List.of("A", "B"); // ou List.copyOf(original)
```
