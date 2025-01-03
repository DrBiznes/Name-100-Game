## Introduction

*"Name a single historical woman! Wait, not her - name another one! Keep going..."*

It started with a challenge from Twitch streamer QTCinderella in early 2024[^1]. A simple premise that sparked a fascinating realization about our collective knowledge of women's achievements throughout history. The challenge quickly gained traction, with streamers and content creators testing their knowledge - including NorthernLion's legendary 7:11 speed run[^2].

But attempting the challenge and building a system to verify it are two very different beasts[^3]. When I started developing Name100Women, the skeptics had plenty to say:

- "The Wikipedia API will rate limit you to death"
- "You'll never handle all the edge cases with names"
- "What about non-English names?"

They weren't entirely wrong - but they weren't right either. Here's how we built it.

## The Technology

### Name Validation System

Our verification system evolved through three increasingly sophisticated layers[^4]:

1. Local database lookup
2. Wikipedia API verification
3. Special case handling (like mononyms)

```typescript title="careful bit twiddling"
// From nameValidationService.ts
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/-/g, ' ')               // Replace hyphens with spaces
    .replace(/\./g, '')              // Remove periods
    .trim();                          // Remove leading/trailing whitespace
}

// Check local database first
function checkLocalDatabase(name: string): boolean {
  const normalizedInputName = normalizeNameForComparison(name);
  
  return names.some(dbName => {
    const normalizedDbName = normalizeNameForComparison(dbName);
    return normalizedDbName === normalizedInputName;
  });
}
```

### Mononym Handling

The mononym issue first became apparent when users started entering names like "Cher" and "Beyoncé"[^5]. Our initial system rejected these as invalid since they didn't follow the expected "FirstName LastName" pattern. This led to the creation of our mononym handling system.

```typescript title="careful bit twiddling"
// From mononyms.json
{
    "mononyms": [
      {
        "name": "Aaliyah",
        "wikipedia": "/wiki/Aaliyah"
      },
      {
        "name": "Cher",
        "wikipedia": "/wiki/Cher"
      },
      // ... many more
    ]
}
```

[^1]: QTCinderella's original challenge video gained over 1 million views in 24 hours
[^2]: This run set the initial world record for the Name100Women challenge
[^3]: The technical challenges of name verification proved to be more complex than initially anticipated
[^4]: Each layer was added in response to specific challenges we encountered during development
[^5]: Mononyms presented a unique challenge for our validation system

### Wikipedia Integration

When our local database check fails, we fall back to the Wikipedia API. This requires careful verification of several factors.

```typescript title="careful bit twiddling"
// From wikipediaService.ts
export async function checkWikipedia(name: string): Promise<boolean> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query.search.length === 0) {
      return false;
    }

    // Analyze the article content for gender indicators
    const femaleIndicators = [
      'she', 'her', 'hers', 'woman', 'female', 'girl', 'actress',
      'chairwoman', 'congresswoman', 'businesswoman', 'feminist',
      'spokeswoman'
    ];

    // Verify the article is about a woman
    const pageId = searchData.query.search[0].pageid;
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&pageids=${pageId}&format=json&origin=*`;
    // ... rest of implementation
```

## Community Impact

### Contributing to the Databases

Found a missing name? Our databases are community-maintained and we welcome contributions! 

<details>
<summary>View Database Contribution Guide</summary>

1. Fork the repository
2. For regular names: Add to `src/lib/womendatabase.json`
3. For mononyms: Add to `src/lib/mononyms.json` with the corresponding Wikipedia path
4. Submit a pull request with your changes
5. Include a brief note about why this person should be included

Example mononym addition:
```json
{
  "name": "NewArtist",
  "wikipedia": "/wiki/NewArtist_(singer)"
}
```

</details>

## Future Plans

We're always looking to improve Name100Women. Some features on our roadmap:

- Integrated learning resources about each woman
- Multiplayer mode for competitive naming
- Historical timeline view of named women
- Statistics on most commonly named women

### Get Involved

Want to help make these features a reality? Here's how:

<details>
<summary>View Development Setup Guide</summary>

```bash
git clone https://github.com/yourusername/name100women.git
cd name100women
npm install
npm run dev
```

1. Check our [Issues](placeholder_link) page for current tasks
2. Create a new branch for your feature
3. Submit a PR with your changes

See our [contributing guidelines](placeholder_link) for more details.

</details>
