package com.safecnc.comm.dimn;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.safecnc.comm.rtlm.AbstractMapper;
import com.safecnc.web.exception.CustomException;
import com.sap.conn.jco.JCoMetaData;
import com.sap.conn.jco.ext.DestinationDataProvider;

/**
 * RFC접속과 관련 된 </br>
 * 고유 지원 자원 제공 클래스 필요시 접속 권한을 이양 받아 접속 정보를 일반화 한다.</br>
 * 
 * @since 2022-05-16
 * @author jhlee
 * 
 * @see AbstractMapper
 * @see DestinationDataProvider
 * @see SapJcoProvideProperties
 */
public class SapJcoMapper {	
	
    /**
     * [ SAP TYPE ]
     * 
     * 1. char -> [ TYPE_CHAR ] -> String
     * 2. nchar -> [ TYPE_NUM ] -> String
     * 3. string -> [ TYPE_STRING ] -> String
     */
    public static final Class<?> JAVA_LANG_STRING = java.lang.String.class;
    
    /**
     * [ SAP TYPE ]
     * 
     * 1. binary -> [ TYPE_BYTE ] -> Byte[]
     */
    public static final Class<?> JAVA_LANG_LBYTE = java.lang.Byte[].class;
    
    /**
     * [ SAP TYPE ]
     * 
     * 1. date -> [ TYPE_DATE ] -> Date
     * 2. date -> [ TYPE_TIME ] -> Date
     */
    public static final Class<?> JAVA_LANG_DATE = java.util.Date.class;
    
    /**
     * [ SAP TYPE ]
     * 
     * 1. decfloat -> [ TYPE_DECF16 ] -> BigDecimal
     * 2. decfloat16 -> [ TYPE_DECF34 ] -> BigDecimal
     * 3. decfloat34 -> [ TYPE_BCD ] -> BigDecimal
     */
    public static final Class<?> JAVA_LANG_BIGDECIMAL = java.math.BigDecimal.class;
    
    /**
     * [ SAP TYPE ]
     * 
     * 1. float -> [ TYPE_FLOAT ] -> Double
     */
    public static final Class<?> JAVA_LANG_DOUBLE = java.lang.Double.class;
    
    /**
     * [ SAP TYPE ]
     * 
     * 1. int -> [ TYPE_INT ] -> Integer
     * 2. int -> [ TYPE_INT1 ] -> Integer
     * 3. int -> [ TYPE_INT2 ] -> Integer
     */
    public static final Class<?> JAVA_LANG_INTEGER = java.lang.Integer.class;
    
    /**
     * 인자 값을 원하는 타입으로 변환하기 위한 함수
     * 
     * @param type 변환 할 타입명
     * @return
     */
	public Class<?> typeOf(int type)
	{
		// 변환 가능한 타입일 경우 변환 가능한 타입 반환
		if(FieldTypeMapper.containsKey(type))
		{
			return FieldTypeMapper.get(type);
		}
		
		return null; 
	}
	
    /**
     * 인자 값을 원하는 타입으로 변환하기 위한 함수
     * 
     * @param E 인자 타입
     * @param e 인자 값
     * @return
     * @throws Exception 
     */
	public <Q> Q cast(Object value, Class<Q> type) {
		
		Q returnValue = null;
		
		// 문자열 타입일 경우 [value] 값에 따라 대응하도록 처리
		// 그 외의 타입의 경우 상위 매핑 클래스에 따라 동적 캐스팅 처리
		if(type == Date.class) 
		{
			// 문자열일 경우 Date 타입으로 전환 후 적용
			if(value instanceof String)
			{
				String regexpr;
				String str_value        = (String)value;
				Iterator<String> regSet = SimpleDateFormat.keySet().iterator();
				
				// 문자열 매칭에 적용시켜 날짜 형식을 확인
				while(regSet.hasNext())
				{
					regexpr = regSet.next();
					
					if((str_value).matches(regexpr))
					{
						try 
						{
							returnValue = type.cast( SimpleDateFormat.get(regexpr).parse(str_value));	
						} 
						catch (ParseException e) 
						{
							throw new CustomException("-1", "input parameter data type check please");
						}
					}
				}
			}
			else if(value instanceof Date)
			{
				returnValue = type.cast(returnValue);
			}
			else
			{
				//@ 그 외의 상황은 확인 후 추가 작성
			}
		}
		else
		{
			returnValue = type.cast(value);
		}
		
		return returnValue;
	}
	
	/** 입력 & 출력 매핑을 위한 고유 지원 변수 */
	public Map<String, DateFormat> SimpleDateFormat = Stream.of(new Object[][] {
		{ "\\d{8}", new SimpleDateFormat("yyyyMMdd") },
		{ "\\d{14}", new SimpleDateFormat("yyyyMMddHHmmss") },
		{ "\\d{4}-\\d{2}-\\d{2}", new SimpleDateFormat("yyyy-MM-dd") },
		{ "\\d{4}/\\d{2}/\\d{2}", new SimpleDateFormat("yyyy/MM/dd") },
		{ "\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss") },
		{ "\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\.\\d{3}", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS") }
	}).collect(Collectors.toMap(new Function<Object[], String>() {
		@Override public String apply  (Object[] field) { return (String)  field[0]; }
	}, new Function<Object[], DateFormat>(){
		@Override public DateFormat apply (Object[] field) { return (DateFormat) field[1]; }
	})); 
	
	/** 입력 & 출력 매핑을 위한 고유 지원 변수 */
	private Map<Integer, Class<?>> FieldTypeMapper = Stream.of(new Object[][] {
		
		/** String type */
		{JCoMetaData.TYPE_CHAR ,SapJcoMapper.JAVA_LANG_STRING},
		{JCoMetaData.TYPE_NUM ,SapJcoMapper.JAVA_LANG_STRING},
		{JCoMetaData.TYPE_STRING ,SapJcoMapper.JAVA_LANG_STRING},
		
		/** Binarry Array type */
		{JCoMetaData.TYPE_BYTE ,SapJcoMapper.JAVA_LANG_LBYTE},
		{JCoMetaData.TYPE_XSTRING ,SapJcoMapper.JAVA_LANG_LBYTE},
		
		/** BigDecimal type */
		{JCoMetaData.TYPE_BCD ,SapJcoMapper.JAVA_LANG_BIGDECIMAL},
		{JCoMetaData.TYPE_DECF16 ,SapJcoMapper.JAVA_LANG_BIGDECIMAL},
		{JCoMetaData.TYPE_DECF34 ,SapJcoMapper.JAVA_LANG_BIGDECIMAL},
		
		/** Int type */
		{JCoMetaData.TYPE_INT ,SapJcoMapper.JAVA_LANG_INTEGER},
		{JCoMetaData.TYPE_INT1 ,SapJcoMapper.JAVA_LANG_INTEGER},
		{JCoMetaData.TYPE_INT2 ,SapJcoMapper.JAVA_LANG_INTEGER},
		
		/** Double type */
		{JCoMetaData.TYPE_FLOAT ,SapJcoMapper.JAVA_LANG_DOUBLE},
		
		/** Date type */
		{JCoMetaData.TYPE_DATE ,SapJcoMapper.JAVA_LANG_DATE},
		{JCoMetaData.TYPE_TIME ,SapJcoMapper.JAVA_LANG_DATE}
		
		/**
		 * Long type - find not support 
		 * {JCoMetaData.TYPE_INT8 ,JAVA_LANG_LONG}
		 */
	}).collect(Collectors.toMap(new Function<Object[], Integer>() {
		@Override public Integer apply  (Object[] field) { return (Integer)  field[0]; }
	}, new Function<Object[], Class<?>>(){
		@Override public Class<?> apply (Object[] field) { return (Class<?>) field[1]; }
	}));
	
}