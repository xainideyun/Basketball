<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		globalData: {
			
		},
		onLaunch: function() {
			// let userinfo = uni.getStorageSync("userinfo");
			// if (!userinfo) {
			// 	uni.login({
			// 		provider: 'weixin',
			// 		success: function(loginRes) {
			// 			http.get('/user?code=' + loginRes.code)
			// 				.then(res => {
			// 					uni.setStorageSync("userinfo", res.data.result);
			// 				})
			// 		}
			// 	})
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
