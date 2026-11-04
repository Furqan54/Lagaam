// Content for the demo. In the MERN build this comes from MongoDB via the Express API
// (synced from the YouTube Data API). Shapes mirror the future "Video" model.

export const CHANNEL = {
  name: 'Raftar',
  handle: '@raftartv',
  url: 'https://www.youtube.com/@raftartv',
  playlistPodcasts: 'https://www.youtube.com/watch?v=2UfAuXsUMa8&list=PLjWgMIYQKySN4bgMrGT4ZNKiBFfrCJuy8',
  shortsUrl: 'https://www.youtube.com/@raftartv/shorts',
  patreon: 'https://www.patreon.com/Raftardotcom',
  instagram: 'https://www.instagram.com/raftardotcom',
  tiktok: 'https://www.tiktok.com/@raftardotcom',
  facebook: 'https://www.facebook.com/RaftarDotCom',
  email: 'rabta@raftar.com',
};

export const thumb = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
export const thumbSmall = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
export const watchHref = (v) => `watch.html?id=${v.id}`;
export const youtubeUrl = (v) =>
  v.type === 'short' ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`;

export const TYPE_LABEL = { doc: 'Documentary', podcast: 'Podcast', short: 'Short' };

// The site shows an intro preview, never the whole video: playback runs [start, end] seconds, then
// offers "watch the full video on YouTube". Override per video with `preview: [start, end]`.
export const PREVIEW_SECONDS = { doc: 45, podcast: 45, short: 15 };
export const previewRange = (v) => v.preview ?? [0, PREVIEW_SECONDS[v.type] ?? 45];
export const TOPICS = ['Politics', 'History', 'Economy', 'Society', 'Karachi'];

const GENERIC = 'Watch the full story on Raftar.';

export const videos = [
  // ---- Documentaries ----
  { id: 'g1twM-m85aE', type: 'doc', featured: true, topic: 'History',
    title: 'Lords of Pakistan: The Untold Story of Wadera Raj',
    desc: 'The historical roots of feudal power, land ownership and political influence in Pakistan.' },
  { id: 'rQ8mCmO73bY', type: 'doc', featured: true, topic: 'Politics',
    title: "May 9: Pakistan's Political Turning Point", desc: GENERIC },
  { id: 'pNrLxRhb_Js', type: 'doc', featured: true, topic: 'History',
    title: 'From British Raj to Modern Pakistan', desc: GENERIC },
  { id: 'gT_Ldiji9sU', type: 'doc', featured: true, topic: 'Politics',
    title: 'Pakistan, Politics & the Questions That Matter', desc: GENERIC },
  { id: 's1WnVXpJnsk', type: 'doc', topic: 'Politics',
    title: 'The Untold Story of How Zardari Became the Untouchable King of Sindh',
    desc: "Asif Ali Zardari's political rise, survival and influence in Sindh, and the power structures behind it." },
  { id: 'nLm4AZ63T8w', type: 'doc', topic: 'Politics',
    title: "The Sharif Empire: How Pakistan's Most Powerful Political Family Rose",
    desc: 'How business, electoral politics and decades of power shaped one of the most influential dynasties.' },
  { id: 'aN62U6BVYtY', type: 'doc', topic: 'Karachi',
    title: 'The Untold Story Of How PPP Destroyed Karachi',
    desc: "A hard-hitting look at the decline of Pakistan's largest economic centre, decision by decision." },

  // ---- Podcasts ----
  { id: '2UfAuXsUMa8', type: 'podcast', featured: true, topic: 'Economy',
    title: "Untold Realities Behind Pakistan's Economic Decline",
    desc: "A conversation on the realities behind Pakistan's economic decline and the forces shaping its future." },
  { id: 'DCbdU0unV3Y', type: 'podcast', topic: 'Economy',
    title: 'Untold Insights Revealed by Shabbar Zaidi', desc: GENERIC },
  { id: '4URurKDQzgY', type: 'podcast', topic: 'Politics',
    title: "PMLN's Deal, PTI & Pakistan's Political Questions", desc: GENERIC },
  { id: 'O2yTpllW5ww', type: 'podcast', topic: 'Economy',
    title: "Pakistan's Economy, IMF & Why Investors Are Afraid", desc: GENERIC },

  // ---- Shorts ----
  { id: 'CjT5dzZfUyk', type: 'short', topic: 'Politics', title: 'Altaf Hussain Vs MQM and PSP' },
  { id: 'l63z00Jd5fU', type: 'short', topic: 'Society', title: 'Fatima Bhutto Wedding' },
  { id: 'ymU_IzqBv-I', type: 'short', topic: 'Karachi', title: "Karachi's Rain Challenges" },
  { id: 'jaJhzsuQCNc', type: 'short', topic: 'Society', title: 'Zara Noor Abbas Criticized on Sharing Umrah Picture' },
  { id: 'UBMr1MCgV0k', type: 'short', topic: 'Economy', title: 'Telenor Band Ho Rahe Hai?' },
  { id: '1qdAu2FSfVM', type: 'short', topic: 'Society', title: 'Father ya Husband? The Government Cannot Make Up Its Mind' },
];

export const byType = (t) => videos.filter((v) => v.type === t);
export const getVideo = (id) => videos.find((v) => v.id === id);
export const related = (v, n = 5) =>
  videos
    .filter((x) => x.id !== v.id && x.type === v.type)
    .sort((a, b) => (b.topic === v.topic) - (a.topic === v.topic))
    .slice(0, n);

export const topicBlurb = {
  Politics: 'Dynasties, deals and turning points that shaped the country.',
  History: 'From the Raj to today: how Pakistan became Pakistan.',
  Economy: 'IMF, taxes, investors and why the numbers matter to you.',
  Society: 'Culture, media and the questions we avoid at the dinner table.',
  Karachi: 'The city, its power struggles and its slow decline.',
};

export const stats = [
  { value: 1.25, suffix: 'M', decimals: 2, label: 'YouTube subscribers' },
  { value: 2000, suffix: '+', decimals: 0, label: 'Videos published' },
  { value: 8865, suffix: '', decimals: 0, label: 'Patreon members' },
  { value: 157, suffix: 'K', decimals: 0, label: 'Instagram followers' },
];

export const sisterChannels = [
  { name: 'Raftar Cuts', subs: '23.2K' },
  { name: 'MOMKAST', subs: '43.9K' },
  { name: 'Raftar Now', subs: '104K' },
  { name: 'Raftar Sports', subs: '98.6K' },
];
