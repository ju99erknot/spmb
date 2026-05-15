import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SCHOOL_NAME = "SDN 02 Cibadak";
const SCHOOL_YEAR = "2026/2027";
const SCHOOL_ADDRESS = "Jl. Kebon Pala 2 Cibadak, Kabupaten Sukabumi, Jawa Barat";
const PORTAL_URL = "spmb.sdn02cibadak.sch.id";

const BASE_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #f1f5f9; font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; }
  </style>
`;

function buildHeader(emoji: string, title: string): string {
  return `
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%); text-align: center; padding: 40px 30px 35px;">
        <div style="display:inline-block; background:rgba(255,255,255,0.18); border:2px solid rgba(255,255,255,0.35); border-radius:50%; width:76px; height:76px; line-height:76px; font-size:38px; margin-bottom:14px;">${emoji}</div>
        <h1 style="color:#ffffff; font-size:21px; font-weight:800; letter-spacing:0.5px; margin:0 0 5px;">${title}</h1>
        <p style="color:#eab308; font-size:12px; font-weight:700; letter-spacing:2px; margin:0 0 3px; text-transform:uppercase;">${SCHOOL_NAME}</p>
        <p style="color:rgba(255,255,255,0.75); font-size:11px; margin:0;">Tahun Ajaran ${SCHOOL_YEAR}</p>
      </td>
    </tr>`;
}

function buildFooter(): string {
  return `
    <tr>
      <td style="background:#f8fafc; padding:22px 30px; border-top:1px solid #e2e8f0; text-align:center;">
        <div style="display:inline-block; background:linear-gradient(135deg,#059669,#10b981); border-radius:8px; padding:7px 18px; margin-bottom:12px;">
          <span style="color:white; font-size:11px; font-weight:700; letter-spacing:1px;">SDN 02 CIBADAK</span>
        </div>
        <p style="color:#94a3b8; font-size:11px; margin:0 0 4px;">${SCHOOL_ADDRESS}</p>
        <p style="color:#cbd5e1; font-size:10px; margin:0 0 10px;">Email ini dikirim otomatis oleh sistem SPMB. Mohon tidak membalas email ini.</p>
        <p style="color:#e2e8f0; font-size:10px; margin:0;">
          Developed by <a href="https://www.ju99erknot.my.id/" target="_blank" style="color:#10b981; text-decoration:none; font-weight:600;">@ju99erknot</a>
        </p>
      </td>
    </tr>`;
}

function buildStudentCard(nama: string, badgeBg: string, badgeColor: string, badgeText: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border:2px solid #e2e8f0; border-radius:16px; margin:0 0 22px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden;">
      <tr><td style="background:linear-gradient(90deg,#f0fdf4,#dcfce7); height:4px; padding:0;"></td></tr>
      <tr><td style="padding:20px 24px;">
        <p style="color:#94a3b8; font-size:10px; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 5px; font-weight:600;">Nama Calon Peserta Didik</p>
        <p style="color:#1e293b; font-size:20px; font-weight:800; margin:0 0 14px; letter-spacing:0.3px;">${nama}</p>
        <div style="border-top:1px dashed #e2e8f0; padding-top:12px;">
          <span style="background:${badgeBg}; color:${badgeColor}; padding:7px 16px; border-radius:24px; font-size:12px; font-weight:700; letter-spacing:0.3px; display:inline-block;">${badgeText}</span>
        </div>
      </td></tr>
    </table>`;
}

function buildInfoBox(icon: string, title: string, content: string, bg: string, borderColor: string, textColor: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg}; border-left:4px solid ${borderColor}; border-radius:0 10px 10px 0; margin:0 0 22px;">
      <tr><td style="padding:14px 18px;">
        <p style="color:${textColor}; font-size:13px; margin:0; line-height:1.7;">
          <strong>${icon} ${title}</strong><br>${content}
        </p>
      </td></tr>
    </table>`;
}

function buildGreeting(namaOrtu: string): string {
  return `
    <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 18px;">
      Assalamu'alaikum Wr. Wb.<br><br>
      Yth. Bapak/Ibu <strong style="color:#1e293b;">${namaOrtu}</strong>,
    </p>`;
}

function buildClosing(extra: string = ""): string {
  return `
    <p style="color:#475569; font-size:15px; line-height:1.8; margin:0;">
      ${extra}Wassalamu'alaikum Wr. Wb.<br><br>
      <strong style="color:#1e293b;">Panitia SPMB ${SCHOOL_NAME}</strong>
    </p>`;
}

function wrapEmail(content: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${BASE_STYLES}
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9; padding:28px 14px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,0.09);">
      ${content}
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────

function emailTahap2(nama: string, namaOrtu: string): { subject: string; html: string } {
  const body = `
    ${buildHeader("📋", "BERKAS DIVERIFIKASI")}
    <tr><td style="padding:32px 28px;">
      ${buildGreeting(namaOrtu)}
      <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 20px;">
        Kami dengan senang hati memberitahukan bahwa berkas pendaftaran putra/putri Bapak/Ibu:
      </p>
      ${buildStudentCard(nama, "#dcfce7", "#059669", "✅ STATUS: TAHAP 2 — VERIFIKASI BERKAS")}
      <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 20px;">
        telah <strong style="color:#059669;">berhasil diverifikasi</strong> oleh panitia SPMB dan kini memasuki <strong>Tahap 2</strong>. Silakan menunggu pengumuman hasil seleksi akhir.
      </p>
      ${buildInfoBox("ℹ️", "Informasi Selanjutnya:", `Pantau terus status pendaftaran melalui portal SPMB di <strong>${PORTAL_URL}</strong>. Pengumuman seleksi akhir akan segera diinformasikan.`, "#eff6ff", "#3b82f6", "#1e40af")}
      ${buildClosing("Terima kasih atas kepercayaan Bapak/Ibu.<br><br>")}
    </td></tr>
    ${buildFooter()}`;

  return {
    subject: `✅ Berkas Terverifikasi — ${nama} | SPMB ${SCHOOL_NAME} ${SCHOOL_YEAR}`,
    html: wrapEmail(body),
  };
}

function emailDiterima(nama: string, namaOrtu: string): { subject: string; html: string } {
  const body = `
    ${buildHeader("🎓", "SELAMAT! PESERTA DITERIMA")}
    <tr><td style="padding:32px 28px;">
      ${buildGreeting(namaOrtu)}
      <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 20px;">
        Dengan penuh rasa syukur, kami menyampaikan kabar gembira bahwa putra/putri Bapak/Ibu:
      </p>
      ${buildStudentCard(nama, "#dcfce7", "#059669", "🎉 DITERIMA SEBAGAI PESERTA DIDIK BARU")}
      <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 20px;">
        telah resmi <strong style="color:#059669;">DITERIMA</strong> sebagai Calon Peserta Didik Baru di <strong style="color:#1e293b;">${SCHOOL_NAME}</strong> Tahun Ajaran ${SCHOOL_YEAR}. Ini merupakan awal dari perjalanan pendidikan yang luar biasa!
      </p>
      ${buildInfoBox("⚠️", "Tindak Lanjut — Daftar Ulang:", "Silakan lakukan <strong>daftar ulang</strong> sesuai jadwal yang ditetapkan dengan membawa seluruh berkas fisik. Informasi lebih lanjut dapat dilihat di portal SPMB.", "#fefce8", "#eab308", "#854d0e")}
      ${buildInfoBox("📱", "Cek Status Online:", `Pantau informasi terbaru di <strong>${PORTAL_URL}</strong>`, "#f0fdf4", "#10b981", "#065f46")}
      ${buildClosing("Selamat dan semoga putra/putri Bapak/Ibu sukses dalam menempuh pendidikan.<br><br>")}
    </td></tr>
    ${buildFooter()}`;

  return {
    subject: `🎉 SELAMAT! ${nama} DITERIMA di ${SCHOOL_NAME} — SPMB ${SCHOOL_YEAR}`,
    html: wrapEmail(body),
  };
}

function emailDitolak(nama: string, namaOrtu: string): { subject: string; html: string } {
  const body = `
    ${buildHeader("📢", "PENGUMUMAN HASIL SELEKSI")}
    <tr><td style="padding:32px 28px;">
      ${buildGreeting(namaOrtu)}
      <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 20px;">
        Setelah melalui proses seleksi yang ketat, dengan penuh hormat kami sampaikan bahwa:
      </p>
      ${buildStudentCard(nama, "#f1f5f9", "#64748b", "📋 Belum Dapat Diterima pada Seleksi Ini")}
      <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 20px;">
        <strong style="color:#1e293b;">${nama}</strong> belum dapat kami terima sebagai peserta didik baru di <strong style="color:#1e293b;">${SCHOOL_NAME}</strong> untuk Tahun Ajaran ${SCHOOL_YEAR}. Keputusan ini didasarkan pada pertimbangan berikut:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa; border:1px solid #e2e8f0; border-radius:12px; margin:0 0 22px;">
        <tr><td style="padding:18px 20px;">
          <p style="color:#475569; font-size:13px; margin:0 0 10px; font-weight:700; color:#1e293b;">Kemungkinan penyebab:</p>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:5px 0; color:#64748b; font-size:13px; line-height:1.7;">
                🏠 <strong>Zonasi</strong> — Jarak tempat tinggal di luar radius prioritas penerimaan
              </td>
            </tr>
            <tr>
              <td style="padding:5px 0; color:#64748b; font-size:13px; line-height:1.7;">
                👥 <strong>Kuota penuh</strong> — Jumlah pendaftar melebihi kapasitas yang tersedia
              </td>
            </tr>
            <tr>
              <td style="padding:5px 0; color:#64748b; font-size:13px; line-height:1.7;">
                📋 <strong>Prioritas seleksi</strong> — Calon lain memiliki nilai prioritas lebih tinggi
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
      ${buildInfoBox("💙", "Pesan dari Kami:", "Kami sangat mengapresiasi antusias dan kepercayaan Bapak/Ibu dalam mendaftarkan putra/putri di ${SCHOOL_NAME}. Semoga mendapatkan tempat terbaik di sekolah lain dan sukses selalu dalam perjalanan pendidikannya.", "#eff6ff", "#3b82f6", "#1e40af")}
      ${buildInfoBox("📞", "Informasi Lebih Lanjut:", "Untuk pertanyaan mengenai hasil seleksi, Bapak/Ibu dapat menghubungi pihak sekolah secara langsung atau melalui portal SPMB.", "#f8fafc", "#94a3b8", "#475569")}
      ${buildClosing("Terima kasih atas pengertian dan kepercayaan Bapak/Ibu.<br><br>")}
    </td></tr>
    ${buildFooter()}`;

  return {
    subject: `📢 Pengumuman Hasil Seleksi SPMB — ${nama} | ${SCHOOL_NAME}`,
    html: wrapEmail(body),
  };
}


function getEmailHTML(status: string, nama: string, namaOrtu: string): { subject: string; html: string } {
  if (status === "Tahap 2") return emailTahap2(nama, namaOrtu);
  if (status === "Diterima") return emailDiterima(nama, namaOrtu);
  if (status === "Ditolak") return emailDitolak(nama, namaOrtu);
  return {
    subject: `📋 Update Status — ${nama} | SPMB ${SCHOOL_NAME}`,
    html: `<p>Status pendaftaran ${nama} telah diubah menjadi: ${status}</p>`,
  };
}

// ─────────────────────────────────────────────
// API ROUTE HANDLERS
// ─────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nama, namaOrtu, status } = body;

    if (!email || !nama || !status) {
      return Response.json(
        { error: "Missing required fields: email, nama, status" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!["Tahap 2", "Diterima", "Ditolak"].includes(status)) {
      return Response.json(
        { message: "No email sent for this status" },
        { status: 200, headers: corsHeaders }
      );
    }

    const { subject, html } = getEmailHTML(status, nama, namaOrtu || "Orang Tua/Wali");

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || `SPMB ${SCHOOL_NAME} <onboarding@resend.dev>`,
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    return Response.json({ success: true, id: data?.id }, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Email API error:", message);
    return Response.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

// CORS preflight for cross-origin calls from ops.xml (Blogger)
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
