

export const getMonthsList = () => {
    return Array.from({length: 12}, (_, i) => {
        return new Date(0, i).toLocaleString("default", { month: 'long' }).toUpperCase();
    })
}