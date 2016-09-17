import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: 'app/main.html'
})

export class AppComponent {
//  results:any = [];
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

  ngOnInit() {
    console.log("--APP Started--");
    this.MortgageAmount = 250000;
    this.MortgageAmortizationInMonths = 240;
    this.InterestRate = 2.20;
    this.PaymentFrequency = "Monthly";
    this.pushMe();
  }

  pushMe() {
    console.log("--START--");

    // format Mortgage Amount to String
//    this.MortgageAmountString = currencyFormat(this.MortgageAmount);

    //this.results = [];
    //var input:any;

    /*
     Converting a Semi-Annual Rate to a Monthly Rate
     If the nominal interest rate is R (expressed as a decimal rather than percent), then the monthly interest rate is
     (1 + R/2)1/6 - 1.
     For example, if the annual interest rate is R = 0.066 (6.6%), then the monthly rate is
     (1 + 0.033)1/6 - 1 = 0.00542587 (equivalently 0.542587%).
     */

    this.MortgageAmortizationConvertedtoYears = Math.floor(this.MortgageAmortizationInMonths / 12);
    this.MortgageAmortizationConvertedtoMonths = +(this.MortgageAmortizationInMonths % 12).toFixed(0);
    this.MonthlyInterestRate = +(Math.pow(1 + ((this.InterestRate/100)/2) , 1/6)-1).toFixed(6);
    console.log("MonthlyInterestRate: " + this.MonthlyInterestRate);

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
    this.MortgagePayment = +(((this.MortgageAmount*this.MonthlyInterestRate)*(Math.pow(1+this.MonthlyInterestRate, this.MortgageAmortizationInMonths)) / (Math.pow(1+this.MonthlyInterestRate, this.MortgageAmortizationInMonths)-1)).toFixed(2));
    this.TotalCostofLoan = this.MortgagePayment * this.MortgageAmortizationInMonths;

    // Then based on the Monthly Mortgage Payment - calculate the Mortgage Payments and Total Cost of Loan (depending on the selection of payment frequency)
    if (this.PaymentFrequency==="Weekly") {
      this.MortgagePayment = +((this.MortgagePayment/4).toFixed(2));
      this.TotalCostofLoan = (this.MortgagePayment * this.MortgageAmortizationInMonths)*4;
    } else if (this.PaymentFrequency==="Bi-Weekly") {
      this.MortgagePayment = +((this.MortgagePayment/2).toFixed(2));
      this.TotalCostofLoan = (this.MortgagePayment * this.MortgageAmortizationInMonths)*2;
    } else if (this.PaymentFrequency==="Accelerated Bi-Weekly") {
      this.MortgagePayment = +(((this.MortgagePayment*12)/26).toFixed(2));
      this.TotalCostofLoan = ((this.MortgagePayment * 26)/12)*this.MortgageAmortizationInMonths;
    }

    // Calculate Interest Paid for Term
    this.InterestPaidforTerm = this.TotalCostofLoan - this.MortgageAmount;

    // Fix for Interest rate = 0
    if (this.InterestRate <= 0) {
      this.MortgagePayment = this.MortgageAmount/this.MortgageAmortizationInMonths;
      this.TotalCostofLoan = this.MortgageAmount;
      this.InterestPaidforTerm = 0;
    }

    //
    console.log("MortgagePayment: " + this.MortgagePayment);
    console.log("--END--");


    function currencyFormat (num:number) {
      return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
  }
}
