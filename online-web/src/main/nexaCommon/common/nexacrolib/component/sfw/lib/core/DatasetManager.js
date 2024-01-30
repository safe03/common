/**
 * 데이터셋을 관리 하는 클래스를 선언
 * @class
 * @name DatasetManager
 */
class DatasetManager {

   /**
    * @public
    * @constructor
    * @param {Object} lib form object
    * @param {Repositories} repo repository instanace
    */
	constructor(lib, repo) {
		
		//- library matching
		this.clib = lib;
		
		var openLibrary = lib.getOpenLibrary();
		
		this.form = openLibrary;
		this.olib = openLibrary;
		
		if(!repo){
			repo = new Repositories();
		}
		
		this.repo = repo;
      
		//- 관리할 대상의 관심별로 각각의 저장소를 생성한다.
		//- dataset         : _datasetRepository
		//- aliase          : _aliasesRepository
		//- aliase mapper   : _mappersRepository
		//- dataset setting : _settingRepository
		//- save setting    : _savedRepository
		this._datasetRepository = repo.createMemory();
		this._aliasesRepository = repo.createMemory();
		this._mappersRepository = repo.createMemory();
		this._settingRepository = repo.createMemory();
		this._savedRepository   = repo.createMemory();
	}
	
   /**
    * 코어 라이브러리를 반환하는 함수
	*
    * @function getCoreLibrary
    * @public
    * @method
    * @name getCoreLibrary
    */
	getCoreLibrary() {
		
		return this.clib;
	}

   /**
    * 데이터셋 정보를 관리 모듈에 등록
    * 
    * @public
    * @method
    * @name insert
    * @param {Dataset} dataset 등록할 데이터셋 객체
    * @param {object} setting 설정값이 등록 된 객체
    * @param {array} aliase 등록할 데이터셋의 가칭
    */
   insert(dataset, setting, aliase) {
		
		//- library matching
		var olib = this.olib;
		var form = this.form;
      
		//- 문자열로 입력 된 데이터셋일 경우 데이터셋을 검증하여 처리
		if ( typeof dataset == 'string' ) {
			
			if ( form[dataset] ) {
				
				dataset = form[dataset];
			} else {
				
				trace('Exception > Not Exist Dataset [ '+ dataset + ' ]');
				
				return;
			}
		}
		
		//- 이미 등록 된 데이터셋 일 경우 즉시 반환
		if(!olib.sfw_isEmpty( this._datasetRepository.get( dataset.name ) )) {
			
			trace('Exception > Already Exist Dataset [ '+ dataset.name + ' ]');
			
			return ;
		}
      
		//- dataset name is unique in form
		this._datasetRepository.set( dataset.name, dataset );
		
		//- aliase registration
		if(olib.sfw_isEmpty(aliase)) {
			
			this._aliasesRepository.set( dataset.name, ( aliase = [] ) );
		} else {
			
			this._aliasesRepository.set( dataset.name, aliase  );
		}
		
		//- settings registration
		if(olib.sfw_isEmpty(setting)) {
			
			this._settingRepository.set( dataset.name, {} );
		} else {
			
			this._settingRepository.set( dataset.name, setting );
		}
		
		//- 명칭은 기본 가칭으로 등록
		aliase.push(dataset.name);
		
		//- 가칭 매퍼를 순회
		for ( var e, n = 0 ; n < aliase.length ; n++ ) {
			
			e = this._mappersRepository.get(aliase[n]);
			
			//- 가칭 매퍼 중복에 관한 처리
			//- 이미 등록 된 가칭 매퍼일 경우 추가 처리
			//- *동일한 가칭으로 등록이 가능
			if(olib.sfw_isEmpty(e)) {
				
				this._mappersRepository.set( aliase[n], [ dataset ] );
			} else {
				
				this._mappersRepository.get( aliase[n] ).push( dataset );
			}
		}
	}

   /**
    * 데이터셋 관리 객체에서 명칭 또는 객체를 사용하여 
    * 등록된 정보를 조회한다.
    * 
    * @public
    * @method
    * @name selectOne
    * @param {Dataset} dataset 등록할 데이터셋 객체
    * @param {object} setting 설정값이 등록 된 객체
    * @param {array} aliase 등록할 데이터셋의 가칭
    */
	selectOne(name) {
		
		var Lselected = this.select(name);
      
		return ( Lselected.length > 0 ? Lselected[0] : Lselected );
	}
   
   /**
    * 데이터셋 관리 객체에서 명칭 또는 객체를 사용하여 
    * 등록된 정보를 조회한다.
    * 
    * @public
    * @method
    * @name select
    * @param {Dataset} dataset 등록할 데이터셋 객체
    * @param {object} setting 설정값이 등록 된 객체
    * @param {array} aliase 등록할 데이터셋의 가칭
    */
	select(name) {
         
		//- library matching
		var olib = this.olib;
		var form = this.form;
		
		//- 반환될 데이터셋 정보를 초기화
		var _returnDataset = [];
      
		//- 빈값일 경우 모든 데이터셋 정보를 반환
		if(olib.sfw_isEmpty(name)) {
			
			var _dataset = null;
			var _setting = null;
			var _aliases = null;
         
			//- 전체 데이터셋을 순환하면서 각 데이터셋 설정 등록
			for (var e in this._datasetRepository.get() ){
				
				_dataset = this._datasetRepository.get(e);
				_setting = this._settingRepository[_dataset.name];
				_aliases = this._aliasesRepository[_dataset.name];
            
				_returnDataset.push({
					dataset : _dataset,
					setting : _setting,
					aliase  : _aliases,
				});
			}
			 
			return _returnDataset;
		}
      
		
		//- 데이터셋의 명칭/가칭을 사용하여 조회
		if(olib.sfw_isString(name)) {
			
			//- 명칭을 사용하여 조회
			if(this._datasetRepository.get(name)) {
				
				_returnDataset.push({
					dataset : this._datasetRepository.get(name),
					setting : this._settingRepository.get(name),
					aliase  : this._aliasesRepository.get(name),
				});
				
			} else {
				
				var _mappingDataset;
				
				//- 가칭을 사용하여 조회
				if(this._mappersRepository.get(name)) {
					
					_mappingDataset = this._mappersRepository.get(name);
					
					//- 전체 데이터셋을 순환하면서 각 데이터셋 설정 등록
					for ( var e in _mappingDataset ){
						
						_dataset = _mappingDataset[e];
						
						_setting = this._settingRepository.get(_dataset.name);
						_aliases = this._aliasesRepository.get(_dataset.name);
						
						
						_returnDataset.push({
							dataset : _dataset,
							setting : _setting,
							aliase  : _aliases,
						});
					}
				} else {
					
					_returnDataset.push({
						dataset : null,
						setting : null,
						aliase  : null,
					});
				}
			}
         
			return _returnDataset;
		} else {
			
         
			//- 데이터셋 객체를 등록 할 경우
			//- 데이터셋의 명칭을 사용하여 조회
			if(olib.sfw_isDataset(name)) {
				
				return this.select(name.name);
			} else {
				
				trace('Exception > Not Suppoted Parameter Type [ '+(typeof name)+']');
				
				return _returnDataset;
			}
		}
		
		return _returnDataset;
	}
   
   /**
    * 데이터셋 관리 객체에서 명칭 또는 객체를 사용하여 
    * 등록된 정보를 조회한다.
    * 
    * @public
    * @method
    * @name remove
    * @param {*} name 삭제할 가칭 또는 데이터셋 정보
    */
	remove(dataset) {
		
		//- library matching
		var olib = this.olib;
		var form = this.form;
		
		//- 빈값으로 등록 될 경우 [false] 반환
		if(olib.sfw_isEmpty(dataset)) {
			return false;
		}
		
		//- 데이터셋이 아닌 정보를 입력할 경우 aliase를 확인하여 
		//- 데이터셋 확인
		if(!olib.sfw_isDataset(dataset)) {
			
			var LmappingDataset = this._mappersRepository.get(dataset);
			
			for ( var e in LmappingDataset ) {
				
				this.remove(LmappingDataset[e]);
			}
			
			return true;
		}
		
		// 가칭 삭제를 위해 변수 저장
		var Laliases = this._aliasesRepository.get(dataset.name);
		
		this._datasetRepository.del( dataset.name );
		this._settingRepository.del( dataset.name );
		this._aliasesRepository.del( dataset.name );
		
		//- 가칭을 순환하면서 처리할 변수 선언
		var _syncDatasetName;
		var Laliase, LnewAliase;
		
		// 가칭을 순환하며 업데이트 처리
		for ( var e = 0 ; e < Laliases.length ; e++ ) {
			
			_syncDatasetName = Laliases[e];
			
			Laliase = this._mappersRepository.get( _syncDatasetName ) || [];
			
			LnewAliase = [];
         
			// 등록을 위한 가칭
			for ( var e2 = 0 ; e2 < Laliase.length ; e2++ ) {
				
				if(Laliase[e2] != dataset) {
					
					LnewAliase.push( Laliase[e2] );
				}
			}
			
			this._mappersRepository.set( _syncDatasetName, LnewAliase );
		}
		
		return true;
	}
};