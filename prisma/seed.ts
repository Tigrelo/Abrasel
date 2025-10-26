
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const adminPassword = await hash('admin123', 12); 

  await prisma.user.upsert({
    where: { email: 'admin@app.com' },
    update: {},
    create: {
      email: 'admin@app.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Administrador criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });