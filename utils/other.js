export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function spaces(num) {
    return "\u200b ".repeat(num) + "\u200b"
}

export function weightMultiplier(members) {
    return members / 125 + (1 - members / 125) * (Math.sin(members / (125 / 0.927296)) + 0.2)
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

export function getSkillLevel(xp, maxLevel) {
    const levels = {
        "0": 0, "1": 50, "2": 175, "3": 375, "4": 675, "5": 1175, "6": 1925, "7": 2925, "8": 4425, "9": 6425,
        "10": 9925, "11": 14925, "12": 22425, "13": 32425, "14": 47425, "15": 67425, "16": 97425, "17": 147425,
        "18": 222425, "19": 322425, "20": 522425, "21": 822425, "22": 1222425, "23": 1722425, "24": 2322425,
        "25": 3022425, "26": 3822425, "27": 4722425, "28": 5722425, "29": 6822425, "30": 8022425, "31": 9322425,
        "32": 10722425, "33": 12222425, "34": 13822425, "35": 15522425, "36": 17322425, "37": 19222425,
        "38": 21222425, "39": 23322425, "40": 25522425, "41": 27822425, "42": 30222425, "43": 32722425,
        "44": 35322425, "45": 38072425, "46": 40972425, "47": 44072425, "48": 47472425, "49": 51172425,
        "50": 55172425, "51": 59472425, "52": 64072425, "53": 68972425, "54": 74172425, "55": 79672425,
        "56": 85472425, "57": 91572425, "58": 97972425, "59": 104672425, "60": 111672425
    };

    for (let level in levels) {
        if (xp >= levels[maxLevel.toString()]) {
            return maxLevel;
        }
        if (levels[level] > xp) {
            // const lowExp = levels[(parseInt(level) - 1).toString()];
            // const highExp = levels[level];
            // const difference = highExp - lowExp;
            // const extra = xp - lowExp;
            // const percentage = extra / difference;
            // return parseInt(level) - 1 + percentage;
            return parseInt(level) - 1 + (xp - levels[(parseInt(level) - 1).toString()]) / (levels[level] - levels[(parseInt(level) - 1).toString()]);
        }
    }
    return 0;
}
