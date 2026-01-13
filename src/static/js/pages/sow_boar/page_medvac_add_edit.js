// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';
import {CommonSelectOptions}    from '../common/common_select_options.js';


import {UiInputTextWithCounter}   from '../common/ui/input_text_with_counter.js';
import {UiSelectWithAddExpandable} from '../common/ui/select_with_add_expandable.js';


import {TRANSLATION_PAGE_SOW_BOAR_ADD_EDIT} from  '../../translations/page_sow_boar_add_edit_i8n.js';

import {TextTranslation}        from '../common/translation.js';


import {PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        REQUEST_ERROR_NUM}      from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';



import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'

import {ModelSowBoar}           from '../../models/model_sow_boar.js'



PageMedVacAddEdit.prototype = new PageViewPigFarmPage();
export function PageMedVacAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const MAXCHAR_MEDVAC_BRAND_NAME   = 50;
    const MAXCHAR_MEDVAC_TYPE   = 50;
    
    const MAXCHAR_MEDVAC_NAME   = 50;
    const MAXCHAR_NOTES         = 160;
    
    /*
    Typical settings = {
        navigation:             this,
        elemDivContainer:       elemHiddenContMedVacAddEdit
    };
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    let elemIdBreadCrumb0       = null;
    let elemIdBreadCrumb1       = null;
    
    let elemIdBtnClose          = null;
    
    let elemIdHeaderTitle       = null;
    
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    let elemIdDateMedVac        = null;
    
    
    let elemIdMedVacType        = null;
    let elemIdMedVacTypeCount   = null;
    let elemIdMedVacTypeAdd     = null;
    
    let elemIdName              = null;
    let elemIdNameCharCounter   = null;
    let elemIdNameInv           = null;
    
    let elemIdNotes             = null;
    let elemIdNotesCharCounter  = null;
    
    let elemIdStaff             = null;
    let elemIdStaffCount        = null;
    let elemIdStaffAdd          = null;
    let elemIdChkDoneByMe       = null;
    
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemUiMedVacBrandName   = null;
    let elemUiMedVacBrandSelect = null;
    
    
    
    
    let elemBreadCrumb0         = null;
    let elemBreadCrumb1         = null;
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
    
        
    let elemInfoShow            = null;
    let elemInfo                = null;
    
    let elemDateMedVac          = null;
    
    
    let elemMedVacBrandSelect         = null;
    
    
    let elemMedVacTypeSelect          = null;
    let elemMedVacTypeCount     = null;
    let elemMedVacTypeAdd       = null;
    
    let elemName                = null;
    let elemNameCharCounter     = null;
    let elemNameInv             = null;
    
    let elemNotes               = null;
    let elemNotesCharCounter    = null;
    
    let elemStaff               = null;
    let elemStaffCount          = null;
    let elemStaffAdd            = null;
    let elemChkDoneByMe         = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    let dataMedVacBrandList     = null;
    let dataMedVacTypeList      = null;
    
    
    
    let showOptions             = null;
    
    
    // This may not contain sex information
    let curDataSowBoar          = null;
    
    
    
    let isAddMedVacBrandExpanded = false;
    
    
    this.callbackOnSuccessAdd   = null;
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdBreadCrumb0       = `medvac-add-edit-breadcrumb-0`;
        elemIdBreadCrumb1       = `medvac-add-edit-breadcrumb-1`;
        
        elemIdBtnClose          = `medvac-add-edit-close`;
        
        elemIdHeaderTitle       = `medvac-add-edit-title`;
        
            
        elemIdInfoShow          = `medvac-add-edit-info-show`;
        elemIdInfo              = `medvac-add-edit-info`;
        
        elemIdDateMedVac        = `medvac-add-edit-date-medvac`;
        
        
        
        elemIdName              = `medvac-add-edit-name`;
        elemIdNameCharCounter   = `medvac-add-edit-name-counter`;
        elemIdNameInv           = `medvac-add-edit-name-inv`;

        elemIdNotes             = `medvac-add-edit-notes`;
        elemIdNotesCharCounter  = `medvac-add-edit-notes-counter`;
        
        elemIdStaff             = `medvac-add-staff`;
        elemIdStaffCount        = `medvac-add-staff-count`;
        elemIdStaffAdd          = `medvac-add-staff-add`;
        elemIdChkDoneByMe       = `medvac-add-done-by-me'`;
        
        
        elemIdServerErrorMsg    = `medvac-add-edit-server-error-msg`;
        elemIdBtnCancel         = `medvac-add-edit-cancel`;
        elemIdBtnSave           = `medvac-add-edit-save`;
        
        
        elemUiMedVacBrandName   = new UiInputTextWithCounter({
                                    uniqueKey:      'medvac-add-edit-brand-name',
                                    className:      'form-group',
                                    textLabel:      'Brand Name',
                                    textMaxChars:   MAXCHAR_MEDVAC_BRAND_NAME,
                                    textHelpText:   ''
                                });
        
        
        elemUiMedVacType        = new UiInputTextWithCounter({
                                    uniqueKey:      'medvac-add-edit-type',
                                    className:      'form-group',
                                    textLabel:      'MedVac Type',
                                    textMaxChars:   MAXCHAR_MEDVAC_TYPE,
                                    textHelpText:   ''
                                });
        
        
        elemUiMedVacName        = new UiInputTextWithCounter({
                                    uniqueKey:      'medvac-add-edit-name',
                                    className:      'form-group-text',
                                    textLabel:      'MedVac Name',
                                    textMaxChars:   MAXCHAR_MEDVAC_NAME,
                                    textHelpText:   'MedVac product name'
                                });
        
        
        
        
        
        const html_ui_new_medvac_brand_name = elemUiMedVacBrandName.getHtml();
        const html_ui_new_medvac_type       = elemUiMedVacType.getHtml();
        
        
        elemUiMedVacBrandSelect = new UiSelectWithAddExpandable({
                                    uniqueKey:              'medvac-add-edit-brand-name-select',
        
                                    titleExpandSection:     'Add New MedVac Brand',
                                    htmlExpandSection:      html_ui_new_medvac_brand_name,
                                    labelBtnExpandSave:     'Save MedVac Brand',
                                    
                                    labelSelect:            'Select MedVac Brand',
                                    helpText:               'MedVac brand name or manufacturer'
                                });
        
        const html_ui_medvac_brand_select = elemUiMedVacBrandSelect.getHtml();
        
        
        elemUiMedVacTypeSelect = new UiSelectWithAddExpandable({
                                    uniqueKey:              'medvac-add-edit-type-select',
        
                                    titleExpandSection:     'Add New MedVac Type',
                                    htmlExpandSection:      html_ui_new_medvac_type,
                                    labelBtnExpandSave:     'Save MedVac Type',
                                    
                                    labelSelect:            'Select MedVac Type',
                                    helpText:               'MedVac generic description or what it is for'
                                });
        
        const html_ui_medvac_select = elemUiMedVacBrandSelect.getHtml();
        
        
        
        
        
        const html =`

        
<div class="form-container">
    <div class="breadcrumb">
        <div class="breadcrumb-item">
            <a href="javascript:void(0)" class="breadcrumb-link"  id="${elemIdBreadCrumb0}">List</a>
        </div>
        
        <div class="breadcrumb-separator">/</div>
        
        <div class="breadcrumb-item">
            <a href="javascript:void(0)" class="breadcrumb-link" id="${elemIdBreadCrumb1}">SowBoar</a>
        </div>
        
    </div>

    
    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Sow</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- Mobile Info Box -->
        <div class="warning-box" id="${elemIdInfoShow}" style="display:none;"></div>
        
        
        <!-- 1. Date MedVac -->
        <div class="form-group-date">
            <label for="${elemIdDateMedVac}" class="form-label">
                Date
            </label>
            <input type="text" class="form-control" id="${elemIdDateMedVac}">
            <div class="form-text">Date when MedVac was given to pig.</div>
        </div>
        
        <!-- 2. MedVac Brand -->
        ${html_ui_medvac_brand_select}
        
        <!-- 3. MedVac Type -->
        ${html_ui_medvac_type_select}
        
        <!-- 4. Name -->
        <div class="form-group-text">
            <label for="${elemIdName}" class="form-label">Name
                <span id="${elemIdNameCharCounter}" class="char-counter">0/${MAXCHAR_MEDVAC_NAME}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdName}" maxlength="${MAXCHAR_MEDVAC_NAME}">
            <div class="invalid-feedback" id="${elemIdNameInv}">Please enter a valid name. </div>
            <div class="form-text">MedVac product name</div>
        </div>
        
        <!-- 5. Description -->
        <div class="form-group-text-area">
            <label for="${elemIdNotes}" class="form-label">
                Notes
                <span id="${elemIdNotesCharCounter}" class="char-counter">0/${MAXCHAR_NOTES}</span>
            </label>
            
            <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="${MAXCHAR_NOTES}"></textarea>
            <div class="form-text">Describe the dosage given to pig. Sample: 2mL injection.</div>
        </div>
        
        
        <!-- 5. Staff -->
        <div class="form-group-select">
            <label for="${elemIdStaff}" class="form-label">
                Staff Member <span class="entries-count" id=${elemIdStaffCount}></span>
            </label>
            
            <div class="input-group" >
                <select class="form-select" id="${elemIdStaff}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                <button class="btn" type="button" id="${elemIdStaffAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
            
            <div class="invalid-feedback">
                Need to select if not done by you.
            </div>
            
            <!-- Done by Me Checkbox -->
            <div id="doneByMeContainer" class="checkbox-group">
                <input type="checkbox" id="${elemIdChkDoneByMe}">
                <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                    <i class="fas fa-user-check checkbox-icon"></i>
                    Done by Me
                </label>
            </div>
            
            <div class="form-text">Who did the operation.</div>
        
        </div>

        
        
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <!-- Footer Buttons -->
        <div class="modal-footer">
                                           
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" style="margin-right:10px;">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>Save
            </button>
        </div>
    </div>
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        // Do the afterHtmlRender to UI elements first;
        
        elemUiMedVacBrandName.afterHtmlRender();
        elemUiMedVacBrandSelect.afterHtmlRender();
        
        elemUiMedVacType.afterHtmlRender();
        elemUiMedVacTypeSelect.afterHtmlRender();
        
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemBreadCrumb0         = document.getElementById(elemIdBreadCrumb0);
        elemBreadCrumb1         = document.getElementById(elemIdBreadCrumb1);
                                                          
        elemBtnClose            = document.getElementById(elemIdBtnClose);
                                                          
        elemHeaderTitle         = document.getElementById(elemIdHeaderTitle);
                                                          
                                                          
        elemInfoShow            = document.getElementById(elemIdInfoShow);
        elemInfo                = document.getElementById(elemIdInfo);
                                                          
        elemDateMedVac          = document.getElementById(elemIdDateMedVac);
        
        
        elemMedVacBrandNew      = elemUiMedVacBrandName.getElemText();
        elemMedVacBrandSelect   = elemUiMedVacBrandSelect.getElemSelect();
        elemMedVacBrandSave     = elemUiMedVacBrandSelect.getElemEntrySave();
        
        elemMedVacTypeNew       = elemUiMedVacType.getElemText();
        elemMedVacTypeSelect    = elemUiMedVacTypeSelect.getElemSelect();
        elemMedVacTypeSave      = elemUiMedVacTypeSelect.getElemEntrySave();
                                                          
        elemName                = document.getElementById(elemIdName);
        elemNameCharCounter     = document.getElementById(elemIdNameCharCounter);
        elemNameInv             = document.getElementById(elemIdNameInv);
                                                          
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
                                                          
        elemStaff               = document.getElementById(elemIdStaff);
        elemStaffCount          = document.getElementById(elemIdStaffCount);
        elemStaffAdd            = document.getElementById(elemIdStaffAdd);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
                                                          
                                                          
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        
        $('#'+elemIdDateMedVac).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
        thisObj.setElemStaff(elemStaff, elemStaffCount);
    }
    
    
    this._bindEventListeners = function(){
        
        elemName.addEventListener('input', function(){
            thisObj.updateCharCounter(elemName, elemNameCharCounter, 
                MAXCHAR_MEDVAC_NAME);
            
            elemName.classList.remove('is-invalid');
        });
        
       
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                MAXCHAR_NOTES);
            
            elemNotes.classList.remove('is-invalid');
        });
        
        
        
        
        
        elemMedVacBrandSave.addEventListener('click', function() {
            thisObj.onClickSaveMedVacBrand();
        });
        
        
        elemBtnClose.addEventListener('click', function() {
            //navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        elemBtnCancel.addEventListener('click', function() {
            //navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
        
    }
    
    
    this.setDataMedVacBrand = function(data){
        dataMedVacBrandList = data;
        
        thisObj.commonSelectOptions.setDataMedVacBrand(dataMedVacBrandList, elemMedVacBrandSelect);
        elemUiMedVacBrandSelect.setEntryCount(data);
    }
    
    
    this.setDataMedVacType = function(data){
        dataMedVacTypeList  = data;
        
        thisObj.commonSelectOptions.setDataMedVacType(dataMedVacTypeList, elemMedVacTypeSelect);
        elemUiMedVacBrandSelect.setEntryCount(data);
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
    
    
    this._getMedVacType = function(name, exclude_hid){
        let upper_name = name.toUpperCase();
        
        
        let cur_entry;
        let index;
        
        for (index = 0; index < dataMedVacTypeList.length; index++){
            cur_entry = dataMedVacTypeList[index];
            
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
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemNameInv.style.display = 'none';
        
        
        
        // Remove validation classes
        let cur_elem = null;
        
        elemUiMedVacBrandName.reset();
        elemUiMedVacType.reset();
        
		elemUiMedVacName.reset()
        
        elemUiMedVacBrandSelect.reset();
		elemUiMedVacTypeSelect.reset();

        
        cur_elem = elemNotes;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        elemStaff.selectedIndex = 0;
        elemChkDoneByMe.checked = false;
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_sow_boar, options){
        /*
        Typical options
        options ={
            is_add:         true,   // false is edit
            medvac_hid:     "",     // only needed for edit
            go_back_page:   elemDivContainer,   // Go back to this page; this is Div element
            go_back_page_id: PAGE_ID.SOW_BOAR_LIST, optional
        }
        */
        
        curDataSowBoar = data_sow_boar;
        
        thisObj._resetForm();
        
        
        // Check if there is a public data MedVacBrandList and dataMedVacTypeList
        if (navigation.managerPublicData.getMedVacBrandList() == null){
            
            const callback_success = function(data){
                thisObj.setDataMedVacBrand(data);
            };
            
            navigation.managerPublicData.requestDataMedVacBrand(callback_success, elemServerErrorMsg)
        }
        
        if (navigation.managerPublicData.getMedVacTypeList() == null){
            
            const callback_success = function(data){
                thisObj.setDataMedVacType(data);
            };
            
            navigation.managerPublicData.requestDataMedVacType(callback_success, elemServerErrorMsg)
        }
        
        
        showOptions = options;
        
        let html;
        let sow_boar_reference;
        
        if (curDataSowBoar.name && curDataSowBoar.name.length >0){
            sow_boar_reference = curDataSowBoar.name;
        }
        else{
            sow_boar_reference = curDataSowBoar.number;
        }
        
        if (options.is_add){
            html = `<i class="fas fa-plus me-2"></i>Add MedVac for <span>${sow_boar_reference}</span>`;
        }
        else{
            html = `<i class="fas fa-edit me-2"></i>Edit MedVac for <span>${sow_boar_reference}</span>`;
            
            thisObj.populateForm(curDataSowBoar, medvac_hid);
        }
        elemHeaderTitle.innerHTML = html;
                
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
      
    }
    
    
    this.populateForm = function(data_sow_boar, medvac_hid){
        
        // Get medvac entry from data_sow_boar
        const list_medvac = data_sow_boar.list_medvac;
        
        let cur_medvac = null;
        for (const cur_entry of list_medvac){
            if (cur_entry.medvac.hid == medvac_hid){
                cur_medvac = cur_entry;
                break;
            }
        }
        
        if (cur_medvac == null){return;}
        
        
        const dt_medvac     = new Date(cur_medvac.date_medvac);
        const dt_medvac_s   = formatDate(dt_medvac);
        elemDateMedVac.value = dt_medvac_s;
        
        // Set the datepicker to this date
        const $elemDateMedVac = $(elemDateMedVac);
        $elemDateMedVac.datepicker('setDate', cur_medvac.date_medvac);
        
        
        
        
        
        
        
        elemName.value      = data_sow_boar.name;
        
        
        
        thisObj.updateCharCounter(elemName, elemNameCharCounter, 
                MAXCHAR_MEDVAC_NAME);
        
        
                
        thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                MAXCHAR_NOTES);
    }
    
    
    this.show = function(){
        thisObj._resetForm();
        
        console.log('PageAddGestating show');
    }
    
    
    this.togglePanel = function(){
        const panelBody = elemPanelBody;
        const panelHeader = elemPanelHeader;
        const arrowIcon = elemPanelArrowIcon;
        
        // Toggle visibility
        panelBody.classList.toggle('collapsed');
        
        // Toggle header border radius
        panelHeader.classList.toggle('collapsed');
        
        // Rotate arrow icon
        arrowIcon.classList.toggle('rotated');
    }
    
      
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        
        let is_duplicate = 0;
        
        
        if (ev.checkValidity()) {
            switch(input_field){
                
                case 'date_medvac': {
                    input_elem      = elemDateMedVac;
                    input_val       = input_elem.value;
                    cur_field       = newEntry.fieldInsemDate;
                    
                    cur_field.newValue = input_val; 
                    validation = cur_field.validateChange();
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
            
                case 'name': {
                    input_elem      = elemName;
                    input_val       = input_elem.value.trim();
                    cur_field       = sowBoarEntry.fieldSowBoarName;
                    
                    
                    cur_field.newValue = input_val; 
                    validation = cur_field.validateChange();
                    
                    // Additional validation to prevent duplicate 
                    if (validation == FIELD_VALIDATION_OK){
                        if (input_val.length > 0){
                            if (showOptions.is_add){ 
                                const cur_sow_boar = thisObj._getSowBoar(input_val, null);
                                
                                if (cur_sow_boar != null){
                                    is_duplicate = 1;
                                    validation = -1;
                                }
                            
                            } 
                            
                            else {
                                // edit
                                const exclude_hid = curDataSowBoar.hid;
                                const cur_sow_boar = thisObj._getSowBoar(input_val, null, exclude_hid);
                                
                                if (cur_sow_boar != null){
                                    is_duplicate = 1;
                                    validation = -1;
                                }
                            }
                        }
                    }
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                        elemNameInv.style.display = 'none';
                    } else{
                        if (is_duplicate > 0){
                            elemNameInv.textContent = 'Duplicate entry.';
                        }
                        else{
                            elemNameInv.textContent = 'Please enter a valid name.';
                        }
                        elemNameInv.style.display = 'block';
                        
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
                                      
            }
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    
    
    this.onClickSaveButton = function(){

        let input_elem      = null;
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        let input_medvac    = elemDateMedVac.value.trim();
        let input_name      = elemName.value.trim();
        
        let input_notes     = elemNotes.value.trim();
        
        
        is_duplicate        = 0;
        
        input_elem          = elemName;
        cur_field           = sowBoarEntry.fieldSowBoarName;
        cur_field.newValue  = input_name;
        validation          = cur_field.validateChange();
        
       
        
        if (validation != FIELD_VALIDATION_OK){
            if (is_duplicate > 0){
                elemNameInv.textContent = 'Duplicate entry.';
            }
            else{
                elemNameInv.textContent = 'Please enter a valid name.';
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
        
        
        is_duplicate        = 0;
        
        input_elem          = elemNumber;
        cur_field           = sowBoarEntry.fieldSowBoarNumber;
        cur_field.newValue  = input_number;
        validation          = cur_field.validateChange();
        
        
        // Additional validation to prevent duplicate 
        if (validation == FIELD_VALIDATION_OK){
            if (input_number.length > 0){
                if (showOptions.isAdd) {
                    const cur_sow_boar = thisObj._getSowBoar(null, input_number);
        
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                }
                else{
                    // edit
                    const exclude_hid = curDataSowBoar.hid;
                    const cur_sow_boar = thisObj._getSowBoar(input_number, null, exclude_hid);
                    
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                }
            }
        }
        
        if (validation != FIELD_VALIDATION_OK){
            if (is_duplicate > 0){
                elemNumberInv.textContent = 'Duplicate entry.';
            }
            else{
                elemNumberInv.textContent = 'Please enter a valid number.';
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
        
        
        // check if both name and number are blank
        if (input_name.length == 0 && input_number.length == 0){
            elemNameInv.textContent = 'Cannot be both blank.';
            elemNumberInv.textContent = 'Cannot be both blank.';
            
            input_elem          = elemName;
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            
            input_elem          = elemNumber;
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            
            proceed_to_save = 0;
        }
        
        if (proceed_to_save == 0) {return;}
        
        
        let dt_dob_s = null;
        
        if (input_date_birth.length == 0){
            input_date_birth = null;
        } else{
            input_elem          = elemDateOfBirth;
            cur_field           = sowBoarEntry.fieldBirthDate;
            
            
            // Convert date to YYYY-MM-DD format
            const dt_dob        = new Date(input_date_birth);
            dt_dob_s            = dt_dob.toLocaleDateString('en-CA');
            
            cur_field.newValue  = dt_dob_s;
            validation          = cur_field.validateChange();
                
                
            if (validation != FIELD_VALIDATION_OK){
            
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
        }
        
        if (proceed_to_save == 0) {return;}
        
                
        
        
        const is_external   = elemIsExternal.checked;
        const is_prod_ready = elemIsProdReady.checked;
        
        
        let sex = null;
        switch(showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:{
                sex = 'F';
                break;
            }
            
            case SOW_BOAR_TYPE.BOAR:{
                sex = 'M';
                break;
            }
            
            case SOW_BOAR_TYPE.GILT:{
                sex = 'F';
                break;
            }
        }
        
        const user_hid      = navigation.userControl.getUserHid();
        const pig_farm_hid  = navigation.userControl.getCurrentFarmHid();
        const base_url      = window.location.origin;
        
        let num_nipples = null;
        try {
            num_nipples = parseInt(input_num_nipples);
        }
        catch(error){
            num_nipples = null;
        }
        
        // send post request
        let post_data = {
            'uhid':             user_hid,
            'pfhid':            pig_farm_hid,
            
            'number':           sowBoarEntry.fieldSowBoarNumber.newValue,
            'name':             sowBoarEntry.fieldSowBoarName.newValue,
            'date_of_birth':    dt_dob_s,
            'sex':              sex,
            'is_production_ready': is_prod_ready? 1 : 0,
            'num_nipples':      num_nipples,
            'notes':            input_notes
        };
        
        if (showOptions.is_add == false){
            // edit entry
            delete post_data.pfhid;
            
            post_data['sow_boar_hid'] = curDataSowBoar.hid;
            post_data['sow_status_id']= curDataSowBoar.status_id;
            
        }
        
        if (post_data.date_of_birth == null){
            delete post_data.date_of_birth;
        }
        
        // Only add Boars will have is_external flag;
        if (is_external == true){
            post_data.is_external = 1;
        }
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/sow_boar/add`;
        }
        else{
            url = `${base_url}/sow_boar/update`;
        }
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    let is_sow = false;
                    switch(showOptions.sow_boar_type){
                        case SOW_BOAR_TYPE.SOW:{is_sow = true; break;}
                        case SOW_BOAR_TYPE.BOAR:{is_sow = false; break;}
                        case SOW_BOAR_TYPE.GILT:{is_sow = true; break;}
                    }
                    
                    
                    const callback_error = function(error_code, error_desc){
                        let html;
                        if ((error_desc != null) && (error_desc.length > 0)){
                            html = `<span>${error_desc}</span>`;
                        }
                        else{
                            html = `<span>${error_code}</span>`;
                        }
                        
                        elemServerErrorMsg.innerHTML = html;
                        elemServerErrorMsg.style.display = 'block'
                    };
                    
                    
                    if (showOptions.is_add == true){
                        // Add action can either go back to SowBoar List page 
                        // or AddGestating Entry page
                        
                        
                        if ('go_back_page_id' in showOptions){
                            if (showOptions.go_back_page_id == PAGE_ID.SOW_BOAR_LIST){
                                // This should go to SowBoar List page 
                                
                                let callback_success = function(){
                                    navigation.pageSowBoarList.show(null);
                                    navigation.showThisPage(showOptions.go_back_page);
                                };
                                
                                navigation.pigFarm.requestSowBoar(is_sow, 
                                    callback_success, callback_error);

                                return;
                            }
                        }
                        
                        
                        
                        // This should go to AddGestating Entry page
                        
                        const new_sow_boar_hid = response.sow_boar.hid;
                        const callback_success = function(){
                            thisObj.callbackOnSuccessAdd(new_sow_boar_hid);
                            navigation.showThisPage(showOptions.go_back_page);
                        };
                        
                        navigation.pigFarm.requestSowBoar(is_sow, 
                            callback_success, callback_error);
                        
                    }
                    
                    else{
                        // Edit action will always go back to SowBoar List page.
                        // Redraw first the SowBoar List page before show
                        const callback_success = function(){
                            navigation.pageSowBoarList.show(null);
                            navigation.showThisPage(showOptions.go_back_page);
                        };
                        
                        navigation.pigFarm.requestSowBoar(is_sow, 
                            callback_success, callback_error);
                        
                    }
                    
                    
                }
                else{
                    navigation.errorServerMessage.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
    
    
}   