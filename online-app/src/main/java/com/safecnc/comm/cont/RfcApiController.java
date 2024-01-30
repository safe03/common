package com.safecnc.comm.cont;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.safecnc.comm.dimn.SapJcoManager;
import com.safecnc.comm.dimn.SapManager.ResultSapJcoManager;
import com.safecnc.comm.dimn.WebMailDestributer;
import com.safecnc.comm.srvc.RfcApiService;
import com.safecnc.comm.type.OpenApiTagType.ApplicationTest;
import com.safecnc.comm.util.ThymeleafUtils;

@Controller
public class RfcApiController implements ApplicationTest{
	
	/*
	@Resource(name = "RfcApiServiceImpl")
	private RfcApiService RfcApiServiceImpl;
	
	@Autowired
	private WebMailDestributer sfd2022WebMailDestributer;
	
	@GetMapping("/api/test")
	@ResponseBody
	public Object test(@RequestParam(name="I_FROM", defaultValue = "kim0lil0705@gmail.com", required = false) String I_FROM) throws Exception {
		
		Map<String,Object> map = new HashMap<String, Object>();
		
		map.put("ID", "AAA");
		
		return ResponseEntity.ok(map);
	}
	
	@GetMapping("/api/sendMail")
	@ResponseBody
	public Object sendMail(
			@RequestParam(name="I_FROM", defaultValue = "kim0lil0705@gmail.com", required = false) String I_FROM,
			@RequestParam(name="I_TO", defaultValue = "kim0lil@naver.com", required = false) String I_TO,
			@RequestParam(name="I_TITLE", defaultValue = "Title", required = false) String I_TITLE,
			@RequestParam(name="I_MESSAGE", defaultValue = "Mail Send Test", required = false) String I_MESSAGE ) throws Exception {

		sfd2022WebMailDestributer.send(I_FROM, I_TO, I_TITLE, I_MESSAGE);
		
		return sfd2022WebMailDestributer.getSuccesseCount();
	}
	
	@GetMapping("/api/thymeleaf")
	@ResponseBody
	public Object sendMail(
			@RequestParam(name="I_NAME", defaultValue = "lee jin hyeok", required = false) String I_NAME) throws Exception {

		Map<String,Object> model = new HashMap<String, Object>();
	
		model.put("name", I_NAME);
	
		return ThymeleafUtils.html("/sfd2022/views/sample", model);
	}
	
	@GetMapping("/api/Z_RF_SELECT_DELNOTE")
	@ResponseBody
	public Object Z_RF_SELECT_DELNOTE(
			@RequestParam(name = "I_WORKS", defaultValue = "1100", required = false)    String I_WORKS, 
			@RequestParam(name = "I_LGORT", required = false)    String I_LGORT, 
			@RequestParam(name = "I_MATNR", required = false)    String I_MATNR, 
			@RequestParam(name = "I_CHARG", required = false)    String I_CHARG, 
			@RequestParam(name = "I_EINDT_FR", defaultValue = "20220102", required = false) String I_EINDT_FR, 
			@RequestParam(name = "I_EINDT_TO", defaultValue = "20220630", required = false) String I_EINDT_TO, 
			@RequestParam(name = "I_EBELN", defaultValue = "4500578432", required = false)   String I_EBELN, 
			@RequestParam(name = "I_LANGU", defaultValue = "E", required = false)   String I_LANGU, 
			@RequestParam(name = "I_LIFNR", required = false)   String I_LIFNR){
		
		Map<String,Object> parameter = new HashMap<String, Object>();
		
		parameter.put("I_WORKS", I_WORKS);
		parameter.put("I_LGORT", I_LGORT);
		parameter.put("I_MATNR", I_MATNR);
		parameter.put("I_CHARG", I_CHARG);
		parameter.put("I_EINDT_FR", I_EINDT_FR);
		parameter.put("I_EINDT_TO", I_EINDT_TO);
		parameter.put("I_EBELN", I_EBELN);
		parameter.put("I_LANGU", I_LANGU);
		parameter.put("I_LIFNR", I_LIFNR);
		
		return RfcApiServiceImpl.Z_RF_SELECT_DELNOTE(parameter);
	}
	

	@GetMapping("/api/YZT00L7_GET_EMPNO_SAPID_call")
	@ResponseBody
	public Object YZT00L7_GET_EMPNO_SAPID(
			@RequestParam(name = "I_PERNR", defaultValue = "20210111") String I_PERNR, 
			@RequestParam(name = "I_PWD", defaultValue = "20210111!@#")   String I_PWD){

		Map<String,Object> parameter = new HashMap<String, Object>();

		parameter.put("I_PERNR", I_PERNR);
		parameter.put("I_PWD", I_PWD);
		
		return RfcApiServiceImpl.YZT00L7_GET_EMPNO_SAPID(parameter);
	}
	

	@PostMapping("/api/test")
	@ResponseBody
	public Map<String,Object> call() throws Exception
	{
		Map<String,Object> parameters = new HashMap<String, Object>();


		try {
			SapJcoManager sfd2022SapJcoManager = new SapJcoManager(true);
			
			Map<String,Object> resultObject = new HashMap<String, Object>();
			
			if(sfd2022SapJcoManager.ping())
			{
				ResultSapJcoManager resultSapJcoManager;

				ArrayList<Map<String,Object >> T_ITMDT  = new ArrayList<Map<String,Object >>();
				
						
				Map<String,Object> T_ITMDT1 = new HashMap<String, Object>();
				T_ITMDT1.put("INDATA", "0");

				Map<String,Object> T_ITMDT2 = new HashMap<String, Object>();
				T_ITMDT2.put("INDATA", "1");
				
				Map<String,Object> T_ITMDT3 = new HashMap<String, Object>();
				T_ITMDT3.put("INDATA", "2");
				
				Map<String,Object> T_ITMDT4 = new HashMap<String, Object>();
				T_ITMDT4.put("INDATA", "3");
				
				T_ITMDT.add(T_ITMDT1);
				T_ITMDT.add(T_ITMDT2);
				T_ITMDT.add(T_ITMDT3);
				T_ITMDT.add(T_ITMDT4);
				
				parameters.put("I_LIFNR", "0000100158");
				parameters.put("I_USERID", "BIZWBE");
				parameters.put("T_ITMDT", T_ITMDT);

				sfd2022SapJcoManager.call("ZBIZWBP_100_02", parameters);
				sfd2022SapJcoManager.call("ZBIZWBP_100_02", parameters);
				
				resultSapJcoManager = sfd2022SapJcoManager.getResult();

				resultObject.put("B", resultSapJcoManager.getRfcCallResult());
				
				sfd2022SapJcoManager.close();
			}
			
			return resultObject;
		}catch(Exception e) {
			throw e;
		}
	}
	*/
}
