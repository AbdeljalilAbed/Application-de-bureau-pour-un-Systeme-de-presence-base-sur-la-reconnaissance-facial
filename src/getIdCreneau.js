function getIdCreneau(jour, horaire) {
  const jours = {
    Samedi: 1,
    Dimanche: 2,
    Lundi: 3,
    Mardi: 4,
    Mercredi: 5,
    Jeudi: 6,
  };

  const slots = [
    [480, 570], // Créneau 1 (08:00 - 09:30)
    [570, 670], // Créneau 2 (09:40 - 11:10)
    [670, 770], // Créneau 3 (11:20 - 12:50)
    [770, 870], // Créneau 4 (13:00 - 14:30)
    [870, 970], // Créneau 5 (14:40 - 16:10)
    [970, 1070], // Créneau 6 (16:20 - 17:50)
  ];

  const jourId = jours[jour];
  if (jourId === undefined) {
    throw new Error("Jour invalide");
  }

  const [startTime, endTime] = horaire.split(" - ");
  const parseTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  let slotId = undefined;
  for (let i = 0; i < slots.length; i++) {
    const [slotStart, slotEnd] = slots[i];
    if (slotStart <= start && slotEnd >= end) {
      slotId = i + 1;
      break;
    }
  }

  if (slotId === undefined) {
    throw new Error("Horaire invalide");
  }

  const idCreneau = `${jourId}${slotId}`;

  return idCreneau;
}

module.exports = getIdCreneau;
