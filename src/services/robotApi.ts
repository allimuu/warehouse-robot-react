import _ from "lodash";

export interface IRobotLocation {
    x: number;
    y: number;
}

interface IWarehouseState {
    x: number;
    y: number;
    robotLocation: IRobotLocation;
}

enum Directions {
    North = "N",
    East = "E",
    South = "S",
    West = "W",
}

// this would be persisted in a backend databsae
export let warehouseState = {
    x: 10,
    y: 10,
    robotLocation: {
        x: 1,
        y: 1,
    },
} as IWarehouseState;

// Backend actions
function boundaryHitCheck(x, y) {
    if (x > warehouseState.x || x < 1 || y > warehouseState.y || y < 1) {
        console.log("Hit warehouse boundary: " + x + "," + y);
        return true;
    }
    return false;
}

function moveRobotY(y) {
    const newRobotY = warehouseState.robotLocation.y + y;
    const hit = boundaryHitCheck(warehouseState.robotLocation.x, newRobotY);
    if (!hit) {
        // if we haven't hit anything, move the robot
        warehouseState.robotLocation.y = newRobotY;
        return true;
    }
    return false;
}

function moveRobotX(x) {
    const newRobotX = warehouseState.robotLocation.x + x;
    const hit = boundaryHitCheck(warehouseState.robotLocation.y, newRobotX);
    if (!hit) {
        // if we haven't hit anything, move the robot
        warehouseState.robotLocation.x = newRobotX;
        return true;
    }
    return false;
}

function updateRobotState(command: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        switch (command) {
            case Directions.North:
                moveRobotY(-1);
                break;
            case Directions.East:
                moveRobotX(+1);
                break;
            case Directions.West:
                moveRobotX(-1);
                break;
            case Directions.South:
                moveRobotY(+1);
        }
        setTimeout(() => {
            console.log("Warehosue state: " + JSON.stringify(warehouseState));
            resolve(true);
        }, 200);
    });
}

export function getRobotState(): Promise<IRobotLocation> {
    return new Promise((resolve, reject) => {
        // make the API request here then resolve state from backend
        resolve(warehouseState.robotLocation);
    });
}

// Frontend actions
export function sendRobotCommand(command: string): Promise<IRobotLocation> {
    return new Promise(async (resolve, reject) => {
        let commands = _.split(command, " ");
        for (let command of commands) {
            // wait for the backend to tell us it was succesful
            console.log("Sending robot command: " + command);
            const success = await updateRobotState(command);
            if (!success) {
                break;
            }
        }
        resolve(await getRobotState());
    });
}
