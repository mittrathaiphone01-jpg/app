import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Readable } from "stream"; // ยังคงต้องใช้ใน Route Handler
import * as fs from 'fs';
import * as path from 'path';
import { ApiSendLineType, ApiSendLineTypeDetail } from '@/type';
import { formathDateThai } from '@/lib/utils';

// ขนาด 80mm
const PAGE_WIDTH_MM = 80;
const INCH_TO_PT = 72;
const PAGE_WIDTH_PT = (PAGE_WIDTH_MM / 25.4) * INCH_TO_PT; // ~226.8 pt

// Interface ที่สมบูรณ์
export interface MyDocumentProps {
  userId: string;
  receiptNo: string;
  date: string;
  items: { description: string; qty: number; price: number; amount: number }[];
  total: number;
  cash: number;
  change: number;

}

const fontPath = path.join(process.cwd(), 'public', 'fonts', 'THSarabunNew.ttf');
if (!fs.existsSync(fontPath)) {
  console.error(`Font file not found at: ${fontPath}`);
}

Font.register({
  family: 'Sarabun',
  src: fontPath,
});

// Create styles
const styles = StyleSheet.create({
  page: {
    width: PAGE_WIDTH_PT,
    height: 3000,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: 'Sarabun',
    fontSize: 8,
  },
  header: {
    marginBottom: 5,
    alignItems: 'center',
    borderBottom: '1pt dashed #333',
    paddingBottom: 5,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  receiptInfo: {
    fontSize: 7,
    marginBottom: 5,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    flexDirection: 'column',
    borderBottom: '1pt dashed #333',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
  },
  tableHeader: {
    fontWeight: 'bold',
    borderTop: '1pt dashed #333',
    paddingTop: 3,
  },
  colDesc: { width: '45%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colAmount: { width: '20%', textAlign: 'right' },
  summary: {
    width: '100%',
    marginBottom: 5,
    borderBottom: '1pt dashed #333',
    paddingBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  summaryLabel: { fontWeight: 'bold' },
  summaryValue: { textAlign: 'right' },
  footer: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 7,
  }
});

interface propType {
  header: ApiSendLineType
  details: ApiSendLineTypeDetail
  type: number
}

const Receipt80mm: React.FC<propType> = ({
  // invoice,
  // data ,
  // total_installments, 
  // payment_date
  header,
  details,
  type

}) => {
  const sumCal = Number(details.installment_price) - Number(details.fee_amount)
  const totalCal = sumCal + Number(details.fee_amount)

  return ( // ลบ '{' และใช้ '(' ทันทีเพื่อส่งคืน JSX

    <Document>
      <Page style={styles.page}>

        {/* --- 1. HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.companyName}>รื่นรมย์มือถือ ขอนแก่น {type}</Text>
          <Text>เลขที่: {header.invoice || "-"} | กำหนดชำระเงิน: {formathDateThai(details.payment_date) || "-"}</Text>
          <Text>ลูกค้า : {header.member_full_name || "-"} </Text>
        </View>

        {/* --- 2. ITEMS TABLE --- */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colDesc}>รายการ</Text>
            <Text style={styles.colQty}>จำนวน</Text>
            <Text style={styles.colPrice}>ราคา</Text>
            <Text style={styles.colAmount}>รวม</Text>
          </View>

          {/* {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.fee_amount}</Text>
            <Text style={styles.colQty}>{item.fee_amount}</Text>
            <Text style={styles.colPrice}>{item.fee_amount.toFixed(2)}</Text>
            <Text style={styles.colAmount}>{item.fee_amount.toFixed(2)}</Text>
          </View>
        ))} */}

          <View style={styles.tableRow}>
            <Text style={styles.colDesc}> งวดที่ {details.payment_no}/ {header.installments_month} </Text>
            <Text style={styles.colQty}>1</Text>
            <Text style={styles.colPrice}> {details.fee_amount ? Number(sumCal).toLocaleString() : Number(details.installment_price).toLocaleString() || "-"}</Text>
            <Text style={styles.colAmount}>{details.fee_amount ? Number(sumCal).toLocaleString() : Number(details.installment_price).toLocaleString() || "-"}</Text>
          </View>

        </View>

        {/* --- 3. SUMMARY --- */}
        <View style={styles.summary}>
  
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ค่าปรับ (Fine)</Text>
            <Text style={styles.summaryValue}>{Number(details.fee_amount).toLocaleString()} บาท</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ค่างวด (Installments)</Text>
            {type === 1 ? (
              <Text style={styles.summaryValue}>{Number(header.net_installment).toLocaleString()} บาท</Text>
            ) : (
              <Text style={styles.summaryValue}>{
                (Number(details.installment_price) - Number(details.fee_amount)).toLocaleString()
              } บาท</Text>
            )}
          </View>

          {/* installment_price */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ราคาสุทธิ (Net price)</Text>
            <Text style={styles.summaryValue}>{Number(totalCal).toLocaleString()} บาท</Text>
          </View>


        </View>

        {/* --- 4. FOOTER --- */}
        <View style={styles.footer}>
          <Text>ขอบคุณที่ใช้บริการ</Text>
        </View>

        <View style={styles.footer}>
          <Text >ออกบิล ณ วันที่ {formathDateThai(new Date().toISOString())}</Text>
        </View>

      </Page>
    </Document>
  )
};

export default Receipt80mm;