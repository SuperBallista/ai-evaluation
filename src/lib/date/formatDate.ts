
// 날짜 포맷 변환 함수
  export const formatDate = (date: Date) => {
        return new Date(date).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      };
  
      export function formatDateString(date: Date, style: string): string {
        let year = String(date.getFullYear());
        let halfyear = year.slice(2, 4); // "2025" → "25"
        let month = String(date.getMonth() + 1).padStart(2, "0"); // "2" → "02"
        let dateNumber = String(date.getDate()).padStart(2, "0");
        let hour = String(date.getHours()).padStart(2, "0");
        let minute = String(date.getMinutes()).padStart(2, "0");
    
        return style
            .replace("YYYY", year)
            .replace("YY", halfyear)
            .replace("MM", month)
            .replace("DD", dateNumber)
            .replace("HH", hour)
            .replace("mm", minute);
    }
    
// 남은 시간 계산 함수

export function checkDateTime(dateTime: Date):string{
    function getKSTDate(): Date {
        const nowUTC = new Date();
        return new Date();
    }
    const nowKST = getKSTDate();

    let resultSeconds = dateTime.getSeconds() - nowKST.getSeconds()
    let resultMinute = dateTime.getMinutes() - nowKST.getMinutes() 
    let resultHour = dateTime.getHours() - nowKST.getHours() 
    let resultDate = dateTime.getDate() - nowKST.getDate()
    let resultMonth = dateTime.getMonth() - nowKST.getMonth()
    let resultYear = dateTime.getFullYear() - nowKST.getFullYear()
    let resultString: string

const resultTime = resultSeconds + resultMinute * 60 + resultHour * 60 * 60 + resultDate * 60 * 60 * 24 + resultMonth * 60 * 60 * 24 * 30 + resultYear * 60 * 60 * 24 * 30 * 365

if (resultTime > 0 ){
if (resultTime < 60){
    resultString = "조금 후"
}
else if (resultTime < 60 * 60){
    resultString = String(Math.round(resultTime / 60)) + "분 후" 
}
else if (resultTime < 60 * 60 * 24){
    resultString = String(Math.round(resultTime / (60 * 60))) + "시간 후"
}
else if (resultTime < 25 * 60 * 60 * 24){
    resultString = String(Math.round(resultTime / (24 * 60 * 60))) + "일 후"
}
else {
    resultString = formatDateString(dateTime,"YYYY.MM.DD")
}

}
else{
    if (resultTime > -60){
        resultString = "조금 전"
    }
    else if (resultTime > - 60 * 60){
        resultString = String(Math.round(resultTime / -60)) + "분 전" 
    }
    else if (resultTime > - 60 * 60 * 24){
        resultString = String(Math.round(resultTime / (-60 * 60))) + "시간 전"
    }
    else if (resultTime > - 25 * 60 * 60 * 24){
        resultString = String(Math.round(resultTime / (-24 * 60 * 60))) + "일 전"
    }
    else {
        resultString = formatDateString(dateTime,"YYYY.MM.DD")
    }
        
}


return resultString
}