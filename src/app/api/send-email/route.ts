import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates for each status
function getEmailHTML(
  status: string,
  nama: string,
  namaOrtu: string
): { subject: string; html: string } {
  const schoolName = "SDN 02 Cibadak";
  const year = "2026/2027";

  if (status === "Tahap 2") {
    return {
      subject: `✅ Berkas Terverifikasi — ${nama} | SPMB ${schoolName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#059669,#10b981,#34d399);padding:40px 30px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">📋</div>
      <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px;font-weight:800;letter-spacing:0.5px;">BERKAS TERVERIFIKASI</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:13px;margin:0;letter-spacing:1px;">SPMB ${schoolName} — T.A. ${year}</p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:35px 30px;">
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Assalamu'alaikum Wr. Wb.<br><br>
        Yth. Bapak/Ibu <b>${namaOrtu}</b>,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 25px;">
        Dengan ini kami informasikan bahwa berkas pendaftaran atas nama:
      </p>
      <!-- Info Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;margin:0 0 25px;">
        <tr>
          <td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#6b7280;font-size:12px;padding:6px 0;text-transform:uppercase;letter-spacing:1px;">Nama Calon Peserta Didik</td>
              </tr>
              <tr>
                <td style="color:#059669;font-size:20px;font-weight:800;padding:0 0 12px;letter-spacing:0.5px;">${nama}</td>
              </tr>
              <tr>
                <td style="padding:12px 0 0;border-top:1px dashed #bbf7d0;">
                  <span style="background:#dcfce7;color:#059669;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;">📌 Status: TAHAP 2 — VERIFIKASI BERKAS</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        telah <b style="color:#059669;">berhasil diverifikasi</b> oleh panitia SPMB dan masuk ke <b>Tahap 2</b>. Silakan menunggu pengumuman selanjutnya mengenai hasil seleksi akhir.
      </p>
      <!-- Info Box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;margin:0 0 25px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="color:#1e40af;font-size:13px;margin:0;line-height:1.6;">
              <b>ℹ️ Informasi:</b><br>
              Anda dapat mengecek status pendaftaran kapan saja melalui portal SPMB online kami.
            </p>
          </td>
        </tr>
      </table>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
        Terima kasih atas kepercayaan Bapak/Ibu.<br><br>
        Wassalamu'alaikum Wr. Wb.
      </p>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:24px 30px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0 0 4px;">Panitia SPMB ${schoolName}</p>
      <p style="color:#d1d5db;font-size:10px;margin:0;">Email ini dikirim otomatis oleh sistem. Mohon tidak membalas email ini.</p>
    </td>
  </tr>
</table>
</body>
</html>`,
    };
  }

  if (status === "Diterima") {
    return {
      subject: `🎉 SELAMAT! ${nama} DITERIMA — SPMB ${schoolName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#059669,#10b981,#34d399);padding:40px 30px;text-align:center;">
      <div style="font-size:56px;margin-bottom:12px;">🎉</div>
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;font-weight:900;letter-spacing:1px;">SELAMAT! DITERIMA</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:13px;margin:0;letter-spacing:1px;">SPMB ${schoolName} — T.A. ${year}</p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:35px 30px;">
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Assalamu'alaikum Wr. Wb.<br><br>
        Yth. Bapak/Ibu <b>${namaOrtu}</b>,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 25px;">
        Dengan penuh rasa syukur, kami sampaikan bahwa putra/putri Bapak/Ibu:
      </p>
      <!-- Info Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;border-radius:12px;margin:0 0 25px;">
        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#6b7280;font-size:12px;padding:6px 0;text-transform:uppercase;letter-spacing:1px;">Nama Calon Peserta Didik</td>
              </tr>
              <tr>
                <td style="color:#047857;font-size:22px;font-weight:900;padding:0 0 16px;letter-spacing:0.5px;">${nama}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;border-top:2px dashed #86efac;text-align:center;">
                  <span style="background:#059669;color:#ffffff;padding:10px 24px;border-radius:24px;font-size:14px;font-weight:800;letter-spacing:1px;display:inline-block;">🎓 DITERIMA</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        telah <b style="color:#059669;">DITERIMA</b> sebagai calon peserta didik baru di <b>${schoolName}</b> Tahun Ajaran ${year}.
      </p>
      <!-- Action Required -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border-left:4px solid #eab308;border-radius:0 8px 8px 0;margin:0 0 25px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="color:#854d0e;font-size:13px;margin:0;line-height:1.7;">
              <b>⚠️ Langkah Selanjutnya:</b><br>
              Silakan lakukan <b>daftar ulang</b> sesuai jadwal yang telah ditentukan dengan membawa berkas fisik yang diperlukan. Informasi lebih lanjut akan disampaikan melalui portal SPMB.
            </p>
          </td>
        </tr>
      </table>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
        Selamat dan terima kasih atas kepercayaan Bapak/Ibu.<br><br>
        Wassalamu'alaikum Wr. Wb.
      </p>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:24px 30px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0 0 4px;">Panitia SPMB ${schoolName}</p>
      <p style="color:#d1d5db;font-size:10px;margin:0;">Email ini dikirim otomatis oleh sistem. Mohon tidak membalas email ini.</p>
    </td>
  </tr>
</table>
</body>
</html>`,
    };
  }

  if (status === "Ditolak") {
    return {
      subject: `📢 Pengumuman Hasil Seleksi — ${nama} | SPMB ${schoolName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fef2f2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#64748b,#475569,#334155);padding:40px 30px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">📢</div>
      <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px;font-weight:800;">PENGUMUMAN HASIL SELEKSI</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:13px;margin:0;letter-spacing:1px;">SPMB ${schoolName} — T.A. ${year}</p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:35px 30px;">
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Assalamu'alaikum Wr. Wb.<br><br>
        Yth. Bapak/Ibu <b>${namaOrtu}</b>,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 25px;">
        Setelah melalui proses seleksi, dengan berat hati kami sampaikan bahwa:
      </p>
      <!-- Info Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:12px;margin:0 0 25px;">
        <tr>
          <td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#6b7280;font-size:12px;padding:6px 0;text-transform:uppercase;letter-spacing:1px;">Nama Calon Peserta Didik</td>
              </tr>
              <tr>
                <td style="color:#374151;font-size:20px;font-weight:800;padding:0 0 12px;letter-spacing:0.5px;">${nama}</td>
              </tr>
              <tr>
                <td style="padding:12px 0 0;border-top:1px dashed #e5e7eb;">
                  <span style="background:#fee2e2;color:#dc2626;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;">Belum Dapat Diterima</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        <b>belum dapat diterima</b> sebagai peserta didik baru di ${schoolName} untuk Tahun Ajaran ${year}. Keputusan ini diambil berdasarkan pertimbangan kuota dan kriteria seleksi yang berlaku.
      </p>
      <!-- Encouragement -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;margin:0 0 25px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="color:#1e40af;font-size:13px;margin:0;line-height:1.6;">
              <b>💙 Pesan dari Kami:</b><br>
              Kami mengapresiasi ketertarikan Bapak/Ibu terhadap ${schoolName}. Semoga putra/putri Bapak/Ibu mendapatkan tempat terbaik di sekolah lain dan sukses selalu dalam pendidikannya.
            </p>
          </td>
        </tr>
      </table>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
        Terima kasih atas pengertian dan kepercayaan Bapak/Ibu.<br><br>
        Wassalamu'alaikum Wr. Wb.
      </p>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:24px 30px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0 0 4px;">Panitia SPMB ${schoolName}</p>
      <p style="color:#d1d5db;font-size:10px;margin:0;">Email ini dikirim otomatis oleh sistem. Mohon tidak membalas email ini.</p>
    </td>
  </tr>
</table>
</body>
</html>`,
    };
  }

  // Default fallback (Tahap 1 — no email needed normally)
  return {
    subject: `📋 Update Status Pendaftaran — ${nama} | SPMB ${schoolName}`,
    html: `<p>Status pendaftaran ${nama} telah diubah menjadi: ${status}</p>`,
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nama, namaOrtu, status } = body;

    // Validate required fields
    if (!email || !nama || !status) {
      return Response.json(
        { error: "Missing required fields: email, nama, status" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Only send for Tahap 2, Diterima, Ditolak
    if (!["Tahap 2", "Diterima", "Ditolak"].includes(status)) {
      return Response.json(
        { message: "No email sent for this status" },
        { status: 200, headers: corsHeaders }
      );
    }

    const { subject, html } = getEmailHTML(
      status,
      nama,
      namaOrtu || "Orang Tua/Wali"
    );

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "SPMB SDN 02 Cibadak <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    return Response.json({ success: true, id: data?.id }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("Email API error:", err);
    return Response.json(
      { error: err?.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// CORS preflight for cross-origin calls from ops.xml (Blogger)
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

