<template>
  <div>
    <view-header :main="false">
      Upcoming Games
    </view-header>
    <div class="content-wrapper">
      <div v-for="game in upcomingGames" :key="`${game.pitch}: ${game.startTime}`" class="game">
        <div class="collapsable" @click="game.active = !game.active">
          <div>{{ game.startTime.replace('T', ' ') }}</div>
          <v-icon>{{ game.active ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </div>
        <transition-expand>
          <shopping-cart-item
            v-if="game.active"
            :itemData="game"
            :displayOnly="true"
          ></shopping-cart-item>
        </transition-expand>
      </div>
    </div>
  </div>
</template>

<script>
import ViewHeader from '@/components/ViewHeader.vue';
import TransitionExpand from '@/components/TransitionExpand.vue';
import ShoppingCartItem from '@/components/ShoppingCartItem.vue';

export default {
  name: 'UpcomingGames',
  data() {
    return {
      upcomingGames: [],
    };
  },
  methods: {
    fetchUpcomingGames() {
      this.$axios.get('/bookinghistory').then((res) => {
        console.log(res.data);
        this.upcomingGames = res.data.map(game => Object.assign(game, { active: false }));
      });
    },
  },
  components: {
    ViewHeader,
    TransitionExpand,
    ShoppingCartItem,
  },
  mounted() {
    this.fetchUpcomingGames();
  },
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  width: 80%;
  margin: 40px auto;

  .game {
    margin-bottom: 20px;
  }

  .collapsable {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    background-color: #e9e9e9;
    border: 1px solid #707070;
    @include montserrat(14px, 500);

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
