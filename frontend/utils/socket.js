import { io } from "socket.io-client";

// const port = process.env.BACKEND_PORT
const port = 3000

const socket = io.connect(`http://localhost:${port}`);
export default socket;