package com.safecnc.batch.svc;

import java.util.List;
import java.util.Map;

/*******************************************************************
<h1>NAME : ScheduledTasksService</h1>
<p>배치</p>
<h2>DESC : 배치</h2>
<p>배치 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-05-30  jhs              최초생성
</pre>
********************************************************************/
public interface ScheduledTasksService {
	void SAV00(List<Map<String, Object>> saveDatas);
	
	void SAV10(List<Map<String, Object>> saveDatas);	
	
	void SAV20(List<Map<String, Object>> saveDatas);
	
	void SAV30(List<Map<String, Object>> saveDatas);	
	
	/* TC_SAPEMP -> TA_USER_M에 저장 배치 */
	void SAV40();
	
	//- Buyer, Supplier 계정 신규 생성시 발송 메일.
	void NEW_USER_SEND_EMAIL();
	
	

}
