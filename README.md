# MapVault - Antique Map Collection CMS

A personal Content Management System for organizing and managing your antique map collection, built with Next.js, TypeScript, Prisma, and SQLite.

## Features

- **Public Collection View**: Browse your map collection with a responsive design
- **Advanced Search & Filtering**: Search by title, description, mapmaker, or region with comprehensive filters
- **Detailed Map Pages**: Individual pages showing comprehensive map information
- **Admin Authentication**: Secure login system to protect admin functionality
- **Admin Upload Form**: Add new maps with images and detailed metadata  
- **Dual Data Model**: Public information for storefront display + private admin data
- **Protected Admin Features**: Edit/delete maps and view private information (admin only)
- **Image Upload**: Support for featured map images with automatic file management
- **Mobile-Friendly**: Responsive design that works on all devices
- **TypeScript**: Full type safety throughout the application
- **SQLite Database**: Local database perfect for personal collections

## Database Schema

The application includes the following main entities:

- **Maps**: Core map records with both public and private fields
- **Categories**: Map categorization (World Maps, City Maps, etc.)
- **Conditions**: Map condition ratings (Mint, Fine, Good, etc.) 
- **Vendors**: Track where you purchased maps
- **Storage Locations**: Organize physical storage
- **Map Images**: Support for multiple images per map

## Quick Start

1. **Development Server**:
   ```bash
   # For Git Bash / Linux / Mac:
   DATABASE_URL="file:./dev.db" npm run dev
   
   # For PowerShell:
   $env:DATABASE_URL="file:./dev.db"; npm run dev
   
   # Or just:
   npm run dev
   ```

2. **Access the Application**:
   - **Public Collection**: http://localhost:3000
   - **Admin Login**: http://localhost:3000/admin/login
   - **Upload Form**: http://localhost:3000/admin/upload (requires login)

3. **Admin Login Credentials**:
   - **Username**: `jenright20`  
   - **Password**: `korver123!`

4. **Database Management**:
   ```bash
   # Seed with sample data (already done)
   npm run db:seed
   
   # Reset database (if needed)
   npx prisma db push --force-reset
   npm run db:seed
   ```

## Usage

### First Time Setup

1. **Start the development server** using the commands above
2. **Visit the public collection** at http://localhost:3000 to see the public interface
3. **Login as admin** at http://localhost:3000/admin/login using the credentials above
4. **Start adding maps** to your collection!

### Adding Your First Map

1. **Login** at http://localhost:3000/admin/login
2. Click "Add Map" or navigate to /admin/upload
3. Fill out the form with your map details:
   - **Required**: Title, Category, Condition, Price
   - **Optional**: Description, year created, region, dimensions
   - **Image**: Upload a high-quality photo of your map
   - **Admin Info**: Purchase details, storage location, private notes

### Public vs Admin Views

- **Public users** see: Map collection, basic details, prices, availability
- **Admin users** see: Everything above PLUS purchase info, storage details, edit/delete buttons

### Managing Your Collection

- **View All Maps**: The home page shows a responsive table/grid of all maps
- **Map Details**: Click any map to see full details including admin information
- **Add New Maps**: Use the upload form to add maps with images and metadata
- **Edit Maps**: Update existing map information, images, and metadata
- **Delete Maps**: Remove maps from your collection with confirmation (includes image cleanup)
- **Featured Maps**: Mark important maps as "featured" to highlight them
- **Availability Status**: Track which maps are available for sale

### Advanced Search & Filtering

- **Text Search**: Search across map titles, descriptions, mapmakers, and regions
- **Category Filter**: Filter by map type (World Maps, City Maps, etc.)
- **Year Range**: Filter maps by creation date range
- **Mapmaker Filter**: Find maps by specific cartographers or publishers
- **Region Filter**: Filter by geographic area or location
- **Condition Filter**: Filter by map condition (Mint, Fine, Good, etc.)
- **Special Filters**: Filter by featured status and availability
- **Real-time Results**: Instant search results as you type with debounced queries

### Admin Management System

- **Manage Categories**: Add, edit, and organize map categories (World Maps, City Maps, etc.)
- **Manage Vendors**: Track vendors with detailed contact info and notes about each supplier
- **Manage Conditions**: Set up condition ratings (Mint, Fine, Good, etc.)
- **Manage Storage**: Organize physical storage locations and systems
- **Reference Data**: All dropdown options are fully customizable through the admin interface

### Mobile Experience

The application is fully responsive:
- **Mobile**: Card-based layout with essential information
- **Desktop**: Full table view with all columns visible
- **Tablet**: Adaptive layout that scales appropriately

## File Structure

```
MapVault/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── auth/           # Authentication API routes (login/logout/status)
│   │   ├── upload/         # File upload API route
│   │   └── maps/[id]/      # Map update/deletion API routes
│   ├── admin/
│   │   ├── login/          # Admin login page
│   │   ├── upload/         # Admin upload form page
│   │   └── edit/[id]/      # Admin edit form page  
│   ├── maps/[id]/         # Dynamic map detail pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page with map collection
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication context provider
│   ├── Header.tsx         # Header with auth-aware navigation
│   ├── LoginForm.tsx      # Admin login form
│   ├── MapsTable.tsx      # Responsive map table/grid  
│   ├── UploadForm.tsx     # Comprehensive upload form
│   ├── EditMapForm.tsx    # Pre-populated edit form
│   ├── EditMapButton.tsx  # Edit button for map pages
│   └── DeleteMapButton.tsx # Map deletion with confirmation
├── lib/                   # Utilities
│   ├── auth.ts            # Authentication utilities and session management
│   └── prisma.ts          # Prisma client configuration
├── prisma/               # Database
│   ├── schema.prisma      # Database schema definition
│   ├── seed.ts           # Sample data seeder
│   └── dev.db            # SQLite database file
├── middleware.ts          # Route protection middleware
└── public/uploads/        # Uploaded map images
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite
- **File Upload**: Built-in multipart form handling
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component with Sharp

## Development Notes

- The application runs on `http://localhost:3000`
- Images are stored in `public/uploads/` directory
- Database file is located at `prisma/dev.db`
- All map data includes both public-facing and private admin fields
- The design follows modern web standards with dark mode support

## Customization

You can easily customize the application:

- **Categories**: Modify the seed data in `prisma/seed.ts`
- **Styling**: Update Tailwind classes throughout the components
- **Fields**: Add new fields to the Prisma schema and update forms
- **Validation**: Add form validation and error handling as needed

## Production Deployment

For production deployment, you'll want to:

1. Set up a production database (PostgreSQL recommended)
2. Configure proper image hosting (Cloudinary, AWS S3, etc.)
3. Add authentication for admin features
4. Set up proper error logging and monitoring

Enjoy managing your antique map collection! 🗺️