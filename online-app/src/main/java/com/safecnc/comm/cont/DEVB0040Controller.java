package com.safecnc.comm.cont;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.safecnc.comm.dimn.SapJcoManager;
import com.safecnc.comm.dimn.SapJcoManager.SapJcoRfcMetaFunction;
import com.safecnc.comm.dimn.SapManager.ResultSapJcoManager;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

@Controller
public class DEVB0040Controller implements AbstractController, OpenApiTagType.CommonManagement {
	
	/*
	@RequestMapping("/api/connection")
	public NexacroResult connection(NexacroRequest request) throws Exception
	{
		Map<String,Object> parameters = request.getMapVariableList();

		String SAP_ID = (String)parameters.get("SAP_ID");
		
		SapJcoManager sfd2022SapJcoManager = new SapJcoManager(SAP_ID, true);
		
		boolean isConnect = sfd2022SapJcoManager.ping();
		
		Map<String,Object> row = new HashMap<String, Object>();
		
		row.put("CONN", isConnect?"1":"0");
		
		return new NexacroResult("dsConnect", row);
	}
	@RequestMapping("/api/disconnect")
	public NexacroResult disconnect(HttpSession session) throws Exception
	{

		session.invalidate();
		session.setMaxInactiveInterval(0);
		return new NexacroResult(10);
	}
	
	@RequestMapping("/api/input")
	public NexacroResult functions(NexacroRequest request) throws Exception
	{
		Map<String,Object> parameters = request.getMapVariableList();
		
		String SAP_ID = (String)parameters.get("SAP_ID");
		String SAP_FN = (String)parameters.get("SAP_FN");
		
		SapJcoManager sfd2022SapJcoManager = new SapJcoManager(SAP_ID, true);
		
		ResultSapJcoManager resultSapJcoManager = sfd2022SapJcoManager.parse(SAP_FN);
		
		List<Map<String,Object>> dsInput  = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> dsOutput = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> dsTable  = new ArrayList<Map<String,Object>>();
		
		Map<String, SapJcoRfcMetaFunction> SapJcoRfcMetaFunctions = resultSapJcoManager.getImportMetaParameters();

		String colName;
		Iterator<String> colNames;
		if(!Objects.isNull(SapJcoRfcMetaFunctions))
		{
			colNames = SapJcoRfcMetaFunctions.keySet().iterator();
			
			while(colNames.hasNext())
			{
				Map<String,Object> row = new HashMap<String, Object>();
				
				colName = colNames.next();
				SapJcoRfcMetaFunction sapJcoRfcMetaFunction = SapJcoRfcMetaFunctions.get(colName);
				
				row.put("id", colName);
				row.put("typeName", sapJcoRfcMetaFunction.getTypeName());
				row.put("description", sapJcoRfcMetaFunction.getDescription());
				
				dsInput.add(row);
			}
		}
		
		SapJcoRfcMetaFunctions = resultSapJcoManager.getExportMetaParameters();

		if(!Objects.isNull(SapJcoRfcMetaFunctions))
		{
			colNames = SapJcoRfcMetaFunctions.keySet().iterator();
			
			while(colNames.hasNext())
			{
				Map<String,Object> row = new HashMap<String, Object>();
				
				colName = colNames.next();
				SapJcoRfcMetaFunction sapJcoRfcMetaFunction = SapJcoRfcMetaFunctions.get(colName);
				
				row.put("id", colName);
				row.put("typeName", sapJcoRfcMetaFunction.getTypeName());
				row.put("description", sapJcoRfcMetaFunction.getDescription());
				
				dsOutput.add(row);
			}
		}
		
		Map<String, Map<String, SapJcoRfcMetaFunction>> SapJcoRfcMetaTable = resultSapJcoManager.getMetaTable();

		if(!Objects.isNull(SapJcoRfcMetaTable))
		{
			String firstTable = SapJcoRfcMetaTable.keySet().iterator().next();
			
			SapJcoRfcMetaFunctions = SapJcoRfcMetaTable.get(firstTable);
	
			colNames = SapJcoRfcMetaFunctions.keySet().iterator();
	
			Map<String,Object> row = new HashMap<String, Object>();
			
			while(colNames.hasNext())
			{
				colName = colNames.next();
				
				row.put(colName, "");
			}
	
			dsTable.add(row);
		}
		
		sfd2022SapJcoManager.close();
		
		Map<String,Object> returnValue = new HashMap<String, Object>();
		
		returnValue.put("dsInput" , dsInput);
		returnValue.put("dsOutput", dsOutput);
		returnValue.put("dsTable", dsTable);
		
		
		return new NexacroResult(returnValue);
	}
	
	@RequestMapping("/api/output")
	public NexacroResult output(NexacroRequest request) throws Exception
	{
		Map<String,Object> parameters = request.getMapVariableList();
		
		String SAP_ID = (String)parameters.get("SAP_ID");
		String SAP_FN = (String)parameters.get("SAP_FN");

		SapJcoManager sfd2022SapJcoManager = new SapJcoManager(SAP_ID, true);
		
		Map<String,Object> returnValue = new HashMap<String, Object>();

		List<Map<String,Object>> dsOutput = new ArrayList<Map<String,Object>>();
		try {
			sfd2022SapJcoManager.call(SAP_FN, parameters);
			
			ResultSapJcoManager resultSet = sfd2022SapJcoManager.getResult();
			
			returnValue.put("dsResult", resultSet.getResult());
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return new NexacroResult(returnValue);
	}
	
	*/
}
