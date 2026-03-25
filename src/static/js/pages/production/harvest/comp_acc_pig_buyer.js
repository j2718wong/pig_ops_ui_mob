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



/**
 * Note: account_pig_buyer and boar_customer are saved in the same back end table.
 * 
 * */

export function ComponentAccPigBuyer(input_settings){
    /*
    Typical settings
    {
        navigation:         navigation,
        parentObj:          thisObj,
        uniqueKey:          'acc-pig-buyer',

        isBoarCustomer:     false,

        titleExpandSection: 'Add Pig Buyer',
        htmlExpandSection:  null,
        labelBtnExpandSave: 'Save Pig Buyer',
        
        labelSelect:        'Select Pig Buyer',
        helpText:           null

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    const parentObj         = input_settings.parentObj;
    
    const MAXCHAR_CUSTOMER_NAME   = 50;
    
    
    const elemUiAccPigBuyer   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      'Customer Name',
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_CUSTOMER_NAME,
                                    invalidFeedBack: 'Please enter a valid name.',
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiAccPigBuyer.getHtml();
    
    
    let isBoarCustomer          = false;
    
    if (input_settings.isBoarCustomer){
        isBoarCustomer = input_settings.isBoarCustomer;
    }
    
    let dataAccPigBuyerList     = null;
    
    let elemAccPigBuyer         = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiAccPigBuyer.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemAccPigBuyer = elemUiAccPigBuyer.getElemText();
        
        const elemSaveAccPigBuyer = this.getElemEntrySave();
        elemSaveAccPigBuyer.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiAccPigBuyer.reset()
        }
    }
    
    
    this.setDataAccPigBuyerList = function(data, selected_entry_value){
        dataAccPigBuyerList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataAccPigBuyerList(dataAccPigBuyerList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // The pig_buyer_list here can mean pig buyer
        // or boar customer
        
        let pig_buyer_list = null;
        
        let account_lists = navigation.pigFarm.accountLists;
        if (isBoarCustomer){
            pig_buyer_list = account_lists.dataAccBoarCustomerList;
        }
        else{
            pig_buyer_list = account_lists.dataAccPigBuyerList;
        }
        
        if (pig_buyer_list == null){
            
            const callback_success = function(data){
                let account_lists = navigation.pigFarm.accountLists;
                if (isBoarCustomer){
                    pig_buyer_list = account_lists.dataAccBoarCustomerList;
                }
                else{
                    pig_buyer_list = account_lists.dataAccPigBuyerList;
                }
                
                thisObj.setDataAccPigBuyerList(pig_buyer_list);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.pigFarm.accountLists.requestDataAccPigBuyer(
                callback_success, elem_show_error);
        }
        else{
            thisObj.setDataAccPigBuyerList(pig_buyer_list);
        }
    }
    
    
    this.getEntryByName = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataAccPigBuyerList == null){return null;}
        
        for (index = 0; index < dataAccPigBuyerList.length; index++){
            cur_entry = dataAccPigBuyerList[index];
            
            // Will check name for duplicate 
            if (cur_entry.pig_buyer.name.toUpperCase() == upper_name){
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
        
       
        let input_name      = elemAccPigBuyer.value.trim();
        
       
        input_elem          = elemAccPigBuyer;
        
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
                elemUiAccPigBuyer.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiAccPigBuyer.setTextInvalid('Please enter a valid name.');
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
        
        if (isBoarCustomer){
            post_data.is_boar_customer = 1;
        }
        

        // Element where to display server error message in this component
        const elemServerErrorMsg = thisObj.getElemServerErrorMsg();
        
        // Note: boar_customer and account_pig_buyer shares same table

        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
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
                        let pig_buyer_list = null;
                        
                        let account_lists = navigation.pigFarm.accountLists;
                        if (isBoarCustomer){
                            pig_buyer_list = account_lists.dataAccBoarCustomerList;
                        }
                        else{
                            pig_buyer_list = account_lists.dataAccPigBuyerList;
                        }
                        
                        
                        thisObj.setDataAccPigBuyerList(pig_buyer_list, 
                                account_pig_buyer_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.pigFarm.accountLists.requestDataAccPigBuyer(
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


