package com.safecnc.comm.adm.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.comm.adm.service.ADM0030Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : Season Management</h1>
<p>Season Management</p>
<h2>DESC : Season Management</h2>
<p>Season Management 컨트롤러</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-05-30  jks            최초생성
</pre>
********************************************************************/

@Slf4j
@Controller("ADM0030Controller")
public class ADM0030Controller implements AbstractController, OpenApiTagType.AdminManagement {
	@Resource(name = "ADM0030Service")
	private ADM0030Service ADM0030service;

	@Transactional
    @Operation(summary = "Season Management 조회")
	@PostMapping("/ADM0030/SEARCH00.nx")
	public NexacroResult SEL00(NexacroRequest request) {	
		return new NexacroResult("dsSeason", ADM0030service.SEARCH00(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "Season Management 저장")
	@PostMapping("/ADM0030/SAV00.nx")
	public NexacroResult SAV00(NexacroRequest request) {
		
		return new NexacroResult(ADM0030service.SAV00(request));
	}
	
	@Transactional
    @Operation(summary = "BUYER/SEASON 조회")
	@PostMapping("/ADM0030/SEARCH01.nx")
	public NexacroResult SEL01(NexacroRequest request) {	
		Map<String,Object> returnValue = new HashMap<String, Object>();
		
		returnValue.put("dsBuyerCombo", ADM0030service.SEARCH01(request.getMapVariableList(),"1"));
		returnValue.put("dsSeasonCombo", ADM0030service.SEARCH01(request.getMapVariableList(),"2"));
		return new NexacroResult(returnValue);
	}
}
