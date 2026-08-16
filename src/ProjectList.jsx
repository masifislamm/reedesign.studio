import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ProjectDetail from './ProjectDetail';

const ProjectSphere = lazy(() => import('./ProjectSphere'));

const ProjectList = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [mountSphere, setMountSphere] = useState(false);
  const [openProject, setOpenProject] = useState(null);
  const sectionRef = useRef(null);
  const mountedAt = useRef(0);

  const reveal = () => {
    const remaining = Math.max(0, 1050 - (performance.now() - mountedAt.current));
    window.setTimeout(() => setReady(true), remaining);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      mountedAt.current = performance.now();
      setMountSphere(true);
      observer.disconnect();
    }, { rootMargin: '300px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mountSphere) return undefined;
    const fallback = window.setTimeout(() => setReady(true), 1900);
    return () => window.clearTimeout(fallback);
  }, [mountSphere]);

  const active = projects[activeIndex] || projects[0];
  const showProject = useCallback((index, origin) => setOpenProject({ index, origin }), []);
  const closeProject = useCallback(() => setOpenProject(null), []);

  return (
    <div ref={sectionRef} className={`sphere-work ${ready ? 'is-ready' : ''}`} role="region" aria-labelledby="selected-work-title">
      <div className="sphere-work__intro" aria-hidden={ready}>
        <p>Selected work</p>
        <div className="sphere-work__loader"><span /></div>
        <span>Loading experience</span>
      </div>

      <header className="sphere-work__header">
        <p>02 — Portfolio</p>
        <h2 id="selected-work-title">Selected work</h2>
        <p className="sphere-work__instruction">Drag anywhere to rotate <span>↗</span></p>
      </header>

      <Suspense fallback={null}>
        {mountSphere ? <ProjectSphere projects={projects} onProjectSelect={setActiveIndex} onProjectOpen={showProject} onReady={reveal} /> : null}
      </Suspense>

      <div className="sphere-work__axis sphere-work__axis--horizontal" aria-hidden="true" />
      <div className="sphere-work__axis sphere-work__axis--vertical" aria-hidden="true" />

      <footer className="sphere-work__footer" aria-live="polite">
        <div className="sphere-work__counter">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <i />
          <span>{String(projects.length).padStart(2, '0')}</span>
        </div>
        <div className="sphere-work__project">
          <p>{active.industry}</p>
          <h3>{active.name}</h3>
        </div>
        <p className="sphere-work__tip">Click a card to select<br />Drag to keep exploring</p>
      </footer>
      {openProject !== null ? (
        <ProjectDetail
          project={projects[openProject.index]}
          projectIndex={openProject.index}
          projects={projects}
          origin={openProject.origin}
          onClose={closeProject}
        />
      ) : null}
    </div>
  );
};

export default ProjectList;
