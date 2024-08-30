import { server } from './app.js'; // Import `server` from `app.js`

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
