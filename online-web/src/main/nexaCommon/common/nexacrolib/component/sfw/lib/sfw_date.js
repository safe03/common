/**
 * 날짜(Date)와 관련 된 라이브러리를 등록한다.
 * @namespace sfw.date
 **/
 
var pForms = [ nexacro.Form.prototype, nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];

	/**
	 * 입력된 날짜에 OffSet으로 지정된 만큼의 날짜를 증감한다.
	 * @function sfw_addDate
	 * @param {string|date} value 'yyyyMMdd'형태로 표현된 String 또는 Date.
	 * @param {number} offset 일단위 증가(또는 감소값).
	 * @return {string} 'yyyyMMdd'형태로 표현된 String 또는 Date Value.
	 * @example
	 * // 2013/04/29 16:39:04 test함. 
	 * trace(Eco.date.addDate(new Date(), 3)); // output : Thu May 02 2013 16:39:04 GMT+0900
	 * var val = Eco.date.getMaskDateFormatString(new Date(), "yyyyMMdd");
	 * trace(Eco.date.addDate(val, 3)); // output : 20130502 
	 * @memberOf sfw.date
	 */
	pForm.sfw_addDate = Eco.date.addDate;
	
	
	/**
	 * 입력된 날짜에 OffSet 으로 지정된만큼의 월을 증감한다.
	 * @function sfw_addMonth
	 * @param {string | date} value 'yyyyMMdd' 형태로 표현된 String 또는 Date.
	 * @param {number} offset 월단위 증가(또는 감소값).
	 * @return {string} 'yyyyMMdd' 형태로 표현된 String 또는 Date Value.
	 * @example
	 * var dt = Eco.date.strToDate("20130331");
	 * var dt0 = Eco.date.addMonth(dt, 1);
	 * trace(dt0); // output : Tue Apr 30 2013 00:00:00 GMT+0900
	 * var str1 = "20130331";
	 * var str = Eco.date.addMonth(str1, 1);
	 * trace(str); // output : 20130430 
	 * @memberOf sfw.date
	 */
	pForm.sfw_addMonth = Eco.date.addMonth;
	
	
	/**
	 * 두 일자 사이의 일 수 계산.
	 * @function sfw_getDiffDay
	 * @param {date} fromDate Date Object 또는 yyyyMMdd형태의 시작일자.
	 * @param {date} toDate Date Object 또는 yyyyMMdd형태의 종료일자.
	 * @return {number} 두 일자 사이의 일 수. 단, 종료일자가 시작일자보다 작으면 음수가 return된다.
	 * @example
	 * var fromdt = Eco.date.strToDate("20120331");
	 * var todt = Eco.date.strToDate("20130420");
	 * var day = Eco.date.getDiffDay(fromdt, todt);
	 * trace(day); // output : 385
	 * var fromstr = "20120331";
	 * var tostr = "20130420";
	 * var day = Eco.date.getDiffDay(fromstr, tostr);
	 * trace(day); // output : 385
	 * @memberOf sfw.date
	 */
	pForm.sfw_getDiffDay = Eco.date.getDiffDay;
	
	
	/**
	 * 두 일자 사이의 월 수 계산.(정확한 달수를 처리하려면 fromDate Day값을 1로 하고 toDate를 마지막일자로 처리하여야 한다.)<br>
	 * 시작일자의 Day값이 1이 아니면 소수점((마지막일자 - 해당월의 일수)/마지막일자)으로 계산한다.<br>
	 * 종료일자의 Day값이 마지막일자가 아니면 소수점(해당월의 일수/마지막일자)으로 계산한다.
	 * @function sfw_getDiffMonth
	 * @param {date} fromDate Date Object 또는 yyyyMMdd형태의 시작일자.
	 * @param {date} toDate Date Object 또는 yyyyMMdd형태의 종료일자.
	 * @return {number} 두 일자 사이의 월 수. 단, 종료일자가 시작일자보다 작으면 음수가 return된다.
	 * @example
	 * var fromdt = Eco.date.strToDate("20130301");
	 * var todt = Eco.date.strToDate("20130501");
	 * var month = Math.ceil(Eco.date.getDiffMonth(fromdt, todt));
	 * trace(month); // output : 3
	 * var fromstr = "20120331";
	 * var tostr = "20130420";
	 * var month = Eco.date.getDiffMonth(fromstr, tostr);
	 * trace(month); // output : 12.69
	 * @memberOf sfw.date
	 */
	pForm.sfw_getDiffMonth = Eco.date.getDiffMonth;
	

	/**
	 * 해당월의 마지막 날짜를 숫자로 구하기.
	 * @function sfw_getLastDayOfMonth
	 * @param {number} value 'yyyyMMdd' 형태의 날짜.
	 * @return {number} 마지막 날짜 숫자값.
	 * @example
	 * var dt = Eco.date.strToDate("20120302"); // convert Date type from "20120302".
	 * var day = Eco.date.getLastDayOfMonth(dt);
	 * trace(day); // output : 31
	 * var dtstr = "20120302";
	 * var day = Eco.date.getLastDayOfMonth(dtstr);
	 * trace(day); // output : 31
	 * @memberOf sfw.date
	 */
	pForm.sfw_getLastDayOfMonth = Eco.date.getLastDayOfMonth;
	
	
	/**
	 * yyyyMMdd 형태의 날짜를 입력하면 해당연도의 날짜에 해당하는 주차반환.
	 * @function sfw_getWeekOfYear
	 * @param {date} date Date Object 또는 날짜형 문자열.
	 * @return {number} 주차에 해당하는 숫자.
	 * @example
	 * var dt = Eco.date.strToDate("20130331"); // convert Date type from "20130331".
	 * var week = Eco.date.getWeekOfYear(dt);
	 * trace(week); // output : 14
	 * var dtstr = "20130331";
	 * var week = Eco.date.getWeekOfYear(dt);
	 * trace(week); // output : 14
	 * @memberOf sfw.date
	 */
	pForm.sfw_getWeekOfYear = Eco.date.getWeekOfYear;
	
	
	/**
	 * 해당연도의 1월 1일부터 날짜까지의 일 수 반환.
	 * @function sfw_getDayOfYear
	 * @param {date} date Date Object 또는 날짜형 문자열.
	 * @return {number} 일 수.
	 * @example
	 * var dt = Eco.date.strToDate("20130420"); // convert Date type from "20130420".
	 * var days = Eco.date.getDayOfYear(dt);
	 * trace(days); // output : 110
	 * var dtstr = "20130420";
	 * var days = Eco.date.getDayOfYear(dtstr);
	 * trace(days); // output : 110
	 * @memberOf sfw.date
	 */
	pForm.sfw_getDayOfYear = Eco.date.getDayOfYear;
	
	
	/**
	 * yyyy, yyyyMM, yyyyMMdd, yyyyMMddhh, yyyyMMddhhmm, yyyyMMddhhmmss 형태의 문자열을 Date객체로 반환.
	 * @function sfw_strToDate
	 * @param {string} value 날짜 문자열.
	 * @return {date} Date Object.
	 * @example
	 * var dt = Eco.date.strToDate("20120331"); // convert Date type from "20120331".
	 * trace(dt); // output : Sat Mar 31 2012 00:00:00 GMT+0900
	 * var dt = Eco.date.strToDate("20130320123022"); // convert Date type from "20130320123022".
	 * trace(dt); // output : Wed Mar 20 2013 12:30:22 GMT+0900
	 * @memberOf sfw.date
	 */
	pForm.sfw_strToDate = Eco.date.strToDate;
	
	
	/**
	 * 윤년 여부.
	 * @function sfw_isLeapYear
	 * @param {*} value yyyyMMdd 형태의 날짜(문자열).<br>
	 *                  number 타입일 경우에는 yyyy.<br>
	 *                  JavaScript Date.<br>
	 *                  Dataset의 컬럼타입이 DATE인 컬럼값.
	 * @return {boolean} 윤년 여부(입력되지 않은 경우는 false).
	 * @example
	 * var yyyyMMdd = "20120301";
	 * var flag = Eco.date.isLeapYear(yyyyMMdd);
	 * trace(flag); // output : false
	 * var date = new Date();
	 * var flag = Eco.date.isLeapYear(date);
	 * trace(flag); // output : true		 
	 * var flag = Eco.date.isLeapYear(2016);
	 * trace(flag); // output : true
	 * var value = this.Dataset.getColumn(0, "yyyyMMdd"); // yyyyMMdd 컬럼타입은 DATE. 
	 * var flag = Eco.date.isLeapYear(value);
	 * trace(flag); // output : true		 
	 * @memberOf sfw.date
	 */
	pForm.sfw_isLeapYear = Eco.date.isLeapYear;
	

	/**
	 * 양력을 음력으로 변환해주는 함수.<br>
	 * [주의사항]<br>
	 *  1. return값이 8자리가 아니고 9자리임에 주의<br>
	 *  2. 처리가능 기간  1900 - 2040년<br>
	 *  ※ 아래 해에는 윤달이 중국과 베트남이 우리와 다름.<br>
	 *     2012년: 대한민국:3, 중국: 4, 베트남: 4
	 *     2017년: 대한민국:5, 중국: 6, 베트남: 6
	 * @function sfw_lunarToSolar
	 * @param {*} value yyyyMMdd 형태의 양력일자.
	 * @return {*} Flag(평달 = "0", 윤달 = "1") + yyyyMMdd 형태의 음력일자. 실패시 undefined.
	 * @example
	 * var dt = Eco.date.strToDate("20130331");
	 * var str = Eco.date.solarToLunar(dt);
	 * trace(str); // output : 020130220
	 * var str1 = "20130331";
	 * var str = Eco.date.solarToLunar(str1);
	 * trace(str); // output : 020130220
	 * @memberOf sfw.date
	 */		
	pForm.sfw_solarToLunar = Eco.date.solarToLunar;
	

	/**
	 * 음력을 양력으로 변환.
	 * @function lunarToSolar
	 * @param {*} value Date object 또는 yyyyMMdd 형태의 음력일자.
	 * @param {boolean} leapMonth 윤달 여부.
	 * @return {string} yyyyMMdd 형태의 양력일자. 실패시 undefined.
	 * @example
	 * var dt = Eco.date.strToDate("20120331");
	 * var str = Eco.date.lunarToSolar(dt, false);
	 * trace(str); // output : undefined <-- 정상적인 값이 아닐 때는 alert 표시됨.
	 * 
	 * var dt = Eco.date.strToDate("20120201");
	 * var str = Eco.date.lunarToSolar(dt, false);
	 * trace(str); // output : 20160309
	 * 
	 * @memberOf sfw.date
	 */	
	pForm.sfw_lunarToSolar = Eco.date.lunarToSolar;
	
	 
	/**
	 * 전달된 月의 1일 만들기.
	 * @function sfw_getFirstDate
	 * @param {string} value Date object 또는 yyyyMMdd 형태의 일자.
	 * @return {string} yyyyMM01.
	 * @example
	 * var dt = Eco.date.strToDate("20120331");
	 * var dt1 = Eco.date.getFirstDate(dt);
	 * trace(dt1); // output : Thu Mar 01 2012 00:00:00 GMT+0900
	 * var str1 = "20120331";
	 * var str = Eco.date.getFirstDate(str1);
	 * trace(str); // output : 20120301
	 * @memberOf sfw.date
	 */	
	pForm.sfw_getFirstDate = Eco.date.getFirstDate;
	
	
	/**
	 * 날짜 차이 반환.
	 * @function sfw_getDiffTime
	 * @param {string} date1 yyyyMMddHHMMSS 형태의 일자.
	 * @param {string} date2 yyyyMMddHHMMSS 형태의 일자.
	 * @return {array} 두 날짜의 기간.[일,시,분,초]
	 * @example
	 * var dt0 = Eco.date.strToDate("20130302113022");
	 * var dt1 = Eco.date.strToDate("20130305145032");
	 * var etime = Eco.date.getDiffTime(dt0, dt1); // return Array Type [일, 시, 분, 초]
	 * trace(etime); // output : 3,3,20,10
	 * var str0 = "20130302113022";
	 * var str1 = "20130305145032";
	 * var etime = Eco.date.getDiffTime(str0, str1); // return Array Type [일, 시, 분, 초]
	 * trace(etime); // output : 3,3,20,10
	 * @memberOf sfw.date
	 */	
	pForm.sfw_getDiffTime = Eco.date.getDiffTime;
	
	/**
	 * 주어진 날짜 객체의 Mask Format 처리된 문자열을 반환.<br>
	 * 요일명칭, 월 명칭, 오전/오후 명칭 표시 처리는 Eco.date에 정의된 값으로 처리된다.<br><br>
	 * @function sfw_getMaskDateFormatString
	 * Eco.date.weekName : 요일명칭(Array value), <br>
	 * Eco.date.weekShortName : 요일축약명칭(Array value),<br>
	 * Eco.date.monthName : 월명칭(Array value),<br>
	 * Eco.date.monthShortName : 월축약 명칭(Array value),<br>
	 * Eco.date.ttName : 오전/오후 명칭(Array value)
	 * @param {date} dt Date 개체.
	 * @param {string} strMask mask할 format 문자열.
	 * @return {string} 변환된 문자열.
	 * @example
	 * var dt = Eco.date.strToDate("20130430123412"); // convert Date type from "20130430123412".
	 * trace(Eco.date.getMaskFormatString(dt, "yyyy년 MM월 dd일 tt hh시 mm분 ss초")); // output : 2013년 04월 30일 오후 12시 34분 12초
	 * trace(Eco.date.getMaskFormatString(dt, "yyyy-MM-dd")); // output : 2013-04-30
	 * trace(Eco.date.getMaskFormatString(dt, "yy MM.dd")); // output : 13 04.30
	 * trace(Eco.date.getMaskFormatString(dt, "yyyy-MM-dd W \\Week")); // output : 2013-04-30 18 Week
	 * trace(Eco.date.getMaskFormatString(dt, "MMMM dddd")); // output : 4월 화요일
	 * @memberOf sfw.date
	 */
	pForm.sfw_getMaskDateFormatString = Eco.date.getMaskFormatString;
	
	
	
	
	/**
	 * 클라이언트 기준 현재 일자를 반환한다.
	 * @function sfw_today
	 * @return {string} yyyyMMdd.
	 * @memberOf sfw.date
	 */	
	pForm.sfw_today = function(){	
		var d, s = "";
		d = new Date();   

		s += String(d.getFullYear());
		s += String((d.getMonth() + 1) ).padLeft(2,"0");
		s += String(d.getDate()).padLeft(2,"0");

		return s;
	}
}