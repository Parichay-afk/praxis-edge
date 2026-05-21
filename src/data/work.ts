export type Project = {
  slug: string;
  title: string;
  alt: string;
  image: string;
  tags: string[];
  size?: 'tall' | 'wide';
  featured?: boolean;
};

// TODO (Phase 3): replace `image` URLs with self-hosted, optimized assets in /src/assets/work/.
// These are currently hot-linked from praxisadvertising.com's Webflow CDN.
export const projects: Project[] = [
  {
    slug: 'gems-sri',
    title: "GEMS SRI: Crafting Environments in the World's Finest School",
    alt: 'GEMS SRI',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/692474a98801cf4a3f18feab_GEMSSRI%20(1).webp',
    tags: ['Spaces', 'Innovation'],
    size: 'tall',
    featured: true,
  },
  {
    slug: 'tms-legacy',
    title: 'TMS: Celebrating Legacy Through Design and Storytelling',
    alt: 'The Millennium School',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/694169168e249ee07484f0dd_03%20TMS%20After%20copy.JPG',
    tags: ['Spaces', 'Legacy'],
    featured: true,
  },
  {
    slug: 'iim-dubai',
    title: 'IIM Dubai: Building an Enrollment Pipeline for Executive Education',
    alt: 'IIM Ahmedabad Dubai',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/6926841667f1f6659e966498_IIMA-18.jpg',
    tags: ['Marketing', 'Enrollment'],
    featured: true,
  },
  {
    slug: 'gwa-senior-school',
    title:
      'GWA Senior School: Designing Spaces for Purpose, Pathways and Global Citizenship',
    alt: 'GEMS World Academy Senior School',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/694a38f78e53560e50cd1d97_06%20GWA%202%20After%20copy.JPG',
    tags: ['Spaces', 'IB Framework'],
    size: 'wide',
    featured: true,
  },
  {
    slug: 'arcadia-corridors',
    title: 'Arcadia British School: Transforming Corridors Into Visual Narratives',
    alt: 'Arcadia British School',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/6926a737d0370bc418219d99_b31cad35dc9f.jpeg',
    tags: ['Spaces', 'Narrative'],
  },
  {
    slug: 'gems-new-millennium',
    title: 'GEMS New Millennium School: Reception Space Transformation',
    alt: 'GEMS New Millennium School',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/69267865d4b67194b991aee2_IMG_8932-2.jpg',
    tags: ['Spaces', 'Reception'],
  },
  {
    slug: 'gems-millennium-sharjah',
    title: 'GEMS Millennium Sharjah: Turning a Vision to Life',
    alt: 'GEMS Millennium Sharjah',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/6926b379ab46eb6d7ce2e6a6_IMG_1563.JPG',
    tags: ['Spaces', 'Community'],
  },
  {
    slug: 'gwa-dubai',
    title: 'GEMS World Academy Dubai: Turning Walls into Messaging Pillars',
    alt: 'GEMS World Academy Dubai',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/68d4842f892ddc49399f7352_gems-world-academy-cover.jpg',
    tags: ['Spaces', 'Multi-phase'],
    size: 'wide',
  },
  {
    slug: 'acer-dubai',
    title: "ACER: Designing a Global Education Brand's Regional HQ",
    alt: 'ACER Dubai',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/694937658eff0c25b574444f_IMG_2091%20copy.JPG',
    tags: ['Spaces', 'HQ Design'],
  },
  {
    slug: 'wis-legacy',
    title: 'WIS: Reimagining Legacy at Wellington International School',
    alt: 'Wellington International School',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/694a8d3bbd5700132bef3132_homepage-video-tn-960.jpg',
    tags: ['Spaces', 'Legacy'],
  },
  {
    slug: 'wellington-al-khail',
    title: 'Wellington Academy Al Khail: Making Learning Limitless',
    alt: 'Wellington Academy Al Khail',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/693ff25692db2623fc21f2d1_IMG_4222.JPG',
    tags: ['Spaces', 'Campus'],
  },
  {
    slug: 'wellington-silicon-oasis',
    title: 'Wellington Academy Silicon Oasis: Pathways to the Future',
    alt: 'Wellington Academy Silicon Oasis',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/694b90138918749d9e2c58c1_International_Schools_in_Dubai_I_Gems_Wellington_Academy.jpg',
    tags: ['Spaces', 'Campus'],
  },
  {
    slug: 'gems-modern-academy',
    title: 'GEMS Modern Academy: Crafting 20 Years of History',
    alt: 'GEMS Modern Academy',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/6926b237a12e87c4c664244d_10-IMG_9093%20Excellentia.JPG',
    tags: ['Spaces', 'Publications'],
  },
  {
    slug: 'cofad-branding',
    title: 'College of Fashion and Design: Branding and Launch',
    alt: 'College of Fashion and Design',
    image:
      'https://cdn.prod.website-files.com/68d4842f892ddc49399f731b/6925a726f04c128c482965c1_ia95hgf022qvc5naiqbf2hfryiv6.avif',
    tags: ['Branding', 'Launch'],
  },
];
