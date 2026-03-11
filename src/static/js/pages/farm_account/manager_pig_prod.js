// January 30, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SOW_STATUS,
        PROD_STATUS,
        SUPPLIER_TYPE,
        MULTIKEY_OBJ_TYPE}            from '../../constants.js';



export function ManagerPigProd(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj
    
    
    this.dataPigProdList        = null;           
    
    
    this.dataGestatingList      = null;
    this.dataLactatingList      = null;
    this.dataFatteningList      = null;
    
    this.dataProdHistoryList    = null;
    
    this.dataNotPregnantList    = null;
    this.dataProdPigDeadList    = null;
    
    
    
    this.setDataPigProdList = function(data){
        thisObj.dataPigProdList     = data;
        
        thisObj.dataGestatingList   = [];
        thisObj.dataLactatingList   = [];
        thisObj.dataFatteningList   = [];
        
        
        for(const cur_entry of data){
            
            
            switch (cur_entry.pig_production.prod_status_id){
            
                case PROD_STATUS.GESTATING: {
                    thisObj.dataGestatingList.push(cur_entry);
                    break;
                }
                
                case PROD_STATUS.LACTATING: {
                    thisObj.dataLactatingList.push(cur_entry);
                    break;
                }
                
                case PROD_STATUS.WEANING:
                case PROD_STATUS.GROWING:{
                    thisObj.dataFatteningList.push(cur_entry);
                }
            
            }
        } 
        
    }
    
    
    this.getDataPigProd = function(pig_prod_type, pig_prod_hid){
        let pig_prod_list = null;
        
        switch(pig_prod_type){
            case PIG_PROD_TYPE.GESTATING: {
                pig_prod_list = thisObj.dataGestatingList;
                break;
            }
            case PIG_PROD_TYPE.LACTATING:{
                pig_prod_list = thisObj.dataLactatingList;
                break;
            }
            case PIG_PROD_TYPE.FATTENING:{
                pig_prod_list = thisObj.dataFatteningList;
                break;
            }
        }
        
        
        for (const cur_entry of pig_prod_list){
            if (cur_entry.pig_production.hid == pig_prod_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    
    this.requestPigProdList = function(pig_prod_type, callback_success, 
            elem_show_error){
        
        // Note: There is a difference between PIG_PROD_TYPE and PROD_STATUS
        // constants.
        
        
        
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/list?pfhid=${cur_pig_farm_hid}&pig_prod_type=${pig_prod_type}&is_mob_view=${is_mob_view}`;
        
        
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
                    switch(pig_prod_type){
                        case PIG_PROD_TYPE.GESTATING:{
                            thisObj.dataGestatingList = response.data;
                            break;
                        }
                        
                        case PIG_PROD_TYPE.LACTATING:{
                            thisObj.dataLactatingList = response.data;
                            break;
                        }
                        
                        case PIG_PROD_TYPE.FATTENING:{
                            thisObj.dataFatteningList = response.data;
                            break;
                        }
                        
                        case PIG_PROD_TYPE.ALL: {
                            thisObj.setDataPigProdList(response.data);
                            break;
                        }
                        
                        case PIG_PROD_TYPE.HARVESTED: {
                            thisObj.dataProdHistoryList = response.data;
                            break;
                        }
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
    
    
    this.requestPigProdNotPregnantList = function(callback_success, 
            elem_show_error){
        
        
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/not_pregnant?pfhid=${cur_pig_farm_hid}`;
        
        
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
                    thisObj.dataNotPregnantList = response.data;
                    
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
    
    
    
    this.requestProdPigDeadList = function(callback_success, 
            elem_show_error){
        
        
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/prod_pig_dead/list?pfhid=${cur_pig_farm_hid}`;
        
        
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
                    thisObj.dataProdPigDeadList = response.data;
                    
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
    
    
    
    
    this.requestPigProdEntry = function(pig_prod_hid, callback_success, 
            elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/entry/${pig_prod_hid}`;
        
        
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
 
    
    
    this.requestPigOpsEntry = function(data_pig_prod, prod_pig_ops_list,
            pig_prod_pig_ops_hid, callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod_pig_ops/entry/${pig_prod_pig_ops_hid}`;
        
        
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
 
    
    // This is a request to get sow_boar details that returns tables.
    this.requestPigProdDetails = function(data_pig_prod, callback_success, 
            elem_show_error){
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/data_details?pig_prod_hid=${pig_prod_hid}`;
        
        
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
                    
                    // attach data to data_pig_prod
                    data_pig_prod.data_details = response.data;
                    
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
    
    
    this.requestPigProdFeedList = function(data_pig_prod, callback_success, 
            elem_show_error){
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod_feed/list?pig_prod_hid=${pig_prod_hid}`;
        
        
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
                    
                    // attach data to data_pig_prod
                    if(data_pig_prod.data_details){ 
                        data_pig_prod.data_details.list_prod_feed = response.data;
                    }
                    
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
    

    
    this.requestNotesList = function(data_pig_prod, callback_success, 
            elem_show_error){
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod_notes/list?pig_prod_hid=${pig_prod_hid}`;
        
        
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
                    
                    data_pig_prod.data_details.list_health_issues = health_issues;
                    data_pig_prod.data_details.list_notes        = notes;
                    
                    
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
    
    
    this.requestDataProdFeedBalanceList = function(data_pig_prod, 
            callback_success, elem_show_error){
        
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/feed_balance/list?pig_prod_hid=${pig_prod_hid}`;
        
        
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
                   data_pig_prod.data_details.list_feed_balance = response.data;
                    
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
    
    
    this.requestDataProdHarvestList = function(data_pig_prod, 
            callback_success, elem_show_error){
        
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/prod_harvest/list?pig_prod_hid=${pig_prod_hid}`;
        
        
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
                   data_pig_prod.data_details.list_harvest = response.data;
                    
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
    
    
    
    
    
    /* Will remove pig_prod_entry from given prod_list.
    * @param prod_list - either 
        this.dataGestatingList
        this.dataLactatingList
        this.dataFatteningList
    
    
    */
    this.removeFromProdList = function(pig_prod_hid, prod_list){
        let index;
        let cur_entry;
        
        for(index = 0; index<prod_list.length; index++){
            cur_entry = prod_list[index];
            
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
            cur_entry = prod_list[index];
            
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
        will remove the old gestating entry in thisObj.dataGestatingList 
        and replace with new_prod_entry.
        
        2.) If there is a change in status, from PROD_STATUS.GESTATING to
        PROD_STATUS.LACTATING, 
        
        - will remove the old gestating entry in thisObj.dataGestatingList
        
        - will request for production list with PROD_STATUS.LACTATING;
        20260129: still thinking if not to request for the whole lactating list 
        instead insert new_prod_entry in thisObj.dataLactatingList; 
        requesting whole lactating list is an expensive operation.
        
        
        */
        
        let index;
        let cur_entry;
        
        for(index = 0; index<thisObj.dataGestatingList.length; index++){
            cur_entry = thisObj.dataGestatingList[index];
            
            if (cur_entry.pig_production.hid ==  new_prod_entry.pig_production.hid){
                const old_prod_status = cur_entry.pig_production.prod_status_id;
                const new_prod_status = new_prod_entry.pig_production.prod_status_id;
                
                if (old_prod_status == new_prod_status){
                    thisObj.dataGestatingList.splice(index, 1, new_prod_entry);
                    return;
                }
                
                if (new_prod_entry.pig_production.hid == PROD_STATUS.LACTATING){
                    // Remove from old entry from gestating list
                    thisObj.dataGestatingList.splice(index, 1);
                    
                    
                    const pig_prod_type =  PIG_PROD_TYPE.LACTATING;
                    thisObj.requestPigProdList(pig_prod_type);

                }
                
            }
        }
    }


    /** 
     * Updating the PigProdList is an expensive process. It will refresh all this
     * list. Bacause updating a prod status from gesta to lacta or 
     * lacta to fattening should update two lists. And all the details of the
     * pig_prod that were previously requested will be lost and need to be 
     * requested again.
     * 
     * this.dataGestatingList
     * this.dataLactatingList
     * this.dataFatteningList
     * 
     * 2026-03-10 Notes:
     * - There is a future plan for realtime updates; 
     * 
     * - As of this date this is implemented via a request of data version numbers. 
     * This request is light weight - will just return version numbers. 
     * The requested version numbers should be compared with the current 
     * saved ones. If the requested version number 
     * is higher than the current version number, it should request data.
     * */
    this.checkIfToUpdateDataPigProdList = function(callback_success, elem_show_error){
        let new_ver_num_pig_prod = null;
        
        const callback_success_pig_prod_list = function(data){
            // Need to update this version_num.
            parentObj.dataVerNum.pig_prod = new_ver_num_pig_prod;
            if (callback_success){
                callback_success();
            }
        };
        
        
        const callback_success_ver_num = function(data){
            const data_ver_num = data.data_ver_num;
                
            /*
            parentObj.dataVerNum = {
                sow:                    data_ver_num.sow,
                boar:                   data_ver_num.boar,
                pig_prod:               data_ver_num.pig_prod,
                staff:                  data_ver_num.staff,
                feed_buy:               data_ver_num.feed_buy,
                not_pregnant:           data_ver_num.not_pregnant
            };
            */
            
            if (parentObj.dataVerNum.pig_prod != data_ver_num.pig_prod){
                new_ver_num_pig_prod = data_ver_num.pig_prod;
                
                const pig_prod_type  = PIG_PROD_TYPE.ALL;
                thisObj.requestPigProdList(pig_prod_type, 
                    callback_success_pig_prod_list, elem_show_error);
            } 
            else{
                // No data change;
                callback_success();
            }  
        };
        
        parentObj.requestPigFarmDataVerNum(callback_success_ver_num, 
            elem_show_error);
        
    }

}
