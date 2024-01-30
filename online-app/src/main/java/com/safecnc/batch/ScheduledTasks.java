package com.safecnc.batch;

import java.io.IOException;

import javax.annotation.Resource;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.safecnc.batch.svc.ScheduledTasksService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ScheduledTasks {
	@Resource(name = "ScheduledTasksService")
	private ScheduledTasksService service;	
	
	//초 분 시 일 월 요일 년도(생략가능)
	@Scheduled (cron = "0 0/30 * * * *")
	public void task1() throws IOException {
		log.info("@@@@@ Batching Scheduled Test time 30 Min @@@@@");
		
/*
 * 서비스 예시 참조구문
 * */		
//    	List<Map<String, Object>> sapResult = null;
//		Map<String,Object> insValue = new HashMap<String, Object>();
//		
//		Date date;
//		date = Calendar.getInstance().getTime();  
//		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");  
//		DateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");  
//		
//		insValue.put("EXECUTION_TYPE", "A");
//
//		String execDate = dateFormat.format(date);  		
//		insValue.put("EXECUTION_DATE", execDate);
//		
//		
//		date = Calendar.getInstance().getTime();  
//		String execSAPStartTime = dateTimeFormat.format(date);  		
//		insValue.put("SAP_START_TIME", execSAPStartTime);
//		
//    	sapResult = new InvokeRFC().execute("Z_COM_CUST_DATA", null, "ET_DATA");
//    	
//		date = Calendar.getInstance().getTime();  
//		String execSAPFinishTime = dateTimeFormat.format(date);  		
//		insValue.put("SAP_FINISH_TIME", execSAPFinishTime);
//    	
//		
//		date = Calendar.getInstance().getTime();  
//		String execDBStartTime = dateTimeFormat.format(date);  		
//		insValue.put("DB_START_TIME", execDBStartTime);
//    	
//        service.SAV00(sapResult);
//        
//		date = Calendar.getInstance().getTime();  
//		String execDBFinishTime = dateTimeFormat.format(date);  		
//		insValue.put("DB_FINISH_TIME", execDBFinishTime);    
//		
//		insValue.put("EXECUTION_COUNT", sapResult.size());
//		
//		ADM0040service.INS00(insValue);    	
	}
	
}
