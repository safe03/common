/**
  * 각 트랜잭션이 등록 된 객체
  * @class
  * @name Transaction
  */
class Transaction {
   
   /**
    * @public
    * @constructor
    * @param {Object} lib Form Object
    */
    constructor(lib) {
		
		//- library matching
		this.clib = lib;
		this.olib = lib.getOpenLibrary();
		this.form = lib.getOpenLibrary();
		
		//- default values setting 
		this.defaultSetting = {
			quiet   : false,
			dataset : null,
			mode    : 'out',
			type    : 'U',
			bind    : [ ],
			params  : { },
			sql     : {
				type      : 'S',
				query     : 'SELECT 1',
				mapper    : null,
				procedure : null,
				service   : null,
				method    : null,
				ins       : null,
				upd       : null,
				del       : null,
				chunk     : 0,
				prefix    : '',
				suffix    : '',
			},
			validate  : { },
			validator : function() { return true; },
			join      : {
				dataset : null    ,
				mode    : 'out'   ,
				on      : [     ] ,
				point   : 'first' ,
			},
			row       : null,
			order     : 0,
			execute   : false
		}
		
		//- default setting up
		this.init({});
	}
   
    /**
	 * 트랜잭션을 초기화 하는 함수
	 *
	 * @method
	 * @name Transaction#init
	 */
	init(setting) {
		
		//- library matching
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- when null or not object value then immediate return [ required scope this ]
		if(olib.sfw_isEmpty(setting) || !olib.sfw_isObject(setting)) {
			return this;
		}
		
		//- mix default value and passed value
		this.setting = clib.mixon(setting, this.defaultSetting);
		
		//- 문자열로 데이터셋을 입력 할 경우 실제 데이터 셋 객체를 확인하여 재 등록
		if( !olib.sfw_isNull(this.setting.dataset) && olib.sfw_isString(this.setting.dataset)) {
			
			//- rebind the dataset object on setting.dataset attribute
			this.setting.dataset = this.getDatasetWithName(this.setting.dataset);
		}
	}
	
	/**
	 * 등록 된 폼에 존재 하거나 
	 * 또는 존재 하지 않는 데이터셋 객체를 
	 * 검색 또는 생성하여 반환 하는 함수
	 * 
	 * @method 
	 * @name Transaction#getDatasetWithName
	 * @param {*} name 데이터셋 명칭
	 * @return {object} 데이터셋 객체(Dataset Object)
	 */
	getDatasetWithName(name) {
		
		//- library matching
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- 이미 데이터셋으로 등록 될 경우 즉시 반환
		if(olib.sfw_isDataset(name)) {
			
			return name;
		}
		
		var _parent;
		
		//- 존재 하지 않는 데이터셋을 등록 할 경우
		//- 폼에 신규 생성 하여 처리
		if(!olib.sfw_isEmpty(form)) {
			
			if(olib.sfw_isEmpty(form[name])) {
				
				_parent = form.parent;
				
				//- 상위 프레임을 순회하면서 처리
				while(_parent != null) {
					
					//- 상위 프레임에서 데이터셋을 찾을 경우
					if(_parent[name]) {
						
						//- 데이터셋 타입일 경우 해당 데이터셋을 사용 
						if(_parent[name] instanceof nexacro.Dataset){
							
							return _parent[name];
						}
					}
					
					_parent = _parent.parent;
				}
				
				form.addChild(name, new Dataset(name));
			}
		}
		
		return form[name];
	}
	
	/**
	 * 
	 * 등록 된 데이터셋의 명칭을 반환 하는 함수
	 * 
	 * @method
	 * @name Transaction#getDatasetName
	 * @return {string} dataset name
	 */
	getDatasetName() {
		
		return this.setting.dataset.name;
	}
	
	/**
	 * 
	 * 등록 된 트랜잭션 아이디를 반환하는 함수
	 * 트랜잭션 아이디는 ( 데이터셋ID + '@@' + 데이터셋타입 ) 룰을 사용하여 처리한다.
	 * 
	 * @method
	 * @name Transaction#getDatasetName
	 * @return {string} dataset name
	 */
	getDatasetId() {
		
		return ( this.setting.dataset.name + '@@' + this.setting.mode );
	}
}
 
 
 
 /**
  * 트랜잭션을 관리하고
  * 전송 데이터를 처리 하는 트랜잭션 관리 클래스
  * 
  * @class
  * @name TransactionManager
  */
class TransactionManager {

	/**
	 * 트랜잭션 설정
	 * @property {string} [id] - 트랜잭션 고유 아이디
	 * @property {string} [url] 트랜잭션 처리 URL
	 * @property {string} [type] 트랜잭션 타입
	 * @property {string} [async] 트랜잭션 동기화
	 * @property {string} [header] 트랜잭션 헤더
	 * @property {string} [repeat] 트랜잭션 반복 처리
	 * @property {string} [handler] 트랜잭션 후 처리기
	 * @property {string} [callback] 트랜잭션 후 처리기
	 * @property {string} [data] 트랜잭션 데이터 
	 */
    //setting;
   
   /**
    * @publicca
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor (lib, repo, dsm, batch) {
      
		//- library matching
		this.clib = lib;
		
		var openLibrary = lib.getOpenLibrary();
		
		this.form  = openLibrary;
		this.olib  = openLibrary;
		this.repo  = repo;
		this.dsm   = dsm;
		this.batch = batch;
		
		//- default Transaction Area Declare
		this._transactionList    = [ [ /* Default Transaction Area */ ] ];
		this._transactionDataset = { /* registrate Transaction Info [Dataset] this Area , [TM, TD, TA, TJ, TE] */ };
		this._transactionAggregateCallback = '__TranasctionManagerAggregateCallback__';
		
		var CONST_BASE_URL = this.clib.getBaseUrl();
		
		//- @TODO - https://의 경우 wss로 변환되며 현재 플랫폼은 
		//-         http://로 처리 되므로 이부분을 추후 라우팅으로 처리 예정
		//- @CLOSE  ws:는 [[Socket]]에서 처리 할 것이므로 이 부분은 제외
		//- @DROP   v.1.0.0-beta
		//- var CONST_WS_BASE_URL = CONST_BASE_URL.replace('http://', 'ws:');
		
		//- make a Transaction Unique id
		var _UUID = openLibrary.sfw_getUniqueId("tx__","_");
		
		//- default values setting 
		this.defaultSetting = {
			serviceId   : _UUID,
			id          : _UUID,
			baseUrl     : CONST_BASE_URL,
			url         : '/comn/common.nx',
			data        : { },
			params      : null,
			type        : 'nexacro',
			async       : true,
			header      : { },
			repeat      : 'no 0 0',
			handler     : 'fn_callBack',
			callback    : null,
			dataType    : 'XML',
			input       : '',
			output      : '',
			validate    : { },
			validator   : function() { return true; },
			_callback   : this._transactionAggregateCallback,
			lazy        : false,
			promise     : false,
			reuse       : false,
			onReady     : null,
			onClosed    : null, 
			noask       : false,
			message     : '저장하시겠습니까?',
		}
		
		//- init default value
		this.init({});
	}

   /**
    * 기본 설정 값을 변경 한다.
    * 
    * @public
    * @method
    * @name TransactionManager#init
    * @param {object} setting setting value object
    * @return {object} this return
    */
	init (setting) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		
		//- when null or not object value then immediate return [ scope this ]
		if(olib.sfw_isNull(setting) || !olib.sfw_isObject(setting)) {
			
			return this;
		}
		
		//- mix default value and passed value
		this.setting = clib.mixon(setting, this.defaultSetting);
		
		//- cache transaction ID and Transaction Instance;
		this.transactionSet = {};
		
		//- return chain
		return this;
	}
	
   /**
    * 기본 설정 값을 반환 한다.
    * 
    * @public
    * @method
    * @name TransactionManager#getDefaultSetting
    * @return {object} default setting object
    */
	getDefaultSetting() {
		
		return this.defaultSetting;
	}
    
   
   /**
    * 처리가 필요한 트랜잭션 객체를 생성
    * 
    * @public
    * @method
    * @name TransactionManager#add
    * @param {object} att transaction attributes
    * @return {object} this return
    */
	add (att) {
		
		//- 최종 리스트에 있는 그룹의 순번을 확인
		var nTxPos = this._transactionList.length - 1;
		
		//- 최종 그룹을 조회
		var aTxGrp = this._transactionList[nTxPos];
		
		//- 트랜잭션을 생성
		var oTx = new Transaction(this.clib);
		
		//- 트랜젝션 객체 초기화
		oTx.init(att);
		
		//- 동일한 트랜잭션이 등록 될 경우 재 등록하지 않고 로그 출력 후 반환
		var _tid = oTx.getDatasetId();
		
		if(this.transactionSet[_tid]) {
			
			trace('Exception : Already Exists Transaction Object');
		} else {
			
			this.transactionSet[_tid] = oTx;
		}
		
		//- 설정이 추가 된 트랜잭션 객체를 등록
		aTxGrp.push(oTx);
		
		return this;
	}
   
   
   /**
    * 트랜잭션을 세분화할 그룹을 생성
    * 
    * @public
    * @method
    * @name TransactionManager#and
    * @return {object} this return
    */
	and() {
      
		//- new Transaction Group
		this._transactionList.push([]);
      
		return this;
	}
   
   
   /**
    * 트랜잭션을 세분화할 그룹을 실행한다.
    * 
    * @public
    * @method
    * @name TransactionManager#end
    * @param {object} attribute object
    */
	end(attr) {
      
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.olib;
		
		//- parameter object checking
		if (olib.sfw_isEmpty(attr)) {
			
			attr = {
				lazy : false,
				promise : false,
			};
		}
		
		
		//- 해더 영역을 처리할 핸들러를 등록한다.
		//- 필요 시 해당 영역에 핸들러를 등록하여 확장 한다.
		//- 필요시 브레이크 처리는 [return] 값을 사용하여 처리 한다.
		//- 
		//- | 함수 | 기능 |
		//- |:---:|:---:|
		//- | _beforeProcessing | 전처리를 실행한다. |
		//- | _createTransactionDataset | 트랜잭션에 필요한 메타 데이터셋을 생성한다. |
		//- | _messageNegotiator | 데이터 처리에 필요한 데이터 메시지를 처리한다. |
		//- | _onProcessing | 주처리를 실행한다. |
		//- | _afterProcessing | 후처리를 실행한다. |
		//- | _onReady | 후 처리까지 모두 완료 될 경우 실행된다. |
		//- 
		var Lprocessor = [
			this._beforeProcessing ,
			this._createTransactionDataset ,
			this._messageNegotiator ,
			this._onProcessing ,
			this._afterProcessing ,
			this._onReady,
		];
		
		//- 핸들러를 실행한다.
		for ( var ips in Lprocessor ) {
			
			//- false를 반환할 경우 현재 상태로 브레이크 처리 된다.
			if(!Lprocessor[ips].call(this, attr)){
				
				this.reset();
				
				//- 각 항목에 따른 반환값 처리
				//- lazy일 경우 에러 방지를 위해 빈 함수 반환
				//- promise일 경우 에러 방지를 위해 Promise 객체를 반환
				//- 그 외의 경우 null값 반환
				if(attr.lazy) {
					
					return function __empty__() { }
				} else if(attr.promise){
					
					return new Promise();
				} else {
					
					return null;
				}
			}
		}
		
		return this.call(attr);
	}
	
   /**
    * @private
    * 트랜잭션 데이터셋을 생성하는 함수
    */
	_createTransactionDataset() {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.olib;
		
		//- get this Transaction Service ID <- Unique Service ID
		var serviceId = this.setting.serviceId;
		
		//- 0 : Transaction Master
		//- 1 : Transaction Dataset
		//- 2 : Transaction Binder
		//- 3 : Transaction Aliase
		//- 4 : Transaction Join
		//- 5 : Transaction Parameter (Arguments)
		//- 6 : Transaction Etc ( will Extension )
		var _datasetMetaInfo = [
			{ id : serviceId + '_0', name : '__TMD__', columns : ['status'], mode : 'in' },
			{ id : serviceId + '_1', name : '__TDD__', columns : ['id', 'dataset', 'mode', 'type', 'group', 'order', 'execute'
															, '_type', '_query', '_mapper', '_procedure', '_method', '_service'
															, '_insert', '_update', '_delete', '_normal'
															, '_chunk', '_prefix', '_suffix'], mode : 'in' },
			{ id : serviceId + '_2', name : '__TBD__', columns : ['id', 'column', 'bind'], mode : 'in' },
			{ id : serviceId + '_3', name : '__TAD__', columns : ['id', 'aliase'], mode : 'in' },
			{ id : serviceId + '_4', name : '__TJD__', columns : ['idA', 'idB', 'columnA', 'columnB', 'point' , 'mocking'], mode : 'in' },
			{ id : serviceId + '_5', name : '__TPD__', columns : ['id', 'key', 'value', 'type'], mode : 'in' },
			{ id : serviceId + '_6', name : '__TED__', columns : ['id'], mode : 'in'},
			{ id : '__output__', name : '__output__', columns : ['update_count'] , mode : 'out' }
		];
		
		//- 데이터셋 정보를 확인하여 순회하면서 생성 및 등록한다.
		var sid, sname, sMode, Lcolumns;
			
		for ( var e in _datasetMetaInfo ) {
			
			//- 데이터셋 정보를 확인하여 생성
			var _info = _datasetMetaInfo[e];
			
			sid      = _info.id;
			sname    = _info.name;
			Lcolumns = _info.columns;
			sMode    = _info.mode;
			
			//- 이미 등록 된 트랜잭션 데이터셋이 있을 경우 기 등록 된 데이터셋을 사용
			if(olib.sfw_isEmpty(this._transactionDataset[sname])) {
				
				if(olib.sfw_isEmpty(this.form[sname])){
					
					//- 데이터셋 생성
					var _dynamicCreateDataset = new Dataset(sid);
					
					if(this._isInputMode(sMode)) {
						//- 데이터셋을 트랜잭션 관리영역에 등록
						this._transactionDataset[sname] = _dynamicCreateDataset;
					}
					
					//- 데이터셋을 폼 영역에 등록
					form.addChild(sid, _dynamicCreateDataset);
					
					//- 속성을 순회 하면서 컬럼 생성
					for ( var columnIndex in Lcolumns) { 
						
						_dynamicCreateDataset.addColumn( Lcolumns[columnIndex], 'STRING' );
					}
				}
				//- 공용 트랜잭션 처리시에 사용하기 위하여
				//- 트랜잭션 입력/출력 값으로 지정
				if(this._isInputMode(sMode)) {
					
					this.setting.input += ' '.concat(sname).concat('=').concat(sid).concat(':').concat('A');
				} else if(this._isOutputMode(sMode)) { 
					
					this.setting.output += ' '.concat(sname).concat('=').concat(sid);
				}
			} else {
				
				return true;
			}
		}
		
		return true;
	}
	
	
   /**
    * 주 처리를 실행하기 전 처리를 실행한다.
	*
    * @private
	* @method
	* @name TransactionManager#_beforeProcessing
    */
	_beforeProcessing(attr) {
      
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		var repo = this.repo;
		var dsm  = this.dsm;
		
		//- 검증을 실시 한다.
		//- 검증은 두 가지 방법을 통하여 하게 되며 모두 통과 하여아만 
		//- 다음의 프로세스를 실행할수 있다.
		//- 1. [verification]를 통한 시스템 검증
		//- 2. [validator]를 통한 사용자 직접 검증
		if( !this._verificateTransaction() || !this._verificate() || !this._verification() ) {
			
			this.handle(null, {code : -32010, message : 'failed validate check'});
			
			return false;
		}
		
		//- 전역 저장소를 불러와 처리 단계에 들어 간다.
		var staticRepo = repo.getStaticRepository();
		
		var _setting = this.setting;
		
		var sTxid = _setting.id;
		
		var oTransactionStatusObject = staticRepo.get(sTxid);
		
		//- 이미 실행 등록 된 트랜잭션 정보일 경우 삭제 후 재 등록
		if(!olib.sfw_isEmpty(oTransactionStatusObject)) {
			
			var _target = oTransactionStatusObject.object;
			
			_target.reset();
		}
		
		//- 트랜잭션 기본 정보 등록
		//- statis is that [ PENDING, READY, RUNNING, COMPLITE, REJECTED, SUCCESS ]
		this._info = {
			id        : _setting.id,
			serviceId : _setting.serviceId,
			status    : 'PENDING',
			resolve   : null,
			reject    : null,
			reuse     : attr.reuse || false,
			rows      : [],
			object    : this,
			closed    : false,
		};
		
		//- 전역 저장소에 트랜젝션 정보를 등록한다.
		staticRepo.set(sTxid, this._info);
		
		return true;
	}
	

   
   /**
    * 사용자가 등록한 validator를 사용하여 검증한다.
    * 검증에 실패한 전역 트랜잭션은 실행 되지 않는다.
	* 
    * @private
	* @method
	* @name TransactionManager#_verificate
	* @return {boolean} 검증 결과 {true|false}
    */
	_verificate() {
		
		//- library matching
		var clib = this.clib;
		var olib = this.olib;
		var form = this.olib;
		
		var _setting  = this.setting
		var _validate = _setting.validate;
		var _data     = _setting.params||_setting.data;
		
		//- validate를 등록 하지 않을 경우
		if ( olib.sfw_isEmpty(_validate) ) {
			
			return true;
		}
		
		//- data가 없을 경우
		if ( olib.sfw_isEmpty(_data)) {
			
			return true;
		}
		
		var Larguments, _types, _type, _message, _on, val, ci, _code;
		
		//- 아이템을 순회하면서 검증값 확인
		for ( var itm in _data ) {
			
			val = _data[itm];
			
			if(olib.sfw_isFunction(val)) {
				
				val = val.call(form);
			}
			
			//- 벨리데이트 값을 가져 온다.
			ci = _validate[itm];
			
			//- 처리기 옵션이 없을 경우 건너 뛴다. 경우 처리
			if (olib.sfw_isEmpty(ci)) { 
				
				continue; 
			}
			
			_types   = (ci.type||'').split(',');
			_message = ci.message;
			_code    = ci.code;
			_on      = ci.on;
			
			//- 타입을 순회하면서 검증기를 처리한다.
			for(var _vitem in _types) {
				
				_type = _types[_vitem];
				
				Larguments = [ _type, val, _code||null ];
				
				//- [on]키워드가 있을 경우 포커스 대상으로 선정 하여 처리
				if(_on) {
					
					Larguments.push(clib.focusOn(_on));
				} else {
					
					Larguments.push(function _focusOn() { });
				}
				
				//- 메시지가 배열일 경우 처리 메시지를 배열로 변환
				if(olib.sfw_isArray(_message)) {
					
					Larguments.push(_message);
				} else {
					
					Larguments.push([_message]);
				}
				
				//- 검증 값을 확인하여 처리
				if(!clib.validate.apply(clib, Larguments)) {
					return false;
				}
			}
		}
		
		return true;
	}
   
   /**
    * _verification를 사용하여 인자값을 검증기를 사용하여 검증한다.
    * 검증에 실패한 전역 트랜잭션은 실행 되지 않는다.
	*
    * @private
	* @method
	* @name TransactionManager#_verification
	* @return 검증 결과값 {true|false}
    */
	_verification() {
		
		var clib = this.clib;
		var olib = this.olib;
		var form = this.olib;
		
		var _setting    = this.setting
		var validator   = null;
		var _validator  = _setting.validator;
		var _validators = null;
		var _data       = _setting.params||_setting.data;
		
		//- 벨리데이터를 등록 하지 않을 경우 패스
		if ( olib.sfw_isEmpty(_validator) ) {
			
			return true;
		}
		
		//- 복합 검증을 위하여 처리
		if(olib.sfw_isArray(_validator))
		{
			_validators = _validator;
		}
		else
		{
			_validators = [_validator];
		}
		
		var bResult = true;
		
		//- 검증기를 통합 실시 한다.
		for(var ev in _validators)
		{
			validator = _validators[ev];
			
			bResult = validator.call(form, _data);
			
			//- 경과값이 없을 경우 [참-true] 으로 처리
			if(olib.sfw_isEmpty(bResult)) 
			{
				continue;
			}
			
			//- 반환값이 [[false]]일 경우 검증 실패
			if(!bResult)
			{
				return false;
			}
		}
		
		return true;
	}
	
	
   /**
    * 메시지(data) 처리를 위한 함수
	*
    * @private
	* @method TransactionManager#_messageNegotiator
	* @param {object} attr 속성값을 지정한다.
    */
	_messageNegotiator(attr) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _setting = this.setting;
		
		var _type = olib.sfw_toUpper(_setting.type);
		var _data = _setting.params || _setting.data;
		
		//- data 속성에 대응 되지 않을 경우 즉시 반환
		if (olib.sfw_isEmpty(_data) ) {
			
			_setting.data = '';
			
			return true;
		}
		
		//- function 데이터의 경우 함수를 실행하여 결과값을 취한다.
		if(olib.sfw_isFunction(_data)) {
			
			_data = _data.call(form);
		}
		
		//- 데이터 타입에 따른 형변환 처리
		switch(_type) {
			
			case 'XML' : 
				
				this.setting.data = 'data="'.concat(clib.convertObjectToXml(_data)).concat('"');
			break;
			
			case 'JSON' : 
				
				this.setting.data = 'data="'.concat(clib.convertObjectToJson(_data)).concat('"');
			break;
			
			case 'NEXACRO' : 
				
				this.setting.data = clib.convertObjectToNexacro(_data);
			break;
			
			default :
				
				this.setting.data = clib.convertObjectToNexacro(_data);
			break;
		}
		
		return true;
	}
   
   /**
    * 주 처리를 실행한다.
    * 
    * @private
	* @method 
	* @name TransactionManager#_onProcessing
	* @param {object} attr 속성값을 지정한다.
    */
	_onProcessing(attr) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- 바디(Row) 영역을 처리할 핸들러를 등록한다.
		//- 필요 시 해당 영역에 핸들러를 등록하여 확장 한다.
		var LbodyResolvers = [
			this._modifySearchCheck,
			this._validateHandler,
			this._sqlResolver,
			this._bindResolver,
			this._aliaseResolver,
			this._joinResolver,
			this._parameterResolver,
			this._rowpositionHandler,
			this._datasetInputOutputResolver,
		];
      
		//- 바디 영역을 순환하면서 트랜잭션을 처리한다.
		var ogr, otx;
		
		for ( var ig = 0 ; ig < this._transactionList.length ; ig++ ) {
			
			for ( var it = 0 ; it < this._transactionList[ig].length ; it++ ) {
				
				for ( var recursiveItm in LbodyResolvers ) {
					
					if(!LbodyResolvers[recursiveItm].bind(this)(this._transactionList[ig][it], ig, it)) {
						
						return false;
					}
				}
			}
		}
		
		return true;
	}
	
   /**
    * _modifySearchCheck를 사용하여 조회 시 데이터셋 변동여부를 체크한다
	*
    * @private
	* @method
	* @name TransactionManager#_modifySearchCheck
	* @return 검증 결과값 {true|false}
    */
	_modifySearchCheck(tx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _setting = tx.setting;
		
		var _dataset      = _setting.dataset;
		var _modifySearch = _setting.modifySearch;
		var _mode         = _setting.mode;
		
		//- 그룹을 순회하면서 모든 트랜잭션 처리할 데이터셋을 검증한다.
		var grp, txm;
		var _setting, _mode, _modifySearch, _dataset;
		
		var _message, _messageTable = clib.getMessageTable();
		
		var Ltxs = this._transactionList;
		
		for(var ng in Ltxs) {
			
			grp = Ltxs[ng];
			
			//- 트랜잭션 리스트를 순회하면서 데이터셋을 검증한다.
			for(var nx in grp) {
				
				txm = grp[nx];
				
				_setting      = txm.setting;
				_mode         = _setting.mode;
				_dataset      = _setting.dataset;
				_modifySearch = _setting.modifySearch;
				
				//- 출력 값일 경우 검증에 참여 한다.
				if(this._isOutputMode(_mode)){
					
					if(_modifySearch){
						
						if(form.gfn_datasetIsUpdated(_dataset)){
							
							var _message = clib.getMessagePopup();
							
							_message(_messageTable['existChangedData']);
						}
					}
				}
			}
		}
		
		return true;
	}
	
	/**
	 * 각 트랜잭션 객체를 처리전 검증하기 위한 처리기 등록
	 *
	 * @private
	 * @method
	 * @name TransactionManager#_validateHandler
	 */
	_validateHandler(tx, group, idx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _setting = tx.setting;
		
		var _dataset = _setting.dataset;
		
		//- 검증을 실시 한다.
		//- 검증은 두 가지 방법을 통하여 하게 되며 모두 통과 하여아만 
		//- 다음의 프로세스를 실행할수 있다.
		//- 1. verificateNexacro를 통한 데이터셋 시스템 검증
		//- 2. verificationNexacro를 통한 데이터셋 사용자 직접 검증
		if( !this._verificateNexacro(tx) || !this._verificationNexacro(tx) ) {
			
			this.handle(null, {code : -32010, message : 'failed validate check on [Dataset]'});
			
			return false;
		}		
		
		return true;
	}
	
	
	/**
	 * 시스템 벨리데이터를 실행하여 넥사크로 데이터셋을 검증을 실시 한다.
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_verificateNexacro
	 */
	_verificateNexacro(tx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _setting = tx.setting;
		
		var _mode, 
			_type,
			_dataset, 
			_validate;
			
		//- 트랜잭션 타입 검증
		_mode     = _setting.mode;
		_type     = _setting.type;
		_dataset  = _setting.dataset;
		_validate = _setting.validate;
		
		//- validate가 존재하지 않을 경우 검증을 통과한다.
		if (olib.sfw_isEmpty(_validate)) {
			
			return true;
		}
		
		//- validate의 기본 처리는 입력값에 관한 것이므로
		//- 입력 값에 대한 데이터셋 처리를 선처리 한다.
		if(this._isInputMode(_mode)) {
			
			//- 검증기를 실행한다.
			if ( !clib.validateDataset(_dataset, _validate, _type) ) {
				
				return false;
			}
		}
		
		//- 파라미터 검증을 처리한다.
		var _params = _setting.params;
		
		//- 파라미터가 없을 경우 즉시 [참-true]반환
		if ( olib.sfw_isEmpty(_params)) {
			
			return true;
		}
		
		var Larguments, _types, _type, _message, _on, val, ci, _code;
		
		//- 파라미터를 순회하면서 검증기 실행
		for ( var itm in _params ) {
			
			val = _params[itm];
			
			if(olib.sfw_isFunction(val)) {
				
				val = val.call(form);
			}
			
			//- 벨리데이트 값을 가져 온다.
			ci = _validate[itm];
			
			//- 처리기 옵션이 있을 경우 처리
			if (olib.sfw_isEmpty(ci)) { 
				continue; 
			}
			
			_types   = (ci.type||'').split(',');
			_message = ci.message;
			_code    = ci.code;
			_on      = ci.on;
			
			//- 타입을 순회하면서 검증기를 처리한다.
			for(var _vitem in _types) {
				
				_type = _types[_vitem];
				
				Larguments = [ _type, val, _code||null ];
				
				//- [ ON ]속성이 있을 경우 처리
				if(_on) {
					
					Larguments.push(clib.focusOn(_on));
				} else {
				
					Larguments.push(function __focusOn() { });
				}
				
				//- 메시지가 배열일 경우 처리
				if(olib.sfw_isArray(_message)) {
					
					Larguments.push(_message);
				} else {
					
					Larguments.push([_message]);
				}
				
				//- 검증 값을 확인하여 처리
				if(!clib.validate.apply(clib, Larguments)) {
					return false;
				}
			}
		}
		
		return true;
	}
	
	/**
	 * 사용자 벨리데이터를 실행하여 넥사크로 데이터셋을 검증을 실시 한다.
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_verificateNexacro
	 */
	_verificationNexacro(tx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _setting   = tx.setting
		var validator   = null;
		var _validator  = _setting.validator;
		var _validators = null;
		var _params    = _setting.params;
		var _dataset   = _setting.dataset;
		
		//- 벨리데이터를 등록 하지 않을 경우 패스
		if ( olib.sfw_isEmpty(_validator) ) {
			
			return true;
		}
		
		//- 복합 검증을 위하여 처리
		if(olib.sfw_isArray(_validator))
		{
			_validators = _validator;
		}
		else
		{
			_validators = [_validator];
		}
		
		var bResult = true;
		
		//- 검증기를 통합 실시 한다.
		for(var ev in _validators)
		{
			validator = _validators[ev];
			
			if(validator.length <= 2) 
			{
				//- validate check
				bResult = validator.call(form, _params, _dataset);
				
				//- 경과값이 없을 경우 [참-true] 으로 처리
				if(olib.sfw_isEmpty(bResult)) 
				{
					continue;
				}
				
				//- 반환 값을 등록하지 않는 경우 [ TRUE ] 반환
				if(!bResult)
				{
					return false;
				}
				
			} 
			else 
			{
				//- 반복문을 돌면서 행의 결과값을 처리
				var _rowData;
				var rowType;
				
				//- loop for row count
				$lrow: for(var e1 = 0 ; e1 < _dataset.getRowCount() ; e1++) {
					
					//- get Row Type
					rowType = _dataset.getRowType(e1);
					
					//- reset row dataset
					_rowData = { rowType : rowType }
					
					//- loop for column Count
					$lcol: for(var e2 = 0 ; e2 < _dataset.getColCount() ; e2++) {
						
						//- Make Row-Data(s)
						_rowData[_dataset.getColID(e2)] = _dataset.getColumn(e1, e2);
					}
					
					//- validate check
					bResult = validator.call(form, _params, _dataset, _rowData);
					
					//- 반환 값을 등록하지 않는 경우 [ TRUE ] 반환
					if(olib.sfw_isEmpty(bResult)) continue;
					
					//- brake row loop
					if(!bResult) 
					{
						break $lrow;
					}
				}
			}
			
			//- 반환값이 [[false]]일 경우 검증 실패
			if(!bResult)
			{
				return false;
			}
		}
		
		return true;
	}
   
	/**
	 * 속성값 sql에 대응할 리졸버를 등록
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_sqlResolver
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 */
	_sqlResolver(tx, group, idx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _setting = tx.setting;
		
		//- get Transaction Binder Dataset
		var _transactionalDataset = tx.getDatasetWithName(_setting.dataset);
		
		//- get Transaction Binder Query
		var _sql = _setting.sql;
		
		//- [sql] 또는 [dataset] 속성에 대응 되지 않을 경우 즉시 반환
		if (olib.sfw_isEmpty(_transactionalDataset) || olib.sfw_isEmpty(_sql)) {
			
			return true;;
		}
		
		//- find meta dataset
		//- Transaction Definition Dataset
		var _dataset = this._transactionDataset['__TDD__'];
		
		//- aggregate transaction attribute
		var sDatasetID   = tx.getDatasetId();
		var sDatasetName = tx.getDatasetName();
		var sTxMode        = _setting.mode;
		var sTxType        = _setting.type;
		var sTxOrder       = _setting.order;
		var sTxExecute     = _setting.execute;
		var sTxExecute     = _setting.group;
		
		//- aggregate sql attributes
		var oSql           = _setting.sql;
		var sSqlType       = oSql['type'];
		var sSqlQuery      = oSql['query'];
		var sSqlMapper     = oSql['mapper'];
		var sSqlProcedure  = oSql['procedure'];
		var sSqlService    = oSql['service'];
		var sSqlChunk      = oSql['chunk'];
		var sSqlMethod     = oSql['method'];
		var sSqlInsert     = oSql['ins'];
		var sSqlUpdate     = oSql['upd'];
		var sSqlDelete     = oSql['del'];
		var sSqlNormal     = oSql['nor'];
		var sSqlPrefix     = oSql['prefix'];
		var sSqlSuffix     = oSql['suffix'];
		
		//- dataset definition setup
		//- level1 and level2 < mata(_) >
		var dRow = _dataset.addRow();
		
		//- level 1 meta root > transaction definition
		_dataset.setColumn(dRow, 'id'         , sDatasetID    );
		_dataset.setColumn(dRow, 'dataset'    , sDatasetName  );
		_dataset.setColumn(dRow, 'mode'       , sTxMode       );
		_dataset.setColumn(dRow, 'type'       , sTxType       );
		_dataset.setColumn(dRow, 'order'      , sTxOrder      );
		_dataset.setColumn(dRow, 'execute'    , sTxExecute    );
		_dataset.setColumn(dRow, 'group'      , group         );
		
		//- level 2 meta _ > sql transaction definition
		_dataset.setColumn(dRow, '_type'      , sSqlType      );
		_dataset.setColumn(dRow, '_query'     , sSqlQuery     );
		_dataset.setColumn(dRow, '_mapper'    , sSqlMapper    );
		_dataset.setColumn(dRow, '_procedure' , sSqlProcedure );
		_dataset.setColumn(dRow, '_service'   , sSqlService   );
		_dataset.setColumn(dRow, '_method'    , sSqlMethod    );
		_dataset.setColumn(dRow, '_chunk'     , sSqlChunk     );
		_dataset.setColumn(dRow, '_prefix'    , sSqlPrefix    );
		_dataset.setColumn(dRow, '_suffix'    , sSqlSuffix    );
		
		//- level 2 sub mata _ sql type
		_dataset.setColumn(dRow, '_insert'    , sSqlInsert    );
		_dataset.setColumn(dRow, '_update'    , sSqlUpdate    );
		_dataset.setColumn(dRow, '_delete'    , sSqlDelete    );
		_dataset.setColumn(dRow, '_normal'    , sSqlNormal    );
		
		return true;
	}
   
	/**
	 * 속성값 bind에 대응할 리졸버를 등록
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_bindResolver
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 * @example bind : [ ['COL1', [ 'BIND1', 'BIND2' ] ] ]
	 */
	_bindResolver(tx, group, idx) {
      
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- get bind attribute
		var _setting = tx.setting;
		var _binds = _setting.bind;
		
		//- _bind 속성에 대응 되지 않을 경우 즉시 반환
		if (olib.sfw_isEmpty(_binds)) {
			
			return true;;
		}
		
		//- find meta dataset
		var _dataset = this._transactionDataset['__TBD__'];
		
		//- Transaction Binder Dataset
		var _datasetId = tx.getDatasetId();
		
		//- Setting bind(s) declare and complite
		var _bind;
		
		var nRow = -1;
		
		for ( var _bid in _binds ) {
			
			_bind = _binds[_bid];
			
			//- 배열로 등록할 경우 ['바인드 컬럼', ['매핑 컬럼(1)', '매핑 컬럼(2)']]
			if (olib.sfw_isArray(_bind)) {
				
				for ( var _ibx in _bind) {
					
					nRow = _dataset.addRow();
					
					_dataset.setColumn(nRow, 'id'     , _datasetId  );
					_dataset.setColumn(nRow, 'column' , _bid        );
					_dataset.setColumn(nRow, 'bind'   , _bind[_ibx] );
				}
			} else {
				
				nRow = _dataset.addRow();
				
				_dataset.setColumn(nRow, 'id'     , _datasetId );
				_dataset.setColumn(nRow, 'column' , _bid       );
				_dataset.setColumn(nRow, 'bind'   , _bind      );
			}
		}
		
		return true;
	}
   
	/**
	 * 속성값 aliase에 대응할 리졸버를 등록
	 * 
	 * @private 
	 * @method
	 * @name TransactionManager#_aliaseResolver
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 * @example aliase : ['A', 'B', 'C']
	 */
	_aliaseResolver(tx, group, idx) {
		
		//- library matching 
		var olib = this.olib;
		
		//- dataset manager matching
		var _dsm = this.dsm;
		
		//- get transaction id and name
		var _datasetName = tx.getDatasetName();
		var _datasetId   = tx.getDatasetId();
		
		//- 데이터셋 저장소를사용하여 데이터셋 설정을 조회한다.
		var datasetManaged = _dsm.selectOne(_datasetName);
		var aliase = datasetManaged.aliase;
		
		//- aliase 속성에 대응 되지 않을 경우 즉시 반환
		if (olib.sfw_isEmpty(aliase)) {
			
			return true;;
		}
		
		//- regist dataset metadata
		var _dataset = this._transactionDataset['__TAD__'];
		
		var nRow = -1;
		
		for ( var e in aliase ) {
			
			nRow = _dataset.addRow();
			
			_dataset.setColumn(nRow, 'id'     , _datasetId );
			_dataset.setColumn(nRow, 'aliase' , aliase[e]  );
		}
		
		return true;
	}
   
	/**
	 * 속성값 join에 대응할 리졸버를 등록
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_joinResolver
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 */
	_joinResolver(tx, group, idx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- join 속성에 대응 되지 않을 경우 즉시 반환
		if (olib.sfw_isEmpty(tx.setting.join) || olib.sfw_isEmpty(tx.setting.join.dataset)) {
			
			return true;;
		}
		
		//- get basic transaction attributes
		var _join        = tx.setting.join;
		var _datasetId   = tx.getDatasetId();
		
		//- get join attributes
		var _joinOn        = _join.on;
		var _joinPoint     = _join.point;
		var _joinMode      = _join.mode;
		var _joinDataset   = tx.getDatasetWithName( _join.dataset );
		var _joinType      = tx.setting.type;
		
		var _joinTxo       = this._lookupTransaction( _joinDataset , _joinMode );
		
		//- join transcation object가 존재 하지 않을 경우 즉시 취소
		if(olib.sfw_isEmpty(_joinTxo)) return true;
		
		var _joinDatasetId = _joinTxo.getDatasetId();
		
		var _pointUpper    = null;
		var _splitedJoin   = null;
		
		//- 배열로 지정하지 않을 경우 에러 처리
		if ( !olib.sfw_isArray(_joinOn) ) {
			
			return trace('Exceptionb : join-on is only support array type - [ [ column, column ], [ column, column ] ]');
		}
		
		//- 조인 포인트가 행 단위 처리 
		//- [ row ] 일 경우 행을 뒤에 붙여 주도록 한다.
		//- 예) row:1
		_pointUpper = olib.sfw_toUpper(_joinPoint);
		
		if ( _pointUpper.split(':').length == 1 ) {
			
			if ( _pointUpper == 'R' || _pointUpper == 'ROW' ) {
				
				//- 입력 값일 경우 입력 데이터셋의 전송 행을 조회
				if(this._isInputMode(_joinMode)) {
					
					_joinPoint += ( ':' + olib.sfw_nowRowPosition(_joinDataset, _joinType) );
				} else {
					
					_joinPoint += ( ':' + olib.sfw_nowRowPosition(_joinDataset, 'S') );
				}
			}
		} else if ( _pointUpper.split(':').length == 2 ) {
			_splitedJoin = _pointUpper.split(':');
			
			_joinPoint = _splitedJoinpint[0] + ':'+ (nexacro.toNumber(_splitedJoinpint[1])-1)
		}
		
		var _dataset = this._transactionDataset['__TJD__'];
		
		//- on포인트를 순환하면서 트랜잭션 전송 데이터셋에 등록
		var _joinColumns,
			_sColumn1, 
			_sColumn2;
		
		var nRow = -1;
		
		for ( var e in _joinOn ) {
			
			_joinColumns = _joinOn[e];
			
			//- 빈값으로 등록 될 경우
			if ( olib.sfw_isEmpty(_joinColumns) ) {
				
				continue;
			}
			
			//- 단일 값으로 등록 될 경우 
			//- 단일값을 이중값으로 복사 [A] -> [A,A]
			if ( _joinColumns.length == 1 ) {
				
				_joinColumns.push(_joinColumns[0]);
			}
			
			_sColumn1 = _joinColumns[0];
			_sColumn2 = _joinColumns[1];
			
			//- 전송 데이터셋에 등록
			nRow = _dataset.addRow();
			
			_dataset.setColumn( nRow, 'idA'     , _datasetId     );
			_dataset.setColumn( nRow, 'idB'     , _joinDatasetId );
			_dataset.setColumn( nRow, 'columnA' , _sColumn1      );
			_dataset.setColumn( nRow, 'columnB' , _sColumn2      );
			_dataset.setColumn( nRow, 'point'   , _joinPoint     );
		}
		
		return true;
	}
	
	/**
	 * 속성값 params에 대응할 리졸버를 등록
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_parameterResolver
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 */
	_parameterResolver(tx, group, idx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		var _params = tx.setting.params;
		
		//- params 속성에 대응 되지 않을 경우 즉시 반환
		if ( olib.sfw_isEmpty(_params) ) {
			
			return true;;
		}
		
		var _dataset   = this._transactionDataset['__TPD__'];
		var _datasetId = tx.getDatasetId();
		var _value, _type;
		
		var nRow = -1;
		
		//- 파라미터 객체를 순환하면서 트랜잭션 전송 데이터셋에 등록
		for ( var _key in _params ) {
			
			nRow = _dataset.addRow();
			
			_value = _params[_key];
			
			//- 값을 함수로 처리 할 경우
			if(olib.sfw_isFunction(_value))
			{
				_value = _value.call(form);
			}
			//- 배열 값을 등록 할 경우 JSON 배열 문장으로 치환한다.
			if(olib.sfw_isArray(_value))
			{
				_value = JSON.stringify(_value);
				
				_type = 'list';
			}
			//- 데이터셋을 등록 할 경우 JSON 문장으로 치환한다.
			else if(_value instanceof nexacro.Dataset)
			{
				_value = clib.datasetToJson(_value);
				
				_type = 'list';
			}
			//- 객체 값으로 등록 할 경우 JSON 문장으로 치환한다.
			else if(olib.sfw_isObject(_value))
			{
				_value = JSON.stringify(_value);
				
				_type = 'map';
			}
			//- 그 외의 값을 일반 값으로 처리
			else
			{
				_value = _value;
				
				_type = 'string';
			}
			
			_dataset.setColumn( nRow, 'id'     , _datasetId );
			_dataset.setColumn( nRow, 'key'    , _key       );
			_dataset.setColumn( nRow, 'value'  , _value     );
			_dataset.setColumn( nRow, 'type'   , _type      );
		}
		
		return true;
	}
	
	/**
	 * 입력(input) 출력(output)을 처리할 리졸버를 등록
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_datasetInputOutputResolver
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 */
	_datasetInputOutputResolver(tx, group, idx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- get transaction setting 
		var _setting = tx.setting;
		
		var _mode = _setting.mode;
		var _type = _setting.type;
		var _datasetName = tx.getDatasetName();
		var _name = _setting.name || _datasetName;
		
		//- when output dataset be (server to client)
		//- format ([ ]DATASET=DATASET )
		if ( this._isOutputMode(_mode) ) {
		
			this.setting.output += ' '.concat(_datasetName).concat('=').concat(_datasetName);
		}
		
		//- when input dataset be (client to server)
		//- format ([ ]DATASET=DATASET:TYPE )
		if ( this._isInputMode(_mode) ) {
		
			this.setting.input += ' '.concat(_datasetName).concat('=').concat(_datasetName).concat(':').concat(_type);
		}
		
		return true;
	}
	
	/**
	 * 속성값 row에 대응할 리졸버를 등록
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_rowpositionHandler
	 * @example aliase : ['A', 'B', 'C']
	 * @param {object} tx transaction object
	 * @param {number} group group index
	 * @param {number} idx transaction index
	 * @return {boolean} 실행 결과 {true|false}
	 */
	_rowpositionHandler(tx, group, idx) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- 인자값을 활용하여 기본 정보 확인
		var _setting = tx.setting;
		
		var _row     = _setting.row;
		var _dataset = _setting.dataset;
		var _mode    = _setting.mode
		
		//- params 속성에 대응 되지 않을 경우 즉시 반환
		if (olib.sfw_isEmpty(_row)) {
			
			return true;
		}
		
		//- [Expression]이 이미 등록 된 경우 
		//- 등록 된 [Expression]을 사용
		//- 등록 되어 있지 않을 경우 [cols]를 사용하여 [Expression]을 생성하여 등록
		var _cols, _expr, _rowpos;
		
		if ( !olib.sfw_isEmpty(_row.expr) ) {
		
			//- 입력 된 [expression]을 rows에 등록한다.
			this._info.rows.push ( { dataset : _dataset, 
										expr : _row.expr, 
										mode : _mode } );
		} else {
			
			//- [cols]를 사용하여 [expression]을 생성한다.
			if( !olib.sfw_isEmpty(_row.cols) ) {
				
				_cols   = _row.cols;
				_expr   = '1 == 1 ';
				_rowpos = _dataset.rowposition;
				
				//- cols를 순회 하면서 [Expression]을 생성 한다.
				for ( var itm in _cols ) {
					
					_expr += ( ' && ' + _cols[itm] + ' == "'+_dataset.getColumn(_rowpos, _cols[itm])+'"' );
				}
				
				//- 생성 된 [expression]을 rows에 등록한다.
				this._info.rows.push ( { dataset : _dataset, 
											expr : _expr,  
											mode : _mode } );
			}
		}
		
		//- 데이터셋의 이중 이벤트를 죽이고 시작
		if(this._isOutputMode(_mode)) {
			//- __로 원 정보 캐싱
			_dataset.__enableevent = _dataset.enableevent;
			
			_dataset.set_enableevent ( false );
		}
		
		return true;
	}
   
   /**
    * 주 처리를 실행한 다음 처리를 실행한다.
	*
	* @private
	* @method
	* @name TransactionManager#_afterProcessing
	* @return {boolean} 실행 결과 {true|false}
    */
	_afterProcessing() {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
      
		var _header     = this.setting.header;
		var _type       = this.setting.type;
		var _baseUrl    = this.setting.baseUrl;
		var _url        = this.setting.url;
		
		this.setting.url = _baseUrl + _url;
      
		//- header setting
		for ( var _hid in _header ) {
			
			nexacro.setHTTPHeaderVariable( _hid, _header[_hid] );
		}
		
		//- update Service Url 
		//- if nexacro, update CALL_TYPE to nexacro
		if ( _type == 'nexacro' ) {
			
			this.setting.url += '?Platform=nexacro';
		}
		
		//- if not exists a transaction unique handler, 
		//- will do registration that handler
		if( olib.sfw_isEmpty( form[this._transactionAggregateCallback] ) ){
			
			form[this._transactionAggregateCallback] = this.callbackBridge;
		}
		
		//- status update READY
		this._info.status = 'READY';
		
		return true;
	}
	
   /**
    * 데이터셋과 모드를 사용하여 트랜잭션 객체를 반환한다.
	*
	* @private
	* @method
	* @name TransactionManager#_lookupTransaction
	* @param {object} dataset dataset 객체
	* @param {string} mode dataset mode(o,i..) 타입
	* @return {object} Transaction Object
    */
	_lookupTransaction(dataset, mode) {
		
		return this.transactionSet[dataset.name + '@@' + mode];
	}
   
   
   /**
    * 트랜잭션이 종료 될 경우 초기화 처리 함수
	*
	* @public
	* @method
	* @name TransactionManager#reset
    */
	reset() {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.olib;
		
		var info = this._info;
		var repo = this.repo;
		
		//- info가 생성 되기 전이라면 하단부 저장소 삭제와
		//- 데이터셋 초기화를 하지 않아도 되므로
		//- 현재 상태에서 즉시 반환한다.
		if(olib.sfw_isEmpty(info)) {
			
			return;
		}
		
		//- 기존에 처리 중인 job을 제거한다.
		if(!olib.sfw_isEmpty(info.job)) {
			
			info.job.stop();
				
			delete this._info.job;
		}
		
		var esid = info.serviceId;
		
		//- 재 사용 가능 객체일 경우 JOB만 초기화
		//- 그 외의 경우 전체 초기화
		if(!info.reuse) {
			
			//- 트랜잭션 정상 종료 처리
			this._info.closed = true;
			
			//- 전역 저장소를 불러와 트랜잭션 정보를 삭제 단계에 들어 간다.
			var staticRepo = repo.getStaticRepository();
			
			staticRepo.del(esid);
			
			//- 화면에 등록 된 트랜잭션 데이터 셋 아이디를 확인하여 제거 한다.
			var oTxd = null;
			var oTxdName = null;
			
			//- 재사용 불가능 함수 일 경우 트랜잭션 데이터셋 초기화
			for(var sTxid in this._transactionDataset) {
				
				//- 트랜잭션 데이터셋 객체를 확인하여 화면에서 제거
				oTxd = this._transactionDataset[sTxid];
				
				oTxdName = oTxd.name;
				
				form.removeChild(oTxdName);
				
				//- 트랜잭션 매니져 캐시에도 제거
				delete this._transactionDataset[sTxid];
			}
		}
	}
	

	/**
	 * 트랜잭션 검증을 실행하여 넥사크로 트랜잭션과 관련된 검증을 실시 한다.
	 * 
	 * @private
	 * @method
	 * @name TransactionManager#_verificateNexacro
	 * @return {boolean} 실행 결과 {true|false}
	 */
	_verificateTransaction () {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- 그룹을 순회하면서 모든 트랜잭션 처리할 데이터셋을 검증한다.
		var grp, txm;
		var _setting, _mode, _type, _dataset, _quiet;
		
		var Ltxs = this._transactionList;
		
		//- 업데이트 검증값을 위한 변수 선언
		var sCountExpression = "(this.getRowType(rowidx)==2 || this.getRowType(rowidx)==4)";
		var nUpdateCount = 0;
		var nUpdateDatasetCount = 0;
		var nSearchDatasetCount = 0;
		
		for(var ng in Ltxs) {
			
			grp = Ltxs[ng];
			
			//- 트랜잭션 리스트를 순회하면서 데이터셋을 검증한다.
			for(var nx in grp) {
				
				txm = grp[nx];
				
				_setting = txm.setting;
				_mode    = _setting.mode;
				_type    = _setting.type;
				_dataset = _setting.dataset;
				_quiet   = _setting.quiet;
				
				//- 출력값을 검증대상에서 벗어 나므로 넘어 가도록 한다.
				//- 수정 된 항목에 관하여 처리
				if(this._isOutputMode(_mode)) {
					
					nSearchDatasetCount += 1;
					continue;
				}
				
				//- 업데이트 타입에 따른 컬럼 카운트 처리
				if(_type == 'A' || _type == 'ALL') {
					
					nUpdateDatasetCount += ( _dataset.getRowCount() == 0 ) ? 0 : 1;
					nUpdateCount += _dataset.getRowCount();
					nUpdateCount += _dataset.getDeletedRowCount();
				} else {
					
					nUpdateDatasetCount += 1;
					nUpdateCount += _dataset.getCaseCountNF(sCountExpression);
					nUpdateCount += _dataset.getDeletedRowCount();
				}
			}
		}
		
		//- 업데이트 숫자를 등록한다.
		this.setting.updateCount = nUpdateCount;
		
		//- 업데이트가 포함 된 트랜잭션일 경우 수정 여부를 확인한다.
		//- @TODO 검색 후 수정과 같은 복합 트랜잭션 처리일 경우 검증 작업이 추가로 되어야 함
		//- 예 ) select (A) to update (A)와 같이 클라이언트 값이 아닌 서버 값을 사용하여 업데이트를 처리할 경우
		//-      현제의 벨리데이터로는 처리할수 없도록 되어 처리
		//-      * [[ quiet ]] 를 추가하여 데이터 처리를 하지 않도록 함
		if( /* nSearchDatasetCount == 0 &&  */ !_quiet && ( nUpdateDatasetCount > 0 && nUpdateCount == 0 ) ) {
			
			var _message = clib.getMessagePopup();
			var _messageTable = clib.getMessageTable();
			
			_message(_messageTable['noupdate']);
			
			return false;
		} else {
			
			return true;
		}
	}
   
   
   /**
    * 실행 준비가 모두 완료 된 경우 처리
	*
    * @private
	* @method
	* @name TransactionManager#_onReady
    */
	_onReady (attr) {
		
		//- library matching 
		var clib = this.clib;
		var olib = this.olib;
		var form = this.form;
		
		//- if regist ready function
		if(this.setting.onReady) {
			
			//- function call
			if(olib.sfw_isFunction(this.setting.onReady)) 
			{
				return this.setting.onReady.call(form, this.setting);
			} 
			//- if string type function
			else if(olib.sfw_isString(this.setting.onReady)) 
			{
				if(!olib.sfw_isEmpty(form[this.setting.onReady])) 
				{
					//- call function
					return form[this.setting.onReady](this.setting);
				}
			}
		}
		
		return true;
	}
	
   /**
    * 시스템 에러 메시지 처리
	*
    * @private
	* @method
	* @name TransactionManager#_onSystemErrorCallback
	* @param {string} error_code error code
	* @param {string} error_message error message
    */
   _onSystemErrorCallback (error_code, error_message) {
		
		var clib = this.clib;
		var form = this.olib;
      
		var _messageHandler = clib.getMessagePopup();
		
		//- 에러 발생 시 처리
		//- 세션에러 코드 'E0001'
		if (nexacro.getApplication().GBL_SESSONCHK == "E0001") 
		{
			form.gfn_ErrorProcess(error_code, error_message);
		} 
		else 
		{
			_messageHandler("SERVERMSG", error_message);
		}
	}
	
   /**
    * 입력 타입인지 확인한다.
	* 
	* @private
	* @method
	* @name TransactionManager#_isInputMode
    */
	_isInputMode (mode) {
	
		//- library matching 
		var olib = this.olib;
		
		var sToUpperMode = olib.sfw_toUpper(mode);
		
		return ( sToUpperMode == 'I' || sToUpperMode == 'IN' || sToUpperMode == 'INPUT' );
	}
	
   /**
    * 출력 타입인지 확인한다.
	*
    * @private
	* @method
	* @name TransactionManager#_isOutputMode
    */
	_isOutputMode (mode) {
			
		//- library matching 
		var olib = this.olib;
		
		var sToUpperMode = olib.sfw_toUpper(mode);
		
		return ( sToUpperMode == 'O' || sToUpperMode == 'OUT' || sToUpperMode == 'OUTPUT' );
	}
	
   /**
    * 초기화 처리를 실행한다.
	*
    * @public
	* @method
	* @name TransactionManager#_clearDataset
	* @param {object} attr 트랜잭션 정보를 가진 이벤트 객체 
    */
	_clearDataset (input, output) {
		
		//- library matching
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var _mode;
		var _dataset;
		var _excludeDataset = [];
		var _includeDataset = [];
		var transactionGroup = this._transactionList;
		var transactionLists = null;
		var transaction;
		
		for(var groupID in transactionGroup) {
			
			transactionLists = transactionGroup[groupID];
			
			//- order arrange
			transactionLists.sort(function(e,f) {
				return e.setting.order - f.setting.order;
			})
			
			for(var transactionID in transactionLists) 
			{	
				transaction = transactionLists[transactionID];
				
				_mode = transaction.setting.mode;
				
				_dataset = transaction.setting.dataset;
				
				if(_excludeDataset.indexOf(_dataset) > -1) continue;
				
				//- 입력일 경우 [include]에 등록한다.
				if(this._isInputMode(_mode)) {
					
					if(_includeDataset.indexOf(_dataset) == -1){
						
						_includeDataset.push(_dataset);
					}
					
					continue;
				}
				
				//- 출력일 경우 확인 후 [exclude]에 등록한다.
				if(this._isOutputMode(_mode)) {
					
					//- [include] 모드로 등록 되어 있지 않을 경우 등록한다.
					//- [include] -> [exclude]는 불가능
					//- 즉 입력 > 조회 시에는 초기화 하지 않는다.
					//- 조회 > 입력 또는 단독 조회 시에만 초기화 한다.
					if(_includeDataset.indexOf(_dataset) == -1){
						
						_excludeDataset.push(_dataset);
					}
				};
			}
		}
		
		//- [exclude]를 대상으로 초기화 처리를 진행한다.
		for(var e in _excludeDataset) {
			
			if(_excludeDataset[e]) {
				
				_excludeDataset[e].clearData();
			}
		}
	}
   
   /**
    * 트랜잭션을 실행한다.
	*
    * @public
	* @method
	* @name TransactionManager#call
	* @param {object} attr 트랜잭션 정보를 가진 이벤트 객체 
    */
	call (attr) {
		
		//- library matching 
		var form  = this.form;
		var _obj  = this.setting;
		
		var _that = this;
		var _info = this._info;
		
		//- add rout middle ware
		nexacro.route.middle(_obj);

		//- Lazy Execute 를 처리 하는 후 처리 함수를 생성
		if(attr.lazy) {
			
			var _lazyFunction = (function() {
				
				//- reset dataset
				this._clearDataset();
				
				//- lazy 함수의 경우 실제 실행 시 메시지 처리를 다시 한번 처리 한다.
				this._messageNegotiator(_obj);
				
				//- status update RUNNING
				_info.status = 'RUNNING';
				
				form.transaction ( this, 
								_obj.url, 
								_obj.input, 
								_obj.output, 
								_obj.data, 
								_obj._callback, 
								_obj.async, 
								_obj.dataType, 
								false);
			}).bind(this);
			
			return _lazyFunction;
		} else if(attr.promise) {
			
			//- 프로미스의 경우 프로미스 객체를 반환하여 처리
			return new Promise(function(resolve, reject) {
				
				//- reset dataset
				_that._clearDataset();
				
				//- status update RUNNING
				_info.status = 'RUNNING';
				
				//- 처리 함수를 등록 한 다음 트랜잭션을 실행한다.
				_info.resolve = resolve;
				_info.reject  = reject;
				
				//- 후 처리는 bridge callback 에서 처리한다.
				form.transaction ( _that, 
								_obj.url, 
								_obj.input, 
								_obj.output, 
								_obj.data, 
								_obj._callback, 
								_obj.async, 
								_obj.dataType, 
								false);
				
			});
			
		} else {
			
			//- reset dataset
			this._clearDataset();
			
			//- status update RUNNING
			_info.status = 'RUNNING';
			
			form.transaction ( this,
							_obj.url, 
							_obj.input, 
							_obj.output, 
							_obj.data, 
							_obj._callback, 
							_obj.async,
							_obj.dataType, 
							false);
		}
	}
	
	
   /**
    * 콜백과 연결을 처리할 브릿지를 두어 
	* 트랜잭션과 화면의 관계를 느슨하게 풀어 해쳐 놓는다.
	*
    * @private
    * @method
	* @name TransactionManager#callbackBridge
	* @param {object} obj 트랜잭션 실행시 등록한 고유 이벤트 정보
	* @param {string} error_code error code
	* @param {string} error_message error message
    */
	callbackBridge (obj, error_code, error_message) {
		
		//- library matching 
		var olib = this;
		
		var _info = obj._info;
		var _setting = obj.setting;
		
		//- status update COMPLITE
		_info.status = 'COMPLITE';
		
		//- resolve와 reject를 확인하여 콜백 처리
		if(!this.sfw_isEmpty(_info.resolve)){
			
			//- promise를 위한 전달 객체 생성
			var arg = {
				fromObject : this,
				info       : _info,
				code       : error_code,
				message    : error_message,
			}
			
			//- error_code가 [0]보다 작을 경우 < reject >
			//- 이상일 경우 < resolve > 로 처리
			if(error_code < 0) {
				
				_info.reject(arg);
			} else {
				
				_info.resolve(arg);
			}
		}
		
		//- 핸들러를 후 처리로 사용
		obj.handle(obj, { code : error_code, message : error_message });
	}
   
   /**
    * 트랜잭션이 실패할 경우 처리하기 위한 공유 처리 함수
	* 
    * @private
	* @method
	* @name TransactionManager#handle
	* @param {object} obj 트랜잭션 이벤트 객체
	* @param {object} error error 객체
    */
	handle (obj, error) {
		
		//- library matching 
		var clib  = this.clib;
		var olib  = this.olib;
		var form  = this.olib;
		var repo  = this.repo;
		var batch = this.batch;
		
		if(olib.sfw_isEmpty(obj)) {
			
			return;
		}
		
		var _info = this._info;
		
		var _esid = this.setting.id;
		var _ecod = error.code;
		
		var _emsg = error.message;
		var _server_ecod;
		var _server_emsg;
		var _server_estat;
		
		if(_emsg === 'FAILED') {
			
			//_emsg = '서버에 연결할 수 없습니다';
		}
		
		//- handler 또는 callback 기능을 적용
		var _handler = ( this.setting.callback || this.setting.handler );
		
		//- status update SUCCESS or REJECTED
		if(_ecod < 0) {
			
			obj._info.status = 'REJECTED';
			
			try{
				
				_emsg = JSON.parse(_emsg);
				
				_emsg.error_message = _emsg.error_message || nexacro.base64Encode('접속중 에러가 발생하였습니다.');
				
				_server_ecod  = _emsg.error_code;
				_server_emsg  = nexacro.base64Decode(_emsg.error_message);
				_server_estat = _emsg.error_state;
				
				//- raise authrize error
				if(_server_estat == "501") {
					
					//- 세션 종료
					nexacro.getApplication().GBL_SESSONCHK = "E0001";
					
					return this._onSystemErrorCallback(_ecod, _server_emsg, error.data);
				}
				//- raise not found error
				else if(_server_estat == "404") {
					
				}
				
			}catch(e) {
				
				_server_ecod  = _ecod;
				_server_emsg  = _emsg;
				_server_estat = _emsg;
			}
		} else {
			
			obj._info.status = 'SUCCESS';
			
			_server_ecod  = _ecod;
			_server_emsg  = _emsg;
			_server_estat = _ecod;
		}
		
		//- 콜백 반환 데이터를 등록한다.
		var _uuobj = {
			id          : _esid,
			updateCount : this.setting.updateCount,
			sqlCode     : _server_ecod,
			sqlState    : _server_estat,
		}
		
		//- 문자열로 핸들러를 입력 할 경우 폼에 등록 된 핸들러를 검색하여 처리
		if( olib.sfw_isString(_handler) ) {
			
			var _callback = form[_handler];
			
			//- 핸들러 함수를 확인하여 처리
			if( !olib.sfw_isEmpty(_callback) ) {
				
				_callback.call(form, _uuobj, _ecod, _server_emsg, error.data);
			} else {
				
				if( _ecod < 0 ) {
					
					this._onSystemErrorCallback(_ecod, _server_emsg, error.data);
				}
			}
		} else if( olib.sfw_isFunction(_handler) ){
			
			//- 함수의 경우 사용자 함수를 실행하여 후 처리를 종료 한다.
			_handler.call(form, _uuobj, _ecod, _server_emsg, error.data);
		} else {
			
			//- 객체타입일 경우 처리
			if( olib.sfw_isObject(_handler) ) {
				
				var handlers = _handler;
				
				//- 실패할 경우 후 처리
				if( _ecod < 0 ) {
					
					//- 핸들러가 등록 된 경우 핸들러를 사용
					//- 핸들러가 존재 하지 않을 경우 시스템 에러 콜백 적용
					if( handlers.onfailed ) {
						
						handlers.onfailed.call(form, _uuobj, _ecod, _server_emsg, error.data);
							
						//- (-)1644의 경우는 사용자 에러
						//- 그 외의 경우[-1, -x]는 시스템 또는 SQL에러로써 메시지 출력
						/* @check
						if( _server_ecod == 1644 ) {
						
							handlers.onfailed.call(form, _uuobj, _ecod, _server_emsg, error.data);	
						} else {
							
							this._onSystemErrorCallback(_ecod, _server_emsg, error.data);
						}
						*/
					} else {
						
						this._onSystemErrorCallback(_ecod, _server_emsg, error.data);
					}
				} else {
					
					//- 성공할 경우 후 처리
					if( handlers.onsuccess ) {
						
						handlers.onsuccess.call(form, _uuobj, _ecod, _server_emsg, error.data);
					}
				}
			} else {
				
				if( _ecod < 0 ) {
					
					this._onSystemErrorCallback(_ecod, _server_emsg, error.data);
				}
			}
		}
		
		//- 행 처리기를 실행하여 행을 로딩한다
		if(!olib.sfw_isEmpty(_info.rows)) {
		
			var oRow = null;
			var _dataset, _enableevent, _expr, _mode, _row, _eventRowposchange, _eventOnload;
			
			for(var e in _info.rows) {
				
				oRow     = _info.rows[e];
				_dataset = oRow.dataset;
				_row     = _dataset.findRowExprNF(oRow.expr);
				
				_enableevent = _dataset.__enableevent;
				
				//- 행을 확인하여 이동 처리
				//- 이동 처리 후에는 이벤트를 강제적으로 발생하여 처리
				if(_row > -1) {
					
					_dataset.set_rowposition(_row);
					_dataset.set_enableevent(_enableevent);
				} else {
					
					_dataset.set_enableevent(_enableevent);
				}
				
				var eid = 0;
				
				while(true) {
					
					_eventRowposchange = _dataset.getEventHandler('onrowposchanged', eid);
					_eventOnload       = _dataset.getEventHandler('onload', eid);
					
					//- 기존에 -1로 지정 되어 있던
					//- 행 자동 이동 이벤트가 삭제 되어
					//- 행에 따른 분기 처리 (JHLEE-2021-07-06)
					_row = _row > -1 ? _row : _dataset.getRowCount() > 0 ? 0 : _row;
					
					//- 행 변경 이벤트 강제 호출
					if ( _eventRowposchange ) {
						
						_eventRowposchange.call(form, _dataset, {
							eventid : 'onrowposchanged',
							fromobject : _dataset,
							newrow :  _row,
							oldrow : -1,
							reason : 'force'
						});
					}
					
					//- 데이터 셋 로드 이벤트 강제 호출
					if( _eventOnload ) {
						
						_eventOnload.call(form, _dataset, {
							eventid : 'onload',
							fromobject : _dataset,
							newrow : _row,
							oldrow : -1,
							reason : 'force'
						});
					}
					
					//- 이벤트가 모두 등록 되지 않을 경우 처리
					if(!_eventOnload && !_eventOnload) {
						
						break;
					}
					
					eid = eid + 1;	
				}
			}
		}
		
		//- 백 프로세싱(배치) 실행
		var _job    = _info.job;
		var _closed = _info.closed;
		
		//- Job을 확인하여 존재 하지 않을 경우
		//- 후 처리를 담당하는 job을 생성한다
		if(!_closed && olib.sfw_isEmpty(_job)) {
			
			//- FactoryObject를 생성하여 트랜잭션 랩핑
			var _job = batch.nexaJobFactory(this);
			
			//- 정보에 job객체 등록
			_info.job = _job;
			
			//- 배치 작업에 job을 등록
			batch.addJob(_job);
		}
	}
};