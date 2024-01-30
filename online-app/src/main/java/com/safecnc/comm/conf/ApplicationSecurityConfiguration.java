package com.safecnc.comm.conf;

import java.io.IOException;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.EnvironmentStringPBEConfig;
import org.jasypt.spring4.properties.EncryptablePropertyPlaceholderConfigurer;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import com.safecnc.comm.auth.AuthorizationHolder;
import com.safecnc.comm.auth.AuthorizationSessionStorage;


/**
 * 보안과 관련 된 처리 빈을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see AuthorizationHolder
 * @see AuthorizationSessionStorage
 * @see EnvironmentStringPBEConfig
 * @see StandardPBEStringEncryptor
 * @see PropertySourcesPlaceholderConfigurer
 * @see EncryptablePropertyPlaceholderConfigurer
 */
@PropertySource("classpath:application.properties")
public class ApplicationSecurityConfiguration implements ApplicationContextAware{
	
	//@Bean
	@Deprecated
	public AuthorizationHolder authorizationHolder(AuthorizationSessionStorage authorizationSessionStorage) {
		
		AuthorizationHolder authorizationHolder = new AuthorizationHolder();
		
		authorizationHolder.setAuthorizationSessionStorage(authorizationSessionStorage);

		return authorizationHolder;
	}

	//@Bean
	@Deprecated
	public AuthorizationSessionStorage authorizationSessionStorage() {
		
		return new AuthorizationSessionStorage();
	}
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.resourceReader = applicationContext;
		
		// jasypt security key
		this.str_jasyptKey = resourceReader.getEnvironment().getProperty("spring.security.prop.key","0000");
		
		this.strProfile    = resourceReader.getEnvironment().getActiveProfiles()[0];
	}
	
	@Profile(value={"local", "test", "stage"})
	@Bean
	public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() throws IOException {
		
		PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
		
		propertySourcesPlaceholderConfigurer.setFileEncoding("utf-8");
		
		propertySourcesPlaceholderConfigurer.setLocations(this.resourceReader.getResources("classpath:safecnc/properties/"+strProfile+"/*.properties"));
		
		return propertySourcesPlaceholderConfigurer;
	}
	
	@Profile(value = {"prod"})
	@Bean
	public EnvironmentStringPBEConfig environmentStringPBEConfig() {
		
		EnvironmentStringPBEConfig environmentStringPBEConfig = new EnvironmentStringPBEConfig();
		
		environmentStringPBEConfig.setAlgorithm(str_jasyptAlgorithm);
		environmentStringPBEConfig.setPassword(str_jasyptKey);
		
		return environmentStringPBEConfig;
	}
	
	@Profile(value = {"prod"})
	@Bean
	public StandardPBEStringEncryptor standardPBEStringEncryptor() {
		
		StandardPBEStringEncryptor standardPBEStringEncryptor = new StandardPBEStringEncryptor();
		
		standardPBEStringEncryptor.setConfig(environmentStringPBEConfig());
		
		return standardPBEStringEncryptor;
	}
	
	@Profile(value = {"prod"})
	@Bean
	public EncryptablePropertyPlaceholderConfigurer EncryptablePropertyPlaceholderConfigurer() throws IOException {
		
		EncryptablePropertyPlaceholderConfigurer encryptablePropertyPlaceholderConfigurer = new EncryptablePropertyPlaceholderConfigurer(standardPBEStringEncryptor());
		
		encryptablePropertyPlaceholderConfigurer.setFileEncoding("utf-8");
		
		encryptablePropertyPlaceholderConfigurer.setLocations(this.resourceReader.getResources("classpath:safecnc/properties/"+strProfile+"/*.jasypt"));
		
		return encryptablePropertyPlaceholderConfigurer;
	}
	
	final String str_jasyptAlgorithm = "PBEWithMD5AndDES";
	
	private String str_jasyptKey;
	
	private ApplicationContext resourceReader;

	private String strProfile;

}
