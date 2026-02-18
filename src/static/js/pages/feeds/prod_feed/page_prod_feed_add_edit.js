// February 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageWithMultiBreadCrumbs}   from '../../multikey/page_with_multi_breadcrumbs.js';


import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';

import {PageTableBasic}             from '../../common/page_table_basic.js';


import {ComponentFeedsInput}        from '../../common/ui/comp_feeds_input.js';




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



export function PageProdFeedAddEdit(input_settings){
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
        
        
    const MAX_DAYS_TRIGGER_NO_FEED_BUY = 20;
    const MAX_OLDER_ENTRIES     = 5;
    

    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
     
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;

    let elemIdFeedBuyFrom       = null;
    let elemIdFeedBuyNone       = null;
    let elemIdFeedBuyControl    = null;
    let elemIdLinkAddFeedBuy    = null;
    let elemIdLinkOlderFeedBuy  = null;
    let elemIdSelectOlderFeedBuy= null;
    
    let elemIdTableFeedBuy      = null;
    let elemIdTableBodyFeedBuy  = null;
    
    let elemIdFeedInputShow     = null;
    
    
    let elemUiDateAdd           = null;

    let componentFeedsInput     = null;
    
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
        
    let elemInfoShow            = null;
    let elemInfo                = null;

    let elemFeedBuyFrom         = null;
    let elemFeedBuyNone         = null;
    let elemFeedBuyControl      = null;
    let elemLinkAddFeedBuy      = null;
    let elemLinkOlderFeedBuy    = null;
    let elemSelectOlderFeedBuy  = null;
    
    let elemTableFeedBuy        = null;
    let elemTableBodyFeedBuy    = null;
    
    let elemFeedInputShow       = null;
    
   
   
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    

    let dataPigProd             = null;
    let showOptions             = null;
    
    let selectedPigFarmFeedBuy  = null;

    
    this.callbackOnSuccessAdd   = null;
    
    
    let dtCurrentDate           = null;
    
    
    let commonSelectOptions     = new CommonSelectOptions();
    
    
    let tableFeedBuy            = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        
        
        elemIdFeedBuyFrom       = `${settings.uniqueKey}-feed-buy-from`;
        elemIdFeedBuyNone       = `${settings.uniqueKey}-feed-buy-none`;
        elemIdFeedBuyControl    = `${settings.uniqueKey}-feed-control`;
        elemIdLinkAddFeedBuy    = `${settings.uniqueKey}-feed-buy-add`;
        elemIdLinkOlderFeedBuy  = `${settings.uniqueKey}-feed-buy-old-show`;
        elemIdSelectOlderFeedBuy= `${settings.uniqueKey}-feed-buy-old-select`;
        
        elemIdTableFeedBuy      = `${settings.uniqueKey}-feed-buy`;
        elemIdTableBodyFeedBuy  = `${settings.uniqueKey}-feed-buy-tbody`;
        
        elemIdFeedInputShow     = `${settings.uniqueKey}-feed-add-input`;
        
        
        elemUiDateAdd           = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date`,
        
            textLabel:          'Date Add Feeds',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           'Date when feeds are added to this production entry.'
        });
        
        
        componentFeedsInput     = new ComponentFeedsInput({
            uniqueKey:          `${settings.uniqueKey}-feeds-input`,
            elemDivContainer:   elemDivContainer,
            
            step:               1,                                    
                                             
            header: {
                col1Name:       'Type',
                col2Name:       'Buy',
                col3Name:       'Feed Add (sacks)'
            }
        });
        
        

        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
           
        const html_breadcrumb   = thisObj.getHtmlBreadCrumbs();
        
        const html_date_add     = elemUiDateAdd.getHtml();
        
        const html_feeds_input  = componentFeedsInput.getHtml();
        
        
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
        
        
        <!-- Select Feed Buy -->
        <div class="form-group-number">
            <label class="form-label">Feed Buy</label>
            <span class="read-only-field">
                <a href="javascript:void(0)" class="text-link" id="${elemIdFeedBuyFrom}">
                    14 Feb 2026 Arnel Sampan
                </a>
            </span>
        
            <div id= "${elemIdFeedBuyNone}"> No Feed Buy entries for past ${MAX_DAYS_TRIGGER_NO_FEED_BUY} days.</div>
            <div id= "${elemIdFeedBuyControl}">
                <a href="javascript:void(0)" class="text-link" id ="${elemIdLinkAddFeedBuy}">
                    Add Feed Buy
                </a>
            </div>
            
            <span id ="${elemIdLinkOlderFeedBuy}">
                OR select older Feed Buy
            </span>
                
            <select class="form-select" id="${elemIdSelectOlderFeedBuy}">
                <option value="0" selected>Please Select</option>
            </select>
            
            
            <table class="data-table table-feed-buy-items" id="${elemIdTableFeedBuy}" style="margin-top:8px;">
                <colgroup>
                    <col style="width: 25%;">
                    <col style="width: 35%;">
                    <col style="width: 40%;">
                </colgroup>
                
                <thead>
                    
                    <tr>
                        <th>Qty</th>
                        <th>Type</th>
                        <th>Brand</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBodyFeedBuy}">
                </tbody>
            </table>
        
            
        </div>
        
        
        <div id="${elemIdFeedInputShow}">
        
            <!-- Date Add -->
            ${html_date_add}
            
            
            ${html_feeds_input}
        
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
    
    
    this.afterHtmlRender = function(){
        // Do the afterHtmlRender to UI elements first;
        
        thisObj.afterHtmlRenderBreadCrumbComponent();
        
        elemUiDateAdd.afterHtmlRender();
        
        componentFeedsInput.afterHtmlRender();
        
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
                                                          
        elemInfoShow            = elemDivContainer.querySelector('#'+elemIdInfoShow);
        elemInfo                = elemDivContainer.querySelector('#'+elemIdInfo);
                                                          
        
        elemFeedBuyFrom         = elemDivContainer.querySelector('#'+elemIdFeedBuyFrom);     
        elemFeedBuyNone         = elemDivContainer.querySelector('#'+elemIdFeedBuyNone);     
        elemFeedBuyControl      = elemDivContainer.querySelector('#'+elemIdFeedBuyControl);
        elemLinkAddFeedBuy      = elemDivContainer.querySelector('#'+elemIdLinkAddFeedBuy);
        elemLinkOlderFeedBuy    = elemDivContainer.querySelector('#'+elemIdLinkOlderFeedBuy);
        elemSelectOlderFeedBuy  = elemDivContainer.querySelector('#'+elemIdSelectOlderFeedBuy);
        
        elemTableFeedBuy        = elemDivContainer.querySelector('#'+elemIdTableFeedBuy);
        elemTableBodyFeedBuy    = elemDivContainer.querySelector('#'+elemIdTableBodyFeedBuy);
        
        elemFeedInputShow        = elemDivContainer.querySelector('#'+elemIdFeedInputShow);    
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        tableFeedBuy = new PageTableBasic();
        tableFeedBuy.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            noSearchAdd:    true,
            noControlsBar:  true,
            itemsPerPage:   20,
            tableTitle:     'Feed Buy Items'
        });
        
        
        tableFeedBuy.getElemTableBody = function(){return elemTableBodyFeedBuy;}
        tableFeedBuy.getHtmlTableRowEmpty = thisObj.getHtmlTableFeedBuyRowEmpty;
        tableFeedBuy.getHtmlTableRow = thisObj.getHtmlTableFeedBuyRow;
    }
    
    
    this._bindEventListeners = function(){
        elemLinkAddFeedBuy.addEventListener('click', function() {
            navigation._onClickNavFeedsExpenses(null);
        });
        
        
        elemSelectOlderFeedBuy.addEventListener('change', function() {
            elemTableFeedBuy.style.display      = 'table';
            elemFeedInputShow.style.display     = 'block';
            elemBtnSave.style.display           = 'block';
            
            const selected_value = elemSelectOlderFeedBuy.value;

            
            selectedPigFarmFeedBuy = thisObj.getDataPigFarmFeedBuy(selected_value);
            tableFeedBuy.renderTable(selectedPigFarmFeedBuy.feed_items);
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
        
    }
    

    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemUiDateAdd.reset();
        componentFeedsInput.reset();
       
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
            html = `<i class="fas fa-plus me-2"></i>Add Production Feed`;
        }
        else{
            html = `<i class="fas fa-edit me-2"></i>Edit Production Feed`;
        }
        elemHeaderTitle.innerHTML = html;
                
        
       
        // Show info 
        elemInfoShow.style.display = 'none';
        
        
        
        // Show/Hide feed type based on dataPigProd.pig_production.prod_status_id
        // TODO so many problems hiding table row
        
        switch (dataPigProd.pig_production.prod_status_id){
            case PROD_STATUS.GESTATING:{
                componentFeedsInput.showFeedType({
                     gesta: true,
                     lacta: true
                });
                
                break;
            }
            
            case PROD_STATUS.LACTATING:{
                componentFeedsInput.showFeedType({
                     lacta: true,
                     booster: true,
                     prestarter: true
                });
                
                break;
            }
            
            default:{
                componentFeedsInput.showFeedType({
                     starter: true,
                     grower: true,
                     finisher: true
                });
                break;
            }
        }
        
        
        
        // Populate Pig Farm Feed Buy Section where to get feeds
        thisObj.populateFeedBuyFromSection();
        
        
        // Populate how many feeds already bought for this dataPigProd
        thisObj.populateFeedsBought();
        
        
        
        console.log('pigprodfeed showOptions');
        console.log(showOptions);
        
        
        if (showOptions.is_add){}
        else{
            thisObj.populateForm();
            thisObj.populateFeedAdd();
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
    
    
    this.populateFeedBuyFromSection = function(){
        elemFeedBuyFrom.style.display       = 'none'; 
        elemFeedBuyNone.style.display       = 'none'; 
        elemLinkAddFeedBuy.style.display    = 'none';
        elemLinkOlderFeedBuy.style.display  = 'none';
        elemSelectOlderFeedBuy.style.display= 'none';
        
        elemTableFeedBuy.style.display      = 'none';
        
        elemFeedInputShow.style.display     = 'none';
        
        elemBtnSave.style.display           = 'none'; 
        
        
        
        
        
        // Get PigFarm.dataFarmFeedBuyList
        
        const feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
        
        
        
        if (showOptions.is_add) {
            if (feed_buy_list == null || feed_buy_list.length == 0){
                elemFeedBuyNone.style.display   = 'block';
                elemLinkAddFeedBuy.style.display= 'block'; 
            }
            
            else{
                console.log(feed_buy_list);
                
                // Get latest entry
                const last_feed_buy = feed_buy_list[0];
                const date_buy  = last_feed_buy.pf_feed_buy.date_buy;
                const dt_buy    = new Date(date_buy);
                
                // Calculate how many days passed from date buy to now
            
                const diff_msecs    = dtCurrentDate - dt_buy;
                const diff_days     = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
                    
                console.log('diff_days = ' + diff_days);
                    
                if (diff_days <= MAX_DAYS_TRIGGER_NO_FEED_BUY){
                    // need to save this
                    selectedPigFarmFeedBuy = last_feed_buy;
                    
                    
                    // Populate elemFeedBuyFrom
                    thisObj.populateFeedBuyFromLink(selectedPigFarmFeedBuy);
                }
                else {
                    elemFeedBuyNone.style.display       = 'block';
                    elemLinkAddFeedBuy.style.display    = 'block'; 
                    elemLinkOlderFeedBuy.style.display  = 'block';
                    
                    //show an option to the user to select older feed_buy
                    elemSelectOlderFeedBuy.style.display= 'block';

            
                    // populate elemSelectOlderFeedBuy
                    let filtered = feed_buy_list;
                    if (feed_buy_list.lenght >= MAX_OLDER_ENTRIES) {
                        filtered = feed_buy_list.slice(0, MAX_OLDER_ENTRIES);
                    }
                    
                    
                    commonSelectOptions.setDataPigFarmFeedBuyList(filtered, 
                        elemSelectOlderFeedBuy);
                }
                
            }
        }
        
        else {
            const pig_prod_feed = showOptions.pig_prod_feed;
            const pig_farm_feed_buy = showOptions.pig_farm_feed_buy;
            
            selectedPigFarmFeedBuy  = pig_farm_feed_buy;
            
            // Populate elemFeedBuyFrom
            thisObj.populateFeedBuyFromLink(selectedPigFarmFeedBuy);
        }
        
        
    }
    
    
    this.populateFeedBuyFromLink = function(pig_farm_feed_buy){
        const date_buy  = pig_farm_feed_buy.pf_feed_buy.date_buy;
        const dt_buy    = new Date(date_buy);
        const s_dt_buy  = formatDate(dt_buy, FORMAT_COMPACT);
        const supplier  = pig_farm_feed_buy.feed_supplier.name;
        
        
        elemFeedBuyFrom.textContent = `${s_dt_buy} ${supplier}`;
        
        
        elemFeedBuyFrom.onclick = function(){
            const row_entry = pig_farm_feed_buy;
            
            const go_back_page_id = PAGE_ID.PROD_FEED_ADD_EDIT;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
        
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    null,
                go_back_page:           go_back_page
            }
            navigation.pagePfFeedBuyAddEdit.beforeShow(options, row_entry);
            
            
            const goto_page_id   = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
        
        
        elemFeedBuyFrom.style.display       = 'block'; 
        elemLinkAddFeedBuy.style.display    = 'none';
         
        elemTableFeedBuy.style.display      = 'table';
        elemFeedInputShow.style.display     = 'block';
        elemBtnSave.style.display           = 'block';
        
    
        tableFeedBuy.renderTable(selectedPigFarmFeedBuy.feed_items);
        
    }
    
    
    this.populateFeedsBought = function(){
        const feeds_bought = dataPigProd.feeds.bought;
        
        let f_gesta     = null;
        let f_lacta     = null;
        let f_booster   = null;
        let f_prestarter= null;
        let f_starter   = null;
        let f_grower    = null;
        let f_finisher  = null;
        
        
        if (feeds_bought && feeds_bought.gestating && feeds_bought.gestating > 0){
            f_gesta = feeds_bought.gestating;
        }
        
        if (feeds_bought && feeds_bought.lactating && feeds_bought.lactating > 0){
            f_lacta = feeds_bought.lactating;
        }
        
        if (feeds_bought && feeds_bought.booster && feeds_bought.booster > 0){
            f_booster = feeds_bought.booster;
        }
        
        if (feeds_bought && feeds_bought.prestarter && feeds_bought.prestarter > 0){
            f_prestarter = feeds_bought.prestarter;
        }

        if (feeds_bought && feeds_bought.starter && feeds_bought.starter > 0){
            f_starter = feeds_bought.starter;
        }
        
        if (feeds_bought && feeds_bought.grower && feeds_bought.grower > 0){
            f_grower = feeds_bought.grower;
        }
        
        if (feeds_bought && feeds_bought.finisher && feeds_bought.finisher > 0){
            f_booster = feeds_bought.finisher;
        }
        
        
        const data = {
            gesta:      f_gesta,
            lacta:      f_lacta,
            booster:    f_booster,
            prestarter: f_prestarter,
            starter:    f_starter,
            grower:     f_grower,
            finisher:   f_finisher
        };
        
        
        componentFeedsInput.setColumn2(data);
    }
    
    
    this.populateForm = function(){
        
        const pig_prod_feed = showOptions.pig_prod_feed;
        const date_add = pig_prod_feed.pig_prod_feed.date_add;

        
        elemUiDateAdd.setDate(date_add);
    }
    
    
    this.populateFeedAdd = function(){
        const pig_prod_feed = showOptions.pig_prod_feed;
        const feed_items    = pig_prod_feed.feed_items;
        
        const feeds_input    = {
            gesta:      null,
            lacta:      null,
            booster:    null,
            prestarter: null,
            grower:     null,
            starter:    null,
            finisher:   null
        };
        
        for (const cur_entry of feed_items){
            switch (cur_entry.feed_type.name){
                case 'GESTA':{
                    feeds_input.gesta = cur_entry.feed_item.quantity;
                    break;
                }
                  
                case 'LACTA':{
                    feeds_input.lacta = cur_entry.feed_item.quantity;
                    break;
                } 
                 
                case 'BOST':{
                    feeds_input.booster = cur_entry.feed_item.quantity;
                    break;
                }
                   
                case 'PRES':{
                    feeds_input.prestarter = cur_entry.feed_item.quantity;
                    break;
                } 
                  
                case 'START':{
                    feeds_input.starter = cur_entry.feed_item.quantity;
                    break;
                }  
                
                case 'GROW':{
                    feeds_input.grower = cur_entry.feed_item.quantity;
                    break;
                }
                   
                case 'FINISH':{
                    feeds_input.grower = cur_entry.feed_item.quantity;
                    break;
                } 
                
            }
        } 
        
        componentFeedsInput.setFeedsInput(feeds_input);
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
        elemUiDateAdd.disableInputs();
      
      
    }
    
    
    this.enableAllInputs = function(){
        elemUiDateAdd.enableInputs();
       
    }
    
    
    this.getHtmlTableFeedBuyRowEmpty = function(){
        const html = `
            <tr>
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableFeedBuyRow = function(cur_entry){
        
        const html = `
            <tr>
                <td>${cur_entry.feed_item.quantity}</td>
                <td>${cur_entry.feed_type.name}</td>
                <td>${cur_entry.feed_brand.name}</td>
            </tr>
        `;
        
        return html;
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
        
        
        
        let input_date_add   = elemUiDateAdd.getValue().trim();
        
        
        input_elem          = elemUiDateAdd.getElemText();
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
