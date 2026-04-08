// February 11, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}        from '../../../utils.js';



import {PAGE_ID,
        HARVEST_TYPE,
        PROD_STATUS}           from '../../../constants.js';



export function HarvestCard(input_settings){
    /*
    Typical settings
    {
        navigation:             navigation,
        uniqueKey:              'medvac-add-edit-brand-name',

    
        labelSelect:            'Select Feed Type',
        helpText:               null

    }
    */
    
       
    
    const navigation        = input_settings.navigation;
    const parentObj         = input_settings.parentObj;
    
    const thisObj           = this;
    
    const settings          = input_settings;
    
    
    const moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    
    this.getElemHarvestCard = function(data_pig_prod, data_harvest){
        const html_card = thisObj.getHtmlHarvestCard(data_harvest);
        
        if (html_card){
            const elem_card = document.createElement('div');
            elem_card.innerHTML = html_card;
            
            thisObj.attachListeners(data_pig_prod, data_harvest, elem_card);
            return elem_card;
        }
        
        return null;
    }
    
    
    
    this.getHtmlHarvestCard = function(data_harvest){
        const prod_harvest      = data_harvest.prod_harvest;
        const harvest_type_hid   = prod_harvest.harvest_type_hid;
        
        switch (harvest_type_hid){
            case HARVEST_TYPE.PIGLETS_SALE:
            case HARVEST_TYPE.LIVE_PIGS_SALE:
            case HARVEST_TYPE.SLAUGHTER_PIGS_SALE: {
                return thisObj.getHtmlSaleLiveOrSlaughterPigs(data_harvest);
            }
    
    
            case HARVEST_TYPE.GILT_SALE:          
            case HARVEST_TYPE.BOAR_SALE:          
            case HARVEST_TYPE.INTERNAL_GILT_BOAR:  {
                return thisObj.getHtmlSaleGiltBoar(data_harvest);
            }
            
    
    
            case HARVEST_TYPE.BOAR_MATE_PAYMENT:{
                return thisObj.getHtmlInternal(data_harvest);
            }
            
            case HARVEST_TYPE.INTERNAL_CONSUMPTION:{break;}
            case HARVEST_TYPE.INTERNAL_SALE: {break;}
            
            default:{break;}
        }
        
        return null;
    }
    
    
    this.getHtmlInternal = function(data_harvest){
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const weight_unit       = acc_settings_ops.weight_unit;
        
        const prod_harvest      = data_harvest.prod_harvest;
        const date_harvest      = prod_harvest.date_harvest;
        const dt_harvest        = new Date(date_harvest);
        const s_dt_harvest      = formatDate(dt_harvest, FORMAT_COMPACT);
        
        const harvest_type_hid   = prod_harvest.harvest_type_hid;
        
        let harvest_tag         = '';
        let tag_class           = '';
        
        
        if (harvest_type_hid == HARVEST_TYPE.BOAR_MATE_PAYMENT){
            harvest_tag         = 'BOAR MATE PAYMENT';
            tag_class           = 'external';
        }
        
        if (harvest_type_hid == HARVEST_TYPE.INTERNAL_CONSUMPTION){
            harvest_tag         = 'CONSUMPTION';
            tag_class           = 'external';
        }
        
        
        
        const num_pigs      = prod_harvest.num_pigs;
        
        
        let live_weight         = 'N/A';
        let live_weight_ave     = 'N/A';
        let live_weight_unit    = '';
        
        let per_pig_weight_csv  = null;
        
        if (prod_harvest.live_weight && prod_harvest.live_weight.weight){
            live_weight         = prod_harvest.live_weight.weight;
            live_weight_ave     = prod_harvest.live_weight.average;
            live_weight_unit    = weight_unit;
            
            per_pig_weight_csv  = prod_harvest.live_weight.pp_csv;
        }
        
        
        let num_days            = 'N/A';
        if (prod_harvest.num_days){
            num_days = prod_harvest.num_days;
        }
        
        
        let html_buyer = '';
        
        if (prod_harvest.pig_buyer && prod_harvest.pig_buyer.name){
            html_buyer = `<span class="buyer-name">${prod_harvest.pig_buyer.name}</span>`;
        }
        
        
        const html = `
        <div class="card-harvest">
            <div class="card-harvest-header">
                <span class="harvest-date">${s_dt_harvest}</span>
                <span class="harvest-type-tag ${tag_class}">${harvest_tag}</span>
            </div>

            <div class="metrics-row live-only">
                <div class="pigs-block">
                    <span class="label">PIGS</span>
                    <span class="number">${num_pigs}</span>
                </div>
                <div class="live-slaughter">
                    <div class="metric-item">
                        <span class="label">LIVE</span>
                        <div class="value-block">
                            <span class="number">${live_weight}</span>
                            <span class="unit">${live_weight_unit}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-row">
                <div class="info-item">
                    <span class="label">AVE LIVE</span>
                    <span class="value">${live_weight_ave}<span class="unit">${weight_unit}</span></span>
                </div>
                <div class="info-item">
                    <span class="label">TYPE</span>
                    <span class="value">PIGLET</span>
                </div>
                <div class="info-item">
                    <span class="label">DAYS</span>
                    <span class="value">${num_days}</span>
                </div>
            </div>
            
            
            <div class="card-harvest-footer">
                ${html_buyer}
            </div>
        </div>
        `;
    
        return html;
    }
    
    
    
    this.getHtmlSaleLiveOrSlaughterPigs = function(data_harvest){
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const weight_unit       = acc_settings_ops.weight_unit;
        
        const prod_harvest      = data_harvest.prod_harvest;
        const date_harvest      = prod_harvest.date_harvest;
        const dt_harvest        = new Date(date_harvest);
        const s_dt_harvest      = formatDate(dt_harvest, FORMAT_COMPACT);
        
        const harvest_type_hid  = prod_harvest.harvest_type_hid;
        
        let harvest_tag         = 'SLAUGHTER';
        let live_weight         = 'N/A';
        let live_weight_ave     = 'N/A';
        let live_weight_unit    = '';
        
        
        let slaughter_weight        = 'N/A';
        let slaughter_weight_ave    = 'N/A';
        let slaughter_weight_unit   = '';
        
        
        let net_weight          = '';
        
        let price_per_unit_wt   = '';
        
        
        let per_pig_weight_csv  = null;
              
              
        const num_pigs      = prod_harvest.num_pigs;
        
        switch (harvest_type_hid) {
            case HARVEST_TYPE.PIGLETS_SALE: {
                harvest_tag         = 'PIGLETS SALE';
                break;
            }
            
            case HARVEST_TYPE.LIVE_PIGS_SALE: {
                harvest_tag         = 'LIVE PIGS';
                break;
            }
            
            default:{break;}
        }
        
        
        
        if (prod_harvest.live_weight && prod_harvest.live_weight.weight){
            live_weight         = prod_harvest.live_weight.weight;
            live_weight_ave     = prod_harvest.live_weight.average;
            live_weight_unit    = weight_unit; 
            
            per_pig_weight_csv  = prod_harvest.live_weight.pp_csv;
        }
        
        
        if (prod_harvest.slaughter_weight && prod_harvest.slaughter_weight.weight){
            slaughter_weight     = prod_harvest.slaughter_weight.weight;
            slaughter_weight_ave = prod_harvest.slaughter_weight.average;
            slaughter_weight_unit= weight_unit;
            
            net_weight          = prod_harvest.slaughter_weight.net_weight;
            
            price_per_unit_wt   = prod_harvest.slaughter_weight.price;
            
            per_pig_weight_csv  = prod_harvest.slaughter_weight.pp_csv;
        }
        else{
            if (prod_harvest.live_weight && prod_harvest.live_weight.weight){
                net_weight      = prod_harvest.live_weight.weight;
                price_per_unit_wt = prod_harvest.live_weight.price;
            }
        }
        
        
        let num_days            = 'N/A';
        if (prod_harvest.num_days){
            num_days = prod_harvest.num_days;
        }
        
        
        let s_price_per_unit_wt = '';
        if (price_per_unit_wt){
            s_price_per_unit_wt = moneyFormatter.format(price_per_unit_wt);
        }
        
        
        
        let s_pp_weight = '';
        if (per_pig_weight_csv) {
            const csv = per_pig_weight_csv.replaceAll(",", ", ");
            s_pp_weight = `Per Pig:  ${csv} ${weight_unit}`;
        }
        
        
        let s_net_sales     = '0.0';
        let s_sales_pp      = '0.0';
        let s_harvest_cost  = '0.0';
        if (prod_harvest.sales){
            s_net_sales = moneyFormatter.format(prod_harvest.sales.net_sales);
            s_sales_pp  = moneyFormatter.format(prod_harvest.sales.sales_pp);
            
            if (prod_harvest.sales.harvest_cost){
                s_harvest_cost = moneyFormatter.format(prod_harvest.sales.harvest_cost);
            }
        }
        
        let html_comments = '';
        
        if (prod_harvest.notes && prod_harvest.notes.length > 0){
            html_comments = ` 
            <div class="sales-row">
                <span class="sales-amount">${prod_harvest.notes}</span>
            </div>
            `;
        }
        
        
        let html_buyer = '';
        
        if (prod_harvest.pig_buyer && prod_harvest.pig_buyer.name){
            html_buyer = `<span class="buyer-name">${prod_harvest.pig_buyer.name}</span>`;
        }
        
        
        const html = `
        <!-- CARD 1 — slaughter with full details -->
        <div class="card-harvest">
            <div class="card-harvest-header">
                <span class="harvest-date">${s_dt_harvest}</span>
                <span class="harvest-type-tag">${harvest_tag}</span>
            </div>

            <!-- pigs, live, slaughter - labels ABOVE numbers -->
            <div class="metrics-row">
                <div class="pigs-block">
                    <span class="label">PIGS</span>
                    <span class="number">${num_pigs}</span>
                </div>
                
                <div class="metric-item">
                    <span class="label">LIVE</span>
                    <div class="value-block">
                        <span class="number">${live_weight}</span>
                        <span class="unit">${live_weight_unit}</span>
                    </div>
                </div>
                
                <div class="metric-item">
                    <span class="label">SLAUGHTER</span>
                    <div class="value-block">
                        <span class="number">${slaughter_weight}</span>
                        <span class="unit">${slaughter_weight_unit}</span>
                    </div>
                </div>
                
            </div>

            <!-- averages and days - labels ABOVE -->
            <div class="metrics-row">
                <div class="metric-item">
                    <span class="label">DAYS</span>
                    <div class="value-block">
                        <span class="number">${num_days}</span>
                    </div>
                </div>
                
                <div class="metric-item">
                    <span class="label">AVE LIVE</span>
                    <div class="value-block">
                        <span class="number">${live_weight_ave}</span> 
                        <span class="unit">${live_weight_unit}</span>
                    </div>
                </div>
                
                <div class="metric-item">
                    <span class="label">AVE SLTR</span>
                    <div class="value-block">
                        <span class="number">${slaughter_weight_ave}</span> 
                        <span class="unit">${slaughter_weight_unit}</span>
                    </div>
                </div>
                
            </div>

            <!-- weight details -->
            <div class="weight-panel">
                <div class="weight-row">
                    <span class="weight-label">Net weight</span>
                    <span class="weight-figure">${net_weight} ${weight_unit}</span>
                </div>
                <div class="weight-row">
                    <span class="weight-label">Price/${weight_unit}</span>
                    <span class="weight-figure">${s_price_per_unit_wt}</span>
                </div>
                <div class="per-pig-list">
                    ${s_pp_weight}
                </div>
            </div>

            <!-- sales -->
            <div class="sales-block">
                <div class="sales-row">
                    <span>Net sales</span>
                    <span class="sales-amount sales-total">${s_net_sales}</span>
                </div>
                
                <div class="sales-row">
                    <span>Per pig</span>
                    <span class="sales-amount">${s_sales_pp}</span>
                </div>
                
                <div class="sales-row">
                    <span>Harvest cost</span>
                    <span class="sales-amount">${s_harvest_cost}</span>
                </div>
                
                <!-- notes -->
                ${html_comments}
            </div>

            <!-- customer  at bottom -->
            <div class="card-harvest-footer">
                ${html_buyer}
            </div>
        </div>    
        `;
        
        return html;
    } 
    
    
    this.getHtmlSaleGiltBoar = function(data_harvest){
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const weight_unit       = acc_settings_ops.weight_unit;
        
        const prod_harvest      = data_harvest.prod_harvest;
        const date_harvest      = prod_harvest.date_harvest;
        const dt_harvest        = new Date(date_harvest);
        const s_dt_harvest      = formatDate(dt_harvest, FORMAT_COMPACT);
        
        const harvest_type_hid   = prod_harvest.harvest_type_hid;
        
        let harvest_tag         = '';
        let tag_class           = '';
        
        let s_gilt_boar         = '';
        
        
        
        if (harvest_type_hid == HARVEST_TYPE.PIGLETS_SALE){
            harvest_tag         = 'PIGLETS SALE';
            tag_class           = 'external';
            
            s_gilt_boar         = '';
        }
        
        
        if (harvest_type_hid == HARVEST_TYPE.INTERNAL_GILT_BOAR){
            harvest_tag         = 'INTERNAL';
            tag_class           = 'internal';
            
            s_gilt_boar         = 'GILT/BOAR';
        }
        
        if (harvest_type_hid == HARVEST_TYPE.BOAR_SALE) {
            harvest_tag         = 'BOAR SALE';
            tag_class           = 'external';
            
            s_gilt_boar         = 'BOAR';
        }

        if (harvest_type_hid == HARVEST_TYPE.GILT_SALE){
            harvest_tag         = 'GILT SALE';
            tag_class           = 'external';
            
            s_gilt_boar         = 'GILT';
        }
        
        
        
        
        const num_pigs      = prod_harvest.num_pigs;
        
        
        let live_weight         = 'N/A';
        let live_weight_ave     = 'N/A';
        let live_weight_unit    = '';
        
        let per_pig_weight_csv  = null;
        
        if (prod_harvest.live_weight && prod_harvest.live_weight.weight){
            live_weight         = prod_harvest.live_weight.weight;
            live_weight_ave     = prod_harvest.live_weight.average;
            live_weight_unit    = weight_unit;
            
            per_pig_weight_csv  = prod_harvest.live_weight.pp_csv;
        }
        
        
        let num_days            = 'N/A';
        if (prod_harvest.num_days){
            num_days = prod_harvest.num_days;
        }
        
        
        let html_buyer = '';
        
        if (prod_harvest.pig_buyer && prod_harvest.pig_buyer.name){
            html_buyer = `<span class="buyer-name">${prod_harvest.pig_buyer.name}</span>`;
        }
        
        
        let html_sales = '';
        if (harvest_type_hid == HARVEST_TYPE.BOAR_SALE ||
            harvest_type_hid == HARVEST_TYPE.GILT_SALE) {
            
            let s_net_sales     = '0.0';
            let s_sales_pp      = '0.0';
            let s_harvest_cost  = '0.0';
            if (prod_harvest.sales){
                s_net_sales = moneyFormatter.format(prod_harvest.sales.net_sales);
                s_sales_pp  = moneyFormatter.format(prod_harvest.sales.sales_pp);
                
                if (prod_harvest.sales.harvest_cost){
                    s_harvest_cost = moneyFormatter.format(prod_harvest.sales.harvest_cost);
                }
            }
            
            
            
            html_sales = `
            
            <!-- sales -->
            <div class="sales-block">
                <div class="sales-row">
                    <span>Net sales</span>
                    <span class="sales-amount sales-total">${s_net_sales}</span>
                </div>
                
                <div class="sales-row">
                    <span>Per pig</span>
                    <span class="sales-amount">${s_sales_pp}</span>
                </div>
                
                <div class="sales-row">
                    <span>Harvest cost</span>
                    <span class="sales-amount">${s_harvest_cost}</span>
                </div>

            </div>
            `;
        }
        
        
        let html_alt_info = '';
        
        if (prod_harvest.notes && prod_harvest.notes.length > 0){
            html_alt_info = `
            <div class="alt-info">
                ${prod_harvest.notes}
            </div>
            `;
        }
        
        
        
        const html = `
        <div class="card-harvest">
            <div class="card-harvest-header">
                <span class="harvest-date">${s_dt_harvest}</span>
                <span class="harvest-type-tag ${tag_class}">${harvest_tag}</span>
            </div>

            <div class="metrics-row live-only">
                <div class="pigs-block">
                    <span class="label">PIGS</span>
                    <span class="number">${num_pigs}</span>
                </div>
                <div class="live-slaughter">
                    <div class="metric-item">
                        <span class="label">LIVE</span>
                        <div class="value-block">
                            <span class="number">${live_weight}</span>
                            <span class="unit">${live_weight_unit}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-row">
                <div class="info-item">
                    <span class="label">AVE LIVE</span>
                    <span class="value">${live_weight_ave}<span class="unit">${weight_unit}</span></span>
                </div>
                <div class="info-item">
                    <span class="label">TYPE</span>
                    <span class="value">${s_gilt_boar}</span>
                </div>
                <div class="info-item">
                    <span class="label">DAYS</span>
                    <span class="value">${num_days}</span>
                </div>
            </div>
            
            ${html_sales}
            
            ${html_alt_info}
            <div class="card-harvest-footer">
                ${html_buyer}
            </div>
        </div>
        `;
    
        return html;
    }
    
    
    this.attachListeners = function(data_pig_prod, data_harvest, elem_card){
        const prod_status_id = parentObj.dataPigProd.pig_production.prod_status_id; 
        if (prod_status_id == PROD_STATUS.HARVESTED || prod_status_id == PROD_STATUS.CLOSED){
            // Cannot be edited;
            return;
        }
        
        
        
        const elem_tag = elem_card.querySelector('.harvest-type-tag');
        
        elem_tag.onclick = function(){
            let go_back_page_id = settings.parentPageId;
        
        
            const go_back_page = navigation.getPageContainer(go_back_page_id);
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    parentObj.onSuccessEditEntry,
                prod_harvest:           data_harvest, // this is entry to be edited
                go_back_page:           go_back_page   
            };
            navigation.pageProdHarvestAddEdit.beforeShow(data_pig_prod, options);
            
            
            const goto_page_id   = PAGE_ID.PROD_HARVEST_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        };
    }

    
}


