import {Component} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import _for = require("core-js/fn/symbol/for");
import * as moment from 'moment/moment';

@Component({
  selector: 'my-app',
  templateUrl: 'app/index.html',
  // directives: [UIChart]
})


export class AppComponent {


  data:any;
  datapie:any;


  results:any = [];
  groups:any = [];
  MortgageAmount:number;
  MortgageAmortizationInMonths:number;
  InterestRate:number;
  MonthlyInterestRate:number;
  MortgageAmortizationConvertedtoYears:any;
  MortgageAmortizationConvertedtoMonths:number;
  MortgagePayment:number;
  PaymentFrequency:string;
  TotalCostofLoan:number;
  InterestPaidforTerm:number;
  InterestRatePerPayment:number;
  PeriodsPerYear:number;
  TotalNumberofPayments:number;
  FirstPaymentDate:any;
  AdjustDateBy:any;
  AdjustDateByStr:any;
  PayOffDate:any;
  PayOffDateDiff:any;
  ExtraPayment:number;
  PaymentInterval:any;
  ExtraAnnualPayment:any;

  ChartLabelsArray:any = [];
  ChartDataArray:any = [];
  ChartDataArrayExtra:any = [];
  private var1: string;
  private var2: string;


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
  CompoundPeriod:number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.var1 = params['var1'];
      this.var2 = params['var2'];
    });

  console.log(this.var1, this.var2);




    // Initialize all the preconfigured values on the first load
    this.MortgageAmount = 300000;
    this.MortgageAmortizationInMonths = 300;
    this.InterestRate = 3.33;
    this.PaymentFrequency = "Monthly";
    this.CompoundPeriod = 2;
    this.FirstPaymentDate = TodaysDate();

    // Initialize Extra Payment values
    this.ExtraPayment = 0;
    this.PaymentInterval = 0;
    this.ExtraAnnualPayment = 0;


    // Start the calculation
    this.calculateMortgage();
  }











  calculateMortgage() {
    console.log("--START--");





    this.groups = [];
    this.data = [];
    this.datapie = [];
    this.ChartLabelsArray = [];
    this.ChartDataArray = [];
    this.ChartDataArrayExtra = [];



    // Generate chart

    this.data = {
      labels: this.ChartLabelsArray,
      datasets: [
        {
          label: 'Total Interest',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [0]
        },
        {
          label: 'Balance',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [0]
        }

      ]
    }


    this.datapie = {
      labels: ['Mortgage Amount', 'Total Interest Paid'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };



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
      this.AdjustDateBy = 1;
      this.AdjustDateByStr = "year";
    }
    if (this.PaymentFrequency === "Semi-Annually") {
      this.PeriodsPerYear = 2;
      this.AdjustDateBy = 6;
      this.AdjustDateByStr = "months";
    }
    if (this.PaymentFrequency === "Quarterly") {
      this.PeriodsPerYear = 4;
      this.AdjustDateBy = 3;
      this.AdjustDateByStr = "months";
    }
    if (this.PaymentFrequency === "Bi-Monthly") {
      this.PeriodsPerYear = 6;
      this.AdjustDateBy = 2;
      this.AdjustDateByStr = "months";
    }
    if (this.PaymentFrequency === "Monthly") {
      this.PeriodsPerYear = 12;
      this.AdjustDateBy = 1;
      this.AdjustDateByStr = "month";
    }
    if (this.PaymentFrequency === "Semi-Monthly") {
      this.PeriodsPerYear = 24;
      this.AdjustDateBy = 1 / 2;
      this.AdjustDateByStr = "month";
    }
    if (this.PaymentFrequency === "Bi-Weekly") {
      this.PeriodsPerYear = 26;
      this.AdjustDateBy = 2;
      this.AdjustDateByStr = "weeks";
    }
    if (this.PaymentFrequency === "Weekly") {
      this.PeriodsPerYear = 52;
      this.AdjustDateBy = 1;
      this.AdjustDateByStr = "week";
    }
    if (this.PaymentFrequency === "Acc. Bi-Weekly") {
      this.PeriodsPerYear = 26;
      this.AdjustDateBy = 2;
      this.AdjustDateByStr = "weeks";
    }
    if (this.PaymentFrequency === "Acc. Weekly") {
      this.PeriodsPerYear = 52;
      this.AdjustDateBy = 1;
      this.AdjustDateByStr = "week";
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
    this.MortgagePayment = -PMT(this.MonthlyInterestRate, this.MortgageAmortizationInMonths, this.MortgageAmount, 0, 0) / (this.PeriodsPerYear / 12);
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
    var paymentInterval:number = this.PaymentInterval;
    var extraPayment:number = this.ExtraPayment;
    var extraAnnualPayment:number = this.ExtraAnnualPayment;
    var extraPaymentFinal:number = 0;
    var balance:number = this.MortgageAmount;
    var mortgagePayment:number = this.MortgagePayment;
    var interestPaidFinal:number = 0;
    var numberofPayments:number = Math.ceil(this.TotalNumberofPayments);
    var finalDate:any;
    var finalDate2:any;
    var dueDate = new Date(Date.parse(this.FirstPaymentDate));

    if ((this.MortgageAmount >= 10) && (this.MortgageAmortizationInMonths <= 420)) {

      for (var i = 1; i <= numberofPayments; i++) {

        interestPaid = balance * this.InterestRatePerPayment;
        principal = (this.MortgagePayment - interestPaid);

        extraPaymentFinal = 0;
        // add extra payments
        if (i && (i % paymentInterval === 0)) {
          principal = principal + extraPayment;
          extraPaymentFinal = extraPayment;
        }

        if (i && (i % this.PeriodsPerYear === 0)) {
          principal = principal + extraAnnualPayment;
          extraPaymentFinal = extraPaymentFinal + extraAnnualPayment;
        }


        // console.log("--extraPaymentflag:" + extraPaymentflag);


        if (this.PaymentFrequency === "Semi-Monthly") {
          if (i % 2 === 1) {
            finalDate = moment(dueDate).utc().add(this.AdjustDateBy * (i - 1), this.AdjustDateByStr).format('MMMM Do YYYY');
            finalDate2 = moment(dueDate).utc().add(this.AdjustDateBy * (i), this.AdjustDateByStr).add(1, 'day');
          } else {
            finalDate = moment(dueDate).utc().add(this.AdjustDateBy * (i - 1), this.AdjustDateByStr).subtract(2, 'weeks').format('MMMM Do YYYY');
            finalDate2 = moment(dueDate).utc().add(this.AdjustDateBy * (i), this.AdjustDateByStr).subtract(2, 'weeks').add(1, 'day');
          }
        } else {
          finalDate = moment(dueDate).utc().add(this.AdjustDateBy * (i - 1), this.AdjustDateByStr).format('MMMM Do YYYY');
          finalDate2 = moment(dueDate).utc().add(this.AdjustDateBy * (i), this.AdjustDateByStr).add(1, 'day');
        }


        //if ((this.PaymentFrequency === "Acc. Bi-Weekly") || (this.PaymentFrequency === "Acc. Weekly") ) {
        if (balance < principal) {

          finalDate = moment(dueDate).utc().add(this.AdjustDateBy * (i), this.AdjustDateByStr).format('MMMM Do YYYY');

          this.groups.push({
            members: [{
              indexArray: i,
              dueArray: finalDate,
              paymentArray: (interestPaid + balance).toFixed(2),
              extraPaymentArray: 0,
              interestPaidArray: interestPaid.toFixed(2),
              principalArray: balance.toFixed(2),
              balanceArray: 0
            }]
          });
          mortgagePayment = interestPaid + balance;
          principal = balance;
          balance = 0;
          this.TotalNumberofPayments = i;
          interestPaidFinal = interestPaidFinal + interestPaid;

          //Add values to Chart
          this.ChartLabelsArray[i] = finalDate;
          this.ChartDataArray[i] = 0;
          this.ChartDataArrayExtra[i] = interestPaidFinal.toFixed(2);

          break;
        }
        // }


        if (i === numberofPayments) {
          mortgagePayment = interestPaid + balance;
          this.groups.push({
            members: [{
              indexArray: i,
              dueArray: finalDate,
              paymentArray: mortgagePayment.toFixed(2),
              extraPaymentArray: extraPaymentFinal.toFixed(2),
              interestPaidArray: interestPaid.toFixed(2),
              principalArray: balance.toFixed(2),
              balanceArray: 0
            }]
          });
          interestPaidFinal = interestPaidFinal + interestPaid;
          balance = balance - principal;
          this.PayOffDate = finalDate;
          this.TotalNumberofPayments = numberofPayments;
          //Add values to Chart
          this.ChartLabelsArray[i] = finalDate;
          this.ChartDataArray[i] = 0;
          this.ChartDataArrayExtra[i] = interestPaidFinal.toFixed(2);
        } else {
          balance = balance - principal;
          this.groups.push({
            members: [{
              indexArray: i,
              dueArray: finalDate,
              paymentArray: mortgagePayment.toFixed(2),
              extraPaymentArray: extraPaymentFinal.toFixed(2),
              interestPaidArray: interestPaid.toFixed(2),
              principalArray: principal.toFixed(2),
              balanceArray: balance.toFixed(2)
            }]
          });
          interestPaidFinal = interestPaidFinal + interestPaid;
          this.ChartLabelsArray[i] = finalDate;
          this.ChartDataArray[i] = balance.toFixed(2);
          this.ChartDataArrayExtra[i] = interestPaidFinal.toFixed(2);
        }


        if (principal > balance) {
          principal = balance;
        }

      }

      this.InterestPaidforTerm = interestPaidFinal;
      this.TotalCostofLoan = this.MortgageAmount + interestPaidFinal;
      this.PayOffDate = finalDate;


      // console.log("a: " + a + " | " + "b: " + b);
      var dateObj = new Date(Date.parse(finalDate2));
      this.PayOffDateDiff = moment.duration(moment(dueDate).diff(moment(dateObj))).years().toString().replace("-", "") + " yrs, " +
        moment.duration(moment(dueDate).diff(moment(dateObj))).months().toString().replace("-", "") + " mth"
      //  +  ", " + moment.duration(moment(dueDate).diff(moment(dateObj))).days().toString().replace("-","") + " days"
      ;
      //console.log("--Zaciatok:" + moment(dueDate) + "--Koniec:" + moment(dateObj));


    }




// Generate chart

    this.data = {
      labels: this.ChartLabelsArray,
      datasets: [
        {
          label: 'Total Interest',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: this.ChartDataArrayExtra
        },
        {
          label: 'Balance',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: this.ChartDataArray
        }

      ]
    }


    this.datapie = {
      labels: ['Mortgage Amount', 'Total Interest Paid'],
      datasets: [
        {
          data: [this.MortgageAmount, interestPaidFinal.toFixed(2)],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };



    // Error checking
    var dateCheck:any = moment(new Date(Date.parse(this.FirstPaymentDate))).utc().add(this.AdjustDateBy * (i - 1), this.AdjustDateByStr).format('MMMM Do YYYY');

    if ((isNaN(this.PaymentInterval) === true) || (this.PaymentInterval < 0)){this.PaymentInterval = 0;return;}
    if ((isNaN(this.ExtraPayment) === true) || (this.ExtraPayment < 0) || (this.ExtraPayment > this.MortgageAmount)){this.ExtraPayment = 0;this.PaymentInterval = 0; return;}
    if ((isNaN(this.ExtraAnnualPayment) === true) || (this.ExtraAnnualPayment < 0)) {this.ExtraAnnualPayment = 0;return;}

    if ((isNaN(this.MortgageAmount) === true) || (this.MortgageAmount < 0)){this.MortgageAmount = 0;return;}
    if ((isNaN(this.MortgageAmortizationInMonths) === true) || (this.MortgageAmortizationInMonths < 0)){this.MortgageAmortizationInMonths = 0;return;}
    if ((isNaN(this.InterestRate) === true) || (this.InterestRate < 0) || (this.InterestRate > 100)){this.InterestRate = 0;return;}
    if ((isNaN(this.MortgagePayment) === true) || (this.MortgagePayment < 0)) {this.MortgagePayment = 0;return;}
    if ((isNaN(this.TotalCostofLoan) === true) || (this.TotalCostofLoan < 0)) {this.TotalCostofLoan = 0;return;}

    if (dateCheck.indexOf("Invalid date") >-1){this.FirstPaymentDate = TodaysDate();}

    if (this.TotalNumberofPayments < 1) {
      this.PayOffDate = "";
      this.PayOffDateDiff = "";
      this.TotalNumberofPayments = 0;
      return;
    }

    if ((this.MortgageAmortizationInMonths < 0) || (this.MortgageAmortizationInMonths > 420)) {
      this.MortgageAmortizationConvertedtoYears = "ERROR: Min: 0 | Max: 420";
      return;
    }











    console.log("--END--");






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

function TodaysDate() {
  var today:any = new Date();
  var dd:any = today.getDate();
  var mm:any = today.getMonth() + 1;
  var yyyy:any = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  var today:any = yyyy + "-" + mm + '-' + dd;
  return today;
}
