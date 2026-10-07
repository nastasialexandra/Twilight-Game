(() => {
// Puzzle data: each entry is an answer, its start square, direction (A/D), number and clue
const P = {
 "rows": 17,
 "cols": 17,
 "entries": [
  {
   "answer": "MIDNIGHTSUN",
   "row": 7,
   "col": 4,
   "dir": "A",
   "num": 14,
   "clue": "The 2020 book that retells the story from Edward's point of view (8,3)"
  },
  {
   "answer": "BATMAN",
   "row": 2,
   "col": 7,
   "dir": "D",
   "num": 4,
   "clue": "Caped role Edward's actor took on in 2022"
  },
  {
   "answer": "JACOB",
   "row": 3,
   "col": 6,
   "dir": "A",
   "num": 7,
   "clue": "Shirtless werewolf, captain of his own team"
  },
  {
   "answer": "PHOENIX",
   "row": 3,
   "col": 14,
   "dir": "D",
   "num": 9,
   "clue": "Sunny city Bella leaves behind"
  },
  {
   "answer": "RENESMEE",
   "row": 2,
   "col": 4,
   "dir": "D",
   "num": 3,
   "clue": "Name nobody could spell on the first try"
  },
  {
   "answer": "CULLEN",
   "row": 5,
   "col": 0,
   "dir": "A",
   "num": 11,
   "clue": "Family surname of the 'vegetarian' vampires"
  },
  {
   "answer": "ESME",
   "row": 3,
   "col": 1,
   "dir": "A",
   "num": 6,
   "clue": "Cullen matriarch who cooks for nobody"
  },
  {
   "answer": "VOLTURI",
   "row": 4,
   "col": 11,
   "dir": "D",
   "num": 10,
   "clue": "The Italian coven that enforces vampire law"
  },
  {
   "answer": "MEADOW",
   "row": 5,
   "col": 7,
   "dir": "A",
   "num": 12,
   "clue": "Sunlit clearing where Edward reveals himself"
  },
  {
   "answer": "QUILEUTE",
   "row": 9,
   "col": 0,
   "dir": "A",
   "num": 15,
   "clue": "Jacob's tribe, based in La Push"
  },
  {
   "answer": "BLUE",
   "row": 7,
   "col": 1,
   "dir": "D",
   "num": 13,
   "clue": "Colour of the first film's famous filter"
  },
  {
   "answer": "ALICE",
   "row": 10,
   "col": 9,
   "dir": "A",
   "num": 17,
   "clue": "Cullen sister who sees the future (and plans the prom)"
  },
  {
   "answer": "LOCA",
   "row": 2,
   "col": 9,
   "dir": "D",
   "num": 5,
   "clue": "'Bella, where the hell have you been, ___?'"
  },
  {
   "answer": "MUSE",
   "row": 0,
   "col": 1,
   "dir": "D",
   "num": 2,
   "clue": "Band behind the baseball scene's soundtrack"
  },
  {
   "answer": "BASEBALL",
   "row": 9,
   "col": 9,
   "dir": "D",
   "num": 16,
   "clue": "Vampires play it only during thunderstorms"
  },
  {
   "answer": "IMPRINT",
   "row": 0,
   "col": 0,
   "dir": "A",
   "num": 1,
   "clue": "Wolf-pack bond that aged badly in the discourse"
  },
  {
   "answer": "FORKS",
   "row": 11,
   "col": 5,
   "dir": "A",
   "num": 19,
   "clue": "Rainy Washington town where it all begins"
  },
  {
   "answer": "CHARLIE",
   "row": 10,
   "col": 12,
   "dir": "D",
   "num": 18,
   "clue": "Forks police chief, master of the awkward dad nod"
  },
  {
   "answer": "BELLA",
   "row": 14,
   "col": 5,
   "dir": "A",
   "num": 20,
   "clue": "Swan who moves to Forks"
  },
  {
   "answer": "TIKTOK",
   "row": 15,
   "col": 11,
   "dir": "A",
   "num": 21,
   "clue": "App that powered the saga's 2020s comeback"
  },
  {
   "answer": "APPLE",
   "row": 3,
   "col": 12,
   "dir": "A",
   "num": 8,
   "clue": "Fruit held out on the first book's cover"
  },
  {
   "answer": "SPARKLE",
   "row": 16,
   "col": 4,
   "dir": "A",
   "num": 22,
   "clue": "What Edward does in sunlight, to the internet's eternal delight"
  }
 ]
};
const R=P.rows,C=P.cols,gridEl=document.getElementById('grid');
gridEl.style.gridTemplateColumns=`repeat(${C},minmax(0,1fr))`;
const sol=Array.from({length:R},()=>Array(C).fill(null));
const cellWords=Array.from({length:R},()=>Array.from({length:C},()=>({})));
const nums={};
P.entries.forEach((e,idx)=>{e.id=idx;e.cells=[];
  for(let i=0;i<e.answer.length;i++){const r=e.dir==='A'?e.row:e.row+i,c=e.dir==='A'?e.col+i:e.col;
    sol[r][c]=e.answer[i];cellWords[r][c][e.dir]=e;e.cells.push([r,c]);}
  nums[e.row+','+e.col]=e.num;});
const inputs={};let saved={};
try{saved=JSON.parse(localStorage.getItem('twilight-xw')||'{}')}catch(e){}
for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  const d=document.createElement('div');d.className='c';d.dataset.r=r;d.dataset.c=c;
  if(sol[r][c]){d.classList.add('open');
    if(nums[r+','+c]){const n=document.createElement('span');n.className='n';n.textContent=nums[r+','+c];d.appendChild(n)}
    const inp=document.createElement('input');inp.setAttribute('maxlength','1');inp.setAttribute('autocomplete','off');inp.setAttribute('autocapitalize','characters');inp.setAttribute('spellcheck','false');inp.setAttribute('inputmode','text');
    inp.setAttribute('aria-label',`Row ${r+1}, column ${c+1}`);
    inp.value=saved[r+','+c]||'';d.appendChild(inp);inputs[r+','+c]=inp;
    inp.addEventListener('mousedown',ev=>{if(cur&&cur.r===r&&cur.c===c){ev.preventDefault();toggle();}});
    inp.addEventListener('focus',()=>{select(r,c)});
    inp.addEventListener('keydown',ev=>key(ev,r,c));
    inp.addEventListener('input',ev=>{const v=(inp.value||'').replace(/[^a-z]/gi,'').slice(-1).toUpperCase();inp.value=v;d.classList.remove('wrong','revealed');if(v)advance(1);save();refresh();});
  }
  gridEl.appendChild(d);
}
let cur=null,dir='A';
function word(){if(!cur)return null;const w=cellWords[cur.r][cur.c];return w[dir]||w[dir==='A'?'D':'A']}
function select(r,c,keepDir){const w=cellWords[r][c];if(!w[dir])dir=w.A?'A':'D';cur={r,c};refresh();}
function toggle(){const w=cellWords[cur.r][cur.c];const o=dir==='A'?'D':'A';if(w[o]){dir=o;refresh()}}
function focusCell(r,c){const i=inputs[r+','+c];if(i){i.focus({preventScroll:true});select(r,c)}}
function advance(step){const w=word();const k=w.cells.findIndex(([r,c])=>r===cur.r&&c===cur.c);const n=w.cells[k+step];if(n)focusCell(n[0],n[1]);}
function key(ev,r,c){
  const map={ArrowRight:[0,1,'A'],ArrowLeft:[0,-1,'A'],ArrowDown:[1,0,'D'],ArrowUp:[-1,0,'D']};
  if(map[ev.key]){ev.preventDefault();const[dr,dc,d]=map[ev.key];
    if(dir!==d&&cellWords[r][c][d]){dir=d;refresh();return}
    let rr=r+dr,cc=c+dc;while(rr>=0&&cc>=0&&rr<R&&cc<C){if(sol[rr][cc]){focusCell(rr,cc);return}rr+=dr;cc+=dc}return}
  if(ev.key==='Backspace'){ev.preventDefault();const i=inputs[r+','+c];
    if(i.value){i.value='';}else{advance(-1);const j=inputs[cur.r+','+cur.c];j.value='';}
    i.parentNode.classList.remove('wrong');save();refresh();return}
  if(ev.key===' '){ev.preventDefault();toggle();return}
  if(ev.key==='Tab'){ev.preventDefault();const list=P.entries.slice().sort((a,b)=>(a.dir+a.num.toString().padStart(3,'0'))<(b.dir+b.num.toString().padStart(3,'0'))?-1:1);
    const w=word();let k=list.indexOf(w)+(ev.shiftKey?-1:1);k=(k+list.length)%list.length;goWord(list[k]);return}
  if(/^[a-z]$/i.test(ev.key)&&!ev.metaKey&&!ev.ctrlKey){ev.preventDefault();const i=inputs[r+','+c];i.value=ev.key.toUpperCase();i.parentNode.classList.remove('wrong','revealed');advance(1);save();refresh();}
}
function goWord(e){dir=e.dir;const first=e.cells.find(([r,c])=>!inputs[r+','+c].value)||e.cells[0];focusCell(first[0],first[1]);dir=e.dir;refresh();}
const clueEls={};
function len(e){return e.answer==='MIDNIGHTSUN'?'(8,3)':`(${e.answer.length})`}
['A','D'].forEach(d=>{const ol=document.getElementById(d==='A'?'across':'down');
  P.entries.filter(e=>e.dir===d).sort((a,b)=>a.num-b.num).forEach(e=>{
    const li=document.createElement('li');li.className='clue';li.tabIndex=0;
    li.innerHTML=`<span>${e.num}</span><span>${e.clue.replace(/ \(8,3\)$/,'')} <span class="len">${len(e)}</span></span>`;
    li.addEventListener('click',()=>goWord(e));li.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();goWord(e)}});
    ol.appendChild(li);clueEls[e.id]=li;});});
function filled(e){return e.cells.every(([r,c])=>inputs[r+','+c].value)}
function refresh(){
  document.querySelectorAll('.c.inword,.c.focus').forEach(x=>x.classList.remove('inword','focus'));
  Object.values(clueEls).forEach(x=>x.classList.remove('on'));
  P.entries.forEach(e=>clueEls[e.id].classList.toggle('done',filled(e)));
  const w=word();const cu=document.getElementById('current');
  if(w){w.cells.forEach(([r,c])=>inputs[r+','+c].parentNode.classList.add('inword'));
    inputs[cur.r+','+cur.c].parentNode.classList.add('focus');clueEls[w.id].classList.add('on');
    cu.innerHTML=`<b>${w.num} ${w.dir==='A'?'across':'down'}</b><span>${w.clue.replace(/ \(8,3\)$/,'')} <span class="len">${len(w)}</span></span>`;}
  else cu.innerHTML='<b>Clue</b><span>Tap any white square to see its clue.</span>';
  const all=Object.keys(inputs).every(k=>{const[r,c]=k.split(',');return inputs[k].value===sol[r][c]});
  const st=document.getElementById('status');
  if(all){st.textContent='Solved. Somewhere in Forks, Edward is sparkling with pride.';st.className='status win'}
  else if(st.classList.contains('win')){st.textContent='';st.className='status'}
}
function save(){const o={};for(const k in inputs)if(inputs[k].value)o[k]=inputs[k].value;try{localStorage.setItem('twilight-xw',JSON.stringify(o))}catch(e){}}
document.getElementById('check').onclick=()=>{let wrong=0,empty=0;
  for(const k in inputs){const[r,c]=k.split(',');const v=inputs[k].value;const d=inputs[k].parentNode;
    if(!v){empty++;continue}if(v!==sol[r][c]){d.classList.add('wrong');wrong++}}
  const st=document.getElementById('status');
  if(!wrong&&!empty){refresh();return}
  st.className='status';st.textContent=wrong?`${wrong} square${wrong>1?'s':''} marked in red. ${empty?empty+' still empty.':''}`:`Everything so far is right. ${empty} square${empty>1?'s':''} to go.`;};
document.getElementById('revealWord').onclick=()=>{const w=word();const st=document.getElementById('status');
  if(!w){st.className='status';st.textContent='Pick a square first, then reveal its word.';return}
  w.cells.forEach(([r,c])=>{const i=inputs[r+','+c];if(i.value!==sol[r][c]){i.value=sol[r][c];i.parentNode.classList.add('revealed')}i.parentNode.classList.remove('wrong')});save();refresh();};
document.getElementById('clear').onclick=()=>{if(!confirm('Clear every square?'))return;for(const k in inputs){inputs[k].value='';inputs[k].parentNode.classList.remove('wrong','revealed')}save();document.getElementById('status').textContent='';refresh();};
document.getElementById('print').onclick=()=>window.print();
refresh();
})();

/* ---------- Memory match ---------- */
(() => {
  const s = 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    apple:   { name: 'Apple', cls: 'apple', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M24 15c-3-3-12-3-14 5-2 9 4 20 9 21 2 0 3-1 5-1s3 1 5 1c5-1 11-12 9-21-2-8-11-8-14-5z" fill="currentColor"/><path d="M24 15c0-4 1-7 3-9"/><path d="M26 11c3-3 7-3 9-2-2 3-6 4-9 2z" fill="currentColor"/></svg>` },
    wolf:    { name: 'Wolf', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M9 6l7 12h16l7-12 2 17-7 13-10 6-10-6-7-13z"/><path d="M19 27l2 2M29 27l-2 2"/><path d="M21 36l3 3 3-3"/></svg>` },
    baseball:{ name: 'Baseball', svg: `<svg viewBox="0 0 48 48" ${s}><circle cx="24" cy="24" r="17"/><path d="M13 11c5 7 5 19 0 26M35 11c-5 7-5 19 0 26"/><path d="M12.5 17h3M12.5 31h3M32.5 17h3M32.5 31h3" stroke-width="1.8"/></svg>` },
    moon:    { name: 'Moon', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M31 7a17 17 0 1 0 11 27A14 14 0 0 1 31 7z" fill="currentColor"/></svg>` },
    rain:    { name: 'Rain cloud', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M14 30a8 8 0 0 1 0-16 11 11 0 0 1 21 2 7 7 0 0 1 0 14z"/><path d="M17 36l-2 5M25 36l-2 5M33 36l-2 5"/></svg>` },
    pine:    { name: 'Pine tree', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M24 5l8 11h-4l9 11h-5l9 11H11l9-11h-5l9-11h-4z" fill="currentColor"/><path d="M24 38v6"/></svg>` },
    sparkle: { name: 'Sparkle', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M22 6c1 10 4 13 14 14-10 1-13 4-14 14-1-10-4-13-14-14 10-1 13-4 14-14z" fill="currentColor"/><path d="M38 31c.5 4 1.5 5 5 5.5-3.5.5-4.5 1.5-5 5.5-.5-4-1.5-5-5-5.5 3.5-.5 4.5-1.5 5-5.5z" fill="currentColor"/></svg>` },
    truck:   { name: 'Red truck', svg: `<svg viewBox="0 0 48 48" ${s}><path d="M4 32V20h22v12M26 32V16h9l7 9v7"/><path d="M29 19h5l4 6h-9z"/><path d="M4 32h38"/><circle cx="12" cy="34" r="4" fill="var(--mist)"/><circle cx="34" cy="34" r="4" fill="var(--mist)"/></svg>` }
  };
  const BACK = `<svg viewBox="0 0 48 48" ${s}><path d="M24 5l8 11h-4l9 11h-5l9 11H11l9-11h-5l9-11h-4z" fill="currentColor"/></svg>`;

  const board = document.getElementById('memoryBoard');
  if (!board) return;
  const $ = id => document.getElementById(id);
  let first = null, lock = false, moves = 0, pairs = 0, start = 0, timer = null;

  const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function loadBest() { try { return JSON.parse(localStorage.getItem('twilight-mm-best')); } catch (e) { return null; } }
  function showBest() { const b = loadBest(); $('mmBest').textContent = b ? `${b.moves} moves` : '–'; }

  function deal() {
    clearInterval(timer); timer = null;
    first = null; lock = false; moves = 0; pairs = 0;
    $('mmMoves').textContent = 0; $('mmPairs').textContent = 0; $('mmTime').textContent = '0:00';
    $('mmStatus').textContent = ''; $('mmStatus').className = 'status';
    board.innerHTML = '';
    shuffle([...Object.keys(ICONS), ...Object.keys(ICONS)]).forEach(key => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mm-card';
      b.dataset.key = key;
      b.setAttribute('aria-label', 'Face-down card');
      b.innerHTML = `<span class="mm-inner"><span class="mm-face mm-back">${BACK}</span><span class="mm-face mm-front"><span class="${ICONS[key].cls || ''}">${ICONS[key].svg}</span></span></span>`;
      b.addEventListener('click', () => flip(b));
      board.appendChild(b);
    });
    showBest();
  }

  function flip(card) {
    if (lock || card === first || card.classList.contains('matched')) return;
    if (!timer) {
      start = Date.now();
      timer = setInterval(() => { $('mmTime').textContent = fmt(Math.floor((Date.now() - start) / 1000)); }, 500);
    }
    card.classList.add('flipped');
    card.setAttribute('aria-label', ICONS[card.dataset.key].name);
    if (!first) { first = card; return; }

    moves++; $('mmMoves').textContent = moves;
    const second = card;
    if (first.dataset.key === second.dataset.key) {
      [first, second].forEach(c => { c.classList.add('matched'); c.setAttribute('aria-label', ICONS[c.dataset.key].name + ', matched'); });
      first = null; pairs++; $('mmPairs').textContent = pairs;
      if (pairs === 8) win();
    } else {
      lock = true;
      [first, second].forEach(c => c.classList.add('nope'));
      setTimeout(() => {
        [first, second].forEach(c => { c.classList.remove('flipped', 'nope'); c.setAttribute('aria-label', 'Face-down card'); });
        first = null; lock = false;
      }, 950);
    }
  }

  function win() {
    clearInterval(timer); timer = null;
    const secs = Math.floor((Date.now() - start) / 1000);
    const best = loadBest();
    let msg = `All eight pairs in ${moves} moves and ${fmt(secs)}.`;
    if (!best || moves < best.moves) {
      try { localStorage.setItem('twilight-mm-best', JSON.stringify({ moves })); } catch (e) {}
      msg += best ? ' New best — Alice saw that coming.' : ' Alice saw that coming.';
    }
    $('mmStatus').textContent = msg; $('mmStatus').className = 'status win';
    showBest();
  }

  $('mmRestart').addEventListener('click', deal);
  deal();
})();

/* ---------- Quote & meme quiz ---------- */
(() => {
  const QUESTIONS = [
    { kind: 'Quote', prompt: '“Hold on tight, spider monkey.”', answer: 'Edward', film: 'Twilight (2008)', note: 'Said right before the treetop run. Possibly the most quoted line in the saga.' },
    { kind: 'Quote', prompt: '“Bella, where the hell have you been, loca?”', answer: 'Jacob', film: 'New Moon (2009)', note: 'A real line from the film that became one of the internet’s favourite memes.' },
    { kind: 'Moment', prompt: 'Who pitches in the thunderstorm baseball game?', answer: 'Alice', film: 'Twilight (2008)', note: 'Set to Muse’s “Supermassive Black Hole”, and endlessly re-edited on TikTok.' },
    { kind: 'Quote', prompt: '“This is the skin of a killer, Bella.”', answer: 'Edward', film: 'Twilight (2008)', note: 'Delivered while sparkling in the meadow sunlight.' },
    { kind: 'Quote', prompt: '“Say it. Out loud.”', answer: 'Edward', film: 'Twilight (2008)', note: 'The forest confrontation where Bella finally names what he is.' },
    { kind: 'Meme', prompt: 'Sitting in a chair by the window while the months roll past outside.', answer: 'Bella', film: 'New Moon (2009)', note: 'The heartbreak montage that every breakup meme borrows.' },
    { kind: 'Meme', prompt: 'Takes his shirt off to dab a cut on Bella’s forehead.', answer: 'Jacob', film: 'New Moon (2009)', note: 'The moment Team Jacob was born.' },
    { kind: 'Quote', prompt: '“What a stupid lamb.”', answer: 'Bella', film: 'Twilight (2008)', note: 'Her reply to the lion-and-lamb line, which Edward answers in kind.' },
    { kind: 'Moment', prompt: 'Who asks whether Jacob owns a shirt?', answer: 'Edward', film: 'Eclipse (2010)', note: 'Said in the tent scene, to nobody’s surprise.' },
    { kind: 'Meme', prompt: 'The baby whose computer-generated face became a meme of its own.', answer: 'Renesmee', film: 'Breaking Dawn – Part 2 (2012)', note: 'Fans still bring up the CGI baby every rewatch.' },
    { kind: 'Moment', prompt: 'Who orders the mushroom ravioli in Port Angeles?', answer: 'Bella', film: 'Twilight (2008)', note: 'Now a staple of Twilight-themed dinner parties.' },
    { kind: 'Quote', prompt: '“You’re like my own personal brand of heroin.”', answer: 'Edward', film: 'Twilight (2008)', note: 'Romance, as interpreted by a 104-year-old.' }
  ];
  const CAST = ['Edward', 'Bella', 'Jacob', 'Alice', 'Charlie', 'Emmett', 'Rosalie', 'Jasper', 'Aro', 'Renesmee'];
  const RANKS = [
    [12, 'Volturi-level. You know this saga a little too well.'],
    [9, 'Fully Cullen. Alice saw this score coming.'],
    [6, 'Honorary member of the wolf pack.'],
    [3, 'Visiting Forks for the first time. Welcome.'],
    [0, 'Pure human. Time for a rewatch.']
  ];

  const card = document.getElementById('quizCard');
  if (!card) return;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let order = [], i = 0, score = 0;

  function start() { order = shuffle(QUESTIONS); i = 0; score = 0; show(); }

  function show() {
    const q = order[i];
    const options = shuffle([q.answer, ...shuffle(CAST.filter(c => c !== q.answer)).slice(0, 3)]);
    card.innerHTML = `
      <div class="qz-meta"><span>Question ${i + 1} of ${order.length}</span><span>Score ${score}</span></div>
      <div class="qz-bar"><span style="width:${(i / order.length) * 100}%"></span></div>
      <p class="qz-kind">${q.kind}</p>
      <p class="qz-prompt">${q.prompt}</p>
      <p class="qz-ask">${q.kind === 'Moment' ? 'Pick the character.' : 'Who is it?'}</p>
      <div class="qz-options">${options.map(o => `<button type="button" class="qz-option">${o}</button>`).join('')}</div>
      <div class="qz-slot"></div>`;
    card.querySelectorAll('.qz-option').forEach(b => b.addEventListener('click', () => answer(b, q)));
  }

  function answer(btn, q) {
    // Wrong: shake it, turn it red, and let them try again
    if (btn.textContent !== q.answer) {
      btn.classList.add('wrong');
      btn.disabled = true;
      return;
    }

    // Right: turn it green, show the film for a moment, then move on by itself
    const misses = card.querySelectorAll('.qz-option.wrong').length;
    card.querySelectorAll('.qz-option').forEach(b => { b.disabled = true; });
    btn.classList.add('right');
    if (misses === 0) score++; // only first-try answers score a point
    card.querySelector('.qz-meta span:last-child').textContent = `Score ${score}`;

    const verdict = misses === 0 ? 'Correct.' : `Got it on try ${misses + 1}. No point this time.`;
    card.querySelector('.qz-slot').innerHTML = `
      <div class="qz-reveal">
        <p><b>${verdict}</b> <span class="qz-film">${q.film}</span></p>
        <p class="qz-note">${q.note}</p>
      </div>`;

    const AUTO_NEXT_MS = 1800; // how long to wait before the next question (1000 = 1 second)
    setTimeout(() => {
      if (i === order.length - 1) finish();
      else { i++; show(); }
    }, AUTO_NEXT_MS);
  }

  function finish() {
    const rank = RANKS.find(([min]) => score >= min)[1];
    card.innerHTML = `
      <div class="qz-bar"><span style="width:100%"></span></div>
      <p class="qz-kind">Final score</p>
      <p class="qz-score">${score}<small> / ${order.length}</small></p>
      <p class="qz-rank">${rank}</p>
      <button type="button" class="qz-restart">Play again</button>`;
    card.querySelector('.qz-restart').addEventListener('click', start);
  }

  start();
})();

/* ---------- Drifting forest background ---------- */
(() => {
  const root = document.documentElement;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let travel = 0, ticking = false;

  // How far the photo can slide = its height minus the screen height
  function size() {
    const w = window.innerWidth, h = window.innerHeight;
    const photoH = Math.max(w * 1726 / 1600, h * 1.25);
    travel = still ? 0 : Math.max(0, photoH - h);
    move();
  }
  // Top of the page shows the top of the photo, bottom of the page shows the bottom
  function move() {
    ticking = false;
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, window.scrollY / max);
    root.style.setProperty('--bg-shift', `${(progress * travel).toFixed(1)}px`);
  }

  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  window.addEventListener('resize', size);
  window.addEventListener('load', size);
  size();
})();