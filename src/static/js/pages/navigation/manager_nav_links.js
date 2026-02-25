// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_OPERATION_TYPE,
        PAGE_ID,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';
        

export function ManagerNavLinks(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
      
    let elemDesktopNavSettings          = null;
    let elemDesktopNavSowBoarGilt       = null;
    let elemDesktopNavProduction        = null;
    let elemDesktopNavOperations        = null;
    let elemDesktopNavFinancials        = null;
    let elemDesktopNavAccountLists      = null;
    let elemDesktopNavAdmin             = null;
        
    let elemMobileNavSettings           = null;
    let elemMobileNavSowBoarGilt        = null;
    let elemMobileNavProduction         = null;
    let elemMobileNavOperations         = null;
    let elemMobileNavFinancials         = null;
    let elemMobileNavAccountLists       = null;
    let elemMobileNavAdmin              = null;
    
    let elemDesktopNavProduction1       = null;
    let elemDesktopNavProduction2       = null;
    let elemDesktopNavProduction3       = null;
    let elemDesktopNavProduction4       = null;
    let elemDesktopNavProduction5       = null;
                                        
                                        
    let elemDesktopNavSowBoarGilt1      = null;
    let elemDesktopNavSowBoarGilt2      = null;
    let elemDesktopNavSowBoarGilt3      = null;
    let elemDesktopNavSowBoarGilt4      = null;
    let elemDesktopNavSowBoarGilt5      = null;
                                    
                                        
                                        
    let elemDesktopNavOperations1       = null;
    let elemDesktopNavOperations2       = null;
    let elemDesktopNavOperations3       = null;
                                        
                                        
    let elemDesktopNavFinancials1       = null;
    let elemDesktopNavFinancials2       = null;
    let elemDesktopNavFinancials3       = null;
                                        
                                        
    let elemDesktopNavAccountLists1     = null;
    let elemDesktopNavAccountLists2     = null;
    let elemDesktopNavAccountLists3     = null;
    let elemDesktopNavAccountLists4     = null;
    let elemDesktopNavAccountLists5     = null;
                                        
                                        
    let elemDesktopNavSettings1         = null;
    let elemDesktopNavSettings2         = null;
    let elemDesktopNavSettings3         = null;
    let elemDesktopNavSettings4         = null;
    let elemDesktopNavSettings5         = null;
    let elemDesktopNavSettings6         = null;


    let elemDesktopNavAdmin1            = null;
    let elemDesktopNavAdmin2            = null;



    let elemMobileNavProduction1        = null;
    let elemMobileNavProduction2        = null;
    let elemMobileNavProduction3        = null;
    let elemMobileNavProduction4        = null;
    let elemMobileNavProduction5        = null;
                                        
                                        
    let elemMobileNavSowBoarGilt1       = null;
    let elemMobileNavSowBoarGilt2       = null;
    let elemMobileNavSowBoarGilt3       = null;
    let elemMobileNavSowBoarGilt4       = null;
    let elemMobileNavSowBoarGilt5       = null;
                                        
                                        
    let elemMobileNavOperations1        = null;
    let elemMobileNavOperations2        = null;
    let elemMobileNavOperations3        = null;
                                        
                                        
    let elemMobileNavFinancials1        = null;
    let elemMobileNavFinancials2        = null;
    let elemMobileNavFinancials3        = null;
                                        
                                        
    let elemMobileNavAccountLists1      = null;
    let elemMobileNavAccountLists2      = null;
    let elemMobileNavAccountLists3      = null;
    let elemMobileNavAccountLists4      = null;
    let elemMobileNavAccountLists5      = null;
                                        
                                        
    let elemMobileNavSettings1          = null;
    let elemMobileNavSettings2          = null;
    let elemMobileNavSettings3          = null;
    let elemMobileNavSettings4          = null;
    let elemMobileNavSettings5          = null;
    let elemMobileNavSettings6          = null;
                                        
                                        
    let elemMobileNavAdmin1             = null;
    let elemMobileNavAdmin2             = null;
    
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        
        const nav_second_line           = document.querySelector('.nav-second-line');
        
        elemDesktopNavProduction        = nav_second_line.querySelector('#desktop-nav-production');
        elemDesktopNavSowBoarGilt       = nav_second_line.querySelector('#desktop-nav-sow-boar-gilt');
        elemDesktopNavOperations        = nav_second_line.querySelector('#desktop-nav-operations');
        elemDesktopNavFinancials        = nav_second_line.querySelector('#desktop-nav-financials');
        elemDesktopNavAccountLists      = nav_second_line.querySelector('#desktop-nav-account-lists');
        elemDesktopNavSettings          = nav_second_line.querySelector('#desktop-nav-settings');
        elemDesktopNavAdmin             = nav_second_line.querySelector('#desktop-nav-admin');
                                          
        
        const mobile_nav                = document.querySelector('#mobileNav');
                                          
        elemMobileNavSowBoarGilt        = mobile_nav.querySelector('#mobile-nav-sow-boar-gilt');
        elemMobileNavProduction         = mobile_nav.querySelector('#mobile-nav-production');
        elemMobileNavOperations         = mobile_nav.querySelector('#mobile-nav-operations');
        elemMobileNavFinancials         = mobile_nav.querySelector('#mobile-nav-financials');
        elemMobileNavAccountLists       = mobile_nav.querySelector('#mobile-nav-account-lists');
        elemMobileNavSettings           = mobile_nav.querySelector('#mobile-nav-settings');
        elemMobileNavAdmin              = mobile_nav.querySelector('#mobile-nav-admin');

        
        elemDesktopNavProduction1       = elemDesktopNavProduction.querySelector('#desktop-nav-production-1');
        elemDesktopNavProduction2       = elemDesktopNavProduction.querySelector('#desktop-nav-production-2');
        elemDesktopNavProduction3       = elemDesktopNavProduction.querySelector('#desktop-nav-production-3');
        elemDesktopNavProduction4       = elemDesktopNavProduction.querySelector('#desktop-nav-production-4');
        elemDesktopNavProduction5       = elemDesktopNavProduction.querySelector('#desktop-nav-production-5');
    
        
        elemDesktopNavSowBoarGilt1      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-1');
        elemDesktopNavSowBoarGilt2      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-2');
        elemDesktopNavSowBoarGilt3      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-3');
        elemDesktopNavSowBoarGilt4      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-4');
        elemDesktopNavSowBoarGilt5      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-5');
    
        
        elemDesktopNavOperations1       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-1');
        elemDesktopNavOperations2       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-2');
        elemDesktopNavOperations3       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-3');
    
    
        elemDesktopNavFinancials1       = elemDesktopNavFinancials.querySelector('#desktop-nav-financials-1');  
        elemDesktopNavFinancials2       = elemDesktopNavFinancials.querySelector('#desktop-nav-financials-2');  
        elemDesktopNavFinancials3       = elemDesktopNavFinancials.querySelector('#desktop-nav-financials-3');  
        
        
        elemDesktopNavAccountLists1     = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-1');
        elemDesktopNavAccountLists2     = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-2');
        elemDesktopNavAccountLists3     = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-3');
        elemDesktopNavAccountLists4     = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-4');
        elemDesktopNavAccountLists5     = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-5');
        
        
        elemDesktopNavSettings1         = elemDesktopNavSettings.querySelector('#desktop-nav-settings-1');
        elemDesktopNavSettings2         = elemDesktopNavSettings.querySelector('#desktop-nav-settings-2');
        elemDesktopNavSettings3         = elemDesktopNavSettings.querySelector('#desktop-nav-settings-3');
        elemDesktopNavSettings4         = elemDesktopNavSettings.querySelector('#desktop-nav-settings-4');
        elemDesktopNavSettings5         = elemDesktopNavSettings.querySelector('#desktop-nav-settings-5');
        elemDesktopNavSettings6         = elemDesktopNavSettings.querySelector('#desktop-nav-settings-6');
        
        
        elemDesktopNavAdmin1            = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-1');
        elemDesktopNavAdmin2            = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-2');
        
        
        
        elemMobileNavProduction1        = elemMobileNavProduction.querySelector('#mobile-subnav-production-1');
        elemMobileNavProduction2        = elemMobileNavProduction.querySelector('#mobile-subnav-production-2');
        elemMobileNavProduction3        = elemMobileNavProduction.querySelector('#mobile-subnav-production-3');
        elemMobileNavProduction4        = elemMobileNavProduction.querySelector('#mobile-subnav-production-4');
        elemMobileNavProduction5        = elemMobileNavProduction.querySelector('#mobile-subnav-production-5');
        
            
        elemMobileNavSowBoarGilt1       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-1');
        elemMobileNavSowBoarGilt2       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-2');
        elemMobileNavSowBoarGilt3       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-3');
        elemMobileNavSowBoarGilt4       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-4');
        elemMobileNavSowBoarGilt5       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-5');
        
            
        elemMobileNavOperations1        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-1');
        elemMobileNavOperations2        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-2');
        elemMobileNavOperations3        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-3');
        
        
        elemMobileNavFinancials1        = elemMobileNavFinancials.querySelector('#mobile-subnav-financials-1');  
        elemMobileNavFinancials2        = elemMobileNavFinancials.querySelector('#mobile-subnav-financials-2');  
        elemMobileNavFinancials3        = elemMobileNavFinancials.querySelector('#mobile-subnav-financials-3');  
            
            
        elemMobileNavAccountLists1      = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-1');
        elemMobileNavAccountLists2      = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-2');
        elemMobileNavAccountLists3      = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-3');
        elemMobileNavAccountLists4      = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-4');
        elemMobileNavAccountLists5      = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-5');
            
            
        elemMobileNavSettings1          = elemMobileNavSettings.querySelector('#mobile-subnav-settings-1');
        elemMobileNavSettings2          = elemMobileNavSettings.querySelector('#mobile-subnav-settings-2');
        elemMobileNavSettings3          = elemMobileNavSettings.querySelector('#mobile-subnav-settings-3');
        elemMobileNavSettings4          = elemMobileNavSettings.querySelector('#mobile-subnav-settings-4');
        elemMobileNavSettings5          = elemMobileNavSettings.querySelector('#mobile-subnav-settings-5');
        elemMobileNavSettings6          = elemMobileNavSettings.querySelector('#mobile-subnav-settings-6');
            
            
        elemMobileNavAdmin1             = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-1');
        elemMobileNavAdmin2             = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-2');
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        
    }

    
    this._bindEventListeners = function(){
        elemDesktopNavProduction1.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(0, PIG_OPERATION_TYPE.GESTATING);
        });
          
        elemDesktopNavProduction2.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(0, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        });
          
        elemDesktopNavProduction3.addEventListener('click', function() {
            navigation._onClickNavProdFattening(0);
        });
          
        elemDesktopNavProduction4.addEventListener('click', function() {
            navigation._onClickNavProdHistory(0);
        });
          
        elemDesktopNavProduction5.addEventListener('click', function() {
            navigation._onClickNavProdNotPregnant(0);
        });  
        
        
    

        elemDesktopNavSowBoarGilt1.addEventListener('click', function() {
            navigation._onClickNavSowBoar(0, SOW_BOAR_TYPE.SOW);
        });
         
        elemDesktopNavSowBoarGilt2.addEventListener('click', function() {
            navigation._onClickNavSowBoar(0, SOW_BOAR_TYPE.BOAR);
        });
         
        elemDesktopNavSowBoarGilt3.addEventListener('click', function() {
            navigation._onClickNavSowBoar(0, SOW_BOAR_TYPE.GILT);
        });
         
        elemDesktopNavSowBoarGilt4.addEventListener('click', function() {
            navigation._onClickNavSowBoar(0, SOW_BOAR_TYPE.DISPOSED);
        });
         
        elemDesktopNavSowBoarGilt5.addEventListener('click', function() {
            navigation._onClickNavParentTrace(0);
        }); 



        elemDesktopNavOperations1.addEventListener('click', function() {
            
        });
          
        elemDesktopNavOperations2.addEventListener('click', function() {
            navigation._onClickNavReports(0);
        });
          
        elemDesktopNavOperations3.addEventListener('click', function() {
            navigation._onClickNavFeedCalculator(0);
        });  



        elemDesktopNavFinancials1.addEventListener('click', function() {
            navigation._onClickNavProdSales(0);
        });
          
        elemDesktopNavFinancials2.addEventListener('click', function() {
            navigation._onClickNavFeedsExpenses(0);
        });
          
        elemDesktopNavFinancials3.addEventListener('click', function() {
            navigation._onClickNavNonFeedsExpenses(0);
        });  


            

        elemDesktopNavAccountLists1.addEventListener('click', function() {
            navigation._onClickNavStaff(0);
        });
        
        elemDesktopNavAccountLists2.addEventListener('click', function() {
            navigation._onClickPigBuyers(0);
        });
        
        elemDesktopNavAccountLists3.addEventListener('click', function() {
            navigation._onClickFeedSuppliers(0);
        });
        
        elemDesktopNavAccountLists4.addEventListener('click', function() {
            navigation._onClickSemenSuppliers(0);
        });
        
        elemDesktopNavAccountLists5.addEventListener('click', function() {
            navigation._onClickGiltSuppliers(0);
        });



        elemDesktopNavSettings1.addEventListener('click', function() {
            navigation._onClickNavOpsSettings(0);
        });   
         
        elemDesktopNavSettings2.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(0, PIG_OPERATION_TYPE.GESTATING);
        }); 
           
        elemDesktopNavSettings3.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(0, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        }); 
           
        elemDesktopNavSettings4.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(0, PIG_OPERATION_TYPE.LACTATING_SOW);
        }); 
           
        elemDesktopNavSettings5.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(0, PIG_OPERATION_TYPE.WEANING_SOW);
        });  
         
        elemDesktopNavSettings6.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(0, PIG_OPERATION_TYPE.GILT);
        });    



        elemDesktopNavAdmin1.addEventListener('click', function() {
            navigation._onClickNavUsers(0);
        });       
        
        elemDesktopNavAdmin2.addEventListener('click', function() {
            navigation._onClickNavUsersRequest(0);
        });       



        elemMobileNavProduction1.addEventListener('click', function() {
             navigation._onClickNavProdGestaLacta(1, PIG_OPERATION_TYPE.GESTATING);
        }); 
          
        elemMobileNavProduction2.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(1, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        }); 
          
        elemMobileNavProduction3.addEventListener('click', function() {
            navigation._onClickNavProdFattening(1);
        }); 
          
        elemMobileNavProduction4.addEventListener('click', function() {
             navigation._onClickNavProdHistory(1);
        }); 
          
        elemMobileNavProduction5.addEventListener('click', function() {
            navigation._onClickNavProdNotPregnant(1);
        });   

            
            
        elemMobileNavSowBoarGilt1.addEventListener('click', function() {
            navigation._onClickNavSowBoar(1, SOW_BOAR_TYPE.SOW);
        });  
        
        elemMobileNavSowBoarGilt2.addEventListener('click', function() {
            navigation._onClickNavSowBoar(1, SOW_BOAR_TYPE.BOAR);
        });
          
        elemMobileNavSowBoarGilt3.addEventListener('click', function() {
            navigation._onClickNavSowBoar(1, SOW_BOAR_TYPE.GILT);
        });
          
        elemMobileNavSowBoarGilt4.addEventListener('click', function() {
            navigation._onClickNavSowBoar(1, SOW_BOAR_TYPE.DISPOSED);
        });
          
        elemMobileNavSowBoarGilt5.addEventListener('click', function() {
            navigation._onClickNavParentTrace(1);
        });  


            
        elemMobileNavOperations1.addEventListener('click', function() {
            
        });  
         
        elemMobileNavOperations2.addEventListener('click', function() {
            navigation._onClickNavReports(1);
        }); 
          
        elemMobileNavOperations3.addEventListener('click', function() {
            navigation._onClickNavFeedCalculator(1);
        });   



        elemMobileNavFinancials1.addEventListener('click', function() {
            navigation._onClickNavProdSales(1);
        }); 
          
        elemMobileNavFinancials2.addEventListener('click', function() {
            navigation._onClickNavFeedsExpenses(1);
        });  
         
        elemMobileNavFinancials3.addEventListener('click', function() {
            navigation._onClickNavNonFeedsExpenses(1);
        });   
            
            
            
        elemMobileNavAccountLists1.addEventListener('click', function() {
            navigation._onClickNavStaff(1);
        }); 
        
        elemMobileNavAccountLists2.addEventListener('click', function() {
            navigation._onClickPigBuyers(1);
        }); 
        
        elemMobileNavAccountLists3.addEventListener('click', function() {
             navigation._onClickFeedSuppliers(1);
        }); 
        
        elemMobileNavAccountLists4.addEventListener('click', function() {
             navigation._onClickSemenSuppliers(1);
        }); 
        
        elemMobileNavAccountLists5.addEventListener('click', function() {
             navigation._onClickGiltSuppliers(1);
        }); 
            
            
            
        elemMobileNavSettings1.addEventListener('click', function() {
            navigation._onClickNavOpsSettings(1);
        });
             
        elemMobileNavSettings2.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(1, PIG_OPERATION_TYPE.GESTATING);
        }); 
            
        elemMobileNavSettings3.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(1, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        });  
           
        elemMobileNavSettings4.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(1, PIG_OPERATION_TYPE.LACTATING_SOW);
        });
             
        elemMobileNavSettings5.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(1, PIG_OPERATION_TYPE.WEANING_SOW);
        }); 
            
        elemMobileNavSettings6.addEventListener('click', function() {
            navigation._onClickNavAccPigOps(1, PIG_OPERATION_TYPE.GILT);
        });     
            
            
        elemMobileNavAdmin1.addEventListener('click', function() {
            navigation._onClickNavUsers(1);
        });   
            
        elemMobileNavAdmin2.addEventListener('click', function() {
            navigation._onClickNavUsersRequest(1);
        });        
    }
    
    
}
