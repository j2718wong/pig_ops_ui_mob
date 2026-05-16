// ui_utils.js

// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



/**
 * Will add validation class to a UI Element
 * 
 * @param {Element} input_elem - Element to add validation class
 * @param {validation} 0 =  VALIDATION_OK; >0 VALIDATION_ERROR
 * @returns None
 */
export function addValidationClassToElem(input_elem, validation){
    if (validation != 0){
        if (input_elem.classList.contains('is-invalid') == false){
            input_elem.classList.add('is-invalid');
            input_elem.classList.remove('is-valid');
        }
        else{
            input_elem.classList.remove('is-valid');
        }
    }
    else{
        if (input_elem.classList.contains('is-valid') == false){
            input_elem.classList.add('is-valid');
            input_elem.classList.remove('is-invalid');
        }
        else{
            input_elem.classList.remove('is-invalid');
        }
    }
}
