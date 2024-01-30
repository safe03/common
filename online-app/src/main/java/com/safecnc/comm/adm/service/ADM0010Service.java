package com.safecnc.comm.adm.service;

import java.util.Map;

import com.safecnc.request.NexacroRequest;

public interface ADM0010Service {

	Object SEARCH00(Map<String, Object> mapVariableList);
	
	Object SEARCH01(Map<String, Object> mapVariableList);
	
	Object SEARCH02(Map<String, Object> mapVariableList);
	
	Object SEARCH03(Map<String, Object> mapVariableList);
	
	Object SEARCH04(Map<String, Object> mapVariableList, String GUBN);
	
	int SAV00(NexacroRequest request, String dsGUBN);
}
