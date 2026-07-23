# Weather Intelligence App

A React + Vite application generated using Google AI Studio App Build, connected to GitHub, and deployed to Cloudflare Pages.

## Overview
This application allows users to search for cities, retrieve current weather conditions, view a 7-day forecast, see visual weather charts, and receive practical planning recommendations.

## APIs Used
- **Open-Meteo Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search` (Converts city names to latitude and longitude coordinates)
- **Open-Meteo Forecast API**: `https://api.open-meteo.com/v1/forecast` (Fetches current weather and 7-day forecast data)

## Build & Deployment Process
1. **App Generation**: Created in **Google AI Studio App Build**.
2. **Version Control**: Direct synchronization from Google AI Studio to **GitHub**.
3. **Cloud Deployment**: Deployed on **Cloudflare Pages** from the GitHub repository.

### Cloudflare Pages Configuration
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Framework preset:** `Vite`
