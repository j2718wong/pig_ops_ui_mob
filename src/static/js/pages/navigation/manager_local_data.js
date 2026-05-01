// March 28, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function ManagerLocalData(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    
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
        
        
        // navigation.pigFarm.managerSowBoar saved local data
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
     * Will check if needed to request pigFarm data; 
     * This is assumed that the previous navigation.managerSystem.connectionTest() 
     * call was already successful.
     * 
     * 
     * If this returns true, the method navigation.requestInitialPigFarmData(bearer_token)
     * will be called and will perform the normal process of requesting pig farm 
     * data from server.
     * 
     * 
     * Will return true if needed to request data; returns false otherwise.
     * */
    this.checkIfToRequestPigFarmData = function(local_data){
        /*
        console.log('checkIfToRequestPigFarmData; local_data');
        console.log(local_data);
        
        
        // At this point the local_data is not yet loaded into the application
        
        if (local_data == null){return true;}
        
        // Check if navigation.getDataToSaveToStorage() data is saved
        if (local_data[navigation.STORAGE_KEY] == null){return true;}
        
        // Check if navigation.userControl.getDataToSaveToStorage() data is saved 
        if (local_data[navigation.userControl.STORAGE_KEY] == null){return true;}
        
        // Check if navigation.pigFarm.getDataToSaveToStorage() data is saved
        if (local_data[navigation.pigFarm.STORAGE_KEY] == null){return true;}
        
        
        // At this point, the navigation.pigFarm.getDataToSaveToStorage() data
        // is available and saved in storage. But not yet loaded to app
        const data_pig_farm = local_data[navigation.pigFarm.STORAGE_KEY];
        
        console.log(`\n\ndata_pig_farm from storage`);
        console.log(data_pig_farm);
        
        
        // Get pig_farm_hid saved in storage
        let saved_pig_farm_hid = data_pig_farm.pigFarm.pig_farm.hid;
        */
        
        
        /* Typical navigation.pigFarm.dataVerNum
        navigation.pigFarm.dataVerNum             = {
            sow:                    0,
            boar:                   0,
            pig_prod:               0,
            prod_history:           0,
            staff:                  0,
            feed_buy:               0,
            feed_balance:           0,
            not_pregnant:           0,
            boar_ext_mate:          0,
            pig_dead:               0
        };
        */
        
        /*
        let saved_pig_farm_ver_num = data_pig_farm.verNum;
        
        
        const callback_success = function(data){
            // The data structure is should be same to navigation.pigFarm.dataVerNum ;
            
            console.log('requestPigFarmDataVerNum data');
            console.log(data)
            
            // Compare data to navigation.pigFarm.dataVerNum 
            // Only the objects are compared;
            //
            // sow
            // boar
            
            
             
            
            
        };
        
        
        // Request pig_farm data version numbers
        navigation.pigFarm.requestPigFarmDataVerNum(saved_pig_farm_hid, 
            callback_success);
        
        
        
        return false;
        * 
        * */
    }
    
    
    
    /** 
     * Will load data from storage to application;
     * This assumes the follwoing:
     * 1.) the app has no data yet
     * 2.) verified no internet
     * 3.) the bearer token is available but not verified if still valid.
     * 4.) The loading of data manually execute what navigation.setPageData() is doing.
     * 5.) Note the data saved in storage is already processed not the raw data 
     *      passed from server to client. Therefore cannot call 
     *      navigation.setPageData().
     * 
     * See the individual getDataToSaveToStorage() method, what data is actually
     * saved to storage. 
     * */
    this.loadDataFromStorageToApp = function(local_data){
        let cur_data = null;
        
        // Load data to navigation
        cur_data = local_data[navigation.STORAGE_KEY];
        navigation.setDataApplication(cur_data.dataApplication);
        
        
        // Load data to navigation.userControl
        cur_data = local_data[navigation.userControl.STORAGE_KEY];
        navigation.setDataUserAccount(cur_data.userAccount);
        
        
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
        
        
    }

}



