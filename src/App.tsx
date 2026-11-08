import { useMemo, useState } from 'react';
import { X, ChevronLeft, ShieldCheck, Check, Plus, Minus, Trash2 } from 'lucide-react';
import './store.css';

type Product = { id: number; title: string; category: string; price: number; oldPrice?: number; tag: string; icon: string; color: string; description: string; featured?: boolean };
const products: Product[] = [
  { id: 1, title: 'باقة VIP — النخبة', category: 'باقات VIP', price: 149, oldPrice: 199, tag: 'الأكثر طلباً', icon: '♛', color: 'violet', description: 'رتبة VIP + أيدي مميز 7777 + شارة حصرية', featured: true },
  { id: 2, title: 'أيدي رباعي — 8888', category: 'أيديات مميزة', price: 89, tag: 'أيدي نادر', icon: '88', color: 'gold', description: 'أيدي رباعي متناظر، يلفت الأنظار من أول دخول', featured: true },
  { id: 3, title: 'باقة VIP — الأسطوري', category: 'باقات VIP', price: 279, oldPrice: 349, tag: 'عرض محدود', icon: '✦', color: 'blue', description: 'VIP أسطوري + أيدي 0007 + مميزات خاصة', featured: true },
  { id: 4, title: 'أيدي ثلاثي — 777', category: 'أيديات مميزة', price: 59, tag: 'الأكثر مبيعاً', icon: '777', color: 'orange', description: 'أيدي ثلاثي مميز — بسيط، نادر، وسهل الحفظ', featured: true },
  { id: 5, title: 'باقة نقاط — 2,500', category: 'نقاط وشحن', price: 35, tag: 'شحن سريع', icon: '◈', color: 'green', description: '2,500 نقطة تضاف لحسابك خلال دقائق' },
  { id: 6, title: 'أيدي ثنائي — 77', category: 'أيديات مميزة', price: 129, tag: 'نادر جداً', icon: '77', color: 'pink', description: 'أيدي ثنائي قصير — الكمية محدودة' },
  { id: 7, title: 'باقة VIP — المحترف', category: 'باقات VIP', price: 99, tag: 'قيمة ممتازة', icon: '⚡', color: 'cyan', description: 'رتبة VIP + أيدي 2020 + شارة المحترفين' },
  { id: 8, title: 'شحن نقاط — 1,000', category: 'نقاط وشحن', price: 17, tag: 'فوري', icon: '◉', color: 'green', description: '1,000 نقطة — شحن مباشر وآمن لحسابك' },
];
const categories = ['الكل', 'باقات VIP', 'أيديات مميزة', 'نقاط وشحن'];
const megaTabs = ['مميز', 'باقات VIP', 'أيديات مميزة', 'نقاط وشحن'];

function App() {
  const [category, setCategory] = useState('الكل');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('مميز');
  const [cart, setCart] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(() => products.filter(p => (category === 'الكل' || p.category === category) && p.title.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const megaItems = products.filter(p => (tab === 'مميز' ? p.featured : p.category === tab)).slice(0, 4);
  const cartProducts = cart.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const total = cartProducts.reduce((sum, p) => sum + p.price, 0);
  const addToCart = (p: Product) => { setCart(c => [...c, p.id]); setNotice(`تمت إضافة ${p.title} إلى السلة`); window.setTimeout(() => setNotice(''), 2600); };
  const removeOne = (id: number) => { const i = cart.indexOf(id); if (i >= 0) setCart(cart.filter((_, k) => k !== i)); };
  const goShop = (cat?: string) => { if (cat) setCategory(cat); setMenuOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); };

  return <div className="store" dir="rtl">
    <div className="announce">تسليم فوري على كل الطلبات · تسوق بثقة</div>
    <header className={`nav-card ${menuOpen ? 'open' : ''}`} onMouseLeave={() => setMenuOpen(false)}>
      <nav className="nav-row">
        <div className="nav-side">
          <button className={`nav-link ${menuOpen ? 'on' : ''}`} onMouseEnter={() => setMenuOpen(true)} onClick={() => setMenuOpen(o => !o)}>المتجر</button>
          <a className="nav-link hide-sm" href={import.meta.env.BASE_URL} onMouseEnter={() => setMenuOpen(false)}>الرئيسية</a>
          <a className="nav-link hide-sm" href="#vip" onMouseEnter={() => setMenuOpen(false)}>VIP</a>
          <a className="nav-link hide-sm" href="#how" onMouseEnter={() => setMenuOpen(false)}>كيف تشتري</a>
        </div>
        <a className="wordmark" href="#top" aria-label="Recoil">recoil</a>
        <div className="nav-side end">
          {searchOpen && <input className="nav-input" autoFocus value={query} onChange={e => { setQuery(e.target.value); goShop(); }} placeholder="ابحث عن منتج..." />}
          <button className="nav-link" onClick={() => { setSearchOpen(o => !o); if (searchOpen) setQuery(''); }}>{searchOpen ? 'إغلاق' : 'بحث'}</button>
          <button className="nav-link" onClick={() => setCartOpen(true)}>السلة ({cart.length})</button>
        </div>
      </nav>
      <div className="mega"><div className="mega-inner">
        <div className="mega-tabs">{megaTabs.map(t => <button key={t} className={tab === t ? 'on' : ''} onMouseEnter={() => setTab(t)} onClick={() => setTab(t)}>{t}</button>)}</div>
        <div className="mega-cards">{megaItems.map(p => <a key={p.id} className="mini-card" href="#shop" onClick={() => goShop(p.category)}><span className="pill">{p.tag}</span><div className={`mini-art art-${p.color}`}>{p.icon}</div><b>{p.title}</b><small>{p.description}</small></a>)}</div>
        <button className="pill-btn" onClick={() => goShop('الكل')}>تسوق المتجر</button>
      </div></div>
    </header>

    <main id="top">
      <section className="hero-panel"><div><h1>العبها بأسلوبك.</h1><p>أيديات نادرة، باقات VIP، وشحن فوري.</p><button className="pill-btn light" onClick={() => goShop('الكل')}>تصفح المنتجات</button></div><span className="hero-mark" aria-hidden="true">R</span></section>

      <section className="shop-section" id="shop">
        <div className="shop-head"><h2>المتجر</h2><span>{filtered.length} منتجات</span></div>
        <div className="tabs">{categories.map(c => <button key={c} className={category === c ? 'on' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="grid">{filtered.map(p => <article className="card" key={p.id}>
          <span className="pill">{p.tag}</span>
          <div className={`art art-${p.color}`}><span>{p.icon}</span></div>
          <h3>{p.title}</h3><p>{p.description}</p>
          <div className="card-foot"><span className="price">{p.price} ر.س{p.oldPrice && <del>{p.oldPrice}</del>}</span><button className="pill-btn sm" onClick={() => addToCart(p)}>أضف للسلة</button></div>
        </article>)}</div>
        {filtered.length === 0 && <div className="empty-state">ما لقينا منتجات تطابق بحثك. جرّب كلمة ثانية.</div>}
      </section>

      <section className="vip-panel" id="vip"><div><span className="kicker">RECOIL VIP CLUB</span><h2>مو مجرد لاعب. أنت من النخبة.</h2><p>رتبة مميزة وأيدي نادر ومزايا تخلي حضورك في اللعبة ما ينسى.</p><button className="pill-btn light" onClick={() => goShop('باقات VIP')}>اكتشف باقات VIP</button></div><span className="vip-mark" aria-hidden="true">VIP</span></section>

      <section className="how" id="how"><h2>كيف تشتري؟</h2><div className="steps">
        {[['01', 'اختار منتجك', 'تصفح الأيديات والباقات واختر اللي يعجبك.'], ['02', 'أضفه للسلة', 'راجع طلبك وتأكد إن كل شيء تمام.'], ['03', 'استلم فوراً', 'فريقنا يجهز طلبك ويوصلك بأسرع وقت.'], ['04', 'استمتع باللعب', 'ادخل اللعبة وخلك أنت حديث الجميع.']].map(([n, t, d]) => <div className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div></section>
    </main>

    <footer className="footer"><a className="wordmark sm" href="#top">recoil</a><span>اللعب له هيبة. خلك Recoil.</span><div className="footer-links"><a href="#shop">المتجر</a><a href="#vip">VIP</a><a href="#how">كيف تشتري</a></div><small>© 2025 RECOIL STORE</small></footer>

    {notice && <div className="toast-message"><Check size={16} />{notice}</div>}
    {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}>
      <div className="drawer-head"><h2>السلة ({cart.length})</h2><button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="إغلاق"><X size={18} /></button></div>
      {cartProducts.length ? <>
        <div className="cart-items">{cartProducts.map((p, i) => <div className="cart-item" key={`${p.id}-${i}`}><div className={`cart-thumb art-${p.color}`}>{p.icon}</div><div className="cart-info"><b>{p.title}</b><small>{p.price} ر.س</small><div className="qty"><button onClick={() => removeOne(p.id)} aria-label="حذف وحدة"><Minus size={12} /></button><span>1</span><button onClick={() => addToCart(p)} aria-label="زيادة وحدة"><Plus size={12} /></button></div></div><button className="icon-btn" onClick={() => removeOne(p.id)} aria-label="إزالة"><Trash2 size={15} /></button></div>)}</div>
        <div className="cart-total"><span>المجموع</span><b>{total} ر.س</b></div>
        <button className="pill-btn full" onClick={() => setNotice('قريباً — سيتم تفعيل الدفع الإلكتروني')}>إتمام الطلب</button>
        <p className="checkout-note"><ShieldCheck size={13} /> دفع آمن · تسليم سريع</p>
      </> : <div className="empty-cart"><b>سلتك فاضية حالياً</b><p>لقيت شيء عجبك؟ خذه معك.</p><button className="pill-btn" onClick={() => setCartOpen(false)}>تصفح المنتجات <ChevronLeft size={14} /></button></div>}
    </aside></div>}
  </div>;
}
export default App;
