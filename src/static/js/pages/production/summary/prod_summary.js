// prod_summary.js

// February 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS,
        HARVEST_TYPE,
        ACC_USER_GROUP}         from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE} from '../../../utils.js';


/*
 is used in these objects


*/

export function ProdSummary(input_settings){

    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-medvac',
        elemDivContainer:       '<element>'
        includeProdSummary:     true,
        showFinancial:          true
    }   
    */  
    const settings              = input_settings;
    
    const FEED_TYPE_LABEL = {
        'GESTA':    'Gesta',
        'LACTA':    'Lacta',
        'BOOSTER':  'Booster',
        'PRESTART': 'PreStart',
        'STARTER':  'Starter',
        'GROWER':   'Grower',
        'FINISHER': 'Finisher'
    };
    
    
    
    
    let elemDivContainer        = settings.elemDivContainer;

    let elemIdTdPigCountBirth   = null;
    let elemIdTdPigCountWean    = null;
    let elemIdTdPigCountLatest  = null;
    
    let elemIdTdNumDaysLabel    = null;
    let elemIdTdNumDays         = null;
    let elemIdTdTargetHarvest   = null;
    
    let elemIdTdPigsHarvested   = null;
    let elemIdTdPigsSold        = null;
    let elemIdTdGiltBoarInt     = null;
    let elemIdTdGiltBoarSold    = null;
    

    let elemIdTdFeedsCost       = null;
    let elemIdTdTotalSales      = null;
    let elemIdTdGrossProfit     = null;
    let elemIdTdGrossProfitPP   = null;
    

    let elemIdFeedSummaryTitle  = null;
    let elemIdTableBody         = null;
    let elemIdLastFeedBalance   = null;



    let elemTdPigCountBirth     = null;
    let elemTdPigCountWean      = null;
    let elemTdPigCountLatest    = null;
    
    let elemTdNumDaysLabel      = null;
    let elemTdNumDays           = null;
    let elemTdTargetHarvest     = null;
    
    let elemTdPigsHarvested     = null;
    let elemTdPigsSold          = null;
    let elemTdGiltBoarInt       = null;
    let elemTdGiltBoarSold      = null;
    
    
    let elemTdFeedsCost         = null;
    let elemTdTotalSales        = null;
    let elemTdGrossProfit       = null;
    let elemTdGrossProfitPP     = null;
    
    
    let elemFeedSummaryTitle    = null;
    let elemTableBody           = null;
    let elemLastFeedBalance     = null;



    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    let label_days_since_birth          = 'Days Since Birth';
    let label_days_since_wean           = 'Days Since Wean';
    let label_days_birth_to_last_harvest= 'Days Birth to Last Harvest';
    
    
    const helper = navigation.managerTranslations.translationHelper;
            
    
    label_days_since_birth          = helper.getSimpleTranslation('prod_summary.labels.days_since_birth') || label_days_since_birth;
    label_days_since_wean           = helper.getSimpleTranslation('prod_summary.labels.days_since_wean') || label_days_since_wean;
    label_days_birth_to_last_harvest= helper.getSimpleTranslation('prod_summary.labels.days_birth_to_last_harvest') || label_days_birth_to_last_harvest;
        
    
    
    const moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    
    // This can be a data_pig_prod or data_prod_group
    let curDataEntry            = null;
    
    
    this.init = function(){
        
        
        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender();  // This will call the parent method 
    
    }
    
    
    this.getHtml = function(){
        elemIdFeedSummaryTitle  = `${settings.uniqueKey}-feed-summary`;
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        elemIdLastFeedBalance   = `${settings.uniqueKey}-last-feed-balance`;
        
        const html_style        = this._writeInlineStyle();
        
        let html_prod_summary = '';
        
        if (settings.includeProdSummary){
            html_prod_summary = this.getHtmlProdSummary();
        }
        
        
        
        const html = `
    <div class="modal-body" id="">
        ${html_prod_summary}
        
        <h2 class="tab-title" id=${elemIdFeedSummaryTitle}>
            Feed Summary
        </h2>
    
        ${html_style}
        
        <div>Last Feed Balance: <span id="${elemIdLastFeedBalance}">02 Feb 2026</span>  </div>
        
        <table class="data-table table-feed-summary" id="">
            <colgroup>
                <col style="width: 25%;">
                <col style="width: 25%;">
                <col style="width: 25%;">
                <col style="width: 25%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Feed<br>Type</th>
                    <th>Buy<br>(sacks)</th>
                    <th>Cons<br>(sacks)</th>
                    <th>Bal<br>(sacks)</th>
                </tr>
            </thead>
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        
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
        elemFeedSummaryTitle    = elemDivContainer.querySelector('#'+elemIdFeedSummaryTitle);
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
        elemLastFeedBalance     = elemDivContainer.querySelector('#'+elemIdLastFeedBalance);
        
        elemTdPigCountBirth     = elemDivContainer.querySelector('#'+elemIdTdPigCountBirth);
        elemTdPigCountWean      = elemDivContainer.querySelector('#'+elemIdTdPigCountWean);  
        elemTdPigCountLatest    = elemDivContainer.querySelector('#'+elemIdTdPigCountLatest);

        elemTdNumDaysLabel      = elemDivContainer.querySelector('#'+elemIdTdNumDaysLabel); 
        elemTdNumDays           = elemDivContainer.querySelector('#'+elemIdTdNumDays);
        elemTdTargetHarvest     = elemDivContainer.querySelector('#'+elemIdTdTargetHarvest);
        
        elemTdPigsHarvested     = elemDivContainer.querySelector('#'+elemIdTdPigsHarvested);
        elemTdPigsSold          = elemDivContainer.querySelector('#'+elemIdTdPigsSold);
        elemTdGiltBoarInt       = elemDivContainer.querySelector('#'+elemIdTdGiltBoarInt);
        elemTdGiltBoarSold      = elemDivContainer.querySelector('#'+elemIdTdGiltBoarSold);
        

        elemTdFeedsCost         = elemDivContainer.querySelector('#'+elemIdTdFeedsCost);
        elemTdTotalSales        = elemDivContainer.querySelector('#'+elemIdTdTotalSales);
        elemTdGrossProfit       = elemDivContainer.querySelector('#'+elemIdTdGrossProfit);
        elemTdGrossProfitPP     = elemDivContainer.querySelector('#'+elemIdTdGrossProfitPP);
    }
    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){
        // Temporary data refresh;  may find some fixed solution for data refresh later
        elemFeedSummaryTitle.addEventListener('click', function() {
            thisObj.onClickRefeshFeedSummary();
        });
        
    }
    
    
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-feed-summary td {padding-right:0}
    </style>
    `;
        return html;
    }
    

    
    this.beforeShow = function(data_entry){
        curDataEntry = data_entry;
        
        if (settings.includeProdSummary){
            this.populateProdSummary();
        }
        
        thisObj.populateFeedSummary();
    }
    
    
    this.populateProdSummary = function(){
        const list_harvest      = curDataEntry.data_details.list_harvest;
        
        let last_harvest        = null;
        if (list_harvest && list_harvest.length > 0){
            last_harvest = list_harvest[0];
        }
        
        // Update account weight_unit and currency
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const currency          = acc_settings_ops.currency;
        
        const elems_currency = elemDivContainer.querySelectorAll('.acc-currency');
        for(const cur_entry of elems_currency){
            cur_entry.textContent = currency;
        }
        
            
        const target_harvest = parentObj.calculateDateTargetHarvest(
            curDataEntry, null, acc_settings_ops);
    

        
        // Update dynamic num_days label
        let numdays_label = '';
        
        const prod_status_id = curDataEntry.pig_production.prod_status_id; 
        if (prod_status_id == PROD_STATUS.HARVESTED || prod_status_id == PROD_STATUS.CLOSED){
            elemTdNumDaysLabel.innerHTML  = label_days_birth_to_last_harvest;
            
            if (last_harvest){
                
                const date_harvest = last_harvest.prod_harvest.date_harvest;
                
                if (date_harvest){
                
                    let date_start = null;
                    const pig_production = curDataEntry.pig_production;
                    
                    // Check if there is a date_actual_birth;
                    // piglets bought outside for fattening have no date_actual_birth  
                    if (curDataEntry.birth.date_actual){
                        date_start = curDataEntry.birth.date_actual;
                    }
                    
                    if (date_start == null){
                        date_start = curDataEntry.weaning.date_weaning;
                    }
                    
                    if (date_start){
                        const dt_harvest    = new Date(date_harvest);
                        const dt_start      = new Date(date_start);
                        
                        const diff_ms       = dt_harvest.getTime() - dt_start.getTime();
                        const diff_days     = Math.round(diff_ms / (1000 * 60 * 60 * 24));
                        
                        elemTdNumDays.innerHTML = `${diff_days}`;
                    }
                    
                }
            }
        }
        else {
            if (curDataEntry.birth.date_actual){
                elemTdNumDaysLabel.innerHTML  = label_days_since_birth;  
                elemTdNumDays.innerHTML = target_harvest.days_since_birth;  
            }
            else{
                elemTdNumDaysLabel.innerHTML  = label_days_since_wean;  
                elemTdNumDays.innerHTML = target_harvest.days_since_wean;
            }
        }
    
        
        // Pig Counts
        let s_count_pigs_birth = '';
        if (curDataEntry.birth){
            let pig_count = 0;
            
            if (curDataEntry.birth.pigs_live_f){
                pig_count += curDataEntry.birth.pigs_live_f;
                s_count_pigs_birth += `${curDataEntry.birth.pigs_live_f}F`;
            }
            
            if (curDataEntry.birth.pigs_live_m){
                pig_count += curDataEntry.birth.pigs_live_m;
                s_count_pigs_birth += `, ${curDataEntry.birth.pigs_live_m}M`;
            }
            
           
        }
        elemTdPigCountBirth.innerHTML = s_count_pigs_birth;
        
        
        let s_count_pigs_wean = '';
        if (curDataEntry.weaning){
            let pig_count = 0;
            
            if (curDataEntry.weaning.num_pigs){
                s_count_pigs_wean = `${curDataEntry.weaning.num_pigs}`;
            }
            else{
                if (curDataEntry.weaning.num_pigs_f){
                    pig_count += curDataEntry.birth.num_pigs_f;
                    s_count_pigs_wean += `${curDataEntry.weaning.num_pigs_f}F`;
                }
                
                if (curDataEntry.weaning.num_pigs_m){
                    pig_count += curDataEntry.birth.num_pigs_m;
                    s_count_pigs_wean += `, ${curDataEntry.weaning.num_pigs_m}M`;
                }
            }
        }
        elemTdPigCountWean.innerHTML = s_count_pigs_wean;
        
        
        // Latest pig count
        elemTdPigCountLatest.innerHTML = curDataEntry.pig_production.cur_pig_count;
        
              
        // Target date harvest
        elemTdTargetHarvest.innerHTML =  target_harvest.date_target_harvest;
        
        
        // Harvested pigs
        let total_sales         = 0.0;
        let num_pigs_sold       = 0;
        
        if (list_harvest){
            let num_pigs_harvested  = 0;
            
            let num_gilt_boar_int   = 0;
            let num_gilt_boar_sold  = 0;
            
            
            
            for (const cur_entry of list_harvest){
                const prod_harvest  = cur_entry.prod_harvest;
                
                num_pigs_harvested  += prod_harvest.num_pigs;
                
                if (prod_harvest.sales && prod_harvest.sales.net_sales){
                    num_pigs_sold   += prod_harvest.num_pigs;
                    total_sales     += prod_harvest.sales.net_sales;
                }
                
                if (prod_harvest.harvest_type_hid == HARVEST_TYPE.INTERNAL_GILT_BOAR){
                    num_gilt_boar_int += prod_harvest.num_pigs;
                }
                
                if (prod_harvest.harvest_type_hid == HARVEST_TYPE.GILT_SALE){
                    num_gilt_boar_sold += prod_harvest.num_pigs;
                }
                
                if (prod_harvest.harvest_type_hid == HARVEST_TYPE.BOAR_SALE){
                    num_gilt_boar_sold += prod_harvest.num_pigs;
                }
            }
            
            
            elemTdPigsHarvested.innerHTML   = `${num_pigs_harvested}`;
            elemTdPigsSold.innerHTML        = `${num_pigs_sold}`;
            elemTdGiltBoarInt.innerHTML     = `${num_gilt_boar_int}`;
            elemTdGiltBoarSold.innerHTML    = `${num_gilt_boar_sold}`;
        }
        
        
        const elems_trs = elemDivContainer.querySelectorAll('.tr-financial');
        
        let show_financial = 0;
        
        // Get user.user_group.group_num

        const cur_user = navigation.userControl.dataUserAccount.user;
        const user_group_num = cur_user.user_group.group_num;
        
        if (user_group_num == ACC_USER_GROUP.ADMIN || 
            user_group_num == ACC_USER_GROUP.MANAGEMENT){
            show_financial = 1;
        } 
        
        if (show_financial == 0){
            for(const cur_entry of elems_trs){
                cur_entry.textContent = '----';
            }
            
            return;
        }
       
        
        
        
        // Show Total sales
        const s_total_sales         = moneyFormatter.format(total_sales);
        elemTdTotalSales.innerHTML  = `${s_total_sales}`;
        
        
        // Compute feeds cost
        const prod_feeds_cost = curDataEntry.feeds.cost;
        
        let feeds_cost = 0;
        
        if (prod_feeds_cost.gestating)  {feeds_cost+= prod_feeds_cost.gestating;}
        if (prod_feeds_cost.lactating)  {feeds_cost+= prod_feeds_cost.lactating;}
        if (prod_feeds_cost.booster)    {feeds_cost+= prod_feeds_cost.booster;}
        if (prod_feeds_cost.prestarter) {feeds_cost+= prod_feeds_cost.prestarter;}
        if (prod_feeds_cost.starter)    {feeds_cost+= prod_feeds_cost.starter;}
        if (prod_feeds_cost.grower)     {feeds_cost+= prod_feeds_cost.grower;}
        if (prod_feeds_cost.finisher)   {feeds_cost+= prod_feeds_cost.finisher;}
        
        const s_feeds_cost = parentObj.moneyFormatter.format(feeds_cost);
        
        // Show Total feeds cost
        elemTdFeedsCost.innerHTML = s_feeds_cost;
    
    
        // Show Gross Profit and Gross Profit per pig
        if (total_sales > 0){
            const gross_profit      = total_sales - feeds_cost;
            const gross_profit_pp   = gross_profit/  num_pigs_sold;
            
            const s_gross_profit    = parentObj.moneyFormatter.format(gross_profit);
            const s_gross_profit_pp = parentObj.moneyFormatter.format(gross_profit_pp);
            
            elemTdGrossProfit.innerHTML   = s_gross_profit; 
            elemTdGrossProfitPP.innerHTML = s_gross_profit_pp;
        }
        else{
            elemTdGrossProfit.innerHTML   = '0.0'; 
            elemTdGrossProfitPP.innerHTML = '0.0';
        }

    }
    
    
        
    this.populateFeedSummary = function(){
        
        const prod_entry_feeds = curDataEntry.feeds;
        const feeds_bought  = prod_entry_feeds.bought;
        const feeds_balance = prod_entry_feeds.balance;
        
        
        let s_date_balance = '';
        if (feeds_balance.date_balance){
            const dt_balance = new Date(feeds_balance.date_balance);
            s_date_balance = formatDate(dt_balance, FORMAT_COMPACT);
        }
        else{
            s_date_balance = 'None';
        }
        elemLastFeedBalance.textContent = s_date_balance;
        
        
        let consumed_gestating  = null;
        let consumed_lactating  = null;
        let consumed_booster    = null;
        let consumed_prestarter = null;
        let consumed_starter    = null;
        let consumed_grower     = null;
        let consumed_finisher   = null;
        
        
        let balance_gestating   = null;
        let balance_lactating   = null;
        let balance_booster     = null;
        let balance_prestarter  = null;
        let balance_starter     = null;
        let balance_grower      = null;
        let balance_finisher    = null;
        
        
        
        if (feeds_bought.gestating) {
            if (feeds_balance.gestating){
                balance_gestating   = feeds_balance.gestating;
                consumed_gestating  = feeds_bought.gestating - feeds_balance.gestating;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_gestating   = 0;
                    consumed_gestating  = feeds_bought.gestating;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
        if (feeds_bought.lactating) {
            if (feeds_balance.lactating){
                balance_lactating   = feeds_balance.lactating
                consumed_lactating  = feeds_bought.lactating - feeds_balance.lactating;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_lactating   = 0;
                    consumed_lactating  = feeds_bought.lactating;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
        if (feeds_bought.booster) {
            if (feeds_balance.booster){
                balance_booster     = feeds_balance.booster;
                consumed_booster    = feeds_bought.booster - feeds_balance.booster;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_booster     = 0;
                    consumed_booster    = feeds_bought.booster;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
        if (feeds_bought.prestarter) {
            if (feeds_balance.prestarter){
                balance_prestarter  = feeds_balance.prestarter;
                consumed_prestarter = feeds_bought.prestarter - feeds_balance.prestarter;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_prestarter  = 0;
                    consumed_prestarter = feeds_bought.prestarter;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
        if (feeds_bought.starter) {
            if (feeds_balance.starter){
                balance_starter     = feeds_balance.starter;
                consumed_starter    = feeds_bought.starter - feeds_balance.starter;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_starter     = 0;
                    consumed_starter    = feeds_bought.starter;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
         if (feeds_bought.grower) {
            if (feeds_balance.grower){
                balance_grower      = feeds_balance.grower;
                consumed_grower     = feeds_bought.grower - feeds_balance.grower;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_grower      = 0;
                    consumed_grower     = feeds_bought.grower;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
        if (feeds_bought.finisher) {
            if (feeds_balance.finisher){
                balance_finisher    = feeds_balance.finisher;
                consumed_finisher   = feeds_bought.finisher - feeds_balance.finisher;
            }
            else{
                if (feeds_balance.date_balance){
                    balance_finisher    = 0;
                    consumed_finisher   = feeds_bought.finisher;
                }
                // If no last feed balance, consumption cannot be computed
            }
        }
        
        
        const feed_summary = [
            
            {   
                type:   FEED_TYPE_LABEL.FINISHER,
                buy:    feeds_bought.finisher,
                cons:   consumed_finisher,
                bal:    balance_finisher
            },
            
            {   
                type:   FEED_TYPE_LABEL.GROWER,
                buy:    feeds_bought.grower,
                cons:   consumed_grower,
                bal:    balance_grower
            },
            
            {   
                type:   FEED_TYPE_LABEL.STARTER,
                buy:    feeds_bought.starter,
                cons:   consumed_starter,
                bal:    balance_starter
            },
            
            {   
                type:   FEED_TYPE_LABEL.PRESTART,
                buy:    feeds_bought.prestarter,
                cons:   consumed_prestarter,
                bal:    balance_prestarter
            },
            
            {   
                type:   FEED_TYPE_LABEL.BOOSTER,
                buy:    feeds_bought.booster,
                cons:   consumed_booster,
                bal:    balance_booster
            },
            
            {   
                type:   FEED_TYPE_LABEL.LACTA,
                buy:    feeds_bought.lactating,
                cons:   consumed_lactating,
                bal:    balance_lactating
            },
            
            
            {   
                type:   FEED_TYPE_LABEL.GESTA,
                buy:    feeds_bought.gestating,
                cons:   consumed_gestating,
                bal:    balance_gestating
            }
        
        ];
        
        
        let html = '';
        
        for (const cur_entry of feed_summary){
            html += thisObj.getHtmlTableRow(cur_entry);
        }
        
        elemTableBody.innerHTML = html;
        
    }
    
    
    this.shouldShowCostColumn = function(){
        // Check screen width
        const isLargeScreen = window.innerWidth >= 768;
        
        // Check user permissions (if needed)
        const cur_user = navigation.userControl.dataUserAccount.user;
        const user_group_num = cur_user.user_group.group_num;
        const hasPermission = user_group_num == ACC_USER_GROUP.ADMIN || 
                              user_group_num == ACC_USER_GROUP.MANAGEMENT;
        
        // Return true only if both conditions are met
        return isLargeScreen && hasPermission;
    }
        
    
        
    this.show = function(options){
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        showOptions = options;
        
    }
    
    
    this.getHtmlProdSummary = function(){
        elemIdTdPigCountBirth   = `${settings.uniqueKey}-pig-count-birth`;
        elemIdTdPigCountWean    = `${settings.uniqueKey}-pig-count-wean`;
        elemIdTdPigCountLatest  = `${settings.uniqueKey}-pig-count-latest`;
        elemIdTdNumDaysLabel    = `${settings.uniqueKey}-num-days-label`;
        elemIdTdNumDays         = `${settings.uniqueKey}-num-days`;
        elemIdTdTargetHarvest   = `${settings.uniqueKey}-target-harvest`;
        
        elemIdTdPigsHarvested   = `${settings.uniqueKey}-pig-harvested`;
        elemIdTdPigsSold        = `${settings.uniqueKey}-pig-sold`;
        elemIdTdGiltBoarInt     = `${settings.uniqueKey}-gilt-boar-int`;
        elemIdTdGiltBoarSold    = `${settings.uniqueKey}-gilt-boar-sold`;
        

        elemIdTdFeedsCost       = `${settings.uniqueKey}-td-feeds-cost`;
        elemIdTdTotalSales      = `${settings.uniqueKey}-td-total-sales`;
        elemIdTdGrossProfit     = `${settings.uniqueKey}-td-gross-profit`;
        elemIdTdGrossProfitPP   = `${settings.uniqueKey}-td-gross-profit-pp`;
        
        
        
        let label_pig_count_birth       = 'Pig Count at Birth';
        let label_pig_count_wean        = 'Pig Count at Wean';
        let label_pig_count_latest      = 'Pig Count Latest';
        
        let label_target_harvest        = 'Target Harvest';
        let label_pigs_harvested        = 'Total Pigs Harvested';
        let label_pigs_sold             = 'Total Pigs Sold';
        let label_gilt_boar_harvested   = 'Gilt, Boar Harvested';
        let label_gilt_boar_sold        = 'Gilt, Boar Sold';
        let label_feeds_cost            = 'Feeds Cost';
        let label_total_sales           = 'Total Sales';
        let label_gross_profit          = 'Gross Profit';
        let label_gross_profit_pp       = 'Gross Profit Per Pig'
        
        
        const helper = navigation.managerTranslations.translationHelper;
            
        
        label_pig_count_birth           = helper.getSimpleTranslation('prod_summary.labels.pig_count_birth') || label_pig_count_birth;
        label_pig_count_wean            = helper.getSimpleTranslation('prod_summary.labels.pig_count_wean') || label_pig_count_wean;
        label_pig_count_latest          = helper.getSimpleTranslation('prod_summary.labels.pig_count_latest') || label_pig_count_latest;
        
        label_target_harvest            = helper.getSimpleTranslation('prod_summary.labels.target_harvest') || label_target_harvest;
        label_pigs_harvested            = helper.getSimpleTranslation('prod_summary.labels.pigs_harvested') || label_pigs_harvested;
        label_pigs_sold                 = helper.getSimpleTranslation('prod_summary.labels.pigs_sold') || label_pigs_sold;
        label_gilt_boar_harvested       = helper.getSimpleTranslation('prod_summary.labels.gilt_boar_harvested') || label_gilt_boar_harvested;
        label_gilt_boar_sold            = helper.getSimpleTranslation('prod_summary.labels.gilt_boar_sold') || label_gilt_boar_sold;
        label_feeds_cost                = helper.getSimpleTranslation('prod_summary.labels.feeds_cost') || label_feeds_cost;
        label_total_sales               = helper.getSimpleTranslation('prod_summary.labels.total_sales') || label_total_sales;
        label_gross_profit              = helper.getSimpleTranslation('prod_summary.labels.gross_profit') || label_gross_profit;
        label_gross_profit_pp           = helper.getSimpleTranslation('prod_summary.labels.gross_profit_pp') || label_gross_profit_pp;

        
        let html_financial = `
                <tr class="tr-financial">
                    <td>${label_feeds_cost}, <span class="acc-currency"></span></td>
                    <td id="${elemIdTdFeedsCost}">0.0</td>
                </tr>
                
                <tr class="tr-financial">
                    <td>${label_total_sales}, <span class="acc-currency"></td>
                    <td id="${elemIdTdTotalSales}">0.0</td>
                </tr>
                
                <tr class="tr-financial">
                    <td>${label_gross_profit}, <span class="acc-currency"></td>
                    <td id="${elemIdTdGrossProfit}">0.0</td>
                </tr>
                
                <tr class="tr-financial">
                    <td>${label_gross_profit_pp}, <span class="acc-currency"></td>
                    <td id="${elemIdTdGrossProfitPP}">0.0</td>
                </tr>
                
        `;
        
        
        
        let show_financial = 0;
        
        // Get user.user_group.group_num
        /*
        const cur_user = navigation.userControl.dataUserAccount.user;
        const user_group_num = cur_user.user_group.group_num;
        
        if (user_group_num == ACC_USER_GROUP.ADMIN || 
            user_group_num == ACC_USER_GROUP.MANAGEMENT){
            show_financial = 1;
        } 
        
        if (show_financial == 0){html_financial = '';}
        */
        
        const html = `
        <h2>
            <span class="nav-title blue">Production Summary</span>
        </h2>
        
        
        <table class="data-table">
            <colgroup>
                <col style="width: 65%;">
                <col style="width: 35%;">
            </colgroup>
            
            
            <tbody>
                <tr>
                    <td>${label_pig_count_birth}</td>
                    <td id="${elemIdTdPigCountBirth}">15</td>
                </tr>
                
                <tr>
                    <td>${label_pig_count_wean}</td>
                    <td id="${elemIdTdPigCountWean}">15</td>
                </tr>
                
                
                <tr>
                    <td>${label_pig_count_latest}</td>
                    <td id="${elemIdTdPigCountLatest}">15</td>
                </tr>
                
                <tr>
                    <td id="${elemIdTdNumDaysLabel}">${label_days_since_birth}</td>
                    <td id="${elemIdTdNumDays}">145</td>
                </tr>
                
                <tr>
                    <td>${label_target_harvest}</td>
                    <td id="${elemIdTdTargetHarvest}">05 April 2026(150 days)</td>
                </tr>
                
                <tr>
                    <td>${label_pigs_harvested}</td>
                    <td id="${elemIdTdPigsHarvested}">0</td>
                </tr>
                
                <tr>
                    <td>${label_pigs_sold}</td>
                    <td id="${elemIdTdPigsSold}">0</td>
                </tr>
                
                <tr>
                    <td>${label_gilt_boar_harvested}</td>
                    <td id="${elemIdTdGiltBoarInt}">0</td>
                </tr>
                
                <tr>
                    <td>${label_gilt_boar_sold}</td>
                    <td id="${elemIdTdGiltBoarSold}">0</td>
                </tr>
                
                ${html_financial}
                
            </tbody>
        </table>
        
        <br>
        `;
        
        return html;
    }
    


    this.getHtmlTableRow = function(cur_entry){
        let s_feed_buy      = '';
        let s_feed_consumed = '';
        let s_feed_balance  = '';
        
        if (cur_entry.buy ) {
            s_feed_buy       = `${cur_entry.buy}`;}
        
        if (cur_entry.cons != null  && cur_entry.cons >= 0){
            s_feed_consumed = `${cur_entry.cons}`;}
        
        if (cur_entry.bal != null && cur_entry.bal >= 0){
            s_feed_balance   = `${cur_entry.bal}`;}
        
        
        const html = `
            <tr>
                <td>${cur_entry.type}</td>
                <td>${s_feed_buy}</td>
                <td>${s_feed_consumed}</td>
                <td>${s_feed_balance}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.onClickRefeshFeedSummary = function(){
        const callback_success = function(){
            thisObj.populateFeedSummary();
        }
        
        navigation.pigFarm.managerPigProd.requestPigProdFeedSummaryList(
            curDataEntry, callback_success);
    
    }
    
}
