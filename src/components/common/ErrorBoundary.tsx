import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../constants/content.ts';

interface Props {
  children: React.ReactNode;
}
interface State {
  failed: boolean;
}

/** Catches a crash while a page is drawing and shows a calm recovery screen instead of a blank page. */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    // Kept in the browser console so it shows up when someone tests the site; add a reporting service here later.
    console.error('Page error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="flex min-h-[70svh] items-center bg-ink py-20" role="alert">
        <div className="shell">
          <h1 className="max-w-[18ch] font-display text-fluid-h2 font-semibold text-white">Something went wrong on our side.</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            The page could not load properly. Try again, or go back home. If it keeps happening, email{' '}
            <a className="font-semibold text-gold underline-offset-4 hover:underline" href={`mailto:${BRAND.contact.email}`}>
              {BRAND.contact.email}
            </a>
            .
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-14 cursor-pointer items-center justify-center rounded-full bg-gold px-8 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
            >
              Try again
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ failed: false })}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }
}
