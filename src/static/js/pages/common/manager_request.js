// December 18, 2025
// Jack Wong
// j2718wong@gmail.com
'use strict';



export function ManagerRequest(_navigation){
    const thisObj           = this;
    const navigation        = _navigation;
    

    this.requestDataPigProdPublic = function(country_hid, callback_success){
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/public?country_hid=${country_hid}`;
        
        
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
    
    
    
    
    
}






