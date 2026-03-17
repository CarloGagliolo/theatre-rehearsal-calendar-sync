# Gestione prove teatrali con Google Sheets e Google Calendar

## Descrizione

Questo progetto permette di gestire le presenze a prove teatrali tramite **Google Sheets** e creare automaticamente gli eventi su **Google Calendar**.

Quando il numero di partecipanti a una prova raggiunge una soglia minima (es. 6 persone), lo script:

* crea automaticamente un evento su Google Calendar
* invita gli attori presenti
* aggiorna la lista invitati se cambiano le presenze
* cancella l’evento se il numero di partecipanti scende sotto la soglia
* evita la creazione di eventi duplicati

La soluzione è pensata per gruppi teatrali, associazioni o piccoli team che vogliono coordinare incontri senza gestire manualmente il calendario.

La sincronizzazione avviene tramite **Google Apps Script**, integrato direttamente nel foglio Google Sheets.

---

# Funzionalità

* Creazione automatica evento quando i presenti raggiungono la soglia
* Invio automatico degli inviti agli attori presenti
* Aggiornamento automatico degli invitati
* Eliminazione dell’evento se i partecipanti scendono sotto la soglia
* Nessuna creazione di eventi duplicati
* Configurazione tramite foglio Settings

---

## Quick start

1. Copia il template Google Sheet
2. Apri Extensions → Apps Script
3. Incolla il codice
4. Inserisci il CALENDAR_ID nel foglio Settings
5. Crea un trigger automatico (5 minuti)

---

# Struttura del Google Sheet

Il foglio contiene tre tab principali.

## 1. Calendario Prove

Contiene il calendario delle prove e le presenze.

Esempio struttura:

| DATA_ISO | DATA | Attore1 | Attore2 | Attore3 | ... | PRESENTI | EVENTO_CREATO | EVENT_ID |
| -------- | ---- | ------- | ------- | ------- | --- | -------- | ------------- | -------- |

Spiegazione colonne:

* **DATA_ISO** → data in formato ISO utilizzata dallo script
* **DATA** → data leggibile per gli utenti
* **colonne attori** → presenza indicata con `✓` o simile
* **PRESENTI** → numero totale dei presenti
* **EVENTO_CREATO** → flag tecnico
* **EVENT_ID** → ID dell’evento nel calendario

---

## 2. Attori

Contiene la lista degli attori e le loro email.

Esempio:

| NOME         | EMAIL                                     |
| ------------ | ----------------------------------------- |
| Mario Rossi  | [mario@email.com](mailto:mario@email.com) |
| Luca Bianchi | [luca@email.com](mailto:luca@email.com)   |

Le email vengono usate per inviare gli inviti agli eventi.

---

## 3. Settings

Contiene i parametri di configurazione.

Esempio:

| KEY              | VALUE                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| CALENDAR_ID      | [calendario@group.calendar.google.com](mailto:calendario@group.calendar.google.com) |
| MIN_PARTECIPANTI | 6                                                                                   |

---

# Installazione passo passo

## 1. Creare il Google Sheet

Creare un nuovo foglio Google Sheets e aggiungere i tre tab:

* Calendario Prove
* Attori
* Settings

Compilare i dati come indicato sopra.

---

## 2. Recuperare il Calendar ID

Aprire Google Calendar.

1. Aprire **Impostazioni calendario**
2. Selezionare il calendario da usare
3. Aprire la sezione **Integra calendario**
4. Copiare il campo **ID calendario**

Inserire l'ID nel foglio **Settings**.

---

## 3. Aprire Google Apps Script

Nel foglio Google Sheets:

```
Estensioni → Apps Script
```

Creare un nuovo file script e incollare il codice del progetto.

Salvare il file.

---

## 4. Autorizzare lo script

Eseguire la funzione principale una volta manualmente.

Google chiederà le autorizzazioni per:

* leggere il foglio
* gestire Google Calendar

Accettare le autorizzazioni.

---

## 5. Configurare il trigger automatico

Per sincronizzare automaticamente calendario e foglio:

1. Aprire **Apps Script**
2. Aprire la sezione **Triggers**
3. Creare un nuovo trigger

Configurazione consigliata:

* funzione: `syncProveCalendar`
* tipo trigger: **time driven**
* frequenza: **ogni 5 minuti**

Questo aggiornerà automaticamente il calendario quando cambiano le presenze.

---

# Logica di funzionamento

Lo script esegue i seguenti controlli per ogni riga del foglio:

1. Se la data è futura
2. Se il numero di presenti è maggiore o uguale alla soglia
3. Se esiste già un evento collegato

### Caso 1

presenti ≥ soglia
→ crea evento
→ invita gli attori presenti

### Caso 2

evento esistente e cambiano le presenze
→ aggiorna gli invitati

### Caso 3

presenti < soglia
→ cancella l’evento

---

# Orario delle prove

Gli eventi vengono creati automaticamente con questo orario:

20:30 → 23:55

Questo valore può essere modificato nello script.

---

# Vantaggi della soluzione

* nessun costo
* nessuna infrastruttura server
* gestione semplice tramite foglio condiviso
* notifiche automatiche tramite Google Calendar

---

## Limitazioni

- non gestisce eventi ricorrenti
- rimozione invitati limitata dalle API Google
- struttura colonne non deve essere modificata


---


# Possibili miglioramenti

* configurazione completa tramite foglio Settings
* gestione di più gruppi o calendari
* interfaccia semplificata per inserimento presenze
* dashboard riepilogo prove

---

# Licenza

Questo progetto è distribuito con licenza MIT.

Può essere liberamente usato, modificato e redistribuito.
