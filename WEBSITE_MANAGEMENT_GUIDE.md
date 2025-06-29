# GrowFastWithUs Website Management Guide

## Table of Contents
1. [Editing Button URLs](#editing-button-urls)
2. [Deployment Guide](#deployment-guide)
3. [Customization Guide](#customization-guide)
4. [Content Management](#content-management)
5. [Common Tasks](#common-tasks)

---

## Editing Button URLs

### Contact Form Buttons
The main contact buttons are located in these files:

#### 1. Home Page Buttons (`client/src/pages/home.tsx`)

**Book Discovery Call Buttons:**
```javascript
// Line ~266: Header CTA Button
<Button 
  className="hidden lg:block bg-primary hover:bg-primary/90 text-white shadow-lg"
  onClick={() => scrollToSection('contact')}
>
  Book Discovery Call
</Button>

// Line ~458: Floating Action Button
<Button 
  className="glass-button shadow-lg animate-pulse-glow px-6 py-3 rounded-full font-semibold"
  onClick={() => scrollToSection('contact')}
>
  <Phone className="w-4 h-4 mr-2" />
  Book Discovery Call
</Button>
```

**To change these to external URLs:**
```javascript
// Replace onClick with href for external links
<Link href="https://calendly.com/your-calendar">
  <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
    Schedule Call Now
  </Button>
</Link>
```

#### 2. Template Page Buttons (`client/src/pages/template-detail-new.tsx`)

**Get Started Buttons:**
```javascript
// Line ~287: Main CTA in template pages
<Link href="/#contact">
  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
    Get Started Now
  </Button>
</Link>
```

**To change to external URL:**
```javascript
<Link href="https://your-booking-link.com">
  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
    Schedule Call Now
  </Button>
</Link>
```

### Navigation Links
Located in `client/src/pages/home.tsx` around line 254:

```javascript
// Desktop Navigation
<div className="hidden lg:flex items-center space-x-8">
  <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
  <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
  <a href="#templates" onClick={(e) => { e.preventDefault(); scrollToSection('templates'); }}>Templates</a>
  <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a>
  <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
</div>
```

**To change to external pages:**
```javascript
<div className="hidden lg:flex items-center space-x-8">
  <a href="/">Home</a>
  <a href="/services">Services</a>
  <a href="/templates">Templates</a>
  <a href="https://your-pricing-page.com">Pricing</a>
  <a href="/contact">Contact</a>
</div>
```

---

## Deployment Guide

### Option 1: Replit Deployment (Recommended)
1. **Enable Deployments:**
   - Go to your Replit project
   - Click the "Deploy" button in the top navigation
   - Choose "Autoscale" deployment for production

2. **Configure Environment Variables:**
   - Add your `DATABASE_URL` in deployment settings
   - Ensure all necessary secrets are configured

3. **Custom Domain (Optional):**
   - Purchase domain from provider (GoDaddy, Namecheap, etc.)
   - In Replit Deployments, add custom domain
   - Update DNS records as instructed

### Option 2: External Hosting (Vercel, Netlify)

#### Vercel Deployment:
1. **Prepare for deployment:**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Environment Variables:**
   - Add `DATABASE_URL` in Vercel dashboard
   - Configure production environment

#### Netlify Deployment:
1. **Build command:** `npm run build`
2. **Publish directory:** `dist/public`
3. **Environment variables:** Add `DATABASE_URL`

### Option 3: Traditional VPS/Server
1. **Server Setup:**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy Application:**
   ```bash
   # Clone your repository
   git clone your-repo-url
   cd your-project

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start with PM2
   pm2 start ecosystem.config.js
   ```

---

## Customization Guide

### 1. Changing Colors and Branding

#### Primary Color (Orange)
File: `client/src/index.css`
```css
:root {
  --primary: 14 100% 57%; /* Current orange color */
  --primary-foreground: 0 0% 98%;
}

/* To change to blue for example: */
:root {
  --primary: 217 91% 60%; /* Blue color */
  --primary-foreground: 0 0% 98%;
}
```

#### Logo Replacement
File: Multiple locations - search for "white tect logo_1751164300901.png"
```javascript
// Replace all instances with your logo
<img 
  src="/path-to-your-logo.png" 
  alt="Your Company Logo" 
  className="h-8 w-auto"
/>
```

### 2. Content Updates

#### Company Information
File: `client/src/pages/home.tsx`

**Contact Information (around line 1080):**
```javascript
// Email
hello@growfastwithus.com

// Phone
+44 20 7946 0958

// Address/Region
United Kingdom, United States
```

**Company Description:**
Search for "GrowFastWithUs" and "automation agency" throughout the files to update.

### 3. Template Management

#### Adding New Templates
File: `client/src/lib/templates.ts`

```javascript
export const templates: Template[] = [
  {
    id: "your-new-template",
    title: "Your New Automation",
    description: "Description of your automation",
    price: 299,
    category: "Your Category",
    icon: YourIcon, // Import from lucide-react
    features: ["Feature 1", "Feature 2", "Feature 3"],
    popular: true, // Optional
  },
  // ... existing templates
];
```

#### Template Categories
Categories are automatically generated from template data. To add new categories, just include them in new templates.

### 4. Form Configuration

#### Contact Form Fields
File: `client/src/components/advanced-contact-form.tsx`

**Pain Points Options (around line 14):**
```javascript
const painPointOptions = [
  "Manual data entry",
  "Customer support overload", 
  "Your custom pain point",
  // Add more options
];
```

**Business Size Options (around line 150):**
```javascript
<SelectItem value="Startup (1-5 employees)">Startup (1-5 employees)</SelectItem>
<SelectItem value="Small Business (1-10 employees)">Small Business (1-10 employees)</SelectItem>
// Add more size options
```

---

## Content Management

### 1. Homepage Sections

#### Hero Section
File: `client/src/pages/home.tsx` (around line 430)
```javascript
<h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
  Your New Headline
</h1>
<p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
  Your new description
</p>
```

#### Services Section
File: `client/src/pages/home.tsx` (around line 497)
```javascript
{[
  { icon: Zap, title: "Your Service 1", description: "Service description" },
  { icon: Bot, title: "Your Service 2", description: "Service description" },
  // Modify existing services or add new ones
].map((service, index) => (
```

### 2. Footer Information
File: `client/src/pages/home.tsx` (around line 1140)

Update company information, social links, and legal pages.

### 3. Legal Pages
Files: 
- `client/src/pages/privacy-policy.tsx`
- `client/src/pages/terms-of-service.tsx` 
- `client/src/pages/gdpr.tsx`

Update these with your actual legal content.

---

## Common Tasks

### 1. Adding New Pages
1. Create new file in `client/src/pages/`
2. Add route in `client/src/App.tsx`:
   ```javascript
   <Route path="/your-page" component={YourPage} />
   ```

### 2. Adding External Links
Replace internal navigation with external URLs:
```javascript
// Internal link
<Link href="/templates">Templates</Link>

// External link  
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

### 3. Changing Button Behavior
Convert scroll behavior to external links:
```javascript
// From scroll behavior:
onClick={() => scrollToSection('contact')}

// To external link:
<Link href="https://calendly.com/your-link">
```

### 4. Database Configuration
File: `server/db.ts`
Update connection string for production database.

### 5. Email Integration
File: `server/routes.ts`
Add email service integration for form submissions.

---

## Quick Reference

### Most Common Button Locations:
1. **Header CTA:** `client/src/pages/home.tsx` line ~266
2. **Mobile Menu CTA:** `client/src/pages/home.tsx` line ~349  
3. **Hero CTA:** `client/src/pages/home.tsx` line ~458
4. **Template CTAs:** `client/src/pages/template-detail-new.tsx` line ~287
5. **Pricing CTA:** `client/src/pages/home.tsx` line ~981

### Key Configuration Files:
- **Colors/Styling:** `client/src/index.css`
- **Templates:** `client/src/lib/templates.ts`
- **Contact Form:** `client/src/components/advanced-contact-form.tsx`
- **Navigation:** `client/src/pages/home.tsx`
- **Database:** `server/db.ts`

### Environment Variables Needed:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NODE_ENV` - Set to "production" for deployment

---

This guide covers the most common customization needs. For specific changes not covered here, locate the relevant file using the search functionality and modify accordingly.