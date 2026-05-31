import { prisma } from "@/lib/db";

const BASE = "https://ecadellabs.cloud";

function escape(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

export async function GET() {
  const pubs = await prisma.publication.findMany({
    where:   { published:true },
    orderBy: { publishedAt:"desc" },
    take:    30,
    select:  { title:true, slug:true, abstract:true, category:true, authors:true, tags:true, publishedAt:true, updatedAt:true },
  });

  const CAT: Record<string,string> = {
    "white-paper":"White Paper","research-note":"Research Note",
    "technical-report":"Technical Report","position-paper":"Position Paper",
  };

  const items = pubs.map((pub) => {
    const authors = (JSON.parse(pub.authors) as string[]).join(", ");
    const tags    = (JSON.parse(pub.tags)    as string[]).join(", ");
    const date    = pub.publishedAt ?? pub.updatedAt;
    const url     = `${BASE}/publications/${pub.slug}`;
    const cat     = CAT[pub.category] ?? pub.category;

    return `
    <item>
      <title>${escape(pub.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(pub.abstract)}</description>
      <author>${escape(authors)}</author>
      <category>${escape(cat)}</category>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      <dc:creator>${escape(authors)}</dc:creator>
      ${tags ? `<tags>${escape(tags)}</tags>` : ""}
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/modules/content/">
  <channel>
    <title>ECADEL LABS — Research Publications</title>
    <link>${BASE}/publications</link>
    <description>Research notes, white papers, technical reports, and position papers from ECADEL LABS — the research and innovation engine of ECADEL GROUP LIMITED, advancing African intelligence infrastructure.</description>
    <language>en-gb</language>
    <managingEditor>ecadel@ecadelgroup.com (ECADEL LABS)</managingEditor>
    <webMaster>ecadel@ecadelgroup.com (ECADEL LABS)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE}/logos/ecadel_labs_dark_512.png</url>
      <title>ECADEL LABS</title>
      <link>${BASE}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type":  "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
