G_SAMPLE_COMPANY_APP = {
	"product_name": "PiggyProd"
};

G_SAMPLE_USER_ACCOUNT = {
	"user": {
		"user": {
			"flag": 19,
			"email": "jwong@gmail.com",
			"mobile_num": "9990900",
			"name_last": "Wong",
			"name_first": "Jack",
			"hid": "WPG2P2"
		},
		"user_group": {
			"id": 1,
			"group_num": 1,
			"flag_business_obj_1": 4294967295,
			"flag_business_obj_2": 4294967295,
			"name": "Admin"
		},
		"pig_farms": [
			"Q92W83"
		]
	},
	"account": {
		"account": {
			"flag": 1,
			"status_id": 1,
			"status_name": "On Trial",
			"hid": "EG5RPR"
		},
		"settings_operations": {
			"day_1_on_date_of_birth": 1,
			"day_1_on_date_of_insem": 0,
			"num_days_wean": 40,
			"num_days_harvest_from_birth": 142,
			"num_days_harvest_from_wean": 100,
			"last_update": {
				"name_last": 0,
				"name_first": 0,
				"dt_update": "Wong"
			}
		},
		"pig_farms": [
			{
				"pig_farm": {
					"flag": 1,
					"name": "Jackson Farm Punod",
					"hid": "Q92W83"
				},
				"location": {
					"country": {
						"id": 1,
						"name": "Philippines"
					},
					"address": {
						"level_1": {
							"name": "Cebu",
							"hid": "Q92EW8"
						},
						"level_2": {
							"name": "City of Naga",
							"hid": "9GRLXK"
						},
						"level_3": {
							"name": "Tagjaguimit",
							"hid": "8X1VVJ"
						}
					},
					"geoloc": {
						"latitude": 10.263,
						"longitude": 123.68672
					}
				}
			}
		]
	}
};



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
