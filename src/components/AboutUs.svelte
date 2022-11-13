<script>
    import { get_all_dirty_from_scope } from "svelte/internal";
import Card from "./Card.svelte";
    let visible = false
    function toggleAbout() {
        visible = !visible
    }
</script>

<Card>
    <header>
        <h2>
            <button on:click={toggleAbout}>
                <p>About Game Rocket</p>
            </button>
        </h2>
    </header>

    {#if visible}
        <p>
            Game Rocket is a game recommendation algorithm constructed using natural language Processing with Spacy (Python) and 42,000 Steam reviews across 5,000 games. 
        </p>
        <br>
        <p>
            Each review has been analyzed for similarity with 51 separate descriptors and features commonly used to talk about games. 
        </p>
        <br>
        <p>
            Using sentiment analysis from Vader (Python), the satisfaction of each reviewer in each review has been approximated.
        </p>
        <br>
        <p>
            In short, Game Rocket uses machine learning to help users find games that match their preferences.
        </p>
    {/if}
</Card>

<style>
    header {
      max-width: 400px;
      margin: auto;
    }
  
    header h2 {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
    }

    button {
      margin: auto;
      /* align-self: auto; */
      border: 0;
      border-radius: 8px;
      color: #202142;
      width: 100px;
      height: 40px;
      cursor: pointer;
    }
  
    button:hover {
      transform: scale(0.98);
      opacity: 0.9;
    }

    p {
      text-align: center;
    }
</style>