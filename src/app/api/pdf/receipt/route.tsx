import Receipt80mm, { MyDocumentProps } from "@/components/Prints/Receipt80mm";
import { ApiSendLineTypeDetail } from "@/type";
import { renderToStream } from "@react-pdf/renderer";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {



    try {
        const body = await req.json();
        const { payload } = body;
        const { bill_id, bill_detail_id, type } = payload;

        if (type === 1) {

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/paid/bill`, {
                bill_id: Number(bill_id),
                bill_detail_id: Number(bill_detail_id)
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
                }
            })

            if (res.status === 200) {
                const data = {
                    header: res.data[0],
                    details: res.data[0].data[0],
                    type
                }

                const nodeStream = await renderToStream(<Receipt80mm {...data} />);
                const webStream = nodeStream as unknown as ReadableStream;

                return new NextResponse(webStream, {
                    headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `inline; filename="user-${bill_detail_id}.pdf"`,
                    }
                })

            } else {
                return NextResponse.json({
                    success: false,
                    message: "ไม่สามารถสร้างไฟล์ PDF ได้",
                    status: res.status,
                }, { status: res.status })
            }

        } else if (type === 2) {

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/paid/bill/in`, {
                bill_id: Number(bill_id),
                bill_detail_id: Number(bill_detail_id)
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
                }
            })
            console.log(res.data);
            
            if (res.status === 200) {
                const data = {
                    header: res.data[0],
                    details: res.data[0].bill_details[0] ,
                    type
                }

                const nodeStream = await renderToStream(<Receipt80mm {...data} />);
                const webStream = nodeStream as unknown as ReadableStream;

                return new NextResponse(webStream, {
                    headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `inline; filename="user-${bill_detail_id}.pdf"`,
                    }
                })

            } else {
                return NextResponse.json({
                    success: false,
                    message: "ไม่สามารถสร้างไฟล์ PDF ได้",
                    status: res.status,
                }, { status: res.status })
            }

        }


    } catch (error) {
        console.log(error);

    }
}

