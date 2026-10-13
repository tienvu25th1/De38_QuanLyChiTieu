(() => {
  /* ===== Tiện ích ===== */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => Number(n || 0).toLocaleString('vi-VN') + ' ₫';
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };   // ngày theo giờ máy (không lệch UTC)
  const fdate = d => d ? d.split('-').reverse().join('/') : '';
  const NONE = 'Chưa có dữ liệu';
  const ic = (n, st) => `<svg class="ic${st ? ' st' : ''}" aria-hidden="true"><use href="#${n}"/></svg>`;

  /* ===== Sprite icon (Font Awesome Free 6.4, CC BY 4.0, lấy từ index.html) ===== */
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wallet" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></symbol><symbol id="i-coins" viewBox="0 0 512 512"><path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z"/></symbol><symbol id="i-piggy-bank" viewBox="0 0 576 512"><path d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7H256c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96h11.5c10.4 0 18 9.8 15.5 19.9l-13.8 55.2c15.8 14.8 28.7 32.8 37.5 52.9H544c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H512c-9.1 12.1-19.9 22.9-32 32v64c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H256v32c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V416c-34.9-26.2-58.7-66.3-63.2-112H68c-37.6 0-68-30.4-68-68s30.4-68 68-68h4c13.3 0 24 10.7 24 24s-10.7 24-24 24H68c-11 0-20 9-20 20s9 20 20 20H99.2c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2H384zm64 136a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"/></symbol><symbol id="i-receipt" viewBox="0 0 384 512"><path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z"/></symbol><symbol id="i-chart-pie" viewBox="0 0 576 512"><path d="M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z"/></symbol><symbol id="i-layer-group" viewBox="0 0 576 512"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></symbol><symbol id="i-users" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/></symbol><symbol id="i-shield-halved" viewBox="0 0 512 512"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"/></symbol><symbol id="i-user" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></symbol><symbol id="i-arrow-right-to-bracket" viewBox="0 0 512 512"><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></symbol><symbol id="i-lock" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></symbol><symbol id="i-pen-to-square" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></symbol><symbol id="i-envelope" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></symbol><symbol id="i-at" viewBox="0 0 512 512"><path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></symbol><symbol id="i-eye" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></symbol><symbol id="i-eye-slash" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></symbol>' +
    '<symbol id="s-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>' +
    '<symbol id="s-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>' +
    '<symbol id="s-search" viewBox="0 0 24 24"><path d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/></symbol>' +
    '<symbol id="s-cal" viewBox="0 0 24 24"><path d="M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM4 11h16M8 3v4M16 3v4"/></symbol>' +
    '<symbol id="s-swap" viewBox="0 0 24 24"><path d="M7 4v16M7 4L3 8M7 4l4 4M17 20V4M17 20l-4-4M17 20l4-4"/></symbol>' +
    '<symbol id="s-filter" viewBox="0 0 24 24"><path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/></symbol>' +
    '<symbol id="s-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></symbol>' +
    '<symbol id="s-unlock" viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 9.6-2M5 11h14v10H5z"/></symbol>' +
    '<symbol id="s-download" viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></symbol>' +
    '<symbol id="s-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></symbol>' +
    '<symbol id="s-left" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></symbol>' +
    '<symbol id="s-right" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol>' +
    '<symbol id="s-print" viewBox="0 0 24 24"><path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2M7 14h10v6H7z"/></symbol></svg>');

  /* ===== Phiên đăng nhập & kho dữ liệu =====
     index.html ghi 'et_session' + 'et_users' (localStorage). Giao dịch / danh mục lưu ở 'et_tx' / 'et_cats'.
     TODO: thay các hàm read/write/save* bằng gọi API (fetch) tới Backend + PostgreSQL khi đã có Backend.
     Gợi ý: GET/POST/PUT/DELETE /api/transactions, /api/categories, /api/users, /api/reports */
  const ROLE = document.body.dataset.role, isAdmin = ROLE === 'ADMIN';
  const REQUIRE_LOGIN = true;   // index.html đã đăng nhập thật (localStorage) nên bật kiểm tra phiên
  const USERS_KEY = 'et_users', SESSION_KEY = 'et_session', TX_KEY = 'et_tx', CAT_KEY = 'et_cats';
  const BUDGET_KEY = 'et_budgets', GOAL_KEY = 'et_goals', ACCOUNTS_KEY = 'et_accounts';
  const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (_) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const leave = () => { localStorage.removeItem(SESSION_KEY); location.href = 'index.html'; };
  let session = read(SESSION_KEY, null);
  if (!session) {
    if (REQUIRE_LOGIN) { location.href = 'index.html'; return; }
    session = { name: isAdmin ? 'Quản trị viên' : 'Người dùng', email: '', username: '', role: ROLE };
  } else if (session.role !== ROLE) { location.href = session.role === 'ADMIN' ? 'admin.html' : 'user.html'; return; }
  else if (REQUIRE_LOGIN) {
    const me = read(USERS_KEY, []).find(u => u.email === session.email);
    if (!me || me.status === 'LOCKED' || me.role !== ROLE) { leave(); return; }   // bị xóa / khóa / đổi quyền → đăng nhập lại
  }

  const FAMILY_KEY = 'et_families', FAMILY_MEMBERS_KEY = 'et_family_members', FAMILY_INVITES_KEY = 'et_family_invites';
  const db = { tx: read(TX_KEY, []), cats: read(CAT_KEY, []), users: read(USERS_KEY, []), budgets: read(BUDGET_KEY, []), goals: read(GOAL_KEY, []), accounts: read(ACCOUNTS_KEY, []), families: read(FAMILY_KEY, []), familyMembers: read(FAMILY_MEMBERS_KEY, []), familyInvites: read(FAMILY_INVITES_KEY, []) };
  const saveUsers = () => write(USERS_KEY, db.users), saveTx = () => write(TX_KEY, db.tx), saveCats = () => write(CAT_KEY, db.cats);
  const saveBudgets = () => write(BUDGET_KEY, db.budgets), saveGoals = () => write(GOAL_KEY, db.goals), saveAccounts = () => write(ACCOUNTS_KEY, db.accounts);
  const saveFamilies = () => write(FAMILY_KEY, db.families), saveFamilyMembers = () => write(FAMILY_MEMBERS_KEY, db.familyMembers), saveFamilyInvites = () => write(FAMILY_INVITES_KEY, db.familyInvites);
  const sync = () => { db.users = read(USERS_KEY, []); db.tx = read(TX_KEY, []); db.cats = read(CAT_KEY, []); db.budgets = read(BUDGET_KEY, []); db.goals = read(GOAL_KEY, []); db.accounts = read(ACCOUNTS_KEY, []); db.families = read(FAMILY_KEY, []); db.familyMembers = read(FAMILY_MEMBERS_KEY, []); db.familyInvites = read(FAMILY_INVITES_KEY, []); };
  const DEFAULT_EXPENSE_CATEGORIES = [
    ['Ăn uống', ['Đi chợ/Siêu thị', 'Ăn ngoài', 'Cà phê', 'Giao đồ ăn']],
    ['Di chuyển', ['Xăng xe', 'Xe công nghệ (Grab/Be)', 'Vé xe/Máy bay', 'Phí đỗ/VETC']],
    ['Hóa đơn & Tiện ích', ['Điện', 'Nước', 'Internet/Data', 'Phí chung cư']],
    ['Sức khỏe', ['Thuốc men', 'Khám bệnh', 'Bảo hiểm']],
    ['Mua sắm', ['Quần áo', 'Đồ công nghệ', 'Gia dụng']],
    ['Giải trí & Du lịch', ['Phim ảnh', 'Game', 'Gym/Sports', 'Phòng khách sạn/Tour']],
    ['Học tập', ['Học phí', 'Khóa học', 'Sách vở']],
    ['Đối ngoại', ['Cưới hỏi/Sinh nhật', 'Biếu người thân', 'Quyên góp']],
    ['Khoản nợ & Phí', ['Ví trả sau', 'Trả góp', 'Phí giao dịch']],
    ['Tích lũy & Đầu tư', ['Tiết kiệm', 'Túi Thần Tài', 'Chứng khoán']]
  ];
  const DEFAULT_CATEGORIES_KEY = 'et_default_expense_categories_v1';
  if (!read(DEFAULT_CATEGORIES_KEY, false)) {
    const existing = new Set(db.cats.filter(c => !c.owner && c.type === 'out').map(c => c.name.toLocaleLowerCase('vi')));
    DEFAULT_EXPENSE_CATEGORIES.forEach(([group, names]) => names.forEach(name => {
      const categoryName = `${group} — ${name}`;
      if (!existing.has(categoryName.toLocaleLowerCase('vi'))) db.cats.push({ id: uid(), owner: '', type: 'out', name: categoryName, note: '' });
    }));
    saveCats(); write(DEFAULT_CATEGORIES_KEY, true);
  }
  const DEFAULT_INCOME_CATEGORIES_KEY = 'et_default_income_categories_v1';
  if (!read(DEFAULT_INCOME_CATEGORIES_KEY, false)) {
    const existing = new Set(db.cats.filter(c => !c.owner && c.type === 'in').map(c => c.name.toLocaleLowerCase('vi')));
    ['Lương', 'Thưởng', 'Kinh doanh', 'Thu nhập khác'].forEach(name => {
      if (!existing.has(name.toLocaleLowerCase('vi'))) db.cats.push({ id: uid(), owner: '', type: 'in', name, note: '' });
    });
    saveCats(); write(DEFAULT_INCOME_CATEGORIES_KEY, true);
  }
  const S = {};   // trạng thái bộ lọc / đang sửa / phân trang

  /* ===== Dữ liệu dùng chung ===== */
  const locked = u => u.status === 'LOCKED';
  const findUser = email => db.users.find(u => u.email === email);
  const uname = e => findUser(e)?.name || e || '—';
  const catOf = id => db.cats.find(c => c.id === id);
  const cname = t => catOf(t.catId)?.name || '(đã xóa)';
  // User thấy danh mục của mình + danh mục mặc định (owner rỗng); Admin thấy tất cả
  const visCats = () => (isAdmin ? db.cats : db.cats.filter(c => !c.owner || c.owner === session.email))
    .slice().sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  const catLabel = c => isAdmin && c.owner ? `${c.name} — ${uname(c.owner)}` : c.name;
  const CATEGORY_SECTIONS = [
    { name: 'Thiết yếu', families: ['Ăn uống', 'Di chuyển', 'Hóa đơn & Tiện ích', 'Sức khỏe'] },
    { name: 'Lối sống', families: ['Mua sắm', 'Giải trí & Du lịch'] },
    { name: 'Phát triển cá nhân', families: ['Học tập'] },
    { name: 'Mối quan hệ & Hiếu hỷ', families: ['Đối ngoại'] },
    { name: 'Tài chính & Nghĩa vụ', families: ['Khoản nợ & Phí', 'Tích lũy & Đầu tư'] }
  ];
  const categoryParts = c => { const split = c.name.indexOf(' — '); return split < 0 ? { family: '', leaf: c.name } : { family: c.name.slice(0, split), leaf: c.name.slice(split + 3) }; };
  const categorySection = c => {
    const { family } = categoryParts(c), section = CATEGORY_SECTIONS.find(s => s.families.includes(family));
    return section?.name || (c.type === 'in' ? 'Thu nhập' : c.owner ? (isAdmin ? `Danh mục · ${uname(c.owner)}` : 'Danh mục của tôi') : 'Danh mục khác');
  };
  const myTx = () => {
    if (isAdmin) return db.tx;
    const familyId = (S.scopeFilter || 'personal') === 'family' ? activeFamilyId() : '';
    return db.tx.filter(t => {
      if (t.scope === 'family') return !!familyId && t.familyId === familyId;
      return t.owner === session.email && (!t.scope || t.scope === 'personal');
    });
  };
  async function hashPw(pw) {   // giống index.html
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return pw;
  }
  const tempPw = () => { const a = new Uint32Array(2); crypto.getRandomValues(a); return 'Et@' + a[0].toString(36).slice(0, 6) + (a[1] % 90 + 10); };
  const monthRe = /^\d{4}-\d{2}$/;
  const inMonth = t => !monthRe.test(S.dm || '') || t.date.startsWith(S.dm);
  const shiftMonth = (ym, n) => { let [y, m] = ym.split('-').map(Number); m += n; while (m > 12) { m -= 12; y++; } while (m < 1) { m += 12; y--; } return y + '-' + String(m).padStart(2, '0'); };
  const top = (m, n = 5) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n));
  const familyOf = id => db.families.find(f => f.id === id);
  const familyMembersOf = familyId => db.familyMembers.filter(m => m.familyId === familyId && m.status !== 'PENDING');
  const myFamilyMemberships = () => db.familyMembers.filter(m => m.userEmail === session.email && m.status !== 'PENDING');
  const familyScopeOptions = () => { const list = myFamilyMemberships().map(m => { const family = familyOf(m.familyId); return family ? [m.familyId, family.name] : null; }).filter(Boolean); return [['personal', 'Cá nhân'], ...list]; };
  const activeFamilyId = () => (myFamilyMemberships()[0] || {}).familyId || '';
  const activeFamily = () => { const familyId = activeFamilyId(); return familyId ? familyOf(familyId) : null; };
  const familyVisibleTx = () => {
    if (isAdmin) return db.tx;
    const familyId = (S.scopeFilter || 'personal') === 'family' ? activeFamilyId() : '';
    return db.tx.filter(t => {
      if (t.scope === 'family') return !!familyId && t.familyId === familyId;
      return t.owner === session.email && (!t.scope || t.scope === 'personal');
    });
  };

  /* ===== Dựng ô nhập ===== */
  const opt = (arr, sel, ph) => (ph !== undefined ? `<option value="">${ph}</option>` : '') +
    arr.map(([v, l]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('');
  const catOpts = (sel, ph, type) => {
    const categories = visCats().filter(c => !type || c.type === type), groups = new Map();
    categories.forEach(c => { const section = categorySection(c); if (!groups.has(section)) groups.set(section, []); groups.get(section).push(c); });
    const order = [...CATEGORY_SECTIONS.map(s => s.name), 'Thu nhập', 'Danh mục của tôi', 'Danh mục khác', ...Array.from(groups.keys()).sort((a, b) => a.localeCompare(b, 'vi'))];
    return (ph !== undefined ? `<option value="">${esc(ph)}</option>` : '') + [...new Set(order)].filter(section => groups.has(section)).map(section =>
      `<optgroup label="${esc(section)}">${groups.get(section).map(c => `<option value="${esc(c.id)}"${c.id === sel ? ' selected' : ''}>${esc(catLabel(c))}</option>`).join('')}</optgroup>`).join('');
  };
  const TYPES = [['in', 'Thu'], ['out', 'Chi']];
  const ACCOUNT_TYPES = [['cash', 'Tiền mặt'], ['bank', 'Ngân hàng'], ['wallet', 'Ví điện tử']];
  const LEGACY_ACCOUNT_TYPES = { cash: 'cash', bank_account: 'bank', e_wallet: 'wallet' };
  const accountLabel = value => db.accounts.find(a => a.id === value)?.name || ACCOUNT_TYPES.find(([key]) => key === LEGACY_ACCOUNT_TYPES[value])?.[1] || 'Chưa chọn';
  const myAccounts = () => db.accounts.filter(a => a.owner === session.email).slice().sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name, 'vi'));
  const accountBalance = account => Number(account.openingBalance || 0) + db.tx.filter(t => t.owner === account.owner && t.accountId === account.id)
    .reduce((balance, transaction) => balance + (transaction.type === 'in' ? Number(transaction.amount) : -Number(transaction.amount)), 0);
  const accountTypeLabel = type => ACCOUNT_TYPES.find(([key]) => key === type)?.[1] || 'Tài khoản khác';
  if (!isAdmin) {
    const defaults = [
      { type: 'cash', name: 'Tiền mặt' },
      { type: 'bank', name: 'Ngân hàng' },
      { type: 'wallet', name: 'Ví điện tử' }
    ];
    let accountsChanged = false, transactionsChanged = false;
    defaults.forEach(({ type, name }) => {
      if (db.accounts.some(a => a.owner === session.email && a.type === type)) return;
      db.accounts.push({ id: uid(), owner: session.email, name, type, openingBalance: 0, note: '', createdAt: new Date().toISOString() });
      accountsChanged = true;
    });
    db.tx.filter(t => t.owner === session.email && !t.accountId).forEach(transaction => {
      const type = LEGACY_ACCOUNT_TYPES[transaction.account] || 'cash';
      const account = db.accounts.find(a => a.owner === session.email && a.type === type);
      if (!account) return;
      transaction.accountId = account.id;
      transactionsChanged = true;
    });
    if (accountsChanged) saveAccounts();
    if (transactionsChanged) saveTx();
  }
  const PAYMENT_METHODS = [['cash', 'Tiền mặt'], ['bank', 'Chuyển khoản'], ['card', 'Thẻ ngân hàng'], ['wallet', 'Ví điện tử']];
  const paymentLabel = value => PAYMENT_METHODS.find(([key]) => key === value)?.[1] || 'Chưa chọn';
  const formatTimestamp = value => { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString('vi-VN') : '—'; };
  function field(id, label, icon, o = {}) {
    const tag = o.tag || 'input', st = icon.startsWith('s-');
    const el = tag === 'select' ? `<select id="${id}" name="${id}" ${o.attr || ''}>${o.opts}</select>`
      : tag === 'textarea' ? `<textarea id="${id}" name="${id}" placeholder=" " rows="2" ${o.attr || ''}>${esc(o.val)}</textarea>`
      : `<input id="${id}" name="${id}" type="${o.type || 'text'}" placeholder=" " value="${esc(o.val)}" ${o.attr || ''}>`;
    const fl = tag === 'select' || o.type === 'date' || o.type === 'month' ? ' fl' : '';
    const pw = o.type === 'password' ? '<button type="button" class="toggle-pw" aria-label="Hiện mật khẩu" data-act="pw">' + ic('i-eye') + '</button>' : '';
    return `<div class="field"><div class="input-wrap${fl}">${ic(icon, st).replace('class="ic', 'class="ic lead')}${el}<label for="${id}">${label}</label>${pw}</div>` +
      `<div class="err-slot"><p class="error"><span></span></p></div></div>`;
  }
  const live = (id, label, icon, o = {}) => field(id, label, icon, { ...o, attr: `data-live ${o.attr || ''}` });
  const stat = (label, v, icon, fmt = money) => `<div class="stat">${ic(icon)}<small>${label}</small><b class="${v == null ? 'none' : ''}">${v == null ? NONE : fmt(v)}</b></div>`;
  const chartEmpty = (t = NONE) => `<div class="chart-empty">${ic('i-chart-pie')}<span>${t}</span></div>`;
  const sum = (l, t) => l.filter(x => x.type === t).reduce((s, x) => s + x.amount, 0);
  const monthNow = () => today().slice(0, 7);
  const myBudgets = () => db.budgets.filter(b => b.owner === session.email);
  const myGoals = () => db.goals.filter(g => g.owner === session.email);
  const budgetSpent = b => myTx().filter(t => t.type === 'out' && t.catId === b.catId && t.date.startsWith(b.month)).reduce((s, t) => s + t.amount, 0);
  const progress = (value, target) => Math.min(100, Math.round(Number(value || 0) / Math.max(Number(target) || 1, 1) * 100));
  const progressBar = (value, target, state = '') => `<div class="progress-track" role="progressbar" aria-valuenow="${progress(value, target)}" aria-valuemin="0" aria-valuemax="100"><i class="progress-fill ${state}" style="width:${progress(value, target)}%"></i></div>`;
  const emptyRow = (cols) => `<tr class="empty"><td colspan="${cols}">${NONE}</td></tr>`;
  const arrow = k => (S.sk || 'date') === k ? ((S.sd || 'desc') === 'asc' ? ' ▲' : ' ▼') : '';
  const table = (heads, bodyId) => `<div class="wrap"><table><thead><tr>${heads.map(h => typeof h === 'string' ? `<th>${h}</th>`
    : `<th class="sort" data-act="sort" data-id="${h.k}" data-l="${h.l}" title="Bấm để sắp xếp">${h.l}${arrow(h.k)}</th>`).join('')}</tr></thead><tbody id="${bodyId}"></tbody></table></div><div id="pager"></div>`;
  function bars(map, cls = '', fmt = money) {
    const e = Object.entries(map).sort((a, b) => b[1] - a[1]), max = e[0]?.[1] || 1;
    return e.length ? e.map(([k, v]) => `<div class="bar"><span>${esc(k)}</span><i class="${cls}" style="width:${Math.max(4, v / max * 100)}%"></i><span>${fmt(v)}</span></div>`).join('') : chartEmpty();
  }
  const by = (l, t) => l.filter(x => x.type === t).reduce((m, x) => { const k = cname(x); m[k] = (m[k] || 0) + x.amount; return m; }, {});
  const cmp = (a, b) => { const m = Math.max(a, b, 1);
    return `<div class="bar"><span>Thu</span><i style="width:${Math.max(4, a / m * 100)}%"></i><span>${money(a)}</span></div><div class="bar"><span>Chi</span><i class="e" style="width:${Math.max(4, b / m * 100)}%"></i><span>${money(b)}</span></div>`; };
  const dashboardCompare = (income, expense) => {
    const max = Math.max(income, expense, 1);
    return `<div class="dashboard-flow" role="group" aria-label="So sánh tổng thu và chi">
      ${[['Thu vào', income, 'income'], ['Chi ra', expense, 'expense']].map(([label, value, kind], index) => {
        const width = Math.max(value ? 3 : 0, value / max * 100);
        return `<div class="dashboard-flow-row" style="--chart-delay:${index * 100}ms"><div class="dashboard-flow-label"><span class="dashboard-swatch ${kind}"></span><span>${label}</span><strong>${money(value)}</strong></div>
          <div class="dashboard-flow-track" role="progressbar" aria-label="${label}" aria-valuenow="${Math.round(value / max * 100)}" aria-valuemin="0" aria-valuemax="100"><i class="dashboard-flow-fill ${kind}" style="--bar-width:${width}%"></i></div></div>`;
      }).join('')}
      <div class="dashboard-flow-note">${income >= expense ? `Dư ${money(income - expense)} trong kỳ` : `Chi vượt thu ${money(expense - income)}`}</div></div>`;
  };
  const dashboardRankedBars = (map, kind, format = money) => {
    const items = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5), max = items[0]?.[1] || 1;
    if (!items.length) return chartEmpty('Chưa có dữ liệu trong kỳ này');
    return `<div class="dashboard-ranks">${items.map(([label, value], index) => `<div class="dashboard-rank" style="--chart-delay:${index * 65}ms">
      <div class="dashboard-rank-head"><span class="dashboard-rank-number">${String(index + 1).padStart(2, '0')}</span><span class="dashboard-rank-label">${esc(label)}</span><strong>${format(value)}</strong></div>
      <div class="dashboard-rank-track" role="progressbar" aria-label="${esc(label)}" aria-valuenow="${Math.round(value / max * 100)}" aria-valuemin="0" aria-valuemax="100"><i class="dashboard-rank-fill ${kind}" style="--bar-width:${Math.max(3, value / max * 100)}%"></i></div></div>`).join('')}</div>`;
  };
  const PALETTE = ['#2563eb', '#0ea5e9', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];
  function pie(map) {
    const e = Object.entries(map).sort((a, b) => b[1] - a[1]), total = e.reduce((s, x) => s + x[1], 0);
    if (!total) return chartEmpty();
    let acc = 0;
    const stops = e.map(([, v], i) => { const a = acc / total * 100; acc += v; return `${PALETTE[i % PALETTE.length]} ${a}% ${acc / total * 100}%`; }).join(',');
    return `<div class="pie-wrap"><div class="pie" style="background:conic-gradient(${stops})"></div><div class="legend">${e.map(([k, v], i) =>
      `<div><i style="background:${PALETTE[i % PALETTE.length]}"></i><span>${esc(k)}</span><b>${money(v)} · ${Math.round(v / total * 100)}%</b></div>`).join('')}</div></div>`;
  }
  const chart = (map, cls) => S.rv === 'pie' ? pie(map) : bars(map, cls);

  /* ===== Phân trang ===== */
  let PG = { total: 0, pages: 1, off: 0 }, PAGE_IDS = [];
  function paged(list) {
    const ps = Number(S.ps) || 10;
    PG.total = list.length; PG.pages = Math.max(1, Math.ceil(list.length / ps));
    S.pg = Math.min(Math.max(1, S.pg || 1), PG.pages); PG.off = (S.pg - 1) * ps;
    return list.slice(PG.off, PG.off + ps);
  }
  const pagerHtml = () => {
    if (!PG.total) return '';
    const pages = [...new Set([1, PG.pages, S.pg - 1, S.pg, S.pg + 1].filter(n => n >= 1 && n <= PG.pages))].sort((a, b) => a - b);
    const pageButtons = pages.map((n, i) => `${i && n - pages[i - 1] > 1 ? '<span class="pager-gap">…</span>' : ''}<button type="button" class="sm${n === S.pg ? ' current' : ''}" data-act="pg" data-id="${n}"${n === S.pg ? ' aria-current="page"' : ''}>${n}</button>`).join('');
    return `<div class="pager"><span>Tổng ${PG.total} dòng · Trang ${S.pg}/${PG.pages}</span><div class="cell-act pager-controls">
      <select id="ps" class="ps-sel" data-live aria-label="Số dòng mỗi trang">${[10, 20, 50].map(n => `<option value="${n}"${(Number(S.ps) || 10) === n ? ' selected' : ''}>${n} dòng/trang</option>`).join('')}</select>
      <button type="button" class="sm" data-act="pg" data-id="${S.pg - 1}" ${S.pg <= 1 ? 'disabled' : ''}>${ic('s-left', 1)}Trước</button>${pageButtons}
      <button type="button" class="sm" data-act="pg" data-id="${S.pg + 1}" ${S.pg >= PG.pages ? 'disabled' : ''}>Sau${ic('s-right', 1)}</button></div></div>`;
  };

  /* ===== Xuất CSV (mở được bằng Excel, có BOM để giữ tiếng Việt) ===== */
  function download(name, rows) {
    const cell = c => { let v = String(c ?? ''); if (typeof c === 'string' && /^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
    const url = URL.createObjectURL(new Blob(['\ufeff' + rows.map(r => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  const txCsv = l => [['STT', ...(isAdmin ? ['Người dùng'] : []), 'Loại', 'Số tiền', 'Danh mục', 'Ngày', 'Ví / Tài khoản', 'Phương thức thanh toán', 'Mô tả'],
    ...l.map((t, i) => [i + 1, ...(isAdmin ? [uname(t.owner)] : []), t.type === 'in' ? 'Thu' : 'Chi', t.amount, cname(t), fdate(t.date), accountLabel(t.accountId || t.account), paymentLabel(t.paymentMethod), t.note || ''])];

  /* ===== Hộp thoại ===== */
  const dlg = $('#dlg'), dform = $('#dform');
  function openDlg(html, wide) { dlg.className = wide ? 'wide' : ''; dform.innerHTML = html; if (!dlg.open) dlg.showModal(); }
  function confirmBox(msg, fn) {
    dform.onsubmit = e => { if (e.submitter?.value === 'ok') fn(); };
    openDlg(`<h2 style="margin-bottom:18px;color:var(--blue-900)">${esc(msg)}</h2><div class="actions"><button class="btn-ghost-d" value="x">HỦY</button><button class="btn-primary" value="ok">ĐỒNG Ý</button></div>`);
  }
  function confirmDeleteTx(t, fn) {
    dform.onsubmit = e => { if (e.submitter?.value === 'ok') fn(); };
    openDlg(`<h2 class="card-title">XÓA GIAO DỊCH?</h2><p class="tx-delete-copy">Bạn có chắc muốn xóa giao dịch này?</p><dl class="tx-delete-detail">
      <div><dt>Danh mục</dt><dd>${esc(cname(t))}</dd></div><div><dt>Số tiền</dt><dd>${money(t.amount)}</dd></div><div><dt>Ngày</dt><dd>${fdate(t.date)}</dd></div>
      </dl><div class="actions"><button class="btn-ghost-d" value="x">HỦY</button><button class="btn-danger" value="ok">${ic('s-trash', 1)}XÓA</button></div>`);
  }
  function toast(m, ms = 2400) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), ms); }

  /* ===== Báo lỗi trên ô nhập ===== */
  function showErr(form, errs) {
    form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
    let first = null;
    for (const [id, msg] of Object.entries(errs)) {
      const el = form.querySelector('#' + id); if (!el) continue;
      const f = el.closest('.field'); f.classList.add('invalid'); f.querySelector('.error span').textContent = msg; first = first || el;
    }
    first?.focus(); return !first;
  }
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, USER_RE = /^[\w.]{4,20}$/;

  /* ===== Form dùng chung ===== */
  const accountPage = () => `<form class="card" data-f="account" novalidate style="max-width:560px"><h2 class="card-title">THÔNG TIN TÀI KHOẢN</h2>
    ${field('name', 'Họ và tên', 'i-user', { val: session.name })}${field('email', 'Email', 'i-envelope', { type: 'email', val: session.email })}
    ${field('username', 'Tên đăng nhập', 'i-at', { val: session.username })}
    ${field('cpw', 'Mật khẩu hiện tại (chỉ cần khi đổi mật khẩu)', 'i-lock', { type: 'password', attr: 'class="has-toggle" autocomplete="current-password"' })}
    ${field('pw', 'Mật khẩu mới', 'i-lock', { type: 'password', attr: 'class="has-toggle" autocomplete="new-password"' })}
    ${field('pw2', 'Xác nhận mật khẩu', 'i-shield-halved', { type: 'password', attr: 'class="has-toggle" autocomplete="new-password"' })}
    <div class="actions" style="justify-content:space-between"><button type="button" class="btn-danger" data-act="delAcc">${ic('s-trash', 1)}XÓA TÀI KHOẢN</button><button class="btn-primary">CẬP NHẬT</button></div></form>`;

  const canEditCat = c => isAdmin ? !c.owner : c.owner === session.email;
  const canDelCat = c => isAdmin || c.owner === session.email;
  const catPage = () => { const e = visCats().find(c => c.id === S.editCat && canEditCat(c)) || {}; return `
    <form class="card" data-f="cat" novalidate><h2 class="card-title">${e.id ? 'SỬA' : isAdmin ? 'QUẢN LÝ' : 'THÊM'} DANH MỤC${isAdmin && !e.id ? ' MẶC ĐỊNH' : ''}</h2>
      <div class="grid2">${field('cname', 'Tên danh mục', 'i-layer-group', { val: e.name })}${field('ctype', 'Loại', 's-swap', { tag: 'select', opts: opt(TYPES, e.type, 'Thu / Chi') })}</div>
      ${field('cnote', 'Mô tả', 'i-receipt', { val: e.note })}
      <div class="actions">${!isAdmin || e.id ? '<button type="button" class="btn-ghost-d" data-act="cancel">HỦY</button>' : ''}<button class="btn-primary">${isAdmin && !e.id ? 'THÊM' : 'LƯU'}</button></div></form>
    <div class="card"><h2 class="card-title">${isAdmin ? 'DANH SÁCH DANH MỤC' : 'DANH MỤC CỦA TÔI'}</h2><div id="rows" class="category-menu"></div></div>`; };
  const catRows = () => {
    const categories = visCats();
    if (!categories.length) return `<div class="empty-box">${NONE}</div>`;
    const sections = new Map();
    categories.forEach(c => {
      const section = categorySection(c), family = categoryParts(c).family;
      if (!sections.has(section)) sections.set(section, new Map());
      const families = sections.get(section);
      if (!families.has(family)) families.set(family, []);
      families.get(family).push(c);
    });
    const sectionOrder = [...CATEGORY_SECTIONS.map(s => s.name), 'Thu nhập', 'Danh mục của tôi', 'Danh mục khác', ...Array.from(sections.keys()).sort((a, b) => a.localeCompare(b, 'vi'))];
    return [...new Set(sectionOrder)].filter(section => sections.has(section)).map(section => {
      const families = sections.get(section), count = [...families.values()].reduce((n, items) => n + items.length, 0);
      const familyHtml = [...families.entries()].map(([family, items]) => `<section class="category-subgroup">${family ? `<h3>${esc(family)}</h3>` : ''}<div class="category-items">${items.map(c => {
        const leaf = categoryParts(c).leaf;
        return `<article class="category-item"><div class="category-item-main"><b>${esc(leaf)}</b><span class="badge ${c.type}">${c.type === 'in' ? 'Thu' : 'Chi'}</span>${isAdmin ? c.owner ? `<span class="category-owner">${esc(uname(c.owner))}</span>` : '<span class="badge admin">Mặc định</span>' : ''}${c.note ? `<small>${esc(c.note)}</small>` : ''}</div>
          <div class="cell-act">${canEditCat(c) ? `<button class="sm" data-act="editCat" data-id="${esc(c.id)}">${ic('i-pen-to-square')}Sửa</button>` : ''}${canDelCat(c) ? `<button class="sm red" data-act="delCat" data-id="${esc(c.id)}">${ic('s-trash', 1)}Xóa</button>` : !canEditCat(c) ? '<span class="badge admin">Mặc định</span>' : ''}</div></article>`;
      }).join('')}</div></section>`).join('');
      return `<details class="category-menu-group"><summary><span>${esc(section)}</span><small>${count} danh mục</small></summary><div class="category-menu-content">${familyHtml}</div></details>`;
    }).join('');
  };

  const filterTx = () => {
    const q = (S.q || '').toLowerCase();
    const f = isAdmin ? { u: S.au, t: S.at, c: S.ac, from: S.af, to: S.ae } : { t: S.ft, c: S.fc, from: S.fd, to: S.td };
    const k = S.sk || 'date', d = (S.sd || 'desc') === 'asc' ? 1 : -1;
    return myTx().filter(t => (!q || ((t.note || '') + ' ' + cname(t) + ' ' + t.amount + ' ' + Number(t.amount).toLocaleString('vi-VN') + ' ' + accountLabel(t.accountId || t.account) + ' ' + paymentLabel(t.paymentMethod)).toLowerCase().includes(q)) && (!f.u || t.owner === f.u) && (!f.t || t.type === f.t) &&
      (!f.c || t.catId === f.c) && (!S.fp || isAdmin || t.paymentMethod === S.fp) && (!f.from || t.date >= f.from) && (!f.to || t.date <= f.to))
      .sort((a, b) => d * (k === 'amount' ? a.amount - b.amount : a.date.localeCompare(b.date)));
  };
  const txSummary = () => { const list = filterTx(); return `<div class="stats tx-summary">${stat('Giao dịch', list.length, 'i-receipt', n => n)}${stat('Tổng thu', sum(list, 'in'), 'i-coins')}${stat('Tổng chi', sum(list, 'out'), 'i-piggy-bank')}${stat('Chênh lệch', sum(list, 'in') - sum(list, 'out'), 'i-wallet')}</div>`; };
  const txRows = () => {
    const pl = paged(filterTx()); PAGE_IDS = pl.map(t => t.id);
    return pl.map((t, i) => `<tr>${isAdmin ? '' : `<td><input type="checkbox" class="chk" data-act="selTx" data-id="${esc(t.id)}" aria-label="Chọn giao dịch" ${(S.sel || []).includes(t.id) ? 'checked' : ''}></td>`}<td>${PG.off + i + 1}</td>${isAdmin ? `<td>${esc(uname(t.owner))}</td>` : ''}<td><span class="badge ${t.type}">${t.type === 'in' ? 'Thu' : 'Chi'}</span></td>
      <td class="${t.type === 'in' ? 'inc' : 'exp'}">${money(t.amount)}</td><td>${esc(cname(t))}</td><td>${fdate(t.date)}</td><td>${esc(accountLabel(t.accountId || t.account))}</td><td>${esc(paymentLabel(t.paymentMethod))}</td><td class="desc">${esc(t.note) || '—'}</td>
      <td><div class="cell-act"><button class="sm" data-act="viewTx" data-id="${esc(t.id)}" aria-label="Xem chi tiết giao dịch">${ic('i-eye')}Xem</button>${isAdmin ? '' : `<button class="sm" data-act="editTx" data-id="${esc(t.id)}">${ic('i-pen-to-square')}Sửa</button><button class="sm" data-act="copyTx" data-id="${esc(t.id)}">Sao chép</button>`}<button class="sm red" data-act="delTx" data-id="${esc(t.id)}">${ic('s-trash', 1)}Xóa</button></div></td></tr>`).join('') || emptyRow(10);
  };
  const miniTable = l => `<div class="wrap"><table><thead><tr><th>Loại</th><th>Số tiền</th><th>Danh mục</th><th>Ngày</th><th>Mô tả</th></tr></thead><tbody>${l.map(t =>
    `<tr><td><span class="badge ${t.type}">${t.type === 'in' ? 'Thu' : 'Chi'}</span></td><td class="${t.type === 'in' ? 'inc' : 'exp'}">${money(t.amount)}</td><td>${esc(cname(t))}</td><td>${fdate(t.date)}</td><td class="desc">${esc(t.note) || '—'}</td></tr>`).join('') || emptyRow(5)}</tbody></table></div>`;
  const recent = (l, n = 5) => l.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);

  /* ----- Báo cáo ----- */
  const reportList = () => myTx().filter(t => (!S.rf || t.date >= S.rf) && (!S.rt || t.date <= S.rt) && (!S.rc || t.catId === S.rc) &&
    (isAdmin ? !S.ru || t.owner === S.ru : !S.rty || t.type === S.rty));
  const reportPage = () => `<form class="card noprint" data-f="report" novalidate><h2 class="card-title">${isAdmin ? 'BÁO CÁO HỆ THỐNG' : 'BÁO CÁO CHI TIÊU'}</h2>
    <div class="grid2">${field('rf', 'Từ ngày', 's-cal', { type: 'date', val: S.rf })}${field('rt', 'Đến ngày', 's-cal', { type: 'date', val: S.rt })}
    ${isAdmin ? field('ru', 'Người dùng', 'i-users', { tag: 'select', opts: opt(db.users.map(u => [u.email, u.name]), S.ru, 'Tất cả') }) : field('rty', 'Loại', 's-swap', { tag: 'select', opts: opt(TYPES, S.rty, 'Tất cả') })}
    ${field('rc', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(S.rc, 'Tất cả') })}</div>
    <div class="actions"><button type="button" class="btn-ghost-d" data-act="repRange" data-id="month">THÁNG NÀY</button><button type="button" class="btn-ghost-d" data-act="repRange" data-id="year">NĂM NAY</button><button type="button" class="btn-ghost-d" data-act="repRange" data-id="reset">ĐẶT LẠI</button>
    <button class="btn-primary">${ic('i-chart-pie')}XEM BÁO CÁO</button></div></form>
    <div class="card"><div class="card-head"><h2 class="card-title">KẾT QUẢ</h2><div class="head-act noprint">
      <button type="button" class="sm" data-act="rv" data-id="bar">Cột</button><button type="button" class="sm" data-act="rv" data-id="pie">Tròn</button>
      <button type="button" class="sm" data-act="exportRep">${ic('s-download', 1)}XUẤT CSV</button><button type="button" class="sm" data-act="printRep">${ic('s-print', 1)}IN / LƯU PDF</button></div></div>
      <div id="repOut">${S.rrun ? reportOut() : chartEmpty()}</div></div>`;
  const monthTable = l => { const m = {};
    l.forEach(t => { const k = t.date.slice(0, 7); (m[k] = m[k] || { i: 0, o: 0 })[t.type === 'in' ? 'i' : 'o'] += t.amount; });
    return `<div class="wrap"><table><thead><tr><th>Tháng</th><th>Thu</th><th>Chi</th><th>Số dư</th></tr></thead><tbody>${Object.keys(m).sort().reverse().map(k =>
      `<tr><td>${k.slice(5)}/${k.slice(0, 4)}</td><td class="inc">${money(m[k].i)}</td><td class="exp">${money(m[k].o)}</td><td>${money(m[k].i - m[k].o)}</td></tr>`).join('')}</tbody></table></div>`; };
  const userTable = l => { const m = {};
    l.forEach(t => { (m[t.owner] = m[t.owner] || { n: 0, i: 0, o: 0 }).n++; m[t.owner][t.type === 'in' ? 'i' : 'o'] += t.amount; });
    return `<div class="wrap"><table><thead><tr><th>Người dùng</th><th>Số giao dịch</th><th>Thu</th><th>Chi</th><th>Số dư</th></tr></thead><tbody>${Object.entries(m).sort((a, b) => b[1].o - a[1].o).map(([e, v]) =>
      `<tr><td>${esc(uname(e))}</td><td>${v.n}</td><td class="inc">${money(v.i)}</td><td class="exp">${money(v.o)}</td><td>${money(v.i - v.o)}</td></tr>`).join('')}</tbody></table></div>`; };
  function reportOut() {
    const l = reportList();
    if (!l.length) return chartEmpty();
    const h = 'style="margin:14px 0 8px;font-size:14px;color:var(--muted)"';
    return `<div class="sum"><span class="badge in">Thu: ${money(sum(l, 'in'))}</span><span class="badge out">Chi: ${money(sum(l, 'out'))}</span><span class="badge">Số dư: ${money(sum(l, 'in') - sum(l, 'out'))}</span></div>
      <h3 ${h}>Thu theo danh mục</h3>${chart(by(l, 'in'))}<h3 ${h}>Chi theo danh mục</h3>${chart(by(l, 'out'), 'e')}
      <h3 ${h}>Theo tháng</h3>${monthTable(l)}${isAdmin && !S.ru ? `<h3 ${h}>Theo người dùng</h3>${userTable(l)}` : ''}`;
  }

  /* ----- Dashboard ----- */
  const dashboardMonthLabel = value => monthRe.test(value || '') ? `THÁNG ${value.slice(5, 7)}/${value.slice(0, 4)}` : 'TẤT CẢ THỜI GIAN';
  const dashShell = () => isAdmin ? `<div class="card"><div class="card-head"><h2 class="card-title">KỲ XEM</h2><div class="head-act">
      <button type="button" class="sm" data-act="dm" data-id="-1">${ic('s-left', 1)}Tháng trước</button><button type="button" class="sm" data-act="dm" data-id="1">Tháng sau${ic('s-right', 1)}</button>
      <button type="button" class="sm" data-act="dm" data-id="now">THÁNG NÀY</button><button type="button" class="sm" data-act="dm" data-id="all">TẤT CẢ</button></div></div>
    <div style="max-width:260px">${live('dm', 'Tháng', 's-cal', { type: 'month', val: S.dm })}</div></div><div id="dyn"></div>` : `<div class="dashboard-welcome">
      <div class="dashboard-welcome-copy"><span class="dashboard-eyebrow">TỔNG QUAN TÀI CHÍNH</span><h2>Xin chào, ${esc(session.name)}</h2><p>Theo dõi thu chi và ngân sách của bạn.</p></div>
      <div class="dashboard-month-tools"><button type="button" class="sm dashboard-month-arrow" data-act="dm" data-id="-1" aria-label="Tháng trước">${ic('s-left', 1)}</button>
        <label class="dashboard-month-select"><span id="dashPeriodLabel">${dashboardMonthLabel(S.dm)}</span><input id="dm" type="month" data-live value="${esc(S.dm || '')}" aria-label="Chọn tháng đang xem"></label>
        <button type="button" class="sm dashboard-month-arrow" data-act="dm" data-id="1" aria-label="Tháng sau">${ic('s-right', 1)}</button>
        <button type="button" class="sm dashboard-all-period" data-act="dm" data-id="all">Tất cả</button>
        <label class="dashboard-scope-select"><span>Phạm vi</span><select id="dashboardScope" data-live aria-label="Chọn phạm vi dashboard">${familyScopeOptions().map(([value, label]) => `<option value="${esc(value)}"${(S.dashboardScope || 'personal') === value ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></label>
        <span class="dashboard-source">Dữ liệu trên thiết bị</span><button type="button" class="sm" data-act="refreshDash">${ic('s-refresh', 1)}Làm mới</button></div>
    </div><div id="dyn"></div>`;
  const h3 = 'style="margin:14px 0 8px;font-size:14px;color:var(--muted)"';
  const dashboardScopedTransactions = scope => db.tx.filter(t => scope === 'personal'
    ? t.owner === session.email && (!t.scope || t.scope === 'personal')
    : t.scope === 'family' && t.familyId === scope);
  const dashboardChartMonths = transactions => {
    const latestActivity = transactions.reduce((latest, tx) => tx.date && tx.date.slice(0, 7) > latest ? tx.date.slice(0, 7) : latest, '');
    const end = monthRe.test(S.dm || '') ? S.dm : (latestActivity || monthNow());
    return Array.from({ length: 6 }, (_, index) => shiftMonth(end, index - 5));
  };
  const dashboardMonthlyValues = transactions => {
    const months = dashboardChartMonths(transactions);
    return months.map(month => ({
      month,
      income: sum(transactions.filter(tx => tx.date.startsWith(month)), 'in'),
      expense: sum(transactions.filter(tx => tx.date.startsWith(month)), 'out')
    }));
  };
  const dashboardCompactMoney = value => {
    if (value >= 1000000) return `${(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}tr`;
    if (value >= 1000) return `${(value / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}k`;
    return String(Math.round(value));
  };
  const dashboardMonthlyChart = (transactions, trend = false) => {
    const values = dashboardMonthlyValues(transactions);
    const max = Math.max(...values.flatMap(value => [value.income, value.expense]), 1);
    const period = `${values[0].month.slice(5, 7)}/${values[0].month.slice(0, 4)} – ${values[5].month.slice(5, 7)}/${values[5].month.slice(0, 4)}`;
    const baseline = 170, chartHeight = 130;
    if (!values.some(value => value.income || value.expense)) return chartEmpty('Chưa có giao dịch trong 6 tháng được chọn');
    if (trend) {
      const pointsFor = key => values.map((value, index) => ({
        x: 54 + index * 122,
        y: baseline - value[key] / max * chartHeight,
        amount: value[key],
        month: value.month
      }));
      const incomePoints = pointsFor('income'), expensePoints = pointsFor('expense');
      const drawLine = (points, kind, label) => `<polyline class="dashboard-line ${kind}" points="${points.map(point => `${point.x},${point.y}`).join(' ')}"/>${points.map(point => `<circle class="dashboard-point ${kind}" cx="${point.x}" cy="${point.y}" r="4"><title>${label} ${point.month}: ${money(point.amount)}</title></circle>`).join('')}`;
      return `<div class="dashboard-chart-period">6 tháng gần nhất · ${period}</div><svg class="dashboard-svg dashboard-trend-svg" viewBox="0 0 720 220" role="img" aria-label="Xu hướng thu nhập và chi tiêu trong 6 tháng">
        <line class="dashboard-axis" x1="38" y1="${baseline}" x2="700" y2="${baseline}"/>
        ${[0, 0.5, 1].map(ratio => `<line class="dashboard-gridline" x1="38" y1="${baseline - chartHeight * ratio}" x2="700" y2="${baseline - chartHeight * ratio}"/><text class="dashboard-axis-label" x="34" y="${baseline - chartHeight * ratio - 4}" text-anchor="end">${dashboardCompactMoney(max * ratio)}</text>`).join('')}
        ${drawLine(incomePoints, 'income', 'Thu nhập')}${drawLine(expensePoints, 'expense', 'Chi tiêu')}
        ${values.map((value, index) => `<text class="dashboard-axis-label" x="${54 + index * 122}" y="196" text-anchor="middle">${value.month.slice(5, 7)}/${value.month.slice(2, 4)}</text>`).join('')}
      </svg><div class="dashboard-chart-legend"><span><i class="income"></i>Thu nhập</span><span><i class="expense"></i>Chi tiêu</span></div>`;
    }
    return `<div class="dashboard-chart-period">So sánh theo tháng · ${period}</div><svg class="dashboard-svg dashboard-bars-svg" viewBox="0 0 720 220" role="img" aria-label="So sánh thu nhập và chi tiêu theo tháng">
      <line class="dashboard-axis" x1="38" y1="${baseline}" x2="700" y2="${baseline}"/>
      ${[0, 0.5, 1].map(ratio => `<line class="dashboard-gridline" x1="38" y1="${baseline - chartHeight * ratio}" x2="700" y2="${baseline - chartHeight * ratio}"/><text class="dashboard-axis-label" x="34" y="${baseline - chartHeight * ratio - 4}" text-anchor="end">${dashboardCompactMoney(max * ratio)}</text>`).join('')}
      ${values.map((value, index) => {
        const x = 64 + index * 108, incomeHeight = value.income / max * chartHeight, expenseHeight = value.expense / max * chartHeight;
        return `<rect class="dashboard-bar income" x="${x}" y="${baseline - incomeHeight}" width="30" height="${incomeHeight}" rx="5"><title>Thu nhập ${value.month}: ${money(value.income)}</title></rect><rect class="dashboard-bar expense" x="${x + 36}" y="${baseline - expenseHeight}" width="30" height="${expenseHeight}" rx="5"><title>Chi tiêu ${value.month}: ${money(value.expense)}</title></rect><text class="dashboard-axis-label" x="${x + 33}" y="196" text-anchor="middle">${value.month.slice(5, 7)}/${value.month.slice(2, 4)}</text>`;
      }).join('')}
    </svg><div class="dashboard-chart-legend"><span><i class="income"></i>Thu nhập</span><span><i class="expense"></i>Chi tiêu</span></div>`;
  };
  const dashboardBudgets = (transactions, familyId) => {
    const month = monthRe.test(S.dm || '') ? S.dm : monthNow();
    const entries = familyId ? [] : myBudgets().filter(b => b.month === month)
      .sort((a, b) => budgetSpent(b) / Math.max(Number(b.amount), 1) - budgetSpent(a) / Math.max(Number(a.amount), 1));
    const totalSpent = sum(transactions.filter(tx => tx.date.startsWith(month)), 'out');
    const family = familyId ? familyOf(familyId) : null;
    const totalBudget = familyId ? Number(family?.monthlyBudget || 0) : entries.reduce((total, budget) => total + Number(budget.amount || 0), 0);
    const ratio = totalBudget > 0 ? totalSpent / totalBudget : 0, pct = totalBudget > 0 ? progress(totalSpent, totalBudget) : 0;
    const state = ratio >= 1 ? 'over' : ratio >= .8 ? 'warn' : 'ok';
    const budgetSummary = totalBudget > 0 ? `<div class="dashboard-budget-summary">
        <div><span>Ngân sách tháng</span><strong>${money(totalBudget)}</strong></div><div><span>Đã chi</span><strong>${money(totalSpent)}</strong></div><div><span>Còn lại</span><strong class="${totalBudget - totalSpent < 0 ? 'exp' : 'inc'}">${money(totalBudget - totalSpent)}</strong></div>
      </div><div class="dashboard-budget-track dashboard-budget-total-track"><i class="${state}" style="--bar-width:${pct}%"></i></div>
      <div class="dashboard-budget-caption"><span>Đã sử dụng ${pct}%</span><span>${ratio >= 1 ? 'Đã vượt ngân sách' : ratio >= .8 ? 'Sắp chạm ngưỡng 80%' : 'Trong ngân sách'}</span></div>
      ${ratio >= .8 ? `<p class="dashboard-budget-alert ${state}" role="status">${ratio >= 1 ? `Chi tiêu đã vượt ngân sách ${money(totalSpent - totalBudget)}.` : 'Lưu ý: chi tiêu đã đạt từ 80% ngân sách tháng.'}</p>` : ''}`
      : `<div class="dashboard-empty">${familyId ? 'Gia đình chưa đặt ngân sách tháng.' : 'Chưa có ngân sách cho tháng này.'}<button type="button" class="sm" data-p="${familyId ? 'family' : 'budget'}">${familyId ? 'Quản lý gia đình' : 'Tạo ngân sách'}</button></div>`;
    if (familyId) return budgetSummary;
    const budgetItems = entries.length ? `<div class="dashboard-budget-list">${entries.map((b, index) => {
      const spent = transactions.filter(t => t.type === 'out' && t.catId === b.catId && t.date.startsWith(b.month)).reduce((s, t) => s + Number(t.amount || 0), 0);
      const itemRatio = spent / Math.max(Number(b.amount), 1), itemPct = progress(spent, b.amount);
      const itemState = itemRatio >= 1 ? 'over' : itemRatio >= .8 ? 'warn' : 'ok';
      return `<div class="dashboard-budget-item" style="--chart-delay:${index * 65}ms"><div class="dashboard-budget-head"><b>${esc(catOf(b.catId)?.name || 'Danh mục đã xóa')}</b><span class="dashboard-budget-state ${itemState}">${itemRatio >= 1 ? 'Vượt ngân sách' : itemRatio >= .8 ? 'Gần chạm mức' : `${itemPct}%`}</span></div>
        <div class="dashboard-budget-track"><i class="${itemState}" style="--bar-width:${itemPct}%"></i></div><div class="dashboard-budget-caption"><span>${money(spent)} đã dùng</span><span>${money(b.amount)}</span></div></div>`;
    }).join('')}</div>` : '';
    return budgetSummary + budgetItems;
  };
  const dashboardRecent = transactions => {
    const items = recent(transactions, 5);
    if (!items.length) return chartEmpty('Chưa có giao dịch trong kỳ này');
    return `<div class="dashboard-recent-list">${items.map(t => `<button type="button" class="dashboard-recent-item" data-act="viewTx" data-id="${esc(t.id)}">
      <span class="dashboard-recent-icon ${t.type}">${ic(t.type === 'in' ? 'i-coins' : 'i-receipt')}</span><span class="dashboard-recent-description"><b>${esc(t.note || cname(t))}</b><small>${esc(cname(t))} · ${fdate(t.date)} · ${esc(accountLabel(t.accountId || t.account))}</small></span>
      <strong class="${t.type === 'in' ? 'inc' : 'exp'}">${t.type === 'in' ? '+' : '-'}${money(t.amount)}</strong></button>`).join('')}</div>`;
  };
  const userDash = () => {
    const scope = S.dashboardScope || 'personal';
    const familyId = scope === 'personal' ? '' : scope;
    const family = familyId ? familyOf(familyId) : null;
    const label = family ? family.name : 'cá nhân';
    const allScopedTransactions = dashboardScopedTransactions(scope);
    const l = allScopedTransactions.filter(inMonth);
    const income = sum(l, 'in'), expense = sum(l, 'out');
    const monthlyValues = dashboardMonthlyValues(allScopedTransactions);
    return `<div class="dashboard-summary">
        <div class="dashboard-total income">${ic('i-coins')}<span>TỔNG THU NHẬP</span><strong>+${money(income)}</strong></div>
        <div class="dashboard-total expense">${ic('i-receipt')}<span>TỔNG CHI TIÊU</span><strong>-${money(expense)}</strong></div>
        <div class="dashboard-total balance-stat"><span>CHÊNH LỆCH THU CHI</span><strong class="${income - expense < 0 ? 'exp' : 'inc'}">${income - expense < 0 ? '-' : '+'}${money(Math.abs(income - expense))}</strong><small>Thu nhập trừ chi tiêu trong kỳ</small></div>
        <div class="dashboard-total transaction-stat">${ic('i-layer-group')}<span>TỔNG GIAO DỊCH</span><strong>${l.length.toLocaleString('vi-VN')}</strong><small>${l.filter(tx => tx.type === 'in').length} thu · ${l.filter(tx => tx.type === 'out').length} chi</small></div>
      </div>
      <div class="dashboard-charts">
        <section class="card dashboard-section dashboard-chart-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">DÒNG TIỀN</span><h2>Thu nhập và chi tiêu theo tháng</h2></div></div>${dashboardMonthlyChart(allScopedTransactions)}</section>
        <section class="card dashboard-section dashboard-chart-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">PHÂN BỔ CHI TIÊU</span><h2>Chi tiêu theo danh mục</h2></div><span class="dashboard-section-total">${money(expense)}</span></div>${pie(by(l, 'out'))}</section>
        <section class="card dashboard-section dashboard-chart-panel dashboard-trend-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">BIẾN ĐỘNG</span><h2>Xu hướng tài chính</h2></div></div>${dashboardMonthlyChart(allScopedTransactions, true)}</section>
      </div>
      <div class="dashboard-content-grid">
        <section class="card dashboard-section"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">NGÂN SÁCH · ${dashboardMonthLabel(monthRe.test(S.dm || '') ? S.dm : monthNow())}</span><h2>${family ? `Ngân sách · ${esc(family.name)}` : 'Ngân sách cá nhân'}</h2></div><button type="button" class="sm" data-p="${family ? 'family' : 'budget'}">Quản lý</button></div>${dashboardBudgets(allScopedTransactions, familyId)}</section>
        <section class="card dashboard-section dashboard-recent-section"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">HOẠT ĐỘNG MỚI NHẤT</span><h2>Giao dịch gần đây · ${esc(label)}</h2></div></div>${dashboardRecent(l)}<button type="button" class="sm dashboard-view-all" data-p="tx">XEM TẤT CẢ GIAO DỊCH</button></section>
      </div>`; };
  const adminDash = () => { const l = db.tx.filter(inMonth), has = l.length, now = Date.now();
    const newU = db.users.filter(u => u.createdAt && now - Date.parse(u.createdAt) < 30 * 864e5).length;
    const cnt = l.reduce((m, t) => { const k = uname(t.owner); m[k] = (m[k] || 0) + 1; return m; }, {});
    return `<div class="stats">${stat('Tổng người dùng', db.users.length, 'i-users', n => n)}${stat('Đang bị khóa', db.users.filter(locked).length, 'i-lock', n => n)}${stat('Người dùng mới (30 ngày)', newU, 'i-user', n => n)}
      ${stat('Tổng giao dịch', has || null, 'i-receipt', n => n)}${stat('Tổng thu', has ? sum(l, 'in') : null, 'i-coins')}${stat('Tổng chi', has ? sum(l, 'out') : null, 'i-piggy-bank')}</div>
      <div class="dashboard-charts">
        <section class="card dashboard-chart-card dashboard-flow-card"><div class="dashboard-chart-head"><div><span class="dashboard-eyebrow">DÒNG TIỀN HỆ THỐNG</span><h2>Thu và chi</h2></div><span class="dashboard-period">${esc(S.dm || 'Tất cả thời gian')}</span></div>${has ? dashboardCompare(sum(l, 'in'), sum(l, 'out')) : chartEmpty()}</section>
        <section class="card dashboard-chart-card"><div class="dashboard-chart-head"><div><span class="dashboard-eyebrow">TOÀN HỆ THỐNG</span><h2>Danh mục chi nhiều</h2></div><span class="dashboard-period">Top 5</span></div>${dashboardRankedBars(by(l, 'out'), 'expense')}</section>
        <section class="card dashboard-chart-card"><div class="dashboard-chart-head"><div><span class="dashboard-eyebrow">HOẠT ĐỘNG</span><h2>Người dùng giao dịch nhiều</h2></div><span class="dashboard-period">Top 5</span></div>${dashboardRankedBars(top(cnt), 'activity', n => `${n} giao dịch`)}</section>
      </div>`; };

  /* ----- Người dùng (admin) ----- */
  const userRows = () => {
    const q = (S.uq || '').toLowerCase();
    const l = db.users.filter(u => (!q || (u.name + ' ' + u.email + ' ' + (u.username || '')).toLowerCase().includes(q)) && (!S.ur || u.role === S.ur) && (!S.us || (S.us === 'LOCKED') === locked(u)));
    return paged(l).map((u, i) => { const me = u.email === session.email, d = me ? ' disabled title="Không thể thao tác trên chính bạn"' : '', id = esc(u.email);
      return `<tr><td>${PG.off + i + 1}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td><span class="badge ${u.role === 'ADMIN' ? 'admin' : ''}">${u.role}</span></td>
        <td><span class="badge ${locked(u) ? 'lock' : 'ok'}">${locked(u) ? 'Đã khóa' : 'Hoạt động'}</span></td>
        <td><div class="cell-act"><button class="sm" data-act="viewUser" data-id="${id}">${ic('i-eye')}Xem</button>
        <button class="sm ${locked(u) ? 'grn' : 'red'}" data-act="lock" data-id="${id}"${d}>${locked(u) ? ic('s-unlock', 1) + 'Mở khóa' : ic('i-lock') + 'Khóa'}</button>
        <button class="sm" data-act="role" data-id="${id}"${d}>${ic('i-shield-halved')}Phân quyền</button>
        <button class="sm" data-act="resetPw" data-id="${id}">${ic('s-refresh', 1)}Đặt lại MK</button>
        <button class="sm red" data-act="delUser" data-id="${id}"${d}>${ic('s-trash', 1)}Xóa</button></div></td></tr>`; }).join('') || emptyRow(6);
  };

  /* ===== Ngân sách, mục tiêu và phân tích người dùng ===== */
  const budgetPage = () => {
    const e = myBudgets().find(b => b.id === S.editBudget) || {};
    const month = e.month || monthNow();
    const entries = myBudgets().slice().sort((a, b) => b.month.localeCompare(a.month));
    return `<form class="card" data-f="budget" novalidate><h2 class="card-title">${e.id ? 'SỬA' : 'TẠO'} NGÂN SÁCH</h2>
      <div class="grid2">${field('bcat', 'Danh mục Chi', 'i-layer-group', { tag: 'select', opts: catOpts(e.catId, 'Chọn danh mục Chi', 'out') })}${field('bmonth', 'Tháng', 's-cal', { type: 'month', val: month })}
      ${field('bamount', 'Số tiền ngân sách (₫)', 'i-coins', { type: 'number', val: e.amount, attr: 'min="1"' })}</div>
      <div class="actions">${e.id ? '<button type="button" class="btn-ghost-d" data-act="cancelBudget">HỦY</button>' : ''}<button class="btn-primary">${e.id ? 'LƯU THAY ĐỔI' : 'TẠO NGÂN SÁCH'}</button></div></form>
      <div class="card"><div class="card-head"><h2 class="card-title">NGÂN SÁCH CỦA TÔI</h2><span class="badge">${entries.length} danh mục</span></div>
      ${entries.length ? `<div class="progress-list">${entries.map(b => {
        const spent = budgetSpent(b), ratio = spent / Math.max(b.amount, 1), pct = progress(spent, b.amount);
        const state = ratio >= 1 ? 'over' : ratio >= .8 ? 'warn' : 'ok';
        const label = ratio > 1 ? 'Đã vượt 100%' : ratio === 1 ? 'Đã dùng hết 100%' : ratio >= .8 ? 'Sắp đạt giới hạn 80%' : 'Trong ngân sách';
        return `<article class="progress-item"><div class="card-head"><div><h3>${esc(catOf(b.catId)?.name || '(Danh mục đã xóa)')}</h3><small>${esc(b.month)} · <span class="badge ${state}">${label}</span></small></div><div class="cell-act"><button class="sm" data-act="editBudget" data-id="${esc(b.id)}">${ic('i-pen-to-square')}Sửa</button><button class="sm red" data-act="delBudget" data-id="${esc(b.id)}">${ic('s-trash', 1)}Xóa</button></div></div>
          ${progressBar(spent, b.amount, state)}<div class="progress-caption"><b>${money(spent)}</b><span>${pct}%</span><span>Ngân sách ${money(b.amount)}</span></div></article>`;
      }).join('')}</div>` : `<div class="chart-empty">Chưa có ngân sách. Tạo ngân sách đầu tiên để theo dõi chi tiêu.</div>`}</div>`;
  };
  const familyPendingRequests = familyId => db.familyMembers.filter(m => m.familyId === familyId && m.status === 'PENDING');
  const familyTabButtons = [
    ['overview', 'Tổng quan'],
    ['transactions', 'Giao dịch'],
    ['members', 'Thành viên'],
    ['budget', 'Ngân sách'],
    ['report', 'Báo cáo'],
    ['settings', 'Cài đặt']
  ];
  const familySummaryData = familyId => {
    const family = familyOf(familyId);
    const transactions = db.tx.filter(t => t.scope === 'family' && t.familyId === familyId).slice().sort((a, b) => b.date.localeCompare(a.date));
    const members = familyMembersOf(familyId).map(member => ({ ...member, user: findUser(member.userEmail) }));
    const totalSpent = transactions.filter(t => t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const budgetAmount = Number(family?.monthlyBudget || 0);
    const remaining = budgetAmount - totalSpent;
    const byCategory = transactions.filter(t => t.type === 'out').reduce((map, tx) => {
      const label = cname(tx);
      map[label] = (map[label] || 0) + Number(tx.amount || 0);
      return map;
    }, {});
    const byMember = members.reduce((map, member) => {
      const spent = transactions.filter(t => t.type === 'out' && t.owner === member.userEmail).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      map[member.userEmail] = spent;
      return map;
    }, {});
    return { family, members, transactions, totalSpent, budgetAmount, remaining, byCategory, byMember };
  };
  const familyOverviewTab = familyId => {
    const { family, members, transactions, totalSpent, budgetAmount, remaining, byCategory } = familySummaryData(familyId);
    const monthLabel = today().slice(0, 7);
    const memberCount = members.length;
    const overviewCards = [`<div class="family-kpi-card"><small>Tổng chi tháng này</small><strong>${money(totalSpent)}</strong></div>`, `<div class="family-kpi-card"><small>Ngân sách</small><strong>${money(budgetAmount)}</strong></div>`, `<div class="family-kpi-card"><small>Còn lại</small><strong>${money(remaining)}</strong></div>`, `<div class="family-kpi-card"><small>Thành viên</small><strong>${memberCount} người</strong></div>`].join('');
    const recent = transactions.slice(0, 5);
    const categoryChart = Object.keys(byCategory).length ? pie(byCategory) : `<div class="chart-empty">Chưa có dữ liệu</div>`;
    const memberChart = members.length ? `<div class="family-member-breakdown">${members.map(member => { const spent = (familySummaryData(familyId).byMember[member.userEmail] || 0); const count = transactions.filter(t => t.owner === member.userEmail).length; return `<div class="family-member-breakdown-row"><div><strong>${esc(member.user?.name || member.userEmail)}</strong><small>${member.role === 'OWNER' ? 'OWNER' : 'MEMBER'} · ${count} giao dịch</small></div><span>${money(spent)}</span></div>`; }).join('')}</div>` : '<div class="chart-empty">Chưa có thành viên</div>';
    return `<div class="family-section-grid">
      <div class="family-kpi-grid">${overviewCards}</div>
      <div class="family-summary-card">
        <div class="card-head"><h3 class="card-title">CHI TIÊU THEO DANH MỤC</h3></div>
        ${categoryChart}
      </div>
      <div class="family-summary-card">
        <div class="card-head"><h3 class="card-title">CHI TIÊU THEO THÀNH VIÊN</h3></div>
        ${memberChart}
      </div>
      <div class="family-summary-card">
        <div class="card-head"><h3 class="card-title">GIAO DỊCH GẦN ĐÂY</h3><button type="button" class="btn-ghost-d" data-act="familyTab" data-id="transactions">Xem tất cả</button></div>
        ${recent.length ? `<div class="family-transaction-list">${recent.map(tx => `<div class="family-transaction-item"><div><span>${esc(tx.note || cname(tx))}</span><small>${esc(uname(tx.owner))} · ${fdate(tx.date)}</small></div><strong class="${tx.type === 'in' ? 'inc' : 'exp'}">${tx.type === 'in' ? '+' : '-'}${money(tx.amount)}</strong></div>`).join('')}</div>` : '<div class="chart-empty">Chưa có giao dịch</div>'}
      </div>
    </div>`;
  };
  const familyTransactionsTab = familyId => {
    const family = familyOf(familyId);
    const transactions = db.tx.filter(t => t.scope === 'family' && t.familyId === familyId).slice().sort((a, b) => b.date.localeCompare(a.date));
    const rows = transactions.map((tx, index) => `<tr><td>${index + 1}</td><td>${fdate(tx.date)}</td><td>${esc(tx.note || cname(tx))}</td><td>${esc(cname(tx))}</td><td>${esc(uname(tx.owner))}</td><td>${esc(accountLabel(tx.accountId || tx.account))}</td><td class="${tx.type === 'in' ? 'inc' : 'exp'}">${money(tx.amount)}</td></tr>`).join('');
    return `<div class="family-toolbar"><div class="toolbar two"><input id="familyTxSearch" class="family-filter" type="text" placeholder="Tìm kiếm" data-live><select id="familyTxMember" class="family-filter" data-live><option value="">Tất cả thành viên</option>${familyMembersOf(familyId).map(member => `<option value="${esc(member.userEmail)}">${esc(findUser(member.userEmail)?.name || member.userEmail)}</option>`).join('')}</select></div><button type="button" class="btn-primary" data-act="addFamilyTransaction">${ic('s-plus', 1)}Thêm giao dịch</button></div>
      <div class="family-table-wrap"><table class="family-table"><thead><tr><th>#</th><th>Ngày</th><th>Nội dung</th><th>Danh mục</th><th>Người thực hiện</th><th>Ví/Tài khoản</th><th>Số tiền</th></tr></thead><tbody>${rows || '<tr><td colspan="7" class="family-empty-cell">Chưa có giao dịch</td></tr>'}</tbody></table></div>`;
  };
  const familyMembersTab = familyId => {
    const family = familyOf(familyId);
    const members = familyMembersOf(familyId).map(member => ({ ...member, user: findUser(member.userEmail) }));
    const pending = familyPendingRequests(familyId);
    const owner = members.find(member => member.role === 'OWNER');
    return `<div class="family-member-panel">
      ${owner ? `<div class="family-action-row"><h3 class="card-title">THÀNH VIÊN GIA ĐÌNH</h3>${owner.userEmail === session.email ? `<button type="button" class="btn-primary" data-act="inviteMember">${ic('s-plus', 1)}Mời thành viên</button>` : ''}</div>` : ''}
      <div class="family-member-grid">${members.map(member => `<article class="family-member-card"><div class="family-member-icon">👤</div><div class="family-member-body"><h3>${esc(member.user?.name || member.userEmail)}</h3><p>${member.role === 'OWNER' ? 'OWNER' : 'MEMBER'}</p><small>Chi tháng này: ${money((db.tx.filter(t => t.scope === 'family' && t.familyId === familyId && t.owner === member.userEmail && t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0)))} · ${db.tx.filter(t => t.scope === 'family' && t.familyId === familyId && t.owner === member.userEmail).length} giao dịch</small>${session.email === family.ownerEmail && member.userEmail !== session.email ? `<div class="family-inline-actions"><button type="button" class="sm red" data-act="removeFamilyMember" data-id="${esc(member.userEmail)}">Xóa thành viên</button></div>` : ''}</div></article>`).join('')}</div>
      ${pending.length ? `<div class="family-requests"><h3 class="card-title">YÊU CẦU THAM GIA</h3>${pending.map(member => `<div class="family-request-row"><div><strong>${esc(findUser(member.userEmail)?.name || member.userEmail)}</strong><small>Email: ${esc(member.userEmail)}</small></div><div class="family-inline-actions"><button type="button" class="sm" data-act="acceptFamilyMember" data-id="${esc(member.userEmail)}">Chấp nhận</button><button type="button" class="sm red" data-act="rejectFamilyMember" data-id="${esc(member.userEmail)}">Từ chối</button></div></div>`).join('')}</div>` : ''}
    </div>`;
  };
  const familyBudgetTab = familyId => {
    const family = familyOf(familyId);
    const transactions = db.tx.filter(t => t.scope === 'family' && t.familyId === familyId).filter(t => t.type === 'out');
    const spent = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const budget = Number(family?.monthlyBudget || 0);
    const remaining = budget - spent;
    const ratio = budget ? Math.min(100, (spent / budget) * 100) : 0;
    const used = budget ? Math.max(0, Math.min(100, ratio)) : 0;
    return `<div class="family-budget-wrap">
      <div class="family-budget-header"><div><span>Ngân sách tháng</span><strong>${money(budget || 0)}</strong></div><div><span>Đã sử dụng</span><strong>${money(spent)}</strong></div><div><span>Còn lại</span><strong>${money(remaining)}</strong></div></div>
      <div class="family-progress"><div class="family-progress-bar" style="width:${used}%"></div></div>
      <div class="family-progress-label"><span>${Math.round(used)}%</span></div>
      <div class="family-budget-list"><div class="family-budget-item"><span>Ăn uống</span><strong>${money(transactions.filter(tx => cname(tx).includes('Ăn')).reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0)}</strong></div><div class="family-budget-item"><span>Điện nước</span><strong>${money(transactions.filter(tx => cname(tx).includes('Điện') || cname(tx).includes('Nước')).reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0)}</strong></div><div class="family-budget-item"><span>Giáo dục</span><strong>${money(transactions.filter(tx => cname(tx).includes('Học') || cname(tx).includes('Giáo')).reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0)}</strong></div><div class="family-budget-item"><span>Khác</span><strong>${money(transactions.filter(tx => !cname(tx).includes('Ăn') && !cname(tx).includes('Điện') && !cname(tx).includes('Nước') && !cname(tx).includes('Học') && !cname(tx).includes('Giáo')).reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0)}</strong></div></div>
    </div>`;
  };
  const familyReportTab = familyId => {
    const { family, transactions, totalSpent, byCategory } = familySummaryData(familyId);
    return `<div class="family-report-grid">
      <div class="family-report-stat"><span>Tổng chi</span><strong>${money(totalSpent)}</strong></div>
      <div class="family-report-stat"><span>Tổng thu</span><strong>${money(transactions.filter(t => t.type === 'in').reduce((sum, tx) => sum + Number(tx.amount || 0), 0))}</strong></div>
      <div class="family-report-stat"><span>Số giao dịch</span><strong>${transactions.length}</strong></div>
      <div class="family-report-stat"><span>Ngân sách đã sử dụng</span><strong>${family ? money(Math.min(Number(family.monthlyBudget || 0), totalSpent)) : money(0)}</strong></div>
      <div class="family-report-chart"><h3>Chi tiêu theo danh mục</h3>${Object.keys(byCategory).length ? pie(byCategory) : '<div class="chart-empty">Chưa có dữ liệu để tạo báo cáo.</div>'}</div>
    </div>`;
  };
  const familySettingsTab = familyId => {
    const family = familyOf(familyId);
    if (!family) return '<div class="chart-empty">Chưa có gia đình</div>';
    return `<form class="family-settings-form" data-f="familySettings" novalidate>
      <div class="grid2">${field('familyName', 'Tên gia đình', 'i-users', { val: family.name })}${field('familyBudget', 'Ngân sách tháng', 'i-coins', { type: 'number', val: family.monthlyBudget || 0, attr: 'min="0" step="1000"' })}</div>
      ${field('familyDescription', 'Mô tả', 'i-receipt', { tag: 'textarea', val: family.description || '' })}
      <div class="family-code-row"><label>Mã gia đình</label><div class="family-code-box">${esc(family.code || 'FAM-000000')}</div><button type="button" class="btn-ghost-d" data-act="copyFamilyCode">Sao chép mã</button></div>
      <div class="actions"><button type="submit" class="btn-primary">Lưu thay đổi</button><button type="button" class="btn-danger" data-act="deleteFamily">Giải tán gia đình</button></div>
    </form>`;
  };
  const familyPage = () => {
    const memberships = myFamilyMemberships();
    if (!memberships.length) {
      return `<div class="family-empty card"><div class="family-empty-title">👨‍👩‍👧‍👦 Quản lý chi tiêu gia đình</div><p>Quản lý các khoản chi tiêu chung của gia đình cùng các thành viên.</p><div class="family-empty-actions"><button type="button" class="btn-primary" data-act="createFamily">${ic('s-plus', 1)}Tạo gia đình</button><button type="button" class="btn-ghost-d" data-act="joinFamily">Tham gia bằng mã</button></div><div class="family-empty-why"><h3>Tại sao nên tạo gia đình?</h3><ul><li>• Theo dõi chi tiêu chung</li><li>• Quản lý ngân sách gia đình</li><li>• Theo dõi chi tiêu từng thành viên</li><li>• Xem báo cáo tài chính gia đình</li></ul></div></div>`;
    }
    const familyId = memberships[0].familyId;
    const family = familyOf(familyId);
    if (!family) return `<div class="family-empty card"><p>Chưa có gia đình</p></div>`;
    const activeTab = S.familyTab || 'overview';
    const tabPanelMap = {
      overview: familyOverviewTab(familyId),
      transactions: familyTransactionsTab(familyId),
      members: familyMembersTab(familyId),
      budget: familyBudgetTab(familyId),
      report: familyReportTab(familyId),
      settings: familySettingsTab(familyId)
    };
    return `<div class="family-shell">
      <div class="card family-header-card">
        <div class="family-header-copy">
          <span class="dashboard-eyebrow">GIA ĐÌNH</span>
          <h2>${esc(family.name)}</h2>
        </div>
        <div class="family-header-meta">
          <div><span>Chủ gia đình</span><strong>${esc(findUser(family.ownerEmail)?.name || family.ownerEmail)}</strong></div>
          <div><span>Mã gia đình</span><strong>${esc(family.code || 'FAM-000000')}</strong></div>
        </div>
        <button type="button" class="btn-primary" data-act="addFamilyTransaction">${ic('s-plus', 1)}Thêm giao dịch</button>
      </div>
      <div class="family-tabs">${familyTabButtons.map(([key, label]) => `<button type="button" class="family-tab ${activeTab === key ? 'active' : ''}" data-act="familyTab" data-id="${key}">${label}</button>`).join('')}</div>
      <div class="family-tab-panel">${tabPanelMap[activeTab] || tabPanelMap.overview}</div>
    </div>`;
  };
  const goalPage = () => {
    const e = myGoals().find(g => g.id === S.editGoal) || {};
    const entries = myGoals().slice().sort((a, b) => a.deadline.localeCompare(b.deadline));
    return `<form class="card" data-f="goal" novalidate><h2 class="card-title">${e.id ? 'SỬA' : 'TẠO'} MỤC TIÊU TIẾT KIỆM</h2>
      <div class="grid2">${field('gname', 'Tên mục tiêu', 'i-piggy-bank', { val: e.name })}${field('gtarget', 'Số tiền mục tiêu (₫)', 'i-coins', { type: 'number', val: e.target, attr: 'min="1"' })}
      ${field('gsaved', 'Đã tiết kiệm (₫)', 'i-wallet', { type: 'number', val: e.saved || 0, attr: 'min="0"' })}${field('gdate', 'Ngày hoàn thành', 's-cal', { type: 'date', val: e.deadline })}</div>
      ${field('gnote', 'Ghi chú', 'i-receipt', { tag: 'textarea', val: e.note })}
      <div class="actions">${e.id ? '<button type="button" class="btn-ghost-d" data-act="cancelGoal">HỦY</button>' : ''}<button class="btn-primary">${e.id ? 'LƯU THAY ĐỔI' : 'TẠO MỤC TIÊU'}</button></div></form>
      <div class="card"><div class="card-head"><h2 class="card-title">MỤC TIÊU CỦA TÔI</h2><span class="badge">${entries.length} mục tiêu</span></div>
      ${entries.length ? `<div class="progress-list">${entries.map(g => {
        const pct = progress(g.saved, g.target), done = Number(g.saved) >= Number(g.target);
        return `<article class="progress-item"><div class="card-head"><div><h3>${esc(g.name)}</h3><small>${g.deadline ? `Hoàn thành trước ${fdate(g.deadline)}` : 'Chưa đặt ngày hoàn thành'} · <span class="badge ${done ? 'ok' : ''}">${done ? 'Đã hoàn thành' : `${pct}% mục tiêu`}</span></small></div><div class="cell-act"><button class="sm" data-act="editGoal" data-id="${esc(g.id)}">${ic('i-pen-to-square')}Sửa</button><button class="sm red" data-act="delGoal" data-id="${esc(g.id)}">${ic('s-trash', 1)}Xóa</button></div></div>
          ${progressBar(g.saved, g.target, done ? 'ok' : '')}<div class="progress-caption"><b>${money(g.saved)}</b><span>${pct}%</span><span>Mục tiêu ${money(g.target)}</span></div>${g.note ? `<p class="goal-note">${esc(g.note)}</p>` : ''}</article>`;
      }).join('')}</div>` : `<div class="chart-empty">Chưa có mục tiêu tiết kiệm.</div>`}</div>`;
  };
    const moneyAccountForm = () => `<form class="card" data-f="moneyAccount" novalidate><div class="card-head"><h2 class="card-title">THÊM TÀI KHOẢN</h2><button type="button" class="sm" data-act="cancelMoneyAccount">ĐÓNG</button></div>
      ${field('aname', 'Tên tài khoản', 'i-wallet', { attr: 'maxlength="80"' })}
      <div class="grid2">${field('atype', 'Loại', 's-swap', { tag: 'select', opts: opt(ACCOUNT_TYPES, 'cash') })}${field('aopening', 'Số dư ban đầu (₫)', 'i-coins', { type: 'number', val: 0, attr: 'min="0" step="any"' })}</div>
      ${field('anote', 'Mô tả', 'i-receipt', { tag: 'textarea', attr: 'maxlength="500"' })}
      <div class="actions"><button type="button" class="btn-ghost-d" data-act="cancelMoneyAccount">HỦY</button><button class="btn-primary">LƯU</button></div></form>`;
  const moneyAccountsPage = () => {
    const accounts = myAccounts(), total = accounts.reduce((sum, account) => sum + accountBalance(account), 0);
    return `<div class="money-accounts-page"><section class="card money-accounts-card"><div class="card-head"><div><span class="dashboard-eyebrow">TÀI SẢN CỦA BẠN</span><h2 class="card-title">VÍ / TÀI KHOẢN TIỀN</h2></div><span class="badge">${accounts.length} tài khoản</span></div>
      <div class="money-account-list">${accounts.map(account => `<article class="money-account-row"><span class="money-account-icon ${account.type}">${ic(account.type === 'wallet' ? 'i-mobile-screen-button' : 'i-wallet')}</span>
        <div class="money-account-copy"><b>${esc(account.name)}</b><small>${esc(accountTypeLabel(account.type))}${account.note ? ` · ${esc(account.note)}` : ''}</small></div>
        <strong>${money(accountBalance(account))}</strong></article>`).join('')}</div>
      <div class="money-account-total"><span>TỔNG TÀI SẢN</span><strong>${money(total)}</strong></div>
      <div class="actions"><button type="button" class="btn-primary" data-act="addMoneyAccount">${ic('s-plus', 1)}THÊM TÀI KHOẢN</button></div></section>
      ${S.showMoneyAccountForm ? moneyAccountForm() : ''}</div>`;
  };
  const notificationPage = () => {
    const month = monthNow(), previous = shiftMonth(month, -1), notifications = [];
    myBudgets().filter(b => b.month === month).forEach(b => {
      const spent = budgetSpent(b), ratio = spent / Math.max(b.amount, 1), name = catOf(b.catId)?.name || 'Danh mục đã xóa';
      if (ratio >= 1) notifications.push({ type: 'over', title: 'Vượt ngân sách', text: `${name}: đã chi ${money(spent)} trên ngân sách ${money(b.amount)}.` });
      else if (ratio >= .8) notifications.push({ type: 'warn', title: 'Sắp vượt ngân sách', text: `${name}: đã dùng ${progress(spent, b.amount)}% ngân sách tháng này.` });
    });
    myGoals().filter(g => Number(g.saved) < Number(g.target) && progress(g.saved, g.target) >= 80).forEach(g =>
      notifications.push({ type: 'goal', title: 'Gần đạt mục tiêu', text: `${g.name}: đã tiết kiệm ${money(g.saved)} trên ${money(g.target)}.` }));
    const thisSpend = sum(myTx().filter(t => t.date.startsWith(month)), 'out');
    const previousSpend = sum(myTx().filter(t => t.date.startsWith(previous)), 'out');
    if (thisSpend > previousSpend && thisSpend > 0) notifications.push({ type: 'warn', title: 'Chi tiêu tăng so với tháng trước', text: `Chi tháng ${month} là ${money(thisSpend)}, cao hơn ${money(thisSpend - previousSpend)} so với tháng ${previous}.` });
    const family = activeFamily();
    if (family) {
      const familyTx = db.tx.filter(t => t.scope === 'family' && t.familyId === family.id && t.date.startsWith(month));
      const familySpent = familyTx.filter(t => t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const familyBudget = Number(family.monthlyBudget || 0);
      if (familyBudget > 0) {
        const ratio = familySpent / familyBudget;
        if (ratio >= 1) notifications.push({ type: 'over', title: 'Ngân sách gia đình đã vượt giới hạn', text: `${family.name}: đã dùng ${money(familySpent)} trên ngân sách ${money(familyBudget)}.` });
        else if (ratio >= 0.8) notifications.push({ type: 'warn', title: 'Ngân sách gia đình đã sử dụng 80%', text: `${family.name}: đã dùng ${money(familySpent)} trên ngân sách ${money(familyBudget)}.` });
      }
    }
    return `<div class="card"><div class="card-head"><h2 class="card-title">THÔNG BÁO THÁNG ${month}</h2><span class="badge">${notifications.length} cảnh báo</span></div>
      ${notifications.length ? `<div class="notice-list">${notifications.map(n => `<article class="notice ${n.type}"><span class="notice-mark">${n.type === 'over' ? '!' : n.type === 'goal' ? '✓' : '↗'}</span><div><h3>${n.title}</h3><p>${esc(n.text)}</p></div></article>`).join('')}</div>` : `<div class="chart-empty">Chưa có cảnh báo. Chi tiêu và mục tiêu đang trong tầm kiểm soát.</div>`}</div>`;
  };
  const analysisPage = () => {
    const month = monthNow(), previous = shiftMonth(month, -1);
    const currentTx = myTx().filter(t => t.date.startsWith(month)), previousTx = myTx().filter(t => t.date.startsWith(previous));
    const income = sum(currentTx, 'in'), spending = sum(currentTx, 'out'), prevSpending = sum(previousTx, 'out'), categories = by(currentTx, 'out');
    const leader = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    const change = spending - prevSpending, changePct = prevSpending ? Math.round(change / prevSpending * 100) : null;
    const suggestions = [];
    if (spending > income) suggestions.push('Chi tiêu đang cao hơn thu nhập tháng này. Tạm hoãn các khoản chưa thiết yếu và đặt giới hạn theo danh mục.');
    else if (income > 0) suggestions.push(`Bạn còn ${money(income - spending)} sau chi tiêu tháng này. Có thể chuyển một phần vào mục tiêu tiết kiệm.`);
    if (leader) suggestions.push(`${leader[0]} là danh mục chi nhiều nhất (${money(leader[1])}). Hãy rà soát các khoản lặp lại trong danh mục này.`);
    if (prevSpending > 0 && change > 0) suggestions.push(`Tổng chi tăng ${changePct}% so với tháng trước. Kiểm tra các khoản phát sinh lớn trước khi đặt ngân sách tháng tới.`);
    if (!suggestions.length) suggestions.push('Thêm giao dịch để nhận gợi ý quản lý chi tiêu phù hợp với dữ liệu của bạn.');
    return `<div class="analysis-head"><div><span>PHÂN TÍCH TỰ ĐỘNG</span><h2>${month}</h2></div><p>Dựa trên giao dịch đã ghi nhận. Chưa kết nối AI API.</p></div>
      <div class="stats">${stat('Thu tháng này', income, 'i-coins')}${stat('Chi tháng này', spending, 'i-receipt')}${stat('Số dư', income - spending, 'i-piggy-bank')}</div>
      <div class="card"><h2 class="card-title">DANH MỤC CHI NHIỀU NHẤT</h2>${leader ? `<div class="analysis-leader"><b>${esc(leader[0])}</b><strong>${money(leader[1])}</strong></div>${bars(categories, 'e')}` : chartEmpty('Chưa có khoản chi trong tháng này')}</div>
      <div class="card"><h2 class="card-title">SO SÁNH THÁNG TRƯỚC</h2><div class="sum"><span class="badge out">Tháng trước: ${money(prevSpending)}</span><span class="badge ${change > 0 ? 'out' : 'ok'}">${change > 0 ? 'Tăng' : change < 0 ? 'Giảm' : 'Không đổi'}: ${money(Math.abs(change))}${changePct != null ? ` (${Math.abs(changePct)}%)` : ''}</span></div>${cmp(sum(currentTx, 'in'), spending)}</div>
      <div class="card"><h2 class="card-title">GỢI Ý QUẢN LÝ CHI TIÊU</h2><ul class="suggestions">${suggestions.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>`;
  };

  /* ===== Các trang ===== */
    const txFormCard = () => { const editing = db.tx.find(t => t.id === S.editTx && t.owner === session.email); const copied = db.tx.find(t => t.id === S.copyTx && t.owner === session.email); const e = editing || copied || {}; const familyOptions = familyScopeOptions().filter(([value]) => value !== 'personal'); return `
        <form class="card" data-f="tx" novalidate><h2 class="card-title">${editing ? 'SỬA' : 'THÊM'} GIAO DỊCH</h2>
          <div class="grid2">${field('type', 'Loại giao dịch', 's-swap', { tag: 'select', opts: opt(TYPES, e.type || 'out') })}<div class="amount-entry">${field('amount', 'Số tiền (₫)', 'i-coins', { type: 'number', val: e.amount, attr: 'min="1000" step="1"' })}
          <div class="amount-presets" role="group" aria-label="Mức tiền nhập nhanh"><span>Nhập nhanh</span><button type="button" class="sm" data-act="amountPreset" data-id="10000">10.000 ₫</button><button type="button" class="sm" data-act="amountPreset" data-id="100000">100.000 ₫</button></div></div>
          ${field('cat', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(e.catId, 'Chọn danh mục', e.type || 'out') })}${field('date', 'Ngày giao dịch', 's-cal', { type: 'date', val: editing ? e.date : today(), attr: `max="${today()}"` })}</div>
          ${field('account', 'Ví / Tài khoản', 'i-wallet', { tag: 'select', opts: opt(myAccounts().map(a => [a.id, a.name]), e.accountId || (!editing && !copied ? myAccounts().find(a => a.type === 'cash')?.id : ''), 'Chọn ví/tài khoản') })}
          ${field('payment', 'Phương thức thanh toán', 'i-wallet', { tag: 'select', opts: opt(PAYMENT_METHODS, e.paymentMethod, 'Chưa chọn') })}
          <div class="family-scope-block"><label class="family-scope-radio"><input type="radio" name="scope" value="personal" ${(!e.scope || e.scope === 'personal') ? 'checked' : ''}> Cá nhân</label><label class="family-scope-radio"><input type="radio" name="scope" value="family" ${e.scope === 'family' ? 'checked' : ''}> Gia đình</label></div>
          ${familyOptions.length ? `<div class="grid2">${field('familyId', 'Gia đình', 'i-users', { tag: 'select', opts: opt(familyOptions, e.familyId || activeFamilyId(), 'Chọn gia đình') })}${field('actor', 'Người thực hiện', 'i-user', { tag: 'select', opts: opt([[session.email, session.name]], e.owner || session.email, session.name) })}</div>` : ''}
          ${field('note', 'Mô tả (tối đa 500 ký tự)', 'i-receipt', { tag: 'textarea', val: e.note, attr: 'maxlength="500"' })}
          <div class="actions"><button type="button" class="btn-ghost-d" data-act="cancel">HỦY</button><button class="btn-primary">LƯU</button></div></form>`; };
  const PAGES = {
    user: {
      dash: { t: 'Dashboard', i: 'i-wallet', html: dashShell, dyn: userDash },
      tx: { t: 'Giao dịch', i: 'i-receipt', pg: true, rows: txRows, html: () => `${txFormCard()}
        <div class="card"><div class="card-head"><h2 class="card-title">DANH SÁCH GIAO DỊCH</h2><div class="head-act">
          <button type="button" class="sm red" id="bulk" data-act="bulk" disabled>${ic('s-trash', 1)}Xóa đã chọn (0)</button>
          <button type="button" class="sm" data-act="resetFilter">${ic('s-refresh', 1)}ĐẶT LẠI LỌC</button><button type="button" class="sm" data-act="exportTx">${ic('s-download', 1)}XUẤT CSV</button></div></div>
          <div class="toolbar tx-filters">${live('q', 'Tìm mô tả, danh mục, số tiền', 's-search', { val: S.q })}${live('ft', 'Lọc theo loại', 's-filter', { tag: 'select', opts: opt(TYPES, S.ft, 'Tất cả') })}${live('fc', 'Lọc theo danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(S.fc, 'Tất cả') })}${live('fp', 'Phương thức thanh toán', 'i-wallet', { tag: 'select', opts: opt(PAYMENT_METHODS, S.fp, 'Tất cả') })}</div>
          <div class="toolbar tx-filters">${live('scopeFilter', 'Phạm vi', 'i-layer-group', { tag: 'select', opts: opt(familyScopeOptions(), S.scopeFilter || 'personal') })}</div>
          <div class="toolbar two">${live('fd', 'Từ ngày', 's-cal', { type: 'date', val: S.fd })}${live('td', 'Đến ngày', 's-cal', { type: 'date', val: S.td })}</div>
          <div id="txSummary">${txSummary()}</div>
          ${table(['<input type="checkbox" class="chk" id="selAll" data-act="selAll" aria-label="Chọn tất cả">', 'STT', 'Loại', { l: 'Số tiền', k: 'amount' }, 'Danh mục', { l: 'Ngày', k: 'date' }, 'Tài khoản', 'Thanh toán', 'Mô tả', 'Thao tác'], 'rows')}</div>` },
      family: { t: 'Gia đình', i: 'i-users', html: familyPage },
      moneyAccounts: { t: 'Ví / Tài khoản tiền', i: 'i-wallet', html: moneyAccountsPage },
      cats: { t: 'Danh mục', i: 'i-layer-group', rows: catRows, html: catPage },
      report: { t: 'Báo cáo', i: 'i-chart-pie', html: reportPage },
      budget: { t: 'Ngân sách', i: 'i-coins', html: budgetPage },
      goals: { t: 'Mục tiêu tiết kiệm', i: 'i-piggy-bank', html: goalPage },
      notifications: { t: 'Thông báo', i: 'i-envelope', html: notificationPage },
      analysis: { t: 'Trợ lý phân tích', i: 'i-chart-pie', html: analysisPage },
      account: { t: 'Tài khoản', i: 'i-user', html: accountPage }
    },
    admin: {
      dash: { t: 'Dashboard', i: 'i-shield-halved', html: dashShell, dyn: adminDash },
      users: { t: 'Quản lý người dùng', i: 'i-users', pg: true, rows: userRows,
        html: () => `<form class="card" data-f="noop" novalidate><h2 class="card-title">TÌM KIẾM NGƯỜI DÙNG</h2>
          <div class="toolbar">${live('uq', 'Tìm theo tên / email / tên đăng nhập', 's-search', { val: S.uq })}${live('ur', 'Quyền', 'i-shield-halved', { tag: 'select', opts: opt([['USER', 'Người dùng'], ['ADMIN', 'Quản trị viên']], S.ur, 'Tất cả') })}${live('us', 'Trạng thái', 's-filter', { tag: 'select', opts: opt([['ACTIVE', 'Hoạt động'], ['LOCKED', 'Đã khóa']], S.us, 'Tất cả') })}</div>
          <div class="actions"><button type="button" class="btn-ghost-d" data-act="resetFilter">${ic('s-refresh', 1)}ĐẶT LẠI</button><button class="btn-primary">${ic('s-search', 1)}TÌM KIẾM</button></div></form>
          <div class="card"><div class="card-head"><h2 class="card-title">DANH SÁCH NGƯỜI DÙNG</h2><button type="button" class="btn-primary" style="height:40px" data-act="addUser">${ic('s-plus', 1)}THÊM NGƯỜI DÙNG</button></div>${table(['STT', 'Họ tên', 'Email', 'Quyền', 'Trạng thái', 'Thao tác'], 'rows')}</div>` },
      cats: { t: 'Quản lý danh mục', i: 'i-layer-group', rows: catRows, html: catPage },
      tx: { t: 'Quản lý giao dịch', i: 'i-receipt', pg: true, rows: txRows, html: () => `<form class="card" data-f="noop" novalidate><h2 class="card-title">BỘ LỌC GIAO DỊCH</h2>
          <div class="grid2">${live('au', 'Người dùng', 'i-users', { tag: 'select', opts: opt(db.users.map(u => [u.email, u.name]), S.au, 'Tất cả người dùng') })}${live('at', 'Loại', 's-swap', { tag: 'select', opts: opt(TYPES, S.at, 'Tất cả') })}
          ${live('ac', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(S.ac, 'Tất cả') })}<div class="grid2" style="gap:0 14px">${live('af', 'Từ ngày', 's-cal', { type: 'date', val: S.af })}${live('ae', 'Đến ngày', 's-cal', { type: 'date', val: S.ae })}</div></div>
          <div class="actions"><button type="button" class="btn-ghost-d" data-act="resetFilter">${ic('s-refresh', 1)}ĐẶT LẠI</button><button class="btn-primary">${ic('s-search', 1)}TÌM KIẾM</button></div></form>
        <div class="card"><div class="card-head"><h2 class="card-title">KẾT QUẢ</h2><button type="button" class="sm" data-act="exportTx">${ic('s-download', 1)}XUẤT CSV</button></div>${table(['STT', 'Người dùng', 'Loại', { l: 'Số tiền', k: 'amount' }, 'Danh mục', { l: 'Ngày', k: 'date' }, 'Tài khoản', 'Thanh toán', 'Mô tả', 'Thao tác'], 'rows')}</div>` },
      report: { t: 'Báo cáo', i: 'i-chart-pie', html: reportPage },
      account: { t: 'Tài khoản', i: 'i-user', html: accountPage }
    }
  }[isAdmin ? 'admin' : 'user'];

  /* ===== Điều hướng ===== */
  let page = document.body.dataset.page || location.hash.slice(1); if (!PAGES[page]) page = 'dash';
  if (!isAdmin && page === 'dash' && !monthRe.test(S.dm || '')) S.dm = monthNow();
  $('#side').innerHTML = `<div class="brand"><span class="brand-mark">${ic('i-wallet')}</span>Expense Tracker</div><span class="role-tag">${isAdmin ? 'QUẢN TRỊ VIÊN' : 'NGƯỜI DÙNG'}</span>` +
    Object.entries(PAGES).map(([k, p]) => `<button class="nav" data-p="${k}">${ic(p.i)}${p.t}</button>`).join('') +
    `<button class="nav out" data-act="logout">${ic('i-arrow-right-to-bracket')}Đăng xuất</button>`;
  $('#uname').textContent = session.name;
  function render() {
    sync();
    const p = PAGES[page];
    $('#title').textContent = p.t; document.title = 'Expense Tracker — ' + p.t;
    document.querySelectorAll('.nav[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === page));
    $('#view').innerHTML = p.html(); refreshRows(); $('#side').classList.remove('open');
    if (!isAdmin) {   // nút nổi: thêm giao dịch nhanh
      if (!$('#fab')) document.body.insertAdjacentHTML('beforeend', `<button id="fab" class="btn-primary fab noprint" data-p="tx">${ic('s-plus', 1)}THÊM GIAO DỊCH</button>`);
      $('#fab').style.display = page === 'tx' ? 'none' : '';
    }
  }
  function refreshRows() {
    const p = PAGES[page], b = $('#rows');
    if (S.sel) S.sel = S.sel.filter(id => db.tx.some(t => t.id === id));
    if (b) b.innerHTML = p.rows();
    const pg = $('#pager'); if (pg) pg.innerHTML = p.pg ? pagerHtml() : '';
    const d = $('#dyn'); if (d && p.dyn) d.innerHTML = p.dyn();
    const period = $('#dashPeriodLabel'); if (period) period.textContent = dashboardMonthLabel(S.dm);
    const summary = $('#txSummary'); if (summary) summary.innerHTML = txSummary();
    const n = (S.sel || []).length, bk = $('#bulk');
    if (bk) { bk.disabled = !n; bk.innerHTML = ic('s-trash', 1) + `Xóa đã chọn (${n})`; }
    const all = $('#selAll'); if (all) all.checked = !!PAGE_IDS.length && PAGE_IDS.every(id => (S.sel || []).includes(id));
  }
  const go = p => { page = p; Object.keys(S).forEach(k => delete S[k]); if (!isAdmin && p === 'dash') S.dm = monthNow(); history.replaceState(null, '', '#' + p); render(); };
  const setDm = v => { S.dm = v; const i = $('#dm'); if (i) i.value = v; refreshRows(); };
  const FILTER_KEYS = ['q', 'ft', 'fc', 'fp', 'fd', 'td', 'au', 'at', 'ac', 'af', 'ae', 'uq', 'ur', 'us', 'pg', 'sel'];

  /* ===== Hành động ===== */
  const ACT = {
    pw: el => { const i = el.parentElement.querySelector('input'), s = i.type === 'password'; i.type = s ? 'text' : 'password'; el.firstElementChild.firstElementChild.setAttribute('href', s ? '#i-eye-slash' : '#i-eye'); },
    amountPreset: value => { const input = $('#amount'), amount = Number(value); if (!input || ![10000, 100000].includes(amount)) return; input.value = String(amount); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); },
    cancel: () => { delete S.editTx; delete S.copyTx; delete S.editCat; render(); },
    cancelBudget: () => { delete S.editBudget; render(); },
    cancelGoal: () => { delete S.editGoal; render(); },
    addMoneyAccount: () => { S.showMoneyAccountForm = true; render(); scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); },
    cancelMoneyAccount: () => { delete S.showMoneyAccountForm; render(); },
    closeDlg: () => dlg.close(),
    familyTab: id => { S.familyTab = id || 'overview'; render(); },
    createFamily: () => {
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const d = Object.fromEntries(new FormData(dform));
        const errors = {};
        const name = (d.familyName || '').trim();
        const description = (d.familyDescription || '').trim();
        const monthlyBudget = Number(d.familyMonthlyBudget || 0);
        const cycleStartDay = Number(d.familyCycleDay || 1);
        if (!name) errors.familyName = 'Nhập tên gia đình';
        if (description.length > 500) errors.familyDescription = 'Mô tả tối đa 500 ký tự';
        if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0) errors.familyMonthlyBudget = 'Ngân sách không hợp lệ';
        if (!Number.isInteger(cycleStartDay) || cycleStartDay < 1 || cycleStartDay > 31) errors.familyCycleDay = 'Chọn ngày 1–31';
        if (!showErr(dform, errors)) return;
        const code = `FAM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const family = { id: uid(), name, description, monthlyBudget, cycleStartDay, code, ownerEmail: session.email, createdAt: new Date().toISOString() };
        db.families.push(family);
        db.familyMembers.push({ id: uid(), familyId: family.id, userEmail: session.email, role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString() });
        saveFamilies(); saveFamilyMembers(); render(); dlg.close(); toast('Đã tạo gia đình');
      };
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:14px">Tạo gia đình</h2>${field('familyName', 'Tên gia đình *', 'i-users')}${field('familyDescription', 'Mô tả', 'i-receipt', { tag: 'textarea', attr: 'maxlength="500"' })}<div class="grid2">${field('familyMonthlyBudget', 'Ngân sách tháng', 'i-coins', { type: 'number', val: 0, attr: 'min="0" step="1000"' })}${field('familyCycleDay', 'Ngày bắt đầu chu kỳ ngân sách', 's-cal', { type: 'number', val: 1, attr: 'min="1" max="31"' })}</div><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">Tạo gia đình</button></div>`);
    },
    joinFamily: () => {
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const d = Object.fromEntries(new FormData(dform));
        const code = (d.famCode || '').trim().toUpperCase();
        const family = db.families.find(f => f.code === code);
        const errors = {};
        if (!code) errors.famCode = 'Nhập mã gia đình';
        else if (!family) errors.famCode = 'Mã gia đình không tồn tại';
        else if (db.familyMembers.some(member => member.familyId === family.id && member.userEmail === session.email && member.status !== 'REJECTED')) errors.famCode = 'Bạn đã có yêu cầu hoặc đã là thành viên của gia đình này';
        if (!showErr(dform, errors)) return;
        const member = { id: uid(), familyId: family.id, userEmail: session.email, role: 'MEMBER', status: 'PENDING', createdAt: new Date().toISOString() };
        db.familyMembers.push(member);
        saveFamilyMembers(); dlg.close(); render(); toast('Yêu cầu tham gia đã được gửi.');
      };
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:14px">Tham gia gia đình</h2>${field('famCode', 'Nhập mã', 'i-users', { attr: 'maxlength="20"' })}<div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">Gửi yêu cầu</button></div>`);
    },
    inviteMember: () => {
      const family = activeFamily();
      if (!family) return;
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const d = Object.fromEntries(new FormData(dform));
        const email = (d.inviteEmail || '').trim().toLowerCase();
        const errors = {};
        if (!EMAIL_RE.test(email)) errors.inviteEmail = 'Email không hợp lệ';
        else if (db.familyMembers.some(member => member.familyId === family.id && member.userEmail === email && member.status === 'ACTIVE')) errors.inviteEmail = 'Email này đã là thành viên';
        if (!showErr(dform, errors)) return;
        db.familyInvites.push({ id: uid(), familyId: family.id, inviterEmail: session.email, email, status: 'PENDING', createdAt: new Date().toISOString() });
        saveFamilyInvites(); dlg.close(); render(); toast('Mời thành viên đã được gửi.');
      };
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:14px">Mời thành viên</h2>${field('inviteEmail', 'Email', 'i-envelope', { type: 'email' })}<div class="family-code-row"><label>Mã gia đình</label><div class="family-code-box">${esc(family.code || 'FAM-000000')}</div><button type="button" class="btn-ghost-d" data-act="copyFamilyCode">Sao chép mã</button></div><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">Gửi lời mời</button></div>`);
    },
    copyFamilyCode: () => {
      const family = activeFamily();
      if (!family) return;
      if (navigator.clipboard) navigator.clipboard.writeText(family.code || '').then(() => toast('Mã gia đình đã được sao chép')).catch(() => toast('Không thể sao chép mã gia đình'));
      else toast('Mã gia đình: ' + family.code);
    },
    addFamilyTransaction: () => {
      const family = activeFamily();
      if (!family) return;
      dform.dataset.f = 'tx'; dform.onsubmit = null; dform.innerHTML = `<h2 class="card-title">THÊM GIAO DỊCH GIA ĐÌNH</h2>
        <div class="grid2">${field('type', 'Loại', 's-swap', { tag: 'select', opts: opt(TYPES, 'out') })}${field('amount', 'Số tiền', 'i-coins', { type: 'number', val: 0, attr: 'min="1000" step="1000"' })}
        ${field('cat', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts('', 'Chọn danh mục', 'out') })}${field('date', 'Ngày', 's-cal', { type: 'date', val: today(), attr: `max="${today()}"` })}</div>
        ${field('account', 'Ví/Tài khoản', 'i-wallet', { tag: 'select', opts: opt(myAccounts().map(a => [a.id, a.name]), myAccounts().find(a => a.type === 'cash')?.id || '', 'Chọn ví/tài khoản') })}
        ${field('payment', 'Phương thức thanh toán', 'i-wallet', { tag: 'select', opts: opt(PAYMENT_METHODS, 'cash', 'Chưa chọn') })}
        ${field('familyId', 'Gia đình', 'i-users', { tag: 'select', opts: opt([[family.id, family.name]], family.id) })}
        ${field('actor', 'Người thực hiện', 'i-user', { tag: 'select', opts: opt(familyMembersOf(family.id).map(member => [member.userEmail, findUser(member.userEmail)?.name || member.userEmail]), session.email) })}
        ${field('note', 'Ghi chú', 'i-receipt', { tag: 'textarea', attr: 'maxlength="500"' })}
        <div class="field" style="display:none"><input id="scope" name="scope" value="family"></div>
        <div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" type="submit">LƯU</button></div>`; if (!dlg.open) dlg.showModal();
    },
    acceptFamilyMember: id => { const member = db.familyMembers.find(m => m.userEmail === id && m.status === 'PENDING' && m.familyId === activeFamilyId()); if (!member) return; member.status = 'ACTIVE'; saveFamilyMembers(); render(); toast('Đã chấp nhận thành viên'); },
    rejectFamilyMember: id => { const member = db.familyMembers.find(m => m.userEmail === id && m.status === 'PENDING' && m.familyId === activeFamilyId()); if (!member) return; member.status = 'REJECTED'; saveFamilyMembers(); render(); toast('Đã từ chối yêu cầu'); },
    removeFamilyMember: id => { const family = activeFamily(); if (!family || family.ownerEmail !== session.email) return; const member = db.familyMembers.find(m => m.userEmail === id && m.familyId === family.id && m.status === 'ACTIVE'); if (!member || id === session.email) return toast('Không thể xóa chủ gia đình hoặc thành viên không hợp lệ');
      confirmBox('Xóa thành viên khỏi gia đình?', () => { db.familyMembers = db.familyMembers.filter(m => !(m.familyId === family.id && m.userEmail === id)); saveFamilyMembers(); render(); toast('Đã xóa thành viên'); }); },
    deleteFamily: () => { const family = activeFamily(); if (!family || family.ownerEmail !== session.email) return; confirmBox('Bạn có chắc muốn giải tán gia đình?', () => { db.families = db.families.filter(f => f.id !== family.id); db.familyMembers = db.familyMembers.filter(m => m.familyId !== family.id); db.familyInvites = db.familyInvites.filter(i => i.familyId !== family.id); db.tx = db.tx.filter(t => t.scope !== 'family' || t.familyId !== family.id); saveFamilies(); saveFamilyMembers(); saveFamilyInvites(); saveTx(); render(); toast('Gia đình đã được giải tán'); }); },
    /* --- Giao dịch --- */
    editTx: id => { const t = db.tx.find(x => x.id === id); if (!t || t.owner !== session.email) return; delete S.copyTx; S.editTx = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    copyTx: id => { const t = db.tx.find(x => x.id === id); if (!t || t.owner !== session.email) return; delete S.editTx; S.copyTx = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); toast('Đã sao chép vào biểu mẫu; kiểm tra rồi lưu'); },
    viewTx: id => { const t = db.tx.find(x => x.id === id); if (!t || (!isAdmin && t.owner !== session.email)) return;
      openDlg(`<h2 class="card-title">CHI TIẾT GIAO DỊCH</h2><dl class="tx-detail">
        <div><dt>Loại</dt><dd><span class="badge ${t.type}">${t.type === 'in' ? 'Thu' : 'Chi'}</span></dd></div><div><dt>Số tiền</dt><dd class="${t.type === 'in' ? 'inc' : 'exp'}">${money(t.amount)}</dd></div>
        <div><dt>Danh mục</dt><dd>${esc(cname(t))}</dd></div><div><dt>Ngày</dt><dd>${fdate(t.date)}</dd></div><div><dt>Ví / Tài khoản</dt><dd>${esc(accountLabel(t.accountId || t.account))}</dd></div><div><dt>Phương thức thanh toán</dt><dd>${esc(paymentLabel(t.paymentMethod))}</dd></div>
        <div><dt>Mô tả</dt><dd>${esc(t.note) || '—'}</dd></div><div><dt>Tạo lúc</dt><dd>${formatTimestamp(t.createdAt)}</dd></div><div><dt>Cập nhật</dt><dd>${formatTimestamp(t.updatedAt || t.createdAt)}</dd></div>
        </dl><div class="actions">${!isAdmin ? `<button type="button" class="sm" data-act="editTxDetail" data-id="${esc(t.id)}">${ic('i-pen-to-square')}Sửa</button>` : ''}<button type="button" class="btn-ghost-d" data-act="closeDlg">ĐÓNG</button></div>`, true); },
    editTxDetail: id => { dlg.close(); ACT.editTx(id); },
    delTx: id => { const t = db.tx.find(x => x.id === id); if (!t || (!isAdmin && t.owner !== session.email)) return;
      confirmDeleteTx(t, () => { db.tx = db.tx.filter(x => x.id !== id); saveTx(); refreshRows(); toast('Đã xóa giao dịch'); }); },   // TODO: DELETE /api/transactions/:id
    selTx: id => { const s = S.sel = S.sel || []; const i = s.indexOf(id); i < 0 ? s.push(id) : s.splice(i, 1); refreshRows(); },
    selAll: () => { const s = S.sel = S.sel || [], every = PAGE_IDS.every(id => s.includes(id)); S.sel = every ? s.filter(id => !PAGE_IDS.includes(id)) : [...new Set([...s, ...PAGE_IDS])]; refreshRows(); },
    bulk: () => { const ids = (S.sel || []).filter(id => db.tx.some(t => t.id === id && t.owner === session.email)); if (!ids.length) return;
      confirmBox(`Xóa ${ids.length} giao dịch đã chọn?`, () => { db.tx = db.tx.filter(t => !ids.includes(t.id)); saveTx(); S.sel = []; refreshRows(); toast('Đã xóa ' + ids.length + ' giao dịch'); }); },
    sort: k => { const cur = S.sk || 'date', dir = S.sd || 'desc'; S.sd = k === cur ? (dir === 'desc' ? 'asc' : 'desc') : 'desc'; S.sk = k; S.pg = 1;
      document.querySelectorAll('th[data-act="sort"]').forEach(th => { th.textContent = th.dataset.l + arrow(th.dataset.id); }); refreshRows(); },
    pg: n => { S.pg = Math.max(1, Math.min(PG.pages, Number(n))); refreshRows(); },
    resetFilter: () => { FILTER_KEYS.forEach(k => delete S[k]); render(); },
    exportTx: () => { const l = filterTx(); if (!l.length) return toast('Chưa có dữ liệu để xuất'); download(`giao-dich-${today()}.csv`, txCsv(l)); },
    /* --- Danh mục --- */
    editCat: id => { const c = catOf(id); if (!c || !canEditCat(c)) return; S.editCat = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    delCat: id => { const c = catOf(id); if (!c || !canDelCat(c)) return;
      if (db.tx.some(t => t.catId === id)) return toast('Không thể xóa: danh mục đang có giao dịch', 3200);   // DB: ON DELETE RESTRICT
      confirmBox('Xóa danh mục này?', () => { db.cats = db.cats.filter(x => x.id !== id); saveCats(); refreshRows(); toast('Đã xóa danh mục'); }); },   // TODO: DELETE /api/categories/:id
    /* --- Dashboard --- */
    dm: id => setDm(id === 'all' ? '' : id === 'now' ? today().slice(0, 7) : shiftMonth(monthRe.test(S.dm || '') ? S.dm : today().slice(0, 7), Number(id))),
    refreshDash: () => { sync(); render(); toast('Đã làm mới dữ liệu từ thiết bị'); },
    editBudget: id => { if (!myBudgets().some(b => b.id === id)) return; S.editBudget = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    delBudget: id => { if (!myBudgets().some(b => b.id === id)) return; confirmBox('Xóa ngân sách này?', () => { db.budgets = db.budgets.filter(b => b.id !== id); saveBudgets(); delete S.editBudget; render(); toast('Đã xóa ngân sách'); }); },
    editGoal: id => { if (!myGoals().some(g => g.id === id)) return; S.editGoal = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    delGoal: id => { if (!myGoals().some(g => g.id === id)) return; confirmBox('Xóa mục tiêu tiết kiệm này?', () => { db.goals = db.goals.filter(g => g.id !== id); saveGoals(); delete S.editGoal; render(); toast('Đã xóa mục tiêu'); }); },
    /* --- Báo cáo --- */
    repRange: id => { const t = today(), y = t.slice(0, 4), m = t.slice(5, 7), last = String(new Date(+y, +m, 0).getDate()).padStart(2, '0');
      const r = id === 'month' ? [`${y}-${m}-01`, `${y}-${m}-${last}`] : id === 'year' ? [`${y}-01-01`, `${y}-12-31`] : ['', ''];
      const f = $('[data-f="report"]'), el = f.elements; el.rf.value = r[0]; el.rt.value = r[1]; if (id === 'reset') { el.rc.value = ''; (el.ru || el.rty).value = ''; }
      FORM.report(f, Object.fromEntries(new FormData(f))); },
    rv: id => { S.rv = id; if (S.rrun) $('#repOut').innerHTML = reportOut(); },
    exportRep: () => { const l = reportList(); if (!S.rrun || !l.length) return toast('Hãy bấm XEM BÁO CÁO để có dữ liệu trước khi xuất'); download(`bao-cao-${today()}.csv`, txCsv(l)); },
    printRep: () => { if (!S.rrun) return toast('Hãy bấm XEM BÁO CÁO trước khi in'); window.print(); },
    /* --- Người dùng (admin) --- */
    lock: id => { const u = findUser(id); if (!u) return; if (id === session.email) return toast('Bạn không thể khóa chính mình');
      u.status = locked(u) ? 'ACTIVE' : 'LOCKED'; saveUsers(); refreshRows(); toast(locked(u) ? 'Đã khóa tài khoản' : 'Đã mở khóa'); },   // TODO: PATCH /api/users/:id/lock
    role: id => { const u = findUser(id); if (!u) return; if (id === session.email) return toast('Bạn không thể đổi quyền của chính mình');
      const r = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
      confirmBox(`Đổi quyền của ${u.name} thành ${r}?`, () => { const x = findUser(id); if (!x) return; x.role = r; saveUsers(); refreshRows(); toast('Đã cập nhật quyền'); }); },   // TODO: PATCH /api/users/:id/role
    delUser: id => { const u = findUser(id); if (!u) return; if (id === session.email) return toast('Bạn không thể xóa chính mình');
      confirmBox(`Xóa ${u.name} cùng toàn bộ giao dịch, danh mục của họ?`, () => {
        db.users = db.users.filter(x => x.email !== id); db.tx = db.tx.filter(t => t.owner !== id); db.cats = db.cats.filter(c => c.owner !== id);
        db.budgets = db.budgets.filter(b => b.owner !== id); db.goals = db.goals.filter(g => g.owner !== id); db.accounts = db.accounts.filter(a => a.owner !== id);
        saveUsers(); saveTx(); saveCats(); saveBudgets(); saveGoals(); saveAccounts(); refreshRows(); toast('Đã xóa người dùng'); }); },   // TODO: DELETE /api/users/:id
    resetPw: id => { const u = findUser(id); if (!u) return;
      confirmBox(`Đặt lại mật khẩu của ${u.name}?`, async () => { const pw = tempPw(), x = findUser(id); if (!x) return;
        x.passwordHash = await hashPw(pw); saveUsers();
        setTimeout(() => { dform.onsubmit = null; openDlg(`<h2 style="color:var(--blue-900);margin-bottom:6px">Đã đặt lại mật khẩu</h2><p style="color:var(--muted);margin-bottom:12px">${esc(x.name)} · ${esc(x.email)}</p>
          <p style="font-size:22px;font-weight:800;letter-spacing:.04em;user-select:all;padding:14px;border-radius:14px;background:#eff6ff;color:var(--blue-900);text-align:center">${esc(pw)}</p>
          <p style="color:var(--muted);margin:12px 0 4px;font-size:13px">Hãy gửi mật khẩu tạm này cho người dùng và nhắc họ đổi lại ở trang Tài khoản. Mật khẩu chỉ hiển thị lần này.</p>
          <div class="actions"><button class="btn-primary" value="x">ĐÓNG</button></div>`); }, 60); }); },   // TODO: POST /api/users/:id/reset-password
    addUser: () => {
      dform.onsubmit = async e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const d = Object.fromEntries(new FormData(dform)), err = {}, email = (d.nemail || '').trim().toLowerCase(), username = (d.nuser || '').trim();
        if ((d.nname || '').trim().length < 2) err.nname = 'Nhập họ và tên';
        if (!EMAIL_RE.test(email)) err.nemail = 'Email chưa đúng định dạng'; else if (db.users.some(u => u.email === email)) err.nemail = 'Email này đã được đăng ký';
        if (!USER_RE.test(username)) err.nuser = '4–20 ký tự: chữ, số, _ hoặc .'; else if (db.users.some(u => (u.username || '').toLowerCase() === username.toLowerCase())) err.nuser = 'Tên đăng nhập đã tồn tại';
        if ((d.npw || '').length < 8) err.npw = 'Cần ít nhất 8 ký tự';
        if (!showErr(dform, err)) return;
        db.users.push({ name: d.nname.trim(), username, email, passwordHash: await hashPw(d.npw), role: d.nrole === 'ADMIN' ? 'ADMIN' : 'USER', status: 'ACTIVE', createdAt: new Date().toISOString() });
        saveUsers(); dlg.close(); refreshRows(); toast('Đã thêm người dùng');   // TODO: POST /api/users
      };
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:14px">THÊM NGƯỜI DÙNG</h2>${field('nname', 'Họ và tên', 'i-user')}${field('nemail', 'Email', 'i-envelope', { type: 'email' })}${field('nuser', 'Tên đăng nhập', 'i-at')}
        ${field('npw', 'Mật khẩu', 'i-lock', { type: 'password', attr: 'class="has-toggle" autocomplete="new-password"' })}${field('nrole', 'Quyền', 'i-shield-halved', { tag: 'select', opts: opt([['USER', 'Người dùng'], ['ADMIN', 'Quản trị viên']], 'USER') })}
        <div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">THÊM</button></div>`);
    },
    viewUser: id => { const u = findUser(id); if (!u) return; const t = db.tx.filter(x => x.owner === id), me = id === session.email;
      dform.onsubmit = null;
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:6px">${esc(u.name)}</h2><p style="color:var(--muted);margin-bottom:14px">${esc(u.email)} · ${u.role} · ${locked(u) ? 'Đã khóa' : 'Hoạt động'}</p>
        <div class="sum"><span class="badge in">Thu: ${money(sum(t, 'in'))}</span><span class="badge out">Chi: ${money(sum(t, 'out'))}</span><span class="badge">${t.length} giao dịch</span></div>
        <h3 ${h3}>Giao dịch gần đây</h3>${miniTable(recent(t, 8))}
        <div class="actions" style="margin-top:16px"><button type="button" class="sm ${locked(u) ? 'grn' : 'red'}" data-act="lockView" data-id="${esc(id)}"${me ? ' disabled' : ''}>${locked(u) ? ic('s-unlock', 1) + 'Mở khóa' : ic('i-lock') + 'Khóa'}</button>
        <button type="button" class="sm" data-act="role" data-id="${esc(id)}"${me ? ' disabled' : ''}>${ic('i-shield-halved')}Phân quyền</button><button class="btn-primary" value="x">ĐÓNG</button></div>`, true); },
    lockView: id => { ACT.lock(id); ACT.viewUser(id); },
    /* --- Tài khoản --- */
    delAcc: () => {
      if (isAdmin && db.users.filter(u => u.role === 'ADMIN').length <= 1) return toast('Không thể xóa quản trị viên cuối cùng', 3200);
      confirmBox('Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn?', () => {
        const e = session.email;
        db.users = db.users.filter(u => u.email !== e); db.tx = db.tx.filter(t => t.owner !== e); db.cats = db.cats.filter(c => c.owner !== e);
        db.budgets = db.budgets.filter(b => b.owner !== e); db.goals = db.goals.filter(g => g.owner !== e); db.accounts = db.accounts.filter(a => a.owner !== e);
        saveUsers(); saveTx(); saveCats(); saveBudgets(); saveGoals(); saveAccounts(); leave(); }); },   // TODO: DELETE /api/account
    logout: () => leave()
  };

  /* ===== Gửi form ===== */
  const FORM = {
    moneyAccount: (f, d) => {
      const errors = {}, name = (d.aname || '').trim(), openingBalance = Number(d.aopening);
      if (!name || name.length > 80) errors.aname = 'Nhập tên tài khoản (tối đa 80 ký tự)';
      if (!ACCOUNT_TYPES.some(([key]) => key === d.atype)) errors.atype = 'Chọn loại tài khoản';
      if (!Number.isFinite(openingBalance) || openingBalance < 0) errors.aopening = 'Số dư ban đầu không được âm';
      if ((d.anote || '').length > 500) errors.anote = 'Mô tả không được vượt quá 500 ký tự';
      if (db.accounts.some(account => account.owner === session.email && account.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) errors.aname = 'Tên tài khoản đã tồn tại';
      if (!showErr(f, errors)) return;
      db.accounts.push({ id: uid(), owner: session.email, name, type: d.atype, openingBalance, note: (d.anote || '').trim(), createdAt: new Date().toISOString() });
      saveAccounts(); delete S.showMoneyAccountForm; render(); toast('Đã thêm tài khoản');
    },
    budget: (f, d) => {
      const errors = {}, amount = Number(d.bamount), editing = myBudgets().find(b => b.id === S.editBudget);
      const cat = catOf(d.bcat);
      if (!cat || cat.type !== 'out' || !visCats().includes(cat)) errors.bcat = 'Chọn danh mục Chi hợp lệ';
      if (!monthRe.test(d.bmonth || '')) errors.bmonth = 'Chọn tháng hợp lệ';
      if (!(amount > 0)) errors.bamount = 'Nhập ngân sách lớn hơn 0';
      if (db.budgets.some(b => b.id !== (editing && editing.id) && b.owner === session.email && b.catId === d.bcat && b.month === d.bmonth)) errors.bcat = 'Danh mục này đã có ngân sách trong tháng';
      if (!showErr(f, errors)) return;
      const value = { catId: d.bcat, month: d.bmonth, amount };
      if (editing) Object.assign(editing, value);
      else db.budgets.push({ id: uid(), owner: session.email, ...value });
      saveBudgets(); delete S.editBudget; render(); toast(editing ? 'Đã cập nhật ngân sách' : 'Đã tạo ngân sách');
    },
    goal: (f, d) => {
      const errors = {}, target = Number(d.gtarget), saved = Number(d.gsaved || 0), editing = myGoals().find(g => g.id === S.editGoal);
      if (!d.gname.trim()) errors.gname = 'Nhập tên mục tiêu';
      if (!(target > 0)) errors.gtarget = 'Nhập số tiền mục tiêu lớn hơn 0';
      if (!(saved >= 0)) errors.gsaved = 'Số tiền đã tiết kiệm không hợp lệ';
      if (!d.gdate) errors.gdate = 'Chọn ngày hoàn thành';
      if (!showErr(f, errors)) return;
      const value = { name: d.gname.trim(), target, saved, deadline: d.gdate, note: (d.gnote || '').trim() };
      if (editing) Object.assign(editing, value);
      else db.goals.push({ id: uid(), owner: session.email, ...value });
      saveGoals(); delete S.editGoal; render(); toast(editing ? 'Đã cập nhật mục tiêu' : 'Đã tạo mục tiêu');
    },
    tx: (f, d) => { const e = {}; d.amount = Number(d.amount); const c = catOf(d.cat); const scope = d.scope === 'family' ? 'family' : 'personal'; const familyId = scope === 'family' ? (d.familyId || activeFamilyId()) : null;
      if (!Number.isFinite(d.amount) || d.amount < 1000) e.amount = 'Số tiền tối thiểu là 1.000 ₫';
      if (!d.cat) e.cat = 'Chọn danh mục'; else if (!c || c.type !== d.type || !visCats().includes(c)) e.cat = 'Danh mục không hợp lệ hoặc không đúng loại Thu/Chi';
      if (!myAccounts().some(account => account.id === d.account && account.owner === session.email)) e.account = 'Chọn ví hoặc tài khoản của bạn';
      if (d.payment && !PAYMENT_METHODS.some(([key]) => key === d.payment)) e.payment = 'Phương thức thanh toán không hợp lệ';
      if (scope === 'family' && !familyId) e.familyId = 'Chọn gia đình';
      if (scope === 'family' && !db.familyMembers.some(member => member.familyId === familyId && member.userEmail === session.email)) e.familyId = 'Bạn chưa thuộc gia đình này';
      if (!d.date) e.date = 'Chọn ngày giao dịch';
      else if (d.date > today()) e.date = 'Ngày giao dịch không được ở tương lai';
      if ((d.note || '').length > 500) e.note = 'Mô tả không được vượt quá 500 ký tự';
      if (!showErr(f, e)) return;
      const v = { type: d.type, amount: d.amount, catId: d.cat, date: d.date, accountId: d.account, paymentMethod: d.payment || '', note: (d.note || '').trim(), scope, familyId, updatedAt: new Date().toISOString() };
      const old = S.editTx && db.tx.find(t => t.id === S.editTx && t.owner === session.email);
      if (old) Object.assign(old, v); else db.tx.push({ id: uid(), owner: d.actor || session.email, ...v, createdAt: v.updatedAt });   // TODO: POST/PUT /api/transactions
      saveTx(); delete S.editTx; delete S.copyTx; render(); toast('Đã lưu giao dịch'); },
    cat: (f, d) => { const e = {}; d.cname = d.cname.trim();
      const ed = db.cats.find(c => c.id === S.editCat && canEditCat(c)), owner = ed ? ed.owner : (isAdmin ? '' : session.email);
      if (!d.cname) e.cname = 'Nhập tên danh mục'; else if (db.cats.some(c => c.id !== (ed && ed.id) && (c.owner || '') === owner && c.name.toLowerCase() === d.cname.toLowerCase() && c.type === d.ctype)) e.cname = 'Danh mục này đã tồn tại';
      if (!d.ctype) e.ctype = 'Chọn loại Thu hoặc Chi'; else if (ed && ed.type !== d.ctype && db.tx.some(t => t.catId === ed.id)) e.ctype = 'Danh mục đã có giao dịch, không thể đổi loại';
      if (!showErr(f, e)) return;
      const v = { name: d.cname, type: d.ctype, note: d.cnote.trim() };
      if (ed) Object.assign(ed, v); else db.cats.push({ id: uid(), owner, ...v });   // TODO: POST/PUT /api/categories
      saveCats(); delete S.editCat; render(); toast('Đã lưu danh mục'); },
    account: async (f, d) => { const e = {}, me = findUser(session.email), email = d.email.trim().toLowerCase(), username = d.username.trim();
      if (d.name.trim().length < 2) e.name = 'Nhập họ và tên của bạn';
      if (!EMAIL_RE.test(email)) e.email = 'Email chưa đúng định dạng'; else if (db.users.some(u => u !== me && u.email === email)) e.email = 'Email này đã được đăng ký';
      if (!USER_RE.test(username)) e.username = '4–20 ký tự: chữ, số, _ hoặc .'; else if (db.users.some(u => u !== me && (u.username || '').toLowerCase() === username.toLowerCase())) e.username = 'Tên đăng nhập đã tồn tại';
      if (d.pw || d.pw2) {
        if (!d.cpw) e.cpw = 'Nhập mật khẩu hiện tại'; else if (!me || me.passwordHash !== await hashPw(d.cpw)) e.cpw = 'Mật khẩu hiện tại không đúng';
        if (d.pw.length < 8) e.pw = 'Cần ít nhất 8 ký tự'; if (d.pw !== d.pw2) e.pw2 = 'Mật khẩu xác nhận chưa khớp';
      }
      if (!showErr(f, e)) return;
      const old = session.email;
      if (me) { Object.assign(me, { name: d.name.trim(), email, username }); if (d.pw) me.passwordHash = await hashPw(d.pw); saveUsers(); }
      if (old !== email) { db.tx.forEach(t => { if (t.owner === old) t.owner = email; }); db.cats.forEach(c => { if (c.owner === old) c.owner = email; });
        db.budgets.forEach(b => { if (b.owner === old) b.owner = email; }); db.goals.forEach(g => { if (g.owner === old) g.owner = email; }); db.accounts.forEach(a => { if (a.owner === old) a.owner = email; });
        saveTx(); saveCats(); saveBudgets(); saveGoals(); saveAccounts(); }
      Object.assign(session, { name: d.name.trim(), email, username }); write(SESSION_KEY, session);   // TODO: PUT /api/account
      $('#uname').textContent = session.name; f.elements.cpw.value = f.elements.pw.value = f.elements.pw2.value = ''; toast('Đã cập nhật tài khoản'); },
    familySettings: (f, d) => {
      const family = activeFamily();
      const errors = {};
      if (!family) return;
      const name = (d.familyName || '').trim();
      const description = (d.familyDescription || '').trim();
      const monthlyBudget = Number(d.familyBudget || 0);
      if (!name) errors.familyName = 'Nhập tên gia đình';
      if (description.length > 500) errors.familyDescription = 'Mô tả tối đa 500 ký tự';
      if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0) errors.familyBudget = 'Ngân sách không hợp lệ';
      if (!showErr(f, errors)) return;
      family.name = name; family.description = description; family.monthlyBudget = monthlyBudget; saveFamilies(); render(); toast('Đã lưu thay đổi gia đình');
    },
    report: (f, d) => {
      if (d.rf && d.rt && d.rf > d.rt) { showErr(f, { rt: 'Đến ngày phải sau Từ ngày' }); return; }
      showErr(f, {});
      Object.assign(S, { rf: d.rf, rt: d.rt, ru: d.ru, rty: d.rty, rc: d.rc, rrun: true }); $('#repOut').innerHTML = reportOut(); },   // TODO: GET /api/reports
    noop: () => refreshRows()
  };

  document.addEventListener('click', e => {
    const n = e.target.closest('[data-p]'); if (n) return go(n.dataset.p);
    const a = e.target.closest('[data-act]'); if (a && !a.disabled) ACT[a.dataset.act]?.(a.dataset.id ?? a, e);
  });
  document.addEventListener('submit', e => { const f = e.target.closest('form[data-f]'); if (!f) return; e.preventDefault(); FORM[f.dataset.f](f, Object.fromEntries(new FormData(f))); });
  document.addEventListener('input', e => {
    const t = e.target; t.closest('.field')?.classList.remove('invalid');
    if (t.hasAttribute('data-live')) { S[t.id === 'dashboardScope' ? 'dashboardScope' : t.id] = t.value; if (t.id !== 'ps') S.pg = 1; refreshRows(); }
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.hasAttribute('data-live')) { S[t.id === 'dashboardScope' ? 'dashboardScope' : t.id] = t.value; if (t.id !== 'ps') S.pg = 1; refreshRows(); }
    if (t.id === 'type' && t.form?.dataset.f === 'tx') $('#cat', t.form).innerHTML = catOpts('', 'Chọn danh mục', t.value);   // chỉ hiện danh mục đúng loại Thu/Chi
  });
  $('#menuBtn').onclick = () => $('#side').classList.toggle('open');
  render();
})();
