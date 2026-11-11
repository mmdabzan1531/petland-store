"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const labels = ["", "خیلی بد", "بد", "معمولی", "خوب", "عالی"];
const KEY = "petland-rating";

export default function RateSite() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) { const v = JSON.parse(s); setRating(v.rating || 0); setComment(v.comment || ""); setSent(!!v.rating); }
    } catch {}
  }, []);

  function submit() {
    if (!rating) return;
    try { localStorage.setItem(KEY, JSON.stringify({ rating, comment })); } catch {}
    setSent(true);
  }

  const shown = hover || rating;
  return (
    <section className="rate-section" id="rate">
      <div className="rate-box">
        <h2>به پت‌لند امتیاز بده</h2>
        <p>نظرت درباره‌ی سایت چیه؟ امتیازت به ما کمک می‌کنه بهتر بشیم.</p>
        <div className="stars" dir="ltr" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={n <= shown ? "star on" : "star"} onMouseEnter={() => setHover(n)} onClick={() => { setRating(n); setSent(false); }} aria-label={`${n} از ۵`}>
              <Star size={34} fill={n <= shown ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <div className="rate-label">{shown ? labels[shown] : "ستاره‌ها را انتخاب کن"}</div>
        {rating > 0 && !sent && (
          <>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="نظرت را بنویس (اختیاری)..." rows={3} />
            <button className="primary rate-btn" onClick={submit}>ثبت امتیاز</button>
          </>
        )}
        {sent && <div className="rate-thanks">ممنون از امتیازت! ({new Intl.NumberFormat("fa-IR").format(rating)} از ۵)</div>}
        <small>در این نسخه‌ی نمایشی، امتیاز فقط روی همین دستگاه ذخیره می‌شود.</small>
      </div>
    </section>
  );
}
