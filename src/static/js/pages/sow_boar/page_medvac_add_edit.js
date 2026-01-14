// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';
import {CommonSelectOptions}    from '../common/common_select_options.js';

import {addValidationClassToElem} from '../common/ui/ui_utils.js';

import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';
import {UiInputTextAreaWithCounter} from '../common/ui/input_textarea_with_counter.js';
import {ComponentStaffFormGroup} from '../common/ui/comp_staff_form_group.js';


import {ComponentMedVacBrand}   from './components/comp_medvac_brand.js'
import {ComponentMedVacType}    from './components/comp_medvac_type.js'
import {ComponentAccMedVac}     from './components/comp_acc_medvac.js'


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



//PageMedVacAddEdit.prototype = new PageViewPigFarmPage();
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
    
    
    let elemIdStaff             = null;
    let elemIdStaffCount        = null;
    let elemIdStaffAdd          = null;
    let elemIdChkDoneByMe       = null;
    
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let componentMedVacBrand    = null;
    let componentMedVacType     = null;
    let componentAccMedVac      = null;
    
    let elemUiNotes             = null;
    let componentStaff          = null;
    
    
    
    let elemBreadCrumb0         = null;
    let elemBreadCrumb1         = null;
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
    
        
    let elemInfoShow            = null;
    let elemInfo                = null;
    
    let elemDateMedVac          = null;
    
    

    let elemName                = null;
    let elemNotes               = null;

    
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
        
        
        

        elemIdStaff             = `medvac-add-staff`;
        elemIdStaffCount        = `medvac-add-staff-count`;
        elemIdStaffAdd          = `medvac-add-staff-add`;
        elemIdChkDoneByMe       = `medvac-add-done-by-me'`;
        
        
        elemIdServerErrorMsg    = `medvac-add-edit-server-error-msg`;
        elemIdBtnCancel         = `medvac-add-edit-cancel`;
        elemIdBtnSave           = `medvac-add-edit-save`;
        
        
        
        componentMedVacBrand    = new ComponentMedVacBrand({
                                    navigation:             navigation,
                                    uniqueKey:              'medvac-add-edit-brand-name',

                                    titleExpandSection:     'Add New MedVac Brand',
                                    htmlExpandSection:      null,
                                    labelBtnExpandSave:     'Save MedVac Brand',
                                    
                                    labelSelect:            'Select MedVac Brand',
                                    helpText:               'MedVac brand name or manufacturer'
                                });
        
        
        
        componentMedVacType     = new ComponentMedVacType({
                                    navigation:             navigation,
                                    uniqueKey:              'medvac-add-edit-type',

                                    titleExpandSection:     'Add New MedVac Type',
                                    htmlExpandSection:      null,
                                    labelBtnExpandSave:     'Save MedVac Type',
                                    
                                    labelSelect:            'Select MedVac Type',
                                    helpText:               'MedVac generic description or what it is for'
                                });
        
        
        componentAccMedVac      = new ComponentAccMedVac({
                                    navigation:             navigation,
                                    uniqueKey:              'medvac-add-edit-name',

                                    titleExpandSection:     'Add New MedVac Name',
                                    htmlExpandSection:      null,
                                    labelBtnExpandSave:     'Save MedVac Name',
                                    
                                    labelSelect:            'Select MedVac Name',
                                    helpText:               'MedVac product name'
                                });
        
        
        
        elemUiNotes             = new UiInputTextAreaWithCounter({
                                    uniqueKey:      'medvac-add-edit-notes',
                                    
                                    className:      'form-group-text-area',
                                    textLabel:      'Notes',
                                    textMaxChars:   160,
                                    rows:           3,
                                    helpText:       'Describe the dosage given to pig. Sample: 2mL injection.'  
                                });
        
        
        
        componentStaff          = new ComponentStaffFormGroup({
                                    navigation:             navigation,
                                    uniqueKey:              'medvac-add-edit-staff',
                                    
                                    includeAddNew:          true,
                                    includeDoneByMe:        true,
                                    
                                    titleExpandSection:     'Add New Staff',
                                    htmlExpandSection:      null,
                                    labelBtnExpandSave:     'Save New Staff',
                                    
                                    labelSelect:            'Staff Member',
                                    helpText:               'Who did the operation'
                                    
                                })
    


        const html_comp_medvac_brand = componentMedVacBrand.getHtml();
        const html_comp_medvac_type = componentMedVacType.getHtml();
        const html_comp_acc_medvac  = componentAccMedVac.getHtml();
        const html_ui_notes         = elemUiNotes.getHtml();
        const html_comp_staff       = componentStaff.getHtml();
        
        
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
            <label for="${elemIdDateMedVac}" class="form-label">Date</label>
            <input type="text" class="form-control" id="${elemIdDateMedVac}" required>
            <div class="invalid-feedback">
                Please input date.
            </div>
            <div class="form-text">Date when MedVac was given to pig.</div>
        </div>
        
        <!-- 2. MedVac Brand -->
        ${html_comp_medvac_brand}
        
        <!-- 3. MedVac Type -->
        ${html_comp_medvac_type}
        
        <!-- 4. Name -->
        ${html_comp_acc_medvac}
        
        <!-- 5. Notes -->
        ${html_ui_notes}
        
        <!-- 6. Staff -->
        ${html_comp_staff}
        
        
        
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
        

        componentMedVacBrand.afterHtmlRender();
        componentMedVacType.afterHtmlRender();
        componentAccMedVac.afterHtmlRender();
        
        elemUiNotes.afterHtmlRender();
        componentStaff.afterHtmlRender();
        
        
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
        
        elemDateMedVac.addEventListener('change', function() {
            console.log('elemDateMedVac chnage');
            thisObj._validateAfterChangeInput(this, 'date_medvac');
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
        componentMedVacBrand.setDataMedVacBrand(data);
    }
    
    
    this.setDataMedVacType = function(data){
        dataMedVacTypeList  = data;
        componentMedVacType.setDataMedVacType(data);
    }
    
    
    this.setDataAccMedVac = function(data) {
        componentAccMedVac.setDataAccMedVac(data);
    }
    
    
    this.setDataStaff = function(data){
        componentStaff.setDataStaff(data);
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        // Remove validation classes
        let cur_elem = null;
        
        componentMedVacBrand.reset();
        componentMedVacType.reset();
        componentAccMedVac.reset()
        
        
        elemUiNotes.reset(); 
        componentStaff.reset();
        
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
        
        
        // Check if there is a public data dataMedVacBrandList and dataMedVacTypeList
        const medvac_brand_list = navigation.managerPublicData.dataMedVacBrandList;
        if (medvac_brand_list == null){
            
            const callback_success = function(data){
                thisObj.setDataMedVacBrand(data);
            };
            
            navigation.managerPublicData.requestDataMedVacBrand(callback_success, elemServerErrorMsg)
        }
        else{
            thisObj.setDataMedVacBrand(medvac_brand_list);
        }
        
        
        const medvac_type_list = navigation.managerPublicData.dataMedVacTypeList;
        if (medvac_type_list == null){
            
            const callback_success = function(data){
                thisObj.setDataMedVacType(data);
            };
            
            navigation.managerPublicData.requestDataMedVacType(callback_success, elemServerErrorMsg)
        }
        else{
            thisObj.setDataMedVacType(medvac_type_list);
        }
        
        
        // check if there is an account dataAccMedVac
        const acc_medvac_list = navigation.pigFarm.accountLists.dataAccMedVac;
        if (acc_medvac_list == null){
            
            const callback_success = function(data){
                thisObj.setDataAccMedVac(data);
            };
            
            navigation.pigFarm.accountLists.requestDataAccMedVac(callback_success, elemServerErrorMsg)
        
        }
        else{
            thisObj.setDataAccMedVac(data);
        }
        
        
        // Get Farm staff list
        const staff_list = navigation.pigFarm.dataStaffList;
        if (staff_list == null){
            
            const callback_success = function(data){
                thisObj.setDataStaff(data);
            };
            
            navigation.pigFarm.requestDataPigFarmStaff(callback_success, elemServerErrorMsg)
        
        }
        else{
            thisObj.setDataStaff(data);
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
                    
                    console.log('Test 1');
                    
                    // Already validated by bootstrap
                    if (input_val.length > 0){
                        validation = 0;
                    }
                    
                    
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
        let validation      = 0;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
        
        let input_date_medvac   = elemDateMedVac.value.trim();
        
        let input_medvac_brand  = componentMedVacBrand.getValue()
        let input_medvac_type   = componentMedVacType.getValue()
        let input_medvac_name   = componentAccMedVac.getValue()
        let input_notes         = elemUiNotes.getValue().trim();
        
        

        let dt_medvac_s = null;
        
        input_elem          = elemDateMedVac;
        if (input_date_medvac.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        
        
        // Convert date to YYYY-MM-DD format
        const dt_medvac     = new Date(input_date_medvac);
        dt_medvac_s         = dt_medvac.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem = componentMedVacBrand.getElemSelect();
        if (input_medvac_brand == '0'  || input_medvac_brand == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem = componentMedVacType.getElemSelect();
        if (input_medvac_type == '0'  || input_medvac_type == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem = componentAccMedVac.getElemSelect();
        if (input_medvac_name == '0'  || input_medvac_name == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem = elemUiNotes.getElemText();
        if (input_notes.length == 0){
            validation = -1;
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
        let post_data = {
            'uhid':             user_hid,
            'pfhid':            pig_farm_hid,
            
            'number':           sowBoarEntry.fieldSowBoarNumber.newValue,
            'name':             sowBoarEntry.fieldSowBoarName.newValue,
            'date_of_birth':    dt_medvac_s,
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
                                
                                navigation.pigFarm.requestDataSowBoar(is_sow, 
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
                        
                        navigation.pigFarm.requestDataSowBoar(is_sow, 
                            callback_success, callback_error);
                        
                    }
                    
                    else{
                        // Edit action will always go back to SowBoar List page.
                        // Redraw first the SowBoar List page before show
                        const callback_success = function(){
                            navigation.pageSowBoarList.show(null);
                            navigation.showThisPage(showOptions.go_back_page);
                        };
                        
                        navigation.pigFarm.requestDataSowBoar(is_sow, 
                            callback_success, callback_error);
                        
                    }
                    
                    
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
}   