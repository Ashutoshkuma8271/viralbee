// Vyral Bee Content & Configuration Constants
// Real copy and configuration - edit placeholders before production deployment

export const BRAND = {
  name: "VYRAL BEE",
  shortName: "Vyral Bee",
  tagline: "CREATE • CONNECT • CONVERT",
  positioning: "We Make Brands Visible.",
  subheadline:
    "Vyral Bee is a creative digital marketing agency helping businesses build a strong online presence, attract the right audience, and generate measurable growth.",
  aboutHeading: "Who Is Vyral Bee",
  // Home About teaser headline: the statement, then the line that brightens as you scroll
  aboutHeadline: {
    lead: "One team for your social, website and ads.",
    follow: "Working as yours.",
  },
  aboutCopy:
    "We work as an extension of your team — combining strategy, design, and performance marketing under one roof, so you don't have to manage five different freelancers to get consistent results.",
  
  // Contact & Social placeholders (customizable by client)
  contact: {
    phone: "+91 85128 77877",
    phoneDisplay: "+91 85128 77877",
    email: "info@akirafresh.in",
    website: __SITE_URL__, // set in vite.config.ts
    whatsapp: "https://wa.me/918512877877?text=Hello%20Vyral%20Bee%2C%20I%20would%20like%20to%20grow%20my%20brand%21",
    location: "R-18, Vikas Marg, Laxmi Nagar, Near Nirman Vihar Metro Station, Pillar No. 48, New Delhi, Delhi – 110092, India",
    // The same address split for display
    addressLines: [
      "R-18, Vikas Marg, Laxmi Nagar",
      "Near Nirman Vihar Metro Station, Pillar No. 48", // non-breaking spaces keep "Pillar No. 48" together
      "New Delhi, Delhi – 110092, India",
    ],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=R-18%2C%20Vikas%20Marg%2C%20Laxmi%20Nagar%2C%20New%20Delhi%20110092",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM",
  },

  socials: {
    instagram: "https://www.instagram.com/vyralbee/",
    facebook: "https://facebook.com/vyralbee",
    linkedin: "https://linkedin.com/company/vyralbee",
    whatsapp: "https://wa.me/918512877877",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

export const STATS = [
  { value: "6", label: "Services under one roof", detail: "Social, design, video, web, ads and strategy" },
  { value: "8+", label: "Industries served", detail: "From cafés to manufacturers" },
  { value: "6-step", label: "Delivery process", detail: "Discover to optimise, every month" },
  { value: "1", label: "Point of contact", detail: "A dedicated account manager" },
];

export const SERVICES = [
  {
    id: "social-media",
    image: "social",
    platforms: ["instagram", "facebook", "linkedin", "youtube"],
    title: "Social Media Management",
    description: "Strategy, content, and community management across platforms that turn casual scrollers into engaged brand advocates.",
    icon: "Share2",
    badge: "Instagram, Facebook, LinkedIn",
    color: "#F2A516",
  },
  {
    id: "creative-design",
    image: "design",
    platforms: ["figma", "instagram", "linkedin"],
    title: "Creative & Graphic Design",
    description: "Distinctive brand identity, design templates, and promotional creatives that demand attention and set you apart.",
    icon: "Palette",
    badge: "Logos, brand kits, creatives",
    color: "#F7BA4A",
  },
  {
    id: "reels-video",
    image: "video",
    platforms: ["instagram", "youtube", "facebook"],
    title: "Reels & Video Content",
    description: "High-impact short-form video crafted purposefully for maximum organic reach, viewer retention, and engagement.",
    icon: "Video",
    badge: "Reels, Shorts, edits",
    color: "#F2A516",
  },
  {
    id: "website-dev",
    image: "web",
    platforms: ["whatsapp", "searchconsole", "analytics"],
    title: "Website Design & Development",
    description: "High-converting, mobile-responsive business and corporate websites built to turn visitors into paying clients.",
    icon: "Globe",
    badge: "Business sites, landing pages",
    color: "#F7BA4A",
  },
  {
    id: "meta-google-ads",
    image: "ads",
    platforms: ["meta", "googleads", "instagram", "youtube"],
    title: "Meta & Google Ads",
    description: "Data-driven performance campaigns meticulously built to capture high-intent enquiries and maximize ROAS.",
    icon: "TrendingUp",
    badge: "Meta, Google, retargeting",
    color: "#F2A516",
  },
  {
    id: "lead-gen",
    image: "growth",
    platforms: ["analytics", "meta", "googleads", "whatsapp"],
    title: "Digital Marketing & Lead Gen",
    description: "Full-funnel digital marketing strategies explicitly tied to tangible business revenue and customer acquisition.",
    icon: "Target",
    badge: "Funnels, leads, reporting",
    color: "#F7BA4A",
  },
];

// Words in the gold ticker under the hero
export const MARQUEE_ITEMS = [
  "Social Media",
  "Branding & Design",
  "Reels & Video",
  "Websites",
  "Meta Ads",
  "Google Ads",
  "Lead Generation",
  "Content Strategy",
];

// Hero slider: one slide per service. Images live in /public/images/hero as {image}-1920.webp and {image}-900.webp.
// The headline renders as `lead` + serif `accent` + `tail`.
export const HERO_SLIDES = [
  {
    id: "social-media",
    label: "Social Media",
    lead: "Social content people",
    accent: "stop scrolling",
    tail: "for.",
    description: "Strategy, content calendars and community management that build a following which actually buys.",
    image: "social-phone",
    // Phones crop to the centre; keep the hand and phone (right of the photo) in view
    position: "72% 50%",
    alt: "Person in a white shirt scrolling through a feed on a smartphone",
  },
  {
    id: "creative-design",
    label: "Branding & Design",
    lead: "Design that makes your brand",
    accent: "unmistakable.",
    tail: "",
    description: "Logos, identity systems and campaign creatives with one consistent look across every touchpoint.",
    image: "design",
    alt: "Designer drawing on a graphics tablet beside colour swatches and a laptop",
  },
  {
    id: "reels-video",
    label: "Reels & Video",
    lead: "Short-form video, made for",
    accent: "reach.",
    tail: "",
    description: "Scripted, shot and edited Reels and Shorts that hold attention past the first three seconds.",
    image: "video",
    alt: "Film clapperboard held up on set, ready for the next take",
  },
  {
    id: "website-dev",
    label: "Websites",
    lead: "Websites that turn",
    accent: "visitors into clients.",
    tail: "",
    description: "Fast, mobile-first business sites and landing pages with WhatsApp and enquiry forms built in.",
    image: "web",
    alt: "Large monitor showing a set of mobile app and website designs",
  },
  {
    id: "meta-google-ads",
    label: "Meta & Google Ads",
    lead: "Ads that bring",
    accent: "enquiries,",
    tail: "not just clicks.",
    description: "Meta and Google campaigns built around cost per lead, tested weekly and scaled when they work.",
    image: "ads",
    alt: "Laptop on a desk showing an analytics dashboard with charts",
  },
  {
    id: "lead-gen",
    label: "Growth Strategy",
    lead: "Marketing measured in",
    accent: "revenue.",
    tail: "",
    description: "One team planning your funnel end to end, from the first impression to the closed enquiry.",
    image: "growth",
    alt: "Marketing team planning a campaign around a whiteboard of sticky notes",
  },
];

export const SOCIAL_MEDIA_DEEP_DIVE = {
  brandingCreative: [
    "Logo design & visual brand guides",
    "Comprehensive brand identity systems",
    "Custom social media templates (Canva/Figma)",
    "Brochures & sales deck collateral",
    "Professional company profiles",
    "High-converting promotional creatives",
    "Product packaging & label creatives",
  ],
  contentManagement: [
    "Omnichannel content strategy & positioning",
    "Monthly strategic content calendars",
    "Custom post & high-engagement carousel design",
    "High-impact Reels & Shorts production",
    "Data-backed captions & hashtag research",
    "Scheduled posting & prime-time distribution",
    "Active audience & community management",
    "Monthly analytics, KPI breakdown & reporting",
  ],
};

export const WEBSITES_AND_ADS_DEEP_DIVE = {
  websites: [
    "Modern business websites & corporate portals",
    "Dedicated high-converting landing pages",
    "100% mobile-responsive, ultra-fast layouts",
    "Instant WhatsApp click-to-chat integration",
    "Custom contact & lead capture forms",
    "Basic on-page SEO & speed optimization",
  ],
  paidAdvertising: {
    tagline: "Reach the right audience. Generate enquiries. Scale what works.",
    features: [
      "Meta Ads (Facebook & Instagram feed/stories/reels)",
      "Google Search, Display & Performance Max Ads",
      "Targeted lead generation & enquiry funnels",
      "Dynamic retargeting & audience lookalikes",
      "Continuous A/B testing & campaign optimization",
      "Transparent cost-per-lead tracking & weekly reports",
    ],
  },
};

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    description: "We deep-dive into your business model, target audience, competitive landscape, and primary growth goals.",
    icon: "Search",
  },
  {
    step: "02",
    title: "Strategize",
    description: "We engineer a bespoke roadmap combining tailored messaging, creative angles, platform channels, and KPIs.",
    icon: "Compass",
  },
  {
    step: "03",
    title: "Create",
    description: "Our studio designs thumb-stopping creatives, video scripts, ad copy, and high-performance landing pages.",
    icon: "Sparkles",
  },
  {
    step: "04",
    title: "Publish",
    description: "We deploy planned content calendars and launch precision-targeted ad campaigns during peak audience activity.",
    icon: "Send",
  },
  {
    step: "05",
    title: "Analyze",
    description: "We track live performance metrics, enquiry quality, user engagement, and conversion efficiency.",
    icon: "BarChart3",
  },
  {
    step: "06",
    title: "Optimize",
    description: "We iterate on winning creative variations, scale top ad sets, and continuously compound your return on investment.",
    icon: "Zap",
  },
];

// About page: what a new client's first month looks like (owner to confirm the details)
export const FIRST_MONTH = [
  {
    week: "Week 1",
    title: "Discovery and audit",
    points: ["Kick-off call with your team", "Audit of your social, website and ads", "Competitor and audience review"],
  },
  {
    week: "Week 2",
    title: "Strategy and plan",
    points: ["Goals and KPIs agreed in writing", "Content calendar for the month", "Ad and channel plan with budget"],
  },
  {
    week: "Week 3",
    title: "Create and approve",
    points: ["Posts, Reels and ad creatives produced", "One round of feedback built in", "Landing pages and tracking set up"],
  },
  {
    week: "Week 4",
    title: "Launch and report",
    points: ["Content scheduled and ads live", "First performance report", "Next month's priorities agreed"],
  },
];

export const INDUSTRIES = [
  { name: "Restaurants & Cafés", icon: "UtensilsCrossed", desc: "Mouth-watering visual content & footfall campaigns" },
  { name: "Retail Businesses", icon: "ShoppingBag", desc: "Product highlights, festive sales & local reach" },
  { name: "Manufacturers", icon: "Factory", desc: "B2B lead generation & industrial brand positioning" },
  { name: "Real Estate", icon: "Building2", desc: "Property showcase video tours & high-intent buyer leads" },
  { name: "Healthcare", icon: "HeartPulse", desc: "Patient trust-building & clinic appointment campaigns" },
  { name: "Education", icon: "GraduationCap", desc: "Admissions generation & student engagement programs" },
  { name: "Professional Services", icon: "Briefcase", desc: "Authority branding for legal, finance & consultants" },
  { name: "Startups & SMEs", icon: "Rocket", desc: "Rapid brand launch, testing & scalable customer growth" },
];

export const WHY_CHOOSE_US = [
  {
    title: "Business-focused strategy",
    usual: "Chasing likes and vanity metrics",
    description: "We don't chase vanity metrics. Every post, ad, and design is engineered to drive tangible business inquiries and growth.",
    icon: "Briefcase",
  },
  {
    title: "Creative content that fits your brand",
    usual: "Generic templates reused for every client",
    description: "No generic templates. Everything is custom-designed to match your distinct brand tone, colors, and personality.",
    icon: "Palette",
  },
  {
    title: "Consistent brand presence",
    usual: "Posting whenever someone remembers",
    description: "We maintain disciplined publishing schedules and cohesive styling across all social and digital customer touchpoints.",
    icon: "CalendarCheck",
  },
  {
    title: "Transparent communication",
    usual: "Jargon, vague updates and surprises",
    description: "Zero marketing jargon or hidden surprises. You get straightforward updates, clear milestones, and honest reporting.",
    icon: "MessageSquareText",
  },
  {
    title: "Performance tracking & reporting",
    usual: "Reports full of numbers that mean nothing",
    description: "Monthly analytics reports with actionable insights showing reach, clicks, leads generated, and return on spend.",
    icon: "LineChart",
  },
  {
    title: "Customized packages",
    usual: "One fixed plan, whatever your business",
    description: "Flexible service tiers tailored specifically to your stage of business, budget, and ambitious growth targets.",
    icon: "Layers",
  },
  {
    title: "One agency for social, web & ads",
    usual: "Five freelancers who never talk to each other",
    description: "Enjoy complete alignment. Say goodbye to miscommunication between disconnected designers, web developers, and media buyers.",
    icon: "ShieldCheck",
  },
  {
    title: "Dedicated account management",
    usual: "A different person every time you call",
    description: "A single dedicated point of contact who understands your business inside out and responds promptly to your needs.",
    icon: "UserCheck",
  },
];

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Artisan Café Brand Elevation",
    category: "Social",
    label: "Concept / Demo Project",
    image: "cafe",
    description: "Cohesive aesthetic grid, appetite-inducing photography styling, and local engagement campaign.",
    stats: "+320% Organic Reach",
  },
  {
    id: 2,
    title: "Viral Lifestyle Brand Reel Series",
    category: "Reels",
    label: "Concept / Demo Project",
    image: "reels",
    description: "High-paced trending audio formats with kinetic typography and seamless product transitions.",
    stats: "1.4M+ Video Views",
  },
  {
    id: 3,
    title: "High-Intent Meta Lead Generation",
    category: "Ads",
    label: "Concept / Demo Project",
    image: "ads",
    description: "Hyper-targeted lead form funnels capturing verified contact inquiries with automated CRM handoff.",
    stats: "4.8x Return on Ad Spend",
  },
  {
    id: 4,
    title: "Modern Corporate Web Platform",
    category: "Websites",
    label: "Concept / Demo Project",
    image: "web",
    description: "Ultra-fast Next.js architecture featuring interactive service configurator and instant WhatsApp booking.",
    stats: "68% Conversion Uplift",
  },
  {
    id: 5,
    title: "Luxury Real Estate Identity & Collateral",
    category: "Branding",
    label: "Concept / Demo Project",
    image: "brand",
    description: "Comprehensive corporate identity, gold-embossed brochure decks, and prestige social assets.",
    stats: "Complete Brand Suite",
  },
  {
    id: 6,
    title: "Fitness & Wellness Apparel Campaign",
    category: "Social",
    label: "Concept / Demo Project",
    image: "fitness",
    description: "Dynamic carousel designs educating followers on functional performance fabrics.",
    stats: "28k+ Saves & Shares",
  },
];

export const PRICING_PACKAGES = [
  {
    name: "Starter",
    tagline: "Essential social presence for emerging businesses",
    popular: false,
    badge: "Essential",
    features: [
      { name: "Social Media Management", included: true },
      { name: "Static Posts", included: true },
      { name: "Content Strategy", included: true },
      { name: "Reels Production", included: false },
      { name: "Ads Management", included: false },
      { name: "Website", included: "Add-on" },
      { name: "Monthly Reporting", included: true },
    ],
    highlight: "Great for building a credible, active baseline",
  },
  {
    name: "Growth",
    tagline: "Full-throttle social & video reach for scaling brands",
    popular: true,
    badge: "Most Popular",
    features: [
      { name: "Social Media Management", included: true },
      { name: "Static Posts", included: true },
      { name: "Content Strategy", included: true },
      { name: "Reels Production", included: true },
      { name: "Ads Management", included: true },
      { name: "Website", included: "Add-on" },
      { name: "Monthly Reporting", included: true },
    ],
    highlight: "Our highest-converting complete growth stack",
  },
  {
    name: "Premium",
    tagline: "Comprehensive 360° digital dominance & website suite",
    popular: false,
    badge: "Full Suite",
    features: [
      { name: "Social Media Management", included: true },
      { name: "Static Posts", included: true },
      { name: "Content Strategy", included: true },
      { name: "Reels Production", included: true },
      { name: "Ads Management", included: true },
      { name: "Website", included: true },
      { name: "Monthly Reporting", included: true },
    ],
    highlight: "Dedicated omnichannel strategy and bespoke website",
  },
];
