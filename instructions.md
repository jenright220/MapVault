
## Project Overview

- **Purpose**: Personal CMS for organizing antique maps with public storefront functionality
- **Access Levels**: Public view (limited info) + Private admin view (full details)
- **No User Authentication**: Public users browse without login
- **No Payment Processing**: Display-only storefront
---
## Database Tables Structure

| Column Name         | Type          | Public? | Private? | Description             |
| ------------------- | ------------- | ------- | -------- | ----------------------- |
| id                  | INT (PK)      | ✓       | ✓        | Unique identifier       |
| title               | VARCHAR(255)  | ✓       | ✓        | Map title/name          |
| description         | TEXT          | ✓       | ✓        | Public description      |
| price               | DECIMAL(10,2) | ✓       | ✓        | Selling price           |
| condition_id        | INT (FK)      | ✓       | ✓        | Links to `Conditions`   |
| category_id         | INT (FK)      | ✓       | ✓        | Links to `Categories`   |
| year_created        | INT           | ✓       | ✓        | Year map was created    |
| region              | VARCHAR(255)  | ✓       | ✓        | Geographic region shown |
| dimensions          | VARCHAR(100)  | ✓       | ✓        | Physical dimensions     |
| featured_image      | VARCHAR(255)  | ✓       | ✓        | Filename of main image  |
| is_featured         | BOOLEAN       | ✓       | ✓        | Show on homepage        |
| is_available        | BOOLEAN       | ✓       | ✓        | Is available for sale   |
| purchase_price      | DECIMAL(10,2) | ✗       | ✓        | What you paid           |
| purchase_date       | DATE          | ✗       | ✓        | Date of purchase        |
| vendor_id           | INT (FK)      | ✗       | ✓        | Source/vendor           |
| storage_location_id | INT (FK)      | ✗       | ✓        | Storage location        |
| storage_notes       | TEXT          | ✗       | ✓        | Extra storage info      |
| folding_status      | ENUM          | ✗       | ✓        | flat / folded / rolled  |
| private_notes       | TEXT          | ✗       | ✓        | Admin-only notes        |
| created_at          | TIMESTAMP     | ✗       | ✓        | Record creation time    |
| updated_at          | TIMESTAMP     | ✗       | ✓        | Last updated time       |
|                     |               |         |          |                         |
#### 2. **Categories Table**

| Column Name | Type         | Description                                |
| ----------- | ------------ | ------------------------------------------ |
| id          | INT (PK)     | Unique identifier                          |
| name        | VARCHAR(100) | Category name (e.g. World Maps, City Maps) |
| description | TEXT         | Category description                       |
| sort_order  | INT          | Determines display order                   |
| is_active   | BOOLEAN      | Is this category shown?                    |
  

---

  

## Relationships Summary

  

```

Maps (1) ←→ (many) Map_Images

Maps (many) ←→ (1) Categories

Maps (many) ←→ (1) Conditions

Maps (many) ←→ (1) Vendors

Maps (many) ←→ (1) Storage_Locations

```

  

---

  

## Implementation Strategy

  

### Phase 1: Core Structure

1. Create Maps table with basic public fields

2. Create Categories and Conditions tables

3. Set up basic relationships

  

### Phase 2: Admin Features

1. Add private fields to Maps table

2. Create Vendors and Storage_Locations tables

3. Implement admin-only views

  

### Phase 3: Enhanced Features

1. Add Map_Images table for multiple photos

2. Implement search and filtering

3. Add inventory tracking features

  

---

  

## Sample Data Examples

  

### Categories

- World Maps

- United States Maps

- City Maps

- Nautical Charts

- Topographical Maps

- Historical Maps

  

### Conditions

- Mint (Perfect condition)

- Very Fine (Minor wear)

- Fine (Light wear)

- Good (Moderate wear)

- Fair (Heavy wear)

- Poor (Significant damage)

  

### Storage Types

- Flat File Cabinet

- Map Tubes

- Archival Folders

- Framed Display

- Digital Archive

  

---

  

## Technology Recommendations

  

### Backend 

- **SQLite**: Perfect for development and smaller collections


  

### Frontend Integration

- Separate admin interface for private data

- Image optimization for map displays

