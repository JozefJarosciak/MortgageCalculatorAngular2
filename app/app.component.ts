import {Component} from '@angular/core';
import _for = require("core-js/fn/symbol/for");
import * as moment from 'moment/moment';

@Component({
  selector: 'my-app',
  templateUrl: 'app/index.html'
})


export class AppComponent {
  results:any = [];
  groups:any = [];
  MortgageAmount:number;
  MortgageAmortizationInMonths:number;
  InterestRate:number;
  MonthlyInterestRate:number;
  MortgageAmortizationConvertedtoYears:number;
  MortgageAmortizationConvertedtoMonths:number;
  MortgagePayment:number;
  PaymentFrequency:string;
  TotalCostofLoan:number;
  InterestPaidforTerm:number;
  CompoundPeriod:number;
  InterestRatePerPayment:number;
  PeriodsPerYear:number;
  TotalNumberofPayments:number;
  FirstPaymentDate:any;
  AdjustDateBy:any;
  AdjustDateByStr:any;
  PayOffDate:any;
  PayOffDateDiff:any;
  /*
   Compound Period:
   The number of times per year that the interest is compounded.
   Annually: 1 time per year
   Semi-Annually: 2 times per year
   Quarterly: 4 times per year
   Monthly: 12 times per year
   - Canadian mortgages are compounded semi-annually.
   - US mortgages are compounded monthly.
   */

  ngOnInit() {
    console.log("--APP Started--");
    this.MortgageAmount = 100000;
    this.MortgageAmortizationInMonths = 120;
    this.InterestRate = 2.00;
    this.PaymentFrequency = "Monthly";
    this.CompoundPeriod = 2;
    this.FirstPaymentDate = TodaysDate();

    this.pushMe();




  }

  pushMe() {
    console.log("--pushMe() START--");

    this.groups = [];
    this.MortgageAmortizationConvertedtoYears = Math.floor(this.MortgageAmortizationInMonths / 12);
    this.MortgageAmortizationConvertedtoMonths = +(this.MortgageAmortizationInMonths % 12).toFixed(0);
   // this.FirstPaymentDateFormat = TodaysDateFormat();
    /*
     Payment Frequency:
     This is used to determine the number of payments per year.
     Annually: 1 (once per year)
     Semi-Annually: 2 (twice per year)
     Quarterly: 4 times per year
     Bi-Monthly: 6 times per year
     Monthly: 12 times per year
     Semi-Monthly: 24 times per year (2 times per month)
     Bi-Weekly: 26 times per year (once every two weeks)
     Weekly: 52 times per year (once a week)
     Acc Bi-Weekly: 26 times per year, but payment is 1/2 a normal monthly payment
     Acc Weekly: 52 times per year, but payment is 1/4 a normal monthly payment

     */

    if (this.PaymentFrequency === "Annually") {
      this.PeriodsPerYear = 1;
      this.AdjustDateBy=1;
      this.AdjustDateByStr="year";
    }
    if (this.PaymentFrequency === "Semi-Annually") {
      this.PeriodsPerYear = 2;
      this.AdjustDateBy=6;
      this.AdjustDateByStr="months";
    }
    if (this.PaymentFrequency === "Quarterly") {
      this.PeriodsPerYear = 4;
      this.AdjustDateBy=3;
      this.AdjustDateByStr="months";
    }
    if (this.PaymentFrequency === "Bi-Monthly") {
      this.PeriodsPerYear = 6;
      this.AdjustDateBy=2;
      this.AdjustDateByStr="months";
    }
    if (this.PaymentFrequency === "Monthly") {
      this.PeriodsPerYear = 12;
      this.AdjustDateBy=1;
      this.AdjustDateByStr="month";
    }
    if (this.PaymentFrequency === "Semi-Monthly") {
      this.PeriodsPerYear = 24;
      this.AdjustDateBy=1/2;
      this.AdjustDateByStr="month";
    }
    if (this.PaymentFrequency === "Bi-Weekly") {
      this.PeriodsPerYear = 26;
      this.AdjustDateBy=2;
      this.AdjustDateByStr="weeks";
    }
    if (this.PaymentFrequency === "Weekly") {
      this.PeriodsPerYear = 52;
      this.AdjustDateBy=1;
      this.AdjustDateByStr="week";
    }
    if (this.PaymentFrequency === "Acc. Bi-Weekly") {
      this.PeriodsPerYear = 26;
      this.AdjustDateBy=2;
      this.AdjustDateByStr="weeks";
    }
    if (this.PaymentFrequency === "Acc. Weekly") {
      this.PeriodsPerYear = 52;
      this.AdjustDateBy=1;
      this.AdjustDateByStr="week";
    }

    // calculate Total Number of Payments (this may need to be reworked for accelerated schedule)
    this.TotalNumberofPayments = this.PeriodsPerYear * (this.MortgageAmortizationInMonths) / 12;


    /*
     Converting a Semi-Annual Rate to a Monthly Rate
     If the nominal interest rate is R (expressed as a decimal rather than percent), then the monthly interest rate is
     (1 + R/2)1/6 - 1.
     For example, if the annual interest rate is R = 0.066 (6.6%), then the monthly rate is
     (1 + 0.033)1/6 - 1 = 0.00542587 (equivalently 0.542587%).
     */
    // calculate Interest Rate for each Payment
    this.InterestRatePerPayment = +(((Math.pow(1 + ((this.InterestRate / 100) / 2), 1 / 6) - 1) * (12 / this.PeriodsPerYear))).toFixed(6);
    this.MonthlyInterestRate = +((Math.pow(1 + ((this.InterestRate / 100) / 2), 1 / 6) - 1)).toFixed(6);


    /*
     Calculating Monthly Payments and Total Interest
     If the monthly interest rate is i (as a decimal), the number of years N, and the principal P, then the monthly payment is given by the equation
     Monthly Payment = Pi(1+i)12N/[(1+i)12N - 1].
     For example, suppose you borrow $100,000 for 20 years at a nominal annual rate of 6.6%. Your three variables are P = 100000, N = 20, and i = 0.00542587. Your monthly payments are
     $100000(0.00542587)(1.00542587)240/[(1.00542587)240 - 1]
     = (542.587)(3.664488)/(2.664488)
     = $746.22.
     The total interest paid is the difference between the sum of all the monthly payments and the amount borrowed. For example, if you pay $746.22 a month for 20 years and the amount borrowed is $100,000, then the total interest is
     $746.22(240) - $100,000 = $79,092.80.
     */

    // Calculate a Monthly Mortgage Payment first
    //this.MortgagePayment = -(PMT(this.InterestRatePerPayment,this.MortgageAmortizationInMonths,this.MortgageAmount,0,0))/(this.PeriodsPerYear/12);
    this.MortgagePayment = -PMT(this.MonthlyInterestRate, this.MortgageAmortizationInMonths, this.MortgageAmount, 0, 0)/(this.PeriodsPerYear/12);
    this.TotalCostofLoan = (this.MortgagePayment * this.MortgageAmortizationInMonths) / (12 / this.PeriodsPerYear);
    //this.TotalCostofLoan = (this.MortgagePayment * this.TotalNumberofPayments);

    // Then based on the Monthly Mortgage Payment - calculate the Mortgage Payments and Total Cost of Loan (depending on the selection of payment frequency)
    if (this.PaymentFrequency === "Acc. Bi-Weekly") {
      this.MortgagePayment = -PMT(this.MonthlyInterestRate, this.MortgageAmortizationInMonths, this.MortgageAmount, 0, 0) / 2;
      this.TotalCostofLoan = ((this.MortgagePayment * 26) / 12) * this.MortgageAmortizationInMonths;
    } else if (this.PaymentFrequency === "Acc. Weekly") {
      this.MortgagePayment = -PMT(this.MonthlyInterestRate, this.MortgageAmortizationInMonths, this.MortgageAmount, 0, 0) / 4;
      this.TotalCostofLoan = ((this.MortgagePayment * 26) / 12) * this.MortgageAmortizationInMonths;
    }

    // Calculate Interest Paid for Term
    this.InterestPaidforTerm = this.TotalCostofLoan - this.MortgageAmount;

    // Fix for Interest rate = 0
    if (this.InterestRate <= 0) {
      this.MortgagePayment = this.MortgageAmount / this.MortgageAmortizationInMonths;
      this.TotalCostofLoan = this.MortgageAmount;
      this.InterestPaidforTerm = 0;
    }


    //Calculate Amortization Schedule

    /*
     For the first payment, we already know the total amount is $1,342.05.
     To determine how much of that goes toward interest, we multiply the remaining balance ($250,000) by the monthly interest rate: 250,000 x 0.416% = $1,041.67. T
     The rest goes toward the mortgage balance ($1,342.05 - $1,041.67 = $300.39). So after the first payment, the remaining amount on the mortgage is $249,699.61 ($250,000 - $300.39 = $249,699.61).
     The second payment's breakdown is similar except the mortgage balance has decreased. So the portion of the payment going toward interest is now slightly less: $1,040.42 ($249,699.61 * 0.416% = $1,040.42).
     */

    var interestPaid:number;
    var principal:number;
    var balance:number = this.MortgageAmount;
    var mortgagePayment:number = this.MortgagePayment;
    var interestPaidFinal:number = 0;
    var numberofPayments:number = Math.ceil(this.TotalNumberofPayments);
    var finalDate:any;
    var finalDate2:any;
    var dueDate = new Date(Date.parse(this.FirstPaymentDate));
    var semiMonthlyToggle:number = 0;

    if ((this.MortgageAmount >= 10) && (this.MortgageAmortizationInMonths <= 360)) {
      for (var i = 1; i <= numberofPayments; i++) {

      //  dueDate = moment(dueDate).add(this.AdjustDateBy, this.AdjustDateByStr).format('MMMM Do YYYY');

        //  for (var i = 1; i < 5; i++) {
        interestPaid = balance * this.InterestRatePerPayment;
        //console.log("balance: " + balance + " | InterestRatePerPayment: " + this.InterestRatePerPayment + " | interestPaid: " + interestPaid);
        //console.log("towardMortgageBalance: " + principal);
        principal = this.MortgagePayment - interestPaid;

        if (this.PaymentFrequency === "Semi-Monthly") {
         if (i % 2 === 1) {
           finalDate = moment(dueDate).utc().add(this.AdjustDateBy*(i-1), this.AdjustDateByStr).format('MMMM Do YYYY');
           finalDate2 = moment(dueDate).utc().add(this.AdjustDateBy*(i), this.AdjustDateByStr).add(1,'day');
         } else {
           finalDate = moment(dueDate).utc().add(this.AdjustDateBy*(i-1), this.AdjustDateByStr).subtract(2,'weeks').format('MMMM Do YYYY');
           finalDate2 = moment(dueDate).utc().add(this.AdjustDateBy*(i), this.AdjustDateByStr).subtract(2,'weeks').add(1,'day');
         }
        } else {
          finalDate = moment(dueDate).utc().add(this.AdjustDateBy*(i-1), this.AdjustDateByStr).format('MMMM Do YYYY');
          finalDate2 = moment(dueDate).utc().add(this.AdjustDateBy*(i), this.AdjustDateByStr).add(1,'day');
        }


        if (i===numberofPayments) {
          mortgagePayment =  interestPaid + balance;
          this.groups.push({
            members: [{
              index: i,
              duedate:finalDate,
              payment: mortgagePayment.toFixed(2),
              interestPaid: interestPaid.toFixed(2),
              principal: balance.toFixed(2),
              balance: 0
            }]
          });
          interestPaidFinal = interestPaidFinal+interestPaid;
          balance = balance - principal;
          this.PayOffDate = finalDate;
          this.TotalNumberofPayments = numberofPayments;
        } else {
          balance = balance - principal;
         this.groups.push({
            members: [{
              index: i,
              duedate:finalDate,
              payment: mortgagePayment.toFixed(2),
              interestPaid: interestPaid.toFixed(2),
              principal: principal.toFixed(2),
              balance: balance.toFixed(2)
            }]
          });
          interestPaidFinal = interestPaidFinal+interestPaid;
      }


        if ((this.PaymentFrequency === "Acc. Bi-Weekly") || (this.PaymentFrequency === "Acc. Weekly")) {
          if (balance<principal) {
            this.groups.push({
              members: [{
                index: i+1,
                duedate:finalDate,
                payment: (interestPaid + balance).toFixed(2),
                interestPaid: interestPaid.toFixed(2),
                principal: balance.toFixed(2),
                balance: 0
              }]
            });
            mortgagePayment =  interestPaid + balance;
            principal = balance;
            balance = 0;
            this.TotalNumberofPayments = i+1;
            interestPaidFinal = interestPaidFinal+interestPaid;
            break;
          }
        }


        if (principal>balance) {
          principal=balance;
        }






      }

      this.InterestPaidforTerm = interestPaidFinal;
      this.TotalCostofLoan = this.MortgageAmount+interestPaidFinal;
      this.PayOffDate = finalDate;


     // console.log("a: " + a + " | " + "b: " + b);
      var dateObj = new Date(Date.parse(finalDate2));
      this.PayOffDateDiff =  moment.duration(moment(dueDate).diff(moment(dateObj))).years().toString().replace("-","") + " years, " +
        moment.duration(moment(dueDate).diff(moment(dateObj))).months().toString().replace("-","") + " months and " +
        moment.duration(moment(dueDate).diff(moment(dateObj))).days().toString().replace("-","") + " days";
      //console.log("--Zaciatok:" + moment(dueDate) + "--Koniec:" + moment(dateObj));

    }


    // Error checking

    if (isNaN(this.MortgagePayment) === true) {
      this.MortgagePayment = 0;
    }
    if (isNaN(this.TotalCostofLoan) === true) {
      this.TotalCostofLoan = 0;
    }
    if (isNaN(this.InterestPaidforTerm) === true) {
      this.InterestPaidforTerm = 0;
    }


    //
   // console.log("MortgagePayment: " + this.MortgagePayment);
    // console.log("--pushMe() END--");






  }



}



function PMT(ir:number, np:number, pv:number, fv:number, type:number) {
  /*
   * ir   - interest rate per month
   * np   - number of periods (months)
   * pv   - present value
   * fv   - future value
   * type - when the payments are due:
   *        0: end of the period, e.g. end of month (default)
   *        1: beginning of period
   */
  var pmt:number;
  var pvif:number;

  fv || (fv = 0);
  type || (type = 0);

  if (ir === 0)
    return -(pv + fv) / np;

  pvif = Math.pow(1 + ir, np);
  pmt = -ir * pv * (pvif + fv) / (pvif - 1);

  if (type === 1)
    pmt /= (1 + ir);

  return pmt;
}

function TodaysDate () {
  var today:any = new Date();
  var dd:any = today.getDate();
  var mm:any = today.getMonth()+1;
  var yyyy:any = today.getFullYear();
  if(dd<10){dd='0'+dd}
  if(mm<10){mm='0'+mm}
  var today:any = yyyy + "-" + mm + '-' + dd;
  return today;
}
