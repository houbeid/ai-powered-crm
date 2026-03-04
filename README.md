# AI Powered CRM

A modern B2B CRM application powered by AI that helps sales teams manage clients, track deals, and get intelligent advice to close deals faster.

---

# Tech Stack

### Backend
- .NET 8 / C#
- MySQL + Entity Framework Core
- JWT Authentication
- BCrypt Password Hashing
- OpenAI GPT-4o API

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Axios + React Router
- Feature-based Architecture

---

# Architecture

### Backend — Clean Architecture
```
Controllers    → Presentation Layer
Services       → Application Layer  
Repositories   → Infrastructure Layer
Entities       → Domain Layer
```

### Frontend — Feature-based Architecture
```
features/
├── auth/       → Login, Register, JWT context
├── clients/    → Client CRUD
└── deals/      → Deal CRUD + AI Advice
shared/
├── components/ → Navbar, Modal, LoadingSpinner
└── utils/      → Axios instance with interceptor
```

---

# Features

- **Authentication** — JWT-based login and registration
- **Client Management** — Full CRUD for business clients
- **Deal Management** — Track deals through New → InProgress → Won/Lost
- **Dashboard** — Real-time stats on clients, deals, and revenue
- **AI Deal Advice** — GPT-powered analysis using Chain of Thought and similar won deals as context
- **AI Recovery Tips** — For lost deals, get strategies to recover the opportunity

---

# AI Integration

The AI feature uses **Chain of Thought** prompting and **historical deal context** to generate personalized advice:

1. **Analyze** the current deal (title, description, amount, status, client)
2. **Compare** with similar deals already Won in the database
3. **Identify** obstacles based on experience
4. **Recommend** actions based on what worked before
5. **Craft** a closing argument using won deals as social proof

For **Lost deals**, a Recovery mode provides strategies to re-engage the client.

**AI button visibility logic:**
| Status | Button |
|--------|--------|
| New |  AI Advice |
| InProgress |  AI Advice |
| Won |  Hidden |
| Lost |  Recovery Tips |

---

# API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login → JWT token |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/clients | Get all clients |
| GET | /api/clients/:id | Get client by id |
| POST | /api/clients | Create client |
| PUT | /api/clients/:id | Update client |
| DELETE | /api/clients/:id | Delete client |

### Deals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/deals | Get all deals |
| GET | /api/deals/:id | Get deal by id |
| GET | /api/deals/client/:id | Get deals by client |
| POST | /api/deals | Create deal |
| PUT | /api/deals/:id | Update deal |
| PATCH | /api/deals/:id/status | Update status |
| DELETE | /api/deals/:id | Delete deal |
| POST | /api/deals/:id/ai-advice | Get AI advice |

---

# Technical Decisions

# Why Repository Pattern?
Separates data access from business logic, making services testable and the codebase maintainable.

# Why Feature-based Frontend Architecture?
Each feature is self-contained with its own pages, components, services, and types — making it easy to scale and maintain.

# Why Chain of Thought for AI?
Instead of asking for a direct answer, we guide the AI through 5 reasoning steps, producing more accurate and contextual advice based on real historical data.

# Why Axios Interceptor?
Centralizes JWT token injection — instead of manually adding headers in every service, the interceptor handles it automatically.

# Why DealStatus Enum?
Using an Enum instead of plain strings ensures type safety, prevents invalid status values, and makes the code more maintainable.

---

# Security

- Passwords hashed with **BCrypt**
- **JWT tokens** with expiration
- **CORS** configured for frontend origin only
- Secrets stored in **environment variables** (never committed to git)
- Global **Exception Middleware** for consistent error handling

---

# Author

Built as a technical assessment for a Full-Stack Engineer position.