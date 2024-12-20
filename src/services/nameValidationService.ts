import { names } from '../lib/womendatabase.json';

// Helper function to normalize names for comparison
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/-/g, ' ')               // Replace hyphens with spaces
    .trim();                          // Remove leading/trailing whitespace
}

// Get list of valid mononyms from database
function getValidMononyms(): Set<string> {
  return new Set(
    names
      .filter(name => !name.includes(' '))  // Get only single-word names
      .map(name => normalizeNameForComparison(name))
  );
}

// Check if input is likely just a first name
function isValidSingleName(name: string): boolean {
  // Split the name and check if it's just one word
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length !== 1) {
    return true; // If it's more than one word, it's valid
  }

  // Common name prefixes that might indicate a stage name
  const artistPrefixes = ['dj', 'mc', 'dr'];
  const normalizedName = normalizeNameForComparison(name);
  
  // If the name has any of these prefixes, it's likely a stage name
  if (artistPrefixes.some(prefix => normalizedName.startsWith(prefix))) {
    return true;
  }

  // Check against our database of valid mononyms
  const validMononyms = getValidMononyms();
  return validMononyms.has(normalizedName);
}

// Check if name exists in local database
function checkLocalDatabase(name: string): boolean {
  const normalizedInputName = normalizeNameForComparison(name);
  
  return names.some(dbName => {
    const normalizedDbName = normalizeNameForComparison(dbName);
    return normalizedDbName === normalizedInputName;
  });
}

export async function checkWikipedia(name: string): Promise<boolean> {
  // First check local database
  if (checkLocalDatabase(name)) {
    return true;
  }

  // Reject invalid single names before making API call
  if (!isValidSingleName(name)) {
    return false;
  }

  try {
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query.search.length === 0) {
      return false;
    }

    for (let result of searchData.query.search) {
      const normalizedTitle = result.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');
      
      if (!normalizedTitle.includes(normalizedName)) {
        continue;
      }

      const pageId = result.pageid;
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&pageids=${pageId}&format=json&origin=*`;
      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();

      const page = contentData.query.pages[pageId];
      const intro = page.extract || '';

      // Additional check for articles about mononyms/stage names
      if (name.trim().split(/\s+/).length === 1) {
        const mononymIndicators = [
          'stage name', 'mononym', 'professional name', 'known professionally',
          'stage persona', 'performing name', 'artistic name', 'pseudonym',
          'singer', 'artist', 'performer', 'musician', 'actress', 'known as'
        ];
        const hasMononymIndicator = mononymIndicators.some(indicator => 
          intro.toLowerCase().includes(indicator)
        );
        
        if (!hasMononymIndicator) {
          continue; // Skip this result if it doesn't indicate a stage name/mononym
        }
      }

      const plainText = intro.replace(/<[^>]*>/g, '');
      const femaleIndicators = [
        'she', 'her', 'hers', 'woman', 'female', 'girl', 'actress',
        'chairwoman', 'congresswoman', 'businesswoman', 'feminist',
        'spokeswoman', 'singer', 'performer'
      ];
      const words = plainText.toLowerCase().split(/\s+/);
      const firstFemaleIndicator = words.find((word: string) => femaleIndicators.includes(word));

      if (firstFemaleIndicator) {
        return true;
      }
    }

    return false;

  } catch (error) {
    console.error('Error checking Wikipedia:', error);
    return false;
  }
}