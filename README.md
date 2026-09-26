# ExitLag Pro Mobile - eFootball League Booster (PES Mobile)

موتور بهینه‌ساز تخصصی حریف‌یابی (Matchmaking) بازی eFootball™ 2026 Mobile در بخش دیویژن (Division League) از داخل ایران.

---

## 📱 راهنمای نصب و اجرا روی موبایل (Android & iOS)

### روش ۱: نصب مستقیم روی صفحه اصلی گوشی (PWA / WebAPK)
بدون نیاز به فایل APK یا استورهای خارجی، می‌توانید این اپلیکیشن را مستقیماً روی موبایل خود نصب کنید:
1. در مرورگر **Google Chrome** یا **Samsung Internet** روی گوشی خود، منوی سه‌نقطه (⋮) بالا یا راست را بزنید.
2. گزینه **«افزودن به صفحه اصلی» (Add to Home screen)** یا **«نصب برنامه» (Install App)** را لمس کنید.
3. برنامه مانند یک اپلیکیشن کاملاً مستقل و بومی اندروید با آیکون اختصاصی و بدون نوار آدرس مرورگر به گوشی شما اضافه می‌شود.

---

### روش ۲: ارسال پروژه به گیت‌هاب (Push to GitHub)
برای قرار دادن این پروژه در اکانت گیت‌هاب خود:
```bash
# 1. ساخت ریپازیتوری در گیت‌هاب با نام exitlag-efootball-booster

# 2. در ترمینال یا پوشه پروژه:
git init
git add .
git commit -m "Initial release of ExitLag eFootball Booster"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/exitlag-efootball-booster.git
git push -u origin main
```

---

### روش ۳: ساخت فایل APK مستقل با Capacitor (Android Studio)
اگر می‌خواهید فایل `.apk` واقعی برای اندروید بسازید:
```bash
# 1. نصب وابستگی‌های خروجی اندروید
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. بیلد پروژه
npm run build

# 3. پیکربندی خروجی اندروید
npx cap init "ExitLag eFootball" "com.exitlag.efootball" --web-dir dist
npx cap add android
npx cap open android
```
سپس در محیط Android Studio گزینه **Build > Build Bundle(s) / APK(s) > Build APK(s)** را بزنید تا فایل APK آماده نصب تولید شود.

---

## ⚡ نحوه حل مشکل سرچ حریف در دیویژن ایفوتبال:
1. پورت‌های `5730-5739 UDP` اختصاصی کونامی را با کانفیگ‌های Sing-box / v2rayNG ارائه شده در برنامه باز کنید.
2. APN سیم‌کارت خود را در تنظیمات گوشی روی فقط `IPv4` قرار دهید.
3. در منوی بازی ایفوتبال، گزینه `Matchmaking Search Area` را روی `Gradually expand search area` تنظیم کنید.
