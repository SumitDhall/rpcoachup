import { Artist, Video, StudioStat, DancerContent } from '@/types';

export const performanceData = [
  { month: 'Jan', performance: 65, attendance: 40 },
  { month: 'Feb', performance: 78, attendance: 55 },
  { month: 'Mar', performance: 72, attendance: 48 },
  { month: 'Apr', performance: 90, attendance: 75 },
  { month: 'May', performance: 85, attendance: 62 },
  { month: 'Jun', performance: 95, attendance: 88 },
  { month: 'Jul', performance: 88, attendance: 80 },
];

export const danceStyleData = [
  { name: 'Contemporary', count: 450, fill: 'hsl(var(--chart-1))' },
  { name: 'Hip Hop', count: 380, fill: 'hsl(var(--chart-2))' },
  { name: 'Ballet', count: 240, fill: 'hsl(var(--chart-3))' },
  { name: 'Jazz', count: 180, fill: 'hsl(var(--chart-4))' },
  { name: 'Latin', count: 150, fill: 'hsl(var(--chart-5))' },
];

export const metrics = [
  {
    title: 'Total Dancers',
    value: '14,285',
    change: '+12.5%',
    trend: 'up',
  },
  {
    title: 'Active Classes',
    value: '342',
    change: '+8.2%',
    trend: 'up',
  },
  {
    title: 'Peak Score',
    value: '98.4',
    change: '+2.1%',
    trend: 'up',
  },
  {
    title: 'Rehearsal Hours',
    value: '1,240',
    change: '-3.4%',
    trend: 'down',
  },
];

export const activities = [
  {
    id: '1',
    user: 'Sarah Miller',
    action: 'uploaded a new choreography',
    target: 'Midnight Bloom',
    time: '2 hours ago',
    type: 'upload',
  },
  {
    id: '2',
    user: 'Alex Chen',
    action: 'achieved a milestone',
    target: '1000 Practice Hours',
    time: '5 hours ago',
    type: 'milestone',
  },
  {
    id: '3',
    user: 'Elena Rodriguez',
    action: 'started a new class',
    target: 'Advance Latin Flow',
    time: '8 hours ago',
    type: 'class',
  },
  {
    id: '4',
    user: 'Marcus Thorne',
    action: 'shared a performance',
    target: 'Urban Showcase 2024',
    time: '12 hours ago',
    type: 'share',
  },
  {
    id: '5',
    user: 'Dancer Team',
    action: 'updated the studio schedule',
    target: 'Main Hall A',
    time: '1 day ago',
    type: 'update',
  },
];

const SAMPLE_VIDEO_1 = "/videos/v1.mp4";
const SAMPLE_VIDEO_2 = "/videos/v2.mp4";
const SAMPLE_VIDEO_3 = "/videos/v3.mp4";
const SAMPLE_VIDEO_4 = "/videos/v4.mp4";

export const ARTISTS: Artist[] = [
  { 
    id: "1", 
    name: "Julianne Hough", 
    style: "Ballroom",
    description: "A two-time professional champion of ABC's Dancing with the Stars, Julianne has become a household name in the world of ballroom dance and entertainment.",
    image: "https://picsum.photos/seed/artist1/800/800",
    videos: [
      { id: "v1-1", title: "Samba Soul Masterclass", url: SAMPLE_VIDEO_1 },
      { id: "v1-2", title: "Cha Cha Champions", url: SAMPLE_VIDEO_2 },
      { id: "v1-3", title: "Ballroom Basics", url: SAMPLE_VIDEO_3 },
      { id: "v1-4", title: "Tango Technique", url: SAMPLE_VIDEO_4 },
      { id: "v1-5", title: "Waltz Wonders", url: SAMPLE_VIDEO_1 },
      { id: "v1-6", title: "Jive Jump", url: SAMPLE_VIDEO_2 },
      { id: "v1-7", title: "Foxtrot Flow", url: SAMPLE_VIDEO_3 },
      { id: "v1-8", title: "Rumba Romance", url: SAMPLE_VIDEO_4 },
      { id: "v1-9", title: "Paso Doble Power", url: SAMPLE_VIDEO_1 },
      { id: "v1-10", title: "Quickstep Quickness", url: SAMPLE_VIDEO_2 }
    ]
  },
  { 
    id: "2", 
    name: "Derek Hough", 
    style: "Contemporary",
    description: "Emmy Award-winning choreographer and New York Times Best Selling author, Derek Hough is a powerhouse of creative expression and technical excellence.",
    image: "https://picsum.photos/seed/artist2/800/800",
    videos: [
      { id: "v2-1", title: "Emotional Flow", url: SAMPLE_VIDEO_3 },
      { id: "v2-2", title: "Modern Masterpiece", url: SAMPLE_VIDEO_4 },
      { id: "v2-3", title: "Contact Improv", url: SAMPLE_VIDEO_1 },
      { id: "v2-4", title: "Floorwork Focus", url: SAMPLE_VIDEO_2 },
      { id: "v2-5", title: "Fluidity Drill", url: SAMPLE_VIDEO_3 },
      { id: "v2-6", title: "Release Technique", url: SAMPLE_VIDEO_4 },
      { id: "v2-7", title: "Contemporary Fusion", url: SAMPLE_VIDEO_1 },
      { id: "v2-8", title: "Partnering Prep", url: SAMPLE_VIDEO_2 }
    ]
  },
  { 
    id: "3", 
    name: "Misty Copeland", 
    style: "Ballet",
    description: "The first African American woman to be promoted to principal dancer in ABT's 75-year history, Misty is a true pioneer and inspiration.",
    image: "https://picsum.photos/seed/artist3/800/800",
    videos: [
      { id: "v3-1", title: "Swan Lake Solo", url: SAMPLE_VIDEO_1 },
      { id: "v3-2", title: "Pointe Work Pro", url: SAMPLE_VIDEO_2 },
      { id: "v3-3", title: "Barre Basics", url: SAMPLE_VIDEO_3 },
      { id: "v3-4", title: "Adagio Alignment", url: SAMPLE_VIDEO_4 },
      { id: "v3-5", title: "Allegro Action", url: SAMPLE_VIDEO_1 },
      { id: "v3-6", title: "Pirouette Perfection", url: SAMPLE_VIDEO_2 },
      { id: "v3-7", title: "Port de Bras", url: SAMPLE_VIDEO_3 },
      { id: "v3-8", title: "Nutcracker Rehearsal", url: SAMPLE_VIDEO_4 }
    ]
  },
  { 
    id: "4", 
    name: "Les Twins", 
    style: "Hip Hop",
    description: "Larry and Laurent Bourgeois are world-renowned creators, entertainers, and dancers recognized for their innovative freestyle technique.",
    image: "https://picsum.photos/seed/artist4/800/800",
    videos: [
      { id: "v4-1", title: "New Style Session", url: SAMPLE_VIDEO_3 },
      { id: "v4-2", title: "Twin Synergy", url: SAMPLE_VIDEO_4 },
      { id: "v4-3", title: "Popping Patterns", url: SAMPLE_VIDEO_1 },
      { id: "v4-4", title: "Isolation Mastery", url: SAMPLE_VIDEO_2 },
      { id: "v4-5", title: "Freestyle Flow", url: SAMPLE_VIDEO_3 },
      { id: "v4-6", title: "Battle Prep", url: SAMPLE_VIDEO_4 },
      { id: "v4-7", title: "Musicality Drills", url: SAMPLE_VIDEO_1 },
      { id: "v4-8", title: "Groove Foundation", url: SAMPLE_VIDEO_2 }
    ]
  },
  { 
    id: "5", 
    name: "Travis Wall", 
    style: "Jazz",
    description: "Known for his work on So You Think You Can Dance, Travis is a master of contemporary jazz storytelling through intricate movement.",
    image: "https://picsum.photos/seed/artist5/800/800",
    videos: [
      { id: "v5-1", title: "Jazz Fusion", url: SAMPLE_VIDEO_1 },
      { id: "v5-2", title: "Lyrical Leap", url: SAMPLE_VIDEO_2 },
      { id: "v5-3", title: "Technical Turns", url: SAMPLE_VIDEO_3 },
      { id: "v5-4", title: "Jazz Walk Progressions", url: SAMPLE_VIDEO_4 },
      { id: "v5-5", title: "Extension Exercises", url: SAMPLE_VIDEO_1 },
      { id: "v5-6", title: "Broadway Bound", url: SAMPLE_VIDEO_2 },
      { id: "v5-7", title: "Sharpness Drills", url: SAMPLE_VIDEO_3 },
      { id: "v5-8", title: "Modern Jazz Study", url: SAMPLE_VIDEO_4 }
    ]
  },
  { 
    id: "6", 
    name: "Parris Goebel", 
    style: "Urban",
    description: "Creator of the 'Polyswagg' style, Parris is the visionary behind some of the most iconic music video choreographies in modern history.",
    image: "https://picsum.photos/seed/artist6/800/800",
    videos: [
      { id: "v6-1", title: "Urban Pulse", url: SAMPLE_VIDEO_3 },
      { id: "v6-2", title: "Polyswagg Power", url: SAMPLE_VIDEO_4 },
      { id: "v6-3", title: "Formation Focus", url: SAMPLE_VIDEO_1 },
      { id: "v6-4", title: "Energy Explosions", url: SAMPLE_VIDEO_2 },
      { id: "v6-5", title: "Camera Blocking", url: SAMPLE_VIDEO_3 },
      { id: "v6-6", title: "Performance Presence", url: SAMPLE_VIDEO_4 },
      { id: "v6-7", title: "Style Study", url: SAMPLE_VIDEO_1 },
      { id: "v6-8", title: "Choreo Creation", url: SAMPLE_VIDEO_2 }
    ]
  },
  { 
    id: "7", 
    name: "Tiler Peck", 
    style: "Ballet",
    description: "Principal dancer with the New York City Ballet, Tiler is widely considered one of the most technical and musical dancers of her generation.",
    image: "https://picsum.photos/seed/artist7/800/800",
    videos: [
      { id: "v7-1", title: "The Nutcracker Pas de Deux", url: SAMPLE_VIDEO_1 },
      { id: "v7-2", title: "Barre Strength", url: SAMPLE_VIDEO_2 },
      { id: "v7-3", title: "Adagio Elegance", url: SAMPLE_VIDEO_3 }
    ]
  },
  { 
    id: "8", 
    name: "Fik-Shun", 
    style: "Hip Hop",
    description: "Winner of SYTYCD Season 10, Fik-Shun is a master of liquid animation and incredible control in urban movement.",
    image: "https://picsum.photos/seed/artist8/800/800",
    videos: [
      { id: "v8-1", title: "Liquid Animation", url: SAMPLE_VIDEO_4 },
      { id: "v8-2", title: "Robot Ryhthms", url: SAMPLE_VIDEO_1 },
      { id: "v8-3", title: "Freestyle Masterclass", url: SAMPLE_VIDEO_2 }
    ]
  },
  { 
    id: "9", 
    name: "Chachi Gonzales", 
    style: "Urban",
    description: "A world-renowned choreographer and winner of America's Best Dance Crew, Chachi brings a unique flair to modern urban dance.",
    image: "https://picsum.photos/seed/artist9/800/800",
    videos: [
      { id: "v9-1", title: "Urban Groove", url: SAMPLE_VIDEO_3 },
      { id: "v9-2", title: "Footwork Fundamentals", url: SAMPLE_VIDEO_4 },
      { id: "v9-3", title: "Stage Presence", url: SAMPLE_VIDEO_1 }
    ]
  },
  { 
    id: "10", 
    name: "Yanis Marshall", 
    style: "Contemporary",
    description: "Famous for his work in heels, Yanis has revolutionized contemporary jazz with his high-energy, high-impact style.",
    image: "https://picsum.photos/seed/artist10/800/800",
    videos: [
      { id: "v10-1", title: "Heels Technique", url: SAMPLE_VIDEO_2 },
      { id: "v10-2", title: "Sass & Class", url: SAMPLE_VIDEO_3 },
      { id: "v10-3", title: "Strut Your Stuff", url: SAMPLE_VIDEO_4 }
    ]
  },
  { 
    id: "11", 
    name: "Michael Dameski", 
    style: "Contemporary",
    description: "Known for his incredible athleticism and power, Michael is a standout performer in the global contemporary scene.",
    image: "https://picsum.photos/seed/artist11/800/800",
    videos: [
      { id: "v11-1", title: "Athletic Flow", url: SAMPLE_VIDEO_1 },
      { id: "v11-2", title: "Power Jumps", url: SAMPLE_VIDEO_2 },
      { id: "v11-3", title: "Floor Mastery", url: SAMPLE_VIDEO_3 }
    ]
  },
  { 
    id: "12", 
    name: "Brian Friedman", 
    style: "Jazz",
    description: "Creative director and choreographer to the stars, Brian's legendary Jazz-Funk style has shaped modern pop performance.",
    image: "https://picsum.photos/seed/artist12/800/800",
    videos: [
      { id: "v12-1", title: "Jazz Funk Fusion", url: SAMPLE_VIDEO_4 },
      { id: "v12-2", title: "Pop Performance", url: SAMPLE_VIDEO_1 },
      { id: "v12-3", title: "Industry Insider", url: SAMPLE_VIDEO_2 }
    ]
  }
];

export const STUDIO_STATS: StudioStat[] = [
  { label: "Total Views", value: "1.2M", change: "+14%", trend: "up" },
  { label: "Subscribers", value: "85.4K", change: "+8%", trend: "up" },
  { label: "Watch Time (Hrs)", value: "45.2K", change: "+22%", trend: "up" },
  { label: "Revenue", value: "$12,450", change: "+5%", trend: "up" },
];

export const DANCER_CONTENT: DancerContent = {
  continueWatching: [
    { id: "cw1", title: "Advanced Salsa Patterns", artist: "Derek Hough", progress: 65, thumbnail: "https://picsum.photos/seed/salsa/400/225", videoUrl: SAMPLE_VIDEO_1 },
    { id: "cw2", title: "Hip Hop Fundamentals", artist: "Les Twins", progress: 30, thumbnail: "https://picsum.photos/seed/hiphop/400/225", videoUrl: SAMPLE_VIDEO_2 },
  ],
  saved: [
    { id: "s1", title: "Contemporary Expression", artist: "Travis Wall", thumbnail: "https://picsum.photos/seed/contemp/400/225", videoUrl: SAMPLE_VIDEO_3 },
    { id: "s2", title: "Urban Pulse", artist: "Parris Goebel", thumbnail: "https://picsum.photos/seed/urban/400/225", videoUrl: SAMPLE_VIDEO_4 },
  ],
  purchased: [
    { id: "p1", title: "The Art of Ballroom", artist: "Julianne Hough", date: "Sep 2024", thumbnail: "https://picsum.photos/seed/ballroom/400/225", videoUrl: SAMPLE_VIDEO_1 },
  ]
};
