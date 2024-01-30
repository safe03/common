//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html
//
//==============================================================================

if (nexacro._Browser == "Runtime") {
	nexacro._XPushController = function (control) {
		this.linkedcontrol = control;
	};

	var _pXPushController = nexacro._createPrototype(nexacro.Object, nexacro._XPushController);
	nexacro._XPushController.prototype = _pXPushController;

	_pXPushController.handle = null;

	_pXPushController.retry = 1;
	_pXPushController.controlretry = 5;
	_pXPushController.layouturl = "";
	_pXPushController.keepalivetime = 30;
	_pXPushController.timeout = 30;
	_pXPushController.keeptimeout = 60;

	_pXPushController.projectid = "";
	_pXPushController.protocolversion = 2;

	_pXPushController.create = function () {
		var comp = this.linkedcontrol;
		var _win = comp._getWindow();
		if (_win && _win.handle) {
			this.handle = nexacro.__createXPushHandle(this, _win.handle);
			nexacro.__setXPushHandleOnEvent(this.handle, this._on_xpush, this._on_success, this._on_error, this._on_keepalive);
			nexacro.__setXPushHandleOnFunction(this.handle, this._getRandomIPInfo, this._setError);
		}
	};

	_pXPushController.destroy = function () {
		nexacro.__destroyXPushHandle(this.handle);

		this.handle = null;
		this.linkedcontrol = null;
	};

	_pXPushController.setXPushAsync = function (async) {
		var handle = this.handle;
		if (handle) {
			nexacro.__setXPushHandleAsync(handle, async);
		}
	};

	_pXPushController.setXPushControlRetry = function (cnt) {
		this.controlretry = cnt;

		var handle = this.handle;
		if (handle) {
			nexacro.__setXPushHandleControlRetry(handle, cnt);
		}
	};

	_pXPushController.setXPushDebug = function (debug) {
		var handle = this.handle;
		if (handle) {
			nexacro.__setXPushHandleDebug(handle, debug);
		}
	};

	_pXPushController.setXPushKeepAliveTime = function (time) {
		this.keepalivetime = time;

		var handle = this.handle;
		if (handle) {
			nexacro.__setXPushHandleKeepAliveTime(handle, time);
		}
	};

	_pXPushController.setXPushKeepTimeout = function (time) {
		this.keeptimeout = time;
	};

	_pXPushController.setXPushTimeout = function (time) {
		this.timeout = time;
	};

	_pXPushController.setXPushLayoutURL = function (layouturl) {
		var handle = this.handle;
		if (handle) {
			if (nexacro._OS != "Android") {
				var url = layouturl;
				if (url.substring(0, 4).toLowerCase() == "url(") {
					url = url.substring(5, url.length - 2);
				}

				var form = this.linkedcontrol._findForm(this.linkedcontrol.parent);
				if (form) {
					if (url.indexOf("%") < 0) {
						layouturl = nexacro._getServiceLocation(url, form._getRefFormBaseUrl());
					}
				}
			}

			nexacro.__setXPushHandleLayoutURL(handle, layouturl);
		}
	};

	_pXPushController.setXPushRetry = function (cnt) {
		this.retry = cnt;

		var handle = this.handle;
		if (handle) {
			nexacro.__setXPushHandleRetry(handle, cnt);
		}
	};

	_pXPushController.setXPushProjectId = function (id) {
		this.projectid = id;
	};

	_pXPushController.setXPushProtocolVersion = function (version) {
		this.protocolversion = version;

		var handle = this.handle;
		if (handle) {
			nexacro.__setXPushHandleProtocolversion(handle, version);
		}
	};

	_pXPushController.connectXPush = function (userid, sessionid, projectid) {
		var handle = this.handle;
		if (handle) {
			this.linkedcontrol._resetIPList();
			nexacro.__connectXPushHandle(handle, userid, sessionid, projectid, this.retry, this.timeout, this.controlretry, this.keeptimeout);
		}
	};

	_pXPushController.disconnectXPush = function () {
		var handle = this.handle;
		if (handle) {
			nexacro.__disconnectXPushHandle(handle);
		}
	};

	_pXPushController.sendResponseXPush = function (id) {
		var handle = this.handle;
		if (handle) {
			nexacro.__sendResponseXPushHandle(handle, id);
		}
	};

	_pXPushController.requestMessageXPush = function (type, keys) {
		var handle = this.handle;
		if (handle) {
			nexacro.__requestMessageXPushHandle(handle, type, keys);
		}
	};

	_pXPushController.fireErrorEventXPush = function () {
		var handle = this.handle;
		if (handle) {
			nexacro.__fireXPushHandleErrorEvent(handle, -701);
		}
	};

	_pXPushController.commandXPush = function (commandcontrol) {
		var handle = this.handle;
		if (handle) {
			var projectid = "";
			if (this.protocolversion == 3) {
				projectid = commandcontrol.projectid || this.projectid;
			}

			nexacro.__commandXPushHandle(handle, commandcontrol.actiontype, commandcontrol.messagetype, commandcontrol.messagekey, commandcontrol.type, commandcontrol.userid, projectid);
		}
	};

	_pXPushController._on_xpush = function (recvObj) {
		var comp = this.linkedcontrol;
		if (comp) {
			comp._on_xpush(recvObj);
		}
	};

	_pXPushController._on_success = function (reason, action, classtype, messagetype, messagekey, returnvalue) {
		var comp = this.linkedcontrol;
		if (comp) {
			if (action == 11) {
				var data = {
				};
				for (var i = 0; i < returnvalue.length; i++) {
					var topictype = returnvalue[i]["topictype"];
					var topicid = returnvalue[i]["topicid"];

					if (data[topictype]) {
						data[topictype].push(topicid);
					}
					else {
						data[topictype] = [topicid];
					}
				}

				returnvalue = data;
			}
			comp._on_success(reason, action, classtype, messagetype, messagekey, returnvalue);
		}
	};

	_pXPushController._on_error = function (errorcode, classtype, messagetype, messagekey) {
		var comp = this.linkedcontrol;
		if (comp) {
			comp._on_error(errorcode, classtype, messagetype, messagekey);
		}
	};

	_pXPushController._on_keepalive = function (type) {
		var comp = this.linkedcontrol;
		if (comp) {
			comp._on_keepalive(type);
		}
	};

	_pXPushController._getRandomIPInfo = function () {
		var comp = this.linkedcontrol;
		if (!comp) {
			return null;
		}

		return comp._getRandomIPInfo();
	};

	_pXPushController._setError = function (errorcode, errormsg) {
		var comp = this.linkedcontrol;
		if (comp) {
			comp._setError(errorcode, errormsg);
		}
	};

	delete _pXPushController;
}
