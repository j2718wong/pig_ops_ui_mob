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
            thisObj.requestDataPigProdList(pig_prod_type, 
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
            if (cur_entry.sow_boar.hid == sow_boar_hid){return cur_entry}
        }
        return null;
    } 
    
    
	this.getDataPigProd = function(pig_prod_type, pig_prod_hid){
		let pig_prod_list = null;
		
		switch(pig_prod_type){
			case PIG_PROD_TYPE.GESTATING: {
				pig_prod_list = thisObj.dataPigProdGestating;
				break;
			}
			case PIG_PROD_TYPE.LACTATING:{
				pig_prod_list = thisObj.dataPigProdLactating;
				break;
			}
			case PIG_PROD_TYPE.FATTENING:{
				pig_prod_list = thisObj.dataPigProdFattening;
				break;
			}
		}
		
		
		for (const cur_entry of pig_prod_list){
			if (cur_entry.pig_production.his == pig_prod_hid){
				return cur_entry;
			}
		}
		
		return null;
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
    
    
    this.requestDataSowBoarList = function(is_sow, callback_success, elem_show_error){

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
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (is_sow){
                        thisObj.setDataSowList(response.data);
                    }
                    else{
                        thisObj.setDataBoarList(response.data);
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
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
    }
    
    
    // This is a request to get sow_boar details that returns tables.
    this.requestDataSowBoarDetails = function(data_sow_boar, callback_success, 
            elem_show_error){
        
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/sow_boar/entry?sow_boar_hid=${sow_boar_hid}`;
        
        
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
                    
                    // attach data to data_sow_boar
                    data_sow_boar.data_details = response.data;
                    
                    if (callback_success){callback_success(response.data);}
                }    
                else{
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
    
    
    // Note sow_boar.notes and sow_boar.health_issue are merged together in
    // prod_notes table. There is a flag to tell if is  a health issue
    this.requestDataSowBoarNotesList = function(data_sow_boar, callback_success, 
            elem_show_error){
        
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_notes/list?sow_boar_hid=${sow_boar_hid}`;
        
        
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
                    
                    // response.data is ORDERED BY date DESC
                    const health_issues = [];
                    const notes = [];
                    
                    for (const cur_entry of response.data){
                        if ('is_health_issue' in cur_entry.prod_notes){
                            health_issues.push(cur_entry);
                        }
                        else{
                            notes.push(cur_entry);
                        }
                    }
                    
                    data_sow_boar.data_details.list_health_issues = health_issues;
                    data_sow_boar.data_details.list_notes        = notes;
                    
                    if (callback_success){callback_success(response.data);}
                }    
                else{
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
 
    
    
    this.requestDataPigProdList = function(pig_prod_type, callback_success, 
            elem_show_error){
        
        // Note: There is a difference between PIG_PROD_TYPE and PROD_STATUS
        // constants.
        
        
        
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
    
    
    
    this.requestDataPigProdEntry = function(pig_prod_hid, callback_success, 
            elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod/entry/${pig_prod_hid}`;
        
        
        
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
 
    
    
    this.requestDataPigProdPigOpsEntry = function(data_pig_prod, prod_pig_ops_list,
            pig_prod_pig_ops_hid, callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_pig_ops/entry/${pig_prod_pig_ops_hid}`;
        
        
        
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
                    
                    // Need to replace the pig_ops from the database
                    
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
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    
    this.requestDataPigProdNotesList = function(data_pig_prod, callback_success, 
            elem_show_error){
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_notes/list?pig_prod_hid=${pig_prod_hid}`;
        
        
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
                    
                    data_pig_prod.data_details.list_notes = response.data;
                    
                    if (callback_success){callback_success(response.data);}
                }    
                else{
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
    
    
    
    this.requestDataPigMedVacList = function(data_sow_boar, callback_success, 
            elem_show_error){
        
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
    
    
    /* Will remove pig_prod_entry from given prod_list.
    * @param prod_list - either 
        this.dataPigProdGestating
        this.dataPigProdLactating
        this.dataPigProdFattening
    
    
    */
    this.removeFromProdList = function(pig_prod_hid, prod_list){
        let index;
        let cur_entry;
        
        for(index = 0; index<prod_list.length; index++){
            cur_entry = thisObj.dataPigProdGestating[index];
            
            if (cur_entry.pig_production.hid == pig_prod_hid){
                prod_list.splice(index, 1);
                return;
            }
        }
    }
    
    
    this.replaceInProdList = function(pig_prod_hid, prod_list, new_prod_entry){
        let index;
        let cur_entry;
        
        for(index = 0; index<prod_list.length; index++){
            cur_entry = thisObj.dataPigProdGestating[index];
            
            if (cur_entry.pig_production.hid == pig_prod_hid){
                prod_list.splice(index, 1, new_prod_entry);
                return;
            }
        }
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
                    thisObj.requestDataPigProdList(pig_prod_type, 
                        callback_success);

                }
                
            }
        }
    }
}