 /**
 * 저장소(storage)과 관련된 기능을 등록한다.
 * @namespace sfw.storage
 **/

var pForm = nexacro.Form.prototype;

pForm.sfw_setItem                  = Eco.LocalStorage.setItem;
pForm.sfw_getItem                  = Eco.LocalStorage.getItem;