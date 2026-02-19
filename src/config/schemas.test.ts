import { describe, it, expect } from "vitest";
import { 
  PeriodT, 
  VALID_PERIODS, 
  buildRetentionTableIdentifier,
  getAvailableYears,
  getPeriodForMonth,
  getPeriodsForYear,
  getYearFromPeriod,
} from "@/config/schemas";

describe("Period-related functionality", () => {
  describe("VALID_PERIODS", () => {
    it("should contain correct periods for 2025", () => {
      expect(VALID_PERIODS).toEqual([
        "2025-01-01_2025-07-31",
        "2025-08-01_2025-09-30",
        "2025-10-01_2025-12-31"
      ]);
    });

    it("should be readonly array", () => {
      expect(VALID_PERIODS).toBeInstanceOf(Array);
      expect(Object.isFrozen(VALID_PERIODS)).toBe(true);
      expect(() => {
        (VALID_PERIODS as any).push("invalid-period");
      }).toThrow();
    });
  });

  describe("getYearFromPeriod", () => {
    it("should extract year correctly from valid periods", () => {
      expect(getYearFromPeriod("2025-01-01_2025-07-31")).toBe(2025);
      expect(getYearFromPeriod("2025-08-01_2025-09-30")).toBe(2025);
      expect(getYearFromPeriod("2025-10-01_2025-12-31")).toBe(2025);
    });

    it("should throw error for invalid period format", () => {
      expect(() => getYearFromPeriod("invalid-period" as PeriodT)).toThrow(
        "Could not extract year from period: invalid-period"
      );
    });

    it("should throw error for period with non-numeric year", () => {
      expect(() => getYearFromPeriod("abcd-01-01_abcd-12-31" as PeriodT)).toThrow(
        "Could not extract year from period: abcd-01-01_abcd-12-31"
      );
    });
  });

  describe("year and month period resolution", () => {
    it("should expose available years from configured periods", () => {
      expect(getAvailableYears()).toEqual([2025]);
    });

    it("should return all periods for a valid year", () => {
      expect(getPeriodsForYear(2025)).toEqual([
        "2025-01-01_2025-07-31",
        "2025-08-01_2025-09-30",
        "2025-10-01_2025-12-31",
      ]);
    });

    it("should return no periods for an unsupported year", () => {
      expect(getPeriodsForYear(2024)).toEqual([]);
    });

    it("should resolve each month of 2025 to the correct period", () => {
      expect(getPeriodForMonth(2025, 0)).toBe("2025-01-01_2025-07-31");
      expect(getPeriodForMonth(2025, 6)).toBe("2025-01-01_2025-07-31");
      expect(getPeriodForMonth(2025, 7)).toBe("2025-08-01_2025-09-30");
      expect(getPeriodForMonth(2025, 8)).toBe("2025-08-01_2025-09-30");
      expect(getPeriodForMonth(2025, 9)).toBe("2025-10-01_2025-12-31");
      expect(getPeriodForMonth(2025, 11)).toBe("2025-10-01_2025-12-31");
    });

    it("should throw for invalid month index", () => {
      expect(() => getPeriodForMonth(2025, 12)).toThrow(
        "'monthIndexZeroBased' must be an integer between 0 and 11. Provided: 12"
      );
    });

    it("should throw for unsupported years", () => {
      expect(() => getPeriodForMonth(2024, 0)).toThrow(
        "No retention tax periods found for year: 2024"
      );
    });
  });

  describe("buildRetentionTableIdentifier", () => {
    it("should generate correct identifier for continent location", () => {
      expect(
        buildRetentionTableIdentifier(
          "2025-01-01_2025-07-31",
          "continent",
          "TABLE1_SINGLE_OR_MARRIED_2_HOLDERS"
        )
      ).toBe("2025/continent/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS");
    });

    it("should generate correct identifier for azores location", () => {
      expect(
        buildRetentionTableIdentifier(
          "2025-08-01_2025-09-30",
          "azores",
          "TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS"
        )
      ).toBe("2025/azores/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS");
    });

    it("should generate correct identifier for madeira location", () => {
      expect(
        buildRetentionTableIdentifier(
          "2025-10-01_2025-12-31",
          "madeira",
          "TABLE3_MARRIED_1_HOLDER"
        )
      ).toBe("2025/madeira/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER");
    });
  });

  describe("Type safety", () => {
    it("should accept valid PeriodT values", () => {
      const validPeriods: PeriodT[] = [
        "2025-01-01_2025-07-31",
        "2025-08-01_2025-09-30",
        "2025-10-01_2025-12-31"
      ];
      
      validPeriods.forEach(period => {
        expect(() => getYearFromPeriod(period)).not.toThrow();
      });
    });
  });
});
