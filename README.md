# 🔐 API de Autenticação com Node.js, TypeScript, Express e MongoDB

API RESTful completa com autenticação JWT, desenvolvida com Node.js, TypeScript, Express e MongoDB, seguindo a arquitetura de camadas (controllers, services, models, routes, middlewares).

## 📋 Funcionalidades

- ✅ Registro de novos usuários com hash de senha (bcrypt)
- ✅ Login com geração de token JWT
- ✅ Rotas protegidas com validação de token
- ✅ Validações de email e senha
- ✅ Logs detalhados de operações
- ✅ Tratamento de erros apropriado
- ✅ Suporte para Docker
- ✅ Pronto para deploy na Vercel

## 🏗️ Arquitetura

```
src/
├── controllers/      # Camada de controle (requisição/resposta)
├── services/         # Lógica de negócio
├── models/           # Modelos do MongoDB (Mongoose)
├── routes/           # Definição de rotas
├── middlewares/      # Middlewares de autenticação
├── database/         # Configuração de conexão com MongoDB
└── index.ts          # Arquivo principal da aplicação
```

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **Docker** - Containerização

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 20+ instalado
- Docker e Docker Compose (para execução com Docker)
- MongoDB Atlas (para produção) ou MongoDB local

### 1️⃣ Executando Localmente (sem Docker)

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Execute em modo de desenvolvimento
npm run dev

# 4. Para build de produção
npm run build
npm start
```

### 2️⃣ Executando com Docker

```bash
# 1. Configure as variáveis de ambiente (opcional, usa valores padrão)
cp .env.example .env

# 2. Inicie os containers (MongoDB + API)
docker-compose up

# Ou em modo detached (background)
docker-compose up -d

# 3. Para parar os containers
docker-compose down

# 4. Para rebuild após mudanças
docker-compose up --build
```

A API estará disponível em `http://localhost:3000`

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Porta do servidor
PORT=3000

# MongoDB
# Para desenvolvimento local com Docker
MONGODB_URI=mongodb://mongodb:27017/auth-db

# Para MongoDB Atlas (produção)
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/auth-db?retryWrites=true&w=majority

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=7d

# Ambiente
NODE_ENV=development
```

## 📡 Endpoints da API

### Rotas Públicas

#### POST /register
Registra um novo usuário no sistema. O registro não retorna token JWT; o token é obtido apenas no login.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### POST /login
Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Rotas Protegidas

#### GET /protected
Rota de exemplo que requer autenticação.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Acesso autorizado",
  "userId": "507f1f77bcf86cd799439011"
}
```

## 🧪 Testando a API

### Usando Insomnia/Postman

1. Importe o arquivo `requests/requests.yaml` no Insomnia
2. Execute as requisições na ordem sugerida
3. Copie o token retornado no login para testar rotas protegidas

### Casos de Teste Incluídos

✅ Cadastro bem-sucedido  
✅ Cadastro com e-mail repetido  
✅ Cadastro com senha inválida  
✅ Cadastro com e-mail inválido  
✅ Cadastro com requisição mal formatada  
✅ Login bem-sucedido  
✅ Login com senha inválida  
✅ Login com e-mail inválido  
✅ Login com requisição mal formatada  
✅ Acesso a /protected com token válido  
✅ Acesso a /protected sem token  
✅ Acesso a /protected com token inválido  

## 🌐 Deploy

### Deploy na Vercel

1. **Configure o MongoDB Atlas:**
   - Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crie um cluster gratuito
   - Obtenha a string de conexão

2. **Configure as variáveis de ambiente na Vercel:**
   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/auth-db
   JWT_SECRET=sua_chave_super_secreta_de_producao
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

3. **Faça o build e deploy:**
   ```bash
   # Instale a CLI da Vercel
   npm i -g vercel
   
   # Faça login
   vercel login
   
   # Build local
   npm run build
   
   # Deploy
   vercel --prod
   ```

4. **Configuração automática via Git:**
   - Conecte seu repositório GitHub à Vercel
   - A cada push, a Vercel fará o build e deploy automaticamente

### Docker em Produção

Para deploy com Docker em servidores VPS ou cloud:

```bash
# Build da imagem
docker build -t auth-api .

# Execute o container
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="sua_chave_secreta" \
  -e NODE_ENV="production" \
  auth-api
```

## 🔒 Segurança

- ✅ Senhas armazenadas com hash bcrypt (10 rounds de salt)
- ✅ Tokens JWT com expiração configurável
- ✅ Validação de dados de entrada
- ✅ Senha não retornada em queries por padrão
- ✅ Tratamento de erros sem expor informações sensíveis
- ✅ CORS habilitado

## 📝 Validações Implementadas

### Registro
- Nome: mínimo 2 caracteres, obrigatório
- Email: formato válido, único no sistema, obrigatório
- Senha: mínimo 6 caracteres, obrigatório

### Login
- Email: formato válido, obrigatório
- Senha: obrigatório

### Erros Tratados
- Email já cadastrado (409 Conflict)
- Credenciais inválidas (401 Unauthorized)
- Dados inválidos (400 Bad Request)
- Token ausente/inválido (401 Unauthorized)
- Requisição mal formatada (400 Bad Request)

## 🐛 Logs

A aplicação registra logs detalhados:

- ✅ Conexão com MongoDB
- ✅ Requisições HTTP (método e path)
- ✅ Operações de registro e login
- ✅ Validação de tokens
- ✅ Erros e exceções

## 📚 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot-reload
npm run build        # Compila TypeScript para JavaScript
npm start            # Executa versão compilada
npm run docker:dev   # Inicia com Docker Compose
npm run docker:build # Rebuild dos containers Docker
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico de API REST com autenticação JWT.

---

**Nota:** Lembre-se de sempre usar variáveis de ambiente seguras em produção e nunca comitar o arquivo `.env` no repositório!
