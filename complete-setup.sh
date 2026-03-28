#!/bin/bash

# Update package manager
sudo apt-get update

# Install necessary packages
sudo apt-get install -y git curl wget

# Clone the repository
git clone https://github.com/mfhquzit/qfx-finance.com.git

# Change into the repository directory
cd qfx-finance.com

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Run the application
npm start

# Additional setup commands can be added here