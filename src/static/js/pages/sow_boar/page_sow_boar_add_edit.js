// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

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



PageSowBoarAddEdit.prototype = new PageViewPigFarmPage();
export function PageSowBoarAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const MAXCHAR_SOW_BOAR_NAME     = 20;
    const MAXCHAR_SOW_BOAR_NUMBER   = 10;
    const MAXCHAR_NOTES             = 160;
    
    /*
    Typical settings = {
        navigation:             this
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById('container-sow-boar-add-edit');
        
        
    let elemIdBtnClose          = null;
    
    let elemIdHeaderTitle       = null;
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    let elemIdName              = null;
    let elemIdNameCharCounter   = null;
    let elemIdNameInv           = null;
    let elemIdNumber            = null;
    let elemIdNumberCharCounter = null;
    let elemIdNumberInv         = null;
    let elemIdDateOfBirth       = null;
    let elemIdBirthProdIdShow   = null;
    let elemIdBirthProdId       = null;
    let elemIdNumNipplesShow    = null;
    let elemIdNumNipples        = null;
    let elemIdIsExternalShow    = null;
    let elemIdIsExternal        = null;
    let elemIdIsProdReadyShow   = null;
    let elemIdIsProdReady       = null;
    let elemIdNotes             = null;
    let elemIdNotesCharCounter  = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    
    
    let elemHeaderTitle         = null;
            
    let elemInfoShow            = null;
    let elemInfo                = null;
        
    let elemName                = null;
    let elemNameCharCounter     = null;
    let elemNameInv             = null;
    let elemNumber              = null;
    let elemNumberCharCounter   = null;
    let elemNumberInv           = null;
    let elemDateOfBirth         = null;
    let elemBirthProdIdShow     = null;
    let elemBirthProdId         = null;
    let elemNumNipplesShow      = null;
    let elemNumNipples          = null;
    let elemIsExternalShow      = null;
    let elemIsExternal          = null;
    let elemIsProdReadyShow     = null;
    let elemIsProdReady         = null;
    let elemNotes               = null;
    let elemNotesCharCounter    = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    // Collapsible  panel elements
    let elemIdUpdateStatusShow  = null;
    
    let elemIdPanelHeader       = null;
    let elemIdPanelTitle        = null;
    let elemIdPanelArrowIcon    = null;
    let elemIdPanelBody         = null;
    let elemIdDateStatus        = null;
    let elemIdStatusInv         = null;
    let elemIdStatusNotes       = null;
    let elemIdStatusNotesCharCounter = null;
    let elemIdUpdateStatusErrorMsg  = null;
    let elemIdBtnUpdateStatus   = null;
    
    let elemUpdateStatusShow    = null;
    
    let elemPanelHeader         = null;
    let elemPanelTitle          = null;
    let elemPanelArrowIcon      = null;
    let elemPanelBody           = null;
    let elemDateStatus          = null;
    let elemStatusInv           = null;
    let elemStatusNotes         = null;
    let elemStatusNotesCharCounter = null;
    let elemUpdateStatusErrorMsg = null;
    let elemBtnUpdateStatus     = null;
    
    
    
    
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
    
    
    let sowBoarEntry            = new ModelSowBoar();
    
    // This may not contain sex information
    let curDataSowBoar          = null;
    
    // This is an explicit computation during show;
    // true is Show Sow or Show Gilt; 
    let curIsSow                = null;
    
    this.callbackOnSuccessAdd   = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `sow-boar-add-edit-close`;
        
        elemIdHeaderTitle       = `sow-boar-add-edit-title`;
        
            
        elemIdInfoShow          = `sow-boar-add-edit-info-show`;
        elemIdInfo              = `sow-boar-add-edit-info`;
        
        elemIdName              = `sow-boar-add-edit-name`;
        elemIdNameCharCounter   = `sow-boar-add-edit-name-counter`;
        elemIdNameInv           = `sow-boar-add-edit-name-inv`;
        elemIdNumber            = `sow-boar-add-edit-number`;
        elemIdNumberCharCounter = `sow-boar-add-edit-number-counter`;
        elemIdNumberInv         = `sow-boar-add-edit-number-inv`;
        
        elemIdDateOfBirth       = `sow-boar-add-edit-date-of-birth`;
        elemIdBirthProdIdShow   = `sow-boar-add-edit-birth-prod-id-show`;
        elemIdBirthProdId       = `sow-boar-add-edit-birth-prod-id`;
        
        elemIdNumNipplesShow    = `sow-boar-add-edit-num-nipples-show`;
        elemIdNumNipples        = `sow-boar-add-edit-num-nipples`;
        elemIdIsExternalShow    = `sow-boar-add-edit-is-external-show`;
        elemIdIsExternal        = `sow-boar-add-edit-is-external`;
        elemIdIsProdReadyShow   = `sow-boar-add-edit-is-prod-ready-show`;
        elemIdIsProdReady       = `sow-boar-add-edit-is-prod-ready`;
        elemIdNotes             = `sow-boar-add-edit-notes`;
        elemIdNotesCharCounter  = `sow-boar-add-edit-notes-counter`;
        
        elemIdServerErrorMsg    = `sow-boar-add-edit-server-error-msg`;
        elemIdBtnCancel         = `sow-boar-add-edit-cancel`;
        elemIdBtnSave           = `sow-boar-add-edit-save`;
        
        const html_update_status = thisObj.getHtmlUpdateStatus();
        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Sow</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- Mobile Info Box -->
        <div class="warning-box" id="${elemIdInfoShow}">
            Adding a new Gilt will create schedule for new Gilt Pig Operations.
        </div>
        
        ${html_update_status}
        
        <!-- 1. Name -->
        <div class="form-group-text">
            <label for="${elemIdName}" class="form-label">Name
                <span id="${elemIdNameCharCounter}" class="char-counter">0/${MAXCHAR_SOW_BOAR_NAME}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdName}" maxlength="${MAXCHAR_SOW_BOAR_NAME}">
            <div class="invalid-feedback" id="${elemIdNameInv}">Please enter a valid name. </div>
            <div class="form-text">Pig name to easily remember.</div>
        </div>
        
        <!-- 2. Number -->
        <div class="form-group-text">
            <label for="${elemIdNumber}" class="form-label">Number
                <span id="${elemIdNumberCharCounter}" class="char-counter">0/${MAXCHAR_SOW_BOAR_NUMBER}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdNumber}" maxlength="${MAXCHAR_SOW_BOAR_NUMBER}">
            <div class="invalid-feedback" id="${elemIdNumberInv}">Please enter a pig number. </div>
            <div class="form-text">This can be an eartag number of your pig.</div>
        </div>
        
        <!-- 3. Date of Birth -->
        <div class="form-group-date">
            <label for="${elemIdDateOfBirth}" class="form-label">
                Date of Birth
            </label>
            <input type="text" class="form-control" id="${elemIdDateOfBirth}">
            <div class="form-text">This is use to calculate pig's age.</div>
        </div>
        
        <div class="form-group-text" id="${elemIdBirthProdIdShow}">
            <label class="form-label">Birth Prod ID</label>
            <span class="" id="${elemIdBirthProdId}"></span>
        </div>
        
        <!-- Number of Sow nipples -->
        <div class="form-group-number" id="${elemIdNumNipplesShow}">
            <label for="${elemIdNumNipples}" class="form-label">
                Number of Nipples
            </label>
            <div class="number-input-group">
                <button class="number-btn minus" data-target="${elemIdNumNipples}">-</button>
                <input type="number" class="form-control number-input" id="${elemIdNumNipples}" value="14" min="12">
                <button class="number-btn plus" data-target="${elemIdNumNipples}">+</button>
            </div>
            <div class="form-text">Yes. We record this. You better count.</div>
        
        </div>
        
        
        <!-- 4. Is External -->
        <div class="form-group-select" id="${elemIdIsExternalShow}">
            <label for="${elemIdIsExternal}" class="form-label">
                Is External?
            </label>
            <input type="checkbox" id="${elemIdIsExternal}">
            <label for="${elemIdIsExternal}" class="checkbox-label">
                External
            </label>
            <div class="form-text">Check this if you borrowed your neighbor's boar.</div>
        </div>
        
        <!-- 5. Is Production Ready -->
        <div class="form-group-select">
            <label for="${elemIdIsProdReady}" class="form-label">
                Is Ready for Mating?
            </label>
            <input type="checkbox" id="${elemIdIsProdReady}">
            <label for="${elemIdIsProdReady}" class="checkbox-label">
                Production Ready
            </label>
            <div class="form-text">Need to specify if ready to mate. 
                <span class="sow-only"> Not Production Ready sow will be listed in Gilt List. </span>
            </div>
        </div>
        
        
        <!-- 6. Notes -->
        <div class="form-group-text-area">
            <label for="${elemIdNotes}" class="form-label">
                Notes
                <span id="${elemIdNotesCharCounter}" class="char-counter">0/${MAXCHAR_NOTES}</span>
            </label>
            
            <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="${MAXCHAR_NOTES}"></textarea>
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
    
    
    this.getHtmlUpdateStatus = function(){
        elemIdUpdateStatusShow  = `sow-boar-add-edit-update-status-show`;
        
        elemIdPanelHeader       = `sow-boar-add-edit-panel-header`;
        elemIdPanelTitle        = `sow-boar-add-edit-panel-title`;
        elemIdPanelArrowIcon    = `sow-boar-add-edit-panel-arrow`;
        elemIdPanelBody         = `sow-boar-add-edit-panel-body`;
        elemIdDateStatus        = `sow-boar-add-edit-date-status`;
        elemIdStatusInv         = `sow-boar-add-edit-status-inv`;
        elemIdStatusNotes       = `sow-boar-add-edit-status-notes`;
        elemIdStatusNotesCharCounter = `sow-boar-add-edit-status-notes-char-counter`;
        
        elemIdUpdateStatusErrorMsg = `sow-boar-add-edit-btn-update-status-error-msg`;
        elemIdBtnUpdateStatus   = `sow-boar-add-edit-btn-update-status`;
        
        const html = `
        <!-- Collapsible Panel -->
        <div class="collapsible-panel mb-4" id="${elemIdUpdateStatusShow}" style="display:none;">
            <!-- Header with arrow icon -->
            <div class="collapsible-header" id="${elemIdPanelHeader}">
                <span id="${elemIdPanelTitle}">Update Pig Status</span>
                <i class="bi bi-chevron-down arrow-icon" id="${elemIdPanelArrowIcon}"></i>
            </div>
            
            <!-- Body content -->
            <div class="collapsible-body" id="${elemIdPanelBody}">
                <!-- Warning box -->
                <div class="warning-box">
                    <div class="warning-header">
                        <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
                        <span>Update Pig Status</span>
                    </div>
                    <div>
                        Updating pig status to any of the options below will remove it from the active list.
                        <b>This cannot be undone.</b>
                    </div>
                </div>
                
                
                
                <!-- Date Status input -->
                <div class="mb-3">
                    <label for="${elemIdDateStatus}" class="form-label">Date Status <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="${elemIdDateStatus}" required>
                </div>
                
                <!-- Radio buttons -->
                <div class="mb-3">
                    <label class="form-label d-block">Status Options <span class="text-danger">*</span></label>
                    
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="statusOption" id="deleteOption" value="Delete" required>
                        <label class="form-check-label" for="deleteOption">
                            Delete. Invalid Entry
                        </label>
                    </div>
                    
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="statusOption" id="soldOption" value="Sold">
                        <label class="form-check-label" for="soldOption">
                            Pig is Sold
                        </label>
                    </div>
                    
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="statusOption" id="culledOption" value="Culled">
                        <label class="form-check-label" for="culledOption">
                            Pig is Culled
                        </label>
                    </div>
                    
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="radio" name="statusOption" id="deadOption" value="Dead">
                        <label class="form-check-label" for="deadOption">
                            Pig is Dead
                        </label>
                    </div>
                    
                    <div class="invalid-feedback" id="${elemIdStatusInv}">Please select option. </div>
        
                </div>
                
                <!-- Notes input -->
                <div class="mb-4">
                    <label for="${elemIdStatusNotes}" class="form-label">
                        Notes <span class="text-danger">*</span>
                        <span id="${elemIdStatusNotesCharCounter}" class="char-counter">0/${MAXCHAR_NOTES}</span>
                    </label>
                    <textarea class="form-control" id="${elemIdStatusNotes}" rows="3" placeholder="Add any additional notes here..." required></textarea>
                    <div class="invalid-feedback">Please add some notes. </div>
                </div>
                
                <div class="server-error-msg" id="${elemIdUpdateStatusErrorMsg}"></div>
                
                <!-- Buttons -->
                <div class="d-flex justify-content-between">
                    <button class="btn btn-primary" id="${elemIdBtnUpdateStatus}">Update Status</button>
                </div>
                
            </div>
        </div>
        
        `;
        
        return html;
        
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = document.getElementById(elemIdHeaderTitle);
        elemBtnClose            = document.getElementById(elemIdBtnClose);
        
        elemInfoShow            = document.getElementById(elemIdInfoShow);
        
        elemName                = document.getElementById(elemIdName);
        elemNameCharCounter     = document.getElementById(elemIdNameCharCounter);
        elemNameInv             = document.getElementById(elemIdNameInv);
        elemNumber              = document.getElementById(elemIdNumber);
        elemNumberCharCounter   = document.getElementById(elemIdNumberCharCounter);
        elemNumberInv           = document.getElementById(elemIdNumberInv);
        elemDateOfBirth         = document.getElementById(elemIdDateOfBirth);
        elemBirthProdIdShow     = document.getElementById(elemIdBirthProdIdShow);
        elemBirthProdId         = document.getElementById(elemIdBirthProdId);
        elemNumNipplesShow      = document.getElementById(elemIdNumNipplesShow);
        elemNumNipples          = document.getElementById(elemIdNumNipples);
        elemIsExternalShow      = document.getElementById(elemIdIsExternalShow);
        elemIsExternal          = document.getElementById(elemIdIsExternal);
        elemIsProdReadyShow     = document.getElementById(elemIdIsProdReadyShow);
        elemIsProdReady         = document.getElementById(elemIdIsProdReady);
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
       
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
        
        
        elemUpdateStatusShow    = document.getElementById(elemIdUpdateStatusShow);
        
        elemPanelHeader         = document.getElementById(elemIdPanelHeader);
        elemPanelTitle          = document.getElementById(elemIdPanelTitle);
        elemPanelArrowIcon      = document.getElementById(elemIdPanelArrowIcon);
        elemPanelBody           = document.getElementById(elemIdPanelBody);
        elemDateStatus          = document.getElementById(elemIdDateStatus);
        elemStatusInv           = document.getElementById(elemIdStatusInv);
        elemStatusNotes         = document.getElementById(elemIdStatusNotes);
        elemStatusNotesCharCounter = document.getElementById(elemIdStatusNotesCharCounter);
        elemUpdateStatusErrorMsg= document.getElementById(elemIdUpdateStatusErrorMsg);
        elemBtnUpdateStatus     = document.getElementById(elemIdBtnUpdateStatus);
        
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateOfBirth).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
        
        $('#'+elemIdDateStatus).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
    }
    
    
    this._bindEventListeners = function(){
        // Plus/Minus buttons for piglet counts
        const plusButtons   = elemDivContainer.querySelectorAll('.number-btn.plus');
        const minusButtons  = elemDivContainer.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                input.value = value + 1;
                input.dispatchEvent(new Event('change'));
            });
        });
        
        minusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                if (value > 0) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
        
        
        
        
        
        elemName.addEventListener('input', function(){
            thisObj.updateCharCounter(elemName, elemNameCharCounter, 
                MAXCHAR_SOW_BOAR_NAME);
            
            elemName.classList.remove('is-invalid');
        });
        
        
        elemNumber.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNumber, elemNumberCharCounter, 
                MAXCHAR_SOW_BOAR_NUMBER);
            
            elemNumber.classList.remove('is-invalid');
        });
        
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                MAXCHAR_NOTES);
            
            elemNotes.classList.remove('is-invalid');
        });
        
        
        elemStatusNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemStatusNotes, elemStatusNotesCharCounter, 
                MAXCHAR_NOTES);
            
            elemStatusNotes.classList.remove('is-invalid');
        });
        
        
        elemName.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'name');
        });
        
        elemNumber.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'number');
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
        
        elemPanelHeader.addEventListener('click', function() {
            thisObj.togglePanel();
        });
        
        
        elemBtnUpdateStatus.addEventListener('click', function() {
            thisObj.onClickUpdateStatus();
        });
        
        
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
    }
    
    
    this._getSowBoarById = function(farm_sow_boar_id){
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
            if ((showOptions.sow_boar_type == SOW_BOAR_TYPE.SOW) ||
                (showOptions.sow_boar_type == SOW_BOAR_TYPE.GILT)){
                
                if (cur_entry.farm_sow_id == farm_sow_boar_id){
                    return cur_entry;
                }
            }
            else{
                if (cur_entry.farm_boar_id == farm_sow_boar_id){
                    return cur_entry;
                }
            }
        }
        
        return null;
    }
    
    
    this._getSowBoar = function(name, number, exclude_hid){
        // Note: SowBoar name or number can be null; but not both
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
        
        elemNameInv.style.display = 'none';
        elemNumberInv.style.display = 'none';
      
        
        
        // Remove validation classes
        let cur_elem = null;
        
        cur_elem = elemName;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemNumber;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemDateOfBirth;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemNotes;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        
        cur_elem = elemDateStatus;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemStatusNotes;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        const radios = elemDivContainer.querySelectorAll('input[name="statusOption"]');
        for (const cur_entry of radios){
            cur_entry.checked = false;
        }
        
        
        elemStatusInv.style.display = 'none';
        elemUpdateStatusErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(options){
        /*
        Typical options
        options ={
            is_add:         true,   // false is edit
            sow_boar_type:  1,   
            farm_sow_boar_id: 1,    // only needed for edit
            go_back_page:   elemDivContainer,   // Go back to this page; this is Div element
            go_back_page_id: PAGE_ID.SOW_BOAR_LIST, optional
            from_prod_pid:  null    // can be null or undefined
        }
        */
        thisObj._resetForm();
        
        showOptions = options;
        
        let html;
        let sow_boar_reference;
        
        
        // Show Update Status if edit
        if (options.is_add){
            elemUpdateStatusShow.style.display = 'none';
        } 
        else{
            elemUpdateStatusShow.style.display = 'block';
        }
        
        
        // Sow sow-only info else hide
        const elems_sow_only = elemDivContainer.querySelectorAll('.sow-only');
        
        for (const cur_entry of elems_sow_only){
            if (options.sow_boar_type == SOW_BOAR_TYPE.SOW){
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
        
        
        
        // Change Header title
        switch(options.sow_boar_type){
            case SOW_BOAR_TYPE.SOW: {
                if (options.is_add){
                    html = `<i class="fas fa-plus me-2"></i>Add Sow`;
                }
                else{
                    curDataSowBoar = thisObj._getSowBoarById(options.farm_sow_boar_id);
                    
                    if (curDataSowBoar.name && curDataSowBoar.name.length >0){
                        sow_boar_reference = curDataSowBoar.name;
                    }
                    else{
                        sow_boar_reference = curDataSowBoar.number;
                    }
                    
                    html = `<i class="fas fa-edit me-2"></i>Edit Sow: ${sow_boar_reference}`;
                    
                    thisObj.populateForm(curDataSowBoar);
                }
                elemHeaderTitle.innerHTML = html;
                
                elemInfoShow.style.display = 'none';
                
                // Hide Boar Only info
                elemIsExternalShow.style.display = 'none';
                elemNumNipplesShow.style.display = 'block';
                
                break;
            }
    
            case SOW_BOAR_TYPE.BOAR: {
                if (options.is_add){
                    html = `<i class="fas fa-plus me-2"></i>Add Boar`;
                }
                else{
                    curDataSowBoar = thisObj._getSowBoarById(options.farm_sow_boar_id);
                    
                    if ((curDataSowBoar.name != null) && (curDataSowBoar.name.length >0)){
                        sow_boar_reference = curDataSowBoar.name;
                    }
                    else{
                        sow_boar_reference = curDataSowBoar.number;
                    }
                    
                    html = `<i class="fas fa-edit me-2"></i>Edit Boar: ${sow_boar_reference}`;
                    
                    thisObj.populateForm(curDataSowBoar);
                }
                elemHeaderTitle.innerHTML = html;
                
                elemInfoShow.style.display = 'none';
                
                // Boars can be external to the farm
                elemIsExternalShow.style.display = 'block';
                elemNumNipplesShow.style.display = 'none';
                break;
            }
    
            case SOW_BOAR_TYPE.GILT:{
                if (options.is_add){
                    html = `<i class="fas fa-plus me-2"></i>Add Gilt`;
                    elemInfoShow.style.display = 'block';
                }
                else{
                    html = `<i class="fas fa-edit me-2"></i>Edit Gilt`;
                }
                elemHeaderTitle.innerHTML = html;
                
                
                // Hide Boar Only info
                elemIsExternalShow.style.display = 'none';
                elemNumNipplesShow.style.display = 'block';
                
                break;
            }
            
            case SOW_BOAR_TYPE.GILT:{}
            
        }
        
        
        if(options.is_add){
            elemUpdateStatusShow.style.display = 'none;'
        } else{
            console.log('to display');
            elemUpdateStatusShow.style.display = 'block'
        }
        
        
        // Hide elemBirthProdIdShow
        // BirthProdId will only show up if a production piglet is eartag or
        //  a pig is taken from existing production entry  
        if ('from_prod_pid' in options){
            elemBirthProdIdShow.style.display = 'block';
        }
        else{
            elemBirthProdIdShow.style.display = 'none';
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        
        if (!elemPanelBody.classList.contains('collapsed')) {
            thisObj.togglePanel();
        }
    }
    
    
    this.populateForm = function(data_sow_boar){
        
        //sowBoarEntry.hid    =  
        
        
        elemName.value      = data_sow_boar.name;
        elemNumber.value    = data_sow_boar.number;
        
        if (data_sow_boar.date_of_birth != null){
            const dt_dob    = new Date(data_sow_boar.date_of_birth);
            const dt_dob_s  = formatDate(dt_dob);
            elemDateOfBirth.value = dt_dob_s;
        }
        
        
        if (data_sow_boar.is_external && data_sow_boar.is_external > 0) {
            elemIsExternal.checked = true;
        }
        else{
            elemIsExternal.checked = false;
        }
        
        if (data_sow_boar.is_production_ready > 0) {
            elemIsProdReady.checked = true;
        }
        else{
            elemIsProdReady.checked = false;
        }
        
        
        if (data_sow_boar.num_nipples ){
            elemNumNipples.value = data_sow_boar.num_nipples;
        }
        
        if (data_sow_boar.add_notes ){
            elemNotes.value = data_sow_boar.add_notes;
        }
        
        
        
        thisObj.updateCharCounter(elemName, elemNameCharCounter, 
                MAXCHAR_SOW_BOAR_NAME);
        
        thisObj.updateCharCounter(elemNumber, elemNumberCharCounter, 
                MAXCHAR_SOW_BOAR_NUMBER);
                
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
                
                case 'number': {
                    input_elem  = elemNumber;
                    input_val   = input_elem.value;
                    cur_field   = sowBoarEntry.fieldSowBoarNumber;
                    
                    
                    cur_field.newValue = input_val;
                    validation = cur_field.validateChange();
                    
                    // Additional validation to prevent duplicate 
                    if (validation == FIELD_VALIDATION_OK){
                        if (input_val.length > 0){
                            if (showOptions.is_add){ 
                                const cur_sow_boar = thisObj._getSowBoar(null, input_val);
                    
                                if (cur_sow_boar != null){
                                    is_duplicate = 1;
                                    validation = -1;
                                }
                            
                            } else{
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
                        elemNumberInv.style.display = 'none';
                    } else{
                        if (is_duplicate > 0){
                            elemNumberInv.textContent = 'Duplicate entry.';
                        }
                        else{
                            elemNumberInv.textContent = 'Please enter a valid number.';
                        }
                        elemNumberInv.style.display = 'block';
                        
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
        
       
        
        let input_name      = elemName.value.trim();
        let input_number    = elemNumber.value.trim();
        let input_date_birth= elemDateOfBirth.value.trim();
        let input_num_nipples = elemNumNipples.value;
        let input_notes     = elemNotes.value.trim();
        
        
        is_duplicate        = 0;
        
        input_elem          = elemName;
        cur_field           = sowBoarEntry.fieldSowBoarName;
        cur_field.newValue  = input_name;
        validation          = cur_field.validateChange();
        
        
        // Additional validation to prevent duplicate 
        if (validation == FIELD_VALIDATION_OK){
            if (input_name.length > 0){
                if (showOptions.is_add){ 
                    const cur_sow_boar = thisObj._getSowBoar(input_name, null);
        
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                
                } else{
                    // edit
                    const exclude_hid = curDataSowBoar.hid;
                    const cur_sow_boar = thisObj._getSowBoar(input_name, null, exclude_hid);
                    
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                }
            }
            
        }
        
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
    
    
    this.onClickUpdateStatus = function(){

        let input_elem      = null;
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        
        let input_date_status= elemDateStatus.value.trim();
        let input_notes     = elemStatusNotes.value.trim();
        
        input_elem          = elemDateStatus;
        cur_field           = sowBoarEntry.fieldBirthDate;
        
        let dt_status_s     = null;
        
        if (input_date_status.length == 0){
            validation = -1;
        }
        else{
            // Convert date to YYYY-MM-DD format
            const dt_status     = new Date(input_date_status);
            
            dt_status_s         = dt_status.toLocaleDateString('en-CA');
            validation          = FIELD_VALIDATION_OK;
        }
            
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
        
        if (proceed_to_save == 0) {return;}
        
          
        const checkedRadio = elemDivContainer.querySelector('input[name="statusOption"]:checked');
        
        if (checkedRadio == null){
            elemStatusInv.style.display ='block';
            return;
        } 
        else{
            elemStatusInv.style.display ='none';
        }
        
        const value = checkedRadio.value;
        
        let dispose_status_id = 0;
        
        
        // Delete has no mapped sow_status_id in the backend.
        // The sow_status_id is for both sows and boars
        // and purely for operations only. The delete action is
        // interpreted as user entry error.
        // The Delete status will be mapped to a special number
        // SOW_STATUS.DELETE. But this will not be marked as
        // sow_boar.is_disposed but will be marked as
        // sow_boar.flag.is_deleted = 1;
        //
        // When disposed pigs are queried in the front end,
        // both the disposed pigs and deleted pigs will be returned.
        
        switch(value){
            case 'Delete':{
                dispose_status_id = SOW_STATUS.DELETE;
                break;
            }
            
            case 'Sold':{
                dispose_status_id = SOW_STATUS.SOLD;
                break;
            }
            
            case 'Culled':{
                dispose_status_id = SOW_STATUS.CULLED;
                break;
            }
            
            case 'Dead':{
                dispose_status_id = SOW_STATUS.DEAD;
                break;
            }
            
        }
        
        const user_hid      = navigation.userControl.getUserHid();
        const pig_farm_hid  = navigation.userControl.getCurrentFarmHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        let post_data = {
            'uhid':             user_hid,
            'sow_boar_hid':     curDataSowBoar.hid,
            
            'dispose_status_id': dispose_status_id,
            'date_dispose':     dt_status_s,
            'dispose_notes':    input_notes
        };
        
        
        let url = `${base_url}/sow_boar/dispose`;
        
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
                    
                    const callback_error = function(error_code, error_desc){
                        let html;
                        if ((error_desc != null) && (error_desc.length > 0)){
                            html = `<span>${error_desc}</span>`;
                        }
                        else{
                            html = `<span>${error_code}</span>`;
                        }
                        
                        elemUpdateStatusErrorMsg.innerHTML = html;
                        elemUpdateStatusErrorMsg.style.display = 'block'
                    };
                    
                    const callback_success = function(){
                        navigation.pageSowBoarList.show(null);
                        navigation.showThisPage(showOptions.go_back_page);
                    };
                    
                    navigation.pigFarm.requestDataSowBoar(showOptions.is_sow, 
                        callback_success, callback_error);
                        
                    
                    
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemUpdateStatusErrorMsg);
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