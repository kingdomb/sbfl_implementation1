# sbfl_implementation
An implementation of Spectrum-Based Fault Localization (SBFL) for real-world Java programs with unit tests. This app calculates the suspiciousness values of source code elements by using the sbfl formulae for Tarantula, SBI, Jaccard, and Ochai models.

# Test Results Processor

This application processes test result data, calculates suspiciousness values, and allows for resetting the application state. It is designed to handle operations related to software testing and provide insights into test outcomes.

## Table of Contents
- [Description](#description)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [Results](#results)
- [Resetting the App](#resetting-the-app)
- [Contributing](#contributing)
- [License](#license)

## Description
This application is used to process test results, calculate suspiciousness values, and reset application state based on user input. It includes several key functionalities:

- Process test result data and update JSON files with total passes and fails.
- Calculate suspiciousness values using multiple formulas (Tarantula, SBI, Jaccard, Ochiai).
- Write results to CSV files for easier data analysis.
- Reset the application state, allowing users to start with a clean slate.

## Setup
To set up the application, follow these steps:

1. **Clone the Repository**:
   ```
   git clone https://github.com/your-repo.git
   cd <your-repo-name-here>
   ```

2. **Install Dependencies**:
    Ensure you have Node.js and npm installed. Then, run:
    `yarn install`

3. **Ensure Data Exists**:
    Make sure there's a ./data/NewCoverageData & ./NewCoverageData directory in the project root with the necessary test result data. The input for the app to process is pulled from ./NewCoverageData, and the app is reset using ./data/NewCoverageData.
    ```
    ROOT:
          ./NewCoverageData/
                            1.txt
                            2.txt
                            3.txt
                            ...etc
          ./data/NewCoverageData/
                            1.txt
                            2.txt
                            3.txt
                            ...etc
    ```

4. **Running the App**:
    To run the application, use the following command:
    `yarn start`

    This will initiate the main operations, including processing test results, updating JSON files, and calculating suspiciousness values.

**Results**
After running the app, you can find the following results:

***Suspiciousness Values:***
The calculated suspiciousness values are written to a CSV file in **./data/suspiciousness_table.csv**. This CSV contains the calculated values for each method.

***Updated JSON Data:***
The updated test results are saved in ./data/testResults.json. This file contains the processed results, total pass/fail counts, and updated methods.

***Resetting the App***
Inside the console and at the end of the application's operations, you'll be prompted to choose to reset the program. If you choose to reset:

The current ./NewCoverageData directory will be deleted and replaced with a copy of ./data/NewCoverageData.

The JSON data (./data/testResults.json) will be reset:
   _jsonData.methods and jsonData.tests arrays will be cleared.
    jsonData.total_pass and jsonData.total_fail will be set to 0.
    The console will display a message confirming whether the reset was completed or canceled._

**Contributing**
If you'd like to contribute to this project, please fork the repository and submit a pull request. Be sure to follow the project's coding standards and include appropriate documentation for any new features or changes.

**License**
This project is licensed under the MIT License. See the LICENSE file for more information.