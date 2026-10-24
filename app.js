const subjects = [
  {name:"Mathematics", detail:"Algebra, geometry & more", symbol:"∑", color:"#efedff", ink:"#6558e8"},
  {name:"Physics", detail:"Understand the universe", symbol:"⚛", color:"#e1f5ff", ink:"#2389b5"},
  {name:"Chemistry", detail:"Reactions & concepts", symbol:"⚗", color:"#ddf7ed", ink:"#24936f"},
  {name:"Biology", detail:"Life & living systems", symbol:"❋", color:"#e9f7df", ink:"#639b3d"},
  {name:"English", detail:"Language & literature", symbol:"Aa", color:"#fff0e5", ink:"#d9824a"},
  {name:"History & Civics", detail:"Events, people & government", symbol:"⌂", color:"#fce6ef", ink:"#c45485"}
];
const sampleNotes = [
  {subject:"Mathematics", title:"Quadratic equations", desc:"A quick revision note", body:"A quadratic equation is an equation of the form ax² + bx + c = 0, where a ≠ 0. The discriminant is D = b² − 4ac. If D > 0, there are two distinct real roots; if D = 0, there are equal real roots; if D < 0, there are no real roots."},
  {subject:"Physics", title:"Electricity basics", desc:"Key terms to revise", body:"Electric current is the rate of flow of charge: I = Q/t. Potential difference is work done per unit charge: V = W/Q. Ohm's law states that, at constant temperature, current is directly proportional to potential difference: V = IR."},
  {subject:"Chemistry", title:"Electrolysis", desc:"Definitions & reminders", body:"Electrolysis is the chemical decomposition of an electrolyte by passing electric current through it. The cathode is the negative electrode in an electrolytic cell and attracts cations. The anode is the positive electrode and attracts anions."},
  {subject:"Biology", title:"Cell fundamentals", desc:"Biology revision", body:"The cell is the basic structural and functional unit of life. The nucleus contains genetic material and helps control cell activities. Mitochondria release energy through cellular respiration."},
  {subject:"English", title:"Literature answer checklist", desc:"A simple writing structure", body:"Make a clear point, support it with a relevant detail from the text, and explain how that detail answers the question. Use the character or speaker's name accurately and keep the answer focused on the question."},
  {subject:"History & Civics", title:"How to revise a chapter", desc:"Study method", body:"Create a timeline of major events, learn important terms, and connect each event to its causes and consequences. For structured answers, organise points clearly and use relevant names, dates and examples."}
];
let tasks = JSON.parse(localStorage.getItem("icse10-tasks") || "[]");
let completedNotes = JSON.parse(localStorage.getItem("icse10-notes-done") || "[]");
let quizScore = Number(localStorage.getItem("icse10-quiz-score") || 0);
let activeTab = "home";
let toastTimer;
const $ = s => document.querySelector(s);
const main = $("#mainContent"), page = $("#pageContent");

function save(){localStorage.setItem("icse10-tasks",JSON.stringify(tasks));localStorage.setItem("icse10-notes-done",JSON.stringify(completedNotes));localStorage.setItem("icse10-quiz-score",String(quizScore));updateStats();}
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2400);}
function subjectCard(s){return `<button class="subject-card" data-subject="${s.name}"><span class="subject-arrow">↗</span><span class="subject-symbol" style="background:${s.color};color:${s.ink}">${s.symbol}</span><strong>${s.name}</strong><small>${s.detail}</small></button>`;}
function renderPreview(){$("#subjectPreview").innerHTML=subjects.slice(0,3).map(subjectCard).join("");}
function updateStats(){
  $("#statSubjects").textContent=subjects.length;
  const total=tasks.length+sampleNotes.length;
  const done=tasks.filter(t=>t.done).length+completedNotes.length;
  $("#statDone").textContent=Math.round(done/Math.max(total,1)*100)+"%";
  $("#statTasks").textContent=tasks.filter(t=>!t.done && (!t.date||t.date===new Date().toISOString().slice(0,10))).length;
}
function header(kicker,title,desc){return `<div class="page-header"><span class="section-kicker">${kicker}</span><h1>${title}</h1><p>${desc}</p></div>`;}
function renderHome(){main.hidden=false;page.hidden=true;activeTab="home";renderNav();updateStats();}
function renderSubjects(){
  main.hidden=true;page.hidden=false;activeTab="subjects";renderNav();
  page.innerHTML=header("YOUR SYLLABUS","Explore subjects","Your ICSE Class 10 learning space.")+
    `<div class="subject-grid">${subjects.map(subjectCard).join("")}</div><div class="page-panel" style="margin-top:18px"><h3>Study tip</h3><p>Choose one chapter, review the concept, then practise a few questions. These are starter subjects and sample content; customise them to match your school's current syllabus.</p></div>`;
}
function renderNotes(subjectFilter=null){
  main.hidden=true;page.hidden=false;activeTab="subjects";renderNav();
  const notes=sampleNotes.filter(n=>!subjectFilter||n.subject===subjectFilter);
  page.innerHTML=header("REVISION LIBRARY",subjectFilter||"Study notes","Short sample notes to demonstrate the notes experience.")+
    `<div class="page-panel"><label class="field-label" for="noteSearch">Search notes</label><input class="field" id="noteSearch" placeholder="Try “electricity” or “quadratic”"><div id="notesList">${noteRows(notes)}</div></div>`;
  $("#noteSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();$("#notesList").innerHTML=noteRows(notes.filter(n=>(n.title+" "+n.subject+" "+n.body).toLowerCase().includes(q)));});
  page.querySelectorAll("[data-open-note]").forEach(b=>b.addEventListener("click",()=>openNote(b.dataset.openNote)));
}
function noteRows(notes){return notes.length?notes.map(n=>`<div class="list-row"><span class="row-icon">▤</span><div class="row-copy"><strong>${n.title}</strong><small>${n.subject} · ${n.desc}</small></div><button data-open-note="${n.title}">Read</button></div>`).join(""):`<p>No notes match that search.</p>`;}
function openNote(title){
 const n=sampleNotes.find(x=>x.title===title);if(!n)return;
 page.innerHTML=header(n.subject.toUpperCase()," "+n.title,"Sample revision note")+
 `<div class="page-panel"><p style="color:var(--ink);font-size:15px">${n.body}</p><button class="primary-button" id="markNote">${completedNotes.includes(n.title)?"✓ Completed":"Mark as revised"} <span>→</span></button></div><button class="secondary-button" id="backNotes">← All notes</button>`;
 $("#markNote").onclick=()=>{if(!completedNotes.includes(n.title))completedNotes.push(n.title);save();showToast("Revision progress saved");openNote(title);};
 $("#backNotes").onclick=()=>renderNotes(n.subject);
}
function renderPractice(){
 main.hidden=true;page.hidden=false;activeTab="practice";renderNav();
 page.innerHTML=header("PRACTISE & IMPROVE","Practice zone","Try a short sample quiz or browse board-paper resources.")+
 `<div class="page-panel"><span class="section-kicker">QUICK QUIZ</span><h3>Science & study skills</h3><p>Three starter questions. Your score is saved on this device.</p><button class="primary-button" id="startQuiz">Start quiz <span>→</span></button></div>
 <div class="page-panel"><h3>Question papers</h3><p>Use official CISCE resources for authentic specimen papers and past papers. This starter app does not bundle copyrighted paper PDFs.</p><div class="list-row"><span class="row-icon">PDF</span><div class="row-copy"><strong>CISCE official website</strong><small>Find current syllabus and specimen papers</small></div><button id="cisceLink">Open</button></div><div class="list-row"><span class="row-icon">✓</span><div class="row-copy"><strong>Practice checklist</strong><small>Attempt a paper, check answers, note weak areas</small></div></div></div>
 <div class="page-panel"><h3>Your latest quiz score</h3><p><strong>${quizScore}%</strong> saved on this device.</p></div>`;
 $("#startQuiz").onclick=()=>startQuiz();
 $("#cisceLink").onclick=()=>window.open("https://cisce.org/","_blank","noopener,noreferrer");
}
const questions=[
 {q:"Which expression is the discriminant of ax² + bx + c = 0?",opts:["b² − 4ac","b² + 4ac","a² − 4bc"],a:0,why:"For a quadratic equation, D = b² − 4ac."},
 {q:"Which unit is used to measure electric current?",opts:["Volt","Ampere","Ohm"],a:1,why:"Electric current is measured in amperes (A)."},
 {q:"In an electrolytic cell, the cathode is usually:",opts:["Positive","Negative","Neither"],a:1,why:"The cathode in an electrolytic cell is connected to the negative terminal."}
];
function startQuiz(){
 let i=0,score=0;
 function showQuestion(){const q=questions[i];page.innerHTML=header("QUICK QUIZ",`Question ${i+1} of ${questions.length}`,"Choose one answer.")+
 `<div class="page-panel"><div class="progress-track"><div class="progress-fill" style="width:${i/questions.length*100}%"></div></div><h3 style="margin-top:20px">${q.q}</h3><div id="options">${q.opts.map((o,j)=>`<button class="list-row option" data-option="${j}" style="width:100%;text-align:left;border:1px solid var(--line);border-radius:12px;padding:14px;margin-top:8px;background:#fff;color:var(--ink)"><span class="row-icon">${String.fromCharCode(65+j)}</span><span style="flex:1;font-size:13px">${o}</span></button>`).join("")}</div><p id="feedback"></p><button class="primary-button" id="nextQuestion" hidden>${i===questions.length-1?"See results":"Next question"} <span>→</span></button></div>`;
 let chosen=false;page.querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>{if(chosen)return;chosen=true;const correct=Number(b.dataset.option)===q.a;if(correct)score++;$("#feedback").textContent=(correct?"Correct! ":"Not quite. ")+q.why;$("#feedback").style.color=correct?"#218765":"#b35a53";page.querySelectorAll("[data-option]").forEach(x=>x.disabled=true);$("#nextQuestion").hidden=false;});
 $("#nextQuestion").onclick=()=>{if(i<questions.length-1){i++;showQuestion();}else{quizScore=Math.round(score/questions.length*100);save();page.innerHTML=header("QUIZ COMPLETE","Nice work!","Every attempt helps you learn.")+`<div class="page-panel"><h3>Your score: ${score}/${questions.length}</h3><p>${quizScore}% · saved on this device.</p><button class="primary-button" id="retry">Try again <span>↻</span></button> <button class="secondary-button" id="practiceHome">Practice home</button></div>`;$("#retry").onclick=startQuiz;$("#practiceHome").onclick=renderPractice;}};}
 showQuestion();
}
function renderPlanner(){
 main.hidden=true;page.hidden=false;activeTab="planner";renderNav();
 page.innerHTML=header("MAKE A PLAN","Study planner","Add manageable tasks and track them as you go.")+
 `<div class="page-panel"><h3>Add a study task</h3><form id="taskForm"><label class="field-label" for="taskTitle">Task</label><input class="field" id="taskTitle" placeholder="e.g. Revise electrolysis" required maxlength="100"><label class="field-label" for="taskDate">Date</label><input class="field" id="taskDate" class="field" type="date" value="${new Date().toISOString().slice(0,10)}"><button class="primary-button" type="submit">Add to planner <span>＋</span></button></form></div>
 <div class="page-panel"><h3>Your tasks</h3><div id="taskList">${taskRows()}</div></div>`;
 $("#taskForm").onsubmit=e=>{e.preventDefault();tasks.push({id:Date.now(),title:$("#taskTitle").value.trim(),date:$("#taskDate").value,done:false});save();renderPlanner();showToast("Task added to your planner");};
 page.querySelectorAll("[data-task-check]").forEach(c=>c.onchange=()=>{const t=tasks.find(x=>x.id===Number(c.dataset.taskCheck));if(t)t.done=c.checked;save();renderPlanner();});
 page.querySelectorAll("[data-task-delete]").forEach(b=>b.onclick=()=>{tasks=tasks.filter(t=>t.id!==Number(b.dataset.taskDelete));save();renderPlanner();});
}
function taskRows(){return tasks.length?tasks.map(t=>`<div class="task-row ${t.done?"done":""}"><input type="checkbox" data-task-check="${t.id}" ${t.done?"checked":""} aria-label="Complete ${escapeHtml(t.title)}"><span>${escapeHtml(t.title)}<small style="display:block;color:var(--muted);font-size:10px;margin-top:4px">${t.date||"No date"}</small></span><button class="secondary-button" data-task-delete="${t.id}" aria-label="Delete task">×</button></div>`).join(""):`<p>No tasks yet. Add one small goal above to get started.</p>`;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderProgress(){
 main.hidden=true;page.hidden=false;activeTab="progress";renderNav();
 const total=tasks.length+sampleNotes.length,done=tasks.filter(t=>t.done).length+completedNotes.length,pct=Math.round(done/Math.max(total,1)*100);
 page.innerHTML=header("YOUR JOURNEY","Progress report","Your study activity is saved locally on this device.")+
 `<div class="page-panel"><span class="section-kicker">OVERALL COMPLETION</span><h1 style="font-size:42px;margin:12px 0">${pct}%</h1><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><p>${done} of ${total} starter activities completed.</p></div>
 <div class="stats-grid"><article class="stat-card"><span class="stat-icon mint">✓</span><div><strong>${completedNotes.length}</strong><small>Notes revised</small></div></article><article class="stat-card"><span class="stat-icon lavender">▣</span><div><strong>${tasks.filter(t=>t.done).length}</strong><small>Tasks done</small></div></article><article class="stat-card"><span class="stat-icon peach">✎</span><div><strong>${quizScore}%</strong><small>Last quiz</small></div></article></div>
 <div class="page-panel" style="margin-top:16px"><h3>Keep your data safe</h3><p>This prototype stores progress in your browser on this device. Clearing browser site data can erase it. Cloud sync is not included.</p><button class="secondary-button" id="resetProgress">Reset local progress</button></div>`;
 $("#resetProgress").onclick=()=>{if(confirm("Reset tasks, revised notes and quiz score on this device?")){tasks=[];completedNotes=[];quizScore=0;save();renderProgress();showToast("Local progress reset");}};
}
function renderNav(){document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===activeTab));}
function go(tab){if(tab==="home")renderHome();else if(tab==="subjects")renderSubjects();else if(tab==="practice")renderPractice();else if(tab==="planner")renderPlanner();else if(tab==="progress")renderProgress();}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-tab]");if(tab){go(tab.dataset.tab);return;}
 const goButton=e.target.closest("[data-go]");if(goButton){go(goButton.dataset.go);return;}
 const subject=e.target.closest("[data-subject]");if(subject){renderNotes(subject.dataset.subject);return;}
});
$("#profileBtn").onclick=()=>showToast("Profile settings can be added in the next build.");
const todayLabel = document.getElementById("todayDate");
if (todayLabel) todayLabel.textContent = new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
renderPreview();renderHome();updateStats();
if("serviceWorker" in navigator && location.protocol.startsWith("http")){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").hidden=false;});
$("#installBtn").onclick=async()=>{if(!installPrompt){showToast("Use your browser menu and choose “Add to Home screen”.");return;}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").hidden=true;};
if(window.matchMedia("(display-mode: standalone)").matches)$("#installBtn").hidden=true;
