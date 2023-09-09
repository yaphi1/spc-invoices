export type CellValue = string | number;

export type CustomerData = CellValue[][];

export type FormattedCellValue = {
  cellValue: CellValue;
  columnHeading: CellValue;
};

export type FormattedCustomerData = FormattedCellValue[][];

export type Address = {
  street: string;
  streetLine2?: string;
  city: string;
  state: string;
  zip: string;
};

export type Metadata = {
  address: Address;
  month: string;
  year: number;
};

export type InvoiceData = {
  customerData: FormattedCustomerData;
  metadata: Metadata
};
