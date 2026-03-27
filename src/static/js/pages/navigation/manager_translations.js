// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        TRANSLATION_MODE}           from '../../constants.js';

import {TranslationHelper}          from './translation_helper.js';


export function ManagerTranslations(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    
    this.translationHelper  = new TranslationHelper({
        'parentObj':    this,
        'navigation':   navigation  
    });
    
    
    this.init = function(){
    }
    
    
    
    this.getTranslations = function(){
        return window.SUPERPIG_TRANSLATIONS;
    }
    
    
    this.getTraslationMode = function(){
        const translations = window.SUPERPIG_TRANSLATIONS;
        
        if (translations){
            const translations_language = translations.language;
            
            switch(translations_language){
                case 'PH-BIS': return TRANSLATION_MODE.ENGLISH_FIRST_THEN_LOCAL
            
                default: break;
            }
            
        }
        
        return TRANSLATION_MODE.USE_ENGLISH;
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



