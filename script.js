// Данные для открытки
const messages = [
    {
        title: "Моё солнышко",
        text: "Ты делаешь каждый мой день особенным. С тобой даже обычный поход в магазин становится приключением. Спасибо, что ты есть в моей жизни!",
        photo: "ph1.jpg"
    },
    {
        title: "Моя любимая",
        text: "Когда ты рядом, мир становится ярче, проблемы — мельче, а счастье — больше. Ты мой источник вдохновения и радости.",
        photo: "ph2.jpg"
    },
    {
        title: "С Днём Валентина!",
        text: "Сегодня просто повод сказать ещё раз: я тебя люблю. Люблю твою улыбку, твой смех, твои глаза. Люблю просто потому, что ты — это ты.",
        photo: "ph3.jpg"
    },
    {
        title: "Для тебя",
        text: "Знай, что ты самая красивая, самая добрая, самая удивительная девушка на свете. И я бесконечно благодарен судьбе за встречу с тобой.",
        photo: "ph4.jpg"
    }
];

// Элементы DOM
const mainHeart = document.getElementById('mainHeart');
const mainScreen = document.getElementById('mainScreen');
const messageScreen = document.getElementById('messageScreen');
const backBtn = document.getElementById('backBtn');
const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const photoFrame = document.getElementById('photoFrame');
const nextMessageBtn = document.getElementById('nextMessage');
const playMusicBtn = document.getElementById('playMusic');
const backgroundMusic = document.getElementById('backgroundMusic');
const confettiCanvas = document.getElementById('confettiCanvas');

// Переменные состояния
let currentMessageIndex = 0;
let isMusicPlaying = false;
let confettiAnimationId = null;

// Инициализация
function init() {
    console.log('Открытка инициализирована');
    
    // Загружаем первое сообщение
    loadMessage(currentMessageIndex);
    
    // Обработчики событий
    mainHeart.addEventListener('click', openMessageScreen);
    backBtn.addEventListener('click', closeMessageScreen);
    nextMessageBtn.addEventListener('click', showNextMessage);
    playMusicBtn.addEventListener('click', toggleMusic);
    
    // Добавляем плавающие сердечки
    createFloatingHearts();
    
    // Автоматически запускаем музыку при взаимодействии (когда пользователь нажмет на сердце)
    setupAudioContext();
    
    console.log('Элементы загружены');
}

// Настройка аудио контекста для автовоспроизведения
function setupAudioContext() {
    // Создаем аудио контекст, который будет запущен по первому клику
    document.body.addEventListener('click', function initAudio() {
        // Запускаем тишину, чтобы разблокировать автовоспроизведение
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.001);
        
        // Удаляем обработчик после первого клика
        document.body.removeEventListener('click', initAudio);
    }, { once: true });
}

// Загрузка сообщения
function loadMessage(index) {
    console.log('Загружаем сообщение', index);
    
    if (index < 0 || index >= messages.length) {
        index = 0;
        currentMessageIndex = 0;
    }
    
    const message = messages[index];
    messageTitle.textContent = message.title;
    messageText.innerHTML = `<p>${message.text}</p>`;
    
    // Создаём изображение
    const img = new Image();
    img.src = message.photo;
    img.alt = "Наше фото";
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    img.onload = function() {
        photoFrame.innerHTML = '';
        photoFrame.appendChild(img);
    };
    
    img.onerror = function() {
        console.log('Фото не загрузилось:', message.photo);
        photoFrame.innerHTML = `
            <div class="photo-placeholder">
                <i class="fas fa-heart" style="font-size: 50px; color: #ff4081;"></i>
                <p style="margin-top: 10px;">Наше фото ${index + 1}</p>
            </div>
        `;
    };
}

// Открытие экрана с сообщениями и запуск музыки
function openMessageScreen() {
    console.log('Открываем экран сообщений и запускаем музыку');
    
    // Сначала запускаем музыку
    startMusic();
    
    // Показываем экран сообщений
    mainScreen.style.display = 'none';
    messageScreen.style.display = 'flex';
    messageScreen.classList.add('active');
    
    // Запускаем конфетти
    launchConfetti();
}

// Функция запуска музыки
function startMusic() {
    if (!isMusicPlaying) {
        console.log('Запускаем музыку');
        
        backgroundMusic.currentTime = 0; // Начинаем с начала
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
            console.log('Музыка начала играть');
        }).catch(error => {
            console.log('Ошибка воспроизведения музыки:', error);
            // Если автовоспроизведение заблокировано, показываем инструкцию
            playMusicBtn.innerHTML = '<i class="fas fa-play"></i> Включить музыку';
            
            // Добавляем сообщение пользователю
            const musicError = document.createElement('div');
            musicError.className = 'music-error';
            musicError.innerHTML = `
                <p>Нажми на кнопку <i class="fas fa-music"></i> чтобы включить музыку</p>
            `;
            document.querySelector('.message-content').prepend(musicError);
            
            // Удаляем сообщение через 5 секунд
            setTimeout(() => {
                if (musicError.parentNode) {
                    musicError.remove();
                }
            }, 5000);
        });
    }
}

// Закрытие экрана с сообщениями
function closeMessageScreen() {
    console.log('Закрываем экран сообщений');
    
    messageScreen.classList.remove('active');
    messageScreen.style.display = 'none';
    mainScreen.style.display = 'flex';
    
    // Останавливаем конфетти
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    
    // Очищаем canvas
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    // Не останавливаем музыку при закрытии
    // (пусть продолжает играть, если пользователь этого хочет)
}

// Следующее сообщение
function showNextMessage() {
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    console.log('Показываем следующее сообщение:', currentMessageIndex);
    loadMessage(currentMessageIndex);
    
    // Запускаем немного конфетти
    launchConfetti(50);
}

// Управление музыкой (включение/выключение)
function toggleMusic() {
    console.log('Переключаем музыку, текущий статус:', isMusicPlaying);
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        playMusicBtn.innerHTML = '<i class="fas fa-music"></i> Включить музыку';
        isMusicPlaying = false;
    } else {
        backgroundMusic.play().then(() => {
            playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
            isMusicPlaying = true;
        }).catch(error => {
            console.log('Ошибка при возобновлении музыки:', error);
        });
    }
}

// Конфетти система
function launchConfetti(particleCount = 150) {
    console.log('Запускаем конфетти');
    
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#ff4081', '#e91e63', '#ff80ab', '#f50057', '#c51162'];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * -100,
            size: Math.random() * 10 + 5,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 5 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.5 ? 'circle' : 'heart',
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        let activeParticles = 0;
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Если частица улетела за экран, пропускаем её
            if (p.y > confettiCanvas.height + 100) continue;
            
            activeParticles++;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            
            ctx.fillStyle = p.color;
            
            if (p.shape === 'heart') {
                // Простое сердечко
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-p.size/2, -p.size/2, -p.size, p.size/4, 0, p.size);
                ctx.bezierCurveTo(p.size, p.size/4, p.size/2, -p.size/2, 0, 0);
                ctx.fill();
            } else {
                // Круг
                ctx.beginPath();
                ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
            
            // Обновление позиции
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            
            // Гравитация
            p.speedY += 0.1;
        }
        
        // Если есть активные частицы, продолжаем анимацию
        if (activeParticles > 0) {
            confettiAnimationId = requestAnimationFrame(drawConfetti);
        } else {
            confettiAnimationId = null;
        }
    }
    
    drawConfetti();
}

// Создание плавающих сердечек
function createFloatingHearts() {
    console.log('Создаём плавающие сердечки');
    
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.opacity = Math.random() * 0.3 + 0.1;
        heart.style.zIndex = '-1';
        heart.style.pointerEvents = 'none';
        heart.style.color = ['#ff4081', '#e91e63', '#ff80ab'][Math.floor(Math.random() * 3)];
        
        // Анимация плавания
        const duration = Math.random() * 20 + 10;
        heart.style.animation = `float ${duration}s infinite ease-in-out`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(heart);
    }
    
    // Добавляем CSS для анимации плавания
    if (!document.querySelector('#float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% { 
                    transform: translate(0, 0) rotate(0deg); 
                }
                25% { 
                    transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(5deg); 
                }
                50% { 
                    transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(-5deg); 
                }
                75% { 
                    transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(5deg); 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    init();
    
    // Ресайз canvas при изменении размера окна
    window.addEventListener('resize', function() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });
});