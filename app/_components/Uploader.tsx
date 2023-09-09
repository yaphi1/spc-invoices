'use client';

import { ChangeEvent, useState } from 'react';
import { read, WorkBook } from 'xlsx';

export default function Uploader() {
  const [ excelData, setExcelData ] = useState<WorkBook>();

  async function handleFileAsync(event:ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const data = await file?.arrayBuffer();
    const workbook = read(data);

    setExcelData(workbook);
    console.log(excelData);
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
      <div>
        <div>{excelData?.SheetNames[0]}</div>
        <div>{excelData?.SheetNames[1]}</div>
      </div>
    </div>
  );
}
