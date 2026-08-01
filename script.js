/*====================================
FFKIPAS BY MUHLIS
PREMIUM JS V4
====================================*/

/* ===========================
RESET HISTORY SAAT SESSION BARU
=========================== */
if (!sessionStorage.getItem("loaded")) {
    localStorage.removeItem("trxHistory");
    sessionStorage.setItem("loaded", "true");
}


/* ===========================
PREMIUM TOAST
=========================== */
function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    const icon = toast.querySelector(".toast-icon");
    const titleEl = document.getElementById("toastTitle");
    const msgEl = document.getElementById("toastMsg");

    toast.classList.remove("show", "error", "warning");

    if (type === "error") {
        toast.classList.add("error");
        if (icon) icon.textContent = "✕";
    } else if (type === "warning") {
        toast.classList.add("warning");
        if (icon) icon.textContent = "!";
    } else {
        if (icon) icon.textContent = "✓";
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    // force reflow then show
    void toast.offsetWidth;
    toast.classList.add("show");

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}


/* ===========================
UNLOCK PAGE (fix stuck overlays)
=========================== */
function unlockPage() {
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";

    const ids = [
        ["sideMenu", "open"],
        ["menuOverlay", "show"],
        ["searchPanel", "show"],
        ["searchOverlay", "show"],
        ["popup", "active"],
        ["processing", "active"],
        ["invoice", "active"],
        ["chatMenu", "show"],
        ["groupChatPanel", "show"],
        ["groupChatOverlay", "show"]
    ];
    ids.forEach(([id, cls]) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove(cls);
    });

    const menuBtn = document.getElementById("menuBtn");
    const searchBtn = document.getElementById("searchBtn");
    const chatToggle = document.getElementById("chatToggle");
    if (menuBtn) menuBtn.classList.remove("active");
    if (searchBtn) searchBtn.classList.remove("active");
    if (chatToggle) chatToggle.classList.remove("active");
}

// pastikan overlay tidak nyangkut saat load
window.addEventListener("load", () => {
    unlockPage();
});

// ESC nutup semua
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        unlockPage();
        if (typeof closeSideMenu === "function") closeSideMenu();
        if (typeof closeSearch === "function") closeSearch();
        if (typeof closeChatMenu === "function") closeChatMenu();
    }
});

/* ===========================
HEADER BUTTONS + SIDE MENU
=========================== */
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

function openSideMenu() {
    if (sideMenu) sideMenu.classList.add("open");
    if (menuOverlay) menuOverlay.classList.add("show");
    if (menuBtn) menuBtn.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeSideMenu() {
    if (sideMenu) sideMenu.classList.remove("open");
    if (menuOverlay) menuOverlay.classList.remove("show");
    if (menuBtn) menuBtn.classList.remove("active");
    // jangan kunci body kalau search masih terbuka
    if (!document.getElementById("searchPanel")?.classList.contains("show")) {
        document.body.style.overflow = "";
    }
}

if (menuBtn) {
    menuBtn.onclick = (e) => {
        e.stopPropagation();
        if (sideMenu && sideMenu.classList.contains("open")) {
            closeSideMenu();
        } else {
            openSideMenu();
        }
    };
}

if (menuClose) menuClose.onclick = closeSideMenu;
if (menuOverlay) menuOverlay.onclick = closeSideMenu;

document.querySelectorAll(".side-link").forEach(link => {
    link.addEventListener("click", () => {
        closeSideMenu();
    });
});

const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");
const globalSearch = document.getElementById("globalSearch");
const searchEmpty = document.getElementById("searchEmpty");

function openSearch() {
    closeSideMenu();
    if (searchPanel) searchPanel.classList.add("show");
    if (searchOverlay) searchOverlay.classList.add("show");
    if (searchBtn) searchBtn.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        if (globalSearch) {
            globalSearch.value = "";
            globalSearch.focus();
            filterSearch("");
        }
    }, 50);
}

function closeSearch() {
    if (searchPanel) searchPanel.classList.remove("show");
    if (searchOverlay) searchOverlay.classList.remove("show");
    if (searchBtn) searchBtn.classList.remove("active");
    if (!document.getElementById("sideMenu")?.classList.contains("open")) {
        document.body.style.overflow = "";
    }
}

function filterSearch(query) {
    const q = (query || "").trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".search-item").forEach(item => {
        const text = item.textContent.toLowerCase();
        const match = !q || text.includes(q);
        item.classList.toggle("hidden-item", !match);
        if (match) visible++;
    });
    if (searchEmpty) searchEmpty.style.display = visible === 0 ? "block" : "none";
}

if (searchBtn) {
    searchBtn.onclick = (e) => {
        e.stopPropagation();
        if (searchPanel && searchPanel.classList.contains("show")) {
            closeSearch();
        } else {
            openSearch();
        }
    };
}

if (searchClose) searchClose.onclick = closeSearch;
if (searchOverlay) searchOverlay.onclick = closeSearch;

if (globalSearch) {
    globalSearch.addEventListener("input", () => filterSearch(globalSearch.value));
    globalSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeSearch();
        if (e.key === "Enter") {
            e.preventDefault();
            const first = document.querySelector(".search-item:not(.hidden-item)");
            if (first) first.click();
        }
    });
}

document.querySelectorAll(".search-item").forEach(item => {
    item.addEventListener("click", () => {
        const targetId = item.dataset.target;
        closeSearch();
        const target = document.getElementById(targetId);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                if (targetId === "accountCheck") {
                    setTimeout(() => {
                        const uid = document.getElementById("ffUid");
                        if (uid) uid.focus();
                    }, 450);
                }
            }, 120);
        }
    });
});

/* ===========================
COUNTER
=========================== */
const counter = document.getElementById("counter");
let number = 0;
const target = 12593821;
const speed = target / 250;

function updateCounter() {
    number += speed;
    if (number < target) {
        counter.innerHTML = Math.floor(number).toLocaleString();
        requestAnimationFrame(updateCounter);
    } else {
        counter.innerHTML = target.toLocaleString();
    }
}
if (counter) updateCounter();

/* ===========================
FAQ
=========================== */
document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector("button");
    const answer = item.querySelector("div");
    btn.onclick = () => {
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            answer.style.paddingBottom = "0";
        } else {
            answer.style.maxHeight = answer.scrollHeight + 20 + "px";
            answer.style.paddingBottom = "16px";
        }
    };
});

/* ===========================
SCROLL ANIMATION
=========================== */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".download-card, .game-card, .stat, .faq-item, .account-search, .calc-box").forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
});

/* ===========================
HEADER SCROLL
=========================== */
const header = document.querySelector(".header") || document.querySelector("header");
window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ===========================
DOWNLOAD ADS (3x klik)
=========================== */
const adLink = "https://www.effectivecpmnetwork.com/b8r0ht674?key=7390f2d0c006f1597d4c085f2dcf948f";

document.querySelectorAll(".download-card a").forEach(btn => {
    // Skip kalkulator (internal link)
    if (btn.classList.contains("calc-btn") || btn.getAttribute("href")?.startsWith("#")) {
        return;
    }

    let clickCount = 0;
    const downloadLink = btn.getAttribute("href");
    const originalText = btn.innerHTML;

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        clickCount++;

        if (clickCount <= 2) {
            try {
                window.open(adLink, "_blank");
            } catch (err) {}
            btn.innerHTML = `Klik ${3 - clickCount}x Lagi`;
            btn.style.opacity = "0.9";
        } else {
            btn.innerHTML = "⏳ Membuka...";
            window.location.href = downloadLink;
            // reset after a while if user stays
            setTimeout(() => {
                clickCount = 0;
                btn.innerHTML = originalText;
                btn.style.opacity = "1";
            }, 4000);
        }
    });
});

/* ===========================
TOPUP DEMO
=========================== */
const gameItems = {
    "FREE FIRE": {
        banner: "assets/banner/freefire.webp",
        uid: "Masukkan UID",
        items: [
            { name: "💎70", price: 10000 },
            { name: "💎140", price: 20000 },
            { name: "💎355", price: 50000 },
            { name: "💎720", price: 100000 }
        ]
    },
    "MOBILE LEGENDS": {
        banner: "assets/banner/mlbb.webp",
        uid: "Masukkan User ID",
        items: [
            { name: "💎86", price: 15000 },
            { name: "💎172", price: 30000 },
            { name: "💎257", price: 50000 },
            { name: "💎706", price: 150000 }
        ]
    },
    "PUBG MOBILE": {
        banner: "assets/banner/pubg.webp",
        uid: "Masukkan Character ID",
        items: [
            { name: "60 UC", price: 16000 },
            { name: "325 UC", price: 75000 },
            { name: "660 UC", price: 149000 },
            { name: "1800 UC", price: 390000 }
        ]
    },
    "ROBLOX": {
        banner: "assets/banner/roblox.webp",
        uid: "Masukkan Username",
        items: [
            { name: "80 Robux", price: 15000 },
            { name: "400 Robux", price: 70000 },
            { name: "800 Robux", price: 140000 },
            { name: "1700 Robux", price: 280000 }
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const popupTitle = document.getElementById("popupTitle");
    const popupBanner = document.getElementById("popupBanner");
    const summaryGame = document.getElementById("summaryGame");
    const summaryUid = document.getElementById("summaryUid");
    const summaryItem = document.getElementById("summaryItem");
    const summaryPay = document.getElementById("summaryPay");
    const summaryPrice = document.getElementById("summaryPrice");
    const uidInput = document.getElementById("uidInput");
    const serverInput = document.getElementById("serverInput");
    const totalPrice = document.getElementById("totalPrice");
    const diamondGrid = document.getElementById("diamondGrid");

    function renderDiamond(game) {
        if (!diamondGrid) return;
        const data = gameItems[game];
        if (!data) return;

        if (popupBanner) popupBanner.src = data.banner;
        if (uidInput) uidInput.placeholder = data.uid;

        diamondGrid.innerHTML = "";
        data.items.forEach(item => {
            diamondGrid.innerHTML += `
                <div class="diamond-card" data-price="${item.price}">
                    <b>${item.name}</b>
                    <span>Rp${item.price.toLocaleString("id-ID")}</span>
                </div>
            `;
        });

        if (serverInput) {
            if (game === "MOBILE LEGENDS") {
                serverInput.style.display = "block";
                serverInput.placeholder = "Masukkan Zone ID";
            } else {
                serverInput.style.display = "none";
            }
        }
        bindDiamondEvents();
    }

    function bindDiamondEvents() {
        document.querySelectorAll(".diamond-card").forEach(card => {
            card.onclick = () => {
                document.querySelectorAll(".diamond-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                const price = Number(card.dataset.price);
                if (totalPrice) totalPrice.textContent = "Rp" + price.toLocaleString("id-ID");
                if (summaryPrice) summaryPrice.textContent = "Rp" + price.toLocaleString("id-ID");
                if (summaryItem) summaryItem.textContent = card.querySelector("b").textContent;
            };
        });
    }

    const addCustom = document.getElementById("addCustomTopup");
    if (addCustom) {
        addCustom.onclick = () => {
            const value = Number(document.getElementById("customDiamond").value);
            if (!value) {
                alert("Masukkan jumlah terlebih dahulu!");
                return;
            }
            const price = value * 200;
            summaryItem.textContent = "💎 " + value;
            summaryPrice.textContent = "Rp" + price.toLocaleString("id-ID");
            totalPrice.textContent = "Rp" + price.toLocaleString("id-ID");
        };
    }

    if (!popup || !closePopup) return;

    const topupAdLink = "https://www.effectivecpmnetwork.com/b8r0ht674?key=7390f2d0c006f1597d4c085f2dcf948f";

    document.querySelectorAll(".game-card").forEach(card => {
        const btn = card.querySelector("button");
        if (!btn) return;

        btn.onclick = () => {
            const key = "topup_" + (card.dataset.game || "game");
            let clicks = Number(localStorage.getItem(key) || 0);

            if (clicks < 1) {
                localStorage.setItem(key, clicks + 1);
                window.open(topupAdLink, "_blank");
                return;
            }
            localStorage.removeItem(key);

            popup.classList.add("active");
            if (popupTitle) popupTitle.textContent = card.dataset.game || "";
            if (summaryGame) summaryGame.textContent = card.dataset.game || "";
            if (popupBanner && card.dataset.banner) popupBanner.src = card.dataset.banner;
            renderDiamond(card.dataset.game);
        };
    });

    closePopup.onclick = () => popup.classList.remove("active");
    popup.onclick = (e) => {
        if (e.target === popup) popup.classList.remove("active");
    };

    if (uidInput) {
        uidInput.oninput = () => {
            if (summaryUid) summaryUid.textContent = uidInput.value || "-";
        };
    }

    document.querySelectorAll(".pay-card").forEach(card => {
        card.onclick = () => {
            document.querySelectorAll(".pay-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            if (summaryPay) summaryPay.textContent = card.dataset.pay || "-";
        };
    });

    const buyBtn = document.getElementById("buyBtn");
    const invoice = document.getElementById("invoice");
    const processing = document.getElementById("processing");
    const loadingTitle = document.getElementById("loadingTitle");
    const loadingDesc = document.getElementById("loadingDesc");
    const closeInvoice = document.getElementById("closeInvoice");
    const copyInvoice = document.getElementById("copyInvoice");
    const downloadInvoice = document.getElementById("downloadInvoice");

    function set(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    if (buyBtn) {
        buyBtn.onclick = () => {
            const activeDiamond = document.querySelector(".diamond-card.active");
            const customDiamond = Number(document.getElementById("customDiamond")?.value || 0);
            const activePay = document.querySelector(".pay-card.active");

            if (!uidInput.value.trim()) {
                alert("⚠️ Masukkan UID terlebih dahulu!");
                uidInput.focus();
                return;
            }
            if (serverInput.style.display !== "none" && !serverInput.value.trim()) {
                alert("⚠️ Masukkan Zone ID!");
                serverInput.focus();
                return;
            }
            if (!activeDiamond && customDiamond <= 0) {
                alert("⚠️ Pilih nominal atau masukkan Nominal Bebas!");
                return;
            }
            if (!activePay) {
                alert("⚠️ Pilih Metode Pembayaran!");
                return;
            }

            buyBtn.disabled = true;
            buyBtn.innerHTML = "⏳ Memproses...";

            if (activeDiamond) {
                summaryItem.textContent = activeDiamond.querySelector("b").textContent;
            } else {
                summaryItem.textContent = "💎 " + customDiamond;
            }

            set("invoiceGame", summaryGame?.textContent || "-");
            set("invoiceUid", summaryUid?.textContent || "-");
            set("invoiceItem", summaryItem?.textContent || "-");
            set("invoicePay", summaryPay?.textContent || "-");
            set("invoicePrice", summaryPrice?.textContent || "Rp0");

            const invNum = "INV-" + Math.floor(Math.random() * 900000 + 100000);
            set("invoiceNumber", invNum);
            set("invoiceDate", new Date().toLocaleString("id-ID"));

            const history = JSON.parse(localStorage.getItem("trxHistory") || "[]");
            history.unshift({
                invoice: invNum,
                game: summaryGame.textContent,
                uid: summaryUid.textContent,
                item: summaryItem.textContent,
                pay: summaryPay.textContent,
                price: summaryPrice.textContent,
                date: new Date().toLocaleString("id-ID")
            });
            localStorage.setItem("trxHistory", JSON.stringify(history));

            processing.classList.add("active");
            const progressBar = document.getElementById("progressBar");
            const progressText = document.getElementById("progressText");
            let progress = 0;
            const timer = setInterval(() => {
                progress += 2;
                progressBar.style.width = progress + "%";
                progressText.innerHTML = progress + "%";
                if (progress >= 100) clearInterval(timer);
            }, 50);

            loadingTitle.innerHTML = "🔍 Mengecek UID...";
            loadingDesc.innerHTML = "Sedang memverifikasi akun.";

            setTimeout(() => popup.classList.remove("active"), 100);

            setTimeout(() => {
                loadingTitle.innerHTML = "💳 Menyiapkan Pembayaran...";
                loadingDesc.innerHTML = "Menghubungkan ke server.";
            }, 700);

            setTimeout(() => {
                loadingTitle.innerHTML = "📦 Membuat Invoice...";
                loadingDesc.innerHTML = "Hampir selesai.";
            }, 1400);

            setTimeout(() => {
                processing.classList.remove("active");
                if (invoice) invoice.classList.add("active");

                const status = document.getElementById("invoiceStatus");
                if (status) {
                    status.innerHTML = "⏳ Proses Pembayaran";
                    status.style.color = "#ffd43b";
                    setTimeout(() => {
                        status.innerHTML = "💲 Pembayaran Berhasil";
                        status.style.color = "#00d26a";
                    }, 3000);
                    setTimeout(() => {
                        status.innerHTML = "💎 Berhasil Dikirim";
                        status.style.color = "#00bfff";
                    }, 5000);
                }
            }, 2500);
        };
    }

    if (copyInvoice) {
        copyInvoice.onclick = () => {
            const text = `Invoice : ${document.getElementById("invoiceNumber").textContent}
Game : ${document.getElementById("invoiceGame").textContent}
UID : ${document.getElementById("invoiceUid").textContent}
Item : ${document.getElementById("invoiceItem").textContent}
Pembayaran : ${document.getElementById("invoicePay").textContent}
Total : ${document.getElementById("invoicePrice").textContent}`;
            navigator.clipboard.writeText(text);
            copyInvoice.innerHTML = "✅ Tersalin";
            setTimeout(() => {
                copyInvoice.innerHTML = "📋 Salin Invoice";
            }, 2000);
        };
    }

    if (downloadInvoice) {
        downloadInvoice.onclick = () => window.print();
    }

    if (closeInvoice) {
        closeInvoice.onclick = () => {
            invoice.classList.remove("active");
            processing.classList.remove("active");
            buyBtn.disabled = false;
            buyBtn.innerHTML = "BELI SEKARANG";
            const progressBar = document.getElementById("progressBar");
            const progressText = document.getElementById("progressText");
            if (progressBar) progressBar.style.width = "0%";
            if (progressText) progressText.textContent = "0%";
            if (loadingTitle) loadingTitle.innerHTML = "🔍 Mengecek UID...";
            if (loadingDesc) loadingDesc.innerHTML = "Sedang memverifikasi akun.";
        };
    }
});

/* ===========================
HISTORY
=========================== */
const historyList = document.getElementById("historyList");
if (historyList) {
    const data = JSON.parse(localStorage.getItem("trxHistory") || "[]");
    historyList.innerHTML = "";
    data.forEach(item => {
        historyList.innerHTML += `
            <div class="history-card">
                <b>${item.invoice}</b>
                🎮 ${item.game}<br>
                👤 ${item.uid}<br>
                💎 ${item.item}<br>
                💳 ${item.pay}<br>
                💰 ${item.price}<br>
                🕒 ${item.date}
            </div>
        `;
    });
}

/* ===========================
CALCULATOR
=========================== */
const calcBtn = document.getElementById("calcBtn");
if (calcBtn) {
    calcBtn.onclick = () => {
        const diamond = Number(document.getElementById("diamondInput").value) || 0;
        const hasil = diamond * 121;
        document.getElementById("calcResult").innerHTML = "Rp " + hasil.toLocaleString("id-ID");
    };
}

/* ===========================
SLIDER (SINGLE VIDEO)
=========================== */
const heroVideo = document.getElementById("heroVideo");
if (heroVideo) {
    heroVideo.muted = true;
    const tryPlay = () => {
        const p = heroVideo.play();
        if (p && p.catch) p.catch(() => {});
    };
    tryPlay();
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) tryPlay();
    });
    // unlock autoplay after first tap anywhere (mobile)
    const unlock = () => {
        tryPlay();
        document.removeEventListener("touchstart", unlock);
        document.removeEventListener("click", unlock);
    };
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("click", unlock, { once: true });
}

/* ===========================
FLOATING CHAT
=========================== */
const chatToggle = document.getElementById("chatToggle");
const chatMenu = document.getElementById("chatMenu");

function closeChatMenu() {
    if (chatMenu) chatMenu.classList.remove("show");
    if (chatToggle) chatToggle.classList.remove("active");
}

if (chatToggle && chatMenu) {
    chatToggle.onclick = (e) => {
        e.stopPropagation();
        const open = chatMenu.classList.toggle("show");
        chatToggle.classList.toggle("active", open);
    };

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".floating-chat")) {
            closeChatMenu();
        }
    });
}


/* ===========================
ACCOUNT CHECK
=========================== */
const cekBtn = document.getElementById("cekAccountBtn");
if (cekBtn) {
    cekBtn.onclick = async () => {
        const uid = document.getElementById("ffUid").value.trim();
        const region = document.getElementById("ffRegion").value;
        const result = document.getElementById("accountResult");

        if (!uid) {
            alert("Masukkan UID");
            return;
        }

        result.innerHTML = "<p style='text-align:center;color:#ffb100;padding:30px'>⏳ Loading...</p>";

        try {
            const res = await fetch(`https://ffkipas-api.vercel.app/api/account?uid=${uid}&region=${region}`);
            const json = await res.json();
            const acc = json.result.AccountInfo;
            const guild = json.result.GuildInfo;
            const social = json.result.socialinfo;
            const pet = json.result.petInfo;

            result.innerHTML = `
                <div class="ff-profile">
                    <div class="profile-header">
                        <div class="avatar-box">
                            <i class="fa-solid fa-user-secret"></i>
                        </div>
                        <div class="player-info">
                            <h2>${acc.AccountName}</h2>
                            <p>UID : ${uid}</p>
                            <div class="level-badge">⭐ Lv ${acc.AccountLevel}</div>
                        </div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-box">
                            ❤️
                            <h3>${acc.AccountLikes.toLocaleString()}</h3>
                            <span>Likes</span>
                        </div>
                        <div class="stat-box">
                            🏆
                            <h3>${acc.BrRankPoint}</h3>
                            <span>BR Rank</span>
                        </div>
                        <div class="stat-box">
                            🎯
                            <h3>${acc.CsRankPoint}</h3>
                            <span>CS Rank</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <p><i class="fa-solid fa-earth-asia"></i> Region <span>${acc.AccountRegion.toUpperCase()}</span></p>
                        <p><i class="fa-solid fa-users"></i> Guild <span>${guild.GuildName}</span></p>
                        <p><i class="fa-solid fa-crown"></i> Guild Lv <span>${guild.GuildLevel}</span></p>
                        <p><i class="fa-solid fa-paw"></i> Pet Level <span>${pet.level}</span></p>
                        <p><i class="fa-solid fa-fire"></i> Version <span>${acc.ReleaseVersion}</span></p>
                    </div>
                    <div class="bio-box">
                        <h4>📝 BIO</h4>
                        <p>${social.AccountSignature || "-"}</p>
                    </div>
                </div>
            `;
        } catch (e) {
            result.innerHTML = "<p style='text-align:center;color:#ff5555;padding:30px'>❌ UID tidak ditemukan.</p>";
        }
    };
}

/* ===========================
GROUP CHAT (Firebase Realtime)
=========================== */
/*
  SETUP FIREBASE (wajib, gratis):
  1. https://console.firebase.google.com → Create project
  2. Build → Realtime Database → Create (test mode dulu)
  3. Project settings → Your apps → Web → copy firebaseConfig
  4. Tempel di bawah mengganti nilai firebaseConfig
  5. Rules (Realtime Database → Rules) untuk production:
     {
       "rules": {
         "ffkipas_chat": {
           ".read": true,
           ".write": "auth != null || true",
           ".indexOn": ["ts"]
         }
       }
     }
     (test mode: ".read": true, ".write": true — ganti dalam 30 hari)
*/

const firebaseConfig = {
    apiKey: "AIzaSyDVPQp8Zp8T01-FdxGxm01qmmDwr-8YfOA",
    authDomain: "ffkipas-a1e66.firebaseapp.com",
    databaseURL: "https://ffkipas-a1e66-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ffkipas-a1e66",
    storageBucket: "ffkipas-a1e66.firebasestorage.app",
    messagingSenderId: "406272446222",
    appId: "1:406272446222:web:0b23bd18a894a6300f915f",
    measurementId: "G-FV428R4NMC"
};

const groupChatPanel = document.getElementById("groupChatPanel");
const groupChatOverlay = document.getElementById("groupChatOverlay");
const groupChatClose = document.getElementById("groupChatClose");
const openGroupChatBtn = document.getElementById("openGroupChat");
const gcMessages = document.getElementById("gcMessages");
const gcEmpty = document.getElementById("gcEmpty");
const gcNameBar = document.getElementById("gcNameBar");
const gcForm = document.getElementById("gcForm");
const gcNameInput = document.getElementById("gcNameInput");
const gcSaveName = document.getElementById("gcSaveName");
const gcInput = document.getElementById("gcInput");

let gcDb = null;
let gcReady = false;
let gcName = localStorage.getItem("ff_chat_name") || "";
let gcLastSend = 0;

function openGroupChat() {
    if (typeof closeChatMenu === "function") closeChatMenu();
    if (groupChatPanel) groupChatPanel.classList.add("show");
    if (groupChatOverlay) groupChatOverlay.classList.add("show");
    if (gcName) {
        if (gcNameBar) gcNameBar.style.display = "none";
        if (gcForm) gcForm.style.display = "flex";
        if (gcInput) setTimeout(() => gcInput.focus(), 100);
    } else {
        if (gcNameBar) gcNameBar.style.display = "flex";
        if (gcForm) gcForm.style.display = "none";
        if (gcNameInput) setTimeout(() => gcNameInput.focus(), 100);
    }
}

function closeGroupChat() {
    if (groupChatPanel) groupChatPanel.classList.remove("show");
    if (groupChatOverlay) groupChatOverlay.classList.remove("show");
}

if (openGroupChatBtn) {
    openGroupChatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openGroupChat();
    });
}
if (groupChatClose) groupChatClose.onclick = closeGroupChat;
if (groupChatOverlay) groupChatOverlay.onclick = closeGroupChat;

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatTime(ts) {
    try {
        const d = new Date(ts);
        return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
        return "";
    }
}

function renderMessages(list) {
    if (!gcMessages) return;
    if (!list || !list.length) {
        gcMessages.innerHTML = '<div class="gc-empty" id="gcEmpty">Belum ada pesan. Jadi yang pertama!</div>';
        return;
    }
    gcMessages.innerHTML = list.map(m => {
        const me = m.name === gcName ? " me" : "";
        return `<div class="gc-msg${me}">
            <div class="gc-msg-name">${escapeHtml(m.name || "Anon")}</div>
            <div class="gc-msg-text">${escapeHtml(m.text || "")}</div>
            <div class="gc-msg-time">${formatTime(m.ts)}</div>
        </div>`;
    }).join("");
    gcMessages.scrollTop = gcMessages.scrollHeight;
}

function initGroupChat() {
    if (typeof firebase === "undefined") {
        console.warn("Firebase SDK belum load");
        return;
    }
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.indexOf("PASTE_") === 0) {
        console.warn("Firebase config belum diisi");
        return;
    }
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        gcDb = firebase.database();
        gcReady = true;

        const ref = gcDb.ref("ffkipas_chat").orderByChild("ts").limitToLast(80);
        ref.on("value", (snap) => {
            const val = snap.val() || {};
            const list = Object.keys(val).map(k => val[k]).sort((a, b) => (a.ts || 0) - (b.ts || 0));
            renderMessages(list);
        });
    } catch (err) {
        console.error("Firebase init error", err);
        gcReady = false;
    }
}

if (gcSaveName) {
    gcSaveName.onclick = () => {
        const n = (gcNameInput?.value || "").trim().slice(0, 16);
        if (n.length < 2) {
            showToast("Nama", "Minimal 2 huruf ya", "warning");
            return;
        }
        gcName = n;
        localStorage.setItem("ff_chat_name", n);
        if (gcNameBar) gcNameBar.style.display = "none";
        if (gcForm) gcForm.style.display = "flex";
        if (gcInput) gcInput.focus();
        showToast("Masuk", "Halo, " + n + "!");
    };
}

if (gcForm) {
    gcForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!gcReady || !gcDb) {
            showToast(
                "Belum siap",
                "Admin belum pasang Firebase. Isi firebaseConfig di script.js",
                "warning"
            );
            return;
        }
        if (!gcName) {
            showToast("Nama", "Isi nama dulu", "warning");
            return;
        }
        const text = (gcInput?.value || "").trim().slice(0, 200);
        if (!text) return;

        const now = Date.now();
        if (now - gcLastSend < 1200) {
            showToast("Pelan-pelan", "Jangan spam ya", "warning");
            return;
        }
        gcLastSend = now;

        gcDb.ref("ffkipas_chat").push({
            name: gcName,
            text: text,
            ts: now
        }).then(() => {
            if (gcInput) gcInput.value = "";
        }).catch((err) => {
            console.error(err);
            showToast("Gagal", "Pesan tidak terkirim", "error");
        });
    });
}

// init after load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGroupChat);
} else {
    initGroupChat();
}

// ESC closes group chat too
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGroupChat();
});
