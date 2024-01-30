package com.safecnc.comm.conf;

import java.util.Arrays;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.safecnc.web.domain.NexacroTransactionManagerFactory;
import com.safecnc.web.handler.CallableProcedureMappingResolver;
import com.safecnc.web.handler.DirectQueryMappingResolver;
import com.safecnc.web.handler.MethodMappingResolver;
import com.safecnc.web.handler.MybatisMappingResolver;
import com.safecnc.web.handler.TransactionHandlerMappingResolver;

/**
 * 넥사크로를 사용하기 위하여 UI 데이터 처리 및 반환값 처리에 사용할 고유 핸들러 빈들을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see NexacroTransactionManagerFactory
 * @see DirectQueryMappingResolver
 * @see CallableProcedureMappingResolver
 * @see MybatisMappingResolver
 * @see MethodMappingResolver
 */
public class ApplicationNexacroConfiguration {
	
	/**
	 * 넥사크로와 공통적으로 접속하기 위한 접속을 위한 생성자 빈
	 * 
	 * @param {@link ApplicationOSSConfiguration#mccubeExchangeFactory()} mccubeServiceFactory
	 * @return NexacroTransactionManagerFactory
	 */
	@Profile(value={"local", "test", "stage"})
	@Bean
	public NexacroTransactionManagerFactory nexacroDevTransactionManagerFactory() {
		
		NexacroTransactionManagerFactory nexacroTransactionManagerFactory = new NexacroTransactionManagerFactory();
		
		nexacroTransactionManagerFactory.setDataSource(dataSource);
		nexacroTransactionManagerFactory.setSqlSessionFactory(sqlSession);
		
		nexacroTransactionManagerFactory.setTransactionHandlerMappingResolvers(Arrays.asList(
			directQueryMappingResolver(),
			callableProcedureMappingResolver(),
			mybatisMappingResolver(),
			methodMappingResolver()
		));
		
		return nexacroTransactionManagerFactory;
	}
	
	/**
	 * 넥사크로와 공통적으로 접속하기 위한 접속을 위한 생성자 빈
	 * 
	 * @param {@link ApplicationOSSConfiguration#mccubeExchangeFactory()} mccubeServiceFactory
	 * @return NexacroTransactionManagerFactory
	 */
	@Profile(value={"prod"})
	@Bean
	public NexacroTransactionManagerFactory nexacroTransactionManagerFactory() {
		
		NexacroTransactionManagerFactory nexacroTransactionManagerFactory = new NexacroTransactionManagerFactory();
		
		nexacroTransactionManagerFactory.setDataSource(dataSource);
		nexacroTransactionManagerFactory.setSqlSessionFactory(sqlSession);
		
		nexacroTransactionManagerFactory.setTransactionHandlerMappingResolvers(Arrays.asList(
				directQueryMappingResolver(),
				callableProcedureMappingResolver(),
				mybatisMappingResolver(),
				methodMappingResolver()
				));
		
		return nexacroTransactionManagerFactory;
	}
	
	/**
	 * SQL을 직접 입력하여 처리하기 위한 처리기 빈
	 * 
	 * @return DirectQueryMappingResolver
	 */
	private TransactionHandlerMappingResolver directQueryMappingResolver() {
		
		return new DirectQueryMappingResolver();
	}

	/**
	 * 프로시져를 호출하기 위한 처리기 빈
	 * 
	 * @return CallableProcedureMappingResolver
	 */
	private TransactionHandlerMappingResolver callableProcedureMappingResolver() {
		
		CallableProcedureMappingResolver callableProcedureMappingResolver = new CallableProcedureMappingResolver();
		
		callableProcedureMappingResolver.setDatabase(dbName);
		callableProcedureMappingResolver.setDbvendor(dbvendor);
		
		return callableProcedureMappingResolver;
	}

	/**
	 * 마이바티스를 호출하기 위한 처리기 빈
	 * 
	 * @return MybatisMappingResolver
	 */
	private TransactionHandlerMappingResolver mybatisMappingResolver() {
		
		return new MybatisMappingResolver();
	}
	
	/**
	 * 메소드를 호출하기 위한 처리기 빈
	 * 
	 * @return MethodMappingResolver
	 */
	private TransactionHandlerMappingResolver methodMappingResolver() {
		
		return new MethodMappingResolver();
	}
	
	@Value("${datasource.db.name:SFD2022}")
	private String dbName;
	
	@Value("${datasource.db.vendor:MARIADB}")
	private String dbvendor;

	@Resource(name = "dataSource")
	private DataSource dataSource;
	
	@Resource(name = "sqlSession")
	private SqlSessionFactory sqlSession;
}
