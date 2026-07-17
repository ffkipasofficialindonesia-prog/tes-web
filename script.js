/*====================================
FFKIPAS BY MUHLIS
PREMIUM JS
====================================*/

/* ===========================
RESET HISTORY SAAT SESSION BARU
=========================== */

if (!sessionStorage.getItem("loaded")) {
    localStorage.removeItem("trxHistory");
    sessionStorage.setItem("loaded", "true");
}

/* ===========================
MOBILE MENU
=========================== */

const menuBtn=document.getElementById("menuBtn");
const navbar=document.getElementById("navbar");

menuBtn.onclick=()=>{

navbar.classList.toggle("active");

};


/* ===========================
COUNTER
=========================== */

const counter=document.getElementById("counter");

let number=0;

const target=12593821;

const speed=target/250;

function updateCounter(){

number+=speed;

if(number<target){

counter.innerHTML=Math.floor(number).toLocaleString();

requestAnimationFrame(updateCounter);

}else{

counter.innerHTML=target.toLocaleString();

}

}

if(counter){
    updateCounter();
}


/* ===========================
FAQ
=========================== */

document.querySelectorAll(".faq-item").forEach(item=>{

const btn=item.querySelector("button");

const answer=item.querySelector("div");

btn.onclick=()=>{

if(answer.style.maxHeight){

answer.style.maxHeight=null;

}else{

answer.style.maxHeight=answer.scrollHeight+"px";

}

};

});


/* ===========================
SCROLL ANIMATION
=========================== */

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll(".download-card,.feature,.stat,.faq-item").forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});


/* ===========================
RIPPLE EFFECT
=========================== */

document.querySelectorAll(".btn-primary,.btn-secondary,.download-card a").forEach(btn=>{

btn.addEventListener("click",function(e){

const ripple=document.createElement("span");

const size=Math.max(this.clientWidth,this.clientHeight);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=e.offsetX-size/2+"px";

ripple.style.top=e.offsetY-size/2+"px";

ripple.className="ripple";

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});


/* HEADER SCROLL */

const header=document.querySelector("header");

window.addEventListener("scroll",()=>{

  if(window.scrollY>40){

    header.classList.add("scrolled");

  }else{

    header.classList.remove("scrolled");

  }

});


/* ===========================
3 CLICK DOWNLOAD ADS
=========================== */

const adLink = "https://www.effectivecpmnetwork.com/b8r0ht674?key=7390f2d0c006f1597d4c085f2dcf948f";

document.querySelectorAll(".download-card a").forEach(btn => {

    let clickCount = 0;
    const downloadLink = btn.href;

    btn.addEventListener("click", function(e) {

        e.preventDefault();

        clickCount++;

        if (clickCount <= 2) {

            window.open(adLink, "_blank");

            btn.innerHTML = `Klik ${3 - clickCount} Kali Lagi`;

        } else {

            window.location.href = downloadLink;

        }

    });

});




/* ===========================
TOPUP DEMO
=========================== */

const gameItems = {

  "FREE FIRE":{

    banner:"assets/banner/freefire.webp",

    uid:"Masukkan UID",

    items:[
      {name:"💎70",price:10000},
      {name:"💎140",price:20000},
      {name:"💎355",price:50000},
      {name:"💎720",price:100000}
    ]

  },

  "MOBILE LEGENDS":{

    banner:"assets/banner/mlbb.webp",

    uid:"Masukkan User ID",

    items:[
      {name:"💎86",price:15000},
      {name:"💎172",price:30000},
      {name:"💎257",price:50000},
      {name:"💎706",price:150000}
    ]

  },

  "PUBG MOBILE":{

    banner:"assets/banner/pubg.webp",

    uid:"Masukkan Character ID",

    items:[
      {name:"60 UC",price:16000},
      {name:"325 UC",price:75000},
      {name:"660 UC",price:149000},
      {name:"1800 UC",price:390000}
    ]

  },

  "ROBLOX":{

    banner:"assets/banner/roblox.webp",

    uid:"Masukkan Username",

    items:[
      {name:"80 Robux",price:15000},
      {name:"400 Robux",price:70000},
      {name:"800 Robux",price:140000},
      {name:"1700 Robux",price:280000}
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
  const serverInput=document.getElementById("serverInput");
  const totalPrice = document.getElementById("totalPrice");
  const diamondGrid = document.getElementById("diamondGrid");

  function renderDiamond(game){

  if(!diamondGrid) return;

  const data = gameItems[game];

if(!data) return;

const items = data.items;

if(popupBanner){
  popupBanner.src=data.banner;
}

if(uidInput){
  uidInput.placeholder=data.uid;
}

  if(!items) return;

  diamondGrid.innerHTML="";

  items.forEach(item=>{

    diamondGrid.innerHTML += `

      <div class="diamond-card" data-price="${item.price}">

        <b>${item.name}</b>

        <span>Rp${item.price.toLocaleString("id-ID")}</span>

      </div>

    `;

  });

if(serverInput){

  if(game==="MOBILE LEGENDS"){

    serverInput.style.display="block";

    serverInput.placeholder="Masukkan Zone ID";

  }else{

    serverInput.style.display="none";

  }

}

  bindDiamondEvents();

}

function bindDiamondEvents(){

  document.querySelectorAll(".diamond-card").forEach(card=>{

    card.onclick=()=>{

      document.querySelectorAll(".diamond-card").forEach(c=>{

        c.classList.remove("active");

      });

      card.classList.add("active");

      const price = Number(card.dataset.price);

      if(totalPrice){

        totalPrice.textContent = "Rp"+price.toLocaleString("id-ID");

      }

      if(summaryPrice){

        summaryPrice.textContent = "Rp"+price.toLocaleString("id-ID");

      }

      if(summaryItem){

        summaryItem.textContent = card.querySelector("b").textContent;

      }

    };

  });

}

const addCustom = document.getElementById("addCustomTopup");

if(addCustom){

addCustom.onclick=()=>{

const value=Number(document.getElementById("customDiamond").value);

if(!value){

alert("Masukkan jumlah terlebih dahulu!");

return;

}

const price=value*200;

summaryItem.textContent="💎 "+value;

summaryPrice.textContent="Rp"+price.toLocaleString("id-ID");

totalPrice.textContent="Rp"+price.toLocaleString("id-ID");

};

}

  if(!popup || !closePopup) return;

  const topupAdLink = "https://www.effectivecpmnetwork.com/b8r0ht674?key=7390f2d0c006f1597d4c085f2dcf948f";

document.querySelectorAll(".game-card").forEach(card=>{

    const btn = card.querySelector("button");
    if(!btn) return;

    btn.onclick = ()=>{

        const key = "topup_" + (card.dataset.game || "game");
        let clicks = Number(localStorage.getItem(key) || 0);

        if(clicks < 1){

            localStorage.setItem(key, clicks + 1);

            window.open(topupAdLink, "_blank");

            return;

        }

        localStorage.removeItem(key);

        popup.classList.add("active");

        if(popupTitle){
            popupTitle.textContent = card.dataset.game || "";
        }

        if(summaryGame){
            summaryGame.textContent = card.dataset.game || "";
        }

        if(popupBanner && card.dataset.banner){
            popupBanner.src = card.dataset.banner;
        }

        renderDiamond(card.dataset.game);

    };

});

  closePopup.onclick=()=>popup.classList.remove("active");

  popup.onclick=(e)=>{
    if(e.target===popup) popup.classList.remove("active");
  };

  if(uidInput){
    uidInput.oninput=()=>{ if(summaryUid) summaryUid.textContent=uidInput.value||"-"; };
  }

  document.querySelectorAll(".pay-card").forEach(card=>{
    card.onclick=()=>{
      document.querySelectorAll(".pay-card").forEach(c=>c.classList.remove("active"));
      card.classList.add("active");
      if(summaryPay) summaryPay.textContent=card.dataset.pay||"-";
    };
  });

  const buyBtn=document.getElementById("buyBtn");
  const invoice=document.getElementById("invoice");
  const invoiceLogo=document.getElementById("invoiceLogo");
  const processing=document.getElementById("processing");
  const loadingTitle=document.getElementById("loadingTitle");
  const loadingDesc=document.getElementById("loadingDesc");
  const closeInvoice=document.getElementById("closeInvoice");
  const copyInvoice=document.getElementById("copyInvoice");
  const downloadInvoice=document.getElementById("downloadInvoice");

  function set(id,val){
    const el=document.getElementById(id);
    if(el) el.textContent=val;
  }

  if(buyBtn){
    buyBtn.onclick=()=>{

      // =======================
// VALIDASI FORM
// =======================

const activeDiamond = document.querySelector(".diamond-card.active");
const customDiamond = Number(document.getElementById("customDiamond")?.value || 0);
const activePay = document.querySelector(".pay-card.active");

if(!uidInput.value.trim()){

    alert("⚠️ Masukkan UID terlebih dahulu!");

    uidInput.focus();

    return;

}

if(serverInput.style.display!="none" && !serverInput.value.trim()){

    alert("⚠️ Masukkan Zone ID!");

    serverInput.focus();

    return;

}

if(!activeDiamond && customDiamond <= 0){

    alert("⚠️ Pilih nominal atau masukkan Nominal Bebas!");

    return;

}

if(!activePay){

    alert("⚠️ Pilih Metode Pembayaran!");

    return;

}

buyBtn.disabled = true;
buyBtn.innerHTML = "⏳ Memproses...";

      if(activeDiamond){

    summaryItem.textContent = activeDiamond.querySelector("b").textContent;

}else{

    summaryItem.textContent = "💎 " + customDiamond;

}

      set("invoiceGame", summaryGame?.textContent||"-");
      set("invoiceUid", summaryUid?.textContent||"-");
      set("invoiceItem", summaryItem?.textContent||"-");
      set("invoicePay", summaryPay?.textContent||"-");
      set("invoicePrice", summaryPrice?.textContent||"Rp0");
      const history = JSON.parse(localStorage.getItem("trxHistory") || "[]");

history.unshift({

    invoice: document.getElementById("invoiceNumber").textContent,

    game: summaryGame.textContent,

    uid: summaryUid.textContent,

    item: summaryItem.textContent,

    pay: summaryPay.textContent,

    price: summaryPrice.textContent,

    date: new Date().toLocaleString("id-ID")

});

localStorage.setItem("trxHistory", JSON.stringify(history));
      set("invoiceNumber","INV-"+Math.floor(Math.random()*900000+100000));
      set("invoiceDate",new Date().toLocaleString("id-ID"));
      processing.classList.add("active");
      const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let progress = 0;

const timer = setInterval(() => {

    progress += 2;

    progressBar.style.width = progress + "%";
    progressText.innerHTML = progress + "%";

    if(progress >= 100){

        clearInterval(timer);

    }

},50);

loadingTitle.innerHTML="🔍 Mengecek UID...";
loadingDesc.innerHTML="Sedang memverifikasi akun.";

setTimeout(()=>{
  popup.classList.remove("active");
},100);

setTimeout(()=>{

  loadingTitle.innerHTML="💳 Menyiapkan Pembayaran...";

  loadingDesc.innerHTML="Menghubungkan ke server.";

},700);

setTimeout(()=>{

  loadingTitle.innerHTML="📦 Membuat Invoice...";

  loadingDesc.innerHTML="Hampir selesai.";

},1400);

setTimeout(()=>{

  processing.classList.remove("active");

  if(invoice){

    invoice.classList.add("active");

  }

  const status=document.getElementById("invoiceStatus");

  if(status){

    status.innerHTML="⏳ Proses Pembayaran";

    status.style.color="#ffd43b";

    setTimeout(()=>{

      status.innerHTML="💲 Pembayaran Berhasil";

      status.style.color="#00d26a";

    },3000);

    setTimeout(()=>{

      status.innerHTML="💎 Berhasil Dikirim";

      status.style.color="#00bfff";

    },5000);

  }

},2500);

    };
  }

  if(copyInvoice){

  copyInvoice.onclick=()=>{

    const text =

`Invoice : ${document.getElementById("invoiceNumber").textContent}

Game : ${document.getElementById("invoiceGame").textContent}

UID : ${document.getElementById("invoiceUid").textContent}

Item : ${document.getElementById("invoiceItem").textContent}

Pembayaran : ${document.getElementById("invoicePay").textContent}

Total : ${document.getElementById("invoicePrice").textContent}`;

    navigator.clipboard.writeText(text);

    copyInvoice.innerHTML="✅ Tersalin";

    setTimeout(()=>{

      copyInvoice.innerHTML="📋 Salin Invoice";

    },2000);

  };

}

if(downloadInvoice){

  downloadInvoice.onclick=()=>{

    window.print();

  };

}

  if(closeInvoice){

    closeInvoice.onclick=()=>{

        // Tutup invoice
        invoice.classList.remove("active");

        // Tutup loading kalau masih aktif
        processing.classList.remove("active");

        // Aktifkan lagi tombol beli
        buyBtn.disabled = false;
        buyBtn.innerHTML = "BELI SEKARANG";

        // Reset progress (kalau ada)
        const progressBar = document.getElementById("progressBar");
        const progressText = document.getElementById("progressText");

        if(progressBar){
            progressBar.style.width = "0%";
        }

        if(progressText){
            progressText.textContent = "0%";
        }

        // Reset judul loading
        if(loadingTitle){
            loadingTitle.innerHTML = "🔍 Mengecek UID...";
        }

        if(loadingDesc){
            loadingDesc.innerHTML = "Sedang memverifikasi akun.";
        }

    };

}

});

const historyList=document.getElementById("historyList");

if(historyList){

const data=JSON.parse(localStorage.getItem("trxHistory")||"[]");

historyList.innerHTML="";

data.forEach(item=>{

historyList.innerHTML+=`

<div class="history-card">

<b>${item.invoice}</b><br>

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

const calcBtn = document.getElementById("calcBtn");

if(calcBtn){

    calcBtn.onclick = ()=>{

        // Hitung harga akun
        const diamond = Number(document.getElementById("diamondInput").value) || 0;

        const hasil = diamond * 121;

        document.getElementById("calcResult").innerHTML =
            "Rp " + hasil.toLocaleString("id-ID");

    };

}

const slides=document.querySelector(".slides");

if(slides){

let current=0;

setInterval(()=>{

const total = slides.children.length;

current=(current+1)%total;

slides.style.transform=`translateX(-${current*50}%)`;

},3000);

}

const glassHeader = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if(window.scrollY > 30){
        glassHeader.style.height="62px";
    }else{
        glassHeader.style.height="72px";
    }
});

/*==============================
FLOATING CHAT
==============================*/

const chatToggle = document.getElementById("chatToggle");
const chatMenu = document.getElementById("chatMenu");

if(chatToggle){

    chatToggle.onclick = ()=>{

        chatMenu.classList.toggle("show");

    };

}

const cekBtn = document.getElementById("cekAccountBtn");

if (cekBtn) {

cekBtn.onclick = async () => {

const uid = document.getElementById("ffUid").value.trim();
const region = document.getElementById("ffRegion").value;
const result = document.getElementById("accountResult");

if(!uid){

alert("Masukkan UID");

return;

}

result.innerHTML="Loading...";

try{

const res = await fetch(`https://ffkipas-api.vercel.app/api/account?uid=${uid}&region=${region}`);

const json = await res.json();

const acc=json.result.AccountInfo;
const guild=json.result.GuildInfo;
const social=json.result.socialinfo;
const pet=json.result.petInfo;

result.innerHTML = `
<div class="ff-profile">

<div class="profile-header">

<div class="avatar-box">
<i class="fa-solid fa-user-secret"></i>
</div>

<div class="player-info">
<h2>${acc.AccountName}</h2>
<p>UID : ${uid}</p>

<div class="level-badge">
⭐ Lv ${acc.AccountLevel}
</div>

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

<p><i class="fa-solid fa-earth-asia"></i> Region
<span>${acc.AccountRegion.toUpperCase()}</span></p>

<p><i class="fa-solid fa-users"></i> Guild
<span>${guild.GuildName}</span></p>

<p><i class="fa-solid fa-crown"></i> Guild Lv
<span>${guild.GuildLevel}</span></p>

<p><i class="fa-solid fa-paw"></i> Pet Level
<span>${pet.level}</span></p>

<p><i class="fa-solid fa-fire"></i> Version
<span>${acc.ReleaseVersion}</span></p>

</div>

<div class="bio-box">

<h4>📝 BIO</h4>

<p>${social.AccountSignature}</p>

</div>

</div>
`;

}catch(e){

result.innerHTML="❌ UID tidak ditemukan.";

}

}

}