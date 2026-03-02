// December 24, 2025
// Jack Wong
// j2718wong@gmail.com


const APPLICATION = {
    REQUEST_TIMEOUT:                5000,
    NUM_MSECS_1DAY:                 1000 * 60 * 60 * 24,
    
    MOBILE_TABLE_ROW_PER_PAGE:      10,
    
    MAX_WIDTH_WINDOW_IS_MOBILE:     768,
    
    
    DEFAULT_NUM_DAYS_WEAN:          45
};


const SOCIAL_MEDIA = {
    GOOGLE:     1,
    FACEBOOK:   2,
    TIKTOK:     3
};


const ACC_USER_GROUP = {
    ADMIN:                  1,     
    MANAGEMENT:             2,
    OPERATIONS:             3,
    FARM_STAFF:             4
};




const PAGE_ID = {
    NOT_LOGGED_IN:          0,
    SIGNUP_OR_LOGIN:        1,
    USER_EMAIL_VERIFY:      2,
    USER_WAIT_ACCOUNT_ACCESS: 3,
    
    CREATE_OR_JOIN_ACCOUNT: 4,
    ADD_FARM:               5,
    
    
    HOME:                   9,
    
    PIG_FARM_ADD_EDIT:      10,
    
    
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
    
    PROD_FEED_ADD_EDIT:     40,   
    PROD_FEED_BAL_ADD_EDIT: 41,  
    
    PROD_HARVEST_ADD_EDIT:  42,
    
    PROD_HISTORY_LIST:      43,
    PROD_HISTORY_ENTRY:     44,
    
    PROD_NOT_PREGNANT_LIST: 45,
    
    PROD_SALES_LIST:        48,
    PROD_SALES_ENTRY:       49,
    
    
    ALL_FEED_BAL_LIST:      50,
    ALL_FEED_BAL_ADD_EDIT:  51,
    
    FARM_FEED_BUY_LIST:     55,
    FARM_FEED_BUY_ADD_EDIT: 56,
    FARM_FEED_BUY_ITEM_ADD_EDIT: 57,
    
    
    ACC_OPS_SETTINGS_EDIT:  60,
    ACC_PIG_OPS_LIST:       61,
    ACC_PIG_OPS_ADD_EDIT:   62,
    
    
    
    SUPPLIER_ADD_EDIT:      70,
    
    
    USER_LIST:              100,
    USER_ADD_EDIT:          101
    
    
};


const PIG_OPERATION_TYPE = {
    GESTATING:          1,
    LACTATING_PIGLETS:  2,
    LACTATING_SOW:      3,
    GILT:               4,
    WEANING_SOW:        5
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
    HARVESTED:          8,
    CLOSED:             9
};


const PIG_PROD_TYPE = {
    GESTATING:          1,  
    LACTATING:          2,
    GESTA_LACTA:        3,
    FATTENING:          4,
    ALL:                5,
    
    HARVESTED:          6
};


const SUPPLIER_TYPE ={
    FEED:               1,
    SEMEN:              2,
    GILT:               3
    
};



const MULTIKEY_OBJ_TYPE = {
    SOW_BOAR:           1,
    PIG_PROD:           2,
    PROD_GROUP:         3
    
};


const FEED_TYPE = {
    GESTA:              1,   
    LACTA:              2,   
    BOOSTER:            3,     
    PRESTARTER:         4, 
    STARTER:            5,     
    GROWER:             6,      
    FINISHER:           7    
};


const FEED_TYPE_NAME = {
    GESTA:              'Gesta',
    LACTA:              'Lacta',
    BOST:               'Booster',
    PRES:               'PreStarter',
    START:              'Starter',
    GROW:               'Grower',
    FINISH:             'Finisher'
};


const HARVEST_TYPE = {
    PIGLETS_SALE:           "Q92W83",
    LIVE_PIGS_SALE:         "EKQY8R",
    SLAUGHTER_PIGS_SALE:    "0KP5K7",
    GILT_SALE:              "1K7D9J",
    BOAR_SALE:              "08DZKQ",
    INTERNAL_GILT_BOAR:     "M9ZN9G", 
    BOAR_MATE_PAYMENT:      "M8BE8P",
    INTERNAL_CONSUMPTION:   "NKNG81",
    INTERNAL_SALE:          "18XJK5"
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
    SOCIAL_MEDIA,
    ACC_USER_GROUP,
    
    PAGE_ID,
    
    SOW_BOAR_TYPE,
    PIG_OPERATION_TYPE,
    SOW_STATUS,
    SOW_STATUS_NAME,
    PROD_STATUS,
    
    PIG_PROD_TYPE,
    SUPPLIER_TYPE,

    MULTIKEY_OBJ_TYPE,
    FEED_TYPE,
    FEED_TYPE_NAME,
    HARVEST_TYPE,
    
    
    REQUEST_ERROR_NUM
};
