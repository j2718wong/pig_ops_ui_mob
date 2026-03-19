// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        NAV_MENU_GROUP,
        ACC_USER_GROUP,
        PIG_OPERATION_TYPE,
        PAGE_ID,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';


import {ManagerNavLinks}            from './manager_nav_links.js';
import {ManagerPublicSections}      from './manager_public_sections.js';
import {ManagerNavHistory}          from './manager_nav_history.js';

import {ServerError}                from '../common/server_error.js';
import {ToastAlert}                 from '../common/toast_alert.js';
import {MoreModal}                  from '../common/more_modal.js';


import {ManagerAddress}             from '../common/manager_address.js';
import {ManagerPublicData}          from '../common/manager_public_data.js';
import {ManagerRequest}             from '../common/manager_request.js';

import {PigFarm}                    from '../farm_account/pig_farm.js';


import {PageMyAccount}              from '../customer/page_my_account.js';
import {PageCustomerPricing}        from '../customer/page_customer_pricing.js';

import {PageCustomerFeedback}       from '../customer/page_customer_feedback.js';

import {PageAccountDisabled}        from '../a_user_control/page_account_disabled.js';
import {PageUserDisabled}           from '../a_user_control/page_user_disabled.js';
import {PageAccountUnpaidBill}      from '../a_user_control/page_account_unpaid_bill.js';

import {PageHomeDashBoard}          from '../home/page_home_dashboard.js';
import {PagePigFarmAddEdit}         from '../pig_farm/page_pig_farm_add_edit.js';


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

import {PagePigFarmFeedBuyList}     from '../feeds/pig_farm_feed_buy/page_pig_farm_feed_buy_list.js';
import {PagePfFeedBuyAddEdit}       from '../feeds/pig_farm_feed_buy/page_pf_feed_buy_add_edit.js';
import {PagePfBuyItemAddEdit}       from '../feeds/pig_farm_feed_buy/page_pf_feed_buy_item_add_edit.js';

import {PageProdFeedAddEdit}        from '../feeds/prod_feed/page_prod_feed_add_edit.js';
import {PageFeedBalanceAddEdit}     from '../feeds/feed_balance/page_feed_balance_add_edit.js';

import {PageProdHarvestAddEdit}     from '../production/harvest/page_prod_harvest_add_edit.js';

import {PageProdHistoryList}        from '../production/history/page_prod_history_list.js';
import {PageProdNotPregnantList}    from '../production/history/page_prod_not_pregnant_list.js';


import {PageAllFeedBalanceList}     from '../feeds/feed_balance/page_all_feed_balance_list.js';
import {PageAllFeedBalanceAddEdit}  from '../feeds/feed_balance/page_all_feed_balance_add_edit.js';
import {PageProdPigDeadList}        from '../production/pig_dead/page_prod_pig_dead_list.js';
import {PagePigDeadAddEdit}         from '../production/pig_dead/page_pig_dead_add_edit.js';



import {PageProdSalesEntry}         from '../financials/prod_sales/page_prod_sales_entry.js';


import {PageAccOpsSettingsEdit}     from '../acc_pig_ops/page_acc_ops_settings_edit.js';
import {PageAccPigOpsList}          from '../acc_pig_ops/page_acc_pig_ops_list.js';
import {PageAccPigOpsAddEdit}       from '../acc_pig_ops/page_acc_pig_ops_add_edit.js';


import {PageCommonSupplierAddEdit}  from '../supplier/page_common_supplier_add_edit.js';

import {PageUserList}               from '../a_user_control/page_user_list.js';
import {PageAccessCodeList}         from '../a_user_control/page_acc_access_code_list.js';
import {PageAccessCodeAddEdit}      from '../a_user_control/page_acc_access_code_add_edit.js';


function UserControl(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    let elemDesktopUserControl          = null;
    let elemDesktopUserDropdown         = null;
    
    let elemDesktopUserAvatarInitials   = null;
    let elemDesktopUserAvatarInitialsL  = null;
    let elemDesktopUserFullName         = null;
    let elemDesktopUserRole             = null;
    
    let elemDesktopMyAccount            = null;
    let elemDesktopBillNew              = null;
    let elemDesktopBillHistory          = null;
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
        elemDesktopUserLogout           = document.getElementById('desktop-user-logout');
        

    }
    
    
    this._processAfterHtmlRender = function(){
        
        
    }
    
    
    this._bindEventListeners = function(){
        elemDesktopMyAccount.addEventListener('click', function() {
            thisObj.onClickMyAccount();
        });
        
        
        elemDesktopUserLogout.addEventListener('click', function() {
            thisObj.userLogout();
        });

    }
    
    
    this.setDataUserAccount = function(data){
        this.dataUserAccount= data;
        
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
    
    
    this.getCurrentLanguage = function(){
        
    }
    
    
    this.hideNewBillAvailable = function(){
        if (elemDesktopBillNew){
            elemDesktopBillNew.style.display = 'none';
        }
    }
    
    
    this.hideShowBillAvailable = function(){
        if (elemDesktopBillNew){
            elemDesktopBillNew.style.display = 'block';
        }
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
    
    
    this.userLogout = function(){
        // Clear all items from localStorage
        localStorage.clear();
        
        //     
        window.location.href = '/login';
    }

}



export function Navigation(){
    const thisObj               = this;
    
    
    
    
    let elemSubnavSummary       = null;
    
    
    
    
    const elemIdContMyAccount           = 'container-my-account';
    const elemIdContCustomerPricing     = 'container-customer-pricing';
    
    
    const elemIdContAccountDisabled     = 'container-account-disabled';
    const elemIdContUserDisabled        = 'container-user-disabled';
    const elemIdContAccountBillUnpaid   = 'container-account-bill-unpaid';
    
    
    const elemIdContHomeDashBoard       = 'container-dashboard';
    const elemIdContPigFarmAddEdit      = 'container-pig-farm-add-edit';
    
    const elemIdContFeedBackUs          = 'container-feedback-us';
    
    
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
    const elemIdContProdFeedAddEdit     = 'container-prod-feed-add-edit';
    const elemIdContProdHarvestAddEdit  = 'container-prod-harvest-add-edit';
    
    
    const elemIdContProdHistoryList     = 'container-prod-history-list';
    const elemIdContProdHistoryEntry    = 'container-prod-history-entry';
    
    const elemIdContProdNotPregnantList = 'container-prod-not-pregnant-list';
    
    const elemIdContAllFeedBalList      = 'container-all-feed-bal-list';
    const elemIdContAllFeedBalAddEdit   = 'container-all-feed-bal-add-edit';
    
    
    
    const elemIdContFarmFeedBuyList     = 'container-farm-feed-buy-list';
    const elemIdContFarmFeedBuyAddEdit  = 'container-farm-feed-buy-add-edit';
    const elemIdContFeedBuyItemAddEdit  = 'container-farm-feed-buy-item-add-edit';
    
    const elemIdContProdFeedBalAddEdit  = 'container-feed-balance-add-edit';
    
    
    const elemIdContPigDeadList         = 'container-pig-dead-list';
    const elemIdContPigDeadAddEdit      = 'container-pig-dead-add-edit';
    
    
    
    
    const elemIdContProdSalesList       = 'container-prod-sales-list';
    const elemIdContProdSalesEntry      = 'container-prod-sales-entry';
    
    
    const elemIdContAccOpsSettingsEdit  = 'container-acc-ops-settings-edit'; 
    const elemIdContAccPigOpsList       = 'container-acc-pig-ops-list';
    const elemIdContAccPigOpsAddEdit    = 'container-acc-pig-ops-add-edit';
    
    
    const elemIdContSupplierAddEdit     = 'container-supplier-add-edit';
    
    const elemIdContUserList            = 'container-user-list';
    const elemIdContUserAddEdit         = 'container-user-add-edit';
    
    const elemIdContAccessCodeList     = 'container-access-code-list';
    const elemIdContAccessCodeAddEdit  = 'container-access-code-add-edit';
    
    
    
    const elemPageLoading               = document.getElementById('loading-page');
    const elemPageMainContent           = document.getElementById('main-content');
    
    
    
    let elemNavLeftProductName          = null;
    let elemDesktopPigFarmName          = null;
    let elemMobilePigFarmName           = null;
    
    let elemPageContMyAccount           = null;
    let elemPageContCustomerPricing     = null;
    
    let elemPageContHomeDashBoard       = null;
    let elemPageContPigFarmAddEdit      = null;
    
    let elemPageContFeedBackUs          = null;
    
    
    
    let elemPageContAccountDisabled     = null;
    let elemPageContUserDisabled        = null;
    let elemPageContAccountBillUnpaid   = null;
        
    let elemPageContSowBoarList         = null;
    let elemPageContSowBoarAddEdit      = null;
    let elemPageContSowBoarEntry        = null;
    let elemPageContSowBoarDisposed     = null;
        
        
    let elemPageContMedVacAddEdit       = null;
    let elemPageContHealthAddEdit       = null;
    let elemPageContNotesAddEdit        = null;
    let elemPageContParentTrace         = null;
            
    let elemPageContProdGestaList       = null;
    let elemPageContProdGestaAdd        = null;
    let elemPageContProdGestaEntry      = null;
            
    let elemPageContProdLactaList       = null;
    let elemPageContProdLactaEntry      = null;
        
        
    let elemPageContFatteningList       = null;
    let elemPageContFatteningAdd        = null;
    let elemPageContFatteningEntry      = null;
        
    let elemPageContProdPigOpsEdit      = null; 
    let elemPageContProdFeedAddEdit     = null;
    let elemPageContProdHarvestAddEdit  = null;
    
    let elemPageContProdFeedBalAddEdit  = null;
    
    let elemPageContProdHistoryList     = null;
    let elemPageContProdHistoryEntry    = null;
    let elemPageContProdNotPregnantList = null;
    
    let elemPageContAllFeedBalList      = null;
    let elemPageContAllFeedBalAddEdit   = null;
    
    
    let elemPageContPigDeadList         = null;
    let elemPageContPigDeadAddEdit      = null;
    
    
    let elemPageContProdSalesList       = null;
    let elemPageContProdSalesEntry      = null;
    
    let elemPageContFarmFeedBuyList     = null;
    let elemPageContFarmFeedBuyAddEdit  = null;
    let elemPageContFeedBuyItemAddEdit  = null;
    
    
    
    let elemPageContAccOpsSettingsEdit  = null;
    let elemPageContAccPigOpsList       = null;
    let elemPageContAccPigOpsAddEdit    = null;
    
    
    let elemPageContSupplierAddEdit     = null;
    
    
    let elemPageContUserList            = null;
    let elemPageContUserAddEdit         = null;
    
    let elemPageContAccessCodeList     = null;
    let elemPageContAccessCodeAddEdit  = null;
    
    
    let CONTAINER_GROUP_PRODUCTION      = null;
    let CONTAINER_GROUP_SOW_BOAR_GILT   = null;
    let CONTAINER_GROUP_OPERATIONS      = null;
    let CONTAINER_GROUP_FINANCIALS      = null;
    let CONTAINER_GROUP_ACCOUNT_LISTS   = null;
    let CONTAINER_GROUP_SETTINGS        = null;
    let CONTAINER_GROUP_ADMIN           = null;
    
    
    

    this.curScreenIsMobile      = null;
    
    
    // This is the current page on screen that can push into 
    // ManagerNavHistory navHistory stack. 
    // This should be updated in every page show/beforeShow method.
    // It is possible that pageContainer is filled up in navigation
    // and the page data and renderPageFunc is filled up in the actual page.
    this.curPageNavigated       = {
        pageContainer:          null,
        pageData:               null,
        renderPageFunc:         null
    };
    
    
    //this.currentPage            = null;
    
    
    this.managerNavLinks        = new ManagerNavLinks(this);
    this.managerPublicSections  = new ManagerPublicSections(this);
    this.managerNavHistory      = new ManagerNavHistory(this);
    
    this.userControl            = new UserControl(this);
    
    this.toastAlert             = new ToastAlert(this);
    this.serverError            = new ServerError(this);
    
    this.moreModal              = new MoreModal(this);
    
    
    this.managerRequest         = new ManagerRequest(this);
    this.managerAddress         = new ManagerAddress(this);
    this.managerPublicData      = new ManagerPublicData(this)
    this.pigFarm                = new PigFarm(this);
    
    
    
    this.pageMyAccount          = new PageMyAccount({
        navigation:             this,
        elemIdDivContainer:     elemIdContMyAccount
    });
    
    
    this.pageCustomerPricing    = new PageCustomerPricing({
        navigation:             this,
        elemIdDivContainer:     elemIdContCustomerPricing,
        uniqueKey:              'customer-pricing'
    });
    
    
    this.pageCustomerFeedback   = new PageCustomerFeedback({
        navigation:             this,
        elemIdDivContainer:     elemIdContFeedBackUs,
        uniqueKey:              'customer-feedback'
    });
    
    
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
        elemIdDivContainer:     elemIdContAccountBillUnpaid,
        uniqueKey:              'acc-unpaid-bill'
    });
    
    
    
    
    this.pageHomeDashBoard      = new PageHomeDashBoard({
        navigation:             this,
        elemIdDivContainer:     elemIdContHomeDashBoard,
        uniqueKey:              'home-dashboard'
    });
    
    
    this.pagePigFarmAddEdit     = new PagePigFarmAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContPigFarmAddEdit,
        uniqueKey:              'pig-farm-add-edit'
    });
    
    
    
    this.pageSowBoarList        = new PageSowBoarList({
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarList,
        uniqueKey:              'sow-boar-list'
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
    
    
    
    
    this.pagePigFarmFeedBuyList = new PagePigFarmFeedBuyList({
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
        uniqueKey:              'prod-feed-add-edit'
    });
    
    
    this.pageFeedBalanceAddEdit = new PageFeedBalanceAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdFeedBalAddEdit,
        uniqueKey:              'feed-balance-add-edit'
    });
    
    
    this.pageProdHarvestAddEdit = new PageProdHarvestAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdHarvestAddEdit,
        uniqueKey:              'prod-harvest-add-edit'
    });
    
    
    this.pageProdHistoryList    = new PageProdHistoryList({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdHistoryList,
        uniqueKey:              'prod-history-list'
    });
    
    this.pageProdHistoryEntry   = new PageProdFatteningEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdHistoryEntry,
        uniqueKey:              'prod-history-entry',
        isProdHistory:          true
    });
    
    
    this.pageNotPregnantList    = new PageProdNotPregnantList({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdNotPregnantList,
        uniqueKey:              'prod-not-pregnant'
    });
    
    
    this.pageAllFeedBalanceList = new PageAllFeedBalanceList({
        navigation:             this,
        elemIdDivContainer:     elemIdContAllFeedBalList,
        uniqueKey:              'all-feed-balance-list'
    });
    
    
    this.pageAllFeedBalanceAddEdit = new PageAllFeedBalanceAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContAllFeedBalAddEdit,
        uniqueKey:              'all-feed-balance-add-edit'
    
    });
    
    
    this.pagePigDeadList        = new PageProdPigDeadList({
        navigation:             this,
        elemIdDivContainer:     elemIdContPigDeadList,
        uniqueKey:              'pig-dead-list'
    });
    
    
    this.pagePigDeadAddEdit     = new PagePigDeadAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContPigDeadAddEdit,
        uniqueKey:              'pig-dead-add-edit'
    });
    
    
    
    this.pageProdSalesList    = new PageProdHistoryList({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdSalesList,
        uniqueKey:              'prod-sales-list',
        isProdSalesHistory:     true
    });
    
    
    this.pageProdSalesEntry   = new PageProdSalesEntry({
        navigation:             this,
        elemIdDivContainer:     elemIdContProdSalesEntry,
        uniqueKey:              'prod-sales-entry',
        isProdHistory:          true
    });
    
    
    this.pageAccOpsSettingsEdit = new PageAccOpsSettingsEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccOpsSettingsEdit,
        uniqueKey:              'acc-ops-settings-edit'
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
    
    
    this.pageUserList           = new PageUserList({
        navigation:             this,
        elemIdDivContainer:     elemIdContUserList,
        uniqueKey:              'user-list'
    });
    
    
    this.pageAccessCodeList     = new PageAccessCodeList({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccessCodeList,
        uniqueKey:              'access-code-list'
    });
    
    
    this.pageAccessCodeAddEdit  = new PageAccessCodeAddEdit({
        navigation:             this,
        elemIdDivContainer:     elemIdContAccessCodeAddEdit,
        uniqueKey:              'access-code-add-edit'
    });
    
    
    
    
    
    this.init = function(){
        
        // Check if there is a access_token stored
        const bearer_token = localStorage.getItem('access_token');
        
        if (bearer_token){
            this.requestPigFarmData(bearer_token);
        }
        else{
            window.location.href = '/login';
        }
    }
    
    
    
    // This is first request if there is a token saved in client browser
    this.requestPigFarmData = function(bearer_token){
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm/data`;
        
        
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
                
            },
  
            success: function(response){
                if (response.result.num == 0){

                    if (response.data.user_account == null){
                        // Clear all items from localStorage
                        localStorage.clear();
                        
                        // Redirect to /login
                        window.location.href = '/login';
                        
                        return;
                    }
                    
                    
                    const user_account = response.data.user_account;
                    if (user_account.account == null){
                        // Clear all items from localStorage
                        localStorage.clear();
                        
                        // Redirect to /login
                        window.location.href = '/login';
                        
                        return;
                    }
                    
                
                    
                    
                    thisObj.initComponents();
                    thisObj.afterHtmlRender();
                    
                    thisObj.setPageData(response.data);
                    
                    // Hide loading page and show content
                    elemPageLoading.classList.add('fade-out');
                    setTimeout(() => {
                        elemPageLoading.style.display = 'none';
                        //appContent.style.display = 'block';
                    }, 300); // Match fade-out transition time
                                
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                if (jqXHR.status === 401) {
                    window.location.href = '/login';
                }
            }
        });
    }
    
    
    this.initComponents = function(){
        this.managerNavLinks.init();
        this.managerPublicSections.init();
        this.managerNavHistory.init();
        
        this.userControl.init();
        
        this.moreModal.init();
        
        this.pageMyAccount.init();
        this.pageCustomerPricing.init();
        this.pageCustomerFeedback.init();
        
        this.pageAccountDisabled.init();
        this.pageUserDisabled.init();
        this.pageAccountUnpaidBill.init();
        
        
        this.pageHomeDashBoard.init();
        this.pagePigFarmAddEdit.init();
        
        
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
        this.pageFeedBalanceAddEdit.init();
        this.pageProdHarvestAddEdit.init();
        
        
        this.pageProdHistoryList.init();
        this.pageProdHistoryEntry.init();
        this.pageNotPregnantList.init();
        
        
        this.pageAllFeedBalanceList.init();
        this.pageAllFeedBalanceAddEdit.init();
        this.pagePigDeadList.init();
        this.pagePigDeadAddEdit.init();
        
        
        this.pageProdSalesList.init();
        this.pageProdSalesEntry.init();
        
        
        this.pageAccOpsSettingsEdit.init();
        this.pageAccPigOpsList.init();
        this.pageAccPigOpsAddEdit.init();
        
        
        this.pageSupplierAddEdit.init();
        
        
        this.pageUserList.init();
        this.pageAccessCodeList.init();
        this.pageAccessCodeAddEdit.init();
        
    }
    
    
    this.render = function(){}
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        const elemTopNavContainer       = document.querySelector('.top-nav-container');
        elemNavLeftProductName          = elemTopNavContainer.querySelector('.nav-left > .product-name');
        
        elemDesktopPigFarmName          = document.getElementById('pigFarmName');
        elemMobilePigFarmName           = document.getElementById('mobilePigFarmName');
        
        

        elemPageContMyAccount           = document.getElementById(elemIdContMyAccount);
        elemPageContCustomerPricing     = document.getElementById(elemIdContCustomerPricing)
        
        
        elemPageContHomeDashBoard       = document.getElementById(elemIdContHomeDashBoard);
        elemPageContPigFarmAddEdit      = document.getElementById(elemIdContPigFarmAddEdit);
        
        elemPageContFeedBackUs          = document.getElementById(elemIdContFeedBackUs);

        
        elemPageContAccountDisabled     = document.getElementById(elemIdContAccountDisabled);
        elemPageContUserDisabled        = document.getElementById(elemIdContUserDisabled);
        elemPageContAccountBillUnpaid   = document.getElementById(elemIdContAccountBillUnpaid);
        
                
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
        elemPageContProdFeedAddEdit     = document.getElementById(elemIdContProdFeedAddEdit);
        elemPageContProdHarvestAddEdit  = document.getElementById(elemIdContProdHarvestAddEdit);
        
        elemPageContProdFeedBalAddEdit  = document.getElementById(elemIdContProdFeedBalAddEdit);
        
        elemPageContProdHistoryList     = document.getElementById(elemIdContProdHistoryList);
        elemPageContProdHistoryEntry    = document.getElementById(elemIdContProdHistoryEntry);
        
        elemPageContProdNotPregnantList = document.getElementById(elemIdContProdNotPregnantList);
        
        
        elemPageContAllFeedBalList      = document.getElementById(elemIdContAllFeedBalList);
        elemPageContAllFeedBalAddEdit   = document.getElementById(elemIdContAllFeedBalAddEdit);
        elemPageContPigDeadList         = document.getElementById(elemIdContPigDeadList);
        elemPageContPigDeadAddEdit      = document.getElementById(elemIdContPigDeadAddEdit);
        
        elemPageContProdSalesList       = document.getElementById(elemIdContProdSalesList);
        elemPageContProdSalesEntry      = document.getElementById(elemIdContProdSalesEntry);
    
    
    
        elemPageContFarmFeedBuyList     = document.getElementById(elemIdContFarmFeedBuyList);
        elemPageContFarmFeedBuyAddEdit  = document.getElementById(elemIdContFarmFeedBuyAddEdit);
        elemPageContFeedBuyItemAddEdit  = document.getElementById(elemIdContFeedBuyItemAddEdit);
        
        
        
        elemPageContAccOpsSettingsEdit  = document.getElementById(elemIdContAccOpsSettingsEdit);
        elemPageContAccPigOpsList       = document.getElementById(elemIdContAccPigOpsList);
        elemPageContAccPigOpsAddEdit    = document.getElementById(elemIdContAccPigOpsAddEdit);
        
        elemPageContSupplierAddEdit     = document.getElementById(elemIdContSupplierAddEdit);
    
        elemPageContUserList            = document.getElementById(elemIdContUserList);
        
        elemPageContAccessCodeList      = document.getElementById(elemIdContAccessCodeList);
        elemPageContAccessCodeAddEdit   = document.getElementById(elemIdContAccessCodeAddEdit);
        
        
        
        CONTAINER_GROUP_PRODUCTION      = [
            elemPageContProdGestaList,
            elemPageContProdLactaList,
            elemPageContFatteningList,
            elemPageContProdHistoryList,
            elemPageContProdNotPregnantList
        ]; 
        
        
        CONTAINER_GROUP_SOW_BOAR_GILT   = [
            elemPageContSowBoarList,
            elemPageContSowBoarDisposed,
            elemPageContParentTrace
        ];
        
        
        CONTAINER_GROUP_OPERATIONS      = [
            elemPageContAllFeedBalList,
            elemPageContPigDeadList
        ];
        
        
        CONTAINER_GROUP_FINANCIALS      = [
            elemPageContProdSalesList,
            elemPageContFarmFeedBuyList
        ];
        
        
        CONTAINER_GROUP_ACCOUNT_LISTS   = [];
        
        
        CONTAINER_GROUP_SETTINGS        = [
            elemPageContAccOpsSettingsEdit,
            elemPageContAccPigOpsList
        ];
        
        
        CONTAINER_GROUP_ADMIN           = [
            elemPageContUserList,
            elemPageContAccessCodeList
        ];
        
    }
    
    
    this._processAfterHtmlRender = function(){
        this.pageMobGestatingList.pageProdPigOpsEdit = this.pageProdPigOpsEdit;
        this.pageMobLactatingList.pageProdPigOpsEdit = this.pageProdPigOpsEdit;
    
        this.pageMobGestatingList.setNavigation(thisObj);
        this.pageMobLactatingList.setNavigation(thisObj);
    }
    
    
    this._bindEventListeners = function(){
        elemNavLeftProductName.addEventListener('click', function() {
            thisObj.showHomeDashBoard();
        });
        
        
        elemDesktopPigFarmName.addEventListener('click', function() {
            thisObj.showHomeDashBoard();
        });
        
        
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
        
        
        // Listen for back button only
        window.addEventListener('popstate', function(event) {
            console.log('\n\nback pressed', event.state);
        
            if (event.state) {
                // Still in app - handle back navigation
                thisObj.managerNavHistory.onClickBackBtn();
                
                // Re-push state so back works again
                history.pushState({inApp: true}, '', window.location.href);
            } else {
                // No state - user really wants to leave
                // Let them leave
            }
        });
        
    }
    
    
    this.setPageData = function(data){
        
        this.managerPublicSections.setDataCompanyApp(data.application);
        
        
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
        
        
        
        
        // Create initial history entry
        history.pushState({inApp: true}, '', window.location.href);
        console.log('\n\n\nCreated initial history entry');
        
        
        // This is the entry point on page load. The first page must be the dashboard.
        this.curPageNavigated.pageContainer = elemPageContHomeDashBoard;
        
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
        
        elemDesktopPigFarmName.textContent = pig_farm_name;
        elemMobilePigFarmName.textContent = pig_farm_name;
    }
    

    // Will compare current page menu group and next_page menu group.
    // If not same, will push current page to navHistoryList
    // If same will not push.
    this.pushCurrentPageToNavHistory = function(next_page) {
        const cur_page_navigated = thisObj.curPageNavigated;
        
        
        if (next_page){
            const cur_page = cur_page_navigated.pageContainer; 
            const cur_page_nav_menu_group  = thisObj.getNavigationMenuGroup(cur_page);
            const next_page_nav_menu_group = thisObj.getNavigationMenuGroup(next_page);
            
            if (cur_page_nav_menu_group && next_page_nav_menu_group) {
                // Swiping on menu to menu or list to list
                if (cur_page_nav_menu_group == next_page_nav_menu_group){
                    return;
                }
            }
        }
        
        // Swiping on same page container
        if (cur_page_navigated.pageContainer == next_page){
            return;
        }
        
        
        // Push Current navigation.curPageNavigated to navHistoryList
        thisObj.managerNavHistory.pushCurrentPage(
            cur_page_navigated.pageContainer,
            cur_page_navigated.pageData,
            cur_page_navigated.renderPageFunc
        );
    }
    
    
    this.getPageContainer = function(page_id){
        switch(page_id){
            case PAGE_ID.MY_ACCOUNT: {
                return elemPageContMyAccount;
            }
            
            case PAGE_ID.CUSTOMER_PRICING: {
                return elemPageContCustomerPricing;
            } 
            
            case PAGE_ID.HOME: {
                return elemPageContHomeDashBoard;
            }
            
            
            case PAGE_ID.FEEDBACK_US: {
                return elemPageContFeedBackUs;
            }
            
            
            
            
            case PAGE_ID.PIG_FARM_ADD_EDIT:{
                return elemPageContPigFarmAddEdit;
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
            
            
            case PAGE_ID.PROD_FEED_ADD_EDIT: {
                return elemPageContProdFeedAddEdit;
            }
            
            case PAGE_ID.PROD_FEED_BAL_ADD_EDIT: {
                return elemPageContProdFeedBalAddEdit;
            }
            
            
            case PAGE_ID.PROD_HARVEST_ADD_EDIT: {
                return elemPageContProdHarvestAddEdit;
            }

            
            case PAGE_ID.PROD_HISTORY_LIST: {
                return elemPageContProdHistoryList;
            }
            
            case PAGE_ID.PROD_HISTORY_ENTRY: {
                return elemPageContProdHistoryEntry;
            }
            
            case PAGE_ID.PROD_NOT_PREGNANT_LIST: {
                return elemPageContProdNotPregnantList;
            }
            
            
            case PAGE_ID.ALL_FEED_BAL_LIST: {
                return elemPageContAllFeedBalList;
            }
            
            case PAGE_ID.ALL_FEED_BAL_ADD_EDIT: {
                return elemPageContAllFeedBalAddEdit;
            }
            
            
            case PAGE_ID.PIG_DEAD_LIST: {
                return elemPageContPigDeadList;
            }
            
            case PAGE_ID.PIG_DEAD_ADD_EDIT: {
                return elemPageContPigDeadAddEdit;
            }
    
               
            
                
             
            case PAGE_ID.PROD_SALES_LIST: {
                return elemPageContProdSalesList;
                break;
            }
             
            case PAGE_ID.PROD_SALES_ENTRY: {
                return elemPageContProdSalesEntry;
                break;
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
            
            
            
            
            case PAGE_ID.ACC_OPS_SETTINGS_EDIT:{
                return elemPageContAccOpsSettingsEdit;
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
            
            
            
            case PAGE_ID.USER_LIST: {
                return elemPageContUserList;
                break;
            }    
            
            case PAGE_ID.USER_ADD_EDIT: {
                break;
            }

            case PAGE_ID.ACCESS_CODE_LIST: {
                return elemPageContAccessCodeList;
            }
            
            case PAGE_ID.ACCESS_CODE_ADD_EDIT: {
                return elemPageContAccessCodeAddEdit;
            }

               
            
            
            default:{
                return elemPageContHomeDashBoard;
            }
        }
        
        return null;
        
    }
        
        
    this.showThisPage = function(page_container){
        // All navigation menus will use this
        // Be sure the body back ground color is reset to default
        //document.body.style.backgroundColor = '#f5f7fa';
        
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
            elemPageContAccountDisabled.style.display = 'block';
            
            
            // Replace navigation.curPageNavigated
            thisObj.curPageNavigated.pageContainer = elemPageContAccountDisabled;
            
            
            // Since the user account is disabled, clear navHistory
            thisObj.managerNavHistory.clearHistory();
            
            
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
            
            
            // Replace navigation.curPageNavigated
            thisObj.curPageNavigated.pageContainer = elemPageContUserDisabled;
            
            
            // Since the user is disabled, clear navHistory
            thisObj.managerNavHistory.clearHistory();
            
            
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
                    elemPageContAccountBillUnpaid.style.display = 'block';
                
                
                    // Replace navigation.curPageNavigated
                    thisObj.curPageNavigated.pageContainer = elemPageContAccountBillUnpaid;
                    
                    
                    // Need to pay bill, clear navHistory
                    thisObj.managerNavHistory.clearHistory();
                    
                    
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
                
                
                thisObj.curPageNavigated.pageContainer = cur_entry;
                
                
                // Update public sections. 
                if (cur_entry == elemPageContHomeDashBoard){
                    thisObj.managerPublicSections.beforeShow();
                    
                    // Clear History if current page is dashboard
                    thisObj.managerNavHistory.clearHistory();
                    
                }
            }
            else{
                cur_entry.style.display = 'none';
            }
        }
    }
    
    
    this.showHomeDashBoard = function(){
        const next_page = thisObj.getPageContainer(PAGE_ID.HOME);
        thisObj.showThisPage(next_page);
        thisObj.pageHomeDashBoard.show();
    }
    
      
    this._onClickNavOpsSettings = function(is_mobile){
        console.log('_onClickNavOpsSettings not yet implemented; is_mobile=' + is_mobile);
    }
        
    
        
    this._onClickNavSowBoar = function(is_mobile, sow_boar_type){
        const next_page = elemPageContSowBoarList;
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        thisObj.pushCurrentPageToNavHistory(next_page);
        
        
        thisObj.showThisPage(next_page);
        
        const options= {
            sow_boar_type: sow_boar_type
        };
        thisObj.pageSowBoarList.show(options);
    }
    
    
    this._onClickNavParentTrace = function(is_mobile){
        thisObj.showThisPage(elemPageContParentTrace);
        thisObj.pageParentTrace.show();
    }
    
    
    this._onClickNavProdGestaLacta = function(is_mobile, operation_type, 
            check_data_updates){
        
        if (is_mobile == null){ 
            // If not specified use the last known screen state.
            is_mobile = thisObj.curScreenIsMobile;
        }
        else{
            thisObj.curScreenIsMobile = is_mobile;
        }
        
        
        
        if (operation_type == PIG_OPERATION_TYPE.GESTATING){
            if (check_data_updates){
                const callback_success = function(){
                    thisObj.showThisPage(elemPageContProdGestaList);
                    thisObj.pageMobGestatingList.show();
                };
                
                thisObj.pigFarm.managerPigProd.checkIfToUpdateDataPigProdList(
                    callback_success); 
            }
            
            else{
                thisObj.showThisPage(elemPageContProdGestaList);
                thisObj.pageMobGestatingList.show();
            }
            
            return;
        }
        
        if ((operation_type == PIG_OPERATION_TYPE.LACTATING_PIGLETS) || 
            (operation_type == PIG_OPERATION_TYPE.LACTATING_SOW)){
            thisObj.showThisPage(elemPageContProdLactaList);
            thisObj.pageMobLactatingList.show();
            return;
        }
        
    }
    
    
    this._onClickNavProdFattening = function(is_mobile){
        thisObj.showThisPage(elemPageContFatteningList);
        thisObj.pageProdFatteningList.show();
    }
    
    
    this._onClickNavProdHistory = function(is_mobile){
        thisObj.showThisPage(elemPageContProdHistoryList);
        thisObj.pageProdHistoryList.show();
    }
    
    
    this._onClickNavProdNotPregnant = function(is_mobile){
        thisObj.showThisPage(elemPageContProdNotPregnantList);
        thisObj.pageNotPregnantList.show();
    }
    
        
    this._onClickNavFeedBalance = function(is_mobile){
        const next_page = elemPageContAllFeedBalList;
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        thisObj.pushCurrentPageToNavHistory(next_page);
         

        thisObj.showThisPage(next_page);
        thisObj.pageAllFeedBalanceList.show();
    }
        
    
    this._onClickNavPigDead = function(is_mobile){
        const next_page = elemPageContPigDeadList;
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        thisObj.pushCurrentPageToNavHistory(next_page);
        
        
        thisObj.showThisPage(next_page);
        thisObj.pagePigDeadList.show();
    }
    
        
    this._onClickNavReports = function(is_mobile){
        console.log('_onClickNavReports not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this._onClickNavFeedCalculator = function(is_mobile){
        console.log('_onClickNavFeedCalculator not yet implemented; is_mobile=' + is_mobile);
    }
    
    
    this._onClickNavProdSales = function(is_mobile){
        thisObj.showThisPage(elemPageContProdSalesList);
        thisObj.pageProdSalesList.show();
    }
    
        
        
    this._onClickNavFeedsExpenses = function(is_mobile){
        thisObj.showThisPage(elemPageContFarmFeedBuyList);
        thisObj.pagePigFarmFeedBuyList.beforeShow();
    }
        
        
    this._onClickNavNonFeedsExpenses = function(is_mobile){
        console.log('_onClickNavNonFeedsExpenses not yet implemented; is_mobile=' + is_mobile);
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
        
        
    this._onClickNavAccOpsSettings = function(is_mobile){
        thisObj.showThisPage(elemPageContAccOpsSettingsEdit);
        thisObj.pageAccOpsSettingsEdit.show();
    }
    
        
    this._onClickNavAccPigOps = function(is_mobile, operation_type){
        thisObj.showThisPage(elemPageContAccPigOpsList);
        thisObj.pageAccPigOpsList.show(operation_type);
    }
        
    
                    
    this._onClickNavUsers = function(is_mobile){
        thisObj.showThisPage(elemPageContUserList);
        thisObj.pageUserList.show();
    }
        
        
    this._onClickNavAccessCodes = function(is_mobile){
        thisObj.showThisPage(elemPageContAccessCodeList);
        thisObj.pageAccessCodeList.show();
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
 
 
    this.pageContainerToString = function(page_container){
        switch(page_container) {
        
            case elemPageContMyAccount              :{return "PageContMyAccount        ";}
            case elemPageContCustomerPricing        :{return "PageContCustomerPricing  ";}
                                                    
                                                    
            case elemPageContAccountDisabled        :{return "PageContAccountDisabled  ";}
            case elemPageContUserDisabled           :{return "PageContUserDisabled     ";}
            case elemPageContAccountBillUnpaid      :{return "PageContAccountBillUnpaid";}
                                                    
                                                    
            case elemPageContHomeDashBoard          :{return "PageContHomeDashBoard    ";}
            case elemPageContPigFarmAddEdit         :{return "PageContPigFarmAddEdit   ";}
                                                    
            case elemPageContFeedBackUs             :{return "PageContFeedBackUs       ";}
                                                    
                                                    
            case elemPageContSowBoarList            :{return "PageContSowBoarList      ";}
            case elemPageContSowBoarAddEdit         :{return "PageContSowBoarAddEdit   ";}
            case elemPageContSowBoarEntry           :{return "PageContSowBoarEntry     ";}
            case elemPageContSowBoarDisposed        :{return "PageContSowBoarDisposed  ";}
                                                    
                                                    
            case elemPageContMedVacAddEdit          :{return "PageContMedVacAddEdit    ";}
            case elemPageContHealthAddEdit          :{return "PageContHealthAddEdit    ";}
            case elemPageContNotesAddEdit           :{return "PageContNotesAddEdit     ";}
            
            
            case elemPageContParentTrace            :{return "PageContNotesAddEdit     ";}
                
                
            case elemPageContProdGestaList          :{return "PageContProdGestaList      ";}
            case elemPageContProdGestaAdd           :{return "PageContProdGestaAdd       ";}
            case elemPageContProdGestaEntry         :{return "PageContProdGestaEntry     ";}
                                                    
            case elemPageContProdLactaList          :{return "PageContProdLactaList      ";}
            case elemPageContProdLactaEntry         :{return "PageContProdLactaEntry     ";}
                                                    
            case elemPageContFatteningList          :{return "PageContFatteningList      ";}
            case elemPageContFatteningAdd           :{return "PageContFatteningAdd       ";}
            case elemPageContFatteningEntry         :{return "PageContFatteningEntry     ";}
                                                    
                                                    
                                                    
            case elemPageContProdPigOpsEdit         :{return "PageContProdPigOpsEdit     ";}
            case elemPageContProdFeedAddEdit        :{return "PageContProdFeedAddEdit    ";}
            case elemPageContProdHarvestAddEdit     :{return "PageContProdHarvestAddEdit ";}
                                                    
                                                    
            case elemPageContProdHistoryList        :{return "PageContProdHistoryList    ";}
            case elemPageContProdHistoryEntry       :{return "PageContProdHistoryEntry   ";}
                                                    
            case elemPageContProdNotPregnantList    :{return "PageContProdNotPregnantList";}
                                                    
            case elemPageContAllFeedBalList         :{return "PageContAllFeedBalList     ";}
            case elemPageContAllFeedBalAddEdit      :{return "PageContAllFeedBalAddEdit  ";}
            
            
            
            case elemPageContFarmFeedBuyList        :{return "elemPageContFarmFeedBuyList   ";}
            case elemPageContFarmFeedBuyAddEdit     :{return "elemPageContFarmFeedBuyAddEdit";}
            case elemPageContFeedBuyItemAddEdit     :{return "elemPageContFeedBuyItemAddEdit";}
                                                    
            case elemPageContProdFeedBalAddEdit     :{return "elemPageContProdFeedBalAddEdit";}
                                                    
                                                    
            case elemPageContPigDeadList            :{return "elemPageContPigDeadList       ";}
            case elemPageContPigDeadAddEdit         :{return "elemPageContPigDeadAddEdit    ";}
                                                    
                                                    
                                                    
                                                    
            case elemPageContProdSalesList          :{return "elemPageContProdSalesList     ";}
            case elemPageContProdSalesEntry         :{return "elemPageContProdSalesEntry    ";}
                                                    
                                                    
            case elemPageContAccOpsSettingsEdit     :{return "elemPageContAccOpsSettingsEdit";}
            case elemPageContAccPigOpsList          :{return "elemPageContAccPigOpsList     ";}
            case elemPageContAccPigOpsAddEdit       :{return "elemPageContAccPigOpsAddEdit  ";}
                                                    
                                                    
            case elemPageContSupplierAddEdit        :{return "elemPageContSupplierAddEdit   ";}
                                                    
            case elemPageContUserList               :{return "elemPageContUserList          ";}
            case elemPageContUserAddEdit            :{return "elemPageContUserAddEdit       ";}
            
            case elemPageContAccessCodeList         :{return "elemPageContAccessCodeList    ";}
            case elemPageContAccessCodeAddEdit      :{return "elemPageContAccessCodeAddEdit ";}
            
            default:{return null;}
        }
        
        return null;
    }
    
    
    // Will return NAV_MENU_GROUP from a  given page container.
    // Pages that show up on NavLink click in the same group should have same 
    // NAV_MENU_GROUP.
    
    // Example ['Sows', 'Boars', 'Gilts', 'Disposed', 'Parent Trace'] belongs to
    // NAV_MENU_GROUP.SOW_BOAR_GILT;
    this.getNavigationMenuGroup = function(page_container){
        
        if (CONTAINER_GROUP_PRODUCTION.includes(page_container)){
            return NAV_MENU_GROUP.PRODUCTION;
        }
        
        if (CONTAINER_GROUP_SOW_BOAR_GILT.includes(page_container)){
            return NAV_MENU_GROUP.SOW_BOAR_GILT;
        }
        
        if (CONTAINER_GROUP_OPERATIONS.includes(page_container)){
            return NAV_MENU_GROUP.OPERATIONS;
        }
        
        if (CONTAINER_GROUP_FINANCIALS.includes(page_container)){
            return NAV_MENU_GROUP.FINANCIALS;
        }
        
        if (CONTAINER_GROUP_ACCOUNT_LISTS.includes(page_container)){
            return NAV_MENU_GROUP.ACCOUNT_LISTS;
        }
        
        if (CONTAINER_GROUP_SETTINGS.includes(page_container)){
            return NAV_MENU_GROUP.SETTINGS;
        }
        
        if (CONTAINER_GROUP_ADMIN.includes(page_container)){
            return NAV_MENU_GROUP.ADMIN;
        }
        
        return null;
    }
}
