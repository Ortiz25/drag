import React, { useState } from "react";
import "./App.css";
import Draggable from "react-draggable";
import ArrowLine from "./components/arrow";
import LineConnector from "./components/line";
import { dotNotation } from "./components/util/jsonToDot";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingCurved, setIsDrawingCurved] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [connections, setConnections] = useState([]);
  const [curvedArray, setCurvedArray] = useState([]);
  const [activeElement, setActiveElement] = useState(null);
  const [pathData, setPathData] = useState("");
  const [curved, setCurved] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const handleButtonClick = () => {
    setIsErasing(false);
    setCurved(false);
    setIsDrawing(!isDrawing);
  };

  const drawCurved = () => {
    setIsDrawing(false);
    setCurved(!curved);
  };
  const dummy = () => {
    return;
  };

  const handleEraseClick = () => {
    setIsDrawing(false);
    setIsErasing(!isErasing);
  };
  const handleMoceClick = () => {
    setIsMoving(!isMoving);
  };

  const handleElementClick = (element) => {
    if (!isDrawing) return;
    if (!isDrawing && element.clientX) return;
    if (isDrawing && element.clientX) {
      const { clientX, clientY } = element;

      if (!activeElement) {
        const position = { x: clientX, y: clientY };
        setActiveElement(position);
      } else {
        setConnections((prevConnections) => [
          ...prevConnections,
          { from: activeElement, to: { x: clientX, y: clientY } },
        ]);
        setActiveElement(null);
      }
      return;
    }
    const { clientX, clientY } = element.targetTouches[0];
    if (!activeElement) {
      const position = { x: clientX, y: clientY };
      setActiveElement(position);
    } else {
      setConnections((prevConnections) => [
        ...prevConnections,
        { from: activeElement, to: { x: clientX, y: clientY } },
      ]);
      setActiveElement(null);
    }
  };

  const handlePathClick = (event) => {
    if (!isErasing) return;
    const clickedPath = event.target;
    const clickedConnection = connections.find((connection) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathElement.setAttribute(
        "d",
        `M${connection.from.x},${connection.from.y} L${connection.to.x},${connection.to.y}`
      );
      const pathData = pathElement.getAttribute("d");

      if (clickedPath.getAttribute("d").startsWith(`M${connection.from.x}`)) {
        return true;
      } else {
        return false;
      }
    });
    const pathData = clickedPath.getAttribute("d");
    const clickedcurve = curvedArray.filter((curve) => curve.path === pathData);

    if (clickedcurve.length > 0) {
      const newArray = curvedArray.filter((array) => array.path !== pathData);

      setCurvedArray(newArray);
    }

    if (clickedConnection) {
      console.log("Clicked connection:", clickedConnection);
      const newConn = connections.filter((conn) => conn !== clickedConnection);
      setConnections(newConn);
    }
  };
  const handleMouseDown = (event) => {
    setIsDrawingCurved(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
    setPathData(`M ${event.clientX} ${event.clientY}`);
  };

  const handleMouseMove = (event) => {
    if (!curved) return;
    if (!isDrawingCurved) return;
    const newPathData = `${pathData} L ${event.clientX} ${event.clientY}`;
    setPathData(newPathData);
  };

  const handleMouseUp = (event) => {
    setCurvedArray((curved) => [...curved, { path: pathData }]);
    setCurved(false);
    setIsDrawingCurved(false);
  };
  console.log("DOT SYNTAX:", dotNotation);
  return (
    <div className="App">
      <Row>
        <Col xl={8}>
          <svg
            className="Active-area"
            onMouseDown={curved ? handleMouseDown : dummy}
            onMouseUp={curved ? handleMouseUp : dummy}
            onMouseMove={curved ? handleMouseMove : dummy}
          >
            <Draggable
              axis="both"
              bounds={{ top: 0, left: 0, right: 750, bottom: 600 }}
              grid={[25, 25]}
              defaultPosition={{ x: 0, y: 0 }}
              cancel=".body"
              onMouseDown={handleElementClick}
            >
              <rect
                className={`square ${isMoving ? "" : "body"}`}
                x={0}
                y={0}
                width="100"
                height="100"
                fill="aqua"
              />
            </Draggable>
            <Draggable
              axis="both"
              bounds={{ top: 0, left: 0, right: 750, bottom: 600 }}
              grid={[25, 25]}
              defaultPosition={{ x: 0, y: 0 }}
              cancel=".body"
              onMouseDown={handleElementClick}
            >
              <rect
                className={`rectangle ${isMoving ? "" : "body"}`}
                x={0}
                y={0}
                width="150"
                height="90"
                fill="blue"
              />
            </Draggable>
            <Draggable
              axis="both"
              bounds={{ top: 0, left: 0, right: 750, bottom: 600 }}
              grid={[25, 25]}
              defaultPosition={{ x: 0, y: 0 }}
              cancel=".body"
              onMouseDown={handleElementClick}
            >
              <ellipse
                className={`ellipse ${isMoving ? "" : "body"}`}
                cx="50"
                cy="50"
                rx="50"
                ry="50"
                fill="brown"
              />
            </Draggable>

            {curvedArray.map((line, index) => (
              <LineConnector
                index={index}
                line={line}
                handleClick={handlePathClick}
                isErasing={isErasing}
              />
            ))}

            {connections.map((connection, index) => (
              <ArrowLine
                key={index}
                from={connection.from}
                to={connection.to}
                handleClick={handlePathClick}
                isErasing={isErasing}
              />
            ))}
          </svg>
        </Col>
        <Col xl={4}>
          <div className="buttons">
            <div>
              <Button
                type="button"
                onClick={handleMoceClick}
                className="button1"
                variant={isMoving ? "outline-success" : "outline-primary"}
              >
                {isMoving ? "Moving" : "Move Objects"}
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={handleButtonClick}
                className="button1"
                variant={isDrawing ? "outline-success" : "outline-primary"}
              >
                {isDrawing ? "Drawing" : "Draw Lines"}
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={drawCurved}
                className="button1"
                variant={curved ? "outline-success" : "outline-primary"}
              >
                {curved ? "drawing freehand" : "draw freehand"}
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={handleEraseClick}
                className="button1"
                variant={isErasing ? "outline-danger" : "outline-primary"}
              >
                {isErasing ? "Erasing" : "Erase Line"}
              </Button>
            </div>
            <h4>Hints:</h4>
            <ul>
              <li>
                {" "}
                <p>
                  Click on the <b>Move objects</b> button to enable object
                  movements
                </p>
              </li>
              <li>
                {" "}
                <p>
                  To draw straight lines between objects, click on <b>Lines</b>{" "}
                  button then left click on the two objects you want to connect.
                </p>
              </li>
              <li>
                {" "}
                <p>
                  To draw freehand lines between objects, click on{" "}
                  <b>Freehand</b> button then while holding down the left click,
                  trace the line on the canvas
                </p>
              </li>
              <li>
                {" "}
                <p>
                  To erase lines, click the <b>Erase</b> button then hover on
                  the line you want to delete, left click once it turns red.
                </p>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
