# MoveMate

MoveMate is a public transportation real-time tracking application designed specifically for Dublin. It integrates real-time locations and arrival predictions for DART and Dublin Bus, along with weather information and user-generated traffic events, providing a one-stop travel reference.

> **About Luas**: The official Luas Forecasting API has been discontinued, and the new GTFS-Realtime data source for arrival predictions (Trip Updates) is unstable. In this version, Luas real-time predictions are temporarily disabled, and only static routes and station information are provided. Vehicle Positions data is available, and community contributions are welcome to integrate it.

---

## Key Features

- **DART**: Real-time train location tracking and accurate arrival predictions.
- **Dublin Bus**: Real-time bus locations and estimated arrival times.
- **Weather Forecast**: Displays current weather conditions and short-term forecasts, with special alerts for severe weather (e.g., rain or snow).
- **Traffic Event Sharing**: Users can post real-time traffic conditions (e.g., delays, construction), upload images, and share updates. (Note: WebSocket is not implemented yet.)
- **Interactive Map**: Supports map zooming, location tracking, and filtering by route and transportation type.

---

## Tech Stack

| Category   | Technologies                                                     |
| :--------- | :--------------------------------------------------------------- |
| **Frontend** | `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `Zustand`, `Leaflet` |
| **Backend**  | `Spring Boot (Java)`, `Maven`, `Docker`                          |
| **Data**     | `REST API`, `GTFS-Realtime`                                       |

---

## Project Structure

```
MoveMate/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand state management
│   │   └── lib/           # API clients, utility functions
├── server/                # Backend (Spring Boot)
│   ├── src/main/java/
│   ├── pom.xml
│   └── Dockerfile
└── README.md
```

---

## Quick Start

### Frontend

```bash
cd client
npm install
npm run dev
# The app will run at http://localhost:5173
```

### Backend

```bash
cd server

# Development mode
./mvnw spring-boot:run

# Docker deployment
docker build -t movemate-server .
docker run -p 8080:8080 movemate-server
```

---

## Feature Status

| Feature          | Status   | Notes                                      |
| :--------------- | :------: | :----------------------------------------- |
| DART Real-Time   | Available | Real-time locations and arrival predictions |
| Dublin Bus Real-Time | Available | Real-time locations and estimated arrival times |
| Luas Vehicle Positions | Integratable | Can be integrated via GTFS-R Vehicle Positions |
| Luas Arrival Predictions | Unavailable | GTFS-R Trip Updates data is incomplete/unstable |
| Weather          | Available | Real-time weather and forecasts            |
| User Event System | Available | Supports posts and image uploads (no WebSocket) |
| Map Interaction  | Available | Responsive design, works on desktop and mobile |

---

## Future Plans

- [ ] Implement WebSocket for real-time traffic event updates.
- [ ] Integrate Luas vehicle positions: Display Luas tram locations on the map in real time.
- [ ] Explore alternatives for Luas predictions: Investigate self-calculated or third-party data sources to supplement arrival predictions.
- [ ] Multi-modal route planning: Implement simple cross-transportation route planning functionality.
- [ ] Progressive Web App (PWA): Allow users to "install" the app on their desktop or mobile home screen.
- [ ] Enhance event features: Add likes and comments to user-posted traffic events.