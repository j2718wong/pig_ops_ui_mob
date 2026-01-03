// December 28, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';
    

export function textSubstituteToControl(s_text){
    const extracted = (s_text.match(/\{[^}]*\}/g) || []);
    
    //console.log(extracted); // ["{PAGE_PROD_GESTATING}", "{PAGE_PROD_LACTATING}"]
    
    const result = [];
    let html = ''
    for (const cur_entry of extracted){
        switch(cur_entry){
            case '{PAGE_PROD_GESTATING}':{
                html = `<button class="btn-link gestating" onclick="gNavigation._onClickNavProdGestaLacta(null, 1);"><b>Prod Gestating</b></button>`;
                result.push({key: cur_entry, substitute: html});
                break;
            }
            
            case '{PAGE_PROD_LACTATING}':{
                html = `<button class="btn-link lactating-piglets" onclick="gNavigation._onClickNavProdGestaLacta(null, 2);"><b>Prod Lactating</b></button>`;
                result.push({key: cur_entry, substitute: html});
                break;
            }
        }
    }
    
    return result;
}