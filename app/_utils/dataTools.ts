import { utils, WorkBook } from "xlsx";
import {
  CellValue,
  CustomerData,
  FormattedCustomerData,
  Metadata,
} from "./types";

function getColumnHeadings(customerData: CustomerData) {
  return customerData[0];
}

function getColumnIndexByName(name: string, customerData: CustomerData) {
  const columnHeadings = getColumnHeadings(customerData);
  const columnIndex = columnHeadings.findIndex(heading => heading === name);
  return columnIndex;
}

function getCellValueByColumnName(name: string, row: CellValue[], customerData: CustomerData) {
  const cellValue = row[getColumnIndexByName(name, customerData)];
  return cellValue;
}

function isRowValid(row: CellValue[], customerData: CustomerData) {
  const isRowPopulated = row.length > 0;

  const customerName = getCellValueByColumnName('Full Name', row, customerData);
  const totalOwed = getCellValueByColumnName('Total Owed', row, customerData);

  const hasCustomerName = Boolean(customerName);
  const hasTotalOwed = Boolean(totalOwed);

  return isRowPopulated && hasCustomerName && hasTotalOwed;
}

function formatCellData(row: CellValue[], customerData: CustomerData) {
  const columnHeadings = customerData[0];
  const sparseRowFilledIn = [...row];

  return sparseRowFilledIn.map((cellValue, i) => {
    const columnHeading = columnHeadings[i];
    return { cellValue, columnHeading };
  });
}

export function formatCustomerData(customerData: CustomerData): FormattedCustomerData {
  const formattedCustomerData = customerData
    ?.filter(row => isRowValid(row, customerData))
    .map(row => formatCellData(row, customerData))
  ;

  return formattedCustomerData;
}

export function getCustomerData(workbook: WorkBook): FormattedCustomerData {
  const customerDataSheetRaw = Object.values(workbook.Sheets)[0];
  const formatAsArrayOfArrays = { header: 1 };
  const customerDataValues: CustomerData = utils.sheet_to_json(
    customerDataSheetRaw,
    formatAsArrayOfArrays
  );
  const customerData = formatCustomerData(customerDataValues);

  return customerData;
}

export function getMetadata(workbook: WorkBook): Metadata {
  // TODO: replace placeholders
  const metadata = {
    address: {
      street: 'street',
      streetLine2: 'streetLine2',
      city: 'city',
      state: 'state',
      zip: 'zip',
    },
    month: 'Example',
    year: 2023,
  };

  return metadata;
}
