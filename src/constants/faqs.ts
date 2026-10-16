/**
 * Frequently asked questions per page. Every answer only repeats facts already stated elsewhere on the site
 * (packages, process, contact). Owner: review the wording, and add answers about prices, contracts or timings
 * only once they are confirmed.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const PACKAGE_FAQS: FaqItem[] = [
  {
    q: 'How much do the packages cost?',
    a: 'Every plan is priced to your goals and budget, so we quote after a free call. You see the quote before anything starts, and nothing begins until you approve it.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Each plan builds on the one before it, so you can move up any time as results come in.',
  },
  {
    q: 'Can I add a website to Starter or Growth?',
    a: 'Yes. A website can be added to Starter or Growth, and it is already included in Premium.',
  },
  {
    q: 'How will I know it is working?',
    a: 'Every plan includes a monthly report showing reach, clicks, leads and return on spend, in plain language, with the next month’s priorities agreed together.',
  },
  {
    q: 'What happens after I get in touch?',
    a: 'We come back within one working day. After a free call we recommend a plan and send a quote, and we start once you approve it.',
  },
];

export const SERVICE_FAQS: FaqItem[] = [
  {
    q: 'Do I need to take all six services?',
    a: 'No. Start with what you need now and add the rest as you grow. Because one team runs everything, new services slot in without starting over.',
  },
  {
    q: 'Who will I be dealing with?',
    a: 'One dedicated account manager who knows your business and is your single point of contact for social, design, video, website and ads.',
  },
  {
    q: 'Do you use templates?',
    a: 'No. Posts, videos, websites and ads are designed to match your brand’s tone, colours and personality.',
  },
  {
    q: 'Which platforms do you work on?',
    a: 'Instagram, Facebook, LinkedIn and YouTube for social and video, and Meta and Google for paid ads.',
  },
  {
    q: 'Which industries do you work with?',
    a: 'Restaurants and cafés, retail, manufacturers, real estate, healthcare, education, professional services, and startups and small businesses.',
  },
];

export const PROCESS_FAQS: FaqItem[] = [
  {
    q: 'What happens in the first month?',
    a: 'Week 1 is discovery and an audit, week 2 the strategy and content plan, week 3 creating and approving the work, and week 4 launch and your first report.',
  },
  {
    q: 'Do I get to approve the work?',
    a: 'Yes. Posts, Reels and ad creatives are shared for approval before they go live, with one round of feedback built in.',
  },
  {
    q: 'How are goals set?',
    a: 'In week 2 we agree goals and KPIs with you in writing, so everyone knows what success looks like.',
  },
  {
    q: 'What happens after the first month?',
    a: 'The six-step cycle repeats every month: we review the results, agree the next priorities, and keep improving what works.',
  },
];
