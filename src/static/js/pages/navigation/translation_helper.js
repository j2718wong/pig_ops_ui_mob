// March 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {TRANSLATION_MODE}       from '../../constants.js';
        

export function TranslationHelper(settings) {
    const thisObj               = this;
    const parentObj             = settings.parentObj
    const navigation            = settings.navigation;
    
    
    /**
     * Get translation mode from navigation
     * @returns {number} Translation mode (0, 1, or 2)
     */
    this.getTranslationMode = function() {
        return parentObj.getTraslationMode();
    };
    
    
    /**
     * Get value from nested object using dot notation
     * @param {Object} obj - The object to traverse
     * @param {string} path - Dot notation path (e.g., 'common.labels.no_entries')
     * @returns {*} The value at the path, or null if not found
     */
    this.getValueByPath = function(obj, path) {
        if (!obj) {
            return null;
        }
        
        if (!path) {
            return null;
        }
        
        // Split the path by dots
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            
            // Check if current level exists and has the key
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return null;
            }
        }
        
        return current;
    };
    
    
    
    /**
     * Get local variations for a specific term using dot notation
     * @param {string} termPath - Dot notation path (e.g., 'common.labels.no_entries')
     * @returns {string|array|null} Local variations or null if not found
     */
    this.getLocalVariations = function(termPath) {
        let translations = parentObj.getTranslations();
        
        if (translations){
            // Get the value using dot notation
            return thisObj.getValueByPath(translations, termPath);
        }
        
        return null;
    };
    
    
    /**
     * Get a random element from an array
     * @param {array} arr - The array to pick from
     * @returns {*} Random element from the array
     */
    this.getRandomFromArray = function(arr) {
        if (!Array.isArray(arr)) {
            return arr;
        }
        if (arr.length === 0) {
            return null;
        }
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    
    
    /**
     * Get translated text with support for random variations and translation modes
     * @param {string} termPath - Dot notation path (e.g., 'common.labels.no_entries')
     * @param {array} defaultEnglishArray - Default English variations to use as fallback
     * @returns {string} The translated text
     */
    this.getTranslatedText = function(termPath, defaultEnglishArray) {
        // Get translation mode
        const translationMode = thisObj.getTranslationMode();
        
        // Get local variations for this term
        const localVariations = thisObj.getLocalVariations(termPath);
        
        // Make sure defaultEnglishArray is an array
        let defaultArray = defaultEnglishArray;
        if (!Array.isArray(defaultEnglishArray)) {
            defaultArray = [defaultEnglishArray];
        }
        
        // Case 1: USE_ENGLISH - always use English
        if (translationMode === TRANSLATION_MODE.USE_ENGLISH) {
            return thisObj.getRandomFromArray(defaultArray);
        }
        
        // Case 2: ENGLISH_FIRST_THEN_LOCAL - English + local variation if available
        else if (translationMode === TRANSLATION_MODE.ENGLISH_FIRST_THEN_LOCAL) {
            // Random English prefix
            const englishText = thisObj.getRandomFromArray(defaultArray);
            
            // Add local variation if available
            if (localVariations) {
                let localText = '';
                
                if (Array.isArray(localVariations)) {
                    localText = thisObj.getRandomFromArray(localVariations);
                } else {
                    localText = localVariations;
                }
                
                return englishText + '; ' + localText;
            }
            
            return englishText;
        }
        
        // Case 3: USE_LOCAL - use local translation, fallback to English
        else if (translationMode === TRANSLATION_MODE.USE_LOCAL) {
            if (localVariations) {
                if (Array.isArray(localVariations)) {
                    return thisObj.getRandomFromArray(localVariations);
                } else {
                    return localVariations;
                }
            }
            
            // Fallback to English if no local translations
            return thisObj.getRandomFromArray(defaultArray);
        }
        
        // Fallback for any other case
        return thisObj.getRandomFromArray(defaultArray);
    };
    
    
    
    /**
     * Get a simple translated text (no random variations, single string)
     * @param {string} termPath - Dot notation path (e.g., 'common.labels.save')
     * @param {string} defaultEnglish - Default English text
     * @returns {string} The translated text
     */
    this.getSimpleTranslation = function(termPath, defaultEnglish) {
        const translationMode = thisObj.getTranslationMode();
        
        // Get local translation
        let localText = null;
        const localVariations = thisObj.getLocalVariations(termPath);
        
        if (localVariations) {
            if (Array.isArray(localVariations)) {
                localText = localVariations[0]; // Just take the first one for simple cases
            } else {
                localText = localVariations;
            }
        }
        
        // USE_ENGLISH mode
        if (translationMode === TRANSLATION_MODE.USE_ENGLISH) {
            return defaultEnglish;
        }
        
        // ENGLISH_FIRST_THEN_LOCAL mode
        else if (translationMode === TRANSLATION_MODE.ENGLISH_FIRST_THEN_LOCAL) {
            if (localText) {
                return defaultEnglish + '; ' + localText;
            }
            return defaultEnglish;
        }
        
        // USE_LOCAL mode
        else if (translationMode === TRANSLATION_MODE.USE_LOCAL) {
            if (localText) {
                return localText;
            }
            return defaultEnglish;
        }
        
        return defaultEnglish;
    };
    
    
     /**
     * Check if a translation exists for a given path
     * @param {string} termPath - Dot notation path
     * @returns {boolean} True if translation exists
     */
    this.hasTranslation = function(termPath) {
        const value = thisObj.getLocalVariations(termPath);
        return (value !== null);
    };
    
}
