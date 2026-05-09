// Auth & Role Management
const AuthManager = {
    setUser(role, userData) {
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify(userData));
    },

    getRole() {
        return localStorage.getItem('userRole');
    },

    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    },

    isLoggedIn() {
        return !!this.getRole();
    },

    getPathPrefix() {
        const path = window.location.pathname;
        return path.includes('/pages/') ? '../' : '';
    },

    logout() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        window.location.href = this.getPathPrefix() + 'index.html';
    },

    // Switch role - clears old data and allows re-registration
    switchRole() {
        if (confirm('Switching roles will log you out. Continue?')) {
            this.logout();
        }
    },

    checkAccess(requiredRole) {
        const currentRole = this.getRole();
        const prefix = this.getPathPrefix();

        if (!currentRole) {
            window.location.href = prefix + 'index.html';
            return false;
        }
        if (requiredRole && currentRole !== requiredRole) {
            window.location.href = prefix + 'dashboard.html';
            return false;
        }
        return true;
    }
};

// Role-based Navigation Configuration
const RoleConfig = {
    citizen: {
        badge: { text: 'Citizen', class: 'badge-citizen', icon: 'person' },
        allowedPages: ['dashboard.html', 'lawyer.html', 'chat.html', 'vault.html'],
        sidebarItems: [
            { icon: 'dashboard', text: 'Dashboard', href: 'dashboard.html' },
            { icon: 'gavel', text: 'AI Lawyer', href: 'lawyer.html' },
            { icon: 'smart_toy', text: 'Legal Chatbot', href: 'chat.html' },
            { icon: 'folder_special', text: 'Evidence Vault', href: 'vault.html' }
        ],
        defaultDashboard: 'citizen'
    },
    student: {
        badge: { text: 'Law Student', class: 'badge-student', icon: 'school' },
        allowedPages: ['dashboard.html', 'student.html', 'acts.html', 'cases.html', 'explainer.html', 'quiz.html', 'notes.html'],
        sidebarItems: [
            { icon: 'dashboard', text: 'Dashboard', href: 'dashboard.html' },
            { icon: 'menu_book', text: 'Simplified Acts', href: 'acts.html' },
            { icon: 'gavel', text: 'Case Library', href: 'cases.html' },
            { icon: 'psychology', text: 'AI Explainer', href: 'explainer.html' },
            { icon: 'quiz', text: 'Practice Tests', href: 'quiz.html' },
            { icon: 'edit_note', text: 'My Notes', href: 'notes.html' }
        ],
        defaultDashboard: 'student'
    },
    admin: {
        badge: { text: 'Admin', class: 'badge-admin', icon: 'admin_panel_settings' },
        allowedPages: ['dashboard.html', 'lawyer.html', 'chat.html', 'vault.html', 'student.html'],
        sidebarItems: [
            { icon: 'dashboard', text: 'Dashboard', href: 'dashboard.html' },
            { icon: 'admin_panel_settings', text: 'Admin Panel', href: 'dashboard.html' },
            { icon: 'people', text: 'User Management', href: 'dashboard.html' },
            { icon: 'analytics', text: 'Analytics', href: 'dashboard.html' }
        ],
        defaultDashboard: 'admin'
    }
};

// Initialize role-based UI
function initRoleBasedUI() {
    const role = AuthManager.getRole();
    if (!role) return;

    const config = RoleConfig[role];
    if (!config) return;

    // 1. Update Sidebar Navigation (Authorized Items Only)
    const sidebar = document.querySelector('.sidebar-nav');
    if (sidebar) {
        // Find the first UL which contains the main nav items
        const navList = sidebar.querySelector('ul');
        if (navList) {
            const prefix = AuthManager.getPathPrefix();
            const isSubdir = prefix === '../';
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            navList.innerHTML = config.sidebarItems.map((item) => {
                let finalHref = item.href;

                // If we are at root and target is a modular student page
                if (!isSubdir && role === 'student' && !item.href.startsWith('pages/')) {
                    finalHref = 'pages/' + item.href;
                }
                // If we are in pages/ and target is a root page
                else if (isSubdir && (item.href === 'lawyer.html' || item.href === 'chat.html' || item.href === 'vault.html' || item.href === 'index.html')) {
                    finalHref = '../' + item.href;
                }

                const isActive = currentPage === item.href || (currentPage === 'dashboard.html' && item.href === 'dashboard.html');
                return `
                    <li class="nav-item ${isActive ? 'active' : ''}">
                        <a href="${finalHref}">
                            <span class="material-symbols-rounded">${item.icon}</span>
                            ${item.text}
                        </a>
                    </li>
                `;
            }).join('');

            // Add Logout at the bottom
            navList.innerHTML += `
                <li class="nav-divider" style="height: 1px; background: rgba(0,0,0,0.05); margin: 8px 0;"></li>
                <li class="nav-item">
                    <a href="#" onclick="AuthManager.logout(); return false;">
                        <span class="material-symbols-rounded">logout</span>
                        Logout
                    </a>
                </li>
            `;
        }
    }

    // 2. Add Role Badge to Top Navbar
    const badgeTargets = ['.nav-right', '.chat-actions', '.student-header', '.landing-header > div:last-child'];
    let badgeContainer = null;

    for (const selector of badgeTargets) {
        badgeContainer = document.querySelector(selector);
        if (badgeContainer) break;
    }

    if (badgeContainer) {
        // Remove existing badge if any
        const existingBadge = badgeContainer.querySelector('.nav-role-badge');
        if (existingBadge) existingBadge.remove();

        // Create new badge
        const badgeSpan = document.createElement('span');
        badgeSpan.className = `role-badge ${config.badge.class} nav-role-badge`;
        badgeSpan.innerHTML = `
            <span class="material-symbols-rounded" style="font-size: 16px;">${config.badge.icon}</span>
            ${config.badge.text}
        `;

        // Context-aware placement
        if (badgeContainer.classList.contains('nav-right')) {
            const searchBar = badgeContainer.querySelector('.search-bar');
            if (searchBar) {
                badgeContainer.insertBefore(badgeSpan, searchBar);
            } else {
                badgeContainer.prepend(badgeSpan);
            }
        } else if (badgeContainer.classList.contains('chat-actions')) {
            badgeContainer.prepend(badgeSpan);
        } else {
            badgeContainer.appendChild(badgeSpan);
        }
    }

    // 3. Set Dashboard Panel (if on dashboard.html)
    if (window.location.pathname.includes('dashboard.html')) {
        const defaultPanel = config.defaultDashboard;

        // Show the correct panel immediately and hide others completely
        const allPanels = document.querySelectorAll('.dashboard-panel');
        allPanels.forEach(p => {
            if (p.id === 'panel-' + defaultPanel) {
                p.classList.add('active');
                p.style.display = 'block';
            } else {
                p.classList.remove('active');
                p.style.display = 'none';
            }
        });

        // Update page title
        const pageTitle = document.getElementById('dashboard-title');
        const roleMap = {
            'citizen': 'Citizen Dashboard',
            'student': 'Student Dashboard',
            'admin': 'Admin Console'
        };
        if (pageTitle && roleMap[role]) {
            pageTitle.textContent = roleMap[role];
        }
    }

    // 4. Update User Profile Display (Bottom Sidebar)
    const userData = AuthManager.getUserData();
    if (userData) {
        const userNameEl = document.querySelector('.user-name');
        const userRoleEl = document.querySelector('.user-role');
        const avatarEl = document.querySelector('.avatar');

        if (userNameEl) userNameEl.textContent = userData.name || 'User';
        if (userRoleEl) userRoleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);

        if (avatarEl && userData.name) {
            const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            avatarEl.innerText = initials;
            avatarEl.style.backgroundColor = role === 'admin' ? '#ef4444' : role === 'student' ? '#8b5cf6' : '#0ea5e9';
        }
    }

    // 5. Hide internal role switcher for production/regular users
    const roleDropdown = document.querySelector('.role-dropdown');
    if (roleDropdown && role !== 'admin') {
        roleDropdown.style.display = 'none';
    }
}

// Check for registration success messages (runs even if not logged in)
function checkRegistrationSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg') === 'registered' || urlParams.get('registered') === 'true') {
        const banner = document.getElementById('success-banner');
        if (banner) {
            banner.style.display = 'flex';
            banner.classList.add('animate-in');
        } else {
            // Premium Toast
            const toast = document.createElement('div');
            toast.className = 'registration-toast';
            toast.style.cssText = `
                position: fixed; 
                top: 24px; 
                left: 50%; 
                transform: translateX(-50%); 
                background: white; 
                color: #166534; 
                padding: 16px 24px; 
                border-radius: 12px; 
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
                z-index: 2000; 
                font-family: Inter, sans-serif; 
                font-size: 0.95rem; 
                border-left: 4px solid #10b981; 
                display: flex; 
                align-items: center; 
                gap: 12px;
                animation: slideDownFade 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            toast.innerHTML = `
                <span class="material-symbols-rounded" style="color: #10b981;">check_circle</span>
                <div>
                    <strong style="display: block; color: #064e3b;">Success!</strong>
                    <span>Registration complete. Please sign in to continue.</span>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-20px)';
                toast.style.transition = 'all 0.5s ease';
                setTimeout(() => toast.remove(), 500);
            }, 5000);
        }
    }
}

// Update landing page if logged in
function updateLandingContext() {
    if (!AuthManager.isLoggedIn()) {
        // Handle unauthenticated card clicks
        const cards = document.querySelectorAll('.mode-card');
        cards.forEach(card => {
            card.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === 'student.html') {
                    e.preventDefault();
                    window.location.href = 'register_student.html';
                } else if (href === 'lawyer.html' || href === 'chat.html') {
                    e.preventDefault();
                    window.location.href = 'register_citizen.html';
                }
            });
        });
        return;
    }

    // Convert Login/Sign Up buttons to Dashboard
    const authButtons = document.querySelectorAll('.landing-login-btn');
    if (authButtons.length > 0) {
        const header = authButtons[0].parentElement;
        header.innerHTML = `
            <span class="nav-role-badge"></span>
            <a href="dashboard.html" class="landing-login-btn" style="background-color: var(--primary-color); border-color: var(--primary-color); color: white; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-rounded" style="font-size: 18px;">dashboard</span>
                Go to Dashboard
            </a>
            <a href="#" onclick="AuthManager.logout(); return false;" class="landing-login-btn">Log Out</a>
        `;
        // Re-run UI init to inject badge into the new span
        initRoleBasedUI();
    }
}

// Page access control - UPDATED to allow registration pages
function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();

    // Public pages that anyone can access (logged in or not)
    const publicPages = ['index.html', 'register.html', 'register_citizen.html', 'register_student.html', 'login.html', 'citizen_login.html', 'student_login.html', 'admin_login.html'];

    // Allow access to public pages
    if (publicPages.includes(currentPage)) {
        // Show a notice on registration pages if already logged in
        if (AuthManager.isLoggedIn() && currentPage.includes('register')) {
            const notice = document.createElement('div');
            notice.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #fef3c7; color: #92400e; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; font-family: Inter, sans-serif; font-size: 0.9rem;';
            notice.innerHTML = `
                <strong>Note:</strong> You're already logged in as ${AuthManager.getRole()}. 
                Registering again will switch your role and clear previous data.
            `;
            document.body.appendChild(notice);
            setTimeout(() => notice.remove(), 5000);
        }
        return; // Allow access
    }

    // For protected pages, check if logged in
    const role = AuthManager.getRole();
    const prefix = AuthManager.getPathPrefix();

    if (!role) {
        // Smart redirect for unauthenticated users
        if (currentPage === 'student.html') {
            window.location.href = prefix + 'student_login.html';
        } else if (['lawyer.html', 'chat.html', 'vault.html'].includes(currentPage)) {
            window.location.href = prefix + 'citizen_login.html';
        } else {
            window.location.href = prefix + 'citizen_login.html'; // Default
        }
        return;
    }

    // Check if user has permission for this page
    const config = RoleConfig[role];
    if (config && !config.allowedPages.includes(currentPage)) {
        alert('Access Denied: You do not have permission to view this page.');
        window.location.href = prefix + 'dashboard.html';
    }
}

// Run on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        checkPageAccess();
        initRoleBasedUI();
        checkRegistrationSuccess();
        updateLandingContext();
    });
}
