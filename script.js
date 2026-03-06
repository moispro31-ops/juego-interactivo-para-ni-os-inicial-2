const game = {
    stars: 0, currentLevel: 0, itemsNeeded: 0,
    speechBox: document.getElementById('text-speech'),
    starCount: document.getElementById('stars'),
    charEmoji: document.getElementById('char-emoji'),
    charAvatar: document.getElementById('char-avatar'),

    animales: [
        { emoji: "🐶", nombre: "Tobi", color: "#FFE66D", pitch: 1.1 },
        { emoji: "🐱", nombre: "Misi", color: "#FFABE7", pitch: 1.4 },
        { emoji: "🐰", nombre: "Tambor", color: "#A8E6CF", pitch: 1.6 }
    ],

    posicionarItems(escena) {
        const items = escena.querySelectorAll('.item');
        items.forEach((item) => {
            const x = 10 + (Math.random() * 75);
            const y = 25 + (Math.random() * 25); 
            item.style.left = x + "%";
            item.style.top = y + "%";
            item.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
            item.style.opacity = "1";
            item.style.pointerEvents = "auto";
        });
    },

    hablar(texto) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'es-ES';
        msg.pitch = this.amigoActual ? this.amigoActual.pitch : 1;
        window.speechSynthesis.speak(msg);
    },

    startGame() { this.nextLevel(1); },

    nextLevel(level) {
        this.currentLevel = level;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        const amigo = this.animales[Math.floor(Math.random() * this.animales.length)];
        this.amigoActual = amigo;
        this.charEmoji.innerText = amigo.emoji;
        this.charAvatar.style.background = amigo.color;

        const misiones = {
            1: `¡Hola! Soy ${amigo.nombre}. ¡Limpia los restos de comida!`,
            2: `¡Muy bien! Guarda los útiles en la mochila.`,
            3: `¡Qué gran ayuda! Lleva todos los libros a tu amigo.`,
            4: `¡A jugar juntos! Guarda todos los juguetes.`,
            5: `¡Excelente! Riega las flores con mucha agua.`
        };

        const screen = document.getElementById(`level-${level}`);
        if (screen) {
            screen.classList.add('active');
            this.posicionarItems(screen);
            this.speechBox.innerText = misiones[level];
            this.hablar(misiones[level]);
            this.itemsNeeded = screen.querySelectorAll('.item').length;
        } else {
            this.showFinalScreen();
        }
    },

    collectItem(element) {
        element.style.pointerEvents = 'none';
        element.style.opacity = '0';
        element.style.transform = 'scale(0) translateY(-100px)';
        this.stars++;
        this.starCount.innerText = this.stars;
        this.itemsNeeded--;

        if (this.itemsNeeded === 0) {
            this.hablar("¡Genial!");
            setTimeout(() => this.nextLevel(this.currentLevel + 1), 1200);
        }
    },

    showFinalScreen() {
        document.getElementById('end-screen').classList.add('active');
        const txt = "¡Eres un súper campeón! Todo quedó impecable.";
        this.speechBox.innerText = txt;
        this.hablar(txt);
        this.lanzarConfeti();
    },

    lanzarConfeti() {
        const container = document.getElementById('game-container');
        for (let i = 0; i < 100; i++) {
            const c = document.createElement('div');
            c.className = 'confeti';
            c.style.left = Math.random() * 100 + '%';
            c.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            c.style.animationDuration = (Math.random() * 2 + 1) + 's';
            c.style.animationDelay = (Math.random() * 1.5) + 's';
            container.appendChild(c);
        }
    }
};