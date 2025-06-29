# GrowFastWithUs - Modern Website

## Overview

GrowFastWithUs is a modern React-based website for a digital automation agency specializing in no-code workflow automation and AI integration. The application is built using a full-stack architecture with React frontend, Express.js backend, and PostgreSQL database integration through Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Neon serverless) with WebSocket support
- **Storage Layer**: DatabaseStorage class implementing IStorage interface
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Build System**: ESBuild for production bundling

### Design System
- **Theme**: Adaptive design with light/dark mode support
- **Color Palette**: Orange primary (#FF6B35), dark brown/black, cream/beige
- **Typography**: Modern sans-serif fonts
- **Component Library**: Comprehensive UI components with consistent styling
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Key Components

### Database Schema
- **Users Table**: User authentication with username/password
- **Contacts Table**: Lead capture with business details, pain points, and automation goals
- **Templates Table**: Automation template catalog with pricing, features, and categories

### Frontend Components
- **Advanced Contact Form**: 4-step progressive form with validation and database integration
- **Pricing Calculator**: Interactive ROI calculator with real-time cost breakdown
- **Template Gallery**: Showcase of 15 automation templates with category filtering
- **Theme Provider**: Light/dark mode theming system with localStorage persistence
- **Glassmorphism UI**: Custom components with backdrop blur and transparency effects

### Backend Services
- **Database Storage**: PostgreSQL integration with Drizzle ORM and type-safe operations
- **API Routes**: RESTful endpoints for contacts, templates, and user management
- **Storage Interface**: Abstracted data layer supporting both database and in-memory implementations
- **Route Registration**: Modular API route organization with validation
- **Development Server**: Vite integration for hot module replacement

## Data Flow

1. **Client Requests**: Frontend makes HTTP requests to Express.js API endpoints
2. **API Processing**: Express routes handle business logic and data validation
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Delivery**: JSON responses sent back to React frontend
5. **State Updates**: TanStack Query manages client-side cache and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **framer-motion**: Animation library
- **react-hook-form**: Form handling
- **zod**: Runtime type validation

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error handling
- **@replit/vite-plugin-cartographer**: Development tooling integration
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Production Build
- Frontend assets built with Vite and output to `dist/public`
- Backend compiled with ESBuild to `dist/index.js`
- Single Node.js process serves both static files and API

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Neon PostgreSQL serverless database integration
- Session management with PostgreSQL store

### Development Workflow
- Hot module replacement with Vite integration
- TypeScript compilation checking
- Database schema migrations with Drizzle Kit

## Recent Changes
- **December 29, 2024**: Redesigned website to be minimal and user-friendly
- **December 29, 2024**: Added official GrowFastWithUs logo to header and hero sections
- **December 29, 2024**: Simplified hero animations with reduced particle count (15 particles vs 80)
- **December 29, 2024**: Streamlined call-to-action buttons to simple "Get Started" and "View Templates"
- **December 29, 2024**: Minimized background animations for better text readability
- **December 29, 2024**: Updated brand colors to Digital Empire orange (#FF5722) per user brand assets
- **December 29, 2024**: Removed dark mode functionality and toggle button completely
- **December 29, 2024**: Fixed pain points selection scrolling issue in pricing calculator
- **December 28, 2024**: Added PostgreSQL database integration with Drizzle ORM
- **December 28, 2024**: Implemented advanced pricing calculator with real-time ROI calculations
- **December 28, 2024**: Created 4-step contact form with database persistence
- **December 28, 2024**: Added API endpoints for contact submission and template management
- **December 28, 2024**: Upgraded from in-memory storage to full database operations

## API Endpoints
- **POST /api/contacts**: Submit contact form data with validation
- **GET /api/contacts**: Retrieve all contacts (admin endpoint)
- **GET /api/templates**: Fetch all automation templates
- **GET /api/templates/:id**: Get specific template details
- **POST /api/templates**: Create new template (admin endpoint)

## Database Integration
- **Connection**: Neon PostgreSQL serverless with WebSocket support
- **ORM**: Drizzle with type-safe operations and automatic migrations
- **Schema**: Users, contacts, and templates tables with proper relationships
- **Storage**: DatabaseStorage class implementing IStorage interface for data operations

## Changelog
- June 28, 2025: Initial setup
- December 28, 2024: Database integration and advanced features implementation

## User Preferences
Preferred communication style: Simple, everyday language.