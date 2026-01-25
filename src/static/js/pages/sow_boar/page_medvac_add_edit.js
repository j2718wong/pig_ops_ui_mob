// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageSowBoarEntryComponent}  from './page_sow_boar_entry_component.js';

import {CommonSelectOptions}        from '../common/common_select_options.js';

import {addValidationClassToElem}   from '../common/ui/ui_utils.js';

import {UiInputDatePicker}          from '../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../common/ui/input_text_with_counter.js';
import {ComponentStaffFormGroup}    from '../common/ui/comp_staff_form_group.js';


import {ComponentMedVacBrand}       from './components/comp_medvac_brand.js'
import {ComponentMedVacType}        from './components/comp_medvac_type.js'
import {ComponentAccMedVac}         from './components/comp_acc_medvac.js'


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




export function PageMedVacAddEdit(input_settings){
    PageSowBoarEntryComponent.call(this, input_settings);
    
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const MAXCHAR_MEDVAC_BRAND_NAME   = 50;
    const MAXCHAR_MEDVAC_TYPE   = 50;
    
    const MAXCHAR_MEDVAC_NAME   = 50;
    const MAXCHAR_NOTES         = 160;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContMedVacAddEdit,
        uniqueKey:              'medvac-add-edit'
    };
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        

    
    let elemIdBtnClose          = null;
    
    let elemIdHeaderTitle       = null;
    
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    let elemUiDateMedVac        = null;

    let elemIdMedVacForShow         = null;
    let elemIdMedVacForLabel        = null;
    
    let elemIdMedVacForPigOps       = null;
    let elemIdMedVacForPigOpsChk    = null;
    let elemIdMedVacForPigOpsLabel  = null;
    
    
    let elemIdMedVacForPigHealth    = null;
    let elemIdMedVacForPigHealthDate = null;
    let elemIdMedVacForPigHealthLabel = null;

    
    let componentMedVacBrand    = null;
    let componentMedVacType     = null;
    let componentAccMedVac      = null;
    
    let elemUiNotes             = null;
    let componentStaff          = null;
    
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
    
        
    let elemInfoShow            = null;
    let elemInfo                = null;
    
    let elemDateMedVac          = null;

    
    let elemMedVacForShow           = null;
    let elemMedVacForLabel          = null;
    
    let elemMedVacForPigOps         = null;
    let elemMedVacForPigOpsChk      = null;
    let elemMedVacForPigOpsLabel    = null;
    
    
    let elemMedVacForPigHealth      = null;
    let elemMedVacForPigHealthDate  = null;
    let elemMedVacForPigHealthLabel = null;
    
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    let dataMedVacBrandList     = null;
    let dataMedVacTypeList      = null;
    
    
    
    let showOptions             = null;
    

    
    this.callbackOnSuccessAdd   = null;
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        
        
        elemUiDateMedVac        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date`,
        
            textLabel:          'Date',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           'Date when MedVac was given to pig.'
        });
        
        
        
        elemIdMedVacForShow     = `${settings.uniqueKey}-medvac-for`;
        elemIdMedVacForLabel    = `${settings.uniqueKey}-medvac-for-label`;
        
        elemIdMedVacForPigOps           = `${settings.uniqueKey}-medvac-for-pig-ops`;
        elemIdMedVacForPigOpsChk        = `${settings.uniqueKey}-medvac-for-pig-ops-chk`;
        elemIdMedVacForPigOpsLabel      = `${settings.uniqueKey}-medvac-for-pig-ops-label`;


        elemIdMedVacForPigHealth        = `${settings.uniqueKey}-medvac-for-pig-ops`;
        elemIdMedVacForPigHealthDate    = `${settings.uniqueKey}-medvac-for-pig-ops-date`;
        elemIdMedVacForPigHealthLabel   = `${settings.uniqueKey}-medvac-for-pig-ops-label`;

        
        componentMedVacBrand    = new ComponentMedVacBrand({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-brand-name`,

            titleExpandSection: 'Add New MedVac Brand',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save MedVac Brand',
            
            labelSelect:        'Select MedVac Brand',
            helpText:           'MedVac brand name or manufacturer'
        });
        
        
        componentMedVacType     = new ComponentMedVacType({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-type`,

            titleExpandSection: 'Add New MedVac Type',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save MedVac Type',
        
            labelSelect:        'Select MedVac Type',
            helpText:           'MedVac generic description or what it is for'
        });
        
        
        componentAccMedVac      = new ComponentAccMedVac({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-name`,

            titleExpandSection: 'Add New MedVac Name',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save MedVac Name',
        
            labelSelect:        'Select MedVac Name',
            helpText:           'MedVac product name'
        });
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            isRequired:         true,
            textMaxChars:       160,
            rows:               3,
            helpText:           'Describe the dosage given to pig. Sample: 2mL injection.'  
        });
        
        
        componentStaff          = new ComponentStaffFormGroup({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-staff`,
            
            includeAddNew:      true,
            includeDoneByMe:    true,
            
            titleExpandSection: 'Add New Staff',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save New Staff',
            
            labelSelect:        'Staff Member',
            helpText:           'Who did the operation'
        });
    
        

        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
           
        const html_breadcrumb   = thisObj.componentBreadcrumb.getHtml();
        
        const html_date_medvac  = elemUiDateMedVac.getHtml();
        const html_medvac_brand = componentMedVacBrand.getHtml();
        const html_medvac_type  = componentMedVacType.getHtml();
        const html_acc_medvac   = componentAccMedVac.getHtml();
        const html_notes        = elemUiNotes.getHtml();
        const html_staff        = componentStaff.getHtml();
        
        
        const html =`

        
<div class="form-container">
    ${html_breadcrumb}

    
    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Sow</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- Mobile Info Box -->
        <div class="warning-box" id="${elemIdInfoShow}" style="display:none;"></div>
        
        
        
        <!-- Optional relation keys -->
        <div class="form-group-check" id="${elemIdMedVacForShow}">
            <label id="${elemIdMedVacForLabel}" class="form-label">MedVac For Health Issue</label>
            
            <div id="${elemIdMedVacForPigHealth}">
                <label id="${elemIdMedVacForPigHealthDate}">
                    Decemer 6, 2025
                </label>
                
                <b>
                    <label id="${elemIdMedVacForPigHealthLabel}">
                        Nakaigit sa iyang purol
                    </label>
                </b>
                
            </div>
            
            
        </div>
        
        <!-- 1. Date MedVac -->
        ${html_date_medvac}
        
        
        <!-- 2. MedVac Brand -->
        ${html_medvac_brand}
        
        <!-- 3. MedVac Type -->
        ${html_medvac_type}
        
        <!-- 4. Name -->
        ${html_acc_medvac}
        
        <!-- 5. Notes -->
        ${html_notes}
        
        <!-- 6. Staff -->
        ${html_staff}
        
        
        
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
        
        thisObj.afterHtmlRenderSowBoarEntryComponent();

        elemUiDateMedVac.afterHtmlRender();
        
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
                                                          
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
                                                          
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
                                                          
                                                          
        elemInfoShow            = elemDivContainer.querySelector('#'+elemIdInfoShow);
        elemInfo                = elemDivContainer.querySelector('#'+elemIdInfo);
                                                          
        
        elemMedVacForShow           = elemDivContainer.querySelector('#'+elemIdMedVacForShow);
        elemMedVacForLabel          = elemDivContainer.querySelector('#'+elemIdMedVacForLabel);
                                                                    
        elemMedVacForPigOps         = elemDivContainer.querySelector('#'+elemIdMedVacForPigOps);
        elemMedVacForPigOpsChk      = elemDivContainer.querySelector('#'+elemIdMedVacForPigOpsChk);
        elemMedVacForPigOpsLabel    = elemDivContainer.querySelector('#'+elemIdMedVacForPigOpsLabel);
                                                                    
                                                                    
        elemMedVacForPigHealth      = elemDivContainer.querySelector('#'+elemIdMedVacForPigHealth);
        elemMedVacForPigHealthDate  = elemDivContainer.querySelector('#'+elemIdMedVacForPigHealthDate); 
        elemMedVacForPigHealthLabel = elemDivContainer.querySelector('#'+elemIdMedVacForPigHealthLabel);
        
                                                          
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
  
    }
    
    
    this._bindEventListeners = function(){
        
        
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
    
    
    this.setDataStaffList = function(data){
        componentStaff.setDataStaffList(data);
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemUiDateMedVac.reset();
        
        componentMedVacBrand.reset();
        componentMedVacType.reset();
        componentAccMedVac.reset()
        
        
        elemUiNotes.reset(); 
        componentStaff.reset();
        
    }
    
    
    this.beforeShow = function(data_sow_boar, options){
        // IMPORTANT;  When you set a select value while its parent container 
        // is hidden (via display: none, visibility: hidden, or opacity: 0), 
        // the browser doesn't properly render the selected state until the 
        // container becomes visible.
        
        console.log('apge_medvac_add_edit before show');
        /*
        Typical options
        options ={
            is_add:                 true,   // false is edit
            medvac_hid:             null,   // not null if edit
            health_issue_entry:     null,   // not null if this is added from health issue
            callback_after_add:     thisObj.onSuccessAddEntry
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        */
        
        thisObj.curDataSowBoar  = data_sow_boar;
        showOptions     = options;
        
        
        // Update BreadCrumbs
        const sow_boar_reference = thisObj.updateBreadCrumbs();
        
        
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
                thisObj.setDataStaffList(data);
            };
            
            navigation.pigFarm.requestDataPigFarmStaff(callback_success, elemServerErrorMsg)
        
        }
        else{
            thisObj.setDataStaffList(staff_list);
        }
        
        
        
        // Set Page Title
        let html;
        if (options.is_add){
            html = `<i class="fas fa-plus me-2"></i>Add MedVac</span>`;
        }
        else{
            html = `<i class="fas fa-edit me-2"></i>Edit MedVac</span>`;
        }
        elemHeaderTitle.innerHTML = html;
                
        
        // Make sure the input elements are enabled, in case 
        // the previous entry was view a disposed sow_boar
        thisObj.enableAllInputs();
        
        
        // Show/Hide add only or edit only elements
        if (options.is_add){
            elemMedVacForShow.style.display = 'block';
            componentStaff.showDoneByMe();
        }
        else{
            elemMedVacForShow.style.display = 'none';
            componentStaff.hideDoneByMe();
        }
        
        
        // ShowHide optional MedVac For
        if ('health_issue_entry' in options){
            elemMedVacForShow.style.display = 'block';
            
            const prod_notes = options.health_issue_entry.prod_notes;
            
            elemMedVacForPigHealthDate.textContent = prod_notes.date_notes; 
            elemMedVacForPigHealthLabel.textContent = prod_notes.notes;
            
        }
        else{
            elemMedVacForShow.style.display = 'none';
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
      
    }
    
    
    this.show = function(){
        if (showOptions.is_add == false){
            // Necessary to display fully first the container
            setTimeout(function(){thisObj.populateForm(thisObj.curDataSowBoar, showOptions.medvac_hid);}, 100);
        }
    }
    
    
    this.populateForm = function(data_sow_boar, medvac_hid){
        
        // Get medvac entry from data_sow_boar
        const list_medvac = data_sow_boar.data_details.list_medvac;
        
        let cur_medvac = null;
        for (const cur_entry of list_medvac){
            if (cur_entry.medvac.hid == medvac_hid){
                cur_medvac = cur_entry;
                break;
            }
        }
        
        if (cur_medvac == null){return;}
        

        // Set the datepicker to this date
        elemUiDateMedVac.setDate(cur_medvac.medvac.date_medvac);
        
        
        // Set MedVac brand
        componentMedVacBrand.setValue(cur_medvac.medvac.brand.hid);
        
        
        // Set MedVac type
        componentMedVacType.setValue(cur_medvac.medvac.type.hid);
        
        
        // Set MedVac AccMedVac
        componentAccMedVac.setValue(cur_medvac.medvac.acc_medvac.hid);
        
        
        // Set Notes
        elemUiNotes.setValue(cur_medvac.medvac.notes);
        
        
        // Set Staff 
        componentStaff.setValue(cur_medvac.medvac.staff.hid)
    }
    
    
    this.disableAllInputs = function(){
        elemUiDateMedVac.disableInputs();
        
        componentMedVacBrand.disableInputs();
        componentMedVacType.disableInputs();
        componentAccMedVac.disableInputs();
        
        elemUiNotes.disableInputs();
    }
    
    
    this.enableAllInputs = function(){
        elemUiDateMedVac.enableInputs();
        
        componentMedVacBrand.enableInputs();
        componentMedVacType.enableInputs();
        componentAccMedVac.enableInputs();
        
        elemUiNotes.enableInputs();
    }
    

    this.getMedVacBrandAndTypeHid = function(){
        return {
            brand_hid:  componentMedVacBrand.getValue(),
            type_hid:   componentMedVacType.getValue()
        }
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
                
            
            }
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
        
        let input_date_medvac   = elemUiDateMedVac.getValue().trim();
        
        let input_medvac_brand  = componentMedVacBrand.getValue();
        let input_medvac_type   = componentMedVacType.getValue();
        let input_medvac_name   = componentAccMedVac.getValue();
        let input_notes         = elemUiNotes.getValue().trim();
        let input_staff         = componentStaff.getValue();
        

        let dt_medvac_s = null;
        
        input_elem          = elemDateMedVac;
        if (input_date_medvac.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        
        
        // Convert date to YYYY-MM-DD format
        input_elem          = elemUiDateMedVac.getElemText();
        
        const dt_medvac     = new Date(input_date_medvac);
        if (isNaN(dt_medvac.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
            
        
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
        
        
        let done_by_user = 0;
        
        input_elem = componentStaff.getElemCheckBox();
        if (input_elem.checked){
            done_by_user = 1;
        }
        
        if (done_by_user == 0){
            input_elem = componentStaff.getElemSelect();
            if (input_staff == '0'  || input_staff == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
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
            'sow_boar_hid':     thisObj.curDataSowBoar.sow_boar.hid,
            
            'date_medvac':      dt_medvac_s,
            'medvac_brand_hid': input_medvac_brand,
            'medvac_type_hid':  input_medvac_type,
            'acc_medvac_hid':   input_medvac_name,
            'notes':            input_notes,
            'staff_hid':        input_staff
            
        };
        
        if (showOptions.is_add == true){
            if (done_by_user > 0){
                post_data.done_by_user = 1;
                delete post_data.staff_hid;
            }
            
            if ('health_issue_entry' in showOptions){
                const health_issue_hid = showOptions.health_issue_entry.prod_notes.hid;
                post_data.health_issue_hid = health_issue_hid;
                
            }
        }
        
        else {
            post_data.pig_medvac_hid = showOptions.medvac_hid;
        }
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/pig_medvac/add`;
        }
        else{
            url = `${base_url}/pig_medvac/update`;
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
                    if (showOptions.is_add == true){
                        if (showOptions.callback_after_add){
                            showOptions.callback_after_add();
                        }
                        navigation.showThisPage(showOptions.go_back_page);
                    }
                    
                    else{
                        if (showOptions.callback_after_edit){
                            showOptions.callback_after_edit();
                        }
                        navigation.showThisPage(showOptions.go_back_page);
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