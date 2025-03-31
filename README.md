# 📌 Visão Geral

Aplicação web para gerenciamento e assinatura digital de documentos com as seguintes funcionalidades:

- Upload de documentos PDF
- Visualização de documentos
- Assinatura digital com canvas
- Gerenciamento de status (Pendente/Assinado)
- Autenticação de usuários

---

## 🚀 Instalação e Execução

### Pré-requisitos

Certifique-se de ter os seguintes itens instalados em sua máquina:

- **Node.js** (v18 ou superior)
- **PostgreSQL** ou **MySQL** (para o banco de dados)
- **Git** (opcional, para clonar o repositório)

---

### Passo a Passo

#### 1. Clonar o repositório

Abra o terminal e execute os comandos abaixo:

```bash
git clone https://github.com/seu-usuario/document-signing-app.git
cd document-signing-app
```

#### 2. Instalar as dependências

Execute o comando abaixo para instalar as dependências:

```bash
npm install
```

#### 3. Configurar variáveis de ambiente

Crie um arquivo .env baseado no arquivo de exemplo .env.example:

```bash
cp .env.example .env
```

#### 3.1 Usando docker para subir o banco de dados

```bash
docker-compose up -d
```

#### 4. Configurar o banco de dados

Inicie o serviço do banco de dados e execute as migrations do Prisma para criar as tabelas necessárias:

```bash
npx prisma migrate dev --name init
```

#### 4. Configurar o banco de dados

Inicie o serviço do banco de dados e execute as migrations do Prisma para criar as tabelas necessárias:

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000.
