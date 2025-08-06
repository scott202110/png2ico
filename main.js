/**
 * 木柵動物園導覽網站 - 主要JavaScript功能
 * 專為65-75歲長者設計的友善互動功能
 */

// 全域變數
let currentTime = new Date();
let weatherData = null;

// ===== DOM 載入完成後初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('木柵動物園導覽網站載入完成');
    
    // 初始化各項功能
    initSmoothScrolling();
    initNavbarCollapse();
    initAnimations();
    initWeatherInfo();
    initCurrentTime();
    initAccessibility();
    initScrollToTop();
    
    // 顯示歡迎訊息（第一次訪問）
    showWelcomeMessage();
});

// ===== 平滑滾動導航 =====
function initSmoothScrolling() {
    // 導航連結點擊事件
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 計算目標位置（考慮固定導航列高度）
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                // 平滑滾動到目標位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新導航列active狀態
                updateActiveNavLink(targetId);
                
                // 手機版自動收合選單
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ===== 導航列控制 =====
function initNavbarCollapse() {
    // 滾動時更新導航列樣式
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // 更新活動區段
        updateActiveNavOnScroll();
    });
}

// ===== 更新活動導航連結 =====
function updateActiveNavLink(targetId) {
    // 移除所有active類別
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加active到當前連結
    const activeLink = document.querySelector(`a[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===== 滾動時更新活動區段 =====
function updateActiveNavOnScroll() {
    const sections = ['home', 'schedule', 'animals', 'map', 'info'];
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navHeight + 100 && rect.bottom >= navHeight + 100) {
                updateActiveNavLink(`#${sectionId}`);
            }
        }
    });
}

// ===== 動畫效果初始化 =====
function initAnimations() {
    // 觀察器設定
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // 觀察所有時間軸項目
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // 觀察所有卡片
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// ===== 天氣資訊更新 =====
function initWeatherInfo() {
    const weatherElement = document.querySelector('.weather-section .alert');
    
    if (weatherElement) {
        // 模擬天氣資訊（實際應用可接入氣象API）
        updateWeatherDisplay(weatherElement);
        
        // 每30分鐘更新一次
        setInterval(() => {
            updateWeatherDisplay(weatherElement);
        }, 30 * 60 * 1000);
    }
}

function updateWeatherDisplay(element) {
    const weather = getSimulatedWeather();
    const weatherIcon = getWeatherIcon(weather.condition);
    
    element.innerHTML = `
        <i class="bi ${weatherIcon} me-2"></i>
        <strong>今日天氣提醒：</strong>
        ${weather.description}，氣溫${weather.temp}°C，${weather.advice}
    `;
}

function getSimulatedWeather() {
    // 模擬天氣資料
    const conditions = [
        {
            condition: 'sunny',
            description: '預報晴朗',
            temp: '26-32',
            advice: '請記得攜帶帽子、防曬用品和充足飲水！'
        },
        {
            condition: 'cloudy',
            description: '多雲時晴',
            temp: '24-29',
            advice: '適合戶外活動，建議攜帶薄外套備用'
        },
        {
            condition: 'rainy',
            description: '午後可能有陣雨',
            temp: '22-28',
            advice: '請攜帶雨具，注意腳下濕滑'
        }
    ];
    
    // 根據時間模擬不同天氣（簡化版）
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
        return conditions[0]; // 白天通常晴朗
    } else {
        return conditions[1]; // 其他時間多雲
    }
}

function getWeatherIcon(condition) {
    const icons = {
        'sunny': 'bi-sun-fill',
        'cloudy': 'bi-cloud-sun-fill',
        'rainy': 'bi-cloud-rain-fill'
    };
    return icons[condition] || 'bi-cloud-sun-fill';
}

// ===== 即時時間顯示 =====
function initCurrentTime() {
    // 在適當的位置顯示當前時間
    updateCurrentTimeDisplay();
    
    // 每分鐘更新一次
    setInterval(updateCurrentTimeDisplay, 60000);
}

function updateCurrentTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // 如果有時間顯示元素，更新它
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// ===== 無障礙功能增強 =====
function initAccessibility() {
    // 鍵盤導航支援
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // 為重要按鈕添加鍵盤提示
    addKeyboardHints();
    
    // 為圖片添加適當的alt屬性
    enhanceImageAccessibility();
}

function handleKeyboardNavigation(e) {
    // Tab鍵導航增強
    if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        // 跳過隱藏元素
        if (e.shiftKey) {
            // Shift+Tab - 向前導航
            focusPreviousElement(focusableElements, currentIndex);
        } else {
            // Tab - 向後導航  
            focusNextElement(focusableElements, currentIndex);
        }
    }
    
    // Enter鍵激活按鈕
    if (e.key === 'Enter' && document.activeElement.classList.contains('btn')) {
        document.activeElement.click();
    }
}

function getFocusableElements() {
    return document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
}

function addKeyboardHints() {
    // 為主要按鈕添加鍵盤操作提示
    document.querySelectorAll('.btn').forEach(btn => {
        btn.setAttribute('title', btn.getAttribute('title') + ' (按Enter鍵激活)');
    });
}

function enhanceImageAccessibility() {
    // 為沒有alt屬性的圖片添加描述
    document.querySelectorAll('img:not([alt])').forEach(img => {
        img.setAttribute('alt', '動物園相關圖片');
    });
}

// ===== 回到頂部功能 =====
function initScrollToTop() {
    // 建立回到頂部按鈕
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollTopBtn.setAttribute('title', '回到頂部');
    scrollTopBtn.setAttribute('aria-label', '回到頁面頂部');
    document.body.appendChild(scrollTopBtn);
    
    // 監聽滾動事件
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // 點擊回到頂部
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== 歡迎訊息 =====
function showWelcomeMessage() {
    // 檢查是否為第一次訪問
    if (!localStorage.getItem('visitedBefore')) {
        setTimeout(() => {
            const welcomeModal = createWelcomeModal();
            document.body.appendChild(welcomeModal);
            
            const modal = new bootstrap.Modal(welcomeModal);
            modal.show();
            
            // 標記已訪問
            localStorage.setItem('visitedBefore', 'true');
        }, 1000);
    }
}

function createWelcomeModal() {
    const modalHtml = `
        <div class="modal fade" id="welcomeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h4 class="modal-title fs-3">
                            <i class="bi bi-heart-fill me-2"></i>
                            歡迎來到木柵動物園導覽！
                        </h4>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="text-center mb-4">
                            <i class="bi bi-tree-fill text-success" style="font-size: 4rem;"></i>
                        </div>
                        <h5 class="fs-4 text-center mb-4">準備好展開精彩的動物園之旅了嗎？</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                                    <span class="fs-5">詳細的行程安排</span>
                                </div>
                                <div class="d-flex align-items-center mb-3">
                                    <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                                    <span class="fs-5">明星動物介紹</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                                    <span class="fs-5">園區地圖導覽</span>
                                </div>
                                <div class="d-flex align-items-center mb-3">
                                    <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                                    <span class="fs-5">實用設施資訊</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-lg px-4" data-bs-dismiss="modal">
                            <i class="bi bi-arrow-right me-2"></i>
                            開始探索
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    return modalContainer.firstElementChild;
}

// ===== 動物知識小測驗 =====
function initAnimalQuiz() {
    const quizData = [
        {
            question: "大貓熊最活躍的時間是？",
            options: ["早上9-11點", "中午12-2點", "下午3-5點", "晚上6-8點"],
            correct: 0,
            explanation: "大貓熊在早上9-11點最為活躍，這是觀賞的最佳時機！"
        },
        {
            question: "無尾熊每天大約睡多少小時？",
            options: ["8-10小時", "12-15小時", "18-22小時", "24小時"],
            correct: 2,
            explanation: "無尾熊每天睡眠18-22小時，是真正的睡眠冠軍！"
        },
        {
            question: "台灣黑熊胸前的特殊標記是什麼形狀？",
            options: ["圓形", "三角形", "V字形", "十字形"],
            correct: 2,
            explanation: "台灣黑熊胸前有獨特的V字形白色斑紋，這是牠們的招牌特徵！"
        }
    ];
    
    // 可以在適當時機觸發測驗
    window.animalQuiz = {
        data: quizData,
        start: startQuiz
    };
}

function startQuiz() {
    // 建立測驗介面
    const quizModal = createQuizModal();
    document.body.appendChild(quizModal);
    
    const modal = new bootstrap.Modal(quizModal);
    modal.show();
}

// ===== 本地儲存功能 =====
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.log('無法儲存到本地儲存:', e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.log('無法從本地儲存讀取:', e);
        return null;
    }
}

// ===== 偏好設定 =====
function initUserPreferences() {
    // 載入使用者偏好
    const preferences = loadFromLocalStorage('userPreferences') || {
        fontSize: 'normal',
        highContrast: false,
        reducedMotion: false
    };
    
    applyUserPreferences(preferences);
}

function applyUserPreferences(preferences) {
    const body = document.body;
    
    // 字體大小
    body.classList.remove('font-large', 'font-extra-large');
    if (preferences.fontSize === 'large') {
        body.classList.add('font-large');
    } else if (preferences.fontSize === 'extra-large') {
        body.classList.add('font-extra-large');
    }
    
    // 高對比度
    if (preferences.highContrast) {
        body.classList.add('high-contrast');
    } else {
        body.classList.remove('high-contrast');
    }
    
    // 減少動畫
    if (preferences.reducedMotion) {
        body.classList.add('reduced-motion');
    } else {
        body.classList.remove('reduced-motion');
    }
}

// ===== 緊急聯絡功能 =====
function initEmergencyContacts() {
    // 為緊急聯絡按鈕添加一鍵撥號功能
    document.querySelectorAll('.emergency-call').forEach(btn => {
        btn.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('data-phone');
            if (phoneNumber) {
                // 確認撥號
                if (confirm(`確定要撥打 ${phoneNumber} 嗎？`)) {
                    window.location.href = `tel:${phoneNumber}`;
                }
            }
        });
    });
}

// ===== 工具函數 =====
function formatTime(date) {
    return date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(date) {
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

function isMobileDevice() {
    return window.innerWidth <= 768;
}

function isHighContrastMode() {
    return window.matchMedia('(prefers-contrast: high)').matches;
}

function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===== 錯誤處理 =====
window.addEventListener('error', function(e) {
    console.error('網站發生錯誤:', e.error);
    
    // 可以發送錯誤報告到服務器
    // sendErrorReport(e.error);
});

// ===== 頁面卸載時清理 =====
window.addEventListener('beforeunload', function() {
    // 清理任何正在進行的動畫或計時器
    clearInterval();
    
    // 儲存當前狀態
    const currentState = {
        scrollPosition: window.pageYOffset,
        timestamp: Date.now()
    };
    
    saveToLocalStorage('pageState', currentState);
});

// ===== 對外API =====
window.ZooGuide = {
    // 公開的方法
    scrollToSection: function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    showWeather: function() {
        const weatherSection = document.querySelector('.weather-section');
        if (weatherSection) {
            weatherSection.scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    startQuiz: startQuiz,
    
    // 偏好設定
    setFontSize: function(size) {
        const preferences = loadFromLocalStorage('userPreferences') || {};
        preferences.fontSize = size;
        saveToLocalStorage('userPreferences', preferences);
        applyUserPreferences(preferences);
    }
};

console.log('木柵動物園導覽系統已準備就緒！');
