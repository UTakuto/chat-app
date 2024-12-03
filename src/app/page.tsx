"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./index.css";

export default function HomePage() {
    const [nickname, setNickname] = useState("");
    const router = useRouter();

    const handleSubmit = () => {
        if (nickname.trim()) {
            router.push(`/chat?nickname=${nickname}`);
        }
    };

    return (
        <div>
            <h1>名前を決めてください</h1>
            <div className="inputBox">
                <input
                    type="text"
                    placeholder="名前"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="input"
                />
                <button onClick={handleSubmit} className="sendBtn">
                    登録
                </button>
                {/* <div>/</div> */}
            </div>
        </div>
    );
}
