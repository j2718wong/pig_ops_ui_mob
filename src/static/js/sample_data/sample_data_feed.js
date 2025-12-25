
var G_SAMPLE_DATA_FEED_TYPE = [
    {
      "name": "GESTATING",
      "hid": "Q92W83",
	  "order_num": 1
    },
    {
      "name": "LACTATING",
      "hid": "EKQY8R",
	  "order_num": 2
    },
    {
      "name": "BOOSTER",
      "hid": "0KP5K7",
	  "order_num": 3
    },
    {
      "name": "PRE_STARTER",
      "hid": "1K7D9J",
	  "order_num": 4
    },
    {
      "name": "STARTER",
      "hid": "08DZKQ",
	  "order_num": 5
    },
    {
      "name": "GROWER",
      "hid": "M9ZN9G",
	  "order_num": 6
    },
    {
      "name": "FINISHER",
      "hid": "M8BE8P",
	  "order_num": 7
    }
  ];


var G_SAMPLE_DATA_FEED_BRAND = [
    {
      "location": {
        "country": {
          "id": 1,
          "name": "Philippines"
        }
      },
      "name": "Promix",
      "dt_entry": "2025-09-05 05:49:57",
      "hid": "Q92W83"
    },
    {
      "location": {
        "country": {
          "id": 1,
          "name": "Philippines"
        }
      },
      "name": "Ultrapack",
      "dt_entry": "2025-09-05 05:49:59",
      "hid": "EKQY8R"
    }
  ];
  
  
var G_SAMPLE_DATA_FEED_SUPPLIER = [
    {
      "feed_supplier": {
        "name": "Arnel Sampan",
        "contact_number": null,
        "whatsapp": null,
        "messenger": null,
        "hid": "Q92W83"
      },
      "location": {
        "country": {
          "id": 1,
          "name": "Philippines"
        },
        "address": {
          "level_1": {
            "id": 49
          },
          "level_2": {
            "id": 1013
          },
          "level_3": {
            "id": 1013
          }
        }
      }
    },
    {
      "feed_supplier": {
        "name": "Daphne Panonce",
        "contact_number": null,
        "whatsapp": null,
        "messenger": null,
        "hid": "EKQY8R"
      },
      "location": {
        "country": {
          "id": 1,
          "name": "Philippines"
        },
        "address": {
          "level_1": {
            "id": 49
          },
          "level_2": {
            "id": 1013
          },
          "level_3": {
            "id": 1013
          }
        }
      }
    }
  ]; 
  
  
var G_SAMPLE_DATA_FEED_BUY = [
    {
      "feed_buy": {
        "date_buy": "2025-06-23",
        "quantity": 2,
        "unit_weight": 50,
        "kg_total": 100,
        "unit_cost": 1670,
        "total_cost": 3340,
        "dt_entry": "2025-09-09 05:16:27",
        "hid": "M8BE8P"
      },
      "feed_type": {
        "name": "LACTATING",
        "hid": "EKQY8R"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-06-23",
        "quantity": 10,
        "unit_weight": 1,
        "kg_total": 10,
        "unit_cost": 75,
        "total_cost": 750,
        "dt_entry": "2025-09-09 05:16:28",
        "hid": "NKNG81"
      },
      "feed_type": {
        "name": "BOOSTER",
        "hid": "0KP5K7"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-07-05",
        "quantity": 10,
        "unit_weight": 1,
        "kg_total": 10,
        "unit_cost": 75,
        "total_cost": 750,
        "dt_entry": "2025-09-09 05:16:28",
        "hid": "18XJK5"
      },
      "feed_type": {
        "name": "BOOSTER",
        "hid": "0KP5K7"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-07-17",
        "quantity": 2,
        "unit_weight": 25,
        "kg_total": 50,
        "unit_cost": 1320,
        "total_cost": 2640,
        "dt_entry": "2025-09-09 05:16:28",
        "hid": "M86D9R"
      },
      "feed_type": {
        "name": "PRE_STARTER",
        "hid": "1K7D9J"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-07-31",
        "quantity": 11,
        "unit_weight": 50,
        "kg_total": 550,
        "unit_cost": 1850,
        "total_cost": 20350,
        "dt_entry": "2025-09-09 05:16:28",
        "hid": "E8519Q"
      },
      "feed_type": {
        "name": "STARTER",
        "hid": "08DZKQ"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-09-02",
        "quantity": 4,
        "unit_weight": 50,
        "kg_total": 200,
        "unit_cost": 1700,
        "total_cost": 6800,
        "dt_entry": "2025-09-09 05:16:28",
        "hid": "28R78Q"
      },
      "feed_type": {
        "name": "GROWER",
        "hid": "M9ZN9G"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-09-24",
        "quantity": 6,
        "unit_weight": 50,
        "kg_total": 300,
        "unit_cost": 1700,
        "total_cost": 10200,
        "dt_entry": "2025-09-29 09:13:02",
        "hid": "EKQVY8"
      },
      "feed_type": {
        "name": "GROWER",
        "hid": "M9ZN9G"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-10-03",
        "quantity": 4,
        "unit_weight": 50,
        "kg_total": 200,
        "unit_cost": 1700,
        "total_cost": 6800,
        "dt_entry": "2025-10-08 10:17:06",
        "hid": "0KPE59"
      },
      "feed_type": {
        "name": "GROWER",
        "hid": "M9ZN9G"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-10-10",
        "quantity": 8,
        "unit_weight": 50,
        "kg_total": 400,
        "unit_cost": 1700,
        "total_cost": 13600,
        "dt_entry": "2025-10-10 11:23:28",
        "hid": "NKN0GK"
      },
      "feed_type": {
        "name": "GROWER",
        "hid": "M9ZN9G"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-10-13",
        "quantity": 4,
        "unit_weight": 50,
        "kg_total": 200,
        "unit_cost": 1575,
        "total_cost": 6300,
        "dt_entry": "2025-10-13 16:43:08",
        "hid": "28RX78"
      },
      "feed_type": {
        "name": "FINISHER",
        "hid": "M8BE8P"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Arnel Sampan",
        "hid": "Q92W83"
      }
    },
    {
      "feed_buy": {
        "date_buy": "2025-10-27",
        "quantity": 7,
        "unit_weight": 50,
        "kg_total": 350,
        "unit_cost": 1555,
        "total_cost": 10885,
        "dt_entry": "2025-10-27 11:23:52",
        "hid": "W9LD48"
      },
      "feed_type": {
        "name": "FINISHER",
        "hid": "M8BE8P"
      },
      "feed_brand": {
        "name": "Promix",
        "hid": "Q92W83"
      },
      "feed_supplier": {
        "name": "Daphne Panonce",
        "hid": "EKQY8R"
      }
    }
  ];
  
  