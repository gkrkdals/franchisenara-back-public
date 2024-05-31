/**
 * yyyyMMdd 형식으로 오늘의 날짜를 구합니다.
 */
export const getYMD = () => {
  const currentTime = new Date();
  return currentTime.getFullYear().toString() +
    ('0' + (1 + currentTime.getMonth())).slice(-2) +
    ('0' + currentTime.getDate()).slice(-2)
}

/**
 * 10일 전 날짜를 구합니다.
 */
export const getTenDaysBefore = () => {
  const d = new Date(Date.now());
  d.setDate(d.getDate() - 10);

  return d.getFullYear().toString() +
    ('0' + (1 + d.getMonth())).slice(-2) +
    ('0' + d.getDate()).slice(-2)

}

/**
 * yyyyMMddhhmmss 형태의 현재 시간을 구합니다.
 */
export const getFullDateTime = (): string => {
  const currentTime = new Date()

  return currentTime.getFullYear().toString() +
    ('0' + (1 + currentTime.getMonth())).slice(-2) +
    ('0' + currentTime.getDate()).slice(-2) +
    ('0' + currentTime.getHours()).slice(-2) +
    ('0' + currentTime.getMinutes()).slice(-2) +
    ('0' + currentTime.getSeconds()).slice(-2)
}