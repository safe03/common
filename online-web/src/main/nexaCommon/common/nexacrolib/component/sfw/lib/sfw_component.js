 /**
 * nexacro component와 관련된 기능을 등록한다.
 * @namespace sfw.component
 **/


var pForms = [ nexacro.Form.prototype, nexacro.Application ];

for ( id in pForms ) {

	var pForm = pForms[id];

	/**
	 * 주어진 nexacro 개체의 type 을 반환
	 * @function sfw_typeOf
	 * @public
	 * @param {*} obj Object, Component, Frame, .. 등 nexacro 모든 개체
	 * @return {string} 개체의 type
	 * @example
	 * trace(Eco.XComp.typeOf(Button00));	// output : Button
	 * trace(Eco.XComp.typeOf(Tab00));	// output : Tab
	 * trace(Eco.XComp.typeOf(Tab00.tabpage1));	// output : Tabpage
	 * trace(Eco.XComp.typeOf(Dataset00));	// output : Dataset
	 * trace(Eco.XComp.typeOf(PropertyAnimation00));	// output : PropertyAnimation
	 *
	 * var o;
	 * o = new Buffer;
	 * trace(Eco.XComp.typeOf(o));	// output : Buffer
	 *
	 * o = new DomDocument;
	 * trace(Eco.XComp.typeOf(o));	// output : DomDocument
	 *
	 * o = new Rect;
	 * trace(Eco.XComp.typeOf(o));	// output : Rect
	 *
	 * o = new FileDialog;
	 * trace(Eco.XComp.typeOf(o));	// output : FileDialog
	 *
	 * o = new UserEvent;
	 * trace(Eco.XComp.typeOf(o));	// output : UserEvent
	 *
	 * // non XP Component/Object return undefined.
	 * o = {};
	 * trace(Eco.XComp.typeOf(o));	// output : undefined		 
	 *
	 * o = new Date();
	 * trace(Eco.XComp.typeOf(o));	// output : undefined
	 * @memberOf sfw.component
	 */
	pForm.sfw_typeOf = Eco.XComp.typeOf;
	
	
	
	/**
	 * 주어진 컴포넌트가 실제 화면에 보여지는지 여부를 반환<br><br>
	 * 대상 컴포넌트의 상위컴포넌트(parent)의 visible 속성이 false 가<br> 
	 * 지정되어 화면에 대상 컴포넌트가 보이지 않더라도 대상 컴포넌트의<br> 
	 * visible 속성값은 지정된 값을 유지하고 있으므로 화면에 실제 <br>
	 * 보여지는지 여부를 판단하기 위해서는 본 메소드를 사용한다.
	 * @function sfw_isVisible
	 * @public
	 * @param {XComp} obj nexacro Component
	 * @return {string} 개체의 type
	 * @example
	 * Div00.Button00.visible = true;
	 * Div00.visible = false;	// 화면에 Button00 이 보이지 않는다.
	 * trace(Div00.Button00.visible);	// output : true
	 * trace(Eco.XComp.isVisible(Div00.Button00));	// output : false
	 * @memberOf sfw.component
	 */
	pForm.sfw_isVisible = Eco.XComp.isVisible;
	
	
	
	/**
	 * 주어진 오브젝트가 Visual한 컴포넌트인지를 반환
	 * @function sfw_isVisual
	 * @public
	 * @param {XComp} obj nexacro Component
	 * @return {boolean} visual Component 여부
	 * @example
	 * trace(Eco.XComp.isVisual(Button00));	// output : true
	 * trace(Eco.XComp.isVisual(Dataset00));	// output : false
	 * @memberOf sfw.component
	 */
	pForm.sfw_isVisual = Eco.XComp.isVisual;
	
	
	
	/**
	 * 주어진 컴포넌트의 실제 활성화 여부를 반환<br><br>
	 * 대상 컴포넌트의 상위컴포넌트(parent)의 enable 속성이 false 가 <br>
	 * 지정되어 화면에 대상 컴포넌트가 비활성화 상태이어도 대상 컴포넌트의 <br>
	 * enable 속성값은 지정된 값을 유지하고 있으므로 실제 활성화 여부를 <br>
	 * 판단하기 위해서는 본 메소드를 사용한다.
	 * @function sfw_compIsEnable
	 * @public
	 * @param {XComp} obj nexacro Component
	 * @return {string} 개체의 type
	 * @example
	 * Div00.Button00.enable = true;
	 * Div00.enable = false;	// Button00 이 비활성화 된다.
	 * trace(Div00.Button00.enable);	// output : true
	 * trace(Eco.XComp.isEnable(Div00.Button00));	// output : false
	 * @memberOf sfw.component
	 */	
	pForm.sfw_compIsEnable = Eco.XComp.isEnable;
	
	
	
	/**
	 * 주어진 nexacro Component 에 포함되고 조건에 맞는 component, object 반환<br><br>
	 * 1. where 조건문에 지원하는 예약어 피연산자(operand) 는 다음과 같다.<br>
	 *  - prop[property_name] : property 중 name 에 해당하는 값을 의미<br>
	 *  - curStyle[currentstyle_name] : currentstyle 중 name 에 해당하는 값(문자열)을 의미<br>
	 *  - style[style_name] : style 중 name 에 해당하는 값을 의미<br>
	 *  - typeOf : XP Component type을 의미<br>
	 *  - isVisible : XP Component의 실제 visible 여부<br>
	 *  - isVisual : 주어진 오브젝트가 Visual한 컴포넌트인지 여부<br>
	 *  - isEnable : XP Component의 실제 enable 여부<br><br>
	 * ※ isVisible는 실제 컴포넌트가 화면에 보여지는 여부를 체크하게 된다.<br>
	 *    prop[visible] == true 형식으로 사용하면 대상 컴포넌트의 value property 값이 true 인지를 체크한다.<br>
	 *    대상 컴포넌트의 상위컴포넌트(parent)의 visible 속성이 false 가 지정되어 화면에 대상 컴포넌트가<br>
	 *    보이지 않더라도 대상 컴포넌트의 visible 속성값은 자신이 지정된 값을 유지하고 있으므로 반드시<br>
	 *    false 가 나오지 않는다. (같은 이유로 isEnable 로 실제 활성화 되어있는지를 체크해야 한다.)<br><br>
	 * 2. where 조건문에 지원하는 연산자(operator) 는 다음과 같다.<br>
	 *  - A && B : A 와 B 가 모두 참이면 참<br>
	 *  - A || B : A 와 B 가 모두 거짓이면 거짓<br>
	 *  - A == B : A 와 B 는 같다.<br>
	 *  - A != B : A 와 B 는 같지 않다.<br>
	 *  - A > B : A 는 B 보다 크다.<br>
	 *  - A >= B : A 는 B 보다 크거나 같다.<br>
	 *  - A < B : A 는 B 보다 작다.<br>
	 *  - A <= B : A 는 B 보다 작거나 같다.<br>
	 *  - 'b' *= 'abc' : 'abc' 에 'b' 가 포함되어 있다. (like)<br>
	 *  - 'a' ^= 'abc' : 'abc' 는 'a' 로 시작한다. (startWith)<br>
	 *  - 'c' $= 'abc' : 'abc' 는 'c' 로 끝난다. (endWith)
	 * @public
	 * @function sfw_compQuery
	 * @param {*} obj Object, Component, Frame, .. 등 nexacro 모든 개체
	 * @param {string=} where 찾을 조건문
	 * @param {number=} depth 하위 레벨 깊이 (default: 제한없음)
	 * @return {array} 검색된 component, object
	 * @example
	 * 
	 * Form(Form00) 에 아래와 같은 구조가 존재 할 경우
	 *
	 * |----------------------------------------------------------------------------|
	 * | Div00 (depth:0)                                                            |
	 * |                                                                            |
	 * |    ------------                                                            |
	 * |    | Button00 |                                                            |
	 * |    ------------                                                            |
	 * |                                                                            |
	 * |    |-------------------------------------------------------------------|   |
	 * |    | Div01 (depth:1)                                                   |   |
	 * |    |                                                                   |   |
	 * |    |   ------------                                                    |   |
	 * |    |   | Button01 |                                                    |   |
	 * |    |   ------------                                                    |   |
	 * |    |                                                                   |   |
	 * |    |   |-----------------------------------------------------------|   |   |
	 * |    |   | Tab00 (depth:2)                                           |   |   |
	 * |    |   |                                                           |   |   |
	 * |    |   |   |-----------------------|   |-----------------------|   |   |   |
	 * |    |   |   | Tabpage1 (depth:3)    |   | Tabpage2 (depth:3)    |   |   |   |
	 * |    |   |   |                       |   |                       |   |   |   |
	 * |    |   |   |   ------------        |   |   ------------        |   |   |   |
	 * |    |   |   |   | Button02 |        |   |   | Button03 |        |   |   |   |
	 * |    |   |   |   ------------        |   |   ------------        |   |   |   |
	 * |    |   |   |                       |   |                       |   |   |   |
	 * |    |   |   |-----------------------|   |-----------------------|   |   |   |
	 * |    |   |                                                           |   |   |
	 * |    |   |-----------------------------------------------------------|   |   |
	 * |    |                                                                   |   |
	 * |    |-------------------------------------------------------------------|   |
	 * |                                                                            |
	 * |----------------------------------------------------------------------------|
	 *
	 * // from이 Form00 이고 depth 를 지정하지 않은 경우 Form00 에 포함된 모든 하위요소 검색
	 * trace(Eco.XComp.query(Form00, ""));
	 * // output : [object Div],[object Button],[object Div],[object Button],[object Tab],
	 *             [object Tabpage],[object Button],[object Tabpage],[object Button]
	 *
	 * // from이 Div00 이고 depth 를 지정하지 않은 경우 Div00 에 포함된 모든 하위요소 검색
	 * trace(Eco.XComp.query(Div00, ""));
	 * // output : [object Button],[object Div],[object Button],[object Tab],
	 *             [object Tabpage],[object Button],[object Tabpage],[object Button]
	 *
	 * // from이 Div00 이고 depth가 0 인 경우 Div00 에 포함된 요소까지 검색
	 * trace(Eco.XComp.query(Div00, "", 0));
	 * // output : [object Button],[object Div]
	 *
	 * // from이 Div00 이고 depth가 1 인 경우 Div01 에 포함된 요소까지 검색
	 * trace(Eco.XComp.query(Div00, "", 1));
	 * // output : [object Button],[object Div],[object Button],[object Tab]
	 *
	 * // from이 Div00 이고 depth가 2 인 경우 Tab00 에 포함된 요소까지 검색
	 * trace(Eco.XComp.query(Div00, "", 2));
	 * // output : [object Button],[object Div],[object Button],[object Tab],
	 *             [object Tabpage],[object Tabpage]
	 *
	 * // Div00 에 하위로 포함된 모든 Button 검색
	 * trace(Eco.XComp.query(Div00, "typeOf == 'Button'"));
	 * // output : [object Button],[object Button],[object Button],[object Button]
	 * 
	 * // Div00 에 하위로 포함된 모든 Button, Div 검색
	 * trace(Eco.XComp.query(Div00, "typeOf == 'Button' || typeOf == 'Div'"));
	 * // output : [object Button],[object Div],[object Button],[object Button],[object Button]
	 * 
	 * // Div00 에 포함된 모든 하위요소중 property visible 값이 true 인 요소 검색
	 * // Div01에 포함된 Tab 과 Button이 보이지 않지만 visible 속성값은 true 임
	 * // 실제 visible 한 요소만 찾을 경우 isVisible 을 사용
	 * Div00.Div01.visible = false;
	 * trace(Eco.XComp.query(Div00, "prop[visible] == true"));
	 * // output : [object Button],[object Button],[object Tab],[object Button],[object Button]
	 * 
	 * // Div00 에 포함된 모든 하위요소중 property text 값이 "Button02" 인 요소 검색
	 * trace(Eco.XComp.query(Div00, "prop[text] == 'Button02'"));
	 * // output : [object Button]
	 *
	 * // Div00 에 포함된 모든 하위요소중 currentstyle align 값이 "center middle" 인 요소 검색
	 * // (currentstyle은 현재 적용되고 있는 style object를 얻어오는 property 임)
	 * Div00.Div01.Button01.style.align = "left bottom";
	 * trace(Eco.XComp.query(Div00, "curStyle[align] == 'center middle'"));
	 * // output : [object Button],[object Div],[object Tab],[object Button],[object Button]
	 *
	 * // Div00 에 포함된 모든 하위요소중 style align 값이 "left top" 인 요소 검색
	 * // 화면디자인시 적용된 style 의 특정 값을 얻어온다.
	 * trace(Eco.XComp.query(Div00, "style[align] == 'left top'"));
	 * // output : [object Button]
	 * 
	 * // Div00 에 포함된 모든 하위요소중 화면에 보이는 요소 검색
	 * // prop[value] == true 는 실제 보이는 요소가 아니어도 속성값이 true이면 검색됨.
	 * Div00.Div01.visible = false;	
	 * trace(Eco.XComp.query(Div00, "isVisible == true"));
	 * // output : [object Button]
	 *
	 * // Div00 에 Dataset과 Button이 포함됐을 경우 하위요소중 visual한 컴포넌트만 검색
	 * trace(Eco.XComp.query(Div00, "isVisual == true", 0));
	 * // output : [object Button]
	 *
	 * // Div00 에 포함된 모든 하위요소중 활성화된 요소 검색
	 * // prop[enable] == true 는 실제 활성화된 요소가 아니어도 속성값이 true이면 검색됨.
	 * Div00.Div01.enable = false;	
	 * trace(Eco.XComp.query(Div00, "isEnable == true"));
	 * // output : [object Button]
	 * 
	 * // Div00 에 포함된 모든 하위요소중 property name에 'ab' 이 포함된 요소을 검색
	 * trace(Eco.XComp.query(Div00, "prop[name] *= 'ab'"));
	 * // output : [object Tab],[object Tabpage],[object Tabpage]
	 *
	 * // Div00 에 포함된 모든 하위요소중 property name이 'Bu' 로 시작되는 요소을 검색
	 * trace(Eco.XComp.query(Div00, "prop[name] ^= 'Bu'"));
	 * // output : [object Button],[object Button],[object Button],[object Button]
	 *
	 * // Div00 에 포함된 모든 하위요소중 property name이 '01' 로 끝나는 요소을 검색
	 * trace(Eco.XComp.query(Div00, "prop[name] $= '01'"));
	 * // output : [object Div],[object Button]
	 *
	 * // Div00에 포함된 모든 하위요소중 화면에 보이면서 type이 Button 인 요소를 검색
	 * Div00.Div01.visible = false;
	 * trace(Eco.XComp.query(Div00, "isVisible == true && typeOf == 'Button'"));
	 * // output : [object Button]
	 *
	 * @memberOf sfw.component
	 */	
	pForm.sfw_compQuery = Eco.XComp.query;
	
	

	/**
	 * ChildFrame에 속한 계층 위치의 정보까지 명칭으로 얻는다.
	 * @function sfw_compGetPathName
	 * @param {XComp} obj nexacro component.
	 * @param {XComp=} refParent 계층 구조에서 중단할 상위 nexacro component
	 * @return {string} obj 계층 구조의 명칭(xpform.Div00.Button01)
	 * @example
	 *
	 * // obj = Button
	 * trace(Eco.XComp.getPathName(obj, this));
	 * // output : Button00
	 *
	 * trace(Eco.XComp.getPathName(Div00.st_test, this));
	 * // output : Div00.st_test
	 *
	 * @memberOf sfw.component
	*/
	pForm.sfw_compGetPathName = Eco.XComp.getPathName;
	
	
	
	/**
	 * 계층 위치의 정보 명칭으로 nexacro component를 얻는다.
	 * @function sfw_compGetCompByPathName
	 * @param {string} pathName 계층 구조의 명칭(xpform.Div00.Button01)
	 * @param {XComp} p 검색 기준 상위 nexacro component (p의 범위에서 검색)
	 * @return {XComp} obj nexacro component.
	 * @example
	 *
	 * trace(Eco.XComp.getCompByPathName("Div01.st_test", this));
	 * // output : [object Static]
	 *
	 * trace(Eco.XComp.getCompByPathName("st_test", Div00));
	 * // output : [object Static]
	 *
	 * @memberOf sfw.component
	*/
	pForm.sfw_compGetCompByPathName  = Eco.XComp.getCompByPathName;
	
	
	
	/**
	 * 주어진 대상을 포함한 상위 범위로 지정된 이름에 최초로 일치하는 component, object 반환
	 * @function sfw_compLookup
	 * @public
	 * @param {XComp} p 찾을 대상
	 * @param {string} name 찾을 대상 이름
	 * @return {XComp} 검색된 component, object
	 * @example
	 *
	 * // this = Form 
	 * // Form 에 Button11 존재
	 * trace(Eco.XComp.lookup(this, "Button11"));	// output : [object Button]
	 * 
	 * // Button12 는 Div01 에 존재하지 않으나 Div01 의 상위 컴포넌트인 Form 에 존재
	 * trace(Eco.XComp.lookup(Div01, "Button11"));	// output : [object Button]
	 *
	 * @memberOf sfw.component
	 */
	pForm.sfw_compLookup = Eco.XComp.lookup;
	
	
	
	
	/**
	 * 주어진 상위 컴포넌트에 하위 컴포넌트가 포함되는지 여부를 반환
	 * @function sfw_compContains
	 * @public
	 * @param {XComp} p 상위 컴포넌트
	 * @param {XComp} target 하위 컴포넌트
	 * @return {boolean} 포함 여부
	 * @example
	 *
	 * // this = Form, obj = Button
	 * trace(Eco.XComp.contains(this, obj));	// output : true
	 * 
	 * trace(Eco.XComp.contains(this, ds_test));	// output : true		 
	 * 
	 * @memberOf sfw.component
	 */		
	pForm.sfw_compContains = Eco.XComp.contains;
	
	
	/**
	 * 주어진 Form 을 포함하는 최상위 Form을 찾는다.
	 * @function sfw_compGetTopLevelForm
	 * @public
	 * @param {Form} curForm 찾을 대상 이름
	 * @return {Form} 최상위 Form
	 * @example
	 *
	 * trace(Eco.XComp.getTopLevelForm(this));	// output : [object Form]
	 * 
	 * @memberOf sfw.component
	 */	
	pForm.sfw_compGetTopLevelForm = Eco.XComp.getTopLevelForm;
	
	
	
	/**
	 * showModal 호출 시 추가된 변수 목록값을 반환한다.
	 * @function sfw_compGetPopupArguments
	 * @public
	 * @param {Form} scope 현재 form
	 * @param {Array.<string>} variableNames 얻고자 하는 변수명 목록
	 * @return {object} {변수명:값, 변수명:값, ...} 객체.
	 * @example
	 *
	 * var frame = new ChildFrame();
	 * frame.init("testFrame", "absolute", 10, 10, 400, 400, null, null, "Sample::XComp_sub2.xfdl");
	 * frame.showModal(this.getOwnerFrame(), {'name':'James', 'address':"Seoul, Korea" });		 
	 *
	 * alert(Eco.XComp.getPopupArguments( this, ['name', 'address'] );	// output : {'name':'James', 'address':"Seoul, Korea" }
	 * 
	 * @memberOf sfw.component
	 */	
	pForm.sfw_compGetPopupArguments = Eco.XComp.getPopupArguments;
	
	
	
	/**
	 * 주어진 c(XComp) 가 사용하는 script 영역(scope)의 Form을 찾는다.
	 * @function sfw_compGetScriptForm
	 * @public
	 * @param {Form} c - XComp
	 * @return {Form} script 영역이 존재하는 Form
	 * @example
	 *
	 * trace(Eco.XComp.getScriptForm(this.Div00.Button00));	// output : [object Form]
	 * 
	 * @memberOf sfw.component
	 */		
	pForm.sfw_compGetScriptForm = Eco.XComp.getScriptForm;
	
	
	
	/**
	 * 주어진 component, object에 속성 값을 지정한다.
	 * @function sfw_compSetProperties
	 * @public
	 * @param {*} target nexacro Component, object
	 * @param {string} prop property name
	 * @param {*} value property value
	 * @param {*=} * (prop, value 반복)
	 * @example
	 *
	 * // obj = Button
	 * Eco.XComp.setProperties(obj, "text", "1234");
	 * // ==> Button.text = "1234";
	 * 
	 * Eco.XComp.setProperties(obj, "class", "", "enable", false);
	 * // ==> Button.class = "";
	 * // ==> Button.enable = false;		 
	 * 
	 * @memberOf sfw.component
	 */		
	pForm.sfw_compSetProperties = Eco.XComp.setProperties;
	
	
	
	/**
	 * 주어진 component, object 의 지정된 속성 목록을 얻어온다.
	 * @function sfw_compGetProperties
	 * @public
	 * @param {*} target nexacro Component, object
	 * @param {string} prop property name
	 * @param {*} value property value
	 * @param {*=} * (prop, value 반복)
	 * @return {array} 속성값 배열
	 * @example
	 *
	 * // obj = Button
	 * trace(Eco.XComp.getProperties(obj, "text", "visible"));
	 * // output : 실행,true
	 *
	 * // obj = Button
	 * trace(Eco.XComp.getProperties(obj, "test", "position", "style"));
	 * // output : ,absolute 519 634 575 656,[object StyleObject]
	 *
	 * @memberOf sfw.component
	 */	
	pForm.sfw_compGetProperties = Eco.XComp.getProperties;
	
	
	
	/**
	 * 주어진 nexacro Component, object 에 사용자 속성을 추가한다.<br>
	 * 대상이 원래 가지고 있는 이름을 지정해도 상관없이 동작한다.<br>
	 * ※ 사용자 정의 속성을 대상에 바로 사용하면 내부 속성을<br> 
	 * 덮어쓸 수 있으므로 본 메소드를 통해서 사용하도록 한다.		 
	 * @function sfw_compSetUserProperty
	 * @public
	 * @param {*} target nexacro Component, object
	 * @param {string} name 사용자 정의 속성 명
	 * @param {*=} value 속성 값
	 * @example
	 *
	 * // Button00 (text : Button00)
	 * Eco.XComp.setUserProperty(Button00, "text", "user property");
	 * Eco.XComp.setUserProperty(Button00, "myProp", [0,1,2]);
	 * 
	 * @memberOf sfw.component
	 */
	pForm.sfw_compSetUserProperty = Eco.XComp.setUserProperty;
	
	
	
	/**
	 * 주어진 nexacro Component, object 에서 사용자 정의 속성값을 얻어온다.<br>
	 * ※ setUserProperty 메소드에 의해 지정된 사용자 정의 속성값을 얻어온다.
	 * @function sfw_compGetUserProperty
	 * @public
	 * @param {*} target nexacro Component, object
	 * @param {string} name 사용자 정의 속성 명
	 * @return {*} 주어진 target에 name으로 지정된 사용자 정의 속성값
	 * @example
	 *
	 * // Button00 (text : Button00)
	 * Eco.XComp.setUserProperty(Button00, "text", "user property");
	 * trace(Button00.text + " : " + Eco.XComp.getUserProperty(Button00, "text"));
	 *
	 * // output : 
	 * Button00 : user property
	 *
	 * @memberOf sfw.component
	 */
	pForm.sfw_compGetUserProperty = Eco.XComp.getUserProperty;
	
	
	
	/**
	 * 주어진 nexacro Component, object 에서 지정된 사용자 정의 속성을 제거한다.<br>
	 * ※ setUserProperty 메소드에 의해 지정된 사용자 정의 속성을 대상으로 한다.
	 * @function sfw_compDeleteUserProperty
	 * @public
	 * @param {*} target nexacro Component, object
	 * @param {string} name 제거할 사용자 정의 속성 명
	 * @example
	 *
	 * // Button00 (text : Button00)
	 * Eco.XComp.setUserProperty(Button00, "text", "user property");
	 * trace(Button00.text + " : " + Eco.XComp.getUserProperty(Button00, "text"));
	 * 
	 * Eco.XComp.deleteUserProperty(Button00, "text");
	 * trace(Button00.text + " : " + Eco.XComp.getUserProperty(Button00, "text"));		 
	 *
	 * // output : 
	 * Button00 : user property
	 * Button00 : undefined
	 *
	 * @memberOf sfw.component
	 */
	pForm.sfw_compDeleteUserProperty = Eco.XComp.deleteUserProperty;
	
	/**
	 * @class Div를 기준으로 Header/Body 의 쌍이 접고 펼치는 처리를 하는 공통함수
	 * @param {Object} objList - 아코디언처리할 대상 Object의 목록으로 JSON Object의 형식으로 Header : Body의 형식으로 작성한다.
	 * @param {Boolean or Integer} openMode - 아코디언 초기 설정값으로 true: 전체 보여주기, false: 전체 숨기기, index: 해당항목만 펼쳐준다.
	 * @return N/A
	 */
	pForm.sfw_setAccordion = function(objList, openMode)
	{
		var targetlist = new Array();
		
		for(var objName in objList)
		{
			var targetobj = eval("this."+objName);
			var targetBody;
			
			// 대상아코디언이 있으면
			if( !this.sfw_isEmpty(objList[objName]) )
			{
				// Div Object일경우
				if( objList[objName].valueOf() == "[object Div]" )
				{
					targetBody = objList[objName];
				}
				// String으로 넘어온경우
				else
				{
					targetBody = eval("this."+objList[objName]);
				}
				
				targetobj.accordionbody = targetBody;
				
				targetobj.accordionbody.orgtop    = targetobj.accordionbody.top;
				targetobj.accordionbody.orgleft   = targetobj.accordionbody.left;
				targetobj.accordionbody.orgright  = targetobj.accordionbody.right;
				targetobj.accordionbody.orgbottom = targetobj.accordionbody.bottom;
				targetobj.accordionbody.orgheight = targetobj.accordionbody.height;
				targetobj.accordionbody.orgwidth  = targetobj.accordionbody.width;
				
				var iright  = targetobj.getOffsetRight();
				var ileft   = targetBody.getOffsetLeft();
				
				var ibottom = targetobj.getOffsetBottom();
				var itop    = targetobj.getOffsetTop();
				
				/**
				 * 좌/우 지점일 경우
				 *
				 * +-----+  +-----+
				 * |     |  |     |
				 * |     |  |     |
				 * +-----+  +-----+ 
				 */
				if(iright < ileft) {
					
					targetobj.accordionbody.accordiontype = 'left';
				}
				
				/**
				 * 상/하 지점일 경우
				 *
				 * +-----+  
				 * |     |  
				 * +-----+   
				 *
				 * +-----+
				 * |     |
				 * +-----+
				 */
				 
				if(ibottom < itop) {
					
					targetobj.accordionbody.accordiontype = 'top';
				}
				
				
			}
			
			targetlist.push(targetobj);
		}

		// 각각의 Object의 목록에 대한 아코디언설정정보를 설정한다.
		var firstbtnobj;
		for(var i=0;i<targetlist.length;i++)
		{
			// 어코디언 body 부분이 없는것은 무조건 보여준다.
			if( this.sfw_isEmpty(targetlist[i].accordionbody) )
			{
				targetlist[i].accordionopenstatus = true;
			}

			var headobjects = targetlist[i].form.components;
			for(var j=0;j<headobjects.length;j++)
			{
				// 아코디언 Close/Open 처리 버튼 검색 및 버튼에 필요한 아코디언 및 상태를 설정한다.
				if( headobjects[j].valueOf() == "[object Button]" && headobjects[j].cssclass.indexOf("btn_WF_Acc") != -1 )
				{
					// 아코디언 이벤트 처리핸들
					headobjects[j].addEventHandler("onclick", this._sfw_HandleAccordionButtonClick , this);
					headobjects[j].accordionlist = targetlist;
					headobjects[j].accordionhead = targetlist[i];
					//headobjects[j].setFocus(false);
					
					if( this.sfw_isEmpty(firstbtnobj) )
					{
						firstbtnobj = headobjects[j];
					}
					
					if( this.sfw_isBoolean(openMode))
					{
						headobjects[j].accordionopenstatus = openMode;
						
						if( openMode == true )
						{
							headobjects[j].set_cssclass("btn_WF_AccClose");
							headobjects[j].set_text("CLOSE");
						}
						else
						{
							headobjects[j].set_cssclass("btn_WF_AccOpen");
							headobjects[j].set_text("OPEN");
						}

						targetlist[i].accordionopenstatus = openMode;
					}
					else
					{
						if( openMode == i )
						{
							headobjects[j].accordionopenstatus = true;
							headobjects[j].set_cssclass("btn_WF_AccClose");
							headobjects[j].set_text("CLOSE");
							targetlist[i].accordionopenstatus = true;
						}
						else
						{
							headobjects[j].accordionopenstatus = false;
							headobjects[j].set_cssclass("btn_WF_AccOpen");
							headobjects[j].set_text("OPEN");
							targetlist[i].accordionopenstatus = false;
						}
					}                
					break;
				}
			}
		}
		
		// 현재의 상태에 맞게 리드로잉처리한다.
		this._sfw_redrawAccordion(firstbtnobj);
	};


	/**
	 * @class 아코디언 처리시에 사용된는 공통 버튼의 이벤트핸들링 (사용자사용금지)
	 * @param {Button}         아코디언 해더에 존재하는 버튼
	 * @param {ClickEventInfo} 클릭이벤트
	 * @return N/A
	 */
	pForm._sfw_HandleAccordionButtonClick = function(obj,e)
	{
		//trace(obj.name + " / " + obj.accordionhead.name ); 
		if( obj.accordionopenstatus == true )
		{
			obj.accordionopenstatus = false;
			obj.set_cssclass("btn_WF_AccOpen");
			obj.set_text("OPEN");
			obj.accordionhead.accordionopenstatus = false;
		}
		else
		{
			obj.accordionopenstatus = true;
			obj.set_cssclass("btn_WF_AccClose");
			obj.set_text("CLOSE");
			obj.accordionhead.accordionopenstatus = true;
		}

		// 현재의 상태에 맞게 리드로잉처리한다.
		this._sfw_redrawAccordion(obj);
	};


	/**
	 * @class 아코디언의 상태값을 이용해서 리드로잉 처리한다.
	 * @param {Button}         아코디언 해더에 존재하는 버튼
	 * @return N/A
	 */
	pForm._sfw_redrawAccordion = function(obj)
	{
		//trace("===== _sfw_redrawAccordion : " + obj.name);
		var heightoffset  = 10;
		var widthoffset   = 0;
		var accordionlist = obj.accordionlist;
		
		var toppos    = accordionlist[0].top;
		var leftpos   = accordionlist[0].left;
		var accordionType;
		//targetobj.accordionbody.accordiontype
		
		for(var i=0;i<accordionlist.length;i++)
		{
			//- set position
			accordionlist[i].set_top    ( toppos    );
			accordionlist[i].set_left   ( leftpos   );
			
			// 보여주기 처리
			if( accordionlist[i].accordionopenstatus == true )
			{
				accorionType = accordionlist[i].accordionbody.accordiontype;
				
				// 바디가 존재할때
				if( !this.sfw_isEmpty(accordionlist[i].accordionbody) )
				{
					if(accorionType == 'left') {
						
						accordionlist[i].accordionbody.set_left(parseInt(leftpos)+parseInt(accordionlist[i].width));
						accordionlist[i].accordionbody.set_width(accordionlist[i].accordionbody.orgwidth);
						leftpos = parseInt(leftpos)+parseInt(accordionlist[i].width)+parseInt(widthoffset);
						
					} else {
						
						accordionlist[i].accordionbody.set_top(parseInt(toppos)+parseInt(accordionlist[i].height));
						accordionlist[i].accordionbody.set_height(accordionlist[i].accordionbody.orgheight);
						toppos  = parseInt(toppos)+parseInt(accordionlist[i].height)+parseInt(heightoffset);
						trace(toppos);
					}
					
					accordionlist[i].accordionbody.set_visible(true);
					accordionlist[i].parent.resetScroll();
				}
				else
				{
					toppos  = parseInt(toppos)+parseInt(accordionlist[i].height)+parseInt(heightoffset);
					leftpos = parseInt(leftpos)+parseInt(accordionlist[i].width)+parseInt(widthoffset);
				}
			}
			// 숨김처리
			else
			{
				if( !this.sfw_isEmpty(accordionlist[i].accordionbody) )
				{
					
					if(accorionType == 'left') {
						
						accordionlist[i].accordionbody.set_left(parseInt(leftpos)+parseInt(accordionlist[i].height));
						accordionlist[i].accordionbody.set_width(0);
						leftpos = parseInt(leftpos)+parseInt(accordionlist[i].width)+parseInt(widthoffset);
					} else {
						
						accordionlist[i].accordionbody.set_top(parseInt(toppos)+parseInt(accordionlist[i].height));
						accordionlist[i].accordionbody.set_height(0);
						toppos = parseInt(toppos)+parseInt(accordionlist[i].height)+parseInt(heightoffset);
					}
					
					accordionlist[i].accordionbody.set_visible(false);
					accordionlist[i].parent.resetScroll();
				}
				else
				{
					leftpos = parseInt(leftpos)+parseInt(accordionlist[i].width)+parseInt(widthoffset);
					toppos  = parseInt(toppos)+parseInt(accordionlist[i].height)+parseInt(heightoffset);
				}
			}
		}
	};
}