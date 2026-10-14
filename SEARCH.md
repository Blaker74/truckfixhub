# TruckFixHub search discovery

## Implemented in this branch

- Public, standalone `trucking-cost-per-mile-calculator.html` with a descriptive title, meta description, self-canonical URL, share metadata, and WebPage structured data matching the page.
- A working monthly cost/break-even calculator, transparent formulas, worked example, and reader questions in the initial HTML. No login or JavaScript is required to read the explanations.
- Descriptive links from resources, the existing trip fuel calculator, dashboard and community. Added the standalone calculator to the sitemap; removed the forum query URL, which is an application view rather than a standalone discussion page.
- No fabricated search volumes, ratings, reviews, members, job listings, author credentials, or guaranteed rankings. No FAQ rich-result or financial-product claims.

These changes are on the review branch until deployment. Google cannot index unpublished review files. The community/dashboard/career review pages remain noindex and are not in the sitemap. Existing repair guides remain unchanged pending a separate technical content review.

## Search themes to validate

These are candidate intents inferred from the site's purpose, not volume-validated keywords or proven ranking opportunities.

| Reader need | Existing or added entry point | Next original contribution |
| --- | --- | --- |
| Trucking cost per mile / break-even rate | New cost calculator | Blake's actual cost categories or a member's permissioned, anonymized worked example |
| Truck trip fuel costs | Existing trip fuel calculator | Clear measured-MPG examples from real operation |
| DPF / DEF / derate help | Existing emissions guide | Model-specific, source-checked cases with confirmed outcomes and technician review |
| Truck repair shop / service locator | Existing directory | Verified firsthand shop details, with location, specialty and source; avoid empty city pages |
| How to become a truck technician | Future technician review page | Verified school/apprenticeship pathways and interviews before publishing a careers guide |

## Launch and measurement

1. Deploy the public resource changes and confirm HTTP 200, self-canonical URLs, rendered content, navigation and mobile usability. Keep private tools and attachments out of public search content.
2. The domain owner verifies truckfixhub.com in Google Search Console, submits https://truckfixhub.com/sitemap.xml, and inspects the calculator and resources URLs. No Search Console connection or submission was performed here.
3. Record the deployment date, then review impressions, queries, clicks and engagement after several weeks. Use actual data to choose the next page; do not promise rankings or traffic.
4. For the future community search architecture, create stable, crawlable public thread pages with meaningful HTML, moderation, and clear consent/audience rules. The current client-side post query link is for sharing; it is not a completed thread SEO system.
5. Improve the existing 9.9 MB homepage payload and measure real mobile performance. The current preview's logo compatibility loader is temporary, not a completed performance optimization.

Google's guidance emphasizes useful original content, readable titles, crawlable links and access to page resources. Structured data must match visible content; it does not guarantee special search presentation. No ranking assessment was made from a missing third-party search result.

References:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/blog/2023/08/howto-faq-changes
