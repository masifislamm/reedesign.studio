import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

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
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <main>
    <header className="nav"><a className="brand" href="#top" aria-label="ree.design studio home">ree<span>.</span>design<br/>studio</a><button className="menu-button" onClick={() => setMenu(true)}>Menu <b>+</b></button></header>
    <Menu open={menu} close={() => setMenu(false)} />
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow">REE.DESIGN STUDIO / 01</p><h1>Making room<br/>for <em>what matters.</em></h1></div>
      <div className="hero-image"><img src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=2000&q=90" alt="Sunlit contemporary interior" /><p className="image-note">01 / 06 — A quiet architecture</p></div>
      <a className="scroll" href="#about">Scroll to explore <span>↓</span></a>
    </section>
    <section className="intro" id="about"><p className="eyebrow">WHO WE ARE</p><div><h2>We design places that bring people <em>closer—</em> to each other, to nature, and to the everyday rituals that shape a life.</h2><a className="text-link" href="#contact">More about the studio <span>↗</span></a></div></section>
    <section className="work" id="projects"><div className="section-heading"><p className="eyebrow">SELECTED WORK</p><p>2021—2026</p></div><div className="project-grid">{projects.map((p, i) => <article className={`project ${p.span}`} key={p.name} onMouseEnter={() => setCurrent(i)}><div className="project-image"><img src={p.image} alt={p.name} /></div><div className="project-meta"><h3>{p.name}</h3><p>{p.location} <span>0{i + 1}</span></p></div></article>)}</div><p className="project-count">{String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p></section>
    <section className="statement"><p className="eyebrow">OUR APPROACH</p><h2>Thoughtful design<br/>is a form of <em>care.</em></h2><p className="statement-copy">Our work starts with listening. We look carefully at the character of a place, the people around it and the possibilities hidden in plain sight. Then, together, we make something lasting.</p></section>
    <section className="contact" id="contact"><p className="eyebrow">START A CONVERSATION</p><h2>Have a space<br/>in <em>mind?</em></h2><a href="mailto:hello@ree.design" className="email">hello@ree.design <span>↗</span></a><div className="contact-bottom"><p>Dhaka, Bangladesh<br/>Working everywhere</p><p>© 2026 ree.design studio</p><a href="#top">Back to top ↑</a></div></section>
  </main>
}
createRoot(document.getElementById('root')).render(<App />);
