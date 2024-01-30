 /**
 * utility한 기능을 등록한다.
 * @namespace sfw.util
 **/


var pForms = [ nexacro.Form.prototype, nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];

	pForm.sfw_getRealUrl                    = Eco.util.getRealUrl;
	pForm.sfw_convertColIdToIndex           = Eco.util.convertColIdToIndex;
	pForm.sfw_performMark                   = Eco.util.performMark;
	pForm.sfw_performMeasure                = Eco.util.performMeasure;
	pForm.sfw_clear_mark                    = Eco.util.clear_mark;
	pForm.sfw_clear_measure                 = Eco.util.clear_measure;
	pForm.sfw_clear_performance             = Eco.util.clear_performance;
	pForm.sfw_performPrint                  = Eco.util.performPrint;

	/**
	 * 첫번째 파라미터의 빈 값을 확인하여 
	 * 비어 있지 않을 경우 첫번째 변수를 
	 * 비어 있을 경우 두번째 파라미터를 반환하는 함수
	 *
	 * @function sfw_nvl
	 * 
	 * @param {object} pValue1 빈값을 확인할 값
	 * @param {object} pValue2 빈 값일 경우 반환할 값
	 * 
	 * @memberOf sfw.util
	 */
	pForm.sfw_nvl = function(pValue1, pValue2) {

		if (this.sfw_isEmpty(pValue1)) {
		
			return pValue2;
		} else {
		
			return pValue1;
		}
	}

	/**
	 * 첫번째 파라미터의 빈 값을 확인하여 
	 * 비어 있지 않을 경우 두번째 변수를 
	 * 비어 있을 경우 세번째 파라미터를 반환하는 함수
	 * 
	 * @function sfw_nvl2
	 *
	 * @param {object} pValue1 빈값을 확인할 값
	 * @param {object} pValue2 빈 값이 아닐 경우 반환할 값
	 * @param {object} pValue3 빈 값일 경우 반환할 값
	 *
	 * @memberOf sfw.util
	 */
	pForm.sfw_nvl2 = function(pValue1, pValue2, pValue3) {

		if (this.sfw_isEmpty(pValue1)) {
		
			return pValue3;
		} else {
		
			return pValue2;
		}
	}
	

	/**
	 * 데이터 처리 되어 있는 데이터셋을 기반으로
	 * 각 타입에 따른 행 번호를 반환하는 함수
	 * 
	 * @function sfw_nowRowPosition
	 * 
	 * @param {object} dataset 데이터셋 객체를 입력한다.
	 * @param {string} type 데이터셋 값(N,U,D)와 같은 정보를 등록
	 *
	 * @memberOf sfw.util
	 */
	pForm.sfw_nowRowPosition = function(dataset, type) {
		
		var _nRow = dataset.rowposition;
		
		//- 수정 데이터셋의 경우 수정 되지 않는 행은
		//- 계산에서 제외한다.
		if( type == 'U' ) {
			
			var _pRow = _nRow;
			
			for ( var e = 0 ; e <= _pRow ; e++ ) {
				
				if(dataset.getRowType(e) == Dataset.ROWTYPE_NORMAL) {
					
					_nRow -= 1;
				}
			}
			
			return _nRow;
		} else {
			
			return _nRow;
		}
	}
}
