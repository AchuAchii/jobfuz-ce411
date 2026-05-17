# Jobfuz

Jobfuz เป็นเว็บแอปพลิเคชันสำหรับช่วยเตรียมความพร้อมก่อนสมัครงาน ประกอบด้วยระบบวิเคราะห์เรซูเม่ แบบทดสอบ MCQ แบบฝึกเขียน Essay แบบประเมิน Work Style และแบบฝึกสัมภาษณ์ผ่าน AI Interview

Web Demo: https://jobfuz-ai.vercel.app/

## หมายเหตุด้านความปลอดภัย

Repository นี้ไม่แนบไฟล์ `.env` จริง เนื่องจากไฟล์ดังกล่าวมีข้อมูลลับของระบบ เช่น Supabase URL/Key หรือค่า Secret อื่น ๆ โดยแนบเฉพาะ `.env.example` เพื่อแสดงรูปแบบตัวแปรที่จำเป็น

## โปรแกรมที่ต้องติดตั้งก่อน

- Node.js เวอร์ชัน 20 ขึ้นไป
- npm
- บัญชี Supabase และ Supabase Project สำหรับทดสอบฐานข้อมูล

## วิธี Run ระบบ

1. Clone repository หรือแตกไฟล์ source code

```bash
git clone https://github.com/AchuAchii/jobfuz-ce411.git
cd jobfuz-ce411
```

2. ติดตั้ง dependencies

```bash
npm install
```

3. คัดลอก `.env.example` แล้วเปลี่ยนชื่อเป็น `.env`
4. ใส่ค่าการเชื่อมต่อ Supabase ในไฟล์ `.env`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. หากใช้ Supabase Project ใหม่ ให้นำไฟล์ SQL ใน `supabase/migrations/` ไปรันใน Supabase SQL Editor ตามลำดับเลขไฟล์
6. Run ระบบแบบ development

```bash
npm run dev
```

7. เปิดเว็บใน Browser ตาม URL ที่ Terminal แสดง เช่น

```text
http://localhost:5173/
```

## คำสั่งเพิ่มเติม

ตรวจสอบ build:

```bash
npm run build
```

ดูตัวอย่าง production build:

```bash
npm run preview
```
