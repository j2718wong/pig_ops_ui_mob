// January 16, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function UiBasic(){
    const thisObj               = this;
    
    // This is the fist element of the UiBasic
    // This must be set after HTML render
    this.elemUiShow             = null;
    
    
    // Must be overridden
    this._findElements = function(){}
    
    
    // Must be overridden
    this._bindEventListenerss = function(){}
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
    
    this.show = function(){
        if (thisObj.elemUiShow){
            thisObj.elemUiShow.style.display = 'block';
        }
    }
    
    
    this.hide = function(){
        if (thisObj.elemUiShow){
            thisObj.elemUiShow.style.display = 'none';
        }
    }
    
    
    // Must be overridden; Should return elements array or just 1 element object; 
    this.getInputElements = function(){
        return null;
    }
    
    
    this.disableInputs = function(){
        const input_elems = thisObj.getInputElements();
        
        if (input_elems){
            if (Array.isArray(input_elems)){
                for (const cur_entry of input_elems){
                    cur_entry.disabled = true;
                }
            }
            else{
                // Just a single element
                input_elems.disabled = true;
            }
        }
    }
    
    
    this.enableInputs = function(){
        const input_elems = thisObj.getInputElements();
        
        if (input_elems){
            if (Array.isArray(input_elems)){
                for (const cur_entry of input_elems){
                    cur_entry.disabled = false;
                }
            }
            else{
                // Just a single element
                input_elems.disabled = false;
            }
        }
    }
    
    
}