// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';



import {UiInputTextWithCounter}     from '../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../common/common_select_options.js';

import {addValidationClassToElem}   from '../common/ui/ui_utils.js';


export function ComponentCommonSupplier(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              `${settings.uniqueKey}-add`,

        titleExpandSection:     'Add New Supplier',
        htmlExpandSection:      null,
        labelBtnExpandSave:     'Save New Supplier',
        
        labelSelect:            'Select Supplier',
        helpText:               null

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    const MAXCHAR_SUPPLIER_NAME   = 50;
    
    
    const elemUiSupplierName   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      'Supplier Name',
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_SUPPLIER_NAME,
                                    invalidFeedBack: 'Please enter a valid name.',
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiSupplierName.getHtml();
    
    
  
    
    let elemSupplierName     = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiSupplierName.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemSupplierName = elemUiSupplierName.getElemText();
        
        //const elemSaveMedVacBrand = this.getElemEntrySave();
        //elemSaveMedVacBrand.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiSupplierName.reset()
        }
    }
    
    
    this.setSupplierType = function(supplier_type){
        let title = '';
        
        switch(supplier_type){
            case SUPPLIER_TYPE.FEED: {
                title = 'Add New Feed Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN: {
                title = 'Add New Semen Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.GILT: {
                title = 'Add New Gilt Supplier';
                break;
            }
        }
        
        const elem_title = thisObj.getElemExpandSectionTitle();
        elem_title.textContent = title;
    }
    
    
    this.setDataSupplier = function(data, selected_entry_value){
        dataSupplierList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataSupplier(dataSupplierList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.getSupplier = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataSupplierList == null){return null;}
        
        for (index = 0; index < dataSupplierList.length; index++){
            cur_entry = dataSupplierList[index];
            
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
        
       
        let input_name      = elemSupplierName.value.trim();
        
       
        input_elem          = elemSupplierName;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_medvac_brand = thisObj.getSupplier(input_name);
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
                elemUiSupplierName.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiSupplierName.setTextInvalid('Please enter a valid name.');
            }
        }
        addValidationClassToElem(input_elem, validation);
        
        
        if (validation != 0) {return;}
        
        
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
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/medvac_brand/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const medvac_brand_hid = response.medvac_brand.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataSupplier(data, medvac_brand_hid);
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


