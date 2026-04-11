---
sidebar_position: 4
title: "Testes em React"
---

# Testes em React

### 1. Como fazer testes em React? Quais ferramentas usar?

O ecossistema de testes React gira em torno de dois pilares:

- **Jest**: test runner e framework de asserções (configurado automaticamente pelo Create React App, Vite com plugin, ou Next.js).
- **React Testing Library (RTL)**: biblioteca para renderizar e interagir com componentes da perspectiva do usuário — não da implementação interna.

**Princípio fundamental da RTL:**
> "Quanto mais seus testes se assemelharem à forma como seu software é usado, mais confiança eles darão."
> — Kent C. Dodds (criador da RTL)

Isso significa: teste **comportamentos visíveis ao usuário**, não detalhes de implementação como estado interno ou nomes de métodos.

**Setup básico:**
```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

**Exemplo de teste de componente:**
```jsx
// Botao.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Botao } from "./Botao";

test("chama onClick ao ser clicado", async () => {
  const usuario = userEvent.setup();
  const onClick = jest.fn();

  render(<Botao onClick={onClick}>Salvar</Botao>);

  // Busca pelo texto visível, como o usuário faria
  await usuario.click(screen.getByRole("button", { name: /salvar/i }));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

**Queries mais usadas (em ordem de preferência):**

| Query | Quando usar |
|---|---|
| `getByRole` | **Primeira opção** — busca por papel ARIA (button, heading, textbox...) |
| `getByLabelText` | Inputs associados a labels |
| `getByText` | Textos visíveis |
| `getByPlaceholderText` | Inputs com placeholder |
| `getByTestId` | **Último recurso** — quando nada mais funciona |

**Variantes das queries:**

| Prefixo | Comportamento |
|---|---|
| `getBy` | Lança erro se não encontrar (síncrono) |
| `queryBy` | Retorna `null` se não encontrar (bom para asserção de ausência) |
| `findBy` | Assíncrono — aguarda o elemento aparecer (Promise) |

### 2. Quais são os tipos de testes mais utilizados em aplicações React enterprise?

Aplicações enterprise seguem a **pirâmide de testes** adaptada para o front-end:

```
        /\
       /E2E\          ← poucos, lentos, caros (Playwright/Cypress)
      /------\
     /Integração\     ← módulo / página completa (RTL + MSW)
    /------------\
   /  Unitários   \   ← componentes isolados, hooks, utils (Jest + RTL)
  /________________\
```

---

**1. Testes Unitários — Jest + React Testing Library**

Testam um componente ou hook isolado. São rápidos e o volume maior da pirâmide.

```jsx
// Testa hook isolado
import { renderHook, act } from "@testing-library/react";
import { useContador } from "./useContador";

test("incrementa o contador", () => {
  const { result } = renderHook(() => useContador());

  act(() => result.current.incrementar());

  expect(result.current.count).toBe(1);
});
```

---

**2. Testes de Integração — RTL + MSW (Mock Service Worker)**

Testam um fluxo completo dentro do front-end, incluindo chamadas a APIs (mockadas na camada de rede).

```jsx
// handlers.js — MSW intercepta requests reais de rede
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/usuarios", () => {
    return HttpResponse.json([{ id: 1, nome: "Ana" }]);
  }),
];

// ListaUsuarios.test.jsx
import { render, screen } from "@testing-library/react";
import { server } from "../mocks/server"; // MSW server configurado
import { ListaUsuarios } from "./ListaUsuarios";

test("exibe usuários retornados pela API", async () => {
  render(<ListaUsuarios />);

  // findBy aguarda renderização assíncrona
  expect(await screen.findByText("Ana")).toBeInTheDocument();
});
```

**Por que MSW?** Ele intercepta requisições na camada de rede (não no código), então testa o mesmo fluxo de fetch/axios que roda em produção — sem mockar módulos.

---

**3. Testes E2E (End-to-End) — Playwright (preferido) ou Cypress**

Testam o fluxo real no navegador, do início ao fim.

```typescript
// login.spec.ts — Playwright
import { test, expect } from "@playwright/test";

test("usuário consegue fazer login", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("E-mail").fill("ana@empresa.com");
  await page.getByLabel("Senha").fill("senha123");
  await page.getByRole("button", { name: /entrar/i }).click();

  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByText("Bem-vinda, Ana")).toBeVisible();
});
```

| | Playwright | Cypress |
|---|---|---|
| Multi-navegador | Sim (Chrome, Firefox, Safari) | Chrome/Edge/Firefox |
| Velocidade | Mais rápido | Mais lento |
| API | `async/await` nativo | Sintaxe própria encadeada |
| Mercado (2024/2025) | Crescendo muito | Ainda popular, mas perdendo espaço |

---

**4. Testes de Regressão Visual — Storybook + Chromatic**

Detectam mudanças visuais inesperadas em componentes comparando screenshots.

```jsx
// Botao.stories.jsx
export const Primario = {
  args: { variante: "primario", children: "Salvar" },
};

export const Desabilitado = {
  args: { variante: "primario", disabled: true, children: "Salvar" },
};
```

O Chromatic tira screenshot de cada story e bloqueia o PR se alguma mudança visual não for aprovada — fundamental para Design Systems.

---

**5. Testes de Performance — Lighthouse CI**

Integrado ao CI/CD, audita métricas de performance (LCP, CLS, FID) em cada PR e falha a build se regredir.

---

**Resumo: stack enterprise típica em 2025**

| Camada | Ferramenta | Volume |
|---|---|---|
| Unitário / Componente | Jest + React Testing Library | ~70% dos testes |
| Integração (API mock) | RTL + MSW | ~20% dos testes |
| E2E | Playwright | ~10% dos testes |
| Visual | Storybook + Chromatic | Por Design System |
| Performance | Lighthouse CI | Por pipeline |
| Acessibilidade | axe-core / @testing-library/jest-axe | Integrado ao RTL |

**Dica de entrevista**: mencionar MSW como alternativa a mocks de módulo demonstra conhecimento do estado da arte. Citar Playwright em vez de apenas Cypress mostra atualização com o mercado.
