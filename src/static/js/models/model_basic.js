// December 23, 2025 
// Jack Wong
// j2718wong@gmail.com

"use strict";

/** Field validation constants.*/
export const FIELD_VALIDATION_OK                 = 0;
export const FIELD_REQUIRES_NUMBER               = 1;
export const FIELD_REQUIRES_POSITIVE_INTEGER     = 2;
export const FIELD_CANNOT_BE_ZERO                = 3;
export const FIELD_CANNOT_BE_EMPTY_STRING        = 4;
export const FIELD_EXCEEDS_STRING_LENGTH         = 5;
export const FIELD_CONTAINS_INVALID_STRING       = 6;
export const FIELD_REQUIRES_DATE_STRING          = 7;


export function getValidationString(validation){
    switch(validation){
        case FIELD_REQUIRES_NUMBER:             {return 'FIELD_REQUIRES_NUMBER';}
        case FIELD_REQUIRES_POSITIVE_INTEGER:   {return 'FIELD_REQUIRES_POSITIVE_INTEGER';}
        case FIELD_CANNOT_BE_ZERO:              {return 'FIELD_CANNOT_BE_ZERO';}
        case FIELD_CANNOT_BE_EMPTY_STRING:      {return 'FIELD_CANNOT_BE_EMPTY_STRING';}
        case FIELD_EXCEEDS_STRING_LENGTH:       {return 'FIELD_EXCEEDS_STRING_LENGTH';}
        case FIELD_CONTAINS_INVALID_STRING:     {return 'FIELD_CONTAINS_INVALID_STRING';}
        case FIELD_REQUIRES_DATE_STRING:        {return 'FIELD_REQUIRES_DATE_STRING';}
    
    }
    return '';
}


export function Field(value){
    const thisObj       = this;
    const DEFAULT_MAX_STRING_LEN        = 80;
    
    this.index          = 0;
    
    
    /** This needs to be overridden if the valid string length is longer than this default value */
    this.maxStrLen  = DEFAULT_MAX_STRING_LEN;
    
    
    this.validation     = {
        isNumeric:      false,
        isPositiveInt:  false,
        cannotBeNull:   false,
        cannotBeZero:   false,
        cannotBeEmptyStr: false,
        isDateStr:      false
    };
    
    if (value === undefined){value = null;}
    
    this.curValue       = value;
    this.newValue       = value;
    

    
    /** When this field is an integer and it refers to a string, this should be 
    filled with that string so that when this field is searchable, 
    that string can be searched. This should be updated together with this.newValue
    */
    this.newValueAssociatedStr = '';
    
    /** Use this when expected value is a string.*/
    this.setNewValueStr = function(s){
        if (s != null){
            thisObj.newValue = s.trim();
        }
    }
    
    
    /**
    Will set validation params
    
    {
        isNumeric:          false,
        isPositiveInt:      false,
        cannotBeNull:       false,
        cannotBeZero:       false,
        
        cannotBeEmptyStr:   false,
        isDateStr:          false
    }
    
    */
    this.setValidation  = function(validation){
        if ('isNumeric' in validation) {
            thisObj.validation.isNumeric        = validation.isNumeric;
        }
        
        if ('isPositiveInt' in validation) {
            thisObj.validation.isPositiveInt    = validation.isPositiveInt;
        }
        
        if ('cannotBeNull' in validation) {
            thisObj.validation.cannotBeNull     = validation.cannotBeNull;
        }  
        
        if ('cannotBeZero' in validation) {
            thisObj.validation.cannotBeZero     = validation.cannotBeZero;
        }
        
        if ('cannotBeEmptyStr' in validation) {
            thisObj.validation.cannotBeEmptyStr = validation.cannotBeEmptyStr;
        }
        
        if ('isDateStr' in validation) {
            thisObj.validation.isDateStr        = validation.isDateStr;
        }
    }
    
    
    this.setValue       = function(val){
        thisObj.curValue = val; 
        thisObj.newValue = val;
    }
    
    
    this.hasChanged     = function(){
        if (thisObj.curValue == null) {
            if ((thisObj.newValue != null) && 
                (typeof thisObj.newValue === 'string') &&
                (thisObj.newValue.length == 0)) {
                // previous is null and new value is empty string
                // will be treated as no change
                return false;
            }
        }
        
        if (thisObj.curValue != thisObj.newValue){return true;} 
        else{return false;}
    }

    
    /** Returns any of field validation constants*/
    this.validateChange = function(){
        if (thisObj.validation.isNumeric == true){
            
            if (thisObj.validation.cannotBeNull == true){
                if (thisObj.newValue == null){return FIELD_REQUIRES_NUMBER;}
                if (thisObj.newValue == undefined){return FIELD_REQUIRES_NUMBER;}
            }
            
            if (thisObj.newValue == null) {return FIELD_VALIDATION_OK;}
            
            if (Number.isFinite(+thisObj.newValue) == false){return FIELD_REQUIRES_NUMBER;}
        
            if (thisObj.validation.isPositiveInt == true){
                if (Number.isInteger(thisObj.newValue) == false){return FIELD_REQUIRES_POSITIVE_INTEGER;}
				
				const new_value = parseInt(thisObj.newValue);
				if (new_value <= 0){return FIELD_REQUIRES_POSITIVE_INTEGER;}
			}
            
            if (thisObj.validation.cannotBeZero == true){
                if (thisObj.newValue == null){return FIELD_CANNOT_BE_ZERO;}
                if (thisObj.newValue == 0){return FIELD_CANNOT_BE_ZERO;}
            }
        }
        else{
            if (thisObj.validation.cannotBeEmptyStr == true){
                
                if (thisObj.newValue == null){return FIELD_CANNOT_BE_EMPTY_STRING;}
                if (thisObj.newValue == undefined){return FIELD_CANNOT_BE_EMPTY_STRING;}
                
                var clean_str       = thisObj.newValue.trim();
                var str_len         = clean_str.length;
                
                if (str_len == 0){return FIELD_CANNOT_BE_EMPTY_STRING;}
                
                if (thisObj.maxStrLen > 0){
                    if (str_len > thisObj.maxStrLen){return FIELD_EXCEEDS_STRING_LENGTH;}
                }
                
				/**
                if (validateString(thisObj.newValue) == false){
                    return FIELD_CONTAINS_INVALID_STRING;
                }*/
            }
            else{
                if (thisObj.newValue != null){
                    var clean_str       = thisObj.newValue.trim();
                    var str_len         = clean_str.length;
                    
                    if (thisObj.maxStrLen > 0){
                        if (str_len > thisObj.maxStrLen){return FIELD_EXCEEDS_STRING_LENGTH;}
                    }
                }
                
            }
            
            if (thisObj.validation.isDateStr == true){
                const dateObject = new Date(thisObj.newValue);
                // Check if the Date object is valid (not "Invalid Date")
                // and if its getTime() method returns a number (not NaN)
                var res = dateObject instanceof Date && !isNaN(dateObject.getTime());
                
                if (res == false){
                    return FIELD_REQUIRES_DATE_STRING;
                }
            
            }
            
        }
        
        return FIELD_VALIDATION_OK;
    }
    
}




export function ModelBasic(){
/* This class can be thought as a table row. */
    const thisObj                 = this;
    
    /** List of searchable Field objects.*/
    this.searchableFields       = []; 
    
    /** List of editable Field objects.*/
    this.editableFields         = [];
    
    /** List of filterable Field objects.*/
    this.filterableFields       = []; 
    
    /** This can be a numeric id. */
    this.id                     = 0;
    
    this.hid                    = null;

    this.lastUpdateBy           = '';
    this.lastUpdate             = '';

    /** Non-editable searchable field*/
    this.fieldLastUpdateBy      = new Field('');
    
    this.isSelected             = false;
    
    this.getEditableField = function (field_index){
        var index;
        for(index = 0; index < thisObj.editableFields.length; index++){
            var cur_field = thisObj.editableFields[index];
            if (cur_field.index == field_index){return cur_field;}
        }
        return null;
    }

    
    /** Will copy fields from_model to this model*/
    this.copyFields = function(from_model){
        $(from_model.editableFields).each(function(){
            var cur_field = thisObj.getEditableField(this.index);
            if (cur_field != null){
                cur_field.newValue = this.newValue;
                if (this.newValueAssociatedStr.length > 0){
                    cur_field.newValueAssociatedStr = this.newValueAssociatedStr;
                }
            }
        });
    }
    
    
    
    this.isEditableFieldValueExisting = function(value, field_index){
        var index;
        var value_upper = null;
        
        if (typeof value === 'string'){
            value_upper = value.toUpperCase();
        }
        
        
        for (index = 0; index < thisObj.editableFields.length; index++){
            var cur_field = thisObj.editableFields[index];
            if (cur_field.index == field_index){
                if (cur_field.isNumeric == false){
                    if (cur_field.newValue.toUpperCase() == value_upper){
                            return true;}
                }
                else{
                    if (cur_field.newValue == value){return true;}
                }
            }
        }
        return false;
    }
    
    
    /** Returns true if editable Field objects has changed.*/
    this.hasChanged     = function(){
        
        var index;
        for (index = 0; index < thisObj.editableFields.length; index++){
            var cur_entry = thisObj.editableFields[index];
            if (cur_entry.hasChanged()){return true;}
        }
        return false;
    }
    
    
    this.getChangedFields   = function(){
        var result = [];
        
        var index;
        for (index = 0; index < thisObj.editableFields.length; index++){
            var cur_entry = thisObj.editableFields[index];
            if (cur_entry.hasChanged()){
                result.push(cur_entry);
            }
        }
        return result;
    }
    
    
    this.validateChange = function(){
        if (this.hasChanged() == false){return true;}
        var index;
        for (index = 0; index < thisObj.editableFields.length; index++){
            var cur_entry = thisObj.editableFields[index];
            if (cur_entry.validateChange() != FIELD_VALIDATION_OK){
                
                console.log('Invalid Field');
                console.log(cur_entry);
                
                return false;
            }
        }
        return true;
    }
    
    
    this.getInvalidChangedFields = function(){
        var result = [];
        var index;
        for (index = 0; index < thisObj.editableFields.length; index++){
            var cur_entry = thisObj.editableFields[index];
            var validation = cur_entry.validateChange();
            if (validation != FIELD_VALIDATION_OK){
                result.push({
                    field:  cur_entry,
                    error:  getValidationString(validation)
                });
            }
        }
        return result;
    }
    
}

