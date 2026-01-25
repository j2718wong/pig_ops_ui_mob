// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_PROD_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';


import {AccountLists}           from './account_lists.js';



export function PigFarm(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    
    this.accountLists           = new AccountLists(_navigation);
    
    this.dataPigFarm            = null;
    this.dataPigFarmAccount     = null;
    
    this.dataSowList            = null;
    this.dataBoarList           = null;
    this.dataStaffList          = null;
    
    
    
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
        
        this.dataStaffList = data.staff_list;
		
        navigation.setDataSowList(data.sow_list);
        navigation.setDataBoarList(data.boar_list);
            
            
        if ('pig_production' in data){
            navigation.setDataPigProdList(data.pig_production);
        }
        else{
            
            const pig_prod_type = PIG_PROD_TYPE.GESTATING + PIG_PROD_TYPE.LACTATING;
            thisObj.requestDataPigProd(pig_prod_type, 
                navigation.setDataPigProdList);
        }
        
    }
    
    
    this.setPigFarmAccountHasUnpaidBill = function(bill_hid){
         accountHasUnpaidBill   = true;
         accountDueBillHid      = bill_hid;
        
    }
    
    
    this.setDataStaffList = function(data) {
        this.dataStaffList = data;
		
		navigation.pageMobGestatingList.setDataStaffList(data);
        navigation.pageMobLactatingList.setDataStaffList(data);
        //navigation.pageProdGestatingAdd.setDataStaffList(data);
        //navigation.pageProdGestatingEntry.setDataStaffList(data);
        
        navigation.pageMedVacAddEdit.setDataStaffList(data);
        
    }
    
    
    // Should return country hid of the farm.
    this.getCountryHid = function(){
        return this.dataPigFarm.location.country.hid;
    }
    
    
    this.getSettingsOperations  = function(){
        if (thisObj.dataPigFarmAccount == null){return null;}
        return thisObj.dataPigFarmAccount.account.settings_operations;
    }
    
    
    this.getDataSowBoar = function(sex, sow_boar_hid){
        let sow_boar_list  = this.dataSowList;
        if (sex == 'M'){
            sow_boar_list  = this.dataBoarList;
        }
        
        if (sow_boar_list == null){return null;}
        
        for (const cur_entry of sow_boar_list){
            if (cur_entry.hid == sow_boar_hid){return cur_entry}
        }
        return null;
    } 
    
    
    this.requestDataPigProd = function(pig_prod_type, callback){
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
                    if (callback){callback(response.data);}
                }
                else {
                    // TODO
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
 

     
}