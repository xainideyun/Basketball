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
			<ad unit-id="adunit-9d0b607ab419da4d" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
		</scroll-view>

		<user-login :show="show" @close="onClose"></user-login>
		
		<add-tip tip="「添加到我的小程序」,方便下次访问" v-if="showAddTip" />
		

	</view>
</template>

<script>
	import userLogin from "@/components/basketball/user-login.vue"
	import addTip from "@/components/struggler-uniapp-add-tip/struggler-uniapp-add-tip"
	import {
		mapState
	} from 'vuex'
	export default {
		name: "basketball",
		components: {
			userLogin, addTip
		},
		data() {
			return {
				show: false,
				elements: [{
						title: '约球报名',
						name: '发起约球，方便统计到场人数',
						url: '/pages/yueqiu/baoming/baoming',
						color: 'blue',
						cuIcon: 'yueqiu'
					},
					{
						title: '我的报名',
						name: '记录你的每一次',
						url: '/pages/my/enroll',
						color: 'light-blue',
						cuIcon: 'note'
					},
					{
						title: '统计本队',
						name: '统计得分、篮板、助攻、效率值等数据',
						url: '/pages/home/match/createSingle',
						color: 'cyan',
						cuIcon: 'tongji'
					},
					{
						title: '统计双方',
						name: '统计得分、篮板、正负值、效率值等数据',
						url: '',
						color: 'light-gray',
						cuIcon: 'VS'
					},
					{
						title: '我的比赛',
						name: '查看所有参与的比赛详细信息',
						url: '/pages/home/match/matchList',
						color: 'orange',
						cuIcon: 'duoren'
					},
					{
						title: '我的数据',
						name: '查看个人详细数据，可加标语分享给球友',
						url: '/pages/my/mydata',
						color: 'light-red',
						cuIcon: 'pen'
					},
					{
						title: '操作指引',
						name: '快速熟悉小程序，掌握统计流程',
						url: '/pages/home/match/matchnote',
						color: 'light-zi',
						cuIcon: 'zhiyin'
					}
				]
			}
		},
		computed: mapState({
			showAddTip: 'showAddTip'
		}),
		methods: {
			navigateTo(item) {
				let user = this.$store.state.userinfo
				if (!user.isRegisted) {
					this.show = true
					return
				}
				if (!item.url) {
					uni.showToast({
						icon: 'none',
						title: '功能正在设计，敬请期待'
					})
					return
				}

				uni.navigateTo({
					url: item.url
				})
			},
			onClose: function() {
				this.show = false
			},
			onShareAppMessage: function() {
				return {
					title: '篮球爱好者必备工具',
					path: '/pages/tabBar/home'
				}
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
		font-size: 24upx;
		margin-top: 10upx;
		position: relative;
		line-height: 1.3;
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

	/* 	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}
 */
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

	.bg-light-blue {
		color: #fff;
		background: #82dbff;
	}

	.bg-light-gray {
		color: #fff;
		background-color: #ccc;
	}

	.bg-light-red {
		color: #fff;
		background-color: #fd7e80;
	}

	.bg-light-zi {
		color: #fff;
		background-color: #a7a0fe;
	}
</style>
