import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { PackageTiers } from '../components/PackageTiers.tsx';
import { ComparePlans } from '../components/ComparePlans.tsx';
import { Faq } from '../components/Faq.tsx';
import { CtaBanner } from '../components/CtaBanner.tsx';
import { PACKAGE_FAQS } from '../constants/faqs.ts';

export const PackagesPage: React.FC = () => {
  usePageMeta({
    title: "Packages | Starter, Growth & Premium | Vyral Bee",
    description: "Three marketing packages that grow with your business: Starter, Growth and Premium. Priced to your goals and budget.",
  });

  return (
    <>
      <PageHeader
        image="packages"
        title="Packages that grow with your business."
        intro="Pick the plan that fits where you are today. Each one is priced to your goals, and you can move up as results come in."
      />
      <PackageTiers />
      <ComparePlans />
      <Faq items={PACKAGE_FAQS} />
      <CtaBanner />
    </>
  );
};

export default PackagesPage;
