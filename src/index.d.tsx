interface PayslipData {
  emp_code: number;
  emp_name: string;
  emp_email: string;
  emp_joining_date: string;
  emp_designation: string;
  payable_days: number;
  regime_opted: string;
  total: number;
  tds: number;
  department: string;
  pay_period: string;
  reimbursement: number;
  loss_of_pay: number;
}

interface Payslip {
  fileName: string;
  fileurl: string;
  arrayBuffer: ArrayBuffer;
}
