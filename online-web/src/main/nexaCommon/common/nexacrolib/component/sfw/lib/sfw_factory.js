 /**
 * nexacro factory(생성자)와 관련된 기능을 등록한다.
 * @namespace sfw.factory
 **/

var pForms = [ nexacro.Form.prototype
             , nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];

	/**
	 * 주어진 p 즉 form(div, tabpage포함)에 종속된 comp 중에서 사용되고 있는 것에 해당하고,<br>
	 * 주어진 name과 comp._id가 일치하는 comp 얻는 함수<br>
	 * 단 Factory로 통해서 생성된 경우만 해당된다.<br>
	 * p 첫번쨰 인자는 form, div, tabpage 구성되거나, object로 {target: (form|div|tabpage), poolName: "rowobjs"} 구성 될 수 있다.<br>
	 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.<br>
	 * @function sfw_getCompByName
	 * @param {object} p form에 해당하는 XComp 또는 p.target, p.poolName가지는 object.
	 * @param {string} name 찾고자 하는 comp._id.
	 * @return {object} name 해당하는 comp.
	 * @example
	 * trace(Eco.XComp.Factory.getXCompByName(Div00, "item01"));	// output : _id가 item01인 comp
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getCompByName = Eco.XComp.Factory.getXCompByName;
	
	
	/**
	 * 주어진 p 즉 form(div, tabpage포함)에 종속된 comp을 얻는 함수<br>
	 * 주어진 nm으로 comp._id을 설정한다. 필요시에는 cache된 comp를 재 사용한다.
	 * p 첫번쨰 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.
	 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.
	 * @function sfw_getComp
	 * @param {object} p form에 해당하는 XComp 또는 p.target, p.poolName가지는 object.
	 * @param {string} type XComp type.
	 * @param {string} nm 설정하고자 하는 comp._id.
	 * @return {XComp} 동적으로 생성되거나, cache에서 재 사용된 comp.
	 * @example
	 * trace(Eco.XComp.Factory.getXComp(Div00, "Static", "item01"));	// output : _id가 item01인 Static's comp
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getComp = Eco.XComp.Factory.getXComp;
	

	/**
	 * 주어진 c 즉 XComp의 설정된 rect 정보를 얻는다.<br>
	 * 변경할 예정이거나, 이미 변경된 rect 정보를 얻는다.
	 * @function sfw_getRect
	 * @param {object} c XComp.
	 * @return {object} x, y, width, height로 된 객체.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getRect = Eco.XComp.Factory.getRect;
	
	
	
	/**
	 * XComp의 boder,margin,scrollbar width 크기를 제외한 client 영역 width 를 반환한다.
	 * @function sfw_getClientWidth
	 * @param {object} XComp nexacro component
	 * @return {number} client 영역 width
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getClientWidth = Eco.XComp.Factory.getClientWidth;
	
	

	/**
	 * XComp의 boder,margin,scrollbar height 크기를 제외한 client 영역 height 를 반환한다.
	 * @function sfw_getClientHeight
	 * @param {object} XComp nexacro Component
	 * @return {number} client 영역 height
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getClientHeight = Eco.XComp.Factory.getClientHeight;
	
	
	
	 /**
	 * 컴포넌트에 입력받은 스타일 적용했을 경우(실제적용 없음)<br>
	 * 모양을 표시하기 위한 최소 크기(너비,높이) 반환.
	 * <pre>
	 * ※ 크기에 영향을 미치는 요소는 다음과 같다.
	 *    - margin
	 *    - border
	 *    - padding
	 *    - text
	 * </pre>
	 * @function sfw_getContentSizeWithStyle
	 * @param {object} XComp nexacro Component
	 * @param {string} text text
	 * @param {object} CssItem {@link Eco.CssItem}를 사용한 스타일 속성정보
	 * @return {array} [너비, 높이]
	 * @memberOf sfw.factory
	 */	
	pForm.sfw_getContentSizeWithStyle = Eco.XComp.Factory.getContentSizeWithStyle;
	


	/**
	 * 주어진 c 즉 XComp의 rect 정보를 설정한다.<br>
	 * Eco.XComp.Factory.doLayout 함수를 호출하기 전까지 실질로 화면상에 변경이 발생하지 않는다.
	 * 설정된 정보를 _rect에 가지고 있다가 doLayout함수 호출하는 시점에 반영하고 _rect정보는 clear된다.
	 * @function sfw_setRect
	 * @param {object} c XComp.
	 * @param {*} x, y, width, height 또는 size 정보인 (width, height)객체 또는 x, y 인자로 구성 될 수 있다.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_setRect = Eco.XComp.Factory.setRect;
	
	

	/**
	 * 주어진 c을 가지고 주어진 propName의 속성 값을 얻는다.<br>
	 * 변경할 예정이거나, 이미 변경된 순서대로 속성 정보를 얻는다.
	 * @function sfw_getProperty
	 * @param {object} c XComp.
	 * @param {string} propName 속성 명칭.
	 * @return {*} 해당 속성 값.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getProperty = Eco.XComp.Factory.getProperty;
	
	

	/**
	 * 주어진 c 즉 XComp의 속성 값을 설정한다.<br>
	 * Eco.XCompFactory.doLayout 함수를 호출하기 전까지 실질로 화면상에 변경이 발생하지 않는다.
	 * 설정된 정보를 _props에 가지고 있다가 doLayout함수 호출하는 시점에 반영하고 _props정보는 clear된다.
	 * @function sfw_setProperties
	 * @param {object} c XComp.
	 * @param {*} prop명칭, prop값 순으로 정의되는 인자.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_setProperties = Eco.XComp.Factory.setProperties;
	
	
	
	/**
	 * p는 form 객체인데 p에 속한 comp 중에 변경된 속성 및 rect를 실질로 화면상에 반영한다.<br>
	 * isDownward인자는 하위 form까지 처리할 것인지 여부이다. default는 false 처리된다.
	 * @function sfw_doLayout
	 * @param {object} p form|div|tabpage type of XComp.
	 * @param {boolean} isDownward 하위 form까지 처리할 것인지 여부.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_doLayout = Eco.XComp.Factory.doLayout;
	
	
	
	/**
	 * 주어진 c 즉 XComp의 속성 및 rect 변경되어 차후 반영할 것을 예약 처리한다.<br>
	 * c.parent의 _renderItems, _commitPropItems array에 각각 등록한다.
	 * @function sfw_invalidate
	 * @param {object} c XComp.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_invalidate = Eco.XComp.Factory.invalidate;
	
	
	
	/**
	 * 주어진 c 즉 XComp의 속성 및 rect 변경되었다고 기록한 후 즉시 doLayout를 호출하여 반영처리한다.
	 * @function sfw_validateFactory
	 * @param {XComp} c XComp.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_validateFactory = Eco.XComp.Factory.validate;
	
	
	
	/**
	 * 주어진 c 즉 XComp의 rect 변경되어 차후 반영할 것을 예약 처리한다.<br>
	 * c.parent의 _renderItems array에 등록한다.
	 * @function sfw_invalidateRect
	 * @param {XComp} c XComp.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_invalidateRect = Eco.XComp.Factory.invalidateRect;
	
	

	/**
	 * 주어진 c 즉 XComp의 rect 변경되었다고 기록한 후 즉시 doLayout를 호출하여 반영처리한다.
	 * @function sfw_validateRect
	 * @param {XComp} c XComp.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_validateRect = Eco.XComp.Factory.validateRect;
	
	
	
	/**
	 * 주어진 c 즉 XComp의 속성이 변경되어 차후 반영할 것을 예약 처리한다.<br>
	 * c.parent의 _commitPropItems array에 등록한다.<br>
	 * c의 변경할 c._props 값과 변경된 값인 c._curProps 값이 동일하면 <br>
	 * 속성 변경할 목록인_commitPropItems array에서 제거한다.
	 * @function sfw_invalidateProps
	 * @param {XComp} c XComp.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_invalidateProps = Eco.XComp.Factory.invalidateProps;
	
	

	/**
	 * 주어진 c 즉 XComp의 속성이 변경되었다고 기록한 후 즉시 doLayout를 호출하여 반영처리한다.
	 * @function sfw_validateProps
	 * @param {XComp} c XComp.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_validateProps = Eco.XComp.Factory.validateProps;
	


	/**
	 * 주어진 p(form|div|tabpage) 객체에 속하고, 주어진 명칭 값을 담고 array에 해당하는 comp를 모두 cache 처리한다.<br>
	 * doLayout 함수 호출 전까지는 실질로 화면상에 보여진다.<br>
	 * 하지만 화면상에 반영되는 것과 별개로 cache된 기록은 내부적으로 처리된다.<br>
	 * 첫번째 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.
	 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.
	 * @function sfw_releaseNamed
	 * @param {form|div|tabpage|object} p form XComp 또는 object로 {target: form객체, poolName: "rowobjs"} .
	 * @param {array} names cache처리할 대상를 comp._id의 array.
	 * @param {boolean=} propsClear 기 설정된 속성값들을 clear 할 것인지 여부.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_releaseNamed = Eco.XComp.Factory.releaseNamed;
	
	

	/**
	 * 주어진 p 즉 form 객체에 속한 사용중인 comp를 모두 cache 처리한다.<br>
	 * doLayout 함수 호출 전까지는 실질로 화면상에 보여진다.<br>
	 * 하지만 화면상에 반영되는 것과 별개로 cache된 기록은 내부적으로 처리된다.<br>
	 * 두번째 param인 exclude는 XComp array인데 이것은 cache처리할 대상에서 제외한다.<br>
	 * 세번째 param은 cache처리할 때 기 설정된 속성값들을 clear 할 것인지 여부이다.
	 * 첫번째 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.
	 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.
	 * @function sfw_releaseAll
	 * @param {form|div|tabpage|object} p form XComp 또는 object로 {target: form객체, poolName: "rowobjs"} .
	 * @param {array|object=} exclude cache처리할 대상에서 제외할 array 또는 {xpcom._id: true, ...} 된 object collection.
	 * @param {boolean=} propsClear 기 설정된 속성값들을 clear 할 것인지 여부.
	 * @param {boolean=} isDownward 하위 form까지 처리할 것인지 여부.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_releaseAll = Eco.XComp.Factory.releaseAll;
	
	

	/**
	 * 사용하고 있는 XComp인 주어진 c에 대하여 cache처리한다.<br>
	 * doLayout 함수 호출 전까지는 실질로 화면상에 보여진다.<br>
	 * 하지만 화면상에 반영되는 것과 별개로 cache된 기록은 내부적으로 처리된다.<br>
	 * 두번째 인자는 임의 poolName에 대하여 처리하고자 할 때 설정한다.
	 * 세번째 param은 cache처리할 때 기 설정된 속성값들을 clear 할 것인지 여부이다.
	 * @function sfw_release
	 * @param {XComp} c cache처리할 대상인 XComp.
	 * @param {string=} poolName pool 명칭.
	 * @param {boolean=} propsClear 기 설정된 속성값들을 clear 할 것인지 여부.
	 * @memberOf sfw.factory
	 */
	pForm.sfw_release = Eco.XComp.Factory.release;
	
	
	
	/**
	 * 주어진 xcomp 의 pseudo에 설정된 값을 기준으로 nonClient영역에 해당하는 left, top, right, bottom 값을 array로 반환한다.<br>
	 * doLayout 처리하기 전에 설정하려는 값을 기준으로 한다 다만 설정하려는 값이 없으면 이미 설정된 값을 사용한다.
	 * @function sfw_getNonClientArea
	 * @param {XComp} xcomp nexacro Component.
	 * @param {string=} pseudo normal, mouseover 등의 string값
	 * @param {boolean=} includePadding padding값을 포함할 지 여부 (default: true)
	 * @memberOf sfw.factory
	 */
	pForm.sfw_getNonClientArea = Eco.XComp.Factory.getNonClientArea;
	
	

	/**
	 * 주어진 str 값을 parsing하여 Style object들을 collection으로 반환한다.<br>
	 * collection는 pseudo별로 background, border 등 name별로 객체들을 담아둔다.
	 * @function sfw_parseStyleStr
	 * @param {string} str style 설정할 때 사용하는 string형태
	 * @return {object} 주어진 str 값을 parsing하여 Style object들을 collection
	 * @memberOf sfw.factory
	 */
	pForm.sfw_parseStyleStr = Eco.XComp.Factory.parseStyleStr;
	
	
	
	/**
	 * 컴포넌트에 스타일 속성설정 예약.<br>
	 * 실제 적용은 doLayout 호출시점.
	 * @function sfw_setStyleSheet
	 * @param {XComp} XComp nexacro Component.
	 * @param {Eco.CssItem} cssItem {@link Eco.CssItem}를 사용한 스타일 속성정보
	 * @memberOf sfw.factory
	 */
	pForm.sfw_setStyleSheet = Eco.XComp.Factory.setStyleSheet;

}