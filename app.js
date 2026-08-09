/* ============================================================
 *  工作台❤️  ——  多模块可编辑工作台（树洞风格复刻）
 * ============================================================ */

(function(){
  'use strict';

  // ---------- 12 个模块定义 ----------
  var MODULES = [
    {
      id:'habit', name:'习惯养成',
      icon:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
      quote:'养成一个好习惯，从今天开始。',
      quiet:'坚持打卡，看见自己的成长。',
      title:'写下你的习惯',
      moodText:'今日状态',
      reply:'慢慢来，你比昨天更好了'
    },
    {
      id:'money', name:'记账存钱',
      icon:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9.5v5M10.5 11h3"/>',
      quote:'每一笔记录，都是对未来的负责。',
      quiet:'理性消费，慢慢变富。',
      title:'记录今日收支',
      moodText:'今日消费心情',
      reply:'记账是变富的第一步，继续加油'
    },
    {
      id:'fitness', name:'健身',
      icon:'<path d="M6 9v6M18 9v6M6 12h12M9 6v12M15 6v12M9 9h6v6H9z"/>',
      quote:'运动带来的不仅是身材，还有好心情。',
      quiet:'每一次流汗，都是进步的证明。',
      title:'今日运动打卡',
      moodText:'运动心情',
      reply:'今天的你已经很棒了，明天继续'
    },
    {
      id:'work', name:'工作',
      icon:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/>',
      quote:'高效工作，是为了更好的生活。',
      quiet:'把任务一件件完成，成就感满满。',
      title:'工作计划',
      moodText:'工作状态',
      reply:'工作再忙，也别忘了休息眼睛'
    },
    {
      id:'news', name:'新闻热点',
      icon:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 12h8M8 15h5"/>',
      quote:'关注世界，也关注自己。',
      quiet:'记录重要资讯，保持信息敏锐。',
      title:'今日热点记录',
      moodText:'阅读心情',
      reply:'世界很大，信息很多，保持独立思考'
    },
    {
      id:'english', name:'学习英语',
      icon:'<path d="M4 5h16v14H4z"/><path d="M4 9h16M12 5v14"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/>',
      quote:'语言是打开世界的钥匙。',
      quiet:'每天进步一点点，坚持就是胜利。',
      title:'英语学习笔记',
      moodText:'学习心情',
      reply:'Keep going, you are doing great!'
    },
    {
      id:'diary', name:'心情日记',
      icon:'<path d="M12 21s-7-4.35-7-10a5 5 0 019-3 5 5 0 019 3c0 5.65-7 10-7 10z"/>',
      quote:'在这里，记录最真实的自己。',
      quiet:'每一种情绪，都值得被看见。',
      title:'写下今天的心情',
      moodText:'此刻心情',
      reply:'不管今天怎样，明天又是新的一天'
    },
    {
      id:'review', name:'每月复盘',
      icon:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      quote:'复盘，是为了更好地出发。',
      quiet:'总结经验，让下个月更精彩。',
      title:'本月复盘',
      moodText:'整体状态',
      reply:'总结是为了成长，你已经走在路上了'
    },
    {
      id:'finance', name:'财经新闻',
      icon:'<path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>',
      quote:'把握趋势，做出明智选择。',
      quiet:'关注财经，规划自己的未来。',
      title:'财经观察',
      moodText:'市场心情',
      reply:'理财是一场马拉松，稳健才能致远'
    },
    {
      id:'blog', name:'博客',
      icon:'<path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4M8 12h8M8 16h6"/>',
      quote:'写作，是思考最好的方式。',
      quiet:'记录想法，留下成长的痕迹。',
      title:'写作灵感',
      moodText:'写作心情',
      reply:'每一个字，都是你思考的结晶'
    },
    {
      id:'reading', name:'读书计划',
      icon:'<path d="M4 4h7v16H4zM13 4h7v16h-7z"/><path d="M4 6h7M13 6h7"/>',
      quote:'阅读，让我们成为更好的自己。',
      quiet:'书中有答案，也有新的问题。',
      title:'读书笔记',
      moodText:'阅读感受',
      reply:'愿你在书里找到光'
    },
    {
      id:'movie', name:'电影',
      icon:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none"/>',
      quote:'电影让我们体验千百种人生。',
      quiet:'光影之间，看见生活的另一种可能。',
      title:'观影记录',
      moodText:'观影心情',
      reply:'好电影值得被记住，祝你观影愉快'
    }
  ];

  var MOODS = [
    {emo:'😊', label:'开心'},
    {emo:'😢', label:'难过'},
    {emo:'😰', label:'焦虑'},
    {emo:'😡', label:'愤怒'},
    {emo:'😐', label:'迷茫'},
    {emo:'🥰', label:'感恩'}
  ];

  var currentId = 'habit';
  var STORAGE_KEY = 'workbench_v2';

  // ---------- localStorage ----------
  function loadData(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }catch(e){ return {}; }
  }
  function saveData(data){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }catch(e){}
  }
  function getItem(id, key){ return (loadData()[id] || {})[key] || ''; }
  function setItem(id, key, value){
    var all = loadData();
    if(!all[id]) all[id] = {};
    all[id][key] = value;
    saveData(all);
  }
  function getHistory(id){ return (loadData()[id] || {}).history || []; }
  function pushHistory(id, text){
    var all = loadData();
    if(!all[id]) all[id] = {};
    if(!all[id].history) all[id].history = [];
    all[id].history.unshift({ text: text, time: new Date().toLocaleString('zh-CN') });
    saveData(all);
  }
  function clearHistory(id){
    var all = loadData();
    if(all[id]) all[id].history = [];
    saveData(all);
  }

  // ---------- 渲染菜单 ----------
  function renderMenu(){
    var menu = document.getElementById('menu');
    menu.innerHTML = MODULES.map(function(m){
      var active = m.id === currentId;
      var inner = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+m.icon+'</svg><span>'+m.name+'</span>';
      return '<a class="menu-item'+(active?' active':'')+'" href="#" data-id="'+m.id+'">'+(active?'<span class="menu-active-pill">'+inner+'</span>':inner)+'</a>';
    }).join('');

    menu.querySelectorAll('.menu-item').forEach(function(item){
      item.addEventListener('click', function(e){
        e.preventDefault();
        var id = item.getAttribute('data-id');
        if(id !== currentId){
          currentId = id;
          renderMenu();
          renderMain();
        }
      });
    });
  }

  // ---------- 渲染主区 ----------
  function renderMain(){
    var m = MODULES.find(function(x){ return x.id === currentId; });
    if(!m) return;

    var savedText = getItem(m.id, 'text');
    var savedMood = getItem(m.id, 'mood');
    var history = getHistory(m.id);

    var html = '';

    // Hero
    html += '<section class="hero">';
    html +=   '<h1>工作台❤️</h1>';
    html +=   '<p class="sub">'+m.name+'</p>';
    html +=   '<div class="hero-card">';
    html +=     TREE_ART;
    html +=     '<p class="quote">'+m.quote+'</p>';
    html +=     '<p class="quote quiet">'+m.quiet+'</p>';
    html +=   '</div>';
    html += '</section>';

    // 编辑卡片
    html += '<section class="card write-card">';
    html +=   '<h2 class="card-title"><svg class="title-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#3a3a3a"/></svg>'+m.title+'</h2>';
    html +=   '<textarea id="editor" placeholder="今天想说点什么...">'+escapeHtml(savedText)+'</textarea>';
    html +=   '<div class="mood-grid">'+
                MOODS.map(function(mo){
                  var cls = (mo.label === savedMood) ? ' mood selected' : '';
                  return '<button class="mood'+cls+'" data-mood="'+mo.label+'">'+mo.label+'</button>';
                }).join('')+
              '</div>';
    html +=   '<button class="btn-primary" id="saveBtn">保存到 '+m.name+'</button>';
    html += '</section>';

    // 回复卡片
    html += '<section class="card reply-card">';
    html +=   '<h2 class="card-title"><svg class="title-icon" viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="5" width="18" height="14" rx="2" fill="#ffd9d9"/><path d="M3 7l9 7 9-7" fill="none" stroke="#d34a4a" stroke-width="1.6"/></svg>回复</h2>';
    html +=   '<div class="reply-body"><p class="reply-text">'+m.reply+'</p></div>';
    html += '</section>';

    // 记录卡片
    html += '<section class="card record-card">';
    html +=   '<div class="record-head">';
    html +=     '<h2 class="card-title"><svg class="title-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M4 4h6v16H4zM14 4h6v16h-6z" fill="none" stroke="#3a3a3a" stroke-width="1.6"/><path d="M6 8h2M6 12h2M16 8h2M16 12h2" stroke="#3a3a3a" stroke-width="1.6"/></svg>'+m.name+'记录</h2>';
    html +=     '<button class="btn-clear" id="clearBtn">清空</button>';
    html +=   '</div>';
    if(history.length === 0){
      html += '<p class="empty">还没有'+m.name+'记录~</p>';
    } else {
      html += '<ul class="record-list">';
      history.slice(0, 10).forEach(function(h){
        var snippet = escapeHtml(h.text.slice(0, 40) || '空记录');
        if(h.text.length > 40) snippet += '...';
        html += '<li class="record-item"><span class="record-text">'+snippet+'</span><span class="record-time">'+h.time+'</span></li>';
      });
      html += '</ul>';
    }
    html += '</section>';

    html += '<footer class="foot"><svg class="foot-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M14 3v2h-2V3H8v2H6v14h12V5h-2V3h-2zm0 4h-4V5h4v2z" fill="#8a8a8a"/></svg>工作台❤️ · '+new Date().getFullYear()+'</footer>';

    document.getElementById('main').innerHTML = html;
    document.getElementById('main').scrollTop = 0;

    bindEvents(m);
  }

  function bindEvents(m){
    var editor = document.getElementById('editor');
    var saveBtn = document.getElementById('saveBtn');
    var clearBtn = document.getElementById('clearBtn');
    var moodBtns = document.querySelectorAll('.mood');

    // 情绪选择
    moodBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        moodBtns.forEach(function(b){ b.classList.remove('selected'); });
        btn.classList.add('selected');
        setItem(m.id, 'mood', btn.getAttribute('data-mood'));
      });
    });

    // 保存
    saveBtn.addEventListener('click', function(){
      var text = editor.value;
      setItem(m.id, 'text', text);
      pushHistory(m.id, text);
      var original = saveBtn.textContent;
      saveBtn.textContent = '已保存 ✓';
      setTimeout(function(){ saveBtn.textContent = original; }, 1200);
    });

    // 清空
    clearBtn.addEventListener('click', function(){
      clearHistory(m.id);
      renderMain();
    });
  }

  // ---------- 小树插画 ----------
  var TREE_ART = '<svg class="tree-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="48" rx="14" ry="3" fill="#7fb46a" opacity=".25"/><path d="M30 32 L30 56 L34 56 L34 32 Z" fill="#7a5a3a"/><path d="M32 14 C20 14 14 22 14 30 C14 34 16 37 19 39 C17 41 16 44 17 47 C18 50 22 51 25 50 C26 53 29 55 32 55 C35 55 38 53 39 50 C42 51 46 50 47 47 C48 44 47 41 45 39 C48 37 50 34 50 30 C50 22 44 14 32 14 Z" fill="#9bd07d"/><path d="M32 14 C24 14 18 19 16 26 C20 22 25 20 31 20 C37 20 42 22 46 26 C45 21 42 17 38 15 C36 14 34 14 32 14 Z" fill="#b6de9a"/><circle cx="26" cy="24" r="3" fill="#7eb963"/><circle cx="38" cy="22" r="3" fill="#7eb963"/><circle cx="42" cy="30" r="3" fill="#7eb963"/><circle cx="22" cy="32" r="3" fill="#7eb963"/><circle cx="30" cy="38" r="2.5" fill="#7eb963"/><circle cx="36" cy="40" r="2.5" fill="#7eb963"/></svg>';

  // ---------- 工具 ----------
  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function updateTime(){
    var d = new Date();
    var el = document.getElementById('realTime');
    if(el) el.textContent = String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  }

  // ---------- 启动 ----------
  renderMenu();
  renderMain();
  updateTime();
  setInterval(updateTime, 30*1000);

})();
