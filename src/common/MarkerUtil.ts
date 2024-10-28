import Lodash from 'lodash';

type Pointer = {
  id: string;
  x: number;
  y: number;
};

type Marker = {
  id: string;
  name: string;
  color: string;
  category: string;
  pointers: Pointer[];
  area: { [key: string]: string };
};

type Position = {
  x: number;
  y: number;
};

const defaultColorPalete = [
  '#FF0000',
  '#0000FF',
  '#00FF00',
  '#FFFF00',
  '#FFA500',
  '#800080',
  '#00FFFF',
  '#FF00FF',
  '#BFFF00',
  '#A52A2A',
];
const categories = ['ceiling', 'wall', 'floor'];
const createUniqId = () => {
  return Lodash.uniqueId();
};

const MarkerUtil = {
  createDefaultMarkers: () => {
    return [
      {
        id: createUniqId(),
        name: '천장',
        color: defaultColorPalete[0],
        category: categories[0],
        pointers: [],
        area: {},
      },
      {
        id: createUniqId(),
        name: '벽',
        color: defaultColorPalete[1],
        category: categories[1],
        pointers: [],
        area: {},
      },
      {
        id: createUniqId(),
        name: '바닥',
        color: defaultColorPalete[2],
        category: categories[2],
        pointers: [],
        area: {},
      },
    ];
  },

  createNewMarker: (markerLength: number) => {
    return {
      id: createUniqId(),
      name: `${markerLength + 1}번째 마커`,
      color: defaultColorPalete[markerLength % defaultColorPalete.length],
      category: categories[markerLength % categories.length],
      pointers: [],
      area: {},
    };
  },

  createPointer: (position: Position) => {
    return {
      id: createUniqId(),
      x: position.x,
      y: position.y,
    };
  },

  getKeyWithPosition: (position: Position) => {
    return `${position.x}-${position.y}`;
  },
};

Object.freeze(MarkerUtil);
export default MarkerUtil;
export type { Marker, Pointer };
