// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function getSowBoarReference(sow_boar, inc_sow_boar_num){
    let reference = '';
    
    if (sow_boar.name  && sow_boar.name.length >0){
        reference = sow_boar.name;
        
        if (inc_sow_boar_num){
            if (sow_boar.number != null) {
                reference += ` (${sow_boar.number})`;
            }
        }
        
    }
    else{
        reference = sow_boar.number;
    }
    
    return reference;
}