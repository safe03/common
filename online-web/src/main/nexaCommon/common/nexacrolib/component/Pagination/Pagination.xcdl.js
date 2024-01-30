//==============================================================================
//	Define the Component.
//==============================================================================
//==============================================================================
// Object : nexacro.Pagination
// Group : Component
//==============================================================================
if (!nexacro.Pagination)
{
	nexacro.Pagination = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		
		this.addEvent("onPageChange");
	};
	
	nexacro.Pagination.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.Pagination);
	nexacro.Pagination.prototype._type_name = "Pagination";
	
	//Properties --------------------------------------  start ------------------------------------------
	nexacro.Pagination.prototype.limit     = '10'; //그리드이 보여질 row의 수
	nexacro.Pagination.prototype.max       = 10; //페이징 navigator에 보여질 버튼의 수
	nexacro.Pagination.prototype.pos       = 1;  //현재의 페이지 number
	nexacro.Pagination.prototype.datacount = 0;  //데이터의 총 갯수
	nexacro.Pagination.prototype.maxcount  = 1;  //페이지의 총 갯수
	nexacro.Pagination.prototype.startIndex  = '0';  //시작 index
	nexacro.Pagination.prototype._prev_counts = [];  //시작 index
	//Properties --------------------------------------  end --------------------------------------------
	
	//Setter --------------------------------------  start ------------------------------------------
	nexacro.Pagination.prototype.set_limit = function (v)
	{
		this.limit 		= v+'';
		this._redraw();
	};
	
	nexacro.Pagination.prototype.set_max = function (v)
	{
		this.max = parseInt(v);
	};
	
	nexacro.Pagination.prototype.set_pos = function (v)
	{
		this.pos = parseInt(v);
	};
	
	nexacro.Pagination.prototype.set_datacount = function (v)
	{
		this.datacount = parseInt(v);
		if(this.form.fn_prevDataCountCheck(this._prev_counts)) {
			this._redraw();
		};
		this.form.stsTotalCnt.set_text('총 <fc v="#e8252d">'+this.datacount+' </fc>건');
	};
	
	nexacro.Pagination.prototype.set_innerdataset = function (innerdataset)
	{
		this.innerdataset = innerdataset;
		
		//- 데이터셋 객체를 찾는다.
		this._innerdataset = this._findDataset(innerdataset);
	};
	
	nexacro.Pagination.prototype.set_codecolumn = function (codecolumn)
	{
		this.codecolumn = codecolumn;
	};
	
	nexacro.Pagination.prototype.set_datacolumn = function (datacolumn)
	{
		this.datacolumn = datacolumn;	
	};
	
	nexacro.Pagination.prototype._redraw = function() {
		const PAGE_SIZE = Math.ceil(this.datacount/parseInt(this.limit));//총 페이지 사이즈
		this.maxcount   = PAGE_SIZE < 1 ? 1 : PAGE_SIZE;//datacount / limit
		
		if(this.form.fn_setInit) {
			this.set_pos(1);
			this.startIndex = '0';
			this.form.fn_setInit();
		}
	}
	
	//Setter --------------------------------------  end --------------------------------------------
	
	
	//Getter --------------------------------------  start ------------------------------------------
	nexacro.Pagination.prototype._findDataset = function(datasetName)
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
	
	//Getter --------------------------------------  end --------------------------------------------
	
	
	//Event --------------------------------------  start ------------------------------------------
	/**
	 * Page button click, limit(combo) change event
	 *
	 * @function
	 * @name on_fire_onPageChange
	 */
	nexacro.Pagination.prototype.on_fire_onPageChange = function (bpage, apage, limit)
	{
		if (this.onPageChange && this.onPageChange._has_handlers)
		{
			var evt = new nexacro.EventInfo(this, "onPageChange"); //TODO
			
			evt.beforepos 	= bpage;
			evt.postpos   	= apage;
			evt.limit     	= limit;//return string
			evt.startIndex  = ((apage-1)*limit) + '';//return string -> 이전 datacount와 현재 datacount가 다를 경우 index를 0으로 초기화
			
			this.startIndex = evt.startIndex;
			
			return this.onPageChange.fireEvent(this, evt);
		}
		return false;
	};
	//Event --------------------------------------  end ------------------------------------------
	
	
	
	
	
	
}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.Pagination.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("Pagination");
				this.set_titletext("Pagination");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(750,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Button("Button33","134","186","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_text("1");
				obj.set_cssclass("btn_paging_num_S");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("Static12_00","179","186","154","24",null,null,null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_text("cssclass : btn_paging_num_S");
				obj.set_cssclass("sta_guide_status");
				obj.set_color("#ffffff");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Div("divNavigator","100","0","550","24",null,null,null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_text("");
				obj.set_formscrollbartype("none");
				obj.set_tabstop("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Div("prevs","0","0","120","24",null,null,null,null,null,null,this.divNavigator.form);
				obj.set_taborder("0");
				obj.set_text("Div00");
				obj.set_visible("true");
				obj.set_tabstop("false");
				this.divNavigator.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnMaxPrev","40","0","31","24",null,null,null,null,null,null,this.divNavigator.form.prevs.form);
				obj.set_taborder("0");
				obj.set_cssclass("btn_paging_first");
				obj.set_text("");
				this.divNavigator.form.prevs.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPrev","71","0","28","24",null,null,null,null,null,null,this.divNavigator.form.prevs.form);
				obj.set_taborder("1");
				obj.set_cssclass("btn_paging_prev");
				this.divNavigator.form.prevs.addChild(obj.name, obj);
				
				obj = new nexacro.Div("nexts","419","0","120","24",null,null,null,null,null,null,this.divNavigator.form);
				obj.set_taborder("1");
				obj.set_text("Div01");
				obj.set_tabstop("false");
				this.divNavigator.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnMaxNext","48","0","31","24",null,null,null,null,null,null,this.divNavigator.form.nexts.form);
				obj.set_taborder("0");
				obj.set_cssclass("btn_paging_end");
				this.divNavigator.form.nexts.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnNext","20","0","28","24",null,null,null,null,null,null,this.divNavigator.form.nexts.form);
				obj.set_taborder("1");
				obj.set_cssclass("btn_paging_next");
				obj.set_background("url(\'imagerc::Pagination/page_end_D.png\') no-repeat center center");
				this.divNavigator.form.nexts.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button31","119","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("3");
				obj.set_text("1");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button32","149","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("4");
				obj.set_text("2");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button34","179","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("5");
				obj.set_text("3");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button35","209","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("6");
				obj.set_text("4");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button36","239","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("7");
				obj.set_text("5");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button38","299","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("8");
				obj.set_text("7");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button39","389","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("9");
				obj.set_text("10");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button40","359","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("10");
				obj.set_text("9");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button41","329","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("11");
				obj.set_text("8");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button37","269","40","30","24",null,null,null,null,null,null,this);
				obj.set_taborder("12");
				obj.set_text("6");
				obj.set_cssclass("btn_paging_num");
				obj.set_visible("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Combo("cmbLimit",null,"0","100","24","0",null,null,null,null,null,this);
				obj.set_taborder("13");
				obj.set_codecolumn("codecolumn");
				obj.set_datacolumn("datacolumn");
				var cmbLimit_innerdataset = new nexacro.NormalDataset("cmbLimit_innerdataset", obj);
				cmbLimit_innerdataset._setContents("<ColumnInfo><Column id=\"codecolumn\" size=\"256\"/><Column id=\"datacolumn\" size=\"256\"/></ColumnInfo><Rows><Row><Col id=\"codecolumn\">10</Col><Col id=\"datacolumn\">10개</Col></Row><Row><Col id=\"codecolumn\">20</Col><Col id=\"datacolumn\">20개</Col></Row><Row><Col id=\"codecolumn\">30</Col><Col id=\"datacolumn\">30개</Col></Row><Row><Col id=\"codecolumn\">40</Col><Col id=\"datacolumn\">40개</Col></Row><Row><Col id=\"codecolumn\">50</Col><Col id=\"datacolumn\">50개</Col></Row></Rows>");
				obj.set_innerdataset(cmbLimit_innerdataset);
				obj.set_text("10개");
				obj.set_value("10");
				obj.set_index("0");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("stsTotalCnt","0","0","100","24",null,null,null,null,null,null,this);
				obj.set_taborder("14");
				obj.set_text("<fc v=\"#e8252d\">0</fc>건");
				obj.set_usedecorate("true");
				this.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",750,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("Pagination.xcdl", function() {
					/************************** instance variables ***************************************/
					const NAV_DIV  = this.divNavigator; //navigation div
					const PREV_DIV = this.divNavigator.form.prevs;//prev div의 form
					const NEXT_DIV = this.divNavigator.form.nexts;//next div의 form
					const PREV_NEXT_SIZE = parseInt(PREV_DIV.width) + parseInt(NEXT_DIV.width);
					const BTN_ID  = 'btn';//버튼의 공통 ID
					const BTN_CSS = 'btn_paging_num';//버튼의 공통 CSS
					const PREV_NEXT_INFO = {prev:undefined,next:undefined};//prev,next button setting
					let _prev_pos = this.parent.pos;//init 값
					let _pages_div;//page numbers div의 form
					let _btn_size = 30;//init
					let _nav_size = NAV_DIV.width;//init
					let _btn_div_size = 0;
					/************************** instance variables ***************************************/
					
					/**
					* div 위치 잡기
					*
					* @function
					* @name fn_pageing_draw
					* @Comment 버튼 생성 사이즈를 계산해서 div사이즈를 만듬.
					*/
					this.fn_pageing_draw = function() {
						const MAIN_SIZE = this.width;
						const NEED_PAGES_SIZE = _btn_div_size;//버튼의 필요한 사이즈
						const PN_SIZE = NEED_PAGES_SIZE+PREV_NEXT_SIZE;
						
						const SIZE_CHECKER    = MAIN_SIZE-200 < PN_SIZE;
						let left_size = SIZE_CHECKER ? 0 : PREV_NEXT_SIZE/2;
						_nav_size = SIZE_CHECKER ? NEED_PAGES_SIZE : PN_SIZE;
						
						//prev,next 활성화 상태
						PREV_DIV.set_visible(!SIZE_CHECKER);
						NEXT_DIV.set_visible(!SIZE_CHECKER);
						
						_pages_div.set_left(left_size);
						_pages_div.set_width(NEED_PAGES_SIZE);
						
						NAV_DIV.set_left(MAIN_SIZE/2 - (_nav_size/2));
						NAV_DIV.set_width(_nav_size);
						
						if(!SIZE_CHECKER) {
							NEXT_DIV.set_left(NEED_PAGES_SIZE+left_size);
						}
					}
					
					/**
					* div 생성
					*
					* @function
					* @name fn_createPages_div
					* @param pos(number) = pos(page 위치값)
					* @Comment buttons를 담는 div를 생성 button을 생성하면서 해당 div에 추가
					*/
					this.fn_createPages_div = function(pos) {
						
						if(_pages_div) {
							_pages_div.destroy();
						}
						
						const ID  = 'pageList';
						const DIV = new Div(ID,0,0,0,24);
						
						DIV.set_formscrollbartype('none');
						NAV_DIV.addChild(ID,DIV);
						DIV.show();
						
						_pages_div = DIV;
						
						this.fn_createBtns(pos);
					}
					
					/**
					* button 생성
					*
					* @function
					* @name fn_createBtns
					* @param pos(number) = pos(page 위치값)
					* @Comment 버튼 생성하면서 필요한 값 세팅 및 div사이즈 셋팅
					*/
					this.fn_createBtns = function(pos) {
						const POS = pos ? pos : this.parent.pos;
						const MAX = this.parent.max;
						const BTN_SIZE = (POS+MAX+'').length*5+20;
						let create_btns = 0;
						
						_btn_size = BTN_SIZE;
						
						for(let i=0; i<MAX; i++) {
							if(POS+i > this.parent.maxcount) continue;
							const text = POS+i;
							const ID = BTN_ID+text;
							const BTN = new Button(ID,BTN_SIZE*i,0,BTN_SIZE,24);
							
							BTN.set_text(text);
							BTN.set_cssclass(BTN_CSS);
							BTN.index = i;
							BTN.pos   = POS+i;
							
							BTN.addEventHandler( 'onclick', this.pg_btn_click, this );
							_pages_div.addChild(ID,BTN);
							BTN.show();
							
							if(i == 0) {
								PREV_NEXT_INFO.prev = BTN;
							}else if(i == MAX-1) {
								PREV_NEXT_INFO.next = BTN;
							}
							if(POS+i == this.parent.maxcount) {
								PREV_NEXT_INFO.next = BTN;
							}
							
							create_btns++;
						}
						
						_btn_div_size = _btn_size*create_btns;
					}
					
					/**
					* bind dataset 변경
					*
					* @function
					* @name fn_bindDataset
					* @Comment dataset이 존재 할 경우 해당 dataset으로 변경
					*/
					this.fn_bindDataset = function() {
						const INNERDATASET  = this.parent._innerdataset
						, DATACOLUMN    = this.parent.datacolumn
						, CODECOLUMN    = this.parent.codecolumn
						
						//- 바인드 할 데이터셋/컬럼/데이터가 없을 경우 즉시 반환
						if(!INNERDATASET || !DATACOLUMN || !CODECOLUMN) return;
						
						//- 데이터 컬럼이 없을 경우 즉시 반환
						if(!INNERDATASET.getColumnInfo(DATACOLUMN)) return;
						
						//- 코드 컬럼이 없을 경우 즉시 반환
						if(!INNERDATASET.getColumnInfo(CODECOLUMN)) return;
						
						this.cmbLimit.set_innerdataset(INNERDATASET);
						this.cmbLimit.set_datacolumn(DATACOLUMN);
						this.cmbLimit.set_codecolumn(CODECOLUMN);
					}
					
					/**
					* datacount의 이전 값과 현재값을 비교 하여 달라졌을 경우 체크
					*
					* @function
					* @name fn_prevDataCountCheck
					* @return boolean -> true면 redraw
					*/
					this.fn_prevDataCountCheck = function(prevs_cnt) {
						const DT_CNT = this.parent.datacount;
						
						if(prevs_cnt.length < 2) {
							prevs_cnt.push(DT_CNT);
							prevs_cnt.push(DT_CNT);
							return true;
						}else {
							prevs_cnt[0] = prevs_cnt[1];
							prevs_cnt[1] = DT_CNT;
						}
						
						return prevs_cnt[0] != prevs_cnt[1];
					}
					
					/**
					* 화면 + 데이터 setting
					*
					* @function
					* @name fn_setInit
					*/
					this.fn_setInit = function() {
						this.fn_createPages_div();//div + button 생성
						this.fn_pageing_draw();//가변 위치
						this.fn_bindDataset();//dataset 체크 후 바인딩
						this.cmbLimit.set_value(this.parent.limit);//limit combo에 setting
					}
					
					/**
					* Pagination 생성시 이벤트
					*
					* @function
					* @name _onload
					*/
					this._onload = function(obj,e)
					{
						this.parent.set_pos(1);
						this.parent.startIndex = '0';
						this.parent._prev_counts = [];
						this.fn_setInit();
					};
					
					/***********************************************	EVENT START		**************************************************/
					/**
					* Pagination 사이즈 변경시 이벤트
					*
					* @function
					* @name _onsize
					*/
					this._onsize = function(obj,e)
					{
						this.fn_createPages_div();
						this.fn_pageing_draw();
					};
					
					
					/**
					* page button 클릭 이벤트
					*
					* @function
					* @name pg_btn_click
					*/
					this.pg_btn_click = function(obj,e) {
						_prev_pos = this.parent.pos;
						this.parent.set_pos(obj.pos);
						this.parent.on_fire_onPageChange(_prev_pos,this.parent.pos,this.parent.limit);
					}
					
					/**
					* prev 버튼 클릭 이벤트
					*
					* @function
					* @name divNavigator_btnPrev_onclick
					*/
					this.divNavigator_btnPrev_onclick = function(obj,e)
					{
						const POS = this.parent.pos;
						const T_BTN = _pages_div.form[BTN_ID+POS];
						const INDEX = T_BTN.index;
						let btn_idx;
						
						if(POS > 1) {
							if(INDEX == 0) {
								this.fn_createPages_div(T_BTN.pos - this.parent.max);
								this.fn_pageing_draw();
							}
							
							btn_idx = BTN_ID + (T_BTN.pos-1);
							_pages_div.form[btn_idx].setFocus();
							_pages_div.form[btn_idx].click();
						}else {
							btn_idx = BTN_ID+1;
							_pages_div.form[btn_idx].setFocus();
							_pages_div.form[btn_idx].click();
						}
					};
					
					/**
					* next 버튼 클릭 이벤트
					*
					* @function
					* @name divNavigator_btnNext_onclick
					*/
					this.divNavigator_btnNext_onclick = function(obj,e)
					{
						const MAX   = this.parent.max-1;
						const T_BTN = _pages_div.form[BTN_ID+this.parent.pos];
						const INDEX = T_BTN.index;
						const NEXT_POS = T_BTN.pos+1;
						const NEXT_ID  = BTN_ID+NEXT_POS;
						
						if(NEXT_POS <= this.parent.maxcount) {
							if(INDEX == MAX) {
								this.fn_createPages_div(NEXT_POS);
								this.fn_pageing_draw();
							}
							_pages_div.form[NEXT_ID].setFocus();
							_pages_div.form[NEXT_ID].click();
						}else {
							_pages_div.form[BTN_ID+this.parent.maxcount].setFocus();
							_pages_div.form[BTN_ID+this.parent.maxcount].click();
						}
					};
					
					/**
					* btnMaxPrev 버튼 클릭 이벤트
					*
					* @function
					* @name divNavigator_btnMaxPrev_onclick
					*/
					this.divNavigator_btnMaxPrev_onclick = function(obj,e)
					{
						const POS = this.parent.pos;
						const PREV_POS = PREV_NEXT_INFO.prev.pos;
						let btn_idx;
						
						if(POS > this.parent.max) {
							this.fn_createPages_div(PREV_POS - this.parent.max);
							this.fn_pageing_draw();
							btn_idx = BTN_ID+(PREV_POS-1);
						}else {
							btn_idx = BTN_ID+1;
						}
						_pages_div.form[btn_idx].setFocus();
						_pages_div.form[btn_idx].click();
					};
					
					/**
					* btnMaxNext 버튼 클릭 이벤트
					*
					* @function
					* @name divNavigator_btnMaxNext_onclick
					*/
					this.divNavigator_btnMaxNext_onclick = function(obj,e)
					{
						const NEXT_POS = PREV_NEXT_INFO.next.pos+1;
						const NEXT_ID  = BTN_ID+NEXT_POS;
						
						if(NEXT_POS <= this.parent.maxcount) {
							this.fn_createPages_div(NEXT_POS);
							this.fn_pageing_draw();
							
							_pages_div.form[NEXT_ID].setFocus();
							_pages_div.form[NEXT_ID].click();
						}else {
							_pages_div.form[BTN_ID+this.parent.maxcount].setFocus();
							_pages_div.form[BTN_ID+this.parent.maxcount].click();
						}
					};
					
					/**
					* limit 아이템 변경 이벤트
					*
					* @function
					* @name cmbLimit_onitemchanged
					*/
					this.cmbLimit_onitemchanged = function(obj,e)
					{
						this.parent.set_limit(e.postvalue);
						this.parent.on_fire_onPageChange(_prev_pos,this.parent.pos,this.parent.limit);
					};
					
					/***********************************************	EVENT END		**************************************************/
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onsize",this._onsize,this);
				this.addEventHandler("onload",this._onload,this);
				this.divNavigator.addEventHandler("onsize",this.divNavigator_onsize,this);
				this.divNavigator.form.prevs.form.btnMaxPrev.addEventHandler("onclick",this.divNavigator_btnMaxPrev_onclick,this);
				this.divNavigator.form.prevs.form.btnPrev.addEventHandler("onclick",this.divNavigator_btnPrev_onclick,this);
				this.divNavigator.form.nexts.form.btnMaxNext.addEventHandler("onclick",this.divNavigator_btnMaxNext_onclick,this);
				this.divNavigator.form.nexts.form.btnNext.addEventHandler("onclick",this.divNavigator_btnNext_onclick,this);
				this.Button31.addEventHandler("onclick",this.divNavigator_Button31_onclick,this);
				this.cmbLimit.addEventHandler("onitemchanged",this.cmbLimit_onitemchanged,this);
			};
			this.loadIncludeScript("Pagination.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};