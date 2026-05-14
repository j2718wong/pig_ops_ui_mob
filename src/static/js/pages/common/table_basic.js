// February 13, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../utils.js';

import {onClickShowSample}          from './page_view_basic.js';

import {DEFAULT_NO_ENTRIES_TABLE}   from './page_table_basic.js';



export function updateTableRowColors(elemTable) {
    const tbody = elemTable.querySelector('tbody');
    const allRows = Array.from(tbody.querySelectorAll('tr'));
    
    // Disable CSS nth-child by forcing inline styles that override
    allRows.forEach(row => {
        row.style.setProperty('background-color', 'transparent', 'important');
        row.style.setProperty('background', 'transparent', 'important');
    });
    
    // Filter visible rows
    const visibleRows = allRows.filter(row => {
        const style = window.getComputedStyle(row);
        return style.display !== 'none';
    });
    
    // Apply your colors
    visibleRows.forEach((row, index) => {
        if (index % 2 === 0) {
            row.style.setProperty('background-color', 'var(--row-even)', 'important');
        } else {
            row.style.setProperty('background-color', 'transparent', 'important');
        }
    });
}


export function TableBasic(input_settings){
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        parentObj:              parentObj,
    }   
    */  
    const settings              = input_settings;
    
    
    let navigation              = null;
    
    
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
        navigation  = parentObj.navigation;
        
            
        const config = {
            navigation:         parentObj.navigation,
            
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
        if (parentObj.elemTablePrevPage){
            parentObj.elemTablePrevPage.onclick = function(){
                paginationManager.goToPrevPage();
            }
        }
    
        // One event handler at a time
        if (parentObj.elemTableNextPage){
            parentObj.elemTableNextPage.onclick = function(){
                paginationManager.goToNextPage();
            }
        }
    }
    
    
    // Need to overwrite
    this.getHtmlTableRowEmpty = function(){}
    
    
    // Need to overwrite
    this.getHtmlTableRow = function(cur_entry){}
    
    
    // Need to overwrite
    this.getElemTableRow = function(cur_entry){}
    
    
    this.writeLabelNoEntries = function(){
        // If language is default or english, the label_no_entries is a 
        // random entry from DEFAULT_NO_ENTRIES_TABLE
        
        // If PH dialects, it should start with 'No Entries';
        // + local variation of 'No Entries'  translation.
        // Or much better tehre is a flag that can switched to and 
        // English 'No Entries; ' + local variation 
        
        // If non-PH dialects, it should be a random entry from translated
        // 'No Entries'  translation
        
        
        // TODO get a random entry from DEFAULT_NO_ENTRIES_TABLE
        let label_no_entries = 'No Entries';
        

        
        if(navigation){
            const manager_translations = navigation.managerTranslations; 
            const translation_helper = manager_translations.translationHelper;

            const term_path = 'common.labels.no_entries';
            label_no_entries = translation_helper.getTranslatedText(term_path, 
                DEFAULT_NO_ENTRIES_TABLE);
        }
        
        return label_no_entries;
    }


    this.onClickShowSample = function(config_sample){
        onClickShowSample(config_sample);
    }
} 
