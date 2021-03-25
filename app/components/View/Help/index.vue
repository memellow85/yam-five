<template>
  <section>
    <article>
      <h3>
        <span class="yamicons mdi mdi-help-circle-outline"></span>
        {{ $t('help.title_1') }}
      </h3>
    </article>
    <div class="container-scroller-overlay body-scroll-lock-ignore-inner">
      <p>
        YamFive è un gioco di dadi semplice e divertente. Sfida i tuoi amici per
        rendere più emozionante la partita!
      </p>
      <div class="section-style">
        <h4>Inizia la partita</h4>
        <p>
          Per iniziare una nuova partita vai nella sezione di configurazione e
          inserisci il tuo nome e il nome di una "stanza". Questo nome dovrai
          poi comunicarlo ai tuoi amici così da poter giocare insieme. NB: il
          nome della stanza tiene conto di maniuscole e minuscole quindi
          comunica in maniera corretta il nome ai tuoi amici.
        </p>
      </div>
      <div class="section-style">
        <h4>Il Gioco</h4>
        <p>
          Lo scopo del gioco è ottenere un punteggio più alto possibile tirando
          i 5 dadi e sommando i numeri usciti nelle diverse combinazioni di
          gioco:
        </p>
        <ul class="noHeader">
          <li>
            <span><i>Punteggio di 1:</i> somma degli 1 ottenuti.</span>
          </li>
          <li>
            <span><i>Punteggio di 2:</i> somma dei 2 ottenuti.</span>
          </li>
          <li>
            <span><i>Punteggio di 3:</i> somma dei 3 ottenuti.</span>
          </li>
          <li>
            <span><i>Punteggio di 4:</i> somma dei 4 ottenuti.</span>
          </li>
          <li>
            <span><i>Punteggio di 5:</i> somma dei 5 ottenuti.</span>
          </li>
          <li>
            <span><i>Punteggio di 6:</i> somma dei 6 ottenuti.</span>
          </li>
          <li>
            <span
              ><i>Tiro minimo:</i> somma di tutti i dadi che deve essere
              obbligatoriamente &lt; al punteggio ottenuto nel tiro massimo.
              (ATTENZIONE: Se la somma di tiro minimo e tiro massimo è &gt; 50
              al totale della giocata verranno aggiunti 30 punti bonus).</span
            >
          </li>
          <li>
            <span
              ><i>Tiro massimo:</i> somma di tutti i dadi che deve essere
              obbligatoriamente &gt; al punteggio ottenuto nel tiro minimo.
              (ATTENZIONE: Se la somma di tiro minimo e tiro massimo è &gt; 50
              al totale della giocata verranno aggiunti 30 punti bonus).</span
            >
          </li>
          <li>
            <span
              ><i>Tiro minore o uguale a 11:</i> la somma dei dadi non deve
              essere &gt; di 11.</span
            >
          </li>
          <li>
            <span
              ><i>Full:</i> somma di tutti e 5 i dadi ottenuti con la
              combinazione 3+2: 3 dadi con lo stesso valore + 2 dadi con lo
              stesso valore (diverso da quello degli altri 3). Esempio tiro: 444
              + 22 = Full di 16 punti.</span
            >
          </li>
          <li>
            <span
              ><i>Poker:</i> somma di 4 dadi con lo stesso valore. Esempio tiro:
              4444 + 1 = Poker di 16 punti.</span
            >
          </li>
          <li>
            <span
              ><i>Scala:</i> Somma di 5 dadi con numeri successivi tra loro.
              Esempio tiro: 12345 = scala di 15 punti, oppure 23456 = scala di
              20 punti.</span
            >
          </li>
          <li>
            <span
              ><i>Yam:</i> Somma di 5 dadi con lo stesso valore. Esempio tiro:
              44444 = Yam di 20 punti</span
            >
          </li>
        </ul>
        <p>
          Ad ogni turno di gioco, il/i giocatore/i ha/hanno a disposizione 3
          tiri totali per ottenere l’obiettivo di tiro che ci si è prefissati di
          raggiungere. Per ogni tiro si può decidere se lanciare tutti i dadi
          oppure se tenerne validi alcuni, tenendoli “bloccati”, e rilanciare
          solo gli altri. Una volta conclusi i 3 tiri disponibili si può
          decidere se tenere valido il punteggio ottenuto, indicandone il valore
          nella casella e nella giocata corrispondente, oppure se annullare il
          tiro; in questo caso si dovrà decidere una casella a cui assegnare un
          valore 0. NB: Nelle giocate dall’alto verso il basso e dal basso verso
          l’alto l’annullamento di una casella deve essere fatto seguendo
          l’ordine della giocata. Esempio: nel primo caso si può cancellare la
          giocata successiva all’ultima inserita viceversa nel secondo caso. Il
          gioco si conclude quando il/i giocatore/i conclude/dono tutte le
          caselle delle 4 giocate (dall’alto verso il basso, libero, secco, dal
          basso verso l’alto) seguendo le regole specifiche di ognuna di queste:
        </p>
        <p><i>Giocata 1 - dall’alto verso il basso</i></p>
        <p>
          In questa giocata bisogna completare i valori dei tiri seguendo
          obbligatoriamente l’ordine dall’alto verso il basso:
        </p>
        <ul class="noHeader">
          <li>
            <span><i>Punteggio di 1</i></span>
          </li>
          <li>
            <span><i>Punteggio di 2</i></span>
          </li>
          <li>
            <span><i>Punteggio di 3</i></span>
          </li>
          <li>
            <span><i>Punteggio di 4</i></span>
          </li>
          <li>
            <span><i>Punteggio di 5</i></span>
          </li>
          <li>
            <span><i>Punteggio di 6</i></span>
          </li>
          <li>
            <span><i>Tiro minimo</i></span>
          </li>
          <li>
            <span><i>Tiro massimo</i></span>
          </li>
          <li>
            <span><i>Tiro minore o uguale a 11</i></span>
          </li>
          <li>
            <span><i>Full</i></span>
          </li>
          <li>
            <span><i>Poker</i></span>
          </li>
          <li>
            <span><i>Scala</i></span>
          </li>
          <li>
            <span><i>Yam</i></span>
          </li>
        </ul>
        <p><i>Giocata 2 - libero</i></p>
        <p>
          In questa giocata si possono completare i valori dei tiri senza
          seguire nessun vincolo e nessun ordine particolare, “liberamente”
          appunto.
        </p>
        <p><i>Giocata 3 - secco</i></p>
        <p>
          In questa giocata si possono completare i valori dei tiri senza
          seguire nessun vincolo e nessun ordine particolare a patto che si
          tratti di un punteggio ottenuto al primo lancio dei 3 disponibili per
          ogni turno. Parliamo infatti di un “tiro secco”.
        </p>
        <p><i>Giocata 4 - dal basso verso l’alto</i></p>
        <p>
          In questa giocata - opposta alla giocata dall’ alto verso il basso -
          bisogna completare i valori dei tiri seguendo obbligatoriamente
          l’ordine dal basso verso l’alto:
        </p>
        <ul class="noHeader">
          <li>
            <span><i>Yam</i></span>
          </li>
          <li>
            <span><i>Scala</i></span>
          </li>
          <li>
            <span><i>Poker</i></span>
          </li>
          <li>
            <span><i>Full</i></span>
          </li>
          <li>
            <span><i>Tiro minore o uguale a 11</i></span>
          </li>
          <li>
            <span><i>Tiro massimo</i></span>
          </li>
          <li>
            <span><i>Tiro minimo</i></span>
          </li>
          <li>
            <span><i>Punteggio di 6</i></span>
          </li>
          <li>
            <span><i>Punteggio di 5</i></span>
          </li>
          <li>
            <span><i>Punteggio di 4</i></span>
          </li>
          <li>
            <span><i>Punteggio di 3</i></span>
          </li>
          <li>
            <span><i>Punteggio di 2</i></span>
          </li>
          <li>
            <span><i>Punteggio di 1</i></span>
          </li>
        </ul>
      </div>
      <div class="section-style">
        <h4>Comandi</h4>
        <p>
          <i>Bloccare un dado:</i> cliccare sul dado che si vuole bloccare. Per
          sbloccarlo è sufficiente cliccarci sopra un’altra volta
        </p>
        <p>
          <i>Salvare una giocata:</i> per salvare e dunque segnare un tiro,
          cliccare sul tasto + della singola giocata. In automatico a
          quest’ultima verrà associato il valore ottenuto con il/i tiro/i appena
          effettuati.
        </p>
        <p>
          <i>Cancellare una giocata:</i> per cancellare e dunque annullare un
          tiro, tenere premuto la casella del tiro che si vuole cancellare. A
          questo punto l’icona verrà modificata e, cliccando su di essa, verrà
          associato il valore 0 alla giocata scelta.
        </p>
      </div>
      <div class="section-style">
        <h4>Icone</h4>
        <ul class="noHeader">
          <li>
            <span class="yamicons mdi mdi-cog-outline"></span>
            <span
              >Apre la schermata dov'è possibile partecipare a una partita e
              settare la lingua del gioco.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-view-grid-outline"></span>
            <span
              >Apre la schermata riassuntiva di tutte le giocate, dov'è
              possibile effettuare una giocata o semplicemente visualizzare lo
              schema generale delle giocate.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-chart-line-variant"></span>
            <span
              >Apre la schermata della classifica aggiornata della partita e dei
              record del gioco.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-help-circle-outline"></span>
            <span
              >Apre questa schermata dove trovate tutte le informazioni
              necessarie per giocare.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-sort-bool-ascending-variant"></span>
            <span
              >Giocata a scendere significa che le giocate devo essere segnate
              in ordine descrescente dall'1 allo Yam</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-order-bool-ascending-variant"></span>
            <span
              >Giocata libera significa che le giocate posso essere segnate
              senza nessun ordine.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-target"></span>
            <span
              >Giocata secca significa che le giocate posso essere segnate solo
              al primo lancio dei dadi.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-sort-bool-descending-variant"></span>
            <span
              >Giocata a salire significa che le giocate devo essere segnate in
              ordine crescente dallo Yam all'1.</span
            >
          </li>
          <li>
            <span class="yamicons mdi mdi-trash-can-outline"></span>
            <span>Cancella la giocata e assegna il valore di 0.</span>
          </li>
          <li>
            <span class="yamicons mdi mdi-plus-box-outline"></span>
            <span
              >Salva la giocata segnando il valore della specifica
              giocata.</span
            >
          </li>
        </ul>
      </div>
      <div class="section-style">
        <h4>I punti bonus</h4>
        <p>
          Ai punteggi ottenuti con i dadi, in ogni giocata, vengono assegnati
          dei punti bonus che il giocatore riceve se:
        </p>
        <ul class="noHeader">
          <li>
            <span
              ><i
                >La somma dei tiri singoli da 1 a 6 di una giocata è >= 60, al
                totale della giocata vengono aggiunti 20 punti bonus. Se questa
                stessa somma è >= 70 al totale della giocata vengono aggiunti 30
                punti bonus.</i
              ></span
            >
          </li>
          <li>
            <span
              ><i
                >La somma di tiro minimo e tiro massimo è > 50, al totale della
                giocata vengono aggiunti 30 punti bonus.</i
              ></span
            >
          </li>
        </ul>
        <p>
          Inoltre per i seguenti tiri, segnati come validi e dunque con valore
          diverso da 0, al raggiungimento dell’obiettivo di tiro viene assegnato
          uno speciale bonus che si aggiunge al punteggio ottenuto con il lancio
          dei dadi:
        </p>
        <ul class="noHeader">
          <li>
            <span
              ><i>Tiro minore e uguale a 11:</i> al totale del tiro vengono
              aggiunti 30 punti bonus.</span
            >
          </li>
          <li>
            <span
              ><i>Full:</i> al totale del tiro vengono aggiunti 20 punti
              bonus.</span
            >
          </li>
          <li>
            <span
              ><i>Poker:</i> al totale del tiro vengono aggiunti 30 punti bonus.
            </span>
          </li>
          <li>
            <span
              ><i>Scala:</i> al totale del tiro vengono aggiunti 40 punti bonus.
            </span>
          </li>
          <li>
            <span
              ><i>Yam:</i> al totale del tiro vengono aggiunti 50 punti
              bonus.</span
            >
          </li>
        </ul>
        <p>
          I punti bonus vengono calcolati dal sistema e inseriti automaticamente
          al valore totale di una giocata.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Help',
  mounted() {
    document.querySelector('.body-scroll-lock-ignore-inner').addEventListener(
      'touchmove',
      function (event) {
        event.stopPropagation()
      },
      { passive: false }
    )
  },
}
</script>

<style lang="scss" scoped>
section {
  @include padding(15px);
  article {
    h3 {
      @include margin(null null 10px);
    }
  }
  p {
    @include margin(null null 20px);
    line-height: 1.5;
  }
  .container-scroller-overlay {
    .section-style {
      @include margin(null null 20px);
      p {
        @include margin(null null 5px);
      }
      ul {
        @include margin(null null 5px);
      }
    }
    ul {
      @include margin(null null 20px);
      li {
        @include size(100%, auto);
        @include margin(null null 5px null);
        justify-content: flex-start;
        border: 0;
        span {
          line-height: 1.5 !important;
        }
        .yamicons {
          @include margin(null 5px null null);
          &:before {
            @include font-size(18px, 1);
          }
        }
      }
    }
  }
}
</style>
