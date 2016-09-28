/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc service
 * @name $act
 * @description
 * 
 * در این مدل دو مفهوم کلی تعریف می‌شود که عبارتند از دستور و دستگیره. دستور یک
 * عبارت رشته‌ای است که یک عمل مجازی را تعیین می‌کند و دستگیره عملی است که در
 * مقابل هر دستور اجرا می‌شود. برای نمونه فرض کنید که یک دستور ورود به سیستم
 * وجود دارد که نام آن به صورت زیر تعیین شده است:
 * 
 * user.login
 * 
 * فراخوانی این دستور منجر به اجرا شدن تمام دستگیره‌هایی مرتبط خواهد شد. تعریف
 * این دستور و دستیگره‌های آن در نمونه‌های زیر اورده شده است.
 * 
 * @example
 * 
 * <pre><code>
 * $act.command({
 * 	id: 'user.login',
 * 	label: 'login',
 * 	icon: 'enter',
 * 	tags: ['user', 'login']
 * });
 * ...
 * $act.handler({
 * 	command: 'user.login',
 * 	handle: function(credential){
 * 		return $usr.login(credential);
 * 	}
 * });
 * </code></pre>
 * 
 * @example
 * 
 * <pre><code>
 * // اجرای دستور
 * $act.execute('user.login', {
 * 	login : 'admin',
 * 	password : 'admin'
 * });
 * </code></pre>
 */
.service('$act', function($q, $timeout, PCommand, PHandler) {
	/*
	 * فهرستی از تمام دستورهای تعریف شده را نگهداری می ‌کند
	 */
	this._commands = [];

	/**
	 * دستور معادل با شناسه ورودی را تعیین می‌کند. در صورتی که دستور معادل وجود
	 * نداشته باشد یک خطا صادر خواهد شد.
	 * 
	 * @memberof $act
	 * @param {string}
	 *            id شناسه دستور را تعیین می‌کند.
	 * @return {promise(PCommand)} [description]
	 */
	this.getCommand = function(id) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			if (id in scope._commands) {
				def.resolve(scope._commands[id]);
				return;
			}
			def.reject({
				status : 404,
				code : 10,
				message : 'command not found'
			});
		}, 1);
		return def.promise;
	};

	/**
	 * یک دستور جدید به سیستم اضافه می‌کند. در صورتی که دستوری با شناسه دستور
	 * قبلا در سیستم موجود باشد، دستور جدید با مورد قبل جایگزین خواهد شد.
	 * 
	 * @param {Object}
	 *            command یک ساختار داده‌ای که پارامترهای دستور را تعیین می‌‌کند
	 * @return {$act} ساختار داده‌ای دستور
	 */
	this.command = function(cmdData) {
		// دستور باید شناسه داشته باشد
		if (!cmdData.id) {
			// TODO: maso, 1395: پیام مناسبی برای خطا ایجاد شود.
			throw {
				status : 404,
				code : 11,
				message : 'Command id is empty'
			};
		}
		var cmd;
		if (cmdData.id in this._commands) {
			// TODO: maso, 1395: یه پیام اخطار که پیام وجود داشته
			cmd = this._commands[cmdData.id];
			cmd.setData(cmdData);
		} else {
			cmd = new PCommand(cmdData);
			this._commands[cmd.id] = cmd;
		}
		return this;
	};

	/**
	 * یک دستگیریه را به فهرست دستگیره‌های یک دستور اضافه می‌کند.
	 * 
	 * @param {object}
	 *            ساختار داده‌ای که یک دستیگره را توصیف می‌کند.
	 * @return {$act} خود سیستم مدیریت دستورها را برمی‌گرداند
	 */
	this.handler = function(handData) {
		var cmd;
		if (handData.command in this._commands) {
			cmd = this._commands[handData.command];
		} else {
			cmd = new PCommand({
				id : handData.command
			});
			this._commands[cmd.id] = cmd;
		}
		cmd.handler(new PHandler(handData));
		return this;
	};

	/**
	 * یک دستور را به صورت غیر همزمان اجرا می‌کند. اجرای دستور معادل با این است
	 * که تمام دستگیره‌های ان به ترتیب اجرا شوند. امکان ارسال پارامتر به تمام
	 * دستگیره‌ها وجود دارد. برای این کار کافی است که پارامترهای اضافه را بعد از
	 * پارامتر دستور وارد کنید. برای نمونه فرض کنید که دستور ورود کاربر به صورت
	 * زیر تعریف شده است:
	 * 
	 * <pre>
	 * &lt;command&gt;
	 * 	$act.command({
	 * 		id: 'user.login',
	 * 		label: 'login'
	 * 	}).handler({
	 * 		command: 'user.login',
	 * 		handle: function(credential){
	 * 			// Do something
	 * 		}
	 * 	})
	 * &lt;/command&gt;
	 * </pre>
	 * 
	 * در این صورت به سادگی می‌توان این دستور را به صورت زیر فراخوانی کرد:
	 * 
	 * <pre>
	 * &lt;command&gt;
	 * 	$act.execute('user.login',{
	 * 		login: 'user login',
	 * 		password: 'user password'
	 * 	});
	 * &lt;/command&gt;
	 * </pre>
	 * 
	 * @memberof $act
	 * @param {string}
	 *            command دستور
	 * @return {promise} نتیجه اجرای دستورها
	 */
	this.execute = function(command) {
		var def = $q.defer();
		// اجرای یک دستور
		if (command in this._commands) {
			var scope = this;
			var args = Array.prototype.slice.call(arguments).slice(1);
			$timeout(function() {
				var cmd = scope._commands[command];
				cmd.handlers.forEach(function(handler) {
					handler.handle.apply(handler, args);
				});
				def.resolve();
			}, 1);
			return def.promise;
		}

		/*
		 * اجرا یک عمل
		 * 
		 * یک عمل ساختار داده‌ای است که در آن خصوصیت‌هایی برای تعیین مدل اجرا
		 * تعیین شده است. مثلا یک مدل عمل به صورت زیر قابل تعریف است:
		 * 
		 * <pre> <code> var action1={ lable: 'label', text: 'this is an example
		 * action', type: 'command', value: 'user.logout' }; </code> </pre>
		 * 
		 * <ul> <li>command</li> <li>link</li> <li>state</li> </ul>
		 */
		// XXX: maso, 1395: اجرای این مدل عمل‌ها باید اضافه شود
		// خطای یافت نشدن دستور
		def.reject({
			message : 'Command not found :' + command,
			statuse : 400,
			code : 4404
		});
		return def.promise;
	};
});
