// manager_pwa.js

// May 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        FLAG_BITS,
        DEFAULT_WEEKDAY,
        PAGE_ID}            from '../../constants.js';
;


        
// Do not rename this; as there is a global function isIOS in pwa-handler.js
function checkIfIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}


function isAppInstalled() {
    // For Chrome, Edge, Samsung Internet (modern Android)
    const isStandalone      = window.matchMedia('(display-mode: standalone)').matches;
    
    // For iOS Safari
    const isIOSStandalone   = window.navigator.standalone === true;
    
    return isStandalone || isIOSStandalone;
}


function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}



/* PWA events tracking
Event	                When to Track	                Why
pwa_ready	            beforeinstallprompt fires	    Install is possible
pwa_button_shown	    Your install button becomes     visible	User saw the option
pwa_install_clicked	    User clicks install button	    User wants to install
pwa_install_accepted	User accepts native prompt	    Installation started
pwa_install_dismissed	User dismisses native prompt	User declined
pwa_installed	        appinstalled event fires	    

*/


const PWA_EVENT ={
    READY:                      "PWA_READY",
    INSTALL_BTN_SHOWN:          "PWA_BTN_SHOWN",
    INSTALL_CLICKED:            "PWA_INSTALL_CLICKED",
    INSTALL_ACCEPTED:           "PWA_INSTALL_ACCEPTED",
    INSTALL_DISMISSED:          "PWA_INSTALL_DISMISSED",
    INSTALLED:                  "PWA_INSTALLED",
    
    IOS_INSTRUCTIONS_SHOWN:     "PWA_IOS_INSTRUCTIONS_SHOWN",
    ANDROID_INSTRUCTIONS_SHOWN: "PWA_ANDROID_INSTRUCTIONS_SHOWN",
    
    PWA_IOS_INSTRUCTIONS_DISMISSED:     "PWA_IOS_INSTRUCTIONS_DISMISSED",
    PWA_ANDROID_INSTRUCTIONS_DISMISSED: "PWA_ANDROID_INSTRUCTIONS_DISMISSED"
    
}; 


const MIN_DAYS_SINCE_PWA_INSTALL_DISMISSED  = 3;


export function ManagerPwa(input_settings){
    
    const TAG                   = 'ManagerPwa';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    const elemDivContainer      = input_settings.elemDivContainer
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              parentObj,
        elemIdDivContainer:     elemIdContUserDisabled
    };
    */
    const settings              = input_settings;
    

    
    let elemInstallBtn          = null;
    let elemInstallBannerBtn    = null;
    
    let elemServerErrorMsg      = null;
    
    
    // PWA Installation
    let deferredPrompt;
    
    
    this.init = function(){

    }
    
    
    this.getHtml = function(){
        
        const html = `
        <button id="install-superpig-btn" hidden style="
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 320px;
            background: var(--gestating-color);
            color: white;
            border: none;
            border-radius: 60px;
            padding: 16px 20px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            cursor: pointer;
            letter-spacing: 0.5px;
        ">
            📱 Install SuperPig App
        </button>
        
        <div id="pwa-install-banner" style="
            display:none; 
            position: fixed; 
            bottom: 20px; 
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 40px);  /* 20px margin on each side */
            max-width: 400px;          /* Maximum width for tablets */ 
            background: var(--gestating-color); 
            color: white; 
            padding: 16px; 
            border-radius: 12px; 
            z-index: 9999; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <strong>📱 Open App</strong>
                </div>
                <button id="pwa-install-now-btn" style="background: white; color: #1e3a8a; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">Install</button>
                <button id="pwa-install-dismiss" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
            </div>
        </div>

        `;
        
        return html;

    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemInstallBtn          = elemDivContainer.querySelector('#install-superpig-btn'); 
        
        elemInstallBannerBtn    = document.getElementById('pwa-install-now-btn');
        
        elemServerErrorMsg      = parentObj.elemServerErrorMsg;

    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        const isIOSDevice   = checkIfIOSDevice();
        const isInstalled   = isAppInstalled();
        
        // Check if PWA was already ready before login
        if (localStorage.getItem('pwa_ready') === 'true' && window.deferredPrompt) {
            console.log('PWA: using saved event from before login');
            deferredPrompt = window.deferredPrompt;
            if (elemInstallBtn && !isInstalled) {
                elemInstallBtn.hidden = false;
            }
            localStorage.removeItem('pwa_ready');
        }
        
        
        // iOS specific handling
        if (isIOSDevice && !isInstalled) {
            window.addEventListener('pwa-ios-ready', function (){
                console.log('PWA: iOS ready - showing instructions');
                if (elemInstallBtn) {
                    elemInstallBtn.hidden = false;
                    elemInstallBtn.textContent = '📱 Add to Home Screen';
                    elemInstallBtn.style.background = '#007aff'; // iOS blue
                }
            });
            
            // Trigger iOS detection if not already triggered
            if (localStorage.getItem('pwa_ready_ios') === 'true') {
                window.dispatchEvent(new CustomEvent('pwa-ios-ready'));
            }
        }
        
        
        // Listen for custom pwa-ready event (if PWA becomes ready after login)
        window.addEventListener('pwa-ready', function(e) {
            console.log('PWA: ready event received');
            deferredPrompt = e.detail;
            if (elemInstallBtn) {
                elemInstallBtn.hidden = false;
            }
        });

            
        
        // Remove existing listener to prevent duplicates
        if (elemInstallBtn) {
            elemInstallBtn.removeEventListener('click', this._onInstallClick);
            elemInstallBtn.addEventListener('click', this._onInstallClick);
        }
        
        
        
        window.addEventListener('appinstalled', function(){
            console.log('SuperPig was installed');
            
            // Show success modal
            thisObj.showInstallSuccessModal();
            
            const data_pwa_track = {
                event:          PWA_EVENT.INSTALLED
            };

            thisObj.addUserTrackAppInstall(data_pwa_track);
            
            
            
            // Hide the install button permanently
            if (elemInstallBtn) {
                elemInstallBtn.style.display = 'none';
            }
        });



        // If already installed, hide button
        if (isAppInstalled()) {
            elemInstallBtn.hidden = true;
        }
        
        
        if (elemInstallBannerBtn) {
            elemInstallBannerBtn.addEventListener('click', function(){
                thisObj.initiateInstall();
            });
        }

    }
    
    
    // Define click handler as named function
    this._onInstallClick = async function(){
        const isIOSDevice   = checkIfIOSDevice();
        
        if (isIOSDevice) {
            // Show iOS instructions modal
            thisObj.showIOSInstallInstructions();
            
            // Track that user saw iOS instructions
            const data_pwa_track = {
                event: PWA_EVENT.IOS_INSTRUCTIONS_SHOWN,
                screen_width: window.innerWidth,
                screen_height: window.innerHeight
            };
            thisObj.addUserTrackAppInstall(data_pwa_track);
            return;
        }
        
        
        
        const prompt = deferredPrompt || window.deferredPrompt;
        if (!prompt) {
            // Show Android manual installation instructions
            thisObj.showAndroidInstallInstructions();
            return;
        }
        prompt.prompt();
        
        
        let data_pwa_track = {
            event:          PWA_EVENT.INSTALL_CLICKED,
            screen_width:   window.innerWidth,
            screen_height:  window.innerHeight

        };

        thisObj.addUserTrackAppInstall(data_pwa_track);
        
        
        // Wait for user response
        const { outcome } = await prompt.userChoice;
        console.log(`User install choice: ${outcome}`);
        
        // Track the outcome
        const eventType = outcome === 'accepted' ? PWA_EVENT.INSTALL_ACCEPTED : PWA_EVENT.INSTALL_DISMISSED;
        data_pwa_track = {
            event:          eventType,
            screen_width:   window.innerWidth,
            screen_height:  window.innerHeight
        };
        thisObj.addUserTrackAppInstall(data_pwa_track);
                
        
        // Reset the deferred prompt variable (can only be used once)
        deferredPrompt = null;
        
        // Hide the install button
        elemInstallBtn.hidden = true;
        
        
        // If eventType PWA_EVENT.INSTALL_DISMISSED, save to local storage
        localStorage.setItem('pwa_dismissed_date', Date.now().toString());
        
    }
    
    

    this.showPwaInstallButton = function(){
        // DON'T SHOW ON DESKTOP
        if (!isMobileDevice()) {
            console.log('PWA: Desktop device - hiding install banner');
            return;
        }
        
        // Show PWA install button
        if (!isAppInstalled()) {
            setTimeout(function() {
                const promptToUse = deferredPrompt || window.deferredPrompt;
                if (promptToUse) {
                    elemInstallBtn.hidden = false;
                    
                    const data_pwa_track = {
                        event: PWA_EVENT.INSTALL_BTN_SHOWN,
                        screen_width: window.innerWidth,
                        screen_height: window.innerHeight
                    };
                    thisObj.addUserTrackAppInstall(data_pwa_track);
                }
            }, 500);
        }
        
    }


    this.showIOSInstallInstructions = function() {
        // Check if modal already exists
        if (document.getElementById('ios-instructions-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'ios-instructions-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 20px; max-width: 320px; width: 85%; padding: 24px; text-align: center;">
                    <div style="font-size: 48px;">📱</div>
                    <h3 style="margin: 12px 0 8px; color: #1e3a8a;">Add to Home Screen</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px; text-align: left;">
                        To install SuperPig on your iPhone:
                    </p>
                    <ol style="text-align: left; color: #666; font-size: 14px; margin-bottom: 20px; padding-left: 20px;">
                        <li>Tap the Share button <span style="font-size: 18px;">📤</span> at the bottom of Safari</li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                        <li>Tap <strong>"Add"</strong> in the top right corner</li>
                    </ol>
                    <img src="/static_m/images/ios-add-to-home.png" style="max-width: 200px; margin: 10px 0; border-radius: 12px;" onerror="this.style.display='none'">
                    <button id="close-ios-modal" style="background: #1e3a8a; color: white; border: none; padding: 10px 24px; border-radius: 30px; font-size: 16px; margin-top: 10px;">Got it</button>
                </div>
            </div>
        `;
        
       
        document.body.appendChild(modal);
        
        document.getElementById('close-ios-modal').onclick = function(){
            modal.remove();
            
            // Track modal dismissal
            const data_pwa_track = {
                event: 'PWA_IOS_INSTRUCTIONS_DISMISSED',
                screen_width: window.innerWidth,
                screen_height: window.innerHeight
            };
            thisObj.addUserTrackAppInstall(data_pwa_track);
        };
        
        
        // Track that modal was shown
        if (window.SUPERPIG_LOGGED_IN === true) {
            // Dispatch event for tracking
            window.dispatchEvent(new CustomEvent('pwa-ios-modal-shown'));
        }
        
        
    }


    this.showAndroidInstallInstructions = function() {
        // Check if modal already exists
        if (document.getElementById('android-instructions-modal')) return;
        
        // Detect browser for specific instructions
        const ua = navigator.userAgent;
        const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
        const isSamsung = /SamsungBrowser/.test(ua);
        const isFirefox = /Firefox/.test(ua);
        const isEdge = /Edg/.test(ua);
        
        let browserName = 'Chrome';
        let browserSteps = '';
        
        if (isChrome) {
            browserName = 'Chrome';
            browserSteps = `
                <li>Tap the <strong>⋮</strong> (three dots) menu in the top right corner</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></li>
                <li>Tap <strong>"Install"</strong> to confirm</li>
            `;
        } else if (isSamsung) {
            browserName = 'Samsung Internet';
            browserSteps = `
                <li>Tap the <strong>☰</strong> (hamburger menu) at the bottom</li>
                <li>Tap <strong>"Add to Home screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to confirm</li>
            `;
        } else if (isFirefox) {
            browserName = 'Firefox';
            browserSteps = `
                <li>Tap the <strong>⋮</strong> (three dots) menu</li>
                <li>Tap <strong>"Install"</strong> or <strong>"Add to Home screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to confirm</li>
            `;
        } else if (isEdge) {
            browserName = 'Edge';
            browserSteps = `
                <li>Tap the <strong>⋮</strong> (three dots) menu at the bottom</li>
                <li>Tap <strong>"Add to Home screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to confirm</li>
            `;
        } else {
            // Generic Android instructions
            browserSteps = `
                <li>Tap the browser menu button (usually ⋮ or ☰)</li>
                <li>Look for <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></li>
                <li>Tap <strong>"Install"</strong> or <strong>"Add"</strong> to confirm</li>
            `;
        }
        
        const modal = document.createElement('div');
        modal.id = 'android-instructions-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 20px; max-width: 350px; width: 90%; padding: 24px; text-align: center; max-height: 90%; overflow-y: auto;">
                    <div style="font-size: 48px;">📱</div>
                    <h3 style="margin: 12px 0 8px; color: #1e3a8a;">Install SuperPig App</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px; text-align: left;">
                        You can install SuperPig as a standalone app on your Android device:
                    </p>
                    <ol style="text-align: left; color: #666; font-size: 14px; margin-bottom: 20px; padding-left: 20px;">
                        ${browserSteps}
                    </ol>
                    
                    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px; margin: 16px 0; text-align: left; border-radius: 8px;">
                        <strong style="color: #166534;">✨ Benefits of installing:</strong>
                        <ul style="margin: 8px 0 0 20px; color: #14532d;">
                            <li>Launch from home screen like a native app</li>
                            <li>No browser address bar - full screen experience</li>
                            <li>Faster access to SuperPig</li>
                            <li>Works offline (cached content)</li>
                        </ul>
                    </div>
                    
                    <button id="close-android-modal" style="background: #1e3a8a; color: white; border: none; padding: 12px 28px; border-radius: 30px; font-size: 16px; margin-top: 10px; cursor: pointer;">
                        Got it
                    </button>
                </div>
            </div>
        `;
        
            
        document.body.appendChild(modal);
        
        
        document.getElementById('close-android-modal').onclick = function(){
            modal.remove();
            
            // Track modal dismissal
            const data_pwa_track = {
                event: 'PWA_ANDROID_INSTRUCTIONS_DISMISSED',
                screen_width: window.innerWidth,
                screen_height: window.innerHeight
            };
            thisObj.addUserTrackAppInstall(data_pwa_track);
        };
        
        
        // Track that Android instructions were shown
        const data_pwa_track = {
            event: PWA_EVENT.ANDROID_INSTRUCTIONS_SHOWN,
            screen_width: window.innerWidth,
            screen_height: window.innerHeight
        };
        thisObj.addUserTrackAppInstall(data_pwa_track);
        
        
        // Close when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };



    this.showInstallSuccessModal = function() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 20px; max-width: 300px; width: 85%; padding: 24px; text-align: center;">
                    <div style="font-size: 48px;">🎉</div>
                    <h3 style="margin: 12px 0 8px; color: #1e3a8a;">SuperPig Installed!</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                        SuperPig has been added to your home screen.
                    </p>
                    <button id="close-install-modal" style="background: #1e3a8a; color: white; border: none; padding: 10px 24px; border-radius: 30px; font-size: 16px;">Got it</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('close-install-modal').onclick = function(){ 
            modal.remove();
        }
    }


    // Check if user has dismissed PWA installation in the past
    this.hasUserDismissedPWA = function() {
        const dismissed = localStorage.getItem('pwa_dismissed_permanently');
        //if (dismissed === 'true') return true; // this is dsiabled until decided what to do
        
        // Check if dismissed within last 7 days (for re-engagement)
        const dismissedDate = localStorage.getItem('pwa_dismissed_date');
        if (dismissedDate) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < MIN_DAYS_SINCE_PWA_INSTALL_DISMISSED) return true;
        }
        return false;
    }
    

    
    // Show persistent install banner in dashboard
    this.showDashboardInstallBanner = function() {
        // DON'T SHOW ON DESKTOP
        if (!isMobileDevice()) {
            console.log('PWA: Desktop device - hiding install banner');
            return;
        }
        
        // Don't show if already installed
        if (isAppInstalled()) return;
        
        // Don't show if user permanently dismissed
        if (this.hasUserDismissedPWA()) return;
        
        
        // Don't show banner if floating button is already visible
        if (elemInstallBtn && !elemInstallBtn.hidden) {
            console.log('PWA: Install button already showing - banner will not show');
            return;
        }
        
        // Don't show banner if native prompt is available
        // The floating button will handle it instead
        const prompt = deferredPrompt || window.deferredPrompt;
        if (prompt) {
            console.log('PWA: Native prompt available - banner will not show');
            return;
        }
        
        const banner = document.getElementById('pwa-install-banner');
        if (!banner) return;
        
        // Show the banner
        banner.style.display = 'block';
        
        // Track banner shown
        const data_pwa_track = {
            event: 'PWA_BANNER_SHOWN',
            screen_width: window.innerWidth,
            screen_height: window.innerHeight
        };
        thisObj.addUserTrackAppInstall(data_pwa_track);
    }
        
        
    // Handle install from dashboard banner
    this.initiateInstall = async function() {
        const prompt = deferredPrompt || window.deferredPrompt;
        
        if (prompt) {
            // Use native prompt if available
            prompt.prompt();
            const { outcome } = await prompt.userChoice;
            
            if (outcome === 'accepted') {
                thisObj.addUserTrackAppInstall({ event: PWA_EVENT.INSTALL_ACCEPTED });
                const banner = document.getElementById('pwa-install-banner');
                if (banner) banner.style.display = 'none';
            } else {
                thisObj.addUserTrackAppInstall({ event: PWA_EVENT.INSTALL_DISMISSED });
                // User dismissed - don't show banner again for 7 days
                localStorage.setItem('pwa_dismissed_date', Date.now().toString());
                const banner = document.getElementById('pwa-install-banner');
                if (banner) banner.style.display = 'none';
            }
            deferredPrompt = null;
        } else {
            // No deferredPrompt - show manual instructions
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS) {
                thisObj.showIOSInstallInstructions();
            } else {
                thisObj.showAndroidInstallInstructions();
            }
        }
    }
        

    this.addUserTrackAppInstall = function(data, callback_success){
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'event':            data.event
        };
        
        
        if (data.screen_width){
            post_data.screen_width = data.screen_width;
        }
        
        if (data.screen_height){
            post_data.screen_height = data.screen_height;
        }
        
        
        let url = `${base_url}/user/track_app_install`;

        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (callback_success){
                        callback_success();
                    }
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    
        
        
}
