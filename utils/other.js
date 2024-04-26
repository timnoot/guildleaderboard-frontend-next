export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function spaces(num) {
    return "\u200b ".repeat(num) + "\u200b"
}

export function getSlayerLevel(type, xp) {
    const slayerXps = {
        zombie: {
            1: 5, 2: 15, 3: 200, 4: 1000, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000
        },
        spider: {
            1: 5, 2: 25, 3: 200, 4: 1000, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000
        },
        wolf: {
            1: 10, 2: 30, 3: 250, 4: 1500, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000
        },
        enderman: {
            1: 10, 2: 30, 3: 250, 4: 1500, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000
        },
        blaze: {
            1: 10, 2: 30, 3: 250, 4: 1500, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000
        },
        vampire: {
            1: 20, 2: 75, 3: 240, 4: 840, 5: 2400
        }
    }
    let slayerXp = slayerXps[type];
    // level with progress to next level as a decimal
    let level = 0;
    let progress = 0;
    for (let i = 1; i < 10; i++) {
        if (xp >= slayerXp[i]) {
            level = i;
            progress = (xp - slayerXp[i]) / (slayerXp[i + 1] - slayerXp[i]);
        }
    }
    return { level, progress };

}

export function weightMultiplier(members) {
    return members / 125 + (1 - members / 125) * (Math.sin(members / (125 / 0.927296)) + 0.2)
}

export function getCataLevel(xp) {
    const cataXps = {
        1: 50, 2: 75, 3: 110, 4: 160, 5: 230, 6: 330, 7: 470, 8: 670, 9: 950, 10: 1340, 11: 1890, 12: 2665, 13: 3760, 14: 5260, 15: 7380, 16: 10300, 17: 14400, 18: 20000, 19: 27600, 20: 38000, 21: 52500, 22: 71500, 23: 97000, 24: 132000, 25: 180000, 26: 243000, 27: 328000, 28: 445000, 29: 600000, 30: 800000, 31: 1065000, 32: 1410000, 33: 1900000, 34: 2500000, 35: 3300000, 36: 4300000, 37: 5600000, 38: 7200000, 39: 9200000, 40: 12000000, 41: 15000000, 42: 19000000, 43: 24000000, 44: 30000000, 45: 38000000, 46: 48000000, 47: 60000000, 48: 75000000, 49: 93000000, 50: 116250000,
    }

    let remainingXp = xp;
    let level50 = 569809640;
    if (xp >= level50) {
        return 50 + (xp - level50) / 200000000;
    }
    for (let level in cataXps) {
        if (remainingXp < cataXps[level]) {
            let decimal = remainingXp / cataXps[level];
            return parseInt(level) + decimal - 1;
        }
        remainingXp -= cataXps[level];
    }
    return 0;
}