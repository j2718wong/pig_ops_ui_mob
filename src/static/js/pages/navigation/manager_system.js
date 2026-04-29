// April 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID}            from '../../constants.js';


export function ManagerSystem(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    let elemNoConnection            = null;
    
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        
         
        elemNoConnection                = document.getElementById('container-no-connection');
        
        
    }
    
    
    
    this._processAfterHtmlRender = function(){}
    
    this._bindEventListeners = function(){}

    
    this.hideMsgNoConnection = function(){
        elemNoConnection.style.display = 'none';
    }
    
    
    this.showMsgNoConnection = function(){
        elemNoConnection.style.display = 'block';
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



