class Utils {
    isYesterday(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        const differenceInTime = d2.getTime() - d1.getTime();
        const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
        return differenceInDays === 1;
    }
    converTimeStrToHourAndMin(dateStr) {
        if(!dateStr) return ''
        let result = ''
        const date = new Date(dateStr)
        const currentDate = new Date()
        if(date.getDay() < currentDate.getDay()) {
            result = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ` 
        }
        let hours = date.getHours()
        if(hours < 10) hours = '0' + hours
        let minutes = date.getMinutes()
        if(minutes < 10) minutes = '0' + minutes
        result += `${hours}:${minutes}`
        return result
    }
}

const utils = new Utils()
export default utils