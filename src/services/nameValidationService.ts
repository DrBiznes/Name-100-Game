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

    // Iterate through search results and check if any result is a person
    for (let result of searchData.query.search) {
      const normalizedTitle = result.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');
      
      // Skip to next result if title doesn't match
      if (!normalizedTitle.includes(normalizedName)) {
        continue;
      }

      // Get the page content
      const pageId = result.pageid;
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
      if (!!firstFemaleIndicator) {
        return true;
      }
    }

    // If we reach this point, no matching pages about a person were found
    return false;

  } catch (error) {
    console.error('Error checking Wikipedia:', error);
    return false;
  }
} 