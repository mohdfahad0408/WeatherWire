(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();function fe(e){if(!e)return"";const t=new Date(e),r=Math.floor((new Date-t)/1e3);let o=r/31536e3;return o>1?Math.floor(o)+"y ago":(o=r/2592e3,o>1?Math.floor(o)+"mo ago":(o=r/86400,o>1?Math.floor(o)+"d ago":(o=r/3600,o>1?Math.floor(o)+"h ago":(o=r/60,o>1?Math.floor(o)+"m ago":Math.floor(r)+"s ago"))))}function Ce(e="news-grid"){const t=document.getElementById(e);if(t){t.innerHTML="";for(let n=0;n<4;n++){const r=document.createElement("article");r.className="skeleton-card",r.innerHTML=`
            <div class="skeleton-image skeleton-block"></div>
            <div class="skeleton-content">
                <div class="skeleton-title skeleton-block"></div>
                <div>
                    <div class="skeleton-desc-1 skeleton-block" style="margin-bottom: 0.5rem;"></div>
                    <div class="skeleton-desc-2 skeleton-block"></div>
                </div>
                <div class="skeleton-footer">
                    <div class="skeleton-source skeleton-block"></div>
                    <div class="skeleton-link skeleton-block"></div>
                </div>
            </div>
        `,t.appendChild(r)}}}function Ie(e,t,n="news-grid"){const r=document.getElementById(n);if(r&&(r.innerHTML=`
        <div class="error-container" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; background-color: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ef4444; margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem; color: var(--text-primary);">Oops! Something went wrong</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 400px;">${e}</p>
            ${t?`<button id="${n}-retry-btn" style="background-color: var(--accent); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Retry</button>`:""}
        </div>
    `,t)){const o=document.getElementById(`${n}-retry-btn`);o&&o.addEventListener("click",t)}}function Ee(e,t="news-grid"){const n=document.getElementById(t);if(!n)return;const r=e?` for "${e}"`:"";n.innerHTML=`
        <div class="empty-state-container" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; background-color: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem; color: var(--text-primary);">No articles available</h3>
            <p style="color: var(--text-secondary); max-width: 400px;">We couldn't find any news${r}. Try adjusting your search or selecting a different category.</p>
        </div>
    `}function Te(e,t="news-grid"){const n=document.getElementById(t);if(!n)return;if(n.innerHTML="",!e||e.length===0){n.innerHTML='<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">No articles found.</p>';return}const r=JSON.parse(localStorage.getItem("saved_articles")||"[]");e.forEach(o=>{var f;const i=document.createElement("article");i.className="news-card",i.tabIndex=0;const a=o.urlToImage||o.image||"https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",s=o.category||"News",d=`badge-${s.toLowerCase()}`,h=((f=o.source)==null?void 0:f.name)||"Unknown Source",g=fe(o.publishedAt),w=o.title||"No Title",p=o.description||"No description available.",l=o.url||"#",u=r.some(v=>v.url===l&&v.title===w);i.innerHTML=`
            <div class="card-image-container">
                <img src="${a}" alt="${w.replace(/"/g,"&quot;")}" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                <span class="card-badge ${d}">${s}</span>
                <button class="card-bookmark ${u?"saved":""}" data-article='${JSON.stringify(o).replace(/'/g,"&#39;").replace(/"/g,"&quot;")}' aria-label="Bookmark article: ${w.replace(/"/g,"&quot;")}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${u?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
            </div>

            <div class="card-content">
                <h3 class="card-title">${w}</h3>
                <p class="card-description">${p}</p>
                <div class="card-footer">
                    <div class="card-source-time">
                        <span class="card-source">${h}</span>
                        <span>&bull;</span>
                        <span class="card-time">${g}</span>
                    </div>
                    <a href="${l}" target="_blank" rel="noopener" class="card-link">Read <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>
                </div>
            </div>
        `,n.appendChild(i)})}function ne(e="news-grid"){const t=document.getElementById(e);t&&t.addEventListener("click",n=>{const r=n.target.closest(".card-bookmark");if(!r)return;r.classList.toggle("saved");const o=r.classList.contains("saved"),i=r.querySelector("svg");i&&(o?i.setAttribute("fill","currentColor"):i.setAttribute("fill","none"));try{const a=JSON.parse(r.getAttribute("data-article"));let s=JSON.parse(localStorage.getItem("saved_articles")||"[]");o?s.some(g=>g.url===a.url&&g.title===a.title&&g.title===a.title)||s.push(a):s=s.filter(g=>g.url!==a.url||g.title!==a.title||g.title!==a.title),localStorage.setItem("saved_articles",JSON.stringify(s));const d=e==="news-grid"?"dashboard-news-grid":"news-grid",h=document.getElementById(d);h&&h.querySelectorAll(".card-bookmark").forEach(w=>{try{const p=JSON.parse(w.getAttribute("data-article"));if(p.url===a.url&&p.title===a.title){w.classList.toggle("saved",o);const l=w.querySelector("svg");l&&l.setAttribute("fill",o?"currentColor":"none")}}catch{}}),!o&&window.currentView==="saved"&&r.closest(".news-card").remove()}catch(a){console.error("Error parsing article data",a)}})}ne("news-grid");ne("dashboard-news-grid");window.showNewsLoading=Ce;window.showNewsError=Ie;window.showNoNewsFound=Ee;window.renderNewsCards=Te;window.setupBookmarkDelegation=ne;window.timeAgo=fe;const Q="/api/news";async function $e({query:e="",category:t="All"}){try{const n=e.trim()!=="",r=Q.startsWith("http")?new URL(Q):new URL(Q,window.location.origin);n&&r.searchParams.append("query",e.trim()),t&&t!=="All"&&r.searchParams.append("category",t),console.log(`[News Proxy Fetch] URL: ${r.toString()}`);const o=await fetch(r.toString());if(console.log(`[Raw Response] status: ${o.status}`),!o.ok){let a=`HTTP Error ${o.status}`;try{const s=await o.json();s&&s.error&&(a=s.error)}catch{a=o.statusText||a}throw o.status===401?new Error(`Invalid API key: ${a}`):o.status===429?new Error(`Rate limit exceeded: ${a}`):o.status===403?new Error(`CORS restriction: ${a}`):new Error(a)}let i=await o.json();if(console.log(`[Parsed Data] totalArticles: ${i.totalArticles}, articles.length: ${i.articles?i.articles.length:0}`),i.errors){const a=Array.isArray(i.errors)?i.errors.join(", "):typeof i.errors=="string"?i.errors:JSON.stringify(i.errors);throw new Error(`API Error: ${a}`)}if(!i.articles||i.articles.length===0)throw new Error("No results: We could not find any news matching your criteria.");if(n&&t&&t!=="All"){const a=t.toLowerCase(),s=i.articles.filter(d=>d.category?d.category.toLowerCase()===a:((d.title||"")+" "+(d.description||"")+" "+(d.content||"")).toLowerCase().includes(a));if(s.length===0)throw new Error("No results: We could not find any news matching your criteria after category filtering.");i.articles=s,i.totalArticles=s.length}return i}catch(n){throw n instanceof TypeError?new Error("Network error: Unable to connect to the news server. Please check your internet connection."):n}}const Le=[{title:"New AI Processor Promises 10x Performance Boost for Edge Devices",description:"Leading chip manufacturers have unveiled a revolutionary new architecture that dramatically reduces power consumption while providing unprecedented processing capabilities for local AI models.",urlToImage:"https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"TechCrunch"},publishedAt:new Date(Date.now()-7200*1e3).toISOString(),url:"#",category:"Technology"},{title:"Quantum Computing Milestone Achieved by International Research Team",description:"Scientists have successfully demonstrated a 1000-qubit processor that maintains stability at room temperature, potentially revolutionizing cryptography and complex simulations.",urlToImage:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Wired"},publishedAt:new Date(Date.now()-300*60*1e3).toISOString(),url:"#",category:"Technology"},{title:"Next-Gen AR Glasses: A Step Closer to Widespread Adoption",description:"A startup has revealed a sleek, lightweight pair of augmented reality glasses that look like standard eyewear, promising an all-day wearable experience.",urlToImage:"https://images.unsplash.com/photo-1622979135240-caa6648190b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"The Verge"},publishedAt:new Date(Date.now()-660*60*1e3).toISOString(),url:"#",category:"Technology"},{title:"Major Cybersecurity Flaw Discovered in Popular Smart Home Hubs",description:"Security researchers have identified a zero-day vulnerability affecting millions of smart home devices, urging users to update their firmware immediately.",urlToImage:"https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Ars Technica"},publishedAt:new Date(Date.now()-1140*60*1e3).toISOString(),url:"#",category:"Technology"},{title:"New Battery Technology Promises 1000-Mile Range for EVs",description:"A breakthrough in solid-state battery design could double the current range of electric vehicles while drastically reducing charging times and fire risks.",urlToImage:"https://images.unsplash.com/photo-1593941707882-a5bba14938cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Electrek"},publishedAt:new Date(Date.now()-1500*60*1e3).toISOString(),url:"#",category:"Technology"},{title:"Tech Giants Announce Collaborative Effort on Open Source AI Safety",description:"Several leading technology companies have formed a consortium to develop and share open-source tools for ensuring the safe deployment of artificial intelligence systems.",urlToImage:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"CNET"},publishedAt:new Date(Date.now()-2040*60*1e3).toISOString(),url:"#",category:"Technology"},{title:"Global Summit Reaches Historic Agreement on Climate Action Goals",description:"Leaders from over 190 countries have signed a comprehensive treaty aiming to accelerate the transition to renewable energy and significantly reduce carbon emissions by 2030.",urlToImage:"https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Reuters"},publishedAt:new Date(Date.now()-10800*1e3).toISOString(),url:"#",category:"World"},{title:"Historic Peace Treaty Signed After Decades of Conflict",description:"Representatives from both nations gathered in neutral territory today to finalize an agreement that establishes normalized relations and opens borders for trade and travel.",urlToImage:"https://images.unsplash.com/photo-1473649085228-583485e6e4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"BBC News"},publishedAt:new Date(Date.now()-480*60*1e3).toISOString(),url:"#",category:"World"},{title:"UN General Assembly Votes on Sweeping Reforms to Security Council",description:"In a landmark decision, member states voted overwhelmingly to restructure the UN Security Council, adding new permanent seats to better reflect current global demographics.",urlToImage:"https://images.unsplash.com/photo-1526618456100-20e36ff296e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Al Jazeera"},publishedAt:new Date(Date.now()-840*60*1e3).toISOString(),url:"#",category:"World"},{title:"Major Infrastructure Project Completes Final Phase Connecting Two Continents",description:"An unprecedented undersea tunnel system spanning the strait has officially opened to rail traffic, promising to dramatically boost international trade and travel.",urlToImage:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"The Guardian"},publishedAt:new Date(Date.now()-1320*60*1e3).toISOString(),url:"#",category:"World"},{title:"Historic Elections Conclude Peacefully Despite Earlier Tensions",description:"Voters turned out in record numbers as the closely watched national elections concluded without major incident, with preliminary results expected tomorrow.",urlToImage:"https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"AP News"},publishedAt:new Date(Date.now()-1860*60*1e3).toISOString(),url:"#",category:"World"},{title:"International Coalition Pledges Historic Amount for Global Famine Relief",description:"A coalition of developed nations and philanthropic organizations has announced a multi-billion dollar fund aimed at addressing critical food shortages in vulnerable regions.",urlToImage:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"NPR"},publishedAt:new Date(Date.now()-2520*60*1e3).toISOString(),url:"#",category:"World"},{title:"Astronomers Discover Potentially Habitable Exoplanet in Nearby System",description:"Using the James Webb Space Telescope, researchers have identified water vapor signatures in the atmosphere of K2-18b, a super-Earth located just 120 light-years away in the Leo constellation.",urlToImage:"https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Space.com"},publishedAt:new Date(Date.now()-360*60*1e3).toISOString(),url:"#",category:"Science"},{title:"Breakthrough in Genetic Engineering Could Eliminate Inherited Diseases",description:"A new CRISPR-based technique has shown a 99% success rate in repairing faulty DNA sequences associated with several severe hereditary conditions in early clinical trials.",urlToImage:"https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Nature"},publishedAt:new Date(Date.now()-780*60*1e3).toISOString(),url:"#",category:"Science"},{title:"Deep Sea Expedition Uncovers Entirely New Ecosystem",description:"Marine biologists exploring the Mariana Trench have discovered a thriving, previously unknown ecosystem of bioluminescent organisms living entirely cut off from sunlight.",urlToImage:"https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"National Geographic"},publishedAt:new Date(Date.now()-1020*60*1e3).toISOString(),url:"#",category:"Science"},{title:"Researchers Synthesize Room-Temperature Superconductor Under High Pressure",description:"A team of physicists has successfully demonstrated superconductivity at near room temperature, though currently requiring pressures similar to those found near the center of the Earth.",urlToImage:"https://images.unsplash.com/photo-1530982011887-3cc11cc85693?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Scientific American"},publishedAt:new Date(Date.now()-1620*60*1e3).toISOString(),url:"#",category:"Science"},{title:"New Paleontological Dig Reveals Missing Link in Avian Evolution",description:"A remarkably well-preserved fossil discovered in northeastern China provides crucial new evidence demonstrating the gradual transition from feathered dinosaurs to modern birds.",urlToImage:"https://images.unsplash.com/photo-1518534825945-81628d0b2f15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Smithsonian Magazine"},publishedAt:new Date(Date.now()-2160*60*1e3).toISOString(),url:"#",category:"Science"},{title:"Mars Rover Detects Complex Organic Molecules in Ancient Riverbed",description:"NASA's Perseverance rover has identified diverse organic compounds in rocks from the Jezero Crater, offering the strongest tantalizing hints yet of potential past microbial life on the Red Planet.",urlToImage:"https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"NASA"},publishedAt:new Date(Date.now()-2760*60*1e3).toISOString(),url:"#",category:"Science"},{title:"Markets Rally as Inflation Shows Signs of Cooling Down",description:"Major indices hit all-time highs today following the latest economic report, which indicated that consumer prices grew at a slower pace than anticipated last month.",urlToImage:"https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Wall Street Journal"},publishedAt:new Date(Date.now()-14400*1e3).toISOString(),url:"#",category:"Business"},{title:"E-Commerce Giant Announces Plans for Drone Delivery Fleet",description:"The massive retail corporation has received regulatory approval to begin testing automated aerial deliveries in select metropolitan areas starting next quarter.",urlToImage:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Bloomberg"},publishedAt:new Date(Date.now()-600*60*1e3).toISOString(),url:"#",category:"Business"},{title:"Global Shipping Congestion Finally Eases, Promising Lower Freight Costs",description:"After nearly two years of severe supply chain disruptions, major international ports are reporting normalized processing times, leading to a sharp drop in container shipping rates.",urlToImage:"https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Financial Times"},publishedAt:new Date(Date.now()-900*60*1e3).toISOString(),url:"#",category:"Business"},{title:"Leading Automaker Announces Complete Shift to Electric Vehicles by 2030",description:"One of the world's largest car manufacturers has pledged to phase out all internal combustion engine models within the decade, investing heavily in new battery manufacturing plants.",urlToImage:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Forbes"},publishedAt:new Date(Date.now()-1380*60*1e3).toISOString(),url:"#",category:"Business"},{title:"Mergers and Acquisitions Reach Record High in Tech Sector",description:"A flurry of multi-billion dollar buyouts has characterized the first half of the year, as legacy corporations acquire aggressive startups to bolster their digital transformation strategies.",urlToImage:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"CNBC"},publishedAt:new Date(Date.now()-1920*60*1e3).toISOString(),url:"#",category:"Business"},{title:"Central Banks Hint at Potential Interest Rate Cuts in Upcoming Quarter",description:"Facing stabilizing inflation and a cooling labor market, major central bank governors signaled a potential pivot toward more accommodative monetary policies in the near future.",urlToImage:"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Reuters"},publishedAt:new Date(Date.now()-2700*60*1e3).toISOString(),url:"#",category:"Business"},{title:"New Study Links Mediterranean Diet to Improved Cognitive Function",description:"A decade-long research project involving over 10,000 participants suggests that adhering to a diet rich in olive oil, nuts, and fish can slow age-related mental decline.",urlToImage:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Healthline"},publishedAt:new Date(Date.now()-300*60*1e3).toISOString(),url:"#",category:"Health"},{title:"Revolutionary mRNA Vaccine Shows Promise Against Multiple Cancer Types",description:"Early phase trials of a personalized mRNA-based cancer vaccine have demonstrated significant tumor shrinkage in patients with previously untreatable advanced melanomas and lung cancers.",urlToImage:"https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"The Lancet"},publishedAt:new Date(Date.now()-660*60*1e3).toISOString(),url:"#",category:"Health"},{title:"WHO Announces Global Initiative to Eradicate Tropical Disease",description:"The World Health Organization has launched an ambitious new funding program aimed at completely eliminating a parasitic infection affecting millions in the developing world by 2035.",urlToImage:"https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"BBC News"},publishedAt:new Date(Date.now()-1080*60*1e3).toISOString(),url:"#",category:"Health"},{title:"Advances in Telemedicine Make Rural Healthcare More Accessible",description:"New satellite internet initiatives and diagnostic wearables are bringing specialist consultations and robust monitoring capabilities to remote communities previously lacking care options.",urlToImage:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Medscape"},publishedAt:new Date(Date.now()-1500*60*1e3).toISOString(),url:"#",category:"Health"},{title:"Novel Wearable Device Continuously Monitors Blood Sugar Without Needles",description:"A biotech startup has received FDA approval for a non-invasive smartwatch attachment that uses sophisticated optical sensors to track glucose levels in real-time.",urlToImage:"https://images.unsplash.com/photo-1510017803434-a899398421b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Wired"},publishedAt:new Date(Date.now()-2040*60*1e3).toISOString(),url:"#",category:"Health"},{title:"Breakthrough Treatment for Alzheimer's Granted Fast-Track Approval",description:"Regulatory agencies have expedited the approval process for a novel monoclonal antibody therapy that has shown remarkable efficacy in clearing amyloid plaques in early-stage patients.",urlToImage:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"STAT News"},publishedAt:new Date(Date.now()-2640*60*1e3).toISOString(),url:"#",category:"Health"},{title:"Underdog Team Secures Unlikely Victory in Championship Finals",description:"In a stunning upset, the wild card entrants defeated the defending champions in double overtime, capping off one of the most memorable seasons in recent sports history.",urlToImage:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"ESPN"},publishedAt:new Date(Date.now()-3600*1e3).toISOString(),url:"#",category:"Sports"},{title:"Record-Breaking Crowd Attends Global Esports Tournament",description:"Over 100,000 fans packed the stadium while millions more watched online as the world's top teams competed for a prize pool exceeding $50 million.",urlToImage:"https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Polygon"},publishedAt:new Date(Date.now()-420*60*1e3).toISOString(),url:"#",category:"Sports"},{title:"Legendary Athlete Announces Retirement After 20-Year Career",description:"The multi-time world champion and Olympic gold medalist delivered an emotional farewell speech to fans, confirming that this season will be their last in professional competition.",urlToImage:"https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Sports Illustrated"},publishedAt:new Date(Date.now()-960*60*1e3).toISOString(),url:"#",category:"Sports"},{title:"International Sporting Event Announces New Mixed-Gender Relay Event",description:"Organizers have revealed a new format aiming to promote inclusivity, featuring teams of male and female competitors racing together in a dynamic, highly strategic relay competition.",urlToImage:"https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Reuters"},publishedAt:new Date(Date.now()-1440*60*1e3).toISOString(),url:"#",category:"Sports"},{title:"Surprising Draft Day Trades Shake Up Professional League Landscape",description:"Several blockbuster trades were executed during the first round of the draft, seeing top-tier veteran talent swapped for promising rookies and future draft picks.",urlToImage:"https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Bleacher Report"},publishedAt:new Date(Date.now()-2100*60*1e3).toISOString(),url:"#",category:"Sports"},{title:"Marathon Runner Breaks Long-Standing World Record by Margin of Two Minutes",description:"Running in near-perfect conditions, the elite distance runner shattered a record that had stood for nearly a decade, crossing the finish line in a historic, unprecedented time.",urlToImage:"https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Runner's World"},publishedAt:new Date(Date.now()-2880*60*1e3).toISOString(),url:"#",category:"Sports"},{title:"Award-Winning Director Announces Surprising Return to Indie Roots",description:"After a string of massive blockbusters, the visionary filmmaker has revealed their next project will be a low-budget, character-driven drama shot entirely on 16mm film.",urlToImage:"https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Variety"},publishedAt:new Date(Date.now()-10800*1e3).toISOString(),url:"#",category:"Entertainment"},{title:"Highly Anticipated Sci-Fi Sequel Shatters Opening Weekend Box Office Records",description:"Riding a wave of glowing critical reviews and intense fan excitement, the visually stunning epic surpassed all industry projections to become the biggest opening of the year.",urlToImage:"https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"The Hollywood Reporter"},publishedAt:new Date(Date.now()-540*60*1e3).toISOString(),url:"#",category:"Entertainment"},{title:"Classic Video Game Franchise to Receive Prestige Television Adaptation",description:"A major streaming network has greenlit an ambitious, high-budget live-action series based on the beloved fantasy RPG series, promising a faithful adaptation of the expansive lore.",urlToImage:"https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"IGN"},publishedAt:new Date(Date.now()-780*60*1e3).toISOString(),url:"#",category:"Entertainment"},{title:"Surprise Album Drop by Pop Icon Breaks Streaming Records Overnight",description:"Without any prior marketing or announcement, the superstar released a deeply personal 15-track album at midnight, crashing several major music streaming platforms due to immense traffic.",urlToImage:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Rolling Stone"},publishedAt:new Date(Date.now()-1260*60*1e3).toISOString(),url:"#",category:"Entertainment"},{title:"Independent Film Sweeps Major Categories at International Festival",description:"A hauntingly beautiful, low-budget thriller from a first-time director took home the top prize, beating out several highly anticipated offerings from established cinematic auteurs.",urlToImage:"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"IndieWire"},publishedAt:new Date(Date.now()-1740*60*1e3).toISOString(),url:"#",category:"Entertainment"},{title:"Streaming Wars Intensify as Major Platform Merges with Legacy Studio",description:"In a massive industry shakeup, two entertainment behemoths have announced a merger that will consolidate a vast library of classic IP under a single, highly competitive subscription service.",urlToImage:"https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",source:{name:"Deadline"},publishedAt:new Date(Date.now()-2340*60*1e3).toISOString(),url:"#",category:"Entertainment"}];async function De({query:e="",category:t="All"}){await new Promise(r=>setTimeout(r,500));let n=Le;if(t&&t!=="All"&&(n=n.filter(r=>r.category&&r.category.toLowerCase()===t.toLowerCase()),console.log(`After category filter (${t}): ${n.length}`)),e){const r=e.toLowerCase();n=n.filter(o=>o.title.toLowerCase().includes(r)||o.description.toLowerCase().includes(r)),console.log(`After query filter (${e}): ${n.length}`)}if(n.length===0)throw new Error("No results: We could not find any news matching your criteria.");return{status:"ok",totalArticles:n.length,articles:n}}const ae=new Map,Me=300*1e3,J=new Map;async function Be({query:e="",category:t="All"}={}){const n=(e||"").trim(),r=(t||"All").trim(),o=`${n.toLowerCase()}:${r.toLowerCase()}`;console.log(`[Flow 4/5] getNews called with: { query: '${n}', category: '${r}' }`);const i=ae.get(o);if(i&&Date.now()-i.timestamp<Me)return console.log(`[Client Cache Hit] Returning cached data for key: "${o}"`),i.data;if(J.has(o))return console.log(`[Request Collapsed] Sharing in-flight request for key: "${o}"`),J.get(o);const a=(async()=>{try{const s=await $e({query:n,category:r});return console.log("[Flow 4/5] fetchNews succeeded."),s._source="live",ae.set(o,{data:s,timestamp:Date.now()}),s}catch(s){console.warn(`[Flow 4/5] fetchNews failed (${s.message}). Falling back to mock data.`);const d=await De({query:n,category:r});return d._source="mock",d}finally{J.delete(o)}})();return J.set(o,a),a}window.getNews=Be;const se={sun:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  `,moon:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  `,cloud:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud">
      <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-2.3-3-4.35-3C9.1 8 7.4 9.85 7.4 12.05c-.8.05-1.4.12-2.1.51A3.75 3.75 0 0 0 5.75 20h11.75Z"/>
    </svg>
  `,"cloud-rain":`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
      <path d="M16 14v6"/>
      <path d="M8 14v6"/>
      <path d="M12 16v6"/>
    </svg>
  `,"cloud-drizzle":`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-drizzle">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
      <path d="M8 19v1"/>
      <path d="M12 21v1"/>
      <path d="M16 19v1"/>
    </svg>
  `,"cloud-lightning":`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-lightning">
      <path d="M6 16.3A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.25 8.4"/>
      <path d="m13 13.5-3 5.5h4.5L11.5 24"/>
    </svg>
  `,snowflake:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-snowflake">
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <path d="m20 16-4-4 4-4"/>
      <path d="m4 8 4 4-4 4"/>
      <path d="m16 4-4 4-4-4"/>
      <path d="m8 20 4-4 4 4"/>
    </svg>
  `,wind:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wind">
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2"/>
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/>
      <path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>
    </svg>
  `,droplet:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet">
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,compass:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-compass">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  `,thermometer:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
    </svg>
  `,search:`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  `,bell:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  `,plus:`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  `,remove:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
    </svg>
  `,"map-pin":`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `,loading:`
    <svg class="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="path" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"></circle>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  `};function k(e,t=""){const n=se[e]||se.cloud;return t?n.replace(/class="([^"]*)"/,`class="$1 ${t}"`):n}function ve(e){const t=Number(e);return t===0?"sun":[1,2,3].includes(t)||[45,48].includes(t)?"cloud":[51,53,55,56,57].includes(t)?"cloud-drizzle":[61,63,65,66,67,80,81,82].includes(t)?"cloud-rain":[71,73,75,77,85,86].includes(t)?"snowflake":[95,96,99].includes(t)?"cloud-lightning":"cloud"}function le(e){const t=Number(e);return t===0?"Clear Skies":t===1?"Mainly Clear":t===2?"Partly Cloudy":t===3?"Overcast":t===45||t===48?"Foggy":t===51||t===53||t===55?"Drizzle":t===61||t===63||t===65?"Rainy":t===66||t===67?"Freezing Rain":t===71||t===73||t===75?"Snowy":t===77?"Snow Grains":t===80||t===81||t===82?"Rain Showers":t===85||t===86?"Snow Showers":t===95||t===96||t===99?"Thunderstorm":"Cloudy"}function Ne(e,t,n="C"){const r=document.getElementById("chart-container");if(!r)return;r.innerHTML="";const o=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=r.clientWidth||600,a=r.clientHeight||180;o.setAttribute("width","100%"),o.setAttribute("height","100%"),o.setAttribute("viewBox",`0 0 ${i} ${a}`),o.setAttribute("preserveAspectRatio","none"),o.style.overflow="visible",r.appendChild(o);const s=["6 AM","8 AM","10 AM","12 PM","2 PM","4 PM","6 PM","8 PM","10 PM"],d=["6 AM","","10 AM","","2 PM","4 PM","6 PM","","10 PM"],h=40,g=40,w=i-h*2,p=a-g*2,l=Math.min(...e)-1.5,f=Math.max(...e)+1.5-l,v=e.map((m,b)=>{const A=h+b/(e.length-1)*w,y=g+(1-(m-l)/(f||1))*p;return{x:A,y,temp:m,time:s[b],displayTime:d[b]}}),D=document.createElementNS("http://www.w3.org/2000/svg","defs"),S=document.createElementNS("http://www.w3.org/2000/svg","linearGradient");S.setAttribute("id","strokeGrad"),S.setAttribute("x1","0%"),S.setAttribute("y1","0%"),S.setAttribute("x2","100%"),S.setAttribute("y2","0%");const _=document.createElementNS("http://www.w3.org/2000/svg","stop");_.setAttribute("offset","0%"),_.setAttribute("stop-color","#60A5FA");const F=document.createElementNS("http://www.w3.org/2000/svg","stop");F.setAttribute("offset","100%"),F.setAttribute("stop-color","#2563EB"),S.appendChild(_),S.appendChild(F);const L=document.createElementNS("http://www.w3.org/2000/svg","linearGradient");L.setAttribute("id","fillGrad"),L.setAttribute("x1","0%"),L.setAttribute("y1","0%"),L.setAttribute("x2","0%"),L.setAttribute("y2","100%");const M=document.createElementNS("http://www.w3.org/2000/svg","stop");M.setAttribute("offset","0%"),M.setAttribute("stop-color","#3B82F6"),M.setAttribute("stop-opacity",t==="dark"?"0.3":"0.15");const O=document.createElementNS("http://www.w3.org/2000/svg","stop");O.setAttribute("offset","100%"),O.setAttribute("stop-color","#3B82F6"),O.setAttribute("stop-opacity","0.00"),L.appendChild(M),L.appendChild(O),D.appendChild(S),D.appendChild(L),o.appendChild(D),v.forEach(m=>{const b=document.createElementNS("http://www.w3.org/2000/svg","line");b.setAttribute("x1",m.x),b.setAttribute("y1",g),b.setAttribute("x2",m.x),b.setAttribute("y2",a-g+10),b.setAttribute("stroke",t==="dark"?"#1E293B":"#E2E8F0"),b.setAttribute("stroke-dasharray","4,4"),b.setAttribute("stroke-width","1"),o.appendChild(b)});let U=`M ${v[0].x} ${v[0].y}`;for(let m=0;m<v.length-1;m++){const b=v[m],A=v[m+1],y=b.x+(A.x-b.x)/3,H=b.y,x=b.x+2*(A.x-b.x)/3,c=A.y;U+=` C ${y} ${H}, ${x} ${c}, ${A.x} ${A.y}`}const G=document.createElementNS("http://www.w3.org/2000/svg","path"),N=`${U} L ${v[v.length-1].x} ${a-g} L ${v[0].x} ${a-g} Z`;G.setAttribute("d",N),G.setAttribute("fill","url(#fillGrad)"),o.appendChild(G);const E=document.createElementNS("http://www.w3.org/2000/svg","path");E.setAttribute("d",U),E.setAttribute("fill","none"),E.setAttribute("stroke","url(#strokeGrad)"),E.setAttribute("stroke-width","3"),E.setAttribute("stroke-linecap","round"),o.appendChild(E);let I=document.getElementById("chart-tooltip");I||(I=document.createElement("div"),I.id="chart-tooltip",I.className="chart-tooltip",r.appendChild(I)),v.forEach((m,b)=>{if(m.displayTime){const c=document.createElementNS("http://www.w3.org/2000/svg","text");c.setAttribute("x",m.x),c.setAttribute("y",a-12),c.setAttribute("text-anchor","middle"),c.setAttribute("fill",t==="dark"?"#64748B":"#94A3B8"),c.setAttribute("font-size","11"),c.setAttribute("font-family","var(--font-sans)"),c.setAttribute("font-weight","500"),c.textContent=m.displayTime,o.appendChild(c)}const A=document.createElementNS("http://www.w3.org/2000/svg","text");A.setAttribute("x",m.x),A.setAttribute("y",m.y-12),A.setAttribute("text-anchor","middle"),A.setAttribute("fill",t==="dark"?"#94A3B8":"#64748B"),A.setAttribute("font-size","11"),A.setAttribute("font-family","var(--font-sans)"),A.setAttribute("font-weight","600"),A.textContent=`${m.temp}°`,o.appendChild(A);const y=document.createElementNS("http://www.w3.org/2000/svg","circle");y.setAttribute("cx",m.x),y.setAttribute("cy",m.y),y.setAttribute("r","4.5"),y.setAttribute("fill",t==="dark"?"#0F172A":"#FFFFFF"),y.setAttribute("stroke","#3B82F6"),y.setAttribute("stroke-width","2.5"),y.setAttribute("class","chart-dot-node"),y.style.transition="all 0.15s ease",o.appendChild(y);const H=w/(e.length-1),x=document.createElementNS("http://www.w3.org/2000/svg","rect");x.setAttribute("x",m.x-H/2),x.setAttribute("y",g-10),x.setAttribute("width",H),x.setAttribute("height",p+20),x.setAttribute("fill","transparent"),x.style.cursor="pointer",x.addEventListener("mouseenter",c=>{y.setAttribute("r","6.5"),y.setAttribute("stroke-width","3.5"),y.setAttribute("fill","#3B82F6"),I.innerHTML=`
        <div class="tooltip-time">${m.time}</div>
        <div class="tooltip-temp">${m.temp}°${n}</div>
      `,I.style.opacity="1",r.getBoundingClientRect();const q=I.getBoundingClientRect(),z=m.x-q.width/2,j=m.y-q.height-20;I.style.transform=`translate(${z}px, ${j}px)`}),x.addEventListener("mouseleave",()=>{y.setAttribute("r","4.5"),y.setAttribute("stroke-width","2.5"),y.setAttribute("fill",t==="dark"?"#0F172A":"#FFFFFF"),I.style.opacity="0"}),o.appendChild(x)})}let R={onSearchInput:()=>{},onCitySelect:()=>{},onThemeToggle:()=>{},onAddCity:()=>{},onDeleteCity:()=>{}};function $(e){return(localStorage.getItem("temp_unit")||"C")==="F"?Math.round(e*9/5+32):e}function qe(e){R={...R,...e},Re()}function Re(){const e=document.getElementById("city-search-input"),t=document.getElementById("search-results-dropdown");e&&t&&(e.addEventListener("input",o=>{const i=o.target.value;i.trim().length>=2?R.onSearchInput(i.trim()):(t.classList.remove("active"),t.innerHTML="")}),document.addEventListener("click",o=>{!e.contains(o.target)&&!t.contains(o.target)&&t.classList.remove("active")}),e.addEventListener("focus",()=>{t.children.length>0&&t.classList.add("active")}));const n=document.getElementById("dashboard-city-search-input"),r=document.getElementById("dashboard-search-results-dropdown");n&&r&&(n.addEventListener("input",o=>{const i=o.target.value;i.trim().length>=2?R.onSearchInput(i.trim()):(r.classList.remove("active"),r.innerHTML="")}),document.addEventListener("click",o=>{!n.contains(o.target)&&!r.contains(o.target)&&r.classList.remove("active")}),n.addEventListener("focus",()=>{r.children.length>0&&r.classList.add("active")}))}function be(e){const t=document.getElementById("theme-toggle");t&&(t.innerHTML=e==="light"?'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>')}function _e(e){const t=document.getElementById("search-results-dropdown"),n=document.getElementById("dashboard-search-results-dropdown"),r=o=>{if(o){if(e.length===0){o.classList.remove("active"),o.innerHTML="";return}o.innerHTML=e.map(i=>`
      <div class="search-item" data-lat="${i.latitude}" data-lon="${i.longitude}" data-name="${i.name}" data-country="${i.country_code||"US"}" data-timezone="${i.timezone||"GMT"}">
        <span class="search-item-pin">${k("map-pin")}</span>
        <div class="search-item-details">
          <span class="search-item-name">${i.name}${i.admin1?", "+i.admin1:""}</span>
          <span class="search-item-country">${i.country||i.country_code||"United States"}</span>
        </div>
      </div>
    `).join(""),o.classList.add("active"),o.querySelectorAll(".search-item").forEach(i=>{i.addEventListener("click",()=>{const a={name:i.getAttribute("data-name"),lat:parseFloat(i.getAttribute("data-lat")),lon:parseFloat(i.getAttribute("data-lon")),country:i.getAttribute("data-country"),timezone:i.getAttribute("data-timezone")},s=document.getElementById("city-search-input"),d=document.getElementById("dashboard-city-search-input");s&&(s.value=""),d&&(d.value=""),t.classList.remove("active"),n&&n.classList.remove("active"),R.onCitySelect(a)})})}};r(t),r(n)}function Fe(){const e=document.getElementById("weather-dashboard-content");e&&(e.innerHTML=`
      <div class="weather-loading-container">
        ${k("loading")}
        <p>Fetching weather data...</p>
      </div>
    `);const t=document.getElementById("dashboard-weather-widget");t&&(t.innerHTML=`
      <div class="weather-loading-container" style="min-height: 200px;">
        ${k("loading")}
        <p>Updating weather...</p>
      </div>
    `)}function He(e,t){const n=document.getElementById("weather-dashboard-content");if(n){n.innerHTML=`
      <div class="weather-error-container">
        <div class="weather-error-title">Loading Failed</div>
        <p class="weather-error-message">${e||"Could not fetch weather data. Check your network connection."}</p>
        <button class="weather-retry-btn" id="error-retry-btn">Retry</button>
      </div>
    `;const o=document.getElementById("error-retry-btn");o&&t&&o.addEventListener("click",t)}const r=document.getElementById("dashboard-weather-widget");if(r){r.innerHTML=`
      <div class="weather-error-container" style="min-height: 200px;">
        <p class="weather-error-message">${e||"Could not fetch weather."}</p>
        <button class="weather-retry-btn" id="db-error-retry-btn" style="padding: 6px 14px; font-size: 12px;">Retry</button>
      </div>
    `;const o=document.getElementById("db-error-retry-btn");o&&t&&o.addEventListener("click",t)}}function P(e,t,n){const r=document.getElementById("weather-dashboard-content");if(r){r.innerHTML=`
      <div class="dashboard-grid">
        <!-- Left side: Hero Card, SVG Chart, Air Conditions -->
        <div class="left-column">
          <section id="hero-panel"></section>
          
          <section class="weather-card chart-card">
            <h2 class="card-title">Today's Temperature</h2>
            <div class="chart-wrapper" id="chart-container">
              <!-- SVG rendered dynamically -->
            </div>
          </section>

          <section class="weather-card air-card">
            <h2 class="card-title">Air & Conditions</h2>
            <div class="air-grid-row" id="air-conditions-container"></div>
          </section>
        </div>

        <!-- Right side: 7-Day Forecast, Stats Cards, Saved Cities -->
        <div class="right-column">
          <section class="weather-card forecast-card">
            <h2 class="card-title">7-Day Forecast</h2>
            <div class="forecast-list-row" id="forecast-list-container"></div>
          </section>

          <section class="stats-grid" id="stats-grid-container"></section>

          <section class="weather-card saved-cities-card">
            <div class="saved-header-row">
              <h2 class="card-title">Saved Cities</h2>
              <button class="add-city-btn" id="add-active-city-btn" title="Pin Current City">
                ${k("plus")}
              </button>
            </div>
            <div class="saved-cities-grid" id="saved-cities-container"></div>
          </section>
        </div>
      </div>
    `,ce(e,"hero-panel"),de(e,"air-conditions-container"),ue(e.forecast,"forecast-list-container"),Pe(e,"stats-grid-container"),Oe(t,e,"saved-cities-container");const i=localStorage.getItem("temp_unit")||"C",a=e.chartData.map(d=>$(d));Ne(a,n,i);const s=document.getElementById("add-active-city-btn");s&&(t.some(h=>h.name.toLowerCase()===e.name.toLowerCase())?(s.style.opacity="0.4",s.style.cursor="not-allowed",s.title="City already saved"):s.addEventListener("click",()=>{R.onAddCity({name:e.name,lat:e.lat,lon:e.lon,country:e.country,timezone:e.timezone||"auto"})}))}const o=document.getElementById("dashboard-weather-widget");o&&(o.innerHTML=`
      <div id="db-hero-panel"></div>
      <div class="weather-card air-card" style="margin-top: 1rem;">
        <h2 class="card-title">Air & Conditions</h2>
        <div class="air-grid-row" id="db-air-conditions-container"></div>
      </div>
      <div class="weather-card forecast-card" style="margin-top: 1rem;">
        <h2 class="card-title">Upcoming Forecast</h2>
        <div class="forecast-list-row" id="db-forecast-list-container"></div>
      </div>
    `,ce(e,"db-hero-panel"),de(e,"db-air-conditions-container"),ue(e.forecast.slice(0,4),"db-forecast-list-container"))}function ce(e,t){const n=document.getElementById(t);if(!n)return;const r=new Date,o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],a=o[r.getDay()],s=i[r.getMonth()],d=r.getDate();let h=r.getHours();const g=r.getMinutes().toString().padStart(2,"0"),w=h>=12?"PM":"AM";h=h%12,h=h||12;const p=`${h}:${g} ${w}`,l=`${a}, ${s} ${d} • ${p}`,u=localStorage.getItem("temp_unit")||"C",f=$(e.temp),v=$(e.feelsLike),D=$(e.high),S=$(e.low);n.innerHTML=`
    <div class="hero-card">
      <div class="hero-top-row">
        <div class="hero-meta">
          <h1 class="hero-location-name">
            ${e.name} <span class="country-pill-badge">${e.country}</span>
          </h1>
          <span class="hero-date">${l}</span>
        </div>
        <div class="hero-icon-container">
          ${k(ve(e.weatherCode))}
        </div>
      </div>
      
      <div class="hero-center-row">
        <div class="hero-temp">${f}°${u}</div>
        <div class="hero-condition-details">
          <span class="hero-condition-text">${e.condition}</span>
          <span class="hero-feels-like">Feels like ${v}°${u}</span>
          <span class="hero-high-low">H:${D}° L:${S}°</span>
        </div>
      </div>
      
      <div class="hero-subcards-row">
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${k("droplet")} Humidity
          </span>
          <span class="hero-subcard-value">${e.humidity}%</span>
        </div>
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${k("wind")} Wind
          </span>
          <span class="hero-subcard-value">${e.windSpeed} km/h</span>
        </div>
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${k("eye")} Visibility
          </span>
          <span class="hero-subcard-value">${e.visibility} km</span>
        </div>
      </div>
    </div>
  `}function de(e,t){const n=document.getElementById(t);n&&(n.innerHTML=`
    <!-- AQI card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${e.aqiBg}">
        ${k("compass")}
      </div>
      <span class="air-subcard-value">${e.aqi}</span>
      <span class="air-subcard-label">AQI</span>
      <span class="air-subcard-desc ${e.aqiClass}">${e.aqiStatus}</span>
    </div>

    <!-- UV Index card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${e.uvBg}">
        ${k("sun")}
      </div>
      <span class="air-subcard-value">${e.uv}</span>
      <span class="air-subcard-label">UV Index</span>
      <span class="air-subcard-desc ${e.uvClass}">${e.uvStatus}</span>
    </div>

    <!-- Pressure card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${e.pressureBg}">
        ${k("thermometer")}
      </div>
      <span class="air-subcard-value">${e.pressure} hPa</span>
      <span class="air-subcard-label">Pressure</span>
      <span class="air-subcard-desc ${e.pressureClass}">${e.pressureStatus}</span>
    </div>
  `)}function ue(e,t){const n=document.getElementById(t);n&&(n.innerHTML=e.map((r,o)=>`
    <div class="forecast-day-col ${o===0?"active":""}" data-index="${o}">
      <span class="forecast-day-name">${r.day}</span>
      <div class="forecast-day-icon">
        ${k(r.icon)}
      </div>
      <div class="forecast-temps">
        <span class="forecast-temp-max">${$(r.max)}°</span>
        <span class="forecast-temp-min">${$(r.min)}°</span>
      </div>
    </div>
  `).join(""),n.querySelectorAll(".forecast-day-col").forEach(r=>{r.addEventListener("click",()=>{n.querySelectorAll(".forecast-day-col").forEach(o=>o.classList.remove("active")),r.classList.add("active")})}))}function Pe(e,t){const n=document.getElementById(t);if(!n)return;const r=localStorage.getItem("temp_unit")||"C",o=$(e.feelsLike),i=$(e.high),a=$(e.low);n.innerHTML=`
    <!-- Wind card -->
    <div class="stat-card">
      <div class="stat-header">
        ${k("wind")}
      </div>
      <div class="stat-value">${e.windSpeed} km/h</div>
      <div class="stat-label-details">
        <span class="stat-title">Wind Speed</span>
        <span class="stat-subtitle">${e.windDirection}</span>
      </div>
    </div>

    <!-- Humidity card -->
    <div class="stat-card">
      <div class="stat-header">
        ${k("droplet")}
      </div>
      <div class="stat-value">${e.humidity}%</div>
      <div class="stat-label-details">
        <span class="stat-title">Humidity</span>
        <span class="stat-subtitle">${e.humidity>60?"High dew point":"Normal dew point"}</span>
      </div>
    </div>

    <!-- Visibility card -->
    <div class="stat-card">
      <div class="stat-header">
        ${k("eye")}
      </div>
      <div class="stat-value">${e.visibility} km</div>
      <div class="stat-label-details">
        <span class="stat-title">Visibility</span>
        <span class="stat-subtitle">${e.visibility>10?"Clear":"Foggy / Hazy"}</span>
      </div>
    </div>

    <!-- Feels Like card -->
    <div class="stat-card">
      <div class="stat-header">
        ${k("thermometer")}
      </div>
      <div class="stat-value">${o}°${r}</div>
      <div class="stat-label-details">
        <span class="stat-title">Feels Like</span>
        <span class="stat-subtitle">H:${i}° L:${a}°</span>
      </div>
    </div>
  `}function Oe(e,t,n){const r=document.getElementById(n);if(r){if(e.length===0){r.innerHTML='<div style="grid-column: span 2; text-align: center; color: var(--color-text-secondary); font-size: 13px; padding: 20px;">No saved cities. Search and pin one!</div>';return}r.innerHTML=e.map(o=>{const i=o.name.toLowerCase()===t.name.toLowerCase();let a="--°",s="Fetch data";if(i)a=`${$(t.temp)}°`,s=t.condition;else{const h={"new york":{temp:25,desc:"Clear Skies"},london:{temp:14,desc:"Light Rain"},tokyo:{temp:28,desc:"Sunny"},"san francisco":{temp:18,desc:"Partly Cloudy"}}[o.name.toLowerCase()];h?(a=`${$(h.temp)}°`,s=h.desc):(a=`${$(16)}°`,s="Partly Cloudy")}return`
      <div class="saved-city-item ${i?"active":""}" data-name="${o.name}" data-lat="${o.lat}" data-lon="${o.lon}" data-country="${o.country}" data-timezone="${o.timezone||"auto"}">
        <span class="saved-city-name">${o.name}</span>
        <div class="saved-city-weather">
          <span class="saved-city-temp">${a}</span>
          <span>•</span>
          <span>${s}</span>
        </div>
        <button class="saved-city-delete-btn" title="Remove city" data-name="${o.name}" data-country="${o.country}">
          ${k("remove")}
        </button>
      </div>
    `}).join(""),r.querySelectorAll(".saved-city-item").forEach(o=>{o.addEventListener("click",i=>{if(i.target.closest(".saved-city-delete-btn"))return;const a={name:o.getAttribute("data-name"),lat:parseFloat(o.getAttribute("data-lat")),lon:parseFloat(o.getAttribute("data-lon")),country:o.getAttribute("data-country"),timezone:o.getAttribute("data-timezone")};R.onCitySelect(a)})}),r.querySelectorAll(".saved-city-delete-btn").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const a=o.getAttribute("data-name"),s=o.getAttribute("data-country");R.onDeleteCity(a,s)})})}}function ze(e){if(e==null)return"SW direction";const t=Math.floor(e/45+.5);return["N direction","NE direction","E direction","SE direction","S direction","SW direction","W direction","NW direction"][t%8]}function We(e){return e<=50?{text:"GOOD",class:"text-good",bgClass:"status-good-bg"}:e<=100?{text:"MODERATE",class:"text-moderate",bgClass:"status-moderate-bg"}:e<=150?{text:"UNHEALTHY (SG)",class:"text-unhealthy",bgClass:"status-unhealthy-bg"}:{text:"UNHEALTHY",class:"text-unhealthy",bgClass:"status-unhealthy-bg"}}function Ue(e){return e<=2?{text:"LOW",class:"text-good",bgClass:"status-good-bg"}:e<=5?{text:"MODERATE",class:"text-moderate",bgClass:"status-moderate-bg"}:e<=7?{text:"HIGH",class:"text-high",bgClass:"status-high-bg"}:{text:"VERY HIGH",class:"text-extreme",bgClass:"status-extreme-bg"}}function Ge(e){return e<1009?{text:"LOW",class:"text-low",bgClass:"status-low-bg"}:e>1020?{text:"HIGH",class:"text-high",bgClass:"status-high-bg"}:{text:"NORMAL",class:"text-normal",bgClass:"status-normal-bg"}}async function je(e){if(!e||e.trim().length<2)return[];try{const t=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(e)}&count=5&language=en&format=json`,n=await fetch(t);if(!n.ok)throw new Error("Geocoding failed");return(await n.json()).results||[]}catch(t){return console.error("Geocoding API error:",t),[]}}async function Ve(e,t,n,r="US",o="auto"){const i=encodeURIComponent(o),a=`https://api.open-meteo.com/v1/forecast?latitude=${e}&longitude=${t}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${i}`,s=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${e}&longitude=${t}&current=us_aqi,uv_index&timezone=${i}`;try{const[d,h]=await Promise.allSettled([fetch(a).then(c=>{if(!c.ok)throw new Error(`HTTP error ${c.status}`);return c.json()}),fetch(s).then(c=>{if(!c.ok)throw new Error(`HTTP error ${c.status}`);return c.json()})]);if(d.status==="rejected")throw new Error("Failed to fetch core weather data: "+d.reason.message);const g=d.value,w=h.status==="fulfilled"?h.value:null,p=g.current,l=g.hourly,u=g.daily,f=Math.round(p.temperature_2m),v=Math.round(p.apparent_temperature),D=Math.round(p.relative_humidity_2m),S=Math.round(p.wind_speed_10m),_=ze(p.wind_direction_10m),F=p.visibility?Math.round(p.visibility/1e3):16,L=Math.round(p.surface_pressure),M=p.weather_code,O=le(M),U=u&&u.temperature_2m_max?Math.round(u.temperature_2m_max[0]):f+3,G=u&&u.temperature_2m_min?Math.round(u.temperature_2m_min[0]):f-4;let N=42,E=5;w&&w.current?(N=Math.round(w.current.us_aqi||42),E=Math.round(w.current.uv_index||5)):M===0?(E=f>25?8:5,N=35):[1,2,3].includes(M)?(E=f>25?6:4,N=40):(E=2,N=20);const I=We(N),m=Ue(E),b=Ge(L),y=[6,8,10,12,14,16,18,20,22].map(c=>l&&l.temperature_2m&&l.temperature_2m[c]!==void 0?Math.round(l.temperature_2m[c]):Math.round(f+Math.sin((c-14)/4)*4)),H=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],x=[];if(u&&u.time)for(let c=0;c<Math.min(u.time.length,7);c++){const q=new Date(u.time[c]),z=H[q.getDay()],j=Math.round(u.temperature_2m_max[c]),xe=Math.round(u.temperature_2m_min[c]),ie=u.weather_code[c];x.push({day:z,desc:le(ie),icon:ve(ie),max:j,min:xe})}else{const c=new Date;for(let q=0;q<7;q++){const z=new Date(c);z.setDate(c.getDate()+q);const j=H[z.getDay()];x.push({day:j,desc:"Partly Cloudy",icon:"cloud",max:f+2,min:f-3})}}return{name:n,country:r.toUpperCase(),lat:e,lon:t,temp:f,condition:O,feelsLike:v,high:U,low:G,humidity:D,windSpeed:S,windDirection:_,visibility:F,aqi:N,aqiStatus:I.text,aqiClass:I.class,aqiBg:I.bgClass,uv:E,uvStatus:m.text,uvClass:m.class,uvBg:m.bgClass,pressure:L,pressureStatus:b.text,pressureClass:b.class,pressureBg:b.bgClass,chartData:y,forecast:x,weatherCode:M}}catch(d){throw console.error("fetchWeatherData orchestration error:",d),d}}const ye="weather_dashboard_saved_cities",Ae="weather_dashboard_active_city",he=[{name:"San Francisco",lat:37.7749,lon:-122.4194,country:"US"},{name:"New York",lat:40.7128,lon:-74.006,country:"US"},{name:"London",lat:51.5074,lon:-.1278,country:"GB"},{name:"Tokyo",lat:35.6762,lon:139.6503,country:"JP"}],me={name:"San Francisco",lat:37.7749,lon:-122.4194,country:"US"},ee={};function Je(){const e=localStorage.getItem(Ae);try{return e?JSON.parse(e):me}catch{return me}}function Ye(e){!e||!e.name||localStorage.setItem(Ae,JSON.stringify(e))}function B(){const e=localStorage.getItem(ye);try{return e?JSON.parse(e):he}catch{return he}}function Se(e){localStorage.setItem(ye,JSON.stringify(e))}function Qe(e){if(!e||!e.name)return;const t=B();t.some(r=>r.name.toLowerCase()===e.name.toLowerCase()&&r.country.toLowerCase()===e.country.toLowerCase())||(t.push(e),Se(t))}function Ke(e,t){let n=B();n=n.filter(r=>!(r.name.toLowerCase()===e.toLowerCase()&&r.country.toLowerCase()===t.toLowerCase())),Se(n)}function Ze(e,t){ee[e.toLowerCase()]={timestamp:Date.now(),data:t}}function Xe(e){const t=ee[e.toLowerCase()];return t?Date.now()-t.timestamp>900*1e3?(delete ee[e.toLowerCase()],null):t.data:null}const et=!0;let te="All",oe="",T=[],Y=null,K=null,Z=0,X=null,C=null;function re(e){const t=document.getElementById("article-count");t&&(t.textContent=`${e} article${e!==1?"s":""}`),Y=new Date,ge(),K&&clearInterval(K),K=setInterval(ge,6e4)}function ge(){const e=document.getElementById("last-updated");e&&Y&&(Math.floor((new Date-Y)/1e3)<60?e.textContent="Updated just now":e.textContent=`Updated ${window.timeAgo?window.timeAgo(Y.toISOString()):"recently"}`)}function ke(e,t){!e||e.length===0||e.sort((n,r)=>{if(t==="newest")return new Date(r.publishedAt||0)-new Date(n.publishedAt||0);if(t==="oldest")return new Date(n.publishedAt||0)-new Date(r.publishedAt||0);if(t==="popular"){const o=n.popularity||(n.title?n.title.length:0);return(r.popularity||(r.title?r.title.length:0))-o}return 0})}function pe(e){const t=document.getElementById("debug-badge");t&&(t.style.display="inline-block",e==="live"?(t.textContent="Live API",t.style.backgroundColor="#10b981"):e==="mock"?(t.textContent="Mock Data",t.style.backgroundColor="#f59e0b"):t.style.display="none")}async function V(e=""){window.currentView="news";const t=document.getElementById("saved-articles-btn");t&&(t.style.color="inherit");const n=document.querySelector("#news-view .news-header-titles h2");n&&(n.textContent="News Feed"),oe=e,console.log(`[News Flow] handleLocationNews started for: "${e}". Category: "${te}".`),window.showNewsLoading("news-grid"),pe(null);const r=++Z;try{const o=await window.getNews({query:e,category:te});if(r!==Z)return;if(pe(o._source),o&&o.articles&&o.articles.length>0){T=o.articles;const i=document.getElementById("news-sort"),a=i?i.value:"newest";ke(T,a),window.renderNewsCards(T,"news-grid"),re(T.length)}else T=[],window.showNoNewsFound(e,"news-grid")}catch(o){if(r!==Z)return;T=[],o.message&&o.message.includes("No results")?window.showNoNewsFound(e,"news-grid"):window.showNewsError(o.message||"An error occurred while fetching news.",()=>V(e),"news-grid")}}async function tt(e=""){const t="dashboard-news-grid",n=document.getElementById("dashboard-article-count"),r=document.getElementById("dashboard-debug-badge");window.showNewsLoading(t),r&&(r.style.display="none");try{const o=await window.getNews({query:e,category:"All"});if(o&&o.articles&&o.articles.length>0){const i=o.articles.slice(0,4);window.renderNewsCards(i,t),n&&(n.textContent=`${o.articles.length} article${o.articles.length!==1?"s":""}`),r&&et&&(r.style.display="inline-block",o._source==="live"?(r.textContent="Live API",r.style.backgroundColor="#10b981"):(r.textContent="Mock Data",r.style.backgroundColor="#f59e0b"))}else window.showNoNewsFound(e,t),n&&(n.textContent="0 articles")}catch{window.showNoNewsFound(e,t),n&&(n.textContent="0 articles")}}async function W(e){Fe();try{const t=Xe(e.name);if(t)C=t;else{const r=await Ve(e.lat,e.lon,e.name,e.country||"US",e.timezone||"auto");Ze(e.name,r),C=r}Ye(e);const n=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";P(C,B(),n),tt(e.name),V(e.name)}catch(t){console.error("Error loading weather data:",t),He(`Could not retrieve weather data for ${e.name}. Please check your connection.`,()=>W(e))}}function ot(e){X&&clearTimeout(X),X=setTimeout(async()=>{if(e.length<2)return;const t=await je(e);_e(t)},300)}function rt(e){Qe(e);const t=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";C&&P(C,B(),t)}function nt(e,t){Ke(e,t);const n=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";C&&P(C,B(),n)}function we(){const t=(document.documentElement.getAttribute("data-theme")==="light"?"light":"dark")==="light"?"dark":"light";t==="light"?(document.documentElement.setAttribute("data-theme","light"),localStorage.setItem("theme","light")):(document.documentElement.removeAttribute("data-theme"),localStorage.setItem("theme","dark")),be(t),C&&P(C,B(),t)}function it(){const e=document.querySelectorAll(".nav-tab");e.forEach(t=>{t.addEventListener("click",()=>{e.forEach(o=>o.classList.remove("active")),t.classList.add("active");const n=t.dataset.tab;document.querySelectorAll(".tab-content").forEach(o=>{o.classList.remove("active")});const r=document.getElementById(`${n}-view`);r&&r.classList.add("active"),(n==="weather"||n==="dashboard")&&C&&setTimeout(()=>{const o=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";P(C,B(),o)},50)})})}document.addEventListener("DOMContentLoaded",()=>{qe({onSearchInput:ot,onCitySelect:W,onThemeToggle:we,onAddCity:rt,onDeleteCity:nt}),it();const e=localStorage.getItem("theme"),t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches,n=e==="light"||!e&&t?"light":"dark";n==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme"),be(n);const r=document.getElementById("theme-toggle");r&&r.addEventListener("click",we);let o=localStorage.getItem("temp_unit")||"C";const i=document.getElementById("temp-toggle-btn");i&&(i.textContent=`°${o}`,i.addEventListener("click",()=>{if(o=o==="C"?"F":"C",localStorage.setItem("temp_unit",o),i.textContent=`°${o}`,C){const l=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";P(C,B(),l)}}));const a=Je();navigator.geolocation?navigator.geolocation.getCurrentPosition(async l=>{const u=l.coords.latitude,f=l.coords.longitude;try{const v=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${u}&longitude=${f}&localityLanguage=en`,D=await fetch(v);if(!D.ok)throw new Error("Reverse geocoding failed");const S=await D.json(),_=S.city||S.locality||S.principalSubdivision||"My Location",F=S.countryCode||"US";W({name:_,lat:u,lon:f,country:F,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"auto"})}catch(v){console.warn("Reverse geocoding failed, falling back to default city:",v),W(a)}},l=>{console.warn("Geolocation permission denied or failed, falling back to default city:",l),W(a)},{timeout:1e4}):W(a);const s=document.getElementById("news-search");let d;s&&s.addEventListener("input",l=>{clearTimeout(d),d=setTimeout(()=>{const u=l.target.value.trim();V(u||a.name)},300)});const h=document.querySelectorAll(".category-filters .filter-btn");h.forEach(l=>{l.addEventListener("click",u=>{h.forEach(v=>v.classList.remove("active")),u.target.classList.add("active"),te=u.target.dataset.category||"All";const f=s&&s.value.trim()?s.value.trim():oe;V(f)})});const g=document.getElementById("news-sort");g&&g.addEventListener("change",l=>{T.length>0&&(ke(T,l.target.value),window.renderNewsCards(T,"news-grid"),re(T.length))});const w=document.getElementById("saved-articles-btn");w&&w.addEventListener("click",()=>{if(window.currentView=window.currentView==="saved"?"news":"saved",window.currentView==="saved"){const l=document.querySelector('.nav-tab[data-tab="news"]');l&&l.click(),w.style.color="var(--accent)",T=JSON.parse(localStorage.getItem("saved_articles")||"[]"),window.renderNewsCards(T,"news-grid"),re(T.length);const f=document.querySelector("#news-view .news-header-titles h2");f&&(f.textContent="Saved Articles")}else{w.style.color="inherit";const l=s&&s.value.trim()?s.value.trim():oe,u=document.querySelector("#news-view .news-header-titles h2");u&&(u.textContent="News Feed"),V(l)}});let p=null;window.addEventListener("resize",()=>{p&&clearTimeout(p),p=setTimeout(()=>{if(C){const l=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";P(C,B(),l)}},200)})});
