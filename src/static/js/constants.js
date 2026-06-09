// December 24, 2025
// Jack Wong
// j2718wong@gmail.com


const APPLICATION = {
    REQUEST_TIMEOUT:                5000,
    NUM_MSECS_1DAY:                 1000 * 60 * 60 * 24,
    
    NUM_MSECS_CACHE_DATA:           7 * 24 * 60 * 60 * 1000,
    
    MOBILE_TABLE_ROW_PER_PAGE:      10,
    
    MAX_WIDTH_WINDOW_IS_MOBILE:     768,
    
    
    DEFAULT_NUM_DAYS_WEAN:          35,
    DEFAULT_NUM_DAYS_MIN_HARVEST:   140,
    
    // Pigs weigh below this number are considered extra small;
    // Will not be computed in average weight'
    // 
    // in kilograms
    MAX_WEIGHT_CATEGORY_XSMALL:     7.0,
    
    
    MIN_DAYS_MATING_BECOME_HISTORY: 15,
    MIN_DAYS_BIRTH_BECOME_HISTORY:  15,
    MIN_DAYS_WEANING_BECOME_HISTORY:15,
    
    
    DEBUG_NAV_HISTORY:              true
};

const SERVER_CONNECTION = {
    NORMAL:         0,
    NO_INTERNET:    1,
    SERVER_DOWN:    2
    
};


const DEFAULT_WEEKDAY = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


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


const NAV_MENU_GROUP = {
    PRODUCTION:             1,
    SOW_BOAR_GILT:          2,
    OPERATIONS:             3,
    FINANCIALS:             4,
    ACCOUNT_LISTS:          5,
    SETTINGS:               6,
    ADMIN:                  7
};


const TRANSLATION_MODE = {
    USE_ENGLISH:            0,
    ENGLISH_FIRST_THEN_LOCAL: 1,    // if local translation not available use english
    USE_LOCAL:              2       // if local translation not available use english
};



const PAGE_ID = {
    NOT_LOGGED_IN:          0,
    SIGNUP_OR_LOGIN:        1,
    USER_EMAIL_VERIFY:      2,
    USER_WAIT_ACCOUNT_ACCESS: 3,
    
    CREATE_OR_JOIN_ACCOUNT: 4,
    ADD_FARM:               5,
    REQ_JOIN_ACC_SENT:      6,
    TERMS_OF_SERVICE:       7,
    PRIVACY_POLICY:         8,
    
    
    MY_ACCOUNT:             10,
    CUSTOMER_PRICING:       11,
    USER_SETTINGS:          12,
    
    
    HOME:                   14,
    FEEDBACK_US:            15,
    
    
    BILL_HISTORY_LIST:      18,
    BILL_NEW:               19,
    
    PIG_FARM_ADD_EDIT:      20,
    
    
    SOW_BOAR_LIST:          21,
    SOW_BOAR_ADD_EDIT:      22,
    SOW_BOAR_ENTRY:         23,
    SOW_BOAR_DISPOSED:      24,
    
    MEDVAC_ADD_EDIT:        25,
    HEALTH_ADD_EDIT:        26,
    NOTES_ADD_EDIT:         27,
    
    
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
    
    PROD_OUTPUT:            45,
    PROD_NOT_PREGNANT_LIST: 46,
    
    
    PROD_SALES_LIST:        48,
    PROD_SALES_ENTRY:       49,
    
    
    ALL_FEED_BAL_LIST:      50,
    ALL_FEED_BAL_ADD_EDIT:  51,
    
    FARROWING_SCHEDULE:     52,
    
    BOAR_EXT_MATE_LIST:     53,
    BOAR_EXT_MATE_ADD_EDIT: 54,
    
    PIG_DEAD_LIST:          55,
    PIG_DEAD_ADD_EDIT:      56,
    
    ACC_FARROW_CHECKLIST:   57,
    ACC_F_CHECKLIST_ADD_EDIT: 58,   

    FEEDS_CONSUMED:         59,
    
    
    FARM_FEED_BUY_LIST:     70,
    FARM_FEED_BUY_ADD_EDIT: 71,
    FARM_FEED_BUY_ITEM_ADD_EDIT: 72,
    
    SUMMARY_REPORT_LIST:    73,
    SUMMARY_REPORT_ADD_EDIT:74,
    
    
    
    
    ACC_OPS_SETTINGS_EDIT:  80,
    ACC_PIG_OPS_LIST:       81,
    ACC_PIG_OPS_ADD_EDIT:   82,
    
    
    
    SUPPLIER_ADD_EDIT:      90,
    
    
    USER_LIST:              100,
    USER_ADD_EDIT:          101,
    
    ACCESS_CODE_LIST:       102,
    ACCESS_CODE_ADD_EDIT:   103,
    
    ACC_REFERRAL_LIST:      104,
    ACC_REFERRAL_ENTRY:     105,
    
    
    JOIN_ACC_REQ_LIST:      106,
    JOIN_ACC_REQ_APPROVE:   107,
    
    SYSTEM_STATS:           108
};


const HASH_ROUTES = {
    HOME:                   'home',
    
    MY_ACCOUNT:             'my_account',
    CUSTOMER_PRICING:       'pricing',
    USER_SETTINGS:          'user_settings',
    BILL_NEW:               'bill_new',

    
    PROD_GESTA_LIST:        'prod_gesta_list',
    PROD_GESTA_ADD:         'prod_gesta_add',
    PROD_GESTA_ENTRY:       'prod_gesta_entry',
    
    PROD_LACTA_LIST:        'prod_lacta_list',
    PROD_LACTA_ENTRY:       'prod_lacta_entry',
    
    PROD_FATTENING_LIST:    'fattening_list',
    PROD_FATTENING_ADD:     'fattening_add',

    PROD_HISTORY_LIST:      'prod_history_list',
    PROD_HISTORY_ENTRY:     'prod_history_entry',
    
    PROD_OUTPUT:            'prod_output',
    PROD_NOT_PREGNANT_LIST: 'not_pregnant_list',
    
    SOW_BOAR_LIST:          'sow_boar_list',
    SOW_BOAR_ENTRY:         'sow_boar_entry',
    SOW_BOAR_ADD_EDIT:      'sow_boar_add_edit',
    SOW_BOAR_DISPOSED:      'sow_boar_disposed',
    TRACE_PARENTS:          'trace_parents',
    

    ALL_FEED_BAL_LIST:      'feed_balance_list',
    ALL_FEED_BAL_ADD_EDIT:  'feed_balance_add_edit',
    
    FARROWING_SCHEDULE:     'farrowing_schedule',
    
    BOAR_EXT_MATE_LIST:     'boar_ext_mate_list',
    BOAR_EXT_MATE_ADD_EDIT: 'boar_ext_add_edit',
    
    PIG_DEAD_LIST:          'pig_dead_list',
    PIG_DEAD_ADD_EDIT:      'pig_dead_add_edit',
    
    ACC_FARROW_CHECKLIST:   'acc_farrow_checklist',
    ACC_F_CHECKLIST_ADD_EDIT: 'acc_f_checklist_add_edit',
    
    FEEDS_CONSUMED:         'feeds_consumed',
    
    PROD_SALES_LIST:        'prod_sales_list', 
    PROD_SALES_ENTRY:       'prod_sales_entry',
    
    FARM_FEED_BUY_LIST:     'feed_buy_list',
    FARM_FEED_BUY_ADD_EDIT: 'feed_buy_add_edit',
    FARM_FEED_BUY_ITEM_ADD_EDIT: 'feed_buy_item_add_edit' 
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
    7:  'Sold',
    
    99: 'Deleted'
    
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
    CLOSED:             9,
    NO_LIVE_PIGLETS:    10,
    
    DELETE:            99
    
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
    PRES:               'PreStart',
    START:              'Starter',
    GROW:               'Grower',
    FINISH:             'Finisher'
};


// These are manually hashed feed_type.id
const DEFAULT_UNIT_WEIGHT = {
    "3QLG0EDV":  50,
    "N5EP4LPW":  50,
    "W9L96L0N":  1,
    "0GL8JLMY":  25,
    "X0E23RNP":  50,
    "34RDPRBJ":  50,
    "GNEB2L1X":  50
};


// These are manually hashed harvest_type.id
const HARVEST_TYPE = {
    PIGLETS_SALE:           "3QLG0EDV",
    LIVE_PIGS_SALE:         "N5EP4LPW",
    SLAUGHTER_PIGS_SALE:    "W9L96L0N",
    GILT_SALE:              "0GL8JLMY",
    BOAR_SALE:              "X0E23RNP",
    INTERNAL_GILT_BOAR:     "34RDPRBJ", 
    BOAR_MATE_PAYMENT:      "GNEB2L1X",
    INTERNAL_CONSUMPTION:   "3NRWBRM2",
    INTERNAL_SALE:          "GPE78RNX"
};


const DATA_VER_NUM_PIG_FARM = {
    SOW:                    0,
    BOAR:                   1,
    PIG_PROD:               2,
    PROD_HISTORY:           3,
    STAFF:                  4,
    
    FEED_BUY:               5,
    FEED_BALANCE:           6,
    NOT_PREGNANT:           7,
    BOAR_EXT_MATE:          8,
    PIG_DEAD:               9,
    
    SOW_DUE_CHECKLIST:      10,
    SOW_BOAR_DISPOSED:      11,
    PROD_GESTATING:         12,
    PROD_LACTATING:         13,
    PROD_FATTENING:         14
};


const DATA_VER_NUM_ACCOUNT = {
    GESTA_OPS:              0,
    LACTA_PIGLETS_OPS:      1,
    LACTA_SOW_OPS:          2,
    GILT_OPS:               3,
    WEANING_SOW_OPS:        4,
    
    ACCOUNT:                5,
    PIG_BUYER:              6,
    SOW_DUE_CHECKLIST:      7
};



const REPORT_TYPE = {
    PIG_FARM_SUMMARY:       1    
};



const REQUEST_ERROR_NUM ={
    ERROR_DATABASE_ERROR:                       1,
    ERROR_SERVER_ERROR:                         2,  
    
    ERROR_USER_INACTIVE:                        3,
    ERROR_ACCOUNT_DISABLED:                     4,
    ERROR_ACCOUNT_BILL_OVERDUE:                 5

};


const ACCOUNT_BILL_STATUS = {
    ISSUED:                     0,
    PENDING_PAYMENT_VERIFY:     1,
    VERIFIED_PAID:              2
};


const ALERT_TYPE = {
    NEW_BILL:                   1,
    PIG_OPS_MEDVAC_PREP:        2
    
};


const FLAG_BITS ={
    USER:{
        IS_ACTIVE:              1,
        EMAIL_VERIFIED:         2,
        MOBILE_NUM_VERIFIED:    4,
        IS_DELETED:             8,
        
        IS_ACCOUNT_ADMIN:       16,
        IS_INTERNAL_DATA_ENTRY: 32,
        IS_INTERNAL_FINANCE:    64,
        IS_TEST_USER:           128,
        
        IS_SYS_ADMIN:           256
    },
    
    ACCOUNT:{
        ENABLE:                 1,
        FREE_TRIAL_STARTED:     2,
        
        IS_BILL_EXEMPTED:       16,   
        IS_TEST_ACCOUNT:        32,
        IS_COMPANY_OWNED:       64
    },
    
    
    APP_COUNTRY:{
        ENABLE:                 1,
        HAS_ADDRESS_LEVELS:     2
    },
    
    PIG_PROD:{
        IS_A_GROUP:             2,
        EXTERNAL_PIGLETS:       4
    }
    
};


export {
    APPLICATION,
    SERVER_CONNECTION,
    DEFAULT_WEEKDAY,
    SOCIAL_MEDIA,
    ACC_USER_GROUP,
    
    TRANSLATION_MODE,

    
    NAV_MENU_GROUP,
    PAGE_ID,
    HASH_ROUTES,
    
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
    DEFAULT_UNIT_WEIGHT,
    HARVEST_TYPE,
    
    DATA_VER_NUM_PIG_FARM,
    DATA_VER_NUM_ACCOUNT,
    
    REPORT_TYPE,
    
    REQUEST_ERROR_NUM,
    
    ACCOUNT_BILL_STATUS,
    
    ALERT_TYPE,
    
    FLAG_BITS
};
