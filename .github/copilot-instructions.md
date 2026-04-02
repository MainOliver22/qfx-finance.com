# GitHub Copilot Instructions

## Project Overview

QFX Finance is a NestJS backend API for financial management. It uses TypeScript with strict mode, PostgreSQL via TypeORM, JWT-based authentication, and is containerized with Docker.

## Technology Stack

- **Framework**: NestJS v8 (`@nestjs/*`)
- **Language**: TypeScript 4.4+ (strict mode enabled)
- **Database**: PostgreSQL 16 with TypeORM v0.2
- **Auth**: JWT (`jsonwebtoken`), Passport (`passport-jwt`)
- **Validation**: `class-validator` and `class-transformer`
- **Testing**: Jest with `ts-jest`, `@nestjs/testing`
- **Runtime**: Node.js 18, port 3000

## Project Structure

```
src/
├── app.controller.ts
├── app.service.ts
├── common/
│   └── middleware/          # Cross-cutting Express middleware
└── modules/
    └── {feature}/           # One directory per domain module
        ├── {feature}.module.ts
        ├── {feature}.controller.ts
        ├── {feature}.service.ts
        └── {feature}.guard.ts / {feature}.strategy.ts (if needed)
```

## Code Conventions

### NestJS Patterns
- Use NestJS decorators: `@Module()`, `@Controller()`, `@Injectable()`, `@Get()`, `@Post()`, `@UseGuards()`, etc.
- Organize code into feature modules under `src/modules/{feature}/`.
- Keep business logic in `*.service.ts` files; keep routing/request handling in `*.controller.ts` files.
- Implement guards by implementing the `CanActivate` interface.
- Register all providers and controllers in the feature's `*.module.ts`.
- Use `forRoot`/`forRootAsync` patterns for modules with configuration (e.g., TypeORM, JWT).

### Naming Conventions
- **Files**: `{feature}.{type}.ts` — e.g., `auth.service.ts`, `jwt.guard.ts`
- **Classes**: PascalCase — e.g., `AuthService`, `JwtGuard`, `AdminGuard`
- **Methods/variables**: camelCase
- **Route prefixes**: lowercase strings in `@Controller('auth')`
- **Interfaces/DTOs**: PascalCase, suffix with `Dto` or `Interface` where appropriate

### TypeScript
- Strict mode is enabled — always provide explicit types; avoid `any`.
- Use `async/await` over raw Promises.
- Enable `experimentalDecorators` and `emitDecoratorMetadata` (already set in `tsconfig.json`).
- Output goes to `dist/`; do not import from `dist/`.

### Validation
- Use `class-validator` decorators (`@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, etc.) on DTO classes.
- Use `class-transformer` (`@Transform()`, `@Exclude()`) when shaping request/response objects.
- Apply `ValidationPipe` globally or per-route for automatic DTO validation.

### Database (TypeORM)
- Define entities as TypeScript classes decorated with `@Entity()`, `@Column()`, `@PrimaryGeneratedColumn()`, etc.
- Place entity files alongside their feature module: `src/modules/{feature}/{feature}.entity.ts`.
- Use repositories (injected via `@InjectRepository()`) inside services.
- Avoid raw SQL; prefer TypeORM query builder or repository methods.

### Authentication
- JWT secret is provided via the `jwt_secret` environment variable.
- Use `JwtGuard` (extending `AuthGuard('jwt')`) to protect routes.
- Use `AdminGuard` for admin-only routes.
- Never hard-code secrets or credentials.

### Environment & Configuration
- All secrets and config come from environment variables (see `.env.example`).
- Use `@nestjs/config` (`ConfigService`) to access environment variables inside the app.
- Never commit `.env` files; use `.env.example` to document required variables.

## Testing

- Test files must be named `*.spec.ts` or `*.test.ts` and placed next to the file under test.
- Use `@nestjs/testing` (`Test.createTestingModule`) to set up unit tests.
- Mock services and repositories using Jest mock functions or `jest.fn()`.
- Run tests with `npm test` (runs `jest --passWithNoTests`).

## Build & Run

```bash
npm install --legacy-peer-deps   # Required due to NestJS v8 peer dep conflicts
npm run build                    # Compile TypeScript → dist/
npm start                        # Run compiled app (node dist/main.js)
npm test                         # Run Jest tests
```

For local development with Docker:
```bash
docker-compose up --build
```

## Security Guidelines

- Validate and sanitize all user input via DTOs with `class-validator`.
- Use parameterized queries / TypeORM repository methods to prevent SQL injection.
- Rate limiting is applied globally via `RateLimitMiddleware`.
- Protect sensitive routes with `JwtGuard`; protect admin routes with `AdminGuard`.
- Passwords must be hashed (bcrypt) before storage — never store plaintext passwords.
- Keep dependency versions pinned; run `npm audit` regularly.

## What to Avoid

- Do not place business logic in controllers.
- Do not use `any` type unless absolutely unavoidable.
- Do not hard-code secrets, ports, or environment-specific values.
- Do not bypass NestJS DI — always use `@Injectable()` and module providers.
- Do not modify `dist/` directly; always edit source files in `src/`.
