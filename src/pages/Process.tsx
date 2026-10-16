import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ProcessTimeline } from '../components/ProcessTimeline.tsx';
import { FirstMonth } from '../components/FirstMonth.tsx';
import { Faq } from '../components/Faq.tsx';
import { CtaBanner } from '../components/CtaBanner.tsx';
import { PROCESS_FAQS } from '../constants/faqs.ts';

export const ProcessPage: React.FC = () => {
  usePageMeta({
    title: "Our Process | How Vyral Bee Works, Step by Step",
    description: "A clear six-step cycle that repeats every month, and what your first month looks like from kick-off call to first report.",
  });

  return (
    <>
      <PageHeader
        image="process"
        title="How we work, step by step."
        intro="A clear six-step cycle that repeats every month, and a first month that gets you from kick-off call to first report."
        actions={
          <Link
            to="/contact"
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gold px-8 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            Start with a call
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />
      <ProcessTimeline />
      <FirstMonth />
      <Faq items={PROCESS_FAQS} />
      <CtaBanner />
    </>
  );
};

export default ProcessPage;
