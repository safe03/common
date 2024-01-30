package com.safecnc.system.AAAA.AAAA0090.service;

import java.util.List;
import java.util.Map;

import com.safecnc.request.NexacroRequest;

/*******************************************************************
<h1>NAME : </h1>
<p>다국어 Word 관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-21  SHJ              최초생성
</pre>
********************************************************************/
public interface AAAA0090Service {
	
	List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow);
	
	List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow);
	
	int SAV00(NexacroRequest request);
}
