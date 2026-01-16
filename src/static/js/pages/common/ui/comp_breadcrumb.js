// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



export function ComponentBreadcrumb(input_settings){
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
    const navigation            = settings.navigation;
    
    
    this.getHtml = function(){
        
        let html_items = '';
        
        let index = 0;
        for (const cur_entry of settings.items){
            if (index > 0){
                html_items += '<div class="breadcrumb-separator">/</div>';
            }
            
            html_items += thisObj._getHtmlItem(cur_entry, index);
            index += 1;
        }
        
        
        const html = `
            <div class="breadcrumb">
                ${html_items}
            </div>
        
        `;
        
        return html;
        
    }
    
    
    this._getHtmlItem = function(item, data_index){
        return `
        <div class="breadcrumb-item">
            <a href="javascript:void(0)" class="breadcrumb-link" data-index="${data_index}">${item.label}</a>
        </div>
        `;
    }
    
    
    this._findElements = function(){}
    
    
    this._bindEventListeners = function(){
        const breadcrumbs = settings.elemRoot.querySelectorAll('.breadcrumb-link');
        
        breadcrumbs.forEach(breadcrumb_elem => {
            breadcrumb_elem.addEventListener('click', () => {
                const item_index    = parseInt(breadcrumb_elem.getAttribute('data-index'));
                const breadcrumb_item = settings.items[item_index];

                const next_page = navigation.getPageContainer(breadcrumb_item.gotoPageId);
                navigation.showThisPage(next_page)
                
            });
        });
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
    
    this.refreshLabels = function(){
        const breadcrumbs = settings.elemRoot.querySelectorAll('.breadcrumb-link');
        
        breadcrumbs.forEach(breadcrumb_elem => {
            const item_index        = breadcrumb_elem.getAttribute('data-index');
            const breadcrumb_item   = settings.items[item_index];
            breadcrumb_elem.textContent = breadcrumb_item.label;
            
        });
    }
    
    
    /*
    Note: The size of crumbs items must be same from the settings.items 
    
    */
    this.updateCrumbsItems = function(new_crumbs_items){
        settings.items.length = 0;
        
        for (const cur_entry of new_crumbs_items){
            settings.items.push(cur_entry);
        }
    }
    
}