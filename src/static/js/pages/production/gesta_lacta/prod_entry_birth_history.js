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




export function ProdEntryBirthHistory(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-birth-history',
        elemDivContainer:       elemDivContainer
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;


    let elemIdTdSowName         = null;
    let elemIdTdDateExpected    = null;
    let elemIdTdDateActual      = null;
    let elemIdTdGestationDays   = null;
    let elemIdTdNumPigsFemale   = null;
    let elemIdTdNumPigsMale     = null;
    let elemIdTdNumPigsTotal    = null;
    let elemIdTdNumDeadBirth    = null;
    let elemIdTdBirthStaff      = null;
    

    let elemTdSowName           = null;
    let elemTdDateExpected      = null;
    let elemTdDateActual        = null;
    let elemTdGestationDays     = null;
    let elemTdNumPigsFemale     = null;
    let elemTdNumPigsMale       = null;
    let elemTdNumPigsTotal      = null;
    let elemTdNumDeadBirth      = null;
    let elemTdBirthStaff        = null;


    let curDataPigProd          = null;
    
    let dtCurrentDate           = null;
    

    this.init = function(){
       
    }
    
    
    this.render = function(){
       
    }
    
    
    this.getHtml = function(){
        elemIdTdSowName         = `${settings.uniqueKey}-history-sow-name`;
        elemIdTdDateExpected    = `${settings.uniqueKey}-history-date-expected`;
        elemIdTdDateActual      = `${settings.uniqueKey}-history-date-actual`;
        elemIdTdGestationDays   = `${settings.uniqueKey}-history-gestation-days`;
        elemIdTdNumPigsFemale   = `${settings.uniqueKey}-history-num-pigs-female`;
        elemIdTdNumPigsMale     = `${settings.uniqueKey}-history-num-pigs-male`;
        elemIdTdNumPigsTotal    = `${settings.uniqueKey}-history-num-pigs-total`;
        elemIdTdNumDeadBirth    = `${settings.uniqueKey}-history-num-dead-birth`;
        elemIdTdBirthStaff      = `${settings.uniqueKey}-history-birth-staff`;
        
        let label_sow               = 'Sow';
        let label_date_expected     = 'Date Expected';
        let label_date_actual       = 'Date Actual';
        let label_gestation_days    = 'Gestation Days';
        
        let label_num_live_total    = 'Total Live Birth';
        let label_num_live_female   = 'Number of Live Female Piglets';
        let label_num_live_male     = 'Number of Live Male Piglets';
        let label_num_still_birth   = 'Number of Stillbirth Piglets';
        
        
        let label_birth_staff       = 'Attending Staff';
        
        const helper = navigation.managerTranslations.translationHelper;
        
        label_sow               = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        
        label_date_expected     = helper.getSimpleTranslation('prod_entry_birth.labels.date_expected') || label_date_expected;
        label_date_actual       = helper.getSimpleTranslation('prod_entry_birth.labels.date_birth') || label_date_actual;
        label_gestation_days    = helper.getSimpleTranslation('prod_entry_birth.labels.gestation_days') || label_gestation_days;
        
        label_num_live_total    = helper.getSimpleTranslation('prod_entry_birth.labels.num_live_total') || label_num_live_total;
        label_num_live_female   = helper.getSimpleTranslation('prod_entry_birth.labels.num_live_female') || label_num_live_female;
        label_num_live_male     = helper.getSimpleTranslation('prod_entry_birth.labels.num_live_male') || label_num_live_male;
        label_num_still_birth   = helper.getSimpleTranslation('prod_entry_birth.labels.num_still_birth') || label_num_still_birth;
        
        
        label_birth_staff       = helper.getSimpleTranslation('prod_entry_birth.labels.select_staff') || label_birth_staff;
        
        const html = `
        <h2 class="tab-title">
            Birth History
        </h2>
        
        <table class="data-table">
            <colgroup>
                <col style="width: 65%;">
                <col style="width: 35%;">
            </colgroup>
            
            <tbody>
                <tr>
                    <td>${label_sow}</td>
                    <td id="${elemIdTdSowName}"></td>
                </tr>
                
                <tr>
                    <td>${label_date_expected}</td>
                    <td id="${elemIdTdDateExpected}"></td>
                </tr>
                
                <tr>
                    <td>${label_date_actual}</td>
                    <td id="${elemIdTdDateActual}"></td>
                </tr>
                
                <tr>
                    <td>${label_gestation_days}</td>
                    <td id="${elemIdTdGestationDays}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_live_total}</td>
                    <td id="${elemIdTdNumPigsTotal}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_live_female}</td>
                    <td id="${elemIdTdNumPigsFemale}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_live_male}</td>
                    <td id="${elemIdTdNumPigsMale}"></td>
                </tr>
                
                <tr>
                    <td>${label_num_still_birth}</td>
                    <td id="${elemIdTdNumDeadBirth}"></td>
                </tr>
                
                <tr>
                    <td>${label_birth_staff}</td>
                    <td id="${elemIdTdBirthStaff}"></td>
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
        elemTdDateExpected      = elemDivContainer.querySelector('#' + elemIdTdDateExpected);
        elemTdDateActual        = elemDivContainer.querySelector('#' + elemIdTdDateActual);
        elemTdGestationDays     = elemDivContainer.querySelector('#' + elemIdTdGestationDays);
        elemTdNumPigsFemale     = elemDivContainer.querySelector('#' + elemIdTdNumPigsFemale);
        elemTdNumPigsMale       = elemDivContainer.querySelector('#' + elemIdTdNumPigsMale);
        elemTdNumPigsTotal      = elemDivContainer.querySelector('#' + elemIdTdNumPigsTotal);
        elemTdNumDeadBirth      = elemDivContainer.querySelector('#' + elemIdTdNumDeadBirth);
        elemTdBirthStaff        = elemDivContainer.querySelector('#' + elemIdTdBirthStaff);
    }
    
    
    this._processAfterHtmlRender = function(){
    }
    
    
    this._bindEventListeners = function(){
    }
    
    
    this._resetForm = function(){
        elemTdSowName.textContent       = '';
        elemTdDateExpected.textContent  = '';
        elemTdDateActual.textContent    = '';
        elemTdGestationDays.textContent = '';
        elemTdNumPigsFemale.textContent = '';
        elemTdNumPigsMale.textContent   = '';
        elemTdNumPigsTotal.textContent  = '';
        elemTdNumDeadBirth.textContent  = '';
        elemTdBirthStaff.textContent    = '';
    }
    
    
    this.show = function(data_pig_prod){
        this._resetForm();
        
        curDataPigProd = data_pig_prod;
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        thisObj.populateForm();
    }
    
    
    this.populateForm = function(){
        const birth = curDataPigProd.birth;
        
        // Sow name
        if (curDataPigProd.sow) {
            elemTdSowName.innerHTML = thisObj.getSowBoarReference(curDataPigProd.sow);
        }
        
        // Date Expected
        if (birth.date_expected) {
            elemTdDateExpected.textContent = formatDate(new Date(birth.date_expected), 
                                            FORMAT_COMPACT);
        }
        
        // Date Actual
        if (birth.date_actual) {
            elemTdDateActual.textContent = formatDate(new Date(birth.date_actual), 
                                            FORMAT_COMPACT);
        }
        
        // Gestation Days
        if (birth.num_days_actual) {
            elemTdGestationDays.textContent = `${birth.num_days_actual} days`;
        }
        
        // Total live piglets
        let totalLive = 0;
        if (birth.pigs_live_f) {
            elemTdNumPigsFemale.textContent = birth.pigs_live_f;
            totalLive += birth.pigs_live_f;
        }
        if (birth.pigs_live_m) {
            elemTdNumPigsMale.textContent = birth.pigs_live_m;
            totalLive += birth.pigs_live_m;
        }
        if (totalLive > 0) {
            elemTdNumPigsTotal.textContent = totalLive;
        }
        
        // Stillbirth
        if (birth.num_dead_at_birth) {
            elemTdNumDeadBirth.textContent = birth.num_dead_at_birth;
        }
        
        // Birth staff
        if (birth.birth_staff_name) {
            elemTdBirthStaff.textContent = birth.birth_staff_name;
        }
    }
}
