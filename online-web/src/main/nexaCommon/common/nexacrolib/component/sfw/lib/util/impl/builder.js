//불변성유지 builder -> dataset의 prototype으로 추가 하면 좀더 나을듯?
function datasetUtil(dataset,form) {
    //data type을 미리 구현
    const BUILDER = { grid       : null
                    , labels     : [] 
                    , defaultRow : {} 
                    , service    : {
                        url        : ''
                        ,validate  : {}  
                        ,validator : function(){}
                        ,success   : function(){}
                        ,fail      : undefined // type => function
                        ,positionMemory : []
                        ,procedureInfo : {
                            //sel:'' ,ins : '', upd : '', del : ''
                        }
                    }
    };

    return new (function() {
        this.setGrid       = grid      => { BUILDER.grid = grid;                              return this; }
        this.setLabel      = _static    => {
             BUILDER.labels.push(_static);
             if(!_static.usedecorate) _static.set_usedecorate(true);             
             return this; 
        }
        this.setDefaultRow = map       => { BUILDER.defaultRow = map;                         return this; }
        this.setUrl        = strUrl    => { BUILDER.service.url = strUrl;                     return this; }
        this.setValidate   = validate  => { BUILDER.service.validate  = validate;             return this; }
        this.setValidator  = validator => { BUILDER.service.validator = validator;            return this; }
        this.setSuccess    = success   => { BUILDER.service.success = success;                return this; }
        this.setFail       = fail      => { BUILDER.service.fail = fail;                      return this; }
        this.setSelectProc = procedure => { BUILDER.service.procedureInfo.sel = procedure;    return this; }
        this.setInsertProc = procedure => { BUILDER.service.procedureInfo.ins = procedure;    return this; }
        this.setUpdateProc = procedure => { BUILDER.service.procedureInfo.upd = procedure;    return this; }
        this.setDeleteProc = procedure => { BUILDER.service.procedureInfo.del = procedure;    return this; }
        this.setPositionMemory = (...colNames) => { 
            if(Array.isArray(colNames)) BUILDER.service.positionMemory = colNames;            
            return this;
        }
        this.build         = () => Object.freeze( new SafeCncUtil(dataset,form,BUILDER) );        
    })();
}