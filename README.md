# SBHRA Mobile Application

## Overview

The **SBHRA Mobile Application** was developed for the **Sardinia Bay
Horse Riders Association (SBHRA)** to streamline trail usage
documentation, animal sighting reports, and rider safety tracking.

Built with **React Native**, **Firebase**, and **Google Maps API**, the
app ensures accurate, real-time data collection to meet compliance
requirements and enhance the rider experience.

------------------------------------------------------------------------

## Features

-   **Horse Management**: Track individual horse profiles, ride stats,
    and achievements.\
-   **GPS Trail Tracking**: Real-time ride tracking with official trail
    identification.\
-   **Obstacle & Trail Updates**: Riders can log trail issues or
    obstructions.\
-   **SOS Alert System**: Emergency alerts with live location sharing.\
-   **Animal Sightings**: Document sightings with photos, notes, and
    checklist categories.\
-   **Analytics Dashboard**: View community and personal stats, export
    reports (monthly, quarterly, annual).\
-   **Admin Controls**: Manage user access, view aggregated ride data,
    generate compliance reports.

------------------------------------------------------------------------

## Technology Stack

-   **Frontend**: React Native (cross-platform: iOS + Android)\
-   **Backend**: Firebase (Firestore, Authentication, Functions,
    Storage)\
-   **Mapping & GPS**: Google Maps API\
-   **Notifications**: Firebase Cloud Messaging

------------------------------------------------------------------------

## Installation & Setup

### Prerequisites

-   Node.js (\>=16)
-   React Native CLI
-   Firebase project & credentials
-   Google Maps API key

### Steps

1.  Clone the repository:

    ``` bash
    git clone https://github.com/strata/sbhra-app.git
    cd sbhra-app
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Configure Firebase:

    -   Add your Firebase config to `firebaseConfig.js`
    -   Enable Firestore, Authentication, and Storage in your Firebase
        Console.

4.  Add Google Maps API Key:

    -   Insert your key into `app.json` under
        `android.config.googleMaps.apiKey`.

5.  Run the app:

    ``` bash
    npx react-native run-android
    npx react-native run-ios
    ```

------------------------------------------------------------------------

## Usage

1.  **Register/Login** via Firebase Authentication.\
2.  **Set up your Profile** (rider + horse details).\
3.  **Start a Ride** → enables GPS tracking.\
4.  **During Ride**: log obstacles, sightings, or use SOS if needed.\
5.  **End Ride**: review summary, save, and sync with Firebase.\
6.  **Admins**: access analytics dashboard for compliance reports.

------------------------------------------------------------------------

## Contribution

Team members and contributions: - **Joshua Suth** -- Profile,
Achievements, Horse Management, Reporting\
- **Sam** -- Analytics Dashboard\
- **Caleb** -- Firebase Integration, Reports & Sightings, Dashboard\
- **Logan** -- Mapping Functionality\
- **Kyle** -- Dashboard + SOS System

------------------------------------------------------------------------

## License

This application is the property of **SBHRA**.\
All rights reserved © 2025.
