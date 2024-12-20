import { names } from '../lib/womendatabase.json';

export interface WikiPageData {
  title: string;
  extract: string;
  thumbnail?: string;
  pageUrl: string;
}

// Helper function to normalize names for comparison (same as in nameValidationService)
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/-/g, ' ')               // Replace hyphens with spaces
    .trim();                          // Remove leading/trailing whitespace
}

// Check if name exists in local database
function checkLocalDatabase(name: string): boolean {
  const normalizedInputName = normalizeNameForComparison(name);
  return names.some(dbName => normalizeNameForComparison(dbName) === normalizedInputName);
}

export async function fetchWikipediaData(name: string): Promise<WikiPageData | null> {
  try {
    // First check if the name is in our database
    const isInDatabase = checkLocalDatabase(name);
    
    // Normalize the input name for comparison
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');

    // Search for the page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&&srlimit=5&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query.search.length === 0) {
      return null;
    }

    // Iterate through search results and check if any result is a person
    for (let result of searchData.query.search) {
      const normalizedTitle = result.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');

      // Skip to next result if title doesn't match
      if (!normalizedTitle.includes(normalizedName)) {
        continue;
      }

      // Get the page ID and title
      const pageId = result.pageid;
      const title = result.title;

      // Get the page content, limiting to 2 sentences
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&exsentences=2&piprop=thumbnail&pithumbsize=200&pageids=${pageId}&format=json&origin=*`;
      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();

      const page = contentData.query.pages[pageId];

      // If page data is missing, skip to the next result
      if (!page || !page.extract) {
        continue;
      }

      const extract = page.extract;
      const thumbnail = page.thumbnail?.source;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;

      // If the name is in our database, return the data without checking for female indicators
      if (isInDatabase) {
        return { title, extract, thumbnail, pageUrl };
      }

      // Otherwise, check for female indicators
      const plainText = extract.replace(/<[^>]*>/g, '');
      const femaleIndicators = ['she', 'her', 'hers', 'woman', 'female', 'girl', 'actress', 'chairwoman', 'congresswoman','businesswoman','feminist','spokewoman'];
      const words = plainText.toLowerCase().split(/\s+/);
      const firstFemaleIndicator = words.find((word: string) => femaleIndicators.includes(word));

      if (!!firstFemaleIndicator) {
        return { title, extract, thumbnail, pageUrl };
      }
    }

    // If we reach this point, no matching pages about a person were found
    return null;

  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return null;
  }
} 