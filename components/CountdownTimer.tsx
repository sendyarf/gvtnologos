import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onCountdownFinish?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (target: Date): TimeLeft | null => {
  const difference = target.getTime() - new Date().getTime();
  if (difference <= 0) {
    return null;
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownSegment: React.FC<{ value: number; maxValue: number; label: string }> = ({ value, maxValue, label }) => {
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / maxValue) * circumference;

    return (
        <div className="flex flex-col items-center justify-center text-center w-20 h-28 sm:w-28 sm:h-36">
            <div className="relative w-full h-full flex items-center justify-center">
                <svg className="absolute w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                        <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        className="stroke-border"
                        fill="none"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke="url(#countdownGradient)"
                        fill="none"
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                            transition: 'stroke-dashoffset 0.5s linear'
                        }}
                    />
                </svg>
                <div className="flex flex-col">
                    <span className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                        {String(value).padStart(2, '0')}
                    </span>
                </div>
            </div>
             <span className="text-xs sm:text-sm font-medium text-secondary uppercase tracking-widest -mt-2">
                {label}
            </span>
        </div>
    );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onCountdownFinish }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate));
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      if (newTimeLeft === null) {
        clearInterval(timer);
      }
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timeLeft]);

  useEffect(() => {
    if (timeLeft === null && !isChecking && onCountdownFinish) {
      setIsChecking(true);
      setTimeout(onCountdownFinish, 1500);
    }
  }, [timeLeft, isChecking, onCountdownFinish]);

  if (isChecking) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4 space-y-3">
        <svg className="animate-spin h-8 w-8 text-accent1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-lg font-semibold text-primary">Checking for Live Stream...</h3>
        <p className="text-secondary text-sm">The match should be starting any moment.</p>
      </div>
    );
  }

  if (!timeLeft) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
            <h3 className="text-2xl font-bold text-primary mb-2">Match Has Started!</h3>
            <p className="text-secondary">If the stream isn't available, we're checking for updates.</p>
        </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-2 sm:p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-medium text-secondary mb-3 sm:mb-4">Countdown to Kick-off</h3>
        <div className="flex items-start justify-center gap-x-2 sm:gap-x-4 md:gap-x-6 scale-90 sm:scale-100">
            <CountdownSegment value={timeLeft.days} maxValue={99} label="Days" />
            <CountdownSegment value={timeLeft.hours} maxValue={24} label="Hours" />
            <CountdownSegment value={timeLeft.minutes} maxValue={60} label="Minutes" />
            <CountdownSegment value={timeLeft.seconds} maxValue={60} label="Seconds" />
        </div>
    </div>
  );
};

export default CountdownTimer;