const challengesSchema = [
  {
    id: 1,
    terminals: [],
    wires: [],
    switches: [
      {
        x: 0.3,
        y: 0.35,
      },
    ],
    threeWaySwitches: [],
    fourWaySwitches: [],
    lamps: [
      {
        x: 0.5,
        y: 0.59,
      },
    ],
    outlets: [],
    expectedConnections: [
      [
        [1, 4],
        [2, 7],
        [5, 6],
      ],
      [
        [1, 5],
        [4, 6],
        [2, 7],
      ],
    ],
    statement:
      "Faça a conexão correta dos fios para que a lâmpada possa ser ligada através do interruptor:",
  },
  {
    id: 2,
    terminals: [],
    wires: [],
    switches: [],
    threeWaySwitches: [],
    fourWaySwitches: [],
    lamps: [],
    outlets: [
      {
        x: 0.4,
        y: 0.6,
      },
    ],
    expectedConnections: [
      [
        [8, 11],
        [9, 12],
        [10, 13],
      ],
      [
        [8, 12],
        [9, 11],
        [10, 13],
      ],
    ],
    statement:
      "Faça a conexão correta dos fios para a ligação da tomada de 127V:",
  },
  {
    id: 3,
    terminals: [],
    wires: [],
    switches: [
      {
        x: 0.3,
        y: 0.35,
      },
    ],
    threeWaySwitches: [],
    fourWaySwitches: [],
    lamps: [
      {
        x: 0.5,
        y: 0.3,
      },
      {
        x: 0.5,
        y: 0.8,
      },
    ],
    outlets: [],
    expectedConnections: [
      [
        [14, 17],
        [18, 19],
        [18, 21],
        [15, 20],
        [15, 22],
      ],
      [
        [14, 18],
        [17, 19],
        [17, 21],
        [15, 20],
        [15, 22],
      ],
    ],

    statement:
      "Faça a conexão correta dos fios para a ligação de duas lâmpadas em paralelo:",
  },
  {
    id: 4, // Three way
    terminals: [],
    wires: [],
    switches: [
      {
        x: 0.3,
        y: 0.35,
      },
      {
        x: 0.4,
        y: 0.35,
      },
    ],
    threeWaySwitches: [],
    fourWaySwitches: [],
    lamps: [
      {
        x: 0.6,
        y: 0.3,
      },
      {
        x: 0.6,
        y: 0.8,
      },
    ],
    outlets: [],
    expectedConnections: [
      [
        [23, 26],
        [23, 28],
        [24, 31],
        [24, 33],
        [27, 32],
        [29, 30],
      ],
      [
        [23, 27],
        [23, 29],
        [24, 31],
        [24, 33],
        [26, 32],
        [28, 30],
      ],
      [
        [23, 26],
        [23, 28],
        [24, 31],
        [24, 33],
        [27, 30],
        [29, 32],
      ],
      [
        [23, 27],
        [23, 29],
        [24, 31],
        [24, 33],
        [26, 30],
        [28, 32],
      ],
    ],
    statement:
      "Faça a conexão adequada para que as duas lâmpadas sejam acionadas por dois interruptores simples:",
  },
  {
    id: 5,
    terminals: [],
    wires: [],
    switches: [],
    threeWaySwitches: [
      {
        x: 0.3,
        y: 0.3,
      },
      {
        x: 0.8,
        y: 0.3,
      },
    ],
    fourWaySwitches: [],
    lamps: [
      {
        x: 0.49,
        y: 0.8,
      },
    ],
    outlets: [],
    expectedConnections: [
      [
        [34, 38],
        [37, 40],
        [39, 42],
        [41, 44],
        [35, 43],
      ],
      [
        [34, 41],
        [37, 40],
        [39, 42],
        [38, 44],
        [35, 43],
      ],
    ],
    statement:
      "Faça a conexão  para a ligação da lâmpada usando dois interruptores Three-way:",
  },
  {
    id: 6,
    terminals: [],
    wires: [],
    switches: [],
    threeWaySwitches: [
      {
        x: 0.3,
        y: 0.2,
      },
      {
        x: 0.8,
        y: 0.2,
      },
    ],
    fourWaySwitches: [
      {
        x: 0.45,
        y: 0.2,
      },
    ],
    lamps: [
      {
        x: 0.49,
        y: 0.8,
      },
    ],
    outlets: [],
    expectedConnections: [
      [
        [45, 49],
        [48, 54],
        [55, 51],
        [50, 56],
        [57, 53],
        [52, 59],
        [46, 58],
      ],
      [
        [45, 52],
        [48, 54],
        [55, 51],
        [50, 56],
        [57, 53],
        [49, 59],
        [46, 58],
      ],
    ],
    statement:
      "Faça a conexão para a ligação da lâmpada usando dois interruptores Three-way e um Four-way:",
  },
  {
    id: 7, // Four way
    terminals: [],
    wires: [],
    switches: [
      {
        x: 0.3,
        y: 0.1,
      },
    ],
    lamps: [
      {
        x: 0.6,
        y: 0.6,
      },
    ],
    threeWaySwitches: [],
    fourWaySwitches: [],
    outlets: [
      {
        x: 0.26,
        y: 0.9,
      },
    ],
    expectedConnections: [
      [
        [60, 63],
        [60, 67],
        [64, 65],
        [61, 66],
        [61, 68],
        [62, 69],
      ],
      [
        [60, 64],
        [60, 67],
        [63, 65],
        [61, 66],
        [61, 68],
        [62, 69],
      ],
      [
        [60, 63],
        [60, 68],
        [64, 65],
        [61, 66],
        [61, 67],
        [62, 69],
      ],
      [
        [60, 64],
        [60, 68],
        [63, 65],
        [61, 66],
        [61, 67],
        [62, 69],
      ],
    ],
    statement:
      "Faça a conexão correta dos fios para a conexão da lâmpada, interruptor e da tomada no mesmo circuito:",
  },
  {
    id: 8, // Four way
    terminals: [],
    wires: [],
    switches: [],
    lamps: [
      {
        x: 0.55,
        y: 0.9,
      },
    ],
    threeWaySwitches: [
      {
        x: 0.35,
        y: 0.1,
      },
      {
        x: 0.8,
        y: 0.1,
      },
    ],
    fourWaySwitches: [],
    outlets: [
      {
        x: 0.3,
        y: 0.8,
      },
      {
        x: 0.76,
        y: 0.8,
      },
    ],
    expectedConnections: [
      [[70, 74]],
      [
        [70, 77],
        [70, 81],
        [70, 84],
        [71, 82],
        [71, 79],
        [71, 85],
        [72, 83],
        [72, 86],
        [73, 76],
        [75, 78],
        [74, 80],
      ],
      [
        [70, 74],
        [70, 82],
        [70, 84],
        [71, 81],
        [71, 79],
        [71, 85],
        [72, 83],
        [72, 86],
        [73, 76],
        [75, 78],
        [77, 80],
      ],
      [
        [70, 77],
        [70, 82],
        [70, 84],
        [71, 81],
        [71, 79],
        [71, 85],
        [72, 83],
        [72, 86],
        [73, 76],
        [75, 78],
        [74, 80],
      ],
      [
        [70, 74],
        [70, 82],
        [70, 85],
        [71, 81],
        [71, 79],
        [71, 84],
        [72, 83],
        [72, 86],
        [73, 76],
        [75, 78],
        [77, 80],
      ],
      [
        [70, 77],
        [70, 82],
        [70, 85],
        [71, 81],
        [71, 79],
        [71, 84],
        [72, 83],
        [72, 86],
        [73, 76],
        [75, 78],
        [74, 80],
      ],
    ],
    statement:
      "Faça a conexão correta para a conexão da lâmpada usando dois Three-way e duas tomadas:",
  },
  ,
  {
    id: 9, // Four way
    terminals: [],
    wires: [],
    switches: [],
    lamps: [],
    threeWaySwitches: [],
    fourWaySwitches: [],
    outlets: [
      {
        x: 0.3,
        y: 0.6,
      },
      {
        x: 0.6,
        y: 0.6,
      },
    ],
    expectedConnections: [
      [
        [87, 90],
        [87, 93],
        [87, 94],
        [88, 91],
        [89, 92],
        [89, 95],
      ],
      [
        [87, 91],
        [87, 93],
        [87, 94],
        [88, 90],
        [89, 92],
        [89, 95],
      ],
    ],
    statement:
      "Faça a conexão correta das tomadas considerando uma alimentação de 127V para primeira tomada e 220V para a segunda tomada. ",
  },
];

const unifilarSchema = [
  {
    id: 1,
    slots: [
      { id: 1, x: 0.11, y: 0.92, wires: [] },
      { id: 2, x: 0.24, y: 0.7, wires: [] },
      { id: 3, x: 0.2, y: 0.48, wires: [] },
      { id: 4, x: 0.5, y: 0.52, wires: [] },
      { id: 5, x: 0.68, y: 0.3, wires: [] },
      { id: 6, x: 0.78, y: 0.4, wires: [] },
    ],
    expectedConnections: [
      [
        {
          id: 1,
          wires: [
            { type: "neutro", circuit: "1a" },
            { type: "fase", circuit: "1a" },
            { type: "terra", circuit: "1a" },
          ],
        },
        {
          id: 2,
          wires: [
            { type: "neutro", circuit: "1a" },
            { type: "fase", circuit: "1a" },
            { type: "terra", circuit: "1a" },
          ],
        },
        {
          id: 3,
          wires: [
            { type: "fase", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
          ],
        },
        {
          id: 4,
          wires: [
            { type: "neutro", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "terra", circuit: "1a" },
          ],
        },
        {
          id: 5,
          wires: [
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
          ],
        },
        {
          id: 6,
          wires: [
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
            { type: "retorno", circuit: "1a" },
          ],
        },
      ],
    ],
    statement:
      "Complete o traçado de eletrodutos e represente a fiação partindo do QD para duas lâmpadas comandadas por interruptor intermediário",
    image: "../static/images/desafio-unifilar-1.png",
  },
  {
    id: 2,
    slots: [
      { id: 1, x: 0.06, y: 0.4, wires: [] },
      { id: 2, x: 0.3, y: 0.3, wires: [] },
      { id: 3, x: 0.2, y: 0.55, wires: [] },
      { id: 4, x: 0.5, y: 0.45, wires: [] },
      { id: 5, x: 0.65, y: 0.3, wires: [] },
      { id: 6, x: 0.18, y: 0.3, wires: [] },
    ],
    expectedConnections: [
      [
        {
          id: 6,
          wires: [
            { type: "neutro", circuit: "1a" },
            { type: "fase", circuit: "1a" },
            { type: "terra", circuit: "1a" },
          ],
        },
      ],
    ],
    statement:
      "Complete o traçado de eletrodutos e represente a fiação partindo do QD para duas lâmpadas em paralelo e 3 tomadas 127V",
    image: "../static/images/desafio-unifilar-2.png",
  },
  {
    id: 3,
    slots: [
      { id: 1, x: 0.1, y: 0.36, wires: [] },
      { id: 2, x: 0.35, y: 0.63, wires: [] },
      { id: 3, x: 0.18, y: 0.86, wires: [] },
      { id: 4, x: 0.84, y: 0.47, wires: [] },
      { id: 5, x: 0.62, y: 0.52, wires: [] },
      { id: 6, x: 0.32, y: 0.4, wires: [] },
    ],
    expectedConnections: [
      [
        {
          id: 14,
          wires: [
            { type: "neutro", circuit: "1a" },
            { type: "fase", circuit: "1a" },
            { type: "terra", circuit: "1a" },
          ],
        },
      ],
    ],
    statement:
      "Complete o traçado de eletrodutos e represente para duas lâmpadas 4 quatro tomadas (alimentação bifásica do quadro 220V)",
    image: "../static/images/desafio-unifilar-3.jpeg",
  },
  {
    id: 4,
    slots: [
      { id: 1, x: 0.18, y: 0.36, wires: [] },
      { id: 2, x: 0.18, y: 0.53, wires: [] },
      { id: 3, x: 0.03, y: 0.8, wires: [] },
      { id: 4, x: 0.28, y: 0.78, wires: [] },
      { id: 5, x: 0.55, y: 0.53, wires: [] },
      { id: 6, x: 0.48, y: 0.29, wires: [] },
      { id: 6, x: 0.37, y: 0.23, wires: [] },
      { id: 6, x: 0.6, y: 0.16, wires: [] },
      { id: 6, x: 0.63, y: 0.38, wires: [] },

    ],
    expectedConnections: [
      [
        {
          id: 14,
          wires: [
            { type: "neutro", circuit: "1a" },
            { type: "fase", circuit: "1a" },
            { type: "terra", circuit: "1a" },
          ],
        },
      ],
    ],
    statement:
      "Complete o traçado de eletrodutos e represente a fiação partindo do QD lâmpada incandescente com um interruptor simples e 3 tomadas",
    image: "../static/images/desafio-unifilar-4.jpeg",
  },
];
