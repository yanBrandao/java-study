---
sidebar_position: 3
title: "Performance e Padrões"
---

# Performance e Padrões

### 1. Quais as principais formas de otimizar a performance no React?

As principais técnicas, em ordem de impacto prático:

1. **`React.memo`**: evita re-render de componentes filhos quando as props não mudaram.
2. **`useCallback`**: estabiliza referências de funções passadas como props.
3. **`useMemo`**: memoriza resultados de cálculos pesados.
4. **Code splitting com `React.lazy` + `Suspense`**: carrega componentes sob demanda.
5. **Virtualização de listas**: bibliotecas como `react-window` ou `react-virtual` para listas longas.
6. **Dividir contextos**: evitar um contexto gigante que re-renderiza tudo ao mudar qualquer dado.
7. **Evitar objetos/arrays inline em props**: `<Comp style={{ color: "red" }} />` cria nova referência a cada render.

```jsx
// Problema: novo objeto a cada render → React.memo não ajuda
<Comp style={{ color: "red" }} />

// Solução: definir fora do componente ou usar useMemo
const estilo = { color: "red" };
<Comp style={estilo} />
```

### 2. O que é code splitting e como implementar com `React.lazy`?

Code splitting divide o bundle em partes menores que são carregadas sob demanda, reduzindo o tempo de carregamento inicial.

```jsx
import { lazy, Suspense } from "react";

// O componente só é carregado quando for renderizado pela primeira vez
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      {/* Enquanto o chunk carrega, exibe o fallback */}
      <Dashboard />
    </Suspense>
  );
}
```

Boa prática: aplicar code splitting nas rotas, pois cada página raramente precisa dos chunks das outras.

```jsx
const Home    = lazy(() => import("./pages/Home"));
const Perfil  = lazy(() => import("./pages/Perfil"));
const Admin   = lazy(() => import("./pages/Admin"));
```

### 3. O que são Error Boundaries e como funcionam?

Error Boundaries são componentes de **classe** que capturam erros de JavaScript em qualquer lugar da árvore de filhos e exibem uma UI de fallback em vez de quebrar o app inteiro.

```jsx
class ErrorBoundary extends React.Component {
  state = { temErro: false };

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(error, info) {
    logParaServico(error, info.componentStack);
  }

  render() {
    if (this.state.temErro) return <h1>Algo deu errado.</h1>;
    return this.props.children;
  }
}

// Uso:
<ErrorBoundary>
  <ComponenteQuePoderFalhar />
</ErrorBoundary>
```

**Limitação**: não capturam erros em handlers de eventos, código assíncrono (`setTimeout`), ou no próprio Error Boundary. Para isso, use `try/catch`.

> O React 19 introduziu o hook `use` e melhorias no tratamento de erros, mas Error Boundaries de classe ainda são necessários para a árvore de renderização.

### 4. O que é o padrão de Compound Components?

Compound Components é um padrão onde um componente pai compartilha estado implícito com seus filhos via Context, criando uma API declarativa e flexível.

```jsx
// Implementação
const TabsContext = createContext();

function Tabs({ children }) {
  const [ativo, setAtivo] = useState(0);
  return (
    <TabsContext.Provider value={{ ativo, setAtivo }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.Lista = function Lista({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Item = function Item({ index, children }) {
  const { ativo, setAtivo } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={ativo === index}
      onClick={() => setAtivo(index)}
    >
      {children}
    </button>
  );
};

// Uso — API declarativa e legível
<Tabs>
  <Tabs.Lista>
    <Tabs.Item index={0}>Perfil</Tabs.Item>
    <Tabs.Item index={1}>Configurações</Tabs.Item>
  </Tabs.Lista>
</Tabs>
```

### 5. O que é o padrão Render Props?

Render Props é uma técnica onde um componente recebe uma **função como prop** que ele chama para renderizar seu conteúdo, permitindo compartilhar lógica stateful.

```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)} {/* o pai decide o que renderizar com os dados */}
    </div>
  );
}

// Uso
<MouseTracker render={({ x, y }) => <p>Posição: {x}, {y}</p>} />
```

Hoje, custom hooks geralmente substituem render props — são mais simples e composáveis. Render props ainda são úteis quando o consumidor precisa controlar a estrutura do DOM renderizado.

### 6. Como funciona o gerenciamento de estado com Context API? Quais as limitações?

A Context API é ideal para estado global de baixa frequência de atualização (tema, idioma, usuário autenticado):

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = useCallback(async (credenciais) => {
    const u = await autenticar(credenciais);
    setUsuario(u);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniência
function useAuth() {
  return useContext(AuthContext);
}
```

**Limitações**:
- Cada mudança no `value` re-renderiza **todos** os consumidores do contexto.
- Não tem ferramentas de debug como o Redux DevTools.
- Não substitui soluções como Zustand ou Redux para estado de alta frequência ou lógica complexa.

### 7. Qual a diferença entre Zustand e Redux? Quando usar cada um?

| | Redux (+ RTK) | Zustand |
|---|---|---|
| Boilerplate | Médio (RTK reduziu muito) | Mínimo |
| Curva de aprendizado | Alta | Baixa |
| DevTools | Excelente | Disponível |
| Performance | Seletores granulares | Seletores simples |
| Tamanho | ~15kb | ~1kb |
| Caso de uso | Apps grandes e complexos | Apps de pequeno a médio porte |

```jsx
// Zustand — setup completo em ~10 linhas
import { create } from "zustand";

const useContador = create(set => ({
  count: 0,
  incrementar: () => set(state => ({ count: state.count + 1 })),
  decrementar: () => set(state => ({ count: state.count - 1 })),
}));

function Contador() {
  const { count, incrementar } = useContador();
  return <button onClick={incrementar}>{count}</button>;
}
```

Use Redux para apps enterprise com muitos desenvolvedores, rastreabilidade de ações e middlewares complexos. Use Zustand para projetos menores ou quando simplicidade é prioridade.

### 8. Como funciona o React Router? Quais os hooks mais importantes?

React Router (v6+) é a biblioteca padrão de roteamento para SPAs React:

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/perfil/42">Perfil</Link>
      </nav>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/perfil/:id"  element={<Perfil />} />
        <Route path="*"            element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Hooks essenciais**:

```jsx
const { id } = useParams();           // parâmetros da URL: /perfil/:id
const [params] = useSearchParams();   // query string: ?page=2
const navigate = useNavigate();       // navegação programática
const location = useLocation();       // objeto da rota atual
```

### 9. O que é Server-Side Rendering (SSR) e como o Next.js o implementa?

SSR gera o HTML da página no servidor a cada requisição, em vez de no navegador. Benefícios: melhor SEO, menor tempo até o primeiro conteúdo visível (FCP).

No Next.js (App Router, v13+):

```tsx
// Componentes de servidor por padrão — zero JavaScript no cliente
async function PaginaPerfil({ params }: { params: { id: string } }) {
  // Fetch direto no servidor, sem useEffect
  const usuario = await buscarUsuario(params.id);

  return <h1>{usuario.nome}</h1>;
}

// Componente de cliente — só quando necessário (interatividade, hooks)
"use client";
function BotaoLike({ id }: { id: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>{liked ? "❤️" : "🤍"}</button>;
}
```

Next.js também oferece **Static Site Generation (SSG)** e **Incremental Static Regeneration (ISR)** como alternativas ao SSR puro.

### 10. O que mudou no React 19? Quais as principais novidades?

React 19 (lançado em 2024) trouxe mudanças significativas:

**Actions**: funções assíncronas que lidam com transições, estados de loading e erros automaticamente.
```jsx
// useActionState — gerencia estado de formulários com ações assíncronas
const [state, submitAction, isPending] = useActionState(
  async (prevState, formData) => {
    await salvar(formData.get("nome"));
    return { sucesso: true };
  },
  { sucesso: false }
);
```

**`use` hook**: permite ler Promises e contextos diretamente no render.
```jsx
function Componente({ promessa }) {
  const dados = use(promessa); // suspende enquanto a Promise resolve
  return <p>{dados.nome}</p>;
}
```

**`useOptimistic`**: atualização otimista da UI enquanto operações assíncronas completam.

**`ref` como prop**: não precisa mais de `forwardRef` — refs podem ser passadas diretamente como props em componentes de função.

**Melhorias no Server Components**: integração mais profunda com frameworks como Next.js.

### 11. Quais são os principais padrões de projeto (design patterns) no React?

O React possui padrões próprios que evoluíram com o ecossistema. Os mais relevantes em entrevistas:

**1. Container / Presentational (Smart × Dumb)**
Separa lógica de negócio da apresentação. Hoje, normalmente substituído por custom hooks, mas ainda aparece em bases de código legadas.
```jsx
// Container: busca dados e possui lógica
function ListaUsuariosContainer() {
  const { data } = useQuery({ queryKey: ["usuarios"], queryFn: buscarUsuarios });
  return <ListaUsuarios usuarios={data} />;
}

// Presentational: só renderiza o que recebe
function ListaUsuarios({ usuarios }) {
  return <ul>{usuarios.map(u => <li key={u.id}>{u.nome}</li>)}</ul>;
}
```

**2. Higher-Order Component (HOC)**
Função que recebe um componente e retorna um novo com comportamento adicional.
```jsx
function comAutenticacao(Componente) {
  return function ComponenteProtegido(props) {
    const { usuario } = useAuth();
    if (!usuario) return <Redirect to="/login" />;
    return <Componente {...props} />;
  };
}

const DashboardProtegido = comAutenticacao(Dashboard);
```
Ainda útil para bibliotecas, mas custom hooks costumam ser mais simples para lógica.

**3. Custom Hook (padrão mais importante atualmente)**
Encapsula e reutiliza lógica stateful entre componentes.
```jsx
function useDebounce(valor, delay = 300) {
  const [debouncado, setDebouncado] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncado(valor), delay);
    return () => clearTimeout(timer);
  }, [valor, delay]);

  return debouncado;
}
```

**4. Provider Pattern**
Distribui dados/funcionalidades via Context sem prop drilling.
```jsx
// Criação do contexto + provider
const TemaContext = createContext();

export function TemaProvider({ children }) {
  const [tema, setTema] = useState("claro");
  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      {children}
    </TemaContext.Provider>
  );
}

// Hook de conveniência
export function useTema() { return useContext(TemaContext); }
```

**5. Compound Components** — já detalhado na questão 4 desta seção.

**6. Render Props** — já detalhado na questão 5 desta seção.

**7. Atomic Design (arquitetura de componentes)**
Organiza componentes em níveis de abstração:
- **Atoms**: elementos básicos (`Button`, `Input`, `Badge`).
- **Molecules**: grupos de atoms (`FormField = Label + Input + ErrorMessage`).
- **Organisms**: seções completas (`Header`, `ProductCard`).
- **Templates**: layouts sem dados reais.
- **Pages**: templates com dados injetados.

**Resumo: quando usar cada um**

| Padrão | Caso de uso |
|---|---|
| Custom Hook | Reutilizar lógica stateful (padrão mais usado hoje) |
| HOC | Injetar comportamento cross-cutting (auth, logging) |
| Compound Components | APIs de componentes flexíveis e declarativas |
| Render Props | Componentes que precisam ceder controle do DOM ao consumidor |
| Provider Pattern | Estado global ou serviços compartilhados |
| Atomic Design | Organização de Design Systems |
