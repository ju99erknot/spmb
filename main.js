const APPS_URL = "https://script.google.com/macros/s/AKfycbyUxXiJXAZ3i6oUZScBUY_8J78b8gQl68X3OzNRHh9C4XVITOz7IqPN4QmlphLS8p1A/exec";
  
  // --- KONFIGURASI HITUNG MUNDUR ---
  function updateTimer() {
    // Tentukan Tanggal Penutupan PPDB (Ganti sesuai kebutuhan)
    const deadline = new Date("June 01, 2026 23:59:59").getTime();
    const now = new Date().getTime();
    const diff = deadline - now;

    // Elemen Timer
    const timerDisplay = document.getElementById("ppdb-timer");
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    if (diff <= 0) {
      if(timerDisplay) timerDisplay.innerHTML = "<b style='color:#ff4757; font-size:14px;'>PENDAFTARAN GELOMBANG 1 BERAKHIR</b>";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if(daysEl) daysEl.innerText = d < 10 ? "0"+d : d;
    if(hoursEl) hoursEl.innerText = h < 10 ? "0"+h : h;
    if(minsEl) minsEl.innerText = m < 10 ? "0"+m : m;
    if(secsEl) secsEl.innerText = s < 10 ? "0"+s : s;
  }

  // Jalankan timer setiap detik
  setInterval(updateTimer, 1000);
  window.addEventListener('load', updateTimer);
  
  // --- JURUS ANTI TITIK (TARUH DI BAWAH APPS_URL) ---
  const stylePembersih = document.createElement('style');
  stylePembersih.innerHTML = `
    .form-card li, .step li, .dots-container li { list-style: none !important; background: none !important; padding: 0 !important; }
    .form-card li::before, .form-card li::after { content: none !important; display: none !important; }
  `;
  document.head.appendChild(stylePembersih);
  
  let kuotaHabis = false; // Penanda apakah pendaftaran masih buka atau tidak

  // Fungsi Pindah Step - VERSI FINAL + AUTO LOCK TIMER & KUOTA
  async function go(step) {
    // Pengaturan Waktu Penutupan (Harus sama dengan di script timer)
    const deadline = new Date("June 1, 2026 23:59:59").getTime();
    const sekarang = new Date().getTime();
    const waktuHabis = (deadline - sekarang) <= 0;

    // Proteksi: Jika Kuota Habis ATAU Waktu Habis, dilarang lanjut ke Step 2, 3, 4
    if ((kuotaHabis || waktuHabis) && step > 1) { 
      let alasan = kuotaHabis ? "KUOTA PENUH" : "WAKTU PENDAFTARAN BERAKHIR";
      alert("MOHON MAAF!\nPendaftaran sudah ditutup karena " + alasan + "."); 
      return; 
    }
  
    const steps = document.querySelectorAll('.step');
    let currentStepIdx = 0;
    steps.forEach((s, index) => { if(s.classList.contains('active')) currentStepIdx = index + 1; });

    // --- 1. VALIDASI: JALAN HANYA JIKA KLIK "LANJUT" (MAJU) ---
    if (step > currentStepIdx) {
      const currentStepEl = document.getElementById('s' + currentStepIdx);
      const inputsWajib = currentStepEl.querySelectorAll('[required]');
      let adaKesalahan = false;
      let pesanError = "";

      // --- TAMBAHAN: CEK UMUR MINIMAL 6 TAHUN (KHUSUS STEP 1) ---
      if (currentStepIdx === 1) {
        const tglLahirVal = document.getElementsByName('tgl_lahir')[0].value;
        if (tglLahirVal) {
          const lahir = new Date(tglLahirVal);
          const target = new Date("2026-07-01"); // Patokan PPDB
          let usia = target.getFullYear() - lahir.getFullYear();
          const m = target.getMonth() - lahir.getMonth();
          if (m < 0 || (m === 0 && target.getDate() < lahir.getDate())) { usia--; }

          if (usia < 6) {
            document.getElementsByName('tgl_lahir')[0].classList.add('input-error');
            alert("MAAF!\nSesuai aturan, usia minimal harus 6 tahun per 1 Juli 2026.\nUsia ananda saat ini: " + usia + " tahun.");
            return; // Kunci, jangan kasih lewat
          }
        }
      }

      // Cek Input Wajib (Required)
      inputsWajib.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('input-error');
          adaKesalahan = true;
          pesanError = "Waduh, ada kolom wajib yang masih kosong!";
        } else {
          input.classList.remove('input-error');
        }
      });

      // --- VALIDASI KHUSUS NIK (16 DIGIT & ANTI-KEMBAR) ---
      const allInputs = currentStepEl.querySelectorAll('input');
      const nSiswa = document.getElementsByName('nik')[0].value.trim(); // Ambil NIK Anak buat pembanding

      allInputs.forEach(input => {
        if (input.name.includes("nik")) {
          const nilai = input.value.trim();
          
          // 1. Cek Panjang 16 Digit (Wajib untuk Siswa/Ibu, Opsional untuk Ayah kecuali diisi)
          if (input.hasAttribute('required') || nilai !== "") {
            if (nilai.length !== 16) {
              input.classList.add('input-error');
              adaKesalahan = true;
              pesanError = "NIK " + (input.name.includes("ibu") ? "Ibu" : (input.name.includes("ayah") ? "Ayah" : "Siswa")) + " harus 16 digit!";
            }
          }

          // 2. Cek NIK Orang Tua tidak boleh sama dengan NIK Anak (Khusus di Step 3)
          if (currentStepIdx === 3 && nilai !== "" && nilai === nSiswa) {
            input.classList.add('input-error');
            adaKesalahan = true;
            pesanError = "MAAF! NIK Orang Tua tidak boleh sama dengan NIK Anak.";
          }
        }
      });

      // --- 3. KHUSUS CEK NIK IBU VS AYAH (DI STEP 3) ---
      if (currentStepIdx === 3) {
        const nIbu = document.getElementsByName('nik_ibu')[0].value.trim();
        const nAyah = document.getElementsByName('nik_ayah')[0].value.trim();
        
        if (nIbu !== "" && nAyah !== "" && nIbu === nAyah) {
          document.getElementsByName('nik_ibu')[0].classList.add('input-error');
          document.getElementsByName('nik_ayah')[0].classList.add('input-error');
          adaKesalahan = true;
          pesanError = "MAAF! NIK Ibu dan NIK Ayah tidak boleh sama.";
        }
      }

      if (adaKesalahan) {
        alert(pesanError);
        return; // Gak boleh lanjut
      }
    }
    // --- AKHIR VALIDASI ---

    // --- 2. LOGIKA CEK NIK DATABASE (HANYA MAJU 1 KE 2) ---
    if (currentStepIdx === 1 && step === 2) {
      const nik = document.getElementsByName('nik')[0].value;
      const btnNext = document.querySelector('#s1 .btn-next');
      const textAsli = btnNext.innerText;
      
      btnNext.innerText = "MENGECEK DATA...";
      btnNext.disabled = true;

      try {
        const respon = await fetch(APPS_URL + "?cek_nik=" + nik);
        const hasil = await respon.text();
        if (hasil === "Tahap 1" || hasil === "Tahap 2" || hasil === "Lulus") {
          alert("MAAF!\nNIK " + nik + " sudah terdaftar.");
          btnNext.innerText = textAsli; 
          btnNext.disabled = false;
          return; 
        }
      } catch (err) { console.log("Skip cek nik karena koneksi."); }
      
      btnNext.innerText = textAsli; 
      btnNext.disabled = false;
    }

    // --- 3. PINDAH HALAMAN (INSTAN & ENTENG) ---
    steps.forEach(s => { 
      s.classList.remove('active'); 
      s.style.display = 'none'; 
    });
    
    const target = document.getElementById('s' + step);
    if (target) {
      target.classList.add('active');
      target.style.display = 'block';
    }

    // Update Progress Bar & Dot
    document.getElementById('progress-bar').style.width = ((step-1)/3*100) + '%';
    for(let i=1; i<=4; i++){
      let d = document.getElementById('d'+i);
      if(!d) continue;
      d.className = i < step ? 'dot done' : (i == step ? 'dot active' : 'dot');
      if(i < step) d.innerHTML = '✓'; else d.innerHTML = i;
    }

    // Scroll Instan (Auto) ke Header Form
    window.scrollTo(0, document.getElementById('spmb-sultan').offsetTop - 20);
  }

	// --- LOGIKA HITUNG KUOTA (VERSI FULL ICON CSS & SVG) ---
window.addEventListener('load', function() {
  fetch(APPS_URL).then(r => r.text()).then(t => {
    const pendaftar = parseInt(t);
    const maxKuota = 72; 
    const sisa = maxKuota - pendaftar;

    if (document.getElementById('count-pendaftar')) document.getElementById('count-pendaftar').innerText = pendaftar;
    if (document.getElementById('count-sisa')) document.getElementById('count-sisa').innerText = sisa <= 0 ? 0 : sisa;

    if (sisa <= 0) {
      kuotaHabis = true; 
      
      const pg = document.querySelector('.progress-container');
      if (pg) pg.style.display = 'none';

      const formCard = document.querySelector('.form-card');
      if (formCard) {
        formCard.innerHTML = `
          <div style="text-align:center; padding:30px 10px; animation: slideUp 0.5s ease;">
            
            <div class="icon-block-css"></div>
            
            <div style="font-size:24px; font-weight:800; color:#2b6cb0; margin-bottom:10px; letter-spacing:-0.5px;">
                PENDAFTARAN BELUM DIBUKA
            </div>
            
            <p style="color:#4a5568; margin-bottom:25px; font-size:15px; line-height:1.5;">
              Sabar ya! Pendaftaran Peserta Didik Baru di <b>SDN 02 CIBADAK</b> akan segera hadir dalam waktu dekat.
            </p>
            
            <div style="background:#ebf8ff; padding:20px; border-radius:16px; text-align:left; border:1px solid #90cdf4; position:relative; overflow:hidden;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <b style="color:#2b6cb0; font-size:14px; text-transform:uppercase; letter-spacing:0.5px;">Informasi Jadwal</b>
              </div>
              
              <p style="font-size:13px; color:#4a5568; line-height:1.6; margin:0;">
                Bapak/Ibu dapat memantau halaman ini secara berkala atau menghubungi Panitia via WhatsApp untuk mendapatkan update mengenai jadwal resmi dan persyaratan pendaftaran.
              </p>
              
              <a href="https://api.whatsapp.com/send?phone=6287777099842" target="_blank" 
                 style="display:flex; align-items:center; justify-content:center; gap:10px; background:#25d366; color:white; text-align:center; padding:14px; border-radius:12px; text-decoration:none; font-weight:bold; font-size:16px; margin-top:15px; box-shadow: 0 8px 20px rgba(37,211,102,0.25); transition: 0.3s;">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 TANYA JADWAL PENDAFTARAN
              </a>
            </div>
          </div>

          <style>
            .icon-block-css {
              width: 70px;
              height: 70px;
              border: 5px solid #ef4444;
              border-radius: 50%;
              margin: 0 auto 20px;
              position: relative;
              background: #fee2e2;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon-block-css::before {
              content: "";
              position: absolute;
              width: 45px;
              height: 5px;
              background: #ef4444;
              transform: rotate(-45deg);
              border-radius: 10px;
            }
            @keyframes slideUp { 
              from { opacity:0; transform:translateY(20px); } 
              to { opacity:1; transform:translateY(0); } 
            }
          </style>
        `;
      }
    }
  });
});

// Cek Status
function cekStatus() {
  let nik = document.getElementById('nikCek').value;
  let h = document.getElementById('hasil-cek');
  
  if (nik.length < 16) {
    alert("Waduh, NIK itu 16 angka! Kurang " + (16 - nik.length) + " angka lagi.");
    return;
  }

  // Animasi Loading Elegan
  h.style.display = "block"; 
  h.style.background = "none";
  h.innerHTML = `
    <div style="padding:40px; text-align:center; background:white; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
      <div class="loader-kebut"></div>
      <div style="font-size:13px; color:#94a3b8; font-weight:600; letter-spacing:1px;">MENYINGKRONKAN DATA...</div>
    </div>
    <style>
      .loader-kebut { width:45px; height:45px; border:4px solid #f3f3f3; border-top:4px solid #3498db; border-radius:50%; animation: spin 0.8s linear infinite; margin:0 auto 15px; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;

  fetch(APPS_URL + "?cek_nik=" + nik, { cache: 'no-store' }).then(r => r.text()).then(res => {
    // --- MEMBERSIHKAN DATA ASLI (TRIM PENTING UNTUK XML/SHEETS) ---
    let potongan = res.split("|").map(item => item.trim());
    let namaAnanda = potongan[0] || "Bapak/Ibu";
    let statusSiswa = potongan[1] || "";
    let rawLink = potongan[2] || ""; 

    console.log("Data dari Sheets:", res); 
    
    // --- 2. VALIDASI DATA TIDAK ADA ---
    if (statusSiswa === "Tidak Ditemukan" || statusSiswa === "" || res.includes("Error")) {
       h.innerHTML = `<div style="text-align:center; padding:20px; color:#c53030; background:white; border-radius:15px; border:1px solid #feb2b2;">Data NIK tidak ditemukan. Pastikan nomor sudah benar.</div>`;
       return;
    }

    let step1 = "#e2e8f0", step2 = "#e2e8f0", step3 = "#e2e8f0";
    let glow1 = "none", glow2 = "none", glow3 = "none";
    let warna, ikon, judul, sub;

    // --- 3. LOGIKA TAHAP 1 ---
    if(statusSiswa == "Tahap 1") { 
      warna = "#3b82f6"; ikon = "📨"; judul = "DATA TERDAFTAR"; 
      sub = `Selamat! Berkas digital ananda <b>${namaAnanda}</b> sudah masuk antrean sistem.`;
      step1 = "#3b82f6"; glow1 = "0 0 15px rgba(59, 130, 246, 0.5)";
    }
    // --- 4. LOGIKA TAHAP 2 ---
    else if(statusSiswa == "Tahap 2") { 
      warna = "#f59e0b"; ikon = "🔍"; judul = "VERIFIKASI DATA"; 
      sub = `Data ananda <b>${namaAnanda}</b> sedang dalam proses verifikasi oleh panitia.`;
      step1 = "#3b82f6"; step2 = "#f59e0b"; glow2 = "0 0 15px rgba(245, 158, 11, 0.5)";
    }
    // --- 5. LOGIKA DITOLAK / KUOTA PENUH ---
    else if(statusSiswa.toLowerCase().includes("tolak") || statusSiswa.toLowerCase().includes("penuh")) {
      warna = "#ef4444"; 
      ikon = "🚫"; 
      judul = "DITOLAK";
      sub = `Mohon maaf, pendaftaran ananda <b>${namaAnanda}</b> tidak dapat dilanjutkan karena kuota penuh atau berkas tidak memenuhi syarat.`;
      
      // --- PERBAIKAN WARNA DI SINI ---
      step1 = "#3b82f6"; // INPUT (Biru)
      step2 = "#f59e0b"; // VERIFIKASI (Kuning) <-- Tadi di sini masih biru
      step3 = "#ef4444"; // HASIL (Merah)
      
      glow3 = "0 0 15px rgba(239, 68, 68, 0.5)";
    }
    // --- 6. LOGIKA LULUS ---
    else if(statusSiswa.toLowerCase().includes("lulus")) { 
      warna = "#10b981"; ikon = "🏆"; judul = "HASIL: DITERIMA"; 
      let linkS1 = rawLink.replace(/\s/g, ''); 
      let tahun = "2026";
      let tigaDigitNIK = nik.substring(nik.length - 3);
      let noReg = tahun + "-" + tigaDigitNIK; 

      sub = `
        <div style="background:#fefce8; border:1px solid #fef08a; padding:10px; border-radius:10px; font-size:10px; color:#854d0e; margin-bottom:10px;">
          🔍 <b>DEBUG SISTEM:</b> Isi Kolom AD yang terbaca: <br>
          <code style="color:red; font-weight:bold;">"${rawLink || 'KOSONG / TIDAK TERBACA'}"</code>
        </div>
        <div class="no-print" style="text-align:center; margin-bottom:15px;">
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:12px;">
            <p style="color:#166534; font-size:13px; margin:0;">Selamat! Ananda <b>${namaAnanda}</b> dinyatakan lulus seleksi.</p>
          </div>
          ${linkS1.length > 5 ? `<a href="${linkS1.includes('http') ? linkS1 : 'https://' + linkS1}" target="_blank" style="display:block; margin-top:10px; background:#1d4ed8; color:white; text-align:center; padding:12px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:14px; box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);">📥 DOWNLOAD FORMULIR S1 (PDF)</a>` : `<div style="margin-top:10px; padding:10px; border:1px dashed #ccc; border-radius:10px; font-size:12px; color:#666;">ℹ️ Link formulir di Kolom AD tidak ditemukan atau bukan link.</div>`}
        </div>
        <div id="kartu-resmi" style="background:white; color:black; font-family: Arial, sans-serif; border:1px solid #000; padding:15px; position:relative; text-align:left;">
          <div style="text-align:center; border-bottom:3px double #000; padding-bottom:10px; margin-bottom:15px;">
            <h2 style="margin:0; font-size:16px;">PANITIA SPMB ONLINE 2026</h2>
            <p style="margin:0; font-size:11px;">SDN 02 CIBADAK - Kab. Sukabumi</p>
          </div>
          <h3 style="text-align:center; font-size:14px; text-decoration:underline; margin-bottom:15px;">BUKTI KELULUSAN SELEKSI</h3>
          <div style="text-align:center; margin-bottom:15px;">
            <div style="margin-bottom:10px;"><span style="font-size:11px; color:#666; display:block;">Nama Lengkap:</span><b style="font-size:15px; text-transform:uppercase; display:block;">${namaAnanda}</b></div>
            <div style="margin-bottom:10px;"><span style="font-size:11px; color:#666; display:block;">Nomor Registrasi:</span><b style="font-size:16px; display:block; color:#1d4ed8;">#${noReg}</b></div>
            <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:10px; border-radius:8px;">
              <span style="font-size:11px; color:#ef4444; font-weight:bold; display:block;">🗓️ JADWAL DAFTAR ULANG:</span>
              <b style="font-size:13px; color:#111827; display:block;">Senin - Rabu, 16 - 18 Maret 2026</b>
              <span style="font-size:11px; color:#374151;">Pukul 08.00 - 12.00 WIB (Di Ruang Panitia)</span>
            </div>
          </div>
          <div style="margin-top:15px; font-size:10px; border:1px solid #000; padding:8px; background:#fff; line-height:1.4; text-align:center;"><b>CATATAN:</b> Screenshot bukti ini untuk verifikasi berkas fisik. <br>Dicetak pada: ${new Date().toLocaleDateString('id-ID')}</div>
          <div class="qr-signature" style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:20px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=LULUS-${noReg}" width="70">
            <div class="signature-box" style="text-align:center; width:160px;">
              <p style="font-size:11px; margin-bottom:40px;">Ketua Panitia PPDB,</p>
              <p style="font-weight:bold; font-size:12px; text-decoration:underline;">( SDN 02 CIBADAK )</p>
            </div>
          </div>
        </div>
        <div class="no-print" style="margin-top:20px; display:grid; gap:10px;">
          <button onclick="window.print()" style="background:#10b981; color:white; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer;">🖨️ CETAK KARTU DIGITAL</button>
          <button onclick="kirimWA('${namaAnanda}', '${noReg}')" style="background:#25d366; color:white; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer;">📲 KONFIRMASI KE WHATSAPP</button>
        </div>
      `;
      step1 = "#3b82f6"; step2 = "#f59e0b"; step3 = "#10b981";
      glow1 = "none"; glow2 = "none"; glow3 = "0 0 15px rgba(16, 185, 129, 0.5)";
    }

    // --- 7. TAMPILAN DASHBOARD PREMIUM ---
    h.innerHTML = `
      <div style="background:white; border-radius:24px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.08); border:1px solid #f1f5f9; animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
        <div style="background:${warna}; padding:20px; color:white; position:relative; overflow:hidden;">
            <div style="position:absolute; right:-20px; top:-20px; font-size:100px; opacity:0.1;">${ikon}</div>
            <div style="font-size:10px; font-weight:bold; letter-spacing:2px; opacity:0.8; margin-bottom:4px;">STATUS PENDAFTARAN</div>
            <div style="font-size:18px; font-weight:800; letter-spacing:0.5px;">${judul}</div>
        </div>
        <div style="padding:30px; text-align:center;">
          <div style="font-size:55px; margin-bottom:15px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));">${ikon}</div>
          <p style="font-size:14px; color:#475569; margin:0 auto 25px; line-height:1.6; max-width:280px;">${sub}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; position:relative; margin:0 20px 30px;">
            <div style="position:absolute; top:12px; left:0; right:0; height:4px; background:#f1f5f9; z-index:1; border-radius:10px;"></div>
            <div style="z-index:2; text-align:center; flex:1;">
              <div style="width:24px; height:24px; background:${step1}; border-radius:50%; margin:0 auto; border:4px solid white; box-shadow:${glow1}; transition:0.5s;"></div>
              <div style="font-size:10px; margin-top:8px; font-weight:800; color:${step1}">INPUT</div>
            </div>
            <div style="z-index:2; text-align:center; flex:1;">
              <div style="width:24px; height:24px; background:${step2}; border-radius:50%; margin:0 auto; border:4px solid white; box-shadow:${glow2}; transition:0.5s;"></div>
              <div style="font-size:10px; margin-top:8px; font-weight:800; color:${step2}">VERIFIKASI</div>
            </div>
            <div style="z-index:2; text-align:center; flex:1;">
              <div style="width:24px; height:24px; background:${step3}; border-radius:50%; margin:0 auto; border:4px solid white; box-shadow:${glow3}; transition:0.5s;"></div>
              <div style="font-size:10px; margin-top:8px; font-weight:800; color:${step3}">HASIL</div>
            </div>
          </div>
          <div style="background:#f8fafc; border-radius:12px; padding:12px; border:1px dashed #e2e8f0;">
            <div style="font-size:11px; color:#64748b; font-weight:600;">
              📢 <span style="color:#1e293b;">INFO PANITIA:</span> Cek halaman ini secara berkala! Status akan berubah otomatis setelah admin selesai memvalidasi data yang Bapak/Ibu inputkan.
            </div>
          </div>
        </div>
        <div style="padding:15px; text-align:center; background:#fff; border-top:1px solid #f1f5f9;">
            <a href="javascript:location.reload()" style="font-size:12px; color:${warna}; font-weight:bold; text-decoration:none; display:inline-flex; align-items:center; gap:5px;">🔄 Cek NIK Lainnya</a>
        </div>
      </div>
      <style>@keyframes slideUp { from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }</style>
    `;
  }).catch(err => {
    h.innerHTML = `<div style="text-align:center; padding:20px; color:red;">Koneksi Terputus. Silakan coba lagi.</div>`;
  });
}

document.getElementById('mainForm').onsubmit = function(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSelesai');
  const formCard = document.querySelector('.form-card');
  const namaSiswa = document.getElementsByName('nama')[0].value.toUpperCase();
  const nikSiswa = document.getElementsByName('nik')[0].value;
  const tglDaftar = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const thn = new Date().getFullYear();
  const elCount = document.getElementById('count-pendaftar');
  const urutan = elCount ? (parseInt(elCount.innerText) + 1).toString().padStart(3, '0') : "001";
  const noReg = thn + "-" + urutan;

  btn.innerText = "SEDANG MENGIRIM DATA...";
  btn.disabled = true;

  let fData = new FormData(this);
  let q = new URLSearchParams(fData).toString();

  fetch(APPS_URL + "?" + q, { method: 'POST', mode: 'no-cors' })
    .then(() => {
      formCard.innerHTML = `
        <div style="animation: slideUp 0.5s ease; font-family: Arial, sans-serif; color:#333;">
          <div style="text-align:center; padding:10px;">
            <span style="font-size:50px;">✅</span>
            <h2 style="color:#166534; margin:10px 0;">PENDAFTARAN BERHASIL</h2>
            <p style="font-size:13px;">Data ananda <b>${namaSiswa}</b> sudah masuk sistem.</p>
          </div>
          <div id="print-area" style="background:#fff; border:2px solid #000; padding:15px; margin:20px 0; border-radius:10px;">
            <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:15px;">
              <b style="font-size:14px; display:block;">BUKTI REGISTRASI ONLINE</b>
              <span style="font-size:11px;">SDN 02 CIBADAK - TAHUN 2026</span>
            </div>
            <table style="width:100%; font-size:13px; border-collapse:collapse;">
              <tr><td style="padding:5px; color:#666; width:40%;">Nama Siswa</td><td style="padding:5px;">: <b>${namaSiswa}</b></td></tr>
              <tr><td style="padding:5px; color:#666;">No. Registrasi</td><td style="padding:5px;">: <b style="color:#1d4ed8;">${noReg}</b></td></tr>
              <tr><td style="padding:5px; color:#666;">NIK</td><td style="padding:5px;">: ${nikSiswa}</td></tr>
              <tr><td style="padding:5px; color:#666;">Tgl Daftar</td><td style="padding:5px;">: ${tglDaftar}</td></tr>
            </table>
          </div>
          <div class="no-print" style="display:grid; gap:10px; margin-bottom:20px;">
              <button onclick="window.print()" style="background:#333; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">🖨️ PRINT / SIMPAN PDF</button>
              <button onclick="window.open('https://api.whatsapp.com/send?phone=6287777099842&amp;text=Halo Panitia, saya sudah daftar online.%0ANama: ${namaSiswa}%0ANo.Reg: ${noReg}', '_blank')" style="background:#25d366; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">📲 KIRIM WA PANITIA</button>
          </div>
          <div style="background:#fff3e0; border-left:5px solid #ef6c00; padding:15px; border-radius:8px; margin-bottom:15px; text-align:left;">
            <b style="color:#e65100; display:block; margin-bottom:5px;">📢 WAJIB GABUNG GRUP:</b>
            <a href="https://chat.whatsapp.com/GANTI_LINK_DISINI" target="_blank" style="display:block; background:#128c7e; color:white; text-align:center; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold;">🟢 GABUNG GRUP WA</a>
          </div>
          <div style="background:#f1f5f9; padding:15px; border-radius:8px; border:1px solid #cbd5e1; text-align:left;">
            <b style="display:block; margin-bottom:8px; font-size:13px;">📄 BERKAS DAFTAR ULANG:</b>
            <ul style="font-size:12px; padding-left:20px; margin:0;">
              <li>FC Akta Kelahiran (2 Lembar)</li>
              <li>FC Kartu Keluarga (2 Lembar)</li>
              <li>FC KTP Orang Tua (Ayah &amp; Ibu)</li>
              <li>Pas Foto 3x4 (3 Lembar)</li>
            </ul>
          </div>
          <button onclick="location.reload()" style="display:block; margin:20px auto; background:none; border:none; color:#3b82f6; cursor:pointer; text-decoration:underline;">Daftar Siswa Lain</button>
        </div>
      `;
      window.scrollTo({top: formCard.offsetTop - 50, behavior: 'smooth'});
    })
    .catch((err) => {
      alert("Gagal terhubung ke server.");
      btn.innerText = "KIRIM PENDAFTARAN";
      btn.disabled = false;
    });
};

function toggleSubmit() {
  const ceklis = document.getElementById('setujuCeklis');
  const btn = document.getElementById('btnSelesai');
  if (ceklis.checked) {
    btn.disabled = false;
    btn.style.background = "#3b82f6";
    btn.style.cursor = "pointer";
  } else {
    btn.disabled = true;
    btn.style.background = "#ccc";
    btn.style.cursor = "not-allowed";
  }
}

document.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });
});

function kirimWA(nama, nik) {
  let nomorAdmin = "6287777099842";
  
  // Gunakan template literals dan biarkan spasi/baris baru apa adanya
  // Kita akan gunakan encodeURIComponent agar karakter spesial aman
  let pesan = `Halo Panitia SPMB SDN 02 CIBADAK 2026,

Saya ingin mengonfirmasi hasil kelulusan:
*Nama:* ${nama}
*NIK/No Reg:* ${nik}
*Status:* DITERIMA / LULUS

(Saya melampirkan file PDF/Screenshot bukti kelulusan bersama pesan ini). 
Mohon informasi untuk langkah daftar ulang selanjutnya. Terima kasih.`;

  // Gunakan encodeURIComponent untuk memastikan pesan terformat dengan benar di URL
  let url = `https://api.whatsapp.com/send?phone=${nomorAdmin}&text=${encodeURIComponent(pesan)}`;
  
  window.open(url, '_blank');
}

function bukaSekarang() {
    var curtain = document.getElementById('welcome-curtain');
    if (curtain) {
      curtain.classList.add('open');
      
      // PERBAIKAN: Paksa hapus semua kunci scroll agar form bisa diklik
      setTimeout(function() {
        document.body.style.overflow = 'visible';
        document.body.style.height = 'auto';
        document.body.style.position = 'static';
        
        // Opsional: Hapus elemen dari DOM agar tidak menghalangi klik
        setTimeout(function(){
           curtain.style.display = 'none';
        }, 1200);
      }, 500);
    }
  }

  window.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0,0);
    // Kunci sementara saat tirai masih ada
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

  });
