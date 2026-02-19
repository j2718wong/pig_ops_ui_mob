// February 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageWithMultiBreadCrumbs}   from '../../multikey/page_with_multi_breadcrumbs.js';


import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {ComponentPlusMinusInput}    from '../../common/ui/comp_plus_minus_input.js';
import {ComponentWeightPerPig}      from './comp_weight_per_pig.js';


import {PageTableBasic}             from '../../common/page_table_basic.js';




import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS}            from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../utils.js';


import {CommonSelectOptions}    from '../../common/common_select_options.js';

import {ComponentHarvestType}   from './comp_harvest_type.js';

import {ComponentAccPigBuyer}   from './comp_acc_pig_buyer.js';   




export function PageProdHarvestAddEdit(input_settings){
    PageWithMultiBreadCrumbs.call(this, input_settings);
    
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContMedVacAddEdit,
        uniqueKey:              'add-add-edit'
    };
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
        
  
    

    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
     
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;

   
    
    
    let elemUiDateHarvest       = null;
    let componentHarvestType    = null;
    let componentNumPigs        = null;
    
    
    let elemIdLWShow            = null;   
    
    let elemIdLWPanelHeader     = null;
    let elemIdLWHeaderWeight    = null;
    let elemIdLWPanelArrowIcon  = null;
    let elemIdLWPanelBody       = null;
    let elemIdLWAverageWeight   = null;
    let elemIdLWPricePerWeight  = null;
    
    let componentLWPerPig       = null;
    
    
    let elemIdSWShow            = null;   
    
    let elemIdSWPanelHeader     = null;
    let elemIdSWHeaderWeight    = null;
    let elemIdSWPanelArrowIcon  = null;
    let elemIdSWPanelBody       = null;
    let elemIdSWAverageWeight   = null;
    let elemIdSWMinusWeight     = null;
    let elemIdSWPricePerWeight  = null;
    
    let componentSWPerPig       = null;
    
    let componentAccPigBuyer    = null;
    
    let elemUiNotes             = null;
    
    let elemIdNetSales          = null;
    let elemIdHarvestCost       = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
        
    let elemInfoShow            = null;
    let elemInfo                = null;

    
    let elemLWShow              = null;   
        
    let elemLWPanelHeader       = null;
    let elemLWHeaderWeight      = null;
    let elemLWPanelArrowIcon    = null;
    let elemLWPanelBody         = null;
    let elemLWAverageWeight     = null;
    let elemLWPricePerWeight    = null;
    
    
    let elemSWShow              = null;   
        
    let elemSWPanelHeader       = null;
    let elemSWHeaderWeight      = null;
    let elemSWPanelArrowIcon    = null;
    let elemSWPanelBody         = null;
    let elemSWAverageWeight     = null;
    let elemSWMinusWeight       = null;
    let elemSWPricePerWeight    = null;
    
    
    let elemNetSales            = null;
    let elemHarvestCost         = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    

    let dataPigProd             = null;
    let showOptions             = null;
    


    
    this.callbackOnSuccessAdd   = null;
    
    
    let dtCurrentDate           = null;
    
    
    let commonSelectOptions     = new CommonSelectOptions();
    
    

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        

        
        elemUiDateHarvest       = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date`,
        
            textLabel:          'Date Harvest',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        componentHarvestType    = new ComponentHarvestType({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-harvest-type`,
        
            labelSelect:        'Harvest Type',
            helpText:           null
        });
        
        
        
        componentNumPigs        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-pigs`,
            
            className:          'form-group-number',
            textLabel:          'Number of Pigs',
            minValue:           1,
            value:              1,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });

        
        componentAccPigBuyer    = new ComponentAccPigBuyer({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-pig-buyer`,

            titleExpandSection: 'Add Pig Buyer',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save Pig Buyer',
            
            labelSelect:        'Select Pig Buyer',
            helpText:           null
        }); 


        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        
        
        elemIdNetSales          = `${settings.uniqueKey}-net-sales`;
        elemIdHarvestCost       = `${settings.uniqueKey}-harvest-cost`;


        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
           
        const html_breadcrumb   = thisObj.getHtmlBreadCrumbs();
        
        const html_date_harvest = elemUiDateHarvest.getHtml();
        
        const html_harvest_type = componentHarvestType.getHtml();
        const html_num_pigs     = componentNumPigs.getHtml();
        
        const html_live_weight  = thisObj.getHtmlLiveWeight();
        const html_slaughter_weight = thisObj.getHtmlSlaughterWeight();
        
        const html_pig_buyer    = componentAccPigBuyer.getHtml();
        const html_notes        = elemUiNotes.getHtml();
        
        
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
        
        
       
        
        <!-- Date Harvest -->
        ${html_date_harvest}
            
        ${html_harvest_type}

        ${html_num_pigs}
    
        ${html_live_weight}
        
        ${html_slaughter_weight}
        
        ${html_pig_buyer}
        
        <div class="form-group-number">
            <label for="${elemIdNetSales}" class="form-label">
                Net Sales
            </label>
            
            <input type="number" class="form-control" id="${elemIdNetSales}" step="0.1" min="0" >
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
        </div>
        
        <div class="form-group-number">
            <label for="${elemIdHarvestCost}" class="form-label">
                Harvest Cost
            </label>
            
            <input type="number" class="form-control" id="${elemIdHarvestCost}" step="0.1" min="0" >
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
        </div>
        
        
        ${html_notes}
        
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
    
    
    this.getHtmlLiveWeight = function(){
        elemIdLWShow            = `${settings.uniqueKey}-lw-show`;
        
        elemIdLWPanelHeader     = `${settings.uniqueKey}-lw-panel-header`;
        elemIdLWHeaderWeight    = `${settings.uniqueKey}-lw-header-weight`;
        elemIdLWPanelArrowIcon  = `${settings.uniqueKey}-lw-panel-arrow`;
        elemIdLWPanelBody       = `${settings.uniqueKey}-lw-panel-body`;
        elemIdLWAverageWeight   = `${settings.uniqueKey}-lw-ave-weight`;
        elemIdLWPricePerWeight  = `${settings.uniqueKey}-lw-price`;
        
        
        componentLWPerPig       = new ComponentWeightPerPig({
            uniqueKey:          `${settings.uniqueKey}-lw-per-pig`,
            elemDivContainer:   elemDivContainer,
        
            
            labelText:          'Weight Per Pig',
            helpText:           ''
            
        });
        
         const html_pp_weight  = componentLWPerPig.getHtml();

        
        const html = `
        <!-- Collapsible Panel -->
        <div class="collapsible-panel mb-4" id="${elemIdLWShow}" style="margin-top:8px; margin-bottom:0 !important; padding:5px; ">
            <!-- Header with arrow icon -->
            <div class="collapsible-header" id="${elemIdLWPanelHeader}">
                <span>Live Weight<span id="${elemIdLWHeaderWeight}"></span></span>
                <i class="bi bi-chevron-down arrow-icon" id="${elemIdLWPanelArrowIcon}"></i>
            </div>
            
            <!-- Body content -->
            <div class="collapsible-body" id="${elemIdLWPanelBody}">

                ${html_pp_weight}
               
                <div class="form-group-number">
                    <label class="form-label" style="margin-bottom:0;">Average Weight, kg</label>
                    <span class="read-only-field" id="${elemIdLWAverageWeight}">&nbsp;</span>
                </div>
                
                <div class="form-group-number">
                    <label for="${elemIdLWPricePerWeight}" class="form-label">
                        Price per kg
                    </label>
                    
                    <input type="number" class="form-control" id="${elemIdLWPricePerWeight}" step="0.1" min="0" >
                    <div class="invalid-feedback">
                        Please enter numeric value.
                    </div>
                </div>
                
                
            </div>
        </div>
        
        `;
        
        return html;
        
    }
    
    
    this.getHtmlSlaughterWeight = function(){
        elemIdSWShow            = `${settings.uniqueKey}-sw-show`;
                                                         
        elemIdSWPanelHeader     = `${settings.uniqueKey}-sw-panel-header`;
        elemIdSWHeaderWeight    = `${settings.uniqueKey}-sw-header-weight`;
        elemIdSWPanelArrowIcon  = `${settings.uniqueKey}-sw-panel-arrow`;
        elemIdSWPanelBody       = `${settings.uniqueKey}-sw-panel-body`;
        elemIdSWAverageWeight   = `${settings.uniqueKey}-sw-ave-weight`;
        elemIdSWMinusWeight     = `${settings.uniqueKey}-sw-minus-weight`;
        elemIdSWPricePerWeight  = `${settings.uniqueKey}-sw-price`;
        
        
        componentSWPerPig       = new ComponentWeightPerPig({
            uniqueKey:          `${settings.uniqueKey}-sw-per-pig`,
            elemDivContainer:   elemDivContainer,
        
            
            labelText:          'Weight Per Pig',
            helpText:           ''
            
        });
        
        const html_pp_weight  = componentSWPerPig.getHtml();

        
        const html = `
        <!-- Collapsible Panel -->
        <div class="collapsible-panel mb-4" id="${elemIdSWShow}" style="margin-top:8px; padding:5px; ">
            <!-- Header with arrow icon -->
            <div class="collapsible-header" id="${elemIdSWPanelHeader}">
                <span>Slaughter Weight<span id="${elemIdSWHeaderWeight}"></span></span>
                <i class="bi bi-chevron-down arrow-icon" id="${elemIdSWPanelArrowIcon}"></i>
            </div>
            
            <!-- Body content -->
            <div class="collapsible-body" id="${elemIdSWPanelBody}">

                ${html_pp_weight}
               
                <div class="form-group-number">
                    <label class="form-label" style="margin-bottom:0;">Average Weight, kg</label>
                    <span class="read-only-field" id="${elemIdSWAverageWeight}">&nbsp;</span>
                </div>
                
                <div class="form-group-number">
                    <label for="${elemIdSWMinusWeight}" class="form-label">
                        Minus Weight, kg
                    </label>
                    
                    <input type="number" class="form-control" id="${elemIdSWMinusWeight}" step="0.1" min="0">
                    <div class="invalid-feedback">
                        Please enter numeric value.
                    </div>
                    <div class="form-text">Sometimes buyers will subtract bone weight.</div>
                </div>
                
                <div class="form-group-number">
                    <label for="${elemIdSWPricePerWeight}" class="form-label">
                        Price per kg
                    </label>
                    
                    <input type="number" class="form-control" id="${elemIdSWPricePerWeight}" step="0.1" min="0" >
                    <div class="invalid-feedback">
                        Please enter numeric value.
                    </div>
                </div>
                
                
            </div>
        </div>
        
        `;
        
        return html;
        
    }
    
    

    this.afterHtmlRender = function(){
        // Do the afterHtmlRender to UI elements first;
        
        thisObj.afterHtmlRenderBreadCrumbComponent();
        
        elemUiDateHarvest.afterHtmlRender();
        componentHarvestType.afterHtmlRender();
        componentNumPigs.afterHtmlRender();
        
        componentLWPerPig.afterHtmlRender();
        componentSWPerPig.afterHtmlRender();
        
        componentAccPigBuyer.afterHtmlRender();
        
        elemUiNotes.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
                                                          
        elemInfoShow            = elemDivContainer.querySelector('#'+elemIdInfoShow);
        elemInfo                = elemDivContainer.querySelector('#'+elemIdInfo);
                                                        
        elemLWShow              = elemDivContainer.querySelector('#'+elemIdLWShow); 
        
        elemLWPanelHeader       = elemLWShow.querySelector('#'+elemIdLWPanelHeader);   
        elemLWHeaderWeight      = elemLWShow.querySelector('#'+elemIdLWHeaderWeight);
        elemLWPanelArrowIcon    = elemLWShow.querySelector('#'+elemIdLWPanelArrowIcon);
        elemLWPanelBody         = elemLWShow.querySelector('#'+elemIdLWPanelBody);     
        elemLWAverageWeight     = elemLWShow.querySelector('#'+elemIdLWAverageWeight);
        elemLWPricePerWeight    = elemLWShow.querySelector('#'+elemIdLWPricePerWeight);
        
        
        elemSWShow              = elemDivContainer.querySelector('#'+elemIdSWShow); 
        
        elemSWPanelHeader       = elemSWShow.querySelector('#'+elemIdSWPanelHeader);   
        elemSWHeaderWeight      = elemSWShow.querySelector('#'+elemIdSWHeaderWeight);
        elemSWPanelArrowIcon    = elemSWShow.querySelector('#'+elemIdSWPanelArrowIcon);
        elemSWPanelBody         = elemSWShow.querySelector('#'+elemIdSWPanelBody);     
        elemSWAverageWeight     = elemSWShow.querySelector('#'+elemIdSWAverageWeight);
        elemSWMinusWeight       = elemSWShow.querySelector('#'+elemIdSWMinusWeight);
        elemSWPricePerWeight    = elemSWShow.querySelector('#'+elemIdSWPricePerWeight);
        
        
        elemNetSales            = elemDivContainer.querySelector('#'+elemIdNetSales);
        elemHarvestCost         = elemDivContainer.querySelector('#'+elemIdHarvestCost);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        componentLWPerPig.callbackOnChangeInputs = thisObj.onChangeLWPerPigInput;
        componentSWPerPig.callbackOnChangeInputs = thisObj.onChangeSWPerPigInput;
    }
    
    
    this._bindEventListeners = function(){
        
        elemLWPanelHeader.addEventListener('click', function() {
            thisObj.togglePanelLW();
        });
        
        elemSWPanelHeader.addEventListener('click', function() {
            thisObj.togglePanelSW();
        });
        
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
        
    }
    
    
    this.togglePanelLW = function(){
        const panelBody     = elemLWPanelBody;
        const panelHeader   = elemLWPanelHeader;
        const arrowIcon     = elemLWPanelArrowIcon;
        
        // Toggle visibility
        panelBody.classList.toggle('collapsed');
        
        // Toggle header border radius
        panelHeader.classList.toggle('collapsed');
        
        // Rotate arrow icon
        arrowIcon.classList.toggle('rotated');
    }
    
    
    this.togglePanelSW = function(){
        const panelBody     = elemSWPanelBody;
        const panelHeader   = elemSWPanelHeader;
        const arrowIcon     = elemSWPanelArrowIcon;
        
        // Toggle visibility
        panelBody.classList.toggle('collapsed');
        
        // Toggle header border radius
        panelHeader.classList.toggle('collapsed');
        
        // Rotate arrow icon
        arrowIcon.classList.toggle('rotated');
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemUiDateHarvest.reset();
        
        componentLWPerPig.reset();
        componentSWPerPig.reset();
        
        componentAccPigBuyer.reset();
        elemUiNotes.reset();
        
        elemLWAverageWeight.innerHTML = '&nbsp;';
        elemSWAverageWeight.innerHTML = '&nbsp;';
        
        elemSWMinusWeight.value = '';
       
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_pig_prod, options){
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        dataPigProd  = data_pig_prod;
        showOptions = options;
        
        thisObj._resetForm();
        
        
        // Update BreadCrumbs
        thisObj.updateBreadCrumbs(null, data_pig_prod);
        
        
        // Set Page Title
        let html;
        if (showOptions.is_add){
            html = `<i class="fas fa-plus me-2"></i>Add Prod Harvest`;
        }
        else{
            html = `<i class="fas fa-edit me-2"></i>Edit Prod Harvest`;
        }
        elemHeaderTitle.innerHTML = html;
                
        
       
        // Show info 
        elemInfoShow.style.display = 'none';
        
        
        componentHarvestType.beforeShow();
        componentAccPigBuyer.beforeShow();
        
        
        // Hide Live Weight Details
        if (!elemLWPanelBody.classList.contains('collapsed')) {
            thisObj.togglePanelLW();
        }
        
        // Hide Slaughter Weight Details
        if (!elemSWPanelBody.classList.contains('collapsed')) {
            thisObj.togglePanelSW();
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
      
    }
    
    
    this.getDataPigFarmFeedBuy = function(entry_hid){
        const feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
        
        for (const cur_entry of feed_buy_list){
            if (cur_entry.pf_feed_buy.hid == entry_hid){
                return cur_entry;
            }
        } 
        
        return null;
    }
    
    
    this.populateForm = function(){
        
        const pig_prod_feed = showOptions.pig_prod_feed;
        const date_add = pig_prod_feed.pig_prod_feed.date_add;

        
        elemUiDateHarvest.setDate(date_add);
    }
    
      
    this.show = function(){
        if (showOptions.is_add == false){
            // Necessary to display fully first the container
            setTimeout(function(){
                thisObj.populateForm(curDataEntry, showOptions.add_hid);
            }, 100);
        }
    }
    
    
    
    this.disableAllInputs = function(){
        elemUiDateHarvest.disableInputs();
      
      
    }
    
    
    this.enableAllInputs = function(){
        elemUiDateHarvest.enableInputs();
       
    }
    
    
    
    this.onChangeLWPerPigInput = function(){
        const pig_weights = componentLWPerPig.getPigWeights();
        
        if (pig_weights.length > 0){
            let total_weight = 0;
            for (const cur_entry of pig_weights){
                total_weight += parseFloat(cur_entry);
            }
            
            const average = total_weight / pig_weights.length;
            
            const s_average = Math.round(average * 10) / 10;
            elemLWAverageWeight.textContent = s_average;
            
            elemLWHeaderWeight.textContent = `  ${total_weight} kg`
            
            componentNumPigs.setValue(pig_weights.length);
            
        }
        else{
            elemLWHeaderWeight.textContent = '';
            componentNumPigs.setValue(1);
        }
        
    }
    
    
    this.onChangeSWPerPigInput = function(){
        const pig_weights = componentSWPerPig.getPigWeights();
        
        if (pig_weights.length > 0){
            let total_weight = 0;
            for (const cur_entry of pig_weights){
                total_weight += parseFloat(cur_entry);
            }
            
            const average = total_weight / pig_weights.length;
            
            const s_average = Math.round(average * 10) / 10;
            elemSWAverageWeight.textContent = s_average;
            
            elemSWHeaderWeight.textContent = `  ${total_weight} kg`
            
            componentNumPigs.setValue(pig_weights.length);
            
        }
        else{
            elemSWHeaderWeight.textContent = '';
            componentNumPigs.setValue(1);
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
                
                case 'date_add': {
             
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
        
        
        
        let input_date_add   = elemUiDateHarvest.getValue().trim();
        
        
        input_elem          = elemUiDateHarvest.getElemText();
        if (input_date_add.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        
        
        // Convert date to YYYY-MM-DD format
        const dt_add     = new Date(input_date_add);
        if (isNaN(dt_add.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
            
        
        const dt_add_s   = dt_add.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        // Check if there are feed inputs
        if (componentFeedsInput.areAllInputsZero()){
            elemServerErrorMsg.innerHTML = '<span>Feed Input should not be all zero.</span>'
            elemServerErrorMsg.style.display = 'block';
            return;
        }
        
        
        const pf_feed_buy_hid = selectedPigFarmFeedBuy.pf_feed_buy.hid;
        
        
 
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            
            'date_add':         dt_add_s,
            'pig_farm_feed_buy_hid':  pf_feed_buy_hid
            
        };
        
        
        const feed_input = componentFeedsInput.getDataFeedInput();
        
        if (feed_input.gesta > 0){
            post_data.num_gesta = feed_input.gesta;
        }
        
        if (feed_input.lacta > 0){
            post_data.num_lacta = feed_input.lacta;
        }
        
        if (feed_input.booster > 0){
            post_data.num_booster = feed_input.booster;
        }
        
        if (feed_input.prestarter > 0){
            post_data.num_prestarter = feed_input.prestarter;
        }
        
        if (feed_input.starter > 0){
            post_data.num_starter = feed_input.starter;
        }
        
        if (feed_input.grower > 0){
            post_data.num_grower = feed_input.grower;
        }
        
        if (feed_input.finisher > 0){
            post_data.num_finisher = feed_input.finisher;
        }
        
         
        
        if (showOptions.is_add == true){
            post_data.pig_prod_hid = dataPigProd.pig_production.hid;
        }
        
        else {
            delete post_data.pig_farm_feed_buy_hid;
            
            const pig_prod_feed_hid = showOptions.pig_prod_feed.pig_prod_feed.hid;
            post_data.pig_prod_feed_hid = pig_prod_feed_hid;
        }
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/pig_prod_feed/add`;
        }
        else{
            url = `${base_url}/pig_prod_feed/update`;
        }
        

        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (showOptions.is_add == true){
                        navigation.showThisPage(showOptions.go_back_page);
                        
                        if (showOptions.callback_after_add){
                            console.log('\n\npage_add_Add has callback_after_add');
                            showOptions.callback_after_add();
                        }
                        else{
                            console.log('\n\npage_add_Add has no callback_after_add');
                        }
                    }
                    
                    else{
                        navigation.showThisPage(showOptions.go_back_page);
                        
                        if (showOptions.callback_after_edit){
                            showOptions.callback_after_edit();
                        }
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
