(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const money = n => Number(n || 0).toLocaleString('vi-VN') + ' ₫';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const today = () => new Date().toISOString().slice(0, 10);

  /* ---------- Phiên đăng nhập (do index.html ghi vào) ---------- */
  let session; try { session = JSON.parse(localStorage.getItem('et_session')); } catch (_) {}
  if (!session) { location.href = 'index.html'; return; }

  const wantRole = document.body.dataset.role;
  if (session.role !== wantRole) { 
    location.href = session.role === 'ADMIN' ? 'admin.html' : 'user.html'; 
    return; 
  }
  const isAdmin = wantRole === 'ADMIN';

  /* ---------- Dữ liệu mẫu (thay bằng API khi có backend) ---------- */
  function seed() {
    const a = 'a@demo.vn';
    return {
      users: [
        { email: a, name: 'Nguyễn A', role: 'USER', locked: false, created: '2026-01-10' },
        { email: 'b@demo.vn', name: 'Trần B', role: 'USER', locked: false, created: '2026-02-03' },
        { email: 'c@demo.vn', name: 'Lê C', role: 'USER', locked: true, created: '2026-03-21' },
        { email: 'admin@demo.vn', name: 'Quản trị viên', role: 'ADMIN', locked: false, created: '2025-12-01' }
      ],
      cats: [
        { id: 'g1', name: 'Ăn uống', owner: null }, { id: 'g2', name: 'Đi lại', owner: null },
        { id: 'g3', name: 'Học tập', owner: null }, { id: 'g4', name: 'Lương', owner: null }
      ],
      tx: [
        { id: uid(), owner: a, type: 'out', cat: 'Ăn uống', amount: 2000000, date: '2026-09-12', note: 'Chi tiêu ăn uống tháng 9' },
        { id: uid(), owner: a, type: 'out', cat: 'Đi lại', amount: 500000, date: '2026-09-15', note: 'Xăng + gửi xe' },
        { id: uid(), owner: a, type: 'out', cat: 'Học tập', amount: 800000, date: '2026-09-20', note: 'Khóa tiếng Anh' },
        { id: uid(), owner: a, type: 'in', cat: 'Lương', amount: 9000000, date: '2026-09-05', note: 'Lương tháng 9' },
        { id: uid(), owner: 'b@demo.vn', type: 'out', cat: 'Ăn uống', amount: 1200000, date: '2026-09-10', note: '' }
      ]
    };
  }

  let db; try { db = JSON.parse(localStorage.getItem('et_db')); } catch (_) {}
  if (!db) db = seed();

  const currentUserInDb = db.users.find(u => u.email === session.email);
  if (!currentUserInDb) {
    db.users.push({ email: session.email, name: session.name, role: session.role, locked: false, created: today() });
  } else if (currentUserInDb.locked) {
    alert('Tài khoản của bạn đã bị khóa!');
    localStorage.removeItem('et_session');
    location.href = 'index.html';
    return;
  }

  const save = () => localStorage.setItem('et_db', JSON.stringify(db));
  save();

  const me = session.email;
  const myTx = () => db.tx.filter(t => t.owner === me).sort((a, b) => b.date.localeCompare(a.date));
  const myCats = () => db.cats.filter(c => c.owner === null || c.owner === me);
  const spendBy = list => list.filter(t => t.type === 'out').reduce((m, t) => (m[t.cat] = (m[t.cat] || 0) + t.amount, m), {});

  /* ---------- Menu theo quyền ---------- */
  const menu = isAdmin
    ? [['g', 'Quản trị'], ['adm', 'Dashboard'], ['users', 'Người dùng'], ['gcats', 'Danh mục'], ['stats', 'Thống kê hệ thống'], ['g', 'Cá nhân'], ['account', 'Tài khoản']]
    : [['overview', 'Tổng quan'], ['tx', 'Giao dịch'], ['cats', 'Danh mục'], ['report', 'Báo cáo'], ['account', 'Tài khoản']];
  
  const ICO = { overview:'wallet', tx:'receipt', cats:'layer-group', report:'chart-pie', account:'user', adm:'shield-halved', users:'users', gcats:'layer-group', stats:'chart-pie' };
  const ic = n => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const titles = Object.fromEntries(menu.filter(m => m[0] !== 'g'));

  const sideEl = $('#side');
  if (sideEl) {
    sideEl.innerHTML = `<div class="brand"><span class="brand-mark">${ic('wallet')}</span>Expense Tracker</div>` + menu.map(([k, v]) =>
      k === 'g' ? `<div class="grp">${v}</div>` : `<button class="nav" data-p="${k}">${ic(ICO[k])}${v}</button>`).join('') +
      `<button class="nav" id="logout" style="margin-top:auto">${ic('arrow-right-to-bracket')}Đăng xuất</button>`;
  }

  // Sử dụng ?. an toàn tránh lỗi crash DOM
  if ($('#uname')) $('#uname').textContent = session.name;
  if ($('#urole')) {
    $('#urole').textContent = session.role;
    $('#urole').classList.toggle('admin', isAdmin);
  }

  /* ---------- Hộp thoại ---------- */
  const dlg = $('#dlg'), dform = $('#dform');
  function ask(html, onOk) {
    if (!dlg || !dform) return;
    dform.innerHTML = html + '<div class="row" style="justify-content:flex-end;margin:6px 0 0"><button class="btn ghost" value="x" formnovalidate>Hủy</button><button class="btn" value="ok">Lưu</button></div>';
    dform.onsubmit = e => { if (e.submitter?.value === 'ok') { if (onOk(Object.fromEntries(new FormData(dform))) === false) e.preventDefault(); } };
    dlg.showModal();
  }
  const confirmBox = (msg, fn) => ask(`<h2 style="margin-bottom:6px">${esc(msg)}</h2>`, () => { fn(); render(); });

  /* ---------- Các trang ---------- */
  const P = {};

  P.overview = () => {
    const t = myTx(), inc = sum(t, 'in'), out = sum(t, 'out');
    return `<div class="stats">
      <div class="stat"><small>Thu nhập</small><b class="inc">${money(inc)}</b></div>
      <div class="stat"><small>Chi tiêu</small><b class="out">${money(out)}</b></div>
      <div class="stat"><small>Số dư</small><b>${money(inc - out)}</b></div></div>
      <div class="card"><h2>Chi tiêu của ${esc(session.name)}</h2>${bars(spendBy(t))}</div>
      <div class="card"><h2>Giao dịch gần đây</h2>${txTable(t.slice(0, 5), false)}</div>`;
  };

  P.tx = () => `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">Giao dịch của tôi</h2><button class="btn" data-a="addTx">+ Thêm giao dịch</button></div>${txTable(myTx(), true)}</div>`;

  P.cats = () => {
    const sp = spendBy(myTx());
    return `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">Danh mục</h2><button class="btn" data-a="addCat">+ Thêm danh mục</button></div>
      <div class="wrap"><table><tr><th>Tên</th><th>Loại</th><th>Đã chi</th><th></th></tr>${myCats().map(c => `<tr><td>${esc(c.name)}</td>
      <td><span class="badge ${c.owner ? '' : 'okb'}">${c.owner ? 'Cá nhân' : 'Chung'}</span></td><td>${money(sp[c.name])}</td>
      <td>${c.owner ? `<button class="btn red sm" data-a="delCat" data-id="${c.id}">Xóa</button>` : ''}</td></tr>`).join('')}</table></div>
      <p style="color:var(--muted);font-size:13px;margin-top:12px">Danh mục chung do quản trị viên quản lý, bạn chỉ có thể sửa/xóa danh mục cá nhân.</p></div>`;
  };

  P.report = () => {
    const t = myTx(), months = {};
    t.forEach(x => { const m = x.date.slice(0, 7); months[m] = months[m] || { in: 0, out: 0 }; months[m][x.type] += x.amount; });
    return `<div class="card"><h2>Chi tiêu theo danh mục</h2>${bars(spendBy(t))}</div>
      <div class="card"><h2>Thu chi theo tháng</h2><div class="wrap"><table><tr><th>Tháng</th><th>Thu</th><th>Chi</th><th>Chênh lệch</th></tr>
      ${Object.keys(months).sort().reverse().map(m => `<tr><td>${m}</td><td class="inc">${money(months[m].in)}</td><td class="out">${money(months[m].out)}</td><td>${money(months[m].in - months[m].out)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">Chưa có dữ liệu</td></tr>'}</table></div></div>`;
  };

  P.account = () => `<div class="card" style="max-width:480px"><h2>Thông tin tài khoản</h2>
    <label class="f">Họ và tên<input class="in" id="acName" value="${esc(session.name)}"></label>
    <label class="f">Email<input class="in" value="${esc(session.email)}" disabled></label>
    <label class="f">Quyền<input class="in" value="${session.role}" disabled></label>
    <button class="btn" data-a="saveAcc">Lưu thay đổi</button></div>`;

  /* ----- ADMIN ----- */
  P.adm = () => {
    const users = db.users.filter(u => u.role === 'USER');
    return `<div class="stats"><div class="stat"><small>Người dùng</small><b>${users.length}</b></div>
      <div class="stat"><small>Đang bị khóa</small><b>${users.filter(u => u.locked).length}</b></div>
      <div class="stat"><small>Giao dịch</small><b>${db.tx.length}</b></div>
      <div class="stat"><small>Danh mục chung</small><b>${db.cats.filter(c => !c.owner).length}</b></div></div>
      <div class="card"><h2>Chi tiêu toàn hệ thống</h2>${bars(spendBy(db.tx))}</div>`;
  };

  P.users = () => `<div class="card"><h2>Người dùng</h2><div class="wrap"><table><tr><th>Họ tên</th><th>Email</th><th>Quyền</th><th>Trạng thái</th><th></th></tr>
    ${db.users.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td><span class="badge ${u.role === 'ADMIN' ? 'admin' : ''}">${u.role}</span></td>
    <td><span class="badge ${u.locked ? 'lock' : 'okb'}">${u.locked ? 'Đã khóa' : 'Hoạt động'}</span></td>
    <td><button class="btn ghost sm" data-a="viewUser" data-id="${esc(u.email)}">Xem</button> ${u.role === 'ADMIN' ? '' :
      u.locked ? `<button class="btn grn sm" data-a="lock" data-id="${esc(u.email)}">Mở khóa</button>` : `<button class="btn red sm" data-a="lock" data-id="${esc(u.email)}">Khóa tài khoản</button>`}</td></tr>`).join('')}</table></div></div>`;

  P.gcats = () => `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">Danh mục chung</h2><button class="btn" data-a="addGCat">+ Thêm danh mục</button></div>
    <div class="wrap"><table><tr><th>Tên</th><th></th></tr>${db.cats.filter(c => !c.owner).map(c => `<tr><td>${esc(c.name)}</td>
    <td><button class="btn ghost sm" data-a="editGCat" data-id="${c.id}">Sửa</button> <button class="btn red sm" data-a="delCat" data-id="${c.id}">Xóa</button></td></tr>`).join('')}</table></div></div>`;

  P.stats = () => {
    const per = db.users.filter(u => u.role === 'USER').map(u => ({ n: u.name, v: sum(db.tx.filter(t => t.owner === u.email), 'out') }));
    return `<div class="stats"><div class="stat"><small>Tổng thu</small><b class="inc">${money(sum(db.tx, 'in'))}</b></div>
      <div class="stat"><small>Tổng chi</small><b class="out">${money(sum(db.tx, 'out'))}</b></div></div>
      <div class="card"><h2>Chi tiêu theo danh mục</h2>${bars(spendBy(db.tx))}</div>
      <div class="card"><h2>Chi tiêu theo người dùng</h2>${bars(Object.fromEntries(per.map(p => [p.n, p.v])))}</div>`;
  };

  /* ---------- Hàm dùng chung ---------- */
  function sum(list, type) { return list.filter(t => t.type === type).reduce((s, t) => s + t.amount, 0); }
  function bars(map) {
    const e = Object.entries(map).sort((a, b) => b[1] - a[1]), max = e[0]?.[1] || 1;
    return e.length ? e.map(([k, v]) => `<div class="bar"><span>${esc(k)}</span><i style="width:${Math.max(4, (v / max) * 100)}%"></i><span>${money(v)}</span></div>`).join('') : '<p class="empty">Chưa có dữ liệu chi tiêu</p>';
  }
  function txTable(list, actions) {
    if (!list.length) return '<p class="empty">Chưa có giao dịch nào. Hãy thêm giao dịch đầu tiên.</p>';
    return `<div class="wrap"><table><tr><th>Ngày</th><th>Danh mục</th><th>Ghi chú</th><th>Số tiền</th>${actions ? '<th></th>' : ''}</tr>${list.map(t => `<tr><td>${t.date}</td><td>${esc(t.cat)}</td><td>${esc(t.note || '—')}</td>
      <td class="${t.type === 'in' ? 'inc' : 'out'}">${t.type === 'in' ? '+' : '−'}${money(t.amount)}</td>${actions ? `<td><button class="btn ghost sm" data-a="editTx" data-id="${t.id}">Sửa</button> <button class="btn red sm" data-a="delTx" data-id="${t.id}">Xóa</button></td>` : ''}</tr>`).join('')}</table></div>`;
  }
  function txForm(t = {}) {
    return `<h2 style="margin-bottom:14px">${t.id ? 'Sửa giao dịch' : 'Thêm giao dịch'}</h2>
      <label class="f">Loại<select name="type"><option value="out" ${t.type === 'out' ? 'selected' : ''}>Chi tiêu</option><option value="in" ${t.type === 'in' ? 'selected' : ''}>Thu nhập</option></select></label>
      <label class="f">Danh mục<select name="cat">${myCats().map(c => `<option ${c.name === t.cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
      <label class="f">Số tiền (₫)<input class="in" name="amount" type="number" min="1" required value="${t.amount || ''}"></label>
      <label class="f">Ngày<input class="in" name="date" type="date" required value="${t.date || today()}"></label>
      <label class="f">Ghi chú<input class="in" name="note" value="${esc(t.note || '')}"></label>`;
  }
  const saveTx = (d, id) => {
    d.amount = Number(d.amount);
    if (!(d.amount > 0)) return false;
    if (id) {
      const target = db.tx.find(t => t.id === id);
      if (target) Object.assign(target, d);
    } else {
      db.tx.push({ id: uid(), owner: me, ...d });
    }
    save(); render();
  };

  /* ---------- Hành động ---------- */
  const A = {
    addTx: () => ask(txForm(), d => saveTx(d)),
    editTx: id => ask(txForm(db.tx.find(t => t.id === id)), d => saveTx(d, id)),
    delTx: id => confirmBox('Xóa giao dịch này?', () => { db.tx = db.tx.filter(t => t.id !== id); save(); }),
    addCat: () => ask('<h2 style="margin-bottom:14px">Thêm danh mục</h2><label class="f">Tên danh mục<input class="in" name="name" required></label>',
      d => { if (!d.name?.trim()) return false; db.cats.push({ id: uid(), name: d.name.trim(), owner: me }); save(); render(); }),
    addGCat: () => ask('<h2 style="margin-bottom:14px">Thêm danh mục chung</h2><label class="f">Tên danh mục<input class="in" name="name" required></label>',
      d => { if (!d.name?.trim()) return false; db.cats.push({ id: uid(), name: d.name.trim(), owner: null }); save(); render(); }),
    editGCat: id => { 
      const c = db.cats.find(x => x.id === id);
      if (!c) return;
      ask(`<h2 style="margin-bottom:14px">Sửa danh mục</h2><label class="f">Tên danh mục<input class="in" name="name" required value="${esc(c.name)}"></label>`,
        d => { if (!d.name?.trim()) return false; db.tx.forEach(t => { if (t.cat === c.name) t.cat = d.name.trim(); }); c.name = d.name.trim(); save(); render(); }); 
    },
    delCat: id => confirmBox('Xóa danh mục này?', () => { db.cats = db.cats.filter(c => c.id !== id); save(); }),
    lock: email => { const u = db.users.find(x => x.email === email); if (u) { u.locked = !u.locked; save(); render(); } },
    viewUser: email => { 
      const u = db.users.find(x => x.email === email), t = db.tx.filter(x => x.owner === email);
      if (!u || !dform || !dlg) return;
      dform.innerHTML = `<h2 style="margin-bottom:10px">${esc(u.name)}</h2><p>${esc(u.email)} · ${u.role}</p><p style="margin:6px 0 14px">Tham gia: ${u.created} · ${u.locked ? 'Đã khóa' : 'Hoạt động'}</p>
        ${bars(spendBy(t))}<div class="row" style="justify-content:flex-end;margin:14px 0 0"><button class="btn" value="x">Đóng</button></div>`;
      dform.onsubmit = null; dlg.showModal(); 
    },
    saveAcc: () => { 
      const n = $('#acName')?.value.trim(); if (!n) return;
      session.name = n; 
      const u = db.users.find(x => x.email === me);
      if (u) u.name = n;
      localStorage.setItem('et_session', JSON.stringify(session)); save(); 
      if ($('#uname')) $('#uname').textContent = n; 
      alert('Đã lưu thay đổi'); 
    }
  };

  /* ---------- Điều hướng ---------- */
  let page = location.hash.slice(1);
  const defaultPage = menu.find(m => m[0] !== 'g')[0];

  const hero = () => {
    const stk = isAdmin ? ['users', 'shield-halved', 'chart-pie', 'layer-group'] : ['wallet', 'coins', 'piggy-bank', 'receipt'];
    return `<section class="hero"><h2>${isAdmin ? 'Bảng điều khiển quản trị' : 'Xin chào, ' + esc(session.name)}</h2>
      <p>${isAdmin ? 'Quản lý người dùng, danh mục chung và theo dõi tình hình toàn hệ thống.' : 'Ghi chép thu chi, kiểm soát ngân sách và xem báo cáo của riêng bạn.'}</p>
      <div aria-hidden="true">${stk.map((n, i) => `<span class="fi f${i + 1}">${ic(n)}</span>`).join('')}</div></section>`;
  };

  function render() {
    page = location.hash.slice(1);
    if (!P[page] || !titles[page]) page = defaultPage;

    if ($('#title')) $('#title').textContent = titles[page];
    document.querySelectorAll('.nav[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === page));
    if ($('#view')) $('#view').innerHTML = (page === defaultPage ? hero() : '') + P[page]();
    if ($('#side')) $('#side').classList.remove('open');
  }

  // Bắt sự kiện đổi URL / Nút Back-Forward trên trình duyệt
  window.addEventListener('hashchange', render);

  document.addEventListener('click', e => {
    const n = e.target.closest('.nav[data-p]');
    if (n) { location.hash = n.dataset.p; return; }
    const a = e.target.closest('[data-a]');
    if (a && A[a.dataset.a]) A[a.dataset.a](a.dataset.id);
  });

  const logoutBtn = $('#logout');
  if (logoutBtn) {
    logoutBtn.onclick = () => { localStorage.removeItem('et_session'); location.href = 'index.html'; };
  }

  const menuBtn = $('#menuBtn');
  if (menuBtn) {
    menuBtn.onclick = () => $('#side')?.classList.toggle('open');
  }

  render();
})();