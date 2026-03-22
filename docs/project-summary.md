# Project Summary – Theatre Rehearsal Calendar Sync

## Overview

Questo progetto automatizza la gestione delle prove teatrali collegando:

* Google Sheets → gestione presenze
* Google Calendar → creazione eventi e notifiche

L'obiettivo è eliminare la gestione manuale del calendario, creando eventi automaticamente quando viene raggiunto un numero minimo di partecipanti.

---

## Funzionalità principali

* Creazione automatica evento se `presenti ≥ soglia`
* Invio inviti agli attori presenti
* Aggiornamento automatico degli invitati
* Cancellazione evento se i presenti scendono sotto soglia
* Nessuna duplicazione eventi
* Gestione configurazione tramite foglio `Settings`

---

## Architettura

```
Google Sheets
    ↓
Apps Script (backend)
    ↓
Google Calendar
```

* Sheets = interfaccia utente
* Apps Script = logica applicativa
* Calendar = notifiche e gestione eventi

---

## Struttura del foglio

### 📅 Calendario Prove

| DATA_ISO | DATA | Attori... | PRESENTI | EVENTO_CREATO | EVENT_ID |
| -------- | ---- | --------- | -------- | ------------- | -------- |

* `DATA_ISO`: data tecnica per script
* `DATA`: data leggibile
* colonne attori: presenza (1 / X)
* `PRESENTI`: totale
* `EVENTO_CREATO`: flag interno
* `EVENT_ID`: id evento Google Calendar

---

### 👥 Attori

| Nome | Email |
| ---- | ----- |

Serve per recuperare gli invitati.

---

### ⚙️ Settings

| KEY              | VALUE |
| ---------------- | ----- |
| CALENDAR_ID      | ...   |
| MIN_PARTECIPANTI | 6     |

Contiene configurazioni dinamiche.

---

## Logica di sincronizzazione

Per ogni riga:

1. Se la data è futura
2. Se `presenti ≥ soglia`
3. Controlla se esiste evento

### Caso 1 – Creazione evento

* crea evento
* invita attori presenti
* salva `EVENT_ID`

### Caso 2 – Aggiornamento evento

* aggiorna titolo
* aggiorna descrizione
* aggiunge nuovi invitati

### Caso 3 – Cancellazione evento

* elimina evento
* pulisce `EVENT_ID`

---

## Gestione eventi

### Creazione

```javascript
calendar.createEvent(...)
```

### Recupero

```javascript
calendar.getEventById(eventId)
```

### Aggiornamento

```javascript
event.setTitle(...)
event.setDescription(...)
event.addGuest(...)
```

### Cancellazione

```javascript
event.deleteEvent()
```

---

## Gestione duplicati

Evitati tramite:

* salvataggio `EVENT_ID`
* controllo esistenza evento
* uso di `LockService` per evitare esecuzioni concorrenti

---

## Trigger automatici

### Metodo consigliato

Trigger temporizzato:

```
syncProveCalendar
→ ogni 5 minuti
```

### Alternativa

`onEdit(e)` → meno stabile, più soggetto a duplicati

---

## Orario eventi

Default:

```
20:30 → 23:55
```

Configurabile nello script.

---

## Problemi affrontati

* duplicazione eventi → risolta con `EVENT_ID` + lock
* gestione invitati → aggiornamento incrementale
* sincronizzazione → trigger automatico
* struttura dati → uso di `DATA_ISO` e `Settings`

---

## Miglioramenti futuri

* rimozione invitati (non solo aggiunta)
* configurazione completa via Settings
* validazione struttura foglio
* UI nel foglio (menu custom)
* logging errori
* multi-calendario

---

## Repository

Il progetto è pubblicato su GitHub e include:

* script Apps Script
* README
* documentazione
* struttura configurabile

---

## Conclusione

Il progetto dimostra come usare strumenti gratuiti per costruire un sistema di scheduling:

* semplice
* automatizzato
* riutilizzabile

È una soluzione leggera ma efficace per gruppi teatrali e organizzazioni simili.
