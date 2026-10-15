export const chapters = [
  {
    "id": "cascadia",
    "title": "2027 Freightliner Cascadia",
    "description": "Turn the page for Trucking Community Chat.",
    "cover": true,
    "chapter": 1,
    "image": "rebuild-assets/trucks/cascadia.webp",
    "source": "https://premiertruck.com/inventory/New-2027-FREIGHTLINER-Cascadia-3AKJHHDR4VSXH6375-957",
    "credit": "Premier Truck Group",
    "art": "community"
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
    "image": "rebuild-assets/trucks/peterbilt.webp",
    "source": "https://www.soarr.com/for-sale/trucks/specs/16440095/2027-Peterbilt-579",
    "credit": "SOARR / listing seller",
    "art": "truck"
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
    "image": "rebuild-assets/trucks/international.webp",
    "source": "https://ascendancetrucks.com/inventory/New-2027-INTERNATIONAL-LT-3HSDZSZR2VN812216",
    "credit": "Ascendance Truck Centers",
    "art": "work"
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
    "image": "rebuild-assets/trucks/kenworth.webp",
    "source": "https://www.impelunion.com/vehicles/2027-kenworth-t680-u-12395",
    "credit": "Impel Union",
    "art": "work"
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
    "image": "rebuild-assets/trucks/western-star.webp",
    "source": "https://premiertruck.com/inventory/New-2027-WESTERN_STAR-49X-5KJJBWDRXVPXE0582-990",
    "credit": "Premier Truck Group",
    "art": "community"
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
    "image": "rebuild-assets/trucks/mack.webp",
    "source": "https://www.nortrux.com/product-page/2027-hb64t-64-mr-stock-38392",
    "credit": "Nortrux",
    "art": "road"
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
    "description": "Turn the page for Shop Gear & T-Shirts.",
    "cover": true,
    "chapter": 7,
    "image": "rebuild-assets/trucks/volvo.webp",
    "source": "https://www.tomnehl.com/truck-sales/truck?id=4V4BC9EH1VN722305",
    "credit": "Tom Nehl Truck Company",
    "art": "gear"
  },
  {
    "id": "gear",
    "title": "Shop Gear & T-Shirts",
    "description": "Visit the official TruckFixHub store and shop our T-shirts.",
    "chapter": 7,
    "art": "gear",
    "gear": true
  }
];
export const contents = chapters.filter(page => page.cover).map((page, index) => ({
 chapter: index + 1, coverId: page.id, coverTitle: page.title, coverNumber: index * 2 + 1,
 title: chapters[index * 2 + 1].title, pageId: chapters[index * 2 + 1].id, pageNumber: index * 2 + 2
}));
export function readPage(hash) {
 const value = hash.replace(/^#/, '');
 const index = chapters.findIndex(page => page.id === value);
 return index >= 0 ? { kind: 'chapter', index } : { kind: 'contents', index: 0 };
}
export function remainingSeconds(deadline, now) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
