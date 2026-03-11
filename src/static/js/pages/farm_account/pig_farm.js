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
        MULTIKEY_OBJ_TYPE}      from '../../constants.js';


import {ManagerSowBoar}         from './manager_sow_boar.js';
import {ManagerPigProd}         from './manager_pig_prod.js';

import {AccountLists}           from './account_lists.js';



export function PigFarm(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    this.accountLists           = new AccountLists(_navigation);
    
    this.dataVerNum             = {
        sow:                    0,
        boar:                   0,
        pig_prod:               0,
        staff:                  0,
        feed_buy:               0,
        not_pregnant:           0
    };
    
    
    this.dataPigFarm            = null;
    this.dataPigFarmAccount     = null;
    
    this.dataAccPigOpsList      = null;
    
    this.dataStaffList          = null;
    
    this.dataFarmFeedBuyList    = null;
    
    
    
    
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
    
    
    this.getPigFarmAccountHid = function(){
        return thisObj.dataPigFarmAccount.account.account.hid;
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
    
    
    this.setDataPigFarm = function(data){
        this.dataPigFarm = data;
    }
    
    
    
    this.setDataPigFarmAccount = function(data){
        thisObj.dataPigFarmAccount = data;
        
        
            
        if ('acc_pig_ops' in data){
            this.dataAccPigOpsList = data.acc_pig_ops;
            
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
        
        thisObj.dataStaffList = data.staff_list;
        
        
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
                    staff:                  data[3],
                    feed_buy:               data[4],
                    not_pregnant:           data[5]
                };
                
                console.log('\n\npig_farm.dataVerNum');
                console.log(thisObj.dataVerNum);
                
                navigation.showHomeDashBoard();
            }
            
            
            const callback_success = function(data){
                thisObj.managerPigProd.setDataPigProdList(data);
                
                thisObj.requestPigFarmDataVerNum(
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
        return thisObj.dataPigFarmAccount.account.settings_operations;
    }
    
    
    this.getAccountHid = function(){
        if (thisObj.dataPigFarmAccount == null){return null;}
        return thisObj.dataPigFarmAccount.account.account.hid;
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
 
 
    this.requestPigFarmDataVerNum = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm/data_ver_num?pfhid=${thisObj.getPigFarmHid()}&r=1`;
        
        
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
 
    
    this.requestDataAccPigOpsList = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/account_pig_ops/list?ahid=${thisObj.getAccountHid()}`;
        
        
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
                    thisObj.dataAccPigOpsList = response.data;
            
                    navigation.pageAccPigOpsList.setDataAccPigOpsList(
                        thisObj.dataAccPigOpsList);
                    
                    if (callback_success){callback_success(thisObj.dataAccPigOpsList);}
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
 
    
    
}
