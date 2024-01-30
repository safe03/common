/**
 * 서비스를 추상화 하는 함수
 * 
 * @class
 * @name Services
 */
class Services {
	
   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor(_form){
		
		//- create basic library and repository
		this.olib = _form;
		this.form = _form;
		
		//- basic projects [[ init ]]
		this.projects = new Projects(_form);
		
		this.clib = new CoreLibrary(_form);
		
		this.repo = new Repositories(_form);
		
		_form._ = this.clib;
		
		//- [init] Batch Processor
		this._initBatch();
		
		//- [init] Transaction Manager
		this._initDatasetManager();
	}
	
	
	/**
	 * Core-Library를 반환한다.
	 * 
	 * @public
	 * @method
	 * @name getCoreLibrary
	 * @return {object} Core Library Object
	 */
	getCoreLibrary() {
		
		return this.clib;
	}
	
	
	/**
	 * Repository를 반환한다. 
	 * 
	 * @public
	 * @method
	 * @name getRepository
	 * @return {object} Repository Object
	 */
	getRepository() {
		
		return this.repo;
	}
	
	
	/**
	 * DatasetManager를 반환한다. 
	 * 
	 * @public
	 * @method
	 * @name getDatasetManager
	 * @return {object} DatasetManager Object
	 */
	getDatasetManager() {
	
		return this.datasetManager;
	}
	
	
	/**
	 * Tranasction Manager를 초기화 처리 한다.
	 * 
	 * @private
	 * @method
	 * @name _initBatch
	 * @return {object} Repository Object
	 */
	 _initBatch() {
		
		//- library matching
		var clib = this.clib;
		var repo = this.repo;
		
		//- 백 프로세스 배치처리를 도와줄 함수를 정의한다.
		this.batch = new Batch(clib, repo);
	 }
	
	
	/**
	 * DatasetManager를 초기화 처리 한다.
	 * 
	 * @private
	 * @method
	 * @name _initDatasetManager
	 * @return {object} Repository Object
	 */
	_initDatasetManager() {
	
		//- library matching
		var clib = this.clib;
		var repo = this.repo;
		
		this.datasetManager = new DatasetManager(clib, repo);
	}
	
	
	/**
	 * Tranasction Manager를 초기화 처리 한다.
	 * 
	 * @private
	 * @method
	 * @name _initTransactionManager
	 * @return {object} Repository Object
	 */
	createTransaction() {
		
		//- library matching
		var olib           = this.olib;
		var clib           = this.clib;
		var repo           = this.repo;
		var batch          = this.batch;
		var datasetManager = this.datasetManager;
		
		//- [batch]가 등록 되지 않을 경우 배치 생성
		if(olib.sfw_isEmpty(batch)) {
			
			this._initBatch(clib, repo);
		}
		
		//- [datasetManager]가 등록 되지 않을 경우 데이터셋 매니져 생성
		if(olib.sfw_isEmpty(datasetManager)) {
			
			this._initDatasetManager(clib, repo);
		}
		
		return new TransactionManager(clib, repo, datasetManager, batch);
	}
	
	
	/**
	 * 소켓 객체을 생성하는 함수
	 *
	 * @public
	 * @method
	 * @name createSocket
	 * @return {SocketConnection} socket object
	 */
	createSocket() {
		
		//- library matching
		var olib = this.olib;
		
		return new SocketConnection(olib);
	}
	
	
	/**
	 * 소켓 객체을 생성하는 함수
	 *
	 * @public
	 * @method
	 * @name createSocket
	 * @param {Object} Setting Object
	 * @return {SocketConnection} Socket Object
	 */
	connect(setting) {
		
		return this.createSocket().connect(setting);
	}
	
	
	/**
	 * 빌더를 사용하여 사용자가 직접 사용자 빌드를 처리한다.
	 * 
	 * @method 
	 * @name builder
	 * @param {object} setting 헤더 설정 정보
	 * @return {object} Inited-TransactionManager-Object
	 */
	builder(setting) {
		
		//- library matching
		var olib = this.olib;
		
		//- 초기값이 없을 경우 빈 객체를 사용하여 기본(default) 초기화
		if(olib.sfw_isEmpty(setting)) {
			
			setting = { };
		}
		
		//- 소켓 및 트랜잭션 여부에 따라 트랜잭션 처리를 분기한다.
		//- 소켓의 경우 지속적인 연결이 되어야 하므로 리소스에 저장 후 반환하도록 처리한다.
		if(setting.type == 'stomp' || setting.type == 'socket') {
			
			return this.connect(setting);
		} else {
			
			return this.createTransaction().init(setting);
		}
	}
	
	
	/**
	 * 조회 실행을 처리한다.
	 * 
	 * @method
	 * @name search
	 * @param {object} setting 조회를 위한 설정 객체
	 */
	search(setting) {
		
		//- library matching
		var olib = this.olib;
		
		//- 빌더 생성
		var _builder = this.builder(setting);
		
		//- 바디 데이터셋 생성
		var _datasets = this._getTransactionBodyDatasets(setting, _builder);
		
		//- 트랜잭션이 등록 되지 않을 경우 즉시 반환
		if(_datasets.length == 0) return null;
		
		//- 바디 데이터셋을 순회 하면서 각 트랜잭션을 등록
		for(var e in _datasets) {
			
			//- [out]으로 변경 후 트랜잭션 처리
			if(olib.sfw_isEmpty(_datasets[e].mode)) {
				
				_datasets[e].mode = 'out';
			}
			
			_builder.add(_datasets[e]);
		}
		
		return _builder.end(setting);
	}
	
	/**
	 * 함수 실행을 처리한다.
	 * 
	 * @method
	 * @name exec
	 * @param {object} setting 조회를 위한 설정 객체
	 */
	exec(setting) {
		
		//- library matching
		var olib = this.olib;
		
		var _handler = setting.handler || setting.callback;
		
		setting.callback = (function(_this, _handler) {
			
			return function(obj, error_code, error_message) {
				
				var data    = [];
				var rowData = null;
				
				var sColid;
				
				//- 행을 순환하면서 값을 추출
				for ( var row = 0 ; row < this.__temp__.getRowCount() ; row++) {
					
					rowData = {};
					
					for ( var col = 0 ; col < this.__temp__.getColCount() ; col++) {
						
						rowData[this.__temp__.getColID(col)] = this.__temp__.getColumn(row, col);
					}
					
					data.push(rowData);
				}
				
				//- 핸들러를 조회한다.
				var _repo = _this.getRepository();
				
				var _obj = _repo.getStaticRepository().get(obj.id);
				
				var _txo = _obj.object;
				
				//- 기존 핸들러로 치환
				_txo.setting.callback = _handler;
				
				//- 신규 핸들러 실행
				_txo.handle(_txo, { code : error_code, message : error_message, data : data.length < 2 ? rowData : data });
				
				_txo.setting.callback = _handler;
			}
		})(this, _handler);
		
		//- 빌더 생성
		var _builder = this.builder(setting);
		
		_builder.add({
			dataset : '__temp__',
			sql     : setting.sql,
			params  : setting.param||setting.data,
		})
		
		return _builder.end(setting);
	}
	
	/**
	 * 저장 실행을 처리한다.
	 * 
	 * @method
	 * @name save
	 * @param {object} setting 저장을 위한 설정 객체
	 */
	save(setting) {
		
		//- library matching
		var olib = this.olib;
		var form = this.form;
		
		//- noask 임시 변수에 등록 후 제거
		//- 트랜잭션 [고유 변수]가 아닌 [서비스 변수]이기 때문에
		//- 속성값에 따른 삭제가 필요함
		var _noask = (setting.noask || false);
		var _message = (setting.message || '저장하시겠습니까?');
		
		//- 빌더 생성
		var _builder = this.builder(setting);
		
		//- 바디 데이터셋 생성
		var _datasets = this._getTransactionBodyDatasets(setting, _builder);
		
		//- 트랜잭션이 등록 되지 않을 경우 즉시 반환
		if(_datasets.length == 0) return null;
		
		//- 바디 데이터셋을 순회 하면서 각 트랜잭션을 등록
		for(var e in _datasets) {
			
			//- [in]으로 변경 후 트랜잭션 처리
			if(olib.sfw_isEmpty(_datasets[e].mode)) {
				
				_datasets[e].mode = 'in';
			}
			
			//- [in]으로 변경 후 트랜잭션 처리
			if(!olib.sfw_isEmpty(_datasets[e].join)) {
			
				if(olib.sfw_isEmpty(_datasets[e].join.mode)) {
					
					_datasets[e].join.mode = 'in';
				}
			}
			
			_builder.add(_datasets[e]);
		}
		
		//- [confirm] 여부를 확인 후 
		//- 후 처리 상태에 따라 반환값 처리
		if(!_noask) {
			
			//- lazy 함수를 사용하여 늦은 함수 처리
			setting.lazy = true;
			
			var fn_callableLazyFunction = _builder.end(setting);
			
			if(fn_callableLazyFunction.name != '__empty__') {
				
				form.gfn_Message('TMM140', [_message], function(returnValue) {
					
					fn_callableLazyFunction.call();
				});
			}
			
			return fn_callableLazyFunction;
		} else {
			
			return _builder.end(setting);
		}
	}
	
	
	/**
	 * 속성에서 트랜잭션 데이터셋을 추출한다.
	 * 
	 * @method
	 * @name save
	 * @param {object} setting 저장을 위한 설정 객체
	 * @param {object} builder 트랜잭션 객체
	 */
	_getTransactionBodyDatasets(setting, builder) {
		
		//- library matching
		var olib = this.olib;
		var form = this.form;
		
		var _setting = builder.getDefaultSetting();
		var Ldataset = [];
		
		for(var e in setting) {
			
			//- 트랜잭션 데이터와 연관 관계가 없을 경우 데이터셋 정보라고 생각함
			if(olib.sfw_isUndefined(_setting[e])) {
				
				//- 새로운 데이터셋 객체 생성 후 바인딩
				if(olib.sfw_isNull(setting[e])) {
					
					setting[e] = {};
				}
				
				setting[e].dataset = e;
				
				Ldataset.push(setting[e])
			}
		}
		
		return Ldataset;
	}
	
	/**
	 * 함수 실행을 처리한다.
	 * 
	 * @method
	 * @name call
	 * @param {object} setting 함수 실행을 위한 설정 객체
	 */
	call(setting) {
		
		return this.createTransaction()
					.init(setting)
					.add(setting)
					.end(setting);
	}
};