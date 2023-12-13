# Project Name: Streetz Hyperlocal

This is a project readme file that provides instructions for installation, environment setup, and building the Android app.

## Installation

To install the required node modules, run the following command:
`yarn`

## Environment Setup for android

For Android, you need to create a release keystore file. Add the following lines to the `local.properties` file:
`MYAPP_UPLOAD_STORE_FILE=<your.keystore>`\
`MYAPP_UPLOAD_KEY_ALIAS=<your-key-alias>`\
`MYAPP_UPLOAD_STORE_PASSWORD=<your store password>`\
`MYAPP_UPLOAD_KEY_PASSWORD=<your key password>`\

## Building the Android App

This project has three environments: development, staging, and production. Based on your requirements, set up the appropriate environment using the following steps:

1. Development Environment:

   `yarn android:dev`

2. Staging Environment:

   `yarn android:staging`

3. Production Environment:

   `yarn android:prod`

Note: Make sure to install the required dependencies and set up the environment for android before running the build command.


## Setup iOS Permissions 

1. Go to iOS folder:

   `cd ios`

2. Excute command:

   `yarn react-native setup-ios-permissions`

3. Install Pods:

   `pod install`

Note: Make sure to set up ios permissions and install pods for ios before running app.


## Building the iOS App

This project has three environments: development, staging, and production. Based on your requirements, set up the appropriate environment using the following steps:

1. Development Environment:

   `yarn ios:dev`

2. Staging Environment:

   `yarn ios:staging`

3. Production Environment:

   `yarn ios:prod`

Note: Make sure to install the required dependencies and set up the environment for iOS before running the build command.
