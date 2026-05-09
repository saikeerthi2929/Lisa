document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-input');
    const explainBtn = document.getElementById('explain-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');

    let currentMode = 'simple';

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.getAttribute('data-mode');
        });
    });

    window.setPrompt = (text) => {
        input.value = text;
        input.focus();
    };

    explainBtn.addEventListener('click', () => {
        const query = input.value.trim();
        if (!query) return;

        generateExplanation(query, currentMode);
    });

    // Save to Notes Logic
    const saveBtn = document.querySelector('#ai-result .btn-secondary:last-child');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const notes = JSON.parse(localStorage.getItem('lisa_notes') || '[]');
            notes.push({
                title: document.getElementById('result-title').innerText,
                body: document.getElementById('result-content').innerText,
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem('lisa_notes', JSON.stringify(notes));
            alert("Explanation saved to My Notes!");
        });
    }
});

async function generateExplanation(query, mode) {
    const loading = document.getElementById('ai-loading');
    const result = document.getElementById('ai-result');
    const resultContent = document.getElementById('result-content');
    const resultTitle = document.getElementById('result-title');
    const resultTag = document.getElementById('result-tag');

    result.style.display = 'none';
    loading.style.display = 'block';

    // Mock AI delay
    await new Promise(r => setTimeout(r, 1500));

    loading.style.display = 'none';
    result.style.display = 'block';

    // Logic for mock responses based on templates
    let response = "";
    let title = query.length > 30 ? query.substring(0, 30) + "..." : query;

    if (mode === 'exam') {
        resultTag.innerText = "IRAC FORMAT";
        resultTag.className = "tag tag-civil";
        response = `
            <div style="margin-bottom: 20px;">
                <strong style="color: var(--accent-color);">ISSUE:</strong> 
                <p>Whether ${query} involves a component of liability or constitutional right?</p>
            </div>
            <div style="margin-bottom: 20px;">
                <strong style="color: var(--accent-color);">RULE:</strong> 
                <p>According to the relevant provision of Indian Law, the burden of proof lies on the party asserting the claim. Landmark judgments suggest a strict adherence to procedure.</p>
            </div>
            <div style="margin-bottom: 20px;">
                <strong style="color: var(--accent-color);">ANALYSIS:</strong> 
                <p>Applying the legal principles to your query, we observe that the essential ingredients of the statute are present. This justifies the application of the 'Reasonable Man' test.</p>
            </div>
            <div>
                <strong style="color: var(--accent-color);">CONCLUSION:</strong> 
                <p>Therefore, based on the above IRAC analysis, the scenario likely results in a favorable ruling provided the precedents are followed.</p>
            </div>
        `;
    } else if (mode === 'problem') {
        resultTag.innerText = "PROBLEM SOLVER";
        resultTag.className = "tag tag-criminal";
        response = `
            <h4 style="margin-bottom: 12px;">Legal Solution:</h4>
            <p>1. <strong>Step One:</strong> Identify the parties and the nature of the dispute.</p>
            <p>2. <strong>Step Two:</strong> Check for the presence of 'Mens Rea' (Guilty Mind) if it is a criminal matter.</p>
            <p>3. <strong>Step Three:</strong> Refer to Section 300 IPC or Article 21 where applicable.</p>
            <p>4. <strong>Recommendation:</strong> In the facts provided, the user should focus on the lack of premeditation to minimize liability.</p>
        `;
    } else {
        resultTag.innerText = "SIMPLE EXPLANATION";
        resultTag.className = "tag tag-consti";
        response = `
            <p>In simple terms, <strong>${query}</strong> is about understanding the balance between rights and duties. Think of it like a contract where both sides must fulfill their promise.</p>
            <p style="margin-top: 16px;">The core idea is to ensure justice is served without causing undue harassment to any party involved.</p>
        `;
    }

    resultTitle.innerText = `Result: ${title}`;
    resultContent.innerHTML = response;
}
