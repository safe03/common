 /**
 * data serializer(json)와 관련된 기능을 등록한다.
 * @namespace sfw.json
 **/

var pForm = nexacro.Form.prototype;

/**
 * JSON 문자열을 객체로 변환한 결과값을 반환한다.
 * @function sfw_jsonDecode
 * @param {string} s JSON String
 * @param {boolean=} strict JSON 문자열을 decoding 할때 엄격히 표준을 따라야 하는지 여부.
 * @return {object} 결과 object
 * @memberOf sfw.json
 */ 
pForm.sfw_jsonDecode = Eco.Json.decode;



/**
 * Object를 문자열로 변환한다.
 * @function sfw_jsonEncode
 * @param {object} value 문자열로 변환할 Object.
 * @return {object} 변환된 문자열
 * @memberOf sfw.json
 */ 
pForm.sfw_jsonEncode = Eco.Json.encode;



/**
 * Json 파싱을 하기 위한 토큰 값을 입력한다.
 * 토큰 타입 > 
 * 		_Token_Type : { 
 *          UNKNOWN : -1,
 *          COMMA : 0,
 *          LEFT_BRACE : 1,
 *          RIGHT_BRACE : 2,
 *          LEFT_BRACKET : 3,
 *          RIGHT_BRACKET : 4,
 *          COLON : 6,
 *          TRUE : 7,
 *          FALSE : 8,
 *          NULL : 9,
 *          STRING : 10,
 *          NUMBER : 11,
 *          NAN : 12
 *     },
 *
 * @function sfw_jsonSetToken
 * @param {object} type 토큰 타입을 등록
 * @param {string} value 토근 값을 등록
 * @memberOf sfw.json
 */ 
pForm.sfw_jsonSetToken = Eco.Json.setToken;



/**
 * Json 파싱을 하기 위한 토큰 값을 조회한다.
 * @function sfw_jsonGetToken
 * @return {object} 토큰값
 * @memberOf sfw.json
 */ 
pForm.sfw_jsonGetToken     = Eco.Json.getToken;



/**
 * 다음 토큰 값을 조회한다.
 * @function sfw_jsonGetNextToken
 * @return {object} 토큰값
 * @memberOf sfw.json
 */ 
pForm.sfw_jsonGetNextToken = Eco.Json.getNextToken;



/**
 * 무시된 항목을 조회한다.
 * @function sfw_jsonSkipIgnored
 * @return {object} 무시값
 * @memberOf sfw.json
 */ 
pForm.sfw_jsonSkipIgnored  = Eco.Json.skipIgnored;