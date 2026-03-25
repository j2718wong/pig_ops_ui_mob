// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PAGE_ID, NAV_MENU_GROUP} from '../../constants.js';



export function NavPageContainers(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    // Container elements (will be populated after DOM load)
    this.containers = {};
    
    // Container ID strings
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
    
    const elemIdContBoarExtMateList     = 'container-boar-ext-mate-list';
    const elemIdContBoarExtMateAddEdit  = 'container-boar-ext-mate-add-edit';
    
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
    
    const elemIdContAccessCodeList      = 'container-access-code-list';
    const elemIdContAccessCodeAddEdit   = 'container-access-code-add-edit';
    
    
    let CONTAINER_GROUP_PRODUCTION      = null;
    let CONTAINER_GROUP_SOW_BOAR_GILT   = null;
    let CONTAINER_GROUP_OPERATIONS      = null;
    let CONTAINER_GROUP_FINANCIALS      = null;
    let CONTAINER_GROUP_ACCOUNT_LISTS   = null;
    let CONTAINER_GROUP_SETTINGS        = null;
    let CONTAINER_GROUP_ADMIN           = null;
    
    
    let containerToPageIdMap            = null;
    

   
    this.hiddenContainers               = null;
    
    
    this.init = function(){
        
    }
    
    
    this.findElements = function(){
        // Account & Billing
        this.containers[PAGE_ID.MY_ACCOUNT]             = document.getElementById(elemIdContMyAccount);
        this.containers[PAGE_ID.CUSTOMER_PRICING]       = document.getElementById(elemIdContCustomerPricing);
        
        
        this.containers[PAGE_ID.ACCOUNT_DISABLED]       = document.getElementById(elemIdContAccountDisabled);
        this.containers[PAGE_ID.USER_DISABLED]          = document.getElementById(elemIdContUserDisabled);
        this.containers[PAGE_ID.ACCOUNT_BILL_UNPAID]    = document.getElementById(elemIdContAccountBillUnpaid);
        
        
        this.containers[PAGE_ID.HOME]                   = document.getElementById(elemIdContHomeDashBoard);
        this.containers[PAGE_ID.PIG_FARM_ADD_EDIT]      = document.getElementById(elemIdContPigFarmAddEdit);
            
        this.containers[PAGE_ID.FEEDBACK_US]            = document.getElementById(elemIdContFeedBackUs);
    
            
        this.containers[PAGE_ID.SOW_BOAR_LIST]          = document.getElementById(elemIdContSowBoarList);
        this.containers[PAGE_ID.SOW_BOAR_ADD_EDIT]      = document.getElementById(elemIdContSowBoarAddEdit);
        this.containers[PAGE_ID.SOW_BOAR_ENTRY]         = document.getElementById(elemIdContSowBoarEntry);
        this.containers[PAGE_ID.SOW_BOAR_DISPOSED]      = document.getElementById(elemIdContSowBoarDisposed);
            
            
        this.containers[PAGE_ID.MEDVAC_ADD_EDIT]        = document.getElementById(elemIdContMedVacAddEdit);
        this.containers[PAGE_ID.HEALTH_ADD_EDIT]        = document.getElementById(elemIdContHealthAddEdit);
        this.containers[PAGE_ID.NOTES_ADD_EDIT]         = document.getElementById(elemIdContNotesAddEdit);
        this.containers[PAGE_ID.TRACE_PARENTS]          = document.getElementById(elemIdContParentTrace);
                    
        this.containers[PAGE_ID.PROD_GESTA_LIST]        = document.getElementById(elemIdContProdGestaList);
        this.containers[PAGE_ID.PROD_GESTA_ADD]         = document.getElementById(elemIdContProdGestaAdd);
        this.containers[PAGE_ID.PROD_GESTA_ENTRY]       = document.getElementById(elemIdContProdGestaEntry);
                    
        this.containers[PAGE_ID.PROD_LACTA_LIST]        = document.getElementById(elemIdContProdLactaList);
        this.containers[PAGE_ID.PROD_LACTA_ENTRY]       = document.getElementById(elemIdContProdLactaEntry);
                    
        this.containers[PAGE_ID.PROD_FATTENING_LIST]    = document.getElementById(elemIdContFatteningList);
        this.containers[PAGE_ID.PROD_FATTENING_ADD]     = document.getElementById(elemIdContFatteningAdd);
        this.containers[PAGE_ID.PROD_FATTENING_ENTRY]   = document.getElementById(elemIdContFatteningEntry);
                    
        this.containers[PAGE_ID.PROD_PIG_OPS_EDIT]      = document.getElementById(elemIdContProdPigOpsEdit);
        this.containers[PAGE_ID.PROD_FEED_ADD_EDIT]     = document.getElementById(elemIdContProdFeedAddEdit);
        this.containers[PAGE_ID.PROD_HARVEST_ADD_EDIT]  = document.getElementById(elemIdContProdHarvestAddEdit);
        
        this.containers[PAGE_ID.PROD_FEED_BAL_ADD_EDIT] = document.getElementById(elemIdContProdFeedBalAddEdit);
        
        this.containers[PAGE_ID.PROD_HISTORY_LIST]      = document.getElementById(elemIdContProdHistoryList);
        this.containers[PAGE_ID.PROD_HISTORY_ENTRY]     = document.getElementById(elemIdContProdHistoryEntry);
        
        this.containers[PAGE_ID.PROD_NOT_PREGNANT_LIST] = document.getElementById(elemIdContProdNotPregnantList);
        
        
        
        this.containers[PAGE_ID.ALL_FEED_BAL_LIST]      = document.getElementById(elemIdContAllFeedBalList);
        this.containers[PAGE_ID.ALL_FEED_BAL_ADD_EDIT]  = document.getElementById(elemIdContAllFeedBalAddEdit);
        
        this.containers[PAGE_ID.BOAR_EXT_MATE_LIST]     = document.getElementById(elemIdContBoarExtMateList);
        this.containers[PAGE_ID.BOAR_EXT_MATE_ADD_EDIT] = document.getElementById(elemIdContBoarExtMateAddEdit);
        
        this.containers[PAGE_ID.PIG_DEAD_LIST]          = document.getElementById(elemIdContPigDeadList);
        this.containers[PAGE_ID.PIG_DEAD_ADD_EDIT]      = document.getElementById(elemIdContPigDeadAddEdit);
        
        
        
        this.containers[PAGE_ID.PROD_SALES_LIST]        = document.getElementById(elemIdContProdSalesList);
        this.containers[PAGE_ID.PROD_SALES_ENTRY]       = document.getElementById(elemIdContProdSalesEntry);
    
    
    
        this.containers[PAGE_ID.FARM_FEED_BUY_LIST]       = document.getElementById(elemIdContFarmFeedBuyList);
        this.containers[PAGE_ID.FARM_FEED_BUY_ADD_EDIT]   = document.getElementById(elemIdContFarmFeedBuyAddEdit);
        this.containers[PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT] = document.getElementById(elemIdContFeedBuyItemAddEdit);
        
        
        
        this.containers[PAGE_ID.ACC_OPS_SETTINGS_EDIT] = document.getElementById(elemIdContAccOpsSettingsEdit);
        this.containers[PAGE_ID.ACC_PIG_OPS_LIST]      = document.getElementById(elemIdContAccPigOpsList);
        this.containers[PAGE_ID.ACC_PIG_OPS_ADD_EDIT]  = document.getElementById(elemIdContAccPigOpsAddEdit);
        
        this.containers[PAGE_ID.SUPPLIER_ADD_EDIT]     = document.getElementById(elemIdContSupplierAddEdit);
    
    
        this.containers[PAGE_ID.USER_LIST]             = document.getElementById(elemIdContUserList);
        
        this.containers[PAGE_ID.ACCESS_CODE_LIST]      = document.getElementById(elemIdContAccessCodeList);
        this.containers[PAGE_ID.ACCESS_CODE_ADD_EDIT]  = document.getElementById(elemIdContAccessCodeAddEdit);
        
        
        
        CONTAINER_GROUP_PRODUCTION      = [
            this.containers[PAGE_ID.PROD_GESTA_LIST],
            this.containers[PAGE_ID.PROD_LACTA_LIST],
            this.containers[PAGE_ID.PROD_FATTENING_LIST],
            this.containers[PAGE_ID.PROD_HISTORY_LIST],
            this.containers[PAGE_ID.PROD_NOT_PREGNANT_LIST]
        ]; 
        
        
        CONTAINER_GROUP_SOW_BOAR_GILT   = [
            this.containers[PAGE_ID.SOW_BOAR_LIST],
            this.containers[PAGE_ID.SOW_BOAR_DISPOSED],
            this.containers[PAGE_ID.TRACE_PARENTS]
        ];
        
        
        CONTAINER_GROUP_OPERATIONS      = [
            this.containers[PAGE_ID.ALL_FEED_BAL_LIST],
            this.containers[PAGE_ID.BOAR_EXT_MATE_LIST],
            this.containers[PAGE_ID.PIG_DEAD_LIST]
        ];
        
        
        CONTAINER_GROUP_FINANCIALS      = [
            this.containers[PAGE_ID.PROD_SALES_LIST],
            this.containers[PAGE_ID.FARM_FEED_BUY_LIST]
        ];
        
        
        CONTAINER_GROUP_ACCOUNT_LISTS   = [];
        
        
        CONTAINER_GROUP_SETTINGS        = [
            this.containers[PAGE_ID.ACC_OPS_SETTINGS_EDIT],
            this.containers[PAGE_ID.ACC_PIG_OPS_LIST]
        ];
        
        
        CONTAINER_GROUP_ADMIN           = [
            this.containers[PAGE_ID.USER_LIST],
            this.containers[PAGE_ID.ACCESS_CODE_LIST]
        ];
        
        
        containerToPageIdMap = [
            { container: this.containers[PAGE_ID.MY_ACCOUNT],             id: PAGE_ID.MY_ACCOUNT },
            { container: this.containers[PAGE_ID.CUSTOMER_PRICING],       id: PAGE_ID.CUSTOMER_PRICING },
            { container: this.containers[PAGE_ID.HOME],                   id: PAGE_ID.HOME },
            { container: this.containers[PAGE_ID.FEEDBACK_US],            id: PAGE_ID.FEEDBACK_US },
            { container: this.containers[PAGE_ID.PIG_FARM_ADD_EDIT],      id: PAGE_ID.PIG_FARM_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.SOW_BOAR_LIST],          id: PAGE_ID.SOW_BOAR_LIST },
            { container: this.containers[PAGE_ID.SOW_BOAR_ADD_EDIT],      id: PAGE_ID.SOW_BOAR_ADD_EDIT },
            { container: this.containers[PAGE_ID.SOW_BOAR_ENTRY],         id: PAGE_ID.SOW_BOAR_ENTRY },
            { container: this.containers[PAGE_ID.SOW_BOAR_DISPOSED],      id: PAGE_ID.SOW_BOAR_DISPOSED },
                
            { container: this.containers[PAGE_ID.MEDVAC_ADD_EDIT],        id: PAGE_ID.MEDVAC_ADD_EDIT },
            { container: this.containers[PAGE_ID.HEALTH_ADD_EDIT],        id: PAGE_ID.HEALTH_ADD_EDIT },
            { container: this.containers[PAGE_ID.NOTES_ADD_EDIT],         id: PAGE_ID.NOTES_ADD_EDIT },
            { container: this.containers[PAGE_ID.TRACE_PARENTS],          id: PAGE_ID.TRACE_PARENTS },
                
            { container: this.containers[PAGE_ID.PROD_GESTA_LIST],        id: PAGE_ID.PROD_GESTA_LIST },
            { container: this.containers[PAGE_ID.PROD_GESTA_ADD],         id: PAGE_ID.PROD_GESTA_ADD },
            { container: this.containers[PAGE_ID.PROD_GESTA_ENTRY],       id: PAGE_ID.PROD_GESTA_ENTRY },
                
            { container: this.containers[PAGE_ID.PROD_LACTA_LIST],        id: PAGE_ID.PROD_LACTA_LIST },
            { container: this.containers[PAGE_ID.PROD_LACTA_ENTRY],       id: PAGE_ID.PROD_LACTA_ENTRY },
                
            { container: this.containers[PAGE_ID.PROD_FATTENING_LIST],    id: PAGE_ID.PROD_FATTENING_LIST },
            { container: this.containers[PAGE_ID.PROD_FATTENING_ADD],     id: PAGE_ID.PROD_FATTENING_ADD },
            { container: this.containers[PAGE_ID.PROD_FATTENING_ENTRY],   id: PAGE_ID.PROD_FATTENING_ENTRY },
                
            { container: this.containers[PAGE_ID.PROD_PIG_OPS_EDIT],      id: PAGE_ID.PROD_PIG_OPS_EDIT },
                
            { container: this.containers[PAGE_ID.PROD_FEED_ADD_EDIT],     id: PAGE_ID.PROD_FEED_ADD_EDIT },
            { container: this.containers[PAGE_ID.PROD_FEED_BAL_ADD_EDIT], id: PAGE_ID.PROD_FEED_BAL_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.PROD_HARVEST_ADD_EDIT],  id: PAGE_ID.PROD_HARVEST_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.PROD_HISTORY_LIST],      id: PAGE_ID.PROD_HISTORY_LIST },
            { container: this.containers[PAGE_ID.PROD_HISTORY_ENTRY],     id: PAGE_ID.PROD_HISTORY_ENTRY },
            { container: this.containers[PAGE_ID.PROD_NOT_PREGNANT_LIST], id: PAGE_ID.PROD_NOT_PREGNANT_LIST },
                
            { container: this.containers[PAGE_ID.ALL_FEED_BAL_LIST],      id: PAGE_ID.ALL_FEED_BAL_LIST },
            { container: this.containers[PAGE_ID.ALL_FEED_BAL_ADD_EDIT],  id: PAGE_ID.ALL_FEED_BAL_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.BOAR_EXT_MATE_LIST],     id: PAGE_ID.BOAR_EXT_MATE_LIST },
            { container: this.containers[PAGE_ID.BOAR_EXT_MATE_ADD_EDIT], id: PAGE_ID.BOAR_EXT_MATE_ADD_EDIT }, 
                
            { container: this.containers[PAGE_ID.PIG_DEAD_LIST],          id: PAGE_ID.PIG_DEAD_LIST },
            { container: this.containers[PAGE_ID.PIG_DEAD_ADD_EDIT],      id: PAGE_ID.PIG_DEAD_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.PROD_SALES_LIST],        id: PAGE_ID.PROD_SALES_LIST },
            { container: this.containers[PAGE_ID.PROD_SALES_ENTRY],       id: PAGE_ID.PROD_SALES_ENTRY },
                
            { container: this.containers[PAGE_ID.FARM_FEED_BUY_LIST],     id: PAGE_ID.FARM_FEED_BUY_LIST },
            { container: this.containers[PAGE_ID.FARM_FEED_BUY_ADD_EDIT], id: PAGE_ID.FARM_FEED_BUY_ADD_EDIT },
            { container: this.containers[PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT], id: PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.ACC_OPS_SETTINGS_EDIT],  id: PAGE_ID.ACC_OPS_SETTINGS_EDIT },
            { container: this.containers[PAGE_ID.ACC_PIG_OPS_LIST],       id: PAGE_ID.ACC_PIG_OPS_LIST },
            { container: this.containers[PAGE_ID.ACC_PIG_OPS_ADD_EDIT],   id: PAGE_ID.ACC_PIG_OPS_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.SUPPLIER_ADD_EDIT],      id: PAGE_ID.SUPPLIER_ADD_EDIT },
                
            { container: this.containers[PAGE_ID.USER_LIST],              id: PAGE_ID.USER_LIST },
                
            { container: this.containers[PAGE_ID.ACCESS_CODE_LIST],       id: PAGE_ID.ACCESS_CODE_LIST },
            { container: this.containers[PAGE_ID.ACCESS_CODE_ADD_EDIT],   id: PAGE_ID.ACCESS_CODE_ADD_EDIT }
        ];
    
    
        thisObj.hiddenContainers = document.getElementsByClassName("hidden-container");
    }
    

    // This will return a page container id string
    this.getPageContainerId = function(page_id){
        switch(page_id) {
            case PAGE_ID.MY_ACCOUNT:
                return elemIdContMyAccount;
                
            case PAGE_ID.CUSTOMER_PRICING:
                return elemIdContCustomerPricing;
                
                
            case PAGE_ID.ACCOUNT_DISABLED:
                return elemIdContAccountDisabled;
                
            case PAGE_ID.USER_DISABLED:
                return elemIdContUserDisabled;
                
            case PAGE_ID.ACCOUNT_BILL_UNPAID:
                return elemIdContAccountBillUnpaid;
                
                
            case PAGE_ID.HOME:
                return elemIdContHomeDashBoard;
                
            case PAGE_ID.PIG_FARM_ADD_EDIT:
                return elemIdContPigFarmAddEdit;
                
            case PAGE_ID.FEEDBACK_US:
                return elemIdContFeedBackUs;
                
                
            case PAGE_ID.SOW_BOAR_LIST:
                return elemIdContSowBoarList;
                
            case PAGE_ID.SOW_BOAR_ADD_EDIT:
                return elemIdContSowBoarAddEdit;
                
            case PAGE_ID.SOW_BOAR_ENTRY:
                return elemIdContSowBoarEntry;
                
            case PAGE_ID.SOW_BOAR_DISPOSED:
                return elemIdContSowBoarDisposed;
                
                
            case PAGE_ID.MEDVAC_ADD_EDIT:
                return elemIdContMedVacAddEdit;
                
            case PAGE_ID.HEALTH_ADD_EDIT:
                return elemIdContHealthAddEdit;
                
            case PAGE_ID.NOTES_ADD_EDIT:
                return elemIdContNotesAddEdit;
                
            case PAGE_ID.TRACE_PARENTS:
                return elemIdContParentTrace;
                
                
            case PAGE_ID.PROD_GESTA_LIST:
                return elemIdContProdGestaList;
                
            case PAGE_ID.PROD_GESTA_ADD:
                return elemIdContProdGestaAdd;
                
            case PAGE_ID.PROD_GESTA_ENTRY:
                return elemIdContProdGestaEntry;
                
                
            case PAGE_ID.PROD_LACTA_LIST:
                return elemIdContProdLactaList;
                
            case PAGE_ID.PROD_LACTA_ENTRY:
                return elemIdContProdLactaEntry;
                
                
            case PAGE_ID.PROD_FATTENING_LIST:
                return elemIdContFatteningList;
                
            case PAGE_ID.PROD_FATTENING_ADD:
                return elemIdContFatteningAdd;
                
            case PAGE_ID.PROD_FATTENING_ENTRY:
                return elemIdContFatteningEntry;
                
                
            case PAGE_ID.PROD_PIG_OPS_EDIT:
                return elemIdContProdPigOpsEdit;
                
            case PAGE_ID.PROD_FEED_ADD_EDIT:
                return elemIdContProdFeedAddEdit;
                
            case PAGE_ID.PROD_HARVEST_ADD_EDIT:
                return elemIdContProdHarvestAddEdit;
                
                
            case PAGE_ID.PROD_HISTORY_LIST:
                return elemIdContProdHistoryList;
                
            case PAGE_ID.PROD_HISTORY_ENTRY:
                return elemIdContProdHistoryEntry;
                
            case PAGE_ID.PROD_NOT_PREGNANT_LIST:
                return elemIdContProdNotPregnantList;
                
                
            case PAGE_ID.ALL_FEED_BAL_LIST:
                return elemIdContAllFeedBalList;
                
            case PAGE_ID.ALL_FEED_BAL_ADD_EDIT:
                return elemIdContAllFeedBalAddEdit;
                
                
            case PAGE_ID.BOAR_EXT_MATE_LIST:
                return elemIdContBoarExtMateList;
                
            case PAGE_ID.BOAR_EXT_MATE_ADD_EDIT:
                return elemIdContBoarExtMateAddEdit;
                
                
            case PAGE_ID.PIG_DEAD_LIST:
                return elemIdContPigDeadList;
                
            case PAGE_ID.PIG_DEAD_ADD_EDIT:
                return elemIdContPigDeadAddEdit;
                
                
            case PAGE_ID.PROD_SALES_LIST:
                return elemIdContProdSalesList;
                
            case PAGE_ID.PROD_SALES_ENTRY:
                return elemIdContProdSalesEntry;
                
                
            case PAGE_ID.FARM_FEED_BUY_LIST:
                return elemIdContFarmFeedBuyList;
                
            case PAGE_ID.FARM_FEED_BUY_ADD_EDIT:
                return elemIdContFarmFeedBuyAddEdit;
                
            case PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT:
                return elemIdContFeedBuyItemAddEdit;
                
            case PAGE_ID.PROD_FEED_BAL_ADD_EDIT:
                return elemIdContProdFeedBalAddEdit;
                
                
            case PAGE_ID.ACC_OPS_SETTINGS_EDIT:
                return elemIdContAccOpsSettingsEdit;
                
            case PAGE_ID.ACC_PIG_OPS_LIST:
                return elemIdContAccPigOpsList;
                
            case PAGE_ID.ACC_PIG_OPS_ADD_EDIT:
                return elemIdContAccPigOpsAddEdit;
                
                
            case PAGE_ID.SUPPLIER_ADD_EDIT:
                return elemIdContSupplierAddEdit;
                
                
            case PAGE_ID.USER_LIST:
                return elemIdContUserList;
                
            case PAGE_ID.USER_ADD_EDIT:
                return elemIdContUserAddEdit;
                
                
            case PAGE_ID.ACCESS_CODE_LIST:
                return elemIdContAccessCodeList;
                
            case PAGE_ID.ACCESS_CODE_ADD_EDIT:
                return elemIdContAccessCodeAddEdit;
                
                
            default:
                return null;
        }
    }


    // This will return a div element
    this.getPageContainer = function(page_id){
        return this.containers[page_id] || this.containers[PAGE_ID.HOME];
    }
       
        
    // This will return a PAGE_ID
    this.getPageIdFromContainer = function(page_container) {
        // Loop through mappings to find match
        for (let i = 0; i < containerToPageIdMap.length; i++) {
            if (containerToPageIdMap[i].container === page_container) {
                return containerToPageIdMap[i].id;
            }
        }
        
        // Default fallback
        return PAGE_ID.HOME;
    };
        
 
 
    // Will return a debug string for a container
    this.pageContainerToString = function(page_container){
        switch(page_container) {
        
            case this.containers[PAGE_ID.MY_ACCOUNT]              :{return "PageContMyAccount        ";}
            case this.containers[PAGE_ID.CUSTOMER_PRICING]        :{return "PageContCustomerPricing  ";}
                                                    
                                                    
            case this.containers[PAGE_ID.ACCOUNT_DISABLED]        :{return "PageContAccountDisabled  ";}
            case this.containers[PAGE_ID.USER_DISABLED]           :{return "PageContUserDisabled     ";}
            case this.containers[PAGE_ID.ACCOUNT_BILL_UNPAID]     :{return "PageContAccountBillUnpaid";}
                                                    
                                                    
            case this.containers[PAGE_ID.HOME]                    :{return "PageContHomeDashBoard    ";}
            case this.containers[PAGE_ID.PIG_FARM_ADD_EDIT]       :{return "PageContPigFarmAddEdit   ";}
                                                    
            case this.containers[PAGE_ID.FEEDBACK_US]             :{return "PageContFeedBackUs       ";}
                                                    
                                                    
            case this.containers[PAGE_ID.SOW_BOAR_LIST]           :{return "PageContSowBoarList      ";}
            case this.containers[PAGE_ID.SOW_BOAR_ADD_EDIT]       :{return "PageContSowBoarAddEdit   ";}
            case this.containers[PAGE_ID.SOW_BOAR_ENTRY]          :{return "PageContSowBoarEntry     ";}
            case this.containers[PAGE_ID.SOW_BOAR_DISPOSED]       :{return "PageContSowBoarDisposed  ";}
                                                    
                                                    
            case this.containers[PAGE_ID.MEDVAC_ADD_EDIT]         :{return "PageContMedVacAddEdit    ";}
            case this.containers[PAGE_ID.HEALTH_ADD_EDIT]         :{return "PageContHealthAddEdit    ";}
            case this.containers[PAGE_ID.NOTES_ADD_EDIT]          :{return "PageContNotesAddEdit     ";}
            
            
            case this.containers[PAGE_ID.TRACE_PARENTS]           :{return "PageContNotesAddEdit     ";}
                
                
            case this.containers[PAGE_ID.PROD_GESTA_LIST]         :{return "PageContProdGestaList      ";}
            case this.containers[PAGE_ID.PROD_GESTA_ADD]          :{return "PageContProdGestaAdd       ";}
            case this.containers[PAGE_ID.PROD_GESTA_ENTRY]        :{return "PageContProdGestaEntry     ";}
                                                    
            case this.containers[PAGE_ID.PROD_LACTA_LIST]         :{return "PageContProdLactaList      ";}
            case this.containers[PAGE_ID.PROD_LACTA_ENTRY]        :{return "PageContProdLactaEntry     ";}
                                                    
            case this.containers[PAGE_ID.PROD_FATTENING_LIST]     :{return "PageContFatteningList      ";}
            case this.containers[PAGE_ID.PROD_FATTENING_ADD]      :{return "PageContFatteningAdd       ";}
            case this.containers[PAGE_ID.PROD_FATTENING_ENTRY]    :{return "PageContFatteningEntry     ";}
                                                    
                                                    
                                                    
            case this.containers[PAGE_ID.PROD_PIG_OPS_EDIT]       :{return "PageContProdPigOpsEdit     ";}
            case this.containers[PAGE_ID.PROD_FEED_ADD_EDIT]      :{return "PageContProdFeedAddEdit    ";}
            case this.containers[PAGE_ID.PROD_HARVEST_ADD_EDIT]   :{return "PageContProdHarvestAddEdit ";}
                                                    
                                                    
            case this.containers[PAGE_ID.PROD_HISTORY_LIST]       :{return "PageContProdHistoryList    ";}
            case this.containers[PAGE_ID.PROD_HISTORY_ENTRY]      :{return "PageContProdHistoryEntry   ";}
                                                    
            case this.containers[PAGE_ID.PROD_NOT_PREGNANT_LIST]  :{return "PageContProdNotPregnantList";}
                                     
                                                    
            case this.containers[PAGE_ID.ALL_FEED_BAL_LIST]       :{return "PageContAllFeedBalList     ";}
            case this.containers[PAGE_ID.ALL_FEED_BAL_ADD_EDIT]   :{return "PageContAllFeedBalAddEdit  ";}
            
            
            case this.containers[PAGE_ID.BOAR_EXT_MATE_LIST]      :{return "PageContBoarExtMateList    ";}
            case this.containers[PAGE_ID.BOAR_EXT_MATE_ADD_EDIT]  :{return "PageContBoarExtMateAddEdit ";}
            
            
            case this.containers[PAGE_ID.PIG_DEAD_LIST]           :{return "elemPageContPigDeadList       ";}
            case this.containers[PAGE_ID.PIG_DEAD_ADD_EDIT]       :{return "elemPageContPigDeadAddEdit    ";}
            
            
            
            
            
            case this.containers[PAGE_ID.FARM_FEED_BUY_LIST]      :{return "elemPageContFarmFeedBuyList   ";}
            case this.containers[PAGE_ID.FARM_FEED_BUY_ADD_EDIT]  :{return "elemPageContFarmFeedBuyAddEdit";}
            case this.containers[PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT]:{return "elemPageContFeedBuyItemAddEdit";}
                                                    
            case this.containers[PAGE_ID.PROD_FEED_BAL_ADD_EDIT]  :{return "elemPageContProdFeedBalAddEdit";}
                                                    
                                                    
            case this.containers[PAGE_ID.PROD_SALES_LIST]         :{return "elemPageContProdSalesList     ";}
            case this.containers[PAGE_ID.PROD_SALES_ENTRY]        :{return "elemPageContProdSalesEntry    ";}
                                                    
                                                    
            case this.containers[PAGE_ID.ACC_OPS_SETTINGS_EDIT]   :{return "elemPageContAccOpsSettingsEdit";}
            case this.containers[PAGE_ID.ACC_PIG_OPS_LIST]        :{return "elemPageContAccPigOpsList     ";}
            case this.containers[PAGE_ID.ACC_PIG_OPS_ADD_EDIT]    :{return "elemPageContAccPigOpsAddEdit  ";}
                                                    
                                                    
            case this.containers[PAGE_ID.SUPPLIER_ADD_EDIT]       :{return "elemPageContSupplierAddEdit   ";}
                                                    
            case this.containers[PAGE_ID.USER_LIST]               :{return "elemPageContUserList          ";}
            case this.containers[PAGE_ID.USER_ADD_EDIT]           :{return "elemPageContUserAddEdit       ";}
            
            case this.containers[PAGE_ID.ACCESS_CODE_LIST]        :{return "elemPageContAccessCodeList    ";}
            case this.containers[PAGE_ID.ACCESS_CODE_ADD_EDIT]    :{return "elemPageContAccessCodeAddEdit ";}
            
            default:{return null;}
        }
        
        return null;
    }
    
    
    // Will return NAV_MENU_GROUP from a given page container.
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
