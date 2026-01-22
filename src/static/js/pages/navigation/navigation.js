// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_OPERATION_TYPE,
        PAGE_ID,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';


import {ServerError}                from '../common/server_error.js';
import {ToastAlert}                 from '../common/toast_alert.js';
import {MoreModal}                  from '../common/more_modal.js';


import {ManagerAddress}             from '../common/manager_address.js';
import {ManagerPublicData}          from '../common/manager_public_data.js';

import {PigFarm}                    from '../farm_account/pig_farm.js';


import {PageAccountDisabled}        from '../a_user_control/page_account_disabled.js';
import {PageUserDisabled}           from '../a_user_control/page_user_disabled.js';
import {PageAccountUnpaidBill}      from '../a_user_control/page_account_unpaid_bill.js';




import {PageSowBoarList}            from '../sow_boar/page_sow_boar_list.js';
import {PageSowBoarAddEdit}         from '../sow_boar/page_sow_boar_add_edit.js';
import {PageSowBoarEntry}           from '../sow_boar/page_sow_boar_entry.js';
import {PageSowBoarDisposed}        from '../sow_boar/page_sow_boar_disposed.js';

import {PageMedVacAddEdit}          from '../sow_boar/page_medvac_add_edit.js';
import {PageHealthNotesAddEdit}     from '../sow_boar/page_health_notes_add_edit.js';
import {PageParentTrace}            from '../sow_boar/page_parent_trace.js';


import {PageMobGestaLacta}          from '../production/gesta_lacta/page_mob_gesta_lacta.js';

import {EditModalProdPigOps}        from '../production/gesta_lacta/edit_modal_prod_pig_ops.js'
import {PageProdGestatingAdd}       from '../production/gesta_lacta/page_prod_gestating_add.js'
import {PageProdGestatingEntry}     from '../production/gesta_lacta/page_prod_gestating_entry.js'



import {PageAccPigOps}              from '../acc_pig_ops/page_acc_pig_ops.js';




function UserControl(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
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
    
    
    let userIsEnabled               = true;
    let userAccountIsEnabled        = true;
    let userAccounthasOverdueBill   = false;
    
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
        
        return dataUserAccount.user.user.hid;
    }
    
    
    this.getUserAccountHid = function(){
        if (dataUserAccount == null){return null;}
        
        return dataUserAccount.account.account.hid;
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
    
    
    this.getCurrentLanguage = function(){
        
    }
    

}


function ManagerRequest(_navigation){
    const thisObj           = this;
    const navigation        = _navigation;
    

    this.requestDataPigProdPublic = function(country_hid, callback){
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/public?country_hid=${country_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (callback){callback(response.data);}
                }
                else {
                    // TODO
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


export function Navigation(){
    const thisObj               = this;
    
    let dataCompanyApp          = null;
   
    
    
    let elemSubnavSummary       = null;
    
    
    const elemIdContAccountDisabled     = 'container-account-disabled';
    const elemIdContUserDisabled        = 'container-user-disabled';
    const elemIdContAccountBillUnpaid   = 'container-account-bill-unpaid';
    
    const elemIdContSowBoarList         = 'container-sow-boar-list';
    const elemIdContSowBoarAddEdit      = 'container-sow-boar-add-edit';
    const elemIdContSowBoarEntry        = 'container-sow-boar-entry';
    const elemIdContSowBoarDisposed     = 'container-sow-boar-disposed';
    
    
    const elemIdContMedVacAddEdit       = 'container-medvac-add-edit';
    const elemIdContHealthAddEdit       = 'container-health-add-edit';
    const elemIdContNotesAddEdit        = 'container-notes-add-edit';
    
    
    const elemIdContParentTrace         = 'container-trace-parents';
    
    
    
    const elemIdContProdGestaList       = 'container-prod-gesta-list';
    const elemIdContProdLactaList       = 'container-prod-lacta-list';
    const elemIdContProdGestaAdd        = 'container-prod-gesta-add';
    const elemIdContProdGestaEntry      = 'container-prod-gesta-entry';
    
    
    const elemIdContAccPigOps           = 'container-acc-pig-ops';
    
    
    
    
    
    
    
    
    
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

    
    let elemHiddenContAccDisabled   = null;
    let elemHiddenContUserDisabled  = null;
    let elemHiddenContBillUnpaid    = null;
    
    let elemHiddenContSowBoarList   = null;
    let elemHiddenContSowBoarAddEdit= null;
    let elemHiddenContSowBoarEntry  = null;
    let elemHiddenContSowBoarDisposed = null;
    
    
    let elemHiddenContMedVacAddEdit = null;
    let elemHiddenContHealthAddEdit = null;
    let elemHiddenContNotesAddEdit  = null;
    let elemHiddenContParentTrace   = null;
    
    let elemHiddenContProdGestaList = null;
    let elemHiddenContProdLactaList = null;
    let elemHiddenContProdGestaAdd  = null;
    let elemHiddenContProdGestaEntry= null;
    
    
    let elemHiddenContAccPigOps     = null;
    
    
    this.pageData                   = null;
    
    
    this.curScreenIsMobile          = null;
    
    
    this.userControl            = new UserControl(this);
    
    this.toastAlert             = new ToastAlert();
    this.serverError            = new ServerError(this);
    
    this.moreModal              = new MoreModal(this);
    
    
    this.managerRequest         = new ManagerRequest(this);
    this.managerAddress         = new ManagerAddress(this);
    this.managerPublicData      = new ManagerPublicData(this)
    this.pigFarm                = new PigFarm(this);
    
    
    
    
    this.pageAccountDisabled    = new PageAccountDisabled({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccountDisabled
    });
    
    
    this.pageUserDisabled       = new PageUserDisabled({
        navigation:             this,
        elemIdDivContainer:     elemIdContUserDisabled
    });
    
    
    this.pageAccountUnpaidBill  = new PageAccountUnpaidBill({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccountBillUnpaid
    });
    
    
    
    this.pageSowBoarList        = new PageSowBoarList({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarList
    });
    
    
    this.pageSowBoarAddEdit     = new PageSowBoarAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarAddEdit
    });
   
    
    this.pageSowBoarEntry       = new PageSowBoarEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarEntry
    })
    
    
    this.pageSowBoarDisposed     = new PageSowBoarDisposed({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarDisposed
    });
    
    
    this.pageMedVacAddEdit      = new PageMedVacAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContMedVacAddEdit
    });
    
    
    this.pageHealthAddEdit      = new PageHealthNotesAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContHealthAddEdit,
        uniqueKey:              'sow-boar-health-add-edit',
        isNotes:                false
    });
    
    
    this.pageNotesAddEdit       = new PageHealthNotesAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContNotesAddEdit,
        uniqueKey:              'sow-boar-notes-add-edit',
        isNotes:                true
    });
    
    
    this.pageParentTrace        = new PageParentTrace({
        navigation:             this,
        elemIdDivContainer:     elemIdContParentTrace
    });
    
    
     
    this.pageMobGestatingList   = new PageMobGestaLacta({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaList,
        isGesta:                true,
        uniqueKey:              'prod-gesta', // Use for uniqueness in elements
        pageTitle:              'Prod Gestating'
    });
    
    
    this.pageMobLactatingList   = new PageMobGestaLacta({
        navigation:             this,
        elemIdDivContainer:     elemHiddenContProdLactaList,
        isGesta:                false,
        uniqueKey:              'prod-lacta', // Use for uniqueness in elements
        pageTitle:              'Prod Lactating'
    });
    
    
    this.editModalProdPigOps    = new EditModalProdPigOps({
        navigation:             this
    });
    
    
    this.pageProdGestatingAdd   = new PageProdGestatingAdd({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd
    });
    
    
    this.pageProdGestatingEntry = new PageProdGestatingEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaEntry
    });
    
    
    this.pageAccPigOps          = new PageAccPigOps({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccPigOps
    });
    
    

    
    this.init = function(){
        
        this.userControl.init();
        
        this.moreModal.init();
        
        this.pageAccountDisabled.init();
        this.pageUserDisabled.init();
        this.pageAccountUnpaidBill.init();
        
        this.pageSowBoarList.init();
        this.pageSowBoarAddEdit.init();
        this.pageSowBoarEntry.init();
        this.pageSowBoarDisposed.init();
        
        this.pageMedVacAddEdit.init();
        this.pageHealthAddEdit.init();
        this.pageNotesAddEdit.init();
        
        this.pageParentTrace.init();
        
        
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


        elemHiddenContAccDisabled   = document.getElementById(elemIdContAccountDisabled);
        elemHiddenContUserDisabled  = document.getElementById(elemIdContUserDisabled);
        elemHiddenContBillUnpaid    = document.getElementById(elemIdContAccountBillUnpaid);

        
        elemHiddenContSowBoarList   = document.getElementById(elemIdContSowBoarList);
        elemHiddenContSowBoarAddEdit= document.getElementById(elemIdContSowBoarAddEdit);
        elemHiddenContSowBoarEntry  = document.getElementById(elemIdContSowBoarEntry);
        elemHiddenContSowBoarDisposed = document.getElementById(elemIdContSowBoarDisposed);
        
        
        elemHiddenContMedVacAddEdit = document.getElementById(elemIdContMedVacAddEdit);
        elemHiddenContHealthAddEdit = document.getElementById(elemIdContHealthAddEdit);
        elemHiddenContNotesAddEdit  = document.getElementById(elemIdContNotesAddEdit);
        elemHiddenContParentTrace   = document.getElementById(elemIdContParentTrace);
        
        elemHiddenContProdGestaList = document.getElementById(elemIdContProdGestaList);
        elemHiddenContProdLactaList = document.getElementById(elemIdContProdLactaList);
        elemHiddenContProdGestaAdd  = document.getElementById(elemIdContProdGestaAdd);
        elemHiddenContProdGestaEntry= document.getElementById(elemIdContProdGestaEntry);
    
        elemHiddenContAccPigOps     = document.getElementById(elemIdContAccPigOps);
        
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
        
        const user_current_farm = this.userControl.getCurrentFarm();
        const pig_farm_account = data.pig_farm_account;
        
        this.pigFarm.setDataPigFarm(user_current_farm);
        this.pigFarm.setDataPigFarmAccount(pig_farm_account);
        
        
        const country_hid   = user_current_farm.location.country.hid;

        
        // This waits for the logged in user for user authentication
        // before request
        this.managerAddress.setCountryHid(country_hid);
        
            
        
        this.pigFarm.accountLists.setPigFarmAccountHid(pig_farm_account.account.account.hid);
        
        // Request account feed supplier
        this.pigFarm.accountLists.requestDataSupplier(SUPPLIER_TYPE.FEED);
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
        this.pigFarm.setDataStaffList(data);
    }
    
    
    this.setDataPigProdList = function(data){
        thisObj.pageMobGestatingList.setDataPigProdList(data);
        thisObj.pageMobLactatingList.setDataPigProdList(data);
    }
    
    
    this.setDataSowList = function(data){
        this.pigFarm.dataSowList = data;
        
        this.pageSowBoarList.setDataSowList(data);
        this.pageSowBoarAddEdit.setDataSowList(data);
        
        this.pageProdGestatingAdd.setDataSowList(data);
        this.pageProdGestatingEntry.setDataSowList(data);
        
    }
    
    
    this.setDataBoarList = function(data){
        this.pigFarm.dataBoarList = data;
        
        this.pageSowBoarList.setDataBoarList(data);
        this.pageSowBoarAddEdit.setDataBoarList(data);
        
        this.pageProdGestatingAdd.setDataBoarList(data);
        this.pageProdGestatingEntry.setDataBoarList(data);
    }
    
    
    this.setDataMedVacBrandList = function(data){
        this.pageMedVacAddEdit.setDataMedVacBrandList(data);
    }
    
    
    this.setDataMedVacTypeList = function(data){
        this.pageMedVacAddEdit.setDataMedVacTypeList(data);
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
    
            case PAGE_ID.SOW_BOAR_ENTRY:{
                return elemHiddenContSowBoarEntry;
            }
    
            case PAGE_ID.SOW_BOAR_DISPOSED:{
                return elemHiddenContSowBoarDisposed;
            }
    
    
            case PAGE_ID.MEDVAC_ADD_EDIT:{
                return elemHiddenContMedVacAddEdit;
            }
            
            case PAGE_ID.HEALTH_ADD_EDIT:{
                return elemHiddenContHealthAddEdit;
            }
            
            case PAGE_ID.NOTES_ADD_EDIT:{
                return elemHiddenContNotesAddEdit;
            }
            
            case PAGE_ID.TRACE_PARENTS:{
                return elemHiddenContParentTrace;
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
        
        
        // Perform user and account control checks.
        
        // Check if user.account is disabled
        if (thisObj.userControl.isUserAccountEnabled() == false){
            // Hide all containers
            for (const cur_entry of hidden_containers){
                cur_entry.style.display = 'none';
            }
            
            
            console.log(thisObj.pigFarm);
            
            const pig_farm_account = thisObj.pigFarm.dataPigFarmAccount.account.account;
            const options = {
                account_code:   pig_farm_account.hid,   
                account_name:   pig_farm_account.name   
            }
            thisObj.pageAccountDisabled.beforeShow(options);
            
            // Except
            elemHiddenContAccDisabled.style.display = 'block';
            
            return;
        }
        
        
        // Check if user is disabled by account
        if (thisObj.userControl.isUserEnabled() == false){
            // Hide all containers
            for (const cur_entry of hidden_containers){
                cur_entry.style.display = 'none';
            }
            
            // Except
            elemHiddenContUserDisabled.style.display = 'block';
            
            return;
        }
        
        
        // Get current pig Farm
        
        const farm_acc_has_unpaid_bill = thisObj.pigFarm.isPigFarmAccountHasUnpaidBill();
        
        
        // Check if current user is company support, marketing related users
        if (thisObj.userControl.isUserCompanyUser() == false){
            console.log('test Naviation 1');
            
            if (farm_acc_has_unpaid_bill == true){
                console.log('test Navigation 2');
            
                // Hide all containers
                for (const cur_entry of hidden_containers){
                    cur_entry.style.display = 'none';
                }
                
                
                let pig_farm_account = thisObj.pigFarm.dataPigFarmAccount.account;
                let account_bill = null;
                if ('account_bill' in pig_farm_account){
                    account_bill = pig_farm_account.account_bill;
                
                    const options ={
                        pig_farm_account:   pig_farm_account.account,
                        account_bill:       account_bill
                    };
                    thisObj.pageAccountUnpaidBill.beforeShow(options);
                    
                    // Except
                    elemHiddenContBillUnpaid.style.display = 'block';
                
                    return;
                
                }
                
                else{
                    // Request account bill
                    
                }
                
                
            }
            
        }
        
        
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
            
            case 'disposed':{
                thisObj._onClickNavSowBoar(is_mobile, SOW_BOAR_TYPE.DISPOSED);
                break;
            }
            
            case 'trace_parents':{
                thisObj._onClickNavParentTrace(is_mobile);
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
    
    
    this._onClickNavParentTrace = function(is_mobile){
        thisObj.showThisPage(elemHiddenContParentTrace);
        thisObj.pageParentTrace.show();
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
        
        // Get the data_pig_prod from pageMobGestatingList
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