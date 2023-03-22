import ToggleButton from '@components/Rankings/ToggleButton';

import styled from '@emotion/styled';

function Rankings() {
  const Container = styled.div`
    display: flex;
    justify-content: center;
  `;
  const RankingContainer = styled.div`
    position: fixed;
    top: 11rem;

    background-color: rgb(222 200 212528 / 0.4);
    padding-top: 30px;
    padding-bottom: 30px;
    height: 650px;
    width: 70%;
    border-radius: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  return (
    <Container>
      <RankingContainer>
        <ToggleButton />
      </RankingContainer>
    </Container>
  );
}

export default Rankings;
