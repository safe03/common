package com.safecnc.system.AAAA.AAAA0040;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AAAA.AAAA0040.service.AAAA0040Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : 콤보관리</h1>
<p>콤보관리</p>
<h2>DESC : 콤보관리</h2>
<p>콤보관리 컨트롤러</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Controller("AAAA0040Controller")
public class AAAA0040Controller implements AbstractController, OpenApiTagType.SystemManagement {

	@Resource(name = "AAAA0040Service")
	private AAAA0040Service service;
	
	@Transactional
    @Operation(summary = "(콤보관리)공통콤보 조회")
	@PostMapping("/AAAA0040/SEARCH00.nx")
	public NexacroResult SEL00(NexacroRequest request) {	
		
		return new NexacroResult("dsTA_COMBO", service.SEARCH00(request.getMapVariableList()));
	}

	@Transactional
	@Operation(summary = "(콤보관리)공통콤보 테스트 조회")
	@PostMapping("/AAAA0040/SEARCH10.nx")
	public NexacroResult SEL10(NexacroRequest request) {	
		
		return new NexacroResult("dsParam", service.SEARCH10(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "(콤보관리)공통콤보 저장")
	@PostMapping("/AAAA0040/SAV00.nx")
	public NexacroResult SAV00(NexacroRequest request) {
		
		return new NexacroResult(service.SAV00(request));
	}
	
}
