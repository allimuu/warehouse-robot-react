import _ from "lodash";
import React, { useRef, useState } from "react";
import robot_img from "../robot.png";

import { warehouseState, sendRobotCommand, IRobotLocation } from "../services/robotApi";

interface IGridLocation {
    x: number;
    y: number;
    children: React.ReactNode;
}

function GridLocation(props: IGridLocation) {
    return (
        <div className={`warehouse-grid-location grid-${props.x}-${props.y}`}>{props.children}</div>
    );
}

function Warehouse() {
    const [robotState, setRobotState] = useState<IRobotLocation>({
        x: 1,
        y: 1,
    });
    const commandInput = useRef<HTMLInputElement>(null);

    const onSubmit = (e) => {
        e.preventDefault();
        if (commandInput.current) {
            sendRobotCommand(commandInput.current.value).then((newRobotState) => {
                console.log("New robot state: " + JSON.stringify(newRobotState));
                setRobotState({ ...newRobotState });
            });
        }
    };

    return (
        <div className="warehouse-app">
            <div className="warehouse-grid">
                {_.map(_.range(1, warehouseState.y), (y) => {
                    return _.map(_.range(1, warehouseState.x), (x) => {
                        return (
                            <GridLocation key={`grid-${x}-${y}`} x={x} y={y}>
                                {robotState.x === x && robotState.y === y && (
                                    <img src={robot_img} className="warehouse-robot" />
                                )}
                            </GridLocation>
                        );
                    });
                })}
            </div>
            <div className="warehouse-command">
                <form onSubmit={onSubmit}>
                    <span>Send robot command</span>
                    <input name="robot-commands" type="text" ref={commandInput} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        </div>
    );
}

export default Warehouse;
