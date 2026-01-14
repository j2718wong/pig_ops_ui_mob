// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {updateCharCounter}          from '../page_view_basic.js'


export function ComponentStaffFormGroup(input_settings){
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        
        includeAddNew:          true,
        includeDoneByMe:        true,
        
        titleExpandSection:     'Add New Staff',
        htmlExpandSection:      '',
        labelBtnExpandSave:     'Save New Staff',
        
        labelSelect:            ''
        helpText:               ''
        
    }
    
    
    */
    
    const settings              = input_settings;
    
    const elemIdExpandSection   = `${settings.uniqueKey}-add-show`;
    const elemIdText            = `${settings.uniqueKey}-add-text`;
    const elemIdTextInv         = `${settings.uniqueKey}-add-text-inv`;
	const elemIdCharCounter		= `${settings.uniqueKey}-add-char-counter`;
        
    const elemIdServerErrorMsg  = `${settings.uniqueKey}-add-server-error`;
    const elemIdExpandCancel    = `${settings.uniqueKey}-add-cancel`;
    const elemIdExpandSave      = `${settings.uniqueKey}-add-save`;
    
    
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
	
	const elemIdChkDoneByMe		= `${settings.uniqueKey}-done-by-me`;
        
		
    let elemExpandSection       = null;
    let elemText                = null;
    let elemTextInv             = null;
	let elemCharCounter			= null;
    
    let elemServerErrorMsg      = null;
    let elemExpandCancel        = null;
    let elemExpandSave          = null;
    
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
	
	let elemChkDoneByMe			= null;
	
    
	let dataStaffList			= null;
	
	
    let isExpandSectionExpanded = false;
    
    
    this.getHtml = function(){
        
        
        let html_add_new = '';
        if (settings.includeAddNew){
            html_add_new = `
                <button class="btn" type="button" id="${elemIdStaffAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            `;
        }
        
        
        let html_done_by_me = '';
        if (settings.includeDoneByMe){
            html_done_by_me =`
            <!-- Done by Me Checkbox -->
            <div id="doneByMeContainer" class="checkbox-group">
                <input type="checkbox" id="${elemIdChkDoneByMe}">
                <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                    <i class="fas fa-user-check checkbox-icon"></i>
                    Done by Me
                </label>
            </div>
            `;
        }
        
        
        
        
        return `
        <div class="form-group-select">
            <div class="expandable-section" id="${elemIdExpandSection}">
                <h5>${settings.titleExpandSection}</h5>
                
                <div class="form-group">
                    <label for="${elemIdText}" class="form-label">
                        ${settings.textLabel} ${s_required_mark}
                        <span id="${elemIdCharCounter}" class="char-counter">0/${settings.textMaxChars}</span>
                    </label>
                    <input  type="text" class="form-control" id="${elemIdText}" maxlength="${settings.textMaxChars}" ${s_required}>
                    <div class="invalid-feedback" id="${elemIdTextInv}">Please enter a valid name. </div>
                    <div class="form-text"></div>
                </div>
                
                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                
                <button class="btn btn-cancel" id="${elemIdExpandCancel}">Cancel</button>
                <button class="btn btn-success" id="${elemIdExpandSave}">${settings.labelBtnExpandSave}</button>
            </div>
        
        
            <label for="${elemIdStaff}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id=${elemIdStaffCount}></span>
            </label>
            
            <div class="input-group" >
                <select class="form-select" id="${elemIdStaff}">
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
        elemCharCounter			= document.getElementById(elemIdCharCounter);
		
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        elemExpandCancel        = document.getElementById(elemIdExpandCancel);
        elemExpandSave          = document.getElementById(elemIdExpandSave);
        
        elemSelect              = document.getElementById(elemIdSelect);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
        elemEntryAdd            = document.getElementById(elemIdEntryAdd);
        
		elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
        
    }
    
    
    this._bindEventListeners = function(){
		if (settings.includeAddNew){
		
			elemText.addEventListener('input', function(){
				updateCharCounter(elemText, elemCharCounter, 
					settings.textMaxChars);
				
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
				thisObj.onClickSave
			});
        
        }
		
		
		if (settings.includeDoneByMe){
			elemChkDoneByMe.addEventListener('change', function(event) {
				if (event.currentTarget.checked) {
					elemSelect.style.display = 'none';
				} else {
					elemSelect.style.display = 'block';
				}
			});
		}
		
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
	
	this.setDataStaff = function(data, selected_entry_value){
		dataStaffList = data;
	}
	
	
	this._getStaff = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        
        if (dataStaffList == null){return null;}
        
        for (index = 0; index < dataStaffList.length; index++){
            cur_entry = dataStaffList[index];
            
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
    
	
    
    this.getElemSelect  = function(){
        return elemSelect;
    }
    
    
    
    
    this.getElemEntrySave  = function(){
        return elemExpandSave;
    }
    
    
    this.setEntryCount = function(data){
        elemEntryCount.textContent = ` (${data.length} Entries)`;
    }
    
    
    this.reset = function(){
        elemSelect.selectedIndex = 0;
        elemServerErrorMsg.style.display = 'none';
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
            const cur_medvac_brand = thisObj._getMedVacBrand(input_name);
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
        
		
		
		
		// Check if user_account_hid is same with farm_account_hid;
        const user_account_hid = navigation.userControl.getUserAccountHid();
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        
        if (user_account_hid != farm_account_hid){
            console.log('User account_hid not equal to farm_account_hid');
            return;
        } 
        
		
		
        
        const user_hid      = navigation.userControl.getUserHid();
        const pig_farm_hid 	= navigation.userControl.getCurrentFarmHid();
		
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_farm_hid':		pig_farm_hid,
			'name':             input_name
        };


        // Element where to display server error message in this component
        const elemServerErrorMsg = thisObj.getElemServerErrorMsg();
        
        
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
                    const new_entry_hid = response.medvac_brand.hid;
                    
                    const callback_success = function(data){
                        thisObj.setDataStaff(data, new_entry_hid);
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