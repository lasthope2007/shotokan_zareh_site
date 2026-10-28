import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, articles, achievements, students, gallery] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.article.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.achievement.findMany({ orderBy: [{ featured: "desc" }, { year: "desc" }], take: 4 }),
    prisma.student.findMany({ where: { featured: true }, take: 3 }),
    prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" }, take: 6 })
  ]);
  const s = settings;
  return <>
    <header className="container"><nav className="nav">
      <Link className="brand" href="/"><span className="brand-mark">道</span><span>{s?.academyName || "آکادمی کاراته شوتوکان زارع"}<small style={{display:"block",fontSize:11,color:"var(--muted)",fontWeight:500}}>SHOTO-KAN KARATE ACADEMY</small></span></Link>
      <div className="navlinks"><a href="#about">آکادمی</a><a href="#coach">مربی</a><a href="#achievements">افتخارات</a><a href="#students">هنرجویان</a><Link href="/articles">مجله</Link><a href="#contact">تماس</a></div>
    </nav></header>
    <main>
      <section className="hero"><div className="container hero-grid">
        <div><div className="eyebrow">DISCIPLINE · RESPECT · COURAGE</div><h1>راهِ کاراته،<br/><span>راهِ ساختنِ خود</span></h1>
          <p>{s?.intro || "در مسیر شوتوکان، قدرت تنها در ضربه نیست؛ در انضباط، احترام و اراده‌ای است که هر روز پرورش می‌دهیم."}</p>
          <div className="actions" style={{marginTop:24}}><a className="btn" href="#contact">شروع مسیر قهرمانی</a><a className="btn secondary" href="#about">آشنایی با آکادمی</a></div>
        </div>
        <div className="seal"><div className="seal-inner"><div className="seal-kanji">空手道</div><small>SHOTOKAN · SHIRAZ</small><div style={{marginTop:12,fontWeight:800}}>زارع</div></div></div>
      </div></section>
      <section id="about" className="section container"><div className="split">
        <div><div className="eyebrow">道場 · DOJO</div><h2>بیشتر از یک باشگاه؛ یک مسیر رشد</h2><p className="muted">آکادمی کاراته شوتوکان زارع فضایی برای یادگیری اصولی کاراته، افزایش تمرکز، تقویت آمادگی جسمانی و حرکت مرحله‌به‌مرحله به سوی اهداف ورزشی است. آموزش با توجه به سطح و تجربه هنرجو انجام می‌شود.</p>
          <div className="statrow"><div className="stat"><strong>همه</strong><span>رده‌های سنی</span></div><div className="stat"><strong>کومیته</strong><span>کلاس اختصاصی</span></div><div className="stat"><strong>شوتوکان</strong><span>سبک آموزشی</span></div></div></div>
        <div className="feature-panel"><div className="eyebrow">DOJO VALUES</div><h3>اصول ما</h3><div className="achievement"><b>礼 · احترام</b><div className="muted">احترام به مربی، هم‌تمرینی و مسیر یادگیری</div></div><div className="achievement"><b>継続 · استمرار</b><div className="muted">پیشرفت با تمرین منظم و صبورانه</div></div><div className="achievement"><b>心 · ذهن آرام</b><div className="muted">تمرکز، کنترل و تصمیم‌گیری در شرایط دشوار</div></div></div>
      </div></section>
      <section id="coach" className="section" style={{background:"#101013"}}><div className="container split"><div className="seal" style={{maxWidth:260}}><div className="seal-inner"><div className="seal-kanji" style={{fontSize:56}}>師範</div><small>SENSEI</small></div></div><div><div className="eyebrow">THE INSTRUCTOR</div><h2>{s?.coachName || "شیهان مراد زارع"}</h2><p className="muted">مربی آکادمی کاراته شوتوکان زارع؛ همراه هنرجویان در مسیر یادگیری تکنیک، انضباط و آمادگی برای حضور در رقابت‌ها.</p><p className="muted">سوابق و مدارک رسمی مربی را می‌توان از پنل مدیریت به این بخش افزود.</p><a className="btn secondary" href={`https://www.instagram.com/${(s?.instagram || "moradza3920").replace("@","")}/`} target="_blank" rel="noreferrer">مشاهده صفحه اینستاگرام ↗</a></div></div></section>
      <section className="section container" id="achievements"><div className="section-head"><div><div className="eyebrow">RESULTS & HONORS</div><h2>افتخارات و مسیر قهرمانی</h2><p>ثبت دستاوردهای هنرجویان و آکادمی</p></div><span className="tag">استانی · کشوری · بین‌المللی</span></div>
        {achievements.length ? <div className="grid3">{achievements.map(a=><article className="card" key={a.id}><div className="iconbox">奖</div><h3>{a.athleteName}</h3><p>{a.title}</p><div className="tag">{a.competition} · {a.level} · {a.year}</div></article>)}</div> : <div className="card"><p className="muted">هنوز افتخاری ثبت نشده است. پس از ورود به پنل مدیریت، می‌توانید نتایج و مقام‌های واقعی را اضافه کنید.</p></div>}
      </section>
      <section id="students" className="section" style={{background:"#101013"}}><div className="container"><div className="section-head"><div><div className="eyebrow">OUR KARATEKA</div><h2>چهره‌های آکادمی</h2><p>معرفی هنرجویان منتخب و مسیر پیشرفت آن‌ها</p></div></div>{students.length ? <div className="grid3">{students.map(st=><div className="card" key={st.id}><div className="iconbox">人</div><h3>{st.name}</h3><p>{st.description || "هنرجوی آکادمی شوتوکان زارع"}</p><span className="tag">{st.rank || "هنرجو"}</span></div>)}</div> : <p className="muted">بخش معرفی هنرجویان پس از ثبت اطلاعات از پنل مدیریت نمایش داده می‌شود.</p>}</div></section>
      <section className="section container"><div className="section-head"><div><div className="eyebrow">DOJO JOURNAL</div><h2>از مجله کاراته</h2><p>دانش، تمرین و فرهنگ هنرهای رزمی</p></div><Link className="btn secondary" href="/articles">همه مقالات</Link></div>
        {articles.length ? <div className="grid3">{articles.map(a=><article className="card article-card" key={a.id}><div className="article-cover">空手道</div><div className="article-body"><span className="tag">مجله آکادمی</span><h3>{a.title}</h3><p>{a.excerpt}</p><Link className="btn secondary" href={`/articles/${a.slug}`}>مطالعه مقاله</Link></div></article>)}</div> : <div className="card"><p className="muted">مقاله‌ای منتشر نشده است.</p></div>}
      </section>
      <section className="section" style={{background:"#101013"}}><div className="container"><div className="section-head"><div><div className="eyebrow">MOMENTS IN THE DOJO</div><h2>گالری آکادمی</h2><p>تصاویر تمرین، رویدادها و مسابقات</p></div></div>{gallery.length ? <div className="grid3">{gallery.map(g=><div className="card" key={g.id}><img src={g.imageUrl} alt={g.title} style={{width:"100%",height:190,objectFit:"cover",borderRadius:8}}/><h3>{g.title}</h3><span className="tag">{g.category}</span></div>)}</div> : <div className="card"><p className="muted">پس از افزودن تصاویر واقعی از پنل مدیریت، گالری در این بخش نمایش داده می‌شود.</p></div>}</div></section>
      <section className="section container" id="contact"><div className="section-head"><div><div className="eyebrow">VISIT THE DOJO</div><h2>شروع مسیر شما</h2><p>برای اطلاع از کلاس‌ها و هماهنگی، با آکادمی تماس بگیرید.</p></div></div>
        <div className="contactgrid"><div className="card"><h3>اطلاعات تماس</h3><div className="achievement"><b>تلفن</b><p dir="ltr">{s?.phone || "09173113081"}</p></div><div className="achievement"><b>نشانی</b><p>{s?.address || "شیراز، بلوار نواب صفوی، کوشک میدان، کوچه ۴۷، درب سوم سمت راست"}</p></div><div className="achievement"><b>برنامه کلاس‌ها</b><p>{s?.schedule || "همه‌روزه به‌جز جمعه‌ها؛ روزهای زوج و فرد"}</p></div></div>
          <form className="card" action="/api/contact" method="post"><h3>ارسال پیام</h3><div className="field"><label>نام</label><input name="name" required maxLength={80}/></div><div className="field"><label>شماره تماس</label><input name="phone" required maxLength={30}/></div><div className="field"><label>پیام شما</label><textarea name="message" required rows={4} maxLength={2000}/></div><button type="submit">ارسال پیام</button></form>
        </div>
      </section>
    </main>
    <footer className="footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}><span>© {new Date().getFullYear()} آکادمی کاراته شوتوکان زارع</span><span>礼 · Respect · Discipline · Courage</span><Link href="/admin/login">ورود مدیریت</Link></div></footer>
  </>;
}
