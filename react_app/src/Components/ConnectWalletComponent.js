import { Image, Card, Container, Row, Col } from 'react-bootstrap';
const metaMaskLogo = "meta-mask-logo.png";

function ConnectWalletComponent({ onBtnClick }) {
  return (
    <Container className='pt-5'>
      <Row className="justify-content-center mt-5">
        <Col xl="6" xs="10">
          <Card className='mx-auto'>
            <Card.Header as="h3">NetixSol To-do dApp</Card.Header>
            <Card.Body>
              <Card.Title>To access your to-dos, all you need to do is connect to your wallet.</Card.Title>
              <Card className='mt-4 w-50 mx-auto walletConnectBtn' onClick={onBtnClick}>
                <Card.Body>
                  <Image src={metaMaskLogo} height={70} rounded />
                  <p>Connect Metamask</p>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  );
}

export default ConnectWalletComponent;
