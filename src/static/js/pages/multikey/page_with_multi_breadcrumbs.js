// January 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {ComponentBreadcrumb}    from '../common/ui/comp_breadcrumb.js';

import {getSowBoarReference}    from '../common/common_app.js';

import {PAGE_ID,
        SOW_STATUS}             from '../../constants.js';


export function PageWithMultiBreadCrumbs(input_settings){
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
       
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsBreadcrumb = {
        uniqueKey:              settings.uniqueKey,
        navigation:             navigation,
        elemRoot:               elemDivContainer,    // Root element where to search for elements
                                            // so that not all document will be searched.
        
        items:[
            {
                'label':        'SowList',
                'gotoPageId':   PAGE_ID.SOW_BOAR_LIST
            },
            
            {
                'label':        'Adela',
                'gotoPageId':   PAGE_ID.SOW_BOAR_ENTRY
            }
        ]
        
    }
    
    this.componentBreadcrumb    = new ComponentBreadcrumb(settingsBreadcrumb);
    
    
    // needs to set
    this.curDataSowBoar         = null;
    
    
    this.afterHtmlRenderSowBoarEntryComponent = function(){
        // Do the afterHtmlRender to UI elements first;
        
        thisObj.componentBreadcrumb.afterHtmlRender();
    
    }
    
    
    this.updateBreadCrumbs = function(){
        // Need to update breadCrumb;
        // 1.) The first entry can be either be Sow List, Boar List, Gilt List, or Diposed List
        // 2.) The second entry is the Sow Boar name 

        let list_name       = null;
       
        
        let cur_sow_boar = thisObj.curDataSowBoar;
        if ('sow_boar' in thisObj.curDataSowBoar){
            cur_sow_boar = thisObj.curDataSowBoar.sow_boar;
        }
        
        if ('dispose_status_id' in cur_sow_boar){
            list_name = 'Disposed List'; 
        }
        else{
            if ('farm_boar_id' in cur_sow_boar){
                list_name = 'Boar List';
            }
            else{
                if (cur_sow_boar.status_id == SOW_STATUS.GROWING){
                    if (cur_sow_boar.is_production_ready > 0){
                        list_name = 'Sow List';
                    }
                    else{
                        list_name = 'Gilt List';
                    }
                }
                else{
                    list_name = 'Sow List';
                }
            }
        }
        
        
        // Update breadcrumb 
        let sow_boar_name   = getSowBoarReference(cur_sow_boar);
        
        
        settingsBreadcrumb.items[0].label = list_name;
        settingsBreadcrumb.items[1].label = sow_boar_name;
        thisObj.componentBreadcrumb.refreshLabels();
        
        return sow_boar_name;
    }
    
    
    
}