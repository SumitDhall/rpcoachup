
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

export const ARTISTS = [
  { 
    id: "1", 
    name: "Julianne Hough", 
    style: "Ballroom",
    description: "A two-time professional champion of ABC's Dancing with the Stars, Julianne has become a household name in the world of ballroom dance and entertainment.",
    image: "https://picsum.photos/seed/artist1/800/800",
    videos: [
      { id: "v1", title: "Samba Soul", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "v2", title: "Cha Cha Champions", url: "https://www.w3schools.com/html/movie.mp4" }
    ]
  },
  { 
    id: "2", 
    name: "Derek Hough", 
    style: "Contemporary",
    description: "Emmy Award-winning choreographer and New York Times Best Selling author, Derek Hough is a powerhouse of creative expression and technical excellence.",
    image: "https://picsum.photos/seed/artist2/800/800",
    videos: [
      { id: "v3", title: "Emotional Flow", url: "https://www.w3schools.com/html/movie.mp4" },
      { id: "v4", title: "Modern Masterpiece", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ]
  },
  { 
    id: "3", 
    name: "Misty Copeland", 
    style: "Ballet",
    description: "The first African American woman to be promoted to principal dancer in ABT's 75-year history, Misty is a true pioneer and inspiration.",
    image: "https://picsum.photos/seed/artist3/800/800",
    videos: [
      { id: "v5", title: "Swan Lake Solo", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ]
  },
  { 
    id: "4", 
    name: "Les Twins", 
    style: "Hip Hop",
    description: "Larry and Laurent Bourgeois are world-renowned creators, entertainers, and dancers recognized for their innovative freestyle technique.",
    image: "https://picsum.photos/seed/artist4/800/800",
    videos: [
      { id: "v6", title: "New Style Session", url: "https://www.w3schools.com/html/movie.mp4" }
    ]
  },
  { 
    id: "5", 
    name: "Travis Wall", 
    style: "Jazz",
    description: "Known for his work on So You Think You Can Dance, Travis is a master of contemporary jazz storytelling through intricate movement.",
    image: "https://picsum.photos/seed/artist5/800/800",
    videos: [
      { id: "v7", title: "Jazz Fusion", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ]
  },
  { 
    id: "6", 
    name: "Parris Goebel", 
    style: "Urban",
    description: "Creator of the 'Polyswagg' style, Parris is the visionary behind some of the most iconic music video choreographies in modern history.",
    image: "https://picsum.photos/seed/artist6/800/800",
    videos: [
      { id: "v8", title: "Urban Pulse", url: "https://www.w3schools.com/html/movie.mp4" }
    ]
  }
];

export const STUDIO_STATS = [
  { label: "Total Views", value: "1.2M", change: "+14%", trend: "up" },
  { label: "Subscribers", value: "85.4K", change: "+8%", trend: "up" },
  { label: "Watch Time (Hrs)", value: "45.2K", change: "+22%", trend: "up" },
  { label: "Revenue", value: "$12,450", change: "+5%", trend: "up" },
];

export const STUDIO_UPLOADS = [
  { id: "u1", title: "Midnight Samba Masterclass", date: "Oct 24, 2024", views: "12.5K", status: "Published", type: "Tutorial" },
  { id: "u2", title: "Urban Flow Choreography", date: "Oct 20, 2024", views: "45.2K", status: "Published", type: "Performance" },
  { id: "u3", title: "Ballet Basics: The Plie", date: "Oct 15, 2024", views: "8.9K", status: "Review", type: "Tutorial" },
];

export const DANCER_CONTENT = {
  continueWatching: [
    { id: "cw1", title: "Advanced Salsa Patterns", artist: "Derek Hough", progress: 65, thumbnail: "https://picsum.photos/seed/salsa/400/225" },
    { id: "cw2", title: "Hip Hop Fundamentals", artist: "Les Twins", progress: 30, thumbnail: "https://picsum.photos/seed/hiphop/400/225" },
  ],
  saved: [
    { id: "s1", title: "Contemporary Expression", artist: "Travis Wall", thumbnail: "https://picsum.photos/seed/contemp/400/225" },
    { id: "s2", title: "Urban Pulse", artist: "Parris Goebel", thumbnail: "https://picsum.photos/seed/urban/400/225" },
  ],
  purchased: [
    { id: "p1", title: "The Art of Ballroom", artist: "Julianne Hough", date: "Sep 2024", thumbnail: "https://picsum.photos/seed/ballroom/400/225" },
  ]
};
