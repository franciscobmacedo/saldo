from dataclasses import dataclass
import datetime
from typing import List, Literal, Optional, Union
import json
from pathlib import Path
from saldo.config import RetentionPathsSchema, SituationCodesT


@dataclass
class TaxBracket:
    signal: Literal["max", "min"]
    limit: float
    max_marginal_rate: float
    deduction: float
    var1_deduction: float
    var2_deduction: float
    dependent_aditional_deduction: float
    effective_mensal_rate: float

    def calculate_deductible(self, salary: float) -> float:
        """Calculate deductible amount for this bracket."""
        if self.var1_deduction and self.var2_deduction:
            return self.deduction * self.var1_deduction * (self.var2_deduction - salary)
        return self.deduction

    def calculate_tax(self, taxable_income: float, twelfths_income: float, number_of_dependents: int = 0) -> float:
        """Calculate tax for a given salary."""
        deduction = self.calculate_deductible(taxable_income)
        base_tax = taxable_income * self.max_marginal_rate - deduction - number_of_dependents * self.dependent_aditional_deduction

        # effective rate is the actual rate that is applied to the income after the deductions
        # this is what we use to calculate the tax for the twelfths income
        effective_rate = base_tax / taxable_income
        twelfths_tax = twelfths_income * effective_rate
        tax = base_tax + twelfths_tax

        return max(0, tax)


@dataclass
class TaxRetentionTable:
    region: str
    situation: str
    description: str
    tax_brackets: List[TaxBracket]

    def find_bracket(self, salary: float) -> Optional[TaxBracket]:
        """Find the appropriate tax bracket for a given salary."""
        for bracket in self.tax_brackets:
            if bracket.signal == "max" and salary <= bracket.limit:
                return bracket
            elif bracket.signal == "min" and salary > bracket.limit:
                return bracket
        raise ValueError(f"No bracket found for salary {salary}")

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
                signal=b["signal"],
                limit=b["limit"],
                max_marginal_rate=b["max_marginal_rate"],
                deduction=b["deduction"],
                var1_deduction=b["var1_deduction"],
                var2_deduction=b["var2_deduction"],
                dependent_aditional_deduction=b["dependent_aditional_deduction"],
                effective_mensal_rate=b["effective_mensal_rate"],
            )
            for b in data["brackets"]
        ]

        return TaxRetentionTable(
            region="continente",
            situation=data["situation"],
            description=data["description"],
            tax_brackets=brackets,
        )

    @staticmethod
    def load(
        date_start: datetime.date,
        date_end: datetime.date,
        situation_code: SituationCodesT,
    ) -> "TaxRetentionTable":
        year = date_start.year
        retention_table = RetentionPathsSchema(
            date_start=date_start,
            date_end=date_end,
            situation_code=situation_code,
            year=year,
        )
        return TaxRetentionTable.load_from_file(retention_table.path)
