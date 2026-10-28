import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schemas = {
  article: z.object({
    id: z.string().optional(), title: z.string().trim().min(2).max(180),
    slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9-]+$/),
    excerpt: z.string().trim().min(2).max(500), content: z.string().trim().min(2).max(20000),
    coverImage: z.string().optional(), published: z.string().optional()
  }),
  achievement: z.object({
    id: z.string().optional(), athleteName: z.string().trim().min(2).max(100),
    title: z.string().trim().min(2).max(180), competition: z.string().trim().min(2).max(180),
    level: z.string().trim().min(2).max(40), year: z.coerce.number().int().min(1950).max(2100),
    imageUrl: z.string().optional(), featured: z.string().optional()
  }),
  student: z.object({
    id: z.string().optional(), name: z.string().trim().min(2).max(100),
    description: z.string().optional(), rank: z.string().optional(), imageUrl: z.string().optional(),
    featured: z.string().optional()
  }),
  gallery: z.object({
    id: z.string().optional(), title: z.string().trim().min(2).max(180),
    imageUrl: z.string().url(), category: z.string().trim().min(2).max(80)
  }),
  settings: z.object({
    academyName: z.string().trim().min(2).max(180), coachName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(30), address: z.string().trim().min(5).max(500),
    instagram: z.string().trim().max(100), schedule: z.string().trim().min(2).max(300),
    intro: z.string().trim().min(2).max(1000)
  })
};

function str(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL("/admin/login", request.url), 303);

  const form = await request.formData();
  const type = str(form, "type");
  const action = str(form, "action");
  const id = str(form, "id");

  try {
    if (action === "delete") {
      if (!id) throw new Error("شناسه رکورد نامعتبر است.");
      if (type === "article") await prisma.article.delete({ where: { id } });
      else if (type === "achievement") await prisma.achievement.delete({ where: { id } });
      else if (type === "student") await prisma.student.delete({ where: { id } });
      else if (type === "gallery") await prisma.galleryItem.delete({ where: { id } });
      else if (type === "message") await prisma.contactMessage.delete({ where: { id } });
      else throw new Error("نوع عملیات مجاز نیست.");
    } else if (action === "read" && type === "message") {
      await prisma.contactMessage.update({ where: { id }, data: { read: true } });
    } else if (type === "article") {
      const raw = Object.fromEntries(form.entries());
      const parsed = schemas.article.safeParse(raw);
      if (!parsed.success) throw new Error("اطلاعات مقاله کامل یا معتبر نیست.");
      const d = parsed.data;
      const data = { title: d.title, slug: d.slug, excerpt: d.excerpt, content: d.content,
        coverImage: d.coverImage || null, published: d.published === "on",
        publishedAt: d.published === "on" ? new Date() : null };
      if (d.id) await prisma.article.update({ where: { id: d.id }, data });
      else await prisma.article.create({ data });
    } else if (type === "achievement") {
      const parsed = schemas.achievement.safeParse(Object.fromEntries(form.entries()));
      if (!parsed.success) throw new Error("اطلاعات افتخار کامل یا معتبر نیست.");
      const d = parsed.data;
      const data = { athleteName:d.athleteName, title:d.title, competition:d.competition, level:d.level,
        year:d.year, imageUrl:d.imageUrl || null, featured:d.featured === "on" };
      if (d.id) await prisma.achievement.update({ where: { id:d.id }, data });
      else await prisma.achievement.create({ data });
    } else if (type === "student") {
      const parsed = schemas.student.safeParse(Object.fromEntries(form.entries()));
      if (!parsed.success) throw new Error("اطلاعات هنرجو کامل یا معتبر نیست.");
      const d = parsed.data;
      const data = { name:d.name, description:d.description || null, rank:d.rank || null,
        imageUrl:d.imageUrl || null, featured:d.featured === "on" };
      if (d.id) await prisma.student.update({ where: { id:d.id }, data });
      else await prisma.student.create({ data });
    } else if (type === "gallery") {
      const parsed = schemas.gallery.safeParse(Object.fromEntries(form.entries()));
      if (!parsed.success) throw new Error("عنوان، دسته‌بندی و نشانی معتبر تصویر لازم است.");
      const d = parsed.data;
      const data = { title:d.title, imageUrl:d.imageUrl, category:d.category };
      if (d.id) await prisma.galleryItem.update({ where: { id:d.id }, data });
      else await prisma.galleryItem.create({ data });
    } else if (type === "settings") {
      const parsed = schemas.settings.safeParse(Object.fromEntries(form.entries()));
      if (!parsed.success) throw new Error("اطلاعات تنظیمات کامل یا معتبر نیست.");
      await prisma.siteSettings.upsert({ where:{ id:"main" }, create:{ id:"main", ...parsed.data }, update:parsed.data });
    } else {
      throw new Error("نوع عملیات نامعتبر است.");
    }
    return NextResponse.redirect(new URL(`/admin/${type === "settings" ? "settings" : type === "gallery" ? "gallery" : type === "message" ? "messages" : type === "achievement" ? "achievements" : type === "student" ? "students" : "articles"}?saved=1`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در ذخیره اطلاعات.";
    return NextResponse.redirect(new URL(`/admin/${type === "settings" ? "settings" : type === "gallery" ? "gallery" : type === "message" ? "messages" : type === "achievement" ? "achievements" : type === "student" ? "students" : "articles"}?error=${encodeURIComponent(message)}`, request.url), 303);
  }
}
