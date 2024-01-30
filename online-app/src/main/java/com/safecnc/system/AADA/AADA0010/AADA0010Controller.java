package com.safecnc.system.AADA.AADA0010;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AADA.AADA0010.service.AADA0010Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;

/*******************************************************************
<h1>NAME : </h1>
<p>회사그룹권한관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-06-18  이진혁           최초생성
</pre>
********************************************************************/

@Controller
public class AADA0010Controller implements AbstractController, OpenApiTagType.SystemManagement {

    @Resource(name="AADA0010Service")
    private AADA0010Service AADA0010Service;

    @Transactional
    @Operation(summary = "권한 그룹 조회")
    @PostMapping(value="/AADA0010/SEL00.nx")
    public NexacroResult SEL00(NexacroRequest nexacroRequest) {
        return new NexacroResult("dsTM_ATGPXM", AADA0010Service.SEL00(nexacroRequest.getMapVariableList()));
    }

    @Transactional
    @Operation(summary = "부여 권한 리스트 조회")
    @PostMapping(value="/AADA0010/SEL10.nx")
    public NexacroResult SEL10(NexacroRequest nexacroRequest) {
        return new NexacroResult("dsTM_AUTHXM", AADA0010Service.SEL10(nexacroRequest.getMapVariableList()));
    }
    
    @Transactional
    @Operation(summary = "그룹 권한 리스트 저장(등록/수정/삭제) and 부여 권한 리스트 저장(등록/수정)")
    @PostMapping(value="/AADA0010/SAV00.nx")
    public NexacroResult SAV00(NexacroRequest nexacroRequest) {
    	return new NexacroResult(AADA0010Service.SAV00(nexacroRequest));
    }
}