package com.safecnc.system.AABA.AABA0020;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AABA.AABA0020.service.AABA0020Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : 메뉴구조관리</h1>
<p>메뉴구조관리</p>
<h2>DESC : 메뉴구조관리</h2>
<p>메뉴구조관리 컨트롤러</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Controller("AABA0020Controller")
public class AABA0020Controller implements AbstractController, OpenApiTagType.SystemManagement {

	@Resource(name = "AABA0020Service")
	private AABA0020Service service;
	
	@Transactional
    @Operation(summary = "(메뉴구조관리)메뉴구조 트리 조회")
	@PostMapping("/AABA0020/SEL00.nx")
	public NexacroResult SEL00(NexacroRequest request) {	
		
		return new NexacroResult("dsTREE_VIEW", service.SEARCH00(request.getMapVariableList()));
	}

	@Transactional
	@Operation(summary = "(메뉴구조관리)메뉴구조 상세 조회")
	@PostMapping("/AABA0020/SEL10.nx")
	public NexacroResult SEL10(NexacroRequest request) {	
		
		return new NexacroResult("dsVI_MENU", service.SEARCH10(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "(메뉴구조관리)메뉴구조 저장")
	@PostMapping("/AABA0020/SAV00.nx")
	public NexacroResult SAV00(NexacroRequest request) {
		
		return new NexacroResult(service.SAV00(request));
	}
	
}
