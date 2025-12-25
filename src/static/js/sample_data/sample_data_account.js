G_SAMPLE_COMPANY_APP = {
	"product_name": "PiggyProd"
};

G_SAMPLE_USER_ACCOUNT = {
	"user": {
		"hid": "WPG2P2",
		"name_last": "Wong",
		"name_first": "Jack",
		
		"user_group":{
			"hid":"EG5RPR",
			"name":"Admin"
		},
		
		"assigned_farms":["Q92W83"],
		"default_farm":"Q92W83"
	},
	
	"account":{
		"hid": "EG5RPR",
		"name": "Jackson Farm",
		
		"pig_farms":[
			
			{
				"hid": "Q92W83",
				"name": "Jackson Farm Punod" 
			}
		]
	}
	
	
}



G_SAMPLE_JSON_ACCOUNT = {
  "result": {
    "num": 0,
    "code": "SUCCESS",
    "desc": ""
  },
  "account": {
    "flag": 1,
    "status_id": 1,
    "status_name": "On Trial",
    "hid": "EG5RPR"
  },
  "settings_operations": {
    "day_1_on_date_of_birth": 1,
	"day_1_on_date_of_insem": 0,
    "num_days_wean": 45,
    "num_days_harvest_from_birth": 142,
    "num_days_harvest_from_wean": 97
  }
};

G_SAMPLE_ACCOUNT_LOOKUP_SELECTION = {
  "result": {
    "num": 0,
    "code": "SUCCESS",
    "desc": ""
  },
  "f_brand": [
    "Q92W83"
  ],
  "f_supplier": [
    "Q92W83",
    "EKQY8R"
  ],
  "s_supplier": [
    "Q92W83",
    "EKQY8R"
  ]
};
