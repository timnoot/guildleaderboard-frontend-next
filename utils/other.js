export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
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
