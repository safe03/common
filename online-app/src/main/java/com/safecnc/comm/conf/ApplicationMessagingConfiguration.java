package com.safecnc.comm.conf;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.safecnc.comm.anno.WebSocket;
import com.safecnc.comm.conf.ApplicationMessagingConfiguration.MailMessageConfiguration;
import com.safecnc.comm.dimn.WebMailDestributerFactory;

import lombok.extern.slf4j.Slf4j;

/**
 * 애플리케이션단의 메시징 처리를 위한 빈들을 등록한다. </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see ApplicationMessagingConfiguration
 * @see WebSocketMessageBroker
 */
@Slf4j
// @EnableKafka
@Import({
	MailMessageConfiguration.class
})
public class ApplicationMessagingConfiguration {

	/**
	 * Mail 전송을 위한 메시지 템플릿 설정 파일
	 */
	@Configuration
	class MailMessageConfiguration {
		
		@Bean
		public WebMailDestributerFactory WebMailDestributerFactory() {
			
			return new WebMailDestributerFactory();
		}
		
		@Bean
		public JavaMailSender mailsender() {
			
			JavaMailSenderImpl javaMailSenderImpl = new JavaMailSenderImpl();
			javaMailSenderImpl.setHost(host);
			javaMailSenderImpl.setPort(Integer.parseInt(port));
			javaMailSenderImpl.setProtocol(protocol);
			javaMailSenderImpl.setUsername(username);
			javaMailSenderImpl.setPassword(password);
			javaMailSenderImpl.setDefaultEncoding("utf-8");
			
			Properties javaMailProperties = new Properties();
			
			// extension here
			// javaMailProperties.put("element", "value");
			javaMailSenderImpl.setJavaMailProperties(javaMailProperties);
			return javaMailSenderImpl;
		}

		@Value("${mails.mail.protocol:}")                String protocol;
		@Value("${mails.mail.server.host:}")             String host;
		@Value("${mails.mail.server.port:}")             String port;
		@Value("${mails.mail.server.username:}")         String username;
		@Value("${mails.mail.server.password:}")         String password;
		@Value("${mails.mail.server.encoding:utf-8}")    String encoding;
		
	}
	
	
	/**
	 * 신뢰성 소켓과 관련된 빈을 등록한다. </br> 
	 * 
	 * @author jhlee
	 * @since 2022-02-13
	 * @see Configuration
	 * @see WebSocketConfigurer
	 */
	@Configuration
	@EnableWebSocket
	class AplusWebSocketConfiguration implements WebSocketConfigurer, ApplicationContextAware{

		/* annotation web socket handlers */
		private Map<String, WebSocketHandler> webSocketHandlers = new HashMap<String, WebSocketHandler>();
		
		@Override
		public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
			
			WebSocket aplusWebSocket;
			
			// registration websocket handle
			Map<String, Object> handlers;
			
			// url mapping rule set
			Set<String> urlMappingRuleset;
			
			// List of url 
			String[] LMappingUrl;
			
			handlers = applicationContext.getBeansWithAnnotation(WebSocket.class);
			
			urlMappingRuleset = handlers.keySet();
			
			for(String mapping : urlMappingRuleset) {
				
				Object sockHandler = handlers.get(mapping);
				
				//- if typeof WebSocketHandler, will regist application container
				if(sockHandler instanceof WebSocketHandler) {
					
					aplusWebSocket = sockHandler.getClass().getAnnotation(WebSocket.class);
					
					LMappingUrl = aplusWebSocket.url();
					
					for(String sMappingUrl : LMappingUrl) {
						
						log.info("connection mapping - {}", sMappingUrl);
						
						webSocketHandlers.put(sMappingUrl, WebSocketHandler.class.cast(sockHandler));
					}
				}
			}
		}
		
		@Override
		public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
			
			Set<String> mappingSet = webSocketHandlers.keySet();
			
			for(String mappingRegistry : mappingSet) 
			{	
				WebSocketHandler mappingHandler = webSocketHandlers.get(mappingRegistry);
				
				registry.addHandler(mappingHandler, mappingRegistry);
				registry.addHandler(mappingHandler, mappingRegistry).withSockJS();
			}
		}
	}
	
	//@Configuration
	//@EnableWebSocketMessageBroker
	@Deprecated
	@Description("메시징을 처리하는 화면이 없으므로 작업분 제외 추후 작업이 필요할 경우 다시 오픈한다.")
	class WebSocketMessageBroker implements WebSocketMessageBrokerConfigurer{

		@Value("${integrate.connect.endpoints:/ws}")
		private String connectEndPoint;
		
		@Value(value = "${integrate.connect.prefix.url:/message}")
		private String connectMapping;

		@Value(value = "${integrate.connect.prefix.dest:/topic}")
		private String connectDestPrefix;

		@Value("${integrate.connect.host:127.0.0.1}")
		private String connectHost;

		@Value("${integrate.connect.port:9092}")
		private String connectPort;
		
		@Value("${integrate.connect.interval.send:5000}")
		private String connectSendInterval;

		@Value("${integrate.connect.interval.receive:5000}")
		private String connectReceiveInterval;
		
	    @Override
	    public void registerStompEndpoints(StompEndpointRegistry registry) {
	    	
	    	// websocket 과 socketjs를 사용한 endpoints를 추가한다.
	    	if(!Objects.isNull(connectEndPoint)) {
	    		
	    		String[] endpoints = connectEndPoint.split(",");

	            // [endpoint]로 종료 되는 모든 요청을 대상으로 정의한다.
	    		for(String endpoint : endpoints) {
	    			
	    			// default set open cors origin resource
	    	    	registry.addEndpoint(endpoint);
	    	    	registry.addEndpoint(endpoint).withSockJS();
	    		}
	    	}
	    }
	    
	    @Override
	    public void configureMessageBroker(MessageBrokerRegistry registry) {
	    	
	    	String[] LmappingPrefixes = connectMapping.split(",");
	    	String[] LmappingPrefixesTrim = new String[LmappingPrefixes.length];
	    	
	    	for(int i = 0 ; i < LmappingPrefixes.length ; i++) {
	    		
	    		LmappingPrefixesTrim[i] = LmappingPrefixes[i];
	    	}
	    	
	    	String[] LdestPrefixes = connectDestPrefix.split(",");
	    	String[] LdestPrefixesTrim = new String[LdestPrefixes.length];
	    	
	    	for(int i = 0 ; i < LdestPrefixes.length ; i++) {
	    		
	    		LdestPrefixesTrim[i] = LdestPrefixes[i];
	    	}
	    	
    		registry.enableSimpleBroker(LdestPrefixesTrim);
    		registry.setApplicationDestinationPrefixes(LmappingPrefixesTrim);
    		
    		
	    	//- Broker Relay Processing [[ Client > App > Broker > Kafka ]]
    		/*
    		registry.enableStompBrokerRelay(LdestPrefixesTrim)
    		        .setRelayHost(connectHost)
    		        .setRelayPort(Integer.parseInt(connectPort))
    		        .setSystemHeartbeatSendInterval(Long.parseLong(connectSendInterval))
    		        .setSystemHeartbeatReceiveInterval(Long.parseLong(connectReceiveInterval))
    		        ;
    		 */
	    }
	}
	
//	@Bean
//	public Sender sender(KafkaTemplate<Integer, String> template) {
//		return new Sender(template);
//	}
//
//	@Bean
//	public Listener listener() {
//		return new Listener();
//	}
//	
//	public class Sender {
//
//		private final KafkaTemplate<Integer, String> template;
//
//		public Sender(KafkaTemplate<Integer, String> template) {
//			this.template = template;
//		}
//
//		public void send(String toSend, int key) {
//			this.template.send("topic1", key, toSend);
//		}
//
//	}
//
//	public class Listener {
//
//		@KafkaListener(id = "listen1", topics = "topic1")
//		public void listen1(String in) {
//			System.out.println(in);
//		}
//
//	}
//
//	@Bean
//	public KafkaAdmin admin() {
//	    Map<String, Object> configs = new HashMap<>();
//	    configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//	    return new KafkaAdmin(configs);
//	}
//	
//	@Bean
//	public ConcurrentKafkaListenerContainerFactory<Integer, String> kafkaListenerContainerFactory(
//			ConsumerFactory<Integer, String> consumerFactory) {
//		ConcurrentKafkaListenerContainerFactory<Integer, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
//		factory.setConsumerFactory(consumerFactory);
//		return factory;
//	}
//
//	@Bean
//	public ConsumerFactory<Integer, String> consumerFactory() {
//		
//		return new DefaultKafkaConsumerFactory<Integer, String>(consumerProps());
//	}
//
//	private Map<String, Object> consumerProps() {
//		
//		Map<String, Object> props = new HashMap<String,Object>();
//		
//		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
//		props.put(ConsumerConfig.GROUP_ID_CONFIG, "group");
//		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, org.apache.kafka.common.serialization.IntegerDeserializer.class);
//		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, org.apache.kafka.common.serialization.StringDeserializer.class);
//		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
//
//		return props;
//	}
//
//
//	@Bean
//	public ProducerFactory<Integer, String> producerFactory() {
//		
//		return new DefaultKafkaProducerFactory<Integer, String>(senderProps());
//	}
//
//	private Map<String, Object> senderProps() {
//		
//		Map<String, Object> props = new HashMap<String, Object>();
//		
//		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
//		props.put(ProducerConfig.LINGER_MS_CONFIG, 10);
//		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, IntegerSerializer.class);
//		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//		
//		return props;
//	}
//
//	@Bean
//	public KafkaTemplate<Integer, String> kafkaTemplate(ProducerFactory<Integer, String> producerFactory) {
//		return new KafkaTemplate<Integer, String>(producerFactory);
//	}

}
