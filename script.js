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
        ["groupChatOverlay", "show"],
        ["vipPopup", "active"],
        ["vipListPopup", "active"],
        ["vipHowToPopup", "active"],
        ["vipChatPanel", "show"],
        ["vipChatOverlay", "show"]
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

/* ===========================
CLEAN URL (tanpa #)
Contoh: muhlishkipas.my.id/history
=========================== */
const SECTION_PATHS = {
    home: "/",
    download: "/download",
    topup: "/topup",
    accountCheck: "/cek-akun",
    history: "/history",
    faq: "/faq"
};
const PATH_TO_SECTION = {
    "": "home",
    "/": "home",
    "/home": "home",
    "/download": "download",
    "/topup": "topup",
    "/cek-akun": "accountCheck",
    "/accountcheck": "accountCheck",
    "/account": "accountCheck",
    "/history": "history",
    "/riwayat": "history",
    "/faq": "faq"
};

function sectionFromPath(pathname) {
    let p = String(pathname || "/").split("?")[0].split("#")[0];
    // hilangkan /index.html kalau ada
    p = p.replace(/\/index\.html$/i, "") || "/";
    p = p.replace(/\/+$/, "") || "/";
    if (p !== "/") p = p.toLowerCase();
    return PATH_TO_SECTION[p] || null;
}

function getHeaderOffset() {
    const header = document.querySelector(".header") || document.querySelector("header");
    return (header ? header.offsetHeight : 68) + 12;
}

function scrollToSectionEl(el, smooth) {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({
        top: Math.max(0, top),
        behavior: smooth ? "smooth" : "auto"
    });
}

function navigateToSection(sectionId, opts = {}) {
    const { push = true, smooth = true } = opts;
    const target = document.getElementById(sectionId);
    if (!target) return false;

    if (push) {
        const path = SECTION_PATHS[sectionId] || "/";
        try {
            history.pushState({ section: sectionId }, "", path);
        } catch (e) { /* ignore */ }
    }

    // scroll beberapa kali — layout/gambar bisa geser tinggi halaman
    const delays = smooth ? [80, 250] : [50, 150, 400, 800];
    delays.forEach((ms, i) => {
        setTimeout(() => scrollToSectionEl(target, smooth && i === 0), ms);
    });

    if (sectionId === "accountCheck") {
        setTimeout(() => {
            const uid = document.getElementById("ffUid");
            if (uid) uid.focus();
        }, 450);
    }
    return true;
}

function applyRouteFromLocation() {
    let sectionId = null;

    // 1) Query ?go=history (paling andal lewat 404.html GitHub Pages)
    try {
        const params = new URLSearchParams(location.search || "");
        const go = params.get("go");
        if (go && document.getElementById(go) && SECTION_PATHS[go]) {
            sectionId = go;
            try {
                history.replaceState({ section: sectionId }, "", SECTION_PATHS[sectionId]);
            } catch (e) {}
        }
    } catch (e) {}

    // 2) sessionStorage fallback
    if (!sectionId) {
        try {
            const saved = sessionStorage.getItem("spa_redirect");
            if (saved) {
                sessionStorage.removeItem("spa_redirect");
                const pathOnly = saved.split("?")[0].split("#")[0];
                sectionId = sectionFromPath(pathOnly);
                if (sectionId) {
                    try {
                        history.replaceState({ section: sectionId }, "", SECTION_PATHS[sectionId] || pathOnly);
                    } catch (e) {}
                }
            }
        } catch (e) {}
    }

    // 3) hash lama
    if (!sectionId && location.hash && location.hash.length > 1) {
        const hid = location.hash.slice(1);
        if (document.getElementById(hid) && SECTION_PATHS[hid]) {
            sectionId = hid;
            try {
                history.replaceState({ section: hid }, "", SECTION_PATHS[hid]);
            } catch (e) {}
        }
    }

    // 4) pathname (/history, /download, ...) — setelah pushState / refresh yang rewrite
    if (!sectionId) {
        sectionId = sectionFromPath(location.pathname);
    }

    if (sectionId && sectionId !== "home") {
        navigateToSection(sectionId, { push: false, smooth: false });
        return sectionId;
    }
    return null;
}

window.addEventListener("popstate", (e) => {
    const sid = (e.state && e.state.section) || sectionFromPath(location.pathname) || "home";
    if (sid === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }
    navigateToSection(sid, { push: false, smooth: true });
});

// Saat load: scroll ke section (ulang beberapa kali biar tidak loncat balik)
function bootRoute() {
    const run = () => applyRouteFromLocation();
    setTimeout(run, 40);
    setTimeout(run, 200);
    window.addEventListener("load", () => {
        setTimeout(run, 80);
        setTimeout(run, 350);
        setTimeout(run, 700);
    });
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootRoute);
} else {
    bootRoute();
}

document.querySelectorAll(".side-link").forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        let sectionId = null;
        if (href.startsWith("#") && href.length > 1) {
            sectionId = href.slice(1);
        } else if (href.startsWith("/")) {
            sectionId = sectionFromPath(href);
        }
        if (sectionId && document.getElementById(sectionId)) {
            e.preventDefault();
            closeSideMenu();
            navigateToSection(sectionId, { push: true, smooth: true });
        } else {
            closeSideMenu();
        }
    });
});

// Link internal lain (logo, tombol kalkulator, dll)
document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.classList.contains("side-link")) return;
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        if (href.length < 2) return;
        const sectionId = href.slice(1);
        if (SECTION_PATHS[sectionId] && document.getElementById(sectionId)) {
            e.preventDefault();
            navigateToSection(sectionId, { push: true, smooth: true });
        }
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
        if (targetId) navigateToSection(targetId, { push: true, smooth: true });
    });
});

/* ===========================
COUNTER — TOTAL DOWNLOAD (realtime Firebase)
=========================== */
const counter = document.getElementById("counter");
const DOWNLOAD_BASE = 0; // mulai dari 0
let downloadCountShown = 0;
let downloadCountAnimId = null;
let downloadStatsReady = false;

function animateDownloadCount(to) {
    if (!counter) return;
    const target = Math.max(0, Math.floor(Number(to) || 0));
    if (downloadCountAnimId) cancelAnimationFrame(downloadCountAnimId);

    const from = downloadCountShown;
    if (from === target) {
        counter.textContent = target.toLocaleString("id-ID");
        return;
    }
    // lompat besar → animasi cepat; naik 1–2 → langsung
    const diff = target - from;
    const duration = Math.min(1800, Math.max(400, Math.abs(diff) * 0.08));
    const start = performance.now();

    function step(now) {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(from + diff * eased);
        downloadCountShown = val;
        counter.textContent = val.toLocaleString("id-ID");
        if (t < 1) {
            downloadCountAnimId = requestAnimationFrame(step);
        } else {
            downloadCountShown = target;
            counter.textContent = target.toLocaleString("id-ID");
            downloadCountAnimId = null;
        }
    }
    downloadCountAnimId = requestAnimationFrame(step);
}

function initDownloadStats() {
    if (downloadStatsReady || !gcDb || !gcReady) return;
    downloadStatsReady = true;

    const ref = gcDb.ref("ffkipas_stats/totalDownloads");

    // Seed 0 hanya kalau path belum ada sama sekali
    ref.once("value").then((snap) => {
        if (snap.val() == null) {
            ref.set(0).catch(() => {});
        }
    }).catch(() => {});

    ref.on("value", (snap) => {
        const n = Number(snap.val());
        if (!Number.isFinite(n) || n < 0) return;
        animateDownloadCount(n);
    });
}

/** Naikkan total download (dipanggil saat user benar-benar download) */
function bumpDownloadCount(by = 1) {
    if (!gcDb || !gcReady) return;
    const ref = gcDb.ref("ffkipas_stats/totalDownloads");
    const add = Math.max(1, Math.floor(Number(by) || 1));
    ref.transaction((cur) => {
        const base = (typeof cur === "number" && cur >= 0) ? cur : DOWNLOAD_BASE;
        return base + add;
    }).catch(() => {});
}

// Fallback animasi lokal sebelum Firebase siap
if (counter) {
    counter.textContent = "0";
    animateDownloadCount(0);
}

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

document.querySelectorAll(".download-card, .game-card, .stat, .faq-item, .account-search").forEach(el => {
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
            // hitung 1 download realtime
            if (typeof bumpDownloadCount === "function") bumpDownloadCount(1);
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
    const gcOpen = document.getElementById("groupChatPanel")?.classList.contains("show");
    setChatLabelVisible(!gcOpen);
}

const chatFabLabel = document.getElementById("chatFabLabel");
function setChatLabelVisible(v) {
    if (chatFabLabel) {
        chatFabLabel.style.opacity = v ? "1" : "0";
        chatFabLabel.style.visibility = v ? "visible" : "hidden";
    }
}

if (chatToggle && chatMenu) {
    chatToggle.onclick = (e) => {
        e.stopPropagation();
        const open = chatMenu.classList.toggle("show");
        chatToggle.classList.toggle("active", open);
        setChatLabelVisible(!open);
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
         },
         "ffkipas_presence": {
           ".read": true,
           ".write": true
         },
         "ffkipas_stats": {
           ".read": true,
           ".write": true
         }
       }
     }
     (test mode: ".read": true, ".write": true — ganti dalam 30 hari)
     Presence: path "ffkipas_presence". Stats download: path "ffkipas_stats".
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
const gcReplyBar = document.getElementById("gcReplyBar");
const gcReplyName = document.getElementById("gcReplyName");
const gcReplyText = document.getElementById("gcReplyText");
const gcReplyCancel = document.getElementById("gcReplyCancel");

let gcDb = null;
let gcReady = false;
let gcName = localStorage.getItem("ff_chat_name") || "";
let gcAvatar = localStorage.getItem("ff_chat_avatar") || "";
let gcLastSend = 0;
let gcReplyTo = null; // { id, name, text, image? }
let gcMsgCache = {};  // id -> message (untuk scroll ke pesan asli)
let gcForceScrollBottom = true; // true saat buka chat / kirim pesan sendiri

// Session unik per browser — buat klaim nama
let gcSessionId = localStorage.getItem("ff_chat_sid") || "";
if (!gcSessionId) {
    gcSessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("ff_chat_sid", gcSessionId);
}
// Nama dipegang 48 jam sejak last activity (bisa diganti orang lain setelah itu)
const GC_NAME_HOLD_MS = 48 * 60 * 60 * 1000;

function normalizeChatName(n) {
    return String(n || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function nameKey(n) {
    // Firebase key tidak boleh . # $ [ ] /
    return normalizeChatName(n).replace(/[.#$\[\]\/]/g, "_");
}

/** Klaim nama unik di Firebase. Return { ok, reason? } */
async function claimChatName(newName) {
    if (!gcDb || !gcReady) return { ok: false, reason: "offline" };
    const trimmed = String(newName || "").trim().slice(0, 16);
    if (trimmed.length < 2) return { ok: false, reason: "invalid" };

    const key = nameKey(trimmed);
    if (!key) return { ok: false, reason: "invalid" };

    const ref = gcDb.ref("ffkipas_chat_names/" + key);
    const oldKey = gcName ? nameKey(gcName) : "";

    try {
        const tx = await ref.transaction((current) => {
            const now = Date.now();
            if (current && current.sid && current.sid !== gcSessionId) {
                // masih dipegang orang lain & belum expired
                if (current.ts && (now - current.ts) < GC_NAME_HOLD_MS) {
                    return; // abort
                }
            }
            return {
                name: trimmed,
                sid: gcSessionId,
                ts: now,
                avatar: gcAvatar || ""
            };
        });

        if (!tx.committed) {
            return { ok: false, reason: "taken" };
        }

        // lepaskan nama lama kalau ganti nama
        if (oldKey && oldKey !== key) {
            try {
                const oldRef = gcDb.ref("ffkipas_chat_names/" + oldKey);
                await oldRef.transaction((current) => {
                    if (current && current.sid === gcSessionId) return null;
                    return current;
                });
            } catch (e) { /* ignore */ }
        }

        return { ok: true };
    } catch (err) {
        console.error("claimChatName", err);
        return { ok: false, reason: "error" };
    }
}

/** Perpanjang hold nama (dipanggil saat kirim pesan / buka chat) */
function touchChatName() {
    if (!gcDb || !gcReady || !gcName) return;
    const key = nameKey(gcName);
    if (!key) return;
    const data = {
        name: gcName,
        sid: gcSessionId,
        ts: Date.now()
    };
    if (gcAvatar) data.avatar = gcAvatar;
    gcDb.ref("ffkipas_chat_names/" + key).update(data).catch(() => {});
}

function updateAvatarPreview() {
    const preview = document.getElementById("gcAvatarPreview");
    const btn = document.getElementById("gcAvatarBtn");
    const icon = document.getElementById("gcAvatarIcon");
    if (!preview || !btn) return;
    if (gcAvatar) {
        preview.src = gcAvatar;
        preview.style.display = "block";
        btn.classList.add("has-avatar");
        if (icon) icon.style.display = "none";
    } else {
        preview.src = "";
        preview.style.display = "none";
        btn.classList.remove("has-avatar");
        if (icon) icon.style.display = "";
    }
}

function avatarHtml(m) {
    const url = (m && m.avatar) ? String(m.avatar) : "";
    if (url && /^https?:\/\//i.test(url)) {
        return `<img class="gc-msg-avatar" src="${escapeHtml(url)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling&&(this.nextElementSibling.style.display='flex')"><div class="gc-msg-avatar placeholder" style="display:none">${escapeHtml((m.name || "?")[0].toUpperCase())}</div>`;
    }
    const letter = ((m && m.name) ? m.name : "?")[0].toUpperCase();
    return `<div class="gc-msg-avatar placeholder">${escapeHtml(letter)}</div>`;
}

/* ===========================
   ADMIN BADGE
   Tambah / ubah nama admin di array di bawah.
   Cocokkan dengan nama panggilan yang dipakai di chat.
=========================== */
// Huruf besar/kecil & spasi tidak masalah
const GC_ADMIN_NAMES = [
    "muhlis",
    "mas dinzz",
    "tiktok si yusuf",
    "jack ganteng",
    "mas rehan",
    "lucky tamvan"
];
const GC_ADMIN_BADGE_SRC = "assets/admin-badge.png";

function isAdminName(name) {
    if (!name) return false;
    const n = normalizeChatName(name); // trim + lower + spasi rapi
    if (!n) return false;
    if (GC_ADMIN_NAMES.some(a => normalizeChatName(a) === n)) return true;
    // cadangan tanpa spasi: "muhlis kipas" == "muhliskipas"
    const compact = n.replace(/\s+/g, "");
    return GC_ADMIN_NAMES.some(a => normalizeChatName(a).replace(/\s+/g, "") === compact);
}

function adminBadgeHtml(name) {
    if (!isAdminName(name)) return "";
    return `<span class="gc-admin-badge" title="Admin" style="display:inline-flex;align-items:center;gap:3px;max-height:14px;overflow:hidden;vertical-align:middle">
        <img src="${GC_ADMIN_BADGE_SRC}" alt="Admin" width="12" height="12" style="width:12px!important;height:12px!important;max-width:12px!important;max-height:12px!important;object-fit:contain;display:inline-block;border-radius:3px;flex-shrink:0">
        <span class="gc-admin-label">Admin</span>
    </span>`;
}

function scrollGcToBottom(smooth) {
    if (!gcMessages) return;
    requestAnimationFrame(() => {
        gcMessages.scrollTop = gcMessages.scrollHeight;
        // sekali lagi setelah layout/gambar settle
        setTimeout(() => {
            if (gcMessages) gcMessages.scrollTop = gcMessages.scrollHeight;
        }, smooth ? 80 : 30);
    });
}

function openGroupChat() {
    if (typeof closeChatMenu === "function") closeChatMenu();
    if (groupChatPanel) groupChatPanel.classList.add("show");
    if (groupChatOverlay) groupChatOverlay.classList.add("show");
    setChatLabelVisible(false);
    gcForceScrollBottom = true;
    scrollGcToBottom(true);
    if (gcName) {
        if (gcNameBar) gcNameBar.style.display = "none";
        if (gcForm) gcForm.style.display = "flex";
        if (gcInput) setTimeout(() => gcInput.focus(), 100);
        touchChatName();
    } else {
        if (gcNameBar) gcNameBar.style.display = "flex";
        if (gcForm) gcForm.style.display = "none";
        if (gcNameInput) setTimeout(() => gcNameInput.focus(), 100);
    }
}

function closeGroupChat() {
    if (groupChatPanel) groupChatPanel.classList.remove("show");
    if (groupChatOverlay) groupChatOverlay.classList.remove("show");
    setChatLabelVisible(true);
    clearReply();
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

function snippetText(m, maxLen = 60) {
    if (m.text && m.text.trim()) {
        const t = m.text.trim();
        return t.length > maxLen ? t.slice(0, maxLen) + "…" : t;
    }
    if (m.image) return "📷 Gambar";
    return "Pesan";
}

function setReply(msg) {
    if (!msg || !gcName) {
        showToast("Nama", "Isi nama dulu sebelum membalas", "warning");
        return;
    }
    gcReplyTo = {
        id: msg.id || "",
        name: msg.name || "Anon",
        text: snippetText(msg, 80),
        image: !!msg.image
    };
    if (gcReplyName) gcReplyName.textContent = gcReplyTo.name;
    if (gcReplyText) gcReplyText.textContent = gcReplyTo.text;
    if (gcReplyBar) gcReplyBar.style.display = "flex";
    if (gcInput) {
        gcInput.placeholder = "Balas " + gcReplyTo.name + "...";
        setTimeout(() => gcInput.focus(), 50);
    }
}

function clearReply() {
    gcReplyTo = null;
    if (gcReplyBar) gcReplyBar.style.display = "none";
    if (gcReplyName) gcReplyName.textContent = "";
    if (gcReplyText) gcReplyText.textContent = "";
    if (gcInput) gcInput.placeholder = "Tulis pesan...";
}

if (gcReplyCancel) {
    gcReplyCancel.onclick = (e) => {
        e.preventDefault();
        clearReply();
        if (gcInput) gcInput.focus();
    };
}

function renderMessages(list) {
    if (!gcMessages) return;
    if (!list || !list.length) {
        gcMessages.innerHTML = '<div class="gc-empty" id="gcEmpty">Belum ada pesan. Jadi yang pertama!</div>';
        gcMsgCache = {};
        return;
    }

    // keep scroll position if user is near bottom, atau force saat buka chat
    const wasNearBottom = gcForceScrollBottom ||
        (gcMessages.scrollHeight - gcMessages.scrollTop - gcMessages.clientHeight < 120);

    gcMsgCache = {};
    list.forEach(m => { if (m.id) gcMsgCache[m.id] = m; });

    gcMessages.innerHTML = list.map(m => {
        const me = m.name === gcName ? " me" : "";
        const displayName = m.name || "Anon";
        let replyHtml = "";
        if (m.replyTo && (m.replyTo.name || m.replyTo.text)) {
            const rRaw = m.replyTo.name || "Anon";
            const rName = escapeHtml(rRaw);
            const rText = escapeHtml(m.replyTo.text || (m.replyTo.image ? "📷 Gambar" : "Pesan"));
            const rId = m.replyTo.id ? ` data-reply-id="${escapeHtml(m.replyTo.id)}"` : "";
            const rBadge = adminBadgeHtml(rRaw);
            replyHtml = `<div class="gc-msg-reply"${rId} title="Lihat pesan asli">
                <div class="gc-msg-reply-body">
                    <span class="gc-msg-reply-name">${rName}${rBadge}</span>
                    <span class="gc-msg-reply-text">${rText}</span>
                </div>
            </div>`;
        }

        let body = "";
        if (m.image) {
            body += `<img class="gc-msg-img" src="${escapeHtml(m.image)}" alt="gambar" loading="lazy" onclick="window.open(this.src,'_blank')">`;
        }
        if (m.text) {
            body += `<div class="gc-msg-text">${escapeHtml(m.text)}</div>`;
        }
        if (!body) body = `<div class="gc-msg-text"></div>`;

        const msgId = m.id ? escapeHtml(m.id) : "";
        const badge = adminBadgeHtml(displayName);
        return `<div class="gc-msg-row${me}" data-id="${msgId}">
            ${avatarHtml(m)}
            <div class="gc-msg">
                <div class="gc-msg-name">${escapeHtml(displayName)}${badge}</div>
                ${replyHtml}
                ${body}
                <div class="gc-msg-time">${formatTime(m.ts)}</div>
                <div class="gc-msg-actions">
                    <button type="button" class="gc-reply-btn" data-reply-id="${msgId}" title="Balas">
                        <i class="fa-solid fa-reply"></i> Balas
                    </button>
                </div>
            </div>
        </div>`;
    }).join("");

    // bind reply buttons
    gcMessages.querySelectorAll(".gc-reply-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute("data-reply-id");
            const msg = id && gcMsgCache[id];
            if (msg) setReply(msg);
        });
    });

    // click quote to scroll to original (if still in list)
    gcMessages.querySelectorAll(".gc-msg-reply[data-reply-id]").forEach(el => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = el.getAttribute("data-reply-id");
            if (!id) return;
            const target = gcMessages.querySelector(`.gc-msg-row[data-id="${id}"]`);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
                target.style.transition = "box-shadow 0.3s";
                target.style.boxShadow = "0 0 0 2px rgba(255,152,0,0.6)";
                setTimeout(() => { target.style.boxShadow = ""; }, 1500);
            }
        });
    });

    if (wasNearBottom) {
        scrollGcToBottom(false);
        gcForceScrollBottom = false;
    }
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
            const list = Object.keys(val).map(k => ({ id: k, ...val[k] }))
                .sort((a, b) => (a.ts || 0) - (b.ts || 0));

            // Notif grup: pesan baru (bukan milik sendiri)
            if (typeof gcNotifReady !== "undefined" && gcNotifReady) {
                list.forEach(m => {
                    if (!m.id || (gcKnownMsgIds && gcKnownMsgIds.has(m.id))) return;
                    if (gcKnownMsgIds) gcKnownMsgIds.add(m.id);
                    const fromMe = gcName && m.name &&
                        typeof normalizeChatName === "function" &&
                        normalizeChatName(m.name) === normalizeChatName(gcName);
                    if (fromMe) return;
                    const preview = m.text
                        ? String(m.text).slice(0, 80)
                        : (m.image ? "📷 Gambar" : "Pesan baru");
                    if (typeof notifyUser === "function") {
                        notifyUser(
                            "Grup FFKIPAS · " + (m.name || "Anon"),
                            preview,
                            {
                                kind: "group",
                                tag: "ffkipas-group",
                                panelId: "groupChatPanel",
                                onClick: () => {
                                    if (typeof openGroupChat === "function") openGroupChat();
                                }
                            }
                        );
                    }
                });
            } else {
                list.forEach(m => { if (m.id && gcKnownMsgIds) gcKnownMsgIds.add(m.id); });
                setTimeout(() => { gcNotifReady = true; }, 900);
            }

            renderMessages(list);
        });

        // Live pengunjung online (presence)
        initSitePresence();
        // Total download realtime
        initDownloadStats();

        // Re-klaim nama yang tersimpan di browser ini
        if (gcName) {
            claimChatName(gcName).then((res) => {
                if (!res.ok && res.reason === "taken") {
                    // nama sudah diambil orang lain → reset
                    gcName = "";
                    localStorage.removeItem("ff_chat_name");
                    if (gcNameBar) gcNameBar.style.display = "flex";
                    if (gcForm) gcForm.style.display = "none";
                    showToast("Nama terpakai", "Nama kamu sudah dipakai orang lain. Pilih nama baru.", "warning");
                } else if (res.ok) {
                    touchChatName();
                }
            });
        }
    } catch (err) {
        console.error("Firebase init error", err);
        gcReady = false;
    }
}

/* ===========================
SITE PRESENCE — berapa orang online di web
=========================== */
let presenceReady = false;
let presenceHeartbeat = null;
const PRESENCE_STALE_MS = 90 * 1000; // anggap offline kalau >90 detik tanpa heartbeat

function updateOnlineUI(count) {
    const n = Math.max(0, Number(count) || 0);
    const el = document.getElementById("onlineCounter");
    if (el) {
        el.textContent = n.toLocaleString("id-ID");
    }
    const label = document.getElementById("gcOnlineLabel");
    if (label) {
        label.textContent = n > 0
            ? (n + " online")
            : "Online";
    }
}

function countFreshPresence(val) {
    if (!val || typeof val !== "object") return 0;
    const now = Date.now();
    let count = 0;
    Object.keys(val).forEach((k) => {
        const row = val[k];
        if (!row) return;
        const ts = typeof row.ts === "number" ? row.ts : 0;
        // ServerValue.TIMESTAMP kadang belum ter-resolve di cache lokal — tetap hitung
        if (!ts || (now - ts) < PRESENCE_STALE_MS) count++;
    });
    return count;
}

function initSitePresence() {
    if (presenceReady || !gcDb || !gcReady) return;
    presenceReady = true;

    const sid = gcSessionId || (
        Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    );
    const myRef = gcDb.ref("ffkipas_presence/" + sid);
    const connectedRef = gcDb.ref(".info/connected");

    const writePresence = () => {
        myRef.set({
            ts: Date.now(),
            sid: sid,
            path: (location.pathname || "/").slice(0, 40)
        }).catch(() => {});
    };

    connectedRef.on("value", (snap) => {
        if (snap.val() !== true) return;
        // Hapus otomatis saat tab/browser ditutup
        myRef.onDisconnect().remove().catch(() => {});
        writePresence();
    });

    // Heartbeat supaya entry tidak stale (kalau onDisconnect gagal)
    if (presenceHeartbeat) clearInterval(presenceHeartbeat);
    presenceHeartbeat = setInterval(() => {
        if (!gcReady || !gcDb) return;
        if (document.hidden) return;
        writePresence();
    }, 25000);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && gcReady) writePresence();
    });

    // Hitung semua yang masih fresh
    gcDb.ref("ffkipas_presence").on("value", (snap) => {
        const val = snap.val() || {};
        updateOnlineUI(countFreshPresence(val));
    });

    // Tampilkan minimal 1 (diri sendiri) sebelum data server datang
    updateOnlineUI(1);
}

if (gcSaveName) {
    gcSaveName.onclick = async () => {
        const n = (gcNameInput?.value || "").trim().slice(0, 16);
        if (n.length < 2) {
            showToast("Nama", "Minimal 2 huruf ya", "warning");
            return;
        }

        // sama dengan nama sekarang → langsung masuk
        if (gcName && normalizeChatName(gcName) === normalizeChatName(n)) {
            if (gcNameBar) gcNameBar.style.display = "none";
            if (gcForm) gcForm.style.display = "flex";
            if (gcInput) gcInput.focus();
            if (gcSaveName) gcSaveName.textContent = "Masuk";
            touchChatName();
            return;
        }

        if (!gcReady || !gcDb) {
            showToast("Belum siap", "Chat belum terhubung, coba lagi", "warning");
            return;
        }

        const prevText = gcSaveName.textContent;
        gcSaveName.disabled = true;
        gcSaveName.textContent = "...";

        const res = await claimChatName(n);

        gcSaveName.disabled = false;
        gcSaveName.textContent = prevText || "Masuk";

        if (!res.ok) {
            if (res.reason === "taken") {
                showToast("Nama terpakai", "\"" + n + "\" sudah dipakai orang lain", "warning");
            } else {
                showToast("Gagal", "Tidak bisa pakai nama ini, coba lagi", "error");
            }
            return;
        }

        gcName = n;
        localStorage.setItem("ff_chat_name", n);
        if (gcNameBar) gcNameBar.style.display = "none";
        if (gcForm) gcForm.style.display = "flex";
        if (gcInput) gcInput.focus();
        if (gcSaveName) gcSaveName.textContent = "Masuk";
        showToast("Nama disimpan", "Halo, " + n + "!");
        if (isAdminName(n)) {
            startVipAdminListener();
            const sub = document.getElementById("vipMenuSub");
            if (sub) sub.textContent = "Inbox order VIP";
            const lab = document.getElementById("vipMenuLabel");
            if (lab) lab.textContent = "Inbox VIP (Admin)";
        }
    };
}


const gcRenameBtn = document.getElementById("gcRenameBtn");
if (gcRenameBtn) {
    gcRenameBtn.addEventListener("click", () => {
        if (gcNameBar) gcNameBar.style.display = "flex";
        if (gcForm) gcForm.style.display = "none";
        if (gcNameInput) {
            gcNameInput.value = gcName || "";
            gcNameInput.focus();
            gcNameInput.select();
        }
        if (gcSaveName) gcSaveName.textContent = "Simpan";
        clearReply();
    });
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

        const payload = {
            name: gcName,
            text: text,
            ts: now
        };
        if (gcAvatar) payload.avatar = gcAvatar;
        if (gcReplyTo) {
            payload.replyTo = {
                id: gcReplyTo.id || "",
                name: gcReplyTo.name || "Anon",
                text: gcReplyTo.text || "",
                image: !!gcReplyTo.image
            };
        }

        gcForceScrollBottom = true;
        gcDb.ref("ffkipas_chat").push(payload).then(() => {
            if (gcInput) gcInput.value = "";
            clearReply();
            touchChatName();
            scrollGcToBottom(false);
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



/* Kirim gambar via ImgBB (gratis) */
// Ambil API key di https://api.imgbb.com — login → Add API key
const IMGBB_API_KEY = "aeeb26ddbc98f81adde8f60ae5680595";

const gcImageBtn = document.getElementById("gcImageBtn");
const gcImageInput = document.getElementById("gcImageInput");

if (gcImageBtn && gcImageInput) {
    gcImageBtn.addEventListener("click", () => {
        if (!gcName) {
            showToast("Nama", "Isi nama dulu", "warning");
            return;
        }
        if (!IMGBB_API_KEY || IMGBB_API_KEY.indexOf("PASTE_") === 0) {
            showToast("Belum siap", "Isi IMGBB_API_KEY di script.js dulu", "warning");
            return;
        }
        gcImageInput.click();
    });

    gcImageInput.addEventListener("change", async () => {
        const file = gcImageInput.files && gcImageInput.files[0];
        gcImageInput.value = "";
        if (!file) return;

        if (!gcReady || !gcDb) {
            showToast("Belum siap", "Chat belum terhubung", "warning");
            return;
        }
        if (!file.type.startsWith("image/")) {
            showToast("File", "Cuma boleh gambar", "warning");
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            showToast("Terlalu besar", "Maksimal 3MB", "warning");
            return;
        }

        const now = Date.now();
        if (now - gcLastSend < 1500) {
            showToast("Pelan-pelan", "Jangan spam ya", "warning");
            return;
        }
        gcLastSend = now;

        gcImageBtn.disabled = true;
        const oldIcon = gcImageBtn.innerHTML;
        gcImageBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("https://api.imgbb.com/1/upload?key=" + encodeURIComponent(IMGBB_API_KEY), {
                method: "POST",
                body: formData
            });
            const json = await res.json();
            if (!json.success || !json.data || !json.data.url) {
                throw new Error(json.error?.message || "Upload gagal");
            }

            const imgPayload = {
                name: gcName,
                text: "",
                image: json.data.url,
                ts: Date.now()
            };
            if (gcAvatar) imgPayload.avatar = gcAvatar;
            if (gcReplyTo) {
                imgPayload.replyTo = {
                    id: gcReplyTo.id || "",
                    name: gcReplyTo.name || "Anon",
                    text: gcReplyTo.text || "",
                    image: !!gcReplyTo.image
                };
            }
            gcForceScrollBottom = true;
            await gcDb.ref("ffkipas_chat").push(imgPayload);
            clearReply();
            touchChatName();
            scrollGcToBottom(false);
        } catch (err) {
            console.error(err);
            showToast("Gagal", "Upload gambar gagal", "error");
        }

        gcImageBtn.disabled = false;
        gcImageBtn.innerHTML = oldIcon;
    });
}

/* ===========================
   CUSTOM PROFILE (AVATAR)
=========================== */
const gcAvatarBtn = document.getElementById("gcAvatarBtn");
const gcAvatarInput = document.getElementById("gcAvatarInput");

updateAvatarPreview();

if (gcAvatarBtn && gcAvatarInput) {
    gcAvatarBtn.addEventListener("click", () => {
        if (!IMGBB_API_KEY || IMGBB_API_KEY.indexOf("PASTE_") === 0) {
            showToast("Belum siap", "Isi IMGBB_API_KEY di script.js dulu", "warning");
            return;
        }
        gcAvatarInput.click();
    });

    gcAvatarInput.addEventListener("change", async () => {
        const file = gcAvatarInput.files && gcAvatarInput.files[0];
        gcAvatarInput.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("File", "Cuma boleh gambar", "warning");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast("Terlalu besar", "Foto profil maksimal 2MB", "warning");
            return;
        }

        const oldHtml = gcAvatarBtn.innerHTML;
        gcAvatarBtn.disabled = true;
        gcAvatarBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch("https://api.imgbb.com/1/upload?key=" + encodeURIComponent(IMGBB_API_KEY), {
                method: "POST",
                body: formData
            });
            const json = await res.json();
            if (!json.success || !json.data || !json.data.url) {
                throw new Error(json.error?.message || "Upload gagal");
            }

            gcAvatar = (json.data.thumb && json.data.thumb.url) || json.data.url;
            localStorage.setItem("ff_chat_avatar", gcAvatar);
            updateAvatarPreview();
            touchChatName();
            showToast("Profil", "Foto profil disimpan");
        } catch (err) {
            console.error(err);
            showToast("Gagal", "Upload foto profil gagal", "error");
            gcAvatarBtn.innerHTML = oldHtml;
            updateAvatarPreview();
        }
        gcAvatarBtn.disabled = false;
    });
}

// ESC closes group chat too
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGroupChat();
});

/* ===========================
   FFKIPAS VIP — AUTO ORDER + PRIVATE CHAT
   Setiap pembeli = 1 room chat terpisah (Firebase)
=========================== */
const VIP_PRODUCT = "FFKIPAS VIP";
const VIP_LS_KEY = "ff_vip_orders";
/** Paket harga VIP */
const VIP_PACKAGES = [
    { id: "1d", days: 1, price: 20000, label: "1 Hari" },
    { id: "2d", days: 2, price: 40000, label: "2 Hari" },
    { id: "3d", days: 3, price: 60000, label: "3 Hari" },
    { id: "4d", days: 4, price: 80000, label: "4 Hari" },
    { id: "5d", days: 5, price: 100000, label: "5 Hari" },
    { id: "6d", days: 6, price: 120000, label: "6 Hari" },
    { id: "7d", days: 7, price: 140000, label: "7 Hari" },
    { id: "8d", days: 8, price: 160000, label: "8 Hari" },
];
const VIP_PRICE = VIP_PACKAGES[0].price;
const VIP_HOURS_TEXT = "09.00 – 23.00 WIB";
const VIP_REPLY_ETA = "5–15 menit";
let vipSelectedPack = VIP_PACKAGES[0];

let vipPending = null; // { orderId, name, contact, note, price, packId, packLabel, days, ... }
let vipActiveOrderId = null;
let vipActiveName = "";
let vipMsgUnsub = null;
let vipStatusUnsub = null;
let vipForceScroll = true;
let vipLastSend = 0;
let vipProofFile = null; // File bukti TF — wajib sebelum order masuk admin

function formatRp(n) {
    return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

/* ===========================
NOTIF SUARA (beda nada VIP vs GRUP) + DESKTOP
=========================== */
function getNotifAudioCtx() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!getNotifAudioCtx._ctx) getNotifAudioCtx._ctx = new Ctx();
    return getNotifAudioCtx._ctx;
}

function unlockNotifAudio() {
    try {
        const ctx = getNotifAudioCtx();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume().catch(() => {});
        if (!unlockNotifAudio._done) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            g.gain.value = 0.00001;
            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 0.01);
            unlockNotifAudio._done = true;
        }
    } catch (e) {}
}

["pointerdown", "touchstart", "keydown", "click"].forEach(ev => {
    document.addEventListener(ev, () => {
        unlockNotifAudio();
        ensureDesktopNotifPermission();
    }, { passive: true });
});

/** type: "vip" | "group" — nada berbeda */
function playNotifSound(type) {
    try {
        const ctx = getNotifAudioCtx();
        if (!ctx) return;
        const run = () => {
            const t0 = ctx.currentTime;
            // VIP = 2 nada tinggi cepat; GRUP = 3 nada lebih rendah
            const notes = type === "group"
                ? [
                    { at: 0, freq: 523, dur: 0.12 },
                    { at: 0.14, freq: 659, dur: 0.12 },
                    { at: 0.28, freq: 784, dur: 0.16 }
                  ]
                : [
                    { at: 0, freq: 880, dur: 0.14 },
                    { at: 0.16, freq: 1175, dur: 0.2 }
                  ];
            notes.forEach(({ at, freq, dur }) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = type === "group" ? "triangle" : "square";
                o.frequency.value = freq;
                const start = t0 + at;
                g.gain.setValueAtTime(0.0001, start);
                g.gain.exponentialRampToValueAtTime(0.2, start + 0.015);
                g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
                o.connect(g);
                g.connect(ctx.destination);
                o.start(start);
                o.stop(start + dur + 0.02);
            });
        };
        if (ctx.state === "suspended") ctx.resume().then(run).catch(() => {});
        else run();
    } catch (e) {
        console.warn("notif sound", e);
    }
}

function playVipNotifSound() { playNotifSound("vip"); }
function playGroupNotifSound() { playNotifSound("group"); }

let _notifPermAsked = false;
function ensureDesktopNotifPermission() {
    if (!("Notification" in window)) return Promise.resolve(false);
    if (Notification.permission === "granted") return Promise.resolve(true);
    if (Notification.permission === "denied") return Promise.resolve(false);
    if (_notifPermAsked) return Promise.resolve(false);
    _notifPermAsked = true;
    return Notification.requestPermission().then(p => p === "granted").catch(() => false);
}

function showDesktopNotif(title, body, opts = {}) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
        const n = new Notification(title || "FFKIPAS", {
            body: body || "",
            icon: opts.icon || "assets/logo.png",
            badge: "assets/favicon.png",
            tag: opts.tag || "ffkipas-notif",
            renotify: true,
            silent: false
        });
        n.onclick = () => {
            try { window.focus(); } catch (e) {}
            if (typeof opts.onClick === "function") opts.onClick();
            n.close();
        };
        setTimeout(() => { try { n.close(); } catch (e) {} }, 8000);
    } catch (e) {}
}

function notifyUser(title, body, opts = {}) {
    const kind = opts.kind || "vip";
    if (opts.sound !== false) {
        if (kind === "group") playGroupNotifSound();
        else playVipNotifSound();
    }
    const panel = opts.panelId ? document.getElementById(opts.panelId) : null;
    const panelOpen = !!(panel && panel.classList.contains("show"));
    if (document.hidden || !panelOpen || opts.forceDesktop) {
        showDesktopNotif(title, body, opts);
    }
}

let gcKnownMsgIds = new Set();
let gcNotifReady = false;

function statusToTrackStep(st) {
    const x = String(st || "").toLowerCase();
    if (x === "processing" || x === "process" || x === "diproses") return "process";
    if (x === "paid" || x === "done" || x === "completed" || x === "selesai") return "done";
    return "wait";
}

function updateVipStatusTrack(status) {
    const track = document.getElementById("vipStatusTrack");
    if (!track) return;
    const step = statusToTrackStep(status);
    const order = ["wait", "process", "done"];
    const idx = order.indexOf(step);
    track.querySelectorAll(".vst-step").forEach(el => {
        const s = el.getAttribute("data-step");
        const si = order.indexOf(s);
        el.classList.toggle("active", si === idx);
        el.classList.toggle("done", si < idx);
    });
    track.querySelectorAll(".vst-line").forEach((line, i) => {
        line.classList.toggle("filled", i < idx);
    });
}

async function copyTextToClipboard(text) {
    const t = String(text || "").trim();
    if (!t) return false;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(t);
            return true;
        }
    } catch (e) {}
    try {
        const ta = document.createElement("textarea");
        ta.value = t;
        ta.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch (e) {
        return false;
    }
}

function getVipPackById(id) {
    return VIP_PACKAGES.find(p => p.id === id) || VIP_PACKAGES[0];
}

function updateVipPackUI() {
    const pack = vipSelectedPack || VIP_PACKAGES[0];
    if (vipPriceLabel) vipPriceLabel.textContent = Number(pack.price).toLocaleString("id-ID");
    const sel = document.getElementById("vipPackSelectedLabel");
    if (sel) sel.textContent = "Paket: " + pack.label + " · akses VIP penuh";
    document.querySelectorAll(".vip-pack-card").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-id") === pack.id);
    });
}

function renderVipPackGrid() {
    const grid = document.getElementById("vipPackGrid");
    if (!grid) return;
    grid.innerHTML = VIP_PACKAGES.map(p => {
        const cls = "vip-pack-card" + (p.allAccess ? " all-access" : "") + (vipSelectedPack?.id === p.id ? " active" : "");
        return `<button type="button" class="${cls}" data-id="${p.id}">
            <strong>${p.label}</strong>
            <span>${formatRp(p.price)}${p.allAccess ? " · full VIP" : ""}</span>
        </button>`;
    }).join("");
    grid.querySelectorAll(".vip-pack-card").forEach(btn => {
        btn.addEventListener("click", () => {
            vipSelectedPack = getVipPackById(btn.getAttribute("data-id"));
            updateVipPackUI();
        });
    });
    updateVipPackUI();
}

function genVipOrderId() {
    const t = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "VIP-" + t.slice(-5) + r;
}

/** Nama yang mengandung "muhlis" (dan variasi) dilarang untuk order VIP */
function containsReservedVipName(name) {
    const n = String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ""); // buang spasi/simbol biar "muh lis" / "muhl1s" ikut ketahuan sebagian
    // pola inti
    if (n.includes("muhlis")) return true;
    if (n.includes("muhliss")) return true;
    if (n.includes("muhliz")) return true;
    // leetspeak sederhana: 1=i/l, 0=o
    const leet = n.replace(/1/g, "i").replace(/0/g, "o").replace(/3/g, "e");
    if (leet.includes("muhlis")) return true;
    return false;
}

function suggestRandomVipName() {
    const prefixes = ["Player", "Gamer", "User", "Guest", "Nova", "Pixel", "Shadow", "Blaze", "Frost", "Viper"];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return p + num;
}

function loadVipOrders() {
    try {
        return JSON.parse(localStorage.getItem(VIP_LS_KEY) || "[]");
    } catch (e) {
        return [];
    }
}

function saveVipOrderLocal(order) {
    const list = loadVipOrders().filter(o => o.orderId !== order.orderId);
    list.unshift(order);
    localStorage.setItem(VIP_LS_KEY, JSON.stringify(list.slice(0, 30)));
}

function getVipOrderLocal(orderId) {
    return loadVipOrders().find(o => o.orderId === orderId) || null;
}

const vipPopup = document.getElementById("vipPopup");
const vipStepForm = document.getElementById("vipStepForm");
const vipStepPay = document.getElementById("vipStepPay");
const openVipOrderBtn = document.getElementById("openVipOrder");
const closeVipPopup = document.getElementById("closeVipPopup");
const vipContinueBtn = document.getElementById("vipContinueBtn");
const vipPaidBtn = document.getElementById("vipPaidBtn");
const vipBackBtn = document.getElementById("vipBackBtn");
const vipPriceLabel = document.getElementById("vipPriceLabel");
const vipPayAmount = document.getElementById("vipPayAmount");
const vipOrderIdLabel = document.getElementById("vipOrderIdLabel");

const vipChatPanel = document.getElementById("vipChatPanel");
const vipChatOverlay = document.getElementById("vipChatOverlay");
const vipChatClose = document.getElementById("vipChatClose");
const vipMessages = document.getElementById("vipMessages");
const vipForm = document.getElementById("vipForm");
const vipInput = document.getElementById("vipInput");
const vipImageBtn = document.getElementById("vipImageBtn");
const vipImageInput = document.getElementById("vipImageInput");
const vipChatTitle = document.getElementById("vipChatTitle");
const vipChatSub = document.getElementById("vipChatSub");
const vipBannerText = document.getElementById("vipBannerText");

const vipListPopup = document.getElementById("vipListPopup");
const closeVipList = document.getElementById("closeVipList");
const vipOrdersList = document.getElementById("vipOrdersList");
const openVipChatsBtn = document.getElementById("openVipChatsBtn");
const vipNewOrderFromList = document.getElementById("vipNewOrderFromList");

renderVipPackGrid();
if (vipPayAmount) vipPayAmount.textContent = formatRp(vipSelectedPack?.price || VIP_PRICE);

const vipProofInput = document.getElementById("vipProofInput");
const vipProofBtn = document.getElementById("vipProofBtn");
const vipProofLabel = document.getElementById("vipProofLabel");
const vipProofPreview = document.getElementById("vipProofPreview");
const vipProofImg = document.getElementById("vipProofImg");
const vipProofRemove = document.getElementById("vipProofRemove");

function clearVipProof() {
    if (vipProofFile && vipPending && vipPending.proofPreviewUrl) {
        try { URL.revokeObjectURL(vipPending.proofPreviewUrl); } catch (e) {}
    }
    vipProofFile = null;
    if (vipProofInput) vipProofInput.value = "";
    if (vipProofPreview) vipProofPreview.style.display = "none";
    if (vipProofImg) vipProofImg.src = "";
    if (vipProofLabel) vipProofLabel.textContent = "Upload Bukti Transfer";
    if (vipProofBtn) vipProofBtn.style.display = "";
    if (vipPaidBtn) vipPaidBtn.disabled = true;
}

function setVipProofFile(file) {
    if (!file) {
        clearVipProof();
        return;
    }
    if (!file.type.startsWith("image/")) {
        showToast("File", "Bukti TF harus gambar", "warning");
        return;
    }
    if (file.size > 3 * 1024 * 1024) {
        showToast("Terlalu besar", "Maksimal 3MB", "warning");
        return;
    }
    clearVipProof();
    vipProofFile = file;
    const url = URL.createObjectURL(file);
    if (vipPending) vipPending.proofPreviewUrl = url;
    if (vipProofImg) vipProofImg.src = url;
    if (vipProofPreview) vipProofPreview.style.display = "inline-block";
    if (vipProofBtn) vipProofBtn.style.display = "none";
    if (vipProofLabel) vipProofLabel.textContent = file.name || "Bukti terpilih";
    if (vipPaidBtn) vipPaidBtn.disabled = false;
}

if (vipProofBtn && vipProofInput) {
    vipProofBtn.onclick = () => vipProofInput.click();
    vipProofInput.addEventListener("change", () => {
        const f = vipProofInput.files && vipProofInput.files[0];
        if (f) setVipProofFile(f);
    });
}
if (vipProofRemove) {
    vipProofRemove.onclick = () => {
        clearVipProof();
        if (vipProofBtn) vipProofBtn.style.display = "";
    };
}

async function uploadVipProofImage(file) {
    if (!IMGBB_API_KEY || IMGBB_API_KEY.indexOf("PASTE_") === 0) {
        throw new Error("IMGBB_API_KEY belum diisi");
    }
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://api.imgbb.com/1/upload?key=" + encodeURIComponent(IMGBB_API_KEY), {
        method: "POST",
        body: formData
    });
    const json = await res.json();
    if (!json.success || !json.data || !json.data.url) {
        throw new Error(json.error?.message || "Upload bukti gagal");
    }
    return json.data.url;
}

function showVipStep(step) {
    if (vipStepForm) vipStepForm.style.display = step === "form" ? "block" : "none";
    if (vipStepPay) vipStepPay.style.display = step === "pay" ? "block" : "none";
    if (step === "form") clearVipProof();
}

function openVipOrderPopup() {
    if (typeof closeChatMenu === "function") closeChatMenu();
    if (typeof closeGroupChat === "function") closeGroupChat();
    closeVipChat();
    vipPending = null;
    clearVipProof();
    vipSelectedPack = VIP_PACKAGES[0];
    updateVipPackUI();
    showVipStep("form");
    const nameEl = document.getElementById("vipNameInput");
    const contactEl = document.getElementById("vipContactInput");
    const noteEl = document.getElementById("vipNoteInput");
    if (nameEl) nameEl.value = "";
    if (contactEl) contactEl.value = "";
    if (noteEl) noteEl.value = "";
    if (vipPopup) vipPopup.classList.add("active");
    setTimeout(() => nameEl && nameEl.focus(), 80);
}

function closeVipOrderPopup() {
    if (vipPopup) vipPopup.classList.remove("active");
}

if (openVipOrderBtn) {
    openVipOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openVipOrderPopup();
    });
}
if (closeVipPopup) closeVipPopup.onclick = closeVipOrderPopup;
if (vipPopup) {
    vipPopup.onclick = (e) => {
        if (e.target === vipPopup) closeVipOrderPopup();
    };
}

if (vipContinueBtn) {
    vipContinueBtn.onclick = () => {
        const name = (document.getElementById("vipNameInput")?.value || "").trim().slice(0, 24);
        const contact = (document.getElementById("vipContactInput")?.value || "").trim().slice(0, 40);
        const note = (document.getElementById("vipNoteInput")?.value || "").trim().slice(0, 80);
        if (name.length < 2) {
            showToast("Nama", "Isi nama minimal 2 huruf", "warning");
            return;
        }
        if (containsReservedVipName(name)) {
            const saran = suggestRandomVipName();
            const nameEl = document.getElementById("vipNameInput");
            if (nameEl) {
                nameEl.value = saran;
                nameEl.focus();
                nameEl.select();
            }
            showToast(
                "Nama tidak boleh",
                'Nama mengandung "Muhlis" dilarang. Saran: ' + saran + " (boleh diganti)",
                "warning"
            );
            return;
        }
        if (contact.length < 5) {
            showToast("Kontak", "Isi No. WA / Telegram", "warning");
            return;
        }
        const pack = vipSelectedPack || VIP_PACKAGES[0];
        const orderId = genVipOrderId();
        vipPending = {
            orderId,
            name,
            contact,
            note,
            price: pack.price,
            packId: pack.id,
            packLabel: pack.label,
            days: pack.days,
            allAccess: !!pack.allAccess,
            product: VIP_PRODUCT + " · " + pack.label,
            createdAt: Date.now()
        };
        if (vipOrderIdLabel) vipOrderIdLabel.textContent = orderId;
        if (vipPayAmount) vipPayAmount.textContent = formatRp(pack.price);
        const payPack = document.getElementById("vipPayPackLabel");
        if (payPack) payPack.textContent = pack.label + (pack.allAccess ? " (full VIP)" : "");
        clearVipProof();
        showVipStep("pay");
        if (vipPaidBtn) {
            vipPaidBtn.disabled = true;
            vipPaidBtn.innerHTML = "Kirim Bukti & Buka Chat";
        }
    };
}

if (vipBackBtn) {
    vipBackBtn.onclick = () => showVipStep("form");
}

async function createVipOrderInFirebase(order) {
    if (!gcDb || !gcReady) {
        return { ok: false, error: new Error("Firebase offline") };
    }
    if (!order.proofImage) {
        return { ok: false, error: new Error("Bukti TF wajib") };
    }
    try {
        const packLabel = order.packLabel || (order.allAccess ? "All Akses" : ((order.days || "?") + " Hari"));
        const meta = {
            orderId: order.orderId,
            name: order.name,
            contact: order.contact,
            note: order.note || "",
            price: order.price,
            product: order.product || (VIP_PRODUCT + " · " + packLabel),
            packId: order.packId || "",
            packLabel: packLabel,
            days: order.days == null ? null : order.days,
            allAccess: !!order.allAccess,
            status: "waiting_verification",
            proofImage: order.proofImage,
            hasProof: true,
            visibleToAdmin: true,
            createdAt: order.createdAt || Date.now(),
            paidAt: Date.now(),
            proofAt: Date.now()
        };
        await gcDb.ref("ffkipas_vip_orders/" + order.orderId).set(meta);

        const now = Date.now();
        // system message + bukti TF (order baru masuk admin)
        const sys = {
            name: "SYSTEM",
            text: "Order " + order.orderId + " masuk.\nProduk: " + meta.product +
                "\nPaket: " + packLabel +
                "\nHarga: " + formatRp(order.price) +
                "\nNama: " + order.name +
                "\nKontak: " + order.contact +
                (order.note ? "\nCatatan: " + order.note : "") +
                "\n\nBukti transfer sudah diupload. Menunggu verifikasi admin.",
            ts: now,
            system: true
        };
        await gcDb.ref("ffkipas_vip_chat/" + order.orderId + "/messages").push(sys);
        await gcDb.ref("ffkipas_vip_chat/" + order.orderId + "/messages").push({
            name: order.name || "User",
            text: "Bukti transfer",
            image: order.proofImage,
            ts: now + 1,
            isProof: true
        });
        // Auto-reply jam operasional
        await gcDb.ref("ffkipas_vip_chat/" + order.orderId + "/messages").push({
            name: "SYSTEM",
            text: "🤖 Auto-reply Admin\n" +
                "Terima kasih sudah order VIP.\n" +
                "Admin biasanya online " + VIP_REPLY_ETA + " saat jam operasional.\n" +
                "Jam operasional: " + VIP_HOURS_TEXT + ".\n" +
                "Di luar jam, order tetap masuk & dibalas saat admin online.\n" +
                "Mohon tunggu — jangan spam ya.",
            ts: now + 2,
            system: true
        });
        return { ok: true };
    } catch (err) {
        console.error("createVipOrder", err);
        return { ok: false, error: err };
    }
}

if (vipPaidBtn) {
    vipPaidBtn.onclick = async () => {
        if (!vipPending) {
            showToast("Order", "Data order hilang, ulangi dari awal", "error");
            showVipStep("form");
            return;
        }
        if (!vipProofFile) {
            showToast("Bukti TF", "Upload bukti transfer dulu sebelum lanjut", "warning");
            return;
        }
        if (!gcReady || !gcDb) {
            showToast("Belum siap", "Koneksi Firebase belum siap, coba lagi", "warning");
            return;
        }

        vipPaidBtn.disabled = true;
        const oldLabel = vipPaidBtn.innerHTML;
        vipPaidBtn.innerHTML = "⏳ Upload bukti...";

        let proofUrl = "";
        try {
            proofUrl = await uploadVipProofImage(vipProofFile);
        } catch (err) {
            console.error(err);
            vipPaidBtn.disabled = false;
            vipPaidBtn.innerHTML = oldLabel || "Kirim Bukti & Buka Chat";
            showToast("Gagal", "Upload bukti TF gagal. Coba lagi.", "error");
            return;
        }

        vipPaidBtn.innerHTML = "⏳ Membuat order...";
        const order = {
            ...vipPending,
            status: "waiting_verification",
            proofImage: proofUrl,
            paidClaimAt: Date.now()
        };
        const res = await createVipOrderInFirebase(order);

        if (!res.ok) {
            vipPaidBtn.disabled = false;
            vipPaidBtn.innerHTML = oldLabel || "Kirim Bukti & Buka Chat";
            showToast("Gagal", "Tidak bisa membuat order. Cek koneksi / Firebase.", "error");
            return;
        }

        saveVipOrderLocal({
            orderId: order.orderId,
            name: order.name,
            contact: order.contact,
            note: order.note || "",
            price: order.price,
            product: order.product,
            packId: order.packId,
            packLabel: order.packLabel,
            days: order.days,
            allAccess: !!order.allAccess,
            status: "waiting_verification",
            proofImage: proofUrl,
            createdAt: order.createdAt,
            date: new Date().toLocaleString("id-ID")
        });

        try {
            const history = JSON.parse(localStorage.getItem("trxHistory") || "[]");
            history.unshift({
                invoice: order.orderId,
                game: order.product || VIP_PRODUCT,
                uid: order.contact,
                item: order.packLabel || VIP_PRODUCT,
                pay: "QRIS + Bukti TF",
                price: formatRp(order.price),
                date: new Date().toLocaleString("id-ID")
            });
            localStorage.setItem("trxHistory", JSON.stringify(history));
        } catch (e) {}

        vipPaidBtn.disabled = false;
        vipPaidBtn.innerHTML = "Kirim Bukti & Buka Chat";
        clearVipProof();
        closeVipOrderPopup();
        playVipNotifSound();
        showToast("Bukti terkirim", order.orderId + " · order masuk ke admin");
        openVipChat(order.orderId, order.name);
        vipPending = null;
    };
}

function scrollVipToBottom(smooth) {
    if (!vipMessages) return;
    requestAnimationFrame(() => {
        vipMessages.scrollTop = vipMessages.scrollHeight;
        setTimeout(() => {
            if (vipMessages) vipMessages.scrollTop = vipMessages.scrollHeight;
        }, smooth ? 80 : 30);
    });
}

function renderVipMessages(list) {
    if (!vipMessages) return;
    if (!list || !list.length) {
        vipMessages.innerHTML = '<div class="gc-empty">Belum ada pesan. Kirim bukti transfer di sini.</div>';
        return;
    }
    const wasNear = vipForceScroll ||
        (vipMessages.scrollHeight - vipMessages.scrollTop - vipMessages.clientHeight < 120);

    vipMessages.innerHTML = list.map(m => {
        if (m.system) {
            return `<div class="vip-sys-msg">${escapeHtml(m.text || "").replace(/\n/g, "<br>")}</div>`;
        }
        const me = m.name === vipActiveName ? " me" : "";
        const displayName = m.name || "Anon";
        const badge = (typeof adminBadgeHtml === "function") ? adminBadgeHtml(displayName) : "";
        let body = "";
        if (m.image) {
            body += `<img class="gc-msg-img" src="${escapeHtml(m.image)}" alt="gambar" loading="lazy" onclick="window.open(this.src,'_blank')">`;
        }
        if (m.text) {
            body += `<div class="gc-msg-text">${escapeHtml(m.text)}</div>`;
        }
        if (!body) body = `<div class="gc-msg-text"></div>`;
        return `<div class="gc-msg-row${me}">
            ${typeof avatarHtml === "function" ? avatarHtml(m) : `<div class="gc-msg-avatar placeholder">${escapeHtml((displayName[0] || "?").toUpperCase())}</div>`}
            <div class="gc-msg">
                <div class="gc-msg-name">${escapeHtml(displayName)}${badge}</div>
                ${body}
                <div class="gc-msg-time">${typeof formatTime === "function" ? formatTime(m.ts) : ""}</div>
            </div>
        </div>`;
    }).join("");

    if (wasNear) {
        scrollVipToBottom(false);
        vipForceScroll = false;
    }
}

function unsubVipMessages() {
    if (vipMsgUnsub && typeof vipMsgUnsub === "function") {
        try { vipMsgUnsub(); } catch (e) {}
    }
    vipMsgUnsub = null;
}

function listenVipMessages(orderId) {
    unsubVipMessages();
    if (!gcDb || !gcReady) {
        renderVipMessages([]);
        return;
    }
    const ref = gcDb.ref("ffkipas_vip_chat/" + orderId + "/messages").orderByChild("ts").limitToLast(100);
    const handler = (snap) => {
        const val = snap.val() || {};
        const list = Object.keys(val).map(k => ({ id: k, ...val[k] }))
            .sort((a, b) => (a.ts || 0) - (b.ts || 0));
        renderVipMessages(list);
    };
    ref.on("value", handler);
    vipMsgUnsub = () => ref.off("value", handler);
}


function openVipChat(orderId, name) {
    if (typeof closeChatMenu === "function") closeChatMenu();
    if (typeof closeGroupChat === "function") closeGroupChat();
    closeVipOrderPopup();
    if (vipListPopup) vipListPopup.classList.remove("active");

    vipActiveOrderId = orderId;
    const local = getVipOrderLocal(orderId);
    const adminMode = isCurrentUserAdmin();
    // Admin kirim pesan pakai nama admin; buyer pakai nama order
    if (adminMode) {
        vipActiveName = (typeof gcName !== "undefined" && gcName) || localStorage.getItem("ff_chat_name") || name || "Admin";
    } else {
        vipActiveName = name || local?.name || localStorage.getItem("ff_chat_name") || "User";
    }

    if (vipChatTitle) vipChatTitle.textContent = "VIP · " + orderId;
    if (vipChatSub) vipChatSub.textContent = adminMode ? ("Admin: " + vipActiveName) : vipActiveName;
    if (vipBannerText) {
        vipBannerText.textContent = "Order " + orderId + " · " + formatRp(local?.price || VIP_PRICE) + (adminMode ? " · balas pembeli di sini" : " · status real-time");
    }
    updateVipStatusTrack(local?.status || "waiting_verification");

    // Real-time status order
    if (typeof vipStatusUnsub === "function") {
        try { vipStatusUnsub(); } catch (e) {}
        vipStatusUnsub = null;
    }
    if (gcDb && gcReady) {
        const statusRef = gcDb.ref("ffkipas_vip_orders/" + orderId);
        let lastStatus = local?.status || null;
        let statusReady = false;
        const onStatus = (snap) => {
            const meta = snap.val();
            if (!meta) return;
            const st = statusLabel(meta.status).text;
            if (vipBannerText) {
                if (adminMode) {
                    vipBannerText.textContent = orderId + " · " + (meta.name || "-") + " · " + (meta.contact || "-") + " · " + formatRp(meta.price || VIP_PRICE) + " · " + st;
                } else {
                    vipBannerText.textContent = orderId + " · " + (meta.packLabel || meta.product || "VIP") + " · " + formatRp(meta.price || VIP_PRICE) + " · " + st;
                }
            }
            updateVipStatusTrack(meta.status);
            syncVipAdminActionButtons(meta.status);
            if (statusReady && lastStatus && meta.status && meta.status !== lastStatus) {
                playVipNotifSound();
                if (!adminMode) showToast("Status order", st);
            }
            lastStatus = meta.status || lastStatus;
            statusReady = true;
            try {
                const list = loadVipOrders();
                const i = list.findIndex(o => o.orderId === orderId);
                if (i >= 0 && list[i].status !== meta.status) {
                    list[i].status = meta.status;
                    localStorage.setItem(VIP_LS_KEY, JSON.stringify(list));
                }
            } catch (e) {}
        };
        statusRef.on("value", onStatus);
        vipStatusUnsub = () => statusRef.off("value", onStatus);
    }

    vipForceScroll = true;
    if (vipChatPanel) vipChatPanel.classList.add("show");
    if (vipChatOverlay) vipChatOverlay.classList.add("show");
    if (typeof setChatLabelVisible === "function") setChatLabelVisible(false);

    syncVipAdminActionButtons(local?.status || "waiting_verification");
    listenVipMessages(orderId);
    setTimeout(() => vipInput && vipInput.focus(), 120);
}

function closeVipChat() {
    if (vipChatPanel) vipChatPanel.classList.remove("show");
    if (vipChatOverlay) vipChatOverlay.classList.remove("show");
    const bar = document.getElementById("vipAdminActions");
    if (bar) bar.style.display = "none";
    unsubVipMessages();
    if (typeof vipStatusUnsub === "function") {
        try { vipStatusUnsub(); } catch (e) {}
        vipStatusUnsub = null;
    }
    vipActiveOrderId = null;
    if (typeof setChatLabelVisible === "function") {
        const gcOpen = document.getElementById("groupChatPanel")?.classList.contains("show");
        setChatLabelVisible(!gcOpen);
    }
}

if (vipChatClose) vipChatClose.onclick = closeVipChat;
if (vipChatOverlay) vipChatOverlay.onclick = closeVipChat;

if (vipForm) {
    vipForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!vipActiveOrderId) return;
        if (!gcReady || !gcDb) {
            showToast("Belum siap", "Firebase belum terhubung", "warning");
            return;
        }
        const text = (vipInput?.value || "").trim().slice(0, 300);
        if (!text) return;
        const now = Date.now();
        if (now - vipLastSend < 1000) {
            showToast("Pelan-pelan", "Jangan spam ya", "warning");
            return;
        }
        vipLastSend = now;
        const payload = {
            name: vipActiveName || "User",
            text,
            ts: now
        };
        const av = localStorage.getItem("ff_chat_avatar");
        if (av) payload.avatar = av;

        vipForceScroll = true;
        gcDb.ref("ffkipas_vip_chat/" + vipActiveOrderId + "/messages").push(payload).then(() => {
            if (vipInput) vipInput.value = "";
            // update order activity
            gcDb.ref("ffkipas_vip_orders/" + vipActiveOrderId).update({ lastMsgAt: now }).catch(() => {});
            scrollVipToBottom(false);
        }).catch((err) => {
            console.error(err);
            showToast("Gagal", "Pesan tidak terkirim", "error");
        });
    });
}

if (vipImageBtn && vipImageInput) {
    vipImageBtn.addEventListener("click", () => {
        if (!vipActiveOrderId) return;
        if (!IMGBB_API_KEY || IMGBB_API_KEY.indexOf("PASTE_") === 0) {
            showToast("Belum siap", "IMGBB_API_KEY belum diisi", "warning");
            return;
        }
        vipImageInput.click();
    });
    vipImageInput.addEventListener("change", async () => {
        const file = vipImageInput.files && vipImageInput.files[0];
        vipImageInput.value = "";
        if (!file || !vipActiveOrderId) return;
        if (!gcReady || !gcDb) {
            showToast("Belum siap", "Chat belum terhubung", "warning");
            return;
        }
        if (!file.type.startsWith("image/")) {
            showToast("File", "Cuma boleh gambar", "warning");
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            showToast("Terlalu besar", "Maksimal 3MB", "warning");
            return;
        }
        const now = Date.now();
        if (now - vipLastSend < 1500) {
            showToast("Pelan-pelan", "Jangan spam ya", "warning");
            return;
        }
        vipLastSend = now;
        vipImageBtn.disabled = true;
        const oldIcon = vipImageBtn.innerHTML;
        vipImageBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch("https://api.imgbb.com/1/upload?key=" + encodeURIComponent(IMGBB_API_KEY), {
                method: "POST",
                body: formData
            });
            const json = await res.json();
            if (!json.success || !json.data || !json.data.url) {
                throw new Error(json.error?.message || "Upload gagal");
            }
            const payload = {
                name: vipActiveName || "User",
                text: "",
                image: json.data.url,
                ts: Date.now()
            };
            const av = localStorage.getItem("ff_chat_avatar");
            if (av) payload.avatar = av;
            vipForceScroll = true;
            await gcDb.ref("ffkipas_vip_chat/" + vipActiveOrderId + "/messages").push(payload);
            gcDb.ref("ffkipas_vip_orders/" + vipActiveOrderId).update({ lastMsgAt: Date.now() }).catch(() => {});
            scrollVipToBottom(false);
        } catch (err) {
            console.error(err);
            showToast("Gagal", "Upload gambar gagal", "error");
        }
        vipImageBtn.disabled = false;
        vipImageBtn.innerHTML = oldIcon;
    });
}

function isCurrentUserAdmin() {
    const n = (typeof gcName !== "undefined" && gcName) || localStorage.getItem("ff_chat_name") || "";
    return typeof isAdminName === "function" && isAdminName(n);
}

let vipAdminOrdersCache = [];
let vipAdminListenReady = false;
let vipAdminKnownIds = new Set();
let vipAdminUnsub = null;

function formatVipDate(ts) {
    try {
        return new Date(ts).toLocaleString("id-ID");
    } catch (e) {
        return "";
    }
}

function statusLabel(st) {
    const x = String(st || "").toLowerCase();
    if (x === "processing" || x === "process" || x === "diproses") {
        return { text: "Diproses", cls: "process" };
    }
    if (x === "paid" || x === "done" || x === "completed" || x === "selesai") {
        return { text: "Selesai", cls: "done" };
    }
    if (x === "waiting_verification" || x === "proof_submitted") {
        return { text: "Menunggu verifikasi", cls: "wait" };
    }
    if (x === "waiting_payment") {
        return { text: "Menunggu bukti TF", cls: "wait" };
    }
    return { text: "Menunggu verifikasi", cls: "wait" };
}

async function setVipOrderStatus(status, labelText) {
    if (!vipActiveOrderId || !gcDb || !gcReady) {
        showToast("Gagal", "Chat/order belum siap", "error");
        return false;
    }
    if (!isCurrentUserAdmin()) {
        showToast("Admin only", "Hanya admin yang bisa ubah status", "warning");
        return false;
    }
    const now = Date.now();
    const adminName = (typeof gcName !== "undefined" && gcName) || localStorage.getItem("ff_chat_name") || "Admin";
    try {
        await gcDb.ref("ffkipas_vip_orders/" + vipActiveOrderId).update({
            status: status,
            statusAt: now,
            statusBy: adminName
        });
        // system message di chat privat
        await gcDb.ref("ffkipas_vip_chat/" + vipActiveOrderId + "/messages").push({
            name: "SYSTEM",
            text: "📌 Status order: " + labelText + "\nOleh: " + adminName,
            ts: now,
            system: true
        });
        // update local history if any
        try {
            const list = loadVipOrders();
            const i = list.findIndex(o => o.orderId === vipActiveOrderId);
            if (i >= 0) {
                list[i].status = status;
                localStorage.setItem(VIP_LS_KEY, JSON.stringify(list));
            }
        } catch (e) {}
        if (vipBannerText) {
            const base = vipBannerText.textContent.split(" · ").slice(0, 3).join(" · ");
            vipBannerText.textContent = (base || vipActiveOrderId) + " · " + labelText;
        }
        updateVipStatusTrack(status);
        // highlight buttons
        const bp = document.getElementById("vipBtnProcess");
        const bd = document.getElementById("vipBtnDone");
        if (bp) bp.classList.toggle("active", status === "processing");
        if (bd) bd.classList.toggle("active", status === "completed");
        playVipNotifSound();
        showToast("Status", labelText);
        return true;
    } catch (err) {
        console.error(err);
        showToast("Gagal", "Tidak bisa update status", "error");
        return false;
    }
}

function syncVipAdminActionButtons(status) {
    const bar = document.getElementById("vipAdminActions");
    const bp = document.getElementById("vipBtnProcess");
    const bd = document.getElementById("vipBtnDone");
    const admin = isCurrentUserAdmin();
    if (bar) bar.style.display = admin ? "flex" : "none";
    if (!admin) return;
    const x = String(status || "").toLowerCase();
    if (bp) bp.classList.toggle("active", x === "processing" || x === "process" || x === "diproses");
    if (bd) bd.classList.toggle("active", x === "completed" || x === "done" || x === "selesai" || x === "paid");
}

async function fetchAllVipOrdersFromFirebase() {
    if (!gcDb || !gcReady) return [];
    try {
        const snap = await gcDb.ref("ffkipas_vip_orders").once("value");
        const val = snap.val() || {};
        // Hanya order yang sudah upload bukti TF yang tampil di admin
        const list = Object.keys(val)
            .map(k => ({ orderId: k, ...val[k] }))
            .filter(o => !!(o.proofImage || o.hasProof));
        list.sort((a, b) => (b.proofAt || b.createdAt || b.paidAt || 0) - (a.proofAt || a.createdAt || a.paidAt || 0));
        return list.slice(0, 80);
    } catch (e) {
        console.error("fetchAllVipOrders", e);
        return [];
    }
}

function startVipAdminListener() {
    if (!gcDb || !gcReady || vipAdminListenReady) return;
    if (!isCurrentUserAdmin()) return;
    vipAdminListenReady = true;
    try {
        const ref = gcDb.ref("ffkipas_vip_orders");
        const handler = (snap) => {
            const order = snap.val();
            if (!order) return;
            // Belum ada bukti TF → jangan masuk inbox admin
            if (!(order.proofImage || order.hasProof)) return;
            const id = snap.key || order.orderId;
            if (!id) return;
            if (vipAdminKnownIds.has(id)) return;
            if (startVipAdminListener._seeding) {
                vipAdminKnownIds.add(id);
                return;
            }
            vipAdminKnownIds.add(id);
            notifyUser(
                "Order VIP baru",
                id + " · " + (order.name || "User") + " · " + formatRp(order.price || VIP_PRICE),
                {
                    kind: "vip",
                    tag: "ffkipas-vip-order",
                    forceDesktop: true,
                    panelId: "vipListPopup",
                    onClick: () => {
                        if (typeof openVipList === "function") openVipList();
                    }
                }
            );
            showToast("Order VIP + bukti TF", id + " · " + (order.name || "User"), "warning");
            const sub = document.getElementById("vipMenuSub");
            if (sub) {
                sub.textContent = "Ada order baru!";
                sub.classList.add("has-new");
            }
            if (vipListPopup && vipListPopup.classList.contains("active")) {
                renderVipOrdersList();
            }
        };
        startVipAdminListener._seeding = true;
        ref.once("value").then((snap) => {
            const val = snap.val() || {};
            Object.keys(val).forEach(k => vipAdminKnownIds.add(k));
            startVipAdminListener._seeding = false;
            ref.on("child_added", handler);
            vipAdminUnsub = () => ref.off("child_added", handler);
        }).catch(() => {
            startVipAdminListener._seeding = false;
            ref.on("child_added", handler);
            vipAdminUnsub = () => ref.off("child_added", handler);
        });
    } catch (e) {
        console.error(e);
        vipAdminListenReady = false;
    }
}

async function renderVipOrdersList() {
    if (!vipOrdersList) return;
    const title = document.getElementById("vipListTitle");
    const desc = document.getElementById("vipListDesc");
    const joinBox = document.getElementById("vipJoinById");
    const newBtn = document.getElementById("vipNewOrderFromList");
    const admin = isCurrentUserAdmin();

    if (admin) {
        if (title) title.innerHTML = '<i class="fa-solid fa-crown"></i> Inbox Order VIP (Admin)';
        if (desc) desc.textContent = "Semua order masuk otomatis. Klik untuk balas di chat privat.";
        if (joinBox) joinBox.style.display = "flex";
        if (newBtn) newBtn.style.display = "none";
        vipOrdersList.innerHTML = '<div class="vip-orders-empty">Memuat order dari server...</div>';
        const list = await fetchAllVipOrdersFromFirebase();
        vipAdminOrdersCache = list;
        if (!list.length) {
            vipOrdersList.innerHTML = '<div class="vip-orders-empty">Belum ada order VIP masuk.</div>';
            return;
        }
        vipOrdersList.innerHTML = list.map(o => {
            const id = o.orderId || "";
            const st = statusLabel(o.status);
            const when = o.date || formatVipDate(o.createdAt || o.paidAt);
            return `<div class="vip-order-item" data-id="${escapeHtml(id)}" data-name="${escapeHtml(o.name || "")}">
                <div class="voi-icon"><i class="fa-solid fa-crown"></i></div>
                <div>
                    <strong>${escapeHtml(id)}</strong>
                    <span class="voi-meta">${escapeHtml(o.name || "-")} · ${escapeHtml(o.contact || "-")} · ${escapeHtml(o.packLabel || o.product || "-")} · ${formatRp(o.price || VIP_PRICE)}</span>
                    <span class="voi-meta">${escapeHtml(when)}</span>
                    <span class="voi-status ${st.cls}">${st.text}</span>
                </div>
            </div>`;
        }).join("");
    } else {
        if (title) title.innerHTML = '<i class="fa-solid fa-crown"></i> Chat VIP Saya';
        if (desc) desc.textContent = "Setiap order punya ruang chat sendiri.";
        if (joinBox) joinBox.style.display = "flex";
        if (newBtn) newBtn.style.display = "block";
        const list = loadVipOrders();
        if (!list.length) {
            vipOrdersList.innerHTML = '<div class="vip-orders-empty">Belum ada order VIP.<br>Order dulu biar chat privat muncul di sini.</div>';
            return;
        }
        vipOrdersList.innerHTML = list.map(o => {
            const st = statusLabel(o.status);
            const step = statusToTrackStep(o.status);
            const cWait = step === "wait" ? "active" : "done";
            const cProc = step === "process" ? "active" : (step === "done" ? "done" : "");
            const cDone = step === "done" ? "active" : "";
            return `<div class="vip-order-item" data-id="${escapeHtml(o.orderId)}" data-name="${escapeHtml(o.name || "")}">
                <div class="voi-icon"><i class="fa-solid fa-crown"></i></div>
                <div>
                    <strong>${escapeHtml(o.orderId)}</strong>
                    <span class="voi-meta">${escapeHtml(o.packLabel || o.product || "-")} · ${formatRp(o.price || VIP_PRICE)} · ${escapeHtml(o.date || "")}</span>
                    <span class="voi-status ${st.cls}">${st.text}</span>
                    <div class="vip-status-mini">
                        <span class="vsm ${cWait}">Verifikasi</span>
                        <span class="vsm-line"></span>
                        <span class="vsm ${cProc}">Diproses</span>
                        <span class="vsm-line"></span>
                        <span class="vsm ${cDone}">Selesai</span>
                    </div>
                </div>
            </div>`;
        }).join("");
    }

    vipOrdersList.querySelectorAll(".vip-order-item").forEach(el => {
        el.addEventListener("click", () => {
            const id = el.getAttribute("data-id");
            // Admin balas pakai nama admin; buyer pakai nama order
            const adminNow = isCurrentUserAdmin();
            const nm = adminNow
                ? ((typeof gcName !== "undefined" && gcName) || localStorage.getItem("ff_chat_name") || "Admin")
                : (el.getAttribute("data-name") || "");
            if (vipListPopup) vipListPopup.classList.remove("active");
            const sub = document.getElementById("vipMenuSub");
            if (sub) {
                sub.textContent = adminNow ? "Inbox order VIP" : "Order & support privat";
                sub.classList.remove("has-new");
            }
            openVipChat(id, nm);
        });
    });
}

async function openVipList() {
    if (typeof closeChatMenu === "function") closeChatMenu();
    if (typeof closeGroupChat === "function") closeGroupChat();
    closeVipChat();
    if (isCurrentUserAdmin()) startVipAdminListener();
    if (vipListPopup) vipListPopup.classList.add("active");
    await renderVipOrdersList();
}

if (openVipChatsBtn) {
    openVipChatsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openVipList();
    });
}
if (closeVipList) closeVipList.onclick = () => vipListPopup && vipListPopup.classList.remove("active");
if (vipListPopup) {
    vipListPopup.onclick = (e) => {
        if (e.target === vipListPopup) vipListPopup.classList.remove("active");
    };
}
if (vipNewOrderFromList) {
    vipNewOrderFromList.onclick = () => {
        if (vipListPopup) vipListPopup.classList.remove("active");
        openVipOrderPopup();
    };
}

/* Cara Order VIP */
const vipHowToPopup = document.getElementById("vipHowToPopup");
const openVipHowToBtn = document.getElementById("openVipHowTo");
const closeVipHowToBtn = document.getElementById("closeVipHowTo");
const vipHowToBuyBtn = document.getElementById("vipHowToBuy");
function openVipHowTo() {
    if (typeof closeChatMenu === "function") closeChatMenu();
    if (vipHowToPopup) vipHowToPopup.classList.add("active");
}
function closeVipHowTo() {
    if (vipHowToPopup) vipHowToPopup.classList.remove("active");
}
if (openVipHowToBtn) {
    openVipHowToBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openVipHowTo();
    });
}
if (closeVipHowToBtn) closeVipHowToBtn.onclick = closeVipHowTo;
if (vipHowToPopup) {
    vipHowToPopup.onclick = (e) => {
        if (e.target === vipHowToPopup) closeVipHowTo();
    };
}
if (vipHowToBuyBtn) {
    vipHowToBuyBtn.onclick = () => {
        closeVipHowTo();
        openVipOrderPopup();
    };
}

/* Salin Order ID */
const vipCopyOrderIdBtn = document.getElementById("vipCopyOrderId");
if (vipCopyOrderIdBtn) {
    vipCopyOrderIdBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = vipActiveOrderId || "";
        if (!id) {
            showToast("Order ID", "Belum ada order aktif", "warning");
            return;
        }
        const ok = await copyTextToClipboard(id);
        if (ok) {
            const old = vipCopyOrderIdBtn.innerHTML;
            vipCopyOrderIdBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
            showToast("Tersalin", id);
            setTimeout(() => { vipCopyOrderIdBtn.innerHTML = old; }, 1500);
        } else {
            showToast("Gagal", "Tidak bisa salin", "error");
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVipHowTo();
});

// ESC juga nutup VIP UI
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeVipOrderPopup();
        closeVipChat();
        if (vipListPopup) vipListPopup.classList.remove("active");
    }
});

// unlockPage juga bersihkan VIP overlays
const _unlockPageOrig = typeof unlockPage === "function" ? unlockPage : null;
if (_unlockPageOrig) {
    // patch via ids already covered partially — add VIP classes cleanup
}

const vipJoinIdInput = document.getElementById("vipJoinIdInput");
const vipJoinIdBtn = document.getElementById("vipJoinIdBtn");
if (vipJoinIdBtn) {
    vipJoinIdBtn.onclick = async () => {
        const id = (vipJoinIdInput?.value || "").trim().toUpperCase();
        if (!id || id.length < 6) {
            showToast("Order ID", "Masukkan kode order yang valid", "warning");
            return;
        }
        let name = localStorage.getItem("ff_chat_name") || "Admin";
        // coba ambil meta dari Firebase
        if (gcDb && gcReady) {
            try {
                const snap = await gcDb.ref("ffkipas_vip_orders/" + id).once("value");
                const meta = snap.val();
                if (meta && meta.name) {
                    // admin reply pakai nama chat sendiri; buyer name only for display
                    if (vipChatSub) vipChatSub.textContent = meta.name + " · " + (meta.contact || "");
                } else if (!meta) {
                    showToast("Tidak ditemukan", "Order " + id + " tidak ada di server", "warning");
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }
        if (vipListPopup) vipListPopup.classList.remove("active");
        openVipChat(id, name);
    };
}


// Admin VIP inbox auto-listen saat nama admin sudah tersimpan



const vipBtnProcess = document.getElementById("vipBtnProcess");
const vipBtnDone = document.getElementById("vipBtnDone");
if (vipBtnProcess) {
    vipBtnProcess.onclick = async () => {
        vipBtnProcess.disabled = true;
        await setVipOrderStatus("processing", "Pesanan diproses");
        vipBtnProcess.disabled = false;
    };
}
if (vipBtnDone) {
    vipBtnDone.onclick = async () => {
        vipBtnDone.disabled = true;
        await setVipOrderStatus("completed", "Pesanan selesai");
        vipBtnDone.disabled = false;
    };
}

(function bootVipAdmin() {
    const tryStart = () => {
        if (typeof isCurrentUserAdmin === "function" && isCurrentUserAdmin()) {
            startVipAdminListener();
            const sub = document.getElementById("vipMenuSub");
            if (sub) sub.textContent = "Inbox order VIP";
            const lab = document.getElementById("vipMenuLabel");
            if (lab) lab.textContent = "Inbox VIP (Admin)";
        }
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(tryStart, 800));
    } else {
        setTimeout(tryStart, 800);
    }
    window.addEventListener("load", () => setTimeout(tryStart, 1500));
})();
