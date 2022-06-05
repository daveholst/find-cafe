interface randomColorOptions {
    /** Percentage value of opacity ie 100 = 100% opacity = FF */
    opacity?: number
}

export interface RandomColor {
    solid: string
    opacityDriven: string
}

export function randomColor({ opacity = 100 }: randomColorOptions) {
    const opacityDriven = `#${percentToHex(opacity)}${Math.floor(
        Math.random() * 16777215
    ).toString(16)}`

    const solid = `#${Math.floor(Math.random() * 16777215).toString(16)}`

    return {
        solid,
        opacityDriven,
    }
}

// transparency hex converter
const percentToHex = (p) => {
    const percent = Math.max(0, Math.min(100, p)) // bound percent from 0 to 100
    const intValue = Math.round((p / 100) * 255) // map percent to nearest integer (0 - 255)
    const hexValue = intValue.toString(16) // get hexadecimal representation
    return hexValue.padStart(2, "0").toUpperCase() // format with leading 0 and upper case characters
}
