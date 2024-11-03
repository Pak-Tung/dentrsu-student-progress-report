import React from "react";
import { Container, Row } from "react-bootstrap";
import Lottie from "lottie-react";
import FadeIn from "react-fade-in";
import * as loadingData from "./loading.json";

const LoadingComponent = () => {
  return (
    <div
      style={{
        height: "100vh", // Makes the div take up the full height of the screen
        display: "flex",
        justifyContent: "center", // Centers content horizontally
        alignItems: "center", // Centers content vertically
      }}
    >
      <FadeIn>
        <Container>
          <Row className="d-flex justify-content-center">
            <Lottie
              animationData={loadingData.default}
              loop={true}
              autoplay={true}
              rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
              style={{ height: 140, width: 140 }}
            />
          </Row>
        </Container>
      </FadeIn>
    </div>
  );
};

export default LoadingComponent;
