// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {InsemDataSelect}        from './insem_data_select.js';




ProdEntryPigOps.prototype = new PageViewBasic();
export function ProdEntryPigOps(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    var elemIdContentContainer  = null;
    
    var elemIdCannotUpdate      = null;
    
    var elemIdDateExpected      = null;
    var elemIdDateBirth         = null;
    var elemIdGestationDays     = null;
    
    var elemIdNumFemale         = null;
    var elemIdNumMale           = null;
    var elemIdNumDead           = null;
    
    var elemIdStaff             = null;
    var elemIdStaffCount        = null;
    var elemIdStaffAdd          = null;
    var elemIdChkDoneByMe       = null;
    
    var elemIdBtnSave           = null;
    
    
    
    var elemContentContainer    = null;
    
    var elemCannotUpdate        = null;
    
    var elemDateExpected        = null;
    var elemDateBirth           = null;
    var elemGestationDays       = null;
    
    var elemNumFemale           = null;
    var elemNumMale             = null;
    var elemNumDead             = null;
    
    var elemStaff               = null;
    var elemStaffCount          = null;
    var elemStaffAdd            = null;
    var elemChkDoneByMe         = null;
    
    var elemBtnSave             = null;
    
    
   
    var staffList               = null; 
    
    const insemDataSelect       = new InsemDataSelect();
    

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.getHtml = function(){
        
        elemIdContentContainer  = `pig-prod-birth-content`;
                
        elemIdCannotUpdate      = `pig-prod-birth-cannot-update`;
        
       
        
        elemIdBtnSave           = `pig-prod-birth-save`;
        
        
        
        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 style="margin-bottom: 10px; color: var(--corporate-blue);">
        Scheduled Pig Operations
    </h2>
    
    
</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemContentContainer    = document.getElementById(elemIdContentContainer);
        
        elemCannotUpdate        = document.getElementById(elemIdCannotUpdate);
        
        elemDateExpected        = document.getElementById(elemIdDateExpected);
        elemDateBirth           = document.getElementById(elemIdDateBirth);
        elemGestationDays       = document.getElementById(elemIdGestationDays);
        
        elemNumFemale           = document.getElementById(elemIdNumFemale);
        elemNumMale             = document.getElementById(elemIdNumMale);
        elemNumDead             = document.getElementById(elemIdNumDead);
        
        elemStaff               = document.getElementById(elemIdStaff);
        elemStaffCount          = document.getElementById(elemIdStaffCount);
        elemStaffAdd            = document.getElementById(elemIdStaffAdd);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);


        elemBtnSave             = document.getElementById(elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateBirth).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
    }
    
    
    this._bindEventListeners = function(){
        // Plus/Minus buttons for piglet counts
        const plusButtons   = elemContentContainer.querySelectorAll('.number-btn.plus');
        const minusButtons  = elemContentContainer.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                input.value = value + 1;
                input.dispatchEvent(new Event('change'));
            });
        });
        
        minusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                if (value > 0) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
        
    }
    
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        insemDataSelect.setDataStaffList(staffList, elemStaff);
    }
    
    
    this.show = function(data_pig_prod, options){
        const data_sow = data_pig_prod.sow;
        var sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length >0)){
            sow_reference = data_sow.name;
            
            if (data_sow.number != null) {
                sow_reference += ` (${data_sow.number})`;
            }
            
        }
        else{
            sow_reference = data_sow.number;
        }
        
        
        elemSow.textContent = sow_reference;
        
        
        
        const insemination  = data_pig_prod.insemination;
        
        const dt_insem      = new Date(insemination.insem_date);
        $('#'+elemIdDateMating).datepicker('setDate', dt_insem);
        
    }
    
    

}