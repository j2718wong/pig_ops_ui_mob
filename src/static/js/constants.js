// December 24, 2025
// Jack Wong
// j2718wong@gmail.com


const APPLICATION = {
    MOBILE_TABLE_ROW_PER_PAGE:      10,
    
    MAX_WIDTH_WINDOW_IS_MOBILE:     768
}


const PAGE_ID = {
    HOME:                   0,
    
    
    SOW_BOAR_LIST:          11,
    SOW_BOAR_ADD_EDIT:      12,
    SOW_BOAR_ENTRY:         13,
    SOW_BOAR_DISPOSED:      14,
    
    MEDVAC_ADD_EDIT:        18,
    HEALTH_ADD_EDIT:        19,
    NOTES_ADD_EDIT:         20,
    
    BOAR_EXT_MATE_ADD_EDIT: 29,
    TRACE_PARENTS:          30,
    
    
    PROD_GESTA_LIST:        31,
    PROD_GESTA_ADD:         32,
    PROD_GESTA_ENTRY:       33,
    
    PROD_LACTA_LIST:        34, 
    PROD_LACTA_ENTRY:       35, 
        
    PROD_FATTENING_LIST:    36,
    PROD_FATTENING_ADD:     37,
    PROD_FATTENING_ENTRY:   38,
    
    PROD_PIG_OPS_EDIT:      39,
    
    
    
    
    
    ACC_PIG_OPS:            50,
    
    
    SUPPLIER_ADD_EDIT:      60
    
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
    GILT:               3,
    
    DISPOSED:           4
};


const SOW_STATUS = {
    GROWING:            1,
    GESTATING:          2,
    LACTATING:          3,
    WEANING:            4,
    CULLED:             5,
    DEAD:               6,
    SOLD:               7,
    
    DELETE:             99
};

const SOW_STATUS_NAME = {
    1:  'Growing',
    2:  'Gestating',
    3:  'Lactating',
    4:  'Weaning',
    5:  'Culled',
    6:  'Dead',
    7:  'Sold'
    
}

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


const SUPPLIER_TYPE ={
    FEED:               1,
    SEMEN:              2,
    GILT:               3
    
};


const NOTES_TYPE = {
    SOW_BOAR:           1,
    PIG_PROD:           2,
    PROD_GROUP:         3
    
};

const MEDVAC_TYPE = {
    SOW_BOAR:           1,
    PIG_PROD:           2,
    PROD_GROUP:         3
    
};




const REQUEST_ERROR_NUM ={
    ERROR_DATABASE_ERROR:                       1,
    ERROR_SERVER_ERROR:                         2,  
    
    ERROR_USER_INACTIVE:                        3,
    ERROR_ACCOUNT_DISABLED:                     4,
    ERROR_ACCOUNT_BILL_OVERDUE:                 5

};



export {
    APPLICATION,
    PAGE_ID,
    
    SOW_BOAR_TYPE,
    PIG_OPERATION_TYPE,
    SOW_STATUS,
    SOW_STATUS_NAME,
    PROD_STATUS,
    
    PIG_PROD_TYPE,
    SUPPLIER_TYPE,
    NOTES_TYPE,
    
    REQUEST_ERROR_NUM
};