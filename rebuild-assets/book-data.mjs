export const chapters = [
 { id: 'community', title: 'Trucking Community Chat', short: 'Share your truck. Help each other.', description: 'Post a photo or video of your truck. Ask a question, share a repair, or help another member.', art: 'community', view: 'forum', privacy: 'Browse freely. Sign in to post, like, or comment.' },
 { id: 'vins', title: 'My VIN List', short: 'Find the right truck. Find its VIN.', description: 'Save your truck numbers and VINs in one place. Add one truck or import your list.', art: 'truck', view: 'trucks', privacy: 'Private: your list stays with your signed-in account.' },
 { id: 'parts', title: 'Parts Counter', short: 'Keep the part numbers you need.', description: 'Look through your parts inventory, save hard-to-find numbers, or import a parts list.', art: 'parts', view: 'parts', privacy: 'Private: sign in to use your saved parts lists.' },
 { id: 'road', title: 'Road Help', short: 'Find repair help and plan your trip.', description: 'Choose the help you need: repair shops, truck problem guides, or a fuel-cost estimate.', art: 'road', links: [ ['Find a repair shop', 'Search for truck repair and service.', 'truck-repair-shop-directory.html'], ['Truck repair guides', 'Emissions, diesel engines, and electrical help.', 'resources.html'], ['Trip fuel calculator', 'Estimate fuel cost before you go.', 'trip-fuel-cost-calculator.html'] ] },
 { id: 'workday', title: 'My Workday', short: 'Notes, contacts, and useful tools.', description: 'Keep the tools you use for work together. Choose one to open it on this page.', art: 'work', tools: [ ['Call Notes', 'Record customer requests and follow-up notes.', 'call-notes'], ['My Contacts', 'Find your saved contacts.', 'my-contacts'], ['My Customer List', 'Keep your customer information together.', 'customers'], ['Business Card Wallet', 'Find the business cards you saved.', 'wallet'] ], privacy: 'Private work tools require your account.' },
 { id: 'gear', title: 'Gear & Feedback', short: 'Support the hub. Help shape its future.', description: 'Visit the official TruckFixHub store or tell us what would help you and the trucking industry.', art: 'gear', links: [ ['Shop TruckFixHub gear', 'Our official Fourthwall store.', 'https://truckfixhub-gear-shop.fourthwall.com/'], ['Take the industry survey', 'Tell us what your business and the next generation need.', 'industry-survey.html'], ['Contact Blake', 'Questions, ideas, and sponsorships.', 'mailto:blakethomaspierce74@gmail.com'] ] }
];
export const CONTENTS_PER_PAGE = 2;
export function readPage(hash) {
 const value = hash.replace(/^#/, '');
 const index = chapters.findIndex(chapter => chapter.id === value);
 if (index >= 0) return { kind: 'chapter', index };
 const match = /^contents(?:-(\d+))?$/.exec(value);
 const count = Math.ceil(chapters.length / CONTENTS_PER_PAGE);
 return { kind: 'contents', index: Math.min(count - 1, Math.max(0, match ? Number(match[1] || 1) - 1 : 0)) };
}
export function remainingSeconds(deadline, now) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
