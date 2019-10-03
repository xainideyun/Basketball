<template name="basketball">
	<view class="page">
		<!-- <image src="../../static/basketball.jpg" mode="widthFix" class="response"></image> -->
		<view class="nav-list">
			<view :url="item.url" class="nav-li" :class="'bg-'+item.color" @tap="navigateTo(item)"
			 v-for="(item,index) in elements" :key="index">
				<view class="nav-title">{{item.title}}</view>
				<view class="nav-name">{{item.name}}</view>
				<text :class="'jdcat jdcat-' + item.cuIcon"></text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "basketball",
		data() {
			return {
				elements: [{
						title: '约球报名',
						name: 'start',
						url: '/pages/yueqiu/baoming/baoming',
						color: 'blue',
						cuIcon: 'yueqiu'
					},
					{
						title: '统计本队',
						name: 'statistics',
						url: '/pages/yueqiu/activity/activity',
						color: 'cyan',
						cuIcon: 'tongji'
					},
					{
						title: '统计双方',
						name: 'double',
						url: '/pages/yueqiu/activity/join',
						color: 'orange',
						cuIcon: 'duoren'
					}
				]
			}
		},
		onShow() {

		},
		methods: {
			navigateTo(item) {
				let user = uni.getStorageSync('userinfo');
				if (!user.isRegisted) {
					uni.showModal({
						title: '提示',
						content: '请先登录系统',
						confirmText: '去登陆',
						success(res) {
							if (!res.confirm) return;
							uni.switchTab({
								url: '/pages/tabBar/self'
							})
						}
					})
					return;
				}
				if (!item.url) return;
				uni.navigateTo({
					url: item.url
				})
			}
		}
	}
</script>

<style>
	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
		margin-top: 50upx;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 36%;
		margin: 0 2.5% 40upx;
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}
</style>
