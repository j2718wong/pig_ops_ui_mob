// account.js

// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION, 
        SUPPLIER_TYPE}          from '../../constants.js';


export function Account(_navigation){
    const thisObj           = this;
    const navigation        = _navigation;
    

    
    this.accountInfo            = null;
    
    
    this.setAccount = function(account){
        this.accountInfo = account;
    }
    
    
    this.getCountryHid = function(){
        return this.accountInfo.account.country_hid;
    }
    
}
