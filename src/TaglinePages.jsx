import { useEffect, useRef, useState } from 'react';

const taglines = [
  'Give the idea an identity.',
  'Give the idea a place.',
  'Shape how it feels.',
  'Make the idea tangible.',
  'Make the idea visible.',
  'Turn design into reality.',
  'Design what people remember.',
];

export default function TaglinePages({ onExit }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('down');
  const gesture = useRef({ x: 0, y: 0, moved: false });
  const wheelLocked = useRef(false);
  const wheelDistance = useRef(0);

  const showPage = (nextIndex) => {
    const wrappedIndex = (nextIndex + taglines.length) % taglines.length;
    if (wrappedIndex === activeIndex) return;
    setActiveIndex(wrappedIndex);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') { setDirection('down'); showPage(activeIndex + 1); }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') { setDirection('up'); showPage(activeIndex - 1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  const handleWheel = (event) => {
    wheelDistance.current += event.deltaY;
    if (Math.abs(wheelDistance.current) < 35 || wheelLocked.current) return;
    const goingDown = wheelDistance.current > 0;
    wheelDistance.current = 0;
    wheelLocked.current = true;
    setDirection(goingDown ? 'down' : 'up');
    showPage(activeIndex + (goingDown ? 1 : -1));
    window.setTimeout(() => { wheelLocked.current = false; }, 280);
  };
  const handlePointerDown = (event) => {
    gesture.current = { x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const handlePointerMove = (event) => {
    if (Math.hypot(event.clientX - gesture.current.x, event.clientY - gesture.current.y) > 10) gesture.current.moved = true;
  };
  const handlePointerUp = (event) => {
    const distanceX = event.clientX - gesture.current.x;
    const distanceY = event.clientY - gesture.current.y;
    const primaryDistance = Math.abs(distanceY) >= Math.abs(distanceX) ? distanceY : distanceX;
    if (gesture.current.moved && Math.abs(primaryDistance) > 45) {
      setDirection(primaryDistance < 0 ? 'down' : 'up');
      showPage(activeIndex + (primaryDistance < 0 ? 1 : -1));
      return;
    }
    if (!gesture.current.moved) onExit?.();
  };

  return <div className="tagline-slider" aria-label="Our approach principles" aria-roledescription="carousel" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
    <p className="tagline-page__count">{String(activeIndex + 1).padStart(2, '0')} / 07</p>
    <p className="tagline-slider__hint">Scroll or swipe</p>
    <figure className="tagline-page__visual" aria-hidden="true">
      {taglines.map((tagline, index) => <img className={index === activeIndex ? 'is-active' : ''} key={tagline} src={`/images/projects/project-${String(index + 1).padStart(2, '0')}.jpg`} alt="" />)}
    </figure>
    <div className={`tagline-stage__title tagline-stage__title--${direction}`} key={activeIndex} aria-live="polite"><h2>{taglines[activeIndex]}</h2></div>
    <div className="tagline-slider__dots" aria-hidden="true">{taglines.map((tagline, index) => <span className={index === activeIndex ? 'is-active' : ''} key={tagline} />)}</div>
  </div>;
}
