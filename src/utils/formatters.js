import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatVietnamTime(inputDate, format = "DD/MM/YYYY HH:mm:ss") {
  return dayjs
    .utc(inputDate)
    .tz("Asia/Ho_Chi_Minh")
    .locale("vi")
    .format(format);
}
