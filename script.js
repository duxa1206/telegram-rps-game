// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Счёт
let playerScore = 0;
let botScore = 0;

// Элементы DOM
const choiceBtns = document.querySelectorAll('.choice-btn');
const resultArea = document.getElementById('result-area');
const choiceArea = document.querySelector('.choice-area');
const playerChoiceDisplay = document.getElementById('player-choice-display');
const botChoiceDisplay = document.getElementById('bot-choice-display');
const resultMessage = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again-btn');
const playerScoreEl = document.getElementById('player-score');
const botScoreEl = document.getElementById('bot-score');
const thinkingArea = document.getElementById('thinking-area');
const thinkingEmoji = document.getElementById('thinking-emoji');

// Эмодзи для выбора
const choiceEmojis = {
    'камень': '🪨',
    'ножницы': '✂️',
    'бумага': '📄'
};

// Сообщения о результате
const resultMessages = {
    'win': '🎉 Вы победили!',
    'lose': '😔 Вы проиграли',
    'draw': '🤝 Ничья!'
};

// Обработчики кнопок выбора
choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        makeMove(choice);
    });
});

// Обработчик кнопки "Играть снова"
playAgainBtn.addEventListener('click', () => {
    resultArea.style.display = 'none';
    choiceArea.style.display = 'block';
    thinkingArea.style.display = 'none';
});

// Сделать ход (вся логика в браузере!)
function makeMove(playerChoice) {
    // Вибрация при нажатии
    tg.HapticFeedback.impactOccurred('light');
    
    // Скрываем выбор, показываем анимацию
    choiceArea.style.display = 'none';
    thinkingArea.style.display = 'block';
    
    // Бот выбирает случайно
    const choices = ['камень', 'ножницы', 'бумага'];
    const botChoice = choices[Math.floor(Math.random() * 3)];
    
    // Определяем победителя
    const result = determineWinner(playerChoice, botChoice);
    
    // Запускаем анимацию "думания"
    runThinkingAnimation(playerChoice, botChoice, result);
}

// Анимация "бот думает"
function runThinkingAnimation(playerChoice, botChoice, result) {
    const emojis = ['🪨', '✂️', '📄'];
    let index = 0;
    let cycles = 0;
    const maxCycles = 6; // 6 переключений = ~0.6 сек
    
    const interval = setInterval(() => {
        thinkingEmoji.textContent = emojis[index];
        index = (index + 1) % 3;
        cycles++;
        
        if (cycles >= maxCycles) {
            clearInterval(interval);
            // Показываем результат
            showResult(playerChoice, botChoice, result);
        }
    }, 100); // 100мс на каждый эмодзи
}

// Определяем победителя
function determineWinner(player, bot) {
    if (player === bot) {
        return 'draw';
    }
    
    const winningCombos = {
        'камень': 'ножницы',
        'ножницы': 'бумага',
        'бумага': 'камень'
    };
    
    if (winningCombos[player] === bot) {
        return 'win';
    } else {
        return 'lose';
    }
}

// Показать результат
function showResult(playerChoice, botChoice, result) {
    // Скрываем анимацию
    thinkingArea.style.display = 'none';
    
    // Обновляем счёт
    if (result === 'win') {
        playerScore++;
    } else if (result === 'lose') {
        botScore++;
    }
    
    playerScoreEl.textContent = playerScore;
    botScoreEl.textContent = botScore;
    
    // Показываем выбор
    playerChoiceDisplay.textContent = choiceEmojis[playerChoice];
    botChoiceDisplay.textContent = choiceEmojis[botChoice];
    
    // Показываем результат
    resultMessage.textContent = resultMessages[result];
    resultMessage.className = 'result-message ' + result;
    
    // Переключаем видимость
    resultArea.style.display = 'block';
    
    // Вибрация при результате
    if (result === 'win') {
        tg.HapticFeedback.notificationOccurred('success');
    } else if (result === 'lose') {
        tg.HapticFeedback.notificationOccurred('error');
    } else {
        tg.HapticFeedback.notificationOccurred('warning');
    }
}
