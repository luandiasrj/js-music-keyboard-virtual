const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");

let mapedKeys = Array.from(pianoKeys, key => key.dataset.key);
let keysPressed = [];
let audios = {}; // Objeto para armazenar todos os objetos Audio
let volume = 1; // Variável global para o volume

mapedKeys.forEach(key => {
    let audio = new Audio(`src/tunes/${key}.wav`);
    audio.volume = volume; // Definindo o volume do objeto Audio
    audios[key] = audio; // Adicionando o objeto Audio ao objeto
});

const playTune = (key) => {
    let audio = audios[key].cloneNode();
    audio.volume = volume; // Definindo o volume do objeto Audio
    audio.play();

    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey.classList.add("active");

    audio.onended = () => {
        clickedKey.classList.remove("active");
        audio.onended = null; // Remove o ouvinte de eventos
    };
};

const handleMouseUp = (key) => {
    const clickedKey = document.querySelector(`[data-key="${key.dataset.key}"]`);
    clickedKey.classList.remove("active");
}

pianoKeys.forEach((key) => {
    key.addEventListener("mousedown", () => playTune(key.dataset.key));
    key.addEventListener("mouseup", () => handleMouseUp(key));
});

document.addEventListener("keydown", (e) => {
    if (mapedKeys.includes(e.key) && !keysPressed.includes(e.key)) {
        keysPressed.push(e.key);
        playTune(e.key);
    }
});

document.addEventListener("keyup", (e) => {
    keysPressed = keysPressed.filter(key => key !== e.key);
    if (mapedKeys.includes(e.key)) {
        const clickedKey = document.querySelector(`[data-key="${e.key}"]`);
        clickedKey.classList.remove("active");
    }
});

const handleVolume = () => {
    volume = volumeSlider.value; // Definindo o volume global
    Object.values(audios).forEach((audio) => audio.volume = volume); // Definindo o volume de cada objeto Audio
}
const showHideKeys = () => {
    pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

volumeSlider.addEventListener("input", handleVolume);

keysCheck.addEventListener("click", showHideKeys);

// Mão esquerda:
const maoEsquerda = 'f1,f1,f1,f1,f1,f1,d1,d1,d1,d1,d1,d1,s1,s1,s1,s1,s1,s1,a2,a1,a1,s1,d1,f1,f1,f1,f1,f1,f1,d1,d1,d1,d1,d1,d1,s1,s1,s1,s1,s1,s1,a1.5,f2,a3';
// // Mão direita:
const maoDireita = 'g1,g1,g1,g1,g1,g1,g1,g1,g1,g1,g1,g1,j1,j1,j1,j1,h1,j1,k2,k1,k1,j1,h1,g1,g1,g1,g1,g1,g1,g1,g1,g1,g1,g1,g1,j1,j1,j1,j1,h1,j1,k1.5,g2,k3';

let playing = false;
const playHand = (hand) => {
    const notes = hand.split(',');
    let totalTime = 0;
    notes.forEach((note) => {
        const key = note.charAt(0);
        const duration = parseFloat(note.slice(1));
        setTimeout(() => {
            const pianoKey = document.querySelector(`[data-key="${key}"]`);
            if (pianoKey) {
                pianoKey.dispatchEvent(new Event('mousedown'));
                setTimeout(() => {
                    pianoKey.dispatchEvent(new Event('mouseup'));
                }, duration * 300); // Ajuste o tempo de espera conforme necessário
            }
        }, totalTime);
        totalTime += duration * 350;
    });
    setTimeout(() => {
        playing = false;
    }, totalTime);
};

const playButton = document.getElementById('play');

playButton.addEventListener('click', () => {
    if (!playing) {
        playHand(maoEsquerda);
        playHand(maoDireita);
        playing = true;
    }
});
