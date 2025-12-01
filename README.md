# 🌤️ Weather Gen

> Plataforma moderna de visualização de dados climáticos com insights gerados por IA

Uma aplicação full-stack completa para visualização de dados meteorológicos em tempo real com gráficos interativos e análises inteligentes powered by Google Gemini AI.

## ✨ Características

- 📊 **Visualização de Dados Climáticos**: Gráficos interativos e responsivos para análise de temperatura, umidade, precipitação e outros indicadores
- 🤖 **Insights com IA**: Análises inteligentes geradas pela API do Google Gemini sobre padrões climáticos e tendências
- 🔐 **Sistema de Autenticação**: Criação de conta e login seguro com JWT
- 📱 **Interface Moderna**: Design responsivo e intuitivo com Shadcn/ui e Tailwind CSS
- ⚡ **Performance**: Arquitetura de microserviços com processamento assíncrono via RabbitMQ
- 🐳 **Containerizado**: Deploy facilitado com Docker Compose

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura de microserviços distribuída:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │ ───► │   Backend   │ ───► │   MongoDB   │
│  React/Vite │      │   NestJS    │      │   Database  │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  RabbitMQ   │
                     │   Message   │
                     │    Queue    │
                     └─────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌─────────────┐         ┌─────────────┐
         │   Worker    │         │   Worker    │
         │   Python    │         │   Golang    │
         └─────────────┘         └─────────────┘
```

## 🛠️ Tecnologias

### Frontend
- **React 19** - Biblioteca UI moderna
- **Vite** - Build tool ultra-rápido
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interativos
- **Zustand** - Gerenciamento de estado
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

### Backend
- **NestJS** - Framework Node.js progressivo
- **MongoDB** com Mongoose - Banco de dados NoSQL
- **JWT** - Autenticação segura
- **Bcrypt** - Hash de senhas
- **Google Gemini AI** - Geração de insights
- **Class Validator** - Validação de dados
- **XLSX** - Exportação de dados

### Workers
- **Python** - Worker para processamento de dados
- **Golang** - Worker de alta performance
- **RabbitMQ** - Sistema de mensageria

### DevOps
- **Docker & Docker Compose** - Containerização
- **ESLint** - Linting
- **Prettier** - Formatação de código
- **Jest** - Testes unitários

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ 
- pnpm 8+
- Python 3.8+
- Go 1.25+
- Docker e Docker Compose
- MongoDB
- RabbitMQ

### Variáveis de Ambiente

Crie arquivos `.env` nas respectivas pastas:

#### Backend (`backend/.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/weather-gen

# JWT
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=sua_chave_aqui

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

#### Workers Python (`worker-python/.env`)
```env
RABBITMQ_URL=amqp://localhost:5672
```

### Instalação

#### Usando Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/arielschmeing/weather-gen.git
cd weather-gen

# Inicie todos os serviços
docker-compose up -d
```

#### Instalação Manual

**Backend:**
```bash
cd backend
pnpm install
pnpm run start:dev
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm run dev
```

**Worker Python:**
```bash
cd worker-python
pip install -r requirements.txt
python main.py
```

**Worker Golang:**
```bash
cd worker-go
go mod download
go run main.go
```

## 📖 Uso

1. Acesse `http://localhost:5173` no navegador
2. Crie uma conta ou faça login
3. Visualize os dados climáticos em tempo real
4. Explore os gráficos interativos
5. Gere insights com IA sobre os padrões climáticos

## 🗂️ Estrutura do Projeto

```
weather-gen/
├── frontend/              # Aplicação React
│   ├── src/
│   └── package.json
├── backend/               # API NestJS
│   ├── src/
│   └── package.json
├── worker-python/         # Worker Python
│   ├── main.py
│   └── requirements.txt
├── worker-go/             # Worker Golang
│   ├── main.go
│   └── go.mod
└── docker-compose.yml     # Orquestração de containers
```

> **Nota:** Para visualizar a estrutura detalhada, acesse o [repositório no GitHub](https://github.com/arielschmeing/weather-gen).

## 📝 Scripts Disponíveis

### Frontend
- `pnpm run dev` - Inicia o servidor de desenvolvimento
- `pnpm run build` - Build de produção
- `pnpm run preview` - Preview do build
- `pnpm run lint` - Executa o linter

### Backend
- `pnpm run start:dev` - Modo desenvolvimento com hot-reload
- `pnpm run start:prod` - Modo produção
- `pnpm run build` - Build do projeto
- `pnpm run lint` - Executa o linter

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e não possui licença pública.

## 👨‍💻 Autor

**Ariel Schmeing**
- GitHub: [@arielschmeing](https://github.com/arielschmeing)

## 🙏 Agradecimentos

- Google Gemini AI pela API de insights
- Comunidade NestJS
- Comunidade React
- Todos os contribuidores de código aberto

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
