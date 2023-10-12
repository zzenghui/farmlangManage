<!-- 顶栏右侧区域按钮 -->
<template>
	<div class="ele-admin-header-tool">
    <div class="ele-admin-header-tool-item">
      <el-tooltip
        effect="dark"
        content="返回上一页"
        placement="right-start"
      >
        <a style="text-decoration: none;width:20px;height: 100%;line-height: 60px;" href="javascript:history.back()">
          <i class="el-icon-back" style="color:gray"></i>
        </a>
      </el-tooltip>

    </div>
<!--    <div class="ele-admin-header-tool-item">-->
<!--      <el-tooltip-->
<!--        effect="dark"-->
<!--        content="返回下一页"-->
<!--        placement="right-start"-->
<!--      >-->
<!--        <a style="text-decoration: none;" href="javascript:history.go(1)">＞</a>-->
<!--      </el-tooltip>-->
<!--    </div>-->
		<div class="ele-admin-header-tool-item" @click="toggleFullscreen">
			<i :class="isFullscreen?'el-icon-_screen-restore':'el-icon-_screen-full'"></i>
		</div>
		<div class="ele-admin-header-tool-item">
			<el-dropdown @command="onUserDropClick">
				<div class="ele-admin-header-avatar">
					<el-avatar :src="loginUser.avatar ? loginUser.avatar : require('@/assets/avatar.png')" />
					<span>{{ loginUser.name }}</span>
					<i class="el-icon-arrow-down"></i>
				</div>
				<el-dropdown-menu slot="dropdown">
					<!-- <el-dropdown-item command="user" icon="el-icon-user">个人中心
					</el-dropdown-item> -->
					<el-dropdown-item command="logout" icon="el-icon-switch-button" divided>退出登录
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<!-- 语言切换 -->
		<!-- <div class="ele-admin-header-tool-item">
      <el-dropdown @command="onChangeLanguage" style="vertical-align: 0;">
        <div class="ele-admin-header-avatar">
          <span>{{ $t('headerRight.language') }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="en">English
          </el-dropdown-item>
          <el-dropdown-item
            command="zh">中文
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
		<!-- 主题设置 -->
		<div class="ele-admin-header-tool-item" v-if="showSetting" @click="openSetting">
			<i class="el-icon-_more"></i>
		</div>
	</div>
</template>

<script>
	import {
		logout
	} from '../api/account';

	export default {
		name: 'EleHeaderRight',
		// components: {EleNotice},
		props: {
			// 是否显示打开设置抽屉按钮
			showSetting: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			// 当前登录用户信息
			loginUser() {
				return this.$store.state.user.user.user;
			}
		},
		data() {
			return {
				// 是否全屏状态
				isFullscreen: false
			};
		},
		created() {
			console.log('this.$i18n.locale：', this.$i18n.locale);
		},
		methods: {
			onChangeLanguage(command) {
				console.log('command：', command);
			},
			/* 个人信息下拉菜单点击 */
			onUserDropClick(command) {
				if (command === 'user') {
					this.$router.push('/user/info');
				} else if (command === 'password') {
					this.$emit('item-click', 'password');
				} else if (command === 'logout') {
					// 退出登录
					this.$confirm(
						'确定要退出登录吗?',
						'提示', {
							type: 'warning'
						}
					).then(() => {
						// 清除缓存的token
						this.$store.dispatch('user/removeToken').then(() => {
							this.$router.push('/login')
						});
					}).catch(() => {});
				}
			},
			/* 打开设置抽屉 */
			openSetting() {
				this.$emit('item-click', 'setting');
			},
			/* 全屏切换 */
			toggleFullscreen() {
				try {
					this.isFullscreen = this.$util.toggleFullscreen();
				} catch (e) {
					this.$message.error('您的浏览器不支持全屏模式');
				}
			}
		}
	}
</script>
