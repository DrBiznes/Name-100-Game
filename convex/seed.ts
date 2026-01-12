import { mutation } from "./_generated/server";

const LEGACY_DATA = [
    // 4 JAM 103 20...
    {
        username: "JAM",
        score: 103,
        submissionDate: "2024-12-27T10:34:12.191Z",
        completedNames: ["Marie Curie", "Rosa Parks", "Jane Austen", "Frida Kahlo", "Mother Teresa", "Maya Angelou", "Florence Nightingale", "Malala", "Cleopatra", "Eleanor Roosevelt", "Marie Antoinette", "Billie HOliday", "Amelia Earhart", "Joan of Arc", "Virginia Woolf", "Emily Dickinson", "Beyonce", "Helen Keller", "Ada Lovelace", "Hillary Clinton"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 10 JAM 84 20...
    {
        username: "JAM",
        score: 84,
        submissionDate: "2024-12-27T12:38:21.371Z",
        completedNames: ["Rosa Parks", "Malala", "Michelle Obama", "Angela Merkel", "Kamala Harris", "Beyonce", "Ada Lovelace", "Ice Spice", "Marie Curie", "Jane Goodall", "Maya Angelou", "Frida Kahlo", "Virginia Woolf", "Toni Morrison", "Oprah Winfrey", "Simone Biles", "Serena Williams", "Audrey Hepburn", "Taylor Swift", "Rico Nasty"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 11 JAM 96 20...
    {
        username: "JAM",
        score: 96,
        submissionDate: "2024-12-27T12:48:50.145Z",
        completedNames: ["Eleanor Roosevelt", "Sojourner Truth", "Ruth Bader Ginsburg", "Alexandria Ocasio Cortez", "Gloria Steinem", "Margaret Hamilton", "Rachel Carson", "Barbara McClintock", "Mae Jemison", "Temple Grandin", "Georgia O'Keeffe", "Agatha Christie", "Emily Dickinson", "Zaha Hadid", "Billie Jean King", "Megan Rapinoe", "Marilyn Monroe", "Lady Gaga", "Madonna", "Beyonce"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 12 JAM 438 20...
    {
        username: "JAM",
        score: 438,
        submissionDate: "2025-01-01T08:19:55.312Z",
        completedNames: ["Grace Hopper", "Marie Curie", "Stephanie Kwolek", "Barbara Askins", "Temple Grandin", "INdra Nooyi", "Ursula Burns", "Ginni Rometty", "Mary barra", "Margaret Hamilton", "Patricia bath", "Rosalind Franklin", "Melitta Bentz", "Hedy Lamarr", "Ice Spice", "Safra Catz", "Beyonce", "Tilda Swinton", "Nancy Pelosi", "Hillary Clinton"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 13 JAM 180 20...
    {
        username: "JAM",
        score: 180,
        submissionDate: "2025-01-01T12:05:50.030Z",
        completedNames: ["PinkPantheress", "Renee Rapp", "Gracie Abrams", "Kim Petras", "Kali Uchis", "Rihanna", "Harper Lee", "Katie Ledecky", "Caroline Polachek", "Lise Meitner", "Harriet Tubman", "Jacinda Ardern", "Wangari Maathai", "Golda Meir", "Indira Gandhi", "Grace Hopper", "Ella Fitzgerald", "Lucille Ball", "Greta Garbo", "Marilyn Monroe"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 14 JAM 94 20...
    {
        username: "JAM",
        score: 94,
        submissionDate: "2025-01-01T12:18:18.860Z",
        completedNames: ["PinkPantheress", "Ice Spice", "Renee Rapp", "Gracie Abrams", "Kim Petras", "Summer Walker", "Dove Cameron", "Megan Moroney", "Kali Uchis", "Sabrina Carpenter", "Selena Gomez", "Ariana Grande", "Taylor Swift", "Miley Cyrus", "Lana Del Rey", "Dua Lipa", "Doja Cat", "Olivia Rodrigo", "Sza", "Doechii"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 15 JAM 229 20...
    {
        username: "JAM",
        score: 229,
        submissionDate: "2025-01-03T07:50:40.084Z",
        completedNames: ["Ruth Bader Ginsburg", "Malala", "Angela Merkel", "Ellen Johnson", "Wangari Maathai", "Mary Robinson", "Rosalind Franklin", "Tu Youyou", "Michelle Obama", "Jane Goodall", "Margaret Atwood", "Benazir Bhutto", "Julia Child", "Maya Lin", "Frida Kahlo", "Grace Hopper", "Beyonce", "Ice SPICE", "Rico Nasty", "Sexyy Red"],
        nameCount: 20,
        usernameColor: "#50ed3b"
    },
    // 16 ASS 1877 100...
    {
        username: "ASS",
        score: 1877,
        submissionDate: "2025-01-09T04:18:46.434Z",
        completedNames: ["Kesha", "Hillary Clinton", "Monica Lewinsky", "Taylor Swift", "Julia Child", "Regina King", "Sophie", "Cindy lee", "Bjork", "Kate Bush", "Joan Jett", "Tina Turner", "Demi Lovato", "Michelle Obama", "Ethel Cain", "Nancy pelosi", "Patti Smith", "Brandi Carlile", "Soccer Mommy", "Kim Deal", "Brie Larson", "Aubrey Plaza", "Jenna Ortega", "Sadie Sink", "Angel Reese", "Caitlin Clark", "Janet Jackson", "Sade", "Erykah Badu", "Kirsty MacColl", "Jessie Ware", "Mitski", "Japanese Breakfast", "Snail Mail", "Cher", "Madonna", "Selena Gomez", "Zendaya", "Emma Stone", "calamity Jane", "Skyler White", "Kim Wexler", "Sabrina Carpenter", "Susan Sontag", "Patricia Jackson", "Lena Raine", "Princess Peach", "Princess Daisy", "Maya hawke", "Yoko Ono", "Amy Schumer", "Kamala Harris", "Ruth Bader Ginsburg", "Ellen Degeneres", "Sylvia Plath", "Greta Gerwig", "Nancy Reagan", "Emma Watson", "Jodie Foster", "Julia Roberts", "Meryl Streep", "Emily Green", "Emily Blunt", "Meg White", "Amy winehouse", "Adele", "Lauren Bacall", "Ethel Barrymore", "grimes", "Halle Berry", "Madison Beer", "Alison Brie", "lizzy caplan", "Gina Carano", "jennifer carpenter", "Queen Elizabeth", "Queen Elizabeth II", "Liz Truss", "Rosemary Clooney", "Moon Zappa", "Lizzo", "Ice Spice", "Doechii", "Megan Thee Stallion", "cleopatra", "Phoebe Bridgers", "Sexyy Red", "Laura Les", "charli xcx", "Nina Hagen", "Mazzy Star", "Neko Case", "Fiona Apple", "Candy Clark", "Uma Thurman", "Nicole Kidman", "Natalie Portman", "Carrie Fisher", "Daisy Ridley", "Awkwafina"],
        nameCount: 100,
        usernameColor: "#f3b239"
    },
    // 17 HII 105 20...
    {
        username: "HII",
        score: 105,
        submissionDate: "2025-01-09T05:58:09.450Z",
        completedNames: ["cher", "beyonce", "taylor swift", "lady gaga", "olivia rodrigo", "beabadoobee", "lydia night", "hayley williams", "avril lavigne", "megan thee stallion", "lorde", "charli xcx", "sabrina carpenter", "zendaya", "jane goodall", "kamala harris", "melania trump", "hillary clinton", "oprah winfrey", "chappell roan"],
        nameCount: 20,
        usernameColor: "#e79150"
    },
    // 18 JON 113 20...
    {
        username: "JON",
        score: 113,
        submissionDate: "2025-01-11T01:57:44.626Z",
        completedNames: ["caroline polachek", "Her", "Madonna", "Britney spears", "Cher", "Angela davis", "Betty davis", "Marjorie Taylor green", "Margaret thatcher", "Queen elizabeth", "Queen Elizabeth ii", "Elisa lam", "bjork", "Tilda swinton", "Winona ryder", "Anne schafer", "Marie schrader", "Skyler white", "Lois griffin", "Meg griffin"],
        nameCount: 20,
        usernameColor: "#e25582"
    },
    // 19 JON 820 50...
    {
        username: "JON",
        score: 820,
        submissionDate: "2025-01-11T19:25:40.237Z",
        completedNames: ["Tina turner", "Tina Weymouth", "Cher", "Madonna", "mother teresa", "Angela davis", "Betty davis", "Beyonce", "Taylor swift", "Anya Taylor joy", "Bjork", "Anne schafer", "Ellen degeneres", "HER", "Marjorie taylor green", "Michelle obama", "Kamala harris", "Hillary Clinton", "Nancy reagan", "Lingua ignota", "Soccer mommy", "Vashti bunyan", "Sadie sink", "Millie Bobby brown", "Winona ryder", "Maya hawke", "Billie eilish", "Britney spears", "Lady gaga", "Katy perry", "Cindy lee", "Pink", "Amelia earhart", "Deborah davis", "sophie", "Beth harmon", "Kim wexler", "Lois griffin", "meg griffin", "Skyler white", "Marie schrader", "Lisa simpson", "Marge simpson", "Maggie simpson", "meg white", "Erykah badu", "anna smith", "Anne smith", "Grace smith", "Lauren smith"],
        nameCount: 50,
        usernameColor: "#30d6df"
    },
    // 20 JAM 674 50...
    {
        username: "JAM",
        score: 674,
        submissionDate: "2025-01-12T08:41:04.545Z",
        completedNames: ["Meryl Streep", "Katharine Hepburn", "Audrey hepburn", "Cate blanchett", "Nicole kidman", "Emma stone", "Emma ross", "Frances McDormand", "Zendaya", "Florence Pugh", "Margot Robbie", "Jessica Lange", "Charli XCX", "Sophie", "Cher", "Beyonce", "Selena", "Selena gomez", "Tina Fey", "Amy poehler", "Melissa McCarthy", "Hillary Clinton", "Angela Merkel", "Monica Lewinsky", "Nancy Reagan", "Julianne moore", "Julia Louis Dreyfus", "Jennifer aniston", "Sarah Jessica parker", "Julie andrews", "Maggie smith", "Queen Elizabeth", "Rita Moreno", "Michelle yeoh", "Tilda swinton", "Charlize Theron", "emma Thompson", "Sza", "billie eilish", "Olivia rodrigo", "Sabrina carpenter", "Taylor swift", "Phoebe bridgers", "Mitski", "Japanese breakfast", "Megan thee stallion", "Doja cat", "Ice spice", "Her", "Doechii"],
        nameCount: 50,
        usernameColor: "#4ef4ee"
    },
    // 21 FIZ 441 100...
    {
        username: "FIZ",
        score: 441,
        submissionDate: "2025-02-05T04:23:49.500Z",
        completedNames: ["cleopatra", "venus williams", "serena williams", "virginia woolf", "kim deal", "michelle obama", "hillary clinton", "selena gomez", "elena delle donne", "kamala harris", "megan thee stallion", "greta thunberg", "mary lou williams", "audrey hepburn", "marilyn monroe", "caitlin clark", "eleanor roosevelt", "joan of arc", "flannery o'connor", "virgin mary", "taylor swift", "ariana grande", "sylvia plath", "george eliot", "susan b anthony", "harriet tubman", "octavia butler", "helen keller", "toni morrison", "beyonce", "doechii", "caitlyn jenner", "chappell roan", "lauryn hill", "ice spice", "cardi b", "ayn rand", "rihanna", "lady gaga", "patti smith", "maureen dowd", "ruth bader ginsburg", "barbara bush", "melania trump", "tulsi gabbard", "lisa murkowski", "paru itagaki", "q hayashida", "honor levy", "martha washington", "amy coney barrett", "ketanji brown jackson", "sonia sotomayor", "linda mcmahon", "monica lewinsky", "uma thurman", "malvina reynolds", "nancy sinatra", "mary shelley", "avril lavigne", "carli lloyd", "simone biles", "sofia coppola", "emily stone", "sofia vergara", "kaitlin olson", "portia de rossi", "ellen degeneres", "billie holiday", "billie eilish", "louise gluck", "ella fitzgerald", "olivia rodrigo", "megan fox", "meg white", "doja cat", "alison bechdel", "margaret atwood", "martha stewart", "ethel rosenberg", "kim kardashian", "kourtney kardashian", "khloe kardashian", "sharon tate", "nicole brown simpson", "squeaky fromme", "linda kasabian", "marilyn vos savant", "marie curie", "maria sharapova", "queen elizabeth", "queen anne", "maya angelou", "rupi kaur", "anna akhmatova", "elizabeth bishop", "sappho", "mary oliver", "ada limon", "gwendolyn brooks"],
        nameCount: 100,
        usernameColor: "#ee9d2b"
    },
    // 22 KYL 406 20...
    {
        username: "KYL",
        score: 406,
        submissionDate: "2025-02-16T05:04:38.639Z",
        completedNames: ["Doja cat", "Margaret thatcher", "Michelle Obama", "Taylor swift", "Emma stone", "Emma watson", "Sza", "Chappell roan", "Rachel thomas", "Harriet tubman", "Yoko ono", "Zendaya", "Ice spice", "Hillary clinton", "Ella purnell", "Sabrina carpenter", "Rosa parks", "Beyonce", "Katy Perry", "Rihanna"],
        nameCount: 20,
        usernameColor: "#2eefa2"
    },
    // 23 VAL 447 20...
    {
        username: "VAL",
        score: 447,
        submissionDate: "2025-02-23T23:14:18.423Z",
        completedNames: ["zendaya", "samia henni", "julia roberts", "margot robbie", "sarah bolton", "kendall jenner", "kim kardashian", "kris jenner", "khloe kardashian", "Phoebe bridgers", "kamala harris", "hillary clinton", "hilary duff", "rosa parks", "simone biles", "joan Didion", "Aubrey plaza", "florence pugh", "ice spice", "billie eilish"],
        nameCount: 20,
        usernameColor: "#2b7cee"
    },
    // 24 CAR 179 20...
    {
        username: "CAR",
        score: 179,
        submissionDate: "2025-02-23T23:23:52.006Z",
        completedNames: ["florence pugh", "margot robbie", "anne hathaway", "aubrey plaza", "taylor swift", "sarah bolton", "simone biles", "rosa parks", "courtney cox", "sza", "beyonce", "zendaya", "tara westover", "emma stone", "emma watson", "emma roberts", "michelle obama", "kamala harris", "hillary clinton", "hilary duff"],
        nameCount: 20,
        usernameColor: "#e042a6"
    },
    // 25 CAR 199 20...
    {
        username: "CAR",
        score: 199,
        submissionDate: "2025-02-24T00:37:52.016Z",
        completedNames: ["florence pugh", "aubrey plaza", "COURTNEY COX", "jennifer aniston", "zendaya", "queen elizabeth", "kamala harris", "sza", "taylor swift", "billie eilish", "claire rosinkranz", "lorde", "madonna", "cher", "emma stone", "emma roberts", "simone biles", "queen elisabeth", "rosa parks", "sarah bolton"],
        nameCount: 20,
        usernameColor: "#e042a6"
    },
    // 26 JUL 665 20...
    {
        username: "JUL",
        score: 665,
        submissionDate: "2025-03-04T07:07:23.021Z",
        completedNames: ["michelle obama", "taylor swift", "cleopatra", "billie eilish", "sydney sweeney", "britney spears", "zendaya", "beyonce", "rihanna", "shakira", "angelina joli", "cardi b", "harriet tubman", "kamala harris", "hillary clinton", "Monica lewinsky", "kim kardashian", "khloe kardashian", "kylie jenner", "kendall jenner"],
        nameCount: 20,
        usernameColor: "#f1e646"
    },
    // 27 GAR 2879 100...
    {
        username: "GAR",
        score: 2879,
        submissionDate: "2025-03-09T02:49:31.437Z",
        completedNames: ["lizzo", "amelia earhart", "doja cat", "celine dion", "cher", "billie eilish", "queen elizabeth", "queen elizabeth II", "jennifer lawrence", "whitney houston", "suzanne vega", "kamala harris", "melania trump", "q hayashida", "hatsune miku", "jennifer lopez", "shelley duvall", "lady gaga", "lady gagita", "chappell roan", "bjork", "christina carpenter", "little simz", "patti smith", "hillary clinton", "paris hilton", "dolly parton", "fergie", "grimes", "marge simpson", "jill biden", "alicia keys", "natalie portman", "elizabeth olsen", "mariya takeuchi", "mariah carey", "squirrel girl", "kim kardashian", "alison brie", "mia khalifa", "amy schumer", "gwen stefani", "adele", "faye webster", "winona ryder", "angelina jolie", "helen keller", "carrie fisher", "daisy ridley", "sigourney weaver", "frida kahlo", "gillian jacobs", "polly pocket", "hikaru utada", "amy poehler", "anya taylor-joy", "sabrina carpenter", "diana ross", "taeko onuki", "megan thee stallion", "taylor swift", "selena gomez", "miley cyrus", "margot robbie", "aubrey plaza", "yoko ono", "michelle obama", "alison bechdel", "beyonce", "amy adams", "ella purnell", "beth gibbons", "courtney love", "tara strong", "awkwafina", "margaret thatcher", "stevie nicks", "jk rowling", "emma stone", "emma watson", "bell hooks", "queen latifa", "zendaya", "mary berry", "eleanor roosevelt", "trisha paytas", "ice spice", "judy garland", "megan fox", "florence pugh", "millie bobby brown", "katy perry", "victoria justice", "ariana grande", "rupaul", "harriet tubman", "joan of arc", "reba mcentire", "vanessa carlton", "bella thorne"],
        nameCount: 100,
        usernameColor: "#f2367b"
    },
    // 28 BEE 1939 100...
    {
        username: "BEE",
        score: 1939,
        submissionDate: "2025-03-09T03:39:15.040Z",
        completedNames: ["aubrey plaza", "emma watson", "emma stone", "jill stein", "maia arson crimew", "rosa parks", "maria theresa", "mother theresa", "beyonce", "christina aguilera", "sarah michelle gellar", "millie bobby brown", "lizzo", "selena", "selena gomez", "joan of arc", "florence pugh", "tina turner", "amy poehler", "ingrid michaelson", "jill biden", "michelle obama", "malala", "hillary clinton", "sarah palin", "jenna marbles", "anya taylor joy", "kelly clarkson", "ariana grande", "martha stewart", "mary berry", "lucille ball", "mary shelley", "marie curie", "jennifer hudson", "jennifer aniston", "dolly parton", "reba mcentire", "patricia arquette", "vera wang", "coco chanel", "katie leung", "ellen degeneres", "judge judy", "sigourney weaver", "sabrina carpenter", "chappell roan", "alison bechdel", "helen mirren", "melissa joan hart", "harriet tubman", "lady gaga", "kristen stewart", "audrey hepburn", "marilyn monroe", "lucy liu", "carmen diaz", "doechii", "avril lavigne", "joan rivers", "paris hilton", "paula abdul", "adele", "demi lovato", "zendaya", "greta gerwig", "margot robbie", "natalie portman", "saoirse ronan", "laura dern", "jodie foster", "carmen sandiego", "hatsune miku", "natasha lyonne", "maggie smith", "reese witherspoon", "jennifer coolidge", "raini rodriguez", "jennifer lawrence", "elizabeth banks", "doja cat", "willow smith", "jada pinkett smith", "shelley duvall", "mila kunis", "winona ryder", "janet jackson", "whitney houston", "helena bonham carter", "dakota fanning", "anna kendrick", "liv tyler", "cate blanchett", "uma thurman", "janelle monae", "hikaru utada", "kate mckinnon", "dua lipa", "tilda swinton", "ruth bader ginsburg"],
        nameCount: 100,
        usernameColor: "#eb374f"
    },
    // 29 ALC 1745 100...
    {
        username: "ALC",
        score: 1745,
        submissionDate: "2025-03-09T08:09:21.138Z",
        completedNames: ["nancy pelosi", "hillary clinton", "kamala harris", "taylor swift", "beyonce", "sia", "billie eilish", "ice spice", "mitski", "fiona apple", "sofia coppola", "marjorie taylor greene", "megan fox", "addison rae", "kylie jenner", "kim kardashian", "caitlyn jenner", "hatsune miku", "st vincent", "yoko ono", "super woman", "spice girl", "spice girls", "michelle obama", "rebecca black", "avril lavigne", "hayley williams", "pokimane", "emma stone", "emma watson", "chappell roan", "sabrina carpenter", "selena gomez", "katy perry", "britney spears", "sza", "lady gaga", "audrey hepburn", "aubrey plaza", "tina fey", "cardi b", "hikaru utada", "ariana grande", "monica lewinsky", "phoebe bridgers", "lucy dacus", "amy winehouse", "adele", "selena", "princess peach", "bjork", "sandra bullock", "margaret thatcher", "cleopatra", "queen elizabeth i", "queen elizabeth ii", "queen victoria", "olivia rodrigo", "meghan trainor", "azealia banks", "kim gordon", "lizzo", "beabadoobee", "tv girl", "dasha nekrasova", "anna kendrick", "ana de armas", "rihanna", "charli xcx", "laura les", "anya taylor joy", "rosa parks", "mazzy star", "gracie abrams", "halle berry", "missy elliott", "lauren hill", "greta thunberg", "gal gadot", "brie larson", "kali uchis", "sexyy red", "anne hathaway", "glorilla", "natalie portman", "carrie fisher", "nicki minaj", "ethel cain", "hunter schafer", "grouper", "riot girl", "abigail shapiro", "serena williams", "venus williams", "princess diana", "celine dion", "jackie kennedy", "nancy reagan", "martha washington", "martha stewart"],
        nameCount: 100,
        usernameColor: "#30e8c9"
    },
    // 30 JON 154 20...
    {
        username: "JON",
        score: 154,
        submissionDate: "2025-03-12T02:01:58.031Z",
        completedNames: ["Ice spice", "pinkpantheress", "kamala harris", "caitlin clark", "whitney houston", "queen elizabeth", "queen elizabeth i", "queen elizabeth ii", "queen victoria", "margaret thatcher", "nancy reagan", "taylor swift", "beyonce", "cher", "erykah badu", "doechii", "little simz", "cardi b", "sza", "pink"],
        nameCount: 20,
        usernameColor: "#50a6e7"
    },
    // 31 JBT 325 20...
    {
        username: "JBT",
        score: 325,
        submissionDate: "2025-04-04T23:12:33.484Z",
        completedNames: ["michelle obama", "cher", "hillary clinton", "billie eilish", "doja cat", "beyonce", "marjorie taylor green", "queen elizabeth", "queen elizabeth ii", "queen victoria", "queen anne", "janet jackson", "nancy reagan", "anne schafer", "queen mary", "queen mary ii", "taylor swift", "lauren hill", "emily green", "queen latifa"],
        nameCount: 20,
        usernameColor: "#374feb"
    },
    // 32 CAR 116 20...
    {
        username: "CAR",
        score: 116,
        submissionDate: "2025-04-20T03:46:12.301Z",
        completedNames: ["florence pugh", "aubrey plaza", "bella hadid", "gigi hadid", "ilona maher", "sabrina carpenter", "emma chamberlain", "cher", "beyonce", "zendaya", "lorde", "sza", "madonna", "emma stone", "ice spice", "kim kardashian", "hillary clinton", "kamala harris", "michelle obama", "sarah bolton"],
        nameCount: 20,
        usernameColor: "#9727ec"
    },
    // 33 DOM 591 20...
    {
        username: "DOM",
        score: 591,
        submissionDate: "2025-04-20T03:58:29.245Z",
        completedNames: ["hillary clinton", "Kamala Harris", "marie currie", "angela merkel", "annika sorenstam", "marilyn monroe", "meryl streep", "michelle obama", "nancy reagan", "jill biden", "melania trump", "dolly madison", "dolly parton", "katy perry", "farrah fawcet", "jacqueline smith", "juju watkins", "caitlin clark", "margaret thatcher", "jenna bush"],
        nameCount: 20,
        usernameColor: "#5f83e7"
    },
    // 34 CAR 308 20...
    {
        username: "CAR",
        score: 308,
        submissionDate: "2025-04-20T04:02:31.034Z",
        completedNames: ["Taylor swift", "Sabrina carpenter", "Juju Watkins", "kamala Harris", "Michelle Obama", "kim kardashian", "sza", "Lorde", "Cher", "zendaya", "Emma stone", "katy perry", "Courtney cox", "Jennifer Aniston", "jennifer lopez", "aubrey plaza", "Florence Pugh", "saoirse ronan", "Emily perez", "Dolly Parton"],
        nameCount: 20,
        usernameColor: "#9727ec"
    },
    // 35 LNC 1176 100...
    {
        username: "LNC",
        score: 1176,
        submissionDate: "2025-12-09T22:40:58.530Z",
        completedNames: ["Simone Biles", "Joan of Arc", "Lucy Dacus", "Mitski", "Fiona Apple", "Phoebe Bridgers", "Hayley williams", "indigo de souza", "bell hooks", "kimberle crenshaw", "bella hadid", "kamala harris", "hillary clinton", "michelle obama", "candace owens", "ayn rand", "haliey welch", "taylor swift", "marie curie", "ada lovelace", "timnit gebru", "alexa demie", "alexis pauline gumbs", "zendaya", "alex consani", "charli xcx", "sabrina carpenter", "sonia sotomayor", "mariah carey", "mariah the scientist", "virgin mary", "sylvia plath", "gloria anzaldua", "cherrie moraga", "bjork", "missy franklin", "missy elliot", "katie ledecky", "sydney sweeney", "sydney mclaughlin-levrone", "elaine thompson herah", "maya higa", "pokimane", "valkyrae", "yasmine hamdan", "erykah badu", "lauryn hill", "jill scott", "jill scott", "jill stein", "avril lavigne", "chappell roan", "olivia rodrigo", "billie eilish", "martha stewart", "angelica hamilton", "jane doe", "alice waters", "alice glass", "whoopi goldberg", "oprah winfrey", "ellen degeneres", "kim kardashian", "kylie jenner", "kendall jenner", "kris jenner", "liza koshy", "jenna marbles", "beabadoobee", "jane fonda", "jane remover", "jk rowling", "alexandria ocasio cortez", "ilhan omar", "noura erakat", "leila khaled", "jada pinkett smith", "emma watson", "gal gadot", "angela davis", "rosa parks", "becky albertalli", "selena", "beyonce", "sza", "lizzo", "lucy liu", "julien baker", "gigi hadid", "kourtney kardashian", "addison rae", "charli d'amelio", "dixie d'amelio", "tate mcrae", "lizzy mcalpine", "monica lewinsky", "ghislaine maxwell", "francesca albanese", "lorde", "genevieve artadi", "jackie kennedy"],
        nameCount: 100,
        usernameColor: "#58e4ba"
    }
];

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        let count = 0;
        for (const data of LEGACY_DATA) {
            // Create user record if not exists
            const userIdentifier = `seeded_${data.username.toLowerCase()}`;

            const existingUser = await ctx.db
                .query("users")
                .withIndex("by_fingerprintHash", (q) => q.eq("fingerprintHash", userIdentifier))
                .first();

            if (!existingUser) {
                await ctx.db.insert("users", {
                    fingerprintHash: userIdentifier,
                    createdAt: new Date(data.submissionDate).getTime(),
                    lastSeenAt: new Date(data.submissionDate).getTime(),
                });
            }

            // Insert score
            await ctx.db.insert("scores", {
                username: data.username,
                score: data.score,
                completedNames: data.completedNames,
                nameCount: data.nameCount,
                submissionDate: new Date(data.submissionDate).getTime(),
                userIdentifier: userIdentifier,
                usernameColor: data.usernameColor,
            });
            count++;
        }
        return `Imported ${count} scores.`;
    },
});
