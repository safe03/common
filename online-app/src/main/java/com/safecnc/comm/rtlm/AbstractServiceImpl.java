package com.safecnc.comm.rtlm;

import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

public class AbstractServiceImpl {
	
	public int SAVE(NexacroRequest request, String dsName, BiConsumer<String,Map> dao) {
		Map rowVo    = null;
        int iTotCnt = 0;
        int rowType  = 0;
		
        final List D_LIST = request.getDeletedDataset(dsName); 
        final List C_U_LIST = request.getSaveDataset(dsName);
        
        for (int i = 0; i < D_LIST.size(); i++) {
    		rowVo = (Map) D_LIST.get(i);
    		dao.accept("D",rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < C_U_LIST.size(); i++) {
     	   
            rowVo   = (Map) C_U_LIST.get(i);
            
            rowType = (Integer) rowVo.get(DatasetDefinition.ROW_TYPE);
            
            if (rowType == DataSet.ROW_TYPE_INSERTED) { 
         	   
            	dao.accept("C",rowVo);
            } 
            else if(rowType == DataSet.ROW_TYPE_UPDATED) {
         	   
            	dao.accept("U",rowVo); 
            }

            iTotCnt++;
        }
                
		return iTotCnt;
	}
}
