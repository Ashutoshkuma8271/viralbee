import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { Hero } from '../components/Hero.tsx';
import { About } from '../components/About.tsx';
import { ServicesOverview } from '../components/ServicesOverview.tsx';
import { ProcessPreview } from '../components/ProcessPreview.tsx';
import { WorkPreview } from '../components/WorkPreview.tsx';
import { WhyChooseUs } from '../components/WhyChooseUs.tsx';
import { CtaBanner } from '../components/CtaBanner.tsx';
import { StatementScene } from '../components/StatementScene.tsx';
import { Deferred } from '../components/common/Deferred.tsx';

export const Home: React.FC = () => {
  usePageMeta({
    title: "Vyral Bee | Digital Marketing Agency for Social, Web & Ads",
    description: "Vyral Bee plans, creates and runs your social media, design, video, website and ads as one system, so your brand gets seen and chosen.",
  });

  return (
    <>
      <Hero />
      <ServicesOverview />
      {/* Everything below is built just before it is scrolled near, so the first screen shows sooner on phones */}
      <Deferred minHeight="200svh">
        <StatementScene />
      </Deferred>
      <Deferred>
        <About />
      </Deferred>
      <Deferred minHeight="150svh">
        <WorkPreview />
      </Deferred>
      <Deferred minHeight="150svh">
        <ProcessPreview />
      </Deferred>
      <Deferred>
        <WhyChooseUs />
      </Deferred>
      <Deferred minHeight="60svh">
        <CtaBanner />
      </Deferred>
    </>
  );
};

export default Home;
