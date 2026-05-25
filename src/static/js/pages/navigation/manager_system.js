// manager_system.js

// April 19, 2026
// Jack Wong
// j2718wong@gmail.com
// Updated: May 25, 2026 - Added PWA token recovery

'use strict';

import {APPLICATION,
        PAGE_ID}            from '../../constants.js';


export function ManagerSystem(_navigation) {
    const thisObj           = this;
    const navigation        = _navigation;
    
    
    // This is the bottom banner that tells No internet
    let elemOffline         = null;
    
    this.isOffLine          = false;
    
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        
         
        elemOffline                 = document.getElementById('offlineIndicator');
        
        
    }
    
    
    
    this._processAfterHtmlRender = function(){
        thisObj.offlineModal = thisObj.initOfflineModal();
        
        // Check and recover token on startup
        thisObj.checkAndRecoverToken();
        
        // NEW: Check if page was served from cache (offline mode)
        thisObj.detectOfflineMode();
    }
    

    // NEW: Detect if we're in offline cache mode
    this.detectOfflineMode = function() {
        // Method 1: Check if we're actually offline
        if (!navigator.onLine) {
            console.log('Browser reports offline');
            thisObj.showMsgOffline();
            thisObj.isOffLine = true;
            return;
        }
        
        // Method 2: Check if page was served from cache (transferSize = 0 means from cache)
        if (performance && performance.getEntriesByType) {
            const navEntry = performance.getEntriesByType('navigation')[0];
            if (navEntry && navEntry.transferSize === 0) {
                console.log('Page was served from cache (transferSize = 0)');
                
                // Test if we're REALLY offline by trying a quick fetch
                fetch('/favicon.ico?t=' + Date.now(), { 
                    method: 'GET',
                    cache: 'no-store',
                    timeout: 2000
                })
                .then(() => {
                    // Online, but page was cached - don't show offline banner
                    console.log('Actually online, page was just cached');
                })
                .catch(() => {
                    // Really offline
                    console.log('Actually offline - showing offline banner');
                    thisObj.showMsgOffline();
                    thisObj.isOffLine = true;
                });
                
                return;
            }
        }
        
        // Method 3: Try a quick network test
        fetch('/favicon.ico?t=' + Date.now(), { 
            method: 'HEAD',
            cache: 'no-store',
            timeout: 2000
        })
        .then(() => {
            // Online - hide offline banner if showing
            if (thisObj.isOffLine) {
                thisObj.hideMsgOffline();
                thisObj.isOffLine = false;
            }
        })
        .catch(() => {
            // Offline
            console.log('Network test failed - offline mode');
            thisObj.showMsgOffline();
            thisObj.isOffLine = true;
        });
    }
    
    
    this._bindEventListeners = function(){
        window.addEventListener('online', function(){
            console.log('Connection restored');
            thisObj.hideMsgOffline();
            
            thisObj.isOffLine = false;
            
            // NEW: When coming back online, check and recover token
            thisObj.checkAndRecoverToken();
            
            // Just notify that we're back online, don't refresh
            // Components can listen for 'connection-restored' event if they need to refresh
            window.dispatchEvent(new CustomEvent('connection-restored'));
        });
        
        window.addEventListener('offline', function(){
            console.log('Connection lost');
            thisObj.showMsgOffline();
            
            thisObj.isOffLine = true;
        });
        
        // NEW: Listen for storage events (in case token was updated in another tab)
        window.addEventListener('storage', (event) => {
            if (event.key === 'access_token') {
                console.log('Token changed in another tab/window');
                if (event.newValue) {
                    console.log('Token found, updating session');
                    thisObj.ensureTokenInAllStorages(event.newValue);
                }
            }
        });
        
        // NEW: Listen for service worker messages
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data === 'offline-mode') {
                    console.log('Received offline mode from service worker');
                    thisObj.showMsgOffline();
                }
            });
        }
    }

    
    this.initOfflineModal = function() {
        if (document.getElementById('offline-msg-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'offline-msg-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 350px;">
                <div class="modal-header" style="background: #dc3545; display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="offline-modal-title" style="margin: 0;">📡 No Internet Connection</h3>
                    <button id="offline-modal-close" style="background: none; border: none; color: white; font-size: 32px; cursor: pointer;">&times;</button>
                </div>
                
                <div class="modal-body">
                    <p id="offline-modal-message" style="font-size: 1rem; margin-bottom: 1.1rem;">
                        This page needs Internet.
                    </p>
                    
                    <p style="color: #666; font-size: 1.2rem;">
                        Your farm data: sows, production, farrowing are still available offline.
                    </p>
                </div>
                
                <div class="modal-footer">
                    
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        document.getElementById('offline-modal-close').onclick = () => {
            modal.style.display = 'none';
        };
        
        
        
        // Close when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        return modal;
    }
    
    
    // Hides Offline  banner below the page
    this.hideMsgOffline = function(){
        thisObj.isOffLine = false;
        if (elemOffline) {
            elemOffline.classList.remove('show');
        }
    }
    
    
    // Show Offline  banner below the page
    this.showMsgOffline = function(){
        thisObj.isOffLine = true;
        if (elemOffline) {
            elemOffline.classList.add('show');
        }
    }
    
    
    // Show Offline  modal
    this.showOfflineMessageModal = function() {
        thisObj.offlineModal.style.display = 'flex';
    }
    
    
    // NEW: Check and recover token from all storage locations
    this.checkAndRecoverToken = function() {
        console.log('Checking token health...');
        
        // NEW: If we're offline, skip server verification entirely
        if (!navigator.onLine) {
            console.log('Offline mode detected - skipping token verification');
            const token = this.getTokenFromAnyStorage();
            if (token) {
                console.log('Token exists offline - continuing with cached data');
                this.ensureTokenInAllStorages(token);
                return; // Don't try to verify with server
            } else {
                console.log('No token offline - staying on current page');
                return;
            }
        }
        
        // Only run server verification if online
        let token = this.getTokenFromAnyStorage();
        
        if (token) {
            console.log('Token found in storage');
            this.ensureTokenInAllStorages(token);
            
            // Only verify with server if online
            if (navigator.onLine) {
                this.verifyTokenWithServer(token);
            }
        } else {
            console.log('No token found in any storage');
            
            // Only redirect to login if we're online
            if (navigator.onLine && 
                !window.location.pathname.includes('/login')) {
                console.log('No token and online - redirecting to login');
                this.clearAllTokens();
                window.location.href = '/login';
            }
        }
    }
    
    
    // NEW: Get token from any available storage
    this.getTokenFromAnyStorage = function() {
        // Check localStorage first (primary)
        let token = localStorage.getItem('access_token');
        if (token) return token;
        
        // Check sessionStorage
        token = sessionStorage.getItem('access_token');
        if (token) return token;
        
        // Check cookies
        token = this.getCookie('access_token');
        if (token) return token;
        
        // Check window object (in-memory fallback)
        if (window.__auth_token) {
            return window.__auth_token;
        }
        
        return null;
    }
    
    
    // NEW: Ensure token exists in all storage locations
    this.ensureTokenInAllStorages = function(token) {
        if (!token) return;
        
        // Save to localStorage
        if (localStorage.getItem('access_token') !== token) {
            localStorage.setItem('access_token', token);
            console.log('Restored token to localStorage');
        }
        
        // Save to sessionStorage
        if (sessionStorage.getItem('access_token') !== token) {
            sessionStorage.setItem('access_token', token);
            console.log('Restored token to sessionStorage');
        }
        
        // Save to cookie
        const currentCookie = this.getCookie('access_token');
        if (currentCookie !== token) {
            this.setCookieToken(token);
            console.log('Restored token to cookie');
        }
        
        // Save to window object
        window.__auth_token = token;
    }
    
    
    // NEW: Set cookie with proper expiration for PWA
    this.setCookieToken = function(token) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days for PWA
        
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';
        
        let domainFlag = '';
        if (window.location.hostname !== 'localhost') {
            domainFlag = `; domain=${window.location.hostname}`;
        }
        
        document.cookie = `access_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict${secureFlag}${domainFlag}`;
    }
    
    
    // NEW: Get cookie value
    this.getCookie = function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    
    // NEW: Verify token with server
    this.verifyTokenWithServer = async function(token) {
        // Don't try to verify if offline
        if (!navigator.onLine) {
            console.log('Offline - skipping token verification');
            return;
        }
        
        try {
            const response = await fetch('/user/verify_token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });
            
            if (response.status === 401) {
                console.log('Token invalid or expired on server');
                thisObj.clearAllTokens();
                
                if (!window.location.pathname.includes('/login') && navigator.onLine) {
                    window.location.href = '/login';
                }
            } else if (response.ok) {
                console.log('Token verified successfully');
                thisObj.ensureTokenInAllStorages(token);
            }
        } catch (error) {
            console.log('Token verification failed (network error):', error.message);
            // Don't redirect - might be offline
            // Just keep using the token we have
            if (!navigator.onLine) {
                console.log('Network error - assuming offline, keeping token');
            }
        }
    }
    
    
    // NEW: Attempt to refresh token (for PWA)
    this.attemptTokenRefresh = async function() {
        console.log('Attempting to refresh token...');
        
        // Try to get refresh token if you have one
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
            try {
                const response = await fetch('/user/refresh_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.access_token) {
                        console.log('Token refreshed successfully');
                        thisObj.saveAuthTokenExternal(data.access_token);
                        
                        // Reload the page to use new token
                        window.location.reload();
                        return;
                    }
                }
            } catch (error) {
                console.log('Token refresh failed:', error);
            }
        }
        
        // No refresh token or refresh failed, redirect to login
        console.log('Cannot refresh token, redirecting to login');
        thisObj.clearAllTokens();
        
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    }
    
    
    // NEW: Check if running as PWA
    this.isPWA = function() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }
    
    
    // NEW: Clear all tokens from all storage
    this.clearAllTokens = function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        if (window.__auth_token) {
            delete window.__auth_token;
        }
        
        // Notify service worker to clear auth caches
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('clearAuthCache');
        }
        
        console.log('All tokens cleared from all storage');
    }
    
    
    // NEW: Save auth token (to be called from login)
    this.saveAuthTokenExternal = function(token) {
        if (!token) return;
        
        localStorage.setItem('access_token', token);
        sessionStorage.setItem('access_token', token);
        this.setCookieToken(token);
        window.__auth_token = token;
        
        console.log('Auth token saved to all storage locations');
        console.log('PWA mode:', this.isPWA());
    }
    
    
    /**
     * Will check connection test; To use:
     * 
     * // Usage
     * navigation.managerSystem.connectionTest((status) => {
     *     if (!status.hasInternet) {
     *         console.log('No internet - 0 bytes transferred');
     *         showNoInternetMessage();
     *     } else if (!status.serverReachable) {
     *         console.log('Server down - 0 bytes transferred');
     *         showServerDownMessage();
     *     } else {
     *         console.log('Both working - 0 bytes transferred');
     *         proceedWithRequest();
     *     }
     * });
     * 
     * */
    this.connectionTest = function(callback) {
        const testResults = {
            hasInternet: false,
            serverReachable: false,
            bytesTransferred: 0,
            timestamp: Date.now()
        };
        
        let testsCompleted = 0;
        let timeoutOccurred = false;
        
        // Use Promise.race for faster offline detection
        const quickOnlineCheck = async () => {
            // Use navigator.onLine first (instant)
            if (!navigator.onLine) {
                console.log('Connection test: navigator says offline');
                testResults.hasInternet = false;
                testResults.serverReachable = false;
                callback(testResults);
                return true; // Short-circuit
            }
            
            // Try a simple HEAD to same origin (fastest)
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 sec timeout
                
                const response = await fetch('/favicon.ico?t=' + Date.now(), {
                    method: 'HEAD',
                    cache: 'no-store',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok || response.status === 405) { // 405 is fine for HEAD
                    testResults.hasInternet = true;
                    testResults.serverReachable = true;
                    callback(testResults);
                    return true;
                }
            } catch (e) {
                console.log('Quick connection test failed:', e.message);
            }
            
            return false; // Need fallback test
        };
        
        // Run quick test first
        quickOnlineCheck().then((completed) => {
            if (completed) return;
            
            // Fallback to dual test with shorter timeouts
            // Test 1: Check internet (Google DNS - very reliable)
            fetch('https://dns.google/resolve?name=google.com&type=A', {
                method: 'GET',
                cache: 'no-store',
                headers: { 'Accept': 'application/json' }
            })
            .then(() => {
                testResults.hasInternet = true;
                console.log('Internet: reachable');
            })
            .catch(() => {
                testResults.hasInternet = false;
                console.log('Internet: NOT reachable');
            })
            .finally(() => {
                testsCompleted++;
                if (testsCompleted === 2 && !timeoutOccurred) {
                    callback(testResults);
                }
            });
            
            // Test 2: Check server (with shorter timeout)
            const serverController = new AbortController();
            const serverTimeout = setTimeout(() => serverController.abort(), 2000);
            
            fetch(`${window.location.origin}/favicon.ico?t=${Date.now()}`, {
                method: 'HEAD',
                cache: 'no-store',
                signal: serverController.signal
            })
            .then(() => {
                testResults.serverReachable = true;
                testResults.hasInternet = true; // If server reachable, internet exists
                console.log('Server: reachable');
                clearTimeout(serverTimeout);
            })
            .catch((error) => {
                testResults.serverReachable = false;
                console.log('Server: NOT reachable -', error.message);
            })
            .finally(() => {
                testsCompleted++;
                if (testsCompleted === 2 && !timeoutOccurred) {
                    callback(testResults);
                }
            });
        });
    };
        
    
    this.requestSystemStats = function(callback_success, 
            elem_show_error){
        
      
        const base_url = window.location.origin;
        const url = `${base_url}/system/stats`;
        
        
        const bearer_token = this.getTokenFromAnyStorage(); // Use recovery method
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
    
    
    this.requestLatestUsers = function(callback_success, 
            elem_show_error){
        
      
        const base_url = window.location.origin;
        const url = `${base_url}/system/latest_users`;
        
        
        const bearer_token = this.getTokenFromAnyStorage(); // Use recovery method
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
    
    
    // Add visual debug method (remove after testing)
    this.visualDebug = function(message, isError = false) {
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 10px;
            right: 10px;
            background: ${isError ? 'red' : 'green'};
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 99999;
            font-size: 12px;
            text-align: center;
            font-family: monospace;
        `;
        debugDiv.textContent = message;
        document.body.appendChild(debugDiv);
        setTimeout(() => debugDiv.remove(), 3000);
    }
    
}
