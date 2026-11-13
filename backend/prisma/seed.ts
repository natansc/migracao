// Prisma Seed - Creates default admin user when running database migrations
// Run with: npx prisma db seed
// Note: The application's UsersService.ensureDefaultAdmin() will hash the password on next startup

const { PrismaClient } = require('./generated/prisma/client.js')

const prisma = new PrismaClient()

async function main() {
  const adminUsername = 'natan.costa'
  const adminEmail = 'natan.costa@trinusco.com.br'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  })

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed.')
    return
  }

  // Create the admin user with a default password (will be hashed by app on next startup)
  const adminUser = await prisma.user.create({
    data: {
      username: adminUsername,
      email: adminEmail,
      role: 'ADMIN',
      password: 'Sup@2022S', // Senha padrão - será hash pela aplicação na próxima inicialização
    },
  })

  console.log(`Admin user created: ${adminUser.username} (role: ${adminUser.role})`)
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