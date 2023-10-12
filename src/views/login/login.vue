<template>
  <div class="login-wrapper login-form-left">
    <el-form
      ref="form"
      :rules="rules"
      size="large"
      :model="form"
      class="login-form"
      @keyup.enter.native="doSubmit"
    >
      <!-- <h4>登录信息</h4> -->
      <img class="logo" src="../../assets/logo-login.png" alt="" />
      <el-form-item prop="userName">
        <el-input
          clearable
          v-model="form.userName"
          prefix-icon="el-icon-user"
          placeholder="请输入账号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          v-model="form.password"
          prefix-icon="el-icon-lock"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item prop="verifyCode">
        <!-- <drag-verify
          ref="dragVerify"
          :width="300"
          handlerIcon="el-icon-d-arrow-right"
          successIcon="el-icon-circle-check"
          text="请按住滑块拖动"
          successText="验证通过"
          :isPassing.sync="isPassing"
        >
        </drag-verify> -->
        <div class="login-input-group">
          <el-input
            clearable
            v-model="form.verifyCode"
            prefix-icon="el-icon-_vercode"
            placeholder="请输入验证码"
          />
          <img
            alt=""
            v-if="captcha"
            :src="captcha"
            class="login-captcha"
            @click="changeCaptcha"
          />
        </div>
      </el-form-item>
      <div class="el-form-item">
        <el-button
          size="large"
          type="primary"
          class="login-btn"
          :disabled="!form.verifyCode"
          @click="doSubmit"
        >
          登录
        </el-button>
      </div>
    </el-form>
    <a class="login-copyright" href="https://beian.miit.gov.cn/">
      浙ICP备2022007772号-1
    </a>
  </div>
</template>

<script>
import dragVerify from "vue-drag-verify2";
import setting from "@/config/setting";
import { login, verifyCode } from "../../api/account.js";
import { filterAsyncRoutes } from "@/store/modules/user";
export default {
  name: "Login",
  components: {
    dragVerify
  },
  data() {
    return {
      // 表单数据
      form: {
        userName: "",
        password: "",
        // 验证码相关
        verifyId: "",
        verifyCode: ""
      },
      // 图形验证码
      captcha: "",
      // 滑块验证
      isPassing: false
    };
  },
  created() {},
  computed: {
    // 表单验证规则
    rules() {
      return {
        userName: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        verifyCode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      };
    }
  },
  mounted() {
    if (setting.takeToken()) {
      this.goHome();
    } else {
      this.changeCaptcha();
    }
  },
  methods: {
    /* 提交 */
    async doSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return false;
        }
        try {
          const { data } = await login(this.form);
          console.log(data);
          // 缓存token
          await this.$store.dispatch("user/setToken", {
            token: data.token,
            remember: true
          });
          // 暂时不区分角色，都先用权限代替
          const authorities = data.permissions.map(d => d.label);
          const roles = authorities;
          await this.$store.dispatch("user/setRoles", roles);
          await this.$store.dispatch("user/setAuthorities", authorities);
          let menus = setting.menus || [];

          let accessRoutes = filterAsyncRoutes(menus, roles);
          console.log(menus);
          console.log(accessRoutes);
          if (accessRoutes.length === 0) {
            await this.$confirm(
              `您当前账号暂无权限登陆此系统，请重新登陆`,
              "提示",
              { type: "error" }
            );
            // 清除缓存的token
            await this.$store.dispatch("user/removeToken");
          } else {
            this.goHome();
          }
        } catch (error) {
          this.changeCaptcha();
        }
      });
    },
    /* 跳转到首页 */
    goHome() {
      const query = this.$route.query;
      const path = query && query.from ? query.from : setting.homePath;
      this.$router.push(path).catch(() => {});
    },
    /* 更换图形验证码 */
    async changeCaptcha() {
      const { data } = await verifyCode();
      this.captcha = data.verifyCodeBase64;
      this.form.verifyId = data.verifyId;
    }
  }
};
</script>

<style lang="scss" scoped>
/* 背景 */
.login-wrapper {
  padding: 50px 20px;
  position: relative;
  box-sizing: border-box;
  background-image: url("~@/assets/bg-login.png");
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}

// .login-wrapper:before {
//   content: "";
//   background-color: rgba(0, 0, 0, 0.2);
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
// }

/* 卡片 */
.login-form {
  margin: 0 auto;
  width: 360px;
  max-width: 100%;
  padding: 25px 30px;
  position: relative;
  // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  border-radius: 4px;
  z-index: 2;
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

.login-form h4 {
  text-align: center;
  margin: 0 0 25px 0;
}

.login-form .logo {
  display: block;
  margin: 0 auto 20px;
  width: 320px;
  height: 310px;
}
.login-form > .el-form-item {
  margin-bottom: 25px;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;
}

.login-input-group ::v-deep .el-input {
  flex: 1;
}

.login-captcha {
  height: 38px;
  width: 102px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  text-align: center;
  cursor: pointer;
}

.login-captcha:hover {
  opacity: 0.75;
}

.login-btn {
  display: block;
  width: 100%;
}

/* 底部版权 */
.login-copyright {
  font-weight: bold;
  color: #66974d;
  padding-top: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media screen and (min-height: 550px) {
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -220px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -220px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    bottom: 20px;
    right: 0;
    left: 0;
  }
}

@media screen and (max-width: 768px) {
  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    margin-right: auto;
  }
}
</style>
