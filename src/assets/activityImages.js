// src/assets/activityImages.js
// Map activity labels -> bundled image URLs (works with Vite builds)

const FALLBACK = new URL('./images/activities/morning-walk.jpg', import.meta.url).href;

// 👇 Keep filenames EXACTLY as in your folder (case-sensitive in production!)
const MAP = {
  'morning-walk':  new URL('./images/activities/morning-walk.jpg', import.meta.url).href,
  'beach-yoga':    new URL('./images/activities/beach-yoga.jpg', import.meta.url).href,
  'park-cycling':  new URL('./images/activities/park-cycling.jpg', import.meta.url).href,
  'garden-visit':  new URL('./images/activities/garden-visit.jpg', import.meta.url).href,
  'nature-hike':   new URL('./images/activities/nature-hike.jpg', import.meta.url).href,
  // Your file is spelled "river-trial.jpg" (not trail), so map it like this:
  'river-trail':   new URL('./images/activities/river-trail.jpg', import.meta.url).href,
  // Your file shows as "Tai-chi.jpg" (capital T). Keep that exact case:
  'tai-chi':       new URL('./images/activities/Tai-chi.jpg', import.meta.url).href,
  'bird-watching': new URL('./images/activities/bird-watching.jpg', import.meta.url).href,
  'outdoor-fitness': new URL('./images/activities/outdoor-fitness.jpg', import.meta.url).href,
};

function slug(s = '') {
  return s.trim().toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function activityImgSrc(label) {
  const key = slug(label);
  return MAP[key] || FALLBACK;
}
