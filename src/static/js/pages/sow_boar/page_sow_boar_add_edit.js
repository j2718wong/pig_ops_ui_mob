// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageSowBoarWithBreadCrumbs} from './page_sow_boar_with_breadcrumbs.js';


import {TRANSLATION_PAGE_SOW_BOAR_ADD_EDIT} from  '../../translations/page_sow_boar_add_edit_i8n.js';

import {TextTranslation}            from '../common/translation.js';

import {addValidationClassToElem}   from '../common/ui/ui_utils.js';

import {UiInputDatePicker}          from '../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../common/ui/input_text_with_counter.js';
import {UiSelectWithEntryCount}     from '../common/ui/select_with_entry_count.js';
import {UiInputCheckBox}            from '../common/ui/input_checkbox.js';
import {ComponentPlusMinusInput}    from '../common/ui/comp_plus_minus_input.js';

import {getSowBoarReference}        from '../common/common_app.js';


import {PageSowBoarUpdateStatus}    from './page_sow_boar_update_status.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        REQUEST_ERROR_NUM}      from '../../constants.js';






export function PageSowBoarAddEdit(input_settings){
    PageSowBoarWithBreadCrumbs.call(this, input_settings);
    
    const TAG                   = 'PageSowBoarAddEdit';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    const MAXCHAR_SOW_BOAR_NAME     = 20;
    const MAXCHAR_SOW_BOAR_NUMBER   = 10;
    const MAXCHAR_NOTES             = 160;
    
    /*
    Typical settings = {
        navigation:             this
        elemIdDivContainer:     elemIdContSowBoarAddEdit
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    let elemIdContBreadCrumbs   = null;
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    
    let elemUiName              = null;
    let elemUiNumber            = null;
    let elemUiDateOfBirth       = null;
    let elemUiParentSow         = null;
    let elemUiParentBoar        = null;
    
    
    let elemIdBirthProdIdShow   = null;
    let elemIdBirthProdId       = null;
    
    let compNumNipples          = null;
    let elemUiIsExternal        = null;
    let elemUiIsProdReady       = null;
    let elemUiNotes             = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
            
    let elemInfoShow            = null;
    let elemInfo                = null;
        
    let elemDateOfBirth         = null;
    let elemBirthProdIdShow     = null;
    let elemBirthProdId         = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    let sowList                 = null;
    let boarList                = null;
    let giltList                = null;
    
    
    /** The disposed entry has a different structure that the sow or boar entry.
    This is because the user audit is also returned.
    
    1.) The disposed entry is a list of disposed sows, boar and gilts.
    2.) Also included are  deleted entries.
    3.) There is no sex information in the disposed entry. But this can be read 
        from sow_boar.farm_sow_id or sow_boar.farm_boar_id; These cannot be both
        filled in.
    4.) There is no difference between a sow and a gilt; 
    
    
    
    {
        "sow_boar": {
            "farm_sow_id": null,
            "farm_boar_id": 13,
            "number": null,
            "name": "Tuyor",
            "is_disposed": 1,
            "is_external": 0,
            "is_production_ready": 1,
            "num_nipples": 0,
            "farm_birth_prod_id": null,
            "last_prod_id": null,
            "status_id": 6,
            "status": "Dead",
            "date_of_birth": "2025-02-25",
            "date_eartag": null,
            "date_dispose": "2026-01-02",
            "notes": null,
            "dispose_notes": "namatay",
            "hid": "VKVWQ9"
        },
        "added_by": {
            "name_last": "Wong",
            "name_first": "Jack",
            "dt_entry": "2026-01-08 06:37:14"
        },
        "last_update": {
            "name_last": "Wong",
            "name_first": "Jack",
            "dt_update": "2026-01-10 19:20:12"
        }
    }
    
    */
    let disposedList            = null;

    let showOptions             = null;
    

    
    
    // This is an explicit computation during show;
    // true is Show Sow or Show Gilt; 
    let curIsSow                = null;
    
    let sowBoarUpdateStatus     = new PageSowBoarUpdateStatus({
        navigation:             navigation,
        uniqueKey:              'sow-boar-update-status',
        elemDivContainer:       elemDivContainer
    });
    
    
    this.callbackOnSuccessAdd   = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        let label_save          = 'Save';
        let label_cancel        = 'Cancel';
        
        
        let label_name          = 'Name';
        let label_name_inv      = 'Please enter a valid name.';
        let label_name_help     = 'Pig name to easily remember.';
        
        
        let label_number        = 'Number';
        let label_number_inv    = 'Please enter a valid number.';
        let label_number_help   = 'Can be eartag number; can be blank.';
        
        
        let label_date_birth        = 'Date of Birth';
        let label_date_birth_help   = "Can be blank. This is used to calculate pig's age.";
        
        let label_parent_sow        = 'Select Parent Sow';
        let label_parent_sow_help   = 'Skip if you dont know.';
    
        let label_parent_boar       = 'Select Parent Boar';
        let label_parent_boar_help  = 'Skip if you dont know.';
        
        let label_num_nipples       = 'Number of Nipples';
        let label_num_nipples_help  = 'Yes. We record this. You better count.';
        
        let label_is_external       = 'Is External?';
        let label_external          = 'External. Not owned by the pig farm.';
        let label_is_external_help  = "Check this if you borrowed your neighbor's boar.";
        
        let label_ready_for_mating  = 'Is Ready for Mating?';
        let label_production_ready  = 'Production Ready';
        let label_ready_help        = 'Need to specify if ready to mate. <span class="sow-only"> Not Production Ready sow will  be listed in Gilt List. ';
        
        let label_notes             = 'Notes';     
        
        
        const helper = navigation.managerTranslations.translationHelper;

            
        // Common labels
        label_save              = helper.getSimpleTranslation('common.labels.save') || label_save;
        label_cancel            = helper.getSimpleTranslation('common.labels.cancel') || label_cancel;

        // Page: sow_boar_add
        label_name              = helper.getSimpleTranslation('page_sow_boar_add.labels.name') || label_name;
        label_name_inv          = helper.getSimpleTranslation('page_sow_boar_add.labels.name_invalid') || label_name_inv;
        label_name_help         = helper.getSimpleTranslation('page_sow_boar_add.labels.name_help') || label_name_help;

        label_number            = helper.getSimpleTranslation('page_sow_boar_add.labels.number') || label_number;
        label_number_inv        = helper.getSimpleTranslation('page_sow_boar_add.labels.number_invalid') || label_number_inv;
        label_number_help       = helper.getSimpleTranslation('page_sow_boar_add.labels.number_help') || label_number_help;


        label_date_birth        = helper.getSimpleTranslation('page_sow_boar_add.labels.date_birth') || label_date_birth;
        label_date_birth_help   = helper.getSimpleTranslation('page_sow_boar_add.labels.date_birth_help') || label_date_birth_help;

        label_parent_sow        = helper.getSimpleTranslation('page_sow_boar_add.labels.parent_sow') || label_parent_sow;
        label_parent_sow_help   = helper.getSimpleTranslation('page_sow_boar_add.labels.parent_sow_help') || label_parent_sow_help;

        label_parent_boar       = helper.getSimpleTranslation('page_sow_boar_add.labels.parent_boar') || label_parent_boar;
        label_parent_boar_help  = helper.getSimpleTranslation('page_sow_boar_add.labels.parent_boar_help') || label_parent_boar_help;

        label_num_nipples       = helper.getSimpleTranslation('page_sow_boar_add.labels.num_nipples') || label_num_nipples;
        label_num_nipples_help  = helper.getSimpleTranslation('page_sow_boar_add.labels.num_nipples_help') || label_num_nipples_help;

        label_is_external       = helper.getSimpleTranslation('page_sow_boar_add.labels.is_external') || label_is_external;
        label_external          = helper.getSimpleTranslation('page_sow_boar_add.labels.external') || label_external;
        label_is_external_help  = helper.getSimpleTranslation('page_sow_boar_add.labels.is_external_help') || label_is_external_help;

        label_ready_for_mating  = helper.getSimpleTranslation('page_sow_boar_add.labels.ready_for_mating') || label_ready_for_mating;
        label_production_ready  = helper.getSimpleTranslation('page_sow_boar_add.labels.production_ready') || label_production_ready;
        label_ready_help        = helper.getSimpleTranslation('page_sow_boar_add.labels.ready_help') || label_ready_help;

        label_notes             = helper.getSimpleTranslation('page_sow_boar_add.labels.notes') || label_notes;
        
        
        
        
        elemIdContBreadCrumbs   = `${settings.uniqueKey}-cont-breadcrumbs`;
        thisObj.setBreadCrumbs(elemIdContBreadCrumbs);
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        
        
        elemUiName              = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-name`,
        
            className:          'form-group-text',
            textLabel:          label_name,
            isRequired:         false,
            textMaxChars:       MAXCHAR_SOW_BOAR_NAME,
            invalidFeedBack:    label_name_inv,
            helpText:           label_name_help
        });
        
        
        elemUiNumber            = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-number`,
        
            className:          'form-group-text',
            textLabel:          label_number,
            isRequired:         false,
            textMaxChars:       MAXCHAR_SOW_BOAR_NUMBER,
            invalidFeedBack:    label_number_inv,
            helpText:           label_number_help
        });
        
        
        
        elemUiDateOfBirth       = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-birth`,
        
            textLabel:          label_date_birth,
            isRequired:         false,
            invalidFeedBack:    null,
            helpText:           label_date_birth_help
        });
        
        
        elemIdBirthProdIdShow   = `${settings.uniqueKey}-birth-prod-id-show`;
        elemIdBirthProdId       = `${settings.uniqueKey}-birth-prod-id`;
        
        elemUiParentSow         = new UiSelectWithEntryCount({
            uniqueKey:          `${settings.uniqueKey}-parent-sow`,
            navigation:         navigation,
        
            labelSelect:        label_parent_sow,
            helpText:           label_parent_sow_help
        });
        
        elemUiParentBoar        = new UiSelectWithEntryCount({
            uniqueKey:          `${settings.uniqueKey}-parent-boar`,
            navigation:         navigation,
        
            labelSelect:        label_parent_boar,
            helpText:           label_parent_boar_help
        });
        
        
        compNumNipples          = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-nipples`,
                
            className:          'form-group-number',
            textLabel:          label_num_nipples,
            minValue:           12,
            step:               1,
            isRequired:         false,
            invalidFeedBack:    null,
            helpText:           label_num_nipples_help
        });
        
        
        elemUiIsExternal        = new UiInputCheckBox({
            uniqueKey:          `${settings.uniqueKey}-is-external`,
        
            textLabel:          label_is_external,
            checkBoxLabel:      label_external,
            helpText:           label_is_external_help  
        });
        
        
        elemUiIsProdReady       = new UiInputCheckBox({
            uniqueKey:          `${settings.uniqueKey}-is-prod-ready`,
        
            textLabel:          label_ready_for_mating,
            checkBoxLabel:      label_production_ready,
            helpText:           label_ready_help  
        });
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          label_notes,
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        // should show up only if edit
        const html_breadcrumb   = thisObj.componentBreadcrumb.getHtml();
        
        
        const html_name         = elemUiName.getHtml();
        const html_number       = elemUiNumber.getHtml();
        
        const html_date_birth   = elemUiDateOfBirth.getHtml();
        const html_parent_sow   = elemUiParentSow.getHtml();
        const html_parent_boar  = elemUiParentBoar.getHtml();
        
        const html_num_nipples  = compNumNipples.getHtml();
        const html_is_external  = elemUiIsExternal.getHtml();
        const html_is_prod_ready= elemUiIsProdReady.getHtml();
        const html_notes        = elemUiNotes.getHtml();
        
        
        const html_update_status    = sowBoarUpdateStatus.getHtml();
        
        
        const html =`

        
<div class="form-container">
    
    <div id="${elemIdContBreadCrumbs}">
        ${html_breadcrumb}
    </div>
    
    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Sow</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <div class="warning-box" id="${elemIdInfoShow}" style="display:none;">
            <span id="no-gilt-operations">
                Currently there are no defined scheduled operations for gilt preparation.
                <span>Click to add Gilt Operations</span>
            </span>
            
            <span id="has-gilt-operations">
                Adding a new Gilt will create schedule for new <span>Gilt Pig Operations</span>.
            </span>
        </div>
        
        
        ${html_name}
        
        ${html_number}
        
        ${html_date_birth}
        
        ${html_parent_sow}
        
        ${html_parent_boar}
        
        
        
        <div class="form-group-text" id="${elemIdBirthProdIdShow}">
            <label class="form-label">Birth Prod ID</label>
            <span class="" id="${elemIdBirthProdId}"></span>
        </div>
        
        
        ${html_num_nipples}
        
        ${html_is_external}
        
        ${html_is_prod_ready}
        
        ${html_notes}
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        
        <div class="modal-footer">
                                           
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" style="margin-right:10px;">
                <i class="fas fa-times me-2"></i>${label_cancel}
            </button>
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>${label_save}
            </button>
        </div>
        
        
        <!-- Update Status collapsible section-->
        ${html_update_status}
        
        
    </div>
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        thisObj.afterHtmlRenderBreadCrumbComponent();
        
        elemUiName.afterHtmlRender();
        elemUiNumber.afterHtmlRender();
        
        elemUiDateOfBirth.afterHtmlRender();
        
        elemUiParentSow.afterHtmlRender();
        elemUiParentBoar.afterHtmlRender();
        
        compNumNipples.afterHtmlRender();
        
        elemUiIsExternal.afterHtmlRender();
        elemUiIsProdReady.afterHtmlRender();
        elemUiNotes.afterHtmlRender();
        
        sowBoarUpdateStatus.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        elemInfoShow            = elemDivContainer.querySelector('#'+elemIdInfoShow);
        
        elemBirthProdIdShow     = elemDivContainer.querySelector('#'+elemIdBirthProdIdShow);
        elemBirthProdId         = elemDivContainer.querySelector('#'+elemIdBirthProdId);
        
        
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
    
    
    this.setDataSowList = function(data){
        sowList = data;
        
        
        // Filter out gilts; cannot be a parent sow 
        const filtered = [];
        for(const cur_entry of data){
            if (cur_entry.sow_boar.status_id == SOW_STATUS.GROWING){continue;}
            
            filtered.push(cur_entry);
            
        }
        
        
        // TODO: how to add disposed sows
        
        
        const elem_select = elemUiParentSow.getElemSelect();

        
        const select_data = thisObj.commonSelectOptions.setDataSowList(filtered, 
            elem_select, null, {parent_sow_only: true});
        elemUiParentSow.setEntryCount(select_data);
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
        
        
        // Filter out not production ready; cannot be a parent sow 
        const filtered = [];
        for(const cur_entry of data){
            if (cur_entry.sow_boar.is_production_ready == 0){continue;}
            filtered.push(cur_entry);
        }
        
        
        // TODO: how to add disposed boars
        
        const elem_select = elemUiParentBoar.getElemSelect();

        thisObj.commonSelectOptions.setDataBoarList(filtered, elem_select);
        elemUiParentBoar.setEntryCount(filtered);
    }
    
    
    this.setCallbackOnSuccessUpdateStatus = function(callback){
        sowBoarUpdateStatus.callbackOnSuccessUpdate = callback;
    }
    
        
    this.getSowBoar = function(name, number, exclude_hid){
        // Note: SowBoar name or number can be null; but not both null;
        // SowBoar number can also contain non numeric characters
        let upper_name  = null;
        let upper_number = null;
        
        if (name != null){upper_name = name.toUpperCase();}
        if (number != null){upper_number = number.toUpperCase();}
        
        
        let cur_entry;
        let index;
        
        let sow_boar_list= null;
        if ((showOptions.sow_boar_type == SOW_BOAR_TYPE.SOW) ||
            (showOptions.sow_boar_type == SOW_BOAR_TYPE.GILT)){
            sow_boar_list = sowList;
        }
        else{
            sow_boar_list = boarList;
        }
        
        for (index = 0; index < sow_boar_list.length; index++){
            cur_entry = sow_boar_list[index];
            
            // Will check both name and number for duplicate 
            
            if (upper_name != null) {
                if (cur_entry.name != null){
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
                
                if (cur_entry.number != null) {
                    if (cur_entry.number.toUpperCase() == upper_name){
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
            }
            
            if (upper_number != null) {
                if (cur_entry.name != null){
                    if (cur_entry.name.toUpperCase() == upper_number){
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
                
                if (cur_entry.number != null) {
                    if (cur_entry.number.toUpperCase() == upper_number){
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
            }
            
        }
        
        return null;
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        // Remove validation classes
        let cur_elem = null;
        
        elemUiName.reset();
        elemUiNumber.reset();
        
        elemUiDateOfBirth.reset();
        
        elemUiParentSow.reset();
        elemUiParentBoar.reset();
        
        compNumNipples.reset();
        elemUiIsExternal.reset();
        elemUiIsProdReady.reset();
        elemUiNotes.reset();
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.option, page_data.data_sow_boar); 
    }
    
    
    this.show = function(options, data_sow_boar){
        /*
        Typical options
        options ={
            is_add:         true,   // false is edit
            sow_boar_type:  1,   
            farm_sow_boar_id: 1,    // only needed for edit
            go_back_page:   elemDivContainer,   // this is Div element
            go_back_page_id: PAGE_ID.SOW_BOAR_LIST, optional
            from_prod_pid:  null    // can be null or undefined
        }
        
        data_sow_boar is only provided if sow_boar edit, options.is_add = false
        
        */
        
        
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {
            options:        options,
            data_sow_boar:  data_sow_boar
        };
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        
        
        thisObj._resetForm();
        
        
        thisObj.setDataSowList(navigation.pigFarm.managerSowBoar.dataSowList);
        thisObj.setDataBoarList(navigation.pigFarm.managerSowBoar.dataBoarList);
        
        
        showOptions = options;
        

        
        let html;

        if (showOptions.is_add){
            thisObj.curDataSowBoar = null;
            thisObj.componentBreadcrumb.hide();
            
            sowBoarUpdateStatus.hide();
        } 
        else{
            thisObj.curDataSowBoar = data_sow_boar;
            thisObj.componentBreadcrumb.show();
            thisObj.updateBreadCrumbs();
            
            sowBoarUpdateStatus.show();
        }
        
        
        // Sow sow-only info else hide
        const elems_sow_only = elemDivContainer.querySelectorAll('.sow-only');
        
        for (const cur_entry of elems_sow_only){
            if (showOptions.sow_boar_type == SOW_BOAR_TYPE.SOW){
                if (cur_entry.classList.contains('hidden')){
                    cur_entry.classList.remove('hidden');
                }
            }
            
            else{
                if (cur_entry.classList.contains('hidden') == false){
                    cur_entry.classList.add('hidden');
                }
            }
        }
        
        
        const translations      = navigation.getTranslations();
        
        let label_add_sow       = 'Add Sow';
        let label_edit_sow      = 'Edit Sow';
        
        let label_add_boar      = 'Add Boar';
        let label_edit_boar     = 'Edit Boar';
        
        let label_add_gilt      = 'Add Gilt';
        let label_edit_gilt     = 'Edit Gilt';
        
        
        
        if (translations){
            if (translations.page_sow_boar_add && 
                translations.page_sow_boar_add.labels){
                
                const labels_page = translations.page_sow_boar_add.labels;
                
                            
                if (labels_page) {
                    if(labels_page.add_sow)   {label_add_sow = labels_page.add_sow;}
                    if(labels_page.edit_sow)  {label_edit_sow = labels_page.edit_sow;}
                    
                    if(labels_page.add_boar)  {label_add_boar = labels_page.add_boar;}
                    if(labels_page.edit_boar) {label_edit_boar = labels_page.edit_boar;}
                    
                    if(labels_page.add_gilt)  {label_add_gilt = labels_page.add_gilt;}
                    if(labels_page.edit_gilt) {label_edit_gilt = labels_page.edit_gilt;}
                    
                }
            }
        }
        
        
        
        // Change Header title
        switch(showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW: {
                if (showOptions.is_add){
                    html = `<i class="fas fa-plus me-2"></i>${label_add_sow}`;
                }
                else{
                    const sow_boar_name = getSowBoarReference(thisObj.curDataSowBoar.sow_boar);
                    
                    html = `<i class="fas fa-edit me-2"></i>${label_edit_sow}: ${sow_boar_name}`;
                    
                    thisObj.populateForm(thisObj.curDataSowBoar);
                }
                elemHeaderTitle.innerHTML = html;
                
                elemInfoShow.style.display = 'none';
                
                // Hide Boar Only info
                elemUiIsExternal.hide();
                
                // Show Sow info
                compNumNipples.show();
                
                break;
            }
    
            case SOW_BOAR_TYPE.BOAR: {
                if (showOptions.is_add){
                    html = `<i class="fas fa-plus me-2"></i>${label_add_boar}`;
                }
                else{
                    const sow_boar_name = getSowBoarReference(thisObj.curDataSowBoar.sow_boar);
                    
                    html = `<i class="fas fa-edit me-2"></i>${label_edit_boar}: ${sow_boar_name}`;
                    
                    thisObj.populateForm(thisObj.curDataSowBoar);
                }
                elemHeaderTitle.innerHTML = html;
                
                elemInfoShow.style.display = 'none';
                
                // Boars can be external to the farm
                elemUiIsExternal.show();
                
                compNumNipples.hide();
                break;
            }
    
            case SOW_BOAR_TYPE.GILT:{
                if (showOptions.is_add){
                    html = `<i class="fas fa-plus me-2"></i>${label_add_gilt}`;
                    elemInfoShow.style.display = 'block';
                }
                else{
                    const sow_boar_name = getSowBoarReference(thisObj.curDataSowBoar.sow_boar);
                    
                    html = `<i class="fas fa-edit me-2"></i>${label_edit_gilt}: ${sow_boar_name}`;
                    elemInfoShow.style.display = 'none';
                    
                    thisObj.populateForm(thisObj.curDataSowBoar);
                }
                elemHeaderTitle.innerHTML = html;
                
                
                // Hide Boar Only info
                elemUiIsExternal.hide();
                
                compNumNipples.show();
                
                break;
            }
            
            case SOW_BOAR_TYPE.DISPOSED:{}
            
        }
        
        
        // Hide elemBirthProdIdShow
        // BirthProdId will only show up if a production piglet is eartag or
        //  a pig is taken from existing production entry  
        if ('from_prod_pid' in showOptions){
            elemBirthProdIdShow.style.display = 'block';
        }
        else{
            elemBirthProdIdShow.style.display = 'none';
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        
        // Propagate data_sow_boar to sowBoarUpdateStatus
        sowBoarUpdateStatus.beforeShow(data_sow_boar);
    }
    
    
    this.populateForm = function(data_sow_boar){
        let cur_sow_boar = data_sow_boar;
        if ('sow_boar' in data_sow_boar){
            cur_sow_boar = data_sow_boar.sow_boar;
        }
        
        
        elemUiName.setValue(cur_sow_boar.name);
        elemUiNumber.setValue(cur_sow_boar.number);
        
        if (cur_sow_boar.date_of_birth){
            elemUiDateOfBirth.setDate(cur_sow_boar.date_of_birth);
        }
        
        
        if (cur_sow_boar.parent_sow_hid){
            elemUiParentSow.setValue(cur_sow_boar.parent_sow_hid);
        }
        
        
        if (cur_sow_boar.parent_boar_hid){
            elemUiParentBoar.setValue(cur_sow_boar.parent_boar_hid);
        }
        
        
        if (cur_sow_boar.is_external && cur_sow_boar.is_external > 0) {
            elemUiIsExternal.getElemCheckBox().checked = true;
        }
        else{
            elemUiIsExternal.getElemCheckBox().checked = false;
        }
        
        if (cur_sow_boar.is_production_ready > 0) {
            elemUiIsProdReady.getElemCheckBox().checked = true;
        }
        else{
            elemUiIsProdReady.getElemCheckBox().checked = false;
        }
        
        
        if (cur_sow_boar.num_nipples ){
            compNumNipples.setValue(cur_sow_boar.num_nipples);
            //elemNumNipples.value = cur_sow_boar.num_nipples;
        }
        
        if (cur_sow_boar.add_notes ){
            elemUiNotes.setValue(cur_sow_boar.add_notes);
        }
        
        
        // Delayed populate for dropdowns
        if (cur_sow_boar.parent_sow_hid || cur_sow_boar.parent_boar_hid){
            setTimeout(function(){
                if (cur_sow_boar.parent_sow_hid){
                    elemUiParentSow.setValue(cur_sow_boar.parent_sow_hid);
                }
                
                if (cur_sow_boar.parent_boar_hid){
                    elemUiParentBoar.setValue(cur_sow_boar.parent_boar_hid);
                }
                
            }, 100);
        }
        
    }
    
      
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        
        let is_duplicate = 0;
        
        
       
    }
    
    
    this._hasChanged = function(post_data){
        
    }
    
    
    this.onClickSaveButton = function(){
        let label_duplicate_entry   = 'Duplicate Entry';
        let label_cannot_be_blank   = 'Cannot be both blank';
        
        let label_name_invalid      = 'Please enter either name or number or both';
        let label_number_invalid    = 'Please enter either name or number or both';
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_duplicate_entry   = helper.getSimpleTranslation('page_sow_boar_add.labels.duplicate_entry') || label_duplicate_entry;
        label_cannot_be_blank   = helper.getSimpleTranslation('page_sow_boar_add.labels.cannot_be_blank') || label_cannot_be_blank;
        
        label_name_invalid      = helper.getSimpleTranslation('page_sow_boar_add.labels.name_invalid') || label_name_invalid;
        label_number_invalid    = helper.getSimpleTranslation('page_sow_boar_add.labels.number_invalid') || label_number_invalid;
        
        
        let input_elem      = null;
        let validation      = 0;
        
        
        let is_duplicate    = 0;
        
       
        
        let input_name          = elemUiName.getValue().trim();
        let input_number        = elemUiNumber.getValue().trim();
        let input_date_birth    = elemUiDateOfBirth.getValue().trim();
        let input_num_nipples   = compNumNipples.getValue();
        
        let input_parent_sow_id = elemUiParentSow.getValue();
        let input_parent_boar_id= elemUiParentBoar.getValue();
        
        let input_notes         = elemUiNotes.getValue().trim();
        
        if (input_parent_sow_id == '0' || input_parent_sow_id == '-1'){
            input_parent_sow_id = null;
        }
        
        if (input_parent_boar_id == '0' || input_parent_boar_id == '-1'){
            input_parent_boar_id = null;
        }
        
        
        
        is_duplicate        = 0;
        
        input_elem          = elemUiName.getElemText();
        validation          = 0; // allowed to have blank name
        
        
        // Additional validation to prevent duplicate 
        if (validation == 0){
            if (input_name > 0){
                if (showOptions.is_add){ 
                    const cur_sow_boar = thisObj.getSowBoar(input_name, null);
        
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                
                } else{
                    // edit
                    const exclude_hid = thisObj.curDataSowBoar.hid;
                    const cur_sow_boar = thisObj.getSowBoar(input_name, null, exclude_hid);
                    
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                }
            }
        }
        
        if (validation != 0){
            if (is_duplicate > 0){
                elemUiName.setTextInvalid(label_duplicate_entry);
            }
            else{
                elemUiName.setTextInvalid(label_name_invalid);
            }
        }
        
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        is_duplicate        = 0;
        
        input_elem          = elemUiNumber.getElemText();
        validation          = 0; // allowed to have a blank number
        
        // Additional validation to prevent duplicate 
        if (validation == 0){
            if (input_number.length > 0){
                if (showOptions.isAdd) {
                    const cur_sow_boar = thisObj.getSowBoar(null, input_number);
        
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                }
                else{
                    // edit
                    const exclude_hid = thisObj.curDataSowBoar.hid;
                    const cur_sow_boar = thisObj.getSowBoar(input_number, null, exclude_hid);
                    
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                }
            }
        }
        
        if (validation != 0){
            if (is_duplicate > 0){
                elemUiNumber.setTextInvalid(label_duplicate_entry);
            }
            else{
                elemUiNumber.setTextInvalid(label_number_invalid);
            }
        }
        
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        // check if both name and number are blank
        if (input_name.length == 0 && input_number.length == 0){
            validation = -1;
            
            elemUiName.setTextInvalid(label_cannot_be_blank);
            elemUiNumber.setTextInvalid(label_cannot_be_blank);
            
            input_elem          = elemUiName.getElemText();
            addValidationClassToElem(input_elem, validation);
            
            input_elem          = elemUiNumber.getElemText();
            addValidationClassToElem(input_elem, validation);
        }
        if (validation != 0) {return;}
        
        
        let dt_dob_s = null;
        
        if (input_date_birth.length == 0){
            input_date_birth = null;
        } else{
            input_elem          = elemUiDateOfBirth.getElemText();
            
            // Convert date to YYYY-MM-DD format
            const dt_dob        = new Date(input_date_birth);
            if (isNaN(dt_dob.getTime())){
                validation      = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
            
            
            dt_dob_s            = dt_dob.toLocaleDateString('en-CA');
            validation          = 0; // validated by bootstrap
            addValidationClassToElem(input_elem, validation);
        }
        if (validation != 0) {return;}
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        
        const is_external   = elemUiIsExternal.getElemCheckBox().checked;
        const is_prod_ready = elemUiIsProdReady.getElemCheckBox().checked;
        
        
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
        const post_data = {
            'uhid':             user_hid,
            'pfhid':            pig_farm_hid,
            
            'number':           input_number,
            'name':             input_name,
            'date_of_birth':    dt_dob_s,
            
            'sex':              sex,
            'is_production_ready': is_prod_ready? 1 : 0,
            'num_nipples':      num_nipples,
            'notes':            input_notes
        };
        
        if (input_parent_sow_id){
            post_data['parent_sow_hid'] = input_parent_sow_id;
        }
        
        if (input_parent_boar_id){
            post_data['parent_boar_hid'] = input_parent_boar_id;
        }
        
        
        if (showOptions.is_add == false){
            // edit entry
            delete post_data.pfhid;
            
            post_data['sow_boar_hid'] = thisObj.curDataSowBoar.sow_boar.hid;
            post_data['sow_status_id']= thisObj.curDataSowBoar.sow_boar.status_id;
            
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
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
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
                    
                    
                    if (showOptions.is_add == true){
                        // Add action can either go back to SowBoar List page 
                        // or AddGestating Entry page
                        
                        
                        if ('go_back_page_id' in showOptions){
                            if (showOptions.go_back_page_id == PAGE_ID.SOW_BOAR_LIST){
                                // This should go to SowBoar List page 
                                
                                const callback_success = function(){
                                    navigation.pageSowBoarList.show(null);
                                    
                                    navigation.managerNavHistory.removeFromNavHistoryHead(
                                        showOptions.go_back_page);
                    
                                    
                                    navigation.showThisPage(showOptions.go_back_page);
                                };
                                
                                navigation.pigFarm.managerSowBoar.requestSowBoarList(
                                    is_sow, callback_success, elemServerErrorMsg);

                                return;
                            }
                        }
                        
                        
                        
                        // This should go to AddGestating Entry page
                        
                        const new_sow_boar_hid = response.sow_boar.hid;
                        const callback_success = function(){
                            thisObj.callbackOnSuccessAdd(new_sow_boar_hid);
                            navigation.showThisPage(showOptions.go_back_page);
                        };
                        
                        navigation.pigFarm.managerSowBoar.requestSowBoarList(
                            is_sow, callback_success, elemServerErrorMsg);
                        
                    }
                    
                    else{
                        // The change in sow_boar.is_production_ready flag 
                        // will trigger to request sow_boar list again.
                        if (thisObj.curDataSowBoar.sow_boar.is_production_ready != post_data.is_production_ready){
                            const callback_success = function(){
                                navigation.pageSowBoarList.show(null);
                                navigation.showThisPage(showOptions.go_back_page);
                            };
                            
                            navigation.pigFarm.managerSowBoar.requestSowBoarList(
                                is_sow, callback_success, elemServerErrorMsg);
                            return;
                        }
                        
                        // Edit action will
                        // 1.) replace this data only.
                        thisObj.curDataSowBoar.sow_boar = response.sow_boar;
                        
                        navigation.pageSowBoarEntry.show(thisObj.curDataSowBoar);
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
