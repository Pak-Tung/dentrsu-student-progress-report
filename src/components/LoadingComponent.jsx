import React, {useState} from "react";
import { Container, Row } from "react-bootstrap";
import Lottie from "lottie-react";
import FadeInOut from "./FadeInOut";
import * as loadingData from "./loading.json";

const LoadingComponent = () => {
  const [show, setShow] = useState(true);
  const extraStyles = {
    // position: "fixed",
    // top: "30px",
    // left: 0,
    // right: 0,
    // bottom: 0,
    // background: "rgba(0, 0, 0, 0.4)",
    // color: "#FFF"
  };
  return (
    <div
      style={{
        height: "100vh", // Makes the div take up the full height of the screen
        display: "flex",
        justifyContent: "center", // Centers content horizontally
        alignItems: "center", // Centers content vertically
      }}
    >
      <FadeInOut show={show} duration={1500} style={extraStyles}>
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
      </FadeInOut>
    </div>
  );
};

export default LoadingComponent;
