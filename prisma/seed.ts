import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const monkeys = [
    {
      id: '5c03994c-fc16-47e0-bd02-d218a370a078',
      url: 'https://t4.ftcdn.net/jpg/05/29/61/37/360_F_529613760_ZN7wI9c62MyPeFC8ioliQ2wrVohVuRey.jpg',
      description: 'First Monkey',
    },
    {
      id: '5c03994d-fc16-47e0-bd02-d218a370a066',
      url: 'https://e3.365dm.com/24/03/1600x900/skynews-francois-langur-monkey_6488923.jpg?20240313102133',
      description: 'Second Monkey',
    },
    {
      id: '7c03994c-ac16-47e0-bd04-d218a370a278',
      url: 'https://zoo.sandiegozoo.org/sites/default/files/styles/hero_with_nav_gradient/public/hero/monkey_hero.png?itok=o_iLNVSF',
      description: 'Third Monkey',
    },
  ];

  for (const monkey of monkeys) {
    await prisma.monkeyPicture.upsert({
      where: {
        id: monkey.id,
      },
      create: {
        id: monkey.id,
        url: monkey.url,
        description: monkey.description,
      },
      update: {},
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
