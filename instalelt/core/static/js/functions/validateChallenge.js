export default function validateChallenge () {
    // 1-phase 2-neutral 3-ground 4-switchTop 5-switchBottom 6-lampTop 7-lampBottom
    const expectedTerminalConnections = [
        [1, 4],
        [2, 7],
        [5, 6]
    ];

    const checkButton = document.getElementById('check-solution');
    checkButton.addEventListener('click', () => {
        let correct = false
        console.log(terminals)
        for (let connection of expectedTerminalConnections) {
            let startTerminal = terminals.filter((terminal) => terminal.id == connection[0])[0]
            let endTerminal = terminals.filter((terminal) => terminal.id == connection[1])[0]
            if (startTerminal.connected && endTerminal.connected) {
                if (startTerminal.connectedTo == endTerminal.connectedTo) {
                    correct = true
                } else {
                    correct = false
                    break
                }
            } else {
                correct = false
                Swal.fire(
                    'Errado',
                    'Ligações incompletas',
                    'warning'
                )
                return
            }

        }
        if (correct) {
            Swal.fire(
                'Correto',
                'Você acertou!',
                'success'
            )
            lamp.image.src = '../static/images/lamp_on.png';
            redrawCanvas()

        } else {
            Swal.fire(
                'Errado',
                'Você errou!',
                'error'
            )
        }
    });
};