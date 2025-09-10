import {
  validateNumberOfHolders,
  validateMarriedAndNumberOfHolders,
  validateDependents,
  validatePeriod,
} from "@/dependent-worker/validators";
import { describe, it, expect } from "vitest";
describe("Dependent Worker Validators", () => {
  describe("validateNumberOfHolders", () => {
    it.each([null, undefined, 1, 2])(
      "should not throw for %p",
      (numberOfHolders) => {
        expect(() => validateNumberOfHolders(numberOfHolders)).not.toThrow();
      }
    );

    it.each([0, 3, 1.5])("should throw for %p", (numberOfHolders) => {
      expect(() => validateNumberOfHolders(numberOfHolders)).toThrow(
        "'numberOfHolders' must be null, undefined, 1 or 2"
      );
    });
  });

  describe("validateMarriedAndNumberOfHolders", () => {
    it("should not throw if not married and numberOfHolders is null", () => {
      expect(() =>
        validateMarriedAndNumberOfHolders(false, null)
      ).not.toThrow();
    });

    it("should not throw if not married and numberOfHolders is undefined", () => {
      expect(() =>
        validateMarriedAndNumberOfHolders(false, undefined)
      ).not.toThrow();
    });

    it("should not throw if not married and numberOfHolders is 1", () => {
      expect(() => validateMarriedAndNumberOfHolders(false, 1)).not.toThrow();
    });

    it("should not throw if married and numberOfHolders is 1", () => {
      expect(() => validateMarriedAndNumberOfHolders(true, 1)).not.toThrow();
    });

    it("should not throw if married and numberOfHolders is 2", () => {
      expect(() => validateMarriedAndNumberOfHolders(true, 2)).not.toThrow();
    });

    it("should throw if married and numberOfHolders is null", () => {
      expect(() => validateMarriedAndNumberOfHolders(true, null)).toThrow(
        "'numberOfHolders' is required for married workers"
      );
    });

    it("should throw if married and numberOfHolders is undefined", () => {
      expect(() => validateMarriedAndNumberOfHolders(true, undefined)).toThrow(
        "'numberOfHolders' is required for married workers"
      );
    });
  });

  describe("validateDependents", () => {
    it("should not throw if numberOfDependentsDisabled is null", () => {
      expect(() => validateDependents(1, null)).not.toThrow();
    });

    it("should not throw if numberOfDependentsDisabled is undefined", () => {
      expect(() => validateDependents(1, undefined)).not.toThrow();
    });

    it("should not throw if numberOfDependentsDisabled is less than numberOfDependents", () => {
      expect(() => validateDependents(2, 1)).not.toThrow();
    });

    it("should not throw if numberOfDependentsDisabled is equal to numberOfDependents", () => {
      expect(() => validateDependents(1, 1)).not.toThrow();
    });

    it("should throw if numberOfDependents is null and numberOfDependentsDisabled is provided", () => {
      expect(() => validateDependents(null, 1)).toThrow(
        "'numberOfDependents' is required when 'numberOfDependentsDisabled' is provided"
      );
    });

    it("should throw if numberOfDependents is undefined and numberOfDependentsDisabled is provided", () => {
      expect(() => validateDependents(undefined, 1)).toThrow(
        "'numberOfDependents' is required when 'numberOfDependentsDisabled' is provided"
      );
    });

    it("should throw if numberOfDependentsDisabled is greater than numberOfDependents", () => {
      expect(() => validateDependents(1, 2)).toThrow(
        "'numberOfDependentsDisabled' must be less than or equal to 'numberOfDependents'"
      );
    });
  });

  describe("validatePeriod", () => {
    it.each([
      "2025-01-01_2025-07-31",
      "2025-08-01_2025-09-30", 
      "2025-10-01_2025-12-31"
    ])("should not throw for valid period %s", (period) => {
      expect(() => validatePeriod(period as any)).not.toThrow();
    });

    it.each([
      "2025-01-01_2025-06-30",
      "2024-01-01_2024-12-31",
      "2026-01-01_2026-12-31",
      "invalid-period",
      "",
      null,
      undefined
    ])("should throw for invalid period %s", (period) => {
      expect(() => validatePeriod(period as any)).toThrow(
        "'period' must be one of"
      );
    });
  });
});
