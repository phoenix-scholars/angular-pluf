DEPRECATED: For new updates see:

https://gitlab.com/seen/angular

# angular-pluf

به مرور زمان به یک مجموعه از قراردادهای پرکاربرد رسیدیم که توی توسعه سرورهای  تحت وب خیلی کاربرد دارن. برای همین تلاش کردیم یه مجموعه چکیده از اونها رو به عنوان یک قرار داد ساده جمع آوری کنیم و ابزارهای ارتباطی مناسبی برای اون پیاده سازی کنیم. اسم قرارداد رو سین گذاشتیم که به صورت یک پروژه متن باز در دسترس هست. این بسته پیاده سازی انگولار برای این قرار داد هست.

هر سروری که بر اساس قرارداد سین طراحی و پیاده سازی شده باشه، این بسته رو می‌شه براش به کار برد و بر اساس اون نرم افزارهای تحت وب رو توسعه داد. پیاده‌سازی این قرارداد با زبان PHP به صورت متن باز در اختیار است و شما می‌تونید به سادگی یک سرور ساده برای خودتون راه اندازی کنید.

مجموعه‌ای از نرم‌افزارهای تحت وب متن باز نیز توسعه پیدا کردن که همگی بر اساس همین قرارداد و همین بسته طراحی و پیاده‌سازی شدن. شما می‌تونید از این بسته‌ها توی کارهای خودتون استفاده کنید. با این کار می‌تونید در زمان خیلی کوتاهی یک سایت با کیفیت عالی داشته باشید.

[DPQ](http://dpq.co.ir)

## نصب

برای نصب این بسته با استفاده از ابزار bower باید دستور زیر را اجرا کنید.

	bower install angular-pluf --save

دوتا پوشه وجود داره که پرونده‌های اصلی این پروژه رو تعیین می‌کنن:

- src
- dist

که به ترتیب برای کد منبع و نتیجه نهایی هستن. اونهایی که به عنوان نتیجه نهایی ایجاد شدن حجم کمتری دارن و باید در پروژه‌های اصلی از اونها استفاده بشه.


## توسعه


### نصب ابزارها

ابزارهای مورد نیاز در فرآیند توسعه با استفاده از nodejs مدیریت می‌شود. برای نصب این نرم افزارها کافی است دستور زیر را در خط فرمان وارد کنید:

	npm install

بعد از این کار باید وابستگی‌های مورد نیاز در پروژه را هم نصب کنید:

	bower install

### ساخت محصول

برای ساخت محصول باید دستور زیر را استفاده کنید:

	grunt build

## تست و رفع خطا

برای اجرای تست‌ها دستور زیر را اجرا کنید:

	grunt test

برای رفع خطا نیز می‌توانید از دستور زیر استفاده کنید:

	grunt debug
