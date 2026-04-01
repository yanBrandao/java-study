---
sidebar_position: 6
title: "Multithreading e Concorrência"
---

# Multithreading e Concorrência

### 1. Qual a diferença entre processo e thread?

**Processo**: um programa em execução com seu **próprio espaço de memória** isolado. Processos não compartilham memória entre si. Ex: dois programas Java rodando são dois processos.
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

### 2. Quais são as formas de criar uma thread em Java?

Existem 4 formas principais:

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

### 3. Qual a diferença entre `Runnable` e `Callable`?

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

### 4. O que é sincronização e por que é necessária?

Sincronização é o mecanismo que garante que **apenas uma thread** acesse um recurso compartilhado por vez, evitando **condições de corrida** (race conditions):

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

### 5. Qual a diferença entre `synchronized` method e `synchronized` block?

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

### 6. O que é deadlock e como evitá-lo?

Deadlock é uma condição de espera circular em que duas ou mais threads ficam bloqueadas indefinidamente porque cada uma detém um lock que a outra necessita para prosseguir. Como nenhuma libera o recurso que a outra aguarda, todas permanecem bloqueadas para sempre — a não ser que um fator externo (como timeout ou interrupção) quebre o ciclo.

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

### 7. O que é a palavra-chave `volatile`?

`volatile` garante que o valor de uma variável é sempre lido da **memória principal**, não do cache local da thread. Resolve o problema de **visibilidade**:

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

### 8. Qual a diferença entre `wait()`, `notify()` e `notifyAll()`?

São métodos de `Object` usados para **comunicação entre threads** dentro de blocos synchronized:
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

### 9. O que é o `ExecutorService` e quais são seus tipos de thread pool?

`ExecutorService` é uma interface que gerencia um **pool de threads** reutilizáveis, evitando o custo de criar/destruir threads manualmente:

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

### 10. O que é `CompletableFuture` e como funciona?

`CompletableFuture` é uma classe do Java 8 para **programação assíncrona**. Permite encadear operações que executam em threads separadas, sem bloquear:

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

### 11. Qual a diferença entre `sleep()` e `wait()`?

| Característica  | `Thread.sleep()`       | `Object.wait()`           |
|-----------------|------------------------|---------------------------|
| Classe          | `Thread`               | `Object`                  |
| Lock            | **NÃO** libera o lock  | **Libera** o lock         |
| Despertar       | Após o tempo expirar   | Por `notify()`/`notifyAll()` |
| Contexto        | Qualquer lugar         | Dentro de `synchronized`  |
| Propósito       | Pausar a thread        | Comunicação entre threads |

### 12. O que é a classe `ThreadLocal`?

`ThreadLocal` permite que cada thread tenha sua **própria cópia** de uma variável, evitando compartilhamento e problemas de concorrência:

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

### 13. O que são locks reentrantes (`ReentrantLock`)?

`ReentrantLock` é uma alternativa mais flexível ao `synchronized`. "Reentrante" significa que a mesma thread pode adquirir o lock **múltiplas vezes** sem causar deadlock consigo mesma:

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

### 14. O que é o problema de visibilidade de memória em threads?

Cada thread pode manter uma **cópia local (cache)** de variáveis para performance. O problema é que alterações feitas por uma thread podem **não ser visíveis** para outras:

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
