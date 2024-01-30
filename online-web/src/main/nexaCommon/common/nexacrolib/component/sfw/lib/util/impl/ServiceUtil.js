//service = datasetUtilBuilder의 구조체 service를 따라간다.
function ServiceUtilClass( aForm ,aUtil ,aDatasetName ,aService ) {
    /************************ variable area ************************/
    const DATASET_NAME  = aDatasetName;
    const CONST_INFO    = Object.freeze({search:'url', save:'url.save', searchProc:'procedure', saveProc:'procedure.save'});
    const SERVICE       = Object.freeze(aService);
    const PROCEDURE     = Object.freeze(aService.procedureInfo);
    const LABEL_INFO    = { select:'조회되었습니다' ,save:'저장되었습니다' }; //추후 builder에서 option으로 받을 수 있도록 처리
    const options       = { isPositionMemory: false ,isNoAsk : false ,isSaveMessage: false };
    let prevType;
    


    /************************ private function area ************************/

    //service type에 따라 Object return
    const getService = function(type,params,callbackSuccess ,callbackFail) {
        if(!type) throw new Error('type이 존재하지 않습니다. $ type : url ,url.save ,procedure ,procedure.save 중 입력하세요');
    
        var labelType = type.includes('save') ? 'save' : 'select';//기본값        
        var response = { success: SERVICE.success.bind(aForm) }; //onSuccess와 onFailed의 구조 통일화 info 객체

        //init service
        var service = {
            [DATASET_NAME]: {  }
            ,params: {}
            ,callback: {}
        };       

        //option 기능 setting
        setOptions(service);

        //파라미터 존재시 주입
        if(typeof params == 'object') service.params = params;

        //fail callback 추가시 proxy function        
        setOnFailed(service ,response ,callbackFail);
            
        //service success function 주입
        setOnSuccess(service ,callbackSuccess ,response ,labelType);

       return service;
    }

    const setOptions = (service) => {
        //service에 option 추가
        //메시지 여부
        if(options.isNoAsk == true) service.noask = true; //일회성
                 
        //행기억
        if( SERVICE.positionMemory.length > 0 )  {//포지션 기억 처리 어떻게 할지 확인 후 -> options.isPositionMemory == true && SERVICE.positionMemory.length > 0
            service[DATASET_NAME].row = { cols: SERVICE.positionMemory };
        }

        //초기화
        options.isNoAsk = false;
        options.isPositionMemory = false;//다음 로직에 영향안가게 false 처리
    }

    //service에 Success 함수 추가
    const setOnSuccess = (service ,callback ,response ,labelType) => {
        service.callback.onsuccess = function(info,status) {//proxy function

            if( labelType == 'save' && options.isSaveMessage ) {
                aForm.gfn_Message('TMM103');
                options.isSaveMessage = false;//초기화
            }

            //info = gfn_save , gfn_search 실행시 넣어줌
            if(!callback) 
                SERVICE.success.call( aForm ,aUtil );
            else {                        
                callback.call( aForm ,aUtil , response );
            }

            //공통으로 처리
            aUtil.reloadLabel();//aUtil 클래스 의존 - 레이블 리로드
            
            if(layout?.bottom?.form?.fn_SetBottomMsg && setTransactionCheck(labelType)) layout.bottom.form.fn_SetBottomMsg( aUtil.getTranslateText(LABEL_INFO[labelType]) );//bottom 메시지 변경
        }
    }

    //저장 후 3초(bottom에서 설정한 timer 시간)안에 search가 실행 되었을 경우 msg를 안바꾼다.
    const setTransactionCheck = (labelType) => {
        if(labelType == 'save') {
            prevType = labelType;             
            return true;
        }
        
        if(labelType == 'select') {            
            const is = prevType != 'save';
                       prevType = '';//초기화
            return is;//이전 실행 type이 save면 message 미출력
        }
    }

    //service에 Failed 함수 추가
    const setOnFailed = (service ,response ,failCallback ) => {
        //fail callback 추가시 proxy function
        if( failCallback ) {
            response.fail = failCallback.bind(aForm);

            service.callback.onfailed = function(service_object, error_code, error_message) {
                //return 정보를 success와 통일 하기 위함 -> 추후 success에서도 같은 형태를 최대한 유지
                response.service = service_object;
                response.code    = error_code;
                response.message = error_message;
                //fail 함수 호출
                failCallback.call( aForm ,aUtil ,response);
            }
        }        
    };

    //save로직시 validate 추가
    const addValidate = (service) => {
        service[DATASET_NAME] = { 
             validate : SERVICE.validate 
            ,validator: SERVICE.validator 
        }
        return 'save';
    }

    // return Object -> 함수명에 맞게 구현체를 return
    const getUrlService = function(type ,url ,params ,callbackSuccess ,callbackFail) {
        var service     = getService(type ,params ,callbackSuccess ,callbackFail);
            service.url = SERVICE.url+url;
            
        //url save
        if(type.includes(CONST_INFO.save)) addValidate(service);

        return service;
    }

    const getProcService = function(type ,params ,callbackSuccess ,callbackFail) {
        
        const service = getService(type ,params ,callbackSuccess ,callbackFail);

        //procedure setting
        if(type == CONST_INFO.searchProc) service[DATASET_NAME].sql = { type :'P' ,procedure : PROCEDURE.sel  };
        if(type == CONST_INFO.saveProc) {
            addValidate(service);
            service[DATASET_NAME].sql =  Object.assign( {type : 'P'} ,PROCEDURE);
        };

        return service;
    }

    const setUrlChain = (type,chain,url,params,callbackSuccess ,callbackFail) => {
        chain.setService(getUrlService(type,url,params,callbackSuccess ,callbackFail));
    }
    
    const setProcChain = (type,chain,params,callbackSuccess ,callbackFail) => {
        chain.setService(getProcService(type,params,callbackSuccess ,callbackFail));
    }


    /************************ public function area ************************/

    //실행 객체
    //param1 의 인스턴스가 ServiceChainClass 일 경우 체인 객체의 setter에 주입
    /** default = url ,params , callback  
     * ,param1이 serviceChain일 경우 chain ,url ,params ,callback **/
    this.search = (param1,param2,param3,param4,param5) => {// => 
        const type = CONST_INFO.search;
        let url = param1 ,params = param2 ,successCallback = param3 ,failCallback = param4;

        if(param1 instanceof ServiceChainClass) {
            url = param2;
            params = param3;
            successCallback = param4;
            failCallback = param5;
            return setUrlChain(type ,param1 ,url ,params ,successCallback ,failCallback);
        }

        var service = getUrlService(type ,url ,params ,successCallback ,failCallback);

        aForm.gfn_search(service);
    }
    
    this.save = (param1,param2,param3,param4,param5) => {
        const type = CONST_INFO.save;
        let url = param1 ,params = param2 ,successCallback = param3 ,failCallback = param4;

        if(param1 instanceof ServiceChainClass) {
            url = param2;
            params = param3;
            successCallback = param4;
            failCallback = param5;
            return setUrlChain(type ,param1 ,url ,params ,successCallback ,failCallback);
        }

        var service = getUrlService(type ,url ,params ,successCallback ,failCallback);

        aForm.gfn_save(service);
    }

    //params , callback => chain ,params ,callback
    this.searchProc = (param1,param2,param3,param4) => {  
        const type = CONST_INFO.searchProc;
        let params = param1 ,successCallback = param2 ,failCallback = param3;

        if(param1 instanceof ServiceChainClass) {
            params = param2;
            successCallback = param3;
            failCallback = param4;
            return setProcChain(type,param1,params,successCallback,failCallback);
        }

        var service = getProcService(type,params,successCallback,failCallback);

        aForm.gfn_search(service);
    }

    this.saveProc = (param1,param2,param3,param4) => {
        const type = CONST_INFO.saveProc;
        let params = param1 ,successCallback = param2 ,failCallback = param3;

        if(param1 instanceof ServiceChainClass)  {
            params = param2;
            successCallback = param3;
            failCallback = param4;
            return setProcChain(type,param1,params,successCallback,failCallback);
        }

        var service = getProcService(type,params,successCallback,failCallback);

        aForm.gfn_save(service);
    };

    this.exec = (options ,successCallback ,failCallback) => {        
        const procInfo = {insert:'ins' ,update:'upd' ,select:'sel' ,delete:'del'};
        const service = getService('exec' ,{} ,successCallback ,failCallback);//더미 service
        
        //dataset property 삭제
        delete service[DATASET_NAME];

        //service를 기준으로 options 복사(우선순위 options)
        var newService = Object.assign(service ,options);

        //setting 되어있는 프로시저가 있을 경우
        var initProc = PROCEDURE[procInfo[options.procedure]];
        if(initProc) {
            delete newService.procedure;
            newService.sql = {type: 'P' ,procedure: initProc};
        }

        aForm.gfn_exec(newService);
    }

     /**
     *  public function - options
     */
    this.setPositionMemory = function() {
        options.isPositionMemory = true;
        return this;
    }

    this.useNoAsk = () => { 
        options.isNoAsk = true;
        return this;
    };

    this.useSaveMessage = ( TnF ) => {
        options.isSaveMessage = TnF ?? true;
        return this;
    };
}





/**
 * service 묶어서 날릴수 있도록하는 객체 
 * @param {nexacro.Form} aForm 
 * @function setService setter
 * @function setIndividualCallback close setter => service마다의 callback을 실행 => 해당 함수 사용 후 setter 잠김
 * @function search runnable => service 실행
 * @function save   runnable => service 실행
 */
function ServiceChainClass(aForm) {
    const cashCallback = [];
    let services = {};
    let isEnd = false;
    
    this.setService = (service) => {
        if(isEnd) throw new Error('function Name : setService  - 서비스를 추가 할 수 없습니다.');

        cashCallback.push(service.callback);
        services = Object.assign(services, service);
    };

    // 개별 callback 처리
    this.setIndividualCallback  = () => {
        if(isEnd) throw new Error('function Name : setIndividualCallback - 해당 함수를 더이상 실행 할 수 없습니다.');
            isEnd = true;

        //등록한 callback을 각각 실행하기 위한 proxy function
        services.callback = {
            onsuccess : function(info,status) {
                cashCallback.forEach( (callback) => {
                    callback.onsuccess.call(aForm,info,status);
                });
            }
        }
        return this;
    }

    this.search = () => {aForm.gfn_search(services)}
    this.save   = () => {aForm.gfn_save(services)}
}