// February 11, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiSelectWithEntryCount} from '../../common/ui/select_with_entry_count.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';



export function ComponentPigDeadType(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              'medvac-add-edit-brand-name',

    
        labelSelect:            'Select Feed Type',
        helpText:               null

    }
    */
    
    
       
    UiSelectWithEntryCount.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    
    let dataPigDeadTypeList    = null;
    
    
     
   
    const commonSelectOptions   = new CommonSelectOptions(navigation);
    

    this.setDataPigDeadType = function(data, selected_entry_value){
        dataPigDeadTypeList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataPigDeadTypeList(dataPigDeadTypeList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // Check if there is a public data dataPigDeadTypeList 
        const harvest_type_list = navigation.managerPublicData.dataPigDeadTypeList;
        if (harvest_type_list == null){
            
            const callback_success = function(data){
                thisObj.setDataPigDeadType(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.managerPublicData.requestDataPigDeadType(callback_success, 
                elem_show_error);
        }
        else{
            thisObj.setDataPigDeadType(harvest_type_list);
        }
    }
    
}


