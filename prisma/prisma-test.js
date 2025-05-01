const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const result = await prisma.$queryRaw`SELECT 1+1 AS test`
    console.log('Database connection test:', result)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())