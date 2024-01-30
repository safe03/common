/**
 * Util 기능을 하나의 객체에 묶어서 사용하고 사용가능 함수 목록을 간편하게 볼 수 있도록 하기 위한 interface 객체
 * @param {nexacro.Dataset} dataset 
 * @param {nexacro.Form} form 
 * @param {Object} builder 
 */
function SafeCncUtil(dataset,form,builder) {
    //기능 구현 - 컬럼정보가 조회 기준으로 돌아간다.(실질적으로는 로직 사용시점부터의 컬럼 정보로만 돔)
    const DS_UTIL       = Object.freeze(new DatasetUtilClass(dataset,form,builder));
    const SERVICE_UTIL  = Object.freeze(new ServiceUtilClass(form ,DS_UTIL ,dataset.id ,builder.service));
    const GRID_UTILS    = builder.grid ? Object.freeze(new GridUtilClass(builder.grid)) : '그리드 설정을 하지 않았습니다.';

    /**
     * *********************************** Dataset Util 영역 ***********************************************
     */

    /**
    * @return { nexacro.Dataset }
    */
    this.getDataset = DS_UTIL.getDataset;

   /**
    * 로우 포지션
    * @return { int }
    */
   this.getRowPos   = DS_UTIL.getRowPos;

   /**
    * dataset이 비어있는지 체크
    * @return { boolean }
    */
   this.isEmpty   = DS_UTIL.isEmpty;

   /**
    * dataset의 포지션 변경(그리드 값이 변경전 팝업 호출시 값을 못가져오는것 때문)
    * @param { number }
    */
   this.setFocus = DS_UTIL.setFocus;

   /**
    * @param { function(row_data) , int }
    * @return { this } - DsUtillInterface
    * @desc - row가 없을 경우 현재 로우로 셋팅
    */
    this.setRow = DS_UTIL.setRow;

    /**
    * @param { object }
    * @return { this } - DsUtillInterface
    * @desc - object를 복사
    */
    this.copyRow = DS_UTIL.copyRow;

   /**
    * @param { function(row_data) }
    * @return { this }
    */
    this.addRow = DS_UTIL.addRow;

   /**
    * @param { function(row_data) }
    * @return { this }
    */
    this.appendRow = DS_UTIL.appendRow;

   /**
    * @param { function(row_data) ,Number}
    * @return { this }
    */
    this.insertRow = DS_UTIL.insertRow;

   /**
    * @param { int , object[option] }
    * @return { object - map }
    * @desc - row가 없을 경우 현재 로우로 셋팅 ,option 속성 추가
    * @desc - option - { force[boolean] }
    */
    this.getRow = DS_UTIL.getRow;

    /**
    * @param { function(row_data) }
    * @desc - 넘겨준 row에 아무작업도 하지 않으면 순회용, 데이터를 교체한 순간 set작업함.
    */
    this.forEach = DS_UTIL.forEach;

   /**
    * @param { function(row_data):boolean }
    * @return { number }
    */
    this.findRow = DS_UTIL.findRow;

    /**
    * @param { function(row_data):boolean }
    * @return { number }
    */
    this.findLastRow = DS_UTIL.findLastRow;

   /**
    * @param { function(row_data):boolean , object[option] }
    * @return { Array[object - map] }
    * @desc - option 속성 추가
    */
    this.findList = DS_UTIL.findList;
   
    /**
    * @param { function(row_data):boolean }
    * @return { Array[Number] }
    */
    this.findIndex = DS_UTIL.findIndex;

   /**
    * @param { int Or Array[int] }
    * @desc - row가 없을 경우 현재 로우로 셋팅
    */
    this.deleteRow = DS_UTIL.deleteRow;

   /**
    * @param { function(row_data):boolean }
    */
    this.filter = DS_UTIL.filter;

    /**
     * @desc - void
     */
    this.notFilter = DS_UTIL.notFilter;

    /**
    * @param { Array or Object }
    * @return { datasetUtil }
    * @desc - 컬럼 정보를 getRow,setRow,addRow를 할 때 읽기 때문에 이전에 사용불가
    * @desc - obejct => {id:'COLUMN1' , type:'STRING'}
    * @desc - array  => [ {id:'COLUMN1' , type:'STRING'} ,{id:'COLUMN1' , type:'STRING'} ]
    */
    this.addColumn = DS_UTIL.addColumn;

   /**
    * @param { string : column_id }
    * @return { boolean }
    * @desc - 컬럼 정보를 getRow,setRow,addRow를 할 때 읽기 때문에 이전에 사용불가
    */
    this.isColumn = DS_UTIL.isColumn;

    /**
    * @param { any }
    * @return { object Or JSON string }
    * @desc - 컬럼 정보를 getRow,setRow,addRow를 할 때 읽기 때문에 이전에 사용불가
    */
    this.getColumnInfo = DS_UTIL.getColumnInfo;

   /**
    * @param { int }
    * @return { string }
    */
    this.toRowString = DS_UTIL.toRowString;

    /**
    * @return { Array }
    */
    this.getRows = DS_UTIL.getRows;

    /**
    * @param { string : grid_id }
    * @return { nexacro.Grid }
    * @desc - grid가 여러개일 경우 id로 찾아서 반환, 1개일 경우 바로 반환
    */
    this.getGrid = DS_UTIL.getGrid;

    /**
    * @desc - 조회용 , void ,연결된 라벨 reload
    */
    this.reloadLabel = DS_UTIL.reloadLabel;

    /**
    * @return { boolean }
    * @desc - 업데이트 여부
    */
    this.isUpdate = DS_UTIL.isUpdate;
    
    /**
    * @param  { string , int } 
    * @return { boolean }
    * @desc - 로우 상태 체크 및 삭제 여부 체크
    * @desc - i,u는 현재 로우의 상태를 반환, d는 삭제여부를 반환
    */
    this.isStatus = DS_UTIL.isStatus;
    
    /**
    * @param { id } 
    * @return { nexacro.Component}
    * @desc - 연결되어있는 컴포넌트를 가져옴
    */
    this.getNode = DS_UTIL.getNode;

    /**
    * @param { id } 
    * @return { string }
    * @desc - 연결되어있는 컴포넌트의 string값을 가져옴
    */
    this.getNodeString = DS_UTIL.getNodeString;

	/**
    * @desc - dataset reset data
    */
    this.reset = DS_UTIL.reset;

	/**
    * @desc - dataset clear data
    */
    this.clear = DS_UTIL.clear;

    /**
     * *********************************** SERVICE Util 영역 ***********************************************
     */

    /**
    * @param { string , object , function } 
    * @desc - 조회
    */
    this.search = SERVICE_UTIL.search;

    /**
    * @param { string , object , function } 
    * @desc - 저장
    */
    this.save = SERVICE_UTIL.save;

    /**
    * @param { object , function } 
    * @desc - 조회 프로시저 호출
    */
    this.searchProc = SERVICE_UTIL.searchProc;

    /**
    * @param { object , function } 
    * @desc - 저장 프로시저 호출
    */
    this.saveProc = SERVICE_UTIL.saveProc;

    /**
    * @param { object , function } 
    * @desc - exec 호출
    */
    this.exec = SERVICE_UTIL.exec;

    /**
    * @desc - 메시지 사용안함
    */
    this.useNoAsk = SERVICE_UTIL.useNoAsk;

    /**
    * @desc - 저장 후 메시지 사용안함
    */
    this.useSaveMessage = SERVICE_UTIL.useSaveMessage;

    /**
    * @return { ServiceChainClass }
    * @desc - service chain을 할 객체를 return
    */
    this.getServiceChain = () => Object.freeze(new ServiceChainClass(form));


    /**
     * *********************************** Grid Util 영역 ***********************************************
     */

    /**
     * 그리드의 Head 속성을 변경 - 내부적으로 setCellProperty 사용 size등은 사용불가
     * @param { Number } addQty - 추가할 갯수
     * @return { Array[Number] } - 추가한 index list
     */
    this.addCell = ( addQty ) => {
        GRID_UTILS.addCell(addQty);
        return this;
    }

    /**
     * 그리드의 Head 속성을 변경 - 내부적으로 setCellProperty 사용 size등은 사용불가
     * @param { string OR Number } id - findIndex
     * @param { Object }           prop - 속성을 object 형태로
     * @param { option{string} }   grid_id - 그리드가 여러개일 경우 grid의 id로 타겟을 지정
     * @returns this - 체인을 걸수 있다.
     */
    this.setHeadProp = (id, prop ) => {
        GRID_UTILS.setHeadProp(id,prop);
        return this;
    }

    this.getHeadProp = ( id ,propList ) => {        
        GRID_UTILS.getHeadProp(id,propList);
        return this;
    }

    /**
     * 그리드의 Body 속성을 변경 - 내부적으로 setCellProperty 사용 size등은 사용불가
     * @param { string OR Number } id - findIndex
     * @param { Object }           prop - 속성을 object 형태로
     * @param { option{string} }   grid_id - 그리드가 여러개일 경우 grid의 id로 타겟을 지정
     * @returns this - 체인을 걸수 있다.
     */
    this.setBodyProp = (id ,prop) => {        
        GRID_UTILS.setBodyProp(id,prop);
        return this;
    }

    this.getBodyProp = ( id ,propList ) => {        
        GRID_UTILS.getBodyProp(id,propList);
        return this;
    }

    /**
     * 데이터셋의 상태의 따라서 처리할 id의 property
     * @param {string OR number} state 
     * @param {string OR number} id 
     * @param {Object} prop 
     * @param {string} grid_id - grid가 여러개일 경우 사용
     * @desc util.setStateExpr('i','column_id', {edittye :"none"}) -> insert 상태의 grid cell의 edittype을 변경
     */
    this.setStateExpr  = (state ,id ,prop) => {
        GRID_UTILS.setStateExpr(state ,id ,prop);
        return this;
    }

    /**
     * 데이터셋의 상태의 따라서 처리할 id의 property
     * @param {string OR number} state 
     * @param {Object} props 
     * @param {string} grid_id - grid가 여러개일 경우 사용
     * @desc util.setStateExpr('i',{column_id :{edittye :"none"}}) -> insert 상태의 grid cell의 edittype을 일괄 변경
     */
    this.setStateExprs = (state ,props) => {
        GRID_UTILS.setStateExprs(state ,props);
        return this;
    }

    /**
     * 그리드의 Head 속성을 변경 - 내부적으로 setCellProperty 사용 size등은 사용불가
     * @param { Object }           props - 속성을 일괄 변경 { column_name : {text:'텍스트변경',edittype:'none'} }
     * @param { option{string} }   grid_id - 그리드가 여러개일 경우 grid의 id로 타겟을 지정
     * @returns 
     */
    this.setHeadProps = (props) => {
        GRID_UTILS.setHeadProps(props);
        return this;
    }

    /**
     * 그리드의 Body 속성을 변경 - 내부적으로 setCellProperty 사용 size등은 사용불가
     * @param { Object }           props - 속성을 일괄 변경 { column_name : {text:'텍스트변경',edittype:'none'} }
     * @param { option{string} }   grid_id - 그리드가 여러개일 경우 grid의 id로 타겟을 지정
     * @returns 
     */
    this.setBodyProps = (props) => {
        GRID_UTILS.setBodyProps(props);
        return this;
    }

    /**
     * 그리드의 전체체크
     * @param {string} checkBoxColumn 
     * @param {object} option => { headerIndex : number ,trueValue: any ,falseValue: any }
     */
    this.allCheck = ( checkBoxColumn ,option ) => {
        var headerCell  = option?.headerIndex || checkBoxColumn;    //index의 우선순위가 높음
        var headProp    = this.getHeadProp( headerCell ,['text'] ); //property 정보
        var headText    = headProp.text == '1' ? '0' : '1';         //선택여부
        var bodyProp    = this.getBodyProp( checkBoxColumn ,['checkboxtruevalue' ,'checkboxfalsevalue'] );//body의 true,false value를 가져옴
        
        //그리드의 true,false value 체크
        var option = Object.assign( { 
             trueValue  : bodyProp.checkboxtruevalue  || '1' 
            ,falseValue : bodyProp.checkboxfalsevalue || '0' 
        } ,option ); //option 복사

        var changeValue = headProp.text == '1' ? option.falseValue : option.trueValue;   //선택의 따른 값

        this.setHeadProp( headerCell, {text:headText} );                             //텍스트주입
        this.forEach( function(setter) { setter[checkBoxColumn] = changeValue; } );  //값주입
        return this;
    }

    /**
     * 그리드의 format을 변경
     * @param {*} is - true면 초기 셋팅 , false면 setProp이 적용된 format
     */
    this.gridInit = ( is ) => {
        GRID_UTILS.init(is);
        return this;
    }

    /**
    * @desc - 함수 사용 정보
    */
    this.help   = SafeCncUtil;
}