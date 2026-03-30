// March 8, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';
    
import {APPLICATION,    
        PAGE_ID,    
        PIG_OPERATION_TYPE}         from '../../../constants.js';
    
import {ComponentBreadCrumbs}       from '../../common/ui/comp_breadcrumb.js';
    
    
import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';
import {UiSelectWithEntryCount}     from '../../common/ui/select_with_entry_count.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {ComponentPlusMinusInput}    from '../../common/ui/comp_plus_minus_input.js';

import {ComponentPigDeadType}       from './comp_pig_dead_type.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';



export function PagePigDeadAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PagePigDeadAddEdit';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    const INVALID_MSG_NUM_INPUT = 'Please enter a valid number.';
    
    /*
    Typical settings = {
        navigation:             this
        elemIdDivContainer:     elemIdContSowBoarAddEdit
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    

    
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Pig Dead List',
                'gotoPageId':   PAGE_ID.PIG_DEAD_LIST
            }
        ]
        
    };
    let componentBreadcrumb     = null;
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    

    let elemUiDateDead          = null;
    let elemUiCurrentProduction = null;
    let componentNumDead        = null;
    let componentDeadType       = null;
    let elemUiNotes             = null;
    

    let elemIdDayNumber         = null;
    let elemIdDayNumberDesc     = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    let elemDayNumber           = null;
    let elemDayNumberDesc       = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let curDataAccPigOps        = null;
    
        
        
    let showOptions             = null;
        
    
    let operationType           = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
    
    
        elemUiDateDead          = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-dead`,
        
            textLabel:          'Date Dead',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        elemUiCurrentProduction  = new UiSelectWithEntryCount({
            uniqueKey:          `${settings.uniqueKey}-pig-prod`,
            navigation:         navigation,
        
            labelSelect:        'Select Current Production',
            helpText:           null
        });
        
        
        
        componentNumDead        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-dead`,
            
            className:          'form-group-number',
            textLabel:          'Number Dead Pigs',
            minValue:           0,
            step:               1,
            isRequired:         false,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        componentDeadType       = new ComponentPigDeadType({
            uniqueKey:          `${settings.uniqueKey}-dead-type`,
            navigation:         navigation,
        
            labelSelect:        'Select Dead Type',
            helpText:           null
        });
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Description',
            textMaxChars:       160,
            rows:               3,
            helpText:           'Describe what happen to pig.' 
        });
        
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_date_dead    = elemUiDateDead.getHtml();
        const html_production   = elemUiCurrentProduction.getHtml();
        const html_num_dead     = componentNumDead.getHtml();
        const html_dead_type    = componentDeadType.getHtml();
        const html_notes        = elemUiNotes.getHtml();
        
        
        
        const html =`
    <div class="form-container">
        ${html_breadcrumb}
        
        <div class="modal-header">
            <h5 class="modal-title">
                <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Pig Dead</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            ${html_date_dead}
            
            ${html_production}
            
            ${html_num_dead}
            
            ${html_dead_type}
            
            ${html_notes}
            
            <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
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
        componentBreadcrumb.afterHtmlRender();
        
        elemUiDateDead.afterHtmlRender();         
        elemUiCurrentProduction.afterHtmlRender();
        componentNumDead.afterHtmlRender();   
        componentDeadType.afterHtmlRender();    
        elemUiNotes.afterHtmlRender();            
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();

    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        
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
    
    
    this._resetForm = function(){
        
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.options);
    }
    
    
    // Reset add form
    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options:options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        thisObj._resetForm();
        
        showOptions = options;
        
        
        let html;
        if (showOptions.is_add){
            html    = `<i class="fas fa-plus me-2"></i>Add Pig Dead`;
        }
        else {
            html    = `<i class="fas fa-edit me-2"></i>Edit Pig Dead`;
        }
        elemHeaderTitle.innerHTML = html;
        
        
        // Populate Dead Type
        componentDeadType.beforeShow();
        
        
        // Populate current production
        thisObj.populateCurrentProduction();
        
        
        
        // Populate form if edit
        if (showOptions.is_add == 0){
            thisObj.populateForm(data_acc_pig_ops);
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            // This will not redraw the previous page; only shwo container
            navigation.showThisPage(showOptions.go_back_page);
            
            if (APPLICATION.DEBUG_NAV_HISTORY){
                console.log('\n\nBack to Pig Dead List ')
                thisObj.debugNavHistory(TAG);
            }
        };
        
        elemBtnCancel.onclick = function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            // This will not redraw the previous page; only shwo container
            navigation.showThisPage(showOptions.go_back_page);

            
            if (APPLICATION.DEBUG_NAV_HISTORY){
                console.log('\n\nBack to Pig Dead List ')
                thisObj.debugNavHistory(TAG);
            }

        };
    }
    
    
    this.populateCurrentProduction = function(){
        let prod_list = [];
        
        const prod_lactating = navigation.pigFarm.managerPigProd.dataLactatingList;
        const prod_fattening = navigation.pigFarm.managerPigProd.dataFatteningList;    
        
        if (prod_lactating){
            if (prod_lactating.length > 0){
                prod_list = prod_list.concat(prod_lactating);
            }
        }
        
        if (prod_fattening){
            if (prod_fattening.length > 0){
                prod_list = prod_list.concat(prod_fattening);
            }
        }
        
        const elem_select = elemUiCurrentProduction.getElemSelect();
        
        elemUiCurrentProduction.setEntryCount(prod_list);
        thisObj.commonSelectOptions.setDataPigProdList(prod_list, elem_select); 
        
        
    }
    
    
    this.populateForm = function(data_acc_pig_ops){
        elemUiName.setValue(data_acc_pig_ops.acc_pig_ops.name);
        elemUiNotes.setValue(data_acc_pig_ops.acc_pig_ops.desc);
        
        elemDayNumber.value = data_acc_pig_ops.acc_pig_ops.num_days_since;
        
        if (data_acc_pig_ops.acc_pig_ops.is_medvac && data_acc_pig_ops.acc_pig_ops.is_medvac > 0) {
            elemUiIsMedVac.getElemCheckBox().checked = true;
        }
        else{
            elemUiIsMedVac.getElemCheckBox().checked = false;
        }
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
     
        
        if (ev.checkValidity()) {
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        
        
        let input_date_dead         = elemUiDateDead.getValue();
        let input_prod_hid          = elemUiCurrentProduction.getValue();
        let input_num_dead          = componentNumDead.getValue();
        let input_dead_type_hid     = componentDeadType.getValue();
        let input_notes             = elemUiNotes.getValue().trim();
        
        
        
        input_elem          = elemUiDateDead.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_dead       = new Date(input_date_dead);
        if (isNaN(dt_dead.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_dead_s   = dt_dead.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        // Validate pig_prod
        input_elem          = elemUiCurrentProduction.getElemSelect;
        if (input_prod_hid == '0' || input_prod_hid == '-1'){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        // Validate number counts
        let number_dead = 0;
        
        input_elem          = componentNumDead.getElemText();
        
        try{
            number_dead = parseInt(input_num_dead)
        }catch (error){
            componentNumDead.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        // Validate pig_prod
        input_elem          = componentDeadType.getElemSelect;
        if (input_dead_type_hid == '0' || input_dead_type_hid == '-1'){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_hid':     input_prod_hid,
            'pig_dead_type_hid':input_dead_type_hid,
            
            'date_dead':        dt_dead_s,
            'num_pigs_dead':    input_num_dead
        };
        
        if (input_notes.length > 0){
            post_data.notes = input_notes;
        }
        
        
        
        
        if (showOptions.is_add == true){}
        else {
            
        }

        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/prod_pig_dead/add`;
        }
        else{
            url = `${base_url}/prod_pig_dead/update`;
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
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const go_back_page_id = PAGE_ID.PIG_DEAD_LIST;
                    const go_back_page = navigation.getPageContainer(go_back_page_id);
                    
                    navigation.managerNavHistory.removeFromNavHistoryHead(
                        go_back_page);
                    
                    navigation.showThisPage(go_back_page);
                    navigation.pagePigDeadList.show();
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
