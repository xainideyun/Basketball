<script>
	import config from '@/config'
	export default {
		globalData: {

		},
		onLaunch: function() {
			var version = uni.getStorageSync("version")
			if (config.version !== version) {		// 如果版本号不一致，则清除本地缓存
				uni.clearStorageSync()
				uni.setStorageSync("version", config.version)
			}
			this.$store.dispatch('login')

		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import "app.scss";

	.page {
		width: 100%;
		height: 100vh;
		background-color: #f7f7f7;
	}
</style>
