/**
 * @namespace sfw
 * @fileoverview 공유 리소스를 처리 하는 함수를 정의한다.
 **/
 
var _trim = nexacro.trim;

//- nexacro trim null, undefined 값 치환
nexacro.trim = function(str) {

	if(!str) return "";

	return typeof str == 'string' ? _trim(str) : new String(str);
}


var _wrapQuote = nexacro.wrapQuote;

//- nexacro. wrapQuote의 null값 검증
nexacro.wrapQuote = function(str) {

	if(!str) return _wrapQuote("");

	return typeof str == 'string' ? _wrapQuote(str) : _wrapQuote(new String(str));
}