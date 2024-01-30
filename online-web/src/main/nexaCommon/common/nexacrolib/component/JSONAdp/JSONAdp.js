
//----------------------------------------------------------------------------------------
if (!nexacro.JSONAdp)
{
	var nexacro_JSONAdp_protocol = "http";
    //==============================================================================
    // anysign adaptor 시작
    //==============================================================================
    nexacro.JSONAdp  = function ()
    {
    };

    var _pJSONAdp = nexacro._createPrototype(nexacro.ProtocolAdp, nexacro.JSONAdp);
    nexacro.JSONAdp.prototype = _pJSONAdp;

    _pJSONAdp._type         = "JSONAdp";
    _pJSONAdp._type_name    = "JSONAdp";
    _pJSONAdp._undefined    = String.fromCharCode(3);
    //_pJSONAdp._null         = String.fromCharCode(29);
    _pJSONAdp._es_          = String.fromCharCode(10);
    _pJSONAdp._rs_          = String.fromCharCode(30);
    _pJSONAdp._cs_          = String.fromCharCode(31);


    //-------------------------------------------------------------------------------------
    // [46604] [신규] 추가 Adaptor 에서 Content-Type을 설정할 수 있는 기능 필요
    //-------------------------------------------------------------------------------------
    _pJSONAdp._httpheaders = [];

    _pJSONAdp.version = function ()
    {
        return "1.1";
    };

    _pJSONAdp.getHTTPHeader = function ()
    {
        this._httpheaders = [];
        this._httpheaders.push({ id: "X-Requested-With", value: "XMLHttpRequest"});
        this._httpheaders.push({ id: "Accept", value: "application/json, text/json, */*"});
        this._httpheaders.push({ id: "Content-Type", value: "application/json"});

        return this._httpheaders;
    };

    /*----------------------------------------------------------------------------
    // Encrypt
    -----------------------------------------------------------------------------*/
    _pJSONAdp.encrypt = function(url, data, anysigndata)
    {
        //trace("_pJSONAdp.encrypt");

        var objDate = new Date();
        //trace("_pJSONAdp.encrypt start = "+ objDate.getHours() + " : " + objDate.getMinutes() + " : " + objDate.getSeconds() + " : " + objDate.getMilliseconds());

        var strRecvData = data.trim();
        var fstr = strRecvData.substring(0, 3);
        var strJSONData = "";

        if(data.indexOf("SSV:") >= 0)
        {
            // SSV
            strJSONData = this.__deserializeSSV(data);
        }
        else
        {
            // XML
            strJSONData = this.__deserializeXML(data);
        }

        strJSONData = strJSONData.split("\\\\n").join("\\n").split("\\\\r").join("\\r").split("\\\\t").join("\\t");

        objDate = new Date();
        //trace("_pJSONAdp.encrypt end = "+ objDate.getHours() + " : " + objDate.getMinutes() + " : " + objDate.getSeconds() + " : " + objDate.getMilliseconds());
        //trace(strJSONData);

        return strJSONData;
    };

    /*----------------------------------------------------------------------------
    // Decrypt
    -----------------------------------------------------------------------------*/
    _pJSONAdp.decrypt = function (url, data, item, cookie, last_modified)
    {
        //trace("_pJSONAdp.decrypt");

        var objDate = new Date();
        //trace("_pJSONAdp.decrypt start = "+ objDate.getHours() + " : " + objDate.getMinutes() + " : " + objDate.getSeconds() + " : " + objDate.getMilliseconds());

        var oJsonData = JSON.parse(data);

        objDate = new Date();
        //trace("JSON parse end = "+ objDate.getHours() + " : " + objDate.getMinutes() + " : " + objDate.getSeconds() + " : " + objDate.getMilliseconds());

        var ssvData = "SSV:" + oJsonData.codepage + _pJSONAdp._rs_;

        // Parameters
        var arrObj = oJsonData.parameters;
        var arrKey = _pJSONAdp.getKeys(arrObj);
        if(arrKey)
        {
            for(var i = 0; i < arrKey.length; i++)
            {
                ssvData += arrKey[i] + "=" + arrObj[arrKey[i]] + _pJSONAdp._rs_;
            }
        }

        if(oJsonData.datasets)
        {
            for(var i = 0; i < oJsonData.datasets.length; i++)
            {
                var dataset = oJsonData.datasets[i];

                ssvData += "Dataset:" + dataset.ds_id + _pJSONAdp._rs_;

                // ConstColumn
                ssvData += "_Const_" + _pJSONAdp._cs_;

                arrObj = dataset.ds_colinfo.constcolumn;
                arrKey = _pJSONAdp.getKeys(arrObj);
                if(arrKey)
                {
                    for(var j = 0; j < arrKey.length; j++)
                    {
                        ssvData += _pJSONAdp._cs_ + arrKey[j] + "=" + arrObj[arrKey[j]];
                    }
                    ssvData += _pJSONAdp._rs_;
                }

                // Column
                var column = dataset.ds_colinfo.column;
                for(var j = 0; j < column.length; j++)
                {
                    var cols = column[j];
                    if(j == 0)
                    {
                        if(cols.id == "_RowType_")
                        {
                            ssvData += cols.id;
                        }
                        else
                        {
                            ssvData += "_RowType_";
                            ssvData += _pJSONAdp._cs_ + cols.id+ ":" + cols.type + "(" + cols.size +")";
                        }
                    }
                    else
                    {
                        ssvData += _pJSONAdp._cs_ + cols.id+ ":" + cols.type + "(" + cols.size +")";
                    }
                }
                ssvData += _pJSONAdp._rs_;

                // Rows
                var row = dataset.ds_rows.row;
                for(var j = 0; j < row.length; j++)
                {
                    var recode = row[j];

                    if(column[0].id == "_RowType_")
                    {
                        ssvData += "N";
                        var nCol = 1;
                    }
                    else
                    {
                        ssvData += "N";
                        var nCol = 0;
                    }
                    
                    for(; nCol < column.length; nCol++)
                    {
                        var colid = column[nCol].id;
                        
                        if(colid == "_RowType_") continue;
                        
                        if(recode[colid] == null)
                        {
                            ssvData += _pJSONAdp._cs_ + "";
                        }
                        else
                        {
                            ssvData += _pJSONAdp._cs_ + recode[colid];
                        }
                        
                        if(url == "JSONAdp://localhost:8080/ct/sc/lm/CTSCLM_MssageRegM/saveGroupMssageList") {
                          //trace("date==== " + colid + " : "  + recode[colid]);
                          //trace("ssvData===  " + ssvData);
                        } 
                    }
                    ssvData += _pJSONAdp._rs_;
                }
                ssvData += _pJSONAdp._rs_;
            }
        }

        objDate = new Date();
        //trace("_pJSONAdp.decrypt end = "+ objDate.getHours() + " : " + objDate.getMinutes() + " : " + objDate.getSeconds() + " : " + objDate.getMilliseconds());

        return ssvData;
    };


    /*----------------------------------------------------------------------------
    // deserialize : array push
    -----------------------------------------------------------------------------*/
    _pJSONAdp.addArrayForJson = function()
    {
        var arg = this.addArrayForJson.arguments;
        arr = [];
        var nSize = arg[1] + 2;
        for(var i = 2;i < nSize; i++)
        {
            arr.push(arg[i]);
        }
        return arr;
    };
    /*----------------------------------------------------------------------------
    // deserialize : dataset format json
    -----------------------------------------------------------------------------*/
    _pJSONAdp.__makeJSONDataset = function ()
    {
        var o = new Object();
        o = {
                ds_id       : "" ,
                ds_colinfo  :   {
                                    constcolumn : {},
                                    column      : []
                                } ,
                ds_rows     :   {
                                    row : [] ,
                                    orgrow  : []
                                }
           };
        return o;
    };
    /*----------------------------------------------------------------------------
    // deserialize : ssv
    -----------------------------------------------------------------------------*/
    _pJSONAdp.__deserializeSSV = function (strInData)
    {
        if (strInData == undefined || strInData == null || strInData == "")
        {
            return "";
        }

        var oJsonData = {
                            datatype    : "JSON"    ,
                            codepage    : "utf-8"   ,
                            parameters  : {},
                            datasets    : []
                        };

        var strParam = "";
        var strConstCol = "";
        var arrColList = [];
        var strRowData = "";
        var arrRowList = [];
        var arrOrgRowList = [];

        var ssvLines = strInData.split(_pJSONAdp._rs_);
        var lineCnt = ssvLines.length;
        var curIdx = 0;
        curIdx++;       // SSV:utf-8 은 fix

        var dsname = "";
        var nDsCnt = 0;
        var typeFlag = "";
        var curStr;
        var paramStr,varInfo,val,type,size;
        var sep_pos,pos1,pos2;

        for (; curIdx < lineCnt; curIdx++)
        {
            curStr = ssvLines[curIdx];
            if (curStr.substring(0, 7) != "Dataset")
            {
                var paramArr = curStr.split(_pJSONAdp._cs_);
                var paramCnt = paramArr.length;

                // parameters start
                if(dsname == "")
                {
                    if(paramArr[0])
                    {
                        if((pos1 = (paramArr[0].indexOf("=")))>=0)
                        {
                            var pName = paramArr[0].substring(0,pos1);
                            var pValue = paramArr[0].substring(pos1+1);
                            pValue = _pJSONAdp.replaceJsonEscape(pValue);
                            strParam += nexacro.wrapQuote(pName)+":"+nexacro.wrapQuote(pValue)+",";
                        }
                    }
                    continue;
                }
                if(strParam.length > 0)
                {
                    strParam = "{"+strParam.substr(0,strParam.length-1)+"}";
                    oJsonData.parameters = JSON.parse(strParam);
                    strParam = "";
                }
                // parameters end

                // Row(OrgRow) Data start
                if(typeFlag == "DATA")
                {
                    if(strRowData.length > 0)
                    {
                        strRowData = "{"+strRowData.substr(0,strRowData.length-1)+"}";
                        var oRowData = JSON.parse(strRowData);
                        strRowData = "";

                        // ORIGINAL DATA
                        if(oRowData && oRowData._RowType_ == "O")
                        {
                            arrOrgRowList.pop();
                            arrOrgRowList.push(oRowData);
                        }
                        else
                        {
                            arrRowList.push(oRowData);
                            arrOrgRowList.push({});
                        }
                    }
                    if(paramCnt == 1)
                    {   // 마지막 빈 row가 한두개 들어오네..
                        if( paramArr[0] == undefined || paramArr[0] == null || paramArr[0] == "") continue;
                    }
                }
                // Row(OrgRow) Data end

                // Dataset start
                for (var i = 0; i < paramCnt; i++)
                {
                    paramStr = paramArr[i];
                    varInfo = paramStr;
                    val = undefined;
                    if(i==0)
                    {
                        if(paramStr == "_Const_") typeFlag = "CONST";
                        else if(paramStr == "_RowType_") typeFlag = "COLUMN";
                        else if(paramStr.length > 0) typeFlag = "DATA";
                        else typeFlag = "";

                        if(typeFlag == "CONST") continue;
                    }

                    // CONST Column
                    if(typeFlag == "CONST")
                    {
                        if(paramStr)
                        {
                            sep_pos = paramStr.indexOf("=");
                            if (sep_pos >= 0)
                            {
                                varInfo = paramStr.substring(0, sep_pos);
                                val = paramStr.substring(sep_pos + 1);
                                val = _pJSONAdp.replaceJsonEscape(val);
                                strConstCol += nexacro.wrapQuote(varInfo)+":"+nexacro.wrapQuote(val)+",";
                            }
                        }
                    }

                    // Column Info
                    else if(typeFlag == "COLUMN")
                    {
                        // Column0:STRING(256)
                        var oColumn = {
                            id      : "",
                            type    : "",
                            size    : ""
                        }

                        sep_pos = paramStr.indexOf(":");
                        if (sep_pos >= 0)
                        {
                            varInfo = paramStr.substring(0, sep_pos);
                            pos1 = paramStr.indexOf("(");
                            pos2 = paramStr.indexOf(")");
                            val = paramStr.substring(sep_pos + 1,pos1);
                            type = paramStr.substring(sep_pos + 1,pos1);
                            size = paramStr.substring(pos1+1,pos2);

                            oColumn.id      = varInfo;
                            oColumn.type    = type;
                            oColumn.size    = size;

                        }
                        // _RowType_
                        else
                        {
                            oColumn.id      = paramStr;
                            oColumn.type    = "STRING";
                            oColumn.size    = "1";
                        }

                        arrColList.push(oColumn);
                    }
                    // Row Data String
                    else
                    {
                        var oColInfo = arrColList[i];

                        if(oColInfo)
                        {
                            // SSV 는 null, blank, undefined 중 undefined만 구분할 수 있음
                            // XML 과 동일한 값으로 전달하기 위해서는 위 세개의 값을 blank 값으로 처리해야함.
                            if(paramStr == _pJSONAdp._undefined)
                            {
                                strRowData += nexacro.wrapQuote(oColInfo.id)+":"+nexacro.wrapQuote("")+",";
                            }
                            else
                            {
                                paramStr = _pJSONAdp.replaceJsonEscape(paramStr);
                                strRowData += nexacro.wrapQuote(oColInfo.id)+":"+nexacro.wrapQuote(paramStr)+",";
                            }
                        }
                    }
                }
                // Dataset end
            }
            else
            {
                if(nDsCnt > 0)
                {
                    // dataset을 한번이라도 처리한 경우 추가
                    var oJsonDataset = this.__makeJSONDataset();
                    oJsonDataset.ds_id = dsname;

                    strConstCol = "{"+strConstCol.substr(0,strConstCol.length-1)+"}";
                    oJsonDataset.ds_colinfo.constcolumn = JSON.parse(strConstCol);
                    strConstCol = "";

                    oJsonDataset.ds_colinfo.column = arrColList;
                    oJsonDataset.ds_rows.row = arrRowList;
                    oJsonDataset.ds_rows.orgrow = arrOrgRowList;

                    oJsonData.datasets.push(oJsonDataset);

                    strParam        = "";
                    strConstCol     = "";
                    arrColList      = [];
                    strRowData      = "";
                    arrRowList      = [];
                    arrOrgRowList   = [];
                    typeFlag        = "";
                }
                dsname = curStr.substring(8,curStr.length);
                nDsCnt++;
            }
        }

        // 처리되지 않은 데이터 추가
        if(dsname != "")
        {
            var oJsonDataset = this.__makeJSONDataset();
            oJsonDataset.ds_id = dsname;

            strConstCol = "{"+strConstCol.substr(0,strConstCol.length-1)+"}";
            oJsonDataset.ds_colinfo.constcolumn = JSON.parse(strConstCol);
            strConstCol = "";

            oJsonDataset.ds_colinfo.column = arrColList;
            oJsonDataset.ds_rows.row = arrRowList;
            oJsonDataset.ds_rows.orgrow = arrOrgRowList;

            oJsonData.datasets.push(oJsonDataset);

            strParam        = "";
            strConstCol     = "";
            arrColList      = [];
            strRowData      = "";
            arrRowList      = [];
            arrOrgRowList   = [];
            typeFlag        = "";
        }

        var strJSON = JSON.stringify(oJsonData);
        //strJSON = strJSON.replace(/"\\u0003"/g,undefined);    // undefined
        //strJSON = strJSON.replace(/"\\u001d"/g,"");           // null
        oJsonData = null;

        return strJSON;
    };

    /*----------------------------------------------------------------------------
    // deserialize : xml
    -----------------------------------------------------------------------------*/
    _pJSONAdp.__deserializeXML = function (strRecvData, doc)
    {
        if (strRecvData == undefined || strRecvData == null || strRecvData == "")
        {
            return "";
        }

        var fstr = strRecvData.substr(0, 10).toLowerCase();
        if (fstr.indexOf("<?xml") < 0)
        {
            trace("invalid nexacro communication format");
            return "";
        }

        var oJsonData = {
                            datatype    : "JSON"    ,
                            codepage    : "utf-8"   ,
                            parameters  : {},
                            datasets    : []
                        };

        var strParam = "";
        var arrConstColList = [];
        var arrColList = [];
        var arrRowList = [];
        var arrList = [];

        var xml_parse_pos = strRecvData.indexOf("<Dataset ");
        var headerData;
        if (xml_parse_pos > -1)
        {
            headerData = strRecvData.substring(0, xml_parse_pos);
        }
        else
        {
            headerData = strRecvData;
        }

        var head_parse_pos = 0;

        // parameters
        var paramsInfo = nexacro._getXMLTagData(headerData, head_parse_pos, "<Parameters>", "</Parameters>");
        if (paramsInfo)
        {
            var paramsData = paramsInfo[0];
            head_parse_pos = paramsInfo[3];

            var param_parse_pos = 0;
            var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");

            while (varInfo)
            {
                param_parse_pos = varInfo[3];
                var attrStr = varInfo[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                if (id && id.length)
                {
                    var val = varInfo[0];
                    val = _pJSONAdp.replaceJsonEscape(val);
                    if(val) val = nexacro._decodeXml(val);
                    //else val = _pJSONAdp._null;

                    strParam += nexacro.wrapQuote(id)+":"+nexacro.wrapQuote(val)+",";
                }
                varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            }

            strParam = "{"+strParam.substr(0,strParam.length-1)+"}";
            oJsonData.parameters = JSON.parse(strParam);
            strParam = "";
        }

        // dataset info
        if (xml_parse_pos >= -1)
        {
            var datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");

            while (datasetInfo)
            {
                xml_parse_pos = datasetInfo[3];
                var attrStr = datasetInfo[1];
                var remoteId = nexacro._getXMLAttributeID(attrStr);

                if (remoteId && remoteId.length)
                {
                    var oJsonDataset = this.__makeJSONDataset();
                    oJsonDataset.ds_id = remoteId;
                    this._loadFromXMLStr(oJsonDataset,datasetInfo[0],0,-1);
                    oJsonData.datasets.push(oJsonDataset);
                }
                datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            }
        }
        dsIds = null;
        //return [[code, message], parameters, datasets];
        var strJSON = JSON.stringify(oJsonData);
        //strJSON = strJSON.replace(/"\\u0003"/g,undefined);    // undefined
        //strJSON = strJSON.replace(/"\\u001d"/g,"");           // null
        oJsonData = null;

        return strJSON;
    };
    /*----------------------------------------------------------------------------
    // deserialize : xml
    -----------------------------------------------------------------------------*/
    _pJSONAdp._loadFromXMLStr = function (oJsonDs, xmlStr, xml_parse_pos)
    {
        var loadstatus = true;
        if (!xml_parse_pos)
        {
            xml_parse_pos = 0;
        }

        if (xml_parse_pos <= 0)
        {
            xml_parse_pos = this._setColInfoFromXMLStr(oJsonDs,xmlStr);
            xml_parse_pos = xmlStr.indexOf("<Rows>", xml_parse_pos);
            if (xml_parse_pos > -1)
            {
                xml_parse_pos += 6;
            }
        }

        if (xml_parse_pos > -1)
        {
            xml_parse_pos = this._loadRecordFromXMLStr(oJsonDs,xmlStr, xml_parse_pos);
        }

        return xml_parse_pos;
    };
    /*----------------------------------------------------------------------------
    // deserialize : xml - column info
    -----------------------------------------------------------------------------*/
    _pJSONAdp._setColInfoFromXMLStr = function (oJsonDs,xmlStr)
    {
        var arrConstColList = [];
        var arrColList = [];
        var xml_parse_pos = 0;
        var colInfo = nexacro._getXMLTagData(xmlStr, xml_parse_pos, "<ColumnInfo>", "</ColumnInfo>");
        if (colInfo)
        {
            xml_parse_pos = colInfo[3];
            var colinfoData = colInfo[0];

            // CONST Column
            var strConstCol = "";
            var const_parse_pos = 0;
            function _loadFromXMLStr_const_loop (pThis,oJson,arrCol)
            {
                var constVar = nexacro._getXMLTagData4(colinfoData, const_parse_pos, "<ConstColumn ");
                if (constVar == null)
                {
                    return true;
                }

                const_parse_pos = constVar[3];
                var attrStr = constVar[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                var value = nexacro._getXMLAttributeData(attrStr, "value");
                if (id.length)
                {
                    value = _pJSONAdp.replaceJsonEscape(value);
                    if(value) value = nexacro._decodeXml(value);
                    else value = "";

                    // constcolumn 은 xml 전문에 size / type 이 없음
                    strConstCol += nexacro.wrapQuote(id)+":"+nexacro.wrapQuote(value)+",";

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
            // JSON 객체에 CONST DATA WRITE
            strConstCol = "{"+strConstCol.substr(0,strConstCol.length-1)+"}";
            oJsonDs.ds_colinfo.constcolumn = JSON.parse(strConstCol);

            // Column Info
            // Column0:STRING(256)
            var oColumn = {
                id      : "",
                type    : "",
                size    : ""
            }

            // _RowType_
            oColumn.id      = "_RowType_";
            oColumn.type    = "STRING";
            oColumn.size    = "1";
            arrColList.push(oColumn);

            var colinfo_parse_pos = 0;
            function _loadFromXMLStr_col_loop (pThis,oJson,arrCol)
            {
                var colInfo = nexacro._getXMLTagData4(colinfoData, colinfo_parse_pos, "<Column ");
                if (colInfo == null)
                {
                    return true;
                }
                colinfo_parse_pos = colInfo[3];
                var attrStr = colInfo[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                if (id && id.length)
                {
                    var type = nexacro._getXMLAttributeType(attrStr);
                    var size = nexacro._getXMLAttributeData(attrStr, "size");

                    var oColumn = {
                        id      : "",
                        type    : "",
                        size    : ""
                    }
                    oColumn.id      = id;
                    oColumn.type    = type;
                    oColumn.size    = size;
                    arrColList.push(oColumn);
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

            // JSON 객체에 CONST DATA WRITE
            oJsonDs.ds_colinfo.column = arrColList;
        }

        return xml_parse_pos;
    };
    /*----------------------------------------------------------------------------
    // deserialize : xml - row
    -----------------------------------------------------------------------------*/
    _pJSONAdp._loadRecordFromXMLStr = function (oJsonDs, xmlStr, xml_parse_pos)
    {
        var colCnt = oJsonDs.ds_colinfo.column.length;
        var arrColList = oJsonDs.ds_colinfo.column;
        var arrRowList = [];
        var arrOrgRowList = [];

        if (xml_parse_pos > -1)
        {
            var strRowData = "";

            function _loadFromXMLStr_row_loop (pThis,oJson,arrCol)
            {
                var rowData;
                var attrStr;
                var rowInfo = nexacro._getXMLTagData3(xmlStr, xml_parse_pos, "<Row", "</Row>");
                if (rowInfo == null)
                {
                    return true;
                }
                xml_parse_pos = rowInfo[3];
                rowData = rowInfo[0];
                attrStr = rowInfo[1];

                var arrList = [];
                var arrOrgList = [];

                var _rtype = -1;

                var typeChar = "";

                if (attrStr)
                {
                    var type = nexacro._getXMLAttributeType(attrStr);
                    if (!type)
                    {
                        strRowData += nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("N")+",";
                        _rtype = 1;
                    }
                    else
                    {
                        typeChar = type.charAt(0);
                        if (typeChar == 'I' || typeChar == 'i')
                        {
                            arrList.push(nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("I"));
                            _rtype = 2;
                        }
                        else if (typeChar == 'U' || typeChar == 'u')
                        {
                            arrList.push(nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("U"));
                            _rtype = 4;
                        }
                        else if (typeChar == 'D' || typeChar == 'd')
                        {
                            arrList.push(nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("D"));
                            _rtype = 8;
                        }
                        else
                        {
                            arrList.push(nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("N"));
                            _rtype = 1;
                        }
                    }
                }
                else
                {
                    arrList.push(nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("N"));
                    _rtype = 1;
                }

                if (_rtype == 4)
                {
                    var orgRowInfo = nexacro._getXMLTagData(rowData, 0, "<OrgRow>", "</OrgRow>");
                    if (orgRowInfo)
                    {
                        arrOrgList.push(nexacro.wrapQuote("_RowType_")+":"+nexacro.wrapQuote("O"));

                        rowData = rowData.substring(0, orgRowInfo[2]) + rowData.substring(orgRowInfo[3]);

                        var orgData = orgRowInfo[0];

                        var org_parse_pos = 0;
                        function _loadFromXMLStr_colvalue_loop2 ()
                        {
                            var colInfo = nexacro._getXMLTagData2(orgData, org_parse_pos, "<Col ", "</Col>");
                            if (colInfo == null)
                            {
                                // undefined값 처리(column 정보가 없을경우)
                                for(var i = arrOrgList.length; i < oJsonDs.ds_colinfo.column.length; i++)
                                {
                                    arrOrgList.push(nexacro.wrapQuote(oJsonDs.ds_colinfo.column[i].id)+":"+nexacro.wrapQuote(""));
                                }
                                return true;
                            }

                            org_parse_pos = colInfo[3];
                            var attrStr = colInfo[1];

                            var id = nexacro._getXMLAttributeID(attrStr);
                            // undefined값 처리(column 정보가 없을경우)
                            for(var i = arrOrgList.length; i < oJsonDs.ds_colinfo.column.length; i++)
                            {
                                if(oJsonDs.ds_colinfo.column[i].id != id)
                                {
                                    arrOrgList.push(nexacro.wrapQuote(oJsonDs.ds_colinfo.column[i].id)+":"+nexacro.wrapQuote(""));
                                }
                                else
                                {
                                    i = oJsonDs.ds_colinfo.column.length;
                                }
                            }

                            if(colInfo[0] == "")
                            {
                                arrOrgList.push(nexacro.wrapQuote(id)+":"+nexacro.wrapQuote(""));
                            }
                            else
                            {
                                colInfo[0] = _pJSONAdp.replaceJsonEscape(colInfo[0]);
                                arrOrgList.push(nexacro.wrapQuote(id)+":"+nexacro.wrapQuote(nexacro._decodeXml(colInfo[0])));
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
                    for (var i = 0; i < colCnt; i++)
                    {
                        arrOrgList.push();
                    }
                }

                var row_parse_pos = 0;
                function _loadFromXMLStr_colvalue_loop ()
                {
                    if (rowData)
                    {
                        var colInfo = nexacro._getXMLTagData2(rowData, row_parse_pos, "<Col ", "</Col>");

                        if (colInfo == null)
                        {
                            // undefined값 처리(column 정보가 없을경우)
                            for(var i = arrList.length; i < oJsonDs.ds_colinfo.column.length; i++)
                            {
                                arrList.push(nexacro.wrapQuote(oJsonDs.ds_colinfo.column[i].id)+":"+nexacro.wrapQuote(""));
                            }
                            return true;
                        }

                        row_parse_pos = colInfo[3];
                        var attrStr = colInfo[1];

                        var id = nexacro._getXMLAttributeID(attrStr);

                        // undefined값 처리(column 정보가 없을경우)
                        for(var i = arrList.length; i < oJsonDs.ds_colinfo.column.length; i++)
                        {
                            if(oJsonDs.ds_colinfo.column[i].id != id)
                            {
                                arrList.push(nexacro.wrapQuote(oJsonDs.ds_colinfo.column[i].id)+":"+nexacro.wrapQuote(""));
                            }
                            else
                            {
                                i = oJsonDs.ds_colinfo.column.length;
                            }
                        }

                        if(colInfo[0] == "")
                        {
                            arrList.push(nexacro.wrapQuote(id)+":"+nexacro.wrapQuote(""));
                        }
                        else
                        {
                            colInfo[0] = _pJSONAdp.replaceJsonEscape(colInfo[0]);
                            arrList.push(nexacro.wrapQuote(id)+":"+nexacro.wrapQuote(nexacro._decodeXml(colInfo[0])));
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

                arrRowList.push(JSON.parse("{"+arrList.toString()+"}"));
                arrOrgRowList.push(JSON.parse("{"+arrOrgList.toString()+"}"));
                arrList = [];
                arrOrgList = [];

                rowData = null;
                attrStr = null;
                rowInfo = null;

                return false;
            }

            while (true)
            {
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
                if (_loadFromXMLStr_row_loop()) break;
            }

            oJsonDs.ds_rows.row = arrRowList;
            oJsonDs.ds_rows.orgrow = arrOrgRowList;
        }

        return xml_parse_pos;
    };

    _pJSONAdp.replaceJsonEscape = function(str)
    {
        if(str)
            return str.split(/\n/g).join("\\n").split(/\r/g).join("\\r").split(/\t/g).join("\\t").split("&#9;").join("\\t").split("&#10;").join("\\n");
        else
            return str;
    }

    _pJSONAdp.getKeys = function(arrObj)
    {
        arrKey = [];
        if(nexacro.Browser == "IE" && nexacro.BrowserVersion <= 8)
        {
            for(var key in arrObj)
            {
                if(arrObj.hasOwnProperty(key))
                {
                    arrKey.push(key);
                }
            }
        }
        else
        {
            arrKey = Object.keys(arrObj);
        }

        return arrKey;
    }

    /*----------------------------------------------------------------------------
    // Get Error XML
    -----------------------------------------------------------------------------*/
    _pJSONAdp.getErrorXMLMsg = function (cd,msg)
    {
        var outData  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
            outData += "<Root xmlns=\"http://www.tobesoft.com/platform/dataset\" ver=\"5000\">";
            outData += "    <Parameters>";
            outData += "        <Parameter id=\"ErrorCode\" type=\"string\">"+cd+"</Parameter>";
            outData += "        <Parameter id=\"ErrorMsg\" type=\"string\">"+msg+"</Parameter>";
            outData += "    </Parameters>";
            outData += "</Root>";

            return outData;
    };
    nexacro.JSONAdp.setUsingProtocol = function (v)
    {
		if(v == "http" || v == "https")
		{
			nexacro_JSONAdp_protocol = v;
		}
    };
    _pJSONAdp.getUsingProtocol = function (url)
    {
		return nexacro_JSONAdp_protocol;
    };
    _pJSONAdp.getCommunicationHeaders = function (url)
    {
    };
    _pJSONAdp.initialize = function ()
    {
    };
    _pJSONAdp.finalize = function ()
    {
    };
    delete _pJSONAdp;
}
