package com.safecnc.comm.conf;

import javax.sql.DataSource;

import org.springframework.aop.Advisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 메시지 트랜잭션과 관련 된 빈을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Advisor
 * @see DataSource
 * @see Configuration
 * @see DataSourceTransactionManager
 */
@EnableTransactionManagement(proxyTargetClass = true)
public class ApplicationTransactionConfiguration {

	@Autowired
	private DataSource dataSource;

	@Bean
	public DataSourceTransactionManager dataSourceTransactionManager() {
		
		DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager();
		
		dataSourceTransactionManager.setDataSource(dataSource);
		
		return dataSourceTransactionManager;
	}

//	@Bean
//	public TransactionInterceptor transactionInterceptor(DataSourceTransactionManager txManager) {
//		
//		TransactionInterceptor transactionInterceptor = new TransactionInterceptor();
//		
//		transactionInterceptor.setTransactionManager(txManager);
//		
//		transactionInterceptor.setTransactionAttributeSource(nameMatchTransactionAttributeSource());
//		
//		return transactionInterceptor;
//	}
//
//	private NameMatchTransactionAttributeSource nameMatchTransactionAttributeSource() {
//		
//		NameMatchTransactionAttributeSource nameMatchTransactionAttributeSource = new NameMatchTransactionAttributeSource();
//		
//		nameMatchTransactionAttributeSource.setNameMap(transactionAttributeMap());
//		
//		return nameMatchTransactionAttributeSource;
//	}
//
//	private HashMap<String, TransactionAttribute> transactionAttributeMap() {
//		
//		HashMap<String, TransactionAttribute> transactionAttributeMap = new HashMap<String, TransactionAttribute>();
//
//		RuleBasedTransactionAttribute ruleBasedTransactionAttribute = new RuleBasedTransactionAttribute();
//		
//		ruleBasedTransactionAttribute.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
//		
//		ruleBasedTransactionAttribute.setRollbackRules(Collections.singletonList(new RollbackRuleAttribute(Exception.class)));
//		
//		transactionAttributeMap.put("*", ruleBasedTransactionAttribute);
//		
//		return transactionAttributeMap;
//	}
	
}
