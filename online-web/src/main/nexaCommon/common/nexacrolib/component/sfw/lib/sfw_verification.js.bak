 /**
 * 검증(verification)과 관련된 기능을 등록한다.
 * @namespace sfw.verification
 **/

var pForms = [ nexacro.Form.prototype, nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];

	/**
	 * value의 string 여부 반환
	 * @function sfw_isString
	 * @param {*} value 확인할 value.
	 * @return {boolean} string 여부.
	 * @example
	 * trace(Eco.isString("test string!!!"));	// output : true
	 * trace(Eco.isString(1234));	// output : false
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isString = Eco.isString;
	
	
	/**
	 * value의 number 여부 반환.
	 * @function sfw_isNumber
	 * @param {*} value 확인할 value.
	 * @return {boolean} number 여부.
	 * @example
	 * trace(Eco.isNumber(1234));	// output : true
	 * trace(Eco.isNumber("1234"));	// output : false		 
	 * @memberOf sfw.verification
	 */		
	pForm.sfw_isNumber = Eco.isNumber;
	

	/**
	 * value의 boolean 여부 반환.
	 * @function sfw_isBoolean
	 * @param {*} value 확인할 value.
	 * @return {boolean} boolean 여부.
	 * @example
	 * trace(Eco.isBoolean(true));	// output : true
	 * trace(Eco.isBoolean("true"));	// output : false		 
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isBoolean = Eco.isBoolean;
	
	
	/**
	 * value의 null 여부 반환.
	 * @function sfw_isNull
	 * @param {*} value 확인할 value.
	 * @return {boolean} null 여부.
	 * @example
	 * trace(Eco.isNull(null));	// output : true
	 * var a; // undefined
	 * trace(Eco.isNull(a));	// output : false		
	 * trace(Eco.isNull(""));	// output : false
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isNull = Eco.isNull;
	

	/**
	 * value의 undefined 여부 반환.
	 * @function sfw_isUndefined
	 * @param {*} value 확인할 value.		 
	 * @return {boolean} undefined 여부.
	 * @example
	 * var a;
	 * trace(Eco.isUndefined(a));	// output : true
	 *
	 * var a = "";
	 * trace(Eco.isUndefined(a));	// output : false
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isUndefined = Eco.isUndefined;
	
	
	/**
	 * value의 Object 여부 반환.
	 * @function sfw_isObject
	 * @param {*} value 확인할 value.
	 * @return {boolean} Object 여부.
	 * @example
	 * var o = new Object();
	 * trace(Eco.isObject(o));	// output : true
	 * 
	 * var o = {};
	 * trace(Eco.isObject(o));	// output : true
	 *
	 * var o = [1,2,3];
	 * trace(Eco.isObject(o));	// output : false
	 *
	 * var o = new Button();
	 * trace(Eco.isObject(o));	// output : false
	 *
	 * var o = new Rect();
	 * trace(Eco.isObject(o));	// output : false
	 *
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isObject = Eco.isObject;
	
	
	/**
	 * value의 Array 여부 반환.
	 * @function sfw_isArray
	 * @param {*} value 확인할 value.
	 * @return {boolean} Array 여부.
	 * @example
	 * var a = new Array();
	 * trace(Eco.isArray(a));	// output : true
	 *
	 * var a = [1,2,3];
	 * trace(Eco.isArray(a));	// output : true
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isArray = Eco.isArray;
	
	
	/**
	 * value의 Error 객체 여부 반환.
	 * @function sfw_isError
	 * @param {*} value 확인할 value.
	 * @return {boolean} Error 객체 여부.
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isError = Eco.isError;
	
	
	/**
	 * value의 Date 여부 반환.
	 * @function sfw_isDate
	 * @param {date} value 확인할 value.
	 * @return {boolean} Date 여부.
	 * @example
	 * var a = new Date();
	 * trace(Eco.isDate(a));	// output : true
	 *
	 * var a = "20130501";
	 * trace(Eco.isDate(a));	// output : false 	 
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isDate = Eco.isDate;
	
	
	/**
	 * yyyyMMdd형태의 날짜 문자열 여부.( 예 : "20111231" ).
	 * @function sfw_isStringDate
	 * @param {string} value 확인할 value.
	 * @return {boolean} Date 여부.
	 * @example
	 * var a = "20130501";
	 * trace(Eco.isStringDate(a));	// output : true 	 
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isStringDate = Eco.isStringDate;
	
	
	/**
	 * value의 Function 여부 반환.
	 * @function sfw_isFunction
	 * @param {*} value 확인할 value.
	 * @return {boolean} Function 여부.
	 * @example
	 * trace(Eco.isFunction(Eco.isFunction));	// output : true
	 *
	 * this.testFunction = function()
	 * {
	 * }
	 * trace(Eco.isFunction(this.testFunction));	// output : true
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isFunction = Eco.isFunction;
	
	
	/**
	 * value의 RegExp 여부 반환.
	 * @function sfw_isRegExp
	 * @param {*} value 확인할 value.
	 * @return {boolean} 정규식 패턴 여부.
	 * @example
	 * var a = new RegExp();
	 * trace(Eco.isRegExp(a));	// output : true
	 * 
	 * var a = /[a-z]/g;
	 * trace(Eco.isRegExp(a));	// output : true		 
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isRegExp = Eco.isRegExp;
	
	
	/**
	 * primitive type (undefined, null, boolean, string, number) 여부 반환.
	 * @function sfw_isPrimitive
	 * @param {*} value 확인할 value.
	 * @return {boolean} primitive type 여부.
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isPrimitive = Eco.isPrimitive;
	
	
	/**
	 * value의 빈값 여부 반환.<br>
	 * 1. null, undefined type : true 반환<br>
	 * 2. string, array type : length 가 0인 경우 true 반환<br>
	 * 3. object type : 하위 속성이 존재할 경우 true 반환<br>
	 * 4. boolean, number, date type : false 반환
	 *
	 * @function sfw_isEmpty
	 * @param {*} value 확인할 value.
	 * @return {boolean} empty 여부.
	 * @example
	 * var a;	// undefined
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = null;	// null
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = "";	// string
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = "abc";	// string
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = [];	// array
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = [1,2,3];	// array
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = new Array();	// array
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = new Array(3);	// array
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = {};	// object
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = {a:'1', b:'2'};	// object
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = new Object();	// object
	 * trace(Eco.isEmpty(a));	// output : true
	 *
	 * var a = new Object();	// object
	 * a.test = "abc";
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = true;	// boolean
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = 0;	// number
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * var a = new Date();	// date
	 * trace(Eco.isEmpty(a));	// output : false
	 *
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isEmpty = Eco.isEmpty;
	
	
	/**
	 * value의 nexacro component 여부 반환.
	 * @function sfw_isComponent
	 * @param {*} value 확인할 value.
	 * @return {boolean} nexacro component 여부.
	 * @example
	 * var a = new Button();
	 * trace(sfw_isComponent(a));	// output : true
	 *
	 * var a = new Dataset();
	 * trace(sfw_isComponent(a));	// output : false
	 *
	 * var a = new String();
	 * trace(sfw_isComponent(a));	// output : false
	 *
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isComponent = Eco.isXComponent;
	
	
	/**
	 * value의 nexacro dataset 여부 반환.
	 * @function sfw_isDataset
	 * @param {*} value 확인할 value.
	 * @return {boolean} nexacro Dataset 여부.
	 * @example
	 * var a = new Button();
	 * trace(sfw_isDataset(a));	// output : false
	 *
	 * var a = new Dataset();
	 * trace(sfw_isDataset(a));	// output : true
	 *
	 * var a = new String();
	 * trace(sfw_isDataset(a));	// output : false
	 *
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isDataset = function( dataset ){
		
		return ( dataset instanceof Dataset );
	}
	
	
	/**
	 * value의 Space 여부 반환.
	 * @function sfw_isSpace
	 * @param {*} value 확인할 value.
	 * @return {boolean} Space 여부.
	 * @example
	 * var a = " ";
	 * trace(Eco.isSpace(a));	// true
	 *
	 * var a = "\t";
	 * trace(Eco.isSpace(a));	// false		 
	 * @memberOf sfw.verification
	 */
	pForm.sfw_isSpace = Eco.isSpace;
	

	/**
	 * value의 복사본을 반환.
	 * @function sfw_clone
	 * @param {*} value 복사할 value.
	 * @param {boolean} deep Object type의 경우 하위 속성이 Object 일 경우 복사여부.
	 * @param {array=} clone 에서 제외 할 속성들 exclude property name을 array.
	 * @return {*} value의 복사본.
	 * @example
	 * Javascript에서 변수의 타입은 크게 기본형(primitive Type)과 참조형(reference type) 으로 나눌수 있다. 
	 * 기본형 변수는 실제 값을 저장하는 반면 참조형 변수는 값이 저장되어있는 주소를 갖는다.
	 * 
	 * ※ javascript에서 primitive type은 null, undefined, string, number, boolean 이며
	 *     나머지(Object를 상속받은 모든 객체)는 참조형이다.
	 *
	 * var a = "abc";
	 * var b = a;
	 * a = "";
	 *
	 * trace("[" + a + "]");	// output :  []
	 * trace("[" + b + "]");	// output :  [abc]
	 * 
	 * 위와 같이 기본형은 값을 가지므로 a, b 는 다른 값을 가지는 변수이다.
	 * 그러나 참조형은 주소를 가리키므로 아래 처럼 b 는 a 의 주소를 가르키므로 
	 * 같은 값을 가지게 된다.
	 *
	 * var a = {a:'aaa', b:123};
	 * var b = a;
	 *
	 * trace("[" + a.a + "," + a.b + "]");	// output :  [aaa,123]
	 * trace("[" + b.a + "," + b.b + "]");	// output :  [aaa,123]
	 *
	 * a.a = 'bbb';
	 * a.b = 456;
	 *
	 * trace("[" + a.a + "," + a.b + "]");	// output :  [bbb,456]
	 * trace("[" + b.a + "," + b.b + "]");	// output :  [bbb,456]
	 * 
	 * clone 함수는 참조형 변수도 값 자체를 복사하여 새로운 개체를 반환해준다.
	 *
	 * // Object
	 * var a = "abc";
	 * var b = Eco.clone(a);
	 *
	 * a = "";
	 *
	 * trace("[" + a + "]");	// output :  []
	 * trace("[" + b + "]");	// output :  [abc]
	 * 
	 * var a = {a:'aaa', b:123};
	 * var b = Eco.clone(a);
	 *
	 * trace("[" + a.a + "," + a.b + "]");	// output :  [aaa,123]
	 * trace("[" + b.a + "," + b.b + "]");	// output :  [aaa,123]		 
	 * 
	 * a.a = 'bbb';
	 * a.b = 456;
	 * 
	 * trace("[" + a.a + "," + a.b + "]");	// output :  [bbb,456]
	 * trace("[" + b.a + "," + b.b + "]");	// output :  [aaa,123]
	 *
	 * // Array
	 * var a = [1,2,3];
	 * var b = Eco.clone(a);
	 * 
	 * trace(a);	// output : [1,2,3]
	 * trace(b);	// output : [1,2,3]
	 * 
	 * a.push(4);
	 * 
	 * trace(a);	// output : [1,2,3,4]
	 * trace(b);	// output : [1,2,3]
	 *
	 * // Date
	 * var a = new Date();
	 * var b = Eco.clone(a);
	 * 
	 * trace(a);	// output : Tue May 07 2013 11:49:15 GMT+0900
	 * trace(b);	// output : Tue May 07 2013 11:49:15 GMT+0900
	 * 
	 * a.setYear(a.getYear() + 10);
	 * 	
	 * trace(a);	// output : Sun May 07 2023 11:49:15 GMT+0900
	 * trace(b);	// output : Tue May 07 2013 11:49:15 GMT+0900		 
	 *		 
	 * @memberOf sfw.verification
	 */		
	pForm.sfw_clone = Eco.clone;
	
	
	/**
	 * 첫 값의 True/False를 검사해 그 결과에 따라 두번째 또는 세번째 값을 반환.
	 * @function sfw_iif
	 * @param {*} expr 비교할 값. expr의 값으로 True/False 여부를 확인합니다.
	 *                 expr이 Integer인경우 0이면 False아니면 True인식합니다.
	 * @param {*} trueValue expr이 True에 해당하는 값일 경우 Return 되는 값.
	 * @param {*} falseValue expr이 False에 해당하는 값일 경우 Return 되는 값.
	 * @return {*} expr에 따라 Return 된 값.
	 * @example
	 *
	 * trace(Eco.iif(2-1=1, "True", "False")); // output : True
	 *
	 * var a = 98;
	 * var b = Eco.iif(a > 100, 100, a);
	 * trace(b);	// output : 98
	 *
	 * @memberOf sfw.verification
	 */	
	pForm.sfw_iif = Eco.iif;
	
	/**
	 * 입력된 값 또는 수식을 검사해 적당한 값을 반환.<br>
	 * decoce(비교값, CASE1, 결과값1 [, CASE2, 결과값2, ... ], 디폴트 값);<br>
	 * 표현식의 값이 기준값1이면 값1을 출력하고, 기준값2이면 값2를 출력한다.<br>
	 * 그리고 기준값이 없으면 디폴트 값을 출력한다.<br>
	 * @function sfw_decode
	 * @param {*} * 1. 비교값
	 * @param {*} * 2. CASE
	 * @param {*} * 3. 결과값 (2,3 반복)
	 * @param {*=} * (2,3 반복)
	 * @param {*=} * 4.디폴트값
	 * @return {*} decode에 의해서 선택된 값.
	 * @example
	 * trace(Eco.decode("1", "1", "One", "2", "Two", "Default")); // output : One;
	 * 
	 * trace(Eco.decode(100, 1, "일", 10, "십", 100, "백"));	// output : 백
	 *
	 * @memberOf sfw.verification
	 */		 
	pForm.sfw_decode = Eco.decode;
	
	
	/**
	 * 유일한 ID 를 반환
	 * @function sfw_getUniqueId
	 * @param {string=} prefix id 앞에 붙일 문자열
	 * @param {string=} separator id 생성시 구분용 문자(default: '-' ).
	 * @return {string} id
	 * @example
	 *
	 * trace(Eco.getUniqueId()); 
	 * // output : 3e52d1f6-f0d2-4970-a590-ba7656b07859
	 * 
	 * trace(Eco.getUniqueId("Button_")); 
	 * // output : Button_4e601da1-63f4-4cfa-849b-01b8a7f14d40
	 * 
	 * trace(Eco.getUniqueId("", "_")); 
	 * // output : 4e601da1_63f4_4cfa_849b_01b8a7f14d40
	 * 
	 * trace(Eco.getUniqueId("Button_", "_")); 
	 * // output : Button_4e601da1_63f4_4cfa_849b_01b8a7f14d40
	 * 
	 * @memberOf sfw.verification
	 */
	pForm.sfw_getUniqueId = Eco.getUniqueId;
	
	
	/**
	 * Form 내에서 지정된 접두문자열에 순번이 붙여진 ID 를 반환
	 * @function sfw_getSequenceId
	 * @param {form} prefix 순번 앞에 붙일 문자열
	 * @param {string} prefix 순번 앞에 붙일 문자열
	 * @return {string} id
	 * @example
	 *
	 * // this = Form
	 * trace(Eco.getSequenceId(this, "Button")); // output : Button0
	 * trace(Eco.getSequenceId(this, "Button")); // output : Button1
	 * 
	 * // this = Form
	 * trace(Eco.getSequenceId(this, "chk_")); // output : chk_0
	 * trace(Eco.getSequenceId(this, "chk_")); // output : chk_1
	 * 
	 * @memberOf sfw.verification
	 */		
	pForm.sfw_getSequenceId = Eco.getSequenceId;
	
	
	/**
	 * 주어진 두개의 인자에 대하여 동일한 값인지 확인한다.
	 * @function sfw_equalsAll
	 * @param {*} obj1 비교하고자 하는 인자
	 * @param {*} obj2 비교하고자 하는 인자
	 * @return {boolean} 동일하면 true, 아니면 false
	 * @example
	 * // this = Form
	 * var a = {"id1": "apple","id": "kiwi",  "test": [1, 2], "a": Button00};
	 * var b = {"id": "kiwi", "id1": "apple", "test": [1, 2], "a": this};
	 * trace(Eco.equals(a, b)); // output : false
	 * 
	 * var a = {"id1": "apple","id": "kiwi",  "test": [1, 2], "a": Button00};
	 * var b = {"id": "kiwi", "id1": "apple", "test": [1, 2], "a": Button00};
	 * trace(Eco.equals(a, b)); // output : true
	 * 
	 * @memberOf sfw.verification
	 */	
	pForm.sfw_equalsAll = Eco.equals;
	
	
	
	/**
	 *
	 * 주어진 값을 확인하여 퍼센트 여부를 확인합니다.
	 * 
	 * @function sfw_isPercent
	 * @param {string} per 퍼센트를 확인할 문자열
	 * @return {boolean} 퍼센트 여부 {true|false}
	 */
	pForm.sfw_isPercent = function(per) {
		
		return (''.concat(per||'').indexOf('%') > -1 );
	}

}