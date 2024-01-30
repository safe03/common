//==============================================================================
//	Define the Component.
//==============================================================================
//==============================================================================
// Object : nexacro.MultiCombo
// Group : Component
//==============================================================================
if (!nexacro.MultiCombo)
{
	nexacro.MultiCombo = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		this.addEvent("onitemchanged");
		this.addEvent("canitemchange");
	};
	
	nexacro.MultiCombo.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.MultiCombo);
	nexacro.MultiCombo.prototype._type_name = "MultiCombo";
	nexacro.MultiCombo.prototype._cssclass = "MultiCombo";
	
	/**
	* 값 변경 반영 함수
	*
	* @function
	* @name applyChange
	*/
	nexacro.MultiCombo.prototype.applyChange = function ()
	{
		//- form redraw
		this.form.redraw();
	}
	
	nexacro.MultiCombo.prototype.set_value = function (value)
	{
	
		var pre_value
		  , post_value;
		
		pre_value  = this.form._value;
		post_value = value;
		
		//- value 값이 변경되었을 경우
		if (pre_value !== post_value)
		{
			//- fire event canchange
			if(this.on_fire_canitemchange(pre_value, post_value))
			{
				
				
				//- inner value 변경 처리 함수 호출
				this.form._value = post_value;
				
				//- update change
				this.applyChange();
				
				//- fire event onchange
				this.on_fire_onitemchanged(pre_value, post_value);
			}
		}
	};
	
	nexacro.MultiCombo.prototype.set_displayrowcount = function (displayrowcount)
	{
		this.displayrowcount = displayrowcount
	};
	
	nexacro.MultiCombo.prototype.set_innerdataset = function (innerdataset)
	{
		this.innerdataset = innerdataset;
		
		//- 데이터셋 객체를 찾는다.
		this._innerdataset = this._findDataset(innerdataset);
		
		//- update change
		this.applyChange();
	};
	
	nexacro.MultiCombo.prototype.set_codecolumn = function (codecolumn)
	{
		this.codecolumn = codecolumn;
		
		//- update change
		this.applyChange();
	};
	
	nexacro.MultiCombo.prototype.set_datacolumn = function (datacolumn)
	{
		this.datacolumn = datacolumn;
		
		//- update change
		this.applyChange();
	};
	
	nexacro.MultiCombo.prototype._findDataset = function(datasetName)
	{
		var that     = this;
		var pThat    = null;
		var oDataset = null;
		
		//- 상위 컴포넌트가 없을 때 까지 반복한다.
		while(that)
		{
			pThat = that.parent;
			
			oDataset = that[datasetName];
			
			//- 데이터셋을 찾을 경우 데이터셋 사용
			if(oDataset) return oDataset;
			
			//- 상위 컴포넌트와 현재 컴포넌트 변경
			that = pThat;
		}
		
		//- 찾지 못할 경우 (null)반환
		return null;
	}
	
	nexacro.MultiCombo.prototype.set_rowsize = function (rowsize)
	{
		this.rowsize = rowsize;
	};
	
	nexacro.MultiCombo.prototype.separator = ",";
	nexacro.MultiCombo.prototype.set_separator = function (separator)
	{
		
		//- value 값이 변경되었을 경우
		if (this.separator !== separator)
		{
			
			if(this.form._value)
			{
				//- inner value 변경 처리 함수 호출
				this.form._value = this.form._value.replace(new RegExp(this.separator,'g'), separator);
			}
			
			//- update [[ separator ]]
			this.separator = separator;
			
			//- update change
			this.applyChange();
		}
	};
	
	nexacro.MultiCombo.prototype.showtext = "false";
	nexacro.MultiCombo.prototype.set_showtext = function (showtext)
	{
		this.showtext = showtext;
		
		//- update change
		this.applyChange();
	};
	
	nexacro.MultiCombo.prototype.on_fire_canitemchange = function (pre_value, post_value)
	{
		if (this.canitemchange && this.canitemchange._has_handlers)
		{
			var evt = new nexacro.ItemChangeEventInfo(this, "canitemchange");
			
			evt.prevalue  = pre_value;
			evt.postvalue = post_value;
			
			return this.canitemchange.fireEvent(this, evt);
		}
		
		return true;
	};
	
	nexacro.MultiCombo.prototype.on_fire_onitemchanged = function (pre_value, post_value)
	{
		if (this.onitemchanged && this.onitemchanged._has_handlers)
		{
			var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged");
			
			evt.prevalue  = pre_value;
			evt.postvalue = post_value;
			
			return this.onitemchanged.fireEvent(this, evt);
		}
		
		return true;
	};	
	
	nexacro.MultiCombo.prototype.textAlign = 'center';
	nexacro.MultiCombo.prototype.set_textAlign = function (textAlign) {
		if(this.textAlign != textAlign) {
			this.textAlign = textAlign;
			this.applyChange();
		}
	}	
	
	nexacro.MultiCombo.prototype.wrapCharacter = "";
	nexacro.MultiCombo.prototype.set_wrapCharacter = function (v)
	{
		this.wrapCharacter = v;
	};
	
}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.MultiCombo.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("MultiCombo");
				this.set_cssclass("MultiCombo");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(200,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Edit("edit","0","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_padding("0px 24px 0px 5px");
				obj.set_cssclass("dropedit");
				obj.set_readonly("true");
				obj.set_background("white");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("dropbutton",null,"0","24",null,"0","0",null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_cssclass("dropbutton");
				obj.set_text("");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("pdvitems","0","24","200","185",null,null,null,null,null,null,this);
				obj.set_text("");
				obj.set_border("0px none,1px solid #ededed,1px solid #ededed");
				obj.set_background("white");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Grid("dropgrid","0","0",null,null,"0","0",null,null,null,null,this.pdvitems.form);
				obj.set_taborder("0");
				obj.set_border("0px none");
				obj.set_autofittype("col");
				obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"28\" band=\"left\"/><Column size=\"157\"/></Columns><Rows><Row size=\"24\"/></Rows><Band id=\"body\"><Cell text=\"bind:checkbox\"/><Cell col=\"1\" text=\"bind:text\"/></Band></Format></Formats>");
				this.pdvitems.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",200,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("MultiCombo.xcdl", function() {
					
					/**
					* 화면 로딩 후 처리 함수
					*
					* @event
					* @name _onload
					* @param {object} obj - form object
					* @param {object} e - event object
					*/
					this._onload = function(obj,e)
					{
						//- 화면 랜더링을 재 처리
						this.redraw();
					};
					
					/**
					* 화면 랜더링 처리
					*
					* @function
					* @name redraw
					*/
					this.fn_checkboxID = function()
					{
						return '_checkbox_' + this.parent.sequential;
					}
					
					/**
					* 화면 랜더링 처리
					*
					* @function
					* @name redraw
					*/
					this.redraw = function()
					{
						var innerdataset  = this.parent._innerdataset
						, datacolumn    = this.parent.datacolumn
						, codecolumn    = this.parent.codecolumn
						, seperator     = this.parent.separator
						, rowsize       = this.parent.rowsize || 24
						, showtext      = this.parent.showtext || "false"
						, sequential    = this.parent.sequential
						, checkboxid
						;
						
						//- 바인드 할 데이터셋/컬럼/데이터가 없을 경우 즉시 반환
						if(!innerdataset || !datacolumn || !codecolumn) return;
						
						//- 데이터 컬럼이 없을 경우 즉시 반환
						if(!innerdataset.getColumnInfo(datacolumn)) return;
						
						//- 코드 컬럼이 없을 경우 즉시 반환
						if(!innerdataset.getColumnInfo(codecolumn)) return;
						
						//- get order sequential
						if(!sequential)
						{
							sequential = ( innerdataset.sequential || 0 ) + 1;
							
							innerdataset.sequential = sequential;
							
							this.parent.sequential = sequential;
						}
						
						var str_include  = this.fn_checkboxID()+" == '0' && "
						, str_exclude  = this.fn_checkboxID()+" == '1' && "
						, rowExpr      = -1
						, _value , _values, str_values
						, _data  , _datas , str_datas
						;
						
						//- 체크박스 컬럼이 없을 경우 추가 생성
						if(!innerdataset.getColumnInfo(this.fn_checkboxID()))
						{
							
							var str_formats = '';
							
							innerdataset.addColumn(this.fn_checkboxID(), 'STRING');
							
							//- 전체 행을 순환하면서 '0'으로 값 처리
							for(var e0 = 0 ; e0 < innerdataset.rowcount ; e0++)
							{
								innerdataset.setColumn(e0, this.fn_checkboxID(), '0');
							}
							
							//- 그리드를 컨텐츠 동적으로 생성
							str_formats += '<Formats>';
							str_formats += '  <Format id="default">';
							str_formats += '    <Columns>';
							str_formats += '      <Column size="'+rowsize+'" band="left"/>';
							str_formats += '      <Column size="157"/>';
							str_formats += '    </Columns>';
							str_formats += '    <Rows>';
							str_formats += '      <Row size="'+rowsize+'"/>';
							str_formats += '    </Rows>';
							str_formats += '    <Band id="body">';
							str_formats += '      <Cell text="bind:'+this.fn_checkboxID()+'" displaytype="checkboxcontrol" edittype="checkbox"/>';
							str_formats += '      <Cell col="1" text="bind:'+datacolumn+'"/>';
							str_formats += '    </Band>';
							str_formats += '  </Format>';
							str_formats += '</Formats>';
							
							//- 포맷을 등록
							this.pdvitems.form.dropgrid.set_formats(str_formats);
							
							//- 데이터셋 바인드
							this.pdvitems.form.dropgrid.set_binddataset(innerdataset);
						}
						
						//- 값이 있을 경우 반영
						_value = this._value;
						
						if(_value)
						{
							_values = _value.split(seperator);
							_datas  = [];
							
							//- 데이터 셋 반영(체크박스)
							str_include += '( 1 == 0';
							str_exclude += '( 1 == 1';
							
							for(var e1 = 0 ; e1 < _values.length ; e1++)
							{
								str_value = _values[e1];
								
								str_include += ' || '+codecolumn+' == "'+str_value+'"';
								str_exclude += ' && '+codecolumn+' != "'+str_value+'"';
							}
							
							str_include += ')';
							str_exclude += ')';
							
							//- unchecked to check
							while( ( rowExpr = innerdataset.findRowExpr(str_include) ) > -1)
							{
								innerdataset.setColumn(rowExpr, this.fn_checkboxID(), '1');
							}
							
							//- checked to uncheck
							while( ( rowExpr = innerdataset.findRowExpr(str_exclude) ) > -1)
							{
								innerdataset.setColumn(rowExpr, this.fn_checkboxID(), '0');
							}
							
							//- get name
							_datas = [];
							
							//- loop for get name
							for(var e2 = 0 ; e2 < innerdataset.rowcount ; e2++)
							{
								if(innerdataset.getColumn(e2, this.fn_checkboxID()) == '1')
								{
									_data = innerdataset.getColumn(e2, datacolumn);
									
									_datas.push(_data);
								}
							}
						}
						else
						{
							var defaultValue = _value == '' ? '1' : '0'; //set_value 로 빈값을 주입 했을 경우.
							
							//- init values
							_values = [];
							_datas  = [];
							
							this.fn_setAllEvent(innerdataset,this.pdvitems.form.dropgrid,false);//데이터 처리 후 이벤트 실행
							
							//- reset loop all column '1' to '0'
							for(var e3 = 0 ; e3 < innerdataset.rowcount ; e3++)
							{
								if(defaultValue == '0' && innerdataset.getColumn(e3, this.fn_checkboxID()) == '1')
								{
									_data = innerdataset.setColumn(e3, this.fn_checkboxID(), defaultValue);
								}else {
									//set_value를 전체로 가정 데이터 주입
									innerdataset.setColumn(e3, this.fn_checkboxID(), defaultValue);//loop돌면서 선택 체크
									
									if(defaultValue == '1' && e3 == 0) {
										_values.push(innerdataset.getColumn(e3, codecolumn));//코드리스트
										_datas.push(innerdataset.getColumn(e3, datacolumn));//텍스트리스트
									}
								}
								
							}
							
							this.fn_setAllEvent(innerdataset,this.pdvitems.form.dropgrid,true);//데이터 처리 후 이벤트 실행
						}
						
						//- join value string
						/* 기존
						str_values = _values.join(seperator);
						str_datas  = _datas.join(seperator); */
						
						/* 수정 전체 로직 추가 */
						str_values = this._all_check_status ? '' : this.fn_join(_values,seperator);//코드 값
						str_datas  = this._all_check_status ? _datas[0] : _datas.join(seperator);//코드명 값
						
						//- view value update
						this.parent.value  = str_values;
						this.parent.text   = str_datas;
						this.parent.values = this._all_check_status ? [''] : _values;
						
						//- show with name(dataColumn)
						if(showtext == 'true')
						{
							//- 실제 데이터 반영(data)
							this.edit.set_value(str_datas);
						}
						//- show with code(codeColumn)
						else
						{
							//- 실제 데이터 반영(code)
							this.edit.set_value(str_values);
						}
						
						//set되어있는 textAlign 속성값으로 정렬 변경
						this.fn_textAlign();
						this._all_check_status = false;//로직이 끝나고 전체 선택 상태를 default로 변경
					}
					
					/**
					* wrapCharacter 따라서 데이터 가공
					*
					* @function
					* @name fn_join
					*/
					this.fn_join = function(list,seperator) {
						var returnStr = '';
						var char = this.parent.wrapCharacter ? this.parent.wrapCharacter : '';
						
						for(var i=0; i<list.length; i++) {
							//set_value에 값 주입시 전체 데이터 예외처리
							if(typeof list[i] == 'string' && list[i].trim() == '') continue;
							
							var tStr = char+list[i]+char;
							
							if(i == list.length-1) {
								returnStr += tStr;
								continue;
							}
							returnStr += tStr+seperator
						}
						
						return returnStr;
					}
					
					
					/**
					* 값 변경에 따른 이벤트 처리
					*
					* @function
					* @name fn_updateData
					*/
					this.fn_updateData = function()
					{
						var innerdataset = this.parent._innerdataset
						, codecolumn   = this.parent.codecolumn
						, seperator    = this.parent.separator
						, str_checkbox
						, str_code
						, arr_codes = []
						, pre_value
						, post_value
						;
						
						for(var e1 = 0 ; e1 < innerdataset.rowcount ; e1++)
						{
							str_checkbox = innerdataset.getColumn(e1, this.fn_checkboxID());
							
							//- 선택된 행을 처리
							if(this._all_check_status || str_checkbox == '1')
							{
								str_code = innerdataset.getColumn(e1, codecolumn);
								
								//- 배열에 저장하여 처리
								arr_codes.push(str_code);
							}
						}
						
						
						
						//- 배열 값 처리
						if(arr_codes.length > 0)
						{
							post_value = arr_codes.join(seperator);
							pre_value  = this._value;
							
							//- fire event canchange
							if(this.parent.on_fire_canitemchange(pre_value, post_value))
							{
								this._value = post_value;
								
								//- fire event onchange
								this.parent.on_fire_onitemchanged(pre_value, post_value);
							}
							
							//- 재 반영
							this.redraw();
						}
						else
						{
							post_value = undefined;
							pre_value  = this._value;
							
							//- fire event canchange
							if(this.parent.on_fire_canitemchange(pre_value, post_value))
							{
								this._value = post_value;
								
								//- fire event onchange
								this.parent.on_fire_onitemchanged(pre_value, post_value);
							}
							
							//- 재 반영
							this.redraw();
						}
					}
					
					
					/**
					* 전체 체크 로직
					*
					* @function
					* @name fn_AllCheck
					*/
					this.fn_AllCheck = function(innerdataset,e,post_value) {
						var isAllSelect  = e.row == 0 && (e.col != 0 && post_value == '1') || (e.col == 0 && post_value == '0');//true면 전체 선택
						
						//전체의 row가 첫번째라는 가정
						if(e.row == 0 && isAllSelect) {
							this._all_check_status = true;//true 상태면 전체 클릭 상태
						}else if(e.row == 0 && !isAllSelect) {
							this.fn_setAllEvent(innerdataset,this.pdvitems.form.dropgrid,false);
							this.fn_checkClear(innerdataset);
							this.fn_setAllEvent(innerdataset,this.pdvitems.form.dropgrid,true);
						}
					}
					
					/**
					* 전체 체크 해제 로직
					*
					* @function
					* @name fn_checkClear
					*/
					this.fn_checkClear = function(dataset) {
						for(var i=0; i<dataset.rowcount; i++) {
							dataset.setColumn(i, this.fn_checkboxID(), '0');//해제값 주입
						}
					}
					
					/**
					* 화면 사이즈 변경 시 드롭 버튼 이벤트 처리
					*
					* @event
					* @name _onsize
					* @param {object} obj - form object
					* @param {object} e - event object
					*/
					this._onsize = function(obj,e)
					{
						var nY = e.cy;
						
						this.dropbutton.set_width(nY);
						
						this.resetScroll();
					};
					
					/**
					* 에디트 버튼 클릭 시 이벤트 처리
					*
					* @event
					* @name edit_oneditclick
					* @param {object} obj - form object
					* @param {object} e - event object
					*/
					this.edit_oneditclick = function(obj,e)
					{
						//- 드롭 버튼 클릭
						this.dropbutton.click();
					};
					
					/**
					* 드롭 버튼 클릭 시 이벤트 처리
					*
					* @event
					* @name dropbutton_onclick
					* @param {object} obj - form object
					* @param {object} e - event object
					*/
					this.dropbutton_onclick = function(obj,e)
					{
						
						var objDataset = this.parent._innerdataset;
						var nRowSize   = this.parent.rowsize || 24;
						var nRowCount  = objDataset ? objDataset.rowcount : 0;
						
						var nDisplayrowcount = this.parent.displayrowcount || nRowCount;
						
						
						//- display rowcount가 실제 행 보다 클 경우 최대 행으로 변경
						if ( nDisplayrowcount > nRowCount )
						{
							nDisplayrowcount = nRowCount;
						}
						
						//- init size
						var nLeft   = 0
						, nTop    = nexacro.toNumber(this.height)
						, nWidth  = nexacro.toNumber(this.width)
						, nHeight = nexacro.toNumber( ( nDisplayrowcount * nRowSize ) + 1 ) /* default 1px :: with border bottom */
						;
						
						//- call drop down popup
						this.pdvitems.trackPopupByComponent(this.edit, nLeft, nTop, nWidth, nHeight);
					};
					
					
					/**
					* 그리드 클릭 시 이벤트 처리
					*
					* @event
					* @name pdvitems_dropgrid_oncellclick
					* @param {object} obj - form object
					* @param {object} e - event object
					*/
					this.pdvitems_dropgrid_oncellclick = function(obj,e)
					{
						var innerdataset = this.parent._innerdataset;
						var codeColumn   = this.parent.codecolumn;
						var post_value   = innerdataset.getColumn(e.row, this.fn_checkboxID()) == '0' ? '1' : '0';//pre_value
						var allCodeValue = innerdataset.getColumn(0, codeColumn);//가공할 code value
						var getCode		 = allCodeValue.trim() ? allCodeValue : undefined;//0번째 index의 값이 없으면 전체 사용여부 판단.
						
						
						//- 체크박스 또는 컴포넌트 처리
						if(e.col != 0)
						{
							//- 반전 값 등록 -> e.col != 0 값 변경전 값이 들어옴 , e.col == 0 값 변경 후 값이 들어옴
							innerdataset.setColumn(e.row, this.fn_checkboxID(), post_value);
						}
						
						//코드값이 없는 속성이 존재 할 경우만 전체 로직이 실행
						if(!allCodeValue) {
							//e.col != 0  값이 변경 전 카운트를 조회 하기 때문에 위에서 로직 실행 후 카운트 가져옴.
							var checkcount   = innerdataset.getCaseCount(this.fn_checkboxID() + " == '1' && "+codeColumn);//전체 제외
							
							//코드값이 없을 경우
							if(e.row == 0 && !getCode) {
								this.fn_AllCheck(innerdataset,e,post_value);
							}
							
							if(e.row != 0) {
								if(checkcount == (innerdataset.rowcount-1)) {
									this._all_check_status = true;
								}else {
									innerdataset.setColumn(0,this.fn_checkboxID(),'0');
								}
							}
						}
						
						//- 데이터 반영
						this.fn_updateData();
					};
					
					
					/**
					* 키 입력 시 이벤트 처리
					*
					* @event
					* @name _onkeydown
					* @param {object} obj - form object
					* @param {object} e - event object
					*/
					this._onkeydown = function(obj,e)
					{
						//- (esc) 입력 시 이벤트 처리(팝업 종료)
						if ( e.keycode == 27 || e.keycode == 13 )
						{
							this.pdvitems.closePopup(true);
						}
						else if ( e.ctrlkey )
						{
							//- ctrl + c
							if ( e.keycode == 67 )
							{
								//- copy values
								system.clearClipboard();
								
								system.setClipboard("CF_TEXT", this.parent.value);
							}
							//- ctrl + v
							else if ( e.keycode == 86 )
							{
								//- 사파리를 위한 후처리기 생성
								_callback = function(data){
									
									var pre_value  = this._value;
									var post_value = data;
									
									//- fire event canchange
									if(this.parent.on_fire_canitemchange(pre_value, post_value))
									{
										//- 값 반영
										this._value = post_value;
										
										//- 재 반영
										this.redraw();
										
										//- fire event onchange
										this.parent.on_fire_onitemchanged(pre_value, post_value);
									}
								};
								
								var data = system.getClipboard("CF_TEXT", _callback, this);
								
								//- 사파리외의 플렛폼을 위하여 즉시 반환 함수 처리
								if(data)
								{
									var pre_value  = this._value;
									var post_value = data;
									
									//- fire event canchange
									if(this.parent.on_fire_canitemchange(pre_value, post_value))
									{
										//- 값 반영
										this._value = post_value;
										
										//- 재 반영
										this.redraw();
										
										//- fire event onchange
										this.parent.on_fire_onitemchanged(pre_value, post_value);
									}
								}
							}
							//- ctrl + a
							else if ( e.keycode == 65 )
							{
								var innerdataset = this.parent._innerdataset;
								
								for(var e0 = 0 ; e0 < innerdataset.rowcount ; e0++)
								{
									if ( e.shiftkey )
									{
										innerdataset.setColumn(e0, this.fn_checkboxID(), '0');
									}
									else
									{
										innerdataset.setColumn(e0, this.fn_checkboxID(), '1');
									}
								}
								
								//- 데이터 반영
								this.fn_updateData();
							}
						}
						//- (space) 입력 시 값 처리
						else if ( e.keycode == 32)
						{
							var nCell = this.pdvitems.form.dropgrid.getCellPos();
							
							//- 체크박스일 경우 값 데이터 반영
							if(nCell == 0)
							{
								//- 데이터 반영
								this.fn_updateData();
							}
							else
							{
								var innerdataset = this.parent._innerdataset;
								
								var str_checked = innerdataset.getColumn(innerdataset.rowposition, this.fn_checkboxID());
								
								//- 반전 값 등록
								if(str_checked == '1')
								{
									innerdataset.setColumn(innerdataset.rowposition, this.fn_checkboxID(), '0');
									
								}
								else
								{
									innerdataset.setColumn(innerdataset.rowposition, this.fn_checkboxID(), '1');
								}
								
								//- 데이터 반영
								this.fn_updateData();
							}
						}
					};
					
					
					
					/**
					* 텍스트 정렬 로직
					*
					* @function
					* @name fn_textAlign
					*/
					this.fn_textAlign = function() {
						this.pdvitems.form.dropgrid.setCellProperty( "body", 1, "textAlign", this.parent.textAlign);
					}
					
					/**
					* 이벤트 일괄 처리 - 속도 문제
					*
					* @function
					* @name fn_setAllEvent
					*/
					this.fn_setAllEvent = function(dataset,grid,tNf) {
						grid.set_enableevent(tNf);
						grid.set_enableredraw(tNf);
						dataset.set_enableevent(tNf);
					}
					
					
					
					
					
					
					
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onsize",this._onsize,this);
				this.addEventHandler("onload",this._onload,this);
				this.addEventHandler("onkeydown",this._onkeydown,this);
				this.edit.addEventHandler("oneditclick",this.edit_oneditclick,this);
				this.dropbutton.addEventHandler("onclick",this.dropbutton_onclick,this);
				this.pdvitems.form.dropgrid.addEventHandler("oncellclick",this.pdvitems_dropgrid_oncellclick,this);
				this.pdvitems.form.dropgrid.addEventHandler("oncelldblclick",this.pdvitems_dropgrid_oncelldblclick,this);
			};
			this.loadIncludeScript("MultiCombo.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};