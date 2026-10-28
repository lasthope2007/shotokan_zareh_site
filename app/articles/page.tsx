import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
  return <main className="container section"><Link href="/" className="tag">← بازگشت به خانه</Link><div className="section-head" style={{marginTop:24}}><div><div className="eyebrow">DOJO JOURNAL</div><h2>مجله آکادمی</h2><p>مقالات آموزشی، فرهنگ شوتوکان و آمادگی مسابقه</p></div></div>
    {articles.length ? <div className="grid3">{articles.map(a=><article className="card" key={a.id}><span className="tag">مقاله</span><h3>{a.title}</h3><p>{a.excerpt}</p><Link className="btn secondary" href={`/articles/${a.slug}`}>ادامه مطلب</Link></article>)}</div> : <div className="card">هنوز مقاله‌ای منتشر نشده است.</div>}
  </main>;
}
