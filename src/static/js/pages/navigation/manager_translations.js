// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION}              from '../../constants.js';


export function ManagerTranslations(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    
    
    this.init = function(){
    }
    
    
    
    this.getTranslations = function(){
        return window.SUPERPIG_TRANSLATIONS;
    }
    
    
    this.getCommonTranslatedLabels = function(){
        const translations = thisObj.getTranslations();
        
        if (translations){
            if (translations.common && translations.common.labels){
                return translations.common.labels;
            }
        }
        
        return null;
    }
}



