// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SOW_STATUS,
        PROD_STATUS,
        SUPPLIER_TYPE,
        MULTIKEY_OBJ_TYPE,
        REPORT_TYPE}            from '../../constants.js';


import {ManagerSowBoar}         from './manager_sow_boar.js';
import {ManagerPigProd}         from './manager_pig_prod.js';

import {AccountLists}           from './account_lists.js';



export function PigFarm(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    this.STORAGE_KEY            = 'superpig_pig_farm';  
    
    this.accountLists           = new AccountLists(_navigation);
    
    this.dataVerNum             = {
        sow:                    0,
        boar:                   0,
        pig_prod:               0,
        prod_history:           0,
        staff:                  0,
        feed_buy:               0,
        feed_balance:           0,
        not_pregnant:           0,
        boar_ext_mate:          0,
        pig_dead:               0
    };

    
    /** 
     * This is a typical data in dataPigFarm; just farm information and data version numbers.
    {
      "pig_farm": {
        "flag": 0,
        "name": "Jackson Farm",
        "num_farrow_crates": 3,
        "hid": "3QLG0EDV"
      },
      "location": {
        "country": {
          "name": "Philippines",
          "hid": "3QLG0EDV"
        },
        "address": {
          "level_1": {
            "name": "Cebu",
            "hid": "3QLGX0RD"
          },
          "level_2": {
            "name": "City of Naga",
            "hid": "NRX2XBLV"
          },
          "level_3": {
            "name": "Tagjaguimit",
            "hid": "PE70558L"
          }
        }
      },
      "data_ver_num": {
        "sow": 3,
        "boar": 1,
        "pig_prod": 15,
        "prod_history": 3,
        "staff": 1,
        "feed_buy": 0,
        "feed_balance": 0,
        "not_pregnant": 0
      }
    }
    */
    this.dataPigFarm            = null;
    
    
    /**
     * This is the typical data of dataPigFarmAccount;
     * This is requested on page load. This is a bare minimum account 
      information used for operations.
    
    {
        "account": {
            "name": "Jackson Farm",
            "hid": "NKD2NR9X"
        },
        
        "settings_operations": {
            "weight_unit": "kg",
            "currency": "PHP",
            "day_1_on_date_of_birth": 0,
            "day_1_on_date_of_insem": 0,
            "num_days_move_to_farrow": 9,
            "num_days_wean": 42,
            "num_days_harvest_from_birth": 142,
            "num_days_harvest_from_wean": 97,
            
            "last_update": {
                "name_last": "Wong",
                "name_first": "Jack",
                "dt_update": "2026-04-07 07:26:19"
            }
        }
    }
    * 
    */
    this.dataPigFarmAccount     = null;
    
    
    this.dataStaffList          = null;
    
    this.dataFarmFeedBuyList    = null;
    
    
    this.dataSummaryReportList  = null;
    
    
    this.dataLastFeedBalance    = null;
    
    
    this.managerSowBoar         = new ManagerSowBoar({
        navigation:             navigation,
        parentObj:              this
    });
    
    
    this.managerPigProd         = new ManagerPigProd({
        navigation:             navigation,
        parentObj:              this
    });
    
    
    
    let accountHasUnpaidBill    = false;
    let accountDueBillHid       = null;
    
    
    this.getDataToSaveToStorage = function(){
        return {
            verNum:             thisObj.dataVerNum,
            pigFarm:            thisObj.dataPigFarm,
            pigFarmAccount:     thisObj.dataPigFarmAccount,
            
            staffList:          thisObj.dataStaffList,
            farmFeedBuyList:    thisObj.dataFarmFeedBuyList,
            summaryReportList:  thisObj.dataSummaryReportList,
            
            lastFeedBalance:    thisObj.dataLastFeedBalance
        }
    }
    
    
    
    this.saveToStorage = function() {
        const data = thisObj.getDataToSaveToStorage();
        localStorage.setItem(thisObj.STORAGE_KEY, JSON.stringify(data));
    }

    
    this.getDataVerNumFromStorage = function(){
        const cached = localStorage.getItem(thisObj.STORAGE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            
            return data.verNum;
        }
        
        return null;
    }
    
    
    this.loadDataFromStorage = function(){
        const cached = localStorage.getItem(thisObj.STORAGE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            
            thisObj.dataVerNum              = data.verNum;     
            
            thisObj.dataPigFarmAccount      = data.pigFarmAccount;
            
            thisObj.dataStaffList           = data.staffList;      
            thisObj.dataFarmFeedBuyList     = data.farmFeedBuyList;
            thisObj.dataSummaryReportList   = data.summaryReportList;
            
            thisObj.dataLastFeedBalance     = data.lastFeedBalance;
        }
    }
    
    
    
    this.getPigFarmAccountHid = function(){
        return thisObj.dataPigFarmAccount.account.hid;
    }
    
    
    this.getPigFarmHid = function(){
        return this.dataPigFarm.pig_farm.hid;
    }
    
    
    this.isPigFarmAccountEnabled = function(){
        return true;
    }
    
    
    this.isPigFarmAccountHasUnpaidBill = function(){
        return  accountHasUnpaidBill;
    }
    
    
    /**
     * Will set basic pig_farm data.
     * 
     * Typical data:
     * {
          "pig_farm": {
            "flag": 0,
            "name": "J Pig Farm",
            "num_farrow_crates": 3,
            "hid": "3QLG0EDV"
          },
          "location": {
            "country": {
              "name": "Philippines",
              "hid": "3QLG0EDV"
            },
            "address": {
              "level_1": {
                "name": "Cebu",
                "hid": "3QLGX0RD"
              },
              "level_2": {
                "name": "City of Naga",
                "hid": "NRX2XBLV"
              },
              "level_3": {
                "name": "Tagjaguimit",
                "hid": "PE70558L"
              }
            }
          },
          "data_ver_num": {
            "sow": 1,
            "boar": 1,
            "pig_prod": 7,
            "prod_history": 1,
            "staff": 0,
            "feed_buy": 138,
            "feed_balance": 20,
            "not_pregnant": 2,
            "boar_ext_mate": 0,
            "pig_dead": 0
          }
        }
     * 
     * */
    this.setDataPigFarm = function(data){
        thisObj.dataPigFarm = data;
    }
    
    
    /**
     * This will initialize pig farm data.
     * 
     * Typical data:
     * 
    Object { acc_pig_ops: (11) […], sow_list: (8) […], boar_list: (3) […], staff_list: (1) […], account: {…} }
​
    acc_pig_ops: Array(11) [ {…}, {…}, {…}, … ]
    ​
    account: Object { account: {…}, settings_operations: {…} }
    ​
    boar_list: Array(3) [ {…}, {…}, {…} ]
    ​
    sow_list: Array(8) [ {…}, {…}, {…}, … ]
    ​
    staff_list: Array [ {…} ]
    ​
    */
    this.initializeFarmData = function(data){
        

        console.log('\n\ninitializeFarmData');
        console.log(data);

        
            
        if ('acc_pig_ops' in data){
            navigation.pageAccPigOpsList.setDataAccPigOpsList(data.acc_pig_ops);
        }
        else{
            if ('acc_gestating_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOpsList(
                    data.acc_gestating_ops, PIG_OPERATION_TYPE.GESTATING);
            }
            
            if ('acc_lactating_piglets_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOpsList(
                    data.acc_lactating_piglets_ops, 
                    PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            }
            
            if ('acc_lactating_sow_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOpsList(
                    data.acc_lactating_sow_ops,
                    PIG_OPERATION_TYPE.LACTATING_SOW);
            }
            
            if ('gilt_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOpsList(
                    data.acc_gilt_ops, PIG_OPERATION_TYPE.GILT);
            }
        }
        
        thisObj.dataPigFarmAccount = data.account;
        
        thisObj.dataStaffList = data.staff_list;


        // Update local storage
        thisObj.saveToStorage();

        
        thisObj.managerSowBoar.setDataSowList(data.sow_list);
        thisObj.managerSowBoar.setDataBoarList(data.boar_list);

            

            
        if ('pig_production' in data){
            thisObj.managerPigProd.setDataPigProdList(data.pig_production);
        }
        else{
            // Set pig_farm.dataVerNum 
            const callback_set_pig_farm_data_ver_num = function(data){
                
                thisObj.dataVerNum = {
                    sow:                    data[0],
                    boar:                   data[1],
                    pig_prod:               data[2],
                    prod_history:           data[3],
                    staff:                  data[4],
                    feed_buy:               data[5],
                    feed_balance:           data[6],
                    not_pregnant:           data[7],
                    boar_ext_mate:          data[8],
                    pig_dead:               data[9]
                };
                
                
                navigation.showHomeDashBoard();
            }
            
            
            const callback_success = function(data){
                thisObj.managerPigProd.setDataPigProdList(data);
                
                thisObj.requestPigFarmDataVerNum(null,
                    callback_set_pig_farm_data_ver_num);
            };
            
            
            const pig_prod_type = PIG_PROD_TYPE.ALL;
            thisObj.managerPigProd.requestPigProdList(pig_prod_type, 
                callback_success);

        }
        
    }
    
    
    
    this.setPigFarmAccountHasUnpaidBill = function(bill_hid){
         accountHasUnpaidBill   = true;
         accountDueBillHid      = bill_hid;
        
    }
    
    
    this.setDataStaffList = function(data) {
        thisObj.dataStaffList = data;
    }
    
    
    // Should return country hid of the farm.
    this.getCountryHid = function(){
        return thisObj.dataPigFarm.location.country.hid;
    }
    
    
    this.getSettingsOperations  = function(){
        if (thisObj.dataPigFarmAccount == null){return null;}
        return thisObj.dataPigFarmAccount.settings_operations;
    }
    
    
    
    /**
    Will return true if user is alowed to add or edit;
    return false otherwise.
    */
    this.checkUserAccountBeforeAddEdit = function(){
        // Check if user_account_hid is same with farm_account_hid;
        const user_account_hid = navigation.userControl.getUserAccountHid();
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        
        if (user_account_hid != farm_account_hid){
            console.log('cannot Add or edit User account_hid not equal to farm_account_hid');
            return false;
        }
        
        return true;
    }
 
 
    /**
     * Will request pigFarmdata version number; 
     * 
     * It is possible to specify pig_farm_hid; if not specified, will read
     * current this.getPigFarmHid();
     * */
    this.requestPigFarmDataVerNum = function(pig_farm_hid, callback_success, 
            callback_timeout, elem_show_error){
        
        let pfhid = null;
        
        if (pig_farm_hid){
            pfhid = pig_farm_hid;
        }
        else{
            pfhid = thisObj.getPigFarmHid();
        }
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_farm/data_ver_num?pfhid=${pfhid}&r=1`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                // Check for timeout error
                if (textStatus === 'timeout') {
                    if (callback_timeout) {
                        callback_timeout();
                    } else {
                        // Default timeout handling
                        if (elem_show_error){
                            elem_show_error.style.display = 'block';
                            elem_show_error.innerHTML = 'Server no reply. Please try again later.';
                        }
                    }
                } else {
                    navigation.serverError.serverErrorThrown(jqXHR, 
                        textStatus, errorThrown);
                }
            }
        });
        
    }
 
    
    this.requestDataAccPigOpsList = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        let url = `${base_url}/account_pig_ops/list?ahid=${farm_account_hid}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    navigation.pageAccPigOpsList.setDataAccPigOpsList(
                        response.data);
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
    }
 
 
    this.requestDataPigFarmStaffList = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm_staff/list?pfhid=${thisObj.getPigFarmHid()}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataStaffList = response.data;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    this.requestDataPigFarmFeedBuyList = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/pf_feed_buy/list?pfhid=${thisObj.getPigFarmHid()}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataFarmFeedBuyList = response.data;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    this.requestDataPigFarmFeedBuyItems = function(pig_farm_feed_buy, 
            callback_success, elem_show_error){
        
        // Only request feed_buy items not the whole pig_farm_feed_buy
        
        const pf_feed_buy_hid = pig_farm_feed_buy.pf_feed_buy.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/pf_feed_buy_item/list?pf_feed_buy_hid=${pf_feed_buy_hid}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    pig_farm_feed_buy.feed_items = response.data;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
    }
    
    
    this.requestDataPigMedVacList = function(medvac_type, data_entry, 
            callback_success, elem_show_error){
        
        
        const base_url = window.location.origin;
        let url = null;
        
        if (medvac_type == MULTIKEY_OBJ_TYPE.SOW_BOAR){
            const sow_boar_hid = data_entry.sow_boar.hid;
            url = `${base_url}/pig_medvac/list?sow_boar_hid=${sow_boar_hid}`;
        }
        else{
            const pig_prod_hid = data_entry.pig_production.hid;
            url = `${base_url}/pig_medvac/list?pig_prod_hid=${pig_prod_hid}`;
        }
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    data_entry.data_details.list_medvac = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
                    }
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
    
    
    /**
     *  date_since - can be null or YYYY-MM-DD date string
     * 
     * */
    this.requestDataPigFarmFeedBalance = function(date_since, callback_success,
        elem_show_error){
        
        const pig_farm_hid = thisObj.getPigFarmHid();
        
        const base_url = window.location.origin;
        let url = `${base_url}/feed_balance/list?pig_farm_hid=${pig_farm_hid}`;
        if (date_since) {
            url += `&date_since=${date_since}`
        }
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    
    this.requestDataPigFarmLastFeedBalance = function(callback_success,
            elem_show_error){
        
        const pig_farm_hid = thisObj.getPigFarmHid();
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm/last_feed_balance?pfhid=${pig_farm_hid}`;
        
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataLastFeedBalance = response.data;
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    
    
    
    this.requestDataPigFarmSummaryReportList = function(callback_success, 
            elem_show_error){
        
        const pfhid = thisObj.getPigFarmHid();
        const rtid  = REPORT_TYPE.PIG_FARM_SUMMARY;
        
        const base_url = window.location.origin;
        let url = `${base_url}/report/list?pfhid=${pfhid}&rtid=${rtid}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataSummaryReportList = response.data;
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    
}
