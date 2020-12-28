# The Burroughs Test

A small command line utility to help a small ﬁctional company calculate the dates on which they should pay their sales staff.  

Company payroll is handled like so: 
-	Sales staff are paid a regular ﬁxed base salary each month, plus a regular monthly bonus. 
-	Base salaries are paid on the last day of each month, unless that day is a Saturday or Sunday (a weekend), in which case they are paid on the Friday before the weekend 
-	On the 15th of each month, bonuses are paid for the previous month, unless that day is a weekend, in which case they are paid on the ﬁrst Wednesday after the 15th. 

The utility should calculate the payment dates for the next 12 months, including the current month, and output to the screen in a CSV format.

## Table of contents

1.  [Quick Overview](#quickOverview)
2.  [Getting Started](#gettingStarted)
    1.  [Installing](#installing)
    2.  [Running the app](#running)
3.  [Setup your application](#setup)
    1.  [General settings](#setupGeneral)
    2.  [Adding or editing payment rules](#setupPayments)
4.  [Tests](#tests)
    1.  [Running the test suite](#testsRun)
    2.  [Test Watcher](#testsWatcher)
5.  [Lint](#lint)
6.  [Possible upgrades](#upgrades)
7.  [Acknowledgements](#acknowledgements)
<a name="quickOverview"></a>

## Quick Overview

#### Install

```sh
git clone https://github.com/NEOLPAR/burroughs_test.git burroughs-test-neolpar
cd burroughs-test-neolpar
npm install 
npm start
```

#### Run 

```sh
npm start
```

#### Setup

```sh
npm run setup
```

#### Tests

```sh
npm test
```

```sh
npm run test-watch
```

#### Lint

```sh
npm run lint
```
<a name="gettingStarted"></a>

## Getting Started

**You’ll need to have Node 12.18.3 or later version on your local development machine.** We recommend using the latest LTS version. You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

Please follow the instructions to install and run this app and their choices.
<a name="installing"></a>

### Installing

First we need to clone the project from Github, we'll install it in a folder called `burroughs-test-neolpar` or a different name at your choice.

```sh
git clone https://github.com/NEOLPAR/burroughs_test.git burroughs-test-neolpar
```

After cloning the app we move to the app directory and install the dependencies.

```sh
cd burroughs-test-neolpar
npm install
```
<a name="running"></a>

### Running the app

Now we are ready to start using this app with the following command

```sh
npm start
```

Please continue reading if you would like to change the project defaults or payment rules, run test or run lint.
<a name="setup"></a>

## Setup your application

If you would like to change the default settings, please execute the following command:

```sh
npm run setup
```

This command will run a wizard to configure all the general settings and will give us the choice to add new payment rules or amend the existing ones.

Through the wizard we'll configure the following settings: 
<a name="setupGeneral"></a>

### General settings

- **Months**: (Number) Default: 12. Number between 1 and 24. This will change the months that we want to show when we run the app.
- **Export to CSV**: (Boolean) Default: false. This will export a CSV file when we run the app. It will create an `export` folder and will create the files there with the names as the following format `YYYY-MM-ddTHH.mm.ss.csv`.
- **Add or edit payment rules**: (Boolean) Default: false. We can change just the general settings without changing any payment rule, so the wizard won't go further on the setup and will save the settings.
<a name="setupPayments"></a>

### Adding or editing payment rules

- **Name**: (String) Unique. String of `a to z` characters up to 10 of lenght. This option will just be shown if we are adding a new payment rule.
- **Description** (String) String of `a to z` characters up to 100 of lenght. This is a description of the payment rule.
- **Allowed months**: (Checkbox) At least one month selected. Months where the rule will be applied.
- **Payment day**: (String) Allowed 'last', 'first', Number between 1 and 31. The day of the month when this rule will be process.
- **Allowed week days**: (Checkbox) At least one selected. Week days allowed to process the payment.
- **Previous or next week**<a name="fallbackSign"></a>: (List) This is when you want to process the payment in case it falls in a not allowed week day. This works with [Week day fallback](#fallbackWeekDay).
- **Week day fallback**<a name="fallbackWeekDay"></a>: (List) This is the week day when you want to process the payment in case it falls in a not allowed week day. This works with [Previous or next week](#fallbackSign).
<a name="tests"></a>

## Tests

**Unit test** are written in (Jest)[#acknowledgements]. Please add a unit test for every new feature or bug fix. 
<a name="testsRun"></a>

### Running the test suite

Perform a single pass of the test suite:

```sh
npm test
```
<a name="testsWatcher"></a>

### Test watcher

During development we can use jest test watcher. Run the watcher with the following command:

```sh
npm run test-watch
```
<a name="lint"></a>

## Lint

This application has been developer using (ESLint)[#Acknowledgements]. You can run the lint checks with the following command: 

```sh
npm run lint
```
<a name="upgrades"></a>

## Possible upgrades

- Choice to remove an existing payment rule.
- Export CSV files with a path and filename of your choice.
- Working with Timezones.
- Changing rule payments name.
- Looping after change one payment rule. In case you want to add or edit more than one rule.
- Tests for setup module.
<a name="acknowledgements"></a>

## Acknowledgements

I have used some third party projects and I am really grateful to the authors and communities behin them:
- [@babel](https://github.com/babel)
- [@jest](https://github.com/facebook/jest)
- [@jest-community](https://github.com/jest-community)
- [@eslint](https://github.com/eslint/eslint)
- [@eslint-config-airbnb-base](https://github.com/airbnb/javascript)
- [@eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)
- [@convert-array-to-csv](https://github.com/aichbauer/node-convert-array-to-csv)
- [@inquirer](https://github.com/SBoudrias/Inquirer.js)
- [@codinggarden](https://github.com/CodingGarden)
