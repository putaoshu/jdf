define('unit/login/login.js',function(require,exports,module){
	var setUserInfo = require('unit/setUserInfo/setUserInfo.js');
	var jdEvent = require('unit/event/event.js');
	var dialog = require('ui/dialog/dialog.js');
	/** 
	* @login登录注册
	* @example
		var jdLogin = require('unit/login/login.js');
		jdLogin({
			modal: true,//false跳转,true显示登录注册弹层
			complete: function() {
				//回调函数
			}
		})
	*/

	//登陆成功之后回调用
	var jdModelCallCenter = {};
	window.jdModelCallCenter = jdModelCallCenter;

	/**
	* @取得http或者https
	*/
	var getHttp = function(){
		return 'https:' == document.location.protocol ? 'https://' : 'http://'; 
	}

	/**
	* @event.on登陆成功之后
	* @来源:http://passport.jd.com/new/misc/js/login.js?t=20130718
	* @来源:http://passport.jd.com/uc/popupLogin2013?clstag1=login&clstag2=login
	*/
	jdEvent.on('loginSuccessByIframe',function(result){
		setUserInfo({
			callback:function(data){
				$.closeDialog();
				//如果要避免二次验证的话要升级接口
				$.ajax({
					url:getHttp() +  "passport.jd.com/loginservice.aspx?callback=?",
					data:{method: "Login"},
					dataType:'json',
					success:function(result){
						if (result != null && result.Identity.IsAuthenticated) {
							jdEvent.trigger('loginSuccessCallback',result);
						}
					}
				});
			}
		})
	});

	/*
	*@login登录注册
	*@回调函数为complete
	*/
	var login = function(options) {
		options = $.extend({
			loginService: getHttp() +  "passport.jd.com/loginservice.aspx?callback=?",
			loginMethod: "Login",
			loginUrl: getHttp() +  "passport.jd.com/new/login.aspx",
			returnUrl: location.href,
			automatic: false,//是否走自己的回调
			complete: null,//回调函数
			modal: false,//false跳转,true显示登录注册弹层
			clstag1: 0,
			clstag2: 0
		}, options || {});
		
		/**
		* @登陆iframe浮层
		*/
		var iframe = {
			login: function() {
				var userAgent = navigator.userAgent.toLowerCase(),
					flag = (userAgent.match(/ucweb/i) == "ucweb" || userAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4");
				if (flag) {
					location.href = options.loginUrl +"?ReturnUrl=" + escape(returnUrl);
					return;
				}

				$.closeDialog();
				this.loginDialog = $('body').dialog({
					title:'您尚未登录',
					width:390,
					///height: 350,
					type:'iframe',
					fixed :true,
					source: "http://passport.jd.com/uc/popupLogin2013?clstag1=" + options.clstag1 + "&clstag2=" + options.clstag2 + "&r=" + Math.random()
				});
			},
			regist: function() {
				$.closeDialog();
				this.registDialog = $('body').dialog({
					title:'您尚未登录',
					width:390,
					//height: 450,
					type:'iframe',
					fixed :true,
					source: "http://reg.jd.com/reg/popupPerson?clstag1=" + options.clstag1 + "&clstag2=" + options.clstag2 + "&r=" + Math.random()
				});
			}
		}

		jdModelCallCenter.regist = function(){
			 iframe.regist();
		}

		jdModelCallCenter.login =  function(){
			 iframe.login();
		}

		jdModelCallCenter.init = function(result){
			 jdEvent.trigger('loginSuccessByIframe',result)
		}

		if (options.loginService != "" && options.loginMethod != "") {
			$.getJSON(options.loginService, {
				method: options.loginMethod
			}, function(result) {
				if (result != null) {
					//走自己的回调
					if (options.automatic && options.complete != null) {
						options.complete(result);
					}

					//成功
					if (result.Identity.IsAuthenticated && options.complete != null && !options.automatic) {
						options.complete(result);
					}

					//未成功 ==> 弹层或者跳转
					if (!result.Identity.IsAuthenticated && options.loginUrl != "" && !options.automatic) {
						if (options.modal) {
							//登录注册弹出层
							iframe.login();
							jdEvent.on('loginSuccessCallback',function(data){
								if (options.complete != null) {
									options.complete(data);
								}
							});
						} else {
							//跳转
							location.href = options.loginUrl + "?ReturnUrl=" + escape(options.returnUrl)
						}
					}
				}
			})
		}
	};

	return login;
});