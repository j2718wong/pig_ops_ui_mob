// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_PROD_TYPE,
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
    
    this.dataPigFarm            = null;
    this.dataPigFarmAccount     = null;
    
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
            navigation.pageAccPigOpsList.setDataAccPigOps(data.acc_pig_ops);
        }
        else{
            if ('acc_gestating_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOps(data.acc_gestating_ops);
            }
            
            if ('acc_lactating_piglets_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOps(data.acc_lactating_piglets_ops);
            }
            
            if ('acc_lactating_sow_ops' in data){
                navigation.pageAccPigOpsList.setDataAccPigOps(data.acc_lactating_sow_ops);
            }
        }
        
        thisObj.dataStaffList = data.staff_list;
        
        
        thisObj.managerSowBoar.setDataSowList(data.sow_list);
        thisObj.managerSowBoar.setDataBoarList(data.boar_list);
            
            
        if ('pig_production' in data){
            thisObj.managerPigProd.setDataPigProdList(data.pig_production);
        }
        else{
            
            const pig_prod_type = PIG_PROD_TYPE.GESTATING + PIG_PROD_TYPE.LACTATING;
            thisObj.managerPigProd.requestPigProdList(pig_prod_type, 
                thisObj.managerPigProd.setDataPigProdList);
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
 
 
 
    this.requestDataPigFarmStaffList = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm_staff/list?pfhid=${thisObj.getPigFarmHid()}`;
        
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
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
        
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
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
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
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
    
    
    
    
}
