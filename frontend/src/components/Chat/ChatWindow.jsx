import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Bot, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { processMessage, getWelcomeMessage, getModuleInfo } from '../../utils/chatbot'
import './Chat.css'

function ChatWindow() {
    const { module } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const moduleInfo = getModuleInfo(module)

    // Initialize with welcome message
    useEffect(() => {
        const welcomeMsg = getWelcomeMessage(module)
        setMessages([
            {
                id: Date.now(),
                type: 'bot',
                content: welcomeMsg,
                timestamp: new Date()
            }
        ])
    }, [module])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        // Process message and get response
        try {
            const response = await processMessage(module, input.trim(), user)

            // Simulate typing delay for natural feel
            await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: response.text,
                data: response.data,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: "I'm sorry, I couldn't process your request. Please try again.",
                isError: true,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        }

        setIsTyping(false)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="chat-page">
            {/* Chat Header */}
            <header className="chat-header glass-card">
                <button
                    className="back-btn btn-icon"
                    onClick={() => navigate('/dashboard')}
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <div
                    className="chat-module-icon"
                    style={{ background: moduleInfo.gradient }}
                >
                    <moduleInfo.icon size={20} />
                </div>
                <div className="chat-module-info">
                    <h1>{moduleInfo.title}</h1>
                    <p>{isTyping ? 'Typing...' : 'Online'}</p>
                </div>
            </header>

            {/* Messages Container */}
            <div className="chat-messages">
                <div className="messages-list">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.type} animate-slide-up`}
                        >
                            <div className="message-avatar">
                                {message.type === 'bot' ? (
                                    <Bot size={18} />
                                ) : (
                                    <User size={18} />
                                )}
                            </div>
                            <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                                <div className="message-content">
                                    {message.content}
                                </div>
                                {message.data && (
                                    <div className="message-data">
                                        {renderMessageData(message.data)}
                                    </div>
                                )}
                                <div className="message-time">
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message bot animate-fade-in">
                            <div className="message-avatar">
                                <Bot size={18} />
                            </div>
                            <div className="message-bubble">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="chat-input-area glass-card">
                <div className="chat-input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        className="chat-input"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// Render structured data (tables, lists, etc.)
function renderMessageData(data) {
    if (!data) return null

    // Render table data
    if (data.type === 'table' && data.rows) {
        return (
            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {data.headers.map((header, i) => (
                                <th key={i}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => (
                                    <td key={j}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    // Render stats/cards
    if (data.type === 'stats' && data.items) {
        return (
            <div className="data-stats">
                {data.items.map((item, i) => (
                    <div key={i} className={`stat-item ${item.status || ''}`}>
                        <span className="stat-item-label">{item.label}</span>
                        <span className="stat-item-value">{item.value}</span>
                    </div>
                ))}
            </div>
        )
    }

    // Render list
    if (data.type === 'list' && data.items) {
        return (
            <ul className="data-list">
                {data.items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        )
    }

    return null
}

export default ChatWindow
