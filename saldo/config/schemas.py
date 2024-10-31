from dataclasses import dataclass
import datetime
from enum import Enum
from pathlib import Path
from typing import Literal, Optional
from saldo.config.consts import RETENTION_TAX_TABLES_PATH


SituationCodesT = Literal[
    "SOLCAS2", "SOLD", "CAS1", "SOLCAS2+DEF", "SOLD+DEF", "CAS2D+DEF", "CAS1+DEF"
]

LocationT = Literal[
    "continente",
    "acores",
    "madeira",
]


@dataclass
class Condition:
    married: bool
    dependents: bool  # True if has dependents False if not
    disabled: bool
    description: str

    # Number of holders, None if it's not applicable (e.g. not married)
    number_of_holders: Optional[int] = None

    def __init__(
        self,
        married: bool,
        disabled: bool,
        number_of_holders: Optional[int] = None,
        number_of_dependents: Optional[int] = None,
        dependents: Optional[bool] = None,
        description: str = "",
    ):
        self.married = married
        self.number_of_holders = number_of_holders

        self.disabled = disabled

        if dependents is not None:
            self.dependents = dependents
        elif number_of_dependents is not None:
            self.dependents = number_of_dependents > 0
        else:
            self.dependents = False

        self.description = description


@dataclass
class Situation:
    code: SituationCodesT
    description: str
    conditions: list[Condition]


class Situations(Enum):
    SOLCAS2 = Situation(
        code="SOLCAS2",
        description="Trabalho dependente - Não casado sem dependentes ou casado dois titulares",
        conditions=[
            Condition(
                description="Não Casado sem dependentes",
                married=False,
                dependents=False,
                disabled=False,
            ),
            Condition(
                description="Casado, 2 titulares, sem dependentes",
                married=True,
                number_of_holders=2,
                dependents=False,
                disabled=False,
            ),
            Condition(
                description="Casado, 2 titulares, com dependentes",
                married=True,
                number_of_holders=2,
                dependents=True,
                disabled=False,
            ),
        ],
    )

    SOLD = Situation(
        code="SOLD",
        description="Trabalho dependente - Não casado com um ou mais dependentes",
        conditions=[
            Condition(
                description="Não casado com um ou mais dependentes",
                married=False,
                dependents=True,
                disabled=False,
            )
        ],
    )

    CAS1 = Situation(
        code="CAS1",
        description="Trabalho dependente - Casado único titular",
        conditions=[
            Condition(
                description="Casado único titular sem dependentes",
                married=True,
                number_of_holders=1,
                dependents=False,
                disabled=False,
            ),
            Condition(
                description="Casado único titular com dependentes",
                married=True,
                number_of_holders=1,
                dependents=True,
                disabled=False,
            ),
        ],
    )
    SOLCAS2_DEF = Situation(
        code="SOLCAS2+DEF",
        description="Trabalho dependente - Não casado ou casado dois titulares sem dependentes - deficiente",
        conditions=[
            Condition(
                description="Não Casado sem dependentes - deficiente",
                married=False,
                dependents=False,
                disabled=True,
            ),
            Condition(
                description="Casado, 2 titulares, sem dependentes - deficiente",
                married=True,
                number_of_holders=2,
                dependents=False,
                disabled=True,
            ),
        ],
    )
    SOLD_DEF = Situation(
        code="SOLD+DEF",
        description="Trabalho dependente - Não casado, com um ou mais dependentes - deficiente",
        conditions=[
            Condition(
                description="Não casado com um ou mais dependentes - deficiente",
                married=False,
                dependents=True,
                disabled=True,
            )
        ],
    )
    CAS2D_DEF = Situation(
        code="CAS2D+DEF",
        description="Trabalho dependente - Casado dois titulares, com um ou mais dependentes - deficiente",
        conditions=[
            Condition(
                description="Casado, 2 titulares, com dependentes - deficiente",
                married=True,
                number_of_holders=2,
                dependents=True,
                disabled=True,
            ),
        ],
    )

    CAS1_DEF = Situation(
        code="CAS1+DEF",
        description="Trabalho dependente - Casado único titular - deficiente",
        conditions=[
            Condition(
                description="Casado único titular sem dependentes - deficiente",
                married=True,
                number_of_holders=1,
                dependents=None,
                disabled=True,
            ),
            Condition(
                description="Casado único titular com dependentes - deficiente",
                married=True,
                number_of_holders=1,
                dependents=True,
                disabled=True,
            ),
        ],
    )

    @staticmethod
    def get_situation_from_code(code: str) -> Situation:
        for situation in Situations:
            if situation.value.code == code:
                return situation.value
        raise ValueError(f"Situation with code {code} not found.")

    @staticmethod
    def get_situation(
        married: bool,
        disabled: bool,
        number_of_holders: Optional[int] = None,
        number_of_dependents: Optional[int] = None,
    ):
        condition: Condition = Condition(
            married=married,
            number_of_holders=number_of_holders,
            number_of_dependents=number_of_dependents,
            disabled=disabled,
        )
        return Situations.get_situation_from_condition(condition)

    @staticmethod
    def get_situation_from_condition(
        condition: Condition,
    ) -> Situation:
        for situation in Situations:
            for situation_condition in situation.value.conditions:
                married_match = situation_condition.married == condition.married
                if situation_condition.number_of_holders is None:
                    # there's a match if condition.number_of_holders is None or 0
                    holders_match = True
                else:
                    holders_match = (
                        situation_condition.number_of_holders
                        == condition.number_of_holders
                    )

                if situation_condition.dependents is None:
                    # there's a match if condition.dependents is None or False
                    dependents_match = True
                else:
                    dependents_match = (
                        situation_condition.dependents == condition.dependents
                    )

                disabled_match = situation_condition.disabled == condition.disabled
                if (
                    married_match
                    and holders_match
                    and dependents_match
                    and disabled_match
                ):
                    return situation.value

        raise ValueError(f"Situation with condition {condition} not found.")


@dataclass
class RetentionPathsSchema:
    year: Path
    location: Path
    date_range: Path
    situation_code: Path

    def __init__(
        self,
        date_start: datetime.date,
        date_end: datetime.date,
        location: LocationT,
        situation_code: SituationCodesT,
        year: int | str,
    ):
        # Create a new instance of the class with retention path and year
        _year = str(year)
        self.year = Path(RETENTION_TAX_TABLES_PATH, _year)
        self.location = Path(self.year, location)
        self.date_range = Path(self.location, f"{date_start}_{date_end}")
        self.situation = Path(self.date_range, situation_code + ".json")

    @property
    def path(self) -> Path:
        return self.situation
