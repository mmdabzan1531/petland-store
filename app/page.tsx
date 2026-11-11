"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, PawPrint, ShoppingBag, User, Search, ChevronLeft, ArrowLeft, Truck, ShieldCheck, Headphones, Heart, Sparkles, ShoppingCart, PackageCheck } from "lucide-react";
import SideMenu from "../components/SideMenu";
import RateSite from "../components/RateSite";
import { CAT_IMG } from "../components/catImage";
import productsData from "../data/products.json";

const HERO_IMG = CAT_IMG; // عکس گربه — برای عوض کردن، components/catImage.ts را عوض کن یا اینجا لینک عکس بگذار
const ABOUT_IMG = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1000";
// اطلاعات تماس را اینجا پر کن؛ خالی‌ها نمایش داده نمی‌شوند
const CONTACT = { phone: "", email: "", instagram: "" };

const productCount = productsData.length;
const categoryCount = new Set((productsData as { category: string }[]).map((p) => p.category)).size;
const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

const trust = [
  { icon: Truck, title: "ارسال سریع", text: "بسته‌بندی ایمن و ارسال به‌موقع" },
  { icon: ShieldCheck, title: "ضمانت کیفیت", text: "کالاهای انتخاب‌شده و مطمئن" },
  { icon: Headphones, title: "پشتیبانی دوستانه", text: "کنار تو برای هر سؤال" },
];
const values = [
  { icon: Heart, title: "با عشق انتخاب شده", text: "هر کالا با توجه به نیاز واقعی حیوان خانگی و کیفیت ساخت انتخاب می‌شود." },
  { icon: Truck, title: "ارسال سریع", text: "سفارش‌ها با بسته‌بندی ایمن و در کوتاه‌ترین زمان آماده ارسال می‌شوند." },
  { icon: ShieldCheck, title: "خرید مطمئن", text: "کیفیت کالاها قبل از عرضه بررسی می‌شود تا با خیال راحت خرید کنی." },
  { icon: Sparkles, title: "تخفیف‌های ویژه", text: "همیشه بخشی از کالاها با قیمت ویژه عرضه می‌شود." },
];
const steps = [
  { icon: Search, title: "انتخاب", text: "در فروشگاه بین دسته‌بندی‌ها بگرد یا جستجو کن." },
  { icon: ShoppingCart, title: "افزودن به سبد", text: "کالاهای مورد نظرت را به سبد خرید اضافه کن." },
  { icon: PackageCheck, title: "دریافت", text: "سفارشت را ثبت کن و منتظر رسیدن بسته باش." },
];

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("petland-cart");
      if (saved) setCartCount((JSON.parse(saved) as { qty: number }[]).reduce((s, x) => s + x.qty, 0));
    } catch {}
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    router.push(t ? `/shop?q=${encodeURIComponent(t)}` : "/shop");
  }

  const hasContact = CONTACT.phone || CONTACT.email || CONTACT.instagram;

  return (
    <main className="lp-home">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} cartCount={cartCount} />

      <header className="lp-header">
        <div className="lp-top">
          <button className="lp-menu" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو"><Menu size={22} /></button>
          <Link className="lp-brand" href="/">
            <span className="lp-brand-icon"><PawPrint size={22} /></span>
            <span><b>پت‌لند</b><small>دنیای دوست‌داشتنی‌ها</small></span>
          </Link>
          <form className="lp-search" onSubmit={submit}>
            <Search size={20} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو بین محصولات..." />
          </form>
          <div className="lp-actions">
            <button className="lp-icon-btn" aria-label="حساب کاربری"><User size={20} /></button>
            <Link className="lp-cart" href="/shop#cart" aria-label="سبد خرید"><ShoppingBag size={18} /><b>{fa(cartCount)}</b></Link>
          </div>
        </div>
        <nav className="lp-nav">
          <div className="lp-nav-in">
            <Link href="/shop">محصولات</Link>
            <a href="#about">درباره ما</a>
            <a href="#contact">ارتباط با ما</a>
          </div>
        </nav>
      </header>

      {/* بالای صفحه: کارت عکس مستطیلی (ثابت) */}
      <section className="lp-hero">
        <div className="lp-card">
          <div className="lp-card-img">
            <img src={HERO_IMG} alt="گربه" />
            <span className="lp-caption"><PawPrint size={18} /> دوست خوب، زندگی قشنگ</span>
          </div>
          <div className="lp-card-body">
            <span className="lp-kicker">برای دوست‌های پشمالوی شما</span>
            <h1>مراقبت از آن‌ها<br />با عشق شروع می‌شود</h1>
            <p>غذای خشک، تشویقی و لوازم موردنیاز حیوانات خانگی؛ با انتخابی مطمئن و قیمتی دوست‌داشتنی.</p>
            <Link className="lp-cta" href="/shop">خرید محصولات <ChevronLeft size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="lp-trust">
        <div className="lp-trust-in">
          {trust.map(({ icon: Icon, title, text }) => (
            <div className="lp-trust-item" key={title}><Icon size={24} /><b>{title}</b><small>{text}</small></div>
          ))}
        </div>
      </section>

      {/* پایین‌تر: فقط درباره سایت */}
      <section className="about-home" id="about">
        <div className="about-image"><img src={ABOUT_IMG} alt="درباره پت‌لند" /></div>
        <div className="about-text">
          <span className="eyebrow">درباره ما</span>
          <h2>پت‌لند؛ خونه‌ی همه چیزهایی که حیوان خانگی‌ات دوست داره</h2>
          <p>پت‌لند یک فروشگاه آنلاین برای صاحبان حیوانات خانگی است. هدف ما ساده است: پیدا کردن بهترین کالا برای دوست چهارپات، بدون این‌که لازم باشد بین ده‌ها فروشگاه بگردی.</p>
          <p>در حال حاضر {fa(productCount)} محصول در {fa(categoryCount)} دسته‌بندی در فروشگاه موجود است و پرفروش‌ترین کالاها و تخفیف‌های ویژه همیشه در دسترس هستند.</p>
          <p className="demo-label">قیمت‌ها و تعداد فروش در این نسخه نمایشی و فرضی هستند.</p>
          <Link className="text-link" href="/shop">رفتن به فروشگاه <ArrowLeft size={14} /></Link>
        </div>
      </section>

      <section className="about-block alt">
        <div className="about-wrap">
          <div className="about-title"><span className="eyebrow">چرا پت‌لند؟</span><h2>ارزش‌هایی که برایمان مهم است</h2></div>
          <div className="value-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <div className="value-card" key={title}><span className="value-icon"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-block">
        <div className="about-wrap">
          <div className="about-title"><span className="eyebrow">روش کار</span><h2>خرید از پت‌لند چطوریه؟</h2></div>
          <div className="steps">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div className="step" key={title}><span className="step-num">{fa(i + 1)}</span><Icon size={24} /><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-block alt" id="contact">
        <div className="about-wrap">
          <div className="about-title"><span className="eyebrow">ارتباط با ما</span><h2>هر سؤالی داشتی، بپرس</h2></div>
          <div className="contact-box">
            {hasContact ? (
              <>
                {CONTACT.phone && <div>تلفن: <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></div>}
                {CONTACT.email && <div>ایمیل: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>}
                {CONTACT.instagram && <div>اینستاگرام: <a href={`https://instagram.com/${CONTACT.instagram}`}>{CONTACT.instagram}</a></div>}
              </>
            ) : (
              <div>راه‌های ارتباطی به‌زودی اضافه می‌شود.</div>
            )}
          </div>
        </div>
      </section>

      <RateSite />

      <footer className="site-footer">
        <span className="footer-brand"><PawPrint size={18} /> پت‌لند</span>
        <Link href="/shop">رفتن به فروشگاه</Link>
        <small>© ۱۴۰۵ پت‌لند · نسخه نمایشی</small>
      </footer>
    </main>
  );
}
