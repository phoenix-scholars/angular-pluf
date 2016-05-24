/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PContent',[
			'$http', '$httpParamSerializerJQLike', '$q', 'PObject', 'PException',
			PContent
		]);
	/**
	 * @memberof pluf
	 * @ngdoc factory
	 * @name PContent
	 * @description
	 * ساختار داده‌ای محتوی را ایجاد می‌کند. این ساختار داده‌ای شامل اطلاعات کلی از محتوی است که
	 * از این میان می‌توان به موارد زیر اشاره کرد:
	 *
	 * <ul>
	 * 	<li>id</li>
	 * 	<li>name</li>
	 * 	<li>mimetype</li>
	 * 	<li>tenant</li>
	 * </ul>
	 */
	function PContent($http, $httpParamSerializerJQLike, $q, PObject,	PException) {
		var pContent = function() {
			PObject.apply(this, arguments);
		};
	 	pContent.prototype = new PObject();
		// TODO:maso, 1395: به روز کردن محتوی
		pContent.prototype.update = function(){
		};
		// TODO:maso, 1395: حذف محتوی
		pContent.prototype.remove = function(){
		};
		// TODO: maso, 1395: محتوی صفحه را می‌دهد
		pContent.prototype.value = function(){
			// if(this._cvalue()){
			// 	var deferred = $q.defer();
			// 	deferred.resolve(this._cvalue());
			// 	return deferred.promise;
			// }
			return $http({
				method: 'GET',
				url: '/api/saascms/content/'+this.id+'/download'
			}).then(function(res){
				// scope._setCvalue(res.data);
				return res.data;
			});
		};
		pContent.prototype.setValue = function(d){
			var scope = this;
			return $http({
				method:'POST',
				url: '/api/saascms/content/'+this.id+'/download',
				data: d,
			}).then(function(res){
				return scope;
			});
		};
	 	return pContent;
	 }

//End
})();
