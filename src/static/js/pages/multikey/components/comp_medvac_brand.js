// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../../common/common_select_options.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {APPLICATION}                from '../../../constants.js';



export function ComponentMedVacBrand(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              'medvac-add-edit-brand-name',

        titleExpandSection:     'Add New MedVac Brand',
        htmlExpandSection:      null,
        labelBtnExpandSave:     'Save MedVac Brand',
        
        labelSelect:            'Select MedVac Brand',
        helpText:               'MedVac brand name or manufacturer'

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    const MAXCHAR_MEDVAC_BRAND_NAME   = 50;
    
    
    const elemUiMedVacBrandName   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      'Brand Name',
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_MEDVAC_BRAND_NAME,
                                    invalidFeedBack: 'Please enter a valid name.',
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiMedVacBrandName.getHtml();
    
    
    let dataMedVacBrandList     = navigation.managerPublicData.dataMedVacBrandList;
    
    let elemMedVacBrandName     = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions(navigation);
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiMedVacBrandName.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemMedVacBrandName = elemUiMedVacBrandName.getElemText();
        
        const elemSaveMedVacBrand = this.getElemEntrySave();
        elemSaveMedVacBrand.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiMedVacBrandName.reset()
        }
    }
    
    
    this.setDataMedVacBrandList = function(data, selected_entry_value){
        dataMedVacBrandList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataMedVacBrandList(dataMedVacBrandList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // Check if there is a public data dataMedVacBrandList and dataMedVacTypeList
        const medvac_brand_list = navigation.managerPublicData.dataMedVacBrandList;
        if (medvac_brand_list == null){
            
            const callback_success = function(data){
                thisObj.setDataMedVacBrandList(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.managerPublicData.requestDataMedVacBrand(callback_success, 
                elem_show_error);
        }
        else{
            thisObj.setDataMedVacBrandList(medvac_brand_list);
        }
    }
    
    
    this.getEntryByName = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataMedVacBrandList == null){return null;}
        
        for (index = 0; index < dataMedVacBrandList.length; index++){
            cur_entry = dataMedVacBrandList[index];
            
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
        
       
        let input_name      = elemMedVacBrandName.value.trim();
        
       
        input_elem          = elemMedVacBrandName;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_medvac_brand = thisObj.getEntryByName(input_name);
            if (cur_medvac_brand != null){
                validation   = -1;
                is_duplicate = 1;
            }
        }
        else{
            validation = -1;
        }
        
        
        if (validation != 0){
            if (is_duplicate > 0){
                elemUiMedVacBrandName.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiMedVacBrandName.setTextInvalid('Please enter a valid name.');
            }
        }
        addValidationClassToElem(input_elem, validation);
        
        
        if (validation != 0) {return;}
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const country_hid   = navigation.pigFarm.getCountryHid();
        
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'country_hid':      country_hid,
            'name':             input_name
        };


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
            url: `${base_url}/medvac_brand/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const medvac_brand_hid = response.medvac_brand.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataMedVacBrandList(data, medvac_brand_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.managerPublicData.requestDataMedVacBrand(
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


