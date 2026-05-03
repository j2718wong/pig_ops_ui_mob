// Global PWA event handler - runs on ALL pages
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: beforeinstallprompt captured globally');
    e.preventDefault();
    window.deferredPrompt = e;
    
    // Store in localStorage so dashboard knows PWA is ready
    localStorage.setItem('pwa_ready', 'true');
    
    // Track event if user is already logged in (rare case)
    if (window.SUPERPIG_LOGGED_IN === true) {
        // Dispatch custom event for dashboard to pick up
        window.dispatchEvent(new CustomEvent('pwa-ready', { detail: e }));
    }
});

window.addEventListener('appinstalled', () => {
    console.log('PWA: app installed');
    localStorage.removeItem('pwa_ready');
    window.deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa-installed'));
});
