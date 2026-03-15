// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {UiBasic}                    from './ui_basic.js';


export function ComponentBreadCrumbs(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        navigation:             navigation,
        
        items:[
            {
                'label':        'SowList',
                'gotoPageId':   4,
                'callbackOnClick': null
                
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
    let elemContainer           = null;
    
    
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
            
            const data_index = `${settings.uniqueKey}-${index}`;
            html_items += thisObj._getHtmlItem(cur_entry, data_index);
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
        const breadcrumbs = elemUiShow.querySelectorAll('.breadcrumb-link');
        
        breadcrumbs.forEach(breadcrumb_elem => {
            breadcrumb_elem.addEventListener('click', () => {
                const data_index    = breadcrumb_elem.getAttribute('data-index');
                const to_replace    = `${settings.uniqueKey}-`; 
                const str_index     = data_index.replace(to_replace, '');
                const item_index    = parseInt(str_index);
                const breadcrumb_item = breadcrumbItems[item_index];

                const next_page = navigation.getPageContainer(
                                        breadcrumb_item.gotoPageId);
                
                
                // Remove navigation history entries from head until next_page.
                navigation.managerNavHistory.removeFromHeadUntilThisPage(
                    next_page);
                
                
                navigation.showThisPage(next_page);
                
                if (breadcrumb_item.callbackOnClick){
                    breadcrumb_item.callbackOnClick();
                }
                
            });
        });
    }
    
    
    this.refreshLabels = function(){
        const breadcrumbs = elemUiShow.querySelectorAll('.breadcrumb-link');
        
        breadcrumbs.forEach(breadcrumb_elem => {
            const data_index    = breadcrumb_elem.getAttribute('data-index');
            const to_replace    = `${settings.uniqueKey}-`;
            const str_index     = data_index.replace(to_replace, '');
            const item_index    = parseInt(str_index);
            const breadcrumb_item = breadcrumbItems[item_index];

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
        const breadcrumbs = elemUiShow.querySelectorAll('.breadcrumb-link');
        
        for(const cur_entry of breadcrumbs){
            cur_entry.onclick = function(){
                const data_index    = cur_entry.getAttribute('data-index');
                const str_index     = data_index.replace(`${settings.uniqueKey}-`, '');
                const item_index    = parseInt(str_index);
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
