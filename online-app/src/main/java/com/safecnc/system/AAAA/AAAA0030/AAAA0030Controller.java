package com.safecnc.system.AAAA.AAAA0030;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AAAA.AAAA0030.service.AAAA0030Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : 메시지관리</h1>
<p>메시지관리</p>
<h2>DESC : 메시지관리</h2>
<p>메시지관리 컨트롤러</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Controller("AAAA0030Controller")
public class AAAA0030Controller implements AbstractController, OpenApiTagType.SystemManagement {

	@Resource(name = "AAAA0030Service")
	private AAAA0030Service service;
	
	@Transactional
	@Operation(summary = "(메시지관리)메시지 조회")
	@PostMapping("/AAAA0030/LANG_M_COMBO.nx")
	public NexacroResult LANG_M_COMBO(NexacroRequest request) {	
		
		return new NexacroResult("dsLangCode", service.LANG_M_COMBO());
	}
	
	@Transactional
    @Operation(summary = "(메시지관리)메시지 조회")
	@PostMapping("/AAAA0030/SEARCH00.nx")
	public NexacroResult SEL00(NexacroRequest request) {	
		
		return new NexacroResult("dsTA_MESSAGE", service.SEARCH00(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "(메시지관리)메시지 저장")
	@PostMapping("/AAAA0030/SAV00.nx")
	public NexacroResult SAV00(NexacroRequest request) {
		
		return new NexacroResult(service.SAV00(request));
	}
	
}
