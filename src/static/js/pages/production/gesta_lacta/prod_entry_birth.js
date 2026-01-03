// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {InsemDataSelect}        from './insem_data_select.js';




ProdEntryBirth.prototype = new PageViewBasic();
export function ProdEntryBirth(input_settings){
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
        
        elemIdDateExpected      = `pig-prod-birth-date-expected`;
        elemIdDateBirth         = `pig-prod-birth-date-birth`;
        elemIdGestationDays     = `pig-prod-birth-gestation-days`;
        
        elemIdNumFemale         = `pig-prod-birth-num-female`;
        elemIdNumMale           = `pig-prod-birth-num-male`;
        elemIdNumDead           = `pig-prod-birth-select-ai-show`;
        
        elemIdStaff             = `pig-prod-birth-staff`;
        elemIdStaffCount        = `pig-prod-birth-staff-count`;
        elemIdStaffAdd          = `pig-prod-birth-staff-count`;
        elemIdChkDoneByMe       = `pig-prod-birth-done-by-me`;
        
        
        elemIdBtnSave           = `pig-prod-birth-save`;
        
        
        
        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 class="tab-title">
        Birth Information
    </h2>
    
    <div class="warning-box" id="${elemIdCannotUpdate}" style="margin-bottom:10px;">
        Setting the Date Actual Birth will update this production entry from 
        Gestating Status to Lactating Status and will be removed from Production 
        Gestating List. Will be put in Production Lactating List. 
        <b>This cannot be undone.</b>
    </div>
    
    <div class="form-group-text">
        <label for="${elemIdDateExpected}" class="form-label">Date Expected</label>
        <span class="" id="${elemIdDateExpected}"></span>
    </div>
    
    <div class="form-group-date">
        <label for="${elemIdDateBirth}" class="form-label">Date Actual Birth</label>
        <input type="text" class="form-control" id="${elemIdDateBirth}">
        <div class="invalid-feedback">
            Please a valid date.
        </div>
        <div id="${elemIdGestationDays}" style="font-size: 14px; color: var(--text-light); margin-top: 5px;" >Gestation period: -- days</div>
    </div>
    
    <!-- Number of Female Piglets with plus/minus buttons -->
    <div class="form-group">
        <label class="form-label">
            <i class="fas fa-venus" style="color: var(--icon-pink);"></i>
            Number of Live Female Piglets
        </label>
        <div class="number-input-group">
            <button class="number-btn minus" data-target="${elemIdNumFemale}">-</button>
            <input type="number" class="form-control number-input" id="${elemIdNumFemale}" value="0" min="0">
            <button class="number-btn plus" data-target="${elemIdNumFemale}">+</button>
        </div>
    </div>
    
    <!-- Number of Male Piglets with plus/minus buttons -->
    <div class="form-group">
        <label class="form-label">
            <i class="fas fa-mars" style="color: var(--icon-blue);"></i>
            Number of Live Male Piglets
        </label>
        <div class="number-input-group">
            <button class="number-btn minus" data-target="${elemIdNumMale}">-</button>
            <input type="number" class="form-control number-input" id="${elemIdNumMale}" value="0" min="0">
            <button class="number-btn plus" data-target="${elemIdNumMale}">+</button>
        </div>
    </div>
    
    <!-- Number of Stillbirth Piglets with plus/minus buttons -->
    <div class="form-group">
        <label class="form-label">Number of Stillbirth Piglets</label>
        <div class="number-input-group">
            <button class="number-btn minus" data-target="${elemIdNumDead}">-</button>
            <input type="number" class="form-control number-input" id="${elemIdNumDead}" value="0" min="0">
            <button class="number-btn plus" data-target="${elemIdNumDead}">+</button>
        </div>
    </div>
            
    <!-- 7. Staff -->
    <div class="form-group-select">
        <label for="${elemIdStaff}" class="form-label">
            Staff Member <span class="entries-count" id=${elemIdStaffCount}></span>
        </label>
        
        <div class="input-group" >
            <select class="form-select" id="${elemIdStaff}">
                <option value="-1" selected disabled>No Entries</option>
            </select>
            <button class="btn" type="button" id="${elemIdStaffAdd}">
                <i class="bi bi-plus"></i> New
            </button>
        </div>
        
        <div class="invalid-feedback">
            Need to select if not done by you.
        </div>
        
        <!-- Done by Me Checkbox -->
        <div id="doneByMeContainer" class="checkbox-group">
            <input type="checkbox" id="${elemIdChkDoneByMe}">
            <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                <i class="fas fa-user-check checkbox-icon"></i>
                Done by Me
            </label>
        </div>
        
        <div class="form-text">Who did the operation.</div>
    
    </div>

    <button class="btn btn-primary" id="${elemIdBtnSave}">Save Changes</button>

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