// News logic

// TODO: Replace with a fresh key before sharing/deploying — treat any key pasted into chat tools as compromised.
const NEWS_API_KEY = 'cec41ff4a1d38cfead988b5242f55062';
const BASE_URL = 'https://gnews.io/api/v4/search';

/**
 * Fetches news from NewsAPI.
 * @param {Object} params
 * @param {string} [params.query] - Keyword search
 * @param {string} [params.category] - Category filter
 * @returns {Promise<Object>}
 */
async function fetchNews({ query = '', category = 'All' }) {
    try {
        const isSearch = query.trim() !== '';
        const endpoint = isSearch ? 'https://gnews.io/api/v4/search' : 'https://gnews.io/api/v4/top-headlines';
        const url = new URL(endpoint);
        
        url.searchParams.append('apikey', NEWS_API_KEY);
        url.searchParams.append('lang', 'en');
        url.searchParams.append('max', '10');

        if (isSearch) {
            url.searchParams.append('q', query.trim());
        } else {
            if (category && category !== 'All') {
                const topicMap = {
                    'Technology': 'technology',
                    'World': 'world',
                    'Science': 'science',
                    'Business': 'business',
                    'Health': 'health',
                    'Sports': 'sports',
                    'Entertainment': 'entertainment'
                };
                const topic = topicMap[category] || 'general';
                url.searchParams.append('category', topic);
            }
        }

        if (isSearch) {
            console.log(`[URL 2: Search] Final URL: ${url.toString()}`);
        } else {
            console.log(`[URL 1: Category] Final URL: ${url.toString()}`);
        }

        const response = await fetch(url.toString());
        console.log(`[Raw Response] status: ${response.status}`);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: Please check your API key.');
            } else if (response.status === 429) {
                throw new Error('Rate limited: Too many requests to the News API.');
            }
            throw new Error(`Bad response: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        
        console.log(`[Parsed Data] totalArticles: ${data.totalArticles}, articles.length: ${data.articles ? data.articles.length : 0}`);

        if (data.errors) {
            const errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors));
            throw new Error(`API Error: ${errorMsg}`);
        }

        if (!data.articles || data.articles.length === 0) {
            throw new Error('No results: We could not find any news matching your criteria.');
        }

        // Apply client side category filter if it's a search
        if (isSearch && category && category !== 'All') {
            const catLower = category.toLowerCase();
            const filteredArticles = data.articles.filter(article => {
                // If API returned category, use it. Otherwise, fallback to basic text inclusion.
                if (article.category) {
                    return article.category.toLowerCase() === catLower;
                }
                const text = ((article.title || '') + ' ' + (article.description || '') + ' ' + (article.content || '')).toLowerCase();
                return text.includes(catLower);
            });
            
            if (filteredArticles.length === 0) {
                throw new Error('No results: We could not find any news matching your criteria after category filtering.');
            }
            data.articles = filteredArticles;
            data.totalArticles = filteredArticles.length;
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Network error: Unable to connect to the news server. Please check your internet connection.');
        }
        throw error; // Re-throw custom errors
    }
}

const mockNewsData = [
    // Technology (6)
    {
        title: "New AI Processor Promises 10x Performance Boost for Edge Devices",
        description: "Leading chip manufacturers have unveiled a revolutionary new architecture that dramatically reduces power consumption while providing unprecedented processing capabilities for local AI models.",
        urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "TechCrunch" },
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Technology"
    },
    {
        title: "Quantum Computing Milestone Achieved by International Research Team",
        description: "Scientists have successfully demonstrated a 1000-qubit processor that maintains stability at room temperature, potentially revolutionizing cryptography and complex simulations.",
        urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Wired" },
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Technology"
    },
    {
        title: "Next-Gen AR Glasses: A Step Closer to Widespread Adoption",
        description: "A startup has revealed a sleek, lightweight pair of augmented reality glasses that look like standard eyewear, promising an all-day wearable experience.",
        urlToImage: "https://images.unsplash.com/photo-1622979135240-caa6648190b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "The Verge" },
        publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Technology"
    },
    {
        title: "Major Cybersecurity Flaw Discovered in Popular Smart Home Hubs",
        description: "Security researchers have identified a zero-day vulnerability affecting millions of smart home devices, urging users to update their firmware immediately.",
        urlToImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Ars Technica" },
        publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Technology"
    },
    {
        title: "New Battery Technology Promises 1000-Mile Range for EVs",
        description: "A breakthrough in solid-state battery design could double the current range of electric vehicles while drastically reducing charging times and fire risks.",
        urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Electrek" },
        publishedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Technology"
    },
    {
        title: "Tech Giants Announce Collaborative Effort on Open Source AI Safety",
        description: "Several leading technology companies have formed a consortium to develop and share open-source tools for ensuring the safe deployment of artificial intelligence systems.",
        urlToImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "CNET" },
        publishedAt: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Technology"
    },
    
    // World (6)
    {
        title: "Global Summit Reaches Historic Agreement on Climate Action Goals",
        description: "Leaders from over 190 countries have signed a comprehensive treaty aiming to accelerate the transition to renewable energy and significantly reduce carbon emissions by 2030.",
        urlToImage: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "World"
    },
    {
        title: "Historic Peace Treaty Signed After Decades of Conflict",
        description: "Representatives from both nations gathered in neutral territory today to finalize an agreement that establishes normalized relations and opens borders for trade and travel.",
        urlToImage: "https://images.unsplash.com/photo-1473649085228-583485e6e4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "BBC News" },
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "World"
    },
    {
        title: "UN General Assembly Votes on Sweeping Reforms to Security Council",
        description: "In a landmark decision, member states voted overwhelmingly to restructure the UN Security Council, adding new permanent seats to better reflect current global demographics.",
        urlToImage: "https://images.unsplash.com/photo-1526618456100-20e36ff296e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Al Jazeera" },
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "World"
    },
    {
        title: "Major Infrastructure Project Completes Final Phase Connecting Two Continents",
        description: "An unprecedented undersea tunnel system spanning the strait has officially opened to rail traffic, promising to dramatically boost international trade and travel.",
        urlToImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "The Guardian" },
        publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "World"
    },
    {
        title: "Historic Elections Conclude Peacefully Despite Earlier Tensions",
        description: "Voters turned out in record numbers as the closely watched national elections concluded without major incident, with preliminary results expected tomorrow.",
        urlToImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "AP News" },
        publishedAt: new Date(Date.now() - 31 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "World"
    },
    {
        title: "International Coalition Pledges Historic Amount for Global Famine Relief",
        description: "A coalition of developed nations and philanthropic organizations has announced a multi-billion dollar fund aimed at addressing critical food shortages in vulnerable regions.",
        urlToImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "NPR" },
        publishedAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "World"
    },

    // Science (6)
    {
        title: "Astronomers Discover Potentially Habitable Exoplanet in Nearby System",
        description: "Using the James Webb Space Telescope, researchers have identified water vapor signatures in the atmosphere of K2-18b, a super-Earth located just 120 light-years away in the Leo constellation.",
        urlToImage: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Space.com" },
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Science"
    },
    {
        title: "Breakthrough in Genetic Engineering Could Eliminate Inherited Diseases",
        description: "A new CRISPR-based technique has shown a 99% success rate in repairing faulty DNA sequences associated with several severe hereditary conditions in early clinical trials.",
        urlToImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Nature" },
        publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Science"
    },
    {
        title: "Deep Sea Expedition Uncovers Entirely New Ecosystem",
        description: "Marine biologists exploring the Mariana Trench have discovered a thriving, previously unknown ecosystem of bioluminescent organisms living entirely cut off from sunlight.",
        urlToImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "National Geographic" },
        publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Science"
    },
    {
        title: "Researchers Synthesize Room-Temperature Superconductor Under High Pressure",
        description: "A team of physicists has successfully demonstrated superconductivity at near room temperature, though currently requiring pressures similar to those found near the center of the Earth.",
        urlToImage: "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Scientific American" },
        publishedAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Science"
    },
    {
        title: "New Paleontological Dig Reveals Missing Link in Avian Evolution",
        description: "A remarkably well-preserved fossil discovered in northeastern China provides crucial new evidence demonstrating the gradual transition from feathered dinosaurs to modern birds.",
        urlToImage: "https://images.unsplash.com/photo-1518534825945-81628d0b2f15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Smithsonian Magazine" },
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Science"
    },
    {
        title: "Mars Rover Detects Complex Organic Molecules in Ancient Riverbed",
        description: "NASA's Perseverance rover has identified diverse organic compounds in rocks from the Jezero Crater, offering the strongest tantalizing hints yet of potential past microbial life on the Red Planet.",
        urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "NASA" },
        publishedAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Science"
    },

    // Business (6)
    {
        title: "Markets Rally as Inflation Shows Signs of Cooling Down",
        description: "Major indices hit all-time highs today following the latest economic report, which indicated that consumer prices grew at a slower pace than anticipated last month.",
        urlToImage: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Wall Street Journal" },
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Business"
    },
    {
        title: "E-Commerce Giant Announces Plans for Drone Delivery Fleet",
        description: "The massive retail corporation has received regulatory approval to begin testing automated aerial deliveries in select metropolitan areas starting next quarter.",
        urlToImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Bloomberg" },
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Business"
    },
    {
        title: "Global Shipping Congestion Finally Eases, Promising Lower Freight Costs",
        description: "After nearly two years of severe supply chain disruptions, major international ports are reporting normalized processing times, leading to a sharp drop in container shipping rates.",
        urlToImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Financial Times" },
        publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Business"
    },
    {
        title: "Leading Automaker Announces Complete Shift to Electric Vehicles by 2030",
        description: "One of the world's largest car manufacturers has pledged to phase out all internal combustion engine models within the decade, investing heavily in new battery manufacturing plants.",
        urlToImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Forbes" },
        publishedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Business"
    },
    {
        title: "Mergers and Acquisitions Reach Record High in Tech Sector",
        description: "A flurry of multi-billion dollar buyouts has characterized the first half of the year, as legacy corporations acquire aggressive startups to bolster their digital transformation strategies.",
        urlToImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "CNBC" },
        publishedAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Business"
    },
    {
        title: "Central Banks Hint at Potential Interest Rate Cuts in Upcoming Quarter",
        description: "Facing stabilizing inflation and a cooling labor market, major central bank governors signaled a potential pivot toward more accommodative monetary policies in the near future.",
        urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Business"
    },

    // Health (6)
    {
        title: "New Study Links Mediterranean Diet to Improved Cognitive Function",
        description: "A decade-long research project involving over 10,000 participants suggests that adhering to a diet rich in olive oil, nuts, and fish can slow age-related mental decline.",
        urlToImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Healthline" },
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Health"
    },
    {
        title: "Revolutionary mRNA Vaccine Shows Promise Against Multiple Cancer Types",
        description: "Early phase trials of a personalized mRNA-based cancer vaccine have demonstrated significant tumor shrinkage in patients with previously untreatable advanced melanomas and lung cancers.",
        urlToImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "The Lancet" },
        publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Health"
    },
    {
        title: "WHO Announces Global Initiative to Eradicate Tropical Disease",
        description: "The World Health Organization has launched an ambitious new funding program aimed at completely eliminating a parasitic infection affecting millions in the developing world by 2035.",
        urlToImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "BBC News" },
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Health"
    },
    {
        title: "Advances in Telemedicine Make Rural Healthcare More Accessible",
        description: "New satellite internet initiatives and diagnostic wearables are bringing specialist consultations and robust monitoring capabilities to remote communities previously lacking care options.",
        urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Medscape" },
        publishedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Health"
    },
    {
        title: "Novel Wearable Device Continuously Monitors Blood Sugar Without Needles",
        description: "A biotech startup has received FDA approval for a non-invasive smartwatch attachment that uses sophisticated optical sensors to track glucose levels in real-time.",
        urlToImage: "https://images.unsplash.com/photo-1510017803434-a899398421b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Wired" },
        publishedAt: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Health"
    },
    {
        title: "Breakthrough Treatment for Alzheimer's Granted Fast-Track Approval",
        description: "Regulatory agencies have expedited the approval process for a novel monoclonal antibody therapy that has shown remarkable efficacy in clearing amyloid plaques in early-stage patients.",
        urlToImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "STAT News" },
        publishedAt: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Health"
    },

    // Sports (6)
    {
        title: "Underdog Team Secures Unlikely Victory in Championship Finals",
        description: "In a stunning upset, the wild card entrants defeated the defending champions in double overtime, capping off one of the most memorable seasons in recent sports history.",
        urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "ESPN" },
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Sports"
    },
    {
        title: "Record-Breaking Crowd Attends Global Esports Tournament",
        description: "Over 100,000 fans packed the stadium while millions more watched online as the world's top teams competed for a prize pool exceeding $50 million.",
        urlToImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Polygon" },
        publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Sports"
    },
    {
        title: "Legendary Athlete Announces Retirement After 20-Year Career",
        description: "The multi-time world champion and Olympic gold medalist delivered an emotional farewell speech to fans, confirming that this season will be their last in professional competition.",
        urlToImage: "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Sports Illustrated" },
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Sports"
    },
    {
        title: "International Sporting Event Announces New Mixed-Gender Relay Event",
        description: "Organizers have revealed a new format aiming to promote inclusivity, featuring teams of male and female competitors racing together in a dynamic, highly strategic relay competition.",
        urlToImage: "https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Sports"
    },
    {
        title: "Surprising Draft Day Trades Shake Up Professional League Landscape",
        description: "Several blockbuster trades were executed during the first round of the draft, seeing top-tier veteran talent swapped for promising rookies and future draft picks.",
        urlToImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Bleacher Report" },
        publishedAt: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Sports"
    },
    {
        title: "Marathon Runner Breaks Long-Standing World Record by Margin of Two Minutes",
        description: "Running in near-perfect conditions, the elite distance runner shattered a record that had stood for nearly a decade, crossing the finish line in a historic, unprecedented time.",
        urlToImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Runner's World" },
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Sports"
    },

    // Entertainment (6)
    {
        title: "Award-Winning Director Announces Surprising Return to Indie Roots",
        description: "After a string of massive blockbusters, the visionary filmmaker has revealed their next project will be a low-budget, character-driven drama shot entirely on 16mm film.",
        urlToImage: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Variety" },
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Entertainment"
    },
    {
        title: "Highly Anticipated Sci-Fi Sequel Shatters Opening Weekend Box Office Records",
        description: "Riding a wave of glowing critical reviews and intense fan excitement, the visually stunning epic surpassed all industry projections to become the biggest opening of the year.",
        urlToImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "The Hollywood Reporter" },
        publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Entertainment"
    },
    {
        title: "Classic Video Game Franchise to Receive Prestige Television Adaptation",
        description: "A major streaming network has greenlit an ambitious, high-budget live-action series based on the beloved fantasy RPG series, promising a faithful adaptation of the expansive lore.",
        urlToImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "IGN" },
        publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Entertainment"
    },
    {
        title: "Surprise Album Drop by Pop Icon Breaks Streaming Records Overnight",
        description: "Without any prior marketing or announcement, the superstar released a deeply personal 15-track album at midnight, crashing several major music streaming platforms due to immense traffic.",
        urlToImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Rolling Stone" },
        publishedAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Entertainment"
    },
    {
        title: "Independent Film Sweeps Major Categories at International Festival",
        description: "A hauntingly beautiful, low-budget thriller from a first-time director took home the top prize, beating out several highly anticipated offerings from established cinematic auteurs.",
        urlToImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "IndieWire" },
        publishedAt: new Date(Date.now() - 29 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Entertainment"
    },
    {
        title: "Streaming Wars Intensify as Major Platform Merges with Legacy Studio",
        description: "In a massive industry shakeup, two entertainment behemoths have announced a merger that will consolidate a vast library of classic IP under a single, highly competitive subscription service.",
        urlToImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        source: { name: "Deadline" },
        publishedAt: new Date(Date.now() - 39 * 60 * 60 * 1000).toISOString(),
        url: "#",
        category: "Entertainment"
    }
];

/**
 * Returns mock news data filtered by query and category.
 * @param {Object} params
 * @param {string} [params.query] - Keyword search
 * @param {string} [params.category] - Category filter
 * @returns {Promise<Object>}
 */
async function getMockNews({ query = '', category = 'All' }) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredArticles = mockNewsData;

    if (category && category !== 'All') {
        filteredArticles = filteredArticles.filter(
            article => article.category && article.category.toLowerCase() === category.toLowerCase()
        );
        console.log(`After category filter (${category}): ${filteredArticles.length}`);
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        filteredArticles = filteredArticles.filter(
            article => 
                article.title.toLowerCase().includes(lowerQuery) || 
                article.description.toLowerCase().includes(lowerQuery)
        );
        console.log(`After query filter (${query}): ${filteredArticles.length}`);
    }

    if (filteredArticles.length === 0) {
        throw new Error('No results: We could not find any news matching your criteria.');
    }

    return {
        status: "ok",
        totalArticles: filteredArticles.length,
        articles: filteredArticles
    };
}

/**
 * Main function to get news. Tries fetchNews first, falls back to getMockNews on failure.
 * @param {Object} params
 * @param {string} [params.query]
 * @param {string} [params.category]
 * @returns {Promise<Object>}
 */
async function getNews({ query = '', category = 'All' } = {}) {
    console.log(`[Flow 4/5] getNews called with: { query: '${query}', category: '${category}' }`);
    try {
        const data = await fetchNews({ query, category });
        console.log(`[Flow 4/5] fetchNews succeeded.`);
        data._source = 'live';
        return data;
    } catch (error) {
        console.warn(`[Flow 4/5] fetchNews failed (${error.message}). Falling back to mock data.`);
        const data = await getMockNews({ query, category });
        data._source = 'mock';
        return data;
    }
}
window.getNews = getNews;