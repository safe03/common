/**
 * 자주 사용하는 그리드 기능을 util화 시킴
 * @param {nexacro.Grid} grid
 * @desc 그리드 속성 변경중 edittype 기능 추가
 * @desc edittype이 'i','insert' 등 설정값일 경우 dataset의 상태값이 해당 상태값일 경우만 활성화됨.(그리드에는 사용 edittype 값을 적용)
 */
function GridUtilClass(grid) {
    /************************ variable area ************************/
    let errorLoc;
    const GRID = grid;
    const GRID_FORMAT = { origin: GRID.getCurFormatString(false) ,setProps : GRID.getCurFormatString(false) };
    const STATE_INFO  = {
         INSERT : ['i','I','insert',Dataset.ROWTYPE_INSERT]
        ,UPDATE : ['u','U','update',Dataset.ROWTYPE_UPDATE]
    }

    /************************ private function area ************************/
    const getThrowMsg = (msg) => `Error function name ${msg} :: `;
    const ExceptionProperty = ( val ,key ) => {
        //예외처리
        if( typeof val == 'boolean' ) return;
        //type check
        if(typeof val != 'function' && typeof val != 'string') throw new Error(`${errorLoc} ERROR property -> ${key}의 property의 값이 string이 아닙니다.`);
    }

    const eventPause = (runFunction) => {
        GRID.set_enableredraw(false);
        GRID.set_enableevent(false);

        const result = runFunction();

        GRID.set_enableevent(true);
        GRID.set_enableredraw(true);
        return result;
    }

    const gridCache = ( option ) => {
        if( option.cache == true ) GRID_FORMAT.setProps = GRID.getCurFormatString(false);
    }

    const addCell = (addCnt) => new Array(addCnt || 1).fill(0).map(empty => GRID.appendContentsCol('body'));

    const getState = (state) => {
        for(const STATE in STATE_INFO) {
            if(STATE_INFO[STATE].find((stateVal) => stateVal == state)) {
                return STATE;
            };
        }
    }

    const setProps = (loc,obj) => {
        for(const column_id in obj) {
            const props = obj[column_id];            
            setProp(loc,column_id,props);
        }
    }

    const setFormatSize = ( index ,size ) => {
        GRID.setFormatColProperty(index,'size',size);
    }

    const setProp = (loc ,id ,props) => {
        const cellIndex = isNaN(Number(id)) ? GRID.getBindCellIndex('body',id) : id;
        
        if(cellIndex < 0) throw new Error(errorLoc + id + '이(가) 존재하지 않습니다.');

        for(const prop in props) {
            let val = props[prop];

            if( prop == 'size' ) {
                setFormatSize( cellIndex ,val );
            }else {
                ExceptionProperty( val ,prop );
            }
            
            GRID.setCellProperty(loc,cellIndex,prop,val);
        }
    }

    const getProp = ( loc ,id ,propList ) => {
        const cellIndex = isNaN(Number(id)) ? GRID.getBindCellIndex('body',id) : id;
        const result = {};

        propList.forEach( prop => {
            ExceptionProperty( prop ,prop );
            result[prop] = GRID.getCellProperty( loc ,cellIndex ,prop );
        });

        return result;
    }

    const setStateExpr = (state ,id ,props) => {
        const cellIndex = isNaN(Number(id)) ? GRID.getBindCellIndex('body',id) : id;
        const findState = getState(state);
        
        if(cellIndex < 0) throw new Error(errorLoc + id + '이(가) 존재하지 않습니다.');

        for(const prop in props) {
            let val = props[prop];

            ExceptionProperty( val ,prop );

            if( findState ) {
                const oProp = GRID.getCellProperty('body',cellIndex,prop);
                val = `expr:dataset.getRowType(currow) == Dataset.ROWTYPE_${findState} ? "${val}" : "${oProp}"`;
            }
            GRID.setCellProperty('body',cellIndex,prop,val);
        }
    }

    /************************ public function area ************************/
    /**
     * 그리드이 id 값을 반환
     * @returns {string}
     */
    this.getGridId    = () => GRID.id;

    /**
     * 그리드를 초기값으로 변경
     * @param {boolean} is - true면 property를 변경한 format으로 변경
     * @returns {string}
     */
    this.init         = (is) => GRID.set_formats(GRID_FORMAT[!is ? 'origin' : 'setProps']);

    /**
     * 그리드의 열을 추가
     * @param {Number} addCnt 
     * @returns {Array[Numbers]}
     */
    this.addCell      = (addCnt) => eventPause( () => addCell(addCnt) );

    /**
     * 그리드의 index OR 바인드 되어있는 id 값을 기준으로 속성변경
     * @param {string OR Number} id 
     * @param {Object} prop 
     * @returns GridUtilClass
     * @desc setHeadProp('column_name', {edittype : 'none',displaytype:'text'....} ) - 그리드의 속성명으로 접근
     */
    this.setHeadProp  = function(id ,prop) {
        errorLoc = getThrowMsg('setHeadProp');
        eventPause( () => setProp('head',id ,prop) );
        gridCache(prop);
        return this;
    }
    this.setBodyProp  = function(id ,prop) {
        errorLoc = getThrowMsg('setBodyProp');
        eventPause( () => setProp('body' ,id ,prop) );
        gridCache(prop);
        return this;
    }

    /**
     * get(Head/Body)Prop 후 바로 set하기 위함
     * @param {string OR Number} id 
     * @returns props{object} : get 객체
     */
    const propGetAndSet = (props ,id ,setFn) => {        
        props.set = (propName ,propValue) => {
            setFn( id , { [propName] :propValue } ); //그리드의 property 변경
            props[propName] = propValue;//해당 객체의 값 변경
            return props;
        }        
    }

    /**
     * Grid property 를 가져오는 함수
     * @param {string OR Number} id - cellIndex OR cell bind id
     * @param {Array} propList - list 안에 가져올 property 명
     * @returns {Object}
     */
    this.getHeadProp = function( id ,propList ) {        
        errorLoc = getThrowMsg('getHeadProp');
        const props = eventPause( () => getProp('head',id ,propList) );
        propGetAndSet( props ,id ,this.setHeadProp ); //setter 객체 추가
        return props;
    }

    this.getBodyProp = function( id ,propList ) {        
        errorLoc = getThrowMsg('getBodyProp');
        const props = eventPause( () => getProp('body',id ,propList) );
        propGetAndSet( props ,id ,this.setBodyProp ); //setter 객체 추가
        return props;
    }
    
    /**
     * 데이터셋의 상태의 따라서 처리할 id의 property
     * @param {string OR number} state 
     * @param {string OR number} id 
     * @param {Object} prop 
     */
    this.setStateExpr = function(state ,id ,prop) {
        errorLoc = getThrowMsg('setStateExpr');
        eventPause( () => setStateExpr(state ,id ,prop) );
        gridCache(prop);
        return this;
    }
    this.setStateExprs = function(state ,obj) {
        errorLoc = getThrowMsg('setStateExprs');
        eventPause( () => {
            for(const column_id in obj) {
                const props = obj[column_id];            
                setStateExpr(state ,column_id ,props);
            }
        });
        gridCache(obj);
        return this;
    }

    /**
     * 그리드의 속성을 한번에 변경
     * @param {Object} props
     * @desc setHeadProps({ column_name1 : {edittype : 'none',displaytype:'text'....} ,column_name2 : {edittype : 'none',displaytype:'text'....} } )
     */
    this.setHeadProps  = function(props) {
        errorLoc = getThrowMsg('setHeadProps');
        eventPause( () => setProps('head' ,props) );
        gridCache(props);
        return this;
    }
    this.setBodyProps  = function(props) {
        errorLoc = getThrowMsg('setBodyProps');
        eventPause( () => setProps('body' ,props) );
        gridCache(props);
        return this;
    }

}
