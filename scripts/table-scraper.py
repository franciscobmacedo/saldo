from dataclasses import dataclass
import os
from pathlib import Path
import subprocess  # type: ignore
import json
import datetime
from saldo.config import RETENTION_TAX_TABLES_PATH

situation_to_description_map_2024 = {
    "SOLCAS2": "Trabalho dependente - Não casado sem dependentes ou casado dois titulares",
    "SOLD": "Trabalho dependente - Não casado com um ou mais dependentes",
    "CAS1": "Trabalho dependente - Casado único titular",
    "SOLCAS2+DEF": "Trabalho dependente - Não casado ou casado dois titulares sem dependentes - deficiente",
    "SOLD+DEF": "Trabalho dependente - Não casado, com um ou mais dependentes - Deficiente",
    "CAS2D+DEF": "Trabalho dependente - Casado dois titulares, com um ou mais dependentes - Deficiente",
    "CAS1+DEF": "Trabalho dependente - Casado único titular - deficiente",
}


@dataclass
class TableMeta:
    path: str
    title: str
    situation_to_description_map: dict[str, str]
    start_date: datetime.date
    end_date: datetime.date

    @property
    def url(self) -> str:
        return f"https://www.doutorfinancas.pt/wp-content/themes/drfinancas/vendor/doutorfinancas/simulators/{self.path}/taxas_continente.csv?tmp"


tables = [
    TableMeta(
        path="salario_liquido_2024/data",
        title="IRS Retention Table from January to end of August 2024",
        situation_to_description_map=situation_to_description_map_2024,
        start_date=datetime.date(2024, 1, 1),
        end_date=datetime.date(2024, 8, 31),
    ),
    TableMeta(
        path="salario_liquido_2024/data_set_out2024",
        title="IRS Retention Table from Setember to End of October 2024",
        situation_to_description_map=situation_to_description_map_2024,
        start_date=datetime.date(2024, 9, 1),
        end_date=datetime.date(2024, 10, 31),
    ),
    TableMeta(
        path="salario_liquido_2024/data_nov2024",
        title="IRS Retention Table from November to End of December 2024",
        situation_to_description_map=situation_to_description_map_2024,
        start_date=datetime.date(2024, 11, 1),
        end_date=datetime.date(2024, 12, 31),
    ),
]


def dump_to_json(data: dict | list, filename: Path):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)


def dump_table(
    start_date: datetime.date, end_date: datetime.date, situation: str, data: dict
):
    year = start_date.year
    path = Path(
        RETENTION_TAX_TABLES_PATH,
        f"{year}",
        f"{start_date}_{end_date}",
        f"{situation}.json",
    )
    os.makedirs(path.parent, exist_ok=True)
    dump_to_json(data, path)


def clean_value(value: str) -> str | float:
    # return value
    # remove leading and trailing whitespaces
    value = value.strip()

    # convert to float
    value = value.replace(",", ".")

    # Convert percentage "14.50%" to 0.145
    if "%" in value:
        return float(value.replace("%", "")) / 100

    else:
        try:
            return float(value)
        except ValueError:
            pass

    return value


def scrape_irs_table(table: TableMeta):
    print(f"Scraping table from {table.url}")
    proc = subprocess.run(
        ["curl", "--fail", "--location", table.url],
        stdout=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise SystemExit(1)

    # response is a csv file
    data = proc.stdout.decode("utf-8")

    # clean data,
    #  remove "\r" characters
    data = data.replace("\r", "")

    data_split = [line.split(";") for line in data.split("\n")]

    rows = data_split[1:]
    header = [
        "signal",
        "limit",
        "max_marginal_rate",
        "deduction",
        "var1_deduction",
        "var2_deduction",
        "dependent_aditional_deduction",
        "effective_mensal_rate",
    ]

    # convert to list of dictionaries
    tables_to_dump: dict[str, dict] = {}
    for row in rows:
        cleaned_row = [clean_value(value) for value in row]
        if not isinstance(cleaned_row[0], str):
            raise ValueError(
                f"Expected a string value in first row element, got {cleaned_row[0]} for row {row}"
            )
        situation: str = cleaned_row[0]
        description: str = table.situation_to_description_map.get(situation, "")

        if situation not in tables_to_dump:
            tables_to_dump[situation] = {
                "situation": situation,
                "description": description,
                "brackets": [],
            }
        tables_to_dump[situation]["brackets"].append(dict(zip(header, cleaned_row[1:])))

    for key, table_data in tables_to_dump.items():
        dump_table(table.start_date, table.end_date, key, table_data)
    return


def scrape_irs_tables():
    for table in tables:
        scrape_irs_table(table)


if __name__ == "__main__":
    scrape_irs_tables()
