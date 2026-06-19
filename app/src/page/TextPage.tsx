import React, { useEffect, useState } from 'react';
import { useWebSocket, type PostMessage } from '../contexts/WebsocketContext';

export default function TestPage() {
    // State untuk menampung pesan test yang masuk dari backend
    const [messages, setMessages] = useState<PostMessage[]>([]);
    const { stompClient, isConnected } = useWebSocket();

    useEffect(() => {
        // 1. Pastikan koneksi global WebSocket sudah siap
        if (!stompClient || !isConnected) return;

        console.log("Memulai subscribe ke /topic/posts untuk testing...");

        // 2. Subscribe ke channel tujuan broadcast backend
        const subscription = stompClient.subscribe(
            '/topic/posts', 
            (response) => {
                // Parse JSON data yang dikirim oleh SimpMessagingTemplate
                const dataMasuk: PostMessage = JSON.parse(response.body);
                console.log("Pesan realtime berhasil ditangkap:", dataMasuk);

                // Masukkan ke dalam list state agar muncul di UI
                setMessages((prev) => [dataMasuk, ...prev]);
            }
        );

        // 3. Cleanup: unsubscribe saat pindah halaman/komponen ditutup
        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, isConnected]);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Status Koneksi: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</h2>
            <p>Silakan tembak <code>POST http://localhost:8080/api/test-broadcast</code> via Postman untuk melihat perubahan di bawah ini secara realtime!</p>

            <hr />

            <h3>Log Pesan Masuk ({messages.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.length === 0 ? (
                    <p style={{ color: 'gray' }}>Menunggu data dari Postman...</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} style={{ border: '2px solid black', padding: '10px', borderRadius: '5px', background: '#f9f9f9' }}>
                            <h4>{msg.title} <span style={{ fontSize: '12px', color: 'gray' }}>[{msg.category}]</span></h4>
                            <p>{msg.content}</p>
                            <small>Pengirim: <b>{msg.username}</b></small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}