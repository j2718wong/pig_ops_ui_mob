// translation.js

// December 28, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function TextTranslation(){
    const thisObj                   = this;
    
    var translations                = null;
    
    
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }
    
    
    this.setTranslations = function(data){
        translations = data;
    }
    
    
    // Will return translation of a given path
    // Example path gestating_ops.title
    this.getTranslatedText = function(language_key, path){
        if (translations == null){return null;}
        
        // English default
        const default_translation = translations.en;
        if (default_translation == null){return null;}
        
        const default_text = getNestedValue(default_translation, path);
        if (default_text == null){return null;}
        
        var cur_text    = default_text;
        
        const cur_translation = translations['language_key']
        
        if (cur_translation == null){return cur_text;}
        
        cur_text = getNestedValue(cur_translation, path);
        
        if (cur_text == null){cur_text = default_text;}
        
        return cur_text;
        
    }
    
}