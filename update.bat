@echo off
setlocal enabledelayedexpansion

echo === Обновление проекта на GitHub ===
echo.

cd /d C:\Users\Martyshev\telegram_rps_game

REM Проверяем какие файлы изменились
set "html_changed=0"
set "css_changed=0"
set "js_changed=0"
set "bot_changed=0"
set "docs_changed=0"

git diff --name-only HEAD | findstr /i "index.html" >nul && set html_changed=1
git diff --name-only HEAD | findstr /i ".css" >nul && set css_changed=1
git diff --name-only HEAD | findstr /i ".js" >nul && set js_changed=1
git diff --name-only HEAD | findstr /i "bot/" >nul && set bot_changed=1
git diff --name-only HEAD | findstr /i ".md" >nul && set docs_changed=1

REM Формируем описание
set "message="

if %html_changed%==1 set message=!message!HTML: 
if %css_changed%==1 set message=!message!CSS: 
if %js_changed%==1 set message=!message!JS: 
if %bot_changed%==1 set message=!message!Bot: 
if %docs_changed%==1 set message=!message!Docs: 

if "!message!"=="" set message=Мелкие правки

REM Удаляем лишние символы
set message=%message:~0,-2%

echo [1/3] Добавление изменений...
git add .

echo [2/3] Коммит...
echo Описание: !message!
git commit -m "!message!"

echo [3/3] Отправка на GitHub...
git push

echo.
echo === Готово! ===
echo.
echo Изменения: !message!
echo Проверьте: https://duxa1206.github.io/telegram-rps-game/
pause
