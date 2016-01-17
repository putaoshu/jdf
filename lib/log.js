/**
 * @Logs 
 */
var $ = require('./base.js');
var jdf = require('./jdf.js');

var log = module.exports;
var os = require('os');
var SERVERURL = '';

var getIp = function(){
	var net = os.networkInterfaces();
    for(var key in net){
        if(net.hasOwnProperty(key)){
            var items = net[key];
            if(items && items.length){
                for(var i = 0; i < items.length; i++){
                    var ip = String(items[i].address).trim();
                    if(ip && /^\d+(?:\.\d+){3}$/.test(ip) && ip !== '127.0.0.1'){
                        return ip;
                    }
                }
            }
        }
    }
    return '127.0.0.1';
};

log.get = function (){
	var ip = getIp();
	var version = require('../package.json').version;

	return {
		ip:ip,		
		port:jdf.config.localServerPort,
		platform:os.platform(),
		hostname:os.hostname(),
		version:version,
		//other
		projectname:jdf.getProjectPath()
	}
}

/**
 * @log send
 */
log.send = function (str){
	if ( str && jdf.config.haslog == true){
		var param = log.get();
		param.cmd = str;
		var str = '';
		for (var i in param){
			str += i +'=' +param[i]+'&';
		}
		str = encodeURI(str);
		//console.log(str);
		// $.httpget('http://jdfe.sinaapp.com/log/log.php?'+str);
	}
}
