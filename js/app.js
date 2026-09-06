/**
 * 訂餐系統 (Lunch Ordering System) v2.3 - Main Frontend JS
 * 修正：移除後端設定頁面後補全 DOM 空值檢查，避免 JS 例外中斷選單渲染
 */

// 💡【主辦人設定區域】請在此貼上您的 Google Apps Script Web App URL
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbyYlyiRsD4W8NWDydW74EGPQ6GirJVLwj3-uclsc7usTaDPAVKFKDX4K9ylNuOBFDNp/exec";

// 杏園美食 預設 Mock 菜單
const MOCK_XINGYUAN_MENU = [
  // 飯類 / 便當
  { restaurantName: "台大醫學院 - 杏園", name: "菜飯", price: 60, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "酢醬飯", price: 65, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "咖哩飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "燒肉飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "照燒飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "打拋豬飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "宮保雞丁飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "蒜泥白肉飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "德式豬腳飯", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "雙味飯 (任選兩種)", price: 90, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "泡菜豬肉飯", price: 95, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "雞肉飯", price: 100, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "東坡肉飯", price: 100, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "牛腩飯", price: 100, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "蒜香里肌飯", price: 100, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "油雞腿飯", price: 110, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "鹽烤雞腿飯", price: 110, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "壽喜牛肉飯", price: 110, category: "飯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "椒麻雞腿飯", price: 130, category: "飯類" },

  // 麵類 / 米粉
  { restaurantName: "台大醫學院 - 杏園", name: "乾麵 / 米粉", price: 45, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "擔擔麵 / 米粉 (乾/湯)", price: 55, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "牛肉湯麵 / 米粉", price: 55, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "酢醬麵 / 米粉", price: 60, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "肉羹麵 / 米粉", price: 60, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "大滷麵 / 米粉", price: 80, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "瘦皮麵 / 米粉 (乾/湯)", price: 80, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "牛肉麵 / 米粉", price: 100, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "三丸麵 / 米粉", price: 100, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "鮮貝丸麵", price: 100, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "西魯麵", price: 100, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "義式香菇花枝丸麵", price: 100, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "麻辣麵 / 米粉", price: 100, category: "麵類" },
  { restaurantName: "台大醫學院 - 杏園", name: "鮮蝦麵", price: 130, category: "麵類" },

  // 湯類
  { restaurantName: "台大醫學院 - 杏園", name: "蘿蔔貢丸湯", price: 45, category: "湯類" },
  { restaurantName: "台大醫學院 - 杏園", name: "大滷湯", price: 50, category: "湯類" }
];

// 日期工具函式
function getTodayString(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatDateObject(d);
}

function formatDateObject(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 檢查日期是否符合「未來兩週內 + 週一至週三」
function checkDateOrderable(dateStr) {
  if (!dateStr) return { orderable: true, reason: "開放點餐中" };

  const parts = dateStr.split('-').map(Number);
  const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);

  const dayOfWeek = targetDate.getDay();

  if (targetDate < today) {
    return { orderable: false, reason: "無法選擇過去的日期" };
  }
  if (targetDate > maxDate) {
    return { orderable: false, reason: "只能預約未來兩週 (14天) 內的餐點" };
  }
  if (dayOfWeek !== 1 && dayOfWeek !== 2 && dayOfWeek !== 3) {
    const weekNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    return { orderable: false, reason: `選取日期為${weekNames[dayOfWeek]}，系統僅開放【週一至週三】訂餐` };
  }

  return { orderable: true, reason: "開放點餐中" };
}

function getAvailableOrderDates() {
  const list = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

  for (let i = 0; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();

    if (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3) {
      const dateStr = formatDateObject(d);
      const isToday = i === 0;
      let label = isToday ? `今天 (${d.getMonth() + 1}/${d.getDate()})` : `${weekNames[dayOfWeek]} ${d.getMonth() + 1}/${d.getDate()}`;
      list.push({ label: label, date: dateStr, dayOfWeek: dayOfWeek });
    }
  }
  return list;
}

const MOCK_SCHEDULE = getAvailableOrderDates().map((item, idx) => ({
  date: item.date,
  restaurantName: "台大醫學院 - 杏園",
  status: "開放點餐",
  note: `${item.label} 排程`
}));

const MOCK_TOPUPS = [
  { timestamp: `${getTodayString(0)} 09:00`, username: "小明", amount: 1000, status: "已收款", note: "現金儲值" },
  { timestamp: `${getTodayString(0)} 09:15`, username: "小華", amount: 500, status: "已收款", note: "LINE Pay" },
  { timestamp: `${getTodayString(0)} 09:30`, username: "老張", amount: 1500, status: "已收款", note: "銀行轉帳" },
  { timestamp: `${getTodayString(0)} 10:00`, username: "陳捷翐", amount: 1000, status: "已收款", note: "現金儲值" }
];

const MOCK_INITIAL_ORDERS = [];

class LunchApp {
  constructor() {
    this.currentUser = localStorage.getItem("lunch_app_user") || null;
    this.gasUrl = localStorage.getItem("lunch_app_gas_url") || DEFAULT_GAS_URL || "";
    
    const availableDates = getAvailableOrderDates();
    const todayCheck = checkDateOrderable(getTodayString(0));
    this.currentSelectedDate = todayCheck.orderable ? getTodayString(0) : (availableDates.length > 0 ? availableDates[0].date : getTodayString(0));
    
    this.cart = {};
    this.activeCategory = "ALL";
    this.overviewMode = "by-items";

    this.schedule = JSON.parse(localStorage.getItem("lunch_app_mock_schedule")) || MOCK_SCHEDULE;
    this.menu = [...MOCK_XINGYUAN_MENU];
    this.topUps = JSON.parse(localStorage.getItem("lunch_app_mock_topups")) || MOCK_TOPUPS;
    this.orders = JSON.parse(localStorage.getItem("lunch_app_mock_orders")) || MOCK_INITIAL_ORDERS;

    this.init();
  }

  init() {
    this.updateUserUI();
    this.renderDateSwitcher();

    const gasInput = document.getElementById("gas-api-url");
    if (gasInput && this.gasUrl) {
      gasInput.value = this.gasUrl;
    }
    const demoBanner = document.getElementById("demo-banner");
    if (demoBanner && this.gasUrl) {
      demoBanner.classList.add("hidden");
    }

    if (this.gasUrl) {
      this.fetchDataFromGas();
    } else {
      this.renderAllViews();
    }
  }

  renderDateSwitcher() {
    const scrollContainer = document.getElementById("date-pills-scroll");
    if (scrollContainer) {
      scrollContainer.innerHTML = "";
      const availableDates = getAvailableOrderDates();

      availableDates.forEach(d => {
        const btn = document.createElement("button");
        btn.className = `date-pill ${d.date === this.currentSelectedDate ? 'active' : ''}`;
        btn.textContent = d.label;
        btn.onclick = () => this.selectDate(d.date);
        scrollContainer.appendChild(btn);
      });
    }

    const datePicker = document.getElementById("custom-date-picker");
    if (datePicker) {
      datePicker.min = getTodayString(0);
      datePicker.max = getTodayString(14);
      datePicker.value = this.currentSelectedDate;
    }

    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    const badgeEl = document.getElementById("schedule-status-badge");
    const currentScheduleItem = this.schedule.find(s => s.date === this.currentSelectedDate);
    const activeRestName = currentScheduleItem ? currentScheduleItem.restaurantName : "台大醫學院 - 杏園";

    const restNameEl = document.getElementById("restaurant-name");
    if (restNameEl) restNameEl.textContent = activeRestName;

    const demoDateEl = document.getElementById("demo-date-label");
    if (demoDateEl) demoDateEl.textContent = this.currentSelectedDate;

    const overviewDateEl = document.getElementById("overview-date-title");
    if (overviewDateEl) overviewDateEl.textContent = this.currentSelectedDate;

    if (badgeEl) {
      if (dateCheck.orderable) {
        badgeEl.textContent = "開放點餐中 (週一~週三限定)";
        badgeEl.style.background = "#d1fae5";
        badgeEl.style.color = "#047857";
      } else {
        badgeEl.textContent = `🔒 ${dateCheck.reason}`;
        badgeEl.style.background = "#fee2e2";
        badgeEl.style.color = "#991b1b";
      }
    }
  }

  selectDate(dateStr) {
    const check = checkDateOrderable(dateStr);
    if (!check.orderable) {
      this.showToast(`⚠️ ${check.reason}`);
    }

    this.currentSelectedDate = dateStr;
    this.renderDateSwitcher();
    this.cart = {};
    this.updateCartBar();

    if (this.gasUrl) {
      this.fetchDataFromGas();
    } else {
      this.renderAllViews();
    }
  }

  onCustomDateSelect(dateStr) {
    if (!dateStr) return;
    const check = checkDateOrderable(dateStr);
    if (!check.orderable) {
      this.showToast(`⚠️ ${check.reason}`);
    }
    this.selectDate(dateStr);
  }

  updateUserUI() {
    const nameEl = document.getElementById("display-username");
    const balEl = document.getElementById("display-balance");

    if (this.currentUser) {
      if (nameEl) nameEl.textContent = this.currentUser;
      const balance = this.getUserCalculatedBalance(this.currentUser);
      if (balEl) balEl.textContent = `$${balance}`;
    } else {
      if (nameEl) nameEl.textContent = "請點擊登入";
      if (balEl) balEl.textContent = "$0";
    }
  }

  getUserCalculatedBalance(username) {
    let approvedDeposit = 0;
    this.topUps.forEach(t => {
      if (t.username === username && t.status === "已收款") {
        approvedDeposit += t.amount;
      }
    });

    let totalSpent = 0;
    this.orders.forEach(o => {
      if (o.username === username) {
        totalSpent += o.totalPrice;
      }
    });

    return approvedDeposit - totalSpent;
  }

  showLoginModal() {
    const input = document.getElementById("username-input");
    if (input && this.currentUser) input.value = this.currentUser;
    const modal = document.getElementById("login-modal");
    if (modal) modal.classList.remove("hidden");
  }

  closeLoginModal() {
    const modal = document.getElementById("login-modal");
    if (modal) modal.classList.add("hidden");
  }

  quickLogin(username) {
    const input = document.getElementById("username-input");
    if (input) input.value = username;
    this.confirmLogin();
  }

  confirmLogin() {
    const input = document.getElementById("username-input");
    const username = input ? input.value.trim() : "";
    if (!username) {
      this.showToast("⚠️ 請輸入名字！");
      return;
    }

    this.currentUser = username;
    localStorage.setItem("lunch_app_user", username);
    
    this.updateUserUI();
    this.renderTreasury();
    this.closeLoginModal();
    this.showToast(`👋 歡迎，${username}！`);
  }

  switchTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    document.querySelectorAll(".page-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === tabId);
    });

    if (tabId === "order-page") {
      this.updateCartBar();
    } else {
      const cartBar = document.getElementById("bottom-cart-bar");
      if (cartBar) cartBar.classList.add("hidden");
    }

    if (tabId === "overview-page") this.renderOverview();
    if (tabId === "treasury-page") this.renderTreasury();
  }

  filterCategory(category) {
    this.activeCategory = category;
    document.querySelectorAll(".category-pills .pill").forEach(pill => {
      pill.classList.toggle("active", pill.textContent.includes(category) || (category === 'ALL' && pill.textContent === '全部'));
    });
    this.renderMenu();
  }

  renderMenu() {
    const container = document.getElementById("menu-list");
    if (!container) return;
    container.innerHTML = "";

    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    
    if (!dateCheck.orderable) {
      container.innerHTML = `
        <div class="overview-card" style="text-align: center; color: #991b1b; background: #fee2e2; padding: 24px;">
          🔒 ${dateCheck.reason} <br>
          <span style="font-size: 0.85rem; color: #7f1d1d; margin-top: 6px; display: inline-block;">
            請由上方選單預約【週一、週二、週三】的餐點。
          </span>
        </div>
      `;
      return;
    }

    const restNameEl = document.getElementById("restaurant-name");
    const activeRestName = restNameEl ? restNameEl.textContent : "台大醫學院 - 杏園";

    let filtered = this.menu.filter(m => !m.restaurantName || m.restaurantName.includes(activeRestName) || activeRestName.includes(m.restaurantName));
    if (filtered.length === 0) filtered = this.menu;

    if (this.activeCategory !== "ALL") {
      filtered = filtered.filter(i => i.category === this.activeCategory);
    }

    filtered.forEach(item => {
      const qtyInCart = this.cart[item.name] ? this.cart[item.name].qty : 0;

      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <div class="menu-card-left">
          <span class="item-name">${item.name}</span>
          <div class="item-meta">
            <span class="item-price">$${item.price}</span>
            <span class="item-category-tag">${item.category}</span>
          </div>
        </div>
        <div class="quantity-control">
          <button class="btn-qty minus" onclick="app.updateQty('${item.name}', -1)">-</button>
          <span class="qty-number ${qtyInCart > 0 ? 'active' : ''}">${qtyInCart}</span>
          <button class="btn-qty plus" onclick="app.updateQty('${item.name}', 1)">+</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  updateQty(itemName, delta) {
    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    if (!dateCheck.orderable) {
      this.showToast(`⚠️ ${dateCheck.reason}`);
      return;
    }

    const menuItem = this.menu.find(m => m.name === itemName);
    if (!menuItem) return;

    if (!this.cart[itemName]) {
      this.cart[itemName] = { name: menuItem.name, price: menuItem.price, qty: 0 };
    }

    this.cart[itemName].qty += delta;

    if (this.cart[itemName].qty <= 0) {
      delete this.cart[itemName];
    }

    this.renderMenu();
    this.updateCartBar();
  }

  updateCartBar() {
    const bar = document.getElementById("bottom-cart-bar");
    if (!bar) return;

    const countEl = document.getElementById("cart-item-count");
    const totalEl = document.getElementById("cart-total-price");

    let totalQty = 0;
    let totalPrice = 0;

    Object.values(this.cart).forEach(item => {
      totalQty += item.qty;
      totalPrice += item.qty * item.price;
    });

    if (totalQty > 0) {
      if (countEl) countEl.textContent = totalQty;
      if (totalEl) totalEl.textContent = `$${totalPrice}`;
      bar.classList.remove("hidden");
    } else {
      bar.classList.add("hidden");
    }
  }

  toggleCartModal() {
    const modal = document.getElementById("cart-modal");
    if (!modal) return;

    if (modal.classList.contains("hidden")) {
      if (!this.currentUser) {
        this.showLoginModal();
        return;
      }
      this.renderCartModal();
      modal.classList.remove("hidden");
    } else {
      modal.classList.add("hidden");
    }
  }

  renderCartModal() {
    const dateModalEl = document.getElementById("cart-modal-date");
    if (dateModalEl) dateModalEl.textContent = `(${this.currentSelectedDate})`;
    
    const userModalEl = document.getElementById("cart-modal-username");
    if (userModalEl) userModalEl.textContent = this.currentUser || "未登入";

    const balance = this.getUserCalculatedBalance(this.currentUser);
    const balModalEl = document.getElementById("cart-modal-balance");
    if (balModalEl) balModalEl.textContent = `目前餘額: $${balance}`;

    const listEl = document.getElementById("cart-modal-items-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    let total = 0;
    Object.values(this.cart).forEach(item => {
      const itemSubtotal = item.qty * item.price;
      total += itemSubtotal;

      const row = document.createElement("div");
      row.className = "cart-modal-row";
      row.innerHTML = `
        <span>${item.name} x ${item.qty}</span>
        <strong>$${itemSubtotal}</strong>
      `;
      listEl.appendChild(row);
    });

    const totalModalEl = document.getElementById("cart-modal-total-amount");
    if (totalModalEl) totalModalEl.textContent = `$${total}`;
  }

  clearCart() {
    this.cart = {};
    this.renderMenu();
    this.updateCartBar();
    const modal = document.getElementById("cart-modal");
    if (modal) modal.classList.add("hidden");
    this.showToast("已清空餐點");
  }

  async submitOrder() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    if (!dateCheck.orderable) {
      this.showToast(`⚠️ 無法送出：${dateCheck.reason}`);
      return;
    }

    const cartItems = Object.values(this.cart).filter(i => i.qty > 0);
    if (cartItems.length === 0) {
      this.showToast("⚠️ 購物車是空的，請先選擇餐點！");
      return;
    }

    let totalPrice = 0;
    const itemDetailsStr = cartItems.map(i => {
      totalPrice += i.qty * i.price;
      return `${i.name} x${i.qty}`;
    }).join(", ");

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      timestamp: timeStr,
      date: this.currentSelectedDate,
      username: this.currentUser,
      totalPrice: totalPrice,
      items: cartItems
    };

    if (this.gasUrl) {
      this.showToast("⏳ 正在寫入 Google 試算表 (raw紀錄)...");
      try {
        await fetch(this.gasUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submitOrder",
            username: this.currentUser,
            totalPrice: totalPrice,
            itemDetails: itemDetailsStr,
            orderDate: this.currentSelectedDate,
            items: cartItems
          })
        });
      } catch (err) {
        console.warn("GAS POST order error:", err);
      }
    }

    this.orders.unshift(newOrder);
    this.saveLocalState();
    this.cart = {};
    this.renderMenu();
    this.updateCartBar();
    const modal = document.getElementById("cart-modal");
    if (modal) modal.classList.add("hidden");

    this.updateUserUI();
    this.switchTab("overview-page");
    this.showToast(`🎉 成功預約 ${this.currentSelectedDate} 訂單！消費 $${totalPrice}`);
  }

  switchOverviewMode(mode) {
    this.overviewMode = mode;
    const btnItems = document.getElementById("btn-mode-items");
    const btnPeople = document.getElementById("btn-mode-people");
    if (btnItems) btnItems.classList.toggle("active", mode === "by-items");
    if (btnPeople) btnPeople.classList.toggle("active", mode === "by-people");
    this.renderOverview();
  }

  renderOverview() {
    const container = document.getElementById("overview-content");
    const countTag = document.getElementById("total-orders-tag");
    if (!container) return;
    container.innerHTML = "";

    const dateOrders = this.orders.filter(o => !o.date || o.date === this.currentSelectedDate);

    let totalItemCount = 0;
    dateOrders.forEach(o => {
      o.items.forEach(i => totalItemCount += i.qty);
    });
    if (countTag) countTag.textContent = `共 ${totalItemCount} 份餐點`;

    if (dateOrders.length === 0) {
      container.innerHTML = `
        <div class="overview-card" style="text-align: center; color: var(--text-muted); padding: 30px;">
          🛵 ${this.currentSelectedDate} 尚無訂購紀錄
        </div>
      `;
      return;
    }

    if (this.overviewMode === "by-items") {
      const itemMap = {};
      dateOrders.forEach(ord => {
        ord.items.forEach(it => {
          if (!itemMap[it.name]) {
            itemMap[it.name] = { totalQty: 0, price: it.price, buyers: {} };
          }
          itemMap[it.name].totalQty += it.qty;
          itemMap[it.name].buyers[ord.username] = (itemMap[it.name].buyers[ord.username] || 0) + it.qty;
        });
      });

      Object.entries(itemMap).forEach(([itemName, itemInfo]) => {
        const buyersList = Object.entries(itemInfo.buyers).map(([user, q]) => `${user}${q > 1 ? ` x${q}` : ''}`).join("、");

        const card = document.createElement("div");
        card.className = "overview-card";
        card.innerHTML = `
          <div class="overview-card-header">
            <div class="item-title-wrap">
              <span class="item-count-badge">x ${itemInfo.totalQty}</span>
              <span class="item-name-lg">${itemName}</span>
            </div>
            <span class="item-price">$${itemInfo.price * itemInfo.totalQty}</span>
          </div>
          <div class="people-names-list">
            <span style="font-size: 0.82rem; color: var(--text-muted);">訂購成員：</span>
            <div class="person-chip">👤 ${buyersList}</div>
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      const personMap = {};
      dateOrders.forEach(ord => {
        if (!personMap[ord.username]) {
          personMap[ord.username] = { items: [], total: 0 };
        }
        ord.items.forEach(it => {
          personMap[ord.username].items.push(it);
          personMap[ord.username].total += it.qty * it.price;
        });
      });

      Object.entries(personMap).forEach(([user, data]) => {
        const card = document.createElement("div");
        card.className = "overview-card";
        card.innerHTML = `
          <div class="overview-card-header">
            <span class="item-name-lg">👤 ${user}</span>
            <span class="user-balance" style="font-size: 0.9rem;">小計 $${data.total}</span>
          </div>
          <div class="person-orders-list">
            ${data.items.map(i => `
              <div class="person-order-row">
                <span>${i.name} x${i.qty}</span>
                <span>$${i.qty * i.price}</span>
              </div>
            `).join('')}
          </div>
        `;
        container.appendChild(card);
      });
    }
  }

  copyOverviewText() {
    const restEl = document.getElementById("restaurant-name");
    const restName = restEl ? restEl.textContent : "杏園";
    let text = `🍱 【${restName} - ${this.currentSelectedDate} 點餐統計】\n----------------------------\n`;

    const dateOrders = this.orders.filter(o => !o.date || o.date === this.currentSelectedDate);

    if (this.overviewMode === "by-items") {
      const itemMap = {};
      dateOrders.forEach(ord => {
        ord.items.forEach(it => {
          if (!itemMap[it.name]) itemMap[it.name] = { qty: 0, buyers: {} };
          itemMap[it.name].qty += it.qty;
          itemMap[it.name].buyers[ord.username] = (itemMap[it.name].buyers[ord.username] || 0) + it.qty;
        });
      });

      Object.entries(itemMap).forEach(([name, info]) => {
        const buyers = Object.entries(info.buyers).map(([u, q]) => `${u}${q > 1 ? `x${q}` : ''}`).join(", ");
        text += `• ${name} x${info.qty} (${buyers})\n`;
      });
    } else {
      const personMap = {};
      dateOrders.forEach(ord => {
        if (!personMap[ord.username]) personMap[ord.username] = [];
        ord.items.forEach(it => personMap[ord.username].push(`${it.name} x${it.qty}`));
      });

      Object.entries(personMap).forEach(([user, items]) => {
        text += `👤 ${user}: ${items.join(", ")}\n`;
      });
    }

    const countTag = document.getElementById("total-orders-tag");
    const countText = countTag ? countTag.textContent : "";
    text += `----------------------------\n共計：${countText}`;

    navigator.clipboard.writeText(text).then(() => {
      this.showToast("📋 已成功複製點餐明細！");
    }).catch(err => {
      console.error(err);
      this.showToast("複製失敗，請手動複製");
    });
  }

  renderTreasury() {
    const tbody = document.getElementById("treasury-table-body");
    if (tbody) {
      tbody.innerHTML = "";

      const userNames = new Set();
      this.topUps.forEach(t => userNames.add(t.username));
      this.orders.forEach(o => userNames.add(o.username));
      if (this.currentUser) userNames.add(this.currentUser);

      userNames.forEach(uName => {
        let approvedDeposit = 0;
        this.topUps.forEach(t => {
          if (t.username === uName && t.status === "已收款") approvedDeposit += t.amount;
        });

        let totalSpent = 0;
        this.orders.forEach(o => {
          if (o.username === uName) totalSpent += o.totalPrice;
        });

        const currentBalance = approvedDeposit - totalSpent;
        const isCurrent = uName === this.currentUser;

        const tr = document.createElement("tr");
        if (isCurrent) tr.className = "highlight-user";

        tr.innerHTML = `
          <td>${uName} ${isCurrent ? '⭐' : ''}</td>
          <td style="color: ${currentBalance < 0 ? '#ef4444' : 'var(--primary-color)'}; font-weight: 700;">$${currentBalance}</td>
          <td>$${approvedDeposit}</td>
          <td>$${totalSpent}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    if (this.currentUser) {
      let myApprovedDeposit = 0;
      this.topUps.forEach(t => {
        if (t.username === this.currentUser && t.status === "已收款") myApprovedDeposit += t.amount;
      });

      let myTotalSpent = 0;
      this.orders.forEach(o => {
        if (o.username === this.currentUser) myTotalSpent += o.totalPrice;
      });

      const myBalEl = document.getElementById("treasury-my-balance");
      if (myBalEl) myBalEl.textContent = `$${myApprovedDeposit - myTotalSpent}`;
      
      const myDepEl = document.getElementById("treasury-my-deposit");
      if (myDepEl) myDepEl.textContent = `$${myApprovedDeposit}`;

      const mySpeEl = document.getElementById("treasury-my-spent");
      if (mySpeEl) mySpeEl.textContent = `$${myTotalSpent}`;
    }

    const topupTbody = document.getElementById("topup-table-body");
    if (topupTbody) {
      topupTbody.innerHTML = "";

      this.topUps.forEach(t => {
        const tr = document.createElement("tr");
        const isApproved = t.status === "已收款";
        const statusBadge = `<span class="${isApproved ? 'badge-status-approved' : 'badge-status-pending'}">${t.status}</span>`;

        tr.innerHTML = `
          <td>${t.timestamp}</td>
          <td>${t.username}</td>
          <td style="font-weight: 700;">+$${t.amount}</td>
          <td>${statusBadge}</td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${t.note || '-'}</td>
        `;
        topupTbody.appendChild(tr);
      });
    }
  }

  showTopUpModal() {
    const input = document.getElementById("topup-username-input");
    if (input && this.currentUser) {
      input.value = this.currentUser;
    }
    const modal = document.getElementById("topup-modal");
    if (modal) modal.classList.remove("hidden");
  }

  closeTopUpModal() {
    const modal = document.getElementById("topup-modal");
    if (modal) modal.classList.add("hidden");
  }

  async submitTopUp() {
    const uInput = document.getElementById("topup-username-input");
    const aInput = document.getElementById("topup-amount-input");
    const nInput = document.getElementById("topup-note-input");

    const uName = uInput ? uInput.value.trim() : "";
    const amount = aInput ? Number(aInput.value) : 0;
    const note = nInput ? nInput.value.trim() : "";

    if (!uName || !amount || amount <= 0) {
      this.showToast("⚠️ 請填寫姓名與正確金額！");
      return;
    }

    const now = new Date();
    const timeStr = `${getTodayString(0)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTopUp = {
      timestamp: timeStr,
      username: uName,
      amount: amount,
      status: "未收款",
      note: note || "線上申請"
    };

    if (this.gasUrl) {
      this.showToast("⏳ 正在傳送儲值紀錄至 Google 試算表...");
      try {
        await fetch(this.gasUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "addTopUp",
            username: uName,
            amount: amount,
            note: note,
            status: "未收款"
          })
        });
      } catch (err) {
        console.warn("GAS POST topup error:", err);
      }
    }

    this.topUps.unshift(newTopUp);
    this.saveLocalState();
    this.closeTopUpModal();
    this.renderTreasury();
    this.updateUserUI();
    this.showToast(`💰 已送出 $${amount} 儲值紀錄 (狀態: 未收款，待管理員確認)`);
  }

  saveGasUrl() {
    const gasInput = document.getElementById("gas-api-url");
    const url = gasInput ? gasInput.value.trim() : "";
    if (!url.startsWith("http")) {
      this.showToast("⚠️ 請輸入正確的 Web App URL");
      return;
    }
    this.gasUrl = url;
    localStorage.setItem("lunch_app_gas_url", url);
    this.showToast("💾 已儲存 Google Apps Script URL");
    this.fetchDataFromGas();
  }

  async testGasUrl() {
    const statusBox = document.getElementById("connection-status");
    if (statusBox) {
      statusBox.className = "status-box";
      statusBox.textContent = "⚡ 正在連線至 Google 試算表...";
      statusBox.classList.remove("hidden");
    }

    if (!this.gasUrl) {
      if (statusBox) {
        statusBox.className = "status-box error";
        statusBox.textContent = "❌ 未設定 Web App URL！";
      }
      return;
    }

    try {
      const res = await fetch(`${this.gasUrl}?action=getInitData&date=${this.currentSelectedDate}`);
      const data = await res.json();
      if (data.status === "success") {
        if (statusBox) {
          statusBox.className = "status-box success";
          statusBox.textContent = `✅ 連線成功！`;
        }
      } else {
        throw new Error(data.message || "未知回應");
      }
    } catch (err) {
      if (statusBox) {
        statusBox.className = "status-box error";
        statusBox.textContent = `❌ 連線失敗: ${err.message}`;
      }
    }
  }

  async fetchDataFromGas() {
    if (!this.gasUrl) return;
    try {
      const res = await fetch(`${this.gasUrl}?action=getInitData&date=${this.currentSelectedDate}`);
      const data = await res.json();
      if (data.status === "success") {
        if (data.menu && data.menu.length > 0) this.menu = data.menu;
        if (data.orders) this.orders = data.orders;
        if (data.schedule) this.schedule = data.schedule;
        if (data.topUps) this.topUps = data.topUps;

        if (data.restaurantName) {
          const restNameEl = document.getElementById("restaurant-name");
          if (restNameEl) restNameEl.textContent = data.restaurantName;
        }

        this.renderAllViews();
        this.showToast(`✅ 已同步 Google 試算表 (${this.currentSelectedDate})`);
      }
    } catch (err) {
      console.warn("GAS load error, using local fallback:", err);
      this.renderAllViews();
    }
  }

  resetToDemoMode() {
    localStorage.removeItem("lunch_app_gas_url");
    localStorage.removeItem("lunch_app_mock_orders");
    localStorage.removeItem("lunch_app_mock_schedule");
    localStorage.removeItem("lunch_app_mock_topups");
    this.gasUrl = DEFAULT_GAS_URL || "";
    const availableDates = getAvailableOrderDates();
    this.currentSelectedDate = availableDates.length > 0 ? availableDates[0].date : getTodayString(0);
    this.schedule = [...MOCK_SCHEDULE];
    this.menu = [...MOCK_XINGYUAN_MENU];
    this.topUps = [...MOCK_TOPUPS];
    this.orders = [...MOCK_INITIAL_ORDERS];
    
    this.renderDateSwitcher();
    this.renderAllViews();
    this.showToast("🔄 已重置為展示模式");
  }

  saveLocalState() {
    localStorage.setItem("lunch_app_mock_orders", JSON.stringify(this.orders));
    localStorage.setItem("lunch_app_mock_schedule", JSON.stringify(this.schedule));
    localStorage.setItem("lunch_app_mock_topups", JSON.stringify(this.topUps));
  }

  refreshData() {
    if (this.gasUrl) {
      this.fetchDataFromGas();
    } else {
      this.renderAllViews();
      this.showToast("🔄 已重新整理介面");
    }
  }

  renderAllViews() {
    this.renderMenu();
    this.renderOverview();
    this.renderTreasury();
    this.updateUserUI();
  }

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast";
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2800);
  }
}

// Global App Instance
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new LunchApp();
});
