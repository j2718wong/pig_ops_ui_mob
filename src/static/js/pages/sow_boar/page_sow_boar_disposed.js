// January 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageSowBoarEntryComponent} from './page_sow_boar_entry_component.js';


import {TRANSLATION_PAGE_SOW_BOAR_ADD_EDIT} from  '../../translations/page_sow_boar_add_edit_i8n.js';

import {TextTranslation}        from '../common/translation.js';

import {ComponentReadOnly}      from '../common/ui/comp_read_only_field.js';

import {getSowBoarReference}    from '../common/common_app.js';


import {PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        REQUEST_ERROR_NUM}      from '../../constants.js';





export function PageSowBoarDisposed(input_settings){
    input_settings['uniqueKey'] = 'sow-boar-disposed';
    
    PageSowBoarEntryComponent.call(this, input_settings);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
        
    let elemIdBtnClose          = null;
    
    let elemIdHeaderTitle       = null;
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    
    let elemReadOnlyName        = null;
    let elemReadOnlyNumber      = null;
    let elemReadOnlyDateBirth   = null;
    let elemReadOnlyParentSow   = null;
    let elemReadOnlyParentBoar  = null;
    
    
    let elemReadOnlyBirthProdId = null;
    let elemReadOnlyNumNipples  = null;
    
    let elemReadOnlyIsExternal  = null;
    let elemReadOnlyIsProdReady = null;
    let elemReadOnlyNotes       = null;
    

    let elemReadOnlyDisposedBy  = null;
    
    
    let elemBtnClose            = null
    let elemHeaderTitle         = null;
    
    let elemInfoShow            = null;
    
    
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
  
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        
        
        elemReadOnlyName        = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-name`,
        
            className:          'form-group-text',
            textLabel:          'Name',
            textValue:          ''
        });
        
        
        elemReadOnlyNumber      = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-number`,
        
            className:          'form-group-text',
            textLabel:          'Number',
            textValue:          ''
        });
        
        
        elemReadOnlyDateBirth   = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-date-birth`,
        
            className:          'form-group-text',
            textLabel:          'Date of Birth',
            textValue:          ''
        });
        
        
        elemReadOnlyBirthProdId = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-birth-prod-id`,
        
            className:          'form-group-select',
            textLabel:          'Birth Prod ID',
            textValue:          ''
        });
        
        
        elemReadOnlyParentSow    = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-parent-sow`,
        
            className:          'form-group-select',
            textLabel:          'Parent Sow',
            textValue:          ''
        });
        
        elemReadOnlyParentBoar   = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-parent-boar`,
        
            className:          'form-group-select',
            textLabel:          'Parent Boar',
            textValue:          ''
        });
        
        
        elemReadOnlyNumNipples   = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-num-nipples`,
        
            className:          'form-group-select',
            textLabel:          'Number of  Nipples',
            textValue:          ''
        });
        
        
        elemReadOnlyIsExternal   = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-is-external`,
        
            className:          'form-group-check',
            textLabel:          'Is External?',
            textValue:          ''
        });
        
        
        elemReadOnlyIsProdReady  = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-is-prod-ready`,
        
            className:          'form-group-check',
            textLabel:          'Is Ready for Mating?',
            textValue:          ''
        });
        
        
        elemReadOnlyNotes       = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-notes`,
        
            className:          'form-group-text',
            textLabel:          'Notes',
            textValue:          ''
        });
        
        
        elemReadOnlyDisposedBy   = new ComponentReadOnly({
            uniqueKey:          `${settings.uniqueKey}-disposed-by`,
        
            className:          'form-group-text',
            textLabel:          'Disposed By',
            textValue:          ''
        });
        
        
        // should show up only if edit
        const html_breadcrumb       = thisObj.componentBreadcrumb.getHtml();
        
        
        const html_ui_name          = elemReadOnlyName.getHtml();
        const html_ui_number        = elemReadOnlyNumber.getHtml();
        
        const html_ui_date_birth    = elemReadOnlyDateBirth.getHtml();
        const html_ui_birth_prod_id = elemReadOnlyBirthProdId.getHtml();
        
        
        const html_ui_parent_sow    = elemReadOnlyParentSow.getHtml();
        const html_ui_parent_boar   = elemReadOnlyParentBoar.getHtml();
        
        const html_ui_num_nipples   = elemReadOnlyNumNipples.getHtml();
        
        
        const html_ui_is_external   = elemReadOnlyIsExternal.getHtml();
        const html_ui_is_prod_ready = elemReadOnlyIsProdReady.getHtml();
        const html_ui_notes         = elemReadOnlyNotes.getHtml();
        
        const html_ui_disposed_by   = elemReadOnlyDisposedBy.getHtml();
        
        
        const html =`

        
<div class="form-container">
    ${html_breadcrumb}
    
    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}">Disposed</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- Mobile Info Box -->
        <!--
        <div class="warning-box" id="${elemIdInfoShow}">
        </div>
        -->
        
        <!-- 1. Name -->
        ${html_ui_name}
        
        <!-- 2. Number -->
        ${html_ui_number}
        
        <!-- 3. Date of Birth -->
        ${html_ui_date_birth}
        
        <!-- 4. Parent Sow Field -->
        ${html_ui_parent_sow}
        
        <!-- 5. Parent Boar Field -->
        ${html_ui_parent_boar}
        
        
        ${html_ui_birth_prod_id}
        
        
        <!-- Number of Sow nipples -->
        ${html_ui_num_nipples}
        
        <!-- 4. Is External -->
        ${html_ui_is_external}
        
        <!-- 5. Is Production Ready -->
        ${html_ui_is_prod_ready}
        
        <!-- 6. Notes -->
        ${html_ui_notes}
        
        
        ${html_ui_disposed_by}
        
    </div>
</div>

        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        thisObj.afterHtmlRenderSowBoarEntryComponent();
        
        elemReadOnlyName.afterHtmlRender();
        elemReadOnlyNumber.afterHtmlRender();
        
        elemReadOnlyDateBirth.afterHtmlRender();
        
        elemReadOnlyParentSow.afterHtmlRender();
        elemReadOnlyParentBoar.afterHtmlRender();
        elemReadOnlyNumNipples.afterHtmlRender();
        elemReadOnlyBirthProdId.afterHtmlRender();
        
        elemReadOnlyIsExternal.afterHtmlRender();
        elemReadOnlyIsProdReady.afterHtmlRender();
        elemReadOnlyNotes.afterHtmlRender();
        
        elemReadOnlyDisposedBy.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = document.getElementById(elemIdHeaderTitle);
        elemBtnClose            = document.getElementById(elemIdBtnClose);
        
        elemInfoShow            = document.getElementById(elemIdInfoShow);
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        
    }
    
    
    this._bindEventListeners = function(){
        
             
    }
    
    
    this._resetForm = function(){
        elemReadOnlyName.reset();
        elemReadOnlyNumber.reset();
        elemReadOnlyDateBirth.reset();
        elemReadOnlyParentSow.reset();
        elemReadOnlyParentBoar.reset();
        elemReadOnlyNumNipples.reset();
        elemReadOnlyNotes.reset();
        
        elemReadOnlyDisposedBy.reset();
    }
    
        
    this.beforeShow = function(options, data_sow_boar){
        /*
        Typical options
        options ={
            sow_boar_type:  showOptions.sow_boar_type,
            go_back_page:   elemDivContainer   // Go back to this page
        }

        
        */
        
        thisObj._resetForm();
        
        showOptions = options;
        
        let html;

        
        thisObj.curDataSowBoar = data_sow_boar;
        thisObj.componentBreadcrumb.show();
        thisObj.updateBreadCrumbs();
        
        
        
        
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
        thisObj.populateForm(data_sow_boar);
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        
    }
    
    
    this.populateForm = function(data_sow_boar){
        
        let cur_sow_boar = data_sow_boar;
        if ('sow_boar' in data_sow_boar){
            cur_sow_boar = data_sow_boar.sow_boar;
        }
        
        
        elemReadOnlyName.setValue(cur_sow_boar.name);
        elemReadOnlyNumber.setValue(cur_sow_boar.number);
        
        if (cur_sow_boar.date_of_birth){
            elemReadOnlyDateBirth.setValue(cur_sow_boar.date_of_birth);
        }
        
        
        const parent_sow = {
            'name':     (cur_sow_boar.parent_sow_name)? cur_sow_boar.parent_sow_name: '',
            'number':   (cur_sow_boar.parent_sow_number)? cur_sow_boar.parent_sow_number: ''
        };
        const parent_sow_name = getSowBoarReference(parent_sow)
        
        const parent_boar = {
            'name':     (cur_sow_boar.parent_boar_name)? cur_sow_boar.parent_boar_name: '',
            'number':   (cur_sow_boar.parent_boar_number)? cur_sow_boar.parent_boar_number: ''
        };
        const parent_boar_name = getSowBoarReference(parent_boar)
        
        
        elemReadOnlyParentSow.setValue(parent_sow_name);
        elemReadOnlyParentBoar.setValue(parent_boar_name);       
        
        if (cur_sow_boar.is_external && cur_sow_boar.is_external > 0) {
            elemReadOnlyIsExternal.setValue('Yes');
        }
        else{
            elemReadOnlyIsExternal.setValue('No');
        }
        
        if (cur_sow_boar.is_production_ready > 0) {
            elemReadOnlyIsProdReady.setValue('Yes');
        }
        else{
            elemReadOnlyIsProdReady.setValue('No');
        }
        
        
        if (cur_sow_boar.num_nipples ){
            elemReadOnlyNumNipples.show();
            elemReadOnlyNumNipples.setValue(cur_sow_boar.num_nipples);
        }
        else{
            elemReadOnlyNumNipples.hide();
        }
        
        if (cur_sow_boar.add_notes ){
            elemReadOnlyNotes.setValue(cur_sow_boar.add_notes);
        }
        else{
            elemReadOnlyNotes.setValue('');
        }
        
        const last_update = cur_sow_boar.last_update;
        
        let disposed_by = `${last_update.name_first} ${last_update.name_last} on ${cur_sow_boar.date_dispose}`
        elemReadOnlyDisposedBy.setValue(disposed_by);
        
    }
    
    
}   