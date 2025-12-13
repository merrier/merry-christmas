@echo off
setlocal enabledelayedexpansion

echo 开始循环复制...

REM 从第7张开始，循环到200张
for /L %%i in (7,1,200) do (
    REM 计算源图片编号：(i-1) MOD 6 + 1
    set /a "num=%%i-1"
    set /a "src_idx=!num!%%6+1"
    
    REM 执行复制：例如把 (1).png 复制为 (7).png
    copy "(!src_idx!).png" "(%%i).png" >nul
)

echo 完成！已生成至 (200).png
pause