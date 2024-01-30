 /**
 * nexacro loggin과 관련된 기능을 등록한다.
 * @namespace sfw.number
 **/

var pForms = [ nexacro.Form.prototype, nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];

	/**
	* 소수점 이하 더하기 연산 처리가 부적합하게 처리되는 경우 정정처리 하기 위한 함수.<br>
	* @function sfw_plus
	* arguments 들을 + 연산 처리하여 결과를 반환합니다.<br>
	* "일반용계산기(공학용아님)"와 동일한 더하기 결과를 반환합니다.<br><br>
	* javascript에서 아래 연산 처리하는 경우 발생되는 오류입니다.<br>
	* trace(0.1 + 0.2); // output : 0.30000000000000004<br>
	* Chrome, Safari, Firefox, IE8, Rutime 에서 모두 위와 같은 결과가 나온다.<br>
	* 이 놀라운 결과에 대한 몇가지 질문 :<br>
	* -. 이것이 bug인가?<br>
	* -. bug이면, 왜 해결하지 않는가?<br>
	* -. bug가 아니면, javascript language spec인가?<br>
	* 대답은 :<br>
	* javascript는 부동소수점 방식(floating point)으로 계산을 하며 IEEE Standard 754규격을 사용합니다.<br>
	* javascript는 실수의 변환을 위해 53bit의 연산을 합니다.<br>
	* 정수인 경우에는 해당 기억공간의 범위안에서 정확한 결과를 나타내는데,,<br>
	* 실수인 경우에는 기억공간의 범위를 벗어나는 결과가 나타나면 나머지수를 버립니다.<br>
	* 컴퓨터가 연산을 위해 소수점 이하의 자릿수를 이진수로 변환하는 과정에서,,<br>
	* 예를들어,<br>
	* 0.3 을 이진수로 바꾼다면,,<br>
	* 0.3 * 2 = 0.6<br>
	* 0.6 * 2 = 1.2<br>
	* 0.2 * 2 = 0.4<br>
	* 0.4 * 2 = 0.8<br>
	* 0.8 * 2 = 1.6<br>
	* 0.6.. <== 다시 0.6이 나와,, 0.0100110011001.... 와 같이 무한히 반복됩니다.<br>
	* 0.3의 이진수처럼 기억공간의 한계를 벗어나는 결과치가 나오는 경우에는<br>
	* 부정확한(최대한 가까운?) 연산을 하게 되는 것이지요.<br>
	* 따라서 Eco.number.plus 함수를 사용하여 처리합니다.
	* @param {number} arguments . 예: (1660, -1559.9, 0.33) 
	* @return {number} 성공 = 결과값. 실패 = NaN ???
	* @example
	* var a = 0.1,
	*     b = 0.2;
	* trace(Eco.number.plus(a, b)); // output : 0.3
	* trace(1660 - 1559.9 + 0.33); // output : 100.42999999999991
	* trace(Eco.number.plus(1660, -1559.9, 0.33)); // output : 100.43
	* @memberOf sfw.number
	*/
	pForm.sfw_plus = Eco.number.plus;
	
	
	
	 /**
	 * 소수점 이하 나누기 연산 처리가 부적합하게 처리되는 경우 정정처리 하기 위한 함수.<br>
	 * @function sfw_divide
	 * arguments 들을 / 연산 처리하여 결과를 반환합니다.<br>
	 * "일반용계산기(공학용아님)"와 동일한 나누기 결과를 반환합니다.<br>
	 * 왜 필요하나? -> plus 함수 설명 내용 참조<br><br>
	 * The largest value JavaScript can express using floating point is <br>
	 * 1.7976931348623157E+10308 (10에 308승)<br>
	 * so anything bigger than that will be Infinity.
	 * @param {...number} arguments . 예: (1660, -1559.9, 0.33) 
	 * @return {number} 성공 = 결과값. 실패 = NaN ???
	 * @example
	 * trace(1660 - 1559.9 + 0.33); // output : -3.2247599399339895
	 * trace(Eco.number.divide(1660, -1559.9, 0.33)); // output : -3.22475993993399
	 * @memberOf sfw.number
	 */ 
	pForm.sfw_divide = Eco.number.divide;
	
	
	
	 /**
	 * 소수점 이하 곱하기 연산 처리가 부적합하게 처리되는 경우 정정처리 하기 위한 함수.<br>
	 * @function sfw_multiply
	 * arguments 들을 * 연산 처리하여 결과를 반환합니다.<br>
	 * "일반용계산기(공학용아님)"와 동일한 곱하기 결과를 반환합니다.<br>
	 * 왜 필요하나? -> plus 함수 설명 내용 참조
	 * @param {...number} arguments . 예: (1660, -1559.9, 0.33) 
	 * @return {number} 성공 = 결과값. 실패 = NaN ???
	 * @example
	 * trace(1660*-1559.9*0.33); // output : -854513.2200000001
	 * trace(Eco.number.multiply(1660, -1559.9, 0.33)); // output : -854513.22
	 * @memberOf sfw.number
	 */ 
	pForm.sfw_multiply = Eco.number.multiply;
	
	
	
	 /**
	 * 숫자를 한글로 표기.
	 * @function sfw_intToHanGul
	 * @param {number} val 숫자 
	 * @return {string} 문자열
	 * @example
	 * var val = 1200340500.01;
	 * var str = Eco.number.intToHanGul(val);
	 * trace(str); // output : 일십이억 삼십사만 오백  소수점 영일
	 * var val = 1200340500;
	 * var str = Eco.number.intToHanGul(val);
	 * trace(str); // output : 일십이억 삼십사만 오백
	 * @memberOf sfw.number
	 */ 
	pForm.sfw_intToHanGul = Eco.number.intToHanGul;
	


	 /**
	 * 숫자를 한자로 표기.
	 * @function sfw_intToHanJa
	 * @param {number} val 숫자 
	 * @return {string} 문자열
	 * @example
	 * var val = 1200340500.01;
	 * var str = Eco.number.intToHanJa(val);
	 * trace(str); // output : 壹拾貳億 參拾四萬 五百  小數點 零壹
	 * var val = 1200340500;
	 * var str = Eco.number.intToHanJa(val);
	 * trace(str); // output : 壹拾貳億 參拾四萬 五百 
	 * @memberOf sfw.number
	 */ 	
	pForm.sfw_intToHanJa = Eco.number.intToHanJa;
	
	
	
	/**
	* 파일 사이즈 환산.
	* @function sfw_bytesToSize
	* @param {number} bytes 파일 사이즈(byte 단위)
	* @param {number=} precision 정밀도(default : 1)
	* @param {boolean=} unit 파일단위(KB,MB,...) 포함여부(default : true).
	* @return {number|string} 파일 사이즈(소수점 1자리 포함).
	* @example
	* var size = 1023405670,
	*     precision = 2,
	*     unit = false;
	* var result = Eco.number.bytesToSize(size, precision, unit);
	* trace(result); // output : 976.00
	* result = Eco.number.bytesToSize(size, 0);
	* trace(result); // output : 976 MB
	* result = Eco.number.bytesToSize(size);
	* trace(result); // output : 976.0 MB
	* @memberOf sfw.number
	*/	
	pForm.sfw_bytesToSize = Eco.number.bytesToSize;
	
	

	/**
	* 반올림할 자리의 값이 1~4인 경우는 버리고, 6~9인 경우는 올림 처리한다.<br>
	* 5의 경우 그 앞자리 값이 짝수이면 버리고, 홀수이면 올림 처리한다.<br>
	* 편중 오차를 최소화하는 방법 중의 하나로 Banker's Rounding을 사용하는 것입니다.
	* @function sfw_evenRound
	* @param {number} value 변환할 값.
	* @param {number} length 소수부.
	* @return {number} 
	* @example
	* alert(Eco.number.evenRound(1.5)); // 2
	* alert(Eco.number.evenRound(2.5)); // 2
	* alert(Eco.number.evenRound(1.535, 2)); // 1.54
	* alert(Eco.number.evenRound(1.525, 2)); // 1.52
	* @memberOf sfw.number
	*/	
	pForm.sfw_evenRound = Eco.number.evenRound;
	
	
	
	/**
	 * 주어진 숫자 형식값에 Mask Format 처리된 문자열을 반환합니다.
	 * @function sfw_getMaskNumberFormatString
	 * @param {string|number} value 숫자형식 값
	 * @param {string} strMask mask할 format 문자열.
	 * @return {string} 변환된 문자열.
	 * @example
	 * var val = 1234.567;
	 * var result = Eco.number.getMaskFormatString(val, "99.99");
	 * trace(result); // output : 1234.56
	 * result = Eco.number.getMaskFormatString(val, "9900.0099");
	 * trace(result); // output : 1234.567
	 * result = Eco.number.getMaskFormatString(val, "9,999.9");
	 * trace(result); // output : 1,234.5
	 *
	 * val = 1.2;
	 * result = Eco.number.getMaskFormatString(val, "99.99");
	 * trace(result); // output : 1.2
	 * result = Eco.number.getMaskFormatString(val, "9900.0099");
	 * trace(result); // output : 01.20
	 * result = Eco.number.getMaskFormatString(val, "9,999.9");
	 * trace(result); // output : 1.2
	 * @memberOf sfw.number
	 */		
	pForm.sfw_getMaskNumberFormatString = Eco.number.getMaskFormatString;

}