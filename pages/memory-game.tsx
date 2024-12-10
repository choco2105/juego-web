import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function MemoryGame() {
  const router = useRouter();
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(30);
  const [showAll, setShowAll] = useState(true); // Mostrar todas las cartas al inicio

  useEffect(() => {
    generateCards();
  }, [level]);

  useEffect(() => {
    if (showAll) {
      // Ocultar las cartas después de 2 segundos
      const timeout = setTimeout(() => setShowAll(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showAll]);

  useEffect(() => {
    if (timer === 0) {
      handleTimeOut();
    }

    const countdown = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const generateCards = () => {
    const icons = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍍", "🍑", "🍒"];
    const selectedIcons = icons.slice(0, level + 2);
    const newCards = [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setTimer(30);
    setShowAll(true); // Reiniciar para mostrar todas las cartas
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || showAll) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]); // Limpia las cartas volteadas

        // Avanzar al siguiente nivel si se completan todas las parejas
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setLevel((prev) => prev + 1), 1000);
        }
      } else {
        // Desvoltear cartas después de un intento fallido
        setTimeout(() => {
          setFlipped([]);
          loseLife(); // Descuenta una vida pero no reinicia el nivel
        }, 1000);
      }
    }
  };

  const handleTimeOut = () => {
    loseLife();
  };

  const loseLife = () => {
    setLives((prev) => prev - 1);
    if (lives - 1 === 0) {
      router.push("/lose-screen");
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
        Memoriza las cartas y encuentra las parejas iguales antes de que se acabe el tiempo.
      </Instructions>
      <Board cardCount={cards.length}>
        {cards.map((card, index) => (
          <Card
            key={index}
            flipped={flipped.includes(index) || matched.includes(index) || showAll}
            onClick={() => handleCardClick(index)}
          >
            {flipped.includes(index) || matched.includes(index) || showAll ? card : "❓"}
          </Card>
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
  background-color: #fff8e1;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: #ffecb3;
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

const Board = styled.div<{ cardCount: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => Math.ceil(Math.sqrt(props.cardCount))}, 1fr);
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Card = styled.div<{ flipped: boolean }>`
  width: 80px;
  height: 80px;
  background-color: ${(props) => (props.flipped ? "#4CAF50" : "#f0f0f0")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  user-select: none;
`;
