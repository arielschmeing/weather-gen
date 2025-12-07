## 📋 Sobre o Projeto

O **GDASH (Weather Gen Dashboard)** é uma aplicação fullstack completa para monitoramento e análise de dados climáticos em tempo real. O sistema coleta dados meteorológicos automaticamente através de uma arquitetura de mensageria, armazena no banco de dados e disponibiliza através de um dashboard interativo com visualizações gráficas e insights gerados por Inteligência Artificial.

### Vídeo: https://youtu.be/Q0KIA6ro1uI

### Principais Características

- 🌡️ **Monitoramento em tempo real** de temperatura, umidade, vento e precipitação
- 🤖 **Insights inteligentes** gerados pelo Google Gemini AI
- 📊 **Visualizações gráficas** interativas com Recharts
- 📁 **Exportação de dados** em CSV e XLSX
- 🔐 **Autenticação segura** com JWT
- 🐳 **Containerização completa** com Docker
- 🔄 **Arquitetura de mensageria** com RabbitMQ

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura de microsserviços** com comunicação assíncrona através de filas de mensagens:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITETURA GDASH                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐      │
│    │   Frontend   │ ──────► │   Backend    │ ──────► │   MongoDB    │      │
│    │   (React)    │ ◄────── │   (NestJS)   │ ◄────── │  (Database)  │      │
│    │   :80/443    │         │    :3000     │         │   :27017     │      │
│    └──────────────┘         └──────────────┘         └──────────────┘      │
│                                    │                                        │
│                                    │ Recebe dados                           │
│                                    ▼                                        │
│    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐      │
│    │   Producer   │ ──────► │  RabbitMQ    │ ──────► │   Consumer   │      │
│    │   (Python)   │         │   (Broker)   │         │     (Go)     │      │
│    │              │         │  :5672/15672 │         │              │      │
│    └──────────────┘         └──────────────┘         └──────────────┘      │
│          │                                                  │               │
│          │ Coleta dados                                     │ Envia p/ API  │
│          ▼                                                  ▼               │
│    ┌──────────────┐                                  ┌──────────────┐      │
│    │  Weather API │                                  │   Backend    │      │
│    │  (Open-Meteo)│                                  │   (NestJS)   │      │
│    └──────────────┘                                  └──────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Producer (Python)**: Coleta dados climáticos da API Open-Meteo periodicamente
2. **RabbitMQ**: Recebe e enfileira as mensagens de forma assíncrona
3. **Consumer (Go)**: Consome as mensagens da fila e envia para o backend
4. **Backend (NestJS)**: Processa, valida e persiste os dados no MongoDB
5. **Frontend (React)**: Exibe os dados através de gráficos e dashboards interativos

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.2.0 | Biblioteca JavaScript para construção de interfaces de usuário. A versão 19 traz melhorias significativas de performance com o novo compilador React. |
| **TypeScript** | 5.9.3 | Superset do JavaScript que adiciona tipagem estática, proporcionando maior segurança e produtividade no desenvolvimento. |
| **Vite** | 5.3.0 | Build tool extremamente rápida que utiliza ES modules nativos para desenvolvimento instantâneo com Hot Module Replacement (HMR). |
| **Tailwind CSS** | 3.4.18 | Framework CSS utility-first que permite estilização rápida e consistente através de classes utilitárias. |
| **Radix UI** | - | Biblioteca de componentes primitivos acessíveis e não estilizados, garantindo conformidade com padrões WCAG. |
| **Zustand** | 5.0.8 | Gerenciador de estado minimalista e performático para React, com API simples baseada em hooks. |
| **React Router** | 7.9.6 | Biblioteca de roteamento declarativo para React, gerenciando navegação entre páginas da SPA. |
| **Recharts** | 3.5.0 | Biblioteca de gráficos construída com componentes React, ideal para visualização de dados meteorológicos. |
| **Axios** | 1.13.2 | Cliente HTTP baseado em Promises para realizar requisições à API backend. |
| **Lucide React** | 0.554.0 | Biblioteca de ícones SVG modernos e customizáveis. |
| **Sonner** | 2.0.7 | Biblioteca para notificações toast elegantes e acessíveis. |

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **NestJS** | 11.0.1 | Framework Node.js progressivo para construção de aplicações server-side eficientes e escaláveis. Utiliza arquitetura modular inspirada no Angular. |
| **TypeScript** | 5.7.3 | Linguagem tipada que compila para JavaScript, oferecendo IntelliSense avançado e detecção de erros em tempo de desenvolvimento. |
| **MongoDB** | - | Banco de dados NoSQL orientado a documentos, ideal para armazenar dados climáticos com schema flexível. |
| **Mongoose** | 9.0.0 | ODM (Object Document Mapper) elegante para MongoDB, fornecendo validação de schema e middleware. |
| **JWT** | - | JSON Web Tokens para autenticação stateless segura entre cliente e servidor. |
| **Google Generative AI** | 0.24.1 | SDK oficial para integração com o Gemini AI, utilizado para gerar insights climáticos inteligentes. |
| **bcryptjs** | 3.0.3 | Biblioteca para hash seguro de senhas usando algoritmo bcrypt. |
| **Zod** | 4.1.13 | Biblioteca de validação de schema com inferência de tipos TypeScript para variáveis de ambiente. |
| **class-validator** | 0.14.2 | Decorators para validação de DTOs baseada em classes. |
| **class-transformer** | 0.5.1 | Transformação de objetos planos em instâncias de classes e vice-versa. |
| **XLSX** | 0.18.5 | Biblioteca para geração e manipulação de arquivos Excel. |
| **Jest** | 30.0.0 | Framework de testes JavaScript com foco em simplicidade. |

### Message Queue

#### Producer (Python)

| Tecnologia | Descrição |
|------------|-----------|
| **Python 3** | Linguagem de programação versátil, ideal para scripts de coleta de dados. |
| **Pika** | Cliente Python para RabbitMQ implementando o protocolo AMQP 0-9-1. |
| **Requests** | Biblioteca HTTP elegante para realizar chamadas à API de clima externa. |
| **python-dotenv** | Carrega variáveis de ambiente de arquivos `.env`. |

#### Consumer (Go)

| Tecnologia | Descrição |
|------------|-----------|
| **Go (Golang)** | Linguagem compilada de alta performance, ideal para consumidores de fila com baixa latência. |
| **amqp091-go** | Cliente Go para RabbitMQ, fork oficial do streadway/amqp com suporte ativo. |

### Infraestrutura

| Tecnologia | Descrição |
|------------|-----------|
| **Docker** | Plataforma de containerização que encapsula a aplicação e suas dependências em containers isolados. |
| **Docker Compose** | Ferramenta para definição e execução de aplicações multi-container. |
| **RabbitMQ** | Message broker robusto que implementa AMQP, garantindo entrega confiável de mensagens. |
| **Nginx** | Servidor web de alta performance utilizado como servidor estático para o frontend. |
| **MongoDB** | Banco de dados NoSQL com alta disponibilidade e escalabilidade horizontal. |

---

## ✨ Funcionalidades

### 🔐 Autenticação e Usuários
- Registro de novos usuários com validação
- Login com autenticação JWT
- Rotas protegidas com guard de autenticação
- Gerenciamento de perfil de usuário

### 📊 Dashboard Climático
- Visualização do último registro climático
- Gráficos interativos de:
  - 🌡️ Temperatura ao longo do tempo
  - 💧 Umidade relativa
  - 💨 Velocidade do vento
  - 🌧️ Probabilidade de precipitação
- Alternância entre visualização atual e histórico

### 🤖 Insights com IA
- Análise automatizada dos dados climáticos
- Geração de insights incluindo:
  - Temperatura média do período
  - Tendência de temperatura (subindo/caindo/estável)
  - Score de conforto térmico (0-100)
  - Classificação do dia (quente, frio, agradável, etc.)
  - Alertas relevantes (calor extremo, chance de chuva, etc.)
  - Resumo descritivo do período

### 📁 Exportação de Dados
- Exportação em formato CSV
- Exportação em formato XLSX (Excel)
- Download direto pelo navegador

### 🔍 Explorer
- Listagem paginada de itens externos
- Visualização detalhada de itens
- Integração com API externa (PokéAPI)

---

## 🚀 Instalação

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0+)

### Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Aplicação
APP_PORT=80
API_PORT=3000
DB_PORT=27017

# MongoDB
MONGODB_USER=seu_usuario
MONGODB_PASSWORD=sua_senha

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# Google Gemini AI
AI_API_KEY=sua_api_key_do_gemini

# API de Clima (Open-Meteo)
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
LATITUDE=-23.5505
LONGITUDE=-46.6333

# RabbitMQ
RABBIT_HOST=rabbitmq
RABBIT_PORT=5672
AMQP_SERVER_URL=amqp://guest:guest@rabbitmq:5672/

# Consumer
API_CONSUMER_ENDPOINT=http://backend:3000/weather
API_KEY=sua_api_key_interna

# Producer
PRODUCER_TIME=3600

# Explorer API
EXPLORER_API_URL=https://pokeapi.co/api/v2/
```

### Executando com Docker Compose

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gdash.git
cd gdash

# Inicie todos os serviços
docker-compose up -d

# Verifique os logs
docker-compose logs -f

# Acesse a aplicação
# Frontend: http://localhost:80
# Backend API: http://localhost:3000
# RabbitMQ Management: http://localhost:15672
```

### Comandos Úteis

```bash
# Parar todos os serviços
docker-compose down

# Reconstruir containers após alterações
docker-compose up -d --build

# Ver logs de um serviço específico
docker-compose logs -f backend

# Acessar shell de um container
docker-compose exec backend sh

# Executar seed do banco de dados
docker-compose exec backend node dist/seed.js
```

---

## 📁 Estrutura do Projeto

```
gdash/
├── 📂 backend/                    # API NestJS
│   ├── 📂 src/
│   │   ├── 📂 config/             # Configurações e schemas de ambiente
│   │   │   └── env.schema.ts      # Validação Zod das variáveis de ambiente
│   │   ├── 📂 decorators/         # Decorators customizados
│   │   │   └── public.decorator.ts # Decorator para rotas públicas
│   │   ├── 📂 exceptions/         # Exceções customizadas
│   │   ├── 📂 modules/            # Módulos da aplicação
│   │   │   ├── 📂 ai-core/        # Módulo de integração com IA
│   │   │   │   ├── aiCore.module.ts
│   │   │   │   ├── aiCore.service.ts  # Serviço de comunicação com Gemini
│   │   │   │   └── 📂 prompt/     # Templates de prompts
│   │   │   ├── 📂 auth/           # Módulo de autenticação
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.guard.ts  # Guard JWT global
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── 📂 dto/        # Data Transfer Objects
│   │   │   ├── 📂 explorer/       # Módulo de exploração
│   │   │   │   ├── explorer.controller.ts
│   │   │   │   ├── explorer.module.ts
│   │   │   │   ├── explorer.service.ts
│   │   │   │   └── 📂 mapper/     # Mapeadores de dados
│   │   │   ├── 📂 users/          # Módulo de usuários
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── 📂 schemas/    # Schemas Mongoose
│   │   │   └── 📂 weather/        # Módulo de clima
│   │   │       ├── weather.controller.ts
│   │   │       ├── weather.module.ts
│   │   │       ├── weather.service.ts
│   │   │       ├── weather-file.service.ts  # Exportação de arquivos
│   │   │       └── 📂 schemas/    # Schema de dados climáticos
│   │   ├── app.module.ts          # Módulo raiz
│   │   ├── main.ts                # Ponto de entrada
│   │   └── seed.ts                # Script de seed do banco
│   ├── 📂 test/                   # Testes automatizados
│   ├── Dockerfile                 # Containerização do backend
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 frontend/                   # Aplicação React
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📂 context/        # Contextos React
│   │   │   ├── 📂 router/         # Configuração de rotas
│   │   │   │   ├── AppRouter.tsx  # Definição das rotas
│   │   │   │   └── ProtectedRouter.tsx  # HOC de proteção
│   │   │   ├── 📂 store/          # Gerenciamento de estado (Zustand)
│   │   │   │   ├── AuthStorage.ts # Estado de autenticação
│   │   │   │   └── InsightsStorage.ts
│   │   │   └── 📂 types/          # Tipos TypeScript globais
│   │   ├── 📂 components/
│   │   │   ├── 📂 base/           # Componentes base reutilizáveis
│   │   │   ├── 📂 layout/         # Componentes de layout
│   │   │   │   ├── DetailWeather.tsx
│   │   │   │   ├── Temperature.tsx
│   │   │   │   ├── Umidade.tsx
│   │   │   │   ├── Wind.tsx
│   │   │   │   ├── Precipitation.tsx
│   │   │   │   └── InsightsCard.tsx
│   │   │   └── 📂 ui/             # Componentes UI (shadcn/ui)
│   │   ├── 📂 hooks/              # Custom hooks
│   │   │   ├── useDashboard.ts
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── ...
│   │   ├── 📂 lib/                # Utilitários e constantes
│   │   ├── 📂 pages/              # Páginas da aplicação
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── User.tsx
│   │   │   ├── Explorer.tsx
│   │   │   └── Item.tsx
│   │   ├── 📂 services/           # Serviços de API
│   │   │   ├── weather.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── explorer.service.ts
│   │   ├── App.tsx                # Componente raiz
│   │   └── main.tsx               # Ponto de entrada
│   ├── Dockerfile                 # Build multi-stage com Nginx
│   ├── nginx.conf                 # Configuração do Nginx
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── 📂 message-queue/              # Sistema de mensageria
│   ├── 📂 producer/               # Produtor Python
│   │   ├── main.py                # Script de coleta e envio
│   │   ├── requirements.txt       # Dependências Python
│   │   └── Dockerfile
│   └── 📂 consumer/               # Consumidor Go
│       ├── main.go                # Consumidor de fila
│       ├── go.mod                 # Módulo Go
│       └── Dockerfile
│
├── docker-compose.yml             # Orquestração dos serviços
└── README.md                      # Esta documentação
```

---

## 📚 Detalhamento das Tecnologias

### 🔷 NestJS - Backend Framework

O **NestJS** foi escolhido como framework backend por sua arquitetura modular e escalável, inspirada no Angular. Principais características utilizadas:

- **Decorators**: Utilizados para definição de rotas, injeção de dependências e validação
- **Módulos**: Organização do código em módulos independentes (Auth, Users, Weather, Explorer)
- **Guards**: Proteção de rotas com `AuthGuard` global usando JWT
- **DTOs**: Validação de dados de entrada com `class-validator`
- **Providers**: Injeção de dependências para serviços

```typescript
// Exemplo de estrutura modular
@Module({
  imports: [MongooseModule, ConfigModule, JwtModule],
  controllers: [WeatherController],
  providers: [WeatherService, AICoreService],
})
export class WeatherModule {}
```

### ⚛️ React 19 - Frontend Framework

A versão 19 do **React** traz melhorias significativas:

- **React Compiler**: Otimização automática de re-renders
- **Concurrent Features**: Renderização concorrente para melhor UX
- **Hooks**: Lógica reutilizável com custom hooks (`useDashboard`, `useLogin`)

### 🐰 RabbitMQ - Message Broker

O **RabbitMQ** gerencia a comunicação assíncrona entre serviços:

- **Fila `weather`**: Armazena mensagens de dados climáticos
- **Producer**: Publica mensagens periodicamente
- **Consumer**: Consome e processa mensagens de forma resiliente com retry

### 🤖 Google Gemini AI

Integração com **Gemini 2.5 Flash** para análise inteligente:

```typescript
// Exemplo de uso do AI Core Service
async insight(): Promise<Insights> {
  const weatherLogs = await this.list();
  const result = await this.aiCoreService.ask(insightsPrompt(weatherLogs));
  return InsightsSchema.parse(JSON.parse(result));
}
```

### 🗄️ MongoDB com Mongoose

Banco de dados **NoSQL** para armazenamento flexível de dados climáticos:

```typescript
@Schema()
export class Weather {
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ required: true })
  temperature: number;
  
  @Prop({ required: true })
  umidade: number;
  // ...
}
```

### 🎨 Tailwind CSS + Radix UI

Combinação poderosa para UI moderna e acessível:

- **Tailwind**: Classes utilitárias para estilização rápida
- **Radix UI**: Componentes primitivos com acessibilidade nativa
- **CVA**: Class Variance Authority para variantes de componentes

### 📦 Zustand - State Management

Gerenciamento de estado leve e performático:

```typescript
export const useAuthStorage = create<AuthStorage>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      refreshToken: (newToken) => set({ accessToken: newToken }),
    }),
    { name: "auth-storage" }
  )
);
```

---

## 🧪 Testes

O projeto inclui testes unitários e de integração com Jest:

```bash
# Executar testes unitários
cd backend && pnpm test

# Executar testes com cobertura
pnpm test:cov

# Executar testes e2e
pnpm test:e2e
```

---

## 📈 Monitoramento

### RabbitMQ Management

Acesse `http://localhost:15672` para monitorar:
- Filas ativas
- Mensagens pendentes
- Taxa de processamento
- Conexões de consumers

---