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

  const FAMILY_KEY = 'et_families', FAMILY_MEMBERS_KEY = 'et_family_members', FAMILY_INVITES_KEY = 'et_family_invites', FAMILY_FUND_KEY = 'et_family_fund_entries', ACCOUNT_ADJUSTMENTS_KEY = 'et_account_adjustments', NOTIFICATIONS_KEY = 'et_notifications';
  const db = { tx: read(TX_KEY, []), cats: read(CAT_KEY, []), users: read(USERS_KEY, []), budgets: read(BUDGET_KEY, []), goals: read(GOAL_KEY, []), accounts: read(ACCOUNTS_KEY, []), families: read(FAMILY_KEY, []), familyMembers: read(FAMILY_MEMBERS_KEY, []), familyInvites: read(FAMILY_INVITES_KEY, []), familyFundEntries: read(FAMILY_FUND_KEY, []), accountAdjustments: read(ACCOUNT_ADJUSTMENTS_KEY, []), notifications: read(NOTIFICATIONS_KEY, []) };
  const saveUsers = () => write(USERS_KEY, db.users), saveTx = () => write(TX_KEY, db.tx), saveCats = () => write(CAT_KEY, db.cats);
  const saveBudgets = () => write(BUDGET_KEY, db.budgets), saveGoals = () => write(GOAL_KEY, db.goals), saveAccounts = () => write(ACCOUNTS_KEY, db.accounts), saveAccountAdjustments = () => write(ACCOUNT_ADJUSTMENTS_KEY, db.accountAdjustments);
  const saveFamilies = () => write(FAMILY_KEY, db.families), saveFamilyMembers = () => write(FAMILY_MEMBERS_KEY, db.familyMembers), saveFamilyInvites = () => write(FAMILY_INVITES_KEY, db.familyInvites), saveFamilyFundEntries = () => write(FAMILY_FUND_KEY, db.familyFundEntries);
  const saveNotifications = () => write(NOTIFICATIONS_KEY, db.notifications);
  const sync = () => { db.users = read(USERS_KEY, []); db.tx = read(TX_KEY, []); db.cats = read(CAT_KEY, []); db.budgets = read(BUDGET_KEY, []); db.goals = read(GOAL_KEY, []); db.accounts = read(ACCOUNTS_KEY, []); db.families = read(FAMILY_KEY, []); db.familyMembers = read(FAMILY_MEMBERS_KEY, []); db.familyInvites = read(FAMILY_INVITES_KEY, []); db.familyFundEntries = read(FAMILY_FUND_KEY, []); db.accountAdjustments = read(ACCOUNT_ADJUSTMENTS_KEY, []); db.notifications = read(NOTIFICATIONS_KEY, []); };
  const notificationsForMe = () => db.notifications.filter(notification => notification.owner === session.email)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const unreadNotificationCount = () => notificationsForMe().filter(notification => !notification.readAt).length;
  const recordNotification = (owner, eventKey, type, title, text, familyId = '') => {
    if (!owner || db.notifications.some(notification => notification.owner === owner && notification.eventKey === eventKey)) return;
    const notification = { id: uid(), owner, eventKey, type, title, text, createdAt: new Date().toISOString(),
      ...(familyId ? { familyId } : {}) };
    db.notifications.push(notification);
    try {
      saveNotifications();
    } catch (error) {
      db.notifications = db.notifications.filter(item => item.id !== notification.id);
      console.error('Unable to save notification', error);
      toast('Không thể lưu thông báo. Vui lòng kiểm tra dung lượng lưu trữ trình duyệt.', 4200);
    }
  };
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
  const categoryName = c => c.parentId ? `${catOf(c.parentId)?.name || 'Danh mục'} › ${c.name}` : c.name;
  const cname = t => { const category = catOf(t.catId); return category ? categoryName(category) : '(đã xóa)'; };
  // Danh mục chung (owner rỗng / scope global) là mẫu dùng cho cá nhân VÀ gia đình.
  // Danh mục của một gia đình chỉ thuộc gia đình đó; người ngoài không nhìn thấy.
  const isGlobalCategory = category => category?.scope !== 'family' && !category?.owner;
  const visCats = (scope = 'personal', familyId = '', includeHidden = false) => db.cats.filter(category => {
    if (scope === 'global') return isGlobalCategory(category);
    if (scope === 'all' && isAdmin) return true;
    if (scope === 'family') return isGlobalCategory(category) || (
      category.scope === 'family' && category.familyId === familyId && (isAdmin || !!familyMemberOf(familyId)));
    if (scope === 'personal') return isGlobalCategory(category) ||
      (category.scope !== 'family' && (isAdmin || category.owner === session.email));
    return false;
  })
    .filter(category => includeHidden || !category.hidden)
    .slice().sort((a, b) => categoryName(a).localeCompare(categoryName(b), 'vi'));
  const catLabel = c => `${c.icon || '📦'} ${categoryName(c)}${isAdmin && c.owner ? ` — ${uname(c.owner)}` : ''}`;
  const categoryColor = category => /^#[0-9a-f]{6}$/i.test(category?.color || '') ? category.color : '#2563eb';
  const CATEGORY_SECTIONS = [
    { name: 'Thiết yếu', families: ['Ăn uống', 'Di chuyển', 'Hóa đơn & Tiện ích', 'Sức khỏe'] },
    { name: 'Lối sống', families: ['Mua sắm', 'Giải trí & Du lịch'] },
    { name: 'Phát triển cá nhân', families: ['Học tập'] },
    { name: 'Mối quan hệ & Hiếu hỷ', families: ['Đối ngoại'] },
    { name: 'Tài chính & Nghĩa vụ', families: ['Khoản nợ & Phí', 'Tích lũy & Đầu tư'] }
  ];
  const categoryParts = c => {
    if (c.parentId) return { family: catOf(c.parentId)?.name || '', leaf: c.name };
    const split = c.name.indexOf(' — ');
    return split < 0 ? { family: '', leaf: c.name } : { family: c.name.slice(0, split), leaf: c.name.slice(split + 3) };
  };
  const categorySection = c => {
    const { family } = categoryParts(c), section = CATEGORY_SECTIONS.find(s => s.families.includes(family));
    return section?.name || (c.type === 'in' ? 'Thu nhập' : c.owner ? (isAdmin ? `Danh mục · ${uname(c.owner)}` : 'Danh mục của tôi') : 'Danh mục khác');
  };
  const myTx = () => {
    if (isAdmin) return db.tx;
    const familyId = S.scopeFilter && S.scopeFilter !== 'personal' ? S.scopeFilter : '';
    return db.tx.filter(t => {
      if (t.scope === 'family') return !!familyId && t.familyId === familyId && !!familyMemberOf(familyId);
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
  const familyMembersOf = familyId => db.familyMembers.filter(m => m.familyId === familyId && m.status === 'ACTIVE');
  const familyMemberOf = (familyId, email = session.email) => familyMembersOf(familyId).find(member => member.userEmail === email);
  const familyRoleOf = (familyId, email = session.email) => familyMemberOf(familyId, email)?.role || '';
  const canManageFamily = familyId => {
    const family = familyOf(familyId);
    return !!family && (family.ownerEmail === session.email || ['OWNER', 'MANAGER'].includes(familyRoleOf(familyId)));
  };
  const canManageFamilyRoles = familyId => familyOf(familyId)?.ownerEmail === session.email;
  const canEditFamilyTransaction = transaction => transaction.scope === 'family'
    ? !!familyMemberOf(transaction.familyId) && (canManageFamily(transaction.familyId) || transaction.owner === session.email)
    : transaction.owner === session.email;
  const canDeleteFamilyTransaction = transaction => transaction.scope === 'family'
    ? !!familyMemberOf(transaction.familyId) && (canManageFamily(transaction.familyId) || transaction.owner === session.email)
    : transaction.owner === session.email;
  const canViewTransaction = transaction => isAdmin || (transaction.scope === 'family'
    ? !!familyMemberOf(transaction.familyId)
    : transaction.owner === session.email);
  const myFamilyMemberships = () => db.familyMembers.filter(m => m.userEmail === session.email && m.status === 'ACTIVE');
  const familyScopeOptions = () => { const list = myFamilyMemberships().map(m => { const family = familyOf(m.familyId); return family ? [m.familyId, family.name] : null; }).filter(Boolean); return [['personal', 'Cá nhân'], ...list]; };
  const transactionMemberOptions = () => S.scopeFilter && S.scopeFilter !== 'personal'
    ? familyMembersOf(S.scopeFilter).map(member => [member.userEmail, uname(member.userEmail)])
    : [];
  const activeFamilyId = () => myFamilyMemberships().some(member => member.familyId === S.familyId)
    ? S.familyId : (myFamilyMemberships()[0] || {}).familyId || '';
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
  const catOpts = (sel, ph, type, extraCategories = [], scope = 'personal', familyId = '') => {
    const eligible = scope === 'all' && isAdmin ? db.cats.filter(category => !category.hidden) : visCats(scope, familyId);
    const categories = [...new Map([...eligible, ...extraCategories.filter(Boolean)].filter(category =>
      (!type || category.type === type) && (!db.cats.some(child => child.parentId === category.id && !child.hidden) || category.id === sel))
      .map(category => [category.id, category])).values()], groups = new Map();
    categories.forEach(c => { const section = categorySection(c); if (!groups.has(section)) groups.set(section, []); groups.get(section).push(c); });
    const order = [...CATEGORY_SECTIONS.map(s => s.name), 'Thu nhập', 'Danh mục của tôi', 'Danh mục khác', ...Array.from(groups.keys()).sort((a, b) => a.localeCompare(b, 'vi'))];
    return (ph !== undefined ? `<option value="">${esc(ph)}</option>` : '') + [...new Set(order)].filter(section => groups.has(section)).map(section =>
      `<optgroup label="${esc(section)}">${groups.get(section).map(c => `<option value="${esc(c.id)}"${c.id === sel ? ' selected' : ''}>${esc(catLabel(c))}</option>`).join('')}</optgroup>`).join('');
  };
  const TYPES = [['in', 'Thu'], ['out', 'Chi']];
  const TRANSACTION_TYPES = [...TYPES, ['transfer', 'Chuyển ví']];
  const ACCOUNT_TYPES = [['cash', 'Tiền mặt'], ['bank', 'Ngân hàng'], ['wallet', 'Ví điện tử']];
  const LEGACY_ACCOUNT_TYPES = { cash: 'cash', bank_account: 'bank', e_wallet: 'wallet' };
  const accountLabel = value => db.accounts.find(a => a.id === value)?.name || ACCOUNT_TYPES.find(([key]) => key === LEGACY_ACCOUNT_TYPES[value])?.[1] || 'Chưa chọn';
  const accountIsFamily = account => account.scope === 'family' && !!account.familyId;
  const accountCanUse = account => accountIsFamily(account)
    ? db.familyMembers.some(member => member.familyId === account.familyId && member.userEmail === session.email && member.status === 'ACTIVE')
    : account.owner === session.email;
  const sortAccounts = accounts => accounts.slice().sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name, 'vi'));
  const myAccounts = () => sortAccounts(db.accounts.filter(a => !a.hidden && !accountIsFamily(a) && a.owner === session.email));
  const familyAccounts = familyId => sortAccounts(db.accounts.filter(account => !account.hidden && accountIsFamily(account) && account.familyId === familyId && accountCanUse(account)));
  const visibleAccounts = () => sortAccounts(db.accounts.filter(account => accountCanUse(account) && !account.goalId));
  const transactionAccounts = (scope, familyId) => scope === 'family' ? familyAccounts(familyId) : myAccounts();
  const updateTransactionAccountOptions = form => {
    if (!form) return;
    const scope = form.querySelector('input[name="scope"]:checked')?.value || form.querySelector('input[name="scope"][type="hidden"]')?.value || 'personal';
    const familyId = form.querySelector('#familyId')?.value || form.querySelector('input[name="familyId"][type="hidden"]')?.value || activeFamilyId();
    const accounts = transactionAccounts(scope, familyId);
    ['account', 'fromAccount', 'toAccount'].forEach(name => {
      const select = form.elements.namedItem(name);
      if (!select || select.tagName !== 'SELECT') return;
      const current = select.value;
      const oldAccount = db.accounts.find(account => account.id === current && accountCanUse(account)
        && accountIsFamily(account) === (scope === 'family') && (!accountIsFamily(account) || account.familyId === familyId));
      if (oldAccount && !accounts.some(account => account.id === oldAccount.id)) accounts.push(oldAccount);
      const placeholder = name === 'toAccount' ? 'Chọn ví nhận' : name === 'fromAccount' ? 'Chọn ví nguồn' : 'Chọn ví/tài khoản';
      select.innerHTML = opt(accounts.map(account => [account.id, account.name]), current, placeholder);
    });
    const familyFields = form.querySelector('#txFamilyFields');
    if (familyFields) familyFields.hidden = scope !== 'family';
    const hint = form.querySelector('#txFamilySetupHint');
    if (hint) {
      const missingWallet = scope === 'family' && !accounts.length;
      hint.hidden = !missingWallet;
      if (missingWallet) hint.textContent = '🏦 Gia đình chưa có ví quỹ chung. Hãy vào Ví / Tài khoản tiền → Thêm ví → Ví quỹ chung gia đình trước khi lưu giao dịch.';
    }
  };
  const accountTransactionDelta = (account, transaction) => {
    if (!(transaction.accountId === account.id || transaction.toAccountId === account.id || transaction.account === account.id)) return 0;
    const incoming = transaction.toAccountId === account.id;
    if (transaction.type === 'transfer') return incoming ? Number(transaction.amount || 0) : -Number(transaction.amount || 0);
    return transaction.type === 'in' ? Number(transaction.amount || 0) : transaction.type === 'out' ? -Number(transaction.amount || 0) : 0;
  };
  const accountBalance = account => {
    const transactionBalance = db.tx.filter(transaction => accountIsFamily(account)
      ? transaction.scope === 'family' && transaction.familyId === account.familyId
      : transaction.owner === account.owner && transaction.scope !== 'family')
      .reduce((balance, transaction) => balance + accountTransactionDelta(account, transaction), 0);
    const adjustments = db.accountAdjustments.filter(adjustment => adjustment.accountId === account.id)
      .reduce((balance, adjustment) => balance + Number(adjustment.delta || 0), 0);
    return Number(account.openingBalance || 0) + transactionBalance + adjustments;
  };
  const accountLedger = account => {
    const events = [{ id: `${account.id}-opening`, date: '0000-01-01', label: 'Số dư đầu kỳ', amount: Number(account.openingBalance || 0), kind: 'opening' }];
    db.tx.filter(transaction => accountIsFamily(account)
      ? transaction.scope === 'family' && transaction.familyId === account.familyId
      : transaction.owner === account.owner && transaction.scope !== 'family')
      .forEach(transaction => {
        const delta = accountTransactionDelta(account, transaction);
        if (!delta) return;
        events.push({ id: transaction.id, date: transaction.date, label: transaction.type === 'transfer' ? (delta > 0 ? `Nhận chuyển khoản · ${accountLabel(transaction.accountId)}` : `Chuyển đến ${accountLabel(transaction.toAccountId)}`) : `${transaction.type === 'in' ? 'Thu nhập' : 'Chi tiêu'}${transaction.note ? ` · ${transaction.note}` : ''}`, amount: delta, kind: transaction.type });
      });
    db.accountAdjustments.filter(adjustment => adjustment.accountId === account.id).forEach(adjustment =>
      events.push({ id: adjustment.id, date: adjustment.createdAt, label: `Đối soát${adjustment.note ? ` · ${adjustment.note}` : ''}`, amount: Number(adjustment.delta || 0), kind: 'adjustment' }));
    let balance = 0;
    return events.sort((a, b) => (a.date || '').localeCompare(b.date || '')).map(event => {
      balance += event.amount;
      return { ...event, balanceAfter: balance };
    }).reverse();
  };
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
      db.accounts.push({ id: uid(), owner: session.email, name, type, openingBalance: 0, scope: 'personal', hidden: false, note: '', createdAt: new Date().toISOString() });
      accountsChanged = true;
    });
    db.accounts.filter(account => account.owner === session.email && !account.scope).forEach(account => {
      account.scope = 'personal';
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
  const receiptData = receipt => {
    if (!receipt || typeof receipt.data !== 'string' || typeof receipt.type !== 'string') return '';
    const allowed = receipt.type === 'application/pdf' || /^image\/(jpeg|png|gif|webp|heic|heif)$/i.test(receipt.type);
    return allowed && receipt.data.startsWith(`data:${receipt.type};base64,`) ? receipt.data : '';
  };
  const formatTimestamp = value => { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString('vi-VN') : '—'; };
  function field(id, label, icon, o = {}) {
    const tag = o.tag || 'input', st = icon.startsWith('s-');
    const el = tag === 'select' ? `<select id="${id}" name="${id}" ${o.attr || ''}>${o.opts}</select>`
      : tag === 'textarea' ? `<textarea id="${id}" name="${id}" placeholder=" " rows="2" ${o.attr || ''}>${esc(o.val)}</textarea>`
      : `<input id="${id}" name="${id}" type="${o.type || 'text'}" placeholder=" " value="${esc(o.val)}" ${o.attr || ''}>`;
    const fl = tag === 'select' || ['date', 'month', 'color'].includes(o.type) ? ' fl' : '';
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
  const familyBudgets = (familyId, month) => db.budgets.filter(b => b.scope === 'family'
    && b.familyId === familyId && (!month || b.month === month));
  const budgetStatus = (spent, amount) => {
    const ratio = Number(amount) > 0 ? Number(spent || 0) / Number(amount) : 0;
    return ratio > 1 ? 'over' : ratio >= 1 ? 'exhausted' : ratio >= .8 ? 'warn' : 'ok';
  };
  const syncRecurringTransactions = () => {
    const currentMonth = monthNow(), currentDay = Number(today().slice(8, 10));
    const additions = [];
    db.tx.filter(transaction => transaction.recurrence === 'monthly' && !transaction.recurringSource && transaction.type !== 'transfer')
      .forEach(template => {
        let period = shiftMonth(template.date.slice(0, 7), 1);
        while (period <= currentMonth) {
          const day = Number(template.date.slice(8, 10));
          if (period === currentMonth && currentDay < day) break;
          const exists = template.skippedRecurringPeriods?.includes(period)
            || db.tx.some(transaction => transaction.recurringSource === template.id && transaction.recurrencePeriod === period);
          if (!exists) {
            const lastDay = new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)), 0).getDate();
            additions.push({ ...template, id: uid(), date: `${period}-${String(Math.min(day, lastDay)).padStart(2, '0')}`,
              recurrence: 'monthly', recurringSource: template.id, recurrencePeriod: period,
              receipt: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
          }
          period = shiftMonth(period, 1);
        }
      });
    if (!additions.length) return;
    const next = [...db.tx, ...additions];
    try {
      write(TX_KEY, next);
      db.tx = next;
      additions.forEach(transaction => recordNotification(transaction.owner, `recurring:${transaction.id}`, 'recurring',
        'Đã tạo giao dịch định kỳ', `${transaction.note || cname(transaction)} · ${money(transaction.amount)} · ${fdate(transaction.date)}.`));
    } catch (error) {
      console.error('Unable to generate recurring transactions', error);
      toast('Không thể tạo giao dịch định kỳ. Hãy kiểm tra dung lượng lưu trữ của trình duyệt.', 4200);
    }
  };
  const myGoals = () => db.goals.filter(g => g.owner === session.email);
  const goalSaved = goal => {
    const savingsAccount = db.accounts.find(account => account.id === goal.accountId && account.goalId === goal.id);
    return savingsAccount ? accountBalance(savingsAccount) : Number(goal.saved || 0);
  };
  const goalMovements = goal => goal.accountId ? db.tx.filter(transaction => transaction.owner === goal.owner
    && transaction.type === 'transfer' && [transaction.accountId, transaction.toAccountId].includes(goal.accountId))
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || '')) : [];
  const ensureGoalAccount = goal => {
    let account = db.accounts.find(item => item.id === goal.accountId && item.goalId === goal.id);
    if (account) return account;
    account = { id: uid(), owner: goal.owner, goalId: goal.id, name: `Tiết kiệm · ${goal.name}`, type: 'bank',
      openingBalance: Number(goal.saved || 0), scope: 'personal', hidden: true, note: 'Ví nội bộ của mục tiêu tiết kiệm',
      createdAt: new Date().toISOString() };
    const previousGoals = db.goals.map(item => ({ ...item })), previousAccounts = db.accounts.map(item => ({ ...item }));
    db.accounts = [...db.accounts, account];
    goal.accountId = account.id;
    try {
      saveAccounts(); saveGoals();
      return account;
    } catch (error) {
      db.goals = previousGoals; db.accounts = previousAccounts;
      console.error('Unable to create savings goal account', error);
      toast('Không thể thiết lập ví tiết kiệm. Vui lòng thử lại.', 3800);
      return null;
    }
  };
  const budgetSpent = b => db.tx.filter(t => t.scope !== 'family' && t.owner === b.owner
    && t.type === 'out' && t.catId === b.catId && t.date.startsWith(b.month))
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const familyBudgetSpent = b => db.tx.filter(t => t.scope === 'family' && t.familyId === b.familyId
    && t.type === 'out' && t.catId === b.catId && t.date.startsWith(b.month))
    .reduce((s, t) => s + Number(t.amount || 0), 0);
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
  const txCsv = l => [['STT', ...(isAdmin ? ['Người dùng'] : []), 'Loại', 'Số tiền', 'Danh mục / Ví nhận', 'Ngày', 'Ví / Tài khoản', 'Phương thức thanh toán', 'Mô tả', 'Định kỳ', 'Chứng từ'],
    ...l.map((t, i) => [i + 1, ...(isAdmin ? [uname(t.owner)] : []), t.type === 'in' ? 'Thu' : t.type === 'out' ? 'Chi' : 'Chuyển ví', t.amount, t.type === 'transfer' ? accountLabel(t.toAccountId) : cname(t), fdate(t.date), accountLabel(t.accountId || t.account), paymentLabel(t.paymentMethod), t.note || '', t.recurrence === 'monthly' ? 'Hàng tháng' : '', t.receipt ? 'Có' : ''])];

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
      <div><dt>${t.type === 'transfer' ? 'Chuyển từ → đến' : 'Danh mục'}</dt><dd>${t.type === 'transfer' ? `${esc(accountLabel(t.accountId))} → ${esc(accountLabel(t.toAccountId))}` : esc(cname(t))}</dd></div><div><dt>Số tiền</dt><dd>${money(t.amount)}</dd></div><div><dt>Ngày</dt><dd>${fdate(t.date)}</dd></div>
      </dl><div class="actions"><button class="btn-ghost-d" value="x">HỦY</button><button class="btn-danger" value="ok">${ic('s-trash', 1)}XÓA</button></div>`);
  }
  function toast(m, ms = 2400, action = null) {
    const t = $('#toast'), message = document.createElement('span');
    message.textContent = m;
    t.replaceChildren(message);
    if (action) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'toast-action'; button.textContent = action.label;
      button.addEventListener('click', () => { t.classList.remove('show'); action.run(); }, { once: true });
      t.appendChild(button);
    }
    t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), ms);
  }
  let undoTransactions = [], undoRecurringSkips = [], undoTimeout;
  const deleteTransactionsWithUndo = transactions => {
    const unique = [...new Map(transactions.map(transaction => [transaction.id, transaction])).values()];
    const deleted = unique.map(transaction => ({ transaction, index: db.tx.findIndex(item => item.id === transaction.id) }))
      .filter(item => item.index >= 0);
    if (!deleted.length) return;
    const ids = new Set(deleted.map(item => item.transaction.id));
    const recurringSkips = deleted.filter(item => item.transaction.recurringSource && item.transaction.recurrencePeriod)
      .map(item => ({ sourceId: item.transaction.recurringSource, period: item.transaction.recurrencePeriod }));
    const next = db.tx.filter(transaction => !ids.has(transaction.id));
    recurringSkips.forEach(({ sourceId, period }) => {
      const index = next.findIndex(transaction => transaction.id === sourceId);
      if (index < 0) return;
      const source = { ...next[index] };
      source.skippedRecurringPeriods = [...new Set([...(source.skippedRecurringPeriods || []), period])];
      next[index] = source;
    });
    try {
      write(TX_KEY, next);
      db.tx = next;
    } catch (error) {
      console.error('Unable to delete transactions', error);
      toast('Không thể xóa giao dịch. Vui lòng thử lại.', 3600);
      return;
    }
    undoTransactions = deleted; undoRecurringSkips = recurringSkips;
    clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => { undoTransactions = []; undoRecurringSkips = []; }, 8000);
    refreshRows();
    toast(`Đã xóa ${deleted.length} giao dịch`, 8000, { label: 'Hoàn tác', run: () => {
      const restored = new Set(undoTransactions.map(item => item.transaction.id));
      const nextTransactions = db.tx.slice();
      undoTransactions.slice().sort((a, b) => a.index - b.index).forEach(item => {
        if (nextTransactions.some(transaction => transaction.id === item.transaction.id)) return;
        nextTransactions.splice(Math.min(item.index, nextTransactions.length), 0, item.transaction);
      });
      undoRecurringSkips.forEach(({ sourceId, period }) => {
        const index = nextTransactions.findIndex(transaction => transaction.id === sourceId);
        if (index < 0) return;
        const source = { ...nextTransactions[index] };
        source.skippedRecurringPeriods = (source.skippedRecurringPeriods || []).filter(item => item !== period);
        if (!source.skippedRecurringPeriods.length) delete source.skippedRecurringPeriods;
        nextTransactions[index] = source;
      });
      try {
        write(TX_KEY, nextTransactions);
        db.tx = nextTransactions;
        clearTimeout(undoTimeout); undoTransactions = []; undoRecurringSkips = [];
        refreshRows();
        toast(`Đã khôi phục ${restored.size} giao dịch`);
      } catch (error) {
        console.error('Unable to restore deleted transactions', error);
        toast('Không thể hoàn tác. Vui lòng kiểm tra bộ nhớ trình duyệt.', 4200);
      }
    } });
  };

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

  const CATEGORY_ICONS = [['🍽️', 'Ăn uống'], ['🛒', 'Mua sắm'], ['🏠', 'Nhà cửa'], ['🚗', 'Di chuyển'], ['💊', 'Sức khỏe'], ['🎓', 'Học tập'], ['🎬', 'Giải trí'], ['💡', 'Hóa đơn'], ['💰', 'Thu nhập'], ['🎁', 'Quà tặng'], ['📦', 'Khác']];
  const canEditCat = category => isAdmin ? !category.owner : category.scope === 'family'
    ? canManageFamily(category.familyId)
    : category.owner === session.email;
  const canDelCat = category => isAdmin || (category.scope === 'family'
    ? canManageFamily(category.familyId)
    : category.owner === session.email);
  const categoryScopeOf = category => category?.scope === 'family' ? category.familyId
    : isGlobalCategory(category) ? 'global' : 'personal';
  const categoryListForPage = () => {
    const scope = S.catScope || (isAdmin ? 'global' : 'personal');
    if (isAdmin && scope === 'personal') return db.cats.filter(category => category.owner && category.scope !== 'family');
    return visCats(scope === 'global' ? 'global' : scope === 'personal' ? 'personal' : 'family',
      ['global', 'personal'].includes(scope) ? '' : scope, true);
  };
  const categoryCanUse = (category, scope, familyId) => !!category && (isGlobalCategory(category) ||
    (category.scope === 'family'
      ? scope === 'family' && category.familyId === familyId && (isAdmin || !!familyMemberOf(familyId))
      : scope === 'personal' && (isAdmin || category.owner === session.email)));
  const catPage = () => {
    const e = db.cats.find(category => category.id === S.editCat && canEditCat(category)) || {};
    const memberships = myFamilyMemberships();
    // Quản trị viên quản lý danh mục cho các gia đình đã tồn tại, dù không là thành viên.
    const families = isAdmin ? db.families.map(family => [family.id, family.name])
      : memberships.filter(member => canManageFamily(member.familyId)).map(member => [member.familyId, familyOf(member.familyId)?.name || 'Gia đình']);
    const visibleFamilies = isAdmin ? db.families.map(family => [family.id, family.name])
      : memberships.map(member => [member.familyId, familyOf(member.familyId)?.name || 'Gia đình']);
    const selectedScope = S.catScope || (isAdmin ? 'global' : 'personal');
    const categoryScope = e.id ? categoryScopeOf(e) : (families.some(([id]) => id === selectedScope)
      ? selectedScope : isAdmin ? 'global' : 'personal');
    const familyId = ['personal', 'global'].includes(categoryScope) ? '' : categoryScope;
    const initialFamilyId = families.some(([id]) => id === familyId) ? familyId : (families[0]?.[0] || '');
    const candidates = visCats(categoryScope === 'global' ? 'global' : categoryScope === 'personal' ? 'personal' : 'family', familyId)
      .filter(category => categoryScopeOf(category) === categoryScope && category.type === (e.type || 'out') && !category.parentId && category.id !== e.id);
    const used = db.tx.some(transaction => transaction.catId === e.id);
    return `<div class="category-page">
      <form class="card category-form" data-f="cat" novalidate>
        <div class="category-form-heading"><div><span class="dashboard-eyebrow">${e.id ? 'CHỈNH SỬA CẤU TRÚC' : 'TÙY CHỈNH DANH MỤC'}</span><h2 class="card-title">${e.id ? 'CẬP NHẬT DANH MỤC' : 'TẠO DANH MỤC'}</h2></div><span class="category-preview" id="categoryPreview" style="--category-color:${categoryColor(e)}">${esc(e.icon || '📦')}<b>${esc(e.name || 'Tên danh mục')}</b></span></div>
        <div class="grid2">${field('cname', 'Tên danh mục', 'i-layer-group', { val: e.name, attr: 'maxlength="60"' })}${field('ctype', 'Phân loại', 's-swap', { tag: 'select', opts: opt(TYPES, e.type || 'out') })}</div>
        ${e.id ? `<input type="hidden" name="categoryScope" value="${esc(categoryScope === 'global' ? 'global' : categoryScope === 'personal' ? 'personal' : 'family')}"><input type="hidden" name="categoryFamilyId" value="${esc(familyId)}"><p class="category-scope-hint">Phạm vi danh mục không đổi sau khi tạo.${used ? ' Đang được giao dịch tham chiếu; lịch sử vẫn giữ nguyên.' : ''}</p>` : `<div class="grid2">${field('categoryScope', 'Phạm vi', 'i-users', { tag: 'select', opts: opt(isAdmin ? [['global', '🌐 Danh mục chung (cá nhân + gia đình)'], ...(families.length ? [['family', '🏠 Danh mục riêng một gia đình']] : [])] : [['personal', '🔒 Danh mục cá nhân'], ...(families.length ? [['family', '🏠 Danh mục gia đình']] : [])], categoryScope === 'personal' ? 'personal' : categoryScope === 'global' ? 'global' : 'family') })}<div id="categoryFamilyField"${categoryScope === 'personal' || categoryScope === 'global' ? ' hidden' : ''}>${field('categoryFamilyId', 'Gia đình áp dụng', 'i-users', { tag: 'select', opts: opt(families, initialFamilyId, 'Chọn gia đình') })}</div></div><div class="category-scope-help" id="categoryScopeHelp">🌐 Danh mục chung sử dụng được trong giao dịch cá nhân và gia đình. 🏠 Danh mục riêng chỉ dùng trong gia đình được chọn; giao dịch gia đình cần ví quỹ chung.</div>`}
        <div class="grid2"><div class="field"><label for="cicon">Biểu tượng</label><select id="cicon" name="cicon">${CATEGORY_ICONS.map(([icon, label]) => `<option value="${esc(icon)}"${(e.icon || '📦') === icon ? ' selected' : ''}>${icon} ${esc(label)}</option>`).join('')}</select><span class="err-slot"><span class="error"><span></span></span></span></div>${field('ccolor', 'Màu sắc', 'i-layer-group', { type: 'color', val: categoryColor(e), attr: 'class="category-color-input"' })}</div>
        ${field('cparent', 'Danh mục cha (không bắt buộc)', 'i-layer-group', { tag: 'select', opts: opt(candidates.map(category => [category.id, categoryName(category)]), e.parentId || '', 'Không có · danh mục cấp cao') })}
        ${field('cnote', 'Mô tả', 'i-receipt', { val: e.note, attr: 'maxlength="240"' })}
        <div class="category-form-note">Mỗi giao dịch chỉ gắn với một danh mục con/cụ thể. Thống kê tính theo mã danh mục của giao dịch, không cộng thêm lần nữa vào danh mục cha.</div>
        <div class="actions">${!isAdmin || e.id ? '<button type="button" class="btn-ghost-d" data-act="cancel">HỦY</button>' : ''}<button class="btn-primary">${e.id ? 'LƯU THAY ĐỔI' : 'TẠO DANH MỤC'}</button></div>
      </form>
      <div class="card category-list-card"><div class="category-list-heading"><div><span class="dashboard-eyebrow">THƯ VIỆN DANH MỤC</span><h2 class="card-title">${isAdmin ? 'QUẢN LÝ DANH MỤC THEO PHẠM VI' : 'DANH MỤC CỦA BẠN'}</h2></div><select id="catScope" class="family-filter" data-live aria-label="Lọc danh mục theo phạm vi">${opt(isAdmin ? [['global', '🌐 Danh mục chung'], ['personal', 'Danh mục cá nhân'], ...visibleFamilies.map(([id, name]) => [id, `🏠 Gia đình · ${name}`])] : [['personal', 'Cá nhân + danh mục chung'], ...visibleFamilies.map(([id, name]) => [id, `Gia đình · ${name}`])], S.catScope || (isAdmin ? 'global' : 'personal'))}</select></div><div id="rows" class="category-grid"></div></div>
    </div>`;
  };
  const catRows = () => {
    const categories = categoryListForPage();
    if (!categories.length) return `<div class="empty-box">${NONE}</div>`;
    return categories.map(category => {
      const children = db.cats.filter(child => child.parentId === category.id && !child.hidden);
      const parent = category.parentId ? catOf(category.parentId) : null;
      const legacyParts = !category.parentId ? categoryParts(category) : null;
      const displayName = category.parentId ? category.name : legacyParts.leaf;
      const parentLabel = parent ? categoryName(parent) : legacyParts?.family || '';
      const categoryScope = categoryScopeOf(category);
      const label = categoryScope === 'global' ? '🌐 Dùng chung cho cá nhân và gia đình'
        : categoryScope === 'personal' ? '🔒 Cá nhân' : `🏠 Gia đình · ${familyOf(category.familyId)?.name || 'Gia đình'}`;
      const kind = isAdmin && category.owner ? `${label} · ${uname(category.owner)}` : label;
      return `<article class="category-card ${category.parentId ? 'is-child' : ''} ${category.hidden ? 'is-hidden' : ''}" style="--category-color:${categoryColor(category)}">
        ${category.parentId ? '<span class="category-tree-branch" aria-hidden="true">↳</span>' : ''}
        <span class="category-card-icon">${esc(category.icon || '📦')}</span><div class="category-card-copy"><div><strong>${esc(displayName)}</strong><span class="badge ${category.type}">${category.type === 'in' ? 'Thu nhập' : 'Chi tiêu'}</span>${category.hidden ? '<span class="category-hidden-tag">Đã ẩn</span>' : ''}</div>
          <small>${parentLabel ? `Thuộc ${esc(parentLabel)} · ` : ''}${esc(kind)}${children.length ? ` · ${children.length} danh mục con` : ''}</small>${category.note ? `<p>${esc(category.note)}</p>` : ''}
        </div><div class="category-card-actions">${canEditCat(category) ? `<button type="button" class="sm" data-act="editCat" data-id="${esc(category.id)}">Sửa</button><button type="button" class="sm" data-act="${category.hidden ? 'showCat' : 'hideCat'}" data-id="${esc(category.id)}">${category.hidden ? 'Hiện' : 'Ẩn'}</button>` : isAdmin && !category.owner ? '<span class="badge admin">Mặc định</span>' : category.scope === 'family' && !canManageFamily(category.familyId) ? '<span class="badge admin">Chỉ xem</span>' : ''}${canDelCat(category) ? `<button type="button" class="sm red" data-act="delCat" data-id="${esc(category.id)}">Xóa</button>` : ''}</div></article>`;
    }).join('');
  };
  const updateCategoryParentOptions = form => {
    const parentSelect = form?.elements.cparent;
    if (!parentSelect) return;
    const categoryScope = form.elements.categoryScope?.value || (S.editCat ? categoryScopeOf(catOf(S.editCat)) : 'personal');
    const familyId = categoryScope === 'family' ? (form.elements.categoryFamilyId?.value || catOf(S.editCat)?.familyId || '') : '';
    const type = form.elements.ctype?.value || 'out';
    const current = parentSelect.value || catOf(S.editCat)?.parentId || '';
    const candidates = visCats(categoryScope === 'family' ? 'family' : categoryScope === 'global' ? 'global' : 'personal', familyId, true)
      .filter(category => categoryScopeOf(category) === (categoryScope === 'family' ? familyId : categoryScope)
        && !category.parentId && category.type === type && category.id !== S.editCat
        && (!category.hidden || category.id === current));
    const currentValid = candidates.some(category => category.id === current);
    parentSelect.innerHTML = opt(candidates.map(category => [category.id, categoryName(category)]), currentValid ? current : '', 'Không có · danh mục cấp cao');
  };
  const updateTransactionCategoryOptions = form => {
    const category = form?.elements.cat;
    if (!category) return;
    const scope = form.elements.scope?.value === 'family' ? 'family' : 'personal';
    const familyId = scope === 'family' ? (form.elements.familyId?.value || activeFamilyId()) : '';
    const editing = db.tx.find(transaction => transaction.id === S.editTx);
    category.innerHTML = catOpts(category.value, 'Chọn danh mục', form.elements.type?.value || 'out', [editing && catOf(editing.catId)], scope, familyId);
  };

  const filterTx = () => {
    const q = (S.q || '').toLowerCase();
    const f = isAdmin ? { u: S.au, t: S.at, c: S.ac, from: S.af, to: S.ae } : { t: S.ft, c: S.fc, from: S.fd, to: S.td };
    const k = S.sk || 'date', d = (S.sd || 'desc') === 'asc' ? 1 : -1;
    return myTx().filter(t => (!q || ((t.note || '') + ' ' + (t.description || '') + ' ' + cname(t) + ' ' + t.amount + ' ' + Number(t.amount).toLocaleString('vi-VN') + ' ' + accountLabel(t.accountId || t.account) + ' ' + accountLabel(t.toAccountId) + ' ' + paymentLabel(t.paymentMethod) + ' ' + uname(t.owner)).toLowerCase().includes(q)) && (!f.u || t.owner === f.u) && (!f.t || t.type === f.t) &&
      (!f.c || t.catId === f.c) && (!S.fp || isAdmin || t.paymentMethod === S.fp) && (!S.fw || (t.accountId || t.account) === S.fw || t.toAccountId === S.fw) &&
      (!S.fm || t.owner === S.fm) && (!S.fmin || Number(t.amount) >= Number(S.fmin)) && (!S.fmax || Number(t.amount) <= Number(S.fmax)) &&
      (!f.from || t.date >= f.from) && (!f.to || t.date <= f.to))
      .sort((a, b) => d * (k === 'amount' ? a.amount - b.amount : a.date.localeCompare(b.date)));
  };
  const txSummary = () => { const list = filterTx(); return `<div class="stats tx-summary">${stat('Giao dịch', list.length, 'i-receipt', n => n)}${stat('Tổng thu', sum(list, 'in'), 'i-coins')}${stat('Tổng chi', sum(list, 'out'), 'i-piggy-bank')}${stat('Chuyển ví nội bộ', list.filter(transaction => transaction.type === 'transfer').length, 'i-wallet', n => n)}${stat('Chênh lệch thu chi', sum(list, 'in') - sum(list, 'out'), 'i-wallet')}</div>`; };
  const txRows = () => {
    const pl = paged(filterTx()); PAGE_IDS = pl.map(t => t.id);
    return pl.map((t, i) => `<tr>${isAdmin ? '' : `<td><input type="checkbox" class="chk" data-act="selTx" data-id="${esc(t.id)}" aria-label="Chọn giao dịch" ${(S.sel || []).includes(t.id) ? 'checked' : ''}></td>`}<td>${PG.off + i + 1}</td>${isAdmin ? `<td>${esc(uname(t.owner))}</td>` : ''}<td><span class="badge ${t.type}">${t.type === 'in' ? 'Thu' : t.type === 'out' ? 'Chi' : 'Chuyển ví'}</span></td>
      <td class="${t.type === 'in' ? 'inc' : t.type === 'out' ? 'exp' : ''}">${money(t.amount)}</td><td>${t.type === 'transfer' ? `Chuyển đến ${esc(accountLabel(t.toAccountId))}` : esc(cname(t))}</td><td>${fdate(t.date)}</td><td>${esc(accountLabel(t.accountId || t.account))}</td><td>${esc(paymentLabel(t.paymentMethod))}</td><td class="desc">${esc(t.note) || '—'}${t.scope === 'family' ? '<small class="family-shared-label">Dùng chung</small>' : ''}${t.receipt ? ' · Có chứng từ' : ''}${t.recurrence === 'monthly' ? ' · Hàng tháng' : ''}</td>
      <td><div class="cell-act"><button class="sm" data-act="viewTx" data-id="${esc(t.id)}" aria-label="Xem chi tiết giao dịch">${ic('i-eye')}Xem</button>${!isAdmin && canEditFamilyTransaction(t) ? `<button class="sm" data-act="editTx" data-id="${esc(t.id)}">${ic('i-pen-to-square')}Sửa</button>` : ''}${!isAdmin && t.owner === session.email ? `<button class="sm" data-act="copyTx" data-id="${esc(t.id)}">Sao chép</button>` : ''}${(isAdmin || canDeleteFamilyTransaction(t)) ? `<button class="sm red" data-act="delTx" data-id="${esc(t.id)}">${ic('s-trash', 1)}Xóa</button>` : ''}</div></td></tr>`).join('') || emptyRow(10);
  };
  const miniTable = l => `<div class="wrap"><table><thead><tr><th>Loại</th><th>Số tiền</th><th>Danh mục / Ví nhận</th><th>Ngày</th><th>Mô tả</th></tr></thead><tbody>${l.map(t =>
    `<tr><td><span class="badge ${t.type}">${t.type === 'in' ? 'Thu' : t.type === 'out' ? 'Chi' : 'Chuyển ví'}</span></td><td class="${t.type === 'in' ? 'inc' : t.type === 'out' ? 'exp' : ''}">${money(t.amount)}</td><td>${t.type === 'transfer' ? `Chuyển đến ${esc(accountLabel(t.toAccountId))}` : esc(cname(t))}</td><td>${fdate(t.date)}</td><td class="desc">${esc(t.note) || '—'}</td></tr>`).join('') || emptyRow(5)}</tbody></table></div>`;
  const recent = (l, n = 5) => l.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);

  /* ----- Báo cáo ----- */
  const REPORT_PERIODS = [['day', 'Ngày'], ['week', 'Tuần'], ['month', 'Tháng'], ['quarter', 'Quý'], ['year', 'Năm'], ['custom', 'Khoảng tùy chọn'], ['all', 'Toàn bộ thời gian']];
  const reportDate = (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const validReportDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const [year, month, day] = value.split('-').map(Number);
    return reportDate(year, month, day) === value && month >= 1 && month <= 12 && day >= 1 && day <= new Date(year, month, 0).getDate();
  };
  const reportShiftDate = (value, days) => {
    const [year, month, day] = value.split('-').map(Number), date = new Date(year, month - 1, day + days);
    return reportDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };
  const reportRange = (period, anchor = today()) => {
    const [year, month, day] = anchor.split('-').map(Number);
    if (period === 'all') return ['', ''];
    if (period === 'day') return [anchor, anchor];
    if (period === 'week') {
      const weekday = new Date(year, month - 1, day).getDay(), offset = weekday === 0 ? -6 : 1 - weekday;
      const start = reportShiftDate(anchor, offset);
      return [start, reportShiftDate(start, 6)];
    }
    if (period === 'quarter') {
      const firstMonth = Math.floor((month - 1) / 3) * 3 + 1;
      return [reportDate(year, firstMonth, 1), reportDate(year, firstMonth + 2, new Date(year, firstMonth + 2, 0).getDate())];
    }
    if (period === 'year') return [reportDate(year, 1, 1), reportDate(year, 12, 31)];
    if (period === 'month') return [reportDate(year, month, 1), reportDate(year, month, new Date(year, month, 0).getDate())];
    return ['', ''];
  };
  const reportFamilyOptions = () => isAdmin
    ? db.families.map(family => [family.id, family.name])
    : myFamilyMemberships().map(member => familyOf(member.familyId)).filter(Boolean).map(family => [family.id, family.name]);
  const reportScopeOptions = () => isAdmin
    ? [['all', 'Toàn hệ thống'], ['personal', 'Giao dịch cá nhân'], ...reportFamilyOptions().map(([id, name]) => [id, `Gia đình · ${name}`])]
    : [['personal', 'Cá nhân'], ...reportFamilyOptions().map(([id, name]) => [id, `Gia đình · ${name}`])];
  const reportAccounts = (scope = S.reportScope || (isAdmin ? 'all' : 'personal')) => {
    const accounts = scope === 'all' ? db.accounts : scope === 'personal' ? (isAdmin
      ? db.accounts.filter(account => !accountIsFamily(account)) : myAccounts())
      : isAdmin ? db.accounts.filter(account => accountIsFamily(account) && account.familyId === scope)
        : familyAccounts(scope);
    return accounts.filter(account => isAdmin || accountCanUse(account));
  };
  const reportBaseTransactions = () => {
    const scope = S.reportScope || (isAdmin ? 'all' : 'personal');
    if (isAdmin) return db.tx.filter(transaction => scope === 'all'
      || (scope === 'personal' ? transaction.scope !== 'family' : transaction.scope === 'family' && transaction.familyId === scope));
    if (scope === 'personal') return db.tx.filter(transaction => transaction.owner === session.email && transaction.scope !== 'family');
    if (!myFamilyMemberships().some(member => member.familyId === scope)) return [];
    return db.tx.filter(transaction => transaction.scope === 'family' && transaction.familyId === scope);
  };
  const reportList = (start = S.rf, end = S.rt, filters = true) => reportBaseTransactions().filter(transaction =>
    (!start || transaction.date >= start) && (!end || transaction.date <= end)
    && (!filters || !S.rc || transaction.catId === S.rc)
    && (!filters || !S.rty || transaction.type === S.rty)
    && (!filters || !S.ru || transaction.owner === S.ru)
    && (!filters || !S.rmember || transaction.owner === S.rmember)
    && (!filters || !S.raccount || transaction.accountId === S.raccount || transaction.toAccountId === S.raccount || transaction.account === S.raccount));
  const reportPage = () => {
    if (!S.rperiod) S.rperiod = 'month';
    if (!S.rf && !S.rt) [S.rf, S.rt] = reportRange(S.rperiod);
    if (!S.reportScope) S.reportScope = isAdmin ? 'all' : 'personal';
    const scope = S.reportScope, familyScope = scope !== 'personal' && scope !== 'all';
    const familyMembers = familyScope ? familyMembersOf(scope).map(member => [member.userEmail, uname(member.userEmail)]) : [];
    const categoryScope = familyScope ? 'family' : isAdmin ? 'all' : 'personal';
    const categories = categoryScope === 'family' ? catOpts(S.rc, 'Tất cả', undefined, [], 'family', scope)
      : catOpts(S.rc, 'Tất cả', undefined, [], categoryScope);
    return `<div class="report-page">
      <form class="card report-filter-card noprint" data-f="report" novalidate>
        <div class="report-title-row"><div><span class="dashboard-eyebrow">PHÂN TÍCH DÒNG TIỀN</span><h2 class="card-title">${isAdmin ? 'BÁO CÁO HỆ THỐNG' : 'BÁO CÁO TÀI CHÍNH'}</h2></div><span class="report-update-pill">${ic('i-chart-pie')} Dữ liệu cục bộ · ${reportBaseTransactions().length} giao dịch</span></div>
        <div class="report-filter-grid">
          ${field('rperiod', 'Kỳ báo cáo', 's-cal', { tag: 'select', opts: opt(REPORT_PERIODS, S.rperiod) })}
          ${field('reportScope', 'Phạm vi báo cáo', 'i-users', { tag: 'select', opts: opt(reportScopeOptions(), scope) })}
          <div id="reportStartField">${field('rf', 'Từ ngày', 's-cal', { type: 'date', val: S.rf })}</div><div id="reportEndField">${field('rt', 'Đến ngày', 's-cal', { type: 'date', val: S.rt })}</div>
          ${field('raccount', 'Ví / tài khoản', 'i-wallet', { tag: 'select', opts: opt(reportAccounts().map(account => [account.id, `${account.name}${accountIsFamily(account) ? ' · Quỹ chung' : ''}`]), S.raccount, 'Tất cả ví') })}
          ${familyScope ? field('rmember', 'Thành viên', 'i-users', { tag: 'select', opts: opt(familyMembers, S.rmember, 'Tất cả thành viên') }) : isAdmin && scope === 'all' ? field('ru', 'Người dùng', 'i-users', { tag: 'select', opts: opt(db.users.map(user => [user.email, user.name]), S.ru, 'Tất cả người dùng') }) : ''}
          ${field('rty', 'Loại giao dịch', 's-swap', { tag: 'select', opts: opt(TRANSACTION_TYPES, S.rty, 'Tất cả loại') })}
          ${field('rc', 'Danh mục', 'i-layer-group', { tag: 'select', opts: categories })}
        </div>
        <div class="report-filter-actions"><div class="report-quick-ranges"><button type="button" class="sm" data-act="repRange" data-id="day">Hôm nay</button><button type="button" class="sm" data-act="repRange" data-id="week">Tuần này</button><button type="button" class="sm" data-act="repRange" data-id="month">Tháng này</button><button type="button" class="sm" data-act="repRange" data-id="quarter">Quý này</button><button type="button" class="sm" data-act="repRange" data-id="year">Năm nay</button><button type="button" class="sm" data-act="repRange" data-id="reset">Đặt lại</button></div>
          <button class="btn-primary">${ic('i-chart-pie')}TẠO BÁO CÁO</button></div>
      </form>
      <section class="card report-result-card"><div class="card-head"><div><span class="dashboard-eyebrow">TỔNG HỢP KỲ ĐÃ CHỌN</span><h2 class="card-title">KẾT QUẢ BÁO CÁO</h2></div><div class="head-act noprint">
        <button type="button" class="sm" data-act="rv" data-id="bar">Cột</button><button type="button" class="sm" data-act="rv" data-id="pie">Tròn</button>
        <button type="button" class="sm" data-act="exportRep" data-id="xls">Excel</button><button type="button" class="sm" data-act="exportRep" data-id="csv">CSV</button><button type="button" class="sm" data-act="printRep">${ic('s-print', 1)}PDF / In</button></div></div>
        <div id="repOut">${S.rrun ? reportOut() : chartEmpty('Chọn kỳ và phạm vi, sau đó tạo báo cáo')}</div></section>
    </div>`;
  };
  const reportCategoryRows = transactions => {
    const categories = transactions.filter(transaction => ['in', 'out'].includes(transaction.type)).reduce((map, transaction) => {
      const key = `${transaction.type}:${transaction.catId || 'none'}`;
      const item = map.get(key) || { name: transaction.catId ? cname(transaction) : 'Chưa phân loại', type: transaction.type, amount: 0, count: 0 };
      item.amount += Number(transaction.amount || 0); item.count++; map.set(key, item); return map;
    }, new Map());
    return [...categories.values()].sort((a, b) => b.amount - a.amount);
  };
  const reportBudgetRows = transactions => {
    const scope = S.reportScope || (isAdmin ? 'all' : 'personal');
    const months = [];
    if (S.rf && S.rt) {
      let cursor = S.rf.slice(0, 7), last = S.rt.slice(0, 7);
      while (cursor <= last && months.length < 240) { months.push(cursor); cursor = shiftMonth(cursor, 1); }
    } else months.push(...new Set(transactions.map(transaction => transaction.date.slice(0, 7))));
    if (scope === 'personal' || (isAdmin && scope === 'all')) {
      const owners = isAdmin ? (S.ru ? [S.ru] : db.users.map(user => user.email)) : [session.email];
      if (!S.rf && !S.rt) months.push(...new Set(db.budgets.filter(budget => owners.includes(budget.owner)).map(budget => budget.month)));
      const selectedMonths = [...new Set(months)].sort();
      return db.budgets.filter(budget => owners.includes(budget.owner) && selectedMonths.includes(budget.month)
        && (!S.rc || budget.catId === S.rc)).map(budget => {
        const spent = transactions.filter(transaction => transaction.scope !== 'family' && transaction.owner === budget.owner
          && transaction.type === 'out' && transaction.date.startsWith(budget.month) && transaction.catId === budget.catId)
          .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
        return { period: budget.month, name: `${catOf(budget.catId)?.name || 'Danh mục đã xóa'}${owners.length > 1 ? ` · ${uname(budget.owner)}` : ''}`, budget: Number(budget.amount || 0), actual: spent };
      });
    }
    const family = familyOf(scope);
    if (!S.rf && !S.rt) months.push(...db.budgets.filter(budget => budget.scope === 'family' && budget.familyId === family?.id).map(budget => budget.month));
    if (!months.length && !S.rf && !S.rt) months.push(monthNow());
    const selectedMonths = [...new Set(months)];
    const familyEntries = db.budgets.filter(budget => budget.scope === 'family' && budget.familyId === family?.id
      && selectedMonths.includes(budget.month) && (!S.rc || budget.catId === S.rc));
    const rows = !S.rc && family?.monthlyBudget ? selectedMonths.map(month => {
      const actual = transactions.filter(transaction => transaction.type === 'out' && transaction.date.startsWith(month))
        .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
      return { period: month, name: 'Ngân sách gia đình', budget: Number(family.monthlyBudget), actual };
    }) : [];
    return [...rows, ...familyEntries.map(budget => {
      const actual = transactions.filter(transaction => transaction.type === 'out' && transaction.date.startsWith(budget.month)
        && transaction.catId === budget.catId).reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
      return { period: budget.month, name: `${catOf(budget.catId)?.name || 'Danh mục đã xóa'} · Ngân sách gia đình`, budget: Number(budget.amount || 0), actual };
    })];
  };
  const reportBalanceDelta = (transactions, start, end) => {
    const account = S.raccount && db.accounts.find(item => item.id === S.raccount);
    const transactionDelta = transactions.reduce((total, transaction) => {
      if (account) return total + accountTransactionDelta(account, transaction);
      if (transaction.type === 'transfer') return total;
      return total + (transaction.type === 'in' ? Number(transaction.amount || 0) : transaction.type === 'out' ? -Number(transaction.amount || 0) : 0);
    }, 0);
    return transactionDelta + db.accountAdjustments.filter(adjustment => {
      const account = db.accounts.find(item => item.id === adjustment.accountId);
      if (!account || (S.raccount && account.id !== S.raccount)
        || (S.ru && adjustment.owner !== S.ru) || (S.rmember && adjustment.owner !== S.rmember)) return false;
      const scope = S.reportScope || (isAdmin ? 'all' : 'personal');
      return scope === 'all' || (scope === 'personal' ? !accountIsFamily(account) && (isAdmin || account.owner === session.email)
        : accountIsFamily(account) && account.familyId === scope);
    }).filter(adjustment => {
      const day = (adjustment.createdAt || '').slice(0, 10);
      return (!start || day >= start) && (!end || day <= end);
    }).reduce((total, adjustment) => total + Number(adjustment.delta || 0), 0);
  };
  const reportComparison = transactions => {
    if (!S.rf || !S.rt) return [];
    const duration = Math.max(1, Math.round((new Date(`${S.rt}T00:00:00`) - new Date(`${S.rf}T00:00:00`)) / 86400000) + 1);
    const previousEnd = reportShiftDate(S.rf, -1), previousStart = reportShiftDate(previousEnd, -(duration - 1));
    const previous = reportList(previousStart, previousEnd, true);
    return [
      { label: 'Thu', current: sum(transactions, 'in'), previous: sum(previous, 'in') },
      { label: 'Chi', current: sum(transactions, 'out'), previous: sum(previous, 'out') },
      { label: 'Dòng tiền ròng', current: sum(transactions, 'in') - sum(transactions, 'out'), previous: sum(previous, 'in') - sum(previous, 'out') }
    ];
  };
  const reportTrendRows = transactions => {
    const buckets = new Map();
    const dayCount = S.rf && S.rt
      ? Math.round((new Date(`${S.rt}T00:00:00`) - new Date(`${S.rf}T00:00:00`)) / 86400000) + 1
      : Infinity;
    const byDay = ['day', 'week', 'month'].includes(S.rperiod) || (S.rperiod === 'custom' && dayCount <= 31);
    transactions.filter(transaction => ['in', 'out'].includes(transaction.type)).forEach(transaction => {
      const period = byDay ? transaction.date : transaction.date.slice(0, 7);
      const entry = buckets.get(period) || { income: 0, expense: 0 };
      entry[transaction.type === 'in' ? 'income' : 'expense'] += Number(transaction.amount || 0); buckets.set(period, entry);
    });
    return [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([period, values]) => ({
      period: byDay ? `${period.slice(8, 10)}/${period.slice(5, 7)}` : `${period.slice(5, 7)}/${period.slice(0, 4)}`,
      ...values, delta: values.income - values.expense
    }));
  };
  const reportPercentChange = (current, previous) => previous ? `${((current - previous) / Math.abs(previous) * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`
    : current ? 'Mới phát sinh' : '—';
  const reportComparisonHtml = rows => rows.length ? `<div class="wrap"><table><thead><tr><th>Chỉ số</th><th>Kỳ này</th><th>Kỳ trước</th><th>Chênh lệch</th><th>Thay đổi</th></tr></thead><tbody>${rows.map(row => {
    const delta = row.current - row.previous;
    return `<tr><td>${esc(row.label)}</td><td>${money(row.current)}</td><td>${money(row.previous)}</td><td class="${delta >= 0 ? 'inc' : 'exp'}">${delta > 0 ? '+' : ''}${money(delta)}</td><td>${reportPercentChange(row.current, row.previous)}</td></tr>`;
  }).join('')}</tbody></table></div>` : chartEmpty('Chọn khoảng ngày cụ thể để so sánh với kỳ liền trước');
  const reportTrendHtml = rows => rows.length ? `<div class="report-trend">${(() => {
    const max = Math.max(...rows.map(item => Math.max(item.income, item.expense)), 1);
    return rows.map((row, index) => {
    return `<article class="report-trend-row" style="--chart-delay:${Math.min(index, 10) * 35}ms"><span>${esc(row.period)}</span><div class="report-trend-bars"><i class="in" style="--bar-width:${Math.max(0, row.income / max * 100)}%"></i><i class="out" style="--bar-width:${Math.max(0, row.expense / max * 100)}%"></i></div><small><b class="inc">${money(row.income)}</b><b class="exp">${money(row.expense)}</b><b class="${row.delta >= 0 ? 'inc' : 'exp'}">${money(row.delta)}</b></small></article>`;
    }).join('');
  })()}<div class="report-trend-legend"><span><i class="in"></i>Thu</span><span><i class="out"></i>Chi</span><span>Dòng tiền ròng</span></div></div>` : chartEmpty('Chưa có dữ liệu xu hướng trong kỳ');
  const reportBudgetsHtml = rows => rows.length ? `<div class="wrap"><table><thead><tr><th>Kỳ</th><th>Danh mục / hạn mức</th><th>Dự kiến</th><th>Thực tế</th><th>Chênh lệch</th><th>Mức dùng</th></tr></thead><tbody>${rows.map(row => {
    const delta = row.budget - row.actual, ratio = row.budget ? Math.round(row.actual / row.budget * 100) : 0;
    return `<tr><td>${esc(row.period)}</td><td>${esc(row.name)}</td><td>${money(row.budget)}</td><td class="${ratio >= 100 ? 'exp' : ''}">${money(row.actual)}</td><td class="${delta >= 0 ? 'inc' : 'exp'}">${delta < 0 ? '-' : ''}${money(Math.abs(delta))}</td><td><span class="badge ${ratio >= 100 ? 'out' : ratio >= 80 ? 'warn' : 'ok'}">${ratio}%</span></td></tr>`;
  }).join('')}</tbody></table></div>` : chartEmpty('Chưa có ngân sách cho phạm vi và kỳ đã chọn');
  const reportExportRows = transactions => {
    const rows = [['BÁO CÁO TÀI CHÍNH'], ['Phạm vi', reportScopeOptions().find(([id]) => id === S.reportScope)?.[1] || 'Cá nhân'], ['Từ ngày', S.rf || ''], ['Đến ngày', S.rt || ''], ['Cập nhật lúc', new Date().toLocaleString('vi-VN')], [],
      ['Tổng quan', 'Số tiền'], ['Tổng thu', sum(transactions, 'in')], ['Tổng chi', sum(transactions, 'out')], ['Dòng tiền ròng', sum(transactions, 'in') - sum(transactions, 'out')], ['Biến động số dư theo giao dịch', reportBalanceDelta(transactions, S.rf, S.rt)], [],
      ['Top danh mục', 'Loại', 'Số giao dịch', 'Tổng tiền'], ...reportCategoryRows(transactions).slice(0, 5).map(row => [row.name, row.type === 'in' ? 'Thu' : 'Chi', row.count, row.amount]), [],
      ['So sánh kỳ', 'Kỳ này', 'Kỳ trước', 'Chênh lệch', 'Thay đổi'], ...reportComparison(transactions).map(row => [row.label, row.current, row.previous, row.current - row.previous, reportPercentChange(row.current, row.previous)]), [],
      ['Xu hướng dòng tiền', 'Thu', 'Chi', 'Dòng tiền ròng'], ...reportTrendRows(transactions).map(row => [row.period, row.income, row.expense, row.delta]), [],
      ['Ngân sách', 'Danh mục', 'Dự kiến', 'Thực tế', 'Chênh lệch'], ...reportBudgetRows(transactions).map(row => [row.period, row.name, row.budget, row.actual, row.budget - row.actual]), [],
      ['Giao dịch', 'Ngày', 'Loại', 'Số tiền', 'Danh mục / Ví nhận', 'Ví', 'Thành viên', 'Ghi chú'],
      ...transactions.map(transaction => [transaction.date, transaction.type === 'in' ? 'Thu' : transaction.type === 'out' ? 'Chi' : 'Chuyển ví', Number(transaction.amount || 0), transaction.type === 'transfer' ? `${accountLabel(transaction.accountId)} → ${accountLabel(transaction.toAccountId)}` : cname(transaction), accountLabel(transaction.accountId || transaction.account), uname(transaction.owner), transaction.note || ''])];
    return rows;
  };
  function reportOut() {
    const transactions = reportList(), income = sum(transactions, 'in'), expense = sum(transactions, 'out');
    const comparison = reportComparison(transactions), categories = reportCategoryRows(transactions), expenses = categories.filter(category => category.type === 'out').slice(0, 5);
    const budgets = reportBudgetRows(transactions), trend = reportTrendRows(transactions);
    const balanceDelta = reportBalanceDelta(transactions, S.rf, S.rt);
    const updatedAt = new Date().toLocaleString('vi-VN');
    S.reportUpdatedAt = updatedAt;
    const scopeLabel = reportScopeOptions().find(([id]) => id === S.reportScope)?.[1] || 'Cá nhân';
    const h = 'class="report-section-title"';
    return `<div class="report-meta"><span>${esc(scopeLabel)} · ${esc(S.rf || 'Toàn bộ thời gian')} → ${esc(S.rt || 'Hiện tại')}</span><span>Cập nhật dữ liệu: ${esc(updatedAt)}</span><span>${transactions.length} giao dịch</span></div>
      <div class="report-summary-grid"><article><span>Tổng thu</span><strong class="inc">${money(income)}</strong></article><article><span>Tổng chi</span><strong class="exp">${money(expense)}</strong></article><article><span>Dòng tiền ròng</span><strong>${money(income - expense)}</strong></article><article><span>Biến động số dư</span><strong class="${balanceDelta >= 0 ? 'inc' : 'exp'}">${balanceDelta < 0 ? '-' : '+'}${money(Math.abs(balanceDelta))}</strong></article></div>
      ${!transactions.length ? '<div class="chart-empty">Không có giao dịch phù hợp trong phạm vi đã chọn. Báo cáo ngân sách vẫn được hiển thị bên dưới.</div>' : ''}
      <h3 ${h}>SO SÁNH VỚI KỲ LIỀN TRƯỚC</h3>${reportComparisonHtml(comparison)}
      <div class="report-charts"><article class="card report-chart"><h3 ${h}>THU THEO DANH MỤC</h3>${chart(by(transactions, 'in'))}</article><article class="card report-chart"><h3 ${h}>CHI THEO DANH MỤC</h3>${chart(by(transactions, 'out'), 'e')}</article></div>
      <h3 ${h}>TOP 5 DANH MỤC CHI TIÊU</h3>${expenses.length ? `<div class="report-top-categories">${expenses.map((row, index) => `<article><span>${index + 1}</span><strong>${esc(row.name)}</strong><small>${row.count} giao dịch</small><b>${money(row.amount)}</b></article>`).join('')}</div>` : chartEmpty('Chưa có khoản chi trong kỳ')}
      <h3 ${h}>XU HƯỚNG THU, CHI VÀ DÒNG TIỀN</h3>${reportTrendHtml(trend)}
      <h3 ${h}>NGÂN SÁCH DỰ KIẾN VÀ CHI TIÊU THỰC TẾ</h3><p class="report-note">Đối chiếu theo từng tháng trong kỳ; nếu chỉ chọn một phần tháng, số thực tế chỉ tính trong khoảng ngày đã lọc. Hạn mức gia đình dùng mức tháng hiện tại vì ứng dụng chưa lưu lịch sử thay đổi ngân sách.</p>${reportBudgetsHtml(budgets)}
      ${isAdmin && !S.ru ? `<h3 ${h}>THEO NGƯỜI DÙNG</h3>${userTable(transactions)}` : ''}`;
  }
  const userTable = transactions => {
    const totals = {};
    transactions.forEach(transaction => {
      const item = totals[transaction.owner] || (totals[transaction.owner] = { count: 0, income: 0, expense: 0 });
      if (transaction.type === 'in') { item.income += Number(transaction.amount || 0); item.count++; }
      if (transaction.type === 'out') { item.expense += Number(transaction.amount || 0); item.count++; }
    });
    const rows = Object.entries(totals).sort((a, b) => b[1].expense - a[1].expense);
    return `<div class="wrap"><table><thead><tr><th>Người dùng</th><th>Giao dịch</th><th>Thu</th><th>Chi</th><th>Số dư ròng</th></tr></thead><tbody>${rows.map(([email, item]) =>
      `<tr><td>${esc(uname(email))}</td><td>${item.count}</td><td class="inc">${money(item.income)}</td><td class="exp">${money(item.expense)}</td><td>${money(item.income - item.expense)}</td></tr>`).join('') || emptyRow(5)}</tbody></table></div>`;
  };
  function downloadExcel(name, rows) {
    const xmlEscape = value => String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    const body = rows.map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="${typeof value === 'number' && Number.isFinite(value) ? 'Number' : 'String'}">${xmlEscape(value)}</Data></Cell>`).join('')}</Row>`).join('');
    const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Báo cáo"><Table>${body}</Table></Worksheet></Workbook>`;
    const url = URL.createObjectURL(new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  /* ----- Dashboard ----- */
  const dashboardMonthLabel = value => monthRe.test(value || '') ? `THÁNG ${value.slice(5, 7)}/${value.slice(0, 4)}` : 'TẤT CẢ THỜI GIAN';
  const dashboardAccountOptions = () => (S.dashboardScope && S.dashboardScope !== 'personal' ? familyAccounts(S.dashboardScope) : myAccounts())
    .map(account => [account.id, account.name]);
  const dashboardAccountTransactions = transactions => S.dashboardAccount
    ? transactions.filter(transaction => (transaction.accountId || transaction.account) === S.dashboardAccount || transaction.toAccountId === S.dashboardAccount)
    : transactions;
  const dashboardChange = (current, previous) => {
    if (!previous) return current ? { label: 'Mới phát sinh', state: 'new' } : { label: 'Không đổi', state: 'same' };
    const change = (current - previous) / previous * 100;
    return { label: `${Math.abs(change).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% ${change > 0 ? 'tăng' : change < 0 ? 'giảm' : 'không đổi'}`, state: change > 0 ? 'up' : change < 0 ? 'down' : 'same' };
  };
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
        <label class="dashboard-scope-select"><span>Tài khoản</span><select id="dashboardAccount" data-live aria-label="Lọc theo ví hoặc tài khoản"><option value="">Tất cả tài khoản</option>${dashboardAccountOptions().map(([value, label]) => `<option value="${esc(value)}"${S.dashboardAccount === value ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></label>
        <span class="dashboard-source">Dữ liệu trên thiết bị</span><button type="button" class="sm" data-act="refreshDash">${ic('s-refresh', 1)}Làm mới</button></div>
    </div><div id="dyn"></div>`;
  const h3 = 'style="margin:14px 0 8px;font-size:14px;color:var(--muted)"';
  const dashboardScopedTransactions = scope => db.tx.filter(t => scope === 'personal'
    ? t.owner === session.email && (!t.scope || t.scope === 'personal')
    : !!familyMemberOf(scope) && t.scope === 'family' && t.familyId === scope);
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
    const entries = (familyId ? familyBudgets(familyId, month) : myBudgets().filter(b => b.month === month))
      .sort((a, b) => {
        const spentA = familyId ? familyBudgetSpent(a) : budgetSpent(a);
        const spentB = familyId ? familyBudgetSpent(b) : budgetSpent(b);
        return spentB / Math.max(Number(b.amount), 1) - spentA / Math.max(Number(a.amount), 1);
      });
    const totalSpent = familyId
      ? sum(transactions.filter(tx => tx.date.startsWith(month)), 'out')
      : transactions.filter(tx => tx.type === 'out' && tx.date.startsWith(month) && entries.some(budget => budget.catId === tx.catId))
        .reduce((total, tx) => total + Number(tx.amount || 0), 0);
    const family = familyId ? familyOf(familyId) : null;
    const totalBudget = familyId ? Number(family?.monthlyBudget || 0) : entries.reduce((total, budget) => total + Number(budget.amount || 0), 0);
    const state = budgetStatus(totalSpent, totalBudget), ratio = totalBudget > 0 ? totalSpent / totalBudget : 0;
    const stateClass = state === 'exhausted' ? 'warn' : state;
    const pct = totalBudget > 0 ? progress(totalSpent, totalBudget) : 0;
    const budgetSummary = totalBudget > 0 ? `<div class="dashboard-budget-summary">
        <div><span>Ngân sách tháng</span><strong>${money(totalBudget)}</strong></div><div><span>Đã chi</span><strong>${money(totalSpent)}</strong></div><div><span>Còn lại</span><strong class="${totalBudget - totalSpent < 0 ? 'exp' : 'inc'}">${money(totalBudget - totalSpent)}</strong></div>
      </div><div class="dashboard-budget-track dashboard-budget-total-track"><i class="${stateClass}" style="--bar-width:${pct}%"></i></div>
      <div class="dashboard-budget-caption"><span>Đã sử dụng ${pct}%</span><span>${state === 'over' ? 'Vượt ngân sách' : state === 'exhausted' ? 'Đã dùng hết ngân sách' : state === 'warn' ? 'Đã dùng ít nhất 80%' : 'Trong ngân sách'}</span></div>
      ${state !== 'ok' ? `<p class="dashboard-budget-alert ${stateClass}" role="status">${state === 'over' ? `Chi tiêu đã vượt ngân sách ${money(totalSpent - totalBudget)}.` : state === 'exhausted' ? 'Chi tiêu đã sử dụng đúng 100% ngân sách tháng.' : 'Lưu ý: chi tiêu đã đạt ít nhất 80% ngân sách tháng.'}</p>` : ''}`
      : `<div class="dashboard-empty">${familyId ? 'Gia đình chưa đặt ngân sách chung tháng này.' : 'Chưa có ngân sách cho tháng này.'}<button type="button" class="sm" data-p="${familyId ? 'family' : 'budget'}">${familyId ? 'Quản lý gia đình' : 'Tạo ngân sách'}</button></div>`;
    const budgetItems = entries.length ? `<div class="dashboard-budget-list">${entries.map((b, index) => {
      const spent = familyId ? familyBudgetSpent(b) : budgetSpent(b);
      const itemStatus = budgetStatus(spent, b.amount), itemState = itemStatus === 'exhausted' ? 'warn' : itemStatus;
      const itemPct = progress(spent, b.amount);
      const itemLabel = itemStatus === 'over' ? 'Vượt ngân sách' : itemStatus === 'exhausted' ? 'Đã dùng hết 100%' : itemStatus === 'warn' ? 'Đã dùng ít nhất 80%' : `${itemPct}%`;
      return `<div class="dashboard-budget-item" style="--chart-delay:${index * 65}ms"><div class="dashboard-budget-head"><b>${esc(catOf(b.catId)?.name || 'Danh mục đã xóa')}</b><span class="dashboard-budget-state ${itemState}">${itemLabel}</span></div>
        <div class="dashboard-budget-track"><i class="${itemState}" style="--bar-width:${itemPct}%"></i></div><div class="dashboard-budget-caption"><span>${money(spent)} đã dùng</span><span>${money(b.amount)}</span></div></div>`;
    }).join('')}</div>` : '';
    return budgetSummary + budgetItems;
  };
  const dashboardRecent = transactions => {
    const items = recent(transactions, 5);
    if (!items.length) return chartEmpty('Chưa có giao dịch trong kỳ này');
    return `<div class="dashboard-recent-list">${items.map(t => `<article class="dashboard-recent-item">
      <span class="dashboard-recent-icon ${t.type}">${ic(t.type === 'in' ? 'i-coins' : t.type === 'transfer' ? 'i-wallet' : 'i-receipt')}</span><span class="dashboard-recent-description"><b>${esc(t.note || (t.type === 'transfer' ? `Chuyển đến ${accountLabel(t.toAccountId)}` : cname(t)))}</b><small>${esc(t.type === 'transfer' ? `Chuyển ví · ${accountLabel(t.accountId)} → ${accountLabel(t.toAccountId)}` : cname(t))} · ${fdate(t.date)} · ${esc(accountLabel(t.accountId || t.account))}</small></span>
      <strong class="${t.type === 'in' ? 'inc' : t.type === 'out' ? 'exp' : 'transfer'}">${t.type === 'in' ? '+' : t.type === 'out' ? '-' : '↔ '}${money(t.amount)}</strong>
      <div class="dashboard-recent-actions"><button type="button" class="sm" data-act="viewTx" data-id="${esc(t.id)}" aria-label="Xem giao dịch">${ic('i-eye')}</button>
        ${canEditFamilyTransaction(t) ? `<button type="button" class="sm" data-act="editTx" data-id="${esc(t.id)}" aria-label="Sửa giao dịch">${ic('i-pen-to-square')}</button>` : ''}
        ${canDeleteFamilyTransaction(t) ? `<button type="button" class="sm red" data-act="delTx" data-id="${esc(t.id)}" aria-label="Xóa giao dịch">${ic('s-trash', 1)}</button>` : ''}</div></article>`).join('')}</div>`;
  };
  const userDash = () => {
    const scope = S.dashboardScope || 'personal';
    const familyId = scope === 'personal' ? '' : scope;
    const family = familyId ? familyOf(familyId) : null;
    const scopeAccounts = familyId ? familyAccounts(familyId) : myAccounts();
    if (S.dashboardAccount && !scopeAccounts.some(account => account.id === S.dashboardAccount)) delete S.dashboardAccount;
    const label = family ? family.name : 'cá nhân';
    const allScopedTransactions = dashboardScopedTransactions(scope);
    const accountTransactions = dashboardAccountTransactions(allScopedTransactions);
    const l = accountTransactions.filter(inMonth);
    const income = sum(l, 'in'), expense = sum(l, 'out');
    const comparisonMonth = monthRe.test(S.dm || '') ? S.dm : monthNow();
    const previousMonth = shiftMonth(comparisonMonth, -1);
    const previousTransactions = accountTransactions.filter(transaction => transaction.date.startsWith(previousMonth));
    const incomeChange = dashboardChange(income, sum(previousTransactions, 'in'));
    const expenseChange = dashboardChange(expense, sum(previousTransactions, 'out'));
    const currentMonth = monthNow();
    const currentMonthTransactions = accountTransactions.filter(transaction => transaction.date.startsWith(currentMonth));
    const elapsedDays = new Date().getDate();
    const daysInMonth = new Date(Number(currentMonth.slice(0, 4)), Number(currentMonth.slice(5, 7)), 0).getDate();
    const forecast = sum(currentMonthTransactions, 'out') / Math.max(elapsedDays, 1) * daysInMonth;
    const accounts = scopeAccounts.filter(account => !S.dashboardAccount || account.id === S.dashboardAccount);
    const assets = accounts.reduce((total, account) => total + accountBalance(account), 0);
    const currentBudgetEntries = familyId ? [] : myBudgets().filter(budget => budget.month === currentMonth);
    const budgetLimit = familyId ? Number(family?.monthlyBudget || 0) : currentBudgetEntries.reduce((total, budget) => total + Number(budget.amount || 0), 0);
    const budgetSpentTotal = familyId
      ? sum(allScopedTransactions.filter(transaction => transaction.date.startsWith(currentMonth)), 'out')
      : currentBudgetEntries.reduce((total, budget) => total + Math.min(Number(budget.amount || 0), budgetSpent(budget)), 0);
    const budgetRemaining = budgetLimit > 0 ? Math.max(0, budgetLimit - budgetSpentTotal) : assets;
    const spendable = Math.min(Math.max(assets, 0), budgetRemaining);
    const comparisonLabel = monthRe.test(S.dm || '') ? `So với ${previousMonth.slice(5, 7)}/${previousMonth.slice(0, 4)}` : 'Toàn bộ giao dịch';
    return `<div class="dashboard-summary">
        <div class="dashboard-total income">${ic('i-coins')}<span>TỔNG THU NHẬP</span><strong>+${money(income)}</strong><small class="dashboard-change ${incomeChange.state}">${comparisonLabel === 'Toàn bộ giao dịch' ? comparisonLabel : `${incomeChange.label} ${comparisonLabel}`}</small></div>
        <div class="dashboard-total expense">${ic('i-receipt')}<span>TỔNG CHI TIÊU</span><strong>-${money(expense)}</strong><small class="dashboard-change ${expenseChange.state}">${comparisonLabel === 'Toàn bộ giao dịch' ? comparisonLabel : `${expenseChange.label} ${comparisonLabel}`}</small></div>
        <div class="dashboard-total balance-stat"><span>CHÊNH LỆCH THU CHI</span><strong class="${income - expense < 0 ? 'exp' : 'inc'}">${income - expense < 0 ? '-' : '+'}${money(Math.abs(income - expense))}</strong><small>Thu nhập trừ chi tiêu trong kỳ</small></div>
        <div class="dashboard-total transaction-stat">${ic('i-layer-group')}<span>TỔNG GIAO DỊCH</span><strong>${l.length.toLocaleString('vi-VN')}</strong><small>${l.filter(tx => tx.type === 'in').length} thu · ${l.filter(tx => tx.type === 'out').length} chi</small></div>
        <div class="dashboard-total asset-stat">${ic('i-wallet')}<span>SỐ DƯ VÍ / TÀI SẢN</span><strong>${money(assets)}</strong><small>${accounts.length} tài khoản · số dư hiện tại</small></div>
        <div class="dashboard-total spendable-stat">${ic('i-piggy-bank')}<span>CÒN CÓ THỂ CHI</span><strong>${money(spendable)}</strong><small>${budgetLimit > 0 ? 'Theo hạn mức ngân sách còn lại' : 'Theo số dư tài khoản hiện có'}</small></div>
        <div class="dashboard-total forecast-stat">${ic('i-chart-pie')}<span>DỰ BÁO CHI CUỐI THÁNG</span><strong>${money(forecast)}</strong><small>Ước tính theo tốc độ chi ${sum(currentMonthTransactions, 'out') ? `(${elapsedDays}/${daysInMonth} ngày)` : 'hiện tại'}</small></div>
      </div>
      <div class="dashboard-charts">
        <section class="card dashboard-section dashboard-chart-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">DÒNG TIỀN</span><h2>Thu nhập và chi tiêu theo tháng</h2></div></div>${dashboardMonthlyChart(accountTransactions)}</section>
        <section class="card dashboard-section dashboard-chart-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">PHÂN BỔ CHI TIÊU</span><h2>Chi tiêu theo danh mục</h2></div><span class="dashboard-section-total">${money(expense)}</span></div>${pie(by(l, 'out'))}</section>
        <section class="card dashboard-section dashboard-chart-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">TOP 5 DANH MỤC</span><h2>Danh mục chi tiêu lớn nhất</h2></div></div>${dashboardRankedBars(by(l, 'out'), 'expense')}</section>
        <section class="card dashboard-section dashboard-chart-panel dashboard-trend-panel"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">BIẾN ĐỘNG</span><h2>Xu hướng tài chính</h2></div></div>${dashboardMonthlyChart(accountTransactions, true)}</section>
      </div>
      <div class="dashboard-content-grid">
        <section class="card dashboard-section money-accounts-card"><div class="dashboard-section-heading"><div><span class="dashboard-eyebrow">SỐ DƯ HIỆN TẠI</span><h2>${familyId ? 'Ví quỹ chung' : 'Ví và tài khoản của bạn'}</h2></div><button type="button" class="sm" data-p="moneyAccounts">Quản lý ví</button></div>
          <div class="money-account-list">${accounts.map(account => `<article class="money-account-row"><span class="money-account-icon ${esc(account.type)}">${ic(account.type === 'wallet' ? 'i-mobile-screen-button' : 'i-wallet')}</span>
            <div class="money-account-copy"><b>${esc(account.name)}</b><small>${esc(accountTypeLabel(account.type))}</small></div><strong>${money(accountBalance(account))}</strong></article>`).join('')}</div>
          <div class="money-account-total"><span>${S.dashboardAccount ? 'SỐ DƯ ĐÃ CHỌN' : familyId ? 'TỔNG SỐ DƯ VÍ CHUNG' : 'TỔNG TÀI SẢN'}</span><strong>${money(assets)}</strong></div>
        </section>
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
      <div class="grid2">${field('bcat', 'Danh mục Chi', 'i-layer-group', { tag: 'select', opts: catOpts(e.catId, 'Chọn danh mục Chi', 'out', [catOf(e.catId)]) })}${field('bmonth', 'Tháng', 's-cal', { type: 'month', val: month })}
      ${field('bamount', 'Số tiền ngân sách (₫)', 'i-coins', { type: 'number', val: e.amount, attr: 'min="1"' })}</div>
      <div class="actions">${e.id ? '<button type="button" class="btn-ghost-d" data-act="cancelBudget">HỦY</button>' : ''}<button class="btn-primary">${e.id ? 'LƯU THAY ĐỔI' : 'TẠO NGÂN SÁCH'}</button></div></form>
      <div class="card"><div class="card-head"><h2 class="card-title">NGÂN SÁCH CỦA TÔI</h2><span class="badge">${entries.length} danh mục</span></div>
      ${entries.length ? `<div class="progress-list">${entries.map(b => {
        const spent = budgetSpent(b), status = budgetStatus(spent, b.amount), pct = progress(spent, b.amount);
        const state = status === 'exhausted' ? 'warn' : status;
        const label = status === 'over' ? 'Đã vượt 100%' : status === 'exhausted' ? 'Đã dùng hết 100%' : status === 'warn' ? 'Đã dùng ít nhất 80%' : 'Trong ngân sách';
        return `<article class="progress-item"><div class="card-head"><div><h3>${esc(catOf(b.catId)?.name || '(Danh mục đã xóa)')}</h3><small>${esc(b.month)} · <span class="badge ${state}">${label}</span></small></div><div class="cell-act"><button class="sm" data-act="editBudget" data-id="${esc(b.id)}">${ic('i-pen-to-square')}Sửa</button><button class="sm red" data-act="delBudget" data-id="${esc(b.id)}">${ic('s-trash', 1)}Xóa</button></div></div>
          ${progressBar(spent, b.amount, state)}<div class="progress-caption"><b>${money(spent)}</b><span>${pct}%</span><span>Ngân sách ${money(b.amount)}</span></div></article>`;
      }).join('')}</div>` : `<div class="chart-empty">Chưa có ngân sách. Tạo ngân sách đầu tiên để theo dõi chi tiêu.</div>`}</div>`;
  };
  /* ===== Hồ sơ gia đình: quan hệ khác với quyền quản trị ===== */
  const FAMILY_RELATIONS = [
    ['', 'Chưa cập nhật', '🧩'], ['father', 'Bố', '👨'], ['mother', 'Mẹ', '👩'],
    ['husband', 'Chồng', '💙'], ['wife', 'Vợ', '💖'], ['son', 'Con trai', '👦'],
    ['daughter', 'Con gái', '👧'], ['older_brother', 'Anh trai', '👨'],
    ['older_sister', 'Chị gái', '👩'], ['younger_brother', 'Em trai', '👦'],
    ['younger_sister', 'Em gái', '👧'], ['grandfather', 'Ông', '👴'],
    ['grandmother', 'Bà', '👵'], ['other', 'Người thân khác', '💞']
  ];
  const familyRelationship = member => FAMILY_RELATIONS.find(([key]) => key === (member?.relationship || '')) || FAMILY_RELATIONS[0];
  const familyRole = role => role === 'OWNER' ? 'Chủ gia đình' : role === 'MANAGER' ? 'Quản lý tài chính' : 'Thành viên';
  const familyTransactionFor = (familyId, email, period = 'all') => db.tx.filter(t =>
    t.scope === 'family' && t.familyId === familyId && t.owner === email &&
    (period === 'all' || (t.date || '').startsWith(period))
  ).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const familyProfileMonth = () => S.familyProfileMonth || monthNow();
  const familySpendingByCategory = transactions => Object.entries(transactions.filter(t => t.type === 'out').reduce((items, transaction) => {
    const label = cname(transaction);
    items[label] = (items[label] || 0) + Number(transaction.amount || 0);
    return items;
  }, {})).sort((a, b) => b[1] - a[1]);

  const familyPendingRequests = familyId => db.familyMembers.filter(m => m.familyId === familyId && m.status === 'PENDING');
  const familyInvitesFor = familyId => db.familyInvites.filter(invite => invite.familyId === familyId && invite.status === 'PENDING');
  const familyInvitesToMe = () => db.familyInvites.filter(invite => invite.status === 'PENDING' && (invite.email || '').toLowerCase() === session.email.toLowerCase());
  const familyTabButtons = [
    ['overview', 'Tổng quan'],
    ['transactions', 'Giao dịch'],
    ['members', 'Thành viên'],
    ['fund', 'Quỹ chung'],
    ['budget', 'Ngân sách'],
    ['report', 'Báo cáo'],
    ['settings', 'Cài đặt']
  ];
  const familySummaryData = familyId => {
    const family = familyOf(familyId);
    const transactions = db.tx.filter(t => t.scope === 'family' && t.familyId === familyId).slice().sort((a, b) => b.date.localeCompare(a.date));
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthNow()));
    const members = familyMembersOf(familyId).map(member => ({ ...member, user: findUser(member.userEmail) }));
    const totalSpent = monthTransactions.filter(t => t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const budgetAmount = Number(family?.monthlyBudget || 0);
    const remaining = budgetAmount - totalSpent;
    const byCategory = monthTransactions.filter(t => t.type === 'out').reduce((map, tx) => {
      const label = cname(tx);
      map[label] = (map[label] || 0) + Number(tx.amount || 0);
      return map;
    }, {});
    const byMember = members.reduce((map, member) => {
      const spent = monthTransactions.filter(t => t.type === 'out' && t.owner === member.userEmail).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      map[member.userEmail] = spent;
      return map;
    }, {});
    return { family, members, transactions, monthTransactions, totalSpent, budgetAmount, remaining, byCategory, byMember };
  };
  const familyTrendHtml = transactions => {
    const months = Array.from({ length: 6 }, (_, index) => shiftMonth(monthNow(), index - 5));
    const values = months.map(month => {
      const items = transactions.filter(tx => tx.date.startsWith(month));
      return {
        month,
        income: items.filter(tx => tx.type === 'in').reduce((total, tx) => total + Number(tx.amount || 0), 0),
        expense: items.filter(tx => tx.type === 'out').reduce((total, tx) => total + Number(tx.amount || 0), 0)
      };
    });
    const max = Math.max(1, ...values.flatMap(item => [item.income, item.expense]));
    return `<div class="family-trend">${values.map(item => `<div class="family-trend-row"><span>${esc(item.month.slice(5))}/${esc(item.month.slice(0, 4))}</span><div class="family-trend-bars" aria-label="Thu ${money(item.income)}, chi ${money(item.expense)}"><i class="in" style="width:${item.income / max * 100}%"></i><i class="out" style="width:${item.expense / max * 100}%"></i></div><small><b class="inc">${money(item.income)}</b><b class="exp">${money(item.expense)}</b></small></div>`).join('')}</div><div class="family-trend-legend"><span><i class="in"></i>Thu</span><span><i class="out"></i>Chi</span></div>`;
  };
  const familyOverviewTab = familyId => {
    const { family, members, transactions, monthTransactions, totalSpent, budgetAmount, remaining, byCategory, byMember } = familySummaryData(familyId);
    const memberCount = members.length;
    const fundEntries = db.familyFundEntries.filter(entry => entry.familyId === familyId);
    const fundBalance = fundEntries.reduce((balance, entry) => balance + (entry.type === 'contribution' ? 1 : -1) * Number(entry.amount || 0), 0);
    const overviewCards = [`<div class="family-kpi-card"><small>Chi tháng ${esc(monthNow())}</small><strong>${money(totalSpent)}</strong></div>`, `<div class="family-kpi-card"><small>Ngân sách tháng</small><strong>${money(budgetAmount)}</strong></div>`, `<div class="family-kpi-card"><small>Còn lại tháng này</small><strong>${money(remaining)}</strong></div>`, `<div class="family-kpi-card"><small>Thành viên</small><strong>${memberCount} người</strong></div>`].join('');
    const income = transactions.filter(t => t.type === 'in').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const expense = transactions.filter(t => t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const recent = transactions.slice(0, 5);
    const categoryChart = Object.keys(byCategory).length ? pie(byCategory) : `<div class="chart-empty">Chưa có dữ liệu</div>`;
    const memberChart = members.length ? `<div class="family-member-breakdown">${members.map(member => { const spent = byMember[member.userEmail] || 0; const count = monthTransactions.filter(t => t.owner === member.userEmail).length; const roleLabel = member.role === 'OWNER' ? 'Chủ gia đình' : member.role === 'MANAGER' ? 'Người quản lý' : 'Thành viên'; return `<div class="family-member-breakdown-row"><div><strong>${esc(member.user?.name || member.userEmail)}</strong><small>${roleLabel} · ${count} giao dịch tháng này</small></div><span>${money(spent)}</span></div>`; }).join('')}</div>` : '<div class="chart-empty">Chưa có thành viên</div>';
    return `<div class="family-section-grid">
      <section class="family-summary-card family-fund-card"><div class="card-head"><div><span class="dashboard-eyebrow">GIAO DỊCH DÙNG CHUNG</span><h3 class="card-title">TỔNG QUAN TÀI CHÍNH</h3></div><button type="button" class="sm" data-act="familyTab" data-id="fund">Mở sổ quỹ</button></div>
        <div class="family-fund-grid"><div><span>Tổng thu chung</span><strong class="inc">${money(income)}</strong></div><div><span>Tổng chi chung</span><strong class="exp">${money(expense)}</strong></div><div><span>Số dư quỹ chung</span><strong>${money(fundBalance)}</strong></div></div></section>
      <div class="family-kpi-grid">${overviewCards}</div>
      <div class="family-summary-card">
        <div class="card-head"><h3 class="card-title">CHI TIÊU THEO DANH MỤC · THÁNG NÀY</h3></div>
        ${categoryChart}
      </div>
      <div class="family-summary-card">
        <div class="card-head"><h3 class="card-title">CHI TIÊU THEO THÀNH VIÊN · THÁNG NÀY</h3></div>
        ${memberChart}
      </div>
      <div class="family-summary-card family-trend-card">
        <div class="card-head"><h3 class="card-title">XU HƯỚNG THU CHI · 6 THÁNG</h3></div>
        ${familyTrendHtml(transactions)}
      </div>
      <div class="family-summary-card">
        <div class="card-head"><h3 class="card-title">GIAO DỊCH GẦN ĐÂY</h3><button type="button" class="btn-ghost-d" data-act="familyTab" data-id="transactions">Xem tất cả</button></div>
        ${recent.length ? `<div class="family-transaction-list">${recent.map(tx => { const transfer = tx.type === 'transfer'; return `<div class="family-transaction-item"><div><span>${esc(transfer ? `Chuyển ${accountLabel(tx.accountId)} → ${accountLabel(tx.toAccountId)}` : tx.note || cname(tx))} <small class="family-shared-label">Dùng chung</small></span><small>${esc(uname(tx.owner))} · ${fdate(tx.date)}</small></div><strong class="${transfer ? 'transfer' : tx.type === 'in' ? 'inc' : 'exp'}">${transfer ? '' : tx.type === 'in' ? '+' : '−'}${money(tx.amount)}</strong></div>`; }).join('')}</div>` : '<div class="chart-empty">Chưa có giao dịch</div>'}
      </div>
    </div>`;
  };
  const familyTransactionsFiltered = familyId => {
    const query = (S.familyTxSearch || '').trim().toLocaleLowerCase('vi');
    const memberFilter = S.familyTxMember || '';
    const monthFilter = S.familyTxMonth || '';
    const typeFilter = S.familyTxType || '';
    return db.tx.filter(t => t.scope === 'family' && t.familyId === familyId)
      .filter(t => (!memberFilter || t.owner === memberFilter) && (!monthFilter || t.date.startsWith(monthFilter)) && (!typeFilter || t.type === typeFilter) &&
        (!query || `${t.note || ''} ${cname(t)} ${t.amount} ${Number(t.amount).toLocaleString('vi-VN')}`.toLocaleLowerCase('vi').includes(query)))
      .slice().sort((a, b) => b.date.localeCompare(a.date));
  };
  const familyTxRowsHtml = transactions => transactions.map((tx, index) => { const transfer = tx.type === 'transfer'; const amountClass = transfer ? 'transfer' : tx.type === 'in' ? 'inc' : 'exp'; const label = transfer ? `Chuyển ví · ${accountLabel(tx.accountId)} → ${accountLabel(tx.toAccountId)}` : tx.note || cname(tx); return `<tr><td>${index + 1}</td><td>${fdate(tx.date)}</td><td>${esc(label)}<small class="family-shared-label">Dùng chung</small></td><td>${transfer ? 'Chuyển nội bộ' : esc(cname(tx))}</td><td>${esc(uname(tx.owner))}</td><td>${esc(accountLabel(tx.accountId || tx.account))}</td><td class="${amountClass}">${transfer ? '' : tx.type === 'in' ? '+' : '−'}${money(tx.amount)}</td><td><div class="family-inline-actions"><button type="button" class="sm" data-act="viewTx" data-id="${esc(tx.id)}">Xem</button>${canEditFamilyTransaction(tx) ? `<button type="button" class="sm" data-act="editTx" data-id="${esc(tx.id)}">Sửa</button>` : ''}${canDeleteFamilyTransaction(tx) ? `<button type="button" class="sm red" data-act="delTx" data-id="${esc(tx.id)}">Xóa</button>` : ''}</div></td></tr>`; }).join('');
  const familyTxSummaryHtml = transactions => {
    const income = transactions.filter(tx => tx.type === 'in').reduce((total, tx) => total + Number(tx.amount || 0), 0);
    const expense = transactions.filter(tx => tx.type === 'out').reduce((total, tx) => total + Number(tx.amount || 0), 0);
    const balance = income - expense;
    return `<div class="family-filter-summary"><div><span>Giao dịch</span><strong>${transactions.length}</strong></div><div><span>Tổng thu</span><strong class="inc">${money(income)}</strong></div><div><span>Tổng chi</span><strong class="exp">${money(expense)}</strong></div><div><span>Chênh lệch</span><strong class="${balance < 0 ? 'exp' : 'inc'}">${money(balance)}</strong></div></div>`;
  };
  const familyTransactionsTab = familyId => {
    const memberFilter = S.familyTxMember || '';
    const monthFilter = S.familyTxMonth || '';
    const transactions = familyTransactionsFiltered(familyId);
    const rows = familyTxRowsHtml(transactions);
    return `<div class="family-toolbar"><div class="family-filters"><input id="familyTxSearch" class="family-filter" type="search" placeholder="Tìm từ khóa, danh mục, số tiền" aria-label="Tìm giao dịch" data-live value="${esc(S.familyTxSearch || '')}"><select id="familyTxMember" class="family-filter" aria-label="Lọc theo thành viên" data-live>${opt(familyMembersOf(familyId).map(member => [member.userEmail, findUser(member.userEmail)?.name || member.userEmail]), memberFilter, 'Tất cả thành viên')}</select><input id="familyTxMonth" class="family-filter" type="month" aria-label="Lọc theo tháng" data-live value="${esc(monthFilter)}"><select id="familyTxType" class="family-filter" aria-label="Lọc theo loại giao dịch" data-live>${opt(TRANSACTION_TYPES, S.familyTxType || '', 'Tất cả loại')}</select><button type="button" class="sm" data-act="resetFamilyTxFilter">Xóa lọc</button></div><div class="family-toolbar-actions"><button type="button" class="sm" data-act="exportFamilyTx">${ic('s-download', 1)}Xuất CSV</button><button type="button" class="btn-primary" data-act="addFamilyTransaction">${ic('s-plus', 1)}Thêm giao dịch</button></div></div>
      ${familyTxSummaryHtml(transactions)}
      <p class="family-filter-count">${transactions.length} giao dịch sau lọc</p>
      <div class="family-table-wrap"><table class="family-table"><thead><tr><th>#</th><th>Ngày</th><th>Nội dung</th><th>Danh mục</th><th>Người thực hiện</th><th>Ví/Tài khoản</th><th>Số tiền</th><th>Thao tác</th></tr></thead><tbody id="familyTxRows">${rows || '<tr><td colspan="8" class="family-empty-cell">Không có giao dịch phù hợp</td></tr>'}</tbody></table></div>`;
  };
  const familyMemberProfile = (familyId, member) => {
    const family = familyOf(familyId);
    if (!family || !familyMemberOf(familyId)) return '<p>Không có quyền truy cập hồ sơ.</p>';
    const user = findUser(member.userEmail);
    const name = user?.name || member.userEmail;
    const [relKey, relation, emoji] = familyRelationship(member);
    const period = familyProfileMonth();
    const filtered = familyTransactionFor(familyId, member.userEmail, period);
    const spending = filtered.filter(t => t.type === 'out');
    const income = filtered.filter(t => t.type === 'in');
    const spent = spending.reduce((total, t) => total + Number(t.amount || 0), 0);
    const earned = income.reduce((total, t) => total + Number(t.amount || 0), 0);
    const categories = familySpendingByCategory(filtered);
    const canUpdateInfo = canManageFamily(familyId) || session.email === member.userEmail;
    const isOwner = member.role === 'OWNER' || family.ownerEmail === member.userEmail;
    const canUpdateRole = canManageFamilyRoles(familyId) && !isOwner;
    const canRemove = canManageFamily(familyId) && member.userEmail !== session.email && !isOwner &&
      (family.ownerEmail === session.email || member.role === 'MEMBER');
    const roleToken = isOwner ? 'owner' : member.role === 'MANAGER' ? 'manager' : 'member';
    const active = S.familyProfileTab || 'overview';
    const graph = categories.length ? `<div class="et-profile-chart">${categories.slice(0, 6).map(([category, amount], i) => `<div class="et-profile-chart-row"><div class="et-profile-chart-label"><span>${esc(category)}</span><b>${money(amount)}</b></div><div class="et-profile-track"><span style="width:${Math.max(3, Math.min(100, spent ? amount / spent * 100 : 0))}%;--et-delay:${i * 90}ms"></span></div></div>`).join('')}</div>` : '<div class="et-profile-empty"><span aria-hidden="true">🌿</span><b>Chưa có chi tiêu chung</b><small>Những khoản chi gia đình do thành viên này thực hiện sẽ hiển thị tại đây.</small></div>';
    const history = filtered.length ? `<div class="et-profile-history">${filtered.slice(0, active === 'transactions' ? 80 : 5).map(t => `<article class="et-profile-tx"><span class="et-profile-tx-icon" aria-hidden="true">${t.type === 'in' ? '💰' : t.type === 'out' ? '🧾' : '🔄'}</span><div class="et-profile-tx-info"><b>${esc(t.note || (t.type === 'transfer' ? 'Chuyển ví' : cname(t)))}</b><small>${fdate(t.date)} · ${esc(t.type === 'transfer' ? 'Chuyển ví' : cname(t))}</small></div><strong class="${t.type === 'in' ? 'inc' : t.type === 'out' ? 'exp' : ''}">${t.type === 'out' ? '−' : t.type === 'in' ? '+' : ''}${money(t.amount)}</strong><button type="button" class="sm" data-act="viewTx" data-id="${esc(t.id)}" aria-label="Xem giao dịch">${ic('i-eye')}</button></article>`).join('')}</div>` : '<div class="et-profile-empty"><span aria-hidden="true">📭</span><b>Không có giao dịch phù hợp</b><small>Hãy chọn kỳ khác hoặc thêm giao dịch dùng chung.</small></div>';
    return `<section class="et-profile-page et-enter">
      <div class="et-profile-toolbar"><button type="button" class="et-back-btn" data-act="backFamilyMembers">${ic('s-left', 1)} Quay lại thành viên</button><span class="et-profile-breadcrumb">🏠 Gia đình / Thành viên / Hồ sơ</span></div>
      <div class="et-profile-hero">
        <span class="et-hero-sticker et-sticker-one" aria-hidden="true">✨</span><span class="et-hero-sticker et-sticker-two" aria-hidden="true">💙</span><span class="et-hero-sticker et-sticker-three" aria-hidden="true">⭐</span>
        <div class="et-profile-avatar"><span role="img" aria-label="Biểu tượng thành viên">${emoji}</span><i aria-hidden="true">${isOwner ? '👑' : member.role === 'MANAGER' ? '🌟' : '💫'}</i></div>
        <div class="et-profile-identity"><span class="et-profile-eyebrow">HỒ SƠ THÀNH VIÊN</span><h2>${esc(name)}</h2><div class="et-profile-chips"><span class="et-relation-pill">${emoji} ${esc(relation)}</span><span class="family-role-badge role-${roleToken}">${esc(familyRole(member.role))}</span><span class="family-member-status">Đang tham gia</span></div><p>Thành viên của ${esc(family.name)} · ${esc(member.userEmail)}</p></div>
        ${canUpdateInfo ? `<button class="et-profile-edit" type="button" data-act="editFamilyRelationship" data-id="${esc(member.userEmail)}">${ic('i-pen-to-square')} Chỉnh sửa hồ sơ</button>` : ''}
      </div>
      <div class="et-profile-nav" role="group" aria-label="Các mục hồ sơ">
        ${[['overview', '🏡 Tổng quan'], ['transactions', '🧾 Chi tiêu'], ['permissions', '🛡️ Quyền hạn'], ['info', '👤 Thông tin']].map(([key, title]) => `<button type="button" class="et-profile-tab ${active === key ? 'active' : ''}" data-act="familyProfileTab" data-id="${key}" ${active === key ? 'aria-current="page"' : ''}>${title}</button>`).join('')}
      </div>
      ${['overview', 'transactions'].includes(active) ? `<div class="et-profile-period"><label for="familyProfileMonth">📅 Thống kê theo tháng</label><input type="month" id="familyProfileMonth" value="${esc(period === 'all' ? monthNow() : period)}"><button type="button" class="sm ${period === 'all' ? 'et-period-active' : ''}" data-act="familyProfileAll">Tất cả</button></div>
        <div class="et-profile-kpis"><div class="et-profile-kpi"><span aria-hidden="true">💸</span><small>Tổng chi tiêu chung</small><strong>${money(spent)}</strong></div><div class="et-profile-kpi"><span aria-hidden="true">🪙</span><small>Tổng thu chung</small><strong>${money(earned)}</strong></div><div class="et-profile-kpi"><span aria-hidden="true">📋</span><small>Giao dịch</small><strong>${filtered.length}</strong></div></div>` : ''}
      ${active === 'overview' ? `<div class="et-profile-columns"><div class="et-profile-section"><h3>📊 Phân bổ chi tiêu</h3><p class="et-profile-muted">Chỉ tính các khoản chi gia đình của thành viên</p>${graph}</div><div class="et-profile-section"><h3>🌈 Thông tin nhanh</h3><div class="et-profile-facts"><div><span>Quan hệ gia đình</span><b>${emoji} ${esc(relation)}</b></div><div><span>Quyền hệ thống</span><b>${esc(familyRole(member.role))}</b></div><div><span>Ngày tham gia</span><b>${member.joinedAt ? fdate(member.joinedAt.slice(0, 10)) : 'Chưa rõ'}</b></div></div><div class="et-profile-privacy">🔒 Dữ liệu chi tiêu cá nhân luôn được giữ riêng tư.</div></div></div><div class="et-profile-section"><div class="et-profile-section-head"><h3>🧾 Giao dịch gần đây</h3><button type="button" class="sm" data-act="familyProfileTab" data-id="transactions">Xem toàn bộ →</button></div>${history}</div>` : ''}
      ${active === 'transactions' ? `<div class="et-profile-section"><div class="et-profile-section-head"><div><h3>🧾 Lịch sử giao dịch chung</h3><p class="et-profile-muted">${filtered.length} giao dịch trong kỳ đã chọn</p></div></div>${history}${filtered.length > 80 ? '<p class="et-profile-muted">Đang hiển thị 80 giao dịch gần nhất. Mở tab Giao dịch gia đình để lọc và xuất đầy đủ.</p>' : ''}</div><div class="et-profile-section"><h3>📊 Danh mục chi tiêu</h3>${graph}</div>` : ''}
      ${active === 'permissions' ? `<div class="et-profile-columns"><div class="et-profile-section"><h3>🛡️ Quyền hiện tại</h3><div class="et-role-highlight"><span aria-hidden="true">${isOwner ? '👑' : member.role === 'MANAGER' ? '🌟' : '🤝'}</span><div><b>${esc(familyRole(member.role))}</b><small>${isOwner ? 'Toàn quyền quản lý gia đình và phân vai trò.' : member.role === 'MANAGER' ? 'Quản lý ngân sách, giao dịch chung và lời mời.' : 'Theo dõi, ghi nhận khoản chung và sửa giao dịch do mình tạo.'}</small></div></div><ul class="et-permission-list"><li>✅ Xem dữ liệu chi tiêu chung</li><li>✅ Thêm giao dịch gia đình</li><li>${isOwner || member.role === 'MANAGER' ? '✅' : '🔒'} Quản lý ngân sách và giao dịch chung của người khác</li><li>${isOwner ? '✅' : '🔒'} Phân quyền thành viên / giải tán gia đình</li></ul></div><div class="et-profile-section"><h3>⚙️ Quản lý quyền hạn</h3><p class="et-profile-muted">Quan hệ Bố/Mẹ/Anh/Chị không ảnh hưởng đến quyền truy cập.</p>${isOwner ? '<div class="et-profile-privacy">👑 Đây là chủ gia đình. Không thể hạ quyền trực tiếp. Việc chuyển chủ sở hữu cần quy trình xác thực riêng và chưa được triển khai.</div>' : canUpdateRole ? `<button type="button" class="btn-primary" data-act="editFamilyRole" data-id="${esc(member.userEmail)}">${ic('i-shield-halved')} Thay đổi quyền</button>` : '<div class="et-profile-privacy">🔒 Chỉ chủ gia đình có quyền thay đổi vai trò.</div>'}${canRemove ? `<div class="et-profile-danger"><p>Loại khỏi gia đình sẽ không xóa tài khoản cá nhân hay lịch sử chi chung.</p><button type="button" class="sm red" data-act="removeFamilyMember" data-id="${esc(member.userEmail)}">Loại khỏi gia đình</button></div>` : ''}</div></div>` : ''}
      ${active === 'info' ? `<div class="et-profile-columns"><div class="et-profile-section"><h3>👤 Thông tin thành viên</h3><div class="et-profile-facts"><div><span>Họ và tên</span><b>${esc(name)}</b></div><div><span>Quan hệ trong gia đình</span><b>${emoji} ${esc(relation)}</b></div><div><span>Email tài khoản</span><b>${esc(member.userEmail)}</b></div><div><span>Trạng thái</span><b>🟢 Đang tham gia</b></div><div><span>Ngày tham gia</span><b>${member.joinedAt ? fdate(member.joinedAt.slice(0, 10)) : 'Chưa rõ'}</b></div></div></div><div class="et-profile-section"><h3>💬 Ghi chú gia đình</h3><p class="et-profile-muted et-profile-note">${member.familyNote ? esc(member.familyNote) : 'Chưa có ghi chú cho thành viên.'}</p>${canUpdateInfo ? `<button type="button" class="btn-ghost-d" data-act="editFamilyRelationship" data-id="${esc(member.userEmail)}">${ic('i-pen-to-square')} Sửa thông tin</button>` : '<p class="et-profile-muted">Bạn chỉ có quyền xem thông tin.</p>'}<div class="et-profile-privacy">🔒 Ghi chú chỉ hiển thị trong không gian gia đình đang đăng nhập trên thiết bị này.</div></div></div>` : ''}
    </section>`;
  };

  const familyMembersTab = familyId => {
    const family = familyOf(familyId);
    const members = familyMembersOf(familyId).map(member => ({ ...member, user: findUser(member.userEmail) }));
    const pending = familyPendingRequests(familyId);
    const canManage = canManageFamily(familyId);
    const selected = members.find(m => m.userEmail === S.familyProfileEmail);
    if (selected) return familyMemberProfile(familyId, selected);
    const month = monthNow();
    const owners = members.filter(m => m.role === 'OWNER').length;
    const managers = members.filter(m => m.role === 'MANAGER').length;
    return `<div class="family-member-panel et-members-panel et-enter">
      <div class="family-action-row et-members-heading"><div><span class="dashboard-eyebrow">👨‍👩‍👧‍👦 KHÔNG GIAN GIA ĐÌNH</span><h3 class="card-title">THÀNH VIÊN GIA ĐÌNH</h3><p class="et-profile-muted">Quan hệ gia đình và quyền truy cập được quản lý độc lập.</p></div>${canManage ? `<button type="button" class="btn-primary" data-act="inviteMember">${ic('s-plus', 1)}Mời thành viên ✨</button>` : ''}</div>
      <div class="et-members-overview"><div><span aria-hidden="true">🏡</span><strong>${members.length}</strong><small>Đang tham gia</small></div><div><span aria-hidden="true">👑</span><strong>${owners}</strong><small>Chủ gia đình</small></div><div><span aria-hidden="true">🌟</span><strong>${managers}</strong><small>Quản lý tài chính</small></div></div>
      <div class="family-member-grid et-members-grid">${members.map((member, i) => {
        const data = familyTransactionFor(familyId, member.userEmail, month);
        const spent = data.filter(t => t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
        const isOwner = member.role === 'OWNER';
        const roleToken = isOwner ? 'owner' : member.role === 'MANAGER' ? 'manager' : 'member';
        const [key, rel, emoji] = familyRelationship(member);
        const canUpdate = canManage || member.userEmail === session.email;
        return `<article class="family-member-card et-member-card" style="--et-card-order:${i}"><span class="et-member-corner" aria-hidden="true">${isOwner ? '👑' : member.role === 'MANAGER' ? '🌟' : '💫'}</span><div class="et-member-header"><div class="family-member-icon et-member-avatar" aria-hidden="true">${emoji}</div><div class="family-member-body"><h3>${esc(member.user?.name || member.userEmail)}</h3><span class="et-member-relation">${esc(rel)} ${!key ? '· cần cập nhật' : ''}</span></div></div><div class="et-member-tags"><span class="family-role-badge role-${roleToken}">${esc(familyRole(member.role))}</span><span class="family-member-status">Đang tham gia</span></div><div class="et-member-expense"><small>💸 Chi tiêu chung tháng này</small><strong>${money(spent)}</strong><span>${data.length} giao dịch</span></div><div class="et-member-actions"><button type="button" class="btn-ghost-d" data-act="openFamilyProfile" data-id="${esc(member.userEmail)}">${ic('i-eye')} Xem hồ sơ</button>${canUpdate ? `<button type="button" class="sm et-member-edit" data-act="editFamilyRelationship" data-id="${esc(member.userEmail)}" aria-label="Chỉnh sửa quan hệ gia đình">${ic('i-pen-to-square')}</button>` : ''}</div></article>`;
      }).join('')}</div>
      <div class="family-permission-note et-family-help"><strong>💡 Quan hệ ≠ quyền quản lý</strong><span>“Bố, Mẹ, Anh, Chị…” là mối quan hệ; “Chủ gia đình, Quản lý tài chính, Thành viên” là quyền trong phần mềm.</span><span>🔒 Khoản chi cá nhân của mỗi người không xuất hiện trong thống kê gia đình.</span><span>Chọn <b>Xem hồ sơ</b> để xem giao dịch chung, chỉnh sửa quan hệ và quyền hạn.</span></div>
      ${pending.length ? `<div class="family-requests"><h3 class="card-title">YÊU CẦU THAM GIA</h3>${pending.map(member => `<div class="family-request-row"><div><strong>${esc(findUser(member.userEmail)?.name || member.userEmail)}</strong><small>Email: ${esc(member.userEmail)}</small></div>${canManage ? `<div class="family-inline-actions"><button type="button" class="sm" data-act="acceptFamilyMember" data-id="${esc(member.userEmail)}">Chấp nhận</button><button type="button" class="sm red" data-act="rejectFamilyMember" data-id="${esc(member.userEmail)}">Từ chối</button></div>` : '<span class="badge warn">Đang chờ duyệt</span>'}</div>`).join('')}</div>` : ''}
      ${canManage && familyInvitesFor(familyId).length ? `<div class="family-requests"><h3 class="card-title">LỜI MỜI ĐANG CHỜ</h3>${familyInvitesFor(familyId).map(invite => `<div class="family-request-row"><div><strong>${esc(invite.email)}</strong><small>${esc(familyRelationship(invite)[1])} · Đã mời ${formatTimestamp(invite.createdAt)}</small></div><button type="button" class="sm red" data-act="cancelFamilyInvite" data-id="${esc(invite.id)}">Hủy lời mời</button></div>`).join('')}</div>` : ''}
    </div>`;
  };
  const familyBudgetTab = familyId => {
    const family = familyOf(familyId);
    const month = monthRe.test(S.familyBudgetMonth || '') ? S.familyBudgetMonth : monthNow();
    const transactions = db.tx.filter(t => t.scope === 'family' && t.familyId === familyId && t.date.startsWith(month) && t.type === 'out');
    const spent = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const budget = Number(family?.monthlyBudget || 0);
    const remaining = budget - spent;
    const ratio = budget ? (spent / budget) * 100 : 0;
    const used = budget ? Math.max(0, Math.min(100, ratio)) : 0;
    const budgetState = budgetStatus(spent, budget);
    const budgetStateClass = budgetState === 'exhausted' ? 'warn' : budgetState;
    const canManage = canManageFamily(familyId);
    const entries = familyBudgets(familyId, month);
    const editing = entries.find(entry => entry.id === S.editFamilyCategoryBudget);
    const categoryBudgets = entries.slice().sort((a, b) => familyBudgetSpent(b) / Math.max(Number(b.amount), 1) - familyBudgetSpent(a) / Math.max(Number(a.amount), 1));
    return `<div class="family-budget-wrap">
      <div class="family-budget-title"><div><span class="dashboard-eyebrow">NGÂN SÁCH · ${esc(month)}</span><h3>Ngân sách gia đình</h3></div><label class="family-budget-period">Tháng <input id="familyBudgetMonth" type="month" value="${esc(month)}"></label>${canManage ? `<button type="button" class="sm" data-act="toggleFamilyBudget">${ic('i-pen-to-square')}${S.editFamilyBudget ? 'Đóng điều chỉnh' : 'Điều chỉnh ngân sách chung'}</button>` : ''}</div>
      ${S.editFamilyBudget && canManage ? `<form class="family-budget-edit" data-f="familyBudgetSettings" novalidate>${field('familyBudgetAmount', 'Ngân sách tháng (₫)', 'i-coins', { type: 'number', val: budget, attr: 'min="0" step="1000"' })}<div class="actions"><button type="button" class="btn-ghost-d" data-act="toggleFamilyBudget">Hủy</button><button class="btn-primary">Lưu ngân sách</button></div></form>` : ''}
      <div class="family-budget-header"><div><span>Ngân sách tháng</span><strong>${money(budget)}</strong></div><div><span>Đã sử dụng</span><strong>${money(spent)}</strong></div><div><span>Còn lại</span><strong>${money(remaining)}</strong></div></div>
      <div class="family-progress"><div class="family-progress-bar ${budgetStateClass}" style="width:${used}%"></div></div>
      <div class="family-progress-label ${budgetStateClass}"><span>${Math.round(budget ? ratio : 0)}%${budgetState === 'over' ? ' · Vượt ngân sách' : budgetState === 'exhausted' ? ' · Đã dùng hết ngân sách' : budgetState === 'warn' ? ' · Đã sử dụng ít nhất 80%' : ''}</span></div>
      ${budget && budgetState !== 'ok' ? `<div class="family-budget-alert ${budgetStateClass}">${budgetState === 'over' ? `Gia đình đã vượt ngân sách ${money(spent - budget)}.` : budgetState === 'exhausted' ? 'Gia đình đã sử dụng đúng 100% ngân sách tháng.' : 'Lưu ý: chi tiêu gia đình đã đạt ít nhất 80% ngân sách tháng.'}</div>` : ''}
      <section class="family-category-budgets"><div class="family-budget-title"><div><span class="dashboard-eyebrow">HẠN MỨC THEO DANH MỤC</span><h3>${esc(month)}</h3></div></div>
        ${canManage ? `<form class="family-budget-edit" data-f="familyCategoryBudget" novalidate>${field('familyBudgetCategoryCat', 'Danh mục Chi', 'i-layer-group', { tag: 'select', opts: catOpts(editing?.catId || '', 'Chọn danh mục Chi', 'out', [catOf(editing?.catId)], 'family', familyId) })}<div class="grid2">${field('familyBudgetCategoryMonth', 'Tháng', 's-cal', { type: 'month', val: editing?.month || month })}${field('familyBudgetCategoryAmount', 'Hạn mức (₫)', 'i-coins', { type: 'number', val: editing?.amount, attr: 'min="1" step="any"' })}</div><div class="actions">${editing ? '<button type="button" class="btn-ghost-d" data-act="cancelFamilyCategoryBudget">HỦY</button>' : ''}<button class="btn-primary">${editing ? 'Lưu hạn mức' : 'Thêm hạn mức danh mục'}</button></div></form>` : ''}
        <div class="family-budget-list">${categoryBudgets.length ? categoryBudgets.map(entry => {
          const actual = familyBudgetSpent(entry), status = budgetStatus(actual, entry.amount), state = status === 'exhausted' ? 'warn' : status;
          const pct = progress(actual, entry.amount);
          const alert = status === 'over' ? `Vượt hạn mức ${money(actual - entry.amount)}` : status === 'exhausted' ? 'Đã dùng hết 100%' : status === 'warn' ? 'Đã dùng ít nhất 80%' : 'Trong hạn mức';
          return `<article class="family-category-budget"><div class="family-budget-title"><div><h4>${esc(catOf(entry.catId)?.name || 'Danh mục đã xóa')}</h4><span>${esc(entry.month)}</span></div><span class="family-budget-state ${state}">${alert}</span>${canManage ? `<div class="cell-act"><button type="button" class="sm" data-act="editFamilyCategoryBudget" data-id="${esc(entry.id)}">Sửa</button><button type="button" class="sm red" data-act="delFamilyCategoryBudget" data-id="${esc(entry.id)}">Xóa</button></div>` : ''}</div>
            <div class="family-progress"><div class="family-progress-bar ${state}" style="width:${pct}%"></div></div><div class="progress-caption"><b>${money(actual)} đã dùng</b><span>${pct}%</span><span>Hạn mức ${money(entry.amount)}</span></div>
            ${status !== 'ok' ? `<p class="family-budget-alert ${state}">${alert} · ${money(actual)} / ${money(entry.amount)}.</p>` : ''}</article>`;
        }).join('') : '<div class="chart-empty">Chưa đặt hạn mức theo danh mục cho tháng này.</div>'}</div>
      </section>
    </div>`;
  };
  const familyFundTab = familyId => {
    const entries = db.familyFundEntries.filter(entry => entry.familyId === familyId).slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    const contributions = entries.filter(entry => entry.type === 'contribution').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const used = entries.filter(entry => entry.type === 'use').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const balance = contributions - used;
    return `<section class="family-fund-ledger">
      <div class="family-action-row"><div><span class="dashboard-eyebrow">QUỸ GIA ĐÌNH</span><h3 class="card-title">SỔ QUỸ CHUNG</h3><p class="family-fund-explainer">Theo dõi riêng các khoản đóng góp và sử dụng quỹ. Lịch sử được lưu độc lập với giao dịch cá nhân.</p></div><div class="family-inline-actions"><button type="button" class="btn-ghost-d" data-act="addFamilyFundEntry" data-id="contribution">${ic('s-plus', 1)}Đóng góp</button>${canManageFamily(familyId) ? `<button type="button" class="btn-primary" data-act="addFamilyFundEntry" data-id="use">${ic('i-arrow-up-right-from-square')}Ghi nhận sử dụng</button>` : ''}</div></div>
      <div class="family-fund-metrics"><article><span>Tổng đóng góp</span><strong class="inc">${money(contributions)}</strong></article><article><span>Đã sử dụng</span><strong class="exp">${money(used)}</strong></article><article><span>Số dư quỹ</span><strong>${money(balance)}</strong></article></div>
      <div class="family-requests"><h3 class="card-title">LỊCH SỬ QUỸ</h3>${entries.length ? `<div class="family-fund-history">${entries.map(entry => { const isContribution = entry.type === 'contribution'; return `<article class="family-fund-entry"><span class="family-fund-entry-icon ${isContribution ? 'contribution' : 'use'}">${isContribution ? '+' : '−'}</span><div><strong>${isContribution ? 'Đóng góp vào quỹ' : 'Sử dụng quỹ'}</strong><small>${esc(uname(entry.owner))} · ${fdate(entry.date || entry.createdAt?.slice(0, 10))}${entry.note ? ` · ${esc(entry.note)}` : ''}</small></div><strong class="${isContribution ? 'inc' : 'exp'}">${isContribution ? '+' : '−'}${money(entry.amount)}</strong></article>`; }).join('')}</div>` : '<div class="chart-empty">Chưa có biến động quỹ. Ghi nhận khoản đóng góp đầu tiên.</div>'}</div>
    </section>`;
  };
  const familyInviteInbox = () => {
    const invites = familyInvitesToMe();
    if (!invites.length) return '';
    return `<section class="family-invite-inbox"><div><span class="dashboard-eyebrow">LỜI MỜI</span><h3>Bạn được mời tham gia gia đình</h3></div>${invites.map(invite => { const family = familyOf(invite.familyId); return family ? `<article class="family-invite-card"><div><strong>${esc(family.name)}</strong><small>${esc(uname(invite.inviterEmail))} đã mời bạn · ${formatTimestamp(invite.createdAt)}</small></div><div class="family-inline-actions"><button type="button" class="sm" data-act="acceptFamilyInvite" data-id="${esc(invite.id)}">Chấp nhận</button><button type="button" class="sm red" data-act="rejectFamilyInvite" data-id="${esc(invite.id)}">Từ chối</button></div></article>` : ''; }).join('')}</section>`;
  };
  const familyReportTab = familyId => {
    const { transactions, byCategory } = familySummaryData(familyId);
    const income = transactions.filter(t => t.type === 'in').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const expense = transactions.filter(t => t.type === 'out').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    return `<div class="family-report-grid">
      <div class="family-report-stat"><span>Tổng chi lũy kế</span><strong>${money(expense)}</strong></div>
      <div class="family-report-stat"><span>Tổng thu lũy kế</span><strong>${money(income)}</strong></div>
      <div class="family-report-stat"><span>Chênh lệch lũy kế</span><strong>${money(income - expense)}</strong></div>
      <div class="family-report-stat"><span>Số giao dịch</span><strong>${transactions.length}</strong></div>
      <div class="family-report-chart"><h3>Chi tiêu theo danh mục</h3>${Object.keys(byCategory).length ? pie(byCategory) : '<div class="chart-empty">Chưa có dữ liệu để tạo báo cáo.</div>'}</div>
    </div>`;
  };
  const familySettingsTab = familyId => {
    const family = familyOf(familyId);
    if (!family) return '<div class="chart-empty">Chưa có gia đình</div>';
    if (family.ownerEmail !== session.email) return `<div class="family-settings-form"><h3>Cài đặt gia đình</h3><p>Chỉ chủ gia đình mới có thể thay đổi thông tin hoặc giải tán gia đình.</p><div class="family-code-row"><label>Mã gia đình</label><div class="family-code-box">${esc(family.code || 'FAM-000000')}</div><button type="button" class="btn-ghost-d" data-act="copyFamilyCode">Sao chép mã</button></div></div>`;
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
      return `${familyInviteInbox()}<div class="family-empty card"><div class="family-empty-title">👨‍👩‍👧‍👦 Quản lý chi tiêu gia đình</div><p>Quản lý các khoản chi tiêu chung của gia đình cùng các thành viên.</p><div class="family-empty-actions"><button type="button" class="btn-primary" data-act="createFamily">${ic('s-plus', 1)}Tạo gia đình</button><button type="button" class="btn-ghost-d" data-act="joinFamily">Tham gia bằng mã</button></div><div class="family-empty-why"><h3>Tại sao nên tạo gia đình?</h3><ul><li>• Theo dõi chi tiêu chung</li><li>• Quản lý ngân sách gia đình</li><li>• Theo dõi chi tiêu từng thành viên</li><li>• Xem báo cáo tài chính gia đình</li></ul></div></div>`;
    }
    const familyId = activeFamilyId();
    const family = familyOf(familyId);
    if (!family) return `<div class="family-empty card"><p>Chưa có gia đình</p></div>`;
    const activeTab = S.familyTab || 'overview';
    const tabPanelMap = {
      overview: familyOverviewTab(familyId),
      transactions: familyTransactionsTab(familyId),
      members: familyMembersTab(familyId),
      fund: familyFundTab(familyId),
      budget: familyBudgetTab(familyId),
      report: familyReportTab(familyId),
      settings: familySettingsTab(familyId)
    };
    return `${familyInviteInbox()}<div class="family-shell">
      <div class="card family-header-card">
        <div class="family-header-copy">
          <span class="dashboard-eyebrow">GIA ĐÌNH</span>
          <h2>${esc(family.name)}</h2>
        </div>
        ${memberships.length > 1 ? `<label class="family-selector-label">Không gian<select id="familySelector" class="family-filter" data-live>${opt(memberships.map(member => [member.familyId, familyOf(member.familyId)?.name || 'Gia đình']), familyId)}</select></label>` : ''}
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
    const entries = myGoals().slice().sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
    return `<form class="card" data-f="goal" novalidate><h2 class="card-title">${e.id ? 'SỬA' : 'TẠO'} MỤC TIÊU TIẾT KIỆM</h2>
      <div class="grid2">${field('gname', 'Tên mục tiêu', 'i-piggy-bank', { val: e.name })}${field('gtarget', 'Số tiền mục tiêu (₫)', 'i-coins', { type: 'number', val: e.target, attr: 'min="1"' })}
      ${e.id ? `<div class="goal-current-saving"><span>Đã tiết kiệm</span><strong>${money(goalSaved(e))}</strong><small>Thay đổi số tiền bằng chức năng đóng góp hoặc rút tiền.</small></div>` : field('gsaved', 'Số dư tiết kiệm ban đầu (₫)', 'i-wallet', { type: 'number', val: 0, attr: 'min="0" step="any"' })}
      ${field('gdate', 'Ngày hoàn thành', 's-cal', { type: 'date', val: e.deadline })}</div>
      ${field('gnote', 'Ghi chú', 'i-receipt', { tag: 'textarea', val: e.note })}
      <p class="family-form-hint">Đóng góp và rút tiền được ghi nhận là chuyển khoản giữa ví của bạn và ví mục tiêu; không tính thành thu nhập hoặc chi phí.</p>
      <div class="actions">${e.id ? '<button type="button" class="btn-ghost-d" data-act="cancelGoal">HỦY</button>' : ''}<button class="btn-primary">${e.id ? 'LƯU THAY ĐỔI' : 'TẠO MỤC TIÊU'}</button></div></form>
      <div class="card"><div class="card-head"><h2 class="card-title">MỤC TIÊU CỦA TÔI</h2><span class="badge">${entries.length} mục tiêu</span></div>
      ${entries.length ? `<div class="progress-list">${entries.map(g => {
        const saved = goalSaved(g), pct = progress(saved, g.target), done = saved >= Number(g.target);
        const movements = goalMovements(g).slice(0, 3);
        return `<article class="progress-item"><div class="card-head"><div><h3>${esc(g.name)}</h3><small>${g.deadline ? `Hoàn thành trước ${fdate(g.deadline)}` : 'Chưa đặt ngày hoàn thành'} · <span class="badge ${done ? 'ok' : ''}">${done ? 'Đã hoàn thành' : `${pct}% mục tiêu`}</span></small></div><div class="cell-act"><button class="sm" data-act="contributeGoal" data-id="${esc(g.id)}">${ic('s-plus', 1)}Đóng góp</button><button class="sm" data-act="withdrawGoal" data-id="${esc(g.id)}">Rút tiền</button><button class="sm" data-act="editGoal" data-id="${esc(g.id)}">${ic('i-pen-to-square')}Sửa</button><button class="sm red" data-act="delGoal" data-id="${esc(g.id)}">${ic('s-trash', 1)}Xóa</button></div></div>
          ${progressBar(saved, g.target, done ? 'ok' : '')}<div class="progress-caption"><b>${money(saved)}</b><span>${pct}%</span><span>Mục tiêu ${money(g.target)}</span></div>${g.note ? `<p class="goal-note">${esc(g.note)}</p>` : ''}
          ${movements.length ? `<div class="goal-movements"><strong>Đóng góp / rút tiền gần đây</strong>${movements.map(transaction => {
            const deposit = transaction.toAccountId === g.accountId;
            return `<div><span>${deposit ? 'Đóng góp' : 'Rút tiền'} · ${fdate(transaction.date)}${transaction.note ? ` · ${esc(transaction.note)}` : ''}</span><b class="${deposit ? 'inc' : 'exp'}">${deposit ? '+' : '−'}${money(transaction.amount)}</b></div>`;
          }).join('')}</div>` : ''}</article>`;
      }).join('')}</div>` : `<div class="chart-empty">Chưa có mục tiêu tiết kiệm.</div>`}</div>`;
  };
    const moneyAccountForm = () => `<form class="card money-account-form" data-f="moneyAccount" novalidate><div class="card-head"><div><span class="dashboard-eyebrow">TÀI KHOẢN MỚI</span><h2 class="card-title">THÊM VÍ / TÀI KHOẢN</h2></div><button type="button" class="sm" data-act="cancelMoneyAccount">ĐÓNG</button></div>
      ${field('aname', 'Tên tài khoản', 'i-wallet', { attr: 'maxlength="80"' })}
      <div class="grid2">${field('atype', 'Loại', 's-swap', { tag: 'select', opts: opt(ACCOUNT_TYPES, 'cash') })}${field('aopening', 'Số dư ban đầu (₫)', 'i-coins', { type: 'number', val: 0, attr: 'min="0" step="any"' })}</div>
      ${field('accountScope', 'Không gian ví', 'i-users', { tag: 'select', opts: opt([['personal', 'Ví cá nhân'], ['family', 'Ví quỹ chung gia đình']], S.familyWalletSetup ? 'family' : 'personal') })}
      <div id="familyAccountFields"${S.familyWalletSetup ? '' : ' hidden'}>${field('accountFamilyId', 'Gia đình', 'i-users', { tag: 'select', opts: opt(myFamilyMemberships().filter(member => canManageFamily(member.familyId)).map(member => [member.familyId, familyOf(member.familyId)?.name || 'Gia đình']), S.familyWalletSetup || '', 'Chọn gia đình') })}<small class="tx-field-hint">Ví gia đình được chia sẻ với thành viên đang hoạt động. Chỉ chủ gia đình/người quản lý có thể tạo và đối soát.</small></div>
      ${field('anote', 'Mô tả', 'i-receipt', { tag: 'textarea', attr: 'maxlength="500"' })}
      <div class="actions">${S.familyWalletSetup ? '<button type="button" class="btn-ghost-d" data-act="cancelFamilyWalletSetup">HỦY</button>' : '<button type="button" class="btn-ghost-d" data-act="cancelMoneyAccount">HỦY</button>'}<button class="btn-primary">LƯU</button></div></form>`;
  const moneyAccountsPage = () => {
    const accounts = visibleAccounts().filter(account => !account.hidden || S.showHiddenAccounts), activeAccounts = accounts.filter(account => !account.hidden);
    const personalTotal = activeAccounts.filter(account => !accountIsFamily(account)).reduce((sum, account) => sum + accountBalance(account), 0)
      + myGoals().reduce((sum, goal) => sum + goalSaved(goal), 0);
    const familyTotal = activeAccounts.filter(accountIsFamily).reduce((sum, account) => sum + accountBalance(account), 0);
    const total = personalTotal + familyTotal;
    return `<div class="money-accounts-page"><section class="card money-accounts-card"><div class="card-head"><div><span class="dashboard-eyebrow">SỐ DƯ THEO SỔ GIAO DỊCH</span><h2 class="card-title">VÍ / TÀI KHOẢN TIỀN</h2></div><span class="badge">${activeAccounts.length} đang sử dụng</span></div>
      <p class="money-account-intro">Số dư hiện tại = số dư đầu kỳ + giao dịch thu/chi + chuyển khoản + điều chỉnh đối soát.</p>
      <div class="money-account-list">${accounts.map(account => { const balance = accountBalance(account); return `<article class="money-account-card ${account.hidden ? 'is-hidden' : ''}"><div class="money-account-row"><span class="money-account-icon ${esc(account.type)}">${ic(account.type === 'wallet' ? 'i-mobile-screen-button' : 'i-wallet')}</span>
        <div class="money-account-copy"><b>${esc(account.name)}${account.hidden ? '<span class="money-hidden-badge">Đã ẩn</span>' : ''}</b><small>${esc(accountTypeLabel(account.type))} · ${accountIsFamily(account) ? `Quỹ chung · ${esc(familyOf(account.familyId)?.name || 'Gia đình')}` : 'Ví cá nhân'}${account.note ? ` · ${esc(account.note)}` : ''}</small></div>
        <strong>${money(balance)}</strong></div><div class="money-account-meta"><span>Đầu kỳ <b>${money(account.openingBalance)}</b></span><span>Hiện tại <b>${money(balance)}</b></span></div>
        <div class="money-account-actions"><button type="button" class="sm" data-act="showAccountLedger" data-id="${esc(account.id)}">Lịch sử</button>${!account.hidden && (!accountIsFamily(account) || canManageFamily(account.familyId)) ? `<button type="button" class="sm" data-act="reconcileAccount" data-id="${esc(account.id)}">Đối soát</button>` : ''}<button type="button" class="sm ${account.hidden ? '' : 'red'}" data-act="${account.hidden ? 'restoreAccount' : 'hideAccount'}" data-id="${esc(account.id)}">${account.hidden ? 'Hiện lại' : 'Ẩn ví'}</button></div></article>`; }).join('') || '<div class="chart-empty">Chưa có ví đang hiển thị.</div>'}</div>
      <div class="money-account-summary"><article><span>Ví cá nhân</span><strong>${money(personalTotal)}</strong></article><article><span>Quỹ chung được chia sẻ</span><strong>${money(familyTotal)}</strong></article><article><span>Tổng số dư đang xem</span><strong>${money(total)}</strong></article></div>
      <div class="actions"><button type="button" class="btn-primary" data-act="addMoneyAccount">${ic('s-plus', 1)}THÊM VÍ / TÀI KHOẢN</button><button type="button" class="btn-ghost-d" data-act="toggleHiddenAccounts">${S.showHiddenAccounts ? 'Ẩn ví đã lưu trữ' : 'Hiện ví đã ẩn'}</button></div></section>
      ${S.showMoneyAccountForm ? moneyAccountForm() : ''}</div>`;
  };
  const notifyBudgetStatus = (owner, eventKey, status, titlePrefix, text, familyId = '') => {
    if (status === 'ok') return;
    const label = status === 'over' ? 'đã vượt ngân sách' : status === 'exhausted' ? 'đã dùng hết 100%' : 'đã sử dụng ít nhất 80%';
    recordNotification(owner, `${eventKey}:${status}`, status === 'over' || status === 'exhausted' ? 'over' : 'warn',
      `${titlePrefix} ${label}`, text, familyId);
  };
  const syncBudgetNotifications = () => {
    const month = monthNow();
    myBudgets().filter(budget => budget.month === month).forEach(budget => {
      const spent = budgetSpent(budget), status = budgetStatus(spent, budget.amount);
      const category = catOf(budget.catId)?.name || 'Danh mục đã xóa';
      notifyBudgetStatus(session.email, `budget:personal:${budget.id}:${month}`, status, `Ngân sách cá nhân · ${category}`,
        `Đã chi ${money(spent)} trên hạn mức ${money(budget.amount)} trong tháng ${month}.`);
    });
    myFamilyMemberships().forEach(membership => {
      const family = familyOf(membership.familyId);
      if (!family) return;
      const transactions = db.tx.filter(transaction => transaction.scope === 'family' && transaction.familyId === family.id
        && transaction.date.startsWith(month) && transaction.type === 'out');
      const spent = transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
      if (Number(family.monthlyBudget) > 0) {
        notifyBudgetStatus(session.email, `budget:family:${family.id}:${month}`, budgetStatus(spent, family.monthlyBudget),
          `Ngân sách chung · ${family.name}`, `Đã chi ${money(spent)} trên hạn mức ${money(family.monthlyBudget)} trong tháng ${month}.`, family.id);
      }
      familyBudgets(family.id, month).forEach(budget => {
        const actual = familyBudgetSpent(budget), category = catOf(budget.catId)?.name || 'Danh mục đã xóa';
        notifyBudgetStatus(session.email, `budget:family-category:${budget.id}:${month}`, budgetStatus(actual, budget.amount),
          `Ngân sách gia đình · ${category}`, `Đã chi ${money(actual)} trên hạn mức ${money(budget.amount)} trong tháng ${month}.`, family.id);
      });
    });
    myGoals().forEach(goal => {
      const saved = goalSaved(goal);
      if (saved < Number(goal.target) && progress(saved, goal.target) >= 80) {
        recordNotification(session.email, `goal:${goal.id}:80`, 'goal', 'Mục tiêu tiết kiệm sắp hoàn thành',
          `${goal.name}: đã tiết kiệm ${money(saved)} trên ${money(goal.target)}.`);
      }
      if (saved >= Number(goal.target)) {
        recordNotification(session.email, `goal:${goal.id}:complete`, 'goal', 'Đã hoàn thành mục tiêu tiết kiệm',
          `${goal.name}: đã đạt ${money(saved)} trên mục tiêu ${money(goal.target)}.`);
      }
    });
  };
  const notificationPage = () => {
    const notifications = notificationsForMe(), unread = notifications.filter(notification => !notification.readAt).length;
    const typeLabels = { over: 'Ngân sách', warn: 'Cảnh báo', recurring: 'Định kỳ', invite: 'Gia đình', fund: 'Quỹ chung', account: 'Tài khoản', goal: 'Mục tiêu' };
    const typeIcons = { over: '!', warn: '↗', recurring: '↻', invite: '⌂', fund: '₫', account: '●', goal: '✓' };
    return `<section class="card notifications-page"><div class="card-head"><div><span class="dashboard-eyebrow">HỘP THƯ CỦA BẠN</span><h2 class="card-title">THÔNG BÁO</h2></div><div class="head-act"><span class="badge">${unread} chưa đọc · ${notifications.length} tổng cộng</span>${unread ? `<button type="button" class="sm" data-act="markAllNotificationsRead">Đánh dấu tất cả đã đọc</button>` : ''}</div></div>
      ${notifications.length ? `<div class="notice-list">${notifications.map(notification => `<article class="notice ${esc(notification.type)} ${notification.readAt ? 'is-read' : 'is-unread'}">
        <span class="notice-mark">${typeIcons[notification.type] || '•'}</span><div class="notice-copy"><div class="notice-meta"><span class="badge">${esc(typeLabels[notification.type] || 'Thông báo')}</span><time>${esc(formatTimestamp(notification.createdAt))}</time></div><h3>${esc(notification.title)}</h3><p>${esc(notification.text)}</p></div>
        ${!notification.readAt ? `<button type="button" class="sm notice-read-action" data-act="markNotificationRead" data-id="${esc(notification.id)}">Đã đọc</button>` : '<span class="notice-read-label">Đã đọc</span>'}</article>`).join('')}</div>`
        : `<div class="chart-empty">Bạn chưa có thông báo nào.</div>`}</section>`;
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
    const txFormCard = () => {
      const editing = db.tx.find(t => t.id === S.editTx && canEditFamilyTransaction(t));
      const copied = db.tx.find(t => t.id === S.copyTx && t.owner === session.email);
      const e = editing || copied || {};
      const transfer = e.type === 'transfer';
      const familyOptions = familyScopeOptions().filter(([value]) => value !== 'personal');
      const formScope = e.scope === 'family' ? 'family' : 'personal';
      const formFamilyId = e.familyId || activeFamilyId();
      const editingAccounts = editing ? db.accounts.filter(account => account.id === (editing.accountId || editing.account) || account.id === editing.toAccountId) : [];
      const accountOptions = [...new Map([...transactionAccounts(formScope, formFamilyId), ...editingAccounts].map(account => [account.id, [account.id, account.name]])).values()];
      const editingCategory = editing ? catOf(editing.catId) : null;
      const familyScopeControl = editing?.scope === 'family'
        ? `<div class="family-transaction-scope-note"><input type="hidden" name="scope" value="family"><input type="hidden" name="familyId" value="${esc(editing.familyId)}"><strong>Giao dịch dùng chung</strong><span>Giữ nguyên trong không gian ${esc(familyOf(editing.familyId)?.name || 'gia đình')}.</span></div>`
        : `<div class="family-scope-block"><label class="family-scope-radio"><input type="radio" name="scope" value="personal" ${(!e.scope || e.scope === 'personal') ? 'checked' : ''}> Cá nhân</label><label class="family-scope-radio"><input type="radio" name="scope" value="family" ${e.scope === 'family' ? 'checked' : ''}> Gia đình</label></div>`;
      const familyField = editing?.scope === 'family' ? '' : familyOptions.length
        ? `<div id="txFamilyFields"${formScope === 'family' ? '' : ' hidden'}>${field('familyId', 'Gia đình', 'i-users', { tag: 'select', opts: opt(familyOptions, formFamilyId, 'Chọn gia đình') })}</div>`
        : '';
      return `<form class="card tx-form-card" data-f="tx" novalidate>
        <div class="tx-form-heading"><div><span class="dashboard-eyebrow">${editing?.scope === 'family' ? 'CẬP NHẬT GIAO DỊCH DÙNG CHUNG' : editing ? 'CẬP NHẬT SỔ THU CHI' : 'GHI NHẬN DÒNG TIỀN'}</span><h2 class="card-title">${editing ? 'SỬA GIAO DỊCH' : 'THÊM GIAO DỊCH'}</h2></div><span class="tx-secure-tag">${ic('i-shield-halved')} ${editing?.scope === 'family' ? 'Chia sẻ có kiểm soát' : 'Lưu riêng tư'}</span></div>
        <div class="grid2">${field('type', 'Loại giao dịch', 's-swap', { tag: 'select', opts: opt(TRANSACTION_TYPES, e.type || 'out') })}
          <div class="amount-entry">${field('amount', 'Số tiền (₫)', 'i-coins', { type: 'number', val: e.amount, attr: 'min="0.01" step="any" inputmode="decimal"' })}
            <div class="amount-presets" role="group" aria-label="Mức tiền nhập nhanh"><span>Nhập nhanh</span><button type="button" class="sm" data-act="amountPreset" data-id="10000">10.000 ₫</button><button type="button" class="sm" data-act="amountPreset" data-id="100000">100.000 ₫</button></div></div>
          <div id="txCategoryField"${transfer ? ' hidden' : ''}>${field('cat', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(e.catId, 'Chọn danh mục', e.type || 'out', [editingCategory], formScope, formScope === 'family' ? formFamilyId : '') })}</div>
          ${field('date', 'Ngày giao dịch', 's-cal', { type: 'date', val: editing ? e.date : today(), attr: `max="${today()}"` })}</div>
        <div class="grid2 tx-transfer-fields" id="txTransferFields"${transfer ? '' : ' hidden'}>
          ${field('fromAccount', 'Chuyển từ ví', 'i-wallet', { tag: 'select', opts: opt(accountOptions, e.accountId || (!editing && !copied ? myAccounts().find(a => a.type === 'cash')?.id : ''), 'Chọn ví nguồn') })}
          ${field('toAccount', 'Chuyển đến ví', 'i-wallet', { tag: 'select', opts: opt(accountOptions, e.toAccountId, 'Chọn ví nhận') })}</div>
        <div id="txRegularFields"${transfer ? ' hidden' : ''}>
          ${field('account', 'Ví / Tài khoản', 'i-wallet', { tag: 'select', opts: opt(accountOptions, e.accountId || (!editing && !copied ? myAccounts().find(a => a.type === 'cash')?.id : ''), 'Chọn ví/tài khoản') })}
          ${field('payment', 'Phương thức thanh toán', 'i-wallet', { tag: 'select', opts: opt(PAYMENT_METHODS, e.paymentMethod, 'Chưa chọn') })}
          <div class="tx-recurring-receipt-grid"><div>${field('recurrence', 'Giao dịch định kỳ', 's-refresh', { tag: 'select', opts: opt([['none', 'Không lặp'], ['monthly', 'Hàng tháng']], e.recurrence || 'none') })}
            <small class="tx-field-hint">Lương, tiền điện, Internet, tiền thuê nhà…</small></div>
            <div class="tx-receipt-control"><div class="field"><div class="input-wrap fl"><input id="receipt" name="receipt" type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,application/pdf"><label for="receipt">Hóa đơn / chứng từ</label></div><div class="err-slot"><p class="error"><span></span></p></div></div><small>Ảnh hoặc PDF, tối đa 1 MB</small>
              ${receiptData(e.receipt) ? `<a href="${esc(receiptData(e.receipt))}" target="_blank" rel="noopener" class="tx-receipt-existing">${esc(e.receipt.name || 'Chứng từ đính kèm')}</a><label class="tx-receipt-remove"><input type="checkbox" name="receiptRemove" value="yes"> Gỡ chứng từ hiện tại</label>` : ''}</div></div>
        </div>
        ${familyScopeControl}${familyField}<div id="txFamilySetupHint" class="family-form-hint et-family-prereq" hidden></div>${editing?.scope === 'family' ? `<p class="family-form-hint">Người tạo: <strong>${esc(uname(editing.owner))}</strong> · Thành viên đang sửa không làm thay đổi người tạo.</p>` : ''}
        ${field('note', 'Mô tả / ghi chú', 'i-receipt', { tag: 'textarea', val: e.note, attr: 'maxlength="500"' })}
        <div class="actions"><button type="button" class="btn-ghost-d" data-act="cancel">HỦY</button><button class="btn-primary">${editing ? 'LƯU THAY ĐỔI' : 'LƯU GIAO DỊCH'}</button></div></form>`;
    };
  const PAGES = {
    user: {
      dash: { t: 'Dashboard', i: 'i-wallet', html: dashShell, dyn: userDash },
      tx: { t: 'Giao dịch', i: 'i-receipt', pg: true, rows: txRows, html: () => `${txFormCard()}
        <div class="card"><div class="card-head"><h2 class="card-title">DANH SÁCH GIAO DỊCH</h2><div class="head-act">
          <button type="button" class="sm red" id="bulk" data-act="bulk" disabled>${ic('s-trash', 1)}Xóa đã chọn (0)</button>
          <button type="button" class="sm" data-act="resetFilter">${ic('s-refresh', 1)}ĐẶT LẠI LỌC</button><button type="button" class="sm" data-act="exportTx">${ic('s-download', 1)}XUẤT CSV</button></div></div>
          <div class="toolbar tx-filters">${live('q', 'Tìm tên, ghi chú, mô tả…', 's-search', { val: S.q })}${live('ft', 'Lọc theo loại', 's-filter', { tag: 'select', opts: opt(TRANSACTION_TYPES, S.ft, 'Tất cả') })}${live('fc', 'Lọc theo danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(S.fc, 'Tất cả', undefined, [], S.scopeFilter && S.scopeFilter !== 'personal' ? 'family' : 'personal', S.scopeFilter || '') })}${live('fp', 'Phương thức thanh toán', 'i-wallet', { tag: 'select', opts: opt(PAYMENT_METHODS, S.fp, 'Tất cả') })}</div>
          <div class="toolbar tx-filters">${live('fw', 'Ví / tài khoản', 'i-wallet', { tag: 'select', opts: opt(myAccounts().map(account => [account.id, account.name]), S.fw, 'Tất cả ví') })}${live('fmin', 'Số tiền từ (₫)', 'i-coins', { type: 'number', val: S.fmin, attr: 'min="0" step="any"' })}${live('fmax', 'Số tiền đến (₫)', 'i-coins', { type: 'number', val: S.fmax, attr: 'min="0" step="any"' })}${transactionMemberOptions().length ? live('fm', 'Thành viên', 'i-users', { tag: 'select', opts: opt(transactionMemberOptions(), S.fm, 'Tất cả thành viên') }) : ''}</div>
          <div class="toolbar tx-filters">${live('scopeFilter', 'Phạm vi', 'i-layer-group', { tag: 'select', opts: opt(familyScopeOptions(), S.scopeFilter || 'personal') })}</div>
          <div class="toolbar two">${live('fd', 'Từ ngày', 's-cal', { type: 'date', val: S.fd })}${live('td', 'Đến ngày', 's-cal', { type: 'date', val: S.td })}</div>
          <div id="txSummary">${txSummary()}</div>
          ${table(['<input type="checkbox" class="chk" id="selAll" data-act="selAll" aria-label="Chọn tất cả">', 'STT', 'Loại', { l: 'Số tiền', k: 'amount' }, 'Danh mục / Ví nhận', { l: 'Ngày', k: 'date' }, 'Tài khoản', 'Thanh toán', 'Mô tả', 'Thao tác'], 'rows')}</div>` },
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
          <div class="grid2">${live('au', 'Người dùng', 'i-users', { tag: 'select', opts: opt(db.users.map(u => [u.email, u.name]), S.au, 'Tất cả người dùng') })}${live('at', 'Loại', 's-swap', { tag: 'select', opts: opt(TRANSACTION_TYPES, S.at, 'Tất cả') })}
          ${live('ac', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts(S.ac, 'Tất cả', undefined, [], 'all') })}<div class="grid2" style="gap:0 14px">${live('af', 'Từ ngày', 's-cal', { type: 'date', val: S.af })}${live('ae', 'Đến ngày', 's-cal', { type: 'date', val: S.ae })}</div></div>
          <div class="toolbar tx-filters">${live('fw', 'Ví / tài khoản', 'i-wallet', { tag: 'select', opts: opt(db.accounts.map(account => [account.id, `${account.name} · ${uname(account.owner)}`]), S.fw, 'Tất cả ví') })}${live('fmin', 'Số tiền từ (₫)', 'i-coins', { type: 'number', val: S.fmin, attr: 'min="0" step="any"' })}${live('fmax', 'Số tiền đến (₫)', 'i-coins', { type: 'number', val: S.fmax, attr: 'min="0" step="any"' })}</div>
          <div class="actions"><button type="button" class="btn-ghost-d" data-act="resetFilter">${ic('s-refresh', 1)}ĐẶT LẠI</button><button class="btn-primary">${ic('s-search', 1)}TÌM KIẾM</button></div></form>
        <div class="card"><div class="card-head"><h2 class="card-title">KẾT QUẢ</h2><button type="button" class="sm" data-act="exportTx">${ic('s-download', 1)}XUẤT CSV</button></div>${table(['STT', 'Người dùng', 'Loại', { l: 'Số tiền', k: 'amount' }, 'Danh mục / Ví nhận', { l: 'Ngày', k: 'date' }, 'Tài khoản', 'Thanh toán', 'Mô tả', 'Thao tác'], 'rows')}</div>` },
      notifications: { t: 'Thông báo', i: 'i-envelope', html: notificationPage },
      report: { t: 'Báo cáo', i: 'i-chart-pie', html: reportPage },
      account: { t: 'Tài khoản', i: 'i-user', html: accountPage }
    }
  }[isAdmin ? 'admin' : 'user'];

  /* ===== Điều hướng ===== */
  let page = document.body.dataset.page || location.hash.slice(1); if (!PAGES[page]) page = 'dash';
  if (!isAdmin && page === 'dash' && !monthRe.test(S.dm || '')) S.dm = monthNow();
  $('#side').innerHTML = `<div class="brand"><span class="brand-mark">${ic('i-wallet')}</span>Expense Tracker</div><span class="role-tag">${isAdmin ? 'QUẢN TRỊ VIÊN' : 'NGƯỜI DÙNG'}</span>` +
  Object.entries(PAGES).map(([k, p]) => `<button class="nav" data-p="${k}">${ic(p.i)}${p.t}${k === 'notifications' ? '<span class="notification-nav-count" aria-label="Thông báo chưa đọc"></span>' : ''}</button>`).join('') +
    `<button class="nav out" data-act="logout">${ic('i-arrow-right-to-bracket')}Đăng xuất</button>`;
  $('#uname').textContent = session.name;
  function render() {
    sync();
    syncRecurringTransactions();
    syncBudgetNotifications();
    const p = PAGES[page];
    $('#title').textContent = p.t; document.title = 'Expense Tracker — ' + p.t;
    document.querySelectorAll('.nav[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === page));
    const navCount = $('.notification-nav-count');
    if (navCount) {
      const count = unreadNotificationCount();
      navCount.textContent = count ? String(count) : '';
      navCount.hidden = !count;
    }
    $('#view').innerHTML = p.html(); refreshRows(); $('#side').classList.remove('open');
    if (!isAdmin) {   // nút nổi: thêm giao dịch nhanh
      if (!$('#fab')) document.body.insertAdjacentHTML('beforeend', `<button id="fab" class="btn-primary fab noprint" data-p="tx">${ic('s-plus', 1)}THÊM GIAO DỊCH</button>`);
      $('#fab').style.display = (page === 'tx' || (page === 'family' && (S.familyTab || 'overview') === 'members')) ? 'none' : '';
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
    const familyRows = $('#familyTxRows');
    if (familyRows) {
      const transactions = familyTransactionsFiltered(activeFamilyId());
      familyRows.innerHTML = familyTxRowsHtml(transactions) || '<tr><td colspan="8" class="family-empty-cell">Không có giao dịch phù hợp</td></tr>';
      const count = $('.family-filter-count'); if (count) count.textContent = `${transactions.length} giao dịch sau lọc`;
      const summary = $('.family-filter-summary'); if (summary) summary.outerHTML = familyTxSummaryHtml(transactions);
    }
  }
  const go = p => { page = p; Object.keys(S).forEach(k => delete S[k]); if (!isAdmin && p === 'dash') S.dm = monthNow(); history.replaceState(null, '', '#' + p); render(); };
  const setDm = v => { S.dm = v; const i = $('#dm'); if (i) i.value = v; refreshRows(); };
  const FILTER_KEYS = ['q', 'ft', 'fc', 'fp', 'fd', 'td', 'fw', 'fm', 'fmin', 'fmax', 'scopeFilter', 'au', 'at', 'ac', 'af', 'ae', 'uq', 'ur', 'us', 'pg', 'sel'];

  /* ===== Hành động ===== */
  const ACT = {
    markNotificationRead: id => {
      const notification = db.notifications.find(item => item.id === id && item.owner === session.email && !item.readAt);
      if (!notification) return;
      const previous = notification.readAt;
      notification.readAt = new Date().toISOString();
      try {
        saveNotifications();
      } catch (error) {
        notification.readAt = previous;
        console.error('Unable to mark notification as read', error);
        toast('Không thể cập nhật trạng thái thông báo. Vui lòng thử lại.');
        return;
      }
      render();
    },
    markAllNotificationsRead: () => {
      const unread = notificationsForMe().filter(notification => !notification.readAt);
      if (!unread.length) return;
      const readAt = new Date().toISOString();
      unread.forEach(notification => { notification.readAt = readAt; });
      try {
        saveNotifications();
      } catch (error) {
        unread.forEach(notification => { delete notification.readAt; });
        console.error('Unable to mark notifications as read', error);
        toast('Không thể cập nhật trạng thái thông báo. Vui lòng thử lại.');
        return;
      }
      render(); toast(`Đã đánh dấu ${unread.length} thông báo là đã đọc`);
    },
    pw: el => { const i = el.parentElement.querySelector('input'), s = i.type === 'password'; i.type = s ? 'text' : 'password'; el.firstElementChild.firstElementChild.setAttribute('href', s ? '#i-eye-slash' : '#i-eye'); },
    amountPreset: value => { const input = $('#amount'), amount = Number(value); if (!input || ![10000, 100000].includes(amount)) return; input.value = String(amount); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); },
    cancel: () => { delete S.editTx; delete S.copyTx; delete S.editCat; render(); },
    cancelBudget: () => { delete S.editBudget; render(); },
    cancelGoal: () => { delete S.editGoal; render(); },
    addMoneyAccount: () => { S.showMoneyAccountForm = true; render(); scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); },
    cancelMoneyAccount: () => { delete S.showMoneyAccountForm; render(); },
    cancelFamilyWalletSetup: () => {
      const familyId = S.familyWalletSetup;
      delete S.familyWalletSetup; delete S.showMoneyAccountForm;
      if (familyId && familyMemberOf(familyId)) { S.familyId = familyId; page = 'family'; history.replaceState(null, '', '#family'); }
      render();
    },
    toggleHiddenAccounts: () => { S.showHiddenAccounts = !S.showHiddenAccounts; render(); },
    showAccountLedger: id => {
      const account = db.accounts.find(item => item.id === id && accountCanUse(item));
      if (!account) return toast('Không tìm thấy ví hoặc bạn không có quyền xem');
      const events = accountLedger(account);
      openDlg(`<h2 class="card-title">LỊCH SỬ SỐ DƯ · ${esc(account.name)}</h2><p class="money-account-intro">${accountIsFamily(account) ? 'Ví quỹ chung' : 'Ví cá nhân'} · Số dư hiện tại ${money(accountBalance(account))}</p>
        <div class="money-ledger-list">${events.map(event => `<article class="money-ledger-item"><div><span class="money-ledger-kind ${esc(event.kind)}">${esc(event.kind === 'opening' ? 'Đầu kỳ' : event.kind === 'adjustment' ? 'Đối soát' : event.kind === 'transfer' ? 'Chuyển ví' : event.kind === 'in' ? 'Thu' : 'Chi')}</span><strong>${esc(event.label)}</strong><small>${event.kind === 'opening' ? 'Số dư khởi tạo' : esc(formatTimestamp(event.date))}</small></div><div><b class="${event.amount >= 0 ? 'inc' : 'exp'}">${event.amount > 0 ? '+' : ''}${money(event.amount)}</b><small>Sau giao dịch: ${money(event.balanceAfter)}</small></div></article>`).join('') || '<div class="chart-empty">Chưa có biến động số dư.</div>'}</div><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">ĐÓNG</button></div>`, true);
    },
    reconcileAccount: id => {
      const account = db.accounts.find(item => item.id === id && accountCanUse(item));
      if (!account || (accountIsFamily(account) && !canManageFamily(account.familyId))) return toast('Bạn không có quyền đối soát ví này');
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const data = Object.fromEntries(new FormData(dform));
        const actual = Number(data.actualBalance);
        const errors = {};
        if (data.actualBalance == null || String(data.actualBalance).trim() === '' || !Number.isFinite(actual) || Math.abs(actual) > 999999999999) errors.actualBalance = 'Nhập số dư thực tế hợp lệ';
        if ((data.reconcileNote || '').trim().length > 240) errors.reconcileNote = 'Ghi chú tối đa 240 ký tự';
        if (!showErr(dform, errors)) return;
        const delta = actual - accountBalance(account);
        if (!delta) { dlg.close(); toast('Số dư đã khớp, không cần điều chỉnh'); return; }
        const entry = { id: uid(), accountId: account.id, owner: session.email, delta, note: (data.reconcileNote || '').trim(), createdAt: new Date().toISOString() };
        db.accountAdjustments.push(entry);
        try {
          saveAccountAdjustments();
        } catch (error) {
          db.accountAdjustments = db.accountAdjustments.filter(item => item.id !== entry.id);
          console.error('Unable to save account reconciliation', error);
          toast('Không thể lưu đối soát. Vui lòng kiểm tra dung lượng lưu trữ trình duyệt.', 4200);
          return;
        }
        recordNotification(session.email, `account:reconciled:${entry.id}`, 'account', 'Đã đối soát số dư tài khoản',
          `${account.name}: ${delta > 0 ? 'tăng' : 'giảm'} ${money(Math.abs(delta))}${entry.note ? ` · ${entry.note}` : ''}.`);
        render(); dlg.close(); toast(`Đã đối soát số dư ${account.name}`);
      };
      openDlg(`<h2 class="card-title">ĐỐI SOÁT · ${esc(account.name)}</h2><div class="money-reconcile-current"><span>Số dư theo sổ</span><strong>${money(accountBalance(account))}</strong></div>${field('actualBalance', 'Số dư thực tế (₫)', 'i-coins', { type: 'number', val: accountBalance(account), attr: 'step="any"' })}${field('reconcileNote', 'Lý do / ghi chú', 'i-receipt', { tag: 'textarea', attr: 'maxlength="240"' })}<p class="family-form-hint">Hệ thống sẽ ghi nhận phần chênh lệch thành một bút toán đối soát, không sửa/xóa giao dịch cũ.</p><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">GHI ĐIỀU CHỈNH</button></div>`);
    },
    hideAccount: id => {
      const account = db.accounts.find(item => item.id === id && accountCanUse(item));
      if (!account || (accountIsFamily(account) && !canManageFamily(account.familyId))) return toast('Bạn không có quyền ẩn ví này');
      confirmBox(`Ẩn ví "${account.name}"? Số dư và lịch sử vẫn được giữ nguyên.`, () => {
        account.hidden = true; account.hiddenAt = new Date().toISOString();
        try { saveAccounts(); } catch (error) {
          account.hidden = false; delete account.hiddenAt;
          console.error('Unable to hide account', error); toast('Không thể ẩn ví. Vui lòng thử lại.'); return;
        }
        render(); toast('Đã ẩn ví, dữ liệu lịch sử được giữ nguyên');
      });
    },
    restoreAccount: id => {
      const account = db.accounts.find(item => item.id === id && accountCanUse(item));
      if (!account || (accountIsFamily(account) && !canManageFamily(account.familyId))) return toast('Bạn không có quyền khôi phục ví này');
      account.hidden = false; delete account.hiddenAt;
      try { saveAccounts(); } catch (error) {
        account.hidden = true;
        console.error('Unable to restore account', error); toast('Không thể hiện lại ví. Vui lòng thử lại.'); return;
      }
      render(); toast('Đã hiện lại ví');
    },
    closeDlg: () => dlg.close(),
    familyTab: id => { S.familyTab = id || 'overview'; if (id !== 'members') { delete S.familyProfileEmail; delete S.familyProfileTab; } render(); },
    resetFamilyTxFilter: () => { delete S.familyTxSearch; delete S.familyTxMember; delete S.familyTxMonth; delete S.familyTxType; render(); },
    toggleFamilyBudget: () => { S.editFamilyBudget = !S.editFamilyBudget; render(); },
    editFamilyCategoryBudget: id => {
      const entry = familyBudgets(activeFamilyId()).find(budget => budget.id === id);
      if (!entry || !canManageFamily(entry.familyId)) return toast('Bạn không có quyền sửa hạn mức này');
      S.editFamilyCategoryBudget = id; S.familyBudgetMonth = entry.month; render();
    },
    cancelFamilyCategoryBudget: () => { delete S.editFamilyCategoryBudget; render(); },
    delFamilyCategoryBudget: id => {
      const entry = familyBudgets(activeFamilyId()).find(budget => budget.id === id);
      if (!entry || !canManageFamily(entry.familyId)) return toast('Bạn không có quyền xóa hạn mức này');
      confirmBox('Xóa hạn mức danh mục này?', () => {
        db.budgets = db.budgets.filter(budget => budget.id !== id);
        saveBudgets(); delete S.editFamilyCategoryBudget; render(); toast('Đã xóa hạn mức danh mục');
      });
    },
    acceptFamilyInvite: id => {
      const invite = db.familyInvites.find(item => item.id === id && item.status === 'PENDING' && (item.email || '').toLowerCase() === session.email.toLowerCase());
      const family = invite && familyOf(invite.familyId);
      if (!invite || !family) return toast('Lời mời không hợp lệ hoặc đã hết hạn');
      const existing = db.familyMembers.find(member => member.familyId === family.id && member.userEmail === session.email);
      if (existing?.status === 'ACTIVE') return toast('Bạn đã là thành viên của gia đình này');
      if (existing) {
        existing.status = 'ACTIVE'; existing.role = 'MEMBER'; existing.relationship = invite.relationship || existing.relationship || ''; existing.joinedAt = new Date().toISOString();
      } else {
        db.familyMembers.push({ id: uid(), familyId: family.id, userEmail: session.email, relationship: invite.relationship || '', role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date().toISOString() });
      }
      invite.status = 'ACCEPTED'; invite.respondedAt = new Date().toISOString();
      S.familyId = family.id; S.familyTab = 'overview';
      saveFamilyMembers(); saveFamilyInvites();
      recordNotification(invite.inviterEmail, `family-invite:${invite.id}:accepted`, 'invite', 'Lời mời gia đình được chấp nhận',
        `${findUser(session.email)?.name || session.email} đã tham gia gia đình ${family.name}.`, family.id);
      render(); toast(`Bạn đã tham gia ${family.name}`);
    },
    rejectFamilyInvite: id => {
      const invite = db.familyInvites.find(item => item.id === id && item.status === 'PENDING' && (item.email || '').toLowerCase() === session.email.toLowerCase());
      if (!invite) return toast('Lời mời không hợp lệ hoặc đã hết hạn');
      invite.status = 'REJECTED'; invite.respondedAt = new Date().toISOString();
      saveFamilyInvites();
      recordNotification(invite.inviterEmail, `family-invite:${invite.id}:rejected`, 'invite', 'Lời mời gia đình bị từ chối',
        `${session.name} đã từ chối lời mời tham gia ${familyOf(invite.familyId)?.name || 'gia đình'}.`, invite.familyId);
      render(); toast('Đã từ chối lời mời');
    },
    openFamilyProfile: id => {
      const family = activeFamily();
      if (!family || !familyMemberOf(family.id) || !familyMemberOf(family.id, id)) return toast('Không thể xem thành viên này');
      S.familyTab = 'members'; S.familyProfileEmail = id; S.familyProfileTab = 'overview'; S.familyProfileMonth = monthNow();
      render(); document.querySelector('.family-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    backFamilyMembers: () => { delete S.familyProfileEmail; delete S.familyProfileTab; delete S.familyProfileMonth; render(); },
    familyProfileTab: id => {
      if (!['overview', 'transactions', 'permissions', 'info'].includes(id)) return;
      S.familyProfileTab = id; render();
    },
    familyProfileAll: () => { S.familyProfileMonth = 'all'; render(); },
    editFamilyRelationship: id => {
      const family = activeFamily();
      const member = family && familyMemberOf(family.id, id);
      if (!family || !member || !(canManageFamily(family.id) || id === session.email)) return toast('Bạn không có quyền sửa hồ sơ này');
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const data = Object.fromEntries(new FormData(dform));
        const relation = data.memberRelationship === 'none' ? '' : String(data.memberRelationship || '');
        const note = String(data.memberFamilyNote || '').trim();
        if (!FAMILY_RELATIONS.some(([value]) => value === relation)) return toast('Quan hệ không hợp lệ');
        if (note.length > 240) return toast('Ghi chú tối đa 240 ký tự');
        const original = { relationship: member.relationship, familyNote: member.familyNote };
        member.relationship = relation; member.familyNote = note;
        try { saveFamilyMembers(); } catch (error) {
          member.relationship = original.relationship; member.familyNote = original.familyNote;
          console.error('Lưu hồ sơ gia đình thất bại:', error); return toast('Không thể lưu. Hãy kiểm tra dung lượng lưu trữ.');
        }
        dlg.close(); render(); toast('Đã cập nhật hồ sơ thành viên ✨');
      };
      openDlg(`<div class="et-edit-modal"><div class="et-modal-emoji" aria-hidden="true">💖</div><h2>Chỉnh sửa hồ sơ gia đình</h2><p>👤 ${esc(findUser(id)?.name || id)}</p>${field('memberRelationship', 'Quan hệ trong gia đình', 'i-users', { tag: 'select', opts: opt(FAMILY_RELATIONS.map(([value, label]) => [value || 'none', label]), member.relationship || 'none') })}${field('memberFamilyNote', 'Ghi chú trong gia đình', 'i-receipt', { tag: 'textarea', val: member.familyNote || '', attr: 'maxlength="240"' })}<p class="et-profile-muted">🛡️ Quan hệ gia đình không tự động thay đổi quyền truy cập.</p><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">Hủy</button><button type="submit" class="btn-primary" value="ok">💾 Lưu hồ sơ</button></div></div>`, true);
    },
    editFamilyRole: id => {
      const family = activeFamily();
      const member = family && familyMemberOf(family.id, id);
      if (!family || !canManageFamilyRoles(family.id)) return toast('Chỉ chủ gia đình mới được phân quyền');
      if (!member || member.role === 'OWNER' || member.userEmail === family.ownerEmail) return toast('Không thể thay đổi quyền chủ gia đình bằng biểu mẫu này');
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const role = new FormData(dform).get('memberRole');
        if (!['MEMBER', 'MANAGER'].includes(role)) return toast('Quyền được chọn không hợp lệ');
        const original = member.role;
        member.role = role;
        try { saveFamilyMembers(); } catch (error) { member.role = original; console.error(error); return toast('Lưu phân quyền thất bại'); }
        dlg.close(); render(); toast('Đã cập nhật quyền thành viên 🛡️');
      };
      openDlg(`<div class="et-edit-modal"><div class="et-modal-emoji" aria-hidden="true">🛡️</div><h2>Phân quyền thành viên</h2><p>${esc(findUser(id)?.name || id)}</p><div class="et-role-picker"><label><input type="radio" name="memberRole" value="MEMBER" ${member.role === 'MEMBER' ? 'checked' : ''}><span>🤝 <b>Thành viên</b><small>Xem & thêm giao dịch chung, sửa khoản của mình.</small></span></label><label><input type="radio" name="memberRole" value="MANAGER" ${member.role === 'MANAGER' ? 'checked' : ''}><span>🌟 <b>Quản lý tài chính</b><small>Duyệt thành viên, quản lý ngân sách và giao dịch chung.</small></span></label></div><p class="et-profile-muted">🔒 Chỉ chủ gia đình có thể thay đổi phân quyền; không ảnh hưởng tới quan hệ gia đình.</p><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">Hủy</button><button type="submit" class="btn-primary" value="ok">Lưu quyền</button></div></div>`, true);
    },
    toggleFamilyManager: id => {
      const family = activeFamily();
      if (!family || !canManageFamilyRoles(family.id)) return toast('Chỉ chủ gia đình mới được phân quyền');
      const member = db.familyMembers.find(item => item.familyId === family.id && item.userEmail === id && item.status === 'ACTIVE' && item.userEmail !== family.ownerEmail);
      if (!member) return toast('Không tìm thấy thành viên hợp lệ');
      member.role = member.role === 'MANAGER' ? 'MEMBER' : 'MANAGER';
      saveFamilyMembers(); render(); toast(member.role === 'MANAGER' ? 'Đã bổ nhiệm người quản lý' : 'Đã đổi về vai trò thành viên');
    },
    addFamilyFundEntry: type => {
      const family = activeFamily();
      const entryType = type === 'use' ? 'use' : 'contribution';
      if (!family || !familyMemberOf(family.id)) return toast('Bạn cần là thành viên đang hoạt động của gia đình');
      if (entryType === 'use' && !canManageFamily(family.id)) return toast('Chỉ chủ gia đình hoặc người quản lý được ghi nhận sử dụng quỹ');
      const title = entryType === 'use' ? 'Ghi nhận sử dụng quỹ' : 'Đóng góp vào quỹ chung';
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const data = Object.fromEntries(new FormData(dform));
        const amount = Number(data.fundAmount);
        const errors = {};
        if (data.fundAmount == null || String(data.fundAmount).trim() === '' || !Number.isFinite(amount) || amount <= 0) errors.fundAmount = 'Số tiền phải lớn hơn 0';
        if ((data.fundNote || '').trim().length > 240) errors.fundNote = 'Ghi chú tối đa 240 ký tự';
        if (!showErr(dform, errors)) return;
        const entry = { id: uid(), familyId: family.id, owner: session.email, type: entryType, amount, note: (data.fundNote || '').trim(), date: today(), createdAt: new Date().toISOString() };
        db.familyFundEntries.push(entry);
        try {
          saveFamilyFundEntries();
        } catch (error) {
          db.familyFundEntries = db.familyFundEntries.filter(item => item.id !== entry.id);
          console.error('Unable to save family fund entry', error);
          toast('Không thể lưu biến động quỹ. Vui lòng kiểm tra dung lượng lưu trữ trình duyệt.', 4200);
          return;
        }
        const actor = findUser(session.email)?.name || session.email;
        familyMembersOf(family.id).forEach(member => recordNotification(member.userEmail, `family-fund:${entry.id}`, 'fund',
          entryType === 'contribution' ? 'Thành viên đóng góp quỹ chung' : 'Quỹ chung có khoản sử dụng',
          `${actor} ${entryType === 'contribution' ? 'đã đóng góp' : 'đã ghi nhận sử dụng'} ${money(amount)}${entry.note ? ` · ${entry.note}` : ''}.`,
          family.id));
        S.familyTab = 'fund'; render(); dlg.close(); toast(entryType === 'use' ? 'Đã ghi nhận khoản sử dụng quỹ' : 'Đã ghi nhận khoản đóng góp');
      };
      openDlg(`<h2 class="card-title">${title}</h2>${field('fundAmount', 'Số tiền (₫)', 'i-coins', { type: 'number', val: '', attr: 'min="1" step="1000"' })}${field('fundNote', 'Nội dung', 'i-receipt', { tag: 'textarea', attr: 'maxlength="240"' })}<p class="family-form-hint">Thành viên: ${esc(findUser(session.email)?.name || session.email)} · ${fdate(today())}</p><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">Lưu vào sổ quỹ</button></div>`);
    },
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
        else if (db.familyMembers.some(member => member.familyId === family.id && member.userEmail === session.email && ['ACTIVE', 'PENDING'].includes(member.status))) errors.famCode = 'Bạn đã có yêu cầu hoặc đã là thành viên của gia đình này';
        if (!showErr(dform, errors)) return;
        const member = { id: uid(), familyId: family.id, userEmail: session.email, role: 'MEMBER', status: 'PENDING', createdAt: new Date().toISOString() };
        db.familyMembers.push(member);
        saveFamilyMembers(); dlg.close(); render(); toast('Yêu cầu tham gia đã được gửi.');
      };
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:14px">Tham gia gia đình</h2>${field('famCode', 'Nhập mã', 'i-users', { attr: 'maxlength="20"' })}<div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">Gửi yêu cầu</button></div>`);
    },
    inviteMember: () => {
      const family = activeFamily();
      if (!family || !canManageFamily(family.id)) return toast('Bạn không có quyền mời thành viên');
      dform.onsubmit = e => {
        if (e.submitter?.value !== 'ok') return;
        e.preventDefault();
        const d = Object.fromEntries(new FormData(dform));
        const email = (d.inviteEmail || '').trim().toLowerCase();
        const errors = {};
        if (!EMAIL_RE.test(email)) errors.inviteEmail = 'Email không hợp lệ';
        else if (db.familyMembers.some(member => member.familyId === family.id && (member.userEmail || '').toLowerCase() === email && ['ACTIVE', 'PENDING'].includes(member.status))) errors.inviteEmail = 'Email này đã là thành viên hoặc có yêu cầu đang chờ';
        else if (familyInvitesFor(family.id).some(invite => (invite.email || '').toLowerCase() === email)) errors.inviteEmail = 'Email này đã có lời mời đang chờ';
        if (!showErr(dform, errors)) return;
        const invite = { id: uid(), familyId: family.id, inviterEmail: session.email, email,
          relationship: FAMILY_RELATIONS.some(([key]) => key === d.inviteRelationship) ? d.inviteRelationship : '',
          status: 'PENDING', createdAt: new Date().toISOString() };
        db.familyInvites.push(invite);
        try {
          saveFamilyInvites();
        } catch (error) {
          db.familyInvites = db.familyInvites.filter(item => item.id !== invite.id);
          console.error('Unable to save family invitation', error);
          toast('Không thể gửi lời mời. Vui lòng thử lại.');
          return;
        }
        recordNotification(email, `family-invite:${invite.id}:received`, 'invite', 'Bạn được mời tham gia gia đình',
          `${session.name} đã mời bạn tham gia ${family.name}.`, family.id);
        recordNotification(session.email, `family-invite:${invite.id}:sent`, 'invite', 'Đã gửi lời mời gia đình',
          `Lời mời tham gia ${family.name} đã được gửi đến ${email}.`, family.id);
        dlg.close(); render(); toast('Mời thành viên đã được gửi.');
      };
      openDlg(`<h2 style="color:var(--blue-900);margin-bottom:14px">Mời thành viên</h2>${field('inviteEmail', 'Email', 'i-envelope', { type: 'email' })}${field('inviteRelationship', 'Quan hệ với gia đình', 'i-users', { tag: 'select', opts: opt(FAMILY_RELATIONS.filter(([key]) => key).map(([key, label]) => [key, label]), '', 'Cập nhật sau khi tham gia') })}<div class="family-code-row"><label>Mã gia đình</label><div class="family-code-box">${esc(family.code || 'FAM-000000')}</div><button type="button" class="btn-ghost-d" data-act="copyFamilyCode">Sao chép mã</button></div><div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" value="ok">Gửi lời mời</button></div>`);
    },
    cancelFamilyInvite: id => {
      const family = activeFamily(), invite = db.familyInvites.find(item => item.id === id && item.familyId === family?.id && item.status === 'PENDING');
      if (!family || !canManageFamily(family.id) || !invite) return;
      confirmBox(`Hủy lời mời gửi đến ${invite.email}?`, () => {
        invite.status = 'CANCELLED'; invite.respondedAt = new Date().toISOString();
        saveFamilyInvites(); render(); toast('Đã hủy lời mời');
      });
    },
    copyFamilyCode: () => {
      const family = activeFamily();
      if (!family) return;
      if (navigator.clipboard) navigator.clipboard.writeText(family.code || '').then(() => toast('Mã gia đình đã được sao chép')).catch(() => toast('Không thể sao chép mã gia đình'));
      else toast('Mã gia đình: ' + family.code);
    },
    exportFamilyTx: () => {
      const transactions = familyTransactionsFiltered(activeFamilyId());
      if (!transactions.length) return toast('Không có giao dịch phù hợp để xuất');
      download(`giao-dich-gia-dinh-${today()}.csv`, [
        ['Ngày', 'Loại', 'Số tiền', 'Danh mục', 'Thành viên', 'Ví / Tài khoản', 'Phương thức thanh toán', 'Mô tả'],
        ...transactions.map(tx => [fdate(tx.date), tx.type === 'transfer' ? 'Chuyển ví nội bộ' : tx.type === 'in' ? 'Thu' : 'Chi', tx.amount, tx.type === 'transfer' ? `${accountLabel(tx.accountId)} → ${accountLabel(tx.toAccountId)}` : cname(tx), uname(tx.owner), accountLabel(tx.accountId || tx.account), paymentLabel(tx.paymentMethod), tx.note || ''])
      ]);
    },
    addFamilyTransaction: () => {
      const family = activeFamily();
      if (!family || !db.familyMembers.some(member => member.familyId === family.id && member.userEmail === session.email && member.status === 'ACTIVE')) return toast('Bạn cần là thành viên đang hoạt động của gia đình');
      const accounts = familyAccounts(family.id);
      if (!accounts.length) {
        if (!canManageFamily(family.id)) return toast('Gia đình chưa có ví quỹ chung. Hãy nhờ chủ gia đình hoặc người quản lý tạo ví trước.');
        S.familyWalletSetup = family.id; S.showMoneyAccountForm = true; page = 'moneyAccounts'; history.replaceState(null, '', '#moneyAccounts'); render();
        return toast('Tạo ví quỹ chung để bắt đầu ghi giao dịch gia đình');
      }
      dform.dataset.f = 'tx'; dform.onsubmit = null; dform.innerHTML = `<h2 class="card-title">THÊM GIAO DỊCH GIA ĐÌNH</h2>
        <div class="grid2">${field('type', 'Loại', 's-swap', { tag: 'select', opts: opt(TYPES, 'out') })}${field('amount', 'Số tiền', 'i-coins', { type: 'number', val: 0, attr: 'min="1000" step="1000"' })}
        ${field('cat', 'Danh mục', 'i-layer-group', { tag: 'select', opts: catOpts('', 'Chọn danh mục', 'out', [], 'family', family.id) })}${field('date', 'Ngày', 's-cal', { type: 'date', val: today(), attr: `max="${today()}"` })}</div>
        ${field('account', 'Ví quỹ chung', 'i-wallet', { tag: 'select', opts: opt(accounts.map(a => [a.id, a.name]), '', 'Chọn ví quỹ') })}
        ${field('payment', 'Phương thức thanh toán', 'i-wallet', { tag: 'select', opts: opt(PAYMENT_METHODS, 'cash', 'Chưa chọn') })}
        ${field('familyId', 'Gia đình', 'i-users', { tag: 'select', opts: opt([[family.id, family.name]], family.id) })}
        <p class="family-form-hint">📂 Bạn có thể chọn danh mục chung (mặc định) hoặc danh mục riêng do chủ gia đình/quản lý tạo. <strong>Giao dịch dùng chung</strong> sẽ hiển thị cho thành viên ACTIVE của gia đình này. Khoản cá nhân không xuất hiện trong thống kê gia đình. Người thực hiện: <strong>${esc(findUser(session.email)?.name || session.email)}</strong>.</p>
        ${field('note', 'Ghi chú', 'i-receipt', { tag: 'textarea', attr: 'maxlength="500"' })}
        <div class="field" style="display:none"><input id="scope" name="scope" value="family"></div>
        <div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary" type="submit">LƯU</button></div>`; if (!dlg.open) dlg.showModal();
    },
    acceptFamilyMember: id => { const family = activeFamily(); const member = db.familyMembers.find(m => m.userEmail === id && m.status === 'PENDING' && m.familyId === family?.id); if (!family || !canManageFamily(family.id)) return toast('Bạn không có quyền duyệt thành viên'); if (!member) return toast('Yêu cầu không còn hợp lệ'); member.status = 'ACTIVE'; member.role = 'MEMBER'; member.joinedAt = new Date().toISOString(); saveFamilyMembers(); render(); toast('Đã chấp nhận thành viên'); },
    rejectFamilyMember: id => { const family = activeFamily(); const member = db.familyMembers.find(m => m.userEmail === id && m.status === 'PENDING' && m.familyId === family?.id); if (!family || !canManageFamily(family.id)) return toast('Bạn không có quyền duyệt thành viên'); if (!member) return toast('Yêu cầu không còn hợp lệ'); member.status = 'REJECTED'; saveFamilyMembers(); render(); toast('Đã từ chối yêu cầu'); },
    removeFamilyMember: id => { const family = activeFamily(); if (!family || !canManageFamily(family.id)) return toast('Bạn không có quyền xóa thành viên'); const member = db.familyMembers.find(m => m.userEmail === id && m.familyId === family.id && m.status === 'ACTIVE'); if (!member || id === session.email || (member.role !== 'MEMBER' && family.ownerEmail !== session.email)) return toast('Không thể xóa chủ gia đình hoặc thành viên có vai trò cao hơn');
      confirmBox('Loại thành viên khỏi gia đình? Tài khoản và các giao dịch chung cũ sẽ được giữ nguyên.', () => { member.status = 'REMOVED'; member.removedAt = new Date().toISOString(); saveFamilyMembers(); if (S.familyProfileEmail === id) delete S.familyProfileEmail; render(); toast('Đã loại thành viên, dữ liệu chung được giữ lại'); }); },
    deleteFamily: () => { const family = activeFamily(); if (!family || family.ownerEmail !== session.email) return; confirmBox('Bạn có chắc muốn giải tán gia đình?', () => { db.families = db.families.filter(f => f.id !== family.id); db.budgets = db.budgets.filter(budget => budget.scope !== 'family' || budget.familyId !== family.id); db.familyMembers = db.familyMembers.filter(m => m.familyId !== family.id); db.familyInvites = db.familyInvites.filter(i => i.familyId !== family.id); db.familyFundEntries = db.familyFundEntries.filter(entry => entry.familyId !== family.id); db.accounts = db.accounts.filter(account => !accountIsFamily(account) || account.familyId !== family.id); db.accountAdjustments = db.accountAdjustments.filter(entry => db.accounts.some(account => account.id === entry.accountId)); db.tx = db.tx.filter(t => t.scope !== 'family' || t.familyId !== family.id); saveFamilies(); saveBudgets(); saveFamilyMembers(); saveFamilyInvites(); saveFamilyFundEntries(); saveAccounts(); saveAccountAdjustments(); saveTx(); render(); toast('Gia đình đã được giải tán'); }); },
    /* --- Giao dịch --- */
    editTx: id => { const t = db.tx.find(x => x.id === id); if (!t || !canEditFamilyTransaction(t)) return toast('Bạn không có quyền chỉnh sửa giao dịch này'); delete S.copyTx; S.editTx = id; page = 'tx'; history.replaceState(null, '', '#tx'); render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    copyTx: id => { const t = db.tx.find(x => x.id === id); if (!t || t.owner !== session.email) return; delete S.editTx; S.copyTx = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); toast('Đã sao chép vào biểu mẫu; kiểm tra rồi lưu'); },
    viewTx: id => { const t = db.tx.find(x => x.id === id); if (!t || !canViewTransaction(t)) return;
      const receiptHref = receiptData(t.receipt);
      openDlg(`<h2 class="card-title">CHI TIẾT GIAO DỊCH</h2><dl class="tx-detail">
        <div><dt>Loại</dt><dd><span class="badge ${t.type}">${t.type === 'in' ? 'Thu nhập' : t.type === 'out' ? 'Chi tiêu' : 'Chuyển ví nội bộ'}</span></dd></div><div><dt>Số tiền</dt><dd class="${t.type === 'in' ? 'inc' : t.type === 'out' ? 'exp' : ''}">${money(t.amount)}</dd></div>
        <div><dt>${t.type === 'transfer' ? 'Ví nhận' : 'Danh mục'}</dt><dd>${t.type === 'transfer' ? esc(accountLabel(t.toAccountId)) : esc(cname(t))}</dd></div><div><dt>Ngày</dt><dd>${fdate(t.date)}</dd></div><div><dt>Ví / Tài khoản</dt><dd>${esc(accountLabel(t.accountId || t.account))}</dd></div><div><dt>Phương thức thanh toán</dt><dd>${esc(paymentLabel(t.paymentMethod))}</dd></div>
        <div><dt>Phạm vi</dt><dd>${t.scope === 'family' ? `Dùng chung · ${esc(familyOf(t.familyId)?.name || 'Gia đình')}` : 'Cá nhân'}</dd></div><div><dt>Mô tả</dt><dd>${esc(t.note) || '—'}</dd></div><div><dt>Lặp lại</dt><dd>${t.recurrence === 'monthly' ? 'Hàng tháng' : t.recurringSource ? `Giao dịch định kỳ · ${esc(t.recurrencePeriod || '')}` : 'Không'}</dd></div>
        <div><dt>Chứng từ</dt><dd>${receiptHref ? `<a href="${esc(receiptHref)}" download="${esc(t.receipt.name || 'chung-tu')}">${esc(t.receipt.name || 'Xem / tải chứng từ')}</a>` : '—'}</dd></div>
        <div><dt>Tạo lúc</dt><dd>${formatTimestamp(t.createdAt)}</dd></div><div><dt>Cập nhật</dt><dd>${formatTimestamp(t.updatedAt || t.createdAt)}</dd></div>
        </dl><div class="actions">${!isAdmin && canEditFamilyTransaction(t) ? `<button type="button" class="sm" data-act="editTxDetail" data-id="${esc(t.id)}">${ic('i-pen-to-square')}Sửa</button>` : ''}<button type="button" class="btn-ghost-d" data-act="closeDlg">ĐÓNG</button></div>`, true); },
    editTxDetail: id => { dlg.close(); ACT.editTx(id); },
    delTx: id => { const t = db.tx.find(x => x.id === id); if (!t || (!isAdmin && !canDeleteFamilyTransaction(t))) return toast('Bạn không có quyền xóa giao dịch này');
      confirmDeleteTx(t, () => deleteTransactionsWithUndo([t])); },   // TODO: DELETE /api/transactions/:id
    selTx: id => { const s = S.sel = S.sel || []; const i = s.indexOf(id); i < 0 ? s.push(id) : s.splice(i, 1); refreshRows(); },
    selAll: () => { const s = S.sel = S.sel || [], every = PAGE_IDS.every(id => s.includes(id)); S.sel = every ? s.filter(id => !PAGE_IDS.includes(id)) : [...new Set([...s, ...PAGE_IDS])]; refreshRows(); },
    bulk: () => { const selected = (S.sel || []).map(id => db.tx.find(transaction => transaction.id === id && transaction.owner === session.email)).filter(Boolean); if (!selected.length) return;
      confirmBox(`Xóa ${selected.length} giao dịch đã chọn?`, () => { S.sel = []; deleteTransactionsWithUndo(selected); }); },
    sort: k => { const cur = S.sk || 'date', dir = S.sd || 'desc'; S.sd = k === cur ? (dir === 'desc' ? 'asc' : 'desc') : 'desc'; S.sk = k; S.pg = 1;
      document.querySelectorAll('th[data-act="sort"]').forEach(th => { th.textContent = th.dataset.l + arrow(th.dataset.id); }); refreshRows(); },
    pg: n => { S.pg = Math.max(1, Math.min(PG.pages, Number(n))); refreshRows(); },
    resetFilter: () => { FILTER_KEYS.forEach(k => delete S[k]); render(); },
    exportTx: () => { const l = filterTx(); if (!l.length) return toast('Chưa có dữ liệu để xuất'); download(`giao-dich-${today()}.csv`, txCsv(l)); },
    /* --- Danh mục --- */
    editCat: id => { const category = catOf(id); if (!category || !canEditCat(category)) return; S.editCat = id; S.catScope = categoryScopeOf(category); render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    hideCat: id => {
      const category = catOf(id);
      if (!category || !canEditCat(category)) return toast('Bạn không có quyền ẩn danh mục này');
      if (db.cats.some(child => child.parentId === id && !child.hidden)) return toast('Hãy ẩn các danh mục con trước khi ẩn danh mục cha');
      category.hidden = true;
      try { saveCats(); } catch (error) {
        delete category.hidden;
        console.error('Unable to hide category', error);
        return toast('Không thể ẩn danh mục. Vui lòng thử lại.');
      }
      render(); toast('Đã ẩn danh mục. Lịch sử giao dịch vẫn được giữ nguyên');
    },
    showCat: id => {
      const category = catOf(id);
      if (!category || !canEditCat(category)) return toast('Bạn không có quyền hiện danh mục này');
      const parent = category.parentId && catOf(category.parentId);
      if (parent?.hidden) return toast('Hãy hiện danh mục cha trước');
      category.hidden = false;
      try { saveCats(); } catch (error) {
        category.hidden = true;
        console.error('Unable to restore category', error);
        return toast('Không thể hiện danh mục. Vui lòng thử lại.');
      }
      render(); toast('Đã hiện lại danh mục');
    },
    delCat: id => {
      const category = catOf(id);
      if (!category || !canDelCat(category)) return toast('Bạn không có quyền xóa danh mục này');
      if (db.tx.some(transaction => transaction.catId === id)) return toast('Không thể xóa danh mục đang có giao dịch. Hãy ẩn danh mục để giữ lịch sử.');
      if (db.cats.some(child => child.parentId === id)) return toast('Không thể xóa danh mục đang có danh mục con. Hãy xử lý các mục con trước.');
      confirmBox(`Xóa danh mục "${category.name}"?`, () => {
        const previous = db.cats;
        db.cats = db.cats.filter(item => item.id !== id);
        try { saveCats(); } catch (error) {
          db.cats = previous;
          console.error('Unable to delete category', error);
          toast('Không thể xóa danh mục. Vui lòng thử lại.');
          return;
        }
        render(); toast('Đã xóa danh mục');
      });
    },
    /* --- Dashboard --- */
    dm: id => setDm(id === 'all' ? '' : id === 'now' ? today().slice(0, 7) : shiftMonth(monthRe.test(S.dm || '') ? S.dm : today().slice(0, 7), Number(id))),
    refreshDash: () => { sync(); render(); toast('Đã làm mới dữ liệu từ thiết bị'); },
    editBudget: id => { if (!myBudgets().some(b => b.id === id)) return; S.editBudget = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    delBudget: id => { if (!myBudgets().some(b => b.id === id)) return; confirmBox('Xóa ngân sách này?', () => { db.budgets = db.budgets.filter(b => b.id !== id); saveBudgets(); delete S.editBudget; render(); toast('Đã xóa ngân sách'); }); },
    editGoal: id => { if (!myGoals().some(g => g.id === id)) return; S.editGoal = id; render(); scrollTo({ top: 0, behavior: 'smooth' }); },
    contributeGoal: id => ACT.goalMovement(id, 'deposit'),
    withdrawGoal: id => ACT.goalMovement(id, 'withdraw'),
    goalMovement: (id, type) => {
      const goal = myGoals().find(item => item.id === id);
      if (!goal) return toast('Không tìm thấy mục tiêu tiết kiệm');
      if (!ensureGoalAccount(goal)) return;
      const accounts = myAccounts();
      if (!accounts.length) return toast('Bạn cần có ít nhất một ví cá nhân để đóng góp hoặc rút tiền');
      dform.dataset.f = 'goalMovement'; dform.onsubmit = null;
      dform.innerHTML = `<h2 class="card-title">${type === 'deposit' ? 'ĐÓNG GÓP VÀO MỤC TIÊU' : 'RÚT TIỀN TỪ MỤC TIÊU'}</h2>
        <p class="goal-movement-balance"><strong>${esc(goal.name)}</strong><span>Số dư hiện tại: ${money(goalSaved(goal))}</span></p>
        ${field('goalMovementAmount', 'Số tiền (₫)', 'i-coins', { type: 'number', attr: 'min="0.01" step="any"' })}
        ${field('goalMovementAccount', type === 'deposit' ? 'Chuyển từ ví' : 'Chuyển vào ví', 'i-wallet', { tag: 'select', opts: opt(accounts.map(account => [account.id, account.name]), '', 'Chọn ví cá nhân') })}
        ${field('goalMovementNote', 'Ghi chú', 'i-receipt', { tag: 'textarea', attr: 'maxlength="240"' })}
        <input type="hidden" name="goalMovementType" value="${type}"><input type="hidden" name="goalMovementGoalId" value="${esc(goal.id)}">
        <div class="actions"><button type="button" class="btn-ghost-d" data-act="closeDlg">HỦY</button><button class="btn-primary">${type === 'deposit' ? 'ĐÓNG GÓP' : 'RÚT TIỀN'}</button></div>`;
      if (!dlg.open) dlg.showModal();
    },
    delGoal: id => {
      const goal = myGoals().find(item => item.id === id);
      if (!goal) return;
      if (goalMovements(goal).length) return toast('Không thể xóa mục tiêu đã có giao dịch đóng góp/rút tiền để bảo toàn lịch sử ví. Bạn có thể giữ mục tiêu làm lịch sử tiết kiệm.');
      confirmBox('Xóa mục tiêu tiết kiệm này?', () => {
        const previousGoals = db.goals.map(item => ({ ...item })), previousAccounts = db.accounts.map(item => ({ ...item }));
        db.goals = db.goals.filter(item => item.id !== id);
        db.accounts = db.accounts.filter(account => account.id !== goal.accountId || account.goalId !== goal.id);
        try {
          saveGoals(); saveAccounts();
        } catch (error) {
          db.goals = previousGoals; db.accounts = previousAccounts;
          console.error('Unable to delete savings goal', error);
          toast('Không thể xóa mục tiêu. Vui lòng thử lại.', 3600);
          return;
        }
        delete S.editGoal; render(); toast('Đã xóa mục tiêu');
      });
    },
    /* --- Báo cáo --- */
    repRange: id => {
      const form = $('[data-f="report"]');
      if (!form) return;
      const period = id === 'reset' ? 'month' : id;
      if (!REPORT_PERIODS.some(([key]) => key === period)) return;
      const [start, end] = reportRange(period);
      form.elements.rperiod.value = period;
      form.elements.rf.value = start; form.elements.rt.value = end;
      if (id === 'reset') {
        form.elements.raccount.value = ''; form.elements.rc.value = '';
        ['rmember', 'ru', 'rty'].forEach(name => { if (form.elements.namedItem(name)) form.elements.namedItem(name).value = ''; });
      }
      FORM.report(form, Object.fromEntries(new FormData(form)));
    },
    rv: id => { S.rv = id; if (S.rrun) $('#repOut').innerHTML = reportOut(); },
    exportRep: (format = 'csv') => {
      if (!S.rrun) return toast('Hãy tạo báo cáo trước khi xuất');
      const rows = reportExportRows(reportList());
      const scope = (S.reportScope || 'personal').replace(/[^\w-]/g, '-');
      if (format === 'xls') downloadExcel(`bao-cao-${scope}-${today()}.xls`, rows);
      else download(`bao-cao-${scope}-${today()}.csv`, rows);
    },
    printRep: () => { if (!S.rrun) return toast('Hãy bấm XEM BÁO CÁO trước khi in'); window.print(); },
    /* --- Người dùng (admin) --- */
    lock: id => { const u = findUser(id); if (!u) return; if (id === session.email) return toast('Bạn không thể khóa chính mình');
      u.status = locked(u) ? 'ACTIVE' : 'LOCKED'; saveUsers();
      recordNotification(id, `account:status:${u.status}:${uid()}`, 'account', u.status === 'LOCKED' ? 'Tài khoản đã bị khóa' : 'Tài khoản đã được mở khóa',
        u.status === 'LOCKED' ? 'Quản trị viên đã khóa tài khoản của bạn. Hãy liên hệ quản trị viên nếu cần hỗ trợ.' : 'Quản trị viên đã mở khóa tài khoản của bạn.');
      refreshRows(); toast(locked(u) ? 'Đã khóa tài khoản' : 'Đã mở khóa'); },   // TODO: PATCH /api/users/:id/lock
    role: id => { const u = findUser(id); if (!u) return; if (id === session.email) return toast('Bạn không thể đổi quyền của chính mình');
      const r = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
      confirmBox(`Đổi quyền của ${u.name} thành ${r}?`, () => { const x = findUser(id); if (!x) return; x.role = r; saveUsers();
        recordNotification(id, `account:role:${r}:${uid()}`, 'account', 'Quyền tài khoản đã thay đổi', `Quản trị viên đã cập nhật quyền của bạn thành ${r}.`);
        refreshRows(); toast('Đã cập nhật quyền'); }); },   // TODO: PATCH /api/users/:id/role
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
        const removedAccounts = db.accounts.filter(account => account.owner === e && !accountIsFamily(account));
        const removedAccountIds = new Set(removedAccounts.map(account => account.id));
        db.users = db.users.filter(u => u.email !== e); db.tx = db.tx.filter(t => t.owner !== e || t.scope === 'family'); db.cats = db.cats.filter(c => c.owner !== e);
        db.budgets = db.budgets.filter(b => b.owner !== e); db.goals = db.goals.filter(g => g.owner !== e); db.accounts = db.accounts.filter(account => account.owner !== e || accountIsFamily(account)); db.accountAdjustments = db.accountAdjustments.filter(entry => !removedAccountIds.has(entry.accountId));
        saveUsers(); saveTx(); saveCats(); saveBudgets(); saveGoals(); saveAccounts(); saveAccountAdjustments(); leave(); }); },   // TODO: DELETE /api/account
    logout: () => leave()
  };

  /* ===== Gửi form ===== */
  const FORM = {
    moneyAccount: (f, d) => {
      const errors = {}, name = (d.aname || '').trim(), openingBalance = Number(d.aopening);
      if (!name || name.length > 80) errors.aname = 'Nhập tên tài khoản (tối đa 80 ký tự)';
      if (!ACCOUNT_TYPES.some(([key]) => key === d.atype)) errors.atype = 'Chọn loại tài khoản';
      if (!Number.isFinite(openingBalance) || openingBalance < 0 || openingBalance > 999999999999) errors.aopening = 'Số dư ban đầu phải hợp lệ và không âm';
      if (!['personal', 'family'].includes(d.accountScope)) errors.accountScope = 'Chọn không gian ví hợp lệ';
      const family = d.accountScope === 'family' ? familyOf(d.accountFamilyId) : null;
      if (d.accountScope === 'family' && (!family || !familyMemberOf(family.id) || !canManageFamily(family.id))) errors.accountFamilyId = 'Chỉ chủ gia đình hoặc người quản lý mới tạo được ví quỹ chung';
      if ((d.anote || '').length > 500) errors.anote = 'Mô tả không được vượt quá 500 ký tự';
      if (db.accounts.some(account => account.owner === session.email && (account.scope || 'personal') === (d.accountScope === 'family' ? 'family' : 'personal') && (account.familyId || '') === (family?.id || '') && account.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) errors.aname = 'Tên tài khoản đã tồn tại trong không gian này';
      if (!showErr(f, errors)) return;
      const account = { id: uid(), owner: session.email, name, type: d.atype, openingBalance, note: (d.anote || '').trim(), scope: d.accountScope === 'family' ? 'family' : 'personal', ...(family ? { familyId: family.id } : {}), hidden: false, createdAt: new Date().toISOString() };
      db.accounts.push(account);
      try { saveAccounts(); } catch (error) {
        db.accounts = db.accounts.filter(item => item.id !== account.id);
        console.error('Unable to save money account', error);
        toast('Không thể lưu ví. Vui lòng kiểm tra dung lượng lưu trữ trình duyệt.', 4200);
        return;
      }
      recordNotification(session.email, `account:wallet-created:${account.id}`, 'account', 'Đã thêm ví / tài khoản tiền',
        `${account.name} · Số dư đầu kỳ ${money(account.openingBalance)}.`);
      const setupFamilyId = S.familyWalletSetup;
      delete S.showMoneyAccountForm; delete S.familyWalletSetup;
      if (setupFamilyId && familyMemberOf(setupFamilyId)) { S.familyId = setupFamilyId; S.familyTab = 'transactions'; page = 'family'; history.replaceState(null, '', '#family'); }
      render(); toast(family ? 'Đã tạo ví quỹ chung' : 'Đã thêm ví cá nhân');
    },
    budget: (f, d) => {
      const errors = {}, amount = Number(d.bamount), editing = myBudgets().find(b => b.id === S.editBudget);
      const cat = catOf(d.bcat);
      if (!cat || cat.type !== 'out' || !categoryCanUse(cat, 'personal', '')) errors.bcat = 'Chọn danh mục Chi hợp lệ';
      if (!monthRe.test(d.bmonth || '')) errors.bmonth = 'Chọn tháng hợp lệ';
      if (!(amount > 0)) errors.bamount = 'Nhập ngân sách lớn hơn 0';
      if (db.budgets.some(b => b.id !== (editing && editing.id) && b.owner === session.email && b.catId === d.bcat && b.month === d.bmonth)) errors.bcat = 'Danh mục này đã có ngân sách trong tháng';
      if (!showErr(f, errors)) return;
      const value = { catId: d.bcat, month: d.bmonth, amount };
      if (editing) {
        Object.assign(editing, value);
        const savingsAccount = db.accounts.find(account => account.id === editing.accountId && account.goalId === editing.id);
        if (savingsAccount) savingsAccount.name = `Tiết kiệm · ${name}`;
      }
      else db.budgets.push({ id: uid(), owner: session.email, ...value });
      saveBudgets(); delete S.editBudget; render(); toast(editing ? 'Đã cập nhật ngân sách' : 'Đã tạo ngân sách');
    },
    goal: (f, d) => {
      const errors = {}, target = Number(d.gtarget), saved = Number(d.gsaved || 0), editing = myGoals().find(g => g.id === S.editGoal);
      const name = (d.gname || '').trim();
      if (!name || name.length > 100) errors.gname = 'Nhập tên mục tiêu (tối đa 100 ký tự)';
      if (!Number.isFinite(target) || target <= 0 || target > 999999999999) errors.gtarget = 'Số tiền mục tiêu phải lớn hơn 0 và hợp lệ';
      if (!editing && (!Number.isFinite(saved) || saved < 0 || saved > 999999999999)) errors.gsaved = 'Số dư ban đầu phải là số không âm và hợp lệ';
      if (!d.gdate || !validReportDate(d.gdate)) errors.gdate = 'Chọn thời hạn hợp lệ';
      if (!showErr(f, errors)) return;
      if ((d.gnote || '').length > 500) return showErr(f, { gnote: 'Ghi chú tối đa 500 ký tự' });
      const previousGoals = db.goals, previousAccounts = db.accounts;
      const value = { name, target, deadline: d.gdate, note: (d.gnote || '').trim() };
      let goal;
      if (editing) Object.assign(editing, value);
      else {
        goal = { id: uid(), owner: session.email, saved, ...value };
        const savingsAccount = { id: uid(), owner: session.email, goalId: goal.id, name: `Tiết kiệm · ${name}`,
          type: 'bank', openingBalance: saved, scope: 'personal', hidden: true, note: 'Ví nội bộ của mục tiêu tiết kiệm',
          createdAt: new Date().toISOString() };
        goal.accountId = savingsAccount.id;
        db.goals = [...db.goals, goal]; db.accounts = [...db.accounts, savingsAccount];
      }
      try {
        saveAccounts();
        saveGoals();
      } catch (error) {
        db.goals = previousGoals; db.accounts = previousAccounts;
        console.error('Unable to save savings goal', error);
        toast('Không thể lưu mục tiêu tiết kiệm. Vui lòng kiểm tra dung lượng lưu trữ.', 4200);
        return;
      }
      delete S.editGoal; render(); toast(editing ? 'Đã cập nhật mục tiêu' : 'Đã tạo mục tiêu');
    },
    goalMovement: (f, d) => {
      const goal = myGoals().find(item => item.id === d.goalMovementGoalId);
      const type = d.goalMovementType, amount = Number(d.goalMovementAmount);
      const wallet = myAccounts().find(account => account.id === d.goalMovementAccount);
      const savingsAccount = goal && db.accounts.find(account => account.id === goal.accountId && account.goalId === goal.id);
      const errors = {};
      if (!goal || !savingsAccount) return toast('Mục tiêu hoặc ví tiết kiệm không còn hợp lệ');
      if (!['deposit', 'withdraw'].includes(type)) errors.goalMovementType = 'Chọn thao tác hợp lệ';
      if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999999) errors.goalMovementAmount = 'Nhập số tiền lớn hơn 0 và hợp lệ';
      if (!wallet || !accountCanUse(wallet) || accountIsFamily(wallet)) errors.goalMovementAccount = 'Chọn ví cá nhân hợp lệ';
      if (type === 'withdraw' && Number.isFinite(amount) && amount > goalSaved(goal)) errors.goalMovementAmount = 'Số tiền rút vượt quá số dư mục tiêu';
      if ((d.goalMovementNote || '').length > 240) errors.goalMovementNote = 'Ghi chú tối đa 240 ký tự';
      if (!showErr(f, errors)) return;
      const transaction = { id: uid(), owner: session.email, type: 'transfer', amount, date: today(),
        accountId: type === 'deposit' ? wallet.id : savingsAccount.id,
        toAccountId: type === 'deposit' ? savingsAccount.id : wallet.id,
        scope: 'personal', note: `${type === 'deposit' ? 'Đóng góp' : 'Rút tiền'} · ${goal.name}${d.goalMovementNote ? ` · ${d.goalMovementNote.trim()}` : ''}`,
        createdAt: new Date().toISOString() };
      const nextTransactions = [...db.tx, transaction];
      try {
        write(TX_KEY, nextTransactions);
        db.tx = nextTransactions;
      } catch (error) {
        console.error('Unable to save savings goal transfer', error);
        toast('Không thể ghi nhận giao dịch. Vui lòng thử lại.', 3800);
        return;
      }
      dlg.close(); render();
      toast(type === 'deposit' ? 'Đã đóng góp vào mục tiêu' : 'Đã rút tiền khỏi mục tiêu');
    },
    tx: async (f, d) => {
      const errors = {}, amount = Number(d.amount), transfer = d.type === 'transfer';
      const category = catOf(d.cat), scope = d.scope === 'family' ? 'family' : 'personal';
      const familyId = scope === 'family' ? (d.familyId || activeFamilyId()) : null;
      const sourceAccountId = transfer ? d.fromAccount : d.account;
      const editingTransaction = S.editTx && db.tx.find(transaction => transaction.id === S.editTx && canEditFamilyTransaction(transaction));
      const availableAccounts = transactionAccounts(scope, familyId);
      editingTransaction && [editingTransaction.accountId, editingTransaction.toAccountId].forEach(id => {
        const account = db.accounts.find(item => item.id === id);
        if (account && accountIsFamily(account) === (scope === 'family') && (!accountIsFamily(account) || account.familyId === familyId) && !availableAccounts.some(item => item.id === account.id)) availableAccounts.push(account);
      });
      const sourceAccount = availableAccounts.find(account => account.id === sourceAccountId);
      if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999999) errors.amount = 'Nhập số tiền lớn hơn 0 và không vượt quá giới hạn';
      if (!TRANSACTION_TYPES.some(([type]) => type === d.type)) errors.type = 'Chọn loại giao dịch hợp lệ';
      if (!transfer && !d.cat) errors.cat = 'Chọn danh mục';
      else if (!transfer && (category?.type !== d.type || (!categoryCanUse(category, scope, familyId) && editingTransaction?.catId !== category?.id)
        || (category.hidden && editingTransaction?.catId !== category.id)
        || (db.cats.some(child => child.parentId === category?.id && !child.hidden) && editingTransaction?.catId !== category.id))) errors.cat = 'Danh mục không hợp lệ hoặc không đúng loại Thu/Chi';
      if (!sourceAccount || !accountCanUse(sourceAccount)) errors[transfer ? 'fromAccount' : 'account'] = 'Chọn ví thuộc phạm vi giao dịch';
      if (transfer) {
        const destination = availableAccounts.find(account => account.id === d.toAccount);
        if (!destination || !accountCanUse(destination)) errors.toAccount = 'Chọn ví nhận hợp lệ';
        else if (d.toAccount === sourceAccountId) errors.toAccount = 'Ví nhận phải khác ví nguồn';
      } else if (d.payment && !PAYMENT_METHODS.some(([key]) => key === d.payment)) errors.payment = 'Phương thức thanh toán không hợp lệ';
      if (scope === 'family' && !familyId) errors.familyId = 'Chọn gia đình';
      if (scope === 'family' && !db.familyMembers.some(member => member.familyId === familyId && member.userEmail === session.email && member.status === 'ACTIVE')) errors.familyId = 'Bạn chưa là thành viên đang hoạt động của gia đình này';
      if (!d.date) errors.date = 'Chọn ngày giao dịch';
      else if (d.date > today()) errors.date = 'Ngày giao dịch không được ở tương lai';
      if ((d.note || '').length > 500) errors.note = 'Mô tả không được vượt quá 500 ký tự';
      const receiptFile = d.receipt instanceof File && d.receipt.size ? d.receipt : null;
      if (receiptFile && receiptFile.size > 1024 * 1024) errors.receipt = 'Chứng từ không được lớn hơn 1 MB';
      else if (receiptFile && !(/^image\/(jpeg|png|gif|webp|heic|heif)$/i.test(receiptFile.type) || receiptFile.type === 'application/pdf')) errors.receipt = 'Chỉ hỗ trợ ảnh hoặc tệp PDF';
      if (d.recurrence && !['none', 'monthly'].includes(d.recurrence)) errors.recurrence = 'Chọn chu kỳ hợp lệ';
      if (transfer && d.recurrence === 'monthly') errors.recurrence = 'Chuyển ví không hỗ trợ lặp định kỳ';
      if (!showErr(f, errors)) return;
      if (editingTransaction?.scope === 'family' && (scope !== 'family' || familyId !== editingTransaction.familyId)) return toast('Giao dịch dùng chung phải được giữ trong gia đình hiện tại');
      const editing = S.editTx && db.tx.find(transaction => transaction.id === S.editTx);
      if (S.editTx && (!editing || (!isAdmin && !canEditFamilyTransaction(editing)))) {
        toast('Bạn không có quyền chỉnh sửa giao dịch này');
        return;
      }
      const old = editing;
      let receipt = old?.receipt;
      if (d.receiptRemove === 'yes') receipt = undefined;
      if (receiptFile) {
        try {
          receipt = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error || new Error('Unable to read receipt'));
            reader.onload = () => resolve({ name: receiptFile.name, type: receiptFile.type, data: reader.result });
            reader.readAsDataURL(receiptFile);
          });
        } catch (error) {
          console.error('Unable to read transaction receipt', error);
          toast('Không thể đọc chứng từ đã chọn. Vui lòng thử lại.', 3800);
          return;
        }
      }
      const now = new Date().toISOString();
      const transaction = { ...(old || {}), id: old?.id || uid(), owner: old?.owner || (scope === 'family' ? d.actor || session.email : session.email),
        type: transfer ? 'transfer' : d.type, amount, date: d.date, accountId: sourceAccountId, note: (d.note || '').trim(),
        scope, familyId, updatedAt: now, ...(transfer ? { toAccountId: d.toAccount } : { catId: d.cat, paymentMethod: d.payment || '' }) };
      if (transfer || d.recurrence !== 'monthly') delete transaction.recurrence;
      else transaction.recurrence = 'monthly';
      if (transfer || !receipt) delete transaction.receipt;
      else transaction.receipt = receipt;
      if (transfer) {
        delete transaction.catId;
        delete transaction.paymentMethod;
        if (scope !== 'family') delete transaction.familyId;
      } else delete transaction.toAccountId;
      if (!old) transaction.createdAt = now;
      const nextTransactions = old
        ? db.tx.map(item => item.id === old.id ? transaction : item)
        : [...db.tx, transaction];
      try {
        write(TX_KEY, nextTransactions);
        db.tx = nextTransactions;
      } catch (error) {
        console.error('Unable to save transaction', error);
        toast('Không thể lưu giao dịch. Hãy giảm dung lượng chứng từ hoặc kiểm tra bộ nhớ trình duyệt.', 4500);
        return;
      }
      delete S.editTx; delete S.copyTx; render(); toast(old ? 'Đã cập nhật giao dịch' : 'Đã lưu giao dịch thành công');
    },
    cat: (f, d) => {
      const errors = {}, editing = db.cats.find(category => category.id === S.editCat && canEditCat(category));
      const originalScope = editing ? categoryScopeOf(editing) : '';
      const scope = editing ? (originalScope === 'global' ? 'global' : originalScope === 'personal' ? 'personal' : 'family')
        : isAdmin && d.categoryScope === 'global' ? 'global' : d.categoryScope === 'family' ? 'family' : 'personal';
      const familyId = scope === 'family' ? (editing?.familyId || d.categoryFamilyId) : '';
      const owner = editing ? editing.owner : (isAdmin ? '' : session.email);
      const name = (d.cname || '').trim(), note = (d.cnote || '').trim();
      const parent = d.cparent ? catOf(d.cparent) : null;
      const allowedIcon = CATEGORY_ICONS.some(([icon]) => icon === d.cicon);
      const validColor = /^#[0-9a-f]{6}$/i.test(d.ccolor || '');
      if (!name || name.length > 60) errors.cname = 'Nhập tên danh mục (tối đa 60 ký tự)';
      if (!TYPES.some(([type]) => type === d.ctype)) errors.ctype = 'Chọn loại Thu hoặc Chi';
      if (scope === 'global' && !isAdmin) errors.categoryScope = 'Chỉ quản trị viên được tạo danh mục chung';
      if (scope === 'family' && (!familyId || !familyOf(familyId) || (!isAdmin && !canManageFamily(familyId)))) errors.categoryFamilyId = 'Chọn gia đình hợp lệ hoặc kiểm tra quyền quản lý';
      if (db.cats.some(category => category.id !== editing?.id && categoryScopeOf(category) === (scope === 'family' ? familyId : scope)
        && (scope === 'family' || (category.owner || '') === owner) && category.type === d.ctype && category.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi')
        && (category.parentId || '') === (parent?.id || ''))) errors.cname = 'Tên này đã được dùng trong cùng danh mục cha';
      if (!allowedIcon) errors.cicon = 'Chọn biểu tượng trong danh sách';
      if (!validColor) errors.ccolor = 'Chọn màu hợp lệ';
      if (note.length > 240) errors.cnote = 'Mô tả tối đa 240 ký tự';
      if (parent && (parent.hidden || parent.type !== d.ctype || parent.parentId || categoryScopeOf(parent) !== (scope === 'family' ? familyId : scope)
        || !categoryCanUse(parent, scope, familyId))) errors.cparent = 'Danh mục cha phải đang hiển thị, cùng loại và cùng phạm vi';
      const hasChildren = editing && db.cats.some(category => category.parentId === editing.id);
      if (hasChildren && parent && parent.id !== editing.parentId) errors.cparent = 'Hãy xử lý danh mục con trước khi đổi cấp danh mục cha';
      if (editing && editing.type !== d.ctype && (db.tx.some(transaction => transaction.catId === editing.id) || hasChildren)) errors.ctype = 'Không thể đổi loại khi danh mục đang được giao dịch hoặc danh mục con sử dụng';
      if (editing && scope === 'family' && !isAdmin && !canManageFamily(editing.familyId)) errors.categoryFamilyId = 'Bạn không còn quyền quản lý danh mục gia đình này';
      if (!showErr(f, errors)) return;
      const previousCategories = db.cats.map(category => ({ ...category }));
      const value = { name, type: d.ctype, note, icon: d.cicon, color: d.ccolor, parentId: parent?.id || '' };
      if (editing) Object.assign(editing, value);
      else db.cats.push({ id: uid(), owner, scope, ...(scope === 'family' ? { familyId } : {}), hidden: false, ...value });
      try { saveCats(); } catch (error) {
        db.cats = previousCategories;
        console.error('Unable to save category', error);
        toast('Không thể lưu danh mục. Vui lòng kiểm tra dung lượng lưu trữ trình duyệt.', 4200);
        return;
      }
      // Đưa thư viện về đúng phạm vi vừa lưu để người dùng nhìn thấy danh mục mới.
      S.catScope = scope === 'family' ? familyId : scope;
      delete S.editCat; render(); toast(editing ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục');
    },
    account: async (f, d) => { const e = {}, me = findUser(session.email), email = d.email.trim().toLowerCase(), username = d.username.trim();
      if (d.name.trim().length < 2) e.name = 'Nhập họ và tên của bạn';
      if (!EMAIL_RE.test(email)) e.email = 'Email chưa đúng định dạng'; else if (db.users.some(u => u !== me && u.email === email)) e.email = 'Email này đã được đăng ký';
      if (!USER_RE.test(username)) e.username = '4–20 ký tự: chữ, số, _ hoặc .'; else if (db.users.some(u => u !== me && (u.username || '').toLowerCase() === username.toLowerCase())) e.username = 'Tên đăng nhập đã tồn tại';
      if (d.pw || d.pw2) {
        if (!d.cpw) e.cpw = 'Nhập mật khẩu hiện tại'; else if (!me || me.passwordHash !== await hashPw(d.cpw)) e.cpw = 'Mật khẩu hiện tại không đúng';
        if (d.pw.length < 8) e.pw = 'Cần ít nhất 8 ký tự'; if (d.pw !== d.pw2) e.pw2 = 'Mật khẩu xác nhận chưa khớp';
      }
      if (!showErr(f, e)) return;
      const old = session.email, oldName = session.name, oldUsername = session.username;
      if (me) { Object.assign(me, { name: d.name.trim(), email, username }); if (d.pw) me.passwordHash = await hashPw(d.pw); saveUsers(); }
      if (old !== email) { db.tx.forEach(t => { if (t.owner === old) t.owner = email; }); db.cats.forEach(c => { if (c.owner === old) c.owner = email; });
        db.budgets.forEach(b => { if (b.owner === old) b.owner = email; }); db.goals.forEach(g => { if (g.owner === old) g.owner = email; }); db.accounts.forEach(a => { if (a.owner === old) a.owner = email; });
        db.notifications.forEach(notification => { if (notification.owner === old) notification.owner = email; });
        saveTx(); saveCats(); saveBudgets(); saveGoals(); saveAccounts(); }
      if (old !== email) saveNotifications();
      Object.assign(session, { name: d.name.trim(), email, username }); write(SESSION_KEY, session);   // TODO: PUT /api/account
      if (d.pw || old !== email || oldName !== session.name || oldUsername !== username) {
        recordNotification(email, `account:profile:${uid()}`, 'account', 'Thông tin tài khoản đã được cập nhật',
          d.pw ? 'Mật khẩu tài khoản vừa được thay đổi.' : 'Tên, email hoặc tên đăng nhập tài khoản vừa được thay đổi.');
      }
      $('#uname').textContent = session.name; f.elements.cpw.value = f.elements.pw.value = f.elements.pw2.value = ''; render(); toast('Đã cập nhật tài khoản'); },
    familySettings: (f, d) => {
      const family = activeFamily();
      const errors = {};
      if (!family || family.ownerEmail !== session.email) return toast('Chỉ chủ gia đình mới được thay đổi cài đặt');
      const name = (d.familyName || '').trim();
      const description = (d.familyDescription || '').trim();
      const monthlyBudget = Number(d.familyBudget || 0);
      if (!name) errors.familyName = 'Nhập tên gia đình';
      if (description.length > 500) errors.familyDescription = 'Mô tả tối đa 500 ký tự';
      if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0) errors.familyBudget = 'Ngân sách không hợp lệ';
      if (!showErr(f, errors)) return;
      family.name = name; family.description = description; family.monthlyBudget = monthlyBudget; saveFamilies(); render(); toast('Đã lưu thay đổi gia đình');
    },
    familyBudgetSettings: (f, d) => {
      const family = activeFamily(), amount = Number(d.familyBudgetAmount);
      if (!family || !canManageFamily(family.id)) return toast('Bạn không có quyền điều chỉnh ngân sách gia đình');
      if (d.familyBudgetAmount == null || String(d.familyBudgetAmount).trim() === '' || !Number.isFinite(amount) || amount < 0) {
        showErr(f, { familyBudgetAmount: 'Ngân sách phải là số không âm' });
        return;
      }
      family.monthlyBudget = amount;
      saveFamilies(); delete S.editFamilyBudget; render(); toast('Đã cập nhật ngân sách gia đình');
    },
    familyCategoryBudget: (f, d) => {
      const family = activeFamily();
      if (!family || !canManageFamily(family.id)) return toast('Bạn không có quyền quản lý hạn mức danh mục của gia đình');
      const editing = familyBudgets(family.id).find(budget => budget.id === S.editFamilyCategoryBudget);
      const category = catOf(d.familyBudgetCategoryCat), amount = Number(d.familyBudgetCategoryAmount);
      const errors = {};
      if (!category || category.type !== 'out' || !categoryCanUse(category, 'family', family.id)) errors.familyBudgetCategoryCat = 'Chọn danh mục Chi thuộc phạm vi gia đình';
      if (!monthRe.test(d.familyBudgetCategoryMonth || '')) errors.familyBudgetCategoryMonth = 'Chọn tháng hợp lệ';
      if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999999) errors.familyBudgetCategoryAmount = 'Hạn mức phải lớn hơn 0 và hợp lệ';
      if (db.budgets.some(budget => budget.id !== editing?.id && budget.scope === 'family' && budget.familyId === family.id
        && budget.catId === d.familyBudgetCategoryCat && budget.month === d.familyBudgetCategoryMonth)) {
        errors.familyBudgetCategoryCat = 'Danh mục này đã có hạn mức trong tháng';
      }
      if (!showErr(f, errors)) return;
      const previous = db.budgets.slice();
      if (editing) Object.assign(editing, { catId: d.familyBudgetCategoryCat, month: d.familyBudgetCategoryMonth, amount });
      else db.budgets.push({ id: uid(), scope: 'family', familyId: family.id, catId: d.familyBudgetCategoryCat,
        month: d.familyBudgetCategoryMonth, amount, createdBy: session.email });
      try {
        saveBudgets();
      } catch (error) {
        db.budgets = previous;
        console.error('Unable to save family category budget', error);
        toast('Không thể lưu hạn mức. Vui lòng kiểm tra dung lượng lưu trữ trình duyệt.', 4200);
        return;
      }
      S.familyBudgetMonth = d.familyBudgetCategoryMonth;
      delete S.editFamilyCategoryBudget;
      render(); toast(editing ? 'Đã cập nhật hạn mức danh mục' : 'Đã thêm hạn mức danh mục');
    },
    report: (f, d) => {
      const errors = {};
      const scope = d.reportScope || (isAdmin ? 'all' : 'personal');
      if (!reportScopeOptions().some(([key]) => key === scope)) errors.reportScope = 'Không có quyền truy cập phạm vi báo cáo này';
      if (!REPORT_PERIODS.some(([key]) => key === d.rperiod)) errors.rperiod = 'Chọn kỳ báo cáo hợp lệ';
      if (d.rf && !validReportDate(d.rf)) errors.rf = 'Ngày bắt đầu không hợp lệ';
      if (d.rt && !validReportDate(d.rt)) errors.rt = 'Ngày kết thúc không hợp lệ';
      if (d.rf && d.rt && d.rf > d.rt) errors.rt = 'Đến ngày phải sau Từ ngày';
      const familyScope = scope !== 'personal' && scope !== 'all';
      if (d.rmember && (!familyScope || !familyMembersOf(scope).some(member => member.userEmail === d.rmember))) errors.rmember = 'Thành viên không thuộc phạm vi gia đình đã chọn';
      if (d.raccount && !reportAccounts(scope).some(account => account.id === d.raccount)) errors.raccount = 'Ví không thuộc phạm vi báo cáo';
      if (d.rc) {
        const category = catOf(d.rc);
        const categoryScope = familyScope ? 'family' : isAdmin ? 'all' : 'personal';
        const valid = categoryScope === 'all'
          ? !!category && !category.hidden && (isAdmin || categoryCanUse(category, 'personal', ''))
          : !!category && categoryCanUse(category, categoryScope, familyScope ? scope : '');
        if (!valid) errors.rc = 'Danh mục không thuộc phạm vi báo cáo';
      }
      if (!showErr(f, errors)) return;
      Object.assign(S, {
        rf: d.rf, rt: d.rt, rperiod: d.rperiod, reportScope: scope,
        ru: isAdmin && scope === 'all' ? (d.ru || '') : '',
        rmember: familyScope ? (d.rmember || '') : '',
        rty: d.rty || '', rc: d.rc || '', raccount: d.raccount || '', rrun: true
      });
      $('#repOut').innerHTML = reportOut();
    },
    noop: () => refreshRows()
  };

  document.addEventListener('click', e => {
    const n = e.target.closest('[data-p]'); if (n) return go(n.dataset.p);
    const a = e.target.closest('[data-act]'); if (a && !a.disabled) ACT[a.dataset.act]?.(a.dataset.id ?? a, e);
  });
  document.addEventListener('submit', e => { const f = e.target.closest('form[data-f]'); if (!f) return; e.preventDefault(); FORM[f.dataset.f](f, Object.fromEntries(new FormData(f))); });
  document.addEventListener('input', e => {
    const t = e.target; t.closest('.field')?.classList.remove('invalid');
    if (t.form?.dataset.f === 'cat' && ['cname', 'ccolor'].includes(t.name)) {
      const preview = $('#categoryPreview', t.form);
      if (preview && t.name === 'cname') preview.querySelector('b').textContent = t.value.trim() || 'Tên danh mục';
      if (preview && t.name === 'ccolor') preview.style.setProperty('--category-color', /^#[0-9a-f]{6}$/i.test(t.value) ? t.value : '#2563eb');
    }
    if (t.hasAttribute('data-live')) { S[t.id === 'dashboardScope' ? 'dashboardScope' : t.id] = t.value; if (t.id !== 'ps') S.pg = 1; refreshRows(); }
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.form?.dataset.f === 'report' && t.id === 'rperiod') {
      S.rperiod = t.value;
      if (t.value !== 'custom') {
        const [start, end] = reportRange(t.value);
        t.form.elements.rf.value = start; t.form.elements.rt.value = end;
      }
    }
    if (t.form?.dataset.f === 'report' && ['rf', 'rt'].includes(t.id)) {
      t.form.elements.rperiod.value = 'custom';
      S.rperiod = 'custom';
    }
    if (t.form?.dataset.f === 'report' && t.id === 'reportScope') {
      S.rf = t.form.elements.rf.value; S.rt = t.form.elements.rt.value;
      S.rperiod = t.form.elements.rperiod.value; S.reportScope = t.value;
      ['raccount', 'rmember', 'rc', 'ru', 'rty'].forEach(key => delete S[key]);
      render(); return;
    }
    if (t.form?.dataset.f === 'tx' && (t.matches('input[name="scope"]') || t.id === 'familyId')) {
      updateTransactionAccountOptions(t.form);
      updateTransactionCategoryOptions(t.form);
    }
    if (t.form?.dataset.f === 'cat' && ['categoryScope', 'categoryFamilyId', 'ctype'].includes(t.name)) {
      const familyField = $('#categoryFamilyField', t.form);
      if (familyField && t.name === 'categoryScope') familyField.hidden = t.value !== 'family';
      updateCategoryParentOptions(t.form);
    }
    if (t.id === 'accountScope') {
      const familyFields = t.form?.querySelector('#familyAccountFields');
      if (familyFields) familyFields.hidden = t.value !== 'family';
    }
    if (t.id === 'familyProfileMonth') {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(t.value)) return toast('Tháng được chọn không hợp lệ');
      S.familyProfileMonth = t.value; render(); return;
    }
    if (t.id === 'familyBudgetMonth') {
      if (!monthRe.test(t.value)) return toast('Tháng được chọn không hợp lệ');
      S.familyBudgetMonth = t.value; delete S.editFamilyCategoryBudget; render(); return;
    }
    if (t.id === 'familySelector') {
      if (!myFamilyMemberships().some(member => member.familyId === t.value)) return toast('Không có quyền truy cập gia đình này');
      S.familyId = t.value; delete S.familyProfileEmail; delete S.familyProfileTab; delete S.familyProfileMonth;
      ['familyTxSearch', 'familyTxMember', 'familyTxMonth', 'familyTxType', 'editFamilyBudget', 'familyBudgetMonth', 'editFamilyCategoryBudget'].forEach(key => delete S[key]);
      render(); return;
    }
    if (t.id === 'dashboardScope' && page === 'dash') {
      delete S.dashboardAccount;
      render(); return;
    }
    if (t.hasAttribute('data-live')) { S[t.id === 'dashboardScope' ? 'dashboardScope' : t.id] = t.value; if (t.id !== 'ps') S.pg = 1; refreshRows(); }
    if (t.id === 'scopeFilter' && page === 'tx') { delete S.fc; delete S.fm; render(); }
    if (t.id === 'type' && t.form?.dataset.f === 'tx') {
      const transfer = t.value === 'transfer';
      const categoryField = $('#txCategoryField', t.form), transferFields = $('#txTransferFields', t.form), regularFields = $('#txRegularFields', t.form);
      if (categoryField) categoryField.hidden = transfer;
      if (transferFields) transferFields.hidden = !transfer;
      if (regularFields) regularFields.hidden = transfer;
      if (transfer) {
        const recurrence = $('#recurrence', t.form);
        if (recurrence) recurrence.value = 'none';
      }
      updateTransactionAccountOptions(t.form);
      if (!transfer) updateTransactionCategoryOptions(t.form);
    }
  });
  window.addEventListener('storage', event => {
    if (['et_tx', 'et_cats', 'et_budgets', 'et_accounts', 'et_account_adjustments', 'et_families', 'et_family_members', 'et_family_invites', 'et_family_fund_entries', 'et_users', NOTIFICATIONS_KEY].includes(event.key)) {
      sync();
      // Nhận danh mục mới từ tab quản trị mà không xóa dữ liệu người dùng đang nhập.
      if (event.key === 'et_cats' && page === 'tx') {
        const form = document.querySelector('form[data-f="tx"]');
        if (form) updateTransactionCategoryOptions(form);
      } else if (event.key === NOTIFICATIONS_KEY || ['dash', 'family', 'moneyAccounts', 'report', 'budget', 'goals', 'notifications', 'cats'].includes(page)) render();
    }
  });
  $('#menuBtn').onclick = () => $('#side').classList.toggle('open');
  render();
})();
