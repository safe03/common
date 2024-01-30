 /**
 * 배열(Array)와 관련 된 외부 라이브러리(Eco)와 확장 라이브러리(Core)를 등록한다.
 * @namespace sfw.array
 **/
var pForms = [ nexacro.Form.prototype
             , nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];

	/**
	* 배열의 각 항목에 대해 주어진 콜백 함수를 호출한다.<br>
	* 주어진 함수에서 return false 처리 되면 임의 배열 항목에서 반복이 멈춘다.
	* @function sfw_each
	* @param {array} array 처리 대상 Array.
	* @param {function} func callback 함수. 
	* @param {object} scope callback 함수에 대한 수행 scope.
	* @param {boolean} reverse 반복순서 (default: false).
	* @return {boolean} 배열 항목 모두가 처리되면 true를 리턴, 함수 처리중에 return false를 하게 되면 false 처리된 배열 index를 리턴.
	* @example
	* var mon = ["Jan","Feb","Mar","Apr"];
	* var result = Eco.array.Each(mon, function(name, index) {
	* 	trace(index + "==>" + name);
	*	// output : 0==>Jan
	*	// output : 1==>Feb
	*	// output : 2==>Mar
	*	// output : 3==>Apr
	* });
	* trace(result);	// output : true
	*
	* var result = Eco.array.Each(mon, function(name, index) {
	*	trace(index + "==>" + name);
	*	// output : 0==>Jan
	*	// output : 1==>Feb
	*	if (name === 'Mar') 
	*	{
	*		trace("break here!");
	*		// output : break here!
	*		return false;
	*	}
	* });
	* trace(result);	// output : 2
	* @memberOf sfw.array
	*/
	pForm.sfw_each = Eco.array.Each;

	/**
	* 배열의 각 항목에 대해 주어진 콜백 함수를 호출한다.<br>
	* 주어진 함수의 return값과 상관없이 각 항목에 대해서 모두 처리한다.
	* @function sfw_forEach
	* @param {array} array 처리 대상 Array
	* @param {function} func callback 함수 
	* @param {object} scope callback 함수에 대한 수행 scope
	* @example
	* var mon = ["Jan","Feb","Mar","Apr"];
	* Eco.array.forEach(mon, function(name, index) {
	* 	if (name === 'Mar') 
	*	{
	* 		trace("don't break here!");
	*		// output : don't break here!
	* 		return false;
	* 	}
	* 	trace(index + "==>" + name);
	*	// output : 0==>Jan
	*	// output : 1==>Feb
	*	// output : 3==>Apr
	* });
	* @memberOf sfw.array
	*/
	pForm.sfw_forEach = Eco.array.forEach;
	
	/**
	* 지정된 항목이 처음 나오는 배열 위치를 반환한다. 
	* @function sfw_indexOf
	* @param {array} array 검색 대상 Array.
	* @param {object} item 찾고자 하는 Item.
	* @param {number} from 검색의 시작 위치 (default: 0).
	* @param {boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
	* @return {number} 검색된 배열 위치. 없다면 -1 리턴.
	* @example
	* var mon = ["Jan","Feb","Mar","Apr"];
	* var index = Eco.array.indexOf(mon, "Mar");
	* trace("index==>" + index);	// output : index==>2
	* var index = Eco.array.indexOf(mon, "May");
	* trace("index==>" + index);	// output : index==>-1
	* @memberOf sfw.array
	*/
	pForm.sfw_indexOf = Eco.array.indexOf;
	
	/**
	* 지정된 항목이 처음 나오는 배열 위치를 뒤에서부터 찾아 반환한다.
	* @function sfw_lastIndexOf
	* @param {array} array 검색 대상 Array.
	* @param {object} item 찾고자 하는 Item.
	* @param {number} from 검색 시작 위치 (default: Last Index).
	* @param {boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
	* @return {number} 검색된 배열 위치. 없다면 -1 리턴.
	* @example
	* var mon = ["Jan","Feb","Mar","Apr"];
	* var index = Eco.array.indexOf(mon, "Mar");
	* trace("index==>" + index);	// output : index==>2
	* var index = Eco.array.indexOf(mon, "May");
	* trace("index==>" + index);	// output : index==>-1
	* @memberOf sfw.array
	*/
	pForm.sfw_lastIndexOf = Eco.array.lastIndexOf;

	/**
	* 지정된 항목이 배열에 포함되어 있는지 확인한다.
	* @function sfw_contains
	* @param {array} array 검색 대상 Array.
	* @param {object} item 찾고자 하는 Item.
	* @param {boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
	* @return {boolean} 포함되어 있다면 true, 없다면 false를 리턴.
	* @example
	* var mon = ["Jan","Feb","Mar","Apr"];
	* var contain = Eco.array.contains(mon, "Mar");
	* trace("contain==>" + contain);	// output : contain==>true
	* var contain = Eco.array.contains(mon, "May");
	* trace("contain==>" + contain);	// output : contain==>false
	* @memberOf sfw.array
	*/
	pForm.sfw_contains = Eco.array.contains;
	
        
	/**
	* 배열 형태로 변환 처리한다.
	* @function sfw_toArray
	* @param {object} iterant 변환 대상 Obejct.
	* @param {number} start 시작 위치 (default: start Index).
	* @param {number} end 끝 위치 (default: end Index).
	* @return {array} 변환된 Array.
	* @example
	* this.fn_mon("Jan","Feb","Mar","Apr");
	* this.fn_mon = function() 
	* {
	* 	var result = Eco.array.toArray(arguments);
	*	trace("result==>" + result);	// output : result==>[Jan,Feb,Mar,Apr]
	* }
	*
	* var result = Eco.array.toArray("ABCDEFG",1,3);
	* trace("result==>" + result);	// output : result==>[B,C]
	* @memberOf sfw.array
	*/
	pForm.sfw_toArray = Eco.array.toArray

	/**
	* 배열의 모든 항목을 인자로 사용해서 제공하는 함수의 호출 결과로 새로운 배열을 작성한다.
	* @function sfw_map
	* @param {array} array 처리 대상 Array.
	* @param {function} func callback 함수. 
	* @param {object} scope callback 함수에 대한 수행 scope.
	* @return {array} callback 함수 결과를 담은 Array.
	* @example
	* var counts = [2, 10, 5, 1];
	* var map = Eco.array.map(counts, function(ele){return ele * 1000;});
	* trace("result==>" + result);	// output : result==>[2000,10000,5000,1000]
	* @memberOf sfw.array
	*/
	pForm.sfw_map = Eco.array.map
	
		
	/**
	* 함수가 false값을 리턴 할 때까지 각 배열 항목을 이용한 callback함수를 실행한다.
	* @function sfw_every
	* @param {array} array 처리 대상 Array.
	* @param {function} func callback 함수.
	* @param {object} scope callback 함수에 대한 수행 scope.
	* @return {boolean} callback 함수 처리 결과값. false로 리턴되는 항목이 발견되면 바로 false를 리턴, 그렇지 않으면 true를 리턴.
	* @example
	* var counts = [2, 10, 5, 1];
	* var every = Eco.array.every(counts, function(ele){return (ele > 0);});
	* trace("every==>" + every);	// output : every==>true
	* var every = Eco.array.every(counts, function(ele){return (ele < 5);});
	* trace("every==>" + every);	// output : every==>false
	* @memberOf sfw.array
	*/
	pForm.sfw_every = Eco.array.every
	
	/**
	* 함수가 true값을 리턴 할 때까지 각 배열 항목을 이용한 callback함수를 실행한다.
	* @function sfw_some
	* @param {array} array 처리 대상 Array.
	* @param {function} func callback 함수. 
	* @param {object} scope callback 함수에 대한 수행 scope.
	* @return {boolean} callback 함수 처리 결과값. true로 리턴되는 항목이 발견되면 바로 true를 리턴, 그렇지 않으면 false를 리턴.
	* @example
	* var counts = [2, 10, 5, 1];
	* var some = Eco.array.some(counts, function(ele){return (ele > 5);});
	* trace("some==>" + some);	// output : some==>true
	* var some = Eco.array.some(counts, function(ele){return (ele > 10);});
	* trace("some==>" + some);	// output : some==>false
	* @memberOf sfw.array
	*/
	pForm.sfw_some = Eco.array.some
	
	/**
	* 두 1차원 배열의 항목값이 일치하는지 비교한다.
	* @function sfw_equals
	* @param {array} array1 대상 Array.
	* @param {array} array2 비교 대상 Array.
	* @return {boolean} 모든 항목값이 같은면 true, 그렇지 않으면 false.
	* @example
	* var counts = [2, 10, 5, 1];
	* var equals = Eco.array.equals(counts, [2, 10, 5, 1]);
	* trace("equals==>" + equals);	// output : equals==>true
	* var equals = Eco.array.equals(counts, [2, 10, 5]);
	* trace("equals==>" + equals);	// output : equals==>false
	* @memberOf sfw.array
	*/
	pForm.sfw_equals = Eco.array.equals
	
	/**
	* 배열의 빈 항목을 제거한다.
	* @function sfw_clean
	* @param {array} array 처리 대상 Array.
	* @return {array} clean 처리 된 Array.
	* @example
	* var clean = Eco.array.clean(["A", undefined, "B", null, "C", , "D"]);
	* trace("clean==>" + clean);	// output : clean==>["A","B","C","D"]
	* @memberOf sfw.array
	*/
	pForm.sfw_clean = Eco.array.clean
	
	/**
	* 유일한 항목을 찾아 새로운 배열로 구성해서 리턴한다.
	* @function sfw_unique
	* @param {array} array 처리 대상 Array.
	* @return {array} unique한 항목으로 새로 구성된 Array.
	* @example
	* var unique = Eco.array.unique(["A","B","C","A","A","B"]);
	* trace("unique==>" + unique);	// output : unique==>["A","B","C"]
	* @memberOf sfw.array
	*/
	pForm.sfw_unique = Eco.array.unique;
	
	/**
	* 대상 배열에서 Callback함수 조건을 만족하는 항목으로 새로운 배열을 구성한다.
	* @function sfw_filter
	* @param {array} array 처리 대상 Array.
	* @param {function} func callback 함수. 
	* @param {object} scope callback 함수에 대한 수행 scope.
	* @return {array} filter처리된 항목으로 새로 구성된 Array.
	* @example
	* var counts = [2, 10, 5, 1];
	* var filter = Eco.array.filter(counts, function(ele){return (ele > 3);});
	* trace("filter==>" + filter);	// output : filter==>[10,5]
	* @memberOf sfw.array
	*/
	pForm.sfw_filter = Eco.array.filter;
	
	
	/**
	 * 원하는 위치에 새로운 항목을 insert처리한다.
	 * @function sfw_insertAt
	 * @param {array} array insert 대상 Array.
	 * @param {number} index insert 위치.
	 * @param {object} items insert하고자 하는 items.
	 * @example
	 * var mon = ["Jan","Feb","Mar","Apr"];
	 * Eco.array.insertAt(mon, 1, [50,100]);
	 * trace("mon==>" + mon);	// output : mon==>["Jan", 50, 100, "Feb", "Mar", "Apr"]
	 * @memberOf sfw.array
	 */
	pForm.sfw_insertAt = Eco.array.insertAt;
	
	
	/**
	 * 원하는 항목의 앞 위치에 새로운 항목을 insert처리한다.
	 * @function sfw_insertBefore
	 * @param {array} array insert 대상 Array.
	 * @param {object} items insert하고자 하는 items.
	 * @param {object} items2 insert 위치(이 item 앞에 위치시킴).
	 * @example
	 * var mon = ["Jan","Feb","Mar","Apr"];
	 * Eco.array.insertBefore(mon, [50,100], "Feb");
	 * trace("mon==>" + mon);	// output : mon==>["Jan", 50, 100, "Feb", "Mar", "Apr"]
	 * @memberOf sfw.array
	 */
	pForm.sfw_insertBefore = Eco.array.insertBefore;
	
	
	/**
	 * 원하는 위치의 항목을 배열에서 삭제 처리한다.
	 * @function sfw_removeAt
	 * @param {array} array remove 대상 Array.
	 * @param {number} index remove하고자 하는 item index.
	 * @example
	 * var mon = ["Jan","Feb","Mar","Apr"];
	 * Eco.array.removeAt(mon, 1);
	 * trace("mon==>" + mon);	// output : mon==>["Jan","Mar","Apr"]
	 * @memberOf sfw.array
	 */
	pForm.sfw_removeAt           = Eco.array.removeAt;
	

	/**
	 * 원하는 항목을 배열에서 삭제 처리한다.
	 * @function sfw_remove
	 * @param {array} array remove 대상 Array.
	 * @param {object} item remove하고자 하는 item.
	 * @example
	 * var mon = ["Jan","Feb","Mar","Apr"];
	 * Eco.array.remove(mon, "Feb");
	 * trace("mon==>" + mon);	// output : mon==>["Jan","Mar","Apr"]
	 * @memberOf sfw.array
	 */
	pForm.sfw_remove = Eco.array.remove;
	
	/**
	 * 배열을 복사한다.
	 * @function sfw_clone
	 * @param {array} array 복사 대상 Array.
	 * @return {array} 복사된 Array.
	 * @example
	 * var counts = [2, 10, 5, 1];
	 * var clone = Eco.array.clone(counts);
	 * trace("clone==>" + clone);	// output : clone==>[2,10,5,1]
	 * @memberOf sfw.array
	 */
	pForm.sfw_clone = Eco.array.clone;
	
	
	/**
	 * 배열의 순서대로 각 요소들을 각 요소별 호출함수로 처리하여 하나의 값으로 감소한다.
	 * 각 요소별로 호출되는 함수는, 4개의 argument을 가진다.
	 * <pre>
	 *    previousValue : 현재 처리 전의 값.
	 *    currentValue: 현재 값.
	 *    index: 현재 처리하는 array index.
	 *    arr : 처리하는 대상 array.
	 * </pre>
	 * @function sfw_reduce
	 * @param {array} arr 대상 Array.
	 * @param {function} fn 배열의 각 요소별로 호출되는 함수.
	 * @param {*} initValue 초기 지정하는 값.
	 * @return {*} 감소 처리된 결과.
	 * @example
	 * var arr = [0, 1, 2, 3];
	 * var total = Eco.array.reduce(arr, function(a, b) {
	 *     return a + b;
	 * });
	 * trace("total==>" + total);	// output : total==>6
	 * var arr = [[0, 1], [2, 3], [4, 5]];
	 * var flattened = Eco.array.reduce(arr, function(a, b) {
	 *     return a.concat(b);
	 * });
	 * trace("flattened==>" + flattened);	// output : flattened==>[0, 1, 2, 3, 4, 5]
	 * @memberOf sfw.array
	 */
	pForm.sfw_reduce = Eco.array.reduce;
	
	
	/**
	 * 1차원 배열로 재정의한다.
	 * @function sfw_flatten
	 * @param {array} array 처리 대상 배열.
	 * @return {array} 1차원 Array.
	 * @example
	 * var flatten = Eco.array.flatten(['Jan', [10, 20], ['Feb', [1, 10]]]);
	 * trace("flatten==>" + flatten);	// output : flatten==>[Jan,10,20,Feb,1,10]
	 * @memberOf sfw.array
	 */
	pForm.sfw_flatten = Eco.array.flatten;
	
	
	/**
	 * 배열중에 가장 큰 값을 리턴한다.
	 * @function sfw_max
	 * @param {array} array 검색 대상 배열.
	 * @return {number} maximum Value.
	 * @example
	 * var counts = [2, 10, 5, 1];
	 * var max = Eco.array.max(counts);
	 * trace("max==>" + max);	// output : max==>10
	 * @memberOf sfw.array
	 */
	pForm.sfw_max = Eco.array.max;
	
	/**
	 * 배열중에 가장 작은 값을 리턴한다.
	 * @function sfw_min
	 * @param {array} array 검색 대상 배열.
	 * @return {number} minimum Value.
	 * @example
	 * var counts = [2, 10, 5, 1];
	 * var min = Eco.array.min(counts);
	 * trace("min==>" + min);	// output : min==>1
	 * @memberOf sfw.array
	 */
	pForm.sfw_min = Eco.array.min;
	
	/**
	 * 배열의 모든 항목에 대한 합계를 구한다.
	 * @function sfw_sum
	 * @param {array} array 처리 대상 배열.
	 * @param {number} start 배열 시작 index.
	 * @param {number} len 계산할 배열 length.
	 * @return {number} sum value.
	 * @example
	 * var counts = [2, 10, 5, 1];
	 * var sum = Eco.array.sum(counts);
	 * trace("sum==>" + sum);	// output : min==>18
	 * @memberOf sfw.array
	 */
	pForm.sfw_sum = Eco.array.sum;
	
	/**
	 * 지정된 두 항목의 위치을 바꾼다.
	 * @function sfw_exchange
	 * @param {array} array exchange 대상 Array.
	 * @param {number} from 바꾸고자 하는 첫번째 item index.
	 * @param {number} to 바꾸고자 하는 두번째 item index.
	 * @return {boolean} 위치가 정상적으로 변경되었으면 true, 그렇지않다면 false를 리턴.
	 * @example
	 * var mon = ["Jan","Feb","Mar","Apr"];
	 * var exchange = Eco.array.exchange(mon, 1,3);
	 * trace("exchange==>" + exchange + ", mon==>" + mon);
	 * // output : exchange==>true, mon==>["Jan","Apr","Mar","Feb"]
	 * @memberOf sfw.array
	 */
	pForm.sfw_exchange = Eco.array.exchange;
	
	/**
	 * 지정된 항목을 원하는 위치로 이동시킨다.
	 * @function sfw_move
	 * @param {array} array 대상 Array.
	 * @param {number} from 이동시킬 item index.
	 * @param {number} to 새로 위치하고자 하는 item index.
	 * @return {boolean} 위치가 정상적으로 이동되었으면 true, 그렇지않다면 false를 리턴.
	 * @example
	 * var mon = ["Jan","Feb","Mar","Apr"];
	 * var move = Eco.array.move(mon, 1,3);
	 * trace("move==>" + move + ", mon==>" + mon);
	 * // output : move==>true, mon==>["Jan","Mar","Apr","Feb"]
	 * @memberOf sfw.array
	 */
	pForm.sfw_move = Eco.array.move;
	
	/**
	 * 배열 항목의 필드를 기준으로 배열 항목을 정렬 처리한다.<br>
	 * 배열의 각 항목은 하나 이상의 속성을 가진 객체이고,<br>
	 * 모든 객체에는 최소한 하나 이상의 공통 속성을 가지며,<br>
	 * 이 값은 배열 항목을 정렬하는데 사용된다.<br>
	 * 매개변수가 여러개인 경우에는 첫번째 필드는 1차, 두번째 필드는 다음 정렬 필드로 사용된다.
	 * @function sfw_sortOn
	 * @param {array} array 대상 Array.
	 * @param {string} names 정렬 기준 필드명.
	 * @return {array} Sort 처리된 Array.
	 * @example
	 * var users = [];
	 * users[0] = {id:"milk", name:"park", age:33};
	 * users[1] = {id:"apple", name:"kim"};
	 * users[2] = {id:"oops", name:"joo", age:44};
	 * users[3] = {id:"beans", name:"lee", age:50};
	 * users[4] = {id:"zoo", age:65};
	 * users[5] = {id:"milk", name:"", age:33};
	 * users[6] = {id:"milk", name:"lee", age:33};	
	 * var sorted = Eco.array.sortOn(users, "name","id");
	 * for(var i=0; i < sorted.length; i++)
	 * {
	 * 	var tmp = sorted[i];
	 * 	trace("name:" + tmp.name + " || id:" + tmp.id + " || age:" + tmp.age);
	 * 	// output : name: || id:milk || age:33
	 * 	// output : name:joo || id:oops || age:44
	 * 	// output : name:kim || id:apple || age:undefined
	 * 	// output : name:lee || id:beans || age:50
	 * 	// output : name:lee || id:milk || age:33
	 * 	// output : name:park || id:milk || age:33
	 * 	// output : name:undefined || id:zoo || age:65
	 * }
	 * @memberOf sfw.array
	 */
	pForm.sfw_sortOn = Eco.array.sortOn;


	/**
	 * 이차원 배열의 이차 요소별로 정렬하여 새로운 배열을 반환하다.
	 * @function sfw_sortTwoDimensional
	 * @param {array} arr 2차원 배열.
	 * @param {array} sortOrders 2차요소 정렬 기준("ASC":오름차순, "DESC":내림차순).
	 * @return {array} 정렬 처리된 Array.
	 * @example
	 *	var arr = [['A', 'a', '가'],
	 *			   ['A', 'a', '나'],
	 *			   ['A', 'b', '나'],
	 *			   ['A', 'b', '가'],
	 *			   ['B', 'b', '가'],
	 *			   ['B', 'b', '나'],
	 *			   ['B', 'a', '가'],
	 *			   ['B', 'b', '다'],
	 *			   ['B', 'c', '가'],
	 *			   ['A', 'd', '가'],
	 *			   ['A', 'c', '가'],
	 *			   ['C', 'c', '가'],
	 *			   ['C', 'a', '가'],
	 *			   ['C', 'b', '가']];		
	 *
	 *   var sorted = Eco.array.sortTwoDimensional(arr, ["ASC", "DESC", "ASC"]);
	 *	for (var i=0; i<sorted.length; i++)
	 *	{
	 *		trace(arr[i][0] + " : " + arr[i][1] + " : " + arr[i][2]);
	 *	}
	 *
	 *	----------
	 *	output
	 *	----------
	 *	A : d : 가
	 *	A : c : 가
	 *	A : b : 나
	 *	A : b : 가
	 *	A : a : 나
	 *	A : a : 가
	 *	B : c : 가
	 *	B : b : 다
	 *	B : b : 나
	 *	B : b : 가
	 *	B : a : 가
	 *	C : c : 가
	 *	C : b : 가
	 *	C : a : 가
	 *
	 * @memberOf sfw.array
	 */
	pForm.sfw_sortTwoDimensional = Eco.array.sortTwoDimensional;
	
	/**
	 * 지정된 속성의 값이 처음으로 일치하는 객체의 배열 위치를 반환한다.<br>
	 * 배열의 각 항목은 하나 이상의 속성을 가진 객체이다.<br> 
	 * @function sfw_indexOfProp
	 * @param {array} array 대상 Array.
	 * @param {string} prop 기준 속성.
	 * @param {string} item 기준 값.
	 * @param {number} from 검색 시작 위치(default: 0).
	 * @param {boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
	 * @return {number} 검색된 배열 위치. 없다면 -1 리턴.
	 * @example
	 * var users = [];
	 * users[0] = {id:"milk", name:"park", age:33};
	 * users[1] = {id:"apple", name:"kim"};
	 * users[2] = {id:"oops", name:"joo", age:44};
	 * users[3] = {id:"beans", name:"lee", age:50};
	 * users[4] = {id:"zoo", age:65};
	 * users[5] = {id:"milk", name:"", age:33};
	 * users[6] = {id:"milk", name:"lee", age:33};
	 * var index = Eco.array.indexOfProp(users, "name", "lee");
	 * trace("index==>" + index);	// output : index==>3
	 * var index = Eco.array.indexOfProp(users, "age", 20);
	 * trace("index==>" + index);	// output : index==>-1
	 * @memberOf sfw.array
	 */
	pForm.sfw_indexOfProp = Eco.array.indexOfProp;
	
	/**
	 * 지정된 속성의 값이 처음으로 일치하는 객체의 배열 위치를 뒤에서부터 찾아 반환한다.<br>
	 * 배열의 각 항목은 하나 이상의 속성을 가진 객체이다.<br> 
	 * @function sfw_lastIndexOfProp
	 * @param {array} array 대상 Array.
	 * @param {string} prop 기준 속성.
	 * @param {string} item 기준 값.
	 * @param {number} from 검색 시작 위치(default: 0).
	 * @param {boolean} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
	 * @return {number} 검색된 배열 위치. 없다면 -1 리턴.
	 * @example
	 * var users = [];
	 * users[0] = {id:"milk", name:"park", age:33};
	 * users[1] = {id:"apple", name:"kim"};
	 * users[2] = {id:"oops", name:"joo", age:44};
	 * users[3] = {id:"beans", name:"lee", age:50};
	 * users[4] = {id:"zoo", age:65};
	 * users[5] = {id:"milk", name:"", age:33};
	 * users[6] = {id:"milk", name:"lee", age:33};
	 * var index = Eco.array.lastIndexOfProp(users, "name", "lee");
	 * trace("index==>" + index);	// output : index==>6
	 * var index = Eco.array.lastIndexOfProp(users, "name", "lee", 5);
	 * trace("index==>" + index);	// output : index==>3
	 * @memberOf sfw.array
	 */
	pForm.sfw_lastIndexOfProp = Eco.array.lastIndexOfProp;
	
	/**
	 * 배열 arr에서 배열 arr1의 모든 항목을 뺀 차 집합 배열을 리턴한다.<br>
	 * @function sfw_difference
	 * @param {array} arr 기준 Array.
	 * @param {array} arr1 대상 Array.
	 * @return {array} 차집합 Array.
	 * @example
	 * var arr = [2, 10, 5, 1, 7];
	 * var arr1 = [9, 15, 5, 2];
	 * var result = Eco.array.difference(arr , arr1);
	 * trace(result);	// output : index==>10,1,7
	 * @memberOf sfw.array
	 */
	pForm.sfw_difference = Eco.array.difference;
	
	/**
	 * source Array의 시작 index로 주어진 length길이만큼 요소들을 destination Array의 시작 index에서 부터 복사한다.<br>
	 * Java에서 System.arraycopy 함수와 동일하다고 보면 된다.
	 * @function sfw_arrayCopy
	 * @param {array} arr 소스 array.
	 * @param {array} srcPos 소스 array에서 읽기 시작할 위치.
	 * @param {array} dest 복사대상 array.
	 * @param {array} destPos 복사대상 array에 데이터를 쓸 때 시작위치.
	 * @param {array} length 소스 array에서 읽어들일 길이.
	 * @example
	 *	var copyFrom = [ 'd', 'e', 'c', 'a', 'f', 'f', 'e', 'i', 'n', 'a', 't', 'e', 'd' ];
	 *	var copyTo = new Array(7);
	 *
	 *   // copies an array from the specified source array
	 *	Eco.array.arrayCopy(copyFrom, 2, copyTo, 0, 7);
	 *	trace(copyTop.join("")); // output : caffein
	 * @memberOf sfw.array
	 */
	pForm.sfw_arrayCopy = Eco.array.arrayCopy;
	
	
	/**
	 * 정렬된 array에서 지정한 값 대한 index를 찾아서 반환한다. sort함수인 compareFn 함수를 사용한다.
	 * @function sfw_binarySearch
	 * @param {array} arr 정렬된 1차원 배열.
	 * @param {number} start 검색 시작 index.
	 * @param {number} len 검색 range 크기.
	 * @param {number} item 검색할 값.
	 * @param {function} compareFn 각 요소마다 비교할 함수.
	 * @return {number} 검색한 index.
	 * @example
	 * var compare = Eco.array._defaultCompare,
	 * arrayUtil = Eco.array;
	 * Eco.Logger.startElapsed();
	 * var datas = [], pos, max = 10000;
	 * for ( var i = 0; i < max ; i++ )
	 * {
	 *   var idx = Math.floor(Math.random() * max);
	 *   pos = arrayUtil.binarySearch(datas, 0, datas.length, idx, compare);
	 *   if( pos < 0 )
	 *   {
	 *     pos = ~pos;
	 *     datas.splice(pos, 0, idx);
	 *   }
	 * }
	 * Eco.Logger.info({message: "경과시간=> ", elapsed: true});
	 * console.log(datas);
	 *	Eco.DatasetMap 객체에서 이 함수 사용함.
	 * @memberOf sfw.array
	 */
	pForm.sfw_binarySearch = Eco.array.binarySearch;
}