export default function AdminLogin({ searchParams }: { searchParams: { error?: string } }) {
  return <main className="loginbox"><div className="eyebrow">SHOTOKAN · ADMIN</div><h1>ورود مدیریت</h1><p className="muted">برای مدیریت محتوای آکادمی وارد شوید.</p>
    {searchParams.error && <div className="notice">ایمیل یا رمز عبور صحیح نیست.</div>}
    <form action="/api/admin/login" method="post"><div className="field"><label>ایمیل مدیر</label><input name="email" type="email" required autoComplete="username"/></div><div className="field"><label>رمز عبور</label><input name="password" type="password" required autoComplete="current-password"/></div><button type="submit" style={{width:"100%"}}>ورود امن</button></form>
    <p className="muted" style={{fontSize:12,marginTop:20}}>حساب مدیر پس از تنظیم متغیرهای محیطی و اجرای seed ساخته می‌شود.</p>
  </main>;
}
