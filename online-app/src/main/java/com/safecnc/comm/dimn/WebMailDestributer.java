package com.safecnc.comm.dimn;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

public class WebMailDestributer {
	
	public WebMailDestributer(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	private JavaMailSender javaMailSender;
	
	private Map<String,List<MimeMessage>> mp = new LinkedHashMap<String, List<MimeMessage>>();
	private Map<String,List<MimeMessage>> sl = new LinkedHashMap<String, List<MimeMessage>>();
	private Map<String,List<MimeMessage>> fl = new LinkedHashMap<String, List<MimeMessage>>();
	
	public boolean posting(String fromPost, String toPost, String subject, String sendMessage) {

		return posting(toPost, new Function<MimeMessageHelper,Boolean>(){

			@Override
			public Boolean apply(MimeMessageHelper messageHelper) {

				try {
					messageHelper.setFrom(fromPost);
					messageHelper.setSubject(subject);
					
					// 단문 전송이므로 단문에 대한 처리
					messageHelper.setText(sendMessage);
				} catch (MessagingException e) {
					return false;
				}
				
				return true;
			}
		});
	}
	
	public boolean posting(String toPost, Function<MimeMessageHelper, Boolean> mailCallback) {
		
		if(Objects.isNull(javaMailSender)) {
			throw new RuntimeException("JavaMailSender is not exist");
		}
		
		MimeMessage newMessage = javaMailSender.createMimeMessage();
		
		try {
			
			MimeMessageHelper messageHelper = new MimeMessageHelper(newMessage, true);
			
			messageHelper.setTo(toPost);
			
			boolean isPosted = mailCallback.apply(messageHelper);
			
			if(isPosted) {
				
				if(!mp.containsKey(toPost)) {

					mp.put(toPost, new ArrayList<MimeMessage>());
				}
				
				// 전송 리스트에 추가
				List<MimeMessage> sendList = mp.get(toPost);
				
				sendList.add(newMessage);
			}
			
		} catch (MessagingException e) {
			
			return false;
		}
		
		
		return true;
	}
	
	public void registSuccess(String toPost, MimeMessage mimeMessage) {
		
		if(!sl.containsKey(toPost)) {
			sl.put(toPost, new ArrayList<MimeMessage>());
		}
		
		List<MimeMessage> ssl = sl.get(toPost);
		
		ssl.add(mimeMessage);
	}
	
	public void registFailed(String toPost, MimeMessage mimeMessage) {
		
		if(!fl.containsKey(toPost)) {
			fl.put(toPost, new ArrayList<MimeMessage>());
		}
		
		List<MimeMessage> fsl = fl.get(toPost);
		
		fsl.add(mimeMessage);
	}
	
	
	public void send(String fromPost, String toPost, String subject, String sendMessage) {
		
		// posting
		posting(fromPost, toPost, subject, sendMessage);
		
		// send
		send();
	}
	
	public void send() {
		
		List<MimeMessage> op;
		Object oo;
		MimeMessage ms;
		
		Iterator<String> postDests = mp.keySet().iterator();
		
		String dest;
		
		while(postDests.hasNext()) {
			
			dest = postDests.next();
			
			op = mp.get(dest);
			
			for(int q = 0 ; q < op.size() ; q++) 
			{
				oo = op.get(q);
				ms = (MimeMessage)oo;
				
				try {
					javaMailSender.send(ms);
					
					registSuccess(dest, ms);
					
				}
				catch(Exception ee) 
				{
					
					registFailed(dest, ms);
				}
			}
		}
		
		// post reset
		mp = new LinkedHashMap<String, List<MimeMessage>>();
	}
	
	public Map<String,List<MimeMessage>> getSuccesse() {
		
		return this.sl;
	}
	

	public Map<String,List<MimeMessage>> getFailed() {
		
		return this.fl;
	}
	
	public int getSuccesseCount() {
		
		return this.sl.size();
	}
	
	public int getFailedCount() {
		
		return this.fl.size();
	}
}
