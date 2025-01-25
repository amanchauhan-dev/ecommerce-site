export const NumberFormater = (num: Number) => {
    let str: string = num.toString().trim()
    let format: string = '';
    if (str.length <= 3) {
        return str
    } else {
        let i = 0;
        for (let index = str.length - 1; index >= 0; index--) {
            if (i % 3 == 0 && i !== 0) {
                format = "," + format
                format = str[index] + format
            }
            else
                format = str[index] + format
            i++
        }
        return format
    }
}