// January 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}     from '../../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../../../common/common_select_options.js';

import {addValidationClassToElem}   from '../../../common/ui/ui_utils.js';

import {APPLICATION}                from '../../../../constants.js';


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
    
    
    const thisObj           = this;
    const parentObj         = input_settings.parentObj;
    const navigation        = input_settings.navigation;
    
    
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
    
    
    let supplierHid             = null;
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
    
    
    this.setSupplierHid = function(supplier_hid){
        supplierHid = supplier_hid;
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
        let validation      = 0;
        
        let is_duplicate    = 0;
        
        input_elem          = thisObj.getElemSelect();
        let input_name      = elemSemenType.value.trim();
        
       
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_semen_type = thisObj.getSemenType(input_name);
            if (cur_semen_type != null){
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
            'uhid':                 user_hid,
            'semen_supplier_hid':   supplierHid,
            'name':                 input_name
        };
        
        
        
        

        // Element where to display server error message in this component
        const elemServerErrorMsg = thisObj.getElemServerErrorMsg();
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: `${base_url}/semen_sup_semen/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const semen_sup_semen_hid = response.semen_sup_semen.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataSemenTypeList(data, semen_sup_semen_hid);
                        thisObj.closeExpandable();
                    };
                    
                    navigation.managerPublicData.requestDataSemenSupplierSemen(
                        supplierHid, callback_success, elemServerErrorMsg);
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


