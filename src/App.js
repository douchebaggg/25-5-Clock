import './App.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useState, useEffect, useRef} from 'react';

const audioSrc = 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav';
function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
  const [timeLabel, setTimeLabel] = useState("Session")
  const intervalRef = useRef(null);
  let audio = useRef(null);

  useEffect(() => {
  if (isRunning) {
    if (timeLeft >= 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft < 0) {
      // Switch between session and break times
      if (timeLabel === "Break") {
        setIsSession(true); // Set back to "Session"
        setTimeLabel("Session");
        const newTime = sessionTime * 60;
        setTimeLeft(newTime);
      } else {
        setIsSession(!isSession);
        setTimeLabel("Break");
        breakSound();
        const newTime = isSession ? breakTime * 60 : sessionTime * 60;
        setTimeLeft(newTime);
      }
    }
  } else {
    clearInterval(intervalRef.current);
  }
  return () => clearInterval(intervalRef.current);
}, [isRunning, timeLeft, isSession, breakTime, sessionTime, timeLabel]);
 
  const breakSound = () => {
    audio.currentTime = 0;
    audio.play();
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    audio.pause();
    audio.currentTime = 0;
    setBreakTime(5);
    setSessionTime(25);
    setIsSession(true);
    setIsRunning(false);
    setTimeLabel("Session");
    setTimeLeft(25 * 60);
  };

  const updateSessionTime = (newSessionTime) => {
    if (!isRunning) {
      if (newSessionTime >= 1 && newSessionTime <= 60) {
        setSessionTime(newSessionTime);
        if (timeLabel === "Session") {
          const newDuration = newSessionTime * 60;
          setTimeLeft(newDuration);
        }
      }
    }
  }

  const updateBreaktime = (newBreakTime) => {
    if (!isRunning) {
      if (newBreakTime >= 1 && newBreakTime <= 60) {
        setBreakTime(newBreakTime);
        if (timeLabel === "Break") {
          const newDuration = newBreakTime * 60;
          setTimeLeft(newDuration);
        }
      }
    }
  };
  const addSessionTime= () => {
    if (!isRunning) {
     updateSessionTime(sessionTime + 1);
    }
  };
  

  const removeSessionTime = () => {
    if (!isRunning) {
      updateSessionTime(sessionTime - 1);
     }
  };

  const addBreakTime = () => {
    if (!isRunning) {
    updateBreaktime(breakTime + 1);
      }
    }
  

  const removeBreakTime = () => {
    if (!isRunning) {
      updateBreaktime(breakTime - 1)
    }
  };

return(
     <div id="container">
      <div id="App">
        <h1 className="main-title"> 25+5 Clock</h1>
        
        <div className="length-control">
        <div id="break-label">Break Length</div>
          <button className="btn-level" id="break-increment" onClick={addBreakTime} disabled ={isRunning}> <AddIcon /></button>
          <div className="btn-level" id="break-length"> {breakTime} </div>
          <button className="btn-level" id="break-decrement" onClick={removeBreakTime} disabled ={isRunning} ><RemoveIcon /></button>
        </div>

        <div className="length-control">
        <div id="session-label">Session Length</div>
          <button className="btn-level" id="session-increment" onClick={addSessionTime} disabled ={isRunning}> <AddIcon /></button>
          <div className="btn-level" id="session-length">{sessionTime}</div>
          <button className="btn-level" id="session-decrement" onClick={removeSessionTime} disabled ={isRunning} ><RemoveIcon /></button>
        </div>
        
        <div className="timer">
          <div className="timer-wrapper"> 
          <div id="timer-label">{timeLabel}</div>
          <div id="time-left" className={timeLabel === "Break" ? "red-time" : ""}>{formatTime(timeLeft)}</div>
          <div className="timer-control">
          <div>
            <div className='timer-start' id="start_stop" onClick={toggleTimer}>{isRunning ? <PauseIcon/> : <PlayArrowIcon/>} </div>
          </div>
            <div className="timer-reset" id="reset" onClick={resetTimer}> <RestartAltIcon /> </div>
          </div>
          <audio ref={(t) => (audio = t)} src={audioSrc} id="beep" />
        </div>
        
      </div> 
      <div>

    </div>
    </div> 
    </div>
);
}

export default App;

