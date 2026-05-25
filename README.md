# Lista de Anotações - Node.js + Express + PostgreSQL

Projeto de lista de anotações desenvolvido com:

- Node.js
- Express
- PostgreSQL
- HTML
- CSS
- JavaScript

A aplicação permite:

- Criar anotações
- Visualizar anotações
- Remover anotações
- Reordenar anotações com drag and drop
- Persistência de dados em PostgreSQL

---

# Como criar um novo repositório com os arquivos do projeto

## 1. Acessar o repositório da aula

Abra o repositório no GitHub.

---

## 2. Criar um Fork

Clique em:

```txt
Fork
```

no canto superior direito do GitHub.

---

## 3. Confirmar criação

O GitHub criará automaticamente uma cópia completa do projeto na sua conta.

---

# Resultado

Você terá um novo repositório no seu GitHub contendo todos os arquivos do projeto original da aula.
---

# Dependências do projeto

O projeto utiliza:

- express
- pg

---

# Como instalar as dependências

## Instalar Node.js

Download:

https://nodejs.org

---

## Verificar instalação

```bash
node -v
npm -v
```

---

## Instalar dependências do projeto

Dentro da pasta do projeto execute:

```bash
npm install
```

Isso instalará automaticamente:

```txt
express
pg
```

---

# Estrutura do projeto

```txt
projeto/
│
├── db.js
├── server.js
├── package.json
│
├── public/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
```

---

# Configuração do PostgreSQL no Render

## 1. Criar conta no Render

Acesse:

https://render.com

---

## 2. Criar banco PostgreSQL

No painel do Render:

```txt
New +
```

↓

```txt
PostgreSQL
```

---

## 3. Configurar banco

Preencha:

### Name

```txt
databaseatividadeaula
```

### Database

```txt
databaseatividadeaula
```

### User

```txt
databaseatividadeaula_user
```

---

## 4. Criar banco

Clique em:

```txt
Create Database
```

---

## 5. Copiar External Database URL

Após criar:

- abra o banco
- vá em:

```txt
Connections
```

ou:

```txt
Info
```

Copie:

```txt
External Database URL
```

Ela será parecida com:

```txt
postgresql://usuario:senha@host/database
```

---

# Criar tabela no PostgreSQL

## 1. Instalar PostgreSQL local

Download:

https://www.postgresql.org/download/windows/

Durante a instalação utilize a porta:

```txt
5432
```

---

## 2. Adicionar PostgreSQL ao PATH

Adicionar:

```txt
C:\Program Files\PostgreSQL\18\bin
```

---

## 3. Verificar instalação

```bash
psql --version
```

---

## 4. Conectar no banco Render

```bash
psql "COLE_A_EXTERNAL_DATABASE_URL_AQUI"
```

---

## 5. Criar tabela

Execute:

```sql
CREATE TABLE notes (

    id SERIAL PRIMARY KEY,

    title VARCHAR(30),

    text TEXT NOT NULL,

    position INTEGER DEFAULT 0

);
```

---

## 6. Atualizar posições

```sql
UPDATE notes
SET position = id;
```

---

# Configuração do Web Service no Render

## 1. Criar Web Service

No Render:

```txt
New +
```

↓

```txt
Web Service
```

---

## 2. Conectar GitHub

Selecionar:

- repositório do projeto

---

## 3. Configurações do serviço

### Runtime

```txt
Node
```

---

### Build Command

```txt
npm install
```

---

### Start Command

```txt
node server.js
```

---

# Configuração da variável de ambiente

No Web Service:

```txt
Environment
```

↓

```txt
Add Environment Variable
```

---

## Criar variável

### Key

```txt
DATABASE_URL
```

### Value

Cole:

```txt
External Database URL
```

do PostgreSQL.

---

# Realizar deploy

Após configurar:

```txt
Create Web Service
```

O Render irá:

- instalar dependências
- iniciar o Express
- conectar no PostgreSQL

---

# Rodar localmente

## Iniciar servidor

```bash
node server.js
```

ou:

```bash
npm start
```

---

# Acessar aplicação

```txt
http://localhost:3000
```

---

# Funcionalidades

- Criar notas
- Remover notas
- Visualizar notas
- Drag and drop
- Persistência em PostgreSQL
- API REST
- Deploy no Render

---

# Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- HTML5
- CSS3
- JavaScript
