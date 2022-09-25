export function numberWithCommas(x) {
    x = Math.round(x * 100) / 100
    if (x >= 1000) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return x
    }
  }

export function numberShortener(x) {
    x = Math.round(x * 100) / 100
    if (x >= 1000000000000) {
      return (x / 1000000000000).toFixed(2) + 'T'
    } else if (x >= 1000000000) {
      return (x / 1000000000).toFixed(2) + 'B'
    } else if (x >= 1000000) {
      return (x / 1000000).toFixed(1) + 'M'
    } else if (x >= 1000) {
      return (x / 1000).toFixed(0) + 'K'
    }
    return x
  }