// February 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        HARVEST_TYPE}               from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../utils.js';


import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';

import {getSowBoarReference}        from '../../common/common_app.js';




export function PageAllFeedBalanceAddEdit(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              parentObj,
        elemDivContainer:       null,
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    let dataFeedBalance         = null;
    
    
    this.farmPage               = new PageViewPigFarmPage();
    
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        const html = this.getHtml();
        elemDivContainer.innerHTML = html;
    }
    
    
    this.getHtml = function(){
        
        
        elemUiDateBalance        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-mating`,
        
            textLabel:          'Date Mating or Insemination',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_date_birth   = elemUiDateBirth.getHtml();
        
        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 class="tab-title">
        Feed Balance
    </h2>
    
    ${html_date_birth}
    
    <div class="feed-input-mobile-card">
        <div class="toggle-area">
            <button class="toggle-btn" id="toggleBtn">SLIDE TABLES</button>
        </div>
    
        <div class="slider-frame">
            <div class="slider-wrapper" id="sliderWrapper">
                <!-- FIRST DIV (5 columns) : PID Gesta Lacta Booster Prestart -->
                <div class="slide-panel">
                    <table class="data-table" id="tableOne" style="border-collapse: separate; border-spacing: 0;">
                        <colgroup>
                            <col style="width:20%">
                            <col style="width:20%">
                            <col style="width:20%">
                            <col style="width:20%">
                            <col style="width:20%">
                        </colgroup>
                        <thead>
                            <tr><th>PID</th><th>Gesta</th><th>Lacta</th><th>Booster</th><th>Prestart</th></tr>
                        </thead>
                        <tbody id="tbodyOne"></tbody>
                    </table>
                </div>
                <!-- SECOND DIV (4 columns) : PID Starter Grower Finisher -->
                <div class="slide-panel">
                    <table class="data-table second-table" id="tableTwo">
                        <colgroup>
                            <col style="width:25%">
                            <col style="width:25%">
                            <col style="width:25%">
                            <col style="width:25%">
                        </colgroup>
                        <thead>
                            <tr><th>PID</th><th>Starter</th><th>Grower</th><th>Finisher</th></tr>
                        </thead>
                        <tbody id="tbodyTwo"></tbody>
                    </table>
                </div>
            </div>
        </div>
        
    </div>


    <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
    
    <!-- Footer Buttons -->
    <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
            <i class="fas fa-save me-2"></i>Save Changes
        </button>
    </div>
</div>
        `;
        
        return html
    }

    
    this.afterHtmlRender = function(){
        elemUiDateBirth.afterHtmlRender();
        
      
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
 
        
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
         elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    
    this.beforeShow = function(options){
        showOptions = options;
        
        let dataFeedBalance   = [];
        
        let data_prod_list  = navigation.managerPigProd.dataPigProdList;
        
        if (showOptions.is_add){
            if (data_prod_list){
                for (const cur_entry of data_prod_list){
                    const cur_feed_bal = {
                        pig_prod:   cur_entry,
                        input: {
                            gesta:      null,
                            lacta:      null,
                            booster:    null,
                            prestarter: null,
                            starter:    null,
                            grower:     null,
                            finisher:   null
                        }                        
                    };
                    
                    dataFeedBalance.push(cur_feed_bal);
                } 
            }
        
            //  remainder for farm
            const cur_feed_bal = {
                pig_farm_hid:   navigation.pigFarm.getPigFarmHid(),
                input: {
                    gesta:      null,
                    lacta:      null,
                    booster:    null,
                    prestarter: null,
                    starter:    null,
                    grower:     null,
                    finisher:   null
                }                        
            };
            
            dataFeedBalance.push(cur_feed_bal);
            
        }
    
    }

} 
