

// /api/line/webhook.ts
// import { NextResponse } from 'next/server';
// import axios from 'axios';

// // ตั้งค่า Line API
// const LINE_MESSAGING_API_URL = 'https://api.line.me/v2/bot/message/reply';
// const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const events = body.events;

//     for (const event of events) {
//       if (event.type === 'follow') {
//         const userId = event.source.userId;
//         const replyToken = event.replyToken;

//         // ข้อความตอบกลับเพื่อขอเบอร์โทรศัพท์
//         const replyMessage = {
//           replyToken: replyToken,
//           messages: [{
//             type: 'text',
//             text: 'ยินดีที่ได้รู้จักครับ! กรุณาส่งเบอร์โทรศัพท์ของคุณเพื่อยืนยันตัวตนครับ'
//           }]
//         };

//         // ส่งข้อความตอบกลับไปยังผู้ใช้
//         await axios.post(
//           LINE_MESSAGING_API_URL,
//           replyMessage,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
//             },
//           }
//         );

//       } else if (event.type === 'message') {
//         // ขั้นตอนนี้จะทำงานเมื่อผู้ใช้ส่งข้อความกลับมา
//         const userId = event.source.userId;
//         const messageText = event.message.text;
//         const replyToken = event.replyToken;

//         // ตรวจสอบว่าข้อความที่ส่งมาเป็นเบอร์โทรศัพท์หรือไม่
//         if (messageText.match(/^\d{10}$/)) { // ตรวจสอบเบอร์โทร 10 หลัก
//           console.log(`ได้รับเบอร์โทรศัพท์: ${messageText} จาก User ID: ${userId}`);

//           // ส่ง User ID และเบอร์โทรไปยัง Web App ของคุณเพื่อบันทึก
//           const webappResponse = await axios.post('https://your-webapp-domain.com/api/save-user-info', {
//             userId: userId,
//             phoneNumber: messageText
//           });

//           if (webappResponse.status === 200) {
//             // ส่งข้อความยืนยันกลับไปหาผู้ใช้โดยใช้ replyToken
//             const confirmationMessage = {
//               replyToken: replyToken, // ใช้ replyToken ที่ได้มา
//               messages: [{
//                 type: 'text',
//                 text: 'ยืนยันการลงทะเบียนสำเร็จ! ขอบคุณครับ/ค่ะ'
//               }]
//             };

//             await axios.post(
//               LINE_MESSAGING_API_URL,
//               confirmationMessage,
//               {
//                 headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
//                 },
//               }
//             );
//           }

//         }
//       }
//     }
//     return NextResponse.json({ status: 'ok' }, { status: 200 });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { error: 'Internal Server Error', details: error.message },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json(
//       { error: 'Internal Server Error', details: 'An unknown error occurred' },
//       { status: 500 }
//     );
//   }
// }

// /api/line/webhook.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';


// ตั้งค่า Line API
const LINE_REPLY_API_URL = 'https://api.line.me/v2/bot/message/reply';
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

const replyToUser = async (replyToken: string, message: string) => {
  const replyMessage = {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: message
    }]
  };
  await axios.post(
    LINE_REPLY_API_URL,
    replyMessage,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    }
  );
};


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    for (const event of events) {
      const userId = event.source.userId;
      const replyToken = event.replyToken; // ดึง replyToken จาก Event ที่เข้ามา

      if (event.type === 'message') {
        const messageText = event.message.text;

        console.log(messageText);

        if (messageText.trim() === "ชำระเงิน") {
          console.log(`ชำระเงิน: ${messageText} จาก User ID: ${userId}`);

          // สร้าง URL พร้อม User ID
          console.log({ JWT_SECRET });
          if (!JWT_SECRET) {
            console.error('JWT_SECRET is not defined')
            return
          }
          const token = jwt.sign({userId}, JWT_SECRET, { expiresIn: '1d' });
          
          const paymentUrl = `${process.env.NEXTAUTH_URL}/my-pay?user_id=${token}`;
          console.log(paymentUrl);
          
          // สร้าง JSON Object สำหรับข้อความตอบกลับ
          const replyMessage = {
            replyToken: replyToken, // **ใช้ replyToken ที่ได้รับจาก Event**
            messages: [
              {
                "type": "template",
                "altText": "คลิกเพื่อไปยังหน้าชำระเงิน",
                "template": {
                  "type": "buttons",
                  "text": "คลิกปุ่มเพื่อเปิดหน้าชำระเงินของคุณ",
                  "actions": [
                    {
                      "type": "uri",
                      "label": "ชำระเงินของฉัน",
                      "uri": paymentUrl
                    }
                  ]
                }
              }
            ]
          };

          try {
            // ใช้ async/await ในการเรียก API
            await axios.post(
              LINE_REPLY_API_URL,
              replyMessage,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
                },
              }
            );
            console.log("ส่งข้อความตอบกลับสำเร็จ");
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อความตอบกลับ:", error);
          }
        }

        // ตรวจสอบว่าข้อความที่ส่งมาเป็นเบอร์โทรศัพท์หรือไม่
        if (messageText.match(/^\d{10}$/)) {
          console.log(`ได้รับเบอร์โทรศัพท์: ${messageText} จาก User ID: ${userId}`);
          console.log({ url: `${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/link` });
          try {

            const webappResponse = await axios.post(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/link`, {
              tel: String(messageText),
              user_id: String(userId)
            }, {
              headers: {
                'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
              }
            })

            if (webappResponse.status === 200) {
              await replyToUser(replyToken, 'สมัครสมาชิกสำเร็จ ชำระเงินได้เลย');
            }

          }
          catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response && error.response.data && error.response.status === 400) {
                // เมื่อเซิร์ฟเวอร์ตอบกลับด้วยสถานะ 400
                const errorMessage = (error.response.data as { error: string }).error;
                console.error('API Error:', errorMessage);
                // ส่งข้อความ Error กลับไปที่ LINE
                await replyToUser(replyToken, errorMessage);
              } else {
                // กรณีที่ไม่ใช่ข้อผิดพลาดจาก API โดยตรง
                console.error('Unexpected Axios error:', error);
                await replyToUser(replyToken, 'ขออภัย เกิดข้อผิดพลาดบางอย่าง ลองใหม่อีกครั้งนะครับ');
              }
            } else if (error instanceof Error) {
              // เมื่อเกิด Error ประเภทอื่นๆ
              console.error('Unexpected error:', error);
              await replyToUser(replyToken, `ขออภัย เกิดข้อผิดพลาด: ${error.message}`);
            } else {
              // กรณีที่เกิดข้อผิดพลาดที่ไม่รู้จัก
              console.error('Unknown error:', error);
              await replyToUser(replyToken, 'ขออภัย เกิดข้อผิดพลาดที่ไม่รู้จัก');
            }
          }
        }
      } else if (event.type === 'follow') {
        // เมื่อผู้ใช้เพิ่มเพื่อน
        const replyToken = event.replyToken;
        const welcomeMessage = {
          replyToken: replyToken,
          messages: [{
            type: 'text',
            text: 'ยินดีที่ได้รู้จักครับ! กรุณาส่งเบอร์โทรศัพท์ของคุณเพื่อยืนยันตัวตนครับ'
          }]
        };
        await axios.post(
          LINE_REPLY_API_URL,
          welcomeMessage,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
          }
        );
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal Server Error', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active' });
}