

# مقدمه

دوتا موجودیت اصلی داریم:

- PTenant
- PApplication

## Tenant

یک نسخه کامل از سیستم است که مجموعه‌ای از کاربران، تنظیم‌ها و سطوح دسترسی دارد.

## Application

یک صفحه وب و یا برنامه کاربردی است که امکان دسترسی به منابع tenant را برای کاربران فراهم می‌کند.


# $tenant

این سرویس امکانات اولیه را فراهم می‌کند

## ساخت

فراخوانی زیر یک نمونه جدید را ثبت کرده و مالک آن را کاربر جاری قرار می‌دهد


	var param = {
                'title': t,
                'description': d,
              };
	$tenant.create(param).then(function(tenant){
		// deal with tenant
	});

## جاری

برای تعیین tenant جاری فراخوانی زیر در نظر گرفته شده:

	$tenant.session().then(function(tenant){
		// tenant is current one
	});

نمونه برگشتی از نوع PTenant است.

## گرفتن

فراخوانی زیر برای گرفتن یک tenant با شناسه خاص است:

	$tenant.get(id).then(function(tenant){
		// the tenant
	});

## جستحو و فهرست

فراخوانی زیر برای جستجو و فهرست به کار گرفته می‌شود

	var param = new PaginatorParameter();
	...
	$tenant.tenants(param).then(function(page){
		// paginated page result
	});

## فهرست برای کاربر

تمام tenant ها برای کاربر قابل دسترسی نیست از این رو فراخوانی در نظر گرفته شده که تنها میان نمونه‌های قابل دسترسی جستجو کند

	var param = new PaginatorParameter();
	...
	$tenant.mine(param).then(function(page){
		// paginated page result
	});

# PTenant

این ساختار داده‌ای یک Tenant را تعیین می‌کند.

## به روز کردن

	tenant.update(key, value).then(function(tenant){
		// Updated tenant
	});

## کاربران

	tenant.members().then(function(members){
		//{owner:[], member:[], authorized:[]}
	});

## نرم افزارها

	var param = new PaginatorParameter();
	...
	tenant.apps(param).then(function(page){
		// Paginated list of apps
	});

## اجرا کردن 

این دستور یک tenant را اجرا می‌کند.

	ID        : pluf.saas.lunch
	Parameter : Tenant ID
	


# PApplication

این ساختار داده‌ای برای نمایش امکاناتی است که کاربر به آنها دسترسی دارد.

## اجرای یک برنام

	app.lunch().then(function(){
		// unaccessable 
	}, function(error){
		// If error
	});
