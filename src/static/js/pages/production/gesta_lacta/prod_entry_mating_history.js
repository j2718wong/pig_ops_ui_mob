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




export function ProdEntryMatingHistory(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-mating-history',
        elemDivContainer:       elemDivContainer
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;

    let elemIdViewBoarMating    = null;
    let elemIdViewAiExternal    = null;

    let elemIdTdBoarSowName     = null;  
    let elemIdTdBoarDateMating  = null;  
    let elemIdTdBoarInsemType   = null;  
    let elemIdTdBoarBoarName    = null;  
    let elemIdTdBoarInsemCost   = null;  
    let elemIdTdBoarNotes       = null;  
    let elemIdTdBoarStaff       = null;  
           
    let elemIdTdAiExtSowName    = null;  
    let elemIdTdAiExtDateMating = null;  
    let elemIdTdAiExtInsemType  = null;  
    let elemIdTdAiExtSemenSupplier = null;
    let elemIdTdAiExtSemenType  = null;  
    let elemIdTdAiExtSemenCost  = null;  
    let elemIdTdAiExtInsemCost  = null;  
    let elemIdTdAiExtNotes      = null;  
    let elemIdTdAiExtStaff      = null;  
    
    
    let elemViewBoarMating      = null;
    let elemViewAiExternal      = null;
    
    let elemTdBoarSowName       = null;  
    let elemTdBoarDateMating    = null;  
    let elemTdBoarInsemType     = null;  
    let elemTdBoarBoarName      = null;  
    let elemTdBoarInsemCost     = null;  
    let elemTdBoarNotes         = null;  
    let elemTdBoarStaff         = null;  
                           
    let elemTdAiExtSowName      = null;  
    let elemTdAiExtDateMating   = null;  
    let elemTdAiExtInsemType    = null;  
    let elemTdAiExtSemenSupplier= null;
    let elemTdAiExtSemenType    = null;  
    let elemTdAiExtSemenCost    = null;  
    let elemTdAiExtInsemCost    = null;  
    let elemTdAiExtNotes        = null;  
    let elemTdAiExtStaff        = null;  
    

    let curDataPigProd          = null;
    
    let dtCurrentDate           = null;
    

    this.init = function(){
       
    }
    
    
    this.render = function(){
       
    }
    
    
    this.getHtml = function(){
        elemIdViewBoarMating        = `${settings.uniqueKey}-boar-view`;
        elemIdViewAiExternal        = `${settings.uniqueKey}-ai-ext-view`;
        
        elemIdTdBoarSowName         = `${settings.uniqueKey}-boar-sow-name`;
        elemIdTdBoarDateMating      = `${settings.uniqueKey}-boar-date-mating`;
        elemIdTdBoarInsemType       = `${settings.uniqueKey}-boar-insem-type`;
        elemIdTdBoarBoarName        = `${settings.uniqueKey}-boar-boar-name`;
        elemIdTdBoarInsemCost       = `${settings.uniqueKey}-boar-insem-cost`;
        elemIdTdBoarNotes           = `${settings.uniqueKey}-boar-notes`;
        elemIdTdBoarStaff           = `${settings.uniqueKey}-boar-staff`;
        
        elemIdTdAiExtSowName        = `${settings.uniqueKey}-ai-ext-sow-name`;
        elemIdTdAiExtDateMating     = `${settings.uniqueKey}-ai-ext-date-mating`;
        elemIdTdAiExtInsemType      = `${settings.uniqueKey}-ai-ext-insem-type`;
        elemIdTdAiExtSemenSupplier  = `${settings.uniqueKey}-ai-ext-semen-supplier`;
        elemIdTdAiExtSemenType      = `${settings.uniqueKey}-ai-ext-semen-type`;
        elemIdTdAiExtSemenCost      = `${settings.uniqueKey}-ai-ext-semen-cost`;
        elemIdTdAiExtInsemCost      = `${settings.uniqueKey}-ai-ext-insem-cost`;
        elemIdTdAiExtNotes          = `${settings.uniqueKey}-ai-ext-notes`;
        elemIdTdAiExtStaff          = `${settings.uniqueKey}-ai-ext-staff`;
        
        
        
        let label_sow            = 'Sow';
        let label_date_mating    = 'Date Mating';
        let label_insem_type     = 'Insemination Type';
        let label_boar_name      = 'Boar Name';
        let label_semen_supplier = 'Semen Supplier';
        let label_semen_type     = 'Semen Type';
        let label_semen_cost     = 'Semen Cost';
        let label_insem_cost     = 'Other Cost';
        let label_notes          = 'Notes';
        let label_staff          = 'Attending Staff';
        
        const helper = navigation.managerTranslations.translationHelper;
        
        label_sow            = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        label_date_mating    = helper.getSimpleTranslation('prod_entry_mating.labels.date_mating') || label_date_mating;
        label_insem_type     = helper.getSimpleTranslation('prod_entry_mating.labels.insem_type') || label_insem_type;
        label_boar_name      = helper.getSimpleTranslation('prod_entry_mating.labels.boar_name') || label_boar_name;
        label_semen_supplier = helper.getSimpleTranslation('prod_entry_mating.labels.semen_supplier') || label_semen_supplier;
        label_semen_type     = helper.getSimpleTranslation('prod_entry_mating.labels.semen_type') || label_semen_type;
        label_semen_cost     = helper.getSimpleTranslation('prod_entry_mating.labels.semen_cost') || label_semen_cost;
        label_insem_cost     = helper.getSimpleTranslation('prod_entry_mating.labels.other_cost') || label_insem_cost;
        label_notes          = helper.getSimpleTranslation('prod_entry_mating.labels.notes') || label_notes;
        label_staff          = helper.getSimpleTranslation('prod_entry_mating.labels.staff') || label_staff;
        
        const html = `
        <h2 class="tab-title">
            Mating History
        </h2>
        
        <table class="data-table">
            <colgroup>
                <col style="width: 65%;">
                <col style="width: 35%;">
            </colgroup>
            
            <!--Used for Boar Mating and AI Internal -->
            <tbody id="${elemIdViewBoarMating}">
                <tr>
                    <td>${label_sow}</td>
                    <td id="${elemIdTdBoarSowName}"></td>
                </tr>
                
                <tr>
                    <td>${label_date_mating}</td>
                    <td id="${elemIdTdBoarDateMating}"></td>
                </tr>
                
                <tr>
                    <td>${label_insem_type}</td>
                    <td id="${elemIdTdBoarInsemType}"></td>
                </tr>
                
                <tr>
                    <td>${label_boar_name}</td>
                    <td id="${elemIdTdBoarBoarName}"></td>
                </tr>
                
                <tr>
                    <td>${label_insem_cost}</td>
                    <td id="${elemIdTdBoarInsemCost}"></td>
                </tr>
                
                <tr>
                    <td>${label_notes}</td>
                    <td id="${elemIdTdBoarNotes}"></td>
                </tr>
                
                <tr>
                    <td>${label_staff}</td>
                    <td id="${elemIdTdBoarStaff}"></td>
                </tr>
            </tbody>
            
            
            <!--Used for AI External -->
            <tbody id="${elemIdViewAiExternal}">
                <tr>
                    <td>${label_sow}</td>
                    <td id="${elemIdTdAiExtSowName}"></td>
                </tr>
                
                <tr>
                    <td>${label_date_mating}</td>
                    <td id="${elemIdTdAiExtDateMating}"></td>
                </tr>
                
                <tr>
                    <td>${label_insem_type}</td>
                    <td id="${elemIdTdAiExtInsemType}"></td>
                </tr>
                
                <tr>
                    <td>${label_semen_supplier}</td>
                    <td id="${elemIdTdAiExtSemenSupplier}"></td>
                </tr>
                
                <tr>
                    <td>${label_semen_type}</td>
                    <td id="${elemIdTdAiExtSemenType}"></td>
                </tr>
                
                <tr>
                    <td>${label_semen_cost}</td>
                    <td id="${elemIdTdAiExtSemenCost}"></td>
                </tr>
                
                
                <tr>
                    <td>${label_insem_cost}</td>
                    <td id="${elemIdTdAiExtInsemCost}"></td>
                </tr>
                
                <tr>
                    <td>${label_notes}</td>
                    <td id="${elemIdTdAiExtNotes}"></td>
                </tr>
                
                <tr>
                    <td>${label_staff}</td>
                    <td id="${elemIdTdAiExtStaff}"></td>
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
        elemViewBoarMating          = elemDivContainer.querySelector('#' + elemIdViewBoarMating);
        elemViewAiExternal          = elemDivContainer.querySelector('#' + elemIdViewAiExternal);
        
        elemTdBoarSowName           = elemDivContainer.querySelector('#' + elemIdTdBoarSowName);
        elemTdBoarDateMating        = elemDivContainer.querySelector('#' + elemIdTdBoarDateMating);
        elemTdBoarInsemType         = elemDivContainer.querySelector('#' + elemIdTdBoarInsemType);
        elemTdBoarBoarName          = elemDivContainer.querySelector('#' + elemIdTdBoarBoarName);
        elemTdBoarInsemCost         = elemDivContainer.querySelector('#' + elemIdTdBoarInsemCost);
        elemTdBoarNotes             = elemDivContainer.querySelector('#' + elemIdTdBoarNotes);
        elemTdBoarStaff             = elemDivContainer.querySelector('#' + elemIdTdBoarStaff);
        
        elemTdAiExtSowName          = elemDivContainer.querySelector('#' + elemIdTdAiExtSowName);
        elemTdAiExtDateMating       = elemDivContainer.querySelector('#' + elemIdTdAiExtDateMating);
        elemTdAiExtInsemType        = elemDivContainer.querySelector('#' + elemIdTdAiExtInsemType);
        elemTdAiExtSemenSupplier    = elemDivContainer.querySelector('#' + elemIdTdAiExtSemenSupplier);
        elemTdAiExtSemenType        = elemDivContainer.querySelector('#' + elemIdTdAiExtSemenType);
        elemTdAiExtSemenCost        = elemDivContainer.querySelector('#' + elemIdTdAiExtSemenCost);
        elemTdAiExtInsemCost        = elemDivContainer.querySelector('#' + elemIdTdAiExtInsemCost);
        elemTdAiExtNotes            = elemDivContainer.querySelector('#' + elemIdTdAiExtNotes);
        elemTdAiExtStaff            = elemDivContainer.querySelector('#' + elemIdTdAiExtStaff);
    }
    
    
    this._processAfterHtmlRender = function(){
    }
    
    
    this._bindEventListeners = function(){
    }
    
    
    this._resetForm = function(){
        elemTdBoarSowName.textContent       = '';
        elemTdBoarDateMating.textContent    = '';
        elemTdBoarInsemType.textContent     = '';
        elemTdBoarBoarName.textContent      = '';
        elemTdBoarInsemCost.textContent     = '';
        elemTdBoarNotes.textContent         = '';
        elemTdBoarStaff.textContent         = '';
        
        
        elemTdAiExtSowName.textContent      = '';
        elemTdAiExtDateMating.textContent   = '';
        elemTdAiExtInsemType.textContent    = '';
        elemTdAiExtSemenSupplier.textContent= '';
        elemTdAiExtSemenType.textContent    = '';
        elemTdAiExtSemenCost.textContent    = '';
        elemTdAiExtInsemCost.textContent    = '';
        elemTdAiExtNotes.textContent        = '';
        elemTdAiExtStaff.textContent        = '';
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
        const insemination = curDataPigProd.insemination;
        const sow = curDataPigProd.sow;
        
        // Get the two tbody elements
        const viewBoar  = elemViewBoarMating;
        const viewAiExt = elemViewAiExternal;
        
        // Hide both views first
        if (viewBoar) viewBoar.style.display = 'none';
        if (viewAiExt) viewAiExt.style.display = 'none';
        
        switch (insemination.insem_type) {
            case 'B':  // Boar Mating
            case 'AI_N': { // AI Internal (also uses boar view)
                // Show boar view
                if (viewBoar) viewBoar.style.display = '';
                
                // Sow name
                if (sow) {
                    elemTdBoarSowName.innerHTML = thisObj.getSowBoarReference(sow);
                }
                
                // Date Mating
                if (insemination.insem_date) {
                    const dt_insem = new Date(insemination.insem_date);
                    const s_date_insem = formatDate(dt_insem, FORMAT_COMPACT);
                    
                    elemTdBoarDateMating.textContent = s_date_insem;
                }
                
                // Insemination Type
                if (insemination.insem_type === 'B') {
                    elemTdBoarInsemType.textContent = 'Boar Mating';
                } else {
                    elemTdBoarInsemType.textContent = 'AI - Internal';
                }
                
                // Boar Name
                let boarName = '';
                if (insemination.insem_type === 'B' && insemination.boar) {
                    boarName = getSowBoarReference(insemination.boar);
                } else if (insemination.insem_type === 'AI_N' && insemination.ai && insemination.ai.internal_boar) {
                    boarName = getSowBoarReference(insemination.ai.internal_boar);
                }
                elemTdBoarBoarName.textContent = boarName || '--';
                
                // Other Cost (Insemination Cost)
                if (insemination.insem_cost && insemination.insem_cost > 0) {
                    const formatter = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    elemTdBoarInsemCost.textContent = `${formatter.format(insemination.insem_cost)}`;
                }
                
                // Notes
                if (insemination.insem_notes) {
                    elemTdBoarNotes.textContent = insemination.insem_notes;
                }
                
                // Staff
                if (insemination.insem_staff_name) {
                    elemTdBoarStaff.textContent = insemination.insem_staff_name;
                }
                break;
            }
            
            case 'AI_X': {  // AI External
                // Show AI external view
                if (viewAiExt) viewAiExt.style.display = '';
                
                // Sow name
                if (sow) {
                    elemTdAiExtSowName.innerHTML = thisObj.getSowBoarReference(sow);
                }
                
                // Date Mating
                if (insemination.insem_date) {
                    const dt_insem = new Date(insemination.insem_date);
                    const s_date_insem = formatDate(dt_insem, FORMAT_COMPACT);
                    
                    elemTdAiExtDateMating.textContent = s_date_insem;
                }
                
                // Insemination Type
                elemTdAiExtInsemType.textContent = 'AI - External';
                
                // Semen Supplier
                if (insemination.ai && insemination.ai.semen_supplier) {
                    elemTdAiExtSemenSupplier.textContent = insemination.ai.semen_supplier.name || '--';
                }
                
                // Semen Type
                if (insemination.ai && insemination.ai.semen_supplier && 
                    insemination.ai.semen_supplier.semen) {
                    elemTdAiExtSemenType.textContent = insemination.ai.semen_supplier.semen.name || '--';
                }
                
                // Semen Cost
                if (insemination.ai && insemination.ai.semen_cost) {
                    const formatter = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    elemTdAiExtSemenCost.textContent = `${formatter.format(insemination.ai.semen_cost)}`;
                }
                
                // Other Cost (Insemination Cost)
                if (insemination.insem_cost && insemination.insem_cost > 0) {
                    const formatter = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    elemTdAiExtInsemCost.textContent = `${formatter.format(insemination.insem_cost)}`;
                }
                
                // Notes
                if (insemination.insem_notes) {
                    elemTdAiExtNotes.textContent = insemination.insem_notes;
                }
                
                // Staff
                if (insemination.insem_staff_name) {
                    elemTdAiExtStaff.textContent = insemination.insem_staff_name;
                }
                break;
            }
        }
    }
}
