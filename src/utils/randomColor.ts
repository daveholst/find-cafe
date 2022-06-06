interface randomColorOptions {
    /** Percentage value of opacity ie 100 = 100% opacity = FF */
    opacity?: number
}

export interface RandomColor {
    solid: string
    transparent: string
    trans90: string
}

export function randomColor({ opacity = 100 }: randomColorOptions) {
    const r = randomNum()
    const g = randomNum()
    const b = randomNum()
    const a = opacity / 100

    return {
        solid: `rgb(${r}, ${g}, ${b})`,
        transparent: `rgba(${r}, ${g}, ${b}, ${a})`,
        trans90: `rgba(${r}, ${g}, ${b}, ${0.9})`,
    }
}

function randomNum() {
    return Math.floor(Math.random() * 256) + 1
}
