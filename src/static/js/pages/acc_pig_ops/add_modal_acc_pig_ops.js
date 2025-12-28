// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {ModelAccountPigOps}     from '../../models/model_acc_pig_ops.js'


export function AddModalAccPigOps(input_settings){
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        parentObj:              this
    }
    */
    var settings                = input_settings;
    
    var elemIdAddModalTitle     = null;
    var elemIdAddName           = null;
    var elemIdAddShortName      = null;
    var elemIdAddDescription    = null;
    var elemIdAddDayNumber      = null;
    var elemIdAddBtnSave        = null;
    
    
    var elemAddModalTitle       = null;
    var elemAddName             = null;
    var elemAddShortName        = null;
    var elemAddDescription      = null;
    var elemAddDayNumber        = null;
    var elemAddBtnSave          = null;
    
    var newEntry                = new ModelAccountPigOps();
    
    
    
    this.init = function(){}
    
    
    this.getHtml = function(){
        
        elemIdAddModalTitle     = 'acc-pig-ops-add-modal-title';
        elemIdAddName           = 'acc-pig-ops-add-name';
        elemIdAddShortName      = 'acc-pig-ops-add-short-name';
        elemIdAddDescription    = 'acc-pig-ops-add-description';
        elemIdAddDayNumber      = 'acc-pig-ops-add-day-number';
        elemIdAddBtnSave        = 'acc-pig-ops-add-save';
        
        
        
        
        const html =`
    <div class="modal fade" id="add-entry-acc-pig-ops-modal" tabindex="-1" aria-labelledby="add-entry-acc-pig-ops-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-plus me-2"></i><span id="add-entry-acc-pig-ops-modal-label">Add New Pig Operation</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <form id="addCardForm">
                        <div class="mb-3">
                            <label for="${elemIdAddName}" class="form-label">Operation Name *</label>
                            <input type="text" class="form-control" id="${elemIdAddName}" required>
                        </div>
                        <div class="mb-3">
                            <label for="${elemIdAddShortName}" class="form-label">Short Name *</label>
                            <input type="text" class="form-control" id="${elemIdAddShortName}" required>
                        </div>
                        <div class="mb-3">
                            <label for="${elemIdAddDescription}" class="form-label">Description *</label>
                            <textarea class="form-control" id="${elemIdAddDescription}" rows="3" required></textarea>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="${elemIdAddDayNumber}" class="form-label">Day Number *</label>
                            <input type="number" class="form-control" id="${elemIdAddDayNumber}" min="0" max="365" required>
                        </div>
                    
                        
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="${elemIdAddBtnSave}">
                        <i class="fas fa-save me-2"></i>Add Operation
                    </button>
                </div>
            </div>
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
        
        elemAddModalTitle       = document.getElementById(elemIdAddModalTitle);
        elemAddName             = document.getElementById(elemIdAddName);
        elemAddShortName        = document.getElementById(elemIdAddShortName);
        elemAddDescription      = document.getElementById(elemIdAddDescription);
        elemAddDayNumber        = document.getElementById(elemIdAddDayNumber);
        elemAddBtnSave          = document.getElementById(elemIdAddBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }

    
    this._bindEventListeners = function(){
        
    }
    
    
    // Reset add form
    this.addFormReset = function(){
        elemAddName.value       = '';
        elemAddShortName.value  = '';
        elemAddDescription.value = '';
        elemAddDayNumber.value  = '';
    }
}