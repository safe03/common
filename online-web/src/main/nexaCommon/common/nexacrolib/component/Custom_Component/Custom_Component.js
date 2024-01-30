//==============================================================================
//	Define the Component.
//==============================================================================
//==============================================================================
// Object : nexacro.Code
// Group : Component
//==============================================================================
if (!nexacro.Code)
{
	(function() {
			
			const Child = function( parent ) {
				
				this.POPUP_FN; //팝업 객체
				
				const _parent  = parent;     //모듈
				const _libForm = parent.libForm;//라이브러리 Form
				const _this    = parent.form;//모듈.form
				const _prevValues = [];
				
				const itemBinds = function( libForm ,comp_root ,bind_info ) {
					let { dataset ,code ,name } = bind_info;
					
					const code_comp = comp_root+'.form.code';
					const name_comp = comp_root+'.form.code_name';
					
					if( code_comp && dataset && code ) useBind( libForm ,dataset ,code_comp ,code );
					if( name_comp && dataset && name ) useBind( libForm ,dataset ,name_comp ,name );
				}
				
				const useBind = function( libForm ,dataset ,comp_id ,column ) {
					const column_name = column ? column.replace('bind:','') : '';
					const bind_id = dataset + '_' + column_name;
					const item = new BindItem( bind_id ,comp_id ,'value' ,dataset ,column_name );
					
					libForm.addChild( bind_id ,item );
					item.bind();
				}
				
				const verticalCenter = function( parent ,target ) {
					const top = parent.height/2 - (target.height/2);
					target.set_top(top);
				}
				
				const setPrevValue = function( store ,code ,name ) {
					store.push( {code ,name} );
					if( store.length >= 5 ) store.shift();
				}
				
				const getPrevValue = function( store ) {
					const result = {};
					let target = store.length -1;
					target = target < 0 ? 0 : target;
					
					if( target < store.length ) {
						result.code = store[target].code;
						result.name = store[target].name;
					}
					
					return result;
				}
				
				this.get_prev_value = function() { return getPrevValue( _prevValues ); }
				
				this.get_value = function() {
					return {
						code : _this.code.value
						,name : _this.code_name.value
					}
				}
				
				this.init = function() {
					if( !_parent.popup_id ) throw new Error(_parent.id+'의 popup_id는 필수입니다.');
					this.POPUP_FN = _libForm.gfn_RunPopupOpen( _parent.type ,_parent.popup_id );
					this.redraw();
					this.rebind();
				}
				
				this.popup_open = function( isFirst ) {
					const code = _this.code;
					const name = _this.code_name;
					const params = _parent.on_fire_onSetParams( code.value ,name.value ) || { [_parent.transaction_column] : name.value };
					
					this.POPUP_FN
					.setParam( params )
					.isFirst( isFirst )
					.open(function( result ,bind_info ) {
							const codeValue = result[ bind_info.code ];
							const nameValue = result[ bind_info.name ];
							
							name.setFocus();
							
							//취소
							if( result == false ) {
								const prev_value = getPrevValue( _prevValues );
								code.set_value( prev_value.code );
								name.set_value( prev_value.name );
								return;
							}
							
							if( bind_info.code ) code.set_value( codeValue );
							if( bind_info.name ) name.set_value( nameValue );
							
							setPrevValue( _prevValues ,codeValue ,nameValue );
							
							//사용자의 팝업 호출 후 처리 함수
							_parent.on_fire_onPostEvent();
						});
				}
				
				this.redraw = function() {
					let { code ,code_name ,label_width ,code_width ,edit_height } = _parent;
					
					//set
					_this.code.set_value( code );
					_this.code_name.set_value( code_name );
					
					//width 변경
					_this.code.set_width(code_width);
					// Edit 중앙처리
					_this.code.set_height( edit_height );
					_this.code_name.set_height( edit_height );
					verticalCenter( _this ,_this.code );					
					verticalCenter( _this ,_this.code_name );
					//버튼 중앙
					verticalCenter( _this ,_this.btnPopUp );
					//릴레이션 반영
					_this.resetScroll();
					
				}
				
				this.rebind = function() {
					let { dataset ,code_column ,name_column } = _parent;
					const rootName = _parent.getRootName();
					
					//item bind
					itemBinds( _libForm ,rootName ,{ dataset ,code: code_column ,name: name_column } );
				}
				
				this.init();//객체가 생성되면 실행
			};
			
			// this.form => script의 this
			nexacro.Code = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
			{
				nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
				
				this._root_form_id = [];//[ code ,form ,div ,form ,libForm ];
				
				const checkFn = function( module ) {
					//존재할 경우 true;
					if( module.form && module.libForm && module.libForm.gfn_RunPopupOpen ) return true;
					
					return false;
				}
				
				// 기능 객체 확인 및 컴포넌트 객체 확인을 하고 성공여부를 반환
				this.__init = function() {
					if( !this._child && !checkFn( this ) ) return false;
					
					this._child = new Child( this );
					return true;
				}
				
				this.addEvent("onSetParams");
				this.addEvent("onPostEvent");
			};
		})();
	
	nexacro.Code.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.Code);
	nexacro.Code.prototype._type_name = "Code";
	
	/************************************************************************
	* 속성 정의
	************************************************************************/
	nexacro.Code.prototype.type = "comm";
	nexacro.Code.prototype.dataset = "";
	nexacro.Code.prototype.code_column = "";
	nexacro.Code.prototype.name_column = "";
	nexacro.Code.prototype.code_width = "100";
	nexacro.Code.prototype.edit_height = "24";
	nexacro.Code.prototype.popup_id = "";
	nexacro.Code.prototype.transaction_column = "";
	nexacro.Code.prototype.code = "";
	nexacro.Code.prototype.code_name = "";

	
	/************************************************************************
	* 함수 정의
	************************************************************************/
	/************************************************************************
	* Setter 정의
	************************************************************************/
	nexacro.Code.prototype.set_type = function(v) {
		this.type = v;
	}	
	nexacro.Code.prototype.set_code = function (v){
		this.code = v;
		this.redraw();
		return this;
	};
	nexacro.Code.prototype.set_code_name = function (v) {
		this.code_name = v;
		this.redraw();
		return this;
	};
	nexacro.Code.prototype.set_dataset = function(v) {
		this.dataset = v;
		this.rebind();
	}
	nexacro.Code.prototype.set_code_column = function( v ) {
		this.code_column = v;
		this.rebind();
	}
	nexacro.Code.prototype.set_name_column = function( v ) {
		this.name_column = v;
		this.rebind();
	}
	nexacro.Code.prototype.set_label_width = function( w ) {
		this.label_width = w;
		this.redraw();
		return this;
	}
	nexacro.Code.prototype.set_code_width = function( w ) {
		this.code_width = w;
		this.redraw();
		return this;
	}
	nexacro.Code.prototype.set_edit_height = function( height ) {
		this.edit_height = height;
		this.redraw();
		return this;
	}
	nexacro.Code.prototype.set_popup_id = function( v ) {
		this.popup_id = v;
		return this;
	}
	nexacro.Code.prototype.set_transaction_column = function( v ) {
		this.transaction_column = v;
		return this;
	}
	nexacro.Code.prototype.get_value = function() {
		return this._child.get_value();
	} 
	
	/************************************************************************
	* Custom function
	************************************************************************/
	nexacro.Code.prototype.getRootName = function() { return this._root_form_id.reverse().join('.') };
	
	nexacro.Code.prototype.redraw = function() {
		// init에 실패할 경우 ui툴로 간주 -> 라이브러리가 담겨있는 main form을 못찾았을 경우
		if( this.__init() == false ) {
			try {
				//중앙
				const verticalCenter = function( parent ,target ) {
					const top = parent.height/2 - (target.height/2);
					target.set_top(top);
				}
				const _parent = this;
				const _this	  = this.form;
				let { code ,code_name ,label_width ,code_width ,edit_height } = this;
				
				_this.code.set_value( code );
				_this.code_name.set_value( code_name );
				
				//width 변경
				_this.code.set_width(code_width);
				
				// Edit 중앙 처리
				_this.code.set_height( edit_height );
				_this.code_name.set_height( edit_height );				
				verticalCenter( _parent ,_this.code );
				verticalCenter( _parent ,_this.code_name );
				verticalCenter( _parent ,_this.btnPopUp );
				
				//릴레이션 반영
				_this.resetScroll();
				return;
			}catch(e) {
				return;
			}
		}
		this._child.redraw();
	}
	
	nexacro.Code.prototype.rebind = function() {
		if( this.__init() == false ) return;
		this._child.rebind();
	}
	
	/************************************************************************
	* Event
	************************************************************************/
	nexacro.Code.prototype.on_fire_onSetParams = function ( code ,name )
	{
		if (this.onSetParams && this.onSetParams._has_handlers)
		{
			var evt = new nexacro.EventInfo(this, "onSetParams"); //TODO
			
			evt.code_value = code;
			evt.name_value = name;
			
			return this.onSetParams.fireEvent(this, evt);
		}
		return false;
		
	};
	nexacro.Code.prototype.on_fire_onPostEvent = function (/*TODO*/)
	{
		if (this.onPostEvent && this.onPostEvent._has_handlers)
		{
			var evt = new nexacro.EventInfo(this, "onPostEvent"); //TODO
			return this.onPostEvent.fireEvent(this, evt);
		}
		return false;
		
	};
}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.Code.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("Code");
				this.set_titletext("Code");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(316,28);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Edit("code","0","2","100","24",null,null,null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_readonly("true");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPopUp","code:2","2","24","24",null,null,null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_cssclass("btn_WF_search");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("code_name","btnPopUp:2","2",null,"24","0",null,null,null,null,null,this);
				obj.set_taborder("2");
				this.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",316,28,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("Code.xcdl", function() {
					// this.parent => class Definition의 객체
					
					/************************************************************************
					* Property
					************************************************************************/
					let _parent;
					const _ENTER = 13;
					const _ESC	 = 27;
					
					const _SHIFT = 16;
					const _CTRL  = 17;
					const _ALT   = 18;
					const _END	 = 35;
					const _HOME	 = 36;
					const checkKeys = [_SHIFT ,_CTRL ,_ALT ,_HOME ,_END];
					
					const emptys = [undefined ,null ,''];
					
					this.isEmpty = function( value ) { return emptys.some( nullData => nullData == value ); }
					
					this.popup_open = function( obj ,e )
					{
						if( obj instanceof nexacro.Edit ) {
							
							if( checkKeys.some( check => check == e.keycode ) || e.shiftkey || e.ctrlkey || e.altkey ) return;
							
							const code_value = this.code.value;
							const name_value = this.code_name.value;
							
							//취소 처리
							if( e.keycode == _ESC ) {
								const prevValue = _parent._child.get_prev_value();
								const prevCode = prevValue.code;
								const prevName = prevValue.name;
								this.code.set_value( prevCode );
								this.code_name.set_value( prevName );
								return;
							}
							
							//검색값 변경시 코드값 초기화
							this.code.set_value('');
							
							if( e.keycode != _ENTER ) return; //enter 키가 아닐 경우
							
							//값이 없을 경우 팝업 비활성화
							if( this.isEmpty( name_value ) ) return;
						}
						
						_parent._child.popup_open( !(obj instanceof Button) );
					};
					
					this._onload = function(obj,e)
					{
						//메인폼이 로드된 후
						const recurciveParent = function( add ,target ) {
							if(  	 target instanceof nexacro.Form
								&& !(target instanceof nexacro._InnerForm ) ) return target;
							
							add.push( target.id );
							
							return recurciveParent( add ,target.parent );
						};
						
						_parent = this.parent;
						_parent.libForm = recurciveParent( _parent._root_form_id ,_parent );//기능이 들어있는 Form 객체
						
						_parent.__init();
					};
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onload",this._onload,this);
				this.addEventHandler("onsize",this._onsize,this);
				this.btnPopUp.addEventHandler("onclick",this.popup_open,this);
				this.code_name.addEventHandler("onkeyup",this.popup_open,this);
			};
			this.loadIncludeScript("Code.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};
//==============================================================================			
//	Define the Component.
//==============================================================================			
//==============================================================================			
// Object : nexacro.Popup_Comm			
// Group : Component			
//==============================================================================			
if (!nexacro.Popup_Comm)			
{				
	(function() {
	
		const Child = function( parent ) {
		
			this.POPUP_FN; //팝업 객체

			const _parent  = parent;     //모듈
			const _libForm = parent.libForm;//라이브러리 Form
			const _this    = parent.form;//모듈.form

			const itemBinds = function( libForm ,comp_root ,bind_info ) {
				let { dataset ,code ,name } = bind_info;
				
				const code_comp = comp_root+'.form.code';
				const name_comp = comp_root+'.form.code_name';   
				
				if( code_comp && dataset && code ) useBind( libForm ,dataset ,code_comp ,code );
				if( name_comp && dataset && name ) useBind( libForm ,dataset ,name_comp ,name );
			}

			const useBind = function( libForm ,dataset ,comp_id ,column ) {
				const uuid = randomId();
				const item = new BindItem( uuid ,comp_id ,'value' ,dataset ,column ? column.replace('bind:','') : '' );
				
				libForm.addChild( uuid ,item );
				item.bind();
			}

			const verticalCenter = function( parent ,target ) {
				const top = parent.height/2 - (target.height/2);
				target.set_top(top);
			}

			const randomId = function() {
				return [0,0,0,0].map( empty => Math.ceil(Math.random() * 1000**2).toString(16) ).join('-');
			}
			
			const setPrevValue = function( store ,code ,name ) {
				store.push( {code ,name} );
				if( store.length >= 5 ) store.shift();
			}
			
			const getPrevValue = function( store ) {
				const result = {};
				let target = store.length -1;
					target = target < 0 ? 0 : target;
				
				if( target < store.length ) {
					result.code = store[target].code;
					result.name = store[target].name;				
				}
				
				return result;
			}
			
			this.get_value = function() {
				return {
					 code : _this.code.value
					,name : _this.code_name.value
				}
			}			

			this.init = function() {
				if( !_parent.popup_id ) throw new Error(_parent.id+'의 popup_id는 필수입니다.');
				this.POPUP_FN = _libForm.gfn_RunPopupOpen( 'comm' ,_parent.popup_id );
				this.redraw();
				this.rebind();
			}

			this.popup_open = function( isFirst ) {
				const code = _this.code;
				const name = _this.code_name;
				
				let { transaction_column ,callback_params } = _parent;
				
				const params = _parent.on_fire_setParam( code.value ,name.value ) || { [transaction_column] : name.value };
				
				this.POPUP_FN
					.setParam( params )
					.isFirst( isFirst )
					.open(function( result ,bind_info ) {
						if( !code.prevValue ) code.prevValue = [];//prev 객체
					
						const codeValue = result[ bind_info.code ];
						const nameValue = result[ bind_info.name ];						
						
						name.setFocus();
						
						//취소
						if( result == false ) {
							const prev_value = getPrevValue( code.prevValue );
							code.set_value( prev_value.code );
							name.set_value( prev_value.name );
							return;
						}
						
						if( bind_info.code ) code.set_value( codeValue );
						if( bind_info.name ) name.set_value( nameValue );
						
						setPrevValue( code.prevValue ,codeValue ,nameValue );
					});
			}

			this.redraw = function() {
				let { label_width ,code_width ,edit_interval ,text ,cssclass } = _parent;
				
				//class 변경
				_this.staLabel.set_cssclass( cssclass );
				//text 변경
				_this.staLabel.set_text(text);
				//width 변경
				_this.staLabel.set_width(label_width);
				_this.code.set_width(code_width);
				// Edit의 상하 간격
				_this.code.set_top( edit_interval );
				_this.code.set_bottom( edit_interval );
				_this.code_name.set_top( edit_interval );
				_this.code_name.set_bottom( edit_interval );
				//버튼 중앙
				verticalCenter( _this ,_this.btnPopUp );
				//릴레이션 반영
				_this.resetScroll();

			}

			this.rebind = function() {				
				let { dataset ,code_column ,name_column } = _parent;
				const rootName = _parent.getRootName();
				
				//item bind
				itemBinds( _libForm ,rootName ,{ dataset ,code: code_column ,name: name_column } );
			}
			
			this.init();//객체가 생성되면 실행
		};
				    			
		// this.form => script의 this
		nexacro.Popup_Comm = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent) 
		{
			nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
			
			this._root_form_id = [];//[ code ,form ,div ,form ,libForm ];
			
			const checkFn = function( module ) {   
				//존재할 경우 true;
				if( module.form && module.libForm && module.libForm.gfn_RunPopupOpen ) return true;
				
				return false;
			}
			
			// 기능 객체 확인 및 컴포넌트 객체 확인을 하고 성공여부를 반환
			this.__init = function() {
				if( !this._child && !checkFn( this ) ) return false;
				
				this._child = new Child( this );
				return true;
			}

			this.addEvent("setParam");
		};
	})();
	
	nexacro.Popup_Comm.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.Popup_Comm);			
    nexacro.Popup_Comm.prototype._type_name = "Popup_Comm";	
	
	/************************************************************************
	 * 속성 정의
	 ************************************************************************/
	nexacro.Popup_Comm.prototype.dataset = "";
	nexacro.Popup_Comm.prototype.code_column = "";
	nexacro.Popup_Comm.prototype.name_column = "";
	nexacro.Popup_Comm.prototype.label_width = "100";
	nexacro.Popup_Comm.prototype.code_width = "100";
	nexacro.Popup_Comm.prototype.edit_interval = "2";
	nexacro.Popup_Comm.prototype.popup_id = "";
	nexacro.Popup_Comm.prototype.transaction_column = "";
	nexacro.Popup_Comm.prototype.text = "Label";
	nexacro.Popup_Comm.prototype.cssclass = "";
	
	/************************************************************************
	 * 함수 정의
	 ************************************************************************/
	/************************************************************************
	 * Setter 정의
	 ************************************************************************/		
	nexacro.Popup_Comm.prototype.set_cssclass = function( v ) {
		this.cssclass = v;
		this.redraw();
		return this;
	}
	nexacro.Popup_Comm.prototype.set_dataset = function(v) {
		this.dataset = v;
		this.rebind();
	}
	nexacro.Popup_Comm.prototype.set_code_column = function( v ) {		
		this.code_column = v;
		this.rebind();
	}
	nexacro.Popup_Comm.prototype.set_name_column = function( v ) {
		this.name_column = v;
		this.rebind();
	}
	nexacro.Popup_Comm.prototype.set_label_width = function( w ) {
		this.label_width = w;
		this.redraw();
		return this;
	}
	nexacro.Popup_Comm.prototype.set_code_width = function( w ) {
		this.code_width = w;
		this.redraw();
		return this;
	}
	nexacro.Popup_Comm.prototype.set_edit_interval = function( top_bottom ) {
		this.edit_interval = top_bottom;
		this.redraw();
		return this;
	}
	nexacro.Popup_Comm.prototype.set_popup_id = function( v ) {
		this.popup_id = v;
		return this;
	}
	nexacro.Popup_Comm.prototype.set_transaction_column = function( v ) {
		this.transaction_column = v;
		return this;
	}
	nexacro.Popup_Comm.prototype.get_value = function() {
		return this.form.get_value();
	}	
	nexacro.Popup_Comm.prototype.set_text = function (v){
		this.text = v;
		this.redraw();
		return this;
	};

	/************************************************************************
	 * Custom function
	 ************************************************************************/
	nexacro.Popup_Comm.prototype.getRootName = function() { return this._root_form_id.reverse().join('.') };
		
	nexacro.Popup_Comm.prototype.redraw = function() {
		// init에 실패할 경우 ui툴로 간주 -> 라이브러리가 담겨있는 main form을 못찾았을 경우
		if( this.__init() == false ) {
			try {
				const _this = this.form;
				let { label_width ,code_width ,edit_interval ,text ,cssclass } = this;
					
				//class 변경
				_this.staLabel.set_cssclass( cssclass );
				
				//text 변경
				_this.staLabel.set_text(text);
				
				//width 변경
				_this.staLabel.set_width(label_width);
				_this.code.set_width(code_width);
				
				// Edit의 상하 간격
				_this.code.set_top( edit_interval );
				_this.code.set_bottom( edit_interval );
				_this.code_name.set_top( edit_interval );
				_this.code_name.set_bottom( edit_interval );
				
				//릴레이션 반영
				_this.resetScroll();
				return;
			}catch(e) {
				return;
			}
		}
		this._child.redraw();
	}
	
	nexacro.Popup_Comm.prototype.rebind = function() { 
		if( this.__init() == false ) return;		
		this._child.rebind();
	}
	
	/************************************************************************
	 * Event
	 ************************************************************************/
	nexacro.Popup_Comm.prototype.on_fire_setParam = function ( code ,name )
	{
		if (this.setParam && this.setParam._has_handlers)
		{
			var evt = new nexacro.EventInfo(this, "setParam"); //TODO
			
			evt.code_value = code;
			evt.name_value = name;
			
			return this.setParam.fireEvent(this, evt);
		}
		
		return false;
	};

}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.Popup_Comm.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("Popup_Comm");
				this.set_titletext("Popup_Comm");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(320,28);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Static("staLabel","0","0","100",null,null,"0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_text("설명label");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("code","staLabel:0","0","100",null,null,"0",null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_readonly("true");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPopUp","code:2","2","24","24",null,null,null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_cssclass("btn_WF_search");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("code_name","btnPopUp:2","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("3");
				this.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",320,28,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("Popup_Comm.xcdl", function() {
					// this.parent => class Definition의 객체
					
					/************************************************************************
					* Property
					************************************************************************/
					let _parent;
					
					this.popup_open = function( obj ,e )
					{
						_parent._child.popup_open( !(obj instanceof Button) ,this.prev_value );
					};
					
					this._onload = function(obj,e)
					{
						//메인폼이 로드된 후
						const recurciveParent = function( add ,target ) {
							if(  	 target instanceof nexacro.Form
								&& !(target instanceof nexacro._InnerForm ) ) return target;
							
							add.push( target.id );
							
							return recurciveParent( add ,target.parent );
						};
						
						_parent = this.parent;
						_parent.libForm = recurciveParent( _parent._root_form_id ,_parent );//기능이 들어있는 Form 객체
						
						_parent.__init();
					};
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.btnPopUp.addEventHandler("onclick",this.popup_open,this);
				this.code_name.addEventHandler("onchanged",this.popup_open,this);
				this.code_name.addEventHandler("canchange",this.code_name_canchange,this);
			};
			this.loadIncludeScript("Popup_Comm.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};
//==============================================================================
//	Define the Component.
//==============================================================================
//==============================================================================
// Object : nexacro.Popup_DaumAddress
// Group : Component
//==============================================================================
if (!nexacro.Popup_DaumAddress)
{
	nexacro.Popup_DaumAddress = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		this.addEvent("onPostEvent");
		this.redraw();
	}
	
	nexacro.Popup_DaumAddress.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.Popup_DaumAddress);
	nexacro.Popup_DaumAddress.prototype._type_name = "Popup_DaumAddress";
	
	/************************************************************************
	 * 속성 및 함수 정의
	 ************************************************************************/
	nexacro.Popup_DaumAddress.prototype.api_url	= "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
	
	nexacro.Popup_DaumAddress.prototype.zonecode        = "";
	nexacro.Popup_DaumAddress.prototype.address         = "";
	nexacro.Popup_DaumAddress.prototype.detail          = "";
	nexacro.Popup_DaumAddress.prototype.zonecode_width  = "100";
	nexacro.Popup_DaumAddress.prototype.address_width   = "100";
	nexacro.Popup_DaumAddress.prototype.edit_height		= "24";
	nexacro.Popup_DaumAddress.prototype.dataset         = "";
	nexacro.Popup_DaumAddress.prototype.bind_zonecode   = "";
	nexacro.Popup_DaumAddress.prototype.bind_address    = "";
	nexacro.Popup_DaumAddress.prototype.bind_detail     = "";
	nexacro.Popup_DaumAddress.prototype.isAnimation 	= "false";
	
	nexacro.Popup_DaumAddress.prototype.set_zonecode        = function(v) {return this.redraw('zonecode',v); };
	nexacro.Popup_DaumAddress.prototype.set_address         = function(v) {return this.redraw('address',v);  };
	nexacro.Popup_DaumAddress.prototype.set_detail          = function(v) {return this.redraw('detail',v); 	 };
	nexacro.Popup_DaumAddress.prototype.set_zonecode_width  = function(v) {return this.redraw('zonecode_width',v)};
	nexacro.Popup_DaumAddress.prototype.set_address_width   = function(v) {return this.redraw('address_width',v) };
	nexacro.Popup_DaumAddress.prototype.set_edit_height   	= function(v) {return this.redraw('edit_height',v) };
	nexacro.Popup_DaumAddress.prototype.set_dataset         = function(v) {this.dataset = v; return this;}
	nexacro.Popup_DaumAddress.prototype.set_bind_zonecode   = function(v) {this.bind_zonecode = v; return this;}
	nexacro.Popup_DaumAddress.prototype.set_bind_address    = function(v) {this.bind_address = v; return this;}
	nexacro.Popup_DaumAddress.prototype.set_bind_detail     = function(v) {this.bind_detail = v; return this;}
	nexacro.Popup_DaumAddress.prototype.set_isAnimation 	= function (v) {this.isAnimation = v; return this;}
	
	nexacro.Popup_DaumAddress.prototype.get_value = function( isAll ) { return this.form.getValue(isAll); }
	
	nexacro.Popup_DaumAddress.prototype.redraw = function( key ,v ) {
		this[key] = v;
		
		try{
			//ui반영
			const _this = this.form;
			const _parent= this;
			const _comp_ids = [ 'zonecode' ,'address' ,'detail' ];
			//중앙
			const verticalCenter = function( parent ,target ) {
				const top = parent.height/2 - (target.height/2);
				target.set_top(top);
			}
			let { zonecode_width ,address_width ,edit_height } = _parent;
			
			//code
			_this.zonecode.set_width( zonecode_width );
			//address
			_this.address.set_width( address_width );
			//edit의 top ,bottom,value
			_comp_ids.forEach(function(id) {
					_this[id].set_height( edit_height );
					_this[id].set_value( _parent[id] );
					verticalCenter( _parent ,_this[id]);
				}.bind(_this));
			//버튼중앙
			verticalCenter( _parent ,_this.btnPopUp );	
			//릴레이션 반영
			_this.resetScroll();
		}catch(e) {
			this.form.redraw();//프로그램이 뜰경우 try에서 무조건 Error 실질적으로 draw
			return this;
		}
		
		return this;
	}
	
	/************************************************************************
	 * Api가 없을 경우 동적으로 Api 연결
	 ************************************************************************/
	// 다음 주소 api 사용시점에 daum이 없을 경우 주입
	try {
		window;//error 체크 error가 아닐 경우 존재 = 브라우저
		document.addEventListener('DOMContentLoaded' ,() => {
			try{
				//다음이 있는지 체크
				daum;
			}catch(e) {
				//없을 경우 주입
				const daum_addr_api_url = nexacro.Popup_DaumAddress.prototype.api_url;
				const parent = document.body;
				const script = document.createElement('script');
				script.setAttribute('src' , daum_addr_api_url);
				parent.appendChild(script);
			}
		});
	}catch(e) {}
	
	
	/************************************************************************
	 * Event
	 ************************************************************************/
	nexacro.Popup_DaumAddress.prototype.on_fire_onPostEvent = function (/*TODO*/)
	{
		if (this.onPostEvent && this.onPostEvent._has_handlers)
		{
			var evt = new nexacro.EventInfo(this, "onPostEvent"); //TODO
			return this.onPostEvent.fireEvent(this, evt);
		}
		return false;
		
	}; 
	
	
}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.Popup_DaumAddress.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("Popup_DaumAddress");
				this.set_titletext("Popup_DaumAddress");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(960,28);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Edit("zonecode","0","2","100","24",null,null,null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_readonly("true");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPopUp","zonecode:2","2","24","24",null,null,null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_cssclass("btn_WF_search");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("address","btnPopUp:2","2","100","24",null,null,null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_readonly("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("detail","address:2","2",null,"24","0",null,null,null,null,null,this);
				obj.set_taborder("3");
				this.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",960,28,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("Popup_DaumAddress.xcdl", function() {
					/* // daum 팝업 속성
					open({
					q: '검색어'
					, left: '팝업위치 x값'
					, top: '팝업위치 y값'
					, popupTitle: '팝업창의 타이틀'
					, popupKey: '팝업창 구분값'
					, autoClose: '자동 닫힘 유무'
					});
					
					//테마 변경
					//아래 코드처럼 테마 객체를 생성합니다.(color값은 #F00, #FF0000 형식으로 입력하세요.)
					//변경되지 않는 색상의 경우 주석 또는 제거하시거나 값을 공백으로 하시면 됩니다.
					var themeObj = {
					bgColor: "#545252" 		//바탕 배경색
					searchBgColor: "", 		//검색창 배경색
					contentBgColor: "", 		//본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
					pageBgColor: "", 		//페이지 배경색
					textColor: "", 			//기본 글자색
					queryTextColor: "", 		//검색창 글자색
					postcodeTextColor: "", 	//우편번호 글자색
					emphTextColor: "", 		//강조 글자색
					outlineColor: "", 		//테두리
					};
					
					//위에서 생성한 themeObj객체를 우편번호 서비스 생성자에 넣습니다.
					//생성자의 자세한 설정은 예제 및 속성탭을 확인해 주세요.
					/*
					new daum.Postcode({
					theme: themeObj
					}).open();
					*/
					/* api data
					var addrData = {
					"postcode": "",
					"postcode1": "",
					"postcode2": "",
					"postcodeSeq": "",
					"zonecode": "01827",
					"address": "서울 노원구 노원로 3",
					"addressEnglish": "3, Nowon-ro, Nowon-gu, Seoul, Korea",
					"addressType": "R",
					"bcode": "1135010300",
					"bname": "공릉동",
					"bnameEnglish": "Gongneung-dong",
					"bname1": "",
					"bname1English": "",
					"bname2": "공릉동",
					"bname2English": "Gongneung-dong",
					"sido": "서울",
					"sidoEnglish": "Seoul",
					"sigungu": "노원구",
					"sigunguEnglish": "Nowon-gu",
					"sigunguCode": "11350",
					"userLanguageType": "K",
					"query": "서울특별시 노원구 노원로 ",
					"buildingName": "우토파크프라자",
					"buildingCode": "1135010300100900004015668",
					"apartment": "N",
					"jibunAddress": "서울 노원구 공릉동 90-4",
					"jibunAddressEnglish": "90-4, Gongneung-dong, Nowon-gu, Seoul, Korea",
					"roadAddress": "서울 노원구 노원로 3",
					"roadAddressEnglish": "3, Nowon-ro, Nowon-gu, Seoul, Korea",
					"autoRoadAddress": "",
					"autoRoadAddressEnglish": "",
					"autoJibunAddress": "",
					"autoJibunAddressEnglish": "",
					"userSelectedType": "R",
					"noSelected": "N",
					"hname": "",
					"roadnameCode": "3110002",
					"roadname": "노원로",
					"roadnameEnglish": "Nowon-ro",
					"zipNo": "01827",
					"roadAddr": "서울 노원구 노원로 3"
					};
					*/
					
					let addr_data;	//getData
					const _parent = this.parent; //부모
					const _parent_ids = [];		 //main form까지의 상위 부모들
					const _comp_ids = [ 'zonecode' ,'address' ,'detail' ];
					const _enumData  = { J : 'jibun' ,R : 'road' ,E : 'English' };
					
					
					//main Form을 찾는다.
					const recurciveParent = function( add ,target ) {
						if(  	 target instanceof nexacro.Form
							&& !(target instanceof nexacro._InnerForm ) ) return target;
						
						add.push( target.id );
						
						return recurciveParent( add ,target.parent );
					};
					
					//바인딩할 데이터
					const getSelectedData = function( addressData ) {
						let { userSelectedType ,userLanguageType ,zonecode } = addressData;
						const targetKey = (_enumData[userSelectedType] || '') + 'Address' + (_enumData[userLanguageType] || '');
						const address = addressData[ targetKey ];
						
						return { zonecode ,address };
					}
					
					//dataset에 바인딩 - item N개
					this.itemBinds = function() {
						const dataset	= _parent.dataset;
						const rootName 	= _parent_ids.reverse().join('.');
						
						if( dataset ) {
							_comp_ids.forEach(function( id ) {
									const target = _parent['bind_'+id];
									const comp_id = rootName + '.form.' + id;
									if( target ) useBind( this._libForm ,dataset ,comp_id ,target );
								}.bind(this));
						}
					}
					
					//item 1개 bind
					const useBind = function( libForm ,dataset ,comp_id ,column ) {
						const column_name = column ? column.replace('bind:','') : '';
						const bind_id = dataset + '_' + column_name;
						const item = new BindItem( bind_id ,comp_id ,'value' ,dataset ,column_name );
						
						libForm.addChild( bind_id ,item );
						item.bind();
					}
					
					//버튼 중앙
					const verticalCenter = function( parent ,target ) {
						const top = parent.height/2 - (target.height/2);
						target.set_top(top);
					}
					
					this._onload = function(obj,e)
					{
						this._libForm = recurciveParent( _parent_ids ,_parent );
						
						this.itemBinds();
						this.redraw();
					};
					
					this.setValue = function() {
						_comp_ids.forEach( function(id) {
								this[id].set_value( _parent[id] );
							}.bind(this));
					}
					
					this.getValue = function( isAll ) {
						if( isAll )  return Object.assign( {} ,addr_data );
						
						return {
							zonecode	: this.zonecode.value
							,address	: this.address.value
							,detail		: this.detail.value
						};
					}
					
					this.address_open = function(obj,e) {
						//초기화
						if( obj instanceof nexacro.Edit && !obj.value ) {
							this.zonecode.set_value('');
							this.address.set_value('');
							return;
						}
						
						//defined라서 조건문 사용불가
						try { window; }
						catch(e) {
							this.alert('브라우저에서만 사용가능 합니다.');
							throw new Error( '브라우저에서만 사용가능 합니다.' );
						}
						
						//팝업 위치를 지정(화면의 가운데 정렬)
						const initWidth  = 500; //팝업의 너비
						const initHeight = 600; //팝업의 높이
						const zonecode 	= this.zonecode;
						const address 	= this.address;
						const detail	= this.detail;
						const animation = _parent.isAnimation == 'true' || _parent.isAnimation == true ? true : false
						
						new daum.Postcode({
								width:  initWidth //생성자에 크기 값을 명시적으로 지정해야 합니다.
								, height: initHeight
								, animation
								, oncomplete: function( addressData ) {
									addr_data  = addressData;//getter용
									const data = getSelectedData( addr_data );
									
									//기존 사용 key값이라서 해당값에 셋팅
									zonecode.set_value( data.zonecode );
									address.set_value( data.address );
									
									detail.setFocus();
									
									_parent.on_fire_onPostEvent();//바인딩 후 사용자가 처리 할 함수
								}
							}).open({
								left: (window.screen.width  / 2) - (initWidth  / 2) + screenLeft
								, top:  (window.screen.height / 2) - (initHeight / 2)
								, popupTitle: 'Daum Address'
								, q: this.address.value
							});
					}
					
					this.redraw = function() {
						let { zonecode_width ,address_width ,edit_height } = _parent;
						
						//code
						this.zonecode.set_width( zonecode_width );
						//address
						this.address.set_width( address_width );
						//edit의 top ,bottom 간격
						_comp_ids.forEach(function(id) {
								const target = this[id];
								target.set_height( edit_height );
								target.set_value( _parent[id] );
								verticalCenter( this ,target );
							}.bind(this));
						//value 바인딩
						this.setValue();
						//버튼중앙
						verticalCenter( this ,this.btnPopUp );
						//릴레이션 반영
						this.resetScroll();
					}
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onload",this._onload,this);
				this.btnPopUp.addEventHandler("onclick",this.address_open,this);
				this.address.addEventHandler("onchanged",this.address_open,this);
			};
			this.loadIncludeScript("Popup_DaumAddress.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};
