/* ============================================================
 *  工作台  ——  12 模块 + 电子小猫咪
 * ============================================================ */
(function(){
'use strict';

/* ========== 工具 ========== */
var $ = function(s,ctx){ return (ctx||document).querySelector(s); };
var $$ = function(s,ctx){ return [].slice.call((ctx||document).querySelectorAll(s)); };
var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
var STORE = 'workbench_v3';
function load(){ try{ return JSON.parse(localStorage.getItem(STORE))||{}; }catch(e){ return {}; } }
function save(d){ try{ localStorage.setItem(STORE, JSON.stringify(d)); }catch(e){} }
function get(key, def){ var d=load(); return d[key]!==undefined?d[key]:def; }
function set(key, val){ var d=load(); d[key]=val; save(d); }
function todayKey(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function monthKey(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

/* ========== 模块定义 ========== */
var MODULES = [
  {id:'habit',name:'习惯养成',icon:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>'},
  {id:'money',name:'记账存钱',icon:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9.5v5M10.5 11h3"/>'},
  {id:'fitness',name:'健身',icon:'<path d="M6 9v6M18 9v6M6 12h12M9 6v12M15 6v12M9 9h6v6H9z"/>'},
  {id:'work',name:'工作',icon:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/>'},
  {id:'news',name:'新闻热点',icon:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 12h8M8 15h5"/>'},
  {id:'english',name:'学习英语',icon:'<path d="M4 5h16v14H4z"/><path d="M4 9h16M12 5v14"/>'},
  {id:'diary',name:'心情日记',icon:'<path d="M12 21s-7-4.35-7-10a5 5 0 019-3 5 5 0 019 3c0 5.65-7 10-7 10z"/>'},
  {id:'review',name:'每月复盘',icon:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'},
  {id:'finance',name:'财经新闻',icon:'<path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>'},
  {id:'fintax',name:'财务政策',icon:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>'},
  {id:'blog',name:'播客',icon:'<path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4M8 12h8M8 16h6"/>'},
  {id:'reading',name:'读书计划',icon:'<path d="M4 4h7v16H4zM13 4h7v16h-7z"/><path d="M4 6h7M13 6h7"/>'},
  {id:'movie',name:'电影',icon:'<rect x="3" y="5" width="18" height="14" rx="2"/>'}
];

var MOODS = ['开心','难过','焦虑','愤怒','迷茫','感恩'];
var currentId = 'habit';

/* ========== 渲染菜单 ========== */
function renderMenu(){
  var menu = $('#menu');
  menu.innerHTML = MODULES.map(function(m){
    var active = m.id===currentId;
    var inner = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+m.icon+'</svg><span>'+m.name+'</span>';
    return '<a class="menu-item'+(active?' active':'')+'" href="#" data-id="'+m.id+'">'+(active?'<span class="menu-active-pill">'+inner+'</span>':inner)+'</a>';
  }).join('');
  $$('.menu-item',menu).forEach(function(item){
    item.addEventListener('click',function(e){ e.preventDefault();
      if(item.dataset.id!==currentId){ currentId=item.dataset.id; renderMenu(); renderMain(); }
    });
  });
}

/* ========== 渲染主区 ========== */
function renderMain(){
  var m = MODULES.find(function(x){return x.id===currentId;});
  var renderers = {habit:renderHabit,money:renderMoney,fitness:renderFitness,work:renderWork,
    news:renderNews,english:renderEnglish,diary:renderDiary,review:renderReview,
    finance:renderFinance,fintax:renderFinTax,blog:renderBlog,reading:renderReading,movie:renderMovie};
  $('#main').innerHTML = (renderers[m.id]||function(){return '';})();
  $('#main').scrollTop = 0;
  var after = {habit:bindHabit,money:bindMoney,fitness:bindFitness,work:bindWork,
    news:loadNews,english:bindEnglish,diary:bindDiary,review:bindReview,
    finance:loadFinance,fintax:loadFinTax,blog:loadBlog,reading:function(){},movie:function(){}};
  if(after[m.id]) after[m.id]();
}

/* ========== Hero 通用 ========== */
function hero(title,sub,quote,quiet){
  return '<section class="hero"><h1>'+esc(title)+'</h1><p class="sub">'+esc(sub)+'</p>'+
    '<div class="hero-card">'+TREE_ART+
    '<p class="quote">'+esc(quote)+'</p><p class="quote quiet">'+esc(quiet)+'</p></div></section>';
}
var TREE_ART = '<svg class="tree-svg" viewBox="0 0 64 64"><ellipse cx="32" cy="48" rx="14" ry="3" fill="#7fb46a" opacity=".25"/><path d="M30 32L30 56L34 56L34 32Z" fill="#7a5a3a"/><path d="M32 14C20 14 14 22 14 30C14 34 16 37 19 39C17 41 16 44 17 47C18 50 22 51 25 50C26 53 29 55 32 55C35 55 38 53 39 50C42 51 46 50 47 47C48 44 47 41 45 39C48 37 50 34 50 30C50 22 44 14 32 14Z" fill="#9bd07d"/><path d="M32 14C24 14 18 19 16 26C20 22 25 20 31 20C37 20 42 22 46 26C45 21 42 17 38 15C36 14 34 14 32 14Z" fill="#b6de9a"/><circle cx="26" cy="24" r="3" fill="#7eb963"/><circle cx="38" cy="22" r="3" fill="#7eb963"/><circle cx="42" cy="30" r="3" fill="#7eb963"/><circle cx="22" cy="32" r="3" fill="#7eb963"/></svg>';

/* ========== 1. 习惯养成 ========== */
function renderHabit(){
  var habits = get('habits',[
    {id:'water',name:'每日晨喝温开水',streak:0,lastDate:''}
  ]);
  var today = todayKey();
  habits.forEach(function(h){
    if(h.lastDate===today){
      // 今日已打卡
    }
  });
  var html = hero('工作台❤️','习惯养成','坚持打卡，养成好习惯','每一次坚持，都是更好的自己');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#6aac56"></span>今日习惯</h2>';
  html += habits.map(function(h){
    var done = h.lastDate===today;
    return '<div class="habit-item"><div class="habit-check'+(done?' done':'')+'" data-id="'+h.id+'"></div>'+
      '<div class="habit-label">'+esc(h.name)+'</div>'+
      '<div class="habit-streak">连续 '+h.streak+' 天</div></div>';
  }).join('');
  html += '</section>';
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#6aac56"></span>添加新习惯</h2>';
  html += '<div class="task-add-row"><input type="text" class="input" id="newHabit" placeholder="如：早睡早起"><button class="btn-small" id="addHabit">添加</button></div></section>';
  return html;
}
function bindHabit(){
  var habits = get('habits',[]);
  var today = todayKey();
  $$('.habit-check').forEach(function(c){
    c.addEventListener('click',function(){
      var id = c.dataset.id;
      var h = habits.find(function(x){return x.id===id;});
      if(!h) return;
      if(h.lastDate===today){
        // 取消打卡
        h.lastDate=''; h.streak=Math.max(0,h.streak-1);
        c.classList.remove('done');
      } else {
        // 打卡
        var yest = new Date(); yest.setDate(yest.getDate()-1);
        var yk = yest.getFullYear()+'-'+(yest.getMonth()+1)+'-'+yest.getDate();
        if(h.lastDate===yk) h.streak++; else h.streak=1;
        h.lastDate=today;
        c.classList.add('done');
        feedCat(1,'习惯打卡 +1 鸡腿！');
      }
      set('habits',habits);
      c.parentNode.querySelector('.habit-streak').textContent='🔥 连续 '+h.streak+' 天';
    });
  });
  $('#addHabit').addEventListener('click',function(){
    var v=$('#newHabit').value.trim();
    if(v){ habits.push({id:uid(),name:v,streak:0,lastDate:''}); set('habits',habits); renderMain(); bindHabit(); }
  });
}

/* ========== 2. 记账存钱 ========== */
function renderMoney(){
  var goal = get('money_goal', 50000);
  var saved = get('money_saved', 0);
  var expenses = get('money_expenses', []);
  var pct = Math.min(100, Math.round(saved/goal*100));
  var html = hero('工作台❤️','记账存钱','每一笔记录，都是对未来的负责','理性消费，慢慢变富');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e8a84b"></span>存钱计划</h2>';
  html += '<div class="saving-progress"><div class="saving-label"><span>已存 ¥'+saved+'</span><span>目标 ¥'+goal+'</span></div>';
  html += '<div class="saving-bar"><div class="saving-fill" style="width:'+pct+'%"></div></div>';
  html += '<div style="text-align:center;font-size:12px;color:#999;margin-top:6px">完成度 '+pct+'%</div></div>';
  html += '<div class="task-add-row"><input type="number" class="input" id="addSave" placeholder="存入金额"><button class="btn-small" id="doSave">存入</button></div></section>';
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e8a84b"></span>记一笔支出</h2>';
  html += '<div class="expense-row"><input type="text" class="input" id="expName" placeholder="用途"><input type="number" class="input" id="expAmt" placeholder="金额" style="max-width:90px"><button class="btn-small" id="addExp">记</button></div>';
  if(expenses.length){
    html += '<div class="expense-list">'+expenses.slice(-10).reverse().map(function(e){
      return '<div class="expense-item"><span>'+esc(e.name)+'</span><span class="amt">-¥'+e.amt+'</span><span style="color:#ccc;font-size:11px">'+esc(e.time)+'</span></div>';
    }).join('')+'</div>';
  }
  html += '<div class="warn-box" id="warnBox" style="display:none"></div></section>';
  return html;
}
function bindMoney(){
  var saved = get('money_saved',0);
  $('#doSave').addEventListener('click',function(){
    var v=parseFloat($('#addSave').value);
    if(v>0){ saved+=v; set('money_saved',saved); feedCat(1,'存钱 +1 鸡腿！'); renderMain(); bindMoney(); }
  });
  $('#addExp').addEventListener('click',function(){
    var name=$('#expName').value.trim();
    var amt=parseFloat($('#expAmt').value);
    if(name&&amt>0){
      var expenses=get('money_expenses',[]);
      expenses.push({name:name,amt:amt,time:new Date().toLocaleDateString('zh-CN')});
      set('money_expenses',expenses);
      // 劝诫
      var warns = [
        '这笔钱非花不可吗？想想你的5万目标！',
        '省下这笔，离目标又近了一步！',
        '需要vs想要，再想想～',
        '小钱攒起来就是大钱，三思！',
        '猫咪心疼地看着你的钱包...'
      ];
      var w = warns[Math.floor(Math.random()*warns.length)];
      var wb=$('#warnBox'); wb.textContent='🐱 '+w; wb.style.display='block';
      setTimeout(function(){ renderMain(); bindMoney(); },1500);
    }
  });
}

/* ========== 3. 健身 ========== */
function renderFitness(){
  var html = hero('工作台❤️','健身','产后恢复 + 力量训练','每一次坚持，都是更好的自己');

  // 产后恢复必读
  html += '<section class="card" style="border:1.5px solid #f0c4c4;background:#fff8f7">';
  html += '<h2 class="card-title"><span class="dot" style="background:#e07856"></span>产后恢复指南（产后11个月+）</h2>';
  html += '<div style="font-size:13px;color:#666;line-height:1.8">';
  html += '<p style="font-weight:600;color:#e07856;margin-bottom:6px">一、训练前必做：盆底肌 + 腹直肌激活</p>';
  html += '<p><b>盆底肌激活（凯格尔运动）</b></p>';
  html += '<p>1. 仰卧屈膝，双膝分开与髋同宽</p>';
  html += '<p>2. 收缩盆底肌（像憋尿感觉），保持 5 秒，放松 5 秒</p>';
  html += '<p>3. 重复 10 次为一组，每次训练前做 2 组</p>';
  html += '<p style="margin-top:6px"><b>腹直肌分离检测 + 激活</b></p>';
  html += '<p>1. 仰卧屈膝，一手放肚脐上方，抬头做半卷腹</p>';
  html += '<p>2. 感受腹直肌间距：2指以内=正常，2-3指=需修复，3指以上=就医</p>';
  html += '<p>3. 修复动作：仰卧吹气收缩腹横肌（肚脐向脊柱方向收），保持 5 秒 × 15 次</p>';
  html += '<p style="margin-top:6px"><b>注意</b>：腹直肌分离超过2指时，禁止做卷腹、仰卧起坐、平板支撑等增加腹压的动作！</p>';
  html += '</div></section>';

  // 训练前热身
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e07856"></span>训练前热身（5分钟）</h2>';
  html += '<div style="font-size:13px;color:#555;line-height:1.9">';
  html += '<p>1. 猫牛式 8-10次（激活脊柱 + 核心）</p>';
  html += '<p>2. 鸟狗式（对侧手脚伸展）8次/侧（激活核心稳定）</p>';
  html += '<p>3. 臀桥 10次（激活臀肌 + 盆底肌协同）</p>';
  html += '<p>4. 肩绕圈 各10次（激活肩袖肌群）</p>';
  html += '<p>5. 深蹲至平行 8次（激活下肢）</p>';
  html += '</div></section>';

  // 练肩计划
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#5b8def"></span>练肩计划（Day A）</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#eaf1fc"><th style="text-align:left;padding:7px 6px">动作</th><th style="text-align:left;padding:7px 6px">组数</th><th style="text-align:left;padding:7px 6px">次数</th><th style="text-align:left;padding:7px 6px">备注</th></tr>';
  var shoulderEx = [
    ['坐姿哑铃推举','4','8-12','主力动作，核心收紧'],
    ['侧平举（哑铃）','4','12-15','慢下控制，不耸肩'],
    ['前平举（哑铃）','3','12','轻重量，前束发力'],
    ['面拉（弹力带）','3','15','后束+肩袖，改善体态'],
    ['俯身侧平举','3','12-15','后束，驼背改善'],
    ['肩外旋（弹力带）','2','15','肩袖激活，防受伤']
  ];
  shoulderEx.forEach(function(e){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;font-weight:600">'+esc(e[0])+'</td><td style="padding:7px 6px">'+esc(e[1])+'</td><td style="padding:7px 6px;color:#5b8def">'+esc(e[2])+'</td><td style="padding:7px 6px;color:#999;font-size:11px">'+esc(e[3])+'</td></tr>';
  });
  html += '</table>';
  html += '<div style="margin-top:8px;font-size:12px;color:#999">组间休息 60-90秒 | 全程保持核心收紧，避免代偿</div></section>';

  // 练背计划
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#4ba87a"></span>练背计划（Day B）</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#e8f5ee"><th style="text-align:left;padding:7px 6px">动作</th><th style="text-align:left;padding:7px 6px">组数</th><th style="text-align:left;padding:7px 6px">次数</th><th style="text-align:left;padding:7px 6px">备注</th></tr>';
  var backEx = [
    ['哑铃单臂划船','4','10-12','支撑背挺直，不转体'],
    ['坐姿弹力带划船','4','12-15','肩胛后缩先发力'],
    ['直臂下拉（弹力带）','3','15','背阔肌，不弯腰'],
    ['俯身哑铃飞鸟','3','12-15','上背菱形肌，轻重量'],
    ['超人式（地面）','3','12','下背稳定，保持2秒'],
    ['死虫式','2','10/侧','核心稳定收尾']
  ];
  backEx.forEach(function(e){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;font-weight:600">'+esc(e[0])+'</td><td style="padding:7px 6px">'+esc(e[1])+'</td><td style="padding:7px 6px;color:#4ba87a">'+esc(e[2])+'</td><td style="padding:7px 6px;color:#999;font-size:11px">'+esc(e[3])+'</td></tr>';
  });
  html += '</table>';
  html += '<div style="margin-top:8px;font-size:12px;color:#999">组间休息 60-90秒 | 产后避免大重量俯身动作，优先单臂稳定式</div></section>';

  // 练臀腿计划
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#c97a4a"></span>练臀腿计划（Day C）</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#f5e8df"><th style="text-align:left;padding:7px 6px">动作</th><th style="text-align:left;padding:7px 6px">组数</th><th style="text-align:left;padding:7px 6px">次数</th><th style="text-align:left;padding:7px 6px">备注</th></tr>';
  var legEx = [
    ['臀桥（渐进负重）','4','12-15','顶峰收紧2秒，激活臀'],
    ['高脚杯深蹲','4','10-12','核心收紧，蹲至平行'],
    ['罗马尼亚硬拉','4','10-12','髋折为主，背保持直'],
    ['后撤步弓步蹲','3','10/侧','膝不超过脚尖，稳'],
    ['侧卧蚌式开合','3','15/侧','臀中肌，骨盆不动'],
    ['靠墙静蹲','3','30秒','股四头肌耐力收尾']
  ];
  legEx.forEach(function(e){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;font-weight:600">'+esc(e[0])+'</td><td style="padding:7px 6px">'+esc(e[1])+'</td><td style="padding:7px 6px;color:#c97a4a">'+esc(e[2])+'</td><td style="padding:7px 6px;color:#999;font-size:11px">'+esc(e[3])+'</td></tr>';
  });
  html += '</table>';
  html += '<div style="margin-top:8px;font-size:12px;color:#999">组间休息 60-90秒 | 深蹲前确认盆底肌能承压，否则先做臀桥</div></section>';

  // 训练后拉伸
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#3aa8b8"></span>训练后拉伸（10分钟）</h2>';
  html += '<div style="font-size:13px;color:#555;line-height:1.9">';
  html += '<p>1. 胸肌拉伸（门框） 30秒/侧</p>';
  html += '<p>2. 背阔肌拉伸（跪姿侧够） 30秒/侧</p>';
  html += '<p>3. 臀大肌拉伸（鸽子式） 45秒/侧</p>';
  html += '<p>4. 髂腰肌拉伸（弓步跪姿） 30秒/侧</p>';
  html += '<p>5. 腘绳肌拉伸（坐姿前够） 30秒</p>';
  html += '<p>6. 肩部三角肌拉伸（交叉臂） 20秒/侧</p>';
  html += '<p>7. 腹式呼吸放松 10次深呼吸</p>';
  html += '</div></section>';

  // 每周排课
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e8a84b"></span>每周排课建议</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#fff8e8"><th style="text-align:left;padding:7px 6px">星期</th><th style="text-align:left;padding:7px 6px">训练内容</th><th style="text-align:left;padding:7px 6px">时长</th></tr>';
  var weekly = [
    ['周一','Day A 练肩','40-50min'],
    ['周二','休息 / 散步30min','—'],
    ['周三','Day B 练背','40-50min'],
    ['周四','休息 / 瑜伽拉伸','20min'],
    ['周五','Day C 练臀腿','40-50min'],
    ['周六','游泳（夏季）/ 快走','30-40min'],
    ['周日','全身拉伸放松','20-30min']
  ];
  weekly.forEach(function(w){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;font-weight:600">'+esc(w[0])+'</td><td style="padding:7px 6px">'+esc(w[1])+'</td><td style="padding:7px 6px;color:#999">'+esc(w[2])+'</td></tr>';
  });
  html += '</table>';
  html += '<div style="margin-top:8px;padding:10px;background:#fff8e8;border-radius:10px;font-size:12px;color:#b8702a;line-height:1.6">建议：A/B/C 三个训练日交替进行，不要连续两天力量训练。产后恢复期优先保证核心激活，力量循序渐进。</div></section>';

  // 本周打卡
  var weekLog = get('fitness_week','');
  var days = ['一','二','三','四','五','六','日'];
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e07856"></span>本周训练打卡</h2>';
  html += '<div style="display:flex;gap:6px">'+days.map(function(d,i){
    var checked = weekLog.indexOf(i)>=0;
    return '<div style="flex:1;text-align:center"><div class="habit-check'+(checked?' done':'')+'" style="margin:0 auto" data-day="'+i+'"></div><div style="font-size:11px;color:#999;margin-top:4px">'+d+'</div></div>';
  }).join('')+'</div></section>';

  return html;
}
function bindFitness(){
  var weekLog = get('fitness_week','');
  $$('.habit-check[data-day]').forEach(function(c){
    c.addEventListener('click',function(){
      var day = parseInt(c.dataset.day);
      var idx = weekLog.indexOf(day);
      if(idx>=0){ weekLog = weekLog.filter(function(d){return d!==day;}); c.classList.remove('done'); }
      else { weekLog.push(day); c.classList.add('done'); feedCat(1,'运动打卡 +1 鸡腿！'); }
      set('fitness_week',weekLog);
    });
  });
}

/* ========== 4. 工作 ========== */
function renderWork(){
  var tasks = get('work_tasks',[]);
  var filter = get('work_filter','today');
  var today = todayKey();
  var filtered = tasks.filter(function(t){
    if(filter==='all') return true;
    if(filter==='done') return t.done;
    if(filter==='doing') return !t.done;
    if(filter==='today') return t.date===today;
    return true;
  });
  // 排序
  var pri = {high:0,mid:1,low:2};
  filtered.sort(function(a,b){ return (pri[a.pri]||1)-(pri[b.pri]||1); });
  var html = hero('工作台❤️','工作','高效工作，是为了更好的生活','把任务一件件完成');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#5b8def"></span>待办清单</h2>';
  html += '<div class="filter-tabs">'+
    ['today:今日待办','all:全部','doing:进行中','done:已完成'].map(function(t){
      var k=t.split(':')[0],l=t.split(':')[1];
      return '<button class="filter-tab'+(filter===k?' active':'')+'" data-filter="'+k+'">'+l+'</button>';
    }).join('')+'</div>';
  if(filtered.length){
    html += filtered.map(function(t){
      var plabel = {high:'高',mid:'中',low:'低'}[t.pri]||'中';
      var pcls = {high:'priority-high',mid:'priority-mid',low:'priority-low'}[t.pri]||'priority-mid';
      return '<div class="task-item"><div class="task-check'+(t.done?' done':'')+'" data-id="'+t.id+'"></div>'+
        '<div class="task-content"><div class="task-name'+(t.done?' done':'')+'">'+esc(t.name)+'</div>'+
        '<div class="task-meta"><span class="'+pcls+'">● '+plabel+'</span>'+(t.date?'<span>📅 '+esc(t.date.slice(5))+'</span>':'')+'</div></div>'+
        '<button class="task-del" data-del="'+t.id+'">×</button></div>';
    }).join('');
  } else {
    html += '<p class="empty" style="text-align:center;color:#bbb;padding:20px 0">暂无任务</p>';
  }
  html += '<div class="task-add-row"><input type="text" class="input" id="newTask" placeholder="新增任务..."><select class="input" id="newPri" style="width:70px"><option value="high">高</option><option value="mid" selected>中</option><option value="low">低</option></select><button class="btn-small" id="addTask">+</button></div>';
  html += '</section>';
  return html;
}
function bindWork(){
  var tasks = get('work_tasks',[]);
  $$('.task-check').forEach(function(c){
    c.addEventListener('click',function(){
      var t = tasks.find(function(x){return x.id===c.dataset.id;});
      if(t){ t.done=!t.done; set('work_tasks',tasks); if(t.done) feedCat(1,'完成任务 +1 鸡腿！'); renderMain(); bindWork(); }
    });
  });
  $$('.task-del').forEach(function(b){
    b.addEventListener('click',function(){
      tasks = tasks.filter(function(x){return x.id!==b.dataset.del;});
      set('work_tasks',tasks); renderMain(); bindWork();
    });
  });
  $$('.filter-tab').forEach(function(t){
    t.addEventListener('click',function(){ set('work_filter',t.dataset.filter); renderMain(); bindWork(); });
  });
  $('#addTask').addEventListener('click',function(){
    var v=$('#newTask').value.trim();
    if(v){
      tasks.push({id:uid(),name:v,pri:$('#newPri').value,done:false,date:todayKey()});
      set('work_tasks',tasks); renderMain(); bindWork();
    }
  });
}

/* ========== 5. 新闻热点 ========== */
function renderNews(){
  var html = hero('工作台❤️','新闻热点','关注世界，也关注自己','每天自动轮换权威媒体新闻');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#d97070"></span>今日热点</h2>';
  html += '<div id="newsList"><div class="news-loading">正在加载新闻...</div></div></section>';
  return html;
}
function loadNews(){
  // 三个不同的权威媒体 RSS 源（避免重复）
  var feeds = [
    {src:'央视新闻',url:'https://feedx.net/rss/cctv.xml'},
    {src:'人民网',url:'https://feedx.net/rss/people.xml'},
    {src:'新华网',url:'https://feedx.net/rss/xinhuanet.xml'}
  ];
  var box = $('#newsList');
  var loaded = 0; var allNews = [];
  // 备用：如果 RSS 加载失败，显示静态推荐（每个源不重复）
  var fallback = [
    {title:'央视新闻联播 - 今日要闻',url:'https://news.cctv.com/',src:'央视新闻'},
    {title:'人民网 - 头条新闻',url:'http://www.people.com.cn/',src:'人民网'},
    {title:'新华网 - 最新动态',url:'http://www.xinhuanet.com/',src:'新华网'}
  ];
  var apiBase = 'https://api.rss2json.com/v1/api.json?rss_url=';
  feeds.forEach(function(f){
    fetch(apiBase+encodeURIComponent(f.url)).then(function(r){return r.json();}).then(function(d){
      if(d&&d.items){
        d.items.slice(0,8).forEach(function(it){
          allNews.push({title:it.title,url:it.link,src:f.src});
        });
      }
      loaded++;
      if(loaded>=feeds.length) showNews();
    }).catch(function(){ loaded++; if(loaded>=feeds.length) showNews(); });
  });
  setTimeout(function(){ if(allNews.length===0) showFallback(); },8000);
  function showNews(){
    if(allNews.length===0) return showFallback();
    // 标题去重（不同源可能转载同一篇）
    var seen = {};
    var unique = [];
    allNews.forEach(function(n){
      var key = n.title.replace(/\s+/g,'').slice(0,20);
      if(!seen[key]){
        seen[key] = true;
        unique.push(n);
      }
    });
    // 按日期轮换：每天选不同子集，取前 12 条
    var dayIdx = new Date().getDate();
    var start = (dayIdx * 3) % Math.max(1, unique.length);
    var pick = unique.concat(unique).slice(start, start+12);
    if(pick.length<12) pick = unique.slice(0,12);
    box.innerHTML = pick.map(function(n){
      return '<div class="news-item"><a href="'+esc(n.url)+'" target="_blank">'+esc(n.title)+'</a><div class="news-source">'+esc(n.src)+'</div></div>';
    }).join('');
  }
  function showFallback(){
    box.innerHTML = fallback.map(function(n){
      return '<div class="news-item"><a href="'+esc(n.url)+'" target="_blank">'+esc(n.title)+'</a><div class="news-source">'+esc(n.src)+'</div></div>';
    }).join('');
  }
}

/* ========== 6. 学习英语 ========== */
var ENG_DATA = {
  low: {
    words:[
      {w:'abandon',p:'/əˈbændən/',m:'v. 放弃；抛弃'},
      {w:'benefit',p:'/ˈbenɪfɪt/',m:'n. 益处 v. 受益'},
      {w:'challenge',p:'/ˈtʃælɪndʒ/',m:'n. 挑战 v. 向...挑战'},
      {w:'determine',p:'/dɪˈtɜːmɪn/',m:'v. 决定；决心'},
      {w:'essential',p:'/ɪˈsenʃl/',m:'adj. 必要的；本质的'},
      {w:'fortune',p:'/ˈfɔːrtʃuːn/',m:'n. 财富；运气'}
    ],
    sentences:[
      {en:'How are you doing today?',cn:'你今天怎么样？'},
      {en:'Nice to meet you.',cn:'很高兴认识你。'},
      {en:'Could you help me, please?',cn:'能帮我一下吗？'},
      {en:'What do you think about it?',cn:'你觉得怎么样？'},
      {en:'See you tomorrow.',cn:'明天见。'}
    ]
  },
  mid: {
    words:[
      {w:'preliminary',p:'/prɪˈlɪmɪneri/',m:'adj. 初步的 n. 准备'},
      {w:'significant',p:'/sɪɡˈnɪfɪkənt/',m:'adj. 重要的；意义重大的'},
      {w:'comprehensive',p:'/ˌkɑːmprɪˈhensɪv/',m:'adj. 全面的；综合的'},
      {w:'fundamental',p:'/ˌfʌndəˈmentl/',m:'adj. 基本的 n. 基本原则'},
      {w:'inevitable',p:'/ɪnˈevɪtəbl/',m:'adj. 不可避免的'},
      {w:'negotiate',p:'/nɪˈɡoʊʃieɪt/',m:'v. 谈判；协商'}
    ],
    sentences:[
      {en:'I would like to make a reservation.',cn:'我想预订一下。'},
      {en:'Can I get the check, please?',cn:'请结账，好吗？'},
      {en:'I am looking for a new job.',cn:'我在找新工作。'},
      {en:'How much does this cost?',cn:'这个多少钱？'},
      {en:'I will take care of it.',cn:'我会处理的。'}
    ]
  },
  high: {
    words:[
      {w:'ubiquitous',p:'/juːˈbɪkwɪtəs/',m:'adj. 无处不在的'},
      {w:'pragmatic',p:'/præɡˈmætɪk/',m:'adj. 务实的；实用主义的'},
      {w:'resilience',p:'/rɪˈzɪliəns/',m:'n. 韧性；恢复力'},
      {w:'scrutinize',p:'/ˈskruːtənaɪz/',m:'v. 仔细检查'},
      {w:'paradigm',p:'/ˈpærədaɪm/',m:'n. 范例；范式'},
      {w:'articulate',p:'/ɑːrˈtɪkjuleɪt/',m:'v. 清晰表达 adj. 善于表达的'}
    ],
    sentences:[
      {en:'I would appreciate it if you could follow up on this matter.',cn:'如果您能跟进此事，我将不胜感激。'},
      {en:'Let us touch base next week to discuss the strategy.',cn:'我们下周碰个头讨论策略。'},
      {en:'The proposal has both pros and cons.',cn:'这个提案有利有弊。'},
      {en:'I am writing to inquire about the position.',cn:'我写信询问该职位的情况。'},
      {en:'Could you walk me through the process?',cn:'能带我走一遍流程吗？'}
    ]
  }
};

/* 美式发音 */
function speakUS(text){
  if(!('speechSynthesis' in window)){ alert('当前浏览器不支持语音播放'); return; }
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  // 优先选美式英语声部
  var voices = window.speechSynthesis.getVoices();
  var usVoice = voices.find(function(v){ return v.lang==='en-US' || v.lang==='en_US'; });
  if(usVoice) u.voice = usVoice;
  window.speechSynthesis.speak(u);
}

/* 日常口语对话视频 */
var ENG_VIDEOS = [
  {title:'机场值机对话 Airport Check-in',url:'https://www.youtube.com/embed/VY8LJMjL-Yg'},
  {title:'餐厅点餐对话 Restaurant Ordering',url:'https://www.youtube.com/embed/eU6kUuEaWmY'},
  {title:'酒店入住对话 Hotel Check-in',url:'https://www.youtube.com/embed/1mGy7Zatq5A'},
  {title:'超市购物对话 Shopping',url:'https://www.youtube.com/embed/0W3NQrjICz0'},
  {title:'医生看病对话 At the Doctor',url:'https://www.youtube.com/embed/W2dDS0sZKpU'},
  {title:'电话沟通对话 Phone Conversation',url:'https://www.youtube.com/embed/2mW7CU3iLa8'}
];

function renderEnglish(){
  var html = hero('工作台❤️','学习英语','语言是打开世界的钥匙','每天进步一点点');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#9b6acf"></span>雅思词汇（美式发音）</h2>';
  html += '<div class="eng-level-tabs">'+
    ['low:初级','mid:中级','high:高级'].map(function(t){
      var k=t.split(':')[0],l=t.split(':')[1];
      return '<button class="eng-tab" data-level="'+k+'">'+l+'</button>';
    }).join('')+'</div>';
  html += '<div id="engWords"></div></section>';

  // 日常口语对话视频
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#9b6acf"></span>日常口语对话视频</h2>';
  html += '<div style="font-size:12px;color:#999;margin-bottom:12px">点击视频可播放，均为日常场景对话</div>';
  html += ENG_VIDEOS.map(function(v){
    return '<div class="video-card"><iframe src="'+esc(v.url)+'" style="width:100%;height:200px;border:none;display:block" allowfullscreen frameborder="0"></iframe><div class="v-title">'+esc(v.title)+'</div></div>';
  }).join('');
  html += '</section>';
  return html;
}
function bindEnglish(){
  $$('.eng-tab').forEach(function(t){
    t.addEventListener('click',function(){
      $$('.eng-tab').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active');
      var level = t.dataset.level;
      var data = ENG_DATA[level];
      var html = data.words.map(function(w){
        return '<div class="word-card">'+
          '<div style="display:flex;align-items:center;justify-content:space-between">'+
            '<div class="word">'+esc(w.w)+'</div>'+
            '<button class="btn-speak" data-speak="'+esc(w.w)+'" style="appearance:none;border:none;background:#9b6acf;color:#fff;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;flex-shrink:0">▶</button>'+
          '</div>'+
          '<div class="phonetic">'+esc(w.p)+'</div>'+
          '<div class="meaning">'+esc(w.m)+'</div></div>';
      }).join('')+'<div style="margin-top:10px;font-size:13px;color:#9b6acf;font-weight:600">日常短句（点击播放美式发音）</div>';
      data.sentences.forEach(function(s){
        html += '<div style="padding:10px 0;font-size:13px;color:#555;border-bottom:1px solid #f0f0ec;display:flex;justify-content:space-between;align-items:center;gap:8px">'+
          '<div><div style="font-size:14px;color:#333">'+esc(s.en)+'</div><div style="font-size:12px;color:#999;margin-top:2px">'+esc(s.cn)+'</div></div>'+
          '<button class="btn-speak" data-speak="'+esc(s.en)+'" style="appearance:none;border:none;background:#9b6acf;color:#fff;border-radius:50%;width:30px;height:30px;font-size:14px;cursor:pointer;flex-shrink:0">▶</button>'+
        '</div>';
      });
      $('#engWords').innerHTML = html;
      // 绑定发音按钮
      $$('.btn-speak',$('#engWords')).forEach(function(b){
        b.addEventListener('click',function(){ speakUS(b.dataset.speak); });
      });
    });
  });
  // 默认选初级
  $$('.eng-tab')[0].click();
}

/* ========== 7. 心情日记 ========== */
function renderDiary(){
  var html = hero('工作台❤️','心情日记','在这里，记录最真实的自己','每一种情绪，都值得被看见');
  html += '<section class="card write-card"><h2 class="card-title"><span class="dot" style="background:#e8748f"></span>写下今天的心情</h2>';
  html += '<textarea class="editable" id="diaryText" placeholder="今天想说点什么...">'+esc(get('diary_text',''))+'</textarea>';
  html += '<div class="mood-grid">'+MOODS.map(function(mo){
    var sel = get('diary_mood','')===mo?' selected':'';
    return '<button class="mood'+sel+'" data-mood="'+mo+'">'+mo+'</button>';
  }).join('')+'</div>';
  html += '<button class="btn-primary" id="diarySave">保存心情</button></section>';
  html += '<section class="card reply-card"><h2 class="card-title"><span class="dot" style="background:#e8748f"></span>树洞回信</h2>';
  html += '<div class="reply-body"><p class="reply-text">不管今天怎样，明天又是新的一天</p></div></section>';
  return html;
}
function bindDiary(){
  $$('.mood').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.mood').forEach(function(x){x.classList.remove('selected');});
      b.classList.add('selected'); set('diary_mood',b.dataset.mood);
    });
  });
  $('#diarySave').addEventListener('click',function(){
    set('diary_text',$('#diaryText').value);
    var b=$('#diarySave'); b.textContent='已保存 ✓';
    feedCat(1,'记录心情 +1 鸡腿！');
    setTimeout(function(){ b.textContent='保存心情'; },1200);
  });
}

/* ========== 8. 每月复盘（树木成长） ========== */
var TREE_STAGES = [
  // seed
  '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="85" rx="12" ry="3" fill="#8B7355" opacity=".3"/><circle cx="50" cy="78" r="6" fill="#8B7355"/><path d="M50 78 L50 65" stroke="#8B7355" stroke-width="2"/></svg>',
  // sprout
  '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="85" rx="12" ry="3" fill="#8B7355" opacity=".3"/><path d="M50 80 L50 55" stroke="#7a5a3a" stroke-width="3"/><ellipse cx="44" cy="58" rx="6" ry="4" fill="#9bd07d" transform="rotate(-30 44 58)"/><ellipse cx="56" cy="58" rx="6" ry="4" fill="#9bd07d" transform="rotate(30 56 58)"/></svg>',
  // small tree
  '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="85" rx="14" ry="3" fill="#7fb46a" opacity=".25"/><path d="M48 55 L48 82 L52 82 L52 55 Z" fill="#7a5a3a"/><circle cx="50" cy="45" r="18" fill="#9bd07d"/><circle cx="42" cy="40" r="8" fill="#b6de9a"/><circle cx="58" cy="40" r="8" fill="#b6de9a"/></svg>',
  // big tree
  '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="88" rx="18" ry="4" fill="#7fb46a" opacity=".25"/><path d="M47 50 L47 85 L53 85 L53 50 Z" fill="#7a5a3a"/><circle cx="50" cy="38" r="24" fill="#9bd07d"/><circle cx="38" cy="32" r="12" fill="#b6de9a"/><circle cx="62" cy="32" r="12" fill="#b6de9a"/><circle cx="50" cy="24" r="10" fill="#b6de9a"/><circle cx="35" cy="42" r="4" fill="#e07856"/><circle cx="60" cy="35" r="4" fill="#e07856"/></svg>'
];
function renderReview(){
  var mk = monthKey();
  var reviews = get('reviews',{});
  var cur = reviews[mk] || {plan:'',actual:'',progress:0};
  var stage = Math.min(3, Math.floor(cur.progress/25));
  var months = [];
  var now = new Date();
  for(var i=0;i<12;i++){
    var d = new Date(now.getFullYear(),now.getMonth()-i,1);
    months.push(d.getFullYear()+'-'+(d.getMonth()+1));
  }
  var html = hero('工作台❤️','每月复盘','复盘，是为了更好地出发','总结经验，让下个月更精彩');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#3aa8b8"></span>月度复盘</h2>';
  html += '<div class="review-month-tabs">'+months.map(function(k){
    var label = k.split('-')[1]+'月';
    return '<button class="review-tab'+(k===mk?' active':'')+'" data-month="'+k+'">'+label+'</button>';
  }).join('')+'</div>';
  html += '<div class="tree-stage">'+TREE_STAGES[stage]+'</div>';
  html += '<div style="text-align:center;font-size:13px;color:#999;margin-bottom:10px">'+(stage===3?'枝繁叶茂！':stage===0?'种子阶段，开始填写吧':'成长中...')+'</div>';
  html += '<div class="plan-actual"><div class="pa-box"><div class="pa-label">计划</div><textarea id="rvPlan">'+esc(cur.plan)+'</textarea></div><div class="pa-box"><div class="pa-label">实际</div><textarea id="rvActual">'+esc(cur.actual)+'</textarea></div></div>';
  html += '<div class="progress-row"><div class="progress-label"><span>完成进度</span><span id="rvPct">'+cur.progress+'%</span></div><div class="progress-bar"><div class="progress-fill" id="rvFill" style="width:'+cur.progress+'%"></div></div></div>';
  html += '<input type="range" min="0" max="100" value="'+cur.progress+'" id="rvRange" style="width:100%;margin-top:4px">';
  html += '<button class="btn-primary" id="rvSave">保存复盘</button></section>';
  return html;
}
function bindReview(){
  var mk = monthKey();
  $('#rvRange').addEventListener('input',function(){
    var v=this.value;
    $('#rvPct').textContent=v+'%';
    $('#rvFill').style.width=v+'%';
    var stage=Math.min(3,Math.floor(v/25));
    $('.tree-stage').innerHTML=TREE_STAGES[stage];
  });
  $('#rvSave').addEventListener('click',function(){
    var reviews=get('reviews',{});
    reviews[mk]={plan:$('#rvPlan').value,actual:$('#rvActual').value,progress:parseInt($('#rvRange').value)};
    set('reviews',reviews);
    var b=$('#rvSave'); b.textContent='已保存 ✓';
    if(parseInt($('#rvRange').value)>=100) feedCat(3,'复盘完成 +3 鸡腿！');
    else feedCat(1,'复盘 +1 鸡腿！');
    setTimeout(function(){ b.textContent='保存复盘'; },1200);
  });
  $$('.review-tab').forEach(function(t){
    t.addEventListener('click',function(){
      var k=t.dataset.month;
      var reviews=get('reviews',{});
      var r=reviews[k]||{plan:'',actual:'',progress:0};
      $('#rvPlan').value=r.plan;
      $('#rvActual').value=r.actual;
      $('#rvRange').value=r.progress;
      $('#rvPct').textContent=r.progress+'%';
      $('#rvFill').style.width=r.progress+'%';
      var stage=Math.min(3,Math.floor(r.progress/25));
      $('.tree-stage').innerHTML=TREE_STAGES[stage];
      $$('.review-tab').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active');
    });
  });
}

/* ========== 9. 财经新闻 ========== */
function renderFinance(){
  var html = hero('工作台❤️','财经新闻','把握趋势，做出明智选择','关注财经，规划自己的未来');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#4ba87a"></span>财经资讯</h2>';
  html += '<div id="financeList"><div class="news-loading">正在加载财经新闻...</div></div></section>';

  // 国家政策/规划文件专区
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#c5483a"></span>国家政策与规划文件</h2>';
  html += '<div style="font-size:12px;color:#999;margin-bottom:10px">国务院 / 发改委 / 政府工作报告 / 金融监管</div>';
  html += '<div id="policyList"><div class="news-loading">正在加载政策文件...</div></div></section>';

  // 新浪财经电台
  html += '<section class="card" style="background:linear-gradient(135deg,#d93025,#e85a4f)"><h2 class="card-title" style="color:#fff"><span class="dot" style="background:#fff"></span>新浪财经电台</h2>';
  html += '<div style="color:#fff;line-height:1.6;margin-bottom:12px;font-size:13px">实时财经广播，边听边看行情</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
  html += '<a href="sinafinance://" onclick="return openSinaFinance(this)" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;color:#d93025;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none">打开新浪财经App ›</a>';
  html += '<a href="https://finance.sina.cn/" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(255,255,255,.2);color:#fff;border:1.5px solid rgba(255,255,255,.5);border-radius:10px;font-size:13px;text-decoration:none">财经首页 ›</a>';
  html += '</div></section>';

  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#4ba87a"></span>雪球大V基金配置参考</h2>';
  html += '<div style="font-size:13px;color:#666;line-height:1.8">';
  html += '<p><b>均衡配置建议（仅供参考）：</b></p>';
  html += '<p>• 沪深300指数基金：30%（核心底仓）</p>';
  html += '<p>• 中证500指数基金：20%（成长补充）</p>';
  html += '<p>• 港股/恒生科技：15%（估值低位）</p>';
  html += '<p>• 美股标普500：15%（海外配置）</p>';
  html += '<p>• 债券基金：15%（稳健防守）</p>';
  html += '<p>• 黄金/商品：5%（对冲通胀）</p>';
  html += '<p style="margin-top:10px;color:#999;font-size:12px">⚠️ 以上为参考配置，投资有风险，入市需谨慎</p>';
  html += '</div></section>';
  return html;
}
function loadFinance(){
  var box=$('#financeList');
  box.innerHTML = '<div class="news-loading">正在加载财经新闻...</div>';

  // 多个 RSS 源，拉取后统一去重
  var rssFeeds = [
    {src:'新浪财经',url:'https://feedx.net/rss/sinafinance.xml'},
    {src:'澎湃新闻',url:'https://feedx.net/rss/thepaper.xml'}
  ];
  var allFin = [];
  var loaded = 0;
  var seenFin = {};

  rssFeeds.forEach(function(f){
    fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(f.url))
      .then(function(r){return r.json();})
      .then(function(d){
        if(d&&d.items){
          d.items.slice(0,15).forEach(function(it){
            var key = it.title.replace(/\s+/g,'').slice(0,20);
            if(!seenFin[key]){
              seenFin[key] = true;
              allFin.push({title:it.title,url:it.link,src:f.src});
            }
          });
        }
        loaded++;
        if(loaded>=rssFeeds.length) showFin();
      })
      .catch(function(){ loaded++; if(loaded>=rssFeeds.length) showFin(); });
  });

  // 8 秒超时后用固定入口
  setTimeout(function(){ if(allFin.length===0) showFinPortals(); },8000);

  function showFin(){
    if(allFin.length===0) return showFinPortals();
    // 按日期轮换取不同子集
    var dayIdx = new Date().getDate();
    var start = (dayIdx*2) % Math.max(1,allFin.length);
    var pick = allFin.concat(allFin).slice(start,start+12);
    if(pick.length<12) pick=allFin.slice(0,12);

    // 底部再附 8 大平台入口
    var portals = [
      {src:'财联社',url:'https://www.cls.cn/'},
      {src:'东方财富',url:'https://finance.eastmoney.com/'},
      {src:'同花顺',url:'https://news.10jqka.com.cn/'},
      {src:'天天基金',url:'https://fund.eastmoney.com/'},
      {src:'雪球',url:'https://xueqiu.com/'},
      {src:'金十数据',url:'https://www.jin10.com/'},
      {src:'集思录',url:'https://www.jisilu.cn/'}
    ];
    var portalHtml = '<div style="margin-top:14px;padding-top:10px;border-top:1px solid #f0f0ec"><div style="font-size:12px;color:#999;margin-bottom:8px">财经平台直达</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px">'+
      portals.map(function(p){ return '<a href="'+esc(p.url)+'" target="_blank" style="display:inline-block;padding:5px 10px;background:#f0f0ec;border-radius:8px;font-size:12px;color:#555;text-decoration:none">'+esc(p.src)+'</a>'; }).join('')+
      '</div></div>';

    box.innerHTML = pick.map(function(n){
      return '<div class="news-item"><a href="'+esc(n.url)+'" target="_blank">'+esc(n.title)+'</a><div class="news-source">'+esc(n.src)+'</div></div>';
    }).join('') + portalHtml;
  }

  function showFinPortals(){
    var portals = [
      {src:'新浪财经',url:'https://finance.sina.com.cn/'},
      {src:'澎湃新闻',url:'https://www.thepaper.cn/'},
      {src:'财联社',url:'https://www.cls.cn/'},
      {src:'东方财富',url:'https://finance.eastmoney.com/'},
      {src:'同花顺',url:'https://news.10jqka.com.cn/'},
      {src:'天天基金',url:'https://fund.eastmoney.com/'},
      {src:'雪球',url:'https://xueqiu.com/'},
      {src:'金十数据',url:'https://www.jin10.com/'},
      {src:'集思录',url:'https://www.jisilu.cn/'}
    ];
    box.innerHTML = portals.map(function(p){
      return '<div class="news-item"><a href="'+esc(p.url)+'" target="_blank">'+esc(p.src)+' - 点击查看最新财经资讯</a><div class="news-source">'+esc(p.src)+'</div></div>';
    }).join('');
  }

  // 加载国家政策/规划文件
  loadPolicy();
}

/* ---- 国家政策与规划文件 ---- */
function loadPolicy(){
  var box = $('#policyList');
  if(!box) return;

  // 政策 RSS 源（国务院 / 发改委 / 中国政府网）
  var feeds = [
    {src:'中国政府网',url:'https://feedx.net/rss/gov.xml'},
    {src:'国务院政策',url:'https://feedx.net/rss/zhengce.xml'}
  ];
  var allP = []; var loaded=0; var seenP={};

  feeds.forEach(function(f){
    fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(f.url))
      .then(function(r){return r.json();})
      .then(function(d){
        if(d&&d.items){
          d.items.slice(0,12).forEach(function(it){
            var key=it.title.replace(/\s+/g,'').slice(0,20);
            if(!seenP[key]){ seenP[key]=true; allP.push({title:it.title,url:it.link,src:f.src,pubDate:it.pubDate||''}); }
          });
        }
        loaded++; if(loaded>=feeds.length) showPolicy();
      })
      .catch(function(){ loaded++; if(loaded>=feeds.length) showPolicy(); });
  });

  // 8 秒超时后用固定政策入口
  setTimeout(function(){ if(allP.length===0) showPolicyFallback(); },8000);

  function showPolicy(){
    if(allP.length===0) return showPolicyFallback();
    var dayIdx=new Date().getDate();
    var start=(dayIdx*2)%Math.max(1,allP.length);
    var pick=allP.concat(allP).slice(start,start+8);
    if(pick.length<8) pick=allP.slice(0,8);

    // 底部附固定政策入口
    var portalsHtml = '<div style="margin-top:14px;padding-top:10px;border-top:1px solid #f0f0ec"><div style="font-size:12px;color:#999;margin-bottom:8px">政策平台直达</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px">'+
      POLICY_PORTALS.map(function(p){
        return '<a href="'+esc(p.url)+'" target="_blank" style="display:inline-block;padding:5px 10px;background:#fdf0ed;border-radius:8px;font-size:12px;color:#c5483a;text-decoration:none">'+esc(p.name)+'</a>';
      }).join('')+
      '</div></div>';

    box.innerHTML = pick.map(function(n){
      var dateStr = n.pubDate ? new Date(n.pubDate).toLocaleDateString('zh-CN') : '';
      return '<div class="news-item"><a href="'+esc(n.url)+'" target="_blank">'+esc(n.title)+'</a><div class="news-source">'+esc(n.src)+(dateStr?' · '+dateStr:'')+'</div></div>';
    }).join('') + portalsHtml;
  }

  function showPolicyFallback(){
    box.innerHTML = POLICY_PORTALS.map(function(p){
      return '<div class="news-item"><a href="'+esc(p.url)+'" target="_blank">'+esc(p.name)+' - 点击查看最新政策文件</a><div class="news-source">'+esc(p.cat)+'</div></div>';
    }).join('');
  }
}

var POLICY_PORTALS = [
  {name:'国务院政策文件',cat:'国务院',url:'https://www.gov.cn/zhengce/'},
  {name:'国家发改委',cat:'发改委',url:'https://www.ndrc.gov.cn/'},
  {name:'政府工作报告',cat:'政府工作报告',url:'https://www.gov.cn/zhuanti/lhzfgzbg/'},
  {name:'中国人民银行',cat:'金融监管',url:'https://www.pbc.gov.cn/'},
  {name:'证监会',cat:'金融监管',url:'https://www.csrc.gov.cn/'},
  {name:'银保监会',cat:'金融监管',url:'https://www.cbirc.gov.cn/'},
  {name:'财政部',cat:'财政政策',url:'https://www.mof.gov.cn/'},
  {name:'国家统计局',cat:'经济数据',url:'https://www.stats.gov.cn/'}
];

/* ========== 9.5 财务政策 ========== */
var TAX_RATES_2024 = [
  {bracket:'0 ~ 36,000',rate:'3%',deduct:0},
  {bracket:'36,001 ~ 144,000',rate:'10%',deduct:2520},
  {bracket:'144,001 ~ 300,000',rate:'20%',deduct:16920},
  {bracket:'300,001 ~ 420,000',rate:'25%',deduct:31920},
  {bracket:'420,001 ~ 660,000',rate:'30%',deduct:52920},
  {bracket:'660,001 ~ 960,000',rate:'35%',deduct:85920},
  {bracket:'960,001+',rate:'45%',deduct:181920}
];

var INDUSTRY_RATES = [
  {industry:'制造业',vat:'13%',corp:'25%'},
  {industry:'交通运输/邮政',vat:'9%',corp:'25%'},
  {industry:'建筑/房地产',vat:'9%',corp:'25%'},
  {industry:'金融/保险',vat:'6%',corp:'25%'},
  {industry:'现代服务（一般）',vat:'6%',corp:'25%'},
  {industry:'生活服务',vat:'6%',corp:'25%'},
  {industry:'农产品',vat:'9%',corp:'25%'},
  {industry:'图书/报刊',vat:'9%',corp:'25%'},
  {industry:'小型微利企业',vat:'3%（减按1%）',corp:'5%（应纳税所得额≤300万）'},
  {industry:'个体工商户',vat:'3%',corp:'5%-35%经营所得'},
  {industry:'小微企业（小规模）',vat:'3%（减按1%）',corp:'—'}
];

var SOCIAL_INSURANCE = [
  {item:'养老保险',unit:'16%',person:'8%',note:'单位16% / 个人8%'},
  {item:'医疗保险',unit:'8%-10%',person:'2%',note:'含生育保险（已合并）'},
  {item:'失业保险',unit:'0.5%-0.7%',person:'0.3%-0.5%',note:'各地略有差异'},
  {item:'工伤保险',unit:'0.2%-1.9%',person:'0%',note:'按行业风险等级'},
  {item:'住房公积金',unit:'5%-12%',person:'5%-12%',note:'单位与个人同比例'}
];

function renderFinTax(){
  var html = hero('工作台❤️','财务政策','会计相关政策实时更新','社保 / 公积金 / 个税 / 税率');
  // 个税计算器
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#2d7dd4"></span>个税计算器</h2>';
  html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px"><input type="number" class="input" id="taxIncome" placeholder="月应纳税所得额（扣完5000+专项后）"><button class="btn-small" id="calcTax">计算</button></div>';
  html += '<div id="taxResult" style="font-size:14px;color:#2d7dd4;font-weight:600;padding:8px 0"></div>';
  html += '<div style="margin-top:8px;font-size:12px;color:#999">个税起征点：5000元/月（60000元/年）</div></section>';

  // 个税税率表
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#2d7dd4"></span>个人所得税税率表（综合所得）</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#f0f0ec"><th style="text-align:left;padding:8px 6px">级数</th><th style="text-align:left;padding:8px 6px">年应纳税所得额</th><th style="text-align:left;padding:8px 6px">税率</th><th style="text-align:left;padding:8px 6px">速算扣除数</th></tr>';
  TAX_RATES_2024.forEach(function(t,i){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;color:#999">'+(i+1)+'</td><td style="padding:7px 6px">'+esc(t.bracket)+'</td><td style="padding:7px 6px;color:#c5483a;font-weight:600">'+esc(t.rate)+'</td><td style="padding:7px 6px">'+t.deduct+'</td></tr>';
  });
  html += '</table></section>';

  // 社保公积金
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e8a84b"></span>社保与公积金基数</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#f0f0ec"><th style="text-align:left;padding:8px 6px">险种</th><th style="text-align:left;padding:8px 6px">单位</th><th style="text-align:left;padding:8px 6px">个人</th><th style="text-align:left;padding:8px 6px">备注</th></tr>';
  SOCIAL_INSURANCE.forEach(function(s){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;font-weight:600">'+esc(s.item)+'</td><td style="padding:7px 6px">'+esc(s.unit)+'</td><td style="padding:7px 6px">'+esc(s.person)+'</td><td style="padding:7px 6px;color:#999;font-size:11px">'+esc(s.note)+'</td></tr>';
  });
  html += '</table>';
  html += '<div style="margin-top:10px;padding:10px;background:#fff8e8;border-radius:10px;font-size:12px;color:#b8702a;line-height:1.6">注：社保缴费基数下限为当地社平工资60%，上限为300%，具体以当地人社局公布为准。</div></section>';

  // 各行业税率
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#c5483a"></span>各行业增值税与企业所得税税率</h2>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">';
  html += '<tr style="background:#f0f0ec"><th style="text-align:left;padding:8px 6px">行业</th><th style="text-align:left;padding:8px 6px">增值税</th><th style="text-align:left;padding:8px 6px">企业所得税</th></tr>';
  INDUSTRY_RATES.forEach(function(r){
    html += '<tr style="border-bottom:1px solid #f5f5f0"><td style="padding:7px 6px;font-weight:600">'+esc(r.industry)+'</td><td style="padding:7px 6px;color:#c5483a">'+esc(r.vat)+'</td><td style="padding:7px 6px">'+esc(r.corp)+'</td></tr>';
  });
  html += '</table></section>';

  // 政策更新 RSS
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#2d7dd4"></span>财税政策最新更新</h2>';
  html += '<div id="taxPolicyList"><div class="news-loading">正在加载财税政策...</div></div></section>';

  // 财税平台直达
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#2d7dd4"></span>财税官方平台</h2>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
  var portals = [
    {name:'国家税务总局',url:'https://www.chinatax.gov.cn/'},
    {name:'财政部',url:'https://www.mof.gov.cn/'},
    {name:'人社部',url:'https://www.mohrss.gov.cn/'},
    {name:'住房公积金',url:'https://www.mohurd.gov.cn/'},
    {name:'12366纳税服务',url:'https://12366.chinatax.gov.cn/'},
    {name:'个税APP',url:'https://its.mo.tax.gov.cn/'}
  ];
  html += portals.map(function(p){
    return '<a href="'+esc(p.url)+'" target="_blank" style="display:inline-block;padding:6px 12px;background:#eaf1fc;border-radius:8px;font-size:12.5px;color:#2d7dd4;text-decoration:none">'+esc(p.name)+'</a>';
  }).join('');
  html += '</div></section>';

  return html;
}

function loadFinTax(){
  // 个税计算
  var calcBtn=$('#calcTax');
  if(calcBtn){
    calcBtn.addEventListener('click',function(){
      var v=parseFloat($('#taxIncome').value);
      if(!v||v<=0){ $('#taxResult').textContent='请输入有效金额'; return; }
      var tax=0;
      for(var i=TAX_RATES_2024.length-1;i>=0;i--){
        var t=TAX_RATES_2024[i];
        // 简化：按月折算
        var monthlyDeduct=t.deduct/12;
        var monthlyBracket=parseInt(t.bracket.replace(/[^0-9]/g,''))||0;
        // 使用年税率表简化：直接按金额对应税率
      }
      // 简化计算
      if(v<=3000) tax=v*0.03;
      else if(v<=12000) tax=v*0.1-210;
      else if(v<=25000) tax=v*0.2-1410;
      else if(v<=35000) tax=v*0.25-2660;
      else if(v<=55000) tax=v*0.3-4410;
      else if(v<=80000) tax=v*0.35-7160;
      else tax=v*0.45-15160;
      tax=Math.max(0,tax);
      var after=v-tax;
      $('#taxResult').innerHTML='应纳税：'+tax.toFixed(2)+' 元 | 税后：'+after.toFixed(2)+' 元';
    });
  }

  // 财税政策 RSS
  var box=$('#taxPolicyList');
  if(!box) return;
  var feeds=[
    {src:'国家税务总局',url:'https://feedx.net/rss/chinatax.xml'},
    {src:'财政部',url:'https://feedx.net/rss/mof.xml'}
  ];
  var allP=[]; var loaded=0; var seenP={};
  feeds.forEach(function(f){
    fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(f.url))
      .then(function(r){return r.json();})
      .then(function(d){
        if(d&&d.items){
          d.items.slice(0,10).forEach(function(it){
            var key=it.title.replace(/\s+/g,'').slice(0,20);
            if(!seenP[key]){ seenP[key]=true; allP.push({title:it.title,url:it.link,src:f.src,pubDate:it.pubDate||''}); }
          });
        }
        loaded++; if(loaded>=feeds.length) showTaxPolicy();
      })
      .catch(function(){ loaded++; if(loaded>=feeds.length) showTaxPolicy(); });
  });
  setTimeout(function(){ if(allP.length===0) showTaxPolicyFallback(); },8000);

  function showTaxPolicy(){
    if(allP.length===0) return showTaxPolicyFallback();
    var dayIdx=new Date().getDate();
    var start=(dayIdx*2)%Math.max(1,allP.length);
    var pick=allP.concat(allP).slice(start,start+8);
    if(pick.length<8) pick=allP.slice(0,8);
    box.innerHTML=pick.map(function(n){
      var d=n.pubDate?new Date(n.pubDate).toLocaleDateString('zh-CN'):'';
      return '<div class="news-item"><a href="'+esc(n.url)+'" target="_blank">'+esc(n.title)+'</a><div class="news-source">'+esc(n.src)+(d?' · '+d:'')+'</div></div>';
    }).join('');
  }
  function showTaxPolicyFallback(){
    var items=[
      {title:'国家税务总局 - 最新政策法规',url:'https://www.chinatax.gov.cn/chinatax/n810341/n810765/index.html',src:'税务总局'},
      {title:'财政部 - 政策发布',url:'https://www.mof.gov.cn/zhuantil/zhengcefagui/',src:'财政部'},
      {title:'人社部 - 社保政策',url:'https://www.mohrss.gov.cn/',src:'人社部'},
      {title:'12366纳税服务平台',url:'https://12366.chinatax.gov.cn/',src:'税务总局'}
    ];
    box.innerHTML=items.map(function(n){
      return '<div class="news-item"><a href="'+esc(n.url)+'" target="_blank">'+esc(n.title)+'</a><div class="news-source">'+esc(n.src)+'</div></div>';
    }).join('');
  }
}

/* ========== 10. 博客 ========== */
function renderBlog(){
  var html = hero('工作台❤️','播客','精选财经播客，随时收听','每日推荐不覆盖，历史随时查看');
  // 今日推荐
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#e8a84b"></span>今日推荐</h2>';
  html += '<div id="todayPod"><div class="news-loading">加载中...</div></div></section>';
  // 往期精选
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#6a7a8f"></span>往期精选（点击查看）</h2>';
  html += '<div id="historyPod"></div></section>';
  return html;
}

// 播客精选库（每日随机推 1 条，不重复推送）
var PODCAST_POOL = [
  {src:'得到',title:'《薛兆丰的经济学课》',app:'得到App',url:'https://www.dedao.cn/course/article.aspx?id=127',desc:'用经济学思维看世界',appIcon:'D'},
  {src:'得到',title:'《香帅的北大金融学》',app:'得到App',url:'https://www.dedao.cn/course/article.aspx?id=29',desc:'北大金融学通俗讲解',appIcon:'D'},
  {src:'得到',title:'《刘润·5分钟商学院》',app:'得到App',url:'https://www.dedao.cn/course/article.aspx?id=61',desc:'商业与财经思维',appIcon:'D'},
  {src:'小宇宙',title:'《搞钱女孩》',app:'小宇宙App',url:'https://www.xiaoyuzhoufm.com/podcast/6270a65be39e7a592e9e4e6c',desc:'女性理财成长播客',appIcon:'宇'},
  {src:'小宇宙',title:'《商业就是这样》',app:'小宇宙App',url:'https://www.xiaoyuzhoufm.com/podcast/60d273c6b8a3e287edf8d3a3',desc:'商业财经深度解读',appIcon:'宇'},
  {src:'小宇宙',title:'《投资ABC》',app:'小宇宙App',url:'https://www.xiaoyuzhoufm.com/podcast/615f0f0e45defa0aaf7c1f3c',desc:'投资入门与进阶',appIcon:'宇'},
  {src:'小宇宙',title:'《钱粮说》',app:'小宇宙App',url:'https://www.xiaoyuzhoufm.com/podcast/6407a7ee9c82a42ee3c2ee3d',desc:'宏观经济与理财',appIcon:'宇'},
  {src:'Apple Podcasts',title:'财经一小时（有声版）',app:'播客App',url:'podcasts://https://podcasts.apple.com/cn/podcast/id1492659142',desc:'每日财经新闻播客',appIcon:'播'},
  {src:'小宇宙',title:'《无人知晓》',app:'小宇宙App',url:'https://www.xiaoyuzhoufm.com/podcast/60e1aaf8b8a3e287edf8d3a2',desc:'投资与人生思考',appIcon:'宇'},
  {src:'得到',title:'《何凡·北大金融学》',app:'得到App',url:'https://www.dedao.cn/course/article.aspx?id=30',desc:'金融思维启蒙',appIcon:'D'},
  {src:'小宇宙',title:'《半途而废》',app:'小宇宙App',url:'https://www.xiaoyuzhoufm.com/podcast/6270a6f5e39e7a592e9e4e6d',desc:'创业与投资故事',appIcon:'宇'},
  {src:'Apple Podcasts',title:'商业财经精选',app:'播客App',url:'podcasts://https://podcasts.apple.com/cn/genre/podcasts-finance/id1512',desc:'Apple 财经分类精选',appIcon:'播'}
];

function loadBlog(){
  var today = todayKey();
  var history = get('podcast_history',[]); // [{date, pod:{...}}]
  var todayEntry = history.find(function(h){ return h.date===today; });

  if(!todayEntry){
    // 今天还没推送，从池中选一个未推送过的
    var pushed = {}; history.forEach(function(h){ pushed[h.pod.title]=true; });
    var remaining = PODCAST_POOL.filter(function(p){ return !pushed[p.title]; });
    var pool = remaining.length>0 ? remaining : PODCAST_POOL; // 全部推送完则重来
    var pick = pool[Math.floor(Math.random()*pool.length)];
    todayEntry = {date:today, pod:pick};
    history.unshift(todayEntry);
    // 只保留最近 100 条
    if(history.length>100) history = history.slice(0,100);
    set('podcast_history', history);
  }

  // 渲染今日推荐
  var s = todayEntry.pod;
  $('#todayPod').innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:8px 0">'+
    '<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;background:'+(s.src==='得到'?'#9b6acf':s.src==='小宇宙'?'#5b8def':'#333')+';color:#fff;font-size:16px;font-weight:700;flex-shrink:0">'+esc(s.appIcon)+'</span>'+
    '<span style="flex:1"><span style="display:block;font-size:14px;color:#1f1f1f;line-height:1.4">'+esc(s.title)+'</span><span style="display:block;font-size:12px;color:#999;margin-top:2px">'+esc(s.desc)+'</span></span>'+
  '</div>'+
  '<a href="'+esc(s.url)+'" '+(s.url.indexOf('http')===0?'target="_blank"':'')+' style="display:block;text-align:center;padding:10px;background:#f0f0ec;border-radius:10px;font-size:13px;color:#6a7a8f;text-decoration:none;margin-top:8px">跳转至 '+esc(s.app)+' ›</a>';

  // 渲染往期精选
  var past = history.filter(function(h){ return h.date!==today; });
  if(past.length===0){
    $('#historyPod').innerHTML = '<p style="text-align:center;color:#bbb;padding:16px 0;font-size:13px">暂无往期记录</p>';
  } else {
    // 默认只显示前 3 条，点击展开全部
    var showAll = get('podcast_show_all', false);
    var list = showAll ? past : past.slice(0,3);
    var html = list.map(function(h){
      var p = h.pod;
      return '<div class="news-item">'+
        '<div style="font-size:11px;color:#bbb;margin-bottom:4px">'+esc(h.date)+'</div>'+
        '<a href="'+esc(p.url)+'" '+(p.url.indexOf('http')===0?'target="_blank"':'')+' style="display:flex;align-items:center;gap:10px;text-decoration:none">'+
          '<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:'+(p.src==='得到'?'#9b6acf':p.src==='小宇宙'?'#5b8def':'#333')+';color:#fff;font-size:14px;font-weight:700;flex-shrink:0">'+esc(p.appIcon)+'</span>'+
          '<span style="flex:1"><span style="display:block;font-size:13px;color:#1f1f1f;line-height:1.4">'+esc(p.title)+'</span><span style="display:block;font-size:11px;color:#999;margin-top:2px">'+esc(p.desc)+'</span></span>'+
        '</a>'+
        '<div style="font-size:11px;color:#6a7a8f;margin-top:4px;padding-left:42px">跳转至 '+esc(p.app)+' ›</div>'+
      '</div>';
    }).join('');
    if(past.length>3){
      html += '<button id="podToggle" style="display:block;width:100%;padding:10px;background:#f0f0ec;border:none;border-radius:8px;font-size:12.5px;color:#666;cursor:pointer;margin-top:4px">'+(showAll?'收起':'查看全部 ('+past.length+'期)')+'</button>';
    }
    $('#historyPod').innerHTML = html;
    var toggle = $('#podToggle');
    if(toggle){
      toggle.addEventListener('click',function(){
        set('podcast_show_all', !get('podcast_show_all',false));
        loadBlog();
      });
    }
  }
}

/* ========== 11. 读书计划 ========== */
var BOOKS = [
  {month:1,title:'《小狗钱钱》',author:'博多·舍费尔',desc:'理财启蒙经典，用童话故事讲述金钱法则',zlib:'https://zh.z-library.sk/s/小狗钱钱'},
  {month:2,title:'《富爸爸穷爸爸》',author:'罗伯特·清崎',desc:'颠覆传统金钱观，区分资产与负债',zlib:'https://zh.z-library.sk/s/富爸爸穷爸爸'},
  {month:3,title:'《巴比伦最富有的人》',author:'乔治·克拉森',desc:'古巴比伦的财富智慧，存钱致富的永恒法则',zlib:'https://zh.z-library.sk/s/巴比伦最富有的人'},
  {month:4,title:'《财务自由之路》',author:'博多·舍费尔',desc:'7年赚到第一个1000万的实用指南',zlib:'https://zh.z-library.sk/s/财务自由之路'},
  {month:5,title:'《指数基金投资指南》',author:'银行螺丝钉',desc:'普通人如何通过指数基金实现财富增长',zlib:'https://zh.z-library.sk/s/指数基金投资指南'},
  {month:6,title:'《漫步华尔街》',author:'伯顿·马尔基尔',desc:'股票投资经典，长期投资策略指南',zlib:'https://zh.z-library.sk/s/漫步华尔街'},
  {month:7,title:'《聪明的投资者》',author:'本杰明·格雷厄姆',desc:'价值投资圣经，巴菲特的启蒙书',zlib:'https://zh.z-library.sk/s/聪明的投资者'},
  {month:8,title:'《穷查理宝典》',author:'查理·芒格',desc:'芒格的智慧箴言录与投资哲学',zlib:'https://zh.z-library.sk/s/穷查理宝典'},
  {month:9,title:'《投资最重要的事》',author:'霍华德·马克斯',desc:'顶级投资者的价值投资心得',zlib:'https://zh.z-library.sk/s/投资最重要的事'},
  {month:10,title:'《金钱心理学》',author:'摩根·豪泽尔',desc:'理解金钱与幸福的关系，重塑金钱观',zlib:'https://zh.z-library.sk/s/金钱心理学'},
  {month:11,title:'《彼得·林奇的成功投资》',author:'彼得·林奇',desc:'业余投资者如何战胜专业基金经理',zlib:'https://zh.z-library.sk/s/彼得林奇的成功投资'},
  {month:12,title:'《周期》',author:'霍华德·马克斯',desc:'理解经济周期，把握投资时机',zlib:'https://zh.z-library.sk/s/周期'}
];
function renderReading(){
  var m = new Date().getMonth()+1;
  var book = BOOKS.find(function(b){return b.month===m;}) || BOOKS[0];
  var html = hero('工作台❤️','读书计划','阅读，让我们成为更好的自己','每月一本理财好书');
  // 本月推荐
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#c97a4a"></span>本月推荐 ('+m+'月)</h2>';
  html += '<div class="book-card"><div class="book-cover" style="background:linear-gradient(135deg,#c97a4a,#e8a070);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;text-align:center;padding:4px">'+esc(book.title.replace(/《|》/g,''))+'</div>';
  html += '<div class="book-info"><h3>'+esc(book.title)+'</h3><p style="color:#c97a4a;font-size:12px;margin-bottom:4px">'+esc(book.author)+'</p><p>'+esc(book.desc)+'</p>';
  html += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">';
  // 优先：本地PDF
  html += bookPdfButtons(book.title);
  // 备选：Z-Library
  html += '<a href="'+esc(book.zlib)+'" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:#eaf1fc;border:1.5px solid #5b8def;border-radius:8px;font-size:12.5px;color:#5b8def;text-decoration:none">Z-Library 下载 ›</a>';
  html += '</div></div></div></section>';
  // 全年书单
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#c97a4a"></span>全年书单（点击直达）</h2>';
  html += BOOKS.map(function(b){
    return '<div class="book-card"><div class="book-cover" style="background:linear-gradient(135deg,#c97a4a,#e8a070)">'+esc(b.title.replace(/《|》/g,''))+'</div><div class="book-info">'+
      '<h3 style="font-size:13px">'+b.month+'月 '+esc(b.title)+'</h3><p style="font-size:11px">'+esc(b.desc)+'</p>'+
      '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">'+
        bookPdfButtons(b.title)+
        '<a href="'+esc(b.zlib)+'" target="_blank" style="padding:4px 10px;background:#eaf1fc;border:1px solid #a8c5f5;border-radius:6px;font-size:11px;color:#5b8def;text-decoration:none">Z-Lib</a>'+
      '</div></div></div>';
  }).join('');
  html += '</section>';
  return html;
}

/* ========== 12. 电影 ========== */
/* 每部电影带多平台链接：
 * pansou = PanSou 搜索（网盘资源，高清完整无剪辑优先）
 * iqiyi  = 爱奇艺 App 深链
 * youku  = 优酷 App 深链
 * bilibili = 哔哩哔哩 App 深链
 * 排列优先级：PanSou(完整无剪辑) > B站(免费高清) > 爱奇艺 > 优酷
 */
var MOVIES = [
  {month:1,title:'《华尔街》',desc:'金融经典，贪婪与欲望的代名词',tag:'股票',
    pansou:'https://pansou.beokla.com/search?q=华尔街+1987',bilibili:'https://www.bilibili.com/search?keyword=华尔街',iqiyi:'iqiyi://mobile.bilibili.com/search?keyword=华尔街',youku:'youku://search?keyword=华尔街'},
  {month:1,title:'《欺诈圣手》',desc:'真实事件改编，债券诈骗故事',tag:'金融',
    pansou:'https://pansou.beokla.com/search?q=欺诈圣手',bilibili:'https://www.bilibili.com/search?keyword=欺诈圣手',iqiyi:'',youku:'youku://search?keyword=欺诈圣手'},
  {month:2,title:'《一个购物狂的自白》',desc:'消费主义警世寓言，理财入门必看',tag:'消费',
    pansou:'https://pansou.beokla.com/search?q=一个购物狂的自白',bilibili:'https://www.bilibili.com/search?keyword=购物狂',iqiyi:'iqiyi://search?keyword=购物狂',youku:''},
  {month:2,title:'《大空头》',desc:'2008年次贷危机，做空华尔街',tag:'股票',
    pansou:'https://pansou.beokla.com/search?q=大空头',bilibili:'https://www.bilibili.com/search?keyword=大空头',iqiyi:'iqiyi://search?keyword=大空头',youku:'youku://search?keyword=大空头'},
  {month:3,title:'《华尔街之狼》',desc:'股票经纪人疯狂人生',tag:'股票',
    pansou:'https://pansou.beokla.com/search?q=华尔街之狼',bilibili:'https://www.bilibili.com/search?keyword=华尔街之狼',iqiyi:'iqiyi://search?keyword=华尔街之狼',youku:'youku://search?keyword=华尔街之狼'},
  {month:3,title:'《监守自盗》',desc:'金融危机纪录片，深度剖析',tag:'金融',
    pansou:'https://pansou.beokla.com/search?q=监守自盗',bilibili:'https://www.bilibili.com/search?keyword=监守自盗',iqiyi:'',youku:''},
  {month:4,title:'《华尔街2》',desc:'金钱永不眠，资本市场博弈',tag:'股票',
    pansou:'https://pansou.beokla.com/search?q=华尔街2+金钱永不眠',bilibili:'https://www.bilibili.com/search?keyword=华尔街2',iqiyi:'iqiyi://search?keyword=华尔街2',youku:'youku://search?keyword=华尔街2'},
  {month:4,title:'《利益风暴》',desc:'投行24小时，金融危机前夜',tag:'金融',
    pansou:'https://pansou.beokla.com/search?q=利益风暴',bilibili:'https://www.bilibili.com/search?keyword=利益风暴',iqiyi:'',youku:''},
  {month:5,title:'《安然：房间里最聪明的人》',desc:'安然事件纪录片',tag:'财务',
    pansou:'https://pansou.beokla.com/search?q=安然+最聪明的人',bilibili:'https://www.bilibili.com/search?keyword=安然事件',iqiyi:'',youku:''},
  {month:5,title:'《抢钱大作战》',desc:'股票经纪骗局，初级投资警示',tag:'股票',
    pansou:'https://pansou.beokla.com/search?q=抢钱大作战',bilibili:'https://www.bilibili.com/search?keyword=抢钱大作战',iqiyi:'',youku:''},
  {month:6,title:'《硅谷传奇》',desc:'科技股创业故事',tag:'创业',
    pansou:'https://pansou.beokla.com/search?q=硅谷传奇',bilibili:'https://www.bilibili.com/search?keyword=硅谷传奇',iqiyi:'',youku:''},
  {month:6,title:'《社交网络》',desc:'Facebook上市前的故事',tag:'投资',
    pansou:'https://pansou.beokla.com/search?q=社交网络',bilibili:'https://www.bilibili.com/search?keyword=社交网络',iqiyi:'iqiyi://search?keyword=社交网络',youku:'youku://search?keyword=社交网络'},
  {month:7,title:'《大而不倒》',desc:'金融危机中的政府救市',tag:'金融',
    pansou:'https://pansou.beokla.com/search?q=大而不倒',bilibili:'https://www.bilibili.com/search?keyword=大而不倒',iqiyi:'',youku:''},
  {month:7,title:'《魔鬼交易员》',desc:'巴林银行倒闭真实事件',tag:'期货',
    pansou:'https://pansou.beokla.com/search?q=魔鬼交易员',bilibili:'https://www.bilibili.com/search?keyword=魔鬼交易员',iqiyi:'',youku:''},
  {month:8,title:'《金钱怪兽》',desc:'电视股评人被劫持，内幕交易',tag:'股票',
    pansou:'https://pansou.beokla.com/search?q=金钱怪兽',bilibili:'https://www.bilibili.com/search?keyword=金钱怪兽',iqiyi:'iqiyi://search?keyword=金钱怪兽',youku:'youku://search?keyword=金钱怪兽'},
  {month:8,title:'《商海通牒》',desc:'投行发现有毒资产后的抉择',tag:'金融',
    pansou:'https://pansou.beokla.com/search?q=商海通牒',bilibili:'https://www.bilibili.com/search?keyword=商海通牒',iqiyi:'',youku:''},
  {month:9,title:'《中国合伙人》',desc:'创业上市故事，中国版社交网络',tag:'创业',
    pansou:'https://pansou.beokla.com/search?q=中国合伙人',bilibili:'https://www.bilibili.com/search?keyword=中国合伙人',iqiyi:'iqiyi://search?keyword=中国合伙人',youku:'youku://search?keyword=中国合伙人'},
  {month:9,title:'《亿万》',desc:'对冲基金大鳄的博弈',tag:'基金',
    pansou:'https://pansou.beokla.com/search?q=亿万+Billions',bilibili:'https://www.bilibili.com/search?keyword=亿万',iqiyi:'iqiyi://search?keyword=亿万',youku:''},
  {month:10,title:'《会计刺客》',desc:'财务高手揭开洗钱黑幕',tag:'财务',
    pansou:'https://pansou.beokla.com/search?q=会计刺客',bilibili:'https://www.bilibili.com/search?keyword=会计刺客',iqiyi:'iqiyi://search?keyword=会计刺客',youku:'youku://search?keyword=会计刺客'},
  {month:10,title:'《套利交易》',desc:'对冲基金大佬的危机',tag:'投资',
    pansou:'https://pansou.beokla.com/search?q=套利交易',bilibili:'https://www.bilibili.com/search?keyword=套利交易',iqiyi:'',youku:''},
  {month:11,title:'《上班女郎》',desc:'职场与投资银行故事',tag:'金融',
    pansou:'https://pansou.beokla.com/search?q=上班女郎+1988',bilibili:'https://www.bilibili.com/search?keyword=上班女郎',iqiyi:'',youku:''},
  {month:11,title:'《银行家》',desc:'房产金融创业真实故事',tag:'房产',
    pansou:'https://pansou.beokla.com/search?q=银行家+2020',bilibili:'https://www.bilibili.com/search?keyword=银行家',iqiyi:'iqiyi://search?keyword=银行家',youku:'youku://search?keyword=银行家'},
  {month:12,title:'《金钱之味》',desc:'财阀家族的金钱欲望',tag:'财富',
    pansou:'https://pansou.beokla.com/search?q=金钱之味',bilibili:'https://www.bilibili.com/search?keyword=金钱之味',iqiyi:'',youku:''},
  {month:12,title:'《国家破产之日》',desc:'韩国金融危机真实事件',tag:'经济',
    pansou:'https://pansou.beokla.com/search?q=国家破产之日',bilibili:'https://www.bilibili.com/search?keyword=国家破产之日',iqiyi:'iqiyi://search?keyword=国家破产之日',youku:''}
];

/* 生成 PDF 多入口链接：
 * 1. Android: intent 协议唤起文件管理器/PDF阅读器
 * 2. iOS: shareddocuments:// 唤起"文件"App 搜索 + iBooks 打开
 * 3. 通用: Z-Library 下载
 */
function pdfOpen(title){
  var name = title.replace(/《|》/g,'');
  var encoded = encodeURIComponent(name);

  // 检测平台
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isAndroid = /Android/.test(navigator.userAgent);

  if(isIOS){
    // iOS：唤起 Apple Books（ibooks://）同时给文件 App 搜索作为备选
    return 'ibooks://asset/'+encoded+'.pdf';
  }
  if(isAndroid){
    // Android：尝试打开 /Download/书名.pdf
    return 'intent://storage/emulated/0/Download/'+encoded+'.pdf#Intent;scheme=content;action=android.intent.action.VIEW;type=application/pdf;S.title='+encoded+';end';
  }
  // 默认
  return 'file:///storage/emulated/0/Download/'+encoded+'.pdf';
}

/* 生成读书计划 PDF 相关按钮（含 iOS 文件搜索入口） */
function bookPdfButtons(title){
  var name = title.replace(/《|》/g,'');
  var encoded = encodeURIComponent(name);
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isAndroid = /Android/.test(navigator.userAgent);

  var html = '';
  if(isIOS){
    // iOS：Apple Books 打开 + 文件 App 搜索
    html += '<a href="ibooks://asset/'+encoded+'.pdf" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:#fff0e8;border:1.5px solid #c97a4a;border-radius:8px;font-size:12.5px;color:#c97a4a;text-decoration:none">用 Apple Books 打开 ›</a>';
    html += '<a href="shareddocuments://'+encoded+'.pdf" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:#f0f7ff;border:1.5px solid #5b8def;border-radius:8px;font-size:12.5px;color:#5b8def;text-decoration:none">文件 App 搜索 ›</a>';
  } else if(isAndroid){
    // Android：文件管理器打开 Download
    html += '<a href="intent://storage/emulated/0/Download/'+encoded+'.pdf#Intent;scheme=content;action=android.intent.action.VIEW;type=application/pdf;S.title='+encoded+';end" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:#fff0e8;border:1.5px solid #c97a4a;border-radius:8px;font-size:12.5px;color:#c97a4a;text-decoration:none">PDF 阅读 ›</a>';
  } else {
    html += '<a href="file:///storage/emulated/0/Download/'+encoded+'.pdf" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:#fff0e8;border:1.5px solid #c97a4a;border-radius:8px;font-size:12.5px;color:#c97a4a;text-decoration:none">PDF 阅读 ›</a>';
  }
  return html;
}

/* 生成电影的多平台链接按钮 */
function movieLinks(v){
  var links = [];
  // 优先级：PanSou（完整无剪辑高清）> B站（免费高清）> 爱奇艺 > 优酷
  if(v.pansou) links.push({label:'PanSou 高清',url:v.pansou,color:'#4ba87a',bg:'#e8f5ee',border:'#7ed0a8',tag:'完整无剪辑'});
  if(v.bilibili) links.push({label:'B站',url:v.bilibili,color:'#fb7299',bg:'#fce8ed',border:'#fb9bb5',tag:'免费高清'});
  if(v.iqiyi) links.push({label:'爱奇艺',url:v.iqiyi,color:'#00be06',bg:'#e8f5e8',border:'#7edb7e',tag:''});
  if(v.youku) links.push({label:'优酷',url:v.youku,color:'#2b9ffb',bg:'#e8f4fc',border:'#7ec5f5',tag:''});
  return '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">'+
    links.map(function(l){
      return '<a href="'+esc(l.url)+'" '+(l.url.indexOf('http')===0?'target="_blank"':'')+' style="display:inline-flex;align-items:center;gap:4px;padding:5px 10px;background:'+esc(l.bg)+';border:1.5px solid '+esc(l.border)+';border-radius:8px;font-size:11.5px;color:'+esc(l.color)+';text-decoration:none">'+esc(l.label)+(l.tag?' <span style="font-size:9px;opacity:.7">['+esc(l.tag)+']</span>':'')+' ›</a>';
    }).join('')+
  '</div>';
}

function renderMovie(){
  var m = new Date().getMonth()+1;
  var picks = MOVIES.filter(function(v){return v.month===m;});
  var html = hero('工作台❤️','电影','光影记录生活','每月两部金融投资类电影');
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#7a6acd"></span>本月推荐 ('+m+'月)</h2>';
  html += '<div style="font-size:11px;color:#999;margin-bottom:10px">点击链接跳转手机视频App，PanSou优先（完整无剪辑）</div>';
  html += picks.map(function(v){
    return '<div class="movie-card"><div class="movie-cover" style="background:linear-gradient(135deg,#7a6acd,#a89ee0)">'+esc(v.title.replace(/《|》/g,''))+'</div><div class="movie-info"><h3>'+esc(v.title)+'</h3><p>'+esc(v.desc)+'</p><p style="margin-top:4px;color:#7a6acd;font-size:11px">标签：'+esc(v.tag)+'</p>'+movieLinks(v)+'</div></div>';
  }).join('')+'</section>';
  html += '<section class="card"><h2 class="card-title"><span class="dot" style="background:#7a6acd"></span>全年片单（点击直达）</h2>';
  html += MOVIES.map(function(v){
    return '<div class="movie-card"><div class="movie-cover" style="background:linear-gradient(135deg,#7a6acd,#a89ee0)">'+esc(v.title.replace(/《|》/g,''))+'</div><div class="movie-info"><h3 style="font-size:13px">'+v.month+'月 '+esc(v.title)+'</h3><p style="font-size:11px">'+esc(v.desc)+'</p>'+movieLinks(v)+'</div></div>';
  }).join('')+'</section>';
  return html;
}

/* ========== 电子小猫咪 ========== */
function openSinaFinance(el){
  var scheme = 'sinafinance://';
  var now = Date.now();
  // 尝试唤起新浪财经App
  window.location.href = scheme;
  // 如果300ms后仍在当前页，说明scheme未生效，跳转到universal link（H5页面）
  setTimeout(function(){
    if (Date.now() - now < 600) {
      window.location.href = 'https://finance.sina.cn/';
    }
  }, 300);
  return false;
}

function initCat(){
  var food = get('cat_food',0);
  updateCatUI(food);
  // 点击头像打开对话
  $('#catAvatar').addEventListener('click',function(){
    $('#catModal').style.display='flex';
    $('#catInput').focus();
  });
  $('#catMask').addEventListener('click',function(){ $('#catModal').style.display='none'; });
  $('#catClose').addEventListener('click',function(){ $('#catModal').style.display='none'; });
  $('#catSend').addEventListener('click',sendCatMsg);
  $('#catInput').addEventListener('keydown',function(e){ if(e.key==='Enter') sendCatMsg(); });
  // 显示气泡
  setTimeout(function(){
    var b=$('#catBubble'); b.classList.add('show');
    setTimeout(function(){ b.classList.remove('show'); },4000);
  },2000);
}
function feedCat(n, msg){
  var food = get('cat_food',0)+n;
  set('cat_food',food);
  updateCatUI(food);
  var b=$('#catBubble'); b.textContent='喵！'+msg+' 现在有 '+food+' 个鸡腿！'; b.classList.add('show');
  setTimeout(function(){ b.classList.remove('show'); },3000);
}
function updateCatUI(food){
  $('#catFood').textContent = food;
  var mood = food>=20?'超开心':food>=10?'开心':food>=5?'一般':food>0?'有点饿':'想睡觉';
  $('#catMood').textContent = mood;
  // 猫咪大小随食物增长
  var avatar = $('#catAvatar');
  var scale = 1 + Math.min(0.3, food*0.01);
  avatar.style.transform = 'scale('+scale+')';
}
function sendCatMsg(){
  var input = $('#catInput');
  var text = input.value.trim();
  if(!text) return;
  var chat = $('#catChat');
  chat.innerHTML += '<div class="chat-msg me">'+esc(text)+'</div>';
  input.value='';
  chat.scrollTop = chat.scrollHeight;
  // 机器人回复
  setTimeout(function(){
    var replies = [
      '喵～我是小白，很高兴陪你！',
      '完成任务可以喂我鸡腿哦！鸡腿越多我越开心～',
      '喵喵喵！你今天真棒！',
      '要不要去看看今天的习惯打卡了没？',
      '我是一只幸福的小猫咪，因为有你照顾我～',
      '坚持记账存钱，离5万目标越来越近啦！',
      '今天的英语单词背了吗？跟我一起加油！',
      '喵～工作待办完成了几个呀？',
      '你完成越多任务，我就越胖越可爱！',
      '读书和看电影也很重要哦，每月都有推荐～',
      '复盘树木长高了吗？我要和树一起长大！',
      '记得运动哦，健身的小白最帅气！'
    ];
    var r = text.includes('饿')?'喵～我也饿了，快去完成任务赚鸡腿！':
            text.includes('你好')||text.includes('hello')||text.includes('hi')?'喵～你好呀！我是小白！':
            text.includes('爱')?'喵～我也爱你！比心～':
            text.includes('累')?'辛苦啦，休息一下，我会陪着你的～':
            text.includes('加油')?'一起加油！你是最棒的！':
            replies[Math.floor(Math.random()*replies.length)];
    chat.innerHTML += '<div class="chat-msg cat">'+r+'</div>';
    chat.scrollTop = chat.scrollHeight;
  },600);
}

/* ========== 时间 ========== */
function updateTime(){
  var d=new Date();
  var el=$('#realTime');
  if(el) el.textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

/* ========== 启动 ========== */
renderMenu();
renderMain();
updateTime();
setInterval(updateTime,30000);
initCat();

})();
