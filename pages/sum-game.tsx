import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function SumGame() {
  const router = useRouter();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(30);
  const maxLevels = 10; // Número máximo de niveles

  useEffect(() => {
    generateGame();
  }, [level]);

  useEffect(() => {
    if (timer === 0) {
      handleTimeOut();
    }

    const countdown = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const generateGame = () => {
    const numCards = 4 + Math.min(level, 3); // Número de cartas (4 al inicio, aumenta hasta 7)
    let newNumbers = Array.from({ length: numCards }, () => Math.floor(Math.random() * 10) + 1);

    // Garantizar solución válida
    if (level <= 3) {
      const [num1, num2] = [
        newNumbers[Math.floor(Math.random() * newNumbers.length)],
        newNumbers[Math.floor(Math.random() * newNumbers.length)],
      ];
      const targetSum = num1 + num2;

      if (!newNumbers.includes(num1) || !newNumbers.includes(num2)) {
        newNumbers = [...newNumbers, num1, num2];
      }
      setTarget(targetSum);
    } else {
      const [num1, num2, num3] = [
        newNumbers[Math.floor(Math.random() * newNumbers.length)],
        newNumbers[Math.floor(Math.random() * newNumbers.length)],
        newNumbers[Math.floor(Math.random() * newNumbers.length)],
      ];
      const targetSum = num1 + num2 + num3;

      if (!newNumbers.includes(num1) || !newNumbers.includes(num2) || !newNumbers.includes(num3)) {
        newNumbers = [...newNumbers, num1, num2, num3];
      }
      setTarget(targetSum);
    }

    setNumbers(newNumbers);
    setSelected([]);
    setTimer(30); // Reinicia el cronómetro
  };

  const handleNumberClick = (index: number) => {
    if (selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    const sum = newSelected.reduce((acc, idx) => acc + numbers[idx], 0);

    if (
      (level <= 3 && newSelected.length === 2 && sum === target) || // 2 números para niveles fáciles
      (level > 3 && newSelected.length === 3 && sum === target) // 3 números para niveles difíciles
    ) {
      if (level === maxLevels) {
        router.push("/win-screen"); // Pantalla de victoria
      } else {
        setLevel((prev) => prev + 1); // Avanza al siguiente nivel
      }
    } else if (
      (level <= 3 && newSelected.length === 2 && sum !== target) || // Error en niveles fáciles
      (level > 3 && newSelected.length === 3 && sum !== target) // Error en niveles difíciles
    ) {
      loseLife();
    }
  };

  const handleTimeOut = () => {
    loseLife();
  };

  const loseLife = () => {
    setLives((prev) => prev - 1);
    if (lives - 1 === 0) {
      router.push("/lose-screen"); // Derrota
    } else {
      setSelected([]);
      generateGame(); // Reinicia el nivel actual
    }
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
      <Instructions>
        Selecciona {level <= 3 ? "2 números" : "3 números"} que sumen <strong>{target}</strong>
      </Instructions>
      <Board>
        {numbers.map((num, index) => (
          <Number
            key={index}
            selected={selected.includes(index)}
            onClick={() => handleNumberClick(index)}
          >
            {num}
          </Number>
        ))}
      </Board>
    </Container>
  );
}

// Estilos con styled-components
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

const Instructions = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 400px;
`;

const Number = styled.div<{ selected: boolean }>`
  width: 80px;
  height: 80px;
  background-color: ${(props) => (props.selected ? "#4CAF50" : "#f0f0f0")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  user-select: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#4CAF50" : "#e3f2fd")};
  }
`;
