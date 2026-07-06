(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();function wt(t){if(!t)return"";const e=new Date(t),r=Math.floor((new Date-e)/1e3);let n=r/31536e3;return n>1?Math.floor(n)+"y ago":(n=r/2592e3,n>1?Math.floor(n)+"mo ago":(n=r/86400,n>1?Math.floor(n)+"d ago":(n=r/3600,n>1?Math.floor(n)+"h ago":(n=r/60,n>1?Math.floor(n)+"m ago":Math.floor(r)+"s ago"))))}function Ct(t="news-grid"){const e=document.getElementById(t);if(e){e.innerHTML="";for(let s=0;s<4;s++){const r=document.createElement("article");r.className="skeleton-card",r.innerHTML=`
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
        `,e.appendChild(r)}}}function At(t,e,s="news-grid"){const r=document.getElementById(s);if(r&&(r.innerHTML=`
        <div class="error-container" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; background-color: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ef4444; margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem; color: var(--text-primary);">Oops! Something went wrong</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 400px;">${t}</p>
            ${e?`<button id="${s}-retry-btn" style="background-color: var(--accent); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Retry</button>`:""}
        </div>
    `,e)){const n=document.getElementById(`${s}-retry-btn`);n&&n.addEventListener("click",e)}}function Et(t,e="news-grid"){const s=document.getElementById(e);if(!s)return;const r=t?` for "${t}"`:"";s.innerHTML=`
        <div class="empty-state-container" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; background-color: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem; color: var(--text-primary);">No articles available</h3>
            <p style="color: var(--text-secondary); max-width: 400px;">We couldn't find any news${r}. Try adjusting your search or selecting a different category.</p>
        </div>
    `}function $t(t,e="news-grid"){const s=document.getElementById(e);if(!s)return;if(s.innerHTML="",!t||t.length===0){s.innerHTML='<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">No articles found.</p>';return}const r=JSON.parse(localStorage.getItem("saved_articles")||"[]");t.forEach(n=>{var w;const o=document.createElement("article");o.className="news-card",o.tabIndex=0;const i=n.urlToImage||n.image||"https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",a=n.category||"News",l=`badge-${a.toLowerCase()}`,c=((w=n.source)==null?void 0:w.name)||"Unknown Source",g=wt(n.publishedAt),v=n.title||"No Title",p=n.description||"No description available.",d=n.url||"#",h=r.some(f=>f.url===d&&f.title===v);o.innerHTML=`
            <div class="card-image-container">
                <img src="${i}" alt="${v.replace(/"/g,"&quot;")}" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                <span class="card-badge ${l}">${a}</span>
                <button class="card-bookmark ${h?"saved":""}" data-article='${JSON.stringify(n).replace(/'/g,"&#39;").replace(/"/g,"&quot;")}' aria-label="Bookmark article: ${v.replace(/"/g,"&quot;")}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${h?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
            </div>

            <div class="card-content">
                <h3 class="card-title">${v}</h3>
                <p class="card-description">${p}</p>
                <div class="card-footer">
                    <div class="card-source-time">
                        <span class="card-source">${c}</span>
                        <span>&bull;</span>
                        <span class="card-time">${g}</span>
                    </div>
                    <a href="${d}" target="_blank" rel="noopener" class="card-link">Read <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>
                </div>
            </div>
        `,s.appendChild(o)})}function nt(t="news-grid"){const e=document.getElementById(t);e&&e.addEventListener("click",s=>{const r=s.target.closest(".card-bookmark");if(!r)return;r.classList.toggle("saved");const n=r.classList.contains("saved"),o=r.querySelector("svg");o&&(n?o.setAttribute("fill","currentColor"):o.setAttribute("fill","none"));try{const i=JSON.parse(r.getAttribute("data-article"));let a=JSON.parse(localStorage.getItem("saved_articles")||"[]");n?a.some(g=>g.url===i.url&&g.title===i.title&&g.title===i.title)||a.push(i):a=a.filter(g=>g.url!==i.url||g.title!==i.title||g.title!==i.title),localStorage.setItem("saved_articles",JSON.stringify(a));const l=t==="news-grid"?"dashboard-news-grid":"news-grid",c=document.getElementById(l);c&&c.querySelectorAll(".card-bookmark").forEach(v=>{try{const p=JSON.parse(v.getAttribute("data-article"));if(p.url===i.url&&p.title===i.title){v.classList.toggle("saved",n);const d=v.querySelector("svg");d&&d.setAttribute("fill",n?"currentColor":"none")}}catch{}}),!n&&window.currentView==="saved"&&r.closest(".news-card").remove()}catch(i){console.error("Error parsing article data",i)}})}nt("news-grid");nt("dashboard-news-grid");window.showNewsLoading=Ct;window.showNewsError=At;window.showNoNewsFound=Et;window.renderNewsCards=$t;window.setupBookmarkDelegation=nt;window.timeAgo=wt;async function St({query:t="",country:e="",category:s="All"}){try{const r=t.trim()!=="",n=new URL("/api/news",window.location.origin);r&&n.searchParams.append("query",t.trim()),e&&e.trim()!==""&&n.searchParams.append("country",e.trim()),s&&s!=="All"&&n.searchParams.append("category",s),console.log(`[News Proxy Fetch] URL: ${n.toString()}`);const o=await fetch(n.toString());if(console.log(`[Raw Response] status: ${o.status}`),!o.ok){let a=`HTTP Error ${o.status}`;try{const l=await o.json();l&&l.error&&(a=l.error)}catch{a=o.statusText||a}throw o.status===401?new Error(`Invalid API key: ${a}`):o.status===429?new Error(`Rate limit exceeded: ${a}`):o.status===403?new Error(`CORS restriction: ${a}`):new Error(a)}let i=await o.json();if(console.log(`[Parsed Data] totalArticles: ${i.totalArticles}, articles.length: ${i.articles?i.articles.length:0}`),i.errors){const a=Array.isArray(i.errors)?i.errors.join(", "):typeof i.errors=="string"?i.errors:JSON.stringify(i.errors);throw new Error(`API Error: ${a}`)}if(!i.articles||i.articles.length===0)throw new Error("No results: We could not find any news matching your criteria.");if(r&&s&&s!=="All"){const a=s.toLowerCase(),l=i.articles.filter(c=>c.category?c.category.toLowerCase()===a:((c.title||"")+" "+(c.description||"")+" "+(c.content||"")).toLowerCase().includes(a));if(l.length===0)throw new Error("No results: We could not find any news matching your criteria after category filtering.");i.articles=l,i.totalArticles=l.length}return i}catch(r){throw r instanceof TypeError?new Error("Network error: Unable to connect to the news server. Please check your internet connection."):r}}const st=new Map,Lt=300*1e3,O=new Map;async function Mt({query:t="",country:e="",category:s="All"}={}){const r=(t||"").trim(),n=(e||"").trim(),o=(s||"All").trim(),i=`${r.toLowerCase()}:${n.toLowerCase()}:${o.toLowerCase()}`;console.log(`[Flow 4/5] getNews called with: { query: '${r}', country: '${n}', category: '${o}' }`);const a=st.get(i);if(a&&Date.now()-a.timestamp<Lt)return console.log(`[Client Cache Hit] Returning cached data for key: "${i}"`),a.data;if(O.has(i))return console.log(`[Request Collapsed] Sharing in-flight request for key: "${i}"`),O.get(i);const l=(async()=>{try{const c=await St({query:r,country:n,category:o});return console.log("[Flow 4/5] fetchNews succeeded."),c._source="live",st.set(i,{data:c,timestamp:Date.now()}),c}catch(c){throw console.error("[Flow 4/5] fetchNews failed:",c.message),c}finally{O.delete(i)}})();return O.set(i,l),l}window.getNews=Mt;const ot={sun:`
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
  `};function C(t,e=""){const s=ot[t]||ot.cloud;return e?s.replace(/class="([^"]*)"/,`class="$1 ${e}"`):s}function pt(t){const e=Number(t);return e===0?"sun":[1,2,3].includes(e)||[45,48].includes(e)?"cloud":[51,53,55,56,57].includes(e)?"cloud-drizzle":[61,63,65,66,67,80,81,82].includes(e)?"cloud-rain":[71,73,75,77,85,86].includes(e)?"snowflake":[95,96,99].includes(e)?"cloud-lightning":"cloud"}function it(t){const e=Number(t);return e===0?"Clear Skies":e===1?"Mainly Clear":e===2?"Partly Cloudy":e===3?"Overcast":e===45||e===48?"Foggy":e===51||e===53||e===55?"Drizzle":e===61||e===63||e===65?"Rainy":e===66||e===67?"Freezing Rain":e===71||e===73||e===75?"Snowy":e===77?"Snow Grains":e===80||e===81||e===82?"Rain Showers":e===85||e===86?"Snow Showers":e===95||e===96||e===99?"Thunderstorm":"Cloudy"}function Bt(t,e,s="C"){const r=document.getElementById("chart-container");if(!r)return;r.innerHTML="";const n=document.createElementNS("http://www.w3.org/2000/svg","svg"),o=r.clientWidth||600,i=r.clientHeight||180;n.setAttribute("width","100%"),n.setAttribute("height","100%"),n.setAttribute("viewBox",`0 0 ${o} ${i}`),n.setAttribute("preserveAspectRatio","none"),n.style.overflow="visible",r.appendChild(n);const a=["6 AM","8 AM","10 AM","12 PM","2 PM","4 PM","6 PM","8 PM","10 PM"],l=["6 AM","","10 AM","","2 PM","4 PM","6 PM","","10 PM"],c=40,g=40,v=o-c*2,p=i-g*2,d=Math.min(...t)-1.5,w=Math.max(...t)+1.5-d,f=t.map((m,y)=>{const k=c+y/(t.length-1)*v,b=g+(1-(m-d)/(w||1))*p;return{x:k,y:b,temp:m,time:a[y],displayTime:l[y]}}),B=document.createElementNS("http://www.w3.org/2000/svg","defs"),x=document.createElementNS("http://www.w3.org/2000/svg","linearGradient");x.setAttribute("id","strokeGrad"),x.setAttribute("x1","0%"),x.setAttribute("y1","0%"),x.setAttribute("x2","100%"),x.setAttribute("y2","0%");const H=document.createElementNS("http://www.w3.org/2000/svg","stop");H.setAttribute("offset","0%"),H.setAttribute("stop-color","#60A5FA");const P=document.createElementNS("http://www.w3.org/2000/svg","stop");P.setAttribute("offset","100%"),P.setAttribute("stop-color","#2563EB"),x.appendChild(H),x.appendChild(P);const I=document.createElementNS("http://www.w3.org/2000/svg","linearGradient");I.setAttribute("id","fillGrad"),I.setAttribute("x1","0%"),I.setAttribute("y1","0%"),I.setAttribute("x2","0%"),I.setAttribute("y2","100%");const T=document.createElementNS("http://www.w3.org/2000/svg","stop");T.setAttribute("offset","0%"),T.setAttribute("stop-color","#3B82F6"),T.setAttribute("stop-opacity",e==="dark"?"0.3":"0.15");const z=document.createElementNS("http://www.w3.org/2000/svg","stop");z.setAttribute("offset","100%"),z.setAttribute("stop-color","#3B82F6"),z.setAttribute("stop-opacity","0.00"),I.appendChild(T),I.appendChild(z),B.appendChild(x),B.appendChild(I),n.appendChild(B),f.forEach(m=>{const y=document.createElementNS("http://www.w3.org/2000/svg","line");y.setAttribute("x1",m.x),y.setAttribute("y1",g),y.setAttribute("x2",m.x),y.setAttribute("y2",i-g+10),y.setAttribute("stroke",e==="dark"?"#1E293B":"#E2E8F0"),y.setAttribute("stroke-dasharray","4,4"),y.setAttribute("stroke-width","1"),n.appendChild(y)});let j=`M ${f[0].x} ${f[0].y}`;for(let m=0;m<f.length-1;m++){const y=f[m],k=f[m+1],b=y.x+(k.x-y.x)/3,q=y.y,A=y.x+2*(k.x-y.x)/3,u=k.y;j+=` C ${b} ${q}, ${A} ${u}, ${k.x} ${k.y}`}const V=document.createElementNS("http://www.w3.org/2000/svg","path"),_=`${j} L ${f[f.length-1].x} ${i-g} L ${f[0].x} ${i-g} Z`;V.setAttribute("d",_),V.setAttribute("fill","url(#fillGrad)"),n.appendChild(V);const S=document.createElementNS("http://www.w3.org/2000/svg","path");S.setAttribute("d",j),S.setAttribute("fill","none"),S.setAttribute("stroke","url(#strokeGrad)"),S.setAttribute("stroke-width","3"),S.setAttribute("stroke-linecap","round"),n.appendChild(S);let $=document.getElementById("chart-tooltip");$||($=document.createElement("div"),$.id="chart-tooltip",$.className="chart-tooltip",r.appendChild($)),f.forEach((m,y)=>{if(m.displayTime){const u=document.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("x",m.x),u.setAttribute("y",i-12),u.setAttribute("text-anchor","middle"),u.setAttribute("fill",e==="dark"?"#64748B":"#94A3B8"),u.setAttribute("font-size","11"),u.setAttribute("font-family","var(--font-sans)"),u.setAttribute("font-weight","500"),u.textContent=m.displayTime,n.appendChild(u)}const k=document.createElementNS("http://www.w3.org/2000/svg","text");k.setAttribute("x",m.x),k.setAttribute("y",m.y-12),k.setAttribute("text-anchor","middle"),k.setAttribute("fill",e==="dark"?"#94A3B8":"#64748B"),k.setAttribute("font-size","11"),k.setAttribute("font-family","var(--font-sans)"),k.setAttribute("font-weight","600"),k.textContent=`${m.temp}°`,n.appendChild(k);const b=document.createElementNS("http://www.w3.org/2000/svg","circle");b.setAttribute("cx",m.x),b.setAttribute("cy",m.y),b.setAttribute("r","4.5"),b.setAttribute("fill",e==="dark"?"#0F172A":"#FFFFFF"),b.setAttribute("stroke","#3B82F6"),b.setAttribute("stroke-width","2.5"),b.setAttribute("class","chart-dot-node"),b.style.transition="all 0.15s ease",n.appendChild(b);const q=v/(t.length-1),A=document.createElementNS("http://www.w3.org/2000/svg","rect");A.setAttribute("x",m.x-q/2),A.setAttribute("y",g-10),A.setAttribute("width",q),A.setAttribute("height",p+20),A.setAttribute("fill","transparent"),A.style.cursor="pointer",A.addEventListener("mouseenter",u=>{b.setAttribute("r","6.5"),b.setAttribute("stroke-width","3.5"),b.setAttribute("fill","#3B82F6"),$.innerHTML=`
        <div class="tooltip-time">${m.time}</div>
        <div class="tooltip-temp">${m.temp}°${s}</div>
      `,$.style.opacity="1",r.getBoundingClientRect();const F=$.getBoundingClientRect(),R=m.x-F.width/2,J=m.y-F.height-20;$.style.transform=`translate(${R}px, ${J}px)`}),A.addEventListener("mouseleave",()=>{b.setAttribute("r","4.5"),b.setAttribute("stroke-width","2.5"),b.setAttribute("fill",e==="dark"?"#0F172A":"#FFFFFF"),$.style.opacity="0"}),n.appendChild(A)})}let D={onSearchInput:()=>{},onCitySelect:()=>{},onThemeToggle:()=>{},onAddCity:()=>{},onDeleteCity:()=>{}};function M(t){return(localStorage.getItem("temp_unit")||"C")==="F"?Math.round(t*9/5+32):t}function It(t){D={...D,...t},Tt()}function Tt(){const t=document.getElementById("city-search-input"),e=document.getElementById("search-results-dropdown");t&&e&&(t.addEventListener("input",n=>{const o=n.target.value;o.trim().length>=2?D.onSearchInput(o.trim()):(e.classList.remove("active"),e.innerHTML="")}),document.addEventListener("click",n=>{!t.contains(n.target)&&!e.contains(n.target)&&e.classList.remove("active")}),t.addEventListener("focus",()=>{e.children.length>0&&e.classList.add("active")}));const s=document.getElementById("dashboard-city-search-input"),r=document.getElementById("dashboard-search-results-dropdown");s&&r&&(s.addEventListener("input",n=>{const o=n.target.value;o.trim().length>=2?D.onSearchInput(o.trim()):(r.classList.remove("active"),r.innerHTML="")}),document.addEventListener("click",n=>{!s.contains(n.target)&&!r.contains(n.target)&&r.classList.remove("active")}),s.addEventListener("focus",()=>{r.children.length>0&&r.classList.add("active")}))}function vt(t){const e=document.getElementById("theme-toggle");e&&(e.innerHTML=t==="light"?'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>')}function Nt(t){const e=document.getElementById("search-results-dropdown"),s=document.getElementById("dashboard-search-results-dropdown"),r=n=>{if(n){if(t.length===0){n.classList.remove("active"),n.innerHTML="";return}n.innerHTML=t.map(o=>`
      <div class="search-item" data-lat="${o.latitude}" data-lon="${o.longitude}" data-name="${o.name}" data-country="${o.country_code||"US"}" data-timezone="${o.timezone||"GMT"}">
        <span class="search-item-pin">${C("map-pin")}</span>
        <div class="search-item-details">
          <span class="search-item-name">${o.name}${o.admin1?", "+o.admin1:""}</span>
          <span class="search-item-country">${o.country||o.country_code||"United States"}</span>
        </div>
      </div>
    `).join(""),n.classList.add("active"),n.querySelectorAll(".search-item").forEach(o=>{o.addEventListener("click",()=>{const i={name:o.getAttribute("data-name"),lat:parseFloat(o.getAttribute("data-lat")),lon:parseFloat(o.getAttribute("data-lon")),country:o.getAttribute("data-country"),timezone:o.getAttribute("data-timezone")},a=document.getElementById("city-search-input"),l=document.getElementById("dashboard-city-search-input");a&&(a.value=""),l&&(l.value=""),e.classList.remove("active"),s&&s.classList.remove("active"),D.onCitySelect(i)})})}};r(e),r(s)}function _t(){const t=document.getElementById("weather-dashboard-content");t&&(t.innerHTML=`
      <div class="weather-loading-container">
        ${C("loading")}
        <p>Fetching weather data...</p>
      </div>
    `);const e=document.getElementById("dashboard-weather-widget");e&&(e.innerHTML=`
      <div class="weather-loading-container" style="min-height: 200px;">
        ${C("loading")}
        <p>Updating weather...</p>
      </div>
    `)}function Ft(t,e){const s=document.getElementById("weather-dashboard-content");if(s){s.innerHTML=`
      <div class="weather-error-container">
        <div class="weather-error-title">Loading Failed</div>
        <p class="weather-error-message">${t||"Could not fetch weather data. Check your network connection."}</p>
        <button class="weather-retry-btn" id="error-retry-btn">Retry</button>
      </div>
    `;const n=document.getElementById("error-retry-btn");n&&e&&n.addEventListener("click",e)}const r=document.getElementById("dashboard-weather-widget");if(r){r.innerHTML=`
      <div class="weather-error-container" style="min-height: 200px;">
        <p class="weather-error-message">${t||"Could not fetch weather."}</p>
        <button class="weather-retry-btn" id="db-error-retry-btn" style="padding: 6px 14px; font-size: 12px;">Retry</button>
      </div>
    `;const n=document.getElementById("db-error-retry-btn");n&&e&&n.addEventListener("click",e)}}function U(t,e,s){const r=document.getElementById("weather-dashboard-content");if(r){r.innerHTML=`
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
                ${C("plus")}
              </button>
            </div>
            <div class="saved-cities-grid" id="saved-cities-container"></div>
          </section>
        </div>
      </div>
    `,at(t,"hero-panel"),ct(t,"air-conditions-container"),lt(t.forecast,"forecast-list-container"),Dt(t,"stats-grid-container"),Ht(e,t,"saved-cities-container");const o=localStorage.getItem("temp_unit")||"C",i=t.chartData.map(l=>M(l));Bt(i,s,o);const a=document.getElementById("add-active-city-btn");a&&(e.some(c=>c.name.toLowerCase()===t.name.toLowerCase())?(a.style.opacity="0.4",a.style.cursor="not-allowed",a.title="City already saved"):a.addEventListener("click",()=>{D.onAddCity({name:t.name,lat:t.lat,lon:t.lon,country:t.country,timezone:t.timezone||"auto"})}))}const n=document.getElementById("dashboard-weather-widget");n&&(n.innerHTML=`
      <div id="db-hero-panel"></div>
      <div class="weather-card air-card" style="margin-top: 1rem;">
        <h2 class="card-title">Air & Conditions</h2>
        <div class="air-grid-row" id="db-air-conditions-container"></div>
      </div>
      <div class="weather-card forecast-card" style="margin-top: 1rem;">
        <h2 class="card-title">Upcoming Forecast</h2>
        <div class="forecast-list-row" id="db-forecast-list-container"></div>
      </div>
    `,at(t,"db-hero-panel"),ct(t,"db-air-conditions-container"),lt(t.forecast.slice(0,4),"db-forecast-list-container"))}function at(t,e){const s=document.getElementById(e);if(!s)return;const r=new Date,n=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],o=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],i=n[r.getDay()],a=o[r.getMonth()],l=r.getDate();let c=r.getHours();const g=r.getMinutes().toString().padStart(2,"0"),v=c>=12?"PM":"AM";c=c%12,c=c||12;const p=`${c}:${g} ${v}`,d=`${i}, ${a} ${l} • ${p}`,h=localStorage.getItem("temp_unit")||"C",w=M(t.temp),f=M(t.feelsLike),B=M(t.high),x=M(t.low);s.innerHTML=`
    <div class="hero-card">
      <div class="hero-top-row">
        <div class="hero-meta">
          <h1 class="hero-location-name">
            ${t.name} <span class="country-pill-badge">${t.country}</span>
          </h1>
          <span class="hero-date">${d}</span>
        </div>
        <div class="hero-icon-container">
          ${C(pt(t.weatherCode))}
        </div>
      </div>
      
      <div class="hero-center-row">
        <div class="hero-temp">${w}°${h}</div>
        <div class="hero-condition-details">
          <span class="hero-condition-text">${t.condition}</span>
          <span class="hero-feels-like">Feels like ${f}°${h}</span>
          <span class="hero-high-low">H:${B}° L:${x}°</span>
        </div>
      </div>
      
      <div class="hero-subcards-row">
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${C("droplet")} Humidity
          </span>
          <span class="hero-subcard-value">${t.humidity}%</span>
        </div>
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${C("wind")} Wind
          </span>
          <span class="hero-subcard-value">${t.windSpeed} km/h</span>
        </div>
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${C("eye")} Visibility
          </span>
          <span class="hero-subcard-value">${t.visibility} km</span>
        </div>
      </div>
    </div>
  `}function ct(t,e){const s=document.getElementById(e);s&&(s.innerHTML=`
    <!-- AQI card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${t.aqiBg}">
        ${C("compass")}
      </div>
      <span class="air-subcard-value">${t.aqi}</span>
      <span class="air-subcard-label">AQI</span>
      <span class="air-subcard-desc ${t.aqiClass}">${t.aqiStatus}</span>
    </div>

    <!-- UV Index card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${t.uvBg}">
        ${C("sun")}
      </div>
      <span class="air-subcard-value">${t.uv}</span>
      <span class="air-subcard-label">UV Index</span>
      <span class="air-subcard-desc ${t.uvClass}">${t.uvStatus}</span>
    </div>

    <!-- Pressure card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${t.pressureBg}">
        ${C("thermometer")}
      </div>
      <span class="air-subcard-value">${t.pressure} hPa</span>
      <span class="air-subcard-label">Pressure</span>
      <span class="air-subcard-desc ${t.pressureClass}">${t.pressureStatus}</span>
    </div>
  `)}function lt(t,e){const s=document.getElementById(e);s&&(s.innerHTML=t.map((r,n)=>`
    <div class="forecast-day-col ${n===0?"active":""}" data-index="${n}">
      <span class="forecast-day-name">${r.day}</span>
      <div class="forecast-day-icon">
        ${C(r.icon)}
      </div>
      <div class="forecast-temps">
        <span class="forecast-temp-max">${M(r.max)}°</span>
        <span class="forecast-temp-min">${M(r.min)}°</span>
      </div>
    </div>
  `).join(""),s.querySelectorAll(".forecast-day-col").forEach(r=>{r.addEventListener("click",()=>{s.querySelectorAll(".forecast-day-col").forEach(n=>n.classList.remove("active")),r.classList.add("active")})}))}function Dt(t,e){const s=document.getElementById(e);if(!s)return;const r=localStorage.getItem("temp_unit")||"C",n=M(t.feelsLike),o=M(t.high),i=M(t.low);s.innerHTML=`
    <!-- Wind card -->
    <div class="stat-card">
      <div class="stat-header">
        ${C("wind")}
      </div>
      <div class="stat-value">${t.windSpeed} km/h</div>
      <div class="stat-label-details">
        <span class="stat-title">Wind Speed</span>
        <span class="stat-subtitle">${t.windDirection}</span>
      </div>
    </div>

    <!-- Humidity card -->
    <div class="stat-card">
      <div class="stat-header">
        ${C("droplet")}
      </div>
      <div class="stat-value">${t.humidity}%</div>
      <div class="stat-label-details">
        <span class="stat-title">Humidity</span>
        <span class="stat-subtitle">${t.humidity>60?"High dew point":"Normal dew point"}</span>
      </div>
    </div>

    <!-- Visibility card -->
    <div class="stat-card">
      <div class="stat-header">
        ${C("eye")}
      </div>
      <div class="stat-value">${t.visibility} km</div>
      <div class="stat-label-details">
        <span class="stat-title">Visibility</span>
        <span class="stat-subtitle">${t.visibility>10?"Clear":"Foggy / Hazy"}</span>
      </div>
    </div>

    <!-- Feels Like card -->
    <div class="stat-card">
      <div class="stat-header">
        ${C("thermometer")}
      </div>
      <div class="stat-value">${n}°${r}</div>
      <div class="stat-label-details">
        <span class="stat-title">Feels Like</span>
        <span class="stat-subtitle">H:${o}° L:${i}°</span>
      </div>
    </div>
  `}function Ht(t,e,s){const r=document.getElementById(s);if(r){if(t.length===0){r.innerHTML='<div style="grid-column: span 2; text-align: center; color: var(--color-text-secondary); font-size: 13px; padding: 20px;">No saved cities. Search and pin one!</div>';return}r.innerHTML=t.map(n=>{const o=n.name.toLowerCase()===e.name.toLowerCase();let i="--°",a="Fetch data";if(o)i=`${M(e.temp)}°`,a=e.condition;else{const c={"new york":{temp:25,desc:"Clear Skies"},london:{temp:14,desc:"Light Rain"},tokyo:{temp:28,desc:"Sunny"},"san francisco":{temp:18,desc:"Partly Cloudy"}}[n.name.toLowerCase()];c?(i=`${M(c.temp)}°`,a=c.desc):(i=`${M(16)}°`,a="Partly Cloudy")}return`
      <div class="saved-city-item ${o?"active":""}" data-name="${n.name}" data-lat="${n.lat}" data-lon="${n.lon}" data-country="${n.country}" data-timezone="${n.timezone||"auto"}">
        <span class="saved-city-name">${n.name}</span>
        <div class="saved-city-weather">
          <span class="saved-city-temp">${i}</span>
          <span>•</span>
          <span>${a}</span>
        </div>
        <button class="saved-city-delete-btn" title="Remove city" data-name="${n.name}" data-country="${n.country}">
          ${C("remove")}
        </button>
      </div>
    `}).join(""),r.querySelectorAll(".saved-city-item").forEach(n=>{n.addEventListener("click",o=>{if(o.target.closest(".saved-city-delete-btn"))return;const i={name:n.getAttribute("data-name"),lat:parseFloat(n.getAttribute("data-lat")),lon:parseFloat(n.getAttribute("data-lon")),country:n.getAttribute("data-country"),timezone:n.getAttribute("data-timezone")};D.onCitySelect(i)})}),r.querySelectorAll(".saved-city-delete-btn").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const i=n.getAttribute("data-name"),a=n.getAttribute("data-country");D.onDeleteCity(i,a)})})}}function Pt(t){if(t==null)return"SW direction";const e=Math.floor(t/45+.5);return["N direction","NE direction","E direction","SE direction","S direction","SW direction","W direction","NW direction"][e%8]}function qt(t){return t<=50?{text:"GOOD",class:"text-good",bgClass:"status-good-bg"}:t<=100?{text:"MODERATE",class:"text-moderate",bgClass:"status-moderate-bg"}:t<=150?{text:"UNHEALTHY (SG)",class:"text-unhealthy",bgClass:"status-unhealthy-bg"}:{text:"UNHEALTHY",class:"text-unhealthy",bgClass:"status-unhealthy-bg"}}function Ut(t){return t<=2?{text:"LOW",class:"text-good",bgClass:"status-good-bg"}:t<=5?{text:"MODERATE",class:"text-moderate",bgClass:"status-moderate-bg"}:t<=7?{text:"HIGH",class:"text-high",bgClass:"status-high-bg"}:{text:"VERY HIGH",class:"text-extreme",bgClass:"status-extreme-bg"}}function zt(t){return t<1009?{text:"LOW",class:"text-low",bgClass:"status-low-bg"}:t>1020?{text:"HIGH",class:"text-high",bgClass:"status-high-bg"}:{text:"NORMAL",class:"text-normal",bgClass:"status-normal-bg"}}async function Rt(t){if(!t||t.trim().length<2)return[];try{const e=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(t)}&count=5&language=en&format=json`,s=await fetch(e);if(!s.ok)throw new Error("Geocoding failed");return(await s.json()).results||[]}catch(e){return console.error("Geocoding API error:",e),[]}}async function Wt(t,e,s,r="US",n="auto"){const o=encodeURIComponent(n),i=`https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${e}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${o}`,a=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${t}&longitude=${e}&current=us_aqi,uv_index&timezone=${o}`;try{const[l,c]=await Promise.allSettled([fetch(i).then(u=>{if(!u.ok)throw new Error(`HTTP error ${u.status}`);return u.json()}),fetch(a).then(u=>{if(!u.ok)throw new Error(`HTTP error ${u.status}`);return u.json()})]);if(l.status==="rejected")throw new Error("Failed to fetch core weather data: "+l.reason.message);const g=l.value,v=c.status==="fulfilled"?c.value:null,p=g.current,d=g.hourly,h=g.daily,w=Math.round(p.temperature_2m),f=Math.round(p.apparent_temperature),B=Math.round(p.relative_humidity_2m),x=Math.round(p.wind_speed_10m),H=Pt(p.wind_direction_10m),P=p.visibility?Math.round(p.visibility/1e3):16,I=Math.round(p.surface_pressure),T=p.weather_code,z=it(T),j=h&&h.temperature_2m_max?Math.round(h.temperature_2m_max[0]):w+3,V=h&&h.temperature_2m_min?Math.round(h.temperature_2m_min[0]):w-4;let _=42,S=5;v&&v.current?(_=Math.round(v.current.us_aqi||42),S=Math.round(v.current.uv_index||5)):T===0?(S=w>25?8:5,_=35):[1,2,3].includes(T)?(S=w>25?6:4,_=40):(S=2,_=20);const $=qt(_),m=Ut(S),y=zt(I),b=[6,8,10,12,14,16,18,20,22].map(u=>d&&d.temperature_2m&&d.temperature_2m[u]!==void 0?Math.round(d.temperature_2m[u]):Math.round(w+Math.sin((u-14)/4)*4)),q=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],A=[];if(h&&h.time)for(let u=0;u<Math.min(h.time.length,7);u++){const F=new Date(h.time[u]),R=q[F.getDay()],J=Math.round(h.temperature_2m_max[u]),xt=Math.round(h.temperature_2m_min[u]),rt=h.weather_code[u];A.push({day:R,desc:it(rt),icon:pt(rt),max:J,min:xt})}else{const u=new Date;for(let F=0;F<7;F++){const R=new Date(u);R.setDate(u.getDate()+F);const J=q[R.getDay()];A.push({day:J,desc:"Partly Cloudy",icon:"cloud",max:w+2,min:w-3})}}return{name:s,country:r.toUpperCase(),lat:t,lon:e,temp:w,condition:z,feelsLike:f,high:j,low:V,humidity:B,windSpeed:x,windDirection:H,visibility:P,aqi:_,aqiStatus:$.text,aqiClass:$.class,aqiBg:$.bgClass,uv:S,uvStatus:m.text,uvClass:m.class,uvBg:m.bgClass,pressure:I,pressureStatus:y.text,pressureClass:y.class,pressureBg:y.bgClass,chartData:b,forecast:A,weatherCode:T}}catch(l){throw console.error("fetchWeatherData orchestration error:",l),l}}const ft="weather_dashboard_saved_cities",yt="weather_dashboard_active_city",dt=[{name:"San Francisco",lat:37.7749,lon:-122.4194,country:"US"},{name:"New York",lat:40.7128,lon:-74.006,country:"US"},{name:"London",lat:51.5074,lon:-.1278,country:"GB"},{name:"Tokyo",lat:35.6762,lon:139.6503,country:"JP"}],ut={name:"San Francisco",lat:37.7749,lon:-122.4194,country:"US"},X={};function Gt(){const t=localStorage.getItem(yt);try{return t?JSON.parse(t):ut}catch{return ut}}function jt(t){!t||!t.name||localStorage.setItem(yt,JSON.stringify(t))}function N(){const t=localStorage.getItem(ft);try{return t?JSON.parse(t):dt}catch{return dt}}function bt(t){localStorage.setItem(ft,JSON.stringify(t))}function Vt(t){if(!t||!t.name)return;const e=N();e.some(r=>r.name.toLowerCase()===t.name.toLowerCase()&&r.country.toLowerCase()===t.country.toLowerCase())||(e.push(t),bt(e))}function Jt(t,e){let s=N();s=s.filter(r=>!(r.name.toLowerCase()===t.toLowerCase()&&r.country.toLowerCase()===e.toLowerCase())),bt(s)}function Ot(t,e){X[t.toLowerCase()]={timestamp:Date.now(),data:e}}function Yt(t){const e=X[t.toLowerCase()];return e?Date.now()-e.timestamp>900*1e3?(delete X[t.toLowerCase()],null):e.data:null}const Zt=!0;let tt="All",L=[],Y=null,Z=null,K=0,Q=null,E=null;function et(t){const e=document.getElementById("article-count");e&&(e.textContent=`${t} article${t!==1?"s":""}`),Y=new Date,ht(),Z&&clearInterval(Z),Z=setInterval(ht,6e4)}function ht(){const t=document.getElementById("last-updated");t&&Y&&(Math.floor((new Date-Y)/1e3)<60?t.textContent="Updated just now":t.textContent=`Updated ${window.timeAgo?window.timeAgo(Y.toISOString()):"recently"}`)}function kt(t,e){!t||t.length===0||t.sort((s,r)=>{if(e==="newest")return new Date(r.publishedAt||0)-new Date(s.publishedAt||0);if(e==="oldest")return new Date(s.publishedAt||0)-new Date(r.publishedAt||0);if(e==="popular"){const n=s.popularity||(s.title?s.title.length:0);return(r.popularity||(r.title?r.title.length:0))-n}return 0})}function gt(t){const e=document.getElementById("debug-badge");e&&(e.style.display="inline-block",t==="live"?(e.textContent="Live API",e.style.backgroundColor="#10b981"):t==="mock"?(e.textContent="Mock Data",e.style.backgroundColor="#f59e0b"):e.style.display="none")}async function G(t="",e=""){window.currentView="news";const s=document.getElementById("saved-articles-btn");s&&(s.style.color="inherit");const r=document.querySelector("#news-view .news-header-titles h2");r&&(r.textContent="News Feed"),console.log(`[News Flow] handleLocationNews started for: "${t}" (Country: "${e}"). Category: "${tt}".`),window.showNewsLoading("news-grid"),gt(null);const n=++K;try{const o=e?"":t,i=await window.getNews({query:o,country:e,category:tt});if(n!==K)return;if(gt(i._source),i&&i.articles&&i.articles.length>0){L=i.articles;const a=document.getElementById("news-sort"),l=a?a.value:"newest";kt(L,l),window.renderNewsCards(L,"news-grid"),et(L.length)}else L=[],window.showNoNewsFound(t||e,"news-grid")}catch(o){if(n!==K)return;L=[],o.message&&o.message.includes("No results")?window.showNoNewsFound(t||e,"news-grid"):window.showNewsError(o.message||"An error occurred while fetching news.",()=>G(t,e),"news-grid")}}async function Kt(t="",e=""){const s="dashboard-news-grid",r=document.getElementById("dashboard-article-count"),n=document.getElementById("dashboard-debug-badge");window.showNewsLoading(s),n&&(n.style.display="none");try{const o=e?"":t,i=await window.getNews({query:o,country:e,category:"All"});if(i&&i.articles&&i.articles.length>0){const a=i.articles.slice(0,4);window.renderNewsCards(a,s),r&&(r.textContent=`${i.articles.length} article${i.articles.length!==1?"s":""}`),n&&Zt&&(n.style.display="inline-block",i._source==="live"?(n.textContent="Live API",n.style.backgroundColor="#10b981"):(n.textContent="Mock Data",n.style.backgroundColor="#f59e0b"))}else window.showNoNewsFound(t||e,s),r&&(r.textContent="0 articles")}catch{window.showNoNewsFound(t||e,s),r&&(r.textContent="0 articles")}}async function W(t){_t();try{const e=Yt(t.name);if(e)E=e;else{const r=await Wt(t.lat,t.lon,t.name,t.country||"US",t.timezone||"auto");Ot(t.name,r),E=r}jt(t);const s=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";U(E,N(),s),Kt(t.name,t.country),G(t.name,t.country)}catch(e){console.error("Error loading weather data:",e),Ft(`Could not retrieve weather data for ${t.name}. Please check your connection.`,()=>W(t))}}function Qt(t){Q&&clearTimeout(Q),Q=setTimeout(async()=>{if(t.length<2)return;const e=await Rt(t);Nt(e)},300)}function Xt(t){Vt(t);const e=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";E&&U(E,N(),e)}function te(t,e){Jt(t,e);const s=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";E&&U(E,N(),s)}function mt(){const e=(document.documentElement.getAttribute("data-theme")==="light"?"light":"dark")==="light"?"dark":"light";e==="light"?(document.documentElement.setAttribute("data-theme","light"),localStorage.setItem("theme","light")):(document.documentElement.removeAttribute("data-theme"),localStorage.setItem("theme","dark")),vt(e),E&&U(E,N(),e)}function ee(){const t=document.querySelectorAll(".nav-tab");t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(n=>n.classList.remove("active")),e.classList.add("active");const s=e.dataset.tab;document.querySelectorAll(".tab-content").forEach(n=>{n.classList.remove("active")});const r=document.getElementById(`${s}-view`);r&&r.classList.add("active"),(s==="weather"||s==="dashboard")&&E&&setTimeout(()=>{const n=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";U(E,N(),n)},50)})})}document.addEventListener("DOMContentLoaded",()=>{It({onSearchInput:Qt,onCitySelect:W,onThemeToggle:mt,onAddCity:Xt,onDeleteCity:te}),ee();const t=localStorage.getItem("theme"),e=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches,s=t==="light"||!t&&e?"light":"dark";s==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme"),vt(s);const r=document.getElementById("theme-toggle");r&&r.addEventListener("click",mt);let n=localStorage.getItem("temp_unit")||"C";const o=document.getElementById("temp-toggle-btn");o&&(o.textContent=`°${n}`,o.addEventListener("click",()=>{if(n=n==="C"?"F":"C",localStorage.setItem("temp_unit",n),o.textContent=`°${n}`,E){const d=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";U(E,N(),d)}}));const i=Gt();navigator.geolocation?navigator.geolocation.getCurrentPosition(async d=>{const h=d.coords.latitude,w=d.coords.longitude;try{const f=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${h}&longitude=${w}&localityLanguage=en`,B=await fetch(f);if(!B.ok)throw new Error("Reverse geocoding failed");const x=await B.json(),H=x.city||x.locality||x.principalSubdivision||"My Location",P=x.countryCode||"US";W({name:H,lat:h,lon:w,country:P,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"auto"})}catch(f){console.warn("Reverse geocoding failed, falling back to default city:",f),W(i)}},d=>{console.warn("Geolocation permission denied or failed, falling back to default city:",d),W(i)},{timeout:1e4}):W(i);const a=document.getElementById("news-search");let l;a&&a.addEventListener("input",d=>{clearTimeout(l),l=setTimeout(()=>{const h=d.target.value.trim();h?G(h,""):G("",i?i.country:"")},300)});const c=document.querySelectorAll(".category-filters .filter-btn");c.forEach(d=>{d.addEventListener("click",h=>{c.forEach(B=>B.classList.remove("active")),h.target.classList.add("active"),tt=h.target.dataset.category||"All";const w=a&&a.value.trim()?a.value.trim():"",f=w?"":i?i.country:"";G(w,f)})});const g=document.getElementById("news-sort");g&&g.addEventListener("change",d=>{L.length>0&&(kt(L,d.target.value),window.renderNewsCards(L,"news-grid"),et(L.length))});const v=document.getElementById("saved-articles-btn");v&&v.addEventListener("click",()=>{if(window.currentView=window.currentView==="saved"?"news":"saved",window.currentView==="saved"){const d=document.querySelector('.nav-tab[data-tab="news"]');d&&d.click(),v.style.color="var(--accent)",L=JSON.parse(localStorage.getItem("saved_articles")||"[]"),window.renderNewsCards(L,"news-grid"),et(L.length);const w=document.querySelector("#news-view .news-header-titles h2");w&&(w.textContent="Saved Articles")}else{v.style.color="inherit";const d=a&&a.value.trim()?a.value.trim():"",h=d?"":i?i.country:"",w=document.querySelector("#news-view .news-header-titles h2");w&&(w.textContent="News Feed"),G(d,h)}});let p=null;window.addEventListener("resize",()=>{p&&clearTimeout(p),p=setTimeout(()=>{if(E){const d=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";U(E,N(),d)}},200)})});
