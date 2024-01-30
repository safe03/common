package com.safecnc.comm.cont;

import com.safecnc.comm.srvc.ComLoginService;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/*******************************************************************
<h1>NAME : </h1>
<p>로그인 처리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
9999999999                   최초생성
</pre>
********************************************************************/

@Slf4j
@Controller
public class ComLoginController implements AbstractController, OpenApiTagType.CommonLogin {

    @Resource(name="ComLoginService")
    private ComLoginService service;

	@Operation(summary = "언어 조회 처리")
	@PostMapping("/comn/common_locale.nx")
	public NexacroResult locale(NexacroRequest nexacroRequest) throws Exception {
		
		return new NexacroResult("dsLocale", service.locale(nexacroRequest.getMapVariableList()));
	}

    @Operation(summary = "로그인전 필요한 데이터")
    @PostMapping("/comn/initData.nx")
    public NexacroResult initLoginData(NexacroRequest nexacroRequest) {

        Map<String ,Object> result  = new HashMap<>();

        result.put("dsLocale"       , service.locale(nexacroRequest.getMapVariableList()));
        result.put("dsLoginMessage" , service.findByMessages(nexacroRequest.getMapVariableList()));

        return new NexacroResult( result );
    }

    @Operation(summary = "언락 처리")
    @PostMapping(value="/com/ComLogin_UnLock.nx")
    public NexacroResult processUnlock(NexacroRequest nexacroRequest, HttpServletRequest request) {
    	
        Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        return new NexacroResult(service.processUnlock(param, request));
    }
    
    @Operation(summary = "비밀번호 변경")
    @PostMapping(value="/com/common_changePassword.nx")
    public NexacroResult processPasswordChange(NexacroRequest nexacroRequest) {

        Map<String, Object> param = nexacroRequest.getMapVariableList();
        return new NexacroResult(service.processPasswordChange(param));
    }

    @Operation(summary = "비밀번호 초기화")
    @PostMapping(value="/com/common_resetPassword.nx")
    public NexacroResult processPWReset(NexacroRequest nexacroRequest) {

        Map<String, Object> param = nexacroRequest.getMapVariableList();
        return new NexacroResult(service.processPWReset(param));
    }
    
    
    
    @PostMapping(value = "/com/ComLoginSap.nx")
    public NexacroResult processSapLogin(NexacroRequest nexacroRequest)
    {
        Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        return new NexacroResult("dsSapLogin", service.processSapLogin(param));
    }
    
    
    @Operation(summary = "마이메뉴 수정 삭제")
    @PostMapping(value="/com/ComLogin_ADDMYMENU.nx")
    public NexacroResult processADDMYMENU(NexacroRequest nexacroRequest) {
    	
        return new NexacroResult(service.processADDMYMENU(nexacroRequest));
    }
    
    @Operation(summary = "시스템 강제 로그아웃")
    @PostMapping(value="/com/ComLogin_Terminate.nx")
    public NexacroResult processLoginTerminate(NexacroRequest nexacroRequest) {
    	
    	Map<String,Object> mapVariable = nexacroRequest.getMapVariableList();
    	
    	return new NexacroResult(service.logoutOk(mapVariable));
    }
    
    
    @Operation(summary = "메뉴 로그 기록")
    @PostMapping(value="/com/ComLogin_LOGMENU.nx")
    public NexacroResult processLOGMENU(NexacroRequest nexacroRequest) {
    	
        Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        return new NexacroResult(service.processLOGMENU(param));
    }

	
	
	

    @Operation(summary = "시스템 로그아웃")
    @PostMapping(value="/com/ComLogin_Logout.nx")
    public NexacroResult processLogout(NexacroRequest nexacroRequest, HttpServletRequest request, HttpSession session) {
    	;
    	Map<String,Object> requestMap = new HashMap<String, Object>();
    	
    	// 세션에 등록 된 정보를 추출하여 처리
        HttpSession httpSession = request.getSession();
        
        requestMap.put("USER_ID" , httpSession.getAttribute("WORK_USID"));
        requestMap.put("COMP_ID" , httpSession.getAttribute("WORK_COMP"));
        requestMap.put("SESS_ID" , httpSession.getAttribute("SESS_ID"));
        requestMap.put("CONN_IP" , httpSession.getAttribute("WORK_IP"));
        requestMap.put("CONN_MAC", httpSession.getAttribute("WORK_MAC"));
        
        return new NexacroResult(service.logoutOk(requestMap));
    }

    @Operation(summary = "로그인 처리")
    @PostMapping(value="/com/ComLogin_Login.nx")
    public NexacroResult processLogin(NexacroRequest nexacroRequest, HttpServletRequest request) {
        System.out.println("+++++++++++++++++++++++++++++++++++++++++");
        System.out.println("++   processLogin  start ...");
        System.out.println("+++++++++++++++++++++++++++++++++++++++++");
        //Map<String, Object> param = nexacroRequest.getMapVariableList();
        Map<String, Object> param = null;
        // return new NexacroResult(service.processLogin(param, request));
        return new NexacroResult(param);
    }
    

    @Operation(summary = "메뉴조회")
    @PostMapping(value="/com/GetMenu.nx")
    public NexacroResult processGetMenu(NexacroRequest nexacroRequest, HttpServletRequest request) {
    	System.out.println("메뉴조회 컨트롤러");
        Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        // return new NexacroResult("dsMENU_TEST", service.processGetMenu(param, request));
        return new NexacroResult(service.processGetMenu(param, request));
    }
}
