#!/bin/bash
# Quick Start Guide for E-Hividy E-Commerce Shop

echo "================================"
echo "E-Hividy Quick Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v12 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔧 Setting up database..."
echo "Make sure XAMPP MySQL is running!"
echo ""

# Setup database
npm run setup

if [ $? -eq 0 ]; then
    echo "✓ Database setup completed"
else
    echo "❌ Database setup failed. Make sure MySQL is running."
    exit 1
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "To start the server, run:"
echo "  npm start       (production)"
echo "  npm run dev     (development with auto-reload)"
echo ""
echo "Then open your browser to: http://localhost:3000"
echo ""
