export const challengesSchema = [
    {
      "id": 1,
      "terminals": [],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.325
        }
      ],
      "lamps": [
        {
          "x": 0.5,
          "y": 0.57
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
      "terminals": [ ],
      "wires": [],
      "switches": [
        {
          "x": 0.3,
          "y": 0.325
        }
      ],
      "lamps": [
        {
          "x": 0.7,
          "y": 0.57
        }
      ],
      "outlets": [{
        "x": 0.4,
        "y": 0.4
      }],
      "expectedConnections": [
  

      ]
    }
  ]