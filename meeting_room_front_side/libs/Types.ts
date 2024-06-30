export type DateFormat = `${month}-${day}-${year}`
export type TimeFormat =  `${hour}:${minutes}`


type day = `${units}`|`1${units}`|`2${units}`|`30`|`31`
type year = `20${units}${units}`|`21${units}${units}`
type month = `${units}`|`10`|`11`|`12`
type hour = `${units}`| `1${units}`|`20`|`21`|`22`|`23`
type minutes =`${units}`| `1${units}`|`2${units}`|`3${units}`|`4${units}`| `5${units}`
type units = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'


export interface FormatedDate {
    format_start_time: TimeFormat;
    format_end_time:TimeFormat;
    format_date:DateFormat;
}

export interface CookieDocument{
     req?: { headers: { cookie?: string } }
        }