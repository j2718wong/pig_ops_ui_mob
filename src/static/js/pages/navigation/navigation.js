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
import {ManagerRequest}             from '../common/manager_request.js';

import {PigFarm}                    from '../farm_account/pig_farm.js';


import {PageAccountDisabled}        from '../a_user_control/page_account_disabled.js';
import {PageUserDisabled}           from '../a_user_control/page_user_disabled.js';
import {PageAccountUnpaidBill}      from '../a_user_control/page_account_unpaid_bill.js';




import {PageSowBoarList}            from '../sow_boar/page_sow_boar_list.js';
import {PageSowBoarAddEdit}         from '../sow_boar/page_sow_boar_add_edit.js';
import {PageSowBoarEntry}           from '../sow_boar/page_sow_boar_entry.js';
import {PageSowBoarDisposed}        from '../sow_boar/page_sow_boar_disposed.js';

import {PageMedVacAddEdit}          from '../multikey/page_medvac_add_edit.js';
import {PageHealthNotesAddEdit}     from '../multikey/page_health_notes_add_edit.js';
import {PageParentTrace}            from '../sow_boar/page_parent_trace.js';


import {PageMobGestaLacta}          from '../production/gesta_lacta/page_mob_gesta_lacta.js';

import {PageProdPigOpsEdit}         from '../production/gesta_lacta/page_prod_pig_ops_edit.js'
import {PageProdGestatingAdd}       from '../production/gesta_lacta/page_prod_gestating_add.js'
import {PageProdGestatingEntry}     from '../production/gesta_lacta/page_prod_gestating_entry.js'
import {PageProdLactatingEntry}     from '../production/gesta_lacta/page_prod_lactating_entry.js'

import {PageProdFatteningList}      from '../production/fattening/page_prod_fattening_list.js'
import {PageProdFatteningEntry}     from '../production/fattening/page_prod_fattening_entry.js'

import {TablePigFarmFeedBuy}        from '../feeds/pig_farm_feed_buy/table_pig_farm_feed_buy.js';
import {PagePfFeedBuyAddEdit}       from '../feeds/pig_farm_feed_buy/page_pf_feed_buy_add_edit.js';
import {PagePfBuyItemAddEdit}       from '../feeds/pig_farm_feed_buy/page_pf_feed_buy_item_add_edit.js';

import {PageProdFeedAddEdit}        from '../feeds/prod_feed/page_prod_feed_add_edit.js';


import {PageAccPigOpsList}          from '../acc_pig_ops/page_acc_pig_ops_list.js';
import {PageAccPigOpsAddEdit}       from '../acc_pig_ops/page_acc_pig_ops_add_edit.js';


import {PageCommonSupplierAddEdit}  from '../supplier/page_common_supplier_add_edit.js';


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



export function Navigation(){
    const thisObj               = this;
    
    
    
    
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
    const elemIdContProdGestaAdd        = 'container-prod-gesta-add';
    const elemIdContProdGestaEntry      = 'container-prod-gesta-entry';
    
    const elemIdContProdLactaList       = 'container-prod-lacta-list';
    const elemIdContProdLactaEntry      = 'container-prod-lacta-entry';
    
    const elemIdContFatteningList       = 'container-fattening-list';
    const elemIdContFatteningAdd        = 'container-fattening-add';
    const elemIdContFatteningEntry      = 'container-fattening-entry';
    
    
    
    const elemIdContProdPigOpsEdit      = 'container-prod-pig-ops-edit';
    
    
    const elemIdContFarmFeedBuyList     = 'container-farm-feed-buy-list';
    const elemIdContFarmFeedBuyAddEdit  = 'container-farm-feed-buy-add-edit';
    const elemIdContFeedBuyItemAddEdit  = 'container-farm-feed-buy-item-add-edit';
    
    const elemIdContProdFeedAddEdit     = 'container-prod-feed-add-edit';
    
    
    const elemIdContAccPigOpsList       = 'container-acc-pig-ops-list';
    const elemIdContAccPigOpsAddEdit    = 'container-acc-pig-ops-add-edit';
    
    
    const elemIdContSupplierAddEdit     = 'container-supplier-add-edit';
    
    
    
    
    
    
    
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

    
    let elemPageContAccDisabled     = null;
    let elemPageContUserDisabled    = null;
    let elemPageContBillUnpaid      = null;
    
    let elemPageContSowBoarList     = null;
    let elemPageContSowBoarAddEdit  = null;
    let elemPageContSowBoarEntry    = null;
    let elemPageContSowBoarDisposed = null;
    
    
    let elemPageContMedVacAddEdit   = null;
    let elemPageContHealthAddEdit   = null;
    let elemPageContNotesAddEdit    = null;
    let elemPageContParentTrace     = null;
        
    let elemPageContProdGestaList   = null;
    let elemPageContProdGestaAdd    = null;
    let elemPageContProdGestaEntry  = null;
        
    let elemPageContProdLactaList   = null;
    let elemPageContProdLactaEntry  = null;
    
    
    let elemPageContFatteningList   = null;
    let elemPageContFatteningAdd    = null;
    let elemPageContFatteningEntry  = null;
        
    let elemPageContProdPigOpsEdit  = null; 
    
    
    let elemPageContFarmFeedBuyList = null;
    let elemPageContFarmFeedBuyAddEdit = null;
    let elemPageContFeedBuyItemAddEdit = null;
    
    let elemPageContProdFeedAddEdit = null;
    
    
    let elemPageContAccPigOpsList   = null;
    let elemPageContAccPigOpsAddEdit = null;
    
    
    let elemPageContSupplierAddEdit = null;
    
    
    this.pageData                   = null;
    
    
    this.dataCompanyApp             = null;
   
    
    this.curScreenIsMobile          = null;
    
    
    this.userControl            = new UserControl(this);
    
    this.toastAlert             = new ToastAlert(this);
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
        elemIdDivContainer:     elemIdContSowBoarList,
        uniqueKey:              'sow-boar'
    });
    
    
    this.pageSowBoarAddEdit     = new PageSowBoarAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarAddEdit,
        uniqueKey:              'sow-boar-add-edit'
    });
   
    
    this.pageSowBoarEntry       = new PageSowBoarEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarEntry,
        uniqueKey:              'sow-boar-entry'
    })
    
    
    this.pageSowBoarDisposed     = new PageSowBoarDisposed({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarDisposed,
        uniqueKey:              'sow-boar-disposed'
    });
    
    
    this.pageMedVacAddEdit      = new PageMedVacAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContMedVacAddEdit,
        uniqueKey:              'medvac-add-edit'
    });
    
    
    this.pageHealthAddEdit      = new PageHealthNotesAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContHealthAddEdit,
        uniqueKey:              'health-add-edit',
        isNotes:                false
    });
    
    
    this.pageNotesAddEdit       = new PageHealthNotesAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContNotesAddEdit,
        uniqueKey:              'notes-add-edit',
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
        uniqueKey:              'prod-gesta-list', // Use for uniqueness in elements
        pageTitle:              'Prod Gestating'
    });
    
    
    this.pageMobLactatingList   = new PageMobGestaLacta({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdLactaList,
        isGesta:                false,
        uniqueKey:              'prod-lacta-list', // Use for uniqueness in elements
        pageTitle:              'Prod Lactating'
    });
    
    
    this.pageProdPigOpsEdit    = new PageProdPigOpsEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdPigOpsEdit,
        uniqueKey:              'prod-pigops-edit'
    });
    
    
    this.pageProdGestatingAdd   = new PageProdGestatingAdd({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    });
    
    
    this.pageProdGestatingEntry = new PageProdGestatingEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaEntry,
        uniqueKey:              'prod-gesta'
    });
    
    
    this.pageProdLactatingEntry = new PageProdLactatingEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdLactaEntry,
        uniqueKey:              'prod-lacta'
    });
    
    
    this.pageProdFatteningList  = new PageProdFatteningList({
        navigation:             this,
        elemIdDivContainer:     elemIdContFatteningList,
        uniqueKey:              'prod-fattening-list',
        pageTitle:              'Fattening'
    });
    
    
    this.pageProdFatteningEntry = new PageProdFatteningEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContFatteningEntry,
        uniqueKey:              'prod-fattening'
    });
    
    
    
    
    this.pagePigFarmFeedBuyList = new TablePigFarmFeedBuy({
        navigation:             this,
        elemIdDivContainer:     elemIdContFarmFeedBuyList,
        uniqueKey:              'farm-feed-buy-list'
    });
    
    
    this.pagePfFeedBuyAddEdit   = new PagePfFeedBuyAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContFarmFeedBuyAddEdit,
        uniqueKey:              'farm-feed-buy-add-edit'
    });
    
    
    this.pagePfFeedBuyItemAddEdit = new PagePfBuyItemAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContFeedBuyItemAddEdit,
        uniqueKey:              'feed-buy-item-add-edit'
    });
    
    
    this.pageProdFeedAddEdit    = new PageProdFeedAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdFeedAddEdit,
        uniqueKey:              'pig-prod-add-edit'
    });
    
    
    
    this.pageAccPigOpsList      = new PageAccPigOpsList({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccPigOpsList,
        uniqueKey:              'acc-pig-ops-list'
    });
    
    
    this.pageAccPigOpsAddEdit   = new PageAccPigOpsAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccPigOpsAddEdit,
        uniqueKey:              'acc-pig-ops-add-edit'
    });
    
    
    this.pageSupplierAddEdit    = new PageCommonSupplierAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
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
        this.pageProdGestatingAdd.init();
        this.pageProdGestatingEntry.init();
        
        
        this.pageMobLactatingList.init();
        this.pageProdLactatingEntry.init();
        
        this.pageProdPigOpsEdit.init();
        
        this.pageProdFatteningList.init();
        this.pageProdFatteningEntry.init();
        
        
        this.pagePigFarmFeedBuyList.init();
        this.pagePfFeedBuyAddEdit.init();
        this.pagePfFeedBuyItemAddEdit.init();
        
        this.pageProdFeedAddEdit.init();
        
        
        this.pageAccPigOpsList.init();
        this.pageAccPigOpsAddEdit.init();
        
        
        this.pageSupplierAddEdit.init();
        
        this.afterHtmlRender();
        
    }
    
    
    this.render = function(){}
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
       
        elemDesktopNavSettings          = document.getElementById('desktop-nav-settings');
        elemDesktopNavSowBoarGilt       = document.getElementById('desktop-nav-sow-boar-gilt');
        elemDesktopNavProduction        = document.getElementById('desktop-nav-production');
        elemDesktopNavOperations        = document.getElementById('desktop-nav-operations');
        elemDesktopNavFinancials        = document.getElementById('desktop-nav-financials');
        elemDesktopNavAccountLists      = document.getElementById('desktop-nav-account-lists');
        elemDesktopNavAdmin             = document.getElementById('desktop-nav-admin');
            
        elemMobileNavSettings           = document.getElementById('mobile-nav-settings');
        elemMobileNavSowBoarGilt        = document.getElementById('mobile-nav-sow-boar-gilt');
        elemMobileNavProduction         = document.getElementById('mobile-nav-production');
        elemMobileNavOperations         = document.getElementById('mobile-nav-operations');
        elemMobileNavFinancials         = document.getElementById('mobile-nav-financials');
        elemMobileNavAccountLists       = document.getElementById('mobile-nav-account-lists');
        elemMobileNavAdmin              = document.getElementById('mobile-nav-admin');


        elemPageContAccDisabled         = document.getElementById(elemIdContAccountDisabled);
        elemPageContUserDisabled        = document.getElementById(elemIdContUserDisabled);
        elemPageContBillUnpaid          = document.getElementById(elemIdContAccountBillUnpaid);
        
                
        elemPageContSowBoarList         = document.getElementById(elemIdContSowBoarList);
        elemPageContSowBoarAddEdit      = document.getElementById(elemIdContSowBoarAddEdit);
        elemPageContSowBoarEntry        = document.getElementById(elemIdContSowBoarEntry);
        elemPageContSowBoarDisposed     = document.getElementById(elemIdContSowBoarDisposed);
        
        
        elemPageContMedVacAddEdit       = document.getElementById(elemIdContMedVacAddEdit);
        elemPageContHealthAddEdit       = document.getElementById(elemIdContHealthAddEdit);
        elemPageContNotesAddEdit        = document.getElementById(elemIdContNotesAddEdit);
        elemPageContParentTrace         = document.getElementById(elemIdContParentTrace);
                
        elemPageContProdGestaList       = document.getElementById(elemIdContProdGestaList);
        elemPageContProdGestaAdd        = document.getElementById(elemIdContProdGestaAdd);
        elemPageContProdGestaEntry      = document.getElementById(elemIdContProdGestaEntry);
                
        elemPageContProdLactaList       = document.getElementById(elemIdContProdLactaList);
        elemPageContProdLactaEntry      = document.getElementById(elemIdContProdLactaEntry);
                
        elemPageContFatteningList       = document.getElementById(elemIdContFatteningList);
        elemPageContFatteningAdd        = document.getElementById(elemIdContFatteningAdd);
        elemPageContFatteningEntry      = document.getElementById(elemIdContFatteningEntry);
                
        elemPageContProdPigOpsEdit      = document.getElementById(elemIdContProdPigOpsEdit);
    
        elemPageContFarmFeedBuyList     = document.getElementById(elemIdContFarmFeedBuyList);
        elemPageContFarmFeedBuyAddEdit  = document.getElementById(elemIdContFarmFeedBuyAddEdit);
        elemPageContFeedBuyItemAddEdit  = document.getElementById(elemIdContFeedBuyItemAddEdit);
        
        elemPageContProdFeedAddEdit     = document.getElementById(elemIdContProdFeedAddEdit);
        
        
        
        
        elemPageContAccPigOpsList       = document.getElementById(elemIdContAccPigOpsList);
        elemPageContAccPigOpsAddEdit    = document.getElementById(elemIdContAccPigOpsAddEdit);
        
        elemPageContSupplierAddEdit     = document.getElementById(elemIdContSupplierAddEdit);
    }
    
    
    this._processAfterHtmlRender = function(){
        this.pageMobGestatingList.pageProdPigOpsEdit = this.pageProdPigOpsEdit;
        this.pageMobLactatingList.pageProdPigOpsEdit = this.pageProdPigOpsEdit;
    
        this.pageMobGestatingList.setNavigation(thisObj);
        this.pageMobLactatingList.setNavigation(thisObj);

        
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
        
        
        const country   = user_current_farm.location.country;

        
        // This waits for the logged in user for user authentication
        // before request
        this.managerAddress.setCurCountry(country);
        
            
        
        this.pigFarm.accountLists.setPigFarmAccountHid(pig_farm_account.account.account.hid);
        
        // Request account feed supplier
        this.pigFarm.accountLists.requestDataSupplier(SUPPLIER_TYPE.FEED);
    }
    
    
    this.setDataCompanyApp = function(data){
        this.dataCompanyApp = data;
        
        const elems = document.getElementsByClassName('product-name');

        
        for (let i = 0; i < elems.length; i++) {
            elems[i].innerHTML = thisObj.dataCompanyApp.product_name;
        }
    }
    
    
    this.setDataUserAccount = function(data){
        this.userControl.setDataUserAccount(data);
        
        this.updatePigFarmName();
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
                return elemPageContSowBoarList;
            }
    
            case PAGE_ID.SOW_BOAR_ADD_EDIT:{
                return elemPageContSowBoarAddEdit;
            }
    
            case PAGE_ID.SOW_BOAR_ENTRY:{
                return elemPageContSowBoarEntry;
            }
    
            case PAGE_ID.SOW_BOAR_DISPOSED:{
                return elemPageContSowBoarDisposed;
            }
    
    
            case PAGE_ID.MEDVAC_ADD_EDIT:{
                return elemPageContMedVacAddEdit;
            }
            
            case PAGE_ID.HEALTH_ADD_EDIT:{
                return elemPageContHealthAddEdit;
            }
            
            case PAGE_ID.NOTES_ADD_EDIT:{
                return elemPageContNotesAddEdit;
            }
            
            case PAGE_ID.TRACE_PARENTS:{
                return elemPageContParentTrace;
            }
            

            
    
            case PAGE_ID.PROD_GESTA_LIST:{
                return elemPageContProdGestaList;
            }
            
            case PAGE_ID.PROD_GESTA_ADD:{
                return elemPageContProdGestaAdd;
            }
            
            case PAGE_ID.PROD_GESTA_ENTRY:{
                return elemPageContProdGestaEntry;
            }
            
            
            case PAGE_ID.PROD_LACTA_LIST:{
                return elemPageContProdLactaList;
            }
            
            case PAGE_ID.PROD_LACTA_ENTRY:{
                return elemPageContProdLactaEntry;
            }
            
            
            case PAGE_ID.PROD_FATTENING_LIST:{
                return elemPageContFatteningList;
            }
            
            case PAGE_ID.PROD_FATTENING_ADD:{
                return elemPageContFatteningAdd;
            }
            
            case PAGE_ID.PROD_FATTENING_ENTRY:{
                return elemPageContFatteningEntry;
            }

            
            
            case PAGE_ID.PROD_PIG_OPS_EDIT:{
                return elemPageContProdPigOpsEdit;
            }
            
            
            
            
            case PAGE_ID.FARM_FEED_BUY_LIST: {
                return elemPageContFarmFeedBuyList;
            }
            
            case PAGE_ID.FARM_FEED_BUY_ADD_EDIT: {
                return elemPageContFarmFeedBuyAddEdit;
            }
            
            case PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT: {
                return elemPageContFeedBuyItemAddEdit;
            }
            
            
            case PAGE_ID.PROD_FEED_ADD_EDIT: {
                return elemPageContProdFeedAddEdit;
            }
            
            
            
            
            
        
            case PAGE_ID.ACC_PIG_OPS_LIST: {
                return elemPageContAccPigOpsList;
            }
            

            case PAGE_ID.ACC_PIG_OPS_ADD_EDIT: {
                return elemPageContAccPigOpsAddEdit;
            }

            
            case PAGE_ID.SUPPLIER_ADD_EDIT:{
                return elemPageContSupplierAddEdit;
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
            

            const pig_farm_account = thisObj.pigFarm.dataPigFarmAccount.account.account;
            const options = {
                account_code:   pig_farm_account.hid,   
                account_name:   pig_farm_account.name   
            }
            thisObj.pageAccountDisabled.beforeShow(options);
            
            // Except
            elemPageContAccDisabled.style.display = 'block';
            
            return;
        }
        
        
        // Check if user is disabled by account
        if (thisObj.userControl.isUserEnabled() == false){
            // Hide all containers
            for (const cur_entry of hidden_containers){
                cur_entry.style.display = 'none';
            }
            
            // Except
            elemPageContUserDisabled.style.display = 'block';
            
            return;
        }
        
        
        // Get current pig Farm
        
        const farm_acc_has_unpaid_bill = thisObj.pigFarm.isPigFarmAccountHasUnpaidBill();
        
        
        // Check if current user is company support, marketing related users
        if (thisObj.userControl.isUserCompanyUser() == false){
            
            if (farm_acc_has_unpaid_bill == true){
            
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
                    elemPageContBillUnpaid.style.display = 'block';
                
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
            
            case 'wean-sow-ops':{
                thisObj._onClickNavAccPigOps(is_mobile, PIG_OPERATION_TYPE.WEANING_SOW);
                break;
            }
            
            case 'gilt-ops':{
                thisObj._onClickNavAccPigOps(is_mobile, PIG_OPERATION_TYPE.GILT);
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
        thisObj.showThisPage(elemPageContAccPigOpsList);
        thisObj.pageAccPigOpsList.show(operation_type);
    }
        
        
    this._onClickNavSowBoar = function(is_mobile, sow_boar_type){
        thisObj.showThisPage(elemPageContSowBoarList);
        
        const options= {
            sow_boar_type: sow_boar_type
        };
        thisObj.pageSowBoarList.show(options);
    }
    
    
    this._onClickNavParentTrace = function(is_mobile){
        thisObj.showThisPage(elemPageContParentTrace);
        thisObj.pageParentTrace.show();
    }
    
    
    this._onClickNavProdGestaLacta = function(is_mobile, operation_type){
        
        if (is_mobile == null){ 
            // If not specified use the last known screen state.
            is_mobile = thisObj.curScreenIsMobile;
        }
        
        
        if (is_mobile){
            if (operation_type == PIG_OPERATION_TYPE.GESTATING){
                thisObj.showThisPage(elemPageContProdGestaList);
                thisObj.pageMobGestatingList.show();
                return;
            }
            
            if ((operation_type == PIG_OPERATION_TYPE.LACTATING_PIGLETS) || 
                (operation_type == PIG_OPERATION_TYPE.LACTATING_SOW)){
                thisObj.showThisPage(elemPageContProdLactaList);
                thisObj.pageMobLactatingList.show();
                return;
            }
        }
    }
    
    
    this._onClickNavProdFattening = function(is_mobile){
        thisObj.showThisPage(elemPageContFatteningList);
        thisObj.pageProdFatteningList.show();
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
        thisObj.showThisPage(elemPageContFarmFeedBuyList);
        thisObj.pagePigFarmFeedBuyList.beforeShow();
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
        thisObj.showThisPage(elemPageContProdGestaAdd);
        
        
        thisObj.pageProdGestatingAdd.show();
    }
    

    this.onClickProdGestatingEntry = function(pig_prod_pid){
        if (pig_prod_pid == null){
            thisObj._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
            return;
        }
        
        
        thisObj.showThisPage(elemPageContProdGestaEntry);
        
        const data_pig_prod_list = thisObj.pigFarm.managerPigProd.dataGestatingList;
        
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
                    pig_prod_type:  PIG_PROD_TYPE.GESTATING,
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
    
    
    this.onClickProdLactatingEntry = function(pig_prod_pid, show_options){
        if (pig_prod_pid == null){
            thisObj._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            return;
        }
        

        thisObj.showThisPage(elemPageContProdLactaEntry);
        
        const data_pig_prod_list = thisObj.pigFarm.managerPigProd.dataLactatingList;
        
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
                    pig_prod_type:  PIG_PROD_TYPE.LACTATING,
                    prev_prod_pid:  prev_prod_pid,
                    next_prod_pid:  next_prod_pid,
                    data_index:     index+1,
                    total_entries:  data_pig_prod_list.length
                };
                
                if (show_options){
                    if (show_options.tab_lacta){
                        options.tab_lacta = show_options.tab_lacta;
                    }
                }
                
                thisObj.pageProdLactatingEntry.show(cur_entry, options);
                return;
            }
        }
        
    }
    
    
    this.onClickProdFatteningEntry = function(pig_prod_pid, show_options){
        if (pig_prod_pid == null){
            thisObj._onClickNavProdFattening(null);
            return;
        }
        

        thisObj.showThisPage(elemPageContFatteningEntry);
        
        const data_pig_prod_list = thisObj.pigFarm.managerPigProd.dataFatteningList;
        
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
                    pig_prod_type:  PIG_PROD_TYPE.FATTENING,
                    prev_prod_pid:  prev_prod_pid,
                    next_prod_pid:  next_prod_pid,
                    data_index:     index+1,
                    total_entries:  data_pig_prod_list.length
                };
                
                if (show_options){
                    
                }
                
                thisObj.pageProdFatteningEntry.show(cur_entry, options);
                return;
            }
        }
        
    }
    
}
