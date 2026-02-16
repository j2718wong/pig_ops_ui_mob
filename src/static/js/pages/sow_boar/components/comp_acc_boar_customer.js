// January 20, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../../common/common_select_options.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';


import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS}                from '../../../constants.js';



export function ComponentAccBoarCustomer(input_settings){
    /*
    Typical settings
    {
        navigation:         navigation,
        parentObj:          thisObj,
        uniqueKey:          'acc-boar-customer',

        titleExpandSection: 'Add Boar Customer',
        htmlExpandSection:  null,
        labelBtnExpandSave: 'Save Boar Customer',
        
        labelSelect:        'Select Boar Customer',
        helpText:           'Neighbor who wants to breed with your boar'

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    const parentObj         = input_settings.parentObj;
    
    const MAXCHAR_CUSTOMER_NAME   = 50;
    
    
    const elemUiAccBoarCustomer   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      'Customer Name',
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_CUSTOMER_NAME,
                                    invalidFeedBack: 'Please enter a valid name.',
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiAccBoarCustomer.getHtml();
    
    
    let dataAccBoarCustomerList       = null;
    
    let elemAccBoarCustomer           = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiAccBoarCustomer.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemAccBoarCustomer = elemUiAccBoarCustomer.getElemText();
        
        const elemSaveAccBoarCustomer = this.getElemEntrySave();
        elemSaveAccBoarCustomer.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiAccBoarCustomer.reset()
        }
    }
    
    
    this.setDataAccBoarCustomer = function(data, selected_entry_value){
        dataAccBoarCustomerList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataAccBoarCustomer(dataAccBoarCustomerList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this._getAccBoarCustomer = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataAccBoarCustomerList == null){return null;}
        
        for (index = 0; index < dataAccBoarCustomerList.length; index++){
            cur_entry = dataAccBoarCustomerList[index];
            
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
        
       
        let input_name      = elemAccBoarCustomer.value.trim();
        
       
        input_elem          = elemAccBoarCustomer;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_medvac_type = thisObj._getAccBoarCustomer(input_name);
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
                elemUiAccBoarCustomer.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiAccBoarCustomer.setTextInvalid('Please enter a valid name.');
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
        
		// Note: boar_customer and account_pig_buyer shares same table
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: `${base_url}/account_pig_buyer/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const account_pig_buyer_hid = response.account_pig_buyer.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataAccBoarCustomer(data, account_pig_buyer_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.pigFarm.accountLists.requestDataAccBoarCustomer(
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


