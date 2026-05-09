document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-trigger');
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('modal-search-input');
    const resultsBox = document.getElementById('search-results-box');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            input.focus();
        });
    }

    if (input) {
        input.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 3) {
                resultsBox.innerHTML = "";
                return;
            }

            const results = await performMockSearch(query);
            renderSearchResults(results);
        });
    }
});

async function performMockSearch(query) {
    // In a real app, this would fetch multiple JSONs or Hit an API
    // Here we use a consolidated logic
    try {
        const [actsResp, casesResp] = await Promise.all([
            fetch('../data/acts.json'),
            fetch('../data/cases.json')
        ]);
        const actsData = await actsResp.json();
        const casesData = await casesResp.json();

        let matches = [];

        // Search in Acts & Sections
        actsData.acts.forEach(act => {
            if (act.name.toLowerCase().includes(query)) {
                matches.push({ type: 'Act', name: act.name, link: `acts.html?act=${act.id}` });
            }
            act.sections.forEach(sec => {
                if (sec.title.toLowerCase().includes(query) || sec.id.includes(query)) {
                    matches.push({ type: 'Section', name: `Sec ${sec.id}: ${sec.title}`, link: `acts.html?section=${sec.id}` });
                }
            });
        });

        // Search in Cases
        casesData.forEach(c => {
            if (c.name.toLowerCase().includes(query)) {
                matches.push({ type: 'Case', name: c.name, link: `cases.html?id=${c.id}` });
            }
        });

        return matches;
    } catch (e) {
        console.error("Search failed", e);
        return [];
    }
}

function renderSearchResults(results) {
    const box = document.getElementById('search-results-box');
    if (!box) return;

    if (results.length === 0) {
        box.innerHTML = `<p style="text-align:center; padding: 20px;" class="text-muted">No results found.</p>`;
        return;
    }

    box.innerHTML = results.map(res => `
        <div style="padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="window.location.href='${res.link}'">
            <span class="tag ${res.type === 'Case' ? 'tag-consti' : 'tag-civil'}" style="margin-right:8px; font-size:0.6rem;">${res.type}</span>
            <span style="font-weight:600;">${res.name}</span>
        </div>
    `).join('');
}
