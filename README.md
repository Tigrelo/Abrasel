# 👥 Desafio Técnico Fullstack — Sistema de Gerenciamento de Usuários

Este projeto foi desenvolvido como solução para um **desafio técnico de vaga Fullstack (ênfase em Frontend)**.
A aplicação é um sistema completo de **gerenciamento de usuários (CRUD)** com **autenticação**, **painéis de usuário e administrativo**, e integração com API externa para preenchimento automático de endereços.

---

## 🚀 Visão Geral

O sistema implementa um fluxo de autenticação seguro, permitindo que **usuários se cadastrem publicamente** e acessem um **Painel de Controle** onde podem visualizar seus próprios dados.

Além disso, há um **usuário Administrador (pré-configurado)** que possui acesso a um **painel exclusivo de administração**, no qual é possível **visualizar, editar e deletar** qualquer outro usuário cadastrado.

O projeto foi desenvolvido com foco em **boas práticas modernas**, utilizando **Server Components** e **Server Actions** do Next.js 14.

---

## ✨ Funcionalidades Principais

- **Autenticação Completa:**
  Cadastro público com validação de senha e login via e-mail.

- **Redirecionamento Automático:**
  A página inicial (`/`) redireciona automaticamente:
  - Usuários deslogados → `/login`
  - Usuários autenticados → `/dashboard`

- **Integração com API Externa (ViaCEP):**
  Preenchimento automático de **Estado** e **Cidade** durante o cadastro.

- **Painel de Controle do Usuário:**
  - Usuário comum pode visualizar seus próprios dados.
  - Usuário não pode editar ou visualizar informações de outros.

- **Painel Administrativo:**
  - Visualização completa de todos os usuários.
  - Edição de nome de qualquer usuário.
  - Exclusão de usuários cadastrados.

- **Proteção de Rotas (Middleware):**
  - `/dashboard` → apenas usuários autenticados.
  - `/admin` → apenas administradores (`role: ADMIN`).

---

## 🏗️ Arquitetura

A aplicação segue uma arquitetura moderna **Fullstack com Next.js**, combinando **Server Components**, **Server Actions** e **ORM Prisma**, garantindo segurança, escalabilidade e organização.

- **Frontend e Backend integrados:** O Next.js atua tanto como servidor (API Routes) quanto como SPA (App Router).
- **Banco de Dados Local (SQLite):** Simples de configurar e ideal para ambiente de testes e demonstrações.
- **Autenticação com Next-Auth:** Implementa controle de sessão seguro com criptografia e middleware de proteção.

---

## 🛠️ Stack Tecnológica

### 🔹 Backend & Infra
- **Next.js 14+** (App Router e Server Actions)
- **TypeScript**
- **Prisma ORM**
- **SQLite** (banco local)
- **Next-Auth (Auth.js v5)** para autenticação
- **ViaCEP API** (consulta de endereços via CEP)

### 🔹 Frontend & UI
- **React 18+**
- **TailwindCSS** (estilização moderna e responsiva)
- **Shadcn/UI** (componentes de UI: Form, Button, Input, Table, Dialog, Dropdown, Sonner)
- **React Hook Form + Zod** (validação de formulários)
- **Lucide React** (ícones SVG otimizados)

---

## 🔒 Segurança

- **Autenticação baseada em token (Next-Auth):**
  Usuários e administradores têm papéis distintos definidos por `role`.

- **Middleware de proteção:**
  Bloqueia o acesso direto a rotas restritas.

- **Variáveis de ambiente seguras:**
  Segredos e credenciais ficam armazenados em `.env` e fora do controle de versão.

---

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para executar a aplicação localmente.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/en/) — versão **18 ou superior**
- [NPM](https://www.npmjs.com/)

### 2. Instalação

```bash
# 1. Clone o repositório
git clone [https://github.com/Tigrelo/Abrasel](https://github.com/Tigrelo/Abrasel)

# 2. Entre na pasta do projeto
cd Abrasel

# 3. Instale todas as dependências
npm install

### 3. Configuração do Ambiente e Banco de Dados

1.  **Crie o arquivo `.env`**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```.env
    # Caminho do banco de dados SQLite (dentro da pasta prisma)
    DATABASE_URL="file:./prisma/dev.db"

    # Segredo usado pelo Next-Auth (gere um novo)
    # Você pode usar 'openssl rand -base64 32' no terminal para gerar um
    AUTH_SECRET="SEU_SEGREDO_FORTE_AQUI"
    ```

2.  **Configure o Banco de Dados**
    Execute os comandos do Prisma para criar seu banco local e popular o admin:

    ```bash
    # Crie o arquivo de banco de dados e execute as migrações
    npx prisma migrate dev

    # Popule o banco com o usuário administrador padrão
    npx prisma db seed
    ```

### 4. Executar o Projeto

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
npm run dev


🔑 Credenciais de Acesso (Administrador)
Usuário administrador criado automaticamente pelo seed:

E-mail: admin@app.com

Senha: admin123

A aplicação estará disponível em: 👉 http://localhost:3000