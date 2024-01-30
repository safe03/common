package com.safecnc.comm.conf;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfiguration;

import lombok.extern.slf4j.Slf4j;


/**
 * 배치성 관련 서비스 및 빈들을 등록한다. </br>
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see SchedulingConfiguration
 */
@Slf4j
@Profile(value={"test"})
@Configuration
@EnableScheduling
public class ApplicationJobBatchConfiguration {
	
    @Scheduled(cron = "0 0 0/1 * * *")
    public void job() {
    	System.out.println("start");
        log.info("@@@@@ Batching Scheduled Execute Batch Time 60 Min @@@@@");
    }
    
    
}
