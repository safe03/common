if (!Array.prototype.findIndex) {

Object.defineProperty(Array.prototype, 'findIndex', {
	value: function(predicate) {
		
		if (this == null) 
		{
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		
		if (typeof predicate !== 'function') 
		{
			throw new TypeError('predicate must be a function');
		}
		
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;
		
		for (var i = 0; i < length; i++) 
		{
			value = list[i];
			
			if (predicate.call(thisArg, value, i, list)) 
			{
				return i;
			}
		}
		
		return -1;
	},
	enumerable   : false,
	configurable : false,
	writable     : false
	});
}

/**
 * 미들웨어 처리를 위한 애플리케이션단의 라우팅 동작 클래스
 * @app 라우터의 기본 @Routing 기능을 처리한다.
 * 
 * @class
 * @name Routers
 */
class Routers {
	
   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor (lib, repo) {
		
		//- library matching
		this.clib = lib;
		
		var openLibrary = lib.getOpenLibrary();
		
		this.form = openLibrary;
		this.olib = openLibrary;
		this.repo = repo;
		
		//- constraint processing type
		this.CONST_PIPLINE = 'pipline';
		this.CONST_ITEM    = 'item';
		
		//- default setting allocate
		this.defaultSetting = {
			processing : this.CONST_PIPLINE, /* pipline(use only one cycle in process), item(run individually process) */
			Rtable : repo.getApplicationRepository( /* default Routin Table Setting(s) Object */ ),
		};
		
		//- default setting up
		this._init({ });
	}
   
    /**
	 * 라우팅를 초기화하는 함수
	 *
	 * @private
	 * @method
	 * @name Router#_init
	 */
	_init(setting) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		
		//- when null or not object value then immediate return [ scope this ]
		if(olib.sfw_isNull(setting) || !olib.sfw_isObject(setting)) {
			
			return this;
		}
		
		//- mix default value and passed value
		this.setting = clib.mixon(setting, this.defaultSetting);
	}
	
	/**
	 * 미들웨어를 라우팅 테이블에 등록하는 함수
	 * 
	 * @public
	 * @method
	 * @name Router#use
	 * @param {Router} middleware 미들웨어 객체
	 * @use use(new Router(...))
	 */
	use(middleware) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		var repo = this.repo;
		
		//- middleware registrate on Repository, if parent class Router
		if(middleware instanceof Router){
			
			//- get middleware setting
			var _setting = middleware.setting;
			
			//- setting up URL, HANDLER
			var _urls    = _setting.url;
			var _handler = _setting.handler;
			var _order   = _setting.order;
			
			//- variable to find individually item
			var _url;
			
			//- loop for url items
			for(var e in _urls) {
				
				//- get bind url
				_url = _urls[e];
				
				//- bind router on this Rtable
				this._bind(_url, _handler, _order);
			}
		}
		else {
			//- @TODO use basic function
		}
	}
	
	
	/**
	 * 미들웨어를 라우팅 테이블에 제거하는 함수
	 * 
	 * @public
	 * @method
	 * @name Router#use
	 * @param {Router} middleware 미들웨어 객체
	 * @use use(new Router(...))
	 */
	unuse(middleware) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		var repo = this.repo;
		
		//- middleware registrate on Repository, if parent class Router
		if(middleware instanceof Router){
			
			//- get middleware setting
			var _setting = middleware.setting;
			
			//- setting up URL, HANDLER
			var _urls    = _setting.url;
			var _handler = _setting.handler;
			var _order   = _setting.order;
				
			//- routing getter [setting]
			var setting = this.setting;
			
			//- find static repository
			var stic = setting.Rtable;
			
			var url,
				_bindTable,
				_bindHandler, 
				_newBindHandler;
			
			for(var e in _urls) {
				
				url = _urls[e];
				
				//- bind table
				_bindTable = stic.get(url);
				
				for(var e = 0 ; e < _bindTable.length ; e++) {
					
					_bindHandler = _bindTable[e];
					
					if(_handler == _bindHandler) {
						
						_newBindHandler = Array.prototype.concat(_bindTable.slice(0, e), _bindTable.slice(e+1));
						
						if(_newBindHandler.length > 0) {
							
							stic.set(url, _newBindHandler);
						} else {
							
							stic.del(url);
						}
					}
				}
			}
		}
	}
	
	/**
	 * 미들웨어를 활성화 하는 함수
	 *
	 * @public
	 * @method
	 * @name Router#middle
	 * @use middle({url : '/'})
	 */
	middle(request) {
		
		//- routing getter [setting]
		var setting = this.setting;
		var response = { /* return response */ };
		
		//- find static repository and processing type
		var stic = setting.Rtable;
		var proc = setting.processing;
		
		//- bind table
		var _bindTable = stic.get();
		
		var strRequestUrl = request.url || '/';
		
		var _handler;
		var _volunteers = [];
		
		for(var e1 in _bindTable) {
			
			//- matching url
			if(strRequestUrl.match(e1)) {
				
				//- volunteers resolve handler
				for(var e2 in _bindTable[e1]) {
					
					_volunteers.push(_bindTable[e1][e2]);
				}
			}
		}
		
		//- sorting re order
		_volunteers.sort( (e, a) => e.order - a.order );
		
		//- with pipline
		if(proc == this.CONST_PIPLINE) {
			
			var _next = function() { };
			var that = this;
			
			for(var e3 = _volunteers.length-1 ; e3 > -1 ; e3--) {
				
				_next = (function(_origin, __next__) {
					
					return function() {
						
						var args = [ __next__ ];
						
						for(var e = 0 ; e < arguments.length ; e++) {
							
							args.push(arguments[e]);
						}
						
						//- if exists origin function, call function
						if(_origin)
						{
							_origin.apply(that, args);
						}
					}
				})(_volunteers[e3], _next);
			}
			
			//- call volunteers handler
			_next(request);
		} else if(this.CONST_ITEM){
			
			//- loop volunteer(s)
			for(var e2 = 0 ; e2 < _volunteers.length ; e2++) {
				
				_volunteers[e2].call(that, null, request);
			}
		} else {
			
			//- nothing
		}
	}
	
    /**
	 * 라우팅 테이블에 바인딩 한다.
	 * 
	 * @private
	 * @method
	 * @name Router#_bind
	 */
	_bind (url, handler, order) {
		
		//- routing getter [setting]
		var setting = this.setting;
		
		//- find static repository
		var stic = setting.Rtable;
		
		var _bindTable;
		
		//- set caching
		if(!stic.get(url)) {
			//- cache array
			stic.set(url, []);
		}
		
		//- bind table
		_bindTable = stic.get(url);
		
		//- if like type appending, time last order 
		if(!order) {
			
			//- set last order
			handler.order = Number.MAX_SAFE_INTEGER;
			
			_bindTable.push(handler);
		} else {
			
			//- find index order
			var _order = _bindTable.findIndex(function(e) {
				return e.order < order;
			});
			
			//- set order confirm
			handler.order = order;
			
			if(_order > -1) {
				
				stic.set(url, Array.prototype.concat(_bindTable.slice(0, _order), handler, _bindTable.slice(_order)));
			} else {
				 
				_bindTable.push(handler);
			}
		}
	}
};

/**
 * 미들웨어 처리를 위한 애플리케이션단의 라우터 클래스
 * @routing 라우터의 기본 @route 기능을 통합한다.
 * 
 * @class
 * @name Router
 */
class Router {

   /**
    * @public
    * @constructor
    * @param {Object} Purl Handle URL(s)
    * @param {Function} Phandler Handling Function
	* @param {int} Porder Handler Order
    */
	constructor (Purl, Phandler, Porder) {
		
		//- variety variable
		if(!Phandler) {
			
			//- form (handler), rematch url eq any(*) match
			Phandler = Purl;
			Purl = '/.*';
		}
		
		//- default setting up
		//- will extend type of ant style matcher
		this._init({
			url     : Purl || ['/.*'],
			handler : Phandler || function(next) { if(next) { next(); } },
			order   : Porder || -1
		});
	}
	
    /**
	 * 라우터를 초기화하는 함수
	 *
	 * @private
	 * @method
	 * @name Router#_init
	 */
	_init (setting) {
		
		//- when null or not object value then immediate return [ required scope this ]
		if(!setting || typeof(setting) != 'object') {
			return this;
		}
		
		//- declare rout variable
		var _url, _handler, _order;
		
		_url     = setting.url;
		_handler = setting.handler;
		_order   = setting.order;
		
		//- use [[Array]] constructor Object
		if(Array) {
			
			//- convert full match url(s), when not type of Array
			if(!Array.isArray(_url)) {
				
				//- List rematching
				_url = [_url];
			}
		} else {
			
			if(typeof(_url) == 'object') {
				
				if(!( _url instanceof Array ) ) {
					
					//- List rematching
					_url = [_url];
				} else {
					
					trace('Exception : Router is Only Support String or Array(s) Type [ solve Rebind "/" ]');
					
					//- List rematching
					_url = ['/'];
				}
			}
		}
		
		//- mix default value and passed value
		this.setting = {
			url     : _url,
			handler : _handler,
			order   : _order
		};
	}
}