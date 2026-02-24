// February 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PageViewPigFarmPage}    from '../../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        HARVEST_TYPE}               from '../../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../../utils.js';

import {getSowBoarReference}        from '../../../common/common_app.js';


export const FEED_BALANCE_COLS = {
    ALL:              0,
    BEFORE_STARTER:   1,
    AFTER_PRESTART:   2
};



export function ComponentFeedBalance(input_settings){
    
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
    
    const elemDivContainer      = settings.elemDivContainer;
    
    let dataFeedBalance         = null;
    
    
    this.farmPage               = new PageViewPigFarmPage();
    
    
    
    
    
    this.init = function(){
        
    }
    
    
    
    
    this.beforeShow = function(options){
        showOptions = options;
        
        let dataFeedBalance   = [];
        
        let data_prod_list  = navigation.managerPigProd.dataPigProdList;
        
        if (showOptions.is_add){
            if (data_prod_list){
                for (const cur_entry of data_prod_list){
                    const cur_feed_bal = {
                        pig_prod:   cur_entry,
                        input: {
                            gesta:      null,
                            lacta:      null,
                            booster:    null,
                            prestarter: null,
                            starter:    null,
                            grower:     null,
                            finisher:   null
                        }                        
                    };
                    
                    dataFeedBalance.push(cur_feed_bal);
                } 
            }
        
            //  remainder for farm
            const cur_feed_bal = {
                pig_farm_hid:   navigation.pigFarm.getPigFarmHid(),
                input: {
                    gesta:      null,
                    lacta:      null,
                    booster:    null,
                    prestarter: null,
                    starter:    null,
                    grower:     null,
                    finisher:   null
                }                        
            };
            
            dataFeedBalance.push(cur_feed_bal);
            
        }
    
    }

} 
