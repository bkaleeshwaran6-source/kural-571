const $ = s => document.querySelector(s);

/* Stars */
for (let i = 0; i < 70; i++) {
  const s = document.createElement('span');
  s.style.cssText = 'left:' + Math.random()*100 + '%;top:' + Math.random()*100 + '%;animation-delay:' + Math.random()*3 + 's;transform:scale(' + (.5 + Math.random()*1.5) + ')';
  $('#stars').appendChild(s);
}

/* Lantern light: follows pointer, drifts on its own when idle (works on phones too) */
const hero = $('#hero'), kw = $('#kw'), lit = $('#lit');
let tx = 0, ty = 0, cx = 0, cy = 0, last = 0, ready = false;
hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  tx = e.clientX - r.left; ty = e.clientY - r.top; last = performance.now();
});
(function loop(t){
  const r = hero.getBoundingClientRect(), k = kw.getBoundingClientRect();
  if (!ready || t - last > 2500) {
    tx = r.width/2 + Math.cos(t*.0006) * r.width*.32;
    ty = (k.top - r.top) + k.height/2 + Math.sin(t*.0011) * k.height*.4;
  }
  if (!ready) { cx = tx; cy = ty; ready = true; }
  cx += (tx - cx)*.1; cy += (ty - cy)*.1;
  hero.style.setProperty('--hx', cx + 'px'); hero.style.setProperty('--hy', cy + 'px');
  lit.style.setProperty('--x', (cx - (k.left - r.left)) + 'px');
  lit.style.setProperty('--y', (cy - (k.top - r.top)) + 'px');
  requestAnimationFrame(loop);
})(0);

/* Word scenes */
const WS = [
 ["கண்ணோட்டம்","Grace: the look of the eye","Being truly seen, and answering with kindness. Watch the eye light up each person it meets.",
  '<div class="s1"><div class="eyew"><i class="r"></i><i class="r"></i><i class="r"></i><span class="big">👁️</span></div><div><u>🙂</u><u>😔</u><u>🧒</u></div></div>'],
 ["என்னும்","Called / known as","The Kural pauses to give this quality a name, like writing a label on something precious.",
  '<div class="s2"><b>என்னும்</b><span class="ty">கண்ணோட்டம்</span></div>'],
 ["கழிபெருங்","Exceedingly great","So much that it spills past every measure. No cup can hold it.",
  '<div class="cup"><div class="liq"></div><span class="spk" style="left:10px">✨</span><span class="spk" style="left:38px;animation-delay:.3s">✨</span><span class="spk" style="left:66px;animation-delay:.6s">✨</span></div>'],
 ["காரிகை","Beauty","Jewels fade away, and a gentle heart takes their place as the real ornament.",
  '<div class="s4"><span class="gem">💎</span><span class="lot">🪷</span><span class="k2" style="left:12%;top:18%">✨</span><span class="k2" style="left:88%;top:25%;animation-delay:.7s">✨</span><span class="k2" style="left:80%;top:85%;animation-delay:1.4s">✨</span></div>'],
 ["உண்மையான்","Because it exists","Like a lamp switched on: its mere presence lights up the whole room.",
  '<div class="s5"><span>💡</span><small>உண்டு ✓</small></div>'],
 ["உண்டிவ்","It sustains this","The world rests in open hands, held up by kindness the way a palm holds a ball.",
  '<div class="s6"><span class="wd">🌍</span><span class="hd">🤲</span></div>'],
 ["வுலகு","The world","Every small act of grace is a light circling the Earth.",
  '<div class="s7"><div class="wd2">🌍</div><i class="o" style="--r:62px;--d:6s"></i><i class="o" style="--r:86px;--d:9s"></i><i class="o" style="--r:106px;--d:13s"></i></div>']
];
const ws = $('#ws'), wsb = $('#wsb'); let wi = 0, tm;
WS.forEach(([t], i) => {
  const b = document.createElement('button');
  b.className = 'chip'; b.textContent = t; b.style.setProperty('--c', i*50 + 10);
  b.onclick = () => { pick(i); play(); };
  $('#chips').appendChild(b);
});
function pick(i){
  wi = i; ws.style.setProperty('--h', i*50 + 10);
  document.querySelectorAll('.chip').forEach((c, j) => c.classList.toggle('on', j == i));
  const [t, m, f, sc] = WS[i];
  wsb.innerHTML = '<div class="sc">' + sc + '</div><div class="wt">' + t + '</div><div class="wm">' + m + '</div><p class="wf">' + f + '</p><div class="pb"><i></i></div>';
}
function play(){ clearInterval(tm); tm = setInterval(() => pick((wi + 1) % WS.length), 5200); }
pick(0); play();

/* Two worlds */
const hs = Array.from({length:16}, () => 30 + Math.random()*100 | 0);
document.querySelectorAll('.sky').forEach(el => el.innerHTML = hs.map(h => '<i style="height:' + h + 'px"></i>').join(''));
const notes = [[25,'Mostly warm: neighbours notice each other.'],[75,'Half and half: grace is still fragile.'],[101,'Mostly cold: nobody looks up.']];
function cmp(){
  const v = +$('#cmp').value;
  $('#stage').style.setProperty('--p', v + '%');
  $('#cap').textContent = notes.find(n => v < n[0])[1];
}
$('#cmp').addEventListener('input', cmp); cmp();

/* Quiz */
const Q = [
 ["What does கண்ணோட்டம் literally point to?", ["The look of the eye: seeing others with kindness","A kind of jewel","The strength of an army"], 0, "The 'look of the eye' means kindness born from really seeing someone."],
 ["Valluvar calls grace a கழிபெருங் காரிகை. That means…", ["A great battle","The greatest beauty","A rich harvest"], 1, "Grace is described as the finest beauty a person can have."],
 ["Why, says the Kural, does the world endure?", ["Kings are powerful","Wealth keeps growing","Because grace exists"], 2, "The world is held together by grace."]
];
let qi = 0, sc = 0;
function showQ(){
  const box = $('#quiz');
  if (qi >= Q.length) {
    box.innerHTML = '<div class="qh">' + ('🌟'.repeat(sc) || '🌱') + '</div><p>You scored <b>' + sc + '/' + Q.length + '</b>. ' + (sc == 3 ? 'You see with grace!' : 'Replay the seven words and retry.') + '</p><button class="btn" id="again">Play again</button>';
    $('#again').onclick = () => { qi = sc = 0; showQ(); };
    return;
  }
  const [q, o, a, e] = Q[qi]; let done = false;
  box.innerHTML = '<p class="qn">Question ' + (qi+1) + ' of ' + Q.length + '</p><h3>' + q + '</h3>' + o.map((t, i) => '<button class="opt">' + t + '</button>').join('') + '<p id="fb"></p>';
  const opts = box.querySelectorAll('.opt');
  opts.forEach((b, i) => b.onclick = () => {
    if (done) return; done = true;
    if (i == a) { sc++; b.classList.add('ok'); } else { b.classList.add('no'); opts[a].classList.add('ok'); }
    $('#fb').innerHTML = (i == a ? '✓ ' : '✗ ') + e + ' <button class="btn" id="nx">' + (qi < Q.length-1 ? 'Next →' : 'Finish') + '</button>';
    $('#nx').onclick = () => { qi++; showQ(); };
  });
}
showQ();

/* Lanterns */
let n = 0;
$('#lan').onclick = () => {
  $('#cnt').textContent = ++n;
  const l = document.createElement('span');
  l.className = 'lan'; l.textContent = '🏮';
  l.style.left = (8 + Math.random()*84) + '%';
  l.style.setProperty('--dx', (Math.random()*140 - 70) + 'px');
  document.body.appendChild(l); setTimeout(() => l.remove(), 6000);
};

/* Progress bar + scroll reveal */
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#bar').style.transform = 'scaleX(' + (scrollY / (h.scrollHeight - innerHeight || 1)) + ')';
});
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.2});
document.querySelectorAll('.rv').forEach(el => io.observe(el));
