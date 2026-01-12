// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {SUPPLIER_TYPE}          from '../../constants.js';


export function AccountLists(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
	
    let listSemenSupplier       = null;
    let listFeedSupplier        = null;
    
    
    let accountHid      = null;
    
    
    this.setPigFarmAccountHid = function(hid){
        accountHid = hid;
    }
    
    
    this.getListSemenSupplier = function(){
        return listSemenSupplier;
    }
    
    
    this.getListFeedSupplier = function(){
        return listFeedSupplier;
    }
    
    
    this.requestSupplier = function(supplier_type, callback){
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
                            listFeedSupplier = response.data;
                            break;
                        }
                        
                        case SUPPLIER_TYPE.SEMEN:{
                            listSemenSupplier = response.data;
                            break;
                        }
                        
                        case SUPPLIER_TYPE.GILT:{
                            
                            break;
                        }
                    }
                    
                    
                    if (callback){callback(response.data);}
                }
                else {
                    // TODO
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