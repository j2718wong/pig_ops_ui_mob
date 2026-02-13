// February 13, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


export function SowBoarTableBasic(input_settings){
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              parentObj,
        elemDivContainer:       null,
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings              = input_settings;
    
    
    // Need to overwrite
    this.getHtml = function(){
        return null;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    // Need to overwrite
    this._findElements = function(){}
    
    
    // Need to overwrite
    this._processAfterHtmlRender= function(){}
    
    
    // Need to overwrite
    this._bindEventListeners= function(){}

    
    // Need to overwrite
    this.show = function(){}
    
    
    // Need to overwrite
    this.hide = function(){}
    
    
    // Need to overwrite
    this.getElemTableBody = function(){}
    
    
    this.renderTable = function(data_list){
        
        const config = {
            elemPagination:     parentObj.elemTablePagination,
            elemTableBody:      thisObj.getElemTableBody(),
            elemEntryCount:     parentObj.elemTableRowCount,
            elemCurrentPage:    parentObj.elemTableCurPage,
            elemTotalPages:     parentObj.elemTableTotalPages,
            elemPrevPageBtn:    parentObj.elemTablePrevPage,
            elemNextPageBtn:    parentObj.elemTableNextPage,
            
            data:               data_list,
            
            itemsPerPage:       parentObj.TABLE_ROW_PER_PAGE,
            
            renderRow:          thisObj.getHtmlTableRow,
            renderRowEmpty:     thisObj.getHtmlTableRowEmpty,
            getRowElement:      thisObj.getElemTableRow
        } 

        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        // One event handler at a time
        parentObj.elemTablePrevPage.onclick = function(){
            paginationManager.goToPrevPage();
        }
        
        // One event handler at a time
        parentObj.elemTableNextPage.onclick = function(){
            paginationManager.goToNextPage();
        }
        
    }
    
    
    // Need to overwrite
    this.getHtmlTableRowEmpty = function(){}
    
    
    // Need to overwrite
    this.getHtmlTableRow = function(cur_entry){}
    
    
    // Need to overwrite
    this.getElemTableRow = function(cur_entry){}
    
} 
