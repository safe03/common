 /**
 * 색(color)처리와 관련된 함수들을 등록한다.
 * @namespace sfw.color
 **/

var pForm = nexacro.Form.prototype;

pForm.basicColors = [
		['#ff8080','#ffff80','#80ff80','#00ff80','#80ffff','#0080ff','#ff80c0','#ff80ff'],
		['#ff0000','#ffff00','#80ff00','#00ff40','#00ffff','#0080c0','#8080c0','#ff00ff'],
		['#804040','#ff8040','#00ff00','#008080','#004080','#8080ff','#800040','#ff0080'],
		['#800000','#ff8000','#008000','#008040','#0000ff','#0000a0','#800080','#8000ff'],
		['#400000','#804000','#004000','#004040','#000080','#000040','#400040','#400080'],
		['#000000','#808000','#808040','#808080','#408080','#c0c0c0','#400040','#ffffff']
	];
	
/**
 * HSL MAX값.
 */ 
pForm.HSLMAX = 240;

/**
 * RGB MAX value.
 */     
pForm.RGBMAX = 255;

/**
 * 채도가 0이면 색상은 undefined 이다.<br>
 * 이때 색상값을 처리하기 위한 값.
 */    
pForm.HUE_VALUE_WHEN_SATURATION_IS_ZERO = 160;


/**
 * 채도가 0이면 색상은 undefined 이다.<br>
 * 이때 색상값을 처리하기 위한 값이다.
 * @function sfw_rgbToHsl
 * @param {number} R red
 * @param {number} G green
 * @param {number} B blue
 * @return {string} hsl code
 * @memberOf sfw.color
 */    
pForm.sfw_rgbToHsl = Eco.Color.rgbToHsl;


/**
 * 색상을 RGB로 변환한다.
 * @function sfw_hueToRgb 
 * @param {number} n1 보정값1.
 * @param {number} n2 보정값2.
 * @param {number} hue 색상.
 * @return {number} 색상.
 * @memberOf sfw.color
 */  
pForm.sfw_hueToRgb = Eco.Color.hueToRgb;


/**
 * HSL을 RGB로 변환한다.
 * @function sfw_hslToRgb
 * @param {number} hue 색상.
 * @param {number} sat 채도.
 * @param {number} lum 명도.
 * @return {array.<number>} RGB값을 가진 array. [R,G,B].
 * @example 
 * trace(Eco.Color.hslToRgb(100,240,120)); //output: [0,255,128]
 * trace(Eco.Color.hslToRgb(20,240,120));  //output: [255,128,0]
 *
 * @memberOf sfw.color
 */  
pForm.sfw_hslToRgb = Eco.Color.hslToRgb;


/**
 * RGB를 Hexadecimal code로 변환한다.
 * @function sfw_rgbToHex
 * @param {number} red red.
 * @param {number} green green.
 * @param {number} blue blue.
 * @param {number} alpha alpha.
 * @return {string} Hexadecimal code.
 * @example
 * trace(Eco.Color.rgbToHex(255,140,0)); //output: #FF8C00
 * trace(Eco.Color.rgbToHex(255,140,0, 100)); //output: #FF8C0064
 *
 * @memberOf sfw.color
 */ 
pForm.sfw_rgbToHex = Eco.Color.rgbToHex;


/**
 * number를 Hexadecimal code로 변환한다.
 * @function sfw_numberToHex
 * @param {number} value 변환대상.
 * @return {number} Hexadecimal.
 * @memberOf sfw.color
 */	
pForm.sfw_numberToHex = Eco.Color.numberToHex;

/**
 * Hexadecimal code를 HSL로 변환한다.
 * @function sfw_hexToHsl
 * @param {string} str "red"같이 named color나, "#000000" 값들이 주어진다.
 * @return {array} [H,S,L] 형태의 array 값.
 * @example
 * trace(Eco.Color.hexToHsl("#FF8080")); //output: [0,240,180]
 * trace(Eco.Color.hexToHsl("#008000")); //output: [80,240,60]
 * @memberOf sfw.color
 */		
pForm.sfw_hexToHsl = Eco.Color.hexToHsl;

/**
 * Hexadecimal code를 [r, g, b, a]로 변환한다.
 * @function sfw_hexToRgb
 * @param {string} str "red"같이 named color나, "#000000", "#000000ff" 값들이 주어진다.
 * @return {array} [r, g, b, a] 형태의 array 값.
 * @example
 * trace(Eco.Color.hexToRgb("#FF8C00")); //output: [255,140,0]
 * @memberOf sfw.color
 */	
pForm.sfw_hexToRgb = Eco.Color.hexToRgb;