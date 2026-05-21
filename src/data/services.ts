export type Service = {
  slug: string;
  number: string;
  title: string;
  description: string;
};

export const marketingServices: Service[] = [
  {
    slug: 'brand-strategy',
    number: 'S — 01',
    title: 'Brand Strategy and Identity',
    description:
      'Positioning, naming, visual identity, and messaging architecture built to differentiate your institution and resonate deeply.',
  },
  {
    slug: 'digital-marketing',
    number: 'S — 02',
    title: 'Digital Marketing and Performance',
    description:
      'SEO, paid search, display, and social advertising tracked and optimised with the rigour of a performance agency.',
  },
  {
    slug: 'enrollment-marketing',
    number: 'S — 03',
    title: 'Enrollment Marketing',
    description:
      'End-to-end admissions campaigns from awareness to CRM nurture flows. Turning inquiries into enrolled students.',
  },
  {
    slug: 'pr-media',
    number: 'S — 04',
    title: 'PR and Media Relations',
    description:
      'Regional press, education media, thought leadership, and reputation management in the headlines that matter.',
  },
  {
    slug: 'influencer-marketing',
    number: 'S — 05',
    title: 'Influencer and Community Marketing',
    description:
      'Parent community voices and education creators. We activate the trusted voices families actually listen to.',
  },
  {
    slug: 'social-media',
    number: 'S — 06',
    title: 'Social Media Management',
    description:
      'Content calendars, creative production, community management. Consistent and engaging across every channel.',
  },
];

export type SpaceService = Service & { pull: string };

export const spaceServices: SpaceService[] = [
  {
    slug: 'space-transformation',
    number: 'E — 01',
    title: 'Space Transformation',
    description:
      'We reimagine receptions, corridors, libraries, labs, and canteens into purposeful environments that inspire everyone who moves through them daily.',
    pull: 'Parents form their first impression within seconds. We make it unforgettable.',
  },
  {
    slug: 'branding-wayfinding',
    number: 'E — 02',
    title: 'Branding and Wayfinding',
    description:
      'Visual identity systems built into the physical fabric of your campus. Signage, typographic installations, and colour systems that create coherence and belonging.',
    pull: 'A campus that looks unified signals an institution that thinks clearly.',
  },
  {
    slug: 'learning-environments',
    number: 'E — 03',
    title: 'Learning and Discovery Environments',
    description:
      'Innovation labs, STEM zones, AI centres, and immersive learning corridors designed to ignite curiosity and make knowledge feel extraordinary every day.',
    pull: 'Students who feel inspired in their environment perform better and stay longer.',
  },
  {
    slug: 'new-campus-launch',
    number: 'E — 04',
    title: 'New Campus and Launch Planning',
    description:
      'For new institutions entering the market, we plan, design, and execute the full environmental experience from the ground up, ensuring you launch with maximum impact.',
    pull: 'First impressions at launch set the institutional tone for years to come.',
  },
];

export type CaseStudy = {
  year: string;
  client: string;
  title: string;
  description: string;
};

export const spaceCaseStudies: CaseStudy[] = [
  {
    year: '2025',
    client: 'GEMS School of Research and Innovation',
    title: 'Future-ready spaces built to spark creativity and discovery',
    description:
      "AI Tunnel, Centre of Excellence, and innovation zones that became cornerstones of GEMS SRI's mission and a point of pride for the whole community.",
  },
  {
    year: '2025',
    client: 'Arcadia British School, Dubai',
    title: 'A science corridor transformed into an immersive visual narrative',
    description:
      'Celebrating innovation, discovery, and student curiosity. Turning a functional hallway into a powerful statement about what learning looks and feels like.',
  },
  {
    year: '2023',
    client: 'GEMS New Millennium School',
    title: "Reimagining a legacy school's reception for a modern era",
    description:
      "A complete reception overhaul reflecting GEMS New Millennium's evolution without losing the heritage that defines its community.",
  },
];
