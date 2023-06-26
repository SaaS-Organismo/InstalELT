import { LightSwitch } from './lightswitch.js';
import { Lamp } from './lamp.js';

export function first(canvas) {
    const lightSwitch = new LightSwitch(0.3 * canvas.width, 0.325 * canvas.height, 15, 5, 'grey');
    const lamp = new Lamp(0.5 * canvas.width, 0.57 * canvas.height, 15, 5, 'grey');

    return [lightSwitch, lamp]
};
