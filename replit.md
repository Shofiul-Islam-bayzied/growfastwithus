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
- **Database**: PostgreSQL (configured for Neon serverless)
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
- **Users Table**: Basic user authentication structure
- **Contacts Table**: Lead capture and contact management
- **Templates Table**: Automation template catalog with pricing and features

### Frontend Components
- **Multi-step Form**: Progressive contact capture with validation
- **Template Gallery**: Showcase of automation templates with filtering
- **Theme Provider**: Light/dark mode theming system
- **UI Components**: Comprehensive set of reusable components (buttons, cards, forms, etc.)

### Backend Services
- **Storage Interface**: Abstracted data layer with in-memory and database implementations
- **Route Registration**: Modular API route organization
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

## Changelog
- June 28, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.