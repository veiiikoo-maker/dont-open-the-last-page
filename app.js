const $ = selector => document.querySelector(selector);
const soundtrack = $('#soundtrack');
// Storage is optional: private browsing must not prevent entry.
const memoryKey = 'xartwellixa.diary.v1';
let memory = {visits:0,lastNote:null,secretOpens:0};
try { const saved=JSON.parse(localStorage.getItem(memoryKey)); if(saved && typeof saved==='object') memory={visits:Number(saved.visits)||0,lastNote:Number.isInteger(saved.lastNote)?saved.lastNote:null,secretOpens:Number(saved.secretOpens)||0}; } catch {}
const returning = memory.visits > 0;
function remember(){try{localStorage.setItem(memoryKey,JSON.stringify(memory));}catch{}}
if(returning){$('.entry-small').textContent='ты опять здесь.';$('.entry-bottom').textContent='я оставила всё так, как ты оставил.';}
let entered = false;
soundtrack.volume = .38;
soundtrack.addEventListener('error', () => { $('#audio-caption').textContent = 'ЗАПИСЬ НЕ НАЙДЕНА'; });
$('#enter').addEventListener('click', () => {
  if (entered) return;
  entered = true;
  memory.visits++; remember();
  soundtrack.play().then(() => { $('#audio-caption').innerHTML = 'SAYO-NARA <span class="credit">/ SLOWED + REVERB</span>'; }).catch(() => { $('#audio-caption').textContent = 'ЗАПИСЬ НЕ НАЙДЕНА'; });
  $('#site').inert = false;
  $('#entrance').classList.add('leaving');
  setTimeout(() => { $('#entrance').hidden = true; $('.wordmark').focus({preventScroll:true}); }, 1200);
});
let toastTimer;
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
$('#discord').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('836284250646249512'); toast('ID скопирован. Не потеряй.'); $('#copy-label').textContent='теперь он у тебя'; }
  catch { $('#copy-fallback').hidden=false; $('#discord-value').focus(); $('#discord-value').select(); }
});
const notes = [
  {meta:'01 / 03:17 / НЕ ОТПРАВЛЕНО',title:'я снова не сплю.',paragraphs:['В комнате ничего не изменилось. Я проверяла. Стул на месте. Дверь закрыта. Но каждый раз, когда я отворачиваюсь, мне кажется, что кто-то делает шаг.','Самое страшное — я уже не уверена, что жду тишины. В тишине слишком хорошо слышно собственную голову.','Если утром я напишу «всё нормально», это значит только то, что наступило утро.'],foot:'на обороте несколько раз написано одно слово. всё зачёркнуто.'},
  {meta:'02 / ДАТА СТЁРТА',title:'пожалуйста, не исчезай.',paragraphs:['Иногда в голову приходит: «лучше бы меня не было». Эта мысль пугает меня. Я закрываю переписки и сижу перед экраном, пока он не гаснет. В чёрном стекле моё лицо выглядит чужим.','Но потом кто-то пишет «ты тут?» — и я смотрю на эти два слова так долго, будто это единственное, что ещё держит меня в комнате.','Я тут. Просто я не знаю, как об этом сказать.'],foot:'сообщение набрано. сообщение удалено. сообщение набрано.'},
  {meta:'03 / ЧЕРНОВИК / АДРЕСАТ НЕ ВЫБРАН',title:'это не то сообщение.',paragraphs:['Я набрала: «мне страшно оставаться одной со своими мыслями». Стерла. Слишком много правды для маленького белого окна.','Написала: «как дела?» Поставила скобочку, чтобы ты ничего не заметил.','Я не хочу, чтобы ты угадывал. Я хочу однажды суметь сказать прямо: мне плохо. Побудь со мной.'],foot:'последнее изменение: несколько секунд назад. и так всю ночь.'}
];
const dialog = $('#note-dialog');
notes.push({meta:'04 / ПОСЛЕ КОНЦА',title:'я не поставила точку.',paragraphs:['Я оставила эту страницу пустой. Помню, как провела пальцем по бумаге: ни одной буквы.','Теперь здесь написано, что я оставила эту страницу пустой. И про палец тоже написано.','Я ещё не перевернула лист. На другой стороне уже слышно, как пишут.'],foot:'следующая строка оставлена для чужого почерка.'});
let sourceNote;
document.querySelectorAll('[data-note]').forEach(button=>{
  const reply=document.createElement('span');reply.className='note-reply handwritten';reply.textContent='теперь ты тоже знаешь';button.append(reply);
  if(returning && Number(button.dataset.note)===memory.lastNote){button.classList.add('remembered','read');button.querySelector('.note-preview').textContent=notes[memory.lastNote].paragraphs[0];button.querySelector('.note-bottom').firstChild.textContent='ты оставил её открытой ';}
});
document.querySelectorAll('[data-note]').forEach(button => button.addEventListener('click', () => {
  sourceNote=button; const note=notes[Number(button.dataset.note)];
  memory.lastNote=Number(button.dataset.note);remember();button.classList.remove('answered','remembered');
  $('#note-meta').textContent=note.meta; $('#note-title').textContent=note.title;
  $('#note-content').replaceChildren(...note.paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
  const foot=document.createElement('p');foot.className='typed';foot.textContent=note.foot;$('#note-content').append(foot);
  button.classList.add('read'); button.querySelector('.note-bottom').firstChild.textContent='ты это прочитал ';
  dialog.showModal(); $('#close-note').focus();
}));
$('#close-note').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click', event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{sourceNote?.classList.add('answered');sourceNote?.focus({preventScroll:true});});
let seconds=0;
setInterval(()=>{if(!entered||document.hidden)return;seconds++;$('#clock').textContent=[Math.floor(seconds/60),seconds%60].map(n=>String(n).padStart(2,'0')).join(':');if(seconds%38===0&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){const lines=['не всё нужно было сохранять.','ты читаешь медленнее, чем я ожидала.','эта страница помнит, где ты остановился.','я всё ещё здесь.'];$('#footer-message').textContent=lines[Math.floor(seconds/38)%lines.length];}},1000);
document.addEventListener('visibilitychange',()=>{if(entered)document.title=document.hidden?'ты ещё вернёшься?':'xartwellixa — со мной всё хорошо';});


const underneath = $('#underneath');
const secretTrigger = $('#secret-trigger');
let revealTimer;
secretTrigger.addEventListener('click', () => {
  if (underneath.open) return;
  memory.secretOpens++;remember();
  underneath.classList.toggle('pills-missing',memory.secretOpens>1);
  underneath.classList.add('revealing');
  underneath.showModal();
  underneath.scrollTop = 0;
  $('#close-underneath').focus({preventScroll:true});
  clearTimeout(revealTimer);
  revealTimer = setTimeout(() => underneath.classList.remove('revealing'), 2300);
});

// Hold on the blank paper; scrolling or leaving always releases it.
const paperHold=$('#paper-hold');
let holdTimer;
function releasePaper(){clearTimeout(holdTimer);paperHold.classList.remove('pressed','translucent');paperHold.setAttribute('aria-pressed','false');}
function pressPaper(){clearTimeout(holdTimer);paperHold.classList.add('pressed');holdTimer=setTimeout(()=>{paperHold.classList.add('translucent');paperHold.setAttribute('aria-pressed','true');},450);}
paperHold.addEventListener('pointerdown',event=>{if(event.button===0)pressPaper();});
['pointerup','pointercancel','pointerleave','blur'].forEach(type=>paperHold.addEventListener(type,releasePaper));
paperHold.addEventListener('keydown',event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();if(!event.repeat)pressPaper();}});
paperHold.addEventListener('keyup',releasePaper);
window.addEventListener('blur',releasePaper);
document.addEventListener('visibilitychange',()=>{if(document.hidden)releasePaper();});
const falseEnd=$('#false-end');
let endingTimer,endingInView=false,endingShown=false;
function scheduleEnding(){clearTimeout(endingTimer);if(!entered||!endingInView||endingShown||document.hidden||document.querySelector('dialog[open]'))return;endingTimer=setTimeout(()=>{endingShown=true;falseEnd.classList.add('discovered');$('.last-discovery').inert=false;},3200);}
const endingObserver=new IntersectionObserver(entries=>{endingInView=entries[0].isIntersecting;scheduleEnding();},{threshold:.25});
endingObserver.observe(falseEnd);
$('#enter').addEventListener('click',scheduleEnding);
document.addEventListener('visibilitychange',scheduleEnding);
[dialog,underneath].forEach(modal=>modal.addEventListener('close',scheduleEnding));
document.querySelectorAll('[aria-haspopup="dialog"]').forEach(button=>button.addEventListener('click',()=>clearTimeout(endingTimer)));
if(returning && memory.lastNote===3){endingShown=true;falseEnd.classList.add('discovered');$('.last-discovery').inert=false;}
$('#close-underneath').addEventListener('click', () => underneath.close());
underneath.addEventListener('close', () => {
  clearTimeout(revealTimer);
  underneath.classList.remove('revealing');
  secretTrigger.focus({preventScroll:true});
});
const fragments = [
  ['я уже читала эту строку.', 'в прошлый раз здесь было другое слово.', 'я уже читала эту строку. дважды.'],
  ['между 03:16 и 03:17 была ещё одна минута.', 'все часы остановились. только мысли идут.', 'я записала время. бумага его не помнит.'],
  ['кто дописывает за мной?', 'почерк мой. я проверила каждую букву.', 'последнее предложение написано на обороте.']
];
document.querySelectorAll('[data-fragment]').forEach(button => {
  let step = 0;
  button.addEventListener('click', () => {
    const lines = fragments[Number(button.dataset.fragment)];
    step = (step + 1) % lines.length;
    button.querySelector('strong').textContent = lines[step];
    button.querySelector('small').textContent = 'перечитано / ' + String(step + 1).padStart(2,'0');
    button.classList.remove('changed');
    void button.offsetWidth;
    button.classList.add('changed');
    $('#fragment-status').textContent = lines[step];
  });
});


