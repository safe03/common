/**
 * 배치를 관리 하는 클래스
 * 단일 의존성을 가지도록 작성하여야 한다.
 * 
 * @class
 * @name Batch
 */
class Batch {
	
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
		
		//- application의 경우 추가 할수 있는 폼이 없으므로 신규 생성 후 할당
		if(!openLibrary.addChild) {
			
			openLibrary = new nexacro.Form('__applicationDynamicCreateForm__');
		}
		
		this.form = openLibrary;
		this.olib = openLibrary;
		this.repo = repo;
		
		//- default setting allocate
		this.defaultSetting = {
			jobs : {},
			pipe : [ /* job list */ ],
			form : this.form,
		};
		
		//- declare batch job schedualer id
		this.batchSchedulerId = '__batchJobSchedualerBackgroundProcess__';
		
		//- default setting up
		this._init({
			
			/* 잡의 아이디를 처리할 계수기(seq)를 등록 한다 */
			getSequance : (function(e) {
				return function() {
					
					//- 계수기가 5자리는 넘지 않도록 처리
					if(e > 9999) { 
						
						e = 0;
					}
					
					return ++e;
				}
			})(0),
			//max : 10,
		});
	}
   
    /**
	 * 배치을 초기화 하는 함수
	 * 현재는 Form을 사용하여 iframe 형태의 job processing을 처리
	 * 추후 ajax 배치 처리를 위한 고유 영역을 재 할당할 필요가 있을 경우
	 * batch를 확장하여 처리
	 *
	 * @private
	 * @method
	 * @name init
	 */
	_init(setting) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		//- batch job id and iframe form
		var sbid = this.batchSchedulerId;
		var oTimerIframe = null;
		
		//- rebind that
		var that = this;
		
		//- 배치를 처리할 [iframe - form]이 없을 경우 신규 생성하여 등록
		if(olib.sfw_isEmpty(form[sbid])) {
			
			oTimerIframe = new Form(sbid);
			
			form.addChild(sbid, oTimerIframe);
			
			//- iframe의 처리 핸들러를 등록
			oTimerIframe.setEventHandler('ontimer', function(obj, e) {
				
				var _job = that.getJob(e.timerid);
				
				//- job이 제거될 경우
				if(_job.isClose()) {
					
					//- 이벤트를 제거
					obj.killTimer(e.timerid);
					
					//- 후처리를 실행
					_job.onClosed();
					
					//- job을 제거한다.
					that.removeJob(e.timerid);
					
					//- 즉시 종료 한다
					return;
				}
				
				//- job 실행 전 처리 함수
				_job.onOpened();
				
				//- job을 실행 order = read > process > wrtie
				_job.write(
					
					_job.process(
						
						_job.read()
					)
				);
				
				//- 반복 횟수 추가
				if(_job.repeatCount == undefined || _job.repeatCount == null) {
					
					_job.repeatCount = 1;
				} else {
					
					_job.repeatCount += 1;
				}
			});
		} else {
			
			oTimerIframe = form[sbid];
		}
		
		//- 설정에 프레임폼을 지정
		setting.form = oTimerIframe;
		
		//- mix default value and passed value
		this.setting = clib.mixon(setting, this.defaultSetting, ['form']);
		
		//- return chain
		return this;
	}
	
    /**
	 * Job 객체를 반환하는 함수
	 *
	 * @public
	 * @method
	 * @name getJob
	 */
	getJob( _job ) {
		
		return this.setting.jobs[_job];
	}
	
    /**
	 * Job 객체를 제거하는 함수
	 *
	 * @public
	 * @method
	 * @name removeJob
	 */
	removeJob( _job ){
		
		try{
			
			delete this.setting.jobs[_job];
		}catch(e) {
			
			return false;
		}
		
		return true;
	}
		
	/** 
	 * job을 추가하는 함수
	 * 
	 * @public
	 * @method
	 * @param {object} job 추가 하기 위한 job객체
	 */
	addJob(job) {
		
		//- library matching 
		var olib = this.olib;
		var clib = this.clib;
		var form = this.form;
		
		var oScJobs = this.setting.jobs;
		var oScPipe = this.setting.pipe;
		var oScForm = this.setting.form;
		
		//- job [id]와 [interval]을 받아 온다.
		var _eid    = 'JID'+this.setting.getSequance();
		var _period = job.event.period;
		
		//- job을 등록한다.
		oScJobs[_eid] = job;
		
		//- job을 등록 한다.
		oScForm.setTimer(_eid, _period);
	}
	
	/** 
	 * job을 생성하는 함수
	 * 
	 * @public
	 * @method
	 * @param {object} setting job을 생성하기 위한 객체
	 */
	nexaJobFactory(txm) {
		
		return new NexacroJob(this.clib, txm);
	}
};

/**
 * 배치에 등록 되는 작업
 * 
 * @class
 * @name Job
 */
 
class Job {

	/**
	 * job실행을 종료 한다.
	 * 
	 * @public
	 * @method
	 * @name stop
	 */
	stop() { }
	
	/**
	 * job 종료 여부를 확인할 처리 함수
	 *
	 * @public
	 * @method
	 * @name isClose
	 */
	isClose() { return true; }
	
	
	/**
	 * job 종료 후 처리 함수
	 *
	 * @public
	 * @method
	 * @name onClosed
	 */
	onClosed() { }
	
	
	/**
	 * job이 실행 되기 전 처리 함수
	 *
	 * @public
	 * @method
	 * @name onOpened
	 */
	onOpened() { }
	
	
	/**
	 * job 실행 시 데이터를 읽는 함수
	 *
	 * @public
	 * @method
	 * @name read
	 */
	read() { }
	
	
	/**
	 * job 실행 시키는 함수
	 *
	 * @public
	 * @method
	 * @name process
	 */
	process() { }
	
	
	/**
	 * job 실행 후 처리 함수
	 *
	 * @public
	 * @method
	 * @name write
	 */
	write() { }
};
 
/**
 * 넥사크로를 사용한 job 클래스
 * 
 * @class
 * @name NexacroJob
 */
class NexacroJob {
	
	/**
	* @private
	* @constructor
	* @param {Object} lib form object
	* @param {Repositories} repo repository instanace
	*/
	constructor (lib, txm) {
		
		//- library matching
		this.clib = lib;
		
		var openLibrary = lib.getOpenLibrary();
		
		this.form = openLibrary;
		this.olib = openLibrary;
		
		//- object 및 초기값 등록
		this.obj = txm;
		this.repeatCount = 1;
		
		var _setting = txm.setting;
		
		//- 이벤트 객체를 생성
		this.event = this.newScheduleEvent(_setting.repeat);
	}
	
	/**
	 * job실행을 종료 한다.
	 * 
	 * @public
	 * @method
	 * @name stop
	 */
	stop() {
		
		this.isClose = function() {
			
			return true;
		}
	}
	
	/**
	* @public
	* @method
	* @name newScheduleEvent
	* @param {Object} schedule scheduling object
	*/
	newScheduleEvent(schedule) {
		
		//- library matching
		var olib = this.olib;
		
		//- if empty parameter, will return default setting
		//- 1. event no
		//- 2. period 0
		//- 3. count 0
		//- is not executable meta information
		if ( olib.sfw_isEmpty(schedule) ) {
			
			return {
				event  : 'no',
				period : 0,
				count  : 0
			}
		}
		
		//- splite scheduling token
		var schedulingToken = schedule.split(' ');
		
		//- it is tht over 0 size token
		if ( schedulingToken.length > 0 ) {
			
			//- if token size 1, only write the event target
			if (schedulingToken.length == 1) {
				
				return {
					event  : schedulingToken[0],
					period : 1000,                   //- default period 1 second
					count  : Number.MAX_SAFE_INTEGER
				}
			} else {
				
				//- if over token size 1
				//- period token [1] and count [2]
				var prod = schedulingToken[1],
				    period = 1000,
				    count = Number.MAX_SAFE_INTEGER;
					
				// 각 시간 데이터에 대한 정리
				if (prod.indexOf('s') > 0) { 
					
					//- second(s)
					period = nexacro.toNumber(prod.replace('s','')) * 1000;
				} else if (prod.indexOf('m') > 0) { 
					
					//- minute(s)
					period = nexacro.toNumber(prod.replace('m','')) * 1000 * 60;
				} else if (prod.indexOf('h') > 0) { 
					
					//- hour(s)
					period = nexacro.toNumber(prod.replace('h','')) * 1000 * 60 * 60;
				} else if (prod.indexOf('d') > 0) {
					
					//- day(s)
					period = nexacro.toNumber(prod.replace('d','')) * 1000 * 60 * 60 * 24;
				} else {
					
					// milisecond(s)
					period = nexacro.toNumber(prod);
				}
				
				//- if schedulingToken size is 3,
				//- [3] is execute count
				//- when infinite is non stop the event
				if(schedulingToken.length == 3) {
					
					if(schedulingToken[2] == 'infinite') {
						
						count = Number.MAX_SAFE_INTEGER;
					} else {
						
						count = nexacro.toNumber(schedulingToken[2]);
					}
				}
				
				return {
					event  : schedulingToken[0],
					period : period,
					count  : count
				}
			}
		} else {
		
			// 빈값이 등록 될 경우 "none"를 반환
			return {
				event  : 'none',
				period : 0,
				count  : 0,
			}
		}
	}
	
	
	/**
	 * job 종료 여부를 확인할 처리 함수
	 *
	 * @public
	 * @method
	 * @name isClose
	 */
	isClose() { 
		
		//- library matching
		var olib = this.olib;
		
		var sEvent  = this.event.event;
		var nEcount = this.event.count;
		var nNcount = this.repeatCount;
		
		//- no is not repeat batching
		if(olib.sfw_toUpper(sEvent) == 'NO') {
			
			return true;
		} else if(olib.sfw_toUpper(sEvent) == 'FAILED') {
			
			//- 트랜잭션 상태를 확인하여
			//- 트랜잭션이 실패할 경우 재 실행
			if(nNcount <= nEcount && this.obj._info.status == 'REJECTED') {
				
				return false;
			} else {
				
				//- 정해진 숫자만큰 반복하였으므로 회생 불능으로 처리 되어
				//- 처리 종료
				return true;
			}
			
		} else if(olib.sfw_toUpper(sEvent) == 'ALL'){
			
			//- 전체 대상에 대하여 처리
			if(nNcount < nEcount) {
				
				return false;
			}
			
			return true;
		}
		
		return true;
	}
	
	
	/**
	 * job 종료 후 처리 함수
	 *
	 * @public
	 * @method
	 * @name onClosed
	 */
	onClosed() {
		
		//- library matching
		var olib = this.olib;
		var form = this.form;
		
		//- onClose가 함수(Function)로 등록 될 경우 이벤트를 콜백 쳐 준다.
		if(!olib.sfw_isEmpty(this.obj.setting.onClosed)) {
			
			if(olib.sfw_isFunction(this.obj.setting.onClosed)) {
				//- 콜백 이벤트를 실행
				this.obj.setting.onClosed.call(form, this.obj._info);
				
			}
		}
		
		//- 이벤트 처리 객체를 초기화
		this.obj.reset();
	}
	
	
	/**
	 * job이 실행 되기 전 처리 함수
	 *
	 * @public
	 * @method
	 * @name onOpened
	 */
	onOpened() { }
	
	
	/**
	 * job 실행 시 데이터를 읽는 함수
	 *
	 * @public
	 * @method
	 * @name read
	 */
	read() { }
	
	
	/**
	 * job 실행 시키는 함수
	 *
	 * @public
	 * @method
	 * @name process
	 */
	process() { 
		
		//- 즉시 실행 함수를 사용하여 실행
		this.obj.call({});
	}
	
	
	/**
	 * job 실행 후 처리 함수
	 *
	 * @public
	 * @method
	 * @name write
	 */
	write() { }
		
};