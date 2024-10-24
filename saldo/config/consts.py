from pathlib import Path
from saldo.config.schemas import RetentionPathsSchema


BASE_PATH = Path(__file__).resolve().parent.parent
DATA_PATH = Path(BASE_PATH, "data")
RETENTION_TAX_TABLES_PATH = Path(DATA_PATH, "retention_tax_tables")

RETENTION_PATHS = {
    2024: RetentionPathsSchema(
        base_path=RETENTION_TAX_TABLES_PATH,
        disabled="disabled.json",
        married="married.json",
        single="single.json",
        year=2024,
    )
}
