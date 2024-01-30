package com.safecnc.system.AACA.AACA0021;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.system.AACA.AACA0021.service.AACA0021Service;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller("AACA0021Controller")
public class AACA0021Controller implements AbstractController, OpenApiTagType.SystemManagement{

	@Resource(name = "AACA0021Service")
	private AACA0021Service service;
		
	@Transactional
	@Operation(summary = "사용자 저장")
	@PostMapping("/AACA0021/SAV00.nx")
	public NexacroResult SAV00(NexacroRequest request) {
		log.debug("@PostMapping :::: /AACA0021/SAV00.nx");
		return new NexacroResult(service.SAV00(request));
	}
}
