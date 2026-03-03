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
    'камень': '⚪',
    'ножницы': '✂',
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
    battleArea.style.display = 'none';
});

// Элементы для анимации битвы
const battleArea = document.getElementById('battle-area');
const playerFighterEmoji = document.getElementById('player-fighter-emoji');
const botFighterEmoji = document.getElementById('bot-fighter-emoji');
const battleEffect = document.getElementById('battle-effect');

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
    const emojis = ['⚪', '✂', '📄'];
    let index = 0;
    let cycles = 0;
    const maxCycles = 6; // 6 переключений = ~0.6 сек

    const interval = setInterval(() => {
        thinkingEmoji.textContent = emojis[index];
        index = (index + 1) % 3;
        cycles++;

        if (cycles >= maxCycles) {
            clearInterval(interval);
            // Запускаем анимацию битвы
            runBattleAnimation(playerChoice, botChoice, result);
        }
    }, 100); // 100мс на каждый эмодзи
}

// Анимация битвы
function runBattleAnimation(playerChoice, botChoice, result) {
    // Скрываем "думание", показываем битву
    thinkingArea.style.display = 'none';
    battleArea.style.display = 'block';

    // Устанавлием эмодзи бойцов
    playerFighterEmoji.textContent = choiceEmojis[playerChoice];
    botFighterEmoji.textContent = choiceEmojis[botChoice];

    // Анимация сближения
    setTimeout(() => {
        document.querySelector('.player-fighter').classList.add('approach');
        document.querySelector('.bot-fighter').classList.add('approach');

        // Вибрация при столкновении
        setTimeout(() => {
            tg.HapticFeedback.impactOccurred('heavy');

            // Показываем эффект столкновения
            showBattleEffect(result);

            // Через 0.6 сек показываем результат
            setTimeout(() => {
                showResult(playerChoice, botChoice, result);
            }, 600);
        }, 500);
    }, 100);
}

// Показать эффект битвы
function showBattleEffect(result) {
    battleEffect.className = 'battle-effect flash';

    if (result === 'win') {
        // Конфетти для победы
        battleEffect.textContent = '💥';
        createConfetti();
        tg.HapticFeedback.notificationOccurred('success');
    } else if (result === 'lose') {
        // Дым для поражения
        battleEffect.textContent = '💨';
        createSmoke();
        tg.HapticFeedback.notificationOccurred('error');
    } else {
        // Тряска для ничьей
        battleEffect.textContent = '🔄';
        document.querySelector('.battle-area').classList.add('shake');
        tg.HapticFeedback.notificationOccurred('warning');
    }

    // Очищаем классы после анимации
    setTimeout(() => {
        battleEffect.className = 'battle-effect';
        document.querySelector('.battle-area').classList.remove('shake');
    }, 800);
}

// Создать конфетти
function createConfetti() {
    const colors = ['#ffd700', '#ff4444', '#44ff44', '#4444ff', '#ff44ff'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = (50 + (Math.random() - 0.5) * 200) + 'px';
        confetti.style.top = (50 + (Math.random() - 0.5) * 100) + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = (Math.random() * 0.3) + 's';
        battleArea.appendChild(confetti);

        // Удаляем конфетти после анимации
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Создать дым
function createSmoke() {
    for (let i = 0; i < 5; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.animationDelay = (i * 0.1) + 's';
        battleArea.appendChild(smoke);

        // Удаляем дым после анимации
        setTimeout(() => smoke.remove(), 1000);
    }
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
    // Скрываем битву
    battleArea.style.display = 'none';

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
}
