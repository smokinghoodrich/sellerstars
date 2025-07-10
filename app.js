// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Выбранная сумма по умолчанию
let selectedAmount = 100;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики для кнопок выбора суммы
    const amountButtons = document.querySelectorAll('.amount-btn');
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем класс selected у всех кнопок
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            // Добавляем класс selected к текущей кнопке
            button.classList.add('selected');
            // Обновляем выбранную сумму
            selectedAmount = parseInt(button.dataset.amount);
        });
    });
    
    // Выбираем первую кнопку по умолчанию
    amountButtons[0].classList.add('selected');
    
    // Обработчик для кнопки доната
    document.getElementById('donateButton').addEventListener('click', sendStars);
});

// Функция отправки Stars
function sendStars() {
    // Проверяем поддержку функции
    if (!tg.sendStars) {
        alert('Ваша версия Telegram не поддерживает Stars. Обновите приложение.');
        return;
    }
    
    // Проверяем минимальную сумму (100 Stars)
    if (selectedAmount < 100) {
        alert('Минимальная сумма доната - 100 Stars');
        return;
    }
    
    // Показываем загрузку
    tg.MainButton.showProgress();
    
    // Отправляем Stars
    tg.sendStars({
        star_amount: selectedAmount,
        callback: (result) => {
            // Скрываем индикатор загрузки
            tg.MainButton.hideProgress();
            
            if (result.status === 'succeeded') {
                alert(`Спасибо за ваш донат ${selectedAmount} Stars!`);
                // Здесь можно добавить логику после успешного доната
            } else {
                alert('Оплата не удалась: ' + result.status);
            }
        }
    });
}