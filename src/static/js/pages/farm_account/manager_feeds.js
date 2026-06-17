// manager_feeds.js

// June 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE}     from '../../constants.js';
        

export function ManagerFeeds(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj
    
    
    // Latest feed price per unit weight;
    // This is saved at account level; this is a moving average of the feed 
    // prices per account; If there is no price per feed type in account, 
    // will be populated by country level price.
    this.latestFeedPricePUWT     = {
        gestating:              null,
        lactating:              null,
        booster:                null,
        prestarter:             null,
        starter:                null,
        grower:                 null,
        finisher:               null
    };

    
    
    // Will set feed price per unit weight; 
    this._setLatestFeedPricePUWT = function(account_price, country_ave_price){
        // country_ave_price  =[30.22, 32.84, 75.8, 54.4, 37.5, 33.6 ,32.7]
        
        const feed_types = ['gestating', 'lactating', 'booster', 'prestarter', 
            'starter', 'grower', 'finisher'];

        feed_types.forEach((type, index) => {
            if (account_price && account_price[index]) {
                thisObj.latestFeedPricePUWT[type] = account_price[index];
            } else {
                thisObj.latestFeedPricePUWT[type] = country_ave_price[index];
            }
        });  
    }
    
    
    this.populateAccFeedPricePUWT = function(){
        
        const account = navigation.userControl.dataUserAccount.account;

        const country_hid = account.account.country.hid; 
        
        const callback_success = function(data){
            thisObj._setLatestFeedPricePUWT(account.last_feed_price_puwt, data);
            console.log(`latestFeedPricePUWT`);
            console.log(thisObj.latestFeedPricePUWT);
        };
        
        const callback_failure = function(){
            
        };
        
        navigation.managerAddress.requestDataAveFeedsPricePUWT(country_hid,
            callback_success, callback_failure);
    
    }
 
    
    
    

}
