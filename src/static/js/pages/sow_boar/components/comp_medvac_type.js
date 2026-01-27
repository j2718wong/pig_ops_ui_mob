// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter} from '../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable} from '../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';

import {addValidationClassToElem} from '../../common/ui/ui_utils.js';


export function ComponentMedVacType(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              'medvac-add-edit-type',

        titleExpandSection:     'Add New MedVac Type',
        htmlExpandSection:      null,
        labelBtnExpandSave:     'Save MedVac Type',
        
        labelSelect:            'Select MedVac Type',
        helpText:               'MedVac type name or manufacturer'

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    const MAXCHAR_MEDVAC_TYPE   = 50;
    
    
    const elemUiMedVacTypeName   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      'MedVac Type',
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_MEDVAC_TYPE,
                                    invalidFeedBack: 'Please enter a valid type.',
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiMedVacTypeName.getHtml();
    
    
    let dataMedVacTypeList     = navigation.managerPublicData.dataMedVacTypeList;
    
    let elemMedVacTypeName     = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiMedVacTypeName.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemMedVacTypeName = elemUiMedVacTypeName.getElemText();
        
        const elemSaveMedVacType = this.getElemEntrySave();
        elemSaveMedVacType.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiMedVacTypeName.reset()
        }
    }
    
    
    this.setDataMedVacType = function(data, selected_entry_value){
        dataMedVacTypeList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataMedVacType(dataMedVacTypeList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        const medvac_type_list = navigation.managerPublicData.dataMedVacTypeList;
        if (medvac_type_list == null){
            
            const callback_success = function(data){
                thisObj.setDataMedVacType(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.managerPublicData.requestDataMedVacType(callback_success, 
                elem_show_error);
        }
        else{
            thisObj.setDataMedVacType(medvac_type_list);
        }
        
    }
    
    
    this._getMedVacType = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataMedVacTypeList == null){return null;}
        
        for (index = 0; index < dataMedVacTypeList.length; index++){
            cur_entry = dataMedVacTypeList[index];
            
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
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        let input_name      = elemMedVacTypeName.value.trim();
        
       
        input_elem          = elemMedVacTypeName;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_medvac_type = thisObj._getMedVacType(input_name);
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
                elemUiMedVacTypeName.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiMedVacTypeName.setTextInvalid('Please enter a valid name.');
            }
        }
        addValidationClassToElem(input_elem, validation);
        
        
        if (validation != 0) {return;}
        
        
        const user_hid      = navigation.userControl.getUserHid();
        
        
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_name
        };


        // Element where to display server error message in this component
        const elemServerErrorMsg = thisObj.getElemServerErrorMsg();
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/medvac_type/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const medvac_type_hid = response.medvac_type.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataMedVacType(data, medvac_type_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.managerPublicData.requestDataMedVacType(
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


