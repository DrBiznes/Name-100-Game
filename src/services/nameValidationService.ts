export async function checkWikipedia(name: string): Promise<boolean> {
  try {
    // Normalize the input name for comparison
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');

    // First, search for the page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query.search.length === 0) {
      return false;
    }

    // Check if the first search result's title matches our search term (case-insensitive, hyphen and accent insensitive)
    const firstResult = searchData.query.search[0];
    const normalizedTitle = firstResult.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');
    if (!normalizedTitle.includes(normalizedName)) {
      return false;
    }

    // Get the page content
    const pageId = firstResult.pageid;
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&pageids=${pageId}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();

    const page = contentData.query.pages[pageId];
    const intro = page.extract || '';

    // Remove HTML tags and convert to plain text
    const plainText = intro.replace(/<[^>]*>/g, '');

    // Look for female indicators
    const femaleIndicators = ['she', 'her', 'hers', 'woman', 'female'];
    
    // Convert to lowercase and split into words
    const words = plainText.toLowerCase().split(/\s+/);
    
    // Find the first female indicator
    const firstFemaleIndicator = words.find((word: string) => femaleIndicators.includes(word));

    // Return true if we found a female indicator
    return !!firstFemaleIndicator;

  } catch (error) {
    console.error('Error checking Wikipedia:', error);
    return false;
  }
} 