// Современный JavaScript для адаптивной таблицы
// Только необходимые интерактивные функции без переключения таблиц

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Современная адаптивная таблица загружена');
    
    // Инициализация интерактивных функций
    initializeTableInteractions();
    initializeAccessibility();
    initializePerformanceOptimizations();
});

/**
 * Инициализация интерактивных функций таблицы
 */
function initializeTableInteractions() {
    const table = document.querySelector('.responsive-table');
    if (!table) return;
    
    // Добавляем плавную анимацию при загрузке
    table.style.opacity = '0';
    table.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        table.style.transition = 'all 0.6s ease';
        table.style.opacity = '1';
        table.style.transform = 'translateY(0)';
    }, 100);
    
    // Улучшенное взаимодействие с строками
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        // Добавляем задержку анимации для каскадного эффекта
        row.style.animationDelay = `${index * 0.1}s`;
        
        // Улучшенные события наведения
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Клик по строке для выделения
        row.addEventListener('click', function() {
            // Убираем выделение с других строк
            rows.forEach(r => r.classList.remove('selected'));
            // Добавляем выделение текущей строке
            this.classList.add('selected');
            
            // Получаем данные студента
            const studentName = this.querySelector('.student-name')?.textContent;
            const studentEmail = this.querySelector('.student-email')?.textContent;
            
            console.log(`📊 Выбран студент: ${studentName} (${studentEmail})`);
        });
    });
}

/**
 * Инициализация функций доступности
 */
function initializeAccessibility() {
    const table = document.querySelector('.responsive-table');
    if (!table) return;
    
    // Добавляем ARIA-атрибуты для лучшей доступности
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Таблица успеваемости студентов');
    
    // Добавляем навигацию с клавиатуры
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'row');
        row.setAttribute('aria-rowindex', index + 2); // +2 потому что заголовок = 1
        
        row.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    const nextRow = this.nextElementSibling;
                    if (nextRow) nextRow.focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevRow = this.previousElementSibling;
                    if (prevRow) prevRow.focus();
                    break;
            }
        });
    });
}

/**
 * Оптимизации производительности
 */
function initializePerformanceOptimizations() {
    // Ленивая загрузка для больших таблиц (если понадобится в будущем)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Наблюдаем за строками таблицы
    const rows = document.querySelectorAll('.responsive-table tbody tr');
    rows.forEach(row => observer.observe(row));
    
    // Оптимизация скролла для мобильных устройств
    let ticking = false;
    
    function updateScrollIndicator() {
        const tableWrapper = document.querySelector('.table-wrapper');
        if (!tableWrapper) return;
        
        const scrollLeft = tableWrapper.scrollLeft;
        const maxScroll = tableWrapper.scrollWidth - tableWrapper.clientWidth;
        const scrollPercentage = (scrollLeft / maxScroll) * 100;
        
        // Можно добавить индикатор прокрутки если нужно
        console.log(`📱 Прокрутка: ${scrollPercentage.toFixed(1)}%`);
        
        ticking = false;
    }
    
    const tableWrapper = document.querySelector('.table-wrapper');
    if (tableWrapper) {
        tableWrapper.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateScrollIndicator);
                ticking = true;
            }
        });
    }
}

/**
 * Утилитарные функции для работы с данными
 */
const TableUtils = {
    /**
     * Получить данные всех студентов
     */
    getAllStudents() {
        const rows = document.querySelectorAll('.responsive-table tbody tr');
        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                name: row.querySelector('.student-name')?.textContent || '',
                email: row.querySelector('.student-email')?.textContent || '',
                scores: Array.from(cells).slice(1).map(cell => cell.textContent.trim())
            };
        });
    },
    
    /**
     * Поиск студента по имени или email
     */
    findStudent(query) {
        const students = this.getAllStudents();
        return students.filter(student => 
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.email.toLowerCase().includes(query.toLowerCase())
        );
    },
    
    /**
     * Экспорт данных в JSON
     */
    exportToJSON() {
        const data = this.getAllStudents();
        const jsonString = JSON.stringify(data, null, 2);
        console.log('📋 Данные таблицы:', jsonString);
        return jsonString;
    }
};

// Делаем утилиты доступными глобально для отладки
window.TableUtils = TableUtils;

// Добавляем CSS для выделенной строки
const style = document.createElement('style');
style.textContent = `
    .responsive-table tbody tr.selected {
        background-color: #e3f2fd !important;
        border-left: 4px solid #2196f3;
    }
    
    .responsive-table tbody tr.selected .student-column {
        background-color: #e3f2fd !important;
    }
    
    @media (max-width: 768px) {
        .responsive-table tr.selected {
            border-left: 4px solid #2196f3;
            background: linear-gradient(90deg, #e3f2fd, #bbdefb) !important;
        }
        
        .responsive-table tr.selected .student-column {
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%) !important;
        }
    }
    
    .responsive-table tbody tr {
        transition: all 0.3s ease;
    }
    
    .visible {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('✨ Современная адаптивная таблица готова к использованию!');