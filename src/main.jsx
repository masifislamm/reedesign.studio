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
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('All Industries');
  const [activeProject, setActiveProject] = useState(null);
  const industries = ['All Industries', ...new Set(slides.map(project => project.industry))];
  const visible = filter === 'All Industries' ? slides : slides.filter(project => project.industry === filter);
  return <div className={`works-index ${activeProject ? 'has-active-project' : ''}`} role="region" aria-label="Selected work" onMouseLeave={() => setActiveProject(null)}>
    <div className="works-stage" aria-hidden="true">{slides.map(project => <img className={activeProject === project.name ? 'is-active' : ''} key={project.name} src={project.image} alt="" />)}</div>
    <div className="works-intro">
      <h2>Projects<br />that deliver<br />on what we<br />say</h2>
      <div className="works-copy">
        <p>Every project here is the real application of our methodology \u2014 and of brands willing to go further. From initial research to the last aesthetic detail, every decision is made so the work performs inside and resonates outside, turning web design into memorable digital experiences.</p>
        <p>This selection brings together projects for large and small companies, across different sectors and complexities \u2014 but with the same standard behind them. Each one, built to be unrepeatable.</p>
      </div>
    </div>
    <div className="works-content">
      <div className={`works-filter ${filterOpen ? 'is-open' : ''}`}>
        <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen(!filterOpen)}>{filter}<span>\u2195</span></button>
        <div>{industries.map(industry => <button type="button" key={industry} onClick={() => { setFilter(industry); setFilterOpen(false); }}>{industry}</button>)}</div>
      </div>
      <ul className="works-list">{visible.map(project => <li key={project.name} onMouseEnter={() => setActiveProject(project.name)} onFocus={() => setActiveProject(project.name)}><a href="#contact">{project.name}</a></li>)}</ul>
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
    const cursor = cursorRef.current;
    const move = event => { if (event.pointerType !== 'touch') { cursor.style.setProperty('--cursor-x', `${event.clientX}px`); cursor.style.setProperty('--cursor-y', `${event.clientY}px`); cursor.classList.add('is-visible'); } };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <main>
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
    <header className="nav"><a className="brand" href="#top" aria-label="ree.design studio home">ree<span>.</span>design<br />studio</a><button className="menu-button" onClick={() => setMenu(true)}>Menu <b>+</b></button></header>
    <Menu open={menu} close={() => setMenu(false)} />
    <section className="hero" id="top" onPointerMove={handleHeroMove} onPointerLeave={event => event.currentTarget.style.setProperty('--image-x', '0px')}><div className="hero-image"><video autoPlay muted loop playsInline preload="auto"><source src="/video/hero.mp4" type="video/mp4" /></video><span className="hero-shine" aria-hidden="true" /></div></section>
    <section className="intro" id="about" aria-label="Who we are"><div className="intro-statement intro-statement-one"><div className="intro-word-group intro-left-top"><div>We</div><div>Don't</div><div>Design</div></div><div className="intro-word-group intro-left-bottom"><div>In</div><div>Isolation</div></div></div><div className="intro-statement intro-statement-two"><div className="intro-word-group intro-middle"><div>We</div><div>Question</div><div>Connect</div><div>Experiment</div></div></div><div className="intro-statement intro-statement-three"><div className="intro-word-group intro-right"><div>And</div><div>Build</div><div>Design</div><div>That</div><div>Matters</div></div></div><button className="text-link" type="button" onClick={() => setAboutOpen(true)}>Read more <span aria-hidden="true">\u2193</span></button></section>
    <section className={`about-panel ${aboutOpen ? 'is-open' : ''}`} aria-hidden={!aboutOpen}><button className="about-close" type="button" onClick={() => setAboutOpen(false)}>Close <span>\u00d7</span></button><div className="about-panel-content"><p className="about-kicker">Who we are</p><div className="about-copy"><p>We are a multidisciplinary design consultancy shaping ideas into spaces, products, brands, and experiences.</p><p>We connect architecture, interiors, product, graphics, and branding through one cohesive design approach.</p><p>Based in Dhaka. Working across Bangladesh.</p></div></div></section>
    <section className="work" id="projects"><WorksIndex slides={projects} /></section>
    <section className="statement"><p className="eyebrow">OUR APPROACH</p><h2>Thoughtful design<br />is a form of <em>care.</em></h2><p className="statement-copy">Our work starts with listening. We look carefully at the character of a place, the people around it and the possibilities hidden in plain sight. Then, together, we make something lasting.</p></section>
    <section className="contact" id="contact"><p className="eyebrow">START A CONVERSATION</p><h2>Have a space<br />in <em>mind?</em></h2><a href="mailto:hello@ree.design" className="email">hello@ree.design <span>\u2197</span></a><div className="contact-bottom"><p>Dhaka, Bangladesh<br />Working everywhere</p><p>\u00a9 2026 ree.design studio</p><a href="#top">Back to top \u2191</a></div></section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
