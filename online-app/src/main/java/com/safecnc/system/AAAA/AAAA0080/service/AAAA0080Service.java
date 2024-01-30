package com.safecnc.system.AAAA.AAAA0080.service;

import java.util.List;
import java.util.Map;

import com.safecnc.request.NexacroRequest;

/*******************************************************************
<h1>NAME : 다국어관리</h1>
<p>팝업관리</p>
<h2>DESC : 다국어관리</h2>
<p>다국어관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-20  SHJ              최초생성
</pre>
********************************************************************/
public interface AAAA0080Service {
	
	List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow);
	
	int SAV00(NexacroRequest request);
}
