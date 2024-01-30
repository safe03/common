package com.safecnc.comm.cont;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.safecnc.comm.dimn.SapJcoManager;
import com.safecnc.comm.dimn.SapManager.ResultSapJcoManager;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.domain.NexacroTransactionManagerFactory;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;

@Controller
public class CommonController implements AbstractController, OpenApiTagType.CommonManagement {
	
	@Autowired
	private NexacroTransactionManagerFactory nexacroTransactionManagerFactory;
	
	@Operation(summary = "서비스 공통화 처리")
	@PostMapping("/comn/common.nx")
	public NexacroResult common(NexacroRequest nexacroRequest) throws Exception {
		
		try {
			return new NexacroResult(nexacroTransactionManagerFactory.getObject().execute(nexacroRequest));
		}catch(Exception e)
		{
			throw e;
		}
	}
}
