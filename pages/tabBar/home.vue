<template name="basketball">
	<view class="page">
		<scroll-view style="height: 100%;" scroll-y="true">
			<view class="nav-list">
				<view :url="item.url" class="nav-li" :class="'bg-'+item.color" @tap="navigateTo(item)" v-for="(item,index) in elements"
				 :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'jdcat jdcat-' + item.cuIcon"></text>
				</view>
			</view>
		</scroll-view>

		<user-login :show="show" @close="onClose"></user-login>

	</view>
</template>

<script>
	import userLogin from "@/components/basketball/user-login.vue"
	export default {
		name: "basketball",
		components: {
			userLogin
		},
		data() {
			return {
				show: false,
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
						url: '/pages/home/match/createSingle',
						color: 'cyan',
						cuIcon: 'tongji'
					},
					{
						title: '我的比赛',
						name: 'double',
						url: '/pages/home/match/matchList',
						color: 'orange',
						cuIcon: 'duoren'
					}
				]
			}
		},
		methods: {
			navigateTo(item) {
				let user = this.$store.state.userinfo
				if (!user.isRegisted) {
					this.show = true
					return
				}
				if (!item.url) return;
				uni.navigateTo({
					url: item.url
				})
			},
			onClose: function() {
				this.show = false
			}
		}
	}
</script>

<style>
	.page {
		position: fixed;
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 50upx 40upx 0upx 40upx;
		justify-content: space-between;
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
