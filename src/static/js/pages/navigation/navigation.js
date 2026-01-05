// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_OPERATION_TYPE,
        PAGE_ID,
        SOW_BOAR_TYPE}              from '../../constants.js';

import {PageSowBoarList}            from '../sow_boar/page_sow_boar_list.js';
import {PageSowBoarAddEdit}         from '../sow_boar/page_sow_boar_add_edit.js';



import {PageMobGestaLacta}          from '../production/gesta_lacta/page_mob_gesta_lacta.js';

import {EditModalProdPigOps}        from '../production/gesta_lacta/edit_modal_prod_pig_ops.js'
import {PageProdGestatingAdd}       from '../production/gesta_lacta/page_prod_gestating_add.js'
import {PageProdGestatingEntry}     from '../production/gesta_lacta/page_prod_gestating_entry.js'



import {PageAccPigOps}              from '../acc_pig_ops/page_acc_pig_ops.js';




function UserControl() {
    const thisObj                   = this;
    
    let elemDesktopUserAvatarInitials   = null;
    let elemDesktopUserAvatarInitialsL  = null;
    let elemDesktopUserFullName         = null;
    let elemDesktopUserRole             = null;
    
    let elemMobileUserAvatarInitials    = null;
    let elemMobileUserAvatarInitialsL   = null;
    let elemMobileUserFullName          = null;
    let elemMobileUserRole              = null;
    
    
    let dataUserAccount             = null;
    
    let userCurrentFarmHid          = null;
    let userCurrentLanguage         = null;
    
    
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
        

        const user          = dataUserAccount.user.user;
        const user_pig_farms= dataUserAccount.user.pig_farms; 
        
        userCurrentFarmHid  = user_pig_farms[0]; // default to first pig farm

        
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
            if (cur_entry.pig_farm.hid == userCurrentFarmHid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.getCurrentLanguage = function(){
        
    }
    
    
    //temporary
    this.getBaseUrl = function(){
        return "http://localhost:8080"; // remporary
    }
}




export function Navigation(){
    const thisObj               = this;
    
    let dataCompanyApp          = null;
   
    
    
    let elemSubnavSummary       = null;
    
    
    let elemDesktopNavSettings      = null;
    let elemDesktopNavSowBoarGilt   = null;
    let elemDesktopNavProduction    = null;
    let elemDesktopNavOperations    = null;
    let elemDesktopNavFinancials    = null;
    let elemDesktopNavAccountLists  = null;
    let elemDesktopNavAdmin         = null;
    
    let elemMobileNavSettings       = null;
    let elemMobileNavSowBoarGilt    = null;
    let elemMobileNavProduction     = null;
    let elemMobileNavOperations     = null;
    let elemMobileNavFinancials     = null;
    let elemMobileNavAccountLists   = null;
    let elemMobileNavAdmin          = null;

    
    let elemHiddenContSowBoarList   = null;
    let elemHiddenContSowBoarAddEdit= null;
    
    let elemHiddenContProdGestaList = null;
    let elemHiddenContProdLactaList = null;
    let elemHiddenContProdGestaAdd  = null;
    let elemHiddenContProdGestaEntry= null;
    
    
    let elemHiddenContAccPigOps     = null;
    
    
    this.pageData                   = null;
    
    
    this.curScreenIsMobile          = null;
    
    
    this.userControl                = new UserControl();
    
    
    const settingsSowBoarList = {
        navigation:             this
    }
    this.pageSowBoarList        = new PageSowBoarList(settingsSowBoarList);
    
    
    const settingsSowBoarAddEdit = {
        navigation:             this
    }
    this.pageSowBoarAddEdit     = new PageSowBoarAddEdit(settingsSowBoarAddEdit);
    
    
    const settingsProdGestating = {
        navigation:             this,
        isGesta:                true,
        uniqueKey:              'prod-gesta', // Use for uniqueness in elements
        pageTitle:              'Production Gestating'
    } 
    this.pageMobGestatingList   = new PageMobGestaLacta(settingsProdGestating);
    
    
    const settingsProdLactating = {
        navigation:             this,
        isGesta:                false,
        uniqueKey:              'prod-lacta', // Use for uniqueness in elements
        pageTitle:              'Production Lactating'
    } 
    this.pageMobLactatingList   = new PageMobGestaLacta(settingsProdLactating);
    
    
    const settingsEditPigOps    = {
        navigation:             this
    };
    this.editModalProdPigOps    = new EditModalProdPigOps(settingsEditPigOps);
    
    
    const settingsProdGestatingAdd = {
        navigation:             this
    };
    this.pageProdGestatingAdd   = new PageProdGestatingAdd(settingsProdGestatingAdd);
    
    
    const settingsProdGestatingEntry = {
        navigation:             this
    };
    this.pageProdGestatingEntry = new PageProdGestatingEntry(settingsProdGestatingEntry);
    
    
    const settingsAccPigOps = {
        navigation:             this
    }
    this.pageAccPigOps          = new PageAccPigOps(settingsAccPigOps);
    
    
    
    
    
    
    let dataPigProdList         = null;
    
    
    this.init = function(){
        
        this.userControl.init();
        
        
        this.pageSowBoarList.init();
        this.pageSowBoarAddEdit.init();
        
        this.pageMobGestatingList.init();
        this.pageMobLactatingList.init();
        this.editModalProdPigOps.init();
        this.pageProdGestatingAdd.init();
        this.pageProdGestatingEntry.init();
        
        this.pageAccPigOps.init();
        
        
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

        
        elemHiddenContSowBoarList   = document.getElementById('container-sow-boar-list');
        elemHiddenContSowBoarAddEdit= document.getElementById('container-sow-boar-add-edit');
        
        
        elemHiddenContProdGestaList = document.getElementById('container-prod-gesta-list');
        elemHiddenContProdLactaList = document.getElementById('container-prod-lacta-list');
        elemHiddenContProdGestaAdd  = document.getElementById('container-prod-gesta-add');
        elemHiddenContProdGestaEntry= document.getElementById('container-prod-gesta-entry');
    
        elemHiddenContAccPigOps     = document.getElementById('container-acc-pig-ops');
        
    }
    
    
    this._processAfterHtmlRender = function(){
        this.pageMobGestatingList.editModalProdPigOps = this.editModalProdPigOps;
        this.pageMobLactatingList.editModalProdPigOps = this.editModalProdPigOps;
    
        this.pageMobGestatingList.setNavigation(thisObj);
        this.pageMobLactatingList.setNavigation(thisObj);
        this.editModalProdPigOps.setNavigation(thisObj);
        
    }
    
    
    this._bindEventListeners = function(){
        
        window.addEventListener('resize', thisObj.updatePigFarmName);
        
        const mobileNavLinks = document.querySelectorAll('.mobile-menu-title');
        // Toggle Mobile Submenus
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const submenuId = link.getAttribute('data-submenu');
                const submenu = document.getElementById(submenuId);
                
                
                // Close all other submenus
                link.querySelectorAll('.mobile-submenu').forEach(menu => {
                    menu.classList.remove('active');
                });
                
                // Toggle current submenu
                submenu.classList.toggle('active');
                
                // Rotate chevron icon
                const icon = link.querySelector('.fa-chevron-down');
                if (submenu.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
    
    
    this.setPageData = function(data){
        this.pageData = data;
        
        this.setDataCompanyApp(data.application);
        this.setDataUserAccount(data.user_account);
            
            
        this.pageAccPigOps.setDataAccPigOps(data.acc_gestating_ops);
            
        this.setDataStaffList(data.staff_list);
        this.setDataSowList(data.sow_list);
        this.setDataBoarList(data.boar_list);
            
            
        if ('pig_production' in data){
            this.setDataPigProdList(data.pig_production);
        }
        else{
            // sendrequest
        }
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
        this.pageProdGestatingAdd.setDataStaffList(data);
        this.pageProdGestatingEntry.setDataStaffList(data);
    }
    
    
    this.setDataPigProdList = function(data){
        dataPigProdList = data;
        
        this.pageMobGestatingList.setDataPigProdList(dataPigProdList);
        this.pageMobLactatingList.setDataPigProdList(dataPigProdList);
    }
    
    
    this.setDataSowList = function(data){
        this.pageSowBoarList.setDataSowList(data);
        
        this.pageProdGestatingAdd.setDataSowList(data);
        this.pageProdGestatingEntry.setDataSowList(data);
        
    }
    
    
    this.setDataBoarList = function(data){
        this.pageSowBoarList.setDataBoarList(data);
        
        this.pageProdGestatingAdd.setDataBoarList(data);
        this.pageProdGestatingEntry.setDataBoarList(data);
    }
    
    
    // Update pig farm name on resize for responsive centering
    this.updatePigFarmName = function() {
        // Set Farm name
        const cur_user_farm = thisObj.userControl.getCurrentFarm();
		
		
        const pig_farm_name = cur_user_farm.pig_farm.name;
        
        
        const pigFarmName = document.getElementById('pigFarmName');
        const mobilePigFarmName = document.getElementById('mobilePigFarmName');
        
        pigFarmName.textContent = pig_farm_name;
        
        
        // Keep mobile version consistent
        if (mobilePigFarmName) {
            mobilePigFarmName.textContent = pig_farm_name;
        }
    }
    
    
    this.getPageContainer = function(page_id){
        switch(page_id){
            case PAGE_ID.HOME:{
                return null;
            }
    
            
            case PAGE_ID.SOW_BOAR_LIST:{
                return elemHiddenContSowBoarList;
            }
    
            case PAGE_ID.SOW_BOAR_ADD_EDIT:{
                return elemHiddenContSowBoarAddEdit;
            }
    
    
            case PAGE_ID.PROD_GESTA_LIST:{
                return elemHiddenContProdGestaList;
            }
            
            case PAGE_ID.PROD_GESTA_ADD:{
                return elemHiddenContProdGestaAdd;
            }
            
            case PAGE_ID.PROD_GESTA_ENTRY:{
                return elemHiddenContProdGestaEntry;
            }
            
            
            case PAGE_ID.PROD_LACTA_LIST:{
                return elemHiddenContProdLactaList;
            }
        
            case PAGE_ID.ACC_PIG_OPS: {
                return elemHiddenContAccPigOps;
            }
    
        }
        
        return null;
        
    }
        
        
    this.showThisPage = function(page_container){
        // All navigation menus will use this
        // Be sure the body back ground color is reset to default
        document.body.style.backgroundColor = '#f5f7fa';
        
        const hidden_containers = document.getElementsByClassName("hidden-container");
        
        
        for (const cur_entry of hidden_containers){
            
            if (cur_entry == page_container){
                cur_entry.style.display = 'block';
            }
            else{
                cur_entry.style.display = 'none';
            }
        }
    }
    
    
    this.onClickNav = function(is_mobile, nav_name){
    
        thisObj.curScreenIsMobile = is_mobile;
        
        
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
        thisObj.showThisPage(elemHiddenContAccPigOps);
        thisObj.pageAccPigOps.show(operation_type);
    }
        
        
    this._onClickNavSowBoar = function(is_mobile, sow_boar_type){
        thisObj.showThisPage(elemHiddenContSowBoarList);
        
        const options= {
            sow_boar_type: sow_boar_type
        };
        thisObj.pageSowBoarList.show(options);
    }
    
    
    this._onClickNavProdGestaLacta = function(is_mobile, operation_type){
        
        if (is_mobile == null){ 
            // If not specified use the last known screen state.
            is_mobile = thisObj.curScreenIsMobile;
        }
        
        
        if (is_mobile){
            if (operation_type == PIG_OPERATION_TYPE.GESTATING){
                thisObj.showThisPage(elemHiddenContProdGestaList);
                thisObj.pageMobGestatingList.show();
                return;
            }
            
            if ((operation_type == PIG_OPERATION_TYPE.LACTATING_PIGLETS) || 
                (operation_type == PIG_OPERATION_TYPE.LACTATING_SOW)){
                thisObj.showThisPage(elemHiddenContProdLactaList);
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
        
        
        
    this.onClickProdGestatingAdd = function(){
        thisObj.showThisPage(elemHiddenContProdGestaAdd);
        thisObj.pageProdGestatingAdd.show();
    }
    
    
    this.onClickProdGestatingEntry = function(pig_prod_pid){
        if (pig_prod_pid == null){
            thisObj._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
            return;
        }
        
        console.log('onClickProdGestatingEntry; pig_prod_pid = ' + pig_prod_pid);
        thisObj.showThisPage(elemHiddenContProdGestaEntry);
        
        // Get the data_pig_prod from dataPigProdList
        const data_pig_prod_list = thisObj.pageMobGestatingList.getDataPigProdList();
        
        let prev_prod_pid = null;
        let next_prod_pid = null;
        
        let index;
        let prev_entry  = null;
        let cur_entry   = null;
        let next_entry  = null;
        
        for (index = 0; index< data_pig_prod_list.length; index++){
            cur_entry = data_pig_prod_list[index];
            
            
            
            if (cur_entry.pig_production.farm_prod_id == pig_prod_pid){
                
                if ((index-1) >=0){
                    prev_entry = data_pig_prod_list[index-1];
                    prev_prod_pid = prev_entry.pig_production.farm_prod_id;
                }
                
                if ((index+1) < data_pig_prod_list.length){
                    next_entry = data_pig_prod_list[index+1];
                    next_prod_pid = next_entry.pig_production.farm_prod_id;
                }
                
                const options = {
                    prev_prod_pid:  prev_prod_pid,
                    next_prod_pid:  next_prod_pid,
                    data_index:     index+1,
                    total_entries:  data_pig_prod_list.length
                };
                
                thisObj.pageProdGestatingEntry.show(cur_entry, options);
                return;
            }
        }
        
    }
    
   
    
}