@echo off
setlocal enabledelayedexpansion

cd /d C:\Users\Martyshev\telegram_rps_game

REM Анализируем изменения
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

if "!message!"=="" set message=Обновление

set message=%message:~0,-2%

git add .
git commit -m "!message!" >nul
git push >nul 2>&1

if %errorlevel%==0 (
    echo Обновлено: !message!
) else (
    echo Нет изменений для отправки
)
