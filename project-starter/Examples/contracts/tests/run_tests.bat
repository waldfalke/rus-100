@echo off
echo ===== Тестирование контрактов CATMEPIM =====

REM Устанавливаем пути
set CONTRACTS_DIR=%~dp0..
set TESTS_DIR=%CONTRACTS_DIR%\tests
set JAVA_DIR=%TESTS_DIR%\java
set PYTHON_DIR=%TESTS_DIR%\static
set SCHEMA_DIR=%TESTS_DIR%\schema

REM Проверяем наличие Python
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python не найден. Установите Python 3.7+ и попробуйте снова.
    exit /b 1
)

REM Проверяем наличие pytest
python -c "import pytest" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Установка pytest...
    pip install pytest
)

REM Проверяем наличие jsonschema
python -c "import jsonschema" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Установка jsonschema...
    pip install jsonschema
)

REM Проверяем наличие Maven
mvn --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Maven не найден. Java-тесты не будут запущены.
    set SKIP_JAVA=1
) else (
    set SKIP_JAVA=0
)

echo.
echo === Запуск тестов статического анализа контрактов ===
echo.

cd %PYTHON_DIR%
python -m pytest consistency\test_contract_consistency.py -v

echo.
echo === Запуск тестов совместимости контрактов ===
echo.

python -m pytest compatibility\test_contract_compatibility.py -v

echo.
echo === Запуск тестов JSON-схем ===
echo.

cd %SCHEMA_DIR%
python -m pytest test_json_schema_validation.py -v

if %SKIP_JAVA% EQU 0 (
    echo.
    echo === Запуск тестов реализуемости контрактов (Java) ===
    echo.

    cd %JAVA_DIR%
    mvn test
)

echo.
echo === Тестирование завершено ===
echo.
