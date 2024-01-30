package com.safecnc.comm.dimn;

import java.io.Closeable;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.apache.commons.lang3.RandomUtils;

import com.safecnc.web.exception.CustomException;
import com.sap.conn.jco.JCoContext;
import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoField;
import com.sap.conn.jco.JCoFieldIterator;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoMetaData;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoRepository;
import com.sap.conn.jco.JCoTable;

import lombok.extern.slf4j.Slf4j;

/**
 * RFC를 호출하고 반환하는 클래스 </br>
 * 기본 적용 시 [Sfd2022SapJcoConnectionProvider]를 사용하여 default value 적용</br>
 * 
 * @since 2022-05-16
 * @author jhlee
 * 
 * @see SapJcoMapper
 * @see SapJcoConnectionProvider
 * @see SapJcoProvideProperties
 * @see JCoContext
 * @see JCoDestination
 * @see JCoDestinationManager
 * @see JCoRepository
 * @see JCoField
 * @see JCoTable
 * @see JCoException
 */
@Slf4j
public class SapJcoManager implements SapManager<Map<String, Object>, Map<String, Object>>, Closeable {
	
	/** 고유 RFC 관리 객체 아이디 */
	private Long          rfcManageID;
	
	/** 실핼 될 함수의 결과 값을 저장하는 변수 */
	private List<String>  rfcCallNames;
	
	/** 실행 된 함수의 실행 시간을 저장하는 변수 */
	private List<Integer> rfcCallTimes;

	/** 실행 된 함수의 요청지를 저장하는 변수 */
	private String        rfcDestination;
	
	/** 실행 된 함수의 실행 결과를 저장하는 변수 */
	private List<Map<String,Object>> rfcCallResult;
	
	/** 상태 변경 감지 여부를 등록 */
	private boolean autoCommit;
	
	/** 객체 상태 변경을 위한 입,출력 명칭 변수 */
	private Map<String, Map<String,SapJcoRfcMetaFunction>> importMetaParam
						= new LinkedHashMap<String, Map<String,SapJcoRfcMetaFunction>>();
	private Map<String, Map<String, SapJcoRfcMetaFunction>> exportMetaParam 
						= new LinkedHashMap<String, Map<String,SapJcoRfcMetaFunction>>();
	private Map<String, Map<String, Map<String, SapJcoRfcMetaFunction>>> metaTable
						= new LinkedHashMap<String, Map<String, Map<String, SapJcoRfcMetaFunction>>>();
	
	/**
	 * SAP 연동을 위한 < j-co > 변수 
	 * 
	 * JCoDestination           : SAP 연결을 위한 변수
	 * JCoFunction              : SAP 함수 연결을 위한 변수
	 * JCoParameterList(input)  : 입력 파라미터 확인을 위한 변수
	 * JCoParameterList(output) : 출력 파라미터 확인을 위한 변수
	 * JCoTable(table)          : 테이블 확인을 위한 변수
	 */
	private JCoDestination                jCoDestination;
	private JCoRepository                 jCoRepository;
	private Map<String, JCoFunction>      jCoFunctions;
	private Map<String, JCoParameterList> imports;
	private Map<String, JCoParameterList> exports;
	private Map<String, JCoParameterList> tables;
	
	/** 타입 매핑을 위한 고유 주요 생성 */
	private SapJcoMapper sfd2022SapJcoMapper = new SapJcoMapper();
	
	/** 숫자 포맷을 처리하기 위한 고유 변수 */
	private final DecimalFormat numberFormat = new DecimalFormat("###,###");
	
	/** 생성자를 통하여 초기화 처리 */
	public SapJcoManager() { 
		this.rfcManageID    = RandomUtils.nextLong(); 
		this.jCoDestination = null;
		this.rfcCallNames   = new ArrayList<String>();
		this.rfcCallTimes   = new ArrayList<Integer>();
		this.rfcCallResult  = new ArrayList<Map<String,Object>>();
		this.jCoFunctions   = new LinkedHashMap<String, JCoFunction>();
		this.imports        = new LinkedHashMap<String, JCoParameterList>();
		this.exports        = new LinkedHashMap<String, JCoParameterList>();
		this.tables         = new LinkedHashMap<String, JCoParameterList>();
		this.rfcDestination = SapJcoProvideProperties.destination;
		this.autoCommit     = true;
	}
	
	/** 생성자를 통하여 자동 커밋 여부를 초기화 처리 (요청지가 없을 경우 기본 요청지로 처리)*/
	public SapJcoManager(boolean autoCommit) { 
		this();
		this.autoCommit = autoCommit;
	}
	
	/** 생성자를 통하여 자동 커밋 여부를 초기화 처리 */
	public SapJcoManager(String rfcDestination, boolean autoCommit) { 
		this(autoCommit);
		this.rfcDestination = rfcDestination;
	}
	
	/** 생성자를 통하여 요청지 커밋 여부를 초기화 처리 */
	public SapJcoManager(String rfcDestination) { 
		this(rfcDestination, true);
	}

	/**
	 * 접속 가능 여부를 확인하는 함수
	 * 
	 * @return 
	 * 		접속 가능 여부
	 */
	@Override
	public boolean ping() {
		
		try 
		{
			// 연결 정보를 확인
			getConnection(this.rfcDestination).ping();

			return true;
		}
		catch(Exception e)
		{
			return false;
		}
	}

	/**
	 * 연결 명칭을 지정하여 연결을 획득
	 * 
	 * @param destinationName 
 * 						연결 명칭
	 * @param autoCommit 
	 * 					자동 커밋 여부
	 * @return SAP 연결 정보
	 */
	private JCoDestination getConnection(String destinationName, boolean autoCommit)
	{
		JCoDestination jCoDestination = null;

		// 자동 커밋 여부에 따른 분기 처리
		if(autoCommit)
		{
			jCoDestination = getConnection(destinationName);
		}
		else
		{
			// SAP의 연결이 이미 되어 있는 경우는 이전 연결을 그대로 사용
			if(Objects.isNull(this.jCoDestination)) 
			{
				// 커넥션 시작을 명시
				JCoContext.begin(jCoDestination);
				
				this.jCoDestination = getConnection(destinationName);
			}
			
			// 상위의 상태 변수로 할당.
			// 다음에 진입 할 경우 이전 연결을 사용할 것이다.
			jCoDestination = this.jCoDestination;
		}

		trace("[{}] getConnection = connect sap with jco library", rfcManageID);
		
		return jCoDestination;
	}
	
	/**
	 * 연결명칭을 지정하여 연결을 획득
	 * 
	 * @param destinationName 
	 * 					연결 명칭
	 * @return SAP 연결 정보
	 */
	public JCoDestination getConnection(String destinationName)
	{
		JCoDestination destination = null;
		
		try {
			destination = JCoDestinationManager.getDestination(destinationName);
		} 
		catch (JCoException e) 
		{
			e.printStackTrace();
			
			throw new CustomException("-1", "An error occurred while Connect to SAP.");
		}
		
		return destination;
	}
	
	/**
	 * SAP 과의 연결 상태를 반영
	 * 
	 * @param isTerminated
	 * 				강제 종료 여부
	 */
	public void commit(boolean isTerminated) {
		
		try 
		{
			// 객체가 소멸 되거나 자동 상태 반영일 경우 
			// 즉시 [JCoDestination]를 지우고 종료 처리
			if(isTerminated || this.autoCommit)
			{
				if(!Objects.isNull(jCoDestination))
				{
					if(JCoContext.isStateful(jCoDestination))
					{
						JCoContext.end(jCoDestination);
					}
					
					jCoDestination = null;
				}
			}
			
		} catch (JCoException e) {
			
			jCoDestination = null;
			
			throw new CustomException("-1", "error occurred while terminating jCoDestination.");
		}
	}

	@Override
	public void close() throws IOException {
		
		// 자동 커밋이 아닐 경우 닫을 때 커밋을 처리
		if(!this.autoCommit)
		{
			// 강제 상태 반영을 처리
			commit(true);
		}
	}
	
	/**
	 * SAP 연결 접속으로부터 저장소를 받아온다.
	 * 
	 * @param jCoDestination 
	 * 					SAP 연결 접속 정보
	 * @param autoCommit 
	 * 					자동 연결 여부
	 * @return 연결 저장소
	 */
	private JCoRepository getRepository(JCoDestination jCoDestination, Boolean autoCommit)
	{
		JCoRepository jCoRepository;
		
		try {
			// 자동 커밋 여부에 따른 분기 처리
			if(autoCommit) 
			{
				// 자동 커밋일 경우 넘겨 받은 접속 정보를 사용하여 저장소 조회
				jCoRepository = jCoDestination.getRepository();
			}
			else
			{
				// 저장소 정보를 조회
				if(Objects.isNull(this.jCoRepository)) 
				{
					this.jCoRepository = jCoDestination.getRepository();
				}
				
				jCoRepository = this.jCoRepository;
			}
		}
		catch(Exception e)
		{
			throw new CustomException("-1", "An error occurred while creating the SAP repository.");
		}
		
		trace("[{}] getRepository = open jco repository = { {} }", rfcManageID, jCoRepository.getName());
		
		return jCoRepository;
	}
	
	/**
	 * SAP 함수 호출 정보를 받아온다.
	 * 
	 * @param jCoRepository 
	 * 				SAP 연결 접속 정보
	 * @param ifName 
	 * 				호출을 위한 원격 함수명
	 * @return 실행 가능한 함수
	 */
	public JCoFunction getFunction(JCoRepository jCoRepository, String ifName, Boolean autoCommit)
	{
		try 
		{
			// 이전에 실행했던 결과 값이 있을 경우 동일하게 처리
			if(jCoFunctions.containsKey(ifName) && !autoCommit)
			{
				trace("[{}] getFunction = cached jco function = { {} }", rfcManageID, ifName);
				
				// 이전 호출 값이 있을 경우 호출 정보를 다시 진행
				return jCoFunctions.get(ifName);
			}
			else
			{
				// 함수 저장소를 넘겨 주지 않은 경우 에러 출력
				if(jCoRepository == null)
				{
					throw new CustomException("-1", "JCoRepository is require parameter");
				}
				
				// 신규 함수 정보를 불러온다.
				JCoFunction jCoFunction = jCoRepository.getFunction(ifName);
				
				// 자동 커밋 여부에 따라 캐시를 설정
				if(Objects.isNull(jCoFunction))
				{
					throw new CustomException("-1", ifName+" function not founded.");
				}
				
				// 자동 커밋 여부에 따라 캐시를 설정
				if(autoCommit)
				{
					jCoFunctions.put(ifName, jCoFunction);
				}

				trace("[{}] getFunction = find jco function = { {} }", rfcManageID, ifName);
				
				// 신규 함수를 반환
				return jCoFunction;
			}
		}
		catch(Exception e)
		{
			throw new CustomException("-1", ifName+" function not founded.");
		}
	}
	
	/**
	 * 실행 전 입력 인자와 출력 인자를 확인하여 메타 정보로 등록
	 * 
	 * @param jCoFunction SAP 연결 접속 정보
	 */
	private void setMetaParameter(JCoFunction jCoFunction) 
	{
		// 입력 인자를 확인하여 메타 정보에 등록
		setMetaImportParameter(jCoFunction);
		
		// 출력 인자를 확인하여 메타 정보에 등록
		setMetaExportParameter(jCoFunction);
		
		// 테이블 인자를 확인하여 메타 정보에 등록
		setMetaTables(jCoFunction);
	}
	
	/**
	 * 실행 전 입력 인자를 확인하여 메타 정보로 등록
	 * 
	 * @param jCoFunction SAP 연결 접속 정보
	 */
	private void setMetaImportParameter(JCoFunction jCoFunction)
	{
		// 인자값을 확인하기 위한 변수
		String ifName;
		JCoMetaData jCoMetaData;
		JCoParameterList jCoParameterList;
		Map<String, SapJcoRfcMetaFunction> inMap;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();
		
		// 입력 시 저장된 메타 정보가 없을 경우 메타 정보 추출
		if(!importMetaParam.containsKey(ifName))
		{
			// 파라미터 리스트와 메타 데이터를 사용하여 이곳에 사용하는 고유 구조체를 구성
			jCoParameterList = jCoFunction.getImportParameterList();
			
			// 등록할 인자가 있을 경우 인자 처리
			if(!Objects.isNull(jCoParameterList) && jCoParameterList.getFieldCount() > 0)
			{
				// 구조체의 저장소를 신규 할당
				inMap = new HashMap<String, SapJcoRfcMetaFunction>();
				
				// 메타 정보를 사용하여 필드 고유 데이터 구조체를 생성
				jCoMetaData = jCoParameterList.getMetaData();
				
				// 필드를 순환하면서 모든 항목을 채운다.
				int nField = jCoMetaData.getFieldCount();

				int colType;
				String colName, colTypeName, colDesc;
				
				while(nField-->0)
				{
					colName     = jCoMetaData.getName(nField);
					colType     = jCoMetaData.getType(nField);
					colDesc     = jCoMetaData.getDescription(nField);
					colTypeName = jCoMetaData.getTypeAsString(nField); 

					trace("[{}] setMetaParameter(import << ) = { name : {}, type : {} }", rfcManageID, colName, colTypeName);
					
					// 구조체의 양식은 { 파라미터명(string) : 파라미터 타입(int) } 으로 정의한다.
					inMap.put(colName, new SapJcoRfcMetaFunction(colType, colTypeName, colDesc));
				}
				
				// 캐시 저장소에 저장
				importMetaParam.put(ifName, inMap);
				
				imports.put(ifName, jCoParameterList);
			}
		}
		else
		{
			trace("[{}] setMetaParameter(import << ) = cached", rfcManageID);
		}
	}
	
	/**
	 * 실행 전 출력 인자를 확인하여 메타 정보로 등록
	 * 
	 * @param jCoFunction SAP 연결 접속 정보
	 */
	private void setMetaExportParameter(JCoFunction jCoFunction)
	{
		// 인자값을 확인하기 위한 변수
		String ifName;
		JCoMetaData jCoMetaData;
		JCoParameterList jCoParameterList;
		Map<String, SapJcoRfcMetaFunction> outMap;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();

		// 출력 시 저장된 메타 정보가 없을 경우 메타 정보 추출
		if(!exportMetaParam.containsKey(ifName))
		{
			// 파라미터 리스트와 메타 데이터를 사용하여 이곳에 사용하는 고유 구조체를 구성
			jCoParameterList = jCoFunction.getExportParameterList();
			
			// 등록할 인자가 있을 경우 인자 처리
			if(!Objects.isNull(jCoParameterList) && jCoParameterList.getFieldCount() > 0)
			{
				// 구조체의 저장소를 신규 할당
				outMap = new HashMap<String, SapJcoRfcMetaFunction>();
				
				// 메타 정보를 사용하여 필드 고유 데이터 구조체를 생성
				jCoMetaData = jCoParameterList.getMetaData();
				
				// 필드를 순환하면서 모든 항목을 채운다.
				int nField = jCoMetaData.getFieldCount();

				int colType;
				String colName, colTypeName, colDesc;
				
				while(nField-->0)
				{
					colName     = jCoMetaData.getName(nField);
					colType     = jCoMetaData.getType(nField);
					colTypeName = jCoMetaData.getTypeAsString(nField); 
					colDesc     = jCoMetaData.getDescription(nField);

					trace("[{}] setMetaParameter(export >> ) = { name : {}, type : {} }", rfcManageID, colName, colTypeName);
					
					// 구조체의 양식은 { 파라미터명(string) : 파라미터 타입(int) } 으로 정의한다.
					outMap.put(colName, new SapJcoRfcMetaFunction(colType, colTypeName, colDesc));
				}
				
				// 캐시 저장소에 저장
				exportMetaParam.put(ifName, outMap);
				
				exports.put(ifName, jCoParameterList);
			}
		}
		else
		{
			trace("[{}] setMetaParameter(output << ) = cached", rfcManageID);
		}
	}
	
	/**
	 * 실행 전 인터페이스 테이블을 확인하여 메타 정보로 등록
	 * 
	 * @param jCoFunction SAP 연결 접속 정보
	 */
	private void setMetaTables(JCoFunction jCoFunction)
	{
		// 인자값을 확인하기 위한 변수
		String ifName;
		JCoMetaData jCoMetaData;
		JCoParameterList jCoParameterList;
		Map<String, SapJcoRfcMetaFunction> tableMap;
		Map<String, Map<String, SapJcoRfcMetaFunction>> tableMaps;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();

		String strTableName;
		JCoTable jCoTable;

		// 출력 시 저장된 메타 정보가 없을 경우 메타 정보 추출
		if(!metaTable.containsKey(ifName))
		{
			// 파라미터 리스트와 메타 데이터를 사용하여 이곳에 사용하는 고유 구조체를 구성
			jCoParameterList = jCoFunction.getTableParameterList();
			
			// 등록할 인자가 있을 경우 인자 처리
			if(!Objects.isNull(jCoParameterList) && jCoParameterList.getFieldCount() > 0)
			{
				// 구조체의 저장소를 신규 할당
				tableMaps = new HashMap<String, Map<String, SapJcoRfcMetaFunction>>();
				
				// 메타 정보를 사용하여 필드 고유 데이터 구조체를 생성
				jCoMetaData = jCoParameterList.getMetaData();
				
				// 필드를 순환하면서 모든 항목을 채운다.
				int nField = jCoMetaData.getFieldCount();

				int colType;
				String colName, colTypeName, colDesc;
				
				// 테이블에 필드 정보를 등록
				while(nField-->0)
				{
					strTableName = jCoMetaData.getName(nField);
					jCoTable     = jCoParameterList.getTable(strTableName);

					trace("[{}] setMetaParameter(table  <> ) = { name : {} }", rfcManageID, strTableName);

					// 필드가 있을 경우 테이블에 등록된 필드로 매핑을 적용
					if(!Objects.isNull(jCoParameterList) && jCoTable.getFieldCount() > 0)
					{
						
						tableMap = new HashMap<String, SapJcoRfcMetaFunction>(); 
						
						// 필드를 순환하면서 모든 항목을 채운다.
						JCoFieldIterator jCoFieldIterator = jCoTable.getFieldIterator();
						JCoField jCoField;
						while(jCoFieldIterator.hasNextField())
						{
							jCoField = jCoFieldIterator.nextField();
							
							colName     = jCoField.getName();
							colType     = jCoField.getType();
							colDesc     = jCoField.getDescription();
							colTypeName = jCoField.getTypeAsString(); 
							
							trace("[{}] setMetaParameter(table  <> ) = { +--> name : {}, type : {} }", rfcManageID, colName, colTypeName);

							// 구조체의 양식은 { 파라미터명(string) : 파라미터 타입(int) } 으로 정의한다.
							tableMap.put(colName, new SapJcoRfcMetaFunction(colType, colTypeName, colDesc));
						}
						
						tableMaps.put(strTableName, tableMap);
					}
				}
				
				// 캐시 저장소에 저장
				metaTable.put(ifName, tableMaps);
				
				tables.put(ifName, jCoParameterList);
			}
		}
		else
		{
			trace("[{}] setMetaParameter(table  <> ) = cached", rfcManageID);
		}
	}

	/**
	 * 입력값을 등록하고 처리한다.
	 * @param jCoFunction 
	 * 					SAP 연결 접속 정보
	 * @param parameterList
	 * 					입력값 처리를 위한 외부 인자
	 */
	private void setImport(JCoFunction jCoFunction, Map<String,Object> parameterList) 
	{
		// 파라미터 입력값을 처리
		setImportParameters(jCoFunction, parameterList);

		// 테이블 입력값을 처리
		setImportTables(jCoFunction, parameterList);
	}
	
	/**
	 * 파라미터로 입력 된 입력값을 등록하고 처리한다.
	 * @param jCoFunction
	 * 					SAP 연결 접속 정보
	 * @param parameterList
	 * 					입력값 처리를 위한 외부 인자
	 */
	private void setImportParameters(JCoFunction jCoFunction, Map<String,Object> parameterList)
	{
		// 인자값을 확인하기 위한 변수
		JCoParameterList jCoParameterList;
		Map<String, SapJcoRfcMetaFunction> inMap;
		Iterator<String> itEnumCol;
		int colType;
		String colName;
		Object colValue;
		String ifName;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();
		
		// 기존에 등록한 키 값을 사용하여 재 실행
		inMap = importMetaParam.get(ifName);
		
		jCoParameterList = imports.get(ifName);
		
		// 컬럼 리스트를 순환하기 위하여 메타 변수 할당
		itEnumCol = inMap.keySet().iterator();
		
		// 컬럼을 순환하면서 JCO에 값을 등록한다.
		while(itEnumCol.hasNext())
		{
			colName = itEnumCol.next();
			colType = inMap.get(colName).getType();
			
			colValue = sfd2022SapJcoMapper.cast(parameterList.get(colName), sfd2022SapJcoMapper.typeOf(colType));
			
			trace("[{}] setImport = { name : {}, value : {} }", rfcManageID, colName, colValue);
			
			jCoParameterList.setValue(colName, colValue);
		}
	}
	
	/**
	 * 파라미터로 입력 된 입력값을 등록하고 처리한다.
	 * @param jCoFunction
	 * @param parameterList
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private void setImportTables(JCoFunction jCoFunction, Map<String,Object> parameterList)
	{
		// 인자값을 확인하기 위한 변수
		// 컬럼 관련
		int columnType;
		Set<String> columnSet;
		Object columnValue;
		String columnName;
		Iterator<String> itEnumColumn;
		
		// 테이블 관련
		String tableName;
		Object objTable;
		JCoTable jCobjTable;
		Iterator<String> itEnumTable;
		List<Map<String,Object>> listTable;
		
		// 인터페이스 관련
		String ifName;
		JCoParameterList jCoParameterList;
		Map<String,SapJcoRfcMetaFunction> tableInfo; 
		Map<String, Map<String, SapJcoRfcMetaFunction>> tableInfos;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();
		
		// 기존에 등록한 키 값을 사용하여 재 실행
		tableInfos = this.metaTable.get(ifName);
		
		if(!Objects.isNull(tableInfos))
		{
			jCoParameterList = this.tables.get(ifName);
			
			// 컬럼 리스트를 순환하기 위하여 메타 변수 할당
			itEnumTable = tableInfos.keySet().iterator();
			
			// 컬럼을 순환하면서 JCO에 테이블을 확인한다.
			while(itEnumTable.hasNext())
			{
				// 테이블을 불러온다.
				tableName = itEnumTable.next();
	
				// 인자로 넘어간 파라미터를 불러온다.
				objTable    = parameterList.get(tableName);

				// 테이블 정보가 들어 오지 않은 경우 = 넘어간다
				// 테이블 정보가 List 일 경우     = 그대로 캐스팅
				// 테이블 정보가 Map 일 경우      = 리스트로 맵핑
				// 그 외의 경우는 넘어간다.
				if(Objects.isNull(objTable))
				{
					continue;
				}
				else if(objTable instanceof List)
				{
					listTable = (List<Map<String,Object>>)objTable;
				}
				else if(objTable instanceof Map)
				{
					listTable = Arrays.asList(((Map<String,Object>)objTable));
				}
				else 
				{
					continue;
				}
				
				// JCO에 등록 된 테이블 정보를 불러온다.
				jCobjTable  = jCoParameterList.getTable(tableName);
	
				// 기존에 등록 된 행이 있을 경우 이전 등록 행은 삭제한다.
				jCobjTable.deleteAllRows();
				
				tableInfo = tableInfos.get(tableName);
				
				columnSet = tableInfo.keySet();
				
				// 테이블에 등록할 데이터를 순회
				for(Map<String,Object> row : listTable)
				{
					// 테이블에 한 행을 등록하고 시작
					jCobjTable.appendRow();
					
					// 순환할 컬럼 리스트를 추출
					itEnumColumn = columnSet.iterator();
	
					// 컬럼을 순환하면서 JCO에 값을 등록
					while(itEnumColumn.hasNext())
					{
						columnName = itEnumColumn.next();
						columnType = tableInfo.get(columnName).getType();
						
						columnValue = sfd2022SapJcoMapper.cast(row.get(columnName), sfd2022SapJcoMapper.typeOf(columnType));
						
						jCobjTable.setValue(columnName, columnValue);
						
						trace("[{}] setImport = { {}(*{}*) : {} }", rfcManageID, columnName, tableName, columnValue);
					}
				}
			}
		}
	}
	
	
	@Override
	/**
	 * 모의 시행을 실시 하여 함수의 메타 정보를 추출한다.
	 * 
	 * @param ifName 
	 * 				함수명
	 * @return 실행 된 임이의 결과를 가진 객체
	 */
	public ResultSapJcoManager parse(String ifName) {
		
		// 연결을 할당
		JCoDestination jCoDestination  = getConnection(this.rfcDestination, autoCommit);

		// 저장소를 할당
		JCoRepository jCoRepository    = getRepository(jCoDestination, autoCommit);

		// 실행 할 함수를 할당
		JCoFunction jCoFunction        = getFunction(jCoRepository, ifName, autoCommit);
		
		// 입력, 출력 메타 파라미터 등록
		setMetaParameter(jCoFunction);

		// 함수 모의 실행 값을 반환
		return new Sfd2022ResultSapJcoManager(rfcManageID
										   , importMetaParam.get(ifName)
										   , exportMetaParam.get(ifName)
										   , metaTable.get(ifName));
	}

	/**
	 * 인자가 없는 함수 실행
	 * 
	 * @param ifName 
	 * 				함수명
	 * @return 실행 된 결과 값을 가진 맵 객체
	 */
	@Override
	public Map<String, Object> call(String ifName) { return call(ifName, new LinkedHashMap<String, Object>()); }
	
	/**
	 * 인자를 가진 원격 함수 호출을 위한 함수
	 * 
	 * @param ifName 
	 * 				함수명
	 * @param iparam 
	 * 				함수로 전송할 파라미터
	 * @return 실행 된 결과 값을 가진 맵 객체
	 */
	@Override
	public Map<String, Object> call(String ifName, Map<String, Object> iparam)
	{
		// 함수 처리 검증을 위한 변수 선언
		Long startTime, endTime;

		// 함수 시작 전 시간을 확인하기 위하여 현재 시간을 등록
		startTime = System.currentTimeMillis(); 
		
		// 반환 할 객체를 선언
		Map<String,Object> resultMap   = new LinkedHashMap<String, Object>();
		
		// 인자를 null로 입력할 경우 초기값 인자 등록
		if(Objects.isNull(iparam)){ iparam = new LinkedHashMap<String, Object>(); }
		
		// 연결을 할당
		JCoDestination jCoDestination  = getConnection(this.rfcDestination, autoCommit);
		
		// 저장소를 할당
		JCoRepository jCoRepository    = getRepository(jCoDestination, autoCommit);
		
		// 실행 할 함수를 할당
		JCoFunction jCoFunction        = getFunction(jCoRepository, ifName, autoCommit);
		
		// 입력, 출력 메타 파라미터 등록
		setMetaParameter(jCoFunction);

		// 입력 파라미터를 등록
		setImport(jCoFunction, iparam);

		// 함수 호출문 실행
		call(jCoFunction, jCoDestination);
		
		// 출력 파라미터를 등록
		setExport(jCoFunction, iparam, resultMap);

		// 반환 전 실행 시간을 검증
		endTime = System.currentTimeMillis();
		
		// 종료 시간을 출력
		trace("[{}] method total running time {} ms", rfcManageID, numberFormat.format(endTime - startTime));
		
		// 결과 값을 반환
		return resultMap;
	}
	
	/**
	 * 원격 함수를 호출하여 실행 결과를 반영 하는 함수
	 * 
	 * @param jCoFunction 
	 * 					호출할 원격 함수 객체
	 * @param jCoDestination 
	 * 					원격지와의 연결정보
	 */
	private void call(JCoFunction jCoFunction, JCoDestination jCoDestination)
	{
		
		String ifName = jCoFunction.getName();
		
		Long startTime, endTime;
		
		try 
		{
			// 호출 전 함수 호출 시간을 확인하기 위하여 현재 시간을 등록
			startTime = System.currentTimeMillis(); 

			// SAP 원격 함수 호출
			jCoFunction.execute(jCoDestination);
			
			// 호출 후 시간을 검증
			endTime = System.currentTimeMillis();
			
			trace("[{}] call = {} running time {} ms", rfcManageID, jCoFunction.getName(), numberFormat.format(endTime - startTime));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
			throw new CustomException("-1", "an error occurred while executing the function.");
		}
		
		// 함수 실행 시간 등록
		rfcCallTimes.add(endTime.compareTo(startTime));
		
		// 함수 실행 리스트 등록
		rfcCallNames.add(ifName);
	}

	/**
	 * 입력값을 반환하고 처리한다.
	 * @param jCoFunction
	 * 					SAP 연결 접속 정보
	 * @param parameterList
	 * 					SAP 연결 접속 정보
	 * @param resultMap
	 * 					출력 시 사용할 저장소
	 * @return
	 */
	private void setExport(JCoFunction jCoFunction, Map<String,Object> parameterList, Map<String,Object> resultMap) 
	{
		// 출력 파라미터를 등록
		setExportParameters(jCoFunction, parameterList, resultMap);
		
		// 출력 테이블을 등록
		setExportTables(jCoFunction, parameterList, resultMap);
	}
	
	/**
	 * 출력 파라미터를 등록한다.
	 * 
	 * @param jCoFunction
	 * 					SAP 연결 접속 정보
	 * @param parameterList
	 * 					SAP 연결 접속 정보
	 * @param resultMap
	 * 					출력 시 사용할 저장소
	 */
	private void setExportParameters(JCoFunction jCoFunction, Map<String,Object> parameterList, Map<String,Object> resultMap)
	{
		// 인자값을 확인하기 위한 변수
		JCoParameterList jCoParameterList;
		Map<String, SapJcoRfcMetaFunction> outMap;
		Iterator<String> itEnumCol;
		String colName;
		Object colValue;
		String ifName;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();
		
		// 기존에 등록한 키 값을 사용하여 재 실행
		outMap = this.exportMetaParam.get(ifName);
		
		jCoParameterList = exports.get(ifName);
		
		if(!Objects.isNull(jCoParameterList))
		{
			// 컬럼 리스트를 순환하기 위하여 메타 변수 할당
			itEnumCol = outMap.keySet().iterator();
			
			// 컬럼을 순환하면서 반환값을 등록한다.
			while(itEnumCol.hasNext())
			{
				colName  = itEnumCol.next();
				colValue = jCoParameterList.getValue(colName);
				
				resultMap.put(colName, colValue);
				
				trace("[{}] setExport = { {} : {} }", rfcManageID, colName, colValue);
			}
			
			// 결과값을 등록
			this.rfcCallResult.add(resultMap);
		}
	}
	
	/**
	 * 테이블 정보를 출력으로 등록한다.
	 * 
	 * @param jCoFunction
	 * 					SAP 연결 접속 정보
	 * @param parameterList
	 * 					SAP 연결 접속 정보
	 * @param resultMap
	 * 					출력 시 사용할 저장소
	 */
	private void setExportTables(JCoFunction jCoFunction, Map<String,Object> parameterList, Map<String,Object> resultMap)
	{
		// 인자값을 확인하기 위한 변수
		String ifName;
		JCoParameterList jCoParameterList;
		Map<String, Map<String, SapJcoRfcMetaFunction>> tableMap;
		

		int colCount;
		Object colValue;
		String tabName, colName;
		JCoMetaData jCoMetaData;
		Iterator<String> itEnumTab;
		JCoTable jcoTable;
		List<Map<String,Object>> exportTable;
		Map<String,Object> exportRow;
		
		// 확인을 위하여 함수 명칭을 가져온다.
		ifName = jCoFunction.getName();
		
		// 메타 테이블의 등록 여부를 확인하여
		jCoParameterList = this.tables.get(ifName);
		
		// 등록 되지 않을 경우 이후 처리를 하지 않는다.
		if(!Objects.isNull(jCoParameterList))
		{
			// 기존에 등록한 키 값을 사용하여 재 실행
			tableMap = this.metaTable.get(ifName);
			
			// 컬럼 리스트를 순환하기 위하여 메타 변수 할당
			itEnumTab = tableMap.keySet()
									.iterator();
			
			// 컬럼(테이블)을 순환하면서 반환값을 등록한다.
			while (itEnumTab.hasNext())
			{
				tabName = itEnumTab.next();

				// 입력 테이블로 등록 된 경우 출력 테이블은 사용하지 않는다. 
				if (parameterList.containsKey(tabName))
				{
					continue;
				}
				
				jcoTable    = jCoParameterList.getTable(tabName);
				jCoMetaData = jcoTable.getMetaData();

				// 빈 테이블일 경우 넘어 간다.
				if (jcoTable.isEmpty())
				{
					trace("[{}] setExport = { {}(*TABLE*) is empty }", rfcManageID, tabName);
					continue;
				}
				
				// 데이터를 담을 리스트 객체를 생성
				exportTable = new ArrayList<Map<String,Object>>();
				
				do {
					
					// 한 행을 생성
					exportRow = new LinkedHashMap<String, Object>();
					
					// 순환할 컬럼을 확인
					colCount = jcoTable.getNumColumns();
					
					// 전체 컬럼을 순환하면서 출력 값을 등록
					for ( int colpos = 0 ; colpos < colCount ; colpos++ )
					{
						colName  = jCoMetaData.getName(colpos);
						colValue = jcoTable.getValue(colpos);
						
						exportRow.put(colName, colValue);
					}
					
					exportTable.add(exportRow);
				}
				while(jcoTable.nextRow()); // 마지막행이 돌아올 때 까지 처리
				
				// 테이블을 등록한다.
				resultMap.put(tabName, exportTable);

				// 테이블을 출력한다.
				printTable(tabName, exportTable);
			}
			
			// 결과값을 등록
			this.rfcCallResult.add(resultMap);
		}
	}
	
	/**
	 * 테이블을 로그로 출력한다.
	 * @param tableName
	 * 				테이블명
	 * @param exportTable
	 * 				출력할 테이블 데이터
	 */
	private void printTable(String tableName, List<Map<String,Object>> exportTable)
	{
		// 로깅을 사용하여 테이블을 출력한다.
		trace("[{}] setExport = { {}(*TABLE*) export {} rows }", rfcManageID, tableName, exportTable.size());
		
		// 디버그 모드일 경우 테이블 출력을 활성화 한다.
		if(log.isDebugEnabled() && exportTable.size() > 0)
		{
			// 테이블 포맷 형식으로 출력
			printTableFormat(tableName, exportTable);
		}
	}
	
	/**
	 * 메시지를 추상화 하기 위한 로그 출력 함수
	 * @param logMessage
	 * 			로그 메시지
	 * @param args
	 * 			로그 파라미터
	 */
	private void trace(String logMessage, Object...args)
	{
		// 로그를 출력
		log.info(logMessage, args);
	}
	
	/**
	 * 테이블 포맷 형식으로 출력하기 위한 내부 출력 함수
	 * 
	 * @param tableName
	 * 				테이블 명칭
	 * @param exportTable
	 * 				출력 할 테이블 객체
	 */
	private void printTableFormat(String tableName, List<Map<String,Object>> exportTable)
	{
		Map<String,Object> headData = exportTable.get(0);
		
		StringBuilder table = new StringBuilder();
		StringBuilder head  = new StringBuilder();
		StringBuilder body  = new StringBuilder();
		String headTitle;
		
		Iterator<String> keyItems = headData.keySet().iterator();
		
		while(keyItems.hasNext())
		{
			headTitle = keyItems.next();
			
			if(headTitle.length() < 20)
			{
				head.append(String.format("| %-20s", headTitle));
			}
			else
			{
				head.append(String.format("| %-"+(headTitle.length()+10)+"s", headTitle));
			}
		}
		
		head.append("|");
		
		// 테이블 출력
		String bodyTitle;
		String bodyData;
		for(int row = 0 ; row < exportTable.size() ; row++)
		{
			Map<String,Object> rowData = exportTable.get(row);
			Iterator<String> bodyItems = rowData.keySet().iterator();
			
			while(bodyItems.hasNext())
			{
				bodyTitle = bodyItems.next();
				bodyData  = rowData.get(bodyTitle).toString();
				
				if(bodyTitle.length() < 20)
				{
					if(bodyData.length() > 20)
					{
						bodyData = bodyData.substring(0, 17)+"...";
					}
					
					body.append(String.format("| %-20s", bodyData));
				}
				else
				{
					if(bodyData.length() > bodyTitle.length()+10)
					{

						bodyData = bodyData.substring(0, bodyTitle.length()+7)+"...";
					}
					
					body.append(String.format("| %-"+(bodyTitle.length()+10)+"s", bodyData));
				}
			}
			
			body.append("|\n");
		}
		
		String enter = "\n";
		String repeatLineT = "+"+repeat("-",head.length()-2)+"+";
		String repeatLineB = "+"+repeat("=",head.length()-2)+"+";
		String tableLabName = String.format("| Table Name is %-"+(head.length()-17)+"s|", tableName);
		
		// 테이블 형식대로 생성한다.
		table.append(enter)
			 .append(repeatLineT)
			 .append(enter)
			 .append(tableLabName)
			 .append(enter)
			 .append(repeatLineT)
			 .append(enter)
			 .append(head.toString())
			 .append(enter)
			 .append(repeatLineB)
			 .append(enter)
			 .append(body.toString())
			 .append(repeatLineT);
			 
		// 테이블 출력
		log.debug("{}", table.toString());
	}

	/**
	 * 문자를 반복하는 함수
	 * 
	 * @return 함수 실행 결과
	 */
	public String repeat(String t, int c)
	{
		String r = "";
		
		for(int e = 0 ; e < c ; e++)
		{
			r += t;
		}
		
		return r;
	}
	
	/**
	 * 실행 결과를 반환하는 함수
	 * 
	 * @return 함수 실행 결과
	 */
	public ResultSapJcoManager getResult()
	{
		// 실행 결과를 반환
		return new Sfd2022ResultSapJcoManager(rfcManageID, rfcCallNames, rfcCallTimes, rfcCallResult);
	}
	
	/**
	 * 자동 상태 반영 여부를 가져오는 함수
	 * @return
	 */
	public boolean isAutoCommit() {
		return autoCommit;
	}

	/**
	 * 자동 상태 반영 여부를 반영하는 함수
	 * @return
	 */
	public void setAutoCommit(boolean autoCommit) {
		this.autoCommit = autoCommit;
	}

	/**
	 * 원격 함수의 처리 정보가 등록 되는 클래스
	 * @author jhlee
	 * @since 2022-05-15
	 */
	public class SapJcoRfcMetaFunction {
		
		public SapJcoRfcMetaFunction(int type, String typeName, String description) {
			super();
			this.type = type;
			this.typeName = typeName;
			this.description = description;
		}

		public int getType() {
			return type;
		}
		
		public void setType(int type) {
			this.type = type;
		}
		
		public String getDescription() {
			return description;
		}
		
		public void setDescription(String description) {
			this.description = description;
		}

		public String getTypeName() {
			return typeName;
		}

		public void setTypeName(String typeName) {
			this.typeName = typeName;
		}

		/** SAP 메타 타입 */
		private int type;
		
		/** SAP 메타 타입명 */
		private String typeName;
		
		/** SAP 메타 코맨트 */
		private String description;

		@Override
		public String toString() {
			return "SapJcoRfcMetaFunction [type=" + type + ", description=" + description + "]";
		}
	}
	
	
	/**
	 * 원격 함수의 실행 결과가 등록 된 레포팅 클래스
	 * @author jhlee
	 * @since 2022-05-15
	 */
	public class Sfd2022ResultSapJcoManager implements ResultSapJcoManager {
		
		public Sfd2022ResultSapJcoManager(Long rfcManageID, List<String> rfcCallNames,
				List<Integer> rfcCallTimes, List<Map<String, Object>> rfcCallResult) {
			super();
			this.rfcManageID   = rfcManageID;
			this.rfcCallCount  = rfcCallNames.size();
			this.rfcCallNames  = rfcCallNames;
			this.rfcCallTimes  = rfcCallTimes;
			this.rfcCallResult = rfcCallResult;
			this.printSwitch   = true;
		}
		
		public Sfd2022ResultSapJcoManager(Long rfcManageID
			, Map<String, SapJcoRfcMetaFunction> importMetaParam
			, Map<String, SapJcoRfcMetaFunction> exportMetaParam
			, Map<String, Map<String, SapJcoRfcMetaFunction>> metaTable) {
			super();
			this.rfcManageID     = rfcManageID;
			this.rfcCallCount    = 0;
			this.importMetaParam = importMetaParam;
			this.exportMetaParam = exportMetaParam;
			this.metaTable       = metaTable;
			this.printSwitch     = false;
		}
		
		/* 읽기 전용 함수 */
		public Long getRfcManageID() {
			return rfcManageID;
		}
		
		/* 읽기 전용 함수 */
		public int getRfcCallCount() {
			return rfcCallCount;
		}
		
		/* 읽기 전용 함수 */
		public List<String> getRfcCallNames() {
			return rfcCallNames;
		}
		
		/* 읽기 전용 함수 */
		public List<Integer> getRfcCallTimes() {
			return rfcCallTimes;
		}
		
		/* 읽기 전용 함수 */
		public List<Map<String, Object>> getRfcCallResult() {
			return rfcCallResult;
		}
		
		public Map<String, SapJcoRfcMetaFunction> getImportMetaParameters() {
			return importMetaParam;
		}
		
		public Map<String, SapJcoRfcMetaFunction> getExportMetaParameters() {
			return exportMetaParam;
		}
		
		public Map<String, Map<String, SapJcoRfcMetaFunction>> getMetaTable() {
			return metaTable;
		}
		
		/* 읽기 전용 함수 */
		public Map<String, Object> getResult(int rfcCallIndex) 
		{
			// 결과 값이 없을 경우 마지막 결과값 추출
			if(rfcCallIndex < 0)
			{
				 return null;
			}
			else
			{
				if(rfcCallCount <= rfcCallIndex)
				{
					log.warn("[{}] result = { message : Index {} out of bounds for length {} }"
							, rfcManageID, rfcCallIndex, rfcCallCount-1);
					
					return null;
				}
				else
				{
					return rfcCallResult.get(rfcCallIndex);
				}
			}
		}
		
		/* 읽기 전용 함수 */
		public Map<String, Object> getResult() {
			
			// 결과값이 없을 경우 빈값 반환
			if(Objects.isNull(rfcCallResult))
			{
				return null;
			}
			
			// 결과 값이 없을 경우 마지막 결과값 추출
			if(rfcCallCount == 0)
			{
				 return null;
			}
			else
			{
				return rfcCallResult.get(rfcCallCount-1);
			}
		}

		/** 고유 RFC 관리 객체 아이디 */
		private Long          rfcManageID;
		
		/** 실행 된 함수의 개수를 카운트 하는 변수 */
		private int           rfcCallCount;
		
		/** 실핼 될 함수의 결과 값을 저장하는 변수 */
		private List<String>  rfcCallNames = null;
		
		/** 실행 된 함수의 실행 시간을 저장하는 변수 */
		private List<Integer> rfcCallTimes = null;
		
		/** 
		 * 두 상이한 기능을 한 클래스에서 제공하므로 프린트 스위치를 두어 처리 
		 * 추후 클래스로 분리 할 생각이나 해당 기능은 SAP 경과 확인 후 작업 예정 */
		private boolean printSwitch = true;

		/** 실행 된 함수의 실행 결과를 저장하는 변수 */
		private List<Map<String,Object>> rfcCallResult = null;
		
		/** 함수 실행 시 사용 된 함수별 입력 인자 메타 정보 */ 
		private Map<String, SapJcoRfcMetaFunction> importMetaParam = null;
		
		/** 함수 실행 시 사용 된 함수별 출력 인자 메타 정보 */
		private Map<String, SapJcoRfcMetaFunction> exportMetaParam = null;
		
		/** 함수 실행 시 사용 된 함수별 테이블 메타 정보 */
		private Map<String, Map<String, SapJcoRfcMetaFunction>> metaTable = null;

		@Override
		public String toString() {
			
			if(this.printSwitch)
			{
				return "ResultSapJcoManager [rfcManageID=" + rfcManageID + ", rfcCallCount=" + rfcCallCount
						+ ", rfcCallNames=" + rfcCallNames + ", rfcCallTimes=" + rfcCallTimes + ", rfcCallResult="
						+ rfcCallResult + "]";
			}
			else
			{
				return "ResultSapJcoManager [rfcManageID=" + rfcManageID + ", importMetaParam=" + importMetaParam.toString() + ", exportMetaParam=" + exportMetaParam.toString()
						+ ", metaTable=" + metaTable + "]";
			}
		}
	}
}
