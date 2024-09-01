import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Lottie from 'react-lottie';
import FadeIn from 'react-fade-in';
import * as loadingData from './loading.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

const LoadingComponent = () => {
  return (
    <div
      style={{
        height: '100vh',  // Makes the div take up the full height of the screen
        display: 'flex',
        justifyContent: 'center',  // Centers content horizontally
        alignItems: 'center',  // Centers content vertically
      }}
    >
      <FadeIn>
        <Container>
          <Row className="d-flex justify-content-center">
            <Lottie options={defaultOptions} height={140} width={140} />
          </Row>
        </Container>
      </FadeIn>
    </div>
  );
};

export default LoadingComponent;
