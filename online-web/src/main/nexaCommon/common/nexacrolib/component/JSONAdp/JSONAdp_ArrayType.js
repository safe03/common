
//----------------------------------------------------------------------------------------
if (!nexacro.JSONAdp)
{
	//==============================================================================
	// anysign adaptor 시작
	//==============================================================================
	nexacro.JSONAdp	 = function	()
	{
	};

	var	_pJSONAdp =	nexacro._createPrototype(nexacro.ProtocolAdp);
	nexacro.JSONAdp.prototype =	_pJSONAdp;

	_pJSONAdp._type			= "JSONAdp";
	_pJSONAdp._type_name	= "JSONAdp";
	_pJSONAdp._undefined	= String.fromCharCode(3);
	//_pJSONAdp._null		  =	String.fromCharCode(29);
	_pJSONAdp._rs_			= String.fromCharCode(30);
	_pJSONAdp._cs_			= String.fromCharCode(31);

	/*----------------------------------------------------------------------------
	// Encrypt
	-----------------------------------------------------------------------------*/
	_pJSONAdp.encrypt =	function(url, data,	anysigndata)
	{
		trace("_pJSONAdp.encrypt");
//		  trace(data);
		var	strRecvData	= data.trim();
		var	fstr = strRecvData.substring(0,	3);
		var	strJSONData	= "";

		if(data.indexOf("SSV:")	>= 0)
		{
			// SSV
			strJSONData	= this.__deserializeSSV(data);
		}
		else
		{
			// XML
			strJSONData	= this.__deserializeXML(data);
		}

		return strJSONData;
	};

	/*----------------------------------------------------------------------------
	// Decrypt
	-----------------------------------------------------------------------------*/
	_pJSONAdp.decrypt =	function (url, data, item, cookie, last_modified)
	{
		trace("_pJSONAdp.decrypt");

		var	objDate	= new Date();
		trace("_pJSONAdp.decrypt start = "+	objDate.getHours() + " : " + objDate.getMinutes() +	" :	" +	objDate.getSeconds() + " : " + objDate.getMilliseconds());

		var	oJsonData =	JSON.parse(data);

		objDate	= new Date();
		trace("JSON	parse end =	"+ objDate.getHours() +	" :	" +	objDate.getMinutes() + " : " + objDate.getSeconds()	+ "	: "	+ objDate.getMilliseconds());

		var	ssvData	= "";
		ssvData	+= "SSV:" +	oJsonData.codepage + _pJSONAdp._rs_;

		var	parameters = oJsonData.parameters;
		for(var	i =	0; i < parameters.length; i++)
		{
			ssvData	+= parameters[i][0]	+ "="+ parameters[i][2]	+ _pJSONAdp._rs_;
		}

		for(var	i =	0; i < oJsonData.datasets.length;	i++)
		{
			var	dataset	= oJsonData.datasets[i];

			ssvData	+= "Dataset:" +	dataset.ds_id +	_pJSONAdp._rs_;

			// ConstColumn
			ssvData	+= "_Const_" + _pJSONAdp._cs_;

			var	constcolumn	= dataset.ds_colinfo.constcolumn;
			for(var	j =	0; j < constcolumn.length; j++)
			{
				ssvData	+= _pJSONAdp._cs_ +	constcolumn[j][0] +	"="	+ constcolumn[j][1];
			}
			ssvData	+= _pJSONAdp._rs_;

			// Column
			//ssvData += "_RowType_" + _pJSONAdp._cs_;
			var	column = dataset.ds_colinfo.column;
			for(var	j =	0; j < column.length; j++)
			{
				if(j ==	0)
				{
					ssvData	+= column[j][0];
				}
				else
				{
					var	cols = column[j];
					ssvData	+= _pJSONAdp._cs_ +	cols[0]+ ":" + cols[1] + "(" + cols[2] +")";
				}
			}
			ssvData	+= _pJSONAdp._rs_;

			// Rows
			var	row	= dataset.ds_rows.row;
			for(var	j =	0; j < row.length; j++)
			{
				var	recode = row[j];

				if(recode[0])
				{
					ssvData	+= recode[0];
				}
				else
				{
					ssvData	+= "N";
				}
				for(var	nCol = 1; nCol < recode.length;	nCol++)
				{
					if(recode[nCol]	== null)
					{
						ssvData	+= _pJSONAdp._cs_ +	"";
					}
					else
					{
						ssvData	+= _pJSONAdp._cs_ +	recode[nCol];
					}
				}
				ssvData	+= _pJSONAdp._rs_;
			}
			ssvData	+= _pJSONAdp._rs_;
		}

		objDate	= new Date();
		trace("_pJSONAdp.decrypt end = "+ objDate.getHours() + " : " + objDate.getMinutes()	+ "	: "	+ objDate.getSeconds() + " : " + objDate.getMilliseconds());

		return ssvData;
	};


	/*----------------------------------------------------------------------------
	// deserialize : array push
	-----------------------------------------------------------------------------*/
	_pJSONAdp.addArrayForJson =	function()
	{
		var	arg	= this.addArrayForJson.arguments;
		arr	= [];
		var	nSize =	arg[1] + 2;
		for(var	i =	2;i	< nSize; i++)
		{
			arr.push(arg[i]);
		}
		return arr;
	};
	/*----------------------------------------------------------------------------
	// deserialize : dataset format	json
	-----------------------------------------------------------------------------*/
	_pJSONAdp.__makeJSONDataset	= function ()
	{
		var	o =	new	Object();
		o =	{
				ds_id		: "" ,
				ds_colinfo	:	{
									constcolumn	: [] ,
									column		: []
								} ,
				ds_rows		:	{
									row	: [] ,
									orgrow	: []
								}
		   };
		return o;
	};
	/*----------------------------------------------------------------------------
	// deserialize : ssv
	-----------------------------------------------------------------------------*/
	_pJSONAdp.__deserializeSSV = function (strInData)
	{
		if (strInData == undefined || strInData	== null	|| strInData ==	"")
		{
			return "";
		}

		var	oJsonData =	{
							datatype	: "JSON"	,
							codepage	: "utf-8"	,
							parameters	: [],
							datasets	: []
						};

		//var oJsonData	= {	datasets : [] };
		var	arrConstColList	= [];
		var	arrColList = [];
		var	arrRowList = [];
		var	arrOrgRowList =	[];
		var	arrList	= [];

		var	ssvLines = strInData.split(_pJSONAdp._rs_);
		var	lineCnt	= ssvLines.length;
		var	curIdx = 0;
		curIdx++;		// SSV:utf-8 은 fix

		var	dsname = "";
		var	nDsCnt = 0;
		var	typeFlag = "";
		var	curStr;
		var	paramStr,varInfo,val,type,size;
		var	sep_pos,pos1,pos2;

		for	(; curIdx <	lineCnt; curIdx++)
		{
			curStr = ssvLines[curIdx];
			if (curStr.substring(0,	7) != "Dataset")
			{
				var	paramArr = curStr.split(_pJSONAdp._cs_);
				var	paramCnt = paramArr.length;

				if(dsname == "")
				{	// parameters
					if(paramArr[0])
					{
						 if((pos1 =	(paramArr[0].indexOf("=")))>=0)
						 {
							 var pName = paramArr[0].substring(0,pos1);
							 var pValue	= paramArr[0].substring(pos1+1);

							 arrList = this.addArrayForJson(arrList, 3,	pName, "STRING", pValue);
							 oJsonData.parameters.push(arrList);
						 }
					}
					continue;
				}

				if(typeFlag	== "DATA")
				{
					if(arrList.length>0)
					{
						if(arrList[0] && (arrList[0] ==	"O"))
						{	// ORIGINAL	DATA
							arrOrgRowList[arrOrgRowList.length-1] =	arrList;
						}
						else
						{
							arrRowList[arrRowList.length] =	arrList;
							arrOrgRowList[arrOrgRowList.length]	= [];
						}
						arrList	= [];
					}
					if(paramCnt	== 1)
					{	// 마지막 빈 row가 한두개 들어오네..
						if(	paramArr[0]	== undefined ||	paramArr[0]	== null	|| paramArr[0] == "") continue;
					}
				}

				for	(var i = 0;	i <	paramCnt; i++)
				{
					paramStr = paramArr[i];
					varInfo	= paramStr;
					val	= undefined;
					if(i==0)
					{
						if(paramStr	== "_Const_") typeFlag = "CONST";
						else if(paramStr ==	"_RowType_") typeFlag =	"COLUMN";
						else typeFlag =	"DATA";

						if(typeFlag	== "CONST")	continue;
					}
					if(typeFlag	== "CONST")
					{
						if(paramStr)
						{
							sep_pos	= paramStr.indexOf("=");
							if (sep_pos	>= 0)
							{
								varInfo	= paramStr.substring(0,	sep_pos);
								val	= paramStr.substring(sep_pos + 1);
							}
							arrList	= this.addArrayForJson(arrList,	2, varInfo,	val);
							arrConstColList[arrConstColList.length]	= arrList;
						}
					}
					else if(typeFlag ==	"COLUMN")
					{	// Column0:STRING(256)
						sep_pos	= paramStr.indexOf(":");
						if (sep_pos	>= 0)
						{
							varInfo	= paramStr.substring(0,	sep_pos);
							pos1 = paramStr.indexOf("(");
							pos2 = paramStr.indexOf(")");
							val	= paramStr.substring(sep_pos + 1,pos1);
							type = paramStr.substring(sep_pos +	1,pos1);
							size = paramStr.substring(pos1+1,pos2);

							arrList	= this.addArrayForJson(arrList,	3, varInfo,	type, size);
							arrColList[arrColList.length] =	arrList;
						}
						else
						{
							// _RowType_
							arrList	= this.addArrayForJson(arrList,	3, paramStr, "STRING", "1");
							arrColList[arrColList.length] =	arrList;
						}
						arrList	= [];
					}
					else
					{
						// data
//						if(arrColList[i][1].toUpperCase() == "INT")
//						{
//							  val =	nexacro.toNumber(val);
//						}
						if(paramStr	== _pJSONAdp._undefined)
						{
							arrList.push(null);
						}
						else
						{
							arrList.push(paramStr);
						}
					}
				}
			}
			else
			{
				if(nDsCnt >	0)
				{	// dataset을	한번이라도 처리한 경우 추가
					var	oJsonDataset = this.__makeJSONDataset();
					oJsonDataset.ds_id = dsname;
					oJsonDataset.ds_colinfo.constcolumn	= arrConstColList;
					oJsonDataset.ds_colinfo.column = arrColList;
					oJsonDataset.ds_rows.row = arrRowList;
					oJsonDataset.ds_rows.orgrow	= arrOrgRowList;

					oJsonData.datasets.push(oJsonDataset);
					arrConstColList	= [];
					arrColList = [];
					arrRowList = [];
					arrOrgRowList =	[];
					typeFlag = "";
				}
				dsname = curStr.substring(8,curStr.length);
				nDsCnt++;
			}
		}

		// 처리되지	않은 데이터 추가
		if(dsname != "")
		{
			var	oJsonDataset = this.__makeJSONDataset();
			oJsonDataset.ds_id = dsname;
			oJsonDataset.ds_colinfo.constcolumn	= arrConstColList;
			oJsonDataset.ds_colinfo.column = arrColList;
			oJsonDataset.ds_rows.row = arrRowList;
			oJsonDataset.ds_rows.orgrow	= arrOrgRowList;

			oJsonData.datasets.push(oJsonDataset);
		}
		var	strJSON	= JSON.stringify(oJsonData);
		//strJSON =	strJSON.replace(/"\\u0003"/g,undefined);	// undefined
		//strJSON =	strJSON.replace(/"\\u001d"/g,"");			// null
		oJsonData =	null;

		return strJSON;
	};

	/*----------------------------------------------------------------------------
	// deserialize : xml
	-----------------------------------------------------------------------------*/
	_pJSONAdp.__deserializeXML = function (strRecvData,	doc)
	{
		if (strRecvData	== undefined ||	strRecvData	== null	|| strRecvData == "")
		{
			return "";
		}

		var	fstr = strRecvData.substr(0, 10).toLowerCase();
		if (fstr.indexOf("<?xml") <	0)
		{
			trace("invalid nexacro communication format");
			return "";
		}

		var	oJsonData =	{
							datatype	: "JSON"	,
							codepage	: "utf-8"	,
							parameters	: [],
							datasets	: []
						};

		//var oJsonData	= {	datasets : [] };
		var	arrConstColList	= [];
		var	arrColList = [];
		var	arrRowList = [];
		var	arrList	= [];

		var	xml_parse_pos =	strRecvData.indexOf("<Dataset ");
		var	headerData;
		if (xml_parse_pos >	-1)
		{
			headerData = strRecvData.substring(0, xml_parse_pos);
		}
		else
		{
			headerData = strRecvData;
		}

		var	head_parse_pos = 0;

		// parameters
		var	paramsInfo = nexacro._getXMLTagData(headerData,	head_parse_pos,	"<Parameters>",	"</Parameters>");
		if (paramsInfo)
		{
			var	paramsData = paramsInfo[0];
			head_parse_pos = paramsInfo[3];

			var	param_parse_pos	= 0;
			var	varInfo	= nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");

			while (varInfo)
			{
				param_parse_pos	= varInfo[3];
				var	attrStr	= varInfo[1];
				var	id = nexacro._getXMLAttributeID(attrStr);
				if (id && id.length)
				{
					var	val	= varInfo[0];
					if(val)	val	= nexacro._decodeXml(val);
					//else val = _pJSONAdp._null;

					arrList	= this.addArrayForJson(arrList,	3, id, "STRING", val);
					oJsonData.parameters.push(arrList);
				}
				varInfo	= nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
			}
		}

		// dataset info
		if (xml_parse_pos >= -1)
		{
			var	datasetInfo	= nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset	", "</Dataset>");

			while (datasetInfo)
			{
				xml_parse_pos =	datasetInfo[3];
				var	attrStr	= datasetInfo[1];
				var	remoteId = nexacro._getXMLAttributeID(attrStr);

				if (remoteId &&	remoteId.length)
				{
					var	oJsonDataset = this.__makeJSONDataset();
					oJsonDataset.ds_id = remoteId;
					this._loadFromXMLStr(oJsonDataset,datasetInfo[0],0,-1);
					oJsonData.datasets.push(oJsonDataset);
				}
				datasetInfo	= nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset	", "</Dataset>");
			}
		}
		dsIds =	null;
		//return [[code, message], parameters, datasets];
		var	strJSON	= JSON.stringify(oJsonData);
		//strJSON =	strJSON.replace(/"\\u0003"/g,undefined);	// undefined
		//strJSON =	strJSON.replace(/"\\u001d"/g,"");			// null
		oJsonData =	null;

		return strJSON;
	};
	/*----------------------------------------------------------------------------
	// deserialize : xml
	-----------------------------------------------------------------------------*/
	_pJSONAdp._loadFromXMLStr =	function (oJsonDs, xmlStr, xml_parse_pos)
	{
		var	loadstatus = true;
		if (!xml_parse_pos)
		{
			xml_parse_pos =	0;
		}

		if (xml_parse_pos <= 0)
		{
			xml_parse_pos =	this._setColInfoFromXMLStr(oJsonDs,xmlStr);
			xml_parse_pos =	xmlStr.indexOf("<Rows>", xml_parse_pos);
			if (xml_parse_pos >	-1)
			{
				xml_parse_pos += 6;
			}
		}

		if (xml_parse_pos >	-1)
		{
			xml_parse_pos =	this._loadRecordFromXMLStr(oJsonDs,xmlStr, xml_parse_pos);
		}

		return xml_parse_pos;
	};
	/*----------------------------------------------------------------------------
	// deserialize : xml - column info
	-----------------------------------------------------------------------------*/
	_pJSONAdp._setColInfoFromXMLStr	= function (oJsonDs,xmlStr)
	{
		var	arrConstColList	= [];
		var	arrColList = [];
		var	xml_parse_pos =	0;
		var	colInfo	= nexacro._getXMLTagData(xmlStr, xml_parse_pos,	"<ColumnInfo>",	"</ColumnInfo>");
		if (colInfo)
		{
			//-----------------------------------------------------------------------------------------------
			xml_parse_pos =	colInfo[3];
			var	colinfoData	= colInfo[0];

			var	const_parse_pos	= 0;
			function _loadFromXMLStr_const_loop	(pThis,oJson,arrCol)
			{
				var	constVar = nexacro._getXMLTagData2(colinfoData,	const_parse_pos, "<ConstColumn ", "</ConstColumn>");
				if (constVar ==	null)
				{
					return true;
				}
				const_parse_pos	= constVar[3];
				var	attrStr	= constVar[1];
				var	id = nexacro._getXMLAttributeID(attrStr);
				var	value =	nexacro._getXMLAttributeData(attrStr, "value");
				if (id.length)
				{
					if(value) value	= nexacro._decodeXml(value);
					//else value = _pJSONAdp._null;

					var	arrList	= [];
					// constcolumn 은 xml 전문에 size /	type 이 없음
					arrCol[arrCol.length] =	pThis.addArrayForJson(arrList, 2, id, value);
				}
				return false;
			}
			while (true)
			{
				if (_loadFromXMLStr_const_loop(this,oJsonDs,arrConstColList)) break;
				if (_loadFromXMLStr_const_loop(this,oJsonDs,arrConstColList)) break;
				if (_loadFromXMLStr_const_loop(this,oJsonDs,arrConstColList)) break;
				if (_loadFromXMLStr_const_loop(this,oJsonDs,arrConstColList)) break;
				if (_loadFromXMLStr_const_loop(this,oJsonDs,arrConstColList)) break;
			}
			// JSON	객체에	CONST DATA WRITE
			oJsonDs.ds_colinfo.constcolumn = arrConstColList;
			//-----------------------------------------------------------------------------------------------

			// _RowType_
			var	arrList	= [];
			arrList	= this.addArrayForJson(arrList,	3, "_RowType_" ,"STRING", "1");
			arrColList[arrColList.length] =	arrList;

			var	colinfo_parse_pos =	0;
			function _loadFromXMLStr_col_loop (pThis,oJson,arrCol)
			{
				var	colInfo	= nexacro._getXMLTagData4(colinfoData, colinfo_parse_pos, "<Column ");
				if (colInfo	== null)
				{
					return true;
				}
				colinfo_parse_pos =	colInfo[3];
				var	attrStr	= colInfo[1];
				var	id = nexacro._getXMLAttributeID(attrStr);
				if (id && id.length)
				{
					var	type = nexacro._getXMLAttributeType(attrStr);
					var	size = nexacro._getXMLAttributeData(attrStr, "size");

					var	arrList	= [];
					arrList	= pThis.addArrayForJson(arrList, 3,	id , type, size);	// SSV 는 prop/sumtext 값이 없음.. SSV와 맞춤
					arrCol[arrCol.length] =	arrList;
				}
				return false;
			}
			while (true)
			{
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
				if (_loadFromXMLStr_col_loop(this,oJsonDs,arrColList)) break;
			}

			// JSON	객체에	CONST DATA WRITE
			oJsonDs.ds_colinfo.column =	arrColList;
		}

		return xml_parse_pos;
	};
	/*----------------------------------------------------------------------------
	// deserialize : xml - row
	-----------------------------------------------------------------------------*/
	_pJSONAdp._loadRecordFromXMLStr	= function (oJsonDs, xmlStr, xml_parse_pos)
	{
		var	colCnt = oJsonDs.ds_colinfo.column.length;
		var	colList	= oJsonDs.ds_colinfo.column;
		var	arrRowList = [];

		if (xml_parse_pos >	-1)
		{
			function _loadFromXMLStr_row_loop (pThis,oJson,arrCol)
			{
				var	rowData;
				var	attrStr;
				var	rowInfo	= nexacro._getXMLTagData3(xmlStr, xml_parse_pos, "<Row", "</Row>");
				if (rowInfo	== null)
				{
					return true;
				}
				xml_parse_pos =	rowInfo[3];
				rowData	= rowInfo[0];
				attrStr	= rowInfo[1];

				var	arrList	= [];
				var	arrOrgList = [];

				var	_rtype = -1;

				var	typeChar = "";

				if (attrStr)
				{
					var	type = nexacro._getXMLAttributeType(attrStr);
					if (!type)
					{
						arrList.push("N");
						_rtype = 1;
					}
					else
					{
						typeChar = type.charAt(0);
						if (typeChar ==	'I'	|| typeChar	== 'i')
						{
							arrList.push("I");
							_rtype = 2;
						}
						else if	(typeChar == 'U' ||	typeChar ==	'u')
						{
							arrList.push("U");
							_rtype = 4;
						}
						else if	(typeChar == 'D' ||	typeChar ==	'd')
						{
							arrList.push("D");
							_rtype = 8;
						}
						else
						{
							arrList.push("N");
							_rtype = 1;
						}
					}
				}
				else
				{
					arrList.push("N");
					_rtype = 1;
				}

				if (_rtype == 4)
				{
					var	orgRowInfo = nexacro._getXMLTagData(rowData, 0,	"<OrgRow>",	"</OrgRow>");
					if (orgRowInfo)
					{
						arrOrgList.push("O");

						rowData	= rowData.substring(0, orgRowInfo[2]) +	rowData.substring(orgRowInfo[3]);

						var	orgData	= orgRowInfo[0];

						var	org_parse_pos =	0;
						function _loadFromXMLStr_colvalue_loop2	()
						{
							var	colInfo	= nexacro._getXMLTagData2(orgData, org_parse_pos, "<Col	", "</Col>");
							if (colInfo	== null)
							{
								// undefined값 처리(column	정보가	없을경우)
								for(var	i =	arrOrgList.length; i < oJsonDs.ds_colinfo.column.length; i++)
								{
									//arrOrgList.push(_pJSONAdp._undefined);
									arrOrgList.push();
								}
								return true;
							}

							org_parse_pos =	colInfo[3];
							var	attrStr	= colInfo[1];

							var	id = nexacro._getXMLAttributeID(attrStr);

							// undefined값 처리(column	정보가	없을경우)
							for(var	i =	arrOrgList.length; i < oJsonDs.ds_colinfo.column.length; i++)
							{
								if(oJsonDs.ds_colinfo.column[i][0] != id)
								{
									//arrOrgList.push(_pJSONAdp._undefined);
									arrOrgList.push();
								}
								else
								{
									i =	oJsonDs.ds_colinfo.column.length;
								}
							}

							if(colInfo[0] == "")
							{
								//arrOrgList.push(_pJSONAdp._null);
								arrOrgList.push();
							}
							else
							{
								arrOrgList.push(colInfo[0]);
							}

							return false;
						}

						while (true)
						{
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
							if (_loadFromXMLStr_colvalue_loop2()) break;
						}
					}
				}
				else
				{
					for	(var i = 0;	i <	colCnt;	i++)
					{
						arrOrgList.push();
					}
				}

				var	row_parse_pos =	0;
				function _loadFromXMLStr_colvalue_loop ()
				{
					if (rowData)
					{
						var	colInfo	= nexacro._getXMLTagData2(rowData, row_parse_pos, "<Col	", "</Col>");

						if (colInfo	== null)
						{
							// undefined값 처리(column	정보가	없을경우)
							for(var	i =	arrList.length;	i <	oJsonDs.ds_colinfo.column.length; i++)
							{
								//arrList.push(_pJSONAdp._undefined);
								arrList.push(null);
							}
							return true;
						}

						row_parse_pos =	colInfo[3];
						var	attrStr	= colInfo[1];

						var	id = nexacro._getXMLAttributeID(attrStr);

						// undefined값 처리(column	정보가	없을경우)
						for(var	i =	arrList.length;	i <	oJsonDs.ds_colinfo.column.length; i++)
						{
							if(oJsonDs.ds_colinfo.column[i][0] != id)
							{
								//arrList.push(_pJSONAdp._undefined);
								arrList.push(null);
							}
							else
							{
								i =	oJsonDs.ds_colinfo.column.length;
							}
						}

						if(colInfo[0] == "")
						{
							//arrList.push(_pJSONAdp._null);
							arrList.push(null);
						}
						else
						{
							arrList.push(colInfo[0]);
						}

						return false;
					}
					return true;
				}

				while (true)
				{
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
					if (_loadFromXMLStr_colvalue_loop()) break;
				}

				oJsonDs.ds_rows.row.push(arrList);
				oJsonDs.ds_rows.orgrow.push(arrOrgList);
				arrList	= [];
				arrOrgList = [];

				rowData	= null;
				attrStr	= null;
				rowInfo	= null;

				return false;
			}

			while (true)
			{
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
				if (_loadFromXMLStr_row_loop())	break;
			}
		}

		return xml_parse_pos;
	};


	/*----------------------------------------------------------------------------
	// Get Error XML
	-----------------------------------------------------------------------------*/
	_pJSONAdp.getErrorXMLMsg = function	(cd,msg)
	{
		var	outData	 = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
			outData	+= "<Root xmlns=\"http://www.tobesoft.com/platform/dataset\" ver=\"5000\">";
			outData	+= "<Parameters>";
			outData	+= "		<Parameter id=\"ErrorCode\"	type=\"string\">"+cd+"</Parameter>";
			outData	+= "		<Parameter id=\"ErrorMsg\" type=\"string\">" + msg;
			outData	+= "</Parameter>";
			outData	+= "	</Parameters>";
			outData	+= "</Root>";

			return outData;
	};
	_pJSONAdp.getUsingProtocol = function (url)
	{
		return "http";
	};
	_pJSONAdp.getCommunicationHeaders =	function (url)
	{
	};
	_pJSONAdp.initialize = function	()
	{
	};
	_pJSONAdp.finalize = function ()
	{
	};
	delete _pJSONAdp;
}
