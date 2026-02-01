// January 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';


import {ComponentBreadCrumbs}    from '../common/ui/comp_breadcrumb.js';

import {getSowBoarReference}    from '../common/common_app.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../constants.js';

/*
breadCrumb;
1.) The first entry can be either be Gesta List, Lacta List, Fattening List
2.) The second entry is 

if ProdGesta: Sow Name (PID <number>)
if ProdLacta: Sow Name (PID <number>)
if Fattening: PID <number>
        
*/

export function PagePigProdWithBreadCrumbs(input_settings){

    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /**
    Typical settings:
    
    
    */
    const settings              = input_settings;

    
	let elemIdContBreadCrumbs	= null;
    

    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsProdGesta = {
        uniqueKey:              `${settings.uniqueKey}-gesta-breadcrumbs`,
        navigation:             navigation,
        
        items: [
            {
                'label':        'Gesta List',
                'gotoPageId':   PAGE_ID.PROD_GESTA_LIST
            },
            
            {
                'label':        'Sow',
                'gotoPageId':   PAGE_ID.PROD_GESTA_ENTRY
            }
        ]
    }
    
    this.breadCrumbsGesta       = new ComponentBreadCrumbs(settingsProdGesta);
    
    
    const settingsProdLacta = {
        uniqueKey:              `${settings.uniqueKey}-lacta-breadcrumbs`,
        navigation:             navigation,
        
        items: [
            {
                'label':        'Lacta List',
                'gotoPageId':   PAGE_ID.PROD_LACTA_LIST
            },
            
            {
                'label':        'Sow',
                'gotoPageId':   PAGE_ID.PROD_LACTA_ENTRY
            }
        ]
    }
    
    this.breadCrumbsLacta       = new ComponentBreadCrumbs(settingsProdLacta);
    
    
    
    this.getHtmlBreadCrumbs = function(){

        elemIdContBreadCrumbs   = `${settings.uniqueKey}-cont-breadcrumbs`;
        
        thisObj.breadCrumbsGesta    = new ComponentBreadCrumbs(settingsProdGesta);
        thisObj.breadCrumbsLacta    = new ComponentBreadCrumbs(settingsProdLacta);
        
        
        const html_gesta = thisObj.breadCrumbsGesta.getHtml();
        const html_lacta = thisObj.breadCrumbsLacta.getHtml();
        
        let html = `
        <div id="${elemIdContBreadCrumbs}">
            ${html_gesta}
            
            ${html_lacta}
        </div>
        `;
        
        return html;
    }
    
    
    this.afterHtmlRenderBreadCrumbComponent = function(){
        // Do the afterHtmlRender to UI elements first;
        
        thisObj.breadCrumbsGesta.afterHtmlRender();
        thisObj.breadCrumbsLacta.afterHtmlRender();
    
    }
    
    
    this.updateBreadCrumbs = function(data_pig_prod){
        // Need to update breadCrumb;
        // 1.) The first entry can be either be Gesta List, Lacta List, Fattening List
        // 2.) The second entry is 
        //
        // if ProdGesta: Sow Name (PID <number>)
        // if ProdLacta: Sow Name (PID <number>)
        // if Fattening: PID <number>
        

        let crumb_label_0       = null;
        let crumb_label_1       = null;
        
        const pig_production    = data_pig_prod.pig_production;
        const cur_sow           = data_pig_prod.sow;
        const cur_sow_name      = getSowBoarReference(cur_sow);
        
        
        switch(pig_production.prod_status_id){
            case PROD_STATUS.GESTATING:{
                crumb_label_0 = 'Gesta List';
                crumb_label_1 = `${cur_sow_name} (PID ${pig_production.farm_prod_id})`;
                
                
                settingsProdGesta.items[0].label = crumb_label_0;
                settingsProdGesta.items[1].label = crumb_label_1;
                thisObj.breadCrumbsGesta.refreshLabels();
                
                thisObj.breadCrumbsGesta.show();
                thisObj.breadCrumbsLacta.hide();
                break;
            }
            
            case PROD_STATUS.LACTATING:{
                crumb_label_0 = 'Lacta List';
                crumb_label_1 = `${cur_sow_name} (PID ${pig_production.farm_prod_id})`;
                
                
                settingsProdLacta.items[0].label = crumb_label_0;
                settingsProdLacta.items[1].label = crumb_label_1;
                thisObj.breadCrumbsLacta.refreshLabels();
                
                
                thisObj.breadCrumbsGesta.hide();
                thisObj.breadCrumbsLacta.show();
                break;
            }
            
            case PROD_STATUS.WEANING:
            case PROD_STATUS.GROWING: {
                crumb_label_0 = 'Fattening List';
                crumb_label_1 = `PID ${pig_production.farm_prod_id}`;
                
                thisObj.breadCrumbsGesta.hide();
                thisObj.breadCrumbsLacta.hide();
                break;
            }
            
            
            default:{
                thisObj.breadCrumbsGesta.hide();
                thisObj.breadCrumbsLacta.hide();
                break;
            }
        }
        
        
        
        
        
        return
    }
    
    
    
}