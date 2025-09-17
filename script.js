const container = document.getElementById("main-container");

let state = {
  gravity: true,
  rise: false,
  shake: false, spin: false,
  pulse: false, jump: false, explode: false, fallBottom: false,
  size: 'normal', hide: false, elements: [1,2,3,4],
  background: 'default', containerSize: 'normal'
};

function render() {
  const el = document.getElementById('elements');

  el.className = 'elements' +
    (state.shake ? ' shake' : '') +
    (state.spin ? ' spin' : '') +
    (state.pulse ? ' pulse' : '') +
    (state.jump ? ' jump' : '') +
    (state.explode ? ' explode' : '');

  // Apply container size
  container.classList.remove('expanded', 'shrunk');
  if (state.containerSize === 'expanded') container.classList.add('expanded');
  if (state.containerSize === 'shrunk') container.classList.add('shrunk');
  container.classList.toggle('hide-boxes', state.hide);

  // Recreate boxes (fresh nodes so animations play predictably)
  el.innerHTML = '';
  state.elements.forEach((num) => {
    let box = document.createElement('div');
    box.className = 'element-box';
    if (state.size === 'large') box.classList.add('large');
    if (state.size === 'small') box.classList.add('small');

    // FIXED: add gravity class when gravity IS enabled
    if (state.gravity) {
      box.classList.add('gravity');
      box.style.top = '';
      box.style.left = '';
    }
    if (state.rise) box.classList.add('rise');

    box.textContent = num;
    box.style.setProperty('--rand-x', Math.random());
    box.style.setProperty('--rand-y', Math.random());
    el.appendChild(box);
  });

  applyBackground();

  // clear short-lived effects after animation window
  setTimeout(() => {
    state.shake = false; state.spin = false; state.explode = false; state.rise = false;
    // Note: pulse/jump persist (toggleable)
  }, 800);
}

function applyBackground() {
  // reset body classes/styles first
  document.body.classList.remove('bg-stars');
  document.querySelectorAll('.star').forEach(s => s.remove());
  document.body.style.background = '';
  if (state.background === 'stars') {
    document.body.classList.add('bg-stars');
    spawnStars();
  } else if (state.background === 'dark') {
    document.body.style.background = '#1e1e2f';
  } else if (state.background === 'light') {
    document.body.style.background = '#f4f4f4';
  } else if (state.background === 'fire') {
    document.body.style.background = 'linear-gradient(to bottom, #ff4500, #ff6347, #ff0000)';
  } else {
    // default animated gradient
    document.body.style.background = '';
  }
}

function spawnStars() {
  document.querySelectorAll('.star').forEach(s => s.remove());
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.animationDelay = (Math.random() * 2) + 's';
    document.body.appendChild(star);
  }
}

function runCommand() {
  const val = document.getElementById('commandInput').value.trim().toLowerCase();
  if (!val) return;
  handleCommand(val);
  document.getElementById('commandInput').value = '';
}

function handleCommand(cmd) {
  if (/turn off gravity/.test(cmd)) { state.gravity = true; state.rise = false; state.fallBottom = false; state.pulse = false; }
  else if (/turn on gravity/.test(cmd)) { state.rise = true; state.gravity = false; state.fallBottom = false; state.pulse = false; }
  else if (/shake/.test(cmd)) { state.shake = true; state.pulse = false; state.jump = false; }
  else if (/spin/.test(cmd)) { state.spin = true; state.pulse = false; state.jump = false; }
  else if (/pulse/.test(cmd)) state.pulse = !state.pulse;
  else if (/jump/.test(cmd)) { state.jump = !state.jump; state.pulse = false; state.shake = false; state.spin = false; state.explode = false; }
  else if (/explode/.test(cmd)) { state.explode = true; state.pulse = false; state.jump = false; }

  else if (/large$/.test(cmd)) state.size = 'large';
  else if (/small$/.test(cmd)) state.size = 'small';
  else if (/normal$/.test(cmd)) state.size = 'normal';
  else if (/hide boxes?/.test(cmd)) state.hide = true;
  else if (/show boxes?/.test(cmd)) state.hide = false;
  else if (/add element/.test(cmd)) state.elements.push(state.elements.length + 1);
  else if (/remove last/.test(cmd)) {
    state.elements.pop();
    if (state.elements.length === 0) state.elements = [1];
  }
  else if (/reset/.test(cmd)) {
    state = { gravity:true, rise:false, shake:false, spin:false,
              pulse:false, jump:false, explode:false, fallBottom:false, size:'normal', hide:false,
              elements:[1,2,3,4], background:'default', containerSize:'normal' };
  }

  else if (/background stars?/.test(cmd)) state.background = 'stars';
  else if (/background dark/.test(cmd)) state.background = 'dark';
  else if (/background light/.test(cmd)) state.background = 'light';
  else if (/background fire/.test(cmd)) state.background = 'fire';
  else if (/expand container/.test(cmd)) state.containerSize = 'expanded';
  else if (/shrink container/.test(cmd)) state.containerSize = 'shrunk';

  render();
}

// Enter key triggers command
document.getElementById('commandInput').addEventListener('keydown', e => {
  if (e.key === "Enter") runCommand();
});

// initial render
render();
