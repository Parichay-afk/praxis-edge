/* Praxis Edge GESS 2026 touch table: content */
window.EDGE = {
  qrUrl: "praxis-edge.com",

  /* live email: the Gmail Apps Script web app URL (see mailer/). Empty = plans are saved and send later. */
  sendEndpoint: "https://script.google.com/macros/s/AKfycbzaxJFwimo4SV9T3NRypQq-Fcm17dORqzj8zkn9zDbg8IGQw9qr6iFf1HrMdY77Ob0C/exec",
  sendToken: "gess-2026-table",
  teamEmail: "marketing@praxisadvertising.com",

  /* where each saved item links to in the plan email (paths on praxis-edge.com) */
  site: {
    division: {
      spaces: "/spaces",
      brand: "/marketing?tab=branding#services",
      enrolment: "/marketing?tab=enrollment#services",
      comms: "/marketing?tab=pr#services"
    },
    spaceExamples: "/spaces#transformations",
    work: {
      nms: "gems-new-millennium-school", gwa: "gems-world-academy", sri: "gems-school-of-research-and-innovation",
      wak: "gems-wellington-academy-al-khail", wso: "gems-wellington-academy-silicon-oasis", wis: "gems-wellington-international-school",
      tms: "the-millennium-school-dubai", gms: "gems-millennium-school-sharjah", gma: "gems-modern-academy",
      jc: "jumeirah-college", arc: "arcadia-british-school", acer: "australian-council-for-educational-research",
      iim: "iim-ahmedabad-dubai", cfd: "college-of-fashion-and-design", drmi: "digital-renaissance-music-institute",
      kenzi: "kenzi-nursery-casablanca"
    }
  },

  /* schools: logo files in logos/ */
  schools: {
    nms: { name: "GEMS New Millennium School, Al Khail", logo: "nms" },
    gwa: { name: "GEMS World Academy", logo: "gwa" },
    sri: { name: "GEMS School of Research & Innovation", logo: "sri" },
    wak: { name: "GEMS Wellington Academy, Al Khail", logo: "wak" },
    wso: { name: "GEMS Wellington Academy, Silicon Oasis", logo: "wso" },
    wis: { name: "GEMS Wellington International School", logo: "wis" },
    tms: { name: "The Millennium School, Dubai", logo: "tms" },
    gms: { name: "GEMS Millennium School, Sharjah", logo: "gms" },
    gma: { name: "GEMS Modern Academy", logo: "gma" },
    jc: { name: "Jumeirah College", logo: "jc" },
    arc: { name: "Arcadia British School", logo: "arc" },
    daa: { name: "GEMS Dubai American Academy" },
    bits: { name: "BITS Pilani, Dubai Campus" },
    acer: { name: "Australian Council for Educational Research", logo: "acer" },
    iim: { name: "IIM Ahmedabad, Dubai", logo: "iim" },
    cfd: { name: "The College of Fashion & Design", logo: "cfd" },
    drmi: { name: "Digital Renaissance Music Institute", logo: "drmi" },
    kenzi: { name: "Kenzi Nursery, Casablanca" },
    starm: { name: "Star International School Mirdif" },
    start: { name: "Star International School Al Twar" },
    waad: { name: "GEMS World Academy, Abu Dhabi" },
    sun: { name: "Sunmarke School" }
  },
  logoWall: ["gwa", "nms", "sri", "jc", "wis", "wak", "wso", "gma", "tms", "gms", "arc", "daa", "iim", "bits", "cfd", "drmi", "acer"],

  /* each school's project, from praxisadvertising.com and praxis-edge.com */
  projects: {
    "gwa": [
      {
        "title": "Education for a Better World, on Every Wall",
        "summary": "Across six phases at the Junior Campus and three floors at the Senior School, we turned GWA's IB philosophy into spaces students learn from.",
        "stat": [
          "6 + 3",
          "phases at the Junior Campus, floors at the Senior School"
        ],
        "scope": [
          "Reception and 50 Facts wall",
          "Nursery",
          "Technology Centre",
          "Maker Lab",
          "Careers in Science zones",
          "IB and UN SDG storytelling",
          "UAE timeline"
        ]
      }
    ],
    "sri": [
      {
        "title": "Crafting Environments in the World's Finest School",
        "summary": "Praxis designed GEMS School of Research & Innovation as a living lab, with six themed zones from AI and e-sports to sustainability.",
        "stat": [
          "6",
          "themed zones across the school"
        ],
        "scope": [
          "AI and Research zone",
          "E-Sports zone",
          "Performing Arts zone",
          "UAE Innovation Timeline",
          "Sustainability zone",
          "Food Tech wall"
        ]
      }
    ],
    "nms": [
      {
        "title": "A Reception Built Around the Ghaf Tree",
        "summary": "We redesigned the school's reception for better flow and clear parent zones, centred on bespoke seating around a Ghaf tree.",
        "stat": [
          "Ghaf",
          "tree centrepiece, custom built and installed"
        ],
        "scope": [
          "Reception redesign",
          "Parent zones",
          "Wall graphics",
          "Ghaf tree seating"
        ]
      }
    ],
    "jc": [
      {
        "title": "Spaces Teenagers Actually Notice",
        "summary": "Part of a long-running rebrand and facilities upgrade at Jumeirah College, including the JC Lions sports hall.",
        "stat": [
          "3+",
          "years as creative partner"
        ],
        "scope": [
          "Environmental branding",
          "Campus graphics",
          "JC Lions sports hall"
        ]
      }
    ],
    "wis": [
      {
        "title": "Reimagining Legacy",
        "summary": "Praxis refreshed Wellington International School's reception and designed a Post-16 Falcon Centre that feels distinctly senior, with the school's story told on its walls.",
        "stat": [
          "2",
          "key spaces: the Reception and the Post-16 Falcon Centre"
        ],
        "scope": [
          "Reception refresh",
          "Falcon Centre (Post-16)",
          "School journey",
          "UAE timeline"
        ]
      }
    ],
    "wak": [
      {
        "title": "Making Learning Limitless",
        "summary": "Praxis redesigned Wellington Academy Al Khail's reception, corridors, Nursery and Sixth Form so each stage of school has its own look under one brand.",
        "stat": [
          "4",
          "campus zones redesigned"
        ],
        "scope": [
          "Reception foyer",
          "Main corridors",
          "Nursery",
          "Sixth Form"
        ]
      }
    ],
    "wso": [
      {
        "title": "Pathways to the Future",
        "summary": "Praxis branded learning spaces across the Silicon Oasis campus, from the Nursery to Post-16, plus the first GEMS Early Childhood Learning Center.",
        "stat": [
          "1st",
          "Early Childhood Learning Center in the GEMS network, branded in 2025"
        ],
        "scope": [
          "Primary and Secondary receptions",
          "Nursery",
          "Post-16 areas",
          "Early Childhood Learning Center"
        ]
      }
    ],
    "gma": [
      {
        "title": "Crafting 20 Years of History",
        "summary": "Praxis redesigned GEMS Modern Academy's reception and parent zones, and has produced its yearbook, The Modernite, for over 20 years.",
        "stat": [
          "20+",
          "years producing The Modernite yearbook"
        ],
        "scope": [
          "Reception and parent zones",
          "The Modernite yearbook",
          "Magic of the Musicals book",
          "Performance collaterals"
        ]
      }
    ],
    "tms": [
      {
        "title": "Celebrating Legacy Through Design & Storytelling",
        "summary": "Praxis turned The Millennium School's reception and auditorium corridor into a walk through 25 years of its history, alongside five years of its yearbook, The Pulse.",
        "stat": [
          "5",
          "years producing The Pulse yearbook"
        ],
        "scope": [
          "Reception",
          "Auditorium foyer corridor",
          "The Pulse yearbook"
        ]
      }
    ],
    "gms": [
      {
        "title": "Turning a Vision to Life",
        "summary": "Praxis redesigned the spaces parents and visitors see first: the reception, parent caf\u00e9, parent waiting area and principal's office.",
        "stat": [
          "4",
          "front-of-house spaces transformed"
        ],
        "scope": [
          "Reception",
          "Parent Caf\u00e9",
          "Parent Waiting Area",
          "Principal's Office"
        ]
      }
    ],
    "arc": [
      {
        "title": "Transforming Corridors Into Visual Narratives",
        "summary": "Praxis turned Arcadia British School's science corridor into Discovery Through Design, a gallery of the people and moments behind science.",
        "stat": [
          "1",
          "science corridor, themed Discovery Through Design"
        ],
        "scope": [
          "Science corridor",
          "Discovery Through Design theme"
        ]
      }
    ],
    "daa": [
      {
        "title": "AI Tunnel and AI Centre of Excellence",
        "summary": "Praxis designed and installed the DAA AI Tunnel and the AI Centre of Excellence, alongside wellness spaces across the campus.",
        "scope": [
          "AI Tunnel",
          "AI Centre of Excellence",
          "Wellness corridor"
        ]
      }
    ],
    "iim": [
      {
        "title": "Three Straight Years of Full Cohorts",
        "summary": "We built the enrollment engine behind IIM Ahmedabad's General Management Programme in Dubai, from first click to confirmed seat.",
        "stat": [
          "3",
          "straight years of fully booked cohorts"
        ],
        "scope": [
          "Performance marketing",
          "Lead management",
          "Admissions support"
        ],
        "caseFor": "enrolment"
      }
    ],
    "bits": [
      {
        "title": "Branding High-Impact Touchpoints",
        "summary": "Praxis rebranded BITS Pilani Dubai's admissions office and team offices, and designed its prospectus and placement brochure, so every step of admissions tells one story.",
        "stat": [
          "4",
          "admissions touchpoints, across space and print"
        ],
        "scope": [
          "Admissions Office",
          "Admissions team offices",
          "Prospectus",
          "Placement brochure"
        ]
      }
    ],
    "cfd": [
      {
        "title": "A Brand Launched Before the Building",
        "summary": "We branded and launched the region's first accredited fashion college with a calligraphy-led identity shortlisted at Dubai Lynx.",
        "stat": [
          "1st",
          "accredited fashion college in the region"
        ],
        "scope": [
          "Brand identity",
          "Calligraphy language",
          "Brochures and stationery",
          "Launch materials"
        ],
        "caseFor": "brand"
      }
    ],
    "drmi": [
      {
        "title": "Launching a Music Institute From Stealth",
        "summary": "We took a brand new music institute from stealth to standout in Dubai with enrollment marketing, social media, PR and creator partnerships.",
        "stat": [
          "819",
          "student leads in the first four months"
        ],
        "scope": [
          "Enrollment marketing",
          "Social media",
          "PR",
          "Creator partnerships",
          "Events"
        ],
        "caseFor": "enrolment"
      }
    ],
    "acer": [
      {
        "title": "Designing ACER's Regional Headquarters",
        "summary": "Praxis designed ACER's Dubai office end to end, from space planning and civil works to install, turning 90 years of research into a working office, not a museum.",
        "stat": [
          "End to end",
          "from space planning and civil works to design and installation"
        ],
        "scope": [
          "Space planning",
          "Civil works",
          "Caf\u00e9 and conference room",
          "Collaborative zones",
          "Executive cabins",
          "Wayfinding"
        ]
      }
    ]
  },

  /* which school each photo belongs to (by deck image number; pairs use the AFTER number) */
  credit: {
    2: "nms", 17: "nms", 167: "nms",
    19: "tms", 103: "tms",
    21: "gwa", 23: "gwa", 42: "gwa", 46: "gwa", 63: "gwa", 65: "gwa", 67: "gwa", 98: "gwa", 99: "gwa", 151: "gwa", 157: "gwa", 40: "gwa", 135: "gwa",
    34: "wak", 32: "wak", 52: "wak", 101: "wak",
    36: "wso", 111: "wso", 118: "wso", 168: "wso",
    57: "sri", 59: "sri", 77: "sri", 86: "sri", 88: "sri", 137: "sri", 158: "sri",
    130: "jc", 165: "gma", 149: "daa",
    /* new photos, Nov 2026 */
    170: "gma", 172: "gwa", 174: "kenzi", 175: "starm",
    177: "start", 179: "start", 181: "starm", 194: "starm", 196: "starm",
    183: "waad", 184: "waad", 198: "waad", 200: "waad", 201: "waad",
    186: "sun", 188: "sun", 190: "sun", 192: "sun"
  },

  /* real testimonials from school leaders */
  quotes: {
    jc: { q: "As a school leader, engaged with a significant re-branding and upgrading of facilities, I wouldn\u2019t entrust my displays to anyone else.", who: "Rob Kesterton", role: "Vice Principal, Jumeirah College" },
    tms: { q: "For over seven years, Praxis Advertising has been a reliable creative partner of The Millennium School, Dubai.", who: "Ambika Gulati", role: "Principal, The Millennium School" },
    daa: { q: "The DAA AI Tunnel and the AI Centre of Excellence, designed and installed by Praxis, have become cornerstones of our mission to inspire innovation and foster future-ready learners.", who: "Dr. Sreejit Chakrabarty", role: "Director of AI and Robotics, GEMS Dubai American Academy" },
    cfd: { q: "Praxis has become an irreplaceable part of the CFD story. They have an ability to read your mind and turn things around with tight deadlines.", who: "Vikram Tah", role: "CEO, The College of Fashion & Design" },
    gms: { q: "Their thoughtful approach to reimagining our reception area and refining the aesthetics of our campus has helped create a space that feels both welcoming and aligned with our school\u2019s values.", who: "Lini Shivaprasad", role: "Principal, GEMS Millennium School, Sharjah" }
  },

  types: [
    { id: "k12", label: "K-12 School", note: "Primary, secondary or all-through" },
    { id: "early", label: "Nursery / Early Years", note: "Nurseries, KG and FS" },
    { id: "higher", label: "University / Higher Ed", note: "Colleges, universities, business schools" },
    { id: "training", label: "Training / Vocational", note: "Institutes, academies, executive education" }
  ],

  needs: [
    { id: "tired", label: "Our campus feels tired", divs: ["spaces"] },
    { id: "enquiries", label: "We need more enquiries", divs: ["enrolment"] },
    { id: "convert", label: "Enquiries are not turning into enrolments", divs: ["enrolment"] },
    { id: "brand", label: "Our brand feels dated", divs: ["brand"] },
    { id: "new", label: "We are opening a new school or campus", divs: ["brand", "spaces", "enrolment", "comms"] },
    { id: "media", label: "We want to be seen and talked about", divs: ["comms"] }
  ],

  divisions: [
    {
      id: "spaces", name: "Campus Design", color: "mint",
      ask: ["Which spaces do families see first on a tour?", "What should someone feel in your reception in the first ten seconds?", "Is there a wall or corridor you walk past and wish looked different?"],
      line: "We turn school spaces into visual experiences.",
      intro: "Receptions, corridors, labs, sports halls and everything between. Explore real transformations from schools across the UAE.",
      plan: "A walkthrough of your campus to find the spaces that will make the biggest first impression."
    },
    {
      id: "brand", name: "Branding", color: "peach",
      ask: ["How would parents describe you in one sentence?", "Which schools do families compare you with?", "Does your brand look the same on your website, your prospectus and your walls?"],
      line: "We build brands families remember.",
      intro: "Strategy, naming, identity and messaging for schools, nurseries, colleges and universities.",
      plan: "A brand health check: how you look, sound and compare against the schools families shortlist you with.",
      services: [
        ["Brand strategy", "Positioning that sets you apart from the schools down the road."],
        ["Naming", "Names for new schools, programmes and campuses."],
        ["Visual identity", "Logos, colour, type and the system that holds it together."],
        ["Messaging", "What you stand for, said in words parents repeat."],
        ["Brand collateral", "Prospectuses, stationery, signage and launch kits."]
      ],
      cases: [
        {
          client: "The College of Fashion and Design, Dubai", school: "cfd",
          title: "A brand launched before the building",
          body: "The region's first accredited fashion-focused college needed an identity before its campus existed. We built a calligraphy-led identity that blends traditional lettering with modern fashion design, plus brochures, stationery and launch collateral.",
          result: "Shortlisted at the Dubai Lynx Awards, Calligraphy category"
        }
      ]
    },
    {
      id: "enrolment", name: "Enrollment Support", color: "sky",
      ask: ["Where do most of your enquiries come from today?", "What happens in the first 24 hours after an enquiry?", "Which year groups are hardest to fill?"],
      line: "We fill seats, cohort after cohort.",
      intro: "Admissions campaigns from first awareness to confirmed seat.",
      plan: "A review of your admissions funnel, from first click to signed enrolment form.",
      services: [
        ["Awareness campaigns", "Search, social and display timed to your admission windows."],
        ["Lead management", "Every enquiry tracked, followed up and matched to the right programme."],
        ["Open days and events", "Masterclasses, tours and open days that people actually attend."],
        ["CRM nurture", "Personal follow-up from first enquiry to confirmed seat."],
        ["Reporting", "Spend optimised against enrolments, not clicks."]
      ],
      cases: [
        {
          client: "IIM Ahmedabad, Dubai", school: "iim",
          title: "Three straight years of full cohorts",
          body: "We relaunched the executive education presence in Dubai and ran the enrolment journey: performance marketing tied to admission windows, structured lead management and personal admissions communication.",
          result: "Programme fully booked for three consecutive years",
          gallery: ["media/iim-admissions-1.jpg", "media/iim-admissions-2.jpg", "media/iim-admissions-3.jpg", "media/iim-admissions-4.jpg", "media/iim-admissions-5.jpg"]
        },
        {
          client: "Digital Renaissance Music Institute, Dubai", school: "drmi",
          title: "Launching a music institute from stealth",
          body: "No profile, no students and a first intake to fill. We ran course-based search and social campaigns, social content, PR, creator partnerships and free masterclasses.",
          stats: [["819", "leads in 4 months"], ["12", "press features at launch"], ["110", "at 6 masterclasses"]]
        }
      ]
    },
    {
      id: "comms", name: "Communications & PR", color: "butter",
      ask: ["What is a story from your school this year that deserves to be heard?", "Who speaks for the school today?", "Where would you most like to be featured?"],
      line: "We get schools seen, heard and trusted.",
      intro: "Media relations, reputation and community marketing for education leaders.",
      plan: "A visibility audit: where you show up today and the stories worth telling.",
      services: [
        ["Media relations", "Regional and education press, placed and managed."],
        ["Reputation management", "Calm, clear communication when it matters most."],
        ["Thought leadership", "Your principal and leaders, positioned as voices worth hearing."],
        ["Social media", "Always-on content that shows school life as it really is."],
        ["Influencer and parent communities", "Word of mouth, designed on purpose."]
      ],
      proof: { stat: "12", label: "press features in the launch month for Digital Renaissance Music Institute" }
    }
  ],

  /* Campus Design spaces, from "Praxis 2026 School branding" deck.
     pairs: [before, after] image numbers. extras: single images. */
  spaces: [
    { id: "receptions", name: "Receptions", cover: 2, blurb: "First impressions, built to be remembered.",
      pairs: [[15,2],[16,17],[18,19],[20,21],[22,23],[24,25],[26,27],[28,29],[30,31],[169,170],[171,172]],
      extras: [14], video: { src: "media/edge-reel-nms-reception.mp4", poster: "media/edge-reel-nms-cover.jpg", label: "GEMS New Millennium School reception, the reel", school: "nms" } },
    { id: "nurseries", name: "Nurseries / KG", cover: 34, blurb: "Warm, playful spaces parents trust at first sight.",
      pairs: [[33,34],[35,36],[37,38],[173,174]], extras: [39, 32, 175] },
    { id: "usp", name: "USP Zones", cover: 44, blurb: "Your school's story, on the walls families walk past.",
      pairs: [[41,42],[43,44],[45,46],[47,48],[51,52],[53,54],[176,177],[178,179],[180,181],[182,183]], extras: [40, 50, 49, 184] },
    { id: "labs", name: "AI & Tech Labs", cover: 69, blurb: "Labs that look like the future you teach.",
      pairs: [[56,57],[58,59],[60,61],[62,63],[64,65],[66,67],[68,69],[70,71],[72,73],[185,186],[187,188],[189,190],[191,192],[193,194]], extras: [55, 74] },
    { id: "arabic", name: "Arabic & Islamic", cover: 83, blurb: "Heritage and values, designed with care and pride.",
      pairs: [[76,77],[78,79],[80,81],[82,83]], extras: [75] },
    { id: "timelines", name: "Timelines", cover: 92, blurb: "Your history, turned into a walk-through story.",
      pairs: [[85,86],[87,88],[89,90],[91,92],[94,95],[97,98],[100,101],[102,103],[104,105],[107,108]], extras: [84, 93, 96, 99, 106, 109, 110],
      video: { src: "media/edge-daa-timeline.mp4", poster: "media/edge-daa-timeline-cover.jpg", label: "GEMS Dubai American Academy timeline corridor, drone fly-through", school: "daa", first: true } },
    { id: "post16", name: "Post-16 Hubs", cover: 111, blurb: "Grown-up spaces for students about to step out.",
      pairs: [[112,113],[114,115],[116,117]], extras: [111, 118, 119] },
    { id: "sports", name: "Sports Areas", cover: 132, blurb: "Energy, pride and team spirit on every surface.",
      pairs: [[123,124],[125,126],[127,128],[129,130],[131,132],[133,134]], extras: [120, 121, 122] },
    { id: "corridors", name: "Corridors", cover: 141, blurb: "Blank walls turned into learning moments.",
      pairs: [[136,137],[138,139],[140,141],[144,145],[146,147],[148,149],[150,151],[152,153],[154,155],[156,157],[195,196],[197,198],[199,200]], extras: [135, 143, 158, 159, 201] },
    { id: "cafeterias", name: "Cafeterias", cover: 167, blurb: "Dining spaces students actually want to be in.",
      pairs: [[160,161],[162,163],[164,165],[166,167]], extras: [168] }
  ],

  /* which spaces to show first for each institution type */
  spaceOrder: {
    k12: ["receptions", "usp", "labs", "corridors", "timelines", "sports", "arabic", "post16", "cafeterias", "nurseries"],
    early: ["nurseries", "receptions", "corridors", "usp", "arabic", "cafeterias", "timelines", "labs", "sports", "post16"],
    higher: ["receptions", "labs", "post16", "usp", "timelines", "corridors", "cafeterias", "sports", "arabic", "nurseries"],
    training: ["receptions", "labs", "post16", "usp", "corridors", "timelines", "cafeterias", "arabic", "sports", "nurseries"]
  }
};
