/**
 * LISA Student – Legal Study Hub (India)
 * Simulated Knowledge Base and Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. DATA REPOSITORIES (MOCK)
    // ============================

    const ACTS_DB = {
        "IPC_300": {
            id: "300",
            act: "IPC",
            name: "Murder",
            level: "Criminal Law",
            tabs: {
                meaning: "Section 300 defines Murder. It states that culpable homicide is murder if the act by which the death is caused is done with the intention of causing death, or causing such bodily injury as is likely to cause death.",
                ingredients: "1. Causing of Death.<br>2. Intent to cause death.<br>3. Knowledge that the act is so imminently dangerous.<br>4. Absence of Exceptions.",
                cases: "• <strong>KM Nanavati v. State of Maharashtra</strong> (Grave and sudden provocation)<br>• <strong>State of AP v. R Punnayya</strong> (Distinction between 299 and 300)",
                exam_tips: "Focus on the 5 Exceptions. Exception 1 (Provocation) and Exception 4 (Sudden Fight) are most frequently asked.",
                mcqs: [
                    { q: "How many exceptions are there in Section 300 IPC?", a: ["4", "5", "6"], c: 1 },
                    { q: "Culpable homicide is not murder if it falls under...", a: ["Sec 299", "Sec 300 Exceptions", "Sec 302"], c: 1 }
                ]
            }
        },
        "Constitution_21": {
            id: "21",
            act: "Constitution",
            name: "Right to Life & Personal Liberty",
            level: "Constitutional Law",
            tabs: {
                meaning: "Article 21: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.'",
                ingredients: "1. Protection of Life.<br>2. Protection of Personal Liberty.<br>3. Available to Citizens & Non-Citizens.",
                cases: "• <strong>A.K. Gopalan Case</strong> (Narrow interpretation)<br>• <strong>Maneka Gandhi Case</strong> (Broad interpretation - Due Process)",
                exam_tips: "Article 21 is a 'residuary' right. Mention the 'Golden Triangle' (Art 14, 19, 21).",
                mcqs: [
                    { q: "Which case established 'Due Process' in Art 21?", a: ["Gopalan", "Maneka Gandhi", "Kesavananda"], c: 1 }
                ]
            }
        }
    };

    const CASES_DB = [
        {
            name: "Kesavananda Bharati v. State of Kerala",
            year: "1973",
            court: "Supreme Court (13-judge bench)",
            facts: "Challenge to the 24th, 25th, and 29th Amendments and Kerala Land Reforms Act.",
            issues: "Can Parliament amend any part of the Constitution, including Fundamental Rights?",
            held: "Parliament can amend any part, but cannot destroy the 'Basic Structure'.",
            ratio: "The power to amend under Article 368 is not the power to destroy.",
            importance: "Crucial for Judicial Review and Constitutional Stability."
        },
        {
            name: "Vishaka v. State of Rajasthan",
            year: "1997",
            court: "Supreme Court",
            facts: "Bhanwari Devi, a social worker, was gang-raped. No legislation existed for workplace harassment.",
            issues: "Absence of law against sexual harassment at workplaces.",
            held: "Supreme Court laid down comprehensive guidelines (Vishaka Guidelines).",
            ratio: "Gender equality includes protection from sexual harassment.",
            importance: "Precursor to the POSH Act 2013."
        }
    ];

    // ============================
    // 2. NAVIGATION & TABS
    // ============================

    const navItems = document.querySelectorAll('.nav-item');
    const contentViews = document.querySelectorAll('.content-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');

            // UI Toggle
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            contentViews.forEach(v => v.classList.remove('active'));
            document.getElementById(target).classList.add('active');

            if (target === 'cases-module') renderCasesList();
            if (target === 'practice-module') renderQuizMenu();
        });
    });

    // ============================
    // 3. ACTS MODULE LOGIC
    // ============================

    function loadSectionView(sectionKey) {
        const data = ACTS_DB[sectionKey];
        if (!data) return;

        const container = document.getElementById('section-viewer-content');
        container.innerHTML = `
            <div class="section-header">
                <div class="card-tag ${data.act === 'IPC' ? 'criminal-tag' : 'consti-tag'}">${data.level}</div>
                <h2 class="serif-font">${data.act} Section ${data.id}: ${data.name}</h2>
            </div>
            <div class="section-tabs">
                <button class="s-tab active" data-tab="meaning">Meaning</button>
                <button class="s-tab" data-tab="ingredients">Ingredients</button>
                <button class="s-tab" data-tab="cases">Case Laws</button>
                <button class="s-tab" data-tab="exam_tips">Exam Tips</button>
                <button class="s-tab" data-tab="mcqs">Quiz</button>
            </div>
            <div id="s-tab-body" class="s-tab-content">
                ${data.tabs.meaning}
            </div>
        `;

        // Tab Switching
        const tabs = container.querySelectorAll('.s-tab');
        tabs.forEach(t => {
            t.addEventListener('click', () => {
                tabs.forEach(btn => btn.classList.remove('active'));
                t.classList.add('active');
                const tabKey = t.getAttribute('data-tab');

                if (tabKey === 'mcqs') {
                    renderMiniQuiz(data.tabs.mcqs);
                } else {
                    document.getElementById('s-tab-body').innerHTML = data.tabs[tabKey];
                }
            });
        });
    }

    function renderMiniQuiz(mcqs) {
        const body = document.getElementById('s-tab-body');
        body.innerHTML = mcqs.map((q, i) => `
            <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <p><strong>Q${i + 1}: ${q.q}</strong></p>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
                    ${q.a.map((opt, oi) => `
                        <button class="mode-btn quiz-opt" data-correct="${oi === q.c}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `).join('');

        body.querySelectorAll('.quiz-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const isCorrect = btn.getAttribute('data-correct') === 'true';
                btn.style.background = isCorrect ? 'var(--law-constitutional)' : 'var(--law-criminal)';
                btn.style.color = 'white';
                if (!isCorrect) {
                    const items = btn.parentElement.querySelectorAll('.quiz-opt');
                    items.forEach(it => {
                        if (it.getAttribute('data-correct') === 'true') {
                            it.style.background = 'var(--law-constitutional)';
                            it.style.color = 'white';
                        }
                    });
                }
            });
        });
    }

    // ============================
    // 4. CASES MODULE LOGIC
    // ============================

    window.viewCaseDetail = (index) => {
        const c = CASES_DB[index];
        const container = document.getElementById('cases-list-container');
        container.innerHTML = `
            <button class="text-btn" onclick="window.renderCasesList()"><span class="material-symbols-rounded">arrow_back</span> Back to List</button>
            <div class="student-card" style="margin-top: 20px; padding: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="serif-font">${c.name}</h2>
                    <span class="material-symbols-rounded" style="cursor: pointer;">bookmark</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 32px;">${c.year} • ${c.court}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                    <div>
                        <h4 style="color: var(--accent-color);">Facts of the Case</h4>
                        <p>${c.facts}</p>
                        <br>
                        <h4 style="color: var(--accent-color);">Issues Raised</h4>
                        <p>${c.issues}</p>
                    </div>
                    <div>
                        <h4 style="color: var(--accent-color);">Decision / Held</h4>
                        <p>${c.held}</p>
                        <br>
                        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent-color);">
                            <h4 style="margin-bottom: 8px;">Ratio Decidendi</h4>
                            <p>${c.ratio}</p>
                        </div>
                    </div>
                </div>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-color);">
                <h4>Why is this important for exams?</h4>
                <p>${c.importance}</p>
            </div>
        `;
    };

    // ============================
    // 5. AI EXPLAINER LOGIC
    // ============================

    const explainBtn = document.getElementById('ai-explain-btn');
    const aiResponse = document.getElementById('ai-response-area');

    explainBtn.addEventListener('click', () => {
        const query = document.getElementById('ai-query').value;
        const mode = document.querySelector('.mode-btn.active').getAttribute('data-mode');

        if (!query) return;

        aiResponse.style.display = 'block';
        aiResponse.innerHTML = `<p>LISA AI is processing your academic query...</p>`;

        setTimeout(() => {
            let content = "";
            if (mode === 'irac') {
                content = `
                    <div class="irac-box">
                        <span class="irac-label">ISSUE</span>
                        <p>Whether the act falls under Section 300 (Murder) or Section 299 (Culpable Homicide)?</p>
                        <br>
                        <span class="irac-label">RULE</span>
                        <p>Section 300 requires specific intent or knowledge of imminent danger. Exception 1 applies for provocation.</p>
                        <br>
                        <span class="irac-label">APPLICATION</span>
                        <p>Applying the facts provided, the sudden nature of the quarrel suggests lack of premeditation.</p>
                        <br>
                        <span class="irac-label">CONCLUSION</span>
                        <p>Likely to be classified as Culpable Homicide not amounting to murder.</p>
                    </div>
                `;
            } else if (mode === 'quick') {
                content = `
                    <h4>1-Minute Revision</h4>
                    <p>• <strong>Res Judicata:</strong> Section 11 CPC. "A matter already judged."</p>
                    <p>• <strong>Goal:</strong> Finality in litigation. Prevents same parties from suing again for the same cause.</p>
                    <p>• <strong>Essentials:</strong> Same parties, same title, competent court, final decision.</p>
                `;
            } else {
                content = `
                    <h4>Explanation: ${query}</h4>
                    <p>In simple terms, this concept allows for better understanding of legal principles. For example, in <strong>KM Nanavati's case</strong>, the court looked at the 'time interval' to decide if the provocation was still 'sudden'.</p>
                `;
            }
            aiResponse.innerHTML = content;
        }, 1200);
    });

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.parentElement.classList.contains('explainer-modes')) {
                btn.parentElement.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // ============================
    // 6. SEARCH LOGIC
    // ============================

    const searchInput = document.getElementById('global-search');
    const resultsOverlay = document.getElementById('search-results');

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        if (val.length < 2) {
            resultsOverlay.style.display = 'none';
            return;
        }

        const results = [
            { type: 'Section', name: 'Section 300 IPC (Murder)', key: 'IPC_300' },
            { type: 'Article', name: 'Article 21 (Life)', key: 'Constitution_21' },
            { type: 'Case', name: 'Kesavananda Bharati Case', key: 'cases-module' }
        ].filter(r => r.name.toLowerCase().includes(val));

        if (results.length > 0) {
            resultsOverlay.style.display = 'block';
            resultsOverlay.innerHTML = results.map(r => `
                <div class="study-item" onclick="handleSearchClick('${r.key}', '${r.type}')">
                    <span class="material-symbols-rounded">${r.type === 'Case' ? 'gavel' : 'menu_book'}</span>
                    <div>
                        <strong>${r.name}</strong><br>
                        <small>${r.type}</small>
                    </div>
                </div>
            `).join('');
        }
    });

    window.handleSearchClick = (key, type) => {
        resultsOverlay.style.display = 'none';
        searchInput.value = "";

        if (type === 'Case' || key === 'cases-module') {
            document.querySelector('[data-target="cases-module"]').click();
        } else {
            document.querySelector('[data-target="acts-module"]').click();
            loadSectionView(key);
        }
    };

    // ============================
    // 7. DASHBOARD CLICKS
    // ============================

    document.querySelectorAll('.study-card-click').forEach(card => {
        card.addEventListener('click', () => {
            const sec = card.getAttribute('data-sec');
            const act = card.getAttribute('data-act');
            document.querySelector('[data-target="acts-module"]').click();
            loadSectionView(`${act}_${sec}`);
        });
    });

    // ============================
    // 8. STUDENT MODES (TOGGLE)
    // ============================

    document.querySelectorAll('.m-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.m-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const mode = btn.getAttribute('data-mode');
            const headerTitle = document.querySelector('.page-title');

            if (mode === 'moot') {
                headerTitle.innerText = "Moot Court Prep Center";
                document.body.style.setProperty('--accent-color', '#fbbf24'); // Yellow for moot
            } else if (mode === 'intern') {
                headerTitle.innerText = "Internship Research Portal";
                document.body.style.setProperty('--accent-color', '#8b5cf6'); // Purple for internship
            } else {
                headerTitle.innerText = "Legal Study Hub";
                document.body.style.setProperty('--accent-color', '#3b82f6');
            }
        });
    });

    // Final initialization
    window.renderCasesList = function () {
        const container = document.getElementById('cases-list-container');
        if (!container) return;
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
                ${CASES_DB.map((c, i) => `
                    <div class="student-card case-card" style="cursor: pointer;" onclick="viewCaseDetail(${i})">
                        <h4 class="serif-font" style="color: var(--primary-color);">${c.name}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${c.year} | ${c.court}</p>
                        <div style="margin-top: 12px; font-size: 0.9rem;">
                            <strong>Ratio:</strong> ${c.ratio.substring(0, 60)}...
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    window.renderQuizMenu = function () {
        const container = document.getElementById('quiz-container');
        if (!container) return;
        container.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <h2>Bar Exam Practice Tests</h2>
                <br>
                <div class="student-card study-item" style="margin-bottom:16px;">
                    <span class="material-symbols-rounded">quiz</span>
                    <div>
                        <strong>Daily MCQ Challenge #42</strong><br>
                        <small>10 Questions • Mix of Subjects</small>
                    </div>
                </div>
                <div class="student-card study-item" style="margin-bottom:16px;">
                    <span class="material-symbols-rounded">description</span>
                    <div>
                        <strong>AIBE Previous Year (2023)</strong><br>
                        <small>100 Questions • Full Mock</small>
                    </div>
                </div>
            </div>
        `;
    };

});
