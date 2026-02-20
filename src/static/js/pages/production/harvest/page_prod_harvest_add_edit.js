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
        
        
        elemSWMinusWeight.addEventListener('blur', function() {
            thisObj.onChangeSWMinusWeight();
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
        
        elemNetSales.value      = '';
        
        elemHarvestCost.value = '';
        
        elemUiNotes.setValue('');
        
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
        
        
        if (showOptions.is_add){}
        else{
            thisObj.populateForm();
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
        const prod_harvest = showOptions.prod_harvest.prod_harvest;
        
        const date_harvest = prod_harvest.date_harvest;

        elemUiDateHarvest.setDate(date_harvest);
        
        componentNumPigs.setValue(prod_harvest.num_pigs);
        
        setTimeout(function(){
            componentHarvestType.setValue(prod_harvest.harvest_type_hid);
        }, 200);
        
        
        if (prod_harvest.sales){   
            if (prod_harvest.sales.net_sales){
                elemNetSales.value = prod_harvest.sales.net_sales;
            }
        
            if (prod_harvest.sales.harvest_cost){
                elemHarvestCost.value = prod_harvest.sales.harvest_cost;
            }
        } 
        
        if (prod_harvest.notes) {
            elemUiNotes.setValue(prod_harvest.notes);
        }

        
        if (prod_harvest.slaughter_weight && prod_harvest.slaughter_weight.minus){
            elemSWMinusWeight.value = prod_harvest.slaughter_weight.minus;
        }


        if (prod_harvest.live_weight && prod_harvest.live_weight.pp_csv){
            componentLWPerPig.setPigWeights(prod_harvest.live_weight.pp_csv);
        }
        
        if (prod_harvest.slaughter_weight && prod_harvest.slaughter_weight.pp_csv){
            componentSWPerPig.setPigWeights(prod_harvest.slaughter_weight.pp_csv);
        }

        if (prod_harvest.pig_buyer && prod_harvest.pig_buyer.hid){
            setTimeout(function(){
                componentAccPigBuyer.setValue(prod_harvest.pig_buyer.hid);
            }, 200);
        }
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
            
            
            // Subtract elemSWMinusWeight if there is any
            const input_minus_weight = elemSWMinusWeight.value.trim();
              
            if (input_minus_weight.length > 0){
                try {
                    const minus_weight = parseFloat(input_minus_weight);
                    total_weight = total_weight - minus_weight;
                }
                catch(error){} 
            }
            
            elemSWHeaderWeight.textContent = `  ${total_weight} kg`
            
            componentNumPigs.setValue(pig_weights.length);
            
        }
        else{
            elemSWHeaderWeight.textContent = '';
            componentNumPigs.setValue(1);
        }
        
    }
    
    
    this.onChangeSWMinusWeight = function(){
        thisObj.onChangeSWPerPigInput();
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
                
                case 'date_harvest': {
             
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
        
        
        
        let input_date_harvest  = elemUiDateHarvest.getValue().trim();
        let input_harvest_type  = componentHarvestType.getValue();
        let input_num_pigs      = componentNumPigs.getValue();
        let input_acc_pig_buyer = componentAccPigBuyer.getValue();
        let input_comments      = elemUiNotes.getValue();
        
        
        input_elem          = elemUiDateHarvest.getElemText();
        if (input_date_harvest.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        

        // Convert date to YYYY-MM-DD format
        const dt_harvest     = new Date(input_date_harvest);
        if (isNaN(dt_harvest.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
            
        
        const dt_harvest_s   = dt_harvest.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem          = componentHarvestType.getElemSelect();
        if (input_harvest_type == '0' || input_harvest_type == '-1'){
            validation          = 0;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        let num_pigs = 0;
        try{
            num_pigs= parseInt(input_num_pigs)
        } catch(error){
        }
        
        
        
        const weight_per_pig_live = componentLWPerPig.getPigWeights();
        const weight_per_pig_slau = componentSWPerPig.getPigWeights();
           
        let s_weight_pp_lw    = null;
        let s_weight_pp_sw    = null;
        
           
        let live_weight = 0;
        if (weight_per_pig_live != null){
            for (const cur_entry of weight_per_pig_live){
                live_weight += cur_entry;
            }
        }
        
        if (live_weight == 0){
            live_weight = null;
        }
        else{
            s_weight_pp_lw = weight_per_pig_live.join(',');
        }
        
        
        let slaughter_weight = 0;
        if (weight_per_pig_slau != null){
            for (const cur_entry of weight_per_pig_slau){
                slaughter_weight += cur_entry;
            }
        }
        
        if (slaughter_weight == 0){
            slaughter_weight = null;
        }
        else{
            s_weight_pp_sw = weight_per_pig_slau.join(',');
        }
        
        
           
        
        let live_price  = null;
        const input_lw_price      = elemLWPricePerWeight.value.trim();
        
        input_elem          = elemLWPricePerWeight;
        if (input_lw_price.length > 0){
            try{
                live_price = parseFloat(input_lw_price)
            }
            catch(error){
                validation          = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
        }
        
        
        let slaughter_price  = null;
        const input_sw_price      = elemSWPricePerWeight.value.trim();
        
        input_elem          = elemSWPricePerWeight;
        if (input_sw_price.length > 0){
            try{
                slaughter_price = parseFloat(input_sw_price)
            }
            catch(error){
                validation          = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
        }
        
        
        let sw_minus_weight  = null;
        const input_sw_minus_weight      = elemSWMinusWeight.value.trim();
        
        input_elem          = elemSWMinusWeight;
        if (input_sw_minus_weight.length > 0){
            try{
                sw_minus_weight = parseFloat(input_sw_minus_weight)
            }
            catch(error){
                validation          = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
        }
        
        
        let acc_pig_buyer_hid = null;
        if (input_acc_pig_buyer == '0' || input_acc_pig_buyer == '-1'){}
        else{acc_pig_buyer_hid = input_acc_pig_buyer;}
        
        
        let net_sales = null;
        const input_net_sales           = elemNetSales.value.trim();
        
        input_elem          = elemNetSales;
        if (input_net_sales.length > 0){
            try{
                net_sales = parseFloat(input_net_sales)
            }
            catch(error){
                validation          = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
        }
        
        
        
        let harvest_cost = null;
        const input_harvest_cost           = elemHarvestCost.value.trim();
        
        input_elem          = elemHarvestCost;
        if (input_harvest_cost.length > 0){
            try{
                harvest_cost = parseFloat(input_harvest_cost)
            }
            catch(error){
                validation          = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
        }
        
        
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':                 user_hid,
            
            'date_harvest':         dt_harvest_s,
            'acc_pig_buyer_hid':    acc_pig_buyer_hid,
            
            'num_pigs':             num_pigs,
            'harvest_type_hid':     input_harvest_type,
            
            'live_weight':          live_weight,
            'live_price':           live_price,
            
            'slaughter_weight':     slaughter_weight,
            'slaughter_minus_weight': sw_minus_weight,
            'slaughter_price':      slaughter_price, 
            
            'net_sales':            net_sales,
            'harvest_cost':         harvest_cost,
            'comments':             input_comments,
            
            'weight_pp_lw_csv':     s_weight_pp_lw,
            'weight_pp_sw_csv':     s_weight_pp_sw
            
        };
        
        // remove null fields
        if (acc_pig_buyer_hid == null){
            delete post_data.acc_pig_buyer_hid;
        }
        
        if (live_weight == null){
            delete post_data.live_weight;
        }
        
        if (live_price == null){
            delete post_data.live_price;
        }
        
        if (slaughter_weight == null){
            delete post_data.slaughter_weight;
        }
        
        if (sw_minus_weight == null){
            delete post_data.slaughter_minus_weight;
        }
        
        if (slaughter_price == null){
            delete post_data.slaughter_price;
        }
        
        if (net_sales == null){
            delete post_data.net_sales;
        }
        
        
        if (harvest_cost == null){
            delete post_data.harvest_cost;
        }
        
        if (input_comments == null){
            delete post_data.comments;
        }
        
        if (s_weight_pp_lw == null){
            delete post_data.weight_pp_lw_csv;
        }
        
        
        if (s_weight_pp_sw == null){
            delete post_data.weight_pp_sw_csv;
        }
        
        
        
        
        if (showOptions.is_add == true){
            post_data.pig_prod_hid = dataPigProd.pig_production.hid;
        }
        
        else {  
            const prod_harvest_hid = showOptions.prod_harvest.prod_harvest.hid;
            post_data.prod_harvest_hid = prod_harvest_hid;
        }
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/prod_harvest/add`;
        }
        else{
            url = `${base_url}/prod_harvest/update`;
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
                /** The prod_harvest add or update entry can cause to update
                 * pig_production.pig_prod_status_id into PROD_STATUS.HARVESTED.
                 * If pig_prod_status_id is PROD_STATUS.HARVESTED, 
                 * production entry should remove production list 
                 * and should go back to production list page and not to 
                 * production entry page.
                 * */
                
                
                if (response.result.num == 0){
                    if (response.prod_harvest.prod_status_id == PROD_STATUS.HARVESTED){
                        // Remove production entry from list
                        const pig_prod_hid = dataPigProd.pig_production.hid;
                        const prod_list = navigation.pigFarm.managerPigProd.dataFatteningList;
            
                        navigation.pigFarm.managerPigProd.removeFromProdList(
                                pig_prod_hid, prod_list);
                                    
                        // Goto Fattening List Page
                        navigation._onClickNavProdFattening();
                    }
                    
                    else{
                        if (showOptions.is_add == true){
                            navigation.showThisPage(showOptions.go_back_page);
                            
                            if (showOptions.callback_after_add){
                                showOptions.callback_after_add();
                            }
                        }
                        
                        else{
                            navigation.showThisPage(showOptions.go_back_page);
                            
                            if (showOptions.callback_after_edit){
                                showOptions.callback_after_edit();
                            }
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
