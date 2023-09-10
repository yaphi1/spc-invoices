import { read, utils, WorkBook } from "xlsx";
import {
  CustomerData,
  InvoiceData,
  Metadata,
  RawFileData,
} from "./types";

function getMetadata(workbook: WorkBook): Metadata {
  const { month, year } = getInvoicePeriod(workbook);

  // TODO: replace address placeholders
  const metadata = {
    address: {
      street: 'street',
      streetLine2: 'streetLine2',
      city: 'city',
      state: 'state',
      zip: 'zip',
    },
    month,
    year,
  };

  return metadata;
}

function getInvoicePeriod(workbook: WorkBook) {
  const title = workbook.Props?.Title ?? '';
  const month = getMonthFromTitle(title);
  const year = getYearFromTitle(title);

  return { month, year };
}

function getMonthFromTitle(title: string) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames.find(name => title.includes(name)) ?? '';
  return month;
}

function getYearFromTitle(title: string) {
  const year = Number((title.match(/\d\d\d\d/) ?? [''])[0]);
  return year;
}

function formatWorkbook(data: RawFileData, filename: string) {
  const workbook = read(data);
  workbook.Props = workbook.Props ?? {};
  workbook.Props.Title = filename;
  console.log({ workbook });

  return workbook;
}

function removeInvalidRows(customerData: CustomerData) {
  const filteredData = customerData.filter(customer => {
    const hasCustomerName = Boolean(customer['Full Name']);
    const hasTotalOwed = Boolean(customer['Total Owed']);
    return hasCustomerName && hasTotalOwed;
  });

  return filteredData;
}

function getCustomerData(workbook: WorkBook) {
  const customerDataSheetRaw = Object.values(workbook.Sheets)[0];
  const customerData: CustomerData = utils.sheet_to_json(customerDataSheetRaw);
  const filteredData = removeInvalidRows(customerData);

  return filteredData;
}

export function getUpdatedInvoiceData(data: RawFileData, filename: string): InvoiceData {
  const workbook = formatWorkbook(data, filename);
  const customerData = getCustomerData(workbook);
  const metadata = getMetadata(workbook);
  const updatedInvoiceData = { customerData, metadata };

  return updatedInvoiceData;
}
