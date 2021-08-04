const config = {};

// ENV
config.ENV = 'local'; // local | test | dev | prod
config.env = config.ENV;

// Port
config.port = process.env.PORT || 8001;
config.securePort = process.env.SECURE_PORT || 8100;

// MySQL
config.mysql = {
	  host: 'remotemysql.com',
	  user: 'tWu74Jg3Da',
	  password: 'o6sRbMv5Va', 
	  database: 'tWu74Jg3Da',
};


// JWT HMAC SHA256
config.jwtSecret = 'cnq$(S5MVUnHKgGcV585yA+/3499KWQw@sSgy2F}Hc/H^M3E/JDZM4V7Hz<f^+VbaTUAUUK/%=D4-_Pq>+`}AHp_kjmKjm_F@d~6qT;3qT+V[b@!=$=$2s*_7D4Sz?vtst+P#_WWC336HT)PjgwbKQg_$$Jg:2=fc/_K4&y"&ZG[<*6gd->f#BGeFz=fXAdD?"8CNntv*)@NXz-)XUrgty.B(8,"+eV!>6t7{rrY?Edf=2]H~4np)KEQse`E.f9z';

// APP
config.app = {
  name: 'bwapi',
  contactEmail: 'jcduhail@bitwallet.com',
};


// Domains
config.domains = {
  api: 'http://localhost',
};

config.mt5 = {
  'mt5_rep':'D:/src/api/data',
  'mt5_api_url':'http://localhost.devsecure7.bitwallet.com/sys47/ja/mt5_api/MT5_ShiftFX_Test_Use.php',
  'mt5_update_delay':1000
}

module.exports = config;
