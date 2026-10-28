import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash }
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" }
  });

  const articles = [
    {
      title: "شوتوکان؛ راهی فراتر از مبارزه",
      slug: "shotokan-beyond-fighting",
      excerpt: "کاراته شوتوکان در کنار تکنیک، بر تمرکز، احترام و استمرار تأکید دارد.",
      content: "شوتوکان تنها مجموعه‌ای از تکنیک‌های دفاعی و هجومی نیست؛ تمرین منظم، احترام به دیگران و کنترل ذهن نیز بخش مهمی از مسیر هنرجو هستند. در آکادمی، هدف ما ساختن پایه‌ای درست برای رشد تدریجی ورزشکار است.",
      published: true,
      publishedAt: new Date()
    },
    {
      title: "آشنایی با کومیته",
      slug: "kumite-introduction",
      excerpt: "کومیته به هنرجو کمک می‌کند فاصله، زمان‌بندی و تصمیم‌گیری را در تمرین کنترل‌شده یاد بگیرد.",
      content: "کومیته بخش مبارزه‌ای کاراته است. یادگیری آن باید مرحله‌به‌مرحله و زیر نظر مربی انجام شود؛ از اصول فاصله و واکنش تا تمرین‌های کنترل‌شده و آمادگی مسابقه.",
      published: true,
      publishedAt: new Date()
    }
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article
    });
  }
}

main().finally(async () => prisma.$disconnect());
