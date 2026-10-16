import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout.tsx';
import { lazyWithRetry } from './lib/lazyWithRetry.ts';
import Home from './pages/Home.tsx';

// Code-split pages with React.lazy for on-demand bundle loading
const About = lazyWithRetry(() => import('./pages/About.tsx'));
const Services = lazyWithRetry(() => import('./pages/Services.tsx'));
const Process = lazyWithRetry(() => import('./pages/Process.tsx'));
const Work = lazyWithRetry(() => import('./pages/Work.tsx'));
const Packages = lazyWithRetry(() => import('./pages/Packages.tsx'));
const Contact = lazyWithRetry(() => import('./pages/Contact.tsx'));
const Privacy = lazyWithRetry(() => import('./pages/Privacy.tsx'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound.tsx'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<Process />} />
          <Route path="/work" element={<Work />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
