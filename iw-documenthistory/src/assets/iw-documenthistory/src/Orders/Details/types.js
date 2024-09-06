export const CREATE_DUPLICATE_ORDER = 'CREATE_DUPLICATE_ORDER'
export const GET_ORDER_DETAILS = 'GET_ORDER_DETAILS'
export const GET_ORDER_TRACKING = 'GET_ORDER_TRACKING'

/**
 * Represents all the possible payment types a customer may have.
 */
export const GET_PAYMENT_TYPES = {
  'general.payment.terms.net.5.days': 'Net 5 DAYS',
  'general.payment.terms.net.30.days': 'Net 30 Days',
  'general.payment.terms.net.40.days': 'Net 40 Days',
  'general.payment.terms.net.45.days': 'Net 45 Days',
  'general.payment.terms.net.60.days': 'Net 60 Days',
  'general.payment.terms.net.75.days': 'Net 75 Days',
  'general.payment.terms.net.90.days': 'Net 90 Days',
  'general.payment.terms.service.net.30.days': 'Service net 30 Days',
  'general.payment.terms.ds.duplicate.net.30.days': 'DS duplicate net 30 days',
  'general.payment.terms.educational.rebate.net.30.days': 'Educational rebate net 30 days',
  'general.payment.terms.erate.net.30.days': 'eRate Net 30',
  'general.payment.terms.lease.net.30.days': 'Lease net 30 days',
  'general.payment.terms.igf.lease.net.30.days': 'IGF lease net 30 days',
  'general.payment.terms.igf.lease.net.90.days': 'IGF lease net 90 days',
  'general.payment.terms.credit.card': 'Credit Card',
  'general.payment.terms.service.credit.card': 'Credit Card',
  'general.payment.terms.special.ep.card': 'Procurement card',
  'general.payment.terms.floor.plan.net.20.days': 'Floor plan net 20 days',
  'general.payment.terms.wire.transfer': 'Wire transfer',
  'general.payment.terms.evaluation': 'Evaluation',
  'general.payment.terms.annual.payment': 'Annual Payment',
  'general.payment.terms.net.98.payroll.deduction': 'Net 98 payroll deduction',
  'general.payment.terms.two.percent.10.net.45.days': '2% 10, net 45 days',
  'general.payment.terms.one.and.one.half.percent.10.net.30.days': '1.5% 10 Net 30 days',
  'general.payment.terms.one.percent.10.net.30.days': '1.0% 10 Net 30 days',
  'general.payment.terms.unknown': 'unknown',
  'general.payment.terms.eom.30.days':'EOM 30 DAYS',
  'general.payment.terms.eom.45.days':'EOM 45 DAYS',
  'general.payment.terms.eom.60.days':'EOM 60 DAYS',
  'general.payment.terms.eom.60.plus.7.days':'EOM 60 DAYS + 7',
  'general.payment.terms.net.67.days':'NET 67 DAYS',
  'general.payment.terms.eom.75.days':'EOM 75 DAYS',
  'general.payment.terms.eom.90.days':'EOM 90 DAYS',
  'general.payment.terms.eom.120.days':'EOM 120 DAYS',
  'general.payment.terms.eom.150.days':'EOM 150 DAYS',
  'general.payment.terms.eom.160.days':'EOM 160 DAYS',
  'general.payment.terms.prepay':'PREPAY',
  'general.payment.terms.one.percent.7.net.14':'1% 7, NET 14',
  'general.payment.terms.two.percent.7.net.14':'2% 7, NET 14',
  'general.payment.terms.three.percent.7.net.14':'3% 7, NET 14',
  'general.payment.terms.two.percent.14.net.30':'2% 14, NET 30',
  'general.payment.terms.three.percent.14.net.30':'3% 14, NET 30',
  'general.payment.terms.three.percent.60.net.60':'3% 60, NET 60',
  'general.payment.terms.eom.30.days.from.statement.date':'EOM 30 Days from Statement Date',
  'general.payment.terms.eom.60.days.from.statement.date':'EOM 60 Days from Statement Date',
  'general.payment.terms.eom.120.days.from.statement.date':'EOM 120 Days from Statement Date',
  'general.payment.terms.two.percent.10.net.30':'2% 10, NET 30',
  'general.payment.terms.two.percent.15.net.30':'2% 15, NET 30',
  'general.payment.terms.two.percent.21.net.30':'2% 21, NET 30',
  'general.payment.terms.three.percent.21.net.30':'3% 21, NET 30',
  'general.payment.terms.three.percent.30.net.90':'3% 30, NET 90',
  'general.payment.terms.three.percent.60.net.120':'3% 60, NET 120',
  'general.payment.terms.two.percent.8.net.30':'2% 8, NET 30'
}

/**
 * Represents the possible credit statuses a customer may have.
 */
export const GET_CREDIT_STATUS = {
  'general.credit.status.in.process': 'In process',
  'general.credit.status.credit.ok': 'Credit OK',
  'general.credit.status.contact.rep.1': 'Contact Sales Rep (1)',
  'general.credit.status.contact.rep.2': 'Contact Sales Rep (2)',
  'general.credit.status.released': 'Released',
  'general.credit.status.approved': 'Approved',
  'general.credit.status.not.approved': 'Not approved',
  'general.credit.status.approved.part.released': 'Approved, part released',
}

/**
 * Represents options for select input on Shipments Tab.
 */
export const GET_SHIPMENT_OPTIONS = {
  ALL: 'All',
  SHIPPING_NEXT: 'Shipping next',
  NO_SHIPPING_DATE: 'No estimated shipping date',
}
