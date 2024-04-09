import { prisma } from "../src/lib/prisma";

async function seed() {

  await prisma.event.create({
    data: {
      id: '26aeebe1-c003-45eb-a648-d917096430ae',
      title: 'Fastfy Summit',
      slug: 'fastfy-summmit',
      details: 'For Coders.',
      maximumAttendees: 120
    }
  })

}


seed().then(() => {
  console.log('done')
  prisma.$disconnect()
})