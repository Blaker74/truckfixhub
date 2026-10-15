export const chapters = [
  {
    "id": "cascadia",
    "title": "2027 Freightliner Cascadia",
    "description": "Turn the page for Trucking Community Chat.",
    "cover": true,
    "chapter": 1,
    "image": "rebuild-assets/trucks/cascadia-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "community",
    "generated": true
  },
  {
    "id": "community",
    "title": "Trucking Community Chat",
    "description": "Post truck photos and videos, ask questions, and help other members.",
    "chapter": 1,
    "art": "community",
    "view": "forum",
    "privacy": "Browse freely. Sign in to post, like, or comment."
  },
  {
    "id": "peterbilt",
    "title": "2027 Peterbilt 579",
    "description": "Turn the page for My VIN List.",
    "cover": true,
    "chapter": 2,
    "image": "rebuild-assets/trucks/peterbilt-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "truck",
    "generated": true
  },
  {
    "id": "vins",
    "title": "My VIN List",
    "description": "Find your truck numbers and VINs. Add a truck or import your list.",
    "chapter": 2,
    "art": "truck",
    "view": "trucks",
    "privacy": "Private: your saved information stays with your account."
  },
  {
    "id": "international",
    "title": "2027 International LT",
    "description": "Turn the page for My Call Notes.",
    "cover": true,
    "chapter": 3,
    "image": "rebuild-assets/trucks/international-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "work",
    "generated": true
  },
  {
    "id": "call-notes",
    "title": "My Call Notes",
    "description": "Record customer requests and keep your follow-up notes together.",
    "chapter": 3,
    "art": "work",
    "view": "call-notes",
    "privacy": "Private: your saved information stays with your account."
  },
  {
    "id": "kenworth",
    "title": "2027 Kenworth T680",
    "description": "Turn the page for My Customer List.",
    "cover": true,
    "chapter": 4,
    "image": "rebuild-assets/trucks/kenworth-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "work",
    "generated": true
  },
  {
    "id": "customers",
    "title": "My Customer List",
    "description": "Find and manage your saved customer information.",
    "chapter": 4,
    "art": "work",
    "view": "customers",
    "privacy": "Private: your saved information stays with your account."
  },
  {
    "id": "western-star",
    "title": "2027 Western Star 49X",
    "description": "Turn the page for Diesel Reel.",
    "cover": true,
    "chapter": 5,
    "image": "rebuild-assets/trucks/western-star-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "community",
    "generated": true
  },
  {
    "id": "diesel-reel",
    "title": "Diesel Reel",
    "description": "Watch the latest truck videos shared by the community.",
    "chapter": 5,
    "art": "community",
    "reels": true
  },
  {
    "id": "mack",
    "title": "2027 Mack Pioneer",
    "description": "Turn the page for Super Miller.",
    "cover": true,
    "chapter": 6,
    "image": "rebuild-assets/trucks/mack-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "road",
    "generated": true
  },
  {
    "id": "super-miller",
    "title": "Super Miller",
    "description": "Open Supermiller from your trucking handbook.",
    "chapter": 6,
    "art": "road",
    "view": "supermiller"
  },
  {
    "id": "volvo",
    "title": "2027 Volvo VNL64T860",
    "description": "Turn the page for Truck Repair Guides.",
    "cover": true,
    "chapter": 7,
    "image": "rebuild-assets/trucks/volvo-ai.webp",
    "credit": "AI-generated cover art · model-inspired illustration",
    "art": "gear",
    "generated": true
  },
  {
    "id": "repair-help",
    "title": "Truck Repair Guides",
    "description": "Choose a topic. Read the guide, check its manufacturer sources, and prepare your questions.",
    "chapter": 7,
    "art": "parts",
    "guides": true,
    "privacy": "Free to read. No login required."
  },
  {
    "id": "find-a-shop",
    "title": "Find a Repair Shop",
    "description": "Search local listings or open a nationwide manufacturer service locator.",
    "chapter": 8,
    "art": "road",
    "resource": "truck-repair-shop-directory.html",
    "privacy": "Public directory. Call the shop to confirm service and availability."
  },
  {
    "id": "fuel-cost",
    "title": "Trip Fuel Cost Calculator",
    "description": "Enter your miles, fuel economy, and fuel price to estimate the trip.",
    "chapter": 9,
    "art": "truck",
    "resource": "trip-fuel-cost-calculator.html",
    "privacy": "No login required. Your calculation stays in your browser."
  },
  {
    "id": "casino",
    "title": "Casino",
    "description": "Take a break with your free-credit slot machine.",
    "chapter": 10,
    "art": "gear",
    "view": "casino",
    "privacy": "Free play only. No real-money wagering."
  },
  {
    "id": "sports",
    "title": "Sports Room",
    "description": "Relax with sports scores, highlights, and your sports room.",
    "chapter": 11,
    "art": "community",
    "view": "sports"
  },
  {
    "id": "calendar",
    "title": "My Calendar",
    "description": "Keep appointments, follow-ups, service dates, and trucking events organized in one place.",
    "chapter": 12,
    "art": "work",
    "view": "calendar",
    "privacy": "Private: your calendar stays with your account."
  },
  {
    "id": "gear",
    "title": "Shop Gear & T-Shirts",
    "description": "Visit the official TruckFixHub store and shop our T-shirts.",
    "chapter": 13,
    "art": "gear",
    "gear": true
  }
];
export const contents = chapters.filter(page => !page.cover).map(page => {
 const cover = chapters.find(candidate => candidate.cover && candidate.chapter === page.chapter);
 return {
  chapter: page.chapter, title: page.title, pageId: page.id, pageNumber: chapters.indexOf(page) + 1,
  ...(cover ? { coverId: cover.id, coverTitle: cover.title, coverNumber: chapters.indexOf(cover) + 1 } : {})
 };
});
export function readPage(hash) {
 const value = hash.replace(/^#/, '');
 const index = chapters.findIndex(page => page.id === value);
 return index >= 0 ? { kind: 'chapter', index } : { kind: 'contents', index: 0 };
}
export function remainingSeconds(deadline, now) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
export function turnDirection(previous, next) {
 const order = page => page.kind === 'contents' ? -1 : page.index;
 const difference = order(next) - order(previous);
 return difference === 0 ? null : difference > 0 ? 'forward' : 'backward';
}
