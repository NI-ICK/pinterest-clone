import { differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'

export function FormatDate({ postDate }) {
    const currentDate = Date.now()
    
    const yearsDiff = differenceInYears(currentDate, postDate)
    const monthsDiff = differenceInMonths(currentDate, postDate)
    const weeksDiff = differenceInWeeks(currentDate, postDate)
    const daysDiff = differenceInDays(currentDate, postDate)
    const hoursDiff = differenceInHours(currentDate, postDate)
    const minutesDiff = differenceInMinutes(currentDate, postDate)

    if (yearsDiff > 0) return `${yearsDiff}y, `
    if (monthsDiff > 0) return `${monthsDiff}mo, `
    if (weeksDiff > 0) return `${weeksDiff}w, `
    if (daysDiff > 0) return `${daysDiff}d`
    if (hoursDiff > 0) return `${hoursDiff}h`
    if (minutesDiff > 0) return `${minutesDiff}m`
    return 'now'
}