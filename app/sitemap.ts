import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://ecadellabs.cloud";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publications, projects] = await Promise.all([
    prisma.publication.findMany({ where:{ published:true }, select:{ slug:true, updatedAt:true } }),
    prisma.researchProject.findMany({ where:{ published:true }, select:{ slug:true, updatedAt:true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency:"weekly",  priority:1 },
    { url:`${BASE}/research`, lastModified: new Date(), changeFrequency:"weekly",  priority:0.9 },
    { url:`${BASE}/publications`,lastModified:new Date(),changeFrequency:"weekly", priority:0.9 },
    { url:`${BASE}/fellows`,  lastModified: new Date(), changeFrequency:"monthly", priority:0.8 },
    { url:`${BASE}/grants`,   lastModified: new Date(), changeFrequency:"monthly", priority:0.8 },
    { url:`${BASE}/partnerships`,lastModified:new Date(),changeFrequency:"monthly",priority:0.7 },
    { url:`${BASE}/contact`,  lastModified: new Date(), changeFrequency:"yearly",  priority:0.6 },
  ];

  const pubRoutes: MetadataRoute.Sitemap = publications.map((p) => ({
    url:             `${BASE}/publications/${p.slug}`,
    lastModified:    p.updatedAt,
    changeFrequency: "monthly" as const,
    priority:        0.85,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url:             `${BASE}/research/${p.slug}`,
    lastModified:    p.updatedAt,
    changeFrequency: "monthly" as const,
    priority:        0.85,
  }));

  return [...staticRoutes, ...pubRoutes, ...projectRoutes];
}
