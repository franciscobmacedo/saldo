from dataclasses import dataclass
import datetime
from saldo.config import LocationT

situation_to_description_map_2024 = {
    "SOLCAS2": "i - Trabalho dependente - Não casado sem dependentes ou casado dois titulares",
    "SOLD": "ii - Trabalho dependente - Não casado com um ou mais dependentes",
    "CAS1": "iii - Trabalho dependente - Casado único titular",
    "SOLCAS2+DEF": "iv - Trabalho dependente - Não casado ou casado dois titulares sem dependentes - deficiente",
    "SOLD+DEF": "v - Trabalho dependente - Não casado, com um ou mais dependentes - Deficiente",
    "CAS2D+DEF": "vi - Trabalho dependente - Casado dois titulares, com um ou mais dependentes - Deficiente",
    "CAS1+DEF": "vii - Trabalho dependente - Casado único titular - deficiente",
}



@dataclass
class TableMeta:
    path: str
    title: str
    situation_to_description_map: dict[str, str]
    start_date: datetime.date
    end_date: datetime.date
    

    def get_url(self, location: LocationT) -> str:
        return f"https://www.doutorfinancas.pt/wp-content/themes/drfinancas/vendor/doutorfinancas/simulators/{self.path}/taxas_{location}.csv?tmp"


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
