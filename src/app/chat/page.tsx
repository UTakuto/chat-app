"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, push, onValue } from "firebase/database";
import style from "./chat.module.css";

interface Message {
    id: string;
    nickname: string;
    text: string;
}

function ChatComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nicknameParam = searchParams.get("nickname");
    const [nickname] = useState<string | null>(nicknameParam);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<string[]>([]);

    const templateMessages = [
        "今日の集合時間は11時です",
        "1号館準備完了です",
        "2号館準備完了です",
        "3号館準備完了です",
        "1号館ヘルプです",
        "2号館ヘルプです",
        "3号館ヘルプです",
        "1号館片付けヘルプです",
        "2号館片付けヘルプです",
        "3号館片付けヘルプです",
        "メイン教室片付けヘルプです",
        "IT作品展示片付けヘルプです",
        "IT作品展示片付けヘルプです",
        "ゲーム企画集合",
        "ゲームPG集合",
        "CG集合",
        "IT集合",
        "Web集合",
        "了解です",
        "向かいます",
        "お疲れ様でした",
    ];

    useEffect(() => {
        if (!nickname) {
            router.push("/nickname");
            return;
        }

        const messagesRef = ref(db, "messages");

        // Realtime listener
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedMessages = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...(value as object),
                })) as Message[];
                setMessages(formattedMessages);
            }
        });

        // Cleanup nickname on tab close
        const handleBeforeUnload = () => {
            localStorage.removeItem("nickname");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [nickname, router]);

    const sendMessage = () => {
        if (!nickname || !message.trim()) return;

        const newMessage: Omit<Message, "id"> = { nickname, text: message };
        push(ref(db, "messages"), newMessage); // データベースに新しいメッセージを追加
        setMessage(""); // 入力欄をクリア
        setFilteredTemplates([]); // 予測をクリア
    };

    const handleTemplateClick = (template: string) => {
        setMessage(template);
        setFilteredTemplates([]); // 予測をクリア
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setMessage(inputValue);

        if (inputValue) {
            const filtered = templateMessages.filter((template) => template.includes(inputValue));
            setFilteredTemplates(filtered);
        } else {
            setFilteredTemplates([]);
        }
    };

    return (
        <div className={style.content}>
            <h1>Chat Room</h1>
            <div className={style.chatContainer}>
                {messages.map((msg) => (
                    <div key={msg.id} className={style.messageBox}>
                        <div className={style.message}>
                            <p className={style.nickname}>{msg.nickname}</p>
                            <p className={style.text}>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            {filteredTemplates.length === 0 && (
                <ul className={style.templateContainer}>
                    {templateMessages.map((template, index) => (
                        <li
                            key={index}
                            onClick={() => handleTemplateClick(template)}
                            className={style.templateItem}
                        >
                            {template}
                        </li>
                    ))}
                </ul>
            )}
            {filteredTemplates.length > 0 && (
                <ul className={style.templateContainer}>
                    {filteredTemplates.map((template, index) => (
                        <li
                            key={index}
                            onClick={() => handleTemplateClick(template)}
                            className={style.templateItem}
                        >
                            {template}
                        </li>
                    ))}
                </ul>
            )}
            <div className={style.inputBox}>
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="メッセージを入力"
                    className={style.input}
                />
                <button onClick={sendMessage} className={style.sendBtn}>
                    送信
                </button>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatComponent />
        </Suspense>
    );
}
