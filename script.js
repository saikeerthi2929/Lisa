document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar & Navigation Logic ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav li');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    window.addEventListener('resize', () => {
        if (sidebar && window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Checkboxes Visual Logic
    const checkboxes = document.querySelectorAll('.checkbox-wrapper input');
    checkboxes.forEach(box => {
        box.addEventListener('change', function () {
            const title = this.closest('.task-item').querySelector('.task-title');
            if (title) {
                if (this.checked) title.classList.add('completed');
                else title.classList.remove('completed');
            }
        });
    });

    // --- Role Switching Logic ---
    const roleToggleBtn = document.getElementById('role-toggle-btn');
    const roleMenu = document.getElementById('role-menu');
    const currentRoleSpan = document.getElementById('current-role');
    const pageTitle = document.getElementById('dashboard-title');

    const roleMap = {
        'citizen': { title: 'Citizen Dashboard', icon: 'person' },
        'student': { title: 'Student Dashboard', icon: 'school' },
        'admin': { title: 'Admin Console', icon: 'admin_panel_settings' }
    };

    if (roleToggleBtn && roleMenu) {
        roleToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            roleMenu.classList.toggle('active');
            console.log('Role menu toggled');
        });

        document.addEventListener('click', (e) => {
            if (!roleToggleBtn.contains(e.target) && !roleMenu.contains(e.target)) {
                roleMenu.classList.remove('active');
            }
        });
    }

    // Expose switchRole globally
    window.switchRole = function (role) {
        console.log('Switching to role:', role);

        // Update Panel
        document.querySelectorAll('.dashboard-panel').forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById('panel-' + role);
        if (targetPanel) targetPanel.classList.add('active');

        // Update Button Info
        if (currentRoleSpan) currentRoleSpan.textContent = role.charAt(0).toUpperCase() + role.slice(1);

        if (roleToggleBtn) {
            const icon = roleToggleBtn.querySelector('.material-symbols-rounded');
            if (icon && roleMap[role]) icon.textContent = roleMap[role].icon;
        }

        // Update Title
        if (pageTitle && roleMap[role]) {
            pageTitle.textContent = roleMap[role].title;
        }

        // Highlight Menu Item
        const menuItems = document.querySelectorAll('.role-item');
        menuItems.forEach(item => {
            item.classList.remove('current');
            // Check if this item corresponds to the role (simple text check or onclick attribute check)
            if (item.textContent.toLowerCase().includes(role)) {
                item.classList.add('current');
            }
        });

        // Close Menu
        if (roleMenu) roleMenu.classList.remove('active');
    };
});
