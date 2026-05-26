// pwa-handler.js - With duplicate prevention


// Prevent duplicate execution
if (window.__pwaHandlerInitialized) {
    console.log('pwa-handler already initialized, skipping');
}
else {

    window.__pwaHandlerInitialized = true;

    let registrationAttempted = false;

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

    // SILENT Service Worker Update - No User Notifications
    if ('serviceWorker' in navigator) {
        // Register immediately, don't wait for load
        registerAndMonitorServiceWorker();
    }

    async function registerAndMonitorServiceWorker() {
        // Prevent multiple registration attempts
        if (registrationAttempted) {
            console.log('Registration already attempted, skipping');
            return;
        }
        registrationAttempted = true;
        
        // Check if already registered
        try {
            const existingRegs = await navigator.serviceWorker.getRegistrations();
            if (existingRegs.length > 0) {
                console.log('Service worker already registered, using existing');
                window.swRegistration = existingRegs[0];
                
                // Still check for updates on existing registration
                try {
                    await window.swRegistration.update();
                } catch (e) {
                    console.log('Update check failed:', e);
                }
                return;
            }
        } catch (error) {
            console.log('Error checking existing registrations:', error);
        }
        
        // Only register if no existing SW
        try {
            // Get current version
            const appVersion = window.APP_VERSION || Date.now();
            
            const registration = await navigator.serviceWorker.register(
                `/service_worker.js?v=${appVersion}`,
                { scope: '/' }
            );
            
            console.log('SW registered:', registration.scope);
            
            // Store registration globally
            window.swRegistration = registration;
            
            // SILENT: Check for updates immediately
            await registration.update();
            
            // SILENT: Auto-update when new worker is found
            registration.addEventListener('updatefound', () => {
                console.log('New service worker found - updating silently');
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    console.log('SW state changed:', newWorker.state);
                    
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New worker is waiting - activate it silently
                        console.log('New SW ready - activating silently');
                        if (newWorker) {
                            newWorker.postMessage({ action: 'skipWaiting' });
                        }
                        // Reload to use new version (silent, no user prompt)
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                });
            });
            
            // SILENT: Check for updates periodically (every 6 hours)
            setInterval(async () => {
                if (window.swRegistration) {
                    await window.swRegistration.update();
                    console.log('Periodic SW update check completed');
                }
            }, 6 * 60 * 60 * 1000); // Every 6 hours
            
        } catch (error) {
            console.log('SW registration failed:', error);
        }
    }

    // SILENT: Handle controller change (new SW activated)
    if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker updated - new version active');
            // No user notification - just log it
        });
    }

    // Detect iOS Safari
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;

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

    function isInAppBrowser() {
        const ua = navigator.userAgent;
        
        // Standard WebView detection
        const isWebView = /FBAN|FBAV|Instagram|Line|Twitter|WhatsApp|Snapchat/.test(ua);
        
        // Additional detection for iOS WebView
        const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
        
        // Android WebView detection
        const isAndroidWebView = /wv/.test(ua);
        
        return isWebView || isIOSWebView || isAndroidWebView;
    }

    function showOpenInBrowserModal() {
        if (document.getElementById('browser-warning-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'browser-warning-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 20px; max-width: 340px; width: 85%; padding: 24px; text-align: center;">
                    <div style="font-size: 48px;">🌐</div>
                    <h3 style="margin: 12px 0 8px; color: #1e3a8a;">Open in Browser</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 16px;">
                        Please open SuperPig in <strong>Chrome, Firefox or Safari</strong><br>
                        so you can install the App after signup.
                    </p>
                    
                    <div style="background: #f0f2f5; border-radius: 8px; padding: 12px; margin: 16px 0;">
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                            <code style="font-size: 14px; word-break: break-all; color: #1e3a8a;">superpig.jsysdev.com</code>
                            <button id="copy-link-btn" style="background: #1e3a8a; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                    </div>
                    
                    <ol style="text-align: left; color: #666; font-size: 13px; margin: 16px 0; padding-left: 20px;">
                        <li style="margin: 6px 0;">Tap <strong>⋯</strong> (menu) or <strong>📤</strong> (share)</li>
                        <li style="margin: 6px 0;">Select <strong>"Open in Chrome"</strong> or <strong>"Safari"</strong></li>
                        <li style="margin: 6px 0;">Sign up and install SuperPig</li>
                    </ol>
                    
                    <button id="close-warning-modal" style="background: #1e3a8a; color: white; border: none; padding: 10px 24px; border-radius: 30px; font-size: 16px; cursor: pointer;">
                        Got it
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Copy link button
        const copyBtn = modal.querySelector('#copy-link-btn');
        if (copyBtn) {
            copyBtn.onclick = () => {
                const link = 'https://superpig.jsysdev.com';
                navigator.clipboard.writeText(link).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                });
            };
        }
        
        // Close button
        const closeBtn = modal.querySelector('#close-warning-modal');
        if (closeBtn) {
            closeBtn.onclick = () => modal.remove();
        }
        
        // Close when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    // Check and show modal
    if (isInAppBrowser()) {
        // Wait for page to load
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(showOpenInBrowserModal, 500);
        });
    }

}
