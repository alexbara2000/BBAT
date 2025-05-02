# BBAT: Behavioural Biometrics Analysis Tool

BBAT is a tool designed to identify behavioural biometric scripts found on websites using dynamic taint analysis and machine learning.

## 🚀 Setup Instructions

Before running BBAT, ensure you have Docker, Python 3, and other necessary dependencies installed.

### 1. Run the Setup Script

```bash
./setup.sh
```

To confirm that Docker containers are running:

```bash
docker ps
```
You should see 3 containers running.

## 🧪 Running the Tool

Use the following command to start the crawl:

```bash
FOXHOUND_PATH=~/PATH/TO/BBAT/FoxHound/obj-tf-release/dist/bin/foxhound ./startup.sh "taintSeed" crawl foxhound 6
```

Replace `~/PATH/TO/BBAT` with the actual path to your BBAT directory.

## 🧹 Postprocessing

Once all websites have been crawled (you can verify this by inspecting the MySQL database), run the following:

```bash
cd ../ML
python3 preprocess.py
python3 predict_enhanced.py
```

The output CSV will be located in the `results/` folder.

## 🔧 Customization

### Crawler Modules
To change the crawl list, modify the appropriate module in: `crawler/modules/moduleName`

After changing it, re-run:

```
./setup.sh
```
### Checkout Crawler
To use a checkout-specific crawler instead of the default, replace "taintSeed" in the command with one of the 4 checkout module names found in: `crawler/modules/`

### Using a Single ML Classifier
If you want to use a single classifier rather than the ensemble model, run:

```
python3 predict.py
```
Update the module name manually inside predict.py.

## 📁 Directory Structure Overview

- setup.sh: Installs dependencies and sets up the environment.
- DB/: Contains Docker database and export config.
- crawler/: Website crawling modules.
- ML/: Machine learning scripts for analysis and prediction.
- ML/results/: Output predictions in CSV format.
