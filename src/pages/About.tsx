import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { AboutStory } from '../components/AboutStory.tsx';
import { IndustriesStrip } from '../components/IndustriesStrip.tsx';
import { CtaBanner } from '../components/CtaBanner.tsx';

export const AboutPage: React.FC = () => {
  usePageMeta({
    title: "About Vyral Bee | A Marketing Team That Works as Yours",
    description: "Meet the digital marketing team that combines strategy, design and performance marketing under one roof, so you don't manage five freelancers.",
  });

  return (
    <>
      <PageHeader
        image="about"
        title="The team behind brands people notice."
        intro="Vyral Bee is a digital marketing agency that plans, creates and runs your social media, design, video, website and ads as one connected system."
        actions={
          <Link
            to="/contact"
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gold px-8 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            Work with us
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />
      <AboutStory />
      <IndustriesStrip />
      <CtaBanner />
    </>
  );
};

export default AboutPage;
