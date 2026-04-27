import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const generateCaptcha = () => {
    const operations = [
        () => {
            const a = Math.floor(Math.random() * 15) + 1;
            const b = Math.floor(Math.random() * 15) + 1;
            return { question: `${a} + ${b}`, answer: a + b };
        },
        () => {
            const a = Math.floor(Math.random() * 10) + 10;
            const b = Math.floor(Math.random() * 9) + 1;
            return { question: `${a} − ${b}`, answer: a - b };
        },
        () => {
            const a = Math.floor(Math.random() * 9) + 2;
            const b = Math.floor(Math.random() * 5) + 2;
            return { question: `${a} × ${b}`, answer: a * b };
        },
    ];
    const op = operations[Math.floor(Math.random() * operations.length)];
    return op();
};

function SimpleCaptcha({ onVerify }) {
    const [captcha, setCaptcha] = useState(generateCaptcha);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('idle'); // idle | success | error
    const [isSpinning, setIsSpinning] = useState(false);

    const refresh = useCallback(() => {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 400);
        setCaptcha(generateCaptcha());
        setInput('');
        setStatus('idle');
        onVerify(false);
    }, [onVerify]);

    useEffect(() => {
        onVerify(false);
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);

        if (val === '') {
            setStatus('idle');
            onVerify(false);
            return;
        }

        const userAnswer = parseInt(val, 10);
        if (!isNaN(userAnswer)) {
            if (userAnswer === captcha.answer) {
                setStatus('success');
                onVerify(true);
            } else {
                setStatus('error');
                onVerify(false);
            }
        }
    };

    return (
        <div className="captcha-wrapper">
            <div className="captcha-label">
                <span>Security Verification</span>
                <span className="captcha-required">Required</span>
            </div>
            <div className={`captcha-container ${status}`}>
                <div className="captcha-question-box">
                    <div className="captcha-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <div className="captcha-question">
                        <span className="captcha-text">Solve:</span>
                        <span className="captcha-math">{captcha.question} = ?</span>
                    </div>
                    <button
                        type="button"
                        className={`captcha-refresh ${isSpinning ? 'spinning' : ''}`}
                        onClick={refresh}
                        title="Get a new question"
                    >
                        <FiRefreshCw />
                    </button>
                </div>

                <div className="captcha-input-row">
                    <input
                        type="number"
                        className="captcha-input"
                        placeholder="Your answer"
                        value={input}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <div className="captcha-status-icon">
                        {status === 'success' && <FiCheckCircle className="captcha-icon-success" />}
                        {status === 'error' && <FiAlertCircle className="captcha-icon-error" />}
                    </div>
                </div>

                {status === 'success' && (
                    <p className="captcha-feedback captcha-feedback-success">✓ Verified! You may proceed.</p>
                )}
                {status === 'error' && (
                    <p className="captcha-feedback captcha-feedback-error">✗ Incorrect answer. Try again.</p>
                )}
            </div>
        </div>
    );
}

export default SimpleCaptcha;
