package com.safecnc.system.AAAA.AAAA0100;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import com.safecnc.system.AAAA.AAAA0100.service.AAAA0100Service;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : </h1>
<p>다국어메시지관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-22  SHJ              최초생성
</pre>
********************************************************************/

@Slf4j
@Controller
public class AAAA0100Controller implements AbstractController, OpenApiTagType.SystemManagement {

    @Resource(name="AAAA0100Service")
    private AAAA0100Service service;

    /**
     * 다국어관리 데이터 조회
     */
    @Transactional
    @Operation(summary = "다국어Word 조회")
    @PostMapping(value="/AAAA0100/SEL00.nx")
    public NexacroResult processSEL00(NexacroRequest nexacroRequest) {
    	
    	Map<String, Object> requestParams = nexacroRequest.getMapVariableList();
    	
        return new NexacroResult("dsGrid", service.SEARCH00(requestParams));
    }

    /**
     * 다국어관리 저장
     */
    @Transactional
    @Operation(summary = "다국어Word 저장")
    @PostMapping(value="/AAAA0100/SAV00.nx")
   public NexacroResult processSAV00(NexacroRequest nexacroRequest) {
    	
        return new NexacroResult(service.SAV00(nexacroRequest));
   }
   
 
}