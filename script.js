/* ---------- Game clock ----------
   Counts only while its game is on screen and the tab is open,
   stops for good when the game is finished, and restarts with a new game.
   So walking away, resting between games or checking the leaderboard is free. */
function Stopwatch(section) {
  let total = 0, since = 0, running = false, onScreen = false;
  const live = () => running && onScreen && !document.hidden;
  const bank = () => { if (since) { total += Date.now() - since; since = 0; } };
  const sync = () => { if (live()) { if (!since) since = Date.now(); } else bank(); };
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.25 }).observe(section);
  document.addEventListener('visibilitychange', sync);
  return {
    start() { if (!running) { running = true; sync(); } },
    stop() { bank(); running = false; },
    reset() { total = 0; since = 0; running = false; },
    seconds() { return (total + (since ? Date.now() - since : 0)) / 1000; },
    get running() { return running; }
  };
}

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
  if(all){st.textContent='Solved. Somewhere in Forks, Edward is sparkling with pride.';st.className='status win';
    if(!xwSent){xwSent=true;xwClock.stop();const secs=Math.round(xwClock.seconds());const solved=P.entries.length-xwRevealed.size;
      const pts=Math.max(0,solved*100+Math.max(0,900-secs));
      document.dispatchEvent(new CustomEvent('forks:score',{detail:{game:'crossword',title:'Crossword solved',points:pts,seconds:secs,rows:[['Words solved yourself',solved+' of '+P.entries.length],['Words revealed',String(xwRevealed.size)],['Speed bonus','+'+Math.max(0,900-secs)],['Time',Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0')]]}}));}}
  else if(st.classList.contains('win')){st.textContent='';st.className='status'}
}
const xwClock=Stopwatch(document.getElementById('crossword'));let xwSent=false;const xwRevealed=new Set();
document.getElementById('grid').addEventListener('focusin',()=>{if(!xwSent)xwClock.start()});
function save(){const o={};for(const k in inputs)if(inputs[k].value)o[k]=inputs[k].value;try{localStorage.setItem('twilight-xw',JSON.stringify(o))}catch(e){}}
document.getElementById('check').onclick=()=>{let wrong=0,empty=0;
  for(const k in inputs){const[r,c]=k.split(',');const v=inputs[k].value;const d=inputs[k].parentNode;
    if(!v){empty++;continue}if(v!==sol[r][c]){d.classList.add('wrong');wrong++}}
  const st=document.getElementById('status');
  if(!wrong&&!empty){refresh();return}
  st.className='status';st.textContent=wrong?`${wrong} square${wrong>1?'s':''} marked in red. ${empty?empty+' still empty.':''}`:`Everything so far is right. ${empty} square${empty>1?'s':''} to go.`;};
document.getElementById('revealWord').onclick=()=>{const w=word();const st=document.getElementById('status');
  if(!w){st.className='status';st.textContent='Pick a square first, then reveal its word.';return}
  if(w.cells.some(([r,c])=>inputs[r+','+c].value!==sol[r][c]))xwRevealed.add(w.id);
  w.cells.forEach(([r,c])=>{const i=inputs[r+','+c];if(i.value!==sol[r][c]){i.value=sol[r][c];i.parentNode.classList.add('revealed')}i.parentNode.classList.remove('wrong')});save();refresh();};
document.getElementById('clear').onclick=()=>{if(!confirm('Clear every square?'))return;for(const k in inputs){inputs[k].value='';inputs[k].parentNode.classList.remove('wrong','revealed')}save();xwClock.reset();xwSent=false;xwRevealed.clear();document.getElementById('status').textContent='';refresh();};
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
  let first = null, lock = false, moves = 0, pairs = 0, timer = null;
  const clock = Stopwatch(document.getElementById('memory'));

  const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function loadBest() { try { return JSON.parse(localStorage.getItem('twilight-mm-best')); } catch (e) { return null; } }
  function showBest() { const b = loadBest(); $('mmBest').textContent = b ? `${b.moves} moves` : '–'; }

  function deal() {
    clearInterval(timer); timer = null; clock.reset();
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
      clock.start();
      timer = setInterval(() => { $('mmTime').textContent = fmt(Math.floor(clock.seconds())); }, 500);
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
    clearInterval(timer); timer = null; clock.stop();
    const secs = Math.floor(clock.seconds());
    $('mmTime').textContent = fmt(secs);
    const best = loadBest();
    let msg = `All eight pairs in ${moves} moves and ${fmt(secs)}.`;
    if (!best || moves < best.moves) {
      try { localStorage.setItem('twilight-mm-best', JSON.stringify({ moves })); } catch (e) {}
      msg += best ? ' New best — Alice saw that coming.' : ' Alice saw that coming.';
    }
    $('mmStatus').textContent = msg; $('mmStatus').className = 'status win';
    showBest();
    // Points: start at 1,000, lose 25 per extra move (8 is perfect) and 3 per second
    const pts = Math.max(100, 1000 - Math.max(0, moves - 8) * 25 - secs * 3);
    document.dispatchEvent(new CustomEvent('forks:score', { detail: {
      game: 'memory', title: 'All pairs found', points: pts, seconds: secs,
      rows: [['Moves', String(moves)], ['Time', fmt(secs)]] } }));
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
  let order = [], i = 0, score = 0, points = 0, bonus = 0, qStart = 0;
  const clock = Stopwatch(document.getElementById('quiz')); // only runs while the quiz is on screen

  function start() { order = shuffle(QUESTIONS); i = 0; score = 0; points = 0; bonus = 0; clock.reset(); clock.start(); show(); }

  function show() {
    const q = order[i];
    const options = shuffle([q.answer, ...shuffle(CAST.filter(c => c !== q.answer)).slice(0, 3)]);
    card.innerHTML = `
      <div class="qz-meta"><span>Question ${i + 1} of ${order.length}</span><span>${points} points</span></div>
      <div class="qz-bar"><span style="width:${(i / order.length) * 100}%"></span></div>
      <p class="qz-kind">${q.kind}</p>
      <p class="qz-prompt">${q.prompt}</p>
      <p class="qz-ask">${q.kind === 'Moment' ? 'Pick the character.' : 'Who is it?'}</p>
      <div class="qz-options">${options.map(o => `<button type="button" class="qz-option">${o}</button>`).join('')}</div>
      <div class="qz-slot"></div>`;
    card.querySelectorAll('.qz-option').forEach(b => b.addEventListener('click', () => answer(b, q)));
    qStart = clock.seconds();
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
    // Points: 100 for a first try plus up to 50 for answering within 15 seconds, 40 for a second try
    const took = clock.seconds() - qStart;
    if (misses === 0) {
      score++;
      const b = Math.round(50 * Math.max(0, 1 - took / 15));
      bonus += b; points += 100 + b;
    } else if (misses === 1) points += 40;
    card.querySelector('.qz-meta span:last-child').textContent = `${points} points`;

    const verdict = misses === 0 ? 'Correct.' : misses === 1 ? 'Got it on try 2. A few points.' : `Got it on try ${misses + 1}. No points this time.`;
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
    clock.stop();
    const secs = Math.round(clock.seconds());
    document.dispatchEvent(new CustomEvent('forks:score', { detail: {
      game: 'quiz', title: 'Quiz done', points, seconds: secs,
      rows: [['Correct first try', `${score} of ${order.length}`], ['Speed bonus', `+${bonus}`],
             ['Time', `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`]] } }));
  }

  start();
})();

/* ---------- Pointing finger: "tap the crossword" hint ---------- */
(() => {
  const CYCLE_MS = 4500; // one glide + hover + tap; keep equal to the 4.5s in style.css

  const grid = document.getElementById('grid');
  if (!grid) return;
  const cells = [...grid.children];
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const rows = Math.ceil(cells.length / cols);
  // Squares with a clue number are where a word starts: the finger visits a few of them
  const stops = cells.filter(c => c.querySelector('.n')).slice(0, 6).map(c => {
    const i = cells.indexOf(c);
    return { cell: c, left: `${((i % cols) + 0.5) / cols * 100}%`, top: `${(Math.floor(i / cols) + 0.5) / rows * 100}%` };
  });
  if (!stops.length) return;

  // Glossy white hand with red claws and sparkles, drawn here so it looks the same on every device
  const HAND = `
      <svg aria-hidden="true" viewBox="-10 -12 56 66">
      <defs>
      <linearGradient id="handFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".6" stop-color="#f1f5f4"/>
      <stop offset="1" stop-color="#cdd9d6"/>
      </linearGradient>
      <linearGradient id="nailFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff4a5c"/>
      <stop offset=".5" stop-color="#c8102e"/>
      <stop offset="1" stop-color="#6e0414"/>
      </linearGradient>
      </defs>
      <path d="M9.4 4.6 A3.6 3.6 0 0 1 16.6 4.6 V19 A2.7 2.7 0 0 1 22 19 V20.5 A3 3 0 0 1 28 20.5 V23 A2.5 2.5 0 0 1 33 23 V33 C33 39 30.5 43 26.5 44.5 V48 H14 V44.5 C10.5 42.5 7.5 39 5.5 34 L2.6 27.6 A2.7 2.7 0 0 1 7.3 25 L9.4 29.5 Z"
      fill="url(#handFill)" stroke="#1b2e2b" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M16.6 19 V25.5 M22 20.5 V26 M28 23 V27.5" fill="none" stroke="#1b2e2b" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M14 44.5 H26.5" fill="none" stroke="#1b2e2b" stroke-width="1.4"/>
      <path d="M11.8 5.5 V24" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M10.1 7.2 C10 3 11.4 -2.5 13 -7.5 C14.6 -2.5 16 3 15.9 7.2 C14.1 8.3 11.9 8.3 10.1 7.2 Z" fill="url(#nailFill)" stroke="#1b2e2b" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M11.9 5.5 C11.9 2.5 12.4 -0.5 13.1 -3.2" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".85"/>
      <g transform="translate(5.1 27.2) rotate(-26) scale(.72) translate(-13 -6)">
      <path d="M10.1 7.2 C10 3 11.4 -2.5 13 -7.5 C14.6 -2.5 16 3 15.9 7.2 C14.1 8.3 11.9 8.3 10.1 7.2 Z" fill="url(#nailFill)" stroke="#1b2e2b" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M11.9 5.5 C11.9 2.5 12.4 -0.5 13.1 -3.2" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".85"/>
      </g>
      <g class="sparkles" stroke="#2a4441" stroke-width=".8" stroke-linejoin="round"><path class="sp sp1" d="M24 -8.5 C24.99 -3.99 24.99 -3.99 29.5 -3 C24.99 -2.01 24.99 -2.01 24 2.5 C23.01 -2.01 23.01 -2.01 18.5 -3 C23.01 -3.99 23.01 -3.99 24 -8.5 Z" fill="#fff" opacity="1"/><path class="sp sp2" d="M2 -9.6 C2.648 -6.648 2.648 -6.648 5.6 -6 C2.648 -5.352 2.648 -5.352 2 -2.4 C1.3519999999999999 -5.352 1.3519999999999999 -5.352 -1.6 -6 C1.3519999999999999 -6.648 1.3519999999999999 -6.648 2 -9.6 Z" fill="#fff" opacity="0.9"/><path class="sp sp3" d="M31 6 C31.54 8.46 31.54 8.46 34 9 C31.54 9.54 31.54 9.54 31 12 C30.46 9.54 30.46 9.54 28 9 C30.46 8.46 30.46 8.46 31 6 Z" fill="#fff" opacity="0.85"/><path class="sp sp4" d="M-4 8.6 C-3.568 10.568 -3.568 10.568 -1.6 11 C-3.568 11.432 -3.568 11.432 -4 13.4 C-4.432 11.432 -4.432 11.432 -6.4 11 C-4.432 10.568 -4.432 10.568 -4 8.6 Z" fill="#fff" opacity="0.75"/><circle class="sp sp5" cx="18" cy="-9" r="1" fill="#fff" opacity=".8"/><circle class="sp sp6" cx="35" cy="1" r=".9" fill="#fff" opacity=".7"/></g>
      </svg>`;

  const hint = document.createElement('div');
  hint.className = 'tap-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML = `<span class="tap-ring"></span><span class="tap-hand">${HAND}</span>`;
  let n = 0;
  // Move to the next word start, skipping any square that is part of the word being solved
  const busy = cell => cell.classList.contains('inword') || cell.classList.contains('focus');
  const go = () => {
    for (let tries = 0; tries < stops.length; tries++) {
      const s = stops[n % stops.length]; n++;
      if (!busy(s.cell)) { hint.style.left = s.left; hint.style.top = s.top; return; }
    }
  };
  go();
  grid.appendChild(hint);
  let timer = setInterval(go, CYCLE_MS);

  // Hovering the mouse over the square the finger is on makes it drift off to the next one
  grid.addEventListener('mouseover', e => {
    const current = stops[(n - 1) % stops.length].cell;
    if (current.contains(e.target)) { clearInterval(timer); go(); timer = setInterval(go, CYCLE_MS); }
  });

  // Gone for good the moment someone taps or clicks a square
  // Clicking or tapping a square never hides the finger: it just floats away from that word
  grid.addEventListener('focusin', () => {
    setTimeout(() => {
      const current = stops[(n - 1 + stops.length) % stops.length].cell;
      if (busy(current)) { clearInterval(timer); go(); timer = setInterval(go, CYCLE_MS); }
    }, 0);
  });
})();

/* ---------- Floating finger on the memory cards and the quiz answers ---------- */
(() => {
  const CYCLE_MS = 4500; // same rhythm as the crossword finger and the 4.5s in style.css
  const source = document.querySelector('.tap-hand svg');
  if (!source) return;
  let uid = 0;

  // Copy the crossword's clawed hand, giving its colour gradients unique names
  function handCopy() {
    uid++;
    return source.outerHTML
      .replace(/id="(handFill|nailFill)"/g, (m, id) => `id="${id}${uid}"`)
      .replace(/url\(#(handFill|nailFill)\)/g, (m, id) => `url(#${id}${uid})`);
  }

  // container: where the finger lives; targets(): what it may point at right now
  function addFinger(container, targets) {
    const hint = document.createElement('div');
    hint.className = 'tap-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = `<span class="tap-ring"></span><span class="tap-hand">${handCopy()}</span>`;
    container.appendChild(hint);
    let current = null, n = 0, timer = null;

    function go(avoid) {
      const list = targets().filter(el => el !== avoid && el !== current);
      const pool = list.length ? list : targets().filter(el => el !== avoid);
      if (!pool.length) { if (!hint.classList.contains('gone')) hint.classList.add('gone'); current = null; return; }
      if (hint.classList.contains('gone')) hint.classList.remove('gone');
      current = pool[n++ % pool.length];
      const box = container.getBoundingClientRect(), r = current.getBoundingClientRect();
      hint.style.left = `${r.left - box.left + r.width / 2}px`;
      hint.style.top = `${r.top - box.top + r.height / 2}px`;
    }
    function restart(avoid) { clearInterval(timer); go(avoid); timer = setInterval(go, CYCLE_MS); }

    // Hovering or clicking where the finger is makes it float off somewhere else
    container.addEventListener('mouseover', e => { if (current && current.contains(e.target)) restart(current); });
    container.addEventListener('click', e => {
      const hit = targets().find(el => el.contains(e.target)) || e.target.closest('button');
      setTimeout(() => restart(hit), 0);
    });
    // New question, new deal or a card flipping: pick a fresh spot.
    // Changes to the finger itself are ignored, and checks are bundled into one per frame,
    // otherwise the finger hiding itself would trigger itself again forever and freeze the page.
    let queued = false;
    new MutationObserver(records => {
      if (records.every(r => hint.contains(r.target))) return;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const list = targets();
        if (!current || !list.includes(current)) {
          if (!list.length && !current) return; // nothing to point at and already hidden
          restart();
        }
      });
    }).observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'disabled'] });
    window.addEventListener('resize', () => restart());
    restart();
  }

  // Memory match: face-down cards; once all pairs are found, the restart button
  const memory = document.getElementById('memory');
  if (memory) addFinger(memory, () => {
    const cards = [...memory.querySelectorAll('.mm-card:not(.flipped):not(.matched)')];
    return cards.length ? cards : [document.getElementById('mmRestart')].filter(Boolean);
  });

  // Quiz: answers still open to pick (it visits them in order, so it never gives one away);
  // on the score screen, the Play again button
  const quiz = document.getElementById('quiz');
  if (quiz) addFinger(quiz, () => {
    const open = [...quiz.querySelectorAll('.qz-option:not(:disabled)')];
    return open.length ? open : [...quiz.querySelectorAll('.qz-restart')];
  });
})();

/* ---------- Drifting forest background ---------- */
(() => {
  // Same address as --forest-bg at the bottom of style.css
  const BG_URL = 'https://images.unsplash.com/photo-1511207538754-e8555f2bc187?fm=jpg&q=85&w=2400&auto=format';
  // The trees fill roughly the top 60% of this photo; the rest is near-black.
  // The page never scrolls past this point, so the forest never runs out.
  const TREES_END = 0.6;

  const root = document.documentElement;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ratio = 0.5625;          // width / height, replaced once the photo loads
  let boxH = 0, travel = 0, ticking = false;

  const img = new Image();
  img.onload = () => { ratio = img.naturalWidth / img.naturalHeight; size(); };
  img.src = BG_URL;

  function size() {
    const w = window.innerWidth, h = window.innerHeight;
    // tall enough that the tree part always covers the screen
    boxH = Math.max(w / ratio, h / TREES_END);
    travel = still ? 0 : Math.max(0, boxH * TREES_END - h);
    root.style.setProperty('--bg-h', `${Math.ceil(boxH)}px`);
    move();
  }
  // Top of the page = top of the forest, bottom of the page = where the trees end
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

/* ---------- Shared leaderboard (Supabase) ---------- */
(() => {
  const SUPABASE_URL = 'https://bapatlwmmxngqxrvssqz.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_nu0ZulghbbiXvmm7BmA1wg_Y9Qq-96R'; // public key, safe in a website

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const nth = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
  const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  /* --- who is playing --- */
  let player = '';
  try { player = localStorage.getItem('forks-player') || ''; } catch (e) {}
  const pill = $('whoPill');
  function showPill() { pill.hidden = !player; pill.textContent = `Playing as ${player} · change`; }
  function askName() { $('nameInput').value = player; $('nameDlg').hidden = false; setTimeout(() => $('nameInput').focus(), 50); }
  $('nameForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('nameInput').value.trim().slice(0, 30);
    if (!v) return;
    player = v;
    try { localStorage.setItem('forks-player', player); } catch (err) {}
    $('nameDlg').hidden = true; showPill(); load();
  });
  pill.addEventListener('click', askName);
  // Ask once, when someone first enters the forest
  document.querySelector('.enter').addEventListener('click', () => { if (!player) askName(); });
  showPill();

  /* --- leaderboard --- */
  let tab = 'total', rows = [];
  document.querySelectorAll('.lb-tab').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.lb-tab').forEach(x => x.classList.toggle('on', x === b));
    tab = b.dataset.game; render();
  }));

  // Best try per player for one game, worked out in the browser
  function bestPerPlayer(game) {
    const best = {};
    rows.filter(r => r.game === game).forEach(r => {
      const b = best[r.player];
      if (!b || r.points > b.points || (r.points === b.points && r.seconds < b.seconds)) best[r.player] = r;
    });
    return Object.values(best).sort((a, b) => b.points - a.points || a.seconds - b.seconds);
  }
  let totals = [];
  function render() {
    const list = tab === 'total'
      ? totals.map(t => ({ player: t.player, points: t.total_points, sub: `${t.games} game${t.games > 1 ? 's' : ''}` }))
      : bestPerPlayer(tab).map(r => ({ player: r.player, points: r.points, sub: fmtTime(r.seconds) }));
    $('lbList').innerHTML = list.length
      ? list.map((r, k) => `<li class="lb-row${r.player === player ? ' me' : ''}"><span class="lb-rank">${k + 1}</span><span class="lb-name">${esc(r.player)} <small>${r.sub}</small></span><span class="lb-pts">${Number(r.points).toLocaleString('en')}</span></li>`).join('')
      : '<li class="lb-empty">No scores yet. Finish a game to get on the board.</li>';
  }
  async function load() {
    if (!db) { $('lbLive').textContent = 'Leaderboard offline'; return; }
    const [a, b] = await Promise.all([
      db.from('leaderboard').select('*'),          // the SQL view: best per game, added up
      db.from('scores').select('player, game, points, seconds')
    ]);
    if (a.error || b.error) { $('lbLive').textContent = 'Could not reach the leaderboard'; return; }
    totals = a.data; rows = b.data;
    $('lbLive').textContent = '● Live';
    render();
  }
  function placeOf(name) { const k = totals.findIndex(t => t.player === name); return k < 0 ? '' : `You're ${nth(k + 1)} of ${totals.length} overall.`; }

  /* --- a game finished: show the score, save it --- */
  document.addEventListener('forks:score', async e => {
    const d = e.detail;
    $('sdTitle').textContent = d.title;
    $('sdPoints').textContent = Number(d.points).toLocaleString('en');
    $('sdRows').innerHTML = d.rows.map(([k, v]) => `<p><span>${esc(k)}</span><b>${esc(v)}</b></p>`).join('');
    $('sdPlace').textContent = 'Saving your score…';
    $('scoreDlg').hidden = false;
    if (!player) { $('sdPlace').textContent = 'Add your name to save this score.'; askName(); return; }
    if (!db) { $('sdPlace').textContent = 'Leaderboard offline, score not saved.'; return; }
    const { error } = await db.from('scores').insert({
      player, game: d.game,
      points: Math.max(0, Math.min(5000, Math.round(d.points))),
      seconds: Math.max(0, Math.min(7200, Math.round(d.seconds)))
    });
    if (error) { $('sdPlace').textContent = 'Could not save the score. Check the connection.'; return; }
    await load();
    $('sdPlace').textContent = placeOf(player) || 'Saved.';
  });
  $('sdClose').addEventListener('click', () => { $('scoreDlg').hidden = true; });
  $('sdBoard').addEventListener('click', () => { $('scoreDlg').hidden = true; $('leaderboard').scrollIntoView({ behavior: 'smooth' }); });

  /* --- live updates: every phone refreshes when anyone adds a score --- */
  if (db) {
    db.channel('scores-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, load)
      .subscribe();
    setInterval(load, 20000); // safety net if live updates drop
  }
  load();
})();
