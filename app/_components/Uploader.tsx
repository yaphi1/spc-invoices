'use client';

import { ChangeEvent, useState } from 'react';
import { InvoiceData } from '../_utils/types';
import { getUpdatedInvoiceData } from '../_utils/dataTools';
import Invoices from './Invoices';
import styles from '../uploader.module.css';

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
      <div className={styles.uploaderUI}>
        {invoiceData && (
          <button
            className={styles.printButton}
            onClick={() => { print(); }}
          >
            Click here to PRINT invoices
          </button>
        )}
        <div>
          <label className={
            invoiceData ? styles.reuploadButton : styles.uploadButton
          }>
            {invoiceData ?
              'Click here to upload different invoice data' :
              'Click here to upload invoice data'
            }
            <input
              type="file"
              onChange={(e) => { handleFileAsync(e); }}
            />
          </label>
        </div>
      </div>
      <Invoices invoiceData={invoiceData} />
    </div>
  );
}
