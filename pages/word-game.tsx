import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const WordGame = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [correctWord, setCorrectWord] = useState<string[]>([]);
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (level > 10) {
      router.push("/win-screen");
    } else {
      generateQuestion();
    }
  }, [level]);

  useEffect(() => {
    if (timer === 0) {
      loseLife();
    }

    const countdown = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const generateQuestion = () => {
    const questions = [
      { question: "¿Qué fruta es roja y tiene semillas?", word: "MANZANA", hint: "🍎" },
      { question: "¿Qué animal dice guau?", word: "PERRO", hint: "🐶" },
      { question: "¿Qué objeto usamos para beber agua?", word: "BOTELLA", hint: "🧴" },
      { question: "¿Qué medio de transporte vuela?", word: "AVION", hint: "✈️" },
      { question: "¿Qué usamos para escribir?", word: "LAPIZ", hint: "✏️" },
      { question: "¿Qué lugar es para aprender?", word: "ESCUELA", hint: "🏫" },
      { question: "¿Qué animal da leche?", word: "VACA", hint: "🐄" },
      { question: "¿Qué se usa para cortar papel?", word: "TIJERAS", hint: "✂️" },
      { question: "¿Qué planeta habitamos?", word: "TIERRA", hint: "🌍" },
      { question: "¿Qué vehículo tiene dos ruedas?", word: "BICICLETA", hint: "🚲" },
    ];

    const selected = questions[level - 1];
    setQuestion(`${selected.question} ${selected.hint}`);
    setCorrectWord(selected.word.split(""));
    const allLetters = [...selected.word.split(""), ...generateRandomLetters(5)].sort(() => Math.random() - 0.5);
    setLetters(allLetters);
    setSelectedLetters([]);
    setTimer(30);
  };

  const generateRandomLetters = (count: number): string[] => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: count }, () => alphabet[Math.floor(Math.random() * alphabet.length)]);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (selectedLetters.length < correctWord.length) {
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);

      if (newSelected.length === correctWord.length) {
        if (newSelected.join("") === correctWord.join("")) {
          setLevel((prevLevel) => prevLevel + 1);
        } else {
          loseLife();
        }
      }

      setLetters((prev) => prev.map((l, i) => (i === index ? "" : l)));
    }
  };

  const loseLife = () => {
    setLives((prev) => {
      const updatedLives = prev - 1;
      if (updatedLives <= 0) {
        router.push("/lose-screen");
      } else {
        resetGameState();
      }
      return updatedLives;
    });
  };

  const resetGameState = () => {
    setSelectedLetters([]);
    generateQuestion();
  };

  return (
    <Container>
      <Header>
        <Lives>
          {Array.from({ length: lives }, (_, i) => (
            <Heart key={i}>❤️</Heart>
          ))}
        </Lives>
        <Info>Nivel: {level}</Info>
        <Info>Tiempo: {timer}s</Info>
      </Header>
      <GameContent>
        <Question>{question}</Question>
        <SelectedLetters>
          {correctWord.map((_, index) => (
            <Letter key={index}>{selectedLetters[index] || "_"}</Letter>
          ))}
        </SelectedLetters>
        <LettersContainer>
          {letters.map((letter, index) =>
            letter ? (
              <LetterButton key={index} onClick={() => handleLetterClick(letter, index)}>
                {letter}
              </LetterButton>
            ) : null
          )}
        </LettersContainer>
      </GameContent>
    </Container>
  );
};

export default WordGame;

// Styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e3f2fd;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: #bbdefb;
  margin-bottom: 20px;
`;

const Lives = styled.div`
  display: flex;
  gap: 5px;
`;

const Heart = styled.span`
  font-size: 1.5rem;
`;

const Info = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const GameContent = styled.div`
  text-align: center;
`;

const Question = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SelectedLetters = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Letter = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
`;

const LettersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const LetterButton = styled.button`
  padding: 10px;
  background-color: #90caf9;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #64b5f6;
  }
`;
