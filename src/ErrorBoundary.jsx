import React from 'react';

export function ErrorScreen({ onRetry }) {
  return <main className="error-screen" role="main">
    <div className="error-screen__top">
      <a className="brand error-screen__brand" href="/" aria-label="ree.design studio home">ree<span>.</span>design<br />studio</a>
      <p>System notice · 500</p>
    </div>
    <div className="error-screen__mark" aria-hidden="true">
      <span>!</span>
    </div>
    <section className="error-screen__content" aria-labelledby="error-title">
      <p className="error-screen__eyebrow">Something shifted</p>
      <h1 id="error-title">This space didn’t<br />load as planned.</h1>
      <p className="error-screen__copy">The site encountered a temporary problem. Your browser and device are safe.</p>
      <div className="error-screen__actions">
        <button type="button" onClick={onRetry}>Try again <span>↻</span></button>
        <a href="/">Return home <span>↗</span></a>
      </div>
    </section>
    <p className="error-screen__foot">REE.DESIGN STUDIO · DHAKA, BANGLADESH</p>
  </main>;
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Application render error', error, info);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) return <ErrorScreen onRetry={this.handleRetry} />;
    return this.props.children;
  }
}
