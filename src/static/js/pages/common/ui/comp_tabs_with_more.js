// January 26, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';


/* This will create a tab navigation like this.
1.) Because of space constraints in mobile screens, some tabs are available via 
    "More" button.
    
2.) The "More" Button is implemented via the global navigation.moreModal.

3.) The tabs buttons can dynamically change with screen size.
    If bigger screens, no "More" control at all if the tabs can fit in the 
    screen.
    


<!-- Tabs Navigation -->
<div class="tabs-container" id="elemIdTabsContainer">
    <button class="tab-button active" data-tab="pig-ops">Pig Ops</button>
    <button class="tab-button" data-tab="birth">Birth</button>
    <button class="tab-button" data-tab="insem">Insem</button>
    <button class="tab-button" data-tab="notes">Notes</button>
    <button class="tab-button" data-tab="${elemIdTabMore}" id="${elemIdShowMore}">
        More
    </button>
</div>
*/

export function ComponentTabsWithMore(input_settings){
    UiBasic.call(this);
    
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical settings = {
        navigation:             this,
        uniqueKey:              'sow-boar-entry',
        elemIdDivContainer:     elemIdContSowBoarEntry,
        elemIdTabsContainer:    elemIdTabsContainer,
        elemIdTabContentArea:   elemIdTabContentArea,
        
        showMoreTitle:          null,
        
        tabs: [
            {
                data_tab_id:    'tab-pigops',
                label:          'PigOps'
            },
            
            {
                data_tab_id:    'tab-birth',
                label:          'Birth'
            },
            
            {
                data_tab_id:    'tab-insem',
                label:          'Insem'
            },
            
            
            {
                data_tab_id:    'tab-notes',
                label:          'Notes'
            },
            
            {
                data_tab_id:    'tab-feeds',
                label:          'Feeds'
            }
            
        ]
    };
    */
    const settings              = input_settings;
    
    
    
    // This is needed as ths will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    // This is needed as ths will be first element to be rendered
    let elemTabsContainer       = elemDivContainer.querySelector('#'+settings.elemIdTabsContainer);
    
    
    let elemTabContentArea      = elemDivContainer.querySelector('#'+settings.elemIdTabContentArea);
    
    
    /**
    This will control the number of buttons before the "Nore"
    
    */
    
    let MAX_NUM_BUTTONS_BEFORE_MORE     = 4;
    
    
    let tabIdShowMore           = null;
    
    let elemIdShowMore          = null;
    
    let tabShowMore             = null;
    let elemShowMore            = null;
    
    
    let allTabs                 = null;
    let navItems                = null;
    
    
    let curActiveTabId          = null;
    
    
    // This must be set
    this.beforeShowTab          = null;
    
    
    // This must be set
    this.curData                = null;
    
    
    this.init = function(){
        
        this.render();
        this.afterHtmlRender();
        
    }
    
    
    this.getHtml = function(){
        
        
        tabIdShowMore           = `${settings.uniqueKey}-tab-more`;
        
        elemIdShowMore          = `${settings.uniqueKey}-show-more`;
        
        
        let hmtl = '';
        let index = 0;
        
        let s_active;
        
        for (const cur_entry of settings.tabs){ 
            s_active = '';
            
            if (curActiveTabId == null){
                if (index == 0){s_active = 'active';}
            }
            
            else{
                if (curActiveTabId  == cur_entry.data_tab_id){
                    {s_active = 'active';}
                }
            }
            
            if (index >= MAX_NUM_BUTTONS_BEFORE_MORE){
                html += `
                    <button class="tab-button" data-tab="${tabIdShowMore}" id="${elemIdShowMore}">More</button>
                `;
                break;
            }
            
        
            html += `
                <button class="tab-button ${s_active}" data-tab="${cur_entry.data_tab_id}">${cur_entry.label}</button>
            `;
            
            index += 1;
        }
        
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemShowMore            = elemDivContainer.querySelector('#'+elemIdShowMore);
        
        allTabs                 = elemDivContainer.querySelectorAll('.tab-content');
        navItems                = elemDivContainer.querySelectorAll('.tab-button');
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this.switchTab = function(tabId){
        
        console.log('switchTab tabId =' + tabId) ;
            
        curActiveTabId = tabId;
        
        
        if (tabId != tabIdShowMore){
        
            allTabs.forEach(tab => tab.classList.remove('active'));
            const selectedTab = elemDivContainer.querySelector('#'+tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
                
                if (thisObj.beforeShowTab){
                    thisObj.beforeShowTab(tabId);
                }
            }
            else{
                console.log('tab not found');
            }
        }
        
        navItems.forEach(item => item.classList.remove('active'));
        const activeNav = elemTabsContainer.querySelector(`[data-tab="${tabId}"]`);
        if (activeNav) {activeNav.classList.add('active');} else{
            elemShowMore.classList.add('active');
        }
        
    }
    
    
    this._bindEventListeners = function(){
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                thisObj.switchTab(tabId);
            });
        });
        
        
        if (elemShowMore){
            elemShowMore.addEventListener('click', function(e) {
                thisObj.configureShowMore();
            });
        }
    }
    
    
    this.configureShowMore = function(show_more_options){
        
        if (settings.tabs.length <= MAX_NUM_BUTTONS_BEFORE_MORE){return;}
        
        const excess_tabs = settings.tabs.slice(MAX_NUM_BUTTONS_BEFORE_MORE);
        
        
        const menu_items = [];
        
        for (const cur_entry of excess_tabs){
            const onclick_action = function(){
                thisObj.switchTab(cur_entry.data_tab_id);
            }
            
            menu_items.push({   
                label: cur_entry.label,
                action: onclick_action,
                data:   thisObj.curData
            });
        }
        
        let show_more_title = '';
        if (show_more_options){
            if (show_more_options.showMoreTitle){
                show_more_title = show_more_options.showMoreTitle;
            }
        }
        else{
            show_more_title = settings.showMoreTitle;
        }
            
        const options = {
            title: show_more_title
        };
        
        navigation.moreModal.beforeShow(menu_items, options);
        
    }
    
    
    this.changeTabButtons = function(tabs){
        // This will change the tab buttons dynamically
        // The tabs structure should be the same with settings.tabs
        // The previous  ettings.tabs will be overwritten
        settings.tabs = tabs;
        
        
        // complete redraw of buttons
        elemTabsContainer.innerHtml = '';
        
        const html = thisObj.getHtml();
        elemTabsContainer.innerHtml = html;
        
        
        // Find elements again
        navItems                = elemDivContainer.querySelectorAll('.tab-button');
        elemShowMore            = elemDivContainer.querySelector('#'+elemIdShowMore);
        
        // The tabs contents remain fixed; not redrawn;
        //allTabs                 = elemDivContainer.querySelectorAll('.tab-content');
        
        
        // Bnd event listeners again
        thisObj._bindEventListeners();
        
        
    }
    
}