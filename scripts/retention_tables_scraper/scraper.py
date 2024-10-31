import os
from pathlib import Path
import subprocess  # type: ignore
import json
import datetime

from saldo.config import RETENTION_TAX_TABLES_PATH, LocationT
from .config import TableMeta, tables

"""
Doutor Finanças has a simulator that allows to calculate the net salary after taxes (https://www.doutorfinancas.pt/simulador-salario-liquido-2024).
The js source code is here: 

    https://www.doutorfinancas.pt/wp-content/themes/drfinancas/vendor/doutorfinancas/simulators/salario_liquido_2024/scripts.js

It fetches retention tables data from a set of csv files, one for each location (continente, madeira, açores). For example:

https://www.doutorfinancas.pt/wp-content/themes/drfinancas/vendor/doutorfinancas/simulators/salario_liquido_2024/data/taxas_continente.csv?tmp


This scraper attempts to scrape the data from the csv files and save it in a json format for this tool.
"""


def dump_to_json(data: dict | list, filename: Path):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)


def dump_table(
    location: LocationT,
    start_date: datetime.date,
    end_date: datetime.date,
    situation: str,
    data: dict,
):
    year = start_date.year
    path = Path(
        RETENTION_TAX_TABLES_PATH,
        f"{year}",
        location,
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


def scrape_irs_table(table: TableMeta, location: LocationT):
    url = table.get_url(location)
    print(f"Scraping table from {url}")
    proc = subprocess.run(
        ["curl", "--fail", "--location", url],
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
        dependent_disabled_addition_deduction = None
        if situation in ["SOLD", "CAS1", "SOLD+DEF", "CAS1+DEF"]:
            dependent_disabled_addition_deduction = 84.82
        elif situation in ["SOLCAS2", "CAS2D+DEF"]:
            dependent_disabled_addition_deduction = 42.41

        if situation not in tables_to_dump:
            tables_to_dump[situation] = {
                "situation": situation,
                "description": description,
                "brackets": [],
                "dependent_disabled_addition_deduction": dependent_disabled_addition_deduction,
            }
        tables_to_dump[situation]["brackets"].append(dict(zip(header, cleaned_row[1:])))

    for key, table_data in tables_to_dump.items():
        dump_table(location, table.start_date, table.end_date, key, table_data)
    return


def scrape_irs_tables():
    for table in tables:
        for location in LocationT.__args__:
            scrape_irs_table(table, location)



