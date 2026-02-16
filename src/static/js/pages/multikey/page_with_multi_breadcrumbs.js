// January 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {ComponentBreadCrumbs}   from '../common/ui/comp_breadcrumb.js';

import {getSowBoarReference}    from '../common/common_app.js';

import {PAGE_ID,
        SOW_STATUS,
        PROD_STATUS}            from '../../constants.js';


/*
Some business objects are details of multiple business objects. 
Example: the pig_medvac object is a detail for SowBoar, PigProd and ProdGroup

Generally, the detail objects when being added or edited, a breadcrumb will be
shown as 

<List>|<Entry>

and this can change dynamically.

The add/edit pages are recycled, not instantiated; For example

1.) The is one Add/Edit page for MedVac- which is used in SowBoar, PigProd and ProdGroup
2.) The is one Add/Edit page for Health Issue/Notes- which is used in SowBoar, PigProd and ProdGroup
 
To prevent from redrawing the whole page, multiple set of breadcrumbs are 
instantiated but only one set is shown at a time.


*/

export function PageWithMultiBreadCrumbs(input_settings){
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const settings              = input_settings;

    
    let elemIdContBreadCrumbs   = null;
    
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsSowBoar = {
        uniqueKey:              `${settings.uniqueKey}-sow-boar-breadcrumbs`,
        navigation:             navigation,

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
    this.breadCrumbsSowBoar    = null;
    
    
    const settingsPigProd = {
        uniqueKey:              `${settings.uniqueKey}-pig-prod-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Lacta List',
                'gotoPageId':   PAGE_ID.PROD_LACTA_LIST
            },
            
            {
                'label':        'Adela (PID 20)',
                'gotoPageId':   PAGE_ID.PROD_LACTA_ENTRY
            }
        ]
    }
    this.breadCrumbsPigProd    = null;
    
    
    const settingsFattening = {
        uniqueKey:              `${settings.uniqueKey}-fattening-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Fattening',
                'gotoPageId':   PAGE_ID.PROD_FATTENING_LIST
            },
            
            {
                'label':        'PID 20',
                'gotoPageId':   PAGE_ID.PROD_FATTENING_ENTRY
            }
        ]
    }
    this.breadCrumbsFattening   = null;
    
    
    
    
    
    this.getHtmlBreadCrumbs = function(){
        
        elemIdContBreadCrumbs   = `${settings.uniqueKey}-cont-breadcrumbs`;

        thisObj.breadCrumbsSowBoar  = new ComponentBreadCrumbs(settingsSowBoar);
        thisObj.breadCrumbsPigProd  = new ComponentBreadCrumbs(settingsPigProd);
        thisObj.breadCrumbsFattening= new ComponentBreadCrumbs(settingsFattening);
        
        const html_sow_boar     = thisObj.breadCrumbsSowBoar.getHtml();
        const html_pig_prod     = thisObj.breadCrumbsPigProd.getHtml();
        const html_fattening    = thisObj.breadCrumbsFattening.getHtml();
        
        let html = `
        <div id="${elemIdContBreadCrumbs}">
            ${html_sow_boar}
            
            ${html_pig_prod}
            
            ${html_fattening}
        </div>
        `;
        
        
        return html;
    }
    
    
    this.afterHtmlRenderBreadCrumbComponent = function(){
        // Do the afterHtmlRender to UI elements first;
        
        thisObj.breadCrumbsSowBoar.afterHtmlRender();
        thisObj.breadCrumbsPigProd.afterHtmlRender();
        thisObj.breadCrumbsFattening.afterHtmlRender();
    }
    
    
    this.updateBreadCrumbs = function(data_sow_boar, data_pig_prod){
        // Only one of the inputs cannot be none at a time
        
       
        
        
        if (data_sow_boar){
            // Need to update breadCrumb;
            // 1.) The first entry can be either be Sow List, Boar List, Gilt List, or Diposed List
            // 2.) The second entry is the Sow Boar name 

            let list_name       = null;
           
            
            let cur_sow_boar = data_sow_boar.sow_boar;
            
            
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
            
            
            settingsSowBoar.items[0].label = list_name;
            settingsSowBoar.items[1].label = sow_boar_name;
            thisObj.breadCrumbsSowBoar.refreshLabels();
            
            // Only one set of breadcrumbs can be shown at a time
            thisObj.breadCrumbsSowBoar.show();
            thisObj.breadCrumbsPigProd.hide();
            thisObj.breadCrumbsFattening.hide();
        }
        
        
        if (data_pig_prod){
            const prod_status_id = data_pig_prod.pig_production.prod_status_id;
            
            switch(prod_status_id) {
                case PROD_STATUS.LACTATING: {
                    let list_name       = 'Lacta List';
                    let sow_boar_name   = getSowBoarReference(data_pig_prod.sow);
                    let pid             = data_pig_prod.pig_production.farm_prod_id;
                    
                    let prod_name = `${sow_boar_name} (PID ${pid})`;
                    
                    settingsPigProd.items[0].label = list_name;
                    settingsPigProd.items[1].label = prod_name;
                    thisObj.breadCrumbsPigProd.refreshLabels();
                    
                    // Only one set of breadcrumbs can be shown at a time
                    thisObj.breadCrumbsSowBoar.hide();
                    thisObj.breadCrumbsPigProd.show();
                    thisObj.breadCrumbsFattening.hide();
                    
                    break;
                }
                
                case PROD_STATUS.WEANING:
                case PROD_STATUS.GROWING: {
                    let pid             = data_pig_prod.pig_production.farm_prod_id;
                    
                    let prod_name = `PID ${pid}`;
                    
                    settingsFattening.items[1].label = prod_name;
                    thisObj.breadCrumbsFattening.refreshLabels();
                    
                    // Only one set of breadcrumbs can be shown at a time
                    thisObj.breadCrumbsSowBoar.hide();
                    thisObj.breadCrumbsPigProd.hide();
                    thisObj.breadCrumbsFattening.show();
                    
                    break;
                }
            
                
                default:{
                    thisObj.breadCrumbsSowBoar.hide();
                    thisObj.breadCrumbsPigProd.hide();
                    thisObj.breadCrumbsFattening.hide();
                    
                    break;
                }
            
            }
            
        }
    }
    
    
    
}
