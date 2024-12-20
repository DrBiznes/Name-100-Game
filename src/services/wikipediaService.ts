export interface WikiPageData {
  title: string;
  extract: string;
  thumbnail?: string;
  pageUrl: string;
}

export async function fetchWikipediaData(name: string): Promise<WikiPageData | null> {
  try {
    // Search for the page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query.search.length === 0) {
      return null;
    }

    // Get the page ID and title
    const firstResult = searchData.query.search[0];
    const pageId = firstResult.pageid;
    const title = firstResult.title;

    // Get the page content and thumbnail, limiting to 2 sentences
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&exsentences=2&piprop=thumbnail&pithumbsize=200&pageids=${pageId}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();

    const page = contentData.query.pages[pageId];
    const extract = page.extract;
    const thumbnail = page.thumbnail?.source;

    // Construct the page URL
    const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;

    return { title, extract, thumbnail, pageUrl };
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return null;
  }
} 