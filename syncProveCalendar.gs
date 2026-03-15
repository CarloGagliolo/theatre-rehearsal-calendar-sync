function creaEventiProve() {

  const NUMERO_MINIMO = 6;
  const ss = SpreadsheetApp.getActive();

  const proveSheet = ss.getSheetByName("📅 Calendario Prove");
  const attoriSheet = ss.getSheetByName("👥 Attori");

  const prove = proveSheet.getDataRange().getValues();
  const attori = attoriSheet.getDataRange().getValues();

  // -----------------------
  // SETTINGS
  // -----------------------

  const calendarId = getSetting("CALENDAR_ID");

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    throw new Error("Calendario non trovato: " + calendarId);
  }

  // -----------------------
  // MAP EMAIL ATTORI
  // -----------------------

  const emailMap = {};

  for (let i = 3; i < attori.length; i++) {

    const nome = attori[i][1];
    const email = attori[i][5];

    if (nome && email) {
      emailMap[nome.trim()] = email.trim();
    }

  }

  // -----------------------
  // HEADER
  // -----------------------

  const header = prove[3];

  const colDataISO = header.indexOf("DATA_ISO");
  const colPresenti = header.indexOf("✅ PRESENTI");
  const colEventoCreato = header.indexOf("EVENTO_CREATO");
  const colScena = header.indexOf("SCENA");
  const colEventId = header.indexOf("EVENT_ID");

  // colonne attori = tra DATA e PRESENTI
  const actorStart = 4;
  const actorEnd = colPresenti - 1;

  // -----------------------
  // LOOP PROVE
  // -----------------------

  for (let i = 4; i < 90; i++) {

    const row = prove[i];

    const presenti = row[colPresenti];
    const dataISO = row[colDataISO];
	  let eventId = row[colEventId];						
    const scena = row[colScena];
    const today = new Date();

    if (!dataISO) continue;
    if (dataISO < today) continue;

    if (presenti < NUMERO_MINIMO) continue;

    //if (eventoCreato === "CREATO") continue;

    // -----------------------
    // TROVA PRESENTI
    // -----------------------

    let emails = [];

    for (let c = actorStart; c <= actorEnd; c++) {

      const valore = row[c];

      if (valore === 1 || valore === "✓") {
        const nomeAttore = header[c];
        const email = emailMap[nomeAttore];

        if (email) emails.push(email);
      }
    }

    // -----------------------
    // DATA EVENTO
    // -----------------------

    const start = new Date(dataISO);
    start.setHours(20,30,0);

    const end = new Date(dataISO);
    end.setHours(23,55,0);

    // --------------------------------
    // CASO 1: presenti >=6
    // --------------------------------

	  if (presenti >= NUMERO_MINIMO) {
    // -----------------------
    // CREA EVENTO
    // -----------------------

      if (!eventId) {
        const event = calendar.createEvent(
            "Prova Teatro "+ scena,
            start,
            end,
            {
              guests: emails.join(","),
              sendInvites: true
            }
        );

        // -----------------------
        // SEGNA EVENTO CREATO
        // -----------------------
        eventId = event.getId();
        proveSheet.getRange(i+1, colEventId+1).setValue(eventId);
        proveSheet.getRange(i+1, colEventoCreato+1).setValue("CREATO");
      }
    // -----------------------
    // AGGIORNA EVENTO
    // -----------------------
      else {
        try {
          const event = calendar.getEventById(eventId);
          if (event) {
            const currentGuests = event.getGuestList().map(g => g.getEmail());
            emails.forEach(e => {
              if (!currentGuests.includes(e)) {
                event.addGuest(e);
              }
            });
          }
        } catch(e) {
          Logger.log("evento non trovato");
        }
      }
    }
  
  
	  // --------------------------------
    // CASO 2: presenti <6
    // --------------------------------
    else {
      if (eventId) {
        try {
          const event = calendar.getEventById(eventId);
          if (event) {
            event.deleteEvent();
          }
        } catch(e) {}
        proveSheet.getRange(i+1, colEventId+1).clearContent();
        proveSheet.getRange(i+1, colEventoCreato+1).clearContent();
      }
    }
  }
}

function getSetting(key) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");

  const data = sheet.getDataRange().getValues();

  const calId = String(data[1]).trim();

  return calId;

}