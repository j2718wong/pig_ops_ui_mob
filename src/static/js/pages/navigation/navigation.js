// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE}              from '../../constants.js';

import {PageAccPigOps}              from '../acc_pig_ops/page_acc_pig_ops.js';
import {PageMobGestaLacta}          from '../production/gesta_lacta/page_mob_gesta_lacta.js';


function UserControl() {
    const thisObj                   = this;
    
    var elemDesktopUserAvatarInitials   = null;
    var elemDesktopUserAvatarInitialsL  = null;
    var elemDesktopUserFullName         = null;
    var elemDesktopUserRole             = null;
    
    var elemMobileUserAvatarInitials    = null;
    var elemMobileUserAvatarInitialsL   = null;
    var elemMobileUserFullName          = null;
    var elemMobileUserRole              = null;
    
    
    var dataUserAccount             = null;
    
    var userCurrentFarmHid          = null;
    var userCurrentLanguage         = null;
    
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        
        elemDesktopUserAvatarInitials   = document.getElementById('desktop-user-initials');
        elemDesktopUserAvatarInitialsL  = document.getElementById('desktop-user-initials-large');
        elemDesktopUserFullName         = document.getElementById('desktop-user-full-name');
        elemDesktopUserRole             = document.getElementById('desktop-user-role');
        
        
        elemMobileUserAvatarInitials    = document.getElementById('mobile-user-initials');
        elemMobileUserAvatarInitialsL   = document.getElementById('mobile-user-initials-large');
        elemMobileUserFullName          = document.getElementById('mobile-user-full-name');
        elemMobileUserRole              = document.getElementById('mobile-user-role');
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        
    }
    
    
    this._bindEventListeners = function(){
        
    }
    
    
    this.setDataUserAccount = function(data){
        dataUserAccount     = data;
        
        userCurrentFarmHid  = data.user.default_farm;
        
        const user          = dataUserAccount.user;
        const user_initials = user.name_first.substring(0,1) + 
                            user.name_last.substring(0,1);
                            
        const user_fullname = user.name_first + ' ' + user.name_last;
        
        elemDesktopUserAvatarInitials.innerHTML = user_initials;
        elemMobileUserAvatarInitials.innerHTML  = user_initials;
        elemDesktopUserAvatarInitialsL.innerHTML= user_initials;
        elemMobileUserAvatarInitialsL.innerHTML = user_initials;
        
        
        elemDesktopUserFullName.innerHTML       = user_fullname;
        elemMobileUserFullName.innerHTML        = user_fullname;
        
        
    }
    
    
    this.getUserHid = function(){
        if (dataUserAccount == null){return null;}
        
        return dataUserAccount.user.hid;
    }
    
    
    this.getUserAccountHid = function(){
        if (dataUserAccount == null){return null;}
        
        return dataUserAccount.account.hid;
    }


    this.getCurrentFarm = function(){
        const account_farms = dataUserAccount.account.pig_farms;
        
        for (const cur_entry of account_farms){
            if (cur_entry.hid == userCurrentFarmHid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.getCurrentLanguage = function(){
        
    }
}



export function Navigation(){
    const thisObj               = this;
    
    var dataCompanyApp          = null;
   
    
    
    var elemSubnavSummary       = null;
    
    
    var elemDesktopNavSettings      = null;
    var elemDesktopNavSowBoarGilt   = null;
    var elemDesktopNavProduction    = null;
    var elemDesktopNavOperations    = null;
    var elemDesktopNavFinancials    = null;
    var elemDesktopNavAccountLists  = null;
    var elemDesktopNavAdmin         = null;
    
    var elemMobileNavSettings       = null;
    var elemMobileNavSowBoarGilt    = null;
    var elemMobileNavProduction     = null;
    var elemMobileNavOperations     = null;
    var elemMobileNavFinancials     = null;
    var elemMobileNavAccountLists   = null;
    var elemMobileNavAdmin          = null;

    
    var elemHiddenContAccPigOps     = null;
    var elemHiddenContProdGestating = null;
    var elemHiddenContProdLactating = null;
	
	
	var curScreenIsMobile			= null;
    
	
    this.userControl                = new UserControl();
    
    this.pageAccPigOps              = new PageAccPigOps();
    
    
    const settingsProdGestating = {
        parentObj:              this,
        isGesta:                true,
        uniqueKey:              'prod-gesta', // Use for uniqueness in elements
        pageTitle:              'Production Gestating'
    } 
    this.pageMobGestatingList   = new PageMobGestaLacta(settingsProdGestating);
    
    const settingsProdLactating = {
        parentObj:              this,
        isGesta:                false,
        uniqueKey:              'prod-lacta', // Use for uniqueness in elements
        pageTitle:              'Production Lactating'
    } 
    this.pageMobLactatingList   = new PageMobGestaLacta(settingsProdLactating);
    
    
    
    
    
    this.init = function(){
        
        this.userControl.init();
        
        this.pageAccPigOps.init();
        this.pageMobGestatingList.init();
        this.pageMobLactatingList.init();
        
        this.afterHtmlRender();
        
    }
    
    
    this.render = function(){}
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
       
        elemDesktopNavSettings      = document.getElementById('desktop-nav-settings');
        elemDesktopNavSowBoarGilt   = document.getElementById('desktop-nav-sow-boar-gilt');
        elemDesktopNavProduction    = document.getElementById('desktop-nav-production');
        elemDesktopNavOperations    = document.getElementById('desktop-nav-operations');
        elemDesktopNavFinancials    = document.getElementById('desktop-nav-financials');
        elemDesktopNavAccountLists  = document.getElementById('desktop-nav-account-lists');
        elemDesktopNavAdmin         = document.getElementById('desktop-nav-admin');
        
        elemMobileNavSettings       = document.getElementById('mobile-nav-settings');
        elemMobileNavSowBoarGilt    = document.getElementById('mobile-nav-sow-boar-gilt');
        elemMobileNavProduction     = document.getElementById('mobile-nav-production');
        elemMobileNavOperations     = document.getElementById('mobile-nav-operations');
        elemMobileNavFinancials     = document.getElementById('mobile-nav-financials');
        elemMobileNavAccountLists   = document.getElementById('mobile-nav-account-lists');
        elemMobileNavAdmin          = document.getElementById('mobile-nav-admin');

        
        elemHiddenContAccPigOps     = document.getElementById('container-acc-pig-ops');
        elemHiddenContProdGestating = document.getElementById('container-prod-gesta-list');
        elemHiddenContProdLactating = document.getElementById('container-prod-lacta-list');
    
    }
    
    
    this._processAfterHtmlRender = function(){
     
	}
    
    
    this._bindEventListeners = function(){
        
        window.addEventListener('resize', thisObj.updatePigFarmName);
        
        
    }
    
    
    this.setDataCompanyApp = function(data){
        dataCompanyApp = data;
        
        const elems = document.getElementsByClassName('product-name');

        
        for (let i = 0; i < elems.length; i++) {
            elems[i].innerHTML = dataCompanyApp.product_name;
        }
    }
    
    
    this.setDataUserAccount = function(data){
        this.userControl.setDataUserAccount(data);
        
        this.updatePigFarmName();
    }
    
	
	this.setDataStaffList = function(data){
		this.pageMobGestatingList.setDataStaffList(data);
		this.pageMobLactatingList.setDataStaffList(data);
	}
	
	
	this.setDataPigProdList = function(data){
		this.pageMobGestatingList.setDataPigProdList(data);
        this.pageMobLactatingList.setDataPigProdList(data);
	}
	
    
    // Update pig farm name on resize for responsive centering
    this.updatePigFarmName = function() {
        // Set Farm name
        const cur_user_farm = thisObj.userControl.getCurrentFarm();
        
        
        const pigFarmName = document.getElementById('pigFarmName');
        const mobilePigFarmName = document.getElementById('mobilePigFarmName');
        
        pigFarmName.textContent = cur_user_farm.name;
        
        
        // Keep mobile version consistent
        if (mobilePigFarmName) {
            mobilePigFarmName.textContent = cur_user_farm.name;
        }
    }
    
        
    this.hideHiddenContainers = function(except_hidden_cont){
        const hidden_containers = document.getElementsByClassName("hidden-container");
        
        
        for (const cur_entry of hidden_containers){
            
            if (cur_entry == except_hidden_cont){
                cur_entry.style.display = 'block';
            }
            else{
                cur_entry.style.display = 'none';
            }
        }
    }
    
    
    this.onClickNav = function(is_mobile, nav_name){
	
		curScreenIsMobile = is_mobile;
        
		
        switch(nav_name){
            case 'op-settings':{
                thisObj._onClickNavOpsSettings(is_mobile);
                break;
            }
            
            case 'gesta-sow-ops':{
                thisObj._onClickNavAccPigOps(is_mobile, PIG_OPERATION_TYPE.GESTATING);
                break;
            }
            
            case 'lacta-piglets-ops':{
                thisObj._onClickNavAccPigOps(is_mobile, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
                break;
            }
                
            case 'lacta-sow-ops':{
                thisObj._onClickNavAccPigOps(is_mobile, PIG_OPERATION_TYPE.LACTATING_SOW);
                break;
            }
            
            case 'gilt-ops':{
                thisObj._onClickNavAccPigOps(is_mobile, PIG_OPERATION_TYPE.GILT);
                break;
            }
            
            
            case 'sows':{
                thisObj._onClickNavSowBoar(is_mobile, SOW_BOAR_TYPE.SOW);
                break;
            }
            
            case 'boars':{
                thisObj._onClickNavSowBoar(is_mobile, SOW_BOAR_TYPE.BOAR);
                break;
            }
            
            case 'gilts':{
                thisObj._onClickNavSowBoar(is_mobile, SOW_BOAR_TYPE.GILT);
                break;
            }
            
            
            case 'prod-gesta':{
                thisObj._onClickNavProdGestaLacta(is_mobile, PIG_OPERATION_TYPE.GESTATING);
                break;
            }
            
            case 'prod-lacta-piglets':{
                thisObj._onClickNavProdGestaLacta(is_mobile, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
                break;
            }
            
            case 'prod-lacta-sows':{
                thisObj._onClickNavProdGestaLacta(is_mobile, PIG_OPERATION_TYPE.LACTATING_SOW);
                break;
            }
            
            case 'prod-fattening':{
                thisObj._onClickNavProdFattening(is_mobile);
                break;
            }
            
            case 'prod-feeds':{
                thisObj._onClickNavProdFeeds(is_mobile);
                break;
            }
            
            
            case 'pig-harvest':{
                thisObj._onClickNavPigHarvest(is_mobile);
                break;
            }
            
            case 'reports':{
                thisObj._onClickNavReports(is_mobile);
                break;
            }
            
            case 'feed-caculator':{
                thisObj._onClickNavFeedCalculator(is_mobile);
                break;
            }
            
            
            case 'feeds-expenses':{
                thisObj._onClickNavFeedsExpenses(is_mobile);
                break;
            }
            
            case 'nonfeeds-expenses':{
                thisObj._onClickNavNonFeedsExpenses(is_mobile);
                break;
            }
            
            case 'sales':{
                thisObj._onClickNavSales(is_mobile);
                break;
            }
            
            
            case 'staff':{
                thisObj._onClickNavStaff(is_mobile);
                break;
            }
            
            case 'pig-buyers':{
                thisObj._onClickPigBuyers(is_mobile);
                break;
            }
            
            case 'feed-suppliers':{
                thisObj._onClickFeedSuppliers(is_mobile);
                break;
            }
            
            case 'semen-suppliers':{
                thisObj._onClickSemenSuppliers(is_mobile);
                break;
            }
            
            case 'gilt-suppliers':{
                thisObj._onClickGiltSuppliers(is_mobile);
                break;
            }
            
            
            case 'users': {
                thisObj._onClickNavUsers(is_mobile);
                break;
            }
            
            case 'users-requests':{
                thisObj._onClickNavUsersRequest(is_mobile);
                break;
            }
            
            
        
        }
        
        
    }
    
    
    this._onClickNavOpsSettings = function(is_mobile){
        console.log('_onClickNavOpsSettings not yet implemented; is_mobile=' + is_mobile);
    }
        
    
    this._onClickNavAccPigOps = function(is_mobile, operation_type){
        console.log(`_onClickNavAccPigOps; is_mobile=${is_mobile}; operation_type = ${operation_type}`);
        thisObj.hideHiddenContainers(elemHiddenContAccPigOps);
        thisObj.pageAccPigOps.show(operation_type);
    }
        
        
    this._onClickNavSowBoar = function(is_mobile, sow_boar_type){
        console.log(`_onClickNavSowBoar; is_mobile=${is_mobile}; sow_boar_type = ${sow_boar_type}`);
        
    }
    
    
    this._onClickNavProdGestaLacta = function(is_mobile, operation_type){
        
		if (is_mobile == null){ 
			// If not specified use the last known screen state.
			is_mobile = curScreenIsMobile;
		}
		
		
        if (is_mobile){
            if (operation_type == PIG_OPERATION_TYPE.GESTATING){
                thisObj.hideHiddenContainers(elemHiddenContProdGestating);
                thisObj.pageMobGestatingList.show();
                return;
            }
            
            if ((operation_type == PIG_OPERATION_TYPE.LACTATING_PIGLETS) || 
				(operation_type == PIG_OPERATION_TYPE.LACTATING_SOW)){
                thisObj.hideHiddenContainers(elemHiddenContProdLactating);
                thisObj.pageMobLactatingList.show();
                return;
            }
        }
    }
    
    
    this._onClickNavProdFattening = function(is_mobile){
        console.log('_onClickNavProdFattening not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavProdFeeds = function(is_mobile){
        console.log('_onClickNavProdFeeds not yet implemented; is_mobile=' + is_mobile);
    }
        
        
        
              
    this._onClickNavPigHarvests = function(is_mobile){
        console.log('_onClickNavPigHarvests not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavReports = function(is_mobile){
        console.log('_onClickNavReports not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavFeedCalculator = function(is_mobile){
        console.log('_onClickNavFeedCalculator not yet implemented; is_mobile=' + is_mobile);
    }
        
        
            
    this._onClickNavFeedsExpenses = function(is_mobile){
        console.log('_onClickNavFeedsExpenses not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavNonFeedsExpenses = function(is_mobile){
        console.log('_onClickNavNonFeedsExpenses not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavSales = function(is_mobile){
        console.log('_onClickNavSales not yet implemented; is_mobile=' + is_mobile);
    }
        
        
        
        
                    
    this._onClickNavStaff = function(is_mobile){
        console.log('_onClickNavStaff not yet implemented; is_mobile=' + is_mobile);
    }
        
                
    this._onClickNavPigBuyers = function(is_mobile){
        console.log('_onClickNavPigBuyers not yet implemented; is_mobile=' + is_mobile);
    }
        
            
    this._onClickNavFeedSuppliers = function(is_mobile){
        console.log('_onClickNavFeedSuppliers not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavSemenSuppliers = function(is_mobile){
        console.log('_onClickNavSemenSuppliers not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavGiltSuppliers = function(is_mobile){
        console.log('_onClickNavGiltSuppliers not yet implemented; is_mobile=' + is_mobile);
    
    }
        
        
           
                    
    this._onClickNavUsers = function(is_mobile){
        console.log('_onClickNavUsers not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavUsersRequest = function(is_mobile){
        console.log('_onClickNavUsersRequest not yet implemented; is_mobile=' + is_mobile);
    
    
    }
        
        
        
    
    
    
    
    
}