/**
  * 저장소를 처리할 클래스를 선언
  * @class
  * @name Repositories
  */
class Repositories {
	
	constructor(lib) {
		
		//- library matching
		this.olib = lib;
		this.form = lib;
		
		this.cacheMemory = [];
		this.cacheLocal  = [];
		
		//- 스토리지 타입을 정의
		this.type = {
			M : 'Memory' ,
			L : 'Local'  ,
			S : 'Server' ,
		};
		
		//- 로컬 스토리지의 기본 정보를 해당 속성에 귀속하여 정의한다.
		this.localStorageInterfaceAttribute = 'nexacro_repository';
		
		//- 폼영역의 전역 저장소를 해당 속성에 귀속하여 정의한다.
		this.staticStorageInterfaceAttribute = 'static_repository';
		
		// 애플리케이션 영역의 전역 저장소를 해당 속성에 귀속하여 정의한다.
		this.applicationStorageInterfaceAttribute = 'application_repository';
	}
	
   
   /**
    * 화면에서 사용 되는 화면 단위 정적 저장소를 생성 및 반환한다.
	* ( singleton on form )
    * @public
    * @method 
    * @name getStaticRepository
    */
	getStaticRepository() {
		
		//- library matching
		var form = this.form;
		var olib = this.olib;
		
		var staticRepository = form[this.staticStorageInterfaceAttribute];
		
		//- 전역 저장소가 없을경우 신규 메모리를 생성하여 반환한다.
		if (olib.sfw_isEmpty(staticRepository)) {
			
			form[this.staticStorageInterfaceAttribute] = this.createMemory();
		}
		
		return form[this.staticStorageInterfaceAttribute];
	}
	
   /**
    * 화면에서 사용 되는 화면 단위 정적 저장소를 생성 및 반환한다.
	* ( singleton on nexacro )
	*
    * @public
    * @method 
    * @name getStaticRepository
    */
	getApplicationRepository() {
		
		//- library matching	
		var form = this.form;
		var olib = this.olib;
		
		var applicationRepository = nexacro[this.applicationStorageInterfaceAttribute];
		
		//- 전역 저장소가 없을경우 신규 메모리를 생성하여 반환한다.
		if (olib.sfw_isEmpty(applicationRepository)) {
			
			nexacro[this.applicationStorageInterfaceAttribute] = this.createMemory();
		}
		
		return nexacro[this.applicationStorageInterfaceAttribute];
	}
   
   /**
    * 메모리를 사용하여 저장소를 생성 및 반환
    * @public
    * @method 
    * @name createMemory
    */
	createMemory(){
		
		//- 메모리 관리 객체를 생성하여 반환
		return this._memoryGetSet({});
	}

   /**
    * memory 사용을 위한 getter와 setter를 생성
    * @private
    * @method
    * @name _memoryGetSet
	* @return {object} has attributes { type, get, set, del, length }
    */
	_memoryGetSet(newMemory) {
      
		//- 메모리를 관리할 핸들러를 생성
		var memoryHandler = {
			type : this.type.M,
			get  : function(key) {
				
				return key ? newMemory[key] : newMemory;
			},
			set  : function(key, value) {
				
				try{
					//- 메모리 등록 전 
					//- 등록 된 값이 신규 일 경우 사이즈(length) 증가
					if(!newMemory[key]){
						this.length += 1; 
					}
					
					newMemory[key] = value;
				}catch(e) {
					return false;
				}
					
				return true;
			 },
			del  : function(key) {
				
				try {
					//- 메모리 삭제 전 등록 된 값이 기존에 
					//- 존재할 경우 사이즈(length) 증가
					//- 존재 하지 않을 경우 false를 반환
					if(newMemory[key]){
						this.length -= 1; 
					} else {
						return false;
					}
					
					delete newMemory[key];
				}catch(e) {
					return false;
				}
				
				return true;
			},
			length : 0
		}
		
		//- 통합 메모리에 등록
		this.cacheMemory.push(memoryHandler);
		
		//- 선택 메모리 반환
		return memoryHandler;
	}
	
   /**
    * 로컬 저장소(LocalStorage)의 속성값 [nexacro_repository]를 사용하여 
    * 저장소 생성 및 반환
    * @public
    * @method 
    * @name createLocal
    */
	createLocal(){
		
		//- 넥사크로 플랫폼의 함수 사용
		return this._localGetSet(nexacro.getPrivateProfile(this.localStorageInterfaceAttribute) || "{}");
	}
   

   /**
    * localStorage 사용을 위한 getter와 setter를 생성
    * @private
    * @method
    * @name _localGetSet
    */
	_localGetSet(localMemory) {
      
		//- JSON타입을 사용하여 로컬 저장소를 객체화
		var jsonNexacroLocalStorage = JSON.parse(localMemory);
		
		var interfaceLocalStorage = (function () {
			
			//- [LocalStorageInterfaceAttribute] 을 사용하여 로컬 저장소를 저장
			nexacro.setPrivateProfile(this.localStorageInterfaceAttribute, JSON.stringify( jsonNexacroLocalStorage ));
		}).bind(this);
		
		//- length 검증
		var _len = 0;
		
		for(var e in jsonNexacroLocalStorage) {
			_len++;
		}
		
		//- 로컬 저장소를 처리할 핸들러 생성
		var _localStorageHandler = {
			type : this.type.L,
			get : function(key) {
				
				return key ? jsonNexacroLocalStorage[key] : jsonNexacroLocalStorage;
			},
			reload : function() {
				
				//- 신규 로딩을 위한 고유 함수 처리
				jsonNexacroLocalStorage = JSON.parse(nexacro.getPrivateProfile(this.localStorageInterfaceAttribute) || "{}");
				
				interfaceLocalStorage();
				
				this.length = 0;
			},
			set : function(key, value) {
				
				try {
					
					//- 메모리 등록 전 
					//- 등록 된 값이 신규 일 경우 사이즈(length) 증가
					if(!jsonNexacroLocalStorage[key]){
						
						this.length += 1; 
					}
					
					jsonNexacroLocalStorage[key] = value;
					
					interfaceLocalStorage();
					
				} catch(e) {
					
					return false;
				}
				
				return true;
			},
			del : function(key) {
			
				try {
					
					//- 삭제 전 등록 된 값이 기존에 
					//- 존재할 경우 사이즈(length) 증가
					//- 존재 하지 않을 경우 false를 반환
					if(jsonNexacroLocalStorage[key]){
						this.length -= 1; 
					} else {
						return false;
					}
					
					delete jsonNexacroLocalStorage[key];
					
					interfaceLocalStorage();
					
				} catch(e) {
					
					return false;
				}
				
				return true;
			},
			length : _len
		}
		
		//- Local Nexacro Cache
		this.cacheLocal.push(_localStorageHandler);
		
		return _localStorageHandler;
	}
   
   /**
    * 서버 저장소(LocalStorage)를 사용한 저장소 생성 및 반환
    * @public
    * @method 
    * @todo 
    * @name createServer
    */
	createServer(){
		//- @TODO
	}
   
   /**
    * 저장소를 초기화 하는 메소드
    * @public
    * @method 
    * @name clear
    */
	clear(type) {
		
		var _clearStorages = [];
		
		//- 1. 타입을 지정할 경우 해당 타입에 관한 적용
		//- 2. 타입을 지정하지 않을 경우 모든 타입에 적용
		if(type) {
			
			_clearStorages.push(type);
		} else {
			
			_clearStorages.push(this.type.M);
			_clearStorages.push(this.type.L);
			_clearStorages.push(this.type.S);
		}
		
		for(var _cleanType in _clearStorages) {
			
			var _clearStorage = _clearStorages[_cleanType];
			
			switch ( _clearStorage ) {
				
				case this.type.M :
					
					//- 메모리를 순회하면서 모든 메모리를 초기화한다.
					for(var e in this.cacheMemory) {
						
						var aList = this.cacheMemory[e].get();
						
						for(var item in aList) {
							
							this.cacheMemory[e].del(item);
						}
					}
					
					this.cacheMemory.length = 0;
					
					this.cacheMemory = [];
					
				break;
				
				case this.type.L : 
					
					nexacro.setPrivateProfile(this.localStorageInterfaceAttribute, "{}");
					
					for(e in this.cacheLocal) {
					
						this.cacheLocal[e].reload();
					}
					
				break;
				
				case this.type.S : 
					
					//-@TODO 서버는 개인화 이후 작업 예정
				break;
			}
		 
		}
	  
	}
};