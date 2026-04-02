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
  const nikInput = document.getElementsByName('nik')[0];
  const nik = nikInput.value.trim();
  const btnNext = document.querySelector('#s1 .btn-next');
  const textAsli = btnNext.innerText;
  
  // Validasi dasar dulu sebelum tembak server
  if (nik.length !== 16) {
    alert("NIK harus 16 digit!");
    nikInput.classList.add('input-error');
    return;
  }

  btnNext.innerText = "MENGECEK NIK...";
  btnNext.disabled = true;

  try {
    const respon = await fetch(APPS_URL + "?cek_nik=" + nik);
    const hasil = await respon.text();
    
    // Jika hasil mengandung nama (artinya ketemu di database)
    if (hasil !== "Tidak Ditemukan" && !hasil.includes("Error")) {
      // Tanya orang tua mau cetak struk atau tidak
      const mauStruk = confirm("NIK " + nik + " SUDAH TERDAFTAR.\n\nApakah Anda ingin MENCETAK ULANG Tanda Terima Pendaftaran?");
      
      if (mauStruk) {
        paksaCetakStruk(nik); // Panggil fungsi khusus struk yang kita buat tadi
      }

      btnNext.innerText = textAsli; 
      btnNext.disabled = false;
      nikInput.classList.add('input-error');
      return; 
    }
  } catch (err) {
    // Jika koneksi putus, jangan dibiarkan lewat demi keamanan data
    alert("GAGAL MENGHUBUNGI SERVER.\nPeriksa koneksi internet Anda dan coba lagi.");
    btnNext.innerText = textAsli; 
    btnNext.disabled = false;
    return; 
  }
  
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

    // --- UPDATE PROGRESS BAR & DOT ---
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      // Rumus: (step - 1) / (total_step - 1) * 100
      let progressWidth = ((step - 1) / 3) * 100;
      progressBar.style.width = progressWidth + '%';
    }

    // Update Bulatan (Dot)
    for(let i=1; i<=4; i++){
      let d = document.getElementById('d'+i);
      if(!d) continue;
      
      if (i < step) {
        d.className = 'dot done';
        d.innerHTML = '✓'; 
      } else if (i == step) {
        d.className = 'dot active';
        d.innerHTML = i;
      } else {
        d.className = 'dot';
        d.innerHTML = i;
      }
    }

    // --- PANGGIL REVIEW DATA (Hanya jika masuk ke Step 4) ---
    if (step === 4) {
      try {
        updateReview(); // Memanggil fungsi review yang sudah kamu buat di bawah
      } catch (err) {
        console.error("Gagal memuat review data:", err);
      }
    }

    // Scroll Instan (Auto) ke Header Form
    const headerForm = document.getElementById('spmb-sultan');
    if (headerForm) {
      window.scrollTo({top: headerForm.offsetTop - 20, behavior: 'smooth'});
    }
  } // Penutup fungsi go

// Cek Status
function cekStatus() {
  let nik = document.getElementById('nikCek').value;
  let h = document.getElementById('hasil-cek');
  
  // --- PERBAIKAN DI SINI (SI SAPU BERSIH AMAN) ---
  const areaForm = document.querySelector('.form-card');
  const pgContainer = document.querySelector('.progress-container');
  
  // Kita sembunyikan saja, jangan dihapus isinya supaya tidak blank
  if (areaForm) areaForm.style.display = 'none'; 
  if (pgContainer) pgContainer.style.display = 'none'; 
  // ----------------------------------------------

  if (nik.length < 16) {
    alert("Waduh, NIK itu 16 angka! Kurang " + (16 - nik.length) + " angka lagi.");
    // Jika salah input, munculkan kembali formnya agar user bisa benerin
    if (areaForm) areaForm.style.display = 'block';
    if (pgContainer) pgContainer.style.display = 'block';
    return;
  }

  // Animasi Loading Elegan
  h.style.display = "block"; 
  h.style.background = "none";
  h.innerHTML = `
    <div style="padding:40px 15px; text-align:center; background:white; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05); margin:auto; font-family:sans-serif; box-sizing:border-box;">
  <div class="r-cont">
    <div class="runner">
      <div class="h"></div><div class="b"></div><div class="a f"></div><div class="a bk"></div><div class="l f"></div><div class="l bk"></div>
    </div>
  </div>
  <div style="margin-top:35px;">
    <div style="font-size:18px; color:#1e293b; font-weight:900; letter-spacing:1px; text-transform:uppercase; white-space: nowrap;">MENJEMPUT DATA...</div>
    <div style="font-size:12px; color:#94a3b8; margin-top:5px; font-weight:600; white-space: nowrap;">Mohon tunggu sebentar</div>
  </div>
</div>

<style>
  .r-cont { position:relative; height:80px; display:flex; justify-content:center; }
  .runner { position:relative; width:40px; height:80px; animation: bob .5s infinite alternate ease-in-out; }
  .runner div { position:absolute; background:#3498db; border-radius:10px; }
  .h { width:16px; height:16px; border-radius:50%!important; top:0; left:12px; }
  .b { width:12px; height:30px; top:18px; left:14px; }
  .a, .l { width:8px; height:20px; transform-origin:top; top:20px; left:16px; animation: sw .6s infinite alternate; }
  .bk { opacity:0.6; animation-direction:alternate-reverse; }
  .l { top:45px; height:25px; animation-direction:alternate-reverse; }
  .l.bk { animation-direction:alternate; }
  @keyframes sw { 0%{transform:rotate(-45deg)} 100%{transform:rotate(45deg)} }
  @keyframes bob { from{transform:translateY(0)} to{transform:translateY(-8px)} }
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
  warna = "#10b981"; 
  ikon = ""; 
  judul = "HASIL: DITERIMA"; 
  
  // Pakai pengaman (rawLink || "") agar tidak bentrok kalau data kosong
  let linkS1 = (rawLink || "").toString().replace(/\s/g, ''); 
  let tahun = "26";
  // Mengambil 3 digit terakhir NIK agar unik tapi tetap profesional
  let nikSiswa = (nik || "000").toString();
  let tigaDigitNIK = nikSiswa.substring(nikSiswa.length - 3);
  let noReg = "CBD2-" + tahun + "-" + tigaDigitNIK; // Hasil: CBD2-26-XXX 

  // LOGIKA WARNA MAP (Sudah ditambah background agar lebih jelas bagi Panitia)
  let valJK = (typeof jk !== 'undefined' && jk) ? jk.toString().toLowerCase() : "";

  // Menentukan warna & label secara otomatis
  let bgMap = valJK.includes("p") ? "#fce7f3" : "#dbeafe"; // Pink untuk P, Biru untuk L
  let txtMap = valJK.includes("p") ? "#9d174d" : "#1e40af"; // Teks Merah/Biru Tua
  let labelMap = valJK.includes("p") ? "MERAH (Perempuan)" : "BIRU (Laki-laki)";
  
  let infoS1 = linkS1.length > 5 ? "Bisa cetak mandiri di bawah atau dibantu Panitia saat di sekolah." : "Akan dicetakan oleh Panitia saat daftar ulang.";

  sub = `
    <div class="no-print" style="text-align:center; margin-bottom:15px;">
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:12px;">
        <i class="fas fa-trophy" style="color:#f59e0b; font-size:20px; margin-bottom:5px; display:block;"></i>
        <p style="color:#166534; font-size:13px; margin:0; font-family: sans-serif;">
          Selamat! Ananda <b>${namaAnanda}</b> resmi menjadi bagian dari <b>SDN 02 Cibadak</b>.
        </p>
      </div>
    </div>

    <div id="kartu-resmi" style="background:white; color:black; font-family: Arial, sans-serif; border:1px solid #000; padding:15px; position:relative; text-align:left;">
      
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:200px; opacity:0.08; pointer-events:none; z-index:0;">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiszg__R6xkw7yYt-uz1to4_dlLq7JVSCE1SL_1tmXqdeKZbExb8-DGY5_Q9ZNZwVjvKcSRE4X24-LE5N7-fMXYx_a0fyPB5Drs7M-fWRESugjDzMrEsc-HHHMBcXfucYH_vFTdRk06WdRLL7vJ7xfZiGtn280bx-0IcEr6WpTxYK8Xd3Xk2WuoQGOVhBFO/s1600/sdn2cbd%20small.png" style="width:100%;">
      </div>

      <div style="position:relative; z-index:1;">
        <div style="text-align:center; border-bottom:3px double #000; padding-bottom:10px; margin-bottom:15px;">
          <h2 style="margin:0; font-size:16px;">PANITIA SPMB ONLINE 2026</h2>
          <p style="margin:0; font-size:11px;">SDN 02 CIBADAK - Kab. Sukabumi</p>
        </div>

        <h3 style="text-align:center; font-size:14px; text-decoration:underline; margin-bottom:15px;">BUKTI KELULUSAN SELEKSI</h3>

        <div style="text-align:center; margin-bottom:15px;">
          <div style="margin-bottom:8px;">
            <span style="font-size:10px; color:#666;">NAMA LENGKAP:</span>
            <b style="font-size:15px; text-transform:uppercase; display:block;">${namaAnanda}</b>
          </div>
          <div style="margin-bottom:12px;">
            <span style="font-size:10px; color:#666;">NOMOR REGISTRASI:</span>
            <b style="font-size:18px; display:block; color:#11ba82;">#${noReg}</b>
          </div>
          
          <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:10px; border-radius:8px; margin-bottom:12px;">
            <span style="font-size:11px; color:#ef4444; font-weight:bold; display:block;"><i class="fas fa-calendar-alt"></i> JADWAL DAFTAR ULANG:</span>
            <b style="font-size:13px; color:#111827; display:block;">Senin - Rabu, 16 - 18 Maret 2026</b>
            <span style="font-size:10px; color:#374151;">Pukul 08.00 - 12.00 WIB (Di Ruang Panitia)</span>
          </div>

          <div style="text-align:left; border:1px solid #000; padding:10px; font-size:10px; line-height:1.5; background:#fff;">
  <b style="display:block; border-bottom:1px solid #000; margin-bottom:8px; font-size:11px; background:${bgMap}; color:${txtMap}; padding:2px 5px;">
    CHECKLIST BERKAS (MAP ${labelMap}):
  </b>
  
  <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
    <div style="min-width: 12px; height: 12px; border: 1px solid #000; margin-top: 2px;"></div>
    <span>Membawa <b>Materai 10.000</b> (2 Lembar)</span>
  </div>

  <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
    <div style="min-width: 12px; height: 12px; border: 1px solid #000; margin-top: 2px;"></div>
    <span>FC KK & Akta Kelahiran (2 Lembar) <b>+ Tunjukkan ASLI</b></span>
  </div>

  <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
    <div style="min-width: 12px; height: 12px; border: 1px solid #000; margin-top: 2px;"></div>
    <span>Fotocopy KTP Orang Tua (Ayah & Ibu)</span>
  </div>

  <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
    <div style="min-width: 12px; height: 12px; border: 1px solid #000; margin-top: 2px;"></div>
    <span>Pas Foto 3x4 Background Merah (2 Lembar)</span>
  </div>

  <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 5px;">
    <div style="min-width: 12px; height: 12px; border: 1px solid #000; margin-top: 2px;"></div>
    <span><b>Formulir S1:</b> ${infoS1}</span>
  </div>

  <i style="font-size:9px; color:#ef4444; border-top:1px solid #eee; padding-top:5px; display:block;">*Panitia akan menceklis kotak di atas saat verifikasi berkas asli.</i>
</div>
        </div>

        <div style="margin-top:10px; font-size:9px; text-align:center; color:#666;">
          Dicetak pada: ${new Date().toLocaleDateString('id-ID')} melalui Portal SDN 02 Cibadak
        </div>

        <div class="qr-signature" style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:15px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=65x65&data=LULUS-${noReg}" width="65">
          <div style="text-align:center; width:150px;">
            <p style="font-size:10px; margin-bottom:35px;">Ketua Panitia SPMB,</p>
            <p style="font-weight:bold; font-size:11px; text-decoration:underline;">( SDN 02 CIBADAK )</p>
          </div>
        </div>
      </div>
    </div>

    <div class="no-print" style="margin-top:20px; display:flex; flex-direction:column; gap:10px;">
      <div style="display:flex; gap:10px;">
        ${linkS1.length > 5 ? 
          `<a href="${linkS1.includes('http') ? linkS1 : 'https://' + linkS1}" target="_blank" style="flex:1; background:#1d4ed8; color:white; text-align:center; padding:12px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:12px; display:flex; align-items:center; justify-content:center; gap:5px;">
            <i class="fas fa-file-download"></i> CETAK S1
          </a>` : 
          `<div style="flex:1; padding:10px; border:1px dashed #ccc; border-radius:10px; font-size:10px; color:#666; text-align:center; line-height:1.2;">
            <i class="fas fa-print"></i> S1 Dicetak Sekolah
          </div>`
        }
        <button onclick="window.print()" style="flex:1; background:#10b981; color:white; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; gap:5px;">
          <i class="fas fa-save"></i> SIMPAN PDF
        </button>
      </div>
      <button onclick="kirimWA('${namaAnanda}', '${noReg}')" style="width:100%; background:#25d366; color:white; border:none; padding:15px; border-radius:12px; font-weight:bold; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; gap:8px;">
        <i class="fab fa-whatsapp"></i> KONFIRMASI KE WHATSAPP
      </button>
    </div>
  `;
  // --- LANJUTAN KODE BAPAK ---
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

document.getElementById('mainForm').onsubmit = async function(e) { // Tambah 'async' untuk cek database
  e.preventDefault();
  
  const btn = document.getElementById('btnSelesai');
  
  // PROTEKSI 1: Jika sedang proses, kunci tombol agar tidak kirim ganda
  if (btn.disabled) return; 

  const formCard = document.querySelector('.form-card');
  const namaSiswa = document.getElementsByName('nama')[0].value.toUpperCase();
  const nikSiswa = document.getElementsByName('nik')[0].value;
  const tglDaftar = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const thn = "26"; // Tahun 2026 disingkat
  const elCount = document.getElementById('count-pendaftar');
  const urutan = elCount ? (parseInt(elCount.innerText) + 1).toString().padStart(3, '0') : "001";
  const noReg = "CBD2-" + thn + "-" + urutan; // Hasil: CBD2-26-001

  // Visual Loading
  btn.innerText = "SEDANG VALIDASI DATA...";
  btn.disabled = true;
  btn.style.opacity = "0.7";

  try {
    // PROTEKSI 2: Cek NIK ke Database sekali lagi sebelum benar-benar kirim
    const responCek = await fetch(APPS_URL + "?cek_nik=" + nikSiswa);
    const hasilCek = await responCek.text();
    
    // Jika hasil cek bukan "Tidak Ditemukan", artinya NIK sudah ada
    if (hasilCek !== "Tidak Ditemukan" && !hasilCek.includes("Error")) {
      alert("MAAF!\nNIK " + nikSiswa + " sudah terdaftar sebelumnya.\nSatu NIK hanya boleh digunakan satu kali.");
      btn.innerText = "KIRIM PENDAFTARAN";
      btn.disabled = false;
      btn.style.opacity = "1";
      return; // Berhenti di sini
    }

    // PROSES KIRIM DATA
    btn.innerText = "SEDANG MENGIRIM DATA...";
    let fData = new FormData(this);
    let q = new URLSearchParams(fData).toString();

    fetch(APPS_URL + "?" + q, { method: 'POST', mode: 'no-cors' })
      .then(() => {
        formCard.innerHTML = `
<div style="animation: slideUp 0.5s ease; font-family: 'Inter', 'Segoe UI', sans-serif; color:#1e293b; max-width: 420px; margin: auto; padding: 10px;">
  
  <div style="text-align:center; margin-bottom: 25px;">
    <div style="width: 80px; height: 80px; background: #e7f8f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
      <i class="fas fa-check-double" style="color:#11ba82; font-size:40px;"></i>
    </div>
    <h2 style="margin:0; font-weight:800; font-size:22px; color:#0d8a61;">PENDAFTARAN BERHASIL</h2>
    <p style="font-size:13px; color:#64748b; margin-top:5px;">Data ananda <b style="color:#1e293b;">${namaSiswa}</b> resmi terdaftar.</p>
  </div>

  <div id="print-area" style="background:#ffffff; border: 2px solid #11ba82; padding:25px; border-radius:20px; box-shadow: 0 10px 15px -3px rgba(17, 186, 130, 0.1); position: relative;">
    <div style="text-align:center; border-bottom: 1px dashed #11ba82; padding-bottom:15px; margin-bottom:15px;">
      <i class="fas fa-id-card" style="color:#11ba82; font-size:20px; margin-bottom:8px;"></i>
      <b style="font-size:14px; display:block; text-transform:uppercase; letter-spacing:1px;">TANDA TERIMA PENDAFTARAN</b>
      <span style="font-size:10px; font-weight:700; color:#94a3b8;">SDN 02 CIBADAK - TAHUN 2026</span>
    </div>
    
    <table style="width:100%; font-size:13px; border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0; color:#94a3b8;"><i class="fas fa-hashtag" style="width:18px;"></i> No. Reg</td>
        <td style="padding:6px 0; text-align:right; font-weight:800; color:#11ba82; font-size:15px;">${noReg}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; color:#94a3b8;"><i class="fas fa-user" style="width:18px;"></i> Nama</td>
        <td style="padding:6px 0; text-align:right; font-weight:700;">${namaSiswa}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; color:#94a3b8;"><i class="fas fa-fingerprint" style="width:18px;"></i> NIK</td>
        <td style="padding:6px 0; text-align:right; font-weight:700;">${nikSiswa}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; color:#94a3b8;"><i class="fas fa-calendar-alt" style="width:18px;"></i> Tanggal</td>
        <td style="padding:6px 0; text-align:right; font-weight:700;">${tglDaftar}</td>
      </tr>
    </table>
  </div>

  <div class="no-print" style="margin-top:25px; display: flex; flex-direction: column; gap: 12px;">
      
      <button onclick="window.print()" style="width:100%; background:#11ba82; color:white; border:none; padding:18px; border-radius:15px; font-weight:800; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow: 0 4px 14px 0 rgba(17, 186, 130, 0.39);">
        <i class="fas fa-file-pdf"></i> SIMPAN / PRINT PDF
      </button>

      <div style="background:#fffbea; border:2px dashed #f59e0b; padding:20px 15px; border-radius:15px; text-align:center; margin-top:5px;">
          <b style="color:#b45309; font-size:14px; display:block; margin-bottom:12px;">
              <i class="fas fa-exclamation-circle"></i> TAHAP SELANJUTNYA (WAJIB)
          </b>
          
          <a href="https://chat.whatsapp.com/L2H9qGBUrnnBiRHQm2EpRe?mode=gi_t" target="_blank" style="display:flex; align-items:center; justify-content:center; gap:10px; background:#25d366; color:white; text-decoration:none; padding:16px; border-radius:12px; font-weight:900; font-size:18px; box-shadow:0 6px 20px rgba(37, 211, 102, 0.4); text-transform:uppercase;">
              <i class="fab fa-whatsapp" style="font-size:24px;"></i> WAJIB JOIN GRUP WA
          </a>
          
          <span style="font-size:11px; color:#64748b; display:block; margin-top:10px; line-height:1.4;">
              *Seluruh informasi jadwal tes, pengumuman seleksi, & daftar ulang HANYA dibagikan di grup ini.
          </span>
      </div>

      <button onclick="window.open('https://api.whatsapp.com/send?phone=6281563351528&text=' + encodeURIComponent('*KONFIRMASI PENDAFTARAN ONLINE*\n*SDN 02 CIBADAK - 2026*\n\nAssalamu\'alaikum Warahmatullahi Wabarakatuh,\n\nYth. Panitia SPMB SDN 02 Cibadak,\n\nSaya ingin mengonfirmasi pendaftaran online ananda:\n• Nama: *${namaSiswa.toUpperCase()}*\n• No. Reg: *#${noReg}*\n\nAlhamdulillah pendaftaran telah berhasil. Kami akan menunggu informasi selanjutnya mengenai hasil seleksi melalui portal ini atau grup WhatsApp. Terima kasih.'), '_blank')" style="width:100%; background:#f8fafc; color:#475569; border:1px solid #cbd5e1; padding:14px; border-radius:12px; font-weight:700; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:5px;">
        <i class="fas fa-user-tie" style="font-size:14px;"></i> Konfirmasi ke Panitia (Japri)
      </button>

  </div>

  <div style="margin-top:30px; background:#f8fafc; padding:20px; border-radius:18px; border:1px solid #e2e8f0; text-align:left;">
    <b style="display:flex; align-items:center; gap:10px; margin-bottom:12px; font-size:13px; color:#1e293b;">
      <i class="fas fa-file-alt" style="color:#11ba82;"></i> BERKAS DAFTAR ULANG:
    </b>
    <ul style="font-size:12px; color:#64748b; margin:0; padding-left:20px; line-height:1.8; list-style-type: disc !important;">
      <li style="display: list-item !important;">Membawa Materai 10.000 (2 Lembar)</li>
      <li style="display: list-item !important;">Fotocopy KK & Akta Kelahiran (2 Lembar)</li>
      <li style="display: list-item !important;">Fotocopy KTP Orang Tua (Ayah & Ibu) (2 Lembar)</li>
      <li style="display: list-item !important;">Pas Foto 3x4 Background Merah (2 Lembar)</li>
    </ul>
  </div>

  <button onclick="location.reload()" style="display:block; margin:25px auto 10px; background:none; border:none; color:#94a3b8; cursor:pointer; text-decoration:none; font-size:12px; font-weight:600;">
    <i class="fas fa-sync-alt" style="margin-right:5px;"></i> Daftar Siswa Lain
  </button>
</div>
`;
        window.scrollTo({top: formCard.offsetTop - 50, behavior: 'smooth'});
      })
      .catch((err) => {
        alert("Gagal terhubung ke server. Silakan coba lagi.");
        btn.innerText = "KIRIM PENDAFTARAN";
        btn.disabled = false;
        btn.style.opacity = "1";
      });

  } catch (error) {
    alert("Koneksi bermasalah. Gagal memvalidasi data.");
    btn.innerText = "KIRIM PENDAFTARAN";
    btn.disabled = false;
    btn.style.opacity = "1";
  }
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

// --- 9. REVIEW ---
function updateReview() {
  // Gunakan optional chaining atau pastikan elemen ada sebelum ambil .value
  const n = (document.getElementsByName('nama')[0]?.value || "").toUpperCase();
  const k = document.getElementsByName('nik')[0]?.value || "-";
  const t = (document.getElementsByName('tmpt_lahir')[0]?.value || "").toUpperCase();
  const l = document.getElementsByName('tgl_lahir')[0]?.value || "-";
  const i = (document.getElementsByName('nama_ibu')[0]?.value || "").toUpperCase();
  const w = document.getElementsByName('hp')[0]?.value || "-";
  const a = document.getElementsByName('alamat')[0]?.value || "";
  const r = document.getElementsByName('rt')[0]?.value || "00";
  const rw = document.getElementsByName('rw')[0]?.value || "00";
  const d = document.getElementsByName('desa')[0]?.value || "";

  // Update ke HTML
  if(document.getElementById('rev-nama')) document.getElementById('rev-nama').innerText = n;
  if(document.getElementById('rev-nik')) document.getElementById('rev-nik').innerText = k;
  if(document.getElementById('rev-ttl')) document.getElementById('rev-ttl').innerText = t + ", " + l;
  if(document.getElementById('rev-ibu')) document.getElementById('rev-ibu').innerText = i;
  if(document.getElementById('rev-hp')) document.getElementById('rev-hp').innerText = w;
  if(document.getElementById('rev-alamat')) document.getElementById('rev-alamat').innerText = a + " (RT " + r + " / RW " + rw + "), Desa " + d;
}

// --- 10. KIRIM WA KHUSUS LULUS ---
function kirimWA(nama, noReg) {
  let nomorAdmin = "6287777099842";
  
  // Pesan otomatis yang lebih resmi untuk konfirmasi DAFTAR ULANG
  const pesan = `*KONFIRMASI DAFTAR ULANG SISWA BARU*%0A` +
                `*SDN 02 CIBADAK - TAHUN 2026*%0A%0A` +
                `Assalamu'alaikum Warahmatullahi Wabarakatuh,%0A%0A` +
                `Yth. Panitia SPMB SDN 02 Cibadak,%0A%0A` +
                `Alhamdulillah, ananda *${nama.toUpperCase()}* dengan No. Reg: *%23${noReg}* dinyatakan *LULUS SELEKSI*.%0A%0A` +
                `Melalui pesan ini, kami bermaksud mengonfirmasi bahwa kami akan hadir untuk proses *Daftar Ulang* sesuai jadwal yang tertera di kartu kelulusan sambil membawa kelengkapan berkas fisik.%0A%0A` +
                `Terima kasih.`;
  
  window.open(`https://wa.me/${nomorAdmin}?text=${pesan}`, '_blank');
}

// --- 11. WELCOME ---
function bukaSekarang() {
  var curtain = document.getElementById('welcome-curtain');
  if (curtain) {
    // 1. Jalankan animasi buka
    curtain.classList.add('open');
    
    // 2. Langsung paksa scroll aktif (tanpa nunggu animasi selesai)
    document.documentElement.style.overflow = 'auto'; 
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';

    // 3. Hapus elemen tirai sepenuhnya dari layar setelah animasi selesai
    setTimeout(function() {
      curtain.style.pointerEvents = 'none'; // Agar tidak menghalangi klik meskipun masih transparan
      curtain.style.display = 'none';
      
      // Tambahan: Pastikan posisi balik ke atas
      window.scrollTo(0, 0);
    }, 1000); // Sesuaikan dengan durasi transisi CSS Bapak (misal 1s)
  }
}

// --- 12. JAM ---
setInterval(() => { document.getElementById('jam-server-baru').innerText = new Date().toLocaleTimeString('id-ID').replace(/\./g, ':'); }, 1000);

// --- 13. VALIDASI INPUT REAL-TIME (VERSI REVISI: ANTI-MERAH) ---
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', function() {
    const batas = this.getAttribute('maxlength');
    const namaInput = this.name;
    const nilai = this.value.trim();

    // 1. Bersihkan karakter non-angka khusus kolom tertentu
    if (this.type === 'tel' || namaInput.includes('nik') || namaInput.includes('nisn') || namaInput === 'hp' || this.type === 'number') {
      this.value = this.value.replace(/[^0-9]/g, '');
    }

    // 2. Logika Validasi Warna
    if (batas) {
      // A. KHUSUS NIK & NISN (Wajib PAS jumlah angkanya)
      if (namaInput.includes('nik') || namaInput.includes('nisn')) {
        if (this.value.length == batas) {
          this.classList.add('input-valid');
          this.classList.remove('input-error');
        } else {
          this.classList.remove('input-valid');
          // Jangan langsung merah saat mengetik, merah hanya jika panjangnya salah tapi sudah selesai
        }
      } 
      // B. KHUSUS ANGKA KECIL (Jarak, Saudara, Tinggi, Berat, RT/RW)
      else if (this.type === 'number' || ['rt', 'rw', 'jarak', 'saudara', 'tinggi', 'berat', 'lingkar', 'waktu'].includes(namaInput)) {
        if (nilai.length > 0 && parseInt(nilai) >= 0) {
          this.classList.add('input-valid');
          this.classList.remove('input-error');
        } else {
          this.classList.remove('input-valid');
        }
      }
    } 
    // C. INPUT BIASA (Nama, Alamat, dll)
    else {
      if (nilai.length > 3) {
        this.classList.add('input-valid');
        this.classList.remove('input-error');
      } else {
        this.classList.remove('input-valid');
      }
    }
  });
});

// --- 14. MULAI DAFTAR ---
function mulaiDaftar() {
  document.getElementById('siapkanBerkas').style.display = 'none';
  
  // Me-refresh iframe agar video berhenti dan suara mati
  var iframeVideo = document.getElementById('videoPanduan');
  if (iframeVideo) {
      iframeVideo.src = iframeVideo.src; 
  }
  
  document.getElementById('mainForm').style.display = 'block';
  window.scrollTo({top: document.getElementById('spmb-sultan').offsetTop - 20, behavior: 'smooth'});
}

// --- 15. CETAK STRUK MANDIRI (SESUAI GAMBAR) ---
function paksaCetakStruk() {
  const nikInput = document.getElementsByName('nik')[0];
  const nik = nikInput.value.trim();
  
  if (nik.length < 16) {
    alert("Masukkan 16 digit NIK Ananda terlebih dahulu!");
    nikInput.focus();
    return;
  }

  const btnNext = document.querySelector('#s1 .btn-next');
  const textAsli = btnNext ? btnNext.innerText : "MENCARI...";
  if(btnNext) btnNext.innerText = "MENGAMBIL STRUK...";
  
  fetch(APPS_URL + "?cek_nik=" + nik).then(r => r.text()).then(res => {
    if (res === "Tidak Ditemukan" || res.includes("Error")) {
      alert("NIK ini belum terdaftar. Silakan lanjut isi formulir.");
      if(btnNext) btnNext.innerText = textAsli;
      return;
    }

    let potongan = res.split("|").map(item => item.trim());
    let namaSiswa = potongan[0];
    let tglSekarang = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    let thn = "26";
    let tigaDigitNIK = nik.substring(nik.length - 3);
    let noReg = "CBD2-" + thn + "-" + tigaDigitNIK;

    const formCard = document.querySelector('.form-card');
    formCard.innerHTML = `
      <div style="animation: slideUp 0.5s ease; font-family: 'Inter', sans-serif; max-width: 500px; margin: auto; padding: 10px;">
        
        <div id="print-area" style="background:#ffffff; border: 3px solid #11ba82; padding:30px; border-radius:30px; position:relative;">
            
            <div style="text-align:center; margin-bottom: 20px;">
               <div style="background:#11ba82; width:40px; height:30px; margin:0 auto 10px; border-radius:8px; display:flex; align-items:center; justify-content:center;">
                  <i class="fas fa-id-card" style="color:white; font-size:16px;"></i>
               </div>
               <h2 style="margin:0; font-weight:900; font-size:18px; color:#1e293b; letter-spacing:1px; text-transform:uppercase;">Tanda Terima Pendaftaran</h2>
               <p style="font-size:11px; color:#94a3b8; margin:5px 0 0; font-weight:700; text-transform:uppercase;">SDN 02 Cibadak - Tahun 2026</p>
               <div style="border-bottom: 2px dashed #11ba82; margin-top:15px; opacity:0.3;"></div>
            </div>

            <div style="display:flex; flex-direction:column; gap:15px;">
               <div style="display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:12px; color:#94a3b8;">
                     <i class="fas fa-hashtag" style="width:15px;"></i>
                     <span style="font-weight:600; font-size:14px;">No. Reg</span>
                  </div>
                  <div style="font-weight:900; color:#11ba82; font-size:16px;">${noReg}</div>
               </div>

               <div style="display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:12px; color:#94a3b8;">
                     <i class="fas fa-user" style="width:15px;"></i>
                     <span style="font-weight:600; font-size:14px;">Nama</span>
                  </div>
                  <div style="font-weight:800; color:#1e293b; font-size:14px; text-align:right;">${namaSiswa.toUpperCase()}</div>
               </div>

               <div style="display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:12px; color:#94a3b8;">
                     <i class="fas fa-fingerprint" style="width:15px;"></i>
                     <span style="font-weight:600; font-size:14px;">NIK</span>
                  </div>
                  <div style="font-weight:700; color:#1e293b; font-size:14px;">${nik}</div>
               </div>

               <div style="display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:12px; color:#94a3b8;">
                     <i class="fas fa-calendar-days" style="width:15px;"></i>
                     <span style="font-weight:600; font-size:14px;">Tanggal</span>
                  </div>
                  <div style="font-weight:700; color:#1e293b; font-size:14px;">${tglSekarang}</div>
               </div>
            </div>

        </div>

        <div style="margin-top:25px; display:flex; gap:12px;">
           <button onclick="window.print()" style="flex:2; background:#11ba82; color:white; border:none; padding:15px; border-radius:15px; font-weight:800; cursor:pointer; font-size:13px; box-shadow: 0 4px 14px 0 rgba(17, 186, 130, 0.39);">CETAK STRUK</button>
           <button onclick="location.reload()" style="flex:1; background:#f1f5f9; color:#64748b; border:none; padding:15px; border-radius:15px; font-weight:700; cursor:pointer; font-size:13px;">KEMBALI</button>
        </div>
      </div>
    `;
    if(btnNext) btnNext.innerText = textAsli;
  });
}

// --- 16. SISTEM FAB CIRCULAR, STATISTIK, & MODAL WA ---

var liveCounterInterval; 

// 1. Fungsi Buka/Tutup Menu FAB (Animasi Melingkar)
function toggleFab() {
    var wrapper = document.getElementById('fabWrapper');
    if (wrapper) {
        wrapper.classList.toggle('active');
        if (window.navigator.vibrate) window.navigator.vibrate(10);
    }
}

// 2. Fungsi Simulasi Orang Mengisi Form
function updateLiveCounter() {
    var el = document.getElementById('live-typing');
    if (el) {
        var orang = Math.floor(Math.random() * (6 - 2 + 1)) + 2;
        el.innerText = orang + " ORANG SEDANG MENGISI FORM...";
    }
}

// 3. Fungsi Ambil Data dari Google Sheets (PPDB) - VERSI FINAL 1X REQUEST
function muatDataPPDB() {
  fetch(APPS_URL)
    .then(r => r.text())
    .then(res => {
      var d = res.split("|");
      var total = parseInt(d[0]) || 0;
      var l = d[1] || 0;
      var p = d[2] || 0;
      var saklar = (d[3] || "OFF").trim();

      // Hapus Loader Awal
      var loader = document.getElementById('initial-loader');

      // --- JIKA SAKLAR ON: TAMPILKAN HALAMAN MAINTENANCE MEWAH ---
      if (saklar === "ON") {
        if(loader) loader.style.display = 'none'; 
        
        document.body.innerHTML = `
          <div class="spotlight"></div>
          <div class="grid-bg"></div>
          <div class="main-content">
              <div class="status-badge animate-up delay-1"><span class="status-dot"></span> Official SPMB 2026</div>
              <h1 class="animate-up delay-2">PORTAL</h1>
              <div class="coming-soon animate-up delay-3">SEGERA DIBUKA</div>
              <p class="system-status animate-up delay-4">
                  Penerimaan Siswa Baru <b>SDN 02 Cibadak</b> segera dibuka. Kami sedang menyiapkan sistem pendaftaran terbaik untuk kemudahan Bapak/Ibu sekalian.
              </p>
              <div class="info-box animate-up delay-5">
                  <a href="https://www.sdn02cibadak.sch.id/" class="info-item" target="_blank">🌐 WEB RESMI</a>
                  <a href="https://wa.me/6281563351528" class="info-item">✉️ HUBUNGI</a>
              </div>
          </div>
          <footer class="animate-up delay-5">
              <div class="footer-grid">
                  <div>AUTHORIZED BY: OPS SDN 02 CIBADAK</div>
                  <div>SDN 02 CIBADAK - KAB. SUKABUMI</div>
              </div>
          </footer>
        `;

        var style = document.createElement('style');
        style.innerHTML = `
          :root { --bg: #030308; --accent: #0ea5e9; --text: #f8fafc; }
          body { background-color: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; height: 100vh; width: 100vw; overflow: hidden; position: relative; margin:0; display:flex; align-items:center; justify-content:center;}
          .spotlight { position: fixed; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), rgba(14, 165, 233, 0.12), transparent 80%); }
          .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(14, 165, 233, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.05) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(circle at center, black 20%, transparent 80%); -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 80%); z-index: 1; animation: gridMove 20s linear infinite; }
          @keyframes gridMove { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(50px) translateX(50px); } }
          .main-content { position: relative; z-index: 10; text-align: center; width: 100%; max-width: 900px; padding: 20px; }
          .status-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(14, 165, 233, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(14, 165, 233, 0.3); padding: 8px 22px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--accent); margin-bottom: 25px; }
          .status-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); } 100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); } }
          h1 { font-size: clamp(3.5rem, 12vw, 8rem); font-weight: 900; letter-spacing: -3px; text-transform: uppercase; line-height: 0.9; margin: 0; background: linear-gradient(180deg, #ffffff 30%, #64748b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .coming-soon { font-size: clamp(1.2rem, 4vw, 2.8rem); font-weight: 800; color: transparent; -webkit-text-stroke: 1.5px var(--accent); letter-spacing: 10px; text-transform: uppercase; margin: 15px 0 30px; }
          .system-status { color: #94a3b8; font-size: 16px; max-width: 550px; margin: 0 auto 40px; line-height: 1.7; }
          .info-box { display: flex; justify-content: center; gap: 15px; }
          .info-item { text-decoration: none; color: var(--text); font-size: 12px; font-weight: 700; padding: 14px 28px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; transition: 0.4s; }
          .info-item:hover { border-color: var(--accent); background: rgba(14, 165, 233, 0.1); transform: translateY(-5px); }
          footer { position: absolute; bottom: 30px; width: 100%; padding: 0 40px; box-sizing: border-box; }
          .footer-grid { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; color: #64748b; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }
          @media (max-width: 600px) { .footer-grid { flex-direction: column; gap: 10px; text-align: center; } }
        `;
        document.head.appendChild(style);

        let spotlightX = window.innerWidth / 2; let spotlightY = window.innerHeight / 2;
        window.addEventListener('mousemove', (e) => {
          document.documentElement.style.setProperty('--x', e.clientX + 'px');
          document.documentElement.style.setProperty('--y', e.clientY + 'px');
        });
        
        return; 
      }

      // --- JIKA SAKLAR OFF: BUKA PENDAFTARAN NORMAL ---
      if(loader) loader.style.display = 'none'; 
      
      document.getElementById('welcome-curtain').style.setProperty('display', 'flex', 'important');
      document.getElementById('spmb-sultan').style.setProperty('display', 'block', 'important');
      var fab = document.querySelector('.fab-container');
      if(fab) fab.style.setProperty('display', 'block', 'important');

      // --- LOGIKA UPDATE KUOTA & ANGKA DASHBOARD ---
      var maxKuota = 72; 
      var sisa = maxKuota - total;
      var persen = (total / maxKuota) * 100;

      // Update Angka di UI
      if (document.getElementById('count-pendaftar')) document.getElementById('count-pendaftar').innerText = total;
      if (document.getElementById('count-sisa')) document.getElementById('count-sisa').innerText = (sisa <= 0 ? 0 : sisa);
      if (document.getElementById('st-total')) document.getElementById('st-total').innerText = total;
      if (document.getElementById('st-l')) document.getElementById('st-l').innerText = l;
      if (document.getElementById('st-p')) document.getElementById('st-p').innerText = p;

      // Update Progress Bar Kuota
      var bar = document.getElementById('bar-kuota');
      if (bar) bar.style.width = (persen > 100 ? 100 : persen) + "%";

      // Update Label Kuota
      var statusTxt = document.getElementById('status-kuota');
      if (statusTxt) {
          if (sisa <= 0) {
              statusTxt.innerText = "KUOTA PENUH";
              statusTxt.style.color = "#ff4d4d";
          } else {
              statusTxt.innerText = "KUOTA TERSEDIA";
              statusTxt.style.color = "#2ecc71";
          }
      }

      // --- LOGIKA JIKA KUOTA HABIS: BLOKIR FORM ---
      if (sisa <= 0) {
          if (typeof kuotaHabis !== 'undefined') kuotaHabis = true;
          
          const pg = document.querySelector('.progress-container');
          if (pg) pg.style.display = 'none';

          const formCard = document.querySelector('.form-card');
          if (formCard) {
              formCard.innerHTML = `
                  <div style="padding: 50px 20px; text-align: center; font-family: 'Inter', sans-serif; animation: slideUp 0.4s ease-out;">
                      <div style="width: 80px; height: 80px; background: #fff5f5; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; border: 2px solid #feb2b2;">
                          <i class="fas fa-ban" style="color: #e53e3e; font-size: 35px;"></i>
                      </div>
                      <h2 style="font-size: 24px; font-weight: 900; color: #1a202c; margin: 0 0 10px 0; letter-spacing: -0.5px;">KUOTA PENUH / DITUTUP</h2>
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 auto 35px; max-width: 340px;">
                          Mohon maaf, pendaftaran <b>SPMB SDN 02 CIBADAK</b> saat ini telah mencapai batas kuota maksimal atau pendaftaran telah resmi ditutup.
                      </p>
                      <a href="https://api.whatsapp.com/send?phone=6281563351528&text=Halo%20Panitia%20SPMB%20SDN%2002%20Cibadak" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; background: #25d366; color: white; padding: 18px 30px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(37, 211, 102, 0.25);">
                          <i class="fab fa-whatsapp" style="font-size: 20px;"></i> HUBUNGI PANITIA SPMB
                      </a>
                  </div>
              `;
          }
      }
    })
    .catch(err => {
       console.error("Gagal Muat:", err);
       var loaderText = document.querySelector('.loader-text');
       if(loaderText) loaderText.innerText = "KONEKSI BERMASALAH. REFRESH HALAMAN.";
    });
}

// 4. Fungsi Buka Modal Statistik
function bukaStatistik() {
    var modal = document.getElementById('modal-stat');
    if (modal) {
        modal.style.display = 'block';
        updateLiveCounter();
        if (!liveCounterInterval) {
            liveCounterInterval = setInterval(updateLiveCounter, 8000);
        }
        muatDataPPDB();
        var wrapper = document.getElementById('fabWrapper');
        if (wrapper) wrapper.classList.remove('active');
    }
}

// 5. Fungsi Tutup Modal Statistik
function tutupStatistik() {
    var modal = document.getElementById('modal-stat');
    if (modal) {
        modal.style.display = 'none';
        if (liveCounterInterval) {
            clearInterval(liveCounterInterval);
            liveCounterInterval = null;
        }
    }
}

// --- FUNGSI MODAL WHATSAPP ---

// 6. Fungsi Buka Modal WA
function bukaModalWA() {
    var modalWA = document.getElementById('modal-wa');
    var txt = document.getElementById('pesanWA');
    if (modalWA) {
        modalWA.style.display = 'block';
        
        // Cek jika kosong, isi teks default tanpa spasi di awal
        if (txt && txt.value.trim() === "") {
            txt.value = "Halo Panitia SPMB SDN 02 Cibadak, saya ingin bertanya mengenai...";
        }
        
        // Tambahkan ini: Auto-fokus agar user langsung bisa ngetik
        setTimeout(function() { if(txt) txt.focus(); }, 100);
        
        var wrapper = document.getElementById('fabWrapper');
        if (wrapper) wrapper.classList.remove('active');
    }
}

// 7. Fungsi Tutup Modal WA
function tutupModalWA() {
    var modalWA = document.getElementById('modal-wa');
    if (modalWA) modalWA.style.display = 'none';
}

// 8. Fungsi Kirim ke WA (Versi Paling Stabil & Private)
function kirimKeWA() {
    var pesan = document.getElementById('pesanWA').value;
    var nomor = "6287777099842"; // <-- PASTIKAN NOMOR SUDAH BENAR (628...)
    
    if (pesan.trim() === "") {
        alert("Pesan tidak boleh kosong");
        return;
    }
    
    // Kita ganti api.whatsapp.com dengan wa.me (lebih pendek, resmi, dan jarang error SSL)
    var url = "https://wa.me/" + nomor + "?text=" + encodeURIComponent(pesan);
    
    // Membuka di tab baru
    window.open(url, '_blank');
    
    tutupModalWA();
}

// 9. Inisialisasi Event Listeners
window.addEventListener('load', function() {
    muatDataPPDB();
    
    window.addEventListener('click', function(event) {
        var modalStat = document.getElementById('modal-stat');
        var modalWA = document.getElementById('modal-wa');
        var fabWrapper = document.getElementById('fabWrapper');

        // A. Tutup Modal Statistik (Klik di area overlay gelap)
        if (event.target == modalStat) {
            tutupStatistik();
        }
        
        // B. TUTUP MODAL WA (Jika klik di mana saja kecuali di dalam kotaknya)
        if (modalWA && modalWA.style.display === 'block') {
            // Cek: Apakah yang diklik BUKAN bagian dari modal-wa DAN BUKAN tombol pemicunya?
            var diklikDiDalamModal = modalWA.contains(event.target);
            var diklikDiTombolWA = event.target.closest('.item-1');
            
            if (!diklikDiDalamModal && !diklikDiTombolWA) {
                tutupModalWA();
            }
        }
        
        // C. Tutup menu FAB melingkar jika klik di luar area FAB
        if (fabWrapper && !fabWrapper.contains(event.target)) {
            if (fabWrapper.classList.contains('active')) {
                fabWrapper.classList.remove('active');
            }
        }
    });
});

// --- AUTO UPDATE DATA (POLLING SETIAP 30 DETIK) ---
// Supaya angka di header update sendiri tanpa refresh
setInterval(function() {
    fetch(APPS_URL)
        .then(r => r.text())
        .then(res => {
            var d = res.split("|");
            var total = parseInt(d[0]) || 0;
            var maxKuota = 72; 
            var sisa = maxKuota - total;

            // Update Angka di Header/Dashboard secara live
            var elPendaftar = document.getElementById('count-pendaftar');
            var elSisa = document.getElementById('count-sisa');
            var bar = document.getElementById('bar-kuota');

            if (elPendaftar) elPendaftar.innerText = total;
            if (elSisa) elSisa.innerText = (sisa <= 0 ? 0 : sisa);
            if (bar) bar.style.width = ((total / maxKuota) * 100) + "%";
            
            // Opsional: Update status teks jika penuh di tengah jalan
            var statusTxt = document.getElementById('status-kuota');
            if (statusTxt) {
                if (sisa <= 0) {
                    statusTxt.innerText = "KUOTA PENUH";
                    statusTxt.style.color = "#ff4d4d";
                } else {
                    statusTxt.innerText = "KUOTA TERSEDIA";
                    statusTxt.style.color = "#2ecc71";
                }
            }
        })
        .catch(err => console.log("Background auto-update gagal:", err));
}, 30000); // 30000 ms = 30 detik