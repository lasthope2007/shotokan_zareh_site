import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const titles: Record<string,string> = {
  articles:"مدیریت مقالات", achievements:"مدیریت افتخارات", students:"مدیریت هنرجویان",
  messages:"پیام‌های دریافتی", settings:"تنظیمات سایت", gallery:"گالری تصاویر"
};

function DeleteForm({ type, id }: { type:string; id:string }) {
  return <form action="/api/admin/content" method="post" style={{display:"inline"}}>
    <input type="hidden" name="type" value={type}/><input type="hidden" name="id" value={id}/><input type="hidden" name="action" value="delete"/>
    <button className="danger" type="submit" style={{padding:"7px 10px"}}>حذف</button>
  </form>;
}
function TextField({ name, label, required=true, defaultValue="", type="text" }: {name:string;label:string;required?:boolean;defaultValue?:string|number;type?:string}) {
  return <div className="field"><label>{label}</label><input name={name} type={type} defaultValue={defaultValue} required={required}/></div>;
}
function TextArea({ name,label,defaultValue="",required=true }: {name:string;label:string;defaultValue?:string;required?:boolean}) {
  return <div className="field"><label>{label}</label><textarea name={name} defaultValue={defaultValue} required={required} rows={4}/></div>;
}

export default async function AdminSection({ params, searchParams }: { params: { section: string }; searchParams: { saved?:string; error?:string } }) {
  await requireAdmin();
  const section = params.section;
  if (!titles[section]) return <main className="container section"><h1>صفحه پیدا نشد</h1><Link href="/admin">بازگشت به پنل</Link></main>;

  const [articles, honors, students, messages, settings, gallery] = await Promise.all([
    section === "articles" ? prisma.article.findMany({orderBy:{createdAt:"desc"}}) : Promise.resolve([]),
    section === "achievements" ? prisma.achievement.findMany({orderBy:{year:"desc"}}) : Promise.resolve([]),
    section === "students" ? prisma.student.findMany({orderBy:{createdAt:"desc"}}) : Promise.resolve([]),
    section === "messages" ? prisma.contactMessage.findMany({orderBy:{createdAt:"desc"}}) : Promise.resolve([]),
    section === "settings" ? prisma.siteSettings.findUnique({where:{id:"main"}}) : Promise.resolve(null),
    section === "gallery" ? prisma.galleryItem.findMany({orderBy:{createdAt:"desc"}}) : Promise.resolve([])
  ]);

  return <div className="admin-shell"><aside className="sidebar"><Link className="brand" href="/admin"><span className="brand-mark">道</span><span>پنل آکادمی</span></Link><nav style={{marginTop:28}}>{Object.entries(titles).map(([key,title])=><Link key={key} href={`/admin/${key}`}>{title}</Link>)}<Link href="/">مشاهده سایت</Link></nav><form action="/api/admin/logout" method="post"><button className="btn secondary" style={{width:"100%",marginTop:25}}>خروج</button></form></aside>
  <main className="admin-main"><div className="admin-top"><div><div className="eyebrow">CONTENT MANAGEMENT</div><h1>{titles[section]}</h1></div><Link className="btn secondary" href="/admin">داشبورد</Link></div>
  {searchParams.saved && <div className="notice success">عملیات با موفقیت انجام شد.</div>}
  {searchParams.error && <div className="notice">خطا: {searchParams.error}</div>}

  {section === "articles" && <>
    <form className="card" action="/api/admin/content" method="post"><h3>افزودن مقاله</h3><input type="hidden" name="type" value="article"/>
      <TextField name="title" label="عنوان مقاله"/><TextField name="slug" label="اسلاگ انگلیسی (مثل shotokan-basics)"/><TextField name="coverImage" label="نشانی تصویر جلد" required={false}/>
      <TextArea name="excerpt" label="خلاصه"/><TextArea name="content" label="متن مقاله"/><label style={{display:"flex",gap:10,alignItems:"center",margin:"12px 0"}}><input type="checkbox" name="published"/> انتشار در سایت</label><button>ذخیره مقاله</button></form>
    <h3>مقالات ثبت‌شده</h3><div className="tablewrap"><table className="table"><thead><tr><th>عنوان</th><th>اسلاگ</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{articles.map(a=><tr key={a.id}><td>{a.title}</td><td>{a.slug}</td><td>{a.published?"منتشرشده":"پیش‌نویس"}</td><td><DeleteForm type="article" id={a.id}/></td></tr>)}</tbody></table></div>
  </>}

  {section === "achievements" && <>
    <form className="card" action="/api/admin/content" method="post"><h3>ثبت افتخار جدید</h3><input type="hidden" name="type" value="achievement"/>
      <TextField name="athleteName" label="نام ورزشکار"/><TextField name="title" label="عنوان مقام"/><TextField name="competition" label="نام مسابقه"/><div className="field"><label>سطح مسابقه</label><select name="level" required><option value="استانی">استانی</option><option value="کشوری">کشوری</option><option value="بین‌المللی">بین‌المللی</option></select></div><TextField name="year" label="سال" type="number" defaultValue={new Date().getFullYear()}/><TextField name="imageUrl" label="نشانی تصویر" required={false}/><label style={{display:"flex",gap:10,alignItems:"center",margin:"12px 0"}}><input type="checkbox" name="featured"/> نمایش ویژه</label><button>ثبت افتخار</button></form>
    <h3>افتخارات ثبت‌شده</h3><div className="tablewrap"><table className="table"><thead><tr><th>ورزشکار</th><th>مقام</th><th>مسابقه</th><th>سال</th><th>عملیات</th></tr></thead><tbody>{honors.map(a=><tr key={a.id}><td>{a.athleteName}</td><td>{a.title}</td><td>{a.competition}</td><td>{a.year}</td><td><DeleteForm type="achievement" id={a.id}/></td></tr>)}</tbody></table></div>
  </>}

  {section === "students" && <>
    <form className="card" action="/api/admin/content" method="post"><h3>افزودن هنرجو</h3><input type="hidden" name="type" value="student"/><TextField name="name" label="نام هنرجو"/><TextField name="rank" label="درجه / کمربند" required={false}/><TextField name="imageUrl" label="نشانی تصویر" required={false}/><TextArea name="description" label="توضیحات" required={false}/><label style={{display:"flex",gap:10,alignItems:"center",margin:"12px 0"}}><input type="checkbox" name="featured"/> نمایش در صفحه اصلی</label><button>ثبت هنرجو</button></form>
    <h3>هنرجویان ثبت‌شده</h3><div className="tablewrap"><table className="table"><thead><tr><th>نام</th><th>درجه</th><th>ویژه</th><th>عملیات</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.rank || "—"}</td><td>{s.featured?"بله":"خیر"}</td><td><DeleteForm type="student" id={s.id}/></td></tr>)}</tbody></table></div>
  </>}

  {section === "gallery" && <>
    <form className="card" action="/api/admin/content" method="post"><h3>افزودن تصویر به گالری</h3><input type="hidden" name="type" value="gallery"/><TextField name="title" label="عنوان تصویر"/><TextField name="imageUrl" label="نشانی مستقیم تصویر" type="url"/><TextField name="category" label="دسته‌بندی" defaultValue="تمرین"/><button>افزودن تصویر</button><p className="muted">فعلاً نشانی مستقیم تصویر ذخیره می‌شود؛ بارگذاری فایل از دستگاه در مرحله بعد به فضای ذخیره‌سازی متصل می‌شود.</p></form>
    <div className="tablewrap"><table className="table"><thead><tr><th>عنوان</th><th>دسته‌بندی</th><th>عملیات</th></tr></thead><tbody>{gallery.map(g=><tr key={g.id}><td>{g.title}</td><td>{g.category}</td><td><DeleteForm type="gallery" id={g.id}/></td></tr>)}</tbody></table></div>
  </>}

  {section === "messages" && <>
    <div className="tablewrap"><table className="table"><thead><tr><th>تاریخ</th><th>نام</th><th>تلفن</th><th>پیام</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{messages.map(m=><tr key={m.id}><td>{m.createdAt.toLocaleDateString("fa-IR")}</td><td>{m.name}</td><td>{m.phone}</td><td>{m.message}</td><td>{m.read?"خوانده‌شده":"جدید"}</td><td><div className="actions">{!m.read && <form action="/api/admin/content" method="post"><input type="hidden" name="type" value="message"/><input type="hidden" name="id" value={m.id}/><input type="hidden" name="action" value="read"/><button className="btn secondary">خوانده شد</button></form>}<DeleteForm type="message" id={m.id}/></div></td></tr>)}</tbody></table></div>
    {!messages.length && <p className="muted">هنوز پیامی دریافت نشده است.</p>}
  </>}

  {section === "settings" && <form className="card" action="/api/admin/content" method="post"><h3>اطلاعات عمومی سایت</h3><input type="hidden" name="type" value="settings"/>
    <TextField name="academyName" label="نام آکادمی" defaultValue={settings?.academyName || "آکادمی کاراته شوتوکان زارع"}/><TextField name="coachName" label="نام مربی" defaultValue={settings?.coachName || "شیهان مراد زارع"}/><TextField name="phone" label="شماره تماس" defaultValue={settings?.phone || "09173113081"}/><TextField name="address" label="نشانی" defaultValue={settings?.address || "شیراز، بلوار نواب صفوی، کوشک میدان، کوچه ۴۷، درب سوم سمت راست"}/><TextField name="instagram" label="نام کاربری اینستاگرام" defaultValue={settings?.instagram || "moradza3920"}/><TextField name="schedule" label="برنامه کلاس‌ها" defaultValue={settings?.schedule || "همه‌روزه به‌جز جمعه‌ها؛ کلاس‌ها در روزهای زوج و فرد"}/><TextArea name="intro" label="متن معرفی صفحه اصلی" defaultValue={settings?.intro || "پرورش مهارت، انضباط و روحیه قهرمانی در مسیر کاراته شوتوکان."}/><button>ذخیره تنظیمات</button></form>}
  </main></div>;
}
