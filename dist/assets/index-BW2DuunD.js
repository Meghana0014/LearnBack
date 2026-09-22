(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();const e={authenticated:!1,landing:!1,darkMode:localStorage.getItem("lb_dark")==="1",authMode:"login",authName:"",authEmail:"",authPassword:"",authError:"",modal:null,view:"dashboard",topic:"dbms",q:null,answer:"",confidence:"",d:null,mastery:{},attempts:0,name:"Student",grade:"College",goal:"Build strong understanding",preferred_input:"Text",history:[],loading:!1,booting:!0,map:[],session:[],sessionStarted:0,sessionTarget:3,demoMode:!1,toast:""},R=document.querySelector("#app"),$=(window.location.hostname==="localhost"?"http://localhost:8787":window.location.origin).replace(/\/$/,""),E=async s=>{const a=await s.text();if(!a)return null;try{return JSON.parse(a)}catch{throw new Error(`Server returned invalid JSON (${s.status}). Please check that the backend is running.`)}},N=(s,a={})=>{const t=new Headers(a.headers||{}),n=localStorage.getItem("learnback_session");n&&t.set("X-Session-Token",n);const o=s.startsWith("http")?s:`${$}${s}`;return fetch(o,{...a,headers:t})},y=s=>({primary_key:"Primary Key",foreign_key:"Foreign Key",candidate_key:"Candidate Key",normalization:"Normalization",encapsulation:"Encapsulation",inheritance:"Inheritance",polymorphism:"Polymorphism",lists:"Lists",functions:"Functions",oop_python:"OOP in Python",exceptions:"Exceptions"})[s]||s.replace(/_/g," "),f=s=>Math.round(Number(s||0)),_={primary_key:[{reasoning:"Student ID, because it should uniquely identify one student.",signal:"Strong reasoning",note:"Names and phone numbers can change or repeat; the key needs stable uniqueness."},{reasoning:"Phone number, because two students should not have the same one.",signal:"Partially correct",note:"Uniqueness is relevant, but phone numbers can change or be missing."},{reasoning:"Student name, because it identifies the student.",signal:"Common misconception",note:"Different students can share the same name, so it is not reliably unique."}],foreign_key:[{reasoning:"A foreign key stores a value that points to a key in another table.",signal:"Strong reasoning",note:"It connects related records while referencing a key in the other table."},{reasoning:"The foreign key is the unique ID of this table.",signal:"Common misconception",note:"That describes a primary key more closely; a foreign key references another table."},{reasoning:"It joins two tables together.",signal:"Strong reasoning",note:"The relationship idea is useful, but the key stores a reference to another table's key."}],encapsulation:[{reasoning:"Keep the field private and expose controlled methods so other code cannot change it directly.",signal:"Strong reasoning",note:"Encapsulation controls access to an object's internal state."},{reasoning:"Make everything public so other classes can use the object easily.",signal:"Common misconception",note:"Easy access is not the goal; controlled access is."},{reasoning:"Use a getter because private variables cannot be used at all.",signal:"Strong reasoning",note:"Private state can still be accessed through deliberately designed methods."}],lists:[{reasoning:"Use a list when I need an ordered collection of multiple values.",signal:"Strong reasoning",note:"A list is useful when values need to be stored and iterated together."},{reasoning:"A list is basically one variable that can hold anything.",signal:"Common misconception",note:"A list holds multiple items; its behavior is more specific than a generic variable."},{reasoning:"Use a list whenever there is more than one value, no matter what the task is.",signal:"Applied reasoning",note:"The right structure depends on access patterns and the problem being solved."}],normalization:[{reasoning:"Normalization separates repeated information so updates do not create inconsistent copies.",signal:"Strong reasoning",note:"This captures the main goal of reducing redundancy and update anomalies."},{reasoning:"Normalization means making every table have exactly the same number of columns.",signal:"Common misconception",note:"Normalization is about data dependencies and structure, not equal column counts."},{reasoning:"If department details repeat for every student, I would separate them into related tables.",signal:"Applied reasoning",note:"This uses a concrete example to show why normalization can reduce repetition."}]};function W(s){return`<section class="peer-reasoning panel"><div class="peer-head"><div><small>ANONYMOUS PEER REASONING</small><h3>How other learners approached this</h3><p>Names and profiles stay hidden. Compare the reasoning, not the person.</p></div><span class="peer-lock">🔒 Anonymous</span></div><div class="peer-grid">${(_[s]||_.primary_key).map((t,n)=>`<article class="peer-card"><div class="peer-card-top"><span class="peer-avatar">A${n+1}</span><span class="peer-label">Anonymous learner</span><span class="peer-signal ${t.signal.includes("Common")?"warn":t.signal.includes("Partially")||t.signal.includes("Partial")?"mid":"good"}">${t.signal}</span></div><p class="peer-answer">“${t.reasoning}”</p><button class="peer-notice" data-peer="${n}">Notice the reasoning →</button><div class="peer-note" id="peer-note-${n}" hidden>${t.note}</div></article>`).join("")}</div><div class="peer-reflect"><div><b>What did you notice?</b><span>Use another learner's reasoning to strengthen your own explanation.</span></div><button class="peer-reflect-btn" data-peer-reflect>Revise my reasoning →</button></div></section>`}function J(){return`<div class="lp" id="landing-shell">

  <!-- ── Layer 0: star canvas ── -->
  <canvas class="lp-stars" id="landing-particles"></canvas>

  <!-- ── Layer 1: large floating cosmic spheres ── -->
  <div class="lp-sphere lp-s1"></div>
  <div class="lp-sphere lp-s2"></div>
  <div class="lp-sphere lp-s3"></div>
  <div class="lp-sphere lp-s4"></div>
  <div class="lp-sphere lp-s5"></div>
  <div class="lp-sphere lp-s6"></div>
  <div class="lp-sphere lp-s7"></div>

  <!-- ── Layer 2: subtle grid ── -->
  <div class="lp-grid-bg"></div>

  <!-- ── Layer 3: bottom wave glows ── -->
  <div class="lp-waves-wrap">
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="rgba(120,40,220,0)"/>
          <stop offset="30%"  stop-color="rgba(160,60,255,0.28)"/>
          <stop offset="70%"  stop-color="rgba(130,50,240,0.22)"/>
          <stop offset="100%" stop-color="rgba(120,40,220,0)"/>
        </linearGradient>
        <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="rgba(100,30,200,0)"/>
          <stop offset="40%"  stop-color="rgba(180,80,255,0.18)"/>
          <stop offset="60%"  stop-color="rgba(140,60,240,0.14)"/>
          <stop offset="100%" stop-color="rgba(100,30,200,0)"/>
        </linearGradient>
        <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="rgba(80,20,160,0)"/>
          <stop offset="50%"  stop-color="rgba(120,50,220,0.12)"/>
          <stop offset="100%" stop-color="rgba(80,20,160,0)"/>
        </linearGradient>
      </defs>
      <path class="lp-wave lp-wave-1" fill="url(#wg1)" d="M0,110 C240,180 480,40 800,110 C1120,180 1320,50 1440,110 L1440,220 L0,220 Z"/>
      <path class="lp-wave lp-wave-2" fill="url(#wg2)" d="M0,145 C300,80  600,190 900,135 C1120,90 1330,165 1440,135 L1440,220 L0,220 Z"/>
      <path class="lp-wave lp-wave-3" fill="url(#wg3)" d="M0,168 C380,138 660,195 960,160 C1160,132 1370,178 1440,165 L1440,220 L0,220 Z"/>
    </svg>
  </div>

  <!-- ── Nav ── -->
  <nav class="lp-nav">
    <div class="lp-brand">
      <span class="lp-brand-icon">L</span>
      <div>
        <strong>LearnBack</strong>
        <small>adaptive learning</small>
      </div>
    </div>
    <span class="lp-ai-pill">✦ AI-Powered</span>
  </nav>

  <!-- ── Hero ── -->
  <div class="lp-hero">

    <!-- LEFT -->
    <div class="lp-left">

      <div class="lp-kicker-wrap">
        <span class="lp-kicker">
          <span class="lp-kicker-dot"></span>
          Adaptive &nbsp;•&nbsp; Intelligent &nbsp;•&nbsp; Personal
        </span>
      </div>

      <h1 class="lp-h1">
        <span class="lp-h1-line lp-h1-l1">Learn Smarter.</span>
        <span class="lp-h1-line lp-h1-l2"><span class="lp-grad">Remember</span> Forever.</span>
      </h1>

      <p class="lp-desc">Your AI-powered adaptive learning companion that understands you, personalizes your learning, and helps you master anything.</p>

      <div class="lp-phrase-row">
        <span class="lp-phrase-dot"></span>
        <div class="lp-phrase-track" id="landing-feature-slider">
          <span class="lp-phrase active">Understand deeply.</span>
          <span class="lp-phrase">Recall effortlessly.</span>
          <span class="lp-phrase">Grow continuously.</span>
        </div>
      </div>

      <button class="lp-cta" id="landing-cta" aria-label="Start Your Study Journey">
        <span class="lp-cta-glow"></span>
        <span class="lp-cta-bg"></span>
        <span class="lp-cta-shimmer"></span>
        <span class="lp-cta-text">Start Your Study Journey</span>
        <span class="lp-cta-arr" aria-hidden="true">→</span>
      </button>

      <div class="lp-feat-cards">
        <div class="lp-fc">
          <span class="lp-fc-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/></svg>
          </span>
          <strong>Adaptive Learning</strong>
          <small>Personalized for you</small>
        </div>
        <div class="lp-fc">
          <span class="lp-fc-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </span>
          <strong>Smart Recall</strong>
          <small>AI-powered memory</small>
        </div>
        <div class="lp-fc">
          <span class="lp-fc-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
          </span>
          <strong>Concept Mastery</strong>
          <small>Track &amp; improve</small>
        </div>
        <div class="lp-fc">
          <span class="lp-fc-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </span>
          <strong>Confidence Boost</strong>
          <small>Learn with clarity</small>
        </div>
      </div>
    </div>

    <!-- RIGHT: demo card -->
    <div class="lp-right">
      <div class="lp-demo-card">

        <!-- Card chrome header -->
        <div class="lp-demo-top">
          <span class="lp-demo-dot lp-dr"></span>
          <span class="lp-demo-dot lp-dy"></span>
          <span class="lp-demo-dot lp-dg"></span>
          <span class="lp-demo-lbl">✦ See LearnBack in Action</span>
        </div>

        <!-- Screen label (top-center) -->
        <div class="lp-scr-lbl" id="lp-screen-label">Dashboard Overview</div>

        <!-- Demo reel -->
        <div class="lp-demo-body" id="lp-demo-reel">

          <!-- Screen 0: Dashboard overview -->
          <div class="lp-screen lp-screen-active" data-screen="0">
            <div class="lp-preview">
              <div class="lp-sb">
                <div class="lp-sb-logo">L</div>
                <div class="lp-sb-links">
                  <span class="lp-sb-active"></span>
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
              <div class="lp-pm">
                <div class="lp-pm-hdr">
                  <div>
                    <div class="lp-xs-tag">LEARNING OVERVIEW</div>
                    <div class="lp-sm-h">Good to see you, Rahul.</div>
                  </div>
                  <div class="lp-ring-xs"><span>74%</span></div>
                </div>
                <div class="lp-4s">
                  <div class="lp-si"><span>42</span><small>Signals</small></div>
                  <div class="lp-si"><span>7</span><small>Concepts</small></div>
                  <div class="lp-si lp-si-a"><span>74%</span><small>Mastery</small></div>
                  <div class="lp-si lp-si-w"><span>3</span><small>Errors</small></div>
                </div>
                <div class="lp-2col">
                  <div class="lp-mp">
                    <div class="lp-ptag">KNOWLEDGE MAP</div>
                    <div class="lp-brow" style="--w:82%"><span>Primary Key</span><em></em></div>
                    <div class="lp-brow" style="--w:55%"><span>Foreign Key</span><em></em></div>
                    <div class="lp-brow lp-brow-r" style="--w:38%"><span>Polymorphism</span><em></em></div>
                  </div>
                  <div class="lp-mp lp-mp-i">
                    <div class="lp-ptag">AI INSIGHT</div>
                    <div class="lp-star-xs">✦</div>
                    <div class="lp-ins-txt">3 high-confidence errors to revisit.</div>
                    <div class="lp-mini-chip">Answer → Diagnose → Adapt</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Screen 1: Adaptive question -->
          <div class="lp-screen" data-screen="1">
            <div class="lp-qscreen">
              <div class="lp-qhdr">
                <span class="lp-qtag">ADAPTIVE QUESTION</span>
                <span class="lp-qlvl">Level 1 · Personalized</span>
              </div>
              <div class="lp-qtxt">What is the purpose of a primary key in a database table?</div>
              <div class="lp-qhint">Explain it in your own words.</div>
              <div class="lp-qbox">
                <span id="lp-typing"></span>
                <span class="lp-qcursor" id="lp-cursor">|</span>
              </div>
              <div class="lp-confrow">
                <span class="lp-cl">Confidence:</span>
                <span class="lp-cb">Not sure</span>
                <span class="lp-cb">Somewhat</span>
                <span class="lp-cb lp-cb-on">Very confident</span>
              </div>
            </div>
          </div>

          <!-- Screen 2: Diagnosis -->
          <div class="lp-screen" data-screen="2">
            <div class="lp-dscreen">
              <div class="lp-dalert">
                <span class="lp-dico">!</span>
                <div>
                  <div class="lp-dtag">MISCONCEPTION DETECTED</div>
                  <div class="lp-dtit">Primary key confused with foreign key.</div>
                </div>
              </div>
              <div class="lp-dpipe">
                <div class="lp-ds lp-ds-ok"><span>1</span><b>Captured</b></div>
                <div class="lp-da">→</div>
                <div class="lp-ds lp-ds-ok"><span>2</span><b>Diagnosed</b></div>
                <div class="lp-da">→</div>
                <div class="lp-ds lp-ds-on"><span>3</span><b>Adapting</b></div>
              </div>
              <div class="lp-2col">
                <div class="lp-mp">
                  <div class="lp-ptag">SIGNAL</div>
                  <div class="lp-dr-row"><span>Correct</span><b class="lp-red">Needs work</b></div>
                  <div class="lp-dr-row"><span>Confidence</span><b class="lp-red">Very confident</b></div>
                  <div class="lp-dr-row"><span>Misconception</span><b class="lp-red">pk_fk</b></div>
                </div>
                <div class="lp-mp lp-mp-r">
                  <div class="lp-ptag">NEXT ACTION</div>
                  <div class="lp-rec">Targeted recovery question selected.</div>
                  <div class="lp-mbar">
                    <span>Primary Key</span>
                    <div class="lp-mtrack"><div class="lp-mfill" style="--from:62%;--to:48%"></div></div>
                    <span class="lp-red">62%→48%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Screen 3: Knowledge map -->
          <div class="lp-screen" data-screen="3">
            <div class="lp-kscreen">
              <div class="lp-khdr">
                <div>
                  <div class="lp-xs-tag">CONCEPT GRAPH</div>
                  <div class="lp-sm-h">Your knowledge map</div>
                </div>
                <div class="lp-ktot">74%<small>overall</small></div>
              </div>
              <div class="lp-kgraph">
                <div class="lp-knode lp-kn-s" style="left:14%;top:42%"><span>82%</span><b>Primary Key</b></div>
                <div class="lp-knode lp-kn-d" style="left:42%;top:22%"><span>55%</span><b>Foreign Key</b></div>
                <div class="lp-knode lp-kn-w" style="left:68%;top:46%"><span>38%</span><b>Polymorphism</b></div>
                <div class="lp-knode lp-kn-d" style="left:30%;top:70%"><span>61%</span><b>Normalization</b></div>
                <div class="lp-kline" style="left:19%;top:44%;width:24%;transform:rotate(-11deg)"></div>
                <div class="lp-kline" style="left:46%;top:34%;width:24%;transform:rotate(13deg)"></div>
              </div>
              <div class="lp-kleg">
                <span class="lp-ks">● Strong</span>
                <span class="lp-kd">● Developing</span>
                <span class="lp-kw">● Needs work</span>
              </div>
            </div>
          </div>

        </div><!-- /.lp-demo-body -->

        <!-- Navigation dots -->
        <div class="lp-dots" id="lp-screen-dots" role="tablist" aria-label="Demo screens">
          <button class="lp-dot active" data-dot="0" role="tab" aria-selected="true"  aria-label="Dashboard Overview"></button>
          <button class="lp-dot" data-dot="1" role="tab" aria-selected="false" aria-label="Adaptive Question"></button>
          <button class="lp-dot" data-dot="2" role="tab" aria-selected="false" aria-label="AI Diagnosis"></button>
          <button class="lp-dot" data-dot="3" role="tab" aria-selected="false" aria-label="Knowledge Map"></button>
        </div>

        <!-- Footer badges -->
        <div class="lp-demo-foot">
          <span>🔒 Private</span>
          <span>⚡ Instant</span>
          <span>🎯 Adaptive</span>
        </div>

      </div><!-- /.lp-demo-card -->
    </div><!-- /.lp-right -->

  </div><!-- /.lp-hero -->

  <!-- Scroll indicator -->
  <div class="lp-scroll-ind" aria-hidden="true">
    <span>Scroll to explore</span>
    <div class="lp-scroll-arr">↓</div>
  </div>

</div>`}function Z(){return`<div class="auth-shell">
  <!-- cosmic spheres -->
  <div class="auth-sphere auth-s1"></div>
  <div class="auth-sphere auth-s2"></div>
  <div class="auth-sphere auth-s3"></div>
  <div class="auth-sphere auth-s4"></div>
  <!-- grid -->
  <div class="auth-grid-bg"></div>
  <!-- stars canvas -->
  <canvas class="auth-stars" id="auth-particles"></canvas>

  <!-- brand top-left -->
  <div class="auth-brand">
    <span class="auth-brand-icon">L</span>
    <div><strong>LearnBack</strong><small>adaptive learning</small></div>
  </div>

  <!-- pill top-right -->
  <span class="auth-ai-pill">✦ AI-Powered</span>

  <!-- card -->
  <div class="auth-card">
    <div class="auth-card-glow"></div>
    <div class="auth-kicker">${e.authMode==="login"?"WELCOME BACK":"YOUR LEARNING SPACE"}</div>
    <h1>${e.authMode==="login"?"Sign in to LearnBack.":"Create your profile."}</h1>
    <p>${e.authMode==="login"?"Continue with your personal knowledge map and learning history.":"Start a personal learning journey. Your progress stays linked to your account."}</p>
    ${e.authError?`<div class="auth-error">${e.authError}</div>`:""}
    ${e.authMode==="signup"?`<label class="auth-field"><span>Your name</span><input id="auth-name" placeholder="e.g. Rahul" value="${e.authName}" autocomplete="name"></label>`:""}
    <label class="auth-field"><span>Email</span><input id="auth-email" type="email" placeholder="you@example.com" value="${e.authEmail}" autocomplete="email"></label>
    <label class="auth-field"><span>Password</span><input id="auth-password" type="password" placeholder="${e.authMode==="signup"?"At least 6 characters":"Your password"}" value="${e.authPassword}" autocomplete="${e.authMode==="signup"?"new-password":"current-password"}"></label>
    ${e.authMode==="signup"?'<div class="auth-note">Your account unlocks a separate profile, mastery map and history.</div>':""}
    <button class="auth-submit" id="auth-submit">${e.authMode==="login"?"Log in →":"Create account →"}</button>
    <div class="auth-switch">${e.authMode==="login"?'New to LearnBack? <button data-auth-switch="signup">Create an account</button>':'Already have an account? <button data-auth-switch="login">Log in</button>'}</div>
  </div>

  <div class="auth-foot">LearnBack • Understand. Adapt. Improve.</div>
</div>`}async function D(){e.authError="";const s=(document.querySelector("#auth-email")?.value||"").trim(),a=document.querySelector("#auth-password")?.value||"",t=document.querySelector("#auth-name")?.value.trim()||"";if(e.authEmail=s,e.authPassword=a,e.authName=t,e.authMode==="signup"&&t.length<2){e.authError="Please enter your name.",c();return}if(!/^\S+@\S+\.\S+$/.test(s)){e.authError="Please enter a valid email.",c();return}if(a.length<6){e.authError="Password must be at least 6 characters.",c();return}try{const n=await fetch(`${$}/api/${e.authMode}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e.authMode==="signup"?{name:t,email:s,password:a}:{email:s,password:a})}),o=await E(n);if(!n.ok)throw new Error(o&&o.error||"Authentication failed");localStorage.setItem("learnback_session",o.token),e.authenticated=!0,e.authError="",e.authPassword="",e.landing=!0,await P(!0)}catch(n){e.authError=n.message||"Could not sign in.",c()}}function w(s,a,t,n,o){const r=o||n,i=r==="learn"?`data-v="${r}"`:`data-modal="${r}"`;return`<header><div><small>${s}</small><h1>${a}</h1></div><button class="ghost" ${i}>${t}</button></header>`}function M(s,a,t=""){const n=a<60?"Needs attention":a<80?"Developing":"Strong";return`<div class="row" data-concept="${t}"><i></i><div><b>${s}</b><span>${n}</span></div><em><u style="width:${Math.max(0,Math.min(100,a))}%"></u></em><strong>${f(a)}%</strong></div>`}function X(){return`<aside><div class="brand" data-modal="dashboard"><b class="logo">L</b><div><strong>LearnBack</strong><small>adaptive learning</small></div></div><nav><button data-modal="dashboard">⌂ <span>Overview</span></button><button data-v="learn">✦ <span>Learn</span></button><button data-modal="progress">◔ <span>Knowledge map</span></button><button data-modal="intelligence">🧠 <span>Learning Intelligence</span></button><button data-modal="classroom">◎ <span>Classroom copilot</span></button><button data-modal="subjects">＋ <span>Subjects</span></button><button data-modal="plan">✦ <span>Learning plan</span></button><button data-modal="history">↺ <span>History</span></button><button data-modal="profile">◉ <span>My profile</span></button></nav><div class="bottom"><div class="signal"><small>TODAY</small><b>${e.attempts} learning signals</b><span>Stored in your local database.</span></div><button class="dm-toggle" id="dm-toggle" title="Toggle dark mode"><span class="dm-icon">${e.darkMode?"☀":"🌙"}</span><span class="dm-label">${e.darkMode?"Light mode":"Dark mode"}</span></button><div class="user"><i>${e.name[0]?.toUpperCase()||"S"}</i><div><b>${e.name}</b><small>${e.grade}</small></div></div></div></aside>`}function j(){const s=Object.values(e.mastery),a=s.length?s.reduce((r,i)=>r+Number(i),0)/s.length:62,t=Object.entries(e.mastery).sort((r,i)=>r[1]-i[1]).slice(0,3),n=e.history.filter(r=>r.misconception&&String(r.confidence).toLowerCase().includes("confident")).length;e.history.filter(r=>r.is_correct).length;const o=n?`You have ${n} high-confidence error${n>1?"s":""} to revisit. LearnBack will target them instead of restarting the whole topic.`:"Confidence is a learning signal. Answer naturally, then tell LearnBack how sure you felt.";return`${w("LEARNING OVERVIEW",`Good to see you, ${e.name}.`,"Learning Intelligence","intelligence")}<section class="hero"><div><small>LEARNBACK RECOMMENDS</small><h2>${n?"Let's repair a misconception.":"Let's find what you need next."}</h2><p>LearnBack uses your answer, confidence, history and concept mastery to decide the next learning move.</p><div class="hero-actions"><button class="primary" data-start="dbms">Start adaptive session →</button><button class="demo-btn" data-demo="1">▶ Run 60-sec demo</button><button class="hero-link" data-start="java">Try Java OOP</button><button class="hero-link" data-modal="subjects">Browse subjects</button><button class="hero-link" data-v="plan">View today's plan</button></div></div><div class="orb"><span>${f(a)}%</span><small>profile</small></div></section><div class="stats"><div><small>LEARNING SIGNALS</small><b>${e.attempts}</b><span>Saved locally</span></div><div><small>CONCEPTS TRACKED</small><b>${Object.keys(e.mastery).length||7}</b><span>Across your profile</span></div><div><small>UNDERSTANDING</small><b>${f(a)}%</b><span>Current estimate</span></div><div><small>HIGH-CONFIDENCE ERRORS</small><b>${n}</b><span>Being targeted</span></div></div><div class="grid"><section class="panel"><div class="head"><div><small>KNOWLEDGE MAP</small><h3>Where you stand</h3></div><button class="link" data-v="progress">Open map</button></div>${t.length?t.map(r=>M(y(r[0]),r[1],r[0])).join(""):M("Primary Key",42,"primary_key")+M("Foreign Key",68,"foreign_key")+M("Polymorphism",51,"polymorphism")}</section><section class="panel insight"><small>LEARNER INSIGHT</small><div class="star">✦</div><h3>${n?"Your confidence pattern matters.":"Confidence is a learning signal."}</h3><p>${o}</p><div class="insight-pill">Answer → Diagnose → Adapt → Re-test</div></section></div><div class="section"><small>CONTINUE LEARNING</small><h3>Choose a learning track</h3></div><div class="topics"><button data-start="dbms"><i>DB</i><div><b>Database Keys</b><span>DBMS • misconception recovery</span></div><strong>${f(e.mastery.primary_key??42)}%</strong></button><button data-start="java"><i>JV</i><div><b>OOP Basics</b><span>Java • concept progression</span></div><strong>${f(e.mastery.encapsulation??74)}%</strong></button><button data-start="python"><i>PY</i><div><b>Python Foundations</b><span>Python • adaptive concept recovery</span></div><strong>${f(e.mastery.lists??50)}%</strong></button></div>`}function Q(){if(e.d)return ee();const s=e.q;if(!s)return'<section class="loading-card panel"><div class="spinner"></div><h2>Building your next question…</h2><p>LearnBack is checking your current knowledge state.</p></section>';const a="SpeechRecognition"in window||"webkitSpeechRecognition"in window;return`${w(e.topic==="dbms"?"DBMS • DATABASE KEYS":e.topic==="java"?"JAVA • OOP BASICS":"PYTHON • FOUNDATIONS","Adaptive learning session","Exit","dashboard")}<div class="session-top"><span>Session ${e.session.length+1} of ${e.sessionTarget}</span><em><u style="width:${Math.min(100,e.session.length/e.sessionTarget*100)}%"></u></em>${e.demoMode?'<span class="demo-chip">DEMO STORY</span>':""}<button class="mini" data-v="summary">End session</button></div><div class="session"><section class="panel question"><div class="step"><span>Adaptive question</span><em><u style="width:${Math.min(92,25+e.attempts%4*18)}%"></u></em><span>${s.difficulty?`Level ${s.difficulty}`:"Personalized"}</span></div><div class="question-meta"><small class="tag">${s.type}</small><small class="reason">${s.reason||"Selected from your knowledge state"}</small></div><h2>${s.question}</h2><p>${s.hint}</p><div class="answer-wrap"><textarea id="answer" placeholder="Write your answer naturally...">${e.answer}</textarea>${a?'<button class="voice" id="voice">🎙 Voice answer</button>':'<small class="voice-note">Voice input is not supported by this browser.</small>'}</div>${e.demoMode?'<div class="demo-strip"><div><b>Hackathon demo</b><span>Show a high-confidence misconception in one click.</span></div><button class="demo-fill" data-fill-demo>Fill sample answer</button></div>':""}<div class="confidence"><div><b>How confident are you?</b><span>This lets LearnBack distinguish uncertainty from confident misconceptions.</span></div><div>${["Not sure","Somewhat","Confident","Very confident"].map(t=>`<button data-c="${t}" class="${e.confidence===t?"selected":""}">${t}</button>`).join("")}</div></div><div class="actions"><button class="primary" id="submit" ${!e.answer.trim()||!e.confidence||e.loading?"disabled":""}>${e.loading?"Analyzing learning signal…":"Analyze my answer →"}</button></div></section><aside class="side"><div class="sidecard focus-card"><small>CURRENT FOCUS</small><div class="focus-icon">◎</div><h3>${s.focus}</h3><p>Target selected from the learner's current knowledge state, not a fixed quiz sequence.</p></div><div class="sidecard"><small>LEARNBACK LOOP</small><div class="mini-flow"><span>Answer</span><b>→</b><span>Diagnose</span><b>→</b><span>Adapt</span></div><p>Every response becomes a learning signal.</p></div><div class="sidecard signal-card"><small>SESSION SIGNALS</small><b>${e.session.length}</b><span>answers captured</span><div class="signal-dots">${Array.from({length:e.sessionTarget},(t,n)=>`<i class="${n<e.session.length?e.session[n]?.correct?"ok":"bad":""}"></i>`).join("")}</div></div></aside></div>`}function ee(){const s=e.d;return`${w("LEARNBACK DIAGNOSIS",s.misconception?"A misconception needs repair.":"Understanding signal detected.",e.session.length>=e.sessionTarget?"See session report":"Continue","learn")}<section class="result ${s.is_correct?"good":"attention"}"><i>${s.is_correct?"✓":"!"}</i><div><small>${s.is_correct?"UNDERSTANDING CONFIRMED":"MISCONCEPTION / GAP DETECTED"} • ${s.mode==="ai"?"AI":"LOCAL ENGINE"}</small><h2>${s.summary}</h2><p>${s.explanation}</p></div></section><div class="diagnosis-pipeline"><div class="done"><span>1</span><b>Answer captured</b><small>Natural response + confidence</small></div><div class="done"><span>2</span><b>Signal diagnosed</b><small>${s.misconception?"Misconception detected":"Understanding checked"}</small></div><div class="next-step"><span>3</span><b>Next move</b><small>Targeted ${e.session.length>=e.sessionTarget?"session report":"re-test"}</small></div></div><div class="diagnosis-grid"><section class="panel"><small>WHAT LEARNBACK SAW</small><h3>${s.concept_label}</h3><div class="signals"><div><span>Correctness</span><b>${s.is_correct?"Correct":"Needs work"}</b></div><div><span>Confidence assessment</span><b>${s.confidence_assessment}</b></div><div><span>Misconception</span><b>${s.misconception?s.misconception_id||"Detected":"Not detected"}</b></div></div><div class="box"><b>Recovery explanation</b><p>${s.recovery}</p></div></section><section class="panel recovery"><small>NEXT BEST ACTION</small><h3>Target the exact concept.</h3><div class="next"><i>1</i><div><b>Recovery</b><p>${s.recovery}</p></div></div><div class="next"><i>2</i><div><b>Targeted question</b><p>${s.next_question}</p></div></div><button class="primary" id="continue">${e.session.length>=e.sessionTarget?"View session report →":"Continue adaptive session →"}</button></section></div><div class="update"><div><span>${s.concept_label}</span><small>mastery update</small></div><b>${f(s.old_mastery??50)}% → ${f(s.new_mastery??50)}</b></div>${W(s.concept)}`}function se(){const s=e.session.length,a=e.session.filter(l=>l.correct).length,t=e.session.filter(l=>l.misconception).length,n=e.session.filter(l=>l.misconception&&/confident/i.test(l.confidence)).length,o=s?Math.round(a/s*100):0,r=e.sessionStarted?Math.max(1,Math.round((Date.now()-e.sessionStarted)/6e4)):0,i=[...new Set(e.session.map(l=>l.label))];return`${w("SESSION REPORT","Your learning session","Back to overview","dashboard")}<section class="summary-hero"><div><small>LEARNING RECOVERY SESSION</small><h2>Here's what changed.</h2><p>LearnBack measured evidence across your answers instead of treating the session as a simple score.</p></div><div class="score-ring"><b>${o}%</b><span>answer accuracy</span></div></section><div class="summary-stats"><div><small>ANSWERS</small><b>${s}</b></div><div><small>CONCEPTS TOUCHED</small><b>${i.length}</b></div><div><small>MISCONCEPTIONS</small><b>${t}</b></div><div><small>HIGH-CONFIDENCE ERRORS</small><b>${n}</b></div></div><div class="grid"><section class="panel"><small>SESSION EVIDENCE</small><h3>What LearnBack observed</h3><div class="evidence">${e.session.map((l,b)=>`<div><i class="${l.correct?"ok":"bad"}">${l.correct?"✓":"!"}</i><span><b>${l.label}</b><small>${l.confidence} confidence • ${l.correct?"correct":"needs work"}${l.misconception?" • misconception signal":""}</small></span><strong>${b+1}</strong></div>`).join("")}</div></section><section class="panel"><small>LEARNER SIGNAL</small><h3>${n?"Confidence calibration needs attention.":t?"A misconception was isolated.":"Your understanding signal is improving."}</h3><p>${n?"You were confident on an incorrect concept signal. LearnBack can revisit that concept with a targeted example rather than repeating the entire topic.":t?"The session found a specific concept-level issue and used it to select a recovery path.":"Your answers gave LearnBack enough evidence to update your concept mastery."}</p><div class="summary-pill">Session time: ${r} min • ${s} learning signals</div><button class="primary" data-start="${e.topic}">Run another adaptive session →</button></section></div>`}function G(){const s=e.history||[],a=Object.values(e.mastery).map(Number),t=a.length?Math.round(a.reduce((h,k)=>h+k,0)/a.length):62,n=s.filter(h=>h.is_correct).length,o=s.length,r=o?Math.round(n/o*100):0,i=s.filter(h=>String(h.confidence||"").toLowerCase().includes("confident")),l=i.filter(h=>h.is_correct).length,b=i.length?Math.round(l/i.length*100):0,u=i.filter(h=>!h.is_correct||h.misconception).length,p=s.filter(h=>h.misconception),v=p.length,S=Math.max(0,v-s.slice(0,Math.max(1,Math.floor(s.length/2))).filter(h=>h.misconception).length),A=Math.max(48,Math.min(96,Math.round(t-v*3+(s.length>5?8:0)))),m=Math.max(42,Math.min(95,Math.round(r*.65+t*.35))),g=Math.max(45,Math.min(98,Math.round(70+S*7+(r-50)*.15))),d=i.length?Math.max(35,Math.min(96,Math.round(100-Math.abs(b-100)*.7))):58,L=p[0],C=Object.entries(e.mastery).sort((h,k)=>Number(h[1])-Number(k[1]))[0],q=C&&Number(C[1])<70?y(C[0]):"No urgent signal",V=u>0?"You sometimes feel certain before the concept is fully stable.":o>3?"Your confidence is becoming a useful signal for adaptation.":"Keep answering naturally; LearnBack will discover your learning pattern.",I=(h,k)=>`<div class="intel-meter"><div><span>${h}</span><b>${k}%</b></div><em><u style="width:${k}%"></u></em></div>`,T=(h,k,K,z)=>`<article class="intel-card"><div class="intel-icon">${h}</div><div><small>${z}</small><h3>${k}</h3><p>${K}</p></div></article>`;return`${w("LEARNBACK LEARNING INTELLIGENCE","Your learning profile, not just your score.","Start adaptive session","learn")}
  <section class="intel-hero"><div><small>LEARNING INTELLIGENCE</small><h2>How you learn is part of what you learn.</h2><p>LearnBack combines your answers, confidence, misconceptions, retention signals and transfer performance into one evolving learner model.</p><div class="intel-tags"><span>🧬 Fingerprint</span><span>🧠 Misconceptions</span><span>🎯 Confidence</span><span>⏳ Retention</span><span>🌍 Transfer</span></div></div><div class="intel-score"><span>${t}%</span><small>understanding</small></div></section>
  <section class="intel-grid"><div class="panel"><div class="head"><div><small>LEARNING FINGERPRINT</small><h3>Your current pattern</h3></div><span class="intel-live">LIVE</span></div>${I("Understanding",t)}${I("Retention",A)}${I("Transfer",m)}${I("Recovery",g)}${I("Confidence calibration",d)}</div>
  <div class="panel"><small>LEARNER INSIGHT</small><div class="star">✦</div><h3>${V}</h3><p>${o?`Based on ${o} analyzed learning signal${o===1?"":"s"}. The profile changes as you practice.`:"Your fingerprint is waiting for its first learning signals."}</p><div class="intel-callout">${u?`⚠ ${u} high-confidence signal${u>1?"s":""} need another check.`:"✓ No high-confidence misconception is currently flagged."}</div></div></section>
  <section class="intel-grid three">${T("🧬","Misconception DNA",L?`${y(L.concept)} is the latest misconception signal. ${v} total signal${v===1?"":"s"} recorded.`:"No recurring misconception has been identified yet.","MISCONCEPTION MAP")}${T("🎯","Confidence Calibration",i.length?`You were highly confident on ${i.length} answer${i.length===1?"":"s"}; ${u} still need verification.`:"Confidence data will become meaningful after more answers.","CONFIDENCE VS CORRECTNESS")}${T("⏳","Forgetting Radar",q==="No urgent signal"?"Previously learned concepts are not showing an urgent decline in this prototype signal model.":`${q} is currently your weakest tracked concept. A short retrieval check can prevent drift.`,"RETENTION SIGNAL")}</section>
  <section class="intel-grid three">${T("🌍","Transfer Testing",o?`Estimated transfer readiness is ${m}%. Next, LearnBack can test the same concept in a new context.`:"Transfer testing unlocks as you build a few answer signals.","SAME CONCEPT, NEW WORLD")}${T("↻","Recovery Ability",`${g}% recovery signal. ${v?"Your profile can track whether a misconception disappears after intervention.":"Recovery will be measured when LearnBack detects and repairs a misconception."}`,"LEARNING RECOVERY")}${T("→","Next Best Action",C?`Revisit ${y(C[0])} (${Math.round(Number(C[1]))}%) and then prove it in a different context.`:"Start a session so LearnBack can choose your first adaptive move.","ADAPTIVE RECOMMENDATION")}</section>
  <section class="panel intel-evidence"><div class="head"><div><small>WHY THIS PROFILE EXISTS</small><h3>Every interaction becomes evidence</h3></div><button class="link" data-modal="history">View history</button></div><div class="intel-flow"><span>Answer</span><b>→</b><span>Diagnose</span><b>→</b><span>Update learner model</span><b>→</b><span>Adapt</span><b>→</b><span>Re-test</span></div><p>This is a transparent prototype model: the displayed signals are derived from your stored mastery and answer history. As the engine grows, these same slots can be backed by stronger retention and transfer models.</p></section>`}function Y(){const s=Object.values(e.mastery),a=s.length?s.reduce((i,l)=>i+Number(l),0)/s.length:62,t=["primary_key","foreign_key","candidate_key","normalization"],n=["encapsulation","inheritance","polymorphism"],o=["lists","functions","oop_python","exceptions"],r=(i,l,b)=>{const u=e.mastery[i]??50;return`<button class="map-node ${u<60?"weak":u>=80?"strong":"developing"}" style="--x:${[10,35,60,85,30,55,80][l]}%;--y:${b==="dbms"?55:20}%" data-start="${b}"><span>${f(u)}%</span><b>${y(i)}</b><small>${u<60?"Needs attention":u<80?"Developing":"Strong"}</small></button>`};return`${w("LEARNING PROFILE","Your knowledge map","History","progress","history")}<section class="progresshero"><div><small>OVERALL UNDERSTANDING</small><b>${f(a)}%</b><p>Mastery is updated from observed evidence. The map shows relationships between concepts and where the next intervention can happen.</p></div><div class="ring"><span>${f(a)}%</span></div></section><section class="panel map-panel"><div class="head"><div><small>CONCEPT GRAPH</small><h3>How ideas connect</h3></div><span class="map-legend"><i></i> strong <i></i> developing <i></i> needs attention</span></div><div class="graph"><div class="graph-line l1"></div><div class="graph-line l2"></div><div class="graph-line l3"></div>${t.map((i,l)=>r(i,l,"dbms")).join("")}${n.map((i,l)=>r(i,l,"java")).join("")}${o.map((i,l)=>r(i,l,"python")).join("")}<div class="graph-label db">DBMS</div><div class="graph-label jv">JAVA</div><div class="graph-label py">PYTHON</div></div></section><div class="grid"><section class="panel"><small>CONCEPT MASTERY</small><h3>Tracked concepts</h3>${[...t,...n,...o].map(i=>M(y(i),e.mastery[i]??50,i)).join("")}</section><section class="panel"><small>ADAPTIVE RULE</small><h3>Why the next question changes</h3><p class="rule-copy">LearnBack prioritizes weaker concepts, then uses prerequisites and recent misconception signals to decide what to revisit.</p><div class="rule-card"><span>1</span><b>Find weak concept</b><small>lowest mastery / recent error</small></div><div class="rule-card"><span>2</span><b>Repair misconception</b><small>if confidence + answer pattern support it</small></div><div class="rule-card"><span>3</span><b>Test transfer</b><small>check whether understanding generalizes</small></div></section></div>`}function F(){const a=Object.entries(e.mastery).sort((l,b)=>l[1]-b[1])[0]||["primary_key",42],t=e.history.find(l=>l.misconception),n=e.history.filter(l=>l.is_correct).length,o=Math.min(5,Math.max(3,e.sessionTarget)),r=Math.min(100,Math.round(e.session.length/o*100)),i=[{n:"01",tag:"REPAIR",title:`Repair ${y(t?.concept||a[0])}`,text:t?`Revisit ${t.misconception_id} with a targeted example.`:"Start with your lowest-mastery concept and build a clean mental model.",topic:t?.topic||e.topic},{n:"02",tag:"REVIEW",title:`Strengthen ${y(a[0])}`,text:"Use a focused concept check, then retest without repeating the full topic.",topic:e.topic},{n:"03",tag:"TRANSFER",title:"Prove it in a new context",text:"Apply the idea to a slightly harder scenario so LearnBack can test whether understanding generalizes.",topic:e.topic}];return`${w("PERSONAL LEARNING PLAN","Your next learning moves","Start adaptive session","plan","learn")}
  <section class="plan-hero"><div><small>ADAPTIVE STUDY PLAN</small><h2>A short path built from your evidence.</h2><p>LearnBack turns your recent answers into a focused sequence: repair what is weak, review what is fading, then test transfer.</p></div><div class="goal-ring"><b>${r}%</b><span>today's goal</span></div></section>
  <div class="plan-goal"><div><small>TODAY'S GOAL</small><b>${Math.min(e.session.length,o)} / ${o} learning signals</b><span>${n?`${n} correct signals in your history.`:"Start your first session to create evidence."}</span></div><button class="primary" data-start="${e.topic}">Start plan →</button></div>
  <div class="plan-grid">${i.map(l=>`<article class="plan-card"><span class="plan-num">${l.n}</span><small>${l.tag}</small><h3>${l.title}</h3><p>${l.text}</p><button class="link" data-start="${l.topic}">Open this path →</button></article>`).join("")}</div>
  <section class="panel trend"><div class="head"><div><small>LEARNING TREND</small><h3>Recent evidence</h3></div><span class="trend-note">${e.history.length} signals stored</span></div><div class="trend-bars">${e.history.slice(0,12).reverse().map(l=>`<div title="${l.is_correct?"Correct":"Needs work"}"><i style="height:${l.is_correct?82:42}%"></i></div>`).join("")||'<div class="trend-empty">Complete a session to see your learning trend.</div>'}</div></section>`}function H(){return`${w("LEARNER PROFILE","Make LearnBack fit you","Close","profile","dashboard")}<section class="profile-hero"><div><small>PERSONALIZED LEARNING</small><h2>Tell LearnBack who is learning.</h2><p>Your profile shapes the learning plan, while your answers remain the strongest evidence of what you understand.</p></div><div class="profile-avatar">${e.name[0]?.toUpperCase()||"S"}</div></section><section class="panel profile-form"><div class="field"><label>Name</label><input id="p-name" value="${e.name}" maxlength="60" placeholder="Your name"></div><div class="field"><label>Level</label><select id="p-grade"><option ${e.grade==="School"?"selected":""}>School</option><option ${e.grade==="College"?"selected":""}>College</option><option ${e.grade==="University"?"selected":""}>University</option><option ${e.grade==="Professional"?"selected":""}>Professional</option></select></div><div class="field"><label>Learning goal</label><select id="p-goal"><option ${e.goal==="Build strong understanding"?"selected":""}>Build strong understanding</option><option ${e.goal==="Prepare for exams"?"selected":""}>Prepare for exams</option><option ${e.goal==="Fix weak concepts"?"selected":""}>Fix weak concepts</option><option ${e.goal==="Learn from fundamentals"?"selected":""}>Learn from fundamentals</option></select></div><div class="field"><label>Preferred answer mode</label><div class="choice-row">${["Text","Voice","Both"].map(s=>`<button data-pref="${s}" class="${e.preferred_input===s?"selected":""}">${s}</button>`).join("")}</div></div><div class="profile-save"><span id="profile-status">Profile changes are saved to your local learner database.</span><div class="profile-actions"><button class="ghost" id="logout">Log out</button><button class="primary" id="save-profile">Save profile →</button></div></div></section><div class="grid"><section class="panel"><small>WHAT PERSONALIZATION MEANS</small><h3>Profile + evidence</h3><p>LearnBack uses your level and goal to frame the experience, but it does not assume mastery from your profile. Concept mastery still comes from your actual learning signals.</p></section><section class="panel"><small>YOUR CURRENT FOCUS</small><h3>${e.goal}</h3><p>${e.attempts?`${e.attempts} learning signals have been collected so far.`:"Complete a first session to build your learning profile."}</p></section></div>`}function ae(){const s=e.history.filter(l=>l.misconception&&String(l.confidence).toLowerCase().includes("confident")).length,a=e.history.filter(l=>!l.is_correct).length,t=Math.max(42,Math.min(48,42+Math.floor(e.attempts/3))),n={foundation:Math.max(5,Math.min(12,8+Math.floor(a/3))),misconception:Math.max(4,Math.min(14,6+s)),developing:Math.max(9,Math.min(18,15+Math.floor(a/4))),advanced:Math.max(5,t-27)},o=Object.entries(e.mastery).sort((l,b)=>l[1]-b[1])[0],r=o?y(o[0]):"Foreign Key",i=o?Math.round(o[1]):54;return`${w("AI CLASSROOM COPILOT","Turn learning signals into teacher action","View knowledge map","classroom","progress")}
  <section class="classroom-hero"><div><small>TEACHER AI</small><h2>See what the class misunderstands — and decide what to do next.</h2><p>LearnBack aggregates student evidence into concept-level signals. AI suggests interventions; the teacher stays in control of the decision.</p><div class="hero-actions"><button class="primary" data-teacher-action="intervention">Create intervention →</button><button class="ghost" data-teacher-action="activity">Generate activity</button></div></div><div class="classroom-ring"><b>${Math.round(e.history.filter(l=>l.is_correct).length/Math.max(1,e.history.length)*100)||76}%</b><span>class understanding</span></div></section>
  <div class="stats classroom-stats"><div><small>STUDENTS</small><b>${t}</b><span>Active learners</span></div><div><small>CLASS MASTERY</small><b>76%</b><span>Concept estimate</span></div><div><small>NEEDS INTERVENTION</small><b>${n.misconception}</b><span>Grouped by need</span></div><div><small>HIGH-CONFIDENCE ERRORS</small><b>${s||5}</b><span>Priority signals</span></div></div>
  <div class="classroom-grid"><section class="panel ai-recommend"><div class="head"><div><small>AI RECOMMENDATION</small><h3>What needs attention?</h3></div><span class="status-dot">LIVE</span></div><div class="recommend-card"><div class="recommend-icon">!</div><div><b>${r} is the current bottleneck</b><p>${s||5} students show evidence that needs targeted recovery. A short comparison activity followed by a re-test is recommended.</p><div class="recommend-actions"><button class="primary" data-teacher-action="intervention">Build 5-min intervention</button><button class="link" data-modal="progress">Inspect evidence</button></div></div><strong>${i}%</strong></div></section>
  <section class="panel"><div class="head"><div><small>LEARNING GROUPS</small><h3>Act on needs, not marks</h3></div></div><div class="teacher-groups"><div><i>◉</i><div><b>Needs Foundation</b><span>${n.foundation} students • core concepts</span></div><button data-teacher-action="foundation">Open</button></div><div><i>!</i><div><b>Misconception Recovery</b><span>${n.misconception} students • targeted repair</span></div><button data-teacher-action="misconception">Open</button></div><div><i>↗</i><div><b>Developing</b><span>${n.developing} students • guided practice</span></div><button data-teacher-action="developing">Open</button></div><div><i>★</i><div><b>Advanced</b><span>${n.advanced} students • challenge path</span></div><button data-teacher-action="advanced">Open</button></div></div></section></div>
  <section class="panel intervention"><div class="head"><div><small>INTERVENTION OUTCOME</small><h3>Did teaching change understanding?</h3></div><span class="trend-note">AI measures before vs after</span></div><div class="before-after"><div><small>BEFORE</small><b>61%</b><em style="width:61%"></em></div><div class="arrow">→</div><div><small>AFTER</small><b>79%</b><em style="width:79%"></em></div><div class="gain">+18 pts</div></div></section>`}function U(){let s="";return e.history.length?s=e.history.map(a=>{const t=a.misconception?"!":"✓",n=a.is_correct?"Correct":"Needs work",o=a.created_at?new Date(a.created_at).toLocaleString():"recent";return`<article><i>${t}</i><div><b>${y(a.concept)}</b><p>${a.summary}</p><small>${a.confidence} • ${n} • ${a.misconception_id||"No misconception"} • ${o}</small></div></article>`}).join(""):s='<div class="empty"><div>◎</div><h3>No learning signals yet</h3><p>Start a session and LearnBack will build the profile as you answer.</p><button class="primary" data-start="dbms">Start first session →</button></div>',`${w("LEARNING HISTORY","What LearnBack has learned","Overview","dashboard")}<section class="panel"><div class="head"><div><small>RECENT SIGNALS</small><h3>Analyzed answers</h3></div><button class="link" id="reset">Reset demo</button></div><div class="history">${s}</div></section>`}async function x(s,a=!1){e.modal=null,e.topic=s,e.view="learn",e.q=null,e.answer="",e.confidence="",e.d=null,e.session=[],e.sessionStarted=Date.now(),e.demoMode=a,c();try{const t=await N(`${$}/api/next-question?topic=${s}`);e.q=await E(t)}catch{e.q={type:"CONCEPT CHECK",question:s==="dbms"?"What is the main purpose of a primary key in a database table?":s==="java"?"What does encapsulation mean in object-oriented programming?":"What is a Python list and when would you use one?",hint:"Explain it in your own words.",focus:s==="dbms"?"Primary Key":s==="java"?"Encapsulation":"Lists",concept:s==="dbms"?"primary_key":s==="java"?"encapsulation":"lists",difficulty:1,reason:"Local demo starter question"}}c()}function te(){const s=window.SpeechRecognition||window.webkitSpeechRecognition;if(!s)return;const a=new s;a.lang="en-IN",a.interimResults=!1,a.continuous=!1;const t=document.querySelector("#voice");t&&(t.textContent="🎙 Listening…",t.disabled=!0),a.onresult=n=>{e.answer=Array.from(n.results).map(o=>o[0].transcript).join(" "),c()},a.onerror=()=>c(),a.onend=()=>c(),a.start()}async function ne(){e.loading=!0,c();const s=e.q;try{const a=await N(`${$}/api/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:e.topic,question:s.question,answer:e.answer,confidence:e.confidence,question_index:e.attempts,concept_hint:s.concept})});if(!a.ok){const n=await E(a);throw new Error(n&&n.error||"analysis failed")}const t=await E(a);e.d=t,e.mastery[t.concept]=t.new_mastery??e.mastery[t.concept]??50,e.attempts++,e.session.push({correct:t.is_correct,confidence:e.confidence,misconception:t.misconception,concept:t.concept,label:t.concept_label}),e.history.unshift({concept:t.concept,summary:t.summary,misconception:t.misconception,confidence:e.confidence,is_correct:t.is_correct,misconception_id:t.misconception_id,created_at:new Date().toISOString()})}catch{e.d={is_correct:!1,concept:s.concept||"primary_key",concept_label:y(s.concept||"primary_key"),misconception:!1,misconception_id:null,confidence_assessment:"medium",summary:"The local learning engine is ready.",explanation:"The backend did not respond, so no answer was stored. Start npm run server and try again.",recovery:"Make sure the LearnBack backend is running on port 8787.",next_question:s.question,mastery_signal:0,mode:"setup"}}e.loading=!1,c()}async function ie(){if(e.session.length>=e.sessionTarget){e.d=null,e.view="summary",c();return}e.d=null,e.answer="",e.confidence="",e.q=null,c();try{const s=await N(`${$}/api/next-question?topic=${e.topic}`);e.q=await E(s)}catch{e.q={type:"TARGETED RETEST",question:e.topic==="dbms"?"Which column could uniquely identify every student in a Students table, and why?":e.topic==="java"?"Why might a Java class keep a field private and expose a public getter?":"When would you choose a Python list instead of a single variable?",hint:"Use a concrete example.",focus:e.topic==="dbms"?"Unique identification":e.topic==="java"?"Access control":"Lists",concept:e.topic==="dbms"?"primary_key":e.topic==="java"?"encapsulation":"lists",difficulty:2,reason:"Fallback targeted retest"}}c()}async function oe(){if(confirm("Reset the local LearnBack demo profile?")){try{await N(`${$}/api/reset`,{method:"POST"})}catch{}e.mastery={},e.attempts=0,e.history=[],e.session=[],e.modal=null,e.view="dashboard",e.demoMode=!1,await P(!0)}}async function le(){try{await N(`${$}/api/logout`,{method:"POST"})}catch{}localStorage.removeItem("learnback_session"),e.authenticated=!1,e.modal=null,e.view="dashboard",e.name="Student",e.mastery={},e.history=[],e.attempts=0,c()}async function re(){const s=(document.querySelector("#p-name")?.value||"Student").trim(),a=document.querySelector("#p-grade")?.value||"College",t=document.querySelector("#p-goal")?.value||"Build strong understanding";try{const n=await N(`${$}/api/profile`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,grade:a,goal:t,preferred_input:e.preferred_input})}),o=await E(n);e.name=o.user?.name||s,e.grade=o.user?.grade||a,e.goal=o.user?.goal||t,e.preferred_input=o.user?.preferred_input||e.preferred_input,e.modal=null,e.view="dashboard",c()}catch{const n=document.querySelector("#profile-status");n&&(n.textContent="Could not save. Make sure the backend is running.")}}function ce(){const s=[{id:"dbms",code:"DB",name:"Database Systems",desc:"Keys, relationships, normalization and misconceptions.",chapters:["Database Keys","Foreign Keys","Normalization"]},{id:"java",code:"JV",name:"Java OOP",desc:"Build object-oriented thinking from fundamentals to transfer.",chapters:["Encapsulation","Inheritance","Polymorphism"]},{id:"python",code:"PY",name:"Python Foundations",desc:"Core Python concepts with adaptive checks and recovery.",chapters:["Lists","Functions","Exceptions"]}];return`${w("LEARNING LIBRARY","Choose what you want to understand","Close","dashboard")}<div class="subject-grid">${s.map(a=>`<article class="subject-card"><div class="subject-icon">${a.code}</div><small>SUBJECT</small><h3>${a.name}</h3><p>${a.desc}</p><div class="chapter-list">${a.chapters.map((t,n)=>`<span><b>${n+1}</b>${t}</span>`).join("")}</div><button class="primary" data-start="${a.id}">Start adaptive path →</button></article>`).join("")}</div><section class="library-note"><b>How LearnBack chooses the next question</b><span>It looks at concept mastery, recent mistakes, confidence and prerequisite relationships instead of following a fixed quiz order.</span></section>`}function de(s){return s==="intelligence"?G():s==="classroom"?ae():s==="progress"?Y():s==="plan"?F():s==="history"?U():s==="profile"?H():s==="subjects"?ce():j()}function pe(){if(!e.modal)return"";const s=e.modal==="intelligence"?"Learning Intelligence":e.modal==="classroom"?"AI Classroom Copilot":e.modal==="progress"?"Knowledge map":e.modal==="plan"?"Learning plan":e.modal==="history"?"History":e.modal==="profile"?"My profile":e.modal==="subjects"?"Subjects":"Overview";return`<div class="modal-overlay" id="modal-overlay"><div class="modal-sheet" role="dialog" aria-modal="true" aria-label="${s}"><div class="modal-bar"><div><span class="modal-dot"></span><b>${s}</b></div><button class="modal-close" id="modal-close" aria-label="Close">×</button></div><div class="modal-content">${de(e.modal)}</div></div></div>`}function ue(){const s=document.querySelector("#landing-cta");s&&(s.onclick=()=>{const p=document.querySelector("#landing-shell");p?(p.classList.add("lp-exit"),setTimeout(()=>{e.landing=!1,c()},520)):(e.landing=!1,c())});const a=document.querySelector("#landing-feature-slider");if(a){const p=a.querySelectorAll(".lp-phrase");let v=0;const S=()=>{p[v].classList.remove("active"),p[v].classList.add("exit"),setTimeout(()=>{p[v].classList.remove("exit")},460),v=(v+1)%p.length,p[v].classList.add("active")};window.__landingSliderInterval&&clearInterval(window.__landingSliderInterval),window.__landingSliderInterval=setInterval(S,2800)}const t=["Dashboard Overview","Adaptive Question","AI Diagnosis","Knowledge Map"];let n=0,o=null;function r(p){const v=document.querySelectorAll(".lp-screen"),S=document.querySelectorAll(".lp-dot"),A=document.querySelector("#lp-screen-label");if(v.forEach((m,g)=>{g===n&&g!==p?(m.classList.add("lp-screen-exit"),m.classList.remove("lp-screen-active")):g!==p&&m.classList.remove("lp-screen-active","lp-screen-exit")}),requestAnimationFrame(()=>{v.forEach((m,g)=>{g===p?(m.classList.add("lp-screen-active"),m.classList.remove("lp-screen-exit")):g===n&&setTimeout(()=>m.classList.remove("lp-screen-exit"),560)})}),S.forEach((m,g)=>{m.classList.toggle("active",g===p),m.setAttribute("aria-selected",String(g===p))}),A&&(A.textContent=t[p]),n=p,p===1){const m=document.querySelector("#lp-typing");if(m){m.textContent="";const g="It connects two tables, like a link.";let d=0;o&&clearTimeout(o);const L=()=>{document.querySelector("#lp-typing")&&d<g.length&&(m.textContent=g.slice(0,++d),o=setTimeout(L,52))};o=setTimeout(L,750)}}else o&&(clearTimeout(o),o=null)}document.querySelectorAll(".lp-dot").forEach(p=>{p.onclick=()=>{const v=Number(p.dataset.dot||0);o&&(clearTimeout(o),o=null),r(v),b()}}),window.__landingReelTimer&&clearInterval(window.__landingReelTimer);let i;const l=()=>{i=setInterval(()=>{r((n+1)%4)},3600)},b=()=>{i!==void 0&&clearInterval(i),l()};l(),window.__landingReelTimer=i;const u=document.querySelector("#landing-particles");if(u){const p=u.getContext("2d");if(!p)return;const v=()=>{u.width=u.offsetWidth,u.height=u.offsetHeight};v();const S=new ResizeObserver(v);S.observe(u.parentElement||document.body);const A=[];for(let d=0;d<140;d++){const L=Math.random()<.45;A.push({x:Math.random()*u.width,y:Math.random()*u.height,r:Math.random()*1.6+.15,vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.12,a:Math.random()*.55+.06,va:(Math.random()-.5)*.0025,hue:L?265+Math.random()*40:0})}let m;const g=()=>{if(!document.querySelector("#landing-particles")){cancelAnimationFrame(m),S.disconnect();return}p.clearRect(0,0,u.width,u.height);for(const d of A)d.x+=d.vx,d.y+=d.vy,d.a+=d.va,d.x<-2&&(d.x=u.width+2),d.x>u.width+2&&(d.x=-2),d.y<-2&&(d.y=u.height+2),d.y>u.height+2&&(d.y=-2),d.a<.04&&(d.va=Math.abs(d.va)),d.a>.62&&(d.va=-Math.abs(d.va)),p.beginPath(),p.arc(d.x,d.y,d.r,0,Math.PI*2),d.hue>0?p.fillStyle=`hsla(${d.hue},80%,75%,${d.a})`:p.fillStyle=`rgba(235,225,255,${d.a})`,p.fill();m=requestAnimationFrame(g)};g()}}function ve(){const s=document.querySelector("#auth-particles");if(!s)return;const a=s.getContext("2d");if(!a)return;const t=()=>{s.width=s.offsetWidth,s.height=s.offsetHeight};t(),window.addEventListener("resize",t);const n=[];for(let i=0;i<90;i++){const l=Math.random()<.5;n.push({x:Math.random()*s.width,y:Math.random()*s.height,r:Math.random()*1.4+.15,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.1,a:Math.random()*.5+.06,va:(Math.random()-.5)*.002,hue:l?265+Math.random()*40:0})}let o;const r=()=>{if(!document.querySelector("#auth-particles")){cancelAnimationFrame(o);return}a.clearRect(0,0,s.width,s.height);for(const i of n)i.x+=i.vx,i.y+=i.vy,i.a+=i.va,i.x<0&&(i.x=s.width),i.x>s.width&&(i.x=0),i.y<0&&(i.y=s.height),i.y>s.height&&(i.y=0),i.a<.04&&(i.va=Math.abs(i.va)),i.a>.55&&(i.va=-Math.abs(i.va)),a.beginPath(),a.arc(i.x,i.y,i.r,0,Math.PI*2),a.fillStyle=i.hue>0?`hsla(${i.hue},80%,75%,${i.a})`:`rgba(235,225,255,${i.a})`,a.fill();o=requestAnimationFrame(r)};r()}function B(){document.querySelectorAll("[data-auth-switch]").forEach(s=>s.onclick=()=>{e.authMode=s.dataset.authSwitch,e.authError="",c()}),document.querySelector("#auth-submit")?.addEventListener("click",D),document.querySelector("#auth-password")?.addEventListener("keydown",s=>{s.key==="Enter"&&D()}),document.querySelector("#dm-toggle")?.addEventListener("click",()=>{e.darkMode=!e.darkMode,localStorage.setItem("lb_dark",e.darkMode?"1":"0"),c()}),document.querySelectorAll("[data-modal]").forEach(s=>s.onclick=()=>{const a=s.dataset.modal;if(a==="dashboard"){e.modal=null,e.view="dashboard",c();return}e.modal=a,c()}),document.querySelectorAll("[data-v]").forEach(s=>s.onclick=()=>{const a=s.dataset.v;if(a==="learn"){e.modal=null,x(e.topic);return}e.modal=null,e.view=a,c()}),document.querySelector("#modal-close")?.addEventListener("click",()=>{e.modal=null,c()}),document.querySelector("#modal-overlay")?.addEventListener("click",s=>{s.target===s.currentTarget&&(e.modal=null,c())}),document.querySelectorAll("[data-start]").forEach(s=>s.onclick=()=>x(s.dataset.start)),document.querySelectorAll("[data-teacher-action]").forEach(s=>s.onclick=()=>{const a=String(s.dataset.teacherAction||"");if(a==="intervention"||a==="activity"){e.modal="classroom",c(),setTimeout(()=>O(a==="intervention"?"Intervention builder opened — review the AI recommendation before assigning.":"Activity generator opened — review and customize the generated activity."),0);return}O(`Teacher group selected: ${a}.`)}),document.querySelectorAll("[data-demo]").forEach(s=>s.onclick=()=>x("dbms",!0)),document.querySelector("[data-fill-demo]")?.addEventListener("click",()=>{e.answer="It connects two tables, like a link between records.",e.confidence="Very confident",c(),O("Sample misconception loaded — analyze it to see LearnBack adapt.")}),document.querySelectorAll("[data-c]").forEach(s=>s.onclick=()=>{e.confidence=s.dataset.c,c()}),document.querySelector("#answer")?.addEventListener("input",s=>{e.answer=s.target.value}),document.querySelector("#submit")?.addEventListener("click",ne),document.querySelector("#continue")?.addEventListener("click",ie),document.querySelector("#voice")?.addEventListener("click",te),document.querySelector("#reset")?.addEventListener("click",oe),document.querySelectorAll("[data-pref]").forEach(s=>s.onclick=()=>{e.preferred_input=s.dataset.pref,c()}),document.querySelector("#save-profile")?.addEventListener("click",re),document.querySelector("#logout")?.addEventListener("click",le),document.querySelectorAll("[data-peer]").forEach(s=>s.onclick=()=>{const a=s.dataset.peer,t=document.querySelector(`#peer-note-${a}`);if(t){const n=t.hidden;t.hidden=!n,t.classList.toggle("show",n),s.textContent=n?"Hide reasoning note ↑":"Notice the reasoning →",n&&(t.scrollIntoView({behavior:"smooth",block:"center"}),t.style.boxShadow="0 0 0 3px rgba(112, 87, 232, 0.13)",setTimeout(()=>t.style.boxShadow="",700))}}),document.querySelectorAll("[data-peer-index]").forEach(s=>s.onclick=()=>{const a=s.dataset.peerIndex,t=document.querySelector(`#peer-note-${a}`);if(t){const n=t.hidden;t.hidden=!n,t.classList.toggle("show",n),s.textContent=n?"Hide reasoning note ↑":"Notice the reasoning →",n&&(t.scrollIntoView({behavior:"smooth",block:"center"}),t.style.boxShadow="0 0 0 3px rgba(112, 87, 232, 0.13)",setTimeout(()=>t.style.boxShadow="",700))}}),document.querySelectorAll("[data-peer-reflect]").forEach(s=>s.onclick=()=>{e.d=null,e.view="learn",c(),setTimeout(()=>{const a=document.querySelector("#answer");a&&(a.focus(),a.scrollIntoView({behavior:"smooth",block:"center"}),a.setSelectionRange(0,a.value.length),a.style.boxShadow="0 0 0 3px rgba(112, 87, 232, 0.18)",setTimeout(()=>a.style.boxShadow="",1200)),O("Revise your reasoning in the answer box.")},50)})}function O(s){e.toast=s,c(),window.setTimeout(()=>{e.toast===s&&(e.toast="",c())},3200)}document.addEventListener("keydown",s=>{s.key==="Escape"&&e.modal&&(e.modal=null,c())});function c(){if(document.body.classList.toggle("dark",e.darkMode),e.booting){R.innerHTML='<div class="boot"><div class="logo big">L</div><h2>Loading your learning profile…</h2></div>';return}if(!e.authenticated){R.innerHTML=Z(),B(),ve();return}if(e.landing){R.innerHTML=J(),ue();return}R.innerHTML=`<div class="shell">${X()}<main>${e.view==="dashboard"?j():e.view==="learn"?Q():e.view==="progress"?Y():e.view==="summary"?se():e.view==="plan"?F():e.view==="profile"?H():e.view==="intelligence"?G():U()}</main></div>${pe()}${e.toast?`<div class="toast" role="status"><span>✦</span>${e.toast}</div>`:""}`,B()}async function P(s=!1){e.booting=!s,c();try{const a=await N(`${$}/api/profile`);if(a.status===401){e.authenticated=!1,e.booting=!1,c();return}const t=await E(a);e.authenticated=!0,e.name=t.user?.name||"Student",e.grade=t.user?.grade||"College",e.goal=t.user?.goal||"Build strong understanding",e.preferred_input=t.user?.preferred_input||"Text",e.attempts=Number(t.attempts||0),e.mastery=t.mastery||{},e.map=t.concepts||[];const n=await N(`${$}/api/history`),o=await E(n);e.history=o.items||[]}catch{}e.booting=!1,e.authenticated&&!s&&(e.landing=!0),c()}P();
