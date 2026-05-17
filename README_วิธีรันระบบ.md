# Jobfuz - วิธีนำ Source Code ไป Run

## ไฟล์ที่แนบ

- `jobfuz-source.zip` คือ Source Code ของโปรเจค Jobfuz สำหรับตรวจและนำไปรัน
- `jobfuz-source/` คือโฟลเดอร์ Source Code แบบแตกไฟล์ไว้แล้ว
- `.env.example` อยู่ภายในโฟลเดอร์ Source Code เพื่อแสดงตัวแปรที่ต้องตั้งค่า

## หมายเหตุด้านความปลอดภัย

ไม่ได้แนบไฟล์ `.env` จริง เนื่องจากมีข้อมูลลับของระบบ เช่น Supabase URL/Key หรือค่า Secret อื่น ๆ โดยแนบเฉพาะ `.env.example` เพื่อแสดงรูปแบบตัวแปรที่จำเป็น

## โปรแกรมที่ต้องติดตั้งก่อน

- Node.js เวอร์ชัน 20 ขึ้นไป
- npm
- บัญชี Supabase และ Supabase Project สำหรับทดสอบฐานข้อมูล

## ขั้นตอนการ Run ระบบ

1. แตกไฟล์ `jobfuz-source.zip` หรือเปิดโฟลเดอร์ `jobfuz-source`
2. เปิด Terminal หรือ Command Prompt ในโฟลเดอร์โปรเจค
3. ติดตั้ง dependencies

```bash
npm install
```

4. คัดลอกไฟล์ `.env.example` แล้วเปลี่ยนชื่อเป็น `.env`
5. ใส่ค่าการเชื่อมต่อ Supabase ในไฟล์ `.env`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. หากใช้ Supabase Project ใหม่ ให้นำไฟล์ SQL ใน `supabase/migrations/` ไปรันใน Supabase SQL Editor ตามลำดับเลขไฟล์
7. Run ระบบแบบ development

```bash
npm run dev
```

8. เปิดเว็บใน Browser ตาม URL ที่ Terminal แสดง เช่น

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

## GitHub และลิงก์เว็บ

- GitHub Repository: https://github.com/AchuAchii/jobfuz-ce411
- Web Demo: https://jobfuz-ai.vercel.app/
