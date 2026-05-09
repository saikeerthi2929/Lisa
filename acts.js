let currentAct = null;
let actsDataStore = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchActs();
    setupTabs();
    setupSearchAndFilters();
    handleURLParams();
});

async function fetchActs() {
    try {
        const resp = await fetch('../data/acts.json');
        const data = await resp.json();
        actsDataStore = data.acts;
        renderActsMenu();
    } catch (e) {
        console.error("Failed to load acts", e);
    }
}

function renderActsMenu(filter = 'all', search = '') {
    const menu = document.getElementById('acts-menu');
    const filteredActs = actsDataStore.filter(act => {
        const matchesFilter = filter === 'all' || act.domain === filter;
        const matchesSearch = act.name.toLowerCase().includes(search.toLowerCase()) ||
            act.short_name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (filteredActs.length === 0) {
        menu.innerHTML = `<p class="text-muted" style="text-align:center; padding: 20px;">No acts found.</p>`;
        return;
    }

    menu.innerHTML = filteredActs.map(act => `
        <div class="nav-item ${currentAct && currentAct.id === act.id ? 'active' : ''}" style="margin-bottom: 4px;">
            <a href="#" onclick="showActDetail('${act.id}')" style="background: ${currentAct && currentAct.id === act.id ? 'var(--accent-color)' : 'transparent'}; color: ${currentAct && currentAct.id === act.id ? 'white' : 'inherit'}; border-radius: 8px; display: flex; align-items:center; gap: 10px; padding: 10px 14px; text-decoration: none; transition: 0.2s;">
                <span class="material-symbols-rounded" style="font-size: 20px;">balance</span>
                <span style="font-size: 0.95rem; font-weight: 500;">${act.short_name || act.name}</span>
            </a>
        </div>
    `).join('');
}

// Search and Filter Listeners
function setupSearchAndFilters() {
    const searchInput = document.getElementById('acts-search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');

    searchInput?.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderActsMenu(activeFilter, e.target.value);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
            filterBtns.forEach(b => b.classList.add('btn-secondary'));
            btn.classList.add('active', 'btn-primary');
            btn.classList.remove('btn-secondary');

            const filter = btn.getAttribute('data-filter');
            const search = searchInput?.value || '';
            renderActsMenu(filter, search);
        });
    });
}

function showActDetail(actId) {
    currentAct = actsDataStore.find(a => a.id === actId);
    if (!currentAct) return;

    // Refresh menu to show active state
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const searchText = document.getElementById('acts-search-input')?.value || '';
    renderActsMenu(activeFilter, searchText);

    // Toggle Visibility
    document.getElementById('placeholder-view').style.display = 'none';
    document.getElementById('section-detail-view').style.display = 'none';
    document.getElementById('act-detail-view').style.display = 'block';

    document.getElementById('act-main-title').innerText = currentAct.name;
    document.getElementById('act-desc').innerText = currentAct.description;

    const simpleDesc = document.getElementById('act-simple-desc');
    if (simpleDesc && currentAct.simplified_explanation) {
        simpleDesc.innerText = currentAct.simplified_explanation;
    }

    const sectionsList = document.getElementById('sections-list');
    sectionsList.innerHTML = currentAct.sections.map(sec => `
        <div class="card" style="padding: 24px; text-align:center; cursor:pointer; background: #fff; border: 1px solid var(--border-color); transition: 0.2s;" 
             onmouseover="this.style.borderColor='var(--accent-color)'; this.style.transform='translateY(-4px)'" 
             onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='translateY(0)'"
             onclick="showSectionDetail('${sec.id}')">
            <h4 style="color: var(--accent-color); font-size: 1.2rem; margin-bottom: 8px;">Section ${sec.id}</h4>
            <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main);">${sec.title}</p>
        </div>
    `).join('');
}

window.showActDetail = showActDetail; // Export for onclick

function showSectionDetail(secId) {
    const section = currentAct.sections.find(s => s.id === secId);
    if (!section) return;

    document.getElementById('act-detail-view').style.display = 'none';
    document.getElementById('section-detail-view').style.display = 'block';

    document.getElementById('sec-title').innerText = `Section ${secId}: ${section.title}`;
    document.getElementById('sec-meaning').innerText = section.meaning;
    document.getElementById('sec-example').innerText = section.example;

    document.getElementById('sec-ingredients').innerHTML = section.ingredients.map(ing => `<li>${ing}</li>`).join('');
    document.getElementById('sec-cases').innerHTML = section.cases.map(c => `
        <div class="study-item" style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--border-color);">
             <strong>${c}</strong>
        </div>
    `).join('');

    // Remove existing save button and actions container if any
    const existingActions = document.getElementById('section-actions');
    if (existingActions) existingActions.remove();

    // Create a dedicated actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.id = 'section-actions';
    actionsDiv.style.marginTop = '32px';
    actionsDiv.style.paddingTop = '24px';
    actionsDiv.style.borderTop = '1px solid var(--border-color)';
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '12px';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Save to Notes`;
    saveBtn.onclick = () => {
        const notes = JSON.parse(localStorage.getItem('lisa_notes') || '[]');
        notes.push({
            title: `Note on Sec ${secId}`,
            body: section.meaning,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('lisa_notes', JSON.stringify(notes));
        alert("Saved to My Notes!");
    };

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-secondary';
    copyBtn.innerHTML = `<span class="material-symbols-rounded">content_copy</span> Copy`;
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(section.meaning);
        alert("Copied to clipboard!");
    };

    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(copyBtn);
    document.querySelector('#section-detail-view .card').appendChild(actionsDiv);
}

window.showSectionDetail = showSectionDetail;

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-target');
            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
            document.getElementById(target).style.display = 'block';
        });
    });
}

function handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const actId = params.get('act');
    const secId = params.get('section');

    if (actId) {
        showActDetail(actId);
    } else if (secId) {
        // Find which act it belongs to
        const act = actsDataStore.find(a => a.sections.some(s => s.id === secId));
        if (act) {
            currentAct = act;
            showSectionDetail(secId);
        }
    }
}
