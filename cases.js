let casesDataStore = [];
let currentCase = null;

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCases();
    handleURLParams();

    document.getElementById('bookmark-btn').addEventListener('click', toggleBookmark);

    // Filter Listeners
    document.getElementById('case-search').addEventListener('input', applyFilters);
    document.getElementById('domain-filter').addEventListener('change', applyFilters);
    document.getElementById('year-filter').addEventListener('change', applyFilters);
});

async function fetchCases() {
    try {
        const resp = await fetch('../data/cases.json');
        casesDataStore = await resp.json();
        renderCasesList(casesDataStore);
    } catch (e) {
        console.error("Failed to load cases", e);
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('case-search').value.toLowerCase();
    const domainFilter = document.getElementById('domain-filter').value;
    const yearFilter = document.getElementById('year-filter').value;

    const filtered = casesDataStore.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm) ||
            c.importance.toLowerCase().includes(searchTerm);

        const matchesDomain = domainFilter === 'all' || c.domain === domainFilter;

        const year = parseInt(c.year);
        let matchesYear = true;
        if (yearFilter === 'pre-2000') matchesYear = year < 2000;
        else if (yearFilter === '2000-2015') matchesYear = year >= 2000 && year <= 2015;
        else if (yearFilter === 'post-2015') matchesYear = year > 2015;

        return matchesSearch && matchesDomain && matchesYear;
    });

    renderCasesList(filtered);
}

function renderCasesList(dataToRender) {
    const list = document.getElementById('cases-list');

    if (dataToRender.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 12px; border: 1px dashed var(--border-color);">
                <span class="material-symbols-rounded" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;">search_off</span>
                <h3 class="serif-font">No cases found</h3>
                <p class="text-muted">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = dataToRender.map(c => {
        let tagClass = 'tag-consti';
        if (c.domain === 'Criminal Law') tagClass = 'tag-criminal';
        if (c.domain === 'Consumer Law') tagClass = 'tag-civil';
        if (c.domain === 'Women Safety') tagClass = 'tag-women';

        return `
            <div class="card case-card" style="cursor:pointer; display: flex; flex-direction: column; height: 100%;" onclick="showCaseDetail('${c.id}')">
                <div style="flex: 1;">
                    <h4 class="serif-font" style="margin-bottom: 8px; color: var(--accent-color);">${c.name}</h4>
                    <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span class="text-muted" style="font-size: 0.8rem; font-weight: 600;">${c.year} | ${c.court}</span>
                        <span class="tag ${tagClass}" style="font-size: 0.65rem; text-transform: uppercase;">${c.domain}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5; margin-bottom: 16px;">${c.importance.substring(0, 120)}...</p>
                </div>
                <div style="padding-top: 12px; border-top: 1px solid var(--border-color); background: #f8fafc; margin: 0 -24px -24px -24px; padding: 16px 24px; border-radius: 0 0 12px 12px;">
                    <strong style="font-size: 0.75rem; color: var(--accent-color); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Key Takeaway</strong>
                    <p style="font-size: 0.85rem; font-weight: 500; color: var(--text-main); margin: 0;">${c.takeaway}</p>
                </div>
            </div>
        `;
    }).join('');
}

function showCaseDetail(caseId) {
    currentCase = casesDataStore.find(c => c.id === caseId);
    if (!currentCase) return;

    document.getElementById('cases-grid-view').style.display = 'none';
    document.getElementById('case-detail-view').style.display = 'block';

    document.getElementById('case-title').innerText = currentCase.name;
    document.getElementById('case-meta').innerText = `${currentCase.year} • ${currentCase.court} • ${currentCase.verdict}`;
    document.getElementById('case-facts').innerText = currentCase.facts;
    document.getElementById('case-issue').innerText = currentCase.issue;
    document.getElementById('case-judgment').innerText = currentCase.judgment;
    document.getElementById('case-importance').innerText = currentCase.importance;
    document.getElementById('case-takeaway').innerText = currentCase.takeaway;

    updateBookmarkBtn();
}

window.showCaseDetail = showCaseDetail;

function showCasesList() {
    document.getElementById('case-detail-view').style.display = 'none';
    document.getElementById('cases-grid-view').style.display = 'block';
}

window.showCasesList = showCasesList;
window.updateBookmarkBtn = updateBookmarkBtn;

function toggleBookmark() {
    if (!currentCase) return;
    let bookmarks = JSON.parse(localStorage.getItem('lisa_bookmarks') || '[]');

    const index = bookmarks.findIndex(b => b.id === currentCase.id);
    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push({
            id: currentCase.id,
            name: currentCase.name,
            type: 'case',
            date: new Date().toLocaleDateString()
        });
    }

    localStorage.setItem('lisa_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkBtn();
}

function updateBookmarkBtn() {
    const bookmarks = JSON.parse(localStorage.getItem('lisa_bookmarks') || '[]');
    const isBookmarked = bookmarks.some(b => b.id === currentCase.id);
    const btn = document.getElementById('bookmark-btn');

    if (isBookmarked) {
        btn.innerHTML = `<span class="material-symbols-rounded" style="font-variation-settings: 'FILL' 1;">bookmark</span> Bookmarked`;
        btn.classList.replace('btn-secondary', 'btn-primary');
    } else {
        btn.innerHTML = `<span class="material-symbols-rounded">bookmark</span> Bookmark`;
        btn.classList.replace('btn-primary', 'btn-secondary');
    }
}

function handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('id');
    if (caseId) {
        // Wait for data study
        setTimeout(() => {
            showCaseDetail(caseId);
        }, 100);
    }
}
