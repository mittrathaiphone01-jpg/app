module.exports = {
  apps: [
    {
      // 1. ตั้งชื่อแอปของคุณ (จะแสดงใน 'pm2 list')
      name: 'next-app',

      // 2. สั่งให้ PM2 รันคำสั่ง 'npm'
      script: 'npm',

      // 3. บอก npm ให้รัน 'start' (เหมือนรัน 'npm start')
      args: 'start',

      // 4. (สำคัญมาก) ตั้งค่าสภาพแวดล้อม
      env: {
        NODE_ENV: 'production',
        PORT: 3000 
      },

      // 6. (สำคัญ) ปิดการ watch ไฟล์ใน production
      // เราจะ restart แอปเองตอน deploy เท่านั้น
      watch: false, 

      // 7. (แนะนำ) ทำให้ logs มี timestamp
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};