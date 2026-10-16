import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { WorkGallery } from '../components/WorkGallery.tsx';
import { CtaBanner } from '../components/CtaBanner.tsx';

export const WorkPage: React.FC = () => {
  usePageMeta({
    title: "Work | Social, Video, Ads, Websites & Branding | Vyral Bee",
    description: "A look at the social, video, ad, website and brand projects Vyral Bee builds. Concept projects while client case studies are added.",
  });

  return (
    <>
      <PageHeader
        image="work"
        title="Work that shows what we can do."
        intro="A look at the kind of social, video, ad, website and brand projects we build. These are concept projects while client case studies are added."
      />
      <WorkGallery />
      <CtaBanner />
    </>
  );
};

export default WorkPage;
