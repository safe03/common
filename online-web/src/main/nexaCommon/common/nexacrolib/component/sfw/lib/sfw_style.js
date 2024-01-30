 /**
 * css 스타일(style)과 관련된 기능을 등록한다.
 * @namespace sfw.style
 **/


var pForm = nexacro.Form.prototype;

 /**
 * nexacro Component의 boder width를 반환한다.
 * @function sfw_getBorderWidth
 * @param {XComp} xComp nexacro Component
 * @return {array.<number>} [ leftWdith, topWdith, rightWdith, bottomWdith ]
 * @example
 * trace(Eco.XComp.Style.getBorderWidth("border style이 none이거나 width가 0일 경우")); //output: [0,0,0,0] 
 * trace(Eco.XComp.Style.getBorderWidth("border가 1인 component")); //output: [1,1,1,1]
 *
 * @memberOf sfw.style
 */
pForm.sfw_getBorderWidth = Eco.XComp.Style.getBorderWidth;



 /**
 * nexacro Component의 Padding Size를 반환한다.
 * @function sfw_getPadding
 * @param {XComp} xComp nexacro Component
 * @return {array.<number>} [ leftSize, topSize, rightSize, bottomSize ]
 * @example
 * trace(Eco.XComp.Style.getPadding("전체 padding = 0")); //output: [0,0,0,0] 
 * trace(Eco.XComp.Style.getPadding("left padding = 20")); //output: [20,0,0,0] 
 *
 * @memberOf sfw.style
 */
pForm.sfw_getPadding = Eco.XComp.Style.getPadding;



 /**
 * nexacro Component의 Margin Size를 반환한다.
 * @function sfw_getMargin
 * @deprecated nexacro component 는 margin 이 없습니다.
 * @param {XComp} xComp nexacro Component
 * @return {array.<number>} [ leftSize, topSize, rightSize, bottomSize ]
 * @example
 * trace(Eco.XComp.Style.getMargin("전체 padding = 0")); //output: [0,0,0,0] 
 * trace(Eco.XComp.Style.getMargin("left padding = 20")); //output: [20,0,0,0] 
 *
 * @memberOf sfw.style
 */
pForm.sfw_getMargin = Eco.XComp.Style.getMargin;



 /**
 * nexacro Component의 Current Style을 반환한다.
 * @function sfw_getCurrentStyle
 * @param {XComp} xComp nexacro Component
 * @return {object} 
 * @example
 * trace(Eco.XComp.Style.getCurrentStyle(xComp));
 * // output:
 * //  {background: "left middle"
 * //   ,border: "1 solid #808080ff "
 * //   ,color: "#333333ff"
 * //   ,padding: "0 0 0 0"
 * //   ,bordertype: "normal 0 0 "
 * //   ,align: "center middle"
 * //   ,font: "Dotum,11,bold"}
 *
 * @memberOf sfw.style
 */
pForm.sfw_getCurrentStyle = Eco.XComp.Style.getCurrentStyle;



 /**
 * nexacro Component의 Style을 반환한다.
 * @function sfw_getStyle
 * @param {XComp} xComp nexacro Component
 * @return {object} 
 * @example
 * trace(Eco.XComp.Style.getStyle(xComp));
 * // output:
 * //  {background: "left middle"
 * //   ,border: "1 solid #808080ff "
 * //   ,padding: "0 0 0 0"
 * //   ,align: "center middle"}
 *
 * @memberOf sfw.style
 */
pForm.sfw_getStyle = Eco.XComp.Style.getStyle;



 /**
 * nexacro Component의 style을 설정한다.
 * @function sfw_setStyle
 * @param {XComp} xComp nexacro Component
 * @param {json} styleValue style설정 value.
 * @param {boolean} clearFlag 모든 style값 clear여부(default:true).
 * @example
 * //현재 설정된 style을 모두 clear 후 지정된 style값만 설정
 * var styleValue = {color: "red"};
 * Eco.XComp.Style.setStyle(st_sample10, styleValue, false);
 *
 * //현재 설정된 style은 유지하고 지정된 style값만 설정
 * var styleValue = {border: "2 solid yellow", color: "red"};
 * Eco.XComp.Style.setStyle(st_sample9, styleValue);
 *
 * @memberOf sfw.style
 */
pForm.sfw_setStyle = Eco.XComp.Style.setStyle;



/**
* nexacro Component에 argument로 주어진 styleValue를 condition에 따라 적용한다.<br><br>
* - condition이 string일 때:<br>
*    styleValue의 속성과 동일한 xComp의 속성값이 condition과 같을 때 적용한다.<br>
* - condition이 function일 때:<br>
*    condition의 실행값이 true일 경우에만 적용한다.<br>
*    ※ 이 때 condition 함수를 호출 시 xComp, 속성명, 속성값이 arguments로 전달된다.<br>
* - condition이 ""(빈문자열) 또는 null, undefined 일 때:<br>
*    styleValue의 속성명과 동일한 xComp의 속성값이 없을 경우에만 적용한다.<br><br>
* ※component의 style에 지정된 속성이 없어서 테마의 기본값이 표시되는 것은<br>
*   속성값이 없는 것으로 본다.
* @function sfw_setStyleIf
* @param {XComp} xComp target 객체 
* @param {object} styleValue source 객체
* @param {function|string|undefined} condition 적용조건
* @param {object} scope callback 함수에 대한 수행 scope(this) 
* @param {boolean} clearFlag 모든 style값 clear여부(default:true).
* @example
* //btn_result_01의 color속성이 'red'일 경우에 이 속성값을 "blue"로 적용
* var styleValue = {color:"blue"};
* Eco.XComp.Style.setStyleIf(btn_result_01, styleValue, "red", this, false);
*
* //btn_result_02의 enable속성이 true일 경우에만 boder,color 적용
* var styleValue = {border:"3 double red", color: "red"};
* Eco.XComp.Style.setStyleIf(btn_result_02, styleValue, function(xComp, name, value) {
*         if (xComp.enable == true)
*         {
*             return true;
*         }
*         return false;
*     }
* , this);
*
* //btn_result_03의 background와 align이 설정되지 않은 경우 
* //아래의 styleValue 값으로 적용된다.
* var styleValue = {background:"orange", align:"right middle"};
* Eco.XComp.Style.setStyleIf(btn_result_03, styleValue, "" , this, false);
*
* @memberOf sfw.style
*/
pForm.sfw_setStyleIf = Eco.XComp.Style.setStyleIf;



var pComp = nexacro.Component.prototype;


/**
 * 컴포넌트에 스타일을 등록 합니다.
 * @function sfw_setStyle
 * @private
 * @param {object} pseudoElt nexacro Style
 * @return {object} 
 * @memberOf sfw.style
 */
pComp.sfw_setStyle = function(styleValue, pseudoElt, priority) {

	return Eco.XComp.Style.setStyle(this, styleValue, pseudoElt, priority);
}



/**
 * 컴포넌트에 스타일을 조회 합니다.
 * @function sfw_getStyle
 * @private
 * @param {object} pseudoElt nexacro Style
 * @return {object} 
 * @memberOf sfw.style
 */
pComp.sfw_getStyle = function(pseudoElt) {

	return Eco.XComp.Style.getStyle(this, pseudoElt);
}




pForm.sfw_createCSSSelector = Eco.XComp.Style.createCSSSelector;