import React, { useState } from "react";
import { Stage, Layer, Line, Circle, Rect } from "react-konva";
import './Notepad.css'; // Importing the external CSS for styling

const Notepad = () => {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("black");
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [cursor, setCursor] = useState("default");
  const [showShapesPopup, setShowShapesPopup] = useState(false); // State to manage popup visibility
  const [drawing, setDrawing] = useState(false); // State to track whether drawing has started

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    if (tool === "pen" || tool === "eraser") {
      setLines([...lines, { tool, points: [pos.x, pos.y], color }]);
      setDrawing(true); // Start drawing
    } else if (tool === "circle" || tool === "rectangle") {
      setCurrentShape({
        tool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radius: 0,
        color,
      });
    } else if (tool === "line") {
      setCurrentShape({
        tool,
        points: [pos.x, pos.y, pos.x, pos.y],
        color,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (tool === "pen" || tool === "eraser") {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      if (drawing) {
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        setLines(lines.slice(0, -1).concat(lastLine));
      }
    } else if (tool === "circle" || tool === "rectangle") {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      const { x, y } = currentShape;
      const width = point.x - x;
      const height = point.y - y;

      if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        setCurrentShape({ ...currentShape, radius });
      } else {
        setCurrentShape({ ...currentShape, width, height });
      }
    } else if (tool === "line") {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setCurrentShape({
        ...currentShape,
        points: [currentShape.points[0], currentShape.points[1], point.x, point.y],
      });
    }
  };

  const handleMouseUp = () => {
    if (tool !== "pen" && tool !== "eraser") {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
    setDrawing(false); // Stop drawing when mouse is up
  };

  const clearCanvas = () => {
    setLines([]);
    setShapes([]);
  };
  

  const handleToolChange = (newTool) => {
    setTool(newTool);
    setCursor(newTool === "pen" ? "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACKUlEQVR4nLWVzatOURTGz70K+cjH2zl7Pb+9z3uu11XciIEwuREKRb4ZXGYM1KVbPgaMlEzuROYGBhIjUgaSgUi+YoBb4g+QoYEh7TpvnaRT57ys0e6s1f7t9ax9np2Y2XozO55lmUv+R0iaAH5J+gm8kXTFe78xSZKhfwLodrtLgB/AK+AIcAl4JumLpOkQwoaBYZIem9kxSe+BvA/23h+WdFvS1KCA08A5SSsl3UySZJZzbn6ZHpJ0ZyCA9z4Aj+J6bGxstqR9ESRpMn4zs4OSxgft4kk8NdABrnrvD0l6UKaHY4fe+7Vpmi5oC5gC9pTry3Eu5YD7+UngvKT7vV5vUSuZSv2H/8wVRbHYzIq4NrNVsbN4Cdp0MSHpBnC0D+p0OgvjXPo1ZrZZ0oXYYZQzaRMhhDWSTgKnYmeVA5wA7kV4dADgqXMuawXx3q8AzlY3l/S8cn1jzSZJL9I0tcaAoijmAg+BdVGWePLq5hXwOPA2z3MaQ0IIS+P1jZrX2YX3foukdyEE3xhiZmn0pihHXV3ZyQfn3EhjiHMuk/TSe7+1rg7YDsw455Y1huR5TmmG2+rqJO0APrWaCZADH81sZ12dmR0AXo+Ojs5pDDGzIspgZrvq6iTdjX6WtAnn3Iikz8DuGsAZSReTtpFlWa989fb+LQ9ci26QDBJ5ni8HvkraX/3unFsNfGttI9UoLWUGuFW+jNeB73XyNQ5J88pXbzo+TNU/+jf3lHKZDpM91AAAAABJRU5ErkJggg=='), auto" : newTool === "eraser" ? "crosshair" : "default");
    setShowShapesPopup(false); // Close popup when tool changes
  };
  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (currentShape) {
      setCurrentShape({ ...currentShape, color: newColor });
    }
  };

  const openShapePopup = () => {
    setShowShapesPopup(true);
  };

  const closeShapePopup = () => {
    setShowShapesPopup(false);
  };

  const selectShape = (shape) => {
    setTool(shape);
    closeShapePopup(); // Close the popup after selecting a shape
  };

  return (
    <div className="notepad-container">
      <div className="tools-container">
        <button className="tool-btn" onClick={() => handleToolChange("pen")}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADfUlEQVR4nO2aS2gUQRCGO5vgK1E0cXfm/3t3FjWgrCCIpxwE0YCvSDwoCuJJBfUiomdREMwpQm6iBxVRxAdREaOo+MAERMUk4usUUESMEN+gMYmU9ppx2d0kMzgzSn7oUy9MfV3V1dXVq9SoRuVFMa31agAXSL4m+R7ASQBTVVRUXV09Vmu9DEAjgPMAWkleJlkj8wDqSXaSHMgzzoRtv6qsrJwEYK+sbo5xH7TWq+Q3JOtI9heAkPEpVAgAG0l2G2P6SN4iuVNrvTCRSFjiBQATDMyWIjDdoYURyeMuQySE5rp+Ukpyv8wBuDYMmOBDy7KscgDXjZHvsuGTleM4UwzYb0OHgrFte2mgEJlMZgzJFmPcC9u2M+55ALMAPMsXPoVgADwXDwbJEQNwwnz8VSKRmO6etG17iXioyIYeyAeT69G/LpINxpgerfUc9xyATSR7i0EwP0ydUqokMAit9XJZPQDfAMx3TZUA2DMcABaACUypVIoA3ooBWuvtrqkykodGCsFBmPpAQSQ1mo83Z8MgnU6PM2WGV4jGoCFWZPeF4zhwpd+rXiFItgSdpSR0npiPb82WIyRv+/DE03Q6PTlob2w2BjwRqGQyWUnyrg+IHpIzg4aoMmW2GLBSymwA7T7CqRfA4qCMT1mWNS2VSs2Q9GgMOC2hQPK+D4h+ABsCgZAsRPJjTihcFM8AaPMBMUBylwpQJSQPAnhJ8g2AI2ZP3PAJcUCFKVOm/1HBehjNQafZXJUBOOcT4oosRpgQJX7KDrO37sTj8YowISRz7fMJ8SDwAy9XALb5hGiXBKHCFMm1pnng2ROh96ZI1gL46gOiNfRwsm07Y2ogryF1s6qqamKoEI7jgGSXD4hLyWRyfKgQlmWVk7znA+KsdFRChVBKxeTU9bEnDsuhGTaEItnkwxMNgXY9CkmaBx4BpJm2Q0VBJGu8nBUmNa9REVIpyWMjhJDO4SIVFWmtF3iA6bIsa7aKigDMI/ndbNQszNEhPPFQa51UEVIs56o6HJiW0E/rXNm2vT7Pau8uEmZNYd/qCl2SHhU5D9ye6XcBRkv6Vwe92D5we+bny2skxcHmc6HR58pm0VQ8Hq8A8KWIN9okm6moi2RtAYAOAOsiUS8NJXnfzvmHwWcAp8zLafQBXE9hHQagUx7u5e6h/kHFSD6WjoZ4JmxjRqX+A/0AsbY/lKzfvpYAAAAASUVORK5CYII=" alt="ball-point-pen"/>
        </button>
        <button className="tool-btn" onClick={() => handleToolChange("eraser")}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABtUlEQVR4nO3azUoDMRQF4LRLf1alTc4JRdCN4FOIK93qgyh9DxcFC4I+i4uZl3Aj6kYQXbrRhRKYgS7EdjK5SUbmQFdD0/m4ySUXqlSfPv8jADYAXJJ8BHBPcqaUGqguRWu9CeCO5PfyB8CtUmqouozoFEavQHQCo9dEZI3RDRHMEeOLYE6YtgjmgAmFYEpMaARTYKQQjImRRjAGJhaCkpjYCEpgxuPxFsmiWvyF5FdMjLX2ImglADxPp9M9Y8wpgM+ImIeQlXiaTCa79TNr7VmsygB4E0HExgBYiCEiYgo3aQY5E6u+I3hmytFotB0FIYgpoyMEMGUyREBMmRwRAFNmg2iBKb0QrqWt22J906A1F67le/0IyWtJRANM4Y1wAfBebal9JZw/MEUrhIu7iLnFjDHHKkJ+wRStES4AzqsFP6y1h0o4bvtWI0A4RJUBgKsaQ/JICcUYs1PvAO/ulBoTAyGOiYkQw6RABMekRATD5IBYxix8MDkhvDE5IhpjckasjekCYiWmS4g6Q5I3S3ezE631gRsBJO5OMSvTfrLLoDIz95cMkq8k525cTv1SffqoMPkBmodDODRj0/YAAAAASUVORK5CYII=" alt="eraser"/>
        </button>
        <button className="tool-btn" onClick={openShapePopup}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACdElEQVR4nO2ZTahMYRjHXxbk+kgznc75/c9MQ8bC2F07paxtuEtZKLJhY2Nh4yNlITbyVSTZuMl3KAmbW2JzUWKDdLkh18LCLWH0dqdkmq9z3qN5R+dXz/Z553ee9+N53zEmJycnJycBpVKpAOwGbki6BGyr1WpzzCBRLpeXSXorqd4UY8CQGRBmS3rcQqJuAzhpBgFgazsJzcRPYJXxmSAIFgCTXUTqwAPjM5IOdpPQH5kR4yNhGC4FpnsVkfSqWq3ONb4BXEwgUW/ELuMTklZL+pVC5GsQBJEZhO22h7VyyvgAsCmthGbiRxRFK3yYVmOOInXgiA8VmXIVkXTbh4q8yKAi53wQ2esqEsfxOh/a9Xkuu5akM8YXGjJ7gCfAZ+BLp5D0obFJbDHGzOr378/J6UYYhittCw48At5L+gg8BU7EcbzW+E6lUlks6by9tXXZ5+/Hcby8Wz5gg6Q7wLsOC/0NMAoMZyIRRVEFeJng0JoC1nSQOJzwEPwObHSSKBaLC4FnKU7gqVKpVG1TiTQn+nQYhktSiwCHHNqJe8357HRyyLc/lUQURUHCK2mrluKvDQCYcMh3+V891/TyFY83VeSTQ66bqURsb5OByHjfRYBbriL2nOm7iKRrGVRkou8iwLEMRB76IDKSgcgBH0SG7Bx3fPWoNYm8dhAZTSXSGHiHw8BnW3ycUYd8O10f1a6mGPh5oVBY1EJk2PZOKSQmW+VLRBiG8yVdSTDouKRyu3y2AUzSMQCTWf5PYiuzvdOaAb7Zu4oV77Gj3mc/EHC3TVyw08m5Eu0eD4D1ko4C1+1OIum0pM2SipkPmJOTk/Pf8hv0JIxe26XkwQAAAABJRU5ErkJggg==" alt="shape"/>
        </button>
        <button className="tool-btn" onClick={clearCanvas}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACTElEQVR4nO2aP44TMRjFLcSfgoZik/g9O0mTKhINkYCCho4CIS01S7UlF+ACwAEC0pZcgANQ0LA1LSUgFkRBRcFmVwhWXhEURXHweDzjjfz9pCnns9+b8bPHHqUEQRAEQRAEQRCE6hhjHpL8s0mXSoW1dkTyR5EGjEajSwDe5RaTzQAA09xCshlA8i7J30UaQLIP4HtuEbkMOE9yP7eAbAaQfBrTIIAjrfV9ks8SCNgjeQ/AYasGGGNuk/wVI951eF5Ha/0AwM+IOjMAuwt17sSaUFl8t9vtkfwW+fS3V5h5A8BBhRoH7p7lOq52GwacI/k69nUD8HxVUQBbAN4E1NjvdDraU+NF4wYAeBwrfsGEf6/uilBdlwt74/H4YuoleLB4a+11AMcJDDgGcMvXznIuLI93zxCaNWrAcDi8QvJDXfELor72+3362gNwjeRHAF+MMTfX5RGAz3X6EmQAyVepxC9cbyeTyQVfm26s+8a7w93ratTtx3/FA3jUgPi1oRhCbOhVMsBaezVmnq5ognd8t7Hv4G2k1+tdJvm+SfEhoZg69IINAPCyafGhoZgy9MQAnr0hMHNrjNAh4KbIlLm0kSGotd5pxYAWpsGpisRNoa0YoEpfCGVcCn86M0vhxB9Da0Ov6sdQ3VD01d2oz+E6oaha3hCZegR0QjdEBoMBUoZiVQNU6VtipxS9KTqH5JPIt8B1fjvFPO5q/K3V7I6Qh7IPRhylH42dUvTh6Jyij8cdxf8goUr/RWZO0T9JCYIgCIIgCIIgqA3lBBRJfZ7w14ixAAAAAElFTkSuQmCC" alt="clear-symbol"/>
        </button>
        <div className="color-picker">
          <button className="color-btn" style={{ backgroundColor: "black" }} onClick={() => handleColorChange("black")}></button>
          <button className="color-btn" style={{ backgroundColor: "red" }} onClick={() => handleColorChange("red")}></button>
          <button className="color-btn" style={{ backgroundColor: "blue" }} onClick={() => handleColorChange("blue")}></button>
          <button className="color-btn" style={{ backgroundColor: "green" }} onClick={() => handleColorChange("green")}></button>
        </div>
      </div>

      {/* Floating Popup for Shapes */}
      {showShapesPopup && (
        <div className="shapes-popup">
          <button className="close-btn" onClick={closeShapePopup}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="m3 3 10 10M13 3 3 13"/></svg>
          </button>
          <div className="shapes-options">
            <button className="shape-option" onClick={() => selectShape("circle")}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADsUlEQVR4nO1aXUsUURg+oGVgSc22O/M8s7hdLBQLpeFfiCIw7KJC6jck0b+wJBOjy+oXpJVS/YOQSDDyq67MrhIhu0k3Ml48C+vZM+7O7szuKD5wQNx3zpz3vF/Pec8odYgDiu7u7lMABgA8BDANYBHAOoBNPdZJLujfRGYgl8udVElAPp/vAHCH5DuSf0luhxzyzFsAt2Uu1WzkcrljJO8D+FHH4q0DwCqAezJ3U5TwPO8qgG9RKWBR6CuAK7EpIDsF4GmVRXwCMOL7/g3f9y9I3PT19R2RIX/L/+Q3kQEwW2WuJ5G7WyaTcUl+DHjpL5LDJM+GnRfAOQAP9By2uWdc181EooTrumfE3JYd25LsE0Xm0RlPrLRlec+yrKFhS9iUIPlF3ERFDN/3e0jOByiTaSQz2dzppeu6nSomuK7bSXLC5mZ1xYwtsAE8U0q1qfjRBuC5RZnx0CnWZokmKVFCG8lJy2ZeViGq9ZLx8FIqlTqhmgx3x812xYzEbE1FUyq2mZ3iCOxaQbKXZNFY01At1thFOyTPqxYDwCNjTd/3DHxNAHcVuyQw1Gw265DcMNY2GPgAyfeG8LBKCACMGFaZDqyuFioemnbEBc/zCsbaio7jdFUIArhuEkCVMACYM5S5VovpRlTCgMqgr0xEAKbKhYRuq4SB5C1DkTcVQkLMyoWy2ex5lTD4O6SyXJHFCiEAa4YijkoYAJw2YuSnTWizXKhQKBxVCUM+n+8wLPLnQCuyZpgtpfapay3tt2AnuXBQ0u/rCiFpJCS9IJIcrcoFpRdrKDKrEgaSnw1F+iuEhK6bpFH6TiqhpBHAlpU0CnQzOlGHqj244JQKgnTFzYOV0HvVYpBMkfxd88FKH3VXkxb0JB8ba1qpWrCltW9pPvSoFoHkRUvz4W7VB7VVFhPcDlquueMo9xOGP8qYaHKDrh3AK2MN/0heCjWL3E+Yykgbs0nKtAN4YdnMsXqZ5oxlssl0On08luUrpWRuiyVkEz/UzcillW+eHEtkTTqAcQQ2jPgsxajneekoLnpsyhSlGRDFSVLXCUmxxQAlco2+o6RMJsDNZGwI4RQKEXZeeUZXbLPYbZfcqWFLBMTMeIAypRfPiZV8378ptUesJX4tQ+96r6bioxYCaGansVhPqXI/EeBqkQzsxEi4FFsvdNEckq54hAqsSMVuyRcQ2mUGpaFsC9QaRlGfTAcT0+xwHKdLerFC/aUDqD+gWSv7qEaaG/NyPNX38v2toD2HUE3Cf3iB3OpCgWDGAAAAAElFTkSuQmCC" alt="circled"/> Circle</button>
            <button className="shape-option" onClick={() => selectShape("rectangle")}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABPElEQVR4nO2ZTU7DMBCFfYkkvBfF1+LnFAV6AyjHg3IUmkqwatBIWbQjqjqVnFjifZKXI8/LfN5kQhBCXE1VVTck3wBsSe5JDjOf/Xj3pq7r5qoQAO4Xan44c3qSd1NDPJA8FND84M4hOcyoU19A08O5ySRpZm/iuBDAN4CVBQwzE2NE27aP1oPr6fViMYBPV7QKC0PyyfW0TSk60WqJSXhMJa9XuIR3MhQCp/alIJmhJkK9kSxQalFqZYFSi1IrC5RalFpZoNSi1MoCpRalVhYotSi1skCpRamVBf5ntfrSfmJ3XUcX5GvyWsF+6YeFIbl2a4WPlKKNX/RYGFu6hJmJMYLkM4Af19NL6i6i5NXbrmmaOulL2MKx4GXo7aSxjmFKmsxucohjzWzxCOB9oVC93W1vIlknIUT4i18pE/Le1UeYvQAAAABJRU5ErkJggg==" alt="unchecked-checkbox"/> Rectangle</button>
            <button className="shape-option" onClick={() => selectShape("line")}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqklEQVR4nO3YMQrCQBSE4XeMzMyhRFEsvLuFggo5QoRIRLuUKWaX+SAQ0g1/mt2qiIjYEIA9ySfJUdKxWkTyTHIiOf+esToYMZN8VQcjpmEYDtUKSaeVEW8Al2qFMsJESrhICRcp4SIlXKSEi5RwkRIuUsKFcrIzoZQwoZQwoZQwoZQwoR5KANitXe0vV/7VEgD35kcsADyaH/H/tQDcSF6X9+/HiIiobXwAxokZeAM2EfAAAAAASUVORK5CYII=" alt="line"/> Line</button>
          </div>
        </div>
      )}

      <Stage
        width={500}
        height={400}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        style={{ backgroundColor: "#f0f0f0", border: "1px solid #ccc", cursor }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.tool === "eraser" ? "white" : line.color}
              strokeWidth={line.tool === "eraser" ? 10 : 2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
            />
          ))}
          {shapes.map((shape, i) => {
            if (shape.tool === "circle") {
              return (
                <Circle
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.color}
                />
              );
            } else if (shape.tool === "rectangle") {
              return (
                <Rect
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.color}
                />
              );
            } else if (shape.tool === "line") {
              return (
                <Line
                  key={i}
                  points={shape.points}
                  stroke={shape.color}
                  strokeWidth={2}
                  lineCap="round"
                />
              );
            }
            return null;
          })}
          {currentShape && currentShape.tool !== "pen" && currentShape.tool !== "eraser" && (
            <Layer>
              {currentShape.tool === "circle" && (
                <Circle
                  x={currentShape.x}
                  y={currentShape.y}
                  radius={currentShape.radius}
                  fill={currentShape.color}
                />
              )}
              {currentShape.tool === "rectangle" && (
                <Rect
                  x={currentShape.x}
                  y={currentShape.y}
                  width={currentShape.width}
                  height={currentShape.height}
                  fill={currentShape.color}
                />
              )}
              {currentShape.tool === "line" && (
                <Line
                  points={currentShape.points}
                  stroke={currentShape.color}
                  strokeWidth={2}
                  lineCap="round"
                />
              )}
            </Layer>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Notepad;
