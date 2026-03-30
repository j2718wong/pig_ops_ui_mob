// March 30, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        REPORT_TYPE}            from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}               from '../../utils.js';



import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';


import {addValidationClassToElem} from '../common/ui/ui_utils.js';



export function PageSummaryReportAdd(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageSummaryReportAdd';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
      
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    let elemIdPageTitle         = null;
    let elemIdBtnClose          = null;
    
    let elemIdPageInfo          = null;
    let elemIdPigFarm           = null;
    let elemIdDateReport        = null;
    
    
    let elemUiNotes             = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemPageTitle           = null;
    let elemBtnClose            = null;
    
    let elemPageInfo            = null;
    let elemPigFarm             = null;
    let elemDateReport          = null;
    
    
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        let label_page_title    = 'Add Summary Report';
        
        let label_add_info      = `This will create the latest Pig Farm Summary Report. This
                report will be visible for all users connected to your farm.`;
        
        let label_save          = 'Generate';
        let label_cancel        = 'Cancel';
        
        let label_notes         = 'Notes';
        
        let label_pig_farm_name = 'Pig Farm';
        let label_date_report   = 'Report Date';
        
        
        const helper = navigation.managerTranslations.translationHelper;

        
        // Common labels
        label_save              = helper.getSimpleTranslation('common.labels.save') || label_save;
        label_cancel            = helper.getSimpleTranslation('common.labels.cancel') || label_cancel;
        
        label_notes             = helper.getSimpleTranslation('common_app.labels.notes') || label_notes;
        

        label_page_title        = helper.getSimpleTranslation('page_summary_report.labels.add_summary_report') || label_page_title
        label_add_info          = helper.getSimpleTranslation('page_summary_report.labels.add_info') || label_add_info;
        label_pig_farm_name     = helper.getSimpleTranslation('page_summary_report.labels.pig_farm_name') || label_pig_farm_name;
        label_date_report       = helper.getSimpleTranslation('page_summary_report.labels.date_report') || label_date_report;
        

        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        elemIdPigFarm           = `${settings.uniqueKey}-pig-farm`;
        elemIdDateReport        = `${settings.uniqueKey}-date-report`;
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          label_notes,
            isRequired:         false,
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        

        
           
           
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        
        const html_notes        = elemUiNotes.getHtml();
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title" id="">
            <i class="fas fa-plus me-2"></i><span id= "${elemIdPageTitle}">${label_page_title}</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <div class="mobile-info-box" style="margin-bottom:10px;">
            <div class="info-text" id="${elemIdPageInfo}">
                ${label_add_info}
            </div>
        </div>
        
        <div class="form-group-text">
            <label class="form-label">${label_pig_farm_name}</label>
            <span class="" id="${elemIdPigFarm}"></span>
        </div>
        
        
        <div class="form-group-text">
            <label class="form-label">${label_date_report}</label>
            <span class="" id="${elemIdDateReport}"></span>
        </div>
    
        
        
        ${html_notes}
        
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" data-bs-dismiss="modal" style="margin-right:10px;">
                <i class="fas fa-times me-2"></i>${label_cancel}
            </button>
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>${label_save}
            </button>
        </div>
    </div>
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        
        elemUiNotes.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageTitle           = elemDivContainer.querySelector('#'+elemIdPageTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        elemPigFarm             = elemDivContainer.querySelector('#'+elemIdPigFarm);
        elemDateReport          = elemDivContainer.querySelector('#'+elemIdDateReport);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
            
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
              
        elemBtnClose.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavSummaryReports();
        });
        
        
        elemBtnCancel.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavSummaryReports();
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        
        elemUiNotes.reset();
        
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }    
    
    
    this.show = function(){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        thisObj._resetForm();
        
        let dtCurrentDate           = null;
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        
        // Set Current report date to today
        const s_dt_current = formatDate(dtCurrentDate);
        elemDateReport.textContent = s_dt_current;
        
        
        // Set Pig Farm Name
        const pig_farm = navigation.pigFarm.dataPigFarm;
        
        elemPigFarm.textContent = pig_farm.pig_farm.name;
        
        
        
    }
    
        
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        


    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        

        let input_notes     = elemUiNotes.getValue();
        

        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        const pig_farm_hid  = navigation.pigFarm.getPigFarmHid;
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            
            'pig_farm_hid':     pig_farm_hid,
            'report_type_id':   REPORT_TYPE.PIG_FARM_SUMMARY,
            
            'notes':            input_notes,
            
            'report_date':       dt_mating_s
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
            url: `${base_url}/report/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const go_back_page_id = PAGE_ID.BOAR_EXT_MATE_LIST;
                    const go_back_page = navigation.getPageContainer(go_back_page_id);
                    
                    navigation.managerNavHistory.removeFromNavHistoryHead(
                        go_back_page);
                    
                    navigation.showThisPage(go_back_page);
                    navigation.managerNavLinks.onClickNavSummaryReports();
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
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
