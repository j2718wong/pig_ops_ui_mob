// navigation.js

// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        SERVER_CONNECTION,
        NAV_MENU_GROUP,
        ACC_USER_GROUP,
        PIG_OPERATION_TYPE,
        PAGE_ID,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';


import {NavPageContainers}          from './nav_page_containers.js';

import {ManagerNavLinks}            from './manager_nav_links.js';
import {ManagerPublicSections}      from './manager_public_sections.js';
import {ManagerNavHistory}          from './manager_nav_history.js';

import {ManagerApplicationData}     from './manager_application_data.js';
import {ManagerTranslations}        from './manager_translations.js';
import {ManagerAddress}             from '../common/manager_address.js';
import {ManagerPublicData}          from '../common/manager_public_data.js';

import {ManagerBusiness}            from '../business/manager_business.js';

import {ManagerSystem}              from './manager_system.js';
import {ManagerLocalData}           from './manager_local_data.js';
import {ManagerAlerts}              from './manager_alerts.js';

import {UserControl}                from './user_control.js';


import {ServerError}                from '../common/server_error.js';
import {ToastAlert}                 from '../common/toast_alert.js';
import {MoreModal}                  from '../common/more_modal.js';



import {Account}                    from '../farm_account/account.js';
import {PigFarm}                    from '../farm_account/pig_farm.js';


import {PageMyAccount}              from '../customer/page_my_account.js';
import {PageCustomerPricing}        from '../customer/page_customer_pricing.js';
import {PageAccountNewBill}         from '../business/page_account_new_bill.js';
import {PageUserSettings}           from '../customer/page_user_settings.js';
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
import {PageProdFatteningAdd}       from '../production/fattening/page_fattening_add.js'

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

import {PageFeedsConsumedChart}     from '../feeds/page_feeds_consumed_chart.js';

import {PageFarrowingSchedule}      from '../pig_farm/page_farrowing_schedule.js';

import {PageProdPigDeadList}        from '../production/pig_dead/page_prod_pig_dead_list.js';
import {PagePigDeadAddEdit}         from '../production/pig_dead/page_pig_dead_add_edit.js';

import {PageAccFarrowChecklist}     from '../acc_farrow_checklist/page_acc_farrow_checklist.js';
import {PageAccFChecklistAddEdit}   from '../acc_farrow_checklist/page_acc_f_checklist_add_edit.js';


import {PageSummaryReportList}      from '../reports/page_summary_report_list.js';
import {PageSummaryReportAdd}       from '../reports/page_summary_report_add.js';

import {PageBoarExternalMateList}   from '../sow_boar/boar_external_mate/page_boar_external_mate_list.js'
import {PageBoarExtMateAddEdit}     from '../sow_boar/boar_external_mate/page_boar_ext_mate_add_edit.js'


import {PageProdSalesEntry}         from '../financials/prod_sales/page_prod_sales_entry.js';


import {PageAccOpsSettingsEdit}     from '../acc_pig_ops/page_acc_ops_settings_edit.js';
import {PageAccPigOpsList}          from '../acc_pig_ops/page_acc_pig_ops_list.js';
import {PageAccPigOpsAddEdit}       from '../acc_pig_ops/page_acc_pig_ops_add_edit.js';


import {PageCommonSupplierAddEdit}  from '../supplier/page_common_supplier_add_edit.js';

import {PageUserList}               from '../admin/page_user_list.js';
import {PageAccessCodeList}         from '../admin/page_acc_access_code_list.js';
import {PageAccessCodeAddEdit}      from '../admin/page_acc_access_code_add_edit.js';

import {PageSystemStats}            from '../system/page_system_stats.js';

import {getLocationWithFallback}    from '../../utils.js';


export function Navigation(){
    const thisObj               = this;


    this.STORAGE_KEY            = 'superpig_navigation';

    const elemPageLoading       = document.getElementById('loading-page');
    

    let elemNavLeftProductName  = null;
    let elemDesktopPigFarmName  = null;
    let elemMobilePigFarmName   = null;
    
    let elemDebugWindow         = null;
    
    let dataApplication         = null;

    // Timestamp when the last pig farm data is requested from server
    let tsLastReqPigFarmData    = null;

    
    this.elemDebugWindow        = null;
    
    
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
    

    
    this.pageContainers         = new NavPageContainers(this);
    
    
    this.managerNavLinks        = new ManagerNavLinks(this);
    this.managerPublicSections  = new ManagerPublicSections(this);
    this.managerNavHistory      = new ManagerNavHistory(this);
    
    this.managerApplicationData = new ManagerApplicationData(this);
    this.managerTranslations    = new ManagerTranslations(this);
    this.managerAddress         = new ManagerAddress(this);
    this.managerPublicData      = new ManagerPublicData(this);
    
    this.managerBusiness        = new ManagerBusiness(this);
    
    this.managerSystem          = new ManagerSystem(this);
    this.managerLocalData       = new ManagerLocalData(this);
    this.managerAlerts          = new ManagerAlerts(this);
    
    
    this.userControl            = new UserControl(this);
    
    this.toastAlert             = new ToastAlert(this);
    this.serverError            = new ServerError(this);
    
    this.moreModal              = new MoreModal(this);
    
    
    this.account                = new Account(this);
    this.pigFarm                = new PigFarm(this);
    
    
    
    
    this.getTranslations = function(){
        return thisObj.managerTranslations.getTranslations(); 
    }
    
    
    this.pageMyAccount          = new PageMyAccount({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.MY_ACCOUNT)
    });


    this.pageCustomerPricing    = new PageCustomerPricing({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.CUSTOMER_PRICING),
        uniqueKey:              'customer-pricing'
    });


    this.pageCustomerFeedback   = new PageCustomerFeedback({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.FEEDBACK_US),
        uniqueKey:              'customer-feedback'
    });

    
    this.pageAccountNewBill     = new PageAccountNewBill({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.BILL_NEW),
        uniqueKey:              'customer-bill-new'
    });

    
    this.pageUserSettings       = new PageUserSettings({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.USER_SETTINGS),
        uniqueKey:              'user-settings'
    });
    



    this.pageAccountDisabled    = new PageAccountDisabled({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACCOUNT_DISABLED)
    });


    this.pageUserDisabled       = new PageUserDisabled({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.USER_DISABLED)
    });


    this.pageAccountUnpaidBill  = new PageAccountUnpaidBill({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACCOUNT_BILL_UNPAID),
        uniqueKey:              'acc-unpaid-bill'
    });




    this.pageHomeDashBoard      = new PageHomeDashBoard({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.HOME),
        uniqueKey:              'home-dashboard'
    });


    this.pagePigFarmAddEdit     = new PagePigFarmAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PIG_FARM_ADD_EDIT),
        uniqueKey:              'pig-farm-add-edit'
    });



    this.pageSowBoarList        = new PageSowBoarList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SOW_BOAR_LIST),
        uniqueKey:              'sow-boar-list'
    });


    this.pageSowBoarAddEdit     = new PageSowBoarAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SOW_BOAR_ADD_EDIT),
        uniqueKey:              'sow-boar-add-edit'
    });


    this.pageSowBoarEntry       = new PageSowBoarEntry({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SOW_BOAR_ENTRY),
        uniqueKey:              'sow-boar-entry'
    })


    this.pageSowBoarDisposed     = new PageSowBoarDisposed({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SOW_BOAR_DISPOSED),
        uniqueKey:              'sow-boar-disposed'
    });


    this.pageMedVacAddEdit      = new PageMedVacAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.MEDVAC_ADD_EDIT),
        uniqueKey:              'medvac-add-edit'
    });


    this.pageHealthAddEdit      = new PageHealthNotesAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.HEALTH_ADD_EDIT),
        uniqueKey:              'health-add-edit',
        isNotes:                false
    });


    this.pageNotesAddEdit       = new PageHealthNotesAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.NOTES_ADD_EDIT),
        uniqueKey:              'notes-add-edit',
        isNotes:                true
    });


    this.pageParentTrace        = new PageParentTrace({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.TRACE_PARENTS)
    });



    this.pageMobGestatingList   = new PageMobGestaLacta({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_GESTA_LIST),
        isGesta:                true,
        uniqueKey:              'prod-gesta-list', 
        pageTitle:              'Prod Gestating'
    });


    this.pageMobLactatingList   = new PageMobGestaLacta({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_LACTA_LIST),
        isGesta:                false,
        uniqueKey:              'prod-lacta-list', 
        pageTitle:              'Prod Lactating'
    });


    this.pageProdPigOpsEdit    = new PageProdPigOpsEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_PIG_OPS_EDIT),
        uniqueKey:              'prod-pigops-edit'
    });


    this.pageProdGestatingAdd   = new PageProdGestatingAdd({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_GESTA_ADD),
        uniqueKey:              'prod-add-gesta'
    });


    this.pageProdGestatingEntry = new PageProdGestatingEntry({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_GESTA_ENTRY),
        uniqueKey:              'prod-gesta'
    });


    this.pageProdLactatingEntry = new PageProdLactatingEntry({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_LACTA_ENTRY),
        uniqueKey:              'prod-lacta'
    });


    this.pageProdFatteningList  = new PageProdFatteningList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_FATTENING_LIST),
        uniqueKey:              'prod-fattening-list',
        pageTitle:              'Fattening'
    });


    this.pageProdFatteningEntry = new PageProdFatteningEntry({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_FATTENING_ENTRY),
        uniqueKey:              'prod-fattening-entry'
    });

    
    
    this.pageProdFatteningAdd   = new PageProdFatteningAdd({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_FATTENING_ADD),
        uniqueKey:              'prod-fattening-add'
    });
    

    

    this.pageProdFeedAddEdit    = new PageProdFeedAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_FEED_ADD_EDIT),
        uniqueKey:              'prod-feed-add-edit'
    });


    this.pageFeedBalanceAddEdit = new PageFeedBalanceAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_FEED_BAL_ADD_EDIT),
        uniqueKey:              'feed-balance-add-edit'
    });


    this.pageProdHarvestAddEdit = new PageProdHarvestAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_HARVEST_ADD_EDIT),
        uniqueKey:              'prod-harvest-add-edit'
    });


    this.pageProdHistoryList    = new PageProdHistoryList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_HISTORY_LIST),
        uniqueKey:              'prod-history-list'
    });


    this.pageProdHistoryEntry   = new PageProdFatteningEntry({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_HISTORY_ENTRY),
        uniqueKey:              'prod-history-entry',
        isProdHistory:          true
    });


    this.pageNotPregnantList    = new PageProdNotPregnantList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_NOT_PREGNANT_LIST),
        uniqueKey:              'prod-not-pregnant'
    });
    
    
    
    
    this.pageAllFeedBalanceList = new PageAllFeedBalanceList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ALL_FEED_BAL_LIST),
        uniqueKey:              'all-feed-balance-list'
    });

    this.pageAllFeedBalanceAddEdit = new PageAllFeedBalanceAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ALL_FEED_BAL_ADD_EDIT),
        uniqueKey:              'all-feed-balance-add-edit'

    });

    this.pageFarrowingSchedule = new PageFarrowingSchedule({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.FARROWING_SCHEDULE),
        uniqueKey:              'farrowing-schedule'
    });
    
    
    this.pageBoarExtMateList    = new PageBoarExternalMateList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.BOAR_EXT_MATE_LIST),
        uniqueKey:              'boar-ext-mate-list'
    });

    this.pageBoarExtMateAddEdit = new PageBoarExtMateAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.BOAR_EXT_MATE_ADD_EDIT),
        uniqueKey:              'boar-ext-mate-add-edit'
    });

    this.pagePigDeadList        = new PageProdPigDeadList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PIG_DEAD_LIST),
        uniqueKey:              'pig-dead-list'
    });


    this.pagePigDeadAddEdit     = new PagePigDeadAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PIG_DEAD_ADD_EDIT),
        uniqueKey:              'pig-dead-add-edit'
    });

    this.pageAccFarrowChecklist = new PageAccFarrowChecklist({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACC_FARROW_CHECKLIST),
        uniqueKey:              'acc-farrow-checklist'
    });
    
    this.pageAccFChecklistAddEdit = new PageAccFChecklistAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACC_F_CHECKLIST_ADD_EDIT),
        uniqueKey:              'acc-f-checklist-add-edit'
    });

    


    this.pageProdSalesList    = new PageProdHistoryList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_SALES_LIST),
        uniqueKey:              'prod-sales-list',
        isProdSalesHistory:     true
    });

    this.pageProdSalesEntry   = new PageProdSalesEntry({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.PROD_SALES_ENTRY),
        uniqueKey:              'prod-sales-entry',
        isProdHistory:          true
    });

    this.pagePigFarmFeedBuyList = new PagePigFarmFeedBuyList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.FARM_FEED_BUY_LIST),
        uniqueKey:              'farm-feed-buy-list'
    });

    this.pagePfFeedBuyAddEdit   = new PagePfFeedBuyAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.FARM_FEED_BUY_ADD_EDIT),
        uniqueKey:              'farm-feed-buy-add-edit'
    });

    this.pagePfFeedBuyItemAddEdit = new PagePfBuyItemAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT),
        uniqueKey:              'feed-buy-item-add-edit'
    });

    this.pageFeedsConsumedChart  = new PageFeedsConsumedChart({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.FEEDS_CONSUMED),
        uniqueKey:              'feeds-consumed'
    });

    this.pageSummaryReportList = new PageSummaryReportList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SUMMARY_REPORT_LIST),
        uniqueKey:              'summary-report-list'
    });
    
    this.pageSummaryReportAdd   = new PageSummaryReportAdd({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SUMMARY_REPORT_ADD_EDIT),
        uniqueKey:              'summary-report-add'
    });




    this.pageAccOpsSettingsEdit = new PageAccOpsSettingsEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACC_OPS_SETTINGS_EDIT),
        uniqueKey:              'acc-ops-settings-edit'
    });


    this.pageAccPigOpsList      = new PageAccPigOpsList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACC_PIG_OPS_LIST),
        uniqueKey:              'acc-pig-ops-list'
    });


    this.pageAccPigOpsAddEdit   = new PageAccPigOpsAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACC_PIG_OPS_ADD_EDIT),
        uniqueKey:              'acc-pig-ops-add-edit'
    });


    this.pageSupplierAddEdit    = new PageCommonSupplierAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SUPPLIER_ADD_EDIT),
        uniqueKey:              'supplier-add-edit'
    });


    this.pageUserList           = new PageUserList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.USER_LIST),
        uniqueKey:              'user-list'
    });


    this.pageAccessCodeList     = new PageAccessCodeList({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACCESS_CODE_LIST),
        uniqueKey:              'access-code-list'
    });


    this.pageAccessCodeAddEdit  = new PageAccessCodeAddEdit({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.ACCESS_CODE_ADD_EDIT),
        uniqueKey:              'access-code-add-edit'
    });
    
    
    this.pageSystemStats        = new PageSystemStats({
        navigation:             this,
        elemIdDivContainer:     this.pageContainers.getPageContainerId(PAGE_ID.SYSTEM_STATS),
        uniqueKey:              'system-stats'
    });
    
    
    
    // Helper function to get language parameter for URLs
    function getLanguageParam() {
        // First check URL parameters (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        let lang = urlParams.get('lang');
        
        // If not in URL, check localStorage
        if (!lang) {
            lang = localStorage.getItem('user_language');
        }
        
        console.log('getLanguageParam - lang found:', lang);
        
        // Return properly formatted parameter
        if (lang && lang !== 'default' && lang !== 'null' && lang !== 'undefined') {
            // Make sure it's a valid language code (like 'bis', 'en', etc.)
            if (lang === 'bis' || lang === 'en' || lang === 'ph') {
                return '?lang=' + lang;
            }
        }
        return '';
    }
    
    
    this.init = function(){
        // Note: this is ony viewable if user is SUPER_ADMIN
        // By default this displayed none;
        elemDebugWindow             = document.getElementById('debug-window');
        
        this.elemDebugWindow        = elemDebugWindow;
        
        
        // Check if there is a access_token stored
        const bearer_token  = thisObj.managerSystem.getTokenFromAnyStorage(); 
        const local_data    = thisObj.managerLocalData.getSavedLocalData();
        
        
        // IMMEDIATE OFFLINE CHECK - Don't wait for connectionTest
        if (!navigator.onLine) {

            const msg = 'OFFLINE MODE DETECTED - Loading from cache immediately\n';
            console.log(msg);

            if (bearer_token) {
                console.log('Test Offline 1');
                
                // Load everything from storage
                thisObj.initComponents();
                thisObj.afterHtmlRender();
                thisObj.managerSystem.showMsgOffline();
                thisObj.managerLocalData.loadDataFromStorageToApp(local_data);
                
                // Hide loading and show dashboard
                elemPageLoading.classList.add('fade-out');
                setTimeout(() => {
                    elemPageLoading.style.display = 'none';
                }, 300);


                thisObj.showHomeDashBoard();
                return; // Exit early
            } else {
                // No token, can't do anything offline
                const langParam = getLanguageParam();
                window.location.href = '/login' + langParam;
                return;
            }
        }
        
        
        // Check if there is a connection to server
        // ONLINE: Do full check
        this.managerSystem.connectionTest(function(status){
            console.log('Connection test results:', status);
            
            
            // Check if we have a token and can access it
            const hasToken = bearer_token !== null && bearer_token !== undefined && bearer_token !== "";
            
            if (!status.hasInternet || !status.serverReachable) {
                console.log('Limited connectivity - trying offline mode');
                
                thisObj.elemDebugWindow.style.display = 'block';
                thisObj.elemDebugWindow.textContent += 'Test Offline 2';
                
                if (hasToken) {
                    // Try offline mode
                    thisObj.initComponents();
                    thisObj.afterHtmlRender();
                    
                    if (!status.serverReachable) {
                        thisObj.managerSystem.showMsgOffline();
                    }
                    
                    thisObj.managerLocalData.loadDataFromStorageToApp(local_data);
                    
                    elemPageLoading.classList.add('fade-out');
                    setTimeout(() => {
                        elemPageLoading.style.display = 'none';
                    }, 300);
                    
                    thisObj.showHomeDashBoard();
                } else {
                    // No token, redirect to login
                    const langParam = getLanguageParam();
                    window.location.href = '/login' + langParam;
                }
            } else {
                // Full online mode
                console.log('Full online mode');
                
                if (hasToken) {
                    thisObj.requestInitialPigFarmData(bearer_token);
                }
                else{
                    const langParam = getLanguageParam();
                    window.location.href = '/login' + langParam;
                }
            }
        });
    }
    

    
    // This is first request if there is a token saved in client browser
    this.requestInitialPigFarmData = async function(bearer_token){
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm/data`;
        
        
        // Get location and viewport data
        const viewport_width    = window.innerWidth;
        const viewport_height   = window.innerHeight;
        let locationData        = await getLocationWithFallback();
        
        
        const post_data = { 
            viewport_width:     viewport_width,
            viewport_height:    viewport_height,
            
            login_country_code: locationData.login_country_code,
            login_country_name: locationData.login_country_name,
            login_city:         locationData.login_city,
            login_region:       locationData.login_region
        };
        
        
        
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
                    
                    if (response.data.user_account == null){
                        // Clear all items from localStorage
                        localStorage.clear();
                        
                        // Redirect to /login with language preservation
                        const langParam = getLanguageParam();
                        window.location.href = '/login' + langParam;
                        
                        return;
                    }
                    
                    
                    // The user has no account or removed from account;
                    const user_account = response.data.user_account;
                    if (user_account.account == null){
                        // Clear all items from localStorage
                        localStorage.clear();
                        
                        // Redirect to /login with language preservation
                        const langParam = getLanguageParam();
                        window.location.href = '/login' + langParam;
                        
                        return;
                    }
                    
                    
                    
                    // The data.initial_farm_data is normally  not null.
                    // This can be null from these cases.
                    // 
                    // 1.) The user creates an account, but did not 
                    //  finish creating a pig_farm. And the user refreshes the page.
                    //  So the User at this time has an  user_id and account_id
                    //  which are all valid. At this point also the user 
                    // access_token is already saved in storage.
                    // The user in this case is cleary a farm owner not staff
                    // since was able to create account.
                    //
                    // In this case the user should go back to the registration 
                    // page where to input first pig farm. 
                    //  
                    // 2.) The user was previously assigned to a pig_farm now, 
                    //  but that assignment is revoke or deleted? There is no  
                    //  business rule for this case. The proper way to remove 
                    //  a user from account is
                    //
                    //      - remove user from pig_farm user list 
                    //          (the user account will be set to null)
                    //          The previous assignment of pig_farm to user is not deleted.
                    //
                    //      - revoke the access_code of the user (
                    //          the user account will be set to null
                    //          and the access token becomes invalid); 
                    const initial_farm_data = response.data.initial_farm_data;
                    
                    if (initial_farm_data == null){
                        window.location.href = "/login?state=NF";
                        return;
                    }
                    
                    
                    
                    // At this point, the response.data is valid;
                    tsLastReqPigFarmData = Math.floor(Date.now() / 1000);
                    
                   
                    // The user is already logged in at this point
                    window.SUPERPIG_LOGGED_IN = true;
                    
                    
                    thisObj.initComponents();
                    thisObj.afterHtmlRender();
                    
                    
                    // Hide message offline
                    thisObj.managerSystem.hideMsgOffline();
                    
                    
                    // Set PageData
                    thisObj.setPageData(response.data);
                    
                    // Hide loading page and show content
                    elemPageLoading.classList.add('fade-out');
                    setTimeout(() => {
                        elemPageLoading.style.display = 'none';
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
        this.managerSystem.init();
        this.managerAlerts.init();
        
        
        this.userControl.init();
        
        this.moreModal.init();
        
        this.pageMyAccount.init();
        this.pageCustomerPricing.init();
        this.pageAccountNewBill.init();
        this.pageUserSettings.init();
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
        this.pageProdFatteningAdd.init();
        
        this.pagePigFarmFeedBuyList.init();
        this.pagePfFeedBuyAddEdit.init();
        this.pagePfFeedBuyItemAddEdit.init();
        
        this.pageProdFeedAddEdit.init();
        this.pageFeedBalanceAddEdit.init();
        this.pageProdHarvestAddEdit.init();
        
        
        this.pageProdHistoryList.init();
        this.pageProdHistoryEntry.init();
        this.pageNotPregnantList.init();
        
        this.pageFarrowingSchedule.init();
        
        this.pageBoarExtMateList.init();
        this.pageBoarExtMateAddEdit.init();
        
        this.pagePigDeadList.init();
        this.pagePigDeadAddEdit.init();
        
        
        this.pageAccFarrowChecklist.init();
        this.pageAccFChecklistAddEdit.init();
        
        
        this.pageProdSalesList.init();
        this.pageProdSalesEntry.init();
        
        this.pageAllFeedBalanceList.init();
        this.pageAllFeedBalanceAddEdit.init();
        
        this.pageFeedsConsumedChart.init();
        
        this.pageSummaryReportList.init();
        this.pageSummaryReportAdd.init();
        
        
        
        this.pageAccOpsSettingsEdit.init();
        this.pageAccPigOpsList.init();
        this.pageAccPigOpsAddEdit.init();
        
        
        this.pageSupplierAddEdit.init();
        
        
        this.pageUserList.init();
        this.pageAccessCodeList.init();
        this.pageAccessCodeAddEdit.init();
        
        this.pageSystemStats.init();
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
        
        
        this.pageContainers.findElements();
    }
    
    
    this._processAfterHtmlRender = function(){
        this.pageMobGestatingList.pageProdPigOpsEdit = this.pageProdPigOpsEdit;
        this.pageMobLactatingList.pageProdPigOpsEdit = this.pageProdPigOpsEdit;
    
        this.pageMobGestatingList.setNavigation(thisObj);
        this.pageMobLactatingList.setNavigation(thisObj);
        
        // skip next steps if offline
        if (!navigator.onLine){
            return;
        }
        
        this.autoUpdateServiceWorker();
        this.setNotificationsData();
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
    
    
    this.getDataToSaveToStorage = function(){
        return {
            tsLastReqPigFarmData:   tsLastReqPigFarmData,
            dataApplication:        dataApplication
        }
    }
    
    
    
    this.saveToStorage = function() {
        const data = thisObj.getDataToSaveToStorage();
        localStorage.setItem(thisObj.STORAGE_KEY, JSON.stringify(data));
    }


    
    this.loadDataFromStorage = function(data){
        tsLastReqPigFarmData    = data.tsLastReqPigFarmData;

    }
    
    
    /**
     * This is used in processing result of navigation.requestInitialPigFarmData();
     * 
     * */
    this.setPageData = function(data){
        
        console.log('\n\nEntryPoint setPageData');
        console.log(data);
        
        
        // Set Data application 
        this.setDataApplication(data.application);
        
        
        // Set UserAccount
        this.setDataUserAccount(data.user_account);
        
        
        // Set Pig Farm
        const user_current_farm = this.userControl.getCurrentFarm();
        this.pigFarm.setDataPigFarm(user_current_farm);

        
        const callback_after_init = function(){
            thisObj.showHomeDashBoard();
        };

        
        // The initial_farm_data is the data coming from server;
        // This is broken down into several list as each list maybe updated
        // by user independently.
        const initial_farm_data = data.initial_farm_data;
        this.pigFarm.initializeFarmData(initial_farm_data, callback_after_init);
        
        
        
        // Will continue to set these even while the dashboard is shown; 
        
        const country   = user_current_farm.location.country;

        
        // This waits for the logged in user for user authentication
        // before request
        this.managerAddress.setCurCountry(country);
        
            
        const account_hid = initial_farm_data.account.account.hid;
        this.pigFarm.accountLists.setPigFarmAccountHid(account_hid);
        
        // Create initial history entry
        history.pushState({inApp: true}, '', window.location.href);
        console.log('\n\n\nCreated initial history entry');
        
        const container_home = thisObj.pageContainers.getPageContainer(PAGE_ID.HOME);
        
        // This is the entry point on page load. The first page must be the dashboard.
        this.curPageNavigated.pageContainer = container_home;
        
        
        // More nav links visibility after user is set
        this.managerNavLinks.showHideNavLinksAfterUserSet();
        
        
        // Load account pig_ops
        this.pageAccPigOpsList.loadDataFromStorage();
        
        
        
    }


    this.setDataApplication = function(data_application){
        // Save this
        dataApplication = data_application;
        this.saveToStorage();
        
        
        // Set DataCompanyApp
        this.managerApplicationData.setDataCompanyApp(data_application);
        this.managerPublicSections.setDataCompanyApp(data_application);
    }


    this.setDataUserAccount = function(data_user_account){
        this.userControl.setDataUserAccount(data_user_account);
        this.updatePigFarmName();
        
        
        // Set Account; this will be read from data.user_account.account
        this.account.setAccount(data_user_account.account);
    }


    this.updatePigFarmName = function() {
        // Set Farm name
        const cur_user_farm = thisObj.userControl.getCurrentFarm();
        const pig_farm_name = cur_user_farm.pig_farm.name;
        
        if (this.elemDebugWindow){
            this.elemDebugWindow.textContent += `pig_farm_name= ${pig_farm_name}\n`;
        }
        
        elemDesktopPigFarmName.textContent = pig_farm_name;
        elemMobilePigFarmName.textContent = pig_farm_name;
        
        if (!elemDesktopPigFarmName){
            console.log('No elemDesktopPigFarmName');
        }
        else{
            console.log('elemDesktopPigFarmName is set');
        }
        
        if (!elemMobilePigFarmName){
            console.log('No elemMobilePigFarmName');
        }
        else{
            console.log('elemMobilePigFarmName is set');
        }
        
    }
    

    // Will compare current page menu group and next_page menu group.
    // If not same, will push current page to navHistoryList
    // If same will not push.
    this.pushCurrentPageToNavHistory = function(next_page) {
        const cur_page_navigated = thisObj.curPageNavigated;
        
        
        if (next_page){
            const cur_page = cur_page_navigated.pageContainer; 
            const cur_page_nav_menu_group  = thisObj.pageContainers.getNavigationMenuGroup(cur_page);
            const next_page_nav_menu_group = thisObj.pageContainers.getNavigationMenuGroup(next_page);
            
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
        return thisObj.pageContainers.getPageContainer(page_id);
    }
        
       
    this.getPageIdFromContainer = function(page_container) {
        return thisObj.pageContainers.getPageIdFromContainer(page_container);
    };
        
        
    this.showThisPage = function(page_container){

        const container_home    = thisObj.pageContainers.getPageContainer(PAGE_ID.HOME);
        const hidden_containers = thisObj.pageContainers.hiddenContainers;
        
        
        
        // Perform user and account control checks.
        
        // Check if user.account is disabled
        if (thisObj.userControl.isUserAccountEnabled() == false){
            // Hide all containers
            for (const cur_entry of hidden_containers){
                cur_entry.style.display = 'none';
            }
            

            const pig_farm_account = thisObj.pigFarm.dataPigFarmAccount.account;
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
                if (cur_entry == container_home){
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
    
    
    this.autoUpdateServiceWorker = function(){
        
        // Skip if offline
        if (!navigator.onLine) {
            console.log('Offline - skipping service worker update check');
            return;
        }
        
        if ('serviceWorker' in navigator) {
            const currentVersion = window.APP_VERSION;
            const reloadedVersion = sessionStorage.getItem('sw_reloaded_version');
            
            // Only auto-reload once per version
            if (reloadedVersion === currentVersion) {
                return;
            }
            
            navigator.serviceWorker.ready.then(registration => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            sessionStorage.setItem('sw_reloaded_version', currentVersion);
                            //window.location.reload();
                        }
                    });
                });
            });
        }
    }
    
    
    this.setNotificationsData = function(){
        // Listen for messages from service worker
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log('📨 Message received from service worker:', event.data);
                console.log('Action:', event.data.action);
                console.log('Payload:', event.data.payload);
                    
                
                const { action, payload } = event.data;
                
                switch (action) {
                    case 'NO_SOW_BOAR_REMINDER':
                        console.log('NO_SOW_BOAR_REMINDER');
                        
                        const sow_boar_type = SOW_BOAR_TYPE.SOW;
                        navigation.managerNavLinks.onClickNavSowBoar(null, 
                            sow_boar_type, null);
                        
                        break;
                    
                    
                    case 'OPEN_BILL':
                        console.log('action OPEN BILL');
                        let go_back_page = navigation.getPageContainer(PAGE_ID.HOME);
                        
                        const next_page = navigation.getPageContainer(PAGE_ID.BILL_NEW);
                        
                        
                        // Push currentPage to NavHistory;
                        // Will also compare current page and next_page NAV_MENU_GROUP. 
                        navigation.pushCurrentPageToNavHistory(next_page);
                        
                        
                        navigation.showThisPage(next_page);
                        
                        
                        const options ={
                            go_back_page:   go_back_page,
                        };
                        navigation.pageAccountNewBill.show(options);
                        
                        break;
                        
                    case 'GESTA_PIG_OPS_REMINDER':
                        console.log('GESTA_PIG_OPS_REMINDER');
                        
                        const operation_type = PIG_OPERATION_TYPE.GESTATING
                        navigation.managerNavLinks.onClickNavProdGestaLacta(
                            null, operation_type, null, null);
                        break;
                        
                    case 'SHOW_ALERT':
                        console.log('acttion SHOW ALERT')
                        break;
                        
                    default:
                        console.log('Unknown action:', action);
                }
            });
        }        
        

    }
    
    

    this.onClickProdGestatingEntry = function(pig_prod_pid){
        if (pig_prod_pid == null){
            thisObj.managerNavLinks.onClickNavProdGestaLacta(null, 
                PIG_OPERATION_TYPE.GESTATING);
            return;
        }
        
        
        const next_page = thisObj.getPageContainer(PAGE_ID.PROD_GESTA_ENTRY);
        thisObj.showThisPage(next_page);
        
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
            thisObj.managerNavLinks.onClickNavProdGestaLacta(null, 
                PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            return;
        }
        

        const next_page = thisObj.getPageContainer(PAGE_ID.PROD_LACTA_ENTRY);
        thisObj.showThisPage(next_page);
        
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
    
    
}
