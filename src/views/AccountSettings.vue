<template>
  <div>
    <view-header :main="false">
      Account Settings
    </view-header>
    <form @submit.prevent="submitForm">
      <div class="form-section">
        <p class="section-title">Change Account Details</p>
        <div class="section-container">
          <div class="form-group" :class="{ 'form-group--error': $v.formData.email.$error }">
            <label class="form__label" for="email">Email</label>
            <input
              id="email"
              v-model.lazy="formData.email"
              class="form__input"
              type="email"
              @change="$v.formData.email.$touch"
            />
            <div v-if="$v.formData.email.$error">
              <div v-if="!$v.formData.email.required" class="form__error">
                Field is required.
              </div>
              <div v-if="!$v.formData.email.email" class="form__error">
                Enter a valid email address.
              </div>
            </div>
          </div>
          <div class="form-group" :class="{ 'form-group--error': $v.formData.name.$error }">
            <label class="form__label" for="name">Name</label>
            <input
              id="name"
              v-model.lazy="formData.name"
              class="form__input"
              type="text"
              @change="$v.formData.name.$touch"
            />
            <div v-if="$v.formData.name.$error">
              <div v-if="!$v.formData.name.required" class="form__error">
                Field is required.
              </div>
            </div>
          </div>
          <div class="form-group" :class="{ 'form-group--error': $v.formData.phone.$error }">
            <label class="form__label" for="phone">Phone Number</label>
            <input
              id="phone"
              v-model.lazy="formData.phone"
              class="form__input"
              type="tel"
              @change="$v.formData.phone.$touch"
            />
            <div v-if="$v.formData.phone.$error">
              <div v-if="!$v.formData.phone.required" class="form__error">
                Field is required.
              </div>
              <div v-if="!$v.formData.phone.phoneNumber" class="form__error">
                Enter a valid phone number.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-section">
        <p class="section-title">Change Password</p>
        <div class="section-container">
          <div class="form-group" :class="{ 'form-group--error': $v.formData.oldPassword.$error }">
            <label class="form__label" for="oldPassword">Old Password</label>
            <input
              id="oldPassword"
              v-model.lazy="formData.oldPassword"
              class="form__input"
              type="password"
              @change="$v.formData.oldPassword.$touch"
            />
            <div v-if="$v.formData.oldPassword.$error">
              <div v-if="!$v.formData.oldPassword.ifNewPassword" class="form__error">
                Current password required to change password.
              </div>
            </div>
          </div>
          <div class="form-group" :class="{ 'form-group--error': $v.formData.newPassword.$error }">
            <label class="form__label" for="newPassword">New Password</label>
            <input
              id="newPassword"
              v-model.lazy="formData.newPassword"
              class="form__input"
              type="password"
              @change="$v.formData.newPassword.$touch"
            />
            <div v-if="$v.formData.newPassword.$error">
              <div v-if="!$v.formData.oldPassword.ifOldPassword" class="form__error">
                Enter new password.
              </div>
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'form-group--error': $v.formData.confirmPassword.$error }"
          >
            <label class="form__label" for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model.lazy="formData.confirmPassword"
              class="form__input"
              type="password"
              @change="$v.formData.confirmPassword.$touch"
            />
            <div v-if="$v.formData.confirmPassword.$error">
              <div v-if="!$v.formData.confirmPassword.sameAs" class="form__error">
                Passwords must match.
              </div>
            </div>
          </div>
        </div>
      </div>
      <input id="submit" type="submit" value="Save Changes" />
    </form>
  </div>
</template>

<script>
import {
  required, requiredIf, email, sameAs,
} from 'vuelidate/lib/validators';
import ViewHeader from '@/components/ViewHeader.vue';

const phoneNumber = value => /^$|^[8-9][0-9]{7}$/.test(value);

export default {
  name: 'AccountSettings',
  data() {
    return {
      formData: {
        email: '',
        name: '',
        phone: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    };
  },
  validations: {
    formData: {
      email: {
        required,
        email,
      },
      name: {
        required,
      },
      phone: {
        required,
        phoneNumber,
      },
      oldPassword: {
        ifNewPassword: requiredIf('newPassword'),
      },
      newPassword: {
        ifOldPassword: requiredIf('oldPassword'),
      },
      confirmPassword: {
        sameAsPassword: sameAs('newPassword'),
      },
    },
  },
  components: {
    ViewHeader,
  },
  methods: {
    fetchCustomerData() {
      this.$axios
        .get(`/customer/${this.$store.getters['auth/userId']}`)
        .then((res) => {
          // eslint-disable-next-line no-shadow
          const { email, name } = res.data;
          const phone = res.data.phone_no;
          this.formData.email = email;
          this.formData.name = name;
          this.formData.phone = phone;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const payload = {
          email: this.formData.email,
          name: this.formData.name,
          phoneNo: this.formData.phone,
        };
        if (this.formData.oldPassword && this.formData.newPassword) {
          payload.oldPassword = this.formData.oldPassword;
          payload.newPassword = this.formData.newPassword;
        }
        this.$axios
          .put(`/customer/${this.$store.getters['auth/userId']}`, payload)
          .then((res) => {
            console.log(res);
            this.$notify({
              type: 'success',
              text: 'Your account details have been updated successfully',
            });
          })
          .catch((err) => {
            if (err.response.status === 400) {
              const errorMessage = err.response.data.message;
              if (errorMessage === 'email already exists') {
                this.$notify({
                  type: 'error',
                  title: 'Update failed',
                  text: 'Email already exists.',
                });
              } else if (errorMessage === 'phone_no already exists') {
                this.$notify({
                  type: 'error',
                  title: 'Update failed',
                  text: 'Phone Number already exists.',
                });
              } else if (errorMessage === 'Passwords do not match') {
                this.$notify({
                  type: 'error',
                  title: 'Update failed',
                  text: 'Your old password is incorrect.',
                });
              }
            } else {
              console.error(err);
            }
          });
      }
    },
  },
  mounted() {
    this.fetchCustomerData();
  },
};
</script>

<style lang="scss" scoped>
@include form-group;

form {
  width: 80%;
  max-width: 800px;
  margin: 30px auto 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .form-section {
    margin-bottom: 20px;

    .section-container {
      border: 1px solid black;
      padding: 20px 40px;

      .form__label {
        display: block;
      }

      .form__input {
        width: 100%;
      }
    }
    .form-group:last-child {
      margin-bottom: 0;
    }
  }
}

.section-title {
  @include montserrat($h3, 600);
  margin: 10px 0;
}

#submit {
  background-color: $primary;
  color: white;
  padding: 10px 25px;
  align-self: flex-end;
  float: right;
  @include montserrat($h5, 500);
  cursor: pointer;
  transition: 0.2s linear;
  &:hover {
    background-color: #c85050;
  }
}

@media (max-width: 720px) {
  form {
    width: 95%;
    border-radius: 0px;
    box-shadow: none;
    .form-section .section-container {
      padding: 15px 20px;
    }
  }
}
</style>
