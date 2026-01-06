// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function getSowBoarReference(data_sow, inc_sow_boar_num){
    let sow_reference = '';
    
    if ((data_sow.name != null) && (data_sow.name.length >0)){
        sow_reference = data_sow.name;
        
        if (inc_sow_boar_num){
            if (data_sow.number != null) {
                sow_reference += ` (${data_sow.number})`;
            }
        }
        
    }
    else{
        sow_reference = data_sow.number;
    }
    
    return sow_reference;
}