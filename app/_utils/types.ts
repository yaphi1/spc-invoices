export type CellValue = string | number;

export type Address = {
  street: string;
  streetLine2?: string;
  city: string;
  state: string;
  zip: string;
};

export type Metadata = {
  address: Address;
  companyName: string,
  federalId?: string,
  instructions?: string,
  otherInfo?: string,
  phone: string,
  month: string;
  year: number;
};

export type RawFileData = ArrayBuffer | undefined;

export type CustomerDataRow = Record<string, CellValue>;

export type CustomerData = CustomerDataRow[];

export type InvoiceData = {
  customerData: CustomerData;
  metadata: Metadata
};
