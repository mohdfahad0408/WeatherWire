// UI logic

/**
 * Formats a date string into a relative time (e.g., '2h ago')
 * @param {string} dateString 
 * @returns {string}
 */
function timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

/**
 * Injects 4 skeleton placeholder cards into the news grid
 * @param {string} [gridId='news-grid']
 */
function showNewsLoading(gridId = 'news-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const skeleton = document.createElement('article');
        skeleton.className = 'skeleton-card';
        skeleton.innerHTML = `
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
        `;
        grid.appendChild(skeleton);
    }
}

/**
 * Displays an error message in the news grid with a retry button
 * @param {string} message - The error message to display
 * @param {Function} [retryCallback] - Optional callback function to execute on retry
 * @param {string} [gridId='news-grid']
 */
function showNewsError(message, retryCallback, gridId = 'news-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = `
        <div class="error-container" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; background-color: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ef4444; margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem; color: var(--text-primary);">Oops! Something went wrong</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 400px;">${message}</p>
            ${retryCallback ? `<button id="${gridId}-retry-btn" style="background-color: var(--accent); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Retry</button>` : ''}
        </div>
    `;

    if (retryCallback) {
        const retryBtn = document.getElementById(`${gridId}-retry-btn`);
        if (retryBtn) {
            retryBtn.addEventListener('click', retryCallback);
        }
    }
}

/**
 * Displays a message when no news articles are found
 * @param {string} query - The search query that yielded no results
 * @param {string} [gridId='news-grid']
 */
function showNoNewsFound(query, gridId = 'news-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const queryText = query ? ` for "${query}"` : '';
    
    grid.innerHTML = `
        <div class="empty-state-container" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; background-color: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem; color: var(--text-primary);">No articles available</h3>
            <p style="color: var(--text-secondary); max-width: 400px;">We couldn't find any news${queryText}. Try adjusting your search or selecting a different category.</p>
        </div>
    `;
}

/**
 * Renders an array of article objects as HTML cards in the news grid
 * @param {Array} articles 
 * @param {string} [gridId='news-grid']
 */
function renderNewsCards(articles, gridId = 'news-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!articles || articles.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">No articles found.</p>';
        return;
    }

    const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    
    articles.forEach(article => {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.tabIndex = 0;
        
        const imageUrl = article.urlToImage || article.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        const category = article.category || 'News';
        const categoryClass = `badge-${category.toLowerCase()}`;
        const sourceName = article.source?.name || 'Unknown Source';
        const publishedTime = timeAgo(article.publishedAt);
        const title = article.title || 'No Title';
        const description = article.description || 'No description available.';
        const url = article.url || '#';
        const isSaved = savedArticles.some(a => a.url === url && a.title === title);
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${imageUrl}" alt="${title.replace(/"/g, '&quot;')}" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                <span class="card-badge ${categoryClass}">${category}</span>
                <button class="card-bookmark ${isSaved ? 'saved' : ''}" data-article='${JSON.stringify(article).replace(/'/g, "&#39;").replace(/"/g, "&quot;")}' aria-label="Bookmark article: ${title.replace(/"/g, '&quot;')}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
            </div>

            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <p class="card-description">${description}</p>
                <div class="card-footer">
                    <div class="card-source-time">
                        <span class="card-source">${sourceName}</span>
                        <span>&bull;</span>
                        <span class="card-time">${publishedTime}</span>
                    </div>
                    <a href="${url}" target="_blank" rel="noopener" class="card-link">Read <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

/**
 * Sets up event delegation for bookmark buttons in a specific news grid.
 * @param {string} [gridId='news-grid']
 */
function setupBookmarkDelegation(gridId = 'news-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('.card-bookmark');
        if (!bookmarkBtn) return;
        
        bookmarkBtn.classList.toggle('saved');
        const isNowSaved = bookmarkBtn.classList.contains('saved');
        const svg = bookmarkBtn.querySelector('svg');
        
        if (svg) {
            if (isNowSaved) {
                svg.setAttribute('fill', 'currentColor');
            } else {
                svg.setAttribute('fill', 'none');
            }
        }
        
        try {
            const articleData = JSON.parse(bookmarkBtn.getAttribute('data-article'));
            let savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
            if (isNowSaved) {
                if (!savedArticles.some(a => ((a.url === articleData.url && a.title === articleData.title) && a.title === articleData.title))) {
                    savedArticles.push(articleData);
                }
            } else {
                savedArticles = savedArticles.filter(a => ((a.url !== articleData.url || a.title !== articleData.title) || a.title !== articleData.title));
            }
            localStorage.setItem('saved_articles', JSON.stringify(savedArticles));
            
            // Sync active state in the other news grid if it exists
            const otherGridId = gridId === 'news-grid' ? 'dashboard-news-grid' : 'news-grid';
            const otherGrid = document.getElementById(otherGridId);
            if (otherGrid) {
                const otherBtns = otherGrid.querySelectorAll('.card-bookmark');
                otherBtns.forEach(btn => {
                    try {
                        const data = JSON.parse(btn.getAttribute('data-article'));
                        if (data.url === articleData.url && data.title === articleData.title) {
                            btn.classList.toggle('saved', isNowSaved);
                            const otherSvg = btn.querySelector('svg');
                            if (otherSvg) {
                                otherSvg.setAttribute('fill', isNowSaved ? 'currentColor' : 'none');
                            }
                        }
                    } catch(err) {}
                });
            }

            if (!isNowSaved && window.currentView === 'saved') {
                bookmarkBtn.closest('.news-card').remove();
            }
        } catch(err) {
            console.error("Error parsing article data", err);
        }
    });
}

// Initialize event delegation for both potential grids
setupBookmarkDelegation('news-grid');
setupBookmarkDelegation('dashboard-news-grid');

window.showNewsLoading = showNewsLoading; 
window.showNewsError = showNewsError; 
window.showNoNewsFound = showNoNewsFound; 
window.renderNewsCards = renderNewsCards;
window.setupBookmarkDelegation = setupBookmarkDelegation;
window.timeAgo = timeAgo;