package com.safecnc.system.AAAA.AAAA0040.service;

import java.util.List;
import java.util.Map;

import com.safecnc.request.NexacroRequest;

/*******************************************************************
<h1>NAME : 콤보관리</h1>
<p>콤보관리</p>
<h2>DESC : 콤보관리</h2>
<p>콤보관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
public interface AAAA0040Service {
	
	List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow);
	
	List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow);
	
	int SAV00(NexacroRequest request);
}
