from pathlib import Path

BASE_PATH = Path(__file__).resolve().parent.parent
DATA_PATH = Path(BASE_PATH, "data")
RETENTION_TAX_TABLES_PATH = Path(DATA_PATH, "retention_tax_tables")
