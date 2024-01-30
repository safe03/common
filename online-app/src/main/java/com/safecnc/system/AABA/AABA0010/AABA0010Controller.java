package com.safecnc.system.AABA.AABA0010;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AABA.AABA0010.service.AABA0010Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : </h1>
<p>프로그램정보관리관리</p>
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
public class AABA0010Controller implements AbstractController, OpenApiTagType.SystemManagement {

    @Resource(name="AABA0010Service")
    private AABA0010Service service;

    /**
     * 화면그룹관리 조회
     */
    @Transactional
    @Operation(summary = "(프로그램정보관리)프로그램정보 조회")
    @PostMapping(value="/AABA0010/SEL00.nx")
    public NexacroResult processSEL00(NexacroRequest nexacroRequest) {
    	
    	Map<String, Object> requestParams = nexacroRequest.getMapVariableList();
    	
        return new NexacroResult("dsTA_PROG_M", service.SEARCH00(requestParams));
    }

    /**
     * 화면그룹관리 저장
     */
    @Transactional
    @Operation(summary = "(프로그램정보관리)프로그램정보 저장")
    @PostMapping(value="/AABA0010/SAV00.nx")
    public NexacroResult processSAV00(NexacroRequest nexacroRequest) {
    	
        return new NexacroResult(service.SAV00(nexacroRequest));
    }
}