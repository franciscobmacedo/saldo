import { Page } from 'playwright';
import { simulateIndependentWorker } from '../../src/independent-worker/simulator';
import { SimulateIndependentWorkerOptions, IndependentWorkerResult } from '../../src/independent-worker/schemas';

export interface WebSimulatorResult {
  grossIncome: number;
  netIncome: number;
  ssPay: number;
  irsPay: number;
  taxableIncome: number;
  expenses: number;
}

export interface ComparisonDetail {
  name: string;
  ourResult: number;
  webResult: number;
  difference: number;
  matches: boolean;
}

export interface ComparisonResult {
  passed: boolean;
  details: ComparisonDetail[];
}

export class IndependentWorkerComparator {
  private static readonly DEFAULT_TOLERANCE = 0.01; // 1 cent tolerance

  /**
   * Maps our simulator parameters to the web simulator URL parameters
   */
  static buildWebSimulatorUrl(options: SimulateIndependentWorkerOptions): string {
    const baseUrl = 'https://freelancept.fmacedo.com/#/';
    const params = new URLSearchParams();
    
    // Map our parameters to web simulator parameters
    params.set('income', options.income.toString());
    params.set('displayFrequency', 'year'); // Always use year for comparison
    params.set('incomeFrequency', options.incomeFrequency || 'year');
    params.set('currentTaxRankYear', (options.currentTaxRankYear || 2025).toString());
    params.set('nrMonthsDisplay', '12');
    params.set('nrDaysOff', (options.nrDaysOff || 0).toString());
    params.set('ssDiscount', (options.ssDiscount || 0).toString());
    params.set('benefitsOfYouthIrs', (options.benefitsOfYouthIrs || false).toString());
    params.set('rnh', (options.rnh || false).toString());
    params.set('expenses', (options.expenses || 0).toString());
    params.set('yearOfYouthIrs', (options.yearOfYouthIrs || 0).toString());
    
    // Map date-based parameters
    if (options.dateOfOpeningActivity) {
      const now = new Date();
      const openingYear = options.dateOfOpeningActivity.getFullYear();
      const currentYear = now.getFullYear();
      
      params.set('firstYear', (openingYear === currentYear).toString());
      params.set('secondYear', (openingYear === currentYear - 1).toString());
      
      // Check if within first 12 months for SS discount
      const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
      params.set('ssFirstYear', (options.dateOfOpeningActivity >= twelveMonthsAgo).toString());
    } else {
      params.set('firstYear', 'false');
      params.set('secondYear', 'false');
      params.set('ssFirstYear', 'false');
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Extracts simulation results from the web page
   */
  static async extractWebSimulatorResults(page: Page): Promise<WebSimulatorResult> {
    // Wait for the page to load and calculations to complete
    await page.waitForLoadState('networkidle');
    // await page.waitForTimeout(2000); // Give time for calculations
    
    // Extract the results from the table rows
    const results = await page.evaluate(() => {
      const extractedResults: any = {};
      
      // Get the input value to confirm it's correct
      const incomeInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      const inputIncome = incomeInput ? incomeInput.value.replace(/\s/g, '') : 'not found';
      
      // Extract values from the table rows
      const rows = document.querySelectorAll('table tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const label = cells[0].textContent?.trim() || '';
          const yearValue = cells[1] ? cells[1].textContent?.trim() || '' : '';
          
          if (yearValue.includes('€')) {
            const numericValue = parseFloat(yearValue.replace(/[€,\s]/g, ''));
            if (!isNaN(numericValue)) {
              extractedResults[label] = numericValue;
            }
          } else if (yearValue === '-') {
            extractedResults[label] = 0; // Handle the "-" case for expenses
          }
        }
      });
      
      return {
        inputIncome: parseFloat(inputIncome),
        grossIncome: extractedResults['Gross income'] || 0,
        netIncome: extractedResults['Net income'] || 0,
        ssPay: extractedResults['Social security'] || 0,
        irsPay: extractedResults['IRS'] || 0,
        taxableIncome: extractedResults['Taxable income'] || 0,
        expenses: extractedResults['Expenses'] || 0,
      };
    });
    
    return results;
  }

  /**
   * Compares our simulator results with web simulator results
   */
  static compareResults(
    ourResult: IndependentWorkerResult, 
    webResult: WebSimulatorResult, 
    tolerance: number = IndependentWorkerComparator.DEFAULT_TOLERANCE
  ): ComparisonResult {
    const comparisons = [
      {
        name: 'Gross Income (Year)',
        ourResult: ourResult.grossIncome.year,
        webResult: webResult.grossIncome,
      },
      {
        name: 'Net Income (Year)',
        ourResult: ourResult.netIncome.year,
        webResult: webResult.netIncome,
      },
      {
        name: 'Social Security Pay (Year)',
        ourResult: ourResult.ssPay.year,
        webResult: webResult.ssPay,
      },
      {
        name: 'IRS Pay (Year)',
        ourResult: ourResult.irsPay.year,
        webResult: webResult.irsPay,
      },
      {
        name: 'Taxable Income',
        ourResult: ourResult.taxableIncome,
        webResult: webResult.taxableIncome,
      },
    ];

    const details: ComparisonDetail[] = comparisons.map(comparison => {
      const difference = Math.abs(comparison.ourResult - comparison.webResult);
      const matches = difference <= tolerance;
      
      return {
        name: comparison.name,
        ourResult: comparison.ourResult,
        webResult: comparison.webResult,
        difference,
        matches,
      };
    });

    const passed = details.every(detail => detail.matches);

    return { passed, details };
  }

  /**
   * Runs a single comparison test
   */
  static async runSingleComparison(
    page: Page,
    options: SimulateIndependentWorkerOptions,
    tolerance: number = IndependentWorkerComparator.DEFAULT_TOLERANCE
  ): Promise<{ 
    passed: boolean; 
    details: ComparisonDetail[]; 
    ourResult: IndependentWorkerResult; 
    webResult: WebSimulatorResult;
    url: string;
  }> {
    // Calculate using our simulator
    const ourResult = simulateIndependentWorker(options);
    
    // Navigate to web simulator
    const url = IndependentWorkerComparator.buildWebSimulatorUrl(options);
    await page.goto(url);
    
    // Set the correct income value (URL params might not work properly)
    await page.fill('input[type="text"]', options.income.toString());
    // await page.waitForTimeout(2000); // Wait for calculations to update
    
    // Extract results from web simulator
    const webResult = await IndependentWorkerComparator.extractWebSimulatorResults(page);
    
    // Compare results
    const comparison = IndependentWorkerComparator.compareResults(ourResult, webResult, tolerance);
    
    return {
      passed: comparison.passed,
      details: comparison.details,
      ourResult,
      webResult,
      url,
    };
  }
}
