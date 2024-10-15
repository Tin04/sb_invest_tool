# Hypixel SkyBlock Investment Management Tool

## Overview
This project is an HTML and JavaScript-based management tool designed for tracking and managing your investments in Hypixel SkyBlock. It allows users to record investment details, monitor prices, and analyze the performance of their investments over time.

## Features
- **Investment Recording**: Easily mark down investment details for various items.
- **Price Monitoring**: Track the update-to-date prices of your list of invested items to stay informed of changes.
- **Price History**: View historical price data for items.
- **Firesale Countdown**: Displays a countdown timer for ongoing firesale events.
- **Theme Toggle**: Switch between light and dark themes for better user experience.
- **Responsive Design**: Works well on various screen sizes.

## Technologies Used
- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express
- **API**: Hypixel API, Coflnet API
- **Routing**: React Router
- **Version Control**: Git, GitHub

## Installation
To set up the project locally, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skyblock-invest-tool.git
   ```
2. Navigate to the project directory:
   ```bash
   cd skyblock-invest-tool
   ```
3. Install dependencies in both /frontend and /backend directories:
   ```bash
   npm install
   ```
4. Set up environment variables (see next section)

## Environment Variables
To configure the application, you need to create a `.env.local` file under /frontend. This file will store your environment variables.

1. Create a file named `.env.local` in the root of your project directory.
2. Add the following line to the file:
   ```plaintext
   VITE_BACKEND_HOST='http://localhost:5000'
   ```
This will ensure that your application can access the backend host correctly. You can use an alternative port other than 5000.

## Usage
To run the application locally, please follow the steps:
1. Navigate to the /backend directory and start the backend server:
    ```bash
    npm start
    ```
2. Open a new terminal, navigate to the /frontend directory:
    ```bash
    npm run dev
    ```
3. Ctrl+click the provided URL, e.g. http://localhost:5173/, to access the web app.