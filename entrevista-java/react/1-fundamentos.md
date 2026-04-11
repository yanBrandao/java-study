---
sidebar_position: 1
title: "Fundamentos do React"
---

# Fundamentos do React

### 1. O que é o Virtual DOM e como ele funciona?

O **Virtual DOM** é uma representação em memória (JavaScript puro) da árvore real do DOM. Quando o estado de um componente muda, o React:

1. Cria uma nova cópia do Virtual DOM com as alterações.
2. Compara a nova árvore com a anterior usando o algoritmo de **reconciliação (diffing)**.
3. Calcula o menor conjunto de mudanças necessárias (**patch**).
4. Aplica apenas essas mudanças no DOM real.

Isso é mais eficiente do que manipular o DOM real diretamente a cada mudança, pois operações no DOM são custosas — o Virtual DOM minimiza o número de atualizações.

### 2. Qual a diferença entre componentes de função e componentes de classe?

| Aspecto | Componente de Função | Componente de Classe |
|---|---|---|
| Sintaxe | Função JS simples | Estende `React.Component` |
| Estado | `useState` hook | `this.state` |
| Ciclo de vida | `useEffect` | `componentDidMount`, etc. |
| `this` | Não existe | Necessário em todo lugar |
| Performance | Levemente mais leve | Overhead do objeto |
| Status atual | **Padrão recomendado** | Legado |

Desde o React 16.8, hooks tornaram os componentes de função capazes de tudo que as classes fazem. Componentes de classe ainda funcionam, mas não são mais recomendados para código novo.

### 3. O que é JSX e o que acontece com ele em tempo de compilação?

**JSX** (JavaScript XML) é uma extensão de sintaxe que permite escrever estruturas parecidas com HTML dentro do JavaScript. Ele **não é HTML** — o Babel o transforma em chamadas `React.createElement()`.

```jsx
// O que você escreve:
const elemento = <h1 className="titulo">Olá, {nome}</h1>;

// O que o Babel gera:
const elemento = React.createElement(
  "h1",
  { className: "titulo" },
  "Olá, ",
  nome
);
```

Por isso atributos seguem convenções JS: `class` → `className`, `for` → `htmlFor`, eventos em camelCase (`onClick`, `onChange`).

### 4. Qual a diferença entre `props` e `state`?

| | `props` | `state` |
|---|---|---|
| Quem controla | Componente **pai** | O próprio componente |
| Mutabilidade | **Imutável** (somente leitura) | Mutável via `setState`/`useState` |
| Propósito | Comunicação pai → filho | Dados internos e dinâmicos |
| Causa re-render? | Sim, quando o pai re-renderiza | Sim, quando é atualizado |

Regra de ouro: se um dado precisa ser compartilhado, ele sobe para o pai e desce via props ("lifting state up"). Se é local e privado, fica no `state`.

### 5. O que é o processo de reconciliação (reconciliation)?

Reconciliação é o algoritmo que o React usa para decidir o que precisa ser atualizado no DOM. Ele compara a árvore de elementos anterior com a nova seguindo duas heurísticas:

1. **Tipo diferente**: se o tipo do elemento mudou (ex.: `<div>` → `<span>`), destrói a árvore toda e reconstrói do zero.
2. **Mesmo tipo**: atualiza apenas os atributos que mudaram, mantendo o nó do DOM existente.

A prop `key` é fundamental nesse processo para listas — ela ajuda o React a identificar qual item foi adicionado, removido ou reordenado sem recriar todos.

### 6. O que é lifting state up (elevar o estado)?

É o padrão de mover o `state` para o **ancestral comum mais próximo** quando dois ou mais componentes precisam compartilhar o mesmo dado.

```jsx
// Pai controla o estado e passa via props
function Formulario() {
  const [nome, setNome] = useState("");

  return (
    <>
      <Entrada valor={nome} aoMudar={setNome} />
      <Preview nome={nome} />
    </>
  );
}
```

`Entrada` e `Preview` são "stateless" — apenas consomem o dado via props. Qualquer alteração em `Entrada` atualiza o pai, que re-renderiza `Preview` automaticamente.

### 7. Qual a diferença entre componente controlado e não controlado?

**Controlado**: o React é a "fonte da verdade" — o valor do input é sempre ditado pelo `state`.

```jsx
const [valor, setValor] = useState("");
<input value={valor} onChange={e => setValor(e.target.value)} />
```

**Não controlado**: o DOM é a "fonte da verdade" — acessado via `ref` quando necessário.

```jsx
const ref = useRef();
<input ref={ref} />
// ref.current.value para ler o valor
```

Componentes controlados são o padrão recomendado pois facilitam validação, formatação em tempo real e sincronização de dados.

### 8. O que são componentes puros (Pure Components) no React?

Um componente é considerado "puro" quando, para as **mesmas props e estado**, sempre produz a **mesma saída** e não tem efeitos colaterais. O React pode evitar re-renderizações desnecessárias usando `React.memo` para funções:

```jsx
const MeuComponente = React.memo(function MeuComponente({ nome }) {
  return <p>Olá, {nome}</p>;
});
```

`React.memo` faz uma comparação rasa (shallow) das props. Se nenhuma prop mudou, o componente não re-renderiza. Para comparações mais profundas, aceita uma função de comparação como segundo argumento.

### 9. O que é renderização condicional e quais as formas mais comuns?

É a prática de renderizar elementos diferentes conforme uma condição. Formas mais usadas:

```jsx
// 1. Operador ternário (mais comum)
{isLogado ? <Dashboard /> : <Login />}

// 2. Operador && (renderiza ou nada)
{erro && <MensagemDeErro texto={erro} />}

// 3. if/else fora do JSX
function Componente() {
  if (carregando) return <Spinner />;
  if (erro) return <Erro />;
  return <Conteudo />;
}
```

Cuidado com `{count && <Lista />}`: se `count` for `0`, o React renderiza o número `0` em vez de nada. Prefira `{count > 0 && <Lista />}`.

### 10. O que é o prop `key` e por que ele é importante em listas?

A `key` é uma prop especial que ajuda o React a identificar cada item em uma lista durante a reconciliação. Ela deve ser **única entre irmãos** e **estável** (não mudar entre renderizações).

```jsx
// Correto: ID único e estável
{usuarios.map(u => <Item key={u.id} usuario={u} />)}

// Ruim: índice do array (problemático ao reordenar/remover)
{usuarios.map((u, i) => <Item key={i} usuario={u} />)}
```

Sem `key`, ou com keys instáveis, o React pode:
- Re-renderizar componentes desnecessariamente.
- Perder o estado interno de componentes (ex.: um input que perde o texto digitado).
- Causar bugs visuais ao reordenar itens.

### 11. O que é o React e por que ele se diferencia de outros frameworks?

O **React** é uma **biblioteca** JavaScript para construir interfaces de usuário, criada pelo Meta (Facebook) em 2013. O ponto central é que ele resolve **apenas a camada de view** — diferente de frameworks como Angular, que entregam uma solução completa (roteamento, formulários, HTTP, etc.).

**Principais diferenciais:**

| Aspecto | React | Angular | Vue |
|---|---|---|---|
| Tipo | Biblioteca de UI | Framework completo | Framework progressivo |
| Linguagem | JavaScript + JSX | TypeScript obrigatório | JavaScript/TypeScript |
| Curva de aprendizado | Média | Alta | Baixa |
| Flexibilidade | Alta (você escolhe as libs) | Baixa (opiniões fortes) | Média |
| Renderização | Virtual DOM | Change detection (Zone.js) | Virtual DOM |
| Modelo de dados | Fluxo unidirecional | Two-way binding (padrão) | Two-way binding (opcional) |

**Por que o React se destaca:**

1. **Fluxo de dados unidirecional**: dados fluem de pai para filho via props, tornando o estado previsível e fácil de rastrear.
2. **Componentes reutilizáveis**: cada componente encapsula estrutura (JSX), lógica (hooks) e estilo — favorece composição.
3. **Ecossistema gigante**: Next.js (SSR/SSG), React Native (mobile), React Three Fiber (3D), entre outros.
4. **Sem opinião sobre o resto**: você escolhe o roteador (React Router, TanStack Router), gerenciador de estado (Zustand, Redux), fetching (React Query, SWR) — isso é liberdade e responsabilidade ao mesmo tempo.

> React não é um framework MVC — ele é só o "V". O resto da arquitetura fica por conta da equipe.

### 12. Qual a melhor maneira de integrar o React com APIs externas?

Existem diferentes abordagens, cada uma adequada a um contexto:

**1. `useEffect` + `fetch` nativo (básico)**
```jsx
function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/usuarios", { signal: controller.signal })
      .then(res => res.json())
      .then(setUsuarios)
      .finally(() => setCarregando(false));

    return () => controller.abort(); // cancela na desmontagem
  }, []);

  if (carregando) return <Spinner />;
  return <Lista itens={usuarios} />;
}
```

**2. TanStack Query (React Query) — padrão enterprise**
```jsx
import { useQuery } from "@tanstack/react-query";

function Usuarios() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => fetch("/api/usuarios").then(res => res.json()),
    staleTime: 1000 * 60 * 5, // cache de 5 minutos
  });

  if (isLoading) return <Spinner />;
  if (error) return <Erro />;
  return <Lista itens={data} />;
}
```

**3. SWR (Vercel) — alternativa mais leve**
```jsx
import useSWR from "swr";

const fetcher = url => fetch(url).then(r => r.json());

function Usuarios() {
  const { data, error, isLoading } = useSWR("/api/usuarios", fetcher);
  // ...
}
```

**Comparativo de abordagens:**

| | `useEffect` + `fetch` | React Query | SWR |
|---|---|---|---|
| Cache automático | Não | Sim | Sim |
| Revalidação em foco | Não | Sim | Sim |
| Deduplicação de requests | Não | Sim | Sim |
| Mutations | Manual | `useMutation` | Manual |
| Tamanho | 0kb | ~13kb | ~4kb |
| Recomendado para | Projetos simples | Enterprise / apps complexos | Apps leves |

**Boas práticas:**
- Sempre cancele requisições com `AbortController` ao desmontar o componente.
- Encapsule a lógica de fetching em **custom hooks** (`useUsuarios`, `useProduto`).
- Use **MSW (Mock Service Worker)** para mockar APIs em testes e desenvolvimento.
