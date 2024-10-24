from dataclasses import dataclass
from typing import List, Literal, Optional, Union
import json
from pathlib import Path


@dataclass
class TaxBracket:
    max_amount: Optional[float]
    marginal_rate: float
    effective_rate: Optional[float]
    deductible_amount: Optional[float] = None
    deductible_formula: Optional[str] = None

    def __post_init__(self):
        # Convert percentage rates to decimal form
        self.marginal_rate = self.marginal_rate / 100 if self.marginal_rate else 0
        self.effective_rate = self.effective_rate / 100 if self.effective_rate else None

    def calculate_deductible(self, salary: float) -> float:
        """Calculate deductible amount for this bracket."""
        if self.deductible_amount is not None:
            return self.deductible_amount
        elif self.deductible_formula:
            # Handle formula-based calculations
            # Note: This is a simplified example - you'd want to add more sophisticated
            # formula parsing in a real implementation
            if "13.25% * 2.6 * (1135.39 - R)" in self.deductible_formula:
                return 0.1325 * 2.6 * (1135.39 - salary)
            elif "18.00% * 1.4 * (1385.20 - R)" in self.deductible_formula:
                return 0.18 * 1.4 * (1385.20 - salary)
        return 0.0

    def calculate_tax(self, taxable_income: float, twelfths_income: float) -> float:
        """Calculate tax for a given salary."""
        base_tax = taxable_income * self.marginal_rate - self.calculate_deductible(taxable_income)

        # effective rate is the actual rate that is applied to the income after the deductions
        # this is what we use to calculate the tax for the twelfths income
        effective_rate =  base_tax / taxable_income
        twelfths_tax = twelfths_income * effective_rate
        tax = base_tax + twelfths_tax
        
        return max(0, tax)


@dataclass
class TaxRetentionTable:
    region: str
    situation: str
    tax_brackets: List[TaxBracket]

    def find_bracket(self, salary: float) -> Optional[TaxBracket]:
        """Find the appropriate tax bracket for a given salary."""
        for bracket in self.tax_brackets:
            if bracket.max_amount is None or salary <= bracket.max_amount:
                return bracket
        return None


    @staticmethod
    def load_from_file(filepath: Union[str, Path]) -> "TaxRetentionTable":
        """Load tax table from a JSON file."""
        filepath = Path(filepath)
        if not filepath.exists():
            raise FileNotFoundError(f"Tax table file not found: {filepath}")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Convert dictionary to TaxBracket instances
        brackets = [
            TaxBracket(
                max_amount=b.get("maxAmount"),
                marginal_rate=b["marginalRate"],
                effective_rate=b.get("effectiveRate"),
                deductible_amount=b.get("deductibleAmount"),
                deductible_formula=b.get("deductibleFormula"),
            )
            for b in data["taxBrackets"]
        ]

        return TaxRetentionTable(
            region=data["region"], situation=data["situation"], tax_brackets=brackets
        )

    @staticmethod
    def load_from_dict(data: dict) -> "TaxRetentionTable":
        """Load tax table from a dictionary."""
        brackets = [
            TaxBracket(
                max_amount=b.get("maxAmount"),
                marginal_rate=b["marginalRate"],
                effective_rate=b.get("effectiveRate"),
                deductible_amount=b.get("deductibleAmount"),
                deductible_formula=b.get("deductibleFormula"),
            )
            for b in data["taxBrackets"]
        ]

        return TaxRetentionTable(
            region=data["region"], situation=data["situation"], tax_brackets=brackets
        )

    @staticmethod
    def load(
        year: int,
        marital_status: Literal[
            "single", "married_1_holder", "married_2_holder"
        ] = "single",
    ) -> "TaxRetentionTable":
        from saldo.config.consts import RETENTION_PATHS

        try:
            year_retention_paths = RETENTION_PATHS[year]
        except KeyError:
            raise ValueError(f"No retention tax tables found for year {year}")

        year_retention_path = getattr(year_retention_paths, marital_status)
        return TaxRetentionTable.load_from_file(year_retention_path)
