// All invitation content lives here. Edit this file only; markup and motion read from it.
// Every value marked TODO is a sample placeholder — replace it with the real detail.
export default {
  bride: 'Priya', // TODO
  groom: 'Arjun', // TODO
  heroDateText: 'Saturday, 12 December 2026', // TODO
  city: 'Jaipur, Rajasthan', // TODO
  countdownTarget: '2026-12-12T19:30:00+05:30', // TODO (ISO date-time with offset)
  invocation: 'ॐ श्री गणेशाय नमः',

  overlay: {
    invite: 'You are cordially invited',
    button: 'Open Invitation',
  },
  hero: { tagline: 'are getting married' },

  families: {
    invocation: '॥ श्री गणेशाय नमः ॥',
    blessingLine: 'With the blessings of our elders and the grace of the almighty,',
    bride: { label: 'Daughter of', parents: 'Mrs. Sunita & Mr. Rakesh Kapoor', grandparents: 'granddaughter of Smt. Kamla Devi Kapoor' }, // TODO
    groom: { label: 'Son of', parents: 'Mrs. Anjali & Mr. Vivek Malhotra', grandparents: 'grandson of Shri Harish Malhotra' }, // TODO
    request: 'request the honour of your gracious presence as their children wed',
    closing: 'Your blessings are the most treasured gift.',
  },

  celebrations: {
    eyebrow: 'Save the dates',
    title: 'The Celebrations',
    subtitle: 'Four days of colour, music and blessings',
  },

  // Order and count of the pinned scenes come from this array.
  // mapUrl: paste the "Share → Copy link" URL from Google Maps. address is optional (used in the Venues list).
  events: [
    {
      key: 'mehendi', name: 'Mehendi', date: 'Wednesday, 9 December', time: '11:00 AM onwards', // TODO
      venue: 'Kapoor Residence', area: 'C-Scheme, Jaipur', address: '12 Example Marg, C-Scheme, Jaipur 302001', // TODO
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=C-Scheme%2C+Jaipur', // TODO
      dress: 'Shades of green', note: 'Henna, folk songs and a long lazy lunch.', art: 'scene-mehndi', // TODO note
    },
    {
      key: 'haldi', name: 'Haldi', date: 'Thursday, 10 December', time: '10:00 AM onwards', // TODO
      venue: 'Kapoor Residence', area: 'C-Scheme, Jaipur', address: '12 Example Marg, C-Scheme, Jaipur 302001', // TODO
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=C-Scheme%2C+Jaipur', // TODO
      dress: 'Yellow', note: 'Expect turmeric everywhere — white is a brave choice.', art: 'scene-haldi', // TODO note
    },
    {
      key: 'engagement', name: 'Engagement', date: 'Friday, 11 December', time: '7:00 PM onwards', // TODO
      venue: 'The Courtyard Banquet', area: 'MI Road, Jaipur', address: '45 Example Road, MI Road, Jaipur 302001', // TODO
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=MI+Road%2C+Jaipur', // TODO
      dress: 'Pastels / rose gold', note: 'Rings, toasts and dancing under the lamps.', art: 'scene-sangeet', // TODO note
    },
    {
      key: 'wedding', name: 'Wedding', date: 'Saturday, 12 December', time: 'Baraat 4 PM · Pheras 7:30 PM', // TODO
      venue: 'Palace Gardens', area: 'Amer Road, Jaipur', address: 'Example Palace Gardens, Amer Road, Jaipur 302002', // TODO
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Amer+Road%2C+Jaipur', // TODO
      dress: 'Your regal best', note: 'The baraat arrives at dusk; vows around the sacred fire.', art: 'scene-mandap', // TODO note
    },
  ],

  story: {
    enabled: false,
    eyebrow: 'A journey of two hearts',
    title: 'Our Story',
    subtitle: 'How two families became one',
    items: [ /* { year: '2019', title: 'First met', text: '…', img: 'story-1.webp' }  (img lives in public/photos/) */ ],
  },

  gallery: {
    enabled: true,
    eyebrow: 'From our album',
    title: 'Captured Moments',
    subtitle: 'A few of our favourite frames',
    // Each item uses either `art` (a painting in public/art/) or `img` (a photo in public/photos/).
    items: [
      { art: 'scene-mehndi', caption: 'The mehendi afternoon' },
      { art: 'scene-haldi', caption: 'Turmeric and laughter' },
      { art: 'scene-sangeet', caption: 'Dancing till the stars came out' },
      { art: 'scene-mandap', caption: 'Around the sacred fire' },
      { art: 'scene-reception', caption: 'An evening in the palace hall' },
    ],
  },

  details: {
    enabled: true,
    eyebrow: 'For our guests',
    title: 'Things to Know',
    hashtag: '#PriyaWedsArjun', // TODO or null
    hashtagNote: 'Tag your photos and stories so we never miss a moment.',
    items: [ // TODO
      { icon: 'cloud-sun', title: 'Weather', text: 'December in Jaipur is sunny by day and chilly after dark. Carry a shawl for the evenings.' },
      { icon: 'bed-double', title: 'Where to Stay', text: 'Rooms are held near the venues for outstation guests. Call the family numbers below for details.' },
      { icon: 'car', title: 'Getting There', text: 'Every event card has a Google Maps link. Parking is available at all venues.' },
      { icon: 'shirt', title: 'Dress Code', text: 'Indian festive. Greens for Mehendi, yellows for Haldi, pastels for the Engagement and your regal best for the Wedding.' },
    ],
  },

  venues: {
    enabled: true,
    eyebrow: 'Finding your way',
    title: 'The Venues',
  },

  countdown: {
    title: 'The countdown begins',
    doneText: 'Just married',
  },

  music: { enabled: false, src: 'audio/shehnai.mp3' }, // file goes in public/audio/

  footer: {
    families: 'The Kapoor & Malhotra Families', // TODO
    line: 'With love, laughter and the blessings of our elders',
    contacts: [ // TODO
      { name: 'Rakesh Kapoor', phone: '+91 90000 00001' },
      { name: 'Vivek Malhotra', phone: '+91 90000 00002' },
    ],
  },

  meta: {
    title: 'Priya weds Arjun', // TODO
    description: 'You are cordially invited — 12 December 2026 · Jaipur.', // TODO
    siteUrl: 'https://rishabhanand04.github.io/wedding-invitation/', // must end with /
    ogImage: 'og.jpg',
  },
};
