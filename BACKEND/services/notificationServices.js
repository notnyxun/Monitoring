const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const TO_EMAIL = process.env.RESEND_TO_EMAIL;

/* Sementara, belum benar-benar kirim API Wangsaff (ini belum disambungin ke frontend). */
async function sendStatusNotification(payload) {
  console.log(`[STUB NOTIFIKASI] AP "${payload.nama}" (${payload.ip_address}) -> ${payload.status.toUpperCase()} pada ${payload.waktu}`);
  return { success: true };
}

/* Kirim email notifikasi AP OFFLINE lewat Resend. Hanya dipakai untuk status offline (kembali online tidak perlu). */
async function sendOfflineEmail({ id_ap, nama, ip_address, lokasi, waktu }) {
  if (!TO_EMAIL) {
    console.error('[RESEND] RESEND_TO_EMAIL belum diset di .env, email tidak dikirim.');
    return { success: false, error: 'RESEND_TO_EMAIL tidak diset' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `[ALERT] AP ${nama} OFFLINE`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color:#111;">
          <h2 style="color:#dc2626; margin-bottom: 4px;">Access Point Offline</h2>
          <p style="color:#555; margin-top: 0;">Salah satu access point terpantau tidak merespon ping.</p>
          <table cellpadding="6" style="border-collapse: collapse; margin-top: 12px;">
            <tr><td><b>ID AP</b></td><td>${id_ap}</td></tr>
            <tr><td><b>Nama</b></td><td>${nama}</td></tr>
            <tr><td><b>IP Address</b></td><td>${ip_address}</td></tr>
            <tr><td><b>Lokasi</b></td><td>${lokasi || '-'}</td></tr>
            <tr><td><b>Waktu</b></td><td>${waktu}</td></tr>
            <tr><td><b>Status</b></td><td style="color:#dc2626; font-weight:bold;">OFFLINE</td></tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error('[RESEND] Gagal kirim email:', error.message || error);
      return { success: false, error: error.message || String(error) };
    }

    console.log(`[RESEND] Email offline terkirim untuk AP "${nama}" (email id: ${data?.id})`);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[RESEND] Exception saat kirim email:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendStatusNotification, sendOfflineEmail };