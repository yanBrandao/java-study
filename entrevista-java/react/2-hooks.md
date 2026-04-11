---
sidebar_position: 2
title: "Hooks"
---

# Hooks

### 1. O que são hooks e quais as regras de uso?

Hooks são funções que permitem usar estado e outros recursos do React em componentes de função. As duas regras fundamentais são:

1. **Só chame hooks no nível superior**: nunca dentro de `if`, loops ou funções aninhadas — o React depende da ordem de chamada para associar cada hook ao estado correto.
2. **Só chame hooks em componentes React ou custom hooks**: nunca em funções JS comuns.

```jsx
// ERRADO
if (condicao) {
  const [valor, setValor] = useState(0); // viola regra 1
}

// CORRETO
const [valor, setValor] = useState(0);
if (condicao) { /* usa valor */ }
```

### 2. Como funciona o `useState`? Qual a diferença entre a atualização direta e a funcional?

`useState` retorna um par `[valor, setter]`. O setter tem dois modos:

```jsx
const [count, setCount] = useState(0);

// Atualização direta — usa o valor atual capturado no closure
setCount(count + 1);

// Atualização funcional — recebe o estado mais recente garantido
setCount(prev => prev + 1);
```

Use a forma **funcional** quando a próxima atualização depende do valor anterior — especialmente em callbacks, eventos assíncronos ou quando `setState` é chamado múltiplas vezes seguidas. Isso evita bugs de closure stale (estado "velho" capturado).

### 3. Como funciona o `useEffect` e qual o papel do array de dependências?

`useEffect` executa efeitos colaterais (fetch, subscrições, manipulação de DOM) após a renderização.

```jsx
useEffect(() => {
  // Executa após cada renderização (sem array)
});

useEffect(() => {
  // Executa apenas na montagem (array vazio)
}, []);

useEffect(() => {
  // Executa quando `id` muda
  buscarUsuario(id);
}, [id]);

useEffect(() => {
  const sub = evento.subscribe();
  return () => sub.unsubscribe(); // cleanup: executa antes do próximo efeito ou na desmontagem
}, []);
```

Omitir dependências que são usadas dentro do efeito causa bugs de closure stale. O ESLint plugin `eslint-plugin-react-hooks` detecta isso automaticamente.

### 4. Qual a diferença entre `useCallback` e `useMemo`?

Ambos memorizam valores entre renderizações para evitar recálculos desnecessários:

| | `useMemo` | `useCallback` |
|---|---|---|
| Memoriza | O **resultado** de uma função | A **função** em si |
| Retorna | Um valor calculado | Uma função |
| Caso de uso | Cálculos pesados | Funções passadas como props |

```jsx
// useMemo: memoriza o resultado do cálculo
const total = useMemo(() => calcularTotal(itens), [itens]);

// useCallback: memoriza a referência da função
const handleClick = useCallback(() => {
  fazerAlgo(id);
}, [id]);
```

**Importante**: não use indiscriminadamente — a memorização tem custo de memória e comparação. Aplique quando o custo do recálculo ou re-renderização for realmente relevante.

### 5. Para que serve o `useRef`? Quais os dois principais casos de uso?

`useRef` retorna um objeto `{ current: valor }` que **persiste entre renderizações sem causar re-render** quando alterado.

**Caso 1 — Referência a elementos do DOM:**
```jsx
const inputRef = useRef(null);

function focarInput() {
  inputRef.current.focus(); // acesso direto ao nó DOM
}

return <input ref={inputRef} />;
```

**Caso 2 — Guardar valores mutáveis entre renders (sem re-render):**
```jsx
const contagemRenders = useRef(0);

useEffect(() => {
  contagemRenders.current += 1; // não dispara re-render
});
```

Diferença do `useState`: mudar `ref.current` não re-renderiza o componente.

### 6. Como funciona o `useContext`?

`useContext` permite consumir um contexto sem prop drilling. O fluxo completo:

```jsx
// 1. Criar o contexto
const TemaContext = createContext("claro");

// 2. Prover o valor na árvore
function App() {
  return (
    <TemaContext.Provider value="escuro">
      <Pagina />
    </TemaContext.Provider>
  );
}

// 3. Consumir em qualquer componente filho (sem props intermediárias)
function Botao() {
  const tema = useContext(TemaContext);
  return <button className={tema}>Clique</button>;
}
```

**Cuidado com performance**: qualquer mudança no `value` do Provider re-renderiza todos os consumidores. Para contextos que mudam frequentemente, considere dividir em contextos menores ou usar `useMemo` no value.

### 7. O que são custom hooks e quando criá-los?

Custom hooks são funções JavaScript que começam com `use` e podem chamar outros hooks. Servem para **extrair e reutilizar lógica stateful** entre componentes.

```jsx
// Custom hook: encapsula lógica de fetch
function useFetch(url) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setDados)
      .catch(setErro)
      .finally(() => setCarregando(false));
  }, [url]);

  return { dados, carregando, erro };
}

// Uso em qualquer componente
function Perfil({ id }) {
  const { dados, carregando } = useFetch(`/api/usuarios/${id}`);
  if (carregando) return <Spinner />;
  return <p>{dados.nome}</p>;
}
```

Crie um custom hook quando a mesma combinação de hooks aparece em mais de um lugar, ou quando o componente está ficando grande demais com lógica misturada.

### 8. O que é o problema do "closure stale" (estado antigo em closures)?

Ocorre quando um callback captura um valor de estado no momento da criação, mas o estado já mudou quando o callback é executado.

```jsx
function Contador() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: `count` aqui sempre será 0 (closure do primeiro render)
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // dependência vazia captura count=0 para sempre
}
```

**Solução**: usar a atualização funcional do setter:
```jsx
setCount(prev => prev + 1); // `prev` é sempre o valor mais recente
```

### 9. Para que serve o `useReducer` e quando preferir sobre `useState`?

`useReducer` é uma alternativa ao `useState` para lógica de estado mais complexa, inspirada no padrão Redux:

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "incrementar": return { count: state.count + 1 };
    case "decrementar": return { count: state.count - 1 };
    case "reset":       return { count: 0 };
    default: throw new Error("Ação desconhecida");
  }
}

function Contador() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "incrementar" })}>+</button>
    </>
  );
}
```

Prefira `useReducer` quando:
- O estado tem múltiplos sub-valores interdependentes.
- A próxima atualização depende do estado anterior de forma complexa.
- A lógica de transição precisa ser testável isoladamente.

### 10. O que é o hook `useLayoutEffect` e quando usá-lo no lugar do `useEffect`?

`useLayoutEffect` tem a mesma assinatura que `useEffect`, mas dispara **sincronamente após as mutações do DOM e antes do browser pintar a tela**.

```
useEffect:       render → DOM atualizado → browser pinta → efeito executa
useLayoutEffect: render → DOM atualizado → efeito executa → browser pinta
```

Use `useLayoutEffect` quando:
- Precisar ler medidas do DOM (largura, posição) e aplicar mudanças antes que o usuário veja o layout incorreto.
- Evitar "flash" visual de conteúdo mal posicionado.

```jsx
useLayoutEffect(() => {
  // Seguro para ler e modificar o DOM antes da pintura
  const { height } = ref.current.getBoundingClientRect();
  setAltura(height);
}, []);
```

Para a maioria dos casos (fetch, subscrições, logs), prefira `useEffect` — `useLayoutEffect` bloqueia a pintura e pode prejudicar a performance.
