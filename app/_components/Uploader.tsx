'use client';

import { ChangeEvent, useState } from 'react';
import { read } from 'xlsx';
import { InvoiceData } from '../_utils/types';
import { getCustomerData, getMetadata } from '../_utils/dataTools';
import { DebugTable } from './DebugTable';

export default function Uploader() {
  const [ invoiceData, setInvoiceData ] = useState<InvoiceData>();

  async function handleFileAsync(event:ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const data = await file?.arrayBuffer();
    const workbook = read(data);
    console.log(workbook);

    const customerData = getCustomerData(workbook);
    const metadata = getMetadata(workbook);
    const updatedInvoiceData = { customerData, metadata };
    console.log({ updatedInvoiceData });

    setInvoiceData(updatedInvoiceData);
  }

  return (
    <div>
      Uploader
      <div>
        <input
          type="file"
          onChange={(e) => { handleFileAsync(e); }}
        />
      </div>
      <DebugTable invoiceData={invoiceData} />
    </div>
  );
}
