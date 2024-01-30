/**
 * 프로젝트들의 정보를 가지고 있는 클래스를 선언
 * @class
 * @name Projects
 **/
class Projects {
    
	/**
	 * 프로젝트들의 설정 정보를 등록 및 초기화 하는 생성자
	 * @constructor
	 */
    constructor() {
		
		//- 프로젝트s 객체에 프로젝트 info 등록
		this.Lproject = [ ];
		
		//- 모듈 고정 명칭을 매핑한다.
		//- 공유 명칭을 등록할 경우 이 속성을 사용한다.
		this.moduleName = {
			"Projects"           : "[[PROJECTS]]",
			"Project"            : "[[PROJECT]]",
			"Router"             : "[[ROUTER]]",
			"Graphics"           : "[[GRAPHICS]]",
			"Repositories"       : "[[REPOSITORIES]]",
			"DatasetManager"     : "[[DATASETMANAGER]]",
			"CoreLibrary"        : "[[CLIB]]",
			"Batch"              : "[[BATCH]]",
			"TransactionManager" : "[[TRANSACTIONMANAGER]]",
			"Services"           : "[[SERVICES]]",
			"Socket"             : "[[SOCKET]]",
		};
	};

	/**
	 * 프로젝트 정보를 반환하는 함수
	 * 
	 * @function getProjects
	 * @method
	 * @name getProjects
	 * @return {object} Project Object
	 **/
	getProject(nProject) {
		
		if(nProject == null || nProject == undefined) {
			nProject = 0;
		}
		
		return this.Lproject[nProject];
	};

	/**
	 * 프로젝트 정보를 반환하는 함수
	 * 
	 * @function getProjects
	 * @method
	 * @name getProjects
	 * @return {object} Project Object
	 **/
	setProject(project) {
	
		//- 프로젝트가 있을 경우 프로젝트 세팅
		this.Lproject.push(project);
		
		project.parent = this;
	};
   
   
   /**
    *
    * 모듈 코드를 사용하여 내부 속성을 정의한다.
    * 
    * @function getModuleName
    * @private
    * @param {object} name 모듈 코드의 풀 네임
	* @return {string} Module Name
    */
	getModuleName(name) {
		
		return this.moduleName[name];
	}
};

 
 /**
  * 프로젝트 정보를 처리할 클래스를 선언
  * @class
  * @name Projects
  */
class Project {
	
	/**
	 * 각각의 프로젝트의 설정 정보를 등록 및 초기화 하는 생성자
	 * @constructor
	 */
	constructor(oProperties) {
		
		/* 프로젝트 초기 값 등록은 이곳에서 한다. */
		this.layout = { }
		
		/* 프로퍼티를 등록한다. */
		this.property = oProperties || { };
	}
	
	/**
	 * 읽기 전용 프로젝트 설정 객체를 조회한다.
	 * 
	 * @method
	 * @name getProperties
	 */
	getProperties() {
		
		var clone = {};
		
		//- 속성을 순회하면서 값을 등록
		for(var e in this.property) {
			
			if(this.property.hasOwnProperty(e)) {
				
				clone[e] = this.property[e];
			}
		}
		
		return clone;
	};
	
	/**
	 * 프로젝트에 프로퍼티를 등록한다.
	 * 
	 * @method
	 * @name setProperty
	 * @param {*} key 프로퍼티 키
	 * @param {*} value 프로퍼티 값
	 */
	setProperty(key, value) {
		
		this.property[key] = value;
	}
	
	/**
	 * 프로젝트에 프로퍼티를 반환한다.
	 * 
	 * @method
	 * @name getProperty
	 * @param {*} key 프로퍼티 키
	 */
	getProperty(key) {
		
		return this.property[key];
	}
	
	/**
	 * 프로젝트에 프로퍼티 명칭을 반환한다.
	 * 
	 * @method
	 * @name getPropertyNames
	 */
	getPropertyNames() {
		
		var clone = [];
		
		//- 속성을 순회하면서 아이디를 등록
		for(var e in this.property) {
			
			if(this.property.hasOwnProperty(e)) {
				
				clone.push(e);
			}
		}
		
		return clone;
	}
	
	/**
	 * 프로젝트 레이아웃 객체를 조회한다.
	 * 
	 * @method
	 * @name getLayout
	 */
	getLayout() {
		
		return this.layout;
	}
	
	/**
	 * 프로젝트 레이아웃 객체를 등록한다.
	 * 
	 * @method
	 * @name setLayout
	 * @param {*} layout 등록 할 레이아웃
	 */
	setLayout(layout) {
		
		this.layout = layout;
	}
};
