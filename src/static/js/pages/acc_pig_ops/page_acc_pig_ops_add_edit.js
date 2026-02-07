// December 28, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {PAGE_ID,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {ComponentBreadCrumbs}   from '../common/ui/comp_breadcrumb.js';

import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';
import {UiInputCheckBox}        from '../common/ui/input_checkbox.js';


import {ModelAccountPigOps}     from '../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'



export function PageAccPigOpsAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this
        elemIdDivContainer:     elemIdContSowBoarAddEdit
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    const MAXCHAR_PIG_OPS_NAME  = 20;
    
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Gesta Ops List',
                'gotoPageId':   PAGE_ID.ACC_PIG_OPS_LIST
            }
        ]
        
    };
    let componentBreadcrumb     = null;
    
    
    
    let elemIdBtnClose          = null;
    let elemIdHeaderTitle       = null;

    let elemUiName              = null;
    let elemUiDescription       = null;
    let elemUiIsMedVac          = null;

    let elemIdDayNumber         = null;
    let elemIdDayNumberDesc     = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    let elemHeaderTitle         = null;
    
    let elemDayNumber           = null;
    let elemDayNumberDesc       = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    let elemNameCounter         = null;
    let elemShortNameCounter    = null;
    let elemDescriptionCounter  = null;
    
    
    let newEntry                = new ModelAccountPigOps();
        
        
    let showOptions             = null;
        
    let operationType           = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        
        elemIdDayNumber         = `${settings.uniqueKey}-day-number`;
        elemIdDayNumberDesc     = `${settings.uniqueKey}-number-desc`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
    
        
        elemUiName              = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-name`,
        
            className:          'form-group-text',
            textLabel:          'Operation Name',
            isRequired:         false,
            textMaxChars:       MAXCHAR_PIG_OPS_NAME,
            invalidFeedBack:    'Please keep name short.',
            helpText:           ''
        });
        
        
        elemUiDescription        = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        
        
        elemUiIsMedVac        = new UiInputCheckBox({
            uniqueKey:          `${settings.uniqueKey}-is-external`,
        
            textLabel:          'Is MedVac?',
            checkBoxLabel:      'Operation is MedVac',
            helpText:           "Check this if operation requires medicine or pig injection."  
        });
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_name         = elemUiName.getHtml();
        const html_description  = elemUiDescription.getHtml();
        const html_is_medvac    = elemUiIsMedVac.getHtml();
        
        
        
        const html =`
    <div class="form-container">
        ${html_breadcrumb}
        
        <div class="modal-header">
            <h5 class="modal-title">
                <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Pig Operation</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            
            ${html_name}
            
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group-number">
                        <label for="${elemIdDayNumber}" class="form-label">Day Number</label>
                        <input  type="number" 
                                class="form-control" 
                                id="${elemIdDayNumber}" 
                                min="0" 
                                max="365" required>
                        <div class="invalid-feedback">Please enter a valid number. </div>
                        <div class="form-text" id="${elemIdDayNumberDesc}">Days since operation started</div>
                    </div>
                </div>
            </div>
            
            ${html_description}
            
            ${html_is_medvac}
            
        </div>
        
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" style="margin-right:10px;">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>Save
            </button>
        </div>
        
    
    </div>

        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentBreadcrumb.afterHtmlRender();
        
        elemUiName.afterHtmlRender();
        elemUiDescription.afterHtmlRender();
        elemUiIsMedVac.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();

    }
    
    
    this._findElements = function(){
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        
        elemDayNumber           = elemDivContainer.querySelector('#'+elemIdDayNumber);
        elemDayNumberDesc       = elemDivContainer.querySelector('#'+elemIdDayNumberDesc);
        
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
    
    
    this._resetForm = function(){
        elemUiName.reset();
        elemUiDescription.reset();
        elemUiIsMedVac.reset();
        
        let cur_elem;
        
        cur_elem = elemDayNumber;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid');
        
    }
    
    
    // Reset add form
    this.beforeShow = function(options){
        let header_title;
        let min_days;
        let max_days;
        let num_days_title;
        
        /** Typical options
         options ={
            operation_type:         curAccPigOpsType,
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
         
         * */
        
        
        thisObj._resetForm();
        
        showOptions = options;
        
        operationType = options.operation_type;
        
        switch (showOptions.operation_type) {
            case PIG_OPERATION_TYPE.GESTATING:{
                header_title    = 'New <b>Gestating</b> Operation';
                min_days        = 0;
                max_days        = 114;
                num_days_title  = "Number of days since boar mating or insemination. ";
                
                settingsBreadcrumb.items[0].label = 'Gesta Ops';
                componentBreadcrumb.refreshLabels();
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS: {
                header_title    = 'New <b>Lactating Piglets</b> Operation';
                min_days        = 1;
                max_days        = 45;
                num_days_title  = "Number of days since piglets birth. ";
                
                settingsBreadcrumb.items[0].label = 'Lacta Piglets Ops';
                componentBreadcrumb.refreshLabels();
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                header_title    = 'New <b>Lactating Sow</b> Operation';
                min_days        = 1;
                max_days        = 45;
                num_days_title  = "Number of days since piglets birth. ";
                
                settingsBreadcrumb.items[0].label = 'Lacta Sow Ops';
                componentBreadcrumb.refreshLabels();

                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                header_title    = 'New <b>Gilt</b> Operation';
                min_days        = 1;
                max_days        = 300;
                num_days_title  = "Number of days since gilt birth.";
                
                settingsBreadcrumb.items[0].label = 'Gilt Ops';
                componentBreadcrumb.refreshLabels();

                break;
            }
        }
        
        elemDayNumber.setAttribute("min", min_days); // Set a data attribute
        elemDayNumber.setAttribute("max", max_days); // Set a data attribute
        
        elemDayNumberDesc.innerHTML = num_days_title + ' Max ' + max_days;
        
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
     
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'day_num': {
                    input_elem  = elemDayNumber;
                    input_val   = input_elem.value;
                    cur_field   = newEntry.fieldNumDaysSince;
                    
                    
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
                
              }
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let cur_field       = null;
        let validation      = 0;
        let proceed_to_save = 1;
        
		
        let input_name      = elemUiName.getValue().trim();
        let input_description= elemUiDescription.getValue().trim();
        let input_num_days  = elemDayNumber.value;
        

        input_elem          = elemUiName.getElemText();
        if (input_name.length == 0){input_name = null;}
        cur_field.newValue  = input_name;
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
        
        if (proceed_to_save == 0) {return;}
        
        
        input_elem          = elemShortName;
        cur_field           = newEntry.fieldShortName;
        cur_field.newValue  = input_short_name;
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
        
        if (proceed_to_save == 0) {return;}
        
        
        input_elem          = elemDescription;
        cur_field           = newEntry.fieldDescription;
        cur_field.newValue  = input_description;
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
        
        if (proceed_to_save == 0) {return;}
        
		
        
        input_elem          = elemDayNumber;
        cur_field           = newEntry.fieldNumDaysSince;
        cur_field.newValue  = input_num_days;
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
        
        if (proceed_to_save == 0) {return;}
        
        
        let user_hid        = gController.getUserUhid();
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'operation_type':   operationType,
            'num_days_since':   parseInt(newEntry.fieldNumDaysSince.newValue),
            'name':             newEntry.fieldName.newValue,
            'short_name':       newEntry.fieldShortName.newValue,
            'description':      newEntry.fieldDescription.newValue
        };
        

        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: gController.getBaseUrl() + '/account_pig_ops/add',
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj._onSuccessAddEntry(response.data);
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
