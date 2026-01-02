/**
 * This solution focuses on storing the ships matrix as an array of Vector2s (coordinates)
 * Then, for each vector, we go through previously stored vectors to see if it's adjacent to any.
 * We do this by calculating the X and Y distance. A distance of 1 = adjacent to another ship vector.
 * Then, when we find adjacent ship vectors, we combine these together into the same ship definition (an array of vectors).
 * Finally, we loop through the ship definitions and add them to the register based on ship sizes.
 *
 * About performance optimization:
 * This solution should scale for when the max size of the ships goes up.
 * The big O for increase in ship max size is linear in this solution O(n).
 * However, increases in ship matrix cells makes it approach O(n^2) (exponential) for high ship density
 * because we are always looping through all of the previous ship coordinates as we go to check for matches.
 * This could be optimized: store coordinates as a double dimensional Map() indexed by X & Y
 * That way, we only have to access the rows and columns adjacent to the coordinate to check for adjacent cells.
 * E.g. `ShipMap.get(Y-1)?.get(X)` -> x4 , for each adjacent option, Y-1, Y+1, X-1, X+1
 * Then the solution is linearly scaling with amount of matrix cells 🎉
 * Code is a bit more verbose/complicated though :) loop + distance check is the simpler solution
 */

// Helper type for Tuples, e.g. Tuple<number, 3> = [number, number, number]
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

const SHIP_MAX_LENGTH = 3 as const;
declare type ShipsRegister = Tuple<number, typeof SHIP_MAX_LENGTH>;

declare type Vector2 = [number, number];
declare type Ship = Vector2[];

function parseCoordinates(rows: string[]): Vector2[] {
  const coords: Vector2[] = [];
  rows.forEach((row, i) => {
    // split is safe because we know there won't be unicode characters in our input data
    row.split("").forEach((cell, j) => {
      if (cell === "#") {
        coords.push([i, j]);
      }
    });
  });
  return coords;
}

function getMatchingShipIndices(ships: Ship[], coord: Vector2) {
  const matches: Set<number> = new Set();

  ships.forEach((ship, i) => {
    for (const shipCoord of ship) {
      // We can check the distance of the ship coordinate
      // from other ships that we already know about
      // if it's 1, then this coordinate is directly adjacent to a known ship coordinate
      const distance =
        Math.abs(shipCoord[0] - coord[0]) + Math.abs(shipCoord[1] - coord[1]);

      if (distance === 1) {
        matches.add(i);
      }
    }
  });
  return matches;
}

export function solution(rows: string[]): ShipsRegister {
  const result = Array(SHIP_MAX_LENGTH).fill(0) as ShipsRegister;
  const coords = parseCoordinates(rows);
  let ships: Ship[] = [];

  for (const coord of coords) {
    const matchingShipIndices = getMatchingShipIndices(ships, coord);

    // no matches, so this is part of a new ship
    if (matchingShipIndices.size === 0) {
      ships.push([coord]);
    } else {
      const matchingShipsCoords = Array.from(matchingShipIndices).flatMap(
        (matchingShipIndex) => ships[matchingShipIndex]
      );
      // "merge" the  matching ship coordinates into the same ship
      const newShip: Ship = [coord, ...matchingShipsCoords];

      // filter out the matching ships, since we created a new ship with it
      ships = [
        ...ships.filter((_, shipIndex) => !matchingShipIndices.has(shipIndex)),
        newShip,
      ];
    }
  }
  // console.log("Ships: ", ships);

  for (const ship of ships) {
    // categorize the ships by ship length
    result[ship.length - 1]++;
  }

  return result;
}
