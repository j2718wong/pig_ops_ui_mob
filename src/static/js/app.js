// March 8, 2026
// Jack Wong
// j2718wong@gmail.com

import { ManagerLogin } from './pages/account_management/manager_login.js';

// Initialize the application when DOM is ready
function initializeApp() {
    console.log('Starting SuperPig login...');
    
    const managerLogin = new ManagerLogin();
    managerLogin.init();
    managerLogin.onPageLoad();
    
    // Make available globally if needed
    globalThis.managerLogin = managerLogin;
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
