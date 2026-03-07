// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION}            from '../../../constants.js';


export function ComponentStaffFormGroup(input_settings){
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        navigation:             navigation,
        
        
        labelSelect:            ''
        helpText:               ''
        
        labelCheckBos:          ''
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    const navigation            = settings.navigation;
    
    
    
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
        
        
        
        
        let html_done_by_me = '';
        if (settings.includeDoneByMe){
            html_done_by_me =`
            
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
            
        
            <label for="${elemIdSelect}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id=${elemIdEntryCount}></span>
            </label>
            
            <div class="input-group" id="${elemIdSelectGroup}">
                <select class="form-select" id="${elemIdSelect}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
            
            <div class="invalid-feedback">
                
            </div>
            
            <div id="${elemIdCheckBoxShow}" class="checkbox-group">
                <input type="checkbox" id="${elemIdCheckBox}">
                <label for="${elemIdCheckBox}" class="checkbox-label">
                </label>
            </div>
            
            <div class="form-text">${settings.helpText}</div>
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
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
            
            navigation.pigFarm.requestDataPigFarmStaffList(callback_success, 
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
        if (data.length == 1){
            elemEntryCount.textContent = ` (${data.length} Entry)`;
        }
        else{
            elemEntryCount.textContent = ` (${data.length} Entries)`;
        }
    }
    
    
    this.reset = function(){
        elemSelect.selectedIndex = 0;
        elemServerErrorMsg.style.display = 'none';
        
        
        if (settings.includeDoneByMe){
            elemChkDoneByMe.checked = false;
            elemChkDoneByMe.dispatchEvent(new Event('change'));
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
    
    
    this.enabled = function(){
        elemSelect.disabled = false;
        
        if (settings.includeAddNew){
            elemEntryAdd.disabled = false;
        }
        
        if (settings.includeDoneByMe){
            elemDoneByMeShow.style.display ='flex';
        }
    }
    
    
    this.disabled = function(){
        elemSelect.disabled = true;
        
        if (settings.includeAddNew){
            elemEntryAdd.disabled = true;
        }
        
        if (settings.includeDoneByMe){
            elemDoneByMeShow.style.display ='none';
        }


    }
    
    
    this.onClickSave = function(){
        let input_elem      = null;
        let validation      = -1;
        
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


        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
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
                    
                    
                    
                    navigation.pigFarm.requestDataPigFarmStaffList(
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
