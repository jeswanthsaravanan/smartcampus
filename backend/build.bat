@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21
set M2_HOME=C:\Users\snave\Downloads\moooo\backend\tools\apache-maven-3.9.12
set PATH=%JAVA_HOME%\bin;%M2_HOME%\bin;%PATH%
call mvn %*
