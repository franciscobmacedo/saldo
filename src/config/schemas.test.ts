import { describe, it, expect } from "vitest";
import { 
  PeriodT, 
  VALID_PERIODS, 
  getYearFromPeriod,
  RetentionPathsSchema,
  LocationT,
  SituationCodesT
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

  describe("RetentionPathsSchema", () => {
    it("should generate correct identifier for continent location", () => {
      const schema = new RetentionPathsSchema(
        "2025-01-01_2025-07-31",
        "continent",
        "TABLE1_SINGLE_OR_MARRIED_2_HOLDERS",
        2025
      );
      expect(schema.identifier).toBe("2025/continent/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS");
    });

    it("should generate correct identifier for azores location", () => {
      const schema = new RetentionPathsSchema(
        "2025-08-01_2025-09-30",
        "azores",
        "TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS",
        2025
      );
      expect(schema.identifier).toBe("2025/azores/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS");
    });

    it("should generate correct identifier for madeira location", () => {
      const schema = new RetentionPathsSchema(
        "2025-10-01_2025-12-31",
        "madeira",
        "TABLE3_MARRIED_1_HOLDER",
        2025
      );
      expect(schema.identifier).toBe("2025/madeira/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER");
    });

    it("should work with string year parameter", () => {
      const schema = new RetentionPathsSchema(
        "2025-01-01_2025-07-31",
        "continent",
        "TABLE1_SINGLE_OR_MARRIED_2_HOLDERS",
        "2025"
      );
      expect(schema.identifier).toBe("2025/continent/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS");
    });

    it("should have path getter that returns identifier", () => {
      const schema = new RetentionPathsSchema(
        "2025-01-01_2025-07-31",
        "continent",
        "TABLE1_SINGLE_OR_MARRIED_2_HOLDERS",
        2025
      );
      expect(schema.path).toBe(schema.identifier);
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
