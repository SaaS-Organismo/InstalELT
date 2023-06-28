export const challengesSchema = [
    {
      "id": 1,
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.35
        }
      ],
      "lamps": [
        {
          "x": 0.5,
          "y": 0.59
        }
      ],
      "outlets": [],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    {
      "id": 2,
      "terminals": [ ],
      "wires": [],
      "switches": [
      ],
      "lamps": [
      ],
      "outlets": [{
        "x": 0.4,
        "y": 0.6
      }],
      "expectedConnections": [
        [
          [8, 11],
          [9, 12],
          [10, 13],
        ],
        [
          [8, 12],
          [9, 11],
          [10, 13],
        ]

      ]
    },
    {
      "id": 3,
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.35
        }
      ],
      "lamps": [
        {
          "x": 0.5,
          "y": 0.59
        },
        {
          "x": 0.8,
          "y": 0.59
        }
      ],
      "outlets": [],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    {
       "id": 4, // Three way
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.35
        }
      ],
      "lamps": [
        {
          "x": 0.5,
          "y": 0.59
        },
        {
          "x": 0.8,
          "y": 0.59
        }
      ],
      "outlets": [],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    {
      "id": 5, 
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.2
        },
        {
          "x": 0.8,
          "y": 0.2
        }
      ],
      "lamps": [
        {
          "x": 0.49,
          "y": 0.8
        },
      ],
      "outlets": [],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    {
      "id": 6, // Four way
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.2
        },
        {
          "x": 0.8,
          "y": 0.2
        }
      ],
      "lamps": [
        {
          "x": 0.49,
          "y": 0.8
        },
      ],
      "outlets": [],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    {
      "id": 7, // Four way
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.1
        }
      ],
      "lamps": [
        {
          "x": 0.6,
          "y": 0.6
        },
      ],
      "outlets": [
        {
          "x": 0.26,
          "y": 0.9
        }
      ],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    {
      "id": 8, // Four way
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.2,
          "y": 0.1
        },
        {
          "x": 0.8,
          "y": 0.1
        }
      ],
      "lamps": [
        {
          "x": 0.45,
          "y": 0.9
        },
      ],
      "outlets": [
        {
          "x": 0.16,
          "y": 0.7
        },
        {
          "x": 0.76,
          "y": 0.7
        }
      ],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    },
    ,
    {
      "id": 9, // Four way
      "terminals": [],
      "wires": [],
      "switches": [
      ],
      "lamps": [
      ],
      "outlets": [
        {
          "x": 0.3,
          "y": 0.6
        },
        {
          "x": 0.6,
          "y": 0.6
        }
      ],
      "expectedConnections": [
        [
          [1, 4],
          [2, 7],
          [5, 6],
        ],
        [
          [1, 5],
          [4, 6],
          [2, 7],
        ]

      ]
    }
  ]