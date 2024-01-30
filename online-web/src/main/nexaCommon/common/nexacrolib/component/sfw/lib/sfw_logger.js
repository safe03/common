 /**
 * nexacro loggin과 관련된 기능을 등록한다.
 * @namespace sfw.logger
 **/

var pForm = nexacro.Form.prototype;

/**
 * node.js 파일에 inspect 함수를 참조하여 작성하였음.
 * 주어진 obj에 대한 값을 json 방식으로 출력하는 string값을 반환한다.
 * @function sfw_inspect
 * @param {*} obj 출력할 대상
 * @param {boolean=} showHidden object에 javascript에서 내부적으로 정의 메소드도 나타나게 한다.(default: false)
 * @param {number=} depth 출력할 depth 정의.(default: 2)
 * @param {boolean=} colors 출력시에 string, number, Date값등에 대한 색깔 표시 여부(default: false)
 * @param {boolean=} customInspect 출력시에 만약 obj에 inspect메소드가 존재하면 그것을 사용한다.(default: true)
 * @memberOf sfw.logger
 */
pForm.sfw_inspect = Eco.Logger.inspect;



/**
 * 경과시간 체크를 위한 시작시간을 지정한다.<br>
 * 본 메소드를 호출하지 않으면 Logger 초기 로딩시간 부터 적용.
 * @public
 * @example
 * // 경과시간 시작시간 지정 
 * // elapsed 옵션을 포함한 로깅이 실행되면 초기화 됨
 * // 시작시간을 지정하지 않으면 Logger가 최초 include된 시점이 시작시간
 * Eco.Logger.startElapsed();
 * 
 * var a = 0;
 * for (var i=0; i<10000; i++)
 * {
 *     a = a + i;
 * }
 * 
 * Eco.Logger.debug({message: "test !!!", elapsed: true});
 * // result : 2013-05-07 16:28:34.093 [debug] Button11_onclick - test !!! (Elapsed Time : 0.005 sec)
 * @function sfw_startElapsed
 * @memberOf sfw.logger
 */
pForm.sfw_startElapsed = Eco.Logger.startElapsed;


/**
 * 현재 필터 구분자를 얻어온다.
 * @public
 * @function sfw_getFilter
 * @return {string} filter 구분자.
 * @example
 * var filter = Eco.Logger.getFilter();
 * if ( filter == "" )
 * {
 *     Eco.Logger.setFilter("Test1");
 * }
 * @memberOf sfw.logger
 */
pForm.sfw_getFilter = Eco.Logger.getFilter;



/**
 * 필터 지시자를 지정한다.<br>
 * 로그 호출시 해당 지시자만 필터링되어 출력한다.<br>
 * (필터에 해당하지 않더라도 출력하지 않을뿐 buffer에는 저장된다.)
 * @public
 * @function sfw_setFilter
 * @param {string} filter 구분자.
 * @example
 * // filter 지정으로 특정 지시자에 해당하는 로그를 볼 수 있다.
 * Eco.Logger.setFilter("Test2");
 * 
 * Eco.Logger.debug({message: "Filter 1 !!!", filter: "Test1"});
 * // result : 없음
 * Eco.Logger.debug({message: "Filter 2 !!!", filter: "Test2"});
 * // result : 2013-05-07 16:32:43.200 [debug] Button13_onclick - Filter 2 !!!
 * @memberOf sfw.logger
 */	
pForm.sfw_setFilter = Eco.Logger.setFilter;



/**
 * fatal 레벨 로그를 남긴다.<br><br>
 * - argument로 string 전달시 기본 출력할 수 있다.<br>
 * - argument로 Object 전달시 메시지 옵션을 추가할 수 있다. 지원하는 옵션은 아래와 같다.<br>
 *   message : string  (출력할 메시지)<br>
 *   elapsed : boolean (경과시간 표시여부)<br>
 *   dump    : object  (개체 속성 나열)<br>
 *   stack   : true    (call stack 표시여부)<br>
 *   filter  : string  (로그 필터 지시자)<br><br>
 * - 본 메소드는 logLevel에 상관없이 출력된다.<br>
 * - logLevel이 0(fatal) 이상일 경우 buffer에 적재된다.<br>
 * - 본 메소드는 Error 개체를 throw 한다.
 * @public
 * @function sfw_fatal
 * @param {string|object} msg 출력할 메시지 또는 옵션을 포함한 Object.
 * @example
 *
 * Eco.Logger.fatal("심각한 오류 발생 !!!");
 * // result : 2013-05-07 15:12:51.410 [fatal] Button00_onclick - 심각한 오류 발생 !!!
 *
 * // 경과시간 시작시간 지정 
 * // elapsed 옵션을 포함한 로깅이 실행되면 초기화 됨
 * // 시작시간을 지정하지 않으면 Logger가 최초 include된 시점이 시작시간
 * Eco.Logger.startElapsed();
 *
 * var a = 0;
 * for (var i=0; i<10000; i++)
 * {
 *     a = a + i;
 * }
 *
 * Eco.Logger.fatal({message: "fatal !!!", elapsed: true});
 * // result : 2013-05-07 15:20:07.171 [fatal] Button01_onclick - fatal !!! (Elapsed Time : 0.004 sec)
 * 
 * @memberOf sfw.logger
 */
pForm.sfw_fatal = Eco.Logger.fatal;



/**
 * error 레벨 로그를 남긴다.<br><br>
 * - argument로 string 전달시 기본 출력할 수 있다.<br>
 * - argument로 Object 전달시 메시지 옵션을 추가할 수 있다. 지원하는 옵션은 아래와 같다.<br>
 *   message : string  (출력할 메시지)<br>
 *   elapsed : boolean (경과시간 표시여부)<br>
 *   dump    : Object  (개체 속성 나열)<br>
 *   stack   : true    (call stack 표시여부)<br>
 *   filter  : string  (로그 필터 지시자)<br><br>
 * - 본 메소드는 logLevel에 상관없이 출력된다.<br>
 * - logLevel이 1(error) 이상일 경우 buffer에 적재된다.<br>
 * - 본 메소드는 Error 개체를 throw 한다.<br>
 * @public
 * @function sfw_error
 * @param {string|object} msg 출력할 메시지 또는 옵션을 포함한 Object.
 * @example
 *
 * Eco.Logger.error("에러 발생 !!!");
 * // result : 2013-05-07 15:24:23.628 [error] Button02_onclick - 에러 발생 !!!
 *
 * // 경과시간 시작시간 지정 
 * // elapsed 옵션을 포함한 로깅이 실행되면 초기화 됨
 * // 시작시간을 지정하지 않으면 Logger가 최초 include된 시점이 시작시간
 * // Eco.Logger.startElapsed();
 *
 * var a = 0;
 * for (var i=0; i<10000; i++)
 * {
 *     a = a + i;
 * }
 *
 * Eco.Logger.error({message: "error !!!", elapsed: true});
 * // result : 2013-05-07 15:29:10.399 [error] Button03_onclick - error !!! (Elapsed Time : 13.541 sec)
 *
 * @memberOf sfw.logger
 */	
pForm.sfw_error = Eco.Logger.error;



/**
 * warn 레벨 로그를 남긴다.<br><br>
 * - argument로 string 전달시 기본 출력할 수 있습니다.<br>
 * - argument로 Object 전달시 메시지 옵션을 추가할 수 있다. 지원하는 옵션은 아래와 같다.<br>
 *   message : string  (출력할 메시지)<br>
 *   elapsed : boolean (경과시간 표시여부)<br>
 *   dump    : Object  (개체 속성 나열)<br>
 *   stack   : true    (call stack 표시여부)<br>
 *   filter  : string  (로그 필터 지시자)<br><br>
 * - logLevel이 2(warn) 이상일 경우 buffer에 적재된다.<br>
 * @public
 * @function sfw_warn
 * @param {string|object} msg 출력할 메시지 또는 옵션을 포함한 Object.
 * @example
 *
 * Eco.Logger.warn("경고 발생 !!!");
 * // result : 2013-05-07 15:41:18.965 [warn] Button04_onclick - 경고 발생 !!!
 * 
 * // obj (Button) 개체 속성을 나열
 * Eco.Logger.warn({message: "dump !!!", dump: obj});
 * 
 * // result : 2013-05-07 15:42:21.701 [warn] Button05_onclick - dump !!!
 * *****************PRINTING DUMP************************ 
 * Data: {
 *   name: Button05,
 *   id: Button05,
 *   parent: Logger,
 *   _refform: Logger,
 *   position: absolute,
 *   left: 519,
 *   _left: 519,
 *   top: 283,
 *   _top: 283,
 *   right: null,
 *   _right: null,
 *   bottom: null,
 *   _bottom: null,
 *   width: 56,
 *   _width: 56,
 *   height: 22,
 *   _height: 22,
 *   _adjust_width: 56,
 *   _adjust_height: 22,
 *   _adjust_left: 519,
 *   _adjust_left_ltr: 519,
 *   _adjust_top: 283,
 *   style: object,
 *   currentstyle: object,
 *   _styles: { },
 *   defaultbutton: false,
 *   escapebutton: false,
 *   selectStatus: false,
 *   wordwrap: false,
 *   _apply_pushed_pseudo: true,
 *   _text_elem: object,
 *   _img_elem: null,
 *   _text_width: -1,
 *   _text_height: -1,
 *   _image_width: 0,
 *   _image_height: 0,
 *   _accessibility_role: button,
 *   taborder: 1,
 *   _taborder: 1,
 *   text: 실행,
 *   _display_text: 실행,
 *   cssclass: WF_btn_Point,
 *   className: WF_btn_Point,
 *   _css_finder: { },
 *   _ref_css_finder: { },
 *   _control_pseudo: mouseover,
 *   _contents_pseudo: mouseover,
 *   _pseudo: mouseover,
 *   _real_visible: false,
 *   onclick: object,
 *   _created_event_list: [ ],
 *   _control_element: object,
 *   _refcssobj: Logger,
 *   _refcssid: #Button05,
 *   _margin: object,
 *   _client_width: 56,
 *   _client_height: 22,
 *   _has_dirty_rect: false,
 *   _is_created_contents: true,
 *   _is_loading: false,
 *   displaytext: 실행,
 *   _real_enable: true,
 *   _unique_id: mainframe_childframe_form_Button05,
 *   _is_created: true,
 *   _focus_refer_comp: Button05,
 *   _pushed: false,
 *   _is_pushed_area: false,
 *   _is_push: false,
 *   _status: focus,
 *   _last_focused: null,
 *   _lbuttonup_event_bubbles: undefined,
 *   _lbuttonup_first_comp: Button05
 * }
 * *****************COMPLETE DUMP************************
 *		 
 * @memberOf sfw.logger
 */		
pForm.sfw_warn = Eco.Logger.warn;



/**
 * info 레벨 로그를 남긴다.<br><br>
 * - argument로 string 전달시 기본 출력할 수 있다.<br>
 * - argument로 Object 전달시 메시지 옵션을 추가할 수 있다. 지원하는 옵션은 아래와 같다.<br>
 *   message : string  (출력할 메시지)<br>
 *   elapsed : boolean (경과시간 표시여부)<br>
 *   dump    : Object  (개체 속성 나열)<br>
 *   stack   : true    (call stack 표시여부)<br>
 *   filter  : string  (로그 필터 지시자)<br><br>
 * - logLevel이 3(info) 이상일 경우 buffer에 적재된다.<br>
 * @public
 * @function sfw_info
 * @param {string|object} msg 출력할 메시지 또는 옵션을 포함한 Object.
 * @example
 *
 * Eco.Logger.info("정보 출력 !!!");
 * // result : 2013-05-07 15:57:36.542 [info] Button06_onclick - 정보 출력 !!!
 * 
 * // stack = true 로 지정시 callstack 정보를 볼 수 있다
 * this.Button07_onclick = function(obj:Button,  e:nexacro.ClickEventInfo)
 * {
 *     this.fn_step1("123");
 * }		 
 * this.fn_step1 = function(arg1)
 * {
 *     fn_step2(arg1, "456")
 * }
 * 
 * this.fn_step2 = function(arg1, arg2)
 * {
 *     fn_step3(arg1, arg2, "789");
 * }
 * 
 * this.fn_step3 = function(arg1, arg2, arg3)
 * {
 *     var msg = arg1 + arg2 + arg3;
 *     Eco.Logger.info({message:msg, stack: true});
 * }
 * 
 * // result : 2013-05-07 16:04:38.523 [info] fn_step3 - 123456789
 * *****************PRINTING STACK************************
 * Logger.fn_step3(string: 123, string: 456, string: 789)
 *     Logger.fn_step2(string: 123, string: 456)
 *         Logger.fn_step1(string: 123)
 *             Logger.Button07_onclick(object: Button07, object: [object ClickEventInfo])
 * *****************COMPLETE STACK************************
 * @memberOf sfw.logger
 */		
pForm.sfw_info = Eco.Logger.info;



/**
 * debug 레벨 로그를 남긴다.<br><br>
 * - argument로 string 전달시 기본 출력할 수 있다.<br>
 * - argument로 Object 전달시 메시지 옵션을 추가할 수 있다. 지원하는 옵션은 아래와 같다.<br>
 *   message : string  (출력할 메시지)<br>
 *   elapsed : boolean (경과시간 표시여부)<br>
 *   dump    : Object  (개체 속성 나열)<br>
 *   stack   : true    (call stack 표시여부)<br>
 *   filter  : string  (로그 필터 지시자)<br><br>
 * - logLevel이 4(debug) 이상일 경우 buffer에 적재된다.<br>
 * @public
 * @function sfw_debug
 * @param {string|object} msg 출력할 메시지 또는 옵션을 포함한 Object.
 * @example
 *
 * Eco.Logger.debug("디버깅 출력 !!!");
 * // result : 2013-05-07 16:11:30.504 [debug] Button08_onclick - 디버깅 !!!
 * 
 * // filter 지정으로 특정 지시자에 해당하는 로그를 볼 수 있다.
 * Eco.Logger.setFilter("Test1");
 * 
 * Eco.Logger.debug({message: "Filter 1 !!!", filter: "Test1"});
 * // result : 2013-05-07 16:14:10.055 [debug] Button09_onclick - Filter 1 !!!
 * Eco.Logger.debug({message: "Filter 2 !!!", filter: "Test2"});
 * // result : 없음
 *
 * @memberOf sfw.logger
 */		
pForm.sfw_debug = Eco.Logger.debug;