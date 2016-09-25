/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')


/**
 * @ngdoc factory
 * @name PProfile
 * @memberof pluf
 * 
 * @description
 * هر کاربر در هر سیستم یک پروفایل مخصوص به خود دارد که شامل یه سری اطلاعات کلی می‌شود.
 * این اطلاعات برای هر نرم افزار می‌تواند متفاوت باشد برای نمونه شما در سیستم فروش یک پروفایل
 * دارید که شامل شماره تماس است اما در سیستم کتابداری پروفایل شما شامل شماره دانشجویی
 * است.
 *
 * طبعت متغیر این مدل داده‌ای منجر به این شده که این مدل یک مدل کلی به صورت کلید مقدار باشد
 * که شما می‌توانید مقادیر مورد نظر خود را در آن اضافه و کم کنید.
 * 
 * @attr {Integer} id شناسه
 * @attr {Integer} user شناسه حساب کاربری مربوط به این پروفایل
 * @attr {Boolean} validate وضعیت اعتبار پروفایل
 * @attr {String} country کشور
 * @attr {String} city شهر
 * @attr {String} address آدرس
 * @attr {String} postal_code کد پستی
 * @attr {String} phone_number شماره تلفن
 * @attr {String} mobile_number شماره موبایل
 * @attr {String} national_id کد ملی
 * @attr {String} shaba شماره شبای بانکی
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد پروفایل
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory('PProfile', function( $http, $httpParamSerializerJQLike, $q, PObject) {
	/*
	 * یک نمونه جدید از این موجودیت ایجاد می کند.
	 */
	var pProfile = function(data) {
		if(data){
			this.setData(data);
		}
	};
	
	pProfile.prototype = new PObject();

	/**
	 * تغییرهای اعمال شده در ساختار داده‌ای پروفایل کاربری را به سرور انتقال می‌دهد.
	 * تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای اعمال شده در این ساختار داده‌ای تنها
	 * در برنامه کاربر خواهد بود و با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد
	 *
	 * @memberof PProfile
	 * 
	 * @return {promise(PProfile)} ساختار داده‌ای پرفایل کاربری
	 */
	pProfile.prototype.update = function() {
		if (this.user.isAnonymous()) {
			var deferred = $q.defer();
			deferred.reject();
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/'+ this.user.id + '/profile',
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		});
	};
	
	/**
	 * پروفایل کاربری را حذف می کند
	 * 
	 * @memberof PProfile
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف شده
	 */
	pProfile.prototype.remove = function(){
		var scope = this;
		return $http({
			method : 'DELETE',
			url : '/api/user/' + this.user + '/profile',
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data){
			scope.setData(data.data);
			return scope;
		});
	};
	
	return pProfile;
});
