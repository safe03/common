/**
 * (c) Infotech, Inc.
 * @file	ift.nx.js
 * @desc	Infotech common util java script
 * @author	seung (stoas0605@gmail.com)
 * @since	2016.06.22
 */

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
var deviceInfo;
$(function() {
	
	deviceInfo = detect.parse(navigator.userAgent);
	
	//enter event
	$('.data-enter').on('keypress', function(e) {
		if(e.which == 13) {
			e.preventDefault();
			$(this).closest('form').find($(this).attr('data-enter')).click();
		}
	});
	
	if((typeof $.validator) != 'undefined') {
		$.validator.setDefaults({
			onkeyup: false
			, onclick: false
			, onfocusout: false
			, showErrors: function(m, l) {
				if(this.numberOfInvalids()) {
					alert(l[0].message);
					l[0].element.focus();
				}
			}
			//, ignore: ''
		});
		$.validator.addMethod('consent', function(v, e) {
			return 'Y' == v ? true : false;
		});
		$.validator.addMethod('tel', function(v, e) {
			//return this.optional(e) || /^\d{2,3}-\d{3,4}-\d{4}$/.test(v);
			return this.optional(e) || /^[0-9-]{7,16}$/.test(v);
		});
	}
});

var _LOG = false;

(/**
 * @param $
 */
function($) {
	$.extend({
		/**
		 * fnGetDate({date: new Date(), format: 'yyyy-MM-dd HH:mm:ss', yyyy: '', MM: '', dd: '', HH: '', mm: '', ss: '', add: {yyyy: 0, MM: 0, dd: 0, HH: 0, mm: 0, ss: 0}});
		 */
		fnGetDate: function(o) {
			
			var options;
			
			options = o ? o : {date: new Date(), format: 'yyyy-MM-dd', yyyy: '', MM: '', dd: '', HH: '', mm: '', ss: '', add: {yyyy: 0, MM: 0, dd: 0, HH: 0, mm: 0, ss: 0}};
			
			options.date = options.date ? options.date : new Date();
			options.add = options.add ? options.add : {yyyy: 0, MM: 0, dd: 0, HH: 0, mm: 0, ss: 0};
			
			var d = options.format ? options.format : 'yyyy-MM-dd';
			
			if(options.add.yyyy) options.date.setFullYear(options.date.getFullYear() + options.add.yyyy);
			if(options.add.MM) options.date.setMonth(options.date.getMonth() + options.add.MM);
			if(options.add.dd) options.date.setDate(options.date.getDate() + options.add.dd);
			if(options.add.HH) options.date.setHours(options.date.getHours() + options.HH);
			if(options.add.mm) options.date.setMinutes(options.date.getMinutes() + options.add.mm);
			if(options.add.ss) options.date.setSeconds(options.date.getSeconds() + options.add.ss);
			
			var yyyy = options.yyyy ? options.yyyy : (options.date.getFullYear()).toString();
			var MM = options.MM ? options.MM : (options.date.getMonth() + 1).toString();
			var dd = options.dd ? options.dd : options.date.getDate().toString();
			var HH = options.HH ? options.HH : options.date.getHours().toString();
			var mm = options.mm ? options.mm : options.date.getMinutes().toString();
			var ss = options.ss ? options.ss : options.date.getSeconds().toString();
			
			d = d.replace('yyyy', yyyy);
			d = d.replace('MM', (MM[1] ? MM : '0' + MM[0]));
			d = d.replace('dd', (dd[1] ? dd : '0' + dd[0]));
			d = d.replace('HH', (HH[1] ? HH : '0' + HH[0]));
			d = d.replace('mm', (mm[1] ? mm : '0' + mm[0]));
			d = d.replace('ss', (ss[1] ? ss : '0' + ss[0]));
			
			return d;
		},
		/**
		 * @param	src	: source
		 * @return	half width char
		 */
		fnFullWidthToHalfWidth: function(src) {
			var halfWidth = '';
			var c;
			for(var i = 0; i < src.length; i++) {
				c = src.charCodeAt(i);
				if(c >= 65281 && c <= 65374 && c != 65340) {
					halfWidth += String.fromCharCode(c - 65248);
				} else if(c == 8217) {
					halfWidth += String.fromCharCode(39);
				} else if(c == 8221) {
					halfWidth += String.fromCharCode(34);
				} else if(c == 12288) {
					halfWidth += String.fromCharCode(32);
				} else if(c == 65507) {
					halfWidth += String.fromCharCode(126);
				} else if(c == 65509) {
					halfWidth += String.fromCharCode(92);
				} else {
					halfWidth += src.charAt(i);
				} 
			}
			return halfWidth;
		},
		/**
		 * @param	src	: source
		 * @return	true: full width, false: half width
		 */
		fnIsFullWidth: function(src) {
			var c;
			for(var i = 0; i < src.length; i++) {
				c = src.charCodeAt(i);
				if(c < 256 || (c >= 0xff61 && c <= 0xff9f)) {
					return false;
				}
			}
			return true;
		},
		/**
		 * @param s	: string
		 * @return bytes length
		 */
		fnGetByteLength: function(s) {
			return !s ? 0 : encodeURI(s).split(/%..|./).length - 1;
		},
		/**
		 * @return yyyyMMddHHmmss
		 */
		fnDateToFormat: function(d) {
			return date = {
				yyyy: d.getFullYear().toString()
				, MM: (d.getMonth() + 1) > 9 ? '' + (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
				, dd: d.getDate() > 9 ? '' + d.getDate() : '0' + d.getDate()
				, HH: d.getHours() > 9 ? '' + d.getHours() : '0' + d.getHours()
				, mm: d.getMinutes() > 9 ? '' + d.getMinutes() : '0' + d.getMinutes()
				, ss: d.getSeconds() > 9 ? '' + d.getSeconds() : '0' + d.getSeconds()
			};
		},
		fnSetDatePickerKr: function() {
			$.fn.datepicker.dates['kr'] = {
				days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
				daysShort: ["일", "월", "화", "수", "목", "금", "토"],
				daysMin: ["일", "월", "화", "수", "목", "금", "토"],
				months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
				monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
				today: "오늘",
				clear: "삭제",
				format: "yyyy-mm-dd",
				//titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
				weekStart: 0
			};
		},
		/**
		 * @param cd	: current date(typeof Date())
		 * @param t		: type('year', 'month', 'day')
		 * @param d		: difference
		 * @returns yyyy-MM-dd
		 */
		fnGetYyyyMmDd: function(cd, t, n) {
			var returnDate = new Date();
			if(arguments.length == 1) {
			} else {
				if(arguments.length == 2) n = 0;
				switch(t)
				{
				case 'year':
					returnDate.setFullYear(cd.getFullYear() + n);
					break;
				case 'month':
					returnDate.setFullYear(cd.getFullYear(), cd.getMonth() + n);
					break;
				case 'day':
					returnDate.setFullYear(cd.getFullYear(), cd.getMonth() + n);
					break;
				}
			}
			return returnDate.toISOString().slice(0,10);
		},
		/**
		 * @param url	: url
		 * @param trg	: target
		 * @param s		: scrollbars(yes,no)
		 * @param t		: top
		 * @param h		: height
		 * @param l		: left
		 * @param w		: width
		 * @returns window
		 */
		fnWinOpen: function(url, trg, s, t, h, l, w) {
			return window.open(
				url
				, trg
				, 'toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no,copyhistory=no'
					+ ',scrollbars=' + s
					+ ',top=' + t
					+ ',height=' + h
					+ ',left=' + l
					+ ',width=' + w
			).focus();
		},
		/**
		 * @param t	: type(get, post)
		 * @param u	: url
		 * @param a	: async(ture, false)
		 * @param c	: content-type(application/x-www-form-urlencoded;charset=UTF-8)
		 * @param p	: params
		 * @returns reponseText
		 */
		sendXMLHttpRequest: function(t, u, a, c, p) {
			
			var rt;
			var params = '';
			$.each(p, function(k, v) {
				params += '&' + k + '=' + v
			});
			if(!params) params = params.substring(1);
			
			var xhttp = new XMLHttpRequest();
			
			xhttp.open(t, u, a);
			xhttp.setRequestHeader('Content-Type', c);
			$.fnLog((arguments.callee.name || ''), params);
			xhttp.send(params);
			
			if(xhttp.readyState == 4 && xhttp.status == 200) {
				$.fnLog((arguments.callee.name || ''), 'xhttp.readyState: ' + xhttp.readyState);
				$.fnLog((arguments.callee.name || ''), 'xhttp.status: ' + xhttp.status);
				$.fnLog((arguments.callee.name || ''), 'xhttp.responseText: ' + $.trim(xhttp.responseText));
				rt = xhttp.responseText;
			} else {
				rt = '{}';
			}
			return $.trim(rt);
		},
		/**
		 * @param	fn: function name
		 * @param	t: text
		 */
		fnLog: function(fn, t) {
			if(_LOG) console.log('[' + fn + '] ' + t);
		}
	});
	$.fn.extend({
		/**
		 * @param e	: event
		 */
		goAnchor: function(e) {
			e.preventDefault();
			$('html,body').animate({scrollTop:($(this).attr('href') == '#' ? 0 : $($(this).attr('href')).offset().top)}, 500);
		},
		/**
		 * form serialize Array to JSON Object
		 * @return	json
		 */
		formToJson: function() {
			var json = new Object();
			$.each($(this).serializeArray(), function(i, f) {json[f.name] = f.value || '';});
			return json;
		},
		/**
		 * @param t	: type
		 * @param u	: url
		 * @param c	: callback function
		 */
		frmAjaxSubmit: function(t, u, c) {
			return $.ajax({
				cache: false
				, type: t
				, url: u
				, success: function(d) {
					c(d);
				}
			});
		},
		/**
		 * @param a	: action
		 * @param t	: target
		 */
		frmSubmit: function(a, t) {
			if(arguments.length < 2) {
				$(this).attr('action', a);
				$(this).submit();
				$(this).attr('action', '');
			} else {
				$(this).attr('target', t);
				$(this).attr('action', a);
				$(this).submit();
				$(this).attr('action', '');
				$(this).attr('target', '');
			}
		}
	});
})($);

