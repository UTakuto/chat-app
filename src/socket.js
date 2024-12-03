"use client";

import { io } from "socket.io-client";

// 必ずサーバーの URL と一致させる
export const socket = io("http://localhost:3000", {
    path: "/socket.io", // サーバー側と一致するパス
});
