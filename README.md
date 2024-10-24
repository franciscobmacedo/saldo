# saldo

[![PyPI](https://img.shields.io/pypi/v/saldo.svg)](https://pypi.org/project/saldo/)
[![Tests](https://github.com/franciscobmacedo/saldo/actions/workflows/test.yml/badge.svg)](https://github.com/franciscobmacedo/saldo/actions/workflows/test.yml)
[![Changelog](https://img.shields.io/github/v/release/franciscobmacedo/saldo?include_prereleases&label=changelog)](https://github.com/franciscobmacedo/saldo/releases)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/franciscobmacedo/saldo/blob/main/LICENSE)

calculate taxes to pay and net salary if you're a portuguese worker. Keep track of your balance (or "saldo")!

## What is the point

Knowing how much money will land in your bank account in Portugal is hard. There are multiple scenarios to consider and they are not very clear.
There are good simulators out there (such as [Doutor Finanças for B category employees](https://www.doutorfinancas.pt/simulador-salario-liquido-2024/) and my [remote freelancer tool](https://freelancept.fmacedo.com/)).

However, there's no open-source library to do this logic. It's also not that easy to find out what Doutor Finanças does under the hood.

This library intends to fill this gaps: provide a community driven open source tool to calculate taxes and net income for any given scenario.
It would also provide documentation both for best practies for development but also to just understand how the logic works.

Some possible use cases:
- I got a new job (freelancer or not) and want to know how much I'll pay as taxes and how much I'll recieve in my bank account.
- I have a small company and don't want to use licensing software to process payments.
- I'm an accountant. I want to validate my excel with a open and clear tool, where I can see exactly what it does.
- I just want to understand how the tax logic works in Portugal and simulate a few different scenarios.
- I have a tool in google sheets to analyse my profits and want to offset some of this net salary logic to a trusted tool (this would require an API using this library).



## Installation

Install this library using `pip`:
```bash
pip install saldo
```
## Usage

### Current status
This is a work in progress. The basic functionalities implemented are:

- `simulator.py/simulate_dependent_worker` calculates the net salary and taxes to pay for a dependent worker (category A). For now, it's limited for:
  - single person
  - 0 dependentes
  - living in Continental Portugal
  - lunch allowence in cupons (or non existing)

### Features

The questions to answer with this library are:

- For a given salary, what is my net income?
- How much taxes will I have to pay?
- What if I recieve the holiday and christmas subsidies in twelfths? How much does it change?
- By the end of the year, what will be my gross and net salary?
- How much money will I pay/recieve when declaring IRS in April?
- What if I'm an independent worker?
- What about IVA?

So the feature planing is:
- implement a complete calculator for A Category workers that answers all the points above
- do it for B Category workers as well
- Write documentation on how to use it
- Write documentation about how this calculation works, with iteractive parts - the user can change their income and the explanation changes as well. Might use pyodide for that or just have this in javascript?
  




## Development

To contribute to this library, first checkout the code. Then create a new virtual environment:
```bash
cd saldo
python -m venv venv
source venv/bin/activate
```
Now install the dependencies and test dependencies:
```bash
python -m pip install -e '.[test]'
```
To run the tests:
```bash
python -m pytest
```
