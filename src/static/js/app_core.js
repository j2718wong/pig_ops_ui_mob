// March 8, 2026
// Jack Wong
// j2718wong@gmail.com

import { Navigation } from './pages/navigation/navigation.js';

// Initialize the application when DOM is ready
function initializeAppCore() {
    console.log('Starting SuperPig');
    
    const navigation = new Navigation();
    navigation.init();
    
    // Make available globally if needed
    window.navigation = navigation;
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppCore);
} else {
    initializeAppCore();
}
