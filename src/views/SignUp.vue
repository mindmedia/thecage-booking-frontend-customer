<template>
  <div>
    <view-header>
      THE CAGE <br />
      BOOKING SYSTEM
    </view-header>
    <div class="container">
      <div class="header">Sign Up</div>
      <form @submit.prevent="submit">
        <label for="email">Email</label>
        <br />
        <input id="email" type="text" name="email" />
        <br />
        <label for="name">Name</label>
        <br />
        <input id="name" type="text" name="name" />
        <br />
        <label for="phone">Phone Number</label>
        <br />
        <input id="phone" type="text" name="phone" />
        <br />
        <label for="password">Password</label>
        <br />
        <input id="password" type="password" name="password" />
        <br />
        <div class="actions">
          <input id="submit" type="submit" value="Sign Up" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ViewHeader from '@/components/ViewHeader.vue';

export default {
  name: 'SignUp',
  components: {
    ViewHeader,
  },
  methods: {
    submit() {
      // TODO: submit form data to back end,
      // add jwt token to localstorage,
      // push router back by 1
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  @media screen and (max-width: 400px) {
    width: 100%;
    border-radius: 0px;
    box-shadow: none;
  }

  margin: 40px auto;
  width: 400px;
  padding: 0;
  border-radius: 4px;
  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14),
    0px 5px 22px 4px rgba(0, 0, 0, 0.12);

  .header {
    @media screen and (max-width: 400px) {
      background-color: white;
      color: black;
      padding: 0;
      margin: 16px;
      margin-bottom: 0;
      padding-bottom: 6px;
      border-bottom: 1px solid $secondary;
    }

    background-color: $primary;
    color: white;
    padding: 16px;
    @include montserrat($h3, 600);
  }

  form {
    padding: 16px;

    label {
      @include montserrat($h5, 400);
    }

    input:not(#submit) {
      border: 1px solid $secondary;
      margin-top: 4px;
      margin-bottom: 12px;
      width: 100%;
      padding: 4px 6px;
    }

    .actions {
      overflow: auto;

      #submit {
        background-color: $primary;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        float: right;
        @include montserrat($h4, 500);
        cursor: pointer;
      }
    }
  }
}
</style>