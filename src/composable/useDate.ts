const useDate = () => {
  const getHourUTC = (hour: string) => {
    const localTime = hour;
    const date = new Date();

    const [hours, minutes] = localTime.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    return `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`;
  }

  const getHourLocale = (hour: string) => {
    const [utcHours, utcMinutes] = hour.split(':').map(Number);
    const utcDate = new Date(Date.UTC(2024, 0, 1, utcHours, utcMinutes));

    const localHours = utcDate.getHours();
    const localMinutes = utcDate.getMinutes();

    return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`;
  }

  return {
    getHourUTC,
    getHourLocale
  }
}

export default useDate;
