import { prisma } from '@/lib/prisma'
import { createExpenseV1 } from '@/lib/finance/services/expense-service'

async function main() {
  let group = await prisma.group.findFirst({
    where: { name: 'Phase 1 Demo Group' },
  })

  if (!group) {
    group = await prisma.group.create({
      data: {
        name: 'Phase 1 Demo Group',
        currency: 'VND',
      },
    })
  }

  let members = await prisma.member.findMany({
    where: { groupId: group.id },
    orderBy: { createdAt: 'asc' },
  })

  if (members.length < 3) {
    const names = ['An', 'Binh', 'Chi']

    for (const name of names) {
      const existing = members.find((member) => member.name === name)
      if (!existing) {
        const created = await prisma.member.create({
          data: {
            groupId: group.id,
            name,
          },
        })
        members.push(created)
      }
    }
  }

  if (members.length < 3) {
    throw new Error('Unable to ensure at least 3 members for demo data')
  }

  const existingExpenseCount = await prisma.expense.count({
    where: { groupId: group.id },
  })

  if (existingExpenseCount === 0) {
    const [an, binh, chi] = members

    await createExpenseV1({
      groupId: group.id,
      title: 'Cafe + snacks',
      amount: 120000,
      paidByMemberId: an.id,
      participantMemberIds: [an.id, binh.id, chi.id],
      shareStrategy: 'EQUAL',
      notes: 'Demo seed expense',
    })

    await createExpenseV1({
      groupId: group.id,
      title: 'Team lunch',
      amount: 360000,
      paidByMemberId: binh.id,
      participantMemberIds: [an.id, binh.id, chi.id],
      shareStrategy: 'EQUAL',
      notes: 'Demo seed expense',
    })
  }

  console.log(`Seed completed for group ${group.id}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
