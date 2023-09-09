'use client';

import { ChangeEvent, useState } from 'react';
import { InvoiceData } from '../_utils/types';
import { DebugTable } from './DebugTable';
import { getUpdatedInvoiceData } from '../_utils/dataTools';

export default function Uploader() {
  const [ invoiceData, setInvoiceData ] = useState<InvoiceData>();

  async function handleFileAsync(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) { return; }

    const filename = file.name;
    const data = await file?.arrayBuffer();

    const updatedInvoiceData = getUpdatedInvoiceData(data, filename);
    console.log({ filename, updatedInvoiceData });

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
