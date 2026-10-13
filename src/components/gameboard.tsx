import { useState, useEffect } from 'react';
import '../styles/gameboard.css'
function GameBoard() {
    const [values, setValues] = useState<string[][]>([
        [],
        [],
        [],
        [],
        [],
        []
    ]);
    const [correctIndex, setCorrectIndex] = useState<number[][]>([
        [],
        [],
        [],
        [],
        [],
        []
    ]);
    const [yellowIndex, setYellowIndex] = useState<number[][]>([
        [],
        [],
        [],
        [],
        [],
        []
    ]);
    const [grayIndex, setGrayIndex] = useState<number[][]>([
        [],
        [],
        [],
        [],
        [],
        []
    ]);
    const [submittedRows, setSubmittedRows] = useState<number[]>([]);
    const [enterPressed, setEnterPressed] = useState(false);
    const [keyboardInput, setKeyboardInput] = useState('');
    const [gameStart, setGameStart] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);
    const [nextRow, setNextRow] = useState(false);
    const testWord = 'hello';
    const [rowCounter, setRowCounter] = useState(0);
    const [correctCharFlag, setCorrectCharFlag] = useState<string[]>([]);
    const [yellowCharFlag, setYellowCharFlag] = useState<string[]>([]);
    const [grayCharFlag, setGrayCharFlag] = useState<string[]>([]);
    let correctCount = 0;

    const handleKeyboardInput = (letter: string) => {
        if (letter !== 'ENTER' && letter !== 'BACKSPACE' && !gameEnd) {
            setValues(prev => {
                const newRows = [...prev];
                newRows[rowCounter] = [...newRows[rowCounter], letter]
                return newRows;
            });
        }
        else if (letter === 'ENTER' && values[rowCounter].length === 5 && !enterPressed && !gameEnd) {
            tileColors();
            setEnterPressed(true);
            setNextRow(true);
            setSubmittedRows(prev => [...prev, rowCounter]);
            setRowCounter(prev => prev + 1);
        }
        else { //keyboard input is BACKSPACE
            charBackspace();
        }

        if (correctCount === 5) {
            setGameEnd(true);
        }
    }

    const keyboardCharCheck = (letters: string[], correctIndices: number[], yellowIndices: number[], grayIndices: number[]) => {
        for (let j = 0; j < correctIndices.length; j++) {
            let correctIndexValue = values[rowCounter][correctIndices[j]];
            console.log(correctIndexValue);

            if (letters.includes(correctIndexValue)) {
                console.log("enter this if condition for keyboad")
                setCorrectCharFlag(prev =>
                    prev.includes(correctIndexValue)
                        ? prev
                        : [...prev, correctIndexValue]
                );

                console.log(correctCharFlag)
            }
        }

        if (yellowIndices.length > 0) {
            for (let i = 0; i < yellowIndices.length; i++) {
                let yellowIndexValue = values[rowCounter][yellowIndices[i]];
                if (letters.includes(yellowIndexValue)) {
                    setYellowCharFlag(prev =>
                        prev.includes(yellowIndexValue)
                            ? prev
                            : [...prev, yellowIndexValue]
                    );
                }
            }
        }

        if (grayIndices.length > 0) {
            console.log("enters here?")
            for (let i = 0; i < grayIndices.length; i++) {
                console.log(grayIndices[i]);
                let grayIndexValue = values[rowCounter][grayIndices[i]];
                console.log(grayIndexValue);
                if (letters.includes(grayIndexValue)) {
                    setGrayCharFlag(prev =>
                        prev.includes(grayIndexValue)
                            ? prev
                            : [...prev, grayIndexValue]
                    );
                }
            }
        }
        console.log(grayCharFlag)
    }
    const tileColors = () => {
        const newCorrectIndexes: number[] = [];
        const newYellowIndexes: number[] = [];
        const newGrayIndexes: number[] = [];
        const usedLetters: number[] = [];
        let testWordSplit = testWord.toUpperCase().split('');

        for (let i = 0; i < values[rowCounter].length; i++) {

            if (values[rowCounter][i] === testWordSplit[i]) {
                usedLetters.push(i);
                correctCount++;
                newCorrectIndexes.push(i);
                console.log("enter here")
                setCorrectIndex(prev => {
                    const newIndex = [...prev];
                    newIndex[rowCounter] = [...newIndex[rowCounter], i]
                    return newIndex;
                });
            }
        }

        for (let i = 0; i < values[rowCounter].length; i++) {
            //source: https://www.reddit.com/r/learnjavascript/comments/xdp5ga/how_do_i_check_if_one_arrays_element_exist_in/

            if (newCorrectIndexes.includes(i)) {
                continue;
            }
            values[rowCounter].map((char, i) => {

                const index = testWordSplit.findIndex(
                    (targetChar, targetIndex) =>
                        targetChar === char && !usedLetters.includes(targetIndex)
                );

                if (index !== -1) {
                    usedLetters.push(index);
                    newYellowIndexes.push(i);
                    setYellowIndex(prev => {
                        const newIndex = [...prev];
                        newIndex[rowCounter] = [...newIndex[rowCounter], i];
                        return newIndex;
                    });
                }
                else {
                    newGrayIndexes.push(i);
                    setGrayIndex(prev => {
                        const newIndex = [...prev];
                        newIndex[rowCounter] = [...newIndex[rowCounter], i]
                        return newIndex;
                    });
                }
            });
        }
        keyboardCharCheck(values[rowCounter], newCorrectIndexes, newYellowIndexes, newGrayIndexes);
    }

    const charBackspace = () => {
        setValues(prev => {
            const newRows = [...prev];
            newRows[rowCounter] = newRows[rowCounter].slice(0, -1);
            return newRows;
        });
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            setGameStart(true);
            setEnterPressed(false);

            if (/^[a-zA-Z]$/.test(event.key) && values[rowCounter].length < 5 && !gameEnd) {
                console.log("enter in keystroke")
                const capitalLetter = event.key.toUpperCase();
                setValues(prev => {
                    const newRows = [...prev];
                    newRows[rowCounter] = [...newRows[rowCounter], capitalLetter]
                    return newRows;
                });

                console.log(values);
            }

            if (event.key === 'Backspace') {
                charBackspace();
            }

            if (event.key === 'Enter' && values[rowCounter].length === 5 && !enterPressed && !gameEnd) {
                console.log("enter pressed")
                console.log(values.length);

                tileColors();
                setEnterPressed(true);
                setNextRow(true);
                setSubmittedRows(prev => [...prev, rowCounter]);
                setRowCounter(prev => prev + 1);
            }

            if (correctCount === 5) {
                setGameEnd(true);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [values, enterPressed]);

    useEffect(() => {
        // console.log(correctIndex);
        // console.log(yellowIndex);
        console.log("correct index length:", correctIndex[rowCounter].length)
        console.log("CORRECT INDEX:", correctIndex);
        console.log("next row:", nextRow);
    }, [nextRow, correctIndex, correctIndex[rowCounter].length]);

    return (
        <div className="game-board">
            <div className="tile-container">
                <div className="row" id="row-1">
                    <div className={(submittedRows.includes(0) && correctIndex[0].includes(0)) ? 'correct-tile' : submittedRows.includes(0) && yellowIndex[0].includes(0) ? 'yellow-tile' : submittedRows.includes(0) && grayIndex[0].includes(0) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {values[0][0]}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(0) && correctIndex[0].includes(1)) ? 'correct-tile' : submittedRows.includes(0) && yellowIndex[0].includes(1) ? 'yellow-tile' : submittedRows.includes(0) && grayIndex[0].includes(1) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {values[0][1]}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(0) && correctIndex[0].includes(2)) ? 'correct-tile' : submittedRows.includes(0) && yellowIndex[0].includes(2) ? 'yellow-tile' : submittedRows.includes(0) && grayIndex[0].includes(2) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {values[0][2]}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(0) && correctIndex[0].includes(3)) ? 'correct-tile' : submittedRows.includes(0) && yellowIndex[0].includes(3) ? 'yellow-tile' : submittedRows.includes(0) && grayIndex[0].includes(3) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {values[0][3]}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(0) && correctIndex[0].includes(4)) ? 'correct-tile' : submittedRows.includes(0) && yellowIndex[0].includes(4) ? 'yellow-tile' : submittedRows.includes(0) && grayIndex[0].includes(4) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {values[0][4]}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={(submittedRows.includes(1) && correctIndex[1].includes(0)) ? 'correct-tile' : submittedRows.includes(1) && yellowIndex[1].includes(0) ? 'yellow-tile' : submittedRows.includes(1) && grayIndex[1].includes(0) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[1][0] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(1) && correctIndex[1].includes(1)) ? 'correct-tile' : submittedRows.includes(1) && yellowIndex[1].includes(1) ? 'yellow-tile' : submittedRows.includes(1) && grayIndex[1].includes(1) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[1][1] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(1) && correctIndex[1].includes(2)) ? 'correct-tile' : submittedRows.includes(1) && yellowIndex[1].includes(2) ? 'yellow-tile' : submittedRows.includes(1) && grayIndex[1].includes(2) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[1][2] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(1) && correctIndex[1].includes(3)) ? 'correct-tile' : submittedRows.includes(1) && yellowIndex[1].includes(3) ? 'yellow-tile' : submittedRows.includes(1) && grayIndex[1].includes(3) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[1][3] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(1) && correctIndex[1].includes(4)) ? 'correct-tile' : submittedRows.includes(1) && yellowIndex[1].includes(4) ? 'yellow-tile' : submittedRows.includes(1) && grayIndex[1].includes(4) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[1][4] : ''}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={(submittedRows.includes(2) && correctIndex[2].includes(0)) ? 'correct-tile' : submittedRows.includes(2) && yellowIndex[2].includes(0) ? 'yellow-tile' : submittedRows.includes(2) && grayIndex[2].includes(0) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[2][0] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(2) && correctIndex[2].includes(1)) ? 'correct-tile' : submittedRows.includes(2) && yellowIndex[2].includes(1) ? 'yellow-tile' : submittedRows.includes(2) && grayIndex[2].includes(1) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[2][1] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(2) && correctIndex[2].includes(2)) ? 'correct-tile' : submittedRows.includes(2) && yellowIndex[2].includes(2) ? 'yellow-tile' : submittedRows.includes(2) && grayIndex[2].includes(2) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[2][2] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(2) && correctIndex[2].includes(3)) ? 'correct-tile' : submittedRows.includes(2) && yellowIndex[2].includes(3) ? 'yellow-tile' : submittedRows.includes(2) && grayIndex[2].includes(3) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[2][3] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(2) && correctIndex[2].includes(4)) ? 'correct-tile' : submittedRows.includes(2) && yellowIndex[2].includes(4) ? 'yellow-tile' : submittedRows.includes(2) && grayIndex[2].includes(4) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[2][4] : ''}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={(submittedRows.includes(3) && correctIndex[3].includes(0)) ? 'correct-tile' : submittedRows.includes(3) && yellowIndex[3].includes(0) ? 'yellow-tile' : submittedRows.includes(3) && grayIndex[3].includes(0) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[3][0] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(3) && correctIndex[3].includes(1)) ? 'correct-tile' : submittedRows.includes(3) && yellowIndex[3].includes(1) ? 'yellow-tile' : submittedRows.includes(3) && grayIndex[3].includes(1) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[3][1] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(3) && correctIndex[3].includes(2)) ? 'correct-tile' : submittedRows.includes(3) && yellowIndex[3].includes(2) ? 'yellow-tile' : submittedRows.includes(3) && grayIndex[3].includes(2) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[3][2] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(3) && correctIndex[3].includes(3)) ? 'correct-tile' : submittedRows.includes(3) && yellowIndex[3].includes(3) ? 'yellow-tile' : submittedRows.includes(3) && grayIndex[3].includes(3) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[3][3] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(3) && correctIndex[3].includes(4)) ? 'correct-tile' : submittedRows.includes(3) && yellowIndex[3].includes(4) ? 'yellow-tile' : submittedRows.includes(3) && grayIndex[3].includes(4) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[3][4] : ''}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={(submittedRows.includes(4) && correctIndex[4].includes(0)) ? 'correct-tile' : submittedRows.includes(4) && yellowIndex[4].includes(0) ? 'yellow-tile' : submittedRows.includes(4) && grayIndex[4].includes(0) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[4][0] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(4) && correctIndex[4].includes(1)) ? 'correct-tile' : submittedRows.includes(4) && yellowIndex[4].includes(1) ? 'yellow-tile' : submittedRows.includes(4) && grayIndex[4].includes(1) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[4][1] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(4) && correctIndex[4].includes(2)) ? 'correct-tile' : submittedRows.includes(4) && yellowIndex[4].includes(2) ? 'yellow-tile' : submittedRows.includes(4) && grayIndex[4].includes(2) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[4][2] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(4) && correctIndex[4].includes(3)) ? 'correct-tile' : submittedRows.includes(4) && yellowIndex[4].includes(3) ? 'yellow-tile' : submittedRows.includes(4) && grayIndex[4].includes(3) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {!gameEnd && nextRow ? values[4][3] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(4) && correctIndex[4].includes(4)) ? 'correct-tile' : submittedRows.includes(4) && yellowIndex[4].includes(4) ? 'yellow-tile' : submittedRows.includes(4) && grayIndex[4].includes(4) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[4][4] : ''}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={(submittedRows.includes(5) && correctIndex[5].includes(0)) ? 'correct-tile' : submittedRows.includes(5) && yellowIndex[5].includes(0) ? 'yellow-tile' : submittedRows.includes(5) && grayIndex[5].includes(0) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[5][0] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(5) && correctIndex[5].includes(1)) ? 'correct-tile' : submittedRows.includes(5) && yellowIndex[5].includes(1) ? 'yellow-tile' : submittedRows.includes(5) && grayIndex[5].includes(1) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[5][1] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(5) && correctIndex[5].includes(2)) ? 'correct-tile' : submittedRows.includes(5) && yellowIndex[5].includes(2) ? 'yellow-tile' : submittedRows.includes(5) && grayIndex[5].includes(2) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[5][2] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(5) && correctIndex[5].includes(3)) ? 'correct-tile' : submittedRows.includes(5) && yellowIndex[5].includes(3) ? 'yellow-tile' : submittedRows.includes(5) && grayIndex[5].includes(3) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[5][3] : ''}
                        </div>
                    </div>
                    <div className={(submittedRows.includes(5) && correctIndex[5].includes(4)) ? 'correct-tile' : submittedRows.includes(5) && yellowIndex[5].includes(4) ? 'yellow-tile' : submittedRows.includes(5) && grayIndex[5].includes(4) ? 'gray-tile' : 'game-tile'}>
                        <div className="letter-value">
                            {nextRow ? values[5][4] : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div className="keyboard-input">
                <div className="keyboard-row">
                    <button className={correctCharFlag.includes('Q') ? 'keyboard-correct-tile' : yellowCharFlag.includes('Q') ? 'keyboard-yellow-tile' : grayCharFlag.includes('Q') ? 'keyboard-incorrect-tile' : 'button-styles'} id="q-button"
                        onClick={() => {
                            handleKeyboardInput('Q')
                        }}
                    >Q</button>
                    <button className={correctCharFlag.includes('W') ? 'keyboard-correct-tile' : yellowCharFlag.includes('W') ? 'keyboard-yellow-tile' : grayCharFlag.includes('W') ? 'keyboard-incorrect-tile' : 'button-styles'} id="w-button"
                        onClick={() => {
                            handleKeyboardInput('W')
                        }}>W</button>
                    <button className={correctCharFlag.includes('E') ? 'keyboard-correct-tile' : yellowCharFlag.includes('E') ? 'keyboard-yellow-tile' : grayCharFlag.includes('E') ? 'keyboard-incorrect-tile' : 'button-styles'} id="e-button"
                        onClick={() => {
                            handleKeyboardInput('E')
                        }}
                    >E</button>
                    <button className={correctCharFlag.includes('R') ? 'keyboard-correct-tile' : yellowCharFlag.includes('R') ? 'keyboard-yellow-tile' : grayCharFlag.includes('R') ? 'keyboard-incorrect-tile' : 'button-styles'} id="r-button" onClick={() => {
                        handleKeyboardInput('R')
                    }}>R</button>
                    <button className={correctCharFlag.includes('T') ? 'keyboard-correct-tile' : yellowCharFlag.includes('T') ? 'keyboard-yellow-tile' : grayCharFlag.includes('T') ? 'keyboard-incorrect-tile' : 'button-styles'} id="t-button" onClick={() => {
                        handleKeyboardInput('T')
                    }}>T</button>
                    <button className={correctCharFlag.includes('Y') ? 'keyboard-correct-tile' : yellowCharFlag.includes('Y') ? 'keyboard-yellow-tile' : grayCharFlag.includes('Y') ? 'keyboard-incorrect-tile' : 'button-styles'} id="y-button" onClick={() => {
                        handleKeyboardInput('Y')
                    }}>Y</button>
                    <button className={correctCharFlag.includes('U') ? 'keyboard-correct-tile' : yellowCharFlag.includes('U') ? 'keyboard-yellow-tile' : grayCharFlag.includes('U') ? 'keyboard-incorrect-tile' : 'button-styles'} id="u-button" onClick={() => {
                        handleKeyboardInput('U')
                    }}>U</button>
                    <button className={correctCharFlag.includes('I') ? 'keyboard-correct-tile' : yellowCharFlag.includes('I') ? 'keyboard-yellow-tile' : grayCharFlag.includes('I') ? 'keyboard-incorrect-tile' : 'button-styles'} id="i-button" onClick={() => {
                        handleKeyboardInput('I')
                    }}>I</button>
                    <button className={correctCharFlag.includes('O') ? 'keyboard-correct-tile' : yellowCharFlag.includes('O') ? 'keyboard-yellow-tile' : grayCharFlag.includes('O') ? 'keyboard-incorrect-tile' : 'button-styles'} id="o-button" onClick={() => {
                        handleKeyboardInput('O')
                    }}>O</button>
                    <button className={correctCharFlag.includes('P') ? 'keyboard-correct-tile' : yellowCharFlag.includes('P') ? 'keyboard-yellow-tile' : grayCharFlag.includes('P') ? 'keyboard-incorrect-tile' : 'button-styles'} id="p-button" onClick={() => {
                        handleKeyboardInput('P')
                    }}>P</button>
                </div>
                <div className="keyboard-row">
                    <button className={correctCharFlag.includes('A') ? 'keyboard-correct-tile' : yellowCharFlag.includes('A') ? 'keyboard-yellow-tile' : grayCharFlag.includes('A') ? 'keyboard-incorrect-tile' : 'button-styles'} id="a-button" onClick={() => {
                        handleKeyboardInput('A')
                    }}>A</button>
                    <button className={correctCharFlag.includes('S') ? 'keyboard-correct-tile' : yellowCharFlag.includes('S') ? 'keyboard-yellow-tile' : grayCharFlag.includes('S') ? 'keyboard-incorrect-tile' : 'button-styles'} id="s-button" onClick={() => {
                        handleKeyboardInput('S')
                    }}>S</button>
                    <button className={correctCharFlag.includes('D') ? 'keyboard-correct-tile' : yellowCharFlag.includes('D') ? 'keyboard-yellow-tile' : grayCharFlag.includes('D') ? 'keyboard-incorrect-tile' : 'button-styles'} id="d-button" onClick={() => {
                        handleKeyboardInput('D')
                    }}>D</button>
                    <button className={correctCharFlag.includes('F') ? 'keyboard-correct-tile' : yellowCharFlag.includes('F') ? 'keyboard-yellow-tile' : grayCharFlag.includes('F') ? 'keyboard-incorrect-tile' : 'button-styles'} id="f-button" onClick={() => {
                        handleKeyboardInput('F')
                    }}>F</button>
                    <button className={correctCharFlag.includes('G') ? 'keyboard-correct-tile' : yellowCharFlag.includes('G') ? 'keyboard-yellow-tile' : grayCharFlag.includes('G') ? 'keyboard-incorrect-tile' : 'button-styles'} id="g-button" onClick={() => {
                        handleKeyboardInput('G')
                    }}>G</button>
                    <button className={correctCharFlag.includes('H') ? 'keyboard-correct-tile' : yellowCharFlag.includes('H') ? 'keyboard-yellow-tile' : grayCharFlag.includes('H') ? 'keyboard-incorrect-tile' : 'button-styles'} id="h-button" onClick={() => {
                        handleKeyboardInput('H')
                    }}>H</button>
                    <button className={correctCharFlag.includes('J') ? 'keyboard-correct-tile' : yellowCharFlag.includes('J') ? 'keyboard-yellow-tile' : grayCharFlag.includes('J') ? 'keyboard-incorrect-tile' : 'button-styles'} id="j-button" onClick={() => {
                        handleKeyboardInput('J')
                    }}>J</button>
                    <button className={correctCharFlag.includes('K') ? 'keyboard-correct-tile' : yellowCharFlag.includes('K') ? 'keyboard-yellow-tile' : grayCharFlag.includes('K') ? 'keyboard-incorrect-tile' : 'button-styles'} id="k-button" onClick={() => {
                        handleKeyboardInput('K')
                    }}>K</button>
                    <button className={correctCharFlag.includes('L') ? 'keyboard-correct-tile' : yellowCharFlag.includes('L') ? 'keyboard-yellow-tile' : grayCharFlag.includes('L') ? 'keyboard-incorrect-tile' : 'button-styles'} id="l-button" onClick={() => {
                        handleKeyboardInput('L')
                    }}>L</button>
                </div>
                <div className="keyboard-row">
                    <button className="button-styles" id="enter-button" onClick={() => {
                        handleKeyboardInput('ENTER')
                    }}>ENTER</button>
                    <button className={correctCharFlag.includes('Z') ? 'keyboard-correct-tile' : yellowCharFlag.includes('Z') ? 'keyboard-yellow-tile' : grayCharFlag.includes('Z') ? 'keyboard-incorrect-tile' : 'button-styles'} id="z-button" onClick={() => {
                        handleKeyboardInput('Z')
                    }}>Z</button>
                    <button className={correctCharFlag.includes('X') ? 'keyboard-correct-tile' : yellowCharFlag.includes('X') ? 'keyboard-yellow-tile' : grayCharFlag.includes('X') ? 'keyboard-incorrect-tile' : 'button-styles'} id="x-button" onClick={() => {
                        handleKeyboardInput('X')
                    }}>X</button>
                    <button className={correctCharFlag.includes('C') ? 'keyboard-correct-tile' : yellowCharFlag.includes('C') ? 'keyboard-yellow-tile' : grayCharFlag.includes('C') ? 'keyboard-incorrect-tile' : 'button-styles'} id="c-button" onClick={() => {
                        handleKeyboardInput('C')
                    }}>C</button>
                    <button className={correctCharFlag.includes('V') ? 'keyboard-correct-tile' : yellowCharFlag.includes('V') ? 'keyboard-yellow-tile' : grayCharFlag.includes('V') ? 'keyboard-incorrect-tile' : 'button-styles'} id="v-button" onClick={() => {
                        handleKeyboardInput('V')
                    }}>V</button>
                    <button className={correctCharFlag.includes('B') ? 'keyboard-correct-tile' : yellowCharFlag.includes('B') ? 'keyboard-yellow-tile' : grayCharFlag.includes('B') ? 'keyboard-incorrect-tile' : 'button-styles'} id="b-button" onClick={() => {
                        handleKeyboardInput('B')
                    }}>B</button>
                    <button className={correctCharFlag.includes('N') ? 'keyboard-correct-tile' : yellowCharFlag.includes('N') ? 'keyboard-yellow-tile' : grayCharFlag.includes('N') ? 'keyboard-incorrect-tile' : 'button-styles'} id="n-button" onClick={() => {
                        handleKeyboardInput('N')
                    }}>N</button>
                    <button className={correctCharFlag.includes('M') ? 'keyboard-correct-tile' : yellowCharFlag.includes('M') ? 'keyboard-yellow-tile' : grayCharFlag.includes('M') ? 'keyboard-incorrect-tile' : 'button-styles'} id="m-button" onClick={() => {
                        handleKeyboardInput('M')
                    }}>M</button>
                    <button className="button-styles" id="x-button" onClick={() => {
                        handleKeyboardInput('BACKSPACE')
                    }}>X</button>
                </div>
            </div>
        </div>
    );
}

export default GameBoard;