// manager_system.js

// April 19, 2026
// Jack Wong
// j2718wong@gmail.com

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
        this.offlineModal = this.initOfflineModal();
    }
    
    
    this._bindEventListeners = function(){
        window.addEventListener('online', function(){
            console.log('Connection restored');
            thisObj.hideMsgOffline();
            
            thisObj.isOffLine = false;
        });
        
        window.addEventListener('offline', function(){
            console.log('Connection lost');
            thisObj.showMsgOffline();
            
            thisObj.isOffLine = true;
        });
        
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
                    <button id="offline-modal-close" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                
                <div class="modal-body">
                    <p id="offline-modal-message" style="font-size: 1rem; margin-bottom: 16px;">
                        This page needs Internet.
                    </p>
                    
                    <p style="color: #666; font-size: 0.9rem;">
                        Your farm data: sows, production, farrowing are still available offline.
                    </p>
                </div>
                
                <div class="modal-footer">
                    <button id="offline-modal-retry" class="btn-modal" style="background: #1e3a8a; color: white;">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
                    <button id="offline-modal-dashboard" class="btn-modal btn-secondary">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        document.getElementById('offline-modal-close').onclick = () => {
            modal.style.display = 'none';
        };
        
        // Retry button
        document.getElementById('offline-modal-retry').onclick = () => {
            if (navigator.onLine) {
                modal.style.display = 'none';
                location.reload();
            } else {
                alert('Still offline. Please check your connection.');
            }
        };
        
        // Dashboard button
        document.getElementById('offline-modal-dashboard').onclick = () => {
            modal.style.display = 'none';
            if (window.navigation && window.navigation.showHomeDashBoard) {
                window.navigation.showHomeDashBoard();
            }
        };
        
        // Close when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        this.offlineModal = modal;
    }
    
    
    // Hides Offline  banner below the page
    this.hideMsgOffline = function(){
        thisObj.isOffLine = false;
        elemOffline.classList.remove('show');
    }
    
    
    // Show Offline  banner below the page
    this.showMsgOffline = function(){
        thisObj.isOffLine = true;
        elemOffline.classList.add('show');
    }
    
    
    // Show Offline  modal
    this.showOfflineMessageModal = function(pageTitle) {
        if (!this.offlineModal) this.initOfflineModal();
        
        this.offlineModal.style.display = 'flex';
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
        
        // Test 1: HEAD request to reliable CDN (tests internet connectivity)
        fetch('https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js', {
            method: 'HEAD',
            cache: 'no-store',
            timeout: 3000
        })
        .then(() => {
            testResults.hasInternet = true;
            console.log('Check Internet connection: HEAD request successful - 0 bytes');
        })
        .catch(() => {
            testResults.hasInternet = false;
            console.log('Check Internet connection: HEAD request failed');
        })
        .finally(() => {
            testsCompleted++;
            if (testsCompleted === 2) callback(testResults);
        });
        
        // Test 2: HEAD request to favicon.ico (tests if server is reachable)
        fetch(`${window.location.origin}/favicon.ico?t=${Date.now()}`, {
            method: 'GET',
            cache: 'no-store',
            timeout: 3000
        })
        .then(() => {
            testResults.serverReachable = true;
            console.log('Check Server Connection: favicon.ico GET request successful');
        })
        .catch((error) => {
            testResults.serverReachable = false;
            console.log('Check Server Connection: favicon.ico GET request failed -', error.message);
        })
        .finally(() => {
            testsCompleted++;
            if (testsCompleted === 2) callback(testResults);
        });
    };
    
    
    this.requestSystemStats = function(callback_success, 
            elem_show_error){
        
      
        const base_url = window.location.origin;
        const url = `${base_url}/system/stats`;
        
        
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
    
    
    this.requestLatestUsers = function(callback_success, 
            elem_show_error){
        
      
        const base_url = window.location.origin;
        const url = `${base_url}/system/latest_users`;
        
        
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
    
    
}



