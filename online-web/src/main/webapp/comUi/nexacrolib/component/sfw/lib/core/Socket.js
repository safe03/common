/**
 * 소켓 연결을 위한 고유 클래스
 * 필요 시 SocketJS의 http 프로토콜을 사용할수 있다.
 * 
 * @class
 * @name SocketConnection
 */
class SocketConnection {
	
   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor (lib) {
		
		//- library matching
		this.clib = new CoreLibrary(lib);
		
		var openLibrary = lib;
		
		this.form  = openLibrary;
		this.olib  = openLibrary;
		this.repo  = openLibrary.applicationRepository;
		
		//- default Socket Setting Allocate Area
		var CONST_BASE_URL   = this.clib.getBaseUrl();
		
		//- default values setting 
		this.defaultSetting = {
			baseUrl     : CONST_BASE_URL,
			serviceUrl  : CONST_BASE_URL,
			resourceUrl : '/resources/static/html/stomp.html',
			type        : 'socket', // socket, stomp
			protocol    : 'ws', // ws, http
			url         : '/',
			callback    : null,
			handler     : null,
			endpoint    : '/ws',
			header      : {}, //- stomp connection header
			listeners   : {},
			_socket     : null,
			_broker     : null,
			_webview    : null,
			/* @TODO 필요시 이곳에 확장 */
		}
	}
	
    /**
	 * 소켓을 초기화 하는 함수
	 *
	 * @method
	 * @name init
	 */
	connect(setting) {
	
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var repo = this.repo;
		var form = this.form;
		
		//- mix default value and passed value
		this.setting = clib.mixon(setting, this.defaultSetting);
		
		//- http와 https의 경우 기본 url을 따르므로 넘어 가도록 한다.
		//- 만일 외부로 소켓 접속이 필요한경우 [serviceUrl]을 파라미터로 입력하도록 처리한다.
		if(this.setting.protocol == 'http' || this.setting.protocol == 'https') {
			//- @nocheck
		}
		
		else if(this.setting.protocol == 'ws' || this.setting.protocol == 'wss') {
			
			//- [http]를 [ws]로 변환 [https]를 [wss]로 변환
			this.setting.serviceUrl = this.setting.serviceUrl.replace('http://' , 'ws:' );
			this.setting.serviceUrl = this.setting.serviceUrl.replace('https://', 'wss:');
		}
		
		//- localhost dev convert
		this.setting.baseUrl    = this.setting.baseUrl.replace('localhost.', 'localhost');
		this.setting.serviceUrl = this.setting.serviceUrl.replace('localhost.', 'localhost');
		
		var _socketObject = null;
		
		//-  Basic Connection Type Simple WebSocket
		if(this.setting.type == 'socket') {
			
			//- switching Object Basic Simple WebSocket
			_socketObject = new BaiscSimpleWebSocket(this.clib);
		} else if(this.setting.type == 'stomp') {
			
			//- switching Object Basic Simple WebSocket
			_socketObject = new StompMessageBroker(this.clib);
		}
		
		//- 런타임의 경우에는 넥사크로 17.1에서 나온 웹 뷰 기능을 사용하여 브릿지 처리한다.
		if(nexacro._Browser == 'Runtime') {
			
			var _viewID = olib.sfw_getUniqueId('__nexacroViewBrowser_', '_');
			
			var sBaseUrl = this.setting.baseUrl;
			var sResourceUrl = this.setting.resourceUrl;
			var __webView = this.setting._webview;
			
			if(olib.sfw_isEmpty(__webView)) {
			
				var _webView = new nexacro.WebView(_viewID, 0, 0, 0, 0);
				
				//- 로딩이 끝난 다음 처리 후 처리하도록 실행
				_webView.addEventHandler('onloadcompleted', function(obj,e) {
					
					_socketObject.connect(this.setting);
				},this);
				
				//-  Message Broker Connection Type Stomp WebSocket
				if(this.setting.type == 'stomp') {
					
					//- switching Object Basic Simple WebSocket Broker
					_webView.set_url(sBaseUrl + sResourceUrl);
				} else {
					
					_webView.set_url(sBaseUrl + sResourceUrl);
				}
				
				
				form.addChild(_viewID, _webView);
				
				_webView.show();
				
				setting._webview = _webView;
			} else {
				
				setting._webview = __webView;
				
				_socketObject.connect(this.setting);
			}
			
			return _socketObject; 
		} else {
			
			//- direct connection
			return _socketObject.connect(this.setting);
		}
	}
};


/**
 * 기본 브라우져 웹 소켓 연결을 위한 고유 클래스
 * @class
 * @name BaiscSimpleWebSocket
 */
class BaiscSimpleWebSocket {
	
   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor (lib) {
		
		//- library matching
		this.clib = lib;
		
		var openLibrary = lib.getOpenLibrary();
		
		this.form    = openLibrary;
		this.olib    = openLibrary;
		this.repo    = openLibrary.applicationRepository;
		
		this.setting = {};
	}
	
	/**
	 * 소켓 객체를 생성한다.
	 * 
	 * @return {object} socket socket객체를 반환한다.
	 */
	getObject(setting) {
		
		//- setting url base
		var sServiceUrl = setting.serviceUrl;
		var sConnectUrl = setting.url;
		var sEndpoint   = setting.endpoint;
		var sEntryPoint = sConnectUrl + sEndpoint;
		var sServiceUrl = sServiceUrl + sEntryPoint.replace(/\/\//g, '/');
		
		//- replace a//b to a/b
		
		var _socket;
		
		//- when nexacro runtime,
		//- callable Bridge-Webview-Component
		if(setting._webview) {
			
			//- create bridge socket object
			_socket = {
				readyState : 0,
				view       : setting._webview,
				close      : function(event) { },
				send       : function(message) { 
					this.view.callScript(`
						
						this['${this.view.id}'].send('${message}');
						
						nexacro.fireUserNotify(JSON.stringify({ "type" : "readyState", "data" : this['${this.view.id}'].readyState}));
						
					`); 
				},
				onmessage  : function(message) { },
				onopen     : function(event)   { },
				onerror    : function(event)   { },
				
			}
			
			if(this.isWebSocket(setting)) {
				
				//- window의 [WebSocket] 등록
				setting._webview.callScript(`
					
					this['${setting._webview.id}'] = new WebSocket('${sServiceUrl}');
				`);
			} else {
				
				//- window의 [SockJS] 등록
				setting._webview.callScript(`
					
					this['${setting._webview.id}'] = new SockJS('${sServiceUrl}');
				`);
			}
			
		} else {
			
			//- websocket fallback tracking
			if(this.isWebSocket(setting)) {
				
				_socket = new WebSocket( sServiceUrl );
			} else {
				
				_socket = new SockJS( sServiceUrl );
			}
		}
		
		//- return new socket object
		return _socket;
	}
	
	
	/**
	 * 웹소켓연결을 활성화한다.
	 * 
	 * @return {boolean} true|false - 웹소켓 포트 (ws)사용여부
	 */
	connect(setting) {
		
		var form = this.form;
		
		this.setting = setting;
		
		//- create socket object
		var _socket = this.getObject(setting);
		
		//- arrange attributes this object
		this.setting._socket = _socket;
		
		//- meesage handling
		this._handle(setting);
		
		//- on message bridging
		_socket.onmessage = this.receive;
		
		//- connect bridege webview
		//- connect Form <- Bridege -> View
		if(setting._webview) {
			
			//- add event bridge Form
			setting._webview.addEventHandler('onusernotify', function(obj, e) {
				
				//- message payload
				var payload = JSON.parse(e.userdata);
				
				if(payload.type == 'onmessage') { 
					
					//- notificate message toss
					_socket.onmessage({data : payload.data}); 
				}
				
				if(payload.type == 'onopen') { 
					
					//- 상태 변경 후 onopen 처리
					_socket.readyState = 1;
					
					_socket.onopen.call(form, {}); 
				}
				
				if(payload.type == 'onerror') { 
					
					//- 상태 변경 후 onerror 처리
					_socket.readyState = 3;
					
					_socket.onerror.call(form, {}); 
					//- notificate message toss
				}
				
				if(payload.type == 'close') { 
					
					//- 상태 변경 후 close 처리
					_socket.readyState = 3;
					
					_socket.close.call(form, {}); 
				}
				
				if(payload.type == 'readyState') {
					
					//- 상태 변경 후 close 처리
					_socket.readyState = nexacro.toNumber(payload.data||'3');
				}
			}, this);
			
			//- add event bridge View
			setting._webview.callScript(`
				
				var _socket = this['${setting._webview.id}'];
				
				_socket.onmessage = function(message) { nexacro.fireUserNotify(JSON.stringify({ "type" : "onmessage", "data" : message.data })); };
				_socket.onopen    = function(message) { nexacro.fireUserNotify(JSON.stringify({ "type" : "onopen"  })); };
				_socket.onerror   = function(message) { nexacro.fireUserNotify(JSON.stringify({ "type" : "onerror" })); };
			`);
			
		}
		
		//- handler cache
		_socket._handler = this;
		
		return this;
	}
	
	/**
	 * 프로토콜을 확인하여 웹소켓 프로토콜을 사용하는지 확인한다.
	 * 
	 * @return {boolean} true|false - 웹소켓 포트 (ws)사용여부
	 */
	isWebSocket(setting) {
		
		var _setting = setting || { protocol : 'http://' };
		
		//- 프로토콜을 확인하여 ws는 웹소켓으로 http는 socketjs로 처리한다.
		if(setting.protocol) {
			
			return setting.protocol.substr(0,2) == 'ws';
		} else {
			
			return false;
		}
	}
	
	
	/**
	 * 메시지를 처리 하는 함수
	 *
	 * @private
	 * @method
	 * @name handle
	 */
	_handle(setting) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var socket  = setting._socket;
		
		//- handler or callback funtionality
		var _handler = setting.callback || setting.handler;
		var _defaultFailedCallback = function() {
			
			trace('Lost Connect Websocket-Direction');
		}
		
		//- 문자열로 핸들러를 입력 할 경우 폼에 등록 된 핸들러를 검색하여 처리
		if( olib.sfw_isString(_handler) ) {
			
			var _callback = form[_handler];
			
			//- 핸들러 함수를 확인하여 처리
			if( !olib.sfw_isEmpty(_callback) ) {
				
				socket.onopen = _callback.bind(form);
			}
			
			socket.onerror = _defaultFailedCallback;
		} else if( olib.sfw_isFunction(_handler) ){
			
			//- 함수의 경우 사용자 함수를 실행하여 후 처리를 종료 한다.
			socket.onopen  = _handler.bind(form);
			socket.onerror = _defaultFailedCallback;
			
		} else if( olib.sfw_isObject(_handler) ) {
				
			var handlers = _handler;
			
			//- 성공할 경우 후 처리
			if( handlers.onsuccess ) {
				
				socket.onopen = handlers.onsuccess.bind(form);
			}
			
			//- 실패할 경우 후 처리
			if( handlers.onfailed ) {
				
				socket.onerror = handlers.onfailed.bind(form);
			} else {
				
				socket.onerror = _defaultFailedCallback;
			}
		}
	}
	
	
	/** 
	 * 클라이언트에서 서버로 메시지를 전송한다.
	 * 
	 * @public
	 * @method
	 * @name send
	 * @param {string} message 전송할 메시지
	 */
	send(message) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var setting = this.setting;
		var socket  = setting._socket;
		
		//- except socket not connected
		if(olib.sfw_isEmpty(socket) || socket.readyState != 1) {
			
			trace('Socket is closed');
			return;
		}
		
		//- message send
		socket.send(this.messageConvertTo(message));
	}
	
	/** 
	 * 전송 객체(socket)의 닫힘 여부를 확인
	 * 
	 * @public
	 * @method
	 * @name send
	 * @param {boolean} message 전송할 메시지
	 */
	isClosed(message) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var setting = this.setting;
		var socket  = setting._socket;
		
		//- except socket not connected ( 3 : close, 1 : open )
		return socket.readyState == 3;
	}
	
	/** 
	 * 서버에서 넘겨 받은 데이터를 </br>
	 * 사용 가능한 고유 [payload] 데이터로 변환한다.
	 * 
	 * @public
	 * @method
	 * @name messageConvertFrom
	 * @param {function} callback 종료 후 처리 할 함수
	 */
	messageConvertFrom(message) {
		
		return message.data;
	}
	
	/** 
	 * 클라이언트에서 넘길 데이터를 서버에서 </br>
	 * 사용 가능한 고유 Message 데이터로 변환한다.
	 * 
	 * @public
	 * @method
	 * @name messageConvertTo
	 * @param {function} callback 종료 후 처리 할 함수
	 */
	messageConvertTo(message) {
		
		return message;
	}
	
	/** 
	 * 소켓 연결을 닫는다.
	 * 
	 * @public
	 * @method
	 * @name close
	 * @param {function} callback 종료 후 처리 할 함수
	 */
	close(callback) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var setting = this.setting;
		var socket  = setting._socket;
		
		var _callback = callback || function() { };
		
		//- connect bridege webview
		//- connect Form <- Bridege -> View
		if(setting._webview) {
			
			//- add event bridge Form to webview
			setting._webview.addEventHandler('onusernotify', function(obj, e) {
				
				var payload = JSON.parse(e.userdata);
				
				//- payload
				if(payload.type == 'close') { 
					
					_callback.call(form, {}); 
				}
				
				//- close webview
				if(this.setting._webview) {
					form.removeChild(this.setting._webview.id);
					
					this.setting._webview.destroy();
				}
				
			}, this);
			
			//- add event bridge webview to form
			this.setting._webview = null;
			this.setting = null;
			
			callback.call(form);
//			setting._webview.callScript(`
//				
// 				var _socket = this['${setting._webview.id}'];
// 				
// 				_socket.onclose = function() {
// 					
// 					nexacro.fireUserNotify(JSON.stringify({ "type" : "close" }));
// 				}
// 				
// 				_socket.close();
//			`);
		} else {
			
			socket.onclose = callback.bind(form) || function() { };
			
			socket.close();
			
		}
	}
	
	/** 
	 * 연결된 소켓에서 데이터를 전송 받는다.
	 * 
	 * @public
	 * @method
	 * @name receive
	 * @param {*} message 서버에서 전송 받은 메시지 데이터
	 */
	receive(message) {
		
		var socket = this._handler;
		
		//- library matching 
		var olib = socket.olib;
		var clib = socket.clib;
		var form = socket.form;
		
		var setting = socket.setting;
		
		var listener  = null;
		var listeners = setting.listeners;
		
		for(var listener_idx in listeners) {
			
			listener = listeners[listener_idx];
			
			if(olib.sfw_isFunction(listener)) {
				
				//- toss message to registed listener
				listener.call(form, socket.messageConvertFrom(message));
			}
		}
	}
	
	/**
	 * 리스너 함수를 등록하여 반환값에 따라 처리 가능하도록 합니다.
	 *
	 * @method
	 * @name addListener
	 * @param {string} id 리스너 아이디 (없을 경우 고유 아이디를 사용하여 처리)
	 * @param {Function} listener 리스너 함수
	 **/
	addListener(id, listener) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- not pass the id parameter
		if(listener == null || listener == undefined) {
			
			listener = id;
			id = olib.sfw_getUniqueId('lstrctl_', '_');
		}
		
		//- when function, regist listener
		if(olib.sfw_isFunction(listener)) {
			
			this.setting.listeners[id] = listener;
		} else {
			
			listener = form[listener];
			
			if(!olib.sfw_isEmpty(listener)) {
				
				trace('only registrate a function listner');
			} else {
				
				if(olib.sfw_isFunction(listener)) {
					
					this.setting.listeners[id] = listener;
				}
			}
		}
		
		return id;
	}
	
	
	/**
	 * 리스너 함수를 삭제하여 반환값에 따라 처리 가능하도록 합니다.
	 *
	 * @method
	 * @name removeListener
	 * @param {string} id 리스너 아이디
	 * @param {function} callback 종료 후 처리 할 함수
	 **/
	removeListener(id, callback) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- 리스너가 있을 경우 리스너 제거
		if(this.setting.listeners[id]) {
			
			//- release subscribe
			this.setting.listeners[id] = null;
			
			delete this.setting.listeners[id];
			
			//- execute callback
			if(!olib.sfw_isEmpty(olib)) {
				
				if(callback){
					
					callback.call(form);
				}
			}
		}
	}
};



/**
 * stompJS를 사용하여 웹 소켓을 연결하는 고유 클래스
 * @class
 * @name StompMessageBroker
 */
class StompMessageBroker {

   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor (lib) {
		
		//- library matching
		this.clib = lib;
		
		var openLibrary = lib.getOpenLibrary();
		
		this.form    = openLibrary;
		this.olib    = openLibrary;
		this.repo    = openLibrary.applicationRepository;
	}
	
	/**
	 * 브로커 객체를 생성한다.
	 * 
	 * @return {object} broker broker객체를 반환한다.
	 */
	getObject(setting) {
		
		var _socket, _broker;
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- setting url base
		var sServiceUrl = setting.serviceUrl;
		var sConnectUrl = setting.url;
		var sEndpoint   = setting.endpoint;
		var sServiceUrl = sServiceUrl + sConnectUrl + sEndpoint;
		
		sServiceUrl = sServiceUrl.replace(/\/\//g, '/');
		
		//- clean last seperator '/'
		if('/' == sServiceUrl.substr(sServiceUrl.length-1, sServiceUrl.length)) {
			
			sServiceUrl = sServiceUrl.substr(0, sServiceUrl.length-1);
		}
		
		//- basic web socket
		_socket = new BaiscSimpleWebSocket(clib).getObject(setting);
		
		//- set socket
		this._setSocket( _socket );
		
		var setting = this.setting;
		
		//- if have a view component is use bridge onyl vue
		if(_socket.view) {
			
			//- create bridge socket object
			_broker = {
				readyState : 0,
				view       : _socket.view,
				send       : function(destination, option, message) {
					
					this.view.callScript(`this['over_${this.view.id}'].send('${destination}');`); 
				},
				subscribe  : function(destination,option, message) { },
				disconnect : function(event) {
					
					this.disconnect = event;
					
					this.view.callScript(`
						
						var _disconnect = function() { nexacro.fireUserNotify(JSON.stringify({ "type" : "disconnect"  })); }
						
						this['stomp_${this.view.id}'].disconnect(_disconnect);
					`); 
				},
				onsuccess: function() { },
				onerror : function() { },
			}
			
			//- window의 WebSocket 등록
			_socket.view.callScript(`
				this['stomp_${setting._webview.id}'] = Stomp.over(this['${setting._webview.id}']);
			`);
			
		} else {
			
			//- over stomp broker
			_broker = Stomp.over( _socket );
		}
		
		//- return new broker object
		return _broker;
	}
	
	/**
	 * 내부 소켓을 등록하는 함수
	 *
	 * @private
	 * @method
	 * @name _getSocket
	 * @param {Socket} 생성 된 소켓 객체
	 */
	_setSocket(socket) {
		
		this.setting._socket = socket;
	}
	
	/**
	 * 내부 소켓을 반환하는 함수
	 *
	 * @private
	 * @method
	 * @name _getSocket
	 * @return {Socket} 접속 된 소켓 객체
	 */
	_getSocket() {
		
		return this.setting._socket;
	}
	
	
	/**
	 * 웹소켓연결을 활성화한다.
	 * 
	 * @return {boolean} true|false - 웹소켓 포트 (ws)사용여부
	 */
	connect(setting) {
		
		this.setting = setting;
		
		//- create socket object
		var _broker = this.getObject(setting);
		
		//- arrange attributes this object
		this.setting._broker = _broker;
		
		//- handler cache
		_broker._handler = this;
		
		//- connection and handling
		this._handle(setting);
		
		return this;
	}
	
	
	/**
	 * 메시지를 처리 하는 함수
	 *
	 * @private
	 * @method
	 * @name handle
	 */
	_handle(setting) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var broker  = setting._broker;
		
		var header  = setting.header || {};
		
		//- handler or callback funtionality
		var _handler = this.setting.callback || this.setting.handler;
		
		//- default callback handler
		var _defaultSuccessCallback = function() { trace('Success Connected Broker-Server'); }
		var _defaultFailedCallback  = function() { trace('Lost Connect Broker-Server');      }
		
		var _onsuccess = _defaultSuccessCallback;
		var _onerror   = _defaultFailedCallback;
		
		//- 문자열로 핸들러를 입력 할 경우 폼에 등록 된 핸들러를 검색하여 처리
		if( olib.sfw_isString(_handler) ) {
			
			var _callback = form[_handler];
			
			//- 핸들러 함수를 확인하여 처리
			if( !olib.sfw_isEmpty(_callback) ) {
				
				_onsuccess = _callback.bind(form);
				_onerror   = _defaultFailedCallback.bind(form);
			}
		} else if( olib.sfw_isFunction(_handler) ){
			
			//- 함수의 경우 사용자 함수를 실행하여 후 처리를 종료 한다.
			_onsuccess = _handler.bind(form);
			_onerror   = _defaultFailedCallback.bind(form);
			
		} else if( olib.sfw_isObject(_handler) ) {
			
			var handlers = _handler;
			
			//- 성공할 경우 후 처리
			if( handlers.onsuccess ) {
				
				_onsuccess = handlers.onsuccess.bind(form);
			}
			if( handlers.onfailed ) {
				
				_onerror = handlers.onfailed.bind(form);
			}
		}
		
		//- broker callback cache
		broker.onsuccess = _onsuccess;
		broker.onerror = _onerror;
		
		//- when matched nexacro NER
		//- connect bridege webview
		//- connect Form <- Bridege -> View
		//- else then direct connection stompJS
		if(setting._webview) {
			
			//- reform header
			var _header = clib.convertObjectToString(header);
			
			//- add event bridge Form
			setting._webview.addEventHandler('onusernotify', function(obj, e) {
				
				var payload = JSON.parse(e.userdata);
				
				//- payload
				if(payload.type == 'onsuccess') { 
					
					//- 상태 변경 후 onopen 처리
					this.readyState = 1;
					
					broker.onsuccess.call(form, {}); 
				}
				
				if(payload.type == 'onerror') { 
					
					//- 상태 변경 후 onopen 처리
					this.readyState = 0;
					
					broker.onerror.call(form, {}); 
				}
				
				if(payload.type == 'onmessage') {
					
					this.setting.listeners[payload.id].subscribe(payload.data);
				}
				
				if(payload.type == 'disconnect') {
					
					//this.setting._broker.disconnect
					broker.disconnect.call(form);
				}
			}, this);
			
			
			//- add event bridge View
			setting._webview.callScript(`
				
				var _broker = this['stomp_${setting._webview.id}'];
				
				var _onsuccess = function() {nexacro.fireUserNotify(JSON.stringify({ "type" : "onsuccess"})); }
				var _onerror   = function() {nexacro.fireUserNotify(JSON.stringify({ "type" : "onerror"  })); }
				
				_broker.connect(${_header}, _onsuccess, _onerror);
			`);
			
		}else {
		
			broker.connect(header, _onsuccess, _onerror);
		}
	}
	
	/** 
	 * 클라이언트에서 서버로 메시지를 전송한다.
	 * 
	 * @public
	 * @method
	 * @name send
	 * @param {string} destination 전송한 대상지
	 * @param {object} option 등록할 옵션
	 * @param {string} message 전송할 메시지
	 */
	send(destination, option, message) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var _broker = this.setting._broker;
		
		//- message가 비어 있을 경우 
		if(message == null || message == undefined) {
			message = option
			option  = {};
		}
		
		var _message = this.messageConvertTo(message);
		
		if(_broker.view) {
			
			//- reform header
			var _option = clib.convertObjectToString(option);
			
			_broker.view.callScript(`
				
				var _broker = this['stomp_${_broker.view.id}'];
				
				_broker.send('${destination}', ${_option}, '${_message}');
			`)
			
		} else {
			
			_broker.send(destination, option, _message);
		}
	}
	
	/** 
	 * 서버에서 넘겨 받은 데이터를 </br>
	 * 사용 가능한 고유 [payload] 데이터로 변환한다.
	 * 
	 * @public
	 * @method
	 * @name messageConvertFrom
	 * @param {string} 전송받은 메시지
	 */
	messageConvertFrom(message) {
		
		return nexacro.base64Decode(message.body);
	}
	
	/** 
	 * 클라이언트에서 넘길 데이터를 서버에서 </br>
	 * 사용 가능한 고유 Message 데이터로 변환한다.
	 * 
	 * @public
	 * @method
	 * @name messageConvertTo
	 * @param {string} 전송할 메시지
	 */
	messageConvertTo(message) {
		
		return nexacro.base64Encode(message);
	}
	
	/** 
	 * 소켓 연결을 닫는다.
	 * 
	 * @public
	 * @method
	 * @name close
	 * @param {function} callback 종료 후 처리 할 함수
	 */
	close(callback) {
		
		var _broker = this.setting._broker;
		
		_broker.disconnect(callback);
	}
	
	/** 
	 * 연결된 소켓에서 데이터를 전송 받는다.
	 * 
	 * @public
	 * @method
	 * @name receive
	 * @param {*} message 서버에서 전송 받은 메시지 데이터
	 */
	receive (message) {
		
		//- @subscribe(topic,queue) 로 대체되어 receive 기능을 사용하지 않는다.
		//- 필요 시 클라이언트의 라우터를 추가 하여 라우팅 기능을 추가하도록 한다 
	}
	
	/**
	 * 리스너 함수를 등록하여 반환값에 따라 처리 가능하도록 합니다.
	 *
	 * @method
	 * @name addListener
	 * @param listener {Function} 리스너 함수
	 **/
	addListener (id, destination, listener) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var _broker   = this.setting._broker;
		var listeners = this.setting.listeners;
		
		//- not pass the id parameter
		if(listener == null || listener == undefined) {
			
			listener    = destination;
			destination = id;
			id          = olib.sfw_getUniqueId('sub_', '_');
		}
		
		//- 기존에 등록된 정보가 있을 경우 제거 후 재 접속
		if(listeners[id]) {
			
			listeners[id].unsubscribe();
		}
		
		//- curring listener function
		var _overMessageListener = function(form, listener, convertor) {
			
			return function(message) {
				listener.call(form, convertor(message));
			}
			
		}(form, listener, this.messageConvertFrom);
		
		//- bridge stomp sub-protocol 
		if(_broker.view) {
			
			var _listener = {
				id : id,
				view : _broker.view,
				unsubscribe : function() {
					
					this.view.callScript(`
						
						this['${this.id}'].unsubscribe();
					`);
				},
				subscribe : _overMessageListener
			}
			
			//- run-script
			_broker.view.callScript(`
				
				var _broker = this['stomp_${_broker.view.id}'];
				
				var _routeMessage = function(message) { nexacro.fireUserNotify(JSON.stringify({ "id" : "${id}", "type" : "onmessage", data : message})); }
				
				this['${id}'] = _broker.subscribe('${destination}', _routeMessage);
			`);
			
			//- subscribe listener
			listeners[id] = _listener;
		} else {
			
			//- subscribe listener
			listeners[id] = _broker.subscribe(destination, _overMessageListener);
		}
		return id;
	}
	
	
	/**
	 * 리스너 함수를 삭제하여 반환값에 따라 처리 가능하도록 합니다.
	 *
	 * @method
	 * @name removeListener
	 * @param {string} id 리스너 아이디
	 * @param {function} callback 종료 후 처리 할 함수
	 **/
	removeListener(id, callback) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- 리스너가 있을 경우 리스너 제거
		if(this.setting.listeners[id]) {
			
			try{
				
				//- release subscribe
				this.setting.listeners[id].unsubscribe();
				this.setting.listeners[id] = null;
				
				//- execute callback
				if(!olib.sfw_isEmpty(olib)) {
					
					callback.call(form);
				}
			} catch(e) { }
			
		}
	}
};