document.addEventListener('DOMContentLoaded', () => {
    loadDashboardState();
    renderRecommendedTopics();

    // Logic for Resume Button
    const resumeBtn = document.querySelector('#continue-card button');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            // Mock navigation to the last viewed section
            window.location.href = 'acts.html?section=300';
        });
    }
});

function loadDashboardState() {
    // Get real user data if available, otherwise fallback to defaults
    const userData = (typeof AuthManager !== 'undefined') ? AuthManager.getUserData() : null;

    const userState = {
        name: userData?.name || "Student",
        progress: userData?.progress || {
            ipc: 75,
            consti: 40
        }
    };

    // Update Welcome message
    const welcomeHeader = document.querySelector('.content-area h2');
    if (welcomeHeader && userData?.name) {
        const hours = new Date().getHours();
        const greeting = hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";
        welcomeHeader.innerText = `${greeting}, ${userData.name.split(' ')[0]}`;
    }

    // Update completion stats if real data exists
    if (userData?.stats) {
        const studyHoursEl = document.querySelector('.card h2'); // First H2 in first card
        if (studyHoursEl) studyHoursEl.innerText = userData.stats.totalHours + 'h';
    }
}

function renderRecommendedTopics() {
    const topics = [
        { title: "Exceptions to Murder (Sec 300)", label: "Criminal", color: "tag-criminal" },
        { title: "Writ Jurisdictions (Art 32)", label: "Constitutional", color: "tag-consti" },
        { title: "Summary Suits (Order 37)", label: "Civil", color: "tag-civil" }
    ];

    const container = document.getElementById('topics-list');
    if (!container) return;

    container.innerHTML = topics.map(topic => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
            <div>
                <span class="tag ${topic.color}" style="margin-bottom: 4px;">${topic.label}</span>
                <p style="font-weight: 600;">${topic.title}</p>
            </div>
            <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;">Explore</button>
        </div>
    `).join('');
}
