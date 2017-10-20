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
 * @ngdoc factory
 * @name PGroup
 * @memberof pluf
 * 
 * @description
 * 
 */
.factory('PMonitorProperty', function(PObject, $rootScope, $http, PObjectFactory) {
    /*
     * یک نمونه جدید از این موجودیت ایجاد می کند.
     */
    var pMonitorProperty = function() {
	PObject.apply(this, arguments);
    };
    pMonitorProperty.prototype = new PObject();

    pMonitorProperty.prototype.refresh = function() {
	var scope = this;
	if(!this.path){
	    this.path = '/api/monitor/'+this.monitor+'/property/'+this.id;
	}
	return $http.get(this.path)//
	.then(function(res) {
	    // XXX: maso, 1395: handle tablular and scalar types
	    if (res.data.value !== scope.value) {
		$rootScope.$emit(scope.path, scope.value, res.data.value);
	    }
	    scope.setData(res.data);
	    return scope;
	}, function(){
		if(scope.value){
			$rootScope.$emit(scope.path, scope.value, false);
		}
		scope.setData(false);
		return scope;
	});
    };

    pMonitorProperty.prototype.watch = function(callback) {
	if(!this.path){
	    this.path = '/api/monitor/'+this.monitor+'/property/'+this.id;
	}
	return $rootScope.$on(this.path, callback);
    }

    return pMonitorProperty;
});
