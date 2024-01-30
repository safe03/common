package com.safecnc.comm.dimn;

import com.sap.conn.jco.ext.DestinationDataProvider;

/**
 * JConnection을 사용하여 </br>
 * SAP와 연결하는 고유 설정 파일을 로드하는 JConneciton 지원 클래스</br>
 * 
 * @author jhlee
 * @since 2022-05-13
 * @see https://help.sap.com/docs
 */
public enum SapJcoProvideProperties {
	
    /**
	 * sap jco library local properties setting
     * Creates a JCo pool with the specified value for the SAP logon language. 
	 * [ English, EN, German, DE, Japanese, JA ]
	 * 
	 * @see DestinationDataProvider.JCO_LANG
	 */
	LANG("jco.client.lang", "client.lang", null),
	
	/**
	 * SAP client Number
	 * 
	 * @see DestinationDataProvider.JCO_CLIENT
	 */
	CLIENT("jco.client.client", "client.client", null),
	
	/**
	 * SAP system number
	 * 
	 * @see DestinationDataProvider.JCO_SYSNR
	 */
	SYSNR("jco.client.sysnr", "client.sysnr", null),
	
	/**
	 * SAP Logon user
	 * 
	 * @see DestinationDataProvider.JCO_USER
	 */
	USER("jco.client.user", "client.user", null),
	
	/**
	 * SAP Logon password
	 * 
	 * @see DestinationDataProvider.JCO_PASSWD
	 */
	PASSWORD("jco.client.passwd", "client.passwd", null),
	
	/**
	 * SAP message server
	 * 
	 * @see DestinationDataProvider.JCO_MSSERV
	 */
	MESSAGE_SERVER("jco.client.mshost", "client.mshost", null),
	
	/**
	 * SAP application server Domain Or IP
	 * 
	 * @see DestinationDataProvider.JCO_ASHOST
	 */
	APPLICATION_HOST("jco.client.ashost", "client.ashost", null),
	
	/**
	 * Group of SAP application servers
	 * 
	 * @see DestinationDataProvider.JCO_GROUP
	 */
	GROUP("jco.client.group", "client.group", null),
	
	/**
	 * SAP ERP name
	 * 
	 * @see DestinationDataProvider.JCO_R3NAME
	 */
	ERP_NAME("jco.client.r3name", "client.r3name", null),
	
	/**
	 * The connection is considered to have timed out 
	 * when there has been no activity 
	 * on it for the specified time interval.
	 * 
	 * @see DestinationDataProvider.JCO_R3NAME
	 */
	CONNECTION_TIMEOUT("jco.poolmgr.connectiontimeout", "poolmgr.connectiontimeout", "600000"),
	
	/**
	 * The maximum length of time, in milliseconds, 
	 * for the system to wait for a connection request when the pool is exhausted.
	 */
	MAX_WAIT_TIME("jco.poolmgr.maxwaittime", "poolmgr.maxwaittime", "30000"),
	
	/**
	 * The length of time, in milliseconds, 
	 * after which all connections are periodically checked for time-outs.
	 */
	TIMEOUT_CHECK_INTERVAL("jco.poolmgr.timeoutcheckinterval", "poolmgr.timeoutcheckinterval", "60000"),
	
	/**
	 * The absolute maximum number of connections
	 * that can be simultaneously opened for a given pool.
	 */
	MAX_CONNECTION("jco.pool.maxconn", "pool.maxconn", "15"),
	
    /**
     * The maximum number of connections 
	 * that can be kept open and managed in the pool
	 */
	MAX_POOL_SIZE("jco.pool.maxpoolsize", "pool.maxpoolsize", "10"),
	
	/** 
	 * Monitors the time it takes to run ABAP function modules 
	 * and writes the statistics to the monitor log file.
	 * { 0 : disabled, 1 : enabled } 
	 */
	MONITOR("jco.performance.monitor", "performance.monitor", "0"),
	
	/**
	 * The intervals, in milliseconds, at which the statistics for the execution 
	 * times of ABAP function modules are written to the log file.
	 */
	MONITOR_INTERVAL("jco.performance.monitor.interval", "performance.monitor.interval", "300000"),

	/**
	 * Monitors the JCo pool and writes the statistics to the monitor log file.
	 * { 0 : disabled, 1 : enabled }
	 */
	POOL_MONITOR("jco.pool.monitor", "pool.monitor", "0"),
	
	/**
	 * The intervals, in milliseconds, 
	 * at which the statistics on the JCo pool size are written to the log file.
	 */
	POOL_MONITOR_INTERVAL("jco.pool.monitor.interval", "pool.monitor.interval", "300000");
	
	/** 고유지를 확인하기 위하여 선언 */
	public final static String destination = "SAP";
	
	/** 설정값의 prefix를 확인하기 위하여 선언 */
	private final static String prefix = "sfd2022.sap.";
	
	/** 설정값의 suffix를 확인하기 위하여 선언 */
	private final static String suffix = "";
	
	private String value; 
	private String property;
	private String defaultValue;
	
	private SapJcoProvideProperties(String value, String property, String defaultValue) {
		this.value = value;
		this.property = prefix + property + suffix;
		this.defaultValue = defaultValue;
		
	}
	
	public String getName() {
		
		return this.value;
	}
	
	public String getPropertyName() {
		
		return this.property;
	}
	
	public String getDefaultValue() {
		
		return this.defaultValue;
	}
	
	public static boolean isDestination(String destination) {
		
		return SapJcoProvideProperties.destination.equals(destination);
	}
	
	public static SapJcoProvideProperties[] getNames() {
		
		return new SapJcoProvideProperties[] {
				LANG, SYSNR, CLIENT, USER, PASSWORD, MESSAGE_SERVER, GROUP, ERP_NAME, APPLICATION_HOST, 
				CONNECTION_TIMEOUT, MAX_WAIT_TIME, TIMEOUT_CHECK_INTERVAL, 
				MAX_CONNECTION, MAX_POOL_SIZE, 
				MONITOR, MONITOR_INTERVAL,
				POOL_MONITOR, POOL_MONITOR_INTERVAL
		};
	}
}

