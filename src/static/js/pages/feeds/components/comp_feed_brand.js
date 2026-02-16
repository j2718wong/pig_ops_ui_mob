// February 11, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable}  from '../../common/ui/select_with_add_expandable.js';

import {CommonSelectOptions}        from '../../common/common_select_options.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {APPLICATION}                from '../../../constants.js';




export function ComponentFeedBrand(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              'medvac-add-edit-brand-name',

        titleExpandSection:     'Add New Feed Brand',
        htmlExpandSection:      null,
        labelBtnExpandSave:     'Save Feed Brand',
        
        labelSelect:            'Select Feed Brand',
        helpText:               'Feed Brand'

    }
    */
    
    

    
    UiSelectWithAddExpandable.call(this, input_settings);
    
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    const MAXCHAR_FEED_BRAND_NAME   = 50;
    
    
    const elemUiFeedBrandName   = new UiInputTextWithCounter({
                                    uniqueKey:      input_settings.uniqueKey,
                                    className:      'form-group',
                                    textLabel:      'Brand Name',
                                    isRequired:     true,
                                    textMaxChars:   MAXCHAR_FEED_BRAND_NAME,
                                    invalidFeedBack: 'Please enter a valid name.',
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiFeedBrandName.getHtml();
    
    
    let dataFeedBrandList     = navigation.managerPublicData.dataFeedBrandList;
    
    let elemFeedBrandName     = null;
    
    
    // This needs to be set
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiFeedBrandName.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        thisObj.afterHtmlRenderExpandable();
        
        
        elemFeedBrandName = elemUiFeedBrandName.getElemText();
        
        const elemSaveFeedBrand = this.getElemEntrySave();
        elemSaveFeedBrand.addEventListener('click', thisObj.onClickSave);
        
        
        this.callbackBeforeExpand = function(){
            elemUiFeedBrandName.reset()
        }
    }
    
    
    this.setDataFeedBrand = function(data, selected_entry_value){
        dataFeedBrandList = data;
        
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataFeedBrandList(dataFeedBrandList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        // Check if there is a public data dataFeedBrandList and dataMedVacTypeList
        const feed_brand_list = navigation.managerPublicData.dataFeedBrandList;
        if (feed_brand_list == null){
            
            const callback_success = function(data){
                thisObj.setDataFeedBrand(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.managerPublicData.requestDataFeedBrand(callback_success, 
                elem_show_error);
        }
        else{
            thisObj.setDataFeedBrand(feed_brand_list);
        }
    }
    
    
    this._getEntryByName = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataFeedBrandList == null){return null;}
        
        for (index = 0; index < dataFeedBrandList.length; index++){
            cur_entry = dataFeedBrandList[index];
            
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
        
       
        let input_name      = elemFeedBrandName.value.trim();
        
       
        input_elem          = elemFeedBrandName;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_feed_brand = thisObj._getEntryByName(input_name);
            if (cur_feed_brand != null){
                validation   = -1;
                is_duplicate = 1;
            }
        }
        else{
            validation = -1;
        }
        
        
        if (validation != 0){
            if (is_duplicate > 0){
                elemUiFeedBrandName.setTextInvalid('Duplicate entry.');
            }
            else{
                elemUiFeedBrandName.setTextInvalid('Please enter a valid name.');
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
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: `${base_url}/feed_brand/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const feed_brand_hid = response.feed_brand.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataFeedBrand(data, feed_brand_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.managerPublicData.requestDataFeedBrand(
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


