/**
 * (c) Infotech, Inc.
 * @file	ift.nx.js
 * @desc	Infotech Non-ActiveX for EX-Adapter
 * @author	seung (stoas0605@gmail.com)
 * @since	2016.07.11
 */

var maxNxRequstSec = 60 * 5;//5min
maxNxRequstSec = 60;//30sec
var maxNxInstallSec = 10;//10sec
var nxExeDownloadUrl = location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/download/iftNxService_setup_2017071701.exe';
var _sp = 'jsp';

/**
 * @param	vo: vo.data(parameters), vo.success(success function; callback), vo.error(error function; callback)
 * @returns	json
 */
function fnGetNxCrtData(vo) {
	
	//validation
	var uidValid = true;
	if(!/^[0-9]{12}$/.test(vo.data.uid)) {
		vo.error('OTP(숫자 12자리를)를 확인하세요.');
		uidValid = false;
	}
	if(uidValid) {
		$.ajax({
			cache: false
			, url: vo.data.url
			, data: {
				'from': 'web'
				, 'op': 'checkOTP'
				, 'uid': vo.data.uid
				, 'type': 'session'
			}
			, success: function(d) {
				if(d.validOTP == 'N') {
					vo.error('OTP 번호가 만료되었습니다.\nOTP 번호를 갱신하세요.');
				} else {
					var isValid = vo.beforeSend(vo);
					if(uidValid && isValid) {
						fnNxRequest(vo.data);
						fnWebRequest(vo.data, vo.success, vo.error);
					}
				}
			}
			, error: function(e) {
				alert(e);
			}
		});
	}
}

/**
 * @param	vo: vo.data(parameters), vo.success(success callback function), vo.error(error callback function)
 * @returns	json
 */
function fnGetNxData(vo) {
	
	var dtc = fnDetect();
	
	$.ajax({
		cache: false
		, type: 'post'
		, url: vo.data.url
		, data: {
			'from': 'web'
			, 'op': 'hasSession'
		}
		, success: function(result) {

			if(result.hasSession) {
				vo.beforeSend();
				if('iOS' == dtc.os.family) {
					if(!vo.data.reload) {
						fnNxRequest(vo.data);
					} else {
						fnWebRequest(vo.data, vo.success, vo.error);
					}
				} else {
					fnNxRequest(vo.data);
					fnWebRequest(vo.data, vo.success, vo.error);
				}
			} else {
				alert("세션 정보가 유효하지 않습니다.\n세션 정보를 확인하세요.");
			}
		}
	});
}

var appTimeout;
function fnNxRequest(data) {
	
	var dtc = fnDetect();
	data.url = location.protocol + '//' + location.host + data.url;
	
	if(data.inJson) {
		
		if(data.inJson.orgCd == 'koroad') {
			data.inJson.ownerNm = data.inJson.ownerNm ? encodeURIComponent(data.inJson.ownerNm) : '';
			data.inJson.licence01 = data.inJson.licence01 ? encodeURIComponent(data.inJson.licence01) : '';
		}
		if(data.inJson.orgCd == 'minwon') {
			data.inJson.ownerNm = data.inJson.ownerNm ? encodeURIComponent(data.inJson.ownerNm) : '';
		}
		
		var cookieVO = $.extend({}, data.inJson);
		cookieVO.userId = '';
		cookieVO.userPw = '';
		var cookieExpire = new Date();
		cookieExpire.setTime(cookieExpire.getTime() + (1000 * 60 * 10));
		$.cookie('inJson', JSON.stringify(cookieVO), {
			expires: cookieExpire
			//, path: '/'
			//, domain: location.protocol + '//' + location.host
			//, secure: false
		});
	} else {
		data.inJson = "";
	}
	
	$.ajax({
		cache: false
		, type: 'post'
		, url: data.url
		, data: {
			'from': 'web'
			, 'op': 'getIds'
		}
		, success: function(ids) {
			
			var _nxIframe;
			var _nxSrc = '';
			var _nxParams = '';
			data.sid = ids.sidSum;
			//data.uid = ids.uid;
			
			$.each(data, function(k, v) {
				if('sid' == k || 'nxDialogUrl' == k || 'nxLogoUrl' == k || 'url' == k) {
					_nxParams += '&' + k + '=' + encodeURIComponent(encodeURIComponent(v));
				} else if('inJson' == k) {
					//_nxParams += '&' + k + '=' + ('IE' == dtc.browser.family && dtc.browser.name.indexOf('9') > -1 ? encodeURIComponent(encodeURIComponent(JSON.stringify(v))) : encodeURIComponent(JSON.stringify(v)));
					_nxParams += '&' + k + '=' + encodeURIComponent(encodeURIComponent(JSON.stringify(v)));
				} else {
					_nxParams += '&' + k + '=' + v;
				}
			});
			
			_nxSrc = 'Mobile' == dtc.device.type || 'Tablet' == dtc.device.type ? 'iftNxService://iftNxParam?' : 'iftNxService:iftNxParam?';
			_nxSrc += _nxParams.substring(1);
			
			if('Mobile' == dtc.device.type || 'Tablet' == dtc.device.type) {
				
				if('Android' == dtc.os.family) {
					document.location = 'intent://iftnxparam?' + _nxParams.substring(1) + '#Intent;package=ift.app.exa;scheme=iftnxservice;end';
				} else {
					document.location = _nxSrc;
				}
				
			} else {
				
				if($('#nxFrame').length) {
					$('#nxFrame').remove();
				}
				$('body').append($('<div/>', {'id':'nxFrame', name: 'nxFrame', style: 'display:none;'}));
				_nxIframe = "<iframe id='nxIframe' name='nxIframe' frameborder='0' height='0' marginheight='0' marginwidth='0' scrolling='yes' width='0' topmargin='0'"
					+ " src='" + _nxSrc + "'"
					+ "></iframe>";
				$('#nxFrame').append(_nxIframe);
			}
			
			$.fnLog((arguments.callee.name || ''), _nxSrc);
		}
		, error: function(e) {
			
		}
	});
}
function nxMarket() {
	$.cookie('nxInstalled', 'N');
	document.location = 'market://details?id=ift.app.exa';
}
var nxRequstSec = 0;
var webRequestTimer = 0;
function fnWebRequest(data, success, error) {

	var webData = $.extend({}, data);
	webData.from = 'web';
	var webRequest = function() {
		$.ajax({
			cache: false
			, type: 'post'
			, url: webData.url
			, data: webData
			, success: function(nxData) {
				
				$.fnLog((arguments.callee.name || ''), 'inJson cookie: ' + $.cookie('inJson'));
				$.fnLog('fnWebRequest:webRequest', JSON.stringify(nxData));
				
				nxRequstSec++;
				if('SUCCESS' == nxData.webRslCd) {
					if('setup' != webData.op && (nxData.outJson == null || nxData.outJson == '')) {
						if(nxRequstSec == maxNxRequstSec) {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom functionx x
							error('요청 제한 시간을 초과하였습니다.', nxData);
						} else {
							webRequestTimer = setTimeout(webRequest, 1000);
						}
					} else if('setup' == webData.op || 'update' == webData.op) {
						
						if(nxData.isInstalled == 'Y') {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom function
							success(nxData);
							$.cookie('inJson', null);
						} else if(nxData.isInstalled == 'U') {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom function
							error('버전 업데이트가 필요합니다.', nxData);
						} else if(nxRequstSec == maxNxInstallSec) {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom function
							error('설치가 필요합니다.', nxData);
						} else {
							webRequestTimer = setTimeout(webRequest, 1000);
						}
					} else if('execute' == webData.op || 'certP2S' == webData.op) {
						
						if(nxData.outJson.errYn == 'N') {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom function
							success(nxData);
							$.cookie('inJson', null);
						} else if(nxData.outJson.errYn == 'Y') {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom function
							error(nxData.outJson.errMsg, nxData);
							$.cookie('inJson', null);
						} else {
							nxRequstSec = 0;
							clearTimeout(webRequestTimer);
							//custom function
							error('시스템 오류입니다.\n관리자에게 문의하세요.', nxData);
						}
					}
				} else {
					nxRequstSec = 0;
					clearTimeout(webRequestTimer);
					error(nxData.webRslMsg);
				}
			}
			, error: function(e) {
				error(e.message);
			}
		});
	};
	
	webRequestTimer = setTimeout(webRequest, 1000);
}

/**
 * @param	nxExeDownloadUrl
 */
function fnNxDownload(url) {
	$('#ifrFile').attr('src', url ? url : nxExeDownloadUrl);
	//$('#frmN').frmSubmit('/nx/nxWindowDownload');
	$.fnLog((arguments.callee.name || ''), 'iftNxSetup has downloaded!!!!');
}

/**
 * ua.browser.family: "Mobile Safari"
 * ua.browser.name: "Mobile Safari 4.0.5"
 * ua.browser.version: "4.0.5"
 * ua.browser.major: 4
 * ua.browser.minor: 0
 * ua.browser.patch: 5
 * ua.device.family: "iPhone"
 * ua.device.name: "iPhone"
 * ua.device.version: ""
 * ua.device.major: null
 * ua.device.minor: null
 * ua.device.patch: null
 * ua.device.type: "Mobile"
 * ua.device.manufacturer: "Apple"
 * ua.os.family: "iOS"
 * ua.os.name: "iOS 4"
 * ua.os.version: "4"
 * ua.os.major: 4
 * ua.os.minor: 0
 * ua.os.patch: null
 */
function fnDetect() {
	var dtc = detect.parse(navigator.userAgent);
	return dtc;
}

//init mask
var nxLoadingMask = nxLoadingMask || (function () {
	return {
		show: function(msg) {
			HoldOn.open({
				message: msg
				//sk-rect/sk-bounce/sk-folding-cube/sk-circle/sk-dot/sk-bounce/sk-falding-circle/sk-cub-grid/custom
				//, theme: 'sk-circle'
				//, content: '<b style="color:#fff;">hello</b>'
				, backgroundColor: '#000000'
				, textColor: 'white'
			});
			$.fnLog(arguments, 'nxLoading show!!!!');
		},
		hide: function () {
			HoldOn.close();
			$.fnLog(arguments, 'nxLoading hide!!!!');
		}
	};
})();

