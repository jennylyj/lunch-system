/**
 * 訂餐系統 (Lunch Ordering System) v2.3 - Main Frontend JS
 * 修正：移除後端設定頁面後補全 DOM 空值檢查，避免 JS 例外中斷選單渲染
 */

// 💡【主辦人設定區域】請在此貼上您的 Google Apps Script Web App URL
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbyluRniu4RRRg8YBnmMMx_uMHBjJrKtZ8_to2h9FvT0ZExV6h0dz4WzzgQeZdnpo6eP/exec";

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

function findScheduleForDate(schedule, targetDate) {
  if (!schedule || !targetDate) return null;
  const normalize = dStr => {
    if (!dStr) return "";
    const clean = String(dStr).trim().replace(/\//g, '-');
    const parts = clean.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    return clean;
  };
  const normTarget = normalize(targetDate);
  return schedule.find(s => normalize(s.date) === normTarget);
}

const MOCK_SCHEDULE = getAvailableOrderDates().map((item, idx) => {
  if (idx === 1) {
    return {
      date: item.date,
      restaurantName: "Uber Eats 麥當勞團購",
      status: "開放點餐",
      note: "麥當勞外送團購專案",
      groupOrderUrl: "https://www.ubereats.com"
    };
  }
  return {
    date: item.date,
    restaurantName: "台大醫學院 - 杏園",
    status: "開放點餐",
    note: `${item.label} 排程`,
    groupOrderUrl: ""
  };
});

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
    const currentScheduleItem = findScheduleForDate(this.schedule, this.currentSelectedDate);
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

    // 點選日期切換時，自動切換至「今日/預約點餐」頁面
    this.switchTab("order-page");

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
      if (o.username === username && o.status !== "已取消") {
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
      this.renderMenu();
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
    const categoryPills = document.getElementById("category-pills");
    let externalSection = document.getElementById("external-group-order-section");
    if (!container) return;
    container.innerHTML = "";

    // 防呆：若舊版 HTML 快取導致未包含 external-group-order-section，自動動態建立
    if (!externalSection) {
      externalSection = document.createElement("div");
      externalSection.id = "external-group-order-section";
      externalSection.className = "external-order-card";
      externalSection.style.display = "none";
      externalSection.innerHTML = `
        <div class="external-card-header">
          <span class="external-badge" style="display: inline-block; background: #06c167; color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-bottom: 8px;">🛵 Uber Eats / 外部團購</span>
          <h2 id="external-rest-name" style="font-size: 1.3rem; font-weight: 800; margin-bottom: 6px;">Uber Eats 團購點餐</h2>
          <p class="external-note" id="external-rest-note" style="font-size: 0.88rem; color: #64748b; line-height: 1.4;">請先點擊下方按鈕前往外部連結完成團購，完成後回到本頁登記您的餐點明細與個人金額。</p>
        </div>
        
        <div class="external-action-box" style="margin: 16px 0 20px 0;">
          <a id="external-order-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg btn-block external-link-btn" style="background: linear-gradient(135deg, #06c167 0%, #049b52 100%); color: white; font-size: 1.05rem; font-weight: 700; padding: 14px 20px; border-radius: 8px; text-decoration: none; display: block; text-align: center; box-shadow: 0 4px 12px rgba(6, 193, 103, 0.3);">
            🚀 點我去點餐 (開啟團購連結)
          </a>
        </div>

        <div class="external-form-card" style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px;">📝 登記您的點餐金額 (連動金庫扣款)</h3>
          <div class="form-group" style="margin-bottom: 12px;">
            <label for="custom-item-name" style="font-weight: 600; display: block; margin-bottom: 4px;">餐點品項 / 備註明細：</label>
            <input type="text" id="custom-item-name" class="form-input" placeholder="例：大麥克套餐 + 薯條加大 + 可樂" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1;" />
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="custom-item-price" style="font-weight: 600; display: block; margin-bottom: 4px;">您在 Uber 點餐的總金額 ($)：</label>
            <input type="number" id="custom-item-price" class="form-input" placeholder="例：185" min="1" step="1" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1;" />
          </div>
          <button class="btn btn-success btn-block" onclick="app.submitCustomOrder()" style="width: 100%; padding: 12px; font-size: 1rem; font-weight: bold; border-radius: 8px; background: #059669; color: white; border: none; cursor: pointer;">
            ✅ 送出金額並記錄到金庫
          </button>
        </div>
      `;
      const orderPage = document.getElementById("order-page");
      if (orderPage) {
        orderPage.insertBefore(externalSection, categoryPills || container);
      }
    }

    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    const currentScheduleItem = findScheduleForDate(this.schedule, this.currentSelectedDate);

    // 判斷是否為 Uber Eats 或外部團購模式
    const isExternalOrder = currentScheduleItem && (
      Boolean(currentScheduleItem.groupOrderUrl) ||
      (currentScheduleItem.restaurantName && (/uber/i.test(currentScheduleItem.restaurantName) || currentScheduleItem.restaurantName.includes("團購"))) ||
      (currentScheduleItem.note && (currentScheduleItem.note.includes("http://") || currentScheduleItem.note.includes("https://")))
    );

    if (externalSection) {
      if (isExternalOrder && dateCheck.orderable) {
        externalSection.style.display = "block";
        if (categoryPills) categoryPills.style.display = "none";
        container.style.display = "none";

        const extRestName = document.getElementById("external-rest-name");
        const extRestNote = document.getElementById("external-rest-note");
        const extOrderBtn = document.getElementById("external-order-btn");

        const restTitle = currentScheduleItem.restaurantName || "Uber Eats 團購點餐";
        if (extRestName) extRestName.textContent = restTitle;

        if (extRestNote) {
          extRestNote.textContent = currentScheduleItem.note ? `${currentScheduleItem.note}。完成 Uber 點餐後，請於下方登記您的餐點明細與個人金額。` : "請先點擊下方按鈕前往外部連結完成團購，完成後回到本頁登記您的餐點明細與個人金額。";
        }

        let linkUrl = currentScheduleItem ? (currentScheduleItem.groupOrderUrl || "").trim() : "";
        let isFromSheet = Boolean(linkUrl);
        if (!linkUrl && currentScheduleItem && currentScheduleItem.note) {
          const match = currentScheduleItem.note.match(/(https?:\/\/[^\s"'<>]+)/);
          if (match) {
            linkUrl = match[0];
            isFromSheet = true;
          }
        }
        if (!linkUrl && currentScheduleItem && currentScheduleItem.restaurantName) {
          const match = currentScheduleItem.restaurantName.match(/(https?:\/\/[^\s"'<>]+)/);
          if (match) {
            linkUrl = match[0];
            isFromSheet = true;
          }
        }
        
        const hasValidCustomUrl = isFromSheet && Boolean(linkUrl);
        if (!linkUrl) linkUrl = "https://www.ubereats.com";

        if (extOrderBtn) {
          extOrderBtn.href = linkUrl;
          if (hasValidCustomUrl) {
            extOrderBtn.innerHTML = `🚀 點我看團購 / 點餐連結 (開啟網頁)`;
            extOrderBtn.style.background = "linear-gradient(135deg, #06c167 0%, #049b52 100%)";
          } else {
            extOrderBtn.innerHTML = `⚠️ 未偵測到試算表團購連結 (點此預設開啟 Uber 官網)`;
            extOrderBtn.style.background = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
          }
        }

        return;
      } else {
        externalSection.style.display = "none";
        if (categoryPills) categoryPills.style.display = "flex";
        container.style.display = "block";
      }
    }

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
      status: "已確認",
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

  async submitCustomOrder() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    if (!dateCheck.orderable) {
      this.showToast(`⚠️ 無法送出：${dateCheck.reason}`);
      return;
    }

    const itemNameInput = document.getElementById("custom-item-name");
    const itemPriceInput = document.getElementById("custom-item-price");

    const itemName = itemNameInput ? itemNameInput.value.trim() : "";
    const itemPrice = itemPriceInput ? parseFloat(itemPriceInput.value) : 0;

    if (!itemName) {
      this.showToast("⚠️ 請輸入餐點品項明細！");
      if (itemNameInput) itemNameInput.focus();
      return;
    }

    if (isNaN(itemPrice) || itemPrice <= 0) {
      this.showToast("⚠️ 請輸入有效的消費總金額！");
      if (itemPriceInput) itemPriceInput.focus();
      return;
    }

    const itemDetailsStr = `${itemName} (自訂/Uber團購)`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      timestamp: timeStr,
      date: this.currentSelectedDate,
      username: this.currentUser,
      totalPrice: itemPrice,
      status: "已確認",
      items: [{ name: itemName, price: itemPrice, qty: 1 }]
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
            totalPrice: itemPrice,
            itemDetails: itemDetailsStr,
            orderDate: this.currentSelectedDate,
            items: [{ name: itemName, price: itemPrice, qty: 1 }]
          })
        });
      } catch (err) {
        console.warn("GAS POST custom order error:", err);
      }
    }

    this.orders.unshift(newOrder);
    this.saveLocalState();

    if (itemNameInput) itemNameInput.value = "";
    if (itemPriceInput) itemPriceInput.value = "";

    this.showToast(`🎉 成功登記 $${itemPrice} 團購金額！`);
    this.updateUserUI();
    this.switchTab("overview-page");
  }

  switchOverviewMode(mode) {
    this.overviewMode = mode;
    const btnItems = document.getElementById("btn-mode-items");
    const btnPeople = document.getElementById("btn-mode-people");
    if (btnItems) btnItems.classList.toggle("active", mode === "by-items");
    if (btnPeople) btnPeople.classList.toggle("active", mode === "by-people");
    this.renderOverview();
  }

  normalizeOrders(orders) {
    if (!Array.isArray(orders)) return [];

    const menuMap = {};
    if (Array.isArray(this.menu)) {
      this.menu.forEach(m => {
        if (m && m.name) {
          menuMap[m.name.trim()] = parseFloat(String(m.price || 0).replace(/[^0-9.]/g, '')) || 0;
        }
      });
    }

    return orders.map(ord => {
      let totalPrice = parseFloat(String(ord.totalPrice || 0).replace(/[^0-9.]/g, '')) || 0;
      let items = Array.isArray(ord.items) ? ord.items : [];

      items = items.map(it => {
        const name = String(it.name || '').trim();
        const qty = parseInt(it.qty) || 1;
        let price = parseFloat(String(it.price || 0).replace(/[^0-9.]/g, '')) || 0;

        if (price === 0 && menuMap[name]) {
          price = menuMap[name];
        }

        return { name, qty, price };
      });

      if (items.length === 1 && items[0].price === 0 && totalPrice > 0 && items[0].qty > 0) {
        items[0].price = Math.round(totalPrice / items[0].qty);
      }

      let calculatedTotal = 0;
      items.forEach(it => {
        calculatedTotal += it.price * it.qty;
      });

      if (totalPrice === 0 && calculatedTotal > 0) {
        totalPrice = calculatedTotal;
      }

      return {
        ...ord,
        totalPrice: totalPrice,
        items: items
      };
    });
  }

  renderOverview() {
    const container = document.getElementById("overview-content");
    const countTag = document.getElementById("total-orders-tag");
    if (!container) return;
    container.innerHTML = "";

    this.orders = this.normalizeOrders(this.orders);

    const dateOrders = this.orders.filter(o => !o.date || o.date === this.currentSelectedDate);
    const activeOrders = dateOrders.filter(o => o.status !== "已取消");

    let totalItemCount = 0;
    activeOrders.forEach(o => {
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

    const dateCheck = checkDateOrderable(this.currentSelectedDate);
    const currentScheduleItem = findScheduleForDate(this.schedule, this.currentSelectedDate);
    const isLocked = !dateCheck.orderable || (currentScheduleItem && currentScheduleItem.status === "已截止");

    if (this.overviewMode === "by-items") {
      const itemMap = {};
      activeOrders.forEach(ord => {
        ord.items.forEach(it => {
          if (!itemMap[it.name]) {
            itemMap[it.name] = { totalQty: 0, price: it.price, buyers: {} };
          } else if (!itemMap[it.name].price && it.price) {
            itemMap[it.name].price = it.price;
          }
          itemMap[it.name].totalQty += it.qty;
          itemMap[it.name].buyers[ord.username] = (itemMap[it.name].buyers[ord.username] || 0) + it.qty;
        });
      });

      if (Object.keys(itemMap).length === 0) {
        container.innerHTML = `
          <div class="overview-card" style="text-align: center; color: var(--text-muted); padding: 30px;">
            🛵 ${this.currentSelectedDate} 無有效訂購餐點 (已取消除外)
          </div>
        `;
        return;
      }

      Object.entries(itemMap).forEach(([itemName, itemInfo]) => {
        const buyersList = Object.entries(itemInfo.buyers).map(([user, q]) => `${user}${q > 1 ? ` x${q}` : ''}`).join("、");

        const card = document.createElement("div");
        card.className = "overview-card";
        const priceText = itemInfo.price ? `單價${itemInfo.price}元` : `單價未知`;
        card.innerHTML = `
          <div class="overview-card-header">
            <div class="item-title-wrap">
              <span class="item-count-badge">x ${itemInfo.totalQty}</span>
              <span class="item-name-lg">${itemName}</span>
            </div>
            <span class="item-price">${priceText}</span>
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
          personMap[ord.username] = { orders: [], activeTotal: 0 };
        }
        personMap[ord.username].orders.push(ord);
        if (ord.status !== "已取消") {
          personMap[ord.username].activeTotal += ord.totalPrice;
        }
      });

      Object.entries(personMap).forEach(([user, data]) => {
        const card = document.createElement("div");
        card.className = "overview-card";

        let ordersHtml = "";
        data.orders.forEach(ord => {
          const isCancelled = ord.status === "已取消";
          const isCurrentUser = user === this.currentUser;
          const itemsStr = ord.items.map(i => `${i.name} x${i.qty}`).join('、');

          let actionBtnHtml = "";
          if (isCancelled) {
            actionBtnHtml = `<span class="badge-order-cancelled">已取消</span>`;
          } else if (isCurrentUser) {
            if (isLocked) {
              actionBtnHtml = `<span class="badge-order-locked">🔒 已截止</span>`;
            } else {
              actionBtnHtml = `<button class="btn-cancel-order" onclick="app.showCancelConfirmModal('${ord.id}')">🗑️ 取消</button>`;
            }
          }

          ordersHtml += `
            <div class="person-order-row ${isCancelled ? 'order-row-cancelled' : ''}">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span>${itemsStr}</span>
                ${ord.timestamp ? `<span style="font-size: 0.75rem; color: var(--text-muted);">${ord.timestamp}</span>` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; ${isCancelled ? 'text-decoration: line-through;' : ''}">$${ord.totalPrice}</span>
                ${actionBtnHtml}
              </div>
            </div>
          `;
        });

        card.innerHTML = `
          <div class="overview-card-header">
            <span class="item-name-lg">👤 ${user} ${user === this.currentUser ? '<span style="font-size: 0.75rem; color: var(--primary-color); background: var(--primary-light); padding: 2px 6px; border-radius: 10px;">本人</span>' : ''}</span>
            <span class="user-balance" style="font-size: 0.9rem;">小計 $${data.activeTotal}</span>
          </div>
          <div class="person-orders-list">
            ${ordersHtml}
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

    const activeDateOrders = this.orders.filter(o => (!o.date || o.date === this.currentSelectedDate) && o.status !== "已取消");

    if (this.overviewMode === "by-items") {
      const itemMap = {};
      activeDateOrders.forEach(ord => {
        ord.items.forEach(it => {
          if (!itemMap[it.name]) itemMap[it.name] = { qty: 0, price: it.price, buyers: {} };
          else if (!itemMap[it.name].price && it.price) itemMap[it.name].price = it.price;
          itemMap[it.name].qty += it.qty;
          itemMap[it.name].buyers[ord.username] = (itemMap[it.name].buyers[ord.username] || 0) + it.qty;
        });
      });

      Object.entries(itemMap).forEach(([name, info]) => {
        const buyers = Object.entries(info.buyers).map(([u, q]) => `${u}${q > 1 ? `x${q}` : ''}`).join(", ");
        const priceStr = info.price ? ` (單價${info.price}元)` : '';
        text += `• ${name} x${info.qty}${priceStr} (${buyers})\n`;
      });
    } else {
      const personMap = {};
      activeDateOrders.forEach(ord => {
        if (!personMap[ord.username]) personMap[ord.username] = { items: [], total: 0 };
        ord.items.forEach(it => personMap[ord.username].items.push(`${it.name} x${it.qty}`));
        personMap[ord.username].total += ord.totalPrice;
      });

      Object.entries(personMap).forEach(([user, info]) => {
        text += `👤 ${user}: ${info.items.join(", ")} (消費總額 $${info.total})\n`;
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

  showCancelConfirmModal(orderId) {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      this.showToast("⚠️ 找不到該筆訂單！");
      return;
    }

    if (order.username !== this.currentUser) {
      this.showToast("⚠️ 您無權取消他人的訂單！");
      return;
    }

    const dateCheck = checkDateOrderable(order.date || this.currentSelectedDate);
    const currentScheduleItem = findScheduleForDate(this.schedule, order.date || this.currentSelectedDate);
    const isLocked = !dateCheck.orderable || (currentScheduleItem && currentScheduleItem.status === "已截止");

    if (isLocked) {
      this.showToast("🔒 該日期已截止點餐，無法取消。");
      return;
    }

    const dateEl = document.getElementById("cancel-modal-date");
    const userEl = document.getElementById("cancel-modal-username");
    const itemsEl = document.getElementById("cancel-modal-items");
    const amountEl = document.getElementById("cancel-modal-amount");
    const submitBtn = document.getElementById("cancel-confirm-submit-btn");

    if (dateEl) dateEl.textContent = order.date || this.currentSelectedDate;
    if (userEl) userEl.textContent = order.username;
    if (itemsEl) itemsEl.textContent = order.items.map(i => `${i.name} x${i.qty}`).join("、");
    if (amountEl) amountEl.textContent = `$${order.totalPrice}`;

    if (submitBtn) {
      submitBtn.onclick = () => this.confirmCancelOrder(orderId);
    }

    const modal = document.getElementById("cancel-confirm-modal");
    if (modal) modal.classList.remove("hidden");
  }

  closeCancelConfirmModal() {
    const modal = document.getElementById("cancel-confirm-modal");
    if (modal) modal.classList.add("hidden");
  }

  async confirmCancelOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = "已取消";
    this.saveLocalState();

    this.closeCancelConfirmModal();
    this.showToast("⏳ 正在更新取消狀態...");

    if (this.gasUrl) {
      try {
        await fetch(this.gasUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cancelOrder",
            orderId: order.id,
            username: order.username,
            orderDate: order.date || this.currentSelectedDate
          })
        });
      } catch (err) {
        console.warn("GAS cancel order error:", err);
      }
    }

    this.updateUserUI();
    this.renderOverview();
    this.renderTreasury();
    this.showToast("✅ 已成功取消訂單！金額已退回您的餘額。");
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
          if (o.username === uName && o.status !== "已取消") totalSpent += o.totalPrice;
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
        if (o.username === this.currentUser && o.status !== "已取消") myTotalSpent += o.totalPrice;
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
      const res = await fetch(`${this.gasUrl}?action=getInitData&date=${this.currentSelectedDate}&_t=${Date.now()}`);
      const data = await res.json();
      if (data.status === "success") {
        if (data.menu && data.menu.length > 0) this.menu = data.menu;
        if (data.schedule) {
          this.schedule = data.schedule;
          localStorage.setItem("lunch_app_mock_schedule", JSON.stringify(this.schedule));
        }
        if (data.topUps) {
          // 保留尚未同步至 GAS 試算表的本地新新增儲值紀錄
          const incomingTopUps = data.topUps;
          const localUnsyncedTopUps = (this.topUps || []).filter(t => {
            return !incomingTopUps.some(g => g.timestamp === t.timestamp && g.username === t.username && g.amount === t.amount);
          });
          this.topUps = [...localUnsyncedTopUps, ...incomingTopUps];
          localStorage.setItem("lunch_app_mock_topups", JSON.stringify(this.topUps));
        }

        if (data.orders) {
          const fetchDate = data.selectedDate || this.currentSelectedDate;
          // 確保每筆由 GAS 回傳的訂單都含有 date 屬性
          const incomingOrders = data.orders.map(o => ({
            ...o,
            date: o.date || fetchDate
          }));

          // 保留本地建立但尚未在 GAS 列表中出現的訂單 (id 以 ord- 開頭)
          const localUnsyncedOrders = (this.orders || []).filter(o => o.id && o.id.startsWith("ord-"));
          const incomingIds = new Set(incomingOrders.map(o => o.id));
          const unsyncedLocal = localUnsyncedOrders.filter(o => !incomingIds.has(o.id));

          // 判斷回傳資料是否已包含跨日訂單，或明確含有與 fetchDate 不同的 date 標籤
          const hasMultipleDatesOrExplicitDate = data.orders.some(o => Boolean(o.date) && o.date !== fetchDate);

          if (hasMultipleDatesOrExplicitDate) {
            // 新版 GAS：回傳所有歷史日期的全量訂單 + 保留本地未同步訂單
            this.orders = [...unsyncedLocal, ...incomingOrders];
          } else {
            // 舊版 GAS 或單日回應：僅替換 fetchDate 當天的訂單，保留其他日期的歷史紀錄與本地未同步訂單
            const otherDateOrders = (this.orders || []).filter(o => o.date && o.date !== fetchDate && !o.id?.startsWith("ord-"));
            this.orders = [...unsyncedLocal, ...incomingOrders, ...otherDateOrders];
          }
          this.saveLocalState();
        }

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
