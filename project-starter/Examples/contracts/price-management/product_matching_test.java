package com.catmepim.matching.test;

import com.catmepim.matching.ProductMatcher;
import com.catmepim.matching.StandardProductMatcher;
import com.catmepim.model.Book;
import com.catmepim.model.PriceItem;
import com.catmepim.matching.ProductMatcher.MatchResult;

import java.util.List;
import java.util.Optional;

/**
 * Тестовый класс для демонстрации использования сопоставления товаров
 * согласно контракту сопоставления товаров (Product Matching Contract)
 */
public class ProductMatchingTest {

    public static void main(String[] args) {
        // Демонстрация базового сопоставления
        testBasicMatching();
        
        // Демонстрация работы с неоднозначными соответствиями
        testMultipleMatches();
        
        // Демонстрация обновления цен
        testPriceUpdate();
    }
    
    /**
     * Демонстрирует базовый процесс сопоставления товара
     */
    private static void testBasicMatching() {
        System.out.println("=== Тест базового сопоставления ===");
        
        // Создание экземпляра сопоставителя
        ProductMatcher matcher = new StandardProductMatcher();
        
        try {
            // Создание тестового элемента прайс-листа
            PriceItem priceItem = createTestPriceItem();
            
            // Поиск соответствующей книги
            Optional<Book> matchedBook = matcher.findMatchingBook(priceItem);
            
            // Обработка результата
            if (matchedBook.isPresent()) {
                Book book = matchedBook.get();
                System.out.println("Найдено соответствие:");
                System.out.println("- ID книги: " + book.getId());
                System.out.println("- Название: " + book.getTitle());
                System.out.println("- ISBN: " + book.getIsbn());
                System.out.println("- Автор: " + book.getAuthor());
                
                // Обновление цены
                boolean updated = matcher.updateBookPrice(book, priceItem);
                System.out.println("Цена " + (updated ? "обновлена" : "не изменилась"));
                System.out.println("- Новая цена: " + book.getPrice() + " " + book.getCurrency());
            } else {
                System.out.println("Соответствие не найдено");
                System.out.println("Возможные действия:");
                System.out.println("1. Создать новый товар");
                System.out.println("2. Выполнить ручное сопоставление");
                System.out.println("3. Игнорировать элемент прайс-листа");
            }
            
        } catch (Exception e) {
            System.err.println("Ошибка при сопоставлении: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Демонстрирует работу с несколькими потенциальными соответствиями
     */
    private static void testMultipleMatches() {
        System.out.println("\n=== Тест работы с несколькими соответствиями ===");
        
        // Создание экземпляра сопоставителя
        ProductMatcher matcher = new StandardProductMatcher();
        
        try {
            // Создание тестового элемента прайс-листа с неоднозначным названием
            PriceItem priceItem = createTestPriceItem();
            priceItem.setIsbn(null); // Убираем ISBN для получения нескольких соответствий
            priceItem.setTitle("Мастер и Маргарита");
            
            // Поиск всех потенциальных соответствий с порогом 0.5
            List<MatchResult> potentialMatches = matcher.findPotentialMatches(priceItem, 0.5);
            
            // Обработка результата
            if (potentialMatches.isEmpty()) {
                System.out.println("Соответствий не найдено");
            } else {
                System.out.println("Найдено " + potentialMatches.size() + " потенциальных соответствий:");
                
                for (int i = 0; i < potentialMatches.size(); i++) {
                    MatchResult match = potentialMatches.get(i);
                    Book book = match.getBook();
                    
                    System.out.println("\nВариант #" + (i+1) + ":");
                    System.out.println("- ID книги: " + book.getId());
                    System.out.println("- Название: " + book.getTitle());
                    System.out.println("- ISBN: " + book.getIsbn());
                    System.out.println("- Автор: " + book.getAuthor());
                    System.out.println("- Уверенность: " + match.getConfidence());
                    System.out.println("- Совпавшие поля: " + String.join(", ", match.getMatchedFields()));
                }
                
                // Автоматический выбор при высокой уверенности
                MatchResult bestMatch = potentialMatches.get(0);
                if (bestMatch.getConfidence() > 0.9) {
                    System.out.println("\nВыбрано автоматически: Вариант #1 (высокая уверенность)");
                    Book book = bestMatch.getBook();
                    matcher.updateBookPrice(book, priceItem);
                } else {
                    System.out.println("\nТребуется ручной выбор (недостаточная уверенность)");
                }
            }
            
        } catch (Exception e) {
            System.err.println("Ошибка при поиске соответствий: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Демонстрирует процесс обновления цен
     */
    private static void testPriceUpdate() {
        System.out.println("\n=== Тест обновления цен ===");
        
        // Создание экземпляра сопоставителя
        ProductMatcher matcher = new StandardProductMatcher();
        
        try {
            // Создание тестовой книги
            Book book = createTestBook();
            double oldPrice = book.getPrice();
            
            System.out.println("Текущая цена книги:");
            System.out.println("- Название: " + book.getTitle());
            System.out.println("- Цена: " + oldPrice + " " + book.getCurrency());
            
            // Создание элемента прайс-листа с новой ценой
            PriceItem priceItem = createTestPriceItem();
            priceItem.setPrice(oldPrice * 1.15); // Увеличение цены на 15%
            
            System.out.println("\nНовая цена из прайс-листа:");
            System.out.println("- Цена: " + priceItem.getPrice() + " " + priceItem.getCurrency());
            
            // Обновление цены
            boolean updated = matcher.updateBookPrice(book, priceItem);
            
            System.out.println("\nРезультат обновления:");
            System.out.println("- Цена " + (updated ? "обновлена" : "не изменилась"));
            System.out.println("- Новая цена: " + book.getPrice() + " " + book.getCurrency());
            System.out.println("- Изменение: " + String.format("%.2f%%", (book.getPrice() - oldPrice) / oldPrice * 100));
            
        } catch (Exception e) {
            System.err.println("Ошибка при обновлении цены: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Вспомогательный метод для создания тестового элемента прайс-листа
     */
    private static PriceItem createTestPriceItem() {
        PriceItem priceItem = new PriceItem();
        priceItem.setId(123L);
        priceItem.setIsbn("9785699123456");
        priceItem.setTitle("Война и мир");
        priceItem.setAuthor("Лев Толстой");
        priceItem.setPublisher("Эксмо");
        priceItem.setPrice(850.0);
        priceItem.setCurrency("RUB");
        priceItem.setStock(15);
        return priceItem;
    }
    
    /**
     * Вспомогательный метод для создания тестовой книги
     */
    private static Book createTestBook() {
        Book book = new Book();
        book.setId(42L);
        book.setTitle("Война и мир");
        book.setIsbn("9785699123456");
        book.setAuthor("Лев Толстой");
        book.setPublisher("Эксмо");
        book.setPublicationYear(2020);
        book.setPrice(750.0);
        book.setCurrency("RUB");
        return book;
    }
}

/**
 * Заглушки для классов, необходимых для компиляции примера
 * В реальном приложении эти классы должны быть полноценно реализованы
 */

// Заглушка для класса StandardProductMatcher
class StandardProductMatcher implements ProductMatcher {
    @Override
    public Optional<Book> findMatchingBook(PriceItem priceItem) {
        // Симуляция сопоставления по ISBN
        if (priceItem.getIsbn() != null && priceItem.getIsbn().equals("9785699123456")) {
            Book book = new Book();
            book.setId(42L);
            book.setTitle("Война и мир");
            book.setIsbn("9785699123456");
            book.setAuthor("Лев Толстой");
            book.setPublisher("Эксмо");
            book.setPublicationYear(2020);
            book.setPrice(750.0);
            book.setCurrency("RUB");
            return Optional.of(book);
        }
        
        // Симуляция сопоставления по названию и автору
        if (priceItem.getTitle() != null && priceItem.getTitle().equals("Мастер и Маргарита")) {
            Book book = new Book();
            book.setId(43L);
            book.setTitle("Мастер и Маргарита");
            book.setIsbn("9785170987654");
            book.setAuthor("Михаил Булгаков");
            book.setPublisher("АСТ");
            book.setPublicationYear(2019);
            book.setPrice(580.0);
            book.setCurrency("RUB");
            return Optional.of(book);
        }
        
        // Соответствие не найдено
        return Optional.empty();
    }
    
    @Override
    public List<MatchResult> findPotentialMatches(PriceItem priceItem, double threshold) {
        // Симуляция нескольких потенциальных соответствий
        List<MatchResult> results = new java.util.ArrayList<>();
        
        if ("Мастер и Маргарита".equals(priceItem.getTitle())) {
            // Вариант 1 - высокое соответствие
            Book book1 = new Book();
            book1.setId(43L);
            book1.setTitle("Мастер и Маргарита");
            book1.setIsbn("9785170987654");
            book1.setAuthor("Михаил Булгаков");
            book1.setPublisher("АСТ");
            book1.setPrice(580.0);
            
            MatchResult match1 = new MatchResult();
            match1.setBook(book1);
            match1.setConfidence(0.95);
            match1.setMatchedFields(java.util.Arrays.asList("title", "author"));
            results.add(match1);
            
            // Вариант 2 - среднее соответствие (переиздание)
            Book book2 = new Book();
            book2.setId(44L);
            book2.setTitle("Мастер и Маргарита");
            book2.setIsbn("9785179358736");
            book2.setAuthor("Михаил Булгаков");
            book2.setPublisher("АСТ");
            book2.setPrice(620.0);
            
            MatchResult match2 = new MatchResult();
            match2.setBook(book2);
            match2.setConfidence(0.85);
            match2.setMatchedFields(java.util.Arrays.asList("title", "author"));
            results.add(match2);
            
            // Вариант 3 - низкое соответствие (другое издательство)
            Book book3 = new Book();
            book3.setId(45L);
            book3.setTitle("Мастер и Маргарита");
            book3.setIsbn("9785699876543");
            book3.setAuthor("Михаил Булгаков");
            book3.setPublisher("Эксмо");
            book3.setPrice(550.0);
            
            MatchResult match3 = new MatchResult();
            match3.setBook(book3);
            match3.setConfidence(0.75);
            match3.setMatchedFields(java.util.Arrays.asList("title", "author"));
            results.add(match3);
        }
        
        return results;
    }
    
    @Override
    public boolean updateBookPrice(Book book, PriceItem priceItem) {
        // Симуляция обновления цены
        double oldPrice = book.getPrice();
        double newPrice = priceItem.getPrice();
        
        // Обновляем цену, только если она изменилась
        if (Math.abs(oldPrice - newPrice) > 0.01) {
            book.setPrice(newPrice);
            return true;
        }
        
        return false;
    }
    
    /**
     * Класс для результатов сопоставления
     */
    public static class MatchResult {
        private Book book;
        private double confidence;
        private List<String> matchedFields;
        
        public Book getBook() {
            return book;
        }
        
        public void setBook(Book book) {
            this.book = book;
        }
        
        public double getConfidence() {
            return confidence;
        }
        
        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }
        
        public List<String> getMatchedFields() {
            return matchedFields;
        }
        
        public void setMatchedFields(List<String> matchedFields) {
            this.matchedFields = matchedFields;
        }
    }
} 