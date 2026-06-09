// manager_nav_links.js

// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {ACC_USER_GROUP,
        FLAG_BITS,
        PIG_OPERATION_TYPE,
        PAGE_ID,
        HASH_ROUTES,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        SUPPLIER_TYPE}              from '../../constants.js';
        
        

export function ManagerNavLinks(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    let elemDesktopFarmSummary          = null;
    let elemMobileFarmSummary           = null;
    
      
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
    let elemDesktopNavProduction6       = null;
                                        
                                        
    let elemDesktopNavSowBoarGilt1      = null;
    let elemDesktopNavSowBoarGilt2      = null;
    let elemDesktopNavSowBoarGilt3      = null;
    let elemDesktopNavSowBoarGilt4      = null;
    let elemDesktopNavSowBoarGilt5      = null;
                                        
                                        
    let elemDesktopNavOperations1       = null;
    let elemDesktopNavOperations2       = null;
    let elemDesktopNavOperations3       = null;
    let elemDesktopNavOperations4       = null;
    let elemDesktopNavOperations5       = null;
    let elemDesktopNavOperations6       = null;                                    
                                        
                                        
    let elemDesktopNavFinancials1       = null;
    let elemDesktopNavFinancials2       = null;
    let elemDesktopNavFinancials3       = null;
    let elemDesktopNavFinancials4       = null;
                                        
                                        
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
    let elemDesktopNavAdmin3            = null;
    let elemDesktopNavAdmin4            = null;


    let elemMobileNavProduction1        = null;
    let elemMobileNavProduction2        = null;
    let elemMobileNavProduction3        = null;
    let elemMobileNavProduction4        = null;
    let elemMobileNavProduction5        = null;
    let elemMobileNavProduction6        = null;
                                        
                                        
    let elemMobileNavSowBoarGilt1       = null;
    let elemMobileNavSowBoarGilt2       = null;
    let elemMobileNavSowBoarGilt3       = null;
    let elemMobileNavSowBoarGilt4       = null;
    let elemMobileNavSowBoarGilt5       = null;
                                        
                                        
    let elemMobileNavOperations1        = null;
    let elemMobileNavOperations2        = null;
    let elemMobileNavOperations3        = null;
    let elemMobileNavOperations4        = null;
    let elemMobileNavOperations5        = null;
    let elemMobileNavOperations6        = null;
                                        
                                        
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
    let elemMobileNavAdmin3             = null;
    let elemMobileNavAdmin4             = null;
    
    
    // Desktop menu labels (parent menu items)
    let elemDesktopNavLabelProduction      = null;
    let elemDesktopNavLabelSowBoarGilt     = null;
    let elemDesktopNavLabelOperations      = null;
    let elemDesktopNavLabelFinancials      = null;
    let elemDesktopNavLabelAccountLists    = null;
    let elemDesktopNavLabelSettings        = null;
    let elemDesktopNavLabelAdmin           = null;

    // Desktop submenu labels
    let elemDesktopNavLabelProduction1      = null;
    let elemDesktopNavLabelProduction2      = null;
    let elemDesktopNavLabelProduction3      = null;
    let elemDesktopNavLabelProduction4      = null;
    let elemDesktopNavLabelProduction5      = null;
    let elemDesktopNavLabelProduction6      = null;
    
    let elemDesktopNavLabelSowBoarGilt1     = null;
    let elemDesktopNavLabelSowBoarGilt2     = null;
    let elemDesktopNavLabelSowBoarGilt3     = null;
    let elemDesktopNavLabelSowBoarGilt4     = null;
    let elemDesktopNavLabelSowBoarGilt5     = null;
    
    let elemDesktopNavLabelOperations1      = null;
    let elemDesktopNavLabelOperations2      = null;
    let elemDesktopNavLabelOperations3      = null;
    let elemDesktopNavLabelOperations4      = null;
    let elemDesktopNavLabelOperations5      = null;
    let elemDesktopNavLabelOperations6      = null;
    
    let elemDesktopNavLabelFinancials1      = null;
    let elemDesktopNavLabelFinancials2      = null;
    let elemDesktopNavLabelFinancials3      = null;
    
    let elemDesktopNavLabelAccountLists1    = null;
    let elemDesktopNavLabelAccountLists2    = null;
    let elemDesktopNavLabelAccountLists3    = null;
    let elemDesktopNavLabelAccountLists4    = null;
    let elemDesktopNavLabelAccountLists5    = null;
    
    let elemDesktopNavLabelSettings1        = null;
    let elemDesktopNavLabelSettings2        = null;
    let elemDesktopNavLabelSettings3        = null;
    let elemDesktopNavLabelSettings4        = null;
    let elemDesktopNavLabelSettings5        = null;
    let elemDesktopNavLabelSettings6        = null;
    
    let elemDesktopNavLabelAdmin1           = null;
    let elemDesktopNavLabelAdmin2           = null;
    let elemDesktopNavLabelAdmin3           = null;
    let elemDesktopNavLabelAdmin4           = null;
    

    // Mobile menu labels (parent menu items)
    let elemMobileNavLabelProduction        = null;
    let elemMobileNavLabelSowBoarGilt       = null;
    let elemMobileNavLabelOperations        = null;
    let elemMobileNavLabelFinancials        = null;
    let elemMobileNavLabelAccountLists      = null;
    let elemMobileNavLabelSettings          = null;
    let elemMobileNavLabelAdmin             = null;

    // Mobile submenu labels
    let elemMobileNavLabelProduction1       = null;
    let elemMobileNavLabelProduction2       = null;
    let elemMobileNavLabelProduction3       = null;
    let elemMobileNavLabelProduction4       = null;
    let elemMobileNavLabelProduction5       = null;
    let elemMobileNavLabelProduction6       = null;
    
    let elemMobileNavLabelSowBoarGilt1      = null;
    let elemMobileNavLabelSowBoarGilt2      = null;
    let elemMobileNavLabelSowBoarGilt3      = null;
    let elemMobileNavLabelSowBoarGilt4      = null;
    let elemMobileNavLabelSowBoarGilt5      = null;
    
    let elemMobileNavLabelOperations1       = null;
    let elemMobileNavLabelOperations2       = null;
    let elemMobileNavLabelOperations3       = null;
    let elemMobileNavLabelOperations4       = null;
    let elemMobileNavLabelOperations5       = null;
    let elemMobileNavLabelOperations6       = null;
    
    let elemMobileNavLabelFinancials1       = null;
    let elemMobileNavLabelFinancials2       = null;
    let elemMobileNavLabelFinancials3       = null;
    
    let elemMobileNavLabelAccountLists1     = null;
    let elemMobileNavLabelAccountLists2     = null;
    let elemMobileNavLabelAccountLists3     = null;
    let elemMobileNavLabelAccountLists4     = null;
    let elemMobileNavLabelAccountLists5     = null;
    
    let elemMobileNavLabelSettings1         = null;
    let elemMobileNavLabelSettings2         = null;
    let elemMobileNavLabelSettings3         = null;
    let elemMobileNavLabelSettings4         = null;
    let elemMobileNavLabelSettings5         = null;
    let elemMobileNavLabelSettings6         = null;
    
    let elemMobileNavLabelAdmin1            = null;
    let elemMobileNavLabelAdmin2            = null;
    let elemMobileNavLabelAdmin3            = null;
    let elemMobileNavLabelAdmin4            = null;
    
    
    
    
    
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
        
        elemDesktopFarmSummary          = nav_second_line.querySelector('#desktop-nav-special-btn-summary');
        
        elemDesktopNavProduction        = nav_second_line.querySelector('#desktop-nav-production');
        elemDesktopNavSowBoarGilt       = nav_second_line.querySelector('#desktop-nav-sow-boar-gilt');
        elemDesktopNavOperations        = nav_second_line.querySelector('#desktop-nav-operations');
        elemDesktopNavFinancials        = nav_second_line.querySelector('#desktop-nav-financials');
        elemDesktopNavAccountLists      = nav_second_line.querySelector('#desktop-nav-account-lists');
        elemDesktopNavSettings          = nav_second_line.querySelector('#desktop-nav-settings');
        elemDesktopNavAdmin             = nav_second_line.querySelector('#desktop-nav-admin');
                                          
        
        const mobile_nav                = document.querySelector('#mobileNav');
        
        elemMobileFarmSummary           = mobile_nav.querySelector('#mobile-nav-special-btn-summary');
                                          
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
        elemDesktopNavProduction6       = elemDesktopNavProduction.querySelector('#desktop-nav-production-6');
        
        
        elemDesktopNavSowBoarGilt1      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-1');
        elemDesktopNavSowBoarGilt2      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-2');
        elemDesktopNavSowBoarGilt3      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-3');
        elemDesktopNavSowBoarGilt4      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-4');
        elemDesktopNavSowBoarGilt5      = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-5');
    
        
        elemDesktopNavOperations1       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-1');
        elemDesktopNavOperations2       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-2');
        elemDesktopNavOperations3       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-3');
        elemDesktopNavOperations4       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-4');
        elemDesktopNavOperations5       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-5');
        elemDesktopNavOperations6       = elemDesktopNavOperations.querySelector('#desktop-nav-operations-6');
        
    
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
        elemDesktopNavAdmin3            = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-3');
        elemDesktopNavAdmin4            = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-4');
        
        
        elemMobileNavProduction1        = elemMobileNavProduction.querySelector('#mobile-subnav-production-1');
        elemMobileNavProduction2        = elemMobileNavProduction.querySelector('#mobile-subnav-production-2');
        elemMobileNavProduction3        = elemMobileNavProduction.querySelector('#mobile-subnav-production-3');
        elemMobileNavProduction4        = elemMobileNavProduction.querySelector('#mobile-subnav-production-4');
        elemMobileNavProduction5        = elemMobileNavProduction.querySelector('#mobile-subnav-production-5');
        elemMobileNavProduction6        = elemMobileNavProduction.querySelector('#mobile-subnav-production-6');
        
            
        elemMobileNavSowBoarGilt1       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-1');
        elemMobileNavSowBoarGilt2       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-2');
        elemMobileNavSowBoarGilt3       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-3');
        elemMobileNavSowBoarGilt4       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-4');
        elemMobileNavSowBoarGilt5       = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-5');
        
            
        elemMobileNavOperations1        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-1');
        elemMobileNavOperations2        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-2');
        elemMobileNavOperations3        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-3');
        elemMobileNavOperations4        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-4');
        elemMobileNavOperations5        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-5');
        elemMobileNavOperations6        = elemMobileNavOperations.querySelector('#mobile-subnav-operations-6');
        
        
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
        elemMobileNavAdmin3             = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-3');
        elemMobileNavAdmin4             = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-4');
        
        
        this._findTranslatedElements();
    }
    
    
    this._findTranslatedElements = function(){

        // Desktop menu labels (parent menu items)
        elemDesktopNavLabelProduction       = document.querySelector('#desktop-nav-production .nav-label');
        elemDesktopNavLabelSowBoarGilt      = document.querySelector('#desktop-nav-sow-boar-gilt .nav-label');
        elemDesktopNavLabelOperations       = document.querySelector('#desktop-nav-operations .nav-label');
        elemDesktopNavLabelFinancials       = document.querySelector('#desktop-nav-financials .nav-label');
        elemDesktopNavLabelAccountLists     = document.querySelector('#desktop-nav-account-lists .nav-label');
        elemDesktopNavLabelSettings         = document.querySelector('#desktop-nav-settings .nav-label');
        elemDesktopNavLabelAdmin            = document.querySelector('#desktop-nav-admin .nav-label');
        
        // Desktop submenu labels - Production
        elemDesktopNavLabelProduction1      = elemDesktopNavProduction.querySelector('#desktop-nav-production-1 .nav-label');
        elemDesktopNavLabelProduction2      = elemDesktopNavProduction.querySelector('#desktop-nav-production-2 .nav-label');
        elemDesktopNavLabelProduction3      = elemDesktopNavProduction.querySelector('#desktop-nav-production-3 .nav-label');
        elemDesktopNavLabelProduction4      = elemDesktopNavProduction.querySelector('#desktop-nav-production-4 .nav-label');
        elemDesktopNavLabelProduction5      = elemDesktopNavProduction.querySelector('#desktop-nav-production-5 .nav-label');
        elemDesktopNavLabelProduction6      = elemDesktopNavProduction.querySelector('#desktop-nav-production-6 .nav-label');
        
        // Desktop submenu labels - Sow Boar Gilt
        elemDesktopNavLabelSowBoarGilt1     = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-1 .nav-label');
        elemDesktopNavLabelSowBoarGilt2     = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-2 .nav-label');
        elemDesktopNavLabelSowBoarGilt3     = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-3 .nav-label');
        elemDesktopNavLabelSowBoarGilt4     = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-4 .nav-label');
        elemDesktopNavLabelSowBoarGilt5     = elemDesktopNavSowBoarGilt.querySelector('#desktop-nav-sow-boar-gilt-5 .nav-label');
        
        // Desktop submenu labels - Operations
        elemDesktopNavLabelOperations1      = elemDesktopNavOperations.querySelector('#desktop-nav-operations-1 .nav-label');
        elemDesktopNavLabelOperations2      = elemDesktopNavOperations.querySelector('#desktop-nav-operations-2 .nav-label');
        elemDesktopNavLabelOperations3      = elemDesktopNavOperations.querySelector('#desktop-nav-operations-3 .nav-label');
        elemDesktopNavLabelOperations4      = elemDesktopNavOperations.querySelector('#desktop-nav-operations-4 .nav-label');
        elemDesktopNavLabelOperations5      = elemDesktopNavOperations.querySelector('#desktop-nav-operations-5 .nav-label');
        elemDesktopNavLabelOperations6      = elemDesktopNavOperations.querySelector('#desktop-nav-operations-6 .nav-label');
        
        
        // Desktop submenu labels - Financials
        elemDesktopNavLabelFinancials1      = elemDesktopNavFinancials.querySelector('#desktop-nav-financials-1 .nav-label');
        elemDesktopNavLabelFinancials2      = elemDesktopNavFinancials.querySelector('#desktop-nav-financials-2 .nav-label');
        elemDesktopNavLabelFinancials3      = elemDesktopNavFinancials.querySelector('#desktop-nav-financials-3 .nav-label');
        
        
        // Desktop submenu labels - Account Lists
        elemDesktopNavLabelAccountLists1    = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-1 .nav-label');
        elemDesktopNavLabelAccountLists2    = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-2 .nav-label');
        elemDesktopNavLabelAccountLists3    = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-3 .nav-label');
        elemDesktopNavLabelAccountLists4    = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-4 .nav-label');
        elemDesktopNavLabelAccountLists5    = elemDesktopNavAccountLists.querySelector('#desktop-nav-account-lists-5 .nav-label');
        
        // Desktop submenu labels - Settings
        elemDesktopNavLabelSettings1        = elemDesktopNavSettings.querySelector('#desktop-nav-settings-1 .nav-label');
        elemDesktopNavLabelSettings2        = elemDesktopNavSettings.querySelector('#desktop-nav-settings-2 .nav-label');
        elemDesktopNavLabelSettings3        = elemDesktopNavSettings.querySelector('#desktop-nav-settings-3 .nav-label');
        elemDesktopNavLabelSettings4        = elemDesktopNavSettings.querySelector('#desktop-nav-settings-4 .nav-label');
        elemDesktopNavLabelSettings5        = elemDesktopNavSettings.querySelector('#desktop-nav-settings-5 .nav-label');
        elemDesktopNavLabelSettings6        = elemDesktopNavSettings.querySelector('#desktop-nav-settings-6 .nav-label');
        
        // Desktop submenu labels - Admin
        elemDesktopNavLabelAdmin1           = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-1 .nav-label');
        elemDesktopNavLabelAdmin2           = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-2 .nav-label');
        elemDesktopNavLabelAdmin3           = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-3 .nav-label');
        elemDesktopNavLabelAdmin4           = elemDesktopNavAdmin.querySelector('#desktop-nav-admin-4 .nav-label');
        
        
        // Mobile menu labels (parent menu items)
        elemMobileNavLabelProduction        = document.querySelector('#mobile-nav-production .nav-label');
        elemMobileNavLabelSowBoarGilt       = document.querySelector('#mobile-nav-sow-boar-gilt .nav-label');
        elemMobileNavLabelOperations        = document.querySelector('#mobile-nav-operations .nav-label');
        elemMobileNavLabelFinancials        = document.querySelector('#mobile-nav-financials .nav-label');
        elemMobileNavLabelAccountLists      = document.querySelector('#mobile-nav-account-lists .nav-label');
        elemMobileNavLabelSettings          = document.querySelector('#mobile-nav-settings .nav-label');
        elemMobileNavLabelAdmin             = document.querySelector('#mobile-nav-admin .nav-label');
        
        // Mobile submenu labels - Production
        elemMobileNavLabelProduction1       = elemMobileNavProduction.querySelector('#mobile-subnav-production-1 .nav-label');
        elemMobileNavLabelProduction2       = elemMobileNavProduction.querySelector('#mobile-subnav-production-2 .nav-label');
        elemMobileNavLabelProduction3       = elemMobileNavProduction.querySelector('#mobile-subnav-production-3 .nav-label');
        elemMobileNavLabelProduction4       = elemMobileNavProduction.querySelector('#mobile-subnav-production-4 .nav-label');
        elemMobileNavLabelProduction5       = elemMobileNavProduction.querySelector('#mobile-subnav-production-5 .nav-label');
        elemMobileNavLabelProduction6       = elemMobileNavProduction.querySelector('#mobile-subnav-production-6 .nav-label');
        
        
        // Mobile submenu labels - Sow Boar Gilt
        elemMobileNavLabelSowBoarGilt1      = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-1 .nav-label');
        elemMobileNavLabelSowBoarGilt2      = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-2 .nav-label');
        elemMobileNavLabelSowBoarGilt3      = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-3 .nav-label');
        elemMobileNavLabelSowBoarGilt4      = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-4 .nav-label');
        elemMobileNavLabelSowBoarGilt5      = elemMobileNavSowBoarGilt.querySelector('#mobile-subnav-sow-boar-gilt-5 .nav-label');
        
        // Mobile submenu labels - Operations
        elemMobileNavLabelOperations1       = elemMobileNavOperations.querySelector('#mobile-subnav-operations-1 .nav-label');
        elemMobileNavLabelOperations2       = elemMobileNavOperations.querySelector('#mobile-subnav-operations-2 .nav-label');
        elemMobileNavLabelOperations3       = elemMobileNavOperations.querySelector('#mobile-subnav-operations-3 .nav-label');
        elemMobileNavLabelOperations4       = elemMobileNavOperations.querySelector('#mobile-subnav-operations-4 .nav-label');
        elemMobileNavLabelOperations5       = elemMobileNavOperations.querySelector('#mobile-subnav-operations-5 .nav-label');
        elemMobileNavLabelOperations6       = elemMobileNavOperations.querySelector('#mobile-subnav-operations-6 .nav-label');
        
        
        // Mobile submenu labels - Financials
        elemMobileNavLabelFinancials1       = elemMobileNavFinancials.querySelector('#mobile-subnav-financials-1 .nav-label');
        elemMobileNavLabelFinancials2       = elemMobileNavFinancials.querySelector('#mobile-subnav-financials-2 .nav-label');
        elemMobileNavLabelFinancials3       = elemMobileNavFinancials.querySelector('#mobile-subnav-financials-3 .nav-label');
        
        
        // Mobile submenu labels - Account Lists
        elemMobileNavLabelAccountLists1     = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-1 .nav-label');
        elemMobileNavLabelAccountLists2     = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-2 .nav-label');
        elemMobileNavLabelAccountLists3     = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-3 .nav-label');
        elemMobileNavLabelAccountLists4     = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-4 .nav-label');
        elemMobileNavLabelAccountLists5     = elemMobileNavAccountLists.querySelector('#mobile-subnav-account-lists-5 .nav-label');
        
        // Mobile submenu labels - Settings
        elemMobileNavLabelSettings1         = elemMobileNavSettings.querySelector('#mobile-subnav-settings-1 .nav-label');
        elemMobileNavLabelSettings2         = elemMobileNavSettings.querySelector('#mobile-subnav-settings-2 .nav-label');
        elemMobileNavLabelSettings3         = elemMobileNavSettings.querySelector('#mobile-subnav-settings-3 .nav-label');
        elemMobileNavLabelSettings4         = elemMobileNavSettings.querySelector('#mobile-subnav-settings-4 .nav-label');
        elemMobileNavLabelSettings5         = elemMobileNavSettings.querySelector('#mobile-subnav-settings-5 .nav-label');
        elemMobileNavLabelSettings6         = elemMobileNavSettings.querySelector('#mobile-subnav-settings-6 .nav-label');
        
        // Mobile submenu labels - Admin
        elemMobileNavLabelAdmin1            = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-1 .nav-label');
        elemMobileNavLabelAdmin2            = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-2 .nav-label');
        elemMobileNavLabelAdmin3            = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-3 .nav-label');
        elemMobileNavLabelAdmin4            = elemMobileNavAdmin.querySelector('#mobile-subnav-admin-4 .nav-label');
        
    }
    
    
    this._processAfterHtmlRender = function(){
        this.showHideNavLinks();
        this.onChangeLanguage();
        
    }

    
    this._bindEventListeners = function(){
        
        elemDesktopNavProduction1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdGestaLacta(false, PIG_OPERATION_TYPE.GESTATING, true);
        });
          
        elemDesktopNavProduction2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdGestaLacta(false, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        });
          
        elemDesktopNavProduction3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdFattening(false);
        });
          
        elemDesktopNavProduction4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdHistory(false);
        });
          
        elemDesktopNavProduction5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdOutput(false);
        });
          
        elemDesktopNavProduction6.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdNotPregnant(false);
        });  
        
        
    

        elemDesktopNavSowBoarGilt1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(false, SOW_BOAR_TYPE.SOW);
        });
         
        elemDesktopNavSowBoarGilt2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(false, SOW_BOAR_TYPE.BOAR);
        });
         
        elemDesktopNavSowBoarGilt3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(false, SOW_BOAR_TYPE.GILT);
        });
         
        elemDesktopNavSowBoarGilt4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(false, SOW_BOAR_TYPE.DISPOSED);
        });
         
        elemDesktopNavSowBoarGilt5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavParentTrace(false);
        }); 



        elemDesktopNavOperations1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFeedBalance(false);
        });
        
        elemDesktopNavOperations2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFarrowingSchedule(false);
        });
        
        elemDesktopNavOperations3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavBoarExternalMate(false);
        });

        elemDesktopNavOperations4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavPigDead(false);
        });

        elemDesktopNavOperations5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFarrowingChecklist(false, false);
        });

        elemDesktopNavOperations6.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFeedsConsumed(false);
        });

        

        elemDesktopNavFinancials1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdSales(false);
        });
          
        elemDesktopNavFinancials2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFeedsExpenses(false);
        });
        
          
        elemDesktopNavFinancials3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSummaryReports(false);
        });  


            

        elemDesktopNavAccountLists1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavStaff(false);
        });
        
        elemDesktopNavAccountLists2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickPigBuyers(false);
        });
        
        elemDesktopNavAccountLists3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickFeedSuppliers(false);
        });
        
        elemDesktopNavAccountLists4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickSemenSuppliers(false);
        });
        
        elemDesktopNavAccountLists5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickGiltSuppliers(false);
        });



        elemDesktopNavSettings1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccOpsSettings(false);
        });   
         
        elemDesktopNavSettings2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(false, PIG_OPERATION_TYPE.GESTATING);
        }); 
           
        elemDesktopNavSettings3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(false, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        }); 
           
        elemDesktopNavSettings4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(false, PIG_OPERATION_TYPE.LACTATING_SOW);
        }); 
           
        elemDesktopNavSettings5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(false, PIG_OPERATION_TYPE.WEANING_SOW);
        });  
         
        elemDesktopNavSettings6.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(false, PIG_OPERATION_TYPE.GILT);
        });    



        elemDesktopNavAdmin1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavUsers(false);
        });       
        
        elemDesktopNavAdmin2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccessCodes(false);
        });       

        /*
        elemDesktopNavAdmin3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavUsersRequest(false);
        });
        */
        elemDesktopNavAdmin4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSystemStats(false);
        });
        
        

        elemMobileNavProduction1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdGestaLacta(true, PIG_OPERATION_TYPE.GESTATING, true);
        }); 
          
        elemMobileNavProduction2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdGestaLacta(true, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        }); 
          
        elemMobileNavProduction3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdFattening(true);
        }); 
          
        elemMobileNavProduction4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdHistory(true);
        }); 
        
        elemMobileNavProduction5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdOutput(true);
        });
        
        elemMobileNavProduction6.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdNotPregnant(true);
        });   

            
            
        elemMobileNavSowBoarGilt1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(true, SOW_BOAR_TYPE.SOW);
        });  
        
        elemMobileNavSowBoarGilt2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(true, SOW_BOAR_TYPE.BOAR);
        });
          
        elemMobileNavSowBoarGilt3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(true, SOW_BOAR_TYPE.GILT);
        });
          
        elemMobileNavSowBoarGilt4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSowBoar(true, SOW_BOAR_TYPE.DISPOSED);
        });
          
        elemMobileNavSowBoarGilt5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavParentTrace(true);
        });  


            
        elemMobileNavOperations1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFeedBalance(true);
        });  
        
        elemMobileNavOperations2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFarrowingSchedule(true);
        }); 
        
        elemMobileNavOperations3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavBoarExternalMate(true);
        }); 
        
        elemMobileNavOperations4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavPigDead(true);
        });

        elemMobileNavOperations5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFarrowingChecklist(true, false);
        });

        elemMobileNavOperations6.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFeedsConsumed(true);
        }); 


        elemMobileNavFinancials1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavProdSales(true);
        }); 
          
        elemMobileNavFinancials2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavFeedsExpenses(true);
        });
         
        elemMobileNavFinancials3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSummaryReports(true);
        });   
            
            
            
        elemMobileNavAccountLists1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavStaff(true);
        }); 
        
        elemMobileNavAccountLists2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickPigBuyers(true);
        }); 
        
        elemMobileNavAccountLists3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickFeedSuppliers(true);
        }); 
        
        elemMobileNavAccountLists4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickSemenSuppliers(true);
        }); 
        
        elemMobileNavAccountLists5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj._onClickGiltSuppliers(true);
        }); 
            
            
            
        elemMobileNavSettings1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccOpsSettings(true);
        });
             
        elemMobileNavSettings2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(true, PIG_OPERATION_TYPE.GESTATING);
        }); 
            
        elemMobileNavSettings3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(true, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        });  
           
        elemMobileNavSettings4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(true, PIG_OPERATION_TYPE.LACTATING_SOW);
        });
             
        elemMobileNavSettings5.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(true, PIG_OPERATION_TYPE.WEANING_SOW);
        }); 
            
        elemMobileNavSettings6.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccPigOps(true, PIG_OPERATION_TYPE.GILT);
        });     
            
            
        elemMobileNavAdmin1.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavUsers(true);
        });   
        
            
        elemMobileNavAdmin2.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavAccessCodes(true);
        }); 
        
        /*
        elemMobileNavAdmin3.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavUsersRequest(true);
        });
        */        
        
        
        elemMobileNavAdmin4.addEventListener('click', function() {
            if (navigation.userControl.isAccountLocked()){
                navigation.showHomeDashBoard();
                return;
            }
            
            thisObj.onClickNavSystemStats(true);
        });
        
    }
    
    
    this.removeMenusForNonAdminAndManagement = function(){
        
        
        const group_num = navigation.userControl.dataUserAccount.user.user_group.group_num;
        
        if (group_num == ACC_USER_GROUP.FARM_STAFF || group_num == ACC_USER_GROUP.OPERATIONS){
            elemDesktopNavFinancials.remove();
            elemDesktopNavAdmin.remove();
            
            elemMobileNavFinancials.remove();
            elemMobileNavAdmin.remove();
        }
        
    
    }
    
    
    this.showHideNavLinks = function(){
        if (window.SUPERPIG_UI_SETTINGS.enable_referral > 0){
            elemDesktopNavAdmin3.style.display  = 'block';
            elemMobileNavAdmin3.style.display   = 'block';
        }
        else{
            elemDesktopNavAdmin3.style.display  = 'none';
            elemMobileNavAdmin3.style.display   = 'none';

        }
    }
    
    
    this.showHideNavLinksAfterUserSet = function(){
        const user = navigation.userControl.dataUserAccount.user.user;
        
        
        if ((user.flag & FLAG_BITS.USER.IS_SYS_ADMIN) > 0){
            elemDesktopNavAdmin4.style.display  = 'block';
            elemMobileNavAdmin4.style.display   = 'block';
        } else{
            elemDesktopNavAdmin4.style.display  = 'none';
            elemMobileNavAdmin4.style.display   = 'none';
        }
        
    }
    
    
    this.onChangeLanguage = function(){
        const translations = navigation.getTranslations();
        
        let translated_nav_links = null;
        
        if (translations){
            if (translations.navigation && translations.navigation.nav_links){
                translated_nav_links = translations.navigation.nav_links;
            }
        }
        
        if (translated_nav_links == null){
            return;
        }
        
        // Desktop parent menu labels
        if (elemDesktopNavLabelProduction) {
            elemDesktopNavLabelProduction.textContent = translated_nav_links.Production || "Production";
        }
        if (elemDesktopNavLabelSowBoarGilt) {
            elemDesktopNavLabelSowBoarGilt.textContent = translated_nav_links.SowBoarGilt || "Sow Boar Gilt";
        }
        if (elemDesktopNavLabelOperations) {
            elemDesktopNavLabelOperations.textContent = translated_nav_links.Operations || "Operations";
        }
        if (elemDesktopNavLabelFinancials) {
            elemDesktopNavLabelFinancials.textContent = translated_nav_links.Financials || "Financials";
        }
        if (elemDesktopNavLabelAccountLists) {
            elemDesktopNavLabelAccountLists.textContent = translated_nav_links.AccountLists || "Account Lists";
        }
        if (elemDesktopNavLabelSettings) {
            elemDesktopNavLabelSettings.textContent = translated_nav_links.Settings || "Settings";
        }
        if (elemDesktopNavLabelAdmin) {
            elemDesktopNavLabelAdmin.textContent = translated_nav_links.Admin || "Admin";
        }
        
        // Desktop production submenu labels
        if (elemDesktopNavLabelProduction1) {
            elemDesktopNavLabelProduction1.textContent = translated_nav_links.Production1 || "Prod Gesta";
        }
        if (elemDesktopNavLabelProduction2) {
            elemDesktopNavLabelProduction2.textContent = translated_nav_links.Production2 || "Prod Lacta";
        }
        if (elemDesktopNavLabelProduction3) {
            elemDesktopNavLabelProduction3.textContent = translated_nav_links.Production3 || "Fattening";
        }
        if (elemDesktopNavLabelProduction4) {
            elemDesktopNavLabelProduction4.textContent = translated_nav_links.Production4 || "Prod History";
        }
        if (elemDesktopNavLabelProduction5) {
            elemDesktopNavLabelProduction5.textContent = translated_nav_links.Production5 || "Prod Output";
        }
        if (elemDesktopNavLabelProduction6) {
            elemDesktopNavLabelProduction6.textContent = translated_nav_links.Production6 || "Not Pregnant";
        }
        
        // Desktop sow boar gilt submenu labels
        if (elemDesktopNavLabelSowBoarGilt1) {
            elemDesktopNavLabelSowBoarGilt1.textContent = translated_nav_links.SowBoarGilt1 || "Sows";
        }
        if (elemDesktopNavLabelSowBoarGilt2) {
            elemDesktopNavLabelSowBoarGilt2.textContent = translated_nav_links.SowBoarGilt2 || "Boars";
        }
        if (elemDesktopNavLabelSowBoarGilt3) {
            elemDesktopNavLabelSowBoarGilt3.textContent = translated_nav_links.SowBoarGilt3 || "Gilts";
        }
        if (elemDesktopNavLabelSowBoarGilt4) {
            elemDesktopNavLabelSowBoarGilt4.textContent = translated_nav_links.SowBoarGilt4 || "Disposed";
        }
        if (elemDesktopNavLabelSowBoarGilt5) {
            elemDesktopNavLabelSowBoarGilt5.textContent = translated_nav_links.SowBoarGilt5 || "Parent Trace";
        }
        
        // Desktop operations submenu labels
        if (elemDesktopNavLabelOperations1) {
            elemDesktopNavLabelOperations1.textContent = translated_nav_links.Operations1 || "Feed Balance";
        }
        if (elemDesktopNavLabelOperations2) {
            elemDesktopNavLabelOperations2.textContent = translated_nav_links.Operations2 || "Farrowing Schedule";
        }
        if (elemDesktopNavLabelOperations3) {
            elemDesktopNavLabelOperations3.textContent = translated_nav_links.Operations3 || "Boar External Mate";
        }
        if (elemDesktopNavLabelOperations4) {
            elemDesktopNavLabelOperations4.textContent = translated_nav_links.Operations4 || "Pig Dead";
        }
        if (elemDesktopNavLabelOperations5) {
            elemDesktopNavLabelOperations5.textContent = translated_nav_links.Operations5 || "Farrowing Checklist";
        }
        if (elemDesktopNavLabelOperations6) {
            elemDesktopNavLabelOperations6.textContent = translated_nav_links.Operations6 || "Feeds Consumed";
        }
        
        // Desktop financials submenu labels
        if (elemDesktopNavLabelFinancials1) {
            elemDesktopNavLabelFinancials1.textContent = translated_nav_links.Financials1 || "Sales";
        }
        if (elemDesktopNavLabelFinancials2) {
            elemDesktopNavLabelFinancials2.textContent = translated_nav_links.Financials2 || "Feeds Expenses";
        }
        if (elemDesktopNavLabelFinancials3) {
            elemDesktopNavLabelFinancials3.textContent = translated_nav_links.Financials4 || "Reports";
        }
        
        // Desktop account lists submenu labels
        if (elemDesktopNavLabelAccountLists1) {
            elemDesktopNavLabelAccountLists1.textContent = translated_nav_links.AccountLists1 || "Staff";
        }
        if (elemDesktopNavLabelAccountLists2) {
            elemDesktopNavLabelAccountLists2.textContent = translated_nav_links.AccountLists2 || "Pig Buyers";
        }
        if (elemDesktopNavLabelAccountLists3) {
            elemDesktopNavLabelAccountLists3.textContent = translated_nav_links.AccountLists3 || "Feed Suppliers";
        }
        if (elemDesktopNavLabelAccountLists4) {
            elemDesktopNavLabelAccountLists4.textContent = translated_nav_links.AccountLists4 || "Semen Suppliers";
        }
        if (elemDesktopNavLabelAccountLists5) {
            elemDesktopNavLabelAccountLists5.textContent = translated_nav_links.AccountLists5 || "Gilt Suppliers";
        }
        
        // Desktop settings submenu labels
        if (elemDesktopNavLabelSettings1) {
            elemDesktopNavLabelSettings1.textContent = translated_nav_links.Settings1 || "Ops Settings";
        }
        if (elemDesktopNavLabelSettings2) {
            elemDesktopNavLabelSettings2.textContent = translated_nav_links.Settings2 || "Gestating Ops";
        }
        if (elemDesktopNavLabelSettings3) {
            elemDesktopNavLabelSettings3.textContent = translated_nav_links.Settings3 || "Lactating Piglets Ops";
        }
        if (elemDesktopNavLabelSettings4) {
            elemDesktopNavLabelSettings4.textContent = translated_nav_links.Settings4 || "Lactating Sow Ops";
        }
        if (elemDesktopNavLabelSettings5) {
            elemDesktopNavLabelSettings5.textContent = translated_nav_links.Settings5 || "Weaning Sow Ops";
        }
        if (elemDesktopNavLabelSettings6) {
            elemDesktopNavLabelSettings6.textContent = translated_nav_links.Settings6 || "Gilt Ops";
        }
        
        // Desktop admin submenu labels
        if (elemDesktopNavLabelAdmin1) {
            elemDesktopNavLabelAdmin1.textContent = translated_nav_links.Admin1 || "Users";
        }
        if (elemDesktopNavLabelAdmin2) {
            elemDesktopNavLabelAdmin2.textContent = translated_nav_links.Admin2 || "Access Codes";
        }
        if (elemDesktopNavLabelAdmin3) {
            elemDesktopNavLabelAdmin3.textContent = translated_nav_links.Admin3 || "Referrals";
        }
        
        // Mobile parent menu labels
        if (elemMobileNavLabelProduction) {
            elemMobileNavLabelProduction.textContent = translated_nav_links.Production || "Production";
        }
        if (elemMobileNavLabelSowBoarGilt) {
            elemMobileNavLabelSowBoarGilt.textContent = translated_nav_links.SowBoarGilt || "Sow Boar Gilt";
        }
        if (elemMobileNavLabelOperations) {
            elemMobileNavLabelOperations.textContent = translated_nav_links.Operations || "Operations";
        }
        if (elemMobileNavLabelFinancials) {
            elemMobileNavLabelFinancials.textContent = translated_nav_links.Financials || "Financials";
        }
        if (elemMobileNavLabelAccountLists) {
            elemMobileNavLabelAccountLists.textContent = translated_nav_links.AccountLists || "Account Lists";
        }
        if (elemMobileNavLabelSettings) {
            elemMobileNavLabelSettings.textContent = translated_nav_links.Settings || "Settings";
        }
        if (elemMobileNavLabelAdmin) {
            elemMobileNavLabelAdmin.textContent = translated_nav_links.Admin || "Admin";
        }
        
        // Mobile production submenu labels
        if (elemMobileNavLabelProduction1) {
            elemMobileNavLabelProduction1.textContent = translated_nav_links.Production1 || "Prod Gestating";
        }
        if (elemMobileNavLabelProduction2) {
            elemMobileNavLabelProduction2.textContent = translated_nav_links.Production2 || "Prod Lactating";
        }
        if (elemMobileNavLabelProduction3) {
            elemMobileNavLabelProduction3.textContent = translated_nav_links.Production3 || "Fattening";
        }
        if (elemMobileNavLabelProduction4) {
            elemMobileNavLabelProduction4.textContent = translated_nav_links.Production4 || "Prod History";
        }
        if (elemMobileNavLabelProduction5) {
            elemMobileNavLabelProduction5.textContent = translated_nav_links.Production5 || "Prod Output";
        }
        if (elemMobileNavLabelProduction6) {
            elemMobileNavLabelProduction6.textContent = translated_nav_links.Production6 || "Not Pregnant";
        }
        
        // Mobile sow boar gilt submenu labels
        if (elemMobileNavLabelSowBoarGilt1) {
            elemMobileNavLabelSowBoarGilt1.textContent = translated_nav_links.SowBoarGilt1 || "Sows";
        }
        if (elemMobileNavLabelSowBoarGilt2) {
            elemMobileNavLabelSowBoarGilt2.textContent = translated_nav_links.SowBoarGilt2 || "Boars";
        }
        if (elemMobileNavLabelSowBoarGilt3) {
            elemMobileNavLabelSowBoarGilt3.textContent = translated_nav_links.SowBoarGilt3 || "Gilts";
        }
        if (elemMobileNavLabelSowBoarGilt4) {
            elemMobileNavLabelSowBoarGilt4.textContent = translated_nav_links.SowBoarGilt4 || "Disposed";
        }
        if (elemMobileNavLabelSowBoarGilt5) {
            elemMobileNavLabelSowBoarGilt5.textContent = translated_nav_links.SowBoarGilt5 || "Parent Trace";
        }
        
        
        // Mobile operations submenu labels
        if (elemMobileNavLabelOperations1) {
            elemMobileNavLabelOperations1.textContent = translated_nav_links.Operations1 || "Feed Balance";
        }
        if (elemMobileNavLabelOperations2) {
            elemMobileNavLabelOperations2.textContent = translated_nav_links.Operations2 || "Farrowing Schedule";
        }
        if (elemMobileNavLabelOperations3) {
            elemMobileNavLabelOperations3.textContent = translated_nav_links.Operations3 || "Boar External Mate";
        }
        if (elemMobileNavLabelOperations4) {
            elemMobileNavLabelOperations4.textContent = translated_nav_links.Operations4 || "Pig Dead";
        }
        if (elemMobileNavLabelOperations5) {
            elemMobileNavLabelOperations5.textContent = translated_nav_links.Operations5 || "Farrowing Checklist";
        }
        if (elemMobileNavLabelOperations6) {
            elemMobileNavLabelOperations6.textContent = translated_nav_links.Operations6 || "Feeds Consumed";
        }
        
        
        // Mobile financials submenu labels
        if (elemMobileNavLabelFinancials1) {
            elemMobileNavLabelFinancials1.textContent = translated_nav_links.Financials1 || "Prod Sales";
        }
        if (elemMobileNavLabelFinancials2) {
            elemMobileNavLabelFinancials2.textContent = translated_nav_links.Financials2 || "Feeds Expenses";
        }
        if (elemMobileNavLabelFinancials3) {
            elemMobileNavLabelFinancials3.textContent = translated_nav_links.Financials4 || "Reports";
        }
        
        
        // Mobile account lists submenu labels
        if (elemMobileNavLabelAccountLists1) {
            elemMobileNavLabelAccountLists1.textContent = translated_nav_links.AccountLists1 || "Staff";
        }
        if (elemMobileNavLabelAccountLists2) {
            elemMobileNavLabelAccountLists2.textContent = translated_nav_links.AccountLists2 || "Pig Buyers";
        }
        if (elemMobileNavLabelAccountLists3) {
            elemMobileNavLabelAccountLists3.textContent = translated_nav_links.AccountLists3 || "Feed Suppliers";
        }
        if (elemMobileNavLabelAccountLists4) {
            elemMobileNavLabelAccountLists4.textContent = translated_nav_links.AccountLists4 || "Semen Suppliers";
        }
        if (elemMobileNavLabelAccountLists5) {
            elemMobileNavLabelAccountLists5.textContent = translated_nav_links.AccountLists5 || "Gilt Suppliers";
        }
        
        // Mobile settings submenu labels
        if (elemMobileNavLabelSettings1) {
            elemMobileNavLabelSettings1.textContent = translated_nav_links.Settings1 || "Ops Settings";
        }
        if (elemMobileNavLabelSettings2) {
            elemMobileNavLabelSettings2.textContent = translated_nav_links.Settings2 || "Gestating Ops";
        }
        if (elemMobileNavLabelSettings3) {
            elemMobileNavLabelSettings3.textContent = translated_nav_links.Settings3 || "Lactating Piglets Ops";
        }
        if (elemMobileNavLabelSettings4) {
            elemMobileNavLabelSettings4.textContent = translated_nav_links.Settings4 || "Lactating Sow Ops";
        }
        if (elemMobileNavLabelSettings5) {
            elemMobileNavLabelSettings5.textContent = translated_nav_links.Settings5 || "Weaning Sow Ops";
        }
        if (elemMobileNavLabelSettings6) {
            elemMobileNavLabelSettings6.textContent = translated_nav_links.Settings6 || "Gilt Ops";
        }
        
        // Mobile admin submenu labels
        if (elemMobileNavLabelAdmin1) {
            elemMobileNavLabelAdmin1.textContent = translated_nav_links.Admin1 || "Users";
        }
        if (elemMobileNavLabelAdmin2) {
            elemMobileNavLabelAdmin2.textContent = translated_nav_links.Admin2 || "Access Codes";
        }
        if (elemMobileNavLabelAdmin3) {
            elemMobileNavLabelAdmin3.textContent = translated_nav_links.Admin3 || "Referrals";
        }
    }
    
    
     
    this.onClickNavSowBoar = function(is_mobile, sow_boar_type, show_options, is_left_right_nav){
        // Get previous page from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        // Check if same menu level
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
            previousPageId, PAGE_ID.SOW_BOAR_LIST);
        
        const isSamePage = (previousPageId === PAGE_ID.SOW_BOAR_LIST);
        
        // Determine route with query parameters for type and tab
        let route = HASH_ROUTES.SOW_BOAR_LIST;
        let activeTab = 'all';
        
        
        // Set active tab based on sow_boar_type
        let typeLabel = 'sows';
        switch(sow_boar_type) {
            case SOW_BOAR_TYPE.SOW:
                activeTab = show_options?.filter_type || 'all';
                typeLabel = 'sows';
                route = `${HASH_ROUTES.SOW_BOAR_LIST}?type=sows&tab=${activeTab}`;
                break;
            case SOW_BOAR_TYPE.BOAR:
                typeLabel = 'boars';
                route = `${HASH_ROUTES.SOW_BOAR_LIST}?type=boars`;
                break;
            case SOW_BOAR_TYPE.GILT:
                typeLabel = 'gilts';
                route = `${HASH_ROUTES.SOW_BOAR_LIST}?type=gilts`;
                break;
            case SOW_BOAR_TYPE.DISPOSED:
                typeLabel = 'disposed';
                route = `${HASH_ROUTES.SOW_BOAR_LIST}?type=disposed`;
                break;
        }
        
        // Special handling for Sows - check data updates first
        const navigateToSowBoar = function() {
            if (is_left_right_nav || areSameMenuLevel || isSamePage) {
                navigation.managerHashRoute.hashRouter.replace(route, {
                    pageId:         PAGE_ID.SOW_BOAR_LIST,
                    sowBoarType:    typeLabel,
                    activeTab:      activeTab,
                    showOptions:    show_options
                });
            } else {
                navigation.managerHashRoute.hashRouter.navigate(route, {
                    pageId:         PAGE_ID.SOW_BOAR_LIST,
                    sowBoarType:    typeLabel,
                    activeTab:      activeTab,
                    showOptions:    show_options
                });
            }
            
            
            // Show the page
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_LIST);
            navigation.showThisPage(next_page);
            
            const options = {
                sow_boar_type: sow_boar_type
            };
            if (show_options) {
                // Combine show_options to options
                Object.assign(options, show_options);
            }
            navigation.pageSowBoarList.show(options);
        };
        
        // For Sows, check data updates first
        if (sow_boar_type == SOW_BOAR_TYPE.SOW) {
            navigation.pigFarm.managerPigProd.checkIfToUpdateDataPigProdList(
                navigateToSowBoar);
            return;
        }
        
        // For other types, navigate directly
        navigateToSowBoar();
    }

    
    this.onClickNavParentTrace = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.FARROWING_SCHEDULE);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.TRACE_PARENTS);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.TRACE_PARENTS, {
                pageId: PAGE_ID.TRACE_PARENTS
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.TRACE_PARENTS, {
                pageId: PAGE_ID.TRACE_PARENTS
            });
        }
        
    }
    
    
    this.onClickNavProdGestaLacta = function(is_mobile, operation_type, 
            check_data_updates, is_left_right_nav){
    
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        let pageId, hashRoute, pageShowFunction;
        
        // Determine target page based on operation type
        if (operation_type == PIG_OPERATION_TYPE.GESTATING) {
            pageId = PAGE_ID.PROD_GESTA_LIST;
            hashRoute = HASH_ROUTES.PROD_GESTA_LIST;
            pageShowFunction = () => navigation.pageMobGestatingList.show();
        } 
        else if (operation_type == PIG_OPERATION_TYPE.LACTATING_PIGLETS || 
                 operation_type == PIG_OPERATION_TYPE.LACTATING_SOW) {
            pageId = PAGE_ID.PROD_LACTA_LIST;
            hashRoute = HASH_ROUTES.PROD_LACTA_LIST;
            pageShowFunction = () => navigation.pageMobLactatingList.show();
        }
        else {
            return; // Unknown operation type
        }
        
        // Check if same menu level
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, pageId);
        
        const isSamePage = (previousPageId === pageId);
        
        // For Gestating, check data updates first
        const navigateToPage = () => {
            // Use hash navigation instead of manual history
            if (is_left_right_nav || areSameMenuLevel || isSamePage) {
                navigation.managerHashRoute.hashRouter.replace(hashRoute, {
                    pageId: pageId
                });
            }
            else {
                navigation.managerHashRoute.hashRouter.navigate(hashRoute, {
                    pageId: pageId
                });
            }
            
            // Show the page
            const next_page = navigation.getPageContainer(pageId);
            navigation.showThisPage(next_page);
            pageShowFunction();
        };
        
        if (operation_type == PIG_OPERATION_TYPE.GESTATING && check_data_updates) {
            navigation.pigFarm.managerPigProd.checkIfToUpdateDataPigProdList(
                navigateToPage);
        } 
        else {
            navigateToPage();
        }
    };
    
    
    this.onClickNavProdFattening = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.PROD_FATTENING_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.PROD_FATTENING_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.PROD_FATTENING_LIST, {
                pageId: PAGE_ID.PROD_FATTENING_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.PROD_FATTENING_LIST, {
                pageId: PAGE_ID.PROD_FATTENING_LIST
            });
        }
    }
    
    
    this.onClickNavProdHistory = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.PROD_HISTORY_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.PROD_HISTORY_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.PROD_HISTORY_LIST, {
                pageId: PAGE_ID.PROD_HISTORY_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.PROD_HISTORY_LIST, {
                pageId: PAGE_ID.PROD_HISTORY_LIST
            });
        }
    }
    
    
    this.onClickNavProdOutput = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.PROD_OUTPUT);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.PROD_OUTPUT);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.PROD_OUTPUT, {
                pageId: PAGE_ID.PROD_OUTPUT
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.PROD_OUTPUT, {
                pageId: PAGE_ID.PROD_OUTPUT
            });
        }
    }
    
    
    this.onClickNavProdNotPregnant = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.PROD_NOT_PREGNANT_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.PROD_NOT_PREGNANT_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.PROD_NOT_PREGNANT_LIST, {
                pageId: PAGE_ID.PROD_NOT_PREGNANT_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.PROD_NOT_PREGNANT_LIST, {
                pageId: PAGE_ID.PROD_NOT_PREGNANT_LIST
            });
        }
    }
    
        
        
    this.onClickNavFeedBalance = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.ALL_FEED_BAL_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.ALL_FEED_BAL_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.ALL_FEED_BAL_LIST, {
                pageId: PAGE_ID.ALL_FEED_BAL_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.ALL_FEED_BAL_LIST, {
                pageId: PAGE_ID.ALL_FEED_BAL_LIST
            });
        }
    }
    
        
    this.onClickNavFarrowingSchedule = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.FARROWING_SCHEDULE);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.FARROWING_SCHEDULE);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.FARROWING_SCHEDULE, {
                pageId: PAGE_ID.FARROWING_SCHEDULE
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.FARROWING_SCHEDULE, {
                pageId: PAGE_ID.FARROWING_SCHEDULE
            });
        }
        
    }
    

    this.onClickNavBoarExternalMate = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.BOAR_EXT_MATE_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.BOAR_EXT_MATE_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.BOAR_EXT_MATE_LIST, {
                pageId: PAGE_ID.BOAR_EXT_MATE_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.BOAR_EXT_MATE_LIST, {
                pageId: PAGE_ID.BOAR_EXT_MATE_LIST
            });
        }
    }
    
    
    this.onClickNavPigDead = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.PIG_DEAD_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.PIG_DEAD_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.PIG_DEAD_LIST, {
                pageId: PAGE_ID.PIG_DEAD_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.PIG_DEAD_LIST, {
                pageId: PAGE_ID.PIG_DEAD_LIST
            });
        }
    }
    
    
    this.onClickNavFarrowingChecklist = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.ACC_FARROW_CHECKLIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.ACC_FARROW_CHECKLIST);

        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.ACC_FARROW_CHECKLIST, {
                pageId: PAGE_ID.ACC_FARROW_CHECKLIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.ACC_FARROW_CHECKLIST, {
                pageId: PAGE_ID.ACC_FARROW_CHECKLIST
            });
        }
    }
        
    
    this.onClickNavFeedsConsumed = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.FEEDS_CONSUMED);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.FEEDS_CONSUMED);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.FEEDS_CONSUMED, {
                pageId: PAGE_ID.FEEDS_CONSUMED
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.FEEDS_CONSUMED, {
                pageId: PAGE_ID.FEEDS_CONSUMED
            });
        }
    }
    
        
    this.onClickNavFeedCalculator = function(is_mobile, show_options){
        console.log('onClickNavFeedCalculator not yet implemented; is_mobile=' + is_mobile);
    }
    
    
    
    this.onClickNavProdSales = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.PROD_SALES_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.PROD_SALES_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.PROD_SALES_LIST, {
                pageId: PAGE_ID.PROD_SALES_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.PROD_SALES_LIST, {
                pageId: PAGE_ID.PROD_SALES_LIST
            });
        }
    }
    
        
    this.onClickNavFeedsExpenses = function(is_mobile, is_left_right_nav){
        // Get previous page_id from history state
        let previousPageId = null;
        if (history.state && history.state.data && history.state.data.pageId) {
            previousPageId = history.state.data.pageId;
        }
        
        
        // Check if previous page_id has same menu level with next page_id
        const areSameMenuLevel = navigation.pageContainers.checkIfPagesOnSameMenu(
                previousPageId, PAGE_ID.FARM_FEED_BUY_LIST);
        
        // Check if previous page is next page
        const isSamePage = (previousPageId === PAGE_ID.FARM_FEED_BUY_LIST);
        
        
        // Use hash navigation instead of manual history
        if (is_left_right_nav || areSameMenuLevel || isSamePage) {
            navigation.managerHashRoute.hashRouter.replace(HASH_ROUTES.FARM_FEED_BUY_LIST, {
                pageId: PAGE_ID.FARM_FEED_BUY_LIST
            });
        }
        else{
            navigation.managerHashRoute.hashRouter.navigate(HASH_ROUTES.FARM_FEED_BUY_LIST, {
                pageId: PAGE_ID.FARM_FEED_BUY_LIST
            });
        }
    }
        
    
    this.onClickNavSummaryReports = function(is_mobile, show_options){
        const next_page = navigation.getPageContainer(PAGE_ID.SUMMARY_REPORT_LIST);
    
        navigation.showThisPage(next_page);
        navigation.pageSummaryReportList.show(show_options);
    }
    
    
    this.onClickNavNonFeedsExpenses = function(is_mobile, show_options){
        console.log('onClickNavNonFeedsExpenses not yet implemented; is_mobile=' + is_mobile);
    }
        
        
        
        
                    
    this.onClickNavStaff = function(is_mobile, show_options){
        console.log('onClickNavStaff not yet implemented; is_mobile=' + is_mobile);
    }
        
                
    this.onClickNavPigBuyers = function(is_mobile, show_options){
        console.log('onClickNavPigBuyers not yet implemented; is_mobile=' + is_mobile);
    }
        
            
    this.onClickNavFeedSuppliers = function(is_mobile, show_options){
        console.log('onClickNavFeedSuppliers not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this.onClickNavSemenSuppliers = function(is_mobile, show_options){
        console.log('onClickNavSemenSuppliers not yet implemented; is_mobile=' + is_mobile);
    }
        
        
    this.onClickNavGiltSuppliers = function(is_mobile, show_options){
        console.log('onClickNavGiltSuppliers not yet implemented; is_mobile=' + is_mobile);
    
    }
        
        
    this.onClickNavAccOpsSettings = function(is_mobile, show_options){
        const next_page = navigation.getPageContainer(PAGE_ID.ACC_OPS_SETTINGS_EDIT);
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        //navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        navigation.pageAccOpsSettingsEdit.show();
    }
    
        
    this.onClickNavAccPigOps = function(is_mobile, operation_type, show_options){
        const next_page = navigation.getPageContainer(PAGE_ID.ACC_PIG_OPS_LIST);
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        navigation.pageAccPigOpsList.show(operation_type);
    }
        
    
                    
    this.onClickNavUsers = function(is_mobile, show_options){
        const next_page = navigation.getPageContainer(PAGE_ID.USER_LIST);
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        //navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        navigation.pageUserList.show();
    }
        
        
    this.onClickNavAccessCodes = function(is_mobile, show_options){
        const next_page = navigation.getPageContainer(PAGE_ID.ACCESS_CODE_LIST);
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        //navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        navigation.pageAccessCodeList.show();
    }
        
        
    this.onClickNavSystemStats = function(is_mobile, show_options){
        const next_page = navigation.getPageContainer(PAGE_ID.SYSTEM_STATS);
        
        // Push currentPage to NavHistory;
        // Will also compare current page and next_page NAV_MENU_GROUP. 
        navigation.pushCurrentPageToNavHistory(next_page);
        
        
        navigation.showThisPage(next_page);
        navigation.pageSystemStats.show();
    }

}
