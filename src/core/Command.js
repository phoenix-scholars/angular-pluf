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
 * @ngdoc factory
 * @name PCommand
 * @description
 * ساختار داده‌ای دستور را تعیین می‌کند. این ساختار داده‌ای به صورت داخلی استفاده می‌شود و برای نگهداری
 * دستورهایی است که کاربران به سیستم اضافه می‌کنند. مهم‌ترین پارامتر موجود در این ساختار داده‌ای
 * فهرستی از دستگیره‌ها است که در ازای اجرا این دستور اجرا خواهند شد.
 */
.factory('PCommand',function () {
  var pCommand  = function(data) {
    this.priority = 0;
    this.tags = [];
    if (data) {
      this.setData(data);
    }
    this.handlers = [];
    if (!('visible' in data)) {
			this.visible = function() {return true;};
		}
		if (!('enable' in data)) {
			this.enable = function() { return true; };
		}
  };
  /**
   * داده‌های اولیه دستور را تعیین می‌کند.
   *
   * @memberof PCommand
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {pCommand}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pCommand.prototype.setData = function(data) {
   angular.extend(this, data);
   return this;
  };

  /**
   * یک دستگیره جدید را به فهرست دستگیره‌های موجود در این دستور اضافه می‌کند.
   *
   * @memberof PCommand
   * @param  {PHandler} handler دستگیره جدید برای این دستور
   * @return {PCommand}   خود دستور به عنوان نتیجه برگردانده می‌شود.
   */
  pCommand.prototype.handler = function(h){
    this.handlers.push(h);
    return this;
  };
  /**
   * یک برچسب جدید به این دستور اضافه می‌کند. هر دستور یک فهرست از برچسب‌ها دارد که یک
   * حالت و دسته خاص از دستورها را نشان می‌دهد. اضافه کردن برچسب به دستور خیلی ساده انجام
   * می‌شود:
   *
   * <pre><code>
   * 	var cmd = new PCommand();
   * 	...
   * 	cmd
   * 		.tag('menu')
   * 		.tag('usr')
   * 		.tag('login');
   * </code></pre>
   *
   *	فهرست برچسب‌ها را می‌توان در زمان تعریف یک دستور نیز تعیین کرد:
   *
   * <pre><code>
   * 	$act.command({
   * 		id: 'user.login',
   * 		lable: 'login',
   * 		tags:['menu', 'user', 'login']
   * 	});
   * </code></pre>
   *
   * برای اینکه از این برچسب‌ها توی لایه نمایش و یا اینکه پردازش‌های دیگه استفاده کنید کافی هست که
   * به صورت مستقیم از فهرست برچسب‌ها استفاده کنید. برای نمونه کد زیر یک دستور را نمایش داده
   * و با کلیک کردن کاربر روی آن اجرا می‌کند:
   *
   * اولین کاری که باید بکنید تعریف کردن دستور و دستیگره مناسب برای اون هست:
   * <pre><code>
   * app.run(function($act){
   * 	$act.command({
   * 		id: 'info.command',
   * 		label: 'Show info',
   * 		tags: ['x', 'y']
   * 	}).handler({
   * 		command: 'info.command',
   * 		handle: function(message){
   * 			alert(message);
   * 		}
   * 	});
   * });
   * </code></pre>
   *
   * بعد این دستور رو به یک متغیر توی فضای نمایش میدیم که قابل نمایش باشه:
   * <pre><code>
   * 	app.controller('CommandController', function($scope, $act){
   * 		$scope.execute = function(){
   * 			$act.execute(arguments);
   * 		};
   * 		$act.getCommand('info.command').then(function(cmd){
   * 			$scope.cmd = cmd;
   * 		});
   * 	});
   * </code></pre>
   *
   * حالا کافی هست که توی نمایش این دستور رو نشون بدیم
   * <pre><code>
   * 	<div ng-click="execute(cmd.id, 'this is example message')">
   *  	<h3>{{cmd.label}}</h3>
   *  	<ul>
   *  		<li ng-repeate="tag in cmd.tags">{{tag}}</li>
   *  	</ul>
   * 	</div>
   * </code></pre>
   *
   * @memberof PCommand
   * @param  {string} tag برچسب جدید
   * @return {PCommand}   خود دستور را به عنوان نتیجه برمی‌گرداند.
   */
  pCommand.prototype.tag = function(tag){
    this.tags.push(tag);
  };
  return pCommand;
});
