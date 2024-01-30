//==============================================================================
//	Define the Component.
//==============================================================================
//==============================================================================
// Object : nexacro.monthCalendar
// Group : Component
//==============================================================================
if (!nexacro.monthCalendar)
{
	nexacro.monthCalendar = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		this.addEvent("onChanged");
	};
	
	nexacro.monthCalendar.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.monthCalendar);
	nexacro.monthCalendar.prototype._type_name = "monthCalendar";
	
	var _objBindItem;
	
	nexacro.monthCalendar.prototype.setCssclass = function (strCss)
	{
		// TODO : enter your code here.
		this.form.mCal00.set_cssclass(strCss);
	};
	
	nexacro.monthCalendar.prototype.getCssclass = function ()
	{
		return this.form.mCal00.cssclass;
	};
	
	nexacro.monthCalendar.prototype.setValue = function (strVal)
	{
		// TODO : enter your code here.
		this.form.mCal00.set_value(strVal);
	};
	
	nexacro.monthCalendar.prototype.getValue = function ()
	{
		// TODO : enter your code here.
		return (this.form.mCal00.value||'').substr(0,6);
	};
	
	nexacro.monthCalendar.prototype.getText = function ()
	{
		// TODO : enter your code here.
		return ((this.form.mCal00.value||'')=='')?'':this.form.mCal00.text;
	};
	
	nexacro.monthCalendar.prototype.binddataset = "";
	nexacro.monthCalendar.prototype.set_binddataset = function (v)
	{
		
		//값이 없을 경우 초기화
		if(!v)
		{
			this._binddataset = null;
			this.binddataset = "";
		}
		//값이 Object 형일 경우
		else if (typeof v != "string") {
			if (v instanceof nexacro.Dataset || (typeof v == "object" && v._type_name == "Dataset")) {
				
				//Object 담기
				this._binddataset = v;
				
				//String 담기
				this.binddataset = v.id;
			}
		}
		//값이 String 형일 경우
		else if (this.binddataset != v) {
			//해당 Dataset 찾기
			var _v = this._findDataset(v);
			
			//Object 담기
			this._binddataset = _v ? _v : "";
			
			//String 담기
			this.binddataset = v;
		}
		
		if(this.binddataset == '' || this.binddataset == undefined){
			if(this.getOwnerFrame().form.isValidObject("_objBindItem")){
				this.parent.removeChild("item_"+this.id);
				_objBindItem.destroy();
				
			}
		}
		
		if(!(this.binddataset == '' || this.binddataset == undefined) && !(this.bindcolumn == '' || this.bindcolumn == undefined) ){
			if(this.getOwnerFrame().form.isValidObject("_objBindItem")){
				this.parent.removeChild("item_"+this.id);
				_objBindItem.destroy();
			}
			_objBindItem = new BindItem();
			_objBindItem.init("item_"+this.id, this.id+".form.mCal00", "value", this.binddataset, this.bindcolumn);
			this.parent.addChild("item_"+this.id, _objBindItem);
			_objBindItem.bind();
			
			
		}else{
			if(this.getOwnerFrame().form.isValidObject("_objBindItem")){
				this.parent.removeChild("item_"+this.id);
				_objBindItem.destroy();
				
			}
		}
	};
	
	nexacro.monthCalendar.prototype.bindcolumn = "";
	nexacro.monthCalendar.prototype.set_bindcolumn = function (v)
	{
		if(this.bindcolumn != v){
			this.bindcolumn = v;
		}
		if(this.bindcolumn == '' || this.bindcolumn == undefined){
			if(this.getOwnerFrame().form.isValidObject("_objBindItem")){
				this.parent.removeChild("item_"+this.id);
				_objBindItem.destroy();
			}
		}
		if(!(this.binddataset == '' || this.binddataset == undefined) && !(this.bindcolumn == '' || this.bindcolumn == undefined) ){
			if(this.getOwnerFrame().form.isValidObject("_objBindItem")){
				this.parent.removeChild("item_"+this.id);
				_objBindItem.destroy();
			}
			_objBindItem = new BindItem();
			_objBindItem.init("item_"+this.id, this.id+".form.mCal00", "value", this.binddataset, this.bindcolumn);
			this.parent.addChild("item_"+this.id, _objBindItem);
			_objBindItem.bind();
			
			
			
		}else{
			if(this.getOwnerFrame().form.isValidObject("_objBindItem")){
				this.parent.removeChild("item_"+this.id);
				_objBindItem.destroy();
				
			}
		}
	};	
	
	nexacro.monthCalendar.prototype.on_fire_onChanged = function (obj,e)
	{
		if (this.onChanged && this.onChanged._has_handlers)
		{
			return this.onChanged.fireEvent(obj, e);
		}
		return false;
	};
}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.monthCalendar.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("monthCalendar");
				this.set_titletext("monthCalendar");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(100,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Calendar("mCal00","0","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM");
				obj.set_editformat("yyyy-MM");
				obj.set_popuptype("none");
				obj.set_cssclass("monthCalendar_Calendar");
				obj.set_backgroundcolumn("backgroundcolumn");
				obj.set_bordercolumn("bordercolumn");
				obj.set_datecolumn("datecolumn");
				obj.set_textcolorcolumn("textcolorcolumn");
				var mCal00_innerdataset = new nexacro.NormalDataset("mCal00_innerdataset", obj);
				mCal00_innerdataset._setContents("<ColumnInfo><Column id=\"backgroundcolumn\" size=\"256\"/><Column id=\"bordercolumn\" size=\"256\"/><Column id=\"datecolumn\" size=\"256\"/><Column id=\"textcolorcolumn\" size=\"256\"/></ColumnInfo><Rows><Row/></Rows>");
				obj.set_innerdataset(mCal00_innerdataset);
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("PopupDiv00","600","291","175","165",null,null,null,null,null,null,this);
				obj.set_cssclass("monthCalendar_pdiv_WF_MonthBg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("staYear","0","0",null,"25","0",null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("1");
				obj.set_text("2019");
				obj.set_cssclass("monthCalendar_sta_WF_MonthYear");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPreYear","5","0","25","25",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("1");
				obj.set_cssclass("monthCalendar_btn_WF_HeadPrev");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnNextYear",null,"0","25","25","5",null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("2");
				obj.set_cssclass("monthCalendar_btn_WF_HeadNext");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn01","5","30","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("3");
				obj.set_cssclass("monthCalendar_btn_WF_Month01");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn02","46","30","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("4");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month02");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn04","128","30","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("5");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month04");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn03","87","30","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("6");
				obj.set_visible("true");
				obj.set_cssclass("monthCalendar_btn_WF_Month03");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn05","5","73","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("7");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month05");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn06","46","73","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("8");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month06");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn07","87","73","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("9");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month07");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn08","128","73","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("10");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month08");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn09","5","116","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("11");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month09");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn10","46","116","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("12");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month10");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn11","87","116","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("13");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month11");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn12","128","116","40","42",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("14");
				obj.set_text("");
				obj.set_cssclass("monthCalendar_btn_WF_Month12");
				obj.set_visible("true");
				this.PopupDiv00.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",100,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("monthCalendar.xcdl", function() {
					
					this.Calendar00_ondropdown = function(obj,e)
					{
						
						var v = this.parent._binddataset
						if((v instanceof nexacro.Dataset || (typeof v == "object" && v._type_name == "Dataset")) && v.getRowCount() > 0){
							this.PopupDiv00.form.staYear.set_text(v.getColumn(v.rowposition,this.parent.bindcolumn).substr(0,4));
							var val = v.getColumn(v.rowposition,this.parent.bindcolumn);
							for(var i=0; i<12; i++){
								if(nexacro.toNumber(val.substr(4,2)) == (i+1)){
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+((i+1).toString().padLeft(2, "0"))+'S');
								}else{
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+((i+1).toString().padLeft(2, "0")));
								}
							}
						}else{
							var objDate = new Date();
							var year;
							var month;
							
							if(nexacro.trim(this.mCal00.value).length < 1){
								year = objDate.getFullYear();
								month = objDate.getMonth() + 1;
							}else{
								year = this.mCal00.value.substring(0,4);
								month = this.mCal00.value.substring(4,6);
							}
							this.PopupDiv00.form.staYear.set_text(year);
							
							for(var i=0; i<12; i++){
								if(nexacro.toNumber(month) == (i+1)){
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0")+'S');
								}else{
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0"));
								}
							}
							//this.mCal00.set_value(year+month.toString().padLeft(2,'0'));
							
						}
						
						this.PopupDiv00.set_visible(true);
						this.PopupDiv00.trackPopupByComponent( this.parent, obj.left, this.parent.getOffsetHeight() );
						
					};
					
					this.PopupDiv00_btnPreYear_onlbuttondown = function(obj,e)
					{
						var preYear = parseInt(this.PopupDiv00.form.staYear.text);
						preYear--;
						this.PopupDiv00.form.staYear.set_text(preYear+"");
						
						if (new String(this.mCal00.value).valueOf() == "undefined") return;
						if (this.mCal00.value == null)  return;
						
						if ((Number.isNaN(this.mCal00.value)) && (new String(this.mCal00.value.length).valueOf() == "undefined")) return;
						if (this.mCal00.value.length && this.mCal00.value.length == 0)  return;
						
						if( nexacro.trim(this.mCal00.value).length > 0){
							for(var i=0; i<12; i++){
								if(this.mCal00.value.substr(0,4) == this.PopupDiv00.form.staYear.text){
									if(nexacro.toNumber(this.mCal00.value.substr(4,2)) == (i+1)){
										eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0")+'S');
									}else{
										eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0"));
									}
								}else{
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0"));
								}
							}
						}
					};
					
					this.PopupDiv00_btnNextYear_onlbuttondown = function(obj,e)
					{
						var nxtYear = parseInt(this.PopupDiv00.form.staYear.text);
						nxtYear++;
						this.PopupDiv00.form.staYear.set_text(nxtYear+"");
						
						if (new String(this.mCal00.value).valueOf() == "undefined") return;
						if (this.mCal00.value == null)  return;
						if (("x" + this.mCal00.value == "xNaN") && (new String(this.mCal00.value.length).valueOf() == "undefined")) return;
						if (this.mCal00.value.length && this.mCal00.value.length == 0)  return;
						
						for(var i=0; i<12; i++){
							if(this.mCal00.value.substr(0,4) == this.PopupDiv00.form.staYear.text){
								if(nexacro.toNumber(this.mCal00.value.substr(4,2)) == (i+1)){
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0")+'S');
								}else{
									eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0"));
								}
							}else{
								eval('this.PopupDiv00.form.btn'+((i+1).toString().padLeft(2, "0"))).set_cssclass('monthCalendar_btn_WF_Month'+(i+1).toString().padLeft(2, "0"));
							}
						}
						
						
					};
					
					/*
					*	월 피커에서 월 선택 이벤트
					*  월 선택 시 "onchanged"이벤트 수행
					*  이벤트 오브젝트 : prevalue,pretext,postvalue,posttext
					*/
					
					this.btn_month_clicked = function(obj,e)
					{
						this.PopupDiv00.form.staYear.text.concat(this.PopupDiv00.form.btn01.id.replace('btn',''));
						
						//trace('btn_month_clicked');
						//this.form.mCal00.value||''.substr(0,6);
						
						
						var evt = new nexacro.ChangeEventInfo(this.mCal00, "onchanged");
						evt.prevalue  = (this.mCal00.value||'').substr(0,6);
						evt.pretext = this.mCal00.text;
						this.mCal00.set_value(this.PopupDiv00.form.staYear.text + obj.name.substr(3,2));
						evt.postvalue = (this.mCal00.value||'').substr(0,6);
						evt.posttext = this.mCal00.text;
						this.PopupDiv00.closePopup();
						this.mCal00_onchanged(this.mCal00,evt);
					};
					
					this._oninit = function(obj,e)
					{
						
						var v = this.parent._binddataset
						if(!(v instanceof nexacro.Dataset || (typeof v == "object" && v._type_name == "Dataset"))){
							/* 2022-03-21 초기값 삭제
							var objDate = new Date();
							var year = objDate.getFullYear();
							var month = objDate.getMonth() + 1;
							this.PopupDiv00.form.staYear.set_text(year);
							this.mCal00.set_value(year+month.toString().padLeft(2,'0'));
							*/
						}
						
					};
					
					/*
					*	월 변경시 이벤트
					*	이벤트 오브젝트 별도 세팅
					*  이벤트 오브젝트 : prevalue,pretext,postvalue,posttext
					*/
					
					this.mCal00_onchanged = function(obj,e)
					{
						//trace('mCal00_onchanged');
						var prevalue = e.prevalue||''.substr(0,6);
						var pretext = e.pretext;
						var postvalue = e.postvalue||''.substr(0,6);
						var posttext = e.posttext;
						
						var evt = new nexacro.ChangeEventInfo(this, "onchanged");
						evt.prevalue = prevalue;
						evt.pretext = pretext;
						evt.postvalue = postvalue;
						evt.posttext = posttext;
						
						this.parent.on_fire_onChanged(obj,evt);
					};
					
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("oninit",this._oninit,this);
				this.mCal00.addEventHandler("ondropdown",this.Calendar00_ondropdown,this);
				this.mCal00.addEventHandler("onchanged",this.mCal00_onchanged,this);
				this.PopupDiv00.form.btnPreYear.addEventHandler("onlbuttondown",this.PopupDiv00_btnPreYear_onlbuttondown,this);
				this.PopupDiv00.form.btnNextYear.addEventHandler("onlbuttondown",this.PopupDiv00_btnNextYear_onlbuttondown,this);
				this.PopupDiv00.form.btn01.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn02.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn04.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn03.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn05.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn06.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn07.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn08.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn09.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn10.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn11.addEventHandler("onclick",this.btn_month_clicked,this);
				this.PopupDiv00.form.btn12.addEventHandler("onclick",this.btn_month_clicked,this);
			};
			this.loadIncludeScript("monthCalendar.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};