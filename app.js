const demo = {
  match: {
    id: 'M-1042', guy: 'Aaron Example', girl: 'Leah Example', stage: 'After 2nd date',
    status: 'Both want to continue', started: 'Sep 18',
    next: 'Ask Miriam for the girl’s availability for date 3', nextDue: 'Tomorrow',
    source: 'Miriam Example'
  },
  people: [
    {name:'Aaron Example', initials:'AE', role:'Guy', note:'41 · Safed · profile v3'},
    {name:'Leah Example', initials:'LE', role:'Girl', note:'38 · Jerusalem · profile v2'},
    {name:'Miriam Example', initials:'ME', role:'Shadchan', note:'Suggested this match · primary contact'},
    {name:'David Example', initials:'DE', role:'Friend', note:'Reviewed Leah’s profile before date 1'},
    {name:'Rabbi Example', initials:'RE', role:'Reference', note:'Reference call before date 2'}
  ],
  events: [
    {day:'Today',time:'09:12',type:'feedback',icon:'✓',title:'Feedback relayed to shadchan',line:'You → Miriam Example · WhatsApp',result:'Aaron said date 2 went well and he wants to continue.',next:'Next: wait for Miriam to confirm Leah’s side',detail:'Linked to Aaron, Leah, Miriam and match M-1042. Message was sent after Aaron’s phone call.'},
    {day:'Yesterday',time:'22:40',type:'feedback',icon:'💬',title:'Post-date feedback received',line:'Aaron Example → You · Call',result:'Positive. Conversation felt easier than date 1. Wants another date.',next:'Created follow-up: update Miriam',detail:'Call lasted about 18 minutes. Private note can live here without changing Aaron’s permanent profile.'},
    {day:'Yesterday',time:'19:00',type:'date',icon:'◆',title:'Date 2 happened',line:'Aaron Example ↔ Leah Example',result:'Status: completed · outcome pending feedback',next:'Collect both sides’ feedback',detail:'Jerusalem. Scheduled three days earlier through Miriam. This date has separate feedback fields for each side.'},
    {day:'Oct 1',time:'16:18',type:'reply',icon:'↩',title:'Leah’s side agreed to date 2',line:'Miriam Example → You · WhatsApp',result:'Result: yes, continue',next:'Date 2 scheduled for Oct 3',detail:'Reply closes the previous “waiting for answer” item automatically.'},
    {day:'Sep 30',time:'12:05',type:'message',icon:'➜',title:'Date 1 feedback sent',line:'You → Miriam Example · WhatsApp',result:'Aaron is interested in continuing.',next:'Waiting for Leah’s answer',detail:'The exact sent message can be preserved here, with its channel and recipient.'},
    {day:'Sep 29',time:'20:00',type:'date',icon:'◆',title:'Date 1 happened',line:'Aaron Example ↔ Leah Example',result:'Good first meeting · Aaron: continue · Leah: pending',next:'Send Aaron feedback to Miriam',detail:'Each date is a structured object but also appears in the chronological ledger.'},
    {day:'Sep 26',time:'10:44',type:'call',icon:'☎',title:'Reference call',line:'You → Rabbi Example · Phone',result:'Positive reference. Calm, serious, good family.',next:'Add reference summary to this match only',detail:'The reference is linked to Leah and this match, without being mixed into Leah’s public profile text.'},
    {day:'Sep 23',time:'14:31',type:'feedback',icon:'👤',title:'Friend reviewed profile',line:'David Example → You · In person',result:'Thought the match sounded reasonable; suggested asking about relocation.',next:'Ask Miriam about location flexibility',detail:'This keeps informal advice visible in the process without pretending it came from the shadchan.'},
    {day:'Sep 20',time:'11:07',type:'profile',icon:'▤',title:'Leah profile package sent to friend',line:'You → David Example · WhatsApp',result:'Sent: profile v2 + one photo',next:'Waiting for David’s opinion',detail:'Profile package v2 identifies the exact text/photo combination that was sent.'},
    {day:'Sep 19',time:'18:22',type:'profile',icon:'▤',title:'Leah profile received',line:'Miriam Example → You · WhatsApp',result:'Received: profile text + PDF + photo',next:'Review profile',detail:'Original sender and original files are preserved. Filing it later does not lose provenance.'},
    {day:'Sep 18',time:'09:40',type:'match',icon:'✦',title:'Shidduch suggested',line:'Miriam Example → You',result:'Aaron Example ↔ Leah Example',next:'Review Leah’s information',detail:'This event created match case M-1042 and connected both people to Miriam as the source.'}
  ],
  assets: [
    {icon:'▤',name:'Leah profile package v2',meta:'Received Sep 19 from Miriam · text + PDF + photo',tag:'USED'},
    {icon:'▤',name:'Aaron profile package v3',meta:'Updated Sep 12 · text + PDF',tag:'CURRENT'},
    {icon:'◉',name:'Leah photo',meta:'Received with profile v2',tag:'PRIVATE'},
    {icon:'▣',name:'Match notes',meta:'Private working notes · not shared',tag:'INTERNAL'}
  ],
  dates: [
    {n:2,when:'Oct 3 · 7:00 PM',status:'Completed',guy:'Went well. Easier conversation. Wants to continue.',girl:'Positive through shadchan. Open to date 3.',outcome:'Continue'},
    {n:1,when:'Sep 29 · 7:30 PM',status:'Completed',guy:'Good first meeting. Interested in continuing.',girl:'Needed a day to think; later said yes.',outcome:'Continue'}
  ]
};

const filters = [
  ['all','All'],['profile','Profiles'],['message','Messages'],['call','Calls'],['date','Dates'],['feedback','Feedback']
];

let currentView = 'ledger';
let ledgerFilter = 'all';
let caseTab = 'activity';

function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function metric(value,label){return `<div class="metric"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`}

function hero(title, subtitle, badge, badgeClass=''){
  return `<section class="hero"><div class="hero-top"><div><div class="eyebrow">${esc(demo.match.id)}</div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div><div class="hero-badge ${badgeClass}">${esc(badge)}</div></div></section>`;
}

function eventHtml(e){
  return `<article class="event" data-type="${esc(e.type)}">
    <div class="event-icon">${esc(e.icon)}</div>
    <button class="event-toggle" type="button"><div class="event-title">${esc(e.title)}</div><div class="event-line">${esc(e.line)}</div><div class="event-result"><b>${esc(e.result.split(':')[0])}${e.result.includes(':')?':':''}</b>${esc(e.result.includes(':')?e.result.slice(e.result.indexOf(':')+1):'')}</div>${e.next?`<div class="event-next">${esc(e.next)}</div>`:''}</button>
    <div class="event-time">${esc(e.time)}</div>
    <div class="event-detail">${esc(e.detail)}</div>
  </article>`;
}

function ledgerHtml(compact=false){
  const items = demo.events.filter(e => ledgerFilter==='all' || e.type===ledgerFilter || (ledgerFilter==='message' && e.type==='reply'));
  let last='';
  return `<div class="ledger">${items.map(e=>{const day=e.day!==last?`<div class="day-label">${esc(e.day)}</div>`:'';last=e.day;return day+eventHtml(e)}).join('')}</div>`;
}

function renderLedger(){
  return `${hero('Activity Ledger','One chronological record of who contacted whom, what moved, the result and the next step.','Bank-style history')}
    <div class="notice">Tap any activity to expand its linked records and context. One event can belong to several people and one match without being copied three times.</div>
    <section class="card"><div class="pair"><div class="person-block"><strong>${demo.match.guy}</strong><span>Guy · profile v3</span></div><div class="heart-link">↔</div><div class="person-block"><strong>${demo.match.girl}</strong><span>Girl · profile v2</span></div></div>
    <div class="summary-grid">${metric('11','linked events')}${metric('2','dates')}${metric('4','people involved')}${metric('Tomorrow','next action')}</div></section>
    <div class="toolbar">${filters.map(([k,l])=>`<button class="chip ${ledgerFilter===k?'active':''}" data-filter="${k}">${l}</button>`).join('')}</div>
    ${ledgerHtml()}`;
}

function personRows(){return demo.people.map(p=>`<div class="person-row"><div class="avatar">${p.initials}</div><div><strong>${p.name}</strong><small>${p.note}</small></div><span class="role">${p.role}</span></div>`).join('')}

function assetsHtml(){return demo.assets.map(a=>`<div class="card asset"><div class="asset-icon">${a.icon}</div><div><strong>${a.name}</strong><small>${a.meta}</small></div><span class="asset-tag">${a.tag}</span></div>`).join('')}

function datesHtml(){return demo.dates.map(d=>`<article class="card date-card"><div class="date-head"><div><div class="date-number">DATE ${d.n}</div><strong>${d.when}</strong></div><span class="chip green">${d.status}</span></div><div class="date-feedback"><div class="quote"><b>AARON FEEDBACK</b>${d.guy}</div><div class="quote"><b>LEAH FEEDBACK</b>${d.girl}</div></div><div class="event-next">Outcome: ${d.outcome}</div></article>`).join('')}

function renderCase(){
  let body='';
  if(caseTab==='activity') body=ledgerHtml(true);
  if(caseTab==='profiles') body=assetsHtml();
  if(caseTab==='dates') body=datesHtml();
  if(caseTab==='people') body=`<div class="people-list">${personRows()}</div>`;
  return `${hero(`${demo.match.guy} + ${demo.match.girl}`,`${demo.match.source} suggested this on ${demo.match.started}. Everything about this one shidduch stays together.`,demo.match.stage)}
    <div class="split"><div>
      <section class="card next-action"><b>Next action · ${demo.match.nextDue}</b>${demo.match.next}</section>
      <div class="case-tabs">${[['activity','Activity'],['profiles','Profiles sent'],['dates','Dates'],['people','People involved']].map(([k,l])=>`<button data-case-tab="${k}" class="${caseTab===k?'active':''}">${l}</button>`).join('')}</div>
      ${body}
    </div><aside class="sticky-side">
      <section class="card"><div class="section-title" style="margin-top:0"><h3>Case summary</h3><span class="chip green">${demo.match.status}</span></div><div class="pair"><div class="person-block"><strong>Aaron</strong><span>Guy</span></div><div class="heart-link">↔</div><div class="person-block"><strong>Leah</strong><span>Girl</span></div></div><div class="summary-grid">${metric('2','dates')}${metric('11','events')}${metric('4','shares')}${metric('1','open follow-up')}</div></section>
      <section class="card"><div class="section-title" style="margin-top:0"><h3>Key people</h3><small>linked</small></div><div class="people-list">${personRows().split('</div></div>').slice(0,3).join('</div></div>')}</div></section>
    </aside></div>`;
}

function renderPeople(){
  return `${hero('People & Connections','Stable profile information stays with the person; match activity and sharing stays linked instead of being pasted into one giant note.','Relationship view')}
    <section class="card"><div class="section-title" style="margin-top:0"><h3>Miriam Example</h3><span class="role">Shadchan</span></div><p class="subtle">Primary shadchan for this example match. The page answers both “what do I know about Miriam?” and “what has passed through Miriam?”</p><div class="summary-grid">${metric('12','profiles received')}${metric('8','profiles sent')}${metric('5','active matches')}${metric('2','waiting replies')}</div></section>
    <div class="split"><div>
      <div class="section-title"><h3>Connection path</h3><small>provenance stays visible</small></div>
      <section class="card"><div class="link-path"><div class="node"><b>Miriam</b><br><span class="subtle">suggested</span></div><div class="arrow">→</div><div class="node"><b>Leah</b><br><span class="subtle">profile v2</span></div><div class="arrow">→</div><div class="node"><b>You</b><br><span class="subtle">reviewed</span></div><div class="arrow">→</div><div class="node"><b>David</b><br><span class="subtle">friend feedback</span></div></div></section>
      <div class="section-title"><h3>What moved through Miriam</h3><small>not just notes</small></div>
      <section class="card connection-card"><div><strong>Leah Example profile v2 → you</strong><div class="meta">Sep 19 · WhatsApp · text + PDF + photo</div></div><div class="connection-actions"><button class="tiny">Open</button></div></section>
      <section class="card connection-card"><div><strong>Aaron feedback → Miriam</strong><div class="meta">Today · WhatsApp · date 2 feedback</div></div><div class="connection-actions"><button class="tiny">Open</button></div></section>
      <section class="card connection-card"><div><strong>Aaron + Leah match</strong><div class="meta">Suggested Sep 18 · now after date 2</div></div><div class="connection-actions"><button class="tiny">Case</button></div></section>
      <div class="section-title"><h3>Miriam activity</h3><small>filtered universal ledger</small></div>${demo.events.filter(e=>e.line.includes('Miriam')).map(eventHtml).join('')}
    </div><aside class="sticky-side"><section class="card"><div class="section-title" style="margin-top:0"><h3>All connected people</h3><small>5 shown</small></div><div class="people-list">${personRows()}</div></section><section class="card"><strong>Why this matters</strong><p class="subtle">A shadchan can send many profiles, receive many profiles, suggest matches and relay feedback. Those are different relationships and should be searchable separately.</p></section></aside></div>`;
}

function renderToday(){
  return `${hero('Today','A task-focused home generated from the same match/activity data. No separate reminder universe to maintain.','6 things need attention','waiting')}
    <div class="summary-grid" style="margin-bottom:14px">${metric('2','overdue')}${metric('2','waiting replies')}${metric('1','date this week')}${metric('3','new intake')}</div>
    <div class="section-title"><h3>Needs action</h3><small>ordered by urgency</small></div>
    <div class="action-grid">
      <article class="action-card urgent"><h4>Call Miriam Example</h4><p>Ask for Leah’s availability for date 3 · Aaron + Leah</p><div class="when">Overdue from yesterday</div><div class="quick"><button>Call</button><button>Open case</button><button>Done</button></div></article>
      <article class="action-card wait"><h4>Waiting for reply</h4><p>David Example is reviewing another profile package.</p><div class="when">Waiting 2 days</div><div class="quick"><button>Message</button><button>Snooze</button></div></article>
      <article class="action-card date"><h4>Prepare date 3</h4><p>Aaron + Leah · confirm schedule after Miriam responds.</p><div class="when">This week</div><div class="quick"><button>Open match</button></div></article>
      <article class="action-card"><h4>File new profile</h4><p>Profile pasted into Intake. Sender is known; person not created yet.</p><div class="when">New today</div><div class="quick"><button>File now</button><button>Later</button></div></article>
    </div>
    <div class="section-title"><h3>Active shidduchim</h3><small>process view</small></div>
    <div class="pipeline"><div class="stage"><h4>Reviewing</h4><div class="mini-case"><strong>Daniel + Sarah</strong><span>Profile received today</span></div></div><div class="stage"><h4>Waiting</h4><div class="mini-case"><strong>Yosef + Rachel</strong><span>Waiting on girl’s side · 2 days</span></div></div><div class="stage"><h4>Dating</h4><div class="mini-case"><strong>Aaron + Leah</strong><span>After date 2 · continue</span></div><div class="mini-case"><strong>Michael + Esther</strong><span>Date 1 tomorrow</span></div></div><div class="stage"><h4>Closed</h4><div class="mini-case"><strong>Example match</strong><span>Ended respectfully · Sep 24</span></div></div></div>
    <div class="section-title"><h3>Latest activity</h3><small>same ledger, condensed</small></div>${demo.events.slice(0,4).map(eventHtml).join('')}`;
}

function render(){
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  const app=document.getElementById('app');
  app.innerHTML=currentView==='ledger'?renderLedger():currentView==='case'?renderCase():currentView==='people'?renderPeople():renderToday();
  bindDynamic();
}

function bindDynamic(){
  document.querySelectorAll('.event-toggle').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.event').classList.toggle('open')));
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{ledgerFilter=btn.dataset.filter;render();}));
  document.querySelectorAll('[data-case-tab]').forEach(btn=>btn.addEventListener('click',()=>{caseTab=btn.dataset.caseTab;render();}));
}

document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{currentView=btn.dataset.view;window.scrollTo({top:0,behavior:'smooth'});render();}));
render();
