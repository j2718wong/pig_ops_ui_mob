// April 10, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {APPLICATION,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        PIG_PROD_TYPE}              from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';




export function ProdEntryWeanHistory(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-wean-history',
        elemDivContainer:       elemDivContainer
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;


    let elemIdTdSowName         = null;
    let elemIdTdDateBirth       = null;
    let elemIdTdDateWean        = null;
    let elemIdTdDaysSinceWean   = null;
    let elemIdTdNumPigsTotal    = null;
    let elemIdTdNumPigsFemale   = null;
    let elemIdTdNumPigsMale     = null;
    let elemIdTdNumPigsXSmall   = null;
    let elemIdTdDeadBeforeWean  = null;
    let elemIdTdTotalWeight     = null;
    let elemIdTdAvgWeight       = null;
    let elemIdTdWeightPerPig    = null;
    

    let elemTdSowName           = null;
    let elemTdDateBirth         = null;
    let elemTdDateWean          = null;
    let elemTdDaysSinceWean     = null;
    let elemTdNumPigsTotal      = null;
    let elemTdNumPigsFemale     = null;
    let elemTdNumPigsMale       = null;
    let elemTdNumPigsXSmall     = null;
    let elemTdDeadBeforeWean    = null;
    let elemTdTotalWeight       = null;
    let elemTdAvgWeight         = null;
    let elemTdWeightPerPig      = null;


    let curDataPigProd          = null;
    
    let dtCurrentDate           = null;
    

    this.init = function(){
       
    }
    
    
    this.render = function(){
       
    }
    
    
    this.getHtml = function(){
        elemIdTdSowName         = `${settings.uniqueKey}-history-sow-name`;
        elemIdTdDateBirth       = `${settings.uniqueKey}-history-date-birth`;
        elemIdTdDateWean        = `${settings.uniqueKey}-history-date-wean`;
        elemIdTdDaysSinceWean   = `${settings.uniqueKey}-history-days-since-wean`;
        elemIdTdNumPigsTotal    = `${settings.uniqueKey}-history-num-pigs-total`;
        elemIdTdNumPigsFemale   = `${settings.uniqueKey}-history-num-pigs-female`;
        elemIdTdNumPigsMale     = `${settings.uniqueKey}-history-num-pigs-male`;
        elemIdTdNumPigsXSmall   = `${settings.uniqueKey}-history-num-pigs-xsmall`;
        elemIdTdDeadBeforeWean  =`${settings.uniqueKey}-history-num-dead-before-wean`;
        elemIdTdTotalWeight     = `${settings.uniqueKey}-history-total-weight`;
        elemIdTdAvgWeight       = `${settings.uniqueKey}-history-avg-weight`;
        elemIdTdWeightPerPig    = `${settings.uniqueKey}-history-weight-per-pig`;
        
        let label_date_birth        = 'Date Birth';
        let label_date_wean         = 'Date Weaned';
        let label_days_since_wean   = 'Days Birth to Wean';
        let label_num_pigs_total    = 'Total Weaned Piglets';
        let label_num_pigs_female   = 'Female Piglets';
        let label_num_pigs_male     = 'Male Piglets';
        let label_num_pigs_xsmall   = 'Extra Small Piglets';
        let label_dead_before_wean  = 'Dead Before Wean';
        let label_total_weight      = 'Total Wean Weight';
        let label_avg_weight        = 'Average Weight';
        let label_weight_per_pig    = 'Weight Per Pig';
        
        const helper = navigation.managerTranslations.translationHelper;
        
        label_date_birth        = helper.getSimpleTranslation('weaning_history.labels.date_birth') || label_date_birth;
        label_date_wean         = helper.getSimpleTranslation('weaning_history.labels.date_wean') || label_date_wean;
        label_days_since_wean   = helper.getSimpleTranslation('weaning_history.labels.days_since_wean') || label_days_since_wean;
        label_num_pigs_total    = helper.getSimpleTranslation('weaning_history.labels.num_pigs_total') || label_num_pigs_total;
        label_num_pigs_female   = helper.getSimpleTranslation('weaning_history.labels.num_pigs_female') || label_num_pigs_female;
        label_num_pigs_male     = helper.getSimpleTranslation('weaning_history.labels.num_pigs_male') || label_num_pigs_male;
        label_num_pigs_xsmall   = helper.getSimpleTranslation('weaning_history.labels.num_pigs_xsmall') || label_num_pigs_xsmall;
        label_dead_before_wean  = helper.getSimpleTranslation('weaning_history.labels.dead_before_wean') || label_dead_before_wean;
        label_total_weight      = helper.getSimpleTranslation('weaning_history.labels.total_weight') || label_total_weight;
        label_avg_weight        = helper.getSimpleTranslation('weaning_history.labels.avg_weight') || label_avg_weight;
        label_weight_per_pig    = helper.getSimpleTranslation('weaning_history.labels.weight_per_pig') || label_weight_per_pig;
        
        const html = `
        <h2 class="tab-title">
            Weaning History
        </h2>
        
        <table class="data-table">
            <colgroup>
                <col style="width: 65%;">
                <col style="width: 35%;">
            </colgroup>
            
            <tbody>
                <tr>
                    <td>Sow</td>
                    <td id="${elemIdTdSowName}"></td>
                </tr>
            
                <tr>
                    <td>${label_date_birth}</td>
                    <td id="${elemIdTdDateBirth}"></td>
                </tr>
                
            
                <tr>
                    <td>${label_date_wean}</td>
                    <td id="${elemIdTdDateWean}"></td>
                </tr>
                
                <tr>
                    <td>${label_days_since_wean}</td>
                    <td id="${elemIdTdDaysSinceWean}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_pigs_total}</td>
                    <td id="${elemIdTdNumPigsTotal}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_pigs_female}</td>
                    <td id="${elemIdTdNumPigsFemale}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_pigs_male}</td>
                    <td id="${elemIdTdNumPigsMale}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_pigs_xsmall}</td>
                    <td id="${elemIdTdNumPigsXSmall}"></td>
                </tr>
                
                <tr>
                    <td>${label_dead_before_wean}</td>
                    <td id="${elemIdTdDeadBeforeWean}"></td>
                </tr>
                
                <tr>
                    <td>${label_total_weight}</td>
                    <td id="${elemIdTdTotalWeight}"></td>
                </tr>
                
                <tr>
                    <td>${label_avg_weight}</td>
                    <td id="${elemIdTdAvgWeight}"></td>
                </tr>
                
                <tr>
                    <td>${label_weight_per_pig}</td>
                    <td id="${elemIdTdWeightPerPig}"></td>
                </tr>
            </tbody>
        </table>
        `;
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemTdSowName           = elemDivContainer.querySelector('#' + elemIdTdSowName);
        elemTdDateBirth         = elemDivContainer.querySelector('#' + elemIdTdDateBirth);
        elemTdDateWean          = elemDivContainer.querySelector('#' + elemIdTdDateWean);
        elemTdDaysSinceWean     = elemDivContainer.querySelector('#' + elemIdTdDaysSinceWean);
        elemTdNumPigsTotal      = elemDivContainer.querySelector('#' + elemIdTdNumPigsTotal);
        elemTdNumPigsFemale     = elemDivContainer.querySelector('#' + elemIdTdNumPigsFemale);
        elemTdNumPigsMale       = elemDivContainer.querySelector('#' + elemIdTdNumPigsMale);
        elemTdNumPigsXSmall     = elemDivContainer.querySelector('#' + elemIdTdNumPigsXSmall);
        elemTdDeadBeforeWean    = elemDivContainer.querySelector('#' + elemIdTdDeadBeforeWean);
        elemTdTotalWeight       = elemDivContainer.querySelector('#' + elemIdTdTotalWeight);
        elemTdAvgWeight         = elemDivContainer.querySelector('#' + elemIdTdAvgWeight);
        elemTdWeightPerPig      = elemDivContainer.querySelector('#' + elemIdTdWeightPerPig);
    }
    
    
    this._processAfterHtmlRender = function(){
    }
    
    
    this._bindEventListeners = function(){
    }
    
    
    this._resetForm = function(){
        elemTdDateBirth.textContent = '';
        
        elemTdDateWean.textContent = '';      
        elemTdDaysSinceWean.textContent = ''; 
        elemTdNumPigsTotal.textContent = '';  
        elemTdNumPigsFemale.textContent = ''; 
        elemTdNumPigsMale.textContent = '';   
        elemTdNumPigsXSmall.textContent = ''; 
        elemTdDeadBeforeWean.textContent = '';
        elemTdTotalWeight.textContent = '';   
        elemTdAvgWeight.textContent = '';     
        elemTdWeightPerPig.textContent = '';  
    }
    
    
    this.show = function(data_pig_prod){
        this._resetForm();
        
        
        curDataPigProd = data_pig_prod;
        
        console.log(`curDataPigProd`);
        console.log(curDataPigProd);
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        thisObj.populateForm();
    }
    
    
    this.populateForm = function(){
        const weaning = curDataPigProd.weaning;
        const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
        const weight_unit = acc_settings_ops.weight_unit;
        
        const date_birth = curDataPigProd.birth.date_actual;
        
        
        elemTdSowName.innerHTML =  thisObj.getSowBoarReference(curDataPigProd.sow);
        
        // Date Birth
        elemTdDateBirth.textContent = formatDate(new Date(date_birth), 
                                        FORMAT_COMPACT);  
        
        
        let num_weaned_pigs = null;
        
        // Date Weaned
        if (weaning.date_weaning) {
            elemTdDateWean.textContent = formatDate(new Date(weaning.date_weaning), 
                                        FORMAT_COMPACT);  
            
            // Days since wean
            
            const birth_to_wean = thisObj.calculateNumDaysSinceBirth(date_birth,
                new Date(weaning.date_weaning), acc_settings_ops)
            
            elemTdDaysSinceWean.textContent = `${birth_to_wean} days`;
        }
        
        // Total piglets
        if (weaning.num_pigs) {
            elemTdNumPigsTotal.textContent = weaning.num_pigs;
            num_weaned_pigs = weaning.num_pigs;
        }
        else{
            if(weaning.num_pigs_f && weaning.num_pigs_m){
                num_weaned_pigs = weaning.num_pigs_f + weaning.num_pigs_m ;
                elemTdNumPigsTotal.textContent = num_weaned_pigs;
            }
        }
        
        // Female piglets
        if (weaning.num_pigs_f) {
            elemTdNumPigsFemale.textContent = weaning.num_pigs_f;
        }
        
        // Male piglets
        if (weaning.num_pigs_m) {
            elemTdNumPigsMale.textContent = weaning.num_pigs_m;
        }
        
        // Extra small piglets
        if (weaning.num_pigs_xsmall) {
            elemTdNumPigsXSmall.textContent = weaning.num_pigs_xsmall;
        }
        
        // Dead Before Wean
        if (num_weaned_pigs){
            let num_birth_pigs = curDataPigProd.birth.pigs_live_f + 
                                 curDataPigProd.birth.pigs_live_m;
            
            let num_dead = num_weaned_pigs - num_birth_pigs;
            
            if (num_dead > 0){
                elemTdDeadBeforeWean.textContent = num_dead;
            }
        }
        
        
        // Total weight
        if (weaning.weight_total) {
            elemTdTotalWeight.textContent = `${weaning.weight_total} ${weight_unit}`;
        }
        
        // Average weight
        if (weaning.weight_avg) {
            elemTdAvgWeight.textContent = `${weaning.weight_avg} ${weight_unit}`;
        }
        
        // Weight per pig (comma-separated list)
        if (weaning.weight_pp) {
            elemTdWeightPerPig.textContent = weaning.weight_pp;
        }
    }
}
