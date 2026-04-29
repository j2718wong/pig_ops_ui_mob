// March 28, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function ManagerLocalData(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    this.saveAppDataBeforePageUnload = function(){
        // Need to pass this around, ask different modules to save what they 
        // want to save;
        const app_data_to_save = {};
        
        navigation.addDataToSaveBeforePageUnload(app_data_to_save);
        
    }
    

}



