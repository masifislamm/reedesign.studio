import React, { useEffect, useRef } from 'react';

const ProjectDetail = ({ project, projectIndex, projects, origin, onClose }) => {
  const panelRef = useRef(null);
  const cursorRef = useRef(null);
  const supportingImages = [
    project.image,
    projects[(projectIndex + 1) % projects.length].image,
    projects[(projectIndex + 2) % projects.length].image,
    projects[(projectIndex + 3) % projects.length].image,
  ];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const handleKey = event => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const moveCursor = event => {
    if (event.pointerType === 'touch') return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.setProperty('--detail-cursor-x', `${event.clientX + 4}px`);
    cursor.style.setProperty('--detail-cursor-y', `${event.clientY + 11}px`);
    cursor.classList.add('is-visible');
  };

  return (
    <div
      className="project-modal"
      role="presentation"
      style={{
        '--project-origin-x': `${origin?.x ?? window.innerWidth / 2}px`,
        '--project-origin-y': `${origin?.y ?? window.innerHeight / 2}px`,
      }}
      onClick={onClose}
    >
      <p className="project-modal__outside-note">Click outside to close</p>
      <article
        ref={panelRef}
        className="project-case"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-case-title"
        tabIndex="-1"
        onClick={event => event.stopPropagation()}
        onPointerMove={moveCursor}
        onPointerLeave={() => cursorRef.current?.classList.remove('is-visible')}
      >
        <span ref={cursorRef} className="project-case__cursor" aria-hidden="true">Scroll for more ↓</span>

        <section className="project-case__cover">
          <img src={supportingImages[0]} alt={`${project.name} project cover`} />
          <div className="project-case__cover-copy">
            <p>{String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} — {project.industry}</p>
            <h2 id="project-case-title">{project.name}</h2>
          </div>
          <span className="project-case__scroll-cue">Scroll<br />for more ↓</span>
        </section>

        <section className="project-case__intro">
          <p>Project overview</p>
          <h3>A focused exploration of form, material, proportion and the way an object shapes its surrounding space.</h3>
          <dl>
            <div><dt>Discipline</dt><dd>{project.industry}</dd></div>
            <div><dt>Studio</dt><dd>ree.design</dd></div>
            <div><dt>Location</dt><dd>Dhaka, Bangladesh</dd></div>
            <div><dt>Year</dt><dd>2026</dd></div>
          </dl>
        </section>

        <section className="project-case__gallery">
          {supportingImages.slice(1).map((image, index) => (
            <figure key={image} className={index === 1 ? 'is-wide' : ''}>
              <img src={image} alt={`${project.name} detail ${index + 1}`} />
              <figcaption>Study {String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </section>

        <footer className="project-case__footer">
          <p>End of project</p>
          <button type="button" onClick={onClose}>Close project ×</button>
        </footer>
      </article>
    </div>
  );
};

export default ProjectDetail;
