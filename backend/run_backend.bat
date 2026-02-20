@echo off
set "MAVEN_HOME=C:\Program Files\Maven\apache-maven-3.9.12"
set "PATH=%MAVEN_HOME%\bin;%PATH%"
cd /d "c:\Users\snave\Downloads\moooo\backend"
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8080
