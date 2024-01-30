//기능 구현
function DatasetUtilClass(dataset,form,builder) {
    /************************ variable area ************************/
    const GLOBAL_PROPS  = { langCode: nexacro.getApplication().GBL_LANGCD ,translateTextFn: form.gfn_autoMapping.bind(form) } 
    const ERROR_LOC     = 'SafeCncUtil';
    const GRID          = builder.grid
        , STATICS       = [...builder.labels]//array 얕은 복사
        , DEFUALT_ROW   = Object.assign({},builder.defaultRow)//데이터 복사
    const bindNodes     = (function(form) {
                                const bindItems = form.binds;
                                const dsID   = dataset.id;
                                const result = {};

                                for(const key in bindItems) {
                                    const item = bindItems[key];
                                    if(item.datasetid == dsID && item.columnid) {
                                        try {
                                            result[item.columnid] = {
                                                 node : eval('form.'+item.compid)
                                                ,nodeStr : item.compid
                                            }
                                        }catch(e) {}
                                    }
                                }
                                return result;
                            })(form);
    
    let COLUMN_INFOS;
    let isEventState    = true;//row 단위로 이벤트를 중지 여부



    const checkBoxEv = (( dataset ) => {
        var row;
        var state;
        
        var isChecked = false; //false 체크 안하고 넘김
        var checkColumnList = [];//isChecked == true 일 경우 체크 후 row 상태값을 이전 상태값에 맞춰줌
        var num = 0;
        
        //event 순서 변경
        const eventFirst = ( dataset ,eventName ) => {
            const target_event  = dataset[eventName];
            const event_list = target_event._user_handlers; //eventList
            const first_event = event_list.find( ev => ev.target == dataset );

            target_event._user_handlers = event_list.reduce( (addEv,ev) => ev == first_event 
                                                                              ? addEv 
                                                                              : [...addEv ,ev] ,[first_event] );
        }
        
        dataset.addEventHandler( 'cancolumnchange' , function( obj, e ) {
            if( isChecked && checkColumnList.includes(e.columnid) ) {
                row = e.row;
                state = dataset.getRowType(row);
            }
        } ,dataset )
        
        dataset.addEventHandler( 'oncolumnchanged' , function( obj, e ) {
            if( isChecked && checkColumnList.includes(e.columnid) ) {
                dataset._setRowType( dataset._viewRecords[row] ,state );
            }
        } ,dataset);
        
        //event 순서 변경
        eventFirst( dataset ,'cancolumnchange' );
        eventFirst( dataset ,'oncolumnchanged' );

    })(dataset);

    



    /************************ Exception area ************************/
    const throwIndexCheck = function(nRow,fnName) {
        const ROW = throwNotNumber(nRow,fnName);
        
        if(ROW >= getLength() || ROW < 0) { throw new Error(`${ERROR_LOC} :: ${fnName} -> ${dataset.id} : index Error : nRow  , ` + ROW); }
        return ROW;
    }

    const throwNotFunction = function(fn,fnName) {
        if(typeof fn != 'function'){
            throw new Error(`${ERROR_LOC} :: ${fnName} -> ${dataset.id} : Parameter type error : not a function , ` + fn);
        }
    };

    const throwNotNumber  = function(num,fnName) {
        if(isNaN(Number(num))) { throw new Error(`${ERROR_LOC} :: ${fnName} -> ${dataset.id} : Parameter type error : not a Number , ` + num); }
        return num;
    }

    const throwNodeCheck  = function(id,msg) {
        if(!bindNodes[id]) { throw new Error(`${ERROR_LOC} :: ${dataset.id} : ${msg}`); }
        return bindNodes[id];
    }


    /************************ private function area ************************/
    const getLength     = () => dataset.rowcount;
    const RUN           = function(fn,data,index) { return fn.bind(form)(data,index); };//Arrow function일au 경우 this의 상위를 찾기 때문에 form 사용 불가 this가 필요하면 일반 함수로 사용

    const getRowPos = () => dataset.rowposition;

    const getInsertRow = num => {
        const nRow = dataset.insertRow(num);
        setDatasetCountByStatic();
        return nRow;
    }

    const getAddRow     = function()   { 
        const nRow = dataset.addRow();
        setDatasetCountByStatic();
        return nRow;
    };

    const getColumnInfo = function() {
        const SIZE = dataset.colcount;
        COLUMN_INFOS = {};
        for(let i=0; i<SIZE; i++) {
            const INFO = dataset.getColumnInfo(i);
            COLUMN_INFOS[INFO.id] = Object.freeze({type :INFO.type});
        }
        return Object.freeze(COLUMN_INFOS);
    }

    const getEventPause = function( is ) {
        if( GRID ) GRID.set_enableredraw( is );
        dataset.set_enableevent( is );
    }

    const getDatasetToObject = function(nRow,option) { 
        const ROW_DATA = {};
      
        if(!COLUMN_INFOS) { getColumnInfo(); };

        for(const COL_ID in COLUMN_INFOS) {
            const COL_VAL = (nRow >= getLength() || nRow < 0) ? undefined : dataset.getColumn(nRow,COL_ID);
            ROW_DATA[COL_ID] = COL_VAL || DEFUALT_ROW[COL_ID];
        }

        ROW_DATA.status = dataset.getRowType(nRow);
        if(option && option.force) return ROW_DATA;
        return Object.seal( ROW_DATA );
    };
        
    const setObjectToDataset = function(rowData,nRow) {
        const DS = dataset;

        for(const key in rowData) { 
            var orgValue = DS.getColumn(nRow,key);
            var newValue = rowData[key];
            if(orgValue != newValue) {
                newValue = newValue ?? ''; 
                DS.setColumn(nRow,key,newValue);
            }
        }
        
    }

    //Array Proxy
    const getArray = function(arr) {
        const LIST     = arr || [];

        LIST.forEach = function(fn) {
            Array.prototype.forEach.call( LIST ,fn.bind(form) );
        }.bind(form);

        return LIST;
    }

    // 트랜잭션 텍스트 명때문에 추가
    const getTranslateText = ( text ) => {
        const { langCode ,translateTextFn } = GLOBAL_PROPS;
        if( langCode && langCode != 'KR' && typeof translateTextFn == 'function' && translateTextFn ) return translateTextFn(text); //다국어 건(명칭) 변경
        return text;
    }

    const setDatasetCountByStatic = function() {
        let TEXT = '<fc v="#e8252d">' + getLength() + '</fc>건';        
        STATICS.forEach( _static => _static.set_text( getTranslateText(TEXT) ));
    }

    const addColumnObject = ( {id ,type} ) => {
        if( !id ) throw new Error('****** ERROR ****** function: addColumn , id가 존재하지 않습니다. => id: '+id);
        if( typeof id != 'string') throw new Error(`****** ERROR ****** function: addColumn id의 type이 string이 아닙니다. => id: ${id} ,type:${typeof id}`);

        dataset.addColumn( id.toUpperCase() ,type || 'STRING' );
    }

    const addColumnList = ( columnList ) => {
        columnList.forEach( addColumnObject );
    }

    /************************ public function area ************************/
    
    this.getTranslateText = (text) => getTranslateText(text);
    this.getDataset = () => dataset
    this.getRowPos  = () => getRowPos();
    this.isEmpty    = () => getLength() < 1;

    this.addColumn  = ( columnInfo ) => {
        if(Array.isArray(columnInfo)) addColumnList(columnInfo);
        else addColumnObject(columnInfo);
        return this;
    }

    this.setRow     = function(fn,nRow) {
        const throwMsg  = 'setRow(param1 {function}, param2 {Number})'; 
        throwNotFunction(fn,throwMsg);

        const ROW       = nRow != undefined ? throwIndexCheck(nRow,throwMsg) : getRowPos();
        
        //외부에서 이벤트 중지했을 경우 처리하지 않는다. - 중지한곳에서 재 처리 전체 순회용
        if(isEventState) getEventPause(false);
        
        const ROW_DATA  = this.getRow(ROW); //row를 가져옴
        RUN(fn, ROW_DATA ,ROW );            //callback 호출
        setObjectToDataset(ROW_DATA,ROW);   //dataset에 데이터 주입
        
        if(isEventState) getEventPause(true);

        return this;
    }

    this.copyRow = function( copyRowData ,rowIndex ) {
        return this.setRow( (setterRow) => Object.assign(setterRow ,copyRowData) ,rowIndex );
    }

    this.addRow     = function(fn) {
        if(!fn) fn = function() {};
        return this.setRow(fn,getAddRow());
    }

    this.appendRow = function(fn) {
        if(!fn) fn = function() {};
        return this.setRow(fn,getInsertRow(getRowPos() + 1));
    }

    this.insertRow = function(fn ,rowIdx) {
        if(!fn) fn = function() {};
        const nRow = rowIdx ?? getRowPos();//rowIdx 가 없을 경우 현재 포지션 setting
        return this.setRow(fn,getInsertRow(nRow));
    }
    
    this.getRow     = function(nRow,option) {
        const throwMsg  = 'getRow';
        const ROW = nRow != undefined ? nRow : getRowPos();
        
        return getDatasetToObject(ROW,option);
    }

    this.forEach = function(fn) {
        const throwMsg  = 'forEach(param1 {function})';
        throwNotFunction(fn,throwMsg);
        
        isEventState = false;//전체 단위로 변경
        getEventPause(false);
        for(let i=0; i<getLength(); i++) {
            this.setRow(fn,i);
        }
        getEventPause(true);
        isEventState = true;//row 단위로 변경
    }

    this.findRow    = function(fn) {
        const throwMsg  = 'findRow(param1 {function})';
        throwNotFunction(fn,throwMsg);
        
        for(let i=0; i<getLength(); i++) {
            const ROW_DATA = this.getRow(i);
            const isTrue   = RUN(fn, ROW_DATA ,i );
            
            if(isTrue) return i;
        }
        return -1;
    }

    this.findLastRow = function(fn) {
        const throwMsg  = 'findLastRow(param1 {function})';
        throwNotFunction(fn,throwMsg);
        
        for(let i=getLength()-1; i>=0; i--) {
            const ROW_DATA = this.getRow(i);
            const isTrue   = RUN(fn, ROW_DATA ,i );
            
            if(isTrue) return i;
        }
        return -1;
    }

    this.findList   = function(fn,option) {
        const throwMsg  = 'findList(param1 {function})';
        const LIST      = getArray();
        throwNotFunction(fn,throwMsg);
        
        for(let i=0; i<getLength(); i++) {
            const ROW_DATA = this.getRow(i,option);
            const isTrue   = RUN(fn, ROW_DATA ,i );
            if(isTrue) { LIST.push(ROW_DATA); };
        }
            
        return LIST;
    
    }

    this.findIndex   = function(fn) {
        const throwMsg  = 'findIndex(param1 {function})';
        const LIST      = [];
        throwNotFunction(fn,throwMsg);
        
        for(let i=0; i<getLength(); i++) {
            const ROW_DATA = this.getRow(i);
            const isTrue   = RUN(fn, ROW_DATA ,i );
            if(isTrue) { LIST.push(i); };
        }

        return LIST;
    }

    this.deleteRow  = function(nRow) {
        const ROWS = [];
        const throwMsg  = 'deleteRow(param1 {Number})';

        if(Array.isArray(nRow)) {
            nRow.forEach(row => ROWS.push(throwIndexCheck(row,throwMsg)) );
            
            getEventPause(false);
            dataset.deleteMultiRows(ROWS);
            getEventPause(true);
        }else {
            const ROW = nRow != undefined ? throwIndexCheck(nRow,throwMsg) : dataset.rowposition;
            dataset.deleteRow(ROW);//tree에서 deleteMultiRows로 삭제시 드리 닫힘
            ROWS.push(ROW);
        }
        
        dataset.set_rowposition( ROWS[0]-1 < 0 ? 0 : ROWS[0]-1 );

        setDatasetCountByStatic();
    }

    this.filter     = function(fn) {
        const throwMsg  = 'filter(param1 {function})';
        const FILTERS = [];
        throwNotFunction(fn,throwMsg);

        for(let i=0; i<getLength(); i++) {
            const ROW_DATA = this.getRow(i);
            const isTrue   = RUN(fn, ROW_DATA ,i );
            
            if(isTrue) FILTERS.push(i);
        }

        getEventPause(false);
        FILTERS.reverse().forEach(row => dataset.filterRow(row));
        this.reloadLabel();
        getEventPause(true);
    }

    this.notFilter = function()  { 
        getEventPause(false);
        dataset.filter('');
        this.setFocus();
        getEventPause(true);
        this.reloadLabel();
    };
    
    this.isColumn = function(id) { return COLUMN_INFOS[id] ? true : false };

    this.getColumnInfo = function(type) {
        const copy = COLUMN_INFOS;
        if(type) return JSON.stringify(copy);
        return copy;
    }

    this.toRowString = function(nRow) { return JSON.stringify(this.getRow(nRow)); };

    this.getRows = function() {
        const arr = [];
        for(let i=0; i<getLength(); i++) {
            arr.push(this.getRow(i));
        }
        return arr;
    }

    this.getGrid = () => GRID;

    this.reloadLabel = function() { setDatasetCountByStatic(); }

    this.isUpdate    = function() {        
        if(this.isStatus('d')) return true;
   
        for(var i=0; i<getLength(); i++) {
            if(this.isStatus('i',i) || this.isStatus('u',i)) return true;
        }

        return false;
    }

    this.isStatus = function(find,findRow) {
        if(!find) throw new Error('필수 파라미터가 존재하지 않습니다. "i","u","d" 중 하나를 전달하세요.');
		
        const I = Dataset.ROWTYPE_INSERT;
        const U = Dataset.ROWTYPE_UPDATE;
        const D = Dataset.ROWTYPE_DELETE;
        const row = findRow || getRowPos();

		//상태가 array로 들어오면 or로 반환
		if( Array.isArray( find ) && find.length > 0 ) return find.some( f => this.isStatus( f ,row ) );
		
        if(find == I || find.toLocaleLowerCase() == 'i') return dataset.getRowType(row) == I;
        if(find == U || find.toLocaleLowerCase() == 'u') return dataset.getRowType(row) == U;
        if(find == D || find.toLocaleLowerCase() == 'd') return dataset.getDeletedRowCount() > 0;

        return false;
    }

    this.getNode = function(id) { return throwNodeCheck(id,"getNode :: "+id+"가 존재하지 않습니다.").node; }

    this.getNodeString = function(id) { return throwNodeCheck(id,"getNodeString :: "+"가 존재하지 않습니다.").nodeStr; }

    this.setFocus = function( index ,event ) {
        let INDEX = index ?? getRowPos();
            INDEX = INDEX == -1 && getLength() > 0 ? 0 : INDEX;

        if( event == false ) getEventPause( false );

        dataset.set_rowposition(-1);
        dataset.set_rowposition(INDEX);

        if( event == false ) getEventPause( true );

        return this;
    }

    this.reset = function() {
        getEventPause(false);
        dataset.reset();
        getEventPause(true);
        
        this.reloadLabel();
        this.setFocus(0);
    }

    this.clear = function() {
        getEventPause(false);
        dataset.clearData();
        getEventPause(true);
        
        this.reloadLabel();
    }
   
}