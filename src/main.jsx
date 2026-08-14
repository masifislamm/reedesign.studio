import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const projects = [
  { name: 'Courtyard House', industry: 'Residential', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=75' },
  { name: 'Riverside Office', industry: 'Workplace', image: 'https://images.unsplash.com/photo-1474690870753-1b92efa1f4a8?auto=format&fit=crop&w=1600&q=75' },
  { name: 'Common Table', industry: 'Hospitality', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=75' },
  { name: 'Field Notes', industry: 'Exhibition', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=75' },
  { name: 'The Corner Shop', industry: 'Retail', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=75' },
  { name: 'Old Dhaka Study', industry: 'Culture', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=75' },
];

function trapFocus(event) {
  if (event.key !== 'Tab') return;
  const focusable = [...event.currentTarget.querySelectorAll('a[href], button:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function Menu({ open, close, closeRef }) {
  return <aside className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''} role="dialog" aria-modal="true" aria-label="Site menu" onKeyDown={trapFocus}>
    <button className="close" ref={closeRef} onClick={close}>Close <i>\u00d7</i></button>
    <div className="menu-links"><a href="#projects" onClick={close}>Projects</a><a href="#about" onClick={close}>About</a><a href="#contact" onClick={close}>Contact</a></div>
    <div className="menu-foot"><p>Architecture, interiors<br />and spatial strategy.</p><p>Dhaka \u00b7 Bangladesh</p></div>
  </aside>;
}

function WorksIndex({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const activeProject = slides[activeIndex];
  const selectProject = index => setActiveIndex((index + slides.length) % slides.length);

  const handleParallaxMove = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    if (imageRef.current) {
      imageRef.current.style.setProperty('--card-x', `${x * 13}px`);
      imageRef.current.style.setProperty('--card-y', `${y * 11}px`);
      imageRef.current.style.setProperty('--card-rotate-x', `${y * -5}deg`);
      imageRef.current.style.setProperty('--card-rotate-y', `${x * 5}deg`);
      imageRef.current.style.setProperty('--glare-x', `${50 + x * 28}%`);
      imageRef.current.style.setProperty('--glare-y', `${50 + y * 28}%`);
    }
    if (stageRef.current) {
      stageRef.current.style.setProperty('--type-x', `${x * -7}px`);
      stageRef.current.style.setProperty('--type-y', `${y * -5}px`);
    }
  };

  const handleParallaxLeave = event => {
    if (imageRef.current) {
      imageRef.current.style.setProperty('--card-x', '0px');
      imageRef.current.style.setProperty('--card-y', '0px');
      imageRef.current.style.setProperty('--card-rotate-x', '0deg');
      imageRef.current.style.setProperty('--card-rotate-y', '0deg');
    }
    if (stageRef.current) {
      stageRef.current.style.setProperty('--type-x', '0px');
      stageRef.current.style.setProperty('--type-y', '0px');
    }
  };
  const handleProjectKeys = event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); selectProject(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectProject(activeIndex - 1); }
  };

  return <div className="creative-space" role="region" aria-label="Selected work" onPointerMove={handleParallaxMove} onPointerLeave={handleParallaxLeave} onKeyDown={handleProjectKeys}>
    <header className="creative-space-header">
      <div className="creative-space-brand">ree.design</div>
      <nav className="creative-space-nav" aria-label="Project navigation">
        <button type="button" className={`creative-space-tab ${activeIndex === 0 ? 'is-active' : ''}`} aria-pressed={activeIndex === 0} onClick={() => selectProject(0)}>
          Selected work <span>{activeIndex + 1}</span>
        </button>
        {slides.slice(1).map((project, index) => (
          <button key={project.name} type="button" className={`creative-space-tab ${activeIndex === index + 1 ? 'is-active' : ''}`} aria-pressed={activeIndex === index + 1} aria-label={`View ${project.name}`} onClick={() => selectProject(index + 1)}>
            {index + 2}
          </button>
        ))}
      </nav>
    </header>

    <p className="creative-space-label">Selected work</p>

    <div className="creative-space-stage" ref={stageRef}>
      <div className="creative-space-overlay"><span>Overview</span><span>{String(activeIndex + 1).padStart(3, '0')}</span></div>
      <div className="creative-space-name-block">
        <div className="creative-space-word creative-space-word--primary">
          <span>Spaces with</span>
          <span>purpose</span>
        </div>
        <div className="creative-space-word creative-space-word--secondary">
          <span>Architecture</span>
          <span>&amp; interiors</span>
        </div>
      </div>
      <article className="creative-space-project-card" key={activeProject.name} ref={imageRef} aria-live="polite">
        <div className="creative-space-project-media">
          <img src={activeProject.image} alt={activeProject.name} />
          <span className="creative-space-glare" aria-hidden="true" />
          <span className="creative-space-project-number" aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')}</span>
        </div>
        <div className="creative-space-project-copy">
          <p>{activeProject.industry}</p>
          <h2>{activeProject.name}</h2>
          <span className="creative-space-project-arrow" aria-hidden="true">↗</span>
        </div>
      </article>
    </div>
  </div>;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [transitionColor, setTransitionColor] = useState('#d0d0d0');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHeroVideo] = useState(() => {
    const connection = navigator.connection;
    return !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const cursorRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuCloseRef = useRef(null);
  const aboutButtonRef = useRef(null);
  const aboutCloseRef = useRef(null);
  const previousMenu = useRef(false);
  const previousAbout = useRef(false);
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const handleHeroMove = event => {
    if (event.pointerType === 'touch' || prefersReducedMotion()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', `${(x + 1) * 50}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${(y + 1) * 50}%`);
    event.currentTarget.style.setProperty('--image-x', `${x * 12}px`);
    event.currentTarget.style.setProperty('--image-y', `${y * 10}px`);
  };
  useEffect(() => {
    const onKey = event => {
      if (event.key !== 'Escape') return;
      setMenu(false);
      setAboutOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (menu) menuCloseRef.current?.focus();
    else if (previousMenu.current) menuButtonRef.current?.focus();
    previousMenu.current = menu;
  }, [menu]);
  useEffect(() => {
    if (aboutOpen) aboutCloseRef.current?.focus();
    else if (previousAbout.current) aboutButtonRef.current?.focus();
    previousAbout.current = aboutOpen;
  }, [aboutOpen]);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const pages = [...document.querySelectorAll('main > section:not(.about-panel)')];
    const colors = ['#d0d0d0', '#fbfbfa', '#f4f4f1', '#d0dd50', '#dc765d'];
    let activePage = 0;
    let timeout;
    const observer = new IntersectionObserver(entries => {
      const visiblePage = entries.find(entry => entry.isIntersecting && entry.intersectionRatio > .65);
      if (!visiblePage) return;
      const nextPage = pages.indexOf(visiblePage.target);
      if (nextPage === activePage) return;
      activePage = nextPage;
      setTransitionColor(colors[nextPage]);
      setIsTransitioning(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsTransitioning(false), 460);
    }, { threshold: [.65] });
    pages.forEach(page => observer.observe(page));
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const cursor = cursorRef.current;
    let targetX = 0;
    let targetY = 0;
    let dotX = 0;
    let dotY = 0;
    let frame;
    const animate = () => {
      dotX += (targetX - dotX) * .12;
      dotY += (targetY - dotY) * .12;
      cursor.style.setProperty('--cursor-x', `${dotX - 2.5}px`);
      cursor.style.setProperty('--cursor-y', `${dotY + 11}px`);
      frame = requestAnimationFrame(animate);
    };
    const move = event => {
      if (event.pointerType === 'touch') return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!cursor.classList.contains('is-visible')) {
        dotX = targetX;
        dotY = targetY;
        cursor.classList.add('is-visible');
      }
    };
    window.addEventListener('pointermove', move);
    frame = requestAnimationFrame(animate);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);
  return <>
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
    <div className={`pixel-transition ${isTransitioning ? 'is-active' : ''}`} style={{ '--transition-color': transitionColor }} aria-hidden="true" />
    <main>
    <header className="nav"><a className="brand" href="#top" aria-label="ree.design studio home">ree<span>.</span>design<br />studio</a><button className="menu-button" ref={menuButtonRef} onClick={() => setMenu(true)}>Menu <b>+</b></button></header>
    <Menu open={menu} close={() => setMenu(false)} closeRef={menuCloseRef} />
    <section className="hero" id="top" onPointerMove={handleHeroMove} onPointerLeave={event => { event.currentTarget.style.setProperty('--image-x', '0px'); event.currentTarget.style.setProperty('--image-y', '0px'); }}><div className="hero-image">{showHeroVideo && <video autoPlay muted loop playsInline preload="metadata"><source src="/video/hero.mp4" type="video/mp4" /></video>}<span className="hero-shine" aria-hidden="true" /></div></section>
    <section className="intro" id="about" aria-label="Who we are"><div className="intro-statement intro-statement-one"><div className="intro-word-group intro-left-top"><div>We</div><div>Don't</div><div>Design</div></div><div className="intro-word-group intro-left-bottom"><div>In</div><div>Isolation</div></div></div><div className="intro-statement intro-statement-two"><div className="intro-word-group intro-middle"><div>We</div><div>Question</div><div>Connect</div><div>Experiment</div></div></div><div className="intro-statement intro-statement-three"><div className="intro-word-group intro-right"><div>And</div><div>Build</div><div>Design</div><div>That</div><div>Matters</div></div></div><button className="text-link" ref={aboutButtonRef} type="button" onClick={() => setAboutOpen(true)}>Read more</button></section>
    <section className={`about-panel ${aboutOpen ? 'is-open' : ''}`} aria-hidden={!aboutOpen} inert={aboutOpen ? undefined : ''} role="dialog" aria-modal="true" aria-labelledby="about-title" onKeyDown={trapFocus}><button className="about-close" ref={aboutCloseRef} type="button" onClick={() => setAboutOpen(false)}>Close <span>\u00d7</span></button><div className="about-panel-content"><p className="about-kicker" id="about-title">Who we are</p><div className="about-copy"><p>We are a multidisciplinary design consultancy shaping ideas into spaces, products, brands, and experiences.</p><p>We connect architecture, interiors, product, graphics, and branding through one cohesive design approach.</p><p>Based in Dhaka. Working across Bangladesh.</p></div></div></section>
    <section className="work" id="projects"><WorksIndex slides={projects} /></section>
    <section className="statement"><p className="eyebrow">OUR APPROACH</p><h2>Thoughtful design<br />is a form of <em>care.</em></h2><p className="statement-copy">Our work starts with listening. We look carefully at the character of a place, the people around it and the possibilities hidden in plain sight. Then, together, we make something lasting.</p></section>
    <section className="contact" id="contact"><p className="eyebrow">START A CONVERSATION</p><h2>Have a space<br />in <em>mind?</em></h2><a href="mailto:hello@ree.design" className="email">hello@ree.design <span>\u2197</span></a><div className="contact-bottom"><p>Dhaka, Bangladesh<br />Working everywhere</p><p>\u00a9 2026 ree.design studio</p><a href="#top">Back to top \u2191</a></div></section>
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
