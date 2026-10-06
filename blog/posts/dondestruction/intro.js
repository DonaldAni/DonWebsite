(() => {
  const IMAGE_SRC       = 'img/intro.png';
  const SOUND_SRC       = 'sound/onstagefear.mp3';
  const SOUND_VOLUME    = 1;    
  const SOUND_DELAY     = 0;    // this was an offset until i realized the image disappear lowk was the only thing i gaf about
  const OVERLAY_HOLD    = 6000; // time fully black before fading
  const OVERLAY_FADE    = 2000; // black overlay fade
  const IMAGE_FADE_IN   = 2500; // fade in duration
  const IMAGE_DISAPPEAR = 3500; // image goes away

// i dont know what the fuck im doing this looks messy
  // black overlay
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: '#000000',
    zIndex: '9998',
    opacity: '1',
    transition: `opacity ${OVERLAY_FADE}ms ease`,
  });
 
  // intro image
  const img = document.createElement('img');
  img.src = IMAGE_SRC;
  Object.assign(img.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '9999',
    opacity: '0',
    pointerEvents: 'none',
    transition: `opacity ${IMAGE_FADE_IN}ms ease-in`,
  });
 
  // sound
  const sound = new Audio(SOUND_SRC);
  sound.volume = SOUND_VOLUME;
  sound.preload = 'auto';
 
  const playSound = () => {
    sound.play().catch(() => {
      const unlock = () => {
        sound.play();
        ['pointerdown', 'keydown'].forEach(e => window.removeEventListener(e, unlock));
      };
      ['pointerdown', 'keydown'].forEach(e => window.addEventListener(e, unlock));
    });
  };
 
  // add right away so the page never flashes before the overlay appears
  document.documentElement.append(overlay, img);
 
  window.addEventListener('load', () => {
    requestAnimationFrame(() => (img.style.opacity = '1')); // fade in
 
    setTimeout(playSound, SOUND_DELAY);                      // sound
 
    setTimeout(() => {                                       // fade overlay out
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }, OVERLAY_HOLD);
 
    setTimeout(() => img.remove(), IMAGE_DISAPPEAR);         // instant disappear
    setTimeout(() => overlay.remove(), OVERLAY_HOLD + OVERLAY_FADE);
  });
})();
 