// hash_router.js

// June 7, 2026
// Jack Wong
// j2718wong@gmail.com


import {APPLICATION,
        PAGE_ID,
        HASH_ROUTES,
        SOW_BOAR_TYPE}              from '../../constants.js';


export class HashRouter {
    constructor() {
        this.currentState   = null;
        this.onRouteChange  = null;
        this.isListening    = false;
    }
    
    
    init() {
        if (this.isListening) return;
        
        
        // Set initial state if no hash exists
        if (!window.location.hash) {
            const initialState = { route: 'home', data: {}, timestamp: Date.now() };
            history.replaceState(initialState, '', '#home');
            console.log('HashRouter: Initial state set to home');
        }
        
        
        // Handle initial load
        window.addEventListener('load', () => {
            // Set initial state if needed
            if (!window.location.hash) {
                history.replaceState({ route: 'home', data: {} }, '', '#home');
            }
            this.handleHashChange();
        });
        
        
        // Single popstate listener for everything
        window.addEventListener('popstate', (event) => {
            console.log('HashRouter popstate:', event.state);
            this.handleHashChange(event.state);
        });
        
        this.isListening = true;
    }
    
    
    handleHashChange(state) {
        let route, data;
        
        if (state && state.route) {
            route = state.route;
            data = state.data || {};
        } else {
            const hash = window.location.hash.substring(1);
            route = hash.split('?')[0] || 'home';
            data = {};
        }
        
        if (this.onRouteChange) {
            this.onRouteChange(route, data);
        }
    }
    
    navigate(route, data = {}) {
        console.log('\n\n🔵 NAVIGATE to:', route, 'History length:', history.length);
        const hash = `#${route}`;
        const state = { route, data, timestamp: Date.now() };
        
        
        history.pushState(state, '', hash);
        this.currentState = state;
        
        if (this.onRouteChange) {
            this.onRouteChange(route, data);
        }
        
        
        console.log('🔵 After navigate, History length:', history.length);
    }
    
    
    replace(route, data = {}) {
        console.log('🟡 REPLACE to:', route, 'History length:', history.length);
        const hash = `#${route}`;
        const state = { route, data, timestamp: Date.now() };
        
        history.replaceState(state, '', hash);
        this.currentState = state;
        
        if (this.onRouteChange) {
            this.onRouteChange(route, data);
        }
        console.log('🟡 After replace, History length:', history.length);
    }
    
    
    getCurrentRoute() {
        const hash = window.location.hash.substring(1);
        return hash.split('?')[0];
    }
}


export function ManagerHashRoute(_navigation) {
    const thisObj           = this;
    const navigation        = _navigation;
    
    
    this.hashRouter         = new HashRouter();
    
    this.init = function(){
        this.initHashRouter();
    }
    
    
    this.initHashRouter = function() {
        // Set the route handler
        thisObj.hashRouter.onRouteChange = (route, data) => {
            thisObj.handleHashRoute(route, data);
        };
        
        // Start listening to popstate events
        thisObj.hashRouter.init();
    }
    
    
    this.handleHashRoute = function(route, data) {
        console.log('Hash route changed:', route, data);
        
        let pageId          = null;
        let pageContainer   = null;
        
        
        // Extract base route (remove query parameters)
        let baseRoute = route;
        
        if (route.includes('?')){
            baseRoute = route.split('?')[0];
        }
        
        if (route.includes('/')){
            baseRoute = route.split('/')[0];
        }
        
        
        switch(baseRoute) {
            case HASH_ROUTES.HOME: {
                navigation.showHomeDashBoard();
                break;
            }
            
            
            case HASH_ROUTES.FEEDBACK_US: {
                pageId          = PAGE_ID.FEEDBACK_US;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageCustomerFeedback.show();
                console.log('pageCustomerFeedback.show() done');
                break;
            }
            
            
            case HASH_ROUTES.MY_ACCOUNT: {
                pageId          = PAGE_ID.MY_ACCOUNT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageMyAccount.show({ 
                    returnRoute:    data.returnRoute,
                    returnPageId:   data.returnPageId 
                });
                break;
            }
               
                        
            case HASH_ROUTES.CUSTOMER_PRICING: {
                pageId          = PAGE_ID.CUSTOMER_PRICING;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageCustomerPricing.show({ 
                    returnRoute:    data.returnRoute || HASH_ROUTES.MY_ACCOUNT
                });
                break;
            }
            
            
            case HASH_ROUTES.BILL_NEW: {
                pageId          = PAGE_ID.BILL_NEW;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageAccountNewBill.show({ 
                    returnRoute:    data.returnRoute || HASH_ROUTES.HOME
                });
                break;
            }
            
            
            case HASH_ROUTES.USER_SETTINGS: {
                pageId          = PAGE_ID.USER_SETTINGS;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageUserSettings.show({ 
                    returnRoute:    data.returnRoute || HASH_ROUTES.HOME
                });
                break;
            }
            
            
            case HASH_ROUTES.PIG_FARM_ADD_EDIT: {
                pageId          = PAGE_ID.PIG_FARM_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                if (data.isAdd) {
                    navigation.pagePigFarmAddEdit.show(data.options);
                } else {
                    
                    navigation.pagePigFarmAddEdit.show(data.options);
                }
                break;
            }
            
            
            case HASH_ROUTES.PROD_GESTA_LIST: {
                pageId          = PAGE_ID.PROD_GESTA_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                navigation.pageMobGestatingList.show();
                break;
            }
            
            
            case HASH_ROUTES.PROD_GESTA_ADD: {
                pageId          = PAGE_ID.PROD_GESTA_ADD;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageProdGestatingAdd.show({
                    is_add:         data.isAdd || true,
                    returnRoute:    data.returnRoute,
                    returnPageId:   data.returnPageId
                });
                break;
            }
            

            case HASH_ROUTES.PROD_LACTA_LIST: {
                pageId          = PAGE_ID.PROD_LACTA_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                navigation.pageMobLactatingList.show();
                break;
            }
            
            
            case HASH_ROUTES.PROD_FATTENING_LIST: {
                pageId          = PAGE_ID.PROD_FATTENING_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageProdFatteningList.show();
                break;
            }
            
            
            case HASH_ROUTES.PROD_FATTENING_ADD: {
                pageId          = PAGE_ID.PROD_FATTENING_ADD;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageProdFatteningAdd.show({
                    is_add:         data.isAdd || true,
                    returnRoute:    data.returnRoute,
                    returnPageId:   data.returnPageId
                });
                break;
            }
             
                        
            case HASH_ROUTES.PROD_HISTORY_LIST: {
                pageId          = PAGE_ID.PROD_HISTORY_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageProdHistoryList.show();
                break;
            }
            
            
            case HASH_ROUTES.PROD_OUTPUT: {
                pageId          = PAGE_ID.PROD_OUTPUT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageProdOutputChart.show();
                break;
            }
            
            
            case HASH_ROUTES.PROD_NOT_PREGNANT_LIST: {
                pageId          = PAGE_ID.PROD_NOT_PREGNANT_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageNotPregnantList.show();
                break;
            }
            
            
            case HASH_ROUTES.SOW_BOAR_LIST: {
                // Parse query parameters
                const urlParams = new URLSearchParams(route.split('?')[1] || '');
                const type  = urlParams.get('type') || 'sows';
                const tab   = urlParams.get('tab') || 'all';
                
                let sowBoarType;
                switch(type) {
                    case 'sows':    sowBoarType = SOW_BOAR_TYPE.SOW; break;
                    case 'boars':   sowBoarType = SOW_BOAR_TYPE.BOAR; break;
                    case 'gilts':   sowBoarType = SOW_BOAR_TYPE.GILT; break;
                    case 'disposed':sowBoarType = SOW_BOAR_TYPE.DISPOSED; break;
                    default: sowBoarType = SOW_BOAR_TYPE.SOW; break;
                }
                
                pageId          = PAGE_ID.SOW_BOAR_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                const options = {
                    sow_boar_type: sowBoarType
                };
                if (tab !== 'all') {
                    options.filter_type = tab;
                }
                if (data.showOptions) {
                    Object.assign(options, data.showOptions);
                }
                
                navigation.pageSowBoarList.show(options);
                break;
            }
            
            
            case HASH_ROUTES.SOW_BOAR_ADD_EDIT: {
                pageId          = PAGE_ID.SOW_BOAR_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                if (data.isAdd) {
                    // data.sowBoarType is a string
                    // SOW_BOAR_TYPE is a integer
                    
                    // Add mode
                    let sowBoarType;
                    switch(data.sowBoarType) {
                        case 'sows':    sowBoarType = SOW_BOAR_TYPE.SOW; break;
                        case 'boars':   sowBoarType = SOW_BOAR_TYPE.BOAR; break;
                        case 'gilts':   sowBoarType = SOW_BOAR_TYPE.GILT; break;
                        case 'disposed':sowBoarType = SOW_BOAR_TYPE.DISPOSED; break;
                        default: sowBoarType = SOW_BOAR_TYPE.SOW; break;
                    }
                    
                    navigation.pageSowBoarAddEdit.show({
                        is_add:         true,
                        sow_boar_type:  sowBoarType,
                        returnRoute:    data.returnRoute,
                        returnPageId:   data.returnPageId
                    });
                } 
                
                else {
                    // Edit mode - need to load entry by HID
                    const entryHid = data.entryHid;
                    
                    let sowBoarType;
                    switch(data.sowBoarType) {
                        case 'sows':    sowBoarType = SOW_BOAR_TYPE.SOW; break;
                        case 'boars':   sowBoarType = SOW_BOAR_TYPE.BOAR; break;
                        case 'gilts':   sowBoarType = SOW_BOAR_TYPE.GILT; break;
                        case 'disposed':sowBoarType = SOW_BOAR_TYPE.DISPOSED; break;
                        default: sowBoarType = SOW_BOAR_TYPE.SOW; break;
                    }
                    
                    
                    // Find the entry from existing data
                    let entryData       = null;
                    let dataList        = null;
                    let managerSowBoar  = navigation.pigFarm.managerSowBoar;
                    
                    switch(sowBoarType) {
                        case SOW_BOAR_TYPE.SOW:
                            dataList = managerSowBoar.dataSowList;
                            entryData = dataList?.find(
                                item => item.sow_boar.hid === entryHid
                            );
                            break;
                        case SOW_BOAR_TYPE.BOAR:
                            dataList = managerSowBoar.dataBoarList;
                            entryData = dataList?.find(
                                item => item.sow_boar.hid === entryHid
                            );
                            break;
                        case SOW_BOAR_TYPE.GILT:
                            dataList = managerSowBoar.dataGiltList;
                            entryData = dataList?.find(
                                item => item.sow_boar.hid === entryHid
                            );
                            break;
                    }
                    
                    if (entryData) {
                        const options = {
                            is_add:             false,
                            sow_boar_type:      sowBoarType,
                            
                            // These are needed to be passed so that after
                            // successful edit can go back to PageSowBoarEntry
                            prev_sow_boar_hid:  data.prevSowBoarHid,
                            next_sow_boar_hid:  data.nextSowBoarHid,
                            data_index:         data.dataIndex,
                            total_entries:      data.totalEntries,
                            
                            returnRoute:        data.returnRoute,
                            returnPageId:       data.returnPageId
                        };
                        
                        navigation.pageSowBoarAddEdit.show(options, entryData);
                    } 
                }
                break;
            }
            
            
            case HASH_ROUTES.SOW_BOAR_ENTRY: {
                pageId          = PAGE_ID.SOW_BOAR_ENTRY;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                // Find the entry data by HID
                let entryData       = null;
                const sowBoarType   = data.sowBoarType || 'sows';
                let sowBoarTypeNum  = SOW_BOAR_TYPE.SOW;
                
                switch(sowBoarType) {
                    case 'sows':    sowBoarTypeNum = SOW_BOAR_TYPE.SOW; break;
                    case 'boars':   sowBoarTypeNum = SOW_BOAR_TYPE.BOAR; break;
                    case 'gilts':   sowBoarTypeNum = SOW_BOAR_TYPE.GILT; break;
                    case 'disposed':sowBoarTypeNum = SOW_BOAR_TYPE.DISPOSED; break;
                }
                
                // Try to find entry in existing data
                let dataList = null;
                switch(sowBoarTypeNum) {
                    case SOW_BOAR_TYPE.SOW:
                        dataList = navigation.pigFarm.managerSowBoar.dataSowList;
                        entryData = dataList?.find(
                            item => item.sow_boar.hid === data.sowBoarHid
                        );
                        break;
                    case SOW_BOAR_TYPE.BOAR:
                        dataList = navigation.pigFarm.managerSowBoar.dataBoarList;
                        entryData = dataList?.find(
                            item => item.sow_boar.hid === data.sowBoarHid
                        );
                        break;
                    case SOW_BOAR_TYPE.GILT:
                        dataList = navigation.pigFarm.managerSowBoar.dataGiltList;
                        entryData = dataList?.find(
                            item => item.sow_boar.hid === data.sowBoarHid
                        );
                        break;
                }
                
                const options = {
                    sow_boar_type:      sowBoarTypeNum,
                    prev_sow_boar_hid:  data.prevSowBoarHid,
                    next_sow_boar_hid:  data.nextSowBoarHid,
                    sow_boar_list:      null, // Will be loaded from data
                    data_index:         data.dataIndex,
                    total_entries:      data.totalEntries
                };
                if (data.tabId) {
                    options.tab_id = data.tabId;
                }
                
                
                navigation.pageSowBoarEntry.show(entryData, options);
                
                break;            
            }
            
            
            case HASH_ROUTES.SOW_BOAR_DISPOSED: {
                pageId          = PAGE_ID.SOW_BOAR_DISPOSED
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                // Find the disposed entry
                let entryData = null;
                const dataList = navigation.pigFarm.managerSowBoar.dataDisposedList;
                if (dataList) {
                    entryData = dataList.find(
                        item => item.sow_boar.hid === data.entryHid);
                }
                
                const options = {
                    sow_boar_type:  SOW_BOAR_TYPE.DISPOSED,
                    returnRoute:    data.returnRoute,
                    returnPageId:   data.returnPageId
                };
                
                if (entryData) {
                    navigation.pageSowBoarDisposed.show(entryData, options);
                }
                break;
            }
            
            
            case HASH_ROUTES.TRACE_PARENTS: {
                pageId          = PAGE_ID.TRACE_PARENTS;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageParentTrace.show();
                break;
            }
            
                        
            case HASH_ROUTES.ALL_FEED_BAL_LIST: {
                pageId          = PAGE_ID.ALL_FEED_BAL_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                navigation.pageAllFeedBalanceList.show();
                break;
            }
            
            
            case HASH_ROUTES.ALL_FEED_BAL_ADD_EDIT: {
                pageId          = PAGE_ID.ALL_FEED_BAL_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                if (data.isAdd) {
                    navigation.pageAllFeedBalanceAddEdit.show(data.options);
                } else {
                    // Edit mode - need to load entry by date_balance
                    const entryDate = data.entryDate;
                    
                    // Find the entry from feed balance list by date_balance
                    let entryData = null;
                    const dataList = navigation.pigFarm.dataFeedBalanceList;
                    if (dataList && entryDate) {
                        entryData = dataList.find(
                            item => item.date_balance === entryDate);
                    }
                    
                    // Prepare options with return route
                    const options = {
                        is_add: false,
                        returnRoute:    data.returnRoute,
                        returnPageId:   data.returnPageId
                    };
                    
                    navigation.pageAllFeedBalanceAddEdit.show(options, entryData);
                }
                break;
            }
                
            
            case HASH_ROUTES.FARROWING_SCHEDULE: {
                pageId          = PAGE_ID.FARROWING_SCHEDULE;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageFarrowingSchedule.show();
                break;
            }
              
                
            case HASH_ROUTES.PIG_DEAD_LIST: {
                pageId          = PAGE_ID.PIG_DEAD_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                navigation.pagePigDeadList.show();
                break;
            }
              
                
            case HASH_ROUTES.PIG_DEAD_ADD_EDIT: {
                pageId          = PAGE_ID.PIG_DEAD_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                if (data.isAdd) {
                    navigation.pagePigDeadAddEdit.show(data.options);
                } else {
                    //navigation.pagePigDeadAddEdit.show(data.options);
                }
                break;
            }
            
            
            case HASH_ROUTES.BOAR_EXT_MATE_LIST: {
                pageId          = PAGE_ID.BOAR_EXT_MATE_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                navigation.pageBoarExtMateList.show();
                break;
            }
               
                
            case HASH_ROUTES.BOAR_EXT_MATE_ADD_EDIT: {
                pageId          = PAGE_ID.BOAR_EXT_MATE_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                if (data.isAdd) {
                    navigation.pagePigDeadAddEdit.show(data.options);
                } else {
                    //navigation.pagePigDeadAddEdit.showEdit(data.options);
                }
                break;
            }
            
            
            case HASH_ROUTES.ACC_FARROW_CHECKLIST: {
                pageId          = PAGE_ID.ACC_FARROW_CHECKLIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                if (data.refreshList) {
                    navigation.pageAccFarrowChecklist.show({refresh_list:true});
                } else {
                    navigation.pageAccFarrowChecklist.show();
                }
                break;
            }
            
            
            case HASH_ROUTES.ACC_F_CHECKLIST_ADD_EDIT: {
                pageId          = PAGE_ID.ACC_F_CHECKLIST_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                if (data.isAdd) {
                    navigation.pageAccFChecklistAddEdit.show(data.options);
                } else {
                    let entryData = null;
                    const dataList = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
                    
                    if (dataList) {
                        entryData = dataList.find(
                            item => item.hid === data.entryHid);
                    }
                    
                    // Prepare options with return route
                    const options = {
                        is_add: false,
                        returnRoute:    data.returnRoute,
                        returnPageId:   data.returnPageId
                    };
                    
                    navigation.pageAccFChecklistAddEdit.show(options, entryData);
                }
                break;
            }
    
    
            case HASH_ROUTES.FEEDS_CONSUMED: {
                pageId          = PAGE_ID.FEEDS_CONSUMED;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageFeedsConsumedChart.show();
                break;
            }
            
            
            case HASH_ROUTES.PROD_SALES_LIST: {
                pageId          = PAGE_ID.PROD_SALES_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageProdSalesList.show();
                break;
            }
            
            
            case HASH_ROUTES.FARM_FEED_BUY_LIST: {
                pageId          = PAGE_ID.FARM_FEED_BUY_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pagePigFarmFeedBuyList.show();
                break;
            }
            
            
            case HASH_ROUTES.FARM_FEED_BUY_ADD_EDIT: {
                pageId          = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                if (data.isAdd) {
                    navigation.pagePfFeedBuyAddEdit.show(data.options);
                } else {
                    // Find the entry from feed buy list by entryHid
                    let entryData = null;
                    const dataList = navigation.pigFarm.dataFarmFeedBuyList;
                    if (dataList) {
                        entryData = dataList.find(
                            item => item.pf_feed_buy.hid === data.entryHid);
                    }
                    
                    // Prepare options with return route
                    const options = {
                        is_add: false,
                        returnRoute:    data.returnRoute,
                        returnPageId:   data.returnPageId
                    };
                    
                    navigation.pagePfFeedBuyAddEdit.show(options, entryData);
                }
                break;
            }
            
            
            case HASH_ROUTES.FEEDS_ESTIMATE: {
                pageId          = PAGE_ID.FEEDS_ESTIMATE;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageFeedsEstimate.show();
                break;
            }
            
            
            case HASH_ROUTES.USER_LIST: {
                pageId          = PAGE_ID.USER_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageUserList.show();
                break;
            }
            
            
            case HASH_ROUTES.ACCESS_CODE_LIST: {
                pageId          = PAGE_ID.ACCESS_CODE_LIST;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                navigation.pageAccessCodeList.show();
                break;
            }
                
            
            case HASH_ROUTES.ACCESS_CODE_ADD_EDIT: {
                pageId          = PAGE_ID.ACCESS_CODE_ADD_EDIT;
                pageContainer   = navigation.getPageContainer(pageId);
                navigation.showThisPage(pageContainer);
                
                if (data.isAdd) {
                    navigation.pageAccessCodeAddEdit.show(data.options);
                } else {
                    // TODO
                }
                break;
            }
                
            // Add more routes as you implement them
                
            default:{
                navigation.showHomeDashBoard();
                break;
            }
        }
    }
    
}

