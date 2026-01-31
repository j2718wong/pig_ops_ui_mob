// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {UiBasic}                    from './ui_basic.js';


export function ComponentBreadcrumb(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        navigation:             navigation,
        elemRoot:               element,    // Root element where to search for elements
                                            // so that not all document will be searched.
        
        items:[
            {
                'label':        'SowList',
                'gotoPageId':   4
                
            },
            
            {
                'label':        'Adela',
                'gotoPageId':   3
                
            }
        
        ]
        
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    const navigation            = input_settings.navigation;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    
    let elemUiShow              = null;
    
    
    // This can dynamically change
    let breadcrumbItems         = settings.items;
    
    
    this.getHtml = function(){
        
        let html_items = thisObj._getHtmlBreadcrumbItems();

        const html = `
            <div class="breadcrumb" id="${elemIdUiShow}">
                ${html_items}
            </div>
        
        `;
        
        return html;
    }
    
    
    this._getHtmlBreadcrumbItems = function(){
        let html_items = '';
        
        let index = 0;
        for (const cur_entry of breadcrumbItems){
            if (index > 0){
                html_items += '<div class="breadcrumb-separator">|</div>';
            }
            
            html_items += thisObj._getHtmlItem(cur_entry, index);
            index += 1;
        }
        
        return html_items;
    }
    
    
    this._getHtmlItem = function(item, data_index){
        return `
        <div class="breadcrumb-item">
            <a href="javascript:void(0)" class="breadcrumb-link" data-index="${data_index}">${item.label}</a>
        </div>
        `;
    }
    
    
    this._findElements = function(){
        elemUiShow              = document.getElementById(elemIdUiShow);
        
        thisObj.elemUiShow      = elemUiShow;
    }
    
    
    this._bindEventListeners = function(){
        const breadcrumbs = settings.elemRoot.querySelectorAll('.breadcrumb-link');
        
        breadcrumbs.forEach(breadcrumb_elem => {
            breadcrumb_elem.addEventListener('click', () => {
                const item_index    = parseInt(breadcrumb_elem.getAttribute('data-index'));
                const breadcrumb_item = breadcrumbItems[item_index];

                const next_page = navigation.getPageContainer(breadcrumb_item.gotoPageId);
                navigation.showThisPage(next_page);
                
            });
        });
    }
    
    
    this.refreshLabels = function(){
        const breadcrumbs = settings.elemRoot.querySelectorAll('.breadcrumb-link');
        
        breadcrumbs.forEach(breadcrumb_elem => {
            const item_index        = breadcrumb_elem.getAttribute('data-index');
            const breadcrumb_item   = breadcrumbItems[item_index];
            breadcrumb_elem.textContent = breadcrumb_item.label;
            
        });
    }
    
    
    /*
    Updating breadcrumb will redraw the links. 
    
    */
    this.updateCrumbsItems = function(new_crumbs_items){
        elemUiShow.innerHTML = '';
        
        breadcrumbItems = new_crumbs_items;
        
        // Create new HTML
        elemUiShow.innerHTML =  thisObj._getHtmlBreadcrumbItems();
        
        // Attach onclick function to breadcrumb elements;
        // This is not addEventListener click method, because
        // the breadcrumb elements can change.
        const breadcrumbs = settings.elemRoot.querySelectorAll('.breadcrumb-link');
        
        for(const cur_entry of breadcrumbs){
            cur_entry.onclick = function(){
                const item_index    = parseInt(cur_entry.getAttribute('data-index'));
                const breadcrumb_item = breadcrumbItems[item_index];

                const next_page = navigation.getPageContainer(breadcrumb_item.gotoPageId);
                navigation.showThisPage(next_page);
            };
        }
        
    }
    
    
    // Override parent
    this.show = function(){
        if (thisObj.elemUiShow){
            thisObj.elemUiShow.style.display = 'flex';
        }
    }
    
}