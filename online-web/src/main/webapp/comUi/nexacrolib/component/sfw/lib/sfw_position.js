 /**
 * nexacro component의 position과 관련된 기능을 등록한다.
 * @namespace sfw.position
 **/


var pForm = nexacro.Form.prototype;


 /**
 * TopLevel Form에서 보이는 위치를 기준으로 component 좌표 및 size를 반환.
 * @function sfw_getTopLevelFormBox
 * @param {XComp} XComp XComponent
 * @return {array.<number>} [ leftPosition, topPosition, wdith, height ]
 * @example
 * trace(Eco.XComp.PositionSize.getTopLevelFormBox(Div00.Button00)); //output: [829,135,63,43]
 * trace(Eco.XComp.PositionSize.getTopLevelFormBox(Div01.Div02.Button01)); //output: [841,346,63,43]
 * trace(Eco.XComp.PositionSize.getTopLevelFormBox(Tab00.tabpage1.Button02)); //output: [813,521,63,43]	
 *
 * @memberOf sfw.position
 */
pForm.sfw_getTopLevelFormBox = Eco.XComp.PositionSize.getTopLevelFormBox;



 /**
 * XCompB 기준의 XY좌표를 XCompA 기준의 XY좌표로 변환.
 * @function sfw_convertXY
 * @param {XComp} XCompA XComponent.
 * @param {array.<number>} xy XCompB기준의 XY좌표.
 * @param {XComp} XCompB XComponent.
 * @return {array.<number>} XCompA기준의 좌표. [ x좌표, y좌표]
 * @example
 * 
 * Form에 아래와 같이 Button00이 존재 할 경우
 *
 * |---------------------------------------------------------|  ^
 * |  Form                                                   |  |
 * |                                                         |  |
 * |                                                         | 300
 * |                                                         |  |
 * |                                     //(0,0)             |  v
 * |                                       *-----------      | 
 * |                                       | Button00 |      | 
 * |                                       ------------      | 
 * |                                                         | 
 * |---------------------------------------------------------| 
 * <--------------- 900 ------------------>	
 *		 
 * trace(Eco.XComp.PositionSize.convertXY(this,[0,0], Button00)); //output: [900,300]
 * //Button00을 기준으로 한 0,0 좌표는
 * //form 기준으로 했을 때 900, 300이 된다.
 * @memberOf sfw.position
 */
pForm.sfw_convertXY = Eco.XComp.PositionSize.convertXY;



 /**
 * 수직스크롤바의 trackbar 위치를 반환한다.
 * @function sfw_getScrollTop
 * @param {XComp} XComp XComponent.
 * @return {number} 수직스크롤바의 trackbar 위치(수직스크롤바가 없을때는 0).
 * @example
 * trace(Eco.XComp.PositionSize.getScrollTop(Div01)); //output: 20
 * trace(Eco.XComp.PositionSize.getScrollTop(Div01)); //output: 0
 *
 * @memberOf sfw.position
 */
pForm.sfw_getScrollTop = Eco.XComp.PositionSize.getScrollTop;




 /**
 * 수평스크롤바의 trackbar 위치를 반환한다.
 * @function sfw_getScrollLeft
 * @param {XComp} XComp XComponent.
 * @return {number} 수평스크롤바의 trackbar 위치(수평스크롤바가 없을때는 0).
 * @example
 * trace(Eco.XComp.PositionSize.getScrollLeft(Div01)); //output: 10
 * trace(Eco.XComp.PositionSize.getScrollLeft(Div01)); //output: 0
 *
 * @memberOf sfw.position
 */
pForm.sfw_getScrollLeft = Eco.XComp.PositionSize.getScrollLeft;



 /**
 * 수평 스크롤바 height 또는 수직스크롤바의 width size를 반환한다.
 * @function sfw_getScrollBarSize
 * @param {XComp} XComp XComponent.
 * @param {string} type 스크롤바 종류(수평스크롤바:"horz", 수직스크롤바:"vert")
 * @return {number} 수평 스크롤바 height 또는 수직스크롤바의 width size를 반환한다.<br>
 *                  스크롤바를 지원하지 않는 컴포넌트 일때는 0.
 * @example
 * trace(Eco.XComp.PositionSize.getScrollBarSize(Div03, "vert")); //output:  11
 *
 * @memberOf sfw.position
 */
pForm.sfw_getScrollBarSize = Eco.XComp.PositionSize.getScrollBarSize;




 /**
 * 스크롤바가 표시됐을 때에만 size를 반환한다.
 * @function sfw_getCurrentScrollBarSize
 * @param {XComp} XComp nexacro Component
 * @param {string} type 스크롤바 종류(수평스크롤바:"horz", 수직스크롤바:"vert")
 * @return {number} 스크롤바 size(스크롤바가 없거나 표시되지 않을 때는 0).
 * @example
 * trace(Eco.XComp.PositionSize.getCurrentScrollBarSize(Div03, "vert")); //output: 0
 *
 * @memberOf sfw.position
 */
pForm.sfw_getCurrentScrollBarSize = Eco.XComp.PositionSize.getCurrentScrollBarSize;




/**
 * XComp의 boder, scrollbar width 크기를 제외한 client 영역 width 를 반환한다.
 * @function sfw_getClientWidth
 * @param {XComp} XComp nexacro Component.
 * @param {number=} wholeWidth 컴포넌트의 전체폭(boder,scrollbar width 포함).
 * @return {number} client 영역 width.
 * @example
 *
 * ex) Div01
 * |----------------------------------------------------|
 * |                    border                          |
 * |    |-------------------------------------------|   |
 * |    |               margin                      |   |
 * |    |     |---------------------------------|   |   |
 * |  b |  m  |<-------- client width --------->|   |   |
 * |  o |  a  |                                 |   |   |
 * |  r |  r  |                                 |   |   |
 * |  d |  g  |                                 |   |   |
 * |  e |  i  |                                 |   |   |
 * |  r |  n  |                                 |   |   |
 * |    |     |---------------------------------|   |   |
 * |    |                                           |   |
 * |    |-------------------------------------------|   |
 * |                                                    |
 * |----------------------------------------------------|
 * <-10-><-10->
 * <------------------------ 100 ----------------------->
 *
 * var clientwidth = Eco.XComp.PositionSize.getClientWidth(Div01);
 * trace(clientwidth);	// output : 60
 * @memberOf sfw.position
 */
pForm.sfw_getClientWidth = Eco.XComp.PositionSize.getClientWidth;



/**
 * XComp의 boder,scrollbar height 크기를 제외한 client 영역 height 를 반환한다.
 * @function sfw_getClientHeight
 * @param {XComp} XComp nexacro Component.
 * @param {number=} wholeHeight 컴포넌트의 전체높이(boder,scrollbar height 포함).
 * @return {number} client 영역 height.
 * @example
 *
 * ex) Div01
 * |------------------------------------------------|   ^ 	
 * |                    border                      |   |  border: 10
 * |   |----------------------------------------|   |   |
 * |   |                margin                  |   |   |  margin: 10
 * |   |   |--------------------------------|   |   |   |
 * | b | m |                              ^ |   |   |   |
 * | o | a |                              | |   |   |   |
 * | r | r |                client height | |   |   |  100
 * | d | g |                              | |   |   |   |
 * | e | i |                              | |   |   |   |
 * | r | n |                              v |   |   |   |
 * |   |   |--------------------------------|   |   |   |
 * |   |                                        |   |   |
 * |   |----------------------------------------|   |   |
 * |                                                |   |
 * |------------------------------------------------|   v
 *
 * var clientheight = Eco.XComp.PositionSize.getClientHeight(Div01);
 * trace(clientheight);	// output : 60
 * @memberOf sfw.position
 */
pForm.sfw_getClientHeight = Eco.XComp.PositionSize.getClientHeight;



/**
 * XComp의 boder,margin,scrollbar width 크기를 제외한 client 영역 width 를 반환한다.
 * scroll이 생기는 경우에는 scroll 가능한 전체 영역을 포함한 width 를 반환한다.
 * @function sfw_getScrollWidth
 * @param {XComp} XComp nexacro Component.
 * @return {number} client 영역 width.
 * @example
 *
 * ex) Div00 (width:100)
 * |----------------------------------------------------|
 * |                            |                       |
 * |                            |                       |
 * |                            |                       |
 * |                            |                       |
 * |----------------------------|                       |
 * |<---------- 100 ------------>                       |
 * |                                                    |
 * |                                                    |
 * |                         <---- scroll 가능 영역 ---->|
 * |                                                    |
 * |----------------------------------------------------|
 * 
 * <------------------------ 200 ----------------------->
 *
 * var scrollwidth = Eco.XComp.PositionSize.getScrollWidth(Div00);
 * trace(scrollwidth);	// output : 200
 * @memberOf sfw.position
 */
pForm.sfw_getScrollWidth = Eco.XComp.PositionSize.getScrollWidth;



/**
 * XComp의 boder,scrollbar height 크기를 제외한 client 영역 height 를 반환한다.
 * scroll이 생기는 경우에는 scroll 가능한 전체 영역을 포함한 height 를 반환한다.
 * @function sfw_getScrollHeight
 * @param {XComp} XComp nexacro Component.
 * @return {number} client 영역 height.
 * @example
 *
 * ex) Div00 (height:100)
 * |----------------------------------------------------| ^
 * |                            | ^                     | |
 * |                            | |                     | |
 * |                            |100                    | |
 * |                            | |                     | |
 * |----------------------------| v                     |200
 * |                                            ^       | |
 * |                                            |       | |
 * |                                    scroll 가능 영역 | |
 * |                                            |       | |
 * |                                            v       | |
 * |----------------------------------------------------| v
 *
 * var scrollheight = Eco.XComp.PositionSize.getScrollHeight(Div00);
 * trace(scrollheight);	// output : 200
 * @memberOf sfw.position
 */
pForm.sfw_getScrollHeight = Eco.XComp.PositionSize.getScrollHeight;




 /**
 * 컴포넌트에 지정된 text 의 너비,높이를 반환.<br><br>
 * 2번째 인자에 문자열 값을 지정하면 컴포넌트의 text 속성에 지정된 문자열을 대체하여<br>
 * 계산된 결과를 반환한다. (text 속성값이 변경되지는 않는다.)
 * @function sfw_getTextSize
 * @param {XComp|Font} XComp nexacro Component 또는 Font 객체.
 * @param {string=} text text 속성을 대체할 text (default : text 속성)
 * @param {boolean=} multiline 여부.
 * @param {number=} content_width word wrap이 일어나는 문자열의 경우, 길이를 제한하는 정수 값.
 * @param {boolean=} fitText 컴포넌트에 적용된 크기가 아닌 텍스트 자체의 크기만 반환할지 여부 (default:false, HTML 전용).
 * @return {array} [너비, 높이]
 * @example
 *
 * // btn_sample1.style.font ==> Dotum,9
 * trace(Eco.XComp.PositionSize.getTextSize(btn_sample1)); // output : [69,12]
 *
 * // btn_sample2.style.font ==> Dotum,9,bold
 * trace(Eco.XComp.PositionSize.getTextSize(btn_sample2)); // output : [80,12]
 *
 * // btn_sample3.style.font ==> Verdana,10
 * trace(Eco.XComp.PositionSize.getTextSize(btn_sample3)); // output : [83,16]
 *
 * @memberOf sfw.position
 */	
pForm.sfw_getTextSize = Eco.XComp.PositionSize.getTextSize;




 /**
 * 경로에 해당하는 이미지의 너비,높이 반환.<br>
 * 해당 이미지의 너비, 높이는 callback 함수를 통해 반환되며<br>
 * callback 함수의 인자는 url, width, height.
 * @function sfw_getImageSize
 * @param {string} url 이미지경로(절대경로, 상대경로, url경로, prefix경로).
 * @param {function} callback 구해진 이미지 사이즈를 반환할 함수로 (url, width, height) 인자를 보냄.
 * @param {*} scope callback 내부에서 this 로 사용할 대상.
 * @example
 *
 * this.imageLoadCallback = function(url, width, height)
 * {
 * 	trace(url + " : " + width + " : " + height);
 * }
 *
 * var url = "http://www.tobesoft.com/tobesoft_eng/images/product_imgs/visual_xplatform_img001.jpg";
 * Eco.XComp.PositionSize.getImageSize(url, this.imageLoadCallback, this);
 * // output : "http://www.tobesoft.com/tobesoft_eng/images/product_imgs/visual_xplatform_img001.jpg" : 310 : 214
 *
 * var url = "Image::ColorDialog.JPG";
 * Eco.XComp.PositionSize.getImageSize(url, this.imageLoadCallback, this);
 * // output : "Image::ColorDialog.JPG" : 206 : 172
 *
 * var url = "./Images/select.GIF";
 * Eco.XComp.PositionSize.getImageSize(url, this.imageLoadCallback, this);
 * // output : "./Images/select.GIF" : 19 : 19
 *
 * @memberOf sfw.position
 */		
pForm.sfw_getImageSize = Eco.XComp.PositionSize.getImageSize;




 /**
 * 컴포넌트가 가지는 모양을 표시하기 위한 최소 크기(너비,높이) 반환.<br><br>
 * ※ 크기에 영향을 미치는 요소는 다음과 같다.<br>
 *    - border<br>
 *    - padding<br>
 *    - text<br><br>
 * ※ text 가 없는 경우 기본글자 크기 적용.<br>
 * ※ scroll 을 가지는 컴포넌트는 현재 자신의 사이즈를 반환.
 * @function sfw_getContentSize
 * @param {XComp} XComp nexacro Component
 * @param {=number} width word wrap이 일어나는 문자열의 경우, 길이를 제한하는 정수 값.
 * @param {boolean=} multiLine multi line 사용여부(default: false).
 * @return {array} [너비, 높이]
 * @example
 *
 * // btn_sample4 ==> width : 36, height : 28, text : "btn_sample4"
 * trace(Eco.XComp.PositionSize.getContentSize(btn_sample4)); // output : [73,16]
 *
 * // chk_sample1 ==> width : 38, height : 20, text : "CheckBox", border : 1px solid red
 * trace(Eco.XComp.PositionSize.getContentSize(chk_sample1)); // output : [80,14]
 *
 * // cmb_sample1 ==> width : 150, height : 20, text : ""
 * trace(Eco.XComp.PositionSize.getContentSize(cmb_sample1)); // output : [38,12]
 *
 * // cal_sample1 ==> width : 120, height : 29, value : "20130505"
 * trace(Eco.XComp.PositionSize.getContentSize(cal_sample1)); // output : [108,16]
 *
 * // txt_sample1 ==> width : 114, height : 44
 * trace(Eco.XComp.PositionSize.getContentSize(txt_sample1)); // output : [114,44]
 *
 * @memberOf sfw.position
 */
pForm.sfw_getContentSize = Eco.XComp.PositionSize.getContentSize;




 /**
 * application 영역을 표시가능 대상으로 하면서 "특정 Component" 기준으로,<br>
 * 지정된 size를 갖는 컴포넌트를 표시하기위한 방향 및 좌표를 반환한다.<br><br>
 *  ※direction이 vert(vertical) 일때 표시방법: <br>
 *    1.하단 왼쪽맞춤(default).<br>
 *    2.왼쪽맞춤으로 공간부족시, 표시를 위해 팝업을 왼쪽으로 이동시킨다.<br>
 *    3.하단에 공간이 부족하면 상단에 표시.<br>
 *    4.2번과정 반복<br>
 *    5.1~4번으로도 공간확보가 안되면 direction을 무시하고 표시가능한 영역을 찾는다.<br>
 *    6.영역을 초과하는 공간을 요청하면,표시가능한 x,y좌표 및 size를 반환한다.<br><br>
 *  ※direction이 horz(horizontal) 일때 표시방법: <br>
 *    1.우측 상단맞춤(default).<br>
 *    2.상단맞춤으로 공간부족시, 표시를 위해 팝업을 위쪽으로 이동시킨다.<br>
 *    3.우측에 공간이 부족하면 좌측에 표시.<br>
 *    4.2번과정 반복<br>
 *    5.1~4번으로도 공간확보가 안되면 direction을 무시하고 표시가능한 영역을 찾는다.<br>
 *    6.영역을 초과하는 공간을 요청하면,표시가능한 x,y좌표 및 size를 반환한다.
 * @function sfw_getPopupPosition
 * @param {XComp} XComp 기준이 되는 nexacro Component. 
 * @param {number} width 표시할 팝업 width.
 * @param {number} height 표시할 팝업 height.
 * @param {string} direction 팝업표시 방향."vert": vertical(default),"horz": horizontal.
 * @param {number} offset 표시될때 XComp와의 간격(default: 0).
 * @return {array} [XComp 기준 팝업위치("left", "top", "right", "bottom"), x, y [ ,width, height] ]
 *   <pre>※주어진 width와 height, offset으로 
 *    1.표시가능한 공간이 있을 경우: 
 *       [팝업위치("left", "top", "right", "bottom"), x좌표, y좌표]
 *    2.영역을 초과하는 공간을 요청했을 때는 표시가능한 정보 반환: 
 *       [팝업위치("left", "top", "right", "bottom"), x좌표, y좌표, 가능한 width, 가능한 height]
 *   </pre>
 
 * @example
 *   var position = Eco.XComp.PositionSize.getPopupPosition(Button00, 44, 23, "vert", 2); //return: [bottom, 1394, 317]
 *   PopupDiv00.trackPopup(position[1], position[2]);
 *
 *   //해상도(1920*1080)를 초과한 높이 2000의 위치를 요구했을경우.
 *   var position = Eco.XComp.PositionSize.getPopupPosition(Button00, 300, 2000, "vert", 2); //return: [right,854,0,300,1080]
 *   PopupDiv00.trackPopup(position[1], position[2]);
 * @memberOf sfw.position
 */	
pForm.sfw_getPopupPosition = Eco.XComp.PositionSize.getPopupPosition;




 /**
 * 지정된 객체가 form에서(form, div, tabpage) 차지하는 영역을 대상으로 하면서 "특정 Component" 기준으로,<br>
 * 지정된 size를 갖는 컴포넌트를 표시하기위한 방향 및 좌표를 반환한다.<br>
 * ※ 지정된 영역 미설정시 application 영역을 기준으로 계산한다.<br><br>
 *  ※direction이 vert(vertical) 일때 표시방법: <br>
 *    1.하단 왼쪽맞춤(default).<br>
 *    2.왼쪽맞춤으로 공간부족시, 표시를 위해 팝업을 왼쪽으로 이동시킨다.<br>
 *    3.하단에 공간이 부족하면 상단에 표시.<br>
 *    4.2번과정 반복<br>
 *    5.1~4번으로도 공간확보가 안되면 direction을 무시하고 표시가능한 영역을 찾는다.<br>
 *    6.영역을 초과하는 공간을 요청하면,표시가능한 x,y좌표 및 size를 반환한다.<br><br>
 *  ※direction이 horz(horizontal) 일때 표시방법: <br>
 *    1.우측 상단맞춤(default).<br>
 *    2.상단맞춤으로 공간부족시, 표시를 위해 팝업을 위쪽으로 이동시킨다.<br>
 *    3.우측에 공간이 부족하면 좌측에 표시.<br>
 *    4.2번과정 반복<br>
 *    5.1~4번으로도 공간확보가 안되면 direction을 무시하고 표시가능한 영역을 찾는다.<br>
 *    6.영역을 초과하는 공간을 요청하면,표시가능한 x,y좌표 및 size를 반환한다.
 * @function sfw_getPositionByForm
 * @param {XComp} XComp 표시 위치를 얻고자 하는 nexacro Component 
 * @param {number} width 표시할 팝업 width
 * @param {number} height 표시할 팝업 height
 * @param {string=} direction 팝업표시 방향."vert": vertical(default),"horz": horizontal
 * @param {number=} offset 표시될때 XComp와의 간격(default: 0).
 * @param {XComp=} scopeXComp 표시 위치를 얻고자 하는 nexacro Component가 표시될 영역에 해당하는 Component(default: application.mainframe).
 * @return {array} [XComp 기준 위치("left", "top", "right", "bottom"), x, y [ ,width, height] ]
 *   <pre>※주어진 width와 height, offset으로 
 *    1.표시가능한 공간이 있을 경우: 
 *       [팝업위치("left", "top", "right", "bottom"), x좌표, y좌표]
 *    2.영역을 초과하는 공간을 요청했을 때는 표시가능한 정보 반환: 
 *       [팝업위치("left", "top", "right", "bottom"), x좌표, y좌표, 가능한 width, 가능한 height]
 *   </pre>
 
 * @example
 *   var position = Eco.XComp.PositionSize.getPositionByForm(Button00, 44, 23, "vert", 2, this); //return: [bottom, 1394, 317]
 *   Button00.move(position[1], position[2]);
 *
 *   //해상도(1920*1080)를 초과한 높이 2000의 위치를 요구했을경우.
 *   var position = Eco.XComp.PositionSize.getPositionByForm(Button00, 300, 2000, "vert", 2, this); //return: [right,854,0,300,1080]
 *   Button00.move(position[1], position[2]);
 * @memberOf sfw.position
 */		
pForm.sfw_getPositionByForm = Eco.XComp.PositionSize.getPositionByForm;



/**
 * 최상단 프레임을 기준으로 X축을 반환하는 함수
 *
 * @memberOf sfw.position
 */
pForm.getScreenX = function() {
	
	var form = this;
	
	while(form.parent.parent) {
		
		form = form.parent.parent;
	}
	
	if(form) {
		
		return form.left;
	} else {
		
		return -1;
	}
}


/**
 * 최상단 프레임을 기준으로 Y축을 반환하는 함수
 *
 * @memberOf sfw.position
 */
pForm.getScreenY = function() {
	
	var form = this;
	
	while(form.parent.parent) {
		
		form = form.parent.parent;
	}
	
	if(form) {
		
		return form.top;
	} else {
		
		return -1;
	}
}