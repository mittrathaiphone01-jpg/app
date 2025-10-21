export type HeaderType = {
    id: number
    full_name: string
    name: string
    images?: { url: string }[]
    price?: string
    invoice: string
    product_price: number
    member_full_name: string
    user_username: string
    created_at: string
    fee_amount: number
    late_day: number
    extra_percent: number
    down_percent: number
    total_installments: number
    net_installment: number
    remaining_amount: number
    status: number
    note :string
    term_type : number
    total_interest_amount : number
    loan_amount: number
    interest_amount: number
    total_price : number
    paid_amount : number
}

// installment_price // ราคาต่องวด
// paid_amount // จ่ายมาแล้ว
// fee_amount // ค่าปรับ
// credit_balance // จ่ายเกิน
// payment_date // จ่ายวันที่

export type DetailType = {
    id: number
    credit_balance: number
    fee_amount: number
    installment_price: number
    paid_amount: number
    payment_date: string
    status: number
    payment_no: string
    created_at : string

}

export type ApiSendLineType = {
    id: number
    member_user_id: string
    member_full_name: string
    product_name: string
    invoice: string
    net_installment: number // ราคาต่องวด
    paid_amount: number // จ่ายมาแล้ว
    remaining_amount: number //คงเหลือ
    installments_month: number // งวดทั้งหมด
    remaining_installments: number // จ่ายไปแล้ว
    total_installments: number
    data: ApiSendLineTypeDetail[]
    bill_details: ApiSendLineTypeDetail[]
    paid_installments: number
    note :string
    late_day : number
    fee_amount : number
    term_type : number
    total_price: number 

}

export type ApiSendLineTypeDetail = {
    id: number
    installment_price: number // ราคาต่องวด
    paid_amount: number // จ่ายมาแล้ว
    payment_date: string // วันจ่าย
    fee_amount: number
    credit_balance: number // เงินเครดิต จากงวดที่แล้ว
    data: ApiSendLineType[]
    payment_no: string
}

export type payloadJwtType = {
    invoice: string
    installment_price: number
    type: number
    bill_id: number
    bill_detail_id: number
}

export interface dataCategoryType {
    id: number | string;
    name: string;
    value: string
    label: string

}