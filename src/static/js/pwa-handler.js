// pwa-handler.js

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


var appInstalledTracked = false;

window.addEventListener('appinstalled', () => {
    if (appInstalledTracked) return;
    appInstalledTracked = true;
    
    console.log('PWA: app installed');
    localStorage.removeItem('pwa_ready');
    window.deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa-installed'));
});



// Detect iOS Safari
const isIOS             = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone      = window.matchMedia('(display-mode: standalone)').matches;
const isIOSStandalone   = window.navigator.standalone === true;


// Different install methods for different platforms
if (isIOS && !isIOSStandalone) {
    // iOS: Show "Add to Home Screen" instructions
    console.log('iOS detected - showing add to home screen instructions');
    localStorage.setItem('pwa_ready_ios', 'true');
    
    // Show a custom modal with iOS instructions
    window.dispatchEvent(new CustomEvent('pwa-ios-ready'));
} else if (!isIOS && !isStandalone) {
    // Android/Chrome: Use beforeinstallprompt
    console.log('Android/Chrome - waiting for beforeinstallprompt');
}
