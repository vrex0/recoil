import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { X, ChevronLeft, ShieldCheck, Check, Plus, Minus, Trash2 } from 'lucide-react';
import './store.css';

type Currency = 'USD' | 'SAR';
type Product = { id: number; title: string; category: string; price: number; currency: Currency; tag: string; icon: string; color: string; description: string; featured?: boolean; best?: boolean };

const COINS = 'العملات';
const IDS = 'الأيديات';
const VIP = 'VIP';

const coinOffer = (id: number, amount: number, price: number, icon: string, best = false): Product => ({
  id, title: `${amount.toLocaleString('en-US')} coin`, category: COINS, price, currency: 'USD', tag: 'coin', icon, color: 'coin',
  description: `${amount.toLocaleString('en-US')} coin تضاف لحسابك`, best, featured: best,
});

const products: Product[] = [
  coinOffer(101, 500, 5, '500'),
  coinOffer(102, 1000, 10, '1K'),
  coinOffer(103, 1500, 15, '1.5K'),
  coinOffer(104, 2000, 20, '2K'),
  coinOffer(105, 2500, 25, '2.5K'),
  coinOffer(106, 3000, 30, '3K'),
  coinOffer(107, 4000, 40, '4K'),
  coinOffer(108, 5000, 50, '5K'),
  coinOffer(109, 10000, 70, '10K', true),
  { id: 1, title: 'أيدي مميز', category: IDS, price: 15, currency: 'USD', tag: 'قبايل', icon: 'ID', color: 'gold', description: 'أيدي مميز من نوع قبايل', featured: true },
  { id: 2, title: 'أيدي ثلاثي', category: IDS, price: 10, currency: 'USD', tag: 'بدون قبايل', icon: 'XXX', color: 'orange', description: 'أيدي ثلاثي بدون قبايل' },
  { id: 3, title: 'أيدي ثنائي', category: IDS, price: 25, currency: 'USD', tag: 'بدون قبايل', icon: 'XX', color: 'blue', description: 'أيدي ثنائي بدون قبايل', featured: true },
  { id: 4, title: 'VIP — النخبة', category: VIP, price: 150, currency: 'SAR', tag: 'VIP', icon: '♛', color: 'violet', description: 'رتبة فالدس + أيدي ثلاثي من اختيارك (مو قبايل) + سلاح بريكويل', featured: true },
];
const categories = ['الكل', COINS, IDS, VIP];
const megaTabs = ['مميز', COINS, IDS, VIP];

const money = (p: { price: number; currency: Currency }) => (p.currency === 'USD' ? `$${p.price}` : `${p.price} ريال`);

const SPARKS = [
  { left: '18%', bottom: '24%', delay: '0s', dur: '3.6s' }, { left: '30%', bottom: '14%', delay: '1.1s', dur: '4.2s' },
  { left: '44%', bottom: '8%', delay: '2.2s', dur: '3.8s' }, { left: '58%', bottom: '12%', delay: '.6s', dur: '4.4s' },
  { left: '72%', bottom: '22%', delay: '1.7s', dur: '3.5s' }, { left: '82%', bottom: '30%', delay: '2.8s', dur: '4s' },
];

function CoinArt({ id }: { id: string }) {
  return <svg className="coin-art" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <path id={`${id}-p`} d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2d2" /><stop offset=".5" stopColor="#f0a24e" /><stop offset="1" stopColor="#8f4710" /></linearGradient>
    </defs>
    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(60,25,3,.55)" strokeWidth="2" />
    <circle cx="100" cy="100" r="93" fill="none" stroke="rgba(255,235,200,.55)" strokeWidth="1" />
    <circle cx="100" cy="100" r="73" fill="rgba(70,30,4,.16)" stroke="rgba(60,25,3,.55)" strokeWidth="2" />
    <circle cx="100" cy="100" r="71" fill="none" stroke="rgba(255,235,200,.5)" strokeWidth="1" />
    <text fontSize="11" fontWeight="800" fill="rgba(70,30,4,.8)"><textPath href={`#${id}-p`} textLength="536" lengthAdjust="spacing">RECOIL • COINS • RECOIL • COINS • RECOIL •</textPath></text>
    <g fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="800" fontSize="96" textAnchor="middle">
      <text x="101.5" y="134" fill="rgba(60,25,3,.7)">R</text>
      <text x="98.5" y="131" fill="rgba(255,244,220,.9)">R</text>
      <text x="100" y="132.5" fill={`url(#${id}-g)`}>R</text>
    </g>
  </svg>;
}

function CoinShowcase({ offers, onAdd }: { offers: Product[]; onAdd: (p: Product) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const best = offers.find(o => o.best);
  const rest = offers.filter(o => !o.best);
  const half = Math.ceil(rest.length / 2);
  const col = (list: Product[], base: number) => list.map((p, i) => <button key={p.id} className="offer" style={{ '--i': base + i } as CSSProperties} onClick={() => onAdd(p)}>
    <span className="offer-amt">{p.title.replace(' coin', '')}<small>coin</small></span>
    <span className="offer-price"><bdi>{money(p)}</bdi></span>
  </button>);
  return <div id="coins" ref={ref} className={`coin-stage ${paused ? 'paused' : ''}`}>
    <div className="coin-layout">
      <div className="coin-wrap" aria-hidden="true">
        <div className="coin-halo" />
        <div className="coin-orbit"><i /><i /></div>
        <div className="coin-orbit rev" />
        <div className="coin-float"><div className="coin">
          <div className="coin-edge">{Array.from({ length: 11 }, (_, i) => <i key={i} style={{ transform: `translateZ(${(i - 5) * 2}px)` }} />)}</div>
          <div className="coin-face front"><CoinArt id="cf" /></div>
          <div className="coin-face back"><CoinArt id="cb" /></div>
        </div></div>
        {SPARKS.map((s, i) => <span key={i} className="spark" style={{ left: s.left, bottom: s.bottom, animationDelay: s.delay, animationDuration: s.dur }} />)}
      </div>
      <div className="offers offers-a">{col(rest.slice(0, half), 0)}</div>
      <div className="offers offers-b">{col(rest.slice(half), half)}</div>
      {best && <button className="offer offer-best" style={{ '--i': rest.length } as CSSProperties} onClick={() => onAdd(best)}>
        <span className="offer-tag">الأوفر</span>
        <span className="offer-amt">{best.title.replace(' coin', '')}<small>coin</small></span>
        <span className="offer-price"><bdi>{money(best)}</bdi></span>
      </button>}
    </div>
  </div>;
}

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
  const coinOffers = filtered.filter(p => p.category === COINS);
  const gridItems = filtered.filter(p => p.category !== COINS);
  const megaItems = products.filter(p => (tab === 'مميز' ? p.featured : p.category === tab)).slice(0, 4);
  const cartProducts = cart.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const totalText = (['USD', 'SAR'] as Currency[]).map(c => ({ c, sum: cartProducts.filter(p => p.currency === c).reduce((a, p) => a + p.price, 0) })).filter(t => t.sum > 0).map(t => money({ price: t.sum, currency: t.c })).join(' + ');
  const addToCart = (p: Product) => { setCart(c => [...c, p.id]); setNotice(`تمت إضافة ${p.title} إلى السلة`); window.setTimeout(() => setNotice(''), 2600); };
  const removeOne = (id: number) => { const i = cart.indexOf(id); if (i >= 0) setCart(cart.filter((_, k) => k !== i)); };
  const goShop = (cat?: string) => { if (cat) setCategory(cat); setMenuOpen(false); window.setTimeout(() => document.getElementById(cat === COINS ? 'coins' : 'shop')?.scrollIntoView({ behavior: 'smooth' }), 40); };

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
        {coinOffers.length > 0 && <CoinShowcase offers={coinOffers} onAdd={addToCart} />}
        {gridItems.length > 0 && <div className="grid">{gridItems.map(p => <article className="card" key={p.id}>
          <span className="pill">{p.tag}</span>
          <div className={`art art-${p.color}`}><span>{p.icon}</span></div>
          <h3>{p.title}</h3><p>{p.description}</p>
          <div className="card-foot"><span className="price"><bdi>{money(p)}</bdi></span><button className="pill-btn sm" onClick={() => addToCart(p)}>أضف للسلة</button></div>
        </article>)}</div>}
        {filtered.length === 0 && <div className="empty-state">ما لقينا منتجات تطابق بحثك. جرّب كلمة ثانية.</div>}
      </section>

      <section className="vip-panel" id="vip"><div><span className="kicker">RECOIL VIP CLUB</span><h2>مو مجرد لاعب. أنت من النخبة.</h2><p>رتبة مميزة وأيدي نادر ومزايا تخلي حضورك في اللعبة ما ينسى.</p><button className="pill-btn light" onClick={() => goShop(VIP)}>اكتشف باقات VIP</button></div><span className="vip-mark" aria-hidden="true">VIP</span></section>

      <section className="how" id="how"><h2>كيف تشتري؟</h2><div className="steps">
        {[['01', 'اختار منتجك', 'تصفح الأيديات والباقات واختر اللي يعجبك.'], ['02', 'أضفه للسلة', 'راجع طلبك وتأكد إن كل شيء تمام.'], ['03', 'استلم فوراً', 'فريقنا يجهز طلبك ويوصلك بأسرع وقت.'], ['04', 'استمتع باللعب', 'ادخل اللعبة وخلك أنت حديث الجميع.']].map(([n, t, d]) => <div className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div></section>
    </main>

    <footer className="footer"><a className="wordmark sm" href="#top">recoil</a><span>اللعب له هيبة. خلك Recoil.</span><div className="footer-links"><a href="#shop">المتجر</a><a href="#vip">VIP</a><a href="#how">كيف تشتري</a></div><small>© 2025 RECOIL STORE</small></footer>

    {notice && <div className="toast-message"><Check size={16} />{notice}</div>}
    {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}>
      <div className="drawer-head"><h2>السلة ({cart.length})</h2><button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="إغلاق"><X size={18} /></button></div>
      {cartProducts.length ? <>
        <div className="cart-items">{cartProducts.map((p, i) => <div className="cart-item" key={`${p.id}-${i}`}><div className={`cart-thumb art-${p.color}`}>{p.icon}</div><div className="cart-info"><b>{p.title}</b><small><bdi>{money(p)}</bdi></small><div className="qty"><button onClick={() => removeOne(p.id)} aria-label="حذف وحدة"><Minus size={12} /></button><span>1</span><button onClick={() => addToCart(p)} aria-label="زيادة وحدة"><Plus size={12} /></button></div></div><button className="icon-btn" onClick={() => removeOne(p.id)} aria-label="إزالة"><Trash2 size={15} /></button></div>)}</div>
        <div className="cart-total"><span>المجموع</span><b><bdi>{totalText}</bdi></b></div>
        <button className="pill-btn full" onClick={() => setNotice('قريباً — سيتم تفعيل الدفع الإلكتروني')}>إتمام الطلب</button>
        <p className="checkout-note"><ShieldCheck size={13} /> دفع آمن · تسليم سريع</p>
      </> : <div className="empty-cart"><b>سلتك فاضية حالياً</b><p>لقيت شيء عجبك؟ خذه معك.</p><button className="pill-btn" onClick={() => setCartOpen(false)}>تصفح المنتجات <ChevronLeft size={14} /></button></div>}
    </aside></div>}
  </div>;
}
export default App;
