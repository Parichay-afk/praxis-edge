import type { ImageMetadata } from 'astro';

import gemsSri from '../assets/work/gems-sri.webp';
import tmsLegacy from '../assets/work/tms-legacy.jpg';
import iimDubai from '../assets/work/iim-dubai.jpg';
import gwaSeniorSchool from '../assets/work/gwa-senior-school.jpg';
import arcadiaCorridors from '../assets/work/arcadia-corridors.jpeg';
import gemsNewMillennium from '../assets/work/gems-new-millennium.jpg';
import gemsMillenniumSharjah from '../assets/work/gems-millennium-sharjah.jpg';
import gwaDubai from '../assets/work/gwa-dubai.jpg';
import acerDubai from '../assets/work/acer-dubai.jpg';
import wisLegacy from '../assets/work/wis-legacy.jpg';
import wellingtonAlKhail from '../assets/work/wellington-al-khail.jpg';
import wellingtonSiliconOasis from '../assets/work/wellington-silicon-oasis.jpg';
import gemsModernAcademy from '../assets/work/gems-modern-academy.jpg';
import cofadBranding from '../assets/work/cofad-branding.avif';

export type Project = {
  slug: string;
  title: string;
  alt: string;
  image: ImageMetadata;
  tags: string[];
  size?: 'tall' | 'wide';
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'gems-sri',
    title: "GEMS SRI: Crafting Environments in the World's Finest School",
    alt: 'GEMS SRI',
    image: gemsSri,
    tags: ['Spaces', 'Innovation'],
    size: 'tall',
    featured: true,
  },
  {
    slug: 'tms-legacy',
    title: 'TMS: Celebrating Legacy Through Design and Storytelling',
    alt: 'The Millennium School',
    image: tmsLegacy,
    tags: ['Spaces', 'Legacy'],
    featured: true,
  },
  {
    slug: 'iim-dubai',
    title: 'IIM Dubai: Building an Enrollment Pipeline for Executive Education',
    alt: 'IIM Ahmedabad Dubai',
    image: iimDubai,
    tags: ['Marketing', 'Enrollment'],
    featured: true,
  },
  {
    slug: 'gwa-senior-school',
    title:
      'GWA Senior School: Designing Spaces for Purpose, Pathways and Global Citizenship',
    alt: 'GEMS World Academy Senior School',
    image: gwaSeniorSchool,
    tags: ['Spaces', 'IB Framework'],
    size: 'wide',
    featured: true,
  },
  {
    slug: 'arcadia-corridors',
    title: 'Arcadia British School: Transforming Corridors Into Visual Narratives',
    alt: 'Arcadia British School',
    image: arcadiaCorridors,
    tags: ['Spaces', 'Narrative'],
  },
  {
    slug: 'gems-new-millennium',
    title: 'GEMS New Millennium School: Reception Space Transformation',
    alt: 'GEMS New Millennium School',
    image: gemsNewMillennium,
    tags: ['Spaces', 'Reception'],
  },
  {
    slug: 'gems-millennium-sharjah',
    title: 'GEMS Millennium Sharjah: Turning a Vision to Life',
    alt: 'GEMS Millennium Sharjah',
    image: gemsMillenniumSharjah,
    tags: ['Spaces', 'Community'],
  },
  {
    slug: 'gwa-dubai',
    title: 'GEMS World Academy Dubai: Turning Walls into Messaging Pillars',
    alt: 'GEMS World Academy Dubai',
    image: gwaDubai,
    tags: ['Spaces', 'Multi-phase'],
    size: 'wide',
  },
  {
    slug: 'acer-dubai',
    title: "ACER: Designing a Global Education Brand's Regional HQ",
    alt: 'ACER Dubai',
    image: acerDubai,
    tags: ['Spaces', 'HQ Design'],
  },
  {
    slug: 'wis-legacy',
    title: 'WIS: Reimagining Legacy at Wellington International School',
    alt: 'Wellington International School',
    image: wisLegacy,
    tags: ['Spaces', 'Legacy'],
  },
  {
    slug: 'wellington-al-khail',
    title: 'Wellington Academy Al Khail: Making Learning Limitless',
    alt: 'Wellington Academy Al Khail',
    image: wellingtonAlKhail,
    tags: ['Spaces', 'Campus'],
  },
  {
    slug: 'wellington-silicon-oasis',
    title: 'Wellington Academy Silicon Oasis: Pathways to the Future',
    alt: 'Wellington Academy Silicon Oasis',
    image: wellingtonSiliconOasis,
    tags: ['Spaces', 'Campus'],
  },
  {
    slug: 'gems-modern-academy',
    title: 'GEMS Modern Academy: Crafting 20 Years of History',
    alt: 'GEMS Modern Academy',
    image: gemsModernAcademy,
    tags: ['Spaces', 'Publications'],
  },
  {
    slug: 'cofad-branding',
    title: 'College of Fashion and Design: Branding and Launch',
    alt: 'College of Fashion and Design',
    image: cofadBranding,
    tags: ['Branding', 'Launch'],
  },
];
