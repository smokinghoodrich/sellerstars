// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Элементы DOM
const balanceElement = document.querySelector('.balance');
const sendButton = document.getElementById('send-btn');
const recipientInput = document.getElementById('recipient');
const amountInput = document.getElementById('amount');
const messageInput = document.getElementById('message');
const autoSendSelect = document.getElementById('auto-send');
const historyList = document.getElementById('history-list');

// Пример данных (в реальном приложении будут запросы к бэкенду)
let userBalance = 100;
let transactions = [];

// Инициализация приложения
function initApp() {
    updateBalance();
    renderTransactionHistory();
    
    // Настройка обработчиков событий
    sendButton.addEventListener('click', sendTransaction);
    
    // Если есть данные пользователя от Telegram, используем их
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        console.log('Пользователь Telegram:', user);
        // Можно предзаполнить некоторые поля данными пользователя
    }
}

// Обновление отображения баланса
function updateBalance() {
    balanceElement.textContent = `${userBalance} ⭐`;
}

// Отправка транзакции
function sendTransaction() {
    const recipient = recipientInput.value.trim();
    const amount = parseInt(amountInput.value);
    const message = messageInput.value.trim();
    const autoSend = autoSendSelect.value;
    
    // Проверка ввода
    if (!recipient) {
        showAlert('Укажите получателя');
        return;
    }
    
    if (isNaN(amount) || amount < 1) {
        showAlert('Введите корректное количество');
        return;
    }
    
    if (amount > userBalance) {
        showAlert('Недостаточно средств');
        return;
    }
    
    // Создание транзакции
    const transaction = {
        id: Date.now(),
        recipient,
        amount,
        message,
        timestamp: new Date().toISOString(),
        autoSend: autoSend !== '0' ? autoSend : null
    };
    
    // Обработка транзакции (в реальном приложении будет запрос к API)
    userBalance -= amount;
    transactions.unshift(transaction);
    
    // Обновление интерфейса
    updateBalance();
    renderTransactionHistory();
    clearForm();
    
    // Показ сообщения об успехе
    showAlert(`Успешно отправлено ${amount} звезд для ${recipient}`, 'success');
    
    // В реальном приложении здесь будет отправка данных на бэкенд
    console.log('Транзакция:', transaction);
    
    // Можно отправить данные обратно в бота
    tg.sendData(JSON.stringify({
        action: 'send_stars',
        transaction: transaction
    }));
}

// Очистка формы
function clearForm() {
    recipientInput.value = '';
    amountInput.value = '';
    messageInput.value = '';
    autoSendSelect.value = '0';
}

// Отображение истории транзакций
function renderTransactionHistory() {
    if (transactions.length === 0) {
        historyList.innerHTML = '<div class="empty-state">Пока нет транзакций</div>';
        return;
    }
    
    historyList.innerHTML = '';
    
    transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        
        const date = new Date(transaction.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = date.toLocaleDateString('ru-RU');
        
        transactionElement.innerHTML = `
            <div>
                <div class="transaction-recipient">Кому: ${transaction.recipient}</div>
                <div class="transaction-time">${dateString} в ${timeString}</div>
                ${transaction.message ? `<div class="transaction-message">"${transaction.message}"</div>` : ''}
                ${transaction.autoSend ? `<div class="transaction-recurring">⏱ Автоотправка каждые ${getAutoSendLabel(transaction.autoSend)}</div>` : ''}
            </div>
            <div class="transaction-amount">-${transaction.amount}⭐</div>
        `;
        
        historyList.appendChild(transactionElement);
    });
}

// Функция для получения текста автоотправки
function getAutoSendLabel(value) {
    switch(value) {
        case '1': return 'час';
        case '24': return 'день';
        case '168': return 'неделю';
        default: return '';
    }
}

// Показ сообщения
function showAlert(message, type = 'error') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);