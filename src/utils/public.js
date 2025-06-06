import app from "../main"
export function handleChangeLanguage(value){
    localStorage.setItem('language_local', value)
    app.config.globalProperties.$locale.value = value
    window.location.reload();
}
export function generateChineseCalendar(year) {
    const weekdayNames = ['一', '二', '三', '四', '五', '六', '日'];
    const result = [];
  
    for (let month = 0; month < 12; month++) {
      const monthData = {
        month: month + 1,
        weeks: []
      };
  
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
  
      // 计算周一开始的日历起点（非默认周日）
      const startDate = new Date(firstDay);
      const dayOfWeek = (firstDay.getDay() + 6) % 7; // 将周日(0)变成6，周一变成0
      startDate.setDate(firstDay.getDate() - dayOfWeek);
  
      const endDate = new Date(lastDay);
      const endDayOfWeek = (lastDay.getDay() + 6) % 7;
      endDate.setDate(lastDay.getDate() + (6 - endDayOfWeek));
  
      let current = new Date(startDate);
  
      while (current <= endDate) {
        const week = [];
  
        for (let i = 0; i < 7; i++) {
          const y = current.getFullYear();
          const m = current.getMonth() + 1;
          const d = current.getDate();
          const weekdayIndex = (current.getDay() + 6) % 7; // 保证周一=0, 周日=6
  
          const isCurrentMonth = current.getMonth() === month;
  
          week.push({
            day: String(d).padStart(2, '0'),
            month: m,
            fullDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
            weekday: weekdayNames[weekdayIndex],
            edit: isCurrentMonth
          });
  
          current.setDate(current.getDate() + 1);
        }
  
        monthData.weeks.push(week);
      }
  
      result.push(monthData);
    }
  
    return result;
  }
  