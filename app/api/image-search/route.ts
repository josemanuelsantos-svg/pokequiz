import { NextRequest, NextResponse } from 'next/server';

export interface WebImageResult {
  id: string;
  title: string;
  thumbUrl: string;
  fullUrl: string;
  source: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query) {
    return NextResponse.json({ success: true, results: [] });
  }

  const results: WebImageResult[] = [];
  const seenUrls = new Set<string>();

  const addResult = (item: WebImageResult) => {
    if (!item.thumbUrl || !item.fullUrl) return;
    if (item.fullUrl.endsWith('.svg') || item.fullUrl.endsWith('.tif') || item.fullUrl.endsWith('.tiff') || item.fullUrl.endsWith('.pdf') || item.fullUrl.endsWith('.ogg') || item.fullUrl.endsWith('.webm')) {
      return;
    }
    if (seenUrls.has(item.fullUrl)) return;
    seenUrls.add(item.fullUrl);
    results.push(item);
  };

  try {
    // 1. Search Spanish Wikipedia articles with pageimages (great for Spanish educational queries like "volcán", "fracciones", "sistema solar", "castillo")
    const esWikiUrl = `https://es.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=15&prop=pageimages&piprop=thumbnail|original&pithumbsize=500&format=json&origin=*`;

    // 2. Search Wikimedia Commons directly for photos/illustrations matching the query
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      `filetype:bitmap|drawing ${query}`
    )}&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`;

    // 3. Search Openverse free educational/creative-commons image catalog
    const openverseUrl = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(
      query
    )}&page_size=20`;

    const [esWikiRes, commonsRes, openverseRes] = await Promise.allSettled([
      fetch(esWikiUrl, {
        headers: { 'User-Agent': 'PokeQuizEducationalApp/1.0 (https://github.com/josemanuelsantos-svg/pokequiz)' },
      }).then((r) => r.json()),
      fetch(commonsUrl, {
        headers: { 'User-Agent': 'PokeQuizEducationalApp/1.0 (https://github.com/josemanuelsantos-svg/pokequiz)' },
      }).then((r) => r.json()),
      fetch(openverseUrl, {
        headers: { 'User-Agent': 'PokeQuizEducationalApp/1.0' },
      }).then((r) => r.json()),
    ]);

    // Parse Spanish Wikipedia pageimages
    if (esWikiRes.status === 'fulfilled' && esWikiRes.value?.query?.pages) {
      const pages = Object.values(esWikiRes.value.query.pages) as Array<{
        pageid: number;
        title: string;
        thumbnail?: { source: string };
        original?: { source: string };
      }>;
      for (const p of pages) {
        if (p.thumbnail?.source) {
          addResult({
            id: `eswiki-${p.pageid}`,
            title: p.title,
            thumbUrl: p.thumbnail.source,
            fullUrl: p.thumbnail.source,
            source: 'Wikipedia ES',
          });
        }
      }
    }

    // Parse Openverse results
    if (openverseRes.status === 'fulfilled' && Array.isArray(openverseRes.value?.results)) {
      for (const item of openverseRes.value.results) {
        if (item.thumbnail || item.url) {
          addResult({
            id: `ov-${item.id}`,
            title: item.title || query,
            thumbUrl: item.thumbnail || item.url,
            fullUrl: item.url || item.thumbnail,
            source: 'Web',
          });
        }
      }
    }

    // Parse Wikimedia Commons results
    if (commonsRes.status === 'fulfilled' && commonsRes.value?.query?.pages) {
      const pages = Object.values(commonsRes.value.query.pages) as Array<{
        pageid: number;
        title: string;
        imageinfo?: Array<{ thumburl?: string; url?: string }>;
      }>;
      for (const p of pages) {
        const info = p.imageinfo?.[0];
        if (info?.thumburl || info?.url) {
          const cleanTitle = (p.title || '')
            .replace(/^File:/i, '')
            .replace(/\.[a-zA-Z0-9]+$/, '')
            .replace(/[_-]/g, ' ');
          addResult({
            id: `commons-${p.pageid}`,
            title: cleanTitle,
            thumbUrl: info.thumburl || info.url!,
            fullUrl: info.thumburl || info.url!,
            source: 'Commons',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      results: results.slice(0, 32),
    });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al buscar imágenes', results: [] },
      { status: 500 }
    );
  }
}
