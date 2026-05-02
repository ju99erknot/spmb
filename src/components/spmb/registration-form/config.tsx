import React from 'react';
import { User, CreditCard, MapPin, Phone, Calendar, BookOpen, Heart, Baby, Briefcase, Home, GraduationCap, School, Users, FileText, FileCheck, Ruler } from 'lucide-react';
import { FormField } from './types';

export const AGAMA_OPTIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Budha", "Konghucu"];
export const PENDIDIKAN_OPTIONS = ["Tidak sekolah", "Putus SD", "SD Sederajat", "SMP Sederajat", "SMA Sederajat", "D1", "D2", "D3", "D4/S1", "S2", "S3"];
export const PEKERJAAN_OPTIONS = ["Tidak Bekerja", "Nelayan", "Petani", "Peternak", "PNS/TNI/Polri", "Karyawan Swasta", "Pedagang Kecil", "Pedagang Besar", "Wiraswasta", "Wirausaha", "Buruh", "Pensiunan", "Sudah Meninggal", "Lainnya"];
export const PENGHASILAN_OPTIONS = [
  { value: "Tidak Berpenghasilan", label: "Tidak Berpenghasilan" },
  { value: "Kurang dari 500.000", label: "Kurang dari Rp 500.000" },
  { value: "500.000 - 1.000.000", label: "Rp 500.000 - 1.000.000" },
  { value: "1.000.000 - 2.000.000", label: "Rp 1.000.000 - 2.000.000" },
  { value: "2.000.000 - 5.000.000", label: "Rp 2.000.000 - 5.000.000" },
  { value: "Lebih dari 5.000.000", label: "Lebih dari Rp 5.000.000" }
];

// STEP 1: Identitas Peserta Didik
export const step1Fields: FormField[] = [
  { name: "nama", label: "Nama Lengkap (Sesuai Akta)", icon: <User className="w-4 h-4" />, required: true, placeholder: "Contoh: AANG MUHAEMIN", colSpan: 2, tip: "Gunakan HURUF KAPITAL sesuai Akta Kelahiran." },
  { name: "jk", label: "Jenis Kelamin", icon: <User className="w-4 h-4" />, required: true, type: "select", options: [{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }] },
  { name: "agama", label: "Agama", icon: <BookOpen className="w-4 h-4" />, required: true, type: "select", options: AGAMA_OPTIONS },
  { name: "nik", label: "NIK Siswa (16 Digit)", icon: <CreditCard className="w-4 h-4" />, required: true, placeholder: "16 Digit NIK Anak", maxLength: 16, tip: "Lihat 16 digit NIK anak di kolom Kartu Keluarga." },
  { name: "nisn", label: "NISN (Opsional)", icon: <CreditCard className="w-4 h-4" />, placeholder: "10 Digit Angka", maxLength: 10, tip: "10 Digit Angka. Kosongkan jika anak belum punya NISN." },
  { name: "tempat_lahir", label: "Tempat Lahir", icon: <MapPin className="w-4 h-4" />, required: true, placeholder: "Kota/Kabupaten" },
  { name: "tanggal_lahir", label: "Tanggal Lahir", icon: <Calendar className="w-4 h-4" />, required: true, type: "date" },
  { name: "nipd", label: "NIPD (Opsional)", icon: <CreditCard className="w-4 h-4" />, placeholder: "Nomor Induk Peserta Didik", tip: "Nomor Induk Peserta Didik dari sekolah asal." },
  { name: "anak_ke", label: "Anak Ke (Opsional)", icon: <Baby className="w-4 h-4" />, placeholder: "Contoh: 2", type: "number", maxLength: 2 },
  { name: "kebutuhan_khusus", label: "Kebutuhan Khusus (Opsional)", icon: <Heart className="w-4 h-4" />, type: "select", options: ["Tidak Ada", "Tunanetra", "Tunarungu", "Tunagrahita", "Tunadaksa", "Tunalaras", "Autis", "ADHD", "Lainnya"], colSpan: 2 },
];

// STEP 2: Alamat Domisili
export const step2Fields: FormField[] = [
  { name: "alamat", label: "Alamat Jalan / Kampung", icon: <Home className="w-4 h-4" />, required: true, placeholder: "Contoh: Jl. Merdeka No. 123, Kp. Sukamaju", colSpan: 2, type: "textarea", tip: "Nama jalan, nomor rumah, atau nama kampung." },
  { name: "rt", label: "RT", icon: <MapPin className="w-4 h-4" />, required: true, placeholder: "000" },
  { name: "rw", label: "RW", icon: <MapPin className="w-4 h-4" />, required: true, placeholder: "000" },
  { name: "dusun", label: "Dusun (Opsional)", icon: <MapPin className="w-4 h-4" />, placeholder: "Nama dusun jika ada", colSpan: 2 },
  { name: "kecamatan", label: "Kecamatan", icon: <MapPin className="w-4 h-4" />, required: true, type: "select" },
  { name: "kelurahan", label: "Desa/Kelurahan", icon: <MapPin className="w-4 h-4" />, required: true, type: "select" },
  { name: "kode_pos", label: "Kode Pos", icon: <MapPin className="w-4 h-4" />, required: true, placeholder: "Contoh: 43351", maxLength: 5 },
  { name: "jenis_tinggal", label: "Jenis Tinggal", icon: <Home className="w-4 h-4" />, required: true, type: "select", options: ["Bersama Orang Tua", "Wali", "Kos", "Asrama", "Panti Asuhan", "Lainnya"] },
  { name: "alat_transportasi", label: "Alat Transportasi (Opsional)", icon: <MapPin className="w-4 h-4" />, type: "select", options: ["Jalan kaki", "Sepeda", "Sepeda motor", "Angkutan umum", "Mobil pribadi", "Lainnya"] },
  { name: "jarak_sekolah", label: "Jarak ke Sekolah (Km)", icon: <MapPin className="w-4 h-4" />, placeholder: "Contoh: 1", type: "number", maxLength: 2, tip: "Perkiraan jarak rumah ke SDN 02 Cibadak." },
];

// STEP 3: Kontak & Data Fisik
export const step3Fields: FormField[] = [
  { name: "hp", label: "No. HP / WhatsApp", icon: <Phone className="w-4 h-4" />, required: true, placeholder: "08xxxxxxxxxx", maxLength: 14, tip: "Nomor aktif untuk menerima info pendaftaran." },
  { name: "telepon", label: "No. Telepon (Opsional)", icon: <Phone className="w-4 h-4" />, placeholder: "021xxxxxxx", maxLength: 14 },
  { name: "email", label: "Email (Opsional)", icon: <Phone className="w-4 h-4" />, placeholder: "contoh@email.com", type: "email", colSpan: 2 },
  { name: "tinggi_badan", label: "Tinggi Badan (cm)", icon: <Ruler className="w-4 h-4" />, required: true, placeholder: "Contoh: 110", type: "number", maxLength: 3 },
  { name: "berat_badan", label: "Berat Badan (kg)", icon: <Ruler className="w-4 h-4" />, required: true, placeholder: "Contoh: 20", type: "number", maxLength: 3 },
  { name: "lingkar_kepala", label: "Lingkar Kepala (cm)", icon: <Ruler className="w-4 h-4" />, required: true, placeholder: "Contoh: 50", type: "number" },
  { name: "jml_saudara", label: "Jumlah Saudara Kandung", icon: <Baby className="w-4 h-4" />, required: true, placeholder: "Contoh: 2", type: "number", maxLength: 2 },
];

// STEP 4: Dokumen & Kesejahteraan
export const step4Fields: FormField[] = [
  { name: "no_kk", label: "No. Kartu Keluarga", icon: <FileText className="w-4 h-4" />, required: true, placeholder: "16 Digit No. KK", maxLength: 16, tip: "16 digit nomor KK di pojok kanan atas Kartu Keluarga." },
  { name: "no_akta", label: "No. Registrasi Akta", icon: <FileText className="w-4 h-4" />, required: true, placeholder: "Contoh: 3201-LU-01012015-0001", maxLength: 30, tip: "Contoh: 3201-LU-01012015-0001" },
  { name: "penerima_kps", label: "Penerima KPS?", icon: <FileCheck className="w-4 h-4" />, type: "select", options: ["Ya", "Tidak"], group: "bantuan" },
  { name: "no_kps", label: "No. KPS", icon: <FileText className="w-4 h-4" />, placeholder: "Nomor KPS", group: "bantuan" },
  { name: "penerima_kip", label: "Penerima KIP?", icon: <FileCheck className="w-4 h-4" />, type: "select", options: ["Ya", "Tidak"], group: "bantuan" },
  { name: "no_kip", label: "No. KIP", icon: <FileText className="w-4 h-4" />, placeholder: "Nomor KIP", group: "bantuan" },
  { name: "nama_kip", label: "Nama di KIP", icon: <User className="w-4 h-4" />, placeholder: "Nama yang tertera di KIP", colSpan: 2, group: "bantuan" },
  { name: "no_kks", label: "No. KKS", icon: <FileText className="w-4 h-4" />, placeholder: "Nomor Kartu Keluarga Sejahtera", colSpan: 2, group: "bantuan" },
  { name: "layak_pip", label: "Layak PIP?", icon: <FileCheck className="w-4 h-4" />, type: "select", options: ["Ya", "Tidak"], group: "bantuan" },
  { name: "alasan_pip", label: "Alasan Layak PIP", icon: <FileText className="w-4 h-4" />, placeholder: "Alasan kelayakan", group: "bantuan" },
  { name: "bank", label: "Bank", icon: <CreditCard className="w-4 h-4" />, type: "select", options: ["BRI", "BNI", "Mandiri", "BSI", "BJB", "BCA", "Lainnya"], group: "bantuan" },
  { name: "no_rekening", label: "No. Rekening", icon: <CreditCard className="w-4 h-4" />, placeholder: "Nomor Rekening", group: "bantuan" },
  { name: "atas_nama_rekening", label: "Atas Nama Rekening", icon: <User className="w-4 h-4" />, placeholder: "Nama pemilik rekening", colSpan: 2, group: "bantuan" },
];

// STEP 5: Data Ayah
export const step5Fields: FormField[] = [
  { name: "nama_ayah", label: "Nama Ayah", icon: <User className="w-4 h-4" />, placeholder: "Nama Lengkap Ayah (sesuai KK)", colSpan: 2 },
  { name: "nik_ayah", label: "NIK Ayah", icon: <CreditCard className="w-4 h-4" />, placeholder: "16 Digit NIK Ayah", maxLength: 16 },
  { name: "tahun_lahir_ayah", label: "Tahun Lahir Ayah", icon: <Calendar className="w-4 h-4" />, placeholder: "Contoh: 1985", maxLength: 4, type: "number" },
  { name: "pendidikan_ayah", label: "Pendidikan Ayah", icon: <GraduationCap className="w-4 h-4" />, type: "select", options: PENDIDIKAN_OPTIONS },
  { name: "pekerjaan_ayah", label: "Pekerjaan Ayah", icon: <Briefcase className="w-4 h-4" />, type: "select", options: PEKERJAAN_OPTIONS },
  { name: "penghasilan_ayah", label: "Penghasilan Ayah", icon: <Briefcase className="w-4 h-4" />, type: "select", options: PENGHASILAN_OPTIONS, colSpan: 2 },
];

// STEP 6: Data Ibu Kandung
export const step6Fields: FormField[] = [
  { name: "nama_ibu", label: "Nama Ibu Kandung", icon: <User className="w-4 h-4" />, required: true, placeholder: "Nama Lengkap Ibu (sesuai KK)", colSpan: 2, tip: "Wajib sesuai Kartu Keluarga." },
  { name: "nik_ibu", label: "NIK Ibu", icon: <CreditCard className="w-4 h-4" />, required: true, placeholder: "16 Digit NIK Ibu", maxLength: 16 },
  { name: "tahun_lahir_ibu", label: "Tahun Lahir Ibu", icon: <Calendar className="w-4 h-4" />, required: true, placeholder: "Contoh: 1990", maxLength: 4, type: "number" },
  { name: "pendidikan_ibu", label: "Pendidikan Ibu", icon: <GraduationCap className="w-4 h-4" />, required: true, type: "select", options: PENDIDIKAN_OPTIONS },
  { name: "pekerjaan_ibu", label: "Pekerjaan Ibu", icon: <Briefcase className="w-4 h-4" />, required: true, type: "select", options: PEKERJAAN_OPTIONS },
  { name: "penghasilan_ibu", label: "Penghasilan Ibu", icon: <Briefcase className="w-4 h-4" />, required: true, type: "select", options: PENGHASILAN_OPTIONS, colSpan: 2 },
];

// STEP 7: Data Wali
export const step7Fields: FormField[] = [
  { name: "nama_wali", label: "Nama Wali", icon: <User className="w-4 h-4" />, placeholder: "Nama Lengkap Wali", colSpan: 2 },
  { name: "nik_wali", label: "NIK Wali", icon: <CreditCard className="w-4 h-4" />, placeholder: "16 Digit NIK Wali", maxLength: 16 },
  { name: "tahun_lahir_wali", label: "Tahun Lahir Wali", icon: <Calendar className="w-4 h-4" />, placeholder: "Contoh: 1980", maxLength: 4, type: "number" },
  { name: "pendidikan_wali", label: "Pendidikan Wali", icon: <GraduationCap className="w-4 h-4" />, type: "select", options: PENDIDIKAN_OPTIONS },
  { name: "pekerjaan_wali", label: "Pekerjaan Wali", icon: <Briefcase className="w-4 h-4" />, type: "select", options: PEKERJAAN_OPTIONS },
  { name: "penghasilan_wali", label: "Penghasilan Wali", icon: <Briefcase className="w-4 h-4" />, type: "select", options: PENGHASILAN_OPTIONS, colSpan: 2 },
];

// STEP 8: Akademik & Pernyataan
export const step8Fields: FormField[] = [
  { name: "sekolah_asal", label: "Sekolah Asal", icon: <School className="w-4 h-4" />, placeholder: "Contoh: TK Tunas Mekar", colSpan: 2, group: "sekolah" },
  { name: "rombel", label: "Rombel", icon: <Users className="w-4 h-4" />, placeholder: "Contoh: B1", group: "sekolah" },
  { name: "skhun", label: "SKHUN", icon: <FileText className="w-4 h-4" />, placeholder: "Nomor SKHUN", group: "sekolah" },
  { name: "no_peserta_un", label: "No. Peserta UN", icon: <FileText className="w-4 h-4" />, placeholder: "Nomor Peserta UN", group: "sekolah" },
  { name: "no_seri_ijazah", label: "No. Seri Ijazah", icon: <FileText className="w-4 h-4" />, placeholder: "Nomor Seri Ijazah", group: "sekolah" },
];

