import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestEx {
	/*
	case LANG_CODE when 'EN' then A.WORD_VALU End as EN_VAL
	MAX(A.EN_VAL) AS EN_VAL
	*/
	@Test
	public void test() {

		List<Map<String, Object>> langCodeList = new ArrayList<>();
		String langCodeInner = "";
		String langCodeOuter = "";
		String descriptionInner = "";
		String descriptionOuter = "";

		for (Map<String ,Object> lang : langCodeList ) {
			String lang_code = lang.get("LANG_CODE").toString();
			langCodeInner += this.getCaseString("WORD_VALU" ,lang_code);
			langCodeOuter += this.getMaxString(lang_code);
			descriptionInner += this.getCaseString("DESCRIPTION" ,lang_code);
			descriptionOuter += this.getMaxString(lang_code);
		}
	}
	private void setLangInfo(Map langInfo) {
		List<Map<String, Object>> langCodeList = new ArrayList<>();
		String langCodeInner = "";
		String langCodeOuter = "";
		String descriptionInner = "";
		String descriptionOuter = "";

		for (Map<String ,Object> lang : langCodeList ) {
			String lang_code = lang.get("LANG_CODE").toString();
			langCodeInner += this.getCaseString("WORD_VALU" ,lang_code);
			langCodeOuter += this.getMaxString(lang_code);
			descriptionInner += this.getCaseString("DESCRIPTION" ,lang_code);
			descriptionOuter += this.getMaxString(lang_code);
		}

		langInfo.put("langCodeInner" ,langCodeInner);
		langInfo.put("langCodeOuter" ,langCodeOuter);
		langInfo.put("descriptionInner" ,descriptionInner);
		langInfo.put("descriptionOuter" ,descriptionOuter);
	}

	private String getCaseString(String columnName ,String LANG_CODE) {
		return "case LANG_CODE when '"
				+LANG_CODE
				+"' then A."
				+columnName
				+" End as "
				+LANG_CODE
				+"_VAL";
	}

	private String getMaxString(String LANG_CODE) {
		return "MAX(A."
				+LANG_CODE
				+"_VAL) AS "
				+LANG_CODE
				+"_VAL";
	}

	@Test
	public void test01() {
		String prev = "(";
		String next = ")";
		String a = "AB";
		String join = prev + String.join(",", a.split("")) + next ;
		System.out.println("join = " + join);
	}

}
