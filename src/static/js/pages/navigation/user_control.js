// user_control.js

// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        NAV_MENU_GROUP,
        ACC_USER_GROUP,
        PIG_OPERATION_TYPE,
        PAGE_ID,
        FLAG_BITS,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';


export function UserControl(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    this.STORAGE_KEY                = 'superpig_user_control';
    
    let elemDesktopUserControl          = null;
    let elemDesktopUserDropdown         = null;
    
    let elemDesktopUserAvatarInitials   = null;
    let elemDesktopUserAvatarInitialsL  = null;
    let elemDesktopUserFullName         = null;
    let elemDesktopUserRole             = null;
    
    let elemDesktopMyAccount            = null;
    let elemDesktopBillNew              = null;
    let elemDesktopBillHistory          = null;
    let elemDesktopSettings             = null;
    let elemDesktopUserLogout           = null;
    

    
    let userCurrentFarmHid          = null;
    let userCurrentLanguage         = null;
    
    
    let userIsEnabled               = true;
    let userAccountIsEnabled        = true;
    let userAccounthasOverdueBill   = false;
    
    
    this.dataUserAccount            = null;
    this.userInitials               = null;
    
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        elemDesktopUserControl          = document.getElementById('userControl');
        elemDesktopUserDropdown         = document.getElementById('userDropdown');
        
        elemDesktopUserAvatarInitials   = document.getElementById('desktop-user-initials');
        elemDesktopUserAvatarInitialsL  = document.getElementById('desktop-user-initials-large');
        elemDesktopUserFullName         = document.getElementById('desktop-user-full-name');
        elemDesktopUserRole             = document.getElementById('desktop-user-role');
        
        elemDesktopMyAccount            = document.getElementById('desktop-my-account');
        elemDesktopBillNew              = document.getElementById('desktop-bill-new');
        elemDesktopBillHistory          = document.getElementById('desktop-bill-history');
        elemDesktopSettings             = document.getElementById('desktop-settings');
        elemDesktopUserLogout           = document.getElementById('desktop-user-logout');

    }
    
    
    this._processAfterHtmlRender = function(){
        
        
    }
    
    
    this._bindEventListeners = function(){
        elemDesktopMyAccount.addEventListener('click', function() {
            thisObj.onClickMyAccount();
        });
        
        
        elemDesktopBillNew.addEventListener('click', function() {
            thisObj.onClickBillNew();
        });
        
        
        elemDesktopSettings.addEventListener('click', function() {
            thisObj.onClickSettings();
        });
        
        
        elemDesktopUserLogout.addEventListener('click', function() {
            thisObj.onClickLogout();
        });

    }
    
    
    
    this.getDataToSaveToStorage = function(){
        return {
            userAccount:            thisObj.dataUserAccount
        }
    }
    
    
    
    this.saveToStorage = function() {
        const data = thisObj.getDataToSaveToStorage();
        localStorage.setItem(thisObj.STORAGE_KEY, JSON.stringify(data));
    }
    
    
    this.loadDataFromStorage = function(){
        const cached = localStorage.getItem(thisObj.STORAGE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            
            const data_user_account = data.userAccount;  
            
            thisObj.setDataUserAccount(data_user_account);  
        }
    }

    
    
    this.setDataUserAccount = function(data){
        this.dataUserAccount= data;
        
        this.saveToStorage();
        
        
        function capitalizeFirst(str) {
            if (!str) return str;
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        
        const user          = this.dataUserAccount.user.user;
        const user_pig_farms= this.dataUserAccount.user.pig_farms; 
        
        userCurrentFarmHid  = user_pig_farms[0]; // default to first pig farm

        
        const user_initials = (user.name_first.substring(0,1) + 
                            user.name_last.substring(0,1)).toUpperCase();
                            
        const user_fullname = capitalizeFirst(user.name_first) + ' ' + capitalizeFirst(user.name_last);
        
        this.userInitials   = user_initials;
        
        //this.updateUserAvatar();
        
        
        // Set User Initial
        elemDesktopUserAvatarInitials.innerHTML = user_initials;
        elemDesktopUserAvatarInitialsL.innerHTML= user_initials;
        elemDesktopUserFullName.innerHTML       = user_fullname;

        
        
        // Set Usergroup Name
        const usergroup_name    = this.dataUserAccount.user.user_group.name;
        elemDesktopUserRole.textContent         = usergroup_name;
        
        
        // Remove menus per user role
        navigation.managerNavLinks.removeMenusForNonAdminAndManagement();
        
        
        const group_num = thisObj.dataUserAccount.user.user_group.group_num;
        
        if (group_num == ACC_USER_GROUP.FARM_STAFF || group_num == ACC_USER_GROUP.OPERATIONS){
            elemDesktopBillNew.remove();    
            elemDesktopBillHistory.remove();
        }

       
        
        // Hide this first
        this.hideNewBillAvailable();
        
        if (group_num == ACC_USER_GROUP.ADMIN || group_num == ACC_USER_GROUP.MANAGEMENT){
            const account  = this.dataUserAccount.account.account;
            
            if (account.current_bill){
                // Show button
                this.showNewBillAvailable();
            }
        }

        
        // TODO this
        elemDesktopBillHistory.style.display ='none';
    }
    
    
    this.updateUserAvatar = function() {
        
        const userPicture       = localStorage.getItem('user_picture');

        
        if (userPicture) {
            // User has picture - show image
            elemDesktopUserAvatarInitials.innerHTML = `<img src="${userPicture}" alt="${thisObj.userInitials}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`; 
            elemDesktopUserAvatarInitialsL.innerHTML= `<img src="${userPicture}" alt="${thisObj.userInitials}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            
        } else {
            // No picture - show initials
            elemDesktopUserAvatarInitials.innerHTML = `<div style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;">${thisObj.userInitials}</div>`;
            elemDesktopUserAvatarInitialsL.innerHTML= `<div style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;">${thisObj.userInitials}</div>`;
        }
    }
    
    
    this.getUserHid = function(){
        if (thisObj.dataUserAccount == null){return null;}
        
        return thisObj.dataUserAccount.user.user.hid;
    }
    
    
    this.getUserAccountHid = function(){
        if (thisObj.dataUserAccount == null){return null;}
        
        return thisObj.dataUserAccount.account.account.hid;
    }


    this.getCurrentFarm = function(){
        const account_farms = thisObj.dataUserAccount.account.pig_farms;
        
        
        for (const cur_entry of account_farms){
            if (cur_entry.pig_farm.hid == userCurrentFarmHid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.isUserAccountEnabled = function(){
        return userAccountIsEnabled;
    }
    
    
    this.isUserEnabled = function(){
        return userIsEnabled;
    }

    
    this.isUserCompanyUser = function(){
        return false;
    }
    
    
    this.setUserIsEnabled = function(is_enabled){
        userIsEnabled = is_enabled;
    }
    
    
    this.setUserAccountIsEnabled = function(is_enabled){
        userAccountIsEnabled = is_enabled;
    }
    
    
    this.getCurrentFarmHid =  function(){
        return userCurrentFarmHid;
    }
    
    
    this.hideNewBillAvailable = function(){
        if (elemDesktopBillNew){
            elemDesktopBillNew.style.display = 'none';
        }
    }
    
    
    this.showNewBillAvailable = function(){
        if (elemDesktopBillNew){
            elemDesktopBillNew.style.display = 'block';
        }
    }
    
    
    /** Returns viewed bills saved in localStorage.*/
    this.getViewedBills = function() {
        const viewed = localStorage.getItem('viewed_bills');
        return viewed ? JSON.parse(viewed) : [];
    }


    this.markBillAsViewed = function(billReference) {
        const viewed = this.getViewedBills();
        if (!viewed.includes(billReference)) {
            viewed.push(billReference);
            localStorage.setItem('viewed_bills', JSON.stringify(viewed));
        }
    }


    this.isBillViewed = function(billReference) {
        return this.getViewedBills().includes(billReference);
    }
    
    
    // Will replace account.current_bill
    this.replaceCurrentBill = function(current_bill){
        const account = thisObj.dataUserAccount.account.account;
        account.current_bill = current_bill;
    }
    

    /**
     * Will check if account is locked due to overdue bill;
     * 
     * */
    this.isAccountLocked = function(){
        const account = thisObj.dataUserAccount.account.account;
        
        if (!account.current_bill){return false;}
        
        const date_due = new Date(account.current_bill.date_due);
        
        const today = new Date();
        let is_overdue = false;
        if (date_due < today) {
            is_overdue = true;
            
            // Exemption 1: Check account.flag if BILL_EXEMPTED
            if ((account.flag & FLAG_BITS.ACCOUNT.IS_BILL_EXEMPTED) > 0){
                // In production system, these accounts are bill exempted
                // In local testing this is ignored for testing
                is_overdue = false;
                
                if (window.APP_VERSION == '1.0.0.0'){
                    is_overdue = true;
                }
            }
            
        }
        
        return is_overdue;
    }
    
    
    this.onClickMyAccount = function(){
        let go_back_page    = navigation.curPageNavigated.pageContainer;
        if (go_back_page == null){
            go_back_page    = navigation.getPageContainer(PAGE_ID.HOME);
        } 
        
        
        const next_page = navigation.getPageContainer(PAGE_ID.MY_ACCOUNT);
        
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        
        
        const options ={
            go_back_page:   go_back_page,
        };
        navigation.pageMyAccount.show(options);
        
        elemDesktopUserDropdown.classList.remove('active');
    }
    
    
    this.onClickBillNew = function(){
        
        console.log(`test dataUserAccount`);
        console.log(this.dataUserAccount);
        
        let go_back_page    = navigation.curPageNavigated.pageContainer;
        if (go_back_page == null){
            go_back_page    = navigation.getPageContainer(PAGE_ID.HOME);
        } 
        
        
        const next_page = navigation.getPageContainer(PAGE_ID.BILL_NEW);
        
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        
        
        const options ={
            go_back_page:   go_back_page,
        };
        navigation.pageAccountNewBill.show(options);
        
        elemDesktopUserDropdown.classList.remove('active');
    }
    
    
    this.onClickSettings = function(){

        let go_back_page    = navigation.curPageNavigated.pageContainer;
        if (go_back_page == null){
            go_back_page    = navigation.getPageContainer(PAGE_ID.HOME);
        } 
        
        
        const next_page = navigation.getPageContainer(PAGE_ID.USER_SETTINGS);
        
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        
        
        const options ={
            go_back_page:   go_back_page,
        };
        navigation.pageUserSettings.show(options);
        
        elemDesktopUserDropdown.classList.remove('active');

    }
    
    
    this.onClickLogout = function(){
        // Clear all items from localStorage
        localStorage.clear();
        
        // Also clear sessionStorage to remove any NF state flags
        sessionStorage.clear();
        
        
        // Clear cookies (especially user_lang and access_token)
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Use a small delay to ensure storage is cleared before redirect
        setTimeout(function() {
            window.location.href = '/login';
        }, 50);
    }

}



