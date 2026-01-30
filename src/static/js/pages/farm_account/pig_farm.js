// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SOW_STATUS,
        PROD_STATUS,
        SUPPLIER_TYPE,
        MEDVAC_TYPE}            from '../../constants.js';


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
 
    
    
    
    this.requestDataPigMedVacList = function(medvac_type, data_entry, 
            callback_success, elem_show_error){
        
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_medvac/list?sow_boar_hid=${sow_boar_hid}`;
        
        
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
                    data_sow_boar.data_details.list_medvac = response.data;
                    
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
    
    
    
    this.onSuccessEditGestatingEntry = function(new_prod_entry){
        /* These are the sequence of steps that will happen if a 
        gestating entry is edited;
        
        1.) If no change in status (still in PROD_STATUS.GESTATING), 
        will remove the old gestating entry in thisObj.dataPigProdGestating 
        and replace with new_prod_entry.
        
        2.) If there is a change in status, from PROD_STATUS.GESTATING to
        PROD_STATUS.LACTATING, 
        
        - will remove the old gestating entry in thisObj.dataPigProdGestating
        
        - will request for production list with PROD_STATUS.LACTATING;
        20260129: still thinking if not to request for the whole lactating list 
        instead insert new_prod_entry in thisObj.dataPigProdLactating; 
        requesting whole lactating list is an expensive operation.
        
        
        */
        
        let index;
        let cur_entry;
        
        for(index = 0; index<thisObj.dataPigProdGestating.length; index++){
            cur_entry = thisObj.dataPigProdGestating[index];
            
            if (cur_entry.pig_production.hid ==  new_prod_entry.pig_production.hid){
                const old_prod_status = cur_entry.pig_production.prod_status_id;
                const new_prod_status = new_prod_entry.pig_production.prod_status_id;
                
                if (old_prod_status == new_prod_status){
                    thisObj.dataPigProdGestating.splice(index, 1, new_prod_entry);
                    return;
                }
                
                if (new_prod_entry.pig_production.hid == PROD_STATUS.LACTATING){
                    // Remove from old entry from gestating list
                    thisObj.dataPigProdGestating.splice(index, 1);
                    
                    // Request new lactating list
                    const callback_success = function(data){
                        thisObj.dataPigProdLactating = data;
                    };
                    
                    const pig_prod_type =  PIG_PROD_TYPE.LACTATING;
                    thisObj.requestPigProdList(pig_prod_type, 
                        callback_success);

                }
                
            }
        }
    }
}