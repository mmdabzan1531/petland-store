"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, PawPrint, Menu, X, Plus, Minus, Trash2, Home, TrendingUp, Tag } from "lucide-react";
import productsData from "../../data/products.json";

type Product={id:number;name:string;category:string;price:number;oldPrice:number;image:string;description:string;sales:number;discountPercent:number};
type CartItem={product:Product;qty:number};
const products=productsData as Product[];
const categories=["همه محصولات","غذای خشک","غذای تر","اسباب‌بازی","بهداشت و مراقبت","لوازم جانبی","جای خواب و حمل"];
const money=(n:number)=>new Intl.NumberFormat("fa-IR").format(n)+" تومان";

export default function Shop(){
 const [query,setQuery]=useState(""); const [category,setCategory]=useState("همه محصولات");
 const [cart,setCart]=useState<CartItem[]>([]); const [cartOpen,setCartOpen]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem("petland-cart");if(saved)setCart(JSON.parse(saved));}catch{}},[]);
 useEffect(()=>{localStorage.setItem("petland-cart",JSON.stringify(cart));},[cart]);
 const filtered=useMemo(()=>products.filter(p=>(category==="همه محصولات"||p.category===category)&&p.name.includes(query.trim())),[category,query]);
 const bestSellers=useMemo(()=>[...products].sort((a,b)=>b.sales-a.sales).slice(0,4),[]);
 const discounts=useMemo(()=>products.filter(p=>p.discountPercent>0).sort((a,b)=>b.discountPercent-a.discountPercent),[]);
 const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.qty*x.product.price,0);
 function add(p:Product){setCart(old=>{const f=old.find(x=>x.product.id===p.id);return f?old.map(x=>x.product.id===p.id?{...x,qty:x.qty+1}:x):[...old,{product:p,qty:1}]});}
 function change(id:number,d:number){setCart(old=>old.map(x=>x.product.id===id?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0));}
 function productCard(p:Product){return <article className="product-card" key={p.id}><div className="product-image"><img src={p.image} alt={p.name}/>{p.discountPercent>0&&<span className="badge discount-badge">{p.discountPercent}٪ تخفیف</span>}</div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><div className="prices">{p.discountPercent>0&&<del>{money(p.oldPrice)}</del>}<strong>{money(p.price)}</strong></div><button className="add-btn" onClick={()=>add(p)}><Plus size={17}/> افزودن به سبد</button></div></article>}
 return <main className="shop-page">
  <header className="site-header shop-header">
   <button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="منو">{menuOpen?<X/>:<Menu/>}</button>
   <Link className="brand" href="/"><span className="brand-icon"><PawPrint/></span><span>پت‌لند<small>فروشگاه محصولات حیوانات</small></span></Link>
   <button className="cart-header" onClick={()=>setCartOpen(true)}><ShoppingBag size={18}/> سبد خرید <b>{count}</b></button>
   {menuOpen&&<nav className="menu-panel"><Link href="/">صفحه اصلی</Link><Link href="/shop">خرید محصولات</Link><Link href="/#about">درباره پت‌شاپ</Link></nav>}
  </header>
  <div className="shop-intro"><Link href="/" className="back-home"><Home size={15}/> صفحه اصلی</Link><span className="eyebrow">فروشگاه پت‌لند</span><h1>همه محصولات</h1><p>هر چیزی که دوست کوچولوت لازم داره، همین‌جاست.</p></div>
  <section className="shop-content">
   {!query&&category==="همه محصولات"&&<>
    <section className="feature-section"><div className="section-heading"><div><span className="eyebrow">محبوب‌های پت‌لند</span><h2><TrendingUp size={21}/> پرفروش‌ترین کالاها</h2><p>بر اساس تعداد فروش ثبت‌شده در فروشگاه نمایشی</p></div></div><div className="product-grid feature-grid">{bestSellers.map(productCard)}</div></section>
    <section className="feature-section discount-section"><div className="section-heading"><div><span className="eyebrow">فرصت‌های محدود</span><h2><Tag size={21}/> تخفیف‌های ویژه</h2><p>محصولات منتخب با قیمت تخفیف‌خورده</p></div></div><div className="product-grid feature-grid">{discounts.map(productCard)}</div></section>
   </>}
   <div className="shop-tools"><div className="shop-search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="نام محصول را جستجو کن..."/>{query&&<button onClick={()=>setQuery("")}><X size={16}/></button>}</div><span>{filtered.length} محصول</span></div>
   <div className="category-row">{categories.map(c=><button key={c} className={category===c?"cat active":"cat"} onClick={()=>setCategory(c)}>{c}</button>)}</div>
   <div className="product-grid">{filtered.map(productCard)}</div>
   {filtered.length===0&&<div className="empty">محصولی با این مشخصات پیدا نشد.</div>}
  </section>
  {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h2>سبد خرید ({count})</h2><button className="icon-btn" onClick={()=>setCartOpen(false)}><X/></button></div>
   {cart.length===0?<div className="empty-cart"><ShoppingBag size={40}/><b>سبدت هنوز خالیه</b><p>محصولی به سبد خرید اضافه کن.</p></div>:<><div className="cart-list">{cart.map(item=><div className="cart-item" key={item.product.id}><img src={item.product.image} alt=""/><div className="cart-detail"><b>{item.product.name}</b><strong>{money(item.product.price)}</strong><div className="qty"><button onClick={()=>change(item.product.id,-1)}><Minus size={14}/></button><span>{item.qty}</span><button onClick={()=>change(item.product.id,1)}><Plus size={14}/></button></div></div><button className="remove" onClick={()=>setCart(old=>old.filter(x=>x.product.id!==item.product.id))}><Trash2 size={17}/></button></div>)}</div><div className="cart-total"><div><span>جمع کل</span><b>{money(total)}</b></div><button className="primary full" onClick={()=>alert("این نسخه نمایشی است و درگاه پرداخت هنوز متصل نشده است.")}>ادامه و پرداخت</button><small>پرداخت در نسخه نمایشی فعال نیست.</small></div></>}
  </aside></div>}
  <footer className="shop-footer"><Link href="/">بازگشت به صفحه اصلی</Link><span>© ۱۴۰۵ پت‌لند</span></footer>
 </main>;
}
