package com.safecnc.comm.adm.service;

import java.util.Map;

import com.safecnc.request.NexacroRequest;

public interface ADM0030Service {

	Object SEARCH00(Map<String, Object> mapVariableList);
	
	Object SEARCH01(Map<String, Object> mapVariableList, String Gubn);
	
	int SAV00(NexacroRequest request);
}
