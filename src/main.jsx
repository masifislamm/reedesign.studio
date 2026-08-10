import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './hero.css';

const projects = [
  { name: 'Hearth House', location: 'DHAKA, BD', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85', span: 'wide' },
  { name: 'Nawabganj Courtyard', location: 'DHAKA, BD', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', span: 'tall' },
  { name: 'Jute & Lime', location: 'CHITTAGONG, BD', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', span: 'standard' },
  { name: 'Riverside Rooms', location: 'BARISAL, BD', image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1200&q=85', span: 'standard' },
  { name: 'The Green Veranda', location: 'DHAKA, BD', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85', span: 'wide' },
  { name: 'Nila House', location: 'SYLHET, BD', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85', span: 'tall' },
];

function Menu({open, close}) {
  return <aside className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
    <button className="close" onClick={close}>Close <i>×</i></button>
    <div className="menu-links"><a href="#projects" onClick={close}>Projects</a><a href="#about" onClick={close}>About</a><a href="#contact" onClick={close}>Contact</a></div>
    <div className="menu-foot"><p>Architecture, interiors<br/>and spatial strategy.</p><p>Dhaka · Bangladesh</p></div>
  </aside>
}

function App() {
  const [menu, setMenu] = useState(false);
  const [current, setCurrent] = useState(0);
  const [introWord, setIntroWord] = useState('brand');
  const cursorRef = useRef(null);
  const dynamicWords = ['brand', 'space', 'product', 'experience'];
  
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
  const handleIntroMove = event => {
    // Support both pointer and touch events
    let clientX = event.clientX;
    if (event.touches && event.touches[0]) clientX = event.touches[0].clientX;
    const bounds = event.currentTarget.getBoundingClientRect();
    const percent = (clientX - bounds.left) / bounds.width;
    const index = Math.min(dynamicWords.length - 1, Math.max(0, Math.floor(percent * dynamicWords.length)));
    setIntroWord(dynamicWords[index]);
  };
  const resetIntroWord = () => setIntroWord(dynamicWords[0]);

  
  const resetHero = event => {
    event.currentTarget.style.setProperty('--image-x', '0px');
    event.currentTarget.style.setProperty('--image-y', '0px');
  };
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = event => {
      if (event.pointerType === 'touch') return;
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursor.classList.add('is-visible');
    };
    const hide = () => cursor.classList.remove('is-visible');
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerleave', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', hide);
    };
  }, []);

  return <main>
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
    <header className="nav"><a className="brand" href="#top" aria-label="ree.design studio home">ree<span>.</span>design<br/>studio</a><button className="menu-button" onClick={() => setMenu(true)}>Menu <b>+</b></button></header>
    <Menu open={menu} close={() => setMenu(false)} />
    <section className="hero" id="top" onPointerMove={handleHeroMove} onPointerLeave={resetHero}>
      <div className="hero-image" aria-label="Video placeholder">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/video/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <span className="hero-shine" aria-hidden="true"/>
      </div>
    </section>
    <section className="intro" id="about"
      onPointerMove={handleIntroMove}
      onPointerLeave={resetIntroWord}
      onTouchMove={handleIntroMove}
      onTouchEnd={resetIntroWord}
      
    >
      <div className="intro-box">
        <div className="intro-box-inner">
          <p className="eyebrow">WHO WE ARE</p>
          <h2>We are a multidisciplinary design consultancy that brings <span className="intro-dynamic">{introWord}</span> together.</h2>
          <p className="intro-copy">We shape ideas into compelling brand, space, product and experience with clarity, craft and cultural insight.</p>
          <a className="text-link" href="#contact">More about the studio <span>↗</span></a>
        </div>
      </div>
    </section>
    <section className="work" id="projects"><div className="section-heading"><p className="eyebrow">SELECTED WORK</p><p>2021—2026</p></div><div className="project-grid">{projects.map((p, i) => <article className={`project ${p.span}`} key={p.name} onMouseEnter={() => setCurrent(i)}><div className="project-image"><img src={p.image} alt={p.name} /></div><div className="project-meta"><h3>{p.name}</h3><p>{p.location} <span>0{i + 1}</span></p></div></article>)}</div><p className="project-count">{String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p></section>
    <section className="statement"><p className="eyebrow">OUR APPROACH</p><h2>Thoughtful design<br/>is a form of <em>care.</em></h2><p className="statement-copy">Our work starts with listening. We look carefully at the character of a place, the people around it and the possibilities hidden in plain sight. Then, together, we make something lasting.</p></section>
    <section className="contact" id="contact"><p className="eyebrow">START A CONVERSATION</p><h2>Have a space<br/>in <em>mind?</em></h2><a href="mailto:hello@ree.design" className="email">hello@ree.design <span>↗</span></a><div className="contact-bottom"><p>Dhaka, Bangladesh<br/>Working everywhere</p><p>© 2026 ree.design studio</p><a href="#top">Back to top ↑</a></div></section>
  </main>
}
createRoot(document.getElementById('root')).render(<App />);
