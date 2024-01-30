//==============================================================================			
//	Define the Component.
//==============================================================================			
//==============================================================================			
// Object : nexacro.fromtoCalendar			
// Group : Component			
//==============================================================================			
if (!nexacro.fromtoCalendar)			
{			
    nexacro.fromtoCalendar = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)			
    {			
        nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);			
    };			
        			
    nexacro.fromtoCalendar.prototype = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.fromtoCalendar);			
    nexacro.fromtoCalendar.prototype._type_name = "fromtoCalendar";	
	
	nexacro.fromtoCalendar.prototype.getFromdate = function ()
	{
		// TODO : enter your code here.
		return this.form.fromDate.value;
	};	
	
	nexacro.fromtoCalendar.prototype.setFromdate = function (strFromdate)
	{
		// TODO : enter your code here.
		this.form.fromDate.set_value(strFromdate);
	};	
	
	nexacro.fromtoCalendar.prototype.getTodate = function ()
	{
		// TODO : enter your code here.
		return this.form.toDate.value;
	};	
	
	nexacro.fromtoCalendar.prototype.setTodate = function (strTodate)
	{
		// TODO : enter your code here.
		this.form.toDate.set_value(strTodate);
	};	
	
	nexacro.fromtoCalendar.prototype.getFromInnerdataset = function ()
	{
		// TODO : enter your code here.
		return this.form.fromDate.innerdataset;
	};	
	
	nexacro.fromtoCalendar.prototype.setFromInnerdataset = function (strDS)
	{
		// TODO : enter your code here.
		this.form.fromDate.set_innerdataset(strDS);
	};	
	
	nexacro.fromtoCalendar.prototype.getFromdateColumn = function ()
	{
		// TODO : enter your code here.
		return this.form.fromDate.datecolumn;
	};	
	
	nexacro.fromtoCalendar.prototype.setFromdateColumn = function (strColumn)
	{
		// TODO : enter your code here.
		this.form.fromDate.set_datecolumn(strColumn);
	};	
	
	nexacro.fromtoCalendar.prototype.getToInnerdataset = function ()
	{
		// TODO : enter your code here.
		return this.form.toDate.innerdataset;
	};	
	
	nexacro.fromtoCalendar.prototype.setToInnerdataset = function (strDS)
	{
		// TODO : enter your code here.
		this.form.toDate.set_innerdataset(strDS);
	};	
	
	nexacro.fromtoCalendar.prototype.getTodateColumn = function ()
	{
		// TODO : enter your code here.
		return this.form.toDate.datecolumn;
	};	
	nexacro.fromtoCalendar.prototype.setTodateColumn = function (strColumn)
	{
		// TODO : enter your code here.
		this.form.toDate.set_datecolumn(strColumn);
	};	
	
	nexacro.fromtoCalendar.prototype.getDateNull = function ()
	{
		// TODO : enter your code here.
		if (((new String(this.form.fromDate.value).valueOf() == "undefined") ||
			(this.form.fromDate.value == null) ||
			(("x" + this.form.fromDate.value == "xNaN") && (new String(this.form.fromDate.value.length).valueOf() == "undefined")) ||
			(this.form.fromDate.value.length && this.form.fromDate.value.length == 0) )	&&
			((new String(this.form.toDate.value).valueOf() == "undefined") ||
			(this.form.toDate.value == null) ||
			(("x" + this.form.toDate.value == "xNaN") && (new String(this.form.toDate.value.length).valueOf() == "undefined")) ||
			(this.form.toDate.value.length && this.form.toDate.value.length == 0) ) )
		{
			//둘다 null 이면 true
			return true;
		}
		return false;
	}	
	
	nexacro.fromtoCalendar.prototype.getFromdateNull = function ()
	{
		// TODO : enter your code here.
		if((new String(this.form.fromDate.value).valueOf() == "undefined") ||
			(this.form.fromDate.value == null) ||
			(("x" + this.form.fromDate.value == "xNaN") && (new String(this.form.fromDate.value.length).valueOf() == "undefined")) ||
			(this.form.fromDate.value.length && this.form.fromDate.value.length == 0) )
		{
			return true;
		}
		return false;
	};	
	
	nexacro.fromtoCalendar.prototype.getTodateNull = function ()
	{
		// TODO : enter your code here.
		if((new String(this.form.toDate.value).valueOf() == "undefined") ||
			(this.form.toDate.value == null) ||
			(("x" + this.form.toDate.value == "xNaN") && (new String(this.form.toDate.value.length).valueOf() == "undefined")) ||
			(this.form.toDate.value.length && this.form.toDate.value.length == 0) )
		{
			return true;
		}
		return false;
	};	
	
	nexacro.fromtoCalendar.prototype.getFromToValidation = function ()
	{
		// TODO : enter your code here.
		//시작일 NULL 체크
		if((new String(this.form.fromDate.value).valueOf() == "undefined") ||
			(this.form.fromDate.value == null) ||
			(("x" + this.form.fromDate.value == "xNaN") && (new String(this.form.fromDate.value.length).valueOf() == "undefined")) ||
			(this.form.fromDate.value.length && this.form.fromDate.value.length == 0) )
		{
			return true;
		}
		//종료일 NULL 체크
		if((new String(this.form.toDate.value).valueOf() == "undefined") ||
			(this.form.toDate.value == null) ||
			(("x" + this.form.toDate.value == "xNaN") && (new String(this.form.toDate.value.length).valueOf() == "undefined")) ||
			(this.form.toDate.value.length && this.form.toDate.value.length == 0) )
		{
			return true;
		}
		
		if(this.form.fromDate.value > this.form.toDate.value){
			return true;
		}
		return false;
		
	};	
}	
	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.fromtoCalendar.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("fromtoCalendar");
				this.set_titletext("fromtoCalendar");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(980,460);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Calendar("fromDate","0","0","120","22",null,null,null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_popuptype("none");
				obj.set_cssclass("fromtoCalendar_Calendar");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("Static04","126","0","20","22",null,null,null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_text("~");
				obj.set_textAlign("center");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("toDate","152","0","120","22",null,null,null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_popuptype("none");
				obj.set_cssclass("fromtoCalendar_Calendar");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("PopupDiv00","620","230","360","230",null,null,null,null,null,null,this);
				obj.set_visible("false");
				obj.set_cssclass("fromtoCalendar_pdiv_WF_MonthBg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("toDate00","183","25","170","170",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_type("monthonly");
				obj.set_cssclass("fromtoCalendar_datepicker");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("fromDate00","5","25","170","170",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("1");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_type("monthonly");
				obj.set_cssclass("fromtoCalendar_datepicker");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("Edit00","6","199","346","25",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("2");
				obj.set_readonly("true");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Static("Static00","6","-1","200","26",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("3");
				obj.set_text("Calendar");
				obj.set_font("bold 12px/normal \"Gulim\"");
				obj.set_cssclass("fromtoCalendar_sta_WF_SubTitle02");
				obj.set_color("#eb5e4b");
				this.PopupDiv00.addChild(obj.name, obj);
				
				obj = new nexacro.Button("Button00","338","6","14","13",null,null,null,null,null,null,this.PopupDiv00.form);
				obj.set_taborder("4");
				obj.set_cssclass("fromtoCalendar_btn_close_N");
				this.PopupDiv00.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",980,460,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("fromtoCalendar.xcdl", function() {
					
					this._oninit = function(obj,e)
					{
						
						var endDay = "";		//종료일
						var startDay = "";
						var objDate = new Date();
						var yyyy = objDate.getFullYear();
						var month = objDate.getMonth() + 1;
						var day = objDate.getDate();
						endDay = String(yyyy) + String(month).padLeft(2, "0")+ String(day).padLeft(2, "0");
						//종료일 셋팅
						this.toDate.set_value(endDay);
						
						this.PopupDiv00.form.Edit00.set_value('TODAY : '+String(yyyy) +'-'+ String(month).padLeft(2, "0") +'-'+ String(day).padLeft(2, "0"));
						
						objDate.addDate(-7);
						yyyy = objDate.getFullYear();
						month = objDate.getMonth() + 1;
						day = objDate.getDate();
						startDay = String(yyyy) + String(month).padLeft(2, "0")+ String(day).padLeft(2, "0");
						//시작일 셋팅
						this.fromDate.set_value(startDay);
						objDate = null;
					};
					
					this.fromDate_ondropdown = function(obj,e)
					{
						
						this.PopupDiv00.form.fromDate00.set_value(this.fromDate.value);
						this.PopupDiv00.form.toDate00.set_value(this.toDate.value);
						
						this.PopupDiv00.set_visible(true);
						this.PopupDiv00.trackPopupByComponent( obj, obj.left , obj.height );
					};
					
					this.toDate_ondropdown = function(obj,e)
					{
						this.PopupDiv00.form.fromDate00.set_value(this.fromDate.value);
						this.PopupDiv00.form.toDate00.set_value(this.toDate.value);
						
						this.PopupDiv00.set_visible(true);
						this.PopupDiv00.trackPopupByComponent( obj, obj.left , obj.height );
					};
					this.PopupDiv00_fromDate00_ondayclick = function(obj,e)
					{
						this.fromDate.set_value(e.date);
					};
					
					this.PopupDiv00_toDate00_ondayclick = function(obj,e)
					{
						this.toDate.set_value(e.date);
					};
					
					this.PopupDiv00_Button00_onclick = function(obj,e)
					{
						this.PopupDiv00.closePopup();
					};
					
					
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("oninit",this._oninit,this);
				this.fromDate.addEventHandler("ondropdown",this.fromDate_ondropdown,this);
				this.fromDate.addEventHandler("onchanged",this.fromDate_onchanged,this);
				this.toDate.addEventHandler("ondropdown",this.toDate_ondropdown,this);
				this.PopupDiv00.form.toDate00.addEventHandler("ondayclick",this.PopupDiv00_toDate00_ondayclick,this);
				this.PopupDiv00.form.fromDate00.addEventHandler("ondayclick",this.PopupDiv00_fromDate00_ondayclick,this);
				this.PopupDiv00.form.Button00.addEventHandler("onclick",this.PopupDiv00_Button00_onclick,this);
			};
			this.loadIncludeScript("fromtoCalendar.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};