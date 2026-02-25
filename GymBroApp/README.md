# 🏋️ GymBro – Find Your Gym Partner

A Tinder-like app for meeting gym partners. Swipe right to connect, swipe left to pass.

## Architecture

```
GymBroApp/
├── app/                  # Expo Router screens
│   ├── _layout.tsx       # Root layout (stack navigation, no tab bar)
│   ├── index.tsx         # Main swipe screen
│   ├── profile.tsx       # Edit your profile
│   ├── settings.tsx      # Filter settings (age, type, gym)
│   ├── matches.tsx       # Your matched gym partners
│   └── chat.tsx          # 1-on-1 messaging
├── components/
│   ├── top-bar.tsx       # Profile + GymBro logo + Settings nav
│   ├── profile-card.tsx  # Swipeable user card
│   ├── action-buttons.tsx# Pass / Like buttons
│   └── match-modal.tsx   # "It's a Match!" popup
├── types/index.ts        # TypeScript types
├── services/api.ts       # Backend API client
├── constants/theme.ts    # Colors & fonts
├── backend/
│   ├── src/
│   │   ├── index.ts      # Express server entry point
│   │   ├── db/
│   │   │   ├── pool.ts   # MariaDB connection pool
│   │   │   ├── init.ts   # Schema creation (run once)
│   │   │   └── seed.ts   # Demo data
│   │   └── routes/
│   │       ├── users.ts       # /api/users/*
│   │       ├── gyms.ts        # /api/gyms/*
│   │       ├── relations.ts   # /api/relations/*
│   │       └── attachments.ts # /api/attachments/*
│   └── .env              # DB credentials
```

## Database (MariaDB)

| Table        | Purpose                                        |
|--------------|-------------------------------------------------|
| `attachment` | Raw image blobs (in-DB, no external service)    |
| `gym`        | Gym name + location                             |
| `user`       | Profile (name, age, type, description, gym FK)  |
| `user_exos`  | Favourite exercises per user (max 3)            |
| `user_like`  | Directional "I like this person"                |
| `relation`   | Match (created when both users liked each other)|
| `message`    | Chat messages within a relation                 |

## Getting Started

### 1. Backend

```bash
# Install MariaDB and create the database
sudo mysql -e "CREATE DATABASE gymbro; CREATE USER 'gymbro'@'localhost' IDENTIFIED BY 'gymbro_pass'; GRANT ALL ON gymbro.* TO 'gymbro'@'localhost';"

# Setup
cd backend
npm install

# Create tables
npm run db:init

# (Optional) seed demo data
npx ts-node src/db/seed.ts

# Start the API server
npm run dev
```

### 2. Frontend (Expo)

```bash
# From the root GymBroApp directory
npm install
npx expo start
```

> The frontend ships with **mock data** so you can use it immediately without running the backend. To connect it to the real API, update `BASE_URL` in `services/api.ts` and replace the mock data calls in screens.

## Features

- **Swipe cards** – gesture-based (swipe left = pass, swipe right = like) + tap buttons
- **Match detection** – when two users like each other, a match popup appears
- **Profile editing** – name, age, training type, description, favourite exercises (3 max)
- **Filters** – age range, exercise type, specific gym
- **Matches list** – see your gym partners
- **Chat** – message your matches
- **Image attachments** – stored as BLOBs in MariaDB (max 5 MB, configurable)


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
