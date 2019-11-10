const taketimeFilter = function (time) {
	if (!time) return ''
	var second = Math.round(time / 1000, 0)
	var hour = Math.floor(second / 3600)
	var minute = Math.floor((second - hour * 3600) / 60)
	if (hour === 0) return minute + '分'
	return hour + '时' + minute + '分'
}

const taketimeForMinuteFilter = function(time) {
	if (!time) return '00:00'
	// console.log(time);
	var second = Math.round(time / 1000, 0)
	var minute = Math.floor(second / 60)
	var s = second - minute * 60
	return (minute > 9 ? minute : ('0' + minute)) + ':' + (s > 9 ? s : ('0' + s))
}

module.exports = {
	taketimeFilter, taketimeForMinuteFilter
}