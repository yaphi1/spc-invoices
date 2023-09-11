import styles from '../invoices.module.css';
import { CustomerDataRow, InvoiceData } from "../_utils/types";

function getDate() {
  return (new Date()).toLocaleDateString("en-US");
}
function getInvoiceNumber(index: number) {
  const dateWithoutSlashes = getDate().replace(/\//g, '');
  const invoiceNumber = `#00${dateWithoutSlashes}00${index}`;
  return invoiceNumber;
}

export default function Invoices({ invoiceData }: { invoiceData?: InvoiceData }) {
  if (!invoiceData?.customerData || !invoiceData.metadata) {
    return;
  }
  const { customerData } = invoiceData;
  const {
    address,
    companyName,
    federalId,
    instructions,
    otherInfo,
    phone,
    month,
    year,
  } = invoiceData.metadata;

  const itemKeys = {
    reserved: 'Reserved spaces',
    nonReserved: 'Non-reserved spaces',
    taxExempt: 'Tax exempt',
    lateFees: 'Late fees',
  }

  function getItemDetails(customer: CustomerDataRow) {
    const itemDetails = [
      {
        label: 'Reserved spaces',
        price: customer['UPR - Unit price reserved'],
        quantity: customer[itemKeys.reserved],
      },
      {
        label: 'Non-reserved spaces',
        price: customer['UPNR - unit price non-reserved'],
        quantity: customer[itemKeys.nonReserved],
      },
      {
        label: 'Tax-exempt spaces (if applicable)',
        price: customer['UPT - unit price tax-exempt'],
        quantity: customer[itemKeys.taxExempt],
      },
      {
        label: 'Late Fees (if applicable)',
        price: customer['UPL - unit price of late fees'],
        quantity: customer[itemKeys.lateFees],
      },
    ];

    return itemDetails;
  };

  return (
    <div>
      {customerData.map((customer, i) => {
        const fullName = customer['Full Name'];
        const addressLine1 = customer['Address Line 1'];
        const addressLine2 = customer['Address Line 2'];
        const city = customer['City'];
        const state = customer['State'];
        const zip = customer['Zip'];
        const location = customer['Location'];
        const remainingBalance = customer['Remaining Balance'];
        const totalOwed = customer['Total Owed'];
        const notes = customer['Notes'];

        const itemDetails = getItemDetails(customer);

        return (
          <div key={i} className={styles.invoice}>

            <div className={styles.topBar}>
              <div className={styles.letterhead}>
                <div className={styles.companyName}>{companyName}</div>
                <div>{address.street}</div>
                {address.streetLine2 && <div>{address.streetLine2}</div>}
                <div>{address.city}, {address.state} {address.zip}</div>
                <div>Phone: {phone}</div>
              </div>
              <div className={styles.invoiceTitleContainer}>
                <div className={styles.invoiceTitle}>
                  Invoice
                </div>
                <div>
                  {getInvoiceNumber(i)}
                </div>
                <div>
                  {getDate()}
                </div>
              </div>
            </div>

            <div className={styles.billingAddress}>
              <div className={styles.billingAddressHeading}>Bill to:</div>
              <div>{fullName}</div>
              <div>{addressLine1}</div>
              <div>{addressLine2}</div>
              <div>{city}, {state} {zip}</div>
            </div>

            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <td>Payment Due</td>
                  <td>Parking Location</td>
                  <td>For</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{month} 1, {year}</td>
                  <td>{location}</td>
                  <td>{month} {year}</td>
                </tr>
              </tbody>
            </table>

            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <td>Item</td>
                  <td className={styles.numericalColumn}>Quantity</td>
                  <td className={styles.numericalColumn}>Unit Price</td>
                  <td className={styles.numericalColumn}>Amount</td>
                </tr>
              </thead>
              <tbody>
                {itemDetails
                  .filter(lineItem => lineItem.quantity)
                  .map((lineItem, lineItemKey) => {
                    const amount = Number(lineItem.quantity) * Number(lineItem.price);
                    return (
                      <tr key={lineItemKey}>
                        <td>{lineItem.label}</td>
                        <td className={styles.numericalColumn}>{lineItem.quantity}</td>
                        <td className={styles.numericalColumn}>${lineItem.price}</td>
                        <td className={styles.numericalColumn}>${amount}</td>
                      </tr>
                    );
                  })
                }
                {remainingBalance && (
                  <tr>
                    <td>Leftover balance</td>
                    <td></td>
                    <td></td>
                    <td className={styles.numericalColumn}>${remainingBalance}</td>
                  </tr>
                )}
                <tr className={styles.finalRow}>
                  <td>Total amount due</td>
                  <td></td>
                  <td></td>
                  <td className={styles.numericalColumn}>${totalOwed}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.extraInfo}>
              <div className={styles.paymentInstructions}>
                {instructions}
              </div>
              <div className={styles.mailingAddressHeading}>
                Mailing Address:
              </div>
              <div className={styles.mailingAddressContent}>
                <div>{companyName}</div>
                <div>{address.street}</div>
                {address.streetLine2 && <div>{address.streetLine2}</div>}
                <div>{address.city}, {address.state} {address.zip}</div>
              </div>
              <div>{federalId}</div>

              {otherInfo && (
                <div className={styles.otherInfo}>Other Info: {otherInfo}</div>
              )}

              {notes && (
                <div className={styles.notes}>Notes: {notes}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
