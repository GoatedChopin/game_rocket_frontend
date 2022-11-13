<script>
    export let review
    import Card from './Card.svelte'

    function rounded(num) {
        return Math.round(num*100)
    }

    function steamLink(steam_id) {
        return "https://store.steampowered.com/app/" + steam_id
    }

</script>

<Card>
    <div class="num-display">
      {rounded(review.score)}
    </div>
    <div class="steam-link">
        <a href={steamLink(review.game_id)}><img src="steam_icon.png"></a>
    </div>
    <div class="game-name">
        {review.game_name}
    </div>
    <p class="text-display">
      Review:
      <br>
      {review.review_text}
    </p>
</Card>

<style>
    .num-display {
      position: absolute;
      top: -10px;
      left: -10px;
      width: 50px;
      height: 50px;
      background: #ff6a95;
      color: #fff;
      border: 1px #eee solid;
      border-radius: 50%;
      padding: 10px;
      text-align: center;
      font-size: 19px;
    }

    .game-name {
      position: absolute;
      top: -2px;
      left: 40px;
      height: 50px;
      color: #202142;
      padding: 10px;
      text-align: center;
      font-size: 19px;
    }

    .steam-link {
      position: absolute;
      top: 30px;
      left: -9px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      padding: 10px;
      text-align: center;
      font-size: 19px;
    }

    img {
        max-width: 100%; 
        height: auto;
    }

</style>