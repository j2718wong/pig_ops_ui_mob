// January 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';


import {ComponentBreadcrumb}    from '../common/ui/comp_breadcrumb.js';

import {getSowBoarReference}    from '../common/common_app.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE}          from '../../constants.js';

/*
breadCrumb;
1.) The first entry can be either be Gesta List, Lacta List, Fattening List
2.) The second entry is 

if ProdGesta: Sow Name (PID <number>)
if ProdLacta: Sow Name (PID <number>)
if Fattening: PID <number>
        
*/

export function PageProdEntryComponent(input_settings){

    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /**
    Typical settings:
    {
        pigProdType:        PIG_PROD_TYPE.GESTATING
        
    }
    
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
       
    
    // There are links items for settings.pigProdType
    let linkItems = null;
    
    switch(settings.pigProdType){
        case PIG_PROD_TYPE.GESTATING:{
            linkItems = [
                {
                    'label':        'Gesta List',
                    'gotoPageId':   PAGE_ID.PROD_GESTA_LIST
                },
                
                {
                    'label':        'Sow',
                    'gotoPageId':   PAGE_ID.PROD_GESTA_ENTRY
                }
            ];
            break;
        }
        
        case PIG_PROD_TYPE.LACTATING:{
            linkItems = [
                {
                    'label':        'Lacta List',
                    'gotoPageId':   PAGE_ID.PROD_LACTA_LIST
                },
                
                {
                    'label':        'Sow',
                    'gotoPageId':   PAGE_ID.PROD_LACTA_ENTRY
                }
            ];
            break;
        }
        
        case PIG_PROD_TYPE.FATTENING:{
            break;
        }
    }
    
    
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsBreadcrumb = {
        uniqueKey:              settings.uniqueKey,
        navigation:             navigation,
        elemRoot:               elemDivContainer,    // Root element where to search for elements
                                            // so that not all document will be searched.
        items: linkItems
    }
    
    this.componentBreadcrumb    = new ComponentBreadcrumb(settingsBreadcrumb);
    
    
    // needs to set
    this.curDataPigProd         = null;
    
    
    this.afterHtmlRenderProdEntryComponent = function(){
        // Do the afterHtmlRender to UI elements first;
        
        this.componentBreadcrumb.afterHtmlRender();
    
    }
    
    
    this.updateBreadCrumbs = function(){
        // Need to update breadCrumb;
        // 1.) The first entry can be either be Gesta List, Lacta List, Fattening List
        // 2.) The second entry is 
        //
        // if ProdGesta: Sow Name (PID <number>)
        // if ProdLacta: Sow Name (PID <number>)
        // if Fattening: PID <number>
        

        let crumb_label_0       = null;
        let crumb_label_1       = null;
        
        const pig_production    = thisObj.curDataPigProd.pig_production;
        const cur_sow           = thisObj.curDataPigProd.sow;
        const cur_sow_name      = getSowBoarReference(cur_sow);
        
        
        switch(pig_production.prod_status_id){
            case PROD_STATUS.GESTATING:{
                crumb_label_0 = 'Gesta List';
                crumb_label_1 = `${cur_sow_name} (PID ${pig_production.farm_prod_id})`;
                break
            }
            
            case PROD_STATUS.LACTATING:{
                crumb_label_0 = 'Lacta List';
                crumb_label_1 = `${cur_sow_name} (PID ${pig_production.farm_prod_id})`;
                break
            }
            
            case PROD_STATUS.WEANING:
            case PROD_STATUS.GROWING: {
                crumb_label_0 = 'Fattening List';
                crumb_label_1 = `PID ${pig_production.farm_prod_id}`;
                break
            }
        }
        
        
        
        settingsBreadcrumb.items[0].label = crumb_label_0;
        settingsBreadcrumb.items[1].label = crumb_label_1;
        thisObj.componentBreadcrumb.refreshLabels();
        
        return
    }
    
    
    
}