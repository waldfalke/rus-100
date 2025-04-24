package com.catmepim.import.test;

import com.catmepim.import.PriceListImporter;
import com.catmepim.import.StandardPriceListImporter;
import com.catmepim.model.PriceList;
import com.catmepim.model.Supplier;
import com.catmepim.model.ImportResult;
import com.catmepim.model.ValidationReport;
import com.catmepim.model.ValidationError;
import com.catmepim.model.ValidationWarning;

import java.io.File;
import java.util.List;

/**
 * Тестовый класс для демонстрации использования импорта прайс-листов
 * согласно контракту импорта прайс-листов (Price List Import Contract)
 */
public class PriceListImportTest {

    public static void main(String[] args) {
        // Демонстрация импорта прайс-листов
        testPriceListImport();
        
        // Демонстрация валидации файлов прайс-листов
        testPriceListValidation();
        
        // Демонстрация обработки ошибок
        testPriceListErrorHandling();
    }
    
    /**
     * Демонстрирует базовый процесс импорта прайс-листа
     */
    private static void testPriceListImport() {
        System.out.println("=== Тест импорта прайс-листа ===");
        
        // Создание экземпляра импортера прайс-листов
        PriceListImporter importer = new StandardPriceListImporter();
        
        try {
            // Файл прайс-листа (предполагается, что файл существует)
            File priceListFile = new File("./test_data/supplier_price_list.csv");
            
            // Информация о поставщике (обычно получается из базы данных)
            Supplier supplier = createTestSupplier();
            
            // Настройка параметров импорта
            PriceListImporter.ImportOptions options = new PriceListImporter.ImportOptions();
            options.setUpdateExistingPrices(true); // Обновлять существующие цены
            options.setCreateNewProducts(false);   // Не создавать новые товары
            options.setPriceType(PriceList.PriceType.RETAIL); // Тип цены: розничная
            options.setCurrencyCode("RUB");       // Валюта: рубли
            options.setSkipFirstRow(true);        // Пропустить первую строку (заголовки)
            
            // Выполнение импорта
            ImportResult result = importer.importFromFile(priceListFile, supplier, options);
            
            // Обработка результата
            System.out.println("Импорт завершен:");
            System.out.println("- Всего записей: " + result.getTotalItems());
            System.out.println("- Успешно импортировано: " + result.getSuccessfullyImported());
            System.out.println("- Требуют ручной обработки: " + result.getPendingReview());
            System.out.println("- Ошибки: " + result.getErrors().size());
            
            // Если есть записи, требующие ручного сопоставления
            if (result.getPendingReview() > 0) {
                System.out.println("\nТовары, требующие ручного сопоставления:");
                List<PriceList.PriceItem> pendingItems = result.getPendingItems();
                for (int i = 0; i < Math.min(5, pendingItems.size()); i++) {
                    PriceList.PriceItem item = pendingItems.get(i);
                    System.out.println("  " + (i+1) + ". " + item.getTitle() + " (ISBN: " + item.getIsbn() + ")");
                }
                if (pendingItems.size() > 5) {
                    System.out.println("  ... и еще " + (pendingItems.size() - 5) + " записей");
                }
            }
            
        } catch (Exception e) {
            System.err.println("Ошибка при импорте прайс-листа: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Демонстрирует процесс валидации файла прайс-листа
     */
    private static void testPriceListValidation() {
        System.out.println("\n=== Тест валидации прайс-листа ===");
        
        // Создание экземпляра импортера прайс-листов
        PriceListImporter importer = new StandardPriceListImporter();
        
        try {
            // Файл прайс-листа
            File priceListFile = new File("./test_data/supplier_price_list_with_errors.csv");
            
            // Информация о поставщике
            Supplier supplier = createTestSupplier();
            
            // Валидация файла
            ValidationReport report = importer.validateFile(priceListFile, supplier);
            
            // Вывод результатов валидации
            System.out.println("Валидация завершена:");
            System.out.println("- Всего строк: " + report.getTotalRows());
            System.out.println("- Строк с ошибками: " + report.getInvalidRows());
            
            // Вывод ошибок валидации
            if (report.getErrors().size() > 0) {
                System.out.println("\nОшибки валидации:");
                for (int i = 0; i < Math.min(5, report.getErrors().size()); i++) {
                    ValidationError error = report.getErrors().get(i);
                    System.out.println("  Строка " + error.getRowNumber() + ": " + error.getMessage());
                }
                if (report.getErrors().size() > 5) {
                    System.out.println("  ... и еще " + (report.getErrors().size() - 5) + " ошибок");
                }
            }
            
            // Вывод предупреждений
            if (report.getWarnings().size() > 0) {
                System.out.println("\nПредупреждения:");
                for (int i = 0; i < Math.min(5, report.getWarnings().size()); i++) {
                    ValidationWarning warning = report.getWarnings().get(i);
                    System.out.println("  Строка " + warning.getRowNumber() + ": " + warning.getMessage());
                }
                if (report.getWarnings().size() > 5) {
                    System.out.println("  ... и еще " + (report.getWarnings().size() - 5) + " предупреждений");
                }
            }
            
        } catch (Exception e) {
            System.err.println("Ошибка при валидации прайс-листа: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Демонстрирует обработку ошибок при импорте
     */
    private static void testPriceListErrorHandling() {
        System.out.println("\n=== Тест обработки ошибок импорта ===");
        
        // Создание экземпляра импортера прайс-листов
        PriceListImporter importer = new StandardPriceListImporter();
        
        try {
            // Несуществующий файл прайс-листа
            File priceListFile = new File("./test_data/non_existent_file.csv");
            
            // Информация о поставщике
            Supplier supplier = createTestSupplier();
            
            // Настройка параметров импорта
            PriceListImporter.ImportOptions options = new PriceListImporter.ImportOptions();
            
            // Попытка импорта с обработкой ошибок
            try {
                ImportResult result = importer.importFromFile(priceListFile, supplier, options);
                System.out.println("Импорт успешно завершен (что странно для несуществующего файла)");
            } catch (Exception e) {
                System.out.println("Перехвачена ожидаемая ошибка: " + e.getMessage());
                System.out.println("Тип ошибки: " + e.getClass().getSimpleName());
                
                // Демонстрация обработки разных типов ошибок
                if (e instanceof java.io.FileNotFoundException) {
                    System.out.println("Обработка ошибки: файл не найден");
                    // Здесь можно выполнить специфичные действия для этого типа ошибок
                } else if (e instanceof java.io.IOException) {
                    System.out.println("Обработка ошибки: проблема ввода-вывода");
                    // Здесь можно выполнить специфичные действия для этого типа ошибок
                } else {
                    System.out.println("Обработка неожиданной ошибки");
                    // Общая обработка ошибок
                }
            }
            
        } catch (Exception e) {
            System.err.println("Неожиданная ошибка: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Вспомогательный метод для создания тестового поставщика
     */
    private static Supplier createTestSupplier() {
        // В реальном приложении эта информация обычно берется из базы данных
        Supplier supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Тестовый поставщик");
        supplier.setCode("TEST_SUPPLIER");
        supplier.setStatus("active");
        
        // Настройки импорта для поставщика
        Supplier.Settings settings = new Supplier.Settings();
        settings.setFileFormat("csv");
        settings.setHasHeader(true);
        settings.setDelimiter(";");
        settings.setEncoding("UTF-8");
        settings.setDefaultCurrency("RUB");
        
        // Настройка сопоставления колонок
        settings.setColumnMapping(new java.util.HashMap<String, String>() {{
            put("ISBN", "isbn");
            put("Название", "title");
            put("Автор", "author");
            put("Издательство", "publisher");
            put("Цена", "price");
            put("Наличие", "stock");
        }});
        
        supplier.setSettings(settings);
        
        return supplier;
    }
}

/**
 * Заглушки для классов, необходимых для компиляции примера
 * В реальном приложении эти классы должны быть полноценно реализованы
 */

// Заглушка для класса StandardPriceListImporter
class StandardPriceListImporter implements PriceListImporter {
    @Override
    public ImportResult importFromFile(File file, Supplier supplier, ImportOptions options) {
        // Симуляция импорта
        ImportResult result = new ImportResult();
        result.setTotalItems(100);
        result.setSuccessfullyImported(85);
        result.setPendingReview(10);
        
        // Добавление нескольких "ошибок"
        result.getErrors().add("Строка 5: Отсутствует обязательное поле 'price'");
        result.getErrors().add("Строка 15: Некорректный формат ISBN");
        result.getErrors().add("Строка 27: Цена не может быть отрицательной");
        result.getErrors().add("Строка 42: Не указано название товара");
        result.getErrors().add("Строка 56: Неизвестная валюта 'USD'");
        
        // Симуляция товаров, требующих ручного сопоставления
        for (int i = 1; i <= 10; i++) {
            PriceList.PriceItem item = new PriceList.PriceItem();
            item.setTitle("Тестовая книга #" + i);
            item.setIsbn("978-5-699-" + (10000 + i));
            item.setAuthor("Автор книги #" + i);
            item.setPrice(100.0 + i * 50);
            result.getPendingItems().add(item);
        }
        
        return result;
    }
    
    @Override
    public ImportResult importFromStream(java.io.InputStream inputStream, FileType fileType, Supplier supplier, ImportOptions options) {
        // Реализация не используется в данном примере
        return new ImportResult();
    }
    
    @Override
    public ValidationReport validateFile(File file, Supplier supplier) {
        // Симуляция валидации
        ValidationReport report = new ValidationReport();
        report.setTotalRows(100);
        report.setInvalidRows(15);
        
        // Добавление нескольких "ошибок" валидации
        for (int i = 1; i <= 8; i++) {
            ValidationError error = new ValidationError();
            error.setRowNumber(i * 5);
            error.setMessage("Ошибка валидации #" + i + ": " + getRandomErrorMessage());
            report.getErrors().add(error);
        }
        
        // Добавление нескольких "предупреждений" валидации
        for (int i = 1; i <= 12; i++) {
            ValidationWarning warning = new ValidationWarning();
            warning.setRowNumber(i * 7);
            warning.setMessage("Предупреждение #" + i + ": " + getRandomWarningMessage());
            report.getWarnings().add(warning);
        }
        
        return report;
    }
    
    @Override
    public File getImportTemplate(Supplier supplier, FileType fileType) {
        // Реализация не используется в данном примере
        return new File("template.csv");
    }
    
    // Вспомогательный метод для генерации случайных сообщений об ошибках
    private String getRandomErrorMessage() {
        String[] errors = {
            "Отсутствует обязательное поле",
            "Некорректный формат ISBN",
            "Цена должна быть положительным числом",
            "Не указано название товара",
            "Неизвестная валюта",
            "Превышена максимальная длина поля",
            "Некорректный формат даты"
        };
        return errors[(int)(Math.random() * errors.length)];
    }
    
    // Вспомогательный метод для генерации случайных предупреждений
    private String getRandomWarningMessage() {
        String[] warnings = {
            "Цена значительно отличается от текущей",
            "Рекомендуется указать дополнительные атрибуты",
            "Возможное дублирование товара",
            "Название содержит специальные символы",
            "Отсутствует рекомендованная розничная цена"
        };
        return warnings[(int)(Math.random() * warnings.length)];
    }
} 