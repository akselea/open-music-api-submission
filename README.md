# Open Music API
**Made by Aksel E**

Part of Dicoding Academy final submission for Back-end Application Fundamentals using RESTful API in Hapi.js.

Tools/Framework used:
- Hapi.js
- PostgreSQL
- JWT
- RabbitMQ
- Redis

## How to Use

- Install the depedencies:
```
npm i
```
- Run the server using nodemon:
```
npm run start-dev
```
This project server is running in http://localhost:5000.

## Troubleshoot
If there is an error in the test, use the following SQL query:
```
truncate album_likes, albums, authentications, collaborations, playlist_activities, playlist_songs, playlists, songs, users;
```
