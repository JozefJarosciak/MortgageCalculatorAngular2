import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: 'app/main.html'
})


export class AppComponent {
  results:any = [];
  groups:any = [];

  MortgageAmount:number;
  MortgageAmortizationInMonths:number;
  InterestRate:number;
  //MonthlyInterestRate:number;
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
    this.MortgageAmount = 250000;
    this.MortgageAmortizationInMonths = 240;
    this.InterestRate = 2.20;
    this.PaymentFrequency = "Monthly";
    this.CompoundPeriod = 2;



    this.pushMe();
   }

  pushMe() {
    console.log("--START--");



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

    if (this.PaymentFrequency==="Annually") {this.PeriodsPerYear = 1;}
    if (this.PaymentFrequency==="Semi-Annually") {this.PeriodsPerYear = 2;}
    if (this.PaymentFrequency==="Quarterly") {this.PeriodsPerYear = 4;}
    if (this.PaymentFrequency==="Bi-Monthly") {this.PeriodsPerYear = 6;}
    if (this.PaymentFrequency==="Monthly") {this.PeriodsPerYear = 12;}
    if (this.PaymentFrequency==="Semi-Monthly") {this.PeriodsPerYear = 24;}
    if (this.PaymentFrequency==="Bi-Weekly") {this.PeriodsPerYear = 26;}
    if (this.PaymentFrequency==="Weekly") {this.PeriodsPerYear = 52;}
    if (this.PaymentFrequency==="Accelerated Bi-Weekly") {this.PeriodsPerYear = 26;}
    if (this.PaymentFrequency==="Accelerated Weekly") {this.PeriodsPerYear = 52;}

    this.InterestRatePerPayment = +(((Math.pow(1 + ((this.InterestRate/100)/2) , 1/6)-1) * (12/this.PeriodsPerYear))).toFixed(6);

    this.TotalNumberofPayments = this.PeriodsPerYear * (this.MortgageAmortizationInMonths)/12;

    /*
     Converting a Semi-Annual Rate to a Monthly Rate
     If the nominal interest rate is R (expressed as a decimal rather than percent), then the monthly interest rate is
     (1 + R/2)1/6 - 1.
     For example, if the annual interest rate is R = 0.066 (6.6%), then the monthly rate is
     (1 + 0.033)1/6 - 1 = 0.00542587 (equivalently 0.542587%).
     */

    this.MortgageAmortizationConvertedtoYears = Math.floor(this.MortgageAmortizationInMonths / 12);
    this.MortgageAmortizationConvertedtoMonths = +(this.MortgageAmortizationInMonths % 12).toFixed(0);
    //this.MonthlyInterestRate = +(Math.pow(1 + ((this.InterestRate/100)/2) , 1/6)-1).toFixed(6);

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
     this.MortgagePayment = -(PMT(this.InterestRatePerPayment,this.MortgageAmortizationInMonths,this.MortgageAmount,0,0))/(this.PeriodsPerYear/12);
      //this.TotalCostofLoan = (this.MortgagePayment * this.MortgageAmortizationInMonths) / (12/this.PeriodsPerYear);
    this.TotalCostofLoan = (this.MortgagePayment * this.TotalNumberofPayments);

    // Then based on the Monthly Mortgage Payment - calculate the Mortgage Payments and Total Cost of Loan (depending on the selection of payment frequency)
    if (this.PaymentFrequency==="Accelerated Bi-Weekly") {
      this.MortgagePayment = -PMT(this.InterestRatePerPayment, this.MortgageAmortizationInMonths, this.MortgageAmount,0,0) / 2;
      this.TotalCostofLoan = ((this.MortgagePayment * 26) / 12) * this.MortgageAmortizationInMonths;
    } else if (this.PaymentFrequency==="Accelerated Weekly") {
      this.MortgagePayment = -PMT(this.InterestRatePerPayment, this.MortgageAmortizationInMonths, this.MortgageAmount,0,0) / 4;
      this.TotalCostofLoan = ((this.MortgagePayment * 26) / 12) * this.MortgageAmortizationInMonths;
    }

    // Calculate Interest Paid for Term
    this.InterestPaidforTerm = this.TotalCostofLoan - this.MortgageAmount;

    // Fix for Interest rate = 0
    if (this.InterestRate <= 0) {
      this.MortgagePayment = this.MortgageAmount/this.MortgageAmortizationInMonths;
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
    var towardMortgageBalance:number;
    var balance:number = this.MortgagePayment;


    this.groups =
      [{members: [
          { interestPaid: 'John', towardMortgageBalance: 'M', balance: 'M'},
          { interestPaid: 'Jane', towardMortgageBalance: 'F', balance: 'M'},
          { interestPaid: 'Jane', towardMortgageBalance: 'F', balance: 'M'}
        ]
      },
      ];




    for (var i = 1; i < this.TotalNumberofPayments; i++) {
      interestPaid = balance * this.InterestRatePerPayment;
      towardMortgageBalance = this.MortgagePayment - interestPaid;
      balance = this.MortgageAmount - towardMortgageBalance;

      this.groups.members = ({"interestPaid": interestPaid, "towardMortgageBalance": towardMortgageBalance, "balance":balance });
   //   this.groups.name[0].members[i].towardMortgageBalance = towardMortgageBalance;
//      this.groups.name[0].members[i].balance = balance;

     // this.groups.push({"interestPaid": interestPaid, "towardMortgageBalance": towardMortgageBalance, balance:balance });

      //this.groups.name[i].members[0]= interestPaid;
      //this.results[i] =  + "&emsp;" +   + "&emsp;" + balance;
    }


    //
    console.log("MortgagePayment: " + this.MortgagePayment);
    console.log("--END--");


    function currencyFormat (num:number) {
      return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
        return -(pv + fv)/np;

      pvif = Math.pow(1 + ir, np);
      pmt = - ir * pv * (pvif + fv) / (pvif - 1);

      if (type === 1)
        pmt /= (1 + ir);

      return pmt;
    }


  }



}
