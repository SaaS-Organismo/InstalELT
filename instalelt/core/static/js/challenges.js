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

      ],
      "statement":"Faça a conexão correta dos fios para a ligar a lâmpada:"
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

      ],
      "statement": "Faça a conexão correta dos fios para a ligação da tomada:"
    },
    {
      "id": 3,
      "terminals": [ ],
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
       

      ],
      "statement": "Faça a conexão correta dos fios para a conexão de duas lâmpadas em paralelo:"

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

    
      ],
      "statement": "Faça a conexão correta para duas lâmpadas acionadas por dois interruptores simples:"
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


      ],
      "statement": "Faça a conexão  para a ligação da lâmpada usando dois interruptores Three-way:"

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



      ],
      "statement": "Faça a conexão para a ligação da lâmpada usando dois interruptores Three-way e um Four-way:"

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



      ],
      "statement": "Faça a conexão correta dos fios para a conexão da lâmpada, interruptor e da tomada no mesmo circuito:"

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



      ],
      "statement": "Faça a conexão correta para a conexão da lâmpada usando dois Three-way e duas tomadas:"

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


      ],
      "statement": "Faça a conexão correta das tomadas considerando uma alimentação bifásica. "

    }
  ]