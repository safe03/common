package com.safecnc.comm.scrt;

import java.security.MessageDigest;

import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 애플리케이션에서 사용할 기본 비밀번호 변환기 기본 SHA256으로 변환한다.<br/>
 * 
 * @author jhlee
 * @since 2022-05-16
 * @see PasswordEncoder
 * @see MessageDigest
 */
public class NexacroPasswordEncoder implements PasswordEncoder {

	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
		
		System.out.println(rawPassword);
		System.out.println(getSHA256(rawPassword.toString()));
		System.out.println(encodedPassword);
		return getSHA256(rawPassword.toString()).equals(encodedPassword);
	}
	
	@Override
	public String encode(CharSequence rawPassword) {
		
		return getSHA256(rawPassword.toString());
	}
	
	/**
	 * 인증 시 사용하는 비밀번호 매핑 처리기
	 * @param data 매핑할 비밀번호
	 * @return 변환 된 비밀번호
	 */
	public String getSHA256(String USER_PASS) {
		
		String SHA256 = "";
		
		try 
		{
			MessageDigest sh = MessageDigest.getInstance("SHA-256");
			
			sh.update(USER_PASS.getBytes());
			
			byte byteData[] = sh.digest();
			
			StringBuffer sb = new StringBuffer();
			
			for (int i = 0; i < byteData.length; i++) 
			{
				sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
			}
			
			SHA256 = sb.toString();

		} 
		catch (Exception e) {
			SHA256 = null;
		}
		
		return SHA256;
	}
	
}