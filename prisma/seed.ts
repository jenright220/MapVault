const { PrismaClient } = require('@prisma/client')
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed Categories
  const categories = [
    { name: 'World Maps', description: 'Maps showing the entire world or continents', sortOrder: 1 },
    { name: 'United States Maps', description: 'Maps of the United States and its regions', sortOrder: 2 },
    { name: 'City Maps', description: 'Maps of cities and urban areas', sortOrder: 3 },
    { name: 'Nautical Charts', description: 'Maritime navigation charts', sortOrder: 4 },
    { name: 'Topographical Maps', description: 'Maps showing terrain and elevation', sortOrder: 5 },
    { name: 'Historical Maps', description: 'Maps with historical significance', sortOrder: 6 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Seed Conditions
  const conditions = [
    { name: 'Mint', description: 'Perfect condition', sortOrder: 1 },
    { name: 'Very Fine', description: 'Minor wear', sortOrder: 2 },
    { name: 'Fine', description: 'Light wear', sortOrder: 3 },
    { name: 'Good', description: 'Moderate wear', sortOrder: 4 },
    { name: 'Fair', description: 'Heavy wear', sortOrder: 5 },
    { name: 'Poor', description: 'Significant damage', sortOrder: 6 },
  ]

  for (const condition of conditions) {
    await prisma.condition.upsert({
      where: { name: condition.name },
      update: {},
      create: condition,
    })
  }

  // Seed Storage Locations
  const storageLocations = [
    { name: 'Flat File Cabinet', description: 'Large flat filing cabinet for unfolded maps', sortOrder: 1 },
    { name: 'Map Tubes', description: 'Cylindrical tubes for rolled maps', sortOrder: 2 },
    { name: 'Archival Folders', description: 'Acid-free folders for smaller maps', sortOrder: 3 },
    { name: 'Framed Display', description: 'Maps currently on display', sortOrder: 4 },
    { name: 'Digital Archive', description: 'Digital storage location', sortOrder: 5 },
  ]

  for (const location of storageLocations) {
    await prisma.storageLocation.upsert({
      where: { name: location.name },
      update: {},
      create: location,
    })
  }

  // Seed a few sample vendors
  const vendors = [
    { name: 'Antique Maps Inc.', contactInfo: 'contact@antiquemaps.com', notes: 'High-quality historical maps' },
    { name: 'Heritage Cartography', contactInfo: '555-0123', notes: 'Specializes in 18th century maps' },
    { name: 'Estate Sale - Johnson Family', contactInfo: 'Local estate sale', notes: 'Found some great pieces here' },
  ]

  for (const vendor of vendors) {
    await prisma.vendor.upsert({
      where: { name: vendor.name },
      update: {},
      create: vendor,
    })
  }

  // Seed Users
  console.log('Seeding users...')
  
  // Create admin user
  const adminPasswordHash = await bcrypt.hash('korver123!', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'jenright20' },
    update: {},
    create: {
      username: 'jenright20',
      email: 'admin@mapvault.com',
      password: adminPasswordHash,
      isAdmin: true,
      isActive: true,
    },
  })

  console.log(`Admin user created: ${adminUser.username}`)
  console.log('Users seeded successfully!')

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })