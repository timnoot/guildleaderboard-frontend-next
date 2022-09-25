export class TimeDelta {
	constructor(str) {
		this.days = 0;
		if (str.includes(", ")) {
			[this.daystr, this.rest] = str.split(", ")
			this.days = parseInt(this.daystr.split(' ')[0]);
		} else {
			this.rest = str;
		}

		[this.seconds, this.minutes, this.hours] = this.rest.split(':').reverse();
		this.seconds = parseInt(this.seconds); // Imagine looping
		this.minutes = parseInt(this.minutes);
		this.hours = parseInt(this.hours);
	}
	// static method to create a TimeDelta from a Date object
	static fromDate(datestr) {
		let diff = Date.now() - Date.parse(`${datestr}+00:00`);
		let delta = new TimeDelta("");
		delta.days = Math.floor(diff / (1000 * 60 * 60 * 24));
		diff = diff - delta.days * (1000 * 60 * 60 * 24);
		delta.hours = Math.floor(diff / (1000 * 60 * 60));
		diff = diff - delta.hours * (1000 * 60 * 60);
		delta.minutes = Math.floor(diff / (1000 * 60));
		diff = diff - delta.minutes * (1000 * 60);
		delta.seconds = Math.floor(diff / 1000);

		return delta;
	}


	toString() {
		return `${this.hours}:${this.minutes}:${this.seconds}`;
	}
	toNiceString() {
		let hours = this.hours + this.days * 24;
		if (hours > 1) {
			return `${hours} hours ago`;
		} else {
			return `${this.minutes} minutes ago`;
		}
	}


	toNiceStringWDays() {
		if (this.days > 0) {
			return `${this.days} days ago`;
		} else {
			return this.toNiceString();
		}
	}
	toLongDate() {
		let date = new Date(Date.now() - this.toMS())
		return date.toLocaleDateString()
		// return new Date(Date.now() - this.toMS());
	}

	toSeconds() {
		return this.seconds + this.minutes * 60 + this.hours * 3600 + this.days * 86400;
	}
	toMS() {
		return this.toSeconds() * 1000;
	}
}