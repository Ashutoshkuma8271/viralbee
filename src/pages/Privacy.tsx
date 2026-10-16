import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { BRAND } from '../constants/content.ts';

// DRAFT: written from what this site actually collects. The business owner (and ideally a lawyer) must review it
// before launch, and replace the bracketed items once the real details are known.
const UPDATED = '14 October 2026';

const SECTIONS = [
  {
    title: 'What we collect',
    body: [
      'When you use the contact form we collect the details you type in: your name, business name (optional), email address, phone or WhatsApp number, the service you are interested in, and your message.',
      'If you email, call or message us on WhatsApp, we keep the details you share in that conversation.',
    ],
  },
  {
    title: 'Why we collect it',
    body: [
      'We use your details only to reply to your enquiry, prepare a proposal, and manage the work if you become a client. We do not sell your details and we do not use them for unrelated marketing.',
    ],
  },
  {
    title: 'Who can see it',
    body: [
      `Your enquiry is received by the ${BRAND.shortName} team. If the contact form is connected to a form service, that service processes the message on our behalf [owner: name the service here, for example Formspree or Web3Forms]. WhatsApp messages are handled by WhatsApp under its own terms.`,
    ],
  },
  {
    title: 'Cookies and analytics',
    body: [
      'This website does not set advertising cookies. [Owner: if you add Google Analytics, Meta Pixel or similar, list it here and add a cookie notice before it goes live.]',
    ],
  },
  {
    title: 'How long we keep it',
    body: ['[Owner: state a period, for example "up to 24 months after our last contact", unless the law requires longer.]'],
  },
  {
    title: 'Your choices',
    body: [
      `You can ask us at any time to see, correct or delete the personal details we hold about you. Email ${BRAND.contact.email} and we will respond within a reasonable time.`,
    ],
  },
];

export const Privacy: React.FC = () => {
  usePageMeta({
    title: 'Privacy Policy | Vyral Bee',
    description: 'What personal details Vyral Bee collects through this website, why, and how you can ask us to correct or delete them.',
  });

  return (
    <section className="bg-ink pb-24 pt-32 sm:pb-32 lg:pt-40">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h1 className="max-w-[10ch] font-display text-fluid-h2 font-semibold text-white">Privacy policy</h1>
          <p className="mt-6 text-base text-white/60">Last updated {UPDATED}</p>
        </div>

        <div className="lg:col-span-8">
          <p className="max-w-2xl text-lg leading-relaxed text-white/75">
            We only collect what we need to answer your enquiry and do the work you ask for. Here is exactly what that means.
          </p>
          <div className="mt-10 divide-y divide-white/12 border-y border-white/12">
            {SECTIONS.map((section) => (
              <section key={section.title} className="py-8">
                <h2 className="font-display text-2xl font-semibold text-white">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-base text-white/70">
            Questions about this policy? Write to{' '}
            <a className="font-semibold text-gold underline-offset-4 hover:underline" href={`mailto:${BRAND.contact.email}`}>
              {BRAND.contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
