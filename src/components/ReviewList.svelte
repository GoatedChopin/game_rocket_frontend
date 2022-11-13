<script>
    import {GameReviews} from '../stores'
    import { fade, scale } from 'svelte/transition'
    import ReviewItem from './ReviewItem.svelte';
  </script>
  
  {#each $GameReviews as review (review.game_id)}
    <div in:scale out:fade="{{ duration: 500 }}">
      <ReviewItem review={review} />
    </div>
  {/each}