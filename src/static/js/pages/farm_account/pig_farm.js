// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SOW_STATUS,
        PROD_STATUS,
        SUPPLIER_TYPE}          from '../../constants.js';


import {AccountLists}           from './account_lists.js';



export function PigFarm(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    

    
    this.accountLists           = new AccountLists(_navigation);
    
    this.dataPigFarm            = null;
    this.dataPigFarmAccount     = null;
    
    this.dataSowList            = null;
    this.dataGiltList           = null;
    this.dataBoarList           = null;
    this.dataStaffList          = null;
    
    this.dataPigProdGestating   = null;
    this.dataPigProdLactating   = null;
    this.dataPigProdFattening   = null;
    
    
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
    
    
    this.setDataPigProdList = function(data){
        thisObj.dataPigProdGestating   = [];
        thisObj.dataPigProdLactating   = [];
        thisObj.dataPigProdFattening   = [];
        
        
        for(const cur_entry of data){
            
            
            switch (cur_entry.pig_production.prod_status_id){
            
                case PROD_STATUS.GESTATING: {
                    thisObj.dataPigProdGestating.push(cur_entry);
                    break;
                }
                
                case PROD_STATUS.LACTATING: {
                    thisObj.dataPigProdLactating.push(cur_entry);
                    break;
                }
                
                case PROD_STATUS.WEANING:
                case PROD_STATUS.GROWING:{
                    thisObj.dataPigProdFattening.push(cur_entry);
                }
            
            }
        } 
        
    }
    
    
    this.setDataPigFarmAccount = function(data){
        thisObj.dataPigFarmAccount = data;
        
        
            
        if ('acc_pig_ops' in data){
            navigation.pageAccPigOps.setDataAccPigOps(data.acc_pig_ops);
        }
        else{
            if ('acc_gestating_ops' in data){
                navigation.pageAccPigOps.setDataAccPigOps(data.acc_gestating_ops);
            }
            
            if ('acc_lactating_piglets_ops' in data){
                navigation.pageAccPigOps.setDataAccPigOps(data.acc_lactating_piglets_ops);
            }
            
            if ('acc_lactating_sow_ops' in data){
                navigation.pageAccPigOps.setDataAccPigOps(data.acc_lactating_sow_ops);
            }
        }
        
        thisObj.dataStaffList = data.staff_list;
        
        thisObj.setDataSowList(data.sow_list);
        thisObj.setDataBoarList(data.boar_list);
            
            
        if ('pig_production' in data){
            thisObj.setDataPigProdList(data.pig_production);
        }
        else{
            
            const pig_prod_type = PIG_PROD_TYPE.GESTATING + PIG_PROD_TYPE.LACTATING;
            thisObj.requestDataPigProd(pig_prod_type, 
                thisObj.setDataPigProdList);
        }
        
    }
    
    
    this.setDataSowList = function(data){
        // When this is set, the data includes the gilts (SOW_STATUS.GROWING)
        // Need to seperate gilts data  
        
        
        thisObj.dataSowList = []
        thisObj.dataGiltList = []
        
        let sow_boar = null;
        
        for (const cur_entry of data){
            if ('sow_boar' in cur_entry){
                sow_boar = cur_entry.sow_boar;
            }
            else{sow_boar = cur_entry;}
            
            if (sow_boar.status_id == SOW_STATUS.GROWING){
                if (sow_boar.is_production_ready > 0){
                    thisObj.dataSowList.push(cur_entry);
                }
                else{
                    thisObj.dataGiltList.push(cur_entry);
                }
            }
            else{
                thisObj.dataSowList.push(cur_entry);
            }
            
        }
        
    }
    
    
    this.setDataBoarList = function(data){
        thisObj.dataBoarList = data;
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
    
    
    this.getDataSowBoar = function(sex, sow_boar_hid){
        let sow_boar_list  = thisObj.dataSowList;
        if (sex == 'M'){
            sow_boar_list  = thisObj.dataBoarList;
        }
        
        if (sow_boar_list == null){return null;}
        
        for (const cur_entry of sow_boar_list){
            if (cur_entry.hid == sow_boar_hid){return cur_entry}
        }
        return null;
    } 
    
    
    this.requestDataPigProd = function(pig_prod_type, callback_success, elem_show_error){
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/list?pfhid=${cur_pig_farm_hid}&pig_prod_type=${pig_prod_type}&is_mob_view=${is_mob_view}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
    
    
    this.requestDataSowBoar = function(is_sow, callback_success, elem_show_error){

        const sex               = is_sow? 'F':'M';


        // Need to request sow_boar list
        
        const base_url = window.location.origin;
        let url = `${base_url}/sow_boar/list?pfhid=${thisObj.getPigFarmHid()}`;
        url += `&sex=${sex}`;
        
        if (is_sow == false){
            url += '&inc_external=1';
        }
        
        url += '&inc_user_audit=0';
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (is_sow){
                        navigation.setDataSowList(response.data);
                    }
                    else{
                        navigation.setDataBoarList(response.data);
                    }
                    
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.requestDataPigFarmStaff = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm_staff/list?pfhid=${thisObj.getPigFarmHid()}`;
        
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
 
    
    this.requestDataPigProdPigOps = function(data_pig_prod, operation_type,
            pig_prod_pig_ops_hid, callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_pig_ops/entry/${pig_prod_pig_ops_hid}`;
        
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    // Need to replace the pig_ops from the database
                    
                    
                    let prod_pig_ops_list = null;
                    
                    switch(operation_type){
                        case PIG_OPERATION_TYPE.GESTATING:{
                            prod_pig_ops_list = data_pig_prod.gestating_ops;
                            break;
                        }
                        
                        case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                            prod_pig_ops_list = data_pig_prod.lactating_piglets_ops;
                            break;
                        }
                        
                        case PIG_OPERATION_TYPE.LACTATING_SOW:{
                            prod_pig_ops_list = data_pig_prod.lactating_sow_ops;
                            break;
                        }
                        
                        default:{
                            prod_pig_ops_list = data_pig_prod.lactating_ops;
                            break;
                        }
                    }
                    
                    
                    if (prod_pig_ops_list){
                        let index = 0;
                        let cur_entry;
                        
                        for (index = 0; index < prod_pig_ops_list.length; index++){
                            cur_entry = prod_pig_ops_list[index];
                            
                            if (cur_entry.pig_prod_pig_ops.hid == pig_prod_pig_ops_hid){
                                prod_pig_ops_list.splice(index, 1, response.data);
                            }
                        }
                    }
                    
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
 
    
     
}