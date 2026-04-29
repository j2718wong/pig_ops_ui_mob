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
     * If this returns true, the method navigation.requestPigFarmData(bearer_token)
     * will be called and will perform the normal process of requesting pig farm 
     * data from server.
     * 
     * 
     * Will return true if needed to request data; returns false otherwise.
     * */
    this.checkIfToRequestPigFarmData = function(local_data){
        
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
        // is available and saved in storage.
        const data_pig_farm = local_data[navigation.pigFarm.STORAGE_KEY];
        
        console.log(`data_pig_farm from storage`);
        console.log(data_pig_farm);
        
        
        
        // Request 
        
        return false;
    }
    
    
    
    /** Will load data from storage to application;*/
    this.loadDataFromStorageToApp = function(local_data){
        let cur_data = null;
        
        cur_data = local_data[navigation.STORAGE_KEY];
        
        
    }

}



