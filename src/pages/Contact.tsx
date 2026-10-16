import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ContactPanel } from '../components/ContactPanel.tsx';

export const ContactPage: React.FC = () => {
  usePageMeta({
    title: "Contact Vyral Bee | Book a Free Strategy Call",
    description: "Tell us about your business and we'll reply within one working day with ideas and next steps. Email, phone or WhatsApp.",
  });

  return (
    <>
      <PageHeader
        image="contact"
        title="Let's talk about your brand."
        intro="Book a free strategy call or send us a few details. We reply within one working day."
      />
      <ContactPanel />
    </>
  );
};

export default ContactPage;
