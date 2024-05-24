function getIdCreneau() {
  // Obtenir la date actuelle
  const currentDate = new Date();
  // Récupérer le jour de la semaine (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
  const currentDay = currentDate.getDay() === 6 ? 1 : currentDate.getDay() + 2; // Ajouter 1 car les jours commencent à 1

  let slotID = -1;

  if (currentDay >= 1 && currentDay <= 6) {
    // Si le jour est un jour de semaine (lundi à vendredi)
    const totalMinutes = currentDate.getHours() * 60 + currentDate.getMinutes(); // Convertir l'heure en minutes

    // Calculer l'ID du créneau en fonction de l'heure actuelle
    // const slots = [1, 2, 3, 4, 5, 6]; // ID des créneaux de 1 à 6
    const slots = [
      [480, 570], // Créneau 1 (08:00 - 09:30)
      [570, 670], // Créneau 2 (09:40 - 11:10)
      [670, 770], // Créneau 3 (11:20 - 12:50)
      [770, 870], // Créneau 4 (13:00 - 14:30)
      [870, 970], // Créneau 5 (14:40 - 16:10)
      [970, 1070], // Créneau 6 (16:20 - 17:50)
    ];

    // Trouver le créneau correspondant
    for (let i = 0; i < slots.length; i++) {
      const [start, end] = slots[i];
      if (totalMinutes >= start && totalMinutes <= end) {
        slotID = `${currentDay}${i + 1}`; // Concaténer le jour de la semaine avec l'ID du créneau
      }
    }
  }

  return slotID;
}

module.exports = getIdCreneau; // Exporter la fonction getIdCreneau
