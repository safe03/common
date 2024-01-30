package com.safecnc.comm.adm.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.comm.adm.service.ADM0010Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : UserManagement</h1>
<p>UserManagement</p>
<h2>DESC : UserManagement</h2>
<p>UserManagement 컨트롤러</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-05-11  jks            최초생성
</pre>
********************************************************************/

@Slf4j
@Controller("ADM0010Controller")
public class ADM0010Controller implements AbstractController, OpenApiTagType.AdminManagement {
	@Resource(name = "ADM0010Service")
	private ADM0010Service ADM0010service;

	@Transactional
    @Operation(summary = "UserManagement 조회")
	@PostMapping("/ADM0010/SEARCH00.nx/{dsGUBN}")
	public NexacroResult SEL00(NexacroRequest request, @PathVariable("dsGUBN") String dsGUBN) {	
		return new NexacroResult(dsGUBN, ADM0010service.SEARCH00(request.getMapVariableList()));
	}
	
	@Transactional
	@Operation(summary = "UserManagement 저장")
	@PostMapping("/ADM0010/SAV00.nx/{dsGUBN}")
	public NexacroResult SAV00(NexacroRequest request, @PathVariable("dsGUBN") String dsGUBN) {
		
		return new NexacroResult(ADM0010service.SAV00(request, dsGUBN));
	}
	
	@Transactional
    @Operation(summary = "동인 사용자조회")
	@PostMapping("/ADM0010/SEARCH01.nx/{dsGUBN}")
	public NexacroResult SEL01(NexacroRequest request, @PathVariable("dsGUBN") String dsGUBN) {
		
		return new NexacroResult(dsGUBN, ADM0010service.SEARCH01(request.getMapVariableList()));
	}
	
	@Transactional
    @Operation(summary = "BUYER 조회")
	@PostMapping("/ADM0010/SEARCH02.nx")
	public NexacroResult SEL02(NexacroRequest request) {	
		return new NexacroResult("dsTC_KNA1", ADM0010service.SEARCH02(request.getMapVariableList()));
	}

	@Transactional
    @Operation(summary = "SUPPLIER 조회")
	@PostMapping("/ADM0010/SEARCH03.nx")
	public NexacroResult SEL03(NexacroRequest request) {	
		return new NexacroResult("dsTC_LFA1", ADM0010service.SEARCH03(request.getMapVariableList()));
	}
	
	@Transactional
    @Operation(summary = "BUYER/SUPPLIER combo 조회")
	@PostMapping("/ADM0010/SEARCH04.nx")
	public NexacroResult SEL04(NexacroRequest request) {	
		Map<String,Object> returnValue = new HashMap<String, Object>();
		
		returnValue.put("dsBuyerCombo", ADM0010service.SEARCH04(request.getMapVariableList(),"1"));
		returnValue.put("dsSupplierCombo", ADM0010service.SEARCH04(request.getMapVariableList(),"2"));
		return new NexacroResult(returnValue);
	}	

}
