<template>
  <div>
    <div class="flex">
      <div class="jum">
        <img src="~assets/siiid_logo.svg">
        <p>感動時間の「種」を蒔こう</p>
        <div class="form">
          <form>
            <button type="submit" class="submit">
              <nuxt-link to="timeline">
                Siiid をはじめる
              </nuxt-link>
            </button>
            <p>”Siiidをはじめる”をクリックすると、利用規約とプライバシーに同意したことになります。</p>
          </form>
        </div>
      </div>
    </div>
    <div class="gradation"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Index extends Vue {}
</script>

<style scoped>
button>a {
  color: #FFFFFF;
  text-decoration: none;
  display:block;
}

.flex {
  position: absolute;
  max-width: 800px;
  min-width: 860px;
  height: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  top: 28%;
  left: 0;
  right: 0;
  margin: auto;
  overflow: hidden;
}

.jum {
  min-width: 380px;
  margin-right: 70px;
  color: white;
  text-align: center;
}

.jum p {
  font-size: 150%;
  margin-top: 20px;
  font-weight: 200;
  letter-spacing: 0.3em;
}

.gradation {
  position: absolute;
  padding: 20px;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(30deg, rgba(224, 60, 255, 0.7),rgba(0, 185, 255, 0.7));
}

.form {
  color: white;
}

.form p {
  margin: 7px 0px 0px 2px;
  font-size: 90%;
}

.form a {
  margin: 7px 0px 0px 2px;
  font-size: 90%;
}

.form-group ::placeholder {
  font-size: 90%;
  color: #AEAEAE;
}

.submit {
  font-size: 120%;
  width: 100%;
  padding: 30px;
  border-radius: 4px;
  color: white;
  background: none;
  border: #FFFFFF 1px solid;
  transition-duration: 0.5s;
}

.submit:hover {
  background: rgba(255,255,255,0.3);
  transition-duration: 0.5s;
}
</style>
