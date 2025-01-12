import { names } from '../lib/womendatabase.json';

// Helper function to normalize names for comparison
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/-/g, ' ')               // Replace hyphens with spaces
    .replace(/\./g, '')              // Remove periods
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
  const artistPrefixes = ['dj', 'mc', 'dr', 'h.e.r'];
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
    const normalizedName = name.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/-/g, ' ');

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query.search.length === 0) {
      return false;
    }

    for (let result of searchData.query.search) {
      const normalizedTitle = result.title.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/-/g, ' ');
      
      if (!normalizedTitle.includes(normalizedName)) {
        continue;
      }

      const pageId = result.pageid;
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&pageids=${pageId}&format=json&origin=*`;
      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();

      const page = contentData.query.pages[pageId];
      const intro = page.extract || '';

      // Handle mononyms/stage names first
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

      const plainText = intro.replace(/<[^>]*>/g, '').toLowerCase();
      
      // Split into sentences for more precise analysis
      const sentences = plainText.split(/[.!?]+/);
      
      // Check first few sentences for fiction indicators
      const fictionIndicators = [
        'fictional', 'character', 'tv series', 'television series',
        'novel', 'book series', 'comic', 'manga', 'anime', 'video game',
        'movie character', 'film character', 'cartoon', 'sitcom', 'drama series'
      ];
      
      // Check first three sentences for fiction indicators
      const firstFewSentences = sentences.slice(0, 3).join(' ');
      const isFictional = fictionIndicators.some(indicator => 
        firstFewSentences.includes(indicator)
      );
      
      if (isFictional) {
        return false;
      }

      // Check for male indicators
      const malePronouns = ['he', 'his', 'him', 'himself'];
      const maleIndicators = [
        'male', 'man', 'boy', 'actor', 'businessman', 'chairman',
        'spokesman', 'congressman', ...malePronouns
      ];

      // Check first few sentences for gender indicators
      for (let sentence of sentences.slice(0, 3)) {
        const words = sentence.split(/\s+/);
        
        // Look for the first gendered pronoun or indicator
        const firstMaleIndicator = words.find((word: string) => maleIndicators.includes(word));
        const firstFemaleIndicator = words.find((word: string) => 
          ['she', 'her', 'hers', 'herself', 'woman', 'female', 'girl'].includes(word)
        );
        
        // If we find a male indicator first, reject immediately
        if (firstMaleIndicator) {
          return false;
        }
        
        // If we find a female indicator, continue checking the rest
        if (firstFemaleIndicator) {
          break;
        }
      }

      // After passing male and fiction checks, look for female confirmation
      const femaleIndicators = [
        'she', 'her', 'hers', 'herself', 'woman', 'female', 'girl', 'actress',
        'chairwoman', 'congresswoman', 'businesswoman', 'feminist',
        'spokeswoman', 'singer', 'performer'
      ];
      
      const hasFemaleIndicator = femaleIndicators.some(indicator => 
        plainText.includes(indicator)
      );

      if (hasFemaleIndicator) {
        return true;
      }
    }

    return false;

  } catch (error) {
    console.error('Error checking Wikipedia:', error);
    return false;
  }
}