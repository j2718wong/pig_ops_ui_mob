// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {TextTranslation}        from '../common/translation.js';

import {TRANSLATION_PAGE_ACC_PIG_OPS}   from '../../translations/page_acc_pig_ops_i8n.js'


import {AddModalAccPigOps}      from './add_modal_acc_pig_ops.js'
import {EditModalAccPigOps}     from './edit_modal_acc_pig_ops.js'


export function PageAccPigOps(){
    const thisObj               = this;

    // This is needed as ths will be first element to be rendered
    var elemDivContainer        = document.getElementById('container-acc-pig-ops');

    var elemIdPageTitle         = null;
    var elemIdPageInfo        	= null;

    var elemIdBtnAddEntryShow   = null;
    var elemIdMobileContainer   = null;
    var elemIdTableContainer    = null;

    var elemPageTitle           = null;
    var elemPageInfo          	= null;

    var elemBtnAddEntryShow     = null;
    var elemMobileContainer     = null;
    var elemTableContainer      = null;



    var textTranslation         = new TextTranslation();
    var curUserLanguageKey      = 'en';


    var dataAccGestatingOps     = null;
    var dataAccLactatingPigletOps= null;
    var dataAccLactatingSowOps  = null;
    var dataAccGiltOps          = null;

    var curAccPigOpsType        = null;
    var curAccPigOpsData        = null;


    const settingsAddModal      = {
        parentObj:              this
    }
    this.addModalAccPigOps      = new AddModalAccPigOps(settingsAddModal);


    const settingsEditModal     = {
        parentObj:              this
    }
    this.editModalAccPigOps     = new EditModalAccPigOps(settingsEditModal);
    
    
    
    
    
    this.init = function(){
        textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.addModalAccPigOps.init();
        this.editModalAccPigOps.init();
        
        
        this.render();
        this.afterHtmlRender();
        
        
        this.addModalAccPigOps.afterHtmlRender();
        this.editModalAccPigOps.afterHtmlRender();
        
    }
    
    
    this.render = function(){
        
        elemIdPageTitle         = 'page-title-acc-pig-ops';
        elemIdPageInfo        	= 'page-info-acc-pig-ops';
        
        elemIdBtnAddEntryShow   = 'add-entry-acc-pig-ops-show';
        elemIdMobileContainer   = 'mobile-container-acc-pig-ops';
        elemIdTableContainer    = 'table-container-acc-pig-ops';
        
        
        const html_add_modal    = thisObj.addModalAccPigOps.getHtml();
        const html_edit_modal   = thisObj.editModalAccPigOps.getHtml();
        
        const html = `
        
    <div class="container">
        <div class="header">
            <h1 id="${elemIdPageTitle}">Pig Operations</h1>
            
            <!-- Mobile Info Box -->
            <div class="mobile-info-box">
                <div class="info-text" id="${elemIdPageInfo}">
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
    ${html_add_modal}
    

    <!-- Bootstrap Modal for Editing Cards -->
    ${html_edit_modal}

        
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
        elemPageInfo          	= document.getElementById(elemIdPageInfo);

        elemBtnAddEntryShow     = document.getElementById(elemIdBtnAddEntryShow);
        elemMobileContainer     = document.getElementById(elemIdMobileContainer);
        elemTableContainer      = document.getElementById(elemIdTableContainer);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        
        // Listen for window resize
        window.addEventListener('resize', thisObj.handleResize);
    
    
        elemBtnAddEntryShow.addEventListener('click', function(){
            thisObj.addModalAccPigOps.beforeShow(curAccPigOpsType);
        });
    
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
    
    
    this.show = function(pig_ops_type){
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
            const added_by      = operation.added_by;
            if (operation.last_update.name_last != null){
                html_updated_by = last_update.name_first + ' ' + last_update.name_last;
                html_dt_update  = last_update.dt_update.substring(0,10);
            }
            else{
                html_updated_by = 'System Generated';
                html_dt_update  = added_by.dt_entry.substring(0,10);
            }
            
            
            
            cardElement.innerHTML = `
                <button class="edit-icon-btn" onclick="gNavigation.pageAccPigOps.editModalOpen('${operation.acc_pig_ops.hid}')" title="Edit Operation">
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
                                <span>${html_updated_by}</span>
                            </div>
                            <div class="update-time">
                                <i class="far fa-calendar-alt"></i>
                                <span>${html_dt_update}</span>
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
                    elemPageInfo.innerHTML = cur_text;
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
                    elemPageInfo.innerHTML = cur_text;
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
                    elemPageInfo.innerHTML = cur_text;
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
                    elemPageInfo.innerHTML = cur_text;
                }
                
                break;
            }
        }
    }
    
    
    this.getDataAccPigOps = function(entry_hid){
        for (const cur_entry of curAccPigOpsData){
            if(cur_entry.acc_pig_ops.hid == entry_hid){return cur_entry;}
        }
        return null;
    }
    
    
    // Open edit modal with operation data
    this.editModalOpen = function(entry_hid) {
        const operation = thisObj.getDataAccPigOps(entry_hid);
        if (operation == null) {return;}
        
        thisObj.editModalAccPigOps.beforeShow(operation);
        
    }
    
    
}