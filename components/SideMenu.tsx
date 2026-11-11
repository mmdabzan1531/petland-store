"use client";
import Link from "next/link";
import { useEffect } from "react";
import { X, Home, Store, Flame, Tag, LayoutGrid, Package, Info, Phone, ShoppingBag, PawPrint, ChevronLeft } from "lucide-react";

type Props = { open: boolean; onClose: () => void; onOpenCart?: () => void; cartCount?: number };

const items = [
  { href: "/", label: "صفحه اصلی", icon: Home },
  { href: "/shop", label: "فروشگاه", icon: Store },
  { href: "/shop#discounts", label: "تخفیف‌های ویژه", icon: Tag },
  { href: "/shop#categories", label: "دسته‌بندی کالاها", icon: LayoutGrid },
  { href: "/shop#all", label: "همه کالاها (پرفروش‌ها اول)", icon: Flame },
  { href: "/shop#everything", label: "کل محصولات (همه با هم)", icon: Package },
  { href: "/#about", label: "درباره پت‌لند", icon: Info },
  { href: "/#contact", label: "ارتباط با ما", icon: Phone },
];

export default function SideMenu({ open, onClose, onOpenCart, cartCount = 0 }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) { window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  return (
    <div className={open ? "side-overlay show" : "side-overlay"} onClick={onClose} aria-hidden={!open}>
      <aside className="side-menu" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="منو">
        <div className="side-head">
          <span className="side-brand"><PawPrint size={20} /> پت‌لند</span>
          <button className="icon-btn" onClick={onClose} aria-label="بستن منو"><X /></button>
        </div>
        <nav className="side-links">
          {items.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onClose}>
              <Icon size={18} /> <span>{label}</span> <ChevronLeft size={15} className="chev" />
            </Link>
          ))}
          {onOpenCart ? (
            <button onClick={() => { onClose(); onOpenCart(); }}>
              <ShoppingBag size={18} /> <span>سبد خرید</span>{cartCount > 0 && <b className="side-count">{cartCount}</b>}
            </button>
          ) : (
            <Link href="/shop#cart" onClick={onClose}><ShoppingBag size={18} /> <span>سبد خرید</span><ChevronLeft size={15} className="chev" /></Link>
          )}
        </nav>
        <div className="side-foot">پت‌لند · فروشگاه آنلاین حیوانات خانگی</div>
      </aside>
    </div>
  );
}
