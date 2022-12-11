

  <script>
    import MultiSelect from 'svelte-multiselect'
    // import { empty } from 'svelte/internal';
    import {GameReviews} from '../stores'
    const attrs = [
                'fun',
                'story',
                'gameplay',
                'graphics',
                'combat',
                'easy',
                'characters',
                'music',
                'world',
                'interesting',
                'simple',
                'short',
                'mechanics',
                'achievements',
                'difficulty',
                'puzzles',
                'friends',
                'fast',
                'original',
                'unique',
                'community',
                'space',
                'beautiful',
                'challenging',
                'strategy',
                'soundtrack',
                'fps',
                'funny',
                'horror',
                'dungeon',
                'shooter',
                'atmosphere',
                'crafting',
                'guns',
                'simulator',
                'upgrades',
                'zombies',
                'adventure',
                'casual',
                'monsters',
                'grinding',
                'satisfying',
                'magic',
                'deep',
                'sad',
                'platformer',
                'animation',
                'fantasy',
                'customization',
                'exploration',
                'addictive',
                'tactical',
                'polished'
                ]

    let positives_selected = []
    let negatives_selected = []
    let sentiment = true
    let recommendation = true
    let game_rocket_api = 'https://api.gamerocket.com/recommend'
    let result = null

    function addOption(opt, array) {
        array.push(opt)
    }

    function emptyArray(array) {
        array = []
    }

    async function doPost () {
      const res = await fetch('https://3.80.214.160:8000/recommend', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
                  "n_reviews": 5,
                  "positives": positives_selected,
                  "negatives": negatives_selected,
                  "author_recommended_game": recommendation,
                  "sentiment": sentiment
        })
		})
		
		const json = await res.json()
    console.log(json)
		result = JSON.stringify(json)
    console.log(result)
    GameReviews.update((currentFeedback) => {
          return json
      })
	  }
  </script>
  
  <p>Qualities you want?</p>
  <MultiSelect 
    --sms-options-bg="#333" 
    bind:positives_selected options={attrs}
    on:change={(e) => {
        if (e.detail.type === 'add') addOption(e.detail.option, positives_selected)
        if (e.detail.type === 'remove') (positives_selected.splice(positives_selected.indexOf(e.detail.Option), 1))
        if (e.detail.type === 'removeAll') (positives_selected = [])
      }}
   />
  <br>
  <p>Qualities you don't want?</p>
  <MultiSelect 
    --sms-options-bg="#333" 
    bind:negatives_selected 
    options={attrs}
    on:change={(e) => {
        if (e.detail.type === 'add') addOption(e.detail.option, negatives_selected)
        if (e.detail.type === 'remove') (negatives_selected.splice(negatives_selected.indexOf(e.detail.Option), 1))
        if (e.detail.type === 'removeAll') (negatives_selected = [])
      }} 
  />
  <br>
  <p>
    I care about review sentiment  
    <input type=checkbox bind:checked={sentiment}>
  </p>
  <p>
    I care whether or not the author recommended the game
    <input type=checkbox bind:checked={recommendation}>
  </p>
  <header>
    <p>
        <button on:click={doPost}>
            <p>Find Reviews</p>
        </button>
    </p>
  </header>

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