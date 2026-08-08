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

import {PigProductionFeeds}     from  '../../feeds/feed_estimate/pig_production_feeds.js'

import {calculateNumDaysSinceBirth} from '../../common/page_view_basic.js';
import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


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
    
    let elemIdTdAveWtLive       = null;
    let elemIdTdAveWtSlaughter  = null; 

    let elemIdTdFeedsCost       = null;
    let elemIdTdTotalSales      = null;
    let elemIdTdGrossProfit     = null;
    let elemIdTdGrossProfitPP   = null;
    

    let elemIdFeedSummaryTitle  = null;
    let elemIdTableBody         = null;
    let elemIdLastFeedBalance   = null;

    
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    let elemIdPigCount          = null;
    
    let elemIdFeedEstimateShow  = null;
    let elemIdProdEstimatePid   = null;
    let elemIdFeedEstimateTitle = null;
    
    let elemIdThMonth1          = null;
    let elemIdThMonth2          = null;
    let elemIdThMonth3          = null;
    let elemIdThMonth4          = null;
     
    let elemIdTableEstimateBody = null;
    let elemIdEstFeedCost       = null;
    let elemIdLabelDateHarvest  = null;
    let elemIdDateHarvest       = null;
    

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
    
    let elemTdAveWtLive         = null;
    let elemTdAveWtSlaughter    = null; 

    
    let elemTdFeedsCost         = null;
    let elemTdTotalSales        = null;
    let elemTdGrossProfit       = null;
    let elemTdGrossProfitPP     = null;
    
    
    let elemFeedSummaryTitle    = null;
    let elemTableBody           = null;
    let elemLastFeedBalance     = null;

    let elemLabelToday          = null;
    let elemDateToday           = null;
    let elemPigCount            = null;
    
    let elemFeedEstimateShow    = null;
    let elemProdEstimatePid     = null;
    let elemFeedEstimateTitle   = null;
        
    let elemThMonth1            = null;
    let elemThMonth2            = null;
    let elemThMonth3            = null;
    let elemThMonth4            = null;
        
    let elemTableEstimateBody   = null;
    let elemEstFeedCost         = null;
    let elemLabelDateHarvest    = null;
    let elemDateHarvest         = null;



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
        
        let html_feed_estimate = this.getHtmlFeedEstimate();
        
        
        const html = `
    <div class="modal-body" id="">
        ${html_prod_summary}
        
        <h2 class="tab-title" id="${elemIdFeedSummaryTitle}">
            Feed Summary
        </h2>
    
        ${html_style}
        
        <div>Last Feed Balance: <span id="${elemIdLastFeedBalance}" style="color:blue; font-weight:600;"></span></div>
        
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
                    <th>Consumed (sacks)</th>
                    <th>Balance (sacks)</th>
                </tr>
            </thead>
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        
        ${html_feed_estimate}
        
    </div>
        `;
       
        return html;

    }
    
    
    this.getHtmlFeedEstimate = function(){
        let label_today         = 'Today';
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        elemIdPigCount          = `${settings.uniqueKey}-pig-count`;
        
        
        elemIdFeedEstimateShow  = `${settings.uniqueKey}-estimate-show`;
        elemIdProdEstimatePid   = `${settings.uniqueKey}-estimate-prod-pid`;
        elemIdFeedEstimateTitle = `${settings.uniqueKey}-estimate-title`;
        
        elemIdThMonth1          = `${settings.uniqueKey}-estimate-month-1`;
        elemIdThMonth2          = `${settings.uniqueKey}-estimate-month-2`;
        elemIdThMonth3          = `${settings.uniqueKey}-estimate-month-3`;
        elemIdThMonth4          = `${settings.uniqueKey}-estimate-month-4`;
        
        elemIdTableEstimateBody = `${settings.uniqueKey}-estimate-body`;
        
        elemIdEstFeedCost       = `${settings.uniqueKey}-estimate-cost`;
        
        elemIdLabelDateHarvest  = `${settings.uniqueKey}-label-date-harvest`;
        elemIdDateHarvest       = `${settings.uniqueKey}-date-harvest`;
        
        
        const html = `
    <div id="${elemIdFeedEstimateShow}">
        <br>
        
        <h2 class="tab-title" id="${elemIdFeedEstimateTitle}">
            Feed Estimate
        </h2>
        
        <div id="${elemIdProdEstimatePid}"></div>
    
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; gap: 10px;">
            <div>
                <span id="${elemIdLabelToday}">${label_today}</span>
                <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
            </div>
            
            <div>
                <span>Pig Count: </span>
                <span id="${elemIdPigCount}" style="color:blue; font-weight:600;"></span>
            </div>
        </div>
        
        <table class="data-table table-feed-summary" id="">
            <colgroup>
                <col style="width: 20%;">
                <col style="width: 20%;">
                <col style="width: 20%;">
                <col style="width: 20%;">
                <col style="width: 20%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Feed Type</th>
                    <th id="${elemIdThMonth1}">Jul 1</th>
                    <th id="${elemIdThMonth2}">Aug 1</th>
                    <th id="${elemIdThMonth3}">Sep 1</th>
                    <th id="${elemIdThMonth4}">Oct 1</th>
                </tr>
            </thead>
            
            <tbody id="${elemIdTableEstimateBody}">
                <tr>
                    <td>PreStart</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Starter</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Grower</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Finisher</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Est. Cost</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        
        <div>
            <span id="">Estimated Feed Cost: </span>
            <span id="${elemIdEstFeedCost}" style="color:blue; font-weight:600;"></span>
        </div>
        
        <div>
            <span id="${elemIdLabelDateHarvest}">Day 145(Harvest): </span>
            <span id="${elemIdDateHarvest}" style="color:blue; font-weight:600;"></span>
        </div>
        
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
        
        elemTdAveWtLive         = elemDivContainer.querySelector('#'+elemIdTdAveWtLive);
        elemTdAveWtSlaughter    = elemDivContainer.querySelector('#'+elemIdTdAveWtSlaughter);

        elemTdFeedsCost         = elemDivContainer.querySelector('#'+elemIdTdFeedsCost);
        elemTdTotalSales        = elemDivContainer.querySelector('#'+elemIdTdTotalSales);
        elemTdGrossProfit       = elemDivContainer.querySelector('#'+elemIdTdGrossProfit);
        elemTdGrossProfitPP     = elemDivContainer.querySelector('#'+elemIdTdGrossProfitPP);
        
        
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
        elemPigCount            = elemDivContainer.querySelector('#'+elemIdPigCount);
        
        elemFeedEstimateShow    = elemDivContainer.querySelector('#'+elemIdFeedEstimateShow);
        elemProdEstimatePid     = elemDivContainer.querySelector('#'+elemIdProdEstimatePid);
        elemFeedEstimateTitle   = elemDivContainer.querySelector('#'+elemIdFeedEstimateTitle);
        
        elemThMonth1            = elemDivContainer.querySelector('#'+elemIdThMonth1);
        elemThMonth2            = elemDivContainer.querySelector('#'+elemIdThMonth2);
        elemThMonth3            = elemDivContainer.querySelector('#'+elemIdThMonth3);
        elemThMonth4            = elemDivContainer.querySelector('#'+elemIdThMonth4);
        
        elemTableEstimateBody   = elemDivContainer.querySelector('#'+elemIdTableEstimateBody);
        elemEstFeedCost         = elemDivContainer.querySelector('#'+elemIdEstFeedCost);
        elemLabelDateHarvest    = elemDivContainer.querySelector('#'+elemIdLabelDateHarvest);
        elemDateHarvest         = elemDivContainer.querySelector('#'+elemIdDateHarvest);
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
    

    
    this.show = function(data_entry, options){
        curDataEntry = data_entry;
        
        if (settings.includeProdSummary){
            this.populateProdSummary();
        }
        
        this.populateFeedSummary();
        
        this.populateFeedEstimate();
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

            let num_pigs_slaughter  = 0;
            let total_slaughter_wt  = 0.0;

            
            
            for (const cur_entry of list_harvest){
                const prod_harvest  = cur_entry.prod_harvest;
                
                num_pigs_harvested  += prod_harvest.num_pigs;

                if (prod_harvest.slaughter_weight && prod_harvest.slaughter_weight.net_weight){
                    num_pigs_slaughter += prod_harvest.num_pigs;
                    total_slaughter_wt += prod_harvest.slaughter_weight.net_weight;
                }
                
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
            

            if (num_pigs_slaughter > 0){
                let ave_wt_slaughter = total_slaughter_wt / num_pigs_slaughter;
                elemTdAveWtSlaughter.innerHTML  = `${ave_wt_slaughter.toFixed(1)}`;
            }
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
        
    
    this.populateFeedEstimate = function(){
        //console.log('curDataEntry');
        //console.log(curDataEntry);
        
        const farm_page = new PageViewPigFarmPage();
        farm_page.setNavigation(navigation);
        
        const html_pid = farm_page.getHtmlPidSowLoveBoar(curDataEntry, false, true);
        elemProdEstimatePid.innerHTML = html_pid;
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        // Compute number of days since birth
        let diff_days = null;
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        console.log(`acc_settings_ops`);
        console.log(acc_settings_ops);
        
        if (curDataEntry.birth.date_actual){
            diff_days = calculateNumDaysSinceBirth(
                            curDataEntry.birth.date_actual, dtCurrentDate,
                            acc_settings_ops);
        }
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        let s_date = s_dt_current;
        if (diff_days) {s_date = `${s_dt_current} (Day ${diff_days})`;}
        
        elemDateToday.textContent = s_date;
    
        elemPigCount.textContent = curDataEntry.pig_production.cur_pig_count;
        
        
        // Compute date of harvest; 
        // This is computed as 
        //
        // if curDataEntry.birth.date_actual is not null
        //      date_harvest = curDataEntry.birth.date_actual + 
        //          acc_settings_ops.num_days_harvest_from_birth;  
        //
        // else:
        //      date_harvest = curDataEntry.weaning.date_weaning + 
        //          acc_settings_ops.num_days_harvest_from_wean;
        let s_date_harvest; 
        
        // Get account settings for harvest days
        const days_birth_to_harvest = acc_settings_ops.num_days_harvest_from_birth || 145;
        const days_weaning_to_harvest = acc_settings_ops.num_days_harvest_from_wean || 100;
        let days_harvest = null;

        // Check if birth date exists
        if (curDataEntry.birth && curDataEntry.birth.date_actual) {
            // Birth + days_birth_to_harvest
            const birthDate = new Date(curDataEntry.birth.date_actual);
            birthDate.setDate(birthDate.getDate() + days_birth_to_harvest);
            s_date_harvest = formatDate(birthDate, FORMAT_COMPACT);
            
            days_harvest = days_birth_to_harvest;
        } 
        else if (curDataEntry.weaning && curDataEntry.weaning.date_weaning) {
            // Weaning + days_weaning_to_harvest
            const weaningDate = new Date(curDataEntry.weaning.date_weaning);
            weaningDate.setDate(weaningDate.getDate() + days_weaning_to_harvest);
            s_date_harvest = formatDate(weaningDate, FORMAT_COMPACT);
        
            days_harvest =  days_weaning_to_harvest;
        }
        
        elemLabelDateHarvest.textContent = `Day ${days_harvest}(Harvest): `;
        elemDateHarvest.textContent = s_date_harvest;
    

        const prod_status_id = curDataEntry.pig_production.prod_status_id;
        
        if (prod_status_id == PROD_STATUS.LACTATING ||
            prod_status_id == PROD_STATUS.WEANING ||
            prod_status_id == PROD_STATUS.GROWING) {
            elemFeedEstimateShow.style.display = 'block';
        }
        else{
            elemFeedEstimateShow.style.display = 'none';
            return;
        }
        
        // compute feed_estimate in next 4 months
        const prod_feeds    = new PigProductionFeeds(curDataEntry);
        const feed_estimate = prod_feeds.computeFeedNeeds();
        
        //console.log('feed_estimate');
        //console.log(feed_estimate);
        
        if (!feed_estimate || feed_estimate.length === 0) {
            // Show empty state or hide
            return;
        }
        
        // Helper function to format money: round to nearest 100 and add commas
        const formatMoney = function(amount) {
            if (!amount) return '';
            // Round to nearest 100
            const rounded = Math.round(amount / 100) * 100;
            // Add commas
            return rounded.toLocaleString('en-US');
        };
        
        // Update month headers
        const monthHeaders = [elemThMonth1, elemThMonth2, elemThMonth3, elemThMonth4];
        for (let i = 0; i < monthHeaders.length && i < feed_estimate.length; i++) {
            const dateStr = feed_estimate[i].date_to_buy;
            if (dateStr) {
                const dateObj = new Date(dateStr);
                const month = dateObj.toLocaleString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                monthHeaders[i].textContent = `${month} ${day} (sacks)`;
            }
        }
        
        // Define feed types to display (in order)
        const feedTypes = ['prestarter', 'starter', 'grower', 'finisher'];
        const feedLabels = {
            'prestarter': 'PreStart',
            'starter': 'Starter',
            'grower': 'Grower',
            'finisher': 'Finisher'
        };
        
        // Build table rows
        let html = '';
        
        // Feed type rows
        for (const feedType of feedTypes) {
            let rowHtml = `<tr><td>${feedLabels[feedType]}</td>`;
            
            for (let i = 0; i < feed_estimate.length; i++) {
                const monthData = feed_estimate[i];
                const sacks = monthData.feeds_sacks && monthData.feeds_sacks[feedType] 
                    ? monthData.feeds_sacks[feedType] 
                    : '';
                rowHtml += `<td style="text-align:center;">${sacks}</td>`;
            }
            
            // Fill remaining columns if less than 4 months
            for (let i = feed_estimate.length; i < 4; i++) {
                rowHtml += `<td></td>`;
            }
            
            rowHtml += `</tr>`;
            html += rowHtml;
        }
        
        // Estimated cost row (rounded to nearest 100, with commas, no currency symbol)
        let costRowHtml = `<tr><td><strong>Est. Cost</strong></td>`;
        
        let totalEstCost = 0; 
        
        for (let i = 0; i < feed_estimate.length; i++) {
            const monthData = feed_estimate[i];
            const cost = monthData.estimated_cost || 0;
            totalEstCost    += cost;
            costRowHtml     += `<td>${formatMoney(cost)}</td>`;
        }
        
        // Fill remaining columns if less than 4 months
        for (let i = feed_estimate.length; i < 4; i++) {
            costRowHtml += `<td></td>`;
        }
        
        costRowHtml += `</tr>`;
        html += costRowHtml;
        
        elemTableEstimateBody.innerHTML = html;
        
        // Show Total estimated cost
        elemEstFeedCost.textContent = `${formatMoney(totalEstCost)}`;
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
        
        elemIdTdAveWtLive       = `${settings.uniqueKey}-td-ave-wt-live`;
        elemIdTdAveWtSlaughter  = `${settings.uniqueKey}-td-ave-wt-slaughter`;

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

        let label_ave_wt_live           = 'Ave. weight Live';
        let label_ave_wt_slaughter      = 'Ave. weight Slaughter';
        
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
        
        label_ave_wt_live               = helper.getSimpleTranslation('prod_summary.labels.ave_wt_live') || label_ave_wt_live;
        label_ave_wt_slaughter          = helper.getSimpleTranslation('prod_summary.labels.ave_wt_slaughter') || label_ave_wt_slaughter;
        
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

                <tr>
                    <td>${label_ave_wt_live}</td>
                    <td id="${elemIdTdAveWtLive}"></td>
                </tr>

                <tr>
                    <td>${label_ave_wt_slaughter}</td>
                    <td id="${elemIdTdAveWtSlaughter}"></td>
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
        
        navigation.pigFarm.managerPigProd.requestPigProdFeedSummary(
            curDataEntry, callback_success);
    
    }
    
}
