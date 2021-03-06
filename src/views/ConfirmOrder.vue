<template>
  <div>
    <view-header :main="false">
      Validate Booking Order
    </view-header>
    <div class="content-wrapper">
      <shopping-cart-item
        v-for="(item, index) in cartItems"
        :key="index"
        :itemData="item"
        :displayOnly="true"
      ></shopping-cart-item>
      <div class="bottom-wrapper">
        <div class="left">
          <div class="payment">
            <span class="title">Payment method:</span>
            <div>
              <input id="paypal" type="radio" name="payment" value="Paypal" checked />
              <img src="../assets/paypal_logo.png" />
            </div>
          </div>
          <div class="billing">
            <span class="title">Bill to:</span>
            <span>{{ customer.name }}</span>
            <span><v-icon class="contact-icon">mdi-phone</v-icon>{{ customer.phone }}</span>
            <span><v-icon class="contact-icon">mdi-email</v-icon>{{ customer.email }}</span>
            <a href="">Change address ></a>
          </div>
        </div>
        <div class="right">
          <span>Total: ${{ total.toFixed(2) }}</span>
          <span style="font-size:14px;font-weight:400">Taxes(included): ${{ tax.toFixed(2) }}</span>
          <div
            id="paypal-button"
            :style="{ visibility: paymentSuccess ? 'hidden' : 'visible' }"
          ></div>
        </div>
      </div>
    </div>
    <div class="modal" :class="{ 'show-modal': paymentSuccess && !modalClosed }">
      <div class="modal-content">
        <div class="modal-top">
          <v-icon class="success-icon" color="white">mdi-check-circle-outline</v-icon>
        </div>
        <div class="modal-bottom">
          <p>Your payment is completed successfully. Thank you.</p>
          <button class="close-button" @click="closeModal">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewHeader from '@/components/ViewHeader.vue';
import ShoppingCartItem from '@/components/ShoppingCartItem.vue';

export default {
  name: 'ConfirmOrder',
  data() {
    return {
      cartItems: [],
      paymentSuccess: false,
      modalClosed: false,
      customer: {
        name: '',
        phone: '',
        email: '',
      },
    };
  },
  methods: {
    fetchCustomerData() {
      this.$axios
        .get(`/customer/${this.$store.getters['auth/userId']}`)
        .then((res) => {
          // eslint-disable-next-line no-shadow
          const { email, name } = res.data;
          const phone = res.data.phone_no;
          this.customer.name = name;
          this.customer.phone = phone;
          this.customer.email = email;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchCartItems() {
      this.$axios
        .get('/cartitem')
        .then((res) => {
          console.log(res);
          this.cartItems = res.data.items;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    renderPaypalButton() {
      const vm = this;
      this.$loadScript('https://www.paypalobjects.com/api/checkout.js').then(() => {
        const CREATE_PAYMENT_URL = `${process.env.VUE_APP_API}/payment`;
        const EXECUTE_PAYMENT_URL = `${process.env.VUE_APP_API}/execute`;
        window.paypal.Button.render(
          {
            env: 'sandbox',
            commit: 'true',
            payment() {
              return window.paypal.request
                .post(
                  CREATE_PAYMENT_URL,
                  {},
                  { headers: { Authorization: `Bearer ${vm.$store.state.auth.token}` } },
                )
                .then(data => data.paymentID);
            },
            onAuthorize(data) {
              return window.paypal.request
                .post(
                  EXECUTE_PAYMENT_URL,
                  {
                    paymentID: data.paymentID,
                    payerID: data.payerID,
                  },
                  { headers: { Authorization: `Bearer ${vm.$store.state.auth.token}` } },
                )
                .then((res) => {
                  console.log(res.success);
                  // The payment is complete!
                  // You can now show a confirmation message to the customer
                  vm.$store.dispatch('timer/clearTimer');
                  vm.paymentSuccess = true;
                })
                .catch((err) => {
                  vm.$notify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was a problem resolving your payment',
                  });
                  console.log(err);
                });
            },
          },
          '#paypal-button',
        );
      });
    },
    closeModal() {
      this.modalClosed = true;
      this.$router.push('/');
    },
  },
  computed: {
    tax() {
      return this.$store.state.cart.cartTax;
    },
    total() {
      return this.$store.state.cart.cartTotal;
    },
  },
  components: {
    ViewHeader,
    ShoppingCartItem,
  },
  mounted() {
    if (!this.total) {
      this.$router.push('/cart');
    }
    this.fetchCartItems();
    this.fetchCustomerData();
    this.renderPaypalButton();
  },
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 40px auto;

  .bottom-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;

    .payment {
      margin-bottom: 40px;
      font-family: "Montserrat" !important;
      .title {
        @include montserrat($h3, 400);
        font-family: "Montserrat" !important;
        font-size: 18px !important;
        font-weight: 500;
        display: block;
      }
      div {
        margin-top: 10px;
      }
      img {
        max-width: 100px;
        vertical-align: middle;
        margin-left: 20px;
      }
    }

    .billing {
      .title {
        @include montserrat($h3, 500);
        font-family: "Montserrat" !important;
        margin-bottom: 10px;
      }
      .contact-icon {
        font-size: 18px;
        margin-right: 15px;
      }
      span {
        @include montserrat($h5, 400);
        margin-bottom: 5px;
        display: block;
      }
      a {
        text-decoration: none;
        transition: 0.2s linear;
        display: block;
        margin-top: 10px;
        @include montserrat($h4, 400);
        &:hover {
          color: #c85050;
        }
      }
    }

    .right {
      text-align: right;
      @include montserrat($h3, 500);
      span {
        display: block;
      }
    }
  }
}

@media (max-width: 720px) {
  .content-wrapper {
    width: 95%;
    .bottom-wrapper {
      display: block;
      .right {
        margin-top: 40px;
      }
    }
  }
}

.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24rem;
  border-radius: 0.5rem;
  text-align: center;
}

.modal-top {
  background-color: #47c9a2;
  padding: 24px;

  .success-icon {
    font-size: 96px;
  }
}

.modal-bottom {
  background-color: white;
  @include montserrat($h5, 400);
  padding: 32px;
  display: block;

  .close-button {
    padding: 8px 32px;
    background-color: #47c9a2;
    color: white;
    transition: 0.2s linear;

    &:hover {
      background-color: #2db189;
    }
  }
}
.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
</style>
