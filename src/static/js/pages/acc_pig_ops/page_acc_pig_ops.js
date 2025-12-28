// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_OPERATION_TYPE}         from '../../constants.js';

import {TextTranslation}            from '../common/translation.js';

import {TRANSLATION_PAGE_ACC_PIG_OPS}   from '../../translations/page_acc_pig_ops_i8n.js'


export function PageAccPigOps(){
    const thisObj                   = this;

    // This is needed as ths will be first element to be rendered
    var elemDivContainer            = document.getElementById('container-acc-pig-ops');
    
    var elemIdPageTitle             = null;
    var elemIdPigOpsInfo            = null;
    
    var elemIdBtnAddEntryShow       = null;
    var elemIdMobileContainer       = null;
    var elemIdTableContainer        = null;
    
    var elemIdAddName               = null;
    var elemIdAddShortName          = null;
    var elemIdAddDescription        = null;
    var elemIdAddDayNumber          = null;
    var elemIdAddBtnSave            = null;
    
    
    var elemIdEditName              = null;
    var elemIdEditShortName         = null;
    var elemIdEditDescription       = null;
    var elemIdEditDayNumber         = null;
    var elemIdEditBtnSave           = null;
    var elemIdEditBtnDelete         = null;
    
    
    var elemPageTitle               = null;
    var elemPigOpsInfo              = null;
    
    var elemBtnAddEntryShow         = null;
    var elemMobileContainer         = null;
    var elemTableContainer          = null;
    
    var elemAddName                 = null;
    var elemAddShortName            = null;
    var elemAddDescription          = null;
    var elemAddDayNumber            = null;
    var elemAddBtnSave              = null;
    
    
    var elemEditName                = null;
    var elemEditShortName           = null;
    var elemEditDescription         = null;
    var elemEditDayNumber           = null;
    var elemEditBtnSave             = null;
    var elemEditBtnDelete           = null;
    
    
    
    var textTranslation             = new TextTranslation();
    var curUserLanguageKey          = 'en';
    
    
    var dataAccGestatingOps         = null;
    var dataAccLactatingPigletOps   = null;
    var dataAccLactatingSowOps      = null;
    var dataAccGiltOps              = null;
    
    var curAccPigOpsType            = null;
    var curAccPigOpsData            = null;
    
    
    
    
    
    
    
    this.init = function(){
        textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdPageTitle         = 'page-title-acc-pig-ops';
        elemIdPigOpsInfo        = 'page-info-acc-pig-ops';
        
        elemIdBtnAddEntryShow   = 'add-entry-acc-pig-ops-show';
        elemIdMobileContainer   = 'mobile-container-acc-pig-ops';
        elemIdTableContainer    = 'table-container-acc-pig-ops';
        
        elemIdAddName           = 'acc-pig-ops-add-name';
        elemIdAddShortName      = 'acc-pig-ops-add-short-name';
        elemIdAddDescription    = 'acc-pig-ops-add-description';
        elemIdAddDayNumber      = 'acc-pig-ops-add-day-number';
        elemIdAddBtnSave        = 'acc-pig-ops-add-save';
        
        
        elemIdEditName          = 'acc-pig-ops-edit-name';
        elemIdEditShortName     = 'acc-pig-ops-edit-short-name';
        elemIdEditDescription   = 'acc-pig-ops-edit-description';
        elemIdEditDayNumber     = 'acc-pig-ops-edit-day-number';
        elemIdEditBtnSave       = 'acc-pig-ops-edit-save';
        elemIdEditBtnDelete     = 'acc-pig-ops-edit-delete';
        
        
        
        var html = `
        
    <div class="container">
        <div class="header">
            <h1 id="${elemIdPageTitle}">Pig Operations</h1>
            
            <!-- Mobile Info Box -->
            <div class="mobile-info-box">
                <div class="info-text" id="${elemIdPigOpsInfo}">
                    Track and manage all pig farming operations. Each card shows operation details including day count, description, and last update information. Tap the edit icon to modify or delete operations.
                </div>
            </div>
            
        </div>
        
        <button class="add-btn" id="${elemIdBtnAddEntryShow}" data-bs-toggle="modal" data-bs-target="#add-entry-acc-pig-ops-modal">
            <i class="fas fa-plus"></i> Add New Pig Operation
        </button>
        
        <!-- Card View (for mobile) -->
        <div class="card-container" id="${elemIdMobileContainer}">
            <!-- Cards will be inserted here by JavaScript -->
        </div>
        
        <!-- Table View (for desktop) -->
        <div class="table-container" id="${elemIdTableContainer}">
            <table class="operations-table">
                <thead>
                    <tr>
                        <th>Day Number</th>
                        <th>Name</th>
                        <th>Short Name</th>
                        <th>Description</th>
                        <th>Last Update By</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Table rows will be inserted here by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Bootstrap Modal for Adding New Operation -->
    <div class="modal fade" id="add-entry-acc-pig-ops-modal" tabindex="-1" aria-labelledby="add-entry-acc-pig-ops-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
                        <i class="fas fa-plus me-2"></i>Add New Pig Operation
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
                            <label for="${elemIdAddDescription}" class="form-label">$Description *</label>
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


    <!-- Bootstrap Modal for Editing Cards -->
    <div class="modal fade" id="editCardModal" tabindex="-1" aria-labelledby="editCardModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editCardModalLabel">
                        <i class="fas fa-edit me-2"></i>Edit Pig Operation
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <form id="editCardForm">
                        <div class="mb-3">
                            <label for="${elemIdEditName}" class="form-label">Operation Name *</label>
                            <input type="text" class="form-control" id="${elemIdEditName}" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="${elemIdEditShortName}" class="form-label">Short Name *</label>
                            <input type="text" class="form-control" id="${elemIdEditShortName}" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="${elemIdEditDescription}" class="form-label">Description *</label>
                            <textarea class="form-control" id="${elemIdEditDescription}" rows="3" required></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="${elemIdEditDayNumber}" class="form-label">Day Number *</label>
                                <input type="number" class="form-control" id="${elemIdEditDayNumber}" min="0" max="365" required>
                            </div>
                           
                        </div>
            
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="${elemIdEditBtnDelete}" id="deleteCardBtn">
                        <i class="fas fa-trash-alt me-2"></i>Delete
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="${elemIdEditBtnSave}">
                        <i class="fas fa-save me-2"></i>Save
                    </button>
                </div>
            </div>
        </div>
    </div>

        
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageTitle           = document.getElementById(elemIdPageTitle);
        elemPigOpsInfo          = document.getElementById(elemIdPigOpsInfo);

        elemBtnAddEntryShow     = document.getElementById(elemIdBtnAddEntryShow);
        elemMobileContainer     = document.getElementById(elemIdMobileContainer);
        elemTableContainer      = document.getElementById(elemIdTableContainer);
        
        elemAddName             = document.getElementById(elemIdAddName);
        elemAddShortName        = document.getElementById(elemIdAddShortName);
        elemAddDescription      = document.getElementById(elemIdAddDescription);
        elemAddDayNumber        = document.getElementById(elemIdAddDayNumber);
        elemAddBtnSave          = document.getElementById(elemIdAddBtnSave);
        
        
        elemEditName            = document.getElementById(elemIdEditName);
        elemEditShortName       = document.getElementById(elemIdEditShortName);
        elemEditDescription     = document.getElementById(elemIdEditDescription);
        elemEditDayNumber       = document.getElementById(elemIdEditDayNumber);
        elemEditBtnSave         = document.getElementById(elemIdEditBtnSave);
        elemEditBtnDelete       = document.getElementById(elemIdEditBtnDelete);

    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        
        // Listen for window resize
        window.addEventListener('resize', thisObj.handleResize);
    
    
        elemBtnAddEntryShow.addEventListener('click', thisObj.addFormReset);
    
    }
    
    
    this.setDataAccPigOps = function(data){
        dataAccGestatingOps = [];
        dataAccLactatingPigletOps = [];
        dataAccLactatingSowOps = [];
        dataAccGiltOps = [];
        
        
        for (const cur_entry of data){
            switch(cur_entry.acc_pig_ops.operation_type){
                case PIG_OPERATION_TYPE.GESTATING:{
                    dataAccGestatingOps.push(cur_entry);
                    break;
                }
                
                case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                    dataAccLactatingPigletOps.push(cur_entry);
                    break;
                }
                
                case PIG_OPERATION_TYPE.LACTATING_SOW:{
                    dataAccLactatingSowOps.push(cur_entry);
                    break;
                }
                
                case PIG_OPERATION_TYPE.GILT:{
                    dataAccGiltOps.push(cur_entry);
                    break;
                }
            }
        }

    }
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
        if (isMobile) {
            elemMobileContainer.style.display = 'flex';
            elemTableContainer.style.display = 'none';
        } else {
            elemMobileContainer.style.display = 'none';
            elemTableContainer.style.display = 'block';
        }
    }
    
    
    this.showAccPigOps = function(pig_ops_type){
        curAccPigOpsType = pig_ops_type;
        
        switch(pig_ops_type){
            case PIG_OPERATION_TYPE.GESTATING:{
                curAccPigOpsData = dataAccGestatingOps;
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                curAccPigOpsData = dataAccLactatingPigletOps;
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                curAccPigOpsData = dataAccLactatingSowOps;
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                curAccPigOpsData = dataAccGiltOps;
                break;
            }
        }
        
        
        
        elemMobileContainer.innerHTML = '';
        
        // Create and append card elements
        curAccPigOpsData.forEach((operation, displayIndex) => {
            
            
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            var html_desc = '';
            var html_updated_by = '';
            var html_dt_update = '';
            
            if (operation.acc_pig_ops.desc != null){
                html_desc = `<div class="operation-desc">${operation.acc_pig_ops.desc}</div>`;
            }
            
            const last_update   = operation.last_update;
            const added_by      = operation.last_update;
            if (operation.last_update.name_last != null){
                html_updated_by = last_update.name_first + ' ' + last_update.name_last;
                html_dt_update  = last_update.dt_update.substring(0,10);
            }
            else{
                
            }
            
            
            
            cardElement.innerHTML = `
                <button class="edit-icon-btn" data-index="${operation.acc_pig_ops.hid}" title="Edit Operation">
                    <i class="fas fa-edit"></i>
                </button>
                
                <div class="card-content">
                    <div class="days-badge">Day ${operation.acc_pig_ops.num_days_since}</div>
                    
                    <div class="card-header">
                        <div class="name-section">
                            <div class="operation-name">${operation.acc_pig_ops.name}</div>
                            <div class="short-name">${operation.acc_pig_ops.short_name}</div>
                        </div>
                    </div>
                    
                    ${html_desc}
                    
                    <div class="card-footer">
                        <div class="update-info">
                            <div class="update-user">
                                <i class="fas fa-user"></i>
                                <span>${operation.last_update_by}</span>
                            </div>
                            <div class="update-time">
                                <i class="far fa-calendar-alt"></i>
                                <span>${operation.last_update.dt_update}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            elemMobileContainer.appendChild(cardElement);
        });
        
        
        thisObj.onUserChangeLanguage();
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
        var cur_text = null;
        
        switch(curAccPigOpsType){
            case PIG_OPERATION_TYPE.GESTATING:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gestating_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gestating_ops.info_text');
                if (cur_text != null){
                    elemPigOpsInfo.innerHTML = cur_text;
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_piglets_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_piglets_ops.info_text');
                if (cur_text != null){
                    elemPigOpsInfo.innerHTML = cur_text;
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_sow_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_sow_ops.info_text');
                if (cur_text != null){
                    elemPigOpsInfo.innerHTML = cur_text;
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gilt_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gilt_ops.info_text');
                if (cur_text != null){
                    elemPigOpsInfo.innerHTML = cur_text;
                }
                
                break;
            }
        }
    }
    
    
    
    // Reset add form
    this.addFormReset = function () {
        elemAddName.value       = '';
        elemAddShortName.value  = '';
        elemAddDescription.value = '';
        elemAddDayNumber.value  = '';
    }
    
    
    // Open edit modal with operation data
    this.editModalOpen = function(index) {
        currentEditIndex = index;
        const operation = operations[index];
        
        // Populate form with operation data
        editName.value = operation.name;
        editShortName.value = operation.short_name;
        editDesc.value = operation.desc;
        editDays.value = operation.num_days_since;
        editUpdatedBy.value = operation.last_update_by;
        editLastUpdated.value = operation.last_updated;
        editCardIndex.value = index;
        
        // Update modal title
        document.getElementById('editCardModalLabel').innerHTML = 
            `<i class="fas fa-edit me-2"></i>Edit: ${operation.name}`;
        
        // Show modal
        editCardModal.show();
    }
    
    
}