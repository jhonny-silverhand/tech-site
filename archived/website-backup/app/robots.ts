import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard', '/library/', '/write/'],
      },
    ],
    sitemap: 'https://tech-site.example/sitemap.xml',
  };
}
