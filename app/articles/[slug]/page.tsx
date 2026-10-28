import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findFirst({ where: { slug: params.slug, published: true } });
  if (!article) notFound();
  return <main className="container section" style={{maxWidth:850}}><Link className="tag" href="/articles">← بازگشت به مجله</Link><article className="card" style={{marginTop:24}}><div className="eyebrow">DOJO JOURNAL</div><h1 style={{fontSize:"clamp(30px,4vw,48px)"}}>{article.title}</h1><p className="muted">{article.excerpt}</p><hr style={{borderColor:"var(--line)",margin:"25px 0"}}/><div style={{whiteSpace:"pre-wrap",lineHeight:2.3}}>{article.content}</div></article></main>;
}
