"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, PawPrint, Menu, X, Plus, Minus, Trash2, Home, Tag, Flame, LayoutGrid } from "lucide-react";
import SideMenu from "../../components/SideMenu";
import RateSite from "../../components/RateSite";
import { CAT_IMG } from "../../components/catImage";
import productsData from "../../data/products.json";

type Product = { id: number; name: string; category: string; price: number; oldPrice: number; image: string; description: string; sales: number; discountPercent: number };
type CartItem = { product: Product; qty: number };

const products = productsData as Product[];
const ALL = "همه محصولات";
const categories = [ALL, "غذای خشک", "غذای تر", "اسباب‌بازی", "بهداشت و مراقبت", "لوازم جانبی", "جای خواب و حمل"];
const realCategories = categories.slice(1);
const HERO_IMG = CAT_IMG; // همان عکس گربه‌ی صفحه اصلی
const BEST_COUNT = 8; // چند کالای اول «پرفروش» نشان بگیرند

const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
const money = (n: number) => fa(n) + " تومان";

// مرتب‌سازی بر اساس بیشترین خرید
const bySales = [...products].sort((a, b) => b.sales - a.sales);
const bestIds = new Set(bySales.slice(0, BEST_COUNT).map((p) => p.id));

export default function Shop() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [discCat, setDiscCat] = useState(ALL);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem("petland-cart"); if (saved) setCart(JSON.parse(saved)); } catch {}
    setLoaded(true);
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) { setQuery(q); setTimeout(() => document.getElementById("all")?.scrollIntoView({ behavior: "smooth" }), 150); }
    if (window.location.hash === "#cart") setCartOpen(true);
  }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem("petland-cart", JSON.stringify(cart)); } catch {} } }, [cart, loaded]);

  // همه کالاها: پرفروش‌ترین اول
  const filtered = useMemo(
    () => bySales.filter((p) => (category === ALL || p.category === category) && p.name.includes(query.trim())),
    [category, query]
  );

  // تخفیف‌ها دسته‌بندی‌شده
  const allDiscounts = useMemo(() => products.filter((p) => p.discountPercent > 0).sort((a, b) => b.discountPercent - a.discountPercent), []);
  const discCats = realCategories.filter((c) => allDiscounts.some((p) => p.category === c));
  const discounts = discCat === ALL ? allDiscounts : allDiscounts.filter((p) => p.category === discCat);

  const catTiles = useMemo(
    () => realCategories.map((c) => {
      const list = bySales.filter((p) => p.category === c);
      return { name: c, count: list.length, image: list[0]?.image, discounts: list.filter((p) => p.discountPercent > 0).length };
    }),
    []
  );

  const count = cart.reduce((s, x) => s + x.qty, 0);
  const total = cart.reduce((s, x) => s + x.qty * x.product.price, 0);
  function add(p: Product) { setCart((old) => { const f = old.find((x) => x.product.id === p.id); return f ? old.map((x) => (x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x)) : [...old, { product: p, qty: 1 }]; }); }
  function change(id: number, d: number) { setCart((old) => old.map((x) => (x.product.id === id ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0)); }
  function pickCategory(c: string) { setCategory(c); setQuery(""); document.getElementById("all")?.scrollIntoView({ behavior: "smooth" }); }

  function productCard(p: Product) {
    return (
      <article className="product-card" key={p.id}>
        <div className="product-image">
          <img src={p.image} alt={p.name} />
          {p.discountPercent > 0 && <span className="badge discount-badge">{fa(p.discountPercent)}٪ تخفیف</span>}
          {bestIds.has(p.id) && <span className="badge best-badge"><Flame size={11} /> پرفروش</span>}
        </div>
        <div className="product-info">
          <span className="product-category">{p.category}</span>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <span className="sold">{fa(p.sales)} خرید</span>
          <div className="prices">{p.discountPercent > 0 && <del>{money(p.oldPrice)}</del>}<strong>{money(p.price)}</strong></div>
          <button className="add-btn" onClick={() => add(p)}><Plus size={17} /> افزودن به سبد</button>
        </div>
      </article>
    );
  }

  return (
    <main className="shop-page">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onOpenCart={() => setCartOpen(true)} cartCount={count} />

      <header className="site-header shop-header">
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو"><Menu /></button>
        <Link className="brand" href="/"><span className="brand-icon"><PawPrint /></span><span>پت‌لند<small>دنیای دوست‌داشتنی‌ها</small></span></Link>
        <button className="cart-header" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /> سبد خرید <b>{fa(count)}</b></button>
      </header>

      {/* عکس مستطیلی گربه */}
      <section className="shop-hero">
        <img src={HERO_IMG} alt="گربه" />
        <div className="shop-hero-overlay">
          <Link href="/" className="back-home light"><Home size={15} /> صفحه اصلی</Link>
          <h1>فروشگاه پت‌لند</h1>
          <p>همه کالاها دسته‌بندی شده؛ تخفیف‌ها و پرفروش‌ها را اول ببین.</p>
          <div className="hero-jumps">
            <a href="#discounts"><Tag size={14} /> تخفیف‌های ویژه</a>
            <a href="#categories"><LayoutGrid size={14} /> دسته‌بندی‌ها</a>
            <a href="#all"><Flame size={14} /> همه کالاها</a>
          </div>
        </div>
      </section>

      <section className="shop-content">
        {/* تخفیف‌های ویژه — دسته‌بندی‌شده */}
        <section className="feature-section discount-section" id="discounts">
          <div className="section-heading"><div><span className="eyebrow">فرصت‌های محدود</span><h2><Tag size={21} /> تخفیف‌های ویژه</h2><p>بر اساس دسته‌بندی ببین</p></div></div>
          <div className="category-row">
            <button className={discCat === ALL ? "cat active" : "cat"} onClick={() => setDiscCat(ALL)}>همه تخفیف‌ها ({fa(allDiscounts.length)})</button>
            {discCats.map((c) => (
              <button key={c} className={discCat === c ? "cat active" : "cat"} onClick={() => setDiscCat(c)}>{c} ({fa(allDiscounts.filter((p) => p.category === c).length)})</button>
            ))}
          </div>
          <div className="product-grid feature-grid">{discounts.map(productCard)}</div>
        </section>

        {/* دسته‌بندی کل کالاها */}
        <section className="feature-section" id="categories">
          <div className="section-heading"><div><span className="eyebrow">دسته‌بندی</span><h2><LayoutGrid size={21} /> دسته‌بندی کالاها</h2><p>یک دسته را انتخاب کن تا کالاهایش را ببینی</p></div></div>
          <div className="cat-tiles">
            {catTiles.map((t) => (
              <button className="cat-tile" key={t.name} onClick={() => pickCategory(t.name)}>
                <img src={t.image} alt="" />
                <span className="cat-tile-shade" />
                <span className="cat-tile-text"><b>{t.name}</b><small>{fa(t.count)} کالا{t.discounts > 0 && ` · ${fa(t.discounts)} تخفیف‌دار`}</small></span>
              </button>
            ))}
          </div>
        </section>

        {/* همه کالاها — پرفروش‌ها اول */}
        <section id="all" className="all-section">
          <div className="section-heading"><div><span className="eyebrow">پرفروش‌ها اول</span><h2><Flame size={21} /> همه کالاها</h2><p>مرتب‌شده بر اساس بیشترین خرید</p></div></div>
          <div className="shop-tools"><div className="shop-search"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="نام محصول را جستجو کن..." />{query && <button onClick={() => setQuery("")}><X size={16} /></button>}</div><span>{fa(filtered.length)} محصول</span></div>
          <div className="category-row">{categories.map((c) => <button key={c} className={category === c ? "cat active" : "cat"} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <div className="product-grid">{filtered.map(productCard)}</div>
          {filtered.length === 0 && <div className="empty">محصولی با این مشخصات پیدا نشد.</div>}
        </section>
      </section>

      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head"><h2>سبد خرید ({fa(count)})</h2><button className="icon-btn" onClick={() => setCartOpen(false)}><X /></button></div>
            {cart.length === 0 ? (
              <div className="empty-cart"><ShoppingBag size={40} /><b>سبدت هنوز خالیه</b><p>محصولی به سبد خرید اضافه کن.</p></div>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.product.id}>
                      <img src={item.product.image} alt="" />
                      <div className="cart-detail"><b>{item.product.name}</b><strong>{money(item.product.price)}</strong>
                        <div className="qty"><button onClick={() => change(item.product.id, -1)}><Minus size={14} /></button><span>{fa(item.qty)}</span><button onClick={() => change(item.product.id, 1)}><Plus size={14} /></button></div>
                      </div>
                      <button className="remove" onClick={() => setCart((old) => old.filter((x) => x.product.id !== item.product.id))}><Trash2 size={17} /></button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <div><span>جمع کل</span><b>{money(total)}</b></div>
                  <button className="primary full" onClick={() => alert("این نسخه نمایشی است و درگاه پرداخت هنوز متصل نشده است.")}>ادامه و پرداخت</button>
                  <small>پرداخت در نسخه نمایشی فعال نیست.</small>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <RateSite />

      <footer className="shop-footer"><Link href="/">بازگشت به صفحه اصلی</Link><span>© ۱۴۰۵ پت‌لند</span></footer>
    </main>
  );
}
