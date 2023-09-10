import { read, utils, WorkBook } from "xlsx";
import {
  CustomerData,
  InvoiceData,
  Metadata,
  RawFileData,
} from "./types";

function getMetadata(workbook: WorkBook): Metadata {
  const { month, year } = getInvoicePeriod(workbook);
  const metadataSheetRaw = getSheetByName('System Parking Info', workbook);
  const configureAsArrayOfArrays = { header: 1 };
  const metadataJson: string[][] = utils.sheet_to_json(metadataSheetRaw, configureAsArrayOfArrays);
  const cleanedData = metadataJson.slice(1).filter(row => row.length > 0);

  const keyedData: Record<string, string> = {};
  cleanedData.forEach(entry => {
    const [key, value] = entry;
    keyedData[key] = value;
  });

  const metadata = {
    address: {
      street: keyedData['Address Line 1'],
      streetLine2: keyedData['Address Line 2'],
      city: keyedData['City'],
      state: keyedData['State'],
      zip: keyedData['Zip'],
    },
    companyName: keyedData['Company Name'],
    federalId: keyedData['Federal ID'],
    instructions: keyedData['Instructions'],
    otherInfo: keyedData['Other Info (optional)'],
    phone: keyedData['Phone'],
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

function getSheetByName(sheetName: string, workbook: WorkBook) {
  // Seeking sheet by key first and order second gives some
  // protection against accidental changes in names or ordering

  const originalOrder: Record<string, number> = {
    'Customer data': 0,
    'System Parking Info': 2,
  };

  const sheet =
    workbook.Sheets[sheetName] ??
    Object.values(workbook.Sheets)[originalOrder[sheetName]];

  return sheet;
}

function getCustomerData(workbook: WorkBook) {
  const customerDataSheetRaw = getSheetByName('Customer data', workbook);
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
