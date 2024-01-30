package com.safecnc.system.AAAA.AAAA0020;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.system.AAAA.AAAA0020.service.AAAA0020Service;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : 세부코드관리</h1>
<p>세부코드관리</p>
<h2>DESC : 세부코드관리</h2>
<p>세부코드관리 컨트롤러</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Controller("AAAA0020Controller")
public class AAAA0020Controller implements AbstractController, OpenApiTagType.SystemManagement {

	
	@Resource(name = "AAAA0020Service")
	private AAAA0020Service service;
	
	@Transactional
    @Operation(summary = "(세부코드관리)공통코드 조회")
	@PostMapping("/AAAA0020/SEARCH00.nx")
	public NexacroResult SEL00(NexacroRequest request) {	
		
		return new NexacroResult("dsTA_CODE_M", service.SEARCH00(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "(세부코드관리)세부코드 조회")
	@PostMapping("/AAAA0020/SEARCH10.nx")
	public NexacroResult SEL10(NexacroRequest request) {	
		
		return new NexacroResult("dsTA_CODE_D", service.SEARCH10(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "(세부코드관리)세부코드 저장")
	@PostMapping("/AAAA0020/SAV00.nx")
	public NexacroResult SAV00(NexacroRequest request) {
		
		return new NexacroResult(service.SAV00(request));
	}
	
}
