// February 11, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiSelectWithEntryCount} from '../../common/ui/select_with_entry_count.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';



export function ComponentHarvestType(input_settings){
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
    
    
    
    let dataHarvestTypeList    = null;
    
    
     
   
    const commonSelectOptions   = new CommonSelectOptions(navigation);
    

    this.setDataHarvestType = function(data, selected_entry_value){
        dataHarvestTypeList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataHarvestTypeList(dataHarvestTypeList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // Check if there is a public data dataHarvestTypeList 
        const harvest_type_list = navigation.managerPublicData.dataHarvestTypeList;
        if (harvest_type_list == null){
            
            const callback_success = function(data){
                thisObj.setDataHarvestType(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.managerPublicData.requestDataHarvestType(callback_success, 
                elem_show_error);
        }
        else{
            thisObj.setDataHarvestType(harvest_type_list);
        }
    }
    
}


