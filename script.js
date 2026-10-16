const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicWave = document.querySelector('.music-wave');
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            musicWave.classList.add('playing');
        }).catch(error => {
            isPlaying = false;
        });
    }
});

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicWave.classList.remove('playing');
        musicToggle.innerHTML = '🔇';
    } else {
        bgMusic.play();
        musicWave.classList.add('playing');
        musicToggle.innerHTML = '🎶';
    }
    isPlaying = !isPlaying;
}

function openGift() {
    const overlay = document.getElementById('giftOverlay');
    const mainContent = document.getElementById('mainContent');

    overlay.classList.add('opened');
    mainContent.classList.remove('hidden');
    void mainContent.offsetWidth;

    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 100);

    if (!isPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicWave.classList.add('playing');
            musicToggle.innerHTML = '🎶';
        }).catch(e => {
            console.log('music failed to load wtf:', e);
        });
    }

    createConfetti();

    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
}

function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#ffeaa7', '#fab1a0', '#ffffff'];
    // what is this math gng :broken:
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '10000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function updateCountdown() {
    const startDate = new Date('2025-06-01T00:00:00');
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// this shit took me the most holy fuck i wonder if anyone is gonna read this
class ScratchCard {
    constructor() {
        this.canvas = document.getElementById('scratchCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastPoint = null;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.init();
    }

    init() {
        this.ctx.fillStyle = '#c44569';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#a03555';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 20 + 10;
            this.ctx.fillRect(x, y, size, size);
        }

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px "Dancing Script", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('SCRATCH HERE PLSPLSPLSPSL', this.width / 2, this.height / 2);
        this.ctx.font = '20px "Playfair Display", serif';
        this.ctx.fillText('ITS SO WHOLESOME TRUST TRUST', this.width / 2, this.height / 2 + 40);

        this.canvas.addEventListener('mousedown', this.startScratch.bind(this));
        this.canvas.addEventListener('mousemove', this.scratch.bind(this));
        this.canvas.addEventListener('mouseup', this.stopScratch.bind(this));
        this.canvas.addEventListener('mouseleave', this.stopScratch.bind(this));

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    startScratch(e) {
        this.isDrawing = true;
        this.lastPoint = this.getMousePos(e);
        this.scratch(e);
    }

    scratch(e) {
        if (!this.isDrawing) return;

        const currentPoint = this.getMousePos(e);

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(currentPoint.x, currentPoint.y, 30, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.lastPoint) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
            this.ctx.lineTo(currentPoint.x, currentPoint.y);
            this.ctx.lineWidth = 60;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }

        this.lastPoint = currentPoint;

        this.checkProgress();
    }

    stopScratch() {
        this.isDrawing = false;
        this.lastPoint = null;
    }

    checkProgress() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const pixels = imageData.data;
        let transparent = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparent++;
        }

        const percent = (transparent / (pixels.length / 4)) * 100;

        if (percent > 50) {
            this.revealAll();
        }
    }

    revealAll() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    reset() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.init();
    }
}

let scratchCard;
window.addEventListener('load', () => {
    scratchCard = new ScratchCard();
});

function resetScratch() {
    if (scratchCard) {
        scratchCard.reset();
    }
}

const modal = document.getElementById('imageModal');
const modalCaption = document.getElementById('modalCaption');

const captions = [
    'our first minecraft gaming experience, kinda freaky 👅',
    'lowkey us just like the song 💗',
    'when we were playing forsaken together 💔',
    'WHEN WE WERE MATCHING AVATARS BECAUSE OUR MAINS GOT BANNED 😭',
    'THIS IS USSSSSSSSSSS 💗💗💗💗💗',
    'this is us in the future TRUST MEEE 👅'
];

function openModal(index) {
    modal.style.display = 'block';
    modalCaption.textContent = captions[index];
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.photo-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// vvery cool effect that i have no idea how to do but it looks really nice on other websites so here we goooo
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = ['💕', '💖', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = `float ${Math.random() * 3 + 4}s linear forwards`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
}

// the float animation for the hearts
setInterval(createHeart, 3000);

// sparkle effect when moving mouse around, because why not
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.fontSize = '20px';
        sparkle.style.animation = 'fadeOut 1s forwards';
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }
});

// i deadass have no idea how to do this fade out animation but it looks really nice on other websites so here we goooo (pt 2)
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0) translateY(-20px); }
    }
`;
document.head.appendChild(fadeStyle);

console.log('Happy Birthday Aoi!');

let currentIngredients = [];
const requiredIngredients = ['love', 'heart', 'sparkle'];

// witchcraft code for the recipe game, also has some fun animations because why not
function addIngredient(type) {
    const btn = document.querySelector(`button[data-ingredient="${type}"]`);
    const mixture = document.getElementById('mixture');
    const mixList = document.getElementById('mixList');
    const brewBtn = document.getElementById('brewBtn');

    if (!currentIngredients.includes(type)) {
        currentIngredients.push(type);
        btn.classList.add('added');

        createFallingIngredient(type);

        mixture.classList.add('has-content');

        const ingredientNames = {
            'love': '💕 OUR LOVE :3',
            'heart': '💗 HEARTS',
            'sparkle': '✨ SPARKLE!!'
        };
        mixList.textContent = currentIngredients.map(i => ingredientNames[i]).join(' + ');

        if (currentIngredients.length === requiredIngredients.length) {
            brewBtn.disabled = false;
            brewBtn.textContent = 'woah???? does this button work? (press on it)';

            mixture.style.background = 'linear-gradient(135deg, #ff6b9d, #f8b500, #c44569)';
            mixture.style.animation = 'mixtureSwirl 1s linear infinite';
        }
    }
}

function createFallingIngredient(type) {
    const emoji = {
        'love': '💕',
        'heart': '💖',
        'sparkle': '✨'
    };

    const falling = document.createElement('div');
    falling.textContent = emoji[type];
    falling.style.position = 'fixed';
    falling.style.left = Math.random() * 50 + 25 + 'vw';
    falling.style.top = '30vh';
    falling.style.fontSize = '2rem';
    falling.style.pointerEvents = 'none';
    falling.style.zIndex = '2500';
    falling.style.animation = 'fallToCauldron 1s ease-in forwards';
    document.body.appendChild(falling);

    setTimeout(() => falling.remove(), 1000);
}

const fallStyle = document.createElement('style');
fallStyle.textContent = `
    @keyframes fallToCauldron {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(20vh) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(fallStyle);

// I HATE THIS PART I HAVE NO IDEA HOW TO DO THIS ANIMATION BUT IT LOOKS REALLY NICE ON OTHER WEBSITES SO HERE WE GOOOOOOO (PT 3)
function brewPotion() {
    const result = document.getElementById('recipeResult');
    const cauldron = document.querySelector('.cauldron');

    cauldron.style.animation = 'cauldronBurst 0.5s ease';

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';
            sparkle.style.fontSize = (Math.random() * 20 + 10) + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '3000';
            sparkle.style.animation = `magicBurst 1s ease forwards`;
            sparkle.style.setProperty('--angle', (Math.random() * 360) + 'deg');
            sparkle.style.setProperty('--distance', (Math.random() * 200 + 100) + 'px');
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1000);
        }, i * 20);
    }

    setTimeout(() => {
        result.classList.add('show');
        document.body.style.overflow = 'hidden';
    }, 500);
}

const magicStyle = document.createElement('style');
magicStyle.textContent = `
    @keyframes cauldronBurst {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    @keyframes magicBurst {
        0% { 
            transform: translate(-50%, -50%) rotate(0deg); 
            opacity: 1; 
        }
        100% { 
            transform: translate(
                calc(-50% + cos(var(--angle)) * var(--distance)), 
                calc(-50% + sin(var(--angle)) * var(--distance))
            ) rotate(360deg); 
            opacity: 0; 
        }
    }
`;
document.head.appendChild(magicStyle);

function closeLetter() {
    const result = document.getElementById('recipeResult');
    result.classList.remove('show');
    document.body.style.overflow = 'auto';

    currentIngredients = [];
    document.querySelectorAll('.ingredient-btn').forEach(btn => {
        btn.classList.remove('added');
    });
    document.getElementById('mixture').classList.remove('has-content');
    document.getElementById('mixList').textContent = 'Empty :(...';
    document.getElementById('brewBtn').disabled = true;
    document.getElementById('brewBtn').textContent = 'BREW!!!!!! 🍯';
}

function toggleSecretPuzzle() {
    const puzzle = document.getElementById('secretPuzzle');
    puzzle.classList.toggle('show');

    if (puzzle.classList.contains('show')) {
        document.getElementById('secretCode').focus();
    }
}

function checkSecretCode() {
    const input = document.getElementById('secretCode');
    const message = document.getElementById('puzzleMessage');
    const code = input.value.trim();

    // aoi get the number bro ddam
    const SECRET_NUMBER = '010625'; 

    if (code === SECRET_NUMBER) {
        message.textContent = '🔓 what the hellie how did you crack the code 💔';
        message.className = 'puzzle-message success';

        createPortalEffect();

        setTimeout(() => {
            message.innerHTML = `
                <p>🔓 a portal?.. opens??...</p>
                <a href="secret-portal.html" class="portal-link" style="
                    display: inline-block;
                    margin-top: 1rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #ff6b9d, #c44569);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-family: 'Dancing Script', cursive;
                    font-size: 1.3rem;
                    box-shadow: 0 5px 20px rgba(255,107,157,0.4);
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    ✨ enter the anakt garden... ✨
                </a>
            `;
        }, 2000);

    } else {
        message.textContent = 'BRO ITS NOT THAT HARD I TOLD YOU TO MEMORIZE THE CODEEEEEEE 😡';
        message.className = 'puzzle-message error';

        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

// now this time i knew how to do the animation but it still took me a while to figure out how to make it look nice, also added a little shake animation for wrong code because why not
function createPortalEffect() {
    const portal = document.createElement('div');
    portal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255,107,157,0.8) 0%, rgba(196,69,105,0.4) 40%, transparent 70%);
        border-radius: 50%;
        z-index: 4000;
        pointer-events: none;
        animation: portalOpen 2s ease forwards;
    `;
    document.body.appendChild(portal);

    setTimeout(() => portal.remove(), 2000);
}

// shouldn't i just put all these animations in the css file instead of creating them with js? yeah probably but i don't care enough to change it lmao
const portalStyle = document.createElement('style');
portalStyle.textContent = `
    @keyframes portalOpen {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3) rotate(180deg); opacity: 0; }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(portalStyle);

document.addEventListener('DOMContentLoaded', () => {
    const puzzleInput = document.getElementById('secretCode');
    if (puzzleInput) {
        puzzleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkSecretCode();
            }
        });
    }
});
