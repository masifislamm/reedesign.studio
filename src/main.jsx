import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import ProjectList from './ProjectList';

const projects = [
  { name: 'Terra Console', industry: 'Product Design', image: '/images/projects/project-01.jpg' },
  { name: 'Axis Executive Desk', industry: 'Workplace', image: '/images/projects/project-02.jpg' },
  { name: 'Arc Meeting Suite', industry: 'Interior Design', image: '/images/projects/project-03.jpg' },
  { name: 'Arc Table Study', industry: 'Product Design', image: '/images/projects/project-04.jpg' },
  { name: 'Pivot Desk', industry: 'Workplace', image: '/images/projects/project-05.jpg' },
  { name: 'Forum Executive Suite', industry: 'Interior Design', image: '/images/projects/project-06.jpg' },
  { name: 'Forum Desk', industry: 'Product Design', image: '/images/projects/project-07.jpg' },
  { name: 'Residence Office', industry: 'Interior Design', image: '/images/projects/project-08.jpg' },
  { name: 'Change Studies', industry: 'Graphic Design', image: '/images/projects/project-09.jpg' },
  { name: 'Indie Club Poster', industry: 'Poster Design', image: '/images/projects/project-10.jpg' },
  { name: 'War Is Hell', industry: 'Typography', image: '/images/projects/project-11.jpg' },
  { name: 'Methodology', industry: 'Graphic Design', image: '/images/projects/project-12.jpg' },
  { name: 'Signal Portrait', industry: 'Experimental Print', image: '/images/projects/project-13.jpg' },
  { name: 'Red Structure', industry: 'Abstract Print', image: '/images/projects/project-14.jpg' },
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
  return <aside className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open} role="dialog" aria-modal="true" aria-label="Site menu" onKeyDown={trapFocus}>
    <button className="close" ref={closeRef} onClick={close}>Close <i>\u00d7</i></button>
    <div className="menu-links"><a href="#projects" onClick={close}>Projects</a><a href="#about" onClick={close}>About</a><a href="#contact" onClick={close}>Contact</a></div>
    <div className="menu-foot"><p>Architecture, interiors<br />and spatial strategy.</p><p>Dhaka \u00b7 Bangladesh</p></div>
  </aside>;
}

function WorksIndex({ slides }) {
  return <ProjectList projects={slides} />;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
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
    <header className="nav"><a className="brand" href="#top" aria-label="ree.design studio home">ree<span>.</span>design<br />studio</a><button className="menu-button" ref={menuButtonRef} onClick={() => setMenu(true)}>Menu <b>+</b></button></header>
    <Menu open={menu} close={() => setMenu(false)} closeRef={menuCloseRef} />
    <section className="hero" id="top" onPointerMove={handleHeroMove} onPointerLeave={event => { event.currentTarget.style.setProperty('--image-x', '0px'); event.currentTarget.style.setProperty('--image-y', '0px'); }}><div className="hero-image">{showHeroVideo && <video autoPlay muted loop playsInline preload="metadata"><source src="/video/hero.mp4" type="video/mp4" /></video>}<span className="hero-shine" aria-hidden="true" /></div></section>
    <section className="intro" id="about" aria-labelledby="about-heading">
      <div className="intro-grid intro-grid--top" aria-hidden="true" />
      <div className="intro-grid intro-grid--bottom" aria-hidden="true" />
      <div className="intro-brush" aria-hidden="true" />
      <div className="intro-halftone intro-halftone--top" aria-hidden="true" />
      <div className="intro-halftone intro-halftone--bottom" aria-hidden="true" />
      <div className="intro-tape intro-tape--one" aria-hidden="true" />
      <div className="intro-tape intro-tape--two" aria-hidden="true" />
      <p className="intro-index">01 — Who we are</p>
      <h2 className="intro-manifesto" id="about-heading"><span>We don’t design</span><span>in isolation.</span><span>We question, <i>connect</i></span><span>experiment, and build</span><span>design that matters.</span></h2>
      <button className="text-link" ref={aboutButtonRef} type="button" onClick={() => setAboutOpen(true)}>Read our story <span>↗</span></button>
    </section>
    <section className={`about-panel ${aboutOpen ? 'is-open' : ''}`} aria-hidden={!aboutOpen} inert={!aboutOpen} role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={() => setAboutOpen(false)} onKeyDown={trapFocus}><button className="about-close" ref={aboutCloseRef} type="button" onClick={() => setAboutOpen(false)}>Close <span>\u00d7</span></button><div className="about-panel-content"><p className="about-kicker" id="about-title">Who we are</p><div className="about-copy"><p>We are a multidisciplinary design consultancy shaping ideas into spaces, products, brands, and experiences.</p><p>We connect architecture, interiors, product, graphics, and branding through one cohesive design approach.</p><p>Based in Dhaka. Working across Bangladesh.</p></div><p className="about-dismiss" aria-hidden="true">Click anywhere to return</p></div></section>
    <section className="work" id="projects"><WorksIndex slides={projects} /></section>
    <section className="statement"><p className="eyebrow">OUR APPROACH</p><h2>Thoughtful design<br />is a form of <em>care.</em></h2><p className="statement-copy">Our work starts with listening. We look carefully at the character of a place, the people around it and the possibilities hidden in plain sight. Then, together, we make something lasting.</p></section>
    <section className="contact" id="contact"><p className="eyebrow">START A CONVERSATION</p><h2>Have a space<br />in <em>mind?</em></h2><a href="mailto:hello@ree.design" className="email">hello@ree.design <span>\u2197</span></a><div className="contact-bottom"><p>Dhaka, Bangladesh<br />Working everywhere</p><p>\u00a9 2026 ree.design studio</p><a href="#top">Back to top \u2191</a></div></section>
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
