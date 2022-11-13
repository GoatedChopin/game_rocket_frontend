<script>
    import Card from "./Card.svelte";


</script>

<Card>
    <header>
        <h1>
            Game Rocket
        </h1>
        <h2>
            A crowdsourced recommendation engine for video games
        </h2>
    </header>

</Card>


<style>
    header {
      max-width: 400px;
      margin: auto;
    }

    h1 {
        text-align: center;
    }
  
    header h2 {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
    }
</style>