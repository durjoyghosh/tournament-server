# Sports Tournament Manager - Backend API

A production-ready, feature-based modular backend built with Node.js, Express, TypeScript, and MongoDB (Mongoose) for managing tournaments, teams, player profiles, rosters, referees, matches, and real-time live scores.

---

## 🚀 Features

- **Strict TypeScript & Zod Validation**: Compile-time safety and runtime requests body/params schema validations.
- **Enterprise-Level Architecture**: Feature-based modular structure keeping controllers, services, repositories, validators, and routes localized.
- **Secure Authentication & RBAC**: JWT Access & Refresh Token rotation flow, and middleware-driven role authorization (`Super Admin`, `Organizer`, `Team Manager`, `Coach`, `Player`, `Referee`, `Scorekeeper`, `Spectator`).
- **Comprehensive DB Schema**: Soft deletion, auditing metadata (`createdBy`, `updatedBy`), indexes, and populates.
- **Realtime WebSockets**: Live score updates, match finish, and tournament score streams powered by Socket.io.
- **Robust Error Handling**: Centralized error mapping for Zod, Mongoose errors, and custom operational `AppErrors`.

---

## 📂 Project Structure

```
src/
├── app.ts                  # Express server configurations & middlewares
├── server.ts               # Database connecting and HTTP & WebSocket servers bootstrapper
│
├── config/                 # Configurations for env parsing, DB, JWT, and Cloudinary
│   ├── database.ts
│   ├── env.ts
│   ├── jwt.ts
│   └── index.ts
│
├── middlewares/            # Common Express interceptor layers
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── validate.middleware.ts
│   ├── error.middleware.ts
│   └── rateLimit.middleware.ts
│
├── modules/                # Feature-based modular components
│   ├── auth/               # Login, register, passwords, token rotation
│   ├── user/               # Users profile, database, roles management
│   ├── tournament/         # Sports and tournament setups
│   ├── team/               # Teams registries & manager/coach assignments
│   ├── player/             # Player profiles, rosters & career statistics
│   └── match/              # Schedules, referees, scorekeeping & live event feeds
│
├── routes/                 # Global API router aggregator
│   └── index.ts
│
├── socket/                 # Realtime Socket.io channels
│   └── socket.service.ts
│
├── utils/                  # Shared helper classes
│   ├── AppError.ts
│   ├── catchAsync.ts
│   ├── sendResponse.ts
│   ├── logger.ts
│   └── crypto.ts
│
├── types/                  # Global types and express definitions merging
│   ├── express.d.ts
│   └── index.ts
│
└── scripts/                # Database seeding script
    └── seed.ts
```

---

## 🛠️ Requirements & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file at the root using the template `.env.example`:
   ```env
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/tournament-manager
   JWT_ACCESS_SECRET=your_jwt_access_secret_key_change_me_in_production_12345
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_me_in_production_12345
   JWT_REFRESH_EXPIRES_IN=7d
   ```

3. Seed the database with default records (Super Admin, Organizer, Sports, Teams, Players, Matches):
   ```bash
   # Run the seed script via ts-node
   npx ts-node src/scripts/seed.ts
   ```

4. Start the development server (with hot reload):
   ```bash
   npm run dev
   ```

5. Compile TypeScript files for production:
   ```bash
   npm run build
   ```

---

## 📡 API Endpoints

All endpoints are prefixed with `/api`.

### Authentication & Users
- `POST /api/auth/register` - Create a user account and receive authentication tokens.
- `POST /api/auth/login` - Authenticate using email and password.
- `POST /api/auth/refresh` - Refresh an expired access token using the refresh token (supports HTTP cookies).
- `POST /api/auth/logout` - Clear authenticated session cookie.
- `POST /api/auth/forgot-password` - Request a password reset token.
- `POST /api/auth/reset-password` - Reset password using a valid reset token.
- `PATCH /api/auth/change-password` - Change password (protected).
- `GET /api/users/me` - Fetch profile of the logged-in user.
- `PATCH /api/users/me` - Update profile details.
- `GET /api/users` - List all users (Super Admin / Organizer only, supports pagination & search).
- `GET /api/users/:id` - Fetch user by ID.
- `PATCH /api/users/:id` - Modify user details or role.
- `DELETE /api/users/:id` - Soft delete user.

### Sports & Tournaments
- `POST /api/tournaments/sports` - Create a new sport (Super Admin / Organizer only).
- `GET /api/tournaments/sports` - Fetch list of sports.
- `POST /api/tournaments` - Create a tournament.
- `GET /api/tournaments` - Get list of tournaments (supports pagination, search by name, filtering by sport or status).
- `GET /api/tournaments/:id` - Fetch details of a tournament.
- `PATCH /api/tournaments/:id` - Modify tournament details.
- `DELETE /api/tournaments/:id` - Soft delete tournament.
- `POST /api/tournaments/:id/register` - Register a team to a tournament.
- `POST /api/tournaments/:id/unregister` - Remove team from tournament roster.

### Teams & Players
- `POST /api/teams` - Create a new team (Super Admin / Organizer / Team Manager).
- `GET /api/teams` - List teams.
- `GET /api/teams/:id` - Get team by ID.
- `PATCH /api/teams/:id` - Update team info.
- `DELETE /api/teams/:id` - Soft delete team.
- `POST /api/players` - Create player profile and link to team.
- `GET /api/players/me` - Get profile details of the logged-in player.
- `GET /api/players` - List players.
- `GET /api/players/:id` - Fetch player by ID.
- `PATCH /api/players/:id` - Update player career statistics, jersey number or team.
- `DELETE /api/players/:id` - Soft delete player profile.

### Matches & Live Scores
- `POST /api/matches` - Schedule a fixture/match.
- `GET /api/matches` - Get matches list.
- `GET /api/matches/:id` - Fetch match info.
- `PATCH /api/matches/:id` - Edit match fixture date/referee.
- `DELETE /api/matches/:id` - Soft delete match.
- `PATCH /api/matches/:id/score` - Live-score updating endpoint for scorekeepers & referees. Accepts:
  ```json
  {
    "score": { "homeTeam": 2, "awayTeam": 1 },
    "event": {
      "type": "goal",
      "minute": 54,
      "player": "PLAYER_ID_HERE",
      "details": "Fantastic header into top corner"
    }
  }
  ```
- `POST /api/matches/:id/end` - Conclude and finalize match score.

---

## 🔌 Realtime WebSockets (Socket.io)

Clients can connect to the Socket.io server to stream live game events.

### Client Event Listeners

1. **`joinMatch`**: Join live scoring feed for a match.
   ```javascript
   socket.emit('joinMatch', 'MATCH_ID');
   ```
2. **`leaveMatch`**: Leave live scoring room.
   ```javascript
   socket.emit('leaveMatch', 'MATCH_ID');
   ```
3. **`joinTournament`**: Join updates for a tournament.
   ```javascript
   socket.emit('joinTournament', 'TOURNAMENT_ID');
   ```

### Server-Emitted Realtime Events

- **`scoreUpdate`**: Emitted to match room when live score or event changes.
  ```json
  {
    "matchId": "...",
    "score": { "homeTeam": 1, "awayTeam": 0 },
    "status": "live",
    "events": [...]
  }
  ```
- **`tournamentScoreUpdate`**: Emitted to tournament room when any match score is updated.
- **`matchFinished`**: Emitted to match room when match is concluded.
- **`tournamentMatchFinished`**: Emitted to tournament room when a match is concluded.
