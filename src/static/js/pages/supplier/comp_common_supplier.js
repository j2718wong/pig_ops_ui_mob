// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID,
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
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    
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
    
    
    let curSupplierType     = null;
    
    let dataSupplerListLevel2 = null;
    let dataSupplierList    = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiSupplierName.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemSupplierName = elemUiSupplierName.getElemText();
        
        const elemSaveSupplier = this.getElemEntrySave();
        elemSaveSupplier.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiSupplierName.reset()
        }
    }
    
    
    this.setSupplierType = function(supplier_type){
        let title = '';
        
        curSupplierType = supplier_type;
        
        switch(curSupplierType){
            case SUPPLIER_TYPE.FEED: {
                title = 'Add Feed Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN: {
                title = 'Add Semen Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.GILT: {
                title = 'Add Gilt Supplier';
                break;
            }
        }
        
        const elem_title = thisObj.getElemExpandSectionTitle();
        elem_title.textContent = title;
    }
    
    
    this.setDataSupplierListLevel2 = function(data){
        dataSupplerListLevel2 = data;
    }
    
    
    this.setDataSupplier = function(data, selected_entry_value){
        dataSupplierList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataSupplierList(dataSupplierList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.getDuplicateSupplier = function(level_3_hid, input_name){
        /*
        A supplier can be either be
        - a feed supplier
        - a gilt supplier
        - semen supplier
        
        case 1:
            if a new supplier with same address levels and same supplier type 
            and same input_name should be considered duplicate.
            
            if a new supplier with same address levels and same input_name 
            but different supplier type should not be considered as duplicate.
            but the supplier flags should be updated 
            
        */
        
        
        let upper_name = input_name.toUpperCase();
        
        if (level_3_hid){
            
            for (const cur_entry of dataSupplerListLevel2){
                if (cur_entry.location.address.level_3.hid == level_3_hid){
                    if (cur_entry.supplier.name.toUpperCase() == upper_name){
                        return cur_entry;
                    }
                }
            }
        }
        else{
            for (const cur_entry of dataSupplerListLevel2){
                if (cur_entry.supplier.name.toUpperCase() == upper_name){
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
        
       
        let input_name      = elemSupplierName.value.trim();
        
       
        input_elem          = elemSupplierName;
        
        // Get address_hids first
        const address_hids  = parentObj.getAddressHids();

        
        if (address_hids.level_3_hid == '0' || address_hids.level_3_hid == '-1') {
            address_hids.level_3_hid = null;
        }
        
        
        let cur_duplicate_supplier  = null;
        let update_supplier_flag    = 0;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            cur_duplicate_supplier  = thisObj.getDuplicateSupplier(
                address_hids.level_3_hid, input_name);
                
            if (cur_duplicate_supplier) {
                switch(curSupplierType){
                    case SUPPLIER_TYPE.FEED: {
                        if (cur_supplier.supplier.is_fs > 0){
                            is_duplicate = 1;
                            validation = -1;
                        }
                        else{
                            update_supplier_flag = 1;
                        }
                        break;
                    }
                    
                    case SUPPLIER_TYPE.SEMEN: {
                        if (cur_supplier.supplier.is_ss > 0){
                            is_duplicate = 1;
                            validation = -1;
                        }
                        else{
                            update_supplier_flag = 1;
                        }
                        break;
                    }
                    
                    case SUPPLIER_TYPE.GILT: {
                        if (cur_supplier.supplier.is_gs > 0){
                            is_duplicate = 1;
                            validation = -1;
                        }
                        else{
                            update_supplier_flag = 1;
                        }
                        break;
                    }
                }
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
        
        const base_url      = window.location.origin;


        let url = null;
        let post_data = null;
        
        
        if (cur_duplicate_supplier == null){
        
            url = `${base_url}/supplier/add`;
        
            // send post request
            post_data = {
                'uhid':             user_hid,
                'country_hid':      address_hids.country_hid,
                'level_1_hid':      address_hids.level_1_hid,
                'level_2_hid':      address_hids.level_2_hid,
                'level_3_hid':      address_hids.level_3_hid,
                'name':             input_name
            };
            
            
            if (post_data.level_3_hid == null){
                delete post_data.level_3_hid;
            }
            
            
            switch(curSupplierType){
                case SUPPLIER_TYPE.FEED: {
                    post_data.is_feed_supplier = 1;
                    break;
                }
                
                case SUPPLIER_TYPE.SEMEN: {
                    post_data.is_semen_supplier = 1;
                    break;
                }
                
                case SUPPLIER_TYPE.GILT: {
                    post_data.is_gilt_supplier = 1;
                    break;
                }
            }
            
        }
        
        else{
            url = `${base_url}/supplier/update`;
        
            const cur_supplier  = cur_duplicate_supplier.supplier;
            const cur_address   = cur_duplicate_supplier.location.address;
        
            // send post request
            post_data = {
                'uhid':             user_hid,
                
                'supplier_hid':     cur_supplier.hid,
                
                'level_3_hid':      address_hids.level_3_hid,
                'name':             cur_supplier.name,
                
                
            };
            
            // Copy supplier details
            if (cur_supplier.contact_number){
                post_data.contact_number = cur_supplier.contact_number;
            }
            
            if (cur_supplier.whatsapp){
                post_data.whatsapp = cur_supplier.whatsapp;
            }
            
            if (cur_supplier.messenger){
                post_data.messenger = cur_supplier.messenger;
            }
            
            if ('geoloc' in cur_address){
                post_data.latitude = cur_address.geoloc.latitude;
                post_data.longitude = cur_address.geoloc.longitude;
            }
            
            
            // Copy flags 
            post_data.is_feed_supplier = cur_supplier.is_fs;
            post_data.is_gilt_supplier = cur_supplier.is_gs;
            post_data.is_semen_supplier = cur_supplier.is_ss;
            
            
            // Update flag
            switch(curSupplierType){
                case SUPPLIER_TYPE.FEED: {
                    post_data.is_feed_supplier  = 1;
                    break;
                }
                
                case SUPPLIER_TYPE.SEMEN: {
                    post_data.is_semen_supplier = 1;
                    break;
                }
                
                case SUPPLIER_TYPE.GILT: {
                    post_data.is_gilt_supplier = 1;
                    break;
                }
            }
            
            
            
        }
        
        
        // Element where to display server error message in this component
        const elemServerErrorMsg = thisObj.getElemServerErrorMsg();
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.innerHTML = '';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.closeExpandable();
                    
                    const supplier_hid = response.supplier.hid;
                    parentObj.onSuccessAddSupplier(supplier_hid);
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


