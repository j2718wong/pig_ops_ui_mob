// February 11, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiSelectWithEntryCount} from '../../common/ui/select_with_entry_count.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';


export function ComponentFeedType(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              'medvac-add-edit-brand-name',

    
        labelSelect:            'Select Feed Type',
        helpText:               null

    }
    */
    
    
    // These are manually hashed feed_type.id
    const DEFAULT_UNIT_WEIGHT = {
        "Q92W83":  50,
        "EKQY8R":  50,
        "0KP5K7":  1,
        "1K7D9J":  25,
        "08DZKQ":  50,
        "M9ZN9G":  50,
        "M8BE8P":  50
    };
    

    
    UiSelectWithEntryCount.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    
    let dataFeedTypeList    = null;
    
    
    let elemWeightPerUnit   = null;
   
   
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.setElemWeightPerUnit = function(elem){
        elemWeightPerUnit = elem;
        
        const elem_select = thisObj.getElemSelect();
        
        
        elem_select.onchange = function(){
            const feed_type_hid = elem_select.value;
            
            const default_weight_per_unit = DEFAULT_UNIT_WEIGHT[feed_type_hid];
            if (default_weight_per_unit){
                elemWeightPerUnit.value = default_weight_per_unit;
            }
        };
        
    }

    
    this.setDataFeedType = function(data, selected_entry_value){
        dataFeedTypeList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataFeedTypeList(dataFeedTypeList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // Check if there is a public data dataFeedTypeList 
        const feed_type_list = navigation.managerPublicData.dataFeedTypeList;
        if (feed_type_list == null){
            
            const callback_success = function(data){
                thisObj.setDataFeedType(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.managerPublicData.requestDataFeedType(callback_success, 
                elem_show_error);
        }
        else{
            thisObj.setDataFeedType(feed_type_list);
        }
    }
    
}


