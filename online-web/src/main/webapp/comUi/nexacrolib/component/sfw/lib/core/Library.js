/**
 * 내부 라이브러리를 관리 하는 코어 라이브러리
 * @class
 * @name CoreLibrary
 */
class CoreLibrary {

   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    */
	constructor (lib) {
		
		//- library matching
		this.lib  = lib;
		this.form = lib;
		
		//- library를 초기화
		this._init();
	}

    /**
     * CoreLibrary를 초기화 하는 함수
	 * 
     * @private
     * @method
	 * @name _init
     */
	_init() {
		
		//- validator를 초기화 한다.
		this._initValidator();
		
		this.alertURL   = 'common::comConfirm.xfdl';
		this.confirmURL = 'common::comConfirm.xfdl';
		this.promptURL  = 'common::comConfirm.xfdl';
	}

    /**
     * default value 값을 처리 하는 함수
     * @public
     * @method
     * @param {object} obj 기본 대상이 될 객체
     * @param {object} def default 대상이 될 기준 값
     * @param {array} ignore ignore 대상이 될 속성 배열
     * @name getDefault
     */
	mixon(obj, def, ignore) {
      
		//- library matching
		var lib = this.lib;
		
		obj    = obj || {};
		ignore = ignore || [];
		
		for(var e in def) {
			
			//- Ignore Value
			if(ignore.indexOf(e) > -1) continue;
			if(ignore.indexOf(def[e]) > -1) continue;
			
			if(!lib.sfw_isEmpty(def[e]) && typeof def[e] == 'object') {
				
				if(lib.sfw_isEmpty(obj[e])) {
					
					if(def[e] instanceof Array) {
						
						obj[e] = this.mixon([] , def[e]);
					} else {
						
						obj[e] = this.mixon({} , def[e]);
					}
				} else {
					
					obj[e] = this.mixon(obj[e], def[e]);
				}
			} else {
				
				if(lib.sfw_isEmpty(obj[e])) {
					
					obj[e] = def[e];
				}
			}
		}
      
		return obj;
	}
    
    /**
     * 오픈 라이브러리를 반환한다 
     * @public
     * @method
     * @name getOpenLibrary
     * @return {Object} open library
     */
    getOpenLibrary(){
		
		return this.lib;
    }
	
    /**
     * 오픈 라이브러리를 반환한다 
     * @public
     * @method
     * @name getOpenLibrary
     * @return {Object} open library
     */
    setOpenLibrary(lib){
		
		this.lib  = lib;
		this.form = lib;
    }
    
    /**
     * 기본 URL을 가져온다.
     * @public
     * @method
     * @name getOpenLibrary
     * @return {Object} open library
     */
	getBaseUrl() {
		//- nexacro.getApplication().HTTPURL 에서 project의 baseUrl로 변경
		return this.baseUrl||project.getProperty('baseUrl');
	}
	
    /**
     * 기본 URL을 지정한다.
     * @public
     * @method
     * @name getOpenLibrary
     * @return {Object} open library
     */
	setBaseUrl(baseUrl) {
		
		this.baseUrl = baseUrl;
	}
    
    /**
     * Message 팝업을 반환하는 함수를 생성
     * @public
     * @method
     * @name getMessage
     * @return {Function} Message Function
     */
	getMessagePopup() {
		
		return this.form.gfn_Message.bind(this.form);
	}
	
    /**
     * 프록시 함수를 생성하여 함수의 생성에 관여하여 
     * 인자다형성(Argument Resolver, Overload)을 처리
     * 
     * @param {object} obj 덮어 씌울 객체
     * @return {object} 다형성이 적용 된 객체
     * @example 
     *   var oo = newObject();
     *   oo.test = function(arg1) { trace('only 1 arguments'); }
     *   oo.test = function(arg1, arg2) { trace('2 arguments'); }
     *   oo.test('arg1');
     *   oo.test('arg1', 'arg2');
     */
    newObject(obj) {
		
		var CONST_CORO_VERSION = '1.0.0-BETA';
		var CONST_CORO_AUTHER  = '';
		var CONST_CORO_ATTR    = '[FUNCTIONS]';
		
		if(!obj) {
			
			obj = { 
				version : CONST_CORO_VERSION, 
				auther  : CONST_CORO_AUTHER 
			};
		}
		
		var oObj = new Proxy ( obj , {
			
			set : function(t, k, v, r) {
				
				if(typeof v === 'function') {
					
					if( !t [ CONST_CORO_ATTR ] ) {
						
						t [ CONST_CORO_ATTR ] = { };
					}
					
					if(!t[k]) {
						
						var tf = function () { };
						
						tf.key = k;
						
						t[k] = new Proxy ( tf, {
							
							apply : function(t, at, a){
								
								if(!t[a.length]) {
									
									if( t [ CONST_CORO_ATTR ] [ t.key ] ) {
										
										return t [ CONST_CORO_ATTR ] [ t.key ].apply( this, a );
									} else {
										
										throw new Error('Not-Exists Executable Function') 
									}
								}
									
								return t [ a.length ].apply( this, a );
							}
						});
					}
					
					t [ CONST_CORO_ATTR ] [ k ] = t [ k ] [ v.length ] = v;
				} else {
				
				   t [ k ] = v;
				}
			}
		});
		
		return oObj;
	}
    
	
	/**
	 * 자바스크립트의 [object] 타입을 
	 * [xml] 타입의 포맷 문자열로 변경하는 함수
	 * 
	 * @method
	 * @name convertObjectToXml
	 * @param {object} obj xml로 변환할 객체
	 * @return {string} xml 포맷을 가진 문자열
	 */
	convertObjectToXml(obj, level) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- 시작 기호 및 각 레벨을 확인 ( 레벨 초기는 0 )
		var bOpen = false;
		var _lv = level || 0;
		
		//- 변수 초기화 및 케리지 코드 할당
		var sTags   = '';
		var sGab    = '';
		var sEnter  = '\n';
		var sCarage = '    ';
		
		for(var e = 0 ; e <= _lv ; e++) {
			sGab += sCarage;
		}

		//- 진입 기호의 xml 기본 포맷(주석/xml 시작 기호)을/를 등록
		if(_lv == 0) {
			sTags = sEnter;
			//sTags += '<?xml version=\"1.0\"?>'+sEnter;
			sTags += '<xml>'+sEnter;
			bOpen = true;
		}
		
		//- 속성을 순환하면서 [xml] 엘리먼트를 생성
		var sStartTag, sEndTag, tagValue;
		
		for ( var element in obj ) {
			
			sStartTag = sGab+'<'+element+'>'+sEnter;
			sEndTag   = sGab+'</'+element+'>'+sEnter;
			
			sTags += sStartTag;
			
			tagValue = obj[element];
			
			//- 함수로 등록 될 경우 함수 실행 결과를 매핑
			if (olib.sfw_isFunction(tagValue)) {
				
				tagValue = tagValue.call(form);
			}
			
			//- 객체 타입일 경우 하위 속성값이 아닌 속성 태그로 등록
			if (olib.sfw_isObject(tagValue)) {
				
				sTags +=  this.convertObjectToXml ( tagValue, (_lv+1));
			} else {
				
				sTags += sGab + sCarage + tagValue + sEnter;
			}
			
			sTags += sEndTag;
		}
		
		//- 종료 기호의 xml 기본 포맷을 등록
		if(bOpen) {
			
			sTags += '</xml>';
		}
		
		return sTags;
		
	}
	
	
	/**
	 * 자바스크립트의 [object] 타입을 
	 * [json] 타입의 포맷 문자열로 변경하는 함수 (JSON)함수를 사용
	 * 
	 * @method
	 * @name convertObjectToJson
	 * @see JSON
	 * @param {object} obj xml로 변환할 객체
	 * @return {string} xml 포맷을 가진 문자열
	 */
	convertObjectToJson(object) {
		
		return JSON.stringify(object);
	} 
	
	
	/**
	 * 자바스크립트의 [object] 타입을 
	 * [json] 타입의 포맷 문자열로 변경하는 함수 (JSON)함수를 사용
	 * 
	 * @method
	 * @name convertObjectToNexacro
	 * @see JSON
	 * @param {object} obj xml로 변환할 객체
	 * @return {string} xml 포맷을 가진 문자열
	 */
	convertObjectToNexacro(obj, upperAttribute) {
		
		//- library matching
		var olib  = this.lib;
		var form  = this.form;
		
		//- 변수 초기화 및 선언 할당
		var sReturnValue = '';
		
		//- 하위 속성값을 대입하기 위하여 상위 속성값을 붙여 처리한다.
		//- 
		//- { 
		//-     A : {
		//-         B : {
		//-             C : '1',
		//-             D : '2',
		//-         }
		//-     }
		//- }
		//- 
		//- A.B.C = A_B_C and A.B.D = A_B_D로 매핑 되어
		//- 결과 값은 "A_B_C=1 A_B_D=2"로 등록 된다.
		//- 
		if(olib.sfw_isEmpty(upperAttribute)) {
			
			upperAttribute = '';
		} else {
			
			upperAttribute = upperAttribute.concat('_');
		}
			
		var oValue = null;
		
		for (var att in obj) {
			
			oValue = obj[att];
			
			if ( olib.sfw_isFunction(oValue) ) {
				
				sReturnValue += ' '.concat(upperAttribute)
										.concat(att)
										.concat('=')
										.concat(nexacro.wrapQuote(oValue.call(form)||''));
			} else if ( olib.sfw_isObject(oValue) ) {
				
				sReturnValue += this.convertObjectToNexacro( oValue, upperAttribute.concat(att));
			} else {
				
				sReturnValue += ' '.concat(upperAttribute)
							.concat(att)
							.concat('=')
							.concat(nexacro.wrapQuote(oValue||''));
			}
		}
		
		return sReturnValue;
	}
	
	/**
	 * 넥사크로의 [Dataset]의 [Row] 타입을 
	 * 자바스크립트의 [Object] 타입의 포맷 문자열로 변경하는 함수
	 * 
	 * @todo 
	 * @method
	 * @name convertRowToObject
	 * @param {object} dataset nexacro platform의 dataset object
	 * @param {number} row nexacro platform의 dataset row index
	 * @return {objegct} object 포맷을 가진 객체
	 */
	convertRowToObject(dataset, row) {
		//- @TODO
	}
	
	/**
	 * 자바스크립트의 [Object] 타입을 XML[xml] 타입으로 변경하는 함수
	 * 
	 * @method
	 * @name convertObjectToPureXML
	 * @param {object} dataset nexacro platform의 dataset object
	 * @return {string} XML 포맷을 가진 문자열
	 */
	convertObjectToPureXML(obj, tagName) {
		
		var str = '';
		var element;
		var attributes = [];
		var subElements = [];
		
		if(obj == null) {
			trace(this.getMessage('error002'));
			return '';
		}
		
		for(var e in obj) {
			
			element = obj[e];
			
			//- [null]값은 처리하지 않는다
			if(element == null) continue;
			
			//- 객체 타입의 경우 
			if(typeof element == 'object') {
				
				//- 배열 타입일 경우 반복문을 사용하여 xml을 반복 처리한다.
				if(element instanceof Array) {
					var _listXML = '';
					
					if(element.length == 0) {
					
						_listXML += '<'+e+'/>';
					} else {
						
						for(var e2 in element) {
							
							if(typeof element[e2] == 'object') 
							{
								_listXML += this.convertObjectToPureXML(element[e2], e);
							}
							else
							{
								_listXML += '<'+e+'>';
								_listXML += element[e2];
								_listXML += '</'+e+'>';
							}
						}
					}
					
					subElements.push(_listXML);
					
				} else {
					
					subElements.push(this.convertObjectToPureXML(element, e));
				}
				
			} else {
				
				attributes.push(e+'="'+element+'"');
			}
		}
		
		if(tagName) {
			
			str += '<'+tagName;
				
			if(attributes.length > 0) {
				
				str += ' '+attributes.join(' ');
			}
			
			if(subElements.length > 0) {
				
				str += '>';
				str += subElements.join(' ');
				str += '</'+tagName+'>';
			} else {
				
				str += '/>';
			}
		} else {
			
			str += subElements.join(' ');
		}
		trace('str > '+str);
		return str;
	}
	
	/**
	 * 자바스크립트의 [Object] 타입을 문자열[String] 타입으로 변경하는 함수
	 * 
	 * @method
	 * @name convertObjectToString
	 * @param {object} dataset nexacro platform의 dataset object
	 * @return {string} 문자열 포맷을 가진 객체
	 */
	convertObjectToString(obj) {

		//- 배열 데이터인지 확인
		var isArray = ( obj instanceof Array )
		
		//- concatting string arrays start
		var strObject = isArray ? '[' : '{';
		
		var ncnt = 0;
		for(var e in obj) {
			
			//- 배열일 경우 [e, e, e, e ] 나열식으로 처리
			if(isArray) {
				
				strObject += ''.concat( ( obj[e] instanceof Object ) ? this.convertObjectToString(obj[e]) 
															         : typeof obj[e] == 'string' ? "'"+obj[e]+"'" : obj[e] )
							   .concat(',');
			} else {
				
				strObject += ''.concat(e)
							   .concat(':')
							   .concat( ( obj[e] instanceof Object ) ? this.convertObjectToString(obj[e]) 
																	 : typeof obj[e] == 'string' ? "'"+obj[e]+"'" : obj[e] )
							   .concat(',');
			}
		}
		
		//- 마지막 구분자는 제거 한다.
		strObject = strObject.substr(0, strObject.length ? strObject.length : strObject.length - 1);
		
		//- concatting string arrays end
		strObject += isArray ? ']' : '}';
		
		return strObject;
	}
	
	
	/**
	 * 사용 가능한 validator를 초기화 하여 실행하기 위한 준비한다.
	 * 
	 * @method
	 * @private
	 * @name _initValidator
	 */
	_initValidator() {
		
		//- library matching
		var olib  = this.lib;
		var form  = this.form;
		var obj = this;
		
		var validateCallback = '__validateBackgroundCallback__';
		
		var _message = function(handler) {
			
			return function() {
				
				var _systemMessage = obj.getMessagePopup();
				
				//- 인자로 넘어온 데이터를 복사
				var Larguments = [];
				
				for (var e = 0 ; e < arguments.length ; e++) {
					
					Larguments.push(arguments[e]);
				}
				
				//- handler가 있을 경우 핸들러 처리
				if(!form.sfw_isEmpty(handler)) {
					
					form[validateCallback] = handler;
					
					Larguments.push(validateCallback);
				} 
				
				//- 메시지 호출
				_systemMessage.apply(form, Larguments);
			};
		}
		
		this.validators = {};
		
		//- add validate message table
		this._validateMessageTable = {
			"default"  : "TMM125",
			"required" : "TMM008",
			"fromto"   : "TMM028",
			"noupdate" : "TMM003",
			"existChangedData" : "TMM006",
		};
		
		var fn_multilanguage = function(message) {
			
			return message;
		}
		
		//- add validate message template
		this._messageTemplate = function(code, messages, defaultValue) {
			
			switch(code) {
				
				//- date template
				case 'TPMDA01Z' : return fn_multilanguage('입력 값을 확인하세요');
				case 'TPMDA02Z' : return fn_multilanguage((messages[0]||'') +'은(는) 날짜 입력 항목입니다.');
				case 'TPMDA03Z' : return fn_multilanguage('올바른 날짜(시간)를 입력하세요');
				
				//- from to template
				case 'TPMFT01Z' : return fn_multilanguage('두 날짜의 포멧이 동일하지 않습니다.');
				case 'TPMFT02Z' : return fn_multilanguage((messages[0]||'')+' (이/가) '+(messages[1]||'')+' 보다 큽니다.');
				
				//- from range template
				case 'TPMRN01Z' : return fn_multilanguage('올바른 범위 값을 입력하세요.');
				
				//- not equals template
				case 'TPMVC01Z' : return fn_multilanguage((messages[0]||'')+"과 "+(messages[1]||'')+"은 같은 값이 아닙니다.");
				
				//- equals template
				case 'TPMEQ01Z' : return fn_multilanguage((messages[0]||'')+"과 "+(messages[1]||'')+"은 같은 값입니다.");
				
				//- global template
				case 'TPMGA01Z' : return fn_multilanguage([messages[0] || '']);
				case 'TPMGA02Z' : return fn_multilanguage([messages[1] || '']);
				case 'TPMGA03Z' : return fn_multilanguage([messages[2] || '']);
				case 'TPMGA04Z' : return fn_multilanguage([messages[3] || '']);
				case 'TPMGA05Z' : return fn_multilanguage([messages[4] || '']);
				case 'TPMGA06Z' : return fn_multilanguage([messages[5] || '']);
				case 'TPMGA07Z' : return fn_multilanguage([messages[6] || '']);
				case 'TPMGA08Z' : return fn_multilanguage([messages[7] || '']);
				case 'TPMGA09Z' : return fn_multilanguage([messages[8] || '']);
				case 'TPMGA10Z' : return fn_multilanguage([messages[9] || '']);
				case 'TPMGA99Z' : return fn_multilanguage([defaultValue|| '']);
				
			}
			
			return messages;
		}
		
		//- required valudation check
		function _required ( value, code, handler, messages) {
			
			var pValue = nexacro.trim(value[0]);
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
			
				code = this._validateMessageTable['required'];
				
				messageTemplate = this._messageTemplate;
			}
			
			//- 빈값에 관한 검증을 실시한다
			if ( olib.sfw_isEmpty(pValue) ) {
				
				_message(handler)(code, messageTemplate(null, messages));
				
				return false;
			}
			
			return true;
		}
		
		//- date validation check
		function _date ( value, code, handler, messages) {
			
			var value = nexacro.trim(value[0]);
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- clear special meta [-,/]
			//- [ 2016-01-12 12:01:11.123 ] to [ 20160112120111123 ]
			value = value.replace(/[\-|\/|\.|\s|\:]/g, '');
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			//- set default value [array]
			if ( olib.sfw_isEmpty(messages) ) {
				
				messages = [];
			}
			
			//- not degiet type invalid 
			if ( !olib.sfw_isNull(value.match(/\D/g)) ) {
				
				_message(handler)(code, messageTemplate('TPMDA01Z', messages));
				
				return false;
			}
			
			//- if value is empty, return invalid
			if (olib.sfw_isEmpty(value)) {
				
				_message(handler)(code, messageTemplate('TPMDA02Z', messages));
				
				return false;
			}
			
			var _yyyy = value.substr(0, 4);
			var _mm   = value.substr(4, 2);
			var _dd   = value.substr(6, 2);
			var _hh   = value.substr(8, 2);
			var _mi   = value.substr(10,2);
			var _ss   = value.substr(12,2);
			var _sss  = value.substr(14,3);
			
			//- 년도 검증
			//- 숫자 외의 값이 입력 되면 NaN(Not A Number)이 반환 되므로 해당 처리
			if ( _yyyy.length != 4 || _yyyy <= 0 || _yyyy > 9999 ) {
				
				_message(handler)(code, messageTemplate('TPMDA03Z', messages));
				
				return false;
			}
			
			
			//- 월 검증 월은 1~12월까지 검증 한다.
			if(!olib.sfw_isEmpty(_mm)) {
				
				//- 일자 입력 사항일 경우 월(1~13)월 까지의 데이터를 검증한다.
				if ( _mm.length != 2 || _mm >= 13 || _mm <= 0 ) {
					
					_message(handler)(code, messageTemplate('TPMDA03Z', messages));
					
					return false;
				}
			}
			
			var _date = nexacro.toNumber(value.substr(0, 8));
			
			if(!olib.sfw_isEmpty(_dd)) {
				
				//- 날짜 타입이 아닐 경우 검증
				if (!olib.sfw_isStringDate(_date)) {
					
					_message(handler)(code, messageTemplate('TPMDA03Z', messages));
					
					return false;
				}
			}
			
			//- 시간 검증
			if(!olib.sfw_isEmpty(_hh)) {
				
				//- 날짜 입력항목
				if ( _hh.length != 2 || _hh > 24 ) {
					
					_message(handler)(code, messageTemplate('TPMDA03Z', messages));
					
					return false;
				}
			}
			
			if(!olib.sfw_isEmpty(_mi)) {
				
				if ( _mi.length != 2 || _mi >= 60 ) {
				
					_message(handler)(code, messageTemplate('TPMDA03Z', messages));
					
					return false;
				}
			}
			
			if(!olib.sfw_isEmpty(_ss)) {
				
				if ( _ss.length != 2 || _ss >= 60 ) {
					
					_message(handler)(code, messageTemplate('TPMDA03Z', messages));
					
					return false;
				}
			}
			
			return true;
		}
		
		//- 일자의 범위를 검증한다. [ from:to ]
		function _date_from_to(value, code, handler, messages) {
			
			var org_code = code;
			
			var messageTemplate = function(code, messages, defaultValue) {
					
				return messages;
			};
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			//- [A,B,C] = > [B,C]로 변환
			//- [ 멀티 타겟팅 시 ] 사용할 목적으로 처리
			if(value.length > 2) {
				
				value[0] = value[1];
				value[1] = value[2];
			}
			
			var from = nexacro.trim(value[0]).replace(/[\-\/]/g,'');
			var to   = nexacro.trim(value[1]).replace(/[\-\/]/g,'');
			
			//- 시작 일자가 일자 포맷이 아닐 경우
			if(!_date.call(this, [from], org_code, handler, messageTemplate('TPMGA01Z', messages))) {
				
				return false;
			}
			
			//- 종료 일자가 일자 포맷이 아닐 경우
			if(!_date.call(this, [to], org_code, handler, messageTemplate('TPMGA02Z', messages))) {
				
				return false;
			}
			
			//- 시작일자와 종료 일자의 포맷이 다를 경우
			if ( ( from + '' ).length != ( to + '' ).length) {
				
				_message(handler)(code, messageTemplate('TPMFT01Z', messages));
				
				return false;
			}
			
			//- 시작일자 보다 종료일자가 작을 경우 에러 처리
			if (nexacro.toNumber(from) > nexacro.toNumber(to)) {
				
				_message(handler)(code, messageTemplate('TPMFT02Z', messages));
				
				return false;
			}
			
			return true;
		}
		
		//- 숫자의 범위값을 검증한다. [ value:from~to ]
		function _range(value, code, handler, messages) {
			
			var messageTemplate = function(code, messages, defaultValue) {
					
				return messages;
			};
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( ( value[0] + '' ));
			var checkFrom  = nexacro.trim( ( value[1]||value[0] + '' ));
			var checkTo    = nexacro.trim( ( value[2]||value[0] + '' ));
			
			//- 입력 된 값이 없을 경우 에러 처리
			if (olib.sfw_isEmpty(checkValue)) {
				
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				return false;
			}
			
			checkValue = nexacro.toNumber(checkValue);
			checkFrom  = nexacro.toNumber(checkFrom);
			checkTo    = nexacro.toNumber(checkTo);
			
			//- 입력 된 값이 숫자 타입이 아닌 경우 에러 처리
			if ( !olib.sfw_isNumber(checkValue) || !olib.sfw_isNumber(checkFrom) || !olib.sfw_isNumber(checkTo) ) {
				
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				return false;
			}
			
			//- 범위 값이 아닌 경우 에러 처리
			if ( ( checkFrom > checkValue ) || ( checkValue > checkTo ) ) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
						, '('+checkValue+')은 '+checkFrom+'와 '+checkTo+'사이의 범위 값이 아닙니다.'));
				
				return false;
			}
			
			return true;
		}
		
		//- 최대값을 검증한다. [ value:max ]
		function _max(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( value[0]    + '' );
			var checkMax   = nexacro.trim( value[1]||-1 + '' );
			
			if(olib.sfw_isEmpty(checkValue)) {
				
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				
				return false;
			}
			
			checkValue = nexacro.toNumber(checkValue);
			checkMax   = nexacro.toNumber(checkMax);
			
			if ( checkValue > checkMax ) {
				_message(handler)(code, messageTemplate('TPMGA99Z', null
					, (messages[0]||'')+"(이/가) ("+checkMax+") 을 초과 하여 입력할수 없습니다."));
				
				return false;
			}
			
			return true;
		}
		
		//- 초과값을 검증한다. [ value:over ]
		function _over(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( value[0]    + '' );
			var checkMax   = nexacro.trim( value[1]||-1 + '' );
			
			if(olib.sfw_isEmpty(checkValue)) {
				
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				
				return false;
			}
			
			checkValue = nexacro.toNumber(checkValue);
			checkMax   = nexacro.toNumber(checkMax);
			
			if ( checkValue >= checkMax ) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"을 ("+checkMax+") 이상으로 입력할수 없습니다."));
				return false;
			}
			
			return true;
		}
		
		//- 최소값을 검증한다. [ value:min ]
		function _min(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( value[0]    + '' );
			var checkMin   = nexacro.trim( value[1]||Number.MAX_SAFE_INTEGER + '' );
			
			if(olib.sfw_isEmpty(checkValue)) {
			
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				return false;
			}
			
			checkValue = nexacro.toNumber(checkValue);
			checkMin   = nexacro.toNumber(checkMin);
			
			if ( checkValue < checkMin ) {
			
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"(이/가) ("+checkMin+") 미만으로 입력할수 없습니다."));
				
				return false;
			}
			return true;
		}
		
		//- 미만값을 검증한다. [ value:under ]
		function _under(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( value[0]    + '' );
			var checkMin   = nexacro.trim( value[1]||Number.MAX_SAFE_INTEGER + '' );
			
			if(olib.sfw_isEmpty(checkValue)) {
			
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				
				return false;
			}
			
			checkValue = nexacro.toNumber(checkValue);
			checkMin   = nexacro.toNumber(checkMin);
			
			if ( checkValue <= checkMin ) {
			
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"을 ("+checkMin+") 이하로 입력할수 없습니다."));
					
				return false;
			}
			return true;
		}
		
		//- 동등값을 검증한다. [ value:equal ]
		function _equal(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( value[0]     + '' );
			var checkEqual = nexacro.trim( value[1]||'' + '' );
			
			if(olib.sfw_isEmpty(checkValue)) {
				
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				return false;
			}
			
			if ( checkValue != checkEqual ) {
			
				_message(handler)(code, messageTemplate('TPMVC01Z', messages));
				
				return false;
			}
			
			return true;
		}
		
		
		//- 비동등값을 검증한다. [ value:not_equal ]
		function _not_equal(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue = nexacro.trim( value[0]     + '' );
			var checkEqual = nexacro.trim( value[1]||'' + '' );
			
			if(olib.sfw_isEmpty(checkValue)) {
			
				_message(handler)(code, messageTemplate('TPMRN01Z', messages));
				
				return false;
			}
			
			if ( checkValue == checkEqual ) {
			
				_message(handler)(code, messageTemplate('TPMEQ01Z', messages));
				
				return false;
			}
			
			return true;
		}
		
		//- 최대 자리수 검증 [ value:maxLength ]
		function _maxLength(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue     = nexacro.trim( value[0]     + '' );
			var checkMaxLength = nexacro.trim( value[1]||-1 + '' );
			
			var checkLength    = checkValue.length;
			checkMaxLength     = nexacro.toNumber(checkMaxLength);
			
			if ( checkLength > checkMaxLength ) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"은(는) 최대 ("+checkMaxLength+")자리 입니다."));
				
				return false;
			}
			
			return true;
		}
		
		//- 최소 자리수 검증 [ value:minLength ]
		function _minLength(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue     = nexacro.trim( value[0]                          + '' );
			var checkMinLength = nexacro.trim( value[1]||Number.MAX_SAFE_INTEGER + '' );
			
			var checkLength    = checkValue.length;
			checkMinLength     = nexacro.toNumber(checkMinLength);
			
			if ( checkLength < checkMinLength ) {
			
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"은(는) 최소 ("+checkMinLength+")자리 입니다."));
					
				return false;
			}
			
			return true;
		}
		
		//- 최대 바이트 검증 [ value:maxByte ]
		function _maxByte(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue   = nexacro.trim( value[0]    + '' );
			var checkMaxByte = nexacro.trim( value[1]||-1 + '' );
			
			var checkLength  = _getByte(checkValue);
			checkMaxByte     = nexacro.toNumber(checkMaxByte);
			
			if ( checkLength > checkMaxByte ) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"은(는) 최대 ("+checkMaxByte+")Byte 입니다."));
					
				return false;
			}
			
			return true;
		}
		
		//- 최소 바이트 검증 [ value:minByte ]
		function _minByte(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue   = nexacro.trim( value[0]                          + '' );
			var checkMinByte = nexacro.trim( value[1]||Number.MAX_SAFE_INTEGER + '' );
			
			var checkLength  = _getByte(checkValue);
			checkMinByte     = nexacro.toNumber(checkMinByte);
			
			if ( checkLength < checkMinByte ) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"은(는) 최소 ("+checkMinByte+")Byte 입니다."));
					
				return false;
			}
			
			return true;
		}
		
		
		//- Byte를 세는 함수
		//- 포스트그래와 같은 특이성 바이트의 경우는 검증 하지 않는다.
		//- 한글 (2)바이트 그 외 (1)바이트로 검증 한다.
		function _getByte(str) {
			
			var cnt = 0;
			
			for (var i=0; i < str.length; i++) {
				
				if (str.charCodeAt(i) > 127) {
				
					cnt += 2;
				} else {
				
					cnt++;
				}
			}
			
			return cnt;
		}
		
		//- 도메인 검증 [ value:domain ]
		function _domain(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue   = nexacro.trim( value[0] + '' );
			
			//- 검증할 도메인이 없을 경우 참 반환
			if ( value.length == 1 ) {
				
				return true;
			} else {
				
				for ( var e = 1 ; e < value.length ; e++ ) {
					
					var sDomain = value[e];
					
					if ( checkValue == sDomain ) {
					
						return true;
					}
				}
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, (messages[0]||'')+"은(는) 올바르지 않은 도메인 값입니다."));
				
				return false;
			}
		}
		
		
		//- 이메일 검증 [ value:email ]
		function _email(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue   = nexacro.trim( value[0] + '' );
			
			var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

			var _checkedValue = checkValue.match(regExp);
			
			//- 검증할 값이 없을 경우 즉시 반환
			if(!checkValue) {
				
				return true;
			}
			
			//- 이메일 검증
			if(!_checkedValue) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, "이메일 형식을 확인하세요."));
				
				return false;
			}
			
			return true;
		}
		
		
		//- 사업자등록번호 검증 [ value:bizno ]
		function _bizno(value, code, handler, messages) {
			
			var messageTemplate = function(code, message, defaultValue) { return message; };
			
			//- default code and init message
			if ( olib.sfw_isEmpty(code) ) {
				
				code = this._validateMessageTable['default'];
				
				messageTemplate = this._messageTemplate;
			}
			
			var checkValue   = nexacro.trim( value[0] + '' );
			
			var _checkNumSize = /\d/g;
			var LcheckList = checkValue.match(_checkNumSize);
			
			//- 검증할 값이 없을 경우 즉시 반환
			if(!LcheckList) {
				
				return true;
			}
			
			//- check length biz number
			if(LcheckList.length != 10) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, "사업자 등록번호 자리수를 확인하세요"));
				return false;
			}
			
			
			var nLastSum = 0;
			var nCheckSum = [1,3,7,1,3,7,1,3,5];
			var nValue = -1;
			var e = 0;
			for(; e < LcheckList.length-1 ; e++) {
				nValue = nexacro.toNumber(LcheckList[e]);
				
				nLastSum += nValue * nCheckSum[e];
			}
			
			nLastSum = nLastSum + nexacro.floor(nCheckSum[e-1] * LcheckList[e-1] / 10);
			nLastSum = nLastSum % 10;
			nLastSum = 10 - nLastSum;
			
			if(nLastSum != LcheckList[e]) {
				
				_message(handler)(code, messageTemplate('TPMGA99Z', messages
					, "올바르지 않은 사업자 등록 번호입니다."));
				
				return false;
			}
			
			return true;
		}
		
		
		//- 검증기를 등록한다.
		this.addValidator(['rq', 'required']  , _required     );
		this.addValidator(['dt', 'date']      , _date         );
		this.addValidator(['fromto']          , _date_from_to );
		this.addValidator(['range']           , _range        );
		this.addValidator(['le', 'max']       , _max          );
		this.addValidator(['ge', 'min']       , _min          );
		this.addValidator(['lt', 'over']      , _over         );
		this.addValidator(['gt', 'under']     , _under        );
		this.addValidator(['eq', 'equal']     , _equal        );
		this.addValidator(['neq', 'notEqual'] , _not_equal    );
		this.addValidator(['xl','maxLength']  , _maxLength    );
		this.addValidator(['nl','minLength']  , _minLength    );
		this.addValidator(['xb', 'maxByte']   , _maxByte      );
		this.addValidator(['nb', 'minByte']   , _minByte      );
		this.addValidator(['dom', 'domain']   , _domain       );
		this.addValidator(['bn', 'bizno']     , _bizno        );
		this.addValidator(['eml', 'email']    , _email        );
		
	}
	
	/**
	 * 메시지 테이블을 반환한다.
	 * 
	 * @method
	 * @name getMessageTable
	 * @return {object} message table object
	 */
	getMessageTable() {
		
		return this._validateMessageTable;
	}
	
	/**
	 * validator를 등록한다.
	 * 
	 * @public
	 * @method
	 * @name addValidator
	 * @param {string} item 벨리데이터와 매핑할 매핑 아이텡
	 * @param {function} validator 처리할 벨리데이터
	 */
	addValidator(item, validator) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- 배열 값이 아닐 경우 배열로 변환
		if(!olib.sfw_isArray(item)) {
			
			item = [item];
		}
		
		var mappName = null;
		
		//- 매핑 명칭을 순회 하면서 벨리데이터를 등록 한다.
		for( var i in item ){
			
			mappName = item[i];
			
			//- 기존에 존재 하는 벨리데이터는 넘어 가도록 한다.
			if(!olib.sfw_isEmpty(this.validators[mappName])) {
				
				continue;
			}
			
			//- 벨리데이터를 등록한다.
			this.validators[mappName] = validator.bind(this);
		}
	}
	
	
	/**
	 * 벨리데이션 처리를 위한 함수
	 *
	 * @public
	 * @method
	 * @name validate
	 * @param {string} item 벨리데이션 처리를 위한 벨리데이터 아이템
	 * @param {*} value 벨리데이션 검증을 위한 처리 값
	 * @param {code} value 벨리데이터 처리 실패 시 오픈할 메시지 코드
	 * @param {*} message message1 ~ message4 메시지 처리를 위한 메시지 값
	 * @param {function} handler 메시지 처리 후 실행할 핸들러 함수
	 */
	validate(item, value, code, handler, messages) {
		
		var olib = this.lib;
		var form = this.form;
		
		//- 메시지 초기화
		if ( olib.sfw_isEmpty(messages)) {
			
			messages = [];
		}
		
		//- 벨리데이터 확인 후 처리
		var _validator = this.validators[item];
		
		if ( !olib.sfw_isEmpty( _validator ) ) {
			
			var pValue = [];
			var newValue = '';
			var splitValue = [];
			
			if(olib.sfw_isEmpty(value)) {
				
				value = '';
			} else{
				
				value = value+'';
			}
			
			//- 이중 요소일 경우 A=B를 [A,B]로 분리
			newValue = ( value.indexOf('=') > -1 ) ? value.split('=') : [ value ];
			
			for ( var e in newValue ) {
				
				var str = newValue[e];
				
				//- 삼중 요소일 경우 [A:B~C]를 [A,B,C]로 분리(범위값 측정)
				if (str.indexOf('~') > -1) {
					
					splitValue = str.split('~');
					
					pValue.push(splitValue[0]);
					pValue.push(splitValue[1]);
					
				} else if (str.indexOf(',') > -1) {
					
					pValue = pValue.concat(str.split(','));
					
				} else {
					
					pValue.push(str);
				}
				
			}
			
			//- 검증 실행
			if (!_validator(pValue, code, handler, messages)) {
				
				return false;
			}
		} else {
			
			return false;
		}
		
		return true;
	}
	
	/**
	 * 데이터셋에 벨리데이터를 등록하여 검증 한다.
	 * 
	 * @public
	 * @method
	 * @name validateDataset
	 * @param {object} dataset 벨리데이터를 등록할 데이터셋
	 * @param {object} valudates 벨리데이팅 처리할 타입(type), 메시지 코드(code), 메시지(message) 후처리를 위한 (handler:Array)
	 * @param {string} type 데이터셋의 벨리데이팅을 처리할 type을 지정한다. default = update only(U)
	 */
	validateDataset(dataset, validates, type) {
		
		var olib = this.lib;
		var form = this.form;
		
		//- 기본 타입은 업데이트 온리로 처리
		if(olib.sfw_isEmpty(type)) {
			
			type = 'U';
		}
		
		//- 컬럼 바인딩 처리 구분자(+)를 처리한다.
		var _findValueOnDataset = function (dataset, row, value) {
			
			//- value값 초기화
			value = value || '';
			
			//- 데이터셋의 값을 불러와 처리
			return ( value.substr(0,1) == '+' ) ? dataset.getColumn(row, value.substr ( 1, value.length ) ) : value;
		}
		
		//- handling
		var _originHandler = validates.handler || function() {  };
		
		//- 파라미터 커링을 위하여 커링함수 생성
		var _curringHandler = function(row, column, dataset) {
			
			return function() {
				
				//- 배열일 경우 전체 핸들러를 순환한다.
				if(olib.sfw_isArray(_originHandler)) {
					
					for(var e in _originHandler) {
						
						_originHandler[e].call(form, row, column, dataset);
					}
				} else {
					
					_originHandler.call(form, row, column, dataset);
				}
			}
		}
		
		var validators, validator;
		var value;
		var _type, _code, _message, _rowType;
		var _Ltype;
		var _splitValue, _subSplitValue, sKey, sVal, sParam;
		var LdomainList, _domain;
		
		//- 데이터셋의 행을 순환 하면서 검증기로 검증한다.
		for ( var row = 0 ; row < dataset.getRowCount() ; row++) {
			
			_rowType = dataset.getRowType(row);
			
			//- 전체(A)이거나 수정(U) 상태일 경우 검증기 대상이 된다.
			if(type == 'A' || ( _rowType == Dataset.ROWTYPE_INSERT || _rowType == Dataset.ROWTYPE_UPDATE || _rowType == Dataset.ROWTYPE_DELETE 
								&& type == 'U' ) ) {
							
				//- 시스템 검증기를 확인하여 처리 한다.
				for ( var col in validates) {
					
					//- handle는 검증기가 아니므로 건너 뛴다.
					if(col == 'handler') continue;
					
					validators = validates[col];
					
					value = dataset.getColumn(row, col);
					
					if(olib.sfw_isEmpty(value)) {
						value = ''
					}
					//- reform validators
					if(olib.sfw_isObject(validators)) {
						
						validators = [validators];
					}
					
					for(var e in validators) {
						
						validator = validators[e];
						
						_type    = validator.type;
						_code    = validator.code;
						_message = validator.message;
						
						//- type을 등록하지 않을 경우
						if(olib.sfw_isEmpty(_type)) {
							return false;
						}
						
						//- 타입을 ,를 사용하여 분리 한다.
						_Ltype = _type.split(',');
						
						for( var e in _Ltype ) {
							
							_splitValue = nexacro.trim(_Ltype[e]).split(':');
							
							sKey = _splitValue[0]||''; // maxByte
							sVal = _splitValue[1]||''; // 4, 4~6, +CBIN_TI_CNT
							sParam = '';
							
							//- 값이 직접적으로 등록 되지 않을 경우 
							//- 입력한 실제 값을 등록한다.
							if(sVal.length == 0) {
								
								sParam = value;
							} else {
								
								//- 타겟팅 대상을 기본 컬럼의 값으로 지정
								//- 필요시 확장 처리
								sParam += value + '=';
								
								//- 확장 가능한 기호(~) 가 있을 경우 재 분리
								if (sVal.indexOf('~') > -1) {
									
									_subSplitValue = sVal.split('~');
									
									sParam += ( _subSplitValue[0] == '' ) ? value : _findValueOnDataset(dataset, row, _subSplitValue[0]);
									
									sParam += '~';
									
									sParam += ( _subSplitValue[1] == '' ) ? value : _findValueOnDataset(dataset, row, _subSplitValue[1]);
								} else if(sVal.indexOf('\"') > -1) {
									
									//- 도메인 처리를 위하여 특수 기호(")로 처리
									LdomainList = sVal.split(/\"([^\"]*)\"/g);
									
									if (LdomainList.length > 0) {
										
										for (_doidx in LdomainList) {
											
											_domain = LdomainList[_doidx];
											
											//- 도메인 값이 없을 경우 건너 뛴다.
											if(nexacro.trim(_domain) == '') continue;
											
											sParam +=  _findValueOnDataset(dataset, row, _domain) + ',';
										}
										
										sParam = sParam.substr(0,sParam.length-1);
										
									}
									
								} else {
									
									sParam += _findValueOnDataset(dataset, row, sVal);
								}
							}
							
							var Larguments = [];
							
							//- 메시지가 배열 또는 객체로 넘어올 경우 메시지 다중 처리
							if(olib.sfw_isObject(_message) || olib.sfw_isArray(_message)) {
								
								Larguments = [sKey
											, sParam
											, _code
											, _curringHandler(row, col, dataset)
											, _message];
							} else {
								
								Larguments = [sKey
											, sParam
											, _code
											, _curringHandler(row, col, dataset)
											, [ _message ]];
											
							}
							
							//- 벨리데이터를 실행한다.
							if(!this.validate.apply(this, Larguments)) {
								
								return false;
							}
						}
					}
				}
			}
		}
		
		if(olib.sfw_isArray(_originHandler)) {
			
			for(var e in _originHandler) {
			
				_originHandler[e].call(form, -1, -1, dataset);
			}
			
		} else {
			
			_originHandler.call(form, -1, -1, dataset);
		}
		
		return true;
	}
	
	/**
	 * 등록 되는 인자의 타입을 확인하여 해당 영역에 포커스를 처리한다.
	 *
	 * @public
	 * @method
	 * @name focusOn
	 * @param {object|grid} _form 포커스가 필요한 타입의 객체(Form or Grid)
	 */
	focusOn(_form) {
		
		var olib = this.lib;
		var form = this.form;
		var that = this;
		
		//- 기본 등록 대상은 각 화면의 폼 영역으로 지정
		if(olib.sfw_isEmpty(_form)) {
			
			_form = form;
		}
		
		
		//- 상단으로 이동하면서 탭이 있을 경우 해당 탭으로 포지션을 이동한다.
		function _focusOnParentTabPage(comp) {
		
			if(comp.parent == form) {
				return null;
			} else {
				
				if(comp.parent instanceof nexacro.Tab) {
					
					for(var nTabpage = 0 ; nTabpage < comp.parent.tabpages.length ; nTabpage++) {
						
						if(comp.parent.tabpages[nTabpage] == comp) {
							
							comp.parent.set_tabindex(nTabpage);
						}
					}
				}
				
				return _focusOnParentTabPage(comp.parent);
			}
		}
		
		
		//- 그리드에 포커스를 등록 할 경우
		if(_form instanceof nexacro.Grid) {
			
			return function(iRow, sCol, objDataset) {
				
				if(iRow == -1) return;
				
				// Dataset Row Position 이동 처리
				if (objDataset) {
					
					objDataset.set_rowposition(iRow);
				}
				
				// 그리드 체크 시 컬럼명을 통해 컬럼 인덱스 알아 내기
				var iColIndex = _form.getBindCellIndex("body", sCol);
				
				if (_form.getSelectedDatasetRows() < 1) 
				{
					_form.selectRow(iRow);
				}
				
				if (iColIndex > -1) 
				{
					_form.setCellPos(iColIndex);
				}
				
				//- 해당 컴포넌트의 상위 탭의 포커스 처리
				_focusOnParentTabPage(_form);
				
				// 해당 컴포넌트로 포커스 처리
				_form.setFocus();
				_form.showEditor(true);
			}
		} else if(_form instanceof nexacro.Form || _form instanceof nexacro.Div){
			
			//- 폼 컨트롤에 등록 할 경우
			return function(iRow, sCol, objDataset) {
				
				if(iRow == -1) return;
				
				// Dataset Row Position 이동 처리
				if (olib.sfw_isObject(objDataset)) {
					
					objDataset.set_rowposition(iRow);
				}
				
				var binds = form.binds;
				
				for(var e = 0 ; e < binds.length ; e++) {
					
					//- 다른 데이터셋을 지정할 경우
					if(binds[e].datasetid != objDataset.id) {
						continue;
					}
					
					//- 다른 컬럼이 바인딩 될 경우
					if(binds[e].columnid != sCol) {
						continue;
					}
					
					var oComp = that._getComponent(binds[e].compid, _form);
					
					//- 대상 선정
					if (!oComp) continue;
					if (!oComp.enable) continue;
					if (oComp.readonly) continue;
					if (!oComp.visible) continue;
						
					//- 해당 컴포넌트의 상위 탭의 포커스 처리
					_focusOnParentTabPage(oComp);
					
					//- @TODO 폼 영역에 존재 하는 컴포넌트를 찾아 바인드 정보를 확인하여
					//-       해당 컴포넌트의 포커스를 쥐어 주도록 처리한다.
					return oComp.setFocus();
				}
			}
		} else {
			//- 그 외의 경우는 일반 컴포넌트의 포커스를 등록
			//- @TODO 항목별 라우팅은 추후 작업 예정
			return function() {
				
				//- 해당 컴포넌트의 상위 탭의 포커스 처리
				_focusOnParentTabPage(_form);
				
				return _form.setFocus();
			}
		}
	}
	
	
	/**
	 * 컴포넌트의 경로와 매칭하는지를 확인하는 함수
	 * @private
	 * @method
	 * @name _getComponent
	 * @param {string} componentFullPath 컴포넌트 경로
	 * @param {string} matchComponent 매칭할 컴포넌트 경로
	 */
	_getComponent(componentFullPath, matchComponent) {
		
		var olib = this.lib;
		var form = this.form;
		
		var sComponentPath, 
			sComponentMatchPath, 
			sSplitRollComponent;
		
		//- 매칭할 컴포넌트 경로가 비어 있을경우 매핑 컴포넌트를 직접 조회
		if(olib.sfw_isEmpty(matchComponent)) {
			
			matchComponent = componentFullPath;
		}
		
		//- 검색할 타입이 넥사크로 컴포넌트 일 경우 컴포넌트의 경로를 가져 온다.
		sComponentPath = olib.sfw_isComponent(componentFullPath) ? 
							this._getPathComponent(componentFullPath) : componentFullPath;
		
		//- 매칭할 타입이 넥사크로 컴포넌트 일 경우 컴포넌트의 경로를 가져 온다.
		sComponentMatchPath = olib.sfw_isComponent(matchComponent) ? 
								this._getPathComponent(matchComponent) : matchComponent;
		
		//- 검색 기준 경로가 검색할 대상의 경로보다 작을 경우 빈값[null]을 반환
		//- 대상 : form.Edit1
		//- 검색 기준 : form.div01.Edit1
		if(sComponentPath.length < sComponentMatchPath.length) {
			
			return null;
		}
		
		//- 검색 기준의 사이즈를 분리 하여 대상에 대입하였을 때 부합하지 않을 경우 빈값 [ null ]을 반환
		//- 대상 : form.div01.Edit1
		//- 검색 기준 : form.div02
		//- 사이즈 분리 : form.div01 <> form.div02
		if(sComponentPath.substring(0, sComponentMatchPath.length) != sComponentMatchPath) {
			
			return null;
		}
		
		//- 컴포넌트를 조회 하기 위하여 경로를 분리 한다.
		var pathPip   = sComponentPath.split('.');
		var component = form;
		
		//- 컴포넌트 경로를 순회 하면서 컴포넌트를 조회한다.
		for(var pip in pathPip) {
			
			var sPath = pathPip[pip];
			
			component = component[sPath];
			
			if(!component) {
				
				return null;
			}
			
			sSplitRollComponent = this._getPathComponent(component);
			
			//- this < this.divContainer.form
			if(sSplitRollComponent.length <= sComponentMatchPath.length) {
				
				if(olib.sfw_isEmpty(sComponentMatchPath)) {
					continue;
				}
				
				if(!this._matchPath(sSplitRollComponent, sComponentMatchPath, '.')) {
					
					return null;
				}
			} else {
				
				if(olib.sfw_isEmpty(sComponentMatchPath)) {
					continue;
				}
				
				if(!this._matchPath(sComponentMatchPath, sSplitRollComponent, '.')) {
					
					return null;
				}
			}
		}
		
		return component;
	}
	
	/**
	 * 컴포넌트의 경로를 반환한다.
	 * 
	 * @private
	 * @method
	 * @name _getPathComponent
	 */
	_getPathComponent(component) {
		
		var olib = this.lib;
		var form = this.form;
		
		if(form == component) {
			
			return '';
		} else {
			
			var _pid = this._getPathComponent(component.parent);
			
			if ( _pid == '' ) {
				
				return component.id;
			} else {
				
				return _pid + '.' + component.id;
			}
		}
	}
	
	/**
	 * 문자열로 입력 된 경로를 매칭하는 함수
	 * 
	 * @private
	 * @method
	 * @name _matchPath
	 * @param {string} obj 매칭할 경로
	 * @param {string} sub 확인할 경로
	 * @param {string} splt 분리할 경로
	 * @return {boolean} 매칭 여부 {true|false}
	 */
	_matchPath(obj, sub, splt) {
		
		var Lobj = obj.split(splt);
		var Lsub = sub.split(splt);
		
		for(var e in Lobj) {
			
			if(Lobj[e] != Lsub[e]) {
				
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * drilldown을 처리하는 함수
	 * 
	 * @public
	 * @method
	 * @name _matchPath
	 * @param {string} obj 매칭할 경로
	 * @param {string} sub 확인할 경로
	 * @param {string} splt 분리할 경로
	 * @return {boolean} 매칭 여부 {true|false}
	 */
	_toggling(component, toggle_size, toggle_button) {
	
		var olib    = this.lib;
		var form    = this.form;
		var obj     = component;
		var size    = toggle_size||5;
		var target  = toggle_button.toggle_target;
		var view    = toggle_button.toggle_view;
		var type    = toggle_button.toggle_type;
		var animate = toggle_button.__init__ ? toggle_button.toggle_animate : false;
			
		
		var comps = obj.parent.components;
		
		//- 폴딩 시 기준 경로를 확인한다.
		var iOffTop    = obj.getOffsetTop();
		var iOffBottom = obj.getOffsetBottom();
		var iOffLeft   = obj.getOffsetLeft();
		var iOffRight  = obj.getOffsetRight();
		
		if(animate){
			
			//- 에니메이션 처리가 가능할 경우 에니메이션 속성을 변환하여 처리한다.
			if(olib.sfw_isObject(animate)) {
				
				animate.oncomplete = function() {
					
					form.__animation__ = false;
				}
				
				animate.onstart = function() {
					
					form.__animation__ = true;
				}
			} else {
				
				animate = {
					
					oncomplete : function() {
						
						form.__animation__ = false;
					},
					onstart : function() {
						
						form.__animation__ = true;
					}
				}
			}
		}
		
		//- 하위 컴포넌트를 순회한다.
		for(var idx = 0 ; idx < comps.length ; idx++) {
			
			var comp = comps[idx];
			
			if(comp instanceof nexacro.Component) {
				
				//- allocate position layout
				var nLeft   = comp.left   == null ? null : nexacro.toNumber(comp.left);
				var nTop    = comp.top    == null ? null : nexacro.toNumber(comp.top);
				var nWidth  = comp.width  == null ? null : nexacro.toNumber(comp.width);
				var nHeight = comp.height == null ? null : nexacro.toNumber(comp.height);
				var nRight  = comp.right  == null ? null : nexacro.toNumber(comp.right);
				var nBottom = comp.bottom == null ? null : nexacro.toNumber(comp.bottom);
				
				//- close down process when include percent metatag
				if( olib.sfw_isPercent(comp.top) || olib.sfw_isPercent(comp.bottom) || olib.sfw_isPercent(comp.height) 
				|| olib.sfw_isPercent(comp.left) || olib.sfw_isPercent(comp.right)  || olib.sfw_isPercent(comp.width) ) { continue; }
				
				//- get component offsets
				var ivLeft   = comp.getOffsetLeft();
				var ivRight  = comp.getOffsetRight();
				var ivTop    = comp.getOffsetTop();
				var ivBottom = comp.getOffsetBottom();
				
				//- for target the Division component
				if(comp == component) {
					
					//- [type]에 따라 사이즈 분리
					//- slide = 상하 사이즈
					//- drilldown = 좌우 사이즈
					if('slide' === type) {
						
						//- [right]이 있을 경우 [right]을 대상으로 folding
						if(comp.right) {
							
							nRight += size;
						} else {
						
							nWidth -= size;
						}
						
					} else if ('drilldown'){
						
						//- [bottom]이 있을 경우 [bottom]을 대상으로 folding
						if(comp.bottom) {
							
							nBottom += size;
						} else {
						
							nHeight -= size;
						}
					}
				} else {
					//- 그 외의 컴포넌트를 대상으로 사이징 처리
					
					//- [type]에 따른 사이즈 분리
					if('slide' === type) {
						
						//- 컴포넌트 사이즈 내의 
						if(iOffRight <= comp.left) {
							
							//- 메타 오브젝트에 등록
							if(target == 'all' || ( target == 'include' && iOffTop <= ivTop && iOffBottom >= ivBottom )) {
								
								nLeft -= size;
								
								//- view part일 경우 동일하게 뷰로 처리
								if(view) {
									
									if(comp.right) {
										
										nRight += size;
									}
								}
							}
						}
					} else {
						
						if(iOffBottom <= comp.top) {
							
							//- 메타 오브젝트에 등록
							if(target == 'all' || ( target == 'include' && iOffLeft <= ivLeft && iOffRight >= ivRight )) {
								
								nTop -= size;
									
								//- view part일 경우 동일하게 뷰로 처리
								if(view) {
									
									if(comp.bottom) {
										
										nBottom += size;
									}
								}
							}
						}
					} 
				}
				
				//- move to component
				this.toMove(comp, nLeft, nTop, nWidth, nHeight, nRight, nBottom, animate);
			}
		}
	}
	
	/**
	 * 컴포넌트 이동을 위한 함수
	 *
	 * @param {object} component 이동할 컴포넌트
	 * @param {*} left 좌측 좌표값 
	 * @param {*} top 좌측 좌표값
	 * @param {*} width 넓이 값
	 * @param {*} height 높이 값
	 * @param {*} right 우측 좌표값
	 * @param {*} bottom 하단 좌표값
	 * @param {object} animate 에니메이션 처리를 위한 객체
	 */
	toMove(component, left, top, width, height, right, bottom, animate) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- 컴포넌트일 경우 즉시 반환
		if(olib.sfw_isEmpty(component)) {
			
			return;
		}
		
		//- animate가 없이 넘어올 경우 즉시 이동 처리
		if(!animate) {
			
			component.move(left, top, width, height, right, bottom);
		} else {
			
			var _path_id = 'ev_'+this._getPathComponent(component);
			
			//- 진행 중인 에니메이션이 있을 경우 재 실행
			//- not execute when running animation 
			if(form[_path_id]) {
				
				form[_path_id].destroy();
			} 
			
			var _duration, _easing;
			
			// 기본 값 셋팅
			animate = this.mixon(olib.sfw_isObject(animate) ? animate : {},{
				duration   : 300,
				easing     : 'easeinoutcubic',
				multiful   : false,
				oncomplete : function() {
					
					this.removeChild(_path_id);
				},
				onstart    : function() {  },
			});
			  
			//- 에니메이션 생성
			var _animation = new nexacro.Animation(_path_id, form);
			
			form.addChild( _path_id, _animation );
			
			_animation.set_duration( animate.duration );
			_animation.set_easing( animate.easing );
			_animation.setEventHandler( "oncomplete", animate.oncomplete, form);
			
			//- 이동을 위한 경로 지정
			var _move_pos = "left:['"+left
						  + "'],top:['"+top
						  + "'],width:['"+width
						  + "'],height:['"+height
						  + "'],right:['"+right
						  + "'],bottom:['"+bottom
						  + "']"
			
			_animation.addTarget( _path_id
								, component
								, _move_pos);
			
			//- 에니메이션 실행을 위한 함수 실행
			animate.onstart.call(form, _path_id);
			
			_animation.play();
		}
	}
	
	/**
	 * 실제 토글링을 처리하는 함수
	 * 
	 * @private
	 */
	_toggle(component, obj, callback) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- __toggling이 있을 경우 toggling된 상태로 확인한다.
		if(!component.__toggling) {
			
			this._toggling(component, obj.toggle_size, obj);
			
			component.__toggling = true;
			
			if(callback) {
				
				callback.call(form, 1);
			}
		} else {
			
			this._toggling(component, (obj.toggle_size * -1), obj);
			
			component.__toggling = false;
			
			if(callback) {
				
				callback.call(form, 0);
			}
		}
	}
	
	/**
	 * 토글을 설정한다
	 *
	 * @param {object} division 기준 div를 등록
	 * @param {object} option toggling 옵션을 등록
	 */
	initToggle(division, option) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- division을 등록
		if(division instanceof nexacro.Div) {
			
			//- 옵션이 없을 경우 기본 사이즈는 24px로 지정
			option = this.mixon(option,{
				size : (option.type || 'drilldown') == 'drilldown' ? ( division.getOffsetHeight() - 28 ) : ( division.getOffsetWidth() - 28 )
			});
			
			
			//- decalre somethind Constarint Varaible
			var CONST_TOGGLE_OPEN_CSS  = 'btn_WFSA_open';
			var CONST_TOGGLE_CLOSE_CSS = 'btn_WFSA_close';
			var CONST_TOGGLE_BUTTON_ID = '_toggle_button';
			
			//- declare somethind Variable and set default value
			var toggle_size    = option.size;
			var toggle_target  = option.target  || 'all';
			var toggle_fold    = option.fold    || false;
			var toggle_view    = option.view    || false;
			var toggle_type    = option.type    || 'drilldown';
			var toggle_animate = option.animate || false;
			var toggle_button  = this.mixon(option.button, {top : null, left : null, width : 26, height : 26, right : 0, bottom : 0});
			
			//- button position overraping
			if(option.button) {
				
				for(var pos in option.button) {
					
					toggle_button[pos] = option.button[pos];
				}
			}
			
			//- 스크롤 영역을 처리 한다.
			division.set_formscrollbartype('none none');
			
			//- create component that useful toggle button
			var _toggle_button = new Button(CONST_TOGGLE_BUTTON_ID);
			
			_toggle_button.init(CONST_TOGGLE_BUTTON_ID
							  , toggle_button.left
							  , toggle_button.top
							  , toggle_button.width
							  , toggle_button.height
							  , toggle_button.right
							  , toggle_button.bottom);
			
			//- add attribute on toggle button
			_toggle_button.__toggling     = false;
			_toggle_button.__init__       = false;
			_toggle_button.toggle_size    = toggle_size;
			_toggle_button.toggle_target  = toggle_target;
			_toggle_button.toggle_view    = toggle_view;
			_toggle_button.toggle_type    = toggle_type;
			_toggle_button.toggle_animate = toggle_animate;
			_toggle_button.toggle_button  = toggle_button;
			
			//- base css attribute is closed css
			_toggle_button.set_cssclass(CONST_TOGGLE_CLOSE_CSS);
			
			var toggle_action = (function(division, _button) { 
				
				return function(obj) {
					
					//- not execute when running animation 
					if(form.__animation__) {
						
						return;
					}
					
					this._toggle(division, _button, function(opened) {
						
						if(opened == 1) { //- toggle opened
							
							_button.set_cssclass(CONST_TOGGLE_OPEN_CSS);
						} else { //- toggle closed
							
							_button.set_cssclass(CONST_TOGGLE_CLOSE_CSS);
						}
					});
				}
			})(division, _toggle_button).bind(this);
			
			division.toggle = toggle_action;
			
			//- registration toggle event on toggle button
			_toggle_button.addEventHandler('onclick', toggle_action, form);
			
			//- append component on division
			division.addChild(CONST_TOGGLE_BUTTON_ID, _toggle_button);
			
			//- active an toggle button
			_toggle_button.show();
			
			//- pre processing when fold 'yes' ( true | anything )
			if(toggle_fold) {
				
				_toggle_button.getEventHandler('onclick', 0).call(_toggle_button, _toggle_button);
				_toggle_button.__init__ = true;
				
			} else {
				
				_toggle_button.__init__ = true;
			}
			
			form.resetScroll();
		}
	}
	
	
	/**
	 *  넥사크로 오픈 스타일은 Modeless를 위하여 현재 프레임의 기준[getOwnFrame]으로 
	 *  동적 작업 프레임을 오픈 시키는 nexacro.open과 직접 프레임을 생성 시켜 해당 프레임을 오픈 시키는 
	 *  다이렉트 생성 방식으로 2가지 방식을 모두 제공한다.
	 *  두 방식 모두 외부 프레임을 기준으로 작성 될수 있으며 외부 폼 등록 시 해당 폼을 기준으로 처리 된다.
	 *  또한 동적 생성 방식은 android NRE(Nexacro Runtime Environment] 에서는 지원하지 않으므로 기본 처리 방식인
	 *  (alert)과 (confirm)을 사용하여 처리한다.
	 *  
	 *  각각의 함수는 아래와 같다.
	 *  
	 *  > alert   : 확인창
	 *  > confirm : 단일 응답창
	 *  > prompt  : 질의 응답창
	 *
	 **/
	open(request) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- 기본 세팅을 지정한다.
		var defaultSetting = {
		
			//- 모달 여부 
			modal : true,
			
			//- 기본 속성
			formurl : null,
			id : '',
			name : null,
			
			//- 사이즈 관련
			autosize : true,
			left : -1,
			top : -1,
			right : null,
			bottom : null,
			width : null,
			height : null,
			
			//- 스타일 관련
			background : null,
			borderRadius : null,
			color : null,
			cssclass : null,
			opacity : 0.95,
			overlaycolor : 'rgba(0, 0, 0, 0.3)',
			
			//- 폼 처리 관련
			cursor : null,
			hotkey : null,
			openalign : null,
			layered : true,
			openstatus : true,
			progressbardirection : null,
			progressbargap : null,
			progressbarsize : null,
			progressbarsmooth : null,
			resizable : false,
			statusbarheight : null,
			statustext : null,
			taskbaricon : null,
			dragmovetype : true,
			titlebarbuttongap : null,
			titlebarbuttonsize : null,
			titlebarheight : null,
			titletext : 'open popup',
			topmost : null,
			showontaskbar : false,
			showstatusbar : false,
			showtitlebar  : false,
			showtitleicon : false,
			visible : null,
			border : '0px',
			borderRadius : '10px',
			
			//- 팩토리 생성 함수
			factory : function(frame) {
				
			},
			
			//- 파라미터 처리
			params : { },
			
			//- 이벤트 처리
			event : { 
				
				onmove : function(obj, e) {
					
					var left   = obj.left;
					var top    = obj.top;
					var width  = obj.width;
					var height = obj.height;
					
					var nw = nexacro.getApplication().mainframe.width;
					var nh = nexacro.getApplication().mainframe.height;
					
					var newLeft = 0;
					var newTop = 0;
					
					if ((left + width) < 100) {
						
						newLeft = 100 - width;
					} else {
						
						if (left > (nw - 100)) {
							
							newLeft = nw - 100;
						} else {
							
							newLeft = left;
						}
					}
					
					if (top < 0) {
						
						newTop = 0;
					} else if (top >= (nh - 50)) {
						
						newTop = nh - 50;
					} else {
						
						newTop = top;
					}
					
					if(newLeft < 0) {
						
						newLeft = 0;
					}
					
					obj.set_top(newTop);
					obj.set_left(newLeft);
				},
				onclose : function (obj, e) {
					
					e.stopPropagation();
				}
			}
		}
		
		//- 기본 세팅값과 신규 세팅값을 합친다.
		var setting = this.mixon(request, defaultSetting);
		
		var _id      = setting.id;
		var _name    = setting.name;
		var _formurl = setting.formurl;
		var _url     = setting.url;
		
		//- 아이디가 없을 경우 아이디를 동적으로 생성
		if(olib.sfw_isEmpty(_id)) {
			
			_id = setting.id = olib.sfw_getUniqueId('__DynamicFramePop_', '_');
		}
		
		//- FORM URL로 지정 된 속성이 없을 경우 URL로 확인하여 대체
		if(olib.sfw_isEmpty(_formurl)) {
			
			_formurl = setting.formurl = _url;
		}
		
		//- 화면의 URL을 찾을 수 없을 경우 에러 발생후 반환
		if(olib.sfw_isEmpty(_formurl)) {
			trace('formurl is not found');
			return;
		}
		
		// Top & Left -1은 소유창의 가운데 위치
		if (setting.left == -1 && setting.top == -1)
		{
		
			setting.openalign = "center middle";
			setting.left = (nexacro.getApplication().mainframe.width / 2) - Math.round(setting.width / 2);
			setting.top = (nexacro.getApplication().mainframe.height / 2) - Math.round(setting.height / 2);
			
		}
		
		//- modal 여부에 따라 Modal과 Modeless로 분리하여 처리
		if(setting.modal) {
		
			//- 프레임을 생성
			var newChild = new nexacro.ChildFrame;
			
			//- setting
			var _setter = null;
			
			for(var e in setting) {
				
				_setter = newChild['set_'+e];
				
				if(setting[e] == null || setting[e] == undefined) continue;
				
				//- setter가 없는 속성일 경우 다음으로 이동한다.
				if(olib.sfw_isEmpty(_setter)) continue;
				
				//- setting attribute
				_setter.call(newChild, setting[e]);
			}
			
			//- event setting
			for(var e in setting.event) {
				
				newChild.addEventHandler(e, setting.event[e]);
			}
			
			newChild.showModal(_id, form.getOwnerFrame(), setting.params, this, setting.callback||'fn_messagecallback');
			
		} else {
			
			
			var option = null;
			var options = '';
			
			for(var e in setting) {
				
				option = setting[e];
				
				if(option == null || option == undefined) continue;
				
				if(olib.sfw_isObject(option)) continue;
				
				options += ' '.concat(e).concat('=').concat(option);
			}
			
			nexacro.open( _id, _formurl, form.getOwnerFrame(), setting.params, options);
		}
	}
	
	
	
	/**
	 * 메시지를 변환해 주는 함수
	 * 
	 * @private
	 * @method
	 * @name _messageConvertor
	 */
	_messageConvertor(message) {
		
		return message||'';
	}
	
	
	/**
	 * 메시지를 등록하는 함수
	 *
	 * @public
	 * @method
	 * @name set_message
	 */
	set_message(message_code, message_type, message) {
		
		nexacro.applicationRepository.set(message_code, { type : message_type, message : message });
	}
	
	
	/**
	 * 메시지를 조회하는 함수
	 *
	 * @public
	 * @method
	 * @name get_message
	 */
	get_message(message_code) {
		
		return nexacro.applicationRepository.get(message_code);
	}
	
	/**
	 * 동적 생성 방식은 android NRE(Nexacro Runtime Environment] 에서는 지원하지 않으므로 기본 처리 방식인<br/>
	 * (alert)과 (confirm)을 사용하여 처리한다.<br/>
	 * 각각의 함수는 아래와 같다.<br/>
	 *
	 * > alert   : 확인창<br/>
	 * > confirm : 단일 응답창<br/>
	 * > prompt  : 질의 응답창<br/>
	 *
	 * @public
	 * @method
	 * @name message
	 */
	message(message_code, message_parameters, message_callback) {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		//- declare message conf
		var formUrl;
		var oMessage   = this.get_message(message_code);
		var sMessageID, sMessageType, sMessage;
		
		//- 메시지 코드가 비어 있을 경우 전체 메시지를 즉시 처리한다.
		//- 메시지 코드가 있을 경우 메시지 처리
		if(olib.sfw_isEmpty(oMessage)) {
			
			//- 객체로 등록 될 경우 객체의 설정값을 적용
			if(olib.sfw_isObject(message_code)) {
				
				oMessage = message_code;
			} else {
			
				//- 그 외의 경우 기본 설정으로 등록
				oMessage = {
					id : null,
					type : "alert"
				};
			}
		}
		
		//- message와 타입을 할당
		sMessageID   = oMessage.id      || null;
		sMessage     = this._messageConvertor(oMessage.message || '');
		sMessageType = oMessage.type    || 'alert';
		
		//- parameters mapping
		//- array[] type or object{} type mapping or factory object
		if(olib.sfw_isArray(message_parameters)) {
			
			for ( var param = 0 ; param < message_parameters.length ; param++ ) {
				
				if(sMessage.indexOf('@') < 0) continue;
				
				sMessage = sMessage.replace('@', message_parameters[param]);
			}
		} else if(olib.sfw_isObject(message_parameters)) {
			
			for ( var param in message_parameters ) {
				
				if(sMessage.indexOf('@'+param) < 0) continue;
				
				sMessage = sMessage.replace('@'+param, message_parameters[param]);
				
			}
		} else if(olib.sfw_isFunction(message_parameters)) {
				
			sMessage = message_parameters.call(form, sMessage);
		} else {
			
			sMessage = sMessage.replace(/@/g, this._messageConvertor(message_parameters));
		}
		
		// 후 처리를 위한 함수 생성
		if(olib.sfw_isString(message_callback)) {
			
			message_callback = form[message_callback] || function() { };
		}
		
		//- 기존 파라미터와 할당 값이 동일하지 않을 경우 에러를 발생하던 부분은 제거
		formUrl = sMessageType == 'alert'   ? this.alertURL   : formUrl;
		formUrl = sMessageType == 'confirm' ? this.confirmURL : formUrl;
		formUrl = sMessageType == 'prompt'  ? this.promptURL  : formUrl;
		
		
		//- 메시지 속성값 정의
		var popupArgument = {
			//- popup id
			id : sMessageID,
			
			//- parameter setting
			params : {
				message : sMessage,
				type : sMessageType,
			},
			
			callback : (function(argList) {
				
				return function(svc_id, returnValue) {
					
					var args = [];
					
					for(var i = 3 ; i < argList.length ; i++) {
						
						var argumentparam = argList[i];
						
						if(!olib.sfw_isEmpty(argumentparam)) {
							
							args.push(argumentparam);
						}
					}
					
					args.push(returnValue);
					
					if(message_callback){
						
						message_callback.apply(this, args);
					}
					
					
				}
			})(arguments)
		}
		
		//- 사이즈와 autosize 지정
		popupArgument.height   = 220;
		popupArgument.width    = 350;
		popupArgument.autosize = false;
		
		//- set form url
		if(!olib.sfw_isEmpty(formUrl)) {
			
			//- form url setting
			popupArgument.formurl = formUrl;
		}
		
		this.open(popupArgument);
	}
		
	/**
	 * 넥사크로 컴포넌트를 통하여 사이즈를 처리할 resizableDom을 구성한다.
	 * 
	 * @public
	 * @method
	 * @name message
	 */
	resizableDocumentObject(parent) {
		
		
		
		
		
		
		return {
		
			resize : function() {
				
			}
		}
	}
		
	/**
	 * 화면을 동적으로 변경하도록 포지션을 재 설정한다. </br>
	 * 각 화면은 `<div>`영역 위에서 동작하며 먼저 `dom`을 구성하여 동작하도록 처리한다. </br>
	 * 
	 * @public
	 * @method
	 * @name message
	 */
	resetPosition() {
		
		//- library matching
		var olib = this.lib;
		var form = this.form;
		
		var _dom = null;
		
		//- if not exists resizable domcument object model, create this object
		if(this._dom) {
			
			this._dom = _dom;
		} else {
			
			//- parsing document object model throw nexacro
			this._dom = this.resizableDocumentObject(form);
		}
		
		this._dom.resize();
	}
	
	
	/**
	 * 데이터셋의 정보를 JSON정보로 변환한다.
	 *
	 * @public
	 * @method
	 * @name datasetToJson
	 * @param {Object} oDataset 데이터셋
	 * @return {Object} JSON 타입의 문자열
	 * @example this.datasetToJson(this.dsExample)
	 */
	datasetToObject (oDataset) {
		
		var returnList = [];
		var returnMap  = {};
		
		var sColId, sValue;
		
		//- 전체 행을 순환하면서 값을 처리 한다.
		for(var nRow = 0 ; nRow < oDataset.getRowCount() ; nRow++)
		{
			returnMap = {};
			
			for(var nCol = 0; nCol < oDataset.getColCount(); nCol++) {
				
				sColId = oDataset.getColID(nCol);
				sValue = oDataset.getColumn(nRow, nCol);
				
				returnMap[sColId] = sValue;
			}
			
			//- 행 값을 추가
			returnList.push(returnMap);
		}
		
		//- JSON 문자열로 반환한다.
		return returnList;
	};
	
	
	/**
	 * 데이터셋의 정보를 JSON정보로 변환한다.
	 *
	 * @public
	 * @method
	 * @name datasetToJson
	 * @param {Object} oDataset 데이터셋
	 * @return {Object} JSON 타입의 문자열
	 * @example this.datasetToJson(this.dsExample)
	 */
	datasetToJson (oDataset) {
		//- JSON 문자열로 반환한다.
		return JSON.stringify(this.datasetToObject(oDataset));
	};
	
	/* 확장 시 이곳에 등록 */
};