export function euclidianDistance(a, b, offsetX = 0, offsetY = 0) {
    return Math.sqrt(((b.x + offsetX) - a.x) ** 2 + ((b.y + offsetY) - a.y) ** 2);
}