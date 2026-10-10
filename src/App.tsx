import { lazy, Suspense, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  Command,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react'
import PortfolioVideo from './PortfolioVideo'
import './App.css'

const HeroScene = lazy(() => import('./HeroScene'))
const bookingUrl = `https://wa.me/966580598411?text=${encodeURIComponent('مرحباً باسم، أود حجز جلسة تشغيلية لمناقشة فرص أتمتة أعمالي.')}`
const assistantBotVideo = new URL('../my assisant.mp4', import.meta.url).href
const latestAiNewsVideo = new URL('../the last news about ai and it.mp4', import.meta.url).href

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-inner">
          <p className="announcement-note">
            <span className="status-dot" />
            <span>متاح لمشاريع جديدة هذا الشهر</span>
            <a href={bookingUrl}>احجز جلسة <ArrowUpLeft size={14} /></a>
          </p>
          <div className="top-contacts" dir="ltr">
            <a href="mailto:rmz.tech@gmail.com"><Mail size={13} /> rmz.tech@gmail.com</a>
            <span className="top-divider" />
            <a href="tel:+966580598411"><Phone size={13} /> +966 58 059 8411</a>
            <span className="top-divider" />
            <a className="social-link" href="https://www.facebook.com/profile.php?id=61571789743570&amp;locale=ar_AR" aria-label="Facebook">f</a>
            <a className="social-link" href="https://www.instagram.com/rmz_oinso/" aria-label="Instagram">ig</a>
            <a className="social-link" href="https://www.youtube.com/@rmzoinso" aria-label="YouTube">▶</a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand" aria-label="باسم محمد، الرئيسية" dir="rtl">
            <span className="brand-mark"><Command size={18} strokeWidth={2.5} /></span>
            <span className="brand-copy"><strong>باسم محمد</strong><small>ذكاء اصطناعي · أتمتة أعمال</small></span>
          </a>

          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="التنقل الرئيسي" dir="rtl">
            <a href="#home" onClick={() => setMenuOpen(false)}>الرئيسية</a>
            <a href="#solutions" onClick={() => setMenuOpen(false)}>الأنظمة</a>
            <a href="#work" onClick={() => setMenuOpen(false)}>معرض الأعمال</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)}>الشهادات</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>احجز الآن</a>
          </nav>

          <a className="header-cta" href={bookingUrl}>احجز الآن <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        <section className="hero-section grid-surface" id="home">
          <div className="hero-inner page-width">
            <div className="hero-copy" dir="rtl">
              <div className="eyebrow"><span className="eyebrow-line" /> خبير أتمتة العمليات والذكاء الاصطناعي</div>
              <h1>استعادة ساعات العمل المهدورة عبر <span>أنظمة أتمتة ذكية</span></h1>
              <p className="hero-description">نحوّل الاختناقات التشغيلية الروتينية إلى مسارات عمل آلية تعمل بدقة متناهية على مدار الساعة، لتركز فريقك على النمو والابتكار.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={bookingUrl}>احجز الآن <ArrowLeft size={17} /></a>
                <a className="text-link" href="#solutions"><span className="play-mark">↙</span> استعرض الأنظمة</a>
              </div>
              <div className="hero-proof" dir="rtl">
                <div className="proof-avatars" aria-hidden="true"><span>ب</span><span>م</span><span>+</span></div>
                <p><strong>وقت أكثر للأفكار الكبيرة</strong><small>عمليات أذكى، كل يوم</small></p>
                <span className="proof-separator" />
                <span className="proof-caption"><Check size={14} /> مصممة حول طريقة عملك</span>
              </div>
            </div>
            <div className="hero-art" aria-label="تكوين هندسي ثلاثي الأبعاد يرمز إلى أنظمة مترابطة" role="img">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-crosshair crosshair-one" />
              <div className="art-crosshair crosshair-two" />
              <div className="floating-tag tag-top"><Sparkles size={15} /><span>ذكاء يعمل لأجلك</span></div>
              <Suspense fallback={null}><HeroScene /></Suspense>
              <div className="art-node node-blue"><Workflow size={19} /></div>
              <div className="art-node node-lime"><Bot size={19} /></div>
              <div className="floating-tag tag-bottom"><span className="live-pulse" /> يعمل على مدار الساعة <span className="tag-divider" /> 24/7</div>
              <span className="art-index">01 <span /> 03</span>
            </div>
          </div>
          <a href="#testimonials" className="scroll-cue" aria-label="انتقل إلى الشهادات"><ChevronDown size={17} /></a>
          <div className="hero-edge-label" dir="ltr">SYSTEMS THAT THINK AHEAD · 2026</div>
        </section>

        <section className="work-section page-width testimonials-section" id="testimonials" dir="rtl">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker"><span className="kicker-dot" /> ثقة قادة الأعمال</span>
              <h2>شهادات نعتز بها من شركاء النجاح</h2>
            </div>
          </div>
          <div className="testimonial-grid">
            <article className="testimonial-card">
              <span className="testimonial-mark" aria-hidden="true">“</span>
              <blockquote>ساعدنا مساعد Rumzy في تقليص وقت معالجة البريد والمهام بنسبة كبيرة جداً، وأصبح الفريق يتفرغ للمهام الاستراتيجية.</blockquote>
              <p>رئيس قطاع العمليات، شركة رائدة</p>
            </article>
            <article className="testimonial-card">
              <span className="testimonial-mark testimonial-mark-lime" aria-hidden="true">“</span>
              <blockquote>نظام الأبحاث الآلي اختصر ساعات طويلة من البحث اليدوي اليومي، وأصبحت التقارير تصلنا بدقة فائقة كل صباح.</blockquote>
              <p>مدير تنفيذي، مؤسسة تجارية</p>
            </article>
          </div>
        </section>

        <section className="work-section page-width solutions-section" id="solutions" dir="rtl">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker"><span className="kicker-dot" /> أبرز الأنظمة المنجزة</span>
              <h2>حلول عملية مضاعفة للإنتاجية</h2>
            </div>
          </div>
          <article className="solution-card">
            <div className="solution-visual" aria-hidden="true">
              <div className="solution-window">
                <div className="solution-window-top"><span /><span /><span /><b>مساعد البريد والمهام</b></div>
                <div className="solution-flow"><div className="solution-flow-node"><Mail size={19} /><span>بريد وارد</span></div><i /><div className="solution-flow-node solution-flow-ai"><Bot size={21} /><span>فرز ذكي</span></div><i /><div className="solution-flow-node solution-flow-task"><Check size={20} /><span>مهمة منظمة</span></div></div>
                <div className="solution-status"><span className="live-pulse" /> النظام يعمل <span>آخر تحديث: الآن</span></div>
              </div>
              <span className="solution-orbit solution-orbit-one" /><span className="solution-orbit solution-orbit-two" />
            </div>
            <div className="solution-copy">
              <span className="solution-badge">مساعد إداري آلي</span>
              <h3>مساعد البريد والمهام الذكي</h3>
              <p>نظام متكامل يتولى فرز وتصنيف وإدارة البريد اليومي والمهام الروتينية بدقة تامة، مما يوفر ساعات طويلة من العمل اليدوي أسبوعياً.</p>
              <a href={bookingUrl} className="about-link">ناقش هذا النظام <ArrowLeft size={15} /></a>
            </div>
          </article>
        </section>

        <section className="work-section page-width portfolio-section" id="work" dir="rtl">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker"><span className="kicker-dot" /> AI-POWERED PORTFOLIO</span>
              <h2>معرض الأعمال</h2>
            </div>
            <p className="section-intro">هذه هي المشاريع التي قدمناها للعملاء السابقين</p>
          </div>
          <div className="portfolio-video-grid">
            <PortfolioVideo src={assistantBotVideo} title="my assistant bot" variant="assistant" />
            <PortfolioVideo src={latestAiNewsVideo} title="the last news about ai and it" variant="news" />
          </div>
        </section>

        <section className="contact-section page-width" id="contact" dir="rtl">
          <div className="contact-card">
            <div className="contact-copy">
              <span className="contact-kicker"><span className="status-dot" /> حان وقت العمل بذكاء أكبر</span>
              <h2>جاهز لتحويل العمليات الروتينية إلى مسارات آلية؟</h2>
              <p>احجز جلستك التشغيلية الآن لنحدد معا فرص التوفير ومضاعفة إنتاجية شركتك.</p>
              <a className="button button-white" href={bookingUrl}>احجز الآن <ArrowUpRight size={16} /></a>
            </div>
            <div className="contact-art" aria-hidden="true"><div className="contact-ring ring-a" /><div className="contact-ring ring-b" /><div className="contact-block block-a" /><div className="contact-block block-b" /><span className="contact-star star-a">✳</span><span className="contact-star star-b">✳</span><span className="contact-note">وقت أقل في المهام.<br /><b>أثر أكبر في النتائج.</b></span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer" dir="rtl">
        <div className="footer-inner page-width">
          <div className="footer-identity">
            <a href="#home" className="brand footer-brand"><span className="brand-mark"><Command size={17} strokeWidth={2.5} /></span><span className="brand-copy"><strong>باسم محمد عبد الجابر</strong><small>ذكاء اصطناعي · أتمتة أعمال</small></span></a>
            <p>تحويل الاختناقات التشغيلية إلى أنظمة أتمتة تعمل بدقة على مدار الساعة.</p>
          </div>
          <div className="footer-contact">
            <a href="mailto:rmz.tech@gmail.com"><Mail size={15} /> rmz.tech@gmail.com</a>
            <div className="footer-socials" dir="ltr">
              <a className="social-link" href="https://www.facebook.com/profile.php?id=61571789743570&amp;locale=ar_AR" aria-label="Facebook">f</a>
              <a className="social-link" href="https://www.instagram.com/rmz_oinso/" aria-label="Instagram">ig</a>
              <a className="social-link" href="https://www.youtube.com/@rmzoinso" aria-label="YouTube">▶</a>
            </div>
          </div>
          <p className="footer-copy">© 2026 باسم محمد عبد الجابر - أنظمة أتمتة متكاملة يقاس نجاحها بإنتاجية فريقك والوقت الموفر.</p>
        </div>
      </footer>

      <div className="chat-dock">
        <a className="chat-launcher" href={bookingUrl} aria-label="تحدث معي عبر واتساب"><MessageCircle size={23} /><span>لنتحدث</span></a>
      </div>
    </>
  )
}

export default App
