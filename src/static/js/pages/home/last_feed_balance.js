// last_feed_balance.js

// June 6, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        DEFAULT_WEEKDAY,
        PAGE_ID,
        FEED_TYPE_NAME}         from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_MONTH_DATE_ONLY} from '../../utils.js';
        


export function LastFeedBalance(input_settings){
    
    const TAG                   = 'LastFeedBalance';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    let elemDivContainer        = input_settings.elemDivContainer;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContUserDisabled
    };
    */
    const settings              = input_settings;
    
    
    let elemIdFeedBalanceShow   = null;
    let elemIdLabelFeedBalance  = null;
    let elemIdDateFeedBalance   = null;
    let elemIdFeedBalanceText   = null;
    
    
    let elemFeedBalanceShow     = null;
    let elemLabelFeedBalance    = null;
    let elemDateFeedBalance     = null;
    let elemFeedBalanceText     = null;
    
    let elemServerErrorMsg      = null;


    let dtCurrentDate           = null;

    
    let lastVerNumFeedBalance   = null;
    

    
    
    this.init = function(){
    }
    

    this.getHtml = function(){
        
        elemIdFeedBalanceShow   = `${settings.uniqueKey}-feed-balance-show`;
        elemIdLabelFeedBalance  = `${settings.uniqueKey}-feed-balance-label`;
        elemIdDateFeedBalance   = `${settings.uniqueKey}-feed-balance-date`;
        elemIdFeedBalanceText   = `${settings.uniqueKey}-feed-balance-text`;
        
        const html = `
            
        <div class="expecting-section" id="${elemIdFeedBalanceShow}">
            <div class="section-title">
                <span>📊</span> <span id="${elemIdLabelFeedBalance}">Last Feed Balance</span>
            </div>
            
            <div id="${elemIdDateFeedBalance}"></div>
            
            <div class="feed-balance-text" id="${elemIdFeedBalanceText}" style="font-size: 1.2rem; color: #4b5563; margin-top: 0.25rem;">
            </div>
        </div>

        `;
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
    
        elemFeedBalanceShow     = elemDivContainer.querySelector('#'+elemIdFeedBalanceShow);
        elemLabelFeedBalance    = elemDivContainer.querySelector('#'+elemIdLabelFeedBalance);
        elemDateFeedBalance     = elemDivContainer.querySelector('#'+elemIdDateFeedBalance);
        elemFeedBalanceText     = elemDivContainer.querySelector('#'+elemIdFeedBalanceText);
    
        elemServerErrorMsg      = parentObj.elemServerErrorMsg;
    
    }
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}
    
    
    /***/
    this._getFeedBuyAfterLastFeedBalance = function(date_balance){
        const feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
        if (feed_buy_list == null){
            return null;
        }
        
        if (feed_buy_list.length == 0){
            return null;
        }
        
        const last_feed_buy = feed_buy_list[0];
        
        if (last_feed_buy.pf_feed_buy.date_buy > date_balance){
            return last_feed_buy;
        }
        
        return null;
    }
    
    
    this._appendLatestFeedBuyToFeedBalance = function(data_feed_buy){
        const elemLastFeedBuy = elemFeedBalanceText.querySelector('#latest-feed-buy');
        
        if (elemLastFeedBuy){
            let s = '';
            let is_comma = 0;

            
            let index = 0;
            for (const cur_entry of data_feed_buy.feed_items){
                if (is_comma){s += ', ';}
                
                let quantity = cur_entry.feed_item.quantity;
                let feed_type_name = cur_entry.feed_type.name;
                
                
                let s_feed = `<span class="nowrap"><b>+${quantity} ${feed_type_name}</b></span>`;
                s += s_feed;
                
                
                is_comma = 1;
            
                
                index += 1
            } 
            
            
            elemLastFeedBuy.innerHTML = s;
        
        }
        else{
            console.log('elemLastFeedBuy cannot be found');
        }
    }
    
    
    this.displayFeedBalance = function(data){
        // Add up feeds;
            
        let date_balance = null;
        
        const feed_balance = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        for (const cur_entry of data){
            
            for(let index = 0; index < 7; index++){
                feed_balance[index] += cur_entry.feeds[index];
            }
            
            date_balance = cur_entry.date_balance;
        }
        
        let s = '';
        let is_comma = 0;
        
        
        
        let index = 0;
        for (const cur_entry of feed_balance){
            if (cur_entry > 0){
                if (is_comma){s += ', ';}
                
                let feed_type_name = '';
                switch (index){
                    case 0: {feed_type_name = FEED_TYPE_NAME.GESTA; break;}
                    case 1: {feed_type_name = FEED_TYPE_NAME.LACTA; break;}
                    case 2: {feed_type_name = FEED_TYPE_NAME.BOST; break;}
                    case 3: {feed_type_name = FEED_TYPE_NAME.PRES; break;}
                    case 4: {feed_type_name = FEED_TYPE_NAME.START; break;}
                    case 5: {feed_type_name = FEED_TYPE_NAME.GROW; break;}
                    case 6: {feed_type_name = FEED_TYPE_NAME.FINISH; break;}
                    
                }
                
                
                let s_feed = `<span class="nowrap">${cur_entry} ${feed_type_name}</span>`;
                s += s_feed;
                
                
                is_comma = 1;
            }
            
            index += 1
        } 
        
        
        // Add span for latest feed buy if there is any
        s += `<span id="latest-feed-buy" style="margin-left:8px;"></span>`        
        
        
        
        elemFeedBalanceText.innerHTML = s;
        
        if (date_balance){
            const dt_balance  = new Date(date_balance);
            const s_dt_balance = formatDate(dt_balance, FORMAT_COMPACT);
            
            let day = dt_balance.getDay();
    
            let label_weekday   = DEFAULT_WEEKDAY[day];
            
            const translations = navigation.getTranslations();
            if (translations){
                if (translations.common.day_of_week){
                    label_weekday = translations.common.day_of_week[day]
                }
            }
            elemDateFeedBalance.textContent = `${s_dt_balance}, ${label_weekday}`;
        }
        
        if (is_comma > 0){
            elemFeedBalanceShow.style.display = 'block';
        } 
        
        
        // Display last feed_buy after last balance if there is any
        let feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
        if (feed_buy_list == null){
            navigation.pagePigFarmFeedBuyList.loadCachedDataOnly();
            
            feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
            // no cached data; need to request from server
            if (feed_buy_list == null){
                
                const callback_success = function(data){
                    const feed_buy = thisObj._getFeedBuyAfterLastFeedBalance(date_balance);
                    if (feed_buy){
                        thisObj._appendLatestFeedBuyToFeedBalance(feed_buy);
                    }
                };


                const callback_offline = function(){
                    
                };
                
                
                // This should update:
                // - navigation.pigFarm.dataFarmFeedBuyList
                // - navigation.pigFarm.dataVerNum.feed_buy
                navigation.pigFarm.requestDataPigFarmFeedBuyList(null,
                        callback_success, callback_offline, null); 
            }
            else {
                const feed_buy = thisObj._getFeedBuyAfterLastFeedBalance(date_balance);
                if (feed_buy){
                    thisObj._appendLatestFeedBuyToFeedBalance(feed_buy);
                }
            }
       
        }
        
        else{
            const feed_buy = thisObj._getFeedBuyAfterLastFeedBalance(date_balance);
            if (feed_buy){
                thisObj._appendLatestFeedBuyToFeedBalance(feed_buy);
            }
        }
    }
    

    this.requestServerDataLastFeedBalance = function(){
        const callback_success = function(data){
            thisObj.displayFeedBalance(data);
            
            // Set last version from pigFarm
            // This version number increments when there is a change in farm feed balance
            lastVerNumFeedBalance   = navigation.pigFarm.dataVerNum.feed_balance;

        };
        
            
        navigation.pigFarm.requestDataPigFarmLastFeedBalance(callback_success);
    }
    
    
    this.populateLastFeedBalance = function(){
        elemFeedBalanceShow.style.display = 'none';
        
        const farmLastBalance = navigation.pigFarm.dataLastFeedBalance;
        
        if (farmLastBalance == null){
            // If data source is null, that means the page was unloaded;
            // Load cached data 
            const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
            this.loadCachedDataLastFeedBalance(pig_farm_hid);
        }
        else{
            const cur_ver_num = navigation.pigFarm.dataVerNum.feed_balance;
            
            if (cur_ver_num > lastVerNumFeedBalance){
                thisObj.requestServerDataLastFeedBalance();
            }
            else{
                thisObj.displayFeedBalance(farmLastBalance);
            }
        }
    }
    
    
    this.loadCachedDataLastFeedBalance = function(pig_farm_hid){
            
        // Load cached data 
        const key = navigation.managerLocalData.STORAGE_KEY.PIG_FARM.LAST_FEED_BALANCE;
        const cached = localStorage.getItem(key);
        if (!cached) {
            this.requestServerDataLastFeedBalance();
            return;
        }
        
        
        const data = JSON.parse(cached);
        
        // Check if pig_farm_hid matched
        const cached_pig_farm_hid = data.pig_farm_hid;
        if (cached_pig_farm_hid != pig_farm_hid){
            this.requestServerDataLastFeedBalance();
            return;
        }
        
        
        // Optionally expire cache after 7 days
        if (data.cached_at && (Date.now() - data.cached_at) > APPLICATION.NUM_MSECS_CACHE_DATA) {
            // Cache too old, fetch fresh
            this.requestServerDataLastFeedBalance();
            return;
        }
        
        
        // Update data source
        navigation.pigFarm.dataLastFeedBalance = data.data;
        
        // Update data source version
        navigation.pigFarm.dataVerNum.feed_balance = data.data_ver_num;

        
        // Display Data
        thisObj.displayFeedBalance(data.data);
        
        
        // Check server data update
        //this.checkServerDataUpdate();
    
    }
    
 
}
