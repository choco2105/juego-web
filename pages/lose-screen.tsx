import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function LoseScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirige al menú principal después de 5 segundos
    }, 5000);

    return () => clearTimeout(timer); // Limpia el temporizador si se desmonta el componente
  }, []);

  return (
    <Container>
      <Message>😢 ¡Lo siento, has perdido!</Message>
      <SubMessage>Serás redirigido al menú en breve...</SubMessage>
    </Container>
  );
}

// Estilos con styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fce4ec;
`;

const Message = styled.h1`
  font-size: 2.5rem;
  color: #d32f2f;
  text-align: center;
`;

const SubMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-top: 10px;
`;
