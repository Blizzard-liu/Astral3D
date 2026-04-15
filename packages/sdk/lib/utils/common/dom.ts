/**
 * Create a container.
 */
export function createDivContainer(): HTMLDivElement {
    const div = document.createElement("div");
    document.body.appendChild(div);
    return div;
}