import { MortgageCalcAngular2Page } from './app.po';

describe('mortgage-calc-angular2 App', function() {
  let page: MortgageCalcAngular2Page;

  beforeEach(() => {
    page = new MortgageCalcAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
