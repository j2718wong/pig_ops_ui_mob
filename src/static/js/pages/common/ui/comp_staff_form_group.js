// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {updateCharCounter}      from '../page_view_basic.js'

import {CommonSelectOptions}    from '../common_select_options.js';

import {addValidationClassToElem} from './ui_utils.js';


export function ComponentStaffFormGroup(input_settings){
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        navigation:             navigation,
        
        includeAddNew:          true,
        includeDoneByMe:        true,
        
        titleExpandSection:     'Add New Staff',
        htmlExpandSection:      '',
        labelBtnExpandSave:     'Save New Staff',
        
        labelSelect:            ''
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    const navigation            = settings.navigation;
    
    const MAXCHAR_STAFF_NAME    = 50;
    
    const elemIdExpandSection   = `${settings.uniqueKey}-add-show`;
    const elemIdText            = `${settings.uniqueKey}-add-text`;
    const elemIdTextInv         = `${settings.uniqueKey}-add-text-inv`;
    const elemIdCharCounter     = `${settings.uniqueKey}-add-char-counter`;
        
    const elemIdServerErrorMsg  = `${settings.uniqueKey}-add-server-error`;
    const elemIdExpandCancel    = `${settings.uniqueKey}-add-cancel`;
    const elemIdExpandSave      = `${settings.uniqueKey}-add-save`;
    
    
    const elemIdSelectGroup     = `${settings.uniqueKey}-select-group`;
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
    
    const elemIdDoneByMeShow    = `${settings.uniqueKey}-done-by-me-show`;
    const elemIdChkDoneByMe     = `${settings.uniqueKey}-done-by-me`;
        
        
    let elemExpandSection       = null;
    let elemText                = null;
    let elemTextInv             = null;
    let elemCharCounter         = null;
    
    let elemServerErrorMsg      = null;
    let elemExpandCancel        = null;
    let elemExpandSave          = null;
    
    let elemSelectGroup         = null;
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
    
    let elemDoneByMeShow        = null;
    let elemChkDoneByMe         = null;
    
    
    let dataStaffList           = null;
    
    
    let isExpandSectionExpanded = false;
    
    const commonSelectOptions   = new CommonSelectOptions();
    
    
    this.getHtml = function(){
        
        
        let html_add_new = '';
        if (settings.includeAddNew){
            html_add_new = `
                <button class="btn" type="button" id="${elemIdEntryAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            `;
        }
        
        
        let html_done_by_me = '';
        if (settings.includeDoneByMe){
            html_done_by_me =`
            <!-- Done by Me Checkbox -->
            <div id="${elemIdDoneByMeShow}" class="checkbox-group">
                <input type="checkbox" id="${elemIdChkDoneByMe}">
                <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                    <i class="fas fa-user-check checkbox-icon"></i>
                    Done by Me
                </label>
            </div>
            `;
        }
        
        
        let is_required = true;
        
        
        let s_required = '';
        let s_required_mark = '';
        if (is_required){
            s_required = 'required';
            s_required_mark = `<span class="required">*</span>`;
        }
        
        
        
        return `
        <div class="form-group-select">
            <div class="expandable-section" id="${elemIdExpandSection}">
                <h5>${settings.titleExpandSection}</h5>
                
                <div class="form-group">
                    <label for="${elemIdText}" class="form-label">
                        Staff Name ${s_required_mark}
                        <span id="${elemIdCharCounter}" class="char-counter">0/${MAXCHAR_STAFF_NAME}</span>
                    </label>
                    <input  type="text" class="form-control" id="${elemIdText}" maxlength="${MAXCHAR_STAFF_NAME}" ${s_required}>
                    <div class="invalid-feedback" id="${elemIdTextInv}">Please enter a valid name. </div>
                    <div class="form-text"></div>
                </div>
                
                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                
                <button class="btn btn-cancel" id="${elemIdExpandCancel}">Cancel</button>
                <button class="btn btn-success" id="${elemIdExpandSave}">${settings.labelBtnExpandSave}</button>
            </div>
        
        
            <label for="${elemIdSelect}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id=${elemIdEntryCount}></span>
            </label>
            
            <div class="input-group" id="${elemIdSelectGroup}">
                <select class="form-select" id="${elemIdSelect}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                ${html_add_new}
            </div>
            
            <div class="invalid-feedback">
                Need to select if not done by you.
            </div>
            
            ${html_done_by_me}
            
            <div class="form-text">${settings.helpText}</div>
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        elemExpandSection       = document.getElementById(elemIdExpandSection);
        elemText                = document.getElementById(elemIdText);
        elemTextInv             = document.getElementById(elemIdTextInv);
        elemCharCounter         = document.getElementById(elemIdCharCounter);
        
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        elemExpandCancel        = document.getElementById(elemIdExpandCancel);
        elemExpandSave          = document.getElementById(elemIdExpandSave);
        
        elemSelectGroup         = document.getElementById(elemIdSelectGroup);
        elemSelect              = document.getElementById(elemIdSelect);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
        elemEntryAdd            = document.getElementById(elemIdEntryAdd);
        
        elemDoneByMeShow        = document.getElementById(elemIdDoneByMeShow);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
        
    }
    
    
    this._bindEventListeners = function(){
        if (settings.includeAddNew){
        
            elemText.addEventListener('input', function(){
                updateCharCounter(elemText, elemCharCounter, 
                    MAXCHAR_STAFF_NAME);
                
                elemText.classList.remove('is-invalid');
            });
            
            
            elemEntryAdd.addEventListener('click', function() {
                
                isExpandSectionExpanded = !isExpandSectionExpanded;
                
                if (isExpandSectionExpanded) {
                    elemExpandSection.classList.add('expanded');
                    elemExpandSection.style.marginBottom = '15px';
                    
                    elemServerErrorMsg.style.display = 'none';
                    
                } else {
                    elemExpandSection.classList.remove('expanded');
                    elemExpandSection.style.marginBottom = 0;
                }
                
            });
            
            
            elemExpandCancel.addEventListener('click', function() {
                elemExpandSection.classList.remove('expanded');
                elemExpandSection.style.marginBottom = 0;
                isExpandSectionExpanded = false;
            });
            
            
            elemExpandSave.addEventListener('click', function() {
                thisObj.onClickSave();
            });
        
        }
        
        
        if (settings.includeDoneByMe){
            elemChkDoneByMe.addEventListener('change', function(event) {
                
                
                
                if (event.currentTarget.checked) {
                    if (settings.includeAddNew){
                        thisObj.closeExpandable();
                    }
                    
                    elemSelectGroup.style.display = 'none';
                } else {
                    elemSelectGroup.style.display = 'flex';
                    
                    
                }
            });
        }
        
    }
    
    
    this.toggleExpandable = function(){
        isExpandSectionExpanded = !isExpandSectionExpanded;
            
        if (isExpandSectionExpanded) {
            if (thisObj.callbackBeforeExpand){
                thisObj.callbackBeforeExpand();
            }
            
            elemExpandSection.classList.add('expanded');
            elemExpandSection.style.marginBottom = '15px';
            
            elemServerErrorMsg.style.display = 'none';
            
        } else {
            elemExpandSection.classList.remove('expanded');
            elemExpandSection.style.marginBottom = 0;
        }
    }
    
    
    this.closeExpandable = function(){
        elemExpandSection.classList.remove('expanded');
        elemExpandSection.style.marginBottom = 0;
        isExpandSectionExpanded = false;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
    
    this.setDataStaffList = function(data, selected_entry_value){
        dataStaffList = data;
    
        const elem_select = thisObj.getElemSelect();
        
        commonSelectOptions.setDataStaffList(dataStaffList, elem_select);
        thisObj.setEntryCount(data);
        
        if (selected_entry_value){
            elem_select.value = selected_entry_value;
        }
    }
    
    
    this.beforeShow = function(options){
        const staff_list = navigation.pigFarm.dataStaffList;
        if (staff_list == null){
            
            const callback_success = function(data){
                thisObj.setDataStaffList(data);
            };
            
            let elem_show_error = null;
            if (options && options.elem_show_error){
                elem_show_error = options.elem_show_error;}
            
            navigation.pigFarm.requestDataPigFarmStaff(callback_success, 
                elem_show_error);
        
        }
        else{
            thisObj.setDataStaffList(staff_list);
        }
    }
    
    
    this._getStaff = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataStaffList == null){return null;}
        
        for (index = 0; index < dataStaffList.length; index++){
            cur_entry = dataStaffList[index];
            
            // Will check name for duplicate 
            if (cur_entry.pig_farm_staff.name.toUpperCase() == upper_name){
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
    
    
    this.getElemSelect  = function(){
        return elemSelect;
    }
    
    
    this.getElemCheckBox = function(){
        return elemChkDoneByMe;
    }
    
    
    this.getElemEntrySave  = function(){
        return elemExpandSave;
    }
    
    
    this.getValue = function(){
        return elemSelect.value;
    }
    
    
    this.setValue = function(value){
        elemSelect.value = value;
    }
    
    
    this.setEntryCount = function(data){
        elemEntryCount.textContent = ` (${data.length} Entries)`;
    }
    
    
    this.reset = function(){
        elemSelect.selectedIndex = 0;
        elemServerErrorMsg.style.display = 'none';
        
        
        if (settings.includeDoneByMe){
            elemChkDoneByMe.checked = false;
        }
        
        elemServerErrorMsg.style.display = 'none';
        
        elemSelect.classList.remove('is-valid', 'is-invalid');
    } 
    
    
    this.showDoneByMe = function(){
        elemDoneByMeShow.style.display = 'flex';
    }
    
    
    this.hideDoneByMe = function(){
        elemDoneByMeShow.style.display = 'none';
    }
    
    
    this.onClickSave = function(){
        let input_elem      = null;
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        let input_name      = elemText.value.trim();
        
       
        input_elem          = elemText;
        
        if (input_name.length > 0){
            // check for duplicates
            validation = 0;
            const cur_medvac_brand = thisObj._getStaff(input_name);
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
                elemTextInv.textContent = 'Duplicate entry.';
            }
            else{
                elemTextInv.textContent = 'Please enter a valid name.';
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
        const pig_farm_hid  = navigation.userControl.getCurrentFarmHid();
        
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_farm_hid':     pig_farm_hid,
            'name':             input_name
        };


        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/pig_farm_staff/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const new_entry_hid = response.pig_farm_staff.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataStaffList(data, new_entry_hid);
                        thisObj.closeExpandable();
                    };
                    
                    
                    
                    navigation.pigFarm.requestDataPigFarmStaff(
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