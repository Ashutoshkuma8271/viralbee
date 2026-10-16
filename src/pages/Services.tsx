import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ServiceDeepDives } from '../components/ServiceDeepDives.tsx';
import { Faq } from '../components/Faq.tsx';
import { CtaBanner } from '../components/CtaBanner.tsx';
import { SERVICE_FAQS } from '../constants/faqs.ts';
import { SERVICES } from '../constants/content.ts';

const CHIPS = [
  { label: 'Social media', href: '#social-media' },
  { label: 'Branding & design', href: '#creative-design' },
  { label: 'Reels & video', href: '#reels-video' },
  { label: 'Websites', href: '#website-dev' },
  { label: 'Meta & Google ads', href: '#meta-google-ads' },
  { label: 'Lead generation', href: '#lead-gen' },
];

export const ServicesPage: React.FC = () => {
  usePageMeta({
    title: "Services: Social Media, Design, Web & Ads | Vyral Bee",
    description: "Six services under one roof: social media management, branding and design, Reels and video, websites, Meta and Google ads, and lead generation.",
  });

  return (
    <>
      <PageHeader
        image="services"
        title="Services that get your brand seen and chosen."
        intro={`${SERVICES.length} services, one team. Start with what you need now and add the rest as you grow.`}
        actions={
          <Link
            to="/contact"
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gold px-8 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            Get a free strategy call
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
        chips={CHIPS}
      />
      <ServiceDeepDives />
      <Faq items={SERVICE_FAQS} />
      <CtaBanner />
    </>
  );
};

export default ServicesPage;
