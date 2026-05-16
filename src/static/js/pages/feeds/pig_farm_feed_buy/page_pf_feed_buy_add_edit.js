// page_pf_feed_buy_add_edit.js

// February 3, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        SUPPLIER_TYPE}              from '../../../constants.js';


import {ComponentBreadCrumbs}       from '../../common/ui/comp_breadcrumb.js';

import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';


import {ComponentSupplierSelect}    from '../../supplier/comp_supplier_select.js'

import {TableFeedBuyItems}          from './table_feed_buy_items.js'

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';



export function PagePfFeedBuyAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
      
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Feed Buy List',
                'gotoPageId':   PAGE_ID.FARM_FEED_BUY_LIST,
                'callbackOnClick': null     // update later
            }
        ]
        
    };
    let componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    let elemIdInfoBox           = null;
    
    let elemUiDateBuy           = null;
    
    let componentSupplier       = null;
    
    let elemIdFeedCost          = null;
    
    let elemIdOtherCostShow     = null;
    let elemIdOtherCost         = null;
    
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    let elemIdFeedItems         = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    let elemInfoBox             = null;
    
    let elemDateBuy             = null;
    
    let elemFeedCost            = null;
    
    let elemOtherCost           = null;
    let elemOtherCostShow       = null;
    
  
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    let elemFeedItems           = null;
    
    
    
    

    
    let curDataPigFarmFeedBuy   = null;
    
    
    let showOptions             = null;
    
    
    this.tableFeedItems         = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdInfoBox           = `${settings.uniqueKey}-info-box`;
        
        
        elemUiDateBuy           = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-buy`,
        
            textLabel:          'Date Feed Buy',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        componentSupplier       = new ComponentSupplierSelect({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-feed-supplier`,
            
            supplierType:       SUPPLIER_TYPE.FEED,
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Feeds Supplier',
            helpText:           null
        });
        
        
     
        
        elemIdFeedCost          = `${settings.uniqueKey}-feed-cost`;
        
        elemIdOtherCostShow     = `${settings.uniqueKey}-other-cost-show`;
        elemIdOtherCost         = `${settings.uniqueKey}-other-cost`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        elemIdFeedItems         = `${settings.uniqueKey}-feed-items`;
        
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_date_buy     = elemUiDateBuy.getHtml();
        
        const html_supplier     = componentSupplier.getHtml();
        
        
        const html =`

        
<div class="form-container">
    ${html_breadcrumb}

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Farm Feed Buy</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <div class="warning-box" id="${elemIdInfoBox}">
            Create first a <b>Feed Buy</b> entry then add <b>Feed Items</b>
            after saving Feed Buy.
        </div>
    
    
        
        <!-- Date Buy -->
        ${html_date_buy}
        
        <!-- Supplier Select -->
        ${html_supplier}
            
        <!-- Feed Cost -->
        <div class="form-group-number">
            <label for="${elemIdFeedCost}" class="form-label" style="margin-bottom:0;">Feed Cost</label>
            <span class="read-only-field" id="${elemIdFeedCost}">0.0</span>
        </div>
        
        
        <!-- Other Cost -->
        <div class="form-group-number" id="${elemIdOtherCostShow}">
            <label for="${elemIdOtherCost}" class="form-label">
                Other Cost
            </label>
                
            <input type="number" class="form-control" id="${elemIdOtherCost}" placeholder="0.0" step="0.1" min="0">
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
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
        
        
        
        <div id="${elemIdFeedItems}" style="margin-top:5px;"> </div>
        
    </div>
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentBreadcrumb.afterHtmlRender();
        
        elemUiDateBuy.afterHtmlRender();
        
        componentSupplier.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
        
        
        thisObj.tableFeedItems = new TableFeedBuyItems({
            navigation:             navigation,
            parentObj:              thisObj,
            uniqueKey:              'feed-buy-items',
            elemDivContainer:       elemFeedItems
        });
        
        thisObj.tableFeedItems.init();
        
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        elemInfoBox             = elemDivContainer.querySelector('#'+elemIdInfoBox);
        
        elemFeedCost            = elemDivContainer.querySelector('#'+elemIdFeedCost);
        
        elemOtherCostShow       = elemDivContainer.querySelector('#'+elemIdOtherCostShow);
        elemOtherCost           = elemDivContainer.querySelector('#'+elemIdOtherCost);
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
            
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
        
        elemFeedItems           = elemDivContainer.querySelector('#'+elemIdFeedItems);;
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
      
        
        // Update Close and cancel button on click
       
        /* This is updated dynamically; not fixed;     
        elemBtnClose.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavFeedsExpenses();
        });
        
        
        elemBtnCancel.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavFeedsExpenses();
        });
        */
        
        settingsBreadcrumb.items[0].callbackOnClick = function(){
            navigation.managerNavLinks.onClickNavFeedsExpenses();
        }
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
      
        
        elemUiDateBuy.reset();
        
        
        // This is needed as there is a switch in inputs
        
        componentSupplier.reset();
        
        
        elemFeedCost.textContent = '0.0';
        
        
        
        elemOtherCost.value = '';
        elemOtherCost.classList.remove('is-valid', 'is-invalid');
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(options, data_farm_feed_buy){
        thisObj._resetForm();
        
        /*
        Typical options
        options ={
            is_add:                 true,   // false is edit
            go_back_page:           go_back_page
        }
            
        
        */
        showOptions = options;
        
        
        // Populate componentSupplier
        componentSupplier.beforeShow();
        
        if (showOptions.is_add){
            curDataPigFarmFeedBuy = null;
            
            // Set title 
            const html = `<i class="fas fa-plus me-2"></i>Add Farm Feed Buy`;
            elemHeaderTitle.innerHTML = html;
            
            // Set info box
            elemInfoBox.style.display = 'block';
            
            // Set Feed Items
            const data_list = [];
            thisObj.tableFeedItems.setDataEntryList(data_list);
            thisObj.tableFeedItems.renderTable(data_list);
            
            thisObj.tableFeedItems.addTextLinkHide();
        }
        else{
            // Set title
            curDataPigFarmFeedBuy = data_farm_feed_buy;
            
            const html = `<i class="fas fa-plus me-2"></i>Edit Farm Feed Buy`;
            elemHeaderTitle.innerHTML = html;

            
            // Set info box
            elemInfoBox.style.display = 'none';

            // Set Feed Items
            thisObj.tableFeedItems.addTextLinkShow();
            
            thisObj.populateForm();
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.managerNavLinks.onClickNavFeedsExpenses();
        };
        
        elemBtnCancel.onclick = function() {
            navigation.managerNavLinks.onClickNavFeedsExpenses();
        };
        
    }
    
    
    this.populateForm = function(){
        elemUiDateBuy.setDate(curDataPigFarmFeedBuy.pf_feed_buy.date_buy);
        
        // Necessary to display fully first the container
        setTimeout(function(){
            componentSupplier.setValue(curDataPigFarmFeedBuy.feed_supplier.hid);
        }, 100);
        
        
        const data_list = curDataPigFarmFeedBuy.feed_items;
        thisObj.tableFeedItems.setDataEntryList(data_list);
        thisObj.tableFeedItems.renderTable(data_list);
        
        
        thisObj.recalculateFeedItemsTotal();
    
        // Set other Cost
        const other_cost = curDataPigFarmFeedBuy.pf_feed_buy.other_cost;
        if (other_cost && other_cost > 0){
            
            const s_other_cost = thisObj.moneyFormatter.format(other_cost);
            elemOtherCost.value = s_other_cost;
        }
        
    }
    
    
    this.recalculateFeedItemsTotal = function(){
        const data_list = curDataPigFarmFeedBuy.feed_items;
        
        let total_cost = 0;
        
        for(const cur_entry of data_list){
            total_cost += cur_entry.feed_item.total_cost;
        } 
        
        const s_total_cost = thisObj.moneyFormatter.format(total_cost);
        elemFeedCost.textContent = s_total_cost;
    }
    
    
    this.getPigFarmFeedBuyEntry = function(entry_hid){
        const feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
        
        if (feed_buy_list == null){return null;}
        
        for (const cur_entry of feed_buy_list){
            if (cur_entry.pf_feed_buy.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
        
    
    
    this.getDataPigFarmFeedBuy = function(){
        return curDataPigFarmFeedBuy;
    }    
  
        
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        

        let input_date_feed_buy     = elemUiDateBuy.getValue();
        let input_supplier_hid      = componentSupplier.getValue();
        let input_other_cost        = elemOtherCost.value.replace(',', '');
        
        
        input_elem          = elemUiDateBuy.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_feed_buy     = new Date(input_date_feed_buy);
        if (isNaN(dt_feed_buy.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_feed_buy_s   = dt_feed_buy.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        input_elem = componentSupplier.getElemSelect();
        
        if (input_supplier_hid == 0 || input_supplier_hid == -1){
            validation          = -1
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        let other_cost   = null;
        try{
            other_cost = parseFloat(input_other_cost);
        } catch(error) {}
        
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        const pig_farm_hid  = navigation.pigFarm.getPigFarmHid();
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_farm_hid':     pig_farm_hid,
            'feed_supplier_hid': input_supplier_hid,
            'date_buy':         dt_feed_buy_s
        };
        
        if (other_cost && other_cost > 0){
            post_data.other_cost = other_cost;
        }
        
        
        
        if (showOptions.is_add == true){}
        else{
            delete post_data.pig_farm_hid;
            post_data.pf_feed_buy_hid = curDataPigFarmFeedBuy.pf_feed_buy.hid;
        }

        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/pf_feed_buy/add`;
        }
        else{
            url = `${base_url}/pf_feed_buy/update`;
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
                    if (showOptions.is_add == true){
                        const pf_feed_buy_hid = response.pf_feed_buy.hid;
                        
                        
                        // Request all pigfarm feed buy List
                        const callback_success = function(){
                            thisObj.tableFeedItems.addTextLinkShow();
                            curDataPigFarmFeedBuy = thisObj.getPigFarmFeedBuyEntry(
                                pf_feed_buy_hid);
                                
                            elemInfoBox.style.display = 'none';
                        };
                        
                        navigation.pigFarm.requestDataPigFarmFeedBuyList(
                            callback_success, elemServerErrorMsg);
                    }
                    
                    else{
                        const callback_success = function(){
                            navigation.managerNavLinks.onClickNavFeedsExpenses();
                        };
                        
                        navigation.pigFarm.requestDataPigFarmFeedBuyList(
                            callback_success, elemServerErrorMsg);
                    }
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
