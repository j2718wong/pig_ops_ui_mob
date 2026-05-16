// comp_acc_medvac.js

// January 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../../common/common_select_options.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {APPLICATION}                from '../../../constants.js';



export function ComponentAccMedVac(input_settings){
    /*
    Typical settings
    {
        navigation:         navigation,
        parentObj:          thisObj,
        uniqueKey:          'medvac-add-edit-acc-medvac',

        titleExpandSection: 'Add New MedVac Name',
        htmlExpandSection:  null,
        labelBtnExpandSave: 'Save MedVac Name',
        
        labelSelect:        'Select MedVac Name',
        helpText:           'MedVac product name'

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    const parentObj         = input_settings.parentObj;
    
    const MAXCHAR_MEDVAC_NAME   = 50;
    
    
    let label_medvac_name       = 'MedVac Product Name';
    let label_valid_name        = 'Please enter a valid name.';
    let label_duplicate_entry   = 'Duplicate entry'; 
    
    const helper = navigation.managerTranslations.translationHelper;
    
    
    // Common labels
    label_valid_name        = helper.getSimpleTranslation('common.labels.valid_name') || label_valid_name;
    label_duplicate_entry   = helper.getSimpleTranslation('common.labels.duplicate_entry') || label_duplicate_entry;
    
    label_medvac_name       = helper.getSimpleTranslation('common.labels.medvac_name') || label_medvac_name;
    
    
    
    const elemUiAccMedVac   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      label_medvac_name,
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_MEDVAC_NAME,
                                    invalidFeedBack: label_valid_name,
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiAccMedVac.getHtml();
    
    
    let dataAccMedVacList       = null;
    
    let elemAccMedVac           = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions(navigation);
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiAccMedVac.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemAccMedVac = elemUiAccMedVac.getElemText();
        
        const elemSaveAccMedVac = this.getElemEntrySave();
        elemSaveAccMedVac.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiAccMedVac.reset()
        }
    }
    
    
    this.setDataAccMedVacList = function(data, selected_entry_value){
        dataAccMedVacList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataAccMedVacList(dataAccMedVacList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // check if there is an account dataAccMedVac
        const acc_medvac_list = navigation.pigFarm.accountLists.dataAccMedVac;
        if (acc_medvac_list == null){
            
            const callback_success = function(data){
                thisObj.setDataAccMedVacList(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.pigFarm.accountLists.requestDataAccMedVac(callback_success, 
                elem_show_error);
        
        }
        else{
            thisObj.setDataAccMedVacList(data);
        }
        
    }
    
    
    this.getEntryByName = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataAccMedVacList == null){return null;}
        
        for (index = 0; index < dataAccMedVacList.length; index++){
            cur_entry = dataAccMedVacList[index];
            
            // Will check name for duplicate 
            if (cur_entry.acc_medvac.name.toUpperCase() == upper_name){
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
        
       
        let input_name      = elemAccMedVac.value.trim();
        
       
        input_elem          = elemAccMedVac;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_medvac_type = thisObj.getEntryByName(input_name);
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
                elemUiAccMedVac.setTextInvalid(label_duplicate_entry);
            }
            else{
                elemUiAccMedVac.setTextInvalid(label_valid_name);
            }
        }
        addValidationClassToElem(input_elem, validation);
        
        
        if (validation != 0) {return;}
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
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
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: `${base_url}/account_medvac/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const account_medvac_hid = response.account_medvac.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataAccMedVacList(data, account_medvac_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.pigFarm.accountLists.requestDataAccMedVac(
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


