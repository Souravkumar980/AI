// Utility for playing sounds:
// - Random sounds on Propagandu cards / upvotes
// - Narendra Modi comedy sound on BJP/NDA 2029 YES vote
// - Rahul Gandhi (Raga) sound on BJP/NDA 2029 NO vote
// Plays full sound duration, but immediately stops if user taps anywhere on screen

const PROPAGANDU_SOUNDS = [
  '/sounds/sound_1.m4a',
  '/sounds/sound_1.mp3',
  '/sounds/sound_2.mp3',
  '/sounds/sound_3.mp3',
  '/sounds/sound_4.mp3',
  '/sounds/sound_5.mp3',
  '/sounds/sound_6.mp3',
  '/sounds/sound_7.mp3',
  '/sounds/sound_8.mp3'
];

let activeAudio = null;
let dismissListener = null;

export function stopCurrentPropaganduSound() {
  if (dismissListener) {
    window.removeEventListener('click', dismissListener, true);
    window.removeEventListener('touchstart', dismissListener, true);
    window.removeEventListener('keydown', dismissListener, true);
    dismissListener = null;
  }

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch (e) {
      // Ignore abort errors
    }
    activeAudio = null;
  }
}

export function playSoundWithDismiss(soundUrl) {
  stopCurrentPropaganduSound();

  const audio = new Audio(soundUrl);
  audio.volume = 1.0;
  activeAudio = audio;

  const onEndOrError = () => {
    if (activeAudio === audio) {
      stopCurrentPropaganduSound();
    }
  };

  audio.addEventListener('ended', onEndOrError);
  audio.addEventListener('error', onEndOrError);

  audio.play().catch((err) => {
    console.warn('Audio playback prevented or unsupported:', err);
    stopCurrentPropaganduSound();
  });

  // Attach global dismiss listener with a slight 120ms delay so the triggering click doesn't immediately stop it
  setTimeout(() => {
    if (activeAudio === audio) {
      dismissListener = () => {
        stopCurrentPropaganduSound();
      };
      window.addEventListener('click', dismissListener, { capture: true, once: true });
      window.addEventListener('touchstart', dismissListener, { capture: true, once: true });
      window.addEventListener('keydown', dismissListener, { capture: true, once: true });
    }
  }, 120);
}

let activePropaganduAudio = null;

export function playRandomPropaganduSound() {
  try {
    if (activePropaganduAudio) {
      activePropaganduAudio.pause();
      activePropaganduAudio.currentTime = 0;
    }
    const randomIndex = Math.floor(Math.random() * PROPAGANDU_SOUNDS.length);
    const audio = new Audio(PROPAGANDU_SOUNDS[randomIndex]);
    audio.volume = 0.9;
    activePropaganduAudio = audio;
    audio.play().catch((err) => {
      console.warn('Audio playback prevented or unsupported:', err);
    });
  } catch (e) {}
}

// Special song on YES vote for BJP/NDA 2029 ("Iska Karan Narendra Modi hain")
export function playModiSound() {
  playSoundWithDismiss('/sounds/modi_sound.mp3');
}

// Special sound on NO vote for BJP/NDA 2029 ("raga sound")
export function playRagaSound() {
  playSoundWithDismiss('/sounds/raga_sound.mp3');
}
