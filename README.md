# Missing Migrants Visualization

## Overview

This project is a visualization of a dataset I originally discovered on [Kaggle](), called [Missing Migrants].  The dataset describes events where migrants have been discovered dead or missing, and aggregated from a combination of media, medical, and governmental reports from around the world.  The nature of this issue and the collection technique means that the information is incomplete, inconsistent, biased, and sometimes messy.  This project is attempt to clean this data and, hopefully, to shine a light on certain aspects of this problem in a way that communicates something of interest to the casual reader.

In particular, this project attempts to aid in answering the following questions:

* How does the number of missing / dead vary over time and by region?
* Are there certain locations that exhibit many small events which accumulate over time?
* What are the different causes of migrant death?
* How does cause of death vary by region?

## Using the visualization

[Click here](https://github.com/dbeach24/missing-migrants-vis) for a live demo.

### Stream Graph



### Bubble Chart

### Cause Legend

### Details


## About the Data

This dataset is from the [Missing Migrants](https://www.kaggle.com/jmataya/missingmigrants) data uploaded to Kaggle, and contains information about people who have gone missing while travelling along migration routes.  This data originates from the [Missing Migrants Project](https://missingmigrants.iom.int/).

The original data describe events where migrants have gone missing, and generally answer the following questions:

* Who – Number of people, Nationality, Region of Origin
* What – Dead or Missing
* Where – latitude, longitude, Incident Region
* When – Date
* How – Cause of Death

The data sets has 12 dimensions, and includes the following fields:

| Field            | Kind          | Notes |
| ---------------- | ------------- | ----- |
| ID               | Categorical   | Unique Event Identifier |
| Cause of Death   | Categorical   | Free-form text requires classification into categories to be useful |
| Region of Origin | Categorical   | Inconsistent encoding; needs cleaning |
| Nationality      | Categorical   | Origin nation names with mixed text; needs cleaning |
| Missing          | Quantitative  | Number of missing |
| Dead             | Quantitative  | Number of dead |
| Incident Region  | Categorical   | Mostly clean, but can also be computed from lat/lon |
| Date             | Quantitative  | European-style date in DD/MM/YYYY format |
| Source           | Categorical   | Fairly high cardinality (603), may be hard to reduce |
| Reliability      | Categorical   | Mostly clean: Verified, Partially Verified, Unverified |
| Latitude         | Quantitative  | Degrees latitude |
| Longitude        | Quantitative  | Degrees longitude |

## Enrichment and Feature Extraction

A script (included as a Jupyter/Python notebook is used to extract additional features from the data:

| Field            | Kind             | Notes |
| ---------------- | ---------------- | ----- |
| Region Num       | Categorical, Int | Region, encoded as a number, based on longitude. <ul><li>0 = Americas (longitude < -50)</li><li>1 = EMEA (-50 <= longitude < 75)</li><li>2 = Southeast Asia (longitude > 75)</li></ul> |
| Cause            | Categorical, Set | Text pattern extraction from “Cause of Death” field, into categories:<ul><li>Drowning/Asphyxiation</li><li>Exposure / Dehydration / Starvation</li><li>Vehicular / Mechanical</li><li>Homicide / Violence</li><li>Illness / Medical</li><li>Unknown</li></ul>
| Nationalities    | Categorical, Set | Extracted country names from “Nationality” text field.  Also needs to recognize region names (such as North Africa, Central America, or MENA, and handle appropriately). |

## Earlier work

An [earlier example of this work](http://blockbuilder.org/dbeach24/599725c960ce2881b1dcd46c3b20e268) can be found on [bl.ocks.org](https://bl.ocks.org).

## Attribution

This D3.js web project is based on [this template project](https://github.com/curran/dataviz-project-template) from [curran](https://github.com/curran).
