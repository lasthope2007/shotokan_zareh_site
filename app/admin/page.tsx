import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const [articles, honors, students, messages] = await Promise.all([
    prisma.article.count(), prisma.achievement.count(), prisma.student.count(), prisma.contactMessage.count({ where: { read: false } })
  ]);
  return <div className="admin-shell"><aside className="sidebar"><Link className="brand" href="/"><span className="brand-mark">道</span><span>پنل آکادمی</span></Link><nav style={{marginTop:28}}><Link href="/admin">نمای کلی</Link><Link href="/admin/articles">مقالات</Link><Link href="/admin/achievements">افتخارات</Link><Link href="/admin/students">هنرجویان</Link><Link href="/admin/messages">پیام‌ها</Link><Link href="/admin/gallery">گالری تصاویر</Link><Link href="/admin/settings">تنظیمات سایت</Link></nav><form action="/api/admin/logout" method="post"><button className="btn secondary" style={{width:"100%",marginTop:25}}>خروج</button></form></aside>
    <main className="admin-main"><div className="admin-top"><div><div className="eyebrow">CONTROL CENTER</div><h1>داشبورد مدیریت</h1><p className="muted">مدیریت محتوای آکادمی شوتوکان زارع</p></div><Link className="btn" href="/" target="_blank">مشاهده سایت ↗</Link></div>
      <div className="notice">پنل به دیتابیس PostgreSQL متصل است. حساب مدیر را امن نگه دارید و قبل از انتشار، رمز پیش‌فرض را تغییر دهید.</div>
      <div className="grid3"><div className="card"><div className="tag">مقالات</div><h2>{articles}</h2><Link className="tag" href="/admin/articles">مدیریت مقالات ←</Link></div><div className="card"><div className="tag">افتخارات</div><h2>{honors}</h2><Link className="tag" href="/admin/achievements">مدیریت افتخارات ←</Link></div><div className="card"><div className="tag">هنرجویان</div><h2>{students}</h2><Link className="tag" href="/admin/students">مدیریت هنرجویان ←</Link></div><div className="card"><div className="tag">پیام‌های خوانده‌نشده</div><h2>{messages}</h2><Link className="tag" href="/admin/messages">مشاهده پیام‌ها ←</Link></div></div>
      <div className="card" style={{marginTop:20}}><h3>امکانات پنل</h3><p className="muted">از این بخش می‌توانید مقالات، افتخارات، هنرجویان، گالری، پیام‌های تماس و اطلاعات عمومی سایت را مدیریت کنید.</p></div>
    </main></div>;
}
