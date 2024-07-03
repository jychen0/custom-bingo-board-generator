import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [board, setBoard] = useState([]);
  const [markedCells, setMarkedCells] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/bingo-options.txt')
      .then(response => response.text())
      .then(text => {
        const wordsArray = text.trim().split('\n');
        setWords(wordsArray);
        setBoard(generateRandomBoard(wordsArray));
        setMarkedCells(Array(5).fill().map(() => Array(5).fill(false)));
      })
      .catch(error => console.error('Error fetching words:', error));
  }, []);

  const generateRandomBoard = (words) => {
    let shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const board = Array(5).fill().map(() => shuffledWords.splice(0, 5));
    board[2][2] = "Free Space";
    return board;
  };

  const resetBoard = () => {
    setBoard(generateRandomBoard(words));
    setMarkedCells(Array(5).fill().map(() => Array(5).fill(false)));
  };

  const toggleCell = (rowIndex, colIndex) => {
    setMarkedCells(prevMarkedCells => {
      const newMarkedCells = [...prevMarkedCells];
      newMarkedCells[rowIndex] = [...newMarkedCells[rowIndex]];
      newMarkedCells[rowIndex][colIndex] = !newMarkedCells[rowIndex][colIndex];
      return newMarkedCells;
    });
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleUserInputSubmit = () => {
    const inputWords = userInput.trim().split('\n').filter(word => word.trim() !== '');
    if (inputWords.length >= 25) {
      setWords(inputWords);
      setBoard(generateRandomBoard(inputWords));
      setMarkedCells(Array(5).fill().map(() => Array(5).fill(false)));
    } else {
      alert('Please input at least 25 items.');
    }
  };

  const showTooltip = (word, event) => {
    const cell = event.target.getBoundingClientRect();
    const tooltipX = cell.left - 360; // Center horizontally
    const tooltipY = cell.top + 20; // 40px above the cell
    setTooltipVisible(true);
    setTooltipText(word);
    setTooltipPosition({ x: tooltipX, y: tooltipY });
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
    setTooltipText('');
  };

  return (
    <div className="App">
      <h1>Bingo Board Generator</h1>
      <div className="main-container">
        <div className="board-container">
          <div className="board">
            {board.flat().map((word, index) => (
              <div
                key={index}
                className={`cell ${markedCells[Math.floor(index / 5)][index % 5] ? 'marked' : ''}`}
                onClick={() => toggleCell(Math.floor(index / 5), index % 5)}
                onMouseEnter={(e) => showTooltip(word, e)}
                onMouseLeave={hideTooltip}
              >
                {word}
              </div>
            ))}
            {tooltipVisible && (
              <div
                className="tooltip"
                style={{
                  left: tooltipPosition.x,
                  top: tooltipPosition.y - 30,
                  transform: 'translateX(-50%)',
                }}
              >
                {tooltipText}
              </div>
            )}
          </div>
          <div className="input-container">
            <textarea
              value={userInput}
              onChange={handleUserInputChange}
              placeholder="Enter at least 25 items, one per line"
            />
            <button onClick={handleUserInputSubmit} className="submit-button">Submit</button>
          </div>
        </div>
        <button onClick={resetBoard} className="generate-button">Generate New Board</button>
      </div>
    </div>
  );
}

export default App;
