<template>
  <div>
    <base-dialog :show="!!error" title="Error Occured" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" fixed title="Authenticating...">
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-mail</label>
          <input type="emial" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password. Password mus be atleast 6
          characters long
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="swithAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      formIsValid: true,
      mode: "login",
      isLoading: false,
      error: null,
    };
  },
  computed: {
    submitButtonCaption() {
      return this.mode === "login" ? "Login" : "Signup";
    },
    switchModeButtonCaption() {
      return this.mode === "login" ? "Signup instead" : "Login instead";
    },
  },
  methods: {
    async submitForm() {
      this.formIsValid = true;
      if (
        this.email === "" ||
        !this.email.includes("@") ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      const actionPayload = {
        email: this.email,
        password: this.password,
      };

      try {
        this.isLoading = true;
        // send http requests
        this.mode === "login"
          ? await this.$store.dispatch("login", actionPayload)
          : await this.$store.dispatch("signup", actionPayload);

        const redirect = "/" + (this.$route.query.redirect || "coaches");
        this.$router.replace(redirect);
      } catch (error) {
        this.error = error.message || "Failed to authenticate, Try again later";
      }

      this.isLoading = false;
    },
    swithAuthMode() {
      this.mode === "login" ? (this.mode = "signup") : (this.mode = "login");
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;

  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
