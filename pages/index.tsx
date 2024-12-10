import Link from 'next/link';
import styled from 'styled-components';

export default function Home() {
  return (
    <Container>
      <Title>🎉 Bienvenido a Mi Juego 🎉</Title>
      <Subtitle>Selecciona un juego para comenzar:</Subtitle>

      <Menu>
        <Link href="/memory-game">
          <Button style={{ backgroundColor: '#4CAF50' }}>
            <Icon>🧠</Icon>
            <ButtonText>Memoria Mágica</ButtonText>
          </Button>
        </Link>
        <Link href="/sum-game">
          <Button style={{ backgroundColor: '#FFAB40' }}>
            <Icon>➕</Icon>
            <ButtonText>Sumando Números</ButtonText>
          </Button>
        </Link>
        <Link href="/word-game">
          <Button style={{ backgroundColor: '#FF6F61' }}>
            <Icon>📖</Icon>
            <ButtonText>Formando Palabras</ButtonText>
          </Button>
        </Link>
      </Menu>
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
  padding: 20px;
  background: linear-gradient(45deg, #ffdee9, #b5fffc);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  width: 250px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  color: white;
  font-weight: bold;
  transition: transform 0.2s ease, background-color 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const Icon = styled.span`
  margin-right: 10px;
  font-size: 1.5rem;
`;

const ButtonText = styled.span`
  font-size: 1.2rem;
`;
