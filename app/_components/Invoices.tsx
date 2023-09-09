import styles from '../invoices.module.css';
import { InvoiceData } from "../_utils/types";
import { getCellValueByColumnHeading } from "../_utils/dataTools";

export default function Invoices({ invoiceData }: { invoiceData?: InvoiceData }) {
  if (!invoiceData?.customerData || !invoiceData.metadata) {
    return;
  }

  const customerInfo = invoiceData.customerData.slice(1);
  const { month, year } = invoiceData.metadata;
  return (
    <div>
      {customerInfo?.map((row, i) => {
        const fullName = getCellValueByColumnHeading(row, 'Full Name');
        const addressLine1 = getCellValueByColumnHeading(row, 'Address Line 1');
        const addressLine2 = getCellValueByColumnHeading(row, 'Address Line 2');
        const city = getCellValueByColumnHeading(row, 'City');
        const state = getCellValueByColumnHeading(row, 'State');
        const zip = getCellValueByColumnHeading(row, 'Zip');
        const location = getCellValueByColumnHeading(row, 'Location');
        const totalOwed = getCellValueByColumnHeading(row, 'Total Owed');

        return (
          <div key={i} className={styles.invoice}>
            <div>Invoice period: {month} {year}</div>
            -
            <div>Name: {fullName}</div>
            -
            <div>
              <div>Address:</div>
              <div>{addressLine1}</div>
              <div>{addressLine2}</div>
              <div>{city}, {state} {zip}</div>
            </div>
            -
            <div>Parking Location: {location}</div>
            -
            <div>Total Owed: ${totalOwed}</div>
          </div>
        );
      })}
    </div>
  );
}
