// February 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



import {APPLICATION,
        PAGE_ID}                from '../../constants.js';


import {TableLatestUsers}       from './table_latest_users.js';


export function PageSystemStats(input_settings){

    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-medvac',
        elemDivContainer:       '<element>'

    }   
    */  
    const settings              = input_settings;
    
   
    
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);

    let elemIdPageTitle         = null;

    let elemIdTdCountUsers      = null;
    let elemIdTdUsersNoAccount  = null;
    let elemIdTdCountAccount    = null;
    let elemIdTdAccNotStarted   = null;
    let elemIdTdAccNoSowBoar    = null;
    let elemIdTdCountPWAInstall = null;


    let elemPageTitle           = null;
    
    let elemTdCountUsers        = null;
    let elemTdUsersNoAccount    = null;
    let elemTdCountAccount      = null;
    let elemTdAccNotStarted     = null;
    let elemTdAccNoSowBoar      = null;
    let elemTdCountPWAInstall   = null;


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    
    
    const moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    
    // This can be a data_pig_prod or data_prod_group
    let curDataEntry            = null;
    
    let latestUsersTable        = new TableLatestUsers({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              'latest-users'
    });
    
    latestUsersTable.setSettingsTable({
        uniqueKey:      `latest-users-table`,
        noHeader:       true,
        noSearchAdd:    true,
        noRowCount:     true,
        itemsPerPage:   20,
        tableTitle:     'Latest Users'
    });
    
    
    this.init = function(){

        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender();  // This will call the parent method 
    
    }
    
       
    
    this.getHtml = function(){
        
        let html_system_stats   = this.getHtmlSystemStats();
        
        let html_latest_users   = latestUsersTable.getHtml();
        
        
        const html = `
    <div class="modal-body" id="">
        ${html_system_stats}
        
        ${html_latest_users}
        
        
    </div>
        `;
       
        return html;

    }
    
    
    this.afterHtmlRender = function(){
        latestUsersTable.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageTitle           = elemDivContainer.querySelector('#'+elemIdPageTitle); 
        
        elemTdCountUsers        = elemDivContainer.querySelector('#'+elemIdTdCountUsers);    
        elemTdUsersNoAccount    = elemDivContainer.querySelector('#'+elemIdTdUsersNoAccount);
        elemTdCountAccount      = elemDivContainer.querySelector('#'+elemIdTdCountAccount);  
        elemTdAccNotStarted     = elemDivContainer.querySelector('#'+elemIdTdAccNotStarted); 
        elemTdAccNoSowBoar      = elemDivContainer.querySelector('#'+elemIdTdAccNoSowBoar); 
        
        elemIdCountPWAInstall   = elemDivContainer.querySelector('#'+elemIdTdCountPWAInstall); 
    }

    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){
        elemPageTitle.addEventListener('click', function() {
            thisObj.show(); // refresh page
        });
    }
    
    
    
    this.getHtmlSystemStats = function(){
        elemIdPageTitle         = `${settings.uniqueKey}-page-title`;
        
        elemIdTdCountUsers      = `${settings.uniqueKey}-count-users`;
        elemIdTdUsersNoAccount  = `${settings.uniqueKey}-users-no-account`;
        elemIdTdCountAccount    = `${settings.uniqueKey}-count-account`;
        elemIdTdAccNotStarted   = `${settings.uniqueKey}-acc-not-started`;
        elemIdTdAccNoSowBoar    = `${settings.uniqueKey}-acc-no-sow-boar`;
        
        elemIdTdCountPWAInstall = `${settings.uniqueKey}-count-pwa-install`;
        
        const html = `
        <h2>
            <span class="nav-title blue" id="${elemIdPageTitle}" >System Stats</span>
        </h2>
        
        
        <table class="data-table">
            <colgroup>
                <col style="width: 65%;">
                <col style="width: 35%;">
            </colgroup>
            
            
            <tbody>
                <tr>
                    <td>Count Users</td>
                    <td id="${elemIdTdCountUsers}"></td>
                </tr>
                
                <tr>
                    <td>Users No Account</td>
                    <td id="${elemIdTdUsersNoAccount}"></td>
                </tr>
                
                
                <tr>
                    <td>Count Account</td>
                    <td id="${elemIdTdCountAccount}"></td>
                </tr>
                
                <tr>
                    <td>Acc Not Started</td>
                    <td id="${elemIdTdAccNotStarted}"></td>
                </tr>
                
                <tr>
                    <td>Acc No Sow/Boar</td>
                    <td id="${elemIdTdAccNoSowBoar}"></td>
                </tr>
                
                <tr>
                    <td>Count PWA install</td>
                    <td id="${elemIdTdCountPWAInstall}"></td>
                </tr>
                                
            </tbody>
        </table>
        
        `;
        
        return html;
    }

    
          
    this.show = function(options){
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        showOptions = options;
        
        const callback_success = function(data){
            console.log('system stats');
            
            thisObj.populateSystemStats(data);
        };
        
        
        navigation.managerSystem.requestSystemStats(callback_success);
        
        latestUsersTable.show();
    }
    
    
    
    this.populateSystemStats = function(data){
        elemTdCountUsers.textContent        = data.sys.count_user; 
        elemTdUsersNoAccount.textContent    = data.sys.user_no_account;
        elemTdCountAccount.textContent      = data.sys.count_account;
        elemTdAccNotStarted.textContent     = data.sys.acc_not_started;
        elemTdAccNoSowBoar.textContent      = data.sys.acc_no_sow_boar;
        
        elemTdCountPWAInstall.textContent   = data.sys.count_pwa_install;
    }

}
