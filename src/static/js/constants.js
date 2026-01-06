// December 24, 2025
// Jack Wong
// j2718wong@gmail.com


const APPLICATION = {
    MAX_WIDTH_WINDOW_IS_MOBILE:     768
}


const PAGE_ID = {
    HOME:                   0,
    
    
    SOW_BOAR_LIST:          1,
    SOW_BOAR_ADD_EDIT:      2,
    
    
    PROD_GESTA_LIST:        3,
    
    
    PROD_GESTA_ADD:         4,  
    
    PROD_GESTA_ENTRY:       5,
    
    PROD_LACTA_LIST:        6, 
    
    
    ACC_PIG_OPS:            7
    
};


const PIG_OPERATION_TYPE = {
    GESTATING:          1,
    LACTATING_PIGLETS:  2,
    LACTATING_SOW:      3,
    GILT:               4
};


const SOW_BOAR_TYPE = {
    SOW:                1,
    BOAR:               2,
    GILT:               3
};


const SOW_STATUS = {
    GROWING:            1,
    GESTATING:          2,
    LACTATING:          3,
    WEANING:            4,
    CULLED:             5,
    DEAD_AT_LABOR:      6,
    SOLD:               7
};


const PROD_STATUS = {
    GESTATING:          1,
    TERMINATED:         2,
    NOT_PREGNANT:       3,
    LACTATING:          4,
    WEANING:            5,
    GROWING:            6,
    COMBINED:           7,
    HARVESTED:          8
};


const PIG_PROD_TYPE = {
    GESTATING:          1,
    LACTATING:          2,
    FATTENING:          4
    
};


export {
    APPLICATION,
    PAGE_ID,
    
    SOW_BOAR_TYPE,
    PIG_OPERATION_TYPE,
    SOW_STATUS,
    PROD_STATUS,
    
    PIG_PROD_TYPE
};