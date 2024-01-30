package com.safecnc.system.AAAA.AAAA0050;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AAAA.AAAA0050.service.AAAA0050Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : </h1>
<p>공통팝업관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/

@Slf4j
@Controller
public class AAAA0050Controller implements AbstractController, OpenApiTagType.SystemManagement {

    @Resource(name="AAAA0050Service")
    private AAAA0050Service service;

    /**
     * 화면그룹관리 조회
     */
    @Transactional
    @Operation(summary = "(공통팝업관리)공통팝업 조회")
    @PostMapping(value="/AAAA0050/SEL00.nx")
    public NexacroResult processSEL00(NexacroRequest nexacroRequest) {
    	Map<String, Object> requestParams = nexacroRequest.getMapVariableList();
    	
        return new NexacroResult("dsTA_POPUP", service.SEARCH00(requestParams));
    }

    /**
     * 화면그룹관리 저장
     */
    @Transactional
    @Operation(summary = "(공통팝업관리)공통팝업 저장")
    @PostMapping(value="/AAAA0050/SAV00.nx")
    public NexacroResult processSAV00(NexacroRequest nexacroRequest) {
        return new NexacroResult(service.SAV00(nexacroRequest));
    }
}