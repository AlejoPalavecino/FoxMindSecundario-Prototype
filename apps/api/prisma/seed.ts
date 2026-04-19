import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Colegio Demo FoxMind"
    }
  });

  const docente = await prisma.user.upsert({
    where: { email: "docente.demo@foxmind.app" },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "docente.demo@foxmind.app",
      passwordHash: "demo-hash",
      fullName: "Docente Demo",
      role: Role.DOCENTE
    }
  });

  const alumno = await prisma.user.upsert({
    where: { email: "alumno.demo@foxmind.app" },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "alumno.demo@foxmind.app",
      passwordHash: "demo-hash",
      fullName: "Alumno Demo",
      role: Role.ALUMNO
    }
  });

  const classroom = await prisma.classroom.upsert({
    where: { id: "22222222-2222-2222-2222-222222222222" },
    update: {},
    create: {
      id: "22222222-2222-2222-2222-222222222222",
      tenantId: tenant.id,
      teacherId: docente.id,
      name: "1A Ciencias",
      subject: "Ciencias Naturales"
    }
  });

  await prisma.enrollment.upsert({
    where: {
      classroomId_studentId: {
        classroomId: classroom.id,
        studentId: alumno.id
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      classroomId: classroom.id,
      studentId: alumno.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
