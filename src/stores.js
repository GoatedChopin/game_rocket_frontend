import { readable, writable } from 'svelte/store'

export const FeedbackStore = writable([
  {
    id: 1,
    rating: 10,
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. consequuntur vel vitae commodi alias voluptatem est voluptatum ipsa quae.',
  },
  {
    id: 2,
    rating: 9,
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. consequuntur vel vitae commodi alias voluptatem est voluptatum ipsa quae.',
  },
  {
    id: 3,
    rating: 8,
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. consequuntur vel vitae commodi alias voluptatem est voluptatum ipsa quae.',
  },
])

export const GameAttributes = readable([
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
])