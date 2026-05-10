// May 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}              from '../common/page_view_basic.js';


import {APPLICATION,
        FLAG_BITS,
        ACC_USER_GROUP,
        PAGE_ID}                    from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE}    from '../../utils.js';


import {addValidationClassToElem}   from '../common/ui/ui_utils.js';




export function PageUserSettings(input_settings){
    PageViewBasic.call(this);
    
    const TAG                   = 'PageUserSettings';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    

      
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    let elemIdEnableNotifications = null;
    let elemIdNotificationStatus  = null;  
    
    let elemIdServerErrorMsg    = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemEnableNotifications = null;
    let elemNotificationStatus  = null;  
    
    let elemServerErrorMsg      = null;
    
    
    
    
    let showOptions             = null;
    
    
    let accountInfo             = null;
    

    this.existingSubscription   = null;
    
    
    this.init = function(){
        
       
        
        this.render();
        this.afterHtmlRender();
        

    }
    
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
            .notification-status {
                margin-top: 0.5rem;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.85rem;
            }
            .notification-status.success {
                background: #d4edda;
                color: #155724;
            }
            .notification-status.error {
                background: #f8d7da;
                color: #721c24;
            }
            .notification-status.info {
                background: #d1ecf1;
                color: #0c5460;
            }
            .notification-status.warning {
                background: #fff3cd;
                color: #856404;
            }
            .btn-primary {
                background: #2e7d64;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }
            .btn-primary.disabled {
                background: #6c757d;
                cursor: not-allowed;
            }
            .settings-card {
                padding: 0.5rem 0;
            }
            .settings-content h3 {
                margin: 0 0 0.25rem 0;
                font-size: 1rem;
            }
            .settings-content p {
                margin: 0 0 0.75rem 0;
                font-size: 0.85rem;
                color: #666;
            }
            
        </style>
        `;
        return html;
        
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle           = `${settings.uniqueKey}-title`;
        elemIdBtnClose              = `${settings.uniqueKey}-close`;
        
        
        elemIdEnableNotifications   = `${settings.uniqueKey}-enable-notifications`;
        elemIdNotificationStatus    = `${settings.uniqueKey}-notification-status`;
        
        elemIdServerErrorMsg        = `${settings.uniqueKey}-server-error-msg`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        
        const html =`

${html_style}
        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}">Settings</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <!-- Notifications Section -->
        <div class="settings-card" id="">
            <div class="settings-content">
                <h3>Notifications</h3>
                <p>Get alerts for new bills, payment verification, and important farm updates.</p>
                <button id="${elemIdEnableNotifications}" class="btn-primary">
                    Enable Notifications
                </button>
                <div id="${elemIdNotificationStatus}" class="notification-status"></div>
            </div>
        </div>
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        
    </div>
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        
        elemEnableNotifications = elemDivContainer.querySelector('#'+elemIdEnableNotifications);
        elemNotificationStatus  = elemDivContainer.querySelector('#'+elemIdNotificationStatus);

        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);

    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        elemEnableNotifications.addEventListener('click', function(event){
            thisObj.requestNotificationPermission();
        });

    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.options);
    }
    
    
    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options: options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        thisObj._resetForm();
        
        
        if (options) {
            showOptions = options;
        }
        
        
        // Attach Listener to Close button
        elemBtnClose.onclick = function(){
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        
        const callback_success = function(data){
            console.log('user subscription list')
            console.log(data)
            
            thisObj.existingSubscription = data;
            
            thisObj.populateForm();
        };
        
        
        // Request  User PushSubscriptionList
        thisObj.requestPushSubscriptionList(callback_success, elemServerErrorMsg);


        
       
    }
    
    
    
    /**
     * Check if the current browser/device already has an active push subscription
     */
    this.checkLocalPushSubscription = async function() {
        // Check if service worker is available
        if (!('serviceWorker' in navigator)) {
            this.showNotificationStatus('Push notifications not supported', 'error');
            return;
        }
        
        // Get the service worker registration
        const registration = await navigator.serviceWorker.ready;
        
        // Check if already subscribed
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
            // Already subscribed on this device
            const endpoint = subscription.endpoint;
            
            // Check if this subscription exists in our server records
            // We'll verify during populateForm()
            console.log('Existing push subscription found on this device:', endpoint);
            this.showNotificationStatus('Notifications are already enabled on this device', 'success');
            
            // Update button to show "Enabled" state
            if (elemEnableNotifications) {
                elemEnableNotifications.textContent = 'Notifications Enabled';
                elemEnableNotifications.disabled = true;
                elemEnableNotifications.classList.add('disabled');
            }
            
            return subscription;
        } else {
            console.log('No push subscription found on this device');
            // Button remains active for enabling
            return null;
        }
    }
    
    
    this.populateForm = function(){
        // Check if the current device subscription exists in server records
        this.checkSubscriptionMatchesServer();
        
    }
    
    
     /**
     * Verify that the current device's subscription matches what's in the server
     */
    this.checkSubscriptionMatchesServer = async function() {
        const registration = await navigator.serviceWorker.ready;
        const currentSubscription = await registration.pushManager.getSubscription();
        
        if (!currentSubscription) {
            // No local subscription, enable the button
            if (elemEnableNotifications) {
                elemEnableNotifications.disabled = false;
                elemEnableNotifications.textContent = 'Enable Notifications';
            }
            return;
        }
        
        console.log('thisObj.existingSubscription');
        console.log(thisObj.existingSubscription);
        
        console.log('currentSubscription.endpoint');
        console.log(currentSubscription.endpoint);
        
        // Check if this subscription endpoint exists in server data
        let found = false;
        if (thisObj.existingSubscription && thisObj.existingSubscription.length > 0) {
            for (const cur_entry of thisObj.existingSubscription) {
                if (cur_entry.push_subscription.endpoint === currentSubscription.endpoint) {
                    found = true;
                    break;
                }
            }
        }
        
        if (found) {
            // Subscription exists on server, disable button
            if (elemEnableNotifications) {
                elemEnableNotifications.textContent = 'Notifications Enabled';
                elemEnableNotifications.disabled = true;
                elemEnableNotifications.classList.add('disabled');
            }
            this.showNotificationStatus('Notifications are active on this device', 'success');
        } else {
            // Local subscription exists but not on server (edge case)
            // Maybe server was reset, allow re-subscription
            if (elemEnableNotifications) {
                elemEnableNotifications.disabled = false;
                elemEnableNotifications.textContent = 'Enable Notifications';
            }
            this.showNotificationStatus('Local subscription found, but needs re-registration', 'info');
        }
    }
    
    
    
    this.requestNotificationPermission = async function() {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            this.showNotificationStatus('Notifications not supported in this browser', 'error');
            return;
        }
        
        // Check current permission state
        if (Notification.permission === 'granted') {
            this.showNotificationStatus('Notification permission already granted', 'success');
            // Proceed to subscribe to push
            await this.subscribeToPush();
            return;
        }
        
        if (Notification.permission === 'denied') {
            this.showNotificationStatus('Notifications blocked. Please enable in browser settings.', 'error');
            return;
        }
        
        // Request permission (this shows the browser's native prompt)
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.showNotificationStatus('Notification permission granted!', 'success');
                // Now subscribe to push notifications
                await this.subscribeToPush();
            } else {
                this.showNotificationStatus('Notification permission denied', 'info');
            }
        } catch (err) {
            console.error('Error requesting permission:', err);
            this.showNotificationStatus('Error requesting permission', 'error');
        }
    }

    
    /**
     * Subscribe to push notifications and send subscription to server
     */
    this.subscribeToPush = async function() {
        try {
            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;
            
            // Get the public VAPID key from server (you need to expose it)
            // For now, we'll assume you have a PUBLIC_VAPID_KEY constant
            // This should be loaded from server or environment
            
            console.log('window.PUBLIC_VAPID_KEY = ' + window.PUBLIC_VAPID_KEY);
            
            // Subscribe the user
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(window.PUBLIC_VAPID_KEY)
            });
            
            console.log('Push subscription created:', subscription);
            
            // Send subscription to server
            const subscriptionData = {
                subs_endpoint: subscription.endpoint,
                subs_keys_p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                subs_keys_auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
                device_name: this.getDeviceName(),
                browser_name: this.getBrowserName(),
                os_name: this.getOSName()
            };
            
            this.onSavePushSubscription(subscriptionData);
            
        } catch (err) {
            console.error('Failed to subscribe to push:', err);
            this.showNotificationStatus('Failed to enable push notifications', 'error');
        }
    }


    /**
     * Convert base64 string to Uint8Array for VAPID key
     */
    this.urlBase64ToUint8Array = function(base64String) {
        // 1. Restore the standard base64 alphabet (replace URL-safe characters)
        const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
        
        // 2. Add standard padding ('=') to make the string length a multiple of 4
        //    This is CRUCIAL for the browser to decode it correctly.
        const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        
        // 3. Decode the base64 string to a binary string
        const rawData = window.atob(paddedBase64);
        
        // 4. Convert the binary string to a Uint8Array
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    
    /**
     * Get device name from user agent
     */
    this.getDeviceName = function() {
        const ua = navigator.userAgent;
        if (/(iPhone|iPad|iPod)/.test(ua)) return 'Apple iOS Device';
        if (/Android/.test(ua)) return 'Android Device';
        if (/Windows/.test(ua)) return 'Windows PC';
        if (/Mac/.test(ua)) return 'Mac';
        return 'Unknown Device';
    }
    
    
    /**
     * Get browser name from user agent
     */
    this.getBrowserName = function() {
        const ua = navigator.userAgent;
        if (/Chrome/.test(ua) && !/Edge/.test(ua)) return 'Chrome';
        if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
        if (/Firefox/.test(ua)) return 'Firefox';
        if (/Edge/.test(ua)) return 'Edge';
        return 'Unknown Browser';
    }
    
    
    /**
     * Get OS name from user agent
     */
    this.getOSName = function() {
        const ua = navigator.userAgent;
        if (/Windows/.test(ua)) return 'Windows';
        if (/Mac OS/.test(ua)) return 'macOS';
        if (/Android/.test(ua)) return 'Android';
        if (/iOS|iPhone|iPad/.test(ua)) return 'iOS';
        if (/Linux/.test(ua)) return 'Linux';
        return 'Unknown OS';
    }


    this.showNotificationStatus = function(message, type) {
        if (!elemNotificationStatus) return;
        
        elemNotificationStatus.textContent = message;
        elemNotificationStatus.className = `notification-status ${type}`;
        
        /*
        // Clear after 5 seconds
        setTimeout(() => {
            if (elemNotificationStatus) {
                elemNotificationStatus.textContent = '';
                elemNotificationStatus.className = 'notification-status';
            }
        }, 5000);
        * 
        */
    }
    
    
    
    this.requestPushSubscriptionList = function(callback_success, 
            elem_show_error){
        
        
        const base_url = window.location.origin;
        const url = `${base_url}/user/push_susbcription/list`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
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
    
    
    
    this.onSavePushSubscription = function(data){
        /**
         Typical data
         data = {
            subs_endpoint:      null,
            subs_keys_p256dh:   null
            subs_keys_auth:     null
            
            device_name:        null
            browser_name:       null
            os_name:            null
            
        };
         
         */
        
        const user_hid      = navigation.userControl.getUserHid();
        
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = data;
        
        
        let url = `${base_url}/user/push_susbcription_add`
        
        
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
                    thisObj.onSuccessAddPushSubscription(response);
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    
    this.onSuccessAddPushSubscription = function(response){
        if (response && response.push_susbcription && response.push_susbcription.hid) {
            this.showNotificationStatus('Push notifications enabled successfully!', 'success');
            
            // Update button state
            if (elemEnableNotifications) {
                elemEnableNotifications.textContent = 'Notifications Enabled';
                elemEnableNotifications.disabled = true;
                elemEnableNotifications.classList.add('disabled');
            }
            
            // Refresh subscription list
            const callback_refresh = function(data){
                console.log('Updated subscription list:', data);
            };
            this.requestPushSubscriptionList(callback_refresh, elemServerErrorMsg);
        }
    
    }
    
}   
