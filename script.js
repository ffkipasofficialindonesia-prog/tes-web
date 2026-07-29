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
    document.body.style.overflow = "";
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
const searchResults = document.getElementById("searchResults");
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
    document.body.style.overflow = "";
}

function filterSearch(query) {
    const q = (query || "").trim().toLowerCase();
    const items = document.querySelectorAll(".search-item");
    let visible = 0;

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const match = !q || text.includes(q);
        item.classList.toggle("hidden-item", !match);
        if (match) visible++;
    });

    if (searchEmpty) {
        searchEmpty.style.display = visible === 0 ? "block" : "none";
    }
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
    globalSearch.addEventListener("input", () => {
        filterSearch(globalSearch.value);
    });

    globalSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeSearch();
        }
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
                // focus UID if account check
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

document.querySelectorAll(".download-card, .game-card, .stat, .faq-item, .feedback-box, .account-search, .calc-box").forEach(el => {
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
SLIDER
=========================== */
const slides = document.querySelector(".slides");
if (slides) {
    let current = 0;
    setInterval(() => {
        const total = slides.children.length;
        current = (current + 1) % total;
        slides.style.transform = `translateX(-${current * 50}%)`;
    }, 3500);
}

/* ===========================
FLOATING CHAT
=========================== */
const chatToggle = document.getElementById("chatToggle");
const chatMenu = document.getElementById("chatMenu");
if (chatToggle) {
    chatToggle.onclick = () => chatMenu.classList.toggle("show");
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
FEEDBACK
=========================== */
const feedbackInput = document.getElementById("feedback");
const feedbackChar = document.getElementById("feedbackChar");
if (feedbackInput && feedbackChar) {
    feedbackInput.addEventListener("input", () => {
        feedbackChar.textContent = feedbackInput.value.length;
    });
}

const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = document.getElementById("feedback").value.trim();
        if (!message) {
            showToast("Kosong", "Tulis pesan dulu ya!", "warning");
            return;
        }

        const btn = document.getElementById("sendFeedback");
        const originalBtn = btn ? btn.innerHTML : "";
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = "Mengirim...";
        }

        window.open(
            "https://www.effectivecpmnetwork.com/b8r0ht674?key=7390f2d0c006f1597d4c085f2dcf948f",
            "_blank"
        );

        try {
            await fetch("https://discord.com/api/webhooks/1528395222051196959/s3YXI5cWTw66NCCtIvgu4Zp5Ucc7ccSz-AaNuz58a5NAIOFKopTsGVj5uOT7I-ZDgDSp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: message })
            });
            showToast("Terkirim!", "Pesan berhasil dikirim ke admin.");
            feedbackForm.reset();
        } catch (err) {
            showToast("Gagal", "Gagal mengirim. Coba lagi ya.", "error");
        }

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalBtn;
        }
    });
}
