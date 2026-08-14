import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './hero.css';

const projects = [
  { name: 'Ortiz Le\u00f3n', industry: 'Branding', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2200&q=85' },
  { name: 'Love For Iceland', industry: 'Branding', image: 'https://images.unsplash.com/photo-1474690870753-1b92efa1f4a8?auto=format&fit=crop&w=2200&q=85' },
  { name: 'The Good Burger', industry: 'Hospitality', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2200&q=85' },
  { name: 'Analytica Projects', industry: 'Corporate', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=85' },
  { name: 'The Cube', industry: 'Retail', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2200&q=85' },
  { name: 'Casa Batll\u00f3', industry: 'Culture', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=2200&q=85' },
];

function Menu({ open, close }) {
  return <aside className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
    <button className="close" onClick={close}>Close <i>\u00d7</i></button>
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
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    
    // Apply parallax effect to image and card
    if (imageRef.current) {
      imageRef.current.style.setProperty('--card-x', `${x * 8}px`);
      imageRef.current.style.setProperty('--card-y', `${y * 8}px`);
      imageRef.current.style.setProperty('--card-rotate-x', `${y * 4}deg`);
      imageRef.current.style.setProperty('--card-rotate-y', `${x * 4}deg`);
    }
  };

  const handleParallaxLeave = event => {
    if (imageRef.current) {
      imageRef.current.style.setProperty('--card-x', '0px');
      imageRef.current.style.setProperty('--card-y', '0px');
      imageRef.current.style.setProperty('--card-rotate-x', '0deg');
      imageRef.current.style.setProperty('--card-rotate-y', '0deg');
    }
  };

  return <div className="creative-space" role="region" aria-label="Selected work" onPointerMove={handleParallaxMove} onPointerLeave={handleParallaxLeave}>
    <header className="creative-space-header">
      <div className="creative-space-brand">GN .D</div>
      <nav className="creative-space-nav" aria-label="Project navigation">
        <button type="button" className="creative-space-tab is-active" onClick={() => selectProject(activeIndex)}>
          Creative Space <span>{activeIndex + 1}</span>
        </button>
        {slides.slice(1).map((project, index) => (
          <button key={project.name} type="button" className="creative-space-tab" onClick={() => selectProject(index + 1)}>
            {index + 2}
          </button>
        ))}
      </nav>
    </header>

    <button type="button" className="creative-space-close">Close</button>

    <div className="creative-space-stage" ref={stageRef}>
      <div className="creative-space-overlay"><span>Overview</span><span>{String(activeIndex + 1).padStart(3, '0')}</span></div>
      <div className="creative-space-name-block">
        <div className="creative-space-word creative-space-word--primary">
          <span>Gionatan</span>
          <span>Nese</span>
        </div>
        <div className="creative-space-word creative-space-word--secondary">
          <span>Multi-Disciplinary</span>
          <span>Designer</span>
        </div>
      </div>
      <div className="creative-space-project-card" ref={imageRef}>
        <img src={activeProject.image} alt={activeProject.name} />
        <div className="creative-space-project-copy">
          <p>{activeProject.industry}</p>
          <h2>{activeProject.name}</h2>
        </div>
      </div>
    </div>
  </div>;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const cursorRef = useRef(null);
  const handleHeroMove = event => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', `${(x + 1) * 50}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${(y + 1) * 50}%`);
    event.currentTarget.style.setProperty('--image-x', `${x * 12}px`);
    event.currentTarget.style.setProperty('--image-y', `${y * 10}px`);
  };
  useEffect(() => {
    const onKey = event => event.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const pages = [...document.querySelectorAll('main > section:not(.about-panel)')];
    let frame;
    const updatePageTransforms = () => {
      const viewportCenter = window.innerHeight / 2;
      pages.forEach(page => {
        const center = page.offsetTop - window.scrollY + page.offsetHeight / 2;
        const distance = (center - viewportCenter) / window.innerHeight;
        const amount = Math.min(Math.abs(distance), 1);
        const rotation = distance < 0 ? amount * 90 : -amount * 90;
        page.style.setProperty('--page-tilt', `${rotation.toFixed(2)}deg`);
        page.style.setProperty('--page-origin', distance < 0 ? '50% 100%' : '50% 0%');
        page.style.setProperty('--page-opacity', (1 - Math.max(0, amount - .75) * 4).toFixed(3));
      });
      frame = undefined;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updatePageTransforms);
    };
    updatePageTransforms();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
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
    <main>
    <header className="nav"><a className="brand" href="#top" aria-label="ree.design studio home">ree<span>.</span>design<br />studio</a><button className="menu-button" onClick={() => setMenu(true)}>Menu <b>+</b></button></header>
    <Menu open={menu} close={() => setMenu(false)} />
    <section className="hero" id="top" onPointerMove={handleHeroMove} onPointerLeave={event => event.currentTarget.style.setProperty('--image-x', '0px')}><div className="hero-image"><video autoPlay muted loop playsInline preload="auto"><source src="/video/hero.mp4" type="video/mp4" /></video><span className="hero-shine" aria-hidden="true" /></div></section>
    <section className="intro" id="about" aria-label="Who we are"><div className="intro-statement intro-statement-one"><div className="intro-word-group intro-left-top"><div>We</div><div>Don't</div><div>Design</div></div><div className="intro-word-group intro-left-bottom"><div>In</div><div>Isolation</div></div></div><div className="intro-statement intro-statement-two"><div className="intro-word-group intro-middle"><div>We</div><div>Question</div><div>Connect</div><div>Experiment</div></div></div><div className="intro-statement intro-statement-three"><div className="intro-word-group intro-right"><div>And</div><div>Build</div><div>Design</div><div>That</div><div>Matters</div></div></div><button className="text-link" type="button" onClick={() => setAboutOpen(true)}>Read more</button></section>
    <section className={`about-panel ${aboutOpen ? 'is-open' : ''}`} aria-hidden={!aboutOpen}><button className="about-close" type="button" onClick={() => setAboutOpen(false)}>Close <span>\u00d7</span></button><div className="about-panel-content"><p className="about-kicker">Who we are</p><div className="about-copy"><p>We are a multidisciplinary design consultancy shaping ideas into spaces, products, brands, and experiences.</p><p>We connect architecture, interiors, product, graphics, and branding through one cohesive design approach.</p><p>Based in Dhaka. Working across Bangladesh.</p></div></div></section>
    <section className="work" id="projects"><WorksIndex slides={projects} /></section>
    <section className="statement"><p className="eyebrow">OUR APPROACH</p><h2>Thoughtful design<br />is a form of <em>care.</em></h2><p className="statement-copy">Our work starts with listening. We look carefully at the character of a place, the people around it and the possibilities hidden in plain sight. Then, together, we make something lasting.</p></section>
    <section className="contact" id="contact"><p className="eyebrow">START A CONVERSATION</p><h2>Have a space<br />in <em>mind?</em></h2><a href="mailto:hello@ree.design" className="email">hello@ree.design <span>\u2197</span></a><div className="contact-bottom"><p>Dhaka, Bangladesh<br />Working everywhere</p><p>\u00a9 2026 ree.design studio</p><a href="#top">Back to top \u2191</a></div></section>
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
