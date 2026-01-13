// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiInputTextWithCounter}   from '../../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable} from '../../common/ui/select_with_add_expandable.js';



ComponentMedVacBrand.prototype = new UiSelectWithAddExpandable();
function ComponentMedVacBrand(input_settings){
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
    
    
    
    ComponentMedVacBrand.call(this, input_settings);
    
    const navigation        = input_settings.navigation;
    
    
    const thisObj           = this;
    
    
    const MAXCHAR_MEDVAC_BRAND_NAME   = 50;
    
    
    const elemUiMedVacBrandName   = new UiInputTextWithCounter({
                                    uniqueKey:      'medvac-add-edit-brand-name',
                                    className:      'form-group',
                                    textLabel:      'Brand Name',
                                    textMaxChars:   MAXCHAR_MEDVAC_BRAND_NAME,
                                    textHelpText:   ''
                                });
    
    input_settings.htmlExpandSection = elemUiMedVacBrandName.getHtml();
    
    
    let dataMedVacBrandList     = null;
    
    let elemMedVacBrandName     = null;
    
    
    // This needs to be set
    this.commonSelectOptions    = null;
    
    
    this.afterHtmlRender = function(){
        // This need to be called first
        elemUiMedVacBrandName.afterHtmlRender();
        
        
        // Call the parent afterHtmlRender
        this.prototype.afterHtmlRender();
        
        
        elemMedVacBrandName = elemUiMedVacBrandName.getElemText();
        
        const elemSaveMedVacBrand = this.getElemEntrySave();
        elemSaveMedVacBrand.addEventListener('click', thisObj.onClickSave);
    }
    
    
    this.setDataMedVacBrand = function(data){
        dataMedVacBrandList = data;
        
        thisObj.commonSelectOptions.setDataMedVacBrand(dataMedVacBrandList, 
            thisObj.getElemSelect());
        thisObj.setEntryCount(data);
    }
    
    
    this._getMedVacBrand = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
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
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        let input_name      = elemMedVacBrandName.value.trim();
        
        input_elem          = elemMedVacBrandName;
        
        if (input_name.length > 0){
            // check for duplicates
            const cur_medvac_brand = thisObj._getMedVacBrand(input_name);
            if (cur_medvac_brand != null){
                is_duplicate = 1;
            }
        }
        else{
            validation = -1;
        }
        
        
        if (validation != FIELD_VALIDATION_OK){
            if (is_duplicate > 0){
                elemMedVacBrandNameInv.textContent = 'Duplicate entry.';
            }
            else{
                elemMedVacBrandNameInv.textContent = 'Please enter a valid name.';
            }
            
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
            if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
            
        }
        
        
        if (proceed_to_save == 0) {return;}
        
        
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
                    const callback_success = function(data){
                        thisObj.setDataMedVacBrand(data);
                    };
                    
                    
                    navigation.managerPublicData.requestDataMedVacBrand(
                        callback_success, elemServerErrorMsg)
                }
                else{
                    navigation.errorServerMessage.receivedErrorMessage(response,
                        elemServerErrorMsg);
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });

        
    }
    
}


