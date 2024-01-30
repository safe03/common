package com.safecnc.comm.conf;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.AsyncConfigurerSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * 비동기 처리를 위한 빈을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see Executor
 */
@EnableAsync
public class ApplicationSyncronizeConfiguration extends AsyncConfigurerSupport {
	
	/**
	 * 비동기 처리를 위한 쓰래드 풀
	 * @return
	 */
	@Bean
	public AsyncTaskExecutor asyncTaskExecutor() {
		
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("safecncAsync");
        
        executor.initialize();
        
        return executor;
	}
	
	@Override
	public Executor getAsyncExecutor() {
		
		return asyncTaskExecutor();
	}
}
