from dataclasses import dataclass
from pathlib import Path


@dataclass
class RetentionPathsSchema:
    disabled: Path
    married: Path
    single: Path
    year: Path

    def __init__(
        self, base_path: str | Path, disabled: str, married: str, single: str, year: int | str
    ):
        # Create a new instance of the class with retention path and year
        _year = str(year)
        self.disabled = Path(base_path, _year, disabled)
        self.married = Path(base_path, _year, married)
        self.single = Path(base_path, _year, single)
        self.year = Path(base_path, _year)
