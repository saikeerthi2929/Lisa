// Add warning banner for already logged-in users on registration pages
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AuthManager !== 'undefined' && AuthManager.isLoggedIn()) {
        const currentRole = AuthManager.getRole();
        const userData = AuthManager.getUserData();

        // Create warning banner
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: #78350f;
            padding: 16px;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: 'Inter', sans-serif;
        `;

        banner.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px;">
                <span class="material-symbols-rounded" style="font-size: 24px;">warning</span>
                <div style="text-align: left;">
                    <strong>Already Logged In</strong><br>
                    <span style="font-size: 0.9rem;">
                        You're currently registered as <strong>${currentRole}</strong> (${userData?.name || 'User'}). 
                        Completing this form will switch your role and replace your account data.
                    </span>
                </div>
                <button onclick="window.location.href='dashboard.html'" 
                    style="background: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-left: auto;">
                    Go to Dashboard
                </button>
            </div>
        `;

        document.body.insertBefore(banner, document.body.firstChild);
        document.body.style.paddingTop = '80px';
    }
});
