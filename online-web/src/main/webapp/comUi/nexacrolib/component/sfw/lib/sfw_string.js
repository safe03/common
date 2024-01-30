 /**
 * 문자열(string)과 관련된 기능을 등록한다.
 * @namespace sfw.string
 **/

var pForms = [ nexacro.Form.prototype
             , nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];
	
	
	/**
	 * 문자열의 위치를 대소문자 구별없이 찾는다.
	 * @function sfw_indexOfIgnoreCase
	 * @param {string} value 원래 문자열( 예 : "aaBBbbcc" )
	 * @param {string} sFind 찾고자 하는 문자열( 예 : "bb" )
	 * @param {number} nStart 검색 시작위치 (옵션 : Default=0) ( 예 : 1 ) 
	 * @return {number} 찾고자 하는 문자열의 시작위치 ( 예 : 2 ). 실패 = -1.
	 * @example
	 * var str = "DCABCABAABAAB",
	 *     findStr = "ab";
	 * var idx = Eco.string.indexOfIgnoreCase(str, findStr);
	 * trace(idx); // output : 2
	 * idx = Eco.string.indexOfIgnoreCase(str, findStr, 3);
	 * trace(idx); // output : 5
	 * @memberOf sfw.string
	 */
	pForm.sfw_indexOfIgnoreCase = Eco.string.indexOfIgnoreCase;
	
	
	
	 /**
	 * 문자열을 대소문자 구별없이 주어진 변경문자열(문자) 치환한다.
	 * @function sfw_replaceIgnoreCase
	 * @param {string} sOrg 원래 문자열( 예 : "aaBBbbcc" )
	 * @param {string} sRepFrom 찾고자 하는 문자열( 예 : "bb" )
	 * @param {string} sRepTo 치환될 문자열 ( 예 : "xx" )
	 * @return {number} 치환된 문자열 ( 예 : "aaxxxxccxx" ).
	 * @example
	 * var str = "DCABCABAABAAB",
	 *     findStr = "ab";
	 * var str = Eco.string.replaceIgnoreCase(str, findStr, "x");
	 * trace(str); // output : DCxCxAxAx
	 * @memberOf sfw.string
	 */ 
	pForm.sfw_replaceIgnoreCase = Eco.string.replaceIgnoreCase;
	
	
	
	 /**
	 * 문자열의 위치를 대소문자 구별없이 오른쪽에서 왼쪽으로 검색이 수행됩니다.
	 * @function sfw_lastIndexOfIgnoreCase
	 * @param {string} source 원래 문자열( 예 : "aaBBbbcc" )
	 * @param {string} target 찾고자 하는 문자열( 예 : "BB" )
	 * @param {string=} opt_start 검색 시작위치 index(Default=문자열의 끝 )
	 * @return {number} 찾고자 하는 문자열의 시작위치
	 * @example
	 * var str = "CABCDABCDABCD",
	 *     findStr = "abc";
	 * var idx = Eco.string.lastIndexOfIgnoreCase(str, findStr);
	 * trace(idx); // output : 9
	 * idx = Eco.string.lastIndexOfIgnoreCase(str, findStr, 8);
	 * trace(idx); // output : 5
	 * @memberOf sfw.string
	 */
	pForm.sfw_lastIndexOfIgnoreCase = Eco.string.lastIndexOfIgnoreCase;
	
	

	/**
	 * 문자열의 오른쪽에서 length만큼의 문자열을 가져온다.
	 * @function getRightStr
	 * @param {string} source 원래 문자열( 예 : "aaBBbbcc" )
	 * @param {number} length 가져올문자열 길이 ( 예 : 2 )
	 * @return {boolean} 오른쪽에서 length만큼의 문자열 ( 예 : "cc" )]
	 * @example
	 * var str = "myT1 and myT2 are the strings used for padding";
	 * var res = Eco.string.getRightStr(str, 7);
	 * trace(res); // output : padding
	 * @memberOf sfw.string
	 */	
	pForm.sfw_getRightStr                 = Eco.string.getRightStr;
	
	
	
	/**
	 * 문자열을 "좌 or 우" + "대소문자 구분유무"로 첫번째 일치되는 문자열 제거.
	 * @function sfw_removeStr
	 * @param {string} source 원래 문자열( 예 : "aaBBbbcc" )
	 * @param {string} target 제거할 문자열( 예 : "cc" )
	 * @param {string} direction 삭제방향."left(default)", "right".
	 * @param {boolean=} opt_ignoreCase 대소문자구분유무.true(default), false.
	 * @return {string} 제거된 문자열.
	 * @example
	 * var str = "www.domain.com";
	 * var result = Eco.string.removeStr(str, "www.");
	 * trace(result); // output : domain.com
	 * str = "www.tobesoft.com, www.tobesoft.co.kr";
	 * result = Eco.string.removeStr(str, ".com", "right");
	 * trace(result); // output : www.tobesoft, www.tobesoft.co.kr
	 * str = "www.tobesoft.COM, www.tobesoft.co.kr";
	 * result = Eco.string.removeStr(str, ".com", "right", false);
	 * trace(result); // output : www.tobesoft, www.tobesoft.co.kr
	 * @memberOf sfw.string
	 */	 
	pForm.sfw_removeStr = Eco.string.removeStr;
	
	
	
	/**
	 * 문자열 내의 {0},{1}...{n}값을 전달받은 arguments로 치환.
	 * @function sfw_format
	 * @param {string} str 대상 문자열.
	 * @param {arguments} arguments 식별자 {N}을 대체할 값.
	 * @return {string} 치환된 문자열.
	 * @requires Eco.formatRegExp
	 * @example
	 * var str = "I {0} a {1} {2}.";
	 * Eco.string.format(str, "am", "cool", "guy"); //return "I am a cool guy."
	 *
	 * str = "Currency: [{0}], Date : [{1}], JuminNo: [{2}]";
	 * var result = Eco.string.format(str,
	 *      Eco.number.getMaskFormatString(12301234, "#,###"),
	 *      Eco.date.getMaskFormatString(new Date(), "yyyy-MM-dd tt hh:mm"),
	 *      Eco.string.getMaskFormatString("6601011234567", "@@@@@@-{@@@@@@@}")
	 *    );
	 * trace(result); // output : Currency: [12,301,234], Date : [2013-05-03 오후 07:49], JuminNo: [660101-*******]
	 * @memberOf sfw.string
	 */	 	
	pForm.sfw_format = Eco.string.format;
	
	
	
	/**
	 * 문자열 길이계산.
	 * @function sfw_getLength
	 * @param {string} str 대상 문자열.
	 * @param {string=} unit 문자열의 길이를 검사하는 단위 .  "utf16" - 한문자당 1의 값으로 합산함(default). "utf8"  - 한 문자당 영문1, 다국어 2~5의 값으로 합산함. "ascii" - 한문자당 영문 1, 한글 2의 값으로 합산함.
	 * @return {number} 문자열 길이.
	 * @example
	 * var str = "unit 문자열";
	 * var len = Eco.string.getLength(str);
	 * trace(len); // output : 8
	 * len = Eco.string.getLength(str, "ascii");
	 * trace(len); // output : 11
	 * len = Eco.string.getLength(str, "utf8");
	 * trace(len); // output : 14
	 * @memberOf sfw.string
	 */	 	
	pForm.sfw_getLength = Eco.string.getLength;
	
	

	/**
	 * 문자열의 특수문자(개행문자 Tab문자 ~ ` ! @ # $ % % ^ & * - = + 등) 포함개수.
	 * @function sfw_countNonword
	 * @param {string} str 대상 문자열.
	 * @return {number} 특수문자 개수.
	 * @example
	 * var str = "2011-12-27\r\n\t~`";
	 * var cnt = Eco.string.countNonword(str);
	 * trace(cnt); // output : 7
	 * @memberOf sfw.string
	 */	 
	pForm.sfw_countNonword = Eco.string.countNonword;
	
	
	
	/**
	 * 전각문자를 반각문자로 변환.<br><br>
	 * 참고: <br>
	 * 전각문자는 "정사각형" 안에 들어가는 문자이고, <br>
	 * 반각은 그 정사각형의 반쪽에 들어가는 문자이다.<br>
	 * 전각문자의 폭은, 반각문자의 2배입니다. <br><br>
	 * 예를 들어 숫자 "3" 은, 한글 "가"의 절반의 폭만을 가지고 있습니다. <br>
	 * 그래서 영문과 숫자 등은 반각이고, 한글이나 한자들은 전각문자입니다. <br>
	 * 다만, 영문과 숫자를 전각으로 표현할 수도 있습니다.<br>
	 * 예 : 전각문자 ==> ※★０＋ , 반각문자 ==> 1a 
	 * @function sfw_strFullToHalf
	 * @param {string} str 전각문자( 예 : "０＋" ).
	 * @return {string} 반각문자 ( 예 : "0+" ).
	 * @example
	 * var var str = "０１＋ｗｏｒｌｄ투비소프트";
	 * var result = Eco.string.strFullToHalf(str);
	 * trace(result); // output : 01+world투비소프트
	 * @memberOf sfw.string
	 */	 
	pForm.sfw_strFullToHalf = Eco.string.strFullToHalf;
	
	

	/**
	 * 반각문자를 전각문자로 변환.
	 * @function sfw_strHalfToFull
	 * @param {string} str 반각문자( 예 : "0+" ).
	 * @return {string} 전각문자 ( 예 : "０＋" ).
	 * @example
	 * var var str = "01+world투비소프트";
	 * var result = Eco.string.strHalfToFull(str);
	 * trace(result); // output : ０１＋ｗｏｒｌｄ투비소프트
	 * @memberOf sfw.string
	 */	 	 
	pForm.sfw_strHalfToFull = Eco.string.strHalfToFull;
	
	
	
	/**
	 * 주어진 문자열을 n회 반복해서 반환한다.
	 * @function sfw_repeatStr
	 * @param {string} str 반복할 문자열.
	 * @param {number} count 반복 횟수.
	 * @return {string} 반복된 문자열
	 * @example
	 * var str = "0";
	 * var result = Eco.string.repeatStr(str, 4);
	 * trace(result); // output : 0000
	 * @memberOf sfw.string
	 */
	pForm.sfw_repeatStr = Eco.string.repeatStr;
	
	
	
	/**
	 * 한글 → 유니코드로 변환.
	 * @function sfw_hanGulToUnicode
	 * @param {string} str 한글 문자열.
	 * @return {string} 유니코드.
	 * @example
	 * var str = "www.투비소프트.com";
	 * var result = Eco.string.hanGulToUnicode(str);
	 * trace(result); // output : www.\uD22C\uBE44\uC18C\uD504\uD2B8.com
	 * @memberOf sfw.string
	 */	 
	pForm.sfw_hanGulToUnicode = Eco.string.hanGulToUnicode;
	
	
	
	/**
	 * 유니코드 → 한글로 변환.
	 * @function sfw_unicodeToHanGul
	 * @param {string} str 유니코드 문자열.
	 * @return {string} 한글.
	 * @example
	 * var str = "www.\uD22C\uBE44\uC18C\uD504\uD2B8.com";
	 * var result = Eco.string.unicodeToHanGul(str);
	 * trace(result); // output : www.투비소프트.com
	 * @memberOf sfw.string
	 */	 	
	pForm.sfw_unicodeToHanGul = Eco.string.unicodeToHanGul;
	
	
	
	/**
	 * file, folder, or shortcut명에 허용되지 않는 특수문자 치환.<br>
	 * \ / : * ? " < > | 를 치환한다.
	 * @function sfw_replaceInvalidFileNameChars
	 * @param {string} str 문자열.
	 * @param {string=} opt_newvalue 치환할 문자열(default: underscore( "_" ) ).
	 * @return {string} 허용되지 않는 특수문자를 치환한 문자열.
	 * @example
	 * var str = "test:uploadfile.php";
	 * var result = Eco.string.replaceInvalidFileNameChars(str);
	 * trace(result); // output : test_uploadfile.php
	 * str = "test-uploadfile.php";
	 * result = Eco.string.replaceInvalidFileNameChars(str);
	 * trace(result); // output : test-uploadfile.php
	 * @memberOf sfw.string
	 */
	pForm.sfw_replaceInvalidFileNameChars = Eco.string.replaceInvalidFileNameChars;
	
	
	
	/**
	 * 문자열에서 multibyte character(한글, 한자, 일어)을 제거.
	 * @function sfw_removeMultibyteChar
	 * @param {string} str 문자열.
	 * @return {string} multibyte character가 제거된 문자열.
	 * @example
	 * var str = "unit문자열s五ご";
	 * var result = Eco.string.removeMultibyteChar(str);
	 * trace(result); // output : units
	 * @memberOf sfw.string
	 */	
	pForm.sfw_removeMultibyteChar = Eco.string.removeMultibyteChar;
	
	
	
	/**
	 * 지정된 문자로 시작하는지 여부.
	 * @function sfw_startsWith
	 * @param {string} str 문자열.
	 * @param {string} target 대상문자열.
	 * @return {boolean} 시작하는지 여부.
	 * @example
	 * var str = "Hello World!";
	 * var result = Eco.string.startsWith(str, "He");
	 * trace(result); // output : true
	 * result = Eco.string.startsWith(str, "hew");
	 * trace(result); // output : false
	 * @memberOf sfw.string
	 */
	pForm.sfw_startsWith = Eco.string.startsWith;
	
	
	
	/**
	 * 지정된 문자로 끝나는지 여부.
	 * @function sfw_endsWith
	 * @param {string} str 문자열.
	 * @param {string} target 대상문자열.
	 * @return {boolean} 끝나는지 여부.
	 * @example
	 * var str = "Hello World!";
	 * var result = Eco.string.endsWith(str, "ld!");
	 * trace(result); // output : true
	 * result = Eco.string.endsWith(str, "Wor");
	 * trace(result); // output : false
	 * @memberOf sfw.string
	 */
	pForm.sfw_endsWith = Eco.string.endsWith;
	
	

	/**
	* unicode 문자열 -> decimal표시 문자열로 변경.<br>
	* (ex : left,right delimiter가 default 값으로 주어지면 space문자 -> &#38;#32; 로 변경된다.)  
	* @function sfw_unicodeToDecimal
	* @param {string} val 대상 unicodeString
	* @param {string=} leftDelimiter 문자를 Decimal 표시할 때 좌측에 표시하는 문자열(default:"&#")
	* @param {string=} rightDelimiter 문자를 Decimal 표시할 때 우측에 표시하는 문자열(default:";")
	* @return {string} unicode 문자열을 decimal값으로 표시한 문자열
	* @example
	* var str = "form 로딩";
	* var result = Eco.string.unicodeToDecimal(str);
	* trace(result); // output : &#38;#102;&#38;#111;&#38;#114;&#38;#109;&#38;#32;&#38;#47196;&#38;#46377;
	* @memberOf sfw.string
	*/
	pForm.sfw_unicodeToDecimal = Eco.string.unicodeToDecimal;
	
	

	/**
	* decimal표시된 문자열 -> unicode 문자열로 변경.<br>
	* (ex : left,right delimiter가 default이면 &#38;#32; -> space문자)  
	* @function sfw_decimalToUnicode
	* @param {string} val 대상 decimal표시된 문자열
	* @param {string=} leftDelimiter 문자를 Decimal 표시할 때 좌측에 표시하는 문자열(default:"&#")
	* @param {string=} rightDelimiter 문자를 Decimal 표시할 때 우측에 표시하는 문자열(default:";")
	* @return {string} decimal값으로 표시한 문자열을 unicode 문자열
	* @example
	* var str = "&#38;#102;&#38;#111;&#38;#114;&#38;#109;&#38;#32;&#38;#47196;&#38;#46377;";
	* var result = Eco.string.decimalToUnicode(str);
	* trace(result); // output : form 로딩
	* @memberOf sfw.string
	*/
	pForm.sfw_decimalToUnicode = Eco.string.decimalToUnicode;
	
	
	
	/**
	* unicode 문자열 -> hex표시 문자열로 변경.<br>
	* (ex : left,right delimiter가 default 값으로 주어지면 space문자 -> &#38;#x20; 로 변경된다.)  
	* @function sfw_unicodeToHex
	* @param {string} val 대상 unicodeString
	* @param {string=} leftDelimiter 문자를 hex 표시할 때 좌측에 표시하는 문자열(default:"&#x")
	* @param {string=} rightDelimiter 문자를 hex 표시할 때 우측에 표시하는 문자열(default:";")
	* @return {string} unicode 문자열을 hex값으로 표시한 문자열
	* @example
	* var str = "form 로딩";
	* var result = Eco.string.unicodeToHex(str);
	* trace(result); // output : &#38;#x66;&#38;#x6F;&#38;#x72;&#38;#x6D;&#38;#x20;&#38;#xB85C;&#38;#xB529;
	* @memberOf sfw.string
	*/
	pForm.sfw_unicodeToHex = Eco.string.unicodeToHex;
	
	
	
	/**
	* hex표시 문자열 ->  unicode 문자열로 변경.<br>
	* (ex : left,right delimiter가 default 값으로 주어지면 &#38;#x20; -> space문자 로 변경된다.)  
	* @function sfw_hexToUnicode
	* @param {string} val 대상 hex표시 문자열
	* @param {string=} leftDelimiter 문자를 hex 표시할 때 좌측에 표시하는 문자열(default:"&#x")
	* @param {string=} rightDelimiter 문자를 hex 표시할 때 우측에 표시하는 문자열(default:";")
	* @return {string} hex값으로 표시한 문자열을 unicode 문자열
	* @example
	* var str = "&#38;#102;&#38;#111;&#38;#114;&#38;#109;&#38;#32;&#38;#47196;&#38;#46377;";
	* var result = Eco.string.hexToUnicode(str);
	* trace(result); // output : form 로딩
	* @memberOf sfw.string
	*/
	pForm.sfw_hexToUnicode = Eco.string.hexToUnicode;
	
	

	/**
	* unicode 문자열 -> utf-8 인코딩 hex표시된 문자열로 변경.<br>
	* (ex : left,right delimiter가 default 값으로 주어지면 space문자 -> 20 로 변경된다.)  
	* @function sfw_unicodeToUtf8
	* @param {string} val 대상 unicodeString
	* @param {string=} leftDelimiter 문자를 utf-8 인코딩 hex 표시할 때 좌측에 표시하는 문자열(default:"")
	* @param {string=} rightDelimiter 문자를 utf-8 인코딩 hex 표시할 때 우측에 표시하는 문자열(default:" ")
	* @return {string} unicode 문자열을 utf-8 인코딩 hex값으로 표시한 문자열
	* @example
	* var str = "form 로딩";
	* var result = Eco.string.unicodeToUtf8(str);
	* trace(result); // output : 66 6F 72 6D 20 EB A1 9C EB 94 A9
	* @memberOf sfw.string
	*/
	pForm.sfw_unicodeToUtf8 = Eco.string.unicodeToUtf8;
	
	
	
	/**
	* utf-8 인코딩 hex표시된 문자열 -> unicode 문자열로 변경.<br>
	* (ex : left,right delimiter가 default 값으로 주어지면 20 -> space문자 로 변경된다.)  
	* @function sfw_utf8ToUnicode
	* @param {string} val 대상 utf-8 인코딩 hex표시된 문자열
	* @param {string=} leftDelimiter 문자를 utf-8 인코딩 hex 표시할 때 좌측에 표시하는 문자열(default:"")
	* @param {string=} rightDelimiter 문자를 utf-8 인코딩 hex 표시할 때 우측에 표시하는 문자열(default:" ")
	* @return {string} utf-8 인코딩 hex값으로 표시한 문자열 -> unicode 문자열
	* @example
	* var str = "66 6F 72 6D 20 EB A1 9C EB 94 A9";
	* var result = Eco.string.utf8ToUnicode(str);
	* trace(result); // output : form 로딩
	* @memberOf sfw.string
	*/
	pForm.sfw_utf8ToUnicode = Eco.string.utf8ToUnicode;
	
	
	
	/**
	 * 주어진 문자열의 Mask Format 처리된 문자열을 반환합니다.
	 * @function sfw_getStringMaskFormatString
	 * @param {string} val 원본 문자열.
	 * @param {string} strMask mask할 format 문자열.
	 * @param {string=} maskChr mask 문자.
	 * @return {string} 변환된 문자열.
	 * @example
	 * var str = "20060607";
	 * var result = Eco.string.getMaskFormatString(str, "@@@@-@@-@@");
	 * trace(result); // output : 2006-06-07
	 *
	 * str = "6601011234567";
	 * result = Eco.string.getMaskFormatString(str, "######-{#######}");
	 * trace(result); // output : 660101-*******
	 * @memberOf sfw.string
	 */
	pForm.sfw_getStringMaskFormatString = Eco.string.getMaskFormatString;
	

	/**
	 * XML 의 예약문자,특수문자를 치환하여 반환.<br><br>
	 * 대상문자 : &, <, >, ', ", \t, \r, \n
	 * @param {string} str 문자열.
	 * @return {string} 치환된 문자열.
	 * @example
	 *
	 * trace(Eco.string.escapeXML("1 > 0")); // output : 1 &gt; 0
	 * trace(Eco.string.escapeXML("Q&A")); // output : Q&amp;A
	 *
	 * @memberOf sfw.string
	 */
	pForm.sfw_escapeXML = Eco.string.escapeXML;
	
	
	
	/**
	 * 주어진 문자열을 첫 문자만 대문자 변경
	 * @function sfw_capitalize
	 * @param {string} str
	 * @return {string} 첫 문자 대문자 처리된 문자
	 * @example
	 *
	 * trace(Eco.string.capitalize("point")); // output : Point
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_capitalize = Eco.string.capitalize;
	
	
	
	/**
	 * 주어진 문장열에서 '-' 제거하고 제거된 위치에서 첫 문자만 대문자 변경
	 * @function sfw_camelize
	 * @param {string} str
	 * @return {string} 처리된 문자
	 * @example
	 *
	 * trace(Eco.string.camelize("create-point")); // output : createPoint
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_camelize = Eco.string.camelize;
	
	

	/**
	 * 주어진 문장열에서 대문자 기준으로 '-' 삽입하고 대문자는 소문자 변경
	 * @function sfw_hyphenate
	 * @param {string} str
	 * @return {string} 처리된 문자
	 * @example
	 *
	 * trace(Eco.string.hyphenate("createPoint")); // output : create-point
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_hyphenate = Eco.string.hyphenate;



	/**
	 * 주어진 문장열에서 소문자로 변경
	 * @function sfw_toLower
	 * @param {string} str 소문자로 변경할 값
	 * @return {string} 처리된 문자
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_toLower = function(str) {
		
		return typeof str == 'string' ? str.toLowerCase() : new String(str);
	}
	


	/**
	 * 주어진 문장열에서 대문자로 변경
	 * @function sfw_toUpper
	 * @param {string} str 대문자로 변경할 값
	 * @return {string} 처리된 문자
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_toUpper = function(str) {
		return typeof str == 'string' ? str.toUpperCase() : new String(str);
	}
	
 
	/**
	 * 주어진 문장열에서 왼쪽에 반복 횟수만큼 문자열 추가.
	 * @function sfw_padLeft
	 * @param {string} sOriginStr - 원본 문자열
	 * @param {string} sPadding - 패딩 할 문자열(" "*)
	 * @param {number} nCount - 반복횟수(1*)
	 * @return {string} 처리된 문자열
	 * @example
	 *
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_padLeft = function(sOriginStr, sPadding, nCount) 
	{
	 
		var i, sReturnValue = "";
		
		//- 널값일 경우 빈 문자열 반환
		if( this.sfw_isNull(sOriginStr) )
		{
			return "";
		}
		
		//- 패딩 값이 없을 경우 " " 공백 문자열 할당
		if( this.sfw_isNull(sPadding) )
		{
			sPadding = " ";
		}
		
		if( this.sfw_isNull(nCount) )  
		{
			nCount = 1;
		}
		
		//- 반복 횟수 확인
		nCount = nCount - sOriginStr.length;
		
		//- 반복 채움
		for( i = 0 ; i < nCount ; i++ )
		{
			sReturnValue += sPadding;
			
		}
		
		sReturnValue += sOriginStr;
		
		return sReturnValue;
	}
	
	/**
	 * 주어진 문장열에서 왼쪽에 반복 횟수만큼 문자열 추가.
	 * @function fn_fillLeft
	 * @param {string} sOriginStr - 원본 문자열
	 * @param {string} sPadding - 패딩 할 문자열(" "*)
	 * @param {number} nCount - 반복횟수(1*)
	 * @return {string} 처리된 문자열
	 * @example
	 *
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_fillLeft = function(sOriginStr, sPadding, nCount) 
	{
	 
		var i, sReturnValue = "";
		
		//- 널값일 경우 빈 문자열 반환
		if( this.sfw_isNull(sOriginStr) )
		{
			return "";
		}
		
		//- 패딩 값이 없을 경우 " " 공백 문자열 할당
		if( this.sfw_isNull(sPadding) )
		{
			sPadding = " ";
		}
		
		if( this.sfw_isNull(nCount) )  
		{
			nCount = 1;
		}
		
		for( i = 0 ; i < nCount ; i++ )
		{
			sReturnValue += sPadding;
			
		}
		
		sReturnValue += sOriginStr;
		
		return sReturnValue;
	}

	/**
	 * 주어진 문장열에서 왼쪽에 반복 횟수만큼 문자열 추가.
	 * @function fn_padLeft
	 * @param {string} sOriginStr - 원본 문자열
	 * @param {string} sPadding - 패딩 할 문자열(" "*)
	 * @param {number} nCount - 반복횟수(1*)
	 * @return {string} 처리된 문자열
	 * @example
	 *
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_padRight = function(sOriginStr, sPadding, nCount) 
	{
	 
		var i, sReturnValue = "";
		
		//- 널값일 경우 빈 문자열 반환
		if( this.sfw_isNull(sOriginStr) )
		{
			return "";
		}
		
		//- 패딩 값이 없을 경우 " " 공백 문자열 할당
		if( this.sfw_isNull(sPadding) )
		{
			sPadding = " ";
		}
		
		if( this.sfw_isNull(nCount) )  
		{
			nCount = 1;
		}
		
		//- 반복 횟수 확인
		nCount = nCount - sOriginStr.length;
		
		//- 반복 채움
		for( i = 0 ; i < nCount ; i++ )
		{
			sReturnValue += sPadding;
		}
		
		sReturnValue = sReturnValue + sOriginStr;
		
		return sReturnValue;
	}
	
	/**
	 * 주어진 문장열에서 왼쪽에 반복 횟수만큼 문자열 추가.
	 * @function fn_fillLeft
	 * @param {string} sOriginStr - 원본 문자열
	 * @param {string} sPadding - 패딩 할 문자열(" "*)
	 * @param {number} nCount - 반복횟수(1*)
	 * @return {string} 처리된 문자열
	 * @example
	 *
	 *		 
	 * @memberOf sfw.string
	 */
	pForm.sfw_fillRight = function(sOriginStr, sPadding, nCount) 
	{
	 
		var i, sReturnValue = "";
		
		//- 널값일 경우 빈 문자열 반환
		if( this.sfw_isNull(sOriginStr) )
		{
			return "";
		}
		
		//- 패딩 값이 없을 경우 " " 공백 문자열 할당
		if( this.sfw_isNull(sPadding) )
		{
			sPadding = " ";
		}
		
		if( this.sfw_isNull(nCount) )  
		{
			nCount = 1;
		}
		
		for( i = 0 ; i < nCount ; i++ )
		{
			sReturnValue += sPadding;
		}
		
		sReturnValue = sReturnValue + sOriginStr;
		
		return sReturnValue;
	}

}