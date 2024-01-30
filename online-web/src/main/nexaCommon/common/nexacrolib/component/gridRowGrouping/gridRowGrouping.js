
if ( !Eco.interceptBefore )
{
	Eco.interceptBefore = function(object, methodName, fn, scope, returnValue) {
		var method = object[methodName] || nexacro._emptyFn;

		returnValue = returnValue !== undefined ? returnValue : null;
		return (object[methodName] = function() {
			if ( fn.apply(scope || this, arguments) !== false ) 
			{
				return method.apply(this, arguments);
			}
			return returnValue;
		});
	};
}

var _pGrid = nexacro.Grid.prototype;

_pGrid.set_groupingrowstyles = function(val)
{
	if ( !this.rowGrouping ) return;

	if ( !Eco.equals(this.groupingrowstyles, val) )
	{
		this._apply_groupingrowstyles(val);
		if ( val )
		{
			this.groupingrowstyles = Eco.clone(val, true);
		}
		else
		{
			this.groupingrowstyles = val;
		}
		var groupingcells = this._groupingcells;
		if ( groupingcells && groupingcells.length )
		{
			//this._refreshBody();
			this._bodyBand._rowGroupingDraw(this);
		}
	}
};

_pGrid._getGroupingrowstyles = function (propnm)
{
	if ( !propnm || !propnm.length ) return;
	if ( propnm == "cellline" )
	{
		var cache = this._bodybandborder;
		if ( cache === undefined )
		{
			cache = this._curFormat._bodyband._find_gridpseudo_obj("cellline", "normal", "body", "line", false, "border");
			if ( cache )
			{
				cache = nexacro._getCachedStrokepenObj(cache._top_width + " " + (cache.top_style ? cache.top_style : "none") + " " + cache.top_color);
			}
			this._bodybandborder = cache;
		}
		return [cache, (cache ? cache.width : 0)];
	}
	if ( propnm == "selectbackground" )
	{
		var cache = this._bodybandselectbk;
		if ( cache === undefined )
		{
			var bk = this._curFormat._bodyband._find_gridpseudo_obj("selectbackground", "normal", "body", null, true, "background");
			if ( bk )
			{
				if ( bk.color == "@gradation" )
				{
					cache = nexacro._getCachedFillbrushObj("gradation");
				}
				else
				{
					cache = nexacro._getCachedFillbrushObj("solid " + bk.color);
				}
			}
			this._bodybandselectbk = cache;
		}
		return cache;
	} 

	if ( propnm == "selectgradation" )
	{
		var cache = this._bodybandselectgrad;
		if ( cache === undefined )
		{
			cache = this._curFormat._bodyband._find_gridpseudo_obj("selectgradation", "normal", "body", null, true, "gradation");
			this._bodybandselectgrad = cache;
		}
		return cache;
	} 

	if ( propnm == "selectfont" )
	{
		var cache = this._bodybandselectfont;
		if ( cache === undefined )
		{
			cache = this._curFormat._bodyband._find_gridpseudo_obj("selectfont", "normal", "body", null, true, "font");
			this._bodybandselectfont = cache;
		}
		return cache;
	} 

	if ( propnm == "selectcolor" )
	{
		var cache = this._bodybandselectcolor;
		if ( cache === undefined )
		{
			cache = this._curFormat._bodyband._find_gridpseudo_obj("selectcolor", "normal", "body", null, true, "color");
			if ( cache )
			{
				cache =  nexacro._getCachedFillbrushObj("solid " + cache.value);
			}
			this._bodybandselectcolor = cache;
		}
		return cache;
	} 

	var groupingrowstyles = this._grouprowstyles;
	if ( groupingrowstyles )
	{
		var cache = groupingrowstyles._cache,
			retval = cache[propnm];
		if ( retval === undefined )
		{
			var arrprop = propnm.split(".");
			retval = groupingrowstyles;
			for ( var i = 0, len = arrprop.length ; i < len ; i++ )
			{
				if ( !retval ) break;
				retval = retval[arrprop[i]];
			}
			if ( !retval )
			{
				if ( propnm == "grouplevelbackground._footervalue" ||
					  propnm == "grouplevelbackground._headervalue"  )
				{
					retval = this._curFormat._bodyband._find_gridpseudo_obj("cellbackground", "normal", "body", "background", false, "background");
					if ( retval.color == "@gradation" )
					{
						retval = nexacro._getCachedFillbrushObj("gradation");
					}
					else
					{
						retval = nexacro._getCachedFillbrushObj("solid " + retval.color);
					}
				}
				else if ( propnm == "grouplevelfont._footervalue" ||
					  propnm == "grouplevelfont._headervalue"  )
				{
					retval = this._curFormat._bodyband._find_gridpseudo_obj("cellfont", "normal", "body", "font", false, "font");
				}
				else if ( propnm == "grouplevelgradation._footervalue" ||
					  propnm == "grouplevelgradation._headervalue"  )
				{
					retval = this._curFormat._bodyband._find_gridpseudo_obj("cellgradation", "normal", "body", "gradation", false, "gradation");
				}
				else if ( propnm == "grouplevelcolor._footervalue" ||
					  propnm == "grouplevelcolor._headervalue"  )
				{
					retval = this._curFormat._bodyband._find_gridpseudo_obj("cellcolor", "normal", "body", "color", false, "color");
					if ( retval )
					{
						retval =  nexacro._getCachedFillbrushObj("solid " + retval.value);
					}
				}
				else if ( propnm == "levelcolumnWidth" )
				{
					retval = this.getRealRowSize(-1, 0);
				}
			}
			if ( retval )
			{
				cache[propnm] = retval;
			}
			else
			{
				cache[propnm] = null;
			}
		}
		return retval;
	}
	return null;
};

_pGrid._apply_groupingrowstyles = function (val)
{
	var groupingrowstyles = this._grouprowstyles,
		cache;
	if ( groupingrowstyles != val )
	{
		if ( !groupingrowstyles )
		{
			groupingrowstyles = {};
			this._grouprowstyles = groupingrowstyles;
			cache = {};
			groupingrowstyles._cache = cache;
		}
		else
		{
			cache = groupingrowstyles._cache;
		}
		if ( !val )
		{
			Eco.object.Each(groupingrowstyles, function(nm, value, selfobj) {
				selfobj[nm] = null;
				delete cache[nm];
			});
			delete cache["grouplevelbackground.headersummaryrow"];
			delete cache["grouplevelbackground._headervalue"];
			delete cache["grouplevelbackground.footersummaryrow"];
			delete cache["grouplevelbackground._footervalue"];
			delete cache["grouplevelbackground._footercompvalue"];
			delete cache["grouplevelfont.headersummaryrow"];
			delete cache["grouplevelfont._headervalue"];
			delete cache["grouplevelfont.footersummaryrow"];
			delete cache["grouplevelfont._footervalue"];
			delete cache["grouplevelgradation.headersummaryrow"];
			delete cache["grouplevelgradation._headervalue"];
			delete cache["grouplevelgradation.footersummaryrow"];
			delete cache["grouplevelgradation._footervalue"];
			delete cache["grouplevelcolor.headersummaryrow"];
			delete cache["grouplevelcolor._headervalue"];
			delete cache["grouplevelcolor.footersummaryrow"];
			delete cache["grouplevelcolor._footervalue"];
			delete cache["grouplevelcolor._footercompvalue"];
		}
		else
		{
			Eco.object.Each(val, function(nm, value, selfobj) {
				if ( value )
				{
					// array 처리 필요
					if ( nm == "grouplevelbackground" )
					{
						var tmpsimpleobj = groupingrowstyles[nm];
						if ( !tmpsimpleobj )
						{
							tmpsimpleobj = {};
							groupingrowstyles[nm] = tmpsimpleobj;
						}
						if ( value.headersummaryrow != tmpsimpleobj.headersummaryrow )
						{
							tmpsimpleobj.headersummaryrow = value.headersummaryrow;
							if ( value.headersummaryrow && value.headersummaryrow.length )
							{
								tmpsimpleobj._headervalue = nexacro._getCachedFillbrushObj(value.headersummaryrow);
							}
							else
							{
								tmpsimpleobj._headervalue = null;
							}
							delete cache["grouplevelbackground.headersummaryrow"];
							delete cache["grouplevelbackground._headervalue"];
						}
						if ( value.footersummaryrow != tmpsimpleobj.footersummaryrow )
						{
							tmpsimpleobj.footersummaryrow = value.footersummaryrow;
							if ( value.footersummaryrow && value.footersummaryrow.length )
							{
								tmpsimpleobj._footervalue = nexacro._getCachedFillbrushObj(value.footersummaryrow);
								if ( tmpsimpleobj._footervalue.style == "gradation" )
								{
									tmpsimpleobj._footercompvalue  = nexacro._getCachedBackgroundObj("@gradation");
								}
								else
								{
									tmpsimpleobj._footercompvalue = nexacro._getCachedBackgroundObj(tmpsimpleobj._footervalue.color);
								}
							}
							else
							{
								tmpsimpleobj._footervalue = null;
								tmpsimpleobj._footercompvalue = null;
							}
							delete cache["grouplevelbackground.footersummaryrow"];
							delete cache["grouplevelbackground._footervalue"];
							delete cache["grouplevelbackground._footercompvalue"];
						}
						return;
					}
					else if ( nm == "grouplevelfont" )
					{
						var tmpsimpleobj = groupingrowstyles[nm];
						if ( !tmpsimpleobj )
						{
							tmpsimpleobj = {};
							groupingrowstyles[nm] = tmpsimpleobj;
						}
						if ( value.headersummaryrow != tmpsimpleobj.headersummaryrow )
						{
							tmpsimpleobj.headersummaryrow = value.headersummaryrow;
							if ( value.headersummaryrow && value.headersummaryrow.length )
							{
								tmpsimpleobj._headervalue = nexacro._getCachedFontObj(value.headersummaryrow);
							}
							else
							{
								tmpsimpleobj._headervalue = null;
							}
							delete cache["grouplevelfont.headersummaryrow"];
							delete cache["grouplevelfont._headervalue"];
						}
						if ( value.footersummaryrow != tmpsimpleobj.footersummaryrow )
						{
							tmpsimpleobj.footersummaryrow = value.footersummaryrow;
							if ( value.footersummaryrow && value.footersummaryrow.length )
							{
								tmpsimpleobj._footervalue = nexacro._getCachedFontObj(value.footersummaryrow);
							}
							else
							{
								tmpsimpleobj._footervalue = null;
							}
							delete cache["grouplevelfont.footersummaryrow"];
							delete cache["grouplevelfont._footervalue"];
						}
						return;
					}
					else if ( nm == "grouplevelgradation" )
					{
						var tmpsimpleobj = groupingrowstyles[nm];
						if ( !tmpsimpleobj )
						{
							tmpsimpleobj = {};
							groupingrowstyles[nm] = tmpsimpleobj;
						}
						if ( value.headersummaryrow != tmpsimpleobj.headersummaryrow )
						{
							tmpsimpleobj.headersummaryrow = value.headersummaryrow;
							if ( value.headersummaryrow && value.headersummaryrow.length )
							{
								tmpsimpleobj._headervalue = nexacro._getCachedGradationObj(value.headersummaryrow);
							}
							else
							{
								tmpsimpleobj._headervalue = null;
							}
							delete cache["grouplevelgradation.headersummaryrow"];
							delete cache["grouplevelgradation._headervalue"];
						}
						if ( value.footersummaryrow != tmpsimpleobj.footersummaryrow )
						{
							tmpsimpleobj.footersummaryrow = value.footersummaryrow;
							if ( value.footersummaryrow && value.footersummaryrow.length )
							{
								tmpsimpleobj._footervalue = nexacro._getCachedGradationObj(value.footersummaryrow);
							}
							else
							{
								tmpsimpleobj._footervalue = null;
							}
							delete cache["grouplevelgradation.footersummaryrow"];
							delete cache["grouplevelgradation._footervalue"];
						}
						return;
					}
					else if ( nm == "grouplevelcolor" )
					{
						var tmpsimpleobj = groupingrowstyles[nm];
						if ( !tmpsimpleobj )
						{
							tmpsimpleobj = {};
							groupingrowstyles[nm] = tmpsimpleobj;
						}
						if ( value.headersummaryrow != tmpsimpleobj.headersummaryrow )
						{
							tmpsimpleobj.headersummaryrow = value.headersummaryrow;
							if ( value.headersummaryrow && value.headersummaryrow.length )
							{
								tmpsimpleobj._headervalue = nexacro._getCachedColorObj(value.headersummaryrow);
							}
							else
							{
								tmpsimpleobj._headervalue = null;
							}
							delete cache["grouplevelcolor.headersummaryrow"];
							delete cache["grouplevelcolor._headervalue"];
						}
						if ( value.footersummaryrow != tmpsimpleobj.footersummaryrow )
						{
							tmpsimpleobj.footersummaryrow = value.footersummaryrow;
							if ( value.footersummaryrow && value.footersummaryrow.length )
							{
								tmpsimpleobj._footervalue = nexacro._getCachedFillbrushObj("solid " + value.footersummaryrow);
								tmpsimpleobj._footercompvalue = nexacro._getCachedColorObj(value.footersummaryrow);
							}
							else
							{
								tmpsimpleobj._footervalue = null;
								tmpsimpleobj._footercompvalue = null;
							}
							delete cache["grouplevelcolor.footersummaryrow"];
							delete cache["grouplevelcolor._footervalue"];
							delete cache["grouplevelcolor._footercompvalue"];
						}
						return;
					}
				}
				if ( value != groupingrowstyles[nm] )
				{
					groupingrowstyles[nm] = value;
					delete cache[nm];
				}
			});
		}
	}
};

_pGrid.set_groupkeycells = function (arr)
{
	if ( !this.rowGrouping ) return;

	var oldarr = this.groupkeycells;
	if ( !Eco.equals(oldarr, arr) )
	{
		var oldval = this.enableredraw;
		this.set_enableredraw(false);
		if ( arr == null )
		{
			this._trickdssetting = true;
			if ( this._bodyBand )
			{
				this._bodyBand._clearDrawedRowGrouping();
			}

			this.set_binddataset("");
			this._apply_groupkeyinfo(arr);
			this._apply_groupingformat();
			//var ds = this._localbinddataset;
			//if ( ds )
			//{
				//ds.clearData();
			//}
			if ( this._originalbinddataset )
			{
				this._orgrowcount = 0;
				this._removeOrginialDSEventHandlers(this._originalbinddataset);
				//this._binddataset = this._originalbinddataset;
			}
			this.groupkeycells = null;
			if ( this._treeCellinfo )
			{
				this._removeTreeCellinfo(this._treeCellinfo);
			}
			this.set_enableredraw(oldval);
			this.set_binddataset((this._originalbinddataset ? this._originalbinddataset.name : ""));
			this._trickdssetting = false;
			return;
		}
		this._onlydatachanged = true;

		//Eco.Logger.startElapsed();

		this._trickdssetting = true;
		this.set_binddataset("");
		var ds = this._getDummyDs();
		this._apply_groupkeyinfo(arr);
		this._apply_groupingrow();
		this._apply_groupingformat();
		this.groupkeycells = Eco.clone(arr, true);
		this.set_enableredraw(oldval);
		this.set_binddataset(ds.name);
		this._trickdssetting = false;
		if ( this._originalbinddataset )
		{
			this._orgrowcount = this._originalbinddataset.rowcount;
			this._setOrginialDSEventHandlers(this._originalbinddataset);
		}
		if ( this._bodyBand )
		{
			this._bodyBand._clearDrawedRowGrouping(true);
			this._bodyBand._rowGroupingDraw(this);
		}
		//Eco.Logger.info({message: "local dataset 처리 => ", elapsed: true});
	}
};

    _pGrid._original_dsnotify_onload = function (obj, e)
    {
		if ( this.rowGrouping && this._graph && this._groupingcells && this._groupingcells.length )
		{
				this._orgrowcount = obj.rowcount;
	    		this._changedsrcschema = true;
				var ds = this._getDummyDs();
				this._apply_groupingrow();
	
	        this.rowcount = this._rowcount = ds.rowcount;
	        this._rowposition = ds.rowposition;
	
	        // clear exprcache
	        this._exprcache = {};
	        this._clearAllStyleCache();
	        this._initTreeStates();
	
	        if (!this._is_created)
	            return;
	
	        var _reason = e.reason;
	        if (_reason == 0 || _reason == 1 || _reason == 3 || _reason == 2)
	        {
	            if (this._async_create == true)
	                this._recreate_contents_all_async(true, true, true);
	            else
	                this._recreate_contents_all(true, true, true);
	        }
			if ( this._bodyBand )
			{
				this._bodyBand._clearDrawedRowGrouping(true);
				this._bodyBand._rowGroupingDraw(this);
			}
	    }
    };

    _pGrid._original_dsnotify_onrowsetchanged = function (obj, e)
    {
		if ( this.rowGrouping && this._graph && this._groupingcells && this._groupingcells.length )
		{
        if (this._curFormat)
        {
            var cells = this._curFormat._bodycells;
            var lastrow = this._orgrowcount - 1;
            var kind;

            switch (e.reason)
            {
                case 10:
                    kind = "assign";
                    break;
                case 11:
                    kind = "copydata";
                    break;
                case 12:
                    if (e.row == -1) kind = "appenddata";
                    else if (e.row == lastrow) kind = "addrow";
                    else if (e.row < lastrow) kind = "insertrow";
                    break;
                case 20:
                    if (e.row == -1) kind = "deletemultirows";
                    else kind = "deleterow";
                    break;
                case 22:
                    kind = "deleteall";
                    break;
                case 23:
                    kind = "cleardata";
                    break;
                case 30:
                    kind = "keystring";
                    break;
                case 31:
                    if (e.row == -1) kind = "filter";
                    else kind = "filterrow";
                    break;
                case 32:
                    kind = "moverow";
                    break;
                case 33:
                    kind = "exchangerow";
                    break;
                case 34:
                    kind = "addcolumn";
                    break;
                case 41:
                    kind = "enableevent";
                    break;
                case 40:
                    kind = "rowtype";
                    break;
                default:
                    break;
            }

            if ( !(kind == "addcolumn" || kind == "enableevent" || kind == "rowtype") )
            {
            	this._orgrowcount = obj.rowcount;
		    		this._changedsrcschema = true;
					var ds = this._getDummyDs();
					this._apply_groupingrow();

				   kind = "copydata";
		        var bchange_rowcnt = (this._rowcount != ds.rowcount);
		        this.rowcount = this._rowcount = ds.rowcount;
		
		        var updaterow_pos = false;
		        if (this._rowposition != ds.rowposition)
		            updaterow_pos = true;
		
		        this._rowposition = ds.rowposition;

		        // clear exprcache
		      //  this._exprcache = {};
		    //    this._clearAllStyleCache();
		      //  this._initTreeStates();

	            if (kind == "copydata")
	            {
	                this._setSelectedInfo(null, null, this._rowposition, 0, null);
	            }
	            if (this._is_async_recreate)
	            {
	                nexacro.OnceCallbackTimer.callonce(this, function ()
	                {
	                    this._afterRowsetChanged(kind, updaterow_pos, e.row, bchange_rowcnt);
	                    this._is_async_recreate = false;
								if ( this._bodyBand )
								{
									this._bodyBand._clearDrawedRowGrouping(true);
									this._bodyBand._rowGroupingDraw(this);
								}
	                }, 10);
	            }
	            else
	            {
	                this._afterRowsetChanged(kind, updaterow_pos, e.row, bchange_rowcnt);
							if ( this._bodyBand )
							{
								this._bodyBand._clearDrawedRowGrouping(true);
								this._bodyBand._rowGroupingDraw(this);
							}
					}
	         }
        }
      }
    };

    _pGrid._setOrginialDSEventHandlers = function (ds)
    {
        ds._setEventHandler("onload", this._original_dsnotify_onload, this);
        //ds._setEventHandler("onrowposchanged", this.on_dsnotify_onrowposchanged, this);
        //ds._setEventHandler("oncolumnchanged", this.on_dsnotify_oncolumnchanged, this);
        ds._setEventHandler("onrowsetchanged", this._original_dsnotify_onrowsetchanged, this);
    };

    _pGrid._removeOrginialDSEventHandlers = function (ds)
    {
        ds._removeEventHandler("onload", this._original_dsnotify_onload, this);
        //ds._removeEventHandler("onrowposchanged", this.on_dsnotify_onrowposchanged, this);
        //ds._removeEventHandler("oncolumnchanged", this.on_dsnotify_oncolumnchanged, this);
        ds._removeEventHandler("onrowsetchanged", this._original_dsnotify_onrowsetchanged, this);
    };

_pGrid._original_on_apply_prop_binddataset = _pGrid.on_apply_prop_binddataset;

_pGrid.on_apply_prop_binddataset = function ()
{
	this._original_on_apply_prop_binddataset();
	if ( !this._trickdssetting )
	{
		this._originalbinddataset = this._binddataset;
		this._changedsrcschema = true;
	}
};

_pGrid._apply_groupkeyinfo = function (arr)
{
	if ( arr && arr.length )
	{
		var cnt = arr.length,
			groupcells = [],
			groupcell,
			level = 1,
			colinfos = this._originalbinddataset.colinfos;

		for ( var i = cnt - 1 ; i >= 0 ; i-- )
		{
			groupcell = arr[i];
			var colinfo = colinfos[groupcell.bodybindcolumn];
			if ( colinfo )
			{
				groupcells.push({
					level: level,
					colid: colinfo.name,
					colidx: colinfo._index,
					titlename: groupcell.headcelltext
				});
				level++;
			}
		}
		this._groupingcells = groupcells;
	}
	else
	{
		this._groupingcells = null;
	}
};

_pGrid._apply_groupingrow = function ()
{
	var srcDs = this._originalbinddataset,
		tarDs = this._localbinddataset,
		groupcols = this._groupingcells;

	var groupcolidxs = {}, gcolcnt = groupcols.length;
	for ( var i = 0 ; i < gcolcnt ; i++ )
	{
		var gcol = groupcols[i];
		groupcolidxs[gcol.colidx] = gcol.level;
	}

	var colinfos = srcDs.colinfos,
		maxlevel = gcolcnt + 1,
		insRow = 1,
		curRowPerLevel = [],
		curRowPerLevelForTarget = [],
		groupDataPerLevel = [],
		groupOperationPerCols = [],
		rowcnt = srcDs.rowcount,
		preRow, curRow, prevLvl = 1, curLvl;

	if ( rowcnt > 0 )
	{
		tarDs.setColumn(0, "__level", maxlevel);
	}

	for ( var row = 1 ; row < rowcnt ; row++ )
	{
		tarDs.setColumn(insRow, "__level", maxlevel);
		curRow = row;
		preRow = row - 1;
		curLvl = comparePerLevel(preRow, curRow, srcDs, groupcols);

		if ( curLvl != 0 )
		{
			makeGroupDataInfo(curLvl, preRow, srcDs, tarDs, colinfos);
			setCurInfoPerLevel(curLvl, curRow, insRow);
		}
		insRow++;
	}

	if ( rowcnt > 0 )
	{
		makeGroupDataInfo(maxlevel - 1, rowcnt - 1, srcDs, tarDs, colinfos);
	}
	tarDs.applyChange();

	function comparePerLevel(pRow, cRow, ds, gcols)
	{
		var colidx, difflvl = 0, prev, cur;
		for ( var gcol = gcols.length - 1 ; gcol >= 0 ; gcol-- )
		{
			colidx = gcols[gcol].colidx;
			cur = ds.getColumn(cRow, colidx);
			prev = ds.getColumn(pRow, colidx);
			if ( cur != prev )
			{
				difflvl = gcols[gcol].level;
				break;
			}
		}
		return difflvl;
	};

	function setCurInfoPerLevel(difflvl, cRow, tcRow)
	{
		for ( var lvl = 1 ; lvl <= difflvl ; lvl++ )
		{
			curRowPerLevel[lvl] = cRow;
			curRowPerLevelForTarget[lvl] = tcRow;
		}
	};

	function makeGroupDataInfo(difflvl, pRow, sds, tds, cols)
	{
		var grpData;
		for ( var lvl = 1 ; lvl <= difflvl ; lvl++ )
		{
			grpData = {
				level: maxlevel - lvl,
				srcStart: (curRowPerLevel[lvl]||0),
				srcEnd: pRow,
				topRow: (curRowPerLevelForTarget[lvl]||0),
				bottomRow: insRow + 1,
				vr: 1
			};
			var topRow = grpData.topRow;
			tds.insertRow(topRow);
			tds.setColumn(topRow, "__level", grpData.level);
			tds.setColumn(topRow, "__isVirtual", 1);
			calcGroupDataInfo(grpData, sds, tds, cols);
			insRow += 2;
		}
	};

	function calcGroupDataInfo(grpdata, sds, tds, cols)
	{
		var colcnt = cols.length;
		if ( !groupOperationPerCols.length )
		{
			var columninfo, prop;
			for ( var c = 0 ; c < colcnt ; c++ )
			{
				columninfo = cols[c];
				prop = columninfo.prop;
				if ( prop && prop.length )
				{
					prop = prop.toLowerCase();
				}
				switch ( prop )
				{
					case "count":
						groupOperationPerCols[c] = {fn: sds._getCount, scope: sds};
						break;
					case "sum":
						groupOperationPerCols[c] = {fn: sds._getSum, scope: sds};
						break;
					case "max":
						groupOperationPerCols[c] = {fn: sds._getMax, scope: sds};
						break;
					case "min":
						groupOperationPerCols[c] = {fn: sds._getMin, scope: sds};
						break;
					case "avg":
						groupOperationPerCols[c] = {fn: sds._getAvg, scope: sds};
						break;
					case "text":
						groupOperationPerCols[c] = {text: columninfo.sumtext};
						break;
					case "key":
						groupOperationPerCols[c] = {key: true};
						break;
					default:
						if ( groupcolidxs[c] )
						{
							groupOperationPerCols[c] = {key: true, level: groupcolidxs[c]};
						}
						else
						{
							switch (columninfo.ntype) 
							{
								case 2 :
								case 3 :
								case 4 :
									groupOperationPerCols[c] = {fn: sds._getSum, scope: sds, ntype: columninfo.ntype};
									break;
								default :
									groupOperationPerCols[c] = {text: columninfo.sumtext};
									break;
							}
						}
						break;
				}
			}
		}

		var start = grpdata.srcStart,
			end = grpdata.srcEnd,
			rcnt = end - start + 1,
			colOperation, val,
			topRow = grpdata.topRow,
			bottomRow = grpdata.bottomRow;

		var lvl = maxlevel - grpdata.level;
		//tds.insertRow(topRow);
		tds.setColumn(topRow, "__rowCntPerGroup", rcnt);
		//tds.setColumn(topRow, "level", grpdata.level);
		//tds.setColumn(topRow, "isVirtual", 1);
		tds.insertRow(bottomRow);
		tds.setColumn(bottomRow, "__level", grpdata.level + 1);
		tds.setColumn(bottomRow, "__isVirtual", 11);

		for ( var c = 0 ; c < colcnt ; c++ )
		{
			colOperation = groupOperationPerCols[c];
			if ( colOperation.fn )
			{
				if ( colOperation.ntype != null )
				{
					val = colOperation.fn.call(colOperation.scope, c, start, end + 1, -1, colOperation.ntype);
				}
				else
				{
					val = colOperation.fn.call(colOperation.scope, c, start, end + 1, -1);
				}
			}
			else if ( colOperation.key )
			{
				if ( colOperation.level != null )
				{
					if ( colOperation.level >= lvl )
					{
						val = sds.getColumn(start, c);
					}
					else
					{
						val = null;
					}
				}
				else
				{
					val = sds.getColumn(start, c);
				}
			}
			else
			{
				val = colOperation.text;
			}
			tds.setColumn(topRow, c, val);
			tds.setColumn(bottomRow, c, val);
		}
	}
};

_pGrid._getDummyDs = function ()
{
	var ds = this._localbinddataset;
	if ( !ds )
	{
		var form = this._getForm();
		ds = new Dataset(Eco.getUniqueId("ds_"), form);
		form.addChild(ds.name, ds);
		this._localbinddataset = ds;
	}

	if ( this._changedsrcschema )
	{
		ds.set_enableevent(false);
		//ds.clearData();
		ds.copyData(this._originalbinddataset, true);
		ds.addColumn("__rowCntPerGroup","INT");
		ds.addColumn("__level","INT");
		ds.addColumn("__isVirtual","INT");
		this._changedsrcschema = false;
		this._onlydatachanged = false;
	}
	else if ( this._onlydatachanged )
	{
		ds.set_enableevent(false);
		for ( var i = ds.rowcount - 1; i >= 0 ; i-- )
		{
			var check = ds.getColumn(i, "__isVirtual");
			if ( check == 1 || check == 11 )
			{
				ds.deleteRow(i);
			}
		}
		ds.applyChange();
		this._onlydatachanged = false;
	}
	return ds;
};

_pGrid._apply_groupingformat = function ()
{
	if ( !this._applytreeproperty )
	{
		this.set_treeinitstatus("expand,null");
		this.set_treeusebutton("no");
		this.set_treeusecheckbox("false");
		this.set_treeuseexpandkey("false");
		this.set_treeuseimage("false");
		this.set_treeuseline("false");
		this._applytreeproperty = true;
	}
	//currentformat
	var cntofgroupcells = this._cntofgroupcells,
		curFormat = this._curFormat;

	if ( cntofgroupcells )
	{
		var colcnt = curFormat._getColFixCnt("left") - 1;
		for ( var i = 0 ; i < cntofgroupcells ; i++ )
		{
			curFormat._deleteColumn("left", colcnt);
			colcnt--;
		}
	}
	var colcnt = curFormat._getColFixCnt("left");
	var groupingcells = this._groupingcells,
		addcnt = (groupingcells ? groupingcells.length : 0);

	var colsize = this._getGroupingrowstyles("levelcolumnWidth");

	var headcellobj, bodycellobj, treecellobj,
		startgroupcellidx;

	for ( var i = 0 ; i < addcnt ; i++ )
	{
		curFormat.insertContentsCol("left", colcnt);
		curFormat.setFormatColProperty(colcnt, "size", colsize);

		if ( i == (addcnt - 1) )
		{
			var bodycells = curFormat._bodycells;
			for ( var j = 0, jlen = bodycells.length ; j  < jlen ; j++ )
			{
				if ( bodycells[j]._col == colcnt )
				{
					startgroupcellidx = j;
					bodycellobj = bodycells[j];
					break;
				}
			}
			bodycellobj.displaytype._set("tree");
			bodycellobj.treestartlevel._set_intval("1");
			bodycellobj.treelevel._set("expr:__level");
			treecellobj = bodycellobj;
			//bodycellobj.set_treelevel("expr:__level");
		}
		//colcnt++;
	}

	//curFormat._bodycells = curFormat._sortCellIdx(curFormat._bodycells, curFormat._bodyrows);
	//curFormat._headcells = curFormat._sortCellIdx(curFormat._headcells, curFormat._headrows);
    //curFormat._summcells = curFormat._sortCellIdx(curFormat._summcells, curFormat._summrows);
	this._clearBindTypeFlag();
	if ( this._treeCellinfo )
	{
		this._removeTreeCellinfo(this._treeCellinfo);
	}
	this._setTreeCellinfo(treecellobj);
	this._initTreeStates();

	if ( groupingcells )
	{
		groupingcells._startgroupcellidx = startgroupcellidx;
		//console.log(startgroupcellidx, treecellobj, curFormat._bodycells);
	}
	this._cntofgroupcells = addcnt;
};

    _pGrid._adjustGridScrollRows_callback = function (no_ani)
    {
        var control_elem = this._control_element;
        var vscroll_limit = control_elem.vscroll_limit;
        var pos = this.vscrollbar._pos;
        var body = this._bodyBand;

        if (pos > vscroll_limit)
            pos = vscroll_limit;

        if (no_ani)
        {
            this._scroll_vpos_queue = [];
        }
        else
        {
            this._scroll_vpos_queue.pop();

            if (this._scroll_vpos_queue.length > 0)
            {
                this._aniframe_rowscroll.start();
            }
        }

        this._last_scroll_top = control_elem.scroll_top;
        this._toprowpos = this._getScreenTopRowPos(pos);
        body._update_rows = body._matrix._adjustScrollRows(pos);
        body._on_refresh_rows();
        this._no_use_onscroll_callback_after = true;
        control_elem.setElementVScrollPos(pos);
        body._rowGroupingDraw(this);
        this._MoveEditComp();
        this._updateSelector("vscroll", pos - this._last_scroll_top);
    };

    _pGrid._adjustGridScrollRows_callback_onscroll_after = function (pos) // mobile onscroll callback
    {
        if (this._no_use_onscroll_callback_after == true)
        {
            this._no_use_onscroll_callback_after = false;
            return;
        }

        var body = this._bodyBand;

        this._toprowpos = this._getScreenTopRowPos(pos);
        body._update_rows = body._matrix._adjustScrollRows(pos);
        body._on_refresh_rows();
        body._rowGroupingDraw(this);
        this._MoveEditComp();
        //      this._updateSelector("vscroll", pos - this._last_scroll_top); 안드로이드 사파리에서 업데이트 안되는 문제 ->  아래로 옮김. 14/7/25 cmc 
    };

    _pGrid._execRefreshContents = function (workname, bclearcache)
    {
        var arr = this._recreate_contents_proc;

        if (bclearcache && arr.length > 0)
            this._clearAllStyleCache();

        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i].workname == workname)
            {
                arr[i].band._recreate_contents(true);
                this._recreate_contents_proc.splice(0, 1);
                i--;
            }
        }
			if ( workname == "colsizing" )
			{
				 if ( this._bodyBand )  this._bodyBand._rowGroupingDraw(this);
			}
    };

_pGrid.on_created_contents = function ()
{
	var text_elem = this._text_elem;
	if (text_elem)
	{
		text_elem.create();
	}

	if ( this._graph ) //added code by row grouping functionality
	{
		this._graph.on_created();
	}

	var body_band = this._bodyBand;
	if (body_band)
	{
		body_band.on_created();
	}

	var head_band = this._headBand;
	if (head_band)
	{
		head_band.on_created();
	}

	var summ_band = this._summBand;
	if (summ_band)
	{
		summ_band.on_created();
	}

	var select_ctrl = this._select_ctrl;
	if (select_ctrl)
	{
		select_ctrl.on_created();
	}

	//this.resetScroll();
	if (body_band || head_band || summ_band)
	{
		this._onResetScrollBar();
		this._applyAutofittype(true);
	}
	
	if (this._create_selection != null)
	{
		var sel = this._create_selection;
		this._resetSelect(sel.row, sel.cell, sel.col, sel.subrow, sel.pivot);
	}
	
	this._create_selection = null;
	this._is_created = true;    // nodataimage 때문에 여기서 완료 처리
	
	if (this._tree_recreate == true)
	{
		this._recreate_contents_all(true, true, true);
		this._tree_recreate = false;
	}
	else if (this._image_recreate == true)
	{
		this._recreate_contents_all(true, true, true);
		this._image_recreate = false;
	}
	else if (this.autosizingtype != "none")
	{
		// autosizingtype때도 recreate되야 한다.
		this._recreate_contents_all(true, true, true);
	}
	else
	{
		this._refreshBody();
	}

	if (nexacro._enableaccessibility && !this._accept_focus)
	{
		var accessibility = this.on_find_CurrentStyle_accessibility(this._pseudo);
		if (accessibility && accessibility.enable)
		{
			this._accept_focus = true;
		}
	}
	this.on_apply_nodatatext();
	this.on_apply_nodataimage();
};

//added code by row grouping functionality
_pGrid._createGraph = function(x, y, w, h)
{
	var graph = new nexacro.GraphicCtrl("subrowgraph", "absolute", x, y, w, h, null, null, this);
	//graph._is_nc_control = true;
	graph.createComponent();
	this._graph = graph;
	return graph;
};

_pGrid._createBandsAndAreas = function ()
{
	if (this.enableredraw == false)
		return;

	var format = this._curFormat;

	if (format == null)
		return;

	this._clearAllStyleCache();
	this._applyAutofittype(false);

	var cells = this._curFormat._bodycells;
	var cellcnt = cells ? cells.length : 0;
	var cellinfo;

	for (var j = 0; j < cellcnt; j++)
	{
		cellinfo = cells[j];
		if (cellinfo.suppress != 0)
		{
			this._is_use_suppress = true;
			break;
		}
	}

	var rect = this._getAvailableRect(this);
	var clientwidth = rect.width;
	var clientheight = rect.height;
	var control_elem = this.getElement();
	var top, bottom;
	var headHeight = this._getHeadHeight();
	var summHeight = this._getSummHeight();

	if (this.summarytype == "top" || this.summarytype == "lefttop")
	{
		top = headHeight + summHeight;
		bottom = clientheight;
	}
	else
	{
		top = headHeight;
		bottom = clientheight - summHeight;
	}

	if (bottom < top)
		bottom = top;

	this._bodyBand = new nexacro.GridBand("body", 0, top, clientwidth, bottom - top, this, format._bodyband);
	this.body = format._bodyband;

	if ( this.rowGrouping ) //added code by row grouping functionality
	{
		this._createGraph(0, top, clientwidth, bottom - top);
	}

	var summband, headband;

	if (summHeight > 0)
	{
		rect = this._getAvailableRect(this);
		clientwidth = rect.width;
		clientheight = rect.height;
	
		if (this.summarytype == "top" || this.summarytype == "lefttop")
		{
			top = headHeight;
			bottom = headHeight + summHeight;
		}
		else
		{
			bottom = clientheight;
			top = bottom - summHeight;
		}
		this._summBand = summband = new nexacro.GridBand("summ", 0, top, clientwidth, bottom - top, this, format._summband);
		this.summ = this.summary = format._summband;
	}
	else
	{
		this._summBand = null;
	}

	if (headHeight > 0)
	{
		rect = this._getAvailableRect(this);
		clientwidth = rect.width;
		clientheight = rect.height;
		top = 0;
		bottom = headHeight;
		this._headBand = headband = new nexacro.GridBand("head", 0, top, clientwidth, bottom - top, this, format._headband);
		this.head = format._headband;
	}
	else
	{
		this._headBand = null;
	}

	this._resetRowSizeList();
	this._resetColSizeList();

	this._bodyBand.createComponent();
	control_elem.setVertScrollElements(this._bodyBand._control_element);

	if (headband)
		this._headBand.createComponent();

	if (summband)
		this._summBand.createComponent();

	this._updateSelector();
	this._setHscrollElement();
	this._setScrollMaxSize(this._bodyBand._scrollWidth, this._bodyBand._scrollHeight);
};

_pGrid._resizeBand = function ()
{
	var clientleft = this._client_left;
	var clienttop = this._client_top;
	var clientwidth = this._client_width;
	var clientheight = this._client_height;
	var headHeight = this._getHeadHeight();
	var summHeight = this._getSummHeight();
	var l, t, w, h;

	l = clientleft;
	w = clientwidth;

	if (this._bodyBand)
	{
		if (this.summarytype == "top" || this.summarytype == "lefttop")
		{
			t = headHeight + summHeight;
			h = clientheight - t;
		}
		else
		{
			t = headHeight;
			h = clientheight - summHeight - t;
		}

		if (h < 0)
			h = 0;
	
		this._bodyBand.move(l, t, w, h);
		if ( this._graph ) //added code by row grouping functionality
		{
			this._graph.move(l, t, w, h);
		}
	}
	
	clientheight = this._client_height;
	
	if (this._summBand)
	{
		if (this.summarytype == "top" || this.summarytype == "lefttop")
		{
			t = headHeight;
			h = headHeight + summHeight - t;
		}
		else
		{
			t = clientheight - summHeight;
			h = clientheight - t;
		}
		this._summBand.move(l, t, w, h);
	}
	
	clientheight = this._client_height;
	
	if (this._headBand)
	{
		t = clienttop;
		h = headHeight;
	
		this._headBand.move(l, t, w, h);
	}
	this._applyAutofittype(true);
	this._MoveEditComp();
	this._updateSelector();
	this._updateScrollInfo();
};

_pGrid._destroyBands = function (parent_destory)
{
	if (this.enableredraw == false)
		return;
	
	if (!parent_destory)
		this._hideEditor(false, true);
	
	if (this._bodyBand)
	{
		if (this._control_element)
			this._control_element.setVertScrollElements(null);
	
		this._bodyBand.destroy();
		this._bodyBand = null;
		this.body = null;
		if ( this._graph ) //added code by row grouping functionality
		{
			this._graph.destroy();
			this._graph = null;
		}
		if ( this._originalbinddataset )
		{
			this._removeOrginialDSEventHandlers(this._originalbinddataset);
		}
	}

	if (this._summBand)
	{
		this._summBand.destroy();
		this._summBand = null;
		this.summary = null;
		this.summ = null;
	}

	if (this._headBand)
	{
		this._headBand.destroy();
		this._headBand = null;
		this.head = null;
	}

	if (this._select_ctrl)
	{
		this._select_ctrl.destroy();
		this._select_ctrl = null;
	}

	if (this.controlbutton)
	{
		this.controlbutton = null;
	}

	if (this.controlcalendar)
	{
		this.controlcalendar = null;
	}

	if (this.controlcheckbox)
	{
		this.controlcheckbox = null;
	}

	if (this.controlcombo)
	{
		this.controlcombo = null;
	}

	if (this.controledit)
	{
		this.controledit = null;
	}

	if (this.controlmaskedit)
	{
		this.controlmaskedit = null;
	}

	if (this.controltextarea)
	{
		this.controltextarea = null;
	}

	if (this.controlprogressbar)
	{
		this.controlprogressbar = null;
	}

	if (this.controlexpand)
	{
		this.controlexpand = null;
	}
};

    _pGrid._refreshBody = function (clearCurstyle, for_select)
    {
        if (this.enableredraw == false)
            return;

        var band = this._bodyBand;
        if (band)
        {
            this._suppressUpdate();

            var rowcnt = this._getDispRowCnt();
            var rows = band._get_rows();
            var cellcnt;

            band._updateAll(clearCurstyle);

            for (var i = 0; i < rowcnt; i++)
            {
                band._refreshRow(i, undefined, for_select);
            }
            var groupcells = this._groupingcells;
				if ( groupcells && groupcells.length )
				{
					var graph = this._graph;
					var layer = graph.getChildByIndex(0);
					band._selectRowForRowGrouping(null, layer, true);
				}
        }
    };

var _pGridBand = nexacro.GridBand.prototype

    /* find currentStyle */
    _pGridBand.on_find_CurrentStyle_background = function (pseudo)
    {
        if (!pseudo) pseudo = "normal";

        var obj = null;
        if (this._refobj)
        {
            obj = this._refobj._query_pseudo_background(pseudo);
        }
        var rows = this._get_rows();
        if (this._isBody && rows.length == 0)
        {
            var imgurl = this.parent.nodataimage;
            if (imgurl.length)
            {
                var color = "transparent";
                if (obj) color = obj.color;
                obj = nexacro._getCachedStyleObj("background", color + " " + imgurl + " center middle");
            }
        }
        else
        {
        		var grid = this._grid,
					graph = grid._graph;
		
			if ( this._isBody && grid.rowGrouping && graph )
			{
		        obj = nexacro._getCachedStyleObj("background", "transparent center middle");
		   }
		 }
		 return obj;
};

/*
_pGridBand._on_refresh_rows = function () // after page create, update
{
	if (this._control_element._handle)
	{
		var grid = this._grid;
		if (this._update_rows.length > 0 || this._create_rows.length > 0)
		{
			var update_rows = this._update_rows;
			var create_rows = this._create_rows;
			
			var rows = this._get_rows();
			var control_elem = this._control_element;
			
			this._on_refresh_rows_physical(update_rows, create_rows);
			
			this._update_rows = [];
			this._create_rows = [];
			this._rowGroupingDraw(grid);
		}
		this.on_apply_text();
		
		if (this.id == "head")
		{
			grid._applyResizer();
		}
	}
};
*/

_pGridBand._rowGroupingDraw = function(grid)
{
	//begin to add code by row grouping functionality
	var graph = grid._graph;

	if ( this._isBody && grid.rowGrouping && graph )
	{
		var groupcols = grid._groupingcells;

		var oldCache = graph._cache||{},
				cache = {}, elem, rName;
		var layer = graph.getChildByIndex(0);

		this._existSelected = false;
		if ( groupcols && groupcols.length )
		{
			var matrix = this._matrix,
				rows = this._get_rows(),
				vpos = matrix._curvertscrollpos||0,
				cHeight = this._client_height, start = false,
				rowpos, rowobj;

			var curFormat = grid._curFormat,
				cols = curFormat._cols, rowWidth = 0;

			var startgroupcellidx = groupcols._startgroupcellidx,
				leftval = 0, startcol ;
			if ( startgroupcellidx != null )
			{
				var bodycells = curFormat._bodycells,
					cellinfo = bodycells[startgroupcellidx];
				if ( cellinfo )
				{
					startcol = cellinfo._col - 1;
					for ( var i = 0 ; i <= startcol ; i++ )
					{
						leftval += cols[i].size;
					}
				}
			}

			for ( var i = 0, len = cols.length ; i < len ; i++ )
			{
				rowWidth += cols[i].size;
			}
			var arrcellline = grid._getGroupingrowstyles("cellline"),
				cellline = arrcellline[0],
				lineWidth = arrcellline[1];

			rowWidth -= lineWidth + leftval;
			var keycolsize = grid._getGroupingrowstyles("levelcolumnWidth");
			var headerbk = grid._getGroupingrowstyles("grouplevelbackground._headervalue");
			for ( var i = 0, len = rows.length ; i < len ; i++ )
			{
				rowobj = rows[i];
				if ( start )
				{
					elem = this._updateOrCreateRowForRowGrouping(rowobj, leftval, rowpos, layer, groupcols, cellline, lineWidth, keycolsize, rowWidth, headerbk);
					rName = rowobj._groupingRowName;
					delete oldCache[rName];
					cache[rName] = elem;
					rowpos += rowobj._adjust_height;
					if ( cHeight <= rowpos ) break;
				}
				//else if ( vpos >= rowobj._adjust_top && vpos < rowobj._getPosBottom() )
				else if ( vpos < rowobj._getPosBottom() )
				{
					start = true;
					if ( vpos == this._scrollHeight - this._client_height )
					{
						//console.log("last===>", vpos, rows[0]._adjust_top);
						rowpos = rowobj._adjust_top - vpos;
					}
					else
					{
						rowpos = vpos - rowobj._adjust_top;
					}
					//console.log("start===>", vpos, rowobj._adjust_top, "rowpos", rowpos, "i", i);
					elem = this._updateOrCreateRowForRowGrouping(rowobj, leftval, rowpos, layer, groupcols, cellline, lineWidth, keycolsize, rowWidth, headerbk);
					rName = rowobj._groupingRowName;
					delete oldCache[rName];
					cache[rName] = elem;
					rowpos += rowobj._adjust_height;
				}
			}
			if ( !this._existSelected )
			{
				this._selectRowForRowGrouping(null, layer);
			}
		}

		Eco.object.Each(oldCache, function(prop, val) {
			if ( val ) layer.removeChild(val);
		});
		graph._cache = cache;

		graph.invalidate();
	}
	//end to add code by row grouping functionality
};

_pGridBand._clearDrawedRowGrouping = function (onlyRender)
{
	var grid = this._grid,
		graph = grid._graph;

	if ( graph )
	{
		var layer = graph.getChildByIndex(0);
		layer.removeChildren();
		graph._cache = null;
	}
	this._selectRowName = null;

	if ( !onlyRender )
	{
		var rows = this._get_rows();
		for ( var i = 0, len = rows.length ; i < len ; i++ )
		{
			rows[i]._groupingRowName = null;
			rows[i]._rowkind = null;
		}
	}
};

_pGridBand._selectRowForRowGrouping = function (rowName, layer, isRender)
{
	var selectRowName = this._selectRowName,
		grid = this._grid;

	if ( rowName != selectRowName )
	{
		var rowElem = (rowName ? layer.getElementById(rowName) : null);
		var selectRowElem = (selectRowName ? layer.getElementById(selectRowName) : null);

		var rName, selectRectElem, txtElem;
		if ( selectRowElem )
		{
			rName = selectRowElem.getId();
			selectRectElem = selectRowElem.getElementById("select_bk");
			if ( selectRectElem )
			{
				selectRowElem.removeChild(selectRectElem);
			}
			txtElem = selectRowElem.getElementById(rName + "_text");
			if ( txtElem )
			{
				txtElem.setFont(grid._getGroupingrowstyles("grouplevelfont._headervalue"));
				txtElem.setFillbrush(grid._getGroupingrowstyles("grouplevelcolor._headervalue"));
			}
		}
		if ( rowElem )
		{
			selectRectElem = new Eco.GraphicRect();
			selectRectElem.setId("select_bk");
			rName = rowElem.getId();
			var rectElem = rowElem.getElementById(rName + "_background");
			var imgElem = rowElem.getElementById(rName + "_img");
			var sz = rectElem.getSize();
			var keycolsize = grid._getGroupingrowstyles("levelcolumnWidth");
			var arrcellline = grid._getGroupingrowstyles("cellline"),
				cellline = arrcellline[0],
				lineWidth = arrcellline[1];

			var leftgap = rowElem._datalevel*keycolsize;
			leftgap -= lineWidth;

			selectRectElem.setX(leftgap);
			selectRectElem.setWidth(sz.width - leftgap);
			selectRectElem.setHeight(sz.height);
			selectRectElem.setFillbrush(grid._getGroupingrowstyles("selectbackground"));
			selectRectElem.setFillgradation(grid._getGroupingrowstyles("selectgradation"));
			rowElem.insertBefore(selectRectElem, imgElem);

			txtElem = rowElem.getElementById(rName + "_text");
			if ( txtElem )
			{
				var font = grid._getGroupingrowstyles("selectfont");
				if ( font )
				{
					txtElem.setFont(font);
				}
				var color = grid._getGroupingrowstyles("selectcolor");
				if ( color )
				{
					txtElem.setFillbrush(color);
				}
			}
		}
		this._selectRowName = rowName;
		if ( grid._graph && isRender )
		{
			grid._graph.invalidate();
		}
	}
	else
	{
		var selectRowElem = (selectRowName ? layer.getElementById(selectRowName) : null);
		var rName, selectRectElem;
		if ( selectRowElem )
		{
			rName = selectRowElem.getId();
			selectRectElem = selectRowElem.getElementById("select_bk");
			var rectElem = selectRowElem.getElementById(rName + "_background");
			var sz = rectElem.getSize();
			var keycolsize = grid._getGroupingrowstyles("levelcolumnWidth");
			var arrcellline = grid._getGroupingrowstyles("cellline"),
				cellline = arrcellline[0],
				lineWidth = arrcellline[1];

			var leftgap = selectRowElem._datalevel*keycolsize;
			leftgap -= lineWidth;

			selectRectElem.setX(leftgap);
			selectRectElem.setWidth(sz.width - leftgap);
			selectRectElem.setHeight(sz.height);
		}
	}
};

//select changed, stylechanged, textchanged, sizechanged,  create
//1, 2, 4, 8, 16
_pGridBand._updateOrCreateRowForRowGrouping = function (rowobj, leftval, rowpos, layer, groupcols, cellline, lineWidth, keycolsize, rowWidth, headerbk)
{
	if ( groupcols && groupcols.length )
	{
		var grid = this._grid,
			datarow = grid._getDataRow(rowobj._rowidx),
			ds = grid._binddataset;

		var rowName = "r_" + datarow;
		rowobj._groupingRowName = rowName;

		//console.log(rowobj._rowidx, "===>", rowName, rowobj._rowkind);

		var rowElem = layer.getElementById(rowName);
		if ( !rowElem )
		{
			rowElem = new Eco.GraphicGroup();
			rowElem.setId(rowName);
			layer.addChild(rowElem);
		}
		rowElem.setX(leftval);
		rowElem.setY(rowpos);
		var rowKind = rowobj._rowkind;

		var lvl = ds.getColumn(datarow, "__level"),
			rowHeight = rowobj._adjust_height,
			lineElem, rectElem, imgElem, txtElem;

		rowElem._datalevel = lvl;

		if ( rowKind == 1 )
		{
			rowobj._wRegion = [leftval, leftval + rowWidth];
			rectElem = rowElem.getElementById(rowName + "_background");
			if ( !rectElem )
			{
				rectElem = new Eco.GraphicRect();
				rectElem.setId(rowName + "_background");
				rowElem.addChild(rectElem);
			}
			rectElem.setFillbrush(headerbk);
			rectElem.setWidth(rowWidth);
			rectElem.setHeight(rowHeight);

			lineElem = rowElem.getElementById(rowName + "_line_horz");
			if ( !lineElem )
			{
				lineElem = new Eco.GraphicLine();
				lineElem.setId(rowName + "_line_horz");
				rowElem.addChild(lineElem);
				lineElem.setStrokepen(cellline);
			}
			imgElem = rowElem.getElementById(rowName + "_img");
			if ( !imgElem )
			{
				imgElem = new Eco.GraphicImage();
				imgElem.setId(rowName + "_img");
				rowElem.addChild(imgElem);
				var iconsize = grid._getGroupingrowstyles("headericonsize");
				var y = parseInt((rowHeight - iconsize)/2),
					x = (lvl - 1) * keycolsize + y;
				imgElem.setX(x);
				imgElem.setY(y);
				imgElem.setCursor("hand");
				imgElem.addEventHandler("onclick", this._group_icon_click, this);
			}
			imgElem._gridrow = rowobj._rowidx;
			//var treestatus = grid.getTreeStatus(this._rowidx);
			//imgElem._datarow = datarow;
			var treestatus = grid._treeStates[datarow];
			if ( treestatus == 0 ) //collapse
			{
				imgElem._expanded = false;
				imgElem.setSrc(grid._getGroupingrowstyles("collaspeicon"));
				var x1 = (lvl - 1) * keycolsize,
					y = rowHeight - lineWidth;
				lineElem.setX1(x1);
				lineElem.setY1(y);
				lineElem.setX2(rowWidth);
				lineElem.setY2(y);
			}
			else if ( treestatus == 1 ) //expand
			{
				imgElem._expanded = true;
				imgElem.setSrc(grid._getGroupingrowstyles("expandicon"));
				var x1 = lvl * keycolsize,
					y = rowHeight - lineWidth;
				lineElem.setX1(x1);
				lineElem.setY1(y);
				lineElem.setX2(rowWidth);
				lineElem.setY2(y);
			}

			txtElem = rowElem.getElementById(rowName + "_text");
			if ( !txtElem )
			{
				txtElem = new Eco.GraphicText();
				txtElem.setId(rowName + "_text");
				rowElem.addChild(txtElem);
				txtElem.setHalign("left");
				txtElem.setValign("middle");
				var x = lvl * keycolsize,
					y = parseInt(rowHeight/2);
				txtElem.setX(x);
				txtElem.setY(y);
				txtElem.setFont(grid._getGroupingrowstyles("grouplevelfont._headervalue"));
				txtElem.setFillbrush(grid._getGroupingrowstyles("grouplevelcolor._headervalue"));
				var ginfo = groupcols[groupcols.length - lvl];
				txtElem.setText(ginfo.titlename + " : " + 
					ds.getColumn(datarow, ginfo.colidx) + " ( " +  
					Eco.number.getMaskFormatString(ds.getColumn(datarow, "__rowCntPerGroup"), "9,990") + 
					" 건수 )");
			}
			lineElem = rowElem.getElementById(rowName + "_line_lastvert");
			if ( !lineElem )
			{
				lineElem = new Eco.GraphicLine();
				lineElem.setId(rowName + "_line_lastvert");
				rowElem.addChild(lineElem);
				lineElem.setStrokepen(cellline);
			}
			lineElem.setX1(rowWidth);
			lineElem.setY1(-lineWidth);
			lineElem.setX2(rowWidth);
			lineElem.setY2(rowHeight - lineWidth);

			var startgroupcellidx = groupcols._startgroupcellidx||0;
			var selected = grid.isSelectedCell(startgroupcellidx, "body", datarow); //using only single or focus
			if ( selected )
			{
				if ( !this._existSelected ) this._existSelected = true;
				this._selectRowForRowGrouping(rowName, layer);
			}
		}
		else if ( rowKind == 11 )
		{
			rectElem = rowElem.getElementById(rowName + "_background");
			if ( !rectElem )
			{
				rectElem = new Eco.GraphicRect();
				rectElem.setId(rowName + "_background");
				rowElem.addChild(rectElem);
			}
			rectElem.setFillbrush(headerbk);
			rectElem.setWidth((lvl - 1) * keycolsize);
			rectElem.setHeight(rowHeight);

			var rectElem2 = rowElem.getElementById(rowName + "_background2");
			if ( !rectElem2 )
			{
				rectElem2 = new Eco.GraphicRect();
				rectElem2.setId(rowName + "_background2");
				rowElem.addChild(rectElem2);
			}
			rectElem2.setFillbrush(grid._getGroupingrowstyles("grouplevelbackground._footervalue"));
			rectElem2.setX((lvl - 1) * keycolsize);
			rectElem2.setWidth((groupcols.length - lvl + 1) * keycolsize);
			rectElem2.setHeight(rowHeight);

			lineElem = rowElem.getElementById(rowName + "_line_horz");
			if ( !lineElem )
			{
				lineElem = new Eco.GraphicLine();
				lineElem.setId(rowName + "_line_horz");
				rowElem.addChild(lineElem);
				lineElem.setStrokepen(cellline);
				var x1 = (lvl - 2) * keycolsize,
					x2 = groupcols.length * keycolsize,
					y = rowHeight - lineWidth;
				lineElem.setX1(x1);
				lineElem.setY1(y);
				lineElem.setX2(x2);
				lineElem.setY2(y);
			}
		}
		else
		{
			rectElem = rowElem.getElementById(rowName + "_background");
			if ( !rectElem )
			{
				rectElem = new Eco.GraphicRect();
				rectElem.setId(rowName + "_background");
				rowElem.addChild(rectElem);
			}
			rectElem.setFillbrush(headerbk);
			rectElem.setWidth((lvl - 1) * keycolsize);
			rectElem.setHeight(rowHeight);
		}

		if ( lvl > 1 )
		{
			var len;
			if ( rowKind == 11 )
			{
				len = lvl - 2;
			}
			else
			{
				len = lvl - 1;
			}
			for ( var i = 0; i < len ; i++ )
			{
				lineElem = rowElem.getElementById(rowName + "_line_" + i);
				if ( !lineElem )
				{
					lineElem = new Eco.GraphicLine();
					lineElem.setId(rowName + "_line_" + i);
					rowElem.addChild(lineElem);
					lineElem.setStrokepen(cellline);
					var x1 = (i + 1) * keycolsize - lineWidth;
					lineElem.setX1(x1);
					lineElem.setY1(-lineWidth);
					lineElem.setX2(x1);
					lineElem.setY2(rowHeight - lineWidth);
				}
			}
		}
		return rowElem;
	}
};

_pGridBand._group_icon_click = function(obj, e)
{
	var grid = this._grid;
	var gridrow = obj._gridrow;
	if ( obj._expanded )
	{
		grid.setTreeStatus(gridrow, false); //collapse
	}
	else
	{
		grid.setTreeStatus(gridrow, true); //expand
	}
	this._rowGroupingDraw(grid);
};

//add defined functions 
_pGridBand.on_fire_user_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
{
	if ( this._isBody )
	{
		var grid = this._grid,
			groupkeycells = grid.groupkeycells;

		if ( groupkeycells && groupkeycells.length && from_refer_comp && from_refer_comp._rowkind == 1 )
		{
			//if this area is header summary row, graph send event process.
			clientY -= grid._getScrollTop();
			var graph = grid._graph;
			graph.on_fire_user_onmousemove(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
			var curCursor = from_refer_comp.getElement().cursor;	
			var graphCursor = graph.getElement().cursor;
			if ( graphCursor )
			{
				if ( !curCursor )
				{
					from_refer_comp.getElement().setElementCursor(graphCursor);
				}
				else if ( curCursor._value != graphCursor._value )
				{
					from_refer_comp.getElement().setElementCursor(graphCursor);
				}
			}
			else
			{
				from_refer_comp.getElement().setElementCursor(null);
			}
			//return true;
		}
	}
	return nexacro.Component.prototype.on_fire_user_onmousemove.call(this,button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
};

    _pGridBand._refreshRowCell = function (displayrow, cellidx, selected, pseudo)
    {
        var rows = this._get_rows();
        var cells = rows[displayrow]._cells;
        var grid = this._grid;
        var cell = cells[cellidx];

		if ( selected && rows[displayrow]._rowkind == 1 )
		{
			var groupcells = grid._groupingcells;
			if ( groupcells && groupcells._startgroupcellidx == cellidx )
			{
				var graph = grid._graph;
				var layer = graph.getChildByIndex(0);
				var datarow = grid._getDataRow(rows[displayrow]._rowidx);
				this._selectRowForRowGrouping("r_" + datarow, layer, true);
			}
		}

        if (!cell)
        {
            return;
        }

        cell._selected = selected;

        var subcells = cell.subcells;
        var subcellsLen = subcells.length;

        for (var i = 0; i < subcellsLen; i++)
        {
            subcells[i]._selected = selected;
        }
        cell._updateAll(pseudo);
    };

_pGridBand.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
{
	if ( this._isBody )
	{
		var grid = this._grid,
			groupkeycells = grid.groupkeycells;
		if ( groupkeycells && groupkeycells.length && from_refer_comp && from_refer_comp._rowkind == 1 )
		{
			clientY -= grid._getScrollTop();
			var graph = grid._graph;
			graph.on_fire_user_onlbuttondown(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);

			var groupcells = grid._groupingcells;
			if ( groupcells && groupcells.length && from_refer_comp && from_refer_comp._rowkind == 1 )
			{
				var region = from_refer_comp._wRegion;
				if ( region && (region[0] < clientX && region[1] > clientX) )
				{
					var cell = groupcells._startgroupcellidx + groupcells.length;
					var cellobj = from_refer_comp._cells[cell];
					var datarow = grid._getDataRow(from_refer_comp._rowidx);
					if ( cellobj )
					{
                var afterCell = cellobj._cellidx;
                var afterCol = cellobj._refobj._col;
                var afterRow = datarow;
                var afterSubrow = cellobj._refobj._row;
                var afterPvt = -9;
					 //grid._setSelectedInfo(afterCell, afterCol, afterRow, afterSubrow, afterPvt);
					 grid._resetSelect(afterRow, afterCell, afterCol, afterSubrow, afterPvt);
					}
					return true;
				}
			}
		}
	}
};

_pGridBand.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem)
{
	if ( this._isBody )
	{
		var grid = this._grid,
			groupkeycells = grid.groupkeycells;
		if ( groupkeycells && groupkeycells.length && from_refer_comp && from_refer_comp._rowkind == 1 )
		{
			clientY -= grid._getScrollTop();
			var graph = grid._graph;
			graph.on_fire_user_onlbuttonup(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
		//return true;
		}
	}	
};

_pGridBand.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
{
	if ( this._isBody )
	{
		var grid = this._grid,
			groupkeycells = grid.groupkeycells;
		if ( groupkeycells && groupkeycells.length && from_refer_comp && from_refer_comp._rowkind == 1 )
		{
			clientX += from_comp._adjust_left; //offset left
			clientY += from_comp._adjust_top; //offset top
			clientY -= grid._getScrollTop();
			var graph = grid._graph;
			graph.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
		}
		return false;
	}

	if (this.parent.onnodataareaclick && this.parent.onnodataareaclick._has_handlers)
	{
		return this.parent.on_fire_onnodataareaclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp.parent, from_refer_comp);
	}
	return false;
};

var _pGridMatrixManager = nexacro.GridMatrixManager.prototype;

_pGridMatrixManager._orginalAdjustScrollRows = _pGridMatrixManager._adjustScrollRows;

_pGridMatrixManager._adjustScrollRows = function (vpos, is_updatecontents)
{
	this._curvertscrollpos = vpos;
	return this._orginalAdjustScrollRows(vpos, is_updatecontents);
}

var _pGridRow = nexacro.GridRow.prototype;

_pGridRow.on_destroy_contents = function ()
{
	var cells = this._cells,
	cells_len = cells.length;
	
	for (var i = 0; i < cells_len; i++)
	{
		if ( cells[i] )
			cells[i].destroy();
	}
	this._grid = this._cells = this._format = this._band = this._cells = this._row_sizes = this._row_tops = this._row_bottoms = this._format_rows = this._format_cols = this._format_cells = this._nocreate_remain_cells = this._noupdate_remain_cells = null;
};

_pGridRow._updateAll = function (pseudo, is_remain_cell, onlycontents, for_select)
{
    var grid = this._grid,
        cells = this._cells;

    if (is_remain_cell)
        cells = this._noupdate_remain_cells;

    var cells_len = cells.length,
        datarow = grid._getDataRow(this._rowidx),
        subcells, subcellsLen, cell,
        selected, is_change;

    this._noupdate_remain_cells = [];

	//begin to add code by row grouping functionality
	var isvisible = true, maxlevel = 0;
	if ( grid.rowGrouping && this.parent._isBody )
	{
		var groupinfo = grid._groupingcells,
			ds = grid._binddataset;
		if ( groupinfo && groupinfo.length )
		{
			var rowKind;
			if ( ds )
			{
				rowKind = ds.getColumn(datarow, "__isVirtual");
				if ( rowKind == 1 )
				{
					isvisible = false;
				//return;
				}
			}
			var startgroupcellidx = groupinfo._startgroupcellidx - 1;
			maxlevel = startgroupcellidx + 1 + groupinfo.length;
			if (this._rowkind != rowKind )
			{
				this._rowkind = rowKind;
				onlycontents = false;
			}
		}
	}

	if ( !isvisible )
	{
		this._control_element.setElementCursor = nexacro.ControlElementBase.prototype.setElementCursor;
	}
	else
	{
		this._control_element.setElementCursor = nexacro._emptyFn;
	}
	//end to add code by row grouping functionality

	for (var i = 0; i < cells_len; i++)
	{
		cell = cells[i];
		//begin to add code by row grouping functionality
		if ( !cell ) continue;
		if ( i >= maxlevel && !isvisible )
		{
			cell.set_visible(false);
			continue;
		}
		else
		{
			cell.set_visible(true);
		}
		//end to add code by row grouping functionality

		if (cell._refobj._area != "body" || (cell._is_created && cell._isUpdateArea()))
		{
			if (grid._isSelectRowType())
			{
				if (selected == undefined)
					selected = grid.isSelectedCell(cell._cellidx, this._band.id, datarow);
			}
			else
			{
				selected = grid.isSelectedCell(cell._cellidx, this._band.id, datarow);
			}

			is_change = false;
			if (cell._selected != selected)
			{
				cell._selected = selected;
				onlycontents = false;
				is_change = true;
			}
			subcells = cell.subcells;
			subcellsLen = subcells.length;

			for (var j = 0; j < subcellsLen; j++)
			{
				subcells[j]._selected = selected;
				// subcell의 updateAll은 cell의 updataAll에서...
			}
			
			if (for_select)
			{
				if (is_change)
					cell._updateAll(pseudo, onlycontents);
			}
			else
			{
				cell._updateAll(pseudo, onlycontents);
			}
		}
		else
		{
			this._noupdate_remain_cells.push(cell);
		}
	}
};

_pGridRow._hideCellElementsDelete = function ()
{
	var cells = this._cells, cells_len = cells.length, subcells, subcells_len;
	var remaincells = this._nocreate_remain_cells;
	var cell_elem;

	if (this._displaynone)
	{
		for (var i = 0; i < cells_len; i++)
		{
			if (!cells[i] || !cells[i]._is_created) //modify code by row grouping functionality
				continue;

			cell_elem = cells[i]._control_element;

			if (cells[i]._isUpdateArea() == false)
			{
				if (cell_elem)
				{
					cell_elem._setDisplay(false);
					cells[i]._is_recreated = true;
					remaincells.push(cells[i]);
				}
			}
		}
	}
	else
	{
		for (var i = 0; i < cells_len; i++)
		{
			if (!cells[i] || !cells[i]._is_created) //modify code by row grouping functionality
				continue;

			if (cells[i]._isUpdateArea() == false)
			{
				if (cell_elem)
				{
					this.__CellElementDestroy(cells[i]);
					subcells = cells[i].subcells;
					subcells_len = subcells.length;
				
					for (var j = 0; j < subcells_len; j++)
						this.__CellElementDestroy(subcells[j]);
					remaincells.push(cells[i]);
				}
			}
		}
	}
};

_pGridRow._createCellElements = function (is_remain_cell)
{
	var cells = this._cells;
	
	if (is_remain_cell)
		cells = this._nocreate_remain_cells;
	
	var cells_len = cells.length;
	
	if (cells_len == 0)
		return;

	var grid = this._grid,
		subcells, subcells_len,
		update = false,
		datarow = grid._getDataRow(this._rowidx),
		selected;

	this._nocreate_remain_cells = [];
	
	var remaincells = this._nocreate_remain_cells;
	
	if (this._rowidx < 0 || grid._is_created == true)   // grid 생성시점에서 refreshbody 하므로 조건부 call
		update = true;
	
	for (var i = 0; i < cells_len; i++)
	{
		if ( !cells[i] ) continue; //added code by row grouping functionality

		if (cells[i]._refobj._area == "body")
		{
			if (grid._isSelectRowType())
			{
				if (selected == undefined)
					selected = grid.isSelectedCell(cells[i]._cellidx, this._band.id, datarow);
			}
			else
			{
				selected = grid.isSelectedCell(cells[i]._cellidx, this._band.id, datarow);
			}

			if (cells[i]._isUpdateArea())
			{
				cells[i]._selected = selected;

				if (cells[i]._is_recreated == true)
				{
					if (this._displaynone)
					{
						if (update)
							cells[i]._updateAll();  // 안보이는 영역을 update하지 않으므로 업데이트 처리

						cells[i]._control_element._setDisplay(true);
						cells[i]._is_recreated = false;
					}
					else
					{
						cells[i].createComponent();
						
						if (update)
							cells[i]._updateAll();
						
						subcells = cells[i].subcells;
						subcells_len = subcells.length;

						for (var j = 0; j < subcells_len; j++)
						{
							subcells[j].createComponent();

							if (update)
								subcells[j]._updateAll();

							subcells[j]._is_recreated = false;
						}

						cells[i]._is_recreated = false;
					}
				}
				else
				{
					if (cells[i]._is_created)
						continue;
					
					if (update)
						cells[i]._updateAll();
					
					cells[i].on_created();
					
					subcells = cells[i].subcells;
					subcells_len = subcells.length;
					
					for (var j = 0; j < subcells_len; j++)
					{
						if (update)
							subcells[j]._updateAll();

						subcells[j].on_created();
					}
				}
			}
			else
			{
				remaincells.push(cells[i]);
			}
		}
		else
		{
			if (cells[i]._is_created)
				continue;
			
			if (update)
				cells[i]._updateAll();
			
			cells[i].on_created();
			
			subcells = cells[i].subcells;
			subcells_len = subcells.length;
			
			for (var j = 0; j < subcells_len; j++)
			{
				if (update)
					subcells[j]._updateAll();
			
				subcells[j].on_created();
			}
		}
	}
};

_pGridRow._createCellComponents = function ()
{
	var _cols = this._format_cols,
		_rows = this._format_rows,
		_cells = this._format_cells,
		_row_tops = this._row_tops,
		_row_sizes = this._row_sizes,
		_row_bottoms = this._row_bottoms,
		cellcnt = (_cells) ? _cells.length : 0,
		_cellinfo, top = 0, left, width, height, cellitem, id,
		_subcells, _subcellsLen, _subcell, col, row, subcellitem, selected, _subcellinfo,
		grid = this._grid,
		datarow = grid._getDataRow(this._rowidx);

	//begin to add code by row grouping functionality
	var maxlevel = 0, isvisible = true, startgroupcellidx = -1;
	if ( grid.rowGrouping && this.parent._isBody )
	{
		var groupinfo = grid._groupingcells,
			ds = grid._binddataset;

		if ( groupinfo && groupinfo.length && ds )
		{
			var rowKind = ds.getColumn(datarow, "__isVirtual");
			if ( rowKind == 1 )
			{
				//console.log("toppos", grid._getScrollTop());
				isvisible = false;
			}
			this._rowkind = rowKind;
			startgroupcellidx = groupinfo._startgroupcellidx - 1;
			maxlevel = startgroupcellidx + 1 + groupinfo.length;
		}
	}

	if ( !isvisible )
	{
		this._control_element.setElementCursor = nexacro.ControlElementBase.prototype.setElementCursor;
	}
	else
	{
		this._control_element.setElementCursor = nexacro._emptyFn;
	}
	//end to add code by row grouping functionality
	for (var i = 0; i < cellcnt; i++)
	{
		if ( startgroupcellidx < i && i < maxlevel ) continue; //added code by row grouping functionality
		 _cellinfo = _cells[i];

		left = _cols[_cellinfo._col].left;
		top = _row_tops[_cellinfo._row];
		width = _cols[_cellinfo._col + _cellinfo._colspan - 1].right - left;
		height = _row_bottoms[_cellinfo._row + _cellinfo._rowspan - 1] - top;
		
		if (grid._isSelectRowType())
		{
			if (selected == undefined)
				selected = grid.isSelectedCell(_cellinfo._cellidx, this._band.id, datarow);
		}
		else
		{
			selected = grid.isSelectedCell(_cellinfo._cellidx, this._band.id, datarow);
		}

		id = "cell_" + this._rowidx + "_" + _cellinfo._cellidx;
		cellitem = new nexacro.GridCell(id, left, top, width, height, this, _cellinfo, this._rowidx, _cellinfo._cellidx);
		cellitem._selected = selected;
		cellitem.createComponent(true);

		this._cells[i] = cellitem;

		if ( i >= maxlevel && !isvisible ) cellitem.set_visible(false); //added code by row grouping functionality

		_subcells = _cellinfo._subcells;
		_subcellsLen = _subcells.length;

		for (var j = 0; j < _subcellsLen; j++)
		{
			_subcellinfo = _subcells[j];
			col = _cellinfo._col + _subcellinfo._col;
			row = _cellinfo._row + _subcellinfo._row;

			left = _cols[col].left;
			top = _row_tops[row];
			width = _cols[col + _subcellinfo._colspan - 1].right - left;
			height = _row_sizes[row];

			left -= _cols[_cellinfo._col].left;
			top -= _row_tops[_cellinfo._row];
			id = "subcell_" + this._rowidx + "_" + _cellinfo._cellidx + "_" + _subcellinfo._cellidx;
			subcellitem = new nexacro.GridCell(id, left, top, width, height, cellitem, _subcellinfo, this._rowidx, _subcellinfo._cellidx);
			subcellitem._isSubCell = true;
			subcellitem._selected = selected;
			subcellitem.parentcell = cellitem;
			subcellitem.createComponent(true);
			cellitem.subcells[j] = subcellitem;
		}
	}
};

_pGridRow._resetCellsSize = function (format)
{
	var cols = this._format_cols,
		cells, cells_len, cell, cellinfo, subcells, subcells_len, subcell, subcellinfo,
		left, width, top, height,
		subcol, subrow;

	this._control_element.setArea(format.leftWidth, format.rightWidth);

	cells = this._cells;
	cells_len = cells.length;

	var _row_tops = this._row_tops,
		_row_sizes = this._row_sizes,
		_row_bottoms = this._row_bottoms;

	for (var i = 0; i < cells_len; i++)
	{
		cell = cells[i];
		if ( !cell ) continue; //added code by row grouping functionality
		cellinfo = cell._refobj;

		left = cols[cellinfo._col].left;
		top = _row_tops[cellinfo._row];
		width = cols[cellinfo._col + cellinfo._colspan - 1].right - left;
		height = _row_bottoms[cellinfo._row + cellinfo._rowspan - 1] - top;

		cell.move(left, top, width, height);
		// expand도 위치 및 크기 조정
		expand_ctrl = cell._expandCtrl;
		if (expand_ctrl)
		{
			left = width - expand_ctrl.width;
			top = expand_ctrl.top;
			width = expand_ctrl.width;
			height = expand_ctrl.height;

			expand_ctrl.move(left, top, width, height);
		}

		subcells = cell.subcells;
		subcells_len = subcells.length;

		for (var j = 0; j < subcells_len; j++)
		{
			subcell = subcells[j];
			subcellinfo = subcell._refobj;

			subcol = cellinfo._col + subcellinfo._col;
			subrow = cellinfo._row + subcellinfo._row;

			left = cols[subcol].left;
			top = _row_tops[subrow];
			width = cols[subcol + subcellinfo._colspan - 1].right - left;
			height = _row_sizes[subrow];

			left -= cols[cellinfo._col].left;
			top -= _row_tops[cellinfo._row];

			subcell.move(left, top, width, height);
			// expand도 위치 및 크기 조정
			expand_ctrl = subcell._expandCtrl;
			if (expand_ctrl)
			{
				left = width - expand_ctrl.width;
				top = expand_ctrl.top;
				width = expand_ctrl.width;
				height = expand_ctrl.height;

				expand_ctrl.move(left, top, width, height);
			}
		}
	}
};

//add function
_pGridRow.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
{
	var grid = this._grid,
		groupinfo;
	if ( grid.rowGrouping && this.parent._isBody && (groupinfo = grid._groupingcells) &&  groupinfo.length )
	{
		if ( this._rowkind )
		{
			return this.parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
		}
	}
	return false;
};	

var _pGridCell = nexacro.GridCell.prototype;

_pGridCell.on_find_CurrentStyle_background = function (pseudo)
{
	if (this._refobj && !this._isSubCell)
	{
		var grid = this._grid;
		//begin to add code by row grouping functionality
		if ( this._refobj._area != "left" && (!this._isSelected())  && this.parent._rowkind == 11 )
		{
			var bk = grid._getGroupingrowstyles("grouplevelbackground._footercompvalue");
			if ( bk )
			{
				return bk;
			}
		}
		//end to add code by row grouping functionality
		var odd = (this._rowidx >= 0) ? (this._rowidx % 2) : false,
			datarow = grid._getDataRow(this._rowidx);
		
		return this._refobj._query_pseudo_background(datarow, odd, this._isSelected(), pseudo);
	}
	return null;
};

_pGridCell.on_find_CurrentStyle_gradation = function (pseudo)
{
	if (this._refobj && !this._isSubCell)
	{
		var grid = this._grid;
		//begin to add code by row grouping functionality
		if ( this._refobj._area != "left" && (!this._isSelected()) && this.parent._rowkind == 11 )
		{
			var gradation = grid._getGroupingrowstyles("grouplevelgradation._footervalue");
			if ( gradation )
			{
				return gradation;
			}
		}
		//end to add code by row grouping functionality

		var odd = (this._rowidx >= 0) ? (this._rowidx % 2) : false,
			datarow = grid._getDataRow(this._rowidx);
		
		return this._refobj._query_pseudo_gradation(datarow, odd, this._isSelected(), pseudo);
	}
	return null;
};

_pGridCell.on_find_CurrentStyle_font = function (pseudo)
{
	if (this._refobj)
	{
		var grid = this._grid;
		//begin to add code by row grouping functionality
		if ( this._refobj._area != "left" && (!this._isSelected())  && this.parent._rowkind == 11 )
		{
			var font = grid._getGroupingrowstyles("grouplevelfont._footervalue");
			if ( font )
			{
				return font;
			}
		}
		//end to add code by row grouping functionality

		var datarow = grid._getDataRow(this.parent._rowidx);
		
		return this._refobj._query_pseudo_font(datarow, this._isSelected(), pseudo);
	}
	return null;
};

_pGridCell.on_find_CurrentStyle_color = function (pseudo)
{
	var cell = this;
	
	if (this._isSubCell)
	{
		cell = this.parentcell;
	}

	if (this._refobj)
	{
		var grid = this._grid;
		//begin to add code by row grouping functionality
		if ( this._refobj._area != "left" && (!this._isSelected()) && this.parent._rowkind == 11 )
		{
			var color = grid._getGroupingrowstyles("grouplevelcolor._footercompvalue");
			if ( color )
			{
				return color;
			}
		}
		//end to add code by row grouping functionality

		var odd = (this._rowidx >= 0) ? (this._rowidx % 2) : false;
		var datarow = grid._getDataRow(this._rowidx);
		
		return this._refobj._query_pseudo_color(datarow, odd, cell._selected, pseudo);
	}
	return null;
};

var _pGridCellInfo = nexacro.GridCellInfo.prototype;


//if date's value is null, display zero text 
Eco.interceptBefore(_pGridCellInfo, "_getDisplayText_date",
	function (rowidx, colType) {
		var dataset = this.grid._binddataset;
		
		if (dataset && dataset.getRowCount() <= rowidx)
		  return false;
		
		var v = this._getTextValueForDisp(rowidx);
		if ( v == null ) return false;
	},
null, "");