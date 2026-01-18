// ==========================================
// КНИГА СУДЕБ - Основной скрипт (ИСПРАВЛЕННАЯ ВЕРСИЯ)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // ========== ОТСЛЕЖИВАНИЕ МЕТРИКИ ==========
    function trackEvent(category, action, label) {
        if (typeof ym !== 'undefined') {
            // ЗАМЕНИ ТВОЙ_НОМЕР на номер своего счётчика!
            ym(106319364, 'reachGoal', action, {
                category: category,
                label: label
            });
            console.log('Метрика:', category, action, label);
        }
    } 
    console.log('Скрипт загружен'); // Проверка
    
    // ========== ЭЛЕМЕНТЫ СТРАНИЦЫ ==========
    const elements = {
        // Экраны
        selectionScreen: document.getElementById('selection-screen'),
        bookScreen: document.getElementById('book-screen'),
        
        // Инпуты
        pageInput: document.getElementById('page'),
        lineInput: document.getElementById('line'),
        
        // Кнопки
        openButton: document.getElementById('open-book'),
        closeButton: document.getElementById('close-book'),
        shareButton: document.getElementById('share-btn'),
        saveButton: document.getElementById('save-btn'),
        themeButtons: document.querySelectorAll('.theme-btn'),
        
        // Книга
        book: document.getElementById('book'),
        
        // Отображение
        prediction: document.getElementById('prediction'),
        pageNumberLeft: document.getElementById('page-number-left'),
        pageNumberRight: document.getElementById('page-number-right'),
        lineNumberDisplay: document.getElementById('line-number-display'),
        themeIconDisplay: document.getElementById('theme-icon-display'),
        themeNameDisplay: document.getElementById('theme-name-display'),
        selectedInfo: document.getElementById('selected-info'),
        
        // Уведомление
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notification-text')
    };
    
    // Проверка наличия всех элементов
    console.log('Кнопка открытия:', elements.openButton);
    console.log('Экраны найдены:', elements.selectionScreen, elements.bookScreen);
    
    // ========== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ==========
    let state = {
        selectedTheme: 'prediction',
        page: null,
        line: null,
        currentPrediction: ''
    };
    
    // ========== ТЕМЫ ==========
    const themes = {
        prediction: { icon: '🔮', name: 'Предсказание', key: 'PREDICTIONS' },
        advice: { icon: '💡', name: 'Совет', key: 'ADVICE' },
        wisdom: { icon: '📜', name: 'Мудрость', key: 'WISDOM' },
        love: { icon: '💕', name: 'Любовь', key: 'LOVE' },
        career: { icon: '⭐', name: 'Карьера', key: 'CAREER' }
    };
    
    // ========== ФУНКЦИИ ==========
    
    // Показать уведомление
    function showNotification(message) {
        console.log('Уведомление:', message);
        elements.notificationText.textContent = message;
        elements.notification.classList.add('show');
        setTimeout(() => {
            elements.notification.classList.remove('show');
        }, 3000);
    }
    
    // Проверить валидность ввода
    function validateInputs() {
        const page = parseInt(elements.pageInput.value);
        const line = parseInt(elements.lineInput.value);
        
        const isPageValid = page >= 1 && page <= 100;
        const isLineValid = line >= 1 && line <= 25;
        
        state.page = isPageValid ? page : null;
        state.line = isLineValid ? line : null;
        
        elements.openButton.disabled = !(isPageValid && isLineValid);
        
        // Обновить информацию о выборе
        if (isPageValid && isLineValid) {
            const theme = themes[state.selectedTheme];
            elements.selectedInfo.textContent = 
                `${theme.icon} ${theme.name} • Страница ${page} • Строка ${line}`;
        } else {
            elements.selectedInfo.textContent = '';
        }
        
        console.log('Валидация:', { page, line, valid: !elements.openButton.disabled });
    }
    
    // Получить предсказание
    function getPrediction(theme, page, line) {
        console.log('Получение предсказания:', theme, page, line);
        
        // Проверка наличия данных
        if (!window.BOOK_DATA) {
            console.error('BOOK_DATA не загружен!');
            return 'Ошибка: данные предсказаний не загружены. Проверьте файл predictions.js';
        }
        
        const predictions = window.BOOK_DATA[themes[theme].key];
        
        if (!predictions || predictions.length === 0) {
            console.error('Категория не найдена:', themes[theme].key);
            return 'Ошибка: категория предсказаний не найдена';
        }
        
        const index = ((page - 1) * 25 + (line - 1)) % predictions.length;
        console.log('Индекс предсказания:', index, 'из', predictions.length);
        
        return predictions[index];
    }
    
    // Открыть книгу
    function openBook() {
        console.log('Функция openBook вызвана');
        
        if (!state.page || !state.line) {
            console.error('Нет страницы или строки');
            showNotification('Выберите страницу и строку');
            return;
        }
       trackEvent('Предсказание', 'Открытие', state.selectedTheme);
        
        console.log('Открываем книгу:', state);
        
        // Получаем предсказание
        state.currentPrediction = getPrediction(state.selectedTheme, state.page, state.line);
        console.log('Предсказание:', state.currentPrediction);
        
        // Заполняем данные на страницах
        const theme = themes[state.selectedTheme];
        elements.themeIconDisplay.textContent = theme.icon;
        elements.themeNameDisplay.textContent = theme.name;
        elements.pageNumberLeft.textContent = state.page;
        elements.pageNumberRight.textContent = state.page;
        elements.lineNumberDisplay.textContent = state.line;
        elements.prediction.textContent = state.currentPrediction;
        
        // Переключаем экраны
        console.log('Переключение экранов...');
        elements.selectionScreen.classList.remove('active');
        elements.bookScreen.classList.add('active');
        
        // Анимация открытия книги
        setTimeout(() => {
            elements.book.classList.add('open');
            console.log('Книга открыта');
        }, 100);
    }
    
    // Закрыть книгу
    function closeBook() {
        console.log('Закрытие книги');
        elements.book.classList.remove('open');
        
        setTimeout(() => {
            elements.bookScreen.classList.remove('active');
            elements.selectionScreen.classList.add('active');
            
            // Сброс значений
            elements.pageInput.value = '';
            elements.lineInput.value = '';
            elements.openButton.disabled = true;
            elements.selectedInfo.textContent = '';
            state.page = null;
            state.line = null;
        }, 600);
    }
    
    // Поделиться
    function sharePrediction() {
        trackEvent('Шаринг', 'Поделиться', state.selectedTheme);
        const theme = themes[state.selectedTheme];
        const text = `${theme.icon} ${theme.name} из Книги Судеб:\n\n"${state.currentPrediction}"\n\nСтраница ${state.page}, Строка ${state.line}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Книга Судеб',
                text: text
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Скопировано в буфер обмена!');
            }).catch(() => {
                showNotification('Не удалось скопировать');
            });
        }
    }
    
    // Сохранить
    function savePrediction() {
        const saved = JSON.parse(localStorage.getItem('savedPredictions') || '[]');
        const theme = themes[state.selectedTheme];
        
        saved.push({
            theme: theme.name,
            icon: theme.icon,
            text: state.currentPrediction,
            page: state.page,
            line: state.line,
            date: new Date().toLocaleDateString('ru-RU')
        });
        
        localStorage.setItem('savedPredictions', JSON.stringify(saved));
        showNotification('Предсказание сохранено!');
    }
    
    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    
    // Выбор темы
    elements.themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Выбрана тема:', btn.dataset.theme);
            elements.themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedTheme = btn.dataset.theme;
            trackEvent('Тема', 'Выбор', state.selectedTheme);
            validateInputs();
        });
    });
    
    // Ввод чисел
    elements.pageInput.addEventListener('input', () => {
        console.log('Ввод страницы:', elements.pageInput.value);
        validateInputs();
    });
    
    elements.lineInput.addEventListener('input', () => {
        console.log('Ввод строки:', elements.lineInput.value);
        validateInputs();
    });
    
    // Ограничение ввода
    elements.pageInput.addEventListener('change', () => {
        let val = parseInt(elements.pageInput.value);
        if (val < 1) elements.pageInput.value = 1;
        if (val > 100) elements.pageInput.value = 100;
        validateInputs();
    });
    
    elements.lineInput.addEventListener('change', () => {
        let val = parseInt(elements.lineInput.value);
        if (val < 1) elements.lineInput.value = 1;
        if (val > 25) elements.lineInput.value = 25;
        validateInputs();
    });
    
    // Кнопки
    console.log('Добавление обработчика на кнопку...');
    elements.openButton.addEventListener('click', () => {
        console.log('Клик по кнопке "Открыть книгу"!');
        openBook();
    });
    
    elements.closeButton.addEventListener('click', () => {
        console.log('Клик по кнопке "Закрыть"');
        closeBook();
    });
    
    elements.shareButton.addEventListener('click', sharePrediction);
    elements.saveButton.addEventListener('click', savePrediction);
    
    // Клавиша Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !elements.openButton.disabled && elements.selectionScreen.classList.contains('active')) {
            console.log('Нажат Enter');
            openBook();
        }
    });
    
    console.log('Скрипт полностью инициализирован');
});

