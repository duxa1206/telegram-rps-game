// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Тема по умолчанию
let currentTheme = 'classic';

// Звуковой движок
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Генерация звуков
function playSound(type) {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch (type) {
        case 'hover':
            // Короткий высокий звук при наведении
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            oscillator.start(now);
            oscillator.stop(now + 0.05);
            break;

        case 'select':
            // Звук выбора (приятный клик)
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;

        case 'start':
            // Приветственный звук (арпеджио)
            playArpeggio();
            break;

        case 'win':
            // Победный звук (мажорное трезвучие)
            playWinSound();
            break;

        case 'lose':
            // Проигрышный звук (нисходящий)
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'draw':
            // Ничья (нейтральный звук)
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(500, now);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;

        case 'battle':
            // Звук удара в битве
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;

        case 'neon':
            // Неон звук (электронный buzz)
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(880, now);
            oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;

        case 'space':
            // Космос звук (space hum)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
    }
}

// Арпеджио для старта
function playArpeggio() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C major
    notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        const now = audioContext.currentTime + (i * 0.1);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    });
}

// Победный звук
function playWinSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C major chord
    notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        const now = audioContext.currentTime + (i * 0.08);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    });
}

// Счёт
let playerScore = 0;
let botScore = 0;
let soundEnabled = true;
let gameMode = 'bot'; // 'bot' или 'friend'

// Для игры с другом
let createdGames = []; // Ходы создателя
let currentGameIndex = 0;
let totalGames = 1;
let isCreator = false;

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
const soundToggle = document.getElementById('sound-toggle');
const createGameBtn = document.getElementById('create-game-btn');
const gameModeSelect = document.getElementById('game-mode-select');
const createGameArea = document.getElementById('create-game-area');
const waitingArea = document.getElementById('waiting-area');
const currentGameNum = document.getElementById('current-game-num');
const totalGamesNum = document.getElementById('total-games-num');
const modeBtns = document.querySelectorAll('.mode-btn');
const gameControls = document.querySelector('.game-controls');

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
    btn.addEventListener('mouseenter', () => {
        playSound('hover');
    });
    
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        playSound('select');
        makeMove(choice);
    });
});

// Обработчик кнопки "Играть снова"
playAgainBtn.addEventListener('mouseenter', () => {
    playSound('hover');
});

playAgainBtn.addEventListener('click', () => {
    resultArea.style.display = 'none';
    choiceArea.style.display = 'block';
    thinkingArea.style.display = 'none';
    battleArea.style.display = 'none';
});

// Переключатель звука
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        soundToggle.textContent = '🔊 Звук: ВКЛ';
        soundToggle.classList.add('active');
        playSound('select');
    } else {
        soundToggle.textContent = '🔇 Звук: ВЫКЛ';
        soundToggle.classList.remove('active');
    }
    
    localStorage.setItem('rps_sound', soundEnabled);
});

// Загружаем настройку звука
const savedSound = localStorage.getItem('rps_sound');
if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
    if (!soundEnabled) {
        soundToggle.textContent = '🔇 Звук: ВЫКЛ';
        soundToggle.classList.remove('active');
    }
}

// Создать игру
createGameBtn.addEventListener('click', () => {
    gameModeSelect.style.display = 'block';
    createGameBtn.style.display = 'none';
    
    if (soundEnabled) {
        playSound('select');
    }
});

// Выбор количества игр
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        totalGames = parseInt(btn.dataset.games);
        createdGames = [];
        currentGameIndex = 0;
        isCreator = true;
        
        gameModeSelect.style.display = 'none';
        createGameArea.style.display = 'block';
        
        currentGameNum.textContent = currentGameIndex + 1;
        totalGamesNum.textContent = totalGames;
        
        if (soundEnabled) {
            playSound('select');
        }
    });
});

// Обработчики для создания игры
const createChoiceBtns = createGameArea.querySelectorAll('.choice-btn');
createChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        createdGames[currentGameIndex] = choice;
        currentGameIndex++;
        
        if (soundEnabled) {
            playSound('select');
        }
        
        if (currentGameIndex < totalGames) {
            // Следующий ход
            currentGameNum.textContent = currentGameIndex + 1;
        } else {
            // Все ходы сделаны
            createGameArea.style.display = 'none';
            waitingArea.style.display = 'block';
            
            // Сохраняем игру в localStorage
            saveGame(createdGames);
        }
    });
    
    btn.addEventListener('mouseenter', () => {
        if (soundEnabled) {
            playSound('hover');
        }
    });
});

// Проверка есть ли активная игра
function loadGame() {
    const saved = localStorage.getItem('rps_game');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

function saveGame(games) {
    localStorage.setItem('rps_game', JSON.stringify({
        createdGames: games,
        createdAt: Date.now()
    }));
}

function clearGame() {
    localStorage.removeItem('rps_game');
}

// Проверяем при загрузке
const existingGame = loadGame();
if (existingGame) {
    // Игрок отвечает на созданную игру
    isCreator = false;
    createdGames = existingGame.createdGames;
    totalGames = createdGames.length;
    currentGameIndex = 0;
    
    createGameBtn.style.display = 'none';
    
    // Добавляем кнопку сброса
    const resetBtn = document.createElement('button');
    resetBtn.className = 'control-btn';
    resetBtn.textContent = '🔄 Новая игра';
    resetBtn.style.marginTop = '10px';
    resetBtn.addEventListener('click', () => {
        clearGame();
        location.reload();
    });
    gameControls.appendChild(resetBtn);
}

// Переключатель тем
const themeSwitcher = document.getElementById('theme-switcher');
const themeBtns = document.querySelectorAll('.theme-btn');

// Авто-определение темы Telegram
function detectTelegramTheme() {
    if (tg.themeParams && tg.themeParams.bg_color) {
        const bg = tg.themeParams.bg_color;
        // Если светлый фон - классика, если тёмный - неон
        return bg.toLowerCase() === '#ffffff' || bg.toLowerCase() === '#fff' ? 'classic' : 'neon';
    }
    return 'classic';
}

// Установка темы
function setTheme(theme) {
    currentTheme = theme;
    
    // Плавный переход
    document.body.classList.add('theme-transition');
    
    // Удаляем все темы
    document.body.classList.remove('neon', 'space');
    
    // Устанавлием новую
    if (theme !== 'classic') {
        document.body.classList.add(theme);
    }
    
    // Обновляем кнопки
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Звук темы
    if (theme === 'neon') {
        playSound('neon');
    } else if (theme === 'space') {
        playSound('space');
    }
    
    // Сохраняем тему
    localStorage.setItem('rps_theme', theme);
    
    // Убираем transition через 0.5 сек
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);
}

// Обработчики кнопок тем
themeBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        playSound('hover');
    });
    
    btn.addEventListener('click', () => {
        setTheme(btn.dataset.theme);
    });
});

// Загружаем тему при старте
const savedTheme = localStorage.getItem('rps_theme') || detectTelegramTheme();
setTheme(savedTheme);

// Полноэкранный режим
const fullscreenBtn = document.getElementById('fullscreen-btn');
const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
const fullscreenButtons = document.getElementById('fullscreen-buttons');
const miniScore = document.getElementById('mini-score');
const miniPlayer = document.getElementById('mini-player');
const miniBot = document.getElementById('mini-bot');
let isFullscreen = false;

// Вход в fullscreen
fullscreenBtn.addEventListener('click', () => {
    enterFullscreen();
});

// Выход из fullscreen
exitFullscreenBtn.addEventListener('click', () => {
    exitFullscreen();
});

// Обработчики кнопок в fullscreen
const fullscreenChoiceBtns = document.querySelectorAll('.choice-btn-fs');
fullscreenChoiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Ripple эффект
        createRipple(e, btn);
        
        const choice = btn.dataset.choice;
        if (soundEnabled) {
            playSound('select');
        }
        tg.HapticFeedback.impactOccurred('light');
        makeMove(choice);
    });
    
    btn.addEventListener('mouseenter', () => {
        if (soundEnabled) {
            playSound('hover');
        }
    });
});

// Ripple эффект
function createRipple(event, button) {
    const ripple = button.querySelector('.ripple');
    if (!ripple) return;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.animation = 'none';
    
    // Перезапуск анимации
    setTimeout(() => {
        ripple.style.animation = 'rippleAnim 0.6s ease-out';
    }, 10);
    
    // Удаляем ripple после анимации
    setTimeout(() => {
        ripple.style.animation = 'none';
    }, 600);
}

// Вход в fullscreen
function enterFullscreen() {
    isFullscreen = true;
    document.body.classList.add('fullscreen');
    
    // Telegram WebApp expand
    tg.expand();
    
    // Скрываем/показываем элементы
    miniScore.style.display = 'block';
    exitFullscreenBtn.style.display = 'block';
    
    // Обновляем mini-score
    updateMiniScore();
    
    if (soundEnabled) {
        playSound('select');
    }
}

// Выход из fullscreen
function exitFullscreen() {
    isFullscreen = false;
    document.body.classList.remove('fullscreen');
    
    // Показываем кнопки
    exitFullscreenBtn.style.display = 'none';
    miniScore.style.display = 'none';
    
    if (soundEnabled) {
        playSound('select');
    }
}

// Обновление mini-score
function updateMiniScore() {
    if (miniPlayer && miniBot) {
        miniPlayer.textContent = playerScore;
        miniBot.textContent = botScore;
    }
}

// Swipe up для выхода
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // Swipe up > 100px
    if (diff > 100 && isFullscreen) {
        exitFullscreen();
    }
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

    // Если игра с другом и есть созданные ходы
    if (!isCreator && createdGames.length > 0 && currentGameIndex < createdGames.length) {
        // Берём ход создателя
        const botChoice = createdGames[currentGameIndex];
        
        // Определяем победителя
        const result = determineWinner(playerChoice, botChoice);
        
        // Запускаем анимацию
        runThinkingAnimation(playerChoice, botChoice, result);
    } else {
        // Обычная игра с ботом
        const choices = ['камень', 'ножницы', 'бумага'];
        const botChoice = choices[Math.floor(Math.random() * 3)];
        
        // Определяем победителя
        const result = determineWinner(playerChoice, botChoice);
        
        // Запускаем анимацию
        runThinkingAnimation(playerChoice, botChoice, result);
    }
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
            playSound('battle');

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
        tg.HapticFeedback.impactOccurred('heavy');
        if (soundEnabled) playSound('win');
    } else if (result === 'lose') {
        // Дым для поражения
        battleEffect.textContent = '💨';
        createSmoke();
        tg.HapticFeedback.impactOccurred('soft');
        if (soundEnabled) playSound('lose');
    } else {
        // Тряска для ничьей
        battleEffect.textContent = '🔄';
        document.querySelector('.battle-area').classList.add('shake');
        tg.HapticFeedback.notificationOccurred('warning');
        if (soundEnabled) playSound('draw');
    }

    // Обновляем mini-score если в fullscreen
    if (isFullscreen) {
        updateMiniScore();
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

    // Если игра с другом
    if (!isCreator && createdGames.length > 0) {
        // Обновляем счёт
        if (result === 'win') {
            playerScore++;
        } else if (result === 'lose') {
            botScore++;
        }
        
        currentGameIndex++;
        
        // Показываем результат
        resultMessage.textContent = resultMessages[result];
        resultMessage.className = 'result-message ' + result;
        playerChoiceDisplay.textContent = choiceEmojis[playerChoice];
        botChoiceDisplay.textContent = choiceEmojis[botChoice];
        resultArea.style.display = 'block';
        
        // Если есть ещё игры
        if (currentGameIndex < totalGames) {
            // Следующий ход через 2 сек
            setTimeout(() => {
                resultArea.style.display = 'none';
                choiceArea.style.display = 'block';
            }, 2000);
        } else {
            // Конец серии
            setTimeout(() => {
                showFinalResult();
            }, 2000);
        }
    } else {
        // Обычная игра с ботом
        if (result === 'win') {
            animateScore(playerScoreEl, playerScore, playerScore + 1);
            playerScore++;
        } else if (result === 'lose') {
            animateScore(botScoreEl, botScore, botScore + 1);
            botScore++;
        }

        // Обновляем mini-score если в fullscreen
        if (isFullscreen) {
            updateMiniScore();
        }

        // Показываем выбор
        playerChoiceDisplay.textContent = choiceEmojis[playerChoice];
        botChoiceDisplay.textContent = choiceEmojis[botChoice];

        // Показываем результат
        resultMessage.textContent = resultMessages[result];
        resultMessage.className = 'result-message ' + result;

        // Переключаем видимость
        resultArea.style.display = 'block';
    }
}

// Показать финальный результат серии
function showFinalResult() {
    resultArea.style.display = 'none';
    
    let finalMessage = '';
    if (playerScore > botScore) {
        finalMessage = `🏆 Ты победил в серии!\n${playerScore}:${botScore}`;
    } else if (botScore > playerScore) {
        finalMessage = `😔 Ты проиграл в серии!\n${playerScore}:${botScore}`;
    } else {
        finalMessage = `🤝 Ничья в серии!\n${playerScore}:${botScore}`;
    }
    
    resultMessage.textContent = finalMessage;
    resultMessage.className = 'result-message';
    resultArea.style.display = 'block';
    
    // Очищаем игру
    setTimeout(() => {
        clearGame();
        location.reload();
    }, 4000);
}

// Анимация счётчика
function animateScore(element, from, to) {
    const duration = 500;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.floor(from + (to - from) * easeOut);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = to;
        }
    }
    
    requestAnimationFrame(animate);
}

// Звук при запуске (через 1 секунду после загрузки)
setTimeout(() => {
    playSound('start');
}, 1000);
