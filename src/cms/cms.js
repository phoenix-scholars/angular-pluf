/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')
/**
 * @memberof pluf
 * @ngdoc service
 * @name $cms
 * 
 * @description مهم‌ترین سرویسی است که در این بسته ارائه شده و کار با محتوی و
 *              اطلاعات آن را آسان می‌کند. این سرویس برای جستجو و یا گرفتن
 *              اطلاعات هر محتوایی از سیستم کاربرد دارد. متحوی کاربرد زیادی توی
 *              صفحه‌های وب داره مثلا با استفاده از محتوی می‌تونید صفحه اول سایت
 *              رو طراحی کنید و یا یک کلیپ آموزشی روی سایت بزارید.
 * 
 * برای هر محتوی می‌تونید یک نام در نظر بگیرد که در این صورت بهش می‌گیم محتوی
 * نام دارد. این نوع محتوی برای استفاده در سایت‌ها خیلی مناسب هست. برای نمونه در
 * یک صفحه می‌تونید مطالب رو به صورت زیر بگیرد و نمایش بدید:
 * 
 * <pre><code>
 * $cms.namedContent('about-us').then(function(nc) {
 * 	return nc.value();
 * }).then(function(cv) {
 * 	$scope.content = cv;
 * });
 * </code></pre>
 * 
 * البته ما اینجا فرض کردیم که محتوی موجود از نوع جیسون هست برای همین به صورت یک
 * موجودیت جاواسکریپتی باهاش برخورد کردیم.
 * 
 * @version 1.0 بر اساس قراردادهایی که در سین ۲ معرفی شده است ساختار این کلاس به
 *          روز شدا تا مدلهای جدید داده‌ای را ارائه کند. این ساختار به مراتب
 *          ساده‌تر از مدلی است که در نسخه‌های قبل ارائه شده است.
 */
.service(
		'$cms',
		function($http, $httpParamSerializerJQLike, $q, $timeout, PContent,
				PaginatorPage, PObjectCache, $pluf) {
			var _cache = new PObjectCache(function(data) {
				return new PContent(data);
			});
			this._cache = _cache;

			/**
			 * این فراخوانی یک ساختار داده‌ای جدید ایجاد می‌کند.
			 * 
			 * @memberof $cms
			 * @param {PContent}
			 *            contet ساختار داده‌ای محتوی برای ایجاد
			 * @return {promise(PContent)}
			 */
			this.newContent = $pluf.createNew({
				method : 'POST',
				url : '/api/cms/new'
			}, _cache);

			/**
			 * یک محتوی با شناسه خاص را تعیین می‌کند.
			 * 
			 * @memberof $cms
			 * @param {Integer}
			 *            id شناسه محتوی
			 * @return {promise(PContent)} محتوی معادل
			 */
			this.content = $pluf.createGet({
				method : 'GET',
				url : '/api/cms/{id}'
			}, _cache);

			/**
			 * فهرست تمام محتوی موجود را تعیین می‌کند
			 * 
			 * @memberof $cms
			 * @param {PaginatorParameter}
			 *            param پارامترهای جستجو
			 * @return {promise(PaginatorPage(PContent))} نتیجه جستجو
			 */
			this.contents = $pluf.createFind({
				method : 'GET',
				url : '/api/cms/find'
			}, _cache);
		});
