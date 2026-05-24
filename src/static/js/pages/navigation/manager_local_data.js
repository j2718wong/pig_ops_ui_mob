// manager_local_data.js

// March 28, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function ManagerLocalData(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    this.STORAGE_KEY = {
        PIG_FARM: {
            STAFF:                  'superpig_staff',
            
            PROD_GESTATING:         'superpig_prod_gestating',
            PROD_LACTATING:         'superpig_prod_lactating',
            PROD_FATTENING:         'superpig_prod_fattening',
            PROD_HISTORY:           'superpig_prod_history',
            
            LAST_FEED_BALANCE:      'superpig_last_feed_balance'
        },
        
        PRODUCTION:{
            NOT_PREGNANT:           'superpig_not_pregnant'
        },
        
        SOW_BOAR_GILT: {
            DISPOSED:               'superpig_disposed'
        },
        
        OPERATIONS: {
            FEED_BALANCE:           'superpig_feed_balance',
            BOAR_EXT_MATE:          'superpig_boar_ext_mate',
            PIG_DEAD:               'superpig_boar_pig_dead',
            SOW_DUE_CHECKLIST:      'superpig_sow_due_checklist'
        },
        
        FINANCIALS:{
            FEED_BUY:               'superpig_feed_buy'
        },
        
        PIG_OPS_SETTINGS:{
            GESTATING_OPS:          'superpig_gestating_ops',
            LACTATING_PIGLETS_OPS:  'superpig_lactating_piglets_ops',
            LACTATING_SOW_OPS:      'superpig_lactating_sow_ops',
            GILT_OPS:               'superpig_gilt_ops',
            WEANING_SOW_OPS:        'superpig_weaning_sow_ops'
        }
    }
    
    
    this.getSavedLocalData = function(){
        const result    = {};
        
        result[navigation.STORAGE_KEY]              = null;
        result[navigation.userControl.STORAGE_KEY]  = null;
        result[navigation.pigFarm.STORAGE_KEY]      = null;
        
        result[navigation.pigFarm.managerSowBoar.STORAGE_KEY]      = null;
        
        
        // Try to get first saved local storage if there are any;
        let key     = null;
        let cached  = null;
        let data    = null;
        
        
        // navigation saved local data
        cached      = null;
        data        = null;
        
        key         = navigation.STORAGE_KEY;
        cached      = localStorage.getItem(key);
        if (cached) {
            data = JSON.parse(cached);
            if (data){
                result[key] = data;
            }
        }
        
        
        
        // navigation.userControl saved local data
        cached      = null;
        data        = null;
        
        key         = navigation.userControl.STORAGE_KEY;
        cached      = localStorage.getItem(key);
        if (cached) {
            data = JSON.parse(cached);
            if (data){
                result[key] = data;
            }
        }
        
        
        // navigation.pigFarm saved local data
        cached      = null;
        data        = null;
        
        key         = navigation.pigFarm.STORAGE_KEY;
        cached      = localStorage.getItem(key);
        if (cached) {
            data = JSON.parse(cached);
            if (data){
                result[key] = data;
            }
        }
        
        
        cached      = null;
        data        = null;
        
        key         = navigation.pigFarm.managerSowBoar.STORAGE_KEY;
        cached      = localStorage.getItem(key);
        if (cached) {
            data = JSON.parse(cached);
            if (data){
                result[key]  = data;
            }
        }
        
        
        console.log('\n\nSaved Local data');
        console.log(result);
        
        
        return result;
    
    }
    
    
    
    
    /** 
     * Will load data from storage to application;
     * This assumes the following:
     * 1.) the app has no data yet; previously unloaded by browser
     * 2.) verified no internet
     * 3.) the bearer token is available but not verified if still valid.
     * 4.) The loading of data manually executes what navigation.setPageData() is doing.
     * 5.) Note the data saved in storage is already processed not the raw data 
     *      passed from server to client. Therefore cannot call 
     *      navigation.setPageData().
     * 
     * See the individual modules with  getDataToSaveToStorage() method, 
     * what data is actually saved to storage. These modules are major components
     * where pages read on these pages. 
     * */
    this.loadDataFromStorageToApp = function(local_data){
        let cur_data = null;
        
        // Load data to navigation
        cur_data = local_data[navigation.STORAGE_KEY];
        navigation.setDataApplication(cur_data.dataApplication);
        
        
        // Load data to navigation.userControl
        cur_data = local_data[navigation.userControl.STORAGE_KEY];
        navigation.setDataUserAccount(cur_data.userAccount);
        
        
        // Load data to navigation.managerAddress
        navigation.managerAddress.loadDataFromStorage();
        
        
        // Set Pig Farm
        const user_current_farm = navigation.userControl.getCurrentFarm();
        navigation.pigFarm.setDataPigFarm(user_current_farm);
        
        
        // Load data to navigation.pigFarm
        navigation.pigFarm.loadDataFromStorage();
        
        
        // Load data to navigation.pigFarm.managerSowBoar
        navigation.pigFarm.managerSowBoar.loadDataFromStorage();
        
        
        // Load data to navigation.pigFarm.managerPigProd
        navigation.pigFarm.managerPigProd.loadDataFromStorage();
        
        
        // Load data to navigation.pageAccPigOpsList
        navigation.pageAccPigOpsList.loadDataFromStorage();
        
        console.log('\n\nManagerLocalData.loadDataFromStorageToApp(); Success: local data loaded to app');
    }

}



