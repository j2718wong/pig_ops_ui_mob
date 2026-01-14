// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {SUPPLIER_TYPE}          from '../../constants.js';


export function AccountLists(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    this.dataSemenSupplierList  = null;
    this.dataFeedSupplierList   = null;
    this.dataGiltSupplierList   = null;
    
    this.dataAccMedVacList      = null;
    
    
    let accountHid      = null;
    
    
    this.setPigFarmAccountHid = function(hid){
        accountHid = hid;
    }
    
    
    
    this.requestDataSupplier = function(supplier_type, callback_success, elem_show_error){
        let param = '';
        
        switch (supplier_type){
            case SUPPLIER_TYPE.FEED:{
                param = 'is_fs';
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN:{
                param = 'is_ss';
                break;
            }
            
            case SUPPLIER_TYPE.GILT:{
                param = 'is_gs';
                break;
            }
        }
        
        
        const base_url = window.location.origin;
        const url = `${base_url}/supplier/list?ahid=${accountHid}&country_id&${param}=1`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    switch (supplier_type){
                        case SUPPLIER_TYPE.FEED:{
                            thisObj.dataFeedSupplierList = response.data;
                            break;
                        }
                        
                        case SUPPLIER_TYPE.SEMEN:{
                            thisObj.dataSemenSupplierList = response.data;
                            break;
                        }
                        
                        case SUPPLIER_TYPE.GILT:{
                            this.dataGiltSupplierList   = response.data;
                            break;
                        }
                    }
                    
                    
                    if (callback_success){callback_success(response.data);}
                }
                else {
                    navigation.errorServerMessage.receivedErrorMessage(
                        response, elem_show_error);
                    
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
        
    }
    
    
    this.requestDataAccMedVacList = function()(callback_success, elem_show_error){
        
        // Need to request medvac brands
        const base_url = window.location.origin;
        const url = `${base_url}/acc_medvac/list?ahid=${accountHid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataAccMedVacList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
                    }
                }
                else {
                    navigation.errorServerMessage.receivedErrorMessage(
                        response, elem_show_error);
                    
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
    
}