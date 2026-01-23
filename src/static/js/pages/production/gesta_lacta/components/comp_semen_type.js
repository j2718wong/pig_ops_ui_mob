// January 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}     from '../../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../../../common/common_select_options.js';

import {addValidationClassToElem}   from '../../../common/ui/ui_utils.js';


export function ComponentSemenType(input_settings){
    /*
    Typical settings
    {
        navigation:         navigation,
        parentObj:          thisObj,
        uniqueKey:          'prod-add-gesta-semen-type',

        titleExpandSection: 'Add New Semen Type',
        htmlExpandSection:  null,
        labelBtnExpandSave: 'Save Semen Type',
        
        labelSelect:        'Select Semen Type',
        helpText:           'Supplier Semen Type'

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    const parentObj         = input_settings.parentObj;
    
    const MAXCHAR_SEMEN_TYPE_NAME   = 50;
    
    
    const elemUiSemenType   = new UiInputTextWithCounter({
                                uniqueKey:      input_settings.uniqueKey,
                                className:      'form-group',
                                textLabel:      'Semen Type',
                                isRequired:     true,
                                textMaxChars:   MAXCHAR_SEMEN_TYPE_NAME,
                                invalidFeedBack: 'Please enter a valid name.',
                                textHelpText:   'Semen Product Name'
                            });
    
    input_settings.htmlExpandSection = elemUiSemenType.getHtml();
    
    
    let dataSemenTypeList       = null;
    
    let elemSemenType           = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiSemenType.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemSemenType = elemUiSemenType.getElemText();
        
        const elemSaveSemenType = this.getElemEntrySave();
        elemSaveSemenType.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiSemenType.reset()
        }
    }
    
    
    this.setDataSemenTypeList = function(data, selected_entry_value){
        dataSemenTypeList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataSemenTypeList(dataSemenTypeList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.getSemenType = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataSemenTypeList == null){return null;}
        
        for (index = 0; index < dataSemenTypeList.length; index++){
            cur_entry = dataSemenTypeList[index];
            
            // Will check name for duplicate 
            if (cur_entry.name.toUpperCase() == upper_name){
                if (exclude_hid){
                    if (cur_entry.hid != exclude_hid){
                        return cur_entry;
                    }
                }
                
                else{
                    return cur_entry;
                }
            }
        }
        
        return null;
    }
    
    
    this.onClickSave = function(){
        let input_elem      = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
		input_elem          = thisObj.getElemSelect();
        let input_name      = elemSemenType.value.trim();
        
       
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_semen_type = thisObj.getSemenType(input_name);
            if (cur_medvac_type != null){
                validation   = -1;
                is_duplicate = 1;
            }
        }
        else{
            validation = -1;
        }
        
        
        if (validation != 0){
            if (is_duplicate > 0){
                elemUiSemenType.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiSemenType.setTextInvalid('Please enter a valid name.');
            }
        }
        addValidationClassToElem(input_elem, validation);
        
        
        if (validation != 0) {return;}
        
        
        // Check if user_account_hid is same with farm_account_hid;
        const user_account_hid = navigation.userControl.getUserAccountHid();
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        
        if (user_account_hid != farm_account_hid){
            console.log('User account_hid not equal to farm_account_hid');
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        
        
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_name
        };
        
        
        // Append medvac_brand_hid and medvac_type_hid if there is any
        const brand_type = parentObj.getMedVacBrandAndTypeHid();
        if (brand_type){
            if (brand_type.brand_hid && brand_type.brand_hid.length > 2){
                post_data.medvac_brand_hid = brand_type.brand_hid;
            }
            
            if (brand_type.type_hid && brand_type.type_hid.length > 2){
                post_data.medvac_type_hid = brand_type.type_hid;
            }
        }
        

        // Element where to display server error message in this component
        const elemServerErrorMsg = thisObj.getElemServerErrorMsg();
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/account_medvac/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const account_medvac_hid = response.account_medvac.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataSemenTypeList(data, account_medvac_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.pigFarm.accountLists.requestDataSemenType(
                        callback_success, elemServerErrorMsg)
                }
                else{
                    navigation.serverError.receivedErrorMessage(response,
                        elemServerErrorMsg);
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });

        
    }
    
}


